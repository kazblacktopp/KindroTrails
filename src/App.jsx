import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Home from './pages/Home/Home.jsx';
import SearchOptions from './components/Search/SearchOptions';
import CountryListPage, {
	loader as countryListLoader,
} from './components/Search/SearchByCountry/CountryList/CountryListPage';
import StateListPage from './components/Search/SearchByCountry/StateList/StateListPage';
import TrailListPage from './components/Search/SearchByCountry/TrailList/TrailListPage';
import TrailPage from './components/Trail/TrailPage/TrailPage';
import NewTrail from './components/NewTrail/NewTrail';
import ErrorPage from './pages/Home/Error.jsx';
import About from './pages/Home/About';
import Contact from './pages/Home/Contact';

export default function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <RootLayout />,
			errorElement: <ErrorPage />,
			children: [
				{ index: true, element: <Home /> },
				{ path: 'search', element: <SearchOptions /> },
				{ path: 'about', element: <About /> },
				{ path: 'contact', element: <Contact /> },
				{
					path: 'search/country',
					loader: countryListLoader,
					element: <CountryListPage />,
				},
				{
					path: 'search/:countryId',
					element: <StateListPage />,
				},
				{
					path: 'search/:countryId/:stateId',
					element: <TrailListPage />,
				},
				{ path: 'trail/:trailId', element: <TrailPage /> },
				{ path: 'trail/new', element: <NewTrail /> },
			],
		},
	]);

	return <RouterProvider router={router} />;
}

