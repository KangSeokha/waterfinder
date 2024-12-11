require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);
const Well = require('./models/well.model');
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const csvFile = fs.readFileSync(
	'./ProcessedData/Processed_Well_Completion_Report_copy.csv',
	'utf8'
);

const Papa = require('papaparse');
Papa.parse(csvFile, {
	header: true,
	step: function (result) {
		// Process each row of the csv as it is parsed
		console.log('data for each row:', result.data);
	},
	complete: function () {
		console.log('Data Parsing complete.');
	},
});
app.use(express.json());

app.use(
	cors({
		origin: '*',
	})
);

app.get('/', (req, res) => {
	res.json({ data: 'hello' });
});

app.get('/read-csv', (req, res) => {
	const csvFilePath = './ProcessedData/Processed_Well_Completion_Report.csv';

	fs.readFile(csvFilePath, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Failed to read file' });
		}

		Papa.parse(data, {
			header: true,
			complete: function (results) {
				res.json(results.data);
			},
			error: function (error) {
				res.status(500).json({ error: 'Failed to parse CSV' });
			},
		});
	});
});

// app.post('/create-well', async (req, res) => {
// 	const { latitude, longitude, name } = req.body;
// 	if (!latitude) {
// 		return res.status(400).json({ error: true, message: 'No latitude' });
// 	}
// 	if (!longitude) {
// 		return res.status(400).json({ error: true, message: 'No longitude' });
// 	}
// 	if (!name) {
// 		return res.status(400).json({ error: true, message: 'No name' });
// 	}
// 	const isWell = await Well.findOne({ name });
// 	if (isWell) {
// 		return res.json({
// 			error: true,
// 			message: 'Well already found',
// 		});
// 	}
// 	const well = new Well({
// 		latitude,
// 		longitude,
// 		name,
// 	});
// 	await well.save();
// 	return res.json({
// 		error: false,
// 		well,
// 		message: 'Registered',
// 	});
// });

app.post('/create-well', async (req, res) => {
	const {
		WCRNUMBER,
		DD_LONGITUDE,
		DD_LATITUDE,
		WCRN,
		LEGACYLOGNO,
		COUNTY,
		MTRS,
		ACTIVITY,
		PLANNEDUSE,
		DATEWELLCOMPLETED,
		YEARWELLCOMPLETED,
		HOLEDEPTH,
		COMPLETEDDEPTH,
		TOPOFOPENINGS,
		NUMBEROPENINTERVALS,
		GENERALIZEDLITHOLOGY,
		DRILLINGCOMPANY,
		DRILLERLICENSENO,
		DATUM,
		LOCATION_FROM,
	} = req.body;

	// Validate required fields
	if (!WCRNUMBER) {
		return res
			.status(400)
			.json({ error: true, message: 'WCRNUMBER is required' });
	}
	if (DD_LONGITUDE === undefined) {
		return res
			.status(400)
			.json({ error: true, message: 'DD_LONGITUDE is required' });
	}
	if (DD_LATITUDE === undefined) {
		return res
			.status(400)
			.json({ error: true, message: 'DD_LATITUDE is required' });
	}

	// Check if a well with the same WCRNUMBER already exists
	const existingWell = await Well.findOne({ WCRNUMBER });
	if (existingWell) {
		return res.status(400).json({
			error: true,
			message: 'A well with this WCRNUMBER already exists',
		});
	}

	// Create a new well document
	const well = new Well({
		WCRNUMBER,
		DD_LONGITUDE,
		DD_LATITUDE,
		WCRN,
		LEGACYLOGNO,
		COUNTY,
		MTRS,
		ACTIVITY,
		PLANNEDUSE,
		DATEWELLCOMPLETED,
		YEARWELLCOMPLETED,
		HOLEDEPTH,
		COMPLETEDDEPTH,
		TOPOFOPENINGS,
		NUMBEROPENINTERVALS,
		GENERALIZEDLITHOLOGY,
		DRILLINGCOMPANY,
		DRILLERLICENSENO,
		DATUM,
		LOCATION_FROM,
	});

	// Save the new well to the database
	try {
		await well.save();
		return res.status(201).json({
			error: false,
			well,
			message: 'Well registered successfully',
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: 'An error occurred while saving the well',
			details: error.message,
		});
	}
});

app.get('/get-all-wells', async (req, res) => {
	try {
		const wells = await Well.find(); // Retrieve all well documents from the collection
		return res.json({
			error: false,
			wells,
			message: 'All wells retrieved successfully',
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: 'Error retrieving wells',
		});
	}
});

app.listen(8000);

module.exports = app;
