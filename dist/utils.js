'use strict';
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var crypto = require('crypto');
var fs = require('fs');
var fsExtra = require('fs-extra');
var path = require('path');
var tsc = require('typescript');
var logger_1 = require('./logger');
function getTSJestConfig(globals) {
  return globals && globals['ts-jest'] ? globals['ts-jest'] : {};
}
exports.getTSJestConfig = getTSJestConfig;
function formatTscParserErrors(errors) {
  return errors
    .map(function(s) {
      return JSON.stringify(s, null, 4);
    })
    .join('\n');
}
function readCompilerOptions(configPath, rootDir) {
  configPath = path.resolve(rootDir, configPath);
  var loaded = tsc.readConfigFile(configPath, function(file) {
    var read = tsc.sys.readFile(file);
    if (!read) {
      throw new Error(
        "ENOENT: no such file or directory, open '" + configPath + "'"
      );
    }
    return read;
  });
  if (loaded.error) {
    throw new Error(JSON.stringify(loaded.error, null, 4));
  }
  var basePath = path.dirname(configPath);
  var parsedConfig = tsc.parseJsonConfigFileContent(
    loaded.config,
    tsc.sys,
    basePath
  );
  if (parsedConfig.errors.length > 0) {
    var formattedErrors = formatTscParserErrors(parsedConfig.errors);
    throw new Error(
      'Some errors occurred while attempting to read from ' +
        configPath +
        ': ' +
        formattedErrors
    );
  }
  return parsedConfig.options;
}
function getStartDir() {
  var grandparent = path.resolve(__dirname, '..', '..');
  if (grandparent.endsWith('/node_modules')) {
    return process.cwd();
  }
  return '.';
}
function getPathToClosestTSConfig(startDir, previousDir) {
  if (!startDir) {
    return getPathToClosestTSConfig(getStartDir());
  }
  var tsConfigPath = path.join(startDir, 'tsconfig.json');
  var startDirPath = path.resolve(startDir);
  var previousDirPath = path.resolve(previousDir || '/');
  if (startDirPath === previousDirPath || fs.existsSync(tsConfigPath)) {
    return tsConfigPath;
  }
  return getPathToClosestTSConfig(path.join(startDir, '..'), startDir);
}
function getTSConfigPathFromConfig(globals) {
  var defaultTSConfigFile = getPathToClosestTSConfig();
  if (!globals) {
    return defaultTSConfigFile;
  }
  var tsJestConfig = getTSJestConfig(globals);
  if (tsJestConfig.tsConfigFile) {
    return tsJestConfig.tsConfigFile;
  }
  return defaultTSConfigFile;
}
function mockGlobalTSConfigSchema(globals) {
  var configPath = getTSConfigPathFromConfig(globals);
  return { 'ts-jest': { tsConfigFile: configPath } };
}
exports.mockGlobalTSConfigSchema = mockGlobalTSConfigSchema;
var tsConfigCache = {};
function getTSConfig(globals, rootDir, collectCoverage) {
  if (rootDir === void 0) {
    rootDir = '';
  }
  if (collectCoverage === void 0) {
    collectCoverage = false;
  }
  var configPath = getTSConfigPathFromConfig(globals);
  logger_1.logOnce('Reading tsconfig file from path ' + configPath);
  var skipBabel = getTSJestConfig(globals).skipBabel;
  var tsConfigCacheKey = JSON.stringify([
    skipBabel,
    collectCoverage,
    configPath,
  ]);
  if (tsConfigCacheKey in tsConfigCache) {
    return tsConfigCache[tsConfigCacheKey];
  }
  var config = readCompilerOptions(configPath, rootDir);
  logger_1.logOnce(
    'Original typescript config before modifications: ',
    __assign({}, config)
  );
  config.inlineSourceMap = true;
  config.inlineSources = true;
  delete config.sourceMap;
  delete config.outDir;
  if (configPath === path.join(getStartDir(), 'tsconfig.json')) {
    config.module = tsc.ModuleKind.CommonJS;
  }
  config.module = config.module || tsc.ModuleKind.CommonJS;
  config.jsx = config.jsx || tsc.JsxEmit.React;
  if (config.allowSyntheticDefaultImports && !skipBabel) {
    config.module = tsc.ModuleKind.ES2015;
  }
  tsConfigCache[tsConfigCacheKey] = config;
  return config;
}
exports.getTSConfig = getTSConfig;
function cacheFile(jestConfig, filePath, src) {
  if (!jestConfig.testRegex || !filePath.match(jestConfig.testRegex)) {
    var outputFilePath = path.join(
      jestConfig.cacheDirectory,
      '/ts-jest/',
      crypto
        .createHash('md5')
        .update(filePath)
        .digest('hex')
    );
    fsExtra.outputFileSync(outputFilePath, src);
  }
}
exports.cacheFile = cacheFile;
function injectSourcemapHook(filePath, typeScriptCode, src) {
  var start = src.length > 12 ? src.substr(1, 10) : '';
  var filePathParam = JSON.stringify(filePath);
  var codeParam = JSON.stringify(typeScriptCode);
  var sourceMapHook =
    "require('ts-jest').install(" + filePathParam + ', ' + codeParam + ')';
  return start === 'use strict'
    ? "'use strict';" + sourceMapHook + ';' + src
    : sourceMapHook + ';' + src;
}
exports.injectSourcemapHook = injectSourcemapHook;
function runTsDiagnostics(filePath, compilerOptions) {
  var program = tsc.createProgram([filePath], compilerOptions);
  var allDiagnostics = tsc.getPreEmitDiagnostics(program);
  var formattedDiagnostics = allDiagnostics.map(function(diagnostic) {
    if (diagnostic.file) {
      var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start),
        line = _a.line,
        character = _a.character;
      var message = tsc.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );
      return (
        path.relative(process.cwd(), diagnostic.file.fileName) +
        ' (' +
        (line + 1) +
        ',' +
        (character + 1) +
        '): ' +
        message +
        '\n'
      );
    }
    return '' + tsc.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  });
  if (formattedDiagnostics.length) {
    throw new Error(formattedDiagnostics.join(''));
  }
}
exports.runTsDiagnostics = runTsDiagnostics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtCQUFpQztBQUNqQyx1QkFBeUI7QUFDekIsa0NBQW9DO0FBQ3BDLDJCQUE2QjtBQUM3QixnQ0FBa0M7QUFFbEMsbUNBQW1DO0FBRW5DLHlCQUFnQyxPQUFZO0lBQzFDLE1BQU0sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNqRSxDQUFDO0FBRkQsMENBRUM7QUFFRCwrQkFBK0IsTUFBd0I7SUFDckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEUsQ0FBQztBQUVELDZCQUE2QixVQUFrQixFQUFFLE9BQWU7SUFDOUQsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRy9DLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLFVBQUEsSUFBSTtRQUNoRCxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUlwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDVixNQUFNLElBQUksS0FBSyxDQUNiLDhDQUE0QyxVQUFVLE1BQUcsQ0FDMUQsQ0FBQztRQUNKLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMs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
