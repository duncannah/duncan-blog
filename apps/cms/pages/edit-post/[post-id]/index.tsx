import { Category, Post, Upload } from "@prisma/client";
import { prisma, md } from "@duncan-blog/shared";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

import { APICall } from "../../../util/fetch";
import CollapsibleFieldset from "../../../components/collapsible-fieldset/collapsible-fieldset";
import ManageUploads from "../../../components/manage-uploads/manage-uploads";
import CategorySelect from "../../../components/category-select/category-select";

import styles from "./index.module.scss";
import toast from "react-hot-toast";

type PostWithExtra = Post & {
	categories: Category[];
	uploads: (Upload & {
		mainImagePost: Post | null;
	})[];
};

export interface PostIdProps {
	post: Jsonify<Post> | null;
}

export function PostId({ post }: PostIdProps) {
	const [values, setValues] = useState<Jsonify<Partial<PostWithExtra>>>(post || {});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();

	const previewRef = useRef<HTMLIFrameElement>(null);

	// const editorRef = useRef<HTMLDivElement>(null);

	// useEffect(() => {
	// 	if (editorRef.current) {
	// 		monaco.editor.create(editorRef.current, {
	// 			value: values.content || ``,
	// 			language: `markdown`,
	// 			theme: `vs-dark`,
	// 			automaticLayout: true,
	// 		});
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const updateValue = useCallback((key: string, value: unknown) => {
		setValues((values) => ({ ...values, [key]: value }));
	}, []);

	const categoryOnChange = useCallback((categories: string[]) => {
		setValues((values) => ({ ...values, categories: categories.map((name) => ({ name })) }));
	}, []);

	const generateSlug = useCallback(() => {
		const date = new Date();
		const slug = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, `0`)}-${date.getDate().toString().padStart(2, `0`)}-${
			values.title
				?.replace(/\s+/g, `-`)
				.replace(/[^a-zA-Z0-9-]/g, ``)
				.replace(/-+$/, ``)
				.toLowerCase() || `untitled`
		}`;
		updateValue(`slug`, slug);
	}, [updateValue, values.title]);

	const handleUploadsChange = useCallback(
		(
			uploads: Jsonify<
				(Upload & {
					mainImagePost: Post | null;
				})[]
			>,
		) => {
			let mainFound = false;
			for (const up of uploads) {
				if (up.mainImagePost) {
					updateValue(`mainImageId`, up.id);
					mainFound = true;
					break;
				}
			}

			if (!mainFound) updateValue(`mainImageId`, null);

			updateValue(`uploads`, uploads);
		},
		[updateValue],
	);

	const submit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (isSubmitting) return;

			setIsSubmitting(true);

			APICall.post<Post>(`posts`, { data: { values, oldValues: post } })
				.then((newPost) => {
					toast.success(`Post updated!`);

					// if slug changed, redirect to new slug
					if (post?.slug !== newPost.slug) void router.push(`/edit-post/${newPost.slug}`);
				})
				.catch((e: Error) => toast.error(`Error updating post: ${e.message}`))
				.finally(() => setIsSubmitting(false));
		},
		[isSubmitting, post, router, values],
	);

	return (
		<div className={styles[`container`]}>
			<div className={`hstack`}>
				<h2>{`Editing a post`}</h2>
				<Link href={`/edit-post`}>{`← Go back`}</Link>
			</div>

			{!post ? (
				<p>{`Post not found`}</p>
			) : (
				<>
					<form action={``} method={`post`} onSubmit={submit} style={{ ...(isSubmitting ? { opacity: 0.25, pointerEvents: `none` } : {}) }}>
						<div>
							<CollapsibleFieldset legend={`Time`}>{`.`}</CollapsibleFieldset>
						</div>
						<div>
							<label htmlFor={`form_title`}>{`Title`}</label>
							<input type={`text`} id={`form_title`} value={values[`title`] || ``} onChange={(e) => updateValue(`title`, e.target.value)} />
						</div>
						<div>
							<div className={`hstack`}>
								<label htmlFor={`form_slug`}>{`Slug`}</label>
								<label>
									<a onClick={generateSlug}>{`Generate from title`}</a>
								</label>
							</div>

							<input type={`text`} id={`form_slug`} value={values[`slug`] || ``} onChange={(e) => updateValue(`slug`, e.target.value)} />
						</div>
						<div>
							<label>{`Content`}</label>
							<div className={styles.editor}>
								<Editor
									language={`markdown`}
									theme={`vs-dark`}
									value={values[`content`] || ``}
									options={{
										minimap: { enabled: false },
									}}
									width={`100%`}
									height={`400px`}
									onMount={() => {
										if (previewRef.current && previewRef.current?.contentWindow?.document) {
											const doc = previewRef.current.contentWindow.document;

											if (values[`content`]) doc.body.innerHTML = md.render(values[`content`]);

											doc.head.appendChild(doc.createElement(`style`)).innerHTML = Array.from(document.styleSheets)
												.map((styleSheet) => {
													try {
														return Array.from(styleSheet.cssRules)
															.map((rule) => rule.cssText)
															.join(``);
													} catch (e) {
														/* */
													}
												})
												.filter(Boolean)
												.join(`\n`);
										}
									}}
									onChange={(content) => {
										updateValue(`content`, content);

										if (previewRef.current && previewRef.current?.contentWindow?.document && content)
											previewRef.current.contentWindow.document.body.innerHTML = md.render(content);
									}}
								/>
								<div className={styles[`editor__preview`]}>
									<iframe ref={previewRef} srcDoc={``} />
								</div>
							</div>
						</div>
						<div>
							<fieldset>
								<legend>{`Uploads`}</legend>
								<ManageUploads uploads={values[`uploads`] || []} onChange={handleUploadsChange} post={post} />
							</fieldset>
						</div>
						<div>
							<fieldset>
								<legend>{`Categories`}</legend>
								<CategorySelect selected={values[`categories`]?.map(({ name }) => name) || []} onChange={categoryOnChange} />
							</fieldset>
						</div>
						<div>
							<fieldset>
								<legend>{`Flags`}</legend>
								<div>
									<label>
										<input type={`checkbox`} checked={!!values[`published`] || false} onChange={(e) => updateValue(`published`, e.target.checked)} />
										{` Published`}
									</label>
									<label>
										<input type={`checkbox`} checked={!!values[`isPage`] || false} onChange={(e) => updateValue(`isPage`, e.target.checked)} />
										{` Is page`}
									</label>
								</div>
							</fieldset>
						</div>
						<div style={{ textAlign: `center` }}>
							<button className={`active`}>{`Save changes`}</button>
						</div>
					</form>
				</>
			)}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	if (context.query[`post-id`] === `new`) {
		const post = await prisma.post.create({
			data: {
				slug: `${new Date().getTime()}-new`,
			},
		});

		return {
			redirect: {
				destination: `/edit-post/${post.slug}`,
				permanent: false,
			},
		};
	}

	let post: PostWithExtra | null = null;
	const postId = context.query[`post-id`];

	if (postId)
		post = await prisma.post.findFirst({
			where: {
				slug: postId.toString(),
			},
			include: {
				categories: true,
				uploads: {
					include: {
						mainImagePost: true,
					},
				},
			},
		});

	return {
		props: {
			post: JSON.parse(JSON.stringify(post)) as unknown,
		},
	};
};

export default PostId;
