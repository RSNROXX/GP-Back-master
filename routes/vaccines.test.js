const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const { login, adminLogin } = require("../testing_utils/login.js");

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

describe("Testing all the amdin vaccines route", () => {
  it("Returns status 200 when get all vaccines data", async done => {
    const { token } = JSON.parse(await adminLogin());
    await request.get("/vaccines").set("token", token);
    expect(200);
    done();
  });

  it("Returns status 403 if not admin ", async done => {
    const { token } = JSON.parse(await login());
    await request.post("/vaccines").set("token", token);
    expect(403);
    done();
  });

  it("Returns status 403 if not admin to get the vaccine data ", async done => {
    const { token } = JSON.parse(await login());
    await request
      .post("/vaccines/5e376c830dba6c18c46a8419")
      .set("token", token);
    expect(403);
    done();
  });

  it("Returns status 200 when can show vaccine data", async done => {
    const { token } = JSON.parse(await adminLogin());
    await request.get("/vaccines/5e376c830dba6c18c46a8419").set("token", token);
    expect(200);
    done();
  });

  describe("Testing the update path", () => {
    it("Returns status 403 if not admin ", async done => {
      const { token } = JSON.parse(await login());
      await request
        .put("/vaccines/5e376c830dba6c18c46a8419/")
        .set("token", token);
      expect(403);
      done();
    });

    it("Returns status 200 if admin and required fields completed and service ID exists", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .put("/vaccines/update/5e376c830dba6c18c46a8419")
        .set("token", token)
        .send({
          brand: "vaccine-create-test",
          description: "this is for testing create vaccine",
          manufacturer: "nahe factory",
          imageUrl: "http:locaddaTESTvaccine.com"
        });
      expect(200);
      done();
    });

    it("Returns status 400 if admin and required fields missing", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .put("/vaccines/update/5e376c830dba6c18c46a8419")
        .set("token", token);
      expect(400);
      done();
    });

    it("Returns status 500 if service ID does not exist", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .put("/vaccines/update/12345")
        .set("token", token)
        .send({
          brand: "vaccine-create-test",
          description: "this is for testing create vaccine",
          manufacturer: "nahe factory",
          imageUrl: "http:locaddaTESTvaccine.com"
        });
      expect(500);
      done();
    });
  });

  describe("Testing the create path", () => {
    it("Returns status 403 if not admin ", async done => {
      const { token } = JSON.parse(await login());
      await request.post("/vaccines/create").set("token", token);
      expect(403);
      done();
    });

    it("Returns status 200 if admin and required fields completed and service ID exists", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .post("/vaccines/create")
        .set("token", token)
        .send({
          serviceName: "testing edcreateit service",
          serviceDescription: "create endpoint",
          imageUrl: "http://imagetest"
        });
      expect(200);
      done();
    });

    it("Returns status 400 if admin and required fields missing", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request.put("/vaccines/create").set("token", token);
      expect(400);
      done();
    });
  });

  describe("Testing the delete path", () => {
    it("Returns status 200 if admin and service ID exists", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request
        .post("/vaccines/delete/5e376c830dba6c18c46a8419")
        .set("token", token);

      expect(200);
      done();
    });

    it("Returns status 500 if admin and service ID does not exist", async done => {
      const { token } = JSON.parse(await adminLogin());
      await request.delete("/vaccines/delete/45678").set("token", token);
      expect(500);
      done();
    });

    it("Returns status 403 if not admin ", async done => {
      const { token } = JSON.parse(await login());
      await request
        .delete("/vaccines/delete/5e3562ccee5b5d0a76ae8912")
        .set("token", token);

      expect(403);
      done();
    });
  });

  it("Returns status 200 when data been deleted successfully", async done => {
    const { token } = JSON.parse(await login());

    await request
      .delete("/vaccines/delete/5e376b250dba6c18c46a8416")
      .set("token", token);
    expect(200);
    done();
  });
});
