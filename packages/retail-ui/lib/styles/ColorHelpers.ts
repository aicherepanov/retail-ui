import warning from 'warning';

export function clamp(val: number, max = 1) {
  warning(0 <= val && val <= max, `${val} exceeds [0, ${max}] interval, clamping`);
  return Math.min(max, Math.max(0, val));
}

export function integerFromPercent(n: string, size: number) {
  return Math.round((parseFloat(n) * size) / 100);
}

export function floatFromPercent(n: string) {
  return parseFloat((parseFloat(n) / 100).toFixed(5));
}

export function roundToPrecision(n: number, precision = 2) {
  return parseFloat(n.toFixed(precision));
}

export function extractColorParts(input: string, solidRegex: RegExp, alphaRegex?: RegExp) {
  let parts = input.match(solidRegex);
  if (!parts && alphaRegex) {
    parts = input.match(alphaRegex);
  }

  if (!parts) {
    throw new Error(`${input} does not match color patterns: [
      ${solidRegex}
      ${alphaRegex}
    ]`);
  }

  return parts;
}

export function parseRGBParts(parts: string[]) {
  const r = parseToInteger(parts[1], 255);
  const g = parseToInteger(parts[2], 255);
  const b = parseToInteger(parts[3], 255);
  const a = parts[4] ? parseToFloat(parts[4]) : 1.0;

  if (isNaN(r)) {
    throw new Error(`Could not parse red=${parts[1]} to number`);
  }
  if (isNaN(g)) {
    throw new Error(`Could not parse green=${parts[2]} to number`);
  }
  if (isNaN(b)) {
    throw new Error(`Could not parse blue=${parts[3]} to number`);
  }
  if (isNaN(a)) {
    throw new Error(`Could not parse alpha=${parts[4]} to number`);
  }
  return { r, g, b, a };
}

export function parseHSLParts(parts: string[]) {
  const h = parseInt(parts[1], 10);
  const s = parseToFloat(parts[2]);
  const l = parseToFloat(parts[3]);
  const a = parts[4] ? parseToFloat(parts[4]) : 1.0;

  if (isNaN(h)) {
    throw new Error(`Could not parse hue=${parts[1]} to number`);
  } else if (isNaN(s)) {
    throw new Error(`Could not parse saturation=${parts[2]} to number`);
  } else if (isNaN(l)) {
    throw new Error(`Could not parse lightness=${parts[3]} to number`);
  } else if (isNaN(a)) {
    throw new Error(`Could not parse alpha=${parts[4]} to number`);
  }

  return { h, s, l, a };
}

export function parseToInteger(part: string, size: number) {
  return part.endsWith('%') ? integerFromPercent(part, size) : parseInt(part, 10);
}

export function parseToFloat(part: string) {
  return part.endsWith('%') ? floatFromPercent(part) : parseFloat(part);
}

export function hue2rgb(hue: number, t1: number, t2: number) {
  if (hue < 0) {
    hue += 1;
  }
  if (hue > 1) {
    hue -= 1;
  }
  if (hue < 1 / 6) {
    return t2 + (t1 - t2) * 6 * hue;
  }
  if (hue < 1 / 2) {
    return t1;
  }
  if (hue < 2 / 3) {
    return t2 + (t1 - t2) * (2 / 3 - hue) * 6;
  }
  return t2;
}
