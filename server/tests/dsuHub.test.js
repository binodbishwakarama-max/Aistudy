const request = require('supertest');
const express = require('express');
const dsuHubRoutes = require('../routes/dsuHub');

const app = express();
app.use(express.json());
app.use('/api/dsu-hub', dsuHubRoutes);

describe('DSU Hub API Routes', () => {
  it('GET /api/dsu-hub/branches returns list of engineering branches', async () => {
    const res = await request(app).get('/api/dsu-hub/branches');
    expect(res.status).toBe(200);
    expect(res.body.branches).toBeDefined();
    expect(Array.isArray(res.body.branches)).toBe(true);
    expect(res.body.branches.length).toBeGreaterThanOrEqual(6);

    const cse = res.body.branches.find((b) => b.slug === 'cse');
    expect(cse).toBeDefined();
    expect(cse.shortName).toBe('CSE');
  });

  it('GET /api/dsu-hub/:branchSlug returns branch with semesters', async () => {
    const res = await request(app).get('/api/dsu-hub/cse');
    expect(res.status).toBe(200);
    expect(res.body.branch).toBeDefined();
    expect(res.body.branch.slug).toBe('cse');
    expect(res.body.branch.semesters.length).toBeGreaterThan(0);
  });

  it('GET /api/dsu-hub/:branchSlug/:semesterNum returns subjects', async () => {
    const res = await request(app).get('/api/dsu-hub/cse/5');
    expect(res.status).toBe(200);
    expect(res.body.semester).toBeDefined();
    expect(res.body.semester.number).toBe(5);
    expect(res.body.semester.subjects.length).toBeGreaterThan(0);

    const dbms = res.body.semester.subjects.find((s) => s.code === '21CS53');
    expect(dbms).toBeDefined();
  });

  it('GET /api/dsu-hub/:branchSlug/:semesterNum/:subjectCode returns guidance and PYQs', async () => {
    const res = await request(app).get('/api/dsu-hub/cse/5/21CS53');
    expect(res.status).toBe(200);
    expect(res.body.subject).toBeDefined();
    expect(res.body.subject.code).toBe('21CS53');
    expect(res.body.subject.guidance).toBeDefined();
    expect(res.body.subject.guidance.notes).toContain('Normalization');
    expect(res.body.subject.pyqs.length).toBeGreaterThan(0);
  });

  it('returns 404 for invalid branch or subject', async () => {
    const branchRes = await request(app).get('/api/dsu-hub/non-existent-branch');
    expect(branchRes.status).toBe(404);

    const subjectRes = await request(app).get('/api/dsu-hub/cse/5/INVALID99');
    expect(subjectRes.status).toBe(404);
  });
});
