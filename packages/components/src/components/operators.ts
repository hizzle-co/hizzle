export const operators = {
    '==': ( a, b ) => a == b,
    '===': ( a, b ) => a === b,
    '!=': ( a, b ) => a != b,
    '!==': ( a, b ) => a !== b,
    '>': ( a, b ) => a > b,
    '>=': ( a, b ) => a >= b,
    '<': ( a, b ) => a < b,
    '<=': ( a, b ) => a <= b,
    'includes': ( a, b ) => a.includes( b ),
    '!includes': ( a, b ) => !a.includes( b ),
    '^includes': ( a, b ) => b.includes( a ),
    '^!includes': ( a, b ) => !b.includes( a ),
    'empty': ( a, b ) => !b,
    '!empty': ( a, b ) => b,
};

// a is the value of the condition, b is the saved value.
export const compare = ( conditionValue, operator, savedValue ) => {
    // If the condition value is a boolean and the saved value is undefined, convert the saved value to a boolean.
    return operators[ operator ] ? operators[ operator ]( conditionValue, typeof conditionValue === 'boolean' && savedValue === undefined ? Boolean(savedValue) : savedValue ) : false;
};
