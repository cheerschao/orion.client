/*******************************************************************************
 * @license
 * Copyright (c) 2013, 2014 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
/*eslint-env amd*/
define([
], function() {

	var Util = {
		
		punc: '\n\t\r (){}[]:;,.+=-*^&@!%~`\'\"\/\\',  //$NON-NLS-0$
		
		/**
		 * @description Finds the word from the start position
		 * @function
		 * @public
		 * @memberof webtools.Util
		 * @param {String} text The text of the source to find the word in
		 * @param {Number} start The current start position of the carat
		 * @returns {String} Returns the computed word from the given string and offset or <code>null</code>
		 */
		findWord: function(text, start) {
			if(text && start) {
				var ispunc = this.punc.indexOf(text.charAt(start)) > -1;
				var pos = ispunc ? start-1 : start;
				while(pos >= 0) {
					if(this.punc.indexOf(text.charAt(pos)) > -1) {
						break;
					}
					pos--;
				}
				var s = pos;
				pos = start;
				while(pos <= text.length) {
					if(this.punc.indexOf(text.charAt(pos)) > -1) {
						break;
					}
					pos++;
				}
				if((s === start || (ispunc && (s === start-1))) && pos === start) {
					return null;
				}
				else if(s === start) {
					return text.substring(s, pos);
				}
				else {
					return text.substring(s+1, pos);
				}
			}
			return null;
		},
		
		/**
		 * @description Finds the token in the given token stream for the given start offset
		 * @function
		 * @public
		 * @memberof webtools.Util
		 * @param {Number} offset The offset intot the source
		 * @param {Array|Object} tokens The array of tokens to search
		 * @returns {Object} The token that starts at the given start offset
		 */
		findToken: function(offset, tokens) {
			if(offset != null && offset > -1 && tokens && tokens.length > 0) {
				var min = 0,
					max = tokens.length-1,
					token, 
					idx = 0;
					token = tokens[0];
				if(offset >= token.range[0] && offset < token.range[1]) {
					token.index = offset;
					return token;
				}
				token = tokens[max];
				if(offset >= token.range[0]) {
					token.index = max;
					return token;
				}
				token = null;
				while(min <= max) {
					idx = Math.floor((min + max) / 2);
					token = tokens[idx];
					if(offset < token.range[0]) {
						max = idx-1;
					}
					else if(offset > token.range[1]) {
						min = idx+1;
					}
					else if(offset === token.range[1]) {
						var next = tokens[idx+1];
						if(next.range[0] === token.range[1]) {
							min = idx+1;
						}
						else {
							token.index = idx;
							return token;
						}
					}
					else if(offset >= token.range[0] && offset < token.range[1]) {
						token.index = idx;
						return token;
					}
					if(min === max) {
						token = tokens[min];
						if(offset >= token.range[0] && offset <= token.range[1]) {
							token.index = min;
							return token;
						}
						return null;
					}
				}
			}
			return null;
		}
	};

	return Util;
});
