'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var fs = require('fs');
var path = require('path');
var logs = [];
var logsFlushed = false;
function shouldLog() {
  return process.env.TS_JEST_DEBUG && !logsFlushed;
}
function logOnce() {
  var thingsToLog = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    thingsToLog[_i] = arguments[_i];
  }
  if (!shouldLog()) {
    return;
  }
  logs.push(thingsToLog);
}
exports.logOnce = logOnce;
function flushLogs() {
  if (!shouldLog()) {
    return;
  }
  logsFlushed = true;
  var rootPath = path.resolve(__dirname, '../');
  var JSONifiedLogs = logs.map(convertToJSONIfPossible);
  var logString = JSONifiedLogs.join('\n');
  var filePath = path.resolve(rootPath, 'debug.txt');
  fs.writeFileSync(filePath, logString);
}
exports.flushLogs = flushLogs;
function includes(array, subject) {
  return array.indexOf(subject) !== -1;
}
function convertToJSONIfPossible(object) {
  try {
    return JSON.stringify(object, null, 2);
  } catch (_a) {
    return object.toString();
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFRN0IsSUFBTSxJQUFJLEdBQVUsRUFBRSxDQUFDO0FBQ3ZCLElBQUksV0FBVyxHQUFZLEtBQUssQ0FBQztBQUVqQztJQUVFLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNuRCxDQUFDO0FBR0Q7SUFBd0IscUJBQXFCO1NBQXJCLFVBQXFCLEVBQXJCLHFCQUFxQixFQUFyQixJQUFxQjtRQUFyQixnQ0FBcUI7O0lBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQztJQUNULENBQUM7SUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFMRCwwQkFLQztBQUdEO0lBQ0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUNELFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEQsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3hELElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDckQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQVZELDhCQVVDO0FBRUQsa0JBQXFCLEtBQVUsRUFBRSxPQUFVO0lBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxpQ0FBaUMsTUFBVztJQUMxQyxJQUFJLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxJQUFELENBQUM7UUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNCLENBQUM7QUFDSCxDQUFDIn0=
