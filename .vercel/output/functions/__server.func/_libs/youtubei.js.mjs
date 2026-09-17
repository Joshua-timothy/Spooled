import { n as __exportAll } from "../_runtime.mjs";
import { n as gzipSync, t as gunzipSync } from "./fflate.mjs";
import { n as BinaryWriter, t as BinaryReader } from "./bufbuild__protobuf.mjs";
import { t as parseScript } from "./meriyah.mjs";
import { ReadableStream } from "stream/web";
import crypto from "crypto";
import path from "path";
import os from "os";
import fs from "fs/promises";
import { fileURLToPath } from "url";
//#region node_modules/youtubei.js/dist/src/utils/Log.js
var YTJS_TAG = "YOUTUBEJS";
var Level = {
	NONE: 0,
	ERROR: 1,
	WARNING: 2,
	INFO: 3,
	DEBUG: 4
};
var log_map = {
	[Level.ERROR]: (...args) => console.error(...args),
	[Level.WARNING]: (...args) => console.warn(...args),
	[Level.INFO]: (...args) => console.info(...args),
	[Level.DEBUG]: (...args) => console.debug(...args)
};
var log_level = [Level.WARNING];
function doLog(level, tag, args) {
	if (!log_map[level] || !log_level.includes(level)) return;
	const tags = [`[${YTJS_TAG}]`];
	if (tag) tags.push(`[${tag}]`);
	log_map[level](`${tags.join("")}:`, ...args || []);
}
var warn = (tag, ...args) => doLog(Level.WARNING, tag, args);
var error = (tag, ...args) => doLog(Level.ERROR, tag, args);
var info = (tag, ...args) => doLog(Level.INFO, tag, args);
var debug = (tag, ...args) => doLog(Level.DEBUG, tag, args);
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/helpers.js
var isObserved = Symbol("ObservedArray.isObserved");
var YTNode = class {
	static type = "YTNode";
	type;
	constructor() {
		this.type = this.constructor.type;
	}
	/**
	* Check if the node is of the given type.
	* @param types - The type to check
	* @returns whether the node is of the given type
	*/
	is(...types) {
		return types.some((type) => this.type === type.type);
	}
	/**
	* Cast to one of the given types.
	* @param types - The types to cast to
	* @returns The node cast to one of the given types
	* @throws {ParsingError} If the node is not of the given type
	*/
	as(...types) {
		if (!this.is(...types)) throw new ParsingError(`Cannot cast ${this.type} to one of ${types.map((t) => t.type).join(", ")}`);
		return this;
	}
	/**
	* Check for a key without asserting the type.
	* @param key - The key to check
	* @returns Whether the node has the key
	*/
	hasKey(key) {
		return Reflect.has(this, key);
	}
	/**
	* Assert that the node has the given key and return it.
	* @param key - The key to check
	* @returns The value of the key wrapped in a Maybe
	* @throws {ParsingError} If the node does not have the key
	*/
	key(key) {
		if (!this.hasKey(key)) throw new ParsingError(`Missing key ${key}`);
		return new Maybe(this[key]);
	}
};
var MAYBE_TAG = "Maybe";
/**
* A wrapper class that provides type-safe access to a value.
*/
var Maybe = class Maybe {
	#value;
	constructor(value) {
		this.#value = value;
	}
	#checkPrimitive(type) {
		return typeof this.#value === type;
	}
	#assertPrimitive(type) {
		if (!this.#checkPrimitive(type)) throw new TypeError(`Expected ${type}, got ${this.typeof}`);
		return this.#value;
	}
	get typeof() {
		return typeof this.#value;
	}
	string() {
		return this.#assertPrimitive("string");
	}
	isString() {
		return this.#checkPrimitive("string");
	}
	number() {
		return this.#assertPrimitive("number");
	}
	isNumber() {
		return this.#checkPrimitive("number");
	}
	bigint() {
		return this.#assertPrimitive("bigint");
	}
	isBigint() {
		return this.#checkPrimitive("bigint");
	}
	boolean() {
		return this.#assertPrimitive("boolean");
	}
	isBoolean() {
		return this.#checkPrimitive("boolean");
	}
	symbol() {
		return this.#assertPrimitive("symbol");
	}
	isSymbol() {
		return this.#checkPrimitive("symbol");
	}
	undefined() {
		return this.#assertPrimitive("undefined");
	}
	isUndefined() {
		return this.#checkPrimitive("undefined");
	}
	null() {
		if (this.#value !== null) throw new TypeError(`Expected null, got ${typeof this.#value}`);
		return this.#value;
	}
	isNull() {
		return this.#value === null;
	}
	object() {
		return this.#assertPrimitive("object");
	}
	isObject() {
		return this.#checkPrimitive("object");
	}
	function() {
		return this.#assertPrimitive("function");
	}
	isFunction() {
		return this.#checkPrimitive("function");
	}
	/**
	* Get the value as an array.
	* @returns the value as any[].
	* @throws If the value is not an array.
	*/
	array() {
		if (!Array.isArray(this.#value)) throw new TypeError(`Expected array, got ${typeof this.#value}`);
		return this.#value;
	}
	/**
	* More typesafe variant of {@link Maybe#array}.
	* @returns a proxied array which returns all the values as {@link Maybe}.
	* @throws {TypeError} If the value is not an array
	*/
	arrayOfMaybe() {
		const arrayProps = [];
		return new Proxy(this.array(), { get(target, prop) {
			if (Reflect.has(arrayProps, prop)) return Reflect.get(target, prop);
			return new Maybe(Reflect.get(target, prop));
		} });
	}
	/**
	* Check whether the value is an array.
	* @returns whether the value is an array.
	*/
	isArray() {
		return Array.isArray(this.#value);
	}
	/**
	* Get the value as a YTNode.
	* @returns the value as a YTNode.
	* @throws If the value is not a YTNode.
	*/
	node() {
		if (!(this.#value instanceof YTNode)) throw new TypeError(`Expected YTNode, got ${this.#value.constructor.name}`);
		return this.#value;
	}
	/**
	* Check if the value is a YTNode.
	* @returns Whether the value is a YTNode.
	*/
	isNode() {
		return this.#value instanceof YTNode;
	}
	/**
	* Get the value as a YTNode of the given type.
	* @param types - The type(s) to cast to.
	* @returns The node cast to the given type.
	* @throws If the node is not of the given type.
	*/
	nodeOfType(...types) {
		return this.node().as(...types);
	}
	/**
	* Check if the value is a YTNode of the given type.
	* @param types - the type(s) to check.
	* @returns Whether the value is a YTNode of the given type.
	*/
	isNodeOfType(...types) {
		return this.isNode() && this.node().is(...types);
	}
	/**
	* Get the value as an ObservedArray.
	* @returns the value of the Maybe as a ObservedArray.
	*/
	observed() {
		if (!this.isObserved()) throw new TypeError(`Expected ObservedArray, got ${typeof this.#value}`);
		return this.#value;
	}
	/**
	* Check if the value is an ObservedArray.
	*/
	isObserved() {
		return this.#value?.[isObserved];
	}
	/**
	* Get the value of the Maybe as a SuperParsedResult.
	* @returns the value as a SuperParsedResult.
	* @throws If the value is not a SuperParsedResult.
	*/
	parsed() {
		if (!(this.#value instanceof SuperParsedResult)) throw new TypeError(`Expected SuperParsedResult, got ${typeof this.#value}`);
		return this.#value;
	}
	/**
	* Is the result a SuperParsedResult?
	*/
	isParsed() {
		return this.#value instanceof SuperParsedResult;
	}
	/**
	* @deprecated
	* This call is not meant to be used outside of debugging. Please use the specific type getter instead.
	*/
	any() {
		warn(MAYBE_TAG, "This call is not meant to be used outside of debugging. Please use the specific type getter instead.");
		return this.#value;
	}
	/**
	* Get the node as an instance of the given class.
	* @param type - The type to check.
	* @returns the value as the given type.
	* @throws If the node is not of the given type.
	*/
	instanceof(type) {
		if (!this.isInstanceof(type)) throw new TypeError(`Expected instance of ${type.name}, got ${this.#value.constructor.name}`);
		return this.#value;
	}
	/**
	* Check if the node is an instance of the given class.
	* @param type - The type to check.
	* @returns Whether the node is an instance of the given type.
	*/
	isInstanceof(type) {
		return this.#value instanceof type;
	}
};
/**
* Represents a parsed response in an unknown state. Either a YTNode or a YTNode[] or null.
*/
var SuperParsedResult = class {
	#result;
	constructor(result) {
		this.#result = result;
	}
	get is_null() {
		return this.#result === null;
	}
	get is_array() {
		return !this.is_null && Array.isArray(this.#result);
	}
	get is_node() {
		return !this.is_array;
	}
	array() {
		if (!this.is_array) throw new TypeError("Expected an array, got a node");
		return this.#result;
	}
	item() {
		if (!this.is_node) throw new TypeError("Expected a node, got an array");
		return this.#result;
	}
};
/**
* Creates an observed array that provides additional utility methods for array manipulation and filtering.
* @template T - Type extending YTNode
* @param obj - Array to be observed
*/
function observe(obj) {
	return new Proxy(obj, { get(target, prop) {
		if (prop == "get") return (rule, del_item) => target.find((obj, index) => {
			const match = deepCompare(rule, obj);
			if (match && del_item) target.splice(index, 1);
			return match;
		});
		if (prop == isObserved) return true;
		if (prop == "getAll") return (rule, del_items) => target.filter((obj, index) => {
			const match = deepCompare(rule, obj);
			if (match && del_items) target.splice(index, 1);
			return match;
		});
		if (prop == "matchCondition") return (condition) => target.find((obj) => {
			return condition(obj);
		});
		if (prop == "filterType") return (...types) => {
			return observe(target.filter((node) => {
				return !!node.is(...types);
			}));
		};
		if (prop == "firstOfType") return (...types) => {
			return target.find((node) => {
				return !!node.is(...types);
			});
		};
		if (prop == "first") return () => target[0];
		if (prop == "as") return (...types) => {
			return observe(target.map((node) => {
				if (node.is(...types)) return node;
				throw new ParsingError(`Expected node of any type ${types.map((type) => type.type).join(", ")}, got ${node.type}`);
			}));
		};
		if (prop == "remove") return (index) => target.splice(index, 1);
		return Reflect.get(target, prop);
	} });
}
var Memo = class extends Map {
	getType(...types) {
		types = types.flat();
		return observe(types.flatMap((type) => this.get(type.type) || []));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/AccessibilityContext.js
var AccessibilityContext = class {
	label;
	constructor(data) {
		this.label = data.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/AccessibilityData.js
var AccessibilityData = class {
	accessibility_identifier;
	identifier;
	label;
	constructor(data) {
		if ("accessibilityIdentifier" in data) this.accessibility_identifier = data.accessibilityIdentifier;
		if ("identifier" in data) this.identifier = { accessibility_id_type: data.identifier.accessibilityIdType };
		if ("label" in data) this.label = data.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/Constants.js
var URLS = {
	YT_BASE: "https://www.youtube.com",
	YT_MUSIC_BASE: "https://music.youtube.com",
	YT_SUGGESTIONS: "https://suggestqueries-clients6.youtube.com",
	YT_UPLOAD: "https://upload.youtube.com/",
	API: {
		BASE: "https://youtubei.googleapis.com",
		PRODUCTION_1: "https://www.youtube.com/youtubei/",
		PRODUCTION_2: "https://youtubei.googleapis.com/youtubei/",
		STAGING: "https://green-youtubei.sandbox.googleapis.com/youtubei/",
		RELEASE: "https://release-youtubei.sandbox.googleapis.com/youtubei/",
		TEST: "https://test-youtubei.sandbox.googleapis.com/youtubei/",
		CAMI: "http://cami-youtubei.sandbox.googleapis.com/youtubei/",
		UYTFE: "https://uytfe.sandbox.google.com/youtubei/"
	},
	GOOGLE_SEARCH_BASE: "https://www.google.com/"
};
var OAUTH = { REGEX: {
	TV_SCRIPT: /* @__PURE__ */ new RegExp("<script\\s+id=\"base-js\"\\s+src=\"([^\"]+)\"[^>]*><\\/script>"),
	CLIENT_IDENTITY: /* @__PURE__ */ new RegExp("clientId:\"(?<client_id>[^\"]+)\",[^\"]*?:\"(?<client_secret>[^\"]+)\"")
} };
var CLIENTS = {
	IOS: {
		NAME: "iOS",
		VERSION: "20.11.6",
		USER_AGENT: "com.google.ios.youtube/20.11.6 (iPhone10,4; U; CPU iOS 16_7_7 like Mac OS X)",
		DEVICE_MODEL: "iPhone10,4",
		OS_NAME: "iOS",
		OS_VERSION: "16.7.7.20H330"
	},
	WEB: {
		NAME: "WEB",
		VERSION: "2.20260623.01.00",
		API_KEY: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
		API_VERSION: "v1",
		STATIC_VISITOR_ID: "6zpwvWUNAco",
		SUGG_EXP_ID: "ytzpb5_e2,ytpo.bo.lqp.elu=1,ytpo.bo.lqp.ecsc=1,ytpo.bo.lqp.mcsc=3,ytpo.bo.lqp.mec=1,ytpo.bo.lqp.rw=0.8,ytpo.bo.lqp.fw=0.2,ytpo.bo.lqp.szp=1,ytpo.bo.lqp.mz=3,ytpo.bo.lqp.al=en_us,ytpo.bo.lqp.zrm=1,ytpo.bo.lqp.er=1,ytpo.bo.ro.erl=1,ytpo.bo.ro.mlus=3,ytpo.bo.ro.erls=3,ytpo.bo.qfo.mlus=3,ytzprp.ppp.e=1,ytzprp.ppp.st=772,ytzprp.ppp.p=5"
	},
	MWEB: {
		NAME: "MWEB",
		VERSION: "2.20260205.04.01",
		API_VERSION: "v1"
	},
	WEB_KIDS: {
		NAME: "WEB_KIDS",
		VERSION: "2.20260205.00.00"
	},
	YTMUSIC: {
		NAME: "WEB_REMIX",
		VERSION: "1.20250219.01.00"
	},
	ANDROID: {
		NAME: "ANDROID",
		VERSION: "21.03.36",
		SDK_VERSION: 36,
		USER_AGENT: "com.google.android.youtube/21.03.36(Linux; U; Android 16; en_US; SM-S908E Build/TP1A.220624.014) gzip"
	},
	ANDROID_VR: {
		NAME: "ANDROID_VR",
		VERSION: "1.65.10",
		SDK_VERSION: 32,
		DEVICE_MAKE: "Oculus",
		DEVICE_MODEL: "Quest 3",
		USER_AGENT: "com.google.android.apps.youtube.vr.oculus/1.65.10 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip"
	},
	VISIONOS: {
		NAME: "VISIONOS",
		VERSION: "1.02",
		DEVICE_MAKE: "Apple",
		DEVICE_MODEL: "RealityDevice17,1",
		OS_NAME: "visionOS",
		OS_VERSION: "26.5.23O471",
		USER_AGENT: "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15"
	},
	YTSTUDIO_ANDROID: {
		NAME: "ANDROID_CREATOR",
		VERSION: "22.43.101"
	},
	YTMUSIC_ANDROID: {
		NAME: "ANDROID_MUSIC",
		VERSION: "5.34.51"
	},
	TV: {
		NAME: "TVHTML5",
		VERSION: "7.20260311.12.00",
		USER_AGENT: "Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version"
	},
	TV_SIMPLY: {
		NAME: "TVHTML5_SIMPLY",
		VERSION: "1.0"
	},
	TV_EMBEDDED: {
		NAME: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
		VERSION: "2.0"
	},
	WEB_EMBEDDED: {
		NAME: "WEB_EMBEDDED_PLAYER",
		VERSION: "1.20260206.01.00",
		API_KEY: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
		API_VERSION: "v1",
		STATIC_VISITOR_ID: "6zpwvWUNAco"
	},
	WEB_CREATOR: {
		NAME: "WEB_CREATOR",
		VERSION: "1.20241203.01.00",
		API_KEY: "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
		API_VERSION: "v1",
		STATIC_VISITOR_ID: "6zpwvWUNAco"
	}
};
/**
* The keys correspond to the `NAME` fields in {@linkcode CLIENTS} constant
*/
var CLIENT_NAME_IDS = {
	iOS: "5",
	WEB: "1",
	MWEB: "2",
	WEB_KIDS: "76",
	WEB_REMIX: "67",
	ANDROID: "3",
	ANDROID_CREATOR: "14",
	ANDROID_MUSIC: "21",
	ANDROID_VR: "28",
	VISIONOS: "101",
	TVHTML5: "7",
	TVHTML5_SIMPLY: "74",
	TVHTML5_SIMPLY_EMBEDDED_PLAYER: "85",
	WEB_EMBEDDED_PLAYER: "56",
	WEB_CREATOR: "62"
};
var STREAM_HEADERS = {
	"accept": "*/*",
	"origin": "https://www.youtube.com",
	"referer": "https://www.youtube.com",
	"DNT": "?1"
};
var SUPPORTED_CLIENTS = [
	"IOS",
	"WEB",
	"MWEB",
	"YTKIDS",
	"YTMUSIC",
	"ANDROID",
	"ANDROID_VR",
	"VISIONOS",
	"YTSTUDIO_ANDROID",
	"YTMUSIC_ANDROID",
	"TV",
	"TV_SIMPLY",
	"TV_EMBEDDED",
	"WEB_EMBEDDED",
	"WEB_CREATOR"
];
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/EventEmitterLike.js
var EventEmitterLike = class extends EventTarget {
	#legacy_listeners = /* @__PURE__ */ new Map();
	constructor() {
		super();
	}
	emit(type, ...args) {
		const event = new Platform.shim.CustomEvent(type, { detail: args });
		this.dispatchEvent(event);
	}
	on(type, listener) {
		const wrapper = (ev) => {
			if (ev instanceof Platform.shim.CustomEvent) listener(...ev.detail);
			else listener(ev);
		};
		this.#legacy_listeners.set(listener, wrapper);
		this.addEventListener(type, wrapper);
	}
	once(type, listener) {
		const wrapper = (ev) => {
			if (ev instanceof Platform.shim.CustomEvent) listener(...ev.detail);
			else listener(ev);
			this.off(type, listener);
		};
		this.#legacy_listeners.set(listener, wrapper);
		this.addEventListener(type, wrapper);
	}
	off(type, listener) {
		const wrapper = this.#legacy_listeners.get(listener);
		if (wrapper) {
			this.removeEventListener(type, wrapper);
			this.#legacy_listeners.delete(listener);
		}
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/DashUtils.js
var XML_CHARACTER_MAP = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&apos;",
	"<": "&lt;",
	">": "&gt;"
};
function escapeXMLString(str) {
	return str.replace(/([&"<>'])/g, (_, item) => {
		return XML_CHARACTER_MAP[item];
	});
}
function normalizeTag(tag) {
	return tag.charAt(0).toUpperCase() + tag.slice(1);
}
function createElement(tagNameOrFunction, props, ...children) {
	const normalizedChildren = children.flat();
	if (typeof tagNameOrFunction === "function") return tagNameOrFunction({
		...props,
		children: normalizedChildren
	});
	return {
		type: normalizeTag(tagNameOrFunction),
		props: {
			...props,
			children: normalizedChildren
		}
	};
}
async function renderElementToString(element) {
	if (typeof element === "string") return escapeXMLString(element);
	let dom = `<${element.type}`;
	if (element.props) {
		for (const key of Object.keys(element.props)) if (key !== "children" && element.props[key] !== void 0) dom += ` ${key}="${escapeXMLString(`${element.props[key]}`)}"`;
	}
	if (element.props.children) {
		const children = await Promise.all((await Promise.all(element.props.children.flat())).flat().filter((child) => !!child).map((child) => renderElementToString(child)));
		if (children.length > 0) {
			dom += `>${children.join("")}</${element.type}>`;
			return dom;
		}
	}
	return `${dom}/>`;
}
async function renderToString(root) {
	return `<?xml version="1.0" encoding="utf-8"?>${await renderElementToString(await root)}`;
}
function Fragment(props) {
	return props.children;
}
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerStoryboardSpec.js
var PlayerStoryboardSpec = class extends YTNode {
	static type = "PlayerStoryboardSpec";
	boards;
	constructor(data) {
		super();
		const parts = data.spec.split("|");
		const url = new URL(parts.shift());
		this.boards = parts.map((part, i) => {
			const [thumbnail_width, thumbnail_height, thumbnail_count, columns, rows, interval, name, sigh] = part.split("#");
			url.searchParams.set("sigh", sigh);
			const storyboard_count = Math.ceil(parseInt(thumbnail_count, 10) / (parseInt(columns, 10) * parseInt(rows, 10)));
			return {
				type: "vod",
				template_url: url.toString().replace("$L", i).replace("$N", name),
				thumbnail_width: parseInt(thumbnail_width, 10),
				thumbnail_height: parseInt(thumbnail_height, 10),
				thumbnail_count: parseInt(thumbnail_count, 10),
				interval: parseInt(interval, 10),
				columns: parseInt(columns, 10),
				rows: parseInt(rows, 10),
				storyboard_count
			};
		});
	}
};
var package_default = {
	name: "youtubei.js",
	version: "18.0.0",
	description: "A JavaScript client for YouTube's private API, known as InnerTube.",
	type: "module",
	types: "./dist/src/platform/lib.d.ts",
	typesVersions: { "*": {
		"agnostic": ["./dist/src/platform/lib.d.ts"],
		"web": ["./dist/src/platform/lib.d.ts"],
		"react-native": ["./dist/src/platform/lib.d.ts"],
		"web.bundle": ["./dist/src/platform/lib.d.ts"],
		"web.bundle.min": ["./dist/src/platform/lib.d.ts"],
		"cf-worker": ["./dist/src/platform/lib.d.ts"]
	} },
	exports: {
		".": {
			"deno": "./dist/src/platform/deno.js",
			"node": {
				"import": "./dist/src/platform/node.js",
				"default": "./dist/src/platform/node.js"
			},
			"types": "./dist/src/platform/lib.d.ts",
			"browser": "./dist/src/platform/web.js",
			"react-native": "./dist/src/platform/react-native.js",
			"default": "./dist/src/platform/web.js"
		},
		"./package.json": "./package.json",
		"./agnostic": {
			"types": "./dist/src/platform/lib.d.ts",
			"default": "./dist/src/platform/lib.js"
		},
		"./web": {
			"types": "./dist/src/platform/lib.d.ts",
			"default": "./dist/src/platform/web.js"
		},
		"./react-native": {
			"types": "./dist/src/platform/lib.d.ts",
			"default": "./dist/src/platform/react-native.js"
		},
		"./web.bundle": {
			"types": "./dist/src/platform/lib.d.ts",
			"default": "./bundle/browser.js"
		},
		"./cf-worker": {
			"types": "./dist/src/platform/lib.d.ts",
			"default": "./dist/src/platform/cf-worker.js"
		}
	},
	author: "LuanRT <luan.lrt4@gmail.com> (https://github.com/LuanRT)",
	funding: ["https://github.com/sponsors/LuanRT"],
	contributors: [
		"Wykerd (https://github.com/wykerd/)",
		"MasterOfBob777 (https://github.com/MasterOfBob777)",
		"patrickkfkan (https://github.com/patrickkfkan)",
		"akkadaska (https://github.com/akkadaska)",
		"Absidue (https://github.com/absidue)"
	],
	scripts: {
		"test": "vitest run --reporter verbose",
		"lint": "eslint ./src",
		"lint:fix": "eslint --fix ./src",
		"clean:source-maps": "rimraf ./bundle/browser.js.map ./bundle/cf-worker.js.map ./bundle/react-native.js.map",
		"clean:build-output": "rimraf ./dist ./bundle/browser.js ./bundle/cf-worker.js ./bundle/react-native.js ./deno",
		"build": "npm run clean:build-output && npm run clean:source-maps && npm run build:parser-map && npm run build:esm && npm run bundle:browser && npm run bundle:cf-worker && npm run bundle:react-native",
		"build:esm": "tspc",
		"build:deno": "cpy ./src ./deno && cpy ./protos ./deno && esbuild ./src/utils/DashManifest.tsx --keep-names --format=esm --platform=neutral --target=es2020 --outfile=./deno/src/utils/DashManifest.js && cpy ./package.json ./deno && replace \".js';\" \".ts';\" ./deno -r && replace '.js\";' '.ts\";' ./deno -r && replace \"'./DashManifest.ts';\" \"'./DashManifest.js';\" ./deno -r && replace \"'jintr';\" \"'jsr:@luanrt/jintr';\" ./deno -r && replace \"@bufbuild/protobuf/wire\" \"https://esm.sh/@bufbuild/protobuf@2.0.0/wire\" ./deno -r",
		"build:proto": "rimraf ./protos/generated && node ./dev-scripts/generate-proto.mjs",
		"build:parser-map": "node ./dev-scripts/gen-parser-map.mjs",
		"bundle:browser": "esbuild ./dist/src/platform/web.js --banner:js=\"/* eslint-disable */\" --bundle --sourcemap --target=chrome70 --keep-names --format=esm --define:global=globalThis --conditions=module --outfile=./bundle/browser.js --platform=browser",
		"bundle:react-native": "esbuild ./dist/src/platform/react-native.js --bundle --sourcemap --target=es2020 --keep-names --format=esm --platform=neutral --define:global=globalThis --conditions=module --outfile=./bundle/react-native.js",
		"bundle:cf-worker": "esbuild ./dist/src/platform/cf-worker.js --banner:js=\"/* eslint-disable */\" --bundle --sourcemap --target=es2020 --keep-names --format=esm --define:global=globalThis --conditions=module --outfile=./bundle/cf-worker.js --platform=node",
		"build:docs": "typedoc",
		"prepare": "npm run build",
		"watch": "tspc --watch"
	},
	repository: {
		"type": "git",
		"url": "git+https://github.com/LuanRT/YouTube.js.git"
	},
	files: [
		"dist/",
		"bundle/",
		"package.json",
		"README.md",
		"LICENSE"
	],
	license: "MIT",
	dependencies: {
		"@bufbuild/protobuf": "^2.0.0",
		"fflate": "^0.8.2",
		"meriyah": "^7.3.1"
	},
	devDependencies: {
		"@eslint/js": "^9.37.0",
		"@types/estree": "^1.0.6",
		"@types/node": "^26.2.0",
		"@typescript-eslint/eslint-plugin": "^8.46.0",
		"@typescript-eslint/parser": "^8.46.0",
		"cpy-cli": "^7.0.0",
		"esbuild": "^0.28.0",
		"eslint": "^10.8.0",
		"globals": "^17.0.0",
		"replace": "^1.2.2",
		"rimraf": "^6.0.1",
		"ts-patch": "^3.0.2",
		"ts-proto": "^2.2.0",
		"typedoc": "^0.28.14",
		"typedoc-plugin-markdown": "^4.9.0",
		"typescript": "^5.9.3",
		"typescript-eslint": "^8.46.0",
		"vitest": "^4.1.10"
	},
	bugs: { "url": "https://github.com/LuanRT/YouTube.js/issues" },
	homepage: "https://github.com/LuanRT/YouTube.js#readme",
	keywords: [
		"api",
		"youtube",
		"innertube",
		"livechat",
		"youtube-music",
		"ytdl",
		"youtube-studio",
		"downloader",
		"ytmusic"
	]
};
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/StreamingInfo.js
var TAG_ = "StreamingInfo";
function getFormatGroupings(formats, is_post_live_dvr) {
	const group_info = /* @__PURE__ */ new Map();
	const has_multiple_audio_tracks = formats.some((fmt) => !!fmt.audio_track);
	for (const format of formats) {
		if ((!format.index_range || !format.init_range) && !format.is_type_otf && !is_post_live_dvr) continue;
		const group_id = `${format.mime_type.split(";")[0]}-${getStringBetweenStrings(format.mime_type, "codecs=\"", "\"")?.split(".")[0]}-${format.color_info ? Object.values(format.color_info).join("-") : ""}-${format.audio_track?.id || ""}-${format.is_drc ? "drc" : ""}-${format.is_vb ? "vb" : ""}`;
		if (!group_info.has(group_id)) group_info.set(group_id, []);
		group_info.get(group_id)?.push(format);
	}
	return {
		groups: Array.from(group_info.values()),
		has_multiple_audio_tracks
	};
}
function hoistCodecsIfPossible(formats, hoisted) {
	if (formats.length > 1 && new Set(formats.map((format) => getStringBetweenStrings(format.mime_type, "codecs=\"", "\""))).size === 1) {
		hoisted.push("codecs");
		return getStringBetweenStrings(formats[0].mime_type, "codecs=\"", "\"");
	}
}
function hoistNumberAttributeIfPossible(formats, property, hoisted) {
	if (formats.length > 1 && new Set(formats.map((format) => format.fps)).size === 1) {
		hoisted.push(property);
		return Number(formats[0][property]);
	}
}
function hoistAudioChannelsIfPossible(formats, hoisted) {
	if (formats.length > 1 && new Set(formats.map((format) => format.audio_channels || 2)).size === 1) {
		hoisted.push("AudioChannelConfiguration");
		return formats[0].audio_channels;
	}
}
async function getOTFSegmentTemplate(url, actions) {
	const response = await actions.session.http.fetch_function(`${url}&rn=0&sq=0`, {
		method: "GET",
		headers: STREAM_HEADERS,
		redirect: "follow"
	});
	const resolved_url = response.url.replace("&rn=0", "").replace("&sq=0", "");
	const segment_duration_strings = getStringBetweenStrings(await response.text(), "Segment-Durations-Ms:", "\r\n")?.split(",");
	if (!segment_duration_strings) throw new InnertubeError("Failed to extract the segment durations from this OTF stream", { url });
	const segment_durations = [];
	for (const segment_duration_string of segment_duration_strings) {
		const trimmed_segment_duration = segment_duration_string.trim();
		if (trimmed_segment_duration.length === 0) continue;
		let repeat_count;
		const repeat_count_string = getStringBetweenStrings(trimmed_segment_duration, "(r=", ")");
		if (repeat_count_string) repeat_count = parseInt(repeat_count_string);
		segment_durations.push({
			duration: parseInt(trimmed_segment_duration),
			repeat_count
		});
	}
	return {
		init_url: `${resolved_url}&sq=0`,
		media_url: `${resolved_url}&sq=$Number$`,
		timeline: segment_durations
	};
}
async function getPostLiveDvrInfo(transformed_url, actions) {
	const response = await actions.session.http.fetch_function(`${transformed_url}&rn=0&sq=0`, {
		method: "HEAD",
		headers: STREAM_HEADERS,
		redirect: "follow"
	});
	const duration_ms = parseInt(response.headers.get("X-Head-Time-Millis") || "");
	const segment_count = parseInt(response.headers.get("X-Head-Seqnum") || "");
	if (isNaN(duration_ms) || isNaN(segment_count)) throw new InnertubeError("Failed to extract the duration or segment count for this Post Live DVR video");
	return {
		duration: duration_ms / 1e3,
		segment_count
	};
}
async function getPostLiveDvrDuration(shared_post_live_dvr_info, format, url_transformer, actions, player, cpn) {
	if (!shared_post_live_dvr_info.item) {
		const url = new URL(await format.decipher(player));
		url.searchParams.set("cpn", cpn || "");
		shared_post_live_dvr_info.item = await getPostLiveDvrInfo(url_transformer(url).toString(), actions);
	}
	return shared_post_live_dvr_info.item.duration;
}
async function getSegmentInfo(format, url_transformer, actions, player, cpn, shared_post_live_dvr_info, is_sabr) {
	let transformed_url = "";
	if (is_sabr) {
		const formatKey = `${format.itag || ""}:${format.xtags || ""}`;
		transformed_url = `sabr://${format.has_video ? "video" : "audio"}?key=${formatKey}`;
	} else {
		const url = new URL(await format.decipher(player));
		url.searchParams.set("cpn", cpn || "");
		transformed_url = url_transformer(url).toString();
	}
	if (format.is_type_otf) {
		if (!actions) throw new InnertubeError("Unable to get segment durations for this OTF stream without an Actions instance", { format });
		return {
			is_oft: true,
			is_post_live_dvr: false,
			getSegmentTemplate() {
				return getOTFSegmentTemplate(transformed_url, actions);
			}
		};
	}
	if (shared_post_live_dvr_info) {
		if (!actions) throw new InnertubeError("Unable to get segment count for this Post Live DVR video without an Actions instance", { format });
		const target_duration_dec = format.target_duration_dec;
		if (typeof target_duration_dec !== "number") throw new InnertubeError("Format is missing target_duration_dec", { format });
		return {
			is_oft: false,
			is_post_live_dvr: true,
			async getSegmentTemplate() {
				if (!shared_post_live_dvr_info.item) shared_post_live_dvr_info.item = await getPostLiveDvrInfo(transformed_url, actions);
				return {
					media_url: `${transformed_url}&sq=$Number$`,
					timeline: [{
						duration: target_duration_dec * 1e3,
						repeat_count: shared_post_live_dvr_info.item.segment_count
					}]
				};
			}
		};
	}
	if (!format.index_range || !format.init_range) throw new InnertubeError("Index and init ranges not available", { format });
	return {
		is_oft: false,
		is_post_live_dvr: false,
		base_url: transformed_url,
		index_range: format.index_range,
		init_range: format.init_range
	};
}
async function getAudioRepresentation(format, hoisted, url_transformer, actions, player, cpn, shared_post_live_dvr_info, is_sabr) {
	const uid_parts = [format.itag.toString()];
	if (format.audio_track) uid_parts.push(format.audio_track.id);
	if (format.is_drc) uid_parts.push("drc");
	if (format.is_vb) uid_parts.push("vb");
	return {
		uid: uid_parts.join("-"),
		bitrate: format.bitrate,
		codecs: !hoisted.includes("codecs") ? getStringBetweenStrings(format.mime_type, "codecs=\"", "\"") : void 0,
		audio_sample_rate: !hoisted.includes("audio_sample_rate") ? format.audio_sample_rate : void 0,
		channels: !hoisted.includes("AudioChannelConfiguration") ? format.audio_channels || 2 : void 0,
		segment_info: await getSegmentInfo(format, url_transformer, actions, player, cpn, shared_post_live_dvr_info, is_sabr)
	};
}
function getTrackRoles(format, has_drc_streams) {
	if (!format.audio_track && !has_drc_streams) return;
	const roles = [format.is_original ? "main" : "alternate"];
	if (format.is_dubbed || format.is_auto_dubbed) roles.push("dub");
	if (format.is_descriptive) roles.push("description");
	if (format.is_drc || format.is_vb) roles.push("enhanced-audio-intelligibility");
	return roles;
}
async function getAudioSet(formats, url_transformer, actions, player, cpn, shared_post_live_dvr_info, drc_labels, vb_labels, is_sabr) {
	const first_format = formats[0];
	const { audio_track } = first_format;
	const hoisted = [];
	const has_drc_streams = !!drc_labels;
	const has_vb_streams = !!vb_labels;
	let track_name;
	if (audio_track) {
		if (has_drc_streams && first_format.is_drc) track_name = drc_labels.label_drc_multiple(audio_track.display_name);
		else if (has_vb_streams && first_format.is_vb) track_name = vb_labels.label_vb_multiple(audio_track.display_name);
		else track_name = audio_track.display_name;
	} else if (has_drc_streams || has_vb_streams) {
		if (has_drc_streams && first_format.is_drc) track_name = drc_labels.label_drc;
		else if (has_vb_streams && first_format.is_vb) track_name = vb_labels.label_vb;
		else track_name = (drc_labels || vb_labels)?.label_original;
	}
	return {
		mime_type: first_format.mime_type.split(";")[0],
		language: first_format.language ?? void 0,
		codecs: hoistCodecsIfPossible(formats, hoisted),
		audio_sample_rate: hoistNumberAttributeIfPossible(formats, "audio_sample_rate", hoisted),
		track_name,
		track_roles: getTrackRoles(first_format, has_drc_streams),
		channels: hoistAudioChannelsIfPossible(formats, hoisted),
		drm_families: first_format.drm_families,
		drm_track_type: first_format.drm_track_type,
		representations: await Promise.all(formats.map((format) => getAudioRepresentation(format, hoisted, url_transformer, actions, player, cpn, shared_post_live_dvr_info, is_sabr)))
	};
}
var COLOR_PRIMARIES = {
	BT709: "1",
	BT2020: "9"
};
var COLOR_TRANSFER_CHARACTERISTICS = {
	BT709: "1",
	BT2020_10: "14",
	SMPTEST2084: "16",
	ARIB_STD_B67: "18"
};
var COLOR_MATRIX_COEFFICIENTS = {
	BT709: "1",
	BT2020_NCL: "14"
};
function getColorInfo(format) {
	const color_info = format.color_info;
	let primaries;
	let transfer_characteristics;
	let matrix_coefficients;
	if (color_info) {
		if (color_info.primaries) primaries = COLOR_PRIMARIES[color_info.primaries];
		if (color_info.transfer_characteristics) transfer_characteristics = COLOR_TRANSFER_CHARACTERISTICS[color_info.transfer_characteristics];
		if (color_info.matrix_coefficients) {
			matrix_coefficients = COLOR_MATRIX_COEFFICIENTS[color_info.matrix_coefficients];
			if (!matrix_coefficients) {
				const url = new URL(format.url);
				const anonymisedFormat = JSON.parse(JSON.stringify(format));
				anonymisedFormat.url = "REDACTED";
				anonymisedFormat.signature_cipher = "REDACTED";
				anonymisedFormat.cipher = "REDACTED";
				warn(TAG_, `Unknown matrix coefficients "${color_info.matrix_coefficients}". The DASH manifest is still usable without this.\nPlease report it at ${package_default.bugs.url} so we can add support for it.\nInnerTube client: ${url.searchParams.get("c")}\nformat:`, anonymisedFormat);
			}
		}
	} else if (getStringBetweenStrings(format.mime_type, "codecs=\"", "\"")?.startsWith("avc1")) transfer_characteristics = COLOR_TRANSFER_CHARACTERISTICS.BT709;
	return {
		primaries,
		transfer_characteristics,
		matrix_coefficients
	};
}
async function getVideoRepresentation(format, url_transformer, hoisted, player, actions, cpn, shared_post_live_dvr_info, is_sabr) {
	return {
		uid: format.itag.toString(),
		bitrate: format.bitrate,
		width: format.width,
		height: format.height,
		codecs: !hoisted.includes("codecs") ? getStringBetweenStrings(format.mime_type, "codecs=\"", "\"") : void 0,
		fps: !hoisted.includes("fps") ? format.fps : void 0,
		segment_info: await getSegmentInfo(format, url_transformer, actions, player, cpn, shared_post_live_dvr_info, is_sabr)
	};
}
async function getVideoSet(formats, url_transformer, player, actions, cpn, shared_post_live_dvr_info, is_sabr) {
	const first_format = formats[0];
	const color_info = getColorInfo(first_format);
	const hoisted = [];
	return {
		mime_type: first_format.mime_type.split(";")[0],
		color_info,
		codecs: hoistCodecsIfPossible(formats, hoisted),
		fps: hoistNumberAttributeIfPossible(formats, "fps", hoisted),
		drm_families: first_format.drm_families,
		drm_track_type: first_format.drm_track_type,
		representations: await Promise.all(formats.map((format) => getVideoRepresentation(format, url_transformer, hoisted, player, actions, cpn, shared_post_live_dvr_info, is_sabr)))
	};
}
function getStoryboardInfo(storyboards) {
	const mime_info = /* @__PURE__ */ new Map();
	const boards = storyboards.is(PlayerStoryboardSpec) ? storyboards.boards : [storyboards.board];
	for (const storyboard of boards) {
		const extension = new URL(storyboard.template_url).pathname.split(".").pop();
		const mime_type = `image/${extension === "jpg" ? "jpeg" : extension}`;
		if (!mime_info.has(mime_type)) mime_info.set(mime_type, []);
		mime_info.get(mime_type)?.push(storyboard);
	}
	return mime_info;
}
async function getStoryboardMimeType(actions, board, transform_url, probable_mime_type, shared_response) {
	const url = board.template_url;
	const req_url = transform_url(new URL(url.replace("$M", "0")));
	const res_promise = shared_response.response ? shared_response.response : actions.session.http.fetch_function(req_url, {
		method: "HEAD",
		headers: STREAM_HEADERS
	});
	shared_response.response = res_promise;
	return (await res_promise).headers.get("Content-Type") || probable_mime_type;
}
async function getStoryboardBitrate(actions, board, shared_response) {
	const url = board.template_url;
	const response_promises = [];
	const request_limit = Math.min(board.type === "vod" ? board.storyboard_count : 5, 10);
	for (let i = 0; i < request_limit; i++) {
		const req_url = new URL(url.replace("$M", i.toString()));
		const response_promise = i === 0 && shared_response.response ? shared_response.response : actions.session.http.fetch_function(req_url, {
			method: "HEAD",
			headers: STREAM_HEADERS
		});
		if (i === 0) shared_response.response = response_promise;
		response_promises.push(response_promise);
	}
	const responses = await Promise.all(response_promises);
	const content_lengths = [];
	for (const response of responses) content_lengths.push(parseInt(response.headers.get("Content-Length") || "0"));
	return Math.ceil(Math.max(...content_lengths) / (board.rows * board.columns) * 8);
}
function getImageRepresentation(duration, actions, board, transform_url, shared_response) {
	const url = board.template_url;
	const template_url = new URL(url.replace("$M", "$Number$"));
	let template_duration;
	if (board.type === "vod") template_duration = duration / board.storyboard_count;
	else template_duration = duration * board.columns * board.rows;
	return {
		uid: `thumbnails_${board.thumbnail_width}x${board.thumbnail_height}`,
		getBitrate() {
			return getStoryboardBitrate(actions, board, shared_response);
		},
		sheet_width: board.thumbnail_width * board.columns,
		sheet_height: board.thumbnail_height * board.rows,
		thumbnail_height: board.thumbnail_height,
		thumbnail_width: board.thumbnail_width,
		rows: board.rows,
		columns: board.columns,
		template_duration: Math.round(template_duration),
		template_url: transform_url(template_url).toString(),
		getURL(n) {
			return template_url.toString().replace("$Number$", n.toString());
		}
	};
}
function getImageSets(duration, actions, storyboards, transform_url) {
	const mime_info = getStoryboardInfo(storyboards);
	const shared_response = {};
	return Array.from(mime_info.entries()).map(([type, boards]) => ({
		probable_mime_type: type,
		getMimeType() {
			return getStoryboardMimeType(actions, boards[0], transform_url, type, shared_response);
		},
		representations: boards.map((board) => getImageRepresentation(duration, actions, board, transform_url, shared_response))
	}));
}
function getTextSets(caption_tracks, format, transform_url) {
	const mime_type = format === "vtt" ? "text/vtt" : "application/ttml+xml";
	return caption_tracks.map((caption_track) => {
		const url = new URL(caption_track.base_url);
		url.searchParams.set("fmt", format);
		const track_roles = ["caption"];
		if (url.searchParams.has("tlang")) track_roles.push("dub");
		return {
			mime_type,
			language: caption_track.language_code,
			track_name: caption_track.name.toString(),
			track_roles,
			representation: {
				uid: `text-${caption_track.vss_id}`,
				base_url: transform_url(url).toString()
			}
		};
	});
}
async function getStreamingInfo(streaming_data, is_post_live_dvr = false, url_transformer = (url) => url, format_filter, cpn, player, actions, storyboards, caption_tracks, options) {
	if (!streaming_data) throw new InnertubeError("Streaming data not available");
	const formats = format_filter ? streaming_data.adaptive_formats.filter((fmt) => !format_filter(fmt)) : streaming_data.adaptive_formats;
	let getDuration;
	let shared_post_live_dvr_info;
	if (is_post_live_dvr) {
		shared_post_live_dvr_info = {};
		if (!actions) throw new InnertubeError("Unable to get duration or segment count for this Post Live DVR video without an Actions instance");
		getDuration = () => {
			if (!shared_post_live_dvr_info) return Promise.resolve(0);
			return getPostLiveDvrDuration(shared_post_live_dvr_info, formats[0], url_transformer, actions, player, cpn);
		};
	} else {
		const duration = formats[0].approx_duration_ms / 1e3;
		getDuration = () => Promise.resolve(duration);
	}
	const { groups, has_multiple_audio_tracks } = getFormatGroupings(formats, is_post_live_dvr);
	const { video_groups, audio_groups } = groups.reduce((acc, formats) => {
		if (formats[0].has_audio) {
			if (has_multiple_audio_tracks && !formats[0].audio_track) return acc;
			acc.audio_groups.push(formats);
			return acc;
		}
		acc.video_groups.push(formats);
		return acc;
	}, {
		video_groups: [],
		audio_groups: []
	});
	let drc_labels;
	let vb_labels;
	let hasDrc = false;
	let hasVb = false;
	for (const ag of audio_groups.flat()) {
		if (hasDrc === false && ag.is_drc) hasDrc = true;
		if (hasVb === false && ag.is_vb) hasVb = true;
	}
	if (hasDrc) drc_labels = {
		label_original: options?.label_original || "Original",
		label_drc: options?.label_drc || "Stable Volume",
		label_drc_multiple: options?.label_drc_multiple || ((display_name) => `${display_name} (Stable Volume)`)
	};
	if (hasVb) vb_labels = {
		label_original: options?.label_original || "Original",
		label_vb: options?.label_vb || "Voice Boost",
		label_vb_multiple: options?.label_vb_multiple || ((display_name) => `${display_name} (Voice Boost)`)
	};
	const audio_sets = await Promise.all(audio_groups.map((formats) => getAudioSet(formats, url_transformer, actions, player, cpn, shared_post_live_dvr_info, drc_labels, vb_labels, options?.is_sabr)));
	const video_sets = await Promise.all(video_groups.map((formats) => getVideoSet(formats, url_transformer, player, actions, cpn, shared_post_live_dvr_info, options?.is_sabr)));
	let image_sets = [];
	if (storyboards && actions) {
		let duration;
		if (storyboards.is(PlayerStoryboardSpec)) duration = formats[0].approx_duration_ms / 1e3;
		else {
			const target_duration_dec = formats[0].target_duration_dec;
			if (target_duration_dec === void 0) throw new InnertubeError("Format is missing target_duration_dec", { format: formats[0] });
			duration = target_duration_dec;
		}
		image_sets = getImageSets(duration, actions, storyboards, url_transformer);
	}
	let text_sets = [];
	if (caption_tracks && options?.captions_format) {
		if (options.captions_format !== "vtt" && options.captions_format !== "ttml") throw new InnertubeError("Invalid captions format", options.captions_format);
		text_sets = getTextSets(caption_tracks, options.captions_format, url_transformer);
	}
	return {
		getDuration,
		audio_sets,
		video_sets,
		image_sets,
		text_sets
	};
}
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/DashManifest.js
/** @jsxFactory DashUtils.createElement */
/** @jsxFragmentFactory DashUtils.Fragment */
async function OTFPostLiveDvrSegmentInfo({ info }) {
	if (!info.is_oft && !info.is_post_live_dvr) return null;
	const template = await info.getSegmentTemplate();
	return createElement("segmentTemplate", {
		startNumber: template.init_url ? "1" : "0",
		timescale: "1000",
		initialization: template.init_url,
		media: template.media_url
	}, createElement("segmentTimeline", null, template.timeline.map((segment_duration) => createElement("s", {
		d: segment_duration.duration,
		r: segment_duration.repeat_count
	}))));
}
function SegmentInfo({ info }) {
	if (info.is_oft || info.is_post_live_dvr) return createElement(OTFPostLiveDvrSegmentInfo, { info });
	return createElement(Fragment, null, createElement("baseURL", null, info.base_url), createElement("segmentBase", { indexRange: `${info.index_range.start}-${info.index_range.end}` }, createElement("initialization", { range: `${info.init_range.start}-${info.init_range.end}` })));
}
function getDrmSystemId(drm_family) {
	switch (drm_family) {
		case "WIDEVINE": return "edef8ba9-79d6-4ace-a3c8-27dcd51d21ed";
		case "PLAYREADY": return "9a04f079-9840-4286-ab92-e65be0885f95";
		default: return null;
	}
}
async function DashManifest({ streamingData, isPostLiveDvr, transformURL, rejectFormat, cpn, player, actions, storyboards, captionTracks, options }) {
	const { getDuration, audio_sets, video_sets, image_sets, text_sets } = await getStreamingInfo(streamingData, isPostLiveDvr, transformURL, rejectFormat, cpn, player, actions, storyboards, captionTracks, options);
	return createElement("mPD", {
		xmlns: "urn:mpeg:dash:schema:mpd:2011",
		minBufferTime: "PT1.500S",
		profiles: "urn:mpeg:dash:profile:isoff-main:2011",
		type: "static",
		mediaPresentationDuration: `PT${await getDuration()}S`,
		"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"xsi:schemaLocation": "urn:mpeg:dash:schema:mpd:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd"
	}, createElement("period", null, audio_sets.map((set, index) => createElement("adaptationSet", {
		id: index,
		mimeType: set.mime_type,
		startWithSAP: "1",
		subsegmentAlignment: "true",
		lang: set.language,
		codecs: set.codecs,
		audioSamplingRate: set.audio_sample_rate,
		contentType: "audio"
	}, set.drm_families && set.drm_families.map((drm_family) => createElement("contentProtection", { schemeIdUri: `urn:uuid:${getDrmSystemId(drm_family)}` })), set.track_roles && set.track_roles.map((role) => createElement("role", {
		schemeIdUri: "urn:mpeg:dash:role:2011",
		value: role
	})), set.track_name && createElement("label", { id: index }, set.track_name), set.channels && createElement("audioChannelConfiguration", {
		schemeIdUri: "urn:mpeg:dash:23003:3:audio_channel_configuration:2011",
		value: set.channels
	}), set.representations.map((rep) => createElement("representation", {
		id: rep.uid,
		bandwidth: rep.bitrate,
		codecs: rep.codecs,
		audioSamplingRate: rep.audio_sample_rate
	}, rep.channels && createElement("audioChannelConfiguration", {
		schemeIdUri: "urn:mpeg:dash:23003:3:audio_channel_configuration:2011",
		value: rep.channels
	}), createElement(SegmentInfo, { info: rep.segment_info }))))), video_sets.map((set, index) => createElement("adaptationSet", {
		id: index + audio_sets.length,
		mimeType: set.mime_type,
		startWithSAP: "1",
		subsegmentAlignment: "true",
		codecs: set.codecs,
		maxPlayoutRate: "1",
		frameRate: set.fps,
		contentType: "video"
	}, set.drm_families && set.drm_families.map((drm_family) => createElement("contentProtection", { schemeIdUri: `urn:uuid:${getDrmSystemId(drm_family)}` })), set.color_info.primaries && createElement("supplementalProperty", {
		schemeIdUri: "urn:mpeg:mpegB:cicp:ColourPrimaries",
		value: set.color_info.primaries
	}), set.color_info.transfer_characteristics && createElement("supplementalProperty", {
		schemeIdUri: "urn:mpeg:mpegB:cicp:TransferCharacteristics",
		value: set.color_info.transfer_characteristics
	}), set.color_info.matrix_coefficients && createElement("supplementalProperty", {
		schemeIdUri: "urn:mpeg:mpegB:cicp:MatrixCoefficients",
		value: set.color_info.matrix_coefficients
	}), set.representations.map((rep) => createElement("representation", {
		id: rep.uid,
		bandwidth: rep.bitrate,
		width: rep.width,
		height: rep.height,
		codecs: rep.codecs,
		frameRate: rep.fps
	}, createElement(SegmentInfo, { info: rep.segment_info }))))), image_sets.map(async (set, index) => {
		return createElement("adaptationSet", {
			id: index + audio_sets.length + video_sets.length,
			mimeType: await set.getMimeType(),
			contentType: "image"
		}, set.representations.map(async (rep) => createElement("representation", {
			id: `thumbnails_${rep.thumbnail_width}x${rep.thumbnail_height}`,
			bandwidth: await rep.getBitrate(),
			width: rep.sheet_width,
			height: rep.sheet_height
		}, createElement("essentialProperty", {
			schemeIdUri: "http://dashif.org/thumbnail_tile",
			value: `${rep.columns}x${rep.rows}`
		}), createElement("segmentTemplate", {
			media: rep.template_url,
			duration: rep.template_duration,
			startNumber: "0"
		}))));
	}), text_sets.map((set, index) => {
		return createElement("adaptationSet", {
			id: index + audio_sets.length + video_sets.length + image_sets.length,
			mimeType: set.mime_type,
			lang: set.language,
			contentType: "text"
		}, set.track_roles.map((role) => createElement("role", {
			schemeIdUri: "urn:mpeg:dash:role:2011",
			value: role
		})), createElement("label", { id: index + audio_sets.length }, set.track_name), createElement("representation", {
			id: set.representation.uid,
			bandwidth: "0"
		}, createElement("baseURL", null, set.representation.base_url)));
	})));
}
function toDash(streaming_data, is_post_live_dvr = false, url_transformer = (url) => url, format_filter, cpn, player, actions, storyboards, caption_tracks, options) {
	if (!streaming_data) throw new InnertubeError("Streaming data not available");
	return renderToString(createElement(DashManifest, {
		streamingData: streaming_data,
		isPostLiveDvr: is_post_live_dvr,
		transformURL: url_transformer,
		options,
		rejectFormat: format_filter,
		cpn,
		player,
		actions,
		storyboards,
		captionTracks: caption_tracks
	}));
}
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/FormatUtils.js
async function download(options, actions, playability_status, streaming_data, player, cpn) {
	if (playability_status?.status === "UNPLAYABLE") throw new InnertubeError("Video is unplayable", { error_type: "UNPLAYABLE" });
	if (playability_status?.status === "LOGIN_REQUIRED") throw new InnertubeError("Video is login required", { error_type: "LOGIN_REQUIRED" });
	if (!streaming_data) throw new InnertubeError("Streaming data not available.", { error_type: "NO_STREAMING_DATA" });
	const opts = {
		quality: "360p",
		type: "video+audio",
		format: "mp4",
		range: void 0,
		...options
	};
	const format = chooseFormat(opts, streaming_data);
	const format_url = await format.decipher(player);
	if (opts.type === "video+audio" && !options.range) {
		const response = await actions.session.http.fetch_function(`${format_url}&cpn=${cpn}`, {
			method: "GET",
			headers: STREAM_HEADERS,
			redirect: "follow"
		});
		if (!response.ok) throw new InnertubeError("The server responded with a non 2xx status code", {
			error_type: "FETCH_FAILED",
			response
		});
		const body = response.body;
		if (!body) throw new InnertubeError("Could not get ReadableStream from fetch Response.", {
			error_type: "FETCH_FAILED",
			response
		});
		return body;
	}
	const chunk_size = 10485760;
	let chunk_start = options.range ? options.range.start : 0;
	let chunk_end = options.range ? options.range.end : chunk_size;
	let must_end = false;
	let cancel;
	return new Platform.shim.ReadableStream({
		start() {},
		pull: async (controller) => {
			if (must_end) {
				controller.close();
				return;
			}
			if (chunk_end >= (format.content_length ? format.content_length : 0) || options.range) must_end = true;
			return new Promise(async (resolve, reject) => {
				try {
					cancel = new AbortController();
					const response = await actions.session.http.fetch_function(`${format_url}&cpn=${cpn}&range=${chunk_start}-${chunk_end || ""}`, {
						method: "GET",
						headers: { ...STREAM_HEADERS },
						signal: cancel.signal
					});
					if (!response.ok) throw new InnertubeError("The server responded with a non 2xx status code", {
						error_type: "FETCH_FAILED",
						response
					});
					const body = response.body;
					if (!body) throw new InnertubeError("Could not get ReadableStream from fetch Response.", {
						error_type: "FETCH_FAILED",
						response
					});
					for await (const chunk of streamToIterable(body)) controller.enqueue(chunk);
					chunk_start = chunk_end + 1;
					chunk_end += chunk_size;
					resolve();
				} catch (e) {
					reject(e);
				}
			});
		},
		async cancel(reason) {
			cancel.abort(reason);
		}
	}, {
		highWaterMark: 1,
		size(chunk) {
			return chunk.byteLength;
		}
	});
}
/**
* Selects the format that best matches the given options.
* @param options - Options
* @param streaming_data - Streaming data
*/
function chooseFormat(options, streaming_data) {
	if (!streaming_data) throw new InnertubeError("Streaming data not available");
	const formats = [...streaming_data.formats || [], ...streaming_data.adaptive_formats || []];
	if (options.itag) {
		const candidates = formats.filter((format) => format.itag === options.itag);
		if (!candidates.length) throw new InnertubeError("No matching formats found", { options });
		return candidates[0];
	}
	const requires_audio = options.type ? options.type.includes("audio") : true;
	const requires_video = options.type ? options.type.includes("video") : true;
	const language = options.language || "original";
	const quality = options.quality || "best";
	let best_width = -1;
	const is_best = ["best", "bestefficiency"].includes(quality);
	const use_most_efficient = quality !== "best";
	let candidates = formats.filter((format) => {
		if (requires_audio && !format.has_audio) return false;
		if (requires_video && !format.has_video) return false;
		if (options.codec && !format.mime_type.includes(options.codec)) return false;
		if (options.format !== "any" && !format.mime_type.includes(options.format || "mp4")) return false;
		if (!is_best && format.quality_label !== quality) return false;
		if (format.width && best_width < format.width) best_width = format.width;
		return true;
	});
	if (!candidates.length) throw new InnertubeError("No matching formats found", { options });
	if (is_best && requires_video) candidates = candidates.filter((format) => format.width === best_width);
	if (requires_audio && !requires_video) {
		const audio_only = candidates.filter((format) => {
			if (language !== "original") return !format.has_video && !format.has_text && format.language === language;
			return !format.has_video && !format.has_text && format.is_original;
		});
		if (audio_only.length > 0) candidates = audio_only;
	}
	if (use_most_efficient) candidates.sort((a, b) => a.bitrate - b.bitrate);
	else candidates.sort((a, b) => b.bitrate - a.bitrate);
	return candidates[0];
}
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/HTTPClient.js
var HTTPClient = class {
	#session;
	#cookie;
	#fetch;
	constructor(session, cookie, fetch) {
		this.#session = session;
		this.#cookie = cookie;
		this.#fetch = fetch || Platform.shim.fetch;
	}
	get fetch_function() {
		return this.#fetch;
	}
	async fetch(input, init) {
		const session = this.#session;
		const innertube_url = URLS.API.PRODUCTION_1 + session.api_version;
		const baseURL = init?.baseURL || innertube_url;
		const request_url = typeof input === "string" ? new URL(`${baseURL}${baseURL.endsWith("/") || input.startsWith("/") ? "" : "/"}${input}`) : input instanceof URL ? input : new URL(input.url, baseURL);
		const headers = init?.headers || (input instanceof Platform.shim.Request ? input.headers : new Platform.shim.Headers()) || new Platform.shim.Headers();
		const body = init?.body || (input instanceof Platform.shim.Request ? input.body : void 0);
		const request_headers = new Platform.shim.Headers(headers);
		this.#setupCommonHeaders(request_headers, session, request_url);
		request_url.searchParams.set("prettyPrint", "false");
		request_url.searchParams.set("alt", "json");
		const content_type = request_headers.get("Content-Type");
		let request_body = body;
		let is_web_kids = false;
		const is_innertube_req = baseURL === innertube_url || baseURL === URLS.YT_UPLOAD;
		if (content_type === "application/json" && is_innertube_req && typeof body === "string") {
			const { newBody, isWebKids: processedIsWebKids, clientVersion: processedClientVersion, clientNameId: processedClientNameId, adjustedClientName } = this.#processJsonPayload(body, session);
			request_body = newBody;
			is_web_kids = processedIsWebKids;
			if (processedClientVersion) request_headers.set("X-Youtube-Client-Version", processedClientVersion);
			if (processedClientNameId) request_headers.set("X-Youtube-Client-Name", processedClientNameId);
			if (adjustedClientName === CLIENTS.ANDROID.NAME || adjustedClientName === CLIENTS.YTMUSIC_ANDROID.NAME) {
				request_headers.set("User-Agent", CLIENTS.ANDROID.USER_AGENT);
				request_headers.set("X-GOOG-API-FORMAT-VERSION", "2");
			} else if (adjustedClientName === CLIENTS.IOS.NAME) request_headers.set("User-Agent", CLIENTS.IOS.USER_AGENT);
			else if (adjustedClientName === CLIENTS.ANDROID_VR.NAME) request_headers.set("User-Agent", CLIENTS.ANDROID_VR.USER_AGENT);
			else if (adjustedClientName === CLIENTS.VISIONOS.NAME) request_headers.set("User-Agent", CLIENTS.VISIONOS.USER_AGENT);
		} else if (content_type === "application/x-protobuf") {
			if (Platform.shim.server) {
				request_headers.set("User-Agent", CLIENTS.ANDROID.USER_AGENT);
				request_headers.set("X-GOOG-API-FORMAT-VERSION", "2");
				request_headers.delete("X-Youtube-Client-Version");
			}
		}
		if (session.logged_in && is_innertube_req && !is_web_kids) {
			const oauth = session.oauth;
			if (oauth.oauth2_tokens) {
				if (oauth.shouldRefreshToken()) await oauth.refreshAccessToken();
				request_headers.set("Authorization", `Bearer ${oauth.oauth2_tokens.access_token}`);
			}
			const cookie = this.#cookie;
			if (cookie) {
				const sapisid = getCookie(cookie, "SAPISID");
				if (sapisid) {
					request_headers.set("Authorization", await generateSidAuth(sapisid));
					request_headers.set("X-Goog-Authuser", session.account_index.toString());
					if (session.context.user.onBehalfOfUser) request_headers.set("X-Goog-PageId", session.context.user.onBehalfOfUser);
				}
				request_headers.set("Cookie", cookie);
			}
		}
		const request = new Platform.shim.Request(request_url, input instanceof Platform.shim.Request ? input : init);
		const response = await this.#fetch(request, {
			body: request_body,
			headers: request_headers,
			redirect: input instanceof Platform.shim.Request ? input.redirect : init?.redirect || "follow",
			...Platform.shim.runtime !== "cf-worker" ? { credentials: "include" } : {}
		});
		if (response.ok) return response;
		throw new InnertubeError(`Request to ${response.url} failed with status code ${response.status}`, await response.text());
	}
	#processJsonPayload(json_body, session) {
		const parsed_payload = JSON.parse(json_body);
		const adjusted_context = JSON.parse(JSON.stringify(session.context));
		this.#adjustContext(adjusted_context, parsed_payload.client);
		const new_payload = {
			...parsed_payload,
			context: adjusted_context
		};
		const clientVersion = new_payload.context.client.clientVersion;
		const clientNameId = CLIENT_NAME_IDS[new_payload.context.client.clientName];
		delete new_payload.client;
		const isWebKids = new_payload.context.client.clientName === CLIENTS.WEB_KIDS.NAME;
		return {
			newBody: JSON.stringify(new_payload),
			isWebKids,
			clientVersion,
			clientNameId,
			adjustedClientName: new_payload.context.client.clientName
		};
	}
	#setupCommonHeaders(request_headers, session, request_url) {
		request_headers.set("Accept", "*/*");
		request_headers.set("Accept-Language", "*");
		request_headers.set("X-Goog-Visitor-Id", session.context.client.visitorData || "");
		request_headers.set("X-Youtube-Client-Version", session.context.client.clientVersion || "");
		const client_name_id = CLIENT_NAME_IDS[session.context.client.clientName];
		if (client_name_id) request_headers.set("X-Youtube-Client-Name", client_name_id);
		if (Platform.shim.server) {
			request_headers.set("User-Agent", session.user_agent || "");
			request_headers.set("Origin", request_url.origin);
		}
	}
	#adjustContext(ctx, client) {
		if (!client) return;
		const clientName = client.toUpperCase();
		if (!SUPPORTED_CLIENTS.includes(clientName)) throw new InnertubeError(`Invalid client: ${client}`, { available_innertube_clients: SUPPORTED_CLIENTS });
		if (clientName !== "WEB") delete ctx.client.configInfo;
		if (clientName === "ANDROID" || clientName === "YTMUSIC_ANDROID" || clientName === "YTSTUDIO_ANDROID") {
			ctx.client.androidSdkVersion = CLIENTS.ANDROID.SDK_VERSION;
			ctx.client.userAgent = CLIENTS.ANDROID.USER_AGENT;
			ctx.client.osName = "Android";
			ctx.client.osVersion = "13";
			ctx.client.platform = "MOBILE";
		}
		switch (clientName) {
			case "MWEB":
				ctx.client.clientVersion = CLIENTS.MWEB.VERSION;
				ctx.client.clientName = CLIENTS.MWEB.NAME;
				ctx.client.clientFormFactor = "SMALL_FORM_FACTOR";
				ctx.client.platform = "MOBILE";
				break;
			case "IOS":
				ctx.client.deviceMake = "Apple";
				ctx.client.deviceModel = CLIENTS.IOS.DEVICE_MODEL;
				ctx.client.clientVersion = CLIENTS.IOS.VERSION;
				ctx.client.clientName = CLIENTS.IOS.NAME;
				ctx.client.platform = "MOBILE";
				ctx.client.osName = CLIENTS.IOS.OS_NAME;
				ctx.client.osVersion = CLIENTS.IOS.OS_VERSION;
				delete ctx.client.browserName;
				delete ctx.client.browserVersion;
				break;
			case "YTMUSIC":
				ctx.client.clientVersion = CLIENTS.YTMUSIC.VERSION;
				ctx.client.clientName = CLIENTS.YTMUSIC.NAME;
				break;
			case "ANDROID":
				ctx.client.clientVersion = CLIENTS.ANDROID.VERSION;
				ctx.client.clientFormFactor = "SMALL_FORM_FACTOR";
				ctx.client.clientName = CLIENTS.ANDROID.NAME;
				break;
			case "ANDROID_VR":
				ctx.client.androidSdkVersion = 32;
				ctx.client.osName = "Android";
				ctx.client.osVersion = "12L";
				ctx.client.platform = "MOBILE";
				ctx.client.userAgent = CLIENTS.ANDROID_VR.USER_AGENT;
				ctx.client.deviceMake = CLIENTS.ANDROID_VR.DEVICE_MAKE;
				ctx.client.deviceModel = CLIENTS.ANDROID_VR.DEVICE_MODEL;
				ctx.client.clientVersion = CLIENTS.ANDROID_VR.VERSION;
				ctx.client.clientFormFactor = "SMALL_FORM_FACTOR";
				ctx.client.clientName = CLIENTS.ANDROID_VR.NAME;
				break;
			case "VISIONOS":
				ctx.client.deviceMake = CLIENTS.VISIONOS.DEVICE_MAKE;
				ctx.client.deviceModel = CLIENTS.VISIONOS.DEVICE_MODEL;
				ctx.client.clientVersion = CLIENTS.VISIONOS.VERSION;
				ctx.client.clientName = CLIENTS.VISIONOS.NAME;
				ctx.client.platform = "MOBILE";
				ctx.client.osName = CLIENTS.VISIONOS.OS_NAME;
				ctx.client.osVersion = CLIENTS.VISIONOS.OS_VERSION;
				ctx.client.userAgent = CLIENTS.VISIONOS.USER_AGENT;
				delete ctx.client.browserName;
				delete ctx.client.browserVersion;
				break;
			case "YTMUSIC_ANDROID":
				ctx.client.clientVersion = CLIENTS.YTMUSIC_ANDROID.VERSION;
				ctx.client.clientFormFactor = "SMALL_FORM_FACTOR";
				ctx.client.clientName = CLIENTS.YTMUSIC_ANDROID.NAME;
				break;
			case "YTSTUDIO_ANDROID":
				ctx.client.clientVersion = CLIENTS.YTSTUDIO_ANDROID.VERSION;
				ctx.client.clientFormFactor = "SMALL_FORM_FACTOR";
				ctx.client.clientName = CLIENTS.YTSTUDIO_ANDROID.NAME;
				break;
			case "TV":
				ctx.client.clientVersion = CLIENTS.TV.VERSION;
				ctx.client.clientName = CLIENTS.TV.NAME;
				ctx.client.userAgent = CLIENTS.TV.USER_AGENT;
				break;
			case "TV_SIMPLY":
				ctx.client.clientVersion = CLIENTS.TV_SIMPLY.VERSION;
				ctx.client.clientName = CLIENTS.TV_SIMPLY.NAME;
				break;
			case "TV_EMBEDDED":
				ctx.client.clientName = CLIENTS.TV_EMBEDDED.NAME;
				ctx.client.clientVersion = CLIENTS.TV_EMBEDDED.VERSION;
				ctx.client.clientScreen = "EMBED";
				ctx.thirdParty = { embedUrl: URLS.YT_BASE };
				break;
			case "YTKIDS":
				ctx.client.clientVersion = CLIENTS.WEB_KIDS.VERSION;
				ctx.client.clientName = CLIENTS.WEB_KIDS.NAME;
				ctx.client.kidsAppInfo = {
					categorySettings: { enabledCategories: [
						"approved_for_you",
						"black_joy",
						"camp",
						"collections",
						"earth",
						"explore",
						"favorites",
						"gaming",
						"halloween",
						"hero",
						"learning",
						"move",
						"music",
						"reading",
						"shared_by_parents",
						"shows",
						"soccer",
						"sports",
						"spotlight",
						"winter"
					] },
					contentSettings: {
						corpusPreference: "KIDS_CORPUS_PREFERENCE_YOUNGER",
						kidsNoSearchMode: "YT_KIDS_NO_SEARCH_MODE_OFF"
					}
				};
				break;
			case "WEB_EMBEDDED":
				ctx.client.clientName = CLIENTS.WEB_EMBEDDED.NAME;
				ctx.client.clientVersion = CLIENTS.WEB_EMBEDDED.VERSION;
				ctx.client.clientScreen = "EMBED";
				ctx.thirdParty = { embedUrl: URLS.GOOGLE_SEARCH_BASE };
				break;
			case "WEB_CREATOR":
				ctx.client.clientName = CLIENTS.WEB_CREATOR.NAME;
				ctx.client.clientVersion = CLIENTS.WEB_CREATOR.VERSION;
		}
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/BinarySerializer.js
var MAGIC_HEADER = 5849684;
function serialize(data) {
	const json = JSON.stringify(data);
	const jsonBytes = new TextEncoder().encode(json);
	const compressed = gzipSync(jsonBytes);
	const buffer = new ArrayBuffer(12 + compressed.byteLength);
	const view = new DataView(buffer);
	view.setUint32(0, MAGIC_HEADER, true);
	view.setUint32(4, 2, true);
	view.setUint32(8, compressed.byteLength, true);
	new Uint8Array(buffer).set(compressed, 12);
	return buffer;
}
function deserialize(buffer) {
	if (buffer.byteLength < 12) throw new Error("Invalid binary format: buffer too short");
	const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	if (view.getUint32(0, true) !== 5849684) throw new Error("Invalid binary format: magic header mismatch");
	const version = view.getUint32(4, true);
	if (version !== 2) throw new Error(`Unsupported binary format version: ${version}`);
	const length = view.getUint32(8, true);
	if (12 + length > buffer.byteLength) throw new Error("Invalid binary format: data length out of bounds");
	const compressed = buffer.subarray(12, 12 + length);
	const decompressed = gunzipSync(compressed);
	const json = new TextDecoder().decode(decompressed);
	return JSON.parse(json);
}
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/misc/params.js
var SearchFilter_Prioritize = {
	RELEVANCE: 0,
	0: "RELEVANCE",
	POPULARITY: 3,
	3: "POPULARITY",
	UNRECOGNIZED: -1,
	"-1": "UNRECOGNIZED"
};
var SearchFilter_Filters_UploadDate = {
	ANY_DATE: 0,
	0: "ANY_DATE",
	TODAY: 2,
	2: "TODAY",
	WEEK: 3,
	3: "WEEK",
	MONTH: 4,
	4: "MONTH",
	YEAR: 5,
	5: "YEAR",
	UNRECOGNIZED: -1,
	"-1": "UNRECOGNIZED"
};
var SearchFilter_Filters_SearchType = {
	ANY_TYPE: 0,
	0: "ANY_TYPE",
	VIDEO: 1,
	1: "VIDEO",
	CHANNEL: 2,
	2: "CHANNEL",
	PLAYLIST: 3,
	3: "PLAYLIST",
	MOVIE: 4,
	4: "MOVIE",
	SHORTS: 9,
	9: "SHORTS",
	UNRECOGNIZED: -1,
	"-1": "UNRECOGNIZED"
};
var SearchFilter_Filters_Duration = {
	ANY_DURATION: 0,
	0: "ANY_DURATION",
	OVER_TWENTY_MINS: 2,
	2: "OVER_TWENTY_MINS",
	UNDER_THREE_MINS: 4,
	4: "UNDER_THREE_MINS",
	THREE_TO_TWENTY_MINS: 5,
	5: "THREE_TO_TWENTY_MINS",
	UNRECOGNIZED: -1,
	"-1": "UNRECOGNIZED"
};
function createBaseVisitorData() {
	return {
		id: "",
		timestamp: 0
	};
}
var VisitorData = {
	encode(message, writer = new BinaryWriter()) {
		if (message.id !== "") writer.uint32(10).string(message.id);
		if (message.timestamp !== 0) writer.uint32(40).int32(message.timestamp);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseVisitorData();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.id = reader.string();
					continue;
				case 5:
					if (tag !== 40) break;
					message.timestamp = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseSearchFilter() {
	return {
		prioritize: void 0,
		filters: void 0
	};
}
var SearchFilter$1 = {
	encode(message, writer = new BinaryWriter()) {
		if (message.prioritize !== void 0) writer.uint32(8).int32(message.prioritize);
		if (message.filters !== void 0) SearchFilter_Filters.encode(message.filters, writer.uint32(18).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseSearchFilter();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.prioritize = reader.int32();
					continue;
				case 2:
					if (tag !== 18) break;
					message.filters = SearchFilter_Filters.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseSearchFilter_Filters() {
	return {
		uploadDate: void 0,
		type: void 0,
		duration: void 0,
		musicSearchType: void 0,
		featuresHd: void 0,
		featuresSubtitles: void 0,
		featuresCreativeCommons: void 0,
		features3d: void 0,
		featuresLive: void 0,
		featuresPurchased: void 0,
		features4k: void 0,
		features360: void 0,
		featuresLocation: void 0,
		featuresHdr: void 0,
		featuresVr180: void 0
	};
}
var SearchFilter_Filters = {
	encode(message, writer = new BinaryWriter()) {
		if (message.uploadDate !== void 0) writer.uint32(8).int32(message.uploadDate);
		if (message.type !== void 0) writer.uint32(16).int32(message.type);
		if (message.duration !== void 0) writer.uint32(24).int32(message.duration);
		if (message.musicSearchType !== void 0) SearchFilter_Filters_MusicSearchType.encode(message.musicSearchType, writer.uint32(138).fork()).join();
		if (message.featuresHd !== void 0) writer.uint32(32).bool(message.featuresHd);
		if (message.featuresSubtitles !== void 0) writer.uint32(40).bool(message.featuresSubtitles);
		if (message.featuresCreativeCommons !== void 0) writer.uint32(48).bool(message.featuresCreativeCommons);
		if (message.features3d !== void 0) writer.uint32(56).bool(message.features3d);
		if (message.featuresLive !== void 0) writer.uint32(64).bool(message.featuresLive);
		if (message.featuresPurchased !== void 0) writer.uint32(72).bool(message.featuresPurchased);
		if (message.features4k !== void 0) writer.uint32(112).bool(message.features4k);
		if (message.features360 !== void 0) writer.uint32(120).bool(message.features360);
		if (message.featuresLocation !== void 0) writer.uint32(184).bool(message.featuresLocation);
		if (message.featuresHdr !== void 0) writer.uint32(200).bool(message.featuresHdr);
		if (message.featuresVr180 !== void 0) writer.uint32(208).bool(message.featuresVr180);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseSearchFilter_Filters();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.uploadDate = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.type = reader.int32();
					continue;
				case 3:
					if (tag !== 24) break;
					message.duration = reader.int32();
					continue;
				case 17:
					if (tag !== 138) break;
					message.musicSearchType = SearchFilter_Filters_MusicSearchType.decode(reader, reader.uint32());
					continue;
				case 4:
					if (tag !== 32) break;
					message.featuresHd = reader.bool();
					continue;
				case 5:
					if (tag !== 40) break;
					message.featuresSubtitles = reader.bool();
					continue;
				case 6:
					if (tag !== 48) break;
					message.featuresCreativeCommons = reader.bool();
					continue;
				case 7:
					if (tag !== 56) break;
					message.features3d = reader.bool();
					continue;
				case 8:
					if (tag !== 64) break;
					message.featuresLive = reader.bool();
					continue;
				case 9:
					if (tag !== 72) break;
					message.featuresPurchased = reader.bool();
					continue;
				case 14:
					if (tag !== 112) break;
					message.features4k = reader.bool();
					continue;
				case 15:
					if (tag !== 120) break;
					message.features360 = reader.bool();
					continue;
				case 23:
					if (tag !== 184) break;
					message.featuresLocation = reader.bool();
					continue;
				case 25:
					if (tag !== 200) break;
					message.featuresHdr = reader.bool();
					continue;
				case 26:
					if (tag !== 208) break;
					message.featuresVr180 = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseSearchFilter_Filters_MusicSearchType() {
	return {
		song: void 0,
		video: void 0,
		album: void 0,
		artist: void 0,
		playlist: void 0
	};
}
var SearchFilter_Filters_MusicSearchType = {
	encode(message, writer = new BinaryWriter()) {
		if (message.song !== void 0) writer.uint32(8).bool(message.song);
		if (message.video !== void 0) writer.uint32(16).bool(message.video);
		if (message.album !== void 0) writer.uint32(24).bool(message.album);
		if (message.artist !== void 0) writer.uint32(32).bool(message.artist);
		if (message.playlist !== void 0) writer.uint32(40).bool(message.playlist);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseSearchFilter_Filters_MusicSearchType();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.song = reader.bool();
					continue;
				case 2:
					if (tag !== 16) break;
					message.video = reader.bool();
					continue;
				case 3:
					if (tag !== 24) break;
					message.album = reader.bool();
					continue;
				case 4:
					if (tag !== 32) break;
					message.artist = reader.bool();
					continue;
				case 5:
					if (tag !== 40) break;
					message.playlist = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseNotificationPreferences() {
	return {
		channelId: "",
		prefId: void 0,
		number0: void 0,
		number1: void 0
	};
}
var NotificationPreferences = {
	encode(message, writer = new BinaryWriter()) {
		if (message.channelId !== "") writer.uint32(10).string(message.channelId);
		if (message.prefId !== void 0) NotificationPreferences_Preference.encode(message.prefId, writer.uint32(18).fork()).join();
		if (message.number0 !== void 0) writer.uint32(24).int32(message.number0);
		if (message.number1 !== void 0) writer.uint32(32).int32(message.number1);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseNotificationPreferences();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.channelId = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.prefId = NotificationPreferences_Preference.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 24) break;
					message.number0 = reader.int32();
					continue;
				case 4:
					if (tag !== 32) break;
					message.number1 = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseNotificationPreferences_Preference() {
	return { index: 0 };
}
var NotificationPreferences_Preference = {
	encode(message, writer = new BinaryWriter()) {
		if (message.index !== 0) writer.uint32(8).int32(message.index);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseNotificationPreferences_Preference();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.index = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseLiveMessageParams() {
	return {
		params: void 0,
		number0: void 0,
		number1: void 0
	};
}
var LiveMessageParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.params !== void 0) LiveMessageParams_Params.encode(message.params, writer.uint32(10).fork()).join();
		if (message.number0 !== void 0) writer.uint32(16).int32(message.number0);
		if (message.number1 !== void 0) writer.uint32(24).int32(message.number1);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseLiveMessageParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.params = LiveMessageParams_Params.decode(reader, reader.uint32());
					continue;
				case 2:
					if (tag !== 16) break;
					message.number0 = reader.int32();
					continue;
				case 3:
					if (tag !== 24) break;
					message.number1 = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseLiveMessageParams_Params() {
	return { ids: void 0 };
}
var LiveMessageParams_Params = {
	encode(message, writer = new BinaryWriter()) {
		if (message.ids !== void 0) LiveMessageParams_Params_Ids.encode(message.ids, writer.uint32(42).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseLiveMessageParams_Params();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 5:
					if (tag !== 42) break;
					message.ids = LiveMessageParams_Params_Ids.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseLiveMessageParams_Params_Ids() {
	return {
		channelId: "",
		videoId: ""
	};
}
var LiveMessageParams_Params_Ids = {
	encode(message, writer = new BinaryWriter()) {
		if (message.channelId !== "") writer.uint32(10).string(message.channelId);
		if (message.videoId !== "") writer.uint32(18).string(message.videoId);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseLiveMessageParams_Params_Ids();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.channelId = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.videoId = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseGetCommentsSectionParams() {
	return {
		ctx: void 0,
		unkParam: 0,
		params: void 0
	};
}
var GetCommentsSectionParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.ctx !== void 0) GetCommentsSectionParams_Context.encode(message.ctx, writer.uint32(18).fork()).join();
		if (message.unkParam !== 0) writer.uint32(24).int32(message.unkParam);
		if (message.params !== void 0) GetCommentsSectionParams_Params.encode(message.params, writer.uint32(50).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseGetCommentsSectionParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.ctx = GetCommentsSectionParams_Context.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 24) break;
					message.unkParam = reader.int32();
					continue;
				case 6:
					if (tag !== 50) break;
					message.params = GetCommentsSectionParams_Params.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseGetCommentsSectionParams_Context() {
	return { videoId: "" };
}
var GetCommentsSectionParams_Context = {
	encode(message, writer = new BinaryWriter()) {
		if (message.videoId !== "") writer.uint32(18).string(message.videoId);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseGetCommentsSectionParams_Context();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.videoId = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseGetCommentsSectionParams_Params() {
	return {
		unkToken: void 0,
		opts: void 0,
		repliesOpts: void 0,
		page: void 0,
		target: ""
	};
}
var GetCommentsSectionParams_Params = {
	encode(message, writer = new BinaryWriter()) {
		if (message.unkToken !== void 0) writer.uint32(10).string(message.unkToken);
		if (message.opts !== void 0) GetCommentsSectionParams_Params_Options.encode(message.opts, writer.uint32(34).fork()).join();
		if (message.repliesOpts !== void 0) GetCommentsSectionParams_Params_RepliesOptions.encode(message.repliesOpts, writer.uint32(26).fork()).join();
		if (message.page !== void 0) writer.uint32(40).int32(message.page);
		if (message.target !== "") writer.uint32(66).string(message.target);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseGetCommentsSectionParams_Params();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.unkToken = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.opts = GetCommentsSectionParams_Params_Options.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 26) break;
					message.repliesOpts = GetCommentsSectionParams_Params_RepliesOptions.decode(reader, reader.uint32());
					continue;
				case 5:
					if (tag !== 40) break;
					message.page = reader.int32();
					continue;
				case 8:
					if (tag !== 66) break;
					message.target = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseGetCommentsSectionParams_Params_Options() {
	return {
		videoId: "",
		sortBy: 0,
		type: 0,
		commentId: void 0
	};
}
var GetCommentsSectionParams_Params_Options = {
	encode(message, writer = new BinaryWriter()) {
		if (message.videoId !== "") writer.uint32(34).string(message.videoId);
		if (message.sortBy !== 0) writer.uint32(48).int32(message.sortBy);
		if (message.type !== 0) writer.uint32(120).int32(message.type);
		if (message.commentId !== void 0) writer.uint32(130).string(message.commentId);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseGetCommentsSectionParams_Params_Options();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 4:
					if (tag !== 34) break;
					message.videoId = reader.string();
					continue;
				case 6:
					if (tag !== 48) break;
					message.sortBy = reader.int32();
					continue;
				case 15:
					if (tag !== 120) break;
					message.type = reader.int32();
					continue;
				case 16:
					if (tag !== 130) break;
					message.commentId = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseGetCommentsSectionParams_Params_RepliesOptions() {
	return {
		commentId: "",
		unkopts: void 0,
		channelId: void 0,
		videoId: "",
		unkParam1: 0,
		unkParam2: 0
	};
}
var GetCommentsSectionParams_Params_RepliesOptions = {
	encode(message, writer = new BinaryWriter()) {
		if (message.commentId !== "") writer.uint32(18).string(message.commentId);
		if (message.unkopts !== void 0) GetCommentsSectionParams_Params_RepliesOptions_UnkOpts.encode(message.unkopts, writer.uint32(34).fork()).join();
		if (message.channelId !== void 0) writer.uint32(42).string(message.channelId);
		if (message.videoId !== "") writer.uint32(50).string(message.videoId);
		if (message.unkParam1 !== 0) writer.uint32(64).int32(message.unkParam1);
		if (message.unkParam2 !== 0) writer.uint32(72).int32(message.unkParam2);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseGetCommentsSectionParams_Params_RepliesOptions();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.commentId = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.unkopts = GetCommentsSectionParams_Params_RepliesOptions_UnkOpts.decode(reader, reader.uint32());
					continue;
				case 5:
					if (tag !== 42) break;
					message.channelId = reader.string();
					continue;
				case 6:
					if (tag !== 50) break;
					message.videoId = reader.string();
					continue;
				case 8:
					if (tag !== 64) break;
					message.unkParam1 = reader.int32();
					continue;
				case 9:
					if (tag !== 72) break;
					message.unkParam2 = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseGetCommentsSectionParams_Params_RepliesOptions_UnkOpts() {
	return { unkParam: 0 };
}
var GetCommentsSectionParams_Params_RepliesOptions_UnkOpts = {
	encode(message, writer = new BinaryWriter()) {
		if (message.unkParam !== 0) writer.uint32(8).int32(message.unkParam);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseGetCommentsSectionParams_Params_RepliesOptions_UnkOpts();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.unkParam = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCreateCommentParams() {
	return {
		videoId: "",
		params: void 0,
		number: 0
	};
}
var CreateCommentParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.videoId !== "") writer.uint32(18).string(message.videoId);
		if (message.params !== void 0) CreateCommentParams_Params.encode(message.params, writer.uint32(42).fork()).join();
		if (message.number !== 0) writer.uint32(80).int32(message.number);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCreateCommentParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.videoId = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.params = CreateCommentParams_Params.decode(reader, reader.uint32());
					continue;
				case 10:
					if (tag !== 80) break;
					message.number = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCreateCommentParams_Params() {
	return { index: 0 };
}
var CreateCommentParams_Params = {
	encode(message, writer = new BinaryWriter()) {
		if (message.index !== 0) writer.uint32(8).int32(message.index);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCreateCommentParams_Params();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.index = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBasePeformCommentActionParams() {
	return {
		type: 0,
		commentId: "",
		videoId: "",
		unkNum: void 0,
		channelId: void 0,
		translateCommentParams: void 0
	};
}
var PeformCommentActionParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.type !== 0) writer.uint32(8).int32(message.type);
		if (message.commentId !== "") writer.uint32(26).string(message.commentId);
		if (message.videoId !== "") writer.uint32(42).string(message.videoId);
		if (message.unkNum !== void 0) writer.uint32(16).int32(message.unkNum);
		if (message.channelId !== void 0) writer.uint32(186).string(message.channelId);
		if (message.translateCommentParams !== void 0) PeformCommentActionParams_TranslateCommentParams.encode(message.translateCommentParams, writer.uint32(250).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBasePeformCommentActionParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.type = reader.int32();
					continue;
				case 3:
					if (tag !== 26) break;
					message.commentId = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.videoId = reader.string();
					continue;
				case 2:
					if (tag !== 16) break;
					message.unkNum = reader.int32();
					continue;
				case 23:
					if (tag !== 186) break;
					message.channelId = reader.string();
					continue;
				case 31:
					if (tag !== 250) break;
					message.translateCommentParams = PeformCommentActionParams_TranslateCommentParams.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBasePeformCommentActionParams_TranslateCommentParams() {
	return {
		params: void 0,
		commentId: "",
		targetLanguage: ""
	};
}
var PeformCommentActionParams_TranslateCommentParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.params !== void 0) PeformCommentActionParams_TranslateCommentParams_Params.encode(message.params, writer.uint32(26).fork()).join();
		if (message.commentId !== "") writer.uint32(18).string(message.commentId);
		if (message.targetLanguage !== "") writer.uint32(34).string(message.targetLanguage);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBasePeformCommentActionParams_TranslateCommentParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 3:
					if (tag !== 26) break;
					message.params = PeformCommentActionParams_TranslateCommentParams_Params.decode(reader, reader.uint32());
					continue;
				case 2:
					if (tag !== 18) break;
					message.commentId = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.targetLanguage = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBasePeformCommentActionParams_TranslateCommentParams_Params() {
	return { comment: void 0 };
}
var PeformCommentActionParams_TranslateCommentParams_Params = {
	encode(message, writer = new BinaryWriter()) {
		if (message.comment !== void 0) PeformCommentActionParams_TranslateCommentParams_Params_Comment.encode(message.comment, writer.uint32(10).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBasePeformCommentActionParams_TranslateCommentParams_Params();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.comment = PeformCommentActionParams_TranslateCommentParams_Params_Comment.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBasePeformCommentActionParams_TranslateCommentParams_Params_Comment() {
	return { text: "" };
}
var PeformCommentActionParams_TranslateCommentParams_Params_Comment = {
	encode(message, writer = new BinaryWriter()) {
		if (message.text !== "") writer.uint32(10).string(message.text);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBasePeformCommentActionParams_TranslateCommentParams_Params_Comment();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.text = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseHashtag() {
	return { params: void 0 };
}
var Hashtag = {
	encode(message, writer = new BinaryWriter()) {
		if (message.params !== void 0) Hashtag_Params.encode(message.params, writer.uint32(746).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHashtag();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 93:
					if (tag !== 746) break;
					message.params = Hashtag_Params.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseHashtag_Params() {
	return {
		hashtag: "",
		type: 0
	};
}
var Hashtag_Params = {
	encode(message, writer = new BinaryWriter()) {
		if (message.hashtag !== "") writer.uint32(10).string(message.hashtag);
		if (message.type !== 0) writer.uint32(24).int32(message.type);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseHashtag_Params();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.hashtag = reader.string();
					continue;
				case 3:
					if (tag !== 24) break;
					message.type = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseReelSequence() {
	return {
		shortId: "",
		params: void 0,
		feature2: 0,
		feature3: 0
	};
}
var ReelSequence = {
	encode(message, writer = new BinaryWriter()) {
		if (message.shortId !== "") writer.uint32(10).string(message.shortId);
		if (message.params !== void 0) ReelSequence_Params.encode(message.params, writer.uint32(42).fork()).join();
		if (message.feature2 !== 0) writer.uint32(80).int32(message.feature2);
		if (message.feature3 !== 0) writer.uint32(104).int32(message.feature3);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseReelSequence();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.shortId = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.params = ReelSequence_Params.decode(reader, reader.uint32());
					continue;
				case 10:
					if (tag !== 80) break;
					message.feature2 = reader.int32();
					continue;
				case 13:
					if (tag !== 104) break;
					message.feature3 = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseReelSequence_Params() {
	return { number: 0 };
}
var ReelSequence_Params = {
	encode(message, writer = new BinaryWriter()) {
		if (message.number !== 0) writer.uint32(24).int32(message.number);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseReelSequence_Params();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 3:
					if (tag !== 24) break;
					message.number = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCommunityPostParams() {
	return { f1: void 0 };
}
var CommunityPostParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.f1 !== void 0) CommunityPostParams_Field1.encode(message.f1, writer.uint32(450).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCommunityPostParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 56:
					if (tag !== 450) break;
					message.f1 = CommunityPostParams_Field1.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCommunityPostParams_Field1() {
	return {
		ucid1: "",
		postId: "",
		ucid2: ""
	};
}
var CommunityPostParams_Field1 = {
	encode(message, writer = new BinaryWriter()) {
		if (message.ucid1 !== "") writer.uint32(18).string(message.ucid1);
		if (message.postId !== "") writer.uint32(26).string(message.postId);
		if (message.ucid2 !== "") writer.uint32(90).string(message.ucid2);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCommunityPostParams_Field1();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.ucid1 = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.postId = reader.string();
					continue;
				case 11:
					if (tag !== 90) break;
					message.ucid2 = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCommunityPostCommentsParamContainer() {
	return { f0: void 0 };
}
var CommunityPostCommentsParamContainer = {
	encode(message, writer = new BinaryWriter()) {
		if (message.f0 !== void 0) CommunityPostCommentsParamContainer_Container.encode(message.f0, writer.uint32(641815778).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCommunityPostCommentsParamContainer();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 80226972:
					if (tag !== 641815778) break;
					message.f0 = CommunityPostCommentsParamContainer_Container.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCommunityPostCommentsParamContainer_Container() {
	return {
		location: "",
		protoData: ""
	};
}
var CommunityPostCommentsParamContainer_Container = {
	encode(message, writer = new BinaryWriter()) {
		if (message.location !== "") writer.uint32(18).string(message.location);
		if (message.protoData !== "") writer.uint32(26).string(message.protoData);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCommunityPostCommentsParamContainer_Container();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.location = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.protoData = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCommunityPostCommentsParam() {
	return {
		title: "",
		commentDataContainer: void 0
	};
}
var CommunityPostCommentsParam = {
	encode(message, writer = new BinaryWriter()) {
		if (message.title !== "") writer.uint32(18).string(message.title);
		if (message.commentDataContainer !== void 0) CommunityPostCommentsParam_CommentDataContainer.encode(message.commentDataContainer, writer.uint32(426).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCommunityPostCommentsParam();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.title = reader.string();
					continue;
				case 53:
					if (tag !== 426) break;
					message.commentDataContainer = CommunityPostCommentsParam_CommentDataContainer.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCommunityPostCommentsParam_CommentDataContainer() {
	return {
		commentData: void 0,
		f0: 0,
		title: ""
	};
}
var CommunityPostCommentsParam_CommentDataContainer = {
	encode(message, writer = new BinaryWriter()) {
		if (message.commentData !== void 0) CommunityPostCommentsParam_CommentDataContainer_CommentData.encode(message.commentData, writer.uint32(34).fork()).join();
		if (message.f0 !== 0) writer.uint32(56).int32(message.f0);
		if (message.title !== "") writer.uint32(66).string(message.title);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCommunityPostCommentsParam_CommentDataContainer();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 4:
					if (tag !== 34) break;
					message.commentData = CommunityPostCommentsParam_CommentDataContainer_CommentData.decode(reader, reader.uint32());
					continue;
				case 7:
					if (tag !== 56) break;
					message.f0 = reader.int32();
					continue;
				case 8:
					if (tag !== 66) break;
					message.title = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseCommunityPostCommentsParam_CommentDataContainer_CommentData() {
	return {
		sortBy: 0,
		f0: 0,
		f1: 0,
		postId: "",
		channelId: ""
	};
}
var CommunityPostCommentsParam_CommentDataContainer_CommentData = {
	encode(message, writer = new BinaryWriter()) {
		if (message.sortBy !== 0) writer.uint32(48).int32(message.sortBy);
		if (message.f0 !== 0) writer.uint32(120).int32(message.f0);
		if (message.f1 !== 0) writer.uint32(200).int32(message.f1);
		if (message.postId !== "") writer.uint32(234).string(message.postId);
		if (message.channelId !== "") writer.uint32(242).string(message.channelId);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCommunityPostCommentsParam_CommentDataContainer_CommentData();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 6:
					if (tag !== 48) break;
					message.sortBy = reader.int32();
					continue;
				case 15:
					if (tag !== 120) break;
					message.f0 = reader.int32();
					continue;
				case 25:
					if (tag !== 200) break;
					message.f1 = reader.int32();
					continue;
				case 29:
					if (tag !== 234) break;
					message.postId = reader.string();
					continue;
				case 30:
					if (tag !== 242) break;
					message.channelId = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/ProtoUtils.js
function encodeVisitorData(id, timestamp) {
	const writer = VisitorData.encode({
		id,
		timestamp
	});
	return encodeURIComponent(u8ToBase64(writer.finish()).replace(/\+/g, "-").replace(/\//g, "_"));
}
function decodeVisitorData(visitor_data) {
	return VisitorData.decode(base64ToU8(decodeURIComponent(visitor_data).replace(/-/g, "+").replace(/_/g, "/")));
}
function encodeCommentActionParams(type, args = {}) {
	const data = {
		type,
		commentId: args.comment_id || " ",
		videoId: args.video_id || " ",
		channelId: " ",
		unkNum: 2
	};
	if (args.hasOwnProperty("text")) {
		if (typeof args.target_language !== "string") throw new Error("target_language must be a string");
		if (args.comment_id) delete data.unkNum;
		data.translateCommentParams = {
			params: { comment: { text: args.text } },
			commentId: args.comment_id || " ",
			targetLanguage: args.target_language
		};
	}
	const writer = PeformCommentActionParams.encode(data);
	return encodeURIComponent(u8ToBase64(writer.finish()));
}
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/javascript/helpers.js
var WALK_STOP = Symbol("WALK_STOP");
var jsBuiltIns = /* @__PURE__ */ new Set([
	"AbortController",
	"AbortSignal",
	"Array",
	"ArrayBuffer",
	"AsyncContext",
	"Atomics",
	"AudioContext",
	"BigInt",
	"BigInt64Array",
	"BigUint64Array",
	"Blob",
	"Boolean",
	"BroadcastChannel",
	"Buffer",
	"CanvasRenderingContext2D",
	"clearImmediate",
	"clearInterval",
	"clearTimeout",
	"confirm",
	"console",
	"Crypto",
	"CustomEvent",
	"DataView",
	"Date",
	"decodeURI",
	"decodeURIComponent",
	"document",
	"Element",
	"encodeURI",
	"encodeURIComponent",
	"Error",
	"escape",
	"eval",
	"Event",
	"EventTarget",
	"fetch",
	"File",
	"FileReader",
	"Float32Array",
	"Float64Array",
	"FormData",
	"function",
	"global",
	"globalThis",
	"hasOwnProperty",
	"Headers",
	"History",
	"HTMLElement",
	"HTMLCollection",
	"IDBKeyRange",
	"Infinity",
	"Int16Array",
	"Int32Array",
	"Int8Array",
	"Intl",
	"IntersectionObserver",
	"isFinite",
	"isNaN",
	"isPrototypeOf",
	"JSON",
	"location",
	"log",
	"Map",
	"Math",
	"MediaRecorder",
	"MediaSource",
	"MediaStream",
	"MemberExpression",
	"MutationObserver",
	"NaN",
	"navigator",
	"Node",
	"NodeList",
	"Number",
	"Object",
	"OfflineAudioContext",
	"parse",
	"parseFloat",
	"parseInt",
	"Performance",
	"process",
	"Promise",
	"prompt",
	"prototype",
	"Proxy",
	"ReadableStream",
	"Reflect",
	"RegExp",
	"requestAnimationFrame",
	"requestIdleCallback",
	"Request",
	"Response",
	"ResizeObserver",
	"Screen",
	"setImmediate",
	"setInterval",
	"setTimeout",
	"SharedArrayBuffer",
	"SharedWorker",
	"SourceBuffer",
	"split",
	"String",
	"stringify",
	"structuredClone",
	"SubtleCrypto",
	"Symbol",
	"TextDecoder",
	"TextEncoder",
	"this",
	"toString",
	"TransformStream",
	"Uint16Array",
	"Uint32Array",
	"Uint8Array",
	"Uint8ClampedArray",
	"undefined",
	"unescape",
	"URL",
	"URLSearchParams",
	"valueOf",
	"WeakMap",
	"WeakSet",
	"WebAssembly",
	"WebGLRenderingContext",
	"window",
	"Worker",
	"WritableStream",
	"XMLHttpRequest",
	"alert",
	"arguments",
	"atob",
	"btoa",
	"cancelAnimationFrame",
	"cancelIdleCallback",
	"queueMicrotask"
]);
/**
* Performs traversal of an ESTree AST.
* @param root - Root AST node to start the traversal from.
* @param visitor - Callbacks invoked when nodes are entered or left.
* @remarks
* - If it returns `WALK_STOP`, the entire traversal is halted.
* - Why did I not use some AST walker library instead?: They're too slow.
*/
function walkAst(root, visitor) {
	if (!root || typeof root !== "object") return;
	const stack = [{
		node: root,
		parent: null,
		exit: false
	}];
	const ancestors = [];
	const enter = typeof visitor === "function" ? visitor : visitor.enter ?? null;
	const leave = typeof visitor === "function" ? null : visitor.leave ?? null;
	let shouldStop = false;
	while (!shouldStop && stack.length > 0) {
		const { node, parent, exit } = stack.pop();
		if (exit) {
			ancestors.pop();
			if (leave && leave(node, parent, ancestors) === WALK_STOP) shouldStop = true;
			continue;
		}
		if (!node || typeof node.type !== "string") continue;
		const result = enter ? enter(node, parent, ancestors) : void 0;
		if (result === WALK_STOP) {
			shouldStop = true;
			continue;
		}
		if (result === true) continue;
		stack.push({
			node,
			parent,
			exit: true
		});
		ancestors.push(node);
		for (const key in node) {
			if (key === "loc" || key === "range" || key === "start" || key === "end") continue;
			if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
			const value = node[key];
			if (!value) continue;
			if (Array.isArray(value)) for (let i = value.length - 1; i >= 0; i--) {
				const item = value[i];
				if (item && typeof item.type === "string") stack.push({
					node: item,
					parent: node,
					exit: false
				});
			}
			else if (typeof value === "object" && typeof value.type === "string") stack.push({
				node: value,
				parent: node,
				exit: false
			});
		}
	}
}
/**
* Returns the source range of an ESTree node as a tuple of start and end positions.
* @param node - The ESTree node to extract the source range from.
* @returns A tuple `[start, end]` representing the source range, or `null` if unavailable.
*/
function getNodeSourceRange(node) {
	if (!node) return null;
	if (Array.isArray(node.range)) return node.range;
	if (typeof node.start === "number" && typeof node.end === "number") return [node.start, node.end];
	return null;
}
/**
* Extracts the source code corresponding to a given AST node.
* @param node - The AST node to extract source from.
* @param source - The original source code.
* @returns The source code corresponding to the node, or null if not available.
*/
function extractNodeSource(node, source) {
	const range = getNodeSourceRange(node);
	return range ? source.slice(range[0], range[1]) : null;
}
/**
* Converts a member expression into its dot/bracket string form.
* @param memberExpression - Member expression node to stringify.
* @param source - Original source code for range lookups.
*/
function memberToString(memberExpression, source) {
	if (memberExpression.type !== "MemberExpression") return null;
	const segments = [];
	let cur = memberExpression;
	while (cur && cur.type === "MemberExpression") {
		const member = cur;
		const prop = member.property;
		if (!prop) return null;
		if (member.computed) {
			const propSource = extractNodeSource(prop, source);
			if (!propSource) return null;
			segments.unshift(`[${propSource.trim()}]`);
		} else {
			if (prop.type !== "Identifier") return null;
			segments.unshift(`.${prop.name}`);
		}
		cur = member.object;
	}
	let base = null;
	if (cur?.type === "Identifier") base = cur.name;
	else if (cur?.type === "ThisExpression") base = "this";
	return base ? base + segments.join("") : null;
}
/**
* Retrieves the base identifier for a member expression chain.
* @param memberExpression - Member expression whose root should be resolved.
* @param source - Original source code for range lookups.
*/
function memberBaseName(memberExpression, source) {
	let target = memberExpression.object;
	while (target && target.type === "MemberExpression") {
		const parentName = memberToString(target, source);
		if (parentName) return parentName;
		target = target.object;
	}
	if (target?.type === "Identifier") return target.name;
	if (target?.type === "ThisExpression") return "this";
	return null;
}
/**
* Analyzes an AST node to determine if it's a function call or a function
* declaration. Based on that, it then creates a new JavaScript function as
* a string. This new function acts as a wrapper, taking a single 'input'
* argument and forwarding it to the original function call.
*
* Currently can handle:
* - `CallExpression`: Creates a wrapper that invokes the function being called in the expression.
* - `VariableDeclarator` with a `FunctionExpression`: Creates a wrapper that calls the declared function.
*
* @param analyzer - The `JSAnalyzer` instance, used to resolve context like declared variables.
* @param name - The name for the new wrapper function to be created.
* @param node - The ESTree node.
* @todo Look for edge cases.
*/
function createWrapperFunction(analyzer, name, node) {
	if (node.type === "CallExpression" && node.callee.type === "Identifier" && analyzer.declaredVariables.has(node.callee.name)) return generateWrapper(name, node.callee.name, parseFunctionArguments(analyzer, node.arguments));
	else if (node.type === "VariableDeclarator" && node.init?.type === "FunctionExpression" && node.id.type === "Identifier") return generateWrapper(name, node.id.name, parseFunctionArguments(analyzer, node.init.params));
	else if (node.type === "NewExpression" && node.callee.type === "MemberExpression" && node.callee.object.type === "Identifier") {
		const targetFunction = memberToString(node.callee, analyzer.getSource());
		if (!targetFunction) return void 0;
		return generateWrapper(name, targetFunction, parseFunctionArguments(analyzer, node.arguments), true);
	}
}
/**
* Generates a wrapper function string.
* @param functionName - The name of the wrapper function.
* @param targetFunction - The name of the target function to call.
* @param args - The arguments to pass to the target function.
*/
function generateWrapper(functionName, targetFunction, args, useNew = false) {
	return [
		`  function ${functionName}(${args.join(", ")}) {`,
		`    return ${useNew ? "new " : ""}${targetFunction}(${args.join(", ")});`,
		`  }`
	].join("\n");
}
/**
* Parses function arguments to create a string representation suitable for
* use in our custom function calls.
* @param analyzer - The JsAnalyzer instance to use.
* @param args - The function arguments to parse.
*/
function parseFunctionArguments(analyzer, args) {
	const params = [];
	for (const arg of args) if (arg.type === "Identifier" && analyzer.declaredVariables.has(arg.name)) params.push(arg.name);
	else if (arg.type === "Literal" && (typeof arg.value === "string" || typeof arg.value === "number")) params.push(JSON.stringify(arg.value));
	else if (arg.type === "UnaryExpression") {
		const argSource = extractNodeSource(arg, analyzer.getSource());
		if (argSource) params.push(argSource.trim());
	} else if (arg.type === "AssignmentPattern" && arg.left.type === "Identifier") params.push(arg.left.name);
	else if (arg.type === "Identifier") params.push(arg.name);
	else if (!params.includes("input")) params.push("input");
	return params;
}
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/javascript/matchers.js
function nsigMatcher(node) {
	if (node.type !== "VariableDeclarator") return false;
	const init = node.init;
	if (!init || init.type !== "FunctionExpression") return false;
	if (init.params.length < 3) return false;
	const [url, sigName, sigValue] = init.params;
	if (url.type !== "Identifier" || sigName.type !== "AssignmentPattern" || sigValue.type !== "AssignmentPattern") return false;
	const blockStatementBody = init.body?.body || [];
	let hasUrlCtor = false;
	let hasSetAlr = false;
	for (const statement of blockStatementBody) {
		if (statement.type !== "ExpressionStatement") continue;
		const expr = statement.expression;
		if (expr.type === "AssignmentExpression" && expr.operator === "=" && expr.left.type === "Identifier" && expr.left.name === url.name) {
			const right = expr.right;
			if (right.type === "NewExpression" && right.callee.type === "MemberExpression") hasUrlCtor = true;
		}
		if (expr.type === "CallExpression" && expr.callee.type === "MemberExpression") {
			const args = expr.arguments;
			if (args.length === 2 && args[0].type === "Literal" && args[0].value === "alr" && args[1].type === "Literal" && args[1].value === "yes") hasSetAlr = true;
		}
	}
	if (!hasUrlCtor || !hasSetAlr) return false;
	return node;
}
function timestampMatcher(node) {
	if (node.type !== "VariableDeclarator" || node.init?.type !== "FunctionExpression") return false;
	const funcBody = node.init.body;
	if (!funcBody) return false;
	let foundObject = null;
	walkAst(funcBody, (innerNode) => {
		if (innerNode.type === "ObjectExpression") {
			for (const prop of innerNode.properties) if (prop.type === "Property" && prop.key.type === "Identifier" && prop.key.name === "signatureTimestamp") {
				foundObject = prop;
				return WALK_STOP;
			}
		}
	});
	return foundObject || false;
}
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/javascript/JsAnalyzer.js
/**
* Performs dependency-aware extraction of variables inside an IIFE.
*/
var JsAnalyzer = class {
	source;
	programAst;
	hasExtractions;
	extractionStates;
	dependentsTracker = /* @__PURE__ */ new Map();
	pendingPrototypeAliasBinding = null;
	iifeParamName = null;
	declaredVariables = /* @__PURE__ */ new Map();
	/**
	* Creates a new instance over the provided source.
	* @param code JavaScript source to parse and inspect.
	* @param options Optional traversal settings.
	*/
	constructor(code, options = {}) {
		this.source = code;
		const extractionConfigs = options.extractions ? Array.isArray(options.extractions) ? options.extractions : [options.extractions] : [];
		this.extractionStates = extractionConfigs.map((config) => ({
			config: {
				collectDependencies: true,
				stopWhenReady: true,
				...config
			},
			dependencies: /* @__PURE__ */ new Set(),
			dependents: /* @__PURE__ */ new Set(),
			ready: false
		}));
		this.hasExtractions = this.extractionStates.length > 0;
		this.programAst = parseScript(code, {
			ranges: true,
			loc: false,
			module: false
		});
		this.analyzeAst();
	}
	/**
	* Walks the AST to collect declarations and resolve initial targets.
	*/
	analyzeAst() {
		let iifeBody;
		for (const statement of this.programAst.body) if (statement.type === "ExpressionStatement" && statement.expression.type === "CallExpression") {
			const callExpr = statement.expression;
			if (callExpr.callee.type === "FunctionExpression") {
				const funcExpr = callExpr.callee;
				const firstParam = funcExpr.params.length > 0 ? funcExpr.params[0] : null;
				if (!this.iifeParamName && firstParam?.type === "Identifier") this.iifeParamName = firstParam.name;
				if (funcExpr.body?.type === "BlockStatement") {
					iifeBody = funcExpr.body;
					break;
				}
			}
		}
		if (!iifeBody) return;
		for (const currentNode of iifeBody.body) switch (currentNode.type) {
			case "ExpressionStatement": {
				const assignment = currentNode.expression;
				if (assignment.type !== "AssignmentExpression") continue;
				const left = assignment.left;
				const right = assignment.right;
				if (right.type === "MemberExpression" && !right.computed && right.property.type === "Identifier" && right.property.name === "prototype") {
					const prototypeSourceExpr = memberToString(right, this.source);
					const aliasTargetExpr = left.type === "Identifier" ? left.name : memberToString(left, this.source);
					if (prototypeSourceExpr) {
						const prototypeOwnerMeta = this.declaredVariables.get(prototypeSourceExpr.replace(".prototype", ""));
						if (aliasTargetExpr && prototypeOwnerMeta) {
							const aliasedPrototypeMembers = /* @__PURE__ */ new Set();
							const aliasExpr = `${aliasTargetExpr}.`;
							this.pendingPrototypeAliasBinding = [aliasExpr, prototypeOwnerMeta];
							prototypeOwnerMeta.prototypeAliases.set(aliasExpr, aliasedPrototypeMembers);
						}
					}
				}
				if (left.type === "Identifier") {
					const existingVariable = this.declaredVariables.get(left.name);
					if (!existingVariable) continue;
					existingVariable.node.init = right;
					if (this.needsDependencyAnalysis(right)) existingVariable.dependencies = this.findDependencies(assignment.right, left.name);
					if (this.onMatch(existingVariable.node, existingVariable)) return;
				} else if (assignment.left.type === "MemberExpression") {
					const memberName = memberToString(assignment.left, this.source);
					const activeAliasExpr = this.pendingPrototypeAliasBinding?.[0];
					if (activeAliasExpr && (memberName?.includes(activeAliasExpr) || memberName === activeAliasExpr.slice(0, -1))) {
						const aliasOwnerMeta = this.declaredVariables.get(this.pendingPrototypeAliasBinding?.[1].name || "");
						if (aliasOwnerMeta) {
							const existingAliasedMembers = aliasOwnerMeta.prototypeAliases.get(activeAliasExpr);
							const aliasedMemberMeta = {
								name: memberName,
								node: currentNode,
								dependents: this.dependentsTracker.get(memberName) || /* @__PURE__ */ new Set(),
								predeclared: false,
								prototypeAliases: /* @__PURE__ */ new Map(),
								dependencies: this.findDependencies(right, memberName)
							};
							if (existingAliasedMembers) existingAliasedMembers.add(aliasedMemberMeta);
							else aliasOwnerMeta.prototypeAliases.set(activeAliasExpr, /* @__PURE__ */ new Set([aliasedMemberMeta]));
						}
					} else this.pendingPrototypeAliasBinding = null;
					if (!memberName || this.declaredVariables.has(memberName)) continue;
					const metadata = {
						name: memberName,
						node: currentNode,
						dependents: this.dependentsTracker.get(memberName) || /* @__PURE__ */ new Set(),
						predeclared: false,
						prototypeAliases: /* @__PURE__ */ new Map(),
						dependencies: this.findDependencies(right, memberName)
					};
					const baseName = memberBaseName(assignment.left, this.source);
					if (baseName && baseName !== memberName && !baseName.startsWith("this.")) metadata.dependencies.add(baseName.replace(".prototype", ""));
					if (this.dependentsTracker.has(memberName)) this.dependentsTracker.delete(memberName);
					this.declaredVariables.set(memberName, metadata);
					if (this.onMatch(currentNode, metadata)) return;
				}
				break;
			}
			case "VariableDeclaration":
				this.pendingPrototypeAliasBinding = null;
				for (const declaration of currentNode.declarations) {
					if (declaration.id.type !== "Identifier") continue;
					const metadata = {
						name: declaration.id.name,
						node: declaration,
						dependents: this.dependentsTracker.get(declaration.id.name) || /* @__PURE__ */ new Set(),
						prototypeAliases: /* @__PURE__ */ new Map(),
						dependencies: /* @__PURE__ */ new Set(),
						predeclared: false
					};
					const init = declaration.init;
					if (!init && currentNode.kind === "var") metadata.predeclared = true;
					else if (init && this.needsDependencyAnalysis(init)) metadata.dependencies = this.findDependencies(init, metadata.name);
					if (this.dependentsTracker.has(metadata.name)) this.dependentsTracker.delete(metadata.name);
					this.declaredVariables.set(metadata.name, metadata);
					if (this.onMatch(declaration, metadata)) return;
				}
		}
	}
	/**
	* Quick check if node type requires dependency analysis
	*/
	needsDependencyAnalysis(node) {
		if (!node) return false;
		switch (node.type) {
			case "FunctionExpression":
			case "ArrowFunctionExpression":
			case "ArrayExpression":
			case "LogicalExpression":
			case "CallExpression":
			case "NewExpression":
			case "MemberExpression":
			case "BinaryExpression":
			case "ConditionalExpression":
			case "ObjectExpression":
			case "SequenceExpression":
			case "ClassExpression":
			case "Identifier": return true;
			default: return false;
		}
	}
	/**
	* Records a match, attaches metadata, and updates readiness state.
	* @returns True when traversal can stop as a result of the match.
	*/
	onMatch(node, metadata) {
		if (!this.hasExtractions) return false;
		let matched = false;
		let result = false;
		for (const state of this.extractionStates) if (!state.node) {
			if (node.type === "VariableDeclarator" && !node.init) continue;
			result = state.config.match(node);
			if (!result) continue;
			state.node = node;
			matched = true;
			if (metadata) {
				state.metadata = metadata;
				state.dependents = metadata.dependents;
				state.dependencies = metadata.dependencies;
				if (typeof result !== "boolean") state.matchContext = result;
			}
			this.refreshExtractionState(state);
		} else if (state.node !== node) {
			this.refreshExtractionState(state);
			if (this.shouldStopTraversal()) return true;
		}
		if (!matched) return false;
		return this.shouldStopTraversal();
	}
	/**
	* Refreshes the readiness state of an extraction target based on its dependencies
	* and/or configuration.
	* @param state - State to refresh.
	*/
	refreshExtractionState(state) {
		if (!state.node) {
			state.ready = false;
			return;
		}
		if (state.config.collectDependencies === false) {
			state.ready = true;
			return;
		}
		if (!state.metadata) {
			state.ready = false;
			return;
		}
		state.ready = this.areDependenciesResolved(state.dependencies);
	}
	/**
	* Determines whether traversal should stop based on extraction states and configuration.
	*/
	shouldStopTraversal() {
		if (!this.hasExtractions) return false;
		let hasStoppingTarget = false;
		for (const state of this.extractionStates) {
			if (state.config.stopWhenReady === false) continue;
			hasStoppingTarget = true;
			if (!state.node) return false;
			if (!state.ready) return false;
		}
		return hasStoppingTarget;
	}
	/**
	* Checks if every dependency resolves to a declaration or built-in symbol.
	* @param dependencies - Dependencies to validate.
	* @param seen - Tracks recursively visited identifiers.
	*/
	areDependenciesResolved(dependencies, seen = /* @__PURE__ */ new Set()) {
		if (!dependencies || dependencies.size === 0) return true;
		for (const dependency of dependencies) {
			if (!dependency) continue;
			if (jsBuiltIns.has(dependency)) continue;
			if (dependency === this.iifeParamName) continue;
			if (seen.has(dependency)) continue;
			const depMeta = this.declaredVariables.get(dependency);
			if (!depMeta) return false;
			seen.add(dependency);
			if (!this.areDependenciesResolved(depMeta.dependencies, seen)) return false;
		}
		return true;
	}
	/**
	* Collects free identifier dependencies reachable from the provided AST node.
	* @param rootNode - AST node to search for dependencies.
	* @param identifierName - Name of the identifier represented by `rootNode`, used for tracking dependents.
	*/
	findDependencies(rootNode, identifierName) {
		const dependencies = /* @__PURE__ */ new Set();
		if (!rootNode) return dependencies;
		const scopeStack = [{
			names: /* @__PURE__ */ new Set(),
			type: "block"
		}];
		const currentScope = () => scopeStack[scopeStack.length - 1];
		const isInScope = (name) => {
			for (let i = scopeStack.length - 1; i >= 0; i--) if (scopeStack[i].names.has(name)) return true;
			return false;
		};
		const rootIdentifierName = "id" in rootNode && rootNode?.id?.type === "Identifier" ? rootNode.id.name : void 0;
		const collectBindingIdentifiers = (pattern, target) => {
			if (!pattern) return;
			switch (pattern.type) {
				case "Identifier":
					target.add(pattern.name);
					break;
				case "ObjectPattern":
					for (const prop of pattern.properties) if (prop.type === "RestElement") collectBindingIdentifiers(prop.argument, target);
					else if (prop.type === "Property") collectBindingIdentifiers(prop.value, target);
					break;
				case "ArrayPattern":
					for (const el of pattern.elements) if (el) collectBindingIdentifiers(el, target);
					break;
				case "RestElement":
					collectBindingIdentifiers(pattern.argument, target);
					break;
				case "AssignmentPattern": collectBindingIdentifiers(pattern.left, target);
			}
		};
		const collectParams = (fnNode, target) => {
			if (!fnNode?.params) return;
			for (const p of fnNode.params) collectBindingIdentifiers(p, target);
		};
		walkAst(rootNode, {
			enter: (n, parent) => {
				switch (n.type) {
					case "FunctionDeclaration":
					case "FunctionExpression":
					case "ArrowFunctionExpression": {
						const isDecl = n.type === "FunctionDeclaration";
						const fnName = "id" in n ? n.id?.name : void 0;
						if (isDecl && fnName) currentScope().names.add(fnName);
						const fnScope = {
							names: /* @__PURE__ */ new Set(),
							type: "function"
						};
						if (n.type === "FunctionExpression" && fnName) fnScope.names.add(fnName);
						collectParams(n, fnScope.names);
						scopeStack.push(fnScope);
						break;
					}
					case "BlockStatement":
						scopeStack.push({
							names: /* @__PURE__ */ new Set(),
							type: "block"
						});
						break;
					case "CatchClause": {
						const s = /* @__PURE__ */ new Set();
						if (n.param) collectBindingIdentifiers(n.param, s);
						scopeStack.push({
							names: s,
							type: "block"
						});
						break;
					}
					case "VariableDeclaration": {
						const targetScope = n.kind === "var" ? scopeStack.findLast((s) => s.type === "function") ?? currentScope() : currentScope();
						for (const d of n.declarations) collectBindingIdentifiers(d.id, targetScope.names);
						break;
					}
					case "ClassDeclaration":
						if (n.id?.name) currentScope().names.add(n.id.name);
						break;
					case "LabeledStatement":
						if (n.label?.type === "Identifier") currentScope().names.add(n.label.name);
						break;
					case "Identifier": {
						if (n.name === rootIdentifierName) return;
						if (parent?.type === "Property" && parent.key === n && !parent.computed) return;
						if (parent?.type === "MethodDefinition" && parent.key === n && !parent.computed) return;
						if (parent?.type === "MemberExpression" && parent.property === n && !parent.computed) {
							if (parent.object.type === "ThisExpression") return;
							const full = memberToString(parent, this.source);
							if (!full) return;
							const declaredVariable = this.declaredVariables.get(full);
							if (declaredVariable) {
								declaredVariable.dependents.add(identifierName);
								dependencies.add(full);
							} else if (parent.object.type === "Identifier") {
								const baseName = parent.object.name;
								const declaredBaseVariable = this.declaredVariables.get(baseName);
								if ((declaredBaseVariable || baseName === this.iifeParamName) && !isInScope(baseName) && !jsBuiltIns.has(baseName)) {
									declaredBaseVariable?.dependents.add(identifierName);
									dependencies.add(full);
									const existingTracker = this.dependentsTracker.get(full);
									if (existingTracker) existingTracker.add(identifierName);
									else this.dependentsTracker.set(full, /* @__PURE__ */ new Set([identifierName]));
								}
							}
							return;
						}
						if (parent?.type === "MetaProperty") return;
						if (isInScope(n.name) || jsBuiltIns.has(n.name)) return;
						dependencies.add(n.name);
						const declaredVariable = this.declaredVariables.get(n.name);
						if (declaredVariable) declaredVariable.dependents.add(identifierName);
						else {
							const existing = this.dependentsTracker.get(n.name);
							if (existing) existing.add(identifierName);
							else this.dependentsTracker.set(n.name, /* @__PURE__ */ new Set([identifierName]));
						}
						break;
					}
					case "ForStatement":
					case "ForInStatement":
					case "ForOfStatement": scopeStack.push({
						names: /* @__PURE__ */ new Set(),
						type: "block"
					});
				}
			},
			leave: (n) => {
				switch (n.type) {
					case "FunctionDeclaration":
					case "FunctionExpression":
					case "ArrowFunctionExpression":
					case "BlockStatement":
					case "CatchClause":
					case "ForStatement":
					case "ForInStatement":
					case "ForOfStatement": if (scopeStack.length > 1) scopeStack.pop();
				}
			}
		});
		return dependencies;
	}
	/**
	* Returns the current set of matched extractions.
	*/
	getExtractedMatches() {
		return this.extractionStates.filter((state) => !!state.node);
	}
	/**
	* Returns the raw, original source.
	*/
	getSource() {
		return this.source;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/javascript/JsExtractor.js
/**
* Class responsible for extracting and emitting JavaScript code snippets
* based on analysis results from a `JsAnalyzer` instance.
*/
var JsExtractor = class {
	analyzer;
	constructor(analyzer) {
		this.analyzer = analyzer;
	}
	/**
	* Checks if all provided arguments are safe initializers.
	* @param args - The arguments to check.
	* @param mode - The side effect mode to use ('strict' or 'loose').
	*/
	areSafeArgs(args, mode = "strict") {
		return (args ?? []).every((arg) => {
			if (!arg) return false;
			if (arg.type === "SpreadElement") return false;
			return this.isSafeInitializer(arg, mode);
		});
	}
	/**
	* Determines if a given AST node is a safe initializer without side effects.
	* @param node - The AST node to evaluate.
	* @param mode - The side effect mode to use ('strict' or 'loose').
	*/
	isSafeInitializer(node, mode = "strict") {
		if (!node) return true;
		switch (node.type) {
			case "ClassExpression": return true;
			case "Literal": {
				const literal = node;
				return typeof literal.value === "string" || typeof literal.value === "number" || typeof literal.value === "boolean" || literal.value === null || Boolean(literal.regex);
			}
			case "TemplateLiteral": return node.expressions.every((expr) => this.isSafeInitializer(expr, mode));
			case "ArrayExpression": return node.elements.every((elem) => {
				if (!elem) return true;
				if (elem.type === "SpreadElement") return false;
				return this.isSafeInitializer(elem, mode);
			});
			case "ObjectExpression": return node.properties.every((prop) => {
				if (prop.type !== "Property") return false;
				if (prop.computed) return false;
				if (prop.kind !== "init") return false;
				const value = prop.value;
				if (!value) return false;
				return value.type === "FunctionExpression" || value.type === "ArrowFunctionExpression" || value.type === "Literal";
			});
			case "CallExpression":
				if (node.callee.type === "Identifier" && jsBuiltIns.has(node.callee.name)) return this.areSafeArgs(node.arguments, mode);
				else if (node.callee.type === "MemberExpression") {
					if (!this.isSafeInitializer(node.callee.object, mode)) return false;
					if (mode === "strict") {
						const propertyName = node.callee.property.type === "Identifier" ? node.callee.property.name : "";
						if (node.callee.computed || !jsBuiltIns.has(propertyName)) return false;
					}
					return this.areSafeArgs(node.arguments, mode);
				}
				return false;
			case "NewExpression":
				if (node.callee.type === "Identifier") {
					if (jsBuiltIns.has(node.callee.name)) return this.areSafeArgs(node.arguments, mode);
					if (mode === "loose") return this.areSafeArgs(node.arguments, mode);
				}
				return false;
			case "UnaryExpression": return this.isSafeInitializer(node.argument, mode);
			case "FunctionExpression":
			case "ArrowFunctionExpression":
			case "Identifier": return true;
			case "MemberExpression":
				if (mode === "loose") {
					if (node.computed && !this.isSafeInitializer(node.property, mode)) return false;
					return this.isSafeInitializer(node.object, mode);
				}
				if (!node.computed && node.property.type === "Identifier" && node.property.name === "prototype") return true;
				return false;
			case "LogicalExpression":
			case "BinaryExpression": return this.isSafeInitializer(node.left, mode) && this.isSafeInitializer(node.right, mode);
			case "ConditionalExpression":
				if (mode === "loose") return this.isSafeInitializer(node.test, mode) && this.isSafeInitializer(node.consequent, mode) && this.isSafeInitializer(node.alternate, mode);
				return false;
			case "SequenceExpression":
				if (mode === "loose") return node.expressions.every((expr) => this.isSafeInitializer(expr, mode));
				return false;
			case "AssignmentExpression":
				if (node.left.type === "MemberExpression" && !node.left.computed) {
					const object = node.left.object;
					if (object.type === "Identifier" && this.analyzer.declaredVariables.get(object.name)?.node.init !== void 0) return this.isSafeInitializer(node.right, mode);
				} else if (node.left.type === "Identifier") {
					if (this.analyzer.declaredVariables.has(node.left.name)) return this.isSafeInitializer(node.right, mode);
				}
				return false;
			default: return false;
		}
	}
	/**
	* Provides a fallback initializer string based on the type of the initializer node.
	* @TODO: Check more cases.
	* @param init - The initializer expression to evaluate.
	*/
	getInitializerFallback(init) {
		switch (init?.type) {
			case "ObjectExpression":
			case "NewExpression":
			case "MemberExpression":
			case "LogicalExpression": return "{}";
			case "ArrayExpression": return "[]";
			default: return "undefined";
		}
	}
	/**
	* Renders an AST node to JavaScript source code, with special handling for variable declarators.
	* @param node - The ESTree node to render.
	* @param preDeclared - Whether the variable has been previously declared.
	* @param options - Configuration options for the emitter.
	*/
	renderNode(node, preDeclared, options = {}) {
		const source = this.analyzer.getSource();
		const declaredVariables = this.analyzer.declaredVariables;
		const sideEffectPolicy = options.disallowSideEffectInitializers;
		const sideEffectMode = typeof sideEffectPolicy === "object" && sideEffectPolicy !== null ? sideEffectPolicy.mode ?? "strict" : "strict";
		const canDisallow = Boolean(sideEffectPolicy);
		const assignmentTarget = node.type === "AssignmentExpression" ? node : node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression" ? node.expression : null;
		const init = assignmentTarget && assignmentTarget.operator === "=" ? assignmentTarget.right : node.type === "VariableDeclarator" ? node.init : null;
		const forceRemove = canDisallow && init && !this.isSafeInitializer(init, sideEffectMode);
		const initializerFallback = this.getInitializerFallback(init);
		let initSource = initializerFallback;
		if (!forceRemove && init) {
			if (!preDeclared && init.type === "Identifier" && !declaredVariables.has(init.name)) initSource = initializerFallback;
			else {
				const left = assignmentTarget?.left;
				if (!(init?.type === "MemberExpression" && !init.computed && init.property.type === "Identifier" && init.property.name === "prototype") && left?.type === "MemberExpression" && init) {
					if (canDisallow && left.object.type === "Identifier" && init.type !== "FunctionExpression" && init.type !== "ArrowFunctionExpression" && init.type !== "LogicalExpression" && init.type !== "ClassExpression") return `  // Skipped ${memberToString(left, source)} assignment.`;
				}
				initSource = extractNodeSource(init, source)?.trim().replace(/;\s*$/, "") || "undefined // [JsExtractor] Failed to extract initializer source.";
			}
		}
		if (!forceRemove && init && init.type === "SequenceExpression" && !initSource.startsWith("(")) initSource = `(${initSource})`;
		const assignmentExpression = `${node.type === "VariableDeclarator" && node.id.type === "Identifier" ? node.id.name : assignmentTarget && assignmentTarget.left.type === "Identifier" ? assignmentTarget.left.name : assignmentTarget?.type === "AssignmentExpression" ? memberToString(assignmentTarget.left, source)?.trim() : "unknown"} = ${initSource};`;
		if (node.type === "VariableDeclarator" && node.init && !preDeclared) return `  var ${assignmentExpression}`;
		return `  ${assignmentExpression}`;
	}
	/**
	* Processes extracted matches from the analyzer, handles dependencies, predeclares
	* variables as needed, and generates an IIFE-wrapped output string containing the
	* code snippets and exported variables.
	* @param config - Configuration options for the emitter.
	*/
	buildScript(config) {
		const { maxDepth = Infinity, forceVarPredeclaration = false, exportRawValues = false, rawValueOnly: skipEmitFor = [] } = config;
		const extractions = this.analyzer.getExtractedMatches();
		const seen = new Set(extractions.map((e) => e.metadata?.name || ""));
		const snippets = [];
		const predeclaredVarSet = /* @__PURE__ */ new Set();
		const exported = /* @__PURE__ */ new Map();
		const exportedRawValues = {};
		function registerPredeclaredVar(name) {
			if (!name || name.includes(".")) return;
			predeclaredVarSet.add(name);
		}
		const visit = (metadata, depth = 0, whitelistedDep) => {
			if (!metadata || depth > maxDepth) return;
			for (const dependency of metadata.dependencies) {
				if (whitelistedDep && whitelistedDep !== dependency) {
					if (!seen.has(whitelistedDep)) continue;
					whitelistedDep = void 0;
				}
				if (seen.has(dependency)) continue;
				seen.add(dependency);
				const dependencyMetadata = this.analyzer.declaredVariables.get(dependency);
				if (!dependencyMetadata) continue;
				const shouldPredeclare = forceVarPredeclaration || dependencyMetadata.predeclared;
				if (shouldPredeclare) registerPredeclaredVar(dependency);
				visit(dependencyMetadata, depth + 1, whitelistedDep);
				snippets.push(this.renderNode(dependencyMetadata.node, shouldPredeclare, config));
				if (dependencyMetadata.prototypeAliases.size > 0) for (const [, aliasMembers] of dependencyMetadata.prototypeAliases) for (const member of aliasMembers) {
					visit(member, depth);
					snippets.push(this.renderNode(member.node, shouldPredeclare, config));
				}
			}
		};
		for (const extraction of extractions) {
			const fname = extraction.config.friendlyName;
			const shouldSkip = fname && skipEmitFor.includes(fname);
			if (extraction.metadata) {
				if (!shouldSkip) snippets.push(`  //#region --- start [${fname || "Unknown"}] ---`);
				const shouldPredeclare = (forceVarPredeclaration || extraction.metadata.predeclared) && !shouldSkip;
				const onlyProcessMatchContext = extraction.config.onlyProcessMatchContext;
				if (shouldPredeclare) registerPredeclaredVar(extraction.metadata.name);
				if (extraction.config.collectDependencies && !shouldSkip) {
					let whitelistedDep;
					const matchContextNode = extraction.matchContext;
					if (matchContextNode?.type === "NewExpression" && onlyProcessMatchContext) {
						if (matchContextNode.callee.type === "Identifier") whitelistedDep = matchContextNode.callee.name;
						else if (matchContextNode.callee.type === "MemberExpression") whitelistedDep = memberToString(matchContextNode.callee, this.analyzer.getSource()) || void 0;
					}
					visit(extraction.metadata, void 0, whitelistedDep);
				}
				if (extraction.matchContext && fname) {
					exported.set(fname, extraction.matchContext);
					if (exportRawValues) {
						const ctx = extraction.matchContext;
						const src = this.analyzer.getSource();
						let rawValue = null;
						if (ctx.type === "Property") rawValue = extractNodeSource(ctx.value, src);
						else if (ctx.type === "Identifier") rawValue = ctx.name;
						else rawValue = extractNodeSource(ctx, src);
						exportedRawValues[fname] = rawValue;
					}
				}
				if (!shouldSkip) {
					if (!onlyProcessMatchContext) snippets.push(this.renderNode(extraction.metadata.node, shouldPredeclare, config));
					snippets.push(`  //#endregion --- end [${fname || "Unknown"}] ---\n`);
				}
			}
		}
		const output = [];
		output.push("const __jsExtractorGlobal = typeof globalThis !== 'undefined' ? globalThis :");
		output.push(`  typeof self !== 'undefined' ? self :`);
		output.push(`  typeof window !== 'undefined' ? window :`);
		output.push(`  typeof global !== 'undefined' ? global : {};\n`);
		output.push(`const exportedVars = (function(${this.analyzer.iifeParamName}) {`);
		output.push(`  const window = typeof __jsExtractorGlobal.window !== 'undefined' ? __jsExtractorGlobal.window : Object.create(null);`);
		output.push(`  const document = typeof __jsExtractorGlobal.document !== 'undefined' ? __jsExtractorGlobal.document : {};`);
		output.push(`  const self = typeof __jsExtractorGlobal.self !== 'undefined' ? __jsExtractorGlobal.self : window;\n`);
		if (predeclaredVarSet.size > 0) output.push(`  var ${Array.from(predeclaredVarSet).join(", ")};\n`);
		output.push(snippets.join("\n"));
		const exportedVars = [];
		for (const [friendlyName, node] of exported) {
			let currentFunctionNode = null;
			if (node.type === "Identifier") {
				const decl = this.analyzer.declaredVariables.get(node.name);
				if (decl?.node?.type === "VariableDeclarator" && decl.node.init?.type === "FunctionExpression") currentFunctionNode = decl.node;
			} else if (node.type === "CallExpression" || node.type === "NewExpression" || node.type === "VariableDeclarator") currentFunctionNode = node;
			if (currentFunctionNode) {
				const wrapper = createWrapperFunction(this.analyzer, friendlyName, currentFunctionNode);
				if (wrapper) {
					output.push(`${wrapper}\n`);
					exportedVars.push(friendlyName);
				}
			}
		}
		if (exportRawValues) {
			const rawJsonLines = JSON.stringify(exportedRawValues, null, 2).split("\n");
			const formattedRawJson = `${rawJsonLines[0]}\n${rawJsonLines.slice(1).map((line) => "  " + line).join("\n")}`;
			output.push(`  const rawValues = ${formattedRawJson};\n`);
			exportedVars.push("rawValues");
		}
		output.push(`  return { ${exportedVars.join(", ")} };`);
		output.push("})({});\n");
		return {
			output: output.join("\n"),
			exported: exportedVars,
			exportedRawValues: exportRawValues ? exportedRawValues : void 0
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/OpenPopupAction.js
var OpenPopupAction = class extends YTNode {
	static type = "OpenPopupAction";
	popup;
	popup_type;
	constructor(data) {
		super();
		this.popup = parseItem(data.popup);
		this.popup_type = data.popupType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Button.js
var Button = class extends YTNode {
	static type = "Button";
	text;
	label;
	tooltip;
	style;
	size;
	icon_type;
	is_disabled;
	target_id;
	endpoint;
	accessibility;
	constructor(data) {
		super();
		if (Reflect.has(data, "text")) this.text = new Text$1(data.text).toString();
		if (Reflect.has(data, "accessibility") && Reflect.has(data.accessibility, "label")) this.label = data.accessibility.label;
		if ("accessibilityData" in data && "accessibilityData" in data.accessibilityData) this.accessibility = { accessibility_data: new AccessibilityData(data.accessibilityData.accessibilityData) };
		if (Reflect.has(data, "tooltip")) this.tooltip = data.tooltip;
		if (Reflect.has(data, "style")) this.style = data.style;
		if (Reflect.has(data, "size")) this.size = data.size;
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
		if (Reflect.has(data, "isDisabled")) this.is_disabled = data.isDisabled;
		if (Reflect.has(data, "targetId")) this.target_id = data.targetId;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.serviceEndpoint || data.command);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DropdownItem.js
var DropdownItem = class extends YTNode {
	static type = "DropdownItem";
	label;
	selected;
	value;
	icon_type;
	description;
	endpoint;
	constructor(data) {
		super();
		this.label = new Text$1(data.label).toString();
		this.selected = !!data.isSelected;
		if (Reflect.has(data, "int32Value")) this.value = data.int32Value;
		else if (data.stringValue) this.value = data.stringValue;
		if (Reflect.has(data, "onSelectCommand")) this.endpoint = new NavigationEndpoint(data.onSelectCommand);
		if (Reflect.has(data, "icon")) this.icon_type = data.icon?.iconType;
		if (Reflect.has(data, "descriptionText")) this.description = new Text$1(data.descriptionText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Dropdown.js
var Dropdown = class extends YTNode {
	static type = "Dropdown";
	label;
	entries;
	constructor(data) {
		super();
		this.label = data.label || "";
		this.entries = parseArray(data.entries, DropdownItem);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CreatePlaylistDialog.js
var CreatePlaylistDialog = class extends YTNode {
	static type = "CreatePlaylistDialog";
	title;
	title_placeholder;
	privacy_option;
	cancel_button;
	create_button;
	constructor(data) {
		super();
		this.title = new Text$1(data.dialogTitle).toString();
		this.title_placeholder = data.titlePlaceholder || "";
		this.privacy_option = parseItem(data.privacyOption, Dropdown);
		this.create_button = parseItem(data.cancelButton, Button);
		this.cancel_button = parseItem(data.cancelButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/commands/CommandExecutorCommand.js
var CommandExecutorCommand = class extends YTNode {
	static type = "CommandExecutorCommand";
	commands;
	constructor(data) {
		super();
		this.commands = parseCommands(data.commands);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/NavigationEndpoint.js
var NavigationEndpoint = class NavigationEndpoint extends YTNode {
	static type = "NavigationEndpoint";
	name;
	payload;
	dialog;
	modal;
	open_popup;
	next_endpoint;
	metadata;
	command;
	commands;
	constructor(data) {
		super();
		if (data) {
			if (data.serialCommand || data.parallelCommand) {
				const raw_command = data.serialCommand || data.parallelCommand;
				this.commands = raw_command.commands.map((command) => new NavigationEndpoint(command));
			}
			if (data.innertubeCommand || data.command || data.performOnceCommand) data = data.innertubeCommand || data.command || data.performOnceCommand;
		}
		this.command = parseCommand(data);
		if (Reflect.has(data || {}, "openPopupAction")) this.open_popup = new OpenPopupAction(data.openPopupAction);
		this.name = Object.keys(data || {}).find((item) => item.endsWith("Endpoint") || item.endsWith("Command"));
		this.payload = this.name ? Reflect.get(data, this.name) : {};
		if (Reflect.has(this.payload, "dialog") || Reflect.has(this.payload, "content")) this.dialog = parseItem(this.payload.dialog || this.payload.content);
		if (Reflect.has(this.payload, "modal")) this.modal = parseItem(this.payload.modal);
		if (Reflect.has(this.payload, "nextEndpoint")) this.next_endpoint = new NavigationEndpoint(this.payload.nextEndpoint);
		if (data?.serviceEndpoint) data = data.serviceEndpoint;
		this.metadata = {};
		if (data?.commandMetadata?.webCommandMetadata?.url) this.metadata.url = data.commandMetadata.webCommandMetadata.url;
		if (data?.commandMetadata?.webCommandMetadata?.webPageType) this.metadata.page_type = data.commandMetadata.webCommandMetadata.webPageType;
		if (data?.commandMetadata?.webCommandMetadata?.apiUrl) this.metadata.api_url = data.commandMetadata.webCommandMetadata.apiUrl.replace("/youtubei/v1/", "");
		else if (this.name) this.metadata.api_url = this.getPath(this.name);
		if (data?.commandMetadata?.webCommandMetadata?.sendPost) this.metadata.send_post = data.commandMetadata.webCommandMetadata.sendPost;
		if (data?.createPlaylistEndpoint) {
			if (data?.createPlaylistEndpoint.createPlaylistDialog) this.dialog = parseItem(data?.createPlaylistEndpoint.createPlaylistDialog, CreatePlaylistDialog);
		}
	}
	/**
	* Sometimes InnerTube does not return an API url, in that case the library should set it based on the name of the payload object.
	* @deprecated This should be removed in the future.
	*/
	getPath(name) {
		switch (name) {
			case "browseEndpoint": return "/browse";
			case "watchEndpoint":
			case "reelWatchEndpoint": return "/player";
			case "searchEndpoint": return "/search";
			case "watchPlaylistEndpoint": return "/next";
			case "liveChatItemContextMenuEndpoint": return "/live_chat/get_item_context_menu";
		}
	}
	call(actions, args) {
		if (!actions) throw new Error("An API caller must be provided");
		if (this.command) {
			let command = this.command;
			if (command.is(CommandExecutorCommand)) command = command.commands.at(-1);
			return actions.execute(command.getApiPath(), {
				...command.buildRequest(),
				...args
			});
		}
		if (!this.metadata.api_url) throw new Error("Expected an api_url, but none was found.");
		return actions.execute(this.metadata.api_url, {
			...this.payload,
			...args
		});
	}
	toURL() {
		if (!this.metadata.url) return void 0;
		if (!this.metadata.page_type) return void 0;
		return this.metadata.page_type === "WEB_PAGE_TYPE_UNKNOWN" ? this.metadata.url : `https://www.youtube.com${this.metadata.url}`;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/Thumbnail.js
var Thumbnail = class Thumbnail {
	url;
	width;
	height;
	constructor(data) {
		this.url = data.url;
		this.width = data.width;
		this.height = data.height;
	}
	/**
	* Get thumbnails from response object.
	*/
	static fromResponse(data) {
		if (!data) return [];
		let thumbnail_data;
		if (data.thumbnails) thumbnail_data = data.thumbnails;
		else if (data.sources) thumbnail_data = data.sources;
		if (thumbnail_data) return thumbnail_data.map((x) => new Thumbnail(x)).sort((a, b) => b.width - a.width);
		return [];
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/EmojiRun.js
var EmojiRun = class {
	text;
	emoji;
	constructor(data) {
		this.text = data.emoji?.emojiId || data.emoji?.shortcuts?.[0] || data.text || "";
		this.emoji = {
			emoji_id: data.emoji.emojiId,
			shortcuts: data.emoji?.shortcuts || [],
			search_terms: data.emoji?.searchTerms || [],
			image: Thumbnail.fromResponse(data.emoji.image),
			is_custom: !!data.emoji?.isCustomEmoji
		};
	}
	toString() {
		return this.text;
	}
	toHTML() {
		const escaped_text = escape(this.text);
		return `<img src="${this.emoji.image[0].url}" alt="${escaped_text}" title="${escaped_text}" style="display: inline-block; vertical-align: text-top; height: var(--yt-emoji-size, 1rem); width: var(--yt-emoji-size, 1rem);" loading="lazy" crossorigin="anonymous" />`;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/TextRun.js
var TextRun = class {
	text;
	text_color;
	endpoint;
	bold;
	bracket;
	dark_mode_text_color;
	deemphasize;
	italics;
	strikethrough;
	error_underline;
	underline;
	font_face;
	attachment;
	constructor(data) {
		this.text = data.text;
		this.bold = Boolean(data.bold);
		this.bracket = Boolean(data.bracket);
		this.italics = Boolean(data.italics);
		this.strikethrough = Boolean(data.strikethrough);
		this.error_underline = Boolean(data.error_underline);
		this.underline = Boolean(data.underline);
		this.deemphasize = Boolean(data.deemphasize);
		if ("textColor" in data) this.text_color = data.textColor;
		if ("navigationEndpoint" in data) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		if ("darkModeTextColor" in data) this.dark_mode_text_color = data.darkModeTextColor;
		if ("fontFace" in data) this.font_face = data.fontFace;
		this.attachment = data.attachment;
	}
	toString() {
		return this.text;
	}
	toHTML() {
		const tags = [];
		if (this.bold) tags.push("b");
		if (this.italics) tags.push("i");
		if (this.strikethrough) tags.push("s");
		if (this.deemphasize) tags.push("small");
		if (this.underline) tags.push("u");
		if (this.error_underline) tags.push("u");
		if (!this.text?.length) return "";
		const escaped_text = escape(this.text);
		const wrapped_text = `<span style="white-space: pre-wrap;">${tags.map((tag) => `<${tag}>`).join("") + escaped_text + tags.map((tag) => `</${tag}>`).join("")}</span>`;
		if (this.attachment) {
			if (this.attachment.element.type.imageType.image.sources.length) {
				if (this.endpoint) {
					const { url } = this.attachment.element.type.imageType.image.sources[0];
					let image_el = "";
					if (url) image_el = `<img src="${url}" style="vertical-align: middle; height: ${this.attachment.element.properties.layoutProperties.height.value}px; width: ${this.attachment.element.properties.layoutProperties.width.value}px;" alt="">`;
					const nav_url = this.endpoint.toURL();
					if (nav_url) return `<a href="${nav_url}" class="yt-ch-link">${image_el}${wrapped_text}</a>`;
				}
			}
		}
		if (this.endpoint) {
			const url = this.endpoint.toURL();
			if (url) return `<a href="${url}">${wrapped_text}</a>`;
		}
		return wrapped_text;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/Text.js
function escape(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
var TAG$4 = "Text";
/**
* Represents text content that may include formatting, emojis, and navigation endpoints.
*/
var Text$1 = class Text$1 {
	/**
	* The plain text content.
	*/
	text;
	/**
	* Individual text segments with their formatting.
	*/
	runs;
	/**
	* Navigation endpoint associated with this text.
	*/
	endpoint;
	/**
	* Accessibility data associated with this text.
	*/
	accessibility;
	/**
	* Indicates if the text is right-to-left.
	*/
	rtl;
	constructor(data) {
		if (this.isRunsData(data)) {
			this.runs = data.runs.map((run) => run.emoji ? new EmojiRun(run) : new TextRun(run));
			this.text = this.runs.map((run) => run.text).join("");
		} else this.text = data?.simpleText;
		if (this.isObject(data) && "accessibility" in data && "accessibilityData" in data.accessibility) this.accessibility = { accessibility_data: new AccessibilityData(data.accessibility.accessibilityData) };
		this.rtl = !!data?.rtl;
		this.parseEndpoint(data);
	}
	isRunsData(data) {
		return this.isObject(data) && Reflect.has(data, "runs") && Array.isArray(data.runs);
	}
	parseEndpoint(data) {
		if (!this.isObject(data)) return;
		if ("navigationEndpoint" in data) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		else if ("titleNavigationEndpoint" in data) this.endpoint = new NavigationEndpoint(data.titleNavigationEndpoint);
		else if (this.runs?.[0]?.endpoint) this.endpoint = (this.runs?.[0]).endpoint;
	}
	isObject(data) {
		return typeof data === "object" && data !== null;
	}
	static fromAttributed(data) {
		const { content, commandRuns: command_runs, attachmentRuns: attachment_runs } = data;
		const runs = [{
			text: content,
			startIndex: 0
		}];
		const style_runs = data.styleRuns?.map((run) => ({
			...run,
			startIndex: run.startIndex ?? 0,
			length: run.length ?? content.length
		}));
		if (style_runs?.length) this.processStyleRuns(runs, style_runs, data);
		if (command_runs?.length) this.processCommandRuns(runs, command_runs, data);
		if (attachment_runs?.length) this.processAttachmentRuns(runs, attachment_runs, data);
		return new Text$1({ runs });
	}
	static processStyleRuns(runs, style_runs, data) {
		for (const style_run of style_runs) if (style_run.italic || style_run.strikethrough === "LINE_STYLE_SINGLE" || style_run.weightLabel === "FONT_WEIGHT_MEDIUM" || style_run.weightLabel === "FONT_WEIGHT_BOLD") {
			const matching_run = findMatchingRun(runs, style_run);
			if (!matching_run) {
				warn(TAG$4, "Unable to find matching run for style run. Skipping...", {
					style_run,
					input_data: data,
					parsed_runs: JSON.parse(JSON.stringify(runs))
				});
				continue;
			}
			insertSubRun(runs, matching_run, style_run, {
				bold: style_run.weightLabel === "FONT_WEIGHT_MEDIUM" || style_run.weightLabel === "FONT_WEIGHT_BOLD",
				italics: style_run.italic,
				strikethrough: style_run.strikethrough === "LINE_STYLE_SINGLE"
			});
		} else debug(TAG$4, "Skipping style run as it is doesn't have any information that we parse.", {
			style_run,
			input_data: data
		});
	}
	static processCommandRuns(runs, command_runs, data) {
		for (const command_run of command_runs) if (command_run.onTap) {
			const matching_run = findMatchingRun(runs, command_run);
			if (!matching_run) {
				warn(TAG$4, "Unable to find matching run for command run. Skipping...", {
					command_run,
					input_data: data,
					parsed_runs: JSON.parse(JSON.stringify(runs))
				});
				continue;
			}
			insertSubRun(runs, matching_run, command_run, { navigationEndpoint: command_run.onTap });
		} else debug(TAG$4, "Skipping command run as it is missing the \"doTap\" property.", {
			command_run,
			input_data: data
		});
	}
	static processAttachmentRuns(runs, attachment_runs, data) {
		for (const attachment_run of attachment_runs) {
			const matching_run = findMatchingRun(runs, attachment_run);
			if (!matching_run) {
				warn(TAG$4, "Unable to find matching run for attachment run. Skipping...", {
					attachment_run,
					input_data: data,
					parsed_runs: JSON.parse(JSON.stringify(runs))
				});
				continue;
			}
			if (attachment_run.length === 0) matching_run.attachment = attachment_run;
			else {
				const offset_start_index = attachment_run.startIndex - matching_run.startIndex;
				const text = matching_run.text.substring(offset_start_index, offset_start_index + attachment_run.length);
				const is_custom_emoji = /^:[^:]+:$/.test(text);
				if (attachment_run.element?.type?.imageType?.image && (is_custom_emoji || /^(?:\p{Emoji}|\u200d)+$/u.test(text))) insertSubRun(runs, matching_run, attachment_run, { emoji: {
					image: attachment_run.element.type.imageType.image,
					isCustomEmoji: is_custom_emoji,
					shortcuts: is_custom_emoji ? [text] : void 0
				} });
				else insertSubRun(runs, matching_run, attachment_run, { attachment: attachment_run });
			}
		}
	}
	/**
	* Converts the text to HTML.
	* @returns The HTML.
	*/
	toHTML() {
		return this.runs ? this.runs.map((run) => run.toHTML()).join("") : this.text;
	}
	/**
	* Checks if the text is empty.
	* @returns Whether the text is empty.
	*/
	isEmpty() {
		return this.text === void 0;
	}
	/**
	* Converts the text to a string.
	* @returns The text.
	*/
	toString() {
		return this.text || "N/A";
	}
};
function findMatchingRun(runs, response_run) {
	return runs.find((run) => {
		return run.startIndex <= response_run.startIndex && response_run.startIndex + response_run.length <= run.startIndex + run.text.length;
	});
}
function insertSubRun(runs, original_run, response_run, properties_to_add) {
	const replace_index = runs.indexOf(original_run);
	const replacement_runs = [];
	const offset_start_index = response_run.startIndex - original_run.startIndex;
	if (response_run.startIndex > original_run.startIndex) replacement_runs.push({
		...original_run,
		text: original_run.text.substring(0, offset_start_index)
	});
	replacement_runs.push({
		...original_run,
		text: original_run.text.substring(offset_start_index, offset_start_index + response_run.length),
		startIndex: response_run.startIndex,
		...properties_to_add
	});
	if (response_run.startIndex + response_run.length < original_run.startIndex + original_run.text.length) replacement_runs.push({
		...original_run,
		text: original_run.text.substring(offset_start_index + response_run.length),
		startIndex: response_run.startIndex + response_run.length
	});
	runs.splice(replace_index, 1, ...replacement_runs);
}
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelExternalLinkView.js
var ChannelExternalLinkView = class extends YTNode {
	static type = "ChannelExternalLinkView";
	title;
	link;
	favicon;
	constructor(data) {
		super();
		this.title = Text$1.fromAttributed(data.title);
		this.link = Text$1.fromAttributed(data.link);
		this.favicon = Thumbnail.fromResponse(data.favicon);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AboutChannelView.js
var AboutChannelView = class extends YTNode {
	static type = "AboutChannelView";
	description;
	description_label;
	country;
	custom_links_label;
	subscriber_count;
	view_count;
	joined_date;
	canonical_channel_url;
	channel_id;
	additional_info_label;
	custom_url_on_tap;
	video_count;
	sign_in_for_business_email;
	links;
	constructor(data) {
		super();
		if (Reflect.has(data, "description")) this.description = data.description;
		if (Reflect.has(data, "descriptionLabel")) this.description_label = Text$1.fromAttributed(data.descriptionLabel);
		if (Reflect.has(data, "country")) this.country = data.country;
		if (Reflect.has(data, "customLinksLabel")) this.custom_links_label = Text$1.fromAttributed(data.customLinksLabel);
		if (Reflect.has(data, "subscriberCountText")) this.subscriber_count = data.subscriberCountText;
		if (Reflect.has(data, "viewCountText")) this.view_count = data.viewCountText;
		if (Reflect.has(data, "joinedDateText")) this.joined_date = Text$1.fromAttributed(data.joinedDateText);
		if (Reflect.has(data, "canonicalChannelUrl")) this.canonical_channel_url = data.canonicalChannelUrl;
		if (Reflect.has(data, "channelId")) this.channel_id = data.channelId;
		if (Reflect.has(data, "additionalInfoLabel")) this.additional_info_label = Text$1.fromAttributed(data.additionalInfoLabel);
		if (Reflect.has(data, "customUrlOnTap")) this.custom_url_on_tap = new NavigationEndpoint(data.customUrlOnTap);
		if (Reflect.has(data, "videoCountText")) this.video_count = data.videoCountText;
		if (Reflect.has(data, "signInForBusinessEmail")) this.sign_in_for_business_email = Text$1.fromAttributed(data.signInForBusinessEmail);
		if (Reflect.has(data, "links")) this.links = parseArray(data.links, ChannelExternalLinkView);
		else this.links = [];
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AboutChannel.js
var AboutChannel = class extends YTNode {
	static type = "AboutChannel";
	metadata;
	share_channel;
	constructor(data) {
		super();
		this.metadata = parseItem(data.metadata, AboutChannelView);
		this.share_channel = parseItem(data.shareChannel, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AccountChannel.js
var AccountChannel = class extends YTNode {
	static type = "AccountChannel";
	title;
	endpoint;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AccountItem.js
/**
* Not a real renderer but we treat it as one to keep things organized.
*/
var AccountItem = class extends YTNode {
	static type = "AccountItem";
	account_name;
	account_photo;
	is_selected;
	is_disabled;
	has_channel;
	endpoint;
	account_byline;
	channel_handle;
	constructor(data) {
		super();
		this.account_name = new Text$1(data.accountName);
		this.account_photo = Thumbnail.fromResponse(data.accountPhoto);
		this.is_selected = !!data.isSelected;
		this.is_disabled = !!data.isDisabled;
		this.has_channel = !!data.hasChannel;
		this.endpoint = new NavigationEndpoint(data.serviceEndpoint);
		this.account_byline = new Text$1(data.accountByline);
		this.channel_handle = new Text$1(data.channelHandle);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AccountItemSectionHeader.js
var AccountItemSectionHeader = class extends YTNode {
	static type = "AccountItemSectionHeader";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CompactLink.js
var CompactLink = class extends YTNode {
	static type = "CompactLink";
	title;
	subtitle;
	endpoint;
	style;
	icon_type;
	secondary_icon_type;
	constructor(data) {
		super();
		this.title = new Text$1(data.title).toString();
		if ("subtitle" in data) this.subtitle = new Text$1(data.subtitle);
		if ("icon" in data && "iconType" in data.icon) this.icon_type = data.icon.iconType;
		if ("secondaryIcon" in data && "iconType" in data.secondaryIcon) this.secondary_icon_type = data.secondaryIcon.iconType;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.serviceEndpoint);
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AccountItemSection.js
var AccountItemSection = class extends YTNode {
	static type = "AccountItemSection";
	contents;
	header;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents, [AccountItem, CompactLink]);
		this.header = parseItem(data.header, AccountItemSectionHeader);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AccountSectionList.js
var AccountSectionList = class extends YTNode {
	static type = "AccountSectionList";
	contents;
	footers;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents, AccountItemSection);
		this.footers = parseArray(data.footers, AccountChannel);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/AppendContinuationItemsAction.js
var AppendContinuationItemsAction = class extends YTNode {
	static type = "AppendContinuationItemsAction";
	contents;
	target;
	constructor(data) {
		super();
		this.contents = parseArray(data.continuationItems);
		this.target = data.target;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/ChangeEngagementPanelVisibilityAction.js
var ChangeEngagementPanelVisibilityAction = class extends YTNode {
	static type = "ChangeEngagementPanelVisibilityAction";
	target_id;
	visibility;
	constructor(data) {
		super();
		this.target_id = data.targetId;
		this.visibility = data.visibility;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MultiPageMenu.js
var MultiPageMenu = class extends YTNode {
	static type = "MultiPageMenu";
	header;
	sections;
	style;
	constructor(data) {
		super();
		this.header = parseItem(data.header);
		this.sections = parseArray(data.sections);
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/GetMultiPageMenuAction.js
var GetMultiPageMenuAction = class extends YTNode {
	static type = "GetMultiPageMenuAction";
	menu;
	constructor(data) {
		super();
		this.menu = parseItem(data.menu, MultiPageMenu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/SendFeedbackAction.js
var SendFeedbackAction = class extends YTNode {
	static type = "SendFeedbackAction";
	bucket;
	constructor(data) {
		super();
		this.bucket = data.bucket;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/SignalAction.js
var SignalAction = class extends YTNode {
	static type = "SignalAction";
	signal;
	constructor(data) {
		super();
		this.signal = data.signal;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelSwitcherPage.js
var ChannelSwitcherPage = class extends YTNode {
	static type = "ChannelSwitcherPage";
	header;
	contents;
	constructor(data) {
		super();
		this.header = parseItem(data.header);
		this.contents = parse(data.contents, true);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/UpdateChannelSwitcherPageAction.js
var UpdateChannelSwitcherPageAction = class extends YTNode {
	static type = "UpdateChannelSwitcherPageAction";
	header;
	contents;
	constructor(data) {
		super();
		const page = parseItem(data.page, ChannelSwitcherPage);
		if (page) {
			this.header = page.header;
			this.contents = page.contents;
		}
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SortFilterSubMenu.js
var SortFilterSubMenu = class extends YTNode {
	static type = "SortFilterSubMenu";
	title;
	icon_type;
	tooltip;
	sub_menu_items;
	accessibility;
	constructor(data) {
		super();
		if ("title" in data) this.title = data.title;
		if ("icon" in data) this.icon_type = data.icon.iconType;
		if ("tooltip" in data) this.tooltip = data.tooltip;
		if ("subMenuItems" in data) this.sub_menu_items = data.subMenuItems.map((item) => ({
			title: item.title,
			selected: item.selected,
			continuation: item.continuation?.reloadContinuationData?.continuation,
			endpoint: new NavigationEndpoint(item.serviceEndpoint || item.navigationEndpoint),
			subtitle: item.subtitle || null
		}));
		if ("accessibility" in data && "accessibilityData" in data.accessibility) this.accessibility = { accessibility_data: new AccessibilityData(data.accessibility.accessibilityData) };
	}
	get label() {
		return this.accessibility?.accessibility_data?.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TranscriptFooter.js
var TranscriptFooter = class extends YTNode {
	static type = "TranscriptFooter";
	language_menu;
	constructor(data) {
		super();
		this.language_menu = parseItem(data.languageMenu, SortFilterSubMenu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TranscriptSearchBox.js
var TranscriptSearchBox = class extends YTNode {
	static type = "TranscriptSearchBox";
	formatted_placeholder;
	clear_button;
	endpoint;
	search_button;
	constructor(data) {
		super();
		this.formatted_placeholder = new Text$1(data.formattedPlaceholder);
		this.clear_button = parseItem(data.clearButton, Button);
		this.endpoint = new NavigationEndpoint(data.onTextChangeCommand);
		this.search_button = parseItem(data.searchButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TranscriptSectionHeader.js
var TranscriptSectionHeader = class extends YTNode {
	static type = "TranscriptSectionHeader";
	start_ms;
	end_ms;
	snippet;
	constructor(data) {
		super();
		this.start_ms = data.startMs;
		this.end_ms = data.endMs;
		this.snippet = new Text$1(data.snippet);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TranscriptSegment.js
var TranscriptSegment = class extends YTNode {
	static type = "TranscriptSegment";
	start_ms;
	end_ms;
	snippet;
	start_time_text;
	target_id;
	constructor(data) {
		super();
		this.start_ms = data.startMs;
		this.end_ms = data.endMs;
		this.snippet = new Text$1(data.snippet);
		this.start_time_text = new Text$1(data.startTimeText);
		this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TranscriptSegmentList.js
var TranscriptSegmentList = class extends YTNode {
	static type = "TranscriptSegmentList";
	initial_segments;
	no_result_label;
	retry_label;
	touch_captions_enabled;
	constructor(data) {
		super();
		this.initial_segments = parseArray(data.initialSegments, [TranscriptSegment, TranscriptSectionHeader]);
		this.no_result_label = new Text$1(data.noResultLabel);
		this.retry_label = new Text$1(data.retryLabel);
		this.touch_captions_enabled = data.touchCaptionsEnabled;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TranscriptSearchPanel.js
var TranscriptSearchPanel = class extends YTNode {
	static type = "TranscriptSearchPanel";
	header;
	body;
	footer;
	target_id;
	constructor(data) {
		super();
		this.header = parseItem(data.header, TranscriptSearchBox);
		this.body = parseItem(data.body, TranscriptSegmentList);
		this.footer = parseItem(data.footer, TranscriptFooter);
		this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Transcript.js
var Transcript = class extends YTNode {
	static type = "Transcript";
	content;
	constructor(data) {
		super();
		this.content = parseItem(data.content, TranscriptSearchPanel);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/UpdateEngagementPanelAction.js
var UpdateEngagementPanelAction = class extends YTNode {
	static type = "UpdateEngagementPanelAction";
	target_id;
	content;
	constructor(data) {
		super();
		this.target_id = data.targetId;
		this.content = parseItem(data.content, Transcript);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/actions/UpdateSubscribeButtonAction.js
var UpdateSubscribeButtonAction = class extends YTNode {
	static type = "UpdateSubscribeButtonAction";
	channel_id;
	subscribed;
	constructor(data) {
		super();
		this.channel_id = data.channelId;
		this.subscribed = data.subscribed;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ActiveAccountHeader.js
var ActiveAccountHeader = class extends YTNode {
	static type = "ActiveAccountHeader";
	account_name;
	account_photo;
	endpoint;
	manage_account_title;
	channel_handle;
	constructor(data) {
		super();
		this.account_name = new Text$1(data.accountName);
		this.account_photo = Thumbnail.fromResponse(data.accountPhoto);
		this.endpoint = new NavigationEndpoint(data.serviceEndpoint);
		this.manage_account_title = new Text$1(data.manageAccountTitle);
		this.channel_handle = new Text$1(data.channelHandle);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MenuTitle.js
var MenuTitle = class extends YTNode {
	static type = "MenuTitle";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistAddToOption.js
var PlaylistAddToOption = class extends YTNode {
	static type = "PlaylistAddToOption";
	add_to_playlist_service_endpoint;
	contains_selected_videos;
	playlist_id;
	privacy;
	privacy_icon;
	remove_from_playlist_service_endpoint;
	title;
	constructor(data) {
		super();
		this.add_to_playlist_service_endpoint = new NavigationEndpoint(data.addToPlaylistServiceEndpoint);
		this.contains_selected_videos = data.containsSelectedVideos;
		this.playlist_id = data.playlistId;
		this.privacy = data.privacy;
		this.privacy_icon = { icon_type: data.privacyIcon?.iconType || null };
		this.remove_from_playlist_service_endpoint = new NavigationEndpoint(data.removeFromPlaylistServiceEndpoint);
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AddToPlaylist.js
var AddToPlaylist = class extends YTNode {
	static type = "AddToPlaylist";
	actions;
	playlists;
	constructor(data) {
		super();
		this.actions = parseArray(data.actions, [MenuTitle, Button]);
		this.playlists = parseArray(data.playlists, PlaylistAddToOption);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Alert.js
var Alert = class extends YTNode {
	static type = "Alert";
	text;
	alert_type;
	constructor(data) {
		super();
		this.text = new Text$1(data.text);
		this.alert_type = data.type;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AlertWithButton.js
var AlertWithButton = class extends YTNode {
	static type = "AlertWithButton";
	text;
	alert_type;
	dismiss_button;
	constructor(data) {
		super();
		this.text = new Text$1(data.text);
		this.alert_type = data.type;
		this.dismiss_button = parseItem(data.dismissButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AnimatedThumbnailOverlayView.js
var AnimatedThumbnailOverlayView = class extends YTNode {
	static type = "AnimatedThumbnailOverlayView";
	thumbnail;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AttributionView.js
var AttributionView = class extends YTNode {
	static type = "AttributionView";
	text;
	suffix;
	constructor(data) {
		super();
		this.text = Text$1.fromAttributed(data.text);
		this.suffix = Text$1.fromAttributed(data.suffix);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AudioOnlyPlayability.js
var AudioOnlyPlayability = class extends YTNode {
	static type = "AudioOnlyPlayability";
	audio_only_availability;
	constructor(data) {
		super();
		this.audio_only_availability = data.audioOnlyAvailability;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AutomixPreviewVideo.js
var AutomixPreviewVideo = class extends YTNode {
	static type = "AutomixPreviewVideo";
	playlist_video;
	constructor(data) {
		super();
		if (data?.content?.automixPlaylistVideoRenderer?.navigationEndpoint) this.playlist_video = { endpoint: new NavigationEndpoint(data.content.automixPlaylistVideoRenderer.navigationEndpoint) };
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AvatarView.js
var AvatarView = class extends YTNode {
	static type = "AvatarView";
	image;
	image_processor;
	avatar_image_size;
	constructor(data) {
		super();
		this.image = Thumbnail.fromResponse(data.image);
		this.avatar_image_size = data.avatarImageSize;
		if (data.image.processor) this.image_processor = { border_image_processor: { circular: data.image.processor.borderImageProcessor.circular } };
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/CommandContext.js
var CommandContext = class {
	on_focus;
	on_hidden;
	on_touch_end;
	on_touch_move;
	on_long_press;
	on_tap;
	on_touch_start;
	on_visible;
	on_first_visible;
	on_hover;
	constructor(data) {
		if ("onFocus" in data) this.on_focus = new NavigationEndpoint(data.onFocus);
		if ("onHidden" in data) this.on_hidden = new NavigationEndpoint(data.onHidden);
		if ("onTouchEnd" in data) this.on_touch_end = new NavigationEndpoint(data.onTouchEnd);
		if ("onTouchMove" in data) this.on_touch_move = new NavigationEndpoint(data.onTouchMove);
		if ("onLongPress" in data) this.on_long_press = new NavigationEndpoint(data.onLongPress);
		if ("onTap" in data) this.on_tap = new NavigationEndpoint(data.onTap);
		if ("onTouchStart" in data) this.on_touch_start = new NavigationEndpoint(data.onTouchStart);
		if ("onVisible" in data) this.on_visible = new NavigationEndpoint(data.onVisible);
		if ("onFirstVisible" in data) this.on_first_visible = new NavigationEndpoint(data.onFirstVisible);
		if ("onHover" in data) this.on_hover = new NavigationEndpoint(data.onHover);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/RendererContext.js
var RendererContext = class {
	command_context;
	accessibility_context;
	constructor(data) {
		if (!data) return;
		if ("commandContext" in data) this.command_context = new CommandContext(data.commandContext);
		if ("accessibilityContext" in data) this.accessibility_context = new AccessibilityContext(data.accessibilityContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/AvatarStackView.js
var AvatarStackView = class extends YTNode {
	static type = "AvatarStackView";
	avatars;
	text;
	avatar_cluster_size;
	layout_type;
	renderer_context;
	constructor(data) {
		super();
		this.avatars = parseArray(data.avatars, AvatarView);
		if ("text" in data) this.text = Text$1.fromAttributed(data.text);
		if ("avatarClusterSize" in data) this.avatar_cluster_size = data.avatarClusterSize;
		if ("layoutType" in data) this.layout_type = data.layoutType;
		this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ButtonView.js
var ButtonView = class extends YTNode {
	static type = "ButtonView";
	secondary_icon_image;
	icon_name;
	enable_icon_button;
	tooltip;
	icon_image_flip_for_rtl;
	button_size;
	icon_position;
	is_full_width;
	state;
	on_disabled_tap;
	custom_border_color;
	on_tap;
	style;
	icon_image;
	custom_dark_theme_border_color;
	title;
	target_id;
	enable_full_width_margins;
	custom_font_color;
	button_type;
	enabled;
	accessibility_id;
	custom_background_color;
	on_long_press;
	title_formatted;
	on_visible;
	icon_trailing;
	accessibility_text;
	constructor(data) {
		super();
		if ("secondaryIconImage" in data) this.secondary_icon_image = Thumbnail.fromResponse(data.secondaryIconImage);
		if ("iconName" in data) this.icon_name = data.iconName;
		if ("enableIconButton" in data) this.enable_icon_button = data.enableIconButton;
		if ("tooltip" in data) this.tooltip = data.tooltip;
		if ("iconImageFlipForRtl" in data) this.icon_image_flip_for_rtl = data.iconImageFlipForRtl;
		if ("buttonSize" in data) this.button_size = data.buttonSize;
		if ("iconPosition" in data) this.icon_position = data.iconPosition;
		if ("isFullWidth" in data) this.is_full_width = data.isFullWidth;
		if ("state" in data) this.state = data.state;
		if ("onDisabledTap" in data) this.on_disabled_tap = new NavigationEndpoint(data.onDisabledTap);
		if ("customBorderColor" in data) this.custom_border_color = data.customBorderColor;
		if ("onTap" in data) this.on_tap = new NavigationEndpoint(data.onTap);
		if ("style" in data) this.style = data.style;
		if ("iconImage" in data) this.icon_image = data.iconImage;
		if ("customDarkThemeBorderColor" in data) this.custom_dark_theme_border_color = data.customDarkThemeBorderColor;
		if ("title" in data) this.title = data.title;
		if ("targetId" in data) this.target_id = data.targetId;
		if ("enableFullWidthMargins" in data) this.enable_full_width_margins = data.enableFullWidthMargins;
		if ("customFontColor" in data) this.custom_font_color = data.customFontColor;
		if ("type" in data) this.button_type = data.type;
		if ("enabled" in data) this.enabled = data.enabled;
		if ("accessibilityId" in data) this.accessibility_id = data.accessibilityId;
		if ("customBackgroundColor" in data) this.custom_background_color = data.customBackgroundColor;
		if ("onLongPress" in data) this.on_long_press = new NavigationEndpoint(data.onLongPress);
		if ("titleFormatted" in data) this.title_formatted = data.titleFormatted;
		if ("onVisible" in data) this.on_visible = data.onVisible;
		if ("iconTrailing" in data) this.icon_trailing = data.iconTrailing;
		if ("accessibilityText" in data) this.accessibility_text = data.accessibilityText;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/BackgroundPromo.js
var BackgroundPromo = class extends YTNode {
	static type = "BackgroundPromo";
	body_text;
	cta_button;
	icon_type;
	title;
	constructor(data) {
		super();
		this.body_text = new Text$1(data.bodyText);
		this.cta_button = parseItem(data.ctaButton, [Button, ButtonView]);
		if (Reflect.has(data, "icon")) this.icon_type = data.icon.iconType;
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/BackstageImage.js
var BackstageImage = class extends YTNode {
	static type = "BackstageImage";
	image;
	endpoint;
	constructor(data) {
		super();
		this.image = Thumbnail.fromResponse(data.image);
		this.endpoint = new NavigationEndpoint(data.command);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ToggleButton.js
var ToggleButton = class extends YTNode {
	static type = "ToggleButton";
	text;
	toggled_text;
	tooltip;
	toggled_tooltip;
	is_toggled;
	is_disabled;
	icon_type;
	like_count;
	short_like_count;
	endpoint;
	toggled_endpoint;
	button_id;
	target_id;
	constructor(data) {
		super();
		this.text = new Text$1(data.defaultText);
		this.toggled_text = new Text$1(data.toggledText);
		this.tooltip = data.defaultTooltip;
		this.toggled_tooltip = data.toggledTooltip;
		this.is_toggled = data.isToggled;
		this.is_disabled = data.isDisabled;
		this.icon_type = data.defaultIcon?.iconType;
		const acc_label = data?.defaultText?.accessibility?.accessibilityData?.label || data?.accessibilityData?.accessibilityData?.label || data?.accessibility?.label;
		if (this.icon_type == "LIKE") {
			this.like_count = parseInt(acc_label.replace(/\D/g, ""));
			this.short_like_count = new Text$1(data.defaultText).toString();
		}
		this.endpoint = data.defaultServiceEndpoint?.commandExecutorCommand?.commands ? new NavigationEndpoint(data.defaultServiceEndpoint.commandExecutorCommand.commands.pop()) : new NavigationEndpoint(data.defaultServiceEndpoint);
		this.toggled_endpoint = new NavigationEndpoint(data.toggledServiceEndpoint);
		if (Reflect.has(data, "toggleButtonSupportedData") && Reflect.has(data.toggleButtonSupportedData, "toggleButtonIdData")) this.button_id = data.toggleButtonSupportedData.toggleButtonIdData.id;
		if (Reflect.has(data, "targetId")) this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CreatorHeart.js
var CreatorHeart = class extends YTNode {
	static type = "CreatorHeart";
	creator_thumbnail;
	heart_icon_type;
	heart_color;
	hearted_tooltip;
	is_hearted;
	is_enabled;
	kennedy_heart_color_string;
	constructor(data) {
		super();
		this.creator_thumbnail = Thumbnail.fromResponse(data.creatorThumbnail);
		if (Reflect.has(data, "heartIcon") && Reflect.has(data.heartIcon, "iconType")) this.heart_icon_type = data.heartIcon.iconType;
		this.heart_color = { basic_color_palette_data: { foreground_title_color: data.heartColor?.basicColorPaletteData?.foregroundTitleColor } };
		this.hearted_tooltip = data.heartedTooltip;
		this.is_hearted = data.isHearted;
		this.is_enabled = data.isEnabled;
		this.kennedy_heart_color_string = data.kennedyHeartColorString;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentActionButtons.js
var CommentActionButtons = class extends YTNode {
	static type = "CommentActionButtons";
	like_button;
	dislike_button;
	reply_button;
	creator_heart;
	constructor(data) {
		super();
		this.like_button = parseItem(data.likeButton, ToggleButton);
		this.dislike_button = parseItem(data.dislikeButton, ToggleButton);
		this.reply_button = parseItem(data.replyButton, Button);
		this.creator_heart = parseItem(data.creatorHeart, CreatorHeart);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ToggleButtonView.js
var ToggleButtonView = class extends YTNode {
	static type = "ToggleButtonView";
	default_button;
	toggled_button;
	is_toggling_disabled;
	identifier;
	is_toggled;
	constructor(data) {
		super();
		this.default_button = parseItem(data.defaultButtonViewModel, ButtonView);
		this.toggled_button = parseItem(data.toggledButtonViewModel, ButtonView);
		this.is_toggling_disabled = data.isTogglingDisabled;
		this.identifier = data.identifier;
		if (Reflect.has(data, "isToggled")) this.is_toggled = data.isToggled;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LikeButtonView.js
var LikeButtonView = class extends YTNode {
	static type = "LikeButtonView";
	toggle_button;
	like_status_entity_key;
	like_status_entity;
	constructor(data) {
		super();
		this.toggle_button = parseItem(data.toggleButtonViewModel, ToggleButtonView);
		this.like_status_entity_key = data.likeStatusEntityKey;
		this.like_status_entity = {
			key: data.likeStatusEntity.key,
			like_status: data.likeStatusEntity.likeStatus
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DislikeButtonView.js
var DislikeButtonView = class extends YTNode {
	static type = "DislikeButtonView";
	toggle_button;
	dislike_entity_key;
	constructor(data) {
		super();
		this.toggle_button = parseItem(data.toggleButtonViewModel, ToggleButtonView);
		this.dislike_entity_key = data.dislikeEntityKey;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SegmentedLikeDislikeButtonView.js
var SegmentedLikeDislikeButtonView = class extends YTNode {
	static type = "SegmentedLikeDislikeButtonView";
	like_button;
	dislike_button;
	icon_type;
	like_count_entity;
	dynamic_like_count_update_data;
	like_count;
	short_like_count;
	constructor(data) {
		super();
		this.like_button = parseItem(data.likeButtonViewModel, LikeButtonView);
		this.dislike_button = parseItem(data.dislikeButtonViewModel, DislikeButtonView);
		this.icon_type = data.iconType;
		if (this.like_button && this.like_button.toggle_button) {
			const toggle_button = this.like_button.toggle_button;
			if (toggle_button.default_button) {
				this.short_like_count = toggle_button.default_button.title;
				if (toggle_button.default_button.accessibility_text) this.like_count = parseInt(toggle_button.default_button.accessibility_text.replace(/\D/g, ""));
			} else if (toggle_button.toggled_button) {
				this.short_like_count = toggle_button.toggled_button.title;
				if (toggle_button.toggled_button.accessibility_text) this.like_count = parseInt(toggle_button.toggled_button.accessibility_text.replace(/\D/g, ""));
			}
		}
		this.like_count_entity = { key: data.likeCountEntity.key };
		this.dynamic_like_count_update_data = {
			update_status_key: data.dynamicLikeCountUpdateData.updateStatusKey,
			placeholder_like_count_values_key: data.dynamicLikeCountUpdateData.placeholderLikeCountValuesKey,
			update_delay_loop_id: data.dynamicLikeCountUpdateData.updateDelayLoopId,
			update_delay_sec: data.dynamicLikeCountUpdateData.updateDelaySec
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MenuServiceItem.js
var MenuServiceItem = class extends Button {
	static type = "MenuServiceItem";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DownloadButton.js
var DownloadButton = class extends YTNode {
	static type = "DownloadButton";
	style;
	size;
	endpoint;
	target_id;
	constructor(data) {
		super();
		this.style = data.style;
		this.size = data.size;
		this.endpoint = new NavigationEndpoint(data.command);
		this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MenuServiceItemDownload.js
var MenuServiceItemDownload = class extends YTNode {
	static type = "MenuServiceItemDownload";
	has_separator;
	endpoint;
	constructor(data) {
		super();
		this.has_separator = !!data.hasSeparator;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.serviceEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SubscribeButtonView.js
var SubscribeButtonView = class extends YTNode {
	static type = "SubscribeButtonView";
	subscribe_button_content;
	unsubscribe_button_content;
	disable_notification_bell;
	button_style;
	is_signed_out;
	background_style;
	disable_subscribe_button;
	on_show_subscription_options;
	channel_id;
	enable_subscribe_button_post_click_animation;
	bell_accessibility_data;
	constructor(data) {
		super();
		this.subscribe_button_content = this.#parseButtonContent(data.subscribeButtonContent);
		this.unsubscribe_button_content = this.#parseButtonContent(data.unsubscribeButtonContent);
		this.disable_notification_bell = data.disableNotificationBell;
		if ("buttonStyle" in data) this.button_style = {
			unsubscribed_state_style: data.buttonStyle?.unsubscribedStateStyle,
			subscribed_state_style: data.buttonStyle?.subscribedStateStyle
		};
		this.is_signed_out = data.isSignedOut;
		this.background_style = data.backgroundStyle;
		this.disable_subscribe_button = data.disableSubscribeButton;
		if ("onShowSubscriptionOptions" in data) this.on_show_subscription_options = new NavigationEndpoint(data.onShowSubscriptionOptions);
		this.channel_id = data.channelId;
		this.enable_subscribe_button_post_click_animation = data.enableSubscribeButtonPostClickAnimation;
		if ("bellAccessibilityData" in data) this.bell_accessibility_data = {
			off_label: data.bellAccessibilityData?.offLabel,
			all_label: data.bellAccessibilityData?.allLabel,
			occasional_label: data.bellAccessibilityData?.occasionalLabel,
			disabled_label: data.bellAccessibilityData?.disabledLabel
		};
	}
	#parseButtonContent(data) {
		return {
			button_text: data.buttonText,
			accessibility_text: data.accessibilityText,
			image_name: data.imageName,
			subscribe_state_subscribed: data.subscribeState.subscribed,
			endpoint: new NavigationEndpoint(data.onTapCommand)
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ListItemView.js
var ListItemView = class extends YTNode {
	static type = "ListItemView";
	title;
	subtitle;
	selection_text;
	selection_style;
	background_color;
	leading_accessory;
	trailing_button;
	trailing_buttons;
	is_disabled;
	is_selected;
	has_divider_below;
	renderer_context;
	constructor(data) {
		super();
		if ("title" in data) this.title = Text$1.fromAttributed(data.title);
		if ("subtitle" in data) this.subtitle = Text$1.fromAttributed(data.subtitle);
		if ("selectionText" in data) this.selection_text = Text$1.fromAttributed(data.selectionText);
		if ("selectionStyle" in data) this.selection_style = data.selectionStyle;
		if ("backgroundColor" in data) this.background_color = parseInt(data.backgroundColor, 16);
		this.leading_accessory = parseItem(data.leadingAccessory, AvatarView);
		this.trailing_buttons = parseArray(data.trailingButtons?.buttons, SubscribeButtonView);
		this.trailing_button = parseItem(data.trailingButton);
		this.is_disabled = !!data.isDisabled;
		this.is_selected = !!data.isSelected;
		this.has_divider_below = !!data.hasDividerBelow;
		if ("rendererContext" in data) this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MenuFlexibleItem.js
var MenuFlexibleItem = class extends YTNode {
	static type = "MenuFlexibleItem";
	menu_item;
	top_level_button;
	constructor(data) {
		super();
		this.menu_item = parseItem(data.menuItem, [
			ListItemView,
			MenuServiceItem,
			MenuServiceItemDownload
		]);
		this.top_level_button = parseItem(data.topLevelButton, [
			DownloadButton,
			ButtonView,
			Button
		]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LikeButton.js
var LikeButton = class extends YTNode {
	static type = "LikeButton";
	target;
	like_status;
	likes_allowed;
	endpoints;
	constructor(data) {
		super();
		this.target = { video_id: data.target.videoId };
		this.like_status = data.likeStatus;
		this.likes_allowed = data.likesAllowed;
		if (Reflect.has(data, "serviceEndpoints")) this.endpoints = data.serviceEndpoints.map((endpoint) => new NavigationEndpoint(endpoint));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/FlexibleActionsView.js
var FlexibleActionsView = class extends YTNode {
	static type = "FlexibleActionsView";
	actions_rows;
	style;
	constructor(data) {
		super();
		this.actions_rows = data.actionsRows.map((row) => ({ actions: parseArray(row.actions, [
			ButtonView,
			ToggleButtonView,
			SubscribeButtonView
		]) }));
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/Menu.js
var Menu = class extends YTNode {
	static type = "Menu";
	items;
	flexible_items;
	top_level_buttons;
	accessibility;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
		this.flexible_items = parseArray(data.flexibleItems, MenuFlexibleItem);
		this.top_level_buttons = parseArray(data.topLevelButtons, [
			ToggleButton,
			LikeButton,
			Button,
			ButtonView,
			SegmentedLikeDislikeButtonView,
			FlexibleActionsView
		]);
		if ("accessibility" in data && "accessibilityData" in data.accessibility) this.accessibility = { accessibility_data: new AccessibilityData(data.accessibility.accessibilityData) };
	}
	get label() {
		return this.accessibility?.accessibility_data?.label;
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/BackstagePost.js
var BackstagePost = class extends YTNode {
	static type = "BackstagePost";
	id;
	author;
	content;
	published;
	poll_status;
	vote_status;
	vote_count;
	menu;
	action_buttons;
	vote_button;
	surface;
	endpoint;
	attachment;
	constructor(data) {
		super();
		this.id = data.postId;
		this.author = new Author({
			...data.authorText,
			navigationEndpoint: data.authorEndpoint
		}, null, data.authorThumbnail);
		this.content = new Text$1(data.contentText);
		this.published = new Text$1(data.publishedTimeText);
		if (Reflect.has(data, "pollStatus")) this.poll_status = data.pollStatus;
		if (Reflect.has(data, "voteStatus")) this.vote_status = data.voteStatus;
		if (Reflect.has(data, "voteCount")) this.vote_count = new Text$1(data.voteCount);
		if (Reflect.has(data, "actionMenu")) this.menu = parseItem(data.actionMenu, Menu);
		if (Reflect.has(data, "actionButtons")) this.action_buttons = parseItem(data.actionButtons, CommentActionButtons);
		if (Reflect.has(data, "voteButton")) this.vote_button = parseItem(data.voteButton, Button);
		if (Reflect.has(data, "navigationEndpoint")) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		if (Reflect.has(data, "backstageAttachment")) this.attachment = parseItem(data.backstageAttachment);
		this.surface = data.surface;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/BackstagePostThread.js
var BackstagePostThread = class extends YTNode {
	static type = "BackstagePostThread";
	post;
	constructor(data) {
		super();
		this.post = parseItem(data.post);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/BadgeView.js
var BadgeView = class extends YTNode {
	text;
	style;
	accessibility_label;
	constructor(data) {
		super();
		this.text = data.badgeText;
		this.style = data.badgeStyle;
		this.accessibility_label = data.accessibilityLabel;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SubFeedOption.js
var SubFeedOption = class extends YTNode {
	static type = "SubFeedOption";
	name;
	is_selected;
	endpoint;
	constructor(data) {
		super();
		this.name = new Text$1(data.name);
		this.is_selected = data.isSelected;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SubFeedSelector.js
var SubFeedSelector = class extends YTNode {
	static type = "SubFeedSelector";
	title;
	options;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.options = parseArray(data.options, SubFeedOption);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EomSettingsDisclaimer.js
var EomSettingsDisclaimer = class extends YTNode {
	static type = "EomSettingsDisclaimer";
	disclaimer;
	info_icon;
	usage_scenario;
	constructor(data) {
		super();
		this.disclaimer = new Text$1(data.disclaimer);
		this.info_icon = { icon_type: data.infoIcon.iconType };
		this.usage_scenario = data.usageScenario;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchBox.js
var SearchBox = class extends YTNode {
	static type = "SearchBox";
	endpoint;
	search_button;
	clear_button;
	placeholder_text;
	constructor(data) {
		super();
		this.endpoint = new NavigationEndpoint(data.endpoint);
		this.search_button = parseItem(data.searchButton, Button);
		this.clear_button = parseItem(data.clearButton, Button);
		this.placeholder_text = new Text$1(data.placeholderText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/BrowseFeedActions.js
var BrowseFeedActions = class extends YTNode {
	static type = "BrowseFeedActions";
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents, [
			SubFeedSelector,
			EomSettingsDisclaimer,
			ToggleButton,
			CompactLink,
			SearchBox,
			Button
		]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/BrowserMediaSession.js
var BrowserMediaSession = class extends YTNode {
	static type = "BrowserMediaSession";
	album;
	thumbnails;
	constructor(data) {
		super();
		this.album = new Text$1(data.album);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnailDetails);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ButtonCardView.js
var ButtonCardView = class extends YTNode {
	static type = "ButtonCardView";
	title;
	icon_name;
	renderer_context;
	constructor(data) {
		super();
		this.title = data.title;
		this.icon_name = data.image.sources[0].clientResource.imageName;
		this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelHeaderLinks.js
var HeaderLink = class extends YTNode {
	static type = "HeaderLink";
	endpoint;
	icon;
	title;
	constructor(data) {
		super();
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.icon = Thumbnail.fromResponse(data.icon);
		this.title = new Text$1(data.title);
	}
};
var ChannelHeaderLinks = class extends YTNode {
	static type = "ChannelHeaderLinks";
	primary;
	secondary;
	constructor(data) {
		super();
		this.primary = observe(data.primaryLinks?.map((link) => new HeaderLink(link)) || []);
		this.secondary = observe(data.secondaryLinks?.map((link) => new HeaderLink(link)) || []);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelHeaderLinksView.js
var ChannelHeaderLinksView = class extends YTNode {
	static type = "ChannelHeaderLinksView";
	first_link;
	more;
	constructor(data) {
		super();
		if (Reflect.has(data, "firstLink")) this.first_link = Text$1.fromAttributed(data.firstLink);
		if (Reflect.has(data, "more")) this.more = Text$1.fromAttributed(data.more);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ClipCreationTextInput.js
var ClipCreationTextInput = class extends YTNode {
	static type = "ClipCreationTextInput";
	placeholder_text;
	max_character_limit;
	constructor(data) {
		super();
		this.placeholder_text = new Text$1(data.placeholderText);
		this.max_character_limit = data.maxCharacterLimit;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ClipCreationScrubber.js
var ClipCreationScrubber = class extends YTNode {
	static type = "ClipCreationScrubber";
	length_template;
	max_length_ms;
	min_length_ms;
	default_length_ms;
	window_size_ms;
	start_label;
	end_label;
	duration_label;
	constructor(data) {
		super();
		this.length_template = data.lengthTemplate;
		this.max_length_ms = data.maxLengthMs;
		this.min_length_ms = data.minLengthMs;
		this.default_length_ms = data.defaultLengthMs;
		this.window_size_ms = data.windowSizeMs;
		this.start_label = data.startAccessibility?.accessibilityData?.label;
		this.end_label = data.endAccessibility?.accessibilityData?.label;
		this.duration_label = data.durationAccessibility?.accessibilityData?.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ClipAdState.js
var ClipAdState = class extends YTNode {
	static type = "ClipAdState";
	title;
	body;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.body = new Text$1(data.body);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ClipCreation.js
var ClipCreation = class extends YTNode {
	static type = "ClipCreation";
	user_avatar;
	title_input;
	scrubber;
	save_button;
	display_name;
	publicity_label;
	cancel_button;
	ad_state_overlay;
	external_video_id;
	publicity_label_icon;
	constructor(data) {
		super();
		this.user_avatar = Thumbnail.fromResponse(data.userAvatar);
		this.title_input = parseItem(data.titleInput, [ClipCreationTextInput]);
		this.scrubber = parseItem(data.scrubber, [ClipCreationScrubber]);
		this.save_button = parseItem(data.saveButton, [Button]);
		this.display_name = new Text$1(data.displayName);
		this.publicity_label = data.publicityLabel;
		this.cancel_button = parseItem(data.cancelButton, [Button]);
		this.ad_state_overlay = parseItem(data.adStateOverlay, [ClipAdState]);
		this.external_video_id = data.externalVideoId;
		this.publicity_label_icon = data.publicityLabelIcon;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ClipSection.js
var ClipSection = class extends YTNode {
	static type = "ClipSection";
	contents;
	constructor(data) {
		super();
		this.contents = parse(data.contents, true, [ClipCreation]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ContinuationItem.js
var ContinuationItem = class extends YTNode {
	static type = "ContinuationItem";
	trigger;
	button;
	endpoint;
	constructor(data) {
		super();
		this.trigger = data.trigger;
		if (Reflect.has(data, "button")) this.button = parseItem(data.button, Button);
		this.endpoint = new NavigationEndpoint(data.continuationEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EngagementPanelTitleHeader.js
var EngagementPanelTitleHeader = class extends YTNode {
	static type = "EngagementPanelTitleHeader";
	title;
	visibility_button;
	contextual_info;
	menu;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.contextual_info = data.contextualInfo ? new Text$1(data.contextualInfo) : void 0;
		this.visibility_button = parseItem(data.visibilityButton, Button);
		this.menu = parseItem(data.menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MacroMarkersInfoItem.js
var MacroMarkersInfoItem = class extends YTNode {
	static type = "MacroMarkersInfoItem";
	info_text;
	menu;
	constructor(data) {
		super();
		this.info_text = new Text$1(data.infoText);
		this.menu = parseItem(data.menu, Menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MacroMarkersListItem.js
var MacroMarkersListItem = class extends YTNode {
	static type = "MacroMarkersListItem";
	title;
	time_description;
	thumbnail;
	on_tap_endpoint;
	layout;
	is_highlighted;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.time_description = new Text$1(data.timeDescription);
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.on_tap_endpoint = new NavigationEndpoint(data.onTap);
		this.layout = data.layout;
		this.is_highlighted = !!data.isHighlighted;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MacroMarkersList.js
var MacroMarkersList = class extends YTNode {
	static type = "MacroMarkersList";
	contents;
	sync_button_label;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents, [MacroMarkersInfoItem, MacroMarkersListItem]);
		this.sync_button_label = new Text$1(data.syncButtonLabel);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ContentListItemView.js
var ContentListItemView = class extends YTNode {
	static type = "ContentListItemView";
	title;
	action_button;
	avatar;
	image;
	metadata;
	renderer_context;
	constructor(data) {
		super();
		this.title = Text$1.fromAttributed(data.title);
		this.action_button = parseItem(data.actionButton);
		this.avatar = parseItem(data.avatar);
		this.image = Thumbnail.fromResponse(data.image);
		this.metadata = parseItem(data.metadata);
		if ("rendererContext" in data) this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/PlaylistCollaborationFormSchema.js
var PlaylistCollaborationFormSchema = class {
	id;
	initial_values;
	constructor(data) {
		this.id = data.id;
		if ("initialValues" in data) this.initial_values = {
			collaborator_channel_ids: data.initialValues?.collaboratorChannelIds,
			is_allow_new_collaborators_enabled: data.initialValues?.isAllowNewCollaboratorsEnabled,
			is_collaboration_enabled: data.initialValues?.isCollaborationEnabled,
			is_invite_collaborators_button_enabled: data.initialValues?.isInviteCollaboratorsButtonEnabled
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/PlaylistCollaborationViewModelPlaylistCollaboratorData.js
var PlaylistCollaborationViewModelPlaylistCollaboratorData = class {
	remove_collaborator_confirmation_dialog;
	external_channel_id;
	collaborator_content_list_item;
	constructor(data) {
		this.remove_collaborator_confirmation_dialog = parseItem(data.removeCollaboratorConfirmationDialog);
		this.external_channel_id = data.externalChannelId;
		this.collaborator_content_list_item = parseItem(data.collaboratorContentListItem);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistCollaborationView.js
var PlaylistCollaborationView = class extends YTNode {
	static type = "PlaylistCollaborationView";
	playlist_collaborators;
	turn_off_collaboration_dialog;
	copy_link_button;
	collaborate_playlist_collaboration_setting;
	playlist_collaboration_entity_key;
	playlist_collaborators_data;
	leave_collaborative_playlist_confirmation_dialog;
	collaboration_type;
	allow_new_collaborators_playlist_collaboration_setting;
	playlist_collaboration_form_schema;
	turn_off_allow_new_collaborators_dialog;
	invite_collaborators_button;
	constructor(data) {
		super();
		this.playlist_collaborators = parseArray(data.playlistCollaborators, ContentListItemView);
		this.turn_off_collaboration_dialog = parseItem(data.turnOffCollaborationDialog);
		this.copy_link_button = parseItem(data.copyLinkButton);
		this.collaborate_playlist_collaboration_setting = parseItem(data.collaboratePlaylistCollaborationSetting);
		if ("playlistCollaboratorsData" in data) this.playlist_collaborators_data = data.playlistCollaboratorsData.map((item) => new PlaylistCollaborationViewModelPlaylistCollaboratorData(item));
		if ("playlistCollaborationFormSchema" in data) this.playlist_collaboration_form_schema = new PlaylistCollaborationFormSchema(data.playlistCollaborationFormSchema);
		this.leave_collaborative_playlist_confirmation_dialog = parseItem(data.leaveCollaborativePlaylistConfirmationDialog);
		this.allow_new_collaborators_playlist_collaboration_setting = parseItem(data.allowNewCollaboratorsPlaylistCollaborationSetting);
		this.turn_off_allow_new_collaborators_dialog = parseItem(data.turnOffAllowNewCollaboratorsDialog);
		this.invite_collaborators_button = parseItem(data.inviteCollaboratorsButton);
		this.playlist_collaboration_entity_key = data.playlistCollaborationEntityKey;
		this.collaboration_type = data.collaborationType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ProductList.js
var ProductList = class extends YTNode {
	static type = "ProductList";
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SectionList.js
var SectionList = class extends YTNode {
	static type = "SectionList";
	contents;
	target_id;
	continuation;
	header;
	sub_menu;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
		if (Reflect.has(data, "targetId")) this.target_id = data.targetId;
		if (Reflect.has(data, "continuations")) {
			if (Reflect.has(data.continuations[0], "nextContinuationData")) this.continuation = data.continuations[0].nextContinuationData.continuation;
			else if (Reflect.has(data.continuations[0], "reloadContinuationData")) this.continuation = data.continuations[0].reloadContinuationData.continuation;
		}
		if (Reflect.has(data, "header")) this.header = parseItem(data.header);
		if (Reflect.has(data, "subMenu")) this.sub_menu = parseItem(data.subMenu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ExpandableVideoDescriptionBody.js
var ExpandableVideoDescriptionBody = class extends YTNode {
	static type = "ExpandableVideoDescriptionBody";
	show_more_text;
	show_less_text;
	attributed_description_body_text;
	constructor(data) {
		super();
		this.show_more_text = new Text$1(data.showMoreText);
		this.show_less_text = new Text$1(data.showLessText);
		if (Reflect.has(data, "attributedDescriptionBodyText")) this.attributed_description_body_text = Text$1.fromAttributed(data.attributedDescriptionBodyText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchRefinementCard.js
var SearchRefinementCard = class extends YTNode {
	static type = "SearchRefinementCard";
	thumbnails;
	endpoint;
	query;
	constructor(data) {
		super();
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.endpoint = new NavigationEndpoint(data.searchEndpoint);
		this.query = new Text$1(data.query).toString();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GameCard.js
var GameCard = class extends YTNode {
	static type = "GameCard";
	game;
	constructor(data) {
		super();
		this.game = parseItem(data.game);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HorizontalList.js
var HorizontalList = class extends YTNode {
	static type = "HorizontalList";
	visible_item_count;
	items;
	constructor(data) {
		super();
		this.visible_item_count = data.visibleItemCount;
		this.items = parseArray(data.items);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoSummaryParagraphView.js
var VideoSummaryParagraphView = class extends YTNode {
	static type = "VideoSummaryParagraphView";
	text;
	constructor(data) {
		super();
		this.text = Text$1.fromAttributed(data.text);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoSummaryContentView.js
var VideoSummaryContentView = class extends YTNode {
	static type = "VideoSummaryContentView";
	dislike_button_view;
	like_button_view;
	paragraphs;
	constructor(data) {
		super();
		if ("dislikeButtonViewModel" in data) this.dislike_button_view = parseItem(data.dislikeButtonViewModel, DislikeButtonView);
		if ("likeButtonViewModel" in data) this.like_button_view = parseItem(data.likeButtonViewModel, LikeButtonView);
		this.paragraphs = parseArray(data.paragraphs, VideoSummaryParagraphView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ExpandableMetadata.js
var ExpandableMetadata = class extends YTNode {
	static type = "ExpandableMetadata";
	header;
	expanded_content;
	expand_button;
	collapse_button;
	constructor(data) {
		super();
		if (Reflect.has(data, "header")) this.header = {
			collapsed_title: new Text$1(data.header.collapsedTitle),
			collapsed_thumbnail: Thumbnail.fromResponse(data.header.collapsedThumbnail),
			collapsed_label: new Text$1(data.header.collapsedLabel),
			expanded_title: new Text$1(data.header.expandedTitle)
		};
		this.expanded_content = parseItem(data.expandedContent, [
			VideoSummaryContentView,
			HorizontalCardList,
			HorizontalList
		]);
		this.expand_button = parseItem(data.expandButton, Button);
		this.collapse_button = parseItem(data.collapseButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MetadataBadge.js
var MetadataBadge = class extends YTNode {
	static type = "MetadataBadge";
	icon_type;
	style;
	label;
	tooltip;
	constructor(data) {
		super();
		if (Reflect.has(data, "icon")) this.icon_type = data.icon.iconType;
		if (Reflect.has(data, "style")) this.style = data.style;
		if (Reflect.has(data, "label")) this.label = data.label;
		if (Reflect.has(data, "tooltip") || Reflect.has(data, "iconTooltip")) this.tooltip = data.tooltip || data.iconTooltip;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayTimeStatus.js
var ThumbnailOverlayTimeStatus = class extends YTNode {
	static type = "ThumbnailOverlayTimeStatus";
	text;
	style;
	constructor(data) {
		super();
		this.text = new Text$1(data.text).toString();
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Video.js
var Video = class extends YTNode {
	static type = "Video";
	video_id;
	title;
	untranslated_title;
	description_snippet;
	snippets;
	expandable_metadata;
	additional_metadatas;
	thumbnails;
	thumbnail_overlays;
	rich_thumbnail;
	author;
	badges;
	endpoint;
	published;
	view_count;
	short_view_count;
	upcoming;
	length_text;
	show_action_menu;
	is_watched;
	menu;
	byline_text;
	search_video_result_entity_key;
	service_endpoints;
	service_endpoint;
	style;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.video_id = data.videoId;
		this.expandable_metadata = parseItem(data.expandableMetadata, ExpandableMetadata);
		if ("untranslatedTitle" in data) this.untranslated_title = new Text$1(data.untranslatedTitle);
		if ("descriptionSnippet" in data) this.description_snippet = new Text$1(data.descriptionSnippet);
		if ("detailedMetadataSnippets" in data) this.snippets = data.detailedMetadataSnippets.map((snippet) => ({
			text: new Text$1(snippet.snippetText),
			hover_text: new Text$1(snippet.snippetHoverText)
		}));
		if ("additionalMetadatas" in data) this.additional_metadatas = data.additionalMetadatas.map((meta) => new Text$1(meta));
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		if ("richThumbnail" in data) this.rich_thumbnail = parseItem(data.richThumbnail);
		this.author = new Author(data.ownerText, data.ownerBadges, data.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail);
		this.badges = parseArray(data.badges, MetadataBadge);
		if ("navigationEndpoint" in data) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		if ("publishedTimeText" in data) this.published = new Text$1(data.publishedTimeText);
		if ("viewCountText" in data) this.view_count = new Text$1(data.viewCountText);
		if ("shortViewCountText" in data) this.short_view_count = new Text$1(data.shortViewCountText);
		if ("upcomingEventData" in data) this.upcoming = new Date(Number(`${data.upcomingEventData.startTime}000`));
		this.show_action_menu = !!data.showActionMenu;
		this.is_watched = !!data.isWatched;
		this.menu = parseItem(data.menu, Menu);
		if ("searchVideoResultEntityKey" in data) this.search_video_result_entity_key = data.searchVideoResultEntityKey;
		if ("bylineText" in data) this.byline_text = new Text$1(data.bylineText);
		if ("lengthText" in data) this.length_text = new Text$1(data.lengthText);
		if ("serviceEndpoints" in data) this.service_endpoints = data.serviceEndpoints.map((endpoint) => new NavigationEndpoint(endpoint));
		if ("serviceEndpoint" in data) this.service_endpoint = new NavigationEndpoint(data.serviceEndpoint);
		if ("style" in data) this.style = data.style;
	}
	/**
	* @deprecated Use {@linkcode video_id} instead.
	*/
	get id() {
		return this.video_id;
	}
	get description() {
		if (this.snippets) return this.snippets.map((snip) => snip.text.toString()).join("");
		return this.description_snippet?.toString() || "";
	}
	get is_live() {
		return this.badges.some((badge) => {
			if (badge.style === "BADGE_STYLE_TYPE_LIVE_NOW" || badge.label === "LIVE") return true;
		}) || this.thumbnail_overlays.firstOfType(ThumbnailOverlayTimeStatus)?.style === "LIVE";
	}
	get is_upcoming() {
		return this.upcoming && this.upcoming > /* @__PURE__ */ new Date();
	}
	get is_premiere() {
		return this.badges.some((badge) => badge.label === "PREMIERE");
	}
	get is_4k() {
		return this.badges.some((badge) => badge.label === "4K");
	}
	get has_captions() {
		return this.badges.some((badge) => badge.label === "CC");
	}
	get best_thumbnail() {
		return this.thumbnails[0];
	}
	get duration() {
		const overlay_time_status = this.thumbnail_overlays.firstOfType(ThumbnailOverlayTimeStatus);
		const length_text = this.length_text?.toString() || overlay_time_status?.text.toString();
		return {
			text: length_text,
			seconds: length_text ? timeToSeconds(length_text) : 0
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoCard.js
var VideoCard = class extends Video {
	static type = "VideoCard";
	metadata_text;
	constructor(data) {
		super(data);
		if (Reflect.has(data, "metadataText")) {
			this.metadata_text = new Text$1(data.metadataText);
			if (this.metadata_text.text) {
				this.short_view_count = new Text$1({ simpleText: this.metadata_text.text.split("·")[0]?.trim() });
				this.published = new Text$1({ simpleText: this.metadata_text.text.split("·")[1]?.trim() });
			}
		}
		if (Reflect.has(data, "bylineText")) this.author = new Author(data.bylineText, data.ownerBadges, data.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ContentPreviewImageView.js
var ContentPreviewImageView = class extends YTNode {
	static type = "ContentPreviewImageView";
	image;
	style;
	constructor(data) {
		super();
		this.image = Thumbnail.fromResponse(data.image);
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoAttributeView.js
var VideoAttributeView = class extends YTNode {
	static type = "VideoAttributeView";
	image;
	image_style;
	title;
	subtitle;
	secondary_subtitle;
	orientation;
	sizing_rule;
	overflow_menu_on_tap;
	overflow_menu_a11y_label;
	constructor(data) {
		super();
		if (data.image?.sources) this.image = Thumbnail.fromResponse(data.image);
		else this.image = parseItem(data.image, ContentPreviewImageView);
		this.image_style = data.imageStyle;
		this.title = data.title;
		this.subtitle = data.subtitle;
		if (Reflect.has(data, "secondarySubtitle")) this.secondary_subtitle = { content: data.secondarySubtitle.content };
		this.orientation = data.orientation;
		this.sizing_rule = data.sizingRule;
		this.overflow_menu_on_tap = new NavigationEndpoint(data.overflowMenuOnTap);
		this.overflow_menu_a11y_label = data.overflowMenuA11yLabel;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HorizontalCardList.js
var HorizontalCardList = class extends YTNode {
	static type = "HorizontalCardList";
	cards;
	header;
	previous_button;
	next_button;
	constructor(data) {
		super();
		this.cards = parseArray(data.cards, [
			VideoAttributeView,
			SearchRefinementCard,
			MacroMarkersListItem,
			GameCard,
			VideoCard
		]);
		this.header = parseItem(data.header);
		this.previous_button = parseItem(data.previousButton, Button);
		this.next_button = parseItem(data.nextButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Factoid.js
var Factoid = class extends YTNode {
	static type = "Factoid";
	label;
	value;
	accessibility_text;
	constructor(data) {
		super();
		this.label = new Text$1(data.label);
		this.value = new Text$1(data.value);
		this.accessibility_text = data.accessibilityText;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/UploadTimeFactoid.js
var UploadTimeFactoid = class extends YTNode {
	static type = "UploadTimeFactoid";
	factoid;
	constructor(data) {
		super();
		this.factoid = parseItem(data.factoid, Factoid);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ViewCountFactoid.js
var ViewCountFactoid = class extends YTNode {
	static type = "ViewCountFactoid";
	view_count_entity_key;
	factoid;
	view_count_type;
	constructor(data) {
		super();
		this.view_count_entity_key = data.viewCountEntityKey;
		this.factoid = parseItem(data.factoid, [Factoid]);
		this.view_count_type = data.viewCountType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HypePointsFactoid.js
var HypePointsFactoid = class extends YTNode {
	static type = "HypePointsFactoid";
	factoid;
	constructor(data) {
		super();
		this.factoid = parseItem(data.factoid, Factoid);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoDescriptionHeader.js
var VideoDescriptionHeader = class extends YTNode {
	static type = "VideoDescriptionHeader";
	channel;
	channel_navigation_endpoint;
	channel_thumbnail;
	factoids;
	publish_date;
	title;
	views;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.channel = new Text$1(data.channel);
		this.channel_navigation_endpoint = new NavigationEndpoint(data.channelNavigationEndpoint);
		this.channel_thumbnail = Thumbnail.fromResponse(data.channelThumbnail);
		this.publish_date = new Text$1(data.publishDate);
		this.views = new Text$1(data.views);
		this.factoids = parseArray(data.factoid, [
			Factoid,
			HypePointsFactoid,
			ViewCountFactoid,
			UploadTimeFactoid
		]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoDescriptionInfocardsSection.js
var VideoDescriptionInfocardsSection = class extends YTNode {
	static type = "VideoDescriptionInfocardsSection";
	section_title;
	creator_videos_button;
	creator_about_button;
	section_subtitle;
	channel_avatar;
	channel_endpoint;
	constructor(data) {
		super();
		this.section_title = new Text$1(data.sectionTitle);
		this.creator_videos_button = parseItem(data.creatorVideosButton, Button);
		this.creator_about_button = parseItem(data.creatorAboutButton, Button);
		this.section_subtitle = new Text$1(data.sectionSubtitle);
		this.channel_avatar = Thumbnail.fromResponse(data.channelAvatar);
		this.channel_endpoint = new NavigationEndpoint(data.channelEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/InfoRow.js
var InfoRow = class extends YTNode {
	static type = "InfoRow";
	title;
	default_metadata;
	expanded_metadata;
	info_row_expand_status_key;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		if (Reflect.has(data, "defaultMetadata")) this.default_metadata = new Text$1(data.defaultMetadata);
		if (Reflect.has(data, "expandedMetadata")) this.expanded_metadata = new Text$1(data.expandedMetadata);
		if (Reflect.has(data, "infoRowExpandStatusKey")) this.info_row_expand_status_key = data.infoRowExpandStatusKey;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CompactVideo.js
var CompactVideo = class extends YTNode {
	static type = "CompactVideo";
	video_id;
	thumbnails;
	rich_thumbnail;
	title;
	author;
	view_count;
	short_view_count;
	short_byline_text;
	long_byline_text;
	published;
	badges;
	thumbnail_overlays;
	endpoint;
	menu;
	length_text;
	is_watched;
	service_endpoints;
	service_endpoint;
	style;
	constructor(data) {
		super();
		this.video_id = data.videoId;
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.title = new Text$1(data.title);
		this.author = new Author(data.longBylineText, data.ownerBadges, data.channelThumbnail);
		this.is_watched = !!data.isWatched;
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		this.menu = parseItem(data.menu, Menu);
		this.badges = parseArray(data.badges, MetadataBadge);
		if ("publishedTimeText" in data) this.published = new Text$1(data.publishedTimeText);
		if ("shortBylineText" in data) this.view_count = new Text$1(data.viewCountText);
		if ("shortViewCountText" in data) this.short_view_count = new Text$1(data.shortViewCountText);
		if ("richThumbnail" in data) this.rich_thumbnail = parseItem(data.richThumbnail);
		if ("shortBylineText" in data) this.short_byline_text = new Text$1(data.shortBylineText);
		if ("longBylineText" in data) this.long_byline_text = new Text$1(data.longBylineText);
		if ("lengthText" in data) this.length_text = new Text$1(data.lengthText);
		if ("serviceEndpoints" in data) this.service_endpoints = data.serviceEndpoints.map((endpoint) => new NavigationEndpoint(endpoint));
		if ("serviceEndpoint" in data) this.service_endpoint = new NavigationEndpoint(data.serviceEndpoint);
		if ("navigationEndpoint" in data) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		if ("style" in data) this.style = data.style;
	}
	/**
	* @deprecated Use {@linkcode video_id} instead.
	*/
	get id() {
		return this.video_id;
	}
	get duration() {
		const overlay_time_status = this.thumbnail_overlays.firstOfType(ThumbnailOverlayTimeStatus);
		const length_text = this.length_text?.toString() || overlay_time_status?.text.toString();
		return {
			text: length_text,
			seconds: length_text ? timeToSeconds(length_text) : 0
		};
	}
	get best_thumbnail() {
		return this.thumbnails[0];
	}
	get is_fundraiser() {
		return this.badges.some((badge) => badge.label === "Fundraiser");
	}
	get is_live() {
		return this.badges.some((badge) => {
			if (badge.style === "BADGE_STYLE_TYPE_LIVE_NOW" || badge.label === "LIVE") return true;
		});
	}
	get is_new() {
		return this.badges.some((badge) => badge.label === "New");
	}
	get is_premiere() {
		return this.badges.some((badge) => badge.style === "PREMIERE");
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CarouselLockup.js
var CarouselLockup = class extends YTNode {
	static type = "CarouselLockup";
	info_rows;
	video_lockup;
	constructor(data) {
		super();
		this.info_rows = parseArray(data.infoRows, InfoRow);
		this.video_lockup = parseItem(data.videoLockup, CompactVideo);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoDescriptionMusicSection.js
var VideoDescriptionMusicSection = class extends YTNode {
	static type = "VideoDescriptionMusicSection";
	carousel_lockups;
	section_title;
	constructor(data) {
		super();
		this.carousel_lockups = parseArray(data.carouselLockups, CarouselLockup);
		this.section_title = new Text$1(data.sectionTitle);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoDescriptionTranscriptSection.js
var VideoDescriptionTranscriptSection = class extends YTNode {
	static type = "VideoDescriptionTranscriptSection";
	section_title;
	sub_header_text;
	primary_button;
	constructor(data) {
		super();
		this.section_title = new Text$1(data.sectionTitle);
		this.sub_header_text = new Text$1(data.subHeaderText);
		this.primary_button = parseItem(data.primaryButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/StructuredDescriptionPlaylistLockup.js
var StructuredDescriptionPlaylistLockup = class extends YTNode {
	static type = "StructuredDescriptionPlaylistLockup";
	thumbnail;
	title;
	short_byline_text;
	video_count_short_text;
	endpoint;
	thumbnail_width;
	aspect_ratio;
	max_lines_title;
	max_lines_short_byline_text;
	overlay_position;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.title = new Text$1(data.title);
		this.short_byline_text = new Text$1(data.shortBylineText);
		this.video_count_short_text = new Text$1(data.videoCountShortText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.thumbnail_width = data.thumbnailWidth;
		this.aspect_ratio = data.aspectRatio;
		this.max_lines_title = data.maxLinesTitle;
		this.max_lines_short_byline_text = data.maxLinesShortBylineText;
		this.overlay_position = data.overlayPosition;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoDescriptionCourseSection.js
var VideoDescriptionCourseSection = class extends YTNode {
	static type = "VideoDescriptionCourseSection";
	section_title;
	media_lockups;
	constructor(data) {
		super();
		this.section_title = new Text$1(data.sectionTitle);
		this.media_lockups = parseArray(data.mediaLockups, [StructuredDescriptionPlaylistLockup]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoAttributesSectionView.js
var VideoAttributesSectionView = class extends YTNode {
	static type = "VideoAttributesSectionView";
	header_title;
	header_subtitle;
	video_attributes;
	previous_button;
	next_button;
	constructor(data) {
		super();
		this.header_title = data.headerTitle;
		this.header_subtitle = data.headerSubtitle;
		this.video_attributes = parseArray(data.videoAttributeViewModels, VideoAttributeView);
		this.previous_button = parseItem(data.previousButton, ButtonView);
		this.next_button = parseItem(data.nextButton, ButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HowThisWasMadeSectionView.js
var HowThisWasMadeSectionView = class extends YTNode {
	static type = "HowThisWasMadeSectionView";
	section_title;
	body_text;
	body_header;
	constructor(data) {
		super();
		if (Reflect.has(data, "sectionText")) this.section_title = Text$1.fromAttributed(data.sectionText);
		if (Reflect.has(data, "bodyText")) this.body_text = Text$1.fromAttributed(data.bodyText);
		if (Reflect.has(data, "bodyHeader")) this.body_header = Text$1.fromAttributed(data.bodyHeader);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ReelShelf.js
var ReelShelf = class extends YTNode {
	static type = "ReelShelf";
	title;
	items;
	endpoint;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.items = parseArray(data.items);
		if (Reflect.has(data, "endpoint")) this.endpoint = new NavigationEndpoint(data.endpoint);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MerchandiseShelf.js
var MerchandiseShelf = class extends YTNode {
	static type = "MerchandiseShelf";
	title;
	menu;
	items;
	constructor(data) {
		super();
		this.title = data.title;
		this.menu = parseItem(data.actionButton);
		this.items = parseArray(data.items);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SectionHeaderView.js
var SectionHeaderView = class extends YTNode {
	static type = "SectionHeaderView";
	headline;
	constructor(data) {
		super();
		this.headline = Text$1.fromAttributed(data.headline);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HypeFanCreditsSectionView.js
var HypeFanCreditsSectionView = class extends YTNode {
	static type = "HypeFanCreditsSectionView";
	header;
	constructor(data) {
		super();
		this.header = parseItem(data.header, SectionHeaderView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoDescriptionYouchatSectionView.js
var VideoDescriptionYouchatSectionView = class extends YTNode {
	static type = "VideoDescriptionYouchatSectionView";
	section_title;
	sub_header_text;
	primary_button;
	constructor(data) {
		super();
		if ("sectionTitle" in data) this.section_title = Text$1.fromAttributed(data.sectionTitle);
		if ("subHeaderText" in data) this.sub_header_text = Text$1.fromAttributed(data.subHeaderText);
		this.primary_button = parseItem(data.primaryButton, ButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/StructuredDescriptionContent.js
var StructuredDescriptionContent = class extends YTNode {
	static type = "StructuredDescriptionContent";
	items;
	constructor(data) {
		super();
		this.items = parseArray(data.items, [
			VideoDescriptionHeader,
			ExpandableVideoDescriptionBody,
			VideoDescriptionMusicSection,
			VideoDescriptionInfocardsSection,
			VideoDescriptionCourseSection,
			VideoDescriptionTranscriptSection,
			VideoDescriptionYouchatSectionView,
			HorizontalCardList,
			ReelShelf,
			VideoAttributesSectionView,
			HowThisWasMadeSectionView,
			ExpandableMetadata,
			MerchandiseShelf,
			HypeFanCreditsSectionView
		]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EngagementPanelSectionList.js
var EngagementPanelSectionList = class extends YTNode {
	static type = "EngagementPanelSectionList";
	header;
	content;
	target_id;
	panel_identifier;
	identifier;
	visibility;
	constructor(data) {
		super();
		this.header = parseItem(data.header, EngagementPanelTitleHeader);
		this.content = parseItem(data.content, [
			PlaylistCollaborationView,
			VideoAttributeView,
			SectionList,
			ContinuationItem,
			ClipSection,
			StructuredDescriptionContent,
			MacroMarkersList,
			ProductList
		]);
		this.panel_identifier = data.panelIdentifier;
		if ("identifier" in data) this.identifier = {
			surface: data.identifier.surface,
			tag: data.identifier.tag
		};
		this.target_id = data.targetId;
		this.visibility = data.visibility;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelTagline.js
var ChannelTagline = class extends YTNode {
	static type = "ChannelTagline";
	content;
	max_lines;
	more_endpoint;
	more_icon_type;
	more_label;
	target_id;
	constructor(data) {
		super();
		this.content = data.content;
		this.max_lines = data.maxLines;
		this.more_endpoint = data.moreEndpoint.showEngagementPanelEndpoint ? { show_engagement_panel_endpoint: {
			engagement_panel: parseItem(data.moreEndpoint.showEngagementPanelEndpoint.engagementPanel, EngagementPanelSectionList),
			engagement_panel_popup_type: data.moreEndpoint.showEngagementPanelEndpoint.engagementPanelPresentationConfigs.engagementPanelPopupPresentationConfig.popupType,
			identifier: {
				surface: data.moreEndpoint.showEngagementPanelEndpoint.identifier.surface,
				tag: data.moreEndpoint.showEngagementPanelEndpoint.identifier.tag
			}
		} } : new NavigationEndpoint(data.moreEndpoint);
		this.more_icon_type = data.moreIcon.iconType;
		this.more_label = data.moreLabel;
		this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SubscriptionNotificationToggleButton.js
var SubscriptionNotificationToggleButton = class extends YTNode {
	static type = "SubscriptionNotificationToggleButton";
	states;
	current_state_id;
	target_id;
	constructor(data) {
		super();
		this.states = data.states.map((data) => ({
			id: data.stateId,
			next_id: data.nextStateId,
			state: parse(data.state)
		}));
		this.current_state_id = data.currentStateId;
		this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SubscribeButton.js
var SubscribeButton = class extends YTNode {
	static type = "SubscribeButton";
	button_text;
	subscribed;
	enabled;
	item_type;
	channel_id;
	show_preferences;
	subscribed_text;
	unsubscribed_text;
	unsubscribe_text;
	notification_preference_button;
	service_endpoints;
	on_subscribe_endpoints;
	on_unsubscribe_endpoints;
	subscribed_entity_key;
	target_id;
	subscribe_accessibility_label;
	unsubscribe_accessibility_label;
	constructor(data) {
		super();
		this.button_text = new Text$1(data.buttonText);
		this.subscribed = data.subscribed;
		this.enabled = data.enabled;
		this.item_type = data.type;
		this.channel_id = data.channelId;
		this.show_preferences = data.showPreferences;
		if (Reflect.has(data, "subscribedButtonText")) this.subscribed_text = new Text$1(data.subscribedButtonText);
		if (Reflect.has(data, "unsubscribedButtonText")) this.unsubscribed_text = new Text$1(data.unsubscribedButtonText);
		if (Reflect.has(data, "unsubscribeButtonText")) this.unsubscribe_text = new Text$1(data.unsubscribeButtonText);
		this.notification_preference_button = parseItem(data.notificationPreferenceButton, SubscriptionNotificationToggleButton);
		if (Reflect.has(data, "serviceEndpoints")) this.service_endpoints = data.serviceEndpoints.map((endpoint) => new NavigationEndpoint(endpoint));
		if (Reflect.has(data, "onSubscribeEndpoints")) this.on_subscribe_endpoints = data.onSubscribeEndpoints.map((endpoint) => new NavigationEndpoint(endpoint));
		if (Reflect.has(data, "onUnsubscribeEndpoints")) this.on_unsubscribe_endpoints = data.onUnsubscribeEndpoints.map((endpoint) => new NavigationEndpoint(endpoint));
		if (Reflect.has(data, "subscribedEntityKey")) this.subscribed_entity_key = data.subscribedEntityKey;
		if (Reflect.has(data, "targetId")) this.target_id = data.targetId;
		if (Reflect.has(data, "subscribeAccessibility")) this.subscribe_accessibility_label = data.subscribeAccessibility.accessibilityData?.label;
		if (Reflect.has(data, "unsubscribeAccessibility")) this.unsubscribe_accessibility_label = data.unsubscribeAccessibility.accessibilityData?.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/C4TabbedHeader.js
var C4TabbedHeader = class extends YTNode {
	static type = "C4TabbedHeader";
	author;
	banner;
	tv_banner;
	mobile_banner;
	subscribers;
	videos_count;
	sponsor_button;
	subscribe_button;
	header_links;
	channel_handle;
	channel_id;
	tagline;
	constructor(data) {
		super();
		this.author = new Author({
			simpleText: data.title,
			navigationEndpoint: data.navigationEndpoint
		}, data.badges, data.avatar);
		if (Reflect.has(data, "banner")) this.banner = Thumbnail.fromResponse(data.banner);
		if (Reflect.has(data, "tv_banner")) this.tv_banner = Thumbnail.fromResponse(data.tvBanner);
		if (Reflect.has(data, "mobile_banner")) this.mobile_banner = Thumbnail.fromResponse(data.mobileBanner);
		if (Reflect.has(data, "subscriberCountText")) this.subscribers = new Text$1(data.subscriberCountText);
		if (Reflect.has(data, "videosCountText")) this.videos_count = new Text$1(data.videosCountText);
		if (Reflect.has(data, "sponsorButton")) this.sponsor_button = parseItem(data.sponsorButton, Button);
		if (Reflect.has(data, "subscribeButton")) this.subscribe_button = parseItem(data.subscribeButton, [SubscribeButton, Button]);
		if (Reflect.has(data, "headerLinks")) this.header_links = parseItem(data.headerLinks, [ChannelHeaderLinks, ChannelHeaderLinksView]);
		if (Reflect.has(data, "channelHandleText")) this.channel_handle = new Text$1(data.channelHandleText);
		if (Reflect.has(data, "channelId")) this.channel_id = data.channelId;
		if (Reflect.has(data, "tagline")) this.tagline = parseItem(data.tagline, ChannelTagline);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CallToActionButton.js
var CallToActionButton = class extends YTNode {
	static type = "CallToActionButton";
	label;
	icon_type;
	style;
	constructor(data) {
		super();
		this.label = new Text$1(data.label);
		this.icon_type = data.icon.iconType;
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Card.js
var Card = class extends YTNode {
	static type = "Card";
	teaser;
	content;
	card_id;
	feature;
	cue_ranges;
	constructor(data) {
		super();
		this.teaser = parseItem(data.teaser);
		this.content = parseItem(data.content);
		if (Reflect.has(data, "cardId")) this.card_id = data.cardId;
		if (Reflect.has(data, "feature")) this.feature = data.feature;
		this.cue_ranges = data.cueRanges.map((cr) => ({
			start_card_active_ms: cr.startCardActiveMs,
			end_card_active_ms: cr.endCardActiveMs,
			teaser_duration_ms: cr.teaserDurationMs,
			icon_after_teaser_ms: cr.iconAfterTeaserMs
		}));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CardCollection.js
var CardCollection = class extends YTNode {
	static type = "CardCollection";
	cards;
	header;
	allow_teaser_dismiss;
	constructor(data) {
		super();
		this.cards = parseArray(data.cards);
		this.header = new Text$1(data.headerText);
		this.allow_teaser_dismiss = data.allowTeaserDismiss;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CarouselHeader.js
var CarouselHeader = class extends YTNode {
	static type = "CarouselHeader";
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CarouselItem.js
var CarouselItem = class extends YTNode {
	static type = "CarouselItem";
	items;
	background_color;
	layout_style;
	pagination_thumbnails;
	paginator_alignment;
	constructor(data) {
		super();
		this.items = parseArray(data.carouselItems);
		this.background_color = data.backgroundColor;
		this.layout_style = data.layoutStyle;
		this.pagination_thumbnails = Thumbnail.fromResponse(data.paginationThumbnails);
		this.paginator_alignment = data.paginatorAlignment;
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TextCarouselItemView.js
var TextCarouselItemView = class extends YTNode {
	static type = "TextCarouselItemView";
	icon_name;
	text;
	on_tap_endpoint;
	button;
	constructor(data) {
		super();
		this.icon_name = data.iconName;
		this.text = Text$1.fromAttributed(data.text);
		this.on_tap_endpoint = new NavigationEndpoint(data.onTap);
		this.button = parseItem(data.button, ButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CarouselItemView.js
var CarouselItemView = class extends YTNode {
	static type = "CarouselItemView";
	item_type;
	carousel_item;
	constructor(data) {
		super();
		this.item_type = data.itemType;
		this.carousel_item = parseItem(data.carouselItem, TextCarouselItemView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CarouselTitleView.js
var CarouselTitleView = class extends YTNode {
	static type = "CarouselTitleView";
	title;
	previous_button;
	next_button;
	constructor(data) {
		super();
		this.title = data.title;
		this.previous_button = parseItem(data.previousButton, ButtonView);
		this.next_button = parseItem(data.nextButton, ButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Channel.js
var Channel$2 = class extends YTNode {
	static type = "Channel";
	id;
	author;
	subscriber_count;
	video_count;
	long_byline;
	short_byline;
	endpoint;
	subscribe_button;
	description_snippet;
	constructor(data) {
		super();
		this.id = data.channelId;
		this.author = new Author({
			...data.title,
			navigationEndpoint: data.navigationEndpoint
		}, data.ownerBadges, data.thumbnail);
		this.subscriber_count = new Text$1(data.subscriberCountText);
		this.video_count = new Text$1(data.videoCountText);
		this.long_byline = new Text$1(data.longBylineText);
		this.short_byline = new Text$1(data.shortBylineText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.subscribe_button = parseItem(data.subscribeButton, [SubscribeButton, Button]);
		this.description_snippet = new Text$1(data.descriptionSnippet);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelAboutFullMetadata.js
var ChannelAboutFullMetadata = class extends YTNode {
	static type = "ChannelAboutFullMetadata";
	id;
	name;
	avatar;
	canonical_channel_url;
	primary_links;
	view_count;
	joined_date;
	description;
	email_reveal;
	can_reveal_email;
	country;
	buttons;
	constructor(data) {
		super();
		this.id = data.channelId;
		this.name = new Text$1(data.title);
		this.avatar = Thumbnail.fromResponse(data.avatar);
		this.canonical_channel_url = data.canonicalChannelUrl;
		this.primary_links = data.primaryLinks?.map((link) => ({
			endpoint: new NavigationEndpoint(link.navigationEndpoint),
			icon: Thumbnail.fromResponse(link.icon),
			title: new Text$1(link.title)
		})) ?? [];
		this.view_count = new Text$1(data.viewCountText);
		this.joined_date = new Text$1(data.joinedDateText);
		this.description = new Text$1(data.description);
		this.email_reveal = new NavigationEndpoint(data.onBusinessEmailRevealClickCommand);
		this.can_reveal_email = !data.signInForBusinessEmail;
		this.country = new Text$1(data.country);
		this.buttons = parseArray(data.actionButtons, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelAgeGate.js
var ChannelAgeGate = class extends YTNode {
	static type = "ChannelAgeGate";
	channel_title;
	avatar;
	header;
	main_text;
	sign_in_button;
	secondary_text;
	constructor(data) {
		super();
		this.channel_title = data.channelTitle;
		this.avatar = Thumbnail.fromResponse(data.avatar);
		this.header = new Text$1(data.header);
		this.main_text = new Text$1(data.mainText);
		this.sign_in_button = parseItem(data.signInButton, Button);
		this.secondary_text = new Text$1(data.secondaryText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelFeaturedContent.js
var ChannelFeaturedContent = class extends YTNode {
	static type = "ChannelFeaturedContent";
	title;
	items;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.items = parseArray(data.items);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelMetadata.js
var ChannelMetadata = class extends YTNode {
	static type = "ChannelMetadata";
	title;
	description;
	url;
	rss_url;
	vanity_channel_url;
	external_id;
	is_family_safe;
	keywords;
	avatar;
	music_artist_name;
	available_countries;
	android_deep_link;
	android_appindexing_link;
	ios_appindexing_link;
	constructor(data) {
		super();
		this.title = data.title;
		this.description = data.description;
		this.url = data.channelUrl;
		this.rss_url = data.rssUrl;
		this.vanity_channel_url = data.vanityChannelUrl;
		this.external_id = data.externalId;
		this.is_family_safe = data.isFamilySafe;
		this.keywords = data.keywords;
		this.avatar = Thumbnail.fromResponse(data.avatar);
		this.music_artist_name = typeof data.musicArtistName === "string" && data.musicArtistName.length > 0 ? data.musicArtistName : void 0;
		this.available_countries = data.availableCountryCodes;
		this.android_deep_link = data.androidDeepLink;
		this.android_appindexing_link = data.androidAppindexingLink;
		this.ios_appindexing_link = data.iosAppindexingLink;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelMobileHeader.js
var ChannelMobileHeader = class extends YTNode {
	static type = "ChannelMobileHeader";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelOptions.js
var ChannelOptions = class extends YTNode {
	static type = "ChannelOptions";
	avatar;
	endpoint;
	name;
	links;
	constructor(data) {
		super();
		this.avatar = Thumbnail.fromResponse(data.avatar);
		this.endpoint = new NavigationEndpoint(data.avatarEndpoint);
		this.name = data.name;
		this.links = data.links.map((link) => new Text$1(link));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelOwnerEmptyState.js
var ChannelOwnerEmptyState = class extends YTNode {
	static type = "ChannelOwnerEmptyState";
	illustration;
	description;
	constructor(data) {
		super();
		this.illustration = Thumbnail.fromResponse(data.illustration);
		this.description = new Text$1(data.description);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelSubMenu.js
var ChannelSubMenu = class extends YTNode {
	static type = "ChannelSubMenu";
	content_type_sub_menu_items;
	sort_setting;
	constructor(data) {
		super();
		this.content_type_sub_menu_items = data.sortSetting?.sortFilterSubMenuRenderer?.subMenuItems?.map((item) => ({
			endpoint: new NavigationEndpoint(item.navigationEndpoint || item.endpoint),
			selected: item.selected,
			title: item.title
		})) || [];
		this.sort_setting = parseItem(data.sortSetting);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelSwitcherHeader.js
var ChannelSwitcherHeader = class extends YTNode {
	static type = "ChannelSwitcherHeader";
	title;
	button;
	constructor(data) {
		super();
		this.title = new Text$1(data.title).toString();
		if (Reflect.has(data, "button")) this.button = parseItem(data.button, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelThumbnailWithLink.js
var ChannelThumbnailWithLink = class extends YTNode {
	static type = "ChannelThumbnailWithLink";
	thumbnails;
	endpoint;
	accessibility;
	constructor(data) {
		super();
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		if ("accessibility" in data && "accessibilityData" in data.accessibility) this.accessibility = { accessibility_data: new AccessibilityData(data.accessibility.accessibilityData) };
	}
	get label() {
		return this.accessibility?.accessibility_data?.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChannelVideoPlayer.js
var ChannelVideoPlayer = class extends YTNode {
	static type = "ChannelVideoPlayer";
	id;
	title;
	description;
	view_count;
	published_time;
	constructor(data) {
		super();
		this.id = data.videoId;
		this.title = new Text$1(data.title);
		this.description = new Text$1(data.description);
		this.view_count = new Text$1(data.viewCountText);
		this.published_time = new Text$1(data.publishedTimeText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Chapter.js
var Chapter = class extends YTNode {
	static type = "Chapter";
	title;
	time_range_start_millis;
	thumbnail;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.time_range_start_millis = data.timeRangeStartMillis;
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChildVideo.js
var ChildVideo = class extends YTNode {
	static type = "ChildVideo";
	id;
	title;
	duration;
	endpoint;
	constructor(data) {
		super();
		this.id = data.videoId;
		this.title = new Text$1(data.title);
		this.duration = {
			text: data.lengthText.simpleText,
			seconds: timeToSeconds(data.lengthText.simpleText)
		};
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChipView.js
var ChipView = class extends YTNode {
	static type = "ChipView";
	accessibility_hint;
	accessibility_label;
	text;
	trailing_text;
	display_type;
	max_text_width;
	secondary_accessibility_label;
	original_text;
	tap_command;
	secondary_tap_command;
	chip_entity_key;
	selected;
	get endpoint() {
		return this.tap_command;
	}
	constructor(data) {
		super();
		if ("accessibilityHint" in data) this.accessibility_hint = data.accessibilityHint;
		if ("accessibilityLabel" in data) this.accessibility_label = data.accessibilityLabel;
		if ("chipEntityKey" in data) this.chip_entity_key = data.chipEntityKey;
		if ("text" in data) this.text = data.text;
		if ("trailingText" in data) this.trailing_text = data.trailingText;
		if ("displayType" in data) this.display_type = data.displayType;
		if ("maxTextWidth" in data) this.max_text_width = data.maxTextWidth;
		if ("originalText" in data) this.original_text = data.originalText;
		if ("secondaryAccessibilityLabel" in data) this.secondary_accessibility_label = data.secondaryAccessibilityLabel;
		if ("tapCommand" in data) this.tap_command = new NavigationEndpoint(data.tapCommand);
		if ("secondaryTapCommand" in data) this.secondary_tap_command = new NavigationEndpoint(data.secondaryTapCommand);
		this.selected = !!data.selected;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChipBarView.js
var ChipBarView = class extends YTNode {
	static type = "ChipBarView";
	chips;
	chip_bar_state_entity_key;
	renderer_context;
	constructor(data) {
		super();
		this.chips = parseArray(data.chips, ChipView);
		this.chip_bar_state_entity_key = data.chipBarStateEntityKey;
		if ("rendererContext" in data) this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChipCloudChip.js
var ChipCloudChip = class extends YTNode {
	static type = "ChipCloudChip";
	is_selected;
	endpoint;
	text;
	constructor(data) {
		super();
		this.is_selected = data.isSelected;
		if (Reflect.has(data, "navigationEndpoint")) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.text = new Text$1(data.text).toString();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ChipCloud.js
var ChipCloud = class extends YTNode {
	static type = "ChipCloud";
	chips;
	next_button;
	previous_button;
	horizontal_scrollable;
	constructor(data) {
		super();
		this.chips = parseArray(data.chips, ChipCloudChip);
		this.next_button = parseItem(data.nextButton, Button);
		this.previous_button = parseItem(data.previousButton, Button);
		this.horizontal_scrollable = data.horizontalScrollable;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ClientSideToggleMenuItem.js
var ClientSideToggleMenuItem = class extends YTNode {
	static type = "ClientSideToggleMenuItem";
	text;
	icon_type;
	toggled_text;
	toggled_icon_type;
	is_toggled;
	menu_item_identifier;
	endpoint;
	logging_directives;
	constructor(data) {
		super();
		this.text = new Text$1(data.defaultText);
		this.icon_type = data.defaultIcon.iconType;
		this.toggled_text = new Text$1(data.toggledText);
		this.toggled_icon_type = data.toggledIcon.iconType;
		if (Reflect.has(data, "isToggled")) this.is_toggled = data.isToggled;
		this.menu_item_identifier = data.menuItemIdentifier;
		this.endpoint = new NavigationEndpoint(data.command);
		if (Reflect.has(data, "loggingDirectives")) this.logging_directives = {
			visibility: { types: data.loggingDirectives.visibility.types },
			enable_displaylogger_experiment: data.loggingDirectives.enableDisplayloggerExperiment
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CollaboratorInfoCardContent.js
var CollaboratorInfoCardContent = class extends YTNode {
	static type = "CollaboratorInfoCardContent";
	channel_avatar;
	custom_text;
	channel_name;
	subscriber_count;
	endpoint;
	constructor(data) {
		super();
		this.channel_avatar = Thumbnail.fromResponse(data.channelAvatar);
		this.custom_text = new Text$1(data.customText);
		this.channel_name = new Text$1(data.channelName);
		this.subscriber_count = new Text$1(data.subscriberCountText);
		this.endpoint = new NavigationEndpoint(data.endpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CollageHeroImage.js
var CollageHeroImage = class extends YTNode {
	static type = "CollageHeroImage";
	left;
	top_right;
	bottom_right;
	endpoint;
	constructor(data) {
		super();
		this.left = Thumbnail.fromResponse(data.leftThumbnail);
		this.top_right = Thumbnail.fromResponse(data.topRightThumbnail);
		this.bottom_right = Thumbnail.fromResponse(data.bottomRightThumbnail);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailHoverOverlayView.js
var ThumbnailHoverOverlayView = class extends YTNode {
	static type = "ThumbnailHoverOverlayView";
	icon_name;
	text;
	style;
	constructor(data) {
		super();
		this.icon_name = data.icon.sources[0].clientResource.imageName;
		this.text = Text$1.fromAttributed(data.text);
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailBadgeView.js
var ThumbnailBadgeView = class extends YTNode {
	static type = "ThumbnailBadgeView";
	icon_name;
	text;
	badge_style;
	background_color;
	constructor(data) {
		super();
		this.text = data.text;
		this.badge_style = data.badgeStyle;
		if (data.backgroundColor) this.background_color = {
			light_theme: data.backgroundColor.lightTheme,
			dark_theme: data.backgroundColor.darkTheme
		};
		if (data.icon) this.icon_name = data.icon.sources[0].clientResource.imageName;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayBadgeView.js
var ThumbnailOverlayBadgeView = class extends YTNode {
	static type = "ThumbnailOverlayBadgeView";
	badges;
	position;
	constructor(data) {
		super();
		this.badges = parseArray(data.thumbnailBadges, ThumbnailBadgeView);
		this.position = data.position;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailHoverOverlayToggleActionsView.js
var ThumbnailHoverOverlayToggleActionsView = class extends YTNode {
	static type = "ThumbnailHoverOverlayToggleActionsView";
	buttons;
	constructor(data) {
		super();
		this.buttons = parseArray(data.buttons, ToggleButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayProgressBarView.js
var ThumbnailOverlayProgressBarView = class extends YTNode {
	static type = "ThumbnailOverlayProgressBarView";
	start_percent;
	constructor(data) {
		super();
		this.start_percent = data.startPercent;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailBottomOverlayView.js
var ThumbnailBottomOverlayView = class extends YTNode {
	static type = "ThumbnailBottomOverlayView";
	progress_bar;
	badges;
	constructor(data) {
		super();
		this.progress_bar = parseItem(data.progressBar, ThumbnailOverlayProgressBarView);
		this.badges = parseArray(data.badges, ThumbnailBadgeView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailView.js
var ThumbnailView = class extends YTNode {
	static type = "ThumbnailView";
	image;
	overlays;
	background_color;
	constructor(data) {
		super();
		this.image = Thumbnail.fromResponse(data.image);
		this.overlays = parseArray(data.overlays, [
			ThumbnailHoverOverlayToggleActionsView,
			ThumbnailBottomOverlayView,
			ThumbnailOverlayBadgeView,
			ThumbnailHoverOverlayView,
			AnimatedThumbnailOverlayView
		]);
		if ("backgroundColor" in data) this.background_color = {
			light_theme: data.backgroundColor.lightTheme,
			dark_theme: data.backgroundColor.darkTheme
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CollectionThumbnailView.js
var CollectionThumbnailView = class extends YTNode {
	static type = "CollectionThumbnailView";
	primary_thumbnail;
	stack_color;
	constructor(data) {
		super();
		this.primary_thumbnail = parseItem(data.primaryThumbnail, ThumbnailView);
		if ("stackColor" in data) this.stack_color = {
			light_theme: data.stackColor?.lightTheme,
			dark_theme: data.stackColor?.darkTheme
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/commands/AddToPlaylistCommand.js
var AddToPlaylistCommand = class extends YTNode {
	static type = "AddToPlaylistCommand";
	open_miniplayer;
	video_id;
	list_type;
	endpoint;
	video_ids;
	constructor(data) {
		super();
		this.open_miniplayer = data.openMiniplayer;
		this.video_id = data.videoId;
		this.list_type = data.listType;
		this.endpoint = new NavigationEndpoint(data.onCreateListCommand);
		this.video_ids = data.videoIds;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/commands/ContinuationCommand.js
var ContinuationCommand$1 = class extends YTNode {
	static type = "ContinuationCommand";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		switch (this.#data.request) {
			case "CONTINUATION_REQUEST_TYPE_WATCH_NEXT": return "next";
			case "CONTINUATION_REQUEST_TYPE_BROWSE": return "browse";
			case "CONTINUATION_REQUEST_TYPE_SEARCH": return "search";
			case "CONTINUATION_REQUEST_TYPE_ACCOUNTS_LIST": return "account/accounts_list";
			case "CONTINUATION_REQUEST_TYPE_COMMENTS_NOTIFICATION_MENU": return "notification/get_notification_menu";
			case "CONTINUATION_REQUEST_TYPE_COMMENT_REPLIES": return "comment/get_comment_replies";
			case "CONTINUATION_REQUEST_TYPE_REEL_WATCH_SEQUENCE": return "reel/reel_watch_sequence";
			case "CONTINUATION_REQUEST_TYPE_GET_PANEL": return "get_panel";
			default: return "";
		}
	}
	buildRequest() {
		const request = {};
		if (this.#data.formData) request.formData = this.#data.formData;
		if (this.#data.token) request.continuation = this.#data.token;
		if (this.#data.request === "CONTINUATION_REQUEST_TYPE_COMMENTS_NOTIFICATION_MENU") {
			request.notificationsMenuRequestType = "NOTIFICATIONS_MENU_REQUEST_TYPE_COMMENTS";
			if (this.#data.token) {
				request.fetchCommentsParams = { continuation: this.#data.token };
				delete request.continuation;
			}
		}
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/commands/GetKidsBlocklistPickerCommand.js
var API_PATH$19 = "kids/get_kids_blocklist_picker";
var GetKidsBlocklistPickerCommand = class extends YTNode {
	static type = "GetKidsBlocklistPickerCommand";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$19;
	}
	buildRequest() {
		const request = {};
		if (this.#data.blockedForKidsContent) request.blockedForKidsContent = this.#data.blockedForKidsContent;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/commands/RunAttestationCommand.js
var RunAttestationCommand = class extends YTNode {
	static type = "RunAttestationCommand";
	engagement_type;
	ids;
	constructor(data) {
		super();
		this.engagement_type = data.engagementType;
		if (Reflect.has(data, "ids")) this.ids = data.ids.map((id) => ({
			encrypted_video_id: id.encryptedVideoId,
			external_channel_id: id.externalChannelId,
			comment_id: id.commentId,
			external_owner_id: id.externalOwnerId,
			artist_id: id.artistId,
			playlist_id: id.playlistId,
			external_post_id: id.externalPostId,
			share_id: id.shareId
		}));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/commands/ShowDialogCommand.js
var ShowDialogCommand = class extends YTNode {
	static type = "ShowDialogCommand";
	inline_content;
	remove_default_padding;
	constructor(data) {
		super();
		this.inline_content = parseItem(data.panelLoadingStrategy?.inlineContent);
		this.remove_default_padding = !!data.removeDefaultPadding;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/commands/ShowSheetCommand.js
var ShowSheetCommand = class extends YTNode {
	static type = "ShowSheetCommand";
	inline_content;
	remove_default_padding;
	constructor(data) {
		super();
		this.inline_content = parseItem(data.panelLoadingStrategy?.inlineContent);
		this.remove_default_padding = !!data.removeDefaultPadding;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/commands/UpdateEngagementPanelContentCommand.js
var UpdateEngagementPanelContentCommand = class extends YTNode {
	static type = "UpdateEngagementPanelContentCommand";
	content_source_panel_identifier;
	target_panel_identifier;
	constructor(data) {
		super();
		this.content_source_panel_identifier = data.contentSourcePanelIdentifier;
		this.target_panel_identifier = data.targetPanelIdentifier;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/AuthorCommentBadge.js
var AuthorCommentBadge = class extends YTNode {
	static type = "AuthorCommentBadge";
	#data;
	icon_type;
	tooltip;
	style;
	constructor(data) {
		super();
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
		this.tooltip = data.iconTooltip;
		if (this.tooltip === "Verified") {
			this.style = "BADGE_STYLE_TYPE_VERIFIED";
			data.style = "BADGE_STYLE_TYPE_VERIFIED";
		}
		this.#data = data;
	}
	get orig_badge() {
		return this.#data;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/EmojiPicker.js
var EmojiPicker = class extends YTNode {
	static type = "EmojiPicker";
	id;
	categories;
	category_buttons;
	search_placeholder;
	search_no_results;
	pick_skin_tone;
	clear_search_label;
	skin_tone_generic_label;
	skin_tone_light_label;
	skin_tone_medium_light_label;
	skin_tone_medium_label;
	skin_tone_medium_dark_label;
	skin_tone_dark_label;
	constructor(data) {
		super();
		this.id = data.id;
		this.categories = parseArray(data.categories);
		this.category_buttons = parseArray(data.categoryButtons);
		this.search_placeholder = new Text$1(data.searchPlaceholderText);
		this.search_no_results = new Text$1(data.searchNoResultsText);
		this.pick_skin_tone = new Text$1(data.pickSkinToneText);
		this.clear_search_label = data.clearSearchLabel;
		this.skin_tone_generic_label = data.skinToneGenericLabel;
		this.skin_tone_light_label = data.skinToneLightLabel;
		this.skin_tone_medium_light_label = data.skinToneMediumLightLabel;
		this.skin_tone_medium_label = data.skinToneMediumLabel;
		this.skin_tone_medium_dark_label = data.skinToneMediumDarkLabel;
		this.skin_tone_dark_label = data.skinToneDarkLabel;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentDialog.js
var CommentDialog = class extends YTNode {
	static type = "CommentDialog";
	editable_text;
	author_thumbnail;
	submit_button;
	cancel_button;
	placeholder;
	emoji_button;
	emoji_picker;
	constructor(data) {
		super();
		this.editable_text = new Text$1(data.editableText);
		this.author_thumbnail = Thumbnail.fromResponse(data.authorThumbnail);
		this.submit_button = parseItem(data.submitButton, Button);
		this.cancel_button = parseItem(data.cancelButton, Button);
		this.placeholder = new Text$1(data.placeholderText);
		this.emoji_button = parseItem(data.emojiButton, Button);
		this.emoji_picker = parseItem(data.emojiPicker, EmojiPicker);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentReplyDialog.js
var CommentReplyDialog = class extends YTNode {
	static type = "CommentReplyDialog";
	reply_button;
	cancel_button;
	author_thumbnail;
	placeholder;
	error_message;
	constructor(data) {
		super();
		this.reply_button = parseItem(data.replyButton, Button);
		this.cancel_button = parseItem(data.cancelButton, Button);
		this.author_thumbnail = Thumbnail.fromResponse(data.authorThumbnail);
		this.placeholder = new Text$1(data.placeholderText);
		this.error_message = new Text$1(data.errorMessage);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/VoiceReplyContainerView.js
var VoiceReplyContainerView = class extends YTNode {
	static type = "VoiceReplyContainerView";
	voice_reply_unavailable_text;
	transcript_text;
	constructor(data) {
		super();
		this.voice_reply_unavailable_text = Text$1.fromAttributed(data.voiceReplyUnavailableText);
		this.transcript_text = Text$1.fromAttributed(data.transcriptText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentView.js
var CommentView = class extends YTNode {
	static type = "CommentView";
	#actions;
	like_command;
	dislike_command;
	unlike_command;
	undislike_command;
	reply_command;
	prepare_account_command;
	comment_id;
	is_pinned;
	keys;
	content;
	published_time;
	author_is_channel_owner;
	author_button_a11y;
	creator_thumbnail_url;
	like_button_a11y;
	like_count;
	like_count_liked;
	like_count_a11y;
	like_active_tooltip;
	like_inactive_tooltip;
	dislike_active_tooltip;
	dislike_inactive_tooltip;
	heart_active_tooltip;
	reply_count;
	reply_count_a11y;
	reply_level;
	is_member;
	member_badge;
	author;
	is_liked;
	is_disliked;
	is_hearted;
	voice_reply_container;
	constructor(data) {
		super();
		this.comment_id = data.commentId;
		this.is_pinned = !!data.pinnedText;
		this.keys = {
			comment: data.commentKey,
			comment_surface: data.commentSurfaceKey,
			toolbar_state: data.toolbarStateKey,
			toolbar_surface: data.toolbarSurfaceKey,
			shared: data.sharedKey
		};
	}
	applyMutations(comment, toolbar_state, toolbar_surface, comment_surface) {
		if (comment) {
			this.content = Text$1.fromAttributed(comment.properties.content);
			this.published_time = comment.properties.publishedTime;
			this.reply_level = comment.properties?.replyLevel ? comment.properties?.replyLevel : 0;
			this.author_button_a11y = comment.properties?.authorButtonA11y;
			this.author_is_channel_owner = !!comment.author.isCreator;
			this.creator_thumbnail_url = comment.toolbar.creatorThumbnailUrl;
			this.like_count = comment.toolbar.likeCountNotliked ? comment.toolbar.likeCountNotliked : "0";
			this.like_count_liked = comment.toolbar.likeCountLiked ? comment.toolbar.likeCountLiked : "0";
			this.like_count_a11y = comment.toolbar.likeCountA11y;
			this.like_active_tooltip = comment.toolbar.likeActiveTooltip;
			this.like_inactive_tooltip = comment.toolbar.likeInactiveTooltip;
			this.dislike_active_tooltip = comment.toolbar.dislikeActiveTooltip;
			this.dislike_inactive_tooltip = comment.toolbar.dislikeInactiveTooltip;
			this.like_button_a11y = comment.toolbar.likeButtonA11y;
			this.heart_active_tooltip = comment.toolbar.heartActiveTooltip;
			this.reply_count_a11y = comment.toolbar.replyCountA11y;
			this.reply_count = comment.toolbar.replyCount ? comment.toolbar.replyCount : "0";
			this.is_member = !!comment.author.sponsorBadgeUrl;
			if ("sponsorBadgeUrl" in comment.author) this.member_badge = {
				url: comment.author.sponsorBadgeUrl,
				a11y: comment.author?.sponsorBadgeA11y
			};
			let thumbs = comment.avatar?.image;
			if (!thumbs && "avatarThumbnailUrl" in comment.author) thumbs = { thumbnails: [{
				url: comment.author.avatarThumbnailUrl,
				width: 88,
				height: 88
			}] };
			this.author = new Author({
				simpleText: comment.author.displayName,
				navigationEndpoint: comment.avatar?.endpoint || comment.author?.channelCommand
			}, comment.author, thumbs, comment.author.channelId);
		}
		if (toolbar_state) {
			this.is_hearted = toolbar_state.heartState === "TOOLBAR_HEART_STATE_HEARTED";
			this.is_liked = toolbar_state.likeState === "TOOLBAR_LIKE_STATE_LIKED";
			this.is_disliked = toolbar_state.likeState === "TOOLBAR_LIKE_STATE_DISLIKED";
		}
		if (toolbar_surface) {
			if ("prepareAccountCommand" in toolbar_surface) this.prepare_account_command = new NavigationEndpoint(toolbar_surface.prepareAccountCommand);
			else {
				this.like_command = new NavigationEndpoint(toolbar_surface.likeCommand);
				this.dislike_command = new NavigationEndpoint(toolbar_surface.dislikeCommand);
				this.unlike_command = new NavigationEndpoint(toolbar_surface.unlikeCommand);
				this.undislike_command = new NavigationEndpoint(toolbar_surface.undislikeCommand);
				this.reply_command = new NavigationEndpoint(toolbar_surface.replyCommand);
			}
		}
		if (comment_surface) {
			if ("voiceReplyContainerViewModel" in comment_surface) this.voice_reply_container = parseItem(comment_surface.voiceReplyContainerViewModel, VoiceReplyContainerView);
		}
	}
	/**
	* Likes the comment.
	* @returns A promise that resolves to the API response.
	* @throws If the Actions instance is not set for this comment or if the like command is not found.
	*/
	async like() {
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment.");
		if (!this.like_command) throw new InnertubeError("Like command not found.");
		if (this.is_liked) throw new InnertubeError("This comment is already liked.", { comment_id: this.comment_id });
		return this.like_command.call(this.#actions);
	}
	/**
	* Dislikes the comment.
	* @returns A promise that resolves to the API response.
	* @throws If the Actions instance is not set for this comment or if the dislike command is not found.
	*/
	async dislike() {
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment.");
		if (!this.dislike_command) throw new InnertubeError("Dislike command not found.");
		if (this.is_disliked) throw new InnertubeError("This comment is already disliked.", { comment_id: this.comment_id });
		return this.dislike_command.call(this.#actions);
	}
	/**
	* Unlikes the comment.
	* @returns A promise that resolves to the API response.
	* @throws If the Actions instance is not set for this comment or if the unlike command is not found.
	*/
	async unlike() {
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment.");
		if (!this.unlike_command) throw new InnertubeError("Unlike command not found.");
		if (!this.is_liked) throw new InnertubeError("This comment is not liked.", { comment_id: this.comment_id });
		return this.unlike_command.call(this.#actions);
	}
	/**
	* Undislikes the comment.
	* @returns A promise that resolves to the API response.
	* @throws If the Actions instance is not set for this comment or if the undislike command is not found.
	*/
	async undislike() {
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment.");
		if (!this.undislike_command) throw new InnertubeError("Undislike command not found.");
		if (!this.is_disliked) throw new InnertubeError("This comment is not disliked.", { comment_id: this.comment_id });
		return this.undislike_command.call(this.#actions);
	}
	/**
	* Replies to the comment.
	* @param comment_text - The text of the reply.
	* @returns A promise that resolves to the API response.
	* @throws If the Actions instance is not set for this comment or if the reply command is not found.
	*/
	async reply(comment_text) {
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment.");
		if (!this.reply_command) throw new InnertubeError("Reply command not found.");
		const dialog = this.reply_command.dialog?.as(CommentReplyDialog);
		if (!dialog) throw new InnertubeError("Reply dialog not found.");
		const reply_button = dialog.reply_button;
		if (!reply_button) throw new InnertubeError("Reply button not found in the dialog.");
		if (!reply_button.endpoint) throw new InnertubeError("Reply button endpoint not found.");
		return reply_button.endpoint.call(this.#actions, { commentText: comment_text });
	}
	/**
	* Translates the comment to the specified target language.
	* @param target_language - The target language to translate the comment to, e.g. 'en', 'ja'.
	* @returns Resolves to an ApiResponse object with the translated content, if available.
	* @throws if the Actions instance is not set for this comment or if the comment content is not found.
	*/
	async translate(target_language) {
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment.");
		if (!this.content) throw new InnertubeError("Comment content not found.", { comment_id: this.comment_id });
		const action = encodeCommentActionParams(22, {
			text: this.content.toString().replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, ""),
			target_language
		});
		const response = await this.#actions.execute("comment/perform_comment_action", { action });
		const content = (response.data.frameworkUpdates?.entityBatchUpdate?.mutations)?.[0]?.payload?.commentEntityPayload?.translatedContent?.content;
		return {
			...response,
			content
		};
	}
	setActions(actions) {
		this.#actions = actions;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/CommentsContinuation.js
var CommentsContinuation = class CommentsContinuation {
	replies = observe([]);
	#actions;
	#nextContinuationItem;
	constructor(actions, data) {
		this.#actions = actions;
		if (!data.on_response_received_endpoints || !data.on_response_received_endpoints_memo) throw new InnertubeError("Invalid response received for comments continuation", data);
		const appendContinuationItemsNode = data.on_response_received_endpoints.firstOfType(AppendContinuationItemsAction);
		if (appendContinuationItemsNode) {
			for (const item of appendContinuationItemsNode.contents) if (item.is(CommentThread)) {
				item.setActions(this.#actions);
				item.processRepliesData();
				this.replies.push(item);
			} else if (item.is(ContinuationItem)) this.#nextContinuationItem = item;
		}
	}
	/**
	* Indicates whether this comment thread has more replies that can be fetched.
	*/
	get has_continuation() {
		return !!this.#nextContinuationItem;
	}
	/**
	* Retrieves next batch of replies.
	*/
	async getContinuation() {
		if (!this.#nextContinuationItem) throw new InnertubeError("No continuation item found");
		const loadMoreButton = this.#nextContinuationItem.button;
		if (!loadMoreButton) throw new InnertubeError("\"Load more\" button not found in continuation item");
		const response = await loadMoreButton.endpoint.call(this.#actions, { parse: true });
		return new CommentsContinuation(this.#actions, response);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentThread.js
var CommentThread = class CommentThread extends YTNode {
	static type = "CommentThread";
	comment;
	replies;
	comment_replies_data;
	is_moderated_elq_comment;
	has_replies;
	rendering_priority;
	#actions;
	#continuation;
	constructor(data) {
		super();
		this.comment = parseItem(data.commentViewModel, CommentView);
		this.comment_replies_data = parseItem(data.replies, CommentReplies);
		this.is_moderated_elq_comment = data.isModeratedElqComment;
		this.rendering_priority = data.renderingPriority;
		this.has_replies = !!this.comment_replies_data;
	}
	/**
	* Indicates whether this comment thread has more replies that can be fetched.
	*/
	get has_continuation() {
		if (!this.replies) throw new InnertubeError("Cannot determine if there is a continuation because this comment thread's replies have not been loaded");
		return !!this.#continuation;
	}
	/**
	* Indicates whether this comment thread has prepopulated reply data. If false, you will need to call {@link CommentThread.getReplies} to fetch the initial batch of replies.
	*/
	get is_prepopulated() {
		return !!this.comment_replies_data && this.comment_replies_data.sub_threads[0]?.is(CommentThread);
	}
	/**
	* Retrieves replies to this comment thread.
	*/
	async getReplies() {
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment thread");
		if (!this.comment_replies_data) throw new InnertubeError("This comment thread has no replies", this);
		if (!this.is_prepopulated) {
			const continuation = this.comment_replies_data.sub_threads.firstOfType(ContinuationItem);
			if (!continuation) throw new InnertubeError("Replies continuation item not found");
			let endpoint = continuation.endpoint;
			if (continuation.button) endpoint = continuation.button.endpoint;
			const response = await endpoint.call(this.#actions, { parse: true });
			if (!response.on_response_received_endpoints) throw new InnertubeError("Unexpected response", response);
			const appendContinuationItemsNode = response.on_response_received_endpoints.firstOfType(AppendContinuationItemsAction);
			if (appendContinuationItemsNode) this.#processList(appendContinuationItemsNode.contents.as(CommentThread, ContinuationItem));
		}
		return this;
	}
	/**
	* Retrieves next batch of replies.
	*/
	async getContinuation() {
		if (!this.replies) throw new InnertubeError("Cannot retrieve continuation because this comment thread's replies have not been loaded");
		if (!this.#continuation) throw new InnertubeError("No continuation item found");
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment thread");
		const loadMoreButton = this.#continuation.button?.as(Button);
		if (!loadMoreButton) throw new InnertubeError("Cannot retrieve continuation because the \"Load more\" button is missing");
		const response = await loadMoreButton.endpoint.call(this.#actions, { parse: true });
		return new CommentsContinuation(this.#actions, response);
	}
	/**
	* @internal
	*/
	setActions(actions) {
		this.#actions = actions;
	}
	/**
	* @internal
	*/
	processRepliesData() {
		if (this.is_prepopulated && !this.replies) this.#processList(this.comment_replies_data.sub_threads);
	}
	#processList(contents) {
		if (!this.#actions) throw new InnertubeError("Actions instance not set for this comment thread");
		this.replies = observe([]);
		for (const item of contents) if (item.is(CommentThread)) {
			item.setActions(this.#actions);
			item.processRepliesData();
			this.replies.push(item);
		} else if (item.is(ContinuationItem)) this.#continuation = item;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentReplies.js
var CommentReplies = class extends YTNode {
	static type = "CommentReplies";
	contents;
	sub_threads;
	view_replies;
	hide_replies;
	view_replies_creator_thumbnail;
	has_channel_owner_replied;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents, [CommentView, ContinuationItem]);
		this.sub_threads = parseArray(data.subThreads, [CommentThread, ContinuationItem]);
		this.view_replies = parseItem(data.viewReplies, Button);
		this.hide_replies = parseItem(data.hideReplies, Button);
		this.view_replies_creator_thumbnail = Thumbnail.fromResponse(data.viewRepliesCreatorThumbnail);
		this.has_channel_owner_replied = !!data.viewRepliesCreatorThumbnail;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentsSimplebox.js
var CommentsSimplebox = class extends YTNode {
	static type = "CommentsSimplebox";
	simplebox_avatar;
	simplebox_placeholder;
	constructor(data) {
		super();
		this.simplebox_avatar = Thumbnail.fromResponse(data.simpleboxAvatar);
		this.simplebox_placeholder = new Text$1(data.simpleboxPlaceholder);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentsEntryPointTeaser.js
var CommentsEntryPointTeaser = class extends YTNode {
	static type = "CommentsEntryPointTeaser";
	teaser_avatar;
	teaser_content;
	constructor(data) {
		super();
		if (Reflect.has(data, "teaserAvatar")) this.teaser_avatar = Thumbnail.fromResponse(data.teaserAvatar);
		if (Reflect.has(data, "teaserContent")) this.teaser_content = new Text$1(data.teaserContent);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentsEntryPointHeader.js
var CommentsEntryPointHeader = class extends YTNode {
	static type = "CommentsEntryPointHeader";
	header;
	comment_count;
	teaser_avatar;
	teaser_content;
	content_renderer;
	simplebox_placeholder;
	constructor(data) {
		super();
		if (Reflect.has(data, "headerText")) this.header = new Text$1(data.headerText);
		if (Reflect.has(data, "commentCount")) this.comment_count = new Text$1(data.commentCount);
		if (Reflect.has(data, "teaserAvatar") || Reflect.has(data, "simpleboxAvatar")) this.teaser_avatar = Thumbnail.fromResponse(data.teaserAvatar || data.simpleboxAvatar);
		if (Reflect.has(data, "teaserContent")) this.teaser_content = new Text$1(data.teaserContent);
		if (Reflect.has(data, "contentRenderer")) this.content_renderer = parseItem(data.contentRenderer, [CommentsEntryPointTeaser, CommentsSimplebox]);
		if (Reflect.has(data, "simpleboxPlaceholder")) this.simplebox_placeholder = new Text$1(data.simpleboxPlaceholder);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentsHeader.js
var CommentsHeader = class extends YTNode {
	static type = "CommentsHeader";
	title;
	count;
	comments_count;
	create_renderer;
	sort_menu;
	custom_emojis;
	constructor(data) {
		super();
		this.title = new Text$1(data.titleText);
		this.count = new Text$1(data.countText);
		this.comments_count = new Text$1(data.commentsCount);
		this.create_renderer = parseItem(data.createRenderer);
		this.sort_menu = parseItem(data.sortMenu, SortFilterSubMenu);
		if (Reflect.has(data, "customEmojis")) this.custom_emojis = data.customEmojis.map((emoji) => ({
			emoji_id: emoji.emojiId,
			shortcuts: emoji.shortcuts,
			search_terms: emoji.searchTerms,
			image: Thumbnail.fromResponse(emoji.image),
			is_custom_emoji: emoji.isCustomEmoji
		}));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/CommentSimplebox.js
var CommentSimplebox = class extends YTNode {
	static type = "CommentSimplebox";
	submit_button;
	cancel_button;
	author_thumbnail;
	placeholder;
	avatar_size;
	constructor(data) {
		super();
		this.submit_button = parseItem(data.submitButton, Button);
		this.cancel_button = parseItem(data.cancelButton, Button);
		this.author_thumbnail = Thumbnail.fromResponse(data.authorThumbnail);
		this.placeholder = new Text$1(data.placeholderText);
		this.avatar_size = data.avatarSize;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/PdgCommentChip.js
var PdgCommentChip = class extends YTNode {
	static type = "PdgCommentChip";
	text;
	color_pallette;
	icon_type;
	constructor(data) {
		super();
		this.text = new Text$1(data.chipText);
		this.color_pallette = {
			background_color: data.chipColorPalette?.backgroundColor,
			foreground_title_color: data.chipColorPalette?.foregroundTitleColor
		};
		if (Reflect.has(data, "chipIcon") && Reflect.has(data.chipIcon, "iconType")) this.icon_type = data.chipIcon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/comments/SponsorCommentBadge.js
var SponsorCommentBadge = class extends YTNode {
	static type = "SponsorCommentBadge";
	custom_badge;
	tooltip;
	constructor(data) {
		super();
		this.custom_badge = Thumbnail.fromResponse(data.customBadge);
		this.tooltip = data.tooltip;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CompactChannel.js
var CompactChannel = class extends YTNode {
	static type = "CompactChannel";
	title;
	channel_id;
	thumbnail;
	display_name;
	video_count;
	subscriber_count;
	endpoint;
	tv_banner;
	menu;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.channel_id = data.channelId;
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.display_name = new Text$1(data.displayName);
		this.video_count = new Text$1(data.videoCountText);
		this.subscriber_count = new Text$1(data.subscriberCountText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.tv_banner = Thumbnail.fromResponse(data.tvBanner);
		this.menu = parseItem(data.menu, Menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistCustomThumbnail.js
var PlaylistCustomThumbnail = class extends YTNode {
	static type = "PlaylistCustomThumbnail";
	thumbnail;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistVideoThumbnail.js
var PlaylistVideoThumbnail = class extends YTNode {
	static type = "PlaylistVideoThumbnail";
	thumbnail;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Playlist.js
var Playlist$2 = class extends YTNode {
	static type = "Playlist";
	id;
	title;
	author;
	thumbnails;
	thumbnail_renderer;
	video_count;
	video_count_short;
	first_videos;
	share_url;
	menu;
	badges;
	endpoint;
	thumbnail_overlays;
	view_playlist;
	constructor(data) {
		super();
		this.id = data.playlistId;
		this.title = new Text$1(data.title);
		this.author = data.shortBylineText?.simpleText ? new Text$1(data.shortBylineText) : new Author(data.longBylineText, data.ownerBadges, null);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail || { thumbnails: data.thumbnails.map((th) => th.thumbnails).flat(1) });
		this.video_count = new Text$1(data.thumbnailText);
		this.video_count_short = new Text$1(data.videoCountShortText);
		this.first_videos = parseArray(data.videos);
		this.share_url = data.shareUrl || null;
		this.menu = parseItem(data.menu);
		this.badges = parseArray(data.ownerBadges);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		if (Reflect.has(data, "thumbnailRenderer")) this.thumbnail_renderer = parseItem(data.thumbnailRenderer, [PlaylistVideoThumbnail, PlaylistCustomThumbnail]) || void 0;
		if (Reflect.has(data, "viewPlaylistText")) this.view_playlist = new Text$1(data.viewPlaylistText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CompactMix.js
var CompactMix = class extends Playlist$2 {
	static type = "CompactMix";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CompactMovie.js
var CompactMovie = class extends YTNode {
	static type = "CompactMovie";
	id;
	title;
	top_metadata_items;
	thumbnails;
	thumbnail_overlays;
	author;
	duration;
	endpoint;
	badges;
	use_vertical_poster;
	menu;
	constructor(data) {
		super();
		const overlay_time_status = data.thumbnailOverlays.find((overlay) => overlay.thumbnailOverlayTimeStatusRenderer)?.thumbnailOverlayTimeStatusRenderer.text || "N/A";
		this.id = data.videoId;
		this.title = new Text$1(data.title);
		this.top_metadata_items = new Text$1(data.topMetadataItems);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		this.author = new Author(data.shortBylineText);
		const durationText = data.lengthText ? new Text$1(data.lengthText).toString() : new Text$1(overlay_time_status).toString();
		this.duration = {
			text: durationText,
			seconds: timeToSeconds(durationText)
		};
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.badges = parseArray(data.badges);
		this.use_vertical_poster = data.useVerticalPoster;
		this.menu = parseItem(data.menu, Menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CompactPlaylist.js
var CompactPlaylist = class extends Playlist$2 {
	static type = "CompactPlaylist";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CompactStation.js
var CompactStation = class extends YTNode {
	static type = "CompactStation";
	title;
	description;
	video_count;
	endpoint;
	thumbnail;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.description = new Text$1(data.description);
		this.video_count = new Text$1(data.videoCountText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CompositeVideoPrimaryInfo.js
var CompositeVideoPrimaryInfo = class extends YTNode {
	static type = "CompositeVideoPrimaryInfo";
	constructor(_data) {
		super();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ConfirmDialog.js
var ConfirmDialog = class extends YTNode {
	static type = "ConfirmDialog";
	title;
	confirm_button;
	cancel_button;
	dialog_messages;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.confirm_button = parseItem(data.confirmButton, Button);
		this.cancel_button = parseItem(data.cancelButton, Button);
		this.dialog_messages = data.dialogMessages.map((txt) => new Text$1(txt));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ContentMetadataView.js
var ContentMetadataView = class extends YTNode {
	static type = "ContentMetadataView";
	metadata_rows;
	delimiter;
	constructor(data) {
		super();
		this.metadata_rows = data.metadataRows?.map((row) => ({
			metadata_parts: row.metadataParts?.map((part) => ({
				text: part.text ? Text$1.fromAttributed(part.text) : null,
				avatar_stack: parseItem(part.avatarStack, AvatarStackView),
				enable_truncation: data.enableTruncation
			})),
			badges: parseArray(row.badges, BadgeView)
		})) || [];
		this.delimiter = data.delimiter;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ContinuationItemView.js
var ContinuationItemView = class extends YTNode {
	static type = "ContinuationItemView";
	trigger;
	endpoint;
	constructor(data) {
		super();
		this.trigger = data.trigger;
		this.endpoint = new NavigationEndpoint(data.continuationCommand);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Message.js
var Message = class extends YTNode {
	static type = "Message";
	text;
	constructor(data) {
		super();
		this.text = new Text$1(data.text);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ConversationBar.js
var ConversationBar = class extends YTNode {
	static type = "ConversationBar";
	availability_message;
	constructor(data) {
		super();
		this.availability_message = parseItem(data.availabilityMessage, Message);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CopyLink.js
var CopyLink = class extends YTNode {
	static type = "CopyLink";
	copy_button;
	short_url;
	style;
	constructor(data) {
		super();
		this.copy_button = parseItem(data.copyButton, Button);
		this.short_url = data.shortUrl;
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DropdownView.js
var DropdownView = class extends YTNode {
	static type = "DropdownView";
	label;
	placeholder_text;
	disabled;
	options;
	dropdown_type;
	id;
	constructor(data) {
		super();
		this.label = new Text$1(data.label);
		this.placeholder_text = new Text$1(data.placeholderText);
		this.disabled = !!data.disabled;
		this.dropdown_type = data.type;
		this.id = data.id;
		if (Reflect.has(data, "options")) this.options = data.options.map((option) => ({
			title: new Text$1(option.title),
			subtitle: new Text$1(option.subtitle),
			leading_image: Thumbnail.fromResponse(option.leadingImage),
			value: { privacy_status_value: option.value?.privacyStatusValue },
			on_tap: new NavigationEndpoint(option.onTap),
			is_selected: !!option.isSelected
		}));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TextFieldView.js
var TextFieldView = class extends YTNode {
	static type = "TextFieldView";
	display_properties;
	content_properties;
	initial_state;
	form_field_metadata;
	constructor(data) {
		super();
		if (Reflect.has(data, "displayProperties")) this.display_properties = {
			isMultiline: !!data.displayProperties.isMultiline,
			disableNewLines: !!data.displayProperties.disableNewLines
		};
		if (Reflect.has(data, "contentProperties")) this.content_properties = {
			labelText: data.contentProperties.labelText,
			placeholderText: data.contentProperties.placeholderText,
			maxCharacterCount: data.contentProperties.maxCharacterCount
		};
		if (Reflect.has(data, "initialState")) this.initial_state = { isFocused: !!data.initialState.isFocused };
		if (Reflect.has(data, "formFieldMetadata")) this.form_field_metadata = {
			formId: data.formFieldMetadata.formId,
			fieldId: data.formFieldMetadata.fieldId
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/CreatePlaylistDialogFormView.js
var CreatePlaylistDialogFormView = class extends YTNode {
	static type = "CreatePlaylistDialogFormView";
	playlist_title;
	playlist_visibility;
	disable_playlist_collaborate;
	create_playlist_params_collaboration_enabled;
	create_playlist_params_collaboration_disabled;
	video_ids;
	constructor(data) {
		super();
		this.playlist_title = parseItem(data.playlistTitle, TextFieldView);
		this.playlist_visibility = parseItem(data.playlistVisibility, DropdownView);
		this.disable_playlist_collaborate = !!data.disablePlaylistCollaborate;
		this.create_playlist_params_collaboration_enabled = data.createPlaylistParamsCollaborationEnabled;
		this.create_playlist_params_collaboration_disabled = data.createPlaylistParamsCollaborationDisabled;
		this.video_ids = data.videoIds;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DecoratedAvatarView.js
var DecoratedAvatarView = class extends YTNode {
	static type = "DecoratedAvatarView";
	avatar;
	a11y_label;
	renderer_context;
	constructor(data) {
		super();
		this.avatar = parseItem(data.avatar, AvatarView);
		this.a11y_label = data.a11yLabel;
		this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HeatMarker.js
var HeatMarker = class extends YTNode {
	static type = "HeatMarker";
	time_range_start_millis;
	marker_duration_millis;
	heat_marker_intensity_score_normalized;
	constructor(data) {
		super();
		this.time_range_start_millis = Number.parseInt(data.startMillis, 10);
		this.marker_duration_millis = Number.parseInt(data.durationMillis, 10);
		this.heat_marker_intensity_score_normalized = data.intensityScoreNormalized;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TimedMarkerDecoration.js
var TimedMarkerDecoration = class extends YTNode {
	static type = "TimedMarkerDecoration";
	visible_time_range_start_millis;
	visible_time_range_end_millis;
	decoration_time_millis;
	label;
	icon;
	constructor(data) {
		super();
		this.visible_time_range_start_millis = data.visibleTimeRangeStartMillis;
		this.visible_time_range_end_millis = data.visibleTimeRangeEndMillis;
		this.decoration_time_millis = data.decorationTimeMillis;
		this.label = new Text$1(data.label);
		this.icon = data.icon;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Heatmap.js
var Heatmap = class extends YTNode {
	static type = "Heatmap";
	max_height_dp;
	min_height_dp;
	show_hide_animation_duration_millis;
	heat_markers;
	heat_markers_decorations;
	constructor(data) {
		super();
		this.max_height_dp = data.maxHeightDp;
		this.min_height_dp = data.minHeightDp;
		this.show_hide_animation_duration_millis = data.showHideAnimationDurationMillis;
		this.heat_markers = parseArray(data.heatMarkers, HeatMarker);
		this.heat_markers_decorations = parseArray(data.heatMarkersDecorations, TimedMarkerDecoration);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MultiMarkersPlayerBar.js
var Marker = class extends YTNode {
	static type = "Marker";
	marker_key;
	value;
	constructor(data) {
		super();
		this.marker_key = data.key;
		this.value = {};
		if (Reflect.has(data, "value")) {
			if (Reflect.has(data.value, "heatmap")) this.value.heatmap = parseItem(data.value.heatmap, Heatmap);
			if (Reflect.has(data.value, "chapters")) this.value.chapters = parseArray(data.value.chapters, Chapter);
		}
	}
};
var MultiMarkersPlayerBar = class extends YTNode {
	static type = "MultiMarkersPlayerBar";
	markers_map;
	constructor(data) {
		super();
		this.markers_map = observe(data.markersMap?.map((marker) => new Marker(marker)) || []);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DecoratedPlayerBar.js
var DecoratedPlayerBar = class extends YTNode {
	static type = "DecoratedPlayerBar";
	player_bar;
	player_bar_action_button;
	constructor(data) {
		super();
		this.player_bar = parseItem(data.playerBar, MultiMarkersPlayerBar);
		this.player_bar_action_button = parseItem(data.playerBarActionButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DefaultPromoPanel.js
var DefaultPromoPanel = class extends YTNode {
	static type = "DefaultPromoPanel";
	title;
	description;
	endpoint;
	large_form_factor_background_thumbnail;
	small_form_factor_background_thumbnail;
	scrim_color_values;
	min_panel_display_duration_ms;
	min_video_play_duration_ms;
	scrim_duration;
	metadata_order;
	panel_layout;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.description = new Text$1(data.description);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.large_form_factor_background_thumbnail = parseItem(data.largeFormFactorBackgroundThumbnail);
		this.small_form_factor_background_thumbnail = parseItem(data.smallFormFactorBackgroundThumbnail);
		this.scrim_color_values = data.scrimColorValues;
		this.min_panel_display_duration_ms = data.minPanelDisplayDurationMs;
		this.min_video_play_duration_ms = data.minVideoPlayDurationMs;
		this.scrim_duration = data.scrimDuration;
		this.metadata_order = data.metadataOrder;
		this.panel_layout = data.panelLayout;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DescriptionPreviewView.js
var DescriptionPreviewView = class extends YTNode {
	static type = "DescriptionPreviewView";
	description;
	max_lines;
	truncation_text;
	always_show_truncation_text;
	more_endpoint;
	renderer_context;
	constructor(data) {
		super();
		if ("description" in data) this.description = Text$1.fromAttributed(data.description);
		if ("maxLines" in data) this.max_lines = parseInt(data.maxLines);
		if ("truncationText" in data) this.truncation_text = Text$1.fromAttributed(data.truncationText);
		this.always_show_truncation_text = !!data.alwaysShowTruncationText;
		if (data.rendererContext.commandContext?.onTap?.innertubeCommand?.showEngagementPanelEndpoint) {
			const endpoint = data.rendererContext.commandContext?.onTap?.innertubeCommand?.showEngagementPanelEndpoint;
			this.more_endpoint = { show_engagement_panel_endpoint: {
				engagement_panel: parseItem(endpoint.engagementPanel, EngagementPanelSectionList),
				engagement_panel_popup_type: endpoint.engagementPanelPresentationConfigs.engagementPanelPopupPresentationConfig.popupType,
				identifier: {
					surface: endpoint.identifier.surface,
					tag: endpoint.identifier.tag
				}
			} };
		}
		this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DialogHeaderView.js
var DialogHeaderView = class extends YTNode {
	static type = "DialogHeaderView";
	headline;
	constructor(data) {
		super();
		this.headline = Text$1.fromAttributed(data.headline);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PanelFooterView.js
var PanelFooterView = class extends YTNode {
	static type = "PanelFooterView";
	primary_button;
	secondary_button;
	should_hide_divider;
	constructor(data) {
		super();
		this.primary_button = parseItem(data.primaryButton, ButtonView);
		this.secondary_button = parseItem(data.secondaryButton, ButtonView);
		this.should_hide_divider = !!data.shouldHideDivider;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/FormFooterView.js
var FormFooterView = class extends YTNode {
	static type = "FormFooterView";
	panel_footer;
	form_id;
	container_type;
	constructor(data) {
		super();
		this.panel_footer = parseItem(data.panelFooter, PanelFooterView);
		this.form_id = data.formId;
		this.container_type = data.containerType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DownloadListItemView.js
var DownloadListItemView = class extends YTNode {
	static type = "DownloadListItemView";
	renderer_context;
	constructor(data) {
		super();
		if ("rendererContext" in data) this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ListView.js
var ListView = class extends YTNode {
	static type = "ListView";
	items;
	renderer_context;
	constructor(data) {
		super();
		this.items = parseArray(data.listItems, [ListItemView, DownloadListItemView]);
		if ("rendererContext" in data) this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DialogView.js
var DialogView = class extends YTNode {
	static type = "DialogView";
	header;
	footer;
	custom_content;
	constructor(data) {
		super();
		this.header = parseItem(data.header, DialogHeaderView);
		this.footer = parseItem(data.footer, [FormFooterView, PanelFooterView]);
		this.custom_content = parseItem(data.customContent, [CreatePlaylistDialogFormView, ListView]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DidYouMean.js
var DidYouMean = class extends YTNode {
	static type = "DidYouMean";
	text;
	corrected_query;
	endpoint;
	constructor(data) {
		super();
		this.text = new Text$1(data.didYouMean).toString();
		this.corrected_query = new Text$1(data.correctedQuery);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.correctedQueryEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DismissableDialogContentSection.js
var DismissableDialogContentSection = class extends YTNode {
	static type = "DismissableDialogContentSection";
	title;
	subtitle;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DismissableDialog.js
var DismissableDialog = class extends YTNode {
	static type = "DismissableDialog";
	title;
	sections;
	metadata;
	display_style;
	constructor(data) {
		super();
		this.title = data.title;
		this.sections = parseArray(data.sections, DismissableDialogContentSection);
		this.metadata = parseItem(data.metadata);
		this.display_style = data.displayStyle;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/DynamicTextView.js
var DynamicTextView = class extends YTNode {
	static type = "DynamicTextView";
	text;
	max_lines;
	constructor(data) {
		super();
		this.text = Text$1.fromAttributed(data.text);
		this.max_lines = parseInt(data.maxLines);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/ChildElement.js
var ChildElement = class ChildElement extends YTNode {
	static type = "ChildElement";
	text;
	properties;
	child_elements;
	constructor(data) {
		super();
		if (Reflect.has(data, "type") && Reflect.has(data.type, "textType")) this.text = data.type.textType.text?.content;
		this.properties = data.properties;
		if (Reflect.has(data, "childElements")) this.child_elements = data.childElements.map((el) => new ChildElement(el));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Element.js
var Element = class Element extends YTNode {
	static type = "Element";
	model;
	child_elements;
	constructor(data) {
		super();
		if (Reflect.has(data, "elementRenderer")) return parseItem(data, Element);
		const type = data.newElement.type.componentType;
		this.model = parseItem(type?.model);
		if (Reflect.has(data, "newElement") && Reflect.has(data.newElement, "childElements")) this.child_elements = observe(data.newElement.childElements?.map((el) => new ChildElement(el)) || []);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EmergencyOnebox.js
var EmergencyOnebox = class extends YTNode {
	static type = "EmergencyOnebox";
	title;
	first_option;
	menu;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.first_option = parseItem(data.firstOption);
		this.menu = parseItem(data.menu, Menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EmojiPickerCategory.js
var EmojiPickerCategory = class extends YTNode {
	static type = "EmojiPickerCategory";
	category_id;
	title;
	emoji_ids;
	image_loading_lazy;
	category_type;
	constructor(data) {
		super();
		this.category_id = data.categoryId;
		this.title = new Text$1(data.title);
		this.emoji_ids = data.emojiIds;
		this.image_loading_lazy = !!data.imageLoadingLazy;
		this.category_type = data.categoryType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EmojiPickerCategoryButton.js
var EmojiPickerCategoryButton = class extends YTNode {
	static type = "EmojiPickerCategoryButton";
	category_id;
	icon_type;
	tooltip;
	constructor(data) {
		super();
		this.category_id = data.categoryId;
		if (Reflect.has(data, "icon")) this.icon_type = data.icon?.iconType;
		this.tooltip = data.tooltip;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EmojiPickerUpsellCategory.js
var EmojiPickerUpsellCategory = class extends YTNode {
	static type = "EmojiPickerUpsellCategory";
	category_id;
	title;
	upsell;
	emoji_tooltip;
	endpoint;
	emoji_ids;
	constructor(data) {
		super();
		this.category_id = data.categoryId;
		this.title = new Text$1(data.title);
		this.upsell = new Text$1(data.upsell);
		this.emoji_tooltip = data.emojiTooltip;
		this.endpoint = new NavigationEndpoint(data.command);
		this.emoji_ids = data.emojiIds;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/AddToPlaylistServiceEndpoint.js
var API_PATH$18 = "playlist/get_add_to_playlist";
var AddToPlaylistServiceEndpoint = class extends YTNode {
	static type = "AddToPlaylistServiceEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$18;
	}
	buildRequest() {
		const request = {};
		request.videoIds = this.#data.videoIds ? this.#data.videoIds : [this.#data.videoId];
		if (this.#data.playlistId) request.playlistId = this.#data.playlistId;
		if (this.#data.params) request.params = this.#data.params;
		request.excludeWatchLater = !!this.#data.excludeWatchLater;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/AddToPlaylistEndpoint.js
var AddToPlaylistEndpoint = class extends AddToPlaylistServiceEndpoint {
	static type = "AddToPlaylistEndpoint";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/BrowseEndpoint.js
var API_PATH$17 = "browse";
var BrowseEndpoint = class extends YTNode {
	static type = "BrowseEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$17;
	}
	buildRequest() {
		const request = {};
		if (this.#data.browseId) request.browseId = this.#data.browseId;
		if (this.#data.params) request.params = this.#data.params;
		if (this.#data.query) request.query = this.#data.query;
		if (this.#data.browseId === "FEsubscriptions") request.subscriptionSettingsState = this.#data.subscriptionSettingsState || "MY_SUBS_SETTINGS_STATE_LAYOUT_FORMAT_LIST";
		if (this.#data.browseId === "SPaccount_playback") request.formData = this.#data.formData || { accountSettingsFormData: {
			flagCaptionsDefaultOff: false,
			flagAutoCaptionsDefaultOn: false,
			flagDisableInlinePreview: false,
			flagAudioDescriptionDefaultOn: false
		} };
		if (this.#data.browseId === "FEwhat_to_watch") {
			if (this.#data.browseRequestSupportedMetadata) request.browseRequestSupportedMetadata = this.#data.browseRequestSupportedMetadata;
			if (this.#data.inlineSettingStatus) request.inlineSettingStatus = this.#data.inlineSettingStatus;
		}
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/CreateCommentEndpoint.js
var API_PATH$16 = "comment/create_comment";
var CreateCommentEndpoint = class extends YTNode {
	static type = "CreateCommentEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$16;
	}
	buildRequest() {
		const request = {};
		if (this.#data.createCommentParams) request.createCommentParams = this.#data.createCommentParams;
		if (this.#data.commentText) request.commentText = this.#data.commentText;
		if (this.#data.attachedVideoId) request.videoAttachment = { videoId: this.#data.attachedVideoId };
		else if (this.#data.pollOptions) request.pollAttachment = { choices: this.#data.pollOptions };
		else if (this.#data.imageBlobId) request.imageAttachment = { encryptedBlobId: this.#data.imageBlobId };
		else if (this.#data.sharedPostId) request.sharedPostAttachment = { postId: this.#data.sharedPostId };
		if (this.#data.accessRestrictions && typeof this.#data.accessRestrictions === "number") request.accessRestrictions = { restriction: this.#data.accessRestrictions === 1 ? "RESTRICTION_TYPE_EVERYONE" : "RESTRICTION_TYPE_SPONSORS_ONLY" };
		if (this.#data.botguardResponse) request.botguardResponse = this.#data.botguardResponse;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/CreatePlaylistServiceEndpoint.js
var API_PATH$15 = "playlist/create";
var CreatePlaylistServiceEndpoint = class extends YTNode {
	static type = "CreatePlaylistServiceEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$15;
	}
	buildRequest() {
		const request = {};
		if (this.#data.title) request.title = this.#data.title;
		if (this.#data.privacyStatus) request.privacyStatus = this.#data.privacyStatus;
		if (this.#data.description) request.description = this.#data.description;
		if (this.#data.videoIds) request.videoIds = this.#data.videoIds;
		if (this.#data.params) request.params = this.#data.params;
		if (this.#data.sourcePlaylistId) request.sourcePlaylistId = this.#data.sourcePlaylistId;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/DeletePlaylistEndpoint.js
var API_PATH$14 = "playlist/delete";
var DeletePlaylistEndpoint = class extends YTNode {
	static type = "DeletePlaylistEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$14;
	}
	buildRequest() {
		const request = {};
		if (this.#data.playlistId) request.playlistId = this.#data.sourcePlaylistId;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/FeedbackEndpoint.js
var API_PATH$13 = "feedback";
var FeedbackEndpoint = class extends YTNode {
	static type = "FeedbackEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$13;
	}
	buildRequest() {
		const request = {};
		if (this.#data.feedbackToken) request.feedbackTokens = [this.#data.feedbackToken];
		if (this.#data.cpn) request.feedbackContext = { cpn: this.#data.cpn };
		request.isFeedbackTokenUnencrypted = !!this.#data.isFeedbackTokenUnencrypted;
		request.shouldMerge = !!this.#data.shouldMerge;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/GetAccountsListInnertubeEndpoint.js
var API_PATH$12 = "account/accounts_list";
var GetAccountsListInnertubeEndpoint = class extends YTNode {
	static type = "GetAccountsListInnertubeEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$12;
	}
	buildRequest() {
		const request = {};
		if (this.#data.requestType) {
			request.requestType = this.#data.requestType;
			if (this.#data.requestType === "ACCOUNTS_LIST_REQUEST_TYPE_CHANNEL_SWITCHER" || this.#data.requestType === "ACCOUNTS_LIST_REQUEST_TYPE_IDENTITY_PROMPT") {
				if (this.#data.nextUrl) request.nextNavendpoint = { urlEndpoint: { url: this.#data.nextUrl } };
			}
		}
		if (this.#data.channelSwitcherQuery) request.channelSwitcherQuery = this.#data.channelSwitcherQuery;
		if (this.#data.triggerChannelCreation) request.triggerChannelCreation = this.#data.triggerChannelCreation;
		if (this.#data.contentOwnerConfig && this.#data.contentOwnerConfig.externalContentOwnerId) request.contentOwnerConfig = this.#data.contentOwnerConfig;
		if (this.#data.obfuscatedSelectedGaiaId) request.obfuscatedSelectedGaiaId = this.#data.obfuscatedSelectedGaiaId;
		if (this.#data.selectedSerializedDelegationContext) request.selectedSerializedDelegationContext = this.#data.selectedSerializedDelegationContext;
		if (this.#data.callCircumstance) request.callCircumstance = this.#data.callCircumstance;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/HideEngagementPanelEndpoint.js
var HideEngagementPanelEndpoint = class extends YTNode {
	static type = "HideEngagementPanelEndpoint";
	panel_identifier;
	constructor(data) {
		super();
		this.panel_identifier = data.panelIdentifier;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/LikeEndpoint.js
var LIKE_API_PATH = "like/like";
var DISLIKE_API_PATH = "like/dislike";
var REMOVE_LIKE_API_PATH = "like/removelike";
var LikeEndpoint = class extends YTNode {
	static type = "LikeEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return this.#data.status === "DISLIKE" ? DISLIKE_API_PATH : this.#data.status === "INDIFFERENT" ? REMOVE_LIKE_API_PATH : LIKE_API_PATH;
	}
	buildRequest() {
		const request = {};
		if (this.#data.target) request.target = this.#data.target;
		const params = this.getParams();
		if (params) request.params = params;
		return request;
	}
	getParams() {
		switch (this.#data.status) {
			case "LIKE": return this.#data.likeParams;
			case "DISLIKE": return this.#data.dislikeParams;
			case "INDIFFERENT": return this.#data.removeLikeParams;
			default: return;
		}
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/LiveChatItemContextMenuEndpoint.js
var API_PATH$11 = "live_chat/get_item_context_menu";
var LiveChatItemContextMenuEndpoint = class extends YTNode {
	static type = "LiveChatItemContextMenuEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$11;
	}
	buildRequest() {
		const request = {};
		if (this.#data.params) request.params = this.#data.params;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/ModifyChannelNotificationPreferenceEndpoint.js
var API_PATH$10 = "notification/modify_channel_preference";
var ModifyChannelNotificationPreferenceEndpoint = class extends YTNode {
	static type = "ModifyChannelNotificationPreferenceEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$10;
	}
	buildRequest() {
		const request = {};
		if (this.#data.params) request.params = this.#data.params;
		if (this.#data.secondaryParams) request.secondaryParams = this.#data.secondaryParams;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/PerformCommentActionEndpoint.js
var API_PATH$9 = "comment/perform_comment_action";
var PerformCommentActionEndpoint = class extends YTNode {
	static type = "PerformCommentActionEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$9;
	}
	buildRequest() {
		const request = {};
		if (this.#data.actions) request.actions = this.#data.actions;
		if (this.#data.action) request.actions = [this.#data.action];
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/PlaylistEditEndpoint.js
var API_PATH$8 = "browse/edit_playlist";
var PlaylistEditEndpoint = class extends YTNode {
	static type = "PlaylistEditEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$8;
	}
	buildRequest() {
		const request = {};
		if (this.#data.actions) request.actions = this.#data.actions;
		if (this.#data.playlistId) request.playlistId = this.#data.playlistId;
		if (this.#data.params) request.params = this.#data.params;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/WatchEndpoint.js
var API_PATH$7 = "player";
var WatchEndpoint = class extends YTNode {
	static type = "WatchEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$7;
	}
	buildRequest() {
		const request = {};
		if (this.#data.videoId) request.videoId = this.#data.videoId;
		if (this.#data.playlistId) request.playlistId = this.#data.playlistId;
		if (this.#data.index !== void 0 || this.#data.playlistIndex !== void 0) request.playlistIndex = this.#data.index || this.#data.playlistIndex;
		if (this.#data.playerParams || this.#data.params) request.params = this.#data.playerParams || this.#data.params;
		if (this.#data.startTimeSeconds) request.startTimeSecs = this.#data.startTimeSeconds;
		if (this.#data.overrideMutedAtStart) request.overrideMutedAtStart = this.#data.overrideMutedAtStart;
		request.racyCheckOk = !!this.#data.racyCheckOk;
		request.contentCheckOk = !!this.#data.contentCheckOk;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/PrefetchWatchCommand.js
var PrefetchWatchCommand = class extends WatchEndpoint {
	static type = "PrefetchWatchCommand";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/ReelWatchEndpoint.js
var API_PATH$6 = "reel/reel_item_watch";
var ReelWatchEndpoint = class extends YTNode {
	static type = "ReelWatchEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$6;
	}
	buildRequest() {
		const request = {};
		if (this.#data.videoId) request.playerRequest = { videoId: this.#data.videoId };
		if (request.playerRequest) {
			if (this.#data.playerParams) request.playerRequest.params = this.#data.playerParams;
			if (this.#data.racyCheckOk) request.playerRequest.racyCheckOk = !!this.#data.racyCheckOk;
			if (this.#data.contentCheckOk) request.playerRequest.contentCheckOk = !!this.#data.contentCheckOk;
		}
		if (this.#data.params) request.params = this.#data.params;
		if (this.#data.inputType) request.inputType = this.#data.inputType;
		request.disablePlayerResponse = !!this.#data.disablePlayerResponse;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/SearchEndpoint.js
var API_PATH$5 = "search";
var SearchEndpoint = class extends YTNode {
	static type = "SearchEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$5;
	}
	buildRequest() {
		const request = {};
		if (this.#data.query) request.query = this.#data.query;
		if (this.#data.params) request.params = this.#data.params;
		if (this.#data.webSearchboxStatsUrl) request.webSearchboxStatsUrl = this.#data.webSearchboxStatsUrl;
		if (this.#data.suggestStats) request.suggestStats = this.#data.suggestStats;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/ShareEntityServiceEndpoint.js
var API_PATH$4 = "share/get_share_panel";
var ShareEntityServiceEndpoint = class extends YTNode {
	static type = "ShareEntityServiceEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$4;
	}
	buildRequest() {
		const request = {};
		if (this.#data.serializedShareEntity) request.serializedSharedEntity = this.#data.serializedShareEntity;
		if (this.#data.clientParams) request.clientParams = this.#data.clientParams;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/ShareEndpoint.js
var ShareEndpoint = class extends ShareEntityServiceEndpoint {
	static type = "ShareEndpoint";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/ShareEntityEndpoint.js
var ShareEntityEndpoint = class extends ShareEntityServiceEndpoint {
	static type = "ShareEntityEndpoint";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/ShowEngagementPanelEndpoint.js
var API_PATH$3 = "get_panel";
var ShowEngagementPanelEndpoint = class extends YTNode {
	static type = "ShowEngagementPanelEndpoint";
	#data;
	panel_identifier;
	source_panel_identifier;
	constructor(data) {
		super();
		this.#data = data;
		this.panel_identifier = data.panelIdentifier;
		this.source_panel_identifier = data.sourcePanelIdentifier;
	}
	getApiPath() {
		return API_PATH$3;
	}
	buildRequest() {
		const request = {};
		const panelId = this.#data.panelIdentifier || this.#data.identifier?.tag;
		if (panelId) request.panelId = panelId;
		if (this.#data.globalConfiguration?.params) request.params = this.#data.globalConfiguration?.params;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/SignalServiceEndpoint.js
var SignalServiceEndpoint = class extends YTNode {
	static type = "SignalServiceEndpoint";
	actions;
	signal;
	constructor(data) {
		super();
		if (Array.isArray(data.actions)) this.actions = parseArray(data.actions.map((action) => {
			delete action.clickTrackingParams;
			return action;
		}));
		this.signal = data.signal;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/SubscribeEndpoint.js
var API_PATH$2 = "subscription/subscribe";
var SubscribeEndpoint = class extends YTNode {
	static type = "SubscribeEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$2;
	}
	buildRequest() {
		const request = {};
		if (this.#data.channelIds) request.channelIds = this.#data.channelIds;
		if (this.#data.siloName) request.siloName = this.#data.siloName;
		if (this.#data.params) request.params = this.#data.params;
		if (this.#data.botguardResponse) request.botguardResponse = this.#data.botguardResponse;
		if (this.#data.feature) request.clientFeature = this.#data.feature;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/UnsubscribeEndpoint.js
var API_PATH$1 = "subscription/unsubscribe";
var UnsubscribeEndpoint = class extends YTNode {
	static type = "UnsubscribeEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH$1;
	}
	buildRequest() {
		const request = {};
		if (this.#data.channelIds) request.channelIds = this.#data.channelIds;
		if (this.#data.siloName) request.siloName = this.#data.siloName;
		if (this.#data.params) request.params = this.#data.params;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/endpoints/WatchNextEndpoint.js
var API_PATH = "next";
var WatchNextEndpoint = class extends YTNode {
	static type = "WatchNextEndpoint";
	#data;
	constructor(data) {
		super();
		this.#data = data;
	}
	getApiPath() {
		return API_PATH;
	}
	buildRequest() {
		const request = {};
		if (this.#data.videoId) request.videoId = this.#data.videoId;
		if (this.#data.playlistId) request.playlistId = this.#data.playlistId;
		if (this.#data.index !== void 0 || this.#data.playlistIndex !== void 0) request.playlistIndex = this.#data.index || this.#data.playlistIndex;
		if (this.#data.playerParams || this.#data.params) request.params = this.#data.playerParams || this.#data.params;
		request.racyCheckOk = !!this.#data.racyCheckOk;
		request.contentCheckOk = !!this.#data.contentCheckOk;
		return request;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Endscreen.js
var Endscreen = class extends YTNode {
	static type = "Endscreen";
	elements;
	start_ms;
	constructor(data) {
		super();
		this.elements = parseArray(data.elements);
		this.start_ms = data.startMs;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EndscreenElement.js
var EndscreenElement = class extends YTNode {
	static type = "EndscreenElement";
	style;
	title;
	endpoint;
	image;
	icon;
	metadata;
	call_to_action;
	hovercard_button;
	is_subscribe;
	playlist_length;
	thumbnail_overlays;
	left;
	top;
	width;
	aspect_ratio;
	start_ms;
	end_ms;
	id;
	constructor(data) {
		super();
		this.style = data.style;
		this.title = new Text$1(data.title);
		this.endpoint = new NavigationEndpoint(data.endpoint);
		if (Reflect.has(data, "image")) this.image = Thumbnail.fromResponse(data.image);
		if (Reflect.has(data, "icon")) this.icon = Thumbnail.fromResponse(data.icon);
		if (Reflect.has(data, "metadata")) this.metadata = new Text$1(data.metadata);
		if (Reflect.has(data, "callToAction")) this.call_to_action = new Text$1(data.callToAction);
		if (Reflect.has(data, "hovercardButton")) this.hovercard_button = parseItem(data.hovercardButton);
		if (Reflect.has(data, "isSubscribe")) this.is_subscribe = !!data.isSubscribe;
		if (Reflect.has(data, "playlistLength")) this.playlist_length = new Text$1(data.playlistLength);
		if (Reflect.has(data, "thumbnailOverlays")) this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		this.left = parseFloat(data.left);
		this.width = parseFloat(data.width);
		this.top = parseFloat(data.top);
		this.aspect_ratio = parseFloat(data.aspectRatio);
		this.start_ms = parseFloat(data.startMs);
		this.end_ms = parseFloat(data.endMs);
		this.id = data.id;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EndScreenPlaylist.js
var EndScreenPlaylist = class extends YTNode {
	static type = "EndScreenPlaylist";
	id;
	title;
	author;
	endpoint;
	thumbnails;
	video_count;
	constructor(data) {
		super();
		this.id = data.playlistId;
		this.title = new Text$1(data.title);
		this.author = new Text$1(data.longBylineText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.video_count = new Text$1(data.videoCountText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/EndScreenVideo.js
var EndScreenVideo = class extends YTNode {
	static type = "EndScreenVideo";
	id;
	title;
	thumbnails;
	thumbnail_overlays;
	author;
	endpoint;
	short_view_count;
	badges;
	duration;
	constructor(data) {
		super();
		this.id = data.videoId;
		this.title = new Text$1(data.title);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		this.author = new Author(data.shortBylineText, data.ownerBadges);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.short_view_count = new Text$1(data.shortViewCountText);
		this.badges = parseArray(data.badges);
		this.duration = {
			text: new Text$1(data.lengthText).toString(),
			seconds: data.lengthInSeconds
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ExpandableTab.js
var ExpandableTab = class extends YTNode {
	static type = "ExpandableTab";
	title;
	endpoint;
	selected;
	content;
	constructor(data) {
		super();
		this.title = data.title;
		this.endpoint = new NavigationEndpoint(data.endpoint);
		this.selected = data.selected;
		this.content = parseItem(data.content);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ExpandedShelfContents.js
var ExpandedShelfContents = class extends YTNode {
	static type = "ExpandedShelfContents";
	items;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/FancyDismissibleDialog.js
var FancyDismissibleDialog = class extends YTNode {
	static type = "FancyDismissibleDialog";
	dialog_message;
	confirm_label;
	constructor(data) {
		super();
		this.dialog_message = new Text$1(data.dialogMessage);
		this.confirm_label = new Text$1(data.confirmLabel);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/FeedFilterChipBar.js
var FeedFilterChipBar = class extends YTNode {
	static type = "FeedFilterChipBar";
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents, ChipCloudChip);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/FeedNudge.js
var FeedNudge = class extends YTNode {
	static type = "FeedNudge";
	title;
	subtitle;
	endpoint;
	apply_modernized_style;
	trim_style;
	background_style;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
		this.endpoint = new NavigationEndpoint(data.impressionEndpoint);
		this.apply_modernized_style = data.applyModernizedStyle;
		this.trim_style = data.trimStyle;
		this.background_style = data.backgroundStyle;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/FeedTabbedHeader.js
var FeedTabbedHeader = class extends YTNode {
	static type = "FeedTabbedHeader";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ToggleFormField.js
var ToggleFormField = class extends YTNode {
	static type = "ToggleFormField";
	label;
	toggled;
	toggle_on_action;
	toggle_off_action;
	constructor(data) {
		super();
		this.label = new Text(data.label);
		this.toggled = data.toggled;
		if ("toggleOnAction" in data) this.toggle_on_action = new NavigationEndpoint(data.toggleOnAction);
		if ("toggleOffAction" in data) this.toggle_off_action = new NavigationEndpoint(data.toggleOffAction);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Form.js
var Form = class extends YTNode {
	static type = "Form";
	fields;
	constructor(data) {
		super();
		this.fields = parseArray(data.fields, ToggleFormField);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/FormPopup.js
var FormPopup = class extends YTNode {
	static type = "FormPopup";
	title;
	form;
	buttons;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.form = parseItem(data.form, Form);
		this.buttons = parseArray(data.buttons, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GameDetails.js
var GameDetails = class extends YTNode {
	static type = "GameDetails";
	title;
	box_art;
	box_art_overlay_text;
	endpoint;
	is_official_box_art;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.box_art = Thumbnail.fromResponse(data.boxArt);
		this.box_art_overlay_text = new Text$1(data.boxArtOverlayText);
		this.endpoint = new NavigationEndpoint(data.endpoint);
		this.is_official_box_art = !!data.isOfficialBoxArt;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Grid.js
var Grid = class extends YTNode {
	static type = "Grid";
	items;
	is_collapsible;
	visible_row_count;
	target_id;
	continuation;
	header;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
		if (Reflect.has(data, "header")) this.header = parseItem(data.header);
		if (Reflect.has(data, "isCollapsible")) this.is_collapsible = data.isCollapsible;
		if (Reflect.has(data, "visibleRowCount")) this.visible_row_count = data.visibleRowCount;
		if (Reflect.has(data, "targetId")) this.target_id = data.targetId;
		this.continuation = data.continuations?.[0]?.nextContinuationData?.continuation || null;
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GridChannel.js
var GridChannel = class extends YTNode {
	static type = "GridChannel";
	id;
	author;
	subscribers;
	video_count;
	endpoint;
	subscribe_button;
	constructor(data) {
		super();
		this.id = data.channelId;
		this.author = new Author({
			...data.title,
			navigationEndpoint: data.navigationEndpoint
		}, data.ownerBadges, data.thumbnail);
		this.subscribers = new Text$1(data.subscriberCountText);
		this.video_count = new Text$1(data.videoCountText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.subscribe_button = parseItem(data.subscribeButton);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GridHeader.js
var GridHeader = class extends YTNode {
	static type = "GridHeader";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GridMix.js
var GridMix = class extends YTNode {
	static type = "GridMix";
	id;
	title;
	author;
	thumbnails;
	video_count;
	video_count_short;
	endpoint;
	secondary_endpoint;
	thumbnail_overlays;
	constructor(data) {
		super();
		this.id = data.playlistId;
		this.title = new Text$1(data.title);
		this.author = data.shortBylineText?.simpleText ? new Text$1(data.shortBylineText) : data.longBylineText?.simpleText ? new Text$1(data.longBylineText) : null;
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.video_count = new Text$1(data.videoCountText);
		this.video_count_short = new Text$1(data.videoCountShortText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.secondary_endpoint = new NavigationEndpoint(data.secondaryNavigationEndpoint);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GridMovie.js
var GridMovie = class extends YTNode {
	static type = "GridMovie";
	id;
	title;
	thumbnails;
	duration;
	endpoint;
	badges;
	metadata;
	thumbnail_overlays;
	constructor(data) {
		super();
		const length_alt = data.thumbnailOverlays.find((overlay) => overlay.hasOwnProperty("thumbnailOverlayTimeStatusRenderer"))?.thumbnailOverlayTimeStatusRenderer;
		this.id = data.videoId;
		this.title = new Text$1(data.title);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.duration = data.lengthText ? new Text$1(data.lengthText) : length_alt?.text ? new Text$1(length_alt.text) : null;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.badges = parseArray(data.badges, MetadataBadge);
		this.metadata = new Text$1(data.metadata);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GridPlaylist.js
var GridPlaylist = class extends YTNode {
	static type = "GridPlaylist";
	id;
	title;
	author;
	badges;
	endpoint;
	view_playlist;
	thumbnails;
	thumbnail_renderer;
	sidebar_thumbnails;
	video_count;
	video_count_short;
	constructor(data) {
		super();
		this.id = data.playlistId;
		this.title = new Text$1(data.title);
		if (Reflect.has(data, "shortBylineText")) this.author = new Author(data.shortBylineText, data.ownerBadges);
		this.badges = parseArray(data.ownerBadges);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.view_playlist = new Text$1(data.viewPlaylistText);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.thumbnail_renderer = parseItem(data.thumbnailRenderer);
		this.sidebar_thumbnails = [].concat(...data.sidebarThumbnails?.map((thumbnail) => Thumbnail.fromResponse(thumbnail)) || []) || null;
		this.video_count = new Text$1(data.thumbnailText);
		this.video_count_short = new Text$1(data.videoCountShortText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GridShelfView.js
var GridShelfView = class extends YTNode {
	static type = "GridShelfView";
	contents;
	header;
	content_aspect_ratio;
	enable_vertical_expansion;
	show_more_button;
	show_less_button;
	min_collapsed_item_count;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
		this.header = parseItem(data.header);
		this.content_aspect_ratio = data.contentAspectRatio;
		this.enable_vertical_expansion = data.enableVerticalExpansion;
		this.show_more_button = parseItem(data.showMoreButton, ButtonView);
		this.show_less_button = parseItem(data.showLessButton, ButtonView);
		this.min_collapsed_item_count = data.minCollapsedItemCount;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ShowCustomThumbnail.js
var ShowCustomThumbnail = class extends YTNode {
	static type = "ShowCustomThumbnail";
	thumbnail;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayBottomPanel.js
var ThumbnailOverlayBottomPanel = class extends YTNode {
	static type = "ThumbnailOverlayBottomPanel";
	text;
	icon_type;
	constructor(data) {
		super();
		if (Reflect.has(data, "text")) this.text = new Text$1(data.text);
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GridShow.js
var GridShow = class extends YTNode {
	static type = "GridShow";
	title;
	thumbnail_renderer;
	endpoint;
	long_byline_text;
	thumbnail_overlays;
	author;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.thumbnail_renderer = parseItem(data.thumbnailRenderer, ShowCustomThumbnail);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.long_byline_text = new Text$1(data.longBylineText);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays, ThumbnailOverlayBottomPanel);
		this.author = new Author(data.shortBylineText, void 0);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GridVideo.js
var GridVideo = class extends YTNode {
	static type = "GridVideo";
	video_id;
	title;
	thumbnails;
	thumbnail_overlays;
	rich_thumbnail;
	published;
	duration;
	author;
	views;
	short_view_count;
	endpoint;
	menu;
	buttons;
	upcoming;
	upcoming_text;
	is_reminder_set;
	constructor(data) {
		super();
		const length_alt = data.thumbnailOverlays.find((overlay) => overlay.hasOwnProperty("thumbnailOverlayTimeStatusRenderer"))?.thumbnailOverlayTimeStatusRenderer;
		this.video_id = data.videoId;
		this.title = new Text$1(data.title);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		this.rich_thumbnail = parseItem(data.richThumbnail);
		this.published = new Text$1(data.publishedTimeText);
		this.duration = data.lengthText ? new Text$1(data.lengthText) : length_alt?.text ? new Text$1(length_alt.text) : null;
		this.author = data.shortBylineText && new Author(data.shortBylineText, data.ownerBadges);
		this.views = new Text$1(data.viewCountText);
		this.short_view_count = new Text$1(data.shortViewCountText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.menu = parseItem(data.menu, Menu);
		if (Reflect.has(data, "buttons")) this.buttons = parseArray(data.buttons);
		if (Reflect.has(data, "upcomingEventData")) {
			this.upcoming = new Date(Number(`${data.upcomingEventData.startTime}000`));
			this.upcoming_text = new Text$1(data.upcomingEventData.upcomingEventText);
			this.is_reminder_set = !!data.upcomingEventData?.isReminderSet;
		}
	}
	/**
	* @deprecated Use {@linkcode video_id} instead.
	*/
	get id() {
		return this.video_id;
	}
	get is_upcoming() {
		return Boolean(this.upcoming && this.upcoming > /* @__PURE__ */ new Date());
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GuideEntry.js
var GuideEntry = class extends YTNode {
	static type = "GuideEntry";
	title;
	endpoint;
	icon_type;
	thumbnails;
	badges;
	is_primary;
	constructor(data) {
		super();
		this.title = new Text$1(data.formattedTitle);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint || data.serviceEndpoint);
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
		if (Reflect.has(data, "thumbnail")) this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		if (Reflect.has(data, "badges")) this.badges = data.badges;
		this.is_primary = !!data.isPrimary;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GuideCollapsibleEntry.js
var GuideCollapsibleEntry = class extends YTNode {
	static type = "GuideCollapsibleEntry";
	expander_item;
	collapser_item;
	expandable_items;
	constructor(data) {
		super();
		this.expander_item = parseItem(data.expanderItem, GuideEntry);
		this.collapser_item = parseItem(data.collapserItem, GuideEntry);
		this.expandable_items = parseArray(data.expandableItems);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GuideCollapsibleSectionEntry.js
var GuideCollapsibleSectionEntry = class extends YTNode {
	static type = "GuideCollapsibleSectionEntry";
	header_entry;
	expander_icon;
	collapser_icon;
	section_items;
	constructor(data) {
		super();
		this.header_entry = parseItem(data.headerEntry);
		this.expander_icon = data.expanderIcon.iconType;
		this.collapser_icon = data.collapserIcon.iconType;
		this.section_items = parseArray(data.sectionItems);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GuideDownloadsEntry.js
var GuideDownloadsEntry = class extends GuideEntry {
	static type = "GuideDownloadsEntry";
	always_show;
	constructor(data) {
		super(data.entryRenderer.guideEntryRenderer);
		this.always_show = !!data.alwaysShow;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GuideSection.js
var GuideSection = class extends YTNode {
	static type = "GuideSection";
	title;
	items;
	constructor(data) {
		super();
		if (Reflect.has(data, "formattedTitle")) this.title = new Text$1(data.formattedTitle);
		this.items = parseArray(data.items);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/GuideSubscriptionsSection.js
var GuideSubscriptionsSection = class extends GuideSection {
	static type = "GuideSubscriptionsSection";
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HashtagHeader.js
var HashtagHeader = class extends YTNode {
	static type = "HashtagHeader";
	hashtag;
	hashtag_info;
	constructor(data) {
		super();
		this.hashtag = new Text$1(data.hashtag);
		this.hashtag_info = new Text$1(data.hashtagInfoText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HashtagTile.js
var HashtagTile = class extends YTNode {
	static type = "HashtagTile";
	hashtag;
	hashtag_info_text;
	hashtag_thumbnail;
	endpoint;
	hashtag_background_color;
	hashtag_video_count;
	hashtag_channel_count;
	constructor(data) {
		super();
		this.hashtag = new Text$1(data.hashtag);
		this.hashtag_info_text = new Text$1(data.hashtagInfoText);
		this.hashtag_thumbnail = Thumbnail.fromResponse(data.hashtagThumbnail);
		this.endpoint = new NavigationEndpoint(data.onTapCommand);
		this.hashtag_background_color = data.hashtagBackgroundColor;
		this.hashtag_video_count = new Text$1(data.hashtagVideoCount);
		this.hashtag_channel_count = new Text$1(data.hashtagChannelCount);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HeroPlaylistThumbnail.js
var HeroPlaylistThumbnail = class extends YTNode {
	static type = "HeroPlaylistThumbnail";
	thumbnails;
	on_tap_endpoint;
	constructor(data) {
		super();
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.on_tap_endpoint = new NavigationEndpoint(data.onTap);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HighlightsCarousel.js
var Panel$1 = class extends YTNode {
	static type = "Panel";
	thumbnail;
	background_image;
	strapline;
	title;
	description;
	text_on_tap_endpoint;
	cta;
	constructor(data) {
		super();
		if (data.thumbnail) this.thumbnail = {
			image: Thumbnail.fromResponse(data.thumbnail.image),
			endpoint: new NavigationEndpoint(data.thumbnail.onTap),
			on_long_press_endpoint: new NavigationEndpoint(data.thumbnail.onLongPress),
			content_mode: data.thumbnail.contentMode,
			crop_options: data.thumbnail.cropOptions
		};
		this.background_image = {
			image: Thumbnail.fromResponse(data.backgroundImage.image),
			gradient_image: Thumbnail.fromResponse(data.backgroundImage.gradientImage)
		};
		this.strapline = data.strapline;
		this.title = data.title;
		this.description = data.description;
		this.cta = {
			icon_name: data.cta.iconName,
			title: data.cta.title,
			endpoint: new NavigationEndpoint(data.cta.onTap),
			accessibility_text: data.cta.accessibilityText,
			state: data.cta.state
		};
		this.text_on_tap_endpoint = new NavigationEndpoint(data.textOnTap);
	}
};
var HighlightsCarousel = class extends YTNode {
	static type = "HighlightsCarousel";
	panels;
	constructor(data) {
		super();
		this.panels = observe(data.highlightsCarousel.panels.map((el) => new Panel$1(el)));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchSuggestion.js
var SearchSuggestion = class extends YTNode {
	static type = "SearchSuggestion";
	suggestion;
	endpoint;
	icon_type;
	service_endpoint;
	constructor(data) {
		super();
		this.suggestion = new Text$1(data.suggestion);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		if (Reflect.has(data, "icon")) this.icon_type = data.icon.iconType;
		if (Reflect.has(data, "serviceEndpoint")) this.service_endpoint = new NavigationEndpoint(data.serviceEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HistorySuggestion.js
var HistorySuggestion = class extends SearchSuggestion {
	static type = "HistorySuggestion";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/HorizontalMovieList.js
var HorizontalMovieList = class extends YTNode {
	static type = "HorizontalMovieList";
	items;
	previous_button;
	next_button;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
		this.previous_button = parseItem(data.previousButton, Button);
		this.next_button = parseItem(data.nextButton, Button);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/IconLink.js
var IconLink = class extends YTNode {
	static type = "IconLink";
	icon_type;
	tooltip;
	endpoint;
	constructor(data) {
		super();
		this.icon_type = data.icon?.iconType;
		if (Reflect.has(data, "tooltip")) this.tooltip = new Text$1(data.tooltip).toString();
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ImageBannerView.js
var ImageBannerView = class extends YTNode {
	static type = "ImageBannerView";
	image;
	style;
	constructor(data) {
		super();
		this.image = Thumbnail.fromResponse(data.image);
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/IncludingResultsFor.js
var IncludingResultsFor = class extends YTNode {
	static type = "IncludingResultsFor";
	including_results_for;
	corrected_query;
	corrected_query_endpoint;
	search_only_for;
	original_query;
	original_query_endpoint;
	constructor(data) {
		super();
		this.including_results_for = new Text$1(data.includingResultsFor);
		this.corrected_query = new Text$1(data.correctedQuery);
		this.corrected_query_endpoint = new NavigationEndpoint(data.correctedQueryEndpoint);
		this.search_only_for = Reflect.has(data, "searchOnlyFor") ? new Text$1(data.searchOnlyFor) : void 0;
		this.original_query = Reflect.has(data, "originalQuery") ? new Text$1(data.originalQuery) : void 0;
		this.original_query_endpoint = Reflect.has(data, "originalQueryEndpoint") ? new NavigationEndpoint(data.originalQueryEndpoint) : void 0;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/InfoPanelContent.js
var InfoPanelContent = class extends YTNode {
	static type = "InfoPanelContent";
	title;
	source;
	paragraphs;
	attributed_paragraphs;
	thumbnail;
	source_endpoint;
	truncate_paragraphs;
	background;
	inline_link_icon_type;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.source = new Text$1(data.source);
		if (Reflect.has(data, "paragraphs")) this.paragraphs = data.paragraphs.map((p) => new Text$1(p));
		if (Reflect.has(data, "attributedParagraphs")) this.attributed_paragraphs = data.attributedParagraphs.map((p) => Text$1.fromAttributed(p));
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.source_endpoint = new NavigationEndpoint(data.sourceEndpoint);
		this.truncate_paragraphs = !!data.truncateParagraphs;
		this.background = data.background;
		if (Reflect.has(data, "inlineLinkIcon") && Reflect.has(data.inlineLinkIcon, "iconType")) this.inline_link_icon_type = data.inlineLinkIcon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/InfoPanelContainer.js
var InfoPanelContainer = class extends YTNode {
	static type = "InfoPanelContainer";
	title;
	menu;
	content;
	header_endpoint;
	background;
	title_style;
	icon_type;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.menu = parseItem(data.menu, Menu);
		this.content = parseItem(data.content, InfoPanelContent);
		if (data.headerEndpoint) this.header_endpoint = new NavigationEndpoint(data.headerEndpoint);
		this.background = data.background;
		this.title_style = data.titleStyle;
		if (Reflect.has(data, "icon")) this.icon_type = data.icon?.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/InteractiveTabbedHeader.js
var InteractiveTabbedHeader = class extends YTNode {
	static type = "InteractiveTabbedHeader";
	header_type;
	title;
	description;
	metadata;
	badges;
	box_art;
	banner;
	buttons;
	auto_generated;
	constructor(data) {
		super();
		this.header_type = data.type;
		this.title = new Text$1(data.title);
		this.description = new Text$1(data.description);
		this.metadata = new Text$1(data.metadata);
		this.badges = parseArray(data.badges, MetadataBadge);
		this.box_art = Thumbnail.fromResponse(data.boxArt);
		this.banner = Thumbnail.fromResponse(data.banner);
		this.buttons = parseArray(data.buttons, [SubscribeButton, Button]);
		this.auto_generated = new Text$1(data.autoGenerated);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ItemSectionHeader.js
var ItemSectionHeader = class extends YTNode {
	static type = "ItemSectionHeader";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ItemSectionTab.js
var ItemSectionTab = class extends YTNode {
	static type = "Tab";
	title;
	selected;
	endpoint;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.selected = !!data.selected;
		this.endpoint = new NavigationEndpoint(data.endpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ItemSectionTabbedHeader.js
var ItemSectionTabbedHeader = class extends YTNode {
	static type = "ItemSectionTabbedHeader";
	title;
	tabs;
	end_items;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.tabs = parseArray(data.tabs, ItemSectionTab);
		if (Reflect.has(data, "endItems")) this.end_items = parseArray(data.endItems);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SortFilterHeader.js
var SortFilterHeader = class extends YTNode {
	static type = "SortFilterHeader";
	filter_menu;
	constructor(data) {
		super();
		this.filter_menu = parseItem(data.filterMenu, SortFilterSubMenu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RelatedChipCloud.js
var RelatedChipCloud = class extends YTNode {
	static type = "RelatedChipCloud";
	content;
	show_prominent_chips;
	constructor(data) {
		super();
		this.content = parseItem(data.content);
		this.show_prominent_chips = Boolean(data.showProminentChips);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ItemSection.js
var ItemSection = class extends YTNode {
	static type = "ItemSection";
	header;
	contents;
	target_id;
	continuation;
	constructor(data) {
		super();
		this.header = parseItem(data.header, [
			CommentsHeader,
			ItemSectionHeader,
			ItemSectionTabbedHeader,
			SortFilterHeader,
			FeedFilterChipBar,
			ChipBarView,
			RelatedChipCloud
		]);
		this.contents = parseArray(data.contents);
		if (data.targetId || data.sectionIdentifier) this.target_id = data.targetId || data.sectionIdentifier;
		if (data.continuations) this.continuation = data.continuations?.[0]?.nextContinuationData?.continuation;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LiveChat.js
var LiveChat$1 = class extends YTNode {
	static type = "LiveChat";
	header;
	initial_display_state;
	continuation;
	client_messages;
	is_replay;
	constructor(data) {
		super();
		this.header = parseItem(data.header);
		this.initial_display_state = data.initialDisplayState;
		this.continuation = data.continuations[0]?.reloadContinuationData?.continuation;
		this.client_messages = {
			reconnect_message: new Text$1(data.clientMessages.reconnectMessage),
			unable_to_reconnect_message: new Text$1(data.clientMessages.unableToReconnectMessage),
			fatal_error: new Text$1(data.clientMessages.fatalError),
			reconnected_message: new Text$1(data.clientMessages.reconnectedMessage),
			generic_error: new Text$1(data.clientMessages.genericError)
		};
		this.is_replay = !!data.isReplay;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatBannerHeader.js
var LiveChatBannerHeader = class extends YTNode {
	static type = "LiveChatBannerHeader";
	text;
	icon_type;
	context_menu_button;
	constructor(data) {
		super();
		this.text = new Text$1(data.text);
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
		this.context_menu_button = parseItem(data.contextMenuButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatBanner.js
var LiveChatBanner = class extends YTNode {
	static type = "LiveChatBanner";
	header;
	contents;
	action_id;
	viewer_is_creator;
	target_id;
	is_stackable;
	background_type;
	banner_type;
	banner_properties_is_ephemeral;
	banner_properties_auto_collapse_delay_seconds;
	constructor(data) {
		super();
		this.header = parseItem(data.header, LiveChatBannerHeader);
		this.contents = parseItem(data.contents);
		this.action_id = data.actionId;
		if (Reflect.has(data, "viewerIsCreator")) this.viewer_is_creator = data.viewerIsCreator;
		this.target_id = data.targetId;
		this.is_stackable = data.isStackable;
		if (Reflect.has(data, "backgroundType")) this.background_type = data.backgroundType;
		this.banner_type = data.bannerType;
		if (Reflect.has(data, "bannerProperties") && Reflect.has(data.bannerProperties, "isEphemeral")) this.banner_properties_is_ephemeral = Boolean(data.bannerProperties.isEphemeral);
		if (Reflect.has(data, "bannerProperties") && Reflect.has(data.bannerProperties, "autoCollapseDelay") && Reflect.has(data.bannerProperties.autoCollapseDelay, "seconds")) this.banner_properties_auto_collapse_delay_seconds = data.bannerProperties.autoCollapseDelay.seconds;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/AddBannerToLiveChatCommand.js
var AddBannerToLiveChatCommand = class extends YTNode {
	static type = "AddBannerToLiveChatCommand";
	banner;
	constructor(data) {
		super();
		this.banner = parseItem(data.bannerRenderer, LiveChatBanner);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/AddChatItemAction.js
var AddChatItemAction = class extends YTNode {
	static type = "AddChatItemAction";
	item;
	client_id;
	constructor(data) {
		super();
		this.item = parseItem(data.item);
		if (Reflect.has(data, "clientId")) this.client_id = data.clientId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/AddLiveChatTickerItemAction.js
var AddLiveChatTickerItemAction = class extends YTNode {
	static type = "AddLiveChatTickerItemAction";
	item;
	duration_sec;
	constructor(data) {
		super();
		this.item = parseItem(data.item);
		this.duration_sec = data.durationSec;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/DimChatItemAction.js
var DimChatItemAction = class extends YTNode {
	static type = "DimChatItemAction";
	client_assigned_id;
	constructor(data) {
		super();
		this.client_assigned_id = data.clientAssignedId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/BumperUserEduContentView.js
var BumperUserEduContentView = class extends YTNode {
	static type = "BumperUserEduContentView";
	text;
	image_name;
	image_color;
	constructor(data) {
		super();
		this.text = Text$1.fromAttributed(data.text);
		this.image_name = data.image.sources[0].clientResource.imageName;
		this.image_color = data.image.sources[0].clientResource.imageColor;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/CreatorHeartView.js
var CreatorHeartView = class extends YTNode {
	static type = "CreatorHeartView";
	creator_thumbnail;
	hearted_icon_name;
	unhearted_icon_name;
	unhearted_icon_processor;
	hearted_hover_text;
	hearted_accessibility_label;
	unhearted_accessibility_label;
	engagement_state_key;
	constructor(data) {
		super();
		this.creator_thumbnail = Thumbnail.fromResponse(data.creatorThumbnail);
		this.hearted_icon_name = data.heartedIcon.sources[0].clientResource.imageName;
		this.unhearted_icon_name = data.unheartedIcon.sources[0].clientResource.imageName;
		this.unhearted_icon_processor = { border_image_processor: { image_tint: { color: data.unheartedIcon.processor.borderImageProcessor.imageTint.color } } };
		this.hearted_hover_text = data.heartedHoverText;
		this.hearted_accessibility_label = data.heartedAccessibilityLabel;
		this.unhearted_accessibility_label = data.unheartedAccessibilityLabel;
		this.engagement_state_key = data.engagementStateKey;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatAutoModMessage.js
var LiveChatAutoModMessage = class extends YTNode {
	static type = "LiveChatAutoModMessage";
	menu_endpoint;
	moderation_buttons;
	auto_moderated_item;
	header_text;
	timestamp;
	id;
	constructor(data) {
		super();
		this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
		this.moderation_buttons = parseArray(data.moderationButtons, Button);
		this.auto_moderated_item = parseItem(data.autoModeratedItem);
		this.header_text = new Text$1(data.headerText);
		this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
		this.id = data.id;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatBannerChatSummary.js
var LiveChatBannerChatSummary = class extends YTNode {
	static type = "LiveChatBannerChatSummary";
	id;
	chat_summary;
	icon_type;
	like_feedback_button;
	dislike_feedback_button;
	constructor(data) {
		super();
		this.id = data.liveChatSummaryId;
		this.chat_summary = new Text$1(data.chatSummary);
		this.icon_type = data.icon.iconType;
		this.like_feedback_button = parseItem(data.likeFeedbackButton, ToggleButtonView);
		this.dislike_feedback_button = parseItem(data.dislikeFeedbackButton, ToggleButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatBannerPoll.js
var LiveChatBannerPoll = class extends YTNode {
	static type = "LiveChatBannerPoll";
	poll_question;
	author_photo;
	choices;
	collapsed_state_entity_key;
	live_chat_poll_state_entity_key;
	context_menu_button;
	constructor(data) {
		super();
		this.poll_question = new Text$1(data.pollQuestion);
		this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
		this.choices = data.pollChoices.map((choice) => ({
			option_id: choice.pollOptionId,
			text: new Text$1(choice.text).toString()
		}));
		this.collapsed_state_entity_key = data.collapsedStateEntityKey;
		this.live_chat_poll_state_entity_key = data.liveChatPollStateEntityKey;
		this.context_menu_button = parseItem(data.contextMenuButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatBannerRedirect.js
var LiveChatBannerRedirect = class extends YTNode {
	static type = "LiveChatBannerRedirect";
	banner_message;
	author_photo;
	inline_action_button;
	context_menu_button;
	constructor(data) {
		super();
		this.banner_message = new Text$1(data.bannerMessage);
		this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
		this.inline_action_button = parseItem(data.inlineActionButton, Button);
		this.context_menu_button = parseItem(data.contextMenuButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatItemBumperView.js
var LiveChatItemBumperView = class extends YTNode {
	static type = "LiveChatItemBumperView";
	content;
	constructor(data) {
		super();
		this.content = parseItem(data.content, BumperUserEduContentView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatMembershipItem.js
var LiveChatMembershipItem = class extends YTNode {
	static type = "LiveChatMembershipItem";
	id;
	timestamp;
	timestamp_usec;
	timestamp_text;
	header_primary_text;
	header_subtext;
	message;
	author;
	menu_endpoint;
	context_menu_accessibility_label;
	constructor(data) {
		super();
		this.id = data.id;
		this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
		this.timestamp_usec = data.timestampUsec;
		if (Reflect.has(data, "timestampText")) this.timestamp_text = new Text$1(data.timestampText);
		if (Reflect.has(data, "headerPrimaryText")) this.header_primary_text = new Text$1(data.headerPrimaryText);
		this.header_subtext = new Text$1(data.headerSubtext);
		if (Reflect.has(data, "message")) this.message = new Text$1(data.message);
		this.author = new Author(data.authorName, data.authorBadges, data.authorPhoto, data.authorExternalChannelId);
		this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
		this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatModeChangeMessage.js
var LiveChatModeChangeMessage = class extends YTNode {
	static type = "LiveChatModeChangeMessage";
	id;
	icon_type;
	text;
	subtext;
	timestamp;
	timestamp_usec;
	timestamp_text;
	constructor(data) {
		super();
		this.id = data.id;
		this.icon_type = data.icon.iconType;
		this.text = new Text$1(data.text);
		this.subtext = new Text$1(data.subtext);
		this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
		this.timestamp_usec = data.timestampUsec;
		this.timestamp_text = new Text$1(data.timestampText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/PdgReplyButtonView.js
var PdgReplyButtonView = class extends YTNode {
	static type = "PdgReplyButtonView";
	reply_button;
	reply_count_entity_key;
	reply_count_placeholder;
	constructor(data) {
		super();
		this.reply_button = parseItem(data.replyButton, ButtonView);
		this.reply_count_entity_key = data.replyCountEntityKey;
		this.reply_count_placeholder = Text$1.fromAttributed(data.replyCountPlaceholder);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatPaidMessage.js
var LiveChatPaidMessage = class extends YTNode {
	static type = "LiveChatPaidMessage";
	id;
	message;
	author;
	author_name_text_color;
	header_background_color;
	header_text_color;
	body_background_color;
	body_text_color;
	purchase_amount;
	menu_endpoint;
	context_menu_accessibility_label;
	timestamp;
	timestamp_usec;
	timestamp_text;
	timestamp_color;
	header_overlay_image;
	text_input_background_color;
	lower_bumper;
	creator_heart_button;
	is_v2_style;
	reply_button;
	constructor(data) {
		super();
		this.id = data.id;
		this.message = new Text$1(data.message);
		this.author = new Author(data.authorName, data.authorBadges, data.authorPhoto, data.authorExternalChannelId);
		this.author_name_text_color = data.authorNameTextColor;
		this.header_background_color = data.headerBackgroundColor;
		this.header_text_color = data.headerTextColor;
		this.body_background_color = data.bodyBackgroundColor;
		this.body_text_color = data.bodyTextColor;
		this.purchase_amount = new Text$1(data.purchaseAmountText).toString();
		this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
		this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
		this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
		this.timestamp_usec = data.timestampUsec;
		if (Reflect.has(data, "timestampText")) this.timestamp_text = new Text$1(data.timestampText).toString();
		this.timestamp_color = data.timestampColor;
		if (Reflect.has(data, "headerOverlayImage")) this.header_overlay_image = Thumbnail.fromResponse(data.headerOverlayImage);
		this.text_input_background_color = data.textInputBackgroundColor;
		this.lower_bumper = parseItem(data.lowerBumper, LiveChatItemBumperView);
		this.creator_heart_button = parseItem(data.creatorHeartButton, CreatorHeartView);
		this.is_v2_style = data.isV2Style;
		this.reply_button = parseItem(data.replyButton, PdgReplyButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatPaidSticker.js
var LiveChatPaidSticker = class extends YTNode {
	static type = "LiveChatPaidSticker";
	id;
	author;
	money_chip_background_color;
	money_chip_text_color;
	background_color;
	author_name_text_color;
	sticker;
	sticker_accessibility_label;
	sticker_display_width;
	sticker_display_height;
	purchase_amount;
	menu_endpoint;
	context_menu;
	context_menu_accessibility_label;
	timestamp;
	timestamp_usec;
	is_v2_style;
	constructor(data) {
		super();
		this.id = data.id;
		this.author = new Author(data.authorName, data.authorBadges, data.authorPhoto, data.authorExternalChannelId);
		this.money_chip_background_color = data.moneyChipBackgroundColor;
		this.money_chip_text_color = data.moneyChipTextColor;
		this.background_color = data.backgroundColor;
		this.author_name_text_color = data.authorNameTextColor;
		this.sticker = Thumbnail.fromResponse(data.sticker);
		this.sticker_accessibility_label = data.sticker.accessibility.accessibilityData.label;
		this.sticker_display_width = data.stickerDisplayWidth;
		this.sticker_display_height = data.stickerDisplayHeight;
		this.purchase_amount = new Text$1(data.purchaseAmountText).toString();
		this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
		this.context_menu = this.menu_endpoint;
		this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
		this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
		this.timestamp_usec = data.timestampUsec;
		this.is_v2_style = data.isV2Style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatPlaceholderItem.js
var LiveChatPlaceholderItem = class extends YTNode {
	static type = "LiveChatPlaceholderItem";
	id;
	timestamp;
	constructor(data) {
		super();
		this.id = data.id;
		this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatProductItem.js
var LiveChatProductItem = class extends YTNode {
	static type = "LiveChatProductItem";
	title;
	accessibility_title;
	thumbnail;
	price;
	vendor_name;
	from_vendor_text;
	information_button;
	endpoint;
	creator_message;
	creator_name;
	author_photo;
	information_dialog;
	is_verified;
	creator_custom_message;
	constructor(data) {
		super();
		this.title = data.title;
		this.accessibility_title = data.accessibilityTitle;
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.price = data.price;
		this.vendor_name = data.vendorName;
		this.from_vendor_text = data.fromVendorText;
		this.information_button = parseItem(data.informationButton);
		this.endpoint = new NavigationEndpoint(data.onClickCommand);
		this.creator_message = data.creatorMessage;
		this.creator_name = data.creatorName;
		this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
		this.information_dialog = parseItem(data.informationDialog);
		this.is_verified = data.isVerified;
		this.creator_custom_message = new Text$1(data.creatorCustomMessage);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatRestrictedParticipation.js
var LiveChatRestrictedParticipation = class extends YTNode {
	static type = "LiveChatRestrictedParticipation";
	message;
	icon_type;
	constructor(data) {
		super();
		this.message = new Text$1(data.message);
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LiveChatAuthorBadge.js
var LiveChatAuthorBadge = class extends MetadataBadge {
	static type = "LiveChatAuthorBadge";
	custom_thumbnail;
	constructor(data) {
		super(data);
		this.custom_thumbnail = Thumbnail.fromResponse(data.customThumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatSponsorshipsHeader.js
var LiveChatSponsorshipsHeader = class extends YTNode {
	static type = "LiveChatSponsorshipsHeader";
	author_name;
	author_photo;
	author_badges;
	primary_text;
	menu_endpoint;
	context_menu_accessibility_label;
	image;
	constructor(data) {
		super();
		this.author_name = new Text$1(data.authorName);
		this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
		this.author_badges = parseArray(data.authorBadges, LiveChatAuthorBadge);
		this.primary_text = new Text$1(data.primaryText);
		this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
		this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
		this.image = Thumbnail.fromResponse(data.image);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatSponsorshipsGiftPurchaseAnnouncement.js
var LiveChatSponsorshipsGiftPurchaseAnnouncement = class extends YTNode {
	static type = "LiveChatSponsorshipsGiftPurchaseAnnouncement";
	id;
	timestamp_usec;
	author_external_channel_id;
	header;
	constructor(data) {
		super();
		this.id = data.id;
		this.timestamp_usec = data.timestampUsec;
		this.author_external_channel_id = data.authorExternalChannelId;
		this.header = parseItem(data.header, LiveChatSponsorshipsHeader);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatSponsorshipsGiftRedemptionAnnouncement.js
var LiveChatSponsorshipsGiftRedemptionAnnouncement = class extends YTNode {
	static type = "LiveChatSponsorshipsGiftRedemptionAnnouncement";
	id;
	timestamp_usec;
	timestamp_text;
	author;
	message;
	menu_endpoint;
	context_menu_accessibility_label;
	constructor(data) {
		super();
		this.id = data.id;
		this.timestamp_usec = data.timestampUsec;
		this.timestamp_text = new Text$1(data.timestampText);
		this.author = new Author(data.authorName, data.authorBadges, data.authorPhoto, data.authorExternalChannelId);
		this.message = new Text$1(data.message);
		this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
		this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatTextMessage.js
var LiveChatTextMessage = class extends YTNode {
	static type = "LiveChatTextMessage";
	id;
	message;
	inline_action_buttons;
	timestamp;
	timestamp_usec;
	timestamp_text;
	author;
	menu_endpoint;
	context_menu_accessibility_label;
	before_content_buttons;
	constructor(data) {
		super();
		this.id = data.id;
		this.message = new Text$1(data.message);
		this.inline_action_buttons = parseArray(data.inlineActionButtons, Button);
		this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
		this.timestamp_usec = data.timestampUsec;
		if (Reflect.has(data, "timestampText")) this.timestamp_text = new Text$1(data.timestampText).toString();
		this.author = new Author(data.authorName, data.authorBadges, data.authorPhoto, data.authorExternalChannelId);
		if (Reflect.has(data, "contextMenuEndpoint")) this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
		if (Reflect.has(data, "contextMenuAccessibility") && Reflect.has(data.contextMenuAccessibility, "accessibilityData") && Reflect.has(data.contextMenuAccessibility.accessibilityData, "label")) this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
		this.before_content_buttons = parseArray(data.beforeContentButtons, ButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatTickerPaidMessageItem.js
var LiveChatTickerPaidMessageItem = class extends YTNode {
	static type = "LiveChatTickerPaidMessageItem";
	id;
	author;
	amount;
	amount_text_color;
	start_background_color;
	end_background_color;
	duration_sec;
	full_duration_sec;
	show_item;
	show_item_endpoint;
	animation_origin;
	open_engagement_panel_command;
	constructor(data) {
		super();
		this.id = data.id;
		this.author = new Author(data.authorName || data.authorUsername, data.authorBadges, data.authorPhoto, data.authorExternalChannelId);
		if (Reflect.has(data, "amount")) this.amount = new Text$1(data.amount);
		this.amount_text_color = data.amountTextColor;
		this.start_background_color = data.startBackgroundColor;
		this.end_background_color = data.endBackgroundColor;
		this.duration_sec = data.durationSec;
		this.full_duration_sec = data.fullDurationSec;
		this.show_item = parseItem(data.showItemEndpoint?.showLiveChatItemEndpoint?.renderer);
		this.show_item_endpoint = new NavigationEndpoint(data.showItemEndpoint);
		this.animation_origin = data.animationOrigin;
		this.open_engagement_panel_command = new NavigationEndpoint(data.openEngagementPanelCommand);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatTickerPaidStickerItem.js
var LiveChatTickerPaidStickerItem = class extends YTNode {
	static type = "LiveChatTickerPaidStickerItem";
	id;
	author_external_channel_id;
	author_photo;
	start_background_color;
	end_background_color;
	duration_sec;
	full_duration_sec;
	show_item;
	show_item_endpoint;
	ticker_thumbnails;
	constructor(data) {
		super();
		this.id = data.id;
		this.author_external_channel_id = data.authorExternalChannelId;
		this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
		this.start_background_color = data.startBackgroundColor;
		this.end_background_color = data.endBackgroundColor;
		this.duration_sec = data.durationSec;
		this.full_duration_sec = data.fullDurationSec;
		this.show_item = parseItem(data.showItemEndpoint?.showLiveChatItemEndpoint?.renderer);
		this.show_item_endpoint = new NavigationEndpoint(data.showItemEndpoint);
		this.ticker_thumbnails = data.tickerThumbnails.map((item) => ({
			thumbnails: Thumbnail.fromResponse(item),
			label: item?.accessibility?.accessibilityData?.label
		}));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatTickerSponsorItem.js
var LiveChatTickerSponsorItem = class extends YTNode {
	static type = "LiveChatTickerSponsorItem";
	id;
	detail;
	author;
	duration_sec;
	constructor(data) {
		super();
		this.id = data.id;
		this.detail = new Text$1(data.detailText);
		this.author = new Author(data.authorName, data.authorBadges, data.sponsorPhoto, data.authorExternalChannelId);
		this.duration_sec = data.durationSec;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/LiveChatViewerEngagementMessage.js
var LiveChatViewerEngagementMessage = class extends YTNode {
	static type = "LiveChatViewerEngagementMessage";
	id;
	timestamp;
	timestamp_usec;
	icon_type;
	message;
	action_button;
	menu_endpoint;
	context_menu_accessibility_label;
	constructor(data) {
		super();
		this.id = data.id;
		if (Reflect.has(data, "timestampUsec")) {
			this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1e3);
			this.timestamp_usec = data.timestampUsec;
		}
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
		this.message = new Text$1(data.message);
		this.action_button = parseItem(data.actionButton);
		if (Reflect.has(data, "contextMenuEndpoint")) this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
		if (Reflect.has(data, "contextMenuAccessibility") && Reflect.has(data.contextMenuAccessibility, "accessibilityData") && Reflect.has(data.contextMenuAccessibility.accessibilityData, "label")) this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/items/PollHeader.js
var PollHeader = class extends YTNode {
	static type = "PollHeader";
	poll_question;
	thumbnails;
	metadata;
	live_chat_poll_type;
	context_menu_button;
	constructor(data) {
		super();
		this.poll_question = new Text$1(data.pollQuestion);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.metadata = new Text$1(data.metadataText);
		this.live_chat_poll_type = data.liveChatPollType;
		this.context_menu_button = parseItem(data.contextMenuButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/LiveChatActionPanel.js
var LiveChatActionPanel = class extends YTNode {
	static type = "LiveChatActionPanel";
	id;
	contents;
	target_id;
	constructor(data) {
		super();
		this.id = data.id;
		this.contents = parse(data.contents);
		this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/MarkChatItemAsDeletedAction.js
var MarkChatItemAsDeletedAction = class extends YTNode {
	static type = "MarkChatItemAsDeletedAction";
	deleted_state_message;
	target_item_id;
	constructor(data) {
		super();
		this.deleted_state_message = new Text$1(data.deletedStateMessage);
		this.target_item_id = data.targetItemId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/MarkChatItemsByAuthorAsDeletedAction.js
var MarkChatItemsByAuthorAsDeletedAction = class extends YTNode {
	static type = "MarkChatItemsByAuthorAsDeletedAction";
	deleted_state_message;
	external_channel_id;
	constructor(data) {
		super();
		this.deleted_state_message = new Text$1(data.deletedStateMessage);
		this.external_channel_id = data.externalChannelId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/RemoveBannerForLiveChatCommand.js
var RemoveBannerForLiveChatCommand = class extends YTNode {
	static type = "RemoveBannerForLiveChatCommand";
	target_action_id;
	constructor(data) {
		super();
		this.target_action_id = data.targetActionId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/RemoveChatItemAction.js
var RemoveChatItemAction = class extends YTNode {
	static type = "RemoveChatItemAction";
	target_item_id;
	constructor(data) {
		super();
		this.target_item_id = data.targetItemId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/RemoveChatItemByAuthorAction.js
var RemoveChatItemByAuthorAction = class extends YTNode {
	static type = "RemoveChatItemByAuthorAction";
	external_channel_id;
	constructor(data) {
		super();
		this.external_channel_id = data.externalChannelId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/ReplaceChatItemAction.js
var ReplaceChatItemAction = class extends YTNode {
	static type = "ReplaceChatItemAction";
	target_item_id;
	replacement_item;
	constructor(data) {
		super();
		this.target_item_id = data.targetItemId;
		this.replacement_item = parseItem(data.replacementItem);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/ReplaceLiveChatAction.js
var ReplaceLiveChatAction = class extends YTNode {
	static type = "ReplaceLiveChatAction";
	to_replace;
	replacement;
	constructor(data) {
		super();
		this.to_replace = data.toReplace;
		this.replacement = parseItem(data.replacement);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/ReplayChatItemAction.js
var ReplayChatItemAction = class extends YTNode {
	static type = "ReplayChatItemAction";
	actions;
	video_offset_time_msec;
	constructor(data) {
		super();
		this.actions = parseArray(data.actions?.map((action) => {
			delete action.clickTrackingParams;
			return action;
		}));
		this.video_offset_time_msec = data.videoOffsetTimeMsec;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/ShowLiveChatActionPanelAction.js
var ShowLiveChatActionPanelAction = class extends YTNode {
	static type = "ShowLiveChatActionPanelAction";
	panel_to_show;
	constructor(data) {
		super();
		this.panel_to_show = parseItem(data.panelToShow, LiveChatActionPanel);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/ShowLiveChatDialogAction.js
var ShowLiveChatDialogAction = class extends YTNode {
	static type = "ShowLiveChatDialogAction";
	dialog;
	constructor(data) {
		super();
		this.dialog = parseItem(data.dialog);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/ShowLiveChatTooltipCommand.js
var ShowLiveChatTooltipCommand = class extends YTNode {
	static type = "ShowLiveChatTooltipCommand";
	tooltip;
	constructor(data) {
		super();
		this.tooltip = parseItem(data.tooltip);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/UpdateDateTextAction.js
var UpdateDateTextAction = class extends YTNode {
	static type = "UpdateDateTextAction";
	date_text;
	constructor(data) {
		super();
		this.date_text = new Text$1(data.dateText).toString();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/UpdateDescriptionAction.js
var UpdateDescriptionAction = class extends YTNode {
	static type = "UpdateDescriptionAction";
	description;
	constructor(data) {
		super();
		this.description = new Text$1(data.description);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/UpdateLiveChatPollAction.js
var UpdateLiveChatPollAction = class extends YTNode {
	static type = "UpdateLiveChatPollAction";
	poll_to_update;
	constructor(data) {
		super();
		this.poll_to_update = parseItem(data.pollToUpdate);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/UpdateTitleAction.js
var UpdateTitleAction = class extends YTNode {
	static type = "UpdateTitleAction";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/UpdateToggleButtonTextAction.js
var UpdateToggleButtonTextAction = class extends YTNode {
	static type = "UpdateToggleButtonTextAction";
	default_text;
	toggled_text;
	button_id;
	constructor(data) {
		super();
		this.default_text = new Text$1(data.defaultText).toString();
		this.toggled_text = new Text$1(data.toggledText).toString();
		this.button_id = data.buttonId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoViewCount.js
var VideoViewCount = class extends YTNode {
	static type = "VideoViewCount";
	original_view_count;
	unlabeled_view_count_value;
	short_view_count;
	extra_short_view_count;
	view_count;
	is_live;
	constructor(data) {
		super();
		if ("originalViewCount" in data) this.original_view_count = parseInt(data.originalViewCount);
		if ("unlabeledViewCountValue" in data) this.unlabeled_view_count_value = new Text$1(data.unlabeledViewCountValue);
		if ("shortViewCount" in data) this.short_view_count = new Text$1(data.shortViewCount);
		if ("extraShortViewCount" in data) this.extra_short_view_count = new Text$1(data.extraShortViewCount);
		if ("viewCount" in data) this.view_count = new Text$1(data.viewCount);
		this.is_live = !!data.isLive;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/livechat/UpdateViewershipAction.js
var UpdateViewershipAction = class extends YTNode {
	static type = "UpdateViewershipAction";
	view_count_node;
	/**
	* @deprecated Use `view_count_node.view_count` instead.
	*/
	get view_count() {
		return this.view_count_node?.view_count;
	}
	/**
	* @deprecated Use `view_count_node.extra_short_view_count` instead.
	*/
	get extra_short_view_count() {
		return this.view_count_node?.extra_short_view_count;
	}
	/**
	* @deprecated Use `view_count_node.short_view_count` instead.
	*/
	get short_view_count() {
		return this.view_count_node?.short_view_count;
	}
	/**
	* @deprecated Use `view_count_node.original_view_count` instead.
	*/
	get original_view_count() {
		return this.view_count_node?.original_view_count;
	}
	/**
	* @deprecated Use `view_count_node.unlabeled_view_count_value` instead.
	*/
	get unlabeled_view_count_value() {
		return this.view_count_node?.unlabeled_view_count_value;
	}
	/**
	* @deprecated Use `view_count_node.is_live` instead.
	*/
	get is_live() {
		return this.view_count_node?.is_live;
	}
	constructor(data) {
		super();
		this.view_count_node = parseItem(data.viewCount, VideoViewCount);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LiveChatDialog.js
var LiveChatDialog = class extends YTNode {
	static type = "LiveChatDialog";
	confirm_button;
	dialog_messages;
	constructor(data) {
		super();
		this.confirm_button = parseItem(data.confirmButton, Button);
		this.dialog_messages = data.dialogMessages.map((el) => new Text$1(el));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LiveChatHeader.js
var LiveChatHeader = class extends YTNode {
	static type = "LiveChatHeader";
	overflow_menu;
	collapse_button;
	view_selector;
	constructor(data) {
		super();
		this.overflow_menu = parseItem(data.overflowMenu, Menu);
		this.collapse_button = parseItem(data.collapseButton, Button);
		this.view_selector = parseItem(data.viewSelector, SortFilterSubMenu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LiveChatItemList.js
var LiveChatItemList = class extends YTNode {
	static type = "LiveChatItemList";
	max_items_to_display;
	more_comments_below_button;
	constructor(data) {
		super();
		this.max_items_to_display = data.maxItemsToDisplay;
		this.more_comments_below_button = parseItem(data.moreCommentsBelowButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LiveChatMessageInput.js
var LiveChatMessageInput = class extends YTNode {
	static type = "LiveChatMessageInput";
	author_name;
	author_photo;
	send_button;
	target_id;
	constructor(data) {
		super();
		this.author_name = new Text$1(data.authorName);
		this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
		this.send_button = parseItem(data.sendButton, Button);
		this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LiveChatParticipant.js
var LiveChatParticipant = class extends YTNode {
	static type = "LiveChatParticipant";
	name;
	photo;
	badges;
	constructor(data) {
		super();
		this.name = new Text$1(data.authorName);
		this.photo = Thumbnail.fromResponse(data.authorPhoto);
		this.badges = parseArray(data.authorBadges);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LiveChatParticipantsList.js
var LiveChatParticipantsList = class extends YTNode {
	static type = "LiveChatParticipantsList";
	title;
	participants;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.participants = parseArray(data.participants, LiveChatParticipant);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LockupMetadataView.js
var LockupMetadataView = class extends YTNode {
	static type = "LockupMetadataView";
	title;
	metadata;
	image;
	menu_button;
	constructor(data) {
		super();
		this.title = Text$1.fromAttributed(data.title);
		this.metadata = parseItem(data.metadata, ContentMetadataView);
		this.image = parseItem(data.image, [DecoratedAvatarView, AvatarStackView]);
		this.menu_button = parseItem(data.menuButton, ButtonView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/LockupView.js
var LockupView = class extends YTNode {
	static type = "LockupView";
	content_image;
	metadata;
	content_id;
	content_type;
	renderer_context;
	constructor(data) {
		super();
		this.content_image = parseItem(data.contentImage, [CollectionThumbnailView, ThumbnailView]);
		this.metadata = parseItem(data.metadata, LockupMetadataView);
		this.content_id = data.contentId;
		this.content_type = data.contentType.replace("LOCKUP_CONTENT_TYPE_", "");
		this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MacroMarkersListEntity.js
/**
* Represents a list of markers for a video. Can contain different types of markers:
* - MARKER_TYPE_HEATMAP: Heat map markers showing audience engagement data
* - Other marker types may exist but are not currently handled
*/
var MacroMarkersListEntity = class extends YTNode {
	static type = "MacroMarkersListEntity";
	marker_entity_key;
	external_video_id;
	/** The type of markers in this entity (e.g., 'MARKER_TYPE_HEATMAP') */
	marker_type;
	markers;
	max_height_dp;
	min_height_dp;
	show_hide_animation_duration_millis;
	timed_marker_decorations;
	raw_api_markers;
	raw_api_decorations;
	constructor(data) {
		super();
		this.marker_entity_key = data.key;
		this.external_video_id = data.externalVideoId;
		this.marker_type = data.markersList?.markerType || "";
		this.raw_api_markers = data.markersList?.markers || [];
		this.raw_api_decorations = data.markersList?.markersDecoration?.timedMarkerDecorations || [];
		this.markers = observe(this.raw_api_markers.map((marker) => new HeatMarker(marker)));
		const heatmapMetadata = data.markersList?.markersMetadata?.heatmapMetadata;
		this.max_height_dp = heatmapMetadata?.maxHeightDp || 40;
		this.min_height_dp = heatmapMetadata?.minHeightDp || 4;
		this.show_hide_animation_duration_millis = heatmapMetadata?.showHideAnimationDurationMillis || 200;
		this.timed_marker_decorations = observe(this.raw_api_decorations.map((decoration) => new TimedMarkerDecoration(decoration)));
	}
	/**
	* Checks if this MacroMarkersListEntity represents heatmap data.
	* Only heatmap markers can be converted to Heatmap objects.
	*/
	isHeatmap() {
		return this.marker_type === "MARKER_TYPE_HEATMAP";
	}
	/**
	* Converts this MacroMarkersListEntity to a Heatmap object
	* for compatibility with existing code. Only works for heatmap markers.
	* @returns Heatmap object if this entity contains heatmap data, null otherwise
	*/
	toHeatmap() {
		if (!this.isHeatmap()) return null;
		const wrappedHeatMarkers = this.raw_api_markers.map((marker) => ({ HeatMarker: marker }));
		const wrappedDecorations = this.raw_api_decorations.map((decoration) => ({ TimedMarkerDecoration: decoration }));
		return parseItem({ Heatmap: {
			maxHeightDp: this.max_height_dp,
			minHeightDp: this.min_height_dp,
			showHideAnimationDurationMillis: this.show_hide_animation_duration_millis,
			heatMarkers: wrappedHeatMarkers,
			heatMarkersDecorations: wrappedDecorations
		} }, Heatmap);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MenuNavigationItem.js
var MenuNavigationItem = class extends Button {
	static type = "MenuNavigationItem";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MenuPopup.js
var MenuPopup = class extends YTNode {
	static type = "MenuPopup";
	items;
	constructor(data) {
		super();
		this.items = parseArray(data.items, [MenuNavigationItem, MenuServiceItem]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Notification.js
var Notification = class extends YTNode {
	static type = "Notification";
	thumbnails;
	video_thumbnails;
	short_message;
	sent_time;
	notification_id;
	endpoint;
	record_click_endpoint;
	menu;
	read;
	constructor(data) {
		super();
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.video_thumbnails = Thumbnail.fromResponse(data.videoThumbnail);
		this.short_message = new Text$1(data.shortMessage);
		this.sent_time = new Text$1(data.sentTimeText);
		this.notification_id = data.notificationId;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.record_click_endpoint = new NavigationEndpoint(data.recordClickEndpoint);
		this.menu = parseItem(data.contextualMenu);
		this.read = data.read;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MultiPageMenuNotificationSection.js
var MultiPageMenuNotificationSection = class extends YTNode {
	static type = "MultiPageMenuNotificationSection";
	notification_section_title;
	items;
	constructor(data) {
		super();
		if ("notificationSectionTitle" in data) this.notification_section_title = new Text$1(data.notificationSectionTitle);
		this.items = parseArray(data.items, [
			Notification,
			Message,
			ContinuationItem
		]);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MusicMenuItemDivider.js
var MusicMenuItemDivider = class extends YTNode {
	static type = "MusicMenuItemDivider";
	constructor(_data) {
		super();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MusicMultiSelectMenuItem.js
var MusicMultiSelectMenuItem = class extends YTNode {
	static type = "MusicMultiSelectMenuItem";
	title;
	form_item_entity_key;
	selected_icon_type;
	endpoint;
	selected;
	constructor(data) {
		super();
		this.title = new Text$1(data.title).toString();
		this.form_item_entity_key = data.formItemEntityKey;
		if (Reflect.has(data, "selectedIcon")) this.selected_icon_type = data.selectedIcon.iconType;
		if (Reflect.has(data, "selectedCommand")) this.endpoint = new NavigationEndpoint(data.selectedCommand);
		this.selected = !!this.endpoint;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/MusicMultiSelectMenu.js
var MusicMultiSelectMenu = class extends YTNode {
	static type = "MusicMultiSelectMenu";
	title;
	options;
	constructor(data) {
		super();
		if (Reflect.has(data, "title") && Reflect.has(data.title, "musicMenuTitleRenderer")) this.title = new Text$1(data.title.musicMenuTitleRenderer?.primaryText);
		this.options = parseArray(data.options, [MusicMultiSelectMenuItem, MusicMenuItemDivider]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/menus/SimpleMenuHeader.js
var SimpleMenuHeader = class extends YTNode {
	static type = "SimpleMenuHeader";
	title;
	buttons;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.buttons = parseArray(data.buttons, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MerchandiseItem.js
var MerchandiseItem = class extends YTNode {
	static type = "MerchandiseItem";
	title;
	description;
	thumbnails;
	price;
	vendor_name;
	button_text;
	button_accessibility_text;
	from_vendor_text;
	additional_fees_text;
	region_format;
	endpoint;
	constructor(data) {
		super();
		this.title = data.title;
		this.description = data.description;
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.price = data.price;
		this.vendor_name = data.vendorName;
		this.button_text = data.buttonText;
		this.button_accessibility_text = data.buttonAccessibilityText;
		this.from_vendor_text = data.fromVendorText;
		this.additional_fees_text = data.additionalFeesText;
		this.region_format = data.regionFormat;
		this.endpoint = new NavigationEndpoint(data.buttonCommand);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MetadataRow.js
var MetadataRow = class extends YTNode {
	static type = "MetadataRow";
	title;
	contents;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.contents = data.contents.map((content) => new Text$1(content));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MetadataRowContainer.js
var MetadataRowContainer = class extends YTNode {
	static type = "MetadataRowContainer";
	rows;
	collapsed_item_count;
	constructor(data) {
		super();
		this.rows = parseArray(data.rows);
		this.collapsed_item_count = data.collapsedItemCount;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MetadataRowHeader.js
var MetadataRowHeader = class extends YTNode {
	static type = "MetadataRowHeader";
	content;
	has_divider_line;
	constructor(data) {
		super();
		this.content = new Text$1(data.content);
		this.has_divider_line = data.hasDividerLine;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MetadataScreen.js
var MetadataScreen = class extends YTNode {
	static type = "MetadataScreen";
	section_list;
	constructor(data) {
		super();
		this.section_list = parseItem(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MicroformatData.js
var MicroformatData = class extends YTNode {
	static type = "MicroformatData";
	url_canonical;
	title;
	description;
	thumbnail;
	site_name;
	app_name;
	android_package;
	ios_app_store_id;
	ios_app_arguments;
	og_type;
	url_applinks_web;
	url_applinks_ios;
	url_applinks_android;
	url_twitter_ios;
	url_twitter_android;
	twitter_card_type;
	twitter_site_handle;
	schema_dot_org_type;
	noindex;
	is_unlisted;
	is_family_safe;
	tags;
	available_countries;
	constructor(data) {
		super();
		this.url_canonical = data.urlCanonical;
		this.title = data.title;
		this.description = data.description;
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.site_name = data.siteName;
		this.app_name = data.appName;
		this.android_package = data.androidPackage;
		this.ios_app_store_id = data.iosAppStoreId;
		this.ios_app_arguments = data.iosAppArguments;
		this.og_type = data.ogType;
		this.url_applinks_web = data.urlApplinksWeb;
		this.url_applinks_ios = data.urlApplinksIos;
		this.url_applinks_android = data.urlApplinksAndroid;
		this.url_twitter_ios = data.urlTwitterIos;
		this.url_twitter_android = data.urlTwitterAndroid;
		this.twitter_card_type = data.twitterCardType;
		this.twitter_site_handle = data.twitterSiteHandle;
		this.schema_dot_org_type = data.schemaDotOrgType;
		this.noindex = data.noindex;
		this.is_unlisted = data.unlisted;
		this.is_family_safe = data.familySafe;
		this.tags = data.tags;
		this.available_countries = data.availableCountries;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Mix.js
var Mix = class extends Playlist$2 {
	static type = "Mix";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ModalWithTitleAndButton.js
var ModalWithTitleAndButton = class extends YTNode {
	static type = "ModalWithTitleAndButton";
	title;
	content;
	button;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.content = new Text$1(data.content);
		this.button = parseItem(data.button, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Movie.js
var Movie = class extends YTNode {
	static type = "Movie";
	id;
	title;
	description_snippet;
	top_metadata_items;
	thumbnails;
	thumbnail_overlays;
	author;
	duration;
	endpoint;
	badges;
	use_vertical_poster;
	show_action_menu;
	menu;
	constructor(data) {
		super();
		const overlay_time_status = data.thumbnailOverlays.find((overlay) => overlay.thumbnailOverlayTimeStatusRenderer)?.thumbnailOverlayTimeStatusRenderer.text || "N/A";
		this.id = data.videoId;
		this.title = new Text$1(data.title);
		if (Reflect.has(data, "descriptionSnippet")) this.description_snippet = new Text$1(data.descriptionSnippet);
		this.top_metadata_items = new Text$1(data.topMetadataItems);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		this.author = new Author(data.longBylineText, data.ownerBadges, data.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail);
		this.duration = {
			text: data.lengthText ? new Text$1(data.lengthText).toString() : new Text$1(overlay_time_status).toString(),
			seconds: timeToSeconds(data.lengthText ? new Text$1(data.lengthText).toString() : new Text$1(overlay_time_status).toString())
		};
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.badges = parseArray(data.badges);
		this.use_vertical_poster = data.useVerticalPoster;
		this.show_action_menu = data.showActionMenu;
		this.menu = parseItem(data.menu, Menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MovingThumbnail.js
var MovingThumbnail = class extends YTNode {
	static type = "MovingThumbnail";
	constructor(data) {
		super();
		return data.movingThumbnailDetails?.thumbnails.map((thumbnail) => new Thumbnail(thumbnail)).sort((a, b) => b.width - a.width);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicCardShelfHeaderBasic.js
var MusicCardShelfHeaderBasic = class extends YTNode {
	static type = "MusicCardShelfHeaderBasic";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicInlineBadge.js
var MusicInlineBadge = class extends YTNode {
	static type = "MusicInlineBadge";
	icon_type;
	accessibility;
	constructor(data) {
		super();
		this.icon_type = data.icon.iconType;
		if ("accessibilityData" in data && "accessibilityData" in data.accessibilityData) this.accessibility = { accessibility_data: new AccessibilityData(data.accessibilityData.accessibilityData) };
	}
	get label() {
		return this.accessibility?.accessibility_data?.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicPlayButton.js
var MusicPlayButton = class extends YTNode {
	static type = "MusicPlayButton";
	endpoint;
	play_icon_type;
	pause_icon_type;
	icon_color;
	accessibility_play_data;
	accessibility_pause_data;
	constructor(data) {
		super();
		this.endpoint = new NavigationEndpoint(data.playNavigationEndpoint);
		this.play_icon_type = data.playIcon.iconType;
		this.pause_icon_type = data.pauseIcon.iconType;
		if ("accessibilityPlayData" in data && "accessibilityData" in data.accessibilityPlayData) this.accessibility_play_data = { accessibility_data: new AccessibilityData(data.accessibilityPlayData.accessibilityData) };
		if ("accessibilityPauseData" in data && "accessibilityData" in data.accessibilityPauseData) this.accessibility_pause_data = { accessibility_data: new AccessibilityData(data.accessibilityPauseData.accessibilityData) };
		this.icon_color = data.iconColor;
	}
	get play_label() {
		return this.accessibility_play_data?.accessibility_data?.label;
	}
	get pause_label() {
		return this.accessibility_pause_data?.accessibility_data?.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicItemThumbnailOverlay.js
var MusicItemThumbnailOverlay = class extends YTNode {
	static type = "MusicItemThumbnailOverlay";
	content;
	content_position;
	display_style;
	constructor(data) {
		super();
		this.content = parseItem(data.content, MusicPlayButton);
		this.content_position = data.contentPosition;
		this.display_style = data.displayStyle;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicThumbnail.js
var MusicThumbnail = class extends YTNode {
	static type = "MusicThumbnail";
	contents;
	constructor(data) {
		super();
		this.contents = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicCardShelf.js
var MusicCardShelf = class extends YTNode {
	static type = "MusicCardShelf";
	thumbnail;
	title;
	subtitle;
	buttons;
	menu;
	on_tap;
	header;
	end_icon_type;
	subtitle_badges;
	thumbnail_overlay;
	contents;
	constructor(data) {
		super();
		this.thumbnail = parseItem(data.thumbnail, MusicThumbnail);
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
		this.buttons = parseArray(data.buttons, Button);
		this.menu = parseItem(data.menu, Menu);
		this.on_tap = new NavigationEndpoint(data.onTap);
		this.header = parseItem(data.header, MusicCardShelfHeaderBasic);
		if (Reflect.has(data, "endIcon") && Reflect.has(data.endIcon, "iconType")) this.end_icon_type = data.endIcon.iconType;
		this.subtitle_badges = parseArray(data.subtitleBadges, MusicInlineBadge);
		this.thumbnail_overlay = parseItem(data.thumbnailOverlay, MusicItemThumbnailOverlay);
		if (Reflect.has(data, "contents")) this.contents = parseArray(data.contents);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicCarouselShelfBasicHeader.js
var MusicCarouselShelfBasicHeader = class extends YTNode {
	static type = "MusicCarouselShelfBasicHeader";
	title;
	strapline;
	thumbnail;
	more_content;
	end_icons;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		if (Reflect.has(data, "strapline")) this.strapline = new Text$1(data.strapline);
		if (Reflect.has(data, "thumbnail")) this.thumbnail = parseItem(data.thumbnail, MusicThumbnail);
		if (Reflect.has(data, "moreContentButton")) this.more_content = parseItem(data.moreContentButton, Button);
		if (Reflect.has(data, "endIcons")) this.end_icons = parseArray(data.endIcons, IconLink);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicMultiRowListItem.js
var MusicMultiRowListItem = class extends YTNode {
	static type = "MusicMultiRowListItem";
	thumbnail;
	overlay;
	on_tap;
	menu;
	subtitle;
	title;
	second_title;
	description;
	display_style;
	constructor(data) {
		super();
		this.thumbnail = parseItem(data.thumbnail, MusicThumbnail);
		this.overlay = parseItem(data.overlay, MusicItemThumbnailOverlay);
		this.on_tap = new NavigationEndpoint(data.onTap);
		this.menu = parseItem(data.menu, Menu);
		this.subtitle = new Text$1(data.subtitle);
		this.title = new Text$1(data.title);
		if (Reflect.has(data, "secondTitle")) this.second_title = new Text$1(data.secondTitle);
		if (Reflect.has(data, "description")) this.description = new Text$1(data.description);
		if (Reflect.has(data, "displayStyle")) this.display_style = data.displayStyle;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicNavigationButton.js
var MusicNavigationButton = class extends YTNode {
	static type = "MusicNavigationButton";
	button_text;
	endpoint;
	constructor(data) {
		super();
		this.button_text = new Text$1(data.buttonText).toString();
		this.endpoint = new NavigationEndpoint(data.clickCommand);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicResponsiveListItemFixedColumn.js
var MusicResponsiveListItemFixedColumn = class extends YTNode {
	static type = "musicResponsiveListItemFlexColumnRenderer";
	title;
	display_priority;
	constructor(data) {
		super();
		this.title = new Text$1(data.text);
		this.display_priority = data.displayPriority;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicResponsiveListItemFlexColumn.js
var MusicResponsiveListItemFlexColumn = class extends YTNode {
	static type = "MusicResponsiveListItemFlexColumn";
	title;
	display_priority;
	constructor(data) {
		super();
		this.title = new Text$1(data.text);
		this.display_priority = data.displayPriority;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicResponsiveListItem.js
var DURATION_TEXT = /^\d+(?::[0-5]\d)+$/;
function findDurationText(runs) {
	return runs?.findLast((run) => DURATION_TEXT.test(run.text))?.text;
}
var MusicResponsiveListItem = class extends YTNode {
	static type = "MusicResponsiveListItem";
	flex_columns;
	fixed_columns;
	endpoint;
	item_type;
	index;
	thumbnail;
	badges;
	menu;
	overlay;
	id;
	title;
	duration;
	album;
	artists;
	views;
	authors;
	name;
	subtitle;
	subscribers;
	song_count;
	author;
	item_count;
	year;
	constructor(data) {
		super();
		this.flex_columns = parseArray(data.flexColumns, MusicResponsiveListItemFlexColumn);
		this.fixed_columns = parseArray(data.fixedColumns, MusicResponsiveListItemFixedColumn);
		const playlist_item_data = {
			video_id: data?.playlistItemData?.videoId || null,
			playlist_set_video_id: data?.playlistItemData?.playlistSetVideoId || null
		};
		if ("navigationEndpoint" in data) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		let page_type = this.endpoint?.payload?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType;
		if (!page_type) {
			if (this.flex_columns.find((col) => col.title.endpoint?.payload?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === "MUSIC_PAGE_TYPE_NON_MUSIC_AUDIO_TRACK_PAGE")) page_type = "MUSIC_PAGE_TYPE_NON_MUSIC_AUDIO_TRACK_PAGE";
		}
		switch (page_type) {
			case "MUSIC_PAGE_TYPE_ALBUM":
				this.item_type = "album";
				this.#parseAlbum();
				break;
			case "MUSIC_PAGE_TYPE_PLAYLIST":
				this.item_type = "playlist";
				this.#parsePlaylist();
				break;
			case "MUSIC_PAGE_TYPE_ARTIST":
			case "MUSIC_PAGE_TYPE_USER_CHANNEL":
				this.item_type = "artist";
				this.#parseArtist();
				break;
			case "MUSIC_PAGE_TYPE_LIBRARY_ARTIST":
				this.item_type = "library_artist";
				this.#parseLibraryArtist();
				break;
			case "MUSIC_PAGE_TYPE_NON_MUSIC_AUDIO_TRACK_PAGE":
				this.item_type = "non_music_track";
				this.#parseNonMusicTrack(playlist_item_data);
				break;
			case "MUSIC_PAGE_TYPE_PODCAST_SHOW_DETAIL_PAGE":
				this.item_type = "podcast_show";
				this.#parsePodcastShow();
				break;
			default: if (this.flex_columns[1]) this.#parseVideoOrSong(playlist_item_data);
			else this.#parseOther();
		}
		if ("index" in data) this.index = new Text$1(data.index);
		if ("thumbnail" in data) this.thumbnail = parseItem(data.thumbnail, MusicThumbnail);
		if ("badges" in data) this.badges = parseArray(data.badges);
		if ("menu" in data) this.menu = parseItem(data.menu, Menu);
		if ("overlay" in data) this.overlay = parseItem(data.overlay, MusicItemThumbnailOverlay);
	}
	#parseOther() {
		this.title = this.flex_columns[0].title.toString();
		if (this.endpoint) this.item_type = "endpoint";
		else this.item_type = "unknown";
	}
	#parseVideoOrSong(playlist_item_data) {
		switch (this.flex_columns.at(0)?.title.runs?.at(0)?.endpoint?.payload?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig?.musicVideoType) {
			case "MUSIC_VIDEO_TYPE_UGC":
			case "MUSIC_VIDEO_TYPE_OMV":
				this.item_type = "video";
				this.#parseVideo(playlist_item_data);
				break;
			case "MUSIC_VIDEO_TYPE_ATV":
				this.item_type = "song";
				this.#parseSong(playlist_item_data);
				break;
			default: this.#parseOther();
		}
	}
	#parseSong(playlist_item_data) {
		this.id = playlist_item_data.video_id || this.endpoint?.payload?.videoId;
		this.title = this.flex_columns[0].title.toString();
		const duration_text = findDurationText(this.flex_columns.at(1)?.title.runs) || this.fixed_columns[0]?.title?.toString();
		if (duration_text) this.duration = {
			text: duration_text,
			seconds: timeToSeconds(duration_text)
		};
		const album_run = this.flex_columns.at(1)?.title.runs?.find((run) => isTextRun(run) && run.endpoint && run.endpoint.payload.browseId.startsWith("MPR")) || this.flex_columns.at(2)?.title.runs?.find((run) => isTextRun(run) && run.endpoint && run.endpoint.payload.browseId.startsWith("MPR"));
		if (album_run && isTextRun(album_run)) this.album = {
			id: album_run.endpoint?.payload?.browseId,
			name: album_run.text,
			endpoint: album_run.endpoint
		};
		const artist_runs = this.flex_columns.at(1)?.title.runs?.filter((run) => isTextRun(run) && run.endpoint && run.endpoint.payload.browseId.startsWith("UC"));
		if (artist_runs) this.artists = artist_runs.map((run) => ({
			name: run.text,
			channel_id: isTextRun(run) ? run.endpoint?.payload?.browseId : void 0,
			endpoint: isTextRun(run) ? run.endpoint : void 0
		}));
	}
	#parseVideo(playlist_item_data) {
		this.id = playlist_item_data.video_id;
		this.title = this.flex_columns[0].title.toString();
		this.views = this.flex_columns.at(1)?.title.runs?.find((run) => run.text.match(/(.*?) views/))?.toString();
		const author_runs = this.flex_columns.at(1)?.title.runs?.filter((run) => isTextRun(run) && run.endpoint && run.endpoint.payload.browseId.startsWith("UC"));
		if (author_runs) this.authors = author_runs.map((run) => {
			return {
				name: run.text,
				channel_id: isTextRun(run) ? run.endpoint?.payload?.browseId : void 0,
				endpoint: isTextRun(run) ? run.endpoint : void 0
			};
		});
		const duration_text = findDurationText(this.flex_columns[1].title.runs) || findDurationText(this.fixed_columns[0]?.title.runs);
		if (duration_text) this.duration = {
			text: duration_text,
			seconds: timeToSeconds(duration_text)
		};
	}
	#parseArtist() {
		this.id = this.endpoint?.payload?.browseId;
		this.name = this.flex_columns[0].title.toString();
		this.subtitle = this.flex_columns.at(1)?.title;
		this.subscribers = this.subtitle?.runs?.find((run) => /^(\d*\.)?\d+[M|K]? subscribers?$/i.test(run.text))?.text || "";
	}
	#parseLibraryArtist() {
		this.name = this.flex_columns[0].title.toString();
		this.subtitle = this.flex_columns.at(1)?.title;
		this.song_count = this.subtitle?.runs?.find((run) => /^\d+(,\d+)? songs?$/i.test(run.text))?.text || "";
	}
	#parseNonMusicTrack(playlist_item_data) {
		this.id = playlist_item_data.video_id || this.endpoint?.payload?.videoId;
		this.title = this.flex_columns[0].title.toString();
	}
	#parsePodcastShow() {
		this.id = this.endpoint?.payload?.browseId;
		this.title = this.flex_columns[0].title.toString();
	}
	#parseAlbum() {
		this.id = this.endpoint?.payload?.browseId;
		this.title = this.flex_columns[0].title.toString();
		const author_run = this.flex_columns.at(1)?.title.runs?.find((run) => isTextRun(run) && run.endpoint && run.endpoint.payload.browseId.startsWith("UC"));
		if (author_run && isTextRun(author_run)) this.author = {
			name: author_run.text,
			channel_id: author_run.endpoint?.payload?.browseId,
			endpoint: author_run.endpoint
		};
		this.year = this.flex_columns.at(1)?.title.runs?.find((run) => /^[12][0-9]{3}$/.test(run.text))?.text;
	}
	#parsePlaylist() {
		this.id = this.endpoint?.payload?.browseId;
		this.title = this.flex_columns[0].title.toString();
		const item_count_run = this.flex_columns.at(1)?.title.runs?.find((run) => run.text.match(/\d+ (song|songs)/));
		this.item_count = item_count_run ? item_count_run.text : void 0;
		const author_run = this.flex_columns.at(1)?.title.runs?.find((run) => isTextRun(run) && run.endpoint && run.endpoint.payload.browseId.startsWith("UC"));
		if (author_run && isTextRun(author_run)) this.author = {
			name: author_run.text,
			channel_id: author_run.endpoint?.payload?.browseId,
			endpoint: author_run.endpoint
		};
	}
	get thumbnails() {
		return this.thumbnail?.contents || [];
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicTwoRowItem.js
var MusicTwoRowItem = class extends YTNode {
	static type = "MusicTwoRowItem";
	title;
	endpoint;
	id;
	subtitle;
	badges;
	item_type;
	subscribers;
	item_count;
	year;
	views;
	artists;
	author;
	thumbnail;
	thumbnail_overlay;
	menu;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.id = this.endpoint?.payload?.browseId || this.endpoint?.payload?.videoId;
		this.subtitle = new Text$1(data.subtitle);
		this.badges = parse(data.subtitleBadges);
		switch (this.endpoint?.payload?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType) {
			case "MUSIC_PAGE_TYPE_ARTIST":
				this.item_type = "artist";
				break;
			case "MUSIC_PAGE_TYPE_PLAYLIST":
				this.item_type = "playlist";
				break;
			case "MUSIC_PAGE_TYPE_ALBUM":
				this.item_type = "album";
				break;
			default: if (this.endpoint?.metadata?.api_url === "/next") this.item_type = "endpoint";
			else if (this.subtitle.runs?.[0]) {
				if (this.subtitle.runs[0].text !== "Song") this.item_type = "video";
				else this.item_type = "song";
			} else if (this.endpoint) this.item_type = "endpoint";
			else this.item_type = "unknown";
		}
		if (this.item_type == "artist") this.subscribers = this.subtitle.runs?.find((run) => /^(\d*\.)?\d+[M|K]? subscribers?$/i.test(run.text))?.text || "";
		else if (this.item_type == "playlist") {
			const item_count_run = this.subtitle.runs?.find((run) => run.text.match(/\d+ songs|song/));
			this.item_count = item_count_run ? item_count_run.text : null;
		} else if (this.item_type == "album") {
			const artists = this.subtitle.runs?.filter((run) => run.endpoint?.payload?.browseId.startsWith("UC"));
			if (artists) this.artists = artists.map((artist) => ({
				name: artist.text,
				channel_id: artist.endpoint?.payload?.browseId,
				endpoint: artist.endpoint
			}));
			this.year = this.subtitle.runs?.slice(-1)[0].text;
			if (isNaN(Number(this.year))) delete this.year;
		} else if (this.item_type == "video") {
			this.views = this?.subtitle.runs?.find((run) => run?.text.match(/(.*?) views/))?.text || "N/A";
			const author = this.subtitle.runs?.find((run) => run.endpoint?.payload?.browseId?.startsWith("UC"));
			if (author) this.author = {
				name: author?.text,
				channel_id: author?.endpoint?.payload?.browseId,
				endpoint: author?.endpoint
			};
		} else if (this.item_type == "song") {
			const artists = this.subtitle.runs?.filter((run) => run.endpoint?.payload?.browseId.startsWith("UC"));
			if (artists) this.artists = artists.map((artist) => ({
				name: artist?.text,
				channel_id: artist?.endpoint?.payload?.browseId,
				endpoint: artist?.endpoint
			}));
		}
		this.thumbnail = Thumbnail.fromResponse(data.thumbnailRenderer.musicThumbnailRenderer.thumbnail);
		this.thumbnail_overlay = parseItem(data.thumbnailOverlay, MusicItemThumbnailOverlay);
		this.menu = parseItem(data.menu, Menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicCarouselShelf.js
var MusicCarouselShelf = class extends YTNode {
	static type = "MusicCarouselShelf";
	header;
	contents;
	num_items_per_column;
	constructor(data) {
		super();
		this.header = parseItem(data.header, MusicCarouselShelfBasicHeader);
		this.contents = parseArray(data.contents, [
			MusicTwoRowItem,
			MusicResponsiveListItem,
			MusicMultiRowListItem,
			MusicNavigationButton
		]);
		if (Reflect.has(data, "numItemsPerColumn")) this.num_items_per_column = parseInt(data.numItemsPerColumn);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicDescriptionShelf.js
var MusicDescriptionShelf = class extends YTNode {
	static type = "MusicDescriptionShelf";
	description;
	max_collapsed_lines;
	max_expanded_lines;
	footer;
	constructor(data) {
		super();
		this.description = new Text$1(data.description);
		if (Reflect.has(data, "maxCollapsedLines")) this.max_collapsed_lines = data.maxCollapsedLines;
		if (Reflect.has(data, "maxExpandedLines")) this.max_expanded_lines = data.maxExpandedLines;
		this.footer = new Text$1(data.footer);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicDetailHeader.js
var MusicDetailHeader = class extends YTNode {
	static type = "MusicDetailHeader";
	title;
	description;
	subtitle;
	second_subtitle;
	year;
	song_count;
	total_duration;
	thumbnails;
	badges;
	author;
	menu;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.description = new Text$1(data.description);
		this.subtitle = new Text$1(data.subtitle);
		this.second_subtitle = new Text$1(data.secondSubtitle);
		this.year = this.subtitle.runs?.find((run) => /^[12][0-9]{3}$/.test(run.text))?.text || "";
		this.song_count = this.second_subtitle.runs?.[0]?.text || "";
		this.total_duration = this.second_subtitle.runs?.[2]?.text || "";
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail.croppedSquareThumbnailRenderer.thumbnail);
		this.badges = parseArray(data.subtitleBadges);
		const author = this.subtitle.runs?.find((run) => run?.endpoint?.payload?.browseId.startsWith("UC"));
		if (author) this.author = {
			name: author.text,
			channel_id: author.endpoint?.payload?.browseId,
			endpoint: author.endpoint
		};
		this.menu = parseItem(data.menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicDownloadStateBadge.js
var MusicDownloadStateBadge = class extends YTNode {
	static type = "MusicDownloadStateBadge";
	playlist_id;
	supported_download_states;
	constructor(data) {
		super();
		this.playlist_id = data.playlistId;
		this.supported_download_states = data.supportedDownloadStates;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicEditablePlaylistDetailHeader.js
var MusicEditablePlaylistDetailHeader = class extends YTNode {
	static type = "MusicEditablePlaylistDetailHeader";
	header;
	edit_header;
	playlist_id;
	constructor(data) {
		super();
		this.header = parseItem(data.header);
		this.edit_header = parseItem(data.editHeader);
		this.playlist_id = data.playlistId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicElementHeader.js
var MusicElementHeader = class extends YTNode {
	static type = "MusicElementHeader";
	element;
	constructor(data) {
		super();
		this.element = Reflect.has(data, "elementRenderer") ? parseItem(data, Element) : null;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicHeader.js
var MusicHeader = class extends YTNode {
	static type = "MusicHeader";
	header;
	title;
	constructor(data) {
		super();
		if (Reflect.has(data, "header")) this.header = parseItem(data.header);
		if (Reflect.has(data, "title")) this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicImmersiveHeader.js
var MusicImmersiveHeader = class extends YTNode {
	static type = "MusicImmersiveHeader";
	title;
	menu;
	more_button;
	play_button;
	share_endpoint;
	start_radio_button;
	subscription_button;
	description;
	thumbnail;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.menu = parseItem(data.menu, Menu);
		this.more_button = parseItem(data.moreButton, ToggleButton);
		this.play_button = parseItem(data.playButton, Button);
		if ("shareEndpoint" in data) this.share_endpoint = new NavigationEndpoint(data.shareEndpoint);
		this.start_radio_button = parseItem(data.startRadioButton, Button);
		this.subscription_button = parseItem(data.subscriptionButton, SubscribeButton);
		this.description = new Text$1(data.description);
		this.thumbnail = parseItem(data.thumbnail, MusicThumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicLargeCardItemCarousel.js
var ActionButton = class {
	static type = "ActionButton";
	icon_name;
	endpoint;
	a11y_text;
	style;
	constructor(data) {
		this.icon_name = data.iconName;
		this.endpoint = new NavigationEndpoint(data.onTap);
		this.a11y_text = data.a11yText;
		this.style = data.style;
	}
};
var Panel = class {
	static type = "Panel";
	image;
	content_mode;
	crop_options;
	image_aspect_ratio;
	caption;
	action_buttons;
	constructor(data) {
		this.image = Thumbnail.fromResponse(data.image.image);
		this.content_mode = data.image.contentMode;
		this.crop_options = data.image.cropOptions;
		this.image_aspect_ratio = data.imageAspectRatio;
		this.caption = data.caption;
		this.action_buttons = data.actionButtons.map((el) => new ActionButton(el));
	}
};
var MusicLargeCardItemCarousel = class extends YTNode {
	static type = "MusicLargeCardItemCarousel";
	panels;
	header;
	constructor(data) {
		super();
		this.header = data.shelf.header;
		this.panels = data.shelf.panels.map((el) => new Panel(el));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicPlaylistEditHeader.js
var MusicPlaylistEditHeader = class extends YTNode {
	static type = "MusicPlaylistEditHeader";
	title;
	edit_title;
	edit_description;
	privacy;
	playlist_id;
	endpoint;
	privacy_dropdown;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.edit_title = new Text$1(data.editTitle);
		this.edit_description = new Text$1(data.editDescription);
		this.privacy = data.privacy;
		this.playlist_id = data.playlistId;
		this.endpoint = new NavigationEndpoint(data.collaborationSettingsCommand);
		this.privacy_dropdown = parseItem(data.privacyDropdown, Dropdown);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicPlaylistShelf.js
var MusicPlaylistShelf = class extends YTNode {
	static type = "MusicPlaylistShelf";
	playlist_id;
	contents;
	collapsed_item_count;
	continuation;
	constructor(data) {
		super();
		this.playlist_id = data.playlistId;
		this.contents = parseArray(data.contents, [MusicResponsiveListItem, ContinuationItem]);
		this.collapsed_item_count = data.collapsedItemCount;
		this.continuation = data.continuations?.[0]?.nextContinuationData?.continuation || null;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistPanelVideo.js
var PlaylistPanelVideo = class extends YTNode {
	static type = "PlaylistPanelVideo";
	title;
	thumbnail;
	endpoint;
	selected;
	video_id;
	duration;
	author;
	album;
	artists;
	badges;
	menu;
	set_video_id;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.selected = data.selected;
		this.video_id = data.videoId;
		this.duration = {
			text: new Text$1(data.lengthText).toString(),
			seconds: timeToSeconds(new Text$1(data.lengthText).toString())
		};
		const album = new Text$1(data.longBylineText).runs?.find((run) => run.endpoint?.payload?.browseId?.startsWith("MPR"));
		const artists = new Text$1(data.longBylineText).runs?.filter((run) => run.endpoint?.payload?.browseId?.startsWith("UC"));
		this.author = new Text$1(data.shortBylineText).toString();
		if (album) this.album = {
			id: album.endpoint?.payload?.browseId,
			name: album.text,
			year: new Text$1(data.longBylineText).runs?.slice(-1)[0].text,
			endpoint: album.endpoint
		};
		if (artists) this.artists = artists.map((artist) => ({
			name: artist.text,
			channel_id: artist.endpoint?.payload?.browseId,
			endpoint: artist.endpoint
		}));
		this.badges = parseArray(data.badges);
		this.menu = parseItem(data.menu);
		this.set_video_id = data.playlistSetVideoId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistPanelVideoWrapper.js
var PlaylistPanelVideoWrapper = class extends YTNode {
	static type = "PlaylistPanelVideoWrapper";
	primary;
	counterpart;
	constructor(data) {
		super();
		this.primary = parseItem(data.primaryRenderer, PlaylistPanelVideo);
		if (Reflect.has(data, "counterpart")) this.counterpart = observe(data.counterpart.map((item) => parseItem(item.counterpartRenderer, PlaylistPanelVideo)) || []);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistPanel.js
var PlaylistPanel = class extends YTNode {
	static type = "PlaylistPanel";
	title;
	title_text;
	contents;
	playlist_id;
	is_infinite;
	continuation;
	is_editable;
	preview_description;
	num_items_to_show;
	constructor(data) {
		super();
		this.title = data.title;
		this.title_text = new Text$1(data.titleText);
		this.contents = parseArray(data.contents, [
			PlaylistPanelVideoWrapper,
			PlaylistPanelVideo,
			AutomixPreviewVideo
		]);
		this.playlist_id = data.playlistId;
		this.is_infinite = data.isInfinite;
		this.continuation = data.continuations?.[0]?.nextRadioContinuationData?.continuation || data.continuations?.[0]?.nextContinuationData?.continuation;
		this.is_editable = data.isEditable;
		this.preview_description = data.previewDescription;
		this.num_items_to_show = data.numItemsToShow;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicQueue.js
var MusicQueue = class extends YTNode {
	static type = "MusicQueue";
	content;
	constructor(data) {
		super();
		this.content = parseItem(data.content, PlaylistPanel);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicResponsiveHeader.js
var MusicResponsiveHeader = class extends YTNode {
	static type = "MusicResponsiveHeader";
	thumbnail;
	buttons;
	title;
	subtitle;
	strapline_text_one;
	strapline_thumbnail;
	second_subtitle;
	subtitle_badge;
	description;
	constructor(data) {
		super();
		this.thumbnail = parseItem(data.thumbnail, MusicThumbnail);
		this.buttons = parseArray(data.buttons, [
			DownloadButton,
			ToggleButton,
			MusicPlayButton,
			Button,
			Menu
		]);
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
		this.strapline_text_one = new Text$1(data.straplineTextOne);
		this.strapline_thumbnail = parseItem(data.straplineThumbnail, MusicThumbnail);
		this.second_subtitle = new Text$1(data.secondSubtitle);
		if (Reflect.has(data, "subtitleBadge")) this.subtitle_badge = parseArray(data.subtitleBadge, MusicInlineBadge);
		if (Reflect.has(data, "description")) this.description = parseItem(data.description, MusicDescriptionShelf);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicShelf.js
var MusicShelf = class extends YTNode {
	static type = "MusicShelf";
	title;
	contents;
	endpoint;
	continuation;
	bottom_text;
	bottom_button;
	subheaders;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.contents = parseArray(data.contents, MusicResponsiveListItem);
		if (Reflect.has(data, "bottomEndpoint")) this.endpoint = new NavigationEndpoint(data.bottomEndpoint);
		if (Reflect.has(data, "continuations")) this.continuation = data.continuations?.[0].nextContinuationData?.continuation || data.continuations?.[0].reloadContinuationData?.continuation;
		if (Reflect.has(data, "bottomText")) this.bottom_text = new Text$1(data.bottomText);
		if (Reflect.has(data, "bottomButton")) this.bottom_button = parseItem(data.bottomButton, Button);
		if (Reflect.has(data, "subheaders")) this.subheaders = parseArray(data.subheaders);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicSideAlignedItem.js
var MusicSideAlignedItem = class extends YTNode {
	static type = "MusicSideAlignedItem";
	start_items;
	end_items;
	constructor(data) {
		super();
		if (Reflect.has(data, "startItems")) this.start_items = parseArray(data.startItems);
		if (Reflect.has(data, "endItems")) this.end_items = parseArray(data.endItems);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicSortFilterButton.js
var MusicSortFilterButton = class extends YTNode {
	static type = "MusicSortFilterButton";
	title;
	icon_type;
	menu;
	constructor(data) {
		super();
		this.title = new Text$1(data.title).toString();
		if (Reflect.has(data, "icon")) this.icon_type = data.icon.iconType;
		this.menu = parseItem(data.menu, MusicMultiSelectMenu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicTastebuilderShelfThumbnail.js
var MusicTastebuilderShelfThumbnail = class extends YTNode {
	static type = "MusicTastebuilderShelfThumbnail";
	thumbnail;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicTastebuilderShelf.js
var MusicTasteBuilderShelf = class extends YTNode {
	static type = "MusicTasteBuilderShelf";
	thumbnail;
	primary_text;
	secondary_text;
	action_button;
	is_visible;
	constructor(data) {
		super();
		this.thumbnail = parseItem(data.thumbnail, MusicTastebuilderShelfThumbnail);
		this.primary_text = new Text$1(data.primaryText);
		this.secondary_text = new Text$1(data.secondaryText);
		this.action_button = parseItem(data.actionButton, Button);
		this.is_visible = data.isVisible;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/MusicVisualHeader.js
var MusicVisualHeader = class extends YTNode {
	static type = "MusicVisualHeader";
	title;
	thumbnail;
	menu;
	foreground_thumbnail;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.thumbnail = data.thumbnail ? Thumbnail.fromResponse(data.thumbnail.musicThumbnailRenderer?.thumbnail) : [];
		this.menu = parseItem(data.menu, Menu);
		this.foreground_thumbnail = data.foregroundThumbnail ? Thumbnail.fromResponse(data.foregroundThumbnail.musicThumbnailRenderer?.thumbnail) : [];
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/mweb/MobileTopbar.js
var MobileTopbar = class extends YTNode {
	static type = "MobileTopbar";
	placeholder_text;
	buttons;
	logo_type;
	constructor(data) {
		super();
		this.placeholder_text = new Text$1(data.placeholderText);
		this.buttons = parseArray(data.buttons);
		if (Reflect.has(data, "logo") && Reflect.has(data.logo, "iconType")) this.logo_type = data.logo.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/mweb/MultiPageMenuSection.js
var MultiPageMenuSection = class extends YTNode {
	static type = "MultiPageMenuSection";
	items;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/mweb/PivotBar.js
var PivotBar = class extends YTNode {
	static type = "PivotBar";
	items;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/mweb/PivotBarItem.js
var PivotBarItem = class extends YTNode {
	static type = "PivotBarItem";
	pivot_identifier;
	endpoint;
	title;
	accessibility_label;
	icon_type;
	accessibility;
	constructor(data) {
		super();
		this.pivot_identifier = data.pivotIdentifier;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.title = new Text(data.title);
		if ("accessibility" in data && "accessibilityData" in data.accessibility) this.accessibility = { accessibility_data: new AccessibilityData(data.accessibility.accessibilityData) };
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
	}
	get label() {
		return this.accessibility?.accessibility_data?.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/mweb/TopbarMenuButton.js
var TopbarMenuButton = class extends YTNode {
	static type = "TopbarMenuButton";
	icon_type;
	menu_renderer;
	target_id;
	constructor(data) {
		super();
		if (Reflect.has(data, "icon") && Reflect.has(data.icon, "iconType")) this.icon_type = data.icon.iconType;
		this.menu_renderer = parseItem(data.menuRenderer);
		this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/NotificationAction.js
var NotificationAction = class extends YTNode {
	static type = "NotificationAction";
	response_text;
	constructor(data) {
		super();
		this.response_text = new Text$1(data.responseText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/OpenOnePickAddVideoModalCommand.js
var OpenOnePickAddVideoModalCommand = class extends YTNode {
	static type = "OpenOnePickAddVideoModalCommand";
	list_id;
	modal_title;
	select_button_label;
	constructor(data) {
		super();
		this.list_id = data.listId;
		this.modal_title = data.modalTitle;
		this.select_button_label = data.selectButtonLabel;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PageHeaderView.js
var PageHeaderView = class extends YTNode {
	static type = "PageHeaderView";
	title;
	image;
	animated_image;
	hero_image;
	metadata;
	actions;
	description;
	attributation;
	banner;
	constructor(data) {
		super();
		this.title = parseItem(data.title, DynamicTextView);
		this.image = parseItem(data.image, [ContentPreviewImageView, DecoratedAvatarView]);
		this.animated_image = parseItem(data.animatedImage, ContentPreviewImageView);
		this.hero_image = parseItem(data.heroImage, ContentPreviewImageView);
		this.metadata = parseItem(data.metadata, ContentMetadataView);
		this.actions = parseItem(data.actions, FlexibleActionsView);
		this.description = parseItem(data.description, DescriptionPreviewView);
		this.attributation = parseItem(data.attributation, AttributionView);
		this.banner = parseItem(data.banner, ImageBannerView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PageHeader.js
var PageHeader = class extends YTNode {
	static type = "PageHeader";
	page_title;
	content;
	constructor(data) {
		super();
		this.page_title = data.pageTitle;
		this.content = parseItem(data.content, PageHeaderView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PageIndicatorView.js
var PageIndicatorView = class extends YTNode {
	static type = "PageIndicatorView";
	indicator_count;
	selected_index;
	constructor(data) {
		super();
		this.indicator_count = data.indicatorCount ?? 0;
		this.selected_index = data.selectedIndex ?? 0;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PageIntroduction.js
var PageIntroduction = class extends YTNode {
	static type = "PageIntroduction";
	header_text;
	body_text;
	page_title;
	header_icon_type;
	constructor(data) {
		super();
		this.header_text = new Text$1(data.headerText).toString();
		this.body_text = new Text$1(data.bodyText).toString();
		this.page_title = new Text$1(data.pageTitle).toString();
		this.header_icon_type = data.headerIcon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PivotButton.js
var PivotButton = class extends YTNode {
	static type = "PivotButton";
	thumbnail;
	endpoint;
	content_description;
	target_id;
	sound_attribution_title;
	waveform_animation_style;
	background_animation_style;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.endpoint = new NavigationEndpoint(data.onClickCommand);
		this.content_description = new Text$1(data.contentDescription);
		this.target_id = data.targetId;
		this.sound_attribution_title = new Text$1(data.soundAttributionTitle);
		this.waveform_animation_style = data.waveformAnimationStyle;
		this.background_animation_style = data.backgroundAnimationStyle;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerAnnotationsExpanded.js
var PlayerAnnotationsExpanded = class extends YTNode {
	static type = "PlayerAnnotationsExpanded";
	featured_channel;
	allow_swipe_dismiss;
	annotation_id;
	constructor(data) {
		super();
		if (Reflect.has(data, "featuredChannel")) this.featured_channel = {
			start_time_ms: data.featuredChannel.startTimeMs,
			end_time_ms: data.featuredChannel.endTimeMs,
			watermark: Thumbnail.fromResponse(data.featuredChannel.watermark),
			channel_name: data.featuredChannel.channelName,
			endpoint: new NavigationEndpoint(data.featuredChannel.navigationEndpoint),
			subscribe_button: parseItem(data.featuredChannel.subscribeButton)
		};
		this.allow_swipe_dismiss = data.allowSwipeDismiss;
		this.annotation_id = data.annotationId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerCaptchaView.js
var PlayerCaptchaView = class extends YTNode {
	static type = "PlayerCaptchaView";
	captcha_loading_message;
	challenge_reason;
	captcha_successful_message;
	captcha_cookie_set_failure_message;
	captcha_failed_message;
	constructor(data) {
		super();
		if ("captchaLoadingMessage" in data) this.captcha_loading_message = Text$1.fromAttributed(data.captchaLoadingMessage);
		if ("challengeReason" in data) this.challenge_reason = Text$1.fromAttributed(data.challengeReason);
		if ("captchaSuccessfulMessage" in data) this.captcha_successful_message = Text$1.fromAttributed(data.captchaSuccessfulMessage);
		if ("captchaCookieSetFailureMessage" in data) this.captcha_cookie_set_failure_message = Text$1.fromAttributed(data.captchaCookieSetFailureMessage);
		if ("captchaFailedMessage" in data) this.captcha_failed_message = Text$1.fromAttributed(data.captchaFailedMessage);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerCaptionsTracklist.js
var PlayerCaptionsTracklist = class extends YTNode {
	static type = "PlayerCaptionsTracklist";
	caption_tracks;
	audio_tracks;
	default_audio_track_index;
	translation_languages;
	constructor(data) {
		super();
		if (Reflect.has(data, "captionTracks")) this.caption_tracks = data.captionTracks.map((ct) => ({
			base_url: ct.baseUrl,
			name: new Text$1(ct.name),
			vss_id: ct.vssId,
			language_code: ct.languageCode,
			kind: ct.kind,
			is_translatable: ct.isTranslatable
		}));
		if (Reflect.has(data, "audioTracks")) this.audio_tracks = data.audioTracks.map((at) => ({
			audio_track_id: at.audioTrackId,
			captions_initial_state: at.captionsInitialState,
			default_caption_track_index: at.defaultCaptionTrackIndex,
			has_default_track: at.hasDefaultTrack,
			visibility: at.visibility,
			caption_track_indices: at.captionTrackIndices
		}));
		if (Reflect.has(data, "defaultAudioTrackIndex")) this.default_audio_track_index = data.defaultAudioTrackIndex;
		if (Reflect.has(data, "translationLanguages")) this.translation_languages = data.translationLanguages.map((tl) => ({
			language_code: tl.languageCode,
			language_name: new Text$1(tl.languageName)
		}));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerOverflow.js
var PlayerOverflow = class extends YTNode {
	static type = "PlayerOverflow";
	endpoint;
	enable_listen_first;
	constructor(data) {
		super();
		this.endpoint = new NavigationEndpoint(data.endpoint);
		this.enable_listen_first = data.enableListenFirst;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerControlsOverlay.js
var PlayerControlsOverlay = class extends YTNode {
	static type = "PlayerControlsOverlay";
	overflow;
	constructor(data) {
		super();
		this.overflow = parseItem(data.overflow, PlayerOverflow);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerErrorMessage.js
var PlayerErrorMessage = class extends YTNode {
	static type = "PlayerErrorMessage";
	subreason;
	reason;
	proceed_button;
	thumbnails;
	icon_type;
	constructor(data) {
		super();
		this.subreason = new Text$1(data.subreason);
		this.reason = new Text$1(data.reason);
		this.proceed_button = parseItem(data.proceedButton, Button);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		if (Reflect.has(data, "icon")) this.icon_type = data.icon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerLegacyDesktopYpcOffer.js
var PlayerLegacyDesktopYpcOffer = class extends YTNode {
	static type = "PlayerLegacyDesktopYpcOffer";
	title;
	thumbnail;
	offer_description;
	offer_id;
	constructor(data) {
		super();
		this.title = data.itemTitle;
		this.thumbnail = data.itemThumbnail;
		this.offer_description = data.offerDescription;
		this.offer_id = data.offerId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/YpcTrailer.js
var YpcTrailer = class extends YTNode {
	static type = "YpcTrailer";
	video_message;
	player_response;
	constructor(data) {
		super();
		this.video_message = data.fullVideoMessage;
		this.player_response = data.unserializedPlayerResponse;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerLegacyDesktopYpcTrailer.js
var PlayerLegacyDesktopYpcTrailer = class extends YTNode {
	static type = "PlayerLegacyDesktopYpcTrailer";
	video_id;
	title;
	thumbnail;
	offer_headline;
	offer_description;
	offer_id;
	offer_button_text;
	video_message;
	trailer;
	constructor(data) {
		super();
		this.video_id = data.trailerVideoId;
		this.title = data.itemTitle;
		this.thumbnail = data.itemThumbnail;
		this.offer_headline = data.offerHeadline;
		this.offer_description = data.offerDescription;
		this.offer_id = data.offerId;
		this.offer_button_text = data.offerButtonText;
		this.video_message = data.fullVideoMessage;
		this.trailer = parseItem(data.ypcTrailer, YpcTrailer);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerLiveStoryboardSpec.js
var PlayerLiveStoryboardSpec = class extends YTNode {
	static type = "PlayerLiveStoryboardSpec";
	board;
	constructor(data) {
		super();
		const [template_url, thumbnail_width, thumbnail_height, columns, rows] = data.spec.split("#");
		this.board = {
			type: "live",
			template_url,
			thumbnail_width: parseInt(thumbnail_width, 10),
			thumbnail_height: parseInt(thumbnail_height, 10),
			columns: parseInt(columns, 10),
			rows: parseInt(rows, 10)
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerMicroformat.js
var PlayerMicroformat = class extends YTNode {
	static type = "PlayerMicroformat";
	title;
	description;
	thumbnails;
	embed;
	length_seconds;
	channel;
	is_family_safe;
	is_unlisted;
	has_ypc_metadata;
	view_count;
	category;
	publish_date;
	upload_date;
	available_countries;
	start_timestamp;
	end_timestamp;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.description = new Text$1(data.description);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		if (Reflect.has(data, "embed")) this.embed = {
			iframe_url: data.embed.iframeUrl,
			flash_url: data.embed.flashUrl,
			flash_secure_url: data.embed.flashSecureUrl,
			width: data.embed.width,
			height: data.embed.height
		};
		this.length_seconds = parseInt(data.lengthSeconds);
		this.channel = {
			id: data.externalChannelId,
			name: data.ownerChannelName,
			url: data.ownerProfileUrl
		};
		this.is_family_safe = !!data.isFamilySafe;
		this.is_unlisted = !!data.isUnlisted;
		this.has_ypc_metadata = !!data.hasYpcMetadata;
		this.view_count = parseInt(data.viewCount);
		this.category = data.category;
		this.publish_date = data.publishDate;
		this.upload_date = data.uploadDate;
		this.available_countries = data.availableCountries;
		this.start_timestamp = data.liveBroadcastDetails?.startTimestamp ? new Date(data.liveBroadcastDetails.startTimestamp) : null;
		this.end_timestamp = data.liveBroadcastDetails?.endTimestamp ? new Date(data.liveBroadcastDetails.endTimestamp) : null;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerOverlayAutoplay.js
var PlayerOverlayAutoplay = class extends YTNode {
	static type = "PlayerOverlayAutoplay";
	title;
	video_id;
	video_title;
	short_view_count;
	prefer_immediate_redirect;
	count_down_secs_for_fullscreen;
	published;
	background;
	thumbnail_overlays;
	author;
	cancel_button;
	next_button;
	close_button;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.video_id = data.videoId;
		this.video_title = new Text$1(data.videoTitle);
		this.short_view_count = new Text$1(data.shortViewCountText);
		this.prefer_immediate_redirect = data.preferImmediateRedirect;
		this.count_down_secs_for_fullscreen = data.countDownSecsForFullscreen;
		this.published = new Text$1(data.publishedTimeText);
		this.background = Thumbnail.fromResponse(data.background);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		this.author = new Author(data.byline);
		this.cancel_button = parseItem(data.cancelButton, Button);
		this.next_button = parseItem(data.nextButton, Button);
		this.close_button = parseItem(data.closeButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerOverlayVideoDetails.js
var PlayerOverlayVideoDetails = class extends YTNode {
	static type = "PlayerOverlayVideoDetails";
	title;
	subtitle;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/WatchNextEndScreen.js
var WatchNextEndScreen = class extends YTNode {
	static type = "WatchNextEndScreen";
	results;
	title;
	constructor(data) {
		super();
		this.results = parseArray(data.results, [EndScreenVideo, EndScreenPlaylist]);
		this.title = new Text$1(data.title).toString();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlayerOverlay.js
var PlayerOverlay = class extends YTNode {
	static type = "PlayerOverlay";
	end_screen;
	autoplay;
	share_button;
	add_to_menu;
	fullscreen_engagement;
	actions;
	browser_media_session;
	decorated_player_bar;
	video_details;
	constructor(data) {
		super();
		this.end_screen = parseItem(data.endScreen, WatchNextEndScreen);
		this.autoplay = parseItem(data.autoplay, PlayerOverlayAutoplay);
		this.share_button = parseItem(data.shareButton, Button);
		this.add_to_menu = parseItem(data.addToMenu, Menu);
		this.fullscreen_engagement = parseItem(data.fullscreenEngagement);
		this.actions = parseArray(data.actions);
		this.browser_media_session = parseItem(data.browserMediaSession);
		this.decorated_player_bar = parseItem(data.decoratedPlayerBarRenderer, DecoratedPlayerBar);
		this.video_details = parseItem(data.videoDetails, PlayerOverlayVideoDetails);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistHeader.js
var PlaylistHeader = class extends YTNode {
	static type = "PlaylistHeader";
	id;
	title;
	subtitle;
	stats;
	brief_stats;
	author;
	description;
	num_videos;
	view_count;
	can_share;
	can_delete;
	is_editable;
	privacy;
	save_button;
	shuffle_play_button;
	menu;
	banner;
	constructor(data) {
		super();
		this.id = data.playlistId;
		this.title = new Text$1(data.title);
		this.subtitle = data.subtitle ? new Text$1(data.subtitle) : null;
		this.stats = data.stats.map((stat) => new Text$1(stat));
		this.brief_stats = data.briefStats.map((stat) => new Text$1(stat));
		this.author = data.ownerText || data.ownerEndpoint ? new Author({
			...data.ownerText,
			navigationEndpoint: data.ownerEndpoint
		}, data.ownerBadges, null) : null;
		this.description = new Text$1(data.descriptionText);
		this.num_videos = new Text$1(data.numVideosText);
		this.view_count = new Text$1(data.viewCountText);
		this.can_share = data.shareData.canShare;
		this.can_delete = data.editableDetails.canDelete;
		this.is_editable = data.isEditable;
		this.privacy = data.privacy;
		this.save_button = parseItem(data.saveButton);
		this.shuffle_play_button = parseItem(data.shufflePlayButton);
		this.menu = parseItem(data.moreActionsMenu);
		this.banner = parseItem(data.playlistHeaderBanner);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistInfoCardContent.js
var PlaylistInfoCardContent = class extends YTNode {
	static type = "PlaylistInfoCardContent";
	title;
	thumbnails;
	video_count;
	channel_name;
	endpoint;
	constructor(data) {
		super();
		this.title = new Text$1(data.playlistTitle);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.video_count = new Text$1(data.playlistVideoCount);
		this.channel_name = new Text$1(data.channelName);
		this.endpoint = new NavigationEndpoint(data.action);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistMetadata.js
var PlaylistMetadata = class extends YTNode {
	static type = "PlaylistMetadata";
	title;
	description;
	constructor(data) {
		super();
		this.title = data.title;
		this.description = data.description || null;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistSidebar.js
var PlaylistSidebar = class extends YTNode {
	static type = "PlaylistSidebar";
	items;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistSidebarPrimaryInfo.js
var PlaylistSidebarPrimaryInfo = class extends YTNode {
	static type = "PlaylistSidebarPrimaryInfo";
	stats;
	thumbnail_renderer;
	title;
	menu;
	endpoint;
	description;
	constructor(data) {
		super();
		this.stats = data.stats.map((stat) => new Text$1(stat));
		this.thumbnail_renderer = parseItem(data.thumbnailRenderer);
		this.title = new Text$1(data.title);
		this.menu = parseItem(data.menu);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.description = new Text$1(data.description);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistSidebarSecondaryInfo.js
var PlaylistSidebarSecondaryInfo = class extends YTNode {
	static type = "PlaylistSidebarSecondaryInfo";
	owner;
	button;
	constructor(data) {
		super();
		this.owner = parseItem(data.videoOwner);
		this.button = parseItem(data.button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistThumbnailOverlay.js
var PlaylistThumbnailOverlay = class extends YTNode {
	static type = "PlaylistThumbnailOverlay";
	icon_type;
	text;
	constructor(data) {
		super();
		if (Reflect.has(data, "icon")) this.icon_type = data.icon.iconType;
		this.text = new Text$1(data.text);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistVideo.js
var PlaylistVideo = class extends YTNode {
	static type = "PlaylistVideo";
	id;
	index;
	title;
	author;
	thumbnails;
	thumbnail_overlays;
	set_video_id;
	endpoint;
	is_playable;
	menu;
	upcoming;
	video_info;
	accessibility_label;
	style;
	duration;
	constructor(data) {
		super();
		this.id = data.videoId;
		this.index = new Text$1(data.index);
		this.title = new Text$1(data.title);
		this.author = new Author(data.shortBylineText);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.thumbnail_overlays = parseArray(data.thumbnailOverlays);
		this.set_video_id = data?.setVideoId;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.is_playable = data.isPlayable;
		this.menu = parseItem(data.menu, Menu);
		this.video_info = new Text$1(data.videoInfo);
		this.accessibility_label = data.title.accessibility.accessibilityData.label;
		if (Reflect.has(data, "style")) this.style = data.style;
		const upcoming = data.upcomingEventData && Number(`${data.upcomingEventData.startTime}000`);
		if (upcoming) this.upcoming = new Date(upcoming);
		this.duration = {
			text: new Text$1(data.lengthText).toString(),
			seconds: parseInt(data.lengthSeconds)
		};
	}
	get is_live() {
		return this.thumbnail_overlays.firstOfType(ThumbnailOverlayTimeStatus)?.style === "LIVE";
	}
	get is_upcoming() {
		return this.thumbnail_overlays.firstOfType(ThumbnailOverlayTimeStatus)?.style === "UPCOMING";
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PlaylistVideoList.js
var PlaylistVideoList = class extends YTNode {
	static type = "PlaylistVideoList";
	id;
	is_editable;
	can_reorder;
	videos;
	constructor(data) {
		super();
		this.id = data.playlistId;
		this.is_editable = data.isEditable;
		this.can_reorder = data.canReorder;
		this.videos = parseArray(data.contents);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Poll.js
var Poll = class extends YTNode {
	static type = "Poll";
	choices;
	poll_type;
	total_votes;
	live_chat_poll_id;
	constructor(data) {
		super();
		this.choices = data.choices.map((choice) => ({
			text: new Text$1(choice.text),
			select_endpoint: choice.selectServiceEndpoint ? new NavigationEndpoint(choice.selectServiceEndpoint) : null,
			deselect_endpoint: choice.deselectServiceEndpoint ? new NavigationEndpoint(choice.deselectServiceEndpoint) : null,
			vote_ratio_if_selected: choice?.voteRatioIfSelected || null,
			vote_percentage_if_selected: new Text$1(choice.votePercentageIfSelected),
			vote_ratio_if_not_selected: choice?.voteRatioIfSelected || null,
			vote_percentage_if_not_selected: new Text$1(choice.votePercentageIfSelected),
			image: choice.image ? Thumbnail.fromResponse(choice.image) : null
		}));
		if (Reflect.has(data, "type")) this.poll_type = data.type;
		if (Reflect.has(data, "totalVotes")) this.total_votes = new Text$1(data.totalVotes);
		if (Reflect.has(data, "liveChatPollId")) this.live_chat_poll_id = data.liveChatPollId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Post.js
var Post = class extends BackstagePost {
	static type = "Post";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PostMultiImage.js
var PostMultiImage = class extends YTNode {
	static type = "PostMultiImage";
	images;
	constructor(data) {
		super();
		this.images = parseArray(data.images, BackstageImage);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/PremiereTrailerBadge.js
var PremiereTrailerBadge = class extends YTNode {
	static type = "PremiereTrailerBadge";
	label;
	constructor(data) {
		super();
		this.label = new Text$1(data.label);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ProductListHeader.js
var ProductListHeader = class extends YTNode {
	static type = "ProductListHeader";
	title;
	suppress_padding_disclaimer;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.suppress_padding_disclaimer = !!data.suppressPaddingDisclaimer;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ProductListItem.js
var ProductListItem = class extends YTNode {
	static type = "ProductListItem";
	title;
	accessibility_title;
	thumbnail;
	price;
	endpoint;
	merchant_name;
	stay_in_app;
	view_button;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.accessibility_title = data.accessibilityTitle;
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.price = data.price;
		this.endpoint = new NavigationEndpoint(data.onClickCommand);
		this.merchant_name = data.merchantName;
		this.stay_in_app = !!data.stayInApp;
		this.view_button = parseItem(data.viewButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ProfileColumn.js
var ProfileColumn = class extends YTNode {
	static type = "ProfileColumn";
	items;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ProfileColumnStats.js
var ProfileColumnStats = class extends YTNode {
	static type = "ProfileColumnStats";
	items;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ProfileColumnStatsEntry.js
var ProfileColumnStatsEntry = class extends YTNode {
	static type = "ProfileColumnStatsEntry";
	label;
	value;
	constructor(data) {
		super();
		this.label = new Text$1(data.label);
		this.value = new Text$1(data.value);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ProfileColumnUserInfo.js
var ProfileColumnUserInfo = class extends YTNode {
	static type = "ProfileColumnUserInfo";
	title;
	thumbnails;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Quiz.js
var Quiz = class extends YTNode {
	static type = "Quiz";
	choices;
	total_votes;
	constructor(data) {
		super();
		this.choices = data.choices.map((choice) => ({
			text: new Text$1(choice.text),
			is_correct: choice.isCorrect
		}));
		this.total_votes = new Text$1(data.totalVotes);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RecognitionShelf.js
var RecognitionShelf = class extends YTNode {
	static type = "RecognitionShelf";
	title;
	subtitle;
	avatars;
	button;
	surface;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
		this.avatars = data.avatars.map((avatar) => new Thumbnail(avatar));
		this.button = parseItem(data.button, Button);
		this.surface = data.surface;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ReelItem.js
var ReelItem = class extends YTNode {
	static type = "ReelItem";
	id;
	title;
	thumbnails;
	views;
	endpoint;
	accessibility;
	constructor(data) {
		super();
		this.id = data.videoId;
		this.title = new Text$1(data.headline);
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.views = new Text$1(data.viewCountText);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		if ("accessibility" in data && "accessibilityData" in data.accessibility) this.accessibility = { accessibility_data: new AccessibilityData(data.accessibility.accessibilityData) };
	}
	get label() {
		return this.accessibility?.accessibility_data?.label;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ReelPlayerHeader.js
var ReelPlayerHeader = class extends YTNode {
	static type = "ReelPlayerHeader";
	reel_title_text;
	timestamp_text;
	channel_title_text;
	channel_thumbnail;
	author;
	constructor(data) {
		super();
		this.reel_title_text = new Text$1(data.reelTitleText);
		this.timestamp_text = new Text$1(data.timestampText);
		this.channel_title_text = new Text$1(data.channelTitleText);
		this.channel_thumbnail = Thumbnail.fromResponse(data.channelThumbnail);
		this.author = new Author(data.channelNavigationEndpoint, void 0);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ReelPlayerOverlay.js
var ReelPlayerOverlay = class extends YTNode {
	static type = "ReelPlayerOverlay";
	like_button;
	reel_player_header_supported_renderers;
	menu;
	next_item_button;
	prev_item_button;
	subscribe_button_renderer;
	style;
	view_comments_button;
	share_button;
	pivot_button;
	info_panel;
	constructor(data) {
		super();
		this.like_button = parseItem(data.likeButton, LikeButton);
		this.reel_player_header_supported_renderers = parseItem(data.reelPlayerHeaderSupportedRenderers, ReelPlayerHeader);
		this.menu = parseItem(data.menu, Menu);
		this.next_item_button = parseItem(data.nextItemButton, Button);
		this.prev_item_button = parseItem(data.prevItemButton, Button);
		this.subscribe_button_renderer = parseItem(data.subscribeButtonRenderer, [Button, SubscribeButton]);
		this.style = data.style;
		this.view_comments_button = parseItem(data.viewCommentsButton, Button);
		this.share_button = parseItem(data.shareButton, Button);
		this.pivot_button = parseItem(data.pivotButton, PivotButton);
		this.info_panel = parseItem(data.infoPanel, InfoPanelContainer);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RichGrid.js
var RichGrid = class extends YTNode {
	static type = "RichGrid";
	header;
	contents;
	target_id;
	constructor(data) {
		super();
		this.header = parseItem(data.header);
		this.contents = parseArray(data.contents);
		if (Reflect.has(data, "targetId")) this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RichItem.js
var RichItem = class extends YTNode {
	static type = "RichItem";
	content;
	constructor(data) {
		super();
		this.content = parseItem(data.content);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RichListHeader.js
var RichListHeader = class extends YTNode {
	static type = "RichListHeader";
	title;
	subtitle;
	title_style;
	icon_type;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
		if (Reflect.has(data, "titleStyle")) this.title_style = data.titleStyle.style;
		if (Reflect.has(data, "icon")) this.icon_type = data.icon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RichMetadata.js
var RichMetadata = class extends YTNode {
	static type = "RichMetadata";
	thumbnail;
	title;
	subtitle;
	call_to_action;
	icon_type;
	endpoint;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
		this.call_to_action = new Text$1(data.callToAction);
		if (Reflect.has(data, "callToActionIcon")) this.icon_type = data.callToActionIcon.iconType;
		this.endpoint = new NavigationEndpoint(data.endpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RichMetadataRow.js
var RichMetadataRow = class extends YTNode {
	static type = "RichMetadataRow";
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RichSection.js
var RichSection = class extends YTNode {
	static type = "RichSection";
	content;
	full_bleed;
	target_id;
	constructor(data) {
		super();
		this.content = parseItem(data.content);
		this.full_bleed = !!data.fullBleed;
		if ("targetId" in data) this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/RichShelf.js
var RichShelf = class extends YTNode {
	static type = "RichShelf";
	title;
	contents;
	endpoint;
	subtitle;
	is_expanded;
	is_bottom_divider_hidden;
	is_top_divider_hidden;
	layout_sizing;
	icon_type;
	menu;
	next_button;
	previous_button;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.contents = parseArray(data.contents);
		this.is_expanded = !!data.is_expanded;
		this.is_bottom_divider_hidden = !!data.isBottomDividerHidden;
		this.is_top_divider_hidden = !!data.isTopDividerHidden;
		if ("endpoint" in data) this.endpoint = new NavigationEndpoint(data.endpoint);
		if ("subtitle" in data) this.subtitle = new Text$1(data.subtitle);
		if ("layoutSizing" in data) this.layout_sizing = data.layoutSizing;
		if ("icon" in data) this.icon_type = data.icon.iconType;
		this.menu = parseItem(data.menu);
		this.next_button = parseItem(data.nextButton);
		this.previous_button = parseItem(data.previousButton);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchFilter.js
var SearchFilter = class extends YTNode {
	static type = "SearchFilter";
	label;
	endpoint;
	tooltip;
	status;
	constructor(data) {
		super();
		this.label = new Text$1(data.label);
		this.endpoint = new NavigationEndpoint(data.endpoint || data.navigationEndpoint);
		this.tooltip = data.tooltip;
		if (Reflect.has(data, "status")) this.status = data.status;
	}
	get disabled() {
		return this.status === "FILTER_STATUS_DISABLED";
	}
	get selected() {
		return this.status === "FILTER_STATUS_SELECTED";
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchFilterGroup.js
var SearchFilterGroup = class extends YTNode {
	static type = "SearchFilterGroup";
	title;
	filters;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.filters = parseArray(data.filters, SearchFilter);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchFilterOptionsDialog.js
var SearchFilterOptionsDialog = class extends YTNode {
	static type = "SearchFilterOptionsDialog";
	title;
	groups;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.groups = parseArray(data.groups, SearchFilterGroup);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchHeader.js
var SearchHeader = class extends YTNode {
	static type = "SearchHeader";
	chip_bar;
	search_filter_button;
	constructor(data) {
		super();
		this.chip_bar = parseItem(data.chipBar, ChipCloud);
		this.search_filter_button = parseItem(data.searchFilterButton, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchSubMenu.js
var SearchSubMenu = class extends YTNode {
	static type = "SearchSubMenu";
	title;
	groups;
	button;
	constructor(data) {
		super();
		if (Reflect.has(data, "title")) this.title = new Text$1(data.title);
		if (Reflect.has(data, "groups")) this.groups = parseArray(data.groups, SearchFilterGroup);
		if (Reflect.has(data, "button")) this.button = parseItem(data.button, ToggleButton);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SearchSuggestionsSection.js
var SearchSuggestionsSection = class extends YTNode {
	static type = "SearchSuggestionsSection";
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/UniversalWatchCard.js
var UniversalWatchCard = class extends YTNode {
	static type = "UniversalWatchCard";
	header;
	call_to_action;
	sections;
	collapsed_label;
	constructor(data) {
		super();
		this.header = parseItem(data.header);
		this.call_to_action = parseItem(data.callToAction);
		this.sections = parseArray(data.sections);
		if (Reflect.has(data, "collapsedLabel")) this.collapsed_label = new Text$1(data.collapsedLabel);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SecondarySearchContainer.js
var SecondarySearchContainer = class extends YTNode {
	static type = "SecondarySearchContainer";
	target_id;
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents, [UniversalWatchCard]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SegmentedLikeDislikeButton.js
var SegmentedLikeDislikeButton = class extends YTNode {
	static type = "SegmentedLikeDislikeButton";
	like_button;
	dislike_button;
	constructor(data) {
		super();
		this.like_button = parseItem(data.likeButton, [ToggleButton, Button]);
		this.dislike_button = parseItem(data.dislikeButton, [ToggleButton, Button]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SettingBoolean.js
var SettingBoolean = class extends YTNode {
	static type = "SettingBoolean";
	title;
	summary;
	enable_endpoint;
	disable_endpoint;
	item_id;
	constructor(data) {
		super();
		if (Reflect.has(data, "title")) this.title = new Text$1(data.title);
		if (Reflect.has(data, "summary")) this.summary = new Text$1(data.summary);
		if (Reflect.has(data, "enableServiceEndpoint")) this.enable_endpoint = new NavigationEndpoint(data.enableServiceEndpoint);
		if (Reflect.has(data, "disableServiceEndpoint")) this.disable_endpoint = new NavigationEndpoint(data.disableServiceEndpoint);
		this.item_id = data.itemId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SettingsCheckbox.js
var SettingsCheckbox = class extends YTNode {
	static type = "SettingsCheckbox";
	title;
	help_text;
	enabled;
	disabled;
	id;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.help_text = new Text$1(data.helpText);
		this.enabled = data.enabled;
		this.disabled = data.disabled;
		this.id = data.id;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SettingsSwitch.js
var SettingsSwitch = class extends YTNode {
	static type = "SettingsSwitch";
	title;
	subtitle;
	enabled;
	enable_endpoint;
	disable_endpoint;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
		this.enabled = data.enabled;
		this.enable_endpoint = new NavigationEndpoint(data.enableServiceEndpoint);
		this.disable_endpoint = new NavigationEndpoint(data.disableServiceEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SettingsOptions.js
var SettingsOptions = class extends YTNode {
	static type = "SettingsOptions";
	title;
	text;
	options;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		if (Reflect.has(data, "text")) this.text = new Text$1(data.text).toString();
		if (Reflect.has(data, "options")) this.options = parseArray(data.options, [
			SettingsSwitch,
			Dropdown,
			CopyLink,
			SettingsCheckbox,
			ChannelOptions
		]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SettingsSidebar.js
var SettingsSidebar = class extends YTNode {
	static type = "SettingsSidebar";
	title;
	items;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.items = parseArray(data.items, CompactLink);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SharedPost.js
var SharedPost = class extends YTNode {
	static type = "SharedPost";
	thumbnail;
	content;
	published;
	menu;
	original_post;
	id;
	endpoint;
	expand_button;
	author;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.content = new Text$1(data.content);
		this.published = new Text$1(data.publishedTimeText);
		this.menu = parseItem(data.actionMenu, Menu);
		this.original_post = parseItem(data.originalPost, [BackstagePost, Post]);
		this.id = data.postId;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.expand_button = parseItem(data.expandButton, Button);
		this.author = new Author(data.displayName, void 0);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SharePanelHeader.js
var SharePanelHeader = class extends YTNode {
	static type = "SharePanelHeader";
	title;
	constructor(data) {
		super();
		this.title = parseItem(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SharePanelTitleV15.js
var SharePanelTitleV15 = class extends YTNode {
	static type = "SharePanelTitleV15";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ShareTarget.js
var ShareTarget = class extends YTNode {
	static type = "ShareTarget";
	endpoint;
	service_name;
	target_id;
	title;
	constructor(data) {
		super();
		if (Reflect.has(data, "serviceEndpoint")) this.endpoint = new NavigationEndpoint(data.serviceEndpoint);
		else if (Reflect.has(data, "navigationEndpoint")) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.service_name = data.serviceName;
		this.target_id = data.targetId;
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SheetView.js
var SheetView = class extends YTNode {
	static type = "SheetView";
	content;
	footer;
	header;
	renderer_context;
	constructor(data) {
		super();
		this.content = parseItem(data.content);
		this.footer = parseItem(data.footer);
		this.header = parseItem(data.header);
		if ("rendererContext" in data) this.renderer_context = new RendererContext(data.rendererContext);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Shelf.js
var Shelf = class extends YTNode {
	static type = "Shelf";
	title;
	endpoint;
	content;
	icon_type;
	menu;
	play_all_button;
	subtitle;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		if (Reflect.has(data, "endpoint")) this.endpoint = new NavigationEndpoint(data.endpoint);
		this.content = parseItem(data.content);
		if (Reflect.has(data, "icon")) this.icon_type = data.icon.iconType;
		if (Reflect.has(data, "menu")) this.menu = parseItem(data.menu);
		if (Reflect.has(data, "playAllButton")) this.play_all_button = parseItem(data.playAllButton, Button);
		if (Reflect.has(data, "subtitle")) this.subtitle = new Text$1(data.subtitle);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ShortsLockupView.js
var ShortsLockupView = class extends YTNode {
	static type = "ShortsLockupView";
	entity_id;
	accessibility_text;
	thumbnail;
	on_tap_endpoint;
	menu_on_tap;
	index_in_collection;
	menu_on_tap_a11y_label;
	overlay_metadata;
	inline_player_data;
	badge;
	constructor(data) {
		super();
		this.entity_id = data.entityId;
		this.accessibility_text = data.accessibilityText;
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.on_tap_endpoint = new NavigationEndpoint(data.onTap);
		this.menu_on_tap = new NavigationEndpoint(data.menuOnTap);
		this.index_in_collection = data.indexInCollection;
		this.menu_on_tap_a11y_label = data.menuOnTapA11yLabel;
		this.overlay_metadata = {
			primary_text: data.overlayMetadata.primaryText ? Text$1.fromAttributed(data.overlayMetadata.primaryText) : void 0,
			secondary_text: data.overlayMetadata.secondaryText ? Text$1.fromAttributed(data.overlayMetadata.secondaryText) : void 0
		};
		if (data.inlinePlayerData?.onVisible) this.inline_player_data = new NavigationEndpoint(data.inlinePlayerData.onVisible);
		if (data.badge) this.badge = parseItem(data.badge, BadgeView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ShowingResultsFor.js
var ShowingResultsFor = class extends YTNode {
	static type = "ShowingResultsFor";
	corrected_query;
	original_query;
	corrected_query_endpoint;
	original_query_endpoint;
	search_instead_for;
	showing_results_for;
	constructor(data) {
		super();
		this.corrected_query = new Text$1(data.correctedQuery);
		this.original_query = new Text$1(data.originalQuery);
		this.corrected_query_endpoint = new NavigationEndpoint(data.correctedQueryEndpoint);
		this.original_query_endpoint = new NavigationEndpoint(data.originalQueryEndpoint);
		this.search_instead_for = new Text$1(data.searchInsteadFor);
		this.showing_results_for = new Text$1(data.showingResultsFor);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SimpleCardContent.js
var SimpleCardContent = class extends YTNode {
	static type = "SimpleCardContent";
	image;
	title;
	display_domain;
	show_link_icon;
	call_to_action;
	endpoint;
	constructor(data) {
		super();
		this.image = Thumbnail.fromResponse(data.image);
		this.title = new Text$1(data.title);
		this.display_domain = new Text$1(data.displayDomain);
		this.show_link_icon = data.showLinkIcon;
		this.call_to_action = new Text$1(data.callToAction);
		this.endpoint = new NavigationEndpoint(data.command);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SimpleCardTeaser.js
var SimpleCardTeaser = class extends YTNode {
	static type = "SimpleCardTeaser";
	message;
	prominent;
	constructor(data) {
		super();
		this.message = new Text$1(data.message);
		this.prominent = data.prominent;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SimpleTextSection.js
var SimpleTextSection = class extends YTNode {
	static type = "SimpleTextSection";
	lines;
	style;
	constructor(data) {
		super();
		this.lines = data.lines.map((line) => new Text$1(line));
		this.style = data.layoutStyle;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SingleActionEmergencySupport.js
var SingleActionEmergencySupport = class extends YTNode {
	static type = "SingleActionEmergencySupport";
	action_text;
	nav_text;
	details;
	icon_type;
	endpoint;
	constructor(data) {
		super();
		this.action_text = new Text$1(data.actionText);
		this.nav_text = new Text$1(data.navigationText);
		this.details = new Text$1(data.detailsText);
		this.icon_type = data.icon.iconType;
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Tab.js
var Tab = class extends YTNode {
	static type = "Tab";
	title;
	selected;
	endpoint;
	content;
	constructor(data) {
		super();
		this.title = data.title || "N/A";
		this.selected = !!data.selected;
		this.endpoint = new NavigationEndpoint(data.endpoint);
		this.content = parseItem(data.content, [
			SectionList,
			MusicQueue,
			RichGrid
		]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SingleColumnBrowseResults.js
var SingleColumnBrowseResults = class extends YTNode {
	static type = "SingleColumnBrowseResults";
	tabs;
	constructor(data) {
		super();
		this.tabs = parseArray(data.tabs, Tab);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SingleColumnMusicWatchNextResults.js
var SingleColumnMusicWatchNextResults = class extends YTNode {
	static type = "SingleColumnMusicWatchNextResults";
	contents;
	constructor(data) {
		super();
		this.contents = parse(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SingleHeroImage.js
var SingleHeroImage = class extends YTNode {
	static type = "SingleHeroImage";
	thumbnails;
	style;
	constructor(data) {
		super();
		this.thumbnails = Thumbnail.fromResponse(data.thumbnail);
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SlimOwner.js
var SlimOwner = class extends YTNode {
	static type = "SlimOwner";
	thumbnail;
	title;
	endpoint;
	subscribe_button;
	constructor(data) {
		super();
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.title = new Text$1(data.title);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.subscribe_button = parseItem(data.subscribeButton, SubscribeButton);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/SlimVideoMetadata.js
var SlimVideoMetadata = class extends YTNode {
	static type = "SlimVideoMetadata";
	title;
	collapsed_subtitle;
	expanded_subtitle;
	owner;
	description;
	video_id;
	date;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.collapsed_subtitle = new Text$1(data.collapsedSubtitle);
		this.expanded_subtitle = new Text$1(data.expandedSubtitle);
		this.owner = parseItem(data.owner);
		this.description = new Text$1(data.description);
		this.video_id = data.videoId;
		this.date = new Text$1(data.dateText);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/StartAt.js
var StartAt = class extends YTNode {
	static type = "StartAt";
	start_at_option_label;
	constructor(data) {
		super();
		this.start_at_option_label = new Text$1(data.startAtOptionLabel);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Tabbed.js
var Tabbed = class extends YTNode {
	static type = "Tabbed";
	contents;
	constructor(data) {
		super();
		this.contents = parse(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TabbedSearchResults.js
var TabbedSearchResults = class extends YTNode {
	static type = "TabbedSearchResults";
	tabs;
	constructor(data) {
		super();
		this.tabs = parseArray(data.tabs, Tab);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TextHeader.js
var TextHeader = class extends YTNode {
	static type = "TextHeader";
	title;
	style;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThirdPartyShareTargetSection.js
var ThirdPartyShareTargetSection = class extends YTNode {
	static type = "ThirdPartyShareTargetSection";
	share_targets;
	constructor(data) {
		super();
		this.share_targets = parseArray(data.shareTargets, ShareTarget);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailLandscapePortrait.js
var ThumbnailLandscapePortrait = class extends YTNode {
	static type = "ThumbnailLandscapePortrait";
	landscape;
	portrait;
	constructor(data) {
		super();
		this.landscape = Thumbnail.fromResponse(data.landscape);
		this.portrait = Thumbnail.fromResponse(data.portrait);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayAvatarStackView.js
var ThumbnailOverlayAvatarStackView = class extends YTNode {
	static type = "ThumbnailOverlayAvatarStackView";
	avatar_stack;
	constructor(data) {
		super();
		this.avatar_stack = parseItem(data.avatarStack, AvatarStackView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayEndorsement.js
var ThumbnailOverlayEndorsement = class extends YTNode {
	static type = "ThumbnailOverlayEndorsement";
	text;
	constructor(data) {
		super();
		this.text = new Text$1(data.text).toString();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayHoverText.js
var ThumbnailOverlayHoverText = class extends YTNode {
	static type = "ThumbnailOverlayHoverText";
	text;
	icon_type;
	constructor(data) {
		super();
		this.text = new Text$1(data.text);
		this.icon_type = data.icon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayInlineUnplayable.js
var ThumbnailOverlayInlineUnplayable = class extends YTNode {
	static type = "ThumbnailOverlayInlineUnplayable";
	text;
	icon_type;
	constructor(data) {
		super();
		this.text = new Text$1(data.text).toString();
		this.icon_type = data.icon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayLoadingPreview.js
var ThumbnailOverlayLoadingPreview = class extends YTNode {
	static type = "ThumbnailOverlayLoadingPreview";
	text;
	constructor(data) {
		super();
		this.text = new Text$1(data.text);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayNowPlaying.js
var ThumbnailOverlayNowPlaying = class extends YTNode {
	static type = "ThumbnailOverlayNowPlaying";
	text;
	constructor(data) {
		super();
		this.text = new Text$1(data.text).toString();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayPinking.js
var ThumbnailOverlayPinking = class extends YTNode {
	static type = "ThumbnailOverlayPinking";
	hack;
	constructor(data) {
		super();
		this.hack = data.hack;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayPlaybackStatus.js
var ThumbnailOverlayPlaybackStatus = class extends YTNode {
	static type = "ThumbnailOverlayPlaybackStatus";
	texts;
	constructor(data) {
		super();
		this.texts = data.texts.map((text) => new Text$1(text));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayResumePlayback.js
var ThumbnailOverlayResumePlayback = class extends YTNode {
	static type = "ThumbnailOverlayResumePlayback";
	percent_duration_watched;
	constructor(data) {
		super();
		this.percent_duration_watched = data.percentDurationWatched;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlaySidePanel.js
var ThumbnailOverlaySidePanel = class extends YTNode {
	static type = "ThumbnailOverlaySidePanel";
	text;
	icon_type;
	constructor(data) {
		super();
		this.text = new Text$1(data.text);
		this.icon_type = data.icon.iconType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayTitleView.js
var ThumbnailOverlayTitleView = class extends YTNode {
	static type = "ThumbnailOverlayTitleView";
	title;
	subtitle;
	constructor(data) {
		super();
		this.title = data.title?.content ?? "";
		this.subtitle = data.subtitle?.content ?? "";
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ThumbnailOverlayToggleButton.js
var ThumbnailOverlayToggleButton = class extends YTNode {
	static type = "ThumbnailOverlayToggleButton";
	is_toggled;
	icon_type;
	tooltip;
	toggled_endpoint;
	untoggled_endpoint;
	constructor(data) {
		super();
		if (Reflect.has(data, "isToggled")) this.is_toggled = data.isToggled;
		this.icon_type = {
			toggled: data.toggledIcon.iconType,
			untoggled: data.untoggledIcon.iconType
		};
		this.tooltip = {
			toggled: data.toggledTooltip,
			untoggled: data.untoggledTooltip
		};
		if (data.toggledServiceEndpoint) this.toggled_endpoint = new NavigationEndpoint(data.toggledServiceEndpoint);
		if (data.untoggledServiceEndpoint) this.untoggled_endpoint = new NavigationEndpoint(data.untoggledServiceEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TicketEvent.js
var TicketEvent = class extends YTNode {
	static type = "TicketEvent";
	title;
	time_month;
	time_day;
	link_text;
	button_text;
	endpoint;
	subtitle1;
	subtitle2;
	time_date;
	time_time;
	time_weekday;
	button_accessibility_text;
	has_multiple_offers;
	constructor(data) {
		super();
		this.title = data.title;
		this.time_month = data.timeMonth;
		this.time_day = data.timeDay;
		this.link_text = data.linkText;
		this.button_text = data.buttonText;
		this.endpoint = new NavigationEndpoint(data.buttonCommand);
		this.subtitle1 = data.subtitle1;
		this.subtitle2 = data.subtitle2;
		this.time_date = data.timeDate;
		this.time_time = data.timeTime;
		this.time_weekday = data.timeWeekday;
		this.button_accessibility_text = data.buttonAccessibilityText;
		this.has_multiple_offers = data.hasMultipleOffers;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TicketShelf.js
var TicketShelf = class extends YTNode {
	static type = "TicketShelf";
	title;
	events;
	information_text;
	use_calendar_avatar;
	constructor(data) {
		super();
		this.title = data.title;
		this.events = parseArray(data.events, TicketEvent);
		this.information_text = data.informationText;
		this.use_calendar_avatar = data.useCalendarAvatar;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TitleAndButtonListHeader.js
var TitleAndButtonListHeader = class extends YTNode {
	static type = "TitleAndButtonListHeader";
	title;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ToggleMenuServiceItem.js
var ToggleMenuServiceItem = class extends YTNode {
	static type = "ToggleMenuServiceItem";
	text;
	toggled_text;
	icon_type;
	toggled_icon_type;
	default_endpoint;
	toggled_endpoint;
	constructor(data) {
		super();
		this.text = new Text$1(data.defaultText);
		this.toggled_text = new Text$1(data.toggledText);
		this.icon_type = data.defaultIcon.iconType;
		this.toggled_icon_type = data.toggledIcon.iconType;
		this.default_endpoint = new NavigationEndpoint(data.defaultServiceEndpoint);
		this.toggled_endpoint = new NavigationEndpoint(data.toggledServiceEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/Tooltip.js
var Tooltip = class extends YTNode {
	static type = "Tooltip";
	promo_config;
	target_id;
	details;
	suggested_position;
	dismiss_stratedy;
	dwell_time_ms;
	constructor(data) {
		super();
		this.promo_config = {
			promo_id: data.promoConfig.promoId,
			impression_endpoints: data.promoConfig.impressionEndpoints.map((endpoint) => new NavigationEndpoint(endpoint)),
			accept: new NavigationEndpoint(data.promoConfig.acceptCommand),
			dismiss: new NavigationEndpoint(data.promoConfig.dismissCommand)
		};
		this.target_id = data.targetId;
		this.details = new Text$1(data.detailsText);
		this.suggested_position = data.suggestedPosition.type;
		this.dismiss_stratedy = data.dismissStrategy.type;
		this.dwell_time_ms = parseInt(data.dwellTimeMs);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TopicChannelDetails.js
var TopicChannelDetails = class extends YTNode {
	static type = "TopicChannelDetails";
	title;
	avatar;
	subtitle;
	subscribe_button;
	endpoint;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.avatar = Thumbnail.fromResponse(data.thumbnail ?? data.avatar);
		this.subtitle = new Text$1(data.subtitle);
		this.subscribe_button = parseItem(data.subscribeButton, SubscribeButton);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TwoColumnBrowseResults.js
var TwoColumnBrowseResults = class extends YTNode {
	static type = "TwoColumnBrowseResults";
	tabs;
	secondary_contents;
	constructor(data) {
		super();
		this.tabs = parseArray(data.tabs, [Tab, ExpandableTab]);
		this.secondary_contents = parseItem(data.secondaryContents, [
			SectionList,
			BrowseFeedActions,
			ProfileColumn
		]);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TwoColumnSearchResults.js
var TwoColumnSearchResults = class extends YTNode {
	static type = "TwoColumnSearchResults";
	header;
	primary_contents;
	secondary_contents;
	target_id;
	constructor(data) {
		super();
		this.header = parseItem(data.header);
		this.primary_contents = parseItem(data.primaryContents, [RichGrid, SectionList]);
		this.secondary_contents = parseItem(data.secondaryContents, [SecondarySearchContainer]);
		if ("targetId" in data) this.target_id = data.targetId;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/TwoColumnWatchNextResults.js
var TwoColumnWatchNextResults = class extends YTNode {
	static type = "TwoColumnWatchNextResults";
	results;
	secondary_results;
	conversation_bar;
	playlist;
	autoplay;
	constructor(data) {
		super();
		this.results = parseArray(data.results?.results.contents);
		this.secondary_results = parseArray(data.secondaryResults?.secondaryResults.results);
		this.conversation_bar = parseItem(data?.conversationBar);
		const playlistData = data.playlist?.playlist;
		if (playlistData) this.playlist = {
			id: playlistData.playlistId,
			title: playlistData.title,
			author: playlistData.shortBylineText?.simpleText ? new Text$1(playlistData.shortBylineText) : new Author(playlistData.longBylineText),
			contents: parseArray(playlistData.contents),
			current_index: playlistData.currentIndex,
			is_infinite: !!playlistData.isInfinite,
			menu: parseItem(playlistData.menu, Menu)
		};
		const autoplayData = data.autoplay?.autoplay;
		if (autoplayData) {
			this.autoplay = { sets: autoplayData.sets.map((set) => this.#parseAutoplaySet(set)) };
			if (autoplayData.modifiedSets) this.autoplay.modified_sets = autoplayData.modifiedSets.map((set) => this.#parseAutoplaySet(set));
			if (autoplayData.countDownSecs) this.autoplay.count_down_secs = autoplayData.countDownSecs;
		}
	}
	#parseAutoplaySet(data) {
		const result = { autoplay_video: new NavigationEndpoint(data.autoplayVideo) };
		if (data.nextButtonVideo) result.next_button_video = new NavigationEndpoint(data.nextButtonVideo);
		return result;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/UnifiedSharePanel.js
var UnifiedSharePanel = class extends YTNode {
	static type = "UnifiedSharePanel";
	third_party_network_section;
	header;
	share_panel_version;
	show_loading_spinner;
	constructor(data) {
		super();
		if (data.contents) {
			const contents = data.contents.find((content) => content.thirdPartyNetworkSection);
			if (contents) this.third_party_network_section = {
				share_target_container: parseItem(contents.thirdPartyNetworkSection.shareTargetContainer, ThirdPartyShareTargetSection),
				copy_link_container: parseItem(contents.thirdPartyNetworkSection.copyLinkContainer, CopyLink),
				start_at_container: parseItem(contents.thirdPartyNetworkSection.startAtContainer, StartAt)
			};
		}
		this.header = parseItem(data.header, SharePanelHeader);
		this.share_panel_version = data.sharePanelVersion;
		if (Reflect.has(data, "showLoadingSpinner")) this.show_loading_spinner = data.showLoadingSpinner;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/UpsellDialog.js
var UpsellDialog = class extends YTNode {
	static type = "UpsellDialog";
	message_title;
	message_text;
	action_button;
	dismiss_button;
	is_visible;
	constructor(data) {
		super();
		this.message_title = new Text$1(data.dialogMessageTitle);
		this.message_text = new Text$1(data.dialogMessageText);
		this.action_button = parseItem(data.actionButton, Button);
		this.dismiss_button = parseItem(data.dismissButton, Button);
		this.is_visible = data.isVisible;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VerticalList.js
var VerticalList = class extends YTNode {
	static type = "VerticalList";
	items;
	collapsed_item_count;
	collapsed_state_button_text;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
		this.collapsed_item_count = data.collapsedItemCount;
		this.collapsed_state_button_text = new Text$1(data.collapsedStateButtonText);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VerticalWatchCardList.js
var VerticalWatchCardList = class extends YTNode {
	static type = "VerticalWatchCardList";
	items;
	view_all_text;
	view_all_endpoint;
	constructor(data) {
		super();
		this.items = parseArray(data.items);
		this.view_all_text = new Text$1(data.viewAllText);
		this.view_all_endpoint = new NavigationEndpoint(data.viewAllEndpoint);
	}
	get contents() {
		return this.items;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoInfoCardContent.js
var VideoInfoCardContent = class extends YTNode {
	static type = "VideoInfoCardContent";
	title;
	channel_name;
	view_count;
	video_thumbnails;
	duration;
	endpoint;
	constructor(data) {
		super();
		this.title = new Text$1(data.videoTitle);
		this.channel_name = new Text$1(data.channelName);
		this.view_count = new Text$1(data.viewCountText);
		this.video_thumbnails = Thumbnail.fromResponse(data.videoThumbnail);
		this.duration = new Text$1(data.lengthString);
		this.endpoint = new NavigationEndpoint(data.action);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoMetadataCarouselView.js
var VideoMetadataCarouselView = class extends YTNode {
	static type = "VideoMetadataCarouselView";
	carousel_titles;
	carousel_items;
	constructor(data) {
		super();
		this.carousel_titles = parse(data.carouselTitles, true, CarouselTitleView);
		this.carousel_items = parse(data.carouselItems, true, CarouselItemView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/SubscriptionButton.js
var SubscriptionButton = class {
	static type = "SubscriptionButton";
	text;
	subscribed;
	subscription_type;
	constructor(data) {
		if ("text" in data) this.text = new Text$1(data.text);
		if ("subscribed" in data) this.subscribed = data.subscribed;
		if ("type" in data) this.subscription_type = data.type;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoOwner.js
var VideoOwner = class extends YTNode {
	static type = "VideoOwner";
	title;
	attributed_title;
	subscription_button;
	subscriber_count;
	avatar_stack;
	endpoint;
	author;
	constructor(data) {
		super();
		if ("title" in data) this.title = new Text$1(data.title);
		if ("attributedTitle" in data) this.attributed_title = Text$1.fromAttributed(data.attributedTitle);
		if ("subscriptionButton" in data) this.subscription_button = new SubscriptionButton(data.subscriptionButton);
		if ("navigationEndpoint" in data) this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.avatar_stack = parseItem(data.avatarStack, AvatarStackView);
		this.subscriber_count = new Text$1(data.subscriberCountText);
		this.author = new Author({
			...data.title || data.attributedTitle,
			navigationEndpoint: data.navigationEndpoint
		}, data.badges, data.thumbnail);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoPrimaryInfo.js
var VideoPrimaryInfo = class extends YTNode {
	static type = "VideoPrimaryInfo";
	title;
	super_title_link;
	station_name;
	view_count;
	badges;
	published;
	relative_date;
	menu;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		if ("superTitleLink" in data) this.super_title_link = new Text$1(data.superTitleLink);
		if ("stationName" in data) this.station_name = new Text$1(data.stationName);
		this.view_count = parseItem(data.viewCount, VideoViewCount);
		this.badges = parseArray(data.badges, MetadataBadge);
		this.published = new Text$1(data.dateText);
		this.relative_date = new Text$1(data.relativeDateText);
		this.menu = parseItem(data.videoActions, Menu);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/VideoSecondaryInfo.js
var VideoSecondaryInfo = class extends YTNode {
	static type = "VideoSecondaryInfo";
	owner;
	description;
	description_placeholder;
	subscribe_button;
	metadata;
	show_more_text;
	show_less_text;
	default_expanded;
	description_collapsed_lines;
	constructor(data) {
		super();
		this.owner = parseItem(data.owner, VideoOwner);
		this.description = new Text$1(data.description);
		if ("attributedDescription" in data) this.description = Text$1.fromAttributed(data.attributedDescription);
		if ("descriptionPlaceholder" in data) this.description_placeholder = new Text$1(data.descriptionPlaceholder);
		this.subscribe_button = parseItem(data.subscribeButton, [SubscribeButton, Button]);
		this.metadata = parseItem(data.metadataRowContainer, MetadataRowContainer);
		this.show_more_text = new Text$1(data.showMoreText);
		this.show_less_text = new Text$1(data.showLessText);
		this.default_expanded = data.defaultExpanded;
		this.description_collapsed_lines = data.descriptionCollapsedLines;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/WatchCardCompactVideo.js
var WatchCardCompactVideo = class extends YTNode {
	static type = "WatchCardCompactVideo";
	title;
	subtitle;
	duration;
	style;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.subtitle = new Text$1(data.subtitle);
		this.duration = {
			text: new Text$1(data.lengthText).toString(),
			seconds: timeToSeconds(data.lengthText.simpleText)
		};
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/WatchCardHeroVideo.js
var WatchCardHeroVideo = class extends YTNode {
	static type = "WatchCardHeroVideo";
	endpoint;
	call_to_action_button;
	hero_image;
	label;
	constructor(data) {
		super();
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.call_to_action_button = parseItem(data.callToActionButton);
		this.hero_image = parseItem(data.heroImage);
		this.label = data.lengthText?.accessibility.accessibilityData.label || "";
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/WatchCardRichHeader.js
var WatchCardRichHeader = class extends YTNode {
	static type = "WatchCardRichHeader";
	title;
	title_endpoint;
	subtitle;
	author;
	style;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.title_endpoint = new NavigationEndpoint(data.titleNavigationEndpoint);
		this.subtitle = new Text$1(data.subtitle);
		this.author = new Author(data, data.titleBadge ? [data.titleBadge] : null, data.avatar);
		this.author.name = this.title.toString();
		this.style = data.style;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/WatchCardSectionSequence.js
var WatchCardSectionSequence = class extends YTNode {
	static type = "WatchCardSectionSequence";
	lists;
	constructor(data) {
		super();
		this.lists = parseArray(data.lists);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/WatchNextTabbedResults.js
var WatchNextTabbedResults = class extends TwoColumnBrowseResults {
	static type = "WatchNextTabbedResults";
	constructor(data) {
		super(data);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ytkids/AnchoredSection.js
var AnchoredSection = class extends YTNode {
	static type = "AnchoredSection";
	title;
	content;
	endpoint;
	category_assets;
	category_type;
	constructor(data) {
		super();
		this.title = data.title;
		this.content = parseItem(data.content, SectionList);
		this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
		this.category_assets = {
			asset_key: data.categoryAssets?.assetKey,
			background_color: data.categoryAssets?.backgroundColor
		};
		this.category_type = data.categoryType;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ytkids/KidsBlocklistPickerItem.js
var KidsBlocklistPickerItem = class extends YTNode {
	static type = "KidsBlocklistPickerItem";
	#actions;
	child_display_name;
	child_account_description;
	avatar;
	block_button;
	blocked_entity_key;
	constructor(data) {
		super();
		this.child_display_name = new Text$1(data.childDisplayName);
		this.child_account_description = new Text$1(data.childAccountDescription);
		this.avatar = Thumbnail.fromResponse(data.avatar);
		this.block_button = parseItem(data.blockButton, [ToggleButton]);
		this.blocked_entity_key = data.blockedEntityKey;
	}
	async blockChannel() {
		if (!this.#actions) throw new InnertubeError("An active caller must be provide to perform this operation.");
		const button = this.block_button;
		if (!button) throw new InnertubeError("Block button was not found.", { child_display_name: this.child_display_name });
		if (button.is_toggled) throw new InnertubeError("This channel is already blocked.", { child_display_name: this.child_display_name });
		return await button.endpoint.call(this.#actions, { parse: false });
	}
	setActions(actions) {
		this.#actions = actions;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ytkids/KidsBlocklistPicker.js
var KidsBlocklistPicker = class extends YTNode {
	static type = "KidsBlocklistPicker";
	title;
	child_rows;
	done_button;
	successful_toast_action_message;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.child_rows = parse(data.childRows, true, [KidsBlocklistPickerItem]);
		this.done_button = parseItem(data.doneButton, [Button]);
		this.successful_toast_action_message = new Text$1(data.successfulToastActionMessage);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ytkids/KidsCategoryTab.js
var KidsCategoryTab = class extends YTNode {
	static type = "KidsCategoryTab";
	title;
	category_assets;
	category_type;
	endpoint;
	constructor(data) {
		super();
		this.title = new Text$1(data.title);
		this.category_assets = {
			asset_key: data.categoryAssets?.assetKey,
			background_color: data.categoryAssets?.backgroundColor
		};
		this.category_type = data.categoryType;
		this.endpoint = new NavigationEndpoint(data.endpoint);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ytkids/KidsCategoriesHeader.js
var KidsCategoriesHeader = class extends YTNode {
	static type = "kidsCategoriesHeader";
	category_tabs;
	privacy_button;
	constructor(data) {
		super();
		this.category_tabs = parseArray(data.categoryTabs, KidsCategoryTab);
		this.privacy_button = parseItem(data.privacyButtonRenderer, Button);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/ytkids/KidsHomeScreen.js
var KidsHomeScreen = class extends YTNode {
	static type = "kidsHomeScreen";
	anchors;
	constructor(data) {
		super();
		this.anchors = parseArray(data.anchors, AnchoredSection);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/nodes.js
var nodes_exports = /* @__PURE__ */ __exportAll({
	AboutChannel: () => AboutChannel,
	AboutChannelView: () => AboutChannelView,
	AccountChannel: () => AccountChannel,
	AccountItem: () => AccountItem,
	AccountItemSection: () => AccountItemSection,
	AccountItemSectionHeader: () => AccountItemSectionHeader,
	AccountSectionList: () => AccountSectionList,
	ActiveAccountHeader: () => ActiveAccountHeader,
	AddBannerToLiveChatCommand: () => AddBannerToLiveChatCommand,
	AddChatItemAction: () => AddChatItemAction,
	AddLiveChatTickerItemAction: () => AddLiveChatTickerItemAction,
	AddToPlaylist: () => AddToPlaylist,
	AddToPlaylistCommand: () => AddToPlaylistCommand,
	AddToPlaylistEndpoint: () => AddToPlaylistEndpoint,
	AddToPlaylistServiceEndpoint: () => AddToPlaylistServiceEndpoint,
	Alert: () => Alert,
	AlertWithButton: () => AlertWithButton,
	AnchoredSection: () => AnchoredSection,
	AnimatedThumbnailOverlayView: () => AnimatedThumbnailOverlayView,
	AppendContinuationItemsAction: () => AppendContinuationItemsAction,
	AttributionView: () => AttributionView,
	AudioOnlyPlayability: () => AudioOnlyPlayability,
	AuthorCommentBadge: () => AuthorCommentBadge,
	AutomixPreviewVideo: () => AutomixPreviewVideo,
	AvatarStackView: () => AvatarStackView,
	AvatarView: () => AvatarView,
	BackgroundPromo: () => BackgroundPromo,
	BackstageImage: () => BackstageImage,
	BackstagePost: () => BackstagePost,
	BackstagePostThread: () => BackstagePostThread,
	BadgeView: () => BadgeView,
	BrowseEndpoint: () => BrowseEndpoint,
	BrowseFeedActions: () => BrowseFeedActions,
	BrowserMediaSession: () => BrowserMediaSession,
	BumperUserEduContentView: () => BumperUserEduContentView,
	Button: () => Button,
	ButtonCardView: () => ButtonCardView,
	ButtonView: () => ButtonView,
	C4TabbedHeader: () => C4TabbedHeader,
	CallToActionButton: () => CallToActionButton,
	Card: () => Card,
	CardCollection: () => CardCollection,
	CarouselHeader: () => CarouselHeader,
	CarouselItem: () => CarouselItem,
	CarouselItemView: () => CarouselItemView,
	CarouselLockup: () => CarouselLockup,
	CarouselTitleView: () => CarouselTitleView,
	ChangeEngagementPanelVisibilityAction: () => ChangeEngagementPanelVisibilityAction,
	Channel: () => Channel$2,
	ChannelAboutFullMetadata: () => ChannelAboutFullMetadata,
	ChannelAgeGate: () => ChannelAgeGate,
	ChannelExternalLinkView: () => ChannelExternalLinkView,
	ChannelFeaturedContent: () => ChannelFeaturedContent,
	ChannelHeaderLinks: () => ChannelHeaderLinks,
	ChannelHeaderLinksView: () => ChannelHeaderLinksView,
	ChannelMetadata: () => ChannelMetadata,
	ChannelMobileHeader: () => ChannelMobileHeader,
	ChannelOptions: () => ChannelOptions,
	ChannelOwnerEmptyState: () => ChannelOwnerEmptyState,
	ChannelSubMenu: () => ChannelSubMenu,
	ChannelSwitcherHeader: () => ChannelSwitcherHeader,
	ChannelSwitcherPage: () => ChannelSwitcherPage,
	ChannelTagline: () => ChannelTagline,
	ChannelThumbnailWithLink: () => ChannelThumbnailWithLink,
	ChannelVideoPlayer: () => ChannelVideoPlayer,
	Chapter: () => Chapter,
	ChildVideo: () => ChildVideo,
	ChipBarView: () => ChipBarView,
	ChipCloud: () => ChipCloud,
	ChipCloudChip: () => ChipCloudChip,
	ChipView: () => ChipView,
	ClientSideToggleMenuItem: () => ClientSideToggleMenuItem,
	ClipAdState: () => ClipAdState,
	ClipCreation: () => ClipCreation,
	ClipCreationScrubber: () => ClipCreationScrubber,
	ClipCreationTextInput: () => ClipCreationTextInput,
	ClipSection: () => ClipSection,
	CollaboratorInfoCardContent: () => CollaboratorInfoCardContent,
	CollageHeroImage: () => CollageHeroImage,
	CollectionThumbnailView: () => CollectionThumbnailView,
	CommandExecutorCommand: () => CommandExecutorCommand,
	CommentActionButtons: () => CommentActionButtons,
	CommentDialog: () => CommentDialog,
	CommentReplies: () => CommentReplies,
	CommentReplyDialog: () => CommentReplyDialog,
	CommentSimplebox: () => CommentSimplebox,
	CommentThread: () => CommentThread,
	CommentView: () => CommentView,
	CommentsEntryPointHeader: () => CommentsEntryPointHeader,
	CommentsEntryPointTeaser: () => CommentsEntryPointTeaser,
	CommentsHeader: () => CommentsHeader,
	CommentsSimplebox: () => CommentsSimplebox,
	CompactChannel: () => CompactChannel,
	CompactLink: () => CompactLink,
	CompactMix: () => CompactMix,
	CompactMovie: () => CompactMovie,
	CompactPlaylist: () => CompactPlaylist,
	CompactStation: () => CompactStation,
	CompactVideo: () => CompactVideo,
	CompositeVideoPrimaryInfo: () => CompositeVideoPrimaryInfo,
	ConfirmDialog: () => ConfirmDialog,
	ContentListItemView: () => ContentListItemView,
	ContentMetadataView: () => ContentMetadataView,
	ContentPreviewImageView: () => ContentPreviewImageView,
	ContinuationCommand: () => ContinuationCommand$1,
	ContinuationItem: () => ContinuationItem,
	ContinuationItemView: () => ContinuationItemView,
	ConversationBar: () => ConversationBar,
	CopyLink: () => CopyLink,
	CreateCommentEndpoint: () => CreateCommentEndpoint,
	CreatePlaylistDialog: () => CreatePlaylistDialog,
	CreatePlaylistDialogFormView: () => CreatePlaylistDialogFormView,
	CreatePlaylistServiceEndpoint: () => CreatePlaylistServiceEndpoint,
	CreatorHeart: () => CreatorHeart,
	CreatorHeartView: () => CreatorHeartView,
	DecoratedAvatarView: () => DecoratedAvatarView,
	DecoratedPlayerBar: () => DecoratedPlayerBar,
	DefaultPromoPanel: () => DefaultPromoPanel,
	DeletePlaylistEndpoint: () => DeletePlaylistEndpoint,
	DescriptionPreviewView: () => DescriptionPreviewView,
	DialogHeaderView: () => DialogHeaderView,
	DialogView: () => DialogView,
	DidYouMean: () => DidYouMean,
	DimChatItemAction: () => DimChatItemAction,
	DislikeButtonView: () => DislikeButtonView,
	DismissableDialog: () => DismissableDialog,
	DismissableDialogContentSection: () => DismissableDialogContentSection,
	DownloadButton: () => DownloadButton,
	DownloadListItemView: () => DownloadListItemView,
	Dropdown: () => Dropdown,
	DropdownItem: () => DropdownItem,
	DropdownView: () => DropdownView,
	DynamicTextView: () => DynamicTextView,
	Element: () => Element,
	EmergencyOnebox: () => EmergencyOnebox,
	EmojiPicker: () => EmojiPicker,
	EmojiPickerCategory: () => EmojiPickerCategory,
	EmojiPickerCategoryButton: () => EmojiPickerCategoryButton,
	EmojiPickerUpsellCategory: () => EmojiPickerUpsellCategory,
	EndScreenPlaylist: () => EndScreenPlaylist,
	EndScreenVideo: () => EndScreenVideo,
	Endscreen: () => Endscreen,
	EndscreenElement: () => EndscreenElement,
	EngagementPanelSectionList: () => EngagementPanelSectionList,
	EngagementPanelTitleHeader: () => EngagementPanelTitleHeader,
	EomSettingsDisclaimer: () => EomSettingsDisclaimer,
	ExpandableMetadata: () => ExpandableMetadata,
	ExpandableTab: () => ExpandableTab,
	ExpandableVideoDescriptionBody: () => ExpandableVideoDescriptionBody,
	ExpandedShelfContents: () => ExpandedShelfContents,
	Factoid: () => Factoid,
	FancyDismissibleDialog: () => FancyDismissibleDialog,
	FeedFilterChipBar: () => FeedFilterChipBar,
	FeedNudge: () => FeedNudge,
	FeedTabbedHeader: () => FeedTabbedHeader,
	FeedbackEndpoint: () => FeedbackEndpoint,
	FlexibleActionsView: () => FlexibleActionsView,
	Form: () => Form,
	FormFooterView: () => FormFooterView,
	FormPopup: () => FormPopup,
	GameCard: () => GameCard,
	GameDetails: () => GameDetails,
	GetAccountsListInnertubeEndpoint: () => GetAccountsListInnertubeEndpoint,
	GetKidsBlocklistPickerCommand: () => GetKidsBlocklistPickerCommand,
	GetMultiPageMenuAction: () => GetMultiPageMenuAction,
	Grid: () => Grid,
	GridChannel: () => GridChannel,
	GridHeader: () => GridHeader,
	GridMix: () => GridMix,
	GridMovie: () => GridMovie,
	GridPlaylist: () => GridPlaylist,
	GridShelfView: () => GridShelfView,
	GridShow: () => GridShow,
	GridVideo: () => GridVideo,
	GuideCollapsibleEntry: () => GuideCollapsibleEntry,
	GuideCollapsibleSectionEntry: () => GuideCollapsibleSectionEntry,
	GuideDownloadsEntry: () => GuideDownloadsEntry,
	GuideEntry: () => GuideEntry,
	GuideSection: () => GuideSection,
	GuideSubscriptionsSection: () => GuideSubscriptionsSection,
	HashtagHeader: () => HashtagHeader,
	HashtagTile: () => HashtagTile,
	HeatMarker: () => HeatMarker,
	Heatmap: () => Heatmap,
	HeroPlaylistThumbnail: () => HeroPlaylistThumbnail,
	HideEngagementPanelEndpoint: () => HideEngagementPanelEndpoint,
	HighlightsCarousel: () => HighlightsCarousel,
	HistorySuggestion: () => HistorySuggestion,
	HorizontalCardList: () => HorizontalCardList,
	HorizontalList: () => HorizontalList,
	HorizontalMovieList: () => HorizontalMovieList,
	HowThisWasMadeSectionView: () => HowThisWasMadeSectionView,
	HypeFanCreditsSectionView: () => HypeFanCreditsSectionView,
	HypePointsFactoid: () => HypePointsFactoid,
	IconLink: () => IconLink,
	ImageBannerView: () => ImageBannerView,
	IncludingResultsFor: () => IncludingResultsFor,
	InfoPanelContainer: () => InfoPanelContainer,
	InfoPanelContent: () => InfoPanelContent,
	InfoRow: () => InfoRow,
	InteractiveTabbedHeader: () => InteractiveTabbedHeader,
	ItemSection: () => ItemSection,
	ItemSectionHeader: () => ItemSectionHeader,
	ItemSectionTab: () => ItemSectionTab,
	ItemSectionTabbedHeader: () => ItemSectionTabbedHeader,
	KidsBlocklistPicker: () => KidsBlocklistPicker,
	KidsBlocklistPickerItem: () => KidsBlocklistPickerItem,
	KidsCategoriesHeader: () => KidsCategoriesHeader,
	KidsCategoryTab: () => KidsCategoryTab,
	KidsHomeScreen: () => KidsHomeScreen,
	LikeButton: () => LikeButton,
	LikeButtonView: () => LikeButtonView,
	LikeEndpoint: () => LikeEndpoint,
	ListItemView: () => ListItemView,
	ListView: () => ListView,
	LiveChat: () => LiveChat$1,
	LiveChatActionPanel: () => LiveChatActionPanel,
	LiveChatAuthorBadge: () => LiveChatAuthorBadge,
	LiveChatAutoModMessage: () => LiveChatAutoModMessage,
	LiveChatBanner: () => LiveChatBanner,
	LiveChatBannerChatSummary: () => LiveChatBannerChatSummary,
	LiveChatBannerHeader: () => LiveChatBannerHeader,
	LiveChatBannerPoll: () => LiveChatBannerPoll,
	LiveChatBannerRedirect: () => LiveChatBannerRedirect,
	LiveChatDialog: () => LiveChatDialog,
	LiveChatHeader: () => LiveChatHeader,
	LiveChatItemBumperView: () => LiveChatItemBumperView,
	LiveChatItemContextMenuEndpoint: () => LiveChatItemContextMenuEndpoint,
	LiveChatItemList: () => LiveChatItemList,
	LiveChatMembershipItem: () => LiveChatMembershipItem,
	LiveChatMessageInput: () => LiveChatMessageInput,
	LiveChatModeChangeMessage: () => LiveChatModeChangeMessage,
	LiveChatPaidMessage: () => LiveChatPaidMessage,
	LiveChatPaidSticker: () => LiveChatPaidSticker,
	LiveChatParticipant: () => LiveChatParticipant,
	LiveChatParticipantsList: () => LiveChatParticipantsList,
	LiveChatPlaceholderItem: () => LiveChatPlaceholderItem,
	LiveChatProductItem: () => LiveChatProductItem,
	LiveChatRestrictedParticipation: () => LiveChatRestrictedParticipation,
	LiveChatSponsorshipsGiftPurchaseAnnouncement: () => LiveChatSponsorshipsGiftPurchaseAnnouncement,
	LiveChatSponsorshipsGiftRedemptionAnnouncement: () => LiveChatSponsorshipsGiftRedemptionAnnouncement,
	LiveChatSponsorshipsHeader: () => LiveChatSponsorshipsHeader,
	LiveChatTextMessage: () => LiveChatTextMessage,
	LiveChatTickerPaidMessageItem: () => LiveChatTickerPaidMessageItem,
	LiveChatTickerPaidStickerItem: () => LiveChatTickerPaidStickerItem,
	LiveChatTickerSponsorItem: () => LiveChatTickerSponsorItem,
	LiveChatViewerEngagementMessage: () => LiveChatViewerEngagementMessage,
	LockupMetadataView: () => LockupMetadataView,
	LockupView: () => LockupView,
	MacroMarkersInfoItem: () => MacroMarkersInfoItem,
	MacroMarkersList: () => MacroMarkersList,
	MacroMarkersListEntity: () => MacroMarkersListEntity,
	MacroMarkersListItem: () => MacroMarkersListItem,
	MarkChatItemAsDeletedAction: () => MarkChatItemAsDeletedAction,
	MarkChatItemsByAuthorAsDeletedAction: () => MarkChatItemsByAuthorAsDeletedAction,
	Menu: () => Menu,
	MenuFlexibleItem: () => MenuFlexibleItem,
	MenuNavigationItem: () => MenuNavigationItem,
	MenuPopup: () => MenuPopup,
	MenuServiceItem: () => MenuServiceItem,
	MenuServiceItemDownload: () => MenuServiceItemDownload,
	MenuTitle: () => MenuTitle,
	MerchandiseItem: () => MerchandiseItem,
	MerchandiseShelf: () => MerchandiseShelf,
	Message: () => Message,
	MetadataBadge: () => MetadataBadge,
	MetadataRow: () => MetadataRow,
	MetadataRowContainer: () => MetadataRowContainer,
	MetadataRowHeader: () => MetadataRowHeader,
	MetadataScreen: () => MetadataScreen,
	MicroformatData: () => MicroformatData,
	Mix: () => Mix,
	MobileTopbar: () => MobileTopbar,
	ModalWithTitleAndButton: () => ModalWithTitleAndButton,
	ModifyChannelNotificationPreferenceEndpoint: () => ModifyChannelNotificationPreferenceEndpoint,
	Movie: () => Movie,
	MovingThumbnail: () => MovingThumbnail,
	MultiMarkersPlayerBar: () => MultiMarkersPlayerBar,
	MultiPageMenu: () => MultiPageMenu,
	MultiPageMenuNotificationSection: () => MultiPageMenuNotificationSection,
	MultiPageMenuSection: () => MultiPageMenuSection,
	MusicCardShelf: () => MusicCardShelf,
	MusicCardShelfHeaderBasic: () => MusicCardShelfHeaderBasic,
	MusicCarouselShelf: () => MusicCarouselShelf,
	MusicCarouselShelfBasicHeader: () => MusicCarouselShelfBasicHeader,
	MusicDescriptionShelf: () => MusicDescriptionShelf,
	MusicDetailHeader: () => MusicDetailHeader,
	MusicDownloadStateBadge: () => MusicDownloadStateBadge,
	MusicEditablePlaylistDetailHeader: () => MusicEditablePlaylistDetailHeader,
	MusicElementHeader: () => MusicElementHeader,
	MusicHeader: () => MusicHeader,
	MusicImmersiveHeader: () => MusicImmersiveHeader,
	MusicInlineBadge: () => MusicInlineBadge,
	MusicItemThumbnailOverlay: () => MusicItemThumbnailOverlay,
	MusicLargeCardItemCarousel: () => MusicLargeCardItemCarousel,
	MusicMenuItemDivider: () => MusicMenuItemDivider,
	MusicMultiRowListItem: () => MusicMultiRowListItem,
	MusicMultiSelectMenu: () => MusicMultiSelectMenu,
	MusicMultiSelectMenuItem: () => MusicMultiSelectMenuItem,
	MusicNavigationButton: () => MusicNavigationButton,
	MusicPlayButton: () => MusicPlayButton,
	MusicPlaylistEditHeader: () => MusicPlaylistEditHeader,
	MusicPlaylistShelf: () => MusicPlaylistShelf,
	MusicQueue: () => MusicQueue,
	MusicResponsiveHeader: () => MusicResponsiveHeader,
	MusicResponsiveListItem: () => MusicResponsiveListItem,
	MusicResponsiveListItemFixedColumn: () => MusicResponsiveListItemFixedColumn,
	MusicResponsiveListItemFlexColumn: () => MusicResponsiveListItemFlexColumn,
	MusicShelf: () => MusicShelf,
	MusicSideAlignedItem: () => MusicSideAlignedItem,
	MusicSortFilterButton: () => MusicSortFilterButton,
	MusicTastebuilderShelf: () => MusicTasteBuilderShelf,
	MusicTastebuilderShelfThumbnail: () => MusicTastebuilderShelfThumbnail,
	MusicThumbnail: () => MusicThumbnail,
	MusicTwoRowItem: () => MusicTwoRowItem,
	MusicVisualHeader: () => MusicVisualHeader,
	NavigationEndpoint: () => NavigationEndpoint,
	Notification: () => Notification,
	NotificationAction: () => NotificationAction,
	OpenOnePickAddVideoModalCommand: () => OpenOnePickAddVideoModalCommand,
	OpenPopupAction: () => OpenPopupAction,
	PageHeader: () => PageHeader,
	PageHeaderView: () => PageHeaderView,
	PageIndicatorView: () => PageIndicatorView,
	PageIntroduction: () => PageIntroduction,
	PanelFooterView: () => PanelFooterView,
	PdgCommentChip: () => PdgCommentChip,
	PdgReplyButtonView: () => PdgReplyButtonView,
	PerformCommentActionEndpoint: () => PerformCommentActionEndpoint,
	PivotBar: () => PivotBar,
	PivotBarItem: () => PivotBarItem,
	PivotButton: () => PivotButton,
	PlayerAnnotationsExpanded: () => PlayerAnnotationsExpanded,
	PlayerCaptchaView: () => PlayerCaptchaView,
	PlayerCaptionsTracklist: () => PlayerCaptionsTracklist,
	PlayerControlsOverlay: () => PlayerControlsOverlay,
	PlayerErrorMessage: () => PlayerErrorMessage,
	PlayerLegacyDesktopYpcOffer: () => PlayerLegacyDesktopYpcOffer,
	PlayerLegacyDesktopYpcTrailer: () => PlayerLegacyDesktopYpcTrailer,
	PlayerLiveStoryboardSpec: () => PlayerLiveStoryboardSpec,
	PlayerMicroformat: () => PlayerMicroformat,
	PlayerOverflow: () => PlayerOverflow,
	PlayerOverlay: () => PlayerOverlay,
	PlayerOverlayAutoplay: () => PlayerOverlayAutoplay,
	PlayerOverlayVideoDetails: () => PlayerOverlayVideoDetails,
	PlayerStoryboardSpec: () => PlayerStoryboardSpec,
	Playlist: () => Playlist$2,
	PlaylistAddToOption: () => PlaylistAddToOption,
	PlaylistCollaborationView: () => PlaylistCollaborationView,
	PlaylistCustomThumbnail: () => PlaylistCustomThumbnail,
	PlaylistEditEndpoint: () => PlaylistEditEndpoint,
	PlaylistHeader: () => PlaylistHeader,
	PlaylistInfoCardContent: () => PlaylistInfoCardContent,
	PlaylistMetadata: () => PlaylistMetadata,
	PlaylistPanel: () => PlaylistPanel,
	PlaylistPanelVideo: () => PlaylistPanelVideo,
	PlaylistPanelVideoWrapper: () => PlaylistPanelVideoWrapper,
	PlaylistSidebar: () => PlaylistSidebar,
	PlaylistSidebarPrimaryInfo: () => PlaylistSidebarPrimaryInfo,
	PlaylistSidebarSecondaryInfo: () => PlaylistSidebarSecondaryInfo,
	PlaylistThumbnailOverlay: () => PlaylistThumbnailOverlay,
	PlaylistVideo: () => PlaylistVideo,
	PlaylistVideoList: () => PlaylistVideoList,
	PlaylistVideoThumbnail: () => PlaylistVideoThumbnail,
	Poll: () => Poll,
	PollHeader: () => PollHeader,
	Post: () => Post,
	PostMultiImage: () => PostMultiImage,
	PrefetchWatchCommand: () => PrefetchWatchCommand,
	PremiereTrailerBadge: () => PremiereTrailerBadge,
	ProductList: () => ProductList,
	ProductListHeader: () => ProductListHeader,
	ProductListItem: () => ProductListItem,
	ProfileColumn: () => ProfileColumn,
	ProfileColumnStats: () => ProfileColumnStats,
	ProfileColumnStatsEntry: () => ProfileColumnStatsEntry,
	ProfileColumnUserInfo: () => ProfileColumnUserInfo,
	Quiz: () => Quiz,
	RecognitionShelf: () => RecognitionShelf,
	ReelItem: () => ReelItem,
	ReelPlayerHeader: () => ReelPlayerHeader,
	ReelPlayerOverlay: () => ReelPlayerOverlay,
	ReelShelf: () => ReelShelf,
	ReelWatchEndpoint: () => ReelWatchEndpoint,
	RelatedChipCloud: () => RelatedChipCloud,
	RemoveBannerForLiveChatCommand: () => RemoveBannerForLiveChatCommand,
	RemoveChatItemAction: () => RemoveChatItemAction,
	RemoveChatItemByAuthorAction: () => RemoveChatItemByAuthorAction,
	ReplaceChatItemAction: () => ReplaceChatItemAction,
	ReplaceLiveChatAction: () => ReplaceLiveChatAction,
	ReplayChatItemAction: () => ReplayChatItemAction,
	RichGrid: () => RichGrid,
	RichItem: () => RichItem,
	RichListHeader: () => RichListHeader,
	RichMetadata: () => RichMetadata,
	RichMetadataRow: () => RichMetadataRow,
	RichSection: () => RichSection,
	RichShelf: () => RichShelf,
	RunAttestationCommand: () => RunAttestationCommand,
	SearchBox: () => SearchBox,
	SearchEndpoint: () => SearchEndpoint,
	SearchFilter: () => SearchFilter,
	SearchFilterGroup: () => SearchFilterGroup,
	SearchFilterOptionsDialog: () => SearchFilterOptionsDialog,
	SearchHeader: () => SearchHeader,
	SearchRefinementCard: () => SearchRefinementCard,
	SearchSubMenu: () => SearchSubMenu,
	SearchSuggestion: () => SearchSuggestion,
	SearchSuggestionsSection: () => SearchSuggestionsSection,
	SecondarySearchContainer: () => SecondarySearchContainer,
	SectionHeaderView: () => SectionHeaderView,
	SectionList: () => SectionList,
	SegmentedLikeDislikeButton: () => SegmentedLikeDislikeButton,
	SegmentedLikeDislikeButtonView: () => SegmentedLikeDislikeButtonView,
	SendFeedbackAction: () => SendFeedbackAction,
	SettingBoolean: () => SettingBoolean,
	SettingsCheckbox: () => SettingsCheckbox,
	SettingsOptions: () => SettingsOptions,
	SettingsSidebar: () => SettingsSidebar,
	SettingsSwitch: () => SettingsSwitch,
	ShareEndpoint: () => ShareEndpoint,
	ShareEntityEndpoint: () => ShareEntityEndpoint,
	ShareEntityServiceEndpoint: () => ShareEntityServiceEndpoint,
	SharePanelHeader: () => SharePanelHeader,
	SharePanelTitleV15: () => SharePanelTitleV15,
	ShareTarget: () => ShareTarget,
	SharedPost: () => SharedPost,
	SheetView: () => SheetView,
	Shelf: () => Shelf,
	ShortsLockupView: () => ShortsLockupView,
	ShowCustomThumbnail: () => ShowCustomThumbnail,
	ShowDialogCommand: () => ShowDialogCommand,
	ShowEngagementPanelEndpoint: () => ShowEngagementPanelEndpoint,
	ShowLiveChatActionPanelAction: () => ShowLiveChatActionPanelAction,
	ShowLiveChatDialogAction: () => ShowLiveChatDialogAction,
	ShowLiveChatTooltipCommand: () => ShowLiveChatTooltipCommand,
	ShowSheetCommand: () => ShowSheetCommand,
	ShowingResultsFor: () => ShowingResultsFor,
	SignalAction: () => SignalAction,
	SignalServiceEndpoint: () => SignalServiceEndpoint,
	SimpleCardContent: () => SimpleCardContent,
	SimpleCardTeaser: () => SimpleCardTeaser,
	SimpleMenuHeader: () => SimpleMenuHeader,
	SimpleTextSection: () => SimpleTextSection,
	SingleActionEmergencySupport: () => SingleActionEmergencySupport,
	SingleColumnBrowseResults: () => SingleColumnBrowseResults,
	SingleColumnMusicWatchNextResults: () => SingleColumnMusicWatchNextResults,
	SingleHeroImage: () => SingleHeroImage,
	SlimOwner: () => SlimOwner,
	SlimVideoMetadata: () => SlimVideoMetadata,
	SortFilterHeader: () => SortFilterHeader,
	SortFilterSubMenu: () => SortFilterSubMenu,
	SponsorCommentBadge: () => SponsorCommentBadge,
	StartAt: () => StartAt,
	StructuredDescriptionContent: () => StructuredDescriptionContent,
	StructuredDescriptionPlaylistLockup: () => StructuredDescriptionPlaylistLockup,
	SubFeedOption: () => SubFeedOption,
	SubFeedSelector: () => SubFeedSelector,
	SubscribeButton: () => SubscribeButton,
	SubscribeButtonView: () => SubscribeButtonView,
	SubscribeEndpoint: () => SubscribeEndpoint,
	SubscriptionNotificationToggleButton: () => SubscriptionNotificationToggleButton,
	Tab: () => Tab,
	Tabbed: () => Tabbed,
	TabbedSearchResults: () => TabbedSearchResults,
	TextCarouselItemView: () => TextCarouselItemView,
	TextFieldView: () => TextFieldView,
	TextHeader: () => TextHeader,
	ThirdPartyShareTargetSection: () => ThirdPartyShareTargetSection,
	ThumbnailBadgeView: () => ThumbnailBadgeView,
	ThumbnailBottomOverlayView: () => ThumbnailBottomOverlayView,
	ThumbnailHoverOverlayToggleActionsView: () => ThumbnailHoverOverlayToggleActionsView,
	ThumbnailHoverOverlayView: () => ThumbnailHoverOverlayView,
	ThumbnailLandscapePortrait: () => ThumbnailLandscapePortrait,
	ThumbnailOverlayAvatarStackView: () => ThumbnailOverlayAvatarStackView,
	ThumbnailOverlayBadgeView: () => ThumbnailOverlayBadgeView,
	ThumbnailOverlayBottomPanel: () => ThumbnailOverlayBottomPanel,
	ThumbnailOverlayEndorsement: () => ThumbnailOverlayEndorsement,
	ThumbnailOverlayHoverText: () => ThumbnailOverlayHoverText,
	ThumbnailOverlayInlineUnplayable: () => ThumbnailOverlayInlineUnplayable,
	ThumbnailOverlayLoadingPreview: () => ThumbnailOverlayLoadingPreview,
	ThumbnailOverlayNowPlaying: () => ThumbnailOverlayNowPlaying,
	ThumbnailOverlayPinking: () => ThumbnailOverlayPinking,
	ThumbnailOverlayPlaybackStatus: () => ThumbnailOverlayPlaybackStatus,
	ThumbnailOverlayProgressBarView: () => ThumbnailOverlayProgressBarView,
	ThumbnailOverlayResumePlayback: () => ThumbnailOverlayResumePlayback,
	ThumbnailOverlaySidePanel: () => ThumbnailOverlaySidePanel,
	ThumbnailOverlayTimeStatus: () => ThumbnailOverlayTimeStatus,
	ThumbnailOverlayTitleView: () => ThumbnailOverlayTitleView,
	ThumbnailOverlayToggleButton: () => ThumbnailOverlayToggleButton,
	ThumbnailView: () => ThumbnailView,
	TicketEvent: () => TicketEvent,
	TicketShelf: () => TicketShelf,
	TimedMarkerDecoration: () => TimedMarkerDecoration,
	TitleAndButtonListHeader: () => TitleAndButtonListHeader,
	ToggleButton: () => ToggleButton,
	ToggleButtonView: () => ToggleButtonView,
	ToggleFormField: () => ToggleFormField,
	ToggleMenuServiceItem: () => ToggleMenuServiceItem,
	Tooltip: () => Tooltip,
	TopbarMenuButton: () => TopbarMenuButton,
	TopicChannelDetails: () => TopicChannelDetails,
	Transcript: () => Transcript,
	TranscriptFooter: () => TranscriptFooter,
	TranscriptSearchBox: () => TranscriptSearchBox,
	TranscriptSearchPanel: () => TranscriptSearchPanel,
	TranscriptSectionHeader: () => TranscriptSectionHeader,
	TranscriptSegment: () => TranscriptSegment,
	TranscriptSegmentList: () => TranscriptSegmentList,
	TwoColumnBrowseResults: () => TwoColumnBrowseResults,
	TwoColumnSearchResults: () => TwoColumnSearchResults,
	TwoColumnWatchNextResults: () => TwoColumnWatchNextResults,
	UnifiedSharePanel: () => UnifiedSharePanel,
	UniversalWatchCard: () => UniversalWatchCard,
	UnsubscribeEndpoint: () => UnsubscribeEndpoint,
	UpdateChannelSwitcherPageAction: () => UpdateChannelSwitcherPageAction,
	UpdateDateTextAction: () => UpdateDateTextAction,
	UpdateDescriptionAction: () => UpdateDescriptionAction,
	UpdateEngagementPanelAction: () => UpdateEngagementPanelAction,
	UpdateEngagementPanelContentCommand: () => UpdateEngagementPanelContentCommand,
	UpdateLiveChatPollAction: () => UpdateLiveChatPollAction,
	UpdateSubscribeButtonAction: () => UpdateSubscribeButtonAction,
	UpdateTitleAction: () => UpdateTitleAction,
	UpdateToggleButtonTextAction: () => UpdateToggleButtonTextAction,
	UpdateViewershipAction: () => UpdateViewershipAction,
	UploadTimeFactoid: () => UploadTimeFactoid,
	UpsellDialog: () => UpsellDialog,
	VerticalList: () => VerticalList,
	VerticalWatchCardList: () => VerticalWatchCardList,
	Video: () => Video,
	VideoAttributeView: () => VideoAttributeView,
	VideoAttributesSectionView: () => VideoAttributesSectionView,
	VideoCard: () => VideoCard,
	VideoDescriptionCourseSection: () => VideoDescriptionCourseSection,
	VideoDescriptionHeader: () => VideoDescriptionHeader,
	VideoDescriptionInfocardsSection: () => VideoDescriptionInfocardsSection,
	VideoDescriptionMusicSection: () => VideoDescriptionMusicSection,
	VideoDescriptionTranscriptSection: () => VideoDescriptionTranscriptSection,
	VideoDescriptionYouchatSectionView: () => VideoDescriptionYouchatSectionView,
	VideoInfoCardContent: () => VideoInfoCardContent,
	VideoMetadataCarouselView: () => VideoMetadataCarouselView,
	VideoOwner: () => VideoOwner,
	VideoPrimaryInfo: () => VideoPrimaryInfo,
	VideoSecondaryInfo: () => VideoSecondaryInfo,
	VideoSummaryContentView: () => VideoSummaryContentView,
	VideoSummaryParagraphView: () => VideoSummaryParagraphView,
	VideoViewCount: () => VideoViewCount,
	ViewCountFactoid: () => ViewCountFactoid,
	VoiceReplyContainerView: () => VoiceReplyContainerView,
	WatchCardCompactVideo: () => WatchCardCompactVideo,
	WatchCardHeroVideo: () => WatchCardHeroVideo,
	WatchCardRichHeader: () => WatchCardRichHeader,
	WatchCardSectionSequence: () => WatchCardSectionSequence,
	WatchEndpoint: () => WatchEndpoint,
	WatchNextEndScreen: () => WatchNextEndScreen,
	WatchNextEndpoint: () => WatchNextEndpoint,
	WatchNextTabbedResults: () => WatchNextTabbedResults,
	YpcTrailer: () => YpcTrailer
});
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/generator.js
var IGNORED_KEYS = /* @__PURE__ */ new Set([
	"trackingParams",
	"accessibility",
	"accessibilityData"
]);
var RENDERER_EXAMPLES = {};
function camelToSnake(str) {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
/**
* Infer the type of key given its value
* @param key - The key to infer the type of
* @param value - The value of the key
* @returns The inferred type
*/
function inferType(key, value) {
	let return_value = false;
	if (typeof value === "object" && value != null) {
		if (return_value = isRenderer(value)) {
			RENDERER_EXAMPLES[return_value] = Reflect.get(value, Reflect.ownKeys(value)[0]);
			return {
				type: "renderer",
				renderers: [return_value],
				optional: false
			};
		}
		if (return_value = isRendererList(value)) {
			for (const [key, value] of Object.entries(return_value)) RENDERER_EXAMPLES[key] = value;
			return {
				type: "array",
				array_type: "renderer",
				renderers: Object.keys(return_value),
				optional: false
			};
		}
		if (return_value = isMiscType(key, value)) return return_value;
		if (return_value = isArrayType(value)) return return_value;
	}
	const primitive_type = typeof value;
	if (primitive_type === "object") return {
		type: "object",
		keys: Object.entries(value).map(([key, value]) => [key, inferType(key, value)]),
		optional: false
	};
	return {
		type: "primitive",
		typeof: [primitive_type],
		optional: false
	};
}
/**
* Checks if the given value is an array of renderers
* @param value - The value to check
* @returns If it is a renderer list, return an object with keys being the classnames, and values being an example of that class.
* Otherwise, return false.
*/
function isRendererList(value) {
	const arr = Array.isArray(value);
	if (arr && value.length === 0) return false;
	return arr && value.every((item) => isRenderer(item)) ? Object.fromEntries(value.map((item) => {
		const key = Reflect.ownKeys(item)[0].toString();
		return [sanitizeClassName(key), item[key]];
	})) : false;
}
/**
* Check if the given value is a misc type.
* @param key - The key of the value
* @param value - The value to check
* @returns If it is a misc type, return the InferenceType. Otherwise, return false.
*/
function isMiscType(key, value) {
	if (typeof value === "object" && value !== null) {
		if (key.endsWith("Endpoint") || key.endsWith("Command") || key === "endpoint") return {
			type: "misc",
			endpoint: new NavigationEndpoint(value),
			optional: false,
			misc_type: "NavigationEndpoint"
		};
		if (Reflect.has(value, "simpleText") || Reflect.has(value, "runs")) {
			const textNode = new Text$1(value);
			return {
				type: "misc",
				misc_type: "Text",
				optional: false,
				endpoint: textNode.endpoint,
				text: textNode.toString()
			};
		}
		if (Reflect.has(value, "thumbnails") && Array.isArray(Reflect.get(value, "thumbnails"))) return {
			type: "misc",
			misc_type: "Thumbnail",
			optional: false
		};
	}
	return false;
}
/**
* Check if the given value is a renderer
* @param value - The value to check
* @returns If it is a renderer, return the class name. Otherwise, return false.
*/
function isRenderer(value) {
	if (!(typeof value === "object")) return false;
	const keys = Reflect.ownKeys(value);
	if (keys.length === 1) {
		const first_key = keys[0].toString();
		if (first_key.endsWith("Renderer") || first_key.endsWith("Model")) return sanitizeClassName(first_key);
	}
	return false;
}
/**
* Checks if the given value is an array
* @param value - The value to check
* @returns If it is an array, return the InferenceType. Otherwise, return false.
*/
function isArrayType(value) {
	if (!Array.isArray(value)) return false;
	if (value.length === 0) return {
		type: "array",
		array_type: "primitive",
		items: {
			type: "primitive",
			typeof: ["never"],
			optional: false
		},
		optional: false
	};
	const array_entry_types = value.map((item) => typeof item);
	if (!array_entry_types.every((type) => type === array_entry_types[0])) return {
		type: "array",
		array_type: "primitive",
		items: {
			type: "primitive",
			typeof: ["unknown"],
			optional: false
		},
		optional: false
	};
	const type = array_entry_types[0];
	if (type !== "object") return {
		type: "array",
		array_type: "primitive",
		items: {
			type: "primitive",
			typeof: [type],
			optional: false
		},
		optional: false
	};
	let key_type = [];
	for (let i = 0; i < value.length; i++) {
		const current_keys = Object.entries(value[i]).map(([key, value]) => [key, inferType(key, value)]);
		if (i === 0) {
			key_type = current_keys;
			continue;
		}
		key_type = mergeKeyInfo(key_type, current_keys).resolved_key_info;
	}
	return {
		type: "array",
		array_type: "object",
		items: {
			type: "object",
			keys: key_type,
			optional: false
		},
		optional: false
	};
}
function introspectKeysFirstPass(classdata) {
	if (typeof classdata !== "object" || classdata === null) throw new InnertubeError("Generator: Cannot introspect non-object", { classdata });
	return Reflect.ownKeys(classdata).filter((key) => !isIgnoredKey(key)).filter((key) => typeof key === "string").map((key) => {
		return [key, inferType(key, Reflect.get(classdata, key))];
	});
}
function introspectKeysSecondPass(key_info) {
	const most_probable_match = key_info.filter(([, value]) => {
		if (value.type !== "misc") return false;
		if (!(value.misc_type === "NavigationEndpoint" || value.misc_type === "Text")) return false;
		return value.endpoint?.metadata.page_type === "WEB_PAGE_TYPE_CHANNEL";
	}).sort(([, a], [, b]) => {
		if (a.type !== "misc" || b.type !== "misc") return 0;
		if (a.misc_type !== "Text" || b.misc_type !== "Text") return 0;
		return b.text.length - a.text.length;
	});
	const excluded_keys = /* @__PURE__ */ new Set();
	const canonical_channel_nave = most_probable_match[0];
	let author;
	if (canonical_channel_nave) {
		excluded_keys.add(canonical_channel_nave[0]);
		const badges = key_info.map(([key]) => key).filter((key) => key.endsWith("Badges") || key === "badges");
		const canonical_badges = badges.filter((key) => key.startsWith("owner") || key.startsWith("author"))[0] ?? badges[0];
		const badge_key_info = key_info.find(([key]) => key === canonical_badges);
		const is_badges = badge_key_info ? badge_key_info[1].type === "array" && badge_key_info[1].array_type === "renderer" && Reflect.has(badge_key_info[1].renderers, "MetadataBadge") : false;
		if (is_badges && canonical_badges) excluded_keys.add(canonical_badges);
		author = {
			type: "misc",
			misc_type: "Author",
			optional: false,
			params: [canonical_channel_nave[0], is_badges ? canonical_badges : void 0]
		};
	}
	if (author) key_info.push(["author", author]);
	return key_info.filter(([key]) => !excluded_keys.has(key));
}
function introspect2(classdata) {
	return introspectKeysSecondPass(introspectKeysFirstPass(classdata));
}
/**
* Introspect an example of a class in order to determine its key info and dependencies
* @param classdata - The example of the class
* @returns The key info and any unimplemented dependencies
*/
function introspect(classdata) {
	const key_info = introspect2(classdata);
	const dependencies = /* @__PURE__ */ new Map();
	for (const [, value] of key_info) if (value.type === "renderer" || value.type === "array" && value.array_type === "renderer") for (const renderer of value.renderers) {
		const example = RENDERER_EXAMPLES[renderer];
		if (example) dependencies.set(renderer, example);
	}
	return {
		key_info,
		unimplemented_dependencies: Array.from(dependencies).filter(([classname]) => !hasParser(classname))
	};
}
/**
* Is this key ignored by the parser?
* @param key - The key to check
* @returns Whether or not the key is ignored
*/
function isIgnoredKey(key) {
	return typeof key === "string" && IGNORED_KEYS.has(key);
}
/**
* Given a classname and its resolved key info, create a new class
* @param classname - The name of the class
* @param key_info - The resolved key info
* @param logger - The logger to log errors to
* @returns Class based on the key info extending YTNode
*/
function createRuntimeClass(classname, key_info, logger) {
	logger({
		error_type: "class_not_found",
		classname,
		key_info
	});
	const node = class extends YTNode {
		static type = classname;
		static #key_info = /* @__PURE__ */ new Map();
		static set key_info(key_info) {
			this.#key_info = new Map(key_info);
		}
		static get key_info() {
			return [...this.#key_info.entries()];
		}
		constructor(data) {
			super();
			const { key_info, unimplemented_dependencies } = introspect(data);
			const { resolved_key_info, changed_keys } = mergeKeyInfo(node.key_info, key_info);
			if (changed_keys.length > 0) {
				node.key_info = resolved_key_info;
				logger({
					error_type: "class_changed",
					classname,
					key_info: node.key_info,
					changed_keys
				});
			}
			for (const [name, data] of unimplemented_dependencies) generateRuntimeClass(name, data, logger);
			for (const [key, value] of key_info) {
				let snake_key = camelToSnake(key);
				if (value.type === "misc" && value.misc_type === "NavigationEndpoint") snake_key = "endpoint";
				Reflect.set(this, snake_key, parse$1(key, value, data));
			}
		}
	};
	node.key_info = key_info;
	Object.defineProperty(node, "name", {
		value: classname,
		writable: false
	});
	return node;
}
/**
* Given example data for a class, introspect, implement dependencies, and create a new class
* @param classname - The name of the class
* @param classdata - The example of the class
* @param logger - The logger to log errors to
* @returns Class based on the example classdata extending YTNode
*/
function generateRuntimeClass(classname, classdata, logger) {
	const { key_info, unimplemented_dependencies } = introspect(classdata);
	const JITNode = createRuntimeClass(classname, key_info, logger);
	addRuntimeParser(classname, JITNode);
	for (const [name, data] of unimplemented_dependencies) generateRuntimeClass(name, data, logger);
	return JITNode;
}
/**
* Generate a typescript class based on the key info
* @param classname - The name of the class
* @param key_info - The key info, as returned by {@link introspect}
* @returns Typescript class file
*/
function generateTypescriptClass(classname, key_info) {
	const props = [];
	const constructor_lines = ["super();"];
	for (const [key, value] of key_info) {
		let snake_key = camelToSnake(key);
		if (value.type === "misc" && value.misc_type === "NavigationEndpoint") snake_key = "endpoint";
		props.push(`${snake_key}${value.optional ? "?" : ""}: ${toTypeDeclaration(value)};`);
		constructor_lines.push(`this.${snake_key} = ${toParser(key, value)};`);
	}
	return `class ${classname} extends YTNode {\n  static type = '${classname}';\n\n  ${props.join("\n  ")}\n\n  constructor(data: RawNode) {\n    ${constructor_lines.join("\n    ")}\n  }\n}\n`;
}
function toTypeDeclarationObject(indentation, keys) {
	return `{\n${keys.map(([key, value]) => `${" ".repeat((indentation + 2) * 2)}${camelToSnake(key)}${value.optional ? "?" : ""}: ${toTypeDeclaration(value, indentation + 1)}`).join(",\n")}\n${" ".repeat((indentation + 1) * 2)}}`;
}
/**
* For a given inference type, get the typescript type declaration
* @param inference_type - The inference type to get the declaration for
* @param indentation - The indentation level (used for objects)
* @returns Typescript type declaration
*/
function toTypeDeclaration(inference_type, indentation = 0) {
	switch (inference_type.type) {
		case "renderer": return `${inference_type.renderers.map((type) => `YTNodes.${type}`).join(" | ")} | null`;
		case "array": switch (inference_type.array_type) {
			case "renderer": return `ObservedArray<${inference_type.renderers.map((type) => `YTNodes.${type}`).join(" | ")}> | null`;
			case "primitive": {
				const items_list = inference_type.items.typeof;
				if (inference_type.items.optional && !items_list.includes("undefined")) items_list.push("undefined");
				return `${items_list.length === 1 ? `${items_list[0]}` : `(${items_list.join(" | ")})`}[]`;
			}
			case "object": return `${toTypeDeclarationObject(indentation, inference_type.items.keys)}[]`;
			default: throw new Error("Unreachable code reached! Switch missing case!");
		}
		case "object": return toTypeDeclarationObject(indentation, inference_type.keys);
		case "misc": switch (inference_type.misc_type) {
			case "Thumbnail": return "Thumbnail[]";
			default: return inference_type.misc_type;
		}
		case "primitive": return inference_type.typeof.join(" | ");
	}
}
function toParserObject(indentation, keys, key_path, key) {
	const new_keypath = [...key_path, key];
	return `{\n${keys.map(([key, value]) => `${" ".repeat((indentation + 2) * 2)}${camelToSnake(key)}: ${toParser(key, value, new_keypath, indentation + 1)}`).join(",\n")}\n${" ".repeat((indentation + 1) * 2)}}`;
}
/**
* Generate statements to parse a given inference type
* @param key - The key to parse
* @param inference_type - The inference type to parse
* @param key_path - The path to the key (excluding the key itself)
* @param indentation - The indentation level (used for objects)
* @returns Statement to parse the given key
*/
function toParser(key, inference_type, key_path = ["data"], indentation = 1) {
	let parser = "undefined";
	switch (inference_type.type) {
		case "renderer":
			parser = `Parser.parseItem(${key_path.join(".")}.${key}, ${toParserValidTypes(inference_type.renderers)})`;
			break;
		case "array":
			switch (inference_type.array_type) {
				case "renderer":
					parser = `Parser.parse(${key_path.join(".")}.${key}, true, ${toParserValidTypes(inference_type.renderers)})`;
					break;
				case "object":
					parser = `${key_path.join(".")}.${key}.map((item: any) => (${toParserObject(indentation, inference_type.items.keys, [], "item")}))`;
					break;
				case "primitive":
					parser = `${key_path.join(".")}.${key}`;
					break;
				default: throw new Error("Unreachable code reached! Switch missing case!");
			}
			break;
		case "object":
			parser = toParserObject(indentation, inference_type.keys, key_path, key);
			break;
		case "misc":
			switch (inference_type.misc_type) {
				case "Thumbnail":
					parser = `Thumbnail.fromResponse(${key_path.join(".")}.${key})`;
					break;
				case "Author": {
					const author_parser = `new Author(${key_path.join(".")}.${inference_type.params[0]}, ${inference_type.params[1] ? `${key_path.join(".")}.${inference_type.params[1]}` : "undefined"})`;
					if (inference_type.optional) return `Reflect.has(${key_path.join(".")}, '${inference_type.params[0]}') ? ${author_parser} : undefined`;
					return author_parser;
				}
				default: parser = `new ${inference_type.misc_type}(${key_path.join(".")}.${key})`;
			}
			if (parser === "undefined") throw new Error("Unreachable code reached! Switch missing case!");
			break;
		case "primitive": parser = `${key_path.join(".")}.${key}`;
	}
	if (inference_type.optional) return `Reflect.has(${key_path.join(".")}, '${key}') ? ${parser} : undefined`;
	return parser;
}
function toParserValidTypes(types) {
	if (types.length === 1) return `YTNodes.${types[0]}`;
	return `[ ${types.map((type) => `YTNodes.${type}`).join(", ")} ]`;
}
function accessDataFromKeyPath(root, key_path) {
	let data = root;
	for (const key of key_path) data = data[key];
	return data;
}
function hasDataFromKeyPath(root, key_path) {
	let data = root;
	for (const key of key_path) if (!Reflect.has(data, key)) return false;
	else data = data[key];
	return true;
}
function parseObject(key, data, key_path, keys, should_optional) {
	const obj = {};
	const new_key_path = [...key_path, key];
	for (const [key, value] of keys) obj[key] = should_optional ? parse$1(key, value, data, new_key_path) : void 0;
	return obj;
}
/**
* Parse a value from a given key path using the given inference type
* @param key - The key to parse
* @param inference_type - The inference type to parse
* @param data - The data to parse from
* @param key_path - The path to the key (excluding the key itself)
* @returns The parsed value
*/
function parse$1(key, inference_type, data, key_path = ["data"]) {
	const should_optional = !inference_type.optional || hasDataFromKeyPath({ data }, [...key_path, key]);
	switch (inference_type.type) {
		case "renderer": return should_optional ? parseItem(accessDataFromKeyPath({ data }, [...key_path, key]), inference_type.renderers.map((type) => getParserByName(type))) : void 0;
		case "array": switch (inference_type.array_type) {
			case "renderer": return should_optional ? parse(accessDataFromKeyPath({ data }, [...key_path, key]), true, inference_type.renderers.map((type) => getParserByName(type))) : void 0;
			case "object": return should_optional ? accessDataFromKeyPath({ data }, [...key_path, key]).map((_, idx) => {
				return parseObject(`${idx}`, data, [...key_path, key], inference_type.items.keys, should_optional);
			}) : void 0;
			case "primitive": return should_optional ? accessDataFromKeyPath({ data }, [...key_path, key]) : void 0;
			default: throw new Error("Unreachable code reached! Switch missing case!");
		}
		case "object": return parseObject(key, data, key_path, inference_type.keys, should_optional);
		case "misc": switch (inference_type.misc_type) {
			case "NavigationEndpoint": return should_optional ? new NavigationEndpoint(accessDataFromKeyPath({ data }, [...key_path, key])) : void 0;
			case "Text": return should_optional ? new Text$1(accessDataFromKeyPath({ data }, [...key_path, key])) : void 0;
			case "Thumbnail": return should_optional ? Thumbnail.fromResponse(accessDataFromKeyPath({ data }, [...key_path, key])) : void 0;
			case "Author": return !inference_type.optional || hasDataFromKeyPath({ data }, [...key_path, inference_type.params[0]]) ? new Author(accessDataFromKeyPath({ data }, [...key_path, inference_type.params[0]]), inference_type.params[1] ? accessDataFromKeyPath({ data }, [...key_path, inference_type.params[1]]) : void 0) : void 0;
			default: throw new Error("Unreachable code reached! Switch missing case!");
		}
		case "primitive": return accessDataFromKeyPath({ data }, [...key_path, key]);
	}
}
/**
* Merges two sets of key info, resolving any conflicts
* @param key_info - The current key info
* @param new_key_info - The new key info
* @returns The merged key info
*/
function mergeKeyInfo(key_info, new_key_info) {
	const changed_keys = /* @__PURE__ */ new Map();
	const current_keys = new Set(key_info.map(([key]) => key));
	const new_keys = new Set(new_key_info.map(([key]) => key));
	const added_keys = new_key_info.filter(([key]) => !current_keys.has(key));
	const removed_keys = key_info.filter(([key]) => !new_keys.has(key));
	const common_keys = key_info.filter(([key]) => new_keys.has(key));
	const new_key_map = new Map(new_key_info);
	for (const [key, type] of common_keys) {
		const new_type = new_key_map.get(key);
		if (!new_type) continue;
		if (type.type !== new_type.type) {
			changed_keys.set(key, {
				type: "primitive",
				typeof: ["unknown"],
				optional: true
			});
			continue;
		}
		switch (type.type) {
			case "object":
				{
					if (new_type.type !== "object") continue;
					const { resolved_key_info } = mergeKeyInfo(type.keys, new_type.keys);
					const resolved_key = {
						type: "object",
						keys: resolved_key_info,
						optional: type.optional || new_type.optional
					};
					if (JSON.stringify(resolved_key) !== JSON.stringify(type)) changed_keys.set(key, resolved_key);
				}
				break;
			case "renderer":
				{
					if (new_type.type !== "renderer") continue;
					const resolved_key = {
						type: "renderer",
						renderers: {
							...type.renderers,
							...new_type.renderers
						},
						optional: type.optional || new_type.optional
					};
					if (JSON.stringify({
						...resolved_key,
						renderers: Object.keys(resolved_key.renderers)
					}) !== JSON.stringify({
						...type,
						renderers: Object.keys(type.renderers)
					})) changed_keys.set(key, resolved_key);
				}
				break;
			case "array":
				if (new_type.type !== "array") continue;
				switch (type.array_type) {
					case "renderer":
						{
							if (new_type.array_type !== "renderer") {
								changed_keys.set(key, {
									type: "array",
									array_type: "primitive",
									items: {
										type: "primitive",
										typeof: ["unknown"],
										optional: true
									},
									optional: true
								});
								continue;
							}
							const resolved_key = {
								type: "array",
								array_type: "renderer",
								renderers: {
									...type.renderers,
									...new_type.renderers
								},
								optional: type.optional || new_type.optional
							};
							if (JSON.stringify({
								...resolved_key,
								renderers: Object.keys(resolved_key.renderers)
							}) !== JSON.stringify({
								...type,
								renderers: Object.keys(type.renderers)
							})) changed_keys.set(key, resolved_key);
						}
						break;
					case "object":
						{
							if (new_type.array_type === "primitive" && new_type.items.typeof.length == 1 && new_type.items.typeof[0] === "never") continue;
							if (new_type.array_type !== "object") {
								changed_keys.set(key, {
									type: "array",
									array_type: "primitive",
									items: {
										type: "primitive",
										typeof: ["unknown"],
										optional: true
									},
									optional: true
								});
								continue;
							}
							const { resolved_key_info } = mergeKeyInfo(type.items.keys, new_type.items.keys);
							const resolved_key = {
								type: "array",
								array_type: "object",
								items: {
									type: "object",
									keys: resolved_key_info,
									optional: type.items.optional || new_type.items.optional
								},
								optional: type.optional || new_type.optional
							};
							if (JSON.stringify(resolved_key) !== JSON.stringify(type)) changed_keys.set(key, resolved_key);
						}
						break;
					case "primitive":
						{
							if (type.items.typeof.includes("never") && new_type.array_type === "object") {
								changed_keys.set(key, new_type);
								continue;
							}
							if (new_type.array_type !== "primitive") {
								changed_keys.set(key, {
									type: "array",
									array_type: "primitive",
									items: {
										type: "primitive",
										typeof: ["unknown"],
										optional: true
									},
									optional: true
								});
								continue;
							}
							const key_types = /* @__PURE__ */ new Set([...new_type.items.typeof, ...type.items.typeof]);
							if (key_types.size > 1 && key_types.has("never")) key_types.delete("never");
							const resolved_key = {
								type: "array",
								array_type: "primitive",
								items: {
									type: "primitive",
									typeof: Array.from(key_types),
									optional: type.items.optional || new_type.items.optional
								},
								optional: type.optional || new_type.optional
							};
							if (JSON.stringify(resolved_key) !== JSON.stringify(type)) changed_keys.set(key, resolved_key);
						}
						break;
					default: throw new Error("Unreachable code reached! Switch missing case!");
				}
				break;
			case "misc":
				if (new_type.type !== "misc") continue;
				if (type.misc_type !== new_type.misc_type) changed_keys.set(key, {
					type: "primitive",
					typeof: ["unknown"],
					optional: true
				});
				switch (type.misc_type) {
					case "Author": {
						if (new_type.misc_type !== "Author") break;
						const had_optional_param = type.params[1] || new_type.params[1];
						const resolved_key = {
							type: "misc",
							misc_type: "Author",
							optional: type.optional || new_type.optional,
							params: [new_type.params[0], had_optional_param]
						};
						if (JSON.stringify(resolved_key) !== JSON.stringify(type)) changed_keys.set(key, resolved_key);
					}
				}
				break;
			case "primitive": {
				if (new_type.type !== "primitive") continue;
				const resolved_key = {
					type: "primitive",
					typeof: Array.from(/* @__PURE__ */ new Set([...new_type.typeof, ...type.typeof])),
					optional: type.optional || new_type.optional
				};
				if (JSON.stringify(resolved_key) !== JSON.stringify(type)) changed_keys.set(key, resolved_key);
			}
		}
	}
	for (const [key, type] of added_keys) changed_keys.set(key, {
		...type,
		optional: true
	});
	for (const [key, type] of removed_keys) changed_keys.set(key, {
		...type,
		optional: true
	});
	const unchanged_keys = key_info.filter(([key]) => !changed_keys.has(key));
	return {
		resolved_key_info: [...new Map([...unchanged_keys, ...changed_keys]).entries()],
		changed_keys: [...changed_keys.entries()]
	};
}
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/continuations.js
var ItemSectionContinuation = class extends YTNode {
	static type = "itemSectionContinuation";
	contents;
	continuation;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
		if (Array.isArray(data.continuations)) this.continuation = data.continuations?.at(0)?.nextContinuationData?.continuation;
	}
};
var NavigateAction = class extends YTNode {
	static type = "navigateAction";
	endpoint;
	constructor(data) {
		super();
		this.endpoint = new NavigationEndpoint(data.endpoint);
	}
};
var ShowMiniplayerCommand = class extends YTNode {
	static type = "showMiniplayerCommand";
	miniplayer_command;
	show_premium_branding;
	constructor(data) {
		super();
		this.miniplayer_command = new NavigationEndpoint(data.miniplayerCommand);
		this.show_premium_branding = data.showPremiumBranding;
	}
};
var ReloadContinuationItemsCommand = class extends YTNode {
	static type = "reloadContinuationItemsCommand";
	target_id;
	contents;
	slot;
	constructor(data) {
		super();
		this.target_id = data.targetId;
		this.contents = parse(data.continuationItems, true);
		this.slot = data?.slot;
	}
};
var SectionListContinuation = class extends YTNode {
	static type = "sectionListContinuation";
	continuation;
	contents;
	constructor(data) {
		super();
		this.contents = parse(data.contents, true);
		this.continuation = data.continuations?.[0]?.nextContinuationData?.continuation || data.continuations?.[0]?.reloadContinuationData?.continuation || null;
	}
};
var MusicPlaylistShelfContinuation = class extends YTNode {
	static type = "musicPlaylistShelfContinuation";
	continuation;
	contents;
	constructor(data) {
		super();
		this.contents = parse(data.contents, true);
		this.continuation = data.continuations?.[0].nextContinuationData.continuation || null;
	}
};
var MusicShelfContinuation = class extends YTNode {
	static type = "musicShelfContinuation";
	continuation;
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
		this.continuation = data.continuations?.[0].nextContinuationData?.continuation || data.continuations?.[0].reloadContinuationData?.continuation || null;
	}
};
var GridContinuation = class extends YTNode {
	static type = "gridContinuation";
	continuation;
	items;
	constructor(data) {
		super();
		this.items = parse(data.items, true);
		this.continuation = data.continuations?.[0].nextContinuationData.continuation || null;
	}
	get contents() {
		return this.items;
	}
};
var PlaylistPanelContinuation = class extends YTNode {
	static type = "playlistPanelContinuation";
	continuation;
	contents;
	constructor(data) {
		super();
		this.contents = parseArray(data.contents);
		this.continuation = data.continuations?.[0]?.nextContinuationData?.continuation || data.continuations?.[0]?.nextRadioContinuationData?.continuation || null;
	}
};
var Continuation = class extends YTNode {
	static type = "continuation";
	continuation_type;
	timeout_ms;
	time_until_last_message_ms;
	token;
	constructor(data) {
		super();
		this.continuation_type = data.type;
		this.timeout_ms = data.continuation?.timeoutMs;
		this.time_until_last_message_ms = data.continuation?.timeUntilLastMessageMsec;
		this.token = data.continuation?.continuation;
	}
};
var LiveChatContinuation = class extends YTNode {
	static type = "liveChatContinuation";
	actions;
	action_panel;
	item_list;
	header;
	participants_list;
	popout_message;
	emojis;
	continuation;
	viewer_name;
	constructor(data) {
		super();
		this.actions = parse(data.actions?.map((action) => {
			delete action.clickTrackingParams;
			return action;
		}), true) || observe([]);
		this.action_panel = parseItem(data.actionPanel);
		this.item_list = parseItem(data.itemList, LiveChatItemList);
		this.header = parseItem(data.header, LiveChatHeader);
		this.participants_list = parseItem(data.participantsList, LiveChatParticipantsList);
		this.popout_message = parseItem(data.popoutMessage, Message);
		this.emojis = data.emojis?.map((emoji) => ({
			emoji_id: emoji.emojiId,
			shortcuts: emoji.shortcuts,
			search_terms: emoji.searchTerms,
			image: Thumbnail.fromResponse(emoji.image),
			is_custom_emoji: emoji.isCustomEmoji
		})) || [];
		let continuation, type;
		if (data.continuations?.[0].timedContinuationData) {
			type = "timed";
			continuation = data.continuations?.[0].timedContinuationData;
		} else if (data.continuations?.[0].invalidationContinuationData) {
			type = "invalidation";
			continuation = data.continuations?.[0].invalidationContinuationData;
		} else if (data.continuations?.[0].liveChatReplayContinuationData) {
			type = "replay";
			continuation = data.continuations?.[0].liveChatReplayContinuationData;
		}
		this.continuation = new Continuation({
			continuation,
			type
		});
		this.viewer_name = data.viewerName;
	}
};
var ContinuationCommand = class extends YTNode {
	static type = "ContinuationCommand";
	request;
	token;
	constructor(data) {
		super();
		this.request = data.request;
		this.token = data.token;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/misc/common.js
function createBaseKeyValuePair() {
	return {
		key: void 0,
		value: void 0
	};
}
var KeyValuePair = {
	encode(message, writer = new BinaryWriter()) {
		if (message.key !== void 0) writer.uint32(10).string(message.key);
		if (message.value !== void 0) writer.uint32(18).string(message.value);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseKeyValuePair();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.key = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.value = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseFormatXTags() {
	return { xtags: [] };
}
var FormatXTags = {
	encode(message, writer = new BinaryWriter()) {
		for (const v of message.xtags) KeyValuePair.encode(v, writer.uint32(10).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseFormatXTags();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.xtags.push(KeyValuePair.decode(reader, reader.uint32()));
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/Format.js
var Format = class {
	#this_response_nsig_cache;
	itag;
	url;
	width;
	height;
	last_modified;
	last_modified_ms;
	content_length;
	quality;
	xtags;
	drm_families;
	fps;
	quality_label;
	projection_type;
	average_bitrate;
	bitrate;
	spatial_audio_type;
	target_duration_dec;
	fair_play_key_uri;
	stereo_layout;
	max_dvr_duration_sec;
	high_replication;
	audio_quality;
	approx_duration_ms;
	audio_sample_rate;
	audio_channels;
	loudness_db;
	signature_cipher;
	is_drc;
	is_vb;
	is_sr;
	drm_track_type;
	distinct_params;
	track_absolute_loudness_lkfs;
	mime_type;
	is_type_otf;
	init_range;
	index_range;
	cipher;
	audio_track;
	has_audio;
	has_video;
	has_text;
	language;
	is_dubbed;
	is_auto_dubbed;
	is_descriptive;
	is_secondary;
	is_original;
	color_info;
	caption_track;
	constructor(data, this_response_nsig_cache) {
		if (this_response_nsig_cache) this.#this_response_nsig_cache = this_response_nsig_cache;
		this.itag = data.itag;
		this.mime_type = data.mimeType;
		this.is_type_otf = data.type === "FORMAT_STREAM_TYPE_OTF";
		this.bitrate = data.bitrate;
		this.average_bitrate = data.averageBitrate;
		if (Reflect.has(data, "width") && Reflect.has(data, "height")) {
			this.width = parseInt(data.width);
			this.height = parseInt(data.height);
		}
		if (Reflect.has(data, "projectionType")) this.projection_type = data.projectionType;
		if (Reflect.has(data, "stereoLayout")) this.stereo_layout = data.stereoLayout?.replace("STEREO_LAYOUT_", "");
		if (Reflect.has(data, "initRange")) this.init_range = {
			start: parseInt(data.initRange.start),
			end: parseInt(data.initRange.end)
		};
		if (Reflect.has(data, "indexRange")) this.index_range = {
			start: parseInt(data.indexRange.start),
			end: parseInt(data.indexRange.end)
		};
		this.last_modified = new Date(Math.floor(parseInt(data.lastModified) / 1e3));
		this.last_modified_ms = data.lastModified;
		if (Reflect.has(data, "contentLength")) this.content_length = parseInt(data.contentLength);
		if (Reflect.has(data, "quality")) this.quality = data.quality;
		if (Reflect.has(data, "qualityLabel")) this.quality_label = data.qualityLabel;
		if (Reflect.has(data, "fps")) this.fps = data.fps;
		if (Reflect.has(data, "url")) this.url = data.url;
		if (Reflect.has(data, "cipher")) this.cipher = data.cipher;
		if (Reflect.has(data, "signatureCipher")) this.signature_cipher = data.signatureCipher;
		if (Reflect.has(data, "audioQuality")) this.audio_quality = data.audioQuality;
		this.approx_duration_ms = parseInt(data.approxDurationMs);
		if (Reflect.has(data, "audioSampleRate")) this.audio_sample_rate = parseInt(data.audioSampleRate);
		if (Reflect.has(data, "audioChannels")) this.audio_channels = data.audioChannels;
		if (Reflect.has(data, "loudnessDb")) this.loudness_db = data.loudnessDb;
		if (Reflect.has(data, "spatialAudioType")) this.spatial_audio_type = data.spatialAudioType?.replace("SPATIAL_AUDIO_TYPE_", "");
		if (Reflect.has(data, "maxDvrDurationSec")) this.max_dvr_duration_sec = data.maxDvrDurationSec;
		if (Reflect.has(data, "targetDurationSec")) this.target_duration_dec = data.targetDurationSec;
		this.has_audio = !!data.audioBitrate || !!data.audioQuality;
		this.has_video = !!data.qualityLabel;
		this.has_text = !!data.captionTrack;
		if (Reflect.has(data, "xtags")) this.xtags = data.xtags;
		if (Reflect.has(data, "fairPlayKeyUri")) this.fair_play_key_uri = data.fairPlayKeyUri;
		if (Reflect.has(data, "drmFamilies")) this.drm_families = data.drmFamilies;
		if (Reflect.has(data, "drmTrackType")) this.drm_track_type = data.drmTrackType;
		if (Reflect.has(data, "distinctParams")) this.distinct_params = data.distinctParams;
		if (Reflect.has(data, "trackAbsoluteLoudnessLkfs")) this.track_absolute_loudness_lkfs = data.trackAbsoluteLoudnessLkfs;
		if (Reflect.has(data, "highReplication")) this.high_replication = data.highReplication;
		if (Reflect.has(data, "colorInfo")) this.color_info = {
			primaries: data.colorInfo.primaries?.replace("COLOR_PRIMARIES_", ""),
			transfer_characteristics: data.colorInfo.transferCharacteristics?.replace("COLOR_TRANSFER_CHARACTERISTICS_", ""),
			matrix_coefficients: data.colorInfo.matrixCoefficients?.replace("COLOR_MATRIX_COEFFICIENTS_", "")
		};
		if (Reflect.has(data, "audioTrack")) this.audio_track = {
			audio_is_default: data.audioTrack.audioIsDefault,
			display_name: data.audioTrack.displayName,
			id: data.audioTrack.id
		};
		if (Reflect.has(data, "captionTrack")) this.caption_track = {
			display_name: data.captionTrack.displayName,
			vss_id: data.captionTrack.vssId,
			language_code: data.captionTrack.languageCode,
			kind: data.captionTrack.kind,
			id: data.captionTrack.id
		};
		const xtags = this.xtags ? FormatXTags.decode(base64ToU8(decodeURIComponent(this.xtags).replace(/-/g, "+").replace(/_/g, "/"))).xtags : [];
		if (this.has_audio || this.has_text) {
			this.language = xtags.find((tag) => tag.key === "lang")?.value || null;
			if (this.has_audio) {
				this.is_drc = !!data.isDrc || xtags.some((tag) => tag.key === "drc" && tag.value === "1");
				this.is_vb = !!data.isVb || xtags.some((tag) => tag.key === "vb" && tag.value === "1");
				const audio_content = xtags.find((tag) => tag.key === "acont")?.value;
				this.is_dubbed = audio_content === "dubbed";
				this.is_descriptive = audio_content === "descriptive";
				this.is_secondary = audio_content === "secondary";
				this.is_auto_dubbed = audio_content === "dubbed-auto";
				this.is_original = audio_content === "original" || !this.is_dubbed && !this.is_descriptive && !this.is_secondary && !this.is_auto_dubbed && !this.is_drc;
			}
			if (this.has_text && !this.language && this.caption_track) this.language = this.caption_track.language_code;
		}
		if (this.has_video) this.is_sr = xtags.some((tag) => tag.key === "sr" && tag.value === "1");
	}
	/**
	* Deciphers the URL using the provided player instance.
	* @param player - An optional instance of the Player class used to decipher the URL.
	* @returns The deciphered URL as a string. If no player is provided, returns the original URL or an empty string.
	*/
	async decipher(player) {
		if (!player) return this.url || "";
		return player.decipher(this.url, this.signature_cipher, this.cipher, this.#this_response_nsig_cache);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/VideoDetails.js
var VideoDetails = class {
	id;
	channel_id;
	title;
	duration;
	keywords;
	is_owner_viewing;
	short_description;
	thumbnail;
	allow_ratings;
	view_count;
	author;
	is_private;
	is_live;
	is_live_content;
	is_live_dvr_enabled;
	is_upcoming;
	is_crawlable;
	is_post_live_dvr;
	is_low_latency_live_stream;
	live_chunk_readahead;
	constructor(data) {
		this.id = data.videoId;
		this.channel_id = data.channelId;
		this.title = data.title;
		this.duration = parseInt(data.lengthSeconds);
		this.keywords = data.keywords;
		this.is_owner_viewing = !!data.isOwnerViewing;
		this.short_description = data.shortDescription;
		this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
		this.allow_ratings = !!data.allowRatings;
		this.view_count = parseInt(data.viewCount);
		this.author = data.author;
		this.is_private = !!data.isPrivate;
		this.is_live = !!data.isLive;
		this.is_live_content = !!data.isLiveContent;
		this.is_live_dvr_enabled = !!data.isLiveDvrEnabled;
		this.is_low_latency_live_stream = !!data.isLowLatencyLiveStream;
		this.is_upcoming = !!data.isUpcoming;
		this.is_post_live_dvr = !!data.isPostLiveDvr;
		this.is_crawlable = !!data.isCrawlable;
		this.live_chunk_readahead = data.liveChunkReadahead;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/parser.js
var TAG$3 = "Parser";
var IGNORED_LIST = /* @__PURE__ */ new Set([
	"AdSlot",
	"DisplayAd",
	"SearchPyv",
	"MealbarPromo",
	"PrimetimePromo",
	"PromotedSparklesWeb",
	"CompactPromotedVideo",
	"BrandVideoShelf",
	"BrandVideoSingleton",
	"StatementBanner",
	"GuideSigninPromo",
	"AdsEngagementPanelContent",
	"MiniGameCardView",
	"GenAiFeedbackFormView"
]);
var RUNTIME_NODES = new Map(Object.entries(nodes_exports));
var DYNAMIC_NODES = /* @__PURE__ */ new Map();
var MEMO = null;
var ERROR_HANDLER = ({ classname, ...context }) => {
	switch (context.error_type) {
		case "parse":
			if (context.error instanceof Error) warn(TAG$3, new InnertubeError(`Something went wrong at ${classname}!\nThis is a bug, please report it at ${package_default.bugs.url}`, {
				stack: context.error.stack,
				classdata: JSON.stringify(context.classdata, null, 2)
			}));
			break;
		case "typecheck":
			warn(TAG$3, new ParsingError(`Type mismatch, got ${classname} expected ${Array.isArray(context.expected) ? context.expected.join(" | ") : context.expected}.`, context.classdata));
			break;
		case "mutation_data_missing":
			warn(TAG$3, new InnertubeError(`Mutation data required for processing ${classname}, but none found.\nThis is a bug, please report it at ${package_default.bugs.url}`));
			break;
		case "mutation_data_invalid":
			warn(TAG$3, new InnertubeError(`Mutation data missing or invalid for ${context.failed} out of ${context.total} MusicMultiSelectMenuItems. The titles of the failed items are: ${context.titles.join(", ")}.\nThis is a bug, please report it at ${package_default.bugs.url}`));
			break;
		case "class_not_found":
			warn(TAG$3, new InnertubeError(`${classname} not found!\nThis is a bug, want to help us fix it? Follow the instructions at ${package_default.homepage.split("#", 1)[0]}/blob/main/docs/updating-the-parser.md or report it at ${package_default.bugs.url}!\nIntrospected and JIT generated this class in the meantime:\n${generateTypescriptClass(classname, context.key_info)}`));
			break;
		case "class_changed":
			warn(TAG$3, `${classname} changed!\nThe following keys where altered: ${context.changed_keys.map(([key]) => camelToSnake(key)).join(", ")}\nThe class has changed to:\n${generateTypescriptClass(classname, context.key_info)}`);
			break;
		default: warn(TAG$3, "Unreachable code reached at ParserErrorHandler");
	}
};
function _clearMemo() {
	MEMO = null;
}
function _createMemo() {
	MEMO = new Memo();
}
function _addToMemo(classname, result) {
	if (!MEMO) return;
	const list = MEMO.get(classname);
	if (!list) return MEMO.set(classname, [result]);
	list.push(result);
}
function _getMemo() {
	if (!MEMO) throw new Error("Parser#getMemo() called before Parser#createMemo()");
	return MEMO;
}
function shouldIgnore(classname) {
	return IGNORED_LIST.has(classname);
}
function sanitizeClassName(input) {
	return (input.charAt(0).toUpperCase() + input.slice(1)).replace(/Renderer|Model/g, "").replace(/Radio/g, "Mix").trim();
}
function getParserByName(classname) {
	const ParserConstructor = RUNTIME_NODES.get(classname);
	if (!ParserConstructor) {
		const error = /* @__PURE__ */ new Error(`Module not found: ${classname}`);
		error.code = "MODULE_NOT_FOUND";
		throw error;
	}
	return ParserConstructor;
}
function hasParser(classname) {
	return RUNTIME_NODES.has(classname);
}
function addRuntimeParser(classname, ParserConstructor) {
	RUNTIME_NODES.set(classname, ParserConstructor);
	DYNAMIC_NODES.set(classname, ParserConstructor);
}
/**
* Parses a given InnerTube response.
* @param data - Raw data.
*/
function parseResponse(data) {
	const parsed_data = {};
	_createMemo();
	const contents = parse(data.contents);
	const contents_memo = _getMemo();
	if (contents) {
		parsed_data.contents = contents;
		parsed_data.contents_memo = contents_memo;
	}
	_clearMemo();
	_createMemo();
	const on_response_received_actions = data.onResponseReceivedActions ? parseRR(data.onResponseReceivedActions) : null;
	const on_response_received_actions_memo = _getMemo();
	if (on_response_received_actions) {
		parsed_data.on_response_received_actions = on_response_received_actions;
		parsed_data.on_response_received_actions_memo = on_response_received_actions_memo;
	}
	_clearMemo();
	_createMemo();
	const on_response_received_endpoints = data.onResponseReceivedEndpoints ? parseRR(data.onResponseReceivedEndpoints) : null;
	const on_response_received_endpoints_memo = _getMemo();
	if (on_response_received_endpoints) {
		parsed_data.on_response_received_endpoints = on_response_received_endpoints;
		parsed_data.on_response_received_endpoints_memo = on_response_received_endpoints_memo;
	}
	_clearMemo();
	_createMemo();
	const on_response_received_commands = data.onResponseReceivedCommands ? parseRR(data.onResponseReceivedCommands) : null;
	const on_response_received_commands_memo = _getMemo();
	if (on_response_received_commands) {
		parsed_data.on_response_received_commands = on_response_received_commands;
		parsed_data.on_response_received_commands_memo = on_response_received_commands_memo;
	}
	_clearMemo();
	_createMemo();
	const continuation_contents = data.continuationContents ? parseLC(data.continuationContents) : null;
	const continuation_contents_memo = _getMemo();
	if (continuation_contents) {
		parsed_data.continuation_contents = continuation_contents;
		parsed_data.continuation_contents_memo = continuation_contents_memo;
	}
	_clearMemo();
	_createMemo();
	const actions = data.actions ? parseActions(data.actions) : null;
	const actions_memo = _getMemo();
	if (actions) {
		parsed_data.actions = actions;
		parsed_data.actions_memo = actions_memo;
	}
	_clearMemo();
	_createMemo();
	const live_chat_item_context_menu_supported_renderers = data.liveChatItemContextMenuSupportedRenderers ? parseItem(data.liveChatItemContextMenuSupportedRenderers) : null;
	const live_chat_item_context_menu_supported_renderers_memo = _getMemo();
	if (live_chat_item_context_menu_supported_renderers) {
		parsed_data.live_chat_item_context_menu_supported_renderers = live_chat_item_context_menu_supported_renderers;
		parsed_data.live_chat_item_context_menu_supported_renderers_memo = live_chat_item_context_menu_supported_renderers_memo;
	}
	_clearMemo();
	_createMemo();
	const header = data.header ? parse(data.header) : null;
	const header_memo = _getMemo();
	if (header) {
		parsed_data.header = header;
		parsed_data.header_memo = header_memo;
	}
	_clearMemo();
	_createMemo();
	const sidebar = data.sidebar ? parseItem(data.sidebar) : null;
	const sidebar_memo = _getMemo();
	if (sidebar) {
		parsed_data.sidebar = sidebar;
		parsed_data.sidebar_memo = sidebar_memo;
	}
	_clearMemo();
	_createMemo();
	const items = parse(data.items);
	if (items) {
		parsed_data.items = items;
		parsed_data.items_memo = _getMemo();
	}
	_clearMemo();
	applyMutations(contents_memo, data.frameworkUpdates?.entityBatchUpdate?.mutations);
	if (on_response_received_endpoints_memo) applyCommentsMutations(on_response_received_endpoints_memo, data.frameworkUpdates?.entityBatchUpdate?.mutations);
	const continuation = data.continuation ? parseC(data.continuation) : null;
	if (continuation) parsed_data.continuation = continuation;
	const continuation_endpoint = data.continuationEndpoint ? parseLC(data.continuationEndpoint) : null;
	if (continuation_endpoint) parsed_data.continuation_endpoint = continuation_endpoint;
	const metadata = parse(data.metadata);
	if (metadata) parsed_data.metadata = metadata;
	const microformat = parseItem(data.microformat);
	if (microformat) parsed_data.microformat = microformat;
	const overlay = parseItem(data.overlay);
	if (overlay) parsed_data.overlay = overlay;
	const alerts = parseArray(data.alerts, [Alert, AlertWithButton]);
	if (alerts.length) parsed_data.alerts = alerts;
	const refinements = data.refinements;
	if (refinements) parsed_data.refinements = refinements;
	const estimated_results = data.estimatedResults ? parseInt(data.estimatedResults) : null;
	if (estimated_results) parsed_data.estimated_results = estimated_results;
	const player_overlays = parse(data.playerOverlays);
	if (player_overlays) parsed_data.player_overlays = player_overlays;
	const background = parseItem(data.background, MusicThumbnail);
	if (background) parsed_data.background = background;
	const playback_tracking = data.playbackTracking ? {
		videostats_watchtime_url: data.playbackTracking.videostatsWatchtimeUrl.baseUrl,
		videostats_playback_url: data.playbackTracking.videostatsPlaybackUrl.baseUrl
	} : null;
	if (playback_tracking) parsed_data.playback_tracking = playback_tracking;
	const playability_status = data.playabilityStatus ? {
		status: data.playabilityStatus.status,
		reason: data.playabilityStatus.reason || "",
		embeddable: !!data.playabilityStatus.playableInEmbed || false,
		audio_only_playability: parseItem(data.playabilityStatus.audioOnlyPlayability, AudioOnlyPlayability),
		error_screen: parseItem(data.playabilityStatus.errorScreen)
	} : null;
	if (playability_status) parsed_data.playability_status = playability_status;
	if (data.streamingData) {
		const this_response_nsig_cache = /* @__PURE__ */ new Map();
		parsed_data.streaming_data = {
			expires: new Date(Date.now() + parseInt(data.streamingData.expiresInSeconds) * 1e3),
			formats: parseFormats(data.streamingData.formats, this_response_nsig_cache),
			adaptive_formats: parseFormats(data.streamingData.adaptiveFormats, this_response_nsig_cache),
			dash_manifest_url: data.streamingData.dashManifestUrl,
			hls_manifest_url: data.streamingData.hlsManifestUrl,
			server_abr_streaming_url: data.streamingData.serverAbrStreamingUrl
		};
	}
	if (data.playerConfig) parsed_data.player_config = {
		audio_config: {
			loudness_db: data.playerConfig.audioConfig?.loudnessDb,
			perceptual_loudness_db: data.playerConfig.audioConfig?.perceptualLoudnessDb,
			enable_per_format_loudness: data.playerConfig.audioConfig?.enablePerFormatLoudness
		},
		stream_selection_config: { max_bitrate: data.playerConfig.streamSelectionConfig?.maxBitrate || "0" },
		media_common_config: {
			dynamic_readahead_config: {
				max_read_ahead_media_time_ms: data.playerConfig.mediaCommonConfig?.dynamicReadaheadConfig?.maxReadAheadMediaTimeMs || 0,
				min_read_ahead_media_time_ms: data.playerConfig.mediaCommonConfig?.dynamicReadaheadConfig?.minReadAheadMediaTimeMs || 0,
				read_ahead_growth_rate_ms: data.playerConfig.mediaCommonConfig?.dynamicReadaheadConfig?.readAheadGrowthRateMs || 0
			},
			media_ustreamer_request_config: { video_playback_ustreamer_config: data.playerConfig.mediaCommonConfig?.mediaUstreamerRequestConfig?.videoPlaybackUstreamerConfig }
		}
	};
	const current_video_endpoint = data.currentVideoEndpoint ? new NavigationEndpoint(data.currentVideoEndpoint) : null;
	if (current_video_endpoint) parsed_data.current_video_endpoint = current_video_endpoint;
	const endpoint = data.endpoint ? new NavigationEndpoint(data.endpoint) : null;
	if (endpoint) parsed_data.endpoint = endpoint;
	const captions = parseItem(data.captions, PlayerCaptionsTracklist);
	if (captions) parsed_data.captions = captions;
	const video_details = data.videoDetails ? new VideoDetails(data.videoDetails) : null;
	if (video_details) parsed_data.video_details = video_details;
	const annotations = parseArray(data.annotations, PlayerAnnotationsExpanded);
	if (annotations.length) parsed_data.annotations = annotations;
	const storyboards = parseItem(data.storyboards, [PlayerStoryboardSpec, PlayerLiveStoryboardSpec]);
	if (storyboards) parsed_data.storyboards = storyboards;
	const endscreen = parseItem(data.endscreen, Endscreen);
	if (endscreen) parsed_data.endscreen = endscreen;
	const cards = parseItem(data.cards, CardCollection);
	if (cards) parsed_data.cards = cards;
	const engagement_panels = parseArray(data.engagementPanels, EngagementPanelSectionList);
	if (engagement_panels.length) parsed_data.engagement_panels = engagement_panels;
	const content = parseItem(data.content);
	if (content) parsed_data.content = content;
	if (data.bgChallenge) parsed_data.bg_challenge = {
		interpreter_url: {
			private_do_not_access_or_else_trusted_resource_url_wrapped_value: data.bgChallenge.interpreterUrl.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue,
			private_do_not_access_or_else_safe_script_wrapped_value: data.bgChallenge.interpreterUrl.privateDoNotAccessOrElseSafeScriptWrappedValue
		},
		interpreter_hash: data.bgChallenge.interpreterHash,
		program: data.bgChallenge.program,
		global_name: data.bgChallenge.globalName,
		client_experiments_state_blob: data.bgChallenge.clientExperimentsStateBlob
	};
	if (data.challenge) parsed_data.challenge = data.challenge;
	if (data.playerResponse) parsed_data.player_response = parseResponse(data.playerResponse);
	if (data.watchNextResponse) parsed_data.watch_next_response = parseResponse(data.watchNextResponse);
	if (data.cpnInfo) parsed_data.cpn_info = {
		cpn: data.cpnInfo.cpn,
		cpn_source: data.cpnInfo.cpnSource
	};
	if (data.entries) parsed_data.entries = data.entries.map((entry) => new NavigationEndpoint(entry));
	if (data.targetId) parsed_data.target_id = data.targetId;
	return parsed_data;
}
function parseItem(data, validTypes) {
	if (!data) return null;
	const keys = Object.keys(data);
	if (!keys.length) return null;
	const classname = sanitizeClassName(keys[0]);
	if (!shouldIgnore(classname)) try {
		const TargetClass = hasParser(classname) ? getParserByName(classname) : generateRuntimeClass(classname, data[keys[0]], ERROR_HANDLER);
		if (validTypes) {
			if (Array.isArray(validTypes)) {
				if (!validTypes.some((type) => type.type === TargetClass.type)) {
					ERROR_HANDLER({
						classdata: data[keys[0]],
						classname,
						error_type: "typecheck",
						expected: validTypes.map((type) => type.type)
					});
					return null;
				}
			} else if (TargetClass.type !== validTypes.type) {
				ERROR_HANDLER({
					classdata: data[keys[0]],
					classname,
					error_type: "typecheck",
					expected: validTypes.type
				});
				return null;
			}
		}
		const result = new TargetClass(data[keys[0]]);
		_addToMemo(classname, result);
		return result;
	} catch (err) {
		ERROR_HANDLER({
			classname,
			classdata: data[keys[0]],
			error: err,
			error_type: "parse"
		});
		return null;
	}
	return null;
}
function parseArray(data, validTypes) {
	if (Array.isArray(data)) {
		const results = [];
		for (const item of data) {
			const result = parseItem(item, validTypes);
			if (result) results.push(result);
		}
		return observe(results);
	} else if (!data) return observe([]);
	throw new ParsingError("Expected array but got a single item");
}
function parse(data, requireArray, validTypes) {
	if (!data) return null;
	if (Array.isArray(data)) {
		const results = [];
		for (const item of data) {
			const result = parseItem(item, validTypes);
			if (result) results.push(result);
		}
		const res = observe(results);
		return requireArray ? res : new SuperParsedResult(res);
	} else if (requireArray) throw new ParsingError("Expected array but got a single item");
	return new SuperParsedResult(parseItem(data, validTypes));
}
var command_regexp = /Command$/;
var endpoint_regexp = /Endpoint$/;
var action_regexp = /Action$/;
/**
* Parses an InnerTube command and returns a YTNode instance if applicable.
* @param data - The raw node data to parse
* @returns A YTNode instance if parsing is successful, undefined otherwise
*/
function parseCommand(data) {
	let keys = [];
	try {
		keys = Object.keys(data);
	} catch {}
	for (const key of keys) {
		const value = data[key];
		if (command_regexp.test(key) || endpoint_regexp.test(key) || action_regexp.test(key)) {
			const classname = sanitizeClassName(key);
			if (shouldIgnore(classname)) return void 0;
			try {
				if (hasParser(classname)) return new (getParserByName(classname))(value);
			} catch (error) {
				ERROR_HANDLER({
					error,
					classname,
					classdata: value,
					error_type: "parse"
				});
			}
		}
	}
}
/**
* Parses an array of InnerTube command nodes.
* @param commands - Array of raw command nodes to parse
* @returns An observed array of parsed YTNodes
*/
function parseCommands(commands) {
	if (Array.isArray(commands)) {
		const results = [];
		for (const item of commands) {
			const result = parseCommand(item);
			if (result) results.push(result);
		}
		return observe(results);
	} else if (!commands) return observe([]);
	throw new ParsingError("Expected array but got a single item");
}
function parseC(data) {
	if (data.timedContinuationData) return new Continuation({
		continuation: data.timedContinuationData,
		type: "timed"
	});
	return null;
}
function parseLC(data) {
	if (data.itemSectionContinuation) return new ItemSectionContinuation(data.itemSectionContinuation);
	if (data.sectionListContinuation) return new SectionListContinuation(data.sectionListContinuation);
	if (data.liveChatContinuation) return new LiveChatContinuation(data.liveChatContinuation);
	if (data.musicPlaylistShelfContinuation) return new MusicPlaylistShelfContinuation(data.musicPlaylistShelfContinuation);
	if (data.musicShelfContinuation) return new MusicShelfContinuation(data.musicShelfContinuation);
	if (data.gridContinuation) return new GridContinuation(data.gridContinuation);
	if (data.playlistPanelContinuation) return new PlaylistPanelContinuation(data.playlistPanelContinuation);
	if (data.continuationCommand) return new ContinuationCommand(data.continuationCommand);
	return null;
}
function parseRR(actions) {
	return observe(actions.map((action) => {
		if (action.navigateAction) return new NavigateAction(action.navigateAction);
		else if (action.showMiniplayerCommand) return new ShowMiniplayerCommand(action.showMiniplayerCommand);
		else if (action.reloadContinuationItemsCommand) return new ReloadContinuationItemsCommand(action.reloadContinuationItemsCommand);
		else if (action.appendContinuationItemsAction) return new AppendContinuationItemsAction(action.appendContinuationItemsAction);
		else if (action.openPopupAction) return new OpenPopupAction(action.openPopupAction);
	}).filter((item) => item));
}
function parseActions(data) {
	if (Array.isArray(data)) return parse(data.map((action) => {
		delete action.clickTrackingParams;
		return action;
	}));
	return new SuperParsedResult(parseItem(data));
}
function parseFormats(formats, this_response_nsig_cache) {
	return formats?.map((format) => new Format(format, this_response_nsig_cache)) || [];
}
function applyMutations(memo, mutations) {
	const music_multi_select_menu_items = memo.getType(MusicMultiSelectMenuItem);
	if (music_multi_select_menu_items.length > 0 && !mutations) ERROR_HANDLER({
		error_type: "mutation_data_missing",
		classname: "MusicMultiSelectMenuItem"
	});
	else {
		const missing_or_invalid_mutations = [];
		for (const menu_item of music_multi_select_menu_items) {
			const choice = mutations.find((mutation) => mutation.payload?.musicFormBooleanChoice?.id === menu_item.form_item_entity_key)?.payload.musicFormBooleanChoice;
			if (choice?.selected !== void 0 && choice?.opaqueToken) menu_item.selected = choice.selected;
			else missing_or_invalid_mutations.push(`'${menu_item.title}'`);
		}
		if (missing_or_invalid_mutations.length > 0) ERROR_HANDLER({
			error_type: "mutation_data_invalid",
			classname: "MusicMultiSelectMenuItem",
			total: music_multi_select_menu_items.length,
			failed: missing_or_invalid_mutations.length,
			titles: missing_or_invalid_mutations
		});
	}
	if (mutations) {
		const heat_map_mutations = mutations.filter((mutation) => mutation.payload?.macroMarkersListEntity && mutation.payload.macroMarkersListEntity.markersList?.markerType === "MARKER_TYPE_HEATMAP");
		for (const mutation of heat_map_mutations) {
			const macro_markers_entity = new MacroMarkersListEntity(mutation.payload.macroMarkersListEntity);
			const list = memo.get("MacroMarkersListEntity");
			if (!list) memo.set("MacroMarkersListEntity", [macro_markers_entity]);
			else list.push(macro_markers_entity);
		}
	}
}
function applyCommentsMutations(memo, mutations) {
	const comment_view_items = memo.getType(CommentView);
	if (comment_view_items.length > 0) {
		if (!mutations) ERROR_HANDLER({
			error_type: "mutation_data_missing",
			classname: "CommentView"
		});
		for (const comment_view of comment_view_items) {
			const comment_mutation = mutations.find((mutation) => mutation.payload?.commentEntityPayload?.key === comment_view.keys.comment)?.payload?.commentEntityPayload;
			const toolbar_state_mutation = mutations.find((mutation) => mutation.payload?.engagementToolbarStateEntityPayload?.key === comment_view.keys.toolbar_state)?.payload?.engagementToolbarStateEntityPayload;
			const engagement_toolbar = mutations.find((mutation) => mutation.entityKey === comment_view.keys.toolbar_surface)?.payload?.engagementToolbarSurfaceEntityPayload;
			const comment_surface_mutation = mutations.find((mutation) => mutation.payload?.commentSurfaceEntityPayload?.key === comment_view.keys.comment_surface)?.payload?.commentSurfaceEntityPayload;
			comment_view.applyMutations(comment_mutation, toolbar_state_mutation, engagement_toolbar, comment_surface_mutation);
		}
	}
}
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/AccountInfo.js
var AccountInfo = class {
	#page;
	contents;
	constructor(response) {
		this.#page = parseResponse(response.data);
		if (!this.#page.contents) throw new InnertubeError("Page contents not found");
		const account_section_list = this.#page.contents.array().as(AccountSectionList)[0];
		if (!account_section_list) throw new InnertubeError("Account section list not found");
		this.contents = account_section_list.contents[0];
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/mixins/Feed.js
var Feed = class Feed {
	#page;
	#actions;
	#memo;
	#continuation;
	constructor(actions, response, already_parsed = false) {
		if (this.#isParsed(response) || already_parsed) this.#page = response;
		else this.#page = parseResponse(response.data);
		const memo = concatMemos(...[
			this.#page.contents_memo,
			this.#page.continuation_contents_memo,
			this.#page.on_response_received_commands_memo,
			this.#page.on_response_received_endpoints_memo,
			this.#page.on_response_received_actions_memo,
			this.#page.sidebar_memo,
			this.#page.header_memo
		]);
		if (!memo) throw new InnertubeError("No memo found in feed");
		this.#memo = memo;
		this.#actions = actions;
	}
	#isParsed(response) {
		return !("data" in response);
	}
	/**
	* Get all videos on a given page via memo
	*/
	static getVideosFromMemo(memo) {
		return observe(memo.getType(Video, GridVideo, ReelItem, ShortsLockupView, CompactVideo, LockupView, PlaylistVideo, PlaylistPanelVideo, WatchCardCompactVideo).filter((item) => !item.is(LockupView) || item.content_type === "VIDEO" || item.content_type === "MOVIE" || item.content_type === "SHORT" || item.content_type == "STATION"));
	}
	/**
	* Get all playlists on a given page via memo
	*/
	static getPlaylistsFromMemo(memo) {
		const playlists = memo.getType(Playlist$2, GridPlaylist);
		const lockup_views = memo.getType(LockupView).filter((lockup) => {
			return [
				"PLAYLIST",
				"ALBUM",
				"PODCAST"
			].includes(lockup.content_type);
		});
		if (lockup_views.length > 0) playlists.push(...lockup_views);
		return playlists;
	}
	/**
	* Get all the videos in the feed
	*/
	get videos() {
		return Feed.getVideosFromMemo(this.#memo);
	}
	/**
	* Get all the community posts in the feed
	*/
	get posts() {
		return this.#memo.getType(BackstagePost, Post, SharedPost);
	}
	/**
	* Get all the channels in the feed
	*/
	get channels() {
		return this.#memo.getType(Channel$2, GridChannel);
	}
	/**
	* Get all playlists in the feed
	*/
	get playlists() {
		return Feed.getPlaylistsFromMemo(this.#memo);
	}
	get memo() {
		return this.#memo;
	}
	/**
	* Returns contents from the page.
	*/
	get page_contents() {
		const tab_content = this.#memo.getType(Tab)?.[0].content;
		const reload_continuation_items = this.#memo.getType(ReloadContinuationItemsCommand)[0];
		const append_continuation_items = this.#memo.getType(AppendContinuationItemsAction)[0];
		return tab_content || reload_continuation_items || append_continuation_items;
	}
	/**
	* Returns all segments/sections from the page.
	*/
	get shelves() {
		return this.#memo.getType(Shelf, RichShelf, ReelShelf);
	}
	/**
	* Finds shelf by title.
	*/
	getShelf(title) {
		return this.shelves.find((shelf) => shelf.title.toString() === title);
	}
	/**
	* Returns secondary contents from the page.
	*/
	get secondary_contents() {
		if (!this.#page.contents?.is_node) return null;
		const node = this.#page.contents?.item();
		if (!node.is(TwoColumnBrowseResults, TwoColumnSearchResults)) return null;
		return node.secondary_contents;
	}
	get actions() {
		return this.#actions;
	}
	/**
	* Get the original page data
	*/
	get page() {
		return this.#page;
	}
	/**
	* Checks if the feed has continuation.
	*/
	get has_continuation() {
		return this.#getBodyContinuations().length > 0;
	}
	/**
	* Retrieves continuation data as it is.
	*/
	async getContinuationData() {
		if (this.#continuation) {
			if (this.#continuation.length === 0) throw new InnertubeError("There are no continuations");
			return await this.#continuation[0].endpoint.call(this.#actions, { parse: true });
		}
		this.#continuation = this.#getBodyContinuations();
		if (this.#continuation) return this.getContinuationData();
	}
	/**
	* Retrieves next batch of contents and returns a new {@link Feed} object.
	*/
	async getContinuation() {
		const continuation_data = await this.getContinuationData();
		if (!continuation_data) throw new InnertubeError("Could not get continuation data");
		return new Feed(this.actions, continuation_data, true);
	}
	#getBodyContinuations() {
		if (this.#page.header_memo) {
			const header_continuations = this.#page.header_memo.getType(ContinuationItem, ContinuationItemView);
			return this.#memo.getType(ContinuationItem, ContinuationItemView).filter((continuation) => !header_continuations.includes(continuation));
		}
		return this.#memo.getType(ContinuationItem, ContinuationItemView);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/mixins/FilterableFeed.js
var FilterableFeed = class FilterableFeed extends Feed {
	#filter_nodes;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
	}
	/**
	* Returns the InnerTube renderer nodes representing filters.
	*/
	get filter_nodes() {
		if (this.#filter_nodes) return this.#filter_nodes;
		let primary_filters;
		let secondary_filters;
		if (this.memo.getType(FeedFilterChipBar)?.length > 1) throw new InnertubeError("There are too many feed filter chipbars, you'll need to find the correct one yourself in this.page");
		if (this.memo.has("FeedFilterChipBar")) primary_filters = this.memo.getType(ChipCloudChip);
		else if (this.memo.has("ChipView")) {
			const chips = this.memo.getType(ChipView);
			const firstChip = chips[0];
			if (firstChip.is(ChipView)) {
				if (firstChip.display_type === "CHIP_VIEW_MODEL_DISPLAY_TYPE_DROP_DOWN" || firstChip.display_type === "CHIP_VIEW_MODEL_DISPLAY_TYPE_DROP_DOWN_WITH_CLEAR") {
					const tapCommand = firstChip.tap_command?.command;
					if (tapCommand?.is(ShowSheetCommand) && tapCommand.inline_content?.is(SheetView) && tapCommand.inline_content.content?.is(ListView)) primary_filters = tapCommand.inline_content.content.items.as(ListItemView);
					secondary_filters = observe(chips.slice(1));
				} else primary_filters = chips;
			}
		}
		this.#filter_nodes = {
			primary_filters,
			secondary_filters
		};
		return this.#filter_nodes;
	}
	/**
	* Returns the available primary filters as strings.
	*/
	get filters() {
		return this.filter_nodes?.primary_filters?.map((chip) => {
			if (chip.is(ChipView) || chip.is(ChipCloudChip)) return chip.text?.toString() || "";
			else if (chip.is(ListItemView)) return chip.title?.toString() || "";
			return "";
		}) || [];
	}
	/**
	* Returns the available secondary filters as strings.
	*/
	get secondary_filters() {
		return this.filter_nodes?.secondary_filters?.map((chip) => chip.text?.toString() || "") || [];
	}
	/**
	* Applies given filter and returns a new {@link Feed} object.
	*/
	async getFilteredFeed(filter, secondaryFilter) {
		let filterEndpoint;
		let isSelected = false;
		if (typeof filter === "string") {
			if (!this.filters.includes(filter)) throw new InnertubeError(`Filter '${filter}' not found`, { available_filters: this.filters });
			for (const primaryFilterNode of this.filter_nodes.primary_filters || []) if ((primaryFilterNode.is(ChipView) || primaryFilterNode.is(ChipCloudChip)) && primaryFilterNode.text?.toString() === filter) {
				filterEndpoint = primaryFilterNode.is(ChipView) ? primaryFilterNode.tap_command : primaryFilterNode.endpoint;
				isSelected = primaryFilterNode.is(ChipView) ? primaryFilterNode.selected : primaryFilterNode.is_selected;
			} else if (primaryFilterNode.is(ListItemView) && primaryFilterNode.title?.toString() === filter) {
				filterEndpoint = primaryFilterNode?.renderer_context?.command_context?.on_tap;
				isSelected = primaryFilterNode.is_selected;
			}
		} else if ([
			"ChipCloudChip",
			"ChipView",
			"ListItemView"
		].includes(filter.type)) {
			if (filter.is(ChipView)) filterEndpoint = filter.tap_command;
			else if (filter.is(ChipCloudChip)) filterEndpoint = filter.endpoint;
			else if (filter.is(ListItemView)) filterEndpoint = filter?.renderer_context?.command_context?.on_tap;
			isSelected = filter.is(ChipView) ? filter.selected : filter.is_selected;
		} else throw new InnertubeError("Invalid primary filter type");
		if (!filterEndpoint) throw new InnertubeError("Could not find endpoint for the specified filter");
		if (isSelected && !secondaryFilter) return this;
		let response = isSelected ? this.page : await filterEndpoint.call(this.actions, { parse: true });
		if (secondaryFilter) {
			const feed = new FilterableFeed(this.actions, response, true);
			let secondaryFilterNode;
			if (typeof secondaryFilter === "string") {
				if (!feed.secondary_filters.includes(secondaryFilter)) throw new InnertubeError(`Secondary filter '${secondaryFilter}' not found`, { available_filters: feed.secondary_filters });
				secondaryFilterNode = feed.filter_nodes.secondary_filters?.find((chip) => chip.text?.toString() === secondaryFilter);
			} else if (secondaryFilter.is(ChipView)) secondaryFilterNode = secondaryFilter;
			else throw new InnertubeError("Invalid secondary filter type");
			if (secondaryFilterNode && !secondaryFilterNode.selected) {
				const secondaryFilterEndpoint = secondaryFilterNode?.tap_command || secondaryFilterNode?.endpoint;
				if (!secondaryFilterEndpoint) throw new InnertubeError("Could not find an endpoint for the specified secondary filter");
				response = await secondaryFilterEndpoint.call(this.actions, { parse: true });
			}
		}
		if (!response) throw new InnertubeError("Failed to fetch data for the specified filter");
		return new Feed(this.actions, response, true);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/mixins/MediaInfo.js
var MediaInfo = class {
	#page;
	#actions;
	#cpn;
	#playback_tracking;
	basic_info;
	annotations;
	storyboards;
	endscreen;
	captions;
	cards;
	streaming_data;
	playability_status;
	player_config;
	constructor(data, actions, cpn) {
		this.#actions = actions;
		const info = parseResponse(data[0].data.playerResponse ? data[0].data.playerResponse : data[0].data);
		const next = data[1]?.data ? parseResponse(data[1].data) : void 0;
		this.#page = [info, next];
		this.#cpn = cpn;
		if (info.playability_status?.status === "ERROR") throw new InnertubeError("This video is unavailable", info.playability_status);
		if (info.microformat && !info.microformat?.is(PlayerMicroformat, MicroformatData)) throw new InnertubeError("Unsupported microformat", info.microformat);
		this.basic_info = {
			...info.video_details,
			embed: info.microformat?.is(PlayerMicroformat) ? info.microformat?.embed : null,
			channel: info.microformat?.is(PlayerMicroformat) ? info.microformat?.channel : null,
			is_unlisted: info.microformat?.is_unlisted,
			is_family_safe: info.microformat?.is_family_safe,
			category: info.microformat?.is(PlayerMicroformat) ? info.microformat?.category : null,
			has_ypc_metadata: info.microformat?.is(PlayerMicroformat) ? info.microformat?.has_ypc_metadata : null,
			start_timestamp: info.microformat?.is(PlayerMicroformat) ? info.microformat.start_timestamp : null,
			end_timestamp: info.microformat?.is(PlayerMicroformat) ? info.microformat.end_timestamp : null,
			view_count: info.microformat?.is(PlayerMicroformat) && isNaN(info.video_details?.view_count) ? info.microformat.view_count : info.video_details?.view_count,
			url_canonical: info.microformat?.is(MicroformatData) ? info.microformat?.url_canonical : null,
			tags: info.microformat?.is(MicroformatData) ? info.microformat?.tags : null,
			like_count: void 0,
			is_liked: void 0,
			is_disliked: void 0
		};
		this.annotations = info.annotations;
		this.storyboards = info.storyboards;
		this.endscreen = info.endscreen;
		this.captions = info.captions;
		this.cards = info.cards;
		this.streaming_data = info.streaming_data;
		this.playability_status = info.playability_status;
		this.player_config = info.player_config;
		this.#playback_tracking = info.playback_tracking;
	}
	/**
	* Generates a DASH manifest from the streaming data.
	* @param options
	* @returns DASH manifest
	*/
	async toDash(options = {}) {
		const player_response = this.#page[0];
		const manifest_options = options.manifest_options || {};
		if (player_response.video_details && player_response.video_details.is_live) throw new InnertubeError("Generating DASH manifests for live videos is not supported. Please use the DASH and HLS manifests provided by YouTube in `streaming_data.dash_manifest_url` and `streaming_data.hls_manifest_url` instead.");
		let storyboards;
		let captions;
		if (manifest_options.include_thumbnails && player_response.storyboards) storyboards = player_response.storyboards;
		if (typeof manifest_options.captions_format === "string" && player_response.captions?.caption_tracks) captions = player_response.captions.caption_tracks;
		return toDash(this.streaming_data, this.page[0].video_details?.is_post_live_dvr, options.url_transformer, options.format_filter, this.#cpn, this.#actions.session.player, this.#actions, storyboards, captions, manifest_options);
	}
	/**
	* Get a cleaned up representation of the adaptive_formats
	*/
	getStreamingInfo(url_transformer, format_filter) {
		return getStreamingInfo(this.streaming_data, this.page[0].video_details?.is_post_live_dvr, url_transformer, format_filter, this.cpn, this.#actions.session.player, this.#actions, this.#page[0].storyboards ? this.#page[0].storyboards : void 0);
	}
	/**
	* Selects the format that best matches the given options.
	* @param options - Options
	*/
	chooseFormat(options) {
		return chooseFormat(options, this.streaming_data);
	}
	/**
	* Downloads the video.
	* @param options - Download options.
	*/
	async download(options = {}) {
		const player_response = this.#page[0];
		if (player_response.video_details && (player_response.video_details.is_live || player_response.video_details.is_post_live_dvr)) throw new InnertubeError("Downloading is not supported for live and Post-Live-DVR videos, as they are split up into 5 second segments that are individual files, which require using a tool such as ffmpeg to stitch them together, so they cannot be returned in a single stream.");
		return download(options, this.#actions, this.playability_status, this.streaming_data, this.#actions.session.player, this.cpn);
	}
	/**
	* Retrieves the video's transcript.
	*/
	async getTranscript() {
		const next_response = this.page[1];
		if (!next_response) throw new InnertubeError("Cannot get transcript from basic video info.");
		if (!next_response.engagement_panels) throw new InnertubeError("Engagement panels not found. Video likely has no transcript.");
		const transcript_panel = next_response.engagement_panels.find((panel) => {
			return panel.panel_identifier === "engagement-panel-searchable-transcript";
		});
		if (!transcript_panel) throw new InnertubeError("Transcript panel not found. Video likely has no transcript.");
		const transcript_continuation = transcript_panel.content?.as(ContinuationItem);
		if (!transcript_continuation) throw new InnertubeError("Transcript continuation not found.");
		const response = await transcript_continuation.endpoint.call(this.actions);
		return new TranscriptInfo(this.actions, response);
	}
	async addToWatchHistory(client_name, client_version, replacement = "https://www.") {
		if (!this.#playback_tracking) throw new InnertubeError("Playback tracking not available");
		const url_params = {
			cpn: this.#cpn,
			fmt: 251,
			rtn: 0,
			rt: 0
		};
		const url = this.#playback_tracking.videostats_playback_url.replace("https://s.", replacement);
		return await this.#actions.stats(url, {
			client_name: client_name || CLIENTS.WEB.NAME,
			client_version: client_version || CLIENTS.WEB.VERSION
		}, url_params);
	}
	async updateWatchTime(startTime, client_name = CLIENTS.WEB.NAME, client_version = CLIENTS.WEB.VERSION, replacement = "https://www.") {
		if (!this.#playback_tracking) throw new InnertubeError("Playback tracking not available");
		const url_params = {
			cpn: this.#cpn,
			st: startTime.toFixed(3),
			et: startTime.toFixed(3),
			cmt: startTime.toFixed(3),
			final: "1"
		};
		const url = this.#playback_tracking.videostats_watchtime_url.replace("https://s.", replacement);
		return await this.#actions.stats(url, {
			client_name,
			client_version
		}, url_params);
	}
	get actions() {
		return this.#actions;
	}
	/**
	* Content Playback Nonce.
	*/
	get cpn() {
		return this.#cpn;
	}
	/**
	* Parsed InnerTube response.
	*/
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/mixins/TabbedFeed.js
var TabbedFeed = class TabbedFeed extends Feed {
	#actions;
	#tabs;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		this.#actions = actions;
		this.#tabs = this.page.contents_memo?.getType(Tab);
	}
	get tabs() {
		return this.#tabs?.map((tab) => tab.title.toString()) ?? [];
	}
	async getTabByName(title) {
		const tab = this.#tabs?.find((tab) => tab.title.toLowerCase() === title.toLowerCase());
		if (!tab) throw new InnertubeError(`Tab "${title}" not found`);
		if (tab.selected) return this;
		const response = await tab.endpoint.call(this.#actions);
		return new TabbedFeed(this.#actions, response, false);
	}
	async getTabByURL(url) {
		const tab = this.#tabs?.find((tab) => tab.endpoint.metadata.url?.split("/").pop() === url);
		if (!tab) throw new InnertubeError(`Tab "${url}" not found`);
		if (tab.selected) return this;
		const response = await tab.endpoint.call(this.#actions);
		return new TabbedFeed(this.#actions, response, false);
	}
	hasTabWithURL(url) {
		return this.#tabs?.some((tab) => tab.endpoint.metadata.url?.split("/").pop() === url) ?? false;
	}
	get title() {
		return this.page.contents_memo?.getType(Tab)?.find((tab) => tab.selected)?.title.toString();
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/Channel.js
var Channel$1 = class Channel$1 extends TabbedFeed {
	header;
	metadata;
	subscribe_button;
	current_tab;
	#filter_nodes;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		this.header = this.page.header?.item()?.as(C4TabbedHeader, CarouselHeader, InteractiveTabbedHeader, PageHeader);
		const metadata = this.page.metadata?.item().as(ChannelMetadata);
		const microformat = this.page.microformat?.as(MicroformatData);
		if (this.page.alerts) {
			const alert = this.page.alerts[0];
			if (alert?.alert_type === "ERROR") throw new ChannelError(alert.text.toString());
		}
		if (!metadata && !this.page.contents) throw new InnertubeError("Invalid channel", this);
		this.metadata = {
			...metadata,
			...microformat || {}
		};
		this.subscribe_button = this.page.header_memo?.getType(SubscribeButton)[0];
		if (this.page.contents) this.current_tab = this.page.contents.item().as(TwoColumnBrowseResults).tabs.find((tab) => tab.selected);
	}
	/**
	* Applies a filter to the channel list. {@link filters}, {@link secondary_filters}, and {@link filter_nodes} can be used to get available filters.
	*
	* @param primaryFilter - The primary filter to apply. Can be a string representing the filter name,
	* a {@link ChipView} instance, or a {@link ListItemView} instance.
	* @param secondaryFilter - An optional secondary filter to apply after the primary filter.
	* Can be a string representing the filter name or a {@link ChipView} instance.
	*
	* @example
	* ```ts
	* // Apply a primary filter by name.
	* const filtered = await videos.applyFilter('Oldest');
	*
	* // Apply a primary and secondary filter by name.
	* const filtered = await videos.applyFilter('Oldest', 'Members only');
	*
	* // Since we're using `filtered`, the following will return the latest members-only videos,
	* // unless the secondary filter is explicitly changed.
	* const latestMembersOnly = await filtered.applyFilter('Latest');
	* ```
	*/
	async applyFilter(primaryFilter, secondaryFilter) {
		const chipBarView = this.memo.getType(ChipBarView)[0];
		if (!chipBarView) throw new InnertubeError("Filter chip bar not found");
		let endpoint;
		if (typeof primaryFilter === "string") {
			if (!this.filters.includes(primaryFilter)) throw new InnertubeError(`Filter '${primaryFilter}' not found`, { available_filters: this.filters });
			const dropdownMenu = chipBarView.chips.find((chip) => chip.display_type === "CHIP_VIEW_MODEL_DISPLAY_TYPE_DROP_DOWN");
			if (dropdownMenu) {
				const tapCommand = dropdownMenu.tap_command?.command;
				if (tapCommand?.is(ShowSheetCommand) && tapCommand.inline_content?.is(SheetView) && tapCommand.inline_content.content?.is(ListView)) endpoint = tapCommand.inline_content.content.items.as(ListItemView).find((item) => item.title?.toString() === primaryFilter)?.renderer_context?.command_context?.on_tap?.as(NavigationEndpoint);
			} else endpoint = chipBarView.chips.find((chip) => chip.text === primaryFilter)?.endpoint;
		} else if (primaryFilter.is(ChipView)) endpoint = primaryFilter.endpoint;
		else if (primaryFilter.is(ListItemView)) endpoint = primaryFilter.renderer_context?.command_context?.on_tap?.as(NavigationEndpoint);
		else throw new InnertubeError("Invalid primary filter type");
		if (!endpoint) throw new InnertubeError("Could not find endpoint for the specified filter");
		const page = await endpoint.call(this.actions, { parse: true });
		let filteredChannelList = new FilteredChannelList(this.actions, page, true);
		if (secondaryFilter) filteredChannelList = await filteredChannelList.applyFilter(primaryFilter, secondaryFilter);
		return filteredChannelList;
	}
	/**
	* Applies a sort filter to the list. Use {@link sort_filters} to get available filters.
	* @param sortFilter - The sort filter to apply
	*/
	async applySort(sortFilter) {
		const sort_filter_sub_menu = this.memo.getType(SortFilterSubMenu)[0];
		if (!sort_filter_sub_menu || !sort_filter_sub_menu.sub_menu_items) throw new InnertubeError("No sort filter sub menu found");
		const target_sort = sort_filter_sub_menu.sub_menu_items.find((item) => item.title === sortFilter);
		if (!target_sort) throw new InnertubeError(`Sort filter '${sortFilter}' not found`, { available_sort_filters: this.sort_filters });
		if (target_sort.selected) return this;
		const page = await target_sort.endpoint.call(this.actions, { parse: true });
		return new Channel$1(this.actions, page, true);
	}
	/**
	* Applies given content type filter to the list. Use {@link content_type_filters} to get available filters.
	* @param content_type_filter - The content type filter to apply
	*/
	async applyContentTypeFilter(content_type_filter) {
		const sub_menu = this.current_tab?.content?.as(SectionList).sub_menu?.as(ChannelSubMenu);
		if (!sub_menu) throw new InnertubeError("Sub menu not found");
		const item = sub_menu.content_type_sub_menu_items.find((item) => item.title === content_type_filter);
		if (!item) throw new InnertubeError(`Sub menu item '${content_type_filter}' not found`, { available_filters: this.content_type_filters });
		if (item.selected) return this;
		const page = await item.endpoint.call(this.actions, { parse: true });
		return new Channel$1(this.actions, page, true);
	}
	/**
	* Returns the InnerTube renderer nodes representing filters.
	*/
	get filter_nodes() {
		if (this.#filter_nodes) return this.#filter_nodes;
		let primary_filters;
		let secondary_filters;
		if (this.memo.getType(FeedFilterChipBar)?.length > 1) throw new InnertubeError("There are too many feed filter chipbars, you'll need to find the correct one yourself in this.page");
		if (this.memo.has("FeedFilterChipBar")) primary_filters = this.memo.getType(ChipCloudChip);
		else if (this.memo.has("ChipView")) {
			const chips = this.memo.getType(ChipView);
			const firstChip = chips[0];
			if (firstChip.is(ChipView)) {
				if (firstChip.display_type === "CHIP_VIEW_MODEL_DISPLAY_TYPE_DROP_DOWN" || firstChip.display_type === "CHIP_VIEW_MODEL_DISPLAY_TYPE_DROP_DOWN_WITH_CLEAR") {
					const tapCommand = firstChip.tap_command?.command;
					if (tapCommand?.is(ShowSheetCommand) && tapCommand.inline_content?.is(SheetView) && tapCommand.inline_content.content?.is(ListView)) primary_filters = tapCommand.inline_content.content.items.as(ListItemView);
					secondary_filters = observe(chips.slice(1));
				} else primary_filters = chips;
			}
		}
		this.#filter_nodes = {
			primary_filters,
			secondary_filters
		};
		return this.#filter_nodes;
	}
	/**
	* Returns the available primary filters as strings.
	*/
	get filters() {
		return this.filter_nodes?.primary_filters?.map((chip) => {
			if (chip.is(ChipView) || chip.is(ChipCloudChip)) return chip.text?.toString() || "";
			else if (chip.is(ListItemView)) return chip.title?.toString() || "";
			return "";
		}) || [];
	}
	/**
	* Returns the available secondary filters as strings.
	*
	* ---
	*
	* NOTE:
	* Not all channels have secondary filters!
	*/
	get secondary_filters() {
		return this.filter_nodes?.secondary_filters?.map((chip) => chip.text?.toString() || "") || [];
	}
	get sort_filters() {
		return this.memo.getType(SortFilterSubMenu)[0]?.sub_menu_items?.map((item) => item.title) || [];
	}
	get content_type_filters() {
		return (this.current_tab?.content?.as(SectionList).sub_menu?.as(ChannelSubMenu))?.content_type_sub_menu_items.map((item) => item.title) || [];
	}
	async getHome() {
		const tab = await this.getTabByURL("featured");
		return new Channel$1(this.actions, tab.page, true);
	}
	async getVideos() {
		const tab = await this.getTabByURL("videos");
		return new Channel$1(this.actions, tab.page, true);
	}
	async getShorts() {
		const tab = await this.getTabByURL("shorts");
		return new Channel$1(this.actions, tab.page, true);
	}
	async getLiveStreams() {
		const tab = await this.getTabByURL("streams");
		return new Channel$1(this.actions, tab.page, true);
	}
	async getReleases() {
		const tab = await this.getTabByURL("releases");
		return new Channel$1(this.actions, tab.page, true);
	}
	async getPodcasts() {
		const tab = await this.getTabByURL("podcasts");
		return new Channel$1(this.actions, tab.page, true);
	}
	async getCourses() {
		const tab = await this.getTabByURL("courses");
		return new Channel$1(this.actions, tab.page, true);
	}
	async getPlaylists() {
		const tab = await this.getTabByURL("playlists");
		return new Channel$1(this.actions, tab.page, true);
	}
	async getCommunity() {
		const tab = await this.getTabByURL("posts");
		return new Channel$1(this.actions, tab.page, true);
	}
	/**
	* Retrieves the about page.
	* Note that this does not return a new {@link Channel} object.
	*/
	async getAbout() {
		if (this.hasTabWithURL("about")) return (await this.getTabByURL("about")).memo.getType(ChannelAboutFullMetadata)[0];
		const tagline = this.header?.is(C4TabbedHeader) && this.header.tagline;
		if (tagline || this.header?.is(PageHeader) && this.header.content?.description) {
			if (tagline && tagline.more_endpoint instanceof NavigationEndpoint) {
				const response = await tagline.more_endpoint.call(this.actions);
				return new TabbedFeed(this.actions, response, false).memo.getType(ChannelAboutFullMetadata)[0];
			}
			const endpoint = this.page.header_memo?.getType(ContinuationItem)[0]?.endpoint;
			if (!endpoint) throw new InnertubeError("Failed to extract continuation to get channel about");
			const response = await endpoint.call(this.actions, { parse: true });
			if (!response.on_response_received_endpoints_memo) throw new InnertubeError("Unexpected response while fetching channel about", { response });
			return response.on_response_received_endpoints_memo.getType(AboutChannel)[0];
		}
		throw new InnertubeError("About not found");
	}
	/**
	* Searches within the channel.
	*/
	async search(query) {
		const tab = this.memo.getType(ExpandableTab)?.[0];
		if (!tab) throw new InnertubeError("Search tab not found", this);
		const page = await tab.endpoint.call(this.actions, {
			query,
			parse: true
		});
		return new Channel$1(this.actions, page, true);
	}
	get has_home() {
		return this.hasTabWithURL("featured");
	}
	get has_videos() {
		return this.hasTabWithURL("videos");
	}
	get has_shorts() {
		return this.hasTabWithURL("shorts");
	}
	get has_live_streams() {
		return this.hasTabWithURL("streams");
	}
	get has_releases() {
		return this.hasTabWithURL("releases");
	}
	get has_podcasts() {
		return this.hasTabWithURL("podcasts");
	}
	get has_courses() {
		return this.hasTabWithURL("courses");
	}
	get has_playlists() {
		return this.hasTabWithURL("playlists");
	}
	get has_community() {
		return this.hasTabWithURL("posts");
	}
	get has_about() {
		return this.hasTabWithURL("about") || !!(this.header?.is(C4TabbedHeader) && this.header.tagline?.more_endpoint) || !!(this.header?.is(PageHeader) && this.header.content?.description?.more_endpoint);
	}
	get has_search() {
		return this.memo.getType(ExpandableTab)?.length > 0;
	}
	async getContinuation() {
		const page = await super.getContinuationData();
		if (!page) throw new InnertubeError("Could not get continuation data");
		return new ChannelListContinuation(this.actions, page, true);
	}
};
var ChannelListContinuation = class ChannelListContinuation extends Feed {
	contents;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		this.contents = this.page.on_response_received_actions?.[0] || this.page.on_response_received_endpoints?.[0];
	}
	async getContinuation() {
		const page = await super.getContinuationData();
		if (!page) throw new InnertubeError("Could not get continuation data");
		return new ChannelListContinuation(this.actions, page, true);
	}
};
var FilteredChannelList = class FilteredChannelList extends FilterableFeed {
	filter;
	secondary_filter;
	contents;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		const chipBarView = this.memo.getType(ChipBarView)[0];
		if (chipBarView) {
			const firstChip = chipBarView.chips[0];
			if (firstChip.display_type === "CHIP_VIEW_MODEL_DISPLAY_TYPE_DROP_DOWN" || firstChip.display_type === "CHIP_VIEW_MODEL_DISPLAY_TYPE_DROP_DOWN_WITH_CLEAR") {
				this.secondary_filter = chipBarView.chips.slice(1).find((chip) => chip.selected);
				const tapCommand = firstChip.tap_command?.command;
				if (tapCommand?.is(ShowSheetCommand) && tapCommand.inline_content?.is(SheetView) && tapCommand.inline_content.content?.is(ListView)) this.filter = tapCommand.inline_content.content.items.as(ListItemView).find((item) => item.is_selected);
			} else this.filter = chipBarView.chips.find((chip) => chip.selected);
		}
		if (this.page.on_response_received_actions && this.page.on_response_received_actions.length > 1) this.page.on_response_received_actions.shift();
		this.contents = this.page.on_response_received_actions?.[0];
	}
	/**
	* Applies given filter to the list.
	* @param filter - The filter to apply
	*/
	async applyFilter(filter, secondaryFilter) {
		const feed = await super.getFilteredFeed(filter, secondaryFilter);
		return new FilteredChannelList(this.actions, feed.page, true);
	}
	async getContinuation() {
		const page = await super.getContinuationData();
		if (!page?.on_response_received_actions_memo) throw new InnertubeError("Unexpected continuation data", page);
		if (this.memo.has("FeedFilterChipBar")) page.on_response_received_actions_memo.set("FeedFilterChipBar", this.memo.getType(FeedFilterChipBar));
		if (this.memo.has("ChipCloudChip")) page.on_response_received_actions_memo.set("ChipCloudChip", this.memo.getType(ChipCloudChip));
		if (this.memo.has("ChipBarView")) page.on_response_received_actions_memo.set("ChipBarView", this.memo.getType(ChipBarView));
		if (this.memo.has("ChipView")) page.on_response_received_actions_memo.set("ChipView", this.memo.getType(ChipView));
		return new FilteredChannelList(this.actions, page, true);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/Comments.js
var Comments = class Comments {
	#page;
	#actions;
	#continuation;
	header;
	contents;
	constructor(actions, data, already_parsed = false) {
		this.#page = already_parsed ? data : parseResponse(data);
		this.#actions = actions;
		const contents = this.#page.on_response_received_endpoints;
		if (!contents) throw new InnertubeError("The comments page did not have any content");
		const header_node = contents.at(0)?.as(AppendContinuationItemsAction, ReloadContinuationItemsCommand);
		const body_node = contents.at(1)?.as(AppendContinuationItemsAction, ReloadContinuationItemsCommand);
		this.header = header_node?.contents?.firstOfType(CommentsHeader);
		const threads = body_node?.contents?.filterType(CommentThread) || [];
		this.contents = observe(threads.map((thread) => {
			if (thread.comment) thread.comment.setActions(this.#actions);
			thread.setActions(this.#actions);
			thread.processRepliesData();
			return thread;
		}));
		this.#continuation = body_node?.contents?.firstOfType(ContinuationItem);
	}
	/**
	* Applies given sort option to the comments.
	* @param sort - Sort type.
	*/
	async applySort(sort) {
		if (!this.header) throw new InnertubeError("Could not apply sort because the comments header is missing");
		let button;
		if (sort === "TOP_COMMENTS") button = this.header.sort_menu?.sub_menu_items?.at(0);
		else if (sort === "NEWEST_FIRST") button = this.header.sort_menu?.sub_menu_items?.at(1);
		if (!button) throw new InnertubeError("Could not apply sort because the sort button is missing");
		if (button.selected) return this;
		const response = await button.endpoint.call(this.#actions, { parse: true });
		return new Comments(this.#actions, response, true);
	}
	/**
	* Creates a top-level comment.
	* @param text - Comment text.
	*/
	async createComment(text) {
		if (!this.header) throw new InnertubeError("Comment could not be created because the page header is missing");
		const button = this.header.create_renderer?.as(CommentSimplebox).submit_button;
		if (!button) throw new InnertubeError("Comment could not be created because the comment button is missing");
		if (!button.endpoint) throw new InnertubeError("Comment could not be created because the comment button does not have an endpoint");
		return await button.endpoint.call(this.#actions, { commentText: text });
	}
	/**
	* Retrieves next batch of comments.
	*/
	async getContinuation() {
		if (!this.#continuation) throw new InnertubeError("No continuation item found");
		const data = await this.#continuation.endpoint.call(this.#actions, { parse: true });
		const page = Object.assign({}, this.#page);
		if (!page.on_response_received_endpoints || !data.on_response_received_endpoints) throw new InnertubeError("Invalid reponse format, missing on_response_received_endpoints");
		page.on_response_received_endpoints.pop();
		page.on_response_received_endpoints.push(data.on_response_received_endpoints[0]);
		return new Comments(this.#actions, page, true);
	}
	get has_continuation() {
		return !!this.#continuation;
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/Guide.js
var Guide = class {
	#page;
	contents;
	constructor(data) {
		this.#page = parseResponse(data);
		if (this.#page.items) this.contents = this.#page.items.array().as(GuideSection, GuideSubscriptionsSection);
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/History.js
var History = class History extends Feed {
	sections;
	feed_actions;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		this.sections = this.memo.getType(ItemSection);
		this.feed_actions = this.memo.getType(BrowseFeedActions)[0];
	}
	/**
	* Retrieves next batch of contents.
	*/
	async getContinuation() {
		const response = await this.getContinuationData();
		if (!response) throw new Error("No continuation data found");
		return new History(this.actions, response, true);
	}
	/**
	* Removes a video from watch history.
	*/
	async removeVideo(video_id, pages_to_load = 1) {
		let pagesToLoad = pages_to_load;
		while (pagesToLoad > 0) {
			let feedbackToken;
			for (const section of this.sections) {
				for (const content of section.contents) if (content.is(Video)) {
					if (content.video_id === video_id && content.menu) {
						feedbackToken = content.menu.top_level_buttons[0].as(Button).endpoint.payload.feedbackToken;
						break;
					}
				} else if (content.is(LockupView)) {
					if (content.content_id === video_id) {
						feedbackToken = (content.metadata?.menu_button?.on_tap?.payload.panelLoadingStrategy.inlineContent.sheetViewModel.content.listViewModel.listItems).find((video) => video.listItemViewModel?.title.content === "Remove from watch history").listItemViewModel.rendererContext.commandContext.onTap.innertubeCommand.feedbackEndpoint.feedbackToken;
						break;
					}
				}
				if (feedbackToken) break;
			}
			if (feedbackToken) {
				const body = { feedbackTokens: [feedbackToken] };
				if (!(await this.actions.execute("/feedback", body)).data.feedbackResponses[0].isProcessed) throw new Error("Failed to remove video from watch history");
				return true;
			}
			if (--pagesToLoad > 0) try {
				Object.assign(this, await this.getContinuation());
			} catch {
				throw new Error("Unable to find video in watch history");
			}
			else throw new Error("Unable to find video in watch history");
		}
		return false;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/HomeFeed.js
var HomeFeed$2 = class HomeFeed$2 extends FilterableFeed {
	contents;
	header;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		this.header = this.memo.getType(FeedTabbedHeader)[0];
		this.contents = this.memo.getType(RichGrid)[0] || this.page.on_response_received_actions?.[0];
	}
	/**
	* Applies given filter to the feed. Use {@link filters} to get available filters.
	* @param filter - Filter to apply.
	*/
	async applyFilter(filter) {
		const feed = await super.getFilteredFeed(filter);
		return new HomeFeed$2(this.actions, feed.page, true);
	}
	/**
	* Retrieves next batch of contents.
	*/
	async getContinuation() {
		const feed = await super.getContinuation();
		feed.page.header = this.page.header;
		if (this.header) feed.page.header_memo?.set(this.header.type, [this.header]);
		return new HomeFeed$2(this.actions, feed.page, true);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/HashtagFeed.js
var HashtagFeed = class HashtagFeed extends FilterableFeed {
	header;
	contents;
	constructor(actions, response) {
		super(actions, response);
		if (!this.page.contents_memo) throw new InnertubeError("Unexpected response", this.page);
		const tab = this.page.contents_memo.getType(Tab)[0];
		if (!tab.content) throw new InnertubeError("Content tab has no content", tab);
		if (this.page.header) this.header = this.page.header.item().as(HashtagHeader, PageHeader);
		this.contents = tab.content.as(RichGrid);
	}
	/**
	* Applies given filter and returns a new {@link HashtagFeed} object. Use {@link HashtagFeed.filters} to get available filters.
	* @param filter - Filter to apply.
	*/
	async applyFilter(filter) {
		const response = await super.getFilteredFeed(filter);
		return new HashtagFeed(this.actions, response.page);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/ItemMenu.js
var ItemMenu = class {
	#page;
	#actions;
	#items;
	constructor(data, actions) {
		this.#page = data;
		this.#actions = actions;
		const menu = data?.live_chat_item_context_menu_supported_renderers;
		if (!menu || !menu.is(Menu)) throw new InnertubeError("Response did not have a \"live_chat_item_context_menu_supported_renderers\" property. The call may have failed.");
		this.#items = menu.as(Menu).items;
	}
	async selectItem(item) {
		let endpoint;
		if (item instanceof Button) {
			if (!item.endpoint) throw new InnertubeError("Item does not have an endpoint.");
			endpoint = item.endpoint;
		} else {
			const button = this.#items.find((button) => {
				if (!button.is(MenuServiceItem)) return false;
				return button.as(MenuServiceItem).icon_type === item;
			});
			if (!button || !button.is(MenuServiceItem)) throw new InnertubeError(`Button "${item}" not found.`);
			endpoint = button.endpoint;
		}
		if (!endpoint) throw new InnertubeError("Target button does not have an endpoint.");
		return await endpoint.call(this.#actions, { parse: true });
	}
	items() {
		return this.#items;
	}
	page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/Playlist.js
var Playlist$1 = class Playlist$1 extends Feed {
	info;
	menu;
	endpoint;
	messages;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		const header = this.memo.getType(PlaylistHeader)[0];
		const primary_info = this.memo.getType(PlaylistSidebarPrimaryInfo)[0];
		const secondary_info = this.memo.getType(PlaylistSidebarSecondaryInfo)[0];
		const video_list = this.memo.getType(PlaylistVideoList)[0];
		const alert = this.page.alerts?.firstOfType(Alert);
		if (alert && alert.alert_type === "ERROR") throw new InnertubeError(alert.text.toString(), alert);
		if (!primary_info && !secondary_info && Object.keys(this.page).length === 0) throw new InnertubeError("Got empty continuation response. This is likely the end of the playlist.");
		this.info = {
			...this.page.metadata?.item().as(PlaylistMetadata),
			subtitle: header ? header.subtitle : null,
			author: secondary_info?.owner?.as(VideoOwner).author ?? header?.author,
			thumbnails: primary_info?.thumbnail_renderer?.as(PlaylistVideoThumbnail, PlaylistCustomThumbnail).thumbnail,
			total_items: this.#getStat(0, primary_info),
			views: this.#getStat(1, primary_info),
			last_updated: this.#getStat(2, primary_info),
			can_share: header?.can_share,
			can_delete: header?.can_delete,
			can_reorder: video_list?.can_reorder,
			is_editable: video_list?.is_editable,
			privacy: header?.privacy
		};
		this.menu = primary_info?.menu;
		this.endpoint = primary_info?.endpoint;
		this.messages = this.memo.getType(Message);
	}
	async getCollaborators() {
		if (!this.actions.session.logged_in) throw new Error("You must be signed in to perform this operation.");
		const endpoint = (this.memo.getType(AvatarStackView)?.find((item) => item.renderer_context.command_context))?.renderer_context.command_context?.on_tap;
		if (!endpoint) throw new InnertubeError("AvatarStackView on_tap endpoint not found");
		if (endpoint.command?.is(ShowEngagementPanelEndpoint)) return await endpoint.call(this.actions, { parse: true });
		throw new InnertubeError(`Unexpected endpoint type. Expected ShowEngagementPanelEndpoint, got ${endpoint.command?.type}`);
	}
	get items() {
		return observe(this.videos.as(LockupView, PlaylistVideo, ReelItem, ShortsLockupView).filter((video) => video.style !== "PLAYLIST_VIDEO_RENDERER_STYLE_RECOMMENDED_VIDEO"));
	}
	get has_continuation() {
		const section_list = this.memo.getType(SectionList)[0];
		if (!section_list) return super.has_continuation;
		return !!this.memo.getType(ContinuationItem, ContinuationItemView).find((node) => !section_list.contents.includes(node));
	}
	async getContinuationData() {
		const section_list = this.memo.getType(SectionList)[0];
		/**
		* No section list means there can't be additional continuation nodes here,
		* so no need to check.
		*/
		if (!section_list) return await super.getContinuationData();
		const playlist_contents_continuation = this.memo.getType(ContinuationItem, ContinuationItemView).find((node) => !section_list.contents.includes(node));
		if (!playlist_contents_continuation) throw new InnertubeError("There are no continuations.");
		return await playlist_contents_continuation.endpoint.call(this.actions, { parse: true });
	}
	async getContinuation() {
		const page = await this.getContinuationData();
		if (!page) throw new InnertubeError("Could not get continuation data");
		return new Playlist$1(this.actions, page, true);
	}
	#getStat(index, primary_info) {
		if (!primary_info || !primary_info.stats) return "N/A";
		return primary_info.stats[index]?.toString() || "N/A";
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/Library.js
var Library$1 = class extends Feed {
	header;
	sections;
	constructor(actions, data) {
		super(actions, data);
		if (!this.page.contents_memo) throw new InnertubeError("Page contents not found");
		this.header = this.memo.getType(PageHeader)[0];
		const shelves = this.page.contents_memo.getType(Shelf);
		this.sections = shelves.map((shelf) => ({
			type: shelf.icon_type,
			title: shelf.title,
			contents: shelf.content?.key("items").array() || [],
			getAll: () => this.#getAll(shelf)
		}));
	}
	async #getAll(shelf) {
		if (!shelf.menu?.as(Menu).top_level_buttons) throw new InnertubeError(`The ${shelf.title.text} shelf doesn't have more items`);
		const button = shelf.menu.as(Menu).top_level_buttons.firstOfType(Button);
		if (!button) throw new InnertubeError("Did not find target button.");
		const page = await button.as(Button).endpoint.call(this.actions, { parse: true });
		switch (shelf.icon_type) {
			case "LIKE":
			case "WATCH_LATER": return new Playlist$1(this.actions, page, true);
			case "WATCH_HISTORY": return new History(this.actions, page, true);
			case "CONTENT_CUT": return new Feed(this.actions, page, true);
			default: throw new InnertubeError("Target shelf not implemented.");
		}
	}
	get history() {
		return this.sections.find((section) => section.type === "WATCH_HISTORY");
	}
	get watch_later() {
		return this.sections.find((section) => section.type === "WATCH_LATER");
	}
	get liked_videos() {
		return this.sections.find((section) => section.type === "LIKE");
	}
	get playlists_section() {
		return this.sections.find((section) => section.type === "PLAYLISTS");
	}
	get clips() {
		return this.sections.find((section) => section.type === "CONTENT_CUT");
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/SmoothedQueue.js
/**
* Flattens the given queue.
* @param queue - The queue to flatten.
*/
function flattenQueue(queue) {
	const nodes = [];
	for (const group of queue) if (Array.isArray(group)) for (const node of group) nodes.push(node);
	else nodes.push(group);
	return nodes;
}
var DelayQueue = class {
	front;
	back;
	constructor() {
		this.front = [];
		this.back = [];
	}
	isEmpty() {
		return !this.front.length && !this.back.length;
	}
	clear() {
		this.front = [];
		this.back = [];
	}
	getValues() {
		return this.front.concat(this.back.reverse());
	}
};
var SmoothedQueue = class {
	#last_update_time;
	#estimated_update_interval;
	#callback;
	#action_queue;
	#next_update_id;
	#poll_response_delay_queue;
	constructor() {
		this.#last_update_time = null;
		this.#estimated_update_interval = null;
		this.#callback = null;
		this.#action_queue = [];
		this.#next_update_id = null;
		this.#poll_response_delay_queue = new DelayQueue();
	}
	enqueueActionGroup(group) {
		if (this.#last_update_time !== null) {
			const delay = Date.now() - this.#last_update_time;
			this.#poll_response_delay_queue.back.push(delay);
			if (5 < this.#poll_response_delay_queue.front.length + this.#poll_response_delay_queue.back.length) {
				if (!this.#poll_response_delay_queue.front.length) {
					this.#poll_response_delay_queue.front = this.#poll_response_delay_queue.back;
					this.#poll_response_delay_queue.front.reverse();
					this.#poll_response_delay_queue.back = [];
				}
				this.#poll_response_delay_queue.front.pop();
			}
			this.#estimated_update_interval = Math.max(...this.#poll_response_delay_queue.getValues());
		}
		this.#last_update_time = Date.now();
		this.#action_queue.push(group);
		if (this.#next_update_id === null) this.#next_update_id = setTimeout(this.emitSmoothedActions.bind(this));
	}
	emitSmoothedActions() {
		this.#next_update_id = null;
		if (this.#action_queue.length) {
			let delay = 1e4;
			if (this.#estimated_update_interval !== null && this.#last_update_time !== null) delay = this.#estimated_update_interval - Date.now() + this.#last_update_time;
			delay = this.#action_queue.length < delay / 80 ? 1 : Math.ceil(this.#action_queue.length / (delay / 80));
			const actions = flattenQueue(this.#action_queue.splice(0, delay));
			if (this.#callback) this.#callback(actions);
			if (this.#action_queue !== null) {
				if (delay == 1) {
					delay = this.#estimated_update_interval / this.#action_queue.length;
					delay *= Math.random() + .5;
					delay = Math.min(1e3, delay);
					delay = Math.max(80, delay);
				} else delay = 80;
				this.#next_update_id = setTimeout(this.emitSmoothedActions.bind(this), delay);
			}
		}
	}
	clear() {
		if (this.#next_update_id !== null) {
			clearTimeout(this.#next_update_id);
			this.#next_update_id = null;
		}
		this.#action_queue = [];
	}
	set callback(cb) {
		this.#callback = cb;
	}
	get callback() {
		return this.#callback;
	}
	get action_queue() {
		return this.#action_queue;
	}
	get estimated_update_interval() {
		return this.#estimated_update_interval;
	}
	get last_update_time() {
		return this.#last_update_time;
	}
	get next_update_id() {
		return this.#next_update_id;
	}
	get poll_response_delay_queue() {
		return this.#poll_response_delay_queue;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/LiveChat.js
var LiveChat = class extends EventEmitterLike {
	#actions;
	#video_id;
	#channel_id;
	#continuation;
	#mcontinuation;
	#retry_count = 0;
	smoothed_queue;
	initial_info;
	metadata;
	running = false;
	is_replay = false;
	constructor(video_info) {
		super();
		this.#video_id = video_info.basic_info.id;
		this.#channel_id = video_info.basic_info.channel_id;
		this.#actions = video_info.actions;
		this.#continuation = video_info.livechat?.continuation;
		this.is_replay = video_info.livechat?.is_replay || false;
		this.smoothed_queue = new SmoothedQueue();
		this.smoothed_queue.callback = async (actions) => {
			if (!actions.length) await this.#wait(2e3);
			else if (actions.length < 10) await this.#emitSmoothedActions(actions);
			else if (this.is_replay) {
				/**
				* NOTE: Live chat replays require data from the video player for actions to be emitted timely
				* and as we don't have that, this ends up being quite innacurate.
				*/
				this.#emitSmoothedActions(actions);
				await this.#wait(2e3);
			} else this.#emitSmoothedActions(actions);
			if (this.running) this.#pollLivechat();
		};
	}
	on(type, listener) {
		super.on(type, listener);
	}
	once(type, listener) {
		super.once(type, listener);
	}
	start() {
		if (!this.running) {
			this.running = true;
			this.#pollLivechat();
			this.#pollMetadata();
		}
	}
	stop() {
		this.smoothed_queue.clear();
		this.running = false;
	}
	#pollLivechat() {
		(async () => {
			try {
				const response = await this.#actions.execute(this.is_replay ? "live_chat/get_live_chat_replay" : "live_chat/get_live_chat", {
					continuation: this.#continuation,
					parse: true
				});
				const contents = response.continuation_contents;
				if (!contents) {
					this.emit("error", new InnertubeError("Unexpected live chat incremental continuation response", response));
					this.emit("end");
					this.stop();
				}
				if (!(contents instanceof LiveChatContinuation)) {
					this.stop();
					this.emit("end");
					return;
				}
				this.#continuation = contents.continuation.token;
				if (contents.header) {
					this.initial_info = contents;
					this.emit("start", contents);
					if (this.running) this.#pollLivechat();
				} else this.smoothed_queue.enqueueActionGroup(contents.actions);
				this.#retry_count = 0;
			} catch (err) {
				this.emit("error", err);
				if (this.#retry_count++ < 10) {
					await this.#wait(2e3);
					this.#pollLivechat();
				} else {
					this.emit("error", new InnertubeError("Reached retry limit for incremental continuation requests", err));
					this.emit("end");
					this.stop();
				}
			}
		})();
	}
	/**
	* Ensures actions are emitted at the right speed.
	* This and {@link SmoothedQueue} were based off of YouTube's own implementation.
	*/
	async #emitSmoothedActions(action_queue) {
		const base = 1e4;
		let delay = action_queue.length < base / 80 ? 1 : Math.ceil(action_queue.length / (base / 80));
		const emit_delay_ms = delay == 1 ? (delay = base / action_queue.length, delay *= Math.random() + .5, delay = Math.min(1e3, delay), delay = Math.max(80, delay)) : delay = 80;
		for (const action of action_queue) {
			await this.#wait(emit_delay_ms);
			this.emit("chat-update", action);
		}
	}
	#pollMetadata() {
		(async () => {
			try {
				const payload = { videoId: this.#video_id };
				if (this.#mcontinuation) payload.continuation = this.#mcontinuation;
				const data = parseResponse((await this.#actions.execute("/updated_metadata", payload)).data);
				this.#mcontinuation = data.continuation?.token;
				this.metadata = {
					title: data.actions?.array().firstOfType(UpdateTitleAction) || this.metadata?.title,
					description: data.actions?.array().firstOfType(UpdateDescriptionAction) || this.metadata?.description,
					views: data.actions?.array().firstOfType(UpdateViewershipAction) || this.metadata?.views,
					likes: data.actions?.array().firstOfType(UpdateToggleButtonTextAction) || this.metadata?.likes,
					date: data.actions?.array().firstOfType(UpdateDateTextAction) || this.metadata?.date
				};
				this.emit("metadata-update", this.metadata);
				await this.#wait(5e3);
				if (this.running) this.#pollMetadata();
			} catch {
				await this.#wait(2e3);
				if (this.running) this.#pollMetadata();
			}
		})();
	}
	/**
	* Sends a message.
	* @param text - Text to send.
	*/
	async sendMessage(text) {
		const writer = LiveMessageParams.encode({
			params: { ids: {
				videoId: this.#video_id,
				channelId: this.#channel_id
			} },
			number0: 1,
			number1: 4
		});
		const params = btoa(encodeURIComponent(u8ToBase64(writer.finish())));
		const response = await this.#actions.execute("/live_chat/send_message", {
			richMessage: { textSegments: [{ text }] },
			clientMessageId: Platform.shim.uuidv4(),
			client: "WEB",
			parse: true,
			params
		});
		if (!response.actions) throw new InnertubeError("Unexpected response from send_message", response);
		return response.actions.array().as(AddChatItemAction, RunAttestationCommand);
	}
	/**
	* Applies given filter to the live chat.
	* @param filter - Filter to apply.
	*/
	applyFilter(filter) {
		if (!this.initial_info) throw new InnertubeError("Cannot apply filter before initial info is retrieved.");
		const menu_items = this.initial_info?.header?.view_selector?.sub_menu_items;
		if (filter === "TOP_CHAT") {
			if (menu_items?.at(0)?.selected) return;
			this.#continuation = menu_items?.at(0)?.continuation;
		} else {
			if (menu_items?.at(1)?.selected) return;
			this.#continuation = menu_items?.at(1)?.continuation;
		}
	}
	/**
	* Retrieves given chat item's menu.
	*/
	async getItemMenu(item) {
		if (!item.hasKey("menu_endpoint") || !item.key("menu_endpoint").isInstanceof(NavigationEndpoint)) throw new InnertubeError("This item does not have a menu.", item);
		const response = await item.key("menu_endpoint").instanceof(NavigationEndpoint).call(this.#actions, { parse: true });
		if (!response) throw new InnertubeError("Could not retrieve item menu.", item);
		return new ItemMenu(response, this.#actions);
	}
	/**
	* Equivalent to "clicking" a button.
	*/
	async selectButton(button) {
		return await button.endpoint.call(this.#actions, { parse: true });
	}
	async #wait(ms) {
		return new Promise((resolve) => setTimeout(() => resolve(), ms));
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/NotificationsMenu.js
var NotificationsMenu = class NotificationsMenu {
	#page;
	#actions;
	header;
	contents;
	constructor(actions, response) {
		this.#actions = actions;
		this.#page = parseResponse(response.data);
		if (!this.#page.actions_memo) throw new InnertubeError("Page actions not found");
		this.header = this.#page.actions_memo.getType(SimpleMenuHeader)[0];
		this.contents = this.#page.actions_memo.getType(Notification);
	}
	async getContinuation() {
		const continuation = this.#page.actions_memo?.getType(ContinuationItem)[0];
		if (!continuation) throw new InnertubeError("Continuation not found");
		const response = await continuation.endpoint.call(this.#actions, { parse: false });
		return new NotificationsMenu(this.#actions, response);
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/Search.js
var Search$2 = class Search$2 extends Feed {
	header;
	results;
	refinements;
	estimated_results;
	sub_menu;
	watch_card;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		const contents = this.page.contents_memo?.getType(SectionList)[0].contents || this.page.on_response_received_commands_memo?.getType(SectionList)[0]?.contents || this.page.on_response_received_commands?.[0].as(AppendContinuationItemsAction, ReloadContinuationItemsCommand).contents;
		if (!contents) throw new InnertubeError("No contents found in search response");
		if (this.page.on_response_received_commands && !this.page.header) {
			const headerSlot = this.page.on_response_received_commands.as(ReloadContinuationItemsCommand).find((command) => command.is(ReloadContinuationItemsCommand) && command.slot === "RELOAD_CONTINUATION_SLOT_HEADER");
			this.header = headerSlot?.contents?.firstOfType(SearchHeader);
		} else this.header = this.page.header?.item().as(SearchHeader);
		this.results = observe(contents.filterType(ItemSection).flatMap((section) => section.contents));
		this.refinements = this.page.refinements || [];
		this.estimated_results = this.page.estimated_results || 0;
		if (this.page.contents_memo) {
			this.sub_menu = this.page.contents_memo.getType(SearchSubMenu)[0];
			this.watch_card = this.page.contents_memo.getType(UniversalWatchCard)[0];
		}
	}
	/**
	* Applies a refinement filter to the search results.
	*
	* Use {@link Search.refinement_filters} to get a list of available refinements.
	*
	* @example
	* ```ts
	* const results = await yt.search('PilotRedSun');
	* // Narrow down to only YouTube Shorts
	* const shortsOnly = await results.applyRefinement('Shorts');
	* ```
	* @param refinementFilter - The text label of the chip or the {@link ChipCloudChip} node itself.
	*/
	async applyRefinement(refinementFilter) {
		let endpoint;
		if (typeof refinementFilter === "string") {
			const chipBar = this.header?.chip_bar;
			if (!chipBar) throw new InnertubeError("No chip bar found in search header");
			const targetChip = chipBar.chips.find((chip) => chip.text === refinementFilter);
			if (!targetChip) throw new InnertubeError(`Refinement filter "${refinementFilter}" not found`, { available_filters: this.refinement_filters });
			endpoint = targetChip.endpoint;
			if (!endpoint && targetChip.is_selected) return this;
		} else if (refinementFilter.is(ChipCloudChip)) {
			if (!refinementFilter.endpoint && refinementFilter.is_selected) return this;
			endpoint = refinementFilter.endpoint;
		} else throw new InnertubeError("Invalid filter type");
		if (!endpoint) throw new InnertubeError("Could not find endpoint for the specified filter");
		const page = await endpoint.call(this.actions, { parse: true });
		return new Search$2(this.actions, page, true);
	}
	/**
	* Returns a list of available refinement filters. Use {@link Search.applyRefinement} to apply a filter.
	*/
	get refinement_filters() {
		return this.header?.chip_bar?.chips.map((chip) => chip.text) || [];
	}
	/**
	* Retrieves next batch of search results.
	*/
	async getContinuation() {
		const response = await this.getContinuationData();
		if (!response) throw new InnertubeError("Could not get continuation data");
		return new Search$2(this.actions, response, true);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/Settings.js
var Settings = class Settings {
	#page;
	#actions;
	sidebar;
	introduction;
	sections;
	constructor(actions, response) {
		this.#actions = actions;
		this.#page = parseResponse(response.data);
		this.sidebar = this.#page.sidebar?.as(SettingsSidebar);
		if (!this.#page.contents) throw new InnertubeError("Page contents not found");
		const tab = this.#page.contents.item().as(TwoColumnBrowseResults).tabs.find((tab) => tab.selected);
		if (!tab) throw new InnertubeError("Target tab not found");
		const contents = tab.content?.as(SectionList).contents.as(ItemSection);
		this.introduction = contents?.shift()?.contents?.firstOfType(PageIntroduction);
		this.sections = contents?.map((el) => ({
			title: el.header?.is(CommentsHeader, ItemSectionHeader, ItemSectionTabbedHeader) ? el.header.title.toString() : null,
			contents: el.contents
		}));
	}
	/**
	* Selects an item from the sidebar menu. Use {@link sidebar_items} to see available items.
	*/
	async selectSidebarItem(target_item) {
		if (!this.sidebar) throw new InnertubeError("Sidebar not available");
		let item;
		if (typeof target_item === "string") {
			item = this.sidebar.items.find((link) => link.title === target_item);
			if (!item) throw new InnertubeError(`Item "${target_item}" not found`, { available_items: this.sidebar_items });
		} else if (target_item?.is(CompactLink)) item = target_item;
		else throw new InnertubeError("Invalid item", { target_item });
		const response = await item.endpoint.call(this.#actions, { parse: false });
		return new Settings(this.#actions, response);
	}
	/**
	* Finds a setting by name and returns it. Use {@link setting_options} to see available options.
	*/
	getSettingOption(name) {
		if (!this.sections) throw new InnertubeError("Sections not available");
		for (const section of this.sections) {
			if (!section.contents) continue;
			for (const el of section.contents) {
				const options = el.as(SettingsOptions).options;
				if (options) {
					for (const option of options) if (option.is(SettingsSwitch) && option.title?.toString() === name) return option;
				}
			}
		}
		throw new InnertubeError(`Option "${name}" not found`, { available_options: this.setting_options });
	}
	/**
	* Returns settings available in the page.
	*/
	get setting_options() {
		if (!this.sections) throw new InnertubeError("Sections not available");
		let options = [];
		for (const section of this.sections) {
			if (!section.contents) continue;
			for (const el of section.contents) if (el.as(SettingsOptions).options) options = options.concat(el.as(SettingsOptions).options);
		}
		return options.map((opt) => opt.title?.toString()).filter((el) => el);
	}
	/**
	* Returns options available in the sidebar.
	*/
	get sidebar_items() {
		if (!this.sidebar) throw new InnertubeError("Sidebar not available");
		return this.sidebar.items.map((item) => item.title.toString());
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/VideoInfo.js
var VideoInfo$1 = class VideoInfo$1 extends MediaInfo {
	primary_info;
	secondary_info;
	playlist;
	game_info;
	merchandise;
	related_chip_cloud;
	watch_next_feed;
	player_overlays;
	comments_entry_point_header;
	livechat;
	autoplay;
	heat_map;
	#watch_next_continuation;
	constructor(data, actions, cpn) {
		super(data, actions, cpn);
		const [info, next] = this.page;
		if (this.streaming_data) {
			const default_audio_track = this.streaming_data.adaptive_formats.find((format) => format.audio_track?.audio_is_default);
			if (default_audio_track) this.streaming_data.formats.forEach((format) => format.language = default_audio_track.language);
			else if (this.captions?.caption_tracks && this.captions?.caption_tracks.length > 0) {
				const language_code = this.captions.caption_tracks.find((caption) => caption.kind === "asr")?.language_code;
				this.streaming_data.adaptive_formats.forEach((format) => {
					if (format.has_audio) format.language = language_code;
				});
				this.streaming_data.formats.forEach((format) => format.language = language_code);
			}
		}
		const two_col = next?.contents?.item().as(TwoColumnWatchNextResults);
		const results = two_col?.results;
		const secondary_results = two_col?.secondary_results;
		if (results && secondary_results) {
			if (info.microformat?.is(PlayerMicroformat) && info.microformat?.category === "Gaming") {
				const row = results.firstOfType(VideoSecondaryInfo)?.metadata?.rows?.firstOfType(RichMetadataRow);
				if (row?.is(RichMetadataRow)) this.game_info = {
					title: row?.contents?.firstOfType(RichMetadata)?.title,
					release_year: row?.contents?.firstOfType(RichMetadata)?.subtitle
				};
			}
			this.primary_info = results.firstOfType(VideoPrimaryInfo);
			this.secondary_info = results.firstOfType(VideoSecondaryInfo);
			this.merchandise = results.firstOfType(MerchandiseShelf);
			this.related_chip_cloud = secondary_results.firstOfType(RelatedChipCloud)?.content.as(ChipCloud);
			if (two_col?.playlist) this.playlist = two_col.playlist;
			this.watch_next_feed = secondary_results.firstOfType(ItemSection)?.contents || secondary_results;
			if (this.watch_next_feed && Array.isArray(this.watch_next_feed) && this.watch_next_feed.at(-1)?.is(ContinuationItem)) this.#watch_next_continuation = this.watch_next_feed.pop()?.as(ContinuationItem);
			this.player_overlays = next?.player_overlays?.item().as(PlayerOverlay);
			if (two_col?.autoplay) this.autoplay = two_col.autoplay;
			const segmented_like_dislike_button = this.primary_info?.menu?.top_level_buttons.firstOfType(SegmentedLikeDislikeButton);
			if (segmented_like_dislike_button?.like_button?.is(ToggleButton) && segmented_like_dislike_button?.dislike_button?.is(ToggleButton)) {
				this.basic_info.like_count = segmented_like_dislike_button?.like_button?.like_count;
				this.basic_info.is_liked = segmented_like_dislike_button?.like_button?.is_toggled;
				this.basic_info.is_disliked = segmented_like_dislike_button?.dislike_button?.is_toggled;
			}
			const segmented_like_dislike_button_view = this.primary_info?.menu?.top_level_buttons.firstOfType(SegmentedLikeDislikeButtonView);
			if (segmented_like_dislike_button_view) {
				this.basic_info.like_count = segmented_like_dislike_button_view.like_count;
				if (segmented_like_dislike_button_view.like_button) {
					const like_status = segmented_like_dislike_button_view.like_button.like_status_entity.like_status;
					this.basic_info.is_liked = like_status === "LIKE";
					this.basic_info.is_disliked = like_status === "DISLIKE";
				}
			}
			const comments_entry_point = results.find((node) => {
				return node.is(ItemSection) && node.target_id === "comments-entry-point";
			});
			this.comments_entry_point_header = comments_entry_point?.contents?.firstOfType(CommentsEntryPointHeader);
			this.livechat = next?.contents_memo?.getType(LiveChat$1)[0];
			const macro_markers_list_for_heatmap = this.page[1]?.contents_memo?.getType(MacroMarkersListEntity);
			let calculated_heat_map = null;
			if (macro_markers_list_for_heatmap) {
				const heatmap_markers_entity = macro_markers_list_for_heatmap.find((markers) => markers.isHeatmap());
				if (heatmap_markers_entity) try {
					calculated_heat_map = heatmap_markers_entity.toHeatmap();
				} catch {}
			}
			this.heat_map = calculated_heat_map;
		}
	}
	/**
	* Applies given filter to the watch next feed. Use {@link filters} to get available filters.
	* @param target_filter - Filter to apply.
	*/
	async selectFilter(target_filter) {
		if (!this.related_chip_cloud) throw new InnertubeError("Chip cloud not found, cannot apply filter");
		let cloud_chip;
		if (typeof target_filter === "string") {
			const filter = this.related_chip_cloud?.chips?.find((chip) => chip.text === target_filter);
			if (!filter) throw new InnertubeError("Invalid filter", { available_filters: this.filters });
			cloud_chip = filter;
		} else if (target_filter?.is(ChipCloudChip)) cloud_chip = target_filter;
		else throw new InnertubeError("Invalid cloud chip", target_filter);
		if (cloud_chip.is_selected) return this;
		const data = (await cloud_chip.endpoint?.call(this.actions, { parse: true }))?.on_response_received_endpoints?.find((endpoint) => {
			return endpoint.is(ReloadContinuationItemsCommand) && endpoint.target_id === "watch-next-feed";
		});
		this.watch_next_feed = data?.contents;
		return this;
	}
	/**
	* Adds video to the watch history.
	*/
	async addToWatchHistory() {
		return super.addToWatchHistory();
	}
	/**
	* Updates watch time for the video.
	*/
	async updateWatchTime(startTime) {
		return super.updateWatchTime(startTime);
	}
	/**
	* Retrieves watch next feed continuation.
	*/
	async getWatchNextContinuation() {
		if (!this.#watch_next_continuation) throw new InnertubeError("Watch next feed continuation not found");
		const data = (await this.#watch_next_continuation?.endpoint.call(this.actions, { parse: true }))?.on_response_received_endpoints?.firstOfType(AppendContinuationItemsAction);
		if (!data) throw new InnertubeError("AppendContinuationItemsAction not found");
		this.watch_next_feed = data?.contents;
		if (this.watch_next_feed?.at(-1)?.is(ContinuationItem)) this.#watch_next_continuation = this.watch_next_feed.pop()?.as(ContinuationItem);
		else this.#watch_next_continuation = void 0;
		return this;
	}
	/**
	* Likes the video.
	*/
	async like() {
		const segmented_like_dislike_button_view = this.primary_info?.menu?.top_level_buttons.firstOfType(SegmentedLikeDislikeButtonView);
		if (segmented_like_dislike_button_view) {
			const button = segmented_like_dislike_button_view?.like_button?.toggle_button;
			if (!button || !button.default_button || !segmented_like_dislike_button_view.like_button) throw new InnertubeError("Like button not found", { video_id: this.basic_info.id });
			if (segmented_like_dislike_button_view.like_button.like_status_entity.like_status === "LIKE") throw new InnertubeError("This video is already liked", { video_id: this.basic_info.id });
			if (!button.default_button.on_tap) throw new InnertubeError("onTap command not found", { video_id: this.basic_info.id });
			return await new NavigationEndpoint(button.default_button.on_tap.payload.commands.find((cmd) => cmd.innertubeCommand)).call(this.actions);
		}
		const button = (this.primary_info?.menu?.top_level_buttons.firstOfType(SegmentedLikeDislikeButton))?.like_button;
		if (!button) throw new InnertubeError("Like button not found", { video_id: this.basic_info.id });
		if (!button.is(ToggleButton)) throw new InnertubeError("Like button is not a toggle button. This action is likely disabled for this video.", { video_id: this.basic_info.id });
		if (button.is_toggled) throw new InnertubeError("This video is already liked", { video_id: this.basic_info.id });
		return await button.endpoint.call(this.actions);
	}
	/**
	* Dislikes the video.
	*/
	async dislike() {
		const segmented_like_dislike_button_view = this.primary_info?.menu?.top_level_buttons.firstOfType(SegmentedLikeDislikeButtonView);
		if (segmented_like_dislike_button_view) {
			const button = segmented_like_dislike_button_view?.dislike_button?.toggle_button;
			if (!button || !button.default_button || !segmented_like_dislike_button_view.dislike_button || !segmented_like_dislike_button_view.like_button) throw new InnertubeError("Dislike button not found", { video_id: this.basic_info.id });
			if (segmented_like_dislike_button_view.like_button.like_status_entity.like_status === "DISLIKE") throw new InnertubeError("This video is already disliked", { video_id: this.basic_info.id });
			if (!button.default_button.on_tap) throw new InnertubeError("onTap command not found", { video_id: this.basic_info.id });
			return await new NavigationEndpoint(button.default_button.on_tap.payload.commands.find((cmd) => cmd.innertubeCommand)).call(this.actions);
		}
		const button = (this.primary_info?.menu?.top_level_buttons.firstOfType(SegmentedLikeDislikeButton))?.dislike_button;
		if (!button) throw new InnertubeError("Dislike button not found", { video_id: this.basic_info.id });
		if (!button.is(ToggleButton)) throw new InnertubeError("Dislike button is not a toggle button. This action is likely disabled for this video.", { video_id: this.basic_info.id });
		if (button.is_toggled) throw new InnertubeError("This video is already disliked", { video_id: this.basic_info.id });
		return await button.endpoint.call(this.actions);
	}
	/**
	* Removes like/dislike.
	*/
	async removeRating() {
		let button;
		const segmented_like_dislike_button_view = this.primary_info?.menu?.top_level_buttons.firstOfType(SegmentedLikeDislikeButtonView);
		if (segmented_like_dislike_button_view) {
			const toggle_button = segmented_like_dislike_button_view?.like_button?.toggle_button;
			if (!toggle_button || !toggle_button.default_button || !segmented_like_dislike_button_view.like_button) throw new InnertubeError("Like button not found", { video_id: this.basic_info.id });
			const like_status = segmented_like_dislike_button_view.like_button.like_status_entity.like_status;
			if (like_status === "LIKE") button = segmented_like_dislike_button_view?.like_button?.toggle_button;
			else if (like_status === "DISLIKE") button = segmented_like_dislike_button_view?.dislike_button?.toggle_button;
			else throw new InnertubeError("This video is not liked/disliked", { video_id: this.basic_info.id });
			if (!button || !button.toggled_button) throw new InnertubeError("Like/Dislike button not found", { video_id: this.basic_info.id });
			if (!button.toggled_button.on_tap) throw new InnertubeError("onTap command not found", { video_id: this.basic_info.id });
			return await new NavigationEndpoint(button.toggled_button.on_tap.payload.commands.find((cmd) => cmd.innertubeCommand)).call(this.actions);
		}
		const segmented_like_dislike_button = this.primary_info?.menu?.top_level_buttons.firstOfType(SegmentedLikeDislikeButton);
		const like_button = segmented_like_dislike_button?.like_button;
		const dislike_button = segmented_like_dislike_button?.dislike_button;
		if (!like_button?.is(ToggleButton) || !dislike_button?.is(ToggleButton)) throw new InnertubeError("Like/Dislike button is not a toggle button. This action is likely disabled for this video.", { video_id: this.basic_info.id });
		if (like_button?.is_toggled) button = like_button;
		else if (dislike_button?.is_toggled) button = dislike_button;
		if (!button) throw new InnertubeError("This video is not liked/disliked", { video_id: this.basic_info.id });
		return await button.toggled_endpoint.call(this.actions);
	}
	/**
	* Retrieves Live Chat if available.
	*/
	getLiveChat() {
		if (!this.livechat) throw new InnertubeError("Live Chat is not available", { video_id: this.basic_info.id });
		return new LiveChat(this);
	}
	/**
	* Retrieves trailer info if available (typically for non-purchased movies or films).
	* @returns `VideoInfo` for the trailer, or `null` if none.
	*/
	getTrailerInfo() {
		if (this.has_trailer && this.playability_status?.error_screen) {
			let player_response;
			if (this.playability_status.error_screen.is(PlayerLegacyDesktopYpcTrailer)) player_response = this.playability_status.error_screen.trailer?.player_response;
			else if (this.playability_status.error_screen.is(YpcTrailer)) player_response = this.playability_status.error_screen.player_response;
			if (player_response) return new VideoInfo$1([{ data: player_response }], this.actions, this.cpn);
		}
		return null;
	}
	/**
	* Watch next feed filters.
	*/
	get filters() {
		return this.related_chip_cloud?.chips?.map((chip) => chip.text?.toString()) || [];
	}
	/**
	* Checks if continuation is available for the watch next feed.
	*/
	get wn_has_continuation() {
		return !!this.#watch_next_continuation;
	}
	/**
	* Gets the endpoint of the autoplay video
	*/
	get autoplay_video_endpoint() {
		return this.autoplay?.sets?.[0]?.autoplay_video || null;
	}
	/**
	* Checks if trailer is available.
	*/
	get has_trailer() {
		return !!this.playability_status?.error_screen?.is(PlayerLegacyDesktopYpcTrailer, YpcTrailer);
	}
	/**
	* Get songs used in the video.
	*/
	get music_tracks() {
		const description_content = this.page[1]?.engagement_panels?.filter((panel) => panel.content?.is(StructuredDescriptionContent));
		if (description_content !== void 0 && description_content.length > 0) {
			const music_section = description_content[0].content?.as(StructuredDescriptionContent)?.items?.filterType(VideoDescriptionMusicSection);
			if (music_section !== void 0 && music_section.length > 0) return music_section[0].carousel_lockups?.map((lookup) => {
				let song;
				let artist;
				let album;
				let license;
				let videoId;
				let channelId;
				song = lookup.video_lockup?.title?.toString();
				videoId = lookup.video_lockup?.endpoint?.payload.videoId;
				for (let i = 0; i < lookup.info_rows.length; i++) {
					const info_row = lookup.info_rows[i];
					if (info_row.info_row_expand_status_key === void 0) {
						if (song === void 0) {
							song = info_row.default_metadata?.toString() || info_row.expanded_metadata?.toString();
							if (videoId === void 0) videoId = (info_row.default_metadata?.endpoint || info_row.expanded_metadata?.endpoint)?.payload?.videoId;
						} else album = info_row.default_metadata?.toString() || info_row.expanded_metadata?.toString();
					} else {
						if (info_row.info_row_expand_status_key?.indexOf("structured-description-music-section-artists-row-state-id") !== -1) {
							artist = info_row.default_metadata?.toString() || info_row.expanded_metadata?.toString();
							if (channelId === void 0) channelId = (info_row.default_metadata?.endpoint || info_row.expanded_metadata?.endpoint)?.payload?.browseId;
						}
						if (info_row.info_row_expand_status_key?.indexOf("structured-description-music-section-licenses-row-state-id") !== -1) license = info_row.default_metadata?.toString() || info_row.expanded_metadata?.toString();
					}
				}
				return {
					song,
					artist,
					album,
					license,
					videoId,
					channelId
				};
			});
		}
		return [];
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/youtube/TranscriptInfo.js
var TranscriptInfo = class TranscriptInfo {
	#page;
	#actions;
	transcript;
	constructor(actions, response) {
		this.#page = parseResponse(response.data);
		this.#actions = actions;
		if (!this.#page.actions_memo) throw new Error("Page actions not found");
		this.transcript = this.#page.actions_memo.getType(Transcript)[0];
	}
	/**
	* Selects a language from the language menu and returns the updated transcript.
	* @param language - Language to select.
	*/
	async selectLanguage(language) {
		const target_menu_item = this.transcript.content?.footer?.language_menu?.sub_menu_items?.find((item) => item.title.toString() === language);
		if (!target_menu_item) throw new Error(`Language not found: ${language}`);
		if (target_menu_item.selected) return this;
		const response = await this.#actions.execute("/get_transcript", { params: target_menu_item.continuation });
		return new TranscriptInfo(this.#actions, response);
	}
	/**
	* Returns available languages.
	*/
	get languages() {
		return this.transcript.content?.footer?.language_menu?.sub_menu_items?.map((item) => item.title.toString()) || [];
	}
	/**
	* Returns the currently selected language.
	*/
	get selectedLanguage() {
		return this.transcript.content?.footer?.language_menu?.sub_menu_items?.find((item) => item.selected)?.title.toString() || "";
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/Album.js
var Album = class {
	#page;
	header;
	contents;
	sections;
	background;
	url;
	constructor(response) {
		this.#page = parseResponse(response.data);
		if (!this.#page.contents_memo) throw new Error("No contents found in the response");
		this.header = this.#page.contents_memo.getType(MusicDetailHeader, MusicResponsiveHeader)?.[0];
		this.contents = this.#page.contents_memo.getType(MusicShelf)?.[0].contents || observe([]);
		this.sections = this.#page.contents_memo.getType(MusicCarouselShelf) || observe([]);
		this.background = this.#page.background;
		this.url = this.#page.microformat?.as(MicroformatData).url_canonical;
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/Artist.js
var Artist = class {
	#page;
	#actions;
	header;
	sections;
	constructor(response, actions) {
		this.#page = parseResponse(response.data);
		this.#actions = actions;
		this.header = this.page.header?.item().as(MusicImmersiveHeader, MusicVisualHeader, MusicHeader);
		const music_shelf = this.#page.contents_memo?.getType(MusicShelf) || [];
		const music_carousel_shelf = this.#page.contents_memo?.getType(MusicCarouselShelf) || [];
		this.sections = observe([...music_shelf, ...music_carousel_shelf]);
	}
	async getAllSongs() {
		const music_shelves = this.sections.filter((section) => section.type === "MusicShelf");
		if (!music_shelves.length) throw new InnertubeError("Could not find any node of type MusicShelf.");
		const shelf = music_shelves.find((shelf) => shelf.title?.text === "Top songs");
		if (!shelf) throw new InnertubeError("Could not find target shelf (Top songs).");
		if (!shelf.endpoint) throw new InnertubeError("Target shelf (Top songs) did not have an endpoint.");
		return (await shelf.endpoint.call(this.#actions, {
			client: "YTMUSIC",
			parse: true
		})).contents_memo?.getType(MusicPlaylistShelf)?.[0];
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/Explore.js
var Explore = class {
	#page;
	top_buttons;
	sections;
	constructor(response) {
		this.#page = parseResponse(response.data);
		const tab = this.#page.contents?.item().as(SingleColumnBrowseResults).tabs.find((tab) => tab.selected);
		if (!tab) throw new InnertubeError("Could not find target tab.");
		const section_list = tab.content?.as(SectionList);
		if (!section_list) throw new InnertubeError("Target tab did not have any content.");
		this.top_buttons = section_list.contents.firstOfType(Grid)?.items.as(MusicNavigationButton) || [];
		this.sections = section_list.contents.filterType(MusicCarouselShelf);
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/HomeFeed.js
var HomeFeed$1 = class HomeFeed$1 {
	#page;
	#actions;
	#continuation;
	sections;
	header;
	constructor(response, actions) {
		this.#actions = actions;
		this.#page = parseResponse(response.data);
		const tab = this.#page.contents?.item().as(SingleColumnBrowseResults).tabs.find((tab) => tab.selected);
		if (!tab) throw new InnertubeError("Could not find Home tab.");
		if (tab.content === null) {
			if (!this.#page.continuation_contents) throw new InnertubeError("Continuation did not have any content.");
			this.#continuation = this.#page.continuation_contents.as(SectionListContinuation).continuation;
			this.sections = this.#page.continuation_contents.as(SectionListContinuation).contents?.as(MusicCarouselShelf);
			return;
		}
		this.header = tab.content?.as(SectionList).header?.as(ChipCloud);
		this.#continuation = tab.content?.as(SectionList).continuation;
		this.sections = tab.content?.as(SectionList).contents.as(MusicCarouselShelf, MusicTasteBuilderShelf);
	}
	/**
	* Retrieves home feed continuation.
	*/
	async getContinuation() {
		if (!this.#continuation) throw new InnertubeError("Continuation not found.");
		const response = await this.#actions.execute("/browse", {
			client: "YTMUSIC",
			continuation: this.#continuation
		});
		return new HomeFeed$1(response, this.#actions);
	}
	async applyFilter(target_filter) {
		let cloud_chip;
		if (typeof target_filter === "string") {
			cloud_chip = this.header?.chips?.as(ChipCloudChip).find((chip) => chip.text === target_filter);
			if (!cloud_chip) throw new InnertubeError("Could not find filter with given name.", { available_filters: this.filters });
		} else if (target_filter?.is(ChipCloudChip)) cloud_chip = target_filter;
		if (!cloud_chip) throw new InnertubeError("Invalid filter", { available_filters: this.filters });
		if (cloud_chip?.is_selected) return this;
		if (!cloud_chip.endpoint) throw new InnertubeError("Selected filter does not have an endpoint.");
		const response = await cloud_chip.endpoint.call(this.#actions, { client: "YTMUSIC" });
		return new HomeFeed$1(response, this.#actions);
	}
	get filters() {
		return this.header?.chips?.as(ChipCloudChip).map((chip) => chip.text) || [];
	}
	get has_continuation() {
		return !!this.#continuation;
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/Library.js
var Library = class Library {
	#page;
	#actions;
	#continuation;
	header;
	contents;
	constructor(response, actions) {
		this.#page = parseResponse(response.data);
		this.#actions = actions;
		const section_list = this.#page.contents_memo?.getType(SectionList)[0];
		this.header = section_list?.header?.as(MusicSideAlignedItem);
		this.contents = section_list?.contents?.as(Grid, MusicShelf);
		this.#continuation = this.contents?.find((list) => list.continuation)?.continuation;
	}
	/**
	* Applies given sort option to the library items.
	*/
	async applySort(sort_by) {
		let target_item;
		if (typeof sort_by === "string") {
			const options = (this.#page.contents_memo?.getType(MusicSortFilterButton)[0])?.menu?.options.filter((item) => item instanceof MusicMultiSelectMenuItem);
			target_item = options?.find((item) => item.title === sort_by);
			if (!target_item) throw new InnertubeError(`Sort option "${sort_by}" not found`, { available_filters: options.map((item) => item.title) });
		} else target_item = sort_by;
		if (!target_item.endpoint) throw new InnertubeError("Invalid sort option");
		if (target_item.selected) return this;
		const cmd = target_item.endpoint.payload?.commands?.find((cmd) => cmd.browseSectionListReloadEndpoint)?.browseSectionListReloadEndpoint;
		if (!cmd) throw new InnertubeError("Failed to find sort option command");
		const response = await this.#actions.execute("/browse", {
			client: "YTMUSIC",
			continuation: cmd.continuation.reloadContinuationData.continuation,
			parse: true
		});
		const previously_selected_item = this.#page.contents_memo?.getType(MusicMultiSelectMenuItem)?.find((item) => item.selected);
		if (previously_selected_item) previously_selected_item.selected = false;
		target_item.selected = true;
		this.contents = response.continuation_contents?.as(SectionListContinuation).contents?.as(Grid, MusicShelf);
		return this;
	}
	/**
	* Applies given filter to the library.
	*/
	async applyFilter(filter) {
		let target_chip;
		const chip_cloud = this.#page.contents_memo?.getType(ChipCloud)[0];
		if (typeof filter === "string") {
			target_chip = chip_cloud?.chips.find((chip) => chip.text === filter);
			if (!target_chip) throw new InnertubeError(`Filter "${filter}" not found`, { available_filters: this.filters });
		} else target_chip = filter;
		if (!target_chip.endpoint) throw new InnertubeError("Invalid filter", filter);
		const response = await new NavigationEndpoint(target_chip.endpoint.payload?.commands?.[0]).call(this.#actions, { client: "YTMUSIC" });
		return new Library(response, this.#actions);
	}
	/**
	* Retrieves continuation of the library items.
	*/
	async getContinuation() {
		if (!this.#continuation) throw new InnertubeError("No continuation available");
		return new LibraryContinuation(await this.#actions.execute("/browse", {
			client: "YTMUSIC",
			continuation: this.#continuation
		}), this.#actions);
	}
	get has_continuation() {
		return !!this.#continuation;
	}
	get sort_options() {
		return ((this.#page.contents_memo?.getType(MusicSortFilterButton)[0])?.menu?.options.filter((item) => item instanceof MusicMultiSelectMenuItem)).map((item) => item.title);
	}
	get filters() {
		return this.#page.contents_memo?.getType(ChipCloud)?.[0].chips.map((chip) => chip.text) || [];
	}
	get page() {
		return this.#page;
	}
};
var LibraryContinuation = class LibraryContinuation {
	#page;
	#actions;
	#continuation;
	contents;
	constructor(response, actions) {
		this.#page = parseResponse(response.data);
		this.#actions = actions;
		if (!this.#page.continuation_contents) throw new InnertubeError("No continuation contents found");
		this.contents = this.#page.continuation_contents.as(MusicShelfContinuation, GridContinuation);
		this.#continuation = this.contents.continuation || null;
	}
	async getContinuation() {
		if (!this.#continuation) throw new InnertubeError("No continuation available");
		const response = await this.#actions.execute("/browse", {
			client: "YTMUSIC",
			continuation: this.#continuation
		});
		return new LibraryContinuation(response, this.#actions);
	}
	get has_continuation() {
		return !!this.#continuation;
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/Playlist.js
var Playlist = class Playlist {
	#page;
	#actions;
	#continuation;
	header;
	contents;
	background;
	#last_fetched_suggestions;
	#suggestions_continuation;
	constructor(response, actions) {
		this.#actions = actions;
		this.#page = parseResponse(response.data);
		this.#last_fetched_suggestions = null;
		this.#suggestions_continuation = null;
		if (this.#page.continuation_contents) {
			const data = this.#page.continuation_contents?.as(MusicPlaylistShelfContinuation);
			if (!data.contents) throw new InnertubeError("No contents found in the response");
			this.contents = data.contents.as(MusicResponsiveListItem, ContinuationItem);
			const continuation_item = this.contents.firstOfType(ContinuationItem);
			this.#continuation = data.continuation || continuation_item;
		} else if (this.#page.contents_memo) {
			this.header = this.#page.contents_memo.getType(MusicResponsiveHeader, MusicEditablePlaylistDetailHeader, MusicDetailHeader)?.[0];
			this.contents = this.#page.contents_memo.getType(MusicPlaylistShelf)?.[0]?.contents.as(MusicResponsiveListItem, ContinuationItem) || observe([]);
			this.background = this.#page.background;
			const continuation_item = this.contents.firstOfType(ContinuationItem);
			this.#continuation = this.#page.contents_memo.getType(MusicPlaylistShelf)?.[0]?.continuation || continuation_item;
		} else if (this.#page.on_response_received_actions) {
			const append_continuation_action = this.#page.on_response_received_actions.firstOfType(AppendContinuationItemsAction);
			this.contents = append_continuation_action?.contents?.as(MusicResponsiveListItem, ContinuationItem);
			this.#continuation = this.contents?.firstOfType(ContinuationItem);
		}
	}
	/**
	* Retrieves playlist items continuation.
	*/
	async getContinuation() {
		if (!this.#continuation) throw new InnertubeError("Continuation not found.");
		let response;
		if (typeof this.#continuation === "string") response = await this.#actions.execute("/browse", {
			client: "YTMUSIC",
			continuation: this.#continuation
		});
		else response = await this.#continuation.endpoint.call(this.#actions, { client: "YTMUSIC" });
		return new Playlist(response, this.#actions);
	}
	/**
	* Retrieves related playlists
	*/
	async getRelated() {
		const target_section_list = this.#page.contents_memo?.getType(SectionList).find((section_list) => section_list.continuation);
		if (!target_section_list) throw new InnertubeError("Could not find \"Related\" section.");
		let section_continuation = target_section_list.continuation;
		while (section_continuation) {
			const section_list = (await this.#actions.execute("/browse", {
				client: "YTMUSIC",
				continuation: section_continuation,
				parse: true
			})).continuation_contents?.as(SectionListContinuation);
			const related = (section_list?.contents?.as(MusicCarouselShelf, MusicShelf))?.find((section) => section.is(MusicCarouselShelf))?.as(MusicCarouselShelf);
			if (related) return related;
			section_continuation = section_list?.continuation;
		}
		throw new InnertubeError("Could not fetch related playlists.");
	}
	async getSuggestions(refresh = true) {
		const fetch_result = await (refresh || !this.#last_fetched_suggestions ? this.#fetchSuggestions() : Promise.resolve(null));
		if (fetch_result) {
			this.#last_fetched_suggestions = fetch_result.items;
			this.#suggestions_continuation = fetch_result.continuation;
		}
		return fetch_result?.items || this.#last_fetched_suggestions || observe([]);
	}
	async #fetchSuggestions() {
		const target_section_list = this.#page.contents_memo?.getType(SectionList).find((section_list) => section_list.continuation);
		const continuation = this.#suggestions_continuation || target_section_list?.continuation;
		if (continuation) {
			const suggestions = (((await this.#actions.execute("/browse", {
				client: "YTMUSIC",
				continuation,
				parse: true
			})).continuation_contents?.as(SectionListContinuation))?.contents?.as(MusicCarouselShelf, MusicShelf))?.find((section) => section.is(MusicShelf))?.as(MusicShelf);
			return {
				items: suggestions?.contents || observe([]),
				continuation: suggestions?.continuation || null
			};
		}
		return {
			items: observe([]),
			continuation: null
		};
	}
	get page() {
		return this.#page;
	}
	get items() {
		return this.contents || observe([]);
	}
	get has_continuation() {
		return !!this.#continuation;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/Recap.js
var Recap = class {
	#page;
	#actions;
	header;
	sections;
	constructor(response, actions) {
		this.#page = parseResponse(response.data);
		this.#actions = actions;
		const header = this.#page.header?.item();
		this.header = header?.is(MusicElementHeader) ? this.#page.header?.item().as(MusicElementHeader).element?.model?.as(HighlightsCarousel) : this.#page.header?.item().as(MusicHeader);
		const tab = this.#page.contents?.item().as(SingleColumnBrowseResults).tabs.firstOfType(Tab);
		if (!tab) throw new InnertubeError("Target tab not found");
		this.sections = tab.content?.as(SectionList).contents.as(ItemSection, MusicCarouselShelf, Message);
	}
	/**
	* Retrieves recap playlist.
	*/
	async getPlaylist() {
		if (!this.header) throw new InnertubeError("Header not found");
		if (!this.header.is(HighlightsCarousel)) throw new InnertubeError("Recap playlist not available, check back later.");
		return new Playlist(await this.header.panels[0].text_on_tap_endpoint.call(this.#actions, { client: "YTMUSIC" }), this.#actions);
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/Search.js
var Search$1 = class Search$1 {
	#page;
	#actions;
	#continuation;
	header;
	contents;
	constructor(response, actions, is_filtered) {
		this.#actions = actions;
		this.#page = parseResponse(response.data);
		if (!this.#page.contents || !this.#page.contents_memo) throw new InnertubeError("Response did not contain any contents.");
		const tab = this.#page.contents.item().as(TabbedSearchResults).tabs.find((tab) => tab.selected);
		if (!tab) throw new InnertubeError("Could not find target tab.");
		const tab_content = tab.content?.as(SectionList);
		if (!tab_content) throw new InnertubeError("Target tab did not have any content.");
		this.header = tab_content.header?.as(ChipCloud);
		this.contents = tab_content.contents.as(MusicShelf, MusicCardShelf, ItemSection);
		if (is_filtered) this.#continuation = this.contents.firstOfType(MusicShelf)?.continuation;
	}
	/**
	* Loads more items for the given shelf.
	*/
	async getMore(shelf) {
		if (!shelf || !shelf.endpoint) throw new InnertubeError("Cannot retrieve more items for this shelf because it does not have an endpoint.");
		const response = await shelf.endpoint.call(this.#actions, { client: "YTMUSIC" });
		if (!response) throw new InnertubeError("Endpoint did not return any data");
		return new Search$1(response, this.#actions, true);
	}
	/**
	* Retrieves search continuation. Only available for filtered searches and shelf continuations.
	*/
	async getContinuation() {
		if (!this.#continuation) throw new InnertubeError("Continuation not found.");
		const response = await this.#actions.execute("/search", {
			continuation: this.#continuation,
			client: "YTMUSIC"
		});
		return new SearchContinuation(this.#actions, response);
	}
	/**
	* Applies given filter to the search.
	*/
	async applyFilter(target_filter) {
		let cloud_chip;
		if (typeof target_filter === "string") {
			cloud_chip = this.header?.chips?.as(ChipCloudChip).find((chip) => chip.text === target_filter);
			if (!cloud_chip) throw new InnertubeError("Could not find filter with given name.", { available_filters: this.filters });
		} else if (target_filter?.is(ChipCloudChip)) cloud_chip = target_filter;
		if (!cloud_chip) throw new InnertubeError("Invalid filter", { available_filters: this.filters });
		if (cloud_chip?.is_selected) return this;
		if (!cloud_chip.endpoint) throw new InnertubeError("Selected filter does not have an endpoint.");
		const response = await cloud_chip.endpoint.call(this.#actions, { client: "YTMUSIC" });
		return new Search$1(response, this.#actions, true);
	}
	get filters() {
		return this.header?.chips?.as(ChipCloudChip).map((chip) => chip.text) || [];
	}
	get has_continuation() {
		return !!this.#continuation;
	}
	get did_you_mean() {
		return this.#page.contents_memo?.getType(DidYouMean)[0];
	}
	get showing_results_for() {
		return this.#page.contents_memo?.getType(ShowingResultsFor)[0];
	}
	get message() {
		return this.#page.contents_memo?.getType(Message)[0];
	}
	get songs() {
		return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === "Songs");
	}
	get videos() {
		return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === "Videos");
	}
	get albums() {
		return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === "Albums");
	}
	get artists() {
		return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === "Artists");
	}
	get playlists() {
		return this.contents?.filterType(MusicShelf).find((section) => section.title.toString() === "Community playlists");
	}
	get page() {
		return this.#page;
	}
};
var SearchContinuation = class SearchContinuation {
	#actions;
	#page;
	header;
	contents;
	constructor(actions, response) {
		this.#actions = actions;
		this.#page = parseResponse(response.data);
		this.header = this.#page.header?.item().as(MusicHeader);
		this.contents = this.#page.continuation_contents?.as(MusicShelfContinuation);
	}
	async getContinuation() {
		if (!this.contents?.continuation) throw new InnertubeError("Continuation not found.");
		const response = await this.#actions.execute("/search", {
			continuation: this.contents.continuation,
			client: "YTMUSIC"
		});
		return new SearchContinuation(this.#actions, response);
	}
	get has_continuation() {
		return !!this.contents?.continuation;
	}
	get page() {
		return this.#page;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytmusic/TrackInfo.js
var TrackInfo = class extends MediaInfo {
	tabs;
	current_video_endpoint;
	player_overlays;
	constructor(data, actions, cpn) {
		super(data, actions, cpn);
		const next = this.page[1];
		if (next) {
			const tabbed_results = next.contents_memo?.getType(WatchNextTabbedResults)?.[0];
			this.tabs = tabbed_results?.tabs.as(Tab);
			this.current_video_endpoint = next.current_video_endpoint;
			this.player_overlays = next.player_overlays?.item().as(PlayerOverlay);
		}
	}
	/**
	* Retrieves contents of the given tab.
	*/
	async getTab(title_or_page_type) {
		if (!this.tabs) throw new InnertubeError("Could not find any tab");
		const target_tab = this.tabs.find((tab) => tab.title === title_or_page_type) || this.tabs.find((tab) => tab.endpoint.payload.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === title_or_page_type) || this.tabs?.[0];
		if (!target_tab) throw new InnertubeError(`Tab "${title_or_page_type}" not found`, { available_tabs: this.available_tabs });
		if (target_tab.content) return target_tab.content;
		const page = await target_tab.endpoint.call(this.actions, {
			client: "YTMUSIC",
			parse: true
		});
		if (page.contents?.item().type === "Message") return page.contents.item().as(Message);
		if (!page.contents) throw new InnertubeError("Page contents was empty", page);
		return page.contents.item().as(SectionList).contents;
	}
	/**
	* Retrieves up next.
	*/
	async getUpNext(automix = true) {
		const music_queue = await this.getTab("Up next");
		if (!music_queue || !music_queue.content) throw new InnertubeError("Music queue was empty, the video id is probably invalid.", music_queue);
		const playlist_panel = music_queue.content.as(PlaylistPanel);
		if (!playlist_panel.playlist_id && automix) {
			const automix_preview_video = playlist_panel.contents.firstOfType(AutomixPreviewVideo);
			if (!automix_preview_video) throw new InnertubeError("Automix item not found");
			const page = await automix_preview_video.playlist_video?.endpoint.call(this.actions, {
				videoId: this.basic_info.id,
				client: "YTMUSIC",
				parse: true
			});
			if (!page || !page.contents_memo) throw new InnertubeError("Could not fetch automix");
			return page.contents_memo.getType(PlaylistPanel)?.[0];
		}
		return playlist_panel;
	}
	/**
	* Retrieves up next continuation relative to current TrackInfo.
	*/
	async getUpNextContinuation(playlistPanel) {
		if (!this.current_video_endpoint) throw new InnertubeError("Current Video Endpoint was not defined.", this.current_video_endpoint);
		if (playlistPanel instanceof PlaylistPanel && playlistPanel.playlist_id !== this.current_video_endpoint.payload.playlistId) throw new InnertubeError("PlaylistId from TrackInfo does not match with PlaylistPanel");
		const response = await new NavigationEndpoint({ watchNextEndpoint: {
			...this.current_video_endpoint.payload,
			continuation: playlistPanel.continuation
		} }).call(this.actions, {
			...this.current_video_endpoint.payload,
			continuation: playlistPanel.continuation,
			client: "YTMUSIC",
			parse: true
		});
		const playlistCont = response.continuation_contents?.as(PlaylistPanelContinuation);
		if (!playlistCont) throw new InnertubeError("No PlaylistPanel Continuation available.", response);
		return playlistCont;
	}
	/**
	* Retrieves related content.
	*/
	async getRelated() {
		return await this.getTab("MUSIC_PAGE_TYPE_TRACK_RELATED");
	}
	/**
	* Retrieves lyrics.
	*/
	async getLyrics() {
		return (await this.getTab("MUSIC_PAGE_TYPE_TRACK_LYRICS")).firstOfType(MusicDescriptionShelf);
	}
	/**
	* Adds the song to the watch history.
	*/
	async addToWatchHistory() {
		return super.addToWatchHistory(CLIENTS.YTMUSIC.NAME, CLIENTS.YTMUSIC.VERSION, "https://music.");
	}
	/**
	* Updates the watch time of the song.
	*/
	async updateWatchTime(startTime) {
		return super.updateWatchTime(startTime, CLIENTS.YTMUSIC.NAME, CLIENTS.YTMUSIC.VERSION, "https://music.");
	}
	get available_tabs() {
		return this.tabs ? this.tabs.map((tab) => tab.title) : [];
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytkids/Channel.js
var Channel = class Channel extends Feed {
	header;
	contents;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		this.header = this.page.header?.item().as(C4TabbedHeader);
		this.contents = this.memo.getType(ItemSection)[0] || this.page.continuation_contents?.as(ItemSectionContinuation);
	}
	/**
	* Retrieves next batch of content.
	*/
	async getContinuation() {
		if (!this.contents) throw new Error("No continuation available.");
		const continuation_response = await new NavigationEndpoint({ continuationCommand: {
			token: this.contents.continuation,
			request: "CONTINUATION_REQUEST_TYPE_BROWSE"
		} }).call(this.actions, { client: "YTKIDS" });
		return new Channel(this.actions, continuation_response);
	}
	get has_continuation() {
		return !!this.contents?.continuation;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytkids/HomeFeed.js
var HomeFeed = class HomeFeed extends Feed {
	header;
	contents;
	constructor(actions, data, already_parsed = false) {
		super(actions, data, already_parsed);
		this.header = this.page.header?.item().as(KidsCategoriesHeader);
		this.contents = this.page.contents?.item().as(KidsHomeScreen);
	}
	/**
	* Retrieves the contents of the given category tab. Use {@link HomeFeed.categories} to get a list of available categories.
	* @param tab - The tab to select
	*/
	async selectCategoryTab(tab) {
		let target_tab;
		if (typeof tab === "string") target_tab = this.header?.category_tabs.find((t) => t.title.toString() === tab);
		else if (tab?.is(KidsCategoryTab)) target_tab = tab;
		if (!target_tab) throw new InnertubeError(`Tab "${tab}" not found`);
		const page = await target_tab.endpoint.call(this.actions, {
			client: "YTKIDS",
			parse: true
		});
		page.header = this.page.header;
		page.header_memo = this.page.header_memo;
		return new HomeFeed(this.actions, page, true);
	}
	get categories() {
		return this.header?.category_tabs.map((tab) => tab.title.toString()) || [];
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytkids/Search.js
var Search = class extends Feed {
	estimated_results;
	contents;
	constructor(actions, data) {
		super(actions, data);
		this.estimated_results = this.page.estimated_results;
		const item_section = this.memo.getType(ItemSection)[0];
		if (!item_section) throw new InnertubeError("No item section found in search response.");
		this.contents = item_section.contents;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytkids/VideoInfo.js
var VideoInfo = class extends MediaInfo {
	slim_video_metadata;
	watch_next_feed;
	current_video_endpoint;
	player_overlays;
	constructor(data, actions, cpn) {
		super(data, actions, cpn);
		const next = this.page[1];
		const two_col = next?.contents?.item().as(TwoColumnWatchNextResults);
		const results = two_col?.results;
		const secondary_results = two_col?.secondary_results;
		if (results && secondary_results) {
			this.slim_video_metadata = results.firstOfType(ItemSection)?.contents?.firstOfType(SlimVideoMetadata);
			this.watch_next_feed = secondary_results.firstOfType(ItemSection)?.contents || secondary_results;
			this.current_video_endpoint = next?.current_video_endpoint;
			this.player_overlays = next?.player_overlays?.item().as(PlayerOverlay);
		}
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/ytshorts/ShortFormVideoInfo.js
var ShortFormVideoInfo = class extends MediaInfo {
	#watch_next_continuation;
	watch_next_feed;
	current_video_endpoint;
	player_overlays;
	constructor(data, actions, cpn, reel_watch_sequence_response) {
		super(data, actions, cpn);
		if (reel_watch_sequence_response) {
			const reel_watch_sequence = parseResponse(reel_watch_sequence_response.data);
			if (reel_watch_sequence.entries) this.watch_next_feed = reel_watch_sequence.entries;
			if (reel_watch_sequence.continuation_endpoint) this.#watch_next_continuation = reel_watch_sequence.continuation_endpoint?.as(ContinuationCommand);
		}
	}
	async getWatchNextContinuation() {
		if (!this.#watch_next_continuation) throw new InnertubeError("Continuation not found");
		const response = await this.actions.execute("/reel/reel_watch_sequence", {
			sequenceParams: this.#watch_next_continuation.token,
			parse: true
		});
		if (response.entries) this.watch_next_feed = response.entries;
		this.#watch_next_continuation = response.continuation_endpoint?.as(ContinuationCommand);
		return this;
	}
	/**
	* Checks if continuation is available for the watch next feed.
	*/
	get wn_has_continuation() {
		return !!this.#watch_next_continuation;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/parser/classes/misc/Author.js
var Author = class {
	id;
	name;
	thumbnails;
	endpoint;
	badges;
	avatar_thumbnail_url;
	is_current_user;
	is_public_subscriber;
	is_creator;
	is_moderator;
	is_verified;
	is_verified_artist;
	constructor(item, badges, thumbs, id) {
		let nav_text;
		if (item) {
			if ("content" in item) nav_text = Text$1.fromAttributed(item);
			else nav_text = new Text$1(item);
		}
		this.id = id || nav_text?.runs?.[0]?.endpoint?.payload?.browseId || nav_text?.endpoint?.payload?.browseId || badges?.channelId;
		this.name = nav_text?.text || "N/A";
		this.thumbnails = thumbs ? Thumbnail.fromResponse(thumbs) : [];
		this.endpoint = nav_text?.runs?.[0]?.endpoint || nav_text?.endpoint;
		if (badges) {
			if (Array.isArray(badges)) {
				this.badges = parseArray(badges);
				this.is_moderator = this.badges?.some((badge) => badge.icon_type == "MODERATOR");
				this.is_verified = this.badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED");
				this.is_verified_artist = this.badges?.some((badge) => badge.style == "BADGE_STYLE_TYPE_VERIFIED_ARTIST");
			} else {
				this.badges = observe([]);
				if ("avatarThumbnailUrl" in badges) this.avatar_thumbnail_url = badges.avatarThumbnailUrl;
				if ("isCurrentUser" in badges) this.is_current_user = !!badges.isCurrentUser;
				if ("isPublicSubscriber" in badges) this.is_public_subscriber = !!badges.isPublicSubscriber;
				if ("isCreator" in badges) this.is_creator = !!badges.isCreator;
				if ("isVerified" in badges) this.is_verified = !!badges.isVerified;
				if ("isArtist" in badges) this.is_verified_artist = !!badges.isArtist;
			}
		} else this.badges = observe([]);
	}
	get url() {
		return this.endpoint?.toURL();
	}
	get best_thumbnail() {
		return this.thumbnails[0];
	}
	get collaborators() {
		if (this.endpoint?.command?.is(ShowDialogCommand) && this.endpoint.command.inline_content?.is(DialogView)) {
			const dialog = this.endpoint.command.inline_content;
			if (dialog.custom_content?.is(ListView)) return dialog.custom_content.items.as(ListItemView).filter((item) => item.renderer_context?.command_context?.on_tap?.metadata?.page_type === "WEB_PAGE_TYPE_CHANNEL");
		}
		return [];
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/user-agents.js
var user_agents_default = {
	"desktop": [
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6.1 Safari/605.1.15",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 OPR/121.0.0.0",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 OPR/121.0.0.0",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 OPR/122.0.0.0",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
	],
	"mobile": [
		"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/388.0.811331708 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/388.0.811331708 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/388.0.811331708 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/388.0.811331708 Mobile/15E148 Safari/604.1",
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1"
	]
};
//#endregion
//#region node_modules/youtubei.js/dist/src/utils/Utils.js
var shim;
var Platform = class {
	static load(platform) {
		shim = platform;
	}
	static get shim() {
		if (!shim) throw new Error("Platform is not loaded");
		return shim;
	}
};
var InnertubeError = class extends Error {
	date;
	version;
	info;
	constructor(message, info) {
		super(message);
		if (info) this.info = info;
		this.date = /* @__PURE__ */ new Date();
		this.version = package_default.version;
	}
};
var ParsingError = class extends InnertubeError {};
var MissingParamError = class extends InnertubeError {};
var OAuth2Error = class extends InnertubeError {};
var PlayerError = class extends Error {};
var SessionError = class extends Error {};
var ChannelError = class extends Error {};
/**
* Compares given objects. May not work correctly for
* objects with methods.
*/
function deepCompare(obj1, obj2) {
	return Reflect.ownKeys(obj1).some((key) => {
		const is_text = obj2[key] instanceof Text$1;
		if (!is_text && typeof obj2[key] === "object") return JSON.stringify(obj1[key]) === JSON.stringify(obj2[key]);
		return obj1[key] === (is_text ? obj2[key].toString() : obj2[key]);
	});
}
/**
* Finds a string between two delimiters.
* @param data - the data.
* @param start_string - start string.
* @param end_string - end string.
*/
function getStringBetweenStrings(data, start_string, end_string) {
	const regex = new RegExp(`${escapeStringRegexp(start_string)}(.*?)${escapeStringRegexp(end_string)}`, "s");
	const match = data.match(regex);
	return match ? match[1] : void 0;
}
function escapeStringRegexp(input) {
	return input.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
/**
* Returns a random user agent.
* @param type - mobile | desktop
*/
function getRandomUserAgent(type) {
	const available_agents = user_agents_default[type];
	return available_agents[Math.floor(Math.random() * available_agents.length)];
}
/**
* Generates an authentication token from a cookies' sid.
* @param sid - Sid extracted from cookies
*/
async function generateSidAuth(sid) {
	const youtube = "https://www.youtube.com";
	const timestamp = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
	const input = [
		timestamp,
		sid,
		youtube
	].join(" ");
	return ["SAPISIDHASH", [timestamp, await Platform.shim.sha1Hash(input)].join("_")].join(" ");
}
/**
* Generates a random string with the given length.
*
*/
function generateRandomString(length) {
	const result = [];
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	for (let i = 0; i < length; i++) result.push(alphabet.charAt(Math.floor(Math.random() * 64)));
	return result.join("");
}
/**
* Converts time (h:m:s) to seconds.
* @returns seconds
*/
function timeToSeconds(time) {
	const params = time.split(":").map((param) => parseInt(param.replace(/\D/g, "")));
	switch (params.length) {
		case 1: return params[0];
		case 2: return params[0] * 60 + params[1];
		case 3: return params[0] * 3600 + params[1] * 60 + params[2];
		default: throw new Error("Invalid time string");
	}
}
function concatMemos(...iterables) {
	const memo = new Memo();
	for (const iterable of iterables) {
		if (!iterable) continue;
		for (const item of iterable) {
			const memo_item = memo.get(item[0]);
			if (memo_item) {
				memo.set(item[0], [...memo_item, ...item[1]]);
				continue;
			}
			memo.set(...item);
		}
	}
	return memo;
}
function throwIfMissing(params) {
	for (const [key, value] of Object.entries(params)) if (!value) throw new MissingParamError(`${key} is missing`);
}
async function* streamToIterable(stream) {
	const reader = stream.getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) return;
			yield value;
		}
	} finally {
		reader.releaseLock();
	}
}
function u8ToBase64(u8, base64url = false) {
	const result = btoa(String.fromCharCode(...u8));
	if (base64url) return result.replace(/\+/g, "-").replace(/\//g, "_");
	return result;
}
function base64ToU8(base64) {
	const standard_base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
	const padded_base64 = standard_base64.padEnd(standard_base64.length + (4 - standard_base64.length % 4) % 4, "=");
	return new Uint8Array(atob(padded_base64).split("").map((char) => char.charCodeAt(0)));
}
function isTextRun(run) {
	return !("emoji" in run);
}
function getCookie(cookies, name, matchWholeName = false) {
	const regex = matchWholeName ? `(^|\\s?)\\b${name}\\b=([^;]+)` : `(^|s?)${name}=([^;]+)`;
	const match = cookies.match(new RegExp(regex));
	return match ? match[2] : void 0;
}
function getNsigProcessorFn(n, sp, s) {
	return `function process(n = "", sp = "", s = "") {
  const mockStreamingURL = "https://ytjs.googlevideo.com/videoplayback?expire=1234567890&"+"n="+encodeURIComponent(n);
  const urlCtorFunction = exportedVars.nsigFunction || (() => { throw new Error('No n/sig decipher function extracted') });
  const urlCtor = urlCtorFunction(mockStreamingURL, sp, s);

  const proto = Object.getPrototypeOf(urlCtor);
  const properties = Object.getOwnPropertyNames(proto);
  const methodBlacklist = ['constructor', 'clone', 'set', 'get'];

  for (const prop of properties) {
    if (methodBlacklist.includes(prop))
      continue;

    if (typeof urlCtor[prop] === 'function')
      urlCtor[prop]();
  }

  const sigResult = urlCtor.get(sp);
  const nResult = urlCtor.get('n');

  return {
    sig: sigResult ? decodeURIComponent(sigResult) : undefined,
    n: nResult ? decodeURIComponent(nResult) : undefined
  };
}

return process("${n || ""}", "${sp || ""}", "${s || ""}");`;
}
//#endregion
//#region node_modules/youtubei.js/dist/src/platform/polyfills/node-custom-event.js
var CustomEvent = class extends Event {
	#detail;
	constructor(type, options) {
		super(type, options);
		this.#detail = options?.detail ?? null;
	}
	get detail() {
		return this.#detail;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/platform/jsruntime/default.js
function evaluate(_data, _env) {
	throw new Error("To decipher URLs, you must provide your own JavaScript evaluator. See https://ytjs.dev/guide/getting-started.html#providing-a-custom-javascript-interpreter for more details.");
}
//#endregion
//#region node_modules/youtubei.js/dist/src/core/Actions.js
var Actions = class {
	session;
	constructor(session) {
		this.session = session;
	}
	/**
	* Makes calls to the playback tracking API.
	* @param url - The URL to call.
	* @param client - The client to use.
	* @param params - Call parameters.
	*/
	async stats(url, client, params) {
		const s_url = new URL(url);
		s_url.searchParams.set("ver", "2");
		s_url.searchParams.set("c", client.client_name.toLowerCase());
		s_url.searchParams.set("cbrver", client.client_version);
		s_url.searchParams.set("cver", client.client_version);
		for (const key of Object.keys(params)) s_url.searchParams.set(key, params[key]);
		return await this.session.http.fetch(s_url);
	}
	async execute(endpoint, args) {
		let data;
		if (args && !args.protobuf) {
			data = { ...args };
			if (Reflect.has(data, "browseId") && !args.skip_auth_check) {
				if (this.#needsLogin(data.browseId) && !this.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
			}
			if (Reflect.has(data, "skip_auth_check")) delete data.skip_auth_check;
			if (Reflect.has(data, "override_endpoint")) delete data.override_endpoint;
			if (Reflect.has(data, "parse")) delete data.parse;
			if (Reflect.has(data, "request")) delete data.request;
			if (Reflect.has(data, "clientActions")) delete data.clientActions;
			if (Reflect.has(data, "settingItemIdForClient")) delete data.settingItemIdForClient;
			if (Reflect.has(data, "action")) {
				data.actions = [data.action];
				delete data.action;
			}
			if (Reflect.has(data, "boolValue")) {
				data.newValue = { boolValue: data.boolValue };
				delete data.boolValue;
			}
			if (Reflect.has(data, "token")) {
				data.continuation = data.token;
				delete data.token;
			}
			if (data?.client === "YTMUSIC") data.isAudioOnly = true;
		} else if (args) data = args.serialized_data;
		const target_endpoint = Reflect.has(args || {}, "override_endpoint") ? args?.override_endpoint : endpoint;
		const response = await this.session.http.fetch(target_endpoint, {
			method: "POST",
			body: args?.protobuf ? data : JSON.stringify(data || {}),
			headers: { "Content-Type": args?.protobuf ? "application/x-protobuf" : "application/json" }
		});
		if (args?.parse) {
			let parsed_response = parseResponse(await response.json());
			if (this.#isBrowse(parsed_response) && parsed_response.on_response_received_actions?.[0]?.type === "navigateAction") {
				const navigate_action = parsed_response.on_response_received_actions.firstOfType(NavigateAction);
				if (navigate_action) parsed_response = await navigate_action.endpoint.call(this, { parse: true });
			}
			return parsed_response;
		}
		return {
			success: response.ok,
			status_code: response.status,
			data: await response.json()
		};
	}
	#isBrowse(response) {
		return "on_response_received_actions" in response;
	}
	#needsLogin(id) {
		return [
			"FElibrary",
			"FEhistory",
			"FEsubscriptions",
			"FEchannels",
			"FEplaylist_aggregation",
			"FEmusic_listening_review",
			"FEmusic_library_landing",
			"SPaccount_overview",
			"SPaccount_notifications",
			"SPaccount_privacy",
			"SPtime_watched"
		].includes(id);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/OAuth2.js
var TAG$2 = "OAuth2";
var OAuth2 = class {
	#session;
	YTTV_URL;
	AUTH_SERVER_CODE_URL;
	AUTH_SERVER_TOKEN_URL;
	AUTH_SERVER_REVOKE_TOKEN_URL;
	client_id;
	oauth2_tokens;
	constructor(session) {
		this.#session = session;
		this.YTTV_URL = new URL("/tv", URLS.YT_BASE);
		this.AUTH_SERVER_CODE_URL = new URL("/o/oauth2/device/code", URLS.YT_BASE);
		this.AUTH_SERVER_TOKEN_URL = new URL("/o/oauth2/token", URLS.YT_BASE);
		this.AUTH_SERVER_REVOKE_TOKEN_URL = new URL("/o/oauth2/revoke", URLS.YT_BASE);
	}
	async init(tokens) {
		if (tokens) {
			this.setTokens(tokens);
			if (this.shouldRefreshToken()) await this.refreshAccessToken();
			this.#session.emit("auth", { credentials: this.oauth2_tokens });
			return;
		}
		if (await this.#loadFromCache()) {
			info(TAG$2, "Loaded OAuth2 tokens from cache.", this.oauth2_tokens);
			return;
		}
		if (!this.client_id) this.client_id = await this.getClientID();
		const device_and_user_code = await this.getDeviceAndUserCode();
		this.#session.emit("auth-pending", device_and_user_code);
		this.pollForAccessToken(device_and_user_code);
	}
	setTokens(tokens) {
		const tokensMod = tokens;
		if (tokensMod.expires_in) {
			tokensMod.expiry_date = new Date(Date.now() + tokensMod.expires_in * 1e3).toISOString();
			delete tokensMod.expires_in;
		}
		if (!this.validateTokens(tokensMod)) throw new OAuth2Error("Invalid tokens provided.");
		this.oauth2_tokens = tokensMod;
		if (tokensMod.client) {
			info(TAG$2, "Using provided client id and secret.");
			this.client_id = tokensMod.client;
		}
	}
	async cacheCredentials() {
		const data = new TextEncoder().encode(JSON.stringify(this.oauth2_tokens));
		await this.#session.cache?.set("youtubei_oauth_credentials", data.buffer);
	}
	async #loadFromCache() {
		const data = await this.#session.cache?.get("youtubei_oauth_credentials");
		if (!data) return false;
		const decoder = new TextDecoder();
		const credentials = JSON.parse(decoder.decode(data));
		this.setTokens(credentials);
		this.#session.emit("auth", { credentials });
		return true;
	}
	async removeCache() {
		await this.#session.cache?.remove("youtubei_oauth_credentials");
	}
	pollForAccessToken(device_and_user_code) {
		if (!this.client_id) throw new OAuth2Error("Client ID is missing.");
		const { device_code, interval } = device_and_user_code;
		const { client_id, client_secret } = this.client_id;
		const payload = {
			client_id,
			client_secret,
			code: device_code,
			grant_type: "http://oauth.net/grant_type/device/1.0"
		};
		const connInterval = setInterval(async () => {
			const response_data = await (await this.#http.fetch_function(this.AUTH_SERVER_TOKEN_URL, {
				body: JSON.stringify(payload),
				method: "POST",
				headers: { "Content-Type": "application/json" }
			})).json();
			if (response_data.error) {
				switch (response_data.error) {
					case "access_denied":
						this.#session.emit("auth-error", new OAuth2Error("Access was denied.", response_data));
						clearInterval(connInterval);
						break;
					case "expired_token":
						this.#session.emit("auth-error", new OAuth2Error("The device code has expired.", response_data));
						clearInterval(connInterval);
						break;
					case "authorization_pending":
					case "slow_down":
						info(TAG$2, "Polling for access token...");
						break;
					default:
						this.#session.emit("auth-error", new OAuth2Error("Server returned an unexpected error.", response_data));
						clearInterval(connInterval);
				}
				return;
			}
			this.setTokens(response_data);
			this.#session.emit("auth", { credentials: this.oauth2_tokens });
			clearInterval(connInterval);
		}, interval * 1e3);
	}
	async revokeCredentials() {
		if (!this.oauth2_tokens) throw new OAuth2Error("Access token not found");
		await this.removeCache();
		const url = this.AUTH_SERVER_REVOKE_TOKEN_URL;
		url.searchParams.set("token", this.oauth2_tokens.access_token);
		return this.#session.http.fetch_function(url, { method: "POST" });
	}
	async refreshAccessToken() {
		if (!this.client_id) this.client_id = await this.getClientID();
		if (!this.oauth2_tokens) throw new OAuth2Error("No tokens available to refresh.");
		const { client_id, client_secret } = this.client_id;
		const { refresh_token } = this.oauth2_tokens;
		const payload = {
			client_id,
			client_secret,
			refresh_token,
			grant_type: "refresh_token"
		};
		const response = await this.#http.fetch_function(this.AUTH_SERVER_TOKEN_URL, {
			body: JSON.stringify(payload),
			method: "POST",
			headers: { "Content-Type": "application/json" }
		});
		if (!response.ok) throw new OAuth2Error(`Failed to refresh access token: ${response.status}`);
		const response_data = await response.json();
		if (response_data.error_code) throw new OAuth2Error("Authorization server returned an error", response_data);
		this.oauth2_tokens.access_token = response_data.access_token;
		this.oauth2_tokens.expiry_date = new Date(Date.now() + response_data.expires_in * 1e3).toISOString();
		this.#session.emit("update-credentials", { credentials: this.oauth2_tokens });
	}
	async getDeviceAndUserCode() {
		if (!this.client_id) throw new OAuth2Error("Client ID is missing.");
		const { client_id } = this.client_id;
		const payload = {
			client_id,
			scope: "http://gdata.youtube.com https://www.googleapis.com/auth/youtube-paid-content",
			device_id: Platform.shim.uuidv4(),
			device_model: "ytlr::"
		};
		const response = await this.#http.fetch_function(this.AUTH_SERVER_CODE_URL, {
			body: JSON.stringify(payload),
			method: "POST",
			headers: { "Content-Type": "application/json" }
		});
		if (!response.ok) throw new OAuth2Error(`Failed to get device/user code: ${response.status}`);
		const response_data = await response.json();
		if (response_data.error_code) throw new OAuth2Error("Authorization server returned an error", response_data);
		return response_data;
	}
	async getClientID() {
		const yttv_response = await this.#http.fetch_function(this.YTTV_URL, { headers: {
			"User-Agent": "Mozilla/5.0 (ChromiumStylePlatform) Cobalt/Version",
			"Referer": "https://www.youtube.com/tv",
			"Accept-Language": "en-US"
		} });
		if (!yttv_response.ok) throw new OAuth2Error(`Failed to get client ID: ${yttv_response.status}`);
		const yttv_response_data = await yttv_response.text();
		let script_url_body;
		if ((script_url_body = OAUTH.REGEX.TV_SCRIPT.exec(yttv_response_data)) !== null) {
			info(TAG$2, `Got YouTubeTV script URL (${script_url_body[1]})`);
			const script_response = await this.#http.fetch(script_url_body[1], { baseURL: URLS.YT_BASE });
			if (!script_response.ok) throw new OAuth2Error(`TV script request failed with status code ${script_response.status}`);
			const client_identity = (await script_response.text()).match(OAUTH.REGEX.CLIENT_IDENTITY);
			if (!client_identity || !client_identity.groups) throw new OAuth2Error("Could not obtain client ID.");
			const { client_id, client_secret } = client_identity.groups;
			info(TAG$2, `Client identity retrieved (clientId=${client_id}, clientSecret=${client_secret}).`);
			return {
				client_id,
				client_secret
			};
		}
		throw new OAuth2Error("Could not obtain script URL.");
	}
	shouldRefreshToken() {
		if (!this.oauth2_tokens) return false;
		return Date.now() > new Date(this.oauth2_tokens.expiry_date).getTime();
	}
	validateTokens(tokens) {
		return !(!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date);
	}
	get #http() {
		return this.#session.http;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/Player.js
var TAG$1 = "Player";
/**
* Represents YouTube's player script. This is required to decipher signatures.
*/
var Player = class Player {
	player_id;
	signature_timestamp;
	data;
	po_token;
	constructor(player_id, signature_timestamp, data) {
		this.player_id = player_id;
		this.signature_timestamp = signature_timestamp;
		this.data = data;
	}
	static async create(cache, fetch = Platform.shim.fetch, po_token, player_id) {
		if (!player_id) {
			const res = await fetch(new URL("/iframe_api", URLS.YT_BASE));
			if (!res.ok) throw new PlayerError(`Failed to get player id: ${res.status} (${res.statusText})`);
			player_id = getStringBetweenStrings(await res.text(), "player\\/", "\\/");
		}
		info(TAG$1, `Using player id (${player_id}). Checking for cached players..`);
		if (!player_id) throw new PlayerError("Failed to get player id");
		if (cache) {
			const cached_player = await Player.fromCache(cache, player_id);
			if (cached_player) {
				info(TAG$1, "Found up-to-date player data in cache.");
				cached_player.po_token = po_token;
				return cached_player;
			}
		}
		const player_url = new URL(`/s/player/${player_id}/player_es6.vflset/en_US/base.js`, URLS.YT_BASE);
		info(TAG$1, `Could not find any cached player. Will download a new player from ${player_url}.`);
		const player_res = await fetch(player_url, { headers: { "user-agent": getRandomUserAgent("desktop") } });
		if (!player_res.ok) throw new PlayerError(`Failed to get player data: ${player_res.status}`);
		const player_js = await player_res.text();
		const nsigFunctionName = "nsigFunction";
		const timestampVarName = "signatureTimestampVar";
		const result = new JsExtractor(new JsAnalyzer(player_js, { extractions: [{
			friendlyName: nsigFunctionName,
			match: nsigMatcher
		}, {
			friendlyName: timestampVarName,
			match: timestampMatcher,
			collectDependencies: false
		}] })).buildScript({
			disallowSideEffectInitializers: true,
			exportRawValues: true,
			rawValueOnly: [timestampVarName]
		});
		if (result.exportedRawValues && !(timestampVarName in result.exportedRawValues)) warn(TAG$1, "Failed to extract signature timestamp.");
		if (!result.exported.includes(nsigFunctionName)) warn(TAG$1, "Failed to extract n/sig decipher function.");
		const signatureTimestamp = result.exportedRawValues?.[timestampVarName];
		const player = await Player.fromSource(player_id, {
			cache,
			signature_timestamp: parseInt(signatureTimestamp) || 0,
			data: result
		});
		player.po_token = po_token;
		return player;
	}
	async decipher(url, signature_cipher, cipher, this_response_nsig_cache) {
		url = url || signature_cipher || cipher;
		if (!url) throw new PlayerError("No valid URL to decipher");
		const args = new URLSearchParams(url);
		const url_components = new URL(args.get("url") || url);
		const n = url_components.searchParams.get("n");
		const s = args.get("s");
		const sp = args.get("sp");
		if (this.data && (signature_cipher || cipher || n)) {
			const eval_args = {};
			if (signature_cipher || cipher) {
				eval_args.sig = s;
				eval_args.sp = sp;
			}
			if (n) {
				if (this_response_nsig_cache?.has(n)) {
					const nsig = this_response_nsig_cache.get(n);
					url_components.searchParams.set("n", nsig);
				} else eval_args.n = n;
			}
			if (Object.keys(eval_args).length > 0) {
				const data = { ...this.data };
				data.output = `${data.output}\n${getNsigProcessorFn(eval_args.n, eval_args.sp, eval_args.sig)}`;
				const result = await Platform.shim.eval(data, eval_args);
				if (typeof result !== "object" || result === null) throw new PlayerError("Got invalid result from player script evaluation.");
				if (typeof eval_args.sig === "string") {
					const signatureResult = result.sig;
					info(TAG$1, `Transformed signature from ${s} to ${signatureResult}.`);
					if (typeof signatureResult !== "string") throw new PlayerError("Got invalid signature from player script evaluation.");
					if (sp) url_components.searchParams.set(sp, signatureResult);
					else url_components.searchParams.set("signature", signatureResult);
				}
				if (typeof eval_args.n === "string") {
					const nResult = result.n;
					info(TAG$1, `Transformed n from ${n} to ${nResult}.`);
					if (typeof nResult !== "string") throw new PlayerError("Failed to decipher nsig");
					if (nResult.startsWith("enhanced_except_")) warn(TAG$1, `Decipher script returned an error (n=${n}):`, nResult);
					else if (this_response_nsig_cache) this_response_nsig_cache.set(n, nResult);
					url_components.searchParams.set("n", nResult);
				}
			}
		}
		if (url_components.searchParams.get("sabr") !== "1" && this.po_token) url_components.searchParams.set("pot", this.po_token);
		switch (url_components.searchParams.get("c")) {
			case "WEB":
				url_components.searchParams.set("cver", CLIENTS.WEB.VERSION);
				break;
			case "MWEB":
				url_components.searchParams.set("cver", CLIENTS.MWEB.VERSION);
				break;
			case "WEB_REMIX":
				url_components.searchParams.set("cver", CLIENTS.YTMUSIC.VERSION);
				break;
			case "WEB_KIDS":
				url_components.searchParams.set("cver", CLIENTS.WEB_KIDS.VERSION);
				break;
			case "TVHTML5":
				url_components.searchParams.set("cver", CLIENTS.TV.VERSION);
				break;
			case "TVHTML5_SIMPLY":
				url_components.searchParams.set("cver", CLIENTS.TV_SIMPLY.VERSION);
				break;
			case "TVHTML5_SIMPLY_EMBEDDED_PLAYER":
				url_components.searchParams.set("cver", CLIENTS.TV_EMBEDDED.VERSION);
				break;
			case "WEB_EMBEDDED_PLAYER": url_components.searchParams.set("cver", CLIENTS.WEB_EMBEDDED.VERSION);
		}
		info(TAG$1, `Deciphered URL: ${url_components.toString()}`);
		return url_components.toString();
	}
	static async fromCache(cache, player_id) {
		const buffer = await cache.get(player_id);
		if (!buffer) return null;
		try {
			const deserializedCache = deserialize(new Uint8Array(buffer));
			if (deserializedCache.libraryVersion !== package_default.version) {
				warn(TAG$1, `Cached player data is from a different library version (${deserializedCache.libraryVersion}). Ignoring it.`);
				return null;
			}
			return new Player(deserializedCache.playerId, deserializedCache.signatureTimestamp, deserializedCache.data);
		} catch (e) {
			error(TAG$1, "Failed to deserialize player data from cache:", e);
			return null;
		}
	}
	static async fromSource(player_id, options) {
		const player = new Player(player_id, options.signature_timestamp, options.data);
		await player.cache(options.cache);
		return player;
	}
	async cache(cache) {
		if (!cache || !this.data) return;
		const buffer = serialize({
			playerId: this.player_id,
			signatureTimestamp: this.signature_timestamp,
			libraryVersion: package_default.version,
			data: this.data
		});
		await cache.set(this.player_id, buffer);
	}
	get url() {
		return new URL(`/s/player/${this.player_id}/player_ias.vflset/en_US/base.js`, URLS.YT_BASE).toString();
	}
	static get LIBRARY_VERSION() {
		return 14;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/Session.js
var ClientType = {
	WEB: "WEB",
	MWEB: "MWEB",
	KIDS: "WEB_KIDS",
	MUSIC: "WEB_REMIX",
	IOS: "iOS",
	ANDROID: "ANDROID",
	ANDROID_VR: "ANDROID_VR",
	VISIONOS: "VISIONOS",
	ANDROID_MUSIC: "ANDROID_MUSIC",
	ANDROID_CREATOR: "ANDROID_CREATOR",
	TV: "TVHTML5",
	TV_SIMPLY: "TVHTML5_SIMPLY",
	TV_EMBEDDED: "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
	WEB_EMBEDDED: "WEB_EMBEDDED_PLAYER",
	WEB_CREATOR: "WEB_CREATOR"
};
var TAG = "Session";
/**
* Represents an InnerTube session. This holds all the data needed to make requests to YouTube.
*/
var Session = class Session extends EventEmitterLike {
	context;
	api_key;
	api_version;
	account_index;
	config_data;
	player;
	cookie;
	cache;
	po_token;
	oauth;
	http;
	logged_in;
	actions;
	user_agent;
	constructor(context, api_key, api_version, account_index, config_data, player, cookie, fetch, cache, po_token) {
		super();
		this.context = context;
		this.api_key = api_key;
		this.api_version = api_version;
		this.account_index = account_index;
		this.config_data = config_data;
		this.player = player;
		this.cookie = cookie;
		this.cache = cache;
		this.po_token = po_token;
		this.http = new HTTPClient(this, cookie, fetch);
		this.actions = new Actions(this);
		this.oauth = new OAuth2(this);
		this.logged_in = !!cookie;
		this.user_agent = context.client.userAgent;
	}
	on(type, listener) {
		super.on(type, listener);
	}
	once(type, listener) {
		super.once(type, listener);
	}
	static async create(options = {}) {
		const { context, api_key, api_version, account_index, config_data } = await Session.getSessionData(options.lang, options.location, options.account_index, options.visitor_data, options.user_agent, options.enable_safety_mode, options.generate_session_locally, options.fail_fast, options.device_category, options.client_type, options.timezone, options.fetch, options.on_behalf_of_user, options.cache, options.enable_session_cache, options.po_token, options.retrieve_innertube_config);
		return new Session(context, api_key, api_version, account_index, config_data, options.retrieve_player === false ? void 0 : await Player.create(options.cache, options.fetch, options.po_token, options.player_id), options.cookie, options.fetch, options.cache, options.po_token);
	}
	/**
	* Retrieves session data from cache.
	* @param cache - A valid cache implementation.
	* @param session_args - User provided session arguments.
	*/
	static async fromCache(cache, session_args) {
		const buffer = await cache.get("innertube_session_data");
		if (!buffer) return null;
		try {
			const session_data = deserialize(new Uint8Array(buffer));
			if (session_data.library_version !== parseInt(package_default.version.split(".", 1)[0])) {
				warn(TAG, `Cached session data is from a different library version (${session_data.library_version}). Regenerating session data.`);
				return null;
			}
			if (session_args.visitor_data) session_data.context.client.visitorData = session_args.visitor_data;
			if (session_args.lang) session_data.context.client.hl = session_args.lang;
			if (session_args.location) session_data.context.client.gl = session_args.location;
			if (session_args.on_behalf_of_user) session_data.context.user.onBehalfOfUser = session_args.on_behalf_of_user;
			if (session_args.user_agent) session_data.context.client.userAgent = session_args.user_agent;
			if (session_args.client_name) {
				const client = Object.values(CLIENTS).find((c) => c.NAME === session_args.client_name);
				if (client) {
					session_data.context.client.clientName = client.NAME;
					session_data.context.client.clientVersion = client.VERSION;
				} else warn(TAG, `Unknown client name: ${session_args.client_name}.`);
			}
			session_data.context.client.timeZone = session_args.time_zone;
			session_data.context.client.platform = session_args.device_category.toUpperCase();
			session_data.context.user.enableSafetyMode = session_args.enable_safety_mode;
			return session_data;
		} catch (error$3) {
			error(TAG, "Failed to deserialize session data from cache.", error$3);
			return null;
		}
	}
	static async getSessionData(lang = "", location = "", account_index = 0, visitor_data = "", user_agent = getRandomUserAgent("desktop"), enable_safety_mode = false, generate_session_locally = false, fail_fast = false, device_category = "desktop", client_name = ClientType.WEB, tz = Intl.DateTimeFormat().resolvedOptions().timeZone, fetch = Platform.shim.fetch, on_behalf_of_user, cache, enable_session_cache = true, po_token, retrieve_innertube_config = true) {
		const session_args = {
			lang,
			location,
			time_zone: tz,
			user_agent,
			device_category,
			client_name,
			enable_safety_mode,
			visitor_data,
			on_behalf_of_user,
			po_token
		};
		let session_data;
		if (cache && enable_session_cache) {
			const cached_session_data = await this.fromCache(cache, session_args);
			if (cached_session_data) {
				info(TAG, "Found session data in cache.");
				session_data = cached_session_data;
			}
		}
		if (!session_data) {
			info(TAG, "Generating session data.");
			let api_key = CLIENTS.WEB.API_KEY;
			let api_version = CLIENTS.WEB.API_VERSION;
			let context_data = {
				hl: lang || "en",
				gl: location || "US",
				remote_host: "",
				user_agent,
				visitor_data: visitor_data || encodeVisitorData(generateRandomString(11), Math.floor(Date.now() / 1e3)),
				client_name,
				client_version: Object.values(CLIENTS).find((v) => v.NAME === client_name)?.VERSION ?? CLIENTS.WEB.VERSION,
				device_category: device_category.toUpperCase(),
				os_name: "Windows",
				os_version: "10.0",
				time_zone: tz,
				browser_name: "Chrome",
				browser_version: "125.0.0.0",
				device_make: "",
				device_model: "",
				enable_safety_mode
			};
			if (!generate_session_locally) try {
				const sw_session_data = await this.#getSessionData(session_args, fetch);
				api_key = sw_session_data.api_key;
				api_version = sw_session_data.api_version;
				context_data = sw_session_data.context_data;
			} catch (error$1) {
				if (fail_fast) throw error$1;
				error(TAG, "Failed to retrieve session data from server. Session data generated locally will be used instead.", error$1);
			}
			if (on_behalf_of_user) context_data.on_behalf_of_user = on_behalf_of_user;
			session_data = {
				api_key,
				api_version,
				context: this.#buildContext(context_data)
			};
			if (retrieve_innertube_config) try {
				info(TAG, "Retrieving InnerTube config data.");
				const config_headers = {
					"Accept-Language": lang,
					"Accept": "*/*",
					"Referer": URLS.YT_BASE,
					"X-Goog-Visitor-Id": context_data.visitor_data,
					"X-Origin": URLS.YT_BASE,
					"X-Youtube-Client-Version": context_data.client_version
				};
				if (Platform.shim.server) {
					config_headers["User-Agent"] = user_agent;
					config_headers["Origin"] = URLS.YT_BASE;
				}
				const configJson = await (await fetch(`${URLS.API.PRODUCTION_1}v1/config?prettyPrint=false`, {
					headers: config_headers,
					method: "POST",
					body: JSON.stringify({ context: session_data.context })
				})).json();
				const coldConfigData = configJson.responseContext?.globalConfigGroup?.rawColdConfigGroup?.configData;
				const coldHashData = configJson.responseContext?.globalConfigGroup?.coldHashData;
				const hotHashData = configJson.responseContext?.globalConfigGroup?.hotHashData;
				session_data.config_data = configJson.configData;
				session_data.context.client.configInfo = {
					...session_data.context.client.configInfo,
					coldConfigData,
					coldHashData,
					hotHashData
				};
			} catch (error$2) {
				error(TAG, "Failed to retrieve config data.", error$2);
			}
			if (enable_session_cache) await this.#storeSession(session_data, cache);
		}
		debug(TAG, "Session data:", session_data);
		return {
			...session_data,
			account_index
		};
	}
	static async #storeSession(session_data, cache) {
		if (!cache) return;
		info(TAG, "Compressing and caching session data.");
		const buffer = serialize({
			...session_data,
			library_version: parseInt(package_default.version.split(".", 1)[0])
		});
		await cache.set("innertube_session_data", buffer);
	}
	static async #getSessionData(options, fetch = Platform.shim.fetch) {
		let visitor_id = generateRandomString(11);
		if (options.visitor_data) visitor_id = this.#getVisitorID(options.visitor_data);
		const res = await fetch(new URL("/sw.js_data", URLS.YT_BASE), { headers: {
			"Accept-Language": options.lang || "en-US",
			"User-Agent": options.user_agent,
			"Accept": "*/*",
			"Referer": `${URLS.YT_BASE}/sw.js`,
			"Cookie": `PREF=tz=${options.time_zone.replace("/", ".")};VISITOR_INFO1_LIVE=${visitor_id};`
		} });
		if (!res.ok) throw new SessionError(`Failed to retrieve session data: ${res.status}`);
		const text = await res.text();
		if (!text.startsWith(")]}'")) throw new SessionError("Invalid JSPB response");
		const ytcfg = JSON.parse(text.replace(/^\)\]\}'/, ""))[0][2];
		const api_version = CLIENTS.WEB.API_VERSION;
		const [[device_info], api_key] = ytcfg;
		const config_info = device_info[61];
		const app_install_data = config_info[config_info.length - 1];
		return {
			context_data: {
				hl: options.lang || device_info[0],
				gl: options.location || device_info[1],
				remote_host: device_info[3],
				visitor_data: options.visitor_data || device_info[13],
				user_agent: options.user_agent,
				client_name: options.client_name,
				client_version: options.client_name === "WEB" ? device_info[16] : Object.values(CLIENTS).find((c) => c.NAME === options.client_name)?.VERSION || device_info[16],
				os_name: device_info[17],
				os_version: device_info[18],
				time_zone: device_info[79] || options.time_zone,
				device_category: options.device_category,
				browser_name: device_info[86],
				browser_version: device_info[87],
				device_make: device_info[11],
				device_model: device_info[12],
				app_install_data,
				device_experiment_id: device_info[103],
				rollout_token: device_info[107],
				enable_safety_mode: options.enable_safety_mode
			},
			api_key,
			api_version
		};
	}
	static #buildContext(args) {
		const context = {
			client: {
				hl: args.hl || "en",
				gl: args.gl || "US",
				remoteHost: args.remote_host,
				screenDensityFloat: 1,
				screenHeightPoints: 1440,
				screenPixelDensity: 1,
				screenWidthPoints: 2560,
				visitorData: args.visitor_data,
				clientName: args.client_name,
				clientVersion: args.client_version,
				osName: args.os_name,
				osVersion: args.os_version,
				userAgent: args.user_agent,
				platform: args.device_category.toUpperCase(),
				clientFormFactor: "UNKNOWN_FORM_FACTOR",
				userInterfaceTheme: "USER_INTERFACE_THEME_LIGHT",
				timeZone: args.time_zone,
				originalUrl: URLS.YT_BASE,
				deviceMake: args.device_make,
				deviceModel: args.device_model,
				browserName: args.browser_name,
				browserVersion: args.browser_version,
				utcOffsetMinutes: -Math.floor((/* @__PURE__ */ new Date()).getTimezoneOffset()),
				memoryTotalKbytes: "8000000",
				rolloutToken: args.rollout_token,
				deviceExperimentId: args.device_experiment_id,
				mainAppWebInfo: {
					graftUrl: URLS.YT_BASE,
					pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
					webDisplayMode: "WEB_DISPLAY_MODE_BROWSER",
					isWebNativeShareAvailable: true
				}
			},
			user: {
				enableSafetyMode: args.enable_safety_mode,
				lockedSafetyMode: false
			},
			request: {
				useSsl: true,
				internalExperimentFlags: []
			}
		};
		if (args.app_install_data) context.client.configInfo = { appInstallData: args.app_install_data };
		if (args.on_behalf_of_user) context.user.onBehalfOfUser = args.on_behalf_of_user;
		return context;
	}
	static #getVisitorID(visitor_data) {
		return decodeVisitorData(visitor_data).id;
	}
	async signIn(credentials) {
		return new Promise(async (resolve, reject) => {
			const error_handler = (err) => reject(err);
			this.once("auth-error", error_handler);
			this.once("auth", () => {
				this.off("auth-error", error_handler);
				this.logged_in = true;
				resolve();
			});
			try {
				await this.oauth.init(credentials);
			} catch (err) {
				reject(err);
			}
		});
	}
	/**
	* Signs out of the current account and revokes the credentials.
	*/
	async signOut() {
		if (!this.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const response = await this.oauth.revokeCredentials();
		this.logged_in = false;
		return response;
	}
	get client_version() {
		return this.context.client.clientVersion;
	}
	get client_name() {
		return this.context.client.clientName;
	}
	get lang() {
		return this.context.client.hl;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/clients/Kids.js
var Kids = class {
	#session;
	constructor(session) {
		this.#session = session;
	}
	async search(query) {
		const response = await new NavigationEndpoint({ searchEndpoint: { query } }).call(this.#session.actions, { client: "YTKIDS" });
		return new Search(this.#session.actions, response);
	}
	async getInfo(video_id, options) {
		const payload = { videoId: video_id };
		const watch_endpoint = new NavigationEndpoint({ watchEndpoint: payload });
		const watch_next_endpoint = new NavigationEndpoint({ watchNextEndpoint: payload });
		const session = this.#session;
		const extra_payload = {
			playbackContext: { contentPlaybackContext: {
				vis: 0,
				splay: false,
				lactMilliseconds: "-1",
				signatureTimestamp: session.player?.signature_timestamp
			} },
			client: "YTKIDS"
		};
		if (options?.po_token) extra_payload.serviceIntegrityDimensions = { poToken: options.po_token };
		else if (session.po_token) extra_payload.serviceIntegrityDimensions = { poToken: session.po_token };
		const watch_response = watch_endpoint.call(session.actions, extra_payload);
		const watch_next_response = watch_next_endpoint.call(session.actions, { client: "YTKIDS" });
		const response = await Promise.all([watch_response, watch_next_response]);
		const cpn = generateRandomString(16);
		return new VideoInfo(response, session.actions, cpn);
	}
	async getChannel(channel_id) {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: channel_id } }).call(this.#session.actions, { client: "YTKIDS" });
		return new Channel(this.#session.actions, response);
	}
	async getHomeFeed() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "FEkids_home" } }).call(this.#session.actions, { client: "YTKIDS" });
		return new HomeFeed(this.#session.actions, response);
	}
	/**
	* Retrieves the list of supervised accounts that the signed-in user has
	* access to, and blocks the given channel for each of them.
	* @param channel_id - The channel id to block.
	* @returns A list of API responses.
	*/
	async blockChannel(channel_id) {
		const session = this.#session;
		if (!session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const kids = parseResponse({
			contents: (await new NavigationEndpoint({ getKidsBlocklistPickerCommand: { blockedForKidsContent: { external_channel_id: channel_id } } }).call(session.actions, { client: "YTKIDS" })).data.command.confirmDialogEndpoint.content,
			engagementPanels: []
		}).contents_memo?.getType(KidsBlocklistPickerItem);
		if (!kids) throw new InnertubeError("Could not find any kids profiles or supervised accounts.");
		const responses = [];
		for (const kid of kids) if (!kid.block_button?.is_toggled) {
			kid.setActions(session.actions);
			responses.push(await kid.blockChannel());
		}
		return responses;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/clients/Music.js
var Music = class {
	#session;
	#actions;
	constructor(session) {
		this.#session = session;
		this.#actions = session.actions;
	}
	/**
	* Retrieves track info. Passing a list item of type MusicTwoRowItem automatically starts a radio.
	* @param target - Video id or a list item.
	* @param options - Options for fetching video info.
	*/
	getInfo(target, options) {
		if (target instanceof MusicTwoRowItem) return this.#fetchInfoFromEndpoint(target.endpoint, options);
		else if (target instanceof MusicResponsiveListItem) return this.#fetchInfoFromEndpoint(target.overlay?.content?.endpoint ?? target.endpoint, options);
		else if (target instanceof NavigationEndpoint) return this.#fetchInfoFromEndpoint(target, options);
		return this.#fetchInfoFromVideoId(target, options);
	}
	async #fetchInfoFromVideoId(video_id, options) {
		const payload = {
			videoId: video_id,
			racyCheckOk: true,
			contentCheckOk: true
		};
		const watch_endpoint = new NavigationEndpoint({ watchEndpoint: payload });
		const watch_next_endpoint = new NavigationEndpoint({ watchNextEndpoint: payload });
		const extra_payload = {
			playbackContext: { contentPlaybackContext: {
				vis: 0,
				splay: false,
				lactMilliseconds: "-1",
				signatureTimestamp: this.#session.player?.signature_timestamp
			} },
			client: "YTMUSIC"
		};
		if (options?.po_token) extra_payload.serviceIntegrityDimensions = { poToken: options.po_token };
		else if (this.#session.po_token) extra_payload.serviceIntegrityDimensions = { poToken: this.#session.po_token };
		const watch_response = watch_endpoint.call(this.#actions, extra_payload);
		const watch_next_response = watch_next_endpoint.call(this.#actions, { client: "YTMUSIC" });
		const response = await Promise.all([watch_response, watch_next_response]);
		const cpn = generateRandomString(16);
		return new TrackInfo(response, this.#actions, cpn);
	}
	async #fetchInfoFromEndpoint(endpoint, options) {
		if (!endpoint) throw new Error("This item does not have an endpoint.");
		const extra_payload = {
			playbackContext: { contentPlaybackContext: {
				vis: 0,
				splay: false,
				lactMilliseconds: "-1",
				signatureTimestamp: this.#session.player?.signature_timestamp
			} },
			client: "YTMUSIC"
		};
		if (options?.po_token) extra_payload.serviceIntegrityDimensions = { poToken: options.po_token };
		else if (this.#session.po_token) extra_payload.serviceIntegrityDimensions = { poToken: this.#session.po_token };
		const player_response = endpoint.call(this.#actions, extra_payload);
		const next_response = endpoint.call(this.#actions, {
			client: "YTMUSIC",
			enablePersistentPlaylistPanel: true,
			override_endpoint: "/next"
		});
		const cpn = generateRandomString(16);
		return new TrackInfo(await Promise.all([player_response, next_response]), this.#actions, cpn);
	}
	async search(query, filters = {}) {
		throwIfMissing({ query });
		let params;
		if (filters.type && filters.type !== "all") {
			const writer = SearchFilter$1.encode({ filters: { musicSearchType: { [filters.type]: true } } });
			params = encodeURIComponent(u8ToBase64(writer.finish()));
		}
		return new Search$1(await new NavigationEndpoint({ searchEndpoint: {
			query,
			params
		} }).call(this.#actions, { client: "YTMUSIC" }), this.#actions, Reflect.has(filters, "type") && filters.type !== "all");
	}
	async getHomeFeed() {
		return new HomeFeed$1(await new NavigationEndpoint({ browseEndpoint: { browseId: "FEmusic_home" } }).call(this.#actions, { client: "YTMUSIC" }), this.#actions);
	}
	async getExplore() {
		return new Explore(await new NavigationEndpoint({ browseEndpoint: { browseId: "FEmusic_explore" } }).call(this.#actions, { client: "YTMUSIC" }));
	}
	async getLibrary() {
		return new Library(await new NavigationEndpoint({ browseEndpoint: { browseId: "FEmusic_library_landing" } }).call(this.#actions, { client: "YTMUSIC" }), this.#actions);
	}
	async getArtist(artist_id) {
		if (!artist_id || !artist_id.startsWith("UC") && !artist_id.startsWith("FEmusic_library_privately_owned_artist")) throw new InnertubeError("Invalid artist id", artist_id);
		return new Artist(await new NavigationEndpoint({ browseEndpoint: { browseId: artist_id } }).call(this.#actions, { client: "YTMUSIC" }), this.#actions);
	}
	async getAlbum(album_id) {
		if (!album_id || !album_id.startsWith("MPR") && !album_id.startsWith("FEmusic_library_privately_owned_release")) throw new InnertubeError("Invalid album id", album_id);
		return new Album(await new NavigationEndpoint({ browseEndpoint: { browseId: album_id } }).call(this.#actions, { client: "YTMUSIC" }));
	}
	async getPlaylist(playlist_id) {
		if (!playlist_id.startsWith("VL")) playlist_id = `VL${playlist_id}`;
		return new Playlist(await new NavigationEndpoint({ browseEndpoint: { browseId: playlist_id } }).call(this.#actions, { client: "YTMUSIC" }), this.#actions);
	}
	async getUpNext(video_id, automix = true) {
		throwIfMissing({ video_id });
		const tab = ((await new NavigationEndpoint({ watchNextEndpoint: { videoId: video_id } }).call(this.#actions, {
			client: "YTMUSIC",
			parse: true
		})).contents_memo?.getType(Tab))?.[0];
		if (!tab) throw new InnertubeError("Could not find target tab.");
		const music_queue = tab.content?.as(MusicQueue);
		if (!music_queue || !music_queue.content) throw new InnertubeError("Music queue was empty, the given id is probably invalid.", music_queue);
		const playlist_panel = music_queue.content.as(PlaylistPanel);
		if (!playlist_panel.playlist_id && automix) {
			const automix_preview_video = playlist_panel.contents.firstOfType(AutomixPreviewVideo);
			if (!automix_preview_video) throw new InnertubeError("Automix item not found");
			const page = await automix_preview_video.playlist_video?.endpoint.call(this.#actions, {
				videoId: video_id,
				client: "YTMUSIC",
				parse: true
			});
			if (!page || !page.contents_memo) throw new InnertubeError("Could not fetch automix");
			return page.contents_memo.getType(PlaylistPanel)[0];
		}
		return playlist_panel;
	}
	async getRelated(video_id) {
		throwIfMissing({ video_id });
		const tab = ((await new NavigationEndpoint({ watchNextEndpoint: { videoId: video_id } }).call(this.#actions, {
			client: "YTMUSIC",
			parse: true
		})).contents_memo?.getType(Tab))?.find((tab) => tab.endpoint.payload.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === "MUSIC_PAGE_TYPE_TRACK_RELATED");
		if (!tab) throw new InnertubeError("Could not find target tab.");
		const page = await tab.endpoint.call(this.#actions, {
			client: "YTMUSIC",
			parse: true
		});
		if (!page.contents) throw new InnertubeError("Unexpected response", page);
		return page.contents.item().as(SectionList, Message);
	}
	async getLyrics(video_id) {
		throwIfMissing({ video_id });
		const tab = ((await new NavigationEndpoint({ watchNextEndpoint: { videoId: video_id } }).call(this.#actions, {
			client: "YTMUSIC",
			parse: true
		})).contents_memo?.getType(Tab))?.find((tab) => tab.endpoint.payload.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === "MUSIC_PAGE_TYPE_TRACK_LYRICS");
		if (!tab) throw new InnertubeError("Could not find target tab.");
		const page = await tab.endpoint.call(this.#actions, {
			client: "YTMUSIC",
			parse: true
		});
		if (!page.contents) throw new InnertubeError("Unexpected response", page);
		if (page.contents.item().type === "Message") throw new InnertubeError(page.contents.item().as(Message).text.toString(), video_id);
		return page.contents.item().as(SectionList).contents.firstOfType(MusicDescriptionShelf);
	}
	async getRecap() {
		return new Recap(await new NavigationEndpoint({ browseEndpoint: { browseId: "FEmusic_listening_review" } }).call(this.#actions, { client: "YTMUSIC" }), this.#actions);
	}
	async getSearchSuggestions(input) {
		const response = await this.#actions.execute("/music/get_search_suggestions", {
			input,
			client: "YTMUSIC",
			parse: true
		});
		if (!response.contents_memo) return [];
		return response.contents_memo.getType(SearchSuggestionsSection);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/youtube/api/pfiinnertube/capability_info.js
function createBaseCapabilityInfo() {
	return {
		profile: void 0,
		supportedCapabilities: [],
		disabledCapabilities: [],
		snapshot: void 0
	};
}
var CapabilityInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.profile !== void 0) writer.uint32(10).string(message.profile);
		for (const v of message.supportedCapabilities) InnerTubeCapability.encode(v, writer.uint32(18).fork()).join();
		for (const v of message.disabledCapabilities) InnerTubeCapability.encode(v, writer.uint32(26).fork()).join();
		if (message.snapshot !== void 0) writer.uint32(42).string(message.snapshot);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseCapabilityInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.profile = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.supportedCapabilities.push(InnerTubeCapability.decode(reader, reader.uint32()));
					continue;
				case 3:
					if (tag !== 26) break;
					message.disabledCapabilities.push(InnerTubeCapability.decode(reader, reader.uint32()));
					continue;
				case 5:
					if (tag !== 42) break;
					message.snapshot = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseInnerTubeCapability() {
	return {
		capability: void 0,
		features: void 0,
		experimentFlags: void 0
	};
}
var InnerTubeCapability = {
	encode(message, writer = new BinaryWriter()) {
		if (message.capability !== void 0) writer.uint32(8).uint32(message.capability);
		if (message.features !== void 0) writer.uint32(16).uint32(message.features);
		if (message.experimentFlags !== void 0) writer.uint32(50).string(message.experimentFlags);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseInnerTubeCapability();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.capability = reader.uint32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.features = reader.uint32();
					continue;
				case 6:
					if (tag !== 50) break;
					message.experimentFlags = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/youtube/api/pfiinnertube/client_info.js
function createBaseClientInfo() {
	return {
		hl: void 0,
		gl: void 0,
		remoteHost: void 0,
		deviceId: void 0,
		debugDeviceIdOverride: void 0,
		carrierGeo: void 0,
		crackedHl: void 0,
		deviceMake: void 0,
		deviceModel: void 0,
		visitorData: void 0,
		userAgent: void 0,
		clientName: void 0,
		clientVersion: void 0,
		osName: void 0,
		osVersion: void 0,
		projectId: void 0,
		acceptLanguage: void 0,
		acceptRegion: void 0,
		originalUrl: void 0,
		rawDeviceId: void 0,
		configData: void 0,
		spacecastToken: void 0,
		internalGeo: void 0,
		screenWidthPoints: void 0,
		screenHeightPoints: void 0,
		screenWidthInches: void 0,
		screenHeightInches: void 0,
		screenPixelDensity: void 0,
		platform: void 0,
		spacecastClientInfo: void 0,
		clientFormFactor: void 0,
		forwardedFor: void 0,
		mobileDataPlanInfo: void 0,
		gmscoreVersionCode: void 0,
		webpSupport: void 0,
		cameraType: void 0,
		experimentsToken: void 0,
		windowWidthPoints: void 0,
		windowHeightPoints: void 0,
		configInfo: void 0,
		unpluggedLocationInfo: void 0,
		androidSdkVersion: void 0,
		screenDensityFloat: void 0,
		firstTimeSignInExperimentIds: void 0,
		utcOffsetMinutes: void 0,
		animatedWebpSupport: void 0,
		kidsAppInfo: void 0,
		musicAppInfo: void 0,
		tvAppInfo: void 0,
		internalGeoIp: void 0,
		unpluggedAppInfo: void 0,
		locationInfo: void 0,
		contentSizeCategory: void 0,
		fontScale: void 0,
		userInterfaceTheme: void 0,
		timeZone: void 0,
		homeGroupInfo: void 0,
		emlTemplateContext: void 0,
		coldAppBundleConfigData: void 0,
		browserName: void 0,
		browserVersion: void 0,
		locationPlayabilityToken: void 0,
		chipset: void 0,
		firmwareVersion: void 0,
		memoryTotalKbytes: void 0,
		mainAppWebInfo: void 0,
		notificationPermissionInfo: void 0,
		deviceBrand: void 0,
		glDeviceInfo: void 0
	};
}
var ClientInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.hl !== void 0) writer.uint32(10).string(message.hl);
		if (message.gl !== void 0) writer.uint32(18).string(message.gl);
		if (message.remoteHost !== void 0) writer.uint32(34).string(message.remoteHost);
		if (message.deviceId !== void 0) writer.uint32(50).string(message.deviceId);
		if (message.debugDeviceIdOverride !== void 0) writer.uint32(66).string(message.debugDeviceIdOverride);
		if (message.carrierGeo !== void 0) writer.uint32(82).string(message.carrierGeo);
		if (message.crackedHl !== void 0) writer.uint32(88).bool(message.crackedHl);
		if (message.deviceMake !== void 0) writer.uint32(98).string(message.deviceMake);
		if (message.deviceModel !== void 0) writer.uint32(106).string(message.deviceModel);
		if (message.visitorData !== void 0) writer.uint32(114).string(message.visitorData);
		if (message.userAgent !== void 0) writer.uint32(122).string(message.userAgent);
		if (message.clientName !== void 0) writer.uint32(128).int32(message.clientName);
		if (message.clientVersion !== void 0) writer.uint32(138).string(message.clientVersion);
		if (message.osName !== void 0) writer.uint32(146).string(message.osName);
		if (message.osVersion !== void 0) writer.uint32(154).string(message.osVersion);
		if (message.projectId !== void 0) writer.uint32(162).string(message.projectId);
		if (message.acceptLanguage !== void 0) writer.uint32(170).string(message.acceptLanguage);
		if (message.acceptRegion !== void 0) writer.uint32(178).string(message.acceptRegion);
		if (message.originalUrl !== void 0) writer.uint32(186).string(message.originalUrl);
		if (message.rawDeviceId !== void 0) writer.uint32(202).string(message.rawDeviceId);
		if (message.configData !== void 0) writer.uint32(218).string(message.configData);
		if (message.spacecastToken !== void 0) writer.uint32(250).string(message.spacecastToken);
		if (message.internalGeo !== void 0) writer.uint32(274).string(message.internalGeo);
		if (message.screenWidthPoints !== void 0) writer.uint32(296).int32(message.screenWidthPoints);
		if (message.screenHeightPoints !== void 0) writer.uint32(304).int32(message.screenHeightPoints);
		if (message.screenWidthInches !== void 0) writer.uint32(317).float(message.screenWidthInches);
		if (message.screenHeightInches !== void 0) writer.uint32(325).float(message.screenHeightInches);
		if (message.screenPixelDensity !== void 0) writer.uint32(328).int32(message.screenPixelDensity);
		if (message.platform !== void 0) writer.uint32(336).int32(message.platform);
		if (message.spacecastClientInfo !== void 0) ClientInfo_SpacecastClientInfo.encode(message.spacecastClientInfo, writer.uint32(362).fork()).join();
		if (message.clientFormFactor !== void 0) writer.uint32(368).int32(message.clientFormFactor);
		if (message.forwardedFor !== void 0) writer.uint32(386).string(message.forwardedFor);
		if (message.mobileDataPlanInfo !== void 0) ClientInfo_MobileDataPlanInfo.encode(message.mobileDataPlanInfo, writer.uint32(394).fork()).join();
		if (message.gmscoreVersionCode !== void 0) writer.uint32(400).int32(message.gmscoreVersionCode);
		if (message.webpSupport !== void 0) writer.uint32(408).bool(message.webpSupport);
		if (message.cameraType !== void 0) writer.uint32(416).int32(message.cameraType);
		if (message.experimentsToken !== void 0) writer.uint32(434).string(message.experimentsToken);
		if (message.windowWidthPoints !== void 0) writer.uint32(440).int32(message.windowWidthPoints);
		if (message.windowHeightPoints !== void 0) writer.uint32(448).int32(message.windowHeightPoints);
		if (message.configInfo !== void 0) ClientInfo_ConfigGroupsClientInfo.encode(message.configInfo, writer.uint32(498).fork()).join();
		if (message.unpluggedLocationInfo !== void 0) ClientInfo_UnpluggedLocationInfo.encode(message.unpluggedLocationInfo, writer.uint32(506).fork()).join();
		if (message.androidSdkVersion !== void 0) writer.uint32(512).int32(message.androidSdkVersion);
		if (message.screenDensityFloat !== void 0) writer.uint32(525).float(message.screenDensityFloat);
		if (message.firstTimeSignInExperimentIds !== void 0) writer.uint32(528).int32(message.firstTimeSignInExperimentIds);
		if (message.utcOffsetMinutes !== void 0) writer.uint32(536).int32(message.utcOffsetMinutes);
		if (message.animatedWebpSupport !== void 0) writer.uint32(544).bool(message.animatedWebpSupport);
		if (message.kidsAppInfo !== void 0) ClientInfo_KidsAppInfo.encode(message.kidsAppInfo, writer.uint32(554).fork()).join();
		if (message.musicAppInfo !== void 0) ClientInfo_MusicAppInfo.encode(message.musicAppInfo, writer.uint32(562).fork()).join();
		if (message.tvAppInfo !== void 0) ClientInfo_TvAppInfo.encode(message.tvAppInfo, writer.uint32(570).fork()).join();
		if (message.internalGeoIp !== void 0) writer.uint32(578).string(message.internalGeoIp);
		if (message.unpluggedAppInfo !== void 0) ClientInfo_UnpluggedAppInfo.encode(message.unpluggedAppInfo, writer.uint32(586).fork()).join();
		if (message.locationInfo !== void 0) ClientInfo_LocationInfo.encode(message.locationInfo, writer.uint32(594).fork()).join();
		if (message.contentSizeCategory !== void 0) writer.uint32(610).string(message.contentSizeCategory);
		if (message.fontScale !== void 0) writer.uint32(621).float(message.fontScale);
		if (message.userInterfaceTheme !== void 0) writer.uint32(624).int32(message.userInterfaceTheme);
		if (message.timeZone !== void 0) writer.uint32(642).string(message.timeZone);
		if (message.homeGroupInfo !== void 0) ClientInfo_HomeGroupInfo.encode(message.homeGroupInfo, writer.uint32(650).fork()).join();
		if (message.emlTemplateContext !== void 0) writer.uint32(674).bytes(message.emlTemplateContext);
		if (message.coldAppBundleConfigData !== void 0) writer.uint32(682).bytes(message.coldAppBundleConfigData);
		if (message.browserName !== void 0) writer.uint32(698).string(message.browserName);
		if (message.browserVersion !== void 0) writer.uint32(706).string(message.browserVersion);
		if (message.locationPlayabilityToken !== void 0) writer.uint32(714).string(message.locationPlayabilityToken);
		if (message.chipset !== void 0) writer.uint32(738).string(message.chipset);
		if (message.firmwareVersion !== void 0) writer.uint32(746).string(message.firmwareVersion);
		if (message.memoryTotalKbytes !== void 0) writer.uint32(760).int64(message.memoryTotalKbytes);
		if (message.mainAppWebInfo !== void 0) ClientInfo_MainAppWebInfo.encode(message.mainAppWebInfo, writer.uint32(770).fork()).join();
		if (message.notificationPermissionInfo !== void 0) ClientInfo_NotificationPermissionInfo.encode(message.notificationPermissionInfo, writer.uint32(778).fork()).join();
		if (message.deviceBrand !== void 0) writer.uint32(786).string(message.deviceBrand);
		if (message.glDeviceInfo !== void 0) ClientInfo_GLDeviceInfo.encode(message.glDeviceInfo, writer.uint32(818).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.hl = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.gl = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.remoteHost = reader.string();
					continue;
				case 6:
					if (tag !== 50) break;
					message.deviceId = reader.string();
					continue;
				case 8:
					if (tag !== 66) break;
					message.debugDeviceIdOverride = reader.string();
					continue;
				case 10:
					if (tag !== 82) break;
					message.carrierGeo = reader.string();
					continue;
				case 11:
					if (tag !== 88) break;
					message.crackedHl = reader.bool();
					continue;
				case 12:
					if (tag !== 98) break;
					message.deviceMake = reader.string();
					continue;
				case 13:
					if (tag !== 106) break;
					message.deviceModel = reader.string();
					continue;
				case 14:
					if (tag !== 114) break;
					message.visitorData = reader.string();
					continue;
				case 15:
					if (tag !== 122) break;
					message.userAgent = reader.string();
					continue;
				case 16:
					if (tag !== 128) break;
					message.clientName = reader.int32();
					continue;
				case 17:
					if (tag !== 138) break;
					message.clientVersion = reader.string();
					continue;
				case 18:
					if (tag !== 146) break;
					message.osName = reader.string();
					continue;
				case 19:
					if (tag !== 154) break;
					message.osVersion = reader.string();
					continue;
				case 20:
					if (tag !== 162) break;
					message.projectId = reader.string();
					continue;
				case 21:
					if (tag !== 170) break;
					message.acceptLanguage = reader.string();
					continue;
				case 22:
					if (tag !== 178) break;
					message.acceptRegion = reader.string();
					continue;
				case 23:
					if (tag !== 186) break;
					message.originalUrl = reader.string();
					continue;
				case 25:
					if (tag !== 202) break;
					message.rawDeviceId = reader.string();
					continue;
				case 27:
					if (tag !== 218) break;
					message.configData = reader.string();
					continue;
				case 31:
					if (tag !== 250) break;
					message.spacecastToken = reader.string();
					continue;
				case 34:
					if (tag !== 274) break;
					message.internalGeo = reader.string();
					continue;
				case 37:
					if (tag !== 296) break;
					message.screenWidthPoints = reader.int32();
					continue;
				case 38:
					if (tag !== 304) break;
					message.screenHeightPoints = reader.int32();
					continue;
				case 39:
					if (tag !== 317) break;
					message.screenWidthInches = reader.float();
					continue;
				case 40:
					if (tag !== 325) break;
					message.screenHeightInches = reader.float();
					continue;
				case 41:
					if (tag !== 328) break;
					message.screenPixelDensity = reader.int32();
					continue;
				case 42:
					if (tag !== 336) break;
					message.platform = reader.int32();
					continue;
				case 45:
					if (tag !== 362) break;
					message.spacecastClientInfo = ClientInfo_SpacecastClientInfo.decode(reader, reader.uint32());
					continue;
				case 46:
					if (tag !== 368) break;
					message.clientFormFactor = reader.int32();
					continue;
				case 48:
					if (tag !== 386) break;
					message.forwardedFor = reader.string();
					continue;
				case 49:
					if (tag !== 394) break;
					message.mobileDataPlanInfo = ClientInfo_MobileDataPlanInfo.decode(reader, reader.uint32());
					continue;
				case 50:
					if (tag !== 400) break;
					message.gmscoreVersionCode = reader.int32();
					continue;
				case 51:
					if (tag !== 408) break;
					message.webpSupport = reader.bool();
					continue;
				case 52:
					if (tag !== 416) break;
					message.cameraType = reader.int32();
					continue;
				case 54:
					if (tag !== 434) break;
					message.experimentsToken = reader.string();
					continue;
				case 55:
					if (tag !== 440) break;
					message.windowWidthPoints = reader.int32();
					continue;
				case 56:
					if (tag !== 448) break;
					message.windowHeightPoints = reader.int32();
					continue;
				case 62:
					if (tag !== 498) break;
					message.configInfo = ClientInfo_ConfigGroupsClientInfo.decode(reader, reader.uint32());
					continue;
				case 63:
					if (tag !== 506) break;
					message.unpluggedLocationInfo = ClientInfo_UnpluggedLocationInfo.decode(reader, reader.uint32());
					continue;
				case 64:
					if (tag !== 512) break;
					message.androidSdkVersion = reader.int32();
					continue;
				case 65:
					if (tag !== 525) break;
					message.screenDensityFloat = reader.float();
					continue;
				case 66:
					if (tag !== 528) break;
					message.firstTimeSignInExperimentIds = reader.int32();
					continue;
				case 67:
					if (tag !== 536) break;
					message.utcOffsetMinutes = reader.int32();
					continue;
				case 68:
					if (tag !== 544) break;
					message.animatedWebpSupport = reader.bool();
					continue;
				case 69:
					if (tag !== 554) break;
					message.kidsAppInfo = ClientInfo_KidsAppInfo.decode(reader, reader.uint32());
					continue;
				case 70:
					if (tag !== 562) break;
					message.musicAppInfo = ClientInfo_MusicAppInfo.decode(reader, reader.uint32());
					continue;
				case 71:
					if (tag !== 570) break;
					message.tvAppInfo = ClientInfo_TvAppInfo.decode(reader, reader.uint32());
					continue;
				case 72:
					if (tag !== 578) break;
					message.internalGeoIp = reader.string();
					continue;
				case 73:
					if (tag !== 586) break;
					message.unpluggedAppInfo = ClientInfo_UnpluggedAppInfo.decode(reader, reader.uint32());
					continue;
				case 74:
					if (tag !== 594) break;
					message.locationInfo = ClientInfo_LocationInfo.decode(reader, reader.uint32());
					continue;
				case 76:
					if (tag !== 610) break;
					message.contentSizeCategory = reader.string();
					continue;
				case 77:
					if (tag !== 621) break;
					message.fontScale = reader.float();
					continue;
				case 78:
					if (tag !== 624) break;
					message.userInterfaceTheme = reader.int32();
					continue;
				case 80:
					if (tag !== 642) break;
					message.timeZone = reader.string();
					continue;
				case 81:
					if (tag !== 650) break;
					message.homeGroupInfo = ClientInfo_HomeGroupInfo.decode(reader, reader.uint32());
					continue;
				case 84:
					if (tag !== 674) break;
					message.emlTemplateContext = reader.bytes();
					continue;
				case 85:
					if (tag !== 682) break;
					message.coldAppBundleConfigData = reader.bytes();
					continue;
				case 87:
					if (tag !== 698) break;
					message.browserName = reader.string();
					continue;
				case 88:
					if (tag !== 706) break;
					message.browserVersion = reader.string();
					continue;
				case 89:
					if (tag !== 714) break;
					message.locationPlayabilityToken = reader.string();
					continue;
				case 92:
					if (tag !== 738) break;
					message.chipset = reader.string();
					continue;
				case 93:
					if (tag !== 746) break;
					message.firmwareVersion = reader.string();
					continue;
				case 95:
					if (tag !== 760) break;
					message.memoryTotalKbytes = longToNumber$2(reader.int64());
					continue;
				case 96:
					if (tag !== 770) break;
					message.mainAppWebInfo = ClientInfo_MainAppWebInfo.decode(reader, reader.uint32());
					continue;
				case 97:
					if (tag !== 778) break;
					message.notificationPermissionInfo = ClientInfo_NotificationPermissionInfo.decode(reader, reader.uint32());
					continue;
				case 98:
					if (tag !== 786) break;
					message.deviceBrand = reader.string();
					continue;
				case 102:
					if (tag !== 818) break;
					message.glDeviceInfo = ClientInfo_GLDeviceInfo.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_MainAppWebInfo() {
	return {
		graftUrl: void 0,
		pwaInstallabilityStatus: void 0,
		webDisplayMode: void 0,
		isWebNativeShareAvailable: void 0,
		storeDigitalGoodsApiSupportStatus: void 0
	};
}
var ClientInfo_MainAppWebInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.graftUrl !== void 0) writer.uint32(10).string(message.graftUrl);
		if (message.pwaInstallabilityStatus !== void 0) writer.uint32(16).int32(message.pwaInstallabilityStatus);
		if (message.webDisplayMode !== void 0) writer.uint32(24).int32(message.webDisplayMode);
		if (message.isWebNativeShareAvailable !== void 0) writer.uint32(32).bool(message.isWebNativeShareAvailable);
		if (message.storeDigitalGoodsApiSupportStatus !== void 0) writer.uint32(40).int32(message.storeDigitalGoodsApiSupportStatus);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_MainAppWebInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.graftUrl = reader.string();
					continue;
				case 2:
					if (tag !== 16) break;
					message.pwaInstallabilityStatus = reader.int32();
					continue;
				case 3:
					if (tag !== 24) break;
					message.webDisplayMode = reader.int32();
					continue;
				case 4:
					if (tag !== 32) break;
					message.isWebNativeShareAvailable = reader.bool();
					continue;
				case 5:
					if (tag !== 40) break;
					message.storeDigitalGoodsApiSupportStatus = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_NotificationPermissionInfo() {
	return {
		notificationsSetting: void 0,
		lastDeviceOptInChangeTimeAgoSec: void 0
	};
}
var ClientInfo_NotificationPermissionInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.notificationsSetting !== void 0) writer.uint32(8).int32(message.notificationsSetting);
		if (message.lastDeviceOptInChangeTimeAgoSec !== void 0) writer.uint32(16).int64(message.lastDeviceOptInChangeTimeAgoSec);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_NotificationPermissionInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.notificationsSetting = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.lastDeviceOptInChangeTimeAgoSec = longToNumber$2(reader.int64());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_GLDeviceInfo() {
	return {
		glRenderer: void 0,
		glEsVersionMajor: void 0,
		glEsVersionMinor: void 0
	};
}
var ClientInfo_GLDeviceInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.glRenderer !== void 0) writer.uint32(10).string(message.glRenderer);
		if (message.glEsVersionMajor !== void 0) writer.uint32(16).int32(message.glEsVersionMajor);
		if (message.glEsVersionMinor !== void 0) writer.uint32(24).int32(message.glEsVersionMinor);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_GLDeviceInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.glRenderer = reader.string();
					continue;
				case 2:
					if (tag !== 16) break;
					message.glEsVersionMajor = reader.int32();
					continue;
				case 3:
					if (tag !== 24) break;
					message.glEsVersionMinor = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_SpacecastClientInfo() {
	return {
		appliances: void 0,
		interactionLevel: void 0
	};
}
var ClientInfo_SpacecastClientInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.appliances !== void 0) ClientInfo_SpacecastClientInfo_SpacecastAppliance.encode(message.appliances, writer.uint32(10).fork()).join();
		if (message.interactionLevel !== void 0) writer.uint32(16).int32(message.interactionLevel);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_SpacecastClientInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.appliances = ClientInfo_SpacecastClientInfo_SpacecastAppliance.decode(reader, reader.uint32());
					continue;
				case 2:
					if (tag !== 16) break;
					message.interactionLevel = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_SpacecastClientInfo_SpacecastAppliance() {
	return {
		contentProfileToken: void 0,
		status: void 0,
		hostname: void 0,
		active: void 0,
		deviceId: void 0
	};
}
var ClientInfo_SpacecastClientInfo_SpacecastAppliance = {
	encode(message, writer = new BinaryWriter()) {
		if (message.contentProfileToken !== void 0) writer.uint32(10).bytes(message.contentProfileToken);
		if (message.status !== void 0) writer.uint32(16).int32(message.status);
		if (message.hostname !== void 0) writer.uint32(26).string(message.hostname);
		if (message.active !== void 0) writer.uint32(32).bool(message.active);
		if (message.deviceId !== void 0) writer.uint32(42).string(message.deviceId);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_SpacecastClientInfo_SpacecastAppliance();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.contentProfileToken = reader.bytes();
					continue;
				case 2:
					if (tag !== 16) break;
					message.status = reader.int32();
					continue;
				case 3:
					if (tag !== 26) break;
					message.hostname = reader.string();
					continue;
				case 4:
					if (tag !== 32) break;
					message.active = reader.bool();
					continue;
				case 5:
					if (tag !== 42) break;
					message.deviceId = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_MobileDataPlanInfo() {
	return {
		cpid: void 0,
		serializedDataPlanStatus: void 0,
		dataSavingQualityPickerEnabled: void 0,
		mccmnc: void 0
	};
}
var ClientInfo_MobileDataPlanInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.cpid !== void 0) writer.uint32(394).string(message.cpid);
		if (message.serializedDataPlanStatus !== void 0) writer.uint32(402).string(message.serializedDataPlanStatus);
		if (message.dataSavingQualityPickerEnabled !== void 0) writer.uint32(416).bool(message.dataSavingQualityPickerEnabled);
		if (message.mccmnc !== void 0) writer.uint32(426).string(message.mccmnc);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_MobileDataPlanInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 49:
					if (tag !== 394) break;
					message.cpid = reader.string();
					continue;
				case 50:
					if (tag !== 402) break;
					message.serializedDataPlanStatus = reader.string();
					continue;
				case 52:
					if (tag !== 416) break;
					message.dataSavingQualityPickerEnabled = reader.bool();
					continue;
				case 53:
					if (tag !== 426) break;
					message.mccmnc = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_ConfigGroupsClientInfo() {
	return {
		coldConfigData: void 0,
		coldHashData: void 0,
		hotHashData: void 0,
		appInstallData: void 0
	};
}
var ClientInfo_ConfigGroupsClientInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.coldConfigData !== void 0) writer.uint32(10).string(message.coldConfigData);
		if (message.coldHashData !== void 0) writer.uint32(26).string(message.coldHashData);
		if (message.hotHashData !== void 0) writer.uint32(42).string(message.hotHashData);
		if (message.appInstallData !== void 0) writer.uint32(50).string(message.appInstallData);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_ConfigGroupsClientInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.coldConfigData = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.coldHashData = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.hotHashData = reader.string();
					continue;
				case 6:
					if (tag !== 50) break;
					message.appInstallData = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_UnpluggedLocationInfo() {
	return {
		latitudeE7: void 0,
		longitudeE7: void 0,
		localTimestampMs: void 0,
		ipAddress: void 0,
		timezone: void 0,
		prefer24HourTime: void 0,
		locationRadiusMeters: void 0,
		isInitialLoad: void 0,
		browserPermissionGranted: void 0,
		clientPermissionState: void 0,
		locationOverrideToken: void 0
	};
}
var ClientInfo_UnpluggedLocationInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.latitudeE7 !== void 0) writer.uint32(8).int32(message.latitudeE7);
		if (message.longitudeE7 !== void 0) writer.uint32(16).int32(message.longitudeE7);
		if (message.localTimestampMs !== void 0) writer.uint32(24).int64(message.localTimestampMs);
		if (message.ipAddress !== void 0) writer.uint32(34).string(message.ipAddress);
		if (message.timezone !== void 0) writer.uint32(42).string(message.timezone);
		if (message.prefer24HourTime !== void 0) writer.uint32(48).bool(message.prefer24HourTime);
		if (message.locationRadiusMeters !== void 0) writer.uint32(56).int32(message.locationRadiusMeters);
		if (message.isInitialLoad !== void 0) writer.uint32(64).bool(message.isInitialLoad);
		if (message.browserPermissionGranted !== void 0) writer.uint32(72).bool(message.browserPermissionGranted);
		if (message.clientPermissionState !== void 0) writer.uint32(80).int32(message.clientPermissionState);
		if (message.locationOverrideToken !== void 0) writer.uint32(90).string(message.locationOverrideToken);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_UnpluggedLocationInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.latitudeE7 = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.longitudeE7 = reader.int32();
					continue;
				case 3:
					if (tag !== 24) break;
					message.localTimestampMs = longToNumber$2(reader.int64());
					continue;
				case 4:
					if (tag !== 34) break;
					message.ipAddress = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.timezone = reader.string();
					continue;
				case 6:
					if (tag !== 48) break;
					message.prefer24HourTime = reader.bool();
					continue;
				case 7:
					if (tag !== 56) break;
					message.locationRadiusMeters = reader.int32();
					continue;
				case 8:
					if (tag !== 64) break;
					message.isInitialLoad = reader.bool();
					continue;
				case 9:
					if (tag !== 72) break;
					message.browserPermissionGranted = reader.bool();
					continue;
				case 10:
					if (tag !== 80) break;
					message.clientPermissionState = reader.int32();
					continue;
				case 11:
					if (tag !== 90) break;
					message.locationOverrideToken = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_KidsAppInfo() {
	return {
		contentSettings: void 0,
		parentCurationMode: void 0,
		categorySettings: void 0,
		userEducationSettings: void 0
	};
}
var ClientInfo_KidsAppInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.contentSettings !== void 0) ClientInfo_KidsAppInfo_KidsContentSettings.encode(message.contentSettings, writer.uint32(10).fork()).join();
		if (message.parentCurationMode !== void 0) writer.uint32(16).int32(message.parentCurationMode);
		if (message.categorySettings !== void 0) ClientInfo_KidsAppInfo_KidsCategorySettings.encode(message.categorySettings, writer.uint32(26).fork()).join();
		if (message.userEducationSettings !== void 0) ClientInfo_KidsAppInfo_KidsUserEducationSettings.encode(message.userEducationSettings, writer.uint32(34).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_KidsAppInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.contentSettings = ClientInfo_KidsAppInfo_KidsContentSettings.decode(reader, reader.uint32());
					continue;
				case 2:
					if (tag !== 16) break;
					message.parentCurationMode = reader.int32();
					continue;
				case 3:
					if (tag !== 26) break;
					message.categorySettings = ClientInfo_KidsAppInfo_KidsCategorySettings.decode(reader, reader.uint32());
					continue;
				case 4:
					if (tag !== 34) break;
					message.userEducationSettings = ClientInfo_KidsAppInfo_KidsUserEducationSettings.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_KidsAppInfo_KidsContentSettings() {
	return {
		kidsNoSearchMode: void 0,
		ageUpMode: void 0,
		contentDensity: void 0
	};
}
var ClientInfo_KidsAppInfo_KidsContentSettings = {
	encode(message, writer = new BinaryWriter()) {
		if (message.kidsNoSearchMode !== void 0) writer.uint32(8).int32(message.kidsNoSearchMode);
		if (message.ageUpMode !== void 0) writer.uint32(16).int32(message.ageUpMode);
		if (message.contentDensity !== void 0) writer.uint32(24).int32(message.contentDensity);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_KidsAppInfo_KidsContentSettings();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.kidsNoSearchMode = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.ageUpMode = reader.int32();
					continue;
				case 3:
					if (tag !== 24) break;
					message.contentDensity = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_KidsAppInfo_KidsCategorySettings() {
	return { enabledCategories: void 0 };
}
var ClientInfo_KidsAppInfo_KidsCategorySettings = {
	encode(message, writer = new BinaryWriter()) {
		if (message.enabledCategories !== void 0) writer.uint32(10).string(message.enabledCategories);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_KidsAppInfo_KidsCategorySettings();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.enabledCategories = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_KidsAppInfo_KidsUserEducationSettings() {
	return {
		hasSeenHomeChipBarUserEducation: void 0,
		hasSeenHomePivotBarUserEducation: void 0,
		hasSeenParentMuirUserEducation: void 0
	};
}
var ClientInfo_KidsAppInfo_KidsUserEducationSettings = {
	encode(message, writer = new BinaryWriter()) {
		if (message.hasSeenHomeChipBarUserEducation !== void 0) writer.uint32(8).bool(message.hasSeenHomeChipBarUserEducation);
		if (message.hasSeenHomePivotBarUserEducation !== void 0) writer.uint32(16).bool(message.hasSeenHomePivotBarUserEducation);
		if (message.hasSeenParentMuirUserEducation !== void 0) writer.uint32(24).bool(message.hasSeenParentMuirUserEducation);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_KidsAppInfo_KidsUserEducationSettings();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.hasSeenHomeChipBarUserEducation = reader.bool();
					continue;
				case 2:
					if (tag !== 16) break;
					message.hasSeenHomePivotBarUserEducation = reader.bool();
					continue;
				case 3:
					if (tag !== 24) break;
					message.hasSeenParentMuirUserEducation = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_MusicAppInfo() {
	return {
		playBackMode: void 0,
		musicLocationMasterSwitch: void 0,
		musicActivityMasterSwitch: void 0,
		offlineMixtapeEnabled: void 0,
		autoOfflineEnabled: void 0,
		iosBackgroundRefreshStatus: void 0,
		smartDownloadsSongLimit: void 0,
		transitionedFromMixtapeToSmartDownloads: void 0,
		pwaInstallabilityStatus: void 0,
		webDisplayMode: void 0,
		musicTier: void 0,
		storeDigitalGoodsApiSupportStatus: void 0,
		smartDownloadsTimeSinceLastOptOutSec: void 0
	};
}
var ClientInfo_MusicAppInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.playBackMode !== void 0) writer.uint32(8).int32(message.playBackMode);
		if (message.musicLocationMasterSwitch !== void 0) writer.uint32(16).int32(message.musicLocationMasterSwitch);
		if (message.musicActivityMasterSwitch !== void 0) writer.uint32(24).int32(message.musicActivityMasterSwitch);
		if (message.offlineMixtapeEnabled !== void 0) writer.uint32(32).bool(message.offlineMixtapeEnabled);
		if (message.autoOfflineEnabled !== void 0) writer.uint32(40).bool(message.autoOfflineEnabled);
		if (message.iosBackgroundRefreshStatus !== void 0) writer.uint32(48).int32(message.iosBackgroundRefreshStatus);
		if (message.smartDownloadsSongLimit !== void 0) writer.uint32(56).int32(message.smartDownloadsSongLimit);
		if (message.transitionedFromMixtapeToSmartDownloads !== void 0) writer.uint32(64).bool(message.transitionedFromMixtapeToSmartDownloads);
		if (message.pwaInstallabilityStatus !== void 0) writer.uint32(72).int32(message.pwaInstallabilityStatus);
		if (message.webDisplayMode !== void 0) writer.uint32(80).int32(message.webDisplayMode);
		if (message.musicTier !== void 0) writer.uint32(88).int32(message.musicTier);
		if (message.storeDigitalGoodsApiSupportStatus !== void 0) writer.uint32(96).int32(message.storeDigitalGoodsApiSupportStatus);
		if (message.smartDownloadsTimeSinceLastOptOutSec !== void 0) writer.uint32(104).int64(message.smartDownloadsTimeSinceLastOptOutSec);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_MusicAppInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.playBackMode = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.musicLocationMasterSwitch = reader.int32();
					continue;
				case 3:
					if (tag !== 24) break;
					message.musicActivityMasterSwitch = reader.int32();
					continue;
				case 4:
					if (tag !== 32) break;
					message.offlineMixtapeEnabled = reader.bool();
					continue;
				case 5:
					if (tag !== 40) break;
					message.autoOfflineEnabled = reader.bool();
					continue;
				case 6:
					if (tag !== 48) break;
					message.iosBackgroundRefreshStatus = reader.int32();
					continue;
				case 7:
					if (tag !== 56) break;
					message.smartDownloadsSongLimit = reader.int32();
					continue;
				case 8:
					if (tag !== 64) break;
					message.transitionedFromMixtapeToSmartDownloads = reader.bool();
					continue;
				case 9:
					if (tag !== 72) break;
					message.pwaInstallabilityStatus = reader.int32();
					continue;
				case 10:
					if (tag !== 80) break;
					message.webDisplayMode = reader.int32();
					continue;
				case 11:
					if (tag !== 88) break;
					message.musicTier = reader.int32();
					continue;
				case 12:
					if (tag !== 96) break;
					message.storeDigitalGoodsApiSupportStatus = reader.int32();
					continue;
				case 13:
					if (tag !== 104) break;
					message.smartDownloadsTimeSinceLastOptOutSec = longToNumber$2(reader.int64());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_TvAppInfo() {
	return {
		mdxImpactedSessionsServerEvents: void 0,
		enablePrivacyFilter: void 0,
		zylonLeftNav: void 0,
		certificationScope: void 0,
		livingRoomPoTokenId: void 0,
		jsEngineString: void 0,
		voiceCapability: void 0,
		systemIntegrator: void 0,
		androidBuildFingerprint: void 0,
		cobaltAppVersion: void 0,
		cobaltStarboardVersion: void 0,
		useStartPlaybackPreviewCommand: void 0,
		shouldShowPersistentSigninOnHome: void 0,
		androidPlayServicesVersion: void 0
	};
}
var ClientInfo_TvAppInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.mdxImpactedSessionsServerEvents !== void 0) writer.uint32(26).string(message.mdxImpactedSessionsServerEvents);
		if (message.enablePrivacyFilter !== void 0) writer.uint32(48).bool(message.enablePrivacyFilter);
		if (message.zylonLeftNav !== void 0) writer.uint32(56).bool(message.zylonLeftNav);
		if (message.certificationScope !== void 0) writer.uint32(74).string(message.certificationScope);
		if (message.livingRoomPoTokenId !== void 0) writer.uint32(82).string(message.livingRoomPoTokenId);
		if (message.jsEngineString !== void 0) writer.uint32(98).string(message.jsEngineString);
		if (message.voiceCapability !== void 0) ClientInfo_TvAppInfo_VoiceCapability.encode(message.voiceCapability, writer.uint32(106).fork()).join();
		if (message.systemIntegrator !== void 0) writer.uint32(114).string(message.systemIntegrator);
		if (message.androidBuildFingerprint !== void 0) writer.uint32(146).string(message.androidBuildFingerprint);
		if (message.cobaltAppVersion !== void 0) writer.uint32(154).string(message.cobaltAppVersion);
		if (message.cobaltStarboardVersion !== void 0) writer.uint32(162).string(message.cobaltStarboardVersion);
		if (message.useStartPlaybackPreviewCommand !== void 0) writer.uint32(176).bool(message.useStartPlaybackPreviewCommand);
		if (message.shouldShowPersistentSigninOnHome !== void 0) writer.uint32(184).bool(message.shouldShowPersistentSigninOnHome);
		if (message.androidPlayServicesVersion !== void 0) writer.uint32(194).string(message.androidPlayServicesVersion);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_TvAppInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 3:
					if (tag !== 26) break;
					message.mdxImpactedSessionsServerEvents = reader.string();
					continue;
				case 6:
					if (tag !== 48) break;
					message.enablePrivacyFilter = reader.bool();
					continue;
				case 7:
					if (tag !== 56) break;
					message.zylonLeftNav = reader.bool();
					continue;
				case 9:
					if (tag !== 74) break;
					message.certificationScope = reader.string();
					continue;
				case 10:
					if (tag !== 82) break;
					message.livingRoomPoTokenId = reader.string();
					continue;
				case 12:
					if (tag !== 98) break;
					message.jsEngineString = reader.string();
					continue;
				case 13:
					if (tag !== 106) break;
					message.voiceCapability = ClientInfo_TvAppInfo_VoiceCapability.decode(reader, reader.uint32());
					continue;
				case 14:
					if (tag !== 114) break;
					message.systemIntegrator = reader.string();
					continue;
				case 18:
					if (tag !== 146) break;
					message.androidBuildFingerprint = reader.string();
					continue;
				case 19:
					if (tag !== 154) break;
					message.cobaltAppVersion = reader.string();
					continue;
				case 20:
					if (tag !== 162) break;
					message.cobaltStarboardVersion = reader.string();
					continue;
				case 22:
					if (tag !== 176) break;
					message.useStartPlaybackPreviewCommand = reader.bool();
					continue;
				case 23:
					if (tag !== 184) break;
					message.shouldShowPersistentSigninOnHome = reader.bool();
					continue;
				case 24:
					if (tag !== 194) break;
					message.androidPlayServicesVersion = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_TvAppInfo_VoiceCapability() {
	return {
		hasSoftMicSupport: void 0,
		hasHardMicSupport: void 0
	};
}
var ClientInfo_TvAppInfo_VoiceCapability = {
	encode(message, writer = new BinaryWriter()) {
		if (message.hasSoftMicSupport !== void 0) writer.uint32(8).bool(message.hasSoftMicSupport);
		if (message.hasHardMicSupport !== void 0) writer.uint32(16).bool(message.hasHardMicSupport);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_TvAppInfo_VoiceCapability();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.hasSoftMicSupport = reader.bool();
					continue;
				case 2:
					if (tag !== 16) break;
					message.hasHardMicSupport = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_UnpluggedAppInfo() {
	return {
		enableFilterMode: void 0,
		iosNotificationPermission: void 0,
		forceEnableEpg3: void 0
	};
}
var ClientInfo_UnpluggedAppInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.enableFilterMode !== void 0) writer.uint32(16).bool(message.enableFilterMode);
		if (message.iosNotificationPermission !== void 0) writer.uint32(24).bool(message.iosNotificationPermission);
		if (message.forceEnableEpg3 !== void 0) writer.uint32(56).bool(message.forceEnableEpg3);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_UnpluggedAppInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 16) break;
					message.enableFilterMode = reader.bool();
					continue;
				case 3:
					if (tag !== 24) break;
					message.iosNotificationPermission = reader.bool();
					continue;
				case 7:
					if (tag !== 56) break;
					message.forceEnableEpg3 = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_LocationInfo() {
	return {
		locationInfoStatus: void 0,
		ulrStatus: void 0,
		latitudeE7: void 0,
		longitudeE7: void 0,
		horizontalAccuracyMeters: void 0,
		locationFreshnessMs: void 0,
		locationPermissionAuthorizationStatus: void 0,
		locationOverrideToken: void 0,
		forceLocationPlayabilityTokenRefresh: void 0
	};
}
var ClientInfo_LocationInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.locationInfoStatus !== void 0) writer.uint32(8).int32(message.locationInfoStatus);
		if (message.ulrStatus !== void 0) ClientInfo_LocationInfo_UrlStatus.encode(message.ulrStatus, writer.uint32(18).fork()).join();
		if (message.latitudeE7 !== void 0) writer.uint32(26).string(message.latitudeE7);
		if (message.longitudeE7 !== void 0) writer.uint32(34).string(message.longitudeE7);
		if (message.horizontalAccuracyMeters !== void 0) writer.uint32(42).string(message.horizontalAccuracyMeters);
		if (message.locationFreshnessMs !== void 0) writer.uint32(50).string(message.locationFreshnessMs);
		if (message.locationPermissionAuthorizationStatus !== void 0) writer.uint32(56).int32(message.locationPermissionAuthorizationStatus);
		if (message.locationOverrideToken !== void 0) writer.uint32(66).string(message.locationOverrideToken);
		if (message.forceLocationPlayabilityTokenRefresh !== void 0) writer.uint32(72).bool(message.forceLocationPlayabilityTokenRefresh);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_LocationInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.locationInfoStatus = reader.int32();
					continue;
				case 2:
					if (tag !== 18) break;
					message.ulrStatus = ClientInfo_LocationInfo_UrlStatus.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 26) break;
					message.latitudeE7 = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.longitudeE7 = reader.string();
					continue;
				case 5:
					if (tag !== 42) break;
					message.horizontalAccuracyMeters = reader.string();
					continue;
				case 6:
					if (tag !== 50) break;
					message.locationFreshnessMs = reader.string();
					continue;
				case 7:
					if (tag !== 56) break;
					message.locationPermissionAuthorizationStatus = reader.int32();
					continue;
				case 8:
					if (tag !== 66) break;
					message.locationOverrideToken = reader.string();
					continue;
				case 9:
					if (tag !== 72) break;
					message.forceLocationPlayabilityTokenRefresh = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_LocationInfo_UrlStatus() {
	return {
		reportingEnabledSetting: void 0,
		historyEnabledSetting: void 0,
		isAllowed: void 0,
		isActive: void 0
	};
}
var ClientInfo_LocationInfo_UrlStatus = {
	encode(message, writer = new BinaryWriter()) {
		if (message.reportingEnabledSetting !== void 0) writer.uint32(8).int32(message.reportingEnabledSetting);
		if (message.historyEnabledSetting !== void 0) writer.uint32(16).int32(message.historyEnabledSetting);
		if (message.isAllowed !== void 0) writer.uint32(24).bool(message.isAllowed);
		if (message.isActive !== void 0) writer.uint32(32).bool(message.isActive);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_LocationInfo_UrlStatus();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.reportingEnabledSetting = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.historyEnabledSetting = reader.int32();
					continue;
				case 3:
					if (tag !== 24) break;
					message.isAllowed = reader.bool();
					continue;
				case 4:
					if (tag !== 32) break;
					message.isActive = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseClientInfo_HomeGroupInfo() {
	return {
		isPartOfGroup: void 0,
		isGroup: void 0
	};
}
var ClientInfo_HomeGroupInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.isPartOfGroup !== void 0) writer.uint32(8).bool(message.isPartOfGroup);
		if (message.isGroup !== void 0) writer.uint32(24).bool(message.isGroup);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseClientInfo_HomeGroupInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.isPartOfGroup = reader.bool();
					continue;
				case 3:
					if (tag !== 24) break;
					message.isGroup = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function longToNumber$2(int64) {
	const num = globalThis.Number(int64.toString());
	if (num > globalThis.Number.MAX_SAFE_INTEGER) throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
	if (num < globalThis.Number.MIN_SAFE_INTEGER) throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
	return num;
}
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/youtube/api/pfiinnertube/attestation_response_data.js
function createBaseAttestationResponseData() {
	return {
		challenge: void 0,
		webResponse: void 0,
		androidResponse: void 0,
		iosResponse: void 0,
		error: void 0,
		adblockReporting: void 0
	};
}
var AttestationResponseData = {
	encode(message, writer = new BinaryWriter()) {
		if (message.challenge !== void 0) writer.uint32(10).string(message.challenge);
		if (message.webResponse !== void 0) writer.uint32(18).string(message.webResponse);
		if (message.androidResponse !== void 0) writer.uint32(26).string(message.androidResponse);
		if (message.iosResponse !== void 0) writer.uint32(34).bytes(message.iosResponse);
		if (message.error !== void 0) writer.uint32(40).int32(message.error);
		if (message.adblockReporting !== void 0) AttestationResponseData_AdblockReporting.encode(message.adblockReporting, writer.uint32(50).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseAttestationResponseData();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.challenge = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.webResponse = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.androidResponse = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.iosResponse = reader.bytes();
					continue;
				case 5:
					if (tag !== 40) break;
					message.error = reader.int32();
					continue;
				case 6:
					if (tag !== 50) break;
					message.adblockReporting = AttestationResponseData_AdblockReporting.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseAttestationResponseData_AdblockReporting() {
	return {
		reportingStatus: void 0,
		broadSpectrumDetectionResult: void 0
	};
}
var AttestationResponseData_AdblockReporting = {
	encode(message, writer = new BinaryWriter()) {
		if (message.reportingStatus !== void 0) writer.uint32(8).uint64(message.reportingStatus);
		if (message.broadSpectrumDetectionResult !== void 0) writer.uint32(16).uint64(message.broadSpectrumDetectionResult);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseAttestationResponseData_AdblockReporting();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.reportingStatus = longToNumber$1(reader.uint64());
					continue;
				case 2:
					if (tag !== 16) break;
					message.broadSpectrumDetectionResult = longToNumber$1(reader.uint64());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function longToNumber$1(int64) {
	const num = globalThis.Number(int64.toString());
	if (num > globalThis.Number.MAX_SAFE_INTEGER) throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
	if (num < globalThis.Number.MIN_SAFE_INTEGER) throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
	return num;
}
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/youtube/api/pfiinnertube/request_info.js
function createBaseRequestInfo() {
	return {
		thirdPartyDigest: void 0,
		useSsl: void 0,
		returnErrorDetail: void 0,
		ifNoneMatch: void 0,
		returnLogEntry: void 0,
		isPrefetch: void 0,
		internalExperimentFlags: [],
		returnDebugData: void 0,
		innertubez: void 0,
		traceProto: void 0,
		returnLogEntryJson: void 0,
		sherlogUsername: void 0,
		reauthRequestInfo: void 0,
		sessionInfo: void 0,
		returnLogEntryProto: void 0,
		externalPrequestContext: void 0,
		attestationResponseData: void 0,
		eats: void 0,
		requestQos: void 0
	};
}
var RequestInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.thirdPartyDigest !== void 0) writer.uint32(50).string(message.thirdPartyDigest);
		if (message.useSsl !== void 0) writer.uint32(56).bool(message.useSsl);
		if (message.returnErrorDetail !== void 0) writer.uint32(72).bool(message.returnErrorDetail);
		if (message.ifNoneMatch !== void 0) writer.uint32(98).string(message.ifNoneMatch);
		if (message.returnLogEntry !== void 0) writer.uint32(104).bool(message.returnLogEntry);
		if (message.isPrefetch !== void 0) writer.uint32(112).bool(message.isPrefetch);
		for (const v of message.internalExperimentFlags) KeyValuePair.encode(v, writer.uint32(122).fork()).join();
		if (message.returnDebugData !== void 0) writer.uint32(128).bool(message.returnDebugData);
		if (message.innertubez !== void 0) writer.uint32(146).string(message.innertubez);
		if (message.traceProto !== void 0) writer.uint32(184).bool(message.traceProto);
		if (message.returnLogEntryJson !== void 0) writer.uint32(192).bool(message.returnLogEntryJson);
		if (message.sherlogUsername !== void 0) writer.uint32(202).string(message.sherlogUsername);
		if (message.reauthRequestInfo !== void 0) RequestInfo_ReauthRequestInfo.encode(message.reauthRequestInfo, writer.uint32(234).fork()).join();
		if (message.sessionInfo !== void 0) RequestInfo_SessionInfo.encode(message.sessionInfo, writer.uint32(242).fork()).join();
		if (message.returnLogEntryProto !== void 0) writer.uint32(248).bool(message.returnLogEntryProto);
		if (message.externalPrequestContext !== void 0) writer.uint32(258).string(message.externalPrequestContext);
		if (message.attestationResponseData !== void 0) AttestationResponseData.encode(message.attestationResponseData, writer.uint32(274).fork()).join();
		if (message.eats !== void 0) writer.uint32(282).bytes(message.eats);
		if (message.requestQos !== void 0) RequestInfo_RequestQoS.encode(message.requestQos, writer.uint32(290).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseRequestInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 6:
					if (tag !== 50) break;
					message.thirdPartyDigest = reader.string();
					continue;
				case 7:
					if (tag !== 56) break;
					message.useSsl = reader.bool();
					continue;
				case 9:
					if (tag !== 72) break;
					message.returnErrorDetail = reader.bool();
					continue;
				case 12:
					if (tag !== 98) break;
					message.ifNoneMatch = reader.string();
					continue;
				case 13:
					if (tag !== 104) break;
					message.returnLogEntry = reader.bool();
					continue;
				case 14:
					if (tag !== 112) break;
					message.isPrefetch = reader.bool();
					continue;
				case 15:
					if (tag !== 122) break;
					message.internalExperimentFlags.push(KeyValuePair.decode(reader, reader.uint32()));
					continue;
				case 16:
					if (tag !== 128) break;
					message.returnDebugData = reader.bool();
					continue;
				case 18:
					if (tag !== 146) break;
					message.innertubez = reader.string();
					continue;
				case 23:
					if (tag !== 184) break;
					message.traceProto = reader.bool();
					continue;
				case 24:
					if (tag !== 192) break;
					message.returnLogEntryJson = reader.bool();
					continue;
				case 25:
					if (tag !== 202) break;
					message.sherlogUsername = reader.string();
					continue;
				case 29:
					if (tag !== 234) break;
					message.reauthRequestInfo = RequestInfo_ReauthRequestInfo.decode(reader, reader.uint32());
					continue;
				case 30:
					if (tag !== 242) break;
					message.sessionInfo = RequestInfo_SessionInfo.decode(reader, reader.uint32());
					continue;
				case 31:
					if (tag !== 248) break;
					message.returnLogEntryProto = reader.bool();
					continue;
				case 32:
					if (tag !== 258) break;
					message.externalPrequestContext = reader.string();
					continue;
				case 34:
					if (tag !== 274) break;
					message.attestationResponseData = AttestationResponseData.decode(reader, reader.uint32());
					continue;
				case 35:
					if (tag !== 282) break;
					message.eats = reader.bytes();
					continue;
				case 36:
					if (tag !== 290) break;
					message.requestQos = RequestInfo_RequestQoS.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseRequestInfo_RequestQoS() {
	return { criticality: void 0 };
}
var RequestInfo_RequestQoS = {
	encode(message, writer = new BinaryWriter()) {
		if (message.criticality !== void 0) writer.uint32(8).int32(message.criticality);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseRequestInfo_RequestQoS();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.criticality = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseRequestInfo_SessionInfo() {
	return { token: void 0 };
}
var RequestInfo_SessionInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.token !== void 0) writer.uint32(10).string(message.token);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseRequestInfo_SessionInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.token = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseRequestInfo_ReauthRequestInfo() {
	return { encodedReauthProofToken: void 0 };
}
var RequestInfo_ReauthRequestInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.encodedReauthProofToken !== void 0) writer.uint32(10).string(message.encodedReauthProofToken);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseRequestInfo_ReauthRequestInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.encodedReauthProofToken = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/youtube/api/pfiinnertube/third_party_info.js
function createBaseThirdPartyInfo() {
	return {
		developerKey: void 0,
		appName: void 0,
		appPublisher: void 0,
		embedUrl: void 0,
		appVersion: void 0,
		embeddedPlayerContext: void 0
	};
}
var ThirdPartyInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.developerKey !== void 0) writer.uint32(10).string(message.developerKey);
		if (message.appName !== void 0) writer.uint32(18).string(message.appName);
		if (message.appPublisher !== void 0) writer.uint32(26).string(message.appPublisher);
		if (message.embedUrl !== void 0) writer.uint32(34).string(message.embedUrl);
		if (message.appVersion !== void 0) writer.uint32(50).string(message.appVersion);
		if (message.embeddedPlayerContext !== void 0) ThirdPartyInfo_EmbeddedPlayerContext.encode(message.embeddedPlayerContext, writer.uint32(58).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseThirdPartyInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.developerKey = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.appName = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.appPublisher = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.embedUrl = reader.string();
					continue;
				case 6:
					if (tag !== 50) break;
					message.appVersion = reader.string();
					continue;
				case 7:
					if (tag !== 58) break;
					message.embeddedPlayerContext = ThirdPartyInfo_EmbeddedPlayerContext.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseThirdPartyInfo_EmbeddedPlayerContext() {
	return {
		ancestorOrigins: void 0,
		embeddedPlayerEncryptedContext: void 0,
		ancestorOriginsSupported: void 0
	};
}
var ThirdPartyInfo_EmbeddedPlayerContext = {
	encode(message, writer = new BinaryWriter()) {
		if (message.ancestorOrigins !== void 0) writer.uint32(10).string(message.ancestorOrigins);
		if (message.embeddedPlayerEncryptedContext !== void 0) writer.uint32(18).string(message.embeddedPlayerEncryptedContext);
		if (message.ancestorOriginsSupported !== void 0) writer.uint32(24).bool(message.ancestorOriginsSupported);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseThirdPartyInfo_EmbeddedPlayerContext();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.ancestorOrigins = reader.string();
					continue;
				case 2:
					if (tag !== 18) break;
					message.embeddedPlayerEncryptedContext = reader.string();
					continue;
				case 3:
					if (tag !== 24) break;
					message.ancestorOriginsSupported = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/youtube/api/pfiinnertube/user_info.js
function createBaseUserInfo() {
	return {
		onBehalfOfUser: void 0,
		enableSafetyMode: void 0,
		credentialTransferTokens: [],
		delegatePurchases: void 0,
		kidsParent: void 0,
		isIncognito: void 0,
		lockedSafetyMode: void 0,
		delegationContext: void 0,
		serializedDelegationContext: void 0
	};
}
var UserInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.onBehalfOfUser !== void 0) writer.uint32(26).string(message.onBehalfOfUser);
		if (message.enableSafetyMode !== void 0) writer.uint32(56).bool(message.enableSafetyMode);
		for (const v of message.credentialTransferTokens) UserInfo_CredentialTransferToken.encode(v, writer.uint32(98).fork()).join();
		if (message.delegatePurchases !== void 0) UserInfo_DelegatePurchases.encode(message.delegatePurchases, writer.uint32(106).fork()).join();
		if (message.kidsParent !== void 0) UserInfo_KidsParent.encode(message.kidsParent, writer.uint32(114).fork()).join();
		if (message.isIncognito !== void 0) writer.uint32(120).bool(message.isIncognito);
		if (message.lockedSafetyMode !== void 0) writer.uint32(128).bool(message.lockedSafetyMode);
		if (message.delegationContext !== void 0) UserInfo_DelegationContext.encode(message.delegationContext, writer.uint32(138).fork()).join();
		if (message.serializedDelegationContext !== void 0) writer.uint32(146).string(message.serializedDelegationContext);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseUserInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 3:
					if (tag !== 26) break;
					message.onBehalfOfUser = reader.string();
					continue;
				case 7:
					if (tag !== 56) break;
					message.enableSafetyMode = reader.bool();
					continue;
				case 12:
					if (tag !== 98) break;
					message.credentialTransferTokens.push(UserInfo_CredentialTransferToken.decode(reader, reader.uint32()));
					continue;
				case 13:
					if (tag !== 106) break;
					message.delegatePurchases = UserInfo_DelegatePurchases.decode(reader, reader.uint32());
					continue;
				case 14:
					if (tag !== 114) break;
					message.kidsParent = UserInfo_KidsParent.decode(reader, reader.uint32());
					continue;
				case 15:
					if (tag !== 120) break;
					message.isIncognito = reader.bool();
					continue;
				case 16:
					if (tag !== 128) break;
					message.lockedSafetyMode = reader.bool();
					continue;
				case 17:
					if (tag !== 138) break;
					message.delegationContext = UserInfo_DelegationContext.decode(reader, reader.uint32());
					continue;
				case 18:
					if (tag !== 146) break;
					message.serializedDelegationContext = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseUserInfo_KidsParent() {
	return {};
}
var UserInfo_KidsParent = {
	encode(_, writer = new BinaryWriter()) {
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseUserInfo_KidsParent();
		while (reader.pos < end) {
			const tag = reader.uint32();
			tag >>> 3;
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseUserInfo_DelegatePurchases() {
	return {};
}
var UserInfo_DelegatePurchases = {
	encode(_, writer = new BinaryWriter()) {
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseUserInfo_DelegatePurchases();
		while (reader.pos < end) {
			const tag = reader.uint32();
			tag >>> 3;
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseUserInfo_DelegationContext() {
	return {};
}
var UserInfo_DelegationContext = {
	encode(_, writer = new BinaryWriter()) {
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseUserInfo_DelegationContext();
		while (reader.pos < end) {
			const tag = reader.uint32();
			tag >>> 3;
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseUserInfo_CredentialTransferToken() {
	return {};
}
var UserInfo_CredentialTransferToken = {
	encode(_, writer = new BinaryWriter()) {
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseUserInfo_CredentialTransferToken();
		while (reader.pos < end) {
			const tag = reader.uint32();
			tag >>> 3;
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/youtube/api/pfiinnertube/innertube_context.js
function createBaseInnerTubeContext() {
	return {
		client: void 0,
		user: void 0,
		capabilities: void 0,
		request: void 0,
		clickTracking: void 0,
		thirdParty: void 0,
		remoteClient: void 0,
		adSignalsInfo: void 0,
		experimentalData: void 0,
		clientScreenNonce: void 0,
		activePlayers: []
	};
}
var InnerTubeContext = {
	encode(message, writer = new BinaryWriter()) {
		if (message.client !== void 0) ClientInfo.encode(message.client, writer.uint32(10).fork()).join();
		if (message.user !== void 0) UserInfo.encode(message.user, writer.uint32(26).fork()).join();
		if (message.capabilities !== void 0) CapabilityInfo.encode(message.capabilities, writer.uint32(34).fork()).join();
		if (message.request !== void 0) RequestInfo.encode(message.request, writer.uint32(42).fork()).join();
		if (message.clickTracking !== void 0) InnerTubeContext_ClickTrackingInfo.encode(message.clickTracking, writer.uint32(50).fork()).join();
		if (message.thirdParty !== void 0) ThirdPartyInfo.encode(message.thirdParty, writer.uint32(58).fork()).join();
		if (message.remoteClient !== void 0) ClientInfo.encode(message.remoteClient, writer.uint32(66).fork()).join();
		if (message.adSignalsInfo !== void 0) InnerTubeContext_AdSignalsInfo.encode(message.adSignalsInfo, writer.uint32(74).fork()).join();
		if (message.experimentalData !== void 0) InnerTubeContext_ExperimentalData.encode(message.experimentalData, writer.uint32(82).fork()).join();
		if (message.clientScreenNonce !== void 0) writer.uint32(90).string(message.clientScreenNonce);
		for (const v of message.activePlayers) InnerTubeContext_ActivePlayerInfo.encode(v, writer.uint32(98).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseInnerTubeContext();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.client = ClientInfo.decode(reader, reader.uint32());
					continue;
				case 3:
					if (tag !== 26) break;
					message.user = UserInfo.decode(reader, reader.uint32());
					continue;
				case 4:
					if (tag !== 34) break;
					message.capabilities = CapabilityInfo.decode(reader, reader.uint32());
					continue;
				case 5:
					if (tag !== 42) break;
					message.request = RequestInfo.decode(reader, reader.uint32());
					continue;
				case 6:
					if (tag !== 50) break;
					message.clickTracking = InnerTubeContext_ClickTrackingInfo.decode(reader, reader.uint32());
					continue;
				case 7:
					if (tag !== 58) break;
					message.thirdParty = ThirdPartyInfo.decode(reader, reader.uint32());
					continue;
				case 8:
					if (tag !== 66) break;
					message.remoteClient = ClientInfo.decode(reader, reader.uint32());
					continue;
				case 9:
					if (tag !== 74) break;
					message.adSignalsInfo = InnerTubeContext_AdSignalsInfo.decode(reader, reader.uint32());
					continue;
				case 10:
					if (tag !== 82) break;
					message.experimentalData = InnerTubeContext_ExperimentalData.decode(reader, reader.uint32());
					continue;
				case 11:
					if (tag !== 90) break;
					message.clientScreenNonce = reader.string();
					continue;
				case 12:
					if (tag !== 98) break;
					message.activePlayers.push(InnerTubeContext_ActivePlayerInfo.decode(reader, reader.uint32()));
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseInnerTubeContext_ExperimentalData() {
	return { params: [] };
}
var InnerTubeContext_ExperimentalData = {
	encode(message, writer = new BinaryWriter()) {
		for (const v of message.params) KeyValuePair.encode(v, writer.uint32(10).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseInnerTubeContext_ExperimentalData();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.params.push(KeyValuePair.decode(reader, reader.uint32()));
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseInnerTubeContext_ActivePlayerInfo() {
	return { playerContextParams: void 0 };
}
var InnerTubeContext_ActivePlayerInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.playerContextParams !== void 0) writer.uint32(10).bytes(message.playerContextParams);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseInnerTubeContext_ActivePlayerInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.playerContextParams = reader.bytes();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseInnerTubeContext_ClickTrackingInfo() {
	return { clickTrackingParams: void 0 };
}
var InnerTubeContext_ClickTrackingInfo = {
	encode(message, writer = new BinaryWriter()) {
		if (message.clickTrackingParams !== void 0) writer.uint32(18).bytes(message.clickTrackingParams);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseInnerTubeContext_ClickTrackingInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 2:
					if (tag !== 18) break;
					message.clickTrackingParams = reader.bytes();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseInnerTubeContext_AdSignalsInfo() {
	return {
		params: [],
		bid: void 0,
		mutsuId: void 0,
		consentBumpState: void 0,
		advertisingId: void 0,
		limitAdTracking: void 0,
		attributionOsSupportedVersion: void 0
	};
}
var InnerTubeContext_AdSignalsInfo = {
	encode(message, writer = new BinaryWriter()) {
		for (const v of message.params) KeyValuePair.encode(v, writer.uint32(10).fork()).join();
		if (message.bid !== void 0) writer.uint32(18).string(message.bid);
		if (message.mutsuId !== void 0) writer.uint32(26).string(message.mutsuId);
		if (message.consentBumpState !== void 0) writer.uint32(34).string(message.consentBumpState);
		if (message.advertisingId !== void 0) writer.uint32(58).string(message.advertisingId);
		if (message.limitAdTracking !== void 0) writer.uint32(72).bool(message.limitAdTracking);
		if (message.attributionOsSupportedVersion !== void 0) writer.uint32(82).string(message.attributionOsSupportedVersion);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseInnerTubeContext_AdSignalsInfo();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.params.push(KeyValuePair.decode(reader, reader.uint32()));
					continue;
				case 2:
					if (tag !== 18) break;
					message.bid = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.mutsuId = reader.string();
					continue;
				case 4:
					if (tag !== 34) break;
					message.consentBumpState = reader.string();
					continue;
				case 7:
					if (tag !== 58) break;
					message.advertisingId = reader.string();
					continue;
				case 9:
					if (tag !== 72) break;
					message.limitAdTracking = reader.bool();
					continue;
				case 10:
					if (tag !== 82) break;
					message.attributionOsSupportedVersion = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/protos/generated/youtube/api/pfiinnertube/metadata_update_request.js
function createBaseMetadataUpdateRequest() {
	return {
		context: void 0,
		encryptedVideoId: void 0,
		title: void 0,
		description: void 0,
		privacy: void 0,
		tags: void 0,
		category: void 0,
		license: void 0,
		ageRestriction: void 0,
		videoStill: void 0,
		madeForKids: void 0,
		racy: void 0
	};
}
var MetadataUpdateRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.context !== void 0) InnerTubeContext.encode(message.context, writer.uint32(10).fork()).join();
		if (message.encryptedVideoId !== void 0) writer.uint32(18).string(message.encryptedVideoId);
		if (message.title !== void 0) MetadataUpdateRequest_MdeTitleUpdateRequest.encode(message.title, writer.uint32(26).fork()).join();
		if (message.description !== void 0) MetadataUpdateRequest_MdeDescriptionUpdateRequest.encode(message.description, writer.uint32(34).fork()).join();
		if (message.privacy !== void 0) MetadataUpdateRequest_MdePrivacyUpdateRequest.encode(message.privacy, writer.uint32(42).fork()).join();
		if (message.tags !== void 0) MetadataUpdateRequest_MdeTagsUpdateRequest.encode(message.tags, writer.uint32(50).fork()).join();
		if (message.category !== void 0) MetadataUpdateRequest_MdeCategoryUpdateRequest.encode(message.category, writer.uint32(58).fork()).join();
		if (message.license !== void 0) MetadataUpdateRequest_MdeLicenseUpdateRequest.encode(message.license, writer.uint32(66).fork()).join();
		if (message.ageRestriction !== void 0) MetadataUpdateRequest_MdeAgeRestrictionUpdateRequest.encode(message.ageRestriction, writer.uint32(90).fork()).join();
		if (message.videoStill !== void 0) MetadataUpdateRequest_MdeVideoStillRequestParams.encode(message.videoStill, writer.uint32(162).fork()).join();
		if (message.madeForKids !== void 0) MetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams.encode(message.madeForKids, writer.uint32(546).fork()).join();
		if (message.racy !== void 0) MetadataUpdateRequest_MdeRacyRequestParams.encode(message.racy, writer.uint32(554).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.context = InnerTubeContext.decode(reader, reader.uint32());
					continue;
				case 2:
					if (tag !== 18) break;
					message.encryptedVideoId = reader.string();
					continue;
				case 3:
					if (tag !== 26) break;
					message.title = MetadataUpdateRequest_MdeTitleUpdateRequest.decode(reader, reader.uint32());
					continue;
				case 4:
					if (tag !== 34) break;
					message.description = MetadataUpdateRequest_MdeDescriptionUpdateRequest.decode(reader, reader.uint32());
					continue;
				case 5:
					if (tag !== 42) break;
					message.privacy = MetadataUpdateRequest_MdePrivacyUpdateRequest.decode(reader, reader.uint32());
					continue;
				case 6:
					if (tag !== 50) break;
					message.tags = MetadataUpdateRequest_MdeTagsUpdateRequest.decode(reader, reader.uint32());
					continue;
				case 7:
					if (tag !== 58) break;
					message.category = MetadataUpdateRequest_MdeCategoryUpdateRequest.decode(reader, reader.uint32());
					continue;
				case 8:
					if (tag !== 66) break;
					message.license = MetadataUpdateRequest_MdeLicenseUpdateRequest.decode(reader, reader.uint32());
					continue;
				case 11:
					if (tag !== 90) break;
					message.ageRestriction = MetadataUpdateRequest_MdeAgeRestrictionUpdateRequest.decode(reader, reader.uint32());
					continue;
				case 20:
					if (tag !== 162) break;
					message.videoStill = MetadataUpdateRequest_MdeVideoStillRequestParams.decode(reader, reader.uint32());
					continue;
				case 68:
					if (tag !== 546) break;
					message.madeForKids = MetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams.decode(reader, reader.uint32());
					continue;
				case 69:
					if (tag !== 554) break;
					message.racy = MetadataUpdateRequest_MdeRacyRequestParams.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeTitleUpdateRequest() {
	return { newTitle: void 0 };
}
var MetadataUpdateRequest_MdeTitleUpdateRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.newTitle !== void 0) writer.uint32(10).string(message.newTitle);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeTitleUpdateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.newTitle = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeDescriptionUpdateRequest() {
	return { newDescription: void 0 };
}
var MetadataUpdateRequest_MdeDescriptionUpdateRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.newDescription !== void 0) writer.uint32(10).string(message.newDescription);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeDescriptionUpdateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.newDescription = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdePrivacyUpdateRequest() {
	return {
		newPrivacy: void 0,
		clearPrivacyDraft: void 0
	};
}
var MetadataUpdateRequest_MdePrivacyUpdateRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.newPrivacy !== void 0) writer.uint32(8).int32(message.newPrivacy);
		if (message.clearPrivacyDraft !== void 0) writer.uint32(16).bool(message.clearPrivacyDraft);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdePrivacyUpdateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.newPrivacy = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.clearPrivacyDraft = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeTagsUpdateRequest() {
	return { newTags: [] };
}
var MetadataUpdateRequest_MdeTagsUpdateRequest = {
	encode(message, writer = new BinaryWriter()) {
		for (const v of message.newTags) writer.uint32(10).string(v);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeTagsUpdateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.newTags.push(reader.string());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeCategoryUpdateRequest() {
	return { newCategoryId: void 0 };
}
var MetadataUpdateRequest_MdeCategoryUpdateRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.newCategoryId !== void 0) writer.uint32(8).int32(message.newCategoryId);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeCategoryUpdateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.newCategoryId = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeLicenseUpdateRequest() {
	return { newLicenseId: void 0 };
}
var MetadataUpdateRequest_MdeLicenseUpdateRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.newLicenseId !== void 0) writer.uint32(10).string(message.newLicenseId);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeLicenseUpdateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.newLicenseId = reader.string();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams() {
	return {
		operation: void 0,
		newMfk: void 0
	};
}
var MetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.operation !== void 0) writer.uint32(8).int32(message.operation);
		if (message.newMfk !== void 0) writer.uint32(16).int32(message.newMfk);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeMadeForKidsUpdateRequestParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.operation = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.newMfk = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeRacyRequestParams() {
	return {
		operation: void 0,
		newRacy: void 0
	};
}
var MetadataUpdateRequest_MdeRacyRequestParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.operation !== void 0) writer.uint32(8).int32(message.operation);
		if (message.newRacy !== void 0) writer.uint32(16).int32(message.newRacy);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeRacyRequestParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.operation = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.newRacy = reader.int32();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeAgeRestrictionUpdateRequest() {
	return { newIsAgeRestricted: void 0 };
}
var MetadataUpdateRequest_MdeAgeRestrictionUpdateRequest = {
	encode(message, writer = new BinaryWriter()) {
		if (message.newIsAgeRestricted !== void 0) writer.uint32(8).bool(message.newIsAgeRestricted);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeAgeRestrictionUpdateRequest();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.newIsAgeRestricted = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeVideoStillRequestParams() {
	return {
		operation: void 0,
		newStillId: void 0,
		image: void 0,
		testImage: void 0,
		experimentImage: []
	};
}
var MetadataUpdateRequest_MdeVideoStillRequestParams = {
	encode(message, writer = new BinaryWriter()) {
		if (message.operation !== void 0) writer.uint32(8).int32(message.operation);
		if (message.newStillId !== void 0) writer.uint32(16).int32(message.newStillId);
		if (message.image !== void 0) MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage.encode(message.image, writer.uint32(26).fork()).join();
		if (message.testImage !== void 0) MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage.encode(message.testImage, writer.uint32(34).fork()).join();
		for (const v of message.experimentImage) MetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData.encode(v, writer.uint32(50).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeVideoStillRequestParams();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 8) break;
					message.operation = reader.int32();
					continue;
				case 2:
					if (tag !== 16) break;
					message.newStillId = reader.int32();
					continue;
				case 3:
					if (tag !== 26) break;
					message.image = MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage.decode(reader, reader.uint32());
					continue;
				case 4:
					if (tag !== 34) break;
					message.testImage = MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage.decode(reader, reader.uint32());
					continue;
				case 6:
					if (tag !== 50) break;
					message.experimentImage.push(MetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData.decode(reader, reader.uint32()));
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData() {
	return { image: void 0 };
}
var MetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData = {
	encode(message, writer = new BinaryWriter()) {
		if (message.image !== void 0) MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage.encode(message.image, writer.uint32(10).fork()).join();
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeVideoStillRequestParams_ThumbnailExperimentImageData();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.image = MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage.decode(reader, reader.uint32());
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function createBaseMetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage() {
	return {
		rawBytes: void 0,
		dataUri: void 0,
		frameTimestampUs: void 0,
		isVertical: void 0
	};
}
var MetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage = {
	encode(message, writer = new BinaryWriter()) {
		if (message.rawBytes !== void 0) writer.uint32(10).bytes(message.rawBytes);
		if (message.dataUri !== void 0) writer.uint32(18).string(message.dataUri);
		if (message.frameTimestampUs !== void 0) writer.uint32(32).int64(message.frameTimestampUs);
		if (message.isVertical !== void 0) writer.uint32(40).bool(message.isVertical);
		return writer;
	},
	decode(input, length) {
		const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
		const end = length === void 0 ? reader.len : reader.pos + length;
		const message = createBaseMetadataUpdateRequest_MdeVideoStillRequestParams_CustomThumbnailImage();
		while (reader.pos < end) {
			const tag = reader.uint32();
			switch (tag >>> 3) {
				case 1:
					if (tag !== 10) break;
					message.rawBytes = reader.bytes();
					continue;
				case 2:
					if (tag !== 18) break;
					message.dataUri = reader.string();
					continue;
				case 4:
					if (tag !== 32) break;
					message.frameTimestampUs = longToNumber(reader.int64());
					continue;
				case 5:
					if (tag !== 40) break;
					message.isVertical = reader.bool();
					continue;
			}
			if ((tag & 7) === 4 || tag === 0) break;
			reader.skip(tag & 7);
		}
		return message;
	}
};
function longToNumber(int64) {
	const num = globalThis.Number(int64.toString());
	if (num > globalThis.Number.MAX_SAFE_INTEGER) throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
	if (num < globalThis.Number.MIN_SAFE_INTEGER) throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
	return num;
}
//#endregion
//#region node_modules/youtubei.js/dist/src/core/clients/Studio.js
var Studio = class {
	#session;
	constructor(session) {
		this.#session = session;
	}
	/**
	* Updates the metadata of a video.
	* @example
	* ```ts
	* const videoId = 'abcdefg';
	* const thumbnail = fs.readFileSync('./my_awesome_thumbnail.jpg');
	*
	* const response = await yt.studio.updateVideoMetadata(videoId, {
	*   tags: [ 'astronomy', 'NASA', 'APOD' ],
	*   title: 'Artemis Mission',
	*   description: 'A nicely written description...',
	*   category: 27,
	*   license: 'creative_commons',
	*   thumbnail,
	*   // ...
	* });
	* ```
	*/
	async updateVideoMetadata(video_id, metadata) {
		const session = this.#session;
		if (!session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const payload = {
			context: {
				client: {
					osName: "Android",
					clientName: parseInt(CLIENT_NAME_IDS.ANDROID),
					clientVersion: CLIENTS.ANDROID.VERSION,
					androidSdkVersion: CLIENTS.ANDROID.SDK_VERSION,
					visitorData: session.context.client.visitorData,
					osVersion: "13",
					acceptLanguage: session.context.client.hl,
					acceptRegion: session.context.client.gl,
					deviceMake: "Google",
					deviceModel: "sdk_gphone64_x86_64",
					screenHeightPoints: 840,
					screenWidthPoints: 432,
					configInfo: { appInstallData: session.context.client.configInfo?.appInstallData },
					timeZone: session.context.client.timeZone,
					chipset: "qcom;taro"
				},
				activePlayers: []
			},
			encryptedVideoId: video_id
		};
		if (metadata.title) payload.title = { newTitle: metadata.title };
		if (metadata.description) payload.description = { newDescription: metadata.description };
		if (metadata.license) payload.license = { newLicenseId: metadata.license };
		if (metadata.tags) payload.tags = { newTags: metadata.tags };
		if (metadata.thumbnail) payload.videoStill = {
			operation: 3,
			image: { rawBytes: metadata.thumbnail },
			experimentImage: []
		};
		if (Reflect.has(metadata, "category")) payload.category = { newCategoryId: metadata.category };
		if (Reflect.has(metadata, "privacy")) switch (metadata.privacy) {
			case "PUBLIC":
				payload.privacy = { newPrivacy: 1 };
				break;
			case "UNLISTED":
				payload.privacy = { newPrivacy: 2 };
				break;
			case "PRIVATE":
				payload.privacy = { newPrivacy: 3 };
				break;
			default: throw new Error("Invalid privacy setting");
		}
		if (Reflect.has(metadata, "made_for_kids")) payload.madeForKids = {
			operation: 1,
			newMfk: metadata.made_for_kids ? 1 : 2
		};
		if (Reflect.has(metadata, "age_restricted")) payload.racy = {
			operation: 1,
			newRacy: metadata.age_restricted ? 1 : 2
		};
		const writer = MetadataUpdateRequest.encode(payload);
		return await session.actions.execute("/video_manager/metadata_update", {
			protobuf: true,
			serialized_data: writer.finish()
		});
	}
	/**
	* Uploads a video to YouTube.
	* @example
	* ```ts
	* const file = fs.readFileSync('./my_awesome_video.mp4');
	* const response = await yt.studio.upload(file.buffer, { title: 'Wow!' });
	* ```
	*/
	async upload(file, metadata = {}) {
		if (!this.#session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const initial_data = await this.#getInitialUploadData();
		const upload_result = await this.#uploadVideo(initial_data.upload_url, file);
		if (upload_result.status !== "STATUS_SUCCESS") throw new InnertubeError("Could not process video.");
		return await this.#setVideoMetadata(initial_data, upload_result, metadata);
	}
	async #getInitialUploadData() {
		const frontend_upload_id = `innertube_android:${Platform.shim.uuidv4()}:0:v=3,api=1,cf=3`;
		const payload = {
			frontendUploadId: frontend_upload_id,
			deviceDisplayName: "Pixel 6 Pro",
			fileId: `goog-edited-video://generated?videoFileUri=content://media/external/video/media/${Platform.shim.uuidv4()}`,
			mp4MoovAtomRelocationStatus: "UNSUPPORTED",
			transcodeResult: "DISABLED",
			connectionType: "WIFI"
		};
		const response = await this.#session.http.fetch("/upload/youtubei", {
			baseURL: URLS.YT_UPLOAD,
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"x-goog-upload-command": "start",
				"x-goog-upload-protocol": "resumable"
			},
			body: JSON.stringify(payload)
		});
		if (!response.ok) throw new InnertubeError("Could not get initial upload data");
		return {
			frontend_upload_id,
			upload_id: response.headers.get("x-guploader-uploadid"),
			upload_url: response.headers.get("x-goog-upload-url"),
			scotty_resource_id: response.headers.get("x-goog-upload-header-scotty-resource-id"),
			chunk_granularity: response.headers.get("x-goog-upload-chunk-granularity")
		};
	}
	async #uploadVideo(upload_url, file) {
		const response = await this.#session.http.fetch_function(upload_url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"x-goog-upload-command": "upload, finalize",
				"x-goog-upload-file-name": `file-${Date.now()}`,
				"x-goog-upload-offset": "0"
			},
			body: file
		});
		if (!response.ok) throw new InnertubeError("Could not upload video");
		return await response.json();
	}
	async #setVideoMetadata(initial_data, upload_result, metadata) {
		return await this.#session.actions.execute("/upload/createvideo", {
			resourceId: { scottyResourceId: { id: upload_result.scottyResourceId } },
			frontendUploadId: initial_data.frontend_upload_id,
			initialMetadata: {
				title: { newTitle: metadata.title },
				description: {
					newDescription: metadata.description,
					shouldSegment: true
				},
				privacy: { newPrivacy: metadata.privacy || "PRIVATE" },
				draftState: { isDraft: !!metadata.is_draft }
			}
		});
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/managers/AccountManager.js
var AccountManager = class {
	#actions;
	constructor(actions) {
		this.#actions = actions;
	}
	async getInfo(all = false) {
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		if (!all && !!this.#actions.session.context.user.onBehalfOfUser) throw new InnertubeError("Boolean argument must be true when \"on_behalf_of_user\" is specified.");
		if (all) return (await new NavigationEndpoint({ getAccountsListInnertubeEndpoint: {
			requestType: "ACCOUNTS_LIST_REQUEST_TYPE_CHANNEL_SWITCHER",
			callCircumstance: "SWITCHING_USERS_FULL"
		} }).call(this.#actions, {
			client: "WEB",
			parse: true
		})).actions_memo?.getType(AccountItem) || [];
		return new AccountInfo(await new NavigationEndpoint({ getAccountsListInnertubeEndpoint: {} }).call(this.#actions, { client: "TV" }));
	}
	/**
	* Gets YouTube settings.
	*/
	async getSettings() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "SPaccount_overview" } }).call(this.#actions);
		return new Settings(this.#actions, response);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/managers/PlaylistManager.js
var PlaylistManager = class {
	#actions;
	constructor(actions) {
		this.#actions = actions;
	}
	/**
	* Creates a playlist.
	* @param title - The title of the playlist.
	* @param video_ids - An array of video IDs to add to the playlist.
	*/
	async create(title, video_ids) {
		throwIfMissing({
			title,
			video_ids
		});
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const response = await new NavigationEndpoint({ createPlaylistServiceEndpoint: {
			title,
			videoIds: video_ids
		} }).call(this.#actions);
		return {
			success: response.success,
			status_code: response.status_code,
			playlist_id: response.data.playlistId,
			data: response.data
		};
	}
	/**
	* Deletes a given playlist.
	* @param playlist_id - The playlist ID.
	*/
	async delete(playlist_id) {
		throwIfMissing({ playlist_id });
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const response = await new NavigationEndpoint({ deletePlaylistServiceEndpoint: { sourcePlaylistId: playlist_id } }).call(this.#actions);
		return {
			playlist_id,
			success: response.success,
			status_code: response.status_code,
			data: response.data
		};
	}
	/**
	* Adds a given playlist to the library of a user.
	* @param playlist_id - The playlist ID.
	*/
	async addToLibrary(playlist_id) {
		throwIfMissing({ playlist_id });
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		return await new NavigationEndpoint({ likeEndpoint: {
			status: "LIKE",
			target: playlist_id
		} }).call(this.#actions);
	}
	/**
	* Remove a given playlist to the library of a user.
	* @param playlist_id - The playlist ID.
	*/
	async removeFromLibrary(playlist_id) {
		throwIfMissing({ playlist_id });
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		return await new NavigationEndpoint({ likeEndpoint: {
			status: "INDIFFERENT",
			target: playlist_id
		} }).call(this.#actions);
	}
	/**
	* Adds videos to a given playlist.
	* @param playlist_id - The playlist ID.
	* @param video_ids - An array of video IDs to add to the playlist.
	*/
	async addVideos(playlist_id, video_ids) {
		throwIfMissing({
			playlist_id,
			video_ids
		});
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		return {
			playlist_id,
			action_result: (await new NavigationEndpoint({ playlistEditEndpoint: {
				playlistId: playlist_id,
				actions: video_ids.map((id) => ({
					action: "ACTION_ADD_VIDEO",
					addedVideoId: id
				}))
			} }).call(this.#actions)).data.actions
		};
	}
	/**
	* Removes videos from a given playlist.
	* @param playlist_id - The playlist ID.
	* @param video_ids - An array of video IDs to remove from the playlist.
	* @param use_set_video_ids - Option to remove videos using set video IDs.
	*/
	async removeVideos(playlist_id, video_ids, use_set_video_ids = false) {
		throwIfMissing({
			playlist_id,
			video_ids
		});
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const playlist = await this.#getPlaylist(playlist_id);
		if (!playlist.info.is_editable) throw new InnertubeError("This playlist cannot be edited.", playlist_id);
		const payload = {
			playlistId: playlist_id,
			actions: []
		};
		const getSetVideoIds = async (pl) => {
			const key_id = use_set_video_ids ? "set_video_id" : "id";
			pl.videos.filter((video) => video_ids.includes(video.key(key_id).string())).forEach((video) => payload.actions.push({
				action: "ACTION_REMOVE_VIDEO",
				setVideoId: video.key("set_video_id").string()
			}));
			if (payload.actions.length < video_ids.length) {
				const next = await pl.getContinuation();
				return getSetVideoIds(next);
			}
		};
		await getSetVideoIds(playlist);
		if (!payload.actions.length) throw new InnertubeError("Given video ids were not found in this playlist.", video_ids);
		return {
			playlist_id,
			action_result: (await new NavigationEndpoint({ playlistEditEndpoint: payload }).call(this.#actions)).data.actions
		};
	}
	/**
	* Moves a video to a new position within a given playlist.
	* @param playlist_id - The playlist ID.
	* @param moved_video_id - The video ID to move.
	* @param predecessor_video_id - The video ID to move the moved video before.
	*/
	async moveVideo(playlist_id, moved_video_id, predecessor_video_id) {
		throwIfMissing({
			playlist_id,
			moved_video_id,
			predecessor_video_id
		});
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const playlist = await this.#getPlaylist(playlist_id);
		if (!playlist.info.is_editable) throw new InnertubeError("This playlist cannot be edited.", playlist_id);
		const payload = {
			playlistId: playlist_id,
			actions: []
		};
		let set_video_id_0, set_video_id_1;
		const getSetVideoIds = async (pl) => {
			const video_0 = pl.videos.find((video) => moved_video_id === video.key("id").string());
			const video_1 = pl.videos.find((video) => predecessor_video_id === video.key("id").string());
			set_video_id_0 = set_video_id_0 || video_0?.key("set_video_id").string();
			set_video_id_1 = set_video_id_1 || video_1?.key("set_video_id").string();
			if (!set_video_id_0 || !set_video_id_1) {
				const next = await pl.getContinuation();
				return getSetVideoIds(next);
			}
		};
		await getSetVideoIds(playlist);
		payload.actions.push({
			action: "ACTION_MOVE_VIDEO_AFTER",
			setVideoId: set_video_id_0,
			movedSetVideoIdPredecessor: set_video_id_1
		});
		return {
			playlist_id,
			action_result: (await new NavigationEndpoint({ playlistEditEndpoint: payload }).call(this.#actions)).data.actions
		};
	}
	async #getPlaylist(playlist_id) {
		if (!playlist_id.startsWith("VL")) playlist_id = `VL${playlist_id}`;
		const browse_response = await new NavigationEndpoint({ browseEndpoint: { browseId: playlist_id } }).call(this.#actions, { parse: true });
		return new Playlist$1(this.#actions, browse_response, true);
	}
	/**
	* Sets the name for the given playlist.
	* @param playlist_id - The playlist ID.
	* @param name - The name / title to use for the playlist.
	*/
	async setName(playlist_id, name) {
		throwIfMissing({
			playlist_id,
			name
		});
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const payload = {
			playlist_id,
			actions: []
		};
		payload.actions.push({
			action: "ACTION_SET_PLAYLIST_NAME",
			playlistName: name
		});
		return {
			playlist_id,
			action_result: (await new NavigationEndpoint({ playlistEditEndpoint: payload }).call(this.#actions)).data.actions
		};
	}
	/**
	* Sets the description for the given playlist.
	* @param playlist_id - The playlist ID.
	* @param description - The description to use for the playlist.
	*/
	async setDescription(playlist_id, description) {
		throwIfMissing({
			playlist_id,
			description
		});
		if (!this.#actions.session.logged_in) throw new InnertubeError("You must be signed in to perform this operation.");
		const payload = {
			playlistId: playlist_id,
			actions: []
		};
		payload.actions.push({
			action: "ACTION_SET_PLAYLIST_DESCRIPTION",
			playlistDescription: description
		});
		return {
			playlist_id,
			action_result: (await new NavigationEndpoint({ playlistEditEndpoint: payload }).call(this.#actions)).data.actions
		};
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/core/managers/InteractionManager.js
var InteractionManager = class {
	#actions;
	constructor(actions) {
		this.#actions = actions;
	}
	/**
	* Likes a given video.
	* @param video_id - The video ID
	*/
	async like(video_id) {
		throwIfMissing({ video_id });
		if (!this.#actions.session.logged_in) throw new Error("You must be signed in to perform this operation.");
		return new NavigationEndpoint({ likeEndpoint: {
			status: "LIKE",
			target: video_id
		} }).call(this.#actions, { client: "TV" });
	}
	/**
	* Dislikes a given video.
	* @param video_id - The video ID
	*/
	async dislike(video_id) {
		throwIfMissing({ video_id });
		if (!this.#actions.session.logged_in) throw new Error("You must be signed in to perform this operation.");
		return new NavigationEndpoint({ likeEndpoint: {
			status: "DISLIKE",
			target: video_id
		} }).call(this.#actions, { client: "TV" });
	}
	/**
	* Removes a like/dislike.
	* @param video_id - The video ID
	*/
	async removeRating(video_id) {
		throwIfMissing({ video_id });
		if (!this.#actions.session.logged_in) throw new Error("You must be signed in to perform this operation.");
		return new NavigationEndpoint({ likeEndpoint: {
			status: "INDIFFERENT",
			target: video_id
		} }).call(this.#actions, { client: "TV" });
	}
	/**
	* Subscribes to the given channel.
	* @param channel_id - The channel ID
	*/
	async subscribe(channel_id) {
		throwIfMissing({ channel_id });
		if (!this.#actions.session.logged_in) throw new Error("You must be signed in to perform this operation.");
		return new NavigationEndpoint({ subscribeEndpoint: {
			channelIds: [channel_id],
			params: "EgIIAhgA"
		} }).call(this.#actions);
	}
	/**
	* Unsubscribes from the given channel.
	* @param channel_id - The channel ID
	*/
	async unsubscribe(channel_id) {
		throwIfMissing({ channel_id });
		if (!this.#actions.session.logged_in) throw new Error("You must be signed in to perform this operation.");
		return new NavigationEndpoint({ unsubscribeEndpoint: {
			channelIds: [channel_id],
			params: "CgIIAhgA"
		} }).call(this.#actions);
	}
	/**
	* Posts a comment on a given video.
	* @param video_id - The video ID
	* @param text - The comment text
	*/
	async comment(video_id, text) {
		throwIfMissing({
			video_id,
			text
		});
		if (!this.#actions.session.logged_in) throw new Error("You must be signed in to perform this operation.");
		const writer = CreateCommentParams.encode({
			videoId: video_id,
			params: { index: 0 },
			number: 7
		});
		return new NavigationEndpoint({ createCommentEndpoint: {
			commentText: text,
			createCommentParams: encodeURIComponent(u8ToBase64(writer.finish()))
		} }).call(this.#actions);
	}
	/**
	* Translates a given text using YouTube's comment translation feature.
	* @param text - The text to translate
	* @param target_language - an ISO language code
	* @param args - optional arguments
	*/
	async translate(text, target_language, args = {}) {
		throwIfMissing({
			text,
			target_language
		});
		const response = await new NavigationEndpoint({ performCommentActionEndpoint: { action: encodeCommentActionParams(22, {
			text,
			target_language,
			...args
		}) } }).call(this.#actions);
		const mutation = response.data.frameworkUpdates.entityBatchUpdate.mutations[0].payload.commentEntityPayload;
		return {
			success: response.success,
			status_code: response.status_code,
			translated_content: mutation.translatedContent.content,
			data: response.data
		};
	}
	/**
	* Changes notification preferences for a given channel.
	* Only works with channels you are subscribed to.
	* @param channel_id - The channel ID.
	* @param type - The notification type.
	*/
	async setNotificationPreferences(channel_id, type) {
		throwIfMissing({
			channel_id,
			type
		});
		if (!this.#actions.session.logged_in) throw new Error("You must be signed in to perform this operation.");
		const pref_types = {
			PERSONALIZED: 1,
			ALL: 2,
			NONE: 3
		};
		if (!Object.keys(pref_types).includes(type.toUpperCase())) throw new Error(`Invalid notification preference type: ${type}`);
		const writer = NotificationPreferences.encode({
			channelId: channel_id,
			prefId: { index: pref_types[type.toUpperCase()] },
			number0: 0,
			number1: 4
		});
		return new NavigationEndpoint({ modifyChannelNotificationPreferenceEndpoint: { params: encodeURIComponent(u8ToBase64(writer.finish())) } }).call(this.#actions);
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/Innertube.js
/**
* Provides access to various services and modules in the YouTube API.
*
* @example
* ```ts
* import { Innertube, UniversalCache } from 'youtubei.js';
* const innertube = await Innertube.create({ cache: new UniversalCache(true)});
* ```
*/
var Innertube = class Innertube {
	#session;
	constructor(session) {
		this.#session = session;
	}
	static async create(config = {}) {
		return new Innertube(await Session.create(config));
	}
	async getInfo(target, options) {
		throwIfMissing({ target });
		const payload = {
			videoId: target instanceof NavigationEndpoint ? target.payload?.videoId : target,
			playlistId: target instanceof NavigationEndpoint ? target.payload?.playlistId : void 0,
			playlistIndex: target instanceof NavigationEndpoint ? target.payload?.playlistIndex : void 0,
			params: target instanceof NavigationEndpoint ? target.payload?.params : void 0,
			racyCheckOk: true,
			contentCheckOk: true
		};
		const watch_endpoint = new NavigationEndpoint({ watchEndpoint: payload });
		const watch_next_endpoint = new NavigationEndpoint({ watchNextEndpoint: payload });
		const session = this.#session;
		const extra_payload = {
			playbackContext: { contentPlaybackContext: {
				vis: 0,
				splay: false,
				lactMilliseconds: "-1",
				signatureTimestamp: session.player?.signature_timestamp
			} },
			client: options?.client
		};
		if (options?.po_token) extra_payload.serviceIntegrityDimensions = { poToken: options.po_token };
		else if (session.po_token) extra_payload.serviceIntegrityDimensions = { poToken: session.po_token };
		const watch_response = watch_endpoint.call(session.actions, extra_payload);
		const watch_next_response = watch_next_endpoint.call(session.actions);
		const response = await Promise.all([watch_response, watch_next_response]);
		const cpn = generateRandomString(16);
		return new VideoInfo$1(response, session.actions, cpn);
	}
	async getBasicInfo(video_id, options) {
		throwIfMissing({ video_id });
		const watch_endpoint = new NavigationEndpoint({ watchEndpoint: {
			videoId: video_id,
			racyCheckOk: true,
			contentCheckOk: true
		} });
		const session = this.#session;
		const extra_payload = {
			playbackContext: { contentPlaybackContext: {
				vis: 0,
				splay: false,
				lactMilliseconds: "-1",
				signatureTimestamp: session.player?.signature_timestamp
			} },
			client: options?.client
		};
		if (options?.po_token) extra_payload.serviceIntegrityDimensions = { poToken: options.po_token };
		else if (session.po_token) extra_payload.serviceIntegrityDimensions = { poToken: session.po_token };
		const watch_response = await watch_endpoint.call(session.actions, extra_payload);
		const cpn = generateRandomString(16);
		return new VideoInfo$1([watch_response], session.actions, cpn);
	}
	async getShortsVideoInfo(video_id, client) {
		throwIfMissing({ video_id });
		const reel_watch_endpoint = new NavigationEndpoint({ reelWatchEndpoint: {
			disablePlayerResponse: false,
			params: "CAUwAg%3D%3D",
			videoId: video_id
		} });
		const actions = this.#session.actions;
		const reel_watch_response = reel_watch_endpoint.call(actions, { client });
		const writer = ReelSequence.encode({
			shortId: video_id,
			params: { number: 5 },
			feature2: 25,
			feature3: 0
		});
		const params = encodeURIComponent(u8ToBase64(writer.finish()));
		const sequence_response = actions.execute("/reel/reel_watch_sequence", { sequenceParams: params });
		const response = await Promise.all([reel_watch_response, sequence_response]);
		const cpn = generateRandomString(16);
		return new ShortFormVideoInfo([response[0]], actions, cpn, response[1]);
	}
	async search(query, filters = {}) {
		throwIfMissing({ query });
		const search_filter = {};
		search_filter.filters = {};
		if (filters.prioritize) search_filter.prioritize = SearchFilter_Prioritize[filters.prioritize.toUpperCase()];
		if (filters.upload_date) search_filter.filters.uploadDate = SearchFilter_Filters_UploadDate[filters.upload_date.toUpperCase()];
		if (filters.type) search_filter.filters.type = SearchFilter_Filters_SearchType[filters.type.toUpperCase()];
		if (filters.duration) search_filter.filters.duration = SearchFilter_Filters_Duration[filters.duration.toUpperCase()];
		if (filters.features) for (const feature of filters.features) switch (feature) {
			case "360":
				search_filter.filters.features360 = true;
				break;
			case "3d":
				search_filter.filters.features3d = true;
				break;
			case "4k":
				search_filter.filters.features4k = true;
				break;
			case "creative_commons":
				search_filter.filters.featuresCreativeCommons = true;
				break;
			case "hd":
				search_filter.filters.featuresHd = true;
				break;
			case "hdr":
				search_filter.filters.featuresHdr = true;
				break;
			case "live":
				search_filter.filters.featuresLive = true;
				break;
			case "location":
				search_filter.filters.featuresLocation = true;
				break;
			case "purchased":
				search_filter.filters.featuresPurchased = true;
				break;
			case "subtitles":
				search_filter.filters.featuresSubtitles = true;
				break;
			case "vr180": search_filter.filters.featuresVr180 = true;
		}
		const response = await new NavigationEndpoint({ searchEndpoint: {
			query,
			params: filters ? encodeURIComponent(u8ToBase64(SearchFilter$1.encode(search_filter).finish())) : void 0
		} }).call(this.#session.actions);
		return new Search$2(this.actions, response);
	}
	async getSearchSuggestions(query, previous_query) {
		const session = this.#session;
		const url = new URL(`${URLS.YT_SUGGESTIONS}/complete/search`);
		url.searchParams.set("client", "youtube");
		url.searchParams.set("gs_ri", "youtube");
		url.searchParams.set("gs_id", "0");
		url.searchParams.set("cp", "0");
		url.searchParams.set("ds", "yt");
		url.searchParams.set("sugexp", CLIENTS.WEB.SUGG_EXP_ID);
		url.searchParams.set("hl", session.context.client.hl);
		url.searchParams.set("gl", session.context.client.gl);
		url.searchParams.set("q", query);
		if (previous_query) url.searchParams.set("pq", previous_query);
		const text = await (await session.http.fetch_function(url, { headers: { "Cookie": session.cookie || "" } })).text();
		return JSON.parse(text.replace("window.google.ac.h(", "").slice(0, -1))[1].map((suggestion) => suggestion[0]);
	}
	async getComments(video_id, sort_by, comment_id) {
		throwIfMissing({ video_id });
		const token = GetCommentsSectionParams.encode({
			ctx: { videoId: video_id },
			unkParam: 6,
			params: {
				opts: {
					videoId: video_id,
					sortBy: {
						TOP_COMMENTS: 0,
						NEWEST_FIRST: 1
					}[sort_by || "TOP_COMMENTS"],
					type: 2,
					commentId: comment_id || ""
				},
				target: "comments-section"
			}
		});
		const response = await new NavigationEndpoint({ continuationCommand: {
			request: "CONTINUATION_REQUEST_TYPE_WATCH_NEXT",
			token: encodeURIComponent(u8ToBase64(token.finish()))
		} }).call(this.#session.actions);
		return new Comments(this.actions, response.data);
	}
	async getHomeFeed() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "FEwhat_to_watch" } }).call(this.#session.actions);
		return new HomeFeed$2(this.actions, response);
	}
	async getGuide() {
		return new Guide((await this.actions.execute("/guide")).data);
	}
	async getLibrary() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "FElibrary" } }).call(this.#session.actions);
		return new Library$1(this.actions, response);
	}
	async getHistory() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "FEhistory" } }).call(this.#session.actions);
		return new History(this.actions, response);
	}
	async getCourses() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "FEcourses_destination" } }).call(this.#session.actions, { parse: true });
		return new Feed(this.actions, response);
	}
	async getSubscriptionsFeed() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "FEsubscriptions" } }).call(this.#session.actions, { parse: true });
		return new Feed(this.actions, response);
	}
	async getChannelsFeed() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "FEchannels" } }).call(this.#session.actions, { parse: true });
		return new Feed(this.actions, response);
	}
	async getChannel(id) {
		throwIfMissing({ id });
		let response = await new NavigationEndpoint({ browseEndpoint: { browseId: id } }).call(this.#session.actions, { parse: true });
		if (response.on_response_received_actions?.[0]?.is(NavigateAction)) response = await response.on_response_received_actions[0].endpoint.call(this.#session.actions, { parse: true });
		return new Channel$1(this.actions, response, true);
	}
	async getNotifications() {
		const response = await this.actions.execute("/notification/get_notification_menu", { notificationsMenuRequestType: "NOTIFICATIONS_MENU_REQUEST_TYPE_INBOX" });
		return new NotificationsMenu(this.actions, response);
	}
	async getUnseenNotificationsCount() {
		const response = await this.actions.execute("/notification/get_unseen_count");
		return response.data?.unseenCount || response.data?.actions?.[0].updateNotificationsUnseenCountAction?.unseenCount || 0;
	}
	/**
	* Retrieves the user's playlists.
	*/
	async getPlaylists() {
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: "FEplaylist_aggregation" } }).call(this.#session.actions, { parse: true });
		return new Feed(this.actions, response);
	}
	async getPlaylist(id) {
		throwIfMissing({ id });
		if (!id.startsWith("VL")) id = `VL${id}`;
		const response = await new NavigationEndpoint({ browseEndpoint: { browseId: id } }).call(this.#session.actions);
		return new Playlist$1(this.actions, response);
	}
	async getHashtag(hashtag) {
		throwIfMissing({ hashtag });
		const writer = Hashtag.encode({ params: {
			hashtag,
			type: 1
		} });
		const response = await new NavigationEndpoint({ browseEndpoint: {
			browseId: "FEhashtag",
			params: encodeURIComponent(u8ToBase64(writer.finish(), true))
		} }).call(this.#session.actions);
		return new HashtagFeed(this.actions, response);
	}
	/**
	* An alternative to {@link download}.
	* Returns deciphered streaming data.
	*
	* If you wish to retrieve the video info too, have a look at {@link getBasicInfo} or {@link getInfo}.
	* @param video_id - The video id.
	* @param options - Format options.
	*/
	async getStreamingData(video_id, options = {}) {
		const format = (await this.getBasicInfo(video_id, options)).chooseFormat(options);
		format.url = await format.decipher(this.#session.player);
		return format;
	}
	/**
	* Downloads a given video. If all you need the direct download link, see {@link getStreamingData}.
	* If you wish to retrieve the video info too, have a look at {@link getBasicInfo} or {@link getInfo}.
	* @param video_id - The video id.
	* @param options - Download options.
	*/
	async download(video_id, options) {
		return (await this.getBasicInfo(video_id, options)).download(options);
	}
	/**
	* Resolves the given URL.
	*/
	async resolveURL(url) {
		const response = await this.actions.execute("/navigation/resolve_url", {
			url,
			parse: true
		});
		if (!response.endpoint) throw new InnertubeError("Failed to resolve URL. Expected a NavigationEndpoint but got undefined", response);
		return response.endpoint;
	}
	/**
	* Gets a post page given a post id and the channel id
	*/
	async getPost(post_id, channel_id) {
		throwIfMissing({
			post_id,
			channel_id
		});
		const writer = CommunityPostParams.encode({ f1: {
			ucid1: channel_id,
			postId: post_id,
			ucid2: channel_id
		} });
		const response = await new NavigationEndpoint({ browseEndpoint: {
			browseId: "FEpost_detail",
			params: encodeURIComponent(u8ToBase64(writer.finish()).replace(/\+/g, "-").replace(/\//g, "_"))
		} }).call(this.#session.actions, { parse: true });
		return new Feed(this.actions, response);
	}
	/**
	* Gets the comments of a post.
	*/
	async getPostComments(post_id, channel_id, sort_by) {
		throwIfMissing({
			post_id,
			channel_id
		});
		const writer1 = CommunityPostCommentsParam.encode({
			title: "posts",
			commentDataContainer: {
				title: "comments-section",
				commentData: {
					sortBy: {
						TOP_COMMENTS: 0,
						NEWEST_FIRST: 1
					}[sort_by || "TOP_COMMENTS"],
					f0: 2,
					f1: 0,
					channelId: channel_id,
					postId: post_id
				},
				f0: 0
			}
		});
		const writer2 = CommunityPostCommentsParamContainer.encode({ f0: {
			location: "FEcomment_post_detail_page_web_top_level",
			protoData: encodeURIComponent(u8ToBase64(writer1.finish()).replace(/\+/g, "-").replace(/\//g, "_"))
		} });
		const response = await new NavigationEndpoint({ continuationCommand: {
			request: "CONTINUATION_REQUEST_TYPE_BROWSE",
			token: encodeURIComponent(u8ToBase64(writer2.finish()))
		} }).call(this.#session.actions);
		return new Comments(this.actions, response.data);
	}
	/**
	* Fetches an attestation challenge.
	*/
	async getAttestationChallenge(engagement_type, ids) {
		const payload = { engagementType: engagement_type };
		if (ids) payload.ids = ids;
		return this.actions.execute("/att/get", {
			parse: true,
			...payload
		});
	}
	call(endpoint, args) {
		return endpoint.call(this.actions, args);
	}
	/**
	* An interface for interacting with YouTube Music.
	*/
	get music() {
		return new Music(this.#session);
	}
	/**
	* An interface for interacting with YouTube Studio.
	*/
	get studio() {
		return new Studio(this.#session);
	}
	/**
	* An interface for interacting with YouTube Kids.
	*/
	get kids() {
		return new Kids(this.#session);
	}
	/**
	* An interface for managing and retrieving account information.
	*/
	get account() {
		return new AccountManager(this.#session.actions);
	}
	/**
	* An interface for managing playlists.
	*/
	get playlist() {
		return new PlaylistManager(this.#session.actions);
	}
	/**
	* An interface for directly interacting with certain YouTube features.
	*/
	get interact() {
		return new InteractionManager(this.#session.actions);
	}
	/**
	* An internal class used to dispatch requests.
	*/
	get actions() {
		return this.#session.actions;
	}
	/**
	* The session used by this instance.
	*/
	get session() {
		return this.#session;
	}
};
//#endregion
//#region node_modules/youtubei.js/dist/src/platform/node.js
var meta_url = import.meta.url;
var __dirname__ = !meta_url ? __dirname : path.dirname(fileURLToPath(meta_url));
var Cache = class Cache {
	#persistent_directory;
	#persistent;
	constructor(persistent = false, persistent_directory) {
		this.#persistent_directory = persistent_directory || Cache.default_persistent_directory;
		this.#persistent = persistent;
	}
	static get temp_directory() {
		return `${os.tmpdir()}/youtubei.js`;
	}
	static get default_persistent_directory() {
		return path.resolve(__dirname__, "..", "..", ".cache", "youtubei.js");
	}
	get cache_dir() {
		return this.#persistent ? this.#persistent_directory : Cache.temp_directory;
	}
	async #createCache() {
		const dir = this.cache_dir;
		try {
			if (!(await fs.stat(dir)).isDirectory()) throw new Error("An unexpected file was found in place of the cache directory");
		} catch (e) {
			if (e?.code === "ENOENT") await fs.mkdir(dir, { recursive: true });
			else throw e;
		}
	}
	async get(key) {
		await this.#createCache();
		const file = path.resolve(this.cache_dir, key);
		try {
			if ((await fs.stat(file)).isFile()) return (await fs.readFile(file)).buffer;
			throw new Error("An unexpected file was found in place of the cache key");
		} catch (e) {
			if (e?.code === "ENOENT") return void 0;
			throw e;
		}
	}
	async set(key, value) {
		await this.#createCache();
		const file = path.resolve(this.cache_dir, key);
		await fs.writeFile(file, new Uint8Array(value));
	}
	async remove(key) {
		await this.#createCache();
		const file = path.resolve(this.cache_dir, key);
		try {
			await fs.unlink(file);
		} catch (e) {
			if (e?.code === "ENOENT") return;
			throw e;
		}
	}
};
Platform.load({
	runtime: "node",
	server: true,
	Cache,
	sha1Hash: async (data) => {
		return crypto.createHash("sha1").update(data).digest("hex");
	},
	uuidv4() {
		return crypto.randomUUID();
	},
	eval: evaluate,
	fetch: globalThis.fetch,
	Request: globalThis.Request,
	Response: globalThis.Response,
	Headers: globalThis.Headers,
	FormData: globalThis.FormData,
	File: globalThis.File,
	ReadableStream,
	CustomEvent
});
//#endregion
export { Platform as n, Innertube as t };
