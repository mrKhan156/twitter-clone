const redis = require('redis');
const redisClient = redis.createClient();
const defaultCacheExpirationTime = 604800;

const getAndSetCache = async (key, cb) => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      const newData = await cb();

      redisClient.setEx(
        key,
        defaultCacheExpirationTime,
        JSON.stringify(newData)
      );
      return newData;
    }
  } catch (error) {
    console.log(error);
  }
};
//updating cache

const updateCache = async (key, value) => {
  try {
    redisClient.setEx(key, defaultCacheExpirationTime, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

// delteCatch
const deleteCatch = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  redisClient,
  getAndSetCache,
  updateCache,
  deleteCatch,
};
