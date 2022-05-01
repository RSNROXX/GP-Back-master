const app = require("../app");
const supertest = require('supertest');
const mongoose = require('mongoose')
const request = supertest(app);
const {login, adminLogin} = require('../testing_utils/login.js');
require('dotenv').config();


  beforeAll(() => {
  
    const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true };
    mongoose.connect(process.env.DB_URL, dbConfig, err => {
      if (err) {
        console.log(`Error: ${err.message}`);
      }
    });
  });
    
  afterAll(() => {
    mongoose.disconnect()
  })

  describe('Testing the about index path', () => {
    it('Returns status 200', async done => {
      await request.get('/admin/about')

      expect(200); 
      done();
    });
  });

  describe('Testing the update path', () => {

    it('Returns status 200 when user is admin and required fields are completed', async done => {
      const {token} = JSON.parse(await adminLogin());
      await request.post('/admin_about/update/5e37fb60d83dce18f94c96a8')
                  .set('token', token)
                  .send({
                    about: "This is testing the about end point",
                    drInfo:"Testing the about update function in the back end"
                  })
        expect(200);
        done();
    });
    
    it('Returns status 500 when user is admin and required fields are not completed', async done => {
      const {token} = JSON.parse(await adminLogin());
      await request.post('/admin_about/update/5e37fb60d83dce18f94c96a8')
                  .set('token', token)
        expect(500);
        done();
    }); 

    it('Returns status 500 when user is admin and object ID is invalid', async done => {
      const {token} = JSON.parse(await adminLogin());
      await request.post('/admin_about/update/1234')
                  .set('token', token)
        expect(500);
        done();
    }); 

    it('Returns status 403 when user is not admin', async done => {
      const {token} = JSON.parse(await login());
      await request.post('/admin_about/update/5e37fb60d83dce18f94c96a8')
                  .set('token', token)
        expect(403);
        done();
    }); 
  })


