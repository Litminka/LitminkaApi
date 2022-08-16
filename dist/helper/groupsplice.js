"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function groupArrSplice(arr, size) {
    const output = [];
    for (var i = 0; i < arr.length; i += size) {
        output.push(arr.slice(i, i + size));
    }
    return output;
}
exports.default = groupArrSplice;
//# sourceMappingURL=groupsplice.js.map