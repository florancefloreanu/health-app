const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DailyInfoSchema = new Schema({
    id: String,
    pulseRate: Number,
    bloodPressure: Number,
    weight: Number,
    temprature: Number,
    respiratoryRate: Number,
    date:String
});

module.exports = mongoose.model('DailyInfo', DailyInfoSchema);