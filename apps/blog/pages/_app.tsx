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
	links,
}: AppProps & { blogName: string; blogFullName: string; links: Jsonify<Settings["headerLinks"]> }) {
	useTransitionFix();

	return (
		<>
			<Head>
				<title>{blogFullName}</title>
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
		const links = await getSetting(`headerLinks`);

		return { ...appProps, blogName, blogFullName, links };
	}

	return { ...appProps };
};

export default CustomApp;
