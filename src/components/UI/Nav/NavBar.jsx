import classes from './NavBar.module.css';

const { nav } = classes;

export default function NavBar({ onClickHome }) {
	return (
		<nav className={nav}>
			<ul>
				<li>
					<img
						onClick={onClickHome}
						src="https://img.icons8.com/glyph-neue/64/425df3/home-page.png"
						alt="Home icon"
					/>
				</li>
			</ul>
		</nav>
	);
}
