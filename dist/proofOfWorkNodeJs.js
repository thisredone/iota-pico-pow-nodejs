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
var promisify = require('util.promisify');
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
                        return [4 /*yield*/, promisify(this._nodePlatform.lstat)(libFile)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvb2ZPZldvcmtOb2RlSnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvb2ZPZldvcmtOb2RlSnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdFQUF1RTtBQUN2RSwwRUFBeUU7QUFDekUsMEVBQXlFO0FBQ3pFLHdFQUF1RTtBQUd2RSwyREFBMEQ7QUFDMUQsdUNBQTJCO0FBQzNCLHFDQUF5QjtBQUN6QixxQ0FBeUI7QUFDekIseUNBQTZCO0FBRTdCLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRTVDOztHQUVHO0FBQ0g7SUFXSTs7O09BR0c7SUFDSCwyQkFBWSxZQUE0QjtRQUNwQyxFQUFFLENBQUMsQ0FBQywyQkFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLGFBQWEsR0FBRztnQkFDakIsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUN6QixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUTtnQkFDckIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLO2dCQUNmLFdBQVcsRUFBRSxHQUFHLENBQUMsT0FBTzthQUMzQixDQUFDO1FBQ04sQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFDdEMsQ0FBQztJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDVSxzQ0FBVSxHQUF2Qjs7Ozs7O3dCQUNVLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO3dCQUU3RSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFFM0MsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7NEJBQ2YsS0FBSyxRQUFRO2dDQUFFLE9BQU8sSUFBSSxRQUFRLENBQUM7Z0NBQUMsS0FBSyxDQUFDOzRCQUMxQyxLQUFLLE9BQU87Z0NBQUUsT0FBTyxJQUFJLE1BQU0sQ0FBQztnQ0FBQyxLQUFLLENBQUM7NEJBQ3ZDLFNBQVMsT0FBTyxJQUFJLEtBQUssQ0FBQzt3QkFDOUIsQ0FBQzt3QkFFWSxxQkFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBQTs7d0JBQXpELElBQUksR0FBRyxTQUFrRDt3QkFDL0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7Z0NBQ3BELFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQzs2QkFDM0MsQ0FBQyxDQUFDO3dCQUNQLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osTUFBTSxJQUFJLHlCQUFXLENBQUMsOEJBQThCLEVBQUUsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLENBQUM7d0JBQ3ZFLENBQUM7Ozs7O0tBQ0o7SUFFRDs7O09BR0c7SUFDSSwwQ0FBYyxHQUFyQjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDVSwrQkFBRyxHQUFoQixVQUFpQixnQkFBc0IsRUFBRSxpQkFBdUIsRUFBRSxNQUFnQixFQUFFLGtCQUEwQjs7OztnQkFDMUcsc0JBQU8sSUFBSSxPQUFPLENBQVcsVUFBQyxPQUFPLEVBQUUsTUFBTTt3QkFDekMsRUFBRSxDQUFDLENBQUMsMkJBQVksQ0FBQyxPQUFPLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdEMsTUFBTSxJQUFJLHlCQUFXLENBQUMsZ0RBQWdELENBQUMsQ0FBQzt3QkFDNUUsQ0FBQzt3QkFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLHlCQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxlQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZDLE1BQU0sSUFBSSx5QkFBVyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7d0JBQ3hFLENBQUM7d0JBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQywyQkFBWSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLGtCQUFrQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3pFLE1BQU0sSUFBSSx5QkFBVyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7d0JBQ2hFLENBQUM7d0JBQ0QsS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxVQUFDLEtBQUssRUFBRSxjQUFjOzRCQUMxRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dDQUNSLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDbEIsQ0FBQzs0QkFBQyxJQUFJLENBQUMsQ0FBQztnQ0FDSixPQUFPLENBQUMsQ0FBRSxlQUFNLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFFLENBQUMsQ0FBQzs0QkFDbkQsQ0FBQzt3QkFDTCxDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsRUFBQzs7O0tBQ047SUFDTCx3QkFBQztBQUFELENBQUMsQUEzRkQsSUEyRkM7QUEzRlksOENBQWlCIn0=