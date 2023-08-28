import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import App from './app.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
		<BrowserRouter>
				<Header/> 
				<App/>
				<Footer/> 
	</BrowserRouter>
);
