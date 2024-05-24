const { User } = require("./src/schema");

const seedUser = () => {
  const user = new User({
    name: "example",
    email: "user@example.com",
    password: "123456@",
  });
  user.save();

  return user.toJSON();
};

module.exports = { seedUser };
