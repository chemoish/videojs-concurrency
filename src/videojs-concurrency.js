/* eslint-disable no-console, no-new */

import 'console-polyfill';
import 'whatwg-fetch';
import Url from './url';
import videojs from 'video.js';

/**
 * @name Concurrency Plugin
 * @description
 *
 * @example
 * videojs('player_id', {
 *   plugins: {
 *     concurrency: {
 *       url: '/path/to/concurrency.server',
 *       success: function(response) {
 *         this.poll();
 *       }
 *     }
 *   }
 * });
 *
 * videojs('player_id').concurrency({
 *   url: '/path/to/concurrency.server',
 *   success: function(response) {
 *     this.poll();
 *   }
 * });
 *
 * @param {Object} player VideoJS player
 * @param {Object} options={}
 * @param {Object} [options.data]
 * @param {Object} [options.headers]
 * @param {String} [options.method=GET]
 * @param {String} options.url
 *
 * @param {errorCallback(error)} [options.error=noop]
 * @param {successCallback(response)} [options.success=noop]
 *
 * @param {Number} [options.idleDelay=30m]
 * @param {Number} [options.pollDelay=20s]
 *
 * @param {Boolean} [options.debug=false]
 */

class Concurrency {
  constructor(player, options = {}) {
    const defaults = {
      idleDelay: 1000 * 60 * 30,
      pollDelay: 1000 * 20,
      error: Function.prototype,
      method: 'GET',
      success: Function.prototype,
    };

    this.options = videojs.mergeOptions({}, defaults, options);

    this.idle_timeout_id = null;
    this.poll_timeout_id = null;

    this.debug = options.debug || false;

    player.on('ended', this.onEnded.bind(this));
    player.on('pause', this.onPause.bind(this));
    player.on('play', this.onPlay.bind(this));
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

  /**
   * @name On Ended
   * @description
   * Initiates concurrency stopping on video end.
   *
   * @param {Object} event
   */

  onEnded() {
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

  onPause() {
    this.log('pause');

    this.log(`poll: stopping in ${this.options.idleDelay}ms`);

    this.idle_timeout_id = setTimeout(() => {
      this.log('poll: reset');
      this.log('poll: stopped');

      // kill poll timer
      clearTimeout(this.poll_timeout_id);
    }, this.options.idleDelay);
  }

  /**
   * @name On Play
   * @description
   * Initiates concurrency polling on video play.
   *
   * @param {Object} event
   */

  onPlay() {
    this.log('play');

    // kill existing idle timer
    clearTimeout(this.idle_timeout_id);

    // kill existing poll timer
    clearTimeout(this.poll_timeout_id);

    this.log('poll: reset');
    this.log(`poll: running every ${this.options.pollDelay}ms`);

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
    const url = Url.buildUrl(this.options.url, this.options);
    const urlOptions = Url.buildOptions(this.options);

    this.log(`poll: ${url}`);

    fetch(url, urlOptions)
      .then((response) => {
        if (response.status >= 400) {
          throw response;
        }

        return response;
      })

    .then((response) => response.json())

    .then((body) => {
      this.poll_timeout_id = setTimeout(() => {
        this.options.success.apply(this, [body]);
      }, this.options.pollDelay);
    })

    .catch((error) => {
      this.options.error.call(this, error);
    });
  }
}

function concurrency(options) {
  new Concurrency(this, options);
}

videojs.plugin('concurrency', concurrency);

export default concurrency;
