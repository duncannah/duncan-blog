import { exec } from "child_process";

let queue = 0;

export let lastRebuild: string | null = null;

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
				exec(`pnpm nx export`, { cwd: process.env[`REBUILD_PATH`] }, (error, _, stderr) => {
					if (error) {
						console.error(stderr);
						return reject(error);
					}

					return resolve();
				});
			});
		} catch (e: unknown) {
			lastRebuild = `ERROR: ${new Date().toISOString()} - ${e instanceof Error ? e.message : Object.prototype.toString.call(e)}`;
			console.error(`Rebuild failed`);
			console.error(e);
		}

		lastRebuild = `DONE: ${new Date().toISOString()}`;

		queue--;

		if (queue > 0) await rebuild();
	}
};

export default triggerRebuild;
