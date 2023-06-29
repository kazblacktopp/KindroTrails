import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './NavBar.module.css';

const {
	nav,
	logo,
	hamburger,
	line,
	line1,
	line2,
	line3,
	toggle,
	nav_links,
	link,
	link1,
	link2,
	link3,
	link4,
} = classes;

function NavBar() {
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

	const navLinksRef = useRef<HTMLUListElement | null>(null);

	function handleToggleMenu() {
		setShowMobileMenu(prevState => !prevState);
	}

	return (
		<header>
			<nav className={`${nav} ${showMobileMenu ? toggle : ''}`}>
				<Link to="/">
					<img
						className={logo}
						src="https://img.icons8.com/glyph-neue/64/425df3/home-page.png"
						alt="Home icon"
					/>
				</Link>

				<div className={hamburger} onClick={handleToggleMenu}>
					<div className={`${line} ${line1}`}></div>
					<div className={`${line} ${line2}`}></div>
					<div className={`${line} ${line3}`}></div>
				</div>

				<ul className={nav_links} ref={navLinksRef}>
					<li className={`${link} ${link1}`}>
						<Link to="/">Home</Link>
					</li>
					<li className={`${link} ${link2}`}>
						<a href="/">About</a>
					</li>
					<li className={`${link} ${link3}`}>
						<a href="/">Search</a>
					</li>
					<li className={`${link} ${link4}`}>
						<a href="/">Contact</a>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default NavBar;
