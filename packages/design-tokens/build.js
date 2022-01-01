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
      "web/ts": {
        transformGroup: "tokens-web-ts",
        buildPath: "dist/web/",
        files: [
          {
            destination: "tokens.d.ts",
            format: "typescript/es6-declarations",
          },
        ],
      },
      "web/json": {
        transformGroup: "tokens-web-json",
        buildPath: "dist/web/",
        files: [
          {
            destination: "meta.json",
            format: "json/list",
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
              outputReferences: true,
            },
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
      "native/ts": {
        transformGroup: "tokens-native-ts",
        buildPath: "dist/native/",
        files: [
          {
            destination: "tokens.d.ts",
            format: "typescript/es6-declarations",
          },
        ],
      },
      "native/json": {
        transformGroup: "tokens-native-json",
        buildPath: "dist/native/",
        files: [
          {
            destination: "meta.json",
            format: "json/list",
          },
        ],
      },
    },
  };
}

// CUSTOM FORMATS

StyleDictionaryPackage.registerFormat({
  name: "json/list",
  formatter: function (dictionary) {
    return JSON.stringify(dictionary.allProperties, null, 2);
  },
});

// TRANSFORMERS

// TRANSFORM GROUPS

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-js",
  transforms: ["name/cti/constant", "size/rem", "color/hex"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-ts",
  transforms: ["name/cti/constant", "size/rem", "color/hex"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-json",
  transforms: ["attribute/cti", "name/cti/kebab", "size/rem", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-scss",
  transforms: ["name/cti/kebab", "time/seconds", "size/rem", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-web-vars",
  transforms: ["name/cti/kebab", "time/seconds", "size/rem", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-native-js",
  transforms: ["name/cti/constant", "size/object", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-native-ts",
  transforms: ["name/cti/constant", "size/object", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-native-json",
  transforms: ["attribute/cti", "name/cti/camel"],
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
    StyleDictionary.buildPlatform("web/ts");
    StyleDictionary.buildPlatform("web/json");
    StyleDictionary.buildPlatform("web/scss");
    StyleDictionary.buildPlatform("web/vars");
  } else if (platform === "native") {
    StyleDictionary.buildPlatform("native/js");
    StyleDictionary.buildPlatform("native/ts");
    StyleDictionary.buildPlatform("native/json");
  }

  console.log("\nEnd processing");
});

console.log("\nBuild completed!");
