import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Hono } from 'hono';
import { userRouter } from './routes/user'; // Adjust the path as necessary
import { PrismaClient } from '@prisma/client/edge';
import app from "../src/index";

// Mock environment variables
const env = {
  DATABASE_URL: 'prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiM2E3ZTI3NjQtZWZiYy00MWU2LTkwNjYtZGY5YjQ0MTNmZWQzIiwidGVuYW50X2lkIjoiMjlmYWVlOTkyNTJlYWIxZGMyNDdlNDhmM2ZiZjIwNzk0NjJkZTFhYzQ4ZDI2YzZlNTA5ZTUxZDAyYjBiOGQxYyIsImludGVybmFsX3NlY3JldCI6ImVhYzYyNjc5LTA2NGYtNGMyZC05YmU5LTE0MDA3N2MwNWJjZSJ9.NVuP0sE6D06UbcfxYsh1LuYTH3fpvbbxW6HyfUgTuHs',
  JWT_SECRET: 'mysecret',
};



let prisma: PrismaClient;

beforeAll(async () => {
  prisma = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('User Routes', () => {
  it('POST /api/v1/signup  should create a new user and return a JWT', async () => {
    const response = await request(app.requestHandler)
      .post('/api/v1/signup')
      .send({
        email: 'test4@example.com',
        password: 'password123'
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('jwt');
  });


});
