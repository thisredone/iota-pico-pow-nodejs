var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var arrayHelper_1 = require("@iota-pico/core/dist/helpers/arrayHelper");
var numberHelper_1 = require("@iota-pico/core/dist/helpers/numberHelper");
var objectHelper_1 = require("@iota-pico/core/dist/helpers/objectHelper");
var cryptoError_1 = require("@iota-pico/crypto/dist/error/cryptoError");
var trytes_1 = require("@iota-pico/data/dist/data/trytes");
var ffi = __importStar(require("ffi"));
var fs = __importStar(require("fs"));
var os = __importStar(require("os"));
var path = __importStar(require("path"));
var util = __importStar(require("util"));
/**
 * ProofOfWork implementation using NodeJS.
 */
var ProofOfWorkNodeJs = /** @class */ (function () {
    /**
     * Create a new instance of ProofOfWork.
     * @param nodePlatform Provides platform specific functions, optional mostly used for testing.
     */
    function ProofOfWorkNodeJs(nodePlatform) {
        if (objectHelper_1.ObjectHelper.isEmpty(nodePlatform)) {
            this._nodePlatform = {
                pathResolve: path.resolve,
                pathJoin: path.join,
                platform: os.platform,
                lstat: fs.lstat,
                loadLibrary: ffi.Library
            };
        }
        else {
            this._nodePlatform = nodePlatform;
        }
    }
    /**
     * Allow the proof of work to perform any initialization.
     * Will throw an exception if the implementation is not supported.
     */
    ProofOfWorkNodeJs.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, platform, libFile, stat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullPath = this._nodePlatform.pathJoin(path.join(__dirname, "../binaries/"));
                        platform = this._nodePlatform.platform();
                        libFile = this._nodePlatform.pathJoin(fullPath, platform, "libccurl");
                        switch (platform) {
                            case "darwin":
                                libFile += ".dylib";
                                break;
                            case "win32":
                                libFile += ".dll";
                                break;
                            default: libFile += ".so";
                        }
                        return [4 /*yield*/, util.promisify(this._nodePlatform.lstat)(libFile)];
                    case 1:
                        stat = _a.sent();
                        if (stat.isFile()) {
                            this._library = this._nodePlatform.loadLibrary(libFile, {
                                ccurl_pow: ["string", ["string", "int"]]
                            });
                        }
                        else {
                            throw new cryptoError_1.CryptoError("Library files does not exist", { libFile: libFile });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Performs single conversion per pow call.
     * @returns True if pow only does one conversion.
     */
    ProofOfWorkNodeJs.prototype.performsSingle = function () {
        return true;
    };
    /**
     * Perform a proof of work on the data.
     * @param trunkTransaction The trunkTransaction to use for the pow.
     * @param branchTransaction The branchTransaction to use for the pow.
     * @param trytes The trytes to perform the pow on.
     * @param minWeightMagnitude The minimum weight magnitude.
     * @returns The trytes produced by the proof of work.
     */
    ProofOfWorkNodeJs.prototype.pow = function (trunkTransaction, branchTransaction, trytes, minWeightMagnitude) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (objectHelper_1.ObjectHelper.isEmpty(_this._library)) {
                            throw new cryptoError_1.CryptoError("Library not loaded, have you called initialize");
                        }
                        if (!arrayHelper_1.ArrayHelper.isTyped(trytes, trytes_1.Trytes)) {
                            throw new cryptoError_1.CryptoError("The trytes must be an array of type Trytes");
                        }
                        if (!numberHelper_1.NumberHelper.isInteger(minWeightMagnitude) || minWeightMagnitude <= 0) {
                            throw new cryptoError_1.CryptoError("The minWeightMagnitude must be > 0");
                        }
                        _this._library.ccurl_pow.async(trytes[0].toString(), minWeightMagnitude, function (error, returnedTrytes) {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve([trytes_1.Trytes.fromString(returnedTrytes)]);
                            }
                        });
                    })];
            });
        });
    };
    return ProofOfWorkNodeJs;
}());
exports.ProofOfWorkNodeJs = ProofOfWorkNodeJs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvb2ZPZldvcmtOb2RlSnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvb2ZPZldvcmtOb2RlSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdFQUF1RTtBQUN2RSwwRUFBeUU7QUFDekUsMEVBQXlFO0FBQ3pFLHdFQUF1RTtBQUd2RSwyREFBMEQ7QUFDMUQsdUNBQTJCO0FBQzNCLHFDQUF5QjtBQUN6QixxQ0FBeUI7QUFDekIseUNBQTZCO0FBQzdCLHlDQUE2QjtBQUc3Qjs7R0FFRztBQUNIO0lBV0k7OztPQUdHO0lBQ0gsMkJBQVksWUFBNEI7UUFDcEMsRUFBRSxDQUFDLENBQUMsMkJBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxhQUFhLEdBQUc7Z0JBQ2pCLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNuQixRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVE7Z0JBQ3JCLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSztnQkFDZixXQUFXLEVBQUUsR0FBRyxDQUFDLE9BQU87YUFDM0IsQ0FBQztRQUNOLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ3RDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ1Usc0NBQVUsR0FBdkI7Ozs7Ozt3QkFDVSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFFN0UsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBRTNDLE9BQU8sR0FBRyxJQUFJLENBQUMs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