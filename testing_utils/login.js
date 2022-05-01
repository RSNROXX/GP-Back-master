const request = require("supertest");
const app = require("../app");
require("dotenv").config();
exports.login = async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: "cam021928@coderacademy.edu.au",
      password: "testtest"
    });
  return response.text;
};

exports.invalidLogin = async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: "random@test.com",
      password: "testtest2"
    });
  return response.text;
};

exports.adminLogin = async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: "nhantdang@gmail.com",
      password: "testtest"
    });
  return response.text;
};
