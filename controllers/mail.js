const nodemailer = require("nodemailer");
const uuidv1 = require("uuidv1");
const format = require("date-fns/format");
const parseISO = require("date-fns/parseISO");
require("dotenv").config();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  service: "gmail",
  auth: {
    user: "rsnroxx@gmail.com",
    pass: "RSN#3642",
  },
});

//Contents obtained from the general enquiry contact form
const send = (req, res) => {
  try {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>First Name: ${req.body.first_name}</li>
        <li>Last Name: ${req.body.last_name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.contact_number}</li>
        </ul>
      <h3>Subject: ${req.body.subject} </h3>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;

    // setup email data with unicode symbols
    let mailOptions = {
      from: "rsnroxx@gmail.com", // sender address
      to: "rsnroxx@gmail.com", // list of receivers
      subject: `${req.body.subject}`, // Subject line
      text: "Example", // plain text body
      html: output, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // res.status(200).end
      res.render("ContactForm", { msg: "Email has been sent" });
    });
  } catch (err) {
    res.status(500).end();
  }
};

//send an email with a link containing a token to allow password reset
const resetPassword = async (req, res) => {
  try {
    const { email } = req.user;
    const id = uuidv1();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Here is the link to reset your password: ${process.env.REACT_APP_FRONTEND_URL}/${id}/reset-password`,
    });
    req.user.passwordToken = id;
    await req.user.save();
    res.status(200).send("Password reset successful");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//request body obtained from appointment booking form
const appointment = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, dateTime, comment } = req.body;
    let dateFormatted = format(parseISO(dateTime), "PPPPp").toString();

    const output = `
    <p>Thank you for choosing Cloud Clinic.</p>
    <h3>Here are your appointment details: </h3>
    <h3>Date and Time: ${dateFormatted}</h3>
    <ul>  
      <li>First Name: ${firstName}</li>
      <li>Last Name: ${lastName}</li>
      <li>Email: ${email}</li>
      <li>Phone: ${phone}</li>
      <li>Your comments: ${comment} </li>
      </ul>
      <h5>To cancel your appointment, please phone the clinic directly, reply to this message, or via our website once you're logged in. If you do not have an account, once you've registered you will be able to view and cancel your appointments. </h5>
      <h5>To change your appointment, please cancel this appointment and make a new one.</h5>
      <h5>Kind regards, <br>
      The team at Cloud CLinic</h5>
  `;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      bcc: process.env.EMAIL_USER,
      subject: "Appointment Details",
      html: output,
    });
    res.status(200).end();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//contents to send in email confirming cancellation of appointment
const cancelAppointment = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, dateTime, comment } = req.body;
    let dateFormatted = format(parseISO(dateTime), "PPPPp").toString();

    const output = `
    <h2>Your appointment below has been CANCELLED:</h2>
    <h3>Date and Time: ${dateFormatted}</h3>
    <ul>  
      <li>First Name: ${firstName}</li>
      <li>Last Name: ${lastName}</li>
      <li>Email: ${email}</li>
      <li>Phone: ${phone}</li>
      <li>Your comments: ${comment} </li>
      </ul>
      <h5>To make a new appointment, please visit our website or call the clinic on <a href="tel:+123-456-789">+123-456-789</a></h5>
      <h5>Kind regards, <br>
      The team at Cloud CLinic</h5>
  `;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      bcc: process.env.EMAIL_USER,
      subject: "CANCELLED Appointment",
      html: output,
    });
    res.status(200).end();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
module.exports = { send, resetPassword, appointment, cancelAppointment };
