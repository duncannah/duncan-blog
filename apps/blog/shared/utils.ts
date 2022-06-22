export const dateToString = (date: string | Date): string => {
	if (typeof date === `string`) date = new Date(date);

	return `${date.getDay().toString().padStart(2, `0`)} ${date.toLocaleString(`en`, { month: `short` })} ${date.getFullYear()}`;
};

export const POSTS_PER_PAGE = 12;
