import { useRouteError } from 'react-router-dom';
import MainNavigation from '../../components/UI/Nav/NavBar';

export default function ErrorPage() {
	const error = useRouteError();

	let title = 'An error cccurred!';
	let message = 'Something went wrong!';

	if (error.status === 404) {
		title = 'Page not found!';
		message = 'The page you are looking for does not exist.';
	}

	if (error.status === 500) {
		message = error.data.message;
	}

	return (
		<>
			<MainNavigation />
			<main>
				<h1>{title}</h1>
				<p>{message}</p>
			</main>
		</>
	);
}
