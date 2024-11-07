const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wellSchema = new Schema({
	latitude: { type: Number },
	longitude: { type: Number },
	name: { type: String },
});

module.exports = mongoose.model('Well', wellSchema);
