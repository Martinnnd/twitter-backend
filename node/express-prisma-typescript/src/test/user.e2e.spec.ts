import request from 'supertest';
import { app } from '../server';
import { db } from '@utils';

let server: any;
let authToken: string;
let userId: string;

beforeAll(async () => {
  server = app.listen();

  const res = await request(app).post('/api/auth/signup').send({
    username: 'testuser',
    email: 'testuser@example.com',
    password: '1rqe511R_',
  });

  authToken = res.body.token;

  const userRes = await request(app)
    .get('/api/user/me')
    .set('Authorization', `Bearer ${authToken}`);

  userId = userRes.body.id;
});

afterAll(async () => {
  if (server) {
    server.close();
  }

  if (db.$disconnect) {
    await db.$disconnect();
  }
});

describe('User End-to-End Tests', () => {
  it('should get user recommendations', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get current user data', async () => {
    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should get user by ID', async () => {
    const res = await request(app)
      .get(`/api/user/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
  });

  it('should get users by username', async () => {
    const res = await request(app)
      .get(`/api/user/by_username/testuser`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete current user', async () => {
    const res = await request(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});
