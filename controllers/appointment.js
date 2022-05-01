const Appointment = require("../models/appointment");
const mongoose = require('mongoose');

//creating a new appointment and adding to database
async function newAppointment (req, res) {
  try {
    const { firstName, lastName, email, phone, dateTime, comment} = req.body;

    let newAppointment = new Appointment({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      dateTime: dateTime,
      comment: comment,
      cancelled: false
    });

    appointment = await newAppointment.save();
    
    res.status(200).send(appointment)
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//getting appointments for user whose email matches the token sent in request
//filtered to show only appointments not cancelled, sorted in order of date
async function getAppointmentsByUser (req, res) {
 try {
  const email = req.decoded.email;
  const query = Appointment.find({email: email, cancelled:false}).sort({dateTime: 'ascending'});
  query instanceof mongoose.Query; // true
  const appointments =  await query; // Get the documents
  res.send(appointments);
 } catch(err) {
   res.status(500).send(err.message)
 }
}

//Update the cancelled boolean from false to true but entry remains in database
async function cancelAppointment (req, res, next) {
    Appointment.findByIdAndUpdate({_id: req.params.id}, {cancelled: true}, (error, appointment) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).send({
          msg: `Appointment on ${appointment.dateTime} cancelled successfully`
        });
        
      }
    });
}

module.exports = {newAppointment, getAppointmentsByUser, cancelAppointment}