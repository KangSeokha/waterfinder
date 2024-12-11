import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import WellInfoButton from './components/button';
import WellGetButton from './components/get_button';
import WellGetButton2 from './components/get_button2';
// import ReadCSVButton from './components/read_csv';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import WellReducer from './WellReducer';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
const store = configureStore({
	reducer: {
		wells1: WellReducer,
	},
});
root.render(
	<StrictMode>
		<Provider store={store}>
			<h1>Well Locations</h1>
			<App />
			<WellInfoButton />
			<WellGetButton />
			{/* <ReadCSVButton /> */}
			<WellGetButton2 />
		</Provider>
	</StrictMode>
);
