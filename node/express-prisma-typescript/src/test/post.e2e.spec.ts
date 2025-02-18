import request from 'supertest';
import { app } from '../server';
import { db } from '@utils';

let server: any;
let authToken: string;
let userId: string;
let postId: string;

beforeAll(async () => {
  server = app.listen();

  // Crear un usuario de prueba y obtener un token de autenticación
  const res = await request(app).post('/api/auth/signup').send({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
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

describe('Post End-to-End Tests', () => {
  it('Should create a new post', async () => {
    const res = await request(app)
      .post('/api/post')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'This is a test post',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('content', 'This is a test post');

    postId = res.body.id;
  });

  it('Should get latest posts', async () => {
    const res = await request(app)
      .get('/api/post')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Should get a post by ID', async () => {
    const res = await request(app)
      .get(`/api/post/${postId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', postId);
  });

  it('Should get posts by user ID', async () => {
    const res = await request(app)
      .get(`/api/post/by_user/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Should get a presigned URL for image upload', async () => {
    const res = await request(app)
      .get('/api/post/image/presignedUrl?filetype=image/png')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('presignedUrl');
    expect(res.body).toHaveProperty('filename');
  });

  it('Should delete a post', async () => {
    const res = await request(app)
      .delete(`/api/post/${postId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});
