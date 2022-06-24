export const dateToString = (date: string | Date): string => {
	if (typeof date === `string`) date = new Date(date);

	return `${date.getDay().toString().padStart(2, `0`)} ${date.toLocaleString(`en`, { month: `short` })} ${date.getFullYear()}`;
};

export const getUploadURL = (id: string, fileName: string): string => {
	return process.env[`NODE_ENV`] === `production` ? `${process.env[`UPLOADS_URL`] || ``}/${id}/${fileName}` : `/api/uploads/preview/${id}`;
};

export const POSTS_PER_PAGE = 12;
