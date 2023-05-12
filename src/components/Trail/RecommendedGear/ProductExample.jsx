// import classes from './ProductExample.module.css';

function ProductExample({ item }) {
	const { productTitle, productPageURL, productImageURL } = item;

	return (
		<figure>
			<a href={productPageURL} target="_blank" rel="noreferrer">
				<figcaption>{productTitle}</figcaption>
				<img src={productImageURL} alt="" width="50" height="50" />
			</a>
		</figure>
	);
}

export default ProductExample;
