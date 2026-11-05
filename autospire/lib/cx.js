export const makeCx = (styles) => (...args) =>
  args.flat().filter(Boolean).join(" ").split(/\s+/).map((c) => styles[c] || c).join(" ");
