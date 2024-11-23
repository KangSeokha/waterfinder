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
// import './styles.css';
// import 'leaflet/dist/leaflet.css';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import MarkerClusterGroup from 'react-leaflet-cluster';
// import placeholderIcon from './icons/placeholder.png';
// import { Icon, divIcon, point } from 'leaflet';
// import { wellsFromCSV } from './Data2';
// import { useEffect, useState } from 'react';
// // import WellInfoButton from './components/button';
// // import { wells } from './Data';
// import { useSelector } from 'react-redux';
// // create custom icon
// const customIcon = new Icon({
// 	iconUrl: placeholderIcon,
// 	iconSize: [38, 38], // size of the icon
// });

// // custom cluster icon
// const createClusterCustomIcon = function (cluster) {
// 	return new divIcon({
// 		html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
// 		className: 'custom-marker-cluster',
// 		iconSize: point(33, 33, true),
// 	});
// };

// export default function App() {
// 	const wells = useSelector((state) => state.wells1);
// 	// const [csvWells, setCsvWells] = useState([]);
// 	// // // const wellsFromCSV = await fetchData();
// 	// useEffect(() => {
// 	// 	const fetchData = async () => {
// 	// 		try {
// 	// 			const wells = await wellsFromCSV();
// 	// 			console.log('Fetched wells:', wells);
// 	// 			setCsvWells(wells); // Set the fetched wells to state
// 	// 		} catch (error) {
// 	// 			console.error('Error fetching wells:', error);
// 	// 		}
// 	// 	};

// 	// 	fetchData();
// 	// }, []); // Empty dependency array ensures this runs only on mount
// 	// console.log('Wells from CSV:');
// 	// console.log(wellsFromCSV);
// 	console.log('Wells:');
// 	console.log(wells);
// 	console.log('CSV Wells:');
// 	// console.log(csvWells);
// 	return (
// 		// 48.8566, 2.3522
// 		<MapContainer center={[48.8566, 2.3522]} zoom={13}>
// 			<TileLayer
// 				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// 				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
// 			/>
// 			<MarkerClusterGroup
// 				chunkedLoading
// 				iconCreateFunction={createClusterCustomIcon}
// 			>
// 				{wells.map((marker) => (
// 					<Marker position={marker.geocode} icon={customIcon} key={marker.id}>
// 						<Popup key={`popup-${marker.id}`}>{marker.popUp}</Popup>
// 					</Marker>
// 				))}
// 				{/* {csvWells.map((marker) => (
// 					<Marker position={marker.geocode} icon={customIcon} key={marker.id}>
// 						<Popup key={`popup-${marker.id}`}>{marker.popUp}</Popup>
// 					</Marker>
// 				))} */}
// 			</MarkerClusterGroup>
// 		</MapContainer>
// 		// <WellInfoButton />
// 	);
// }

// import { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// // Optional: Install and import marker clustering if needed
// // import 'leaflet.markercluster';

// export default function MapComponent() {
// 	const mapRef = useRef(null);

// 	useEffect(() => {
// 		// Initialize the map
// 		const map = L.map(mapRef.current).setView([48.8566, 2.3522], 13);

// 		// Add a tile layer
// 		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 			attribution:
// 				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 		}).addTo(map);

// 		// Fetch markers and add them to the map
// 		const fetchMarkers = async () => {
// 			try {
// 				const markersData = await fetchMarkersData();
// 				markersData.forEach((marker) => {
// 					if (marker.geocode) {
// 						L.marker(marker.geocode)
// 							.addTo(map)
// 							.bindPopup(marker.popUp || 'No information available');
// 					}
// 				});

// 				// Optional: Add clustering
// 				// const markerClusterGroup = L.markerClusterGroup();
// 				// markersData.forEach((marker) => {
// 				//   if (marker.geocode) {
// 				//     const leafletMarker = L.marker(marker.geocode)
// 				//       .bindPopup(marker.popUp || 'No information available');
// 				//     markerClusterGroup.addLayer(leafletMarker);
// 				//   }
// 				// });
// 				// map.addLayer(markerClusterGroup);
// 			} catch (error) {
// 				console.error('Error fetching markers:', error);
// 			}
// 		};

// 		fetchMarkers();

// 		return () => {
// 			// Cleanup map instance
// 			map.remove();
// 		};
// 	}, []);

// 	// Fetch data function (replace with your API call)
// 	const fetchMarkersData = async () => {
// 		return [
// 			{ geocode: [48.8566, 2.3522], popUp: 'Marker 1' },
// 			{ geocode: [48.8568, 2.3524], popUp: 'Marker 2' },
// 		];
// 	};

// 	return (
// 		<div
// 			ref={mapRef}
// 			style={{ width: '100%', height: '500px' }} // Set map size
// 		></div>
// 	);
// }
