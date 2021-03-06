const { encrypt } = require("kdc-cms-utils");
const { DDB } = require("kdc-cms-dynamodb");

const get = async ({ username }) => {
  const params = {
    Key: { pk: username, sk: "user" }
  };

  const data = await DDB("get", params);
  return data.Item;
};

const create = async ({ username, name, password, ...attr }) => {
  const current = await get({ username });
  if (current) {
    return Promise.reject("User already exists");
  }

  const createdAt = new Date().valueOf();
  const { hash, salt } = encrypt.password(password);
  const Item = {
    pk: username,
    sk: "user",
    gs1pk: "user",
    gs1sk: name,
    ...attr,
    hash,
    salt,
    createdAt
  };

  const params = { Item };

  return DDB("put", params);
};

const createUser = async () => {
  const { KDC_CMS } = process.env;
  const user = JSON.parse(KDC_CMS);
  if (user) {
    user.password = Buffer.from(user.password, "base64").toString("ascii");
    // same code as kdc-cms-api/services/users/lib/create
    return create(user)
      .then(() => {
        console.log("User created");
      })
      .catch(e => console.log(e));
  }

  return Promise.resolve();
};

module.exports = createUser;
