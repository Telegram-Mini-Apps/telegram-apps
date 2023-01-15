(function () {
    'use strict';

    /**
     * Returns true in case, passed value has #RGB format.
     * @param value - value to check.
     */
    /**
     * Returns true in case, passed value has #RRGGBB format.
     * @param value - value to check.
     */
    function isRGB(value) {
        return /^#[\da-f]{6}$/i.test(value);
    }

    /**
     * States that passed value is Record and not Array.
     * @param value - value to check.
     */
    function isRecord(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    /**
     * Extracts correct options from options, passed to parsers.
     * @param from
     * @param toOrOptional
     * @param optional
     */
    function getParserOptions(from, toOrOptional, optional) {
        var to;
        var isOptional;
        if (toOrOptional === undefined) {
            to = from;
            isOptional = false;
        }
        else if (typeof toOrOptional === 'boolean') {
            to = from;
            isOptional = toOrOptional;
        }
        else {
            to = toOrOptional;
            isOptional = optional || false;
        }
        return { to: to, isOptional: isOptional };
    }

    /**
     * Shape which could be used to parse JSON structures.
     */
    var JsonShape = /** @class */ (function () {
        function JsonShape() {
            var _this = this;
            this.parsers = [];
            /**
             * Adds parser for field of type boolean.
             */
            this.bool = this.createTypeOfParser('boolean');
            /**
             * Adds parser for field of type string.
             */
            this.string = this.createTypeOfParser('string');
            /**
             * Adds parser for field of type number.
             */
            this.number = this.createTypeOfParser('number');
            /**
             * Adds parser for field of type RGB.
             */
            this.rgb = (function (from, toOrOptional, optional) {
                var _a = getParserOptions(from, toOrOptional, optional), to = _a.to, isOptional = _a.isOptional;
                _this.parsers.push([from, to, function (value) {
                        if (value === undefined) {
                            if (!isOptional) {
                                throw new TypeError("Unable to parse field \"".concat(from, "\". Value is empty."));
                            }
                            return;
                        }
                        if (typeof value !== 'string' || !isRGB(value)) {
                            throw new TypeError("Unable to parse field \"".concat(from, "\" with ") +
                                "value ".concat(JSON.stringify(value), " as RGB."));
                        }
                        return value;
                    }]);
                return _this;
            });
        }
        JsonShape.prototype.createTypeOfParser = function (type) {
            var _this = this;
            return (function (from, toOrOptional, optional) {
                var _a = getParserOptions(from, toOrOptional, optional), to = _a.to, isOptional = _a.isOptional;
                _this.parsers.push([from, to, function (value) {
                        if (value === undefined) {
                            if (!isOptional) {
                                throw new TypeError("Unable to parse field \"".concat(from, "\". Value is empty."));
                            }
                            return;
                        }
                        if (typeof value !== type) {
                            throw new TypeError("Unable to parse field \"".concat(from, "\" with ") +
                                "value ".concat(JSON.stringify(value), " as ").concat(type, "."));
                        }
                        return value;
                    }]);
                return _this;
            });
        };
        /**
         * Parses incoming value.
         * @param value - value to parse.
         */
        JsonShape.prototype.parse = function (value) {
            var json = value;
            // Convert value to JSON in case, it is string. We expect value to be
            // JSON string.
            if (typeof json === 'string') {
                try {
                    json = JSON.parse(json);
                }
                catch (e) {
                    throw new TypeError('Value is not JSON object converted to string.');
                }
            }
            // We expect json to be usual object.
            if (!isRecord(json)) {
                throw new TypeError('Value is not JSON object.');
            }
            return this.parsers.reduce(function (acc, _a) {
                var from = _a[0], to = _a[1], parse = _a[2];
                var value = parse(json[from]);
                if (value !== undefined) {
                    acc[to] = value;
                }
                return acc;
            }, {});
        };
        return JsonShape;
    }());

    /**
     * Shape which could be used to parse URL search params.
     */
    var SearchParamsShape = /** @class */ (function () {
        function SearchParamsShape() {
            var _this = this;
            this.parsers = [];
            /**
             * Adds custom parser for specified field.
             */
            this.custom = (function (from, toOrParser, parserOrOptional, optional) {
                var to;
                var parser;
                var isOptional;
                if (typeof toOrParser === 'object') {
                    to = from;
                    parser = toOrParser;
                    isOptional = !!parserOrOptional;
                }
                else {
                    to = toOrParser;
                    parser = parserOrOptional;
                    isOptional = optional || false;
                }
                _this.parsers.push([from, to, function (value) {
                        if (value === null) {
                            if (!isOptional) {
                                throw new TypeError("Unable to parse field \"".concat(from, "\". Value is empty."));
                            }
                            return;
                        }
                        return parser.parse(value);
                    }]);
                return _this;
            });
            /**
             * Adds parser for field of type Date.
             */
            this.date = this.createParser(function (from, value) {
                if (value !== '') {
                    var asInt = Number(value);
                    var date = new Date(asInt.toString() === value ? asInt * 1000 : value);
                    if (date.toString() !== 'Invalid Date') {
                        return date;
                    }
                }
                throw new TypeError("Unable to parse value \"".concat(value, "\" as Date"));
            });
            /**
             * Adds parser for field of type string.
             */
            this.string = this.createParser(function (_, value) { return value; });
        }
        SearchParamsShape.prototype.createParser = function (parse) {
            var _this = this;
            return (function (from, toOrOptional, optional) {
                var _a = getParserOptions(from, toOrOptional, optional), to = _a.to, isOptional = _a.isOptional;
                _this.parsers.push([from, to, function (value) {
                        if (value === null) {
                            if (!isOptional) {
                                throw new TypeError("Unable to parse field \"".concat(from, "\". Value is empty."));
                            }
                            return;
                        }
                        return parse(from, value);
                    }]);
                return _this;
            });
        };
        /**
         * Parses incoming value.
         * @param value - value to parse.
         */
        SearchParamsShape.prototype.parse = function (value) {
            if (value === undefined) {
                throw new TypeError('Value is empty.');
            }
            var params = typeof value === 'string'
                ? new URLSearchParams(value)
                : value;
            return this.parsers.reduce(function (acc, _a) {
                var from = _a[0], to = _a[1], parse = _a[2];
                var value = parse(params.get(from));
                if (value !== undefined) {
                    acc[to] = value;
                }
                return acc;
            }, {});
        };
        return SearchParamsShape;
    }());

    var lp = 'tgWebAppData=auth_date%3D1672418130%26hash%3D68570a4968ca87b8bde6fae0e6a2e30486af899bf80982105d16dc42fe89b45d%26query_id%3DAAHdF6IQAAAAAN0XohASX1Fh%26user%3D%257B%2522id%2522%253A279058397%252C%2522first_name%2522%253A%2522Vladislav%2522%252C%2522last_name%2522%253A%2522Kibenko%2522%252C%2522username%2522%253A%2522vdkfrost%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%257D&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235288c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23708499%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D&tgWebAppVersion=6.4';
    var user = new JsonShape()
        .string('first_name', 'firstName')
        .number('id')
        .bool('is_bot', 'isBot', true)
        .bool('is_premium', 'isPremium', true)
        .string('last_name', 'lastName', true)
        .string('language_code', 'languageCode', true)
        .string('photo_url', 'photoURL', true)
        .string('username', true);
    var chat = new JsonShape()
        .number('id')
        .string('photo_url', 'photoURL', true)
        .string('type')
        .string('title')
        .string('username', true);
    var launchParams = new SearchParamsShape()
        .string('tgWebAppVersion')
        .string('tgWebAppPlatform')
        .custom('tgWebAppData', new SearchParamsShape()
        .date('auth_date')
        .string('hash')
        .custom('user', user, true)
        .custom('receiver', user, true)
        .custom('chat', chat, true)
        .date('can_send_after', true)
        .string('query_id', true)
        .string('start_param', true))
        .custom('tgWebAppThemeParams', new JsonShape()
        .rgb('bg_color', 'backgroundColor')
        .rgb('hint_color', 'hintColor')
        .rgb('text_color', 'textColor')
        .rgb('button_color', 'buttonColor')
        .rgb('button_text_color', 'buttonTextColor')
        .rgb('link_color', 'linkColor')
        .rgb('secondary_bg_color', 'secondaryBackgroundColor', true));
    var parsed = launchParams.parse(lp);
    console.log(parsed);

})();
