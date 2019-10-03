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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const installer = __importStar(require("../src/installer"));
describe('installer', () => {
    it('acquires 1.8.0 version of Mage', () => __awaiter(void 0, void 0, void 0, function* () {
        const mage = yield installer.getMage('1.8.0');
        expect(fs.existsSync(mage)).toBe(true);
    }), 100000);
    it('acquires latest version of Mage', () => __awaiter(void 0, void 0, void 0, function* () {
        const mage = yield installer.getMage('latest');
        expect(fs.existsSync(mage)).toBe(true);
    }), 100000);
});
