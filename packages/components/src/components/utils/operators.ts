/**
 * Internal dependencies.
 */
import { getNestedValue } from '.';

/**
 * Defines a function type for comparison operators.
 *
 * @template A - The type of the first value to compare.
 * @template B - The type of the second value to compare.
 * @param {unknown} a - The first value to compare.
 * @param {unknown} b - The second value to compare.
 * @return {boolean} The result of the comparison.
 */
type OperatorFn = ( a: unknown, b: unknown ) => boolean;

export type Operators =
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
	'==': ( conditionValue, savedValue ) => ( conditionValue as any ) == ( savedValue as any ),
	'===': ( conditionValue, savedValue ) => ( conditionValue as any ) === ( savedValue as any ),
	'!=': ( conditionValue, savedValue ) => ( conditionValue as any ) != ( savedValue as any ),
	'!==': ( conditionValue, savedValue ) => ( conditionValue as any ) !== ( savedValue as any ),
	'>': ( conditionValue, savedValue ) => ( conditionValue as any ) > ( savedValue as any ),
	'>=': ( conditionValue, savedValue ) => ( conditionValue as any ) >= ( savedValue as any ),
	'<': ( conditionValue, savedValue ) => ( conditionValue as any ) < ( savedValue as any ),
	'<=': ( conditionValue, savedValue ) => ( conditionValue as any ) <= ( savedValue as any ),
	includes: ( conditionValue, savedValue ) => ( conditionValue as any ).includes( savedValue ),
	'!includes': ( conditionValue, savedValue ) => !( conditionValue as any ).includes( savedValue ),
	'^includes': ( conditionValue, savedValue ) => ( savedValue as any ).includes( conditionValue ),
	'^!includes': ( conditionValue, savedValue ) => !( savedValue as any ).includes( conditionValue ),
	empty: ( conditionValue, savedValue ) => Boolean( !savedValue ),
	'!empty': ( conditionValue, savedValue ) => Boolean( savedValue ),
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
	return operators[ operator ]
		? operators[ operator ](
			conditionValue,
			typeof conditionValue === 'boolean' && savedValue === undefined
				? Boolean( savedValue )
				: savedValue
		)
		: false;
};

/**
 * Interface for a comparison condition.
 */
export interface ComparisonCondition {
	/**
	 * The key in the saved object to compare.
	 */
	key: string;

	/**
	 * The value to compare against (the value in the saved object). Not needed for 'empty' and '!empty' operators.
	 */
	value?: number | string | string[];

	/**
	 * The operator to use for the comparison. Default is '=='.
	 */
	operator?: Operators;
}

/**
 * Checks if the saved object matches the conditions.
 * 
 * @param conditions The conditions to check.
 * @param saved The saved object.
 * @returns True if the saved object matches the conditions, false otherwise.
 */
export function checkConditions( conditions: ComparisonCondition[], saved: Record<string, unknown> ): boolean {

	// If no conditions are provided, return true.
	if ( !Array.isArray( conditions ) ) {
		return true;
	}

	return conditions.every( ( condition ) => {

		return compare(
			condition.value,
			condition.operator ? condition.operator : '==',
			getNestedValue( saved, condition.key )
		);
	} );
}
