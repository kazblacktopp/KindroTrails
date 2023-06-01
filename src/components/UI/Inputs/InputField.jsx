function InputField(props) {
	const {
		label,
		type,
		id,
		name,
		value,
		handleChange,
		errorMessage,
		isValid,
		isChecked,
		renderLabelAfterInput = false,
	} = props;

	return (
		<div className="inputContainer">
			{!renderLabelAfterInput && <label htmlFor={id}>{label}</label>}
			<input
				type={type}
				id={id}
				name={name}
				value={value}
				onChange={handleChange}
				checked={isChecked}
			/>
			{renderLabelAfterInput && <label htmlFor={id}>{label}</label>}
			{errorMessage && !isValid && (
				<span className="error">{errorMessage}</span>
			)}
		</div>
	);
}

export default InputField;
