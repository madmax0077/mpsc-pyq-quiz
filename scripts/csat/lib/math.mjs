/** Shared arithmetic helpers used by the CSAT generators. */

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

export function gcdAll(list) {
  return list.reduce((acc, v) => gcd(acc, v));
}

export function lcmAll(list) {
  return list.reduce((acc, v) => lcm(acc, v));
}

/** Prime factorisation as an array of [prime, exponent] pairs. */
export function primeFactors(n) {
  const out = [];
  let x = n;
  for (let p = 2; p * p <= x; p += 1) {
    if (x % p !== 0) continue;
    let e = 0;
    while (x % p === 0) {
      x /= p;
      e += 1;
    }
    out.push([p, e]);
  }
  if (x > 1) out.push([x, 1]);
  return out;
}

export function countFactors(n) {
  return primeFactors(n).reduce((acc, [, e]) => acc * (e + 1), 1);
}

export function isPrime(n) {
  if (n < 2) return false;
  for (let p = 2; p * p <= n; p += 1) if (n % p === 0) return false;
  return true;
}

export function powMod(base, exp, mod) {
  let result = 1;
  let b = base % mod;
  let e = exp;
  while (e > 0) {
    if (e & 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e >>= 1;
  }
  return result;
}

/** Unit digit of base^exp, via the cycle of the last digit. */
export function unitDigit(base, exp) {
  return powMod(base % 10, exp, 10);
}

/** The repeating cycle of last digits for a base, e.g. 2 -> [2,4,8,6]. */
export function unitCycle(base) {
  const d = base % 10;
  const seen = [];
  let cur = d;
  for (let i = 0; i < 4; i += 1) {
    seen.push(cur);
    cur = (cur * d) % 10;
    if (cur === d && seen.length > 0) break;
  }
  return seen;
}

/** Number of trailing zeros in n! (count of 5s). */
export function trailingZerosFactorial(n) {
  let count = 0;
  for (let p = 5; p <= n; p *= 5) count += Math.floor(n / p);
  return count;
}

export function range(a, b) {
  const out = [];
  for (let i = a; i <= b; i += 1) out.push(i);
  return out;
}

/** Simplify a ratio to its lowest terms. */
export function simplifyRatio(list) {
  const g = gcdAll(list);
  return list.map((v) => v / g);
}

/** All permutations of a small array (used to brute-force puzzle uniqueness). */
export function permutations(items) {
  if (items.length <= 1) return [items];
  const out = [];
  for (let i = 0; i < items.length; i += 1) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutations(rest)) out.push([items[i], ...p]);
  }
  return out;
}
