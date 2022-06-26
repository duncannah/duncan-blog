import { Loader } from "@duncan-blog/shared";
import { Post, Upload } from "@prisma/client";
import { FileUploadOptions } from "../../pages/api/uploads/post";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../modal/modal";

import styles from "./manage-uploads.module.scss";

function humanFileSize(size: number) {
	const i = Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / Math.pow(1024, i)).toFixed(2)} ${[`B`, `kB`, `MB`, `GB`, `TB`][i]}`;
}

function getHostnameFromURL(url: string) {
	try {
		return new URL(url).hostname;
	} catch (e) {
		return `[bad url]`;
	}
}

const UploadProgress = ({ id }: { id: string }) => {
	const [progress, setProgress] = useState(``);

	useEffect(() => {
		function checkProgress() {
			void fetch(`/api/uploads/progress/${id}`)
				.then((res) => res.json())
				.then((res: { data: Upload["processingProgress"] }) => setProgress(res.data || ``))
				.then(() => progress.endsWith(`%`) && setTimeout(checkProgress, 3000));
		}

		checkProgress();
	});

	return <span style={{ color: progress === `FAIL` ? `red` : progress === `DONE` ? `skyblue` : `` }}>{`${progress}`}</span>;
};

const UploadDialog = ({
	close,
	postId,
	onChange,
}: {
	close: () => unknown;
	postId: string;
	onChange: (
		uploads: Jsonify<
			(Upload & {
				mainImagePost: Post | null;
			})[]
		>,
	) => void;
}) => {
	const [type, setType] = useState<"upload" | "remote">(`upload`);
	const [files, setFiles] = useState<({ file: File } & FileUploadOptions)[]>([]);
	const [uploading, setUploading] = useState(false);

	const fileSubmitRef = useRef<HTMLInputElement>(null);

	const handleTypeChange = useCallback(
		(newType: typeof type) => {
			if (uploading) return;

			if (type !== newType) setFiles([]);

			setType(newType);
		},
		[type, uploading],
	);

	const handleInputFile = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (uploading) return;

			if (e.target?.files) setFiles(Array.from(e.target?.files).map((file) => ({ file, toStripMetaData: true })));
		},
		[uploading],
	);

	const upload = useCallback(() => {
		if (uploading) return;

		void uploadFiles();

		async function uploadFiles() {
			setUploading(true);

			const formData = new FormData();

			formData.append(`postId`, `${postId}`);

			files.forEach((file, i) => {
				formData.append(`file-${i}`, file.file, file.file.name);
				formData.append(`options-${i}`, JSON.stringify(file));
			});

			await fetch(`/api/uploads/post`, {
				method: `POST`,
				body: formData,
			})
				.then((res) => {
					if (!res.ok) throw res;
					return res.json();
				})
				.then(
					({
						data,
					}: {
						data: Jsonify<
							(Upload & {
								mainImagePost: Post | null;
							})[]
						>;
					}) => {
						onChange(data);
						setFiles([]);
						if (fileSubmitRef.current) fileSubmitRef.current.value = ``;
					},
				)
				.catch((e: Error) => {
					console.error(e);
					alert(`Upload failed: ${e.message}`);
				})
				.finally(() => setUploading(false));
		}
	}, [files, onChange, postId, uploading]);

	return (
		<Modal close={() => !uploading && close()}>
			<div>{`I want to:`}</div>
			<div className={`hstack`}>
				<label>
					<input type={`radio`} name={`createNew`} value={`upload`} checked={type === `upload`} onChange={() => handleTypeChange(`upload`)} />
					{` Upload files`}
				</label>
				<label>
					<input type={`radio`} name={`createNew`} value={`external`} checked={type === `remote`} onChange={() => handleTypeChange(`remote`)} />
					{` Use an external resource`}
				</label>
			</div>
			{type === `upload` ? (
				<>
					<div className={styles[`drop-area`]}>
						<div>{`Drop files here to upload`}</div>
						<div>{`or`}</div>
						<div>{`click to select files`}</div>
						<input type={`file`} ref={fileSubmitRef} onChange={handleInputFile} multiple={true} />
					</div>
					<div className={styles[`upload-list`]}>
						{files.map(({ file, toStripMetaData, convertTo, resizeTo }) => (
							<div key={file.name}>
								<div>{file.name}</div>
								<div>{humanFileSize(file.size)}</div>
								<div>
									<label>
										<input
											type={`checkbox`}
											checked={toStripMetaData}
											onChange={(e) => setFiles((files) => files.map((f) => (f.file === file ? { ...f, toStripMetaData: e.target.checked } : f)))}
										/>
										{` Strip metadata if possible`}
									</label>
								</div>
								{(file.type.startsWith(`image/`) || file.type.startsWith(`video/`)) && (
									<div>
										<label>
											<input
												type={`checkbox`}
												checked={!!convertTo}
												onChange={(e) =>
													!!convertTo &&
													setFiles((files) => files.map((f) => (f.file === file ? { ...f, convertTo: e.target.checked ? e.target.value : null } : f)))
												}
											/>
											{` Convert to: `}
											<select
												value={convertTo || ``}
												onChange={(e) => setFiles((files) => files.map((f) => (f.file === file ? { ...f, convertTo: e.target.value } : f)))}>
												<option value={``}>{`-`}</option>
												{file.type.startsWith(`image/`) ? (
													<>
														<option value={`webp`}>{`webp`}</option>
														<option value={`jpg`}>{`jpg`}</option>
														<option value={`png`}>{`png`}</option>
													</>
												) : (
													<>
														<option value={`webm`}>{`webm`}</option>
														<option value={`mp4`}>{`mp4`}</option>
													</>
												)}
											</select>
										</label>
										<label>
											<input
												type={`checkbox`}
												checked={!!resizeTo}
												onChange={(e) =>
													!!resizeTo &&
													setFiles((files) => files.map((f) => (f.file === file ? { ...f, resizeTo: e.target.checked ? e.target.value : null } : f)))
												}
											/>
											{` Resize to: `}
											<select
												value={resizeTo || ``}
												onChange={(e) => setFiles((files) => files.map((f) => (f.file === file ? { ...f, resizeTo: e.target.value } : f)))}>
												<option value={``}>{`-`}</option>
												<option value={`360`}>{`360p`}</option>
												<option value={`720`}>{`720p`}</option>
												<option value={`1080`}>{`1080p`}</option>
												<option value={`1440`}>{`1440p`}</option>
												<option value={`2160`}>{`2160p`}</option>
											</select>
										</label>
									</div>
								)}
							</div>
						))}
					</div>
					<div className={`hstack`}>
						<div></div>
						<div>
							{uploading && (
								<>
									<Loader />
									{` `}
								</>
							)}

							<button type={`button`} className={`active`} onClick={upload} disabled={uploading}>{`Upload`}</button>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</Modal>
	);
};

export interface ManageUploadsProps {
	post: Jsonify<Post>;
	uploads: Jsonify<
		(Upload & {
			mainImagePost: Post | null;
		})[]
	>;
	onChange: (
		uploads: Jsonify<
			(Upload & {
				mainImagePost: Post | null;
			})[]
		>,
	) => void;
}

export function ManageUploads({ post, uploads, onChange }: ManageUploadsProps) {
	const [createNewDialog, setCreateNewDialog] = useState(false);

	const copyToClipboard = useCallback((url: string) => {
		navigator.clipboard.writeText(url).catch(() => alert(`Failed to copy to clipboard`));
	}, []);

	const deleteUpload = useCallback(
		(id: string) => {
			if (!window.confirm(`Are you sure you want to delete this upload?`)) return;

			void deleteUpload();

			async function deleteUpload() {
				const response = await fetch(`/api/uploads`, {
					method: `DELETE`,
					headers: {
						"Content-Type": `application/json`,
					},
					body: JSON.stringify({ id }),
				});

				if (!response.ok) return alert(`Failed to delete upload`);

				onChange(uploads.filter((u) => u.id !== id));
			}
		},
		[onChange, uploads],
	);

	return (
		<div className={styles[`container`]}>
			{uploads.map((upload) => (
				<div key={upload.id} className={styles[`upload`]}>
					<div className={styles[`preview`]}>
						{upload.mimetype.startsWith(`image/`) ? (
							<img src={`/api/uploads/preview/${upload.id}/${upload.name}`} alt={upload.name} />
						) : (
							<svg xmlns={`http://www.w3.org/2000/svg`} width={`300`} height={`150`} viewBox={`0 0 300 150`}>
								<rect
									fill={`hsl(${
										parseInt(
											upload.mimetype
												.split(``)
												.map((c) => c.charCodeAt(0))
												.join(``),
										) % 255
									}, 100%, 20%)`}
									width={`300`}
									height={`150`}
								/>
								<text
									fill={`rgba(255,255,255,0.5)`}
									fontFamily={`sans-serif`}
									fontSize={`30`}
									dy={`10.5`}
									fontWeight={`bold`}
									x={`50%`}
									y={`50%`}
									textAnchor={`middle`}>
									{upload.mimetype}
								</text>
							</svg>
						)}
					</div>
					<div className={styles[`info`]}>
						<div>
							<strong>
								{upload.name}
								{upload.mainImagePost ? ` 🏞` : ``}
							</strong>
						</div>
						<div>{upload.mimetype}</div>
						<div>{upload.size ? humanFileSize(upload.size) : `??.?? kB`}</div>
						<div>
							{upload.url ? (
								<span style={{ color: `red` }}>{`External (${getHostnameFromURL(upload.url)})`}</span>
							) : (
								<span style={{ color: `lime` }}>
									{`Internal`}
									{upload.processingProgress !== null ? (
										<>
											{` (`}
											<UploadProgress id={upload.id} />
											{`)`}
										</>
									) : (
										``
									)}
								</span>
							)}
						</div>
					</div>
					<div className={styles[`actions`]}>
						<button
							type={`button`}
							className={`active`}
							onClick={() => copyToClipboard(upload.url || `/api/uploads/preview/${upload.id}/${upload.name}`)}>{`Copy address`}</button>
						{/* <button type={`button`}>{`Edit`}</button> */}
						<button type={`button`} onClick={() => deleteUpload(upload.id)}>{`Delete`}</button>
						<button
							type={`button`}
							disabled={!!upload.mainImagePost || !upload.mimetype.startsWith(`image/`)}
							onClick={() => onChange(uploads.map((u) => ({ ...u, mainImagePost: u.id === upload.id ? post : null })))}>{`Set as main image`}</button>
					</div>
				</div>
			))}
			<div className={`hstack`}>
				<div></div>
				<div>
					<button type={`button`} className={`active`} onClick={() => setCreateNewDialog(true)}>{`Create new`}</button>
				</div>
			</div>
			{createNewDialog && <UploadDialog close={() => setCreateNewDialog(false)} onChange={onChange} postId={post.slug} />}
		</div>
	);
}

export default ManageUploads;
