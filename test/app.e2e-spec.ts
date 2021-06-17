import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it(`GET /`, async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(result.statusCode).toEqual(404);
  });

  describe('Home', () => {
    it(`GET /home`, async () => {
      const result = await app.inject({
        method: 'GET',
        url: '/home',
      });
      expect(result.statusCode).toEqual(200);
      // TODO: check response
    });
  });

  describe('Search', () => {
    it(`GET /search/available-options`, async () => {
      const result = await app.inject({
        method: 'GET',
        url: '/search/available-options',
      });
      expect(result.statusCode).toEqual(200);
      // TODO: check response
    });

    describe('Simple', () => {
      it(`GET /search/simple`, async () => {
        const result = await app.inject({
          method: 'GET',
          url: '/search/simple',
          query: {
            keyword: 'test',
          },
        });
        expect(result.statusCode).toEqual(200);
        // TODO: check response
      });

      // TODO: add two more simple tests
    });

    describe('Advanced', () => {
      it(`GET /search/advanced`, async () => {
        const result = await app.inject({
          method: 'GET',
          url: '/search/advanced',
          // TODO: add params
        });
        expect(result.statusCode).toEqual(200);
        // TODO: check response
      });

      // TODO: add more advanced searches
    });
  });

  describe('Video', () => {
    describe('By ID', () => {
      it(`GET /video`, async () => {
        const result = await app.inject({
          method: 'GET',
          url: '/video',
          query: {
            id: 'qnowv', // The flash
          },
        });
        expect(result.statusCode).toEqual(200);
        // TODO: check response
      });

      // TODO: add more find by id requests
    });

    describe('Details', () => {
      // TODO: write logic
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
