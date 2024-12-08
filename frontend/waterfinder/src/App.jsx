import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { wellsFromCSV } from './Data2';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export default function MapComponent() {
	const mapRef = useRef(null); // Reference for the map container
	const [csvWells, setCsvWells] = useState([]); // State to store fetched wells
	// 48.8566, 2.3522
	useEffect(() => {
		// Initialize the map
		const map = L.map(mapRef.current).setView([34.0549, -118.2426], 13);
		const markerClusterGroup = L.markerClusterGroup();
		// Add a tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		// Fetch wells and add markers
		const fetchData = async () => {
			try {
				const wells = await wellsFromCSV(); // Call your wells fetching function
				console.log('Fetched wells:', wells);
				setCsvWells(wells); // Save wells to state

				// Add markers to the map
				wells.forEach((well) => {
					const latitude = parseFloat(well.DD_LATITUDE); // Parse latitude
					const longitude = parseFloat(well.DD_LONGITUDE); // Parse longitude

					// Ensure coordinates are valid numbers
					if (!isNaN(latitude) && !isNaN(longitude)) {
						// Create a popup with well details
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

						// Add marker to the map
						L.marker([latitude, longitude])
							.addTo(map)
							.bindPopup(popupContent)
							.addTo(markerClusterGroup);
					}
				});
				map.addLayer(markerClusterGroup);
			} catch (error) {
				console.error('Error fetching wells:', error);
			}
		};

		fetchData();
		console.log(csvWells);
		return () => {
			// Cleanup the map instance
			map.remove();
		};
	}, []);

	// Dummy wellsFromCSV function (replace this with your actual API call)
	// const wellsFromCSV = async () => {
	// 	return [
	// 		{ geocode: [48.8566, 2.3522], popUp: 'Marker 1' },
	// 		{ geocode: [48.8568, 2.3524], popUp: 'Marker 2' },
	// 	];
	// };

	return (
		<div
			ref={mapRef}
			style={{ width: '100%', height: '500px' }} // Ensure map container has a fixed size
		></div>
	);
}
