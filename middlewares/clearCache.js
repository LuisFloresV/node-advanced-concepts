const redisClient = require('../services/RedisClient');

module.exports = async (req, res, next) => {
  await next();
  await redisClient.clearHash(req.user.id);
}