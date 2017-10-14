
const Rollbar = require('rollbar');

class RollbarTracking{

  /**
   *  Create a rollbar instance, with API key and configure options
   */
  constructor(){

    // Get API key, check it was there, then create a new rollbar instance
    const rollbarApiKey = process.env.ROLLBAR_KEY;
    this.keySupplied = (!!rollbarApiKey);
    this.rollbar = new Rollbar(rollbarApiKey);

    // Set params
    this.rollbar.captureUncaught = true;
    // this.rollbar.configure({logLevel: "warning"}); // Uncomment to log only warnings, and up

    // Don't track if tracking is disabled
    if (!this.shouldBeTracking){
      this.rollbar.configure({enabled: false});
    }

  }

  /**
   * Contains the environmental calls to determine if we want to be tracking
   * in the at the moment
   * @returns {boolean}
   */
  shouldBeTracking() {
    return (process.env.NODE_ENV === "production" && this.keySupplied);
  }

  /**
   * Log an info message to rollbar
   * @param message
   * @param details
   */
  logMessage(message, details = null){
    if (!this.shouldBeTracking) return;
    this.rollbar.info(message, details);
  }

  /**
   * Log a warning to rollbar
   * @param warning
   * @param details
   */
  logWarning(warning, details = null){
    if (!this.shouldBeTracking) return;
    this.rollbar.warning(warning, details);
  }

}

module.exports = new RollbarTracking();
