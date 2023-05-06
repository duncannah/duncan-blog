import { promises as fs } from "fs";
import { spawn } from "child_process";

let queue = 0;

export let lastRebuild: string | null = process.env[`NODE_ENV`] === `development` ? `DEVELOPMENT` : null;

export const triggerRebuild = (): void => {
	if (!process.env[`REBUILD_PATH`]) throw new Error(`REBUILD_PATH is not set`);

	if (process.env[`NODE_ENV`] === `development`) return;

	queue++;

	if (queue > 1) return;

	void rebuild();

	async function rebuild() {
		lastRebuild = `REBUILDING: ${new Date().toISOString()}`;

		try {
			await new Promise<void>((resolve, reject) => {
				const sub = spawn(`npx`, [`nx`, `run`, `blog:export`], { cwd: process.env[`REBUILD_PATH`] });

				let stderr = ``;
				sub.stderr.on(`data`, (data) => (stderr += data));

				sub.on(`close`, (code) => {
					if (code !== 0) {
						console.error(stderr);
						return reject(`Process exited with code ${code ?? `null`}\n\n${stderr}`);
					}

					return resolve();
				});
			});

			if (process.env[`EXPORT_PATH`]) {
				await fs.cp(`${process.env[`REBUILD_PATH`] || ``}/dist/apps/blog/exported`, process.env[`EXPORT_PATH`], { recursive: true });
				await fs.rm(`${process.env[`REBUILD_PATH`] || ``}/dist/apps/blog`, { recursive: true });
			}

			lastRebuild = `DONE: ${new Date().toISOString()}`;
		} catch (e: unknown) {
			lastRebuild = `ERROR: ${new Date().toISOString()} - ${e instanceof Error ? e.message : Object.prototype.toString.call(e)}`;
			console.error(`Rebuild failed`);
			console.error(e);
		}

		queue--;

		if (queue > 0) await rebuild();
	}
};

export default triggerRebuild;
