import { useEffect, useState } from "react";

interface FormTypeKeys {
	[key: string]: string | undefined;
}

export interface FormType extends FormTypeKeys {
	email: string;
	password: string;
}

// Prevent form submission if there are invalid fields
export const useRequired = (form: FormType) => {
	const [isValid, setIsValid] = useState(false);
	useEffect(() => {
		if (Object.keys(form).length > 0) {
			let isAllValid = true;
			for (let key in form) {
				if (!form[key]) {
					isAllValid = false;
					break;
				}
			}
			setIsValid(isAllValid);
		}
	}, [form]);

	return { isValid };
};
