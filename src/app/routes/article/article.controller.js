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
const article_service_1 = require("./article.service");
const router = (0, express_1.Router)();
/**
 * Get paginated articles
 * @auth optional
 * @route {GET} /articles
 * @queryparam offset number of articles dismissed from the first one
 * @queryparam limit number of articles returned
 * @queryparam tag
 * @queryparam author
 * @queryparam favorited
 * @returns articles: list of articles
 */
router.get('/articles', auth_middleware_1.default.optional, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const result = yield (0, article_service_1.getArticles)(req.query, (_b = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Get paginated feed articles
 * @auth required
 * @route {GET} /articles/feed
 * @returns articles list of articles
 */
router.get('/articles/feed', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const result = yield (0, article_service_1.getFeed)(Number(req.query.offset), Number(req.query.limit), (_d = (_c = req.auth) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Create article
 * @route {POST} /articles
 * @bodyparam  title
 * @bodyparam  description
 * @bodyparam  body
 * @bodyparam  tagList list of tags
 * @returns article created article
 */
router.post('/articles', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const article = yield (0, article_service_1.createArticle)(req.body.article, (_f = (_e = req.auth) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.id);
        res.status(201).json({ article });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Get unique article
 * @auth optional
 * @route {GET} /article/:slug
 * @param slug slug of the article (based on the title)
 * @returns article
 */
router.get('/articles/:slug', auth_middleware_1.default.optional, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    try {
        const article = yield (0, article_service_1.getArticle)(req.params.slug, (_h = (_g = req.auth) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.id);
        res.json({ article });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Update article
 * @auth required
 * @route {PUT} /articles/:slug
 * @param slug slug of the article (based on the title)
 * @bodyparam title new title
 * @bodyparam description new description
 * @bodyparam body new content
 * @returns article updated article
 */
router.put('/articles/:slug', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    try {
        const article = yield (0, article_service_1.updateArticle)(req.body.article, req.params.slug, (_k = (_j = req.auth) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.id);
        res.json({ article });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Delete article
 * @auth required
 * @route {DELETE} /article/:id
 * @param slug slug of the article
 */
router.delete('/articles/:slug', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        yield (0, article_service_1.deleteArticle)(req.params.slug, (_l = req.auth) === null || _l === void 0 ? void 0 : _l.user.id);
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Get comments from an article
 * @auth optional
 * @route {GET} /articles/:slug/comments
 * @param slug slug of the article (based on the title)
 * @returns comments list of comments
 */
router.get('/articles/:slug/comments', auth_middleware_1.default.optional, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    try {
        const comments = yield (0, article_service_1.getCommentsByArticle)(req.params.slug, (_o = (_m = req.auth) === null || _m === void 0 ? void 0 : _m.user) === null || _o === void 0 ? void 0 : _o.id);
        res.json({ comments });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Add comment to article
 * @auth required
 * @route {POST} /articles/:slug/comments
 * @param slug slug of the article (based on the title)
 * @bodyparam body content of the comment
 * @returns comment created comment
 */
router.post('/articles/:slug/comments', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _p, _q;
    try {
        const comment = yield (0, article_service_1.addComment)(req.body.comment.body, req.params.slug, (_q = (_p = req.auth) === null || _p === void 0 ? void 0 : _p.user) === null || _q === void 0 ? void 0 : _q.id);
        res.json({ comment });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Delete comment
 * @auth required
 * @route {DELETE} /articles/:slug/comments/:id
 * @param slug slug of the article (based on the title)
 * @param id id of the comment
 */
router.delete('/articles/:slug/comments/:id', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _r, _s;
    try {
        yield (0, article_service_1.deleteComment)(Number(req.params.id), (_s = (_r = req.auth) === null || _r === void 0 ? void 0 : _r.user) === null || _s === void 0 ? void 0 : _s.id);
        res.status(200).json({});
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Favorite article
 * @auth required
 * @route {POST} /articles/:slug/favorite
 * @param slug slug of the article (based on the title)
 * @returns article favorited article
 */
router.post('/articles/:slug/favorite', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _t, _u;
    try {
        const article = yield (0, article_service_1.favoriteArticle)(req.params.slug, (_u = (_t = req.auth) === null || _t === void 0 ? void 0 : _t.user) === null || _u === void 0 ? void 0 : _u.id);
        res.json({ article });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * Unfavorite article
 * @auth required
 * @route {DELETE} /articles/:slug/favorite
 * @param slug slug of the article (based on the title)
 * @returns article unfavorited article
 */
router.delete('/articles/:slug/favorite', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _v, _w;
    try {
        const article = yield (0, article_service_1.unfavoriteArticle)(req.params.slug, (_w = (_v = req.auth) === null || _v === void 0 ? void 0 : _v.user) === null || _w === void 0 ? void 0 : _w.id);
        res.json({ article });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
