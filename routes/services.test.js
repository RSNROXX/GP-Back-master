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

describe("Testing all the admin services route", () => {
  it("Returns status 200 when get all services data", async done => {
    const { token } = JSON.parse(await adminLogin());
    await request.get("/services").set("token", token);
    expect(200);
    done();
  });

  it("Returns status 403 if not admin ", async done => {
    const { token } = JSON.parse(await login());
    await request.post("/services").set("token", token);
    expect(403);
    done();
  });

  it("Returns status 403 if not admin to get the service data ", async done => {
    const { token } = JSON.parse(await login());
    await request
      .post("/services/5e3566b0ee5b5d0a76ae8914")
      .set("token", token);
    expect(403);
    done();
  });

  it("Returns status 200 when can show service data", async done => {
    const { token } = JSON.parse(await adminLogin());
    await request.get("/services/5e3566b0ee5b5d0a76ae8914").set("token", token);
    expect(200);
    done();
  });

  describe("Testing the update path", () => {
    it("Returns status 403 if not admin ", async done => {
      const { token } = JSON.parse(await login());
      await request
        .put("/services/update5e376c830dba6c18c46a8419/")
        .set("token", token);
      expect(403);
      done();
    });

    it("Returns status 200 if admin and required fields completed and service ID exists", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .put("/services/update/5e376c830dba6c18c46a8419")
        .set("token", token)
        .send({
          serviceName: "testing edit service",
          serviceDescription: "testing endpoint",
          imageUrl: "http://imagetest"
        });
      expect(200);
      done();
    });

    it("Returns status 400 if admin and required fields missing", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .put("/services/update/5e376c830dba6c18c46a8419")
        .set("token", token);
      expect(400);
      done();
    });

    it("Returns status 500 if service ID does not exist", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .put("/services/update/12345")
        .set("token", token)
        .send({
          serviceName: "testingendpoint2",
          serviceDescription: "testing endpoint2"
        });
      expect(500);
      done();
    });
  });

  describe("Testing the create path", () => {
    it("Returns status 403 if not admin ", async done => {
      const { token } = JSON.parse(await login());
      await request.post("/services/create").set("token", token);
      expect(403);
      done();
    });

    it("Returns status 400 if admin and required fields missing", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request.put("/services/create").set("token", token);
      expect(400);
      done();
    });

    it("Returns status 200 if admin and required fields completed", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .post("/services/create")
        .set("token", token)
        .send({
          serviceName: "testing edcreateit service",
          serviceDescription: "create endpoint",
          imageUrl: "http://imagetest"
        });
      expect(200);
      done();
    });
  });

  describe("Testing the delete path", () => {
    it("Returns status 200 if admin and service ID exists", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .post("/services/delete/5e376c830dba6c18c46a8419")
        .set("token", token)
        .send({
          serviceName: "testing edit service",
          serviceDescription: "testing endpoint"
        });
      expect(200);
      done();
    });

    it("Returns status 500 if admin and service ID does not exist", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request.delete("/services/delete/45678").set("token", token);
      expect(500);
      done();
    });

    it("Returns status 403 if not admin ", async done => {
      const { token } = JSON.parse(await login());
      await request
        .delete("/services/delete/5e3562ccee5b5d0a76ae8912")
        .set("token", token)
        .send({
          serviceName: "testingendpoint2",
          serviceDescription: "testing endpoint2"
        });
      expect(403);
      done();
    });
  });

  it("Returns status 200 when data been deleted successfully", async done => {
    const { token } = JSON.parse(await login());

    await request
      .delete("/services/delete/5e3566b0ee5b5d0a76ae8914")
      .set("token", token);
    expect(200);
    done();
  });
});
