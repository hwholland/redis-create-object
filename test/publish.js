
    const path = require('path');
    const redis = require('../redis');

    var redisHost = '127.0.0.1';
    var redisPort = 6379;
    var redisInstance = 0;
    var redisChannel = 'append:list:world';

    var testData = 'business'

    var redisClient = new redis(redisHost, redisPort, redisInstance);
    redisClient.publish(redisChannel, testData);

