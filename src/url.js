import extend from './extend';

let Url = {
    /**
     * @name Build Uri
     * @description
     * Creates a uri from a given host and data.
     *
     * @param {String} host
     * @param {Object} data={}
     *
     * @return {String} uri
     */

    buildUri(host, data = {}) {
        if (Object.keys(data).length === 0) {
            return host;
        }

        let args = 0;
        let uri = `${host}?`;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (args++) {
                    uri += '&';
                }

                uri += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
            }
        }

        return uri;
    },

    /**
     * @name Build Url
     * @description
     * Create a url from a given host, data, and method.
     *
     * @param {String} url
     * @param {Object} options={}
     * @param {Object} [options.data]
     * @param {String} [options.method]
     */

    buildUrl(url, options = {}) {
        if (new RegExp('^GET$', 'i').test(options.method) === false) {
            return url;
        }

        let {
            data,
            host
        } = this.parseUrl(url, options);

        return this.buildUri(host, data);
    },

    /**
     * @name Build Options
     * @description
     * Transforms options into whatwg-fetch options.
     *
     * @param {Object} options={}
     * @param {Object} options.data
     * @param {Object} options.headers
     * @param {String} options.method
     *
     * @return {Object} url_options
     */

    buildOptions(options = {}) {
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
    },

    /**
     * @name Parse Url
     * @description
     * Returns the host and normalized data from a url. The data
     * is extracted from both the options and the query string.
     *
     * @param {String} url
     * @param {Object} options={}
     *
     * @return {Object}
     */

    parseUrl(url, options = {}) {
        let data = {},
            host,
            queries;

        let parser = document.createElement('a');

        parser.href = url;

        host = `${parser.protocol}//${parser.host}${parser.pathname}`;

        if (parser.search === '') {
            return {
                data: {},
                host: host
            };
        }

        queries = parser.search.replace(/^\?/, '').split('&');

        for (let i = 0, length = queries.length; i < length; i++) {
            let [
                key,
                value
            ] = queries[i].split('=');

            data[key] = value;
        }

        return {
            data: extend(data, options.data),
            host: host
        };
    }
};

export default Url;
