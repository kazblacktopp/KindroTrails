import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Home from './pages/Home/Home.jsx';
import SearchOptions from './components/Search/SearchOptions';
import CountryListPage from './components/Search/SearchByCountry/CountryList/CountryListPage';
import StateListPage from './components/Search/SearchByCountry/StateList/StateListPage';
import TrailListPage from './components/Search/SearchByCountry/TrailList/TrailListPage';
import TrailPage from './components/Trail/TrailPage/TrailPage';
import NewTrail from './components/NewTrail/NewTrail';
import Error from './pages/Home/Error.jsx';
import About from './pages/Home/About';
import Contact from './pages/Home/Contact';

export default function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <RootLayout />,
			errorElement: <Error />,
			children: [
				{ path: '/', element: <Home /> },
				{ path: 'search', element: <SearchOptions /> },
				{ path: 'about', element: <About /> },
				{ path: 'contact', element: <Contact /> },
				{ path: 'search/country', element: <CountryListPage /> },
				{
					path: 'search/:countryId',
					element: <StateListPage />,
				},
				{
					path: 'search/:countryId/:stateId',
					element: <TrailListPage />,
				},
				{ path: ':trailId', element: <TrailPage /> },
				{ path: 'new-trail', element: <NewTrail /> },
			],
		},
	]);

	return <RouterProvider router={router} />;
}

