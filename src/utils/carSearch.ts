import { Car } from '../types/car';

export interface ParsedSearchQuery {
  raw: string;
  tokens: string[];
  maxPrice?: number;
  minPrice?: number;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j];
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = Math.min(prev, dp[j], dp[j - 1]) + 1;
      }
      prev = temp;
    }
  }
  return dp[b.length];
}

function parseNairaNumber(numStr: string, unit?: string): number {
  const cleaned = Number(numStr.replace(/,/g, ''));
  if (!Number.isFinite(cleaned) || cleaned <= 0) return 0;
  const u = (unit || '').toLowerCase();
  if (u === 'm' || u === 'mil' || u === 'million') return cleaned * 1_000_000;
  if (u === 'b' || u === 'bn' || u === 'billion') return cleaned * 1_000_000_000;
  if (u === 'k') return cleaned * 1_000;
  if (cleaned < 1000 && !u) return cleaned * 1_000_000;
  return cleaned;
}

export function parseCarSearchQuery(rawQuery: string): ParsedSearchQuery {
  let working = rawQuery.toLowerCase().trim();
  let maxPrice: number | undefined;
  let minPrice: number | undefined;

  // e.g. "between 20m and 80m" / "between 20 million and 80 million"
  const betweenRegex =
    /\bbetween\s+₦?\s*([\d.,]+)\s*(m|mil|million|b|bn|billion|k)?\s+(?:and|to|-)\s+₦?\s*([\d.,]+)\s*(m|mil|million|b|bn|billion|k)?\b/i;
  const betweenMatch = working.match(betweenRegex);
  if (betweenMatch) {
    minPrice = parseNairaNumber(betweenMatch[1], betweenMatch[2] || betweenMatch[4]);
    maxPrice = parseNairaNumber(betweenMatch[3], betweenMatch[4] || betweenMatch[2]);
    working = working.replace(betweenRegex, ' ');
  }

  // e.g. "under 20 million", "below 50m", "less than 100m", "max 80m", "< 40m"
  const maxRegex =
    /(?:\b(?:under|below|less\s+than|max|up\s*to|upto|within)\b|<|<=)\s*₦?\s*([\d.,]+)\s*(m|mil|million|b|bn|billion|k)?\b/gi;
  working = working.replace(maxRegex, (_m, n, u) => {
    const val = parseNairaNumber(n, u);
    if (val > 0) maxPrice = val;
    return ' ';
  });

  // e.g. "over 50 million", "above 100m", "min 30m", "> 40m"
  const minRegex =
    /(?:\b(?:over|above|more\s+than|min|from)\b|>|>=)\s*₦?\s*([\d.,]+)\s*(m|mil|million|b|bn|billion|k)?\b/gi;
  working = working.replace(minRegex, (_m, n, u) => {
    const val = parseNairaNumber(n, u);
    if (val > 0) minPrice = val;
    return ' ';
  });

  const stopWords = new Set(['car', 'cars', 'for', 'in', 'with', 'a', 'an', 'the', 'and', 'or', 'naira', 'ngn']);
  const tokens = working
    .replace(/[^a-z0-9.\-\s]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && !stopWords.has(t));

  return { raw: rawQuery, tokens, maxPrice, minPrice };
}

function tokenMatchesWord(token: string, word: string): number {
  if (!word) return 0;
  if (word === token) return 10;
  if (word.startsWith(token)) return 8;
  if (word.includes(token) && token.length >= 2) return 6;

  // Typo tolerance for words length >= 4
  if (token.length >= 4 && word.length >= 3 && !/^\d+$/.test(token)) {
    const maxDist = token.length >= 7 ? 2 : 1;
    if (Math.abs(word.length - token.length) <= maxDist) {
      const dist = levenshtein(token, word);
      if (dist <= maxDist) return 5 - dist;
    }
  }
  return 0;
}

export interface SearchMatch {
  car: Car;
  score: number;
  matchedColors: string[];
}

export function searchCarsWithDetails(cars: Car[], rawQuery: string): SearchMatch[] {
  const parsed = parseCarSearchQuery(rawQuery);
  if (!parsed.raw.trim()) {
    return cars.map((car) => ({ car, score: 1, matchedColors: [] }));
  }

  const results: SearchMatch[] = [];

  for (const car of cars) {
    if (parsed.maxPrice !== undefined && car.price > parsed.maxPrice) continue;
    if (parsed.minPrice !== undefined && car.price < parsed.minPrice) continue;

    if (parsed.tokens.length === 0) {
      results.push({ car, score: 5, matchedColors: [] });
      continue;
    }

    const colorNames = car.colors.map((c) => c.name);
    const highWeightWords = [
      car.brand,
      ...car.model.split(/[\s\-/]+/),
      String(car.year),
      car.bodyType,
      car.condition,
      ...colorNames.flatMap((n) => n.split(/\s+/)),
    ].map((w) => w.toLowerCase());

    const midWeightWords = [
      car.fuel,
      car.transmission,
      car.drivetrain,
      ...car.engine.split(/[\s\-/]+/),
      ...car.features.flatMap((f) => f.split(/\s+/)),
      ...(car.specs?.trim ? car.specs.trim.split(/\s+/) : []),
      ...(car.location ? car.location.split(/[\s,]+/) : []),
    ].map((w) => w.toLowerCase());

    const lowWeightWords = car.description
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    let totalScore = 0;
    let matchedTokenCount = 0;
    const matchedColors = new Set<string>();

    for (const token of parsed.tokens) {
      let bestForToken = 0;

      // Numeric year exact/near check
      if (/^\d{4}$/.test(token)) {
        if (String(car.year) === token) {
          bestForToken = 12;
        }
      } else {
        for (const w of highWeightWords) {
          bestForToken = Math.max(bestForToken, tokenMatchesWord(token, w) * 2);
        }
        for (const cName of colorNames) {
          for (const cw of cName.toLowerCase().split(/\s+/)) {
            if (tokenMatchesWord(token, cw) > 0) {
              matchedColors.add(cName);
            }
          }
        }
        for (const w of midWeightWords) {
          bestForToken = Math.max(bestForToken, tokenMatchesWord(token, w));
        }
        if (bestForToken === 0) {
          for (const w of lowWeightWords) {
            bestForToken = Math.max(bestForToken, Math.round(tokenMatchesWord(token, w) * 0.6));
          }
        }
      }

      if (bestForToken > 0) {
        matchedTokenCount++;
        totalScore += bestForToken;
      }
    }

    // Require either all tokens matched or (for multi-word queries) >= 60% matched cleanly
    const requiredMatches =
      parsed.tokens.length <= 2
        ? parsed.tokens.length
        : Math.ceil(parsed.tokens.length * 0.65);

    if (matchedTokenCount >= requiredMatches && totalScore > 0) {
      results.push({
        car,
        score: totalScore + (car.status === 'available' ? 2 : 0),
        matchedColors: Array.from(matchedColors),
      });
    }
  }

  return results.sort((a, b) => b.score - a.score || b.car.year - a.car.year);
}

export function searchCars(cars: Car[], rawQuery: string): Car[] {
  return searchCarsWithDetails(cars, rawQuery).map((m) => m.car);
}
