// Lets us update the current values of the form fields without triggering
// the server on every character change.
let timeOutID: any;
export const debounceFn = (fn: any, delay: number = 2000) => {
	return (...args: any) => {
		clearTimeout(timeOutID);
		timeOutID = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};
