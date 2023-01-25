import Link from "next/link";
import React, { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { APICall } from "../../util/fetch";
import { Settings } from "@duncan-blog/shared";
import styles from "./index.module.scss";

interface SettingsSectionProps {
	settings: Jsonify<Settings> | null;
	setSettings: React.Dispatch<React.SetStateAction<SettingsSectionProps["settings"]>>;
}

const NavigationLinks: FC<SettingsSectionProps> = ({ settings, setSettings }) => {
	const addNewLink = useCallback(() => {
		setSettings((settings) => ({
			...settings,
			headerLinks: [...(settings?.headerLinks || []), { name: ``, url: ``, icon: `` }],
		}));
	}, [setSettings]);

	const removeLink = useCallback(
		(index: number) => {
			setSettings((settings) => ({
				...settings,
				headerLinks: (settings?.headerLinks || []).filter((_, i) => i !== index),
			}));
		},
		[setSettings],
	);

	const handleChange = useCallback(
		(index: number, key: string, value: unknown) => {
			setSettings((settings) => ({
				...settings,
				headerLinks: (settings?.headerLinks || []).map((link, i) => (i === index ? { ...link, [key]: value } : link)),
			}));
		},
		[setSettings],
	);

	const swapLinks = useCallback(
		(index1: number, index2: number) =>
			setSettings((settings) => {
				const links = settings?.headerLinks || [];
				const link1 = links[index1];
				const link2 = links[index2];

				if (!link1 || !link2) return settings;

				return { ...settings, headerLinks: links.map((link, i) => (i === index1 ? link2 : i === index2 ? link1 : link)) };
			}),
		[setSettings],
	);

	return (
		<fieldset className={`table-wrapper`}>
			<legend>{`Navigation links`}</legend>
			<div className={styles[`links`]}>
				{settings?.headerLinks.map((link, index) => (
					<div key={index} className={`hstack`}>
						<div className={styles[`order-controls`]}>
							<button onClick={() => swapLinks(index, index - 1)}>{`\u{1431}`}</button>
							<button onClick={() => swapLinks(index, index + 1)}>{`\u{142F}`}</button>
						</div>
						{index}
						<label>
							{`Name `} <input type={`text`} value={link.name} onChange={(e) => handleChange(index, `name`, e.target.value)} />
						</label>
						<label>
							{`URL `} <input type={`text`} value={link.url} onChange={(e) => handleChange(index, `url`, e.target.value)} />
						</label>
						<label>
							{`Icon `} <input type={`text`} value={link.icon || ``} onChange={(e) => handleChange(index, `icon`, e.target.value)} />
						</label>
						<button onClick={() => removeLink(index)}>{`X`}</button>
					</div>
				))}
			</div>
			<div className={`hstack`}>
				<button onClick={addNewLink}>{`+`}</button>
			</div>
		</fieldset>
	);
};

/* eslint-disable-next-line */
export interface ManageWebsiteProps {}

export function ManageWebsite(props: ManageWebsiteProps) {
	const [settings, setSettings] = useState<Jsonify<Settings> | null>(null);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		setUpdating(true);

		APICall.get<Settings>(`settings`)
			.then((settings) => setSettings(settings))
			.catch((e: Error) => toast.error(`Failed to fetch settings: ${e.message}`))
			.finally(() => setUpdating(false));
	}, []);

	const save = useCallback(() => {
		setUpdating(true);

		if (settings)
			toast
				.promise(APICall.post(`settings`, { data: settings }), {
					loading: `Saving...`,
					success: `Saved!`,
					error: (e: Error) => `Failed to save settings: ${e.message}`,
				})
				.finally(() => setUpdating(false));
	}, [settings]);

	return (
		<div className={styles[`container`]}>
			<div className={`hstack`}>
				<h2>{`Manage website`}</h2>

				<Link href={`/`}>{`← Go back`}</Link>
			</div>

			<div>
				<NavigationLinks {...{ settings, setSettings }} />
			</div>

			<div className={`hstack`}>
				<button onClick={save} disabled={updating}>
					{`Save`}
				</button>
			</div>
		</div>
	);
}

export default ManageWebsite;
