/**
 * Returns map with specified field which could be optional in case, ResultType
 * includes undefined.
 */
type WithResultType<Field extends string, ResultType> =
  undefined extends ResultType
    ? { [K in Field]?: ResultType }
    : { [K in Field]: ResultType };

export {WithResultType};