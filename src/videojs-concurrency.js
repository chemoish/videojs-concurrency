import 'console-polyfill';
import 'whatwg-fetch';

import extend from './extend';
import Url from './url';

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
 * @param {Object} options={}
 *
 * @param {Object} [options.data]
 * @param {String} [options.method=GET]
 * @param {String} options.url
 *
 * @param {errorCallback(error)} [options.error=noop]
 * @param {successCallback(response)} [options.success=noop]
 *
 * @param {Number} [options.idle_delay=30m]
 * @param {Number} [options.poll_delay=20s]
 *
 * @param {Boolean} [options.debug=false]
 */

var Concurrency = {
    init(player, options = {}) {
        const defaults = {
            idle_delay: 1000 * 60 * 30,
            poll_delay: 1000 * 20,
            error:      Function.prototype,
            method:     'GET',
            success:    Function.prototype
        };

        this.options = extend({}, defaults, options);

        this.idle_timeout_id = null;
        this.poll_timeout_id = null;

        this.debug = options.debug || false;

        player.on('ended', this.onEnded.bind(this));
        player.on('pause', this.onPause.bind(this));
        player.on('play', this.onPlay.bind(this));
    },

    error(message, ...messages) {
        if (messages.length > 0) {
            console.error(message, messages);
        } else {
            console.error(message);
        }
    },

    log(message, ...messages) {
        if (this.debug !== true) {
            return;
        }

        if (messages.length > 0) {
            console.log(message, messages);
        } else {
            console.log(message);
        }
    },

    /**
     * @name On Ended
     * @description
     * Initiates concurrency stopping on video end.
     *
     * @param {Object} event
     */

    onEnded(event) {
        this.log('ended');

        this.log('poll: reset');
        this.log('poll: stopped');

        // kill idle timer
        clearTimeout(this.idle_timeout_id);

        // kill poll timer
        clearTimeout(this.poll_timeout_id);
    },

    /**
     * @name On Pause
     * @description
     * Initiates concurrency stopping on video pause (After set delay).
     *
     * @param {Object} event
     */

    onPause(event) {
        this.log('pause');

        this.log(`poll: stopping in ${this.options.idle_delay}ms`);

        this.idle_timeout_id = setTimeout(() => {
            this.log('poll: reset');
            this.log('poll: stopped');

            // kill poll timer
            clearTimeout(this.poll_timeout_id);
        }, this.options.idle_delay);
    },

    /**
     * @name On Play
     * @description
     * Initiates concurrency polling on video play.
     *
     * @param {Object} event
     */

    onPlay(event) {
        this.log('play');

        // kill existing idle timer
        clearTimeout(this.idle_timeout_id);

        // kill existing poll timer
        clearTimeout(this.poll_timeout_id);

        this.log('poll: reset');
        this.log(`poll: running every ${this.options.poll_delay}ms`);

        this.poll();
    },

    /**
     * @name Poll
     * @description
     * Polls the configured concurrency server then executes the provided callback
     * to determine how to proceed.
     *
     * This method currently only accepts json.
     */

    poll() {
        let url = Url.buildUrl(this.options.url, this.options);
        let url_options = Url.buildOptions(this.options);

        this.log(`poll: ${url}`);

        fetch(url, url_options)
            .then(function (response) {
                return response.json();
            })

            .then((body) => {
                this.poll_timeout_id = setTimeout(() => {
                    this.options.success.apply(this, [body]);
                }, this.options.poll_delay);
            })

            .catch((error) => {
                this.error(error);

                this.options.error.apply(this, [error]);
            });
    }
};

videojs.plugin('concurrency', function concurrency(options) {
    Concurrency.init(this, options);
});
