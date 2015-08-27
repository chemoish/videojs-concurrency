import 'whatwg-fetch';

import Url from './url';
import UrlOption from './url-option';

import extend from './extend';

import './console';

const defaults = {
    idle_delay: 1000 * 60 * 30,
    poll_delay: 1000 * 20,
    error:      Function.prototype,
    method:     'GET',
    success:    Function.prototype
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

class Concurrency {
    constructor(player, options = {}) {
        this.options = extend({}, defaults, options);

        this.idle_timeout_id = null;
        this.poll_timeout_id = null;

        this.debug = options.debug || false;

        player.on('ended', this.onEnded.bind(this));
        player.on('pause', this.onPause.bind(this));
        player.on('play', this.onPlay.bind(this));
    }

    error(message, ...messages) {
        if (this.debug !== true) {
            return;
        }

        if (messages.length > 0) {
            console.error(message, messages);
        } else {
            console.error(message);
        }
    }

    log(message, ...messages) {
        if (this.debug !== true) {
            return;
        }

        if (messages.length > 0) {
            console.log(message, messages);
        } else {
            console.log(message);
        }
    }

    warn(message, ...messages) {
        if (this.debug !== true) {
            return;
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

    onEnded(event) {
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

    onPause(event) {
        this.log('pause');

        this.log(`poll: stopping in ${this.options.idle_delay}ms`);

        this.idle_timeout_id = setTimeout(function () {
            this.log('poll: reset');
            this.log('poll: stopped');

            // kill poll timer
            clearTimeout(this.poll_timeout_id);
        }.bind(this), this.options.idle_delay);
    }

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
    }

    /**
     * @name Poll
     * @description
     * Polls the configured concurrency server then executes the provided callback
     * to determine how to proceed.
     *
     * This method currently only accepts json.
     */

    poll() {
        let url = Url.build(this.options.url, this.options);
        let url_options = UrlOption.build(this.options);

        this.log(`poll: ${url}`);

        fetch(url, url_options)
            .then(function (response) {
                return response.json();
            })

            .then(function (body) {
                this.poll_timeout_id = setTimeout(function () {
                    this.options.success.apply(this, [body]);
                }.bind(this), this.options.poll_delay);
            }.bind(this))

            .catch(function (error) {
                this.error(error);

                this.options.error.apply(this, [error]);
            }.bind(this));
    }
}

videojs.plugin('concurrency', function concurrency(options) {
    new Concurrency(this, options);
});
