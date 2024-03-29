"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorMapper = void 0;
const authorMapper = (author, id) => ({
    username: author.username,
    bio: author.bio,
    image: author.image,
    following: id
        ? author === null || author === void 0 ? void 0 : author.followedBy.some((followingUser) => followingUser.id === id)
        : false,
});
exports.authorMapper = authorMapper;
