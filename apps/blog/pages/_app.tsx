import { HeaderLink, PrismaClient } from "@prisma/client";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";

import Footer from "../components/Footer";
import Header from "../components/Header";

import "../../../libs/shared/src/global.scss";
function CustomApp({ Component, pageProps, links }: AppProps & { links: Jsonify<HeaderLink[]> }) {
	return (
		<>
			<Head>
				<title>{`Welcome to blog!`}</title>
				<link rel={`stylesheet`} href={`https://rsms.me/inter/inter.css`} />
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
	const prisma = new PrismaClient();

	const links = await prisma.headerLink.findMany();

	return { ...appProps, links: JSON.parse(JSON.stringify(links)) as Jsonify<typeof links> };
};

export default CustomApp;
