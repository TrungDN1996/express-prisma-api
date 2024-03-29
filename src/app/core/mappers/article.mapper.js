"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleMapper = void 0;
const author_mapper_1 = require("./author.mapper");
const articleMapper = (article, id) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList.map((tag) => tag.name),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favorited: article.favoritedBy.some((item) => item.id === id),
    favoritesCount: article.favoritedBy.length,
    author: (0, author_mapper_1.authorMapper)(article.author, id),
});
exports.articleMapper = articleMapper;
