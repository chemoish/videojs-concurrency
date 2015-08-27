# videojs-concurrency

> Video.js plugin for supporting concurrency.

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

#### method

Type: `String`  
Default: `GET`

#### url

Type: `String`  

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

---

#### success

Type: `successCallback`  
Default: `noop`

Enables polling manipulation on successful concurrency request.

#### error

Type: `errorCallback`  
Default: `noop`

Enables polling manipulation on unsuccessful concurrency request.

---

#### idle delay

Type: `Number`  
Default: `1000 * 60 * 30`

When paused, become idle after 30 minutes.

#### poll delay

Type: `Number`  
Default: `1000 * 20`

Poll every 20 seconds.

---

#### debug

Type: `Boolean`  
Default: `false`

## Contributing + Example

```bash
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
