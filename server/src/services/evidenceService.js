import { Evidence } from '../models/Evidence.js';
import { Complaint } from '../models/Complaint.js';
import { AuditLog } from '../models/AuditLog.js';
import { LocalStorageProvider } from '../providers/storage/LocalStorageProvider.js';
import { S3StorageProvider } from '../providers/storage/S3StorageProvider.js';
import { config } from '../config/env.js';
import { NotFoundError, AuthorizationError, FileUploadError } from '../utils/errors.js';

let storageProviderInstance = null;

export const getStorageProvider = () => {
  if (!storageProviderInstance) {
    if (config.storage.provider === 's3') {
      storageProviderInstance = new S3StorageProvider();
    } else {
      storageProviderInstance = new LocalStorageProvider();
    }
  }
  return storageProviderInstance;
};

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'audio/webm',
  'audio/wav',
  'audio/mpeg',
  'video/mp4',
  'video/webm',
];

const determineEvidenceType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  if (mimeType === 'application/pdf') return 'DOCUMENT';
  return 'DOCUMENT';
};

export const uploadEvidence = async ({
  complaintId,
  file,
  user,
  description = '',
  isSensitive = false,
}) => {
  if (!file) {
    throw new FileUploadError('No file provided for upload.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new FileUploadError(`Unsupported file type: ${file.mimetype}. Allowed: Images (JPG/PNG/WEBP), PDF documents, Audio (WEBM/WAV/MP3), and Videos (MP4/WEBM).`);
  }

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new NotFoundError('Complaint');
  }

  // Authorization: citizen must own the complaint, or authority must have access
  if (user.role === 'citizen' && complaint.userId.toString() !== user._id.toString()) {
    throw new AuthorizationError('You cannot upload evidence to this complaint.');
  }

  const storage = getStorageProvider();
  const storageResult = await storage.uploadFile(file.buffer, file.originalname, file.mimetype);

  const evidence = await Evidence.create({
    complaintId: complaint._id,
    type: determineEvidenceType(file.mimetype),
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: storageResult.sizeBytes,
    storageReference: storageResult.storageReference,
    storageProvider: storageResult.storageProvider,
    fileHash: storageResult.fileHash,
    uploadedBy: user._id,
    integrityStatus: 'VERIFIED',
    description,
    isSensitive,
  });

  // Create Audit Log
  await AuditLog.create({
    actorId: user._id,
    actorRole: user.role,
    action: 'EVIDENCE_UPLOADED',
    resourceType: 'Evidence',
    resourceId: evidence._id.toString(),
    metadata: {
      complaintId: complaint._id.toString(),
      fileName: file.originalname,
      fileHash: storageResult.fileHash,
      mimeType: file.mimetype,
      sizeBytes: storageResult.sizeBytes,
    },
  });

  return evidence;
};

export const getEvidenceList = async (complaintId, user) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new NotFoundError('Complaint');
  }

  if (user.role === 'citizen' && complaint.userId.toString() !== user._id.toString()) {
    throw new AuthorizationError('Access denied to complaint evidence.');
  }

  const evidenceList = await Evidence.find({ complaintId })
    .populate('uploadedBy', 'name role')
    .sort({ uploadedAt: -1 });

  return evidenceList;
};

export const getEvidenceFile = async (evidenceId, user) => {
  const evidence = await Evidence.findById(evidenceId);
  if (!evidence) {
    throw new NotFoundError('Evidence record');
  }

  const complaint = await Complaint.findById(evidence.complaintId);
  if (!complaint) {
    throw new NotFoundError('Associated complaint');
  }

  if (user.role === 'citizen' && complaint.userId.toString() !== user._id.toString()) {
    throw new AuthorizationError('Unauthorized to download this evidence.');
  }

  const storage = getStorageProvider();
  const fileData = await storage.getFile(evidence.storageReference);

  // Log Evidence Access
  await AuditLog.create({
    actorId: user._id,
    actorRole: user.role,
    action: 'EVIDENCE_ACCESSED',
    resourceType: 'Evidence',
    resourceId: evidence._id.toString(),
    metadata: {
      complaintId: complaint._id.toString(),
      fileName: evidence.originalFileName,
    },
  });

  return {
    buffer: fileData.buffer,
    mimeType: evidence.mimeType,
    fileName: evidence.originalFileName,
  };
};
