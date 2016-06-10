const Url = {
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
    const keys = Object.keys(data);

    if (keys.length === 0) {
      return host;
    }

    let args = 0;
    let uri = `${host}?`;

    keys.forEach((key) => {
      if (args++) {
        uri += '&';
      }

      uri += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
    });

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

    const {
      data,
      host,
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
   * @return {Object} urlOptions
   */

  buildOptions(options = {}) {
    const urlOptions = {};

    if (new RegExp('^POST$', 'i').test(options.method)) {
      urlOptions.body = JSON.stringify(options.data);
      urlOptions.method = options.method;

      urlOptions.headers = Object.assign({}, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, options.headers);
    }

    return urlOptions;
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
    const data = {};

    const parser = document.createElement('a');

    parser.href = url;

    const host = `${parser.protocol}//${parser.host}${parser.pathname}`;

    if (parser.search === '') {
      return {
        host,
        data: {},
      };
    }

    const queries = parser.search.replace(/^\?/, '').split('&');

    for (let i = 0, length = queries.length; i < length; i++) {
      const [
        key,
        value,
      ] = queries[i].split('=');

      data[key] = value;
    }

    return {
      host,
      data: Object.assign(data, options.data),
    };
  },
};

export default Url;
