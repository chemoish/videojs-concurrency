import extend from './extend';

let Url = {
    build(url, options = {}) {
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
     * @name Build Uri
     * @description
     * Creates a uri from a given host and data.
     *
     * @param {String} host
     * @param {Object} data
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
     * @name Parse Url
     * @description
     * Returns the host and normalized data from a url. The data
     * is extracted from both the options and the query string.
     *
     * @param {String} url
     * @param {Object} options
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
