(function( $ ) {
	$.fn.creditcard_type = function( options ) {
		var settings = $.extend( {
				'credit_card_logos_id': '.ccard_logo'
			}, options),

			// the object that contains the logos
			logos_object = $(settings.credit_card_logos_id),

			// Visa regular expressions
			visa_regex = new RegExp('^4[0-9]{0,15}$'),

			// MasterCard regular expressions
			mastercard_regex = new RegExp('^5$|^5[1-5][0-9]{0,14}$'),

			// American Express regular expressions
			amex_regex = new RegExp('^3$|^3[47][0-9]{0,13}$'),

			// Diners Club regular expressions
			diners_regex = new RegExp('^3$|^3[068]$|^3(?:0[0-5]|[68][0-9])[0-9]{0,11}$'),

			//Discover regular expressions
			discover_regex = new RegExp('^6$|^6[05]$|^601[1]?$|^65[0-9][0-9]?$|^6(?:011|5[0-9]{2})[0-9]{0,12}$'),

			//JCB regular expressions
			jcb_regex = new RegExp('^2[1]?$|^21[3]?$|^1[8]?$|^18[0]?$|^(?:2131|1800)[0-9]{0,11}$|^3[5]?$|^35[0-9]{0,14}$');

			//Maestro regular expressions
			//maestro_regex = new RegExp('^(5[06-8]|6d)d{10,17}$'),

			//Solo regular expressons
			//solo_regex = new RegExp('6767d{12}(d{2,3})?$'),

			//Laser regular expressions
			//laser_regex = new RegExp('^(6304|6706|6771|6709)d{8}(d{4}|d{6,7})?$');


		return this.each(function(){
			// as the user types
			$(this).keyup(function(){
				var cur_val = $(this).val();

				// get rid of spaces and dashes before using the regular expression
				cur_val = cur_val.replace(/ /g,'').replace(/-/g,'');

				// checks per each, as their could be multiple hits
				if ( cur_val.match(visa_regex) ) {
					$(logos_object).addClass('is_visa');
					$("#check_card_number").mask("9999 9999 9999 9?999");


				} else {
					$(logos_object).removeClass('is_visa');
				}

				if ( cur_val.match(mastercard_regex) ) {
					$("#check_card_number").mask("9999 9999 9999 9999");
					$(logos_object).addClass('is_mastercard');
				} else {
					$(logos_object).removeClass('is_mastercard');
				}

				if ( cur_val.match(amex_regex) ) {
					$(logos_object).addClass('is_amex');
					$("#check_card_number").mask("9999 999999 99999");

				} else {
					$(logos_object).removeClass('is_amex');
				}

				if ( cur_val.match(diners_regex) ) {
					$("#check_card_number").mask("9999 999999 9999");
					$(logos_object).addClass('is_diners');
				} else {
					$(logos_object).removeClass('is_diners');
				}

				if ( cur_val.match(discover_regex) ) {
					$("#check_card_number").mask("9999 9999 9999 9999");
					$(logos_object).addClass('is_discover');
				} else {
					$(logos_object).removeClass('is_discover');
				}

				if ( cur_val.match(jcb_regex) ) {
					$("#check_card_number").mask("9999 9999 9999 9999");
					$(logos_object).addClass('is_jcb');
				} else {
					$(logos_object).removeClass('is_jcb');
				}


				// if nothing is a hit we add a class to fade them all out
				if ( cur_val != '' && !cur_val.match(visa_regex) && !cur_val.match(mastercard_regex) && !cur_val.match(amex_regex)
					&& !cur_val.match(diners_regex) && !cur_val.match(discover_regex) && !cur_val.match(jcb_regex)
					) {
					$(logos_object).addClass('is_nothing');
				} else {
					$(logos_object).removeClass('is_nothing');
				}
			});
		});
	};
})( jQuery );