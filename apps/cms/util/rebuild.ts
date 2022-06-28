import { exec } from "child_process";

let queue = 0;

export const triggerRebuild = (): void => {
	if (!process.env[`REBUILD_PATH`]) throw new Error(`REBUILD_PATH is not set`);

	if (process.env[`NODE_ENV`] === `development`) return;

	if (queue > 0) {
		queue++;
		return;
	}

	void rebuild();

	async function rebuild() {
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
		} catch (e) {
			console.error(`Rebuild failed`);
			console.error(e);
		}

		if (queue > 0) {
			queue--;
			await rebuild();
		}
	}
};

export default triggerRebuild;
