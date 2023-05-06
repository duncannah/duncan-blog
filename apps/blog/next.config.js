// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require(`@nx/next/plugins/with-nx`);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require(`path`);

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
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
	webpack: (config) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		config.resolve.fallback = { fs: false };

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
module.exports = withNx(nextConfig);
