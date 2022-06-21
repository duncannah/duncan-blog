import { AppProps } from "next/app";
import Head from "next/head";

import Header from "../components/header/header";
import Footer from "../components/footer/footer";

import "../../../libs/shared/src/global.scss";

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>{`Welcome to cms!`}</title>
			</Head>
			<main className={`app`}>
				<Header />
				<Component {...pageProps} />
				<Footer />
			</main>
		</>
	);
}

export default CustomApp;
