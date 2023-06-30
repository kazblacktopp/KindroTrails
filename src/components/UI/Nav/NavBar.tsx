import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
	active,
} = classes;

function NavBar() {
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

	const navLinksRef = useRef<HTMLUListElement | null>(null);

	function handleToggleMenu() {
		const windowWidth = window.innerWidth;

		if (windowWidth < 756) {
			setShowMobileMenu(prevState => !prevState);
		}
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
						<NavLink
							to="/"
							className={({ isActive }) =>
								isActive ? active : undefined
							}
							end
							onClick={handleToggleMenu}
						>
							Home
						</NavLink>
					</li>
					<li className={`${link} ${link3}`}>
						<NavLink
							to="/search"
							className={({ isActive }) =>
								isActive ? active : undefined
							}
							onClick={handleToggleMenu}
						>
							Search
						</NavLink>
					</li>
					<li className={`${link} ${link2}`}>
						<NavLink
							to="/about"
							className={({ isActive }) =>
								isActive ? active : undefined
							}
							onClick={handleToggleMenu}
						>
							About
						</NavLink>
					</li>
					<li className={`${link} ${link4}`}>
						<NavLink
							to="/contact"
							className={({ isActive }) =>
								isActive ? active : undefined
							}
							onClick={handleToggleMenu}
						>
							Contact
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default NavBar;
