import './styles.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import placeholderIcon from './icons/placeholder.png';
import { Icon, divIcon, point } from 'leaflet';
// import WellInfoButton from './components/button';
// import { wells } from './Data';
import { useSelector } from 'react-redux';
// create custom icon
const customIcon = new Icon({
	iconUrl: placeholderIcon,
	iconSize: [38, 38], // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
	return new divIcon({
		html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
		className: 'custom-marker-cluster',
		iconSize: point(33, 33, true),
	});
};

// markers;

export default function App() {
	const wells = useSelector((state) => state.wells1);
	console.log(wells);
	return (
		// 48.8566, 2.3522
		<MapContainer center={[48.8566, 2.3522]} zoom={13}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			<MarkerClusterGroup
				chunkedLoading
				iconCreateFunction={createClusterCustomIcon}
			>
				{wells.map((marker) => (
					<Marker position={marker.geocode} icon={customIcon} key={marker.id}>
						<Popup key={`popup-${marker.id}`}>{marker.popUp}</Popup>
					</Marker>
				))}
			</MarkerClusterGroup>
		</MapContainer>
		// <WellInfoButton />
	);
}
