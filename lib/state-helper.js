"use strict";
// From https://github.com/actions/checkout/blob/master/src/state-helper.ts
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const coreCommand = __importStar(require("@actions/core/lib/command"));
/**
 * Indicates whether the POST action is running
 */
exports.IsPost = !!process.env['STATE_isPost'];
// Publish a variable so that when the POST action runs, it can determine it should run the cleanup logic.
// This is necessary since we don't have a separate entry point.
if (!exports.IsPost) {
    coreCommand.issueCommand('save-state', { name: 'isPost' }, 'true');
}
