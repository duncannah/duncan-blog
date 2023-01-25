import { z } from "zod";
import { prisma } from "./db";

// use .catch() instead of .optional() to avoid errors when parsing
export const settingsSchema = z.object({
	blogName: z.string().catch(process.env[`NEXT_PUBLIC_BLOG_NAME`] ?? `Blog`),
	blogFullName: z.string().catch(process.env[`NEXT_PUBLIC_BLOG_FULLNAME`] ?? `Blog`),
	headerLinks: z
		.array(
			z.object({
				name: z.string(),
				url: z.string(),
				icon: z.string(),
			}),
		)
		.catch([]),
});

export type Settings = z.infer<typeof settingsSchema>;

export async function getSettings(): Promise<Settings> {
	const settings = await prisma.settings.findMany();

	const settingsObject = settings.reduce((acc, setting) => {
		acc[setting.key] = setting.value;
		return acc;
	}, {} as Record<string, unknown>);

	return settingsSchema.parse(settingsObject);
}

export async function getSetting<T extends keyof Settings>(key: T): Promise<z.infer<typeof settingsSchema>[T]> {
	const settings = await prisma.settings.findFirst({
		where: {
			key,
		},
	});

	const parsed = settingsSchema.parse({
		[key]: settings?.value,
	});

	return parsed[key];
}

export async function setSetting<T extends keyof Settings>(key: T, value: z.infer<typeof settingsSchema>[T]): Promise<void> {
	await prisma.settings.upsert({
		where: {
			key,
		},
		update: {
			value,
		},
		create: {
			key,
			value,
		},
	});
}
