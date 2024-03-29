"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileMapper = void 0;
const profileMapper = (user, id) => ({
    username: user.username,
    bio: user.bio,
    image: user.image,
    following: id
        ? user === null || user === void 0 ? void 0 : user.followedBy.some((followingUser) => followingUser.id === id)
        : false,
});
exports.profileMapper = profileMapper;
