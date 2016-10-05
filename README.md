# videojs-concurrency

[![Build Status](https://travis-ci.org/chemoish/videojs-concurrency.svg)](https://travis-ci.org/chemoish/videojs-concurrency)

> Video.js plugin for supporting concurrency—A strategy for limiting the amount of concurrent streams a user can start.

## Getting Started

#### Include

```html
<script src="/path/to/videojs.concurrency.min.js"></script>
```

#### Enable

```js
videojs('player_id').concurrency({
    url: '/path/to/concurrency.server',

    success: function (response) {
        this.poll();
    }
});
```

> Note: There are multiple ways to enable plugins. For more information, please visit [Video.js](https://github.com/videojs/video.js).

## Options

#### data

Type: `Object`  

#### debug

Type: `boolean`  
Default: `false`

#### error

Type: `function(error)`  
Default: `noop`

Enables polling manipulation on unsuccessful concurrency request.

#### headers

Type: `Object`  

#### idleDelay

Type: `number`  
Default: `1000 * 60 * 30`

When paused, become idle after 30 minutes.

#### method

Type: `string`  
Default: `GET`

#### pollDelay

Type: `number`  
Default: `1000 * 20`

Poll every 20 seconds.

#### success

Type: `function(response)`  
Default: `noop`

Enables polling manipulation on successful concurrency request.

#### url

Type: `string`  

```js
{
    url: '/path/to/concurrency.server?foo=foo'
}

{
    url: '/path/to/concurrency.server',
    data: {
        foo: 'foo'
    }
}
```

## Contributing + Example

```bash
npm install -g grunt-cli # only needed for contributing

npm install

npm start
```

## Testing

```bash
karma start

# single run
npm test

```

## License

Code licensed under [The MIT License](https://github.com/chemoish/videojs-concurrency/blob/master/LICENSE).
