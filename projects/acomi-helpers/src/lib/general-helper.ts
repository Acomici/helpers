const typeCache: { [label: string]: boolean } = {};

type Predicate = (oldValues: Array<any>, newValues: Array<any>) => boolean;

/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our state.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels are unique.
 *
 * @param label
 */
export function type<T>(label: T | ''): T {
  if (typeCache[label as string]) {
    throw new Error(`Action type "${label}" is not unqiue"`);
  }

  typeCache[label as string] = true;

  return label as T;
}

/**
 * Runs through every condition, compares new and old values and returns true/false depends on condition state.
 * This is used to distinct if two observable values have changed.
 *
 * @param oldValues
 * @param newValues
 * @param conditions
 */
export function distinctChanges(
  oldValues: Array<any>,
  newValues: Array<any>,
  conditions: Predicate[]
): boolean {
  return !conditions.every((cond) => cond(oldValues, newValues));
}

/**
 * Returns true if the given value is type of Object
 *
 * @param val
 */
export function isObject(val: any) {
  if (val === null) {
    return false;
  }

  return typeof val === 'function' || typeof val === 'object';
}

/**
 * Capitalizes the first character in given string
 *
 * @param s
 */
export function capitalize(s: string) {
  if (!s || typeof s !== 'string') {
    return s;
  }
  return s && s[0].toUpperCase() + s.slice(1);
}

/**
 * Uncapitalizes the first character in given string
 *
 * @param s
 */
export function uncapitalize(s: string) {
  if (!s || typeof s !== 'string') {
    return s;
  }
  return s && s[0].toLowerCase() + s.slice(1);
}

/**
 * Flattens multi dimensional object into one level deep
 *
 * @param ob
 * @param preservePath
 */
export function flattenObject(ob: any, preservePath: boolean = false): any {
  const toReturn = {};

  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) {
      continue;
    }

    if (typeof ob[i] === 'object') {
      const flatObject = flattenObject(ob[i], preservePath);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) {
          continue;
        }

        const path = preservePath ? i + '.' + x : x;

        toReturn[path] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }

  return toReturn;
}

/**
 * Returns formated date based on given culture
 *
 * @param dateString
 * @param culture
 */
export function localeDateString(
  dateString: string,
  culture: string = 'en-EN'
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(culture);
}

export function parseTransform3D(attribute: string) {
  // attribute normally:
  // translate3d(x,x,x);
  const extractPosition =
    attribute.substring(12, attribute.length - 1).trim() + ','; // last element we append `,` for easier in next step parsing
  /**
   * Output array that is: [ x, y, z]
   */
  const arrayPosition = extractPosition
    .split(/(px)|(rem)|(em)|(%),/g)
    .filter((p) => p.trim().length > 0)
    .map((p) => Number.parseFloat(p.trim()));
  return {
    x: arrayPosition[0],
    y: arrayPosition[1],
    z: arrayPosition[2]
  };
}

export function htmlUnitToFixed(strUnit: string): number {
  const regExp = /^-?\d+(\.\d+)?/g;
  const matching = strUnit.match(regExp);
  if (matching) {
    const toParsing = matching[0];
    return Number.parseFloat(toParsing);
  }
  return null;
}

export function getComputedStyleValue(
  dom: HTMLElement,
  attribute: string
): number {
  const cssStyle: CSSStyleDeclaration = getComputedStyle(dom);
  return htmlUnitToFixed(cssStyle[attribute]);
}
