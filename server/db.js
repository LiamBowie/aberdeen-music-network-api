let records = [
  {
    id: 1,
    username: "Admin",
    password: "$2b$10$4nYzYFAi2UpCgKMKOwRcXOB8.bo6vwDM36I9CrTFULvHJhUbWZv3.", // "Password"
  },
];

const getNewId = (array) => {
  if (array.length > 0) {
    return array[array.length - 1].id + 1;
  } else {
    return 1;
  }
};

exports.getRecords = () => {
  return records;
}

exports.createUser = function (user) {
  return new Promise((resolve, reject) => {
    const newUser = {
      id: getNewId(records),
      ...user,
    };
    records = [...records, newUser];
    resolve(newUser);
  });
};

exports.findById = function (id, cb) {
  process.nextTick(function () {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error("User " + id + " does not exist"));
    }
  });
};

exports.findByUsername = function (username, cb) {
  process.nextTick(function () {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
};
