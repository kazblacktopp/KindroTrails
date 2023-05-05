import useForm from '../../hooks/use-form';

export default function Checkbox({ categoryItems, onChange }) {
	const checkboxes = useForm(categoryItems).bind(null, onChange);

	return checkboxes();
}
