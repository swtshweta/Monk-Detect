jQuery(function($) {

        // hiding the status as the user focuses on the credit card input field
        $('.card input').bind('focus', function() {
			$("#ccard_number").unmask();//unmasking the text field as user starts typing
            $('.card .status').hide();
        });

        // showing the status when the user tabs or clicks away from the credit card input field
        $('.card input').bind('blur', function() {
            $('.card .status').show();

        });

        // checking input value entered using jquery.cardchecker
        $('.card input').cardchecker({
            callback: function(result) {

                var status = (result.validLen && result.validLuhn) ? 'valid' : 'invalid',
                    message = '',
                    types = '',
					i;

                // Getting the names of all accepted card types.
                for (i in result.option.types) {
                    types += result.option.types[i].cardName + ", ";
                }
                types = types.substring(0, types.length-2);

                // Set the status message
                if (result.len < 1) {
                    message = 'Please enter a credit card number.';
                } else if (!result.cardClass) {
                    message = 'We accept the following card types: ' + types + '.';
                } else if (!result.validLen) {
                    message = 'It appears to be wrong number of digit. Please check that this number matches your "' + result.cardName + '" card';
                } else if (!result.validLuhn) {
                    message = 'Did you mistype a digit as this number matches your "' + result.cardName + '" card ';
                } else {
                    message = 'It looks like a valid ' + result.cardName + '.';
					if ( result.validLen ) {
						if ( result.cardName === 'Visa' ) { //if the card is Visa
							$("#ccard_number").mask("9999-9999-9999-9?999");
						}
						if ( result.cardName === 'American Express' ) { //if the card is American Express
							$("#ccard_number").mask("999-999999-999999");
						}
						if ( result.cardName === 'MasterCard' ) { //if the card is MasterCard
							$("#ccard_number").mask("9999-9999-9999-9999");
						}
						if ( result.cardName === 'Discover' ) { //if the card is Discover
							$("#ccard_number").mask("9999-9999-9999-9999");
						}
						if ( result.cardName === 'JCB' ) { //if the card is JCB
							$("#ccard_number").mask("9999-9999-9999-9999");
						}
						if ( result.cardName === 'Diners Club' ) { //if the card is Diners Club
							$("#ccard_number").mask("999-999999-99999");
						}
						if ( result.cardName === 'Maestro' ) { //if the card is Maestro
							$("#ccard_number").mask("9999-9999-9999?-9999999");
						}
					}
                }

                // Show credit card icon
                $('.card .card_icon').removeClass().addClass('card_icon ' + result.cardClass);

                // Show status message
                $('.card .status').removeClass('invalid valid').addClass(status).children('.status_message').text(message);

            }
        });
    });

/*
 * function for validating and formatting credit cards
 */
(function($, window, document) {
    var defaultvalue;

    // Plugin Core
    $.cardchecker = function(option) {
        var ccard = defaultvalue.types || [],
            num = (typeof option === "string") ? option : option.num,
            len = num.length,
            type,
            validLen = false,
            validLuhn = false;

        // Get matched type based on credit card number
        $.each(ccard, function(index, card) {
            if (card.typeCheck(num)) {
                type = index;
                return false;
            }
        });

        // If number, ccard, and a matched type
        if (num && ccard && ccard[type]) {
            // Check card length
            validLen = ccard[type].lengthCheck(len);

            // Check Luhn Algorithm
            validLuhn = defaultvalue.luhnCheck(num);
        }

        return {
            type: type,
            validLen: validLen,
            validLuhn: validLuhn
        };
    };

    // Plugin Helper
    $.fn.cardchecker = function(option) {
        // Allow for just a callback to be provided or extend method that merges the contents of two or more objects, storing the result in the first object.
        if (option && $.isFunction(option)) {
            var _option = $({}, defaultvalue);
            _option.callback = option;
            option = _option;
        } else {
            option = $.extend({}, defaultvalue, option);
        }

        // Fire on keyup
        return this.bind('keyup', function() {
            var ccard = option.types || {},
                num = this.value.replace(/\D+/g, ''), // strip all non-digits
                cardName = '',
                className = '',

            // Check card
            check = $.cardchecker({
                num: num
            });

            // Assign className based on matched type
            if (typeof check.type === "number") {
                cardName = ccard[check.type].cardName;
                className = ccard[check.type].className;
            }

            // Invoke callback
            option.callback.call(this, {
                num: num,
                len: num.length,
                cardName: cardName,
                cardClass: className,
                validLen: check.validLen,
                validLuhn: check.validLuhn,
                option: option
            });

        });
    };

    // Plugin Options
    defaultvalue = $.fn.cardchecker.option = {
        luhnCheck: function(num) {
            // http://en.wikipedia.org/wiki/Luhn_algorithm
            var len = num.length,
			total = 0,
			i;
            if (!num || !len) {
                return false;
            }
            num = num.split('').reverse();
            for (i = 0; i < len; i++) {
                num[i] = window.parseInt(num[i], 10);
                total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
            }
            return total % 10 === 0;
        },
        // http://en.wikipedia.org/wiki/Bank_card_number
        types: [
            {
                cardName: 'Visa',
                className: 'visa',
                typeCheck: function(num) { return num.charAt(0) === '4'; },
                lengthCheck: function(len) { return len === 13 || len === 16; }
            },
            {
                cardName: 'American Express',
                className: 'amex',
                typeCheck: function(num) { return num.substr(0, 2) === '34' || num.substr(0, 2) === '37'; },
                lengthCheck: function(len) { return len === 15; }
            },
            {
                cardName: 'MasterCard',
                className: 'mastercard',
                typeCheck: function(num) {
                    if (num.charAt(0) === '5') {
                        return num.charAt(1) >= 1 && num.charAt(1) <= 5;
                    }
                    return false;
                },
                lengthCheck: function(len) { return len === 16; }
            },
            {
                cardName: 'Discover',
                className: 'discover',
                typeCheck:  function(num) {
                    if (num.charAt(0) === '6') {
                        return num.substr(0, 2) === '65' || num.substr(0, 4) === '6011' || num.substr(0, 3) === '644' || (num.substr(0, 1) === '6' && parseInt(num, 10) >= '622126' && parseInt(num, 10) <= '622925');
                    }
                    return false;
                },
                lengthCheck: function(len) { return len === 16; }
            },
            {
                cardName: 'JCB',
                className: 'jcb',
                typeCheck:  function(num) { return num.substr(0, 2) === '35'; },
                lengthCheck: function(len) { return len === 16; }
            },
            {
                cardName: 'Diners Club',
                className: 'diners',
                typeCheck:  function(num) { return num.substr(0, 2) === '36' || num.substr(0, 2) === '38'; },
                lengthCheck: function(len) { return len === 14; }
            },
			{
                cardName: 'Maestro',
                className: 'maestro',
                typeCheck:  function(num) { return num.substr(0, 4) === '5018' || num.substr(0, 4) === '5020' || num.substr(0, 4) === '5038' || num.substr(0, 4) === '5893' || num.substr(0, 4) === '6304' || num.substr(0, 4) === '6759' || num.substr(0, 4) === '6761' || num.substr(0, 4) === '6762' || num.substr(0, 4) === '6763' || num.substr(0, 4) === '0604'; },
                lengthCheck: function(len) { return len === 12 || len === 13 || len === 14 || len === 15 || len === 16 || len === 17 || len === 18 || len === 19 ; }
            }
        ],
        callback: $.noop
    };

})(jQuery, window, document );