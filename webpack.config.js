'use strict';

module.exports = env => {
    switch (env) {
        case 'development':
            return require('./config/webpack-dev.config');
        case 'production':
            return require('./config/webpack-prod.config');
        default:
            return null;
    }
};
