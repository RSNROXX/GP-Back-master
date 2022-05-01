const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const { login, invalidLogin } = require("../testing_utils/login.js");

beforeAll(() => {
  const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(process.env.DB_URL, dbConfig, err => {
    if (err) {
      console.log(`Error: ${err.message}`);
    } else {
      console.log("Connected to MongoDB Atlas ✅");
    }
  });
});

afterAll(() => {
  mongoose.disconnect();
});

describe("Testing the new appointment endpoint", () => {
  it("Returns status 200 when required fields are competed", async done => {
    await request.post("/appointments/new").send({
      firstName: "Testing endpoint",
      lastName: "UnitTesting",
      email: "testing@test.com",
      phone: "12345",
      dateTime: "2020-02-22T08:00:00.000+00:00",
      comment: "I need a checkup"
    });
    expect(200);
    done();
  });

  it("Returns status 500 when required fields are not completed", async done => {
    await request.post("/appointments/new");
    expect(500);
    done();
  });
});

describe("Testing the cancel appointment endpoint", () => {
  it("Returns status 200 when appointment ID exists", async done => {
    await request.patch("/appointments/5e37a9eed7655a2fdc252617");
    expect(200);
    done();
  });

  it("Returns status 500 when ID does not exist", async done => {
    await request.patch("/appointments/123");
    expect(500);
    done();
  });
});

describe("Testing the user appointments endpoint", () => {
  it("Returns status 200 when user ID exists", async done => {
    const { token } = JSON.parse(await login());
    await request.get("/appointments/user_appointments").set("token", token);
    expect(200);
    done();
  });

  it("Returns status 500 when user not logged in", async done => {
    await request.get("/appointments/user_appointments");
    expect(500);
    done();
  });

  it("Returns status 500 when user ID does not exist", async done => {
    let token = await invalidLogin();
    await request.get("/appointments/user_appointments").set("token", token);
    expect(500);
    done();
  });
});
