const openingHours = require("../models/openingHours");

const index = async (req, res) => {
  const hours = await openingHours.find().sort({ order: "asc" });
  res.send(hours);
};

// Show for display
const show = async (req, res) => {
  try {
    const hours = await openingHours.findById(req.params.id);
    res.send(hours);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update function deletes the old information out of the DB since we only ever want there to be 7 days of the week
const update = async (req, res) => {
  try {
    await openingHours.deleteMany();
    const times = Object.values(req.body);
    const days = Object.keys(req.body);
    const docs = times.map((time, index) => {
      return {
        openingHours: time,
        order: index,
        dayOfTheWeek: days[index]
      };
    });
    await openingHours.insertMany(docs);
    res.end();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  index,
  show,
  update
};
