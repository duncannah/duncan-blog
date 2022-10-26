/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from "next/link";
import { useRouter } from "next/router";
import { HTMLAttributes } from "react";
import styles from "./pagination.module.scss";

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	setCurrentPage?: (page: number) => unknown;
	basePath?: string;
	hideIfSinglePage?: boolean;
}

export function Pagination({ currentPage, totalPages, setCurrentPage, basePath, hideIfSinglePage, ...props }: PaginationProps & HTMLAttributes<HTMLDivElement>) {
	const router = useRouter();

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
		if (page && page > 0 && page <= totalPages) basePath ? void router.push(`${basePath}page/${page}`) : setCurrentPage && setCurrentPage(page);
	};

	return (
		<div {...props} className={`${styles[`container`]} ${props.className || ``}`} style={hideIfSinglePage && totalPages <= 1 ? { display: `none` } : {}}>
			<Link href={basePath ? `${basePath}page/${currentPage + 1}` : ``}>
				<button disabled={currentPage === totalPages} onClick={() => setCurrentPage && setCurrentPage(currentPage + 1)}>{`◀`}</button>
			</Link>
			<div>&nbsp;</div>
			{pagination(7).map((page, index) => {
				if (page === `...`) return <button key={index} onClick={askForPage}>{`...`}</button>;

				return (
					<Link key={index} href={basePath ? (page !== 1 ? `${basePath}page/${page}` : basePath) : ``}>
						<button disabled={currentPage === page} onClick={() => setCurrentPage && setCurrentPage(page)}>
							{page}
						</button>
					</Link>
				);
			})}
			<div>&nbsp;</div>
			<Link href={basePath ? (currentPage !== 2 ? `${basePath}page/${currentPage - 1}` : basePath) : ``}>
				<button disabled={currentPage === 1} onClick={() => setCurrentPage && setCurrentPage(currentPage - 1)}>{`▶`}</button>
			</Link>
		</div>
	);
}

export default Pagination;
