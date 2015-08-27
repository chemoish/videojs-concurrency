/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	__webpack_require__(1);

	var _url = __webpack_require__(2);

	var _url2 = _interopRequireDefault(_url);

	var _urlOption = __webpack_require__(4);

	var _urlOption2 = _interopRequireDefault(_urlOption);

	var _extend = __webpack_require__(3);

	var _extend2 = _interopRequireDefault(_extend);

	__webpack_require__(5);

	var defaults = {
	    idle_delay: 1000 * 60 * 30,
	    poll_delay: 1000 * 20,
	    error: Function.prototype,
	    method: 'GET',
	    success: Function.prototype
	};

	/**
	 * @name Concurrency Plugin
	 * @description
	 *
	 * @example
	 * videojs('player_id', {
	 *     plugins: {
	 *         concurrency: {
	 *             url: '/path/to/concurrency.server',
	 *
	 *             success: function (response) {
	 *                 this.poll();
	 *             }
	 *         }
	 *     }
	 * });
	 *
	 * videojs('player_id').concurrency({
	 *     url: '/path/to/concurrency.server',
	 *     success: function (response) {
	 *         this.poll();
	 *     }
	 * });
	 *
	 * @param {Object} player VideoJS player
	 * @param {Object} options
	 *
	 * @param {Object} [options.data]
	 * @param {String} [options.method=GET]
	 * @param {String} options.url
	 *
	 * @param {errorCallback} [options.error=noop]
	 * @param {successCallback} [options.success=noop]
	 *
	 * @param {Number} [options.idle_delay=30m]
	 * @param {Number} [options.poll_delay=20s]
	 *
	 * @param {Boolean} [options.debug=false]
	 */

	var Concurrency = (function () {
	    function Concurrency(player) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        _classCallCheck(this, Concurrency);

	        this.options = (0, _extend2['default'])({}, defaults, options);

	        this.idle_timeout_id = null;
	        this.poll_timeout_id = null;

	        this.debug = options.debug || false;

	        player.on('ended', this.onEnded.bind(this));
	        player.on('pause', this.onPause.bind(this));
	        player.on('play', this.onPlay.bind(this));
	    }

	    _createClass(Concurrency, [{
	        key: 'error',
	        value: function error(message) {
	            if (this.debug !== true) {
	                return;
	            }

	            for (var _len = arguments.length, messages = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                messages[_key - 1] = arguments[_key];
	            }

	            if (messages.length > 0) {
	                console.error(message, messages);
	            } else {
	                console.error(message);
	            }
	        }
	    }, {
	        key: 'log',
	        value: function log(message) {
	            if (this.debug !== true) {
	                return;
	            }

	            for (var _len2 = arguments.length, messages = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                messages[_key2 - 1] = arguments[_key2];
	            }

	            if (messages.length > 0) {
	                console.log(message, messages);
	            } else {
	                console.log(message);
	            }
	        }
	    }, {
	        key: 'warn',
	        value: function warn(message) {
	            if (this.debug !== true) {
	                return;
	            }

	            for (var _len3 = arguments.length, messages = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	                messages[_key3 - 1] = arguments[_key3];
	            }

	            if (messages.length > 0) {
	                console.warn(message, messages);
	            } else {
	                console.warn(message);
	            }
	        }

	        /**
	         * @name On Ended
	         * @description
	         * Initiates concurrency stopping on video end.
	         *
	         * @param {Object} event
	         */

	    }, {
	        key: 'onEnded',
	        value: function onEnded(event) {
	            this.log('ended');

	            this.log('poll: reset');
	            this.log('poll: stopped');

	            // kill idle timer
	            clearTimeout(this.idle_timeout_id);

	            // kill poll timer
	            clearTimeout(this.poll_timeout_id);
	        }

	        /**
	         * @name On Pause
	         * @description
	         * Initiates concurrency stopping on video pause (After set delay).
	         *
	         * @param {Object} event
	         */

	    }, {
	        key: 'onPause',
	        value: function onPause(event) {
	            this.log('pause');

	            this.log('poll: stopping in ' + this.options.idle_delay + 'ms');

	            this.idle_timeout_id = setTimeout((function () {
	                this.log('poll: reset');
	                this.log('poll: stopped');

	                // kill poll timer
	                clearTimeout(this.poll_timeout_id);
	            }).bind(this), this.options.idle_delay);
	        }

	        /**
	         * @name On Play
	         * @description
	         * Initiates concurrency polling on video play.
	         *
	         * @param {Object} event
	         */

	    }, {
	        key: 'onPlay',
	        value: function onPlay(event) {
	            this.log('play');

	            // kill existing idle timer
	            clearTimeout(this.idle_timeout_id);

	            // kill existing poll timer
	            clearTimeout(this.poll_timeout_id);

	            this.log('poll: reset');
	            this.log('poll: running every ' + this.options.poll_delay + 'ms');

	            this.poll();
	        }

	        /**
	         * @name Poll
	         * @description
	         * Polls the configured concurrency server then executes the provided callback
	         * to determine how to proceed.
	         *
	         * This method currently only accepts json.
	         */

	    }, {
	        key: 'poll',
	        value: function poll() {
	            var url = _url2['default'].build(this.options.url, this.options);
	            var url_options = _urlOption2['default'].build(this.options);

	            this.log('poll: ' + url);

	            fetch(url, url_options).then(function (response) {
	                return response.json();
	            }).then((function (body) {
	                this.poll_timeout_id = setTimeout((function () {
	                    this.options.success.apply(this, [body]);
	                }).bind(this), this.options.poll_delay);
	            }).bind(this))['catch']((function (error) {
	                this.error(error);

	                this.options.error.apply(this, [error]);
	            }).bind(this));
	        }
	    }]);

	    return Concurrency;
	})();

	videojs.plugin('concurrency', function concurrency(options) {
	    new Concurrency(this, options);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	(function() {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = name.toString();
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = value.toString();
	    }
	    return value
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)

	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }

	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }

	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self
	  }

	  function Body() {
	    this.bodyUsed = false


	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }

	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(url, options) {
	    options = options || {}
	    this.url = url

	    this.credentials = options.credentials || 'omit'
	    this.headers = new Headers(options.headers)
	    this.method = normalizeMethod(options.method || 'GET')
	    this.mode = options.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(options.body)
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this._initBody(bodyInit)
	    this.type = 'default'
	    this.url = null
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }

	  Body.call(Response.prototype)

	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;

	  self.fetch = function(input, init) {
	    // TODO: Request constructor should accept input, init
	    var request
	    if (Request.prototype.isPrototypeOf(input) && !init) {
	      request = input
	    } else {
	      request = new Request(input, init)
	    }

	    return new Promise(function(resolve, reject) {
	      var xhr = new XMLHttpRequest()

	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }

	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }

	        return;
	      }

	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _extend = __webpack_require__(3);

	var _extend2 = _interopRequireDefault(_extend);

	var Url = {
	    build: function build(url) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        if (new RegExp('^GET$', 'i').test(options.method) === false) {
	            return url;
	        }

	        var _parseUrl = this.parseUrl(url, options);

	        var data = _parseUrl.data;
	        var host = _parseUrl.host;

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

	    buildUri: function buildUri(host) {
	        var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        if (Object.keys(data).length === 0) {
	            return host;
	        }

	        var args = 0;
	        var uri = host + '?';

	        for (var key in data) {
	            if (data.hasOwnProperty(key)) {
	                if (args++) {
	                    uri += '&';
	                }

	                uri += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
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

	    parseUrl: function parseUrl(url) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        var data = {},
	            host = undefined,
	            queries = undefined;

	        var parser = document.createElement('a');

	        parser.href = url;

	        host = parser.protocol + '//' + parser.host + parser.pathname;

	        if (parser.search === '') {
	            return {
	                data: {},
	                host: host
	            };
	        }

	        queries = parser.search.replace(/^\?/, '').split('&');

	        for (var i = 0, _length = queries.length; i < _length; i++) {
	            var _queries$i$split = queries[i].split('=');

	            var _queries$i$split2 = _slicedToArray(_queries$i$split, 2);

	            var key = _queries$i$split2[0];
	            var value = _queries$i$split2[1];

	            data[key] = value;
	        }

	        return {
	            data: (0, _extend2['default'])(data, options.data),
	            host: host
	        };
	    }
	};

	exports['default'] = Url;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = extend;

	function extend(obj) {
	    var arg, i, k;

	    for (i = 1; i < arguments.length; i++) {
	        arg = arguments[i];

	        for (k in arg) {
	            if (arg.hasOwnProperty(k) && arg[k] !== undefined) {
	                obj[k] = arg[k];
	            }
	        }
	    }

	    return obj;
	}

	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _extend = __webpack_require__(3);

	var _extend2 = _interopRequireDefault(_extend);

	var UrlOption = {
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

	    build: function build() {
	        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var url_options = {};

	        if (new RegExp('^POST$', 'i').test(options.method)) {
	            url_options.body = JSON.stringify(options.data);
	            url_options.method = options.method;

	            url_options.headers = (0, _extend2['default'])({}, {
	                'Accept': 'application/json',
	                'Content-Type': 'application/json'
	            }, options.headers);
	        }

	        return url_options;
	    }
	};

	exports['default'] = UrlOption;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var method,
	    methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'],
	    length = methods.length,
	    console = window.console = window.console || {};

	while (length--) {
	    method = methods[length];

	    !console[method] && (console[method] = function () {});
	}

/***/ }
/******/ ]);