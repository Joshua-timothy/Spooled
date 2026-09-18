import { n as extractVideoId } from "./youtube-BeaFxecg.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/video.functions-CiqHAFQ4.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var lookupVideo_createServerFn_handler = createServerRpc({
	id: "835248d63e4c31f233e4e95735253e7bdf5944a361783774a56c6dc70f15e0fd",
	name: "lookupVideo",
	filename: "src/lib/video.functions.ts"
}, (opts) => lookupVideo.__executeServer(opts));
var lookupVideo = createServerFn({ method: "POST" }).validator(object({ url: string().trim().min(1, "Paste a YouTube link first.").max(500, "That link is too long.") })).handler(lookupVideo_createServerFn_handler, async ({ data }) => {
	if (!extractVideoId(data.url)) throw new Error("That does not look like a YouTube link.");
	const { fetchVideoInfo } = await import("./youtube.server-BSzz7Zri.mjs").then((n) => n.n);
	return fetchVideoInfo(data.url);
});
//#endregion
export { lookupVideo_createServerFn_handler };
