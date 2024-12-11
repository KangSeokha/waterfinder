import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { wellsFromCSV } from './Data2';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import Butte from './graphs/Butte_graph.png';
import Colusa from './graphs/Colusa_graph.png';
import Glenn from './graphs/Glenn_graph.png';
import Shasta from './graphs/Shasta_graph.png';
import Solano from './graphs/Solano_graph.png';
import Sutter from './graphs/Sutter_graph.png';
import Tehamate from './graphs/Tehama_graph.png';
import Yolo from './graphs/Yolo_graph.png';
import Yuba from './graphs/Yuba_graph.png';

export default function MapComponent() {
	const mapRef = useRef(null);
	const [csvWells, setCsvWells] = useState([]);
	const [selectedYears, setSelectedYears] = useState([]);
	const [fetchTime, setFetchTime] = useState(null);
	const [filterTime, setFilterTime] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null); // State for selected image
	const markerClusterGroup = useRef(L.markerClusterGroup());

	// Array of menu items with corresponding image URLs
	const menuItems = [
		{
			label: 'Butte County',
			imageUrl: Butte,
		},
		{ label: 'Colusa', imageUrl: Colusa },
		{ label: 'Glenn', imageUrl: Glenn },
		{ label: 'Shasta', imageUrl: Shasta },

		{ label: 'Solano', imageUrl: Solano },
		{ label: 'Sutter', imageUrl: Sutter },
		{ label: 'Tehamate', imageUrl: Tehamate },
		{ label: 'Yolo', imageUrl: Yolo },
		{ label: 'Yuba', imageUrl: Yuba },
	];

	// Function to generate decade ranges
	const generateYearRanges = () => {
		const startYear = 1940;
		const currentYear = new Date().getFullYear();
		const ranges = [];
		for (let year = startYear; year <= currentYear; year += 10) {
			ranges.push([year, year + 9]);
		}
		return ranges;
	};

	useEffect(() => {
		// Initialize the map
		const map = L.map(mapRef.current).setView([40.39695899, -122.1698553], 7);

		// Add a tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		markerClusterGroup.current.addTo(map);

		// Fetch wells and add markers
		const fetchData = async () => {
			const startTime = performance.now();
			try {
				const wells = await wellsFromCSV();
				setCsvWells(wells);
				const endTime = performance.now();
				setFetchTime(endTime - startTime);
			} catch (error) {
				console.error('Error fetching wells:', error);
			}
		};

		fetchData();

		return () => {
			map.remove();
		};
	}, []);

	useEffect(() => {
		// Clear previous markers
		markerClusterGroup.current.clearLayers();

		const filterStartTime = performance.now();

		csvWells
			.filter((well) => {
				if (selectedYears.length === 0) return true;
				const year = parseInt(well.YEARWELLCOMPLETED);
				return selectedYears.some(
					(range) => year >= range[0] && year <= range[1]
				);
			})
			.forEach((well) => {
				const latitude = parseFloat(well.DD_LATITUDE);
				const longitude = parseFloat(well.DD_LONGITUDE);

				if (!isNaN(latitude) && !isNaN(longitude)) {
					const popupContent = `
            <div>
              <h4>Well Information</h4>
              <p><strong>Activity:</strong> ${well.ACTIVITY || 'Unknown'}</p>
              <p><strong>County:</strong> ${well.COUNTY || 'Unknown'}</p>
              <p><strong>Depth Completed:</strong> ${
								well.COMPLETEDDEPTH || 'Unknown'
							}</p>
              <p><strong>Year Completed:</strong> ${
								well.YEARWELLCOMPLETED || 'Unknown'
							}</p>
              <p><strong>Planned Use:</strong> ${
								well.PLANNEDUSE || 'Unknown'
							}</p>
            </div>
          `;

					L.marker([latitude, longitude])
						.bindPopup(popupContent)
						.addTo(markerClusterGroup.current);
				}
			});

		const filterEndTime = performance.now();
		setFilterTime(filterEndTime - filterStartTime);
	}, [csvWells, selectedYears]);

	const handleCheckboxChange = (yearRange) => {
		setSelectedYears((prevSelected) => {
			if (prevSelected.some((range) => range[0] === yearRange[0])) {
				return prevSelected.filter((range) => range[0] !== yearRange[0]);
			} else {
				return [...prevSelected, yearRange];
			}
		});
	};

	const handleMenuChange = (event) => {
		const selectedLabel = event.target.value;
		const selectedItem = menuItems.find((item) => item.label === selectedLabel);
		setSelectedImage(selectedItem?.imageUrl || null);
	};

	const yearRanges = generateYearRanges();

	return (
		<div style={{ display: 'flex', height: '900px' }}>
			<div ref={mapRef} style={{ width: '90%', height: '100%' }}></div>
			<div
				style={{
					width: '30%',
					backgroundColor: '#f9f9f9',
					padding: '10px',
					overflowY: 'auto',
				}}
			>
				<h4>Filter by Year Completed</h4>
				{yearRanges.map((range) => (
					<div key={range[0]}>
						<label>
							<input
								type='checkbox'
								onChange={() => handleCheckboxChange(range)}
							/>
							{range[0]} - {range[1]}
						</label>
					</div>
				))}
				{fetchTime !== null && (
					<p>Data Fetch Time: {fetchTime.toFixed(2)} ms</p>
				)}
				{filterTime !== null && (
					<p>Filtering Time: {filterTime.toFixed(2)} ms</p>
				)}

				<h4>Top-Down Menu</h4>
				<select onChange={handleMenuChange}>
					<option value=''>Select an option</option>
					{menuItems.map((item) => (
						<option key={item.label} value={item.label}>
							{item.label}
						</option>
					))}
				</select>

				{selectedImage && (
					<div style={{ marginTop: '10px' }}>
						<img src={selectedImage} alt='Selected' style={{ width: '100%' }} />
					</div>
				)}
			</div>
		</div>
	);
}
