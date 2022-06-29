import { NextPage } from "next";
import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Post } from "@prisma/client";

import APICall from "../../util/fetch";
import { Pagination } from "@duncan-blog/shared";
import CollapsibleFieldset from "../../components/collapsible-fieldset/collapsible-fieldset";

import styles from "./index.module.scss";

const Filter: FC<{
	filter: (values: Record<string, string>) => void;
}> = ({ filter }) => {
	const [values, setValues] = useState<Record<string, string>>({});

	const updateValue = (key: string, value: string) => {
		setValues((values) => ({ ...values, [key]: value }));
	};

	const reset = useCallback(() => {
		setValues({});
		filter({});
	}, [filter]);

	const submit = useCallback(() => {
		filter(Object.fromEntries(Object.entries(values).filter(([_, v]) => v.length)));
	}, [filter, values]);

	return (
		<CollapsibleFieldset className={styles[`filter`]} legend={`Filters`}>
			<CollapsibleFieldset legend={`Time`}>
				<fieldset>
					<legend>{`CreatedAt`}</legend>
					<input type={`datetime-local`} name={`createdAt-from`} value={values[`createdAt-from`] || ``} onChange={(e) => updateValue(`createdAt-from`, e.target.value)} />
					{`-`}
					<input type={`datetime-local`} name={`createdAt-to`} value={values[`createdAt-to`] || ``} onChange={(e) => updateValue(`createdAt-to`, e.target.value)} />
				</fieldset>
				<fieldset>
					<legend>{`UpdatedAt`}</legend>
					<input type={`datetime-local`} name={`updatedAt-from`} value={values[`updatedAt-from`] || ``} onChange={(e) => updateValue(`updatedAt-from`, e.target.value)} />
					{`-`}
					<input type={`datetime-local`} name={`updatedAt-to`} value={values[`updatedAt-to`] || ``} onChange={(e) => updateValue(`updatedAt-to`, e.target.value)} />
				</fieldset>
			</CollapsibleFieldset>
			<fieldset>
				<legend>{`Slug`}</legend>
				<input type={`text`} name={`slug`} value={values.slug || ``} onChange={(e) => updateValue(`slug`, e.target.value)} />
			</fieldset>
			<fieldset>
				<legend>{`Title`}</legend>
				<input type={`text`} name={`title`} value={values[`title`] || ``} onChange={(e) => updateValue(`title`, e.target.value)} />
			</fieldset>
			<fieldset>
				<legend>{`Content`}</legend>
				<input type={`text`} name={`content`} value={values[`content`] || ``} onChange={(e) => updateValue(`content`, e.target.value)} />
			</fieldset>
			<fieldset>
				<legend>{`Published`}</legend>
				<div>
					<input type={`radio`} name={`published`} id={`filter_published-none`} checked={!values[`published`]} onChange={() => updateValue(`published`, ``)} />
					<label htmlFor={`filter_published-none`}>{` -`}</label>
				</div>
				<div>
					<input type={`radio`} name={`published`} id={`filter_published-true`} checked={values[`published`] === `1`} onChange={() => updateValue(`published`, `1`)} />
					<label htmlFor={`filter_published-true`}>{` true`}</label>
				</div>
				<div>
					<input type={`radio`} name={`published`} id={`filter_published-false`} checked={values[`published`] === `0`} onChange={() => updateValue(`published`, `0`)} />
					<label htmlFor={`filter_published-false`}>{` false`}</label>
				</div>
			</fieldset>
			<fieldset>
				<legend>{`IsPage`}</legend>
				<div>
					<input type={`radio`} name={`isPage`} id={`filter_isPage-none`} checked={!values[`isPage`]} onChange={() => updateValue(`isPage`, ``)} />
					<label htmlFor={`filter_isPage-none`}>{` -`}</label>
				</div>
				<div>
					<input type={`radio`} name={`isPage`} id={`filter_isPage-true`} checked={values[`isPage`] === `1`} onChange={() => updateValue(`isPage`, `1`)} />
					<label htmlFor={`filter_isPage-true`}>{` true`}</label>
				</div>
				<div>
					<input type={`radio`} name={`isPage`} id={`filter_isPage-false`} checked={values[`isPage`] === `0`} onChange={() => updateValue(`isPage`, `0`)} />
					<label htmlFor={`filter_isPage-false`}>{` false`}</label>
				</div>
			</fieldset>
			<fieldset>
				<legend>{`👉`}</legend>
				<button onClick={reset}>{`Reset`}</button>
				<button className={`active`} onClick={submit}>{`Filter`}</button>
			</fieldset>
		</CollapsibleFieldset>
	);
};

