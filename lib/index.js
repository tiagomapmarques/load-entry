"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execute = function (module, defaultInit) {
    if (typeof module === 'function') {
        module();
        // tslint:disable-next-line:strict-type-predicates
    }
    else if (typeof module[defaultInit] === 'function') {
        module[defaultInit]();
    }
    else {
        throw new Error("Entry does not export function nor object with \"" + defaultInit + "\" function");
    }
};
var loadEntry = function (entry, defaultInit) {
    if (defaultInit === void 0) { defaultInit = 'init'; }
    return document.addEventListener('DOMContentLoaded', function () {
        if (typeof entry === 'function') {
            execute(entry, defaultInit);
        }
        else if (entry.default) {
            execute(entry.default, defaultInit);
        }
        else {
            Object.keys(entry).forEach(function (key) { return entry[key] && execute(entry[key], defaultInit); });
        }
    });
};
// tslint:disable-next-line:no-default-export
exports.default = loadEntry;
