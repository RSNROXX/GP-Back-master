const Service = require("../models/service");

const index = async (req, res) => {
  const vaccines = await Service.find();
  res.send(vaccines);
};

async function show(req, res) {
  try {
    const service = await Service.findById(req.params.id);
    res.send(service);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function create(req, res) {
  try {
    const { serviceName, serviceDescription, imageUrl } = req.body;
    const newService = new Service({
      serviceName,
      serviceDescription,
      imageUrl
    });

    const savedService = await newService.save();
    res
      .send(savedService)
      .then(() => console.log("New Service Added!"), res.redirect("/services"));
  } catch (err) {
    console.log(err.message);
    res.status(422).send({ err });
  }
}

const destroy = (req, res, next) => {
  Service.findByIdAndRemove(req.params.id, (error, data) => {
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
    const updatedService = await Service.findOneAndUpdate(
      {
        _id: req.params.id
      },
      req.body,
      { new: true }
    );
    res.send(updatedService);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  index,
  show,
  create,
  destroy,
  update
};
