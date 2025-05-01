const request = require('supertest');
const bcrypt = require('bcryptjs');
const { app, startServer } = require('../app');
const { sequelize, User } = require('../models');

describe('Auth API', () => {
  let server;
  let cleanupJob;

  beforeAll(async () => {
    const result = await startServer();
    server = result.server;
    cleanupJob = result.cleanupJob;
    await sequelize.sync({ force: true });
    await User.create({
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      isAdmin: false,
    });
  }, 30000);

  afterAll(async () => {
    console.log('Stopping cron job...');
    cleanupJob.stop();
    console.log('Cron job stopped');
    console.log('Closing server...');
    await new Promise((resolve) => {
      server.close(() => {
        console.log('Server closed');
        resolve();
      });
    });
    console.log('Closing database connection pool...');
    await sequelize.connectionManager.close();
    console.log('Closing database connection...');
    await sequelize.close();
    console.log('Database connection closed');
    // Log active handles for debugging
    console.log('Active handles:', process._getActiveHandles());
    // Flush stdout and stderr to ensure all output is written
    process.stdout.write('');
    process.stderr.write('');
    // Increase delay to allow streams to flush
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  test('POST /auth/login should return 404 with invalid email', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  test('POST /auth/login should return 200 with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
  });

  test('POST /auth/login should return 400 with valid email but wrong password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid password');
  });
});