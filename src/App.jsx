import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/Root';
import HomePage from './pages/Home';
import SearchOptions from './components/Search/SearchOptions';
import CountryListPage, {
	loader as countryListLoader,
} from './components/Search/SearchByCountry/CountryList/CountryListPage';
import StateListPage from './components/Search/SearchByCountry/StateList/StateListPage';
import TrailListPage from './components/Search/SearchByCountry/TrailList/TrailListPage';
import TrailPage from './components/Trail/TrailPage/TrailPage';
import NewTrail from './components/NewTrail/NewTrail';
import ErrorPage from './pages/Error';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import LoginPage from './pages/Login';

export default function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <RootLayout />,
			errorElement: <ErrorPage />,
			children: [
				{ index: true, element: <HomePage /> },
				{ path: 'search', element: <SearchOptions /> },
				{ path: 'about', element: <AboutPage /> },
				{ path: 'contact', element: <ContactPage /> },
				{ path: 'login', element: <LoginPage /> },
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

