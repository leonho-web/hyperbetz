const fs = require("fs");
const path = require("path");

// Helper functions
function getAllPaths(obj, prefix = "") {
	const paths = [];

	for (const key in obj) {
		const currentPath = prefix ? `${prefix}.${key}` : key;

		if (
			typeof obj[key] === "object" &&
			obj[key] !== null &&
			!Array.isArray(obj[key])
		) {
			paths.push(...getAllPaths(obj[key], currentPath));
		} else {
			paths.push(currentPath);
		}
	}

	return paths;
}

function getAtPath(obj, path) {
	const keys = path.split(".");
	let current = obj;

	for (const key of keys) {
		if (current && typeof current === "object" && key in current) {
			current = current[key];
		} else {
			return undefined;
		}
	}

	return current;
}

// Languages to check
const languages = [
	"ar",
	"de",
	"en",
	"es",
	"fa",
	"fr",
	"hi",
	"it",
	"ja",
	"ko",
	"ms",
	"nl",
	"pl",
	"pt",
	"ru",
	"sv",
	"th",
	"tr",
	"vi",
	"zh",
];

const dictionaryPath =
	"/home/himanshu-soni/Developer/work/qubitron/meme-win/Dictionary";

// Load English as reference (it has 100% coverage)
const enPath = path.join(dictionaryPath, "en.json");
const enData = JSON.parse(fs.readFileSync(enPath, "utf8"));
const allPaths = getAllPaths(enData);

// Check what keys were added (contain **TRANSLATION_NEEDED**)
console.log("🔍 DETAILED MISSING KEYS REPORT");
console.log("=".repeat(60));

const addedKeysPerLang = {};

for (const lang of languages) {
	const filePath = path.join(dictionaryPath, `${lang}.json`);
	const langData = JSON.parse(fs.readFileSync(filePath, "utf8"));

	const addedKeys = [];

	for (const keyPath of allPaths) {
		const value = getAtPath(langData, keyPath);
		if (
			typeof value === "string" &&
			value.includes("**TRANSLATION_NEEDED**")
		) {
			const originalValue = value.replace("**TRANSLATION_NEEDED**: ", "");
			addedKeys.push({
				path: keyPath,
				originalValue: originalValue,
			});
		}
	}

	addedKeysPerLang[lang] = addedKeys;

	if (addedKeys.length > 0) {
		console.log(
			`\n📝 ${lang.toUpperCase()}: ${addedKeys.length} keys added`
		);
		addedKeys.forEach((key) => {
			console.log(`   ↳ ${key.path}`);
			console.log(`     EN: "${key.originalValue}"`);
		});
	} else {
		console.log(
			`\n✅ ${lang.toUpperCase()}: No missing keys (100% coverage)`
		);
	}
}

// Show the missing keys grouped by what they are
console.log("\n\n🗂️  MISSING KEYS BY CATEGORY");
console.log("=".repeat(60));

// Group missing keys by their first level
const keysByCategory = {};
const allMissingKeys = new Set();

Object.values(addedKeysPerLang).forEach((keys) => {
	keys.forEach((key) => {
		allMissingKeys.add(key.path);
		const category = key.path.split(".")[0];
		if (!keysByCategory[category]) {
			keysByCategory[category] = new Set();
		}
		keysByCategory[category].add(key.path);
	});
});

// Convert Sets to arrays and sort
Object.keys(keysByCategory).forEach((category) => {
	keysByCategory[category] = Array.from(keysByCategory[category]).sort();
});

Object.entries(keysByCategory).forEach(([category, keys]) => {
	console.log(`\n📁 ${category.toUpperCase()}:`);
	keys.forEach((key) => {
		const value = getAtPath(enData, key);
		console.log(`   ↳ ${key} = "${value}"`);
	});
});

console.log(`\n\n📊 SUMMARY:`);
console.log(`Total unique missing keys: ${allMissingKeys.size}`);
console.log(`Categories affected: ${Object.keys(keysByCategory).length}`);
console.log(
	`Languages needing translation: ${
		Object.keys(addedKeysPerLang).filter(
			(lang) => addedKeysPerLang[lang].length > 0
		).length
	}`
);

// Show which languages are fully complete
const completeLanguages = languages.filter(
	(lang) => addedKeysPerLang[lang].length === 0
);
console.log(`Languages with 100% coverage: ${completeLanguages.join(", ")}`);
