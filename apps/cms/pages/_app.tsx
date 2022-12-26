import { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

import Header from "../components/header/header";
import Footer from "../components/footer/footer";

import "../style.scss";

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
			<Toaster
				position={`bottom-right`}
				toastOptions={{
					style: {
						border: `1px solid #fff`,
						background: `#000`,
						color: `#fff`,
					},
				}}
			/>
		</>
	);
}

export default CustomApp;
