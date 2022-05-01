const User = require("../models/user");
const Appointment = require("../models/appointment");
const mongoose = require("mongoose");
const subDays = require('date-fns/subDays');

//staff
const Staff = require("../models/staff");


//retrieve all users in order of last name
async function allUsers(req, res) {
  try {
    const query = User.find();
    query instanceof mongoose.Query; // true
    const usersList = await query.sort({ lastName: "ascending" }); // Get the documents
    res.send(usersList);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
}

//delete appointments from the previous day to reduce database clutter
//retrieve all appointments that have not been cancelled, sorted by date time of appointment
async function allAppointments(req, res) {
  const deleteOldAppointment = () => {
    let today = new Date();
    let yesterday = subDays(today, 1)
    Appointment.deleteMany({ dateTime: yesterday }, function (err) {
     if(err) console.log(err);
     console.log("Deletion OK");
    })
  }
    try {
      deleteOldAppointment();
      const query = Appointment.find({ cancelled: false });
      query instanceof mongoose.Query; // true
      const appointmentsList = await query.sort({ dateTime: "ascending" });
      console.log(appointmentsList);
      res.send(appointmentsList); // Get the documents
    } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
}

// Get all Staff
function staffs(req, res) {
  Staff.find(function(err, staffs) {
    if (err) {
      console.log(err);
    } else {
      res.json(staffs);
    }
  });
}

//Create new Staff member
async function addStaff(req, res) {
  try {
    const { name, position, aboutText, imageUrl } = req.body;
    let newStaff = new Staff({
      name: name,
      position: position,
      aboutText: aboutText,
      imageUrl: imageUrl
    });
    const staff = await newStaff.save();
    res.send(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Edit current Staff
function editStaff(req, res) {
  let id = req.params.id;
  Staff.findById(id, function(err, staff) {
    res.json(staff);
  });
}

//  Staff update route
function updateStaff(req, res) {
  Staff.findById(req.params.id, function(err, staff) {
    if (!staff) res.status(404).send("data is not found");
    else {
      staff.name = req.body.name;
      staff.aboutText = req.body.aboutText;
      staff.position = req.body.position;
      staff.imageUrl = req.body.imageUrl;

      staff
        .save()
        .then(staff => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("Unable to update the database");
        });
    }
  });
}

//Delete Staff member
async function deleteStaff(req, res) {
  try {
    const staff = await Staff.findById(req.params.id);

    //Check for ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !staff) {
      return res.status(404).json({ msg: "Staff not found" });
    }
    await staff.remove();
    res.json({ msg: "Staff removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

//get info for a single user
const getUserInfo = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findById(id).then(user => {
      res.send({
        email: user.email,
        admin: user.admin,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

module.exports = {
  staffs,
  addStaff,
  updateStaff,
  editStaff,
  deleteStaff,
  allUsers,
  getUserInfo,
  allAppointments
};
