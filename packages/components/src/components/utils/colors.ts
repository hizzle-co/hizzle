const SATURATION_BOUND = [0, 100] as [number, number];
const LIGHTNESS_BOUND = [0, 100] as [number, number];

const pad2 = (str: string) => `${str.length === 1 ? '0' : ''}${str}`;

const clamp = (num: number, min: number, max: number) =>
	Math.max(Math.min(num, max), min);

const random = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const randomExclude = (min: number, max: number, exclude: number[][]) => {
	const r = random(min, max);

	for (let i = 0; i < exclude?.length; i++) {
		const value = exclude[i];

		if (value?.length === 2 && r >= value[0] && r <= value[1]) {
			return randomExclude(min, max, exclude);
		}
	}

	return r;
};

/**
 * Generate hashCode
 * @param  {string} str
 * @return {number}
 */
const hashCode = (str: string): number => {
	const len = str.length;
	let hash = 0;

	for (let i = 0; i < len; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash &= hash; // Convert to 32bit integer
	}

	return hash;
};

/**
 * Clamps `num` within the inclusive `range` bounds
 * @param  {number}       num
 * @param  {number|Array} range
 * @return {number}
 */
const boundHashCode = (num: number, range: number | Array<any>): number => {
	if (typeof range === 'number') {
		return range;
	}

	return (num % Math.abs(range[1] - range[0])) + range[0];
};

/**
 * Sanitizing the `range`
 * @param  {number|Array} range
 * @param  {Array}        bound
 * @return {number|Array}
 */
const sanitizeRange = (
	range: number | number[],
	bound: [number, number]
): number | [number, number] => {
	if (typeof range === 'number') {
		return clamp(Math.abs(range), ...bound);
	}

	if (range.length === 1 || range[0] === range[1]) {
		return clamp(Math.abs(range[0]), ...bound);
	}

	return [
		Math.abs(clamp(range[0], ...bound)),
		clamp(Math.abs(range[1]), ...bound),
	];
};

/**
 * @param  {number} p
 * @param  {number} q
 * @param  {number} t
 * @return {number}
 */
const hueToRgb = (p: number, q: number, t: number): number => {
	if (t < 0) {
		t += 1;
	} else if (t > 1) {
		t -= 1;
	}

	if (t < 1 / 6) {
		return p + (q - p) * 6 * t;
	}

	if (t < 1 / 2) {
		return q;
	}

	if (t < 2 / 3) {
		return p + (q - p) * (2 / 3 - t) * 6;
	}

	return p;
};

/**
 * Converts an HSL color to RGB
 * @param  {number} h Hue
 * @param  {number} s Saturation
 * @param  {number} l Lightness
 * @return {Array}
 */
