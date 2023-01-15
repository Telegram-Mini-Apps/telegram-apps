interface GetOptionsResult {
  to: string;
  isOptional: boolean;
}

/**
 * Extracts correct options from options, passed to parsers. 
 * @param from
 * @param toOrOptional
 * @param optional
 */
export function getParserOptions(
  from: string, 
  toOrOptional: string | boolean, 
  optional?: boolean
): GetOptionsResult {
  let to: string;
  let isOptional: boolean;

  if (toOrOptional === undefined) {
    to = from;
    isOptional = false;
  } else if (typeof toOrOptional === 'boolean') {
    to = from;
    isOptional = toOrOptional;
  } else {
    to = toOrOptional;
    isOptional = optional || false;
  }
  return {to, isOptional};
}