//#region node_modules/@bufbuild/protobuf/dist/esm/wire/varint.js
/**
* Read a 64 bit varint as two JS numbers.
*
* Stores the low and high words on the reader.
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L175
*/
function varint64read() {
	const buf = this.buf;
	let pos = this.pos;
	let lo = 0;
	let hi = 0;
	for (let shift = 0; shift < 28; shift += 7) {
		const b = buf[pos++];
		lo |= (b & 127) << shift;
		if ((b & 128) == 0) {
			this.pos = pos;
			this.assertBounds();
			this.varint64Lo = lo;
			this.varint64Hi = hi;
			return;
		}
	}
	const middleByte = buf[pos++];
	lo |= (middleByte & 15) << 28;
	hi = (middleByte & 112) >> 4;
	if ((middleByte & 128) == 0) {
		this.pos = pos;
		this.assertBounds();
		this.varint64Lo = lo;
		this.varint64Hi = hi;
		return;
	}
	for (let shift = 3; shift <= 31; shift += 7) {
		const b = buf[pos++];
		hi |= (b & 127) << shift;
		if ((b & 128) == 0) {
			this.pos = pos;
			this.assertBounds();
			this.varint64Lo = lo;
			this.varint64Hi = hi;
			return;
		}
	}
	throw new Error("invalid varint");
}
var TWO_PWR_32_DBL = 4294967296;
/**
* Parse decimal string of 64 bit integer value as two JS numbers.
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
*/
function int64FromString(dec) {
	const minus = dec[0] === "-";
	if (minus) dec = dec.slice(1);
	const base = 1e6;
	let lowBits = 0;
	let highBits = 0;
	function add1e6digit(begin, end) {
		const digit1e6 = Number(dec.slice(begin, end));
		highBits *= base;
		lowBits = lowBits * base + digit1e6;
		if (lowBits >= TWO_PWR_32_DBL) {
			highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
			lowBits = lowBits % TWO_PWR_32_DBL;
		}
	}
	add1e6digit(-24, -18);
	add1e6digit(-18, -12);
	add1e6digit(-12, -6);
	add1e6digit(-6);
	return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
/**
* Losslessly converts a 64-bit signed integer in 32:32 split representation
* into a decimal string.
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
*/
function int64ToString(lo, hi) {
	let bits = newBits(lo, hi);
	const negative = bits.hi & 2147483648;
	if (negative) bits = negate(bits.lo, bits.hi);
	const result = uInt64ToString(bits.lo, bits.hi);
	return negative ? "-" + result : result;
}
/**
* Losslessly converts a 64-bit unsigned integer in 32:32 split representation
* into a decimal string.
*
* Copyright 2008 Google Inc.  All rights reserved.
*
* See https://github.com/protocolbuffers/protobuf-javascript/blob/a428c58273abad07c66071d9753bc4d1289de426/experimental/runtime/int64.js#L10
*/
function uInt64ToString(lo, hi) {
	({lo, hi} = toUnsigned(lo, hi));
	if (hi <= 2097151) return String(TWO_PWR_32_DBL * hi + lo);
	const low = lo & 16777215;
	const mid = (lo >>> 24 | hi << 8) & 16777215;
	const high = hi >> 16 & 65535;
	let digitA = low + mid * 6777216 + high * 6710656;
	let digitB = mid + high * 8147497;
	let digitC = high * 2;
	const base = 1e7;
	if (digitA >= base) {
		digitB += Math.floor(digitA / base);
		digitA %= base;
	}
	if (digitB >= base) {
		digitC += Math.floor(digitB / base);
		digitB %= base;
	}
	return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
}
function toUnsigned(lo, hi) {
	return {
		lo: lo >>> 0,
		hi: hi >>> 0
	};
}
function newBits(lo, hi) {
	return {
		lo: lo | 0,
		hi: hi | 0
	};
}
/**
* Returns two's compliment negation of input.
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Signed_32-bit_integers
*/
function negate(lowBits, highBits) {
	highBits = ~highBits;
	if (lowBits) lowBits = ~lowBits + 1;
	else highBits += 1;
	return newBits(lowBits, highBits);
}
/**
* Returns decimal representation of digit1e7 with leading zeros.
*/
var decimalFrom1e7WithLeadingZeros = (digit1e7) => {
	const partial = String(digit1e7);
	return "0000000".slice(partial.length) + partial;
};
/**
* Read an unsigned 32 bit varint.
*
* See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/buffer_decoder.js#L220
*/
function varint32read() {
	let b = this.buf[this.pos++];
	if ((b & 128) === 0) {
		this.assertBounds();
		return b;
	}
	let result = b & 127;
	b = this.buf[this.pos++];
	result |= (b & 127) << 7;
	if ((b & 128) === 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 127) << 14;
	if ((b & 128) === 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 127) << 21;
	if ((b & 128) === 0) {
		this.assertBounds();
		return result;
	}
	b = this.buf[this.pos++];
	result |= (b & 15) << 28;
	for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++) b = this.buf[this.pos++];
	if ((b & 128) !== 0) throw new Error("invalid varint");
	this.assertBounds();
	return result >>> 0;
}
//#endregion
//#region node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
/**
* Int64Support for the current environment.
*/
var protoInt64 = /*@__PURE__*/ makeInt64Support();
function makeInt64Support() {
	const dv = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
	if (typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (!!globalThis.Deno || !!globalThis.Bun || typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1")) {
		const MIN = BigInt("-9223372036854775808");
		const MAX = BigInt("9223372036854775807");
		const UMIN = BigInt("0");
		const UMAX = BigInt("18446744073709551615");
		return {
			zero: BigInt(0),
			supported: true,
			parse(value) {
				const bi = typeof value == "bigint" ? value : BigInt(value);
				if (bi > MAX || bi < MIN) throw new Error(`invalid int64: ${value}`);
				return bi;
			},
			uParse(value) {
				const bi = typeof value == "bigint" ? value : BigInt(value);
				if (bi > UMAX || bi < UMIN) throw new Error(`invalid uint64: ${value}`);
				return bi;
			},
			enc(value) {
				dv.setBigInt64(0, this.parse(value), true);
				return {
					lo: dv.getInt32(0, true),
					hi: dv.getInt32(4, true)
				};
			},
			uEnc(value) {
				dv.setBigInt64(0, this.uParse(value), true);
				return {
					lo: dv.getInt32(0, true),
					hi: dv.getInt32(4, true)
				};
			},
			dec(lo, hi) {
				dv.setInt32(0, lo, true);
				dv.setInt32(4, hi, true);
				return dv.getBigInt64(0, true);
			},
			uDec(lo, hi) {
				dv.setInt32(0, lo, true);
				dv.setInt32(4, hi, true);
				return dv.getBigUint64(0, true);
			}
		};
	}
	return {
		zero: "0",
		supported: false,
		parse(value) {
			if (typeof value != "string") value = value.toString();
			assertInt64String(value);
			return value;
		},
		uParse(value) {
			if (typeof value != "string") value = value.toString();
			assertUInt64String(value);
			return value;
		},
		enc(value) {
			if (typeof value != "string") value = value.toString();
			assertInt64String(value);
			return int64FromString(value);
		},
		uEnc(value) {
			if (typeof value != "string") value = value.toString();
			assertUInt64String(value);
			return int64FromString(value);
		},
		dec(lo, hi) {
			return int64ToString(lo, hi);
		},
		uDec(lo, hi) {
			return uInt64ToString(lo, hi);
		}
	};
}
function assertInt64String(value) {
	if (!/^-?[0-9]+$/.test(value)) throw new Error("invalid int64: " + value);
}
function assertUInt64String(value) {
	if (!/^[0-9]+$/.test(value)) throw new Error("invalid uint64: " + value);
}
//#endregion
//#region node_modules/@bufbuild/protobuf/dist/esm/wire/text-encoding.js
var te;
/**
* Protobuf-ES requires the Text Encoding API to convert UTF-8 from and to
* binary. This WHATWG API is widely available, but it is not part of the
* ECMAScript standard. This function used to be the way to supply an
* implementation on runtimes that do not provide one.
*
* It only configures the copy of the library it is imported from. To provide
* the encoding API for every copy of Protobuf-ES in an isolate, install
* `TextEncoder` (with the methods `encode` and optionally `encodeInto`) and
* `TextDecoder` (with the `fatal: true` constructor argument and the `decode`
* method) on `globalThis`.
*
* Providing `encodeUtf8Into` is optional for backwards compatibility. If it
* is omitted, we emulate it with a wrapper that calls `encodeUtf8`.
*
* Note that the Text Encoding API does not provide a way to validate UTF-8.
* Our implementation uses String.prototype.isWellFormed, and falls back
* to use encodeURIComponent().
*
* @deprecated Install `TextEncoder` and `TextDecoder` on `globalThis` instead.
*/
function configureTextEncoding(textEncoding) {
	var _a;
	te = Object.assign(Object.assign({}, textEncoding), { encodeUtf8Into: (_a = textEncoding.encodeUtf8Into) !== null && _a !== void 0 ? _a : emulateEncodeInto(textEncoding.encodeUtf8.bind(textEncoding)) });
}
function getTextEncoding() {
	if (!te) {
		const globals = globalThis;
		if (!globals.TextEncoder || !globals.TextDecoder) throw new Error("encoding API missing: install TextEncoder and TextDecoder on globalThis");
		const textEncoder = new globals.TextEncoder();
		const textDecoder = new globals.TextDecoder();
		let textDecoderStrict;
		const config = {
			encodeUtf8(text) {
				return textEncoder.encode(text);
			},
			decodeUtf8(bytes, strict) {
				if (strict) {
					if (!textDecoderStrict) textDecoderStrict = new globals.TextDecoder("utf-8", { fatal: true });
					return textDecoderStrict.decode(bytes);
				}
				return textDecoder.decode(bytes);
			},
			checkUtf8(text) {
				try {
					return true;
				} catch (_) {
					return false;
				}
			}
		};
		if (textEncoder.encodeInto) config.encodeUtf8Into = textEncoder.encodeInto.bind(textEncoder);
		const nativeStringIsWellFormed = String.prototype.isWellFormed;
		if (nativeStringIsWellFormed) config.checkUtf8 = (text) => {
			return nativeStringIsWellFormed.call(text);
		};
		configureTextEncoding(config);
	}
	return te;
}
/**
* Simplistic polyfill for encodeUtf8Into.
*
* @private
*/
function emulateEncodeInto(encodeUtf8) {
	return (text, dest) => {
		const bytes = encodeUtf8(text);
		dest.set(bytes);
		return { written: bytes.byteLength };
	};
}
//#endregion
//#region node_modules/@bufbuild/protobuf/dist/esm/wire/binary-encoding.js
/**
* Protobuf binary format wire types.
*
* A wire type provides just enough information to find the length of the
* following value.
*
* See https://developers.google.com/protocol-buffers/docs/encoding#structure
*/
var WireType;
(function(WireType) {
	/**
	* Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
	*/
	WireType[WireType["Varint"] = 0] = "Varint";
	/**
	* Used for fixed64, sfixed64, double.
	* Always 8 bytes with little-endian byte order.
	*/
	WireType[WireType["Bit64"] = 1] = "Bit64";
	/**
	* Used for string, bytes, embedded messages, packed repeated fields
	*
	* Only repeated numeric types (types which use the varint, 32-bit,
	* or 64-bit wire types) can be packed. In proto3, such fields are
	* packed by default.
	*/
	WireType[WireType["LengthDelimited"] = 2] = "LengthDelimited";
	/**
	* Start of a tag-delimited aggregate, such as a proto2 group, or a message
	* in editions with message_encoding = DELIMITED.
	*/
	WireType[WireType["StartGroup"] = 3] = "StartGroup";
	/**
	* End of a tag-delimited aggregate.
	*/
	WireType[WireType["EndGroup"] = 4] = "EndGroup";
	/**
	* Used for fixed32, sfixed32, float.
	* Always 4 bytes with little-endian byte order.
	*/
	WireType[WireType["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
var BinaryWriter = class {
	constructor(encodeUtf8) {
		/**
		* Previous fork positions (the write position at the time
		* `fork()` was called).
		*/
		this.stackPos = [];
		this.encodeUtf8Into = encodeUtf8 ? emulateEncodeInto(encodeUtf8) : getTextEncoding().encodeUtf8Into;
		this.buffer = EMPTY_BUFFER;
		this.viewCache = EMPTY_VIEW;
		this.pos = 0;
	}
	ensureCapacity(size) {
		const required = this.pos + size;
		if (required > this.buffer.length) {
			let newLen = this.buffer.length || INITIAL_SIZE;
			while (newLen < required) newLen *= 2;
			const newBuf = new Uint8Array(newLen);
			if (this.pos > 0) newBuf.set(this.buffer);
			this.buffer = newBuf;
		}
	}
	/**
	* The DataView over `buffer`, rebuilt only if the buffer has grown since it
	* was last used.
	*/
	view() {
		const bytes = this.buffer;
		const view = this.viewCache;
		if (view.byteLength === bytes.byteLength) return view;
		const newView = new DataView(bytes.buffer);
		this.viewCache = newView;
		return newView;
	}
	/**
	* Return all bytes written and reset this writer.
	*/
	finish() {
		const result = this.buffer.slice(0, this.pos);
		this.pos = 0;
		this.stackPos = [];
		return result;
	}
	/**
	* Start a new fork for length-delimited data like a message
	* or a packed repeated field.
	*
	* Must be joined later with `join()`.
	*/
	fork() {
		this.stackPos.push(this.pos);
		this.ensureCapacity(DEFAULT_LEN_PREFIX_SIZE);
		this.buffer[this.pos++] = 0;
		return this;
	}
	/**
	* Join the last fork. Write its length and bytes, then
	* return to the previous state.
	*/
	join() {
		const forkPos = this.stackPos.pop();
		if (forkPos === void 0) throw new Error("invalid state, fork stack empty");
		const len = this.pos - forkPos - DEFAULT_LEN_PREFIX_SIZE;
		const lenPrefixSize = varint32Size(len);
		if (lenPrefixSize > DEFAULT_LEN_PREFIX_SIZE) {
			this.ensureCapacity(lenPrefixSize - DEFAULT_LEN_PREFIX_SIZE);
			this.buffer.copyWithin(forkPos + lenPrefixSize, forkPos + DEFAULT_LEN_PREFIX_SIZE, this.pos);
		}
		this.pos = forkPos;
		this.uint32(len);
		this.pos += len;
		return this;
	}
	/**
	* Writes a tag (field number and wire type).
	*
	* Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
	*
	* Generated code should compute the tag ahead of time and call `uint32()`.
	*/
	tag(fieldNo, type) {
		return this.uint32((fieldNo << 3 | type) >>> 0);
	}
	/**
	* Write a chunk of raw bytes.
	*/
	raw(chunk) {
		this.ensureCapacity(chunk.length);
		this.buffer.set(chunk, this.pos);
		this.pos += chunk.length;
		return this;
	}
	/**
	* Write a `uint32` value, an unsigned 32 bit varint.
	*/
	uint32(value) {
		assertUInt32(value);
		this.ensureCapacity(5);
		if (value < 128) {
			this.buffer[this.pos++] = value;
			return this;
		}
		while (value > 127) {
			this.buffer[this.pos++] = value & 127 | 128;
			value >>>= 7;
		}
		this.buffer[this.pos++] = value;
		return this;
	}
	/**
	* Write a `int32` value, a signed 32 bit varint.
	*/
	int32(value) {
		assertInt32(value);
		if (value >= 0) return this.uint32(value);
		this.ensureCapacity(10);
		for (let i = 0; i < 9; i++) {
			this.buffer[this.pos++] = value & 127 | 128;
			value >>= 7;
		}
		this.buffer[this.pos++] = 1;
		return this;
	}
	/**
	* Write a `bool` value, a varint.
	*/
	bool(value) {
		this.ensureCapacity(1);
		this.buffer[this.pos++] = value ? 1 : 0;
		return this;
	}
	/**
	* Write a `bytes` value, length-delimited arbitrary data.
	*/
	bytes(value) {
		this.uint32(value.byteLength);
		return this.raw(value);
	}
	/**
	* Write a `string` value, length-delimited data converted to UTF-8 text.
	*/
	string(value) {
		if (typeof value !== "string") value = String(value);
		const len = value.length;
		if (len <= ASCII_MAX_LENGTH) {
			this.ensureCapacity(len + 1);
			const ascii = this.buffer;
			let pos = this.pos;
			ascii[pos++] = len;
			let i = 0;
			for (; i < len; i++) {
				const code = value.charCodeAt(i);
				if (code > 127) break;
				ascii[pos++] = code;
			}
			if (i == len) {
				this.pos = pos;
				return this;
			}
		}
		this.ensureCapacity(len * 3 + 5);
		const lenPrefixSizeGuess = varint32Size(len);
		const buf = this.buffer;
		const start = this.pos;
		const { written } = this.encodeUtf8Into(value, buf.subarray(start + lenPrefixSizeGuess));
		const lenPrefixSize = varint32Size(written);
		if (lenPrefixSize != lenPrefixSizeGuess) buf.copyWithin(start + lenPrefixSize, start + lenPrefixSizeGuess, start + lenPrefixSizeGuess + written);
		this.uint32(written);
		this.pos += written;
		return this;
	}
	/**
	* Write a `float` value, 32-bit floating point number.
	*/
	float(value) {
		assertFloat32(value);
		this.ensureCapacity(4);
		this.view().setFloat32(this.pos, value, true);
		this.pos += 4;
		return this;
	}
	/**
	* Write a `double` value, a 64-bit floating point number.
	*/
	double(value) {
		this.ensureCapacity(8);
		this.view().setFloat64(this.pos, value, true);
		this.pos += 8;
		return this;
	}
	/**
	* Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
	*/
	fixed32(value) {
		assertUInt32(value);
		this.ensureCapacity(4);
		this.view().setUint32(this.pos, value, true);
		this.pos += 4;
		return this;
	}
	/**
	* Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
	*/
	sfixed32(value) {
		assertInt32(value);
		this.ensureCapacity(4);
		this.view().setInt32(this.pos, value, true);
		this.pos += 4;
		return this;
	}
	/**
	* Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
	*/
	sint32(value) {
		assertInt32(value);
		return this.uint32((value << 1 ^ value >> 31) >>> 0);
	}
	/**
	* Write a `sfixed64` value, a signed, fixed-length 64-bit integer.
	*/
	sfixed64(value) {
		const tc = protoInt64.enc(value);
		this.ensureCapacity(8);
		const view = this.view();
		view.setInt32(this.pos, tc.lo, true);
		view.setInt32(this.pos + 4, tc.hi, true);
		this.pos += 8;
		return this;
	}
	/**
	* Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
	*/
	fixed64(value) {
		const tc = protoInt64.uEnc(value);
		this.ensureCapacity(8);
		const view = this.view();
		view.setInt32(this.pos, tc.lo, true);
		view.setInt32(this.pos + 4, tc.hi, true);
		this.pos += 8;
		return this;
	}
	/**
	* Write a `int64` value, a signed 64-bit varint.
	*/
	int64(value) {
		const tc = protoInt64.enc(value);
		return this.writeVarint64(tc.lo, tc.hi);
	}
	/**
	* Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
	*/
	sint64(value) {
		const tc = protoInt64.enc(value), sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
		return this.writeVarint64(lo, hi);
	}
	/**
	* Write a `uint64` value, an unsigned 64-bit varint.
	*/
	uint64(value) {
		const tc = protoInt64.uEnc(value);
		return this.writeVarint64(tc.lo, tc.hi);
	}
	/**
	* Write a 64-bit varint directly into the buffer. Accepts the value as
	* split low/high 32-bit words.
	*
	* Ported from varint64write() to avoid the intermediate number[] buffer.
	* See https://github.com/protocolbuffers/protobuf/blob/8a71927d74a4ce34efe2d8769fda198f52d20d12/js/experimental/runtime/kernel/writer.js#L344
	*/
	writeVarint64(lo, hi) {
		this.ensureCapacity(10);
		const buf = this.buffer;
		let pos = this.pos;
		for (let i = 0; i < 28; i = i + 7) {
			const shift = lo >>> i;
			const hasNext = !(shift >>> 7 == 0 && hi == 0);
			buf[pos++] = (hasNext ? shift | 128 : shift) & 255;
			if (!hasNext) {
				this.pos = pos;
				return this;
			}
		}
		const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
		const hasMoreBits = !(hi >> 3 == 0);
		buf[pos++] = (hasMoreBits ? splitBits | 128 : splitBits) & 255;
		if (!hasMoreBits) {
			this.pos = pos;
			return this;
		}
		for (let i = 3; i < 31; i = i + 7) {
			const shift = hi >>> i;
			const hasNext = !(shift >>> 7 == 0);
			buf[pos++] = (hasNext ? shift | 128 : shift) & 255;
			if (!hasNext) {
				this.pos = pos;
				return this;
			}
		}
		buf[pos++] = hi >>> 31 & 1;
		this.pos = pos;
		return this;
	}
};
/**
* Capacity of the buffer allocated by the first write..
*/
var INITIAL_SIZE = 128;
/**
* Bytes `fork()` reserves for the length prefix, betting that the payload will
* be under 128 bytes. `join()` fills them in, and widens them if the bet was
* wrong.
*/
var DEFAULT_LEN_PREFIX_SIZE = 1;
/**
* Shared empty buffer used as the initial value before the first write.
* Avoids allocating and zeroing `INITIAL_SIZE` bytes per BinaryWriter when a
* writer is only used for a tiny message (or not used at all).
*/
var EMPTY_BUFFER = /* @__PURE__ */ new Uint8Array(0);
/**
* Shared empty view, paired with `EMPTY_BUFFER`. Never written to: any
* fixed-width write first grows the buffer, which replaces this view.
*/
var EMPTY_VIEW = new DataView(EMPTY_BUFFER.buffer);
/**
* Longest string on the ASCII fast paths. Must stay below 0x80, so
* that the writer's length prefix always fits a single varint byte.
*/
var ASCII_MAX_LENGTH = 32;
/**
* Number of bytes needed to encode `value` as an unsigned 32-bit varint.
*/
function varint32Size(value) {
	if (value < 128) return 1;
	if (value < 16384) return 2;
	if (value < 2097152) return 3;
	if (value < 268435456) return 4;
	return 5;
}
var BinaryReader = class {
	constructor(buf, decodeUtf8 = getTextEncoding().decodeUtf8) {
		this.decodeUtf8 = decodeUtf8;
		this.varint64Lo = 0;
		this.varint64Hi = 0;
		this.varint64 = varint64read;
		/**
		* Read a `uint32` field, an unsigned 32 bit varint.
		*/
		this.uint32 = varint32read;
		this.buf = buf;
		this.len = buf.length;
		this.pos = 0;
		this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	}
	/**
	* Reads a tag - field number and wire type. Tags are uint32 varints; values
	* that do not fit in uint32 are rejected.
	*/
	tag() {
		const start = this.pos;
		const tag = this.uint32();
		const bytesRead = this.pos - start;
		if (bytesRead > 5 || bytesRead == 5 && this.buf[this.pos - 1] > 15) throw new Error("illegal tag: varint overflows uint32");
		const fieldNo = tag >>> 3;
		const wireType = tag & 7;
		if (fieldNo <= 0 || wireType > 5) throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
		return [fieldNo, wireType];
	}
	/**
	* Skip one element and return the skipped data.
	*
	* When skipping StartGroup, provide the tags field number to check for
	* matching field number in the EndGroup tag. Recursion into nested groups
	* is guarded by the `recursionLimit` argument: When the limit is reached,
	* this method throws.
	*/
	skip(wireType, fieldNo, recursionLimit = 100) {
		let start = this.pos;
		switch (wireType) {
			case WireType.Varint:
				while (this.buf[this.pos++] & 128);
				break;
			case WireType.Bit64: this.pos += 4;
			case WireType.Bit32:
				this.pos += 4;
				break;
			case WireType.LengthDelimited:
				let len = this.uint32();
				this.pos += len;
				break;
			case WireType.StartGroup:
				if (recursionLimit <= 0) throw new Error("maximum recursion depth reached");
				for (;;) {
					const [fn, wt] = this.tag();
					if (wt === WireType.EndGroup) {
						if (fieldNo !== void 0 && fn !== fieldNo) throw new Error("invalid end group tag");
						break;
					}
					this.skip(wt, fn, recursionLimit - 1);
				}
				break;
			default: throw new Error("cant skip wire type " + wireType);
		}
		this.assertBounds();
		return this.buf.subarray(start, this.pos);
	}
	/**
	* Throws error if position in byte array is out of range.
	*/
	assertBounds() {
		if (this.pos > this.len) throw new RangeError("premature EOF");
	}
	/**
	* Read a `int32` field, a signed 32 bit varint.
	*/
	int32() {
		return this.uint32() | 0;
	}
	/**
	* Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
	*/
	sint32() {
		let zze = this.uint32();
		return zze >>> 1 ^ -(zze & 1);
	}
	/**
	* Read a `int64` field, a signed 64-bit varint.
	*/
	int64() {
		this.varint64();
		return protoInt64.dec(this.varint64Lo, this.varint64Hi);
	}
	/**
	* Read a `uint64` field, an unsigned 64-bit varint.
	*/
	uint64() {
		this.varint64();
		return protoInt64.uDec(this.varint64Lo, this.varint64Hi);
	}
	/**
	* Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
	*/
	sint64() {
		this.varint64();
		let lo = this.varint64Lo;
		let hi = this.varint64Hi;
		let s = -(lo & 1);
		lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
		hi = hi >>> 1 ^ s;
		return protoInt64.dec(lo, hi);
	}
	/**
	* Read a `bool` field, a variant.
	*/
	bool() {
		const b = this.buf[this.pos];
		if (b < 128) {
			this.pos++;
			return b !== 0;
		}
		this.varint64();
		return this.varint64Lo !== 0 || this.varint64Hi !== 0;
	}
	/**
	* Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
	*/
	fixed32() {
		return this.view.getUint32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
	*/
	sfixed32() {
		return this.view.getInt32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
	*/
	fixed64() {
		return protoInt64.uDec(this.sfixed32(), this.sfixed32());
	}
	/**
	* Read a `fixed64` field, a signed, fixed-length 64-bit integer.
	*/
	sfixed64() {
		return protoInt64.dec(this.sfixed32(), this.sfixed32());
	}
	/**
	* Read a `float` field, 32-bit floating point number.
	*/
	float() {
		return this.view.getFloat32((this.pos += 4) - 4, true);
	}
	/**
	* Read a `double` field, a 64-bit floating point number.
	*/
	double() {
		return this.view.getFloat64((this.pos += 8) - 8, true);
	}
	/**
	* Read a `bytes` field, length-delimited arbitrary data.
	*/
	bytes() {
		let len = this.uint32(), start = this.pos;
		this.pos += len;
		this.assertBounds();
		return this.buf.subarray(start, start + len);
	}
	/**
	* Read a `string` field, length-delimited data converted to UTF-8 text. If
	* `strict` is true, throw on invalid UTF-8 instead of substituting U+FFFD.
	*/
	string(strict) {
		const bytes = this.bytes();
		const len = bytes.length;
		if (len <= ASCII_MAX_LENGTH) {
			const codes = new Array(len);
			for (let i = 0; i < len; i++) {
				const byte = bytes[i];
				if (byte > 127) return this.decodeUtf8(bytes, strict);
				codes[i] = byte;
			}
			return String.fromCharCode.apply(String, codes);
		}
		return this.decodeUtf8(bytes, strict);
	}
};
/**
* Assert a valid signed protobuf 32-bit integer as a number or string.
*/
function assertInt32(arg) {
	if (typeof arg == "string") arg = Number(arg);
	else if (typeof arg != "number") throw new Error("invalid int32: " + typeof arg);
	if (!Number.isInteger(arg) || arg > 2147483647 || arg < -2147483648) throw new Error("invalid int32: " + arg);
}
/**
* Assert a valid unsigned protobuf 32-bit integer as a number or string.
*/
function assertUInt32(arg) {
	if (typeof arg == "string") arg = Number(arg);
	else if (typeof arg != "number") throw new Error("invalid uint32: " + typeof arg);
	if (!Number.isInteger(arg) || arg > 4294967295 || arg < 0) throw new Error("invalid uint32: " + arg);
}
/**
* Assert a valid protobuf float value as a number or string.
*/
function assertFloat32(arg) {
	if (typeof arg == "string") {
		const o = arg;
		arg = Number(arg);
		if (Number.isNaN(arg) && o !== "NaN") throw new Error("invalid float32: " + o);
	} else if (typeof arg != "number") throw new Error("invalid float32: " + typeof arg);
	if (Number.isFinite(arg) && (arg > 34028234663852886e22 || arg < -34028234663852886e22)) throw new Error("invalid float32: " + arg);
}
//#endregion
export { BinaryWriter as n, BinaryReader as t };
