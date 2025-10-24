import request from 'supertest';
import app from '../../server.js';
import {jest} from '@jest/globals';


jest.mock('../../lib/db.js', () => ({
    connectDB: jest.fn(() => Promise.resolve())
}))

describe('GET /api/messages', () => {
    test('should return 429', async () => {
       for(let i = 0; i < 3; i++) {
        const res = await request(app).get('/api/messages');
        expect(res.statusCode).toBe(200);
       }

       const limitedRes = await request(app).get('/api/messages');
       expect(limitedRes.statusCode).toBe(429)
       expect(limitedRes.text).toMatch(/Too many requests/i);
    })
})