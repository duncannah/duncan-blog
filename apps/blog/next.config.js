// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require(`@nrwl/next/plugins/with-nx`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require(`path`);

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	nx: {
		// Set this to true if you would like to to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: false,
	},
	sassOptions: {
		includePaths: [path.join(__dirname, `../../libs/shared/src`)],
	},
	reactStrictMode: true,
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = withNx(nextConfig);
