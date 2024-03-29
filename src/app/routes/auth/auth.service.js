"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.updateUser = exports.getCurrentUser = exports.login = exports.createUser = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const index_1 = require("../../core/utils/index");
const http_exception_model_1 = __importDefault(require("../../core/models/http-exception.model"));
const checkUserUniqueness = (email, username) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUserByEmail = yield prisma_client_1.default.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    const existingUserByUsername = yield prisma_client_1.default.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
        },
    });
    if (existingUserByEmail || existingUserByUsername) {
        throw new http_exception_model_1.default(422, {
            errors: Object.assign(Object.assign({}, (existingUserByEmail ? { email: ['has already been taken'] } : {})), (existingUserByUsername ? { username: ['has already been taken'] } : {})),
        });
    }
});
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const email = (_a = input.email) === null || _a === void 0 ? void 0 : _a.trim();
    const username = (_b = input.username) === null || _b === void 0 ? void 0 : _b.trim();
    const password = (_c = input.password) === null || _c === void 0 ? void 0 : _c.trim();
    const { image, bio, demo } = input;
    if (!email) {
        throw new http_exception_model_1.default(422, { errors: { email: ["can't be blank"] } });
    }
    if (!username) {
        throw new http_exception_model_1.default(422, { errors: { username: ["can't be blank"] } });
    }
    if (!password) {
        throw new http_exception_model_1.default(422, { errors: { password: ["can't be blank"] } });
    }
    yield checkUserUniqueness(email, username);
    const hashedPassword = yield bcrypt.hash(password, 10);
    const user = yield prisma_client_1.default.user.create({
        data: Object.assign(Object.assign(Object.assign({ username,
            email, password: hashedPassword }, (image ? { image } : {})), (bio ? { bio } : {})), (demo ? { demo } : {})),
        select: {
            id: true,
            email: true,
            username: true,
            bio: true,
            image: true,
        },
    });
    return Object.assign(Object.assign({}, user), { token: (0, index_1.generateToken)(user.id) });
});
exports.createUser = createUser;
const login = (userPayload) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const email = (_d = userPayload.email) === null || _d === void 0 ? void 0 : _d.trim();
    const password = (_e = userPayload.password) === null || _e === void 0 ? void 0 : _e.trim();
    if (!email) {
        throw new http_exception_model_1.default(422, { errors: { email: ["can't be blank"] } });
    }
    if (!password) {
        throw new http_exception_model_1.default(422, { errors: { password: ["can't be blank"] } });
    }
    const user = yield prisma_client_1.default.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            username: true,
            password: true,
            bio: true,
            image: true,
        },
    });
    if (user) {
        const match = yield bcrypt.compare(password, user.password);
        if (match) {
            return {
                email: user.email,
                username: user.username,
                bio: user.bio,
                image: user.image,
                token: (0, index_1.generateToken)(user.id),
            };
        }
    }
    throw new http_exception_model_1.default(403, {
        errors: {
            'email or password': ['is invalid'],
        },
    });
});
exports.login = login;
const getCurrentUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield prisma_client_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            username: true,
            bio: true,
            image: true,
        },
    }));
    return Object.assign(Object.assign({}, user), { token: (0, index_1.generateToken)(user.id) });
});
exports.getCurrentUser = getCurrentUser;
const updateUser = (userPayload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, image, bio } = userPayload;
    let hashedPassword;
    if (password) {
        hashedPassword = yield bcrypt.hash(password, 10);
    }
    const user = yield prisma_client_1.default.user.update({
        where: {
            id: id,
        },
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (email ? { email } : {})), (username ? { username } : {})), (password ? { password: hashedPassword } : {})), (image ? { image } : {})), (bio ? { bio } : {})),
        select: {
            id: true,
            email: true,
            username: true,
            bio: true,
            image: true,
        },
    });
    return Object.assign(Object.assign({}, user), { token: (0, index_1.generateToken)(user.id) });
});
exports.updateUser = updateUser;
