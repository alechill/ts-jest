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
var babel = require('babel-core');
var babel_plugin_istanbul_1 = require('babel-plugin-istanbul');
var jestPreset = require('babel-preset-jest');
var logger_1 = require('./logger');
function createBabelTransformer(options) {
  options = __assign({}, options, {
    plugins: options.plugins || [],
    presets: (options.presets || []).concat([jestPreset]),
    retainLines: true,
    sourceMaps: 'inline',
  });
  delete options.cacheDirectory;
  delete options.filename;
  return function(src, filename, config, transformOptions) {
    var theseOptions = Object.assign({ filename: filename }, options);
    if (transformOptions && transformOptions.instrument) {
      theseOptions.auxiliaryCommentBefore = ' istanbul ignore next ';
      theseOptions.plugins = theseOptions.plugins.concat([
        [
          babel_plugin_istanbul_1.default,
          {
            cwd: config.rootDir,
            exclude: [],
          },
        ],
      ]);
    }
    return babel.transform(src, theseOptions).code;
  };
}
exports.getPostProcessHook = function(
  tsCompilerOptions,
  jestConfig,
  tsJestConfig
) {
  if (tsJestConfig.skipBabel) {
    logger_1.logOnce('Not using any postprocess hook.');
    return function(src) {
      return src;
    };
  }
  var plugins = Array.from(
    (tsJestConfig.babelConfig && tsJestConfig.babelConfig.plugins) || []
  );
  if (tsCompilerOptions.allowSyntheticDefaultImports) {
    plugins.push('transform-es2015-modules-commonjs');
  }
  var babelOptions = __assign({}, tsJestConfig.babelConfig, {
    babelrc: tsJestConfig.useBabelrc || false,
    plugins: plugins,
    presets: tsJestConfig.babelConfig ? tsJestConfig.babelConfig.presets : [],
  });
  logger_1.logOnce('Using babel with options:', babelOptions);
  return createBabelTransformer(babelOptions);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdHByb2Nlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcG9zdHByb2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBLGtDQUFvQztBQUNwQywrREFBbUQ7QUFDbkQsOENBQWdEO0FBVWhELG1DQUFtQztBQUVuQyxnQ0FBZ0MsT0FBOEI7SUFDNUQsT0FBTyxnQkFDRixPQUFPLElBQ1YsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxFQUM5QixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBR3JELFdBQVcsRUFBRSxJQUFJLEVBR2pCLFVBQVUsRUFBRSxRQUFRLEdBQ3JCLENBQUM7SUFDRixPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUM7SUFDOUIsT0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBRXhCLE1BQU0sQ0FBQyxVQUNMLEdBQVcsRUFDWCxRQUFnQixFQUNoQixNQUFrQixFQUNsQixnQkFBa0M7UUFFbEMsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsVUFBQSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUQsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwRCxZQUFZLENBQUMsc0JBQXNCLEdBQUcsd0JBQXdCLENBQUM7WUFFL0QsWUFBWSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQkFDakQ7b0JBQ0UsK0JBQWM7b0JBQ2Q7d0JBRUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxPQUFPO3dCQUNuQixPQUFPLEVBQUUsRUFBRTtxQkFDWjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2pELENBQUMsQ0FBQztBQUNKLENBQUM7QUFFWSxRQUFBLGtCQUFrQixHQUFHLFVBQ2hDLGlCQUFrQyxFQUNsQyxVQUFzQixFQUN0QixZQUEwQjtJQUUxQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMzQixnQkFBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxFQUFILENBQUcsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDeEIsQ0FBQyxZQUFZLENBQUMsV0FBVyxJQUFJLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUNyRSxDQUFDO0lBRUYsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsSUFBTSxZQUFZLGdCQUNiLFlBQVksQ0FBQyxXQUFXLElBQzNCLE9BQU8sRUFBRSxZQUFZLENBQUMsVUFBVSxJQUFJLEtBQUssRUFDekMsT0FBTyxTQUFBLEVBQ1AsT0FBTyxFQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQzFFLENBQUM7SUFFRixnQkFBTyxDQUFDLDJCQUEyQixFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRW5ELE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUMifQ==
