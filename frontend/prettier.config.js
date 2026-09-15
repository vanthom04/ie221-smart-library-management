/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  trailingComma: "none",
  printWidth: 100,
  arrowParens: "always",
  endOfLine: "auto",
  quoteProps: "consistent",
  jsxSingleQuote: false,
  htmlWhitespaceSensitivity: "ignore",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/globals.css"
}

export default config
