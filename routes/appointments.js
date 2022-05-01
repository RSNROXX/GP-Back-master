const express = require('express');
const router = express.Router();
const {checkToken} = require("../controllers/token_middleware");
const {newAppointment, getAppointmentsByUser, cancelAppointment} = require('../controllers/appointment');


router.post('/new', newAppointment);
router.patch('/:id', cancelAppointment);
router.get('/user_appointments', checkToken, getAppointmentsByUser)

module.exports = router;