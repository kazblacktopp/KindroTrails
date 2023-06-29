import { useRef, useState } from 'react';
import classes from './NavBar.module.css';

type NavBarProps = {
	onClickHome: () => void;
	onClickAddTrail: () => void;
	isAuth: boolean;
};

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
	link5,
} = classes;

function NavBar({ onClickHome, onClickAddTrail, isAuth }: NavBarProps) {
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

	const navLinksRef = useRef<HTMLUListElement | null>(null);

	function handleToggleMenu() {
		setShowMobileMenu(prevState => !prevState);
	}

	return (
		<nav className={`${nav} ${showMobileMenu ? toggle : ''}`}>
			<img
				className={logo}
				onClick={onClickHome}
				src="https://img.icons8.com/glyph-neue/64/425df3/home-page.png"
				alt="Home icon"
			/>

			<div className={hamburger} onClick={handleToggleMenu}>
				<div className={`${line} ${line1}`}></div>
				<div className={`${line} ${line2}`}></div>
				<div className={`${line} ${line3}`}></div>
			</div>

			<ul className={nav_links} ref={navLinksRef}>
				<li className={`${link} ${link1}`}>
					<a href="/">Home</a>
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
				{isAuth && (
					<li
						className={`${link} ${link5} btn btn_blue`}
						onClick={onClickAddTrail}
					>
						+ Add New Trail
					</li>
				)}
			</ul>
		</nav>
	);
}

export default NavBar;
