import axiosInstance from '../utils/axiosInstance';

const createWellInfo = async (wellData) => {
	try {
		const response = await axiosInstance.post('/create-well', wellData);
		console.log('Well information:', response.data); // Log or handle the response data
	} catch (error) {
		console.error(
			'Error creating well information:',
			error.response?.data || error.message
		); // Log the error
	}
};

const WellInfoButton = () => {
	const wellData = {
		WCRNUMBER: 'WCR1989-015763',
		WCRN: 'GAMA-10212',
		LEGACYLOGNO: '263955',
		COUNTY: 'Shasta',
		MTRS: 'M31N01W27',
		ACTIVITY: 'New Well',
		PLANNEDUSE: 'Domestic',
		DATEWELLCOMPLETED: '5/26/89',
		YEARWELLCOMPLETED: 1989,
		HOLEDEPTH: 428,
		COMPLETEDDEPTH: 428,
		TOPOFOPENINGS: 386,
		NUMBEROPENINTERVALS: 1,
		GENERALIZEDLITHOLOGY: 'Volcanic',
		DRILLINGCOMPANY: "Don's Drilling Co",
		DRILLERLICENSENO: '279177',
		DD_LONGITUDE: -121.9711154,
		DD_LATITUDE: 40.50824978,
		DATUM: 'WGS84',
		LOCATION_FROM: 'Address',
	};

	const handleCheckIn = () => {
		createWellInfo(wellData);
	};

	return (
		<div>
			<button onClick={handleCheckIn}>Check In</button>
		</div>
	);
};

export default WellInfoButton;
