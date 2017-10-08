/**
 * New Relic agent configuration.
 * (DO NOT RENAME OR MOVE FILE, FROM HAPPY-APP ROOT)
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  app_name : [process.env.NEW_RELIC_APP_NAME],
  license_key : process.env.NEW_RELIC_LICENSE_KEY,
  logging : {
    level : 'trace'
  }
};
