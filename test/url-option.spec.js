import UrlOption from '../src/url-option';

describe('url-option.js', function () {
    describe(':: build()', function () {
        describe('get:', function () {
            it('should build correctly.', function () {
                expect(UrlOption.build({
                    method: 'GET'
                })).toEqual({});
            });
        });

        describe('post:', function () {
            it('should simple build correctly.', function () {
                expect(UrlOption.build({
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
                expect(UrlOption.build({
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
                expect(UrlOption.build({
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
});
