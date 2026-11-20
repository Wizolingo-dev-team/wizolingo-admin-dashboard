/** @type {import("eslint").Linter.Config} */
const config = {
	plugins: ["eslint-comments"],
	extends: ["next/core-web-vitals"],
	rules: {
		"@next/next/no-img-element": "off",
		"react/no-unescaped-entities": "off",
		"eslint-comments/disable-enable-pair": "off",
		"eslint-comments/no-unlimited-disable": "off",
	},
};

module.exports = config;
