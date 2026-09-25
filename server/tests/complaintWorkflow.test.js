import { jest, describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Department } from '../src/models/Department.js';
import { RoutingRule } from '../src/models/RoutingRule.js';

describe('NyayMadad Core Citizen Workflow', () => {
  let app;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    app = createApp();
  }, 30000);

  afterAll(async () => {
    await disconnectDB();
  });

  test('GET /health returns healthy status and services list', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.services.api).toBe('online');
  });

  test('POST /api/ai/analyze accurately categorizes cyber incident', async () => {
    const res = await request(app)
      .post('/api/ai/analyze')
      .set('x-demo-role', 'citizen')
      .send({
        text: 'I got an SMS asking to pay electricity bill and ₹30,000 was debited via fraudulent UPI link.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.category).toBe('Cyber Crime');
    expect(res.body.data.extractedInformation.financialLoss.amount).toBe(30000);
  });

  test('Full Citizen Complaint Creation & Deterministic Routing', async () => {
    // 1. Create draft
    const draftRes = await request(app)
      .post('/api/complaints')
      .set('x-demo-role', 'citizen')
      .send({
        originalStatement: 'My wallet and phone were stolen from metro station at 6 PM.',
        category: 'Theft',
        urgency: 'Medium',
      });

    expect(draftRes.status).toBe(201);
    expect(draftRes.body.success).toBe(true);
    const complaintId = draftRes.body.data.complaint._id;
    expect(draftRes.body.data.complaint.status).toBe('DRAFT');

    // 2. Submit complaint
    const submitRes = await request(app)
      .post(`/api/complaints/${complaintId}/submit`)
      .set('x-demo-role', 'citizen')
      .send();

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.complaint.status).toBe('ROUTED');
    expect(submitRes.body.data.complaint.assignedDepartment).toBeDefined();

    // 3. Check timeline
    const timelineRes = await request(app)
      .get(`/api/complaints/${complaintId}/timeline`)
      .set('x-demo-role', 'citizen');

    expect(timelineRes.status).toBe(200);
    expect(timelineRes.body.data.timeline.length).toBeGreaterThanOrEqual(2);
  });
});
