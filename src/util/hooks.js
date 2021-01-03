import { useState } from 'react';

export const useForm = (callback, initialState) => {
    const [values, setValues] = useState(initialState);

    const onSubmit = (event) => {
		event.preventDefault();
		callback();
	};
	const onChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
    };
    
    return {
        onSubmit,
        onChange,
        values
    };
}