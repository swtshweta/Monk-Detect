/*
 * A jquery plugin for detecting and validating credit cards
 */

(function(window, document, $) {
    var defaults;

    // Plugin Core
    $.cardcheck = function(option) {
        var cards = defaults.types || [],
            num = (typeof option === "string") ? option : option.num,
            len = num.length,
            type,
            validLen = false,
            validLuhn = false;

        // Get matched type based on credit card number
        $.each(cards, function(index, card) {
            if (card.checkType(num)) {
                type = index;
                return false;
            }
        });

        // If number, cards, and a matched type
        if (num && cards && cards[type]) {
            // Check card length
            validLen = cards[type].checkLength(len);

            // Check Luhn
            validLuhn = defaults.checkLuhn(num);
        }

        return {
            type: type,
            validLen: validLen,
            validLuhn: validLuhn
        };
    };

    // Plugin Helper
    $.fn.cardcheck = function(option) {
        // Allow for just a callback to be provided or extend option
        if (option && $.isFunction(option)) {
            var _option = $({}, defaults);
            _option.callback = option;
            option = _option;
        }
        else {
            option = $.extend({}, defaults, option);
        }

        // Fire on keyup
        return this.bind('keyup', function() {
            var cards = option.types || {},
                num = this.value.replace(/\D+/g, ''), // strip all non-digits
                name = '',
                className = '',

            // Check card
            check = $.cardcheck({
                num: num
            });

            // Assign className based on matched type
            if (typeof check.type === "number") {
                name = cards[check.type].name;
                className = cards[check.type].className;
            }

            // Invoke callback
            option.callback.call(this, {
                num: num,
                len: num.length,
                cardName: name,
                cardClass: className,
                validLen: check.validLen,
                validLuhn: check.validLuhn,
                option: option
            });

        });
    };

    // Plugin Options
    defaults = $.fn.cardcheck.option = {
        checkLuhn: function(num) {
            // http://en.wikipedia.org/wiki/Luhn_algorithm
            var len = num.length;
            if (!num || !len) {
                return false;
            }
            num = num.split('').reverse();
            var total = 0,
                i;
            for (i = 0; i < len; i++) {
                num[i] = window.parseInt(num[i], 10);
                total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
            }
            return total % 10 === 0;
        },
        // http://en.wikipedia.org/wiki/List_of_Bank_Identification_Numbers
        types: [
            {
                name: 'Visa',
                className: 'visa',
                checkType: function(num) {
                    return num.charAt(0) === '4';
                },
                checkLength: function(len) {
                    return len === 13 || len === 16;
                }
            },
            {
                name: 'American Express',
                className: 'amex',
                checkType: function(num) {
                    return num.substr(0, 2) === '34' || num.substr(0, 2) === '37'
                },
                checkLength: function(len) {
                    return len === 15;
                }
            },
            {
                name: 'MasterCard',
                className: 'mastercard',
                checkType: function(num) {
                    if (num.charAt(0) === '5') {
                        return num.charAt(1) >= 1 && num.charAt(1) <= 5;
                    }
                    return false;
                },
                checkLength: function(len) {
                    return len === 16;
                }
            },
            {
                name: 'Discover',
                className: 'discover',
                checkType:  function(num) {
                    if (num.charAt(0) === '6') {
                        return num.substr(0, 2) === '65' || num.substr(0, 4) === '6011' || num.substr(0, 3) === '644' || (num.substr(0, 1) === '6' && parseInt(num) >= '622126' && parseInt(num) <= '622925')
                    }
                    return false;
                },
                checkLength: function(len) {
                    return len === 16;
                }
            },
            {
                name: 'JCB',
                className: 'jcb',
                checkType:  function(num) {
                    return num.substr(0, 2) === '35';
                },
                checkLength: function(len) {
                    return len === 16;
                }
            },
            {
                name: 'Diners Club',
                className: 'diners',
                checkType:  function(num) {
                    return num.substr(0, 2) === '36' || num.substr(0, 2) === '38';
                },
                checkLength: function(len) {
                    return len === 14;
                }
            }
        ],
        callback: $.noop
    };

})(this, this.document, this.jQuery);

jQuery(function($) {

        // When the user focuses on the credit card input field, hide the status
        $('.card input').bind('focus', function() {
            $('.card .status').hide();
        });

        // When the user tabs or clicks away from the credit card input field, show the status
        $('.card input').bind('blur', function(result) {
            $('.card .status').show();

			alert(result.cardName);
			if ( result.cardName == 'Visa' ) {
				$("#ccard_number").mask("9999 9999 9999 9?999");
			}
			if ( result.cardName == 'American Express' ) {
				$("#ccard_number").mask("999 999999 99999");
			}
			if ( result.cardName == 'MasterCard' ) {
				$("#ccard_number").mask("9999 9999 9999 9999");
			}
			if ( result.cardName == 'Discover' ) {
				$("#ccard_number").mask("9999 9999 9999 9999");
			}
			if ( result.cardName == 'JCB' ) {
				$("#ccard_number").mask("9999 9999 9999 9999");
			}
			if ( result.cardName == 'Diners Club' ) {
				$("#ccard_number").mask("999 999999 9999");
			}

        });

        // Run jQuery.cardcheck on the input
        $('.card input').cardcheck({
            callback: function(result) {

                var status = (result.validLen && result.validLuhn) ? 'valid' : 'invalid',
                    message = '',
                    types = '';

                // Get the names of all accepted card types to use in the status message.
                for (i in result.option.types) {
                    types += result.option.types[i].name + ", ";
                }
                types = types.substring(0, types.length-2);

                // Set status message
                if (result.len < 1) {
                    message = 'Please provide a credit card number.';
                } else if (!result.cardClass) {
                    message = 'We accept the following types of cards: ' + types + '.';
                } else if (!result.validLen) {
                    message = 'Please check that this number matches your ' + result.cardName + ' (it appears to be the wrong number of digits.)';
                } else if (!result.validLuhn) {
                    message = 'Please check that this number matches your ' + result.cardName + ' (did you mistype a digit?)';
                } else {
                    message = 'Great, looks like a valid ' + result.cardName + '.';
                }

                // Show credit card icon
                $('.card .card_icon').removeClass().addClass('card_icon ' + result.cardClass);

                // Show status message
                $('.card .status').removeClass('invalid valid').addClass(status).children('.status_message').text(message);

            }
        });
    });