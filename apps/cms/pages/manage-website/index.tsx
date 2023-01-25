import Link from "next/link";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useImmer, Updater } from "use-immer";

import toast from "react-hot-toast";

import { APICall } from "../../util/fetch";
import { Settings } from "@duncan-blog/shared";
import styles from "./index.module.scss";

interface SettingsSectionProps {
	settings: Jsonify<Settings | null>;
	setSettings: Updater<SettingsSectionProps["settings"]>;
}

const Metadata: FC<SettingsSectionProps> = ({ settings, setSettings }) => {
	const handleChange = useCallback(
		(key: "blogName" | "blogFullName" | "favicon", value: string) =>
			setSettings((settings) => {
				settings && (settings[key] = value);
			}),
		[setSettings],
	);

	return (
		<fieldset>
			<legend>{`Metadata`}</legend>

			<div className={`form`}>
				<label>{`Blog name `}</label>
				<input type={`text`} value={settings?.blogName || ``} onChange={(e) => handleChange(`blogName`, e.target.value)} />
				<label>{`Blog full name `}</label>
				<input type={`text`} value={settings?.blogFullName || ``} onChange={(e) => handleChange(`blogFullName`, e.target.value)} />
				<label>{`Favicon `}</label>
				<input type={`text`} value={settings?.favicon || ``} onChange={(e) => handleChange(`favicon`, e.target.value)} />
			</div>
		</fieldset>
	);
};

const NavigationLinks: FC<SettingsSectionProps> = ({ settings, setSettings }) => {
	const addNewLink = useCallback(
		() =>
			setSettings((settings) => {
				settings && settings.headerLinks.push({ name: ``, url: ``, icon: `` });
			}),
		[setSettings],
	);

	const removeLink = useCallback(
		(index: number) =>
			setSettings((settings) => {
				delete settings?.headerLinks[index];
			}),
		[setSettings],
	);

	const handleChange = useCallback(
		(index: number, key: keyof Settings["headerLinks"][0], value: string) =>
			setSettings((settings) => {
				settings && (settings.headerLinks[index][key] = value);
			}),
		[setSettings],
	);

	const swapLinks = useCallback(
		(index1: number, index2: number) =>
			setSettings((settings) => {
				if (!settings) return;

				const temp = settings.headerLinks[index1];
				settings.headerLinks[index1] = settings.headerLinks[index2];
				settings.headerLinks[index2] = temp;
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
	const [settings, setSettings] = useImmer<Jsonify<Settings> | null>(null);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		setUpdating(true);

		APICall.get<Settings>(`settings`)
			.then((settings) => setSettings(settings))
			.catch((e: Error) => toast.error(`Failed to fetch settings: ${e.message}`))
			.finally(() => setUpdating(false));
	}, [setSettings]);

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

			{settings === null ? (
				<div>{`Loading...`}</div>
			) : (
				<div>
					<Metadata {...{ settings, setSettings }} />
					<NavigationLinks {...{ settings, setSettings }} />
				</div>
			)}

			<div className={`hstack`}>
				<button onClick={save} disabled={updating}>
					{`Save`}
				</button>
			</div>
		</div>
	);
}

export default ManageWebsite;
