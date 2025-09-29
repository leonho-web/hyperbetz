const fs = require("fs");
const path = require("path");

// Helper function to deeply merge objects
function deepMerge(target, source) {
	const output = Object.assign({}, target);
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!(key in target))
					Object.assign(output, { [key]: source[key] });
				else output[key] = deepMerge(target[key], source[key]);
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
	}
	return output;
}

function isObject(item) {
	return item && typeof item === "object" && !Array.isArray(item);
}

// Get all paths in an object
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

// Set value at path in object
function setAtPath(obj, path, value) {
	const keys = path.split(".");
	let current = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		if (!(keys[i] in current)) {
			current[keys[i]] = {};
		}
		current = current[keys[i]];
	}

	current[keys[keys.length - 1]] = value;
}

// Get value at path in object
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

// Language files to process
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
	"/home/himanshu-soni/Developer/work/qubitron/hyperbetz/Dictionary";

// Load all language files
const languageData = {};
for (const lang of languages) {
	const filePath = path.join(dictionaryPath, `${lang}.json`);
	try {
		const content = fs.readFileSync(filePath, "utf8");
		languageData[lang] = JSON.parse(content);
		console.log(`✓ Loaded ${lang}.json`);
	} catch (error) {
		console.error(`✗ Failed to load ${lang}.json:`, error.message);
	}
}

// Create superset of all keys
console.log("\n📊 Analyzing key structures...");
let supersetKeys = {};

// Merge all objects to create superset
for (const lang of languages) {
	if (languageData[lang]) {
		supersetKeys = deepMerge(supersetKeys, languageData[lang]);
	}
}

// Get all unique paths
const allPaths = getAllPaths(supersetKeys);
console.log(`\n🔍 Found ${allPaths.length} unique keys across all languages`);

// Analyze missing keys for each language
const missingKeysReport = {};
const stats = {};

for (const lang of languages) {
	if (!languageData[lang]) continue;

	const currentPaths = getAllPaths(languageData[lang]);
	const missingPaths = allPaths.filter(
		(path) => !currentPaths.includes(path)
	);

	missingKeysReport[lang] = missingPaths;
	stats[lang] = {
		total: allPaths.length,
		present: currentPaths.length,
		missing: missingPaths.length,
		coverage: ((currentPaths.length / allPaths.length) * 100).toFixed(1),
	};

	console.log(
		`${lang}: ${stats[lang].present}/${stats[lang].total} keys (${stats[lang].coverage}% coverage)`
	);
}

// Create normalized versions with placeholder translations
console.log("\n🔧 Creating normalized language files...");

const placeholder = "**TRANSLATION_NEEDED**";

for (const lang of languages) {
	if (!languageData[lang]) continue;

	const normalizedData = JSON.parse(JSON.stringify(languageData[lang])); // Deep clone

	// Add missing keys with placeholder values
	for (const missingPath of missingKeysReport[lang]) {
		const supersetValue = getAtPath(supersetKeys, missingPath);

		// If the superset value is a string, use placeholder
		if (typeof supersetValue === "string") {
			setAtPath(
				normalizedData,
				missingPath,
				`${placeholder}: ${supersetValue}`
			);
		} else {
			// If it's not a string, use the original value from superset
			setAtPath(normalizedData, missingPath, supersetValue);
		}
	}

	// Write normalized file
	const outputPath = path.join(dictionaryPath, `${lang}.json`);
	const backupPath = path.join(dictionaryPath, `${lang}.json.backup`);

	// Create backup
	if (fs.existsSync(outputPath)) {
		fs.copyFileSync(outputPath, backupPath);
		console.log(`📄 Created backup: ${lang}.json.backup`);
	}

	// Write normalized file with proper formatting
	fs.writeFileSync(
		outputPath,
		JSON.stringify(normalizedData, null, "\t"),
		"utf8"
	);
	console.log(
		`✅ Updated ${lang}.json with ${missingKeysReport[lang].length} missing keys`
	);
}

// Generate summary report
console.log("\n📋 NORMALIZATION SUMMARY");
console.log("=" * 50);
console.log(`Total unique keys found: ${allPaths.length}`);
console.log(`Languages processed: ${languages.length}`);

// Find the language with most complete coverage
const bestCoverage = Object.entries(stats).reduce(
	(best, [lang, data]) =>
		data.coverage > best.coverage
			? { lang, coverage: data.coverage }
			: best,
	{ lang: "", coverage: 0 }
);

console.log(
	`Most complete language: ${bestCoverage.lang} (${bestCoverage.coverage}% coverage)`
);

// Show languages that needed the most additions
const needMostWork = Object.entries(missingKeysReport)
	.filter(([lang, missing]) => missing.length > 0)
	.sort(([, a], [, b]) => b.length - a.length)
	.slice(0, 5);

if (needMostWork.length > 0) {
	console.log("\nLanguages needing most translation work:");
	needMostWork.forEach(([lang, missing]) => {
		console.log(`  ${lang}: ${missing.length} missing keys`);
	});
}

console.log("\n🎉 All language files have been normalized!");
console.log('📝 Missing keys are marked with "**TRANSLATION_NEEDED**" prefix');
console.log("💾 Original files have been backed up with .backup extension");
