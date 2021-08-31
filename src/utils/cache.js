const redis = require('redis');

const redistHost = '13.124.152.4';
const redisClient = redis.createClient(6379, redistHost);
const DEFAULT_EXPIRATION = 3600;

exports.getOrSetCache = (key, cb) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) return reject(error);
      if (data != null) return resolve(JSON.parse(data));
      const freshData = await cb();
      redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
      resolve(freshData);
    });
  });
};

exports.deleteCacheById = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (error, reply) => {
      if (error) return reject(error);
      resolve(1);
    });
  });
};
