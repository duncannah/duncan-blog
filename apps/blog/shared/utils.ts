export const dateToString = (date: string | Date): string => {
	if (typeof date === `string`) date = new Date(date);

	return `${date.getDate().toString().padStart(2, `0`)} ${date.toLocaleString(`en`, { month: `short` })} ${date.getFullYear()}`;
};

export const getUploadURL = (id: string, fileName: string, UPLOADS_URL: string): string => {
	return process.env[`NODE_ENV`] === `development` ? `/api/uploads/preview/${id}` : `${UPLOADS_URL}/${id}/${fileName}`;
};

export const POSTS_PER_PAGE = 12;
