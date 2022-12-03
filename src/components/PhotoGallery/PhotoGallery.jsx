import { Gallery, Item } from 'react-photoswipe-gallery';
import classes from './PhotoGallery.module.css';
import 'photoswipe/dist/photoswipe.css';

export default function PhotoGallery() {
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

  return (
    <Gallery uiElements={uiElements}>
      <div className={galleryBox}>
        <figure className={galleryImgBox}>
          <Item
            cropped
            original="https://farm4.staticflickr.com/3894/15008518202_c265dfa55f_h.jpg"
            thumbnail="https://farm4.staticflickr.com/3894/15008518202_b016d7d289_m.jpg"
            width="1600"
            height="1600"
            alt="Photo of seashore by Folkert Gorter"
          >
            {({ ref, open }) => (
              <img
                className={galleryImg}
                src="https://farm4.staticflickr.com/3894/15008518202_b016d7d289_m.jpg"
                alt="Thumbnail of seashore by Folkert Gorter"
                ref={ref}
                onClick={open}
              />
            )}
          </Item>
        </figure>
        <figure className={galleryImgBox}>
          <Item
            cropped
            original="https://farm6.staticflickr.com/5591/15008867125_b61960af01_h.jpg"
            thumbnail="https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg"
            width="1600"
            height="1068"
            alt="Photo of mountain lake by Samuel Rohl"
          >
            {({ ref, open }) => (
              <img
                className={galleryImg}
                src="https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg"
                alt="Thumbnail of mountain lake by Samuel Rohl"
                ref={ref}
                onClick={open}
              />
            )}
          </Item>
        </figure>
        <figure className={galleryImgBox}>
          <Item
            cropped
            original="https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_b.jpg"
            thumbnail="https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg"
            width="1600"
            height="1066"
            alt="Photo of fog in the village by Ales Krivec"
          >
            {({ ref, open }) => (
              <img
                className={galleryImg}
                src="https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg"
                alt="Thumbnail of fog in the village by Ales Krivec"
                ref={ref}
                onClick={open}
              />
            )}
          </Item>
        </figure>
        <figure className={galleryImgBox}>
          <Item
            cropped
            original="https://farm6.staticflickr.com/5584/14985868676_b51baa4071_h.jpg"
            thumbnail="https://farm6.staticflickr.com/5584/14985868676_4b802b932a_m.jpg"
            width="1600"
            height="1066"
            alt="Photo of river sunset by Michael Hull"
          >
            {({ ref, open }) => (
              <img
                className={galleryImg}
                src="https://farm6.staticflickr.com/5584/14985868676_4b802b932a_m.jpg"
                alt="Thumbnail of river sunset by Michael Hull"
                ref={ref}
                onClick={open}
              />
            )}
          </Item>
        </figure>
        <figure className={galleryImgBox}>
          <Item
            cropped
            original="https://farm4.staticflickr.com/3920/15008465772_d50c8f0531_h.jpg"
            thumbnail="https://farm4.staticflickr.com/3920/15008465772_383e697089_m.jpg"
            width="1600"
            height="1066"
            alt="Photo of bear by Thomas Lefebvre"
          >
            {({ ref, open }) => (
              <img
                className={galleryImg}
                src="https://farm4.staticflickr.com/3920/15008465772_383e697089_m.jpg"
                alt="Thumbnail of bear by Thomas Lefebvre"
                ref={ref}
                onClick={open}
              />
            )}
          </Item>
        </figure>
        <figure className={galleryImgBox}>
          <Item
            cropped
            original="https://farm4.staticflickr.com/3920/15008465772_d50c8f0531_h.jpg"
            thumbnail="https://farm4.staticflickr.com/3920/15008465772_383e697089_m.jpg"
            width="1600"
            height="1066"
            alt="Photo of bear by Thomas Lefebvre"
          >
            {({ ref, open }) => (
              <img
                className={galleryImg}
                src="https://farm4.staticflickr.com/3920/15008465772_383e697089_m.jpg"
                alt="Thumbnail of bear by Thomas Lefebvre"
                ref={ref}
                onClick={open}
              />
            )}
          </Item>
        </figure>
      </div>
    </Gallery>
  );
}
