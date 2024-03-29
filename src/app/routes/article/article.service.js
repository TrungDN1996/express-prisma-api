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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfavoriteArticle = exports.favoriteArticle = exports.deleteComment = exports.addComment = exports.getCommentsByArticle = exports.deleteArticle = exports.updateArticle = exports.getArticle = exports.createArticle = exports.getFeed = exports.getArticles = void 0;
const slugify_1 = __importDefault(require("slugify"));
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const index_1 = require("../../core/mappers/index");
const http_exception_model_1 = __importDefault(require("../../core/models/http-exception.model"));
const buildFindAllQuery = (query, id) => {
    const queries = [];
    const orAuthorQuery = [];
    const andAuthorQuery = [];
    orAuthorQuery.push({
        demo: {
            equals: true,
        },
    });
    if (id) {
        orAuthorQuery.push({
            id: {
                equals: id,
            },
        });
    }
    if ('author' in query) {
        andAuthorQuery.push({
            username: {
                equals: query.author,
            },
        });
    }
    const authorQuery = {
        author: {
            OR: orAuthorQuery,
            AND: andAuthorQuery,
        },
    };
    queries.push(authorQuery);
    if ('tag' in query) {
        queries.push({
            tagList: {
                some: {
                    name: query.tag,
                },
            },
        });
    }
    if ('favorited' in query) {
        queries.push({
            favoritedBy: {
                some: {
                    username: {
                        equals: query.favorited,
                    },
                },
            },
        });
    }
    return queries;
};
const getArticles = (query, id) => __awaiter(void 0, void 0, void 0, function* () {
    const andQueries = buildFindAllQuery(query, id);
    const articlesCount = yield prisma_client_1.default.article.count({
        where: {
            AND: andQueries,
        },
    });
    const articles = yield prisma_client_1.default.article.findMany({
        where: { AND: andQueries },
        orderBy: {
            createdAt: 'desc',
        },
        skip: Number(query.offset) || 0,
        take: Number(query.limit) || 10,
        include: {
            tagList: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    username: true,
                    bio: true,
                    image: true,
                    followedBy: true,
                },
            },
            favoritedBy: true,
            _count: {
                select: {
                    favoritedBy: true,
                },
            },
        },
    });
    return {
        articles: articles.map((article) => (0, index_1.articleMapper)(article, id)),
        articlesCount,
    };
});
exports.getArticles = getArticles;
const getFeed = (offset, limit, id) => __awaiter(void 0, void 0, void 0, function* () {
    const articlesCount = yield prisma_client_1.default.article.count({
        where: {
            author: {
                followedBy: { some: { id: id } },
            },
        },
    });
    const articles = yield prisma_client_1.default.article.findMany({
        where: {
            author: {
                followedBy: { some: { id: id } },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: offset || 0,
        take: limit || 10,
        include: {
            tagList: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    username: true,
                    bio: true,
                    image: true,
                    followedBy: true,
                },
            },
            favoritedBy: true,
            _count: {
                select: {
                    favoritedBy: true,
                },
            },
        },
    });
    return {
        articles: articles.map((article) => (0, index_1.articleMapper)(article, id)),
        articlesCount,
    };
});
exports.getFeed = getFeed;
const createArticle = (article, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, body, tagList } = article;
    const tags = Array.isArray(tagList) ? tagList : [];
    if (!title) {
        throw new http_exception_model_1.default(422, { errors: { title: ["can't be blank"] } });
    }
    if (!description) {
        throw new http_exception_model_1.default(422, { errors: { description: ["can't be blank"] } });
    }
    if (!body) {
        throw new http_exception_model_1.default(422, { errors: { body: ["can't be blank"] } });
    }
    const slug = `${(0, slugify_1.default)(title)}-${id}`;
    const existingTitle = yield prisma_client_1.default.article.findUnique({
        where: {
            slug,
        },
        select: {
            slug: true,
        },
    });
    if (existingTitle) {
        throw new http_exception_model_1.default(422, { errors: { title: ['must be unique'] } });
    }
    const _a = yield prisma_client_1.default.article.create({
        data: {
            title,
            description,
            body,
            slug,
            tagList: {
                connectOrCreate: tags.map((tag) => ({
                    create: { name: tag },
                    where: { name: tag },
                })),
            },
            author: {
                connect: {
                    id: id,
                },
            },
        },
        include: {
            tagList: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    username: true,
                    bio: true,
                    image: true,
                    followedBy: true,
                },
            },
            favoritedBy: true,
            _count: {
                select: {
                    favoritedBy: true,
                },
            },
        },
    }), { authorId, id: articleId } = _a, createdArticle = __rest(_a, ["authorId", "id"]);
    return (0, index_1.articleMapper)(createdArticle, id);
});
exports.createArticle = createArticle;
const getArticle = (slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield prisma_client_1.default.article.findUnique({
        where: {
            slug,
        },
        include: {
            tagList: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    username: true,
                    bio: true,
                    image: true,
                    followedBy: true,
                },
            },
            favoritedBy: true,
            _count: {
                select: {
                    favoritedBy: true,
                },
            },
        },
    });
    if (!article) {
        throw new http_exception_model_1.default(404, { errors: { article: ['not found'] } });
    }
    return (0, index_1.articleMapper)(article, id);
});
exports.getArticle = getArticle;
const disconnectArticlesTags = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_client_1.default.article.update({
        where: {
            slug,
        },
        data: {
            tagList: {
                set: [],
            },
        },
    });
});
const updateArticle = (article, slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let newSlug = null;
    const existingArticle = yield yield prisma_client_1.default.article.findFirst({
        where: {
            slug,
        },
        select: {
            author: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });
    if (!existingArticle) {
        throw new http_exception_model_1.default(404, {});
    }
    if (existingArticle.author.id !== id) {
        throw new http_exception_model_1.default(403, {
            message: 'You are not authorized to update this article',
        });
    }
    if (article.title) {
        newSlug = `${(0, slugify_1.default)(article.title)}-${id}`;
        if (newSlug !== slug) {
            const existingTitle = yield prisma_client_1.default.article.findFirst({
                where: {
                    slug: newSlug,
                },
                select: {
                    slug: true,
                },
            });
            if (existingTitle) {
                throw new http_exception_model_1.default(422, { errors: { title: ['must be unique'] } });
            }
        }
    }
    const tagList = Array.isArray(article.tagList) && ((_b = article.tagList) === null || _b === void 0 ? void 0 : _b.length)
        ? article.tagList.map((tag) => ({
            create: { name: tag },
            where: { name: tag },
        }))
        : [];
    yield disconnectArticlesTags(slug);
    const updatedArticle = yield prisma_client_1.default.article.update({
        where: {
            slug,
        },
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (article.title ? { title: article.title } : {})), (article.body ? { body: article.body } : {})), (article.description ? { description: article.description } : {})), (newSlug ? { slug: newSlug } : {})), { updatedAt: new Date(), tagList: {
                connectOrCreate: tagList,
            } }),
        include: {
            tagList: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    username: true,
                    bio: true,
                    image: true,
                    followedBy: true,
                },
            },
            favoritedBy: true,
            _count: {
                select: {
                    favoritedBy: true,
                },
            },
        },
    });
    return (0, index_1.articleMapper)(updatedArticle, id);
});
exports.updateArticle = updateArticle;
const deleteArticle = (slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingArticle = yield yield prisma_client_1.default.article.findFirst({
        where: {
            slug,
        },
        select: {
            author: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });
    if (!existingArticle) {
        throw new http_exception_model_1.default(404, {});
    }
    if (existingArticle.author.id !== id) {
        throw new http_exception_model_1.default(403, {
            message: 'You are not authorized to delete this article',
        });
    }
    yield prisma_client_1.default.article.delete({
        where: {
            slug,
        },
    });
});
exports.deleteArticle = deleteArticle;
const getCommentsByArticle = (slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    const queries = [];
    queries.push({
        author: {
            demo: true,
        },
    });
    if (id) {
        queries.push({
            author: {
                id,
            },
        });
    }
    const comments = yield prisma_client_1.default.article.findUnique({
        where: {
            slug,
        },
        include: {
            comments: {
                where: {
                    OR: queries,
                },
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    body: true,
                    author: {
                        select: {
                            username: true,
                            bio: true,
                            image: true,
                            followedBy: true,
                        },
                    },
                },
            },
        },
    });
    const result = comments === null || comments === void 0 ? void 0 : comments.comments.map((comment) => (Object.assign(Object.assign({}, comment), { author: {
            username: comment.author.username,
            bio: comment.author.bio,
            image: comment.author.image,
            following: comment.author.followedBy.some((follow) => follow.id === id),
        } })));
    return result;
});
exports.getCommentsByArticle = getCommentsByArticle;
const addComment = (body, slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body) {
        throw new http_exception_model_1.default(422, { errors: { body: ["can't be blank"] } });
    }
    const article = yield prisma_client_1.default.article.findUnique({
        where: {
            slug,
        },
        select: {
            id: true,
        },
    });
    const comment = yield prisma_client_1.default.comment.create({
        data: {
            body,
            article: {
                connect: {
                    id: article === null || article === void 0 ? void 0 : article.id,
                },
            },
            author: {
                connect: {
                    id: id,
                },
            },
        },
        include: {
            author: {
                select: {
                    username: true,
                    bio: true,
                    image: true,
                    followedBy: true,
                },
            },
        },
    });
    return {
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: {
            username: comment.author.username,
            bio: comment.author.bio,
            image: comment.author.image,
            following: comment.author.followedBy.some((follow) => follow.id === id),
        },
    };
});
exports.addComment = addComment;
const deleteComment = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma_client_1.default.comment.findFirst({
        where: {
            id,
            author: {
                id: userId,
            },
        },
        select: {
            author: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    });
    if (!comment) {
        throw new http_exception_model_1.default(404, {});
    }
    if (comment.author.id !== userId) {
        throw new http_exception_model_1.default(403, {
            message: 'You are not authorized to delete this comment',
        });
    }
    yield prisma_client_1.default.comment.delete({
        where: {
            id,
        },
    });
});
exports.deleteComment = deleteComment;
const favoriteArticle = (slugPayload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const _c = yield prisma_client_1.default.article.update({
        where: {
            slug: slugPayload,
        },
        data: {
            favoritedBy: {
                connect: {
                    id: id,
                },
            },
        },
        include: {
            tagList: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    username: true,
                    bio: true,
                    image: true,
                    followedBy: true,
                },
            },
            favoritedBy: true,
            _count: {
                select: {
                    favoritedBy: true,
                },
            },
        },
    }), { _count } = _c, article = __rest(_c, ["_count"]);
    const result = Object.assign(Object.assign({}, article), { author: (0, index_1.profileMapper)(article.author, id), tagList: article === null || article === void 0 ? void 0 : article.tagList.map((tag) => tag.name), favorited: article.favoritedBy.some((favorited) => favorited.id === id), favoritesCount: _count === null || _count === void 0 ? void 0 : _count.favoritedBy });
    return result;
});
exports.favoriteArticle = favoriteArticle;
const unfavoriteArticle = (slugPayload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const _d = yield prisma_client_1.default.article.update({
        where: {
            slug: slugPayload,
        },
        data: {
            favoritedBy: {
                disconnect: {
                    id: id,
                },
            },
        },
        include: {
            tagList: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    username: true,
                    bio: true,
                    image: true,
                    followedBy: true,
                },
            },
            favoritedBy: true,
            _count: {
                select: {
                    favoritedBy: true,
                },
            },
        },
    }), { _count } = _d, article = __rest(_d, ["_count"]);
    const result = Object.assign(Object.assign({}, article), { author: (0, index_1.profileMapper)(article.author, id), tagList: article === null || article === void 0 ? void 0 : article.tagList.map((tag) => tag.name), favorited: article.favoritedBy.some((favorited) => favorited.id === id), favoritesCount: _count === null || _count === void 0 ? void 0 : _count.favoritedBy });
    return result;
});
exports.unfavoriteArticle = unfavoriteArticle;
