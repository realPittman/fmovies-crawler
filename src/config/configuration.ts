export default () => ({
  isDocker: process.env.IS_RUNNING_IN_DOCKER ? true : false,
  port: parseInt(process.env.PORT) || 3000,
  fmovies: {
    baseUri: process.env.FMOVIES_BASE_URI || 'https://fmovies.to/',
  },
});
