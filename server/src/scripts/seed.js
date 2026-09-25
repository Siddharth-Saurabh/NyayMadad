import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { Department } from '../models/Department.js';
import { Officer } from '../models/Officer.js';
import { User } from '../models/User.js';
import { RoutingRule } from '../models/RoutingRule.js';
import { Complaint } from '../models/Complaint.js';
import { StatusHistory } from '../models/StatusHistory.js';
import { logger } from '../utils/logger.js';

export const seedDatabase = async () => {
  try {
    logger.info('Starting NyayMadad database seeding...');
    await connectDB();

    // 1. Clear existing seed collections
    await Promise.all([
      Department.deleteMany({ isDemo: true }),
      RoutingRule.deleteMany({}),
      Officer.deleteMany({}),
      User.deleteMany({ clerkUserId: { $regex: /^demo_/ } }),
    ]);

    logger.info('Cleaned existing demo records.');

    // 2. Seed Fictional Demo Departments
    const demoDepartments = [
      {
        name: 'Cyber Crime Investigation Division',
        code: 'CYBER',
        jurisdiction: 'National & State Cyber Grid',
        supportedCategories: ['Cyber Crime', 'Financial Fraud', 'Identity Theft', 'Online Harassment', 'Phishing'],
        routingChannel: 'ELECTRONIC_API',
        contactEmail: 'cybercell.demo@nyaymadad.gov.in',
        contactPhone: '1930',
        isDemo: true,
        active: true,
      },
      {
        name: 'Metropolitan Police Central Station',
        code: 'POLICE',
        jurisdiction: 'Metropolitan Area / Local Police Stations',
        supportedCategories: ['Theft', 'Burglary', 'Assault', 'Property Damage', 'Physical Violence', 'Missing Person'],
        routingChannel: 'DIRECT_DISPATCH',
        contactEmail: 'centralps.demo@nyaymadad.gov.in',
        contactPhone: '112',
        isDemo: true,
        active: true,
      },
      {
        name: 'Women & Child Safety Special Unit',
        code: 'WCSU',
        jurisdiction: 'State & Regional Special Wings',
        supportedCategories: ['Domestic Violence', 'Stalking', 'Child Protection', 'Workplace Harassment'],
        routingChannel: 'DIRECT_DISPATCH',
        contactEmail: 'wcsu.demo@nyaymadad.gov.in',
        contactPhone: '1091',
        isDemo: true,
        active: true,
      },
      {
        name: 'Financial Fraud & Economic Offences Wing',
        code: 'FINFRAUD',
        jurisdiction: 'State Economic Offences Cell',
        supportedCategories: ['Banking Fraud', 'Investment Scam', 'Cheating', 'Cryptocurrency Scam'],
        routingChannel: 'ELECTRONIC_API',
        contactEmail: 'finfraud.demo@nyaymadad.gov.in',
        contactPhone: '1800-11-4000',
        isDemo: true,
        active: true,
      },
      {
        name: 'General Public Grievance & Citizen Support Desk',
        code: 'GENERAL',
        jurisdiction: 'General Municipal & Civic Jurisdiction',
        supportedCategories: ['Public Nuisance', 'Lost Property', 'Civil Dispute', 'General Inquiries', 'Uncategorized'],
        routingChannel: 'MANUAL_QUEUE',
        contactEmail: 'helpdesk.demo@nyaymadad.gov.in',
        contactPhone: '1800-NYAY-HELP',
        isDemo: true,
        active: true,
      },
    ];

    const createdDepts = await Department.insertMany(demoDepartments);
    logger.info(`Seeded ${createdDepts.length} demo departments.`);

    const cyberDept = createdDepts.find(d => d.code === 'CYBER');
    const policeDept = createdDepts.find(d => d.code === 'POLICE');
    const wcsuDept = createdDepts.find(d => d.code === 'WCSU');
    const finDept = createdDepts.find(d => d.code === 'FINFRAUD');
    const generalDept = createdDepts.find(d => d.code === 'GENERAL');

    // 3. Seed Demo Users for each Role
    const demoUsers = [
      {
        clerkUserId: 'demo_citizen_user_id',
        name: 'Aarav Sharma',
        email: 'citizen@nyaymadad.gov.in',
        phone: '+91 98765 43210',
        role: 'citizen',
        identityVerified: true,
        verificationLevel: 'GOVT_ID',
      },
      {
        clerkUserId: 'demo_officer_user_id',
        name: 'Inspector Vikram Rathore',
        email: 'officer@nyaymadad.gov.in',
        phone: '+91 98765 43211',
        role: 'officer',
        departmentId: cyberDept._id,
        identityVerified: true,
        verificationLevel: 'LIVENESS_VERIFIED',
      },
      {
        clerkUserId: 'demo_department_admin_user_id',
        name: 'ACP Priya Mukherjee',
        email: 'deptadmin@nyaymadad.gov.in',
        phone: '+91 98765 43212',
        role: 'department_admin',
        departmentId: cyberDept._id,
        identityVerified: true,
        verificationLevel: 'LIVENESS_VERIFIED',
      },
      {
        clerkUserId: 'demo_system_admin_user_id',
        name: 'Rajesh Nambiar',
        email: 'sysadmin@nyaymadad.gov.in',
        phone: '+91 98765 43213',
        role: 'system_admin',
        identityVerified: true,
        verificationLevel: 'LIVENESS_VERIFIED',
      },
    ];

    const createdUsers = await User.insertMany(demoUsers);
    const officerUser = createdUsers.find(u => u.role === 'officer');

    // 4. Seed Officer Record
    const officerDoc = await Officer.create({
      userId: officerUser._id,
      departmentId: cyberDept._id,
      badgeNumber: 'CY-9021',
      name: 'Inspector Vikram Rathore',
      rank: 'Senior Cyber Forensic Inspector',
      active: true,
      permissions: ['REVIEW_CASE', 'ASSIGN_OFFICER', 'UPDATE_STATUS', 'REQUEST_INFO'],
    });

    officerUser.officerId = officerDoc._id;
    await officerUser.save();
    logger.info('Seeded demo users and officer record.');

    // 5. Seed Deterministic Routing Rules
    const routingRules = [
      {
        name: 'Cyber Crime Direct Routing',
        category: 'Cyber Crime',
        subcategory: '*',
        jurisdiction: 'ALL',
        departmentId: cyberDept._id,
        channel: 'ELECTRONIC_API',
        priority: 100,
        active: true,
      },
      {
        name: 'Online Financial Fraud Routing',
        category: 'Financial Fraud',
        subcategory: 'OTP Scam',
        jurisdiction: 'ALL',
        departmentId: cyberDept._id,
        channel: 'ELECTRONIC_API',
        priority: 95,
        active: true,
      },
      {
        name: 'Banking & Investment Scams',
        category: 'Financial Fraud',
        subcategory: 'Banking Fraud',
        jurisdiction: 'ALL',
        departmentId: finDept._id,
        channel: 'ELECTRONIC_API',
        priority: 90,
        active: true,
      },
      {
        name: 'Women Safety & Harassment Routing',
        category: 'Women Safety',
        subcategory: '*',
        jurisdiction: 'ALL',
        departmentId: wcsuDept._id,
        channel: 'DIRECT_DISPATCH',
        priority: 100,
        active: true,
      },
      {
        name: 'Theft & Physical Crimes Routing',
        category: 'Theft',
        subcategory: '*',
        jurisdiction: 'ALL',
        departmentId: policeDept._id,
        channel: 'DIRECT_DISPATCH',
        priority: 80,
        active: true,
      },
      {
        name: 'Assault & Physical Violence',
        category: 'Assault',
        subcategory: '*',
        jurisdiction: 'ALL',
        departmentId: policeDept._id,
        channel: 'DIRECT_DISPATCH',
        priority: 90,
        active: true,
      },
      {
        name: 'General Fallback Queue',
        category: 'Uncategorized',
        subcategory: '*',
        jurisdiction: 'ALL',
        departmentId: generalDept._id,
        channel: 'MANUAL_QUEUE',
        priority: 1,
        active: true,
      },
    ];

    await RoutingRule.insertMany(routingRules);
    logger.info(`Seeded ${routingRules.length} deterministic routing rules.`);

    // 6. Seed Sample Demonstration Complaints
    const citizenUser = createdUsers.find(u => u.role === 'citizen');
    
    const sampleComplaints = [
      {
        complaintNumber: 'NYAY-2026-08421',
        userId: citizenUser._id,
        originalStatement: 'I received an SMS claiming my electricity bill was unpaid and my power would be disconnected at 9 PM. The message had a link which downloaded an APK file. When I opened it, ₹45,000 was debited from my bank account via UPI without any OTP prompt from my side.',
        reportingMode: 'TEXT',
        category: 'Cyber Crime',
        subcategory: 'Financial Fraud - Fake Electricity Bill APK',
        description: 'Unauthorized bank debit of ₹45,000 via malicious APK downloaded through phishing SMS.',
        aiGeneratedComplaint: 'Formal Complaint: Unauthorized electronic fund transfer amounting to ₹45,000 through deceptive phishing SMS and malicious application installation. Complainant was coerced under false threat of power disconnection.',
        citizenEditedComplaint: 'Formal Complaint: Unauthorized electronic fund transfer amounting to ₹45,000 through deceptive phishing SMS and malicious application installation. Complainant was coerced under false threat of power disconnection.',
        incidentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        incidentLocation: {
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          jurisdiction: 'Delhi Central',
        },
        urgency: 'High',
        requiresEmergencyResponse: false,
        extractedInformation: {
          suspects: ['Unknown sender: +91 99887 76655'],
          witnesses: [],
          financialLoss: { amount: 45000, currency: 'INR', transactionId: 'UPI/2026/0923/98124' },
          evidenceMentioned: ['SMS screenshot', 'Bank transaction statement'],
        },
        aiConfidence: 0.96,
        status: 'UNDER_REVIEW',
        assignedDepartment: cyberDept._id,
        assignedOfficer: officerDoc._id,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        complaintNumber: 'NYAY-2026-09133',
        userId: citizenUser._id,
        originalStatement: 'Someone stole my black backpack containing my laptop (Dell XPS 15) and office access card from the coffee shop at Sector 18 around 5:30 PM yesterday while I went to pick up my order.',
        reportingMode: 'TEXT',
        category: 'Theft',
        subcategory: 'Larceny / Laptop Bag Theft',
        description: 'Theft of backpack containing high-value laptop from public commercial establishment.',
        aiGeneratedComplaint: 'Formal Complaint: Theft of personal belongings comprising a Dell XPS 15 laptop and official identification credentials from a cafe in Sector 18 during brief unattended period.',
        citizenEditedComplaint: 'Formal Complaint: Theft of personal belongings comprising a Dell XPS 15 laptop and official identification credentials from a cafe in Sector 18 during brief unattended period.',
        incidentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        incidentLocation: {
          city: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201301',
          jurisdiction: 'Sector 18 Station',
        },
        urgency: 'Medium',
        requiresEmergencyResponse: false,
        extractedInformation: {
          suspects: ['Unidentified individual near counter'],
          witnesses: ['Cafe cashier on duty'],
          financialLoss: { amount: 120000, currency: 'INR' },
          evidenceMentioned: ['Laptop purchase invoice with Serial Number'],
        },
        aiConfidence: 0.94,
        status: 'ASSIGNED',
        assignedDepartment: policeDept._id,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ];

    const createdComplaints = await Complaint.insertMany(sampleComplaints);

    // Add status history
    for (const comp of createdComplaints) {
      await StatusHistory.create([
        {
          complaintId: comp._id,
          fromStatus: 'DRAFT',
          toStatus: 'SUBMITTED',
          changedBy: citizenUser._id,
          actorRole: 'citizen',
          note: 'Complaint officially submitted by citizen.',
        },
        {
          complaintId: comp._id,
          fromStatus: 'SUBMITTED',
          toStatus: 'ROUTED',
          actorRole: 'SYSTEM',
          note: `Deterministic engine routed incident to ${comp.assignedDepartment}.`,
        },
        {
          complaintId: comp._id,
          fromStatus: 'ROUTED',
          toStatus: comp.status,
          actorRole: 'officer',
          note: 'Acknowledged and queued for official review.',
        }
      ]);
    }

    logger.info(`Seeded ${createdComplaints.length} sample complaints with audit timelines.`);
    logger.info('Database seeding completed successfully.');
  } catch (error) {
    logger.error('Error seeding database:', error);
  } finally {
    await disconnectDB();
  }
};

// Execute if run directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}
