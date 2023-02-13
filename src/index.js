import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import TrailProvider from './store/TrailProvider';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<TrailProvider>
			<App />
		</TrailProvider>
	</React.StrictMode>,
);

