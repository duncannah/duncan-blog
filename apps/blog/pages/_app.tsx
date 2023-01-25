import { Settings, getSetting } from "@duncan-blog/shared";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useTransitionFix } from "../shared/useTransitionFix";

import Footer from "../components/Footer";
import Header from "../components/Header";

import "../style.scss";
function CustomApp({
	Component,
	pageProps,
	router,
	blogName,
	blogFullName,
	favicon,
	links,
}: AppProps & { blogName: string; blogFullName: string; favicon: string; links: Jsonify<Settings["headerLinks"]> }) {
	useTransitionFix();

	return (
		<>
			<Head>
				<title>{blogFullName}</title>
				{favicon.length > 0 ? (
					<link rel={`shortcut icon`} href={`data:image/svg+xml,${encodeURIComponent(favicon)}`} type={`image/svg+xml`} />
				) : (
					<>
						<link rel={`apple-touch-icon`} sizes={`180x180`} href={`/apple-touch-icon.png`} />
						<link rel={`icon`} type={`image/png`} sizes={`32x32`} href={`/favicon-32x32.png`} />
						<link rel={`icon`} type={`image/png`} sizes={`16x16`} href={`/favicon-16x16.png`} />
						<link rel={`manifest`} href={`/site.webmanifest`} />
					</>
				)}
			</Head>
			<main className={`app`}>
				<Header {...{ blogName, links }} />
				<TransitionGroup className={`page-content`}>
					<CSSTransition key={router.pathname} classNames={`page`} timeout={300}>
						<Component {...pageProps} />
					</CSSTransition>
				</TransitionGroup>
				<Footer />
			</main>
		</>
	);
}

CustomApp.getInitialProps = async (appContext: AppContext) => {
	const appProps = await App.getInitialProps(appContext);

	if (typeof window === `undefined`) {
		const blogName = await getSetting(`blogName`);
		const blogFullName = await getSetting(`blogFullName`);
		const favicon = await getSetting(`favicon`);
		const links = await getSetting(`headerLinks`);

		return { ...appProps, blogName, blogFullName, favicon, links };
	}

	return { ...appProps };
};

export default CustomApp;
