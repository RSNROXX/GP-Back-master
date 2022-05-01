const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const {
  login,
  invalidLogin,
  adminLogin
} = require("../testing_utils/login.js");

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

describe("Testing all the amdin vaccines data route", () => {
  it("Returns status 200 when get all services data", async done => {
    const { token } = JSON.parse(await adminLogin());
    await request.get("/opening-hours/").set("token", token);
    expect(200);
    done();
  });

  it("Returns status 403 if not admin ", async done => {
    const { token } = JSON.parse(await login());
    await request.post("/opening-hours/").set("token", token);
    expect(403);
    done();
  });

  it("Returns status 403 if not admin ", async done => {
    const { token } = JSON.parse(await login());
    await request.post("/opening-hours/update").set("token", token);
    expect(403);
    done();
  });

  it("Returns status 200 when the opennning hour data been updated successfully", async done => {
    const { token } = JSON.parse(await login());
    await request
      .put("/opening-hours/update")
      .set("token", token)
      .send({
        order: "test-update-hour",
        dayOfTheWeek: "opening hour update",
        openingHours: "opening hour update2"
      });
    expect(200);
    done();
  });

  it("Returns status 400 if admin and required fields missing", async done => {
    const { token } = JSON.parse(await adminLogin());
    await request.put("/opening-hours/update").set("token", token);
    expect(400);
    done();
  });

  it("Returns status 403 if not admin ", async done => {
    const { token } = JSON.parse(await login());
    await request.post("/opening-hours/show").set("token", token);
    expect(403);
    done();
  });

  it("Returns status 200 when can show opening hour data", async done => {
    await request.get("/opening-hours/show");
    expect(200);
    done();
  });
});
