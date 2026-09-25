import multer from 'multer';
import { uploadEvidence, getEvidenceList, getEvidenceFile } from '../services/evidenceService.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export const evidenceUploadMiddleware = upload.single('file');

export const uploadEvidenceHandler = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { description, isSensitive } = req.body;

    const evidence = await uploadEvidence({
      complaintId,
      file: req.file,
      user: req.user,
      description,
      isSensitive: isSensitive === 'true' || isSensitive === true,
    });

    res.status(201).json({
      success: true,
      message: 'Evidence uploaded and integrity verified successfully',
      data: { evidence },
    });
  } catch (error) {
    next(error);
  }
};

export const getEvidenceListHandler = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const evidenceList = await getEvidenceList(complaintId, req.user);

    res.status(200).json({
      success: true,
      data: { evidenceList },
    });
  } catch (error) {
    next(error);
  }
};

export const downloadEvidenceFileHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { buffer, mimeType, fileName } = await getEvidenceFile(id, req.user);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
