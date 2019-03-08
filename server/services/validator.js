const {validationResult} = require('express-validator/check');

export class Validator {
    checkValidationResults(req, res, next) {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
        } else {
            res.status(400).json(errors.mapped());
        }
    }
}

const instance = new Validator();
Object.freeze(instance);

export default instance;