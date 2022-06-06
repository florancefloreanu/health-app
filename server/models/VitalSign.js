// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'VitalSignSchema'
const VitalSignSchema = new Schema({
    id: String,
    patientCode: String,
    bodyTemperature: Number,
    heartRate: Number,
    bloodPressure: Number,
    respiratoryRate: Number,
    nurseCode: String
});

// Create the 'VitalSign' model out of the 'VitalSignSchema'
module.exports = mongoose.model('VitalSign', VitalSignSchema);