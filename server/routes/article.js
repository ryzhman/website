const articlecontroller = require('./../controllers/article.ctrl');
const multipart = require('connect-multiparty');
const multipartWare = multipart();
const { body, param, query } = require('express-validator/check');
const validator = require('./../services/validator');

module.exports = (router) => {
    /**
     * get all articles
     */
    router.get('/articles',
        [query('userId', "Customer ID is not valid")
            .exists()
            .isAlphanumeric()],
        validator.default.checkValidationResults,
        articlecontroller.getAll);

    /**
     * add an article
     */
    router.post('/article', [body('text', 'Text field is empty')
            .exists()
            .isLength({min: 10}),
            body('title', 'Title field is empty')
                .exists()
                .isLength({min: 10}),
            body('claps')
                .optional()
                .isInt(),
            body('description')
                .optional(),
            body('author_id')
                .exists()
                .isAlphanumeric()],
        validator.default.checkValidationResults,
        multipartWare,
        articlecontroller.addArticle);

    /**
     * clap on an article
     */
    router
        .post('/article/clap', [body('article_id', 'Article ID is required')
                .exists()
                .isAlphanumeric()],
            validator.default.checkValidationResults,
            articlecontroller.clapArticle);

    /**
     * comment on an article
     */
    router
        .post('/article/comment', [body('article_id', 'Article ID is required')
                .exists()
                .isAlphanumeric(),
                body('author_id', 'Author ID is required')
                    .exists()
                    .isAlphanumeric(),
                body('comment')
                    .exists()
                    .isLength({min: 10})],
            validator.default.checkValidationResults,
            articlecontroller.commentArticle);

    /**
     * get a particlular article to view
     */
    router
        .get('/article/:id', [param('id', 'Article ID is required')
                .exists()
                .isAlphanumeric()],
            validator.default.checkValidationResults,
            articlecontroller.getArticleById);
};