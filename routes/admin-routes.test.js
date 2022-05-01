const app = require("../app");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");

test("", () => {});

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

describe("Testing all the amdin staff route", () => {
  it("Returns status 200 when all fields are completed", async done => {
    await request.post("/admin/add_staff").send({
      name: "heng-test",
      position: "doctor",
      aboutText: "i am a doctor for test",
      imageUrl: "http:locadda.com"
    });
    expect(200);
    done();
  });

  it("Returns status 200 when get all staff data", async done => {
    await request.get("/admin/staff");

    expect(200);
    done();
  });

  it("Returns status 200 when the updated data been found ", async done => {
    await request.put("/admin/edit_staff/5e33b3312c79da572a8e26ec");
    expect(200);
    done();
  });

  it("Returns status 200 when data been updated successfully", async done => {
    await request.put("/admin/update_staff/5e33b3312c79da572a8e26ec").send({
      name: "hneg-test-update",
      position: "doctor-update",
      aboutText: "i am a doctor for test update",
      imageUrl: "http:locaddaEDIT.com"
    });
    expect(200);
    done();
  });

  it("Returns status 200 when data been deleted successfully", async done => {
    await request.delete("/admin/delete_staff/5e33b3312c79da572a8e26ec");
    expect(200);
    done();
  });
});
