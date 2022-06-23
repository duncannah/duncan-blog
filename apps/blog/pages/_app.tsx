import { HeaderLink } from "@prisma/client";
import { prisma } from "@duncan-blog/shared";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";

import Footer from "../components/Footer";
import Header from "../components/Header";

import "../../../libs/shared/src/global.scss";
function CustomApp({ Component, pageProps, links }: AppProps & { links: Jsonify<HeaderLink[]> }) {
	return (
		<>
			<Head>
				<title>{process.env.NEXT_PUBLIC_BLOG_FULLNAME}</title>
				<link rel={`stylesheet`} href={`https://rsms.me/inter/inter.css`} />
				<link rel={`apple-touch-icon`} sizes={`180x180`} href={`/apple-touch-icon.png`} />
				<link rel={`icon`} type={`image/png`} sizes={`32x32`} href={`/favicon-32x32.png`} />
				<link rel={`icon`} type={`image/png`} sizes={`16x16`} href={`/favicon-16x16.png`} />
				<link rel={`manifest`} href={`/site.webmanifest`} />
				<meta name={`theme-color`} content={`#000`} />
			</Head>
			<main className={`app`}>
				<Header links={links} />
				<Component {...pageProps} />
				<Footer />
			</main>
		</>
	);
}

CustomApp.getInitialProps = async (appContext: AppContext) => {
	const appProps = await App.getInitialProps(appContext);

	if (typeof window === `undefined`) {
		const links = await prisma.headerLink.findMany();

		return { ...appProps, links };
	}

	return { ...appProps };
};

export default CustomApp;
