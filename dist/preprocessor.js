'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var crypto = require('crypto');
var tsc = require('typescript');
var logger_1 = require('./logger');
var postprocess_1 = require('./postprocess');
var utils_1 = require('./utils');
function process(src, filePath, jestConfig, transformOptions) {
  if (transformOptions === void 0) {
    transformOptions = { instrument: false };
  }
  var compilerOptions = utils_1.getTSConfig(
    jestConfig.globals,
    jestConfig.rootDir,
    transformOptions.instrument
  );
  logger_1.logOnce('final compilerOptions:', compilerOptions);
  var isTsFile = /\.tsx?$/.test(filePath);
  var isJsFile = /\.jsx?$/.test(filePath);
  var isHtmlFile = /\.html$/.test(filePath);
  if (isHtmlFile && jestConfig.globals.__TRANSFORM_HTML__) {
    src = 'module.exports=`' + src + '`;';
  }
  var processFile =
    compilerOptions.allowJs === true ? isTsFile || isJsFile : isTsFile;
  if (!processFile) {
    return src;
  }
  var tsJestConfig = utils_1.getTSJestConfig(jestConfig.globals);
  logger_1.logOnce('tsJestConfig: ', tsJestConfig);
  if (tsJestConfig.enableTsDiagnostics) {
    utils_1.runTsDiagnostics(filePath, compilerOptions);
  }
  var tsTranspiled = tsc.transpileModule(src, {
    compilerOptions: compilerOptions,
    fileName: filePath,
  });
  var postHook = postprocess_1.getPostProcessHook(
    compilerOptions,
    jestConfig,
    tsJestConfig
  );
  var outputText = postHook(
    tsTranspiled.outputText,
    filePath,
    jestConfig,
    transformOptions
  );
  var modified = utils_1.injectSourcemapHook(
    filePath,
    tsTranspiled.outputText,
    outputText
  );
  logger_1.flushLogs();
  return { code: modified, map: tsTranspiled.sourceMapText };
}
exports.process = process;
function getCacheKey(fileData, filePath, jestConfigStr, transformOptions) {
  if (transformOptions === void 0) {
    transformOptions = { instrument: false };
  }
  var jestConfig = JSON.parse(jestConfigStr);
  var tsConfig = utils_1.getTSConfig(
    jestConfig.globals,
    jestConfig.rootDir,
    transformOptions.instrument
  );
  return crypto
    .createHash('md5')
    .update(JSON.stringify(tsConfig), 'utf8')
    .update(JSON.stringify(transformOptions), 'utf8')
    .update(fileData + filePath + jestConfigStr, 'utf8')
    .digest('hex');
}
exports.getCacheKey = getCacheKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ByZXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUNqQyxnQ0FBa0M7QUFFbEMsbUNBQThDO0FBQzlDLDZDQUFtRDtBQUNuRCxpQ0FNaUI7QUFFakIsaUJBQ0UsR0FBVyxFQUNYLFFBQWMsRUFDZCxVQUFzQixFQUN0QixnQkFBMEQ7SUFBMUQsaUNBQUEsRUFBQSxxQkFBdUMsVUFBVSxFQUFFLEtBQUssRUFBRTtJQUkxRCxJQUFNLGVBQWUsR0FBRyxtQkFBVyxDQUNqQyxVQUFVLENBQUMsT0FBTyxFQUNsQixVQUFVLENBQUMsT0FBTyxFQUNsQixnQkFBZ0IsQ0FBQyxVQUFVLENBQzVCLENBQUM7SUFFRixnQkFBTyxDQUFDLHdCQUF3QixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRW5ELElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUMsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRzVDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUN4RCxHQUFHLEdBQUcsa0JBQWtCLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBTSxXQUFXLEdBQ2YsZUFBZSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUVyRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxJQUFNLFlBQVksR0FBRyx1QkFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6RCxnQkFBTyxDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRXhDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDckMsd0JBQWdCLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxJQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRTtRQUM1QyxlQUFlLGlCQUFBO1FBQ2YsUUFBUSxFQUFFLFFBQVE7S0FDbkIsQ0FBQyxDQUFDO0lBRUgsSUFBTSxRQUFRLEdBQUcsZ0NBQWtCLENBQ2pDLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxDQUNiLENBQUM7SUFFRixJQUFNLFVBQVUsR0FBRyxRQUFRLENBQ3pCLFlBQVksQ0FBQyxVQUFVLEVBQ3ZCLFFBQVEsRUFDUixVQUFVLEVBQ1YsZ0JBQWdCLENBQ2pCLENBQUM7SUFFRixJQUFNLFFBQVEsR0FBRywyQkFBbUIsQ0FDbEMsUUFBUSxFQUNSLFlBQVksQ0FBQyxVQUFVLEVBQ3ZCLFVBQVUsQ0FDWCxDQUFDO0lBRUYsa0JBQVMsRUFBRSxDQUFDO0lBRVosTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzdELENBQUM7QUFsRUQsMEJBa0VDO0FBRUQscUJBQ0UsUUFBZ0IsRUFDaEIsUUFBYyxFQUNkLGFBQXFCLEVBQ3JCLGdCQUEwRDtJQUExRCxpQ0FBQSxFQUFBLHFCQUF1QyxVQUFVLEVBQUUsS0FBSyxFQUFFO0lBRTFELElBQU0sVUFBVSxHQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFFekQsSUFBTSxRQUFRLEdBQUcsbUJBQVcsQ0FDMUIsVUFBVSxDQUFDLE9BQU8sRUFDbEIsVUFBVSxDQUFDLE9BQU8sRUFDbEIsZ0JBQWdCLENBQUMsVUFBVSxDQUM1QixDQUFDO0lBRUYsTUFBTSxDQUFDLE1BQU07U0FDVixVQUFVLENBQUMsS0FBSyxDQUFDO1NBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQztTQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLE1BQU0sQ0FBQztTQUNoRCxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsR0FBRyxhQUFhLEVBQUUsTUFBTSxDQUFDO1NBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixDQUFDO0FBcEJELGtDQW9CQyJ9
