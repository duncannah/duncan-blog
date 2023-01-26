import { Html, Head, Main, NextScript } from "next/document";
import { fontURLs } from "@duncan-blog/shared/fonts";

export default function Document() {
	return (
		<Html>
			<Head>
				{fontURLs.map((url) => (
					<link key={url} rel={`stylesheet`} href={url} />
				))}

				<meta name={`theme-color`} content={`#000`} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
