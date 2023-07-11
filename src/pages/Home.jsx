import { Link } from 'react-router-dom';

export default function HomePage() {
	return (
		<section>
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
