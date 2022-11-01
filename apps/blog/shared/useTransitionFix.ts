import Router from "next/router";
import { useEffect } from "react";

export const OPACITY_EXIT_DURATION = 0.3;

const routeChange = () => {
	// Temporary fix for https://github.com/vercel/next.js/issues/17464

	const tempFix = () => {
		const elements = document.querySelectorAll(`style[media="x"]`);
		elements.forEach((elem) => elem.removeAttribute(`media`));
		setTimeout(() => {
			elements.forEach((elem) => elem.remove());
		}, OPACITY_EXIT_DURATION * 1000);
	};
	tempFix();
};

export const useTransitionFix = () => {
	useEffect(() => {
		Router.events.on(`routeChangeComplete`, routeChange);
		Router.events.on(`routeChangeStart`, routeChange);

		return () => {
			Router.events.off(`routeChangeComplete`, routeChange);
			Router.events.off(`routeChangeStart`, routeChange);
		};
	}, []);

	useEffect(() => {
		const pathname = Router.router?.pathname;
		const query = Router.router?.query;
		void Router.router?.push({ pathname, query });
	}, []);
};
