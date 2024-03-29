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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../core/middlewares/auth.middleware"));
const profile_service_1 = require("./profile.service");
const router = (0, express_1.Router)();
/**
 * Get profile
 * @auth optional
 * @route {GET} /profiles/:username
 * @param username string
 * @returns profile
 */
router.get('/profiles/:username', auth_middleware_1.default.optional, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const profile = yield (0, profile_service_1.getProfile)(req.params.username, (_b = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        res.json({ profile });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Follow user
 * @auth required
 * @route {POST} /profiles/:username/follow
 * @param username string
 * @returns profile
 */
router.post('/profiles/:username/follow', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    try {
        const profile = yield (0, profile_service_1.followUser)((_c = req.params) === null || _c === void 0 ? void 0 : _c.username, (_e = (_d = req.auth) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.id);
        res.json({ profile });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Unfollow user
 * @auth required
 * @route {DELETE} /profiles/:username/follow
 * @param username string
 * @returns profiles
 */
router.delete('/profiles/:username/follow', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const profile = yield (0, profile_service_1.unfollowUser)(req.params.username, (_g = (_f = req.auth) === null || _f === void 0 ? void 0 : _f.user) === null || _g === void 0 ? void 0 : _g.id);
        res.json({ profile });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
