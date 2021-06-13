export default () => ({
  isDocker: process.env.IS_RUNNING_IN_DOCKER ? true : false,
  port: parseInt(process.env.PORT) || 3000,
  fmovies: {
    baseUri: process.env.FMOVIES_BASE_URI || 'https://fmovies.to/',
  },
  selenium: {
    headless: process.env.SELENIUM_HEADLESS ? true : false,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TLL) || 5,
    max: parseInt(process.env.CACHE_MAX_ITEMS) || 10,
  },
});
