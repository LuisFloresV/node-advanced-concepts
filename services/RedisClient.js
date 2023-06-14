const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.isConnected = false;
    this.init();
  }

  async init() {
    if (this.isConnected) {
      return;
    }
    this.isConnected = true;
    await this.client.connect();
  }

  getCache(key) {
    return this.client.get(key)
  }

  setCache(key, value) {
    console.log(key, value)
    return this.client.set(key, value);
  }

  getHCache(hash, key) {
    return this.client.hGet(hash, key)
  }

  setHCache(hash, key, value) {
    return this.client.hSet(hash, key, value);
  }

  clearHash(hashKey) {
    return this.client.del(JSON.stringify(hashKey));
  }
}

module.exports = Object.freeze(new RedisClient());