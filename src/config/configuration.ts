export default () => ({
  isDocker: process.env.IS_RUNNING_IN_DOCKER ? true : false,
  port: parseInt(process.env.PORT) || 3000,
  fmovies: {
    baseUri: process.env.FMOVIES_BASE_URI || 'https://fmovies.to/',
  },
  cache: {
    ttl: process.env.CACHE_TLL || 5,
    max: process.env.CACHE_MAX_ITEMS || 10,
  },
});
