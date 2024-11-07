import axiosInstance from '../utils/axiosInstance';

const createWellInfo = async (latitude, longitude, name) => {
	try {
		const response = await axiosInstance.post('/create-well', {
			latitude,
			longitude,
			name,
		});
		console.log('Well information:', response.data); // Log or handle the response data
	} catch (error) {
		console.error('Error fetching well information:', error); // Log the error
	}
};

const WellInfoButton = () => {
	const latitude = 36.7793;
	const longitude = -119.4199;
	const name = 'nana';
	const handleCheckIn = () => {
		createWellInfo(latitude, longitude, name);
	};

	return (
		<div>
			<button onClick={handleCheckIn}>Check In</button>
		</div>
	);
};

export default WellInfoButton;
