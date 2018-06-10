/**
 * Class for handling interaction with the Redis database.
 *
 * @class      Redis
 * @param      {string}   redisHost      The redis host
 * @param      {string}   redisPort      The redis port
 * @param      {integer}  redisInstance  The database instance
 */
function Redis(redisHost, redisPort, redisInstance) {
    this.raven = require('raven');
    this.raven.config('https://70fd4185ada74caf820ee534f4d9f1d2@sentry.io/1222649').install();
    this.client = require('redis').createClient({
        host: redisHost,
        port: redisPort
    });
    this.host = redisHost;
    this.port = redisPort;
    this.instance = redisInstance;
    try {
        this.connect(this.instance);
    } catch (e) {
        this.raven.captureException(e);
    }

}

/**
 * Establishes a connection with the database and selects the database instance to be used.
 * 
 * @method      Redis#connect
 * @param       {integer}  instance  The database instance (0-9)
 */
Redis.prototype.connect = function(instance) {
    this.client.select(instance, function(error, response) {
        if (error) {
            this.raven.captureMessage(error);
            return error;
        }
    });

    this.client.on("error", function(error) {
        if (error) {
            this.raven.captureMessage(error);
        }
    });
};

/**
 * Subscribes to a pub/sub channel
 *
 * @param      {string}    channel   The channel to subscribe
 * @param      {Function}  callback  The callback function to call when a message is published to the specified channel
 */
Redis.prototype.subscribe = function(channel, callback) {
    try {
        this.client.on("pmessage", callback);
        this.client.psubscribe(channel);
    } catch (e) {
        this.raven.captureException(e);
    }
};

/**
 * Publishes an object to a specified channel - only used for testing purposes.
 * Unnecessary method (abstraction for the sake of abstraction) and only
 * included here rather than directly calling the publish method for the purpose
 * of code management and consolidating all Redis related functions into this
 * file.
 *
 * @param      {string}  channel  The channel to notify
 * @param      {object}  data     The object to broadcast as the message content
 */
Redis.prototype.publish = function(channel, data) {
    this.client.publish(channel, data);
};

Redis.prototype.save = function(hash, data) {
    var that = this;
    this.client.hmset(hash, data, function(error, response) {
        if (error) {
            that.raven.captureMessage(error);
            console.log("error");
        } else {
            console.log('quit');
            that.client.quit();
        }
    });
};

Redis.prototype.quit = function() {
    this.client.quit();
};

module.exports = Redis;