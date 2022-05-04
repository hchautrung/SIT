const hash = require('../modules/util/hash')
const crypto = require('crypto');

const data = {
  users: [
    {
      name:"Test User 01",
      username: "user-01",
      password: hash.hashSync(crypto.createHash("sha256").update("user-01").digest("hex"), 8),
      last_time_read:""
    },
    {
      name: "Test User 02",
      username: "user-02",
      password: hash.hashSync(crypto.createHash("sha256").update("user-02").digest("hex"), 8),
      last_time_read:"",
    },
  ],
};

module.exports = data;
