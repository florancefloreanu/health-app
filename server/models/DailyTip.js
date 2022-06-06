// Load the Mongoose module and Schema object
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a new 'EmergencyAlertSchema'
const DailyTipSchema = new Schema({
  id: String,
  nurseCode: String,
  patientCode: String,
  text: String,
  date: String,
});

// Create the 'DailyTip' model out of the 'DailyTipSchema'
module.exports = mongoose.model("DailyTip", DailyTipSchema);
