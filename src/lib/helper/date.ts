export const isExpired = (date: Date, refDate: Date) => {
	return date.getTime() < refDate.getTime();
};
