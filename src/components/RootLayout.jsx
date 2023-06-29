import { Outlet } from 'react-router-dom';
import NavBar from './UI/Nav/NavBar';

export default function RootLayout() {
	return (
		<>
			<NavBar />
			<main>
				<Outlet />
			</main>
		</>
	);
}
