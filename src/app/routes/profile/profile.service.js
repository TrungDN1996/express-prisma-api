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
exports.unfollowUser = exports.followUser = exports.getProfile = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const index_1 = require("../../core/mappers/index");
const http_exception_model_1 = __importDefault(require("../../core/models/http-exception.model"));
const getProfile = (usernamePayload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_client_1.default.user.findUnique({
        where: {
            username: usernamePayload,
        },
        include: {
            followedBy: true,
        },
    });
    if (!profile) {
        throw new http_exception_model_1.default(404, {});
    }
    return (0, index_1.profileMapper)(profile, id);
});
exports.getProfile = getProfile;
const followUser = (usernamePayload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_client_1.default.user.update({
        where: {
            username: usernamePayload,
        },
        data: {
            followedBy: {
                connect: {
                    id,
                },
            },
        },
        include: {
            followedBy: true,
        },
    });
    return (0, index_1.profileMapper)(profile, id);
});
exports.followUser = followUser;
const unfollowUser = (usernamePayload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prisma_client_1.default.user.update({
        where: {
            username: usernamePayload,
        },
        data: {
            followedBy: {
                disconnect: {
                    id,
                },
            },
        },
        include: {
            followedBy: true,
        },
    });
    return (0, index_1.profileMapper)(profile, id);
});
exports.unfollowUser = unfollowUser;
