function capitaliseString(string) {
	const capitalisedString = string
		.split('_')
		.map(el => {
			return el[0].toUpperCase() + el.substring(1);
		})
		.join(' ');

	return capitalisedString;
}

export default capitaliseString;
