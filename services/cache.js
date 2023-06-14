const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;
const redisClient = require('./RedisClient');

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(Object.assign({}, this.getFilter(), {
    collection: this.mongooseCollection.name
  }));

  const cachedValue = await redisClient.getHCache(this.hashKey, key);

  if (cachedValue) {
    const doc = JSON.parse(cachedValue);
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  await redisClient.setHCache(this.hashKey, key, JSON.stringify(result));


  return result;
}