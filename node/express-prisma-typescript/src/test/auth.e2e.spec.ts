import request from 'supertest';
import { app } from '../server';
// import { db } from '@utils'; 

let server: any;

describe('Auth End-to-End Tests', () => {
  it('Should return 404 for an unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
  });

  it('Should signup a user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Should login a user successfully', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: '1rqe511R_'
      });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser2@example.com',
        password: '1rqe511R_'
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('Should return 400 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });
    expect(res.status).toBe(400);
  });
});

