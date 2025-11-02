// bright-sdk-i18n-client - browser-friendly i18n utility
// Responsibilities:
// - translate by key (t)
// - translate by value (translateValue) using reverse map built from default locale
// - add/merge messages and switch locale

var BrightSdkI18n = (function () {
	var current = 'en';
	var messages = {};
	var defaultLocale = 'en';
	var reverseMap = {};

	function buildReverse() {
		reverseMap = {};
		var def = messages[defaultLocale] || {};
		Object.keys(def).forEach(function (k) {
			var v = def[k];
			if (typeof v === 'string') reverseMap[v] = k;
		});
	}

	function init(options) {
		options = options || {};
		current = options.locale || current;
		defaultLocale = options.defaultLocale || defaultLocale;
		messages = options.messages || messages;
		buildReverse();
	}

	function _applyParams(str, params) {
		if (!params || typeof params !== 'object') return str;
		Object.keys(params).forEach(function (p) {
			var re = new RegExp('\\{' + p + '\\}', 'g');
			str = str.replace(re, String(params[p]));
		});
		return str;
	}

	function t(key, params) {
		var curVal = (messages[current] && messages[current][key]);
		var defVal = (messages[defaultLocale] && messages[defaultLocale][key]);
		var out = (typeof curVal !== 'undefined') ? curVal : (typeof defVal !== 'undefined' ? defVal : key);
		return _applyParams(out, params);
	}

	function translateValue(value) {
		if (typeof value !== 'string') return value;
		var key = reverseMap[value];
		if (key) return t(key);
		// not found — try simple reverse lookup across default locale values (already covered)
		return value;
	}

	function addMessages(locale, msgs) {
		messages[locale] = Object.assign({}, messages[locale] || {}, msgs);
		if (locale === defaultLocale) buildReverse();
	}

	function setLocale(l) { current = l; }
	function getLocale() { return current; }
	function getMessages() { return messages; }

	return {
		init: init,
		t: t,
		translateValue: translateValue,
		addMessages: addMessages,
		setLocale: setLocale,
		getLocale: getLocale,
		_getMessages: getMessages
	};
})();

// expose globally for browser usage
if (typeof window !== 'undefined') {
	// expose runtime on a private global to avoid colliding with the UMD
	// bundle export (which may also assign to window.BrightSdkI18n). The
	// facade will use this private name when present to avoid recursion.
	window.__BrightSdkI18nRuntime = BrightSdkI18n;
}

export default BrightSdkI18n;

