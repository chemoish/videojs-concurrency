import Url from '../src/url';

describe('url.js', function () {
    describe(':: buildUri()', function () {
        it('should build a simple uri correctly.', function () {
            expect(Url.buildUri('http://google.com')).toBe('http://google.com');
        });

        it('should build a uri with query string correctly.', function () {
            expect(Url.buildUri('http://google.com', {
                foo: 'foo'
            })).toBe('http://google.com?foo=foo');

            expect(Url.buildUri('http://google.com', {
                foo: 'foo',
                bar: 'bar'
            })).toBe('http://google.com?foo=foo&bar=bar');
        });
    });

    describe(':: buildUrl()', function () {
        it('should build a GET url correctly.', function () {
            expect(Url.buildUrl('http://google.com', {
                method: 'GET'
            })).toBe('http://google.com/');
        });

        it('should build a POST url correctly.', function () {
            expect(Url.buildUrl('http://google.com', {
                method: 'POST',
                data: {
                    foo: 'foo'
                }
            })).toBe('http://google.com');
        });
    });

    describe(':: buildOptions()', function () {
        describe('get:', function () {
            it('should build correctly.', function () {
                expect(Url.buildOptions({
                    method: 'GET'
                })).toEqual({});
            });
        });

        describe('post:', function () {
            it('should simple build correctly.', function () {
                expect(Url.buildOptions({
                    method: 'POST'
                })).toEqual({
                    method: 'POST',
                    body: undefined,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            });

            it('should build with data correctly.', function () {
                expect(Url.buildOptions({
                    method: 'POST',
                    data: {
                        foo: 'foo'
                    }
                })).toEqual({
                    method: 'POST',
                    body: '{"foo":"foo"}',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            });

            it('should build with data and headers correctly.', function () {
                expect(Url.buildOptions({
                    method: 'POST',
                    data: {
                        foo: 'foo'
                    },
                    headers: {
                        bar: 'bar'
                    }
                })).toEqual({
                    method: 'POST',
                    body: '{"foo":"foo"}',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        bar: 'bar'
                    }
                });
            });
        });
    });

    describe(':: parseUrl()', function () {
        it('should parse a simple url correctly.', function () {
            let data,
                host;

            ({data, host} = Url.parseUrl('http://google.com'));

            expect(data).toEqual({});
            expect(host).toBe('http://google.com/');

            ({data, host} = Url.parseUrl('http://google.com/sample.json'));
            expect(data).toEqual({});
            expect(host).toBe('http://google.com/sample.json');
        });

        it('should parse a url with query string correctly.', function () {
            let data,
                host;

            ({data, host} = Url.parseUrl('http://google.com?foo=foo&bar=bar'));

            expect(data).toEqual({
                foo: 'foo',
                bar: 'bar'
            });
            expect(host).toBe('http://google.com/');
        });

        it('should parse a url with query string and data correctly.', function () {
            let data,
                host;

            ({data, host} = Url.parseUrl('http://google.com?foo=foo&bar=bar', {
                data: {
                    foobar: 'foobar'
                }
            }));

            expect(data).toEqual({
                foo: 'foo',
                bar: 'bar',
                foobar: 'foobar'
            });
            expect(host).toBe('http://google.com/');

            ({data, host} = Url.parseUrl('http://google.com?foo=foo&bar=bar', {
                data: {
                    foo: 'oof',
                    bar: 'rab'
                }
            }));

            expect(data).toEqual({
                foo: 'oof',
                bar: 'rab'
            });
            expect(host).toBe('http://google.com/');
        });
    });
});
