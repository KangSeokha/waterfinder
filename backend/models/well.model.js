const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wellSchema = new mongoose.Schema({
	WCRNUMBER: { type: String, required: true },
	DD_LONGITUDE: { type: Number, required: true },
	DD_LATITUDE: { type: Number, required: true },
	WCRN: { type: String, required: false },
	LEGACYLOGNO: { type: String, required: false },
	COUNTY: { type: String, required: false },
	MTRS: { type: String, required: false },
	ACTIVITY: { type: String, required: false },
	PLANNEDUSE: { type: String, required: false },
	DATEWELLCOMPLETED: { type: Date, required: false },
	YEARWELLCOMPLETED: { type: Number, required: false },
	HOLEDEPTH: { type: Number, required: false },
	COMPLETEDDEPTH: { type: Number, required: false },
	TOPOFOPENINGS: { type: Number, required: false },
	NUMBEROPENINTERVALS: { type: Number, required: false },
	GENERALIZEDLITHOLOGY: { type: String, required: false },
	DRILLINGCOMPANY: { type: String, required: false },
	DRILLERLICENSENO: { type: String, required: false },
	DATUM: { type: String, required: false },
	LOCATION_FROM: { type: String, required: false },
});
module.exports = mongoose.model('Well', wellSchema);
