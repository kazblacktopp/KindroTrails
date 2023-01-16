import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import classes from './PhotoGallery.module.css';

export default function PhotoGallery({ photos, trailTitle }) {
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
              target.tagName === 'IMG' ? target.parentElement : e.target;
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
  ];

  const {
    gallery_box: galleryBox,
    'gallery-img_box': galleryImgBox,
    'gallery-img': galleryImg,
  } = classes;

  const photosContent = photos.map((photo, i) => {
    const { imageFullscreen, imageThumbnail, imageAttribution } = photo;

    return (
      <figure key={`image_${i}`} className={galleryImgBox}>
        <Item
          cropped
          original={imageFullscreen.image}
          thumbnail={imageThumbnail.image}
          width={imageFullscreen.width}
          height={imageFullscreen.height}
          alt={`${trailTitle} ${i + 1}`}
          caption={imageAttribution}
        >
          {({ ref, open }) => (
            <img
              className={galleryImg}
              src={imageThumbnail.image}
              alt={`${trailTitle} ${i + 1}`}
              ref={ref}
              onClick={open}
            />
          )}
        </Item>
      </figure>
    );
  });

  return (
    <Gallery uiElements={uiElements} withCaption>
      <div className={galleryBox}>{photosContent}</div>
    </Gallery>
  );
}