export const EditPostIndex: NextPage = () => {
	const [posts, setPosts] = useState<Jsonify<Post[]> | null>(null);
	const [filters, setFilters] = useState<Record<string, string>>({});
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setPosts(null);

		APICall<Post[]>(`posts?${new URLSearchParams(filters).toString()}`)
			.then((posts) => setPosts(posts))
			.catch((e: Error) => toast.error(`Error fetching posts: ${e.message}`))
			.finally(() => setCurrentPage(1));
	}, [filters]);

	const filter = useCallback(
		(values: Record<string, string>) => {
			// only run the filter if the values have changed
			if (JSON.stringify(values) !== JSON.stringify(filters)) setFilters(values);
		},
		[filters],
	);

	const deletePost = useCallback((slug: string) => {
		if (!confirm(`Are you sure you want to delete this post?`)) return;

		APICall(`posts`, { method: `DELETE`, jsonBody: { slug } })
			.then(() => setPosts((posts) => posts?.filter((post) => post.slug !== slug) as Jsonify<Post[]>))
			.catch((e: Error) => toast.error(`Error deleting post: ${e.message}`));
	}, []);

	return (
		<div className={styles[`container`]}>
			<div className={`hstack`}>
				<h2>{`Create or edit a post`}</h2>

				<Link href={`/edit-post/new`}>
					<a>{`Create a new post 🆕`}</a>
				</Link>
			</div>

			<div>
				<Filter filter={filter} />
			</div>
			{!!Object.keys(filters).length && <div>{`Filters are applied.`}</div>}
			{posts === null ? (
				`Loading...`
			) : (
				<>
					<div className={`table-wrapper`}>
						<table>
							<thead>
								<tr>
									<th></th>
									<th>{`CreatedAt`}</th>
									<th>{`UpdatedAt`}</th>
									<th>{`Slug`}</th>
									<th>{`Title`}</th>
									<th>{`Published`}</th>
									<th>{`IsPage`}</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{posts.slice((currentPage - 1) * 10, currentPage * 10).map((post) => (
									<tr key={post.slug}>
										<td style={{ fontSize: `2em` }}>
											<Link href={`/edit-post/${post.slug}`}>{`→`}</Link>
										</td>
										<td style={{ fontSize: `0.75em` }}>{new Date(post.createdAt).toLocaleString()}</td>
										<td style={{ fontSize: `0.75em`, opacity: post.updatedAt === post.createdAt ? 0.5 : 1 }}>{new Date(post.updatedAt).toLocaleString()}</td>
										<td>{post.slug}</td>
										<td>{post.title}</td>
										<td style={{ color: post.published ? `lime` : `red` }}>{post.published.toString()}</td>
										<td style={{ color: post.isPage ? `lime` : `red` }}>{post.isPage.toString()}</td>
										<td>
											<button onClick={() => deletePost(post.slug)}>{`X`}</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}
			<Pagination className={styles[`pagination`]} currentPage={currentPage} totalPages={posts === null ? 0 : Math.ceil(posts.length / 10)} setCurrentPage={setCurrentPage} />
		</div>
	);
};

export default EditPostIndex;
