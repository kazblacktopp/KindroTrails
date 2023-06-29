import { Outlet } from 'react-router-dom';
import NavBar from './UI/Nav/NavBar';
import classes from './RootLayout.module.css';

export default function RootLayout() {
	return (
		<>
			<NavBar />
			<main className={classes.content}>
				<Outlet />
			</main>
		</>
	);
}
