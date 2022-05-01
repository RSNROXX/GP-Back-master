const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const { login, invalidLogin } = require("../testing_utils/login.js");

beforeAll(async () => {
  const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true };
  try {
    await mongoose.connect(process.env.DB_URL, dbConfig);
  } catch (err) {
    console.log(err.message);
  }
});

afterAll(() => {
  mongoose.disconnect();
});

describe("Testing all the mail route", () => {
  it("Returns status 500 if all required fields missing", async done => {
    console.log("hello 2");
    await request.post("/mail/send");
    expect(500);
    done();
  });

  it("Returns status 200 if all required fields completed ", async done => {
    await request.post("/mail/send").send({
      first_name: "heng",
      last_name: "cai",
      email: "http://imagetest",
      contact_number: "0284849",
      subject: "check",
      Message: "this is for test mail route"
    });
    expect(200);
    done();
  });

  it("Returns status 200 if can send a reset password", async done => {
    await request.post("/mail/reset-password");
    expect(500);
    done();
  });

  it("Returns status 200 if all required fields completed ", async done => {
    await request.post("/mail/appointment").send({
      dateFormatted: "8-12",
      first_name: "heng",
      last_name: "cai",
      email: "http://imagetest",
      phone: "0284849",
      comment: "this is a test"
    });
    expect(200);
    done();
  });

  it("Returns status 200 if all required fields completed ", async done => {
    await request.post("/mail/cancel_appointment").send({
      dateFormatted: "8-12",
      first_name: "heng-test-cancel-appointment",
      last_name: "cai",
      email: "http://imagetest",
      phone: "0284849",
      comment: "this is a test forcancel -appointment"
    });
    expect(200);
    done();
  });
});
