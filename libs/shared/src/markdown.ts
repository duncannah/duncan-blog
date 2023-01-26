import MarkdownIt from "markdown-it";
import { createStarryNight, common } from "@wooorm/starry-night";
import { toHtml } from "hast-util-to-html";

let starryNight: Awaited<ReturnType<typeof createStarryNight>> | null = null;
createStarryNight(common)
	.then((sn) => {
		starryNight = sn;
	})
	.catch(() => null);

export const md = new MarkdownIt({
	html: true,
	xhtmlOut: true,
	breaks: true,
	typographer: true,
	highlight(value, lang) {
		if (!starryNight) return value;

		const scope = starryNight.flagToScope(lang);

		return toHtml({
			type: `element`,
			tagName: `pre`,
			properties: {
				className: scope ? [`highlight`, `highlight-` + scope.replace(/^source\./, ``).replace(/\./g, `-`)] : undefined,
			},
			children: scope ? starryNight.highlight(value, scope).children : [{ type: `text`, value }],
		} as Parameters<typeof toHtml>[0]);
	},
});
