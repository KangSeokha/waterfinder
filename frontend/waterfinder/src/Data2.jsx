import axiosInstance from './utils/axiosInstance';

export const wellsFromCSV = async () => {
	try {
		const response = await axiosInstance.get('/read-csv');
		// const wells = response.data.wells;

		// Optional: Log for debugging
		console.log('Well response:', response.data);
		// console.log('Well information:', wells[0]?.latitude);

		return response.data; // Return the wells data
	} catch (error) {
		console.error('Error fetching well information:', error);
		throw error; // Re-throw the error for the caller to handle
	}
};
