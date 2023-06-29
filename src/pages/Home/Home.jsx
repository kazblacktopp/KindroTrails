import { Link } from 'react-router-dom';
import classes from './Home.module.css';

export default function Home() {
	const { section } = classes;

	return (
		<section className={section}>
			<h1>Welcome to Kindro Trails!</h1>
			<p>
				Where you can find information and recommended gear lists for
				the worlds most popular walking trails!
			</p>

			<h2>Search for your favourite trails:</h2>

			<Link to="/search">Search</Link>
		</section>
	);
}
