import { Category, Post, Upload } from "@prisma/client";
import { prisma } from "@duncan-blog/shared";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import APICall from "../../../util/fetch";
import codesampleLanguages from "../../../util/codesample-languages";
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

			APICall<Post>(`posts`, { method: `POST`, jsonBody: { values, oldValues: post } })
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
											: Array.from(document.styleSheets)
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
													.join(`\n`),
									skin: `oxide-dark`,
									visualblocks_default_state: true,
									codesample_languages: codesampleLanguages,
									valid_children: `+body[style]`,
									//content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px }`,
								}}
							/>
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
