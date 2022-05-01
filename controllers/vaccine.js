const Vaccine = require("../models/vaccines");

const index = async (req, res) => {
  const vaccines = await Vaccine.find().sort({ description: "ascending" });
  res.send(vaccines);
};

const show = async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.id);
    res.send(vaccine);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const create = async (req, res) => {
  try {
    const { brand, description, manufacturer, imageUrl } = req.body;
    const newVaccine = new Vaccine({
      brand,
      description,
      manufacturer,
      imageUrl
    });

    const savedVaccine = await newVaccine.save();
    res
      .send(savedVaccine)
      .then(() => console.log("New Vaccine Added!"), res.redirect("/vaccines"));
  } catch (err) {
    console.log(err.message);
    res.status(422).send({ err });
  }
};

const destroy = (req, res, next) => {
  Vaccine.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      });
    }
  });
};

const update = async (req, res, next) => {
  try {
    const updatedVaccine = await Vaccine.findOneAndUpdate(
      {
        _id: req.params.id
      },
      req.body,
      { new: true }
    );
    res.send(updatedVaccine);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  index,
  create,
  destroy,
  update,
  show
};