const hslToRgb = (h: number, s: number, l: number): Array<any> => {
	let r;
	let g;
	let b;

	h /= 360;
	s /= 100;
	l /= 100;

	if (s === 0) {
		// achromatic
		r = g = b = l;
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hueToRgb(p, q, h + 1 / 3);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Determines whether the RGB color is light or not
 * http://www.w3.org/TR/AERT#color-contrast
 * @param  {number}  r               Red
 * @param  {number}  g               Green
 * @param  {number}  b               Blue
 * @param  {number}  differencePoint
 * @return {boolean}
 */
const rgbIsLight = (
	r: number,
	g: number,
	b: number,
	differencePoint: number
): boolean => (r * 299 + g * 587 + b * 114) / 1000 >= differencePoint; // eslint-disable-line max-len

/**
 * Converts an HSL color to string format
 * @param  {number} h Hue
 * @param  {number} s Saturation
 * @param  {number} l Lightness
 * @return {string}
 */
const hslToString = (h: number, s: number, l: number): string =>
	`hsl(${h}, ${s}%, ${l}%)`;

/**
 * Converts RGB color to string format
 * @param  {number}  r      Red
 * @param  {number}  g      Green
 * @param  {number}  b      Blue
 * @param  {string}  format Color format
 * @return {string}
 */
const rgbFormat = (r: number, g: number, b: number, format: string): string => {
	switch (format) {
		case 'rgb':
			return `rgb(${r}, ${g}, ${b})`;
		case 'hex':
		default:
			return `#${pad2(r.toString(16))}${pad2(g.toString(16))}${pad2(b.toString(16))}`;
	}
};

/**
 * Generate unique color from `value`
 * @param  {string|number} value
 * @param  {Object}        [options={}]
 * @param  {string}        [options.format='hex']
 *  The color format, it can be one of `hex`, `rgb` or `hsl`
 * @param  {number|Array}  [options.saturation=[50, 55]]
 *  Determines the color saturation, it can be a number or a range between 0 and 100
 * @param  {number|Array}  [options.lightness=[50, 60]]
 *  Determines the color lightness, it can be a number or a range between 0 and 100
 * @param  {number}        [options.differencePoint=130]
 *  Determines the color brightness difference point. We use it to obtain the `isLight` value
 *  in the output, it can be a number between 0 and 255
 * @return {Object}
 * @example
 *
 * ```js
 * stringToColor('Hello world!')
 * // { color: "#5cc653", isLight: true }
 *
 * stringToColor('Hello world!', { format: 'rgb' })
 * // { color: "rgb(92, 198, 83)", isLight: true }
 *
 * stringToColor('Hello world!', {
 *   saturation: 30,
 *   lightness: [70, 80],
 * })
 * // { color: "#afd2ac", isLight: true }
 *
 * stringToColor('Hello world!', {
 *   saturation: 30,
 *   lightness: [70, 80],
 *   differencePoint: 200,
 * })
 * // { color: "#afd2ac", isLight: false }
 * ```
 */
export const stringToColor = (
	value: string | number,
	{
		format = 'hex',
		saturation = [50, 55] as [number, number],
		lightness = [50, 60] as [number, number],
		differencePoint = 130,
	}: {
		format?: string;
		saturation?: number | [number, number];
		lightness?: number | [number, number];
		differencePoint?: number;
	} = {}
) => {
	const hash = Math.abs(hashCode(String(value)));
	const h = boundHashCode(hash, [0, 360]);
	const s = boundHashCode(hash, sanitizeRange(saturation, SATURATION_BOUND));
	const l = boundHashCode(hash, sanitizeRange(lightness, LIGHTNESS_BOUND));
	const [r, g, b] = hslToRgb(h, s, l);

	return {
		color:
			format === 'hsl'
				? hslToString(h, s, l)
				: rgbFormat(r, g, b, format),
		isLight: rgbIsLight(r, g, b, differencePoint),
	};
};

/**
 * Generate random color
 * @param  {Object}       [options={}]
 * @param  {string}       [options.format='hex']
 *  The color format, it can be one of `hex`, `rgb` or `hsl`
 * @param  {number|Array} [options.saturation=[50, 55]]
 *  Determines the color saturation, it can be a number or a range between 0 and 100
 * @param  {number|Array} [options.lightness=[50, 60]]
 *  Determines the color lightness, it can be a number or a range between 0 and 100
 * @param  {number}       [options.differencePoint=130]
 *  Determines the color brightness difference point. We use it to obtain the `isLight` value
 *  in the output, it can be a number between 0 and 255
 * @param  {Array}        [options.excludeHue]
 *  Exclude certain hue ranges. For example to exclude red color range: `[[0, 20], [325, 359]]`
 * @return {Object}
 * @example
 *
 * ```js
 * // Generate random color
 * uniqolor.random()
 * // { color: "#644cc8", isLight: false }
 *
 * // Generate a random color with HSL format
 * uniqolor.random({ format: 'hsl' })
 * // { color: "hsl(89, 55%, 60%)", isLight: true }
 *
 * // Generate a random color in specific saturation and lightness
 * uniqolor.random({
 *   saturation: 80,
 *   lightness: [70, 80],
 * })
 * // { color: "#c7b9da", isLight: true }
 *
 * // Generate a random color but exclude red color range
 * uniqolor.random({
 *   excludeHue: [[0, 20], [325, 359]],
 * })
 * // {color: '#53caab', isLight: true}
 * ```
 */
export const randomColor = ({
	format = 'hex',
	saturation = [50, 55] as [number, number],
	lightness = [50, 60] as [number, number],
	differencePoint = 130,
	excludeHue,
}: {
	format?: string;
	saturation?: number | [number, number];
	lightness?: number | [number, number];
	differencePoint?: number;
	excludeHue?: Array<[number, number]>;
} = {}): object => {
	const sanitizedSaturation = sanitizeRange(saturation, SATURATION_BOUND);
	const sanitizedLightness = sanitizeRange(lightness, LIGHTNESS_BOUND);

	const h = excludeHue ? randomExclude(0, 359, excludeHue) : random(0, 359);
	const s =
		typeof sanitizedSaturation === 'number'
			? sanitizedSaturation
			: random(sanitizedSaturation[0], sanitizedSaturation[1]);
	const l =
		typeof sanitizedLightness === 'number'
			? sanitizedLightness
			: random(sanitizedLightness[0], sanitizedLightness[1]);
	const [r, g, b] = hslToRgb(h, s, l);

	return {
		color:
			format === 'hsl'
				? hslToString(h, s, l)
				: rgbFormat(r, g, b, format),
		isLight: rgbIsLight(r, g, b, differencePoint),
	};
};
