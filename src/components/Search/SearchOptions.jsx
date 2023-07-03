import { Link } from 'react-router-dom';
import classes from './SearchOptions.module.css';

export default function SearchOptions() {
	const {
		search_container_outer,
		search_container_inner,
		search_btn,
		coming_soon,
	} = classes;

	const countryBtnClasses = `btn btn_green ${search_btn}`;
	const nameBtnClasses = `btn_blue ${search_btn} ${coming_soon}`;
	const gradeBtnClasses = `btn_red ${search_btn} ${coming_soon}`;

	return (
		<div className={search_container_outer}>
			<h2>Search for a trail:</h2>
			<div className={search_container_inner}>
				<Link to="country" className={countryBtnClasses}>
					Search By Country
				</Link>
				<button className={nameBtnClasses} disabled>
					Search By Trail Name
				</button>
				<button className={gradeBtnClasses} disabled>
					Search By Grade
				</button>
			</div>
		</div>
	);
}
