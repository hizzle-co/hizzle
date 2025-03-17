type OperatorFn = ( a: unknown, b: unknown ) => boolean;

export const operators: Record<string, OperatorFn> = {
    '==': ( a, b ) => ( a as any ) == ( b as any ),
    '===': ( a, b ) => ( a as any ) === ( b as any ),
    '!=': ( a, b ) => ( a as any ) != ( b as any ),
    '!==': ( a, b ) => ( a as any ) !== ( b as any ),
    '>': ( a, b ) => ( a as any ) > ( b as any ),
    '>=': ( a, b ) => ( a as any ) >= ( b as any ),
    '<': ( a, b ) => ( a as any ) < ( b as any ),
    '<=': ( a, b ) => ( a as any ) <= ( b as any ),
    'includes': ( a, b ) => ( a as any ).includes( b ),
    '!includes': ( a, b ) => !( a as any ).includes( b ),
    '^includes': ( a, b ) => ( b as any ).includes( a ),
    '^!includes': ( a, b ) => !( b as any ).includes( a ),
    'empty': ( a, b ) => Boolean( !b ),
    '!empty': ( a, b ) => Boolean( b ),
};

// a is the value of the condition, b is the saved value.
export const compare = ( conditionValue: any, operator: string, savedValue: any ) => {
    // If the condition value is a boolean and the saved value is undefined, convert the saved value to a boolean.
    return operators[ operator ] ? operators[ operator ]( conditionValue, typeof conditionValue === 'boolean' && savedValue === undefined ? Boolean( savedValue ) : savedValue ) : false;
};
