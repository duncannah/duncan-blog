import { HeaderLink } from "@prisma/client";
import { prisma } from "@duncan-blog/shared";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Footer from "../components/Footer";
import Header from "../components/Header";

import "../../../libs/shared/src/global.scss";
function CustomApp({ Component, pageProps, router, links }: AppProps & { links: Jsonify<HeaderLink[]> }) {
	return (
		<>
			<Head>
				<title>{process.env.NEXT_PUBLIC_BLOG_FULLNAME}</title>
			</Head>
			<main className={`app`}>
				<Header links={links} />
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
		const links = await prisma.headerLink.findMany();

		return { ...appProps, links };
	}

	return { ...appProps };
};

export default CustomApp;
