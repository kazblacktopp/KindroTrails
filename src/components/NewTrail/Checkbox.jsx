import useForm from '../../hooks/use-form';

export default function Checkbox({ itemCategory, onInputChange }) {
	const checkboxes = useForm(itemCategory).bind(null, onInputChange);

	return checkboxes();
}
