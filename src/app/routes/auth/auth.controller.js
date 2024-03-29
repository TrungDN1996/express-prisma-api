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
const auth_service_1 = require("./auth.service");
const router = (0, express_1.Router)();
/**
 * Create an user
 * @auth none
 * @route {POST} /users
 * @bodyparam user User
 * @returns user User
 */
router.post('/users', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.createUser)(Object.assign(Object.assign({}, req.body.user), { demo: false }));
        res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Update user
 * @auth required
 * @route {PUT} /user
 * @bodyparam user User
 * @returns user User
 */
router.put('/user', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = yield (0, auth_service_1.updateUser)(req.body.user, (_b = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Login
 * @auth none
 * @route {POST} /users/login
 * @bodyparam user User
 * @returns user User
 */
router.post('/users/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.login)(req.body.user);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Get current user
 * @auth required
 * @route {GET} /user
 * @returns user User
 */
router.get('/user', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const user = yield (0, auth_service_1.getCurrentUser)((_d = (_c = req.auth) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
