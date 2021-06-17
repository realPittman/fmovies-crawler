import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it(`/ GET`, async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(result.statusCode).toEqual(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
