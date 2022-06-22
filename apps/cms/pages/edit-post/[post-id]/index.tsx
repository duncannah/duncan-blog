import { Category, Post } from "@prisma/client";
import { prisma } from "@duncan-blog/shared";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import CollapsibleFieldset from "../../../components/collapsible-fieldset/collapsible-fieldset";
import CategorySelect from "../../../components/category-select/category-select";

import styles from "./index.module.scss";

export interface PostIdProps {
	post: Jsonify<Post> | null;
}

export function PostId({ post }: PostIdProps) {
	const [values, setValues] = useState<Jsonify<Partial<Post & { categories: Category[] }>>>(post || {});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();

	const editorRef = useRef<unknown>(null);

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
				.toLowerCase() || `untitled`
		}`;
		updateValue(`slug`, slug);
	}, [updateValue, values.title]);

	const submit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (isSubmitting) return;

			setIsSubmitting(true);

			fetch(`/api/posts`, {
				method: `POST`,
				headers: {
					"Content-Type": `application/json`,
				},
				body: JSON.stringify({ values, oldValues: post }),
			})
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					} else throw new Error(res.statusText);
				})
				.then((res: { data: Jsonify<Post> }) => {
					alert(`Success.`);

					// if slug changed, redirect to new slug
					if (post?.slug !== res.data.slug) void router.push(`/edit-post/${res.data.slug}`);
				})
				.catch((err: Error) => {
					console.error(err);
					alert(`Error: ${err.message}`);
				})
				.finally(() => {
					setIsSubmitting(false);
				});
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
							<Editor
								tinymceScriptSrc={`/tinymce/tinymce.min.js`}
								onInit={(evt, editor) => (editorRef.current = editor)}
								value={values[`content`] || ``}
								onEditorChange={(content) => {
									updateValue(`content`, content);
								}}
								init={{
									height: 500,
									// removed: quickbars, textpattern, imagetools, print, paste, hr, toc, noneditable
									plugins: `preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap emoticons`,
									menubar: `file edit view insert format tools table help`,
									toolbar: `undo redo | bold italic underline strikethrough removeformat | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | restoredraft visualchars visualblocks code`,
									contextmenu: `link table`,
									image_caption: true,

									font_size_formats: `25% 50% 75% 100% 125% 150% 175% 200%`,

									autosave_ask_before_unload: true,
									autosave_interval: `30s`,
									autosave_prefix: `{path}{query}-{id}-`,
									autosave_restore_when_empty: false,
									autosave_retention: `${72 * 60}m`,

									content_style:
										typeof document === `undefined`
											? ``
											: Array.prototype.slice
													.call(document.getElementsByTagName(`style`))
													.map((e: HTMLElement) => e.innerHTML)
													.join(` `),
									skin: `oxide-dark`,
									visualblocks_default_state: true,
									//content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px }`,
								}}
							/>
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

	let post = null;
	const postId = context.query[`post-id`];

	if (postId)
		post = await prisma.post.findFirst({
			where: {
				slug: postId.toString(),
			},
			include: {
				categories: true,
			},
		});

	return {
		props: {
			post: JSON.parse(JSON.stringify(post)) as unknown,
		},
	};
};

export default PostId;
