"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var shortid_1 = require("shortid");
var dns_1 = require("dns");
var server = (0, express_1.default)();
var urlList = {};
var validateUrl = function (url) {
    var urlRegex = new RegExp('^(http|https)://', 'i');
    return urlRegex.test(url);
};
var validateDomain = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var domain;
    return __generator(this, function (_a) {
        domain = new URL(url).hostname;
        return [2 /*return*/, new Promise(function (resolve, reject) {
                dns_1.default.lookup(domain, function (err) {
                    if (err) {
                        reject(false);
                    }
                    resolve(true);
                });
            })];
    });
}); };
var urlShortener = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1, shortId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!validateUrl(url)) {
                    throw new Error('Invalid URL');
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, validateDomain(url)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                throw new Error('Invalid domain');
            case 4:
                shortId = shortid_1.default.generate();
                urlList[shortId] = url;
                return [2 /*return*/, shortId];
        }
    });
}); };
var shortenUrl = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var url, shortId, error_2, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = req.body.url;
                if (!url) {
                    return [2 /*return*/, next(new Error('URL is required'))];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, urlShortener(url)];
            case 2:
                shortId = _a.sent();
                res.status(200).json({
                    status: 'success',
                    shortId: shortId,
                });
                next();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                errorMessage = void 0;
                if (error_2 instanceof Error) {
                    if (error_2.message === 'Invalid URL') {
                        errorMessage = 'Invalid URL';
                    }
                    if (error_2.message === 'Invalid domain') {
                        errorMessage = 'Invalid domain';
                    }
                }
                res.status(400).json({
                    status: 'error',
                    error: errorMessage,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var redirectUrl = function (req, res, next) {
    var shortId = req.params.shortId;
    var url = urlList[shortId];
    if (!url) {
        res.status(404).json({
            status: 'error',
            error: 'URL not found',
        });
    }
    res.redirect(301, url);
};
var generateStatusCode = function (statusCode) {
    if (statusCode >= 200 && statusCode < 300) {
        var status_1 = "\x1b[32m" + statusCode + "\x1b[0m";
        return status_1;
    }
    if (statusCode >= 300 && statusCode < 400) {
        var status_2 = "\x1b[33m" + statusCode + "\x1b[0m";
        return status_2;
    }
    if (statusCode >= 400) {
        var status_3 = "\x1b[31m" + statusCode + "\x1b[0m";
        return status_3;
    }
    return statusCode.toString();
};
var logger = function (req, res, next) {
    var defaultWrite = res.write;
    var defaultEnd = res.end;
    var chunks = [];
    // @ts-ignore
    res.write = function () {
        var restArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            restArgs[_i] = arguments[_i];
        }
        chunks.push(Buffer.from(restArgs[0]));
        // @ts-ignore
        defaultWrite.apply(res, restArgs);
    };
    // @ts-ignore
    res.end = function () {
        var restArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            restArgs[_i] = arguments[_i];
        }
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        var time = new Date().toISOString();
        console.log("[".concat(time, "] ").concat(req.method, " ").concat(req.url, " ").concat(generateStatusCode(res.statusCode)));
        // @ts-ignore
        defaultEnd.apply(res, restArgs);
    };
    next();
};
server.use(logger);
server.use(express_1.default.json());
server.post('/shorten', shortenUrl);
server.get('/shorten/:shortId', redirectUrl);
server.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});
