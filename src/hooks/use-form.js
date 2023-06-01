import { useState } from 'react';

export default function useForm(formObj) {
	const [form, setForm] = useState(formObj);

	let processDataFunc;

	function renderFormInputs(callbackFunc = null) {
		processDataFunc = callbackFunc;

		return Object.values(form).map(inputObj => {
			const { label, value, valid, checked, errorMessage, renderInput } =
				inputObj;

			return renderInput(
				onInputChange,
				value,
				valid,
				checked,
				errorMessage,
				label,
			);
		});
	}

	function onInputChange(event) {
		const { id, value } = event.target;

		setForm(prevForm => {
			const inputObj = { ...prevForm[id] };

			if (inputObj.type === 'checkbox') {
				inputObj.checked = !inputObj.checked;
			}

			inputObj.value = value;
			inputObj.touched = true;

			if (processDataFunc) {
				processDataFunc(inputObj);
			}

			return { ...prevForm, [id]: inputObj };
		});
	}

	return renderFormInputs;
}
