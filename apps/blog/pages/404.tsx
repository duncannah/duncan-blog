import Link from "next/link";

export default function Page404() {
	return (
		<div style={{ textAlign: `center` }}>
			<h2>{`404 - Page Not Found`}</h2>
			<p>{`Seems like you're lost... 🤭`}</p>
			<p>
				<Link href={`/`}>{`Home page`}</Link>
			</p>
		</div>
	);
}
