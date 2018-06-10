
    const path = require('path');
    const Redis = require('../Redis');

    var redisHost = '127.0.0.1';
    var redisPort = 6379;
    var redisInstance = 0;
    var redisChannel = 'create:object:company:2';

    var testData = {
    	property1: 'This is a test property',
    	property2: 'This is a test property'
    };

    var redisClient = new Redis(redisHost, redisPort, redisInstance);
    redisClient.publish(redisChannel, JSON.stringify(testData));

