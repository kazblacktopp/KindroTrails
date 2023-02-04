import { useState, useRef } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { sanitize } from 'dompurify';
import parse from 'html-react-parser';
import {
	PSWP_INFO_ICON_SVG_PATH,
	PSWP_CLOSE_BTN_SVG,
} from '../../../config/appConfig';
import Modal from '../../UI/Modal/Modal';

import 'photoswipe/dist/photoswipe.css';
import classes from './PhotoGallery.module.css';

export default function PhotoGallery({ photos }) {
	const [infoModal, setInfoModal] = useState(false);
	const modalContentRef = useRef();

	// UI elements on fullscreen photo
	const uiElements = [
		{
			// For thumbnails
			name: 'bulletsIndicator',
			order: 9,
			isButton: false,
			appendTo: 'wrapper',
			onInit: (el, pswpInstance) => {
				el.style.position = 'absolute';
				el.style.bottom = '20px';
				el.style.left = '10px';
				el.style.right = '0';
				el.style.display = 'grid';
				el.style.gridGap = '10px';
				el.style.gridTemplateColumns = 'repeat(auto-fit, 40px)';
				el.style.gridTemplateRows = 'repeat(auto-fit, 40px)';
				el.style.justifyContent = 'center';

				const dataSource = pswpInstance.options.dataSource;
				const thumbnails = [];

				for (let i = 0; i < dataSource.length; i++) {
					const slideData = dataSource[i];

					const thumbnail = document.createElement('div');
					thumbnail.style.transition = 'transform 0.15s ease-in';
					thumbnail.style.opacity = '0.6';
					thumbnail.style.border = '1px solid white';
					thumbnail.style.cursor = 'pointer';
					thumbnail.onclick = e => {
						const target = e.target;
						const thumbnailEl =
							target.tagName === 'IMG'
								? target.parentElement
								: e.target;
						pswpInstance.goTo(thumbnails.indexOf(thumbnailEl));
					};

					const thumbnailImage = document.createElement('img');
					thumbnailImage.setAttribute('src', slideData.msrc);
					thumbnailImage.style.width = '100%';
					thumbnailImage.style.height = '100%';
					thumbnailImage.style.objectFit = 'cover';

					thumbnail.appendChild(thumbnailImage);

					el.appendChild(thumbnail);

					thumbnails.push(thumbnail);
				}

				let prevIndex = -1;

				pswpInstance.on('change', () => {
					if (prevIndex >= 0) {
						const prevThumbnail = thumbnails[prevIndex];
						prevThumbnail.style.opacity = '0.6';
						prevThumbnail.style.cursor = 'pointer';
						prevThumbnail.style.transform = 'scale(1)';
					}

					const currentThumbnail = thumbnails[pswpInstance.currIndex];
					currentThumbnail.style.opacity = '1';
					currentThumbnail.style.cursor = 'unset';
					currentThumbnail.style.transform = 'scale(1.2)';

					prevIndex = pswpInstance.currIndex;
				});
			},
		},
		{
			// For attribution info button
			name: 'info',
			order: 6,
			ariaLabel: 'Photo attribution',
			isButton: true,
			html: {
				isCustomSVG: true,
				inner: PSWP_INFO_ICON_SVG_PATH,
				outlineID: 'pswp__icn-info',
			},
			appendTo: 'bar',
			onInit: (el, pswpInstance) => {
				// do something on UI element's init event
				pswpInstance.on('change', () => {
					const hasAttribution = pswpInstance.currSlide.data.caption;
					if (!hasAttribution) {
						el.style.display = 'none';
						return;
					}
					el.style.display = 'block';
				});
			},
			onClick: (e, el, pswpInstance) => {
				// do something on UI element's click environment
				const attributionHTML = pswpInstance.currSlide.data.caption;

				const cleanAttributionHTML = sanitize(attributionHTML, {
					USE_PROFILES: { html: true },
				});

				const attributionJSX = parse(cleanAttributionHTML);

				const cleanButtonSVG = parse(
					sanitize(PSWP_CLOSE_BTN_SVG, {
						USE_PROFILES: { svg: true, svgFilters: true },
					}),
				);

				const modalContent = (
					<div className={classes.attribution_modal}>
						<button
							className="pswp__button"
							type="button"
							title="Close modal"
							aria-label="Close modal"
							onClick={closeModalHandler}
						>
							{cleanButtonSVG}
						</button>
						<div onClick={sendLinksToNewWindow}>
							{attributionJSX}
						</div>
					</div>
				);

				modalContentRef.current = modalContent;

				setInfoModal(true);
			},
		},
	];

	function sendLinksToNewWindow(event) {
		if (event.target.tagName === 'A') {
			event.target.rel = 'noopener noreferrer';
			event.target.target = '_blank';
		}
	}

	function closeModalHandler() {
		setInfoModal(false);
	}

	const {
		gallery_box: galleryBox,
		'gallery-img_box': galleryImgBox,
		'gallery-img': galleryImg,
	} = classes;

	const photosContent = photos.map((photo, i) => {
		const {
			imageFullscreen,
			imageThumbnail,
			imageDescription,
			imageAttribution,
		} = photo;

		return (
			<figure key={`image_${i}`} className={galleryImgBox}>
				<Item
					cropped
					original={imageFullscreen.image}
					thumbnail={imageThumbnail.image}
					width={imageFullscreen.width}
					height={imageFullscreen.height}
					alt={imageDescription ? imageDescription : ''}
					caption={imageAttribution}
				>
					{({ ref, open }) => (
						<img
							className={galleryImg}
							src={imageThumbnail.image}
							width={imageThumbnail.width}
							height={imageThumbnail.height}
							alt={imageDescription ? imageDescription : ''}
							ref={ref}
							onClick={open}
						/>
					)}
				</Item>
			</figure>
		);
	});

	return (
		<Gallery uiElements={uiElements}>
			{infoModal && <Modal>{modalContentRef.current}</Modal>}
			<div className={galleryBox}>{photosContent}</div>
		</Gallery>
	);
}

