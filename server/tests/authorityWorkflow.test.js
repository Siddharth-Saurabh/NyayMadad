import { jest, describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Complaint } from '../src/models/Complaint.js';
import { Department } from '../src/models/Department.js';
import { Officer } from '../src/models/Officer.js';

describe('NyayMadad Authority & Evidence Workflow', () => {
  let app;
  let testComplaint;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    app = createApp();

    // Create a test complaint in UNDER_REVIEW
    const cyberDept = await Department.findOne({ code: 'CYBER' });
    testComplaint = await Complaint.create({
      complaintNumber: `NYAY-TEST-${Date.now()}`,
      userId: '674000000000000000000001',
      originalStatement: 'Test cyber incident statement for authority workflow',
      category: 'Cyber Crime',
      status: 'UNDER_REVIEW',
      assignedDepartment: cyberDept?._id,
      urgency: 'High',
    });
  }, 30000);

  afterAll(async () => {
    if (testComplaint) {
      await Complaint.findByIdAndDelete(testComplaint._id);
    }
    await disconnectDB();
  });

  test('GET /api/authority/metrics returns counts', async () => {
    const res = await request(app)
      .get('/api/authority/metrics')
      .set('x-demo-role', 'officer');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.metrics).toHaveProperty('total');
  });

  test('POST /api/authority/complaints/:id/request-info creates information request', async () => {
    const res = await request(app)
      .post(`/api/authority/complaints/${testComplaint._id}/request-info`)
      .set('x-demo-role', 'officer')
      .send({
        question: 'Please provide the transaction reference ID from your bank statement.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.infoRequest.question).toContain('transaction reference ID');
  });

  test('PATCH /api/authority/complaints/:id/status transitions status to INVESTIGATION', async () => {
    const res = await request(app)
      .patch(`/api/authority/complaints/${testComplaint._id}/status`)
      .set('x-demo-role', 'officer')
      .send({
        status: 'INVESTIGATION',
        note: 'Investigating digital logs with bank fraud wing.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.complaint.status).toBe('INVESTIGATION');
  });

  test('GET /api/admin/routing-rules returns configured rules', async () => {
    const res = await request(app)
      .get('/api/admin/routing-rules')
      .set('x-demo-role', 'system_admin');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.rules)).toBe(true);
  });
});
