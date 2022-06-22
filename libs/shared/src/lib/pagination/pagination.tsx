import { HTMLAttributes } from "react";
import styles from "./pagination.module.scss";

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;
	hideIfSinglePage?: boolean;
}

export function Pagination({ currentPage, totalPages, setCurrentPage, hideIfSinglePage, ...props }: PaginationProps & HTMLAttributes<HTMLDivElement>) {
	// thanks to https://stackoverflow.com/a/70263913/1488896
	const pagination = (count: number) => {
		const range = (lo: number, hi: number) => Array.from({ length: hi - lo }, (_, i) => i + lo);

		const start = Math.max(1, Math.min(currentPage - Math.floor((count - 3) / 2), totalPages - count + 2));
		const end = Math.min(totalPages, Math.max(currentPage + Math.floor((count - 2) / 2), count - 1));

		return [
			...(start > 2 ? [1, `...`] : start > 1 ? [1] : []),
			...range(start, end + 1),
			...(end < totalPages - 1 ? [`...`, totalPages] : end < totalPages ? [totalPages] : []),
		].reverse() as (number | "...")[];
	};

	const askForPage = () => {
		const page = parseInt(prompt(`Enter page number`) || ``, 10);
		if (page && page > 0 && page <= totalPages) setCurrentPage(page);
	};

	return (
		<div {...props} className={`${styles[`container`]} ${props.className || ``}`} style={hideIfSinglePage && totalPages <= 1 ? { display: `none` } : {}}>
			<button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>{`◀`}</button>
			<div>&nbsp;</div>
			{pagination(7).map((page, index) => {
				if (page === `...`) return <button key={index} onClick={askForPage}>{`...`}</button>;

				return (
					<button key={index} onClick={() => setCurrentPage(page)} disabled={currentPage === page}>
						{page}
					</button>
				);
			})}
			<div>&nbsp;</div>
			<button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>{`▶`}</button>
		</div>
	);
}

export default Pagination;
