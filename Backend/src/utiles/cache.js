import { redisClient } from "../config/redis.js";

/*
|--------------------------------------------------------------------------
| Redis GET
|--------------------------------------------------------------------------
*/

const getRedis = async (key) => {
  try {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error(`Redis GET error [${key}]:`, error.message);
    return null;
  }
};

/*
|--------------------------------------------------------------------------
| Redis SET
|--------------------------------------------------------------------------
*/

const setRedis = async (key, value, expiry = 600) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expiry,
    });

    return true;
  } catch (error) {
    console.error(`Redis SET error [${key}]:`, error.message);
    return false;
  }
};

/*
|--------------------------------------------------------------------------
| Redis DELETE
|--------------------------------------------------------------------------
*/

const deleteRedis = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Redis DELETE error [${key}]:`, error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Redis EXISTS
|--------------------------------------------------------------------------
*/

const existsRedis = async (key) => {
  try {
    return await redisClient.exists(key);
  } catch (error) {
    console.error(`Redis EXISTS error [${key}]:`, error.message);
    return 0;
  }
};

export {
  getRedis,
  setRedis,
  deleteRedis,
  existsRedis,
};