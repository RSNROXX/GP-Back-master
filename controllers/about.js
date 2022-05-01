const About = require("../models/about");

const index = async (req, res) => {
  const about = await About.find();
  res.send(about);
};

const update = async (req, res) => {
  try {
    console.log("help", req.params.id);
    const updatedAbout = await About.findOneAndUpdate(
      {
        _id: req.params.id
      },
      req.body,
      { new: true }
    );
    res.send(updatedAbout);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  index,
  update
};
