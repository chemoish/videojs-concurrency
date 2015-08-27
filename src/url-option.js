import extend from './extend';

let UrlOption = {
    /**
     * @name Build
     * @description
     * Transforms options into whatwg-fetch options.
     *
     * @param {Object} options
     * @param {Object} options.data
     * @param {Object} options.headers
     * @param {String} options.method
     *
     * @return {Object} url_options
     */

    build(options = {}) {
        let url_options = {};

        if (new RegExp('^POST$', 'i').test(options.method)) {
            url_options.body   = JSON.stringify(options.data);
            url_options.method = options.method;

            url_options.headers = extend({}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, options.headers);
        }

        return url_options;
    }
};

export default UrlOption;
