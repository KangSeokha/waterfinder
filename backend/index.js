require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);
const Well = require('./models/well.model');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(
	cors({
		origin: '*',
	})
);

app.get('/', (req, res) => {
	res.json({ data: 'hello' });
});

app.post('/create-well', async (req, res) => {
	const { latitude, longitude, name } = req.body;
	if (!latitude) {
		return res.status(400).json({ error: true, message: 'No latitude' });
	}
	if (!longitude) {
		return res.status(400).json({ error: true, message: 'No longitude' });
	}
	if (!name) {
		return res.status(400).json({ error: true, message: 'No name' });
	}
	const isWell = await Well.findOne({ name });
	if (isWell) {
		return res.json({
			error: true,
			message: 'Well already found',
		});
	}
	const well = new Well({
		latitude,
		longitude,
		name,
	});
	await well.save();
	return res.json({
		error: false,
		well,
		message: 'Registered',
	});
});

app.listen(8000);

module.exports = app;
