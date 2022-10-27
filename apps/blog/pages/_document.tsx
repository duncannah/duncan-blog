import { Html, Head, Main, NextScript } from "next/document";
import { fontURLs } from "@duncan-blog/shared";

export default function Document() {
	return (
		<Html>
			<Head>
				{fontURLs.map((url) => (
					<link key={url} rel={`stylesheet`} href={url} />
				))}
				<link rel={`apple-touch-icon`} sizes={`180x180`} href={`/apple-touch-icon.png`} />
				<link rel={`icon`} type={`image/png`} sizes={`32x32`} href={`/favicon-32x32.png`} />
				<link rel={`icon`} type={`image/png`} sizes={`16x16`} href={`/favicon-16x16.png`} />
				<link rel={`manifest`} href={`/site.webmanifest`} />
				<meta name={`theme-color`} content={`#000`} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
