// Load the Mongoose module and Schema object
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a new 'EmergencyAlertSchema'
const EmergencyAlertSchema = new Schema({
  id: String,
  patientCode: String,
  text: String,
  phone: String,
});

// Create the 'EmergencyAlert' model out of the 'EmergencyAlertSchema'
module.exports = mongoose.model("EmergencyAlert", EmergencyAlertSchema);
