import Card from '../../UI/Card/Card';

import classes from './ProductExample.module.css';

function ProductExample({ item }) {
	const { productTitle, productPageURL, productImageURL } = item;

	const { product_container, product_link, product_title, product_img } =
		classes;

	return (
		<Card>
			<figure className={product_container}>
				<a
					href={productPageURL}
					target="_blank"
					rel="noreferrer"
					className={product_link}
				>
					<figcaption className={product_title}>
						{productTitle}
					</figcaption>
					<img
						src={productImageURL}
						alt={productTitle}
						className={product_img}
					/>
				</a>
			</figure>
		</Card>
	);
}

export default ProductExample;
