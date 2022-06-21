/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.svg" {
	const content: any;
	export const ReactComponent: any;
	export default content;
}

// mind the copy on the other apps
type Jsonify<T> = T extends Date
	? string
	: T extends object
	? {
			[k in keyof T]: Jsonify<T[k]>;
	  }
	: T;
