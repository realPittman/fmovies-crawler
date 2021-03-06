if (!process.env.BASE_URI) throw new Error('"BASE_URI" env var should be set.');

export default () => ({
  baseURI: process.env.BASE_URI,
  isDocker: process.env.IS_RUNNING_IN_DOCKER ? true : false,
  port: parseInt(process.env.PORT) || 3000,
  fmovies: {
    baseUri: process.env.FMOVIES_BASE_URI || 'https://fmovies.to/',
  },
  selenium: {
    headless: process.env.SELENIUM_HEADLESS === 'true',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TLL) || 5,
    max: parseInt(process.env.CACHE_MAX_ITEMS) || 10,
    uuidTTL: parseInt(process.env.CACHE_STREAM_UUID_TTL) || 172800,
  },
});
