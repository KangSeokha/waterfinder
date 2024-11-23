import axiosInstance from '../utils/axiosInstance';

const getWellInfo = async () => {
	try {
		const response = await axiosInstance.get('/upload-csv');
		const wellsJson = JSON.stringify(response.data.wells);
		console.log('Well response:', response);
		console.log('Well information:', response.data.wells[0].latitude); // Log or handle the response data
		console.log('Well information (JSON):', wellsJson[0].latitude); // Log or handle the JSON string
	} catch (error) {
		console.error('Error fetching well information:', error); // Log the error
	}
};

const WellGetButton2 = () => {
	const handleCheckIn = () => {
		getWellInfo();
		// print(wells);
	};

	return (
		<div>
			<button onClick={handleCheckIn}>Get</button>
		</div>
	);
};

export default WellGetButton2;
