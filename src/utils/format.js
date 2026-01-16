export const money = (v) => `$${(v || 0).toLocaleString()}`;
export const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;