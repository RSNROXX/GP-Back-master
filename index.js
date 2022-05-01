const mongoose = require("mongoose");
const app = require("./app");

//heroku won't always use port 3000
const PORT = process.env.PORT || 5000;

const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true };

//mongoose
mongoose.connect(
  "mongodb+srv://RSNROXX:rsnroxx1903@rsnroxx.mosg0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  dbConfig,
  (err) => {
    if (err) {
      console.log(`Error: ${err.message}`);
    } else {
      console.log("Connected to MongoDB Atlas ✅");
    }
  }
);

//comment app.listen out for testing
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
