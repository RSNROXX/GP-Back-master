const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const request = supertest(app);
const {
  login,
  invalidLogin,
  adminLogin
} = require("../testing_utils/login.js");
require("dotenv").config();

beforeAll(() => {
  const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(process.env.DB_URL, dbConfig, err => {
    if (err) {
      console.log(`Error: ${err.message}`);
    }
  });
});

afterAll(() => {
  mongoose.disconnect();
});

describe("Testing the login path", () => {
  it("Returns status 200 when username and password correct", async done => {
    await request.post("/users/login").send({
      email: "klinikdrleong@gmail.com",
      password: "eb08ef45"
    });
    expect(200);
    done();
  });

  it("Returns status 403 when username or password is incorrect", async done => {
    const response = await request.post("/users/login").send({
      email: "klinikdrleong@gmail.com",
      password: "wrongpassword"
    });
    expect(response.status).toBe(403);

    done();
  });

  it("Returns status 403 if fields are empty", async done => {
    const response = await request.post("/users/login");
    expect(response.status).toBe(403);
    done();
  });
});

describe("Testing the registration path", () => {
  it("Returns status 200 when all fields are completed", async done => {
    await request.post("/users/register").send({
      email: "supertest@test.com",
      password: "testtest",
      firstName: "supertest",
      lastName: "test",
      phone: 12345
    });
    expect(200);
    done();
  });

  it("Returns status 422 when email already exists", async done => {
    const response = await request.post("/users/register").send({
      email: "klinikdrleong@gmail.com",
      password: "wrongpassword",
      firstName: "admin",
      lastName: "admin",
      phone: 12345
    });
    expect(response.status).toBe(422);
    done();
  });

  it("Returns status 422 if fields are empty", async done => {
    await request.post("/users/register");
    expect(422);
    done();
  });
});

describe("Testing the find user endpoint", () => {
  it("Returns status 200 when token is valid", async done => {
    const { token } = JSON.parse(await login());
    await request.get("/users/find-user").set("token", token);

    expect(200);

    done();
  });

  it("Returns status 500 when account does not exist", async done => {
    const response = await invalidLogin();
    expect(500);
    done();
  });

  it("Returns status 500 if no email supplied", async done => {
    await request.get("/users/find-user");
    expect(500);
    done();
  });
});

describe("Testing the edit user endpoint", () => {
  it("Returns status 200 if user exists", async done => {
    await request.patch("/edit/5e3012acefb41821f8085e6c").send({
      email: "cypresstest@test.com",
      firstName: "Cypress",
      lastName: "Test",
      phone: "0412456789"
    });
    expect(200);
    done();
  });

  it("Returns status 500 if user does not exist", async done => {
    await request.patch("/edit/12345");
    expect(500);
    done();
  });
});
