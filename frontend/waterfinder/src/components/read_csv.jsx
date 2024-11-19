// import Papa from 'papaparse';
// import data from '../assets/ProcessedData/Processed_Well_Completion_Report.csv';

// const ReadCSVButton = () => {
//     const fs = require('fs');
//     const Papa = require('papaparse');
// 	const handleCheckIn = async () => {
// 		try {
// 			// const response = await fetch(
// 			// 	'/assets/ProcessedData/Processed_Well_Completion_Report.csv'
// 			// );
// 			// const response = await fetch(
// 			// 	'../assets/ProcessedData/Processed_Well_Completion_Report.csv'
// 			// );
// 			// if (!response.ok) {
// 			// 	throw new Error('Network response was not ok');
// 			// }
// 			// const data = await res.text();
// 			Papa.parse(data, {
// 				header: true,
// 				complete: (data) => {
// 					console.log('CSV data:', data.WCRNUMBER);
// 				},
// 			});
// 		} catch (error) {
// 			console.error('Error fetching or parsing CSV:', error);
// 		}
// 	};

// 	return (
// 		<div>
// 			<button onClick={handleCheckIn}>Read</button>
// 		</div>
// 	);
// };

// export default ReadCSVButton;
