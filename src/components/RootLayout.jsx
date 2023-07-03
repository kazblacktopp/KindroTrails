import { Outlet, useNavigation } from 'react-router-dom';
import MainNavigation from './UI/Nav/NavBar';
import Spinner from './UI/Spinner/Spinner';

export default function RootLayout() {
	const navigation = useNavigation();

	const isLoading = navigation.state === 'loading';

	return (
		<>
			<MainNavigation />
			<main>{isLoading ? <Spinner /> : <Outlet />}</main>
		</>
	);
}
