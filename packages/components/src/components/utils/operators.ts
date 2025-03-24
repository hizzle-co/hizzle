/**
 * Defines a function type for comparison operators.
 *
 * @template A - The type of the first value to compare.
 * @template B - The type of the second value to compare.
 * @param {unknown} a - The first value to compare.
 * @param {unknown} b - The second value to compare.
 * @return {boolean} The result of the comparison.
 */
type OperatorFn = (a: unknown, b: unknown) => boolean;

type Operators =
	| '=='
	| '==='
	| '!='
	| '!=='
	| '>'
	| '>='
	| '<'
	| '<='
	| 'includes'
	| '!includes'
	| '^includes'
	| '^!includes'
	| 'empty'
	| '!empty';

/**
 * A record of comparison operators with their corresponding functions.
 *
 * @type {Record<Operators, OperatorFn>}
 */
export const operators: Record<Operators, OperatorFn> = {
	'==': (a, b) => (a as any) == (b as any),
	'===': (a, b) => (a as any) === (b as any),
	'!=': (a, b) => (a as any) != (b as any),
	'!==': (a, b) => (a as any) !== (b as any),
	'>': (a, b) => (a as any) > (b as any),
	'>=': (a, b) => (a as any) >= (b as any),
	'<': (a, b) => (a as any) < (b as any),
	'<=': (a, b) => (a as any) <= (b as any),
	includes: (a, b) => (a as any).includes(b),
	'!includes': (a, b) => !(a as any).includes(b),
	'^includes': (a, b) => (b as any).includes(a),
	'^!includes': (a, b) => !(b as any).includes(a),
	empty: (a, b) => Boolean(!b),
	'!empty': (a, b) => Boolean(b),
};

// a is the value of the condition, b is the saved value.
/**
 * Compares two values using the specified operator.
 *
 * @param {any} conditionValue - The value to compare against (left side of the comparison).
 * @param {Operators} operator - The operator to use for comparison.
 * @param {any} savedValue - The saved value to compare with (right side of the comparison).
 * @return {boolean} The result of the comparison.
 */
export const compare = (
	conditionValue: any,
	operator: Operators,
	savedValue: any
): boolean => {
	// If the condition value is a boolean and the saved value is undefined, convert the saved value to a boolean.
	return operators[operator]
		? operators[operator](
				conditionValue,
				typeof conditionValue === 'boolean' && savedValue === undefined
					? Boolean(savedValue)
					: savedValue
			)
		: false;
};
