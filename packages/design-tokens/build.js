const StyleDictionaryPackage = require("style-dictionary");

function getStyleDictionaryConfig(platform) {
  return {
    source: ["src/globals/**/*.json", `src/platforms/${platform}/*.json`],
    platforms: {
      "web/js": {
        transformGroup: "tokens-web-js",
        buildPath: "dist/web/",
        files: [
          {
            destination: "tokens.js",
            format: "javascript/es6",
          },
        ],
      },
      "web/json": {
        transformGroup: "tokens-web-json",
        buildPath: "dist/web/",
        files: [
          {
            destination: "tokens.json",
            format: "json/flat",
          },
        ],
      },
      "web/scss": {
        transformGroup: "tokens-web-scss",
        buildPath: `dist/web/`,
        files: [
          {
            destination: "tokens.scss",
            format: "scss/variables",
          },
        ],
      },
      "web/vars": {
        transformGroup: "tokens-web-vars",
        buildPath: `dist/web/`,
        files: [
          {
            destination: "tokens.css",
            format: "css/variables",
            options: {
                outputReferences: true
            }
          },
        ],
      },

      "native/js": {
        transformGroup: "tokens-native-js",
        buildPath: "dist/native/",
        files: [
          {
            destination: "tokens.js",
            format: "javascript/es6",
          },
        ],
      },
      "native/json": {
        transformGroup: "tokens-native-json",
        buildPath: "dist/native/",
        files: [
          {
            destination: "tokens.json",
            format: "json/flat",
          },
        ],
      },
    },
  };
}

// CUSTOM FORMATS

StyleDictionaryPackage.registerFormat({
  name: "json/flat",
  formatter: function (dictionary) {
    return JSON.stringify(dictionary.allProperties, null, 2);
  },
});

// TRANSFORMERS

StyleDictionaryPackage.registerTransform({
  name: "size/pxToPt",
  type: "value",
  matcher: function (prop) {
    return prop.value.match(/^[\d.]+px$/);
  },
  transformer: function (prop) {
    return prop.value.replace(/px$/, "pt");
  },
});

StyleDictionaryPackage.registerTransform({
  name: "size/pxToDp",
  type: "value",
  matcher: function (prop) {
    return prop.value.match(/^[\d.]+px$/);
  },
  transformer: function (prop) {
    return prop.value.replace(/px$/, "dp");
  },
});

StyleDictionaryPackage.registerFormat({
  name: "css/variables",
  formatter: function ({ dictionary, options }) {
    return `:root {
        ${dictionary.allProperties
          .map((prop) => {
            let value = prop.value;

            if (options.outputReferences) {
              if (dictionary.usesReference(prop.original.value)) {
                const reference = dictionary.getReferences(prop.original.value)[0];

                value = reference.name;
                return `  --${prop.name}: var(--${value}, ${prop.value});`;
              }
            }
            return `  --${prop.name}: ${prop.value};`;
          })
          .join("\n")}
      }`;
  },
});

// TRANSFORM GROUPS

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-js",
  transforms: ["name/cti/constant", "size/px", "color/hex"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-json",
  transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-scss",
  transforms: ["name/cti/kebab", "time/seconds", "size/px", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-vars",
  transforms: ["name/cti/kebab", "time/seconds", "size/px", "color/css"],
  format: "css/variables",
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-native-js",
  transforms: ["name/cti/constant", "size/px", "color/hex"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-native-json",
  transforms: ["attribute/cti", "name/cti/camel", "size/pxToPt"],
});

console.log("Build started...");

["web", "native"].map(function (platform) {
  console.log("\n==============================================");
  console.log(`\nProcessing: [${platform}]`);

  const StyleDictionary = StyleDictionaryPackage.extend(
    getStyleDictionaryConfig(platform)
  );

  if (platform === "web") {
    StyleDictionary.buildPlatform("web/js");
    StyleDictionary.buildPlatform("web/json");
    StyleDictionary.buildPlatform("web/scss");
    StyleDictionary.buildPlatform("web/vars");
  } else if (platform === "native") {
    StyleDictionary.buildPlatform("native/js");
    StyleDictionary.buildPlatform("native/json");
  }

  console.log("\nEnd processing");
});

console.log("\nBuild completed!");
