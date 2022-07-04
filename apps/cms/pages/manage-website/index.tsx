import { HeaderLink } from "@prisma/client";
import { APICall } from "../../util/fetch";
import Link from "next/link";
import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import toast from "react-hot-toast";

const NavigationLinks: FC = () => {
	const [links, setLinks] = useState<Jsonify<HeaderLink>[] | null>(null);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		setUpdating(true);

		APICall.get<HeaderLink[]>(`navigation-links`)
			.then((links) => setLinks(links))
			.catch((e: Error) => toast.error(`Failed to fetch navigation links: ${e.message}`))
			.finally(() => setUpdating(false));
	}, []);

	const addNewLink = useCallback(() => {
		setLinks((links) => [...(links || []), { id: links?.length ?? 0, name: ``, url: ``, icon: `` }]);
	}, []);

	const removeLink = useCallback((id: number) => {
		setLinks((links) => (links || []).filter((l) => l.id !== id));
	}, []);

	const save = useCallback(() => {
		setUpdating(true);

		if (links)
			toast
				.promise(APICall.post(`navigation-links`, { data: links }), {
					loading: `Saving...`,
					success: `Saved!`,
					error: (e: Error) => `Failed to fetch navigation links: ${e.message}`,
				})
				.finally(() => setUpdating(false));
	}, [links]);

	const handleChange = useCallback(
		(id: number, key: string, value: unknown) => {
			setLinks((links) => links?.map((link) => (link.id === id ? { ...link, [key]: value } : link)) ?? links);
		},
		[setLinks],
	);

	const swapLinks = useCallback(
		(id1: number, id2: number) =>
			setLinks((links) => {
				const link1 = links?.find((l) => l.id === id1);
				const link2 = links?.find((l) => l.id === id2);

				if (!link1 || !link2) return links;

				return [...(links || []).filter((l) => l.id !== id1 && l.id !== id2), { ...link1, id: id2 }, { ...link2, id: id1 }];
			}),
		[setLinks],
	);

	return (
		<fieldset className={updating ? `disabled` : `` + ` table-wrapper`}>
			<legend>{`Navigation links`}</legend>
			{!links ? (
				<div>{`Loading...`}</div>
			) : (
				<>
					<div className={styles[`links`]}>
						{links.map((link) => (
							<div key={link.id} className={`hstack`}>
								<div className={styles[`order-controls`]}>
									<button onClick={() => swapLinks(link.id, link.id - 1)}>{`\u{1431}`}</button>
									<button onClick={() => swapLinks(link.id, link.id + 1)}>{`\u{142F}`}</button>
								</div>
								{link.id}
								<label>
									{`Name `} <input type={`text`} value={link.name} onChange={(e) => handleChange(link.id, `name`, e.target.value)} />
								</label>
								<label>
									{`URL `} <input type={`text`} value={link.url} onChange={(e) => handleChange(link.id, `url`, e.target.value)} />
								</label>
								<label>
									{`Icon `} <input type={`text`} value={link.icon || ``} onChange={(e) => handleChange(link.id, `icon`, e.target.value)} />
								</label>
								<button onClick={() => removeLink(link.id)}>{`X`}</button>
							</div>
						))}
					</div>
					<div className={`hstack`}>
						<button className={`active`} onClick={save}>{`Save`}</button> <button onClick={addNewLink}>{`+`}</button>
					</div>
				</>
			)}
		</fieldset>
	);
};

/* eslint-disable-next-line */
export interface ManageWebsiteProps {}

export function ManageWebsite(props: ManageWebsiteProps) {
	return (
		<div className={styles[`container`]}>
			<div className={`hstack`}>
				<h2>{`Manage website`}</h2>

				<Link href={`/`}>{`← Go back`}</Link>
			</div>

			<div>
				<NavigationLinks />
			</div>
		</div>
	);
}

export default ManageWebsite;
