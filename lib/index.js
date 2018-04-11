"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var execute = function (module, defaultInit) {
    if (typeof module === 'function') {
        module();
    }
    else if (typeof module[defaultInit] === 'function') {
        module[defaultInit]();
    }
    else {
        throw new Error("Entry does not export function nor object with \"" + defaultInit + "\" function");
    }
};
var executeEntry = function (entry, defaultInit) {
    if (typeof entry === 'function') {
        execute(entry, defaultInit);
    }
    else if (entry.default) {
        execute(entry.default, defaultInit);
    }
    else {
        Object.keys(entry).forEach(function (key) { return entry[key] && execute(entry[key], defaultInit); });
    }
};
var loadEntry = function (entry, config) {
    var finalConfig = __assign({ event: 'DOMContentLoaded', init: 'init' }, ((typeof config === 'string' ? { init: config } : config) || {}));
    if (document && document.addEventListener && finalConfig.event) {
        document.addEventListener(finalConfig.event, function () { return executeEntry(entry, finalConfig.init); });
    }
    else {
        executeEntry(entry, finalConfig.init);
    }
};
exports.default = loadEntry;
