(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Mock"] = factory();
	else
		root["Mock"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global require, module, window */
	var Handler = __webpack_require__(1)
	var Util = __webpack_require__(3)
	var Random = __webpack_require__(5)
	var RE = __webpack_require__(20)
	var toJSONSchema = __webpack_require__(23)
	var valid = __webpack_require__(25)

	var XHR
	if (typeof window !== 'undefined') XHR = __webpack_require__(27)

	/*!
	    Mock - 妯℃嫙璇锋眰 & 妯℃嫙鏁版嵁
	    https://github.com/nuysoft/Mock
	    澧ㄦ櫤 mozhi.gyy@taobao.com nuysoft@gmail.com
	*/
	var Mock = {
	    Handler: Handler,
	    Random: Random,
	    Util: Util,
	    XHR: XHR,
	    RE: RE,
	    toJSONSchema: toJSONSchema,
	    valid: valid,
	    heredoc: Util.heredoc,
	    setup: function(settings) {
	        return XHR.setup(settings)
	    },
	    _mocked: {}
	}

	Mock.version = '1.0.1-beta3'

	// 閬垮厤寰幆渚濊禆
	if (XHR) XHR.Mock = Mock

	/*
	    * Mock.mock( template )
	    * Mock.mock( function() )
	    * Mock.mock( rurl, template )
	    * Mock.mock( rurl, function(options) )
	    * Mock.mock( rurl, rtype, template )
	    * Mock.mock( rurl, rtype, function(options) )

	    鏍规嵁鏁版嵁妯℃澘鐢熸垚妯℃嫙鏁版嵁銆�
	*/
	Mock.mock = function(rurl, rtype, template) {
	    // Mock.mock(template)
	    if (arguments.length === 1) {
	        return Handler.gen(rurl)
	    }
	    // Mock.mock(rurl, template)
	    if (arguments.length === 2) {
	        template = rtype
	        rtype = undefined
	    }
	    // 鎷︽埅 XHR
	    if (XHR) window.XMLHttpRequest = XHR
	    Mock._mocked[rurl + (rtype || '')] = {
	        rurl: rurl,
	        rtype: rtype,
	        template: template
	    }
	    return Mock
	}

	module.exports = Mock

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* 
	    ## Handler

	    澶勭悊鏁版嵁妯℃澘銆�
	    
	    * Handler.gen( template, name?, context? )

	        鍏ュ彛鏂规硶銆�

	    * Data Template Definition, DTD
	        
	        澶勭悊鏁版嵁妯℃澘瀹氫箟銆�

	        * Handler.array( options )
	        * Handler.object( options )
	        * Handler.number( options )
	        * Handler.boolean( options )
	        * Handler.string( options )
	        * Handler.function( options )
	        * Handler.regexp( options )
	        
	        澶勭悊璺緞锛堢浉瀵瑰拰缁濆锛夈€�

	        * Handler.getValueByKeyPath( key, options )

	    * Data Placeholder Definition, DPD

	        澶勭悊鏁版嵁鍗犱綅绗﹀畾涔�

	        * Handler.placeholder( placeholder, context, templateContext, options )

	*/

	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var Parser = __webpack_require__(4)
	var Random = __webpack_require__(5)
	var RE = __webpack_require__(20)

	var Handler = {
	    extend: Util.extend
	}

	/*
	    template        灞炴€у€硷紙鍗虫暟鎹ā鏉匡級
	    name            灞炴€у悕
	    context         鏁版嵁涓婁笅鏂囷紝鐢熸垚鍚庣殑鏁版嵁
	    templateContext 妯℃澘涓婁笅鏂囷紝

	    Handle.gen(template, name, options)
	    context
	        currentContext, templateCurrentContext, 
	        path, templatePath
	        root, templateRoot
	*/
	Handler.gen = function(template, name, context) {
	    /* jshint -W041 */
	    name = name == undefined ? '' : (name + '')

	    context = context || {}
	    context = {
	            // 褰撳墠璁块棶璺緞锛屽彧鏈夊睘鎬у悕锛屼笉鍖呮嫭鐢熸垚瑙勫垯
	            path: context.path || [Constant.GUID],
	            templatePath: context.templatePath || [Constant.GUID++],
	            // 鏈€缁堝睘鎬у€肩殑涓婁笅鏂�
	            currentContext: context.currentContext,
	            // 灞炴€у€兼ā鏉跨殑涓婁笅鏂�
	            templateCurrentContext: context.templateCurrentContext || template,
	            // 鏈€缁堝€肩殑鏍�
	            root: context.root || context.currentContext,
	            // 妯℃澘鐨勬牴
	            templateRoot: context.templateRoot || context.templateCurrentContext || template
	        }
	        // console.log('path:', context.path.join('.'), template)

	    var rule = Parser.parse(name)
	    var type = Util.type(template)
	    var data

	    if (Handler[type]) {
	        data = Handler[type]({
	            // 灞炴€у€肩被鍨�
	            type: type,
	            // 灞炴€у€兼ā鏉�
	            template: template,
	            // 灞炴€у悕 + 鐢熸垚瑙勫垯
	            name: name,
	            // 灞炴€у悕
	            parsedName: name ? name.replace(Constant.RE_KEY, '$1') : name,

	            // 瑙ｆ瀽鍚庣殑鐢熸垚瑙勫垯
	            rule: rule,
	            // 鐩稿叧涓婁笅鏂�
	            context: context
	        })

	        if (!context.root) context.root = data
	        return data
	    }

	    return template
	}

	Handler.extend({
	    array: function(options) {
	        var result = [],
	            i, ii;

	        // 'name|1': []
	        // 'name|count': []
	        // 'name|min-max': []
	        if (options.template.length === 0) return result

	        // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
	        if (!options.rule.parameters) {
	            for (i = 0; i < options.template.length; i++) {
	                options.context.path.push(i)
	                options.context.templatePath.push(i)
	                result.push(
	                    Handler.gen(options.template[i], i, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })
	                )
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            }
	        } else {
	            // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
	            if (options.rule.min === 1 && options.rule.max === undefined) {
	                // fix #17
	                options.context.path.push(options.name)
	                options.context.templatePath.push(options.name)
	                result = Random.pick(
	                    Handler.gen(options.template, undefined, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })
	                )
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            } else {
	                // 'data|+1': [{}, {}]
	                if (options.rule.parameters[2]) {
	                    options.template.__order_index = options.template.__order_index || 0

	                    options.context.path.push(options.name)
	                    options.context.templatePath.push(options.name)
	                    result = Handler.gen(options.template, undefined, {
	                        path: options.context.path,
	                        templatePath: options.context.templatePath,
	                        currentContext: result,
	                        templateCurrentContext: options.template,
	                        root: options.context.root || result,
	                        templateRoot: options.context.templateRoot || options.template
	                    })[
	                        options.template.__order_index % options.template.length
	                    ]

	                    options.template.__order_index += +options.rule.parameters[2]

	                    options.context.path.pop()
	                    options.context.templatePath.pop()

	                } else {
	                    // 'data|1-10': [{}]
	                    for (i = 0; i < options.rule.count; i++) {
	                        // 'data|1-10': [{}, {}]
	                        for (ii = 0; ii < options.template.length; ii++) {
	                            options.context.path.push(result.length)
	                            options.context.templatePath.push(ii)
	                            result.push(
	                                Handler.gen(options.template[ii], result.length, {
	                                    path: options.context.path,
	                                    templatePath: options.context.templatePath,
	                                    currentContext: result,
	                                    templateCurrentContext: options.template,
	                                    root: options.context.root || result,
	                                    templateRoot: options.context.templateRoot || options.template
	                                })
	                            )
	                            options.context.path.pop()
	                            options.context.templatePath.pop()
	                        }
	                    }
	                }
	            }
	        }
	        return result
	    },
	    object: function(options) {
	        var result = {},
	            keys, fnKeys, key, parsedKey, inc, i;

	        // 'obj|min-max': {}
	        /* jshint -W041 */
	        if (options.rule.min != undefined) {
	            keys = Util.keys(options.template)
	            keys = Random.shuffle(keys)
	            keys = keys.slice(0, options.rule.count)
	            for (i = 0; i < keys.length; i++) {
	                key = keys[i]
	                parsedKey = key.replace(Constant.RE_KEY, '$1')
	                options.context.path.push(parsedKey)
	                options.context.templatePath.push(key)
	                result[parsedKey] = Handler.gen(options.template[key], key, {
	                    path: options.context.path,
	                    templatePath: options.context.templatePath,
	                    currentContext: result,
	                    templateCurrentContext: options.template,
	                    root: options.context.root || result,
	                    templateRoot: options.context.templateRoot || options.template
	                })
	                options.context.path.pop()
	                options.context.templatePath.pop()
	            }

	        } else {
	            // 'obj': {}
	            keys = []
	            fnKeys = [] // #25 鏀瑰彉浜嗛潪鍑芥暟灞炴€х殑椤哄簭锛屾煡鎵捐捣鏉ヤ笉鏂逛究
	            for (key in options.template) {
	                (typeof options.template[key] === 'function' ? fnKeys : keys).push(key)
	            }
	            keys = keys.concat(fnKeys)

	            /*
	                浼氭敼鍙橀潪鍑芥暟灞炴€х殑椤哄簭
	                keys = Util.keys(options.template)
	                keys.sort(function(a, b) {
	                    var afn = typeof options.template[a] === 'function'
	                    var bfn = typeof options.template[b] === 'function'
	                    if (afn === bfn) return 0
	                    if (afn && !bfn) return 1
	                    if (!afn && bfn) return -1
	                })
	            */

	            for (i = 0; i < keys.length; i++) {
	                key = keys[i]
	                parsedKey = key.replace(Constant.RE_KEY, '$1')
	                options.context.path.push(parsedKey)
	                options.context.templatePath.push(key)
	                result[parsedKey] = Handler.gen(options.template[key], key, {
	                    path: options.context.path,
	                    templatePath: options.context.templatePath,
	                    currentContext: result,
	                    templateCurrentContext: options.template,
	                    root: options.context.root || result,
	                    templateRoot: options.context.templateRoot || options.template
	                })
	                options.context.path.pop()
	                options.context.templatePath.pop()
	                    // 'id|+1': 1
	                inc = key.match(Constant.RE_KEY)
	                if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
	                    options.template[key] += parseInt(inc[2], 10)
	                }
	            }
	        }
	        return result
	    },
	    number: function(options) {
	        var result, parts;
	        if (options.rule.decimal) { // float
	            options.template += ''
	            parts = options.template.split('.')
	                // 'float1|.1-10': 10,
	                // 'float2|1-100.1-10': 1,
	                // 'float3|999.1-10': 1,
	                // 'float4|.3-10': 123.123,
	            parts[0] = options.rule.range ? options.rule.count : parts[0]
	            parts[1] = (parts[1] || '').slice(0, options.rule.dcount)
	            while (parts[1].length < options.rule.dcount) {
	                parts[1] += (
	                    // 鏈€鍚庝竴浣嶄笉鑳戒负 0锛氬鏋滄渶鍚庝竴浣嶄负 0锛屼細琚� JS 寮曟搸蹇界暐鎺夈€�
	                    (parts[1].length < options.rule.dcount - 1) ? Random.character('number') : Random.character('123456789')
	                )
	            }
	            result = parseFloat(parts.join('.'), 10)
	        } else { // integer
	            // 'grade1|1-100': 1,
	            result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template
	        }
	        return result
	    },
	    boolean: function(options) {
	        var result;
	        // 'prop|multiple': false, 褰撳墠鍊兼槸鐩稿弽鍊肩殑姒傜巼鍊嶆暟
	        // 'prop|probability-probability': false, 褰撳墠鍊间笌鐩稿弽鍊肩殑姒傜巼
	        result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template
	        return result
	    },
	    string: function(options) {
	        var result = '',
	            i, placeholders, ph, phed;
	        if (options.template.length) {

	            //  'foo': '鈽�',
	            /* jshint -W041 */
	            if (options.rule.count == undefined) {
	                result += options.template
	            }

	            // 'star|1-5': '鈽�',
	            for (i = 0; i < options.rule.count; i++) {
	                result += options.template
	            }
	            // 'email|1-10': '@EMAIL, ',
	            placeholders = result.match(Constant.RE_PLACEHOLDER) || [] // A-Z_0-9 > \w_
	            for (i = 0; i < placeholders.length; i++) {
	                ph = placeholders[i]

	                // 閬囧埌杞箟鏂滄潬锛屼笉闇€瑕佽В鏋愬崰浣嶇
	                if (/^\\/.test(ph)) {
	                    placeholders.splice(i--, 1)
	                    continue
	                }

	                phed = Handler.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options)

	                // 鍙湁涓€涓崰浣嶇锛屽苟涓旀病鏈夊叾浠栧瓧绗�
	                if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) { // 
	                    result = phed
	                    break

	                    if (Util.isNumeric(phed)) {
	                        result = parseFloat(phed, 10)
	                        break
	                    }
	                    if (/^(true|false)$/.test(phed)) {
	                        result = phed === 'true' ? true :
	                            phed === 'false' ? false :
	                            phed // 宸茬粡鏄竷灏斿€�
	                        break
	                    }
	                }
	                result = result.replace(ph, phed)
	            }

	        } else {
	            // 'ASCII|1-10': '',
	            // 'ASCII': '',
	            result = options.rule.range ? Random.string(options.rule.count) : options.template
	        }
	        return result
	    },
	    'function': function(options) {
	        // ( context, options )
	        return options.template.call(options.context.currentContext, options)
	    },
	    'regexp': function(options) {
	        var source = ''

	        // 'name': /regexp/,
	        /* jshint -W041 */
	        if (options.rule.count == undefined) {
	            source += options.template.source // regexp.source
	        }

	        // 'name|1-5': /regexp/,
	        for (var i = 0; i < options.rule.count; i++) {
	            source += options.template.source
	        }

	        return RE.Handler.gen(
	            RE.Parser.parse(
	                source
	            )
	        )
	    }
	})

	Handler.extend({
	    _all: function() {
	        var re = {};
	        for (var key in Random) re[key.toLowerCase()] = key
	        return re
	    },
	    // 澶勭悊鍗犱綅绗︼紝杞崲涓烘渶缁堝€�
	    placeholder: function(placeholder, obj, templateContext, options) {
	        // console.log(options.context.path)
	        // 1 key, 2 params
	        Constant.RE_PLACEHOLDER.exec('')
	        var parts = Constant.RE_PLACEHOLDER.exec(placeholder),
	            key = parts && parts[1],
	            lkey = key && key.toLowerCase(),
	            okey = this._all()[lkey],
	            params = parts && parts[2] || ''
	        var pathParts = this.splitPathToArray(key)

	        // 瑙ｆ瀽鍗犱綅绗︾殑鍙傛暟
	        try {
	            // 1. 灏濊瘯淇濇寔鍙傛暟鐨勭被鍨�
	            /*
	                #24 [Window Firefox 30.0 寮曠敤 鍗犱綅绗� 鎶涢敊](https://github.com/nuysoft/Mock/issues/24)
	                [BX9056: 鍚勬祻瑙堝櫒涓� window.eval 鏂规硶鐨勬墽琛屼笂涓嬫枃瀛樺湪宸紓](http://www.w3help.org/zh-cn/causes/BX9056)
	                搴旇灞炰簬 Window Firefox 30.0 鐨� BUG
	            */
	            /* jshint -W061 */
	            params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
	        } catch (error) {
	            // 2. 濡傛灉澶辫触锛屽彧鑳借В鏋愪负瀛楃涓�
	            // console.error(error)
	            // if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
	            // else throw error
	            params = parts[2].split(/,\s*/)
	        }

	        // 鍗犱綅绗︿紭鍏堝紩鐢ㄦ暟鎹ā鏉夸腑鐨勫睘鎬�
	        if (obj && (key in obj)) return obj[key]

	        // @index @key
	        // if (Constant.RE_INDEX.test(key)) return +options.name
	        // if (Constant.RE_KEY.test(key)) return options.name

	        // 缁濆璺緞 or 鐩稿璺緞
	        if (
	            key.charAt(0) === '/' ||
	            pathParts.length > 1
	        ) return this.getValueByKeyPath(key, options)

	        // 閫掑綊寮曠敤鏁版嵁妯℃澘涓殑灞炴€�
	        if (templateContext &&
	            (typeof templateContext === 'object') &&
	            (key in templateContext) &&
	            (placeholder !== templateContext[key]) // fix #15 閬垮厤鑷繁渚濊禆鑷繁
	        ) {
	            // 鍏堣绠楄寮曠敤鐨勫睘鎬у€�
	            templateContext[key] = Handler.gen(templateContext[key], key, {
	                currentContext: obj,
	                templateCurrentContext: templateContext
	            })
	            return templateContext[key]
	        }

	        // 濡傛灉鏈壘鍒帮紝鍒欏師鏍疯繑鍥�
	        if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder

	        // 閫掑綊瑙ｆ瀽鍙傛暟涓殑鍗犱綅绗�
	        for (var i = 0; i < params.length; i++) {
	            Constant.RE_PLACEHOLDER.exec('')
	            if (Constant.RE_PLACEHOLDER.test(params[i])) {
	                params[i] = Handler.placeholder(params[i], obj, templateContext, options)
	            }
	        }

	        var handle = Random[key] || Random[lkey] || Random[okey]
	        switch (Util.type(handle)) {
	            case 'array':
	                // 鑷姩浠庢暟缁勪腑鍙栦竴涓紝渚嬪 @areas
	                return Random.pick(handle)
	            case 'function':
	                // 鎵ц鍗犱綅绗︽柟娉曪紙澶у鏁版儏鍐碉級
	                handle.options = options
	                var re = handle.apply(Random, params)
	                if (re === undefined) re = '' // 鍥犱负鏄湪瀛楃涓蹭腑锛屾墍浠ラ粯璁や负绌哄瓧绗︿覆銆�
	                delete handle.options
	                return re
	        }
	    },
	    getValueByKeyPath: function(key, options) {
	        var originalKey = key
	        var keyPathParts = this.splitPathToArray(key)
	        var absolutePathParts = []

	        // 缁濆璺緞
	        if (key.charAt(0) === '/') {
	            absolutePathParts = [options.context.path[0]].concat(
	                this.normalizePath(keyPathParts)
	            )
	        } else {
	            // 鐩稿璺緞
	            if (keyPathParts.length > 1) {
	                absolutePathParts = options.context.path.slice(0)
	                absolutePathParts.pop()
	                absolutePathParts = this.normalizePath(
	                    absolutePathParts.concat(keyPathParts)
	                )

	            }
	        }

	        key = keyPathParts[keyPathParts.length - 1]
	        var currentContext = options.context.root
	        var templateCurrentContext = options.context.templateRoot
	        for (var i = 1; i < absolutePathParts.length - 1; i++) {
	            currentContext = currentContext[absolutePathParts[i]]
	            templateCurrentContext = templateCurrentContext[absolutePathParts[i]]
	        }
	        // 寮曠敤鐨勫€煎凡缁忚绠楀ソ
	        if (currentContext && (key in currentContext)) return currentContext[key]

	        // 灏氭湭璁＄畻锛岄€掑綊寮曠敤鏁版嵁妯℃澘涓殑灞炴€�
	        if (templateCurrentContext &&
	            (typeof templateCurrentContext === 'object') &&
	            (key in templateCurrentContext) &&
	            (originalKey !== templateCurrentContext[key]) // fix #15 閬垮厤鑷繁渚濊禆鑷繁
	        ) {
	            // 鍏堣绠楄寮曠敤鐨勫睘鎬у€�
	            templateCurrentContext[key] = Handler.gen(templateCurrentContext[key], key, {
	                currentContext: currentContext,
	                templateCurrentContext: templateCurrentContext
	            })
	            return templateCurrentContext[key]
	        }
	    },
	    // https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
	    normalizePath: function(pathParts) {
	        var newPathParts = []
	        for (var i = 0; i < pathParts.length; i++) {
	            switch (pathParts[i]) {
	                case '..':
	                    newPathParts.pop()
	                    break
	                case '.':
	                    break
	                default:
	                    newPathParts.push(pathParts[i])
	            }
	        }
	        return newPathParts
	    },
	    splitPathToArray: function(path) {
	        var parts = path.split(/\/+/);
	        if (!parts[parts.length - 1]) parts = parts.slice(0, -1)
	        if (!parts[0]) parts = parts.slice(1)
	        return parts;
	    }
	})

	module.exports = Handler

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
	    ## Constant

	    甯搁噺闆嗗悎銆�
	 */
	/*
	    RE_KEY
	        'name|min-max': value
	        'name|count': value
	        'name|min-max.dmin-dmax': value
	        'name|min-max.dcount': value
	        'name|count.dmin-dmax': value
	        'name|count.dcount': value
	        'name|+step': value

	        1 name, 2 step, 3 range [ min, max ], 4 drange [ dmin, dmax ]

	    RE_PLACEHOLDER
	        placeholder(*)

	    [姝ｅ垯鏌ョ湅宸ュ叿](http://www.regexper.com/)

	    #26 鐢熸垚瑙勫垯 鏀寔 璐熸暟锛屼緥濡� number|-100-100
	*/
	module.exports = {
	    GUID: 1,
	    RE_KEY: /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/,
	    RE_RANGE: /([\+\-]?\d+)-?([\+\-]?\d+)?/,
	    RE_PLACEHOLDER: /\\*@([^@#%&()\?\s]+)(?:\((.*?)\))?/g
	    // /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g
	    // RE_INDEX: /^index$/,
	    // RE_KEY: /^key$/
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	    ## Utilities
	*/
	var Util = {}

	Util.extend = function extend() {
	    var target = arguments[0] || {},
	        i = 1,
	        length = arguments.length,
	        options, name, src, copy, clone

	    if (length === 1) {
	        target = this
	        i = 0
	    }

	    for (; i < length; i++) {
	        options = arguments[i]
	        if (!options) continue

	        for (name in options) {
	            src = target[name]
	            copy = options[name]

	            if (target === copy) continue
	            if (copy === undefined) continue

	            if (Util.isArray(copy) || Util.isObject(copy)) {
	                if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
	                if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}

	                target[name] = Util.extend(clone, copy)
	            } else {
	                target[name] = copy
	            }
	        }
	    }

	    return target
	}

	Util.each = function each(obj, iterator, context) {
	    var i, key
	    if (this.type(obj) === 'number') {
	        for (i = 0; i < obj; i++) {
	            iterator(i, i)
	        }
	    } else if (obj.length === +obj.length) {
	        for (i = 0; i < obj.length; i++) {
	            if (iterator.call(context, obj[i], i, obj) === false) break
	        }
	    } else {
	        for (key in obj) {
	            if (iterator.call(context, obj[key], key, obj) === false) break
	        }
	    }
	}

	Util.type = function type(obj) {
	    return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase()
	}

	Util.each('String Object Array RegExp Function'.split(' '), function(value) {
	    Util['is' + value] = function(obj) {
	        return Util.type(obj) === value.toLowerCase()
	    }
	})

	Util.isObjectOrArray = function(value) {
	    return Util.isObject(value) || Util.isArray(value)
	}

	Util.isNumeric = function(value) {
	    return !isNaN(parseFloat(value)) && isFinite(value)
	}

	Util.keys = function(obj) {
	    var keys = [];
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) keys.push(key)
	    }
	    return keys;
	}
	Util.values = function(obj) {
	    var values = [];
	    for (var key in obj) {
	        if (obj.hasOwnProperty(key)) values.push(obj[key])
	    }
	    return values;
	}

	/*
	    ### Mock.heredoc(fn)

	    * Mock.heredoc(fn)

	    浠ョ洿瑙傘€佸畨鍏ㄧ殑鏂瑰紡涔﹀啓锛堝琛岋級HTML 妯℃澘銆�

	    **浣跨敤绀轰緥**濡備笅鎵€绀猴細

	        var tpl = Mock.heredoc(function() {
	            /*!
	        {{email}}{{age}}
	        <!-- Mock { 
	            email: '@EMAIL',
	            age: '@INT(1,100)'
	        } -->
	            *\/
	        })
	    
	    **鐩稿叧闃呰**
	    * [Creating multiline strings in JavaScript](http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript)銆�
	*/
	Util.heredoc = function heredoc(fn) {
	    // 1. 绉婚櫎璧峰鐨� function(){ /*!
	    // 2. 绉婚櫎鏈熬鐨� */ }
	    // 3. 绉婚櫎璧峰鍜屾湯灏剧殑绌烘牸
	    return fn.toString()
	        .replace(/^[^\/]+\/\*!?/, '')
	        .replace(/\*\/[^\/]+$/, '')
	        .replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '') // .trim()
	}

	Util.noop = function() {}

	module.exports = Util

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		## Parser

		瑙ｆ瀽鏁版嵁妯℃澘锛堝睘鎬у悕閮ㄥ垎锛夈€�

		* Parser.parse( name )
			
			```json
			{
				parameters: [ name, inc, range, decimal ],
				rnage: [ min , max ],

				min: min,
				max: max,
				count : count,

				decimal: decimal,
				dmin: dmin,
				dmax: dmax,
				dcount: dcount
			}
			```
	 */

	var Constant = __webpack_require__(2)
	var Random = __webpack_require__(5)

	/* jshint -W041 */
	module.exports = {
		parse: function(name) {
			name = name == undefined ? '' : (name + '')

			var parameters = (name || '').match(Constant.RE_KEY)

			var range = parameters && parameters[3] && parameters[3].match(Constant.RE_RANGE)
			var min = range && range[1] && parseInt(range[1], 10) // || 1
			var max = range && range[2] && parseInt(range[2], 10) // || 1
				// repeat || min-max || 1
				// var count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1
			var count = range ? !range[2] ? parseInt(range[1], 10) : Random.integer(min, max) : undefined

			var decimal = parameters && parameters[4] && parameters[4].match(Constant.RE_RANGE)
			var dmin = decimal && parseInt(decimal[1], 10) // || 0,
			var dmax = decimal && parseInt(decimal[2], 10) // || 0,
				// int || dmin-dmax || 0
			var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : undefined

			var result = {
				// 1 name, 2 inc, 3 range, 4 decimal
				parameters: parameters,
				// 1 min, 2 max
				range: range,
				min: min,
				max: max,
				// min-max
				count: count,
				// 鏄惁鏈� decimal
				decimal: decimal,
				dmin: dmin,
				dmax: dmax,
				// dmin-dimax
				dcount: dcount
			}

			for (var r in result) {
				if (result[r] != undefined) return result
			}

			return {}
		}
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Mock.Random
	    
	    宸ュ叿绫伙紝鐢ㄤ簬鐢熸垚鍚勭闅忔満鏁版嵁銆�
	*/

	var Util = __webpack_require__(3)

	var Random = {
	    extend: Util.extend
	}

	Random.extend(__webpack_require__(6))
	Random.extend(__webpack_require__(7))
	Random.extend(__webpack_require__(8))
	Random.extend(__webpack_require__(10))
	Random.extend(__webpack_require__(13))
	Random.extend(__webpack_require__(15))
	Random.extend(__webpack_require__(16))
	Random.extend(__webpack_require__(17))
	Random.extend(__webpack_require__(14))
	Random.extend(__webpack_require__(19))

	module.exports = Random

/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
	    ## Basics
	*/
	module.exports = {
	    // 杩斿洖涓€涓殢鏈虹殑甯冨皵鍊笺€�
	    boolean: function(min, max, cur) {
	        if (cur !== undefined) {
	            min = typeof min !== 'undefined' && !isNaN(min) ? parseInt(min, 10) : 1
	            max = typeof max !== 'undefined' && !isNaN(max) ? parseInt(max, 10) : 1
	            return Math.random() > 1.0 / (min + max) * min ? !cur : cur
	        }

	        return Math.random() >= 0.5
	    },
	    bool: function(min, max, cur) {
	        return this.boolean(min, max, cur)
	    },
	    // 杩斿洖涓€涓殢鏈虹殑鑷劧鏁帮紙澶т簬绛変簬 0 鐨勬暣鏁帮級銆�
	    natural: function(min, max) {
	        min = typeof min !== 'undefined' ? parseInt(min, 10) : 0
	        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
	        return Math.round(Math.random() * (max - min)) + min
	    },
	    // 杩斿洖涓€涓殢鏈虹殑鏁存暟銆�
	    integer: function(min, max) {
	        min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992
	        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
	        return Math.round(Math.random() * (max - min)) + min
	    },
	    int: function(min, max) {
	        return this.integer(min, max)
	    },
	    // 杩斿洖涓€涓殢鏈虹殑娴偣鏁般€�
	    float: function(min, max, dmin, dmax) {
	        dmin = dmin === undefined ? 0 : dmin
	        dmin = Math.max(Math.min(dmin, 17), 0)
	        dmax = dmax === undefined ? 17 : dmax
	        dmax = Math.max(Math.min(dmax, 17), 0)
	        var ret = this.integer(min, max) + '.';
	        for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
	            ret += (
	                // 鏈€鍚庝竴浣嶄笉鑳戒负 0锛氬鏋滄渶鍚庝竴浣嶄负 0锛屼細琚� JS 寮曟搸蹇界暐鎺夈€�
	                (i < dcount - 1) ? this.character('number') : this.character('123456789')
	            )
	        }
	        return parseFloat(ret, 10)
	    },
	    // 杩斿洖涓€涓殢鏈哄瓧绗︺€�
	    character: function(pool) {
	        var pools = {
	            lower: 'abcdefghijklmnopqrstuvwxyz',
	            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	            number: '0123456789',
	            symbol: '!@#$%^&*()[]'
	        }
	        pools.alpha = pools.lower + pools.upper
	        pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol

	        pool = pools[('' + pool).toLowerCase()] || pool
	        return pool.charAt(this.natural(0, pool.length - 1))
	    },
	    char: function(pool) {
	        return this.character(pool)
	    },
	    // 杩斿洖涓€涓殢鏈哄瓧绗︿覆銆�
	    string: function(pool, min, max) {
	        var len
	        switch (arguments.length) {
	            case 0: // ()
	                len = this.natural(3, 7)
	                break
	            case 1: // ( length )
	                len = pool
	                pool = undefined
	                break
	            case 2:
	                // ( pool, length )
	                if (typeof arguments[0] === 'string') {
	                    len = min
	                } else {
	                    // ( min, max )
	                    len = this.natural(pool, min)
	                    pool = undefined
	                }
	                break
	            case 3:
	                len = this.natural(min, max)
	                break
	        }

	        var text = ''
	        for (var i = 0; i < len; i++) {
	            text += this.character(pool)
	        }

	        return text
	    },
	    str: function( /*pool, min, max*/ ) {
	        return this.string.apply(this, arguments)
	    },
	    // 杩斿洖涓€涓暣鍨嬫暟缁勩€�
	    range: function(start, stop, step) {
	        // range( stop )
	        if (arguments.length <= 1) {
	            stop = start || 0;
	            start = 0;
	        }
	        // range( start, stop )
	        step = arguments[2] || 1;

	        start = +start
	        stop = +stop
	        step = +step

	        var len = Math.max(Math.ceil((stop - start) / step), 0);
	        var idx = 0;
	        var range = new Array(len);

	        while (idx < len) {
	            range[idx++] = start;
	            start += step;
	        }

	        return range;
	    }
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
	    ## Date
	*/
	var patternLetters = {
	    yyyy: 'getFullYear',
	    yy: function(date) {
	        return ('' + date.getFullYear()).slice(2)
	    },
	    y: 'yy',

	    MM: function(date) {
	        var m = date.getMonth() + 1
	        return m < 10 ? '0' + m : m
	    },
	    M: function(date) {
	        return date.getMonth() + 1
	    },

	    dd: function(date) {
	        var d = date.getDate()
	        return d < 10 ? '0' + d : d
	    },
	    d: 'getDate',

	    HH: function(date) {
	        var h = date.getHours()
	        return h < 10 ? '0' + h : h
	    },
	    H: 'getHours',
	    hh: function(date) {
	        var h = date.getHours() % 12
	        return h < 10 ? '0' + h : h
	    },
	    h: function(date) {
	        return date.getHours() % 12
	    },

	    mm: function(date) {
	        var m = date.getMinutes()
	        return m < 10 ? '0' + m : m
	    },
	    m: 'getMinutes',

	    ss: function(date) {
	        var s = date.getSeconds()
	        return s < 10 ? '0' + s : s
	    },
	    s: 'getSeconds',

	    SS: function(date) {
	        var ms = date.getMilliseconds()
	        return ms < 10 && '00' + ms || ms < 100 && '0' + ms || ms
	    },
	    S: 'getMilliseconds',

	    A: function(date) {
	        return date.getHours() < 12 ? 'AM' : 'PM'
	    },
	    a: function(date) {
	        return date.getHours() < 12 ? 'am' : 'pm'
	    },
	    T: 'getTime'
	}
	module.exports = {
	    // 鏃ユ湡鍗犱綅绗﹂泦鍚堛€�
	    _patternLetters: patternLetters,
	    // 鏃ユ湡鍗犱綅绗︽鍒欍€�
	    _rformat: new RegExp((function() {
	        var re = []
	        for (var i in patternLetters) re.push(i)
	        return '(' + re.join('|') + ')'
	    })(), 'g'),
	    // 鏍煎紡鍖栨棩鏈熴€�
	    _formatDate: function(date, format) {
	        return format.replace(this._rformat, function creatNewSubString($0, flag) {
	            return typeof patternLetters[flag] === 'function' ? patternLetters[flag](date) :
	                patternLetters[flag] in patternLetters ? creatNewSubString($0, patternLetters[flag]) :
	                date[patternLetters[flag]]()
	        })
	    },
	    // 鐢熸垚涓€涓殢鏈虹殑 Date 瀵硅薄銆�
	    _randomDate: function(min, max) { // min, max
	        min = min === undefined ? new Date(0) : min
	        max = max === undefined ? new Date() : max
	        return new Date(Math.random() * (max.getTime() - min.getTime()))
	    },
	    // 杩斿洖涓€涓殢鏈虹殑鏃ユ湡瀛楃涓层€�
	    date: function(format) {
	        format = format || 'yyyy-MM-dd'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // 杩斿洖涓€涓殢鏈虹殑鏃堕棿瀛楃涓层€�
	    time: function(format) {
	        format = format || 'HH:mm:ss'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // 杩斿洖涓€涓殢鏈虹殑鏃ユ湡鍜屾椂闂村瓧绗︿覆銆�
	    datetime: function(format) {
	        format = format || 'yyyy-MM-dd HH:mm:ss'
	        return this._formatDate(this._randomDate(), format)
	    },
	    // 杩斿洖褰撳墠鐨勬棩鏈熷拰鏃堕棿瀛楃涓层€�
	    now: function(unit, format) {
	        // now(unit) now(format)
	        if (arguments.length === 1) {
	            // now(format)
	            if (!/year|month|day|hour|minute|second|week/.test(unit)) {
	                format = unit
	                unit = ''
	            }
	        }
	        unit = (unit || '').toLowerCase()
	        format = format || 'yyyy-MM-dd HH:mm:ss'

	        var date = new Date()

	        /* jshint -W086 */
	        // 鍙傝€冭嚜 http://momentjs.cn/docs/#/manipulating/start-of/
	        switch (unit) {
	            case 'year':
	                date.setMonth(0)
	            case 'month':
	                date.setDate(1)
	            case 'week':
	            case 'day':
	                date.setHours(0)
	            case 'hour':
	                date.setMinutes(0)
	            case 'minute':
	                date.setSeconds(0)
	            case 'second':
	                date.setMilliseconds(0)
	        }
	        switch (unit) {
	            case 'week':
	                date.setDate(date.getDate() - date.getDay())
	        }

	        return this._formatDate(date, format)
	    }
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* global document  */
	/*
	    ## Image
	*/
	module.exports = {
	    // 甯歌鐨勫箍鍛婂楂�
	    _adSize: [
	        '300x250', '250x250', '240x400', '336x280', '180x150',
	        '720x300', '468x60', '234x60', '88x31', '120x90',
	        '120x60', '120x240', '125x125', '728x90', '160x600',
	        '120x600', '300x600'
	    ],
	    // 甯歌鐨勫睆骞曞楂�
	    _screenSize: [
	        '320x200', '320x240', '640x480', '800x480', '800x480',
	        '1024x600', '1024x768', '1280x800', '1440x900', '1920x1200',
	        '2560x1600'
	    ],
	    // 甯歌鐨勮棰戝楂�
	    _videoSize: ['720x480', '768x576', '1280x720', '1920x1080'],
	    /*
	        鐢熸垚涓€涓殢鏈虹殑鍥剧墖鍦板潃銆�

	        鏇夸唬鍥剧墖婧�
	            http://fpoimg.com/
	        鍙傝€冭嚜 
	            http://rensanning.iteye.com/blog/1933310
	            http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
	    */
	    image: function(size, background, foreground, format, text) {
	        // Random.image( size, background, foreground, text )
	        if (arguments.length === 4) {
	            text = format
	            format = undefined
	        }
	        // Random.image( size, background, text )
	        if (arguments.length === 3) {
	            text = foreground
	            foreground = undefined
	        }
	        // Random.image()
	        if (!size) size = this.pick(this._adSize)

	        if (background && ~background.indexOf('#')) background = background.slice(1)
	        if (foreground && ~foreground.indexOf('#')) foreground = foreground.slice(1)

	        // http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
	        return 'http://dummyimage.com/' + size +
	            (background ? '/' + background : '') +
	            (foreground ? '/' + foreground : '') +
	            (format ? '.' + format : '') +
	            (text ? '&text=' + text : '')
	    },
	    img: function() {
	        return this.image.apply(this, arguments)
	    },

	    /*
	        BrandColors
	        http://brandcolors.net/
	        A collection of major brand color codes curated by Galen Gidman.
	        澶х墝鍏徃鐨勯鑹查泦鍚�

	        // 鑾峰彇鍝佺墝鍜岄鑹�
	        $('h2').each(function(index, item){
	            item = $(item)
	            console.log('\'' + item.text() + '\'', ':', '\'' + item.next().text() + '\'', ',')
	        })
	    */
	    _brandColors: {
	        '4ormat': '#fb0a2a',
	        '500px': '#02adea',
	        'About.me (blue)': '#00405d',
	        'About.me (yellow)': '#ffcc33',
	        'Addvocate': '#ff6138',
	        'Adobe': '#ff0000',
	        'Aim': '#fcd20b',
	        'Amazon': '#e47911',
	        'Android': '#a4c639',
	        'Angie\'s List': '#7fbb00',
	        'AOL': '#0060a3',
	        'Atlassian': '#003366',
	        'Behance': '#053eff',
	        'Big Cartel': '#97b538',
	        'bitly': '#ee6123',
	        'Blogger': '#fc4f08',
	        'Boeing': '#0039a6',
	        'Booking.com': '#003580',
	        'Carbonmade': '#613854',
	        'Cheddar': '#ff7243',
	        'Code School': '#3d4944',
	        'Delicious': '#205cc0',
	        'Dell': '#3287c1',
	        'Designmoo': '#e54a4f',
	        'Deviantart': '#4e6252',
	        'Designer News': '#2d72da',
	        'Devour': '#fd0001',
	        'DEWALT': '#febd17',
	        'Disqus (blue)': '#59a3fc',
	        'Disqus (orange)': '#db7132',
	        'Dribbble': '#ea4c89',
	        'Dropbox': '#3d9ae8',
	        'Drupal': '#0c76ab',
	        'Dunked': '#2a323a',
	        'eBay': '#89c507',
	        'Ember': '#f05e1b',
	        'Engadget': '#00bdf6',
	        'Envato': '#528036',
	        'Etsy': '#eb6d20',
	        'Evernote': '#5ba525',
	        'Fab.com': '#dd0017',
	        'Facebook': '#3b5998',
	        'Firefox': '#e66000',
	        'Flickr (blue)': '#0063dc',
	        'Flickr (pink)': '#ff0084',
	        'Forrst': '#5b9a68',
	        'Foursquare': '#25a0ca',
	        'Garmin': '#007cc3',
	        'GetGlue': '#2d75a2',
	        'Gimmebar': '#f70078',
	        'GitHub': '#171515',
	        'Google Blue': '#0140ca',
	        'Google Green': '#16a61e',
	        'Google Red': '#dd1812',
	        'Google Yellow': '#fcca03',
	        'Google+': '#dd4b39',
	        'Grooveshark': '#f77f00',
	        'Groupon': '#82b548',
	        'Hacker News': '#ff6600',
	        'HelloWallet': '#0085ca',
	        'Heroku (light)': '#c7c5e6',
	        'Heroku (dark)': '#6567a5',
	        'HootSuite': '#003366',
	        'Houzz': '#73ba37',
	        'HTML5': '#ec6231',
	        'IKEA': '#ffcc33',
	        'IMDb': '#f3ce13',
	        'Instagram': '#3f729b',
	        'Intel': '#0071c5',
	        'Intuit': '#365ebf',
	        'Kickstarter': '#76cc1e',
	        'kippt': '#e03500',
	        'Kodery': '#00af81',
	        'LastFM': '#c3000d',
	        'LinkedIn': '#0e76a8',
	        'Livestream': '#cf0005',
	        'Lumo': '#576396',
	        'Mixpanel': '#a086d3',
	        'Meetup': '#e51937',
	        'Nokia': '#183693',
	        'NVIDIA': '#76b900',
	        'Opera': '#cc0f16',
	        'Path': '#e41f11',
	        'PayPal (dark)': '#1e477a',
	        'PayPal (light)': '#3b7bbf',
	        'Pinboard': '#0000e6',
	        'Pinterest': '#c8232c',
	        'PlayStation': '#665cbe',
	        'Pocket': '#ee4056',
	        'Prezi': '#318bff',
	        'Pusha': '#0f71b4',
	        'Quora': '#a82400',
	        'QUOTE.fm': '#66ceff',
	        'Rdio': '#008fd5',
	        'Readability': '#9c0000',
	        'Red Hat': '#cc0000',
	        'Resource': '#7eb400',
	        'Rockpack': '#0ba6ab',
	        'Roon': '#62b0d9',
	        'RSS': '#ee802f',
	        'Salesforce': '#1798c1',
	        'Samsung': '#0c4da2',
	        'Shopify': '#96bf48',
	        'Skype': '#00aff0',
	        'Snagajob': '#f47a20',
	        'Softonic': '#008ace',
	        'SoundCloud': '#ff7700',
	        'Space Box': '#f86960',
	        'Spotify': '#81b71a',
	        'Sprint': '#fee100',
	        'Squarespace': '#121212',
	        'StackOverflow': '#ef8236',
	        'Staples': '#cc0000',
	        'Status Chart': '#d7584f',
	        'Stripe': '#008cdd',
	        'StudyBlue': '#00afe1',
	        'StumbleUpon': '#f74425',
	        'T-Mobile': '#ea0a8e',
	        'Technorati': '#40a800',
	        'The Next Web': '#ef4423',
	        'Treehouse': '#5cb868',
	        'Trulia': '#5eab1f',
	        'Tumblr': '#34526f',
	        'Twitch.tv': '#6441a5',
	        'Twitter': '#00acee',
	        'TYPO3': '#ff8700',
	        'Ubuntu': '#dd4814',
	        'Ustream': '#3388ff',
	        'Verizon': '#ef1d1d',
	        'Vimeo': '#86c9ef',
	        'Vine': '#00a478',
	        'Virb': '#06afd8',
	        'Virgin Media': '#cc0000',
	        'Wooga': '#5b009c',
	        'WordPress (blue)': '#21759b',
	        'WordPress (orange)': '#d54e21',
	        'WordPress (grey)': '#464646',
	        'Wunderlist': '#2b88d9',
	        'XBOX': '#9bc848',
	        'XING': '#126567',
	        'Yahoo!': '#720e9e',
	        'Yandex': '#ffcc00',
	        'Yelp': '#c41200',
	        'YouTube': '#c4302b',
	        'Zalongo': '#5498dc',
	        'Zendesk': '#78a300',
	        'Zerply': '#9dcc7a',
	        'Zootool': '#5e8b1d'
	    },
	    _brandNames: function() {
	        var brands = [];
	        for (var b in this._brandColors) {
	            brands.push(b)
	        }
	        return brands
	    },
	    /*
	        鐢熸垚涓€娈甸殢鏈虹殑 Base64 鍥剧墖缂栫爜銆�

	        https://github.com/imsky/holder
	        Holder renders image placeholders entirely on the client side.

	        dataImageHolder: function(size) {
	            return 'holder.js/' + size
	        },
	    */
	    dataImage: function(size, text) {
	        var canvas
	        if (typeof document !== 'undefined') {
	            canvas = document.createElement('canvas')
	        } else {
	            /*
	                https://github.com/Automattic/node-canvas
	                    npm install canvas --save
	                瀹夎闂锛�
	                * http://stackoverflow.com/questions/22953206/gulp-issues-with-cario-install-command-not-found-when-trying-to-installing-canva
	                * https://github.com/Automattic/node-canvas/issues/415
	                * https://github.com/Automattic/node-canvas/wiki/_pages

	                PS锛歯ode-canvas 鐨勫畨瑁呰繃绋嬪疄鍦ㄦ槸澶箒鐞愪簡锛屾墍浠ヤ笉鏀惧叆 package.json 鐨� dependencies銆�
	             */
	            var Canvas = module.require('canvas')
	            canvas = new Canvas()
	        }

	        var ctx = canvas && canvas.getContext && canvas.getContext("2d")
	        if (!canvas || !ctx) return ''

	        if (!size) size = this.pick(this._adSize)
	        text = text !== undefined ? text : size

	        size = size.split('x')

	        var width = parseInt(size[0], 10),
	            height = parseInt(size[1], 10),
	            background = this._brandColors[this.pick(this._brandNames())],
	            foreground = '#FFF',
	            text_height = 14,
	            font = 'sans-serif';

	        canvas.width = width
	        canvas.height = height
	        ctx.textAlign = 'center'
	        ctx.textBaseline = 'middle'
	        ctx.fillStyle = background
	        ctx.fillRect(0, 0, width, height)
	        ctx.fillStyle = foreground
	        ctx.font = 'bold ' + text_height + 'px ' + font
	        ctx.fillText(text, (width / 2), (height / 2), width)
	        return canvas.toDataURL('image/png')
	    }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)(module)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Color

	    http://llllll.li/randomColor/
	        A color generator for JavaScript.
	        randomColor generates attractive colors by default. More specifically, randomColor produces bright colors with a reasonably high saturation. This makes randomColor particularly useful for data visualizations and generative art.

	    http://randomcolour.com/
	        var bg_colour = Math.floor(Math.random() * 16777215).toString(16);
	        bg_colour = "#" + ("000000" + bg_colour).slice(-6);
	        document.bgColor = bg_colour;
	    
	    http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	        Creating random colors is actually more difficult than it seems. The randomness itself is easy, but aesthetically pleasing randomness is more difficult.
	        https://github.com/devongovett/color-generator

	    http://www.paulirish.com/2009/random-hex-color-code-snippets/
	        Random Hex Color Code Generator in JavaScript

	    http://chancejs.com/#color
	        chance.color()
	        // => '#79c157'
	        chance.color({format: 'hex'})
	        // => '#d67118'
	        chance.color({format: 'shorthex'})
	        // => '#60f'
	        chance.color({format: 'rgb'})
	        // => 'rgb(110,52,164)'

	    http://tool.c7sky.com/webcolor
	        缃戦〉璁捐甯哥敤鑹插僵鎼厤琛�
	    
	    https://github.com/One-com/one-color
	        An OO-based JavaScript color parser/computation toolkit with support for RGB, HSV, HSL, CMYK, and alpha channels.
	        API 寰堣禐

	    https://github.com/harthur/color
	        JavaScript color conversion and manipulation library

	    https://github.com/leaverou/css-colors
	        Share & convert CSS colors
	    http://leaverou.github.io/css-colors/#slategray
	        Type a CSS color keyword, #hex, hsl(), rgba(), whatever:

	    鑹茶皟 hue
	        http://baike.baidu.com/view/23368.htm
	        鑹茶皟鎸囩殑鏄竴骞呯敾涓敾闈㈣壊褰╃殑鎬讳綋鍊惧悜锛屾槸澶х殑鑹插僵鏁堟灉銆�
	    楗卞拰搴� saturation
	        http://baike.baidu.com/view/189644.htm
	        楗卞拰搴︽槸鎸囪壊褰╃殑椴滆壋绋嬪害锛屼篃绉拌壊褰╃殑绾害銆傞ケ鍜屽害鍙栧喅浜庤鑹蹭腑鍚壊鎴愬垎鍜屾秷鑹叉垚鍒嗭紙鐏拌壊锛夌殑姣斾緥銆傚惈鑹叉垚鍒嗚秺澶э紝楗卞拰搴﹁秺澶э紱娑堣壊鎴愬垎瓒婂ぇ锛岄ケ鍜屽害瓒婂皬銆�
	    浜害 brightness
	        http://baike.baidu.com/view/34773.htm
	        浜害鏄寚鍙戝厜浣擄紙鍙嶅厜浣擄級琛ㄩ潰鍙戝厜锛堝弽鍏夛級寮哄急鐨勭墿鐞嗛噺銆�
	    鐓у害 luminosity
	        鐗╀綋琚収浜殑绋嬪害,閲囩敤鍗曚綅闈㈢Н鎵€鎺ュ彈鐨勫厜閫氶噺鏉ヨ〃绀�,琛ㄧず鍗曚綅涓哄嫆[鍏嬫柉](Lux,lx) ,鍗� 1m / m2 銆�

	    http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
	        var letters = '0123456789ABCDEF'.split('')
	        var color = '#'
	        for (var i = 0; i < 6; i++) {
	            color += letters[Math.floor(Math.random() * 16)]
	        }
	        return color
	    
	        // 闅忔満鐢熸垚涓€涓棤鑴戠殑棰滆壊锛屾牸寮忎负 '#RRGGBB'銆�
	        // _brainlessColor()
	        var color = Math.floor(
	            Math.random() *
	            (16 * 16 * 16 * 16 * 16 * 16 - 1)
	        ).toString(16)
	        color = "#" + ("000000" + color).slice(-6)
	        return color.toUpperCase()
	*/

	var Convert = __webpack_require__(11)
	var DICT = __webpack_require__(12)

	module.exports = {
	    // 闅忔満鐢熸垚涓€涓湁鍚稿紩鍔涚殑棰滆壊锛屾牸寮忎负 '#RRGGBB'銆�
	    color: function(name) {
	        if (name || DICT[name]) return DICT[name].nicer
	        return this.hex()
	    },
	    // #DAC0DE
	    hex: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        var hex = Convert.rgb2hex(rgb[0], rgb[1], rgb[2])
	        return hex
	    },
	    // rgb(128,255,255)
	    rgb: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        return 'rgb(' +
	            parseInt(rgb[0], 10) + ', ' +
	            parseInt(rgb[1], 10) + ', ' +
	            parseInt(rgb[2], 10) + ')'
	    },
	    // rgba(128,255,255,0.3)
	    rgba: function() {
	        var hsv = this._goldenRatioColor()
	        var rgb = Convert.hsv2rgb(hsv)
	        return 'rgba(' +
	            parseInt(rgb[0], 10) + ', ' +
	            parseInt(rgb[1], 10) + ', ' +
	            parseInt(rgb[2], 10) + ', ' +
	            Math.random().toFixed(2) + ')'
	    },
	    // hsl(300,80%,90%)
	    hsl: function() {
	        var hsv = this._goldenRatioColor()
	        var hsl = Convert.hsv2hsl(hsv)
	        return 'hsl(' +
	            parseInt(hsl[0], 10) + ', ' +
	            parseInt(hsl[1], 10) + ', ' +
	            parseInt(hsl[2], 10) + ')'
	    },
	    // http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	    // https://github.com/devongovett/color-generator/blob/master/index.js
	    // 闅忔満鐢熸垚涓€涓湁鍚稿紩鍔涚殑棰滆壊銆�
	    _goldenRatioColor: function(saturation, value) {
	        this._goldenRatio = 0.618033988749895
	        this._hue = this._hue || Math.random()
	        this._hue += this._goldenRatio
	        this._hue %= 1

	        if (typeof saturation !== "number") saturation = 0.5;
	        if (typeof value !== "number") value = 0.95;

	        return [
	            this._hue * 360,
	            saturation * 100,
	            value * 100
	        ]
	    }
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	/*
	    ## Color Convert

	    http://blog.csdn.net/idfaya/article/details/6770414
	        棰滆壊绌洪棿RGB涓嶩SV(HSL)鐨勮浆鎹�
	*/
	// https://github.com/harthur/color-convert/blob/master/conversions.js
	module.exports = {
		rgb2hsl: function rgb2hsl(rgb) {
			var r = rgb[0] / 255,
				g = rgb[1] / 255,
				b = rgb[2] / 255,
				min = Math.min(r, g, b),
				max = Math.max(r, g, b),
				delta = max - min,
				h, s, l;

			if (max == min)
				h = 0;
			else if (r == max)
				h = (g - b) / delta;
			else if (g == max)
				h = 2 + (b - r) / delta;
			else if (b == max)
				h = 4 + (r - g) / delta;

			h = Math.min(h * 60, 360);

			if (h < 0)
				h += 360;

			l = (min + max) / 2;

			if (max == min)
				s = 0;
			else if (l <= 0.5)
				s = delta / (max + min);
			else
				s = delta / (2 - max - min);

			return [h, s * 100, l * 100];
		},
		rgb2hsv: function rgb2hsv(rgb) {
			var r = rgb[0],
				g = rgb[1],
				b = rgb[2],
				min = Math.min(r, g, b),
				max = Math.max(r, g, b),
				delta = max - min,
				h, s, v;

			if (max === 0)
				s = 0;
			else
				s = (delta / max * 1000) / 10;

			if (max == min)
				h = 0;
			else if (r == max)
				h = (g - b) / delta;
			else if (g == max)
				h = 2 + (b - r) / delta;
			else if (b == max)
				h = 4 + (r - g) / delta;

			h = Math.min(h * 60, 360);

			if (h < 0)
				h += 360;

			v = ((max / 255) * 1000) / 10;

			return [h, s, v];
		},
		hsl2rgb: function hsl2rgb(hsl) {
			var h = hsl[0] / 360,
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				t1, t2, t3, rgb, val;

			if (s === 0) {
				val = l * 255;
				return [val, val, val];
			}

			if (l < 0.5)
				t2 = l * (1 + s);
			else
				t2 = l + s - l * s;
			t1 = 2 * l - t2;

			rgb = [0, 0, 0];
			for (var i = 0; i < 3; i++) {
				t3 = h + 1 / 3 * -(i - 1);
				if (t3 < 0) t3++;
				if (t3 > 1) t3--;

				if (6 * t3 < 1)
					val = t1 + (t2 - t1) * 6 * t3;
				else if (2 * t3 < 1)
					val = t2;
				else if (3 * t3 < 2)
					val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
				else
					val = t1;

				rgb[i] = val * 255;
			}

			return rgb;
		},
		hsl2hsv: function hsl2hsv(hsl) {
			var h = hsl[0],
				s = hsl[1] / 100,
				l = hsl[2] / 100,
				sv, v;
			l *= 2;
			s *= (l <= 1) ? l : 2 - l;
			v = (l + s) / 2;
			sv = (2 * s) / (l + s);
			return [h, sv * 100, v * 100];
		},
		hsv2rgb: function hsv2rgb(hsv) {
			var h = hsv[0] / 60
			var s = hsv[1] / 100
			var v = hsv[2] / 100
			var hi = Math.floor(h) % 6

			var f = h - Math.floor(h)
			var p = 255 * v * (1 - s)
			var q = 255 * v * (1 - (s * f))
			var t = 255 * v * (1 - (s * (1 - f)))

			v = 255 * v

			switch (hi) {
				case 0:
					return [v, t, p]
				case 1:
					return [q, v, p]
				case 2:
					return [p, v, t]
				case 3:
					return [p, q, v]
				case 4:
					return [t, p, v]
				case 5:
					return [v, p, q]
			}
		},
		hsv2hsl: function hsv2hsl(hsv) {
			var h = hsv[0],
				s = hsv[1] / 100,
				v = hsv[2] / 100,
				sl, l;

			l = (2 - s) * v;
			sl = s * v;
			sl /= (l <= 1) ? l : 2 - l;
			l /= 2;
			return [h, sl * 100, l * 100];
		},
		// http://www.140byt.es/keywords/color
		rgb2hex: function(
			a, // red, as a number from 0 to 255
			b, // green, as a number from 0 to 255
			c // blue, as a number from 0 to 255
		) {
			return "#" + ((256 + a << 8 | b) << 8 | c).toString(16).slice(1)
		},
		hex2rgb: function(
			a // take a "#xxxxxx" hex string,
		) {
			a = '0x' + a.slice(1).replace(a.length > 4 ? a : /./g, '$&$&') | 0;
			return [a >> 16, a >> 8 & 255, a & 255]
		}
	}

/***/ },
/* 12 */
/***/ function(module, exports) {

	/*
	    ## Color 瀛楀吀鏁版嵁

	    瀛楀吀鏁版嵁鏉ユ簮 [A nicer color palette for the web](http://clrs.cc/)
	*/
	module.exports = {
	    // name value nicer
	    navy: {
	        value: '#000080',
	        nicer: '#001F3F'
	    },
	    blue: {
	        value: '#0000ff',
	        nicer: '#0074D9'
	    },
	    aqua: {
	        value: '#00ffff',
	        nicer: '#7FDBFF'
	    },
	    teal: {
	        value: '#008080',
	        nicer: '#39CCCC'
	    },
	    olive: {
	        value: '#008000',
	        nicer: '#3D9970'
	    },
	    green: {
	        value: '#008000',
	        nicer: '#2ECC40'
	    },
	    lime: {
	        value: '#00ff00',
	        nicer: '#01FF70'
	    },
	    yellow: {
	        value: '#ffff00',
	        nicer: '#FFDC00'
	    },
	    orange: {
	        value: '#ffa500',
	        nicer: '#FF851B'
	    },
	    red: {
	        value: '#ff0000',
	        nicer: '#FF4136'
	    },
	    maroon: {
	        value: '#800000',
	        nicer: '#85144B'
	    },
	    fuchsia: {
	        value: '#ff00ff',
	        nicer: '#F012BE'
	    },
	    purple: {
	        value: '#800080',
	        nicer: '#B10DC9'
	    },
	    silver: {
	        value: '#c0c0c0',
	        nicer: '#DDDDDD'
	    },
	    gray: {
	        value: '#808080',
	        nicer: '#AAAAAA'
	    },
	    black: {
	        value: '#000000',
	        nicer: '#111111'
	    },
	    white: {
	        value: '#FFFFFF',
	        nicer: '#FFFFFF'
	    }
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Text

	    http://www.lipsum.com/
	*/
	var Basic = __webpack_require__(6)
	var Helper = __webpack_require__(14)

	function range(defaultMin, defaultMax, min, max) {
	    return min === undefined ? Basic.natural(defaultMin, defaultMax) : // ()
	        max === undefined ? min : // ( len )
	        Basic.natural(parseInt(min, 10), parseInt(max, 10)) // ( min, max )
	}

	module.exports = {
	    // 闅忔満鐢熸垚涓€娈垫枃鏈€�
	    paragraph: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.sentence())
	        }
	        return result.join(' ')
	    },
	    // 
	    cparagraph: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.csentence())
	        }
	        return result.join('')
	    },
	    // 闅忔満鐢熸垚涓€涓彞瀛愶紝绗竴涓崟璇嶇殑棣栧瓧姣嶅ぇ鍐欍€�
	    sentence: function(min, max) {
	        var len = range(12, 18, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.word())
	        }
	        return Helper.capitalize(result.join(' ')) + '.'
	    },
	    // 闅忔満鐢熸垚涓€涓腑鏂囧彞瀛愩€�
	    csentence: function(min, max) {
	        var len = range(12, 18, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.cword())
	        }

	        return result.join('') + '銆�'
	    },
	    // 闅忔満鐢熸垚涓€涓崟璇嶃€�
	    word: function(min, max) {
	        var len = range(3, 10, min, max)
	        var result = '';
	        for (var i = 0; i < len; i++) {
	            result += Basic.character('lower')
	        }
	        return result
	    },
	    // 闅忔満鐢熸垚涓€涓垨澶氫釜姹夊瓧銆�
	    cword: function(pool, min, max) {
	        // 鏈€甯哥敤鐨� 500 涓眽瀛� http://baike.baidu.com/view/568436.htm
	        var DICT_KANZI = '鐨勪竴鏄湪涓嶄簡鏈夊拰浜鸿繖涓ぇ涓轰笂涓浗鎴戜互瑕佷粬鏃舵潵鐢ㄤ滑鐢熷埌浣滃湴浜庡嚭灏卞垎瀵规垚浼氬彲涓诲彂骞村姩鍚屽伐涔熻兘涓嬭繃瀛愯浜х闈㈣€屾柟鍚庡瀹氳瀛︽硶鎵€姘戝緱缁忓崄涓変箣杩涚潃绛夐儴搴﹀鐢靛姏閲屽姘村寲楂樿嚜浜岀悊璧峰皬鐗╃幇瀹炲姞閲忛兘涓や綋鍒舵満褰撲娇鐐逛粠涓氭湰鍘绘妸鎬уソ搴斿紑瀹冨悎杩樺洜鐢卞叾浜涚劧鍓嶅澶╂斂鍥涙棩閭ｇぞ涔変簨骞冲舰鐩稿叏琛ㄩ棿鏍蜂笌鍏冲悇閲嶆柊绾垮唴鏁版蹇冨弽浣犳槑鐪嬪師鍙堜箞鍒╂瘮鎴栦絾璐ㄦ皵绗悜閬撳懡姝ゅ彉鏉″彧娌＄粨瑙ｉ棶鎰忓缓鏈堝叕鏃犵郴鍐涘緢鎯呰€呮渶绔嬩唬鎯冲凡閫氬苟鎻愮洿棰樺厷绋嬪睍浜旀灉鏂欒薄鍛橀潻浣嶅叆甯告枃鎬绘鍝佸紡娲昏鍙婄鐗逛欢闀挎眰鑰佸ご鍩鸿祫杈规祦璺骇灏戝浘灞辩粺鎺ョ煡杈冨皢缁勮璁″埆濂规墜瑙掓湡鏍硅杩愬啘鎸囧嚑涔濆尯寮烘斁鍐宠タ琚共鍋氬繀鎴樺厛鍥炲垯浠诲彇鎹闃熷崡缁欒壊鍏夐棬鍗充繚娌诲寳閫犵櫨瑙勭儹棰嗕竷娴峰彛涓滃鍣ㄥ帇蹇椾笘閲戝浜夋祹闃舵补鎬濇湳鏋佷氦鍙楄仈浠€璁ゅ叚鍏辨潈鏀惰瘉鏀规竻宸辩編鍐嶉噰杞洿鍗曢鍒囨墦鐧芥暀閫熻姳甯﹀畨鍦鸿韩杞︿緥鐪熷姟鍏蜂竾姣忕洰鑷宠揪璧扮Н绀鸿澹版姤鏂楀畬绫诲叓绂诲崕鍚嶇‘鎵嶇寮犱俊椹妭璇濈背鏁寸┖鍏冨喌浠婇泦娓╀紶鍦熻姝ョ兢骞跨煶璁伴渶娈电爺鐣屾媺鏋楀緥鍙笖绌惰瓒婄粐瑁呭奖绠椾綆鎸侀煶浼椾功甯冨瀹瑰効椤婚檯鍟嗛潪楠岃繛鏂繁闅捐繎鐭垮崈鍛ㄥ绱犳妧澶囧崐鍔為潚鐪佸垪涔犲搷绾︽敮鑸彶鎰熷姵渚垮洟寰€閰稿巻甯傚厠浣曢櫎娑堟瀯搴滅О澶噯绮惧€煎彿鐜囨棌缁村垝閫夋爣鍐欏瓨鍊欐瘺浜插揩鏁堟柉闄㈡煡姹熷瀷鐪肩帇鎸夋牸鍏绘槗缃淳灞傜墖濮嬪嵈涓撶姸鑲插巶浜瘑閫傚睘鍦嗗寘鐏綇璋冩弧鍘垮眬鐓у弬绾㈢粏寮曞惉璇ラ搧浠蜂弗榫欓'

	        var len
	        switch (arguments.length) {
	            case 0: // ()
	                pool = DICT_KANZI
	                len = 1
	                break
	            case 1: // ( pool )
	                if (typeof arguments[0] === 'string') {
	                    len = 1
	                } else {
	                    // ( length )
	                    len = pool
	                    pool = DICT_KANZI
	                }
	                break
	            case 2:
	                // ( pool, length )
	                if (typeof arguments[0] === 'string') {
	                    len = min
	                } else {
	                    // ( min, max )
	                    len = this.natural(pool, min)
	                    pool = DICT_KANZI
	                }
	                break
	            case 3:
	                len = this.natural(min, max)
	                break
	        }

	        var result = ''
	        for (var i = 0; i < len; i++) {
	            result += pool.charAt(this.natural(0, pool.length - 1))
	        }
	        return result
	    },
	    // 闅忔満鐢熸垚涓€鍙ユ爣棰橈紝鍏朵腑姣忎釜鍗曡瘝鐨勯瀛楁瘝澶у啓銆�
	    title: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.capitalize(this.word()))
	        }
	        return result.join(' ')
	    },
	    // 闅忔満鐢熸垚涓€鍙ヤ腑鏂囨爣棰樸€�
	    ctitle: function(min, max) {
	        var len = range(3, 7, min, max)
	        var result = []
	        for (var i = 0; i < len; i++) {
	            result.push(this.cword())
	        }
	        return result.join('')
	    }
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Helpers
	*/

	var Util = __webpack_require__(3)

	module.exports = {
		// 鎶婂瓧绗︿覆鐨勭涓€涓瓧姣嶈浆鎹负澶у啓銆�
		capitalize: function(word) {
			return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
		},
		// 鎶婂瓧绗︿覆杞崲涓哄ぇ鍐欍€�
		upper: function(str) {
			return (str + '').toUpperCase()
		},
		// 鎶婂瓧绗︿覆杞崲涓哄皬鍐欍€�
		lower: function(str) {
			return (str + '').toLowerCase()
		},
		// 浠庢暟缁勪腑闅忔満閫夊彇涓€涓厓绱狅紝骞惰繑鍥炪€�
		pick: function pick(arr, min, max) {
			// pick( item1, item2 ... )
			if (!Util.isArray(arr)) {
				arr = [].slice.call(arguments)
				min = 1
				max = 1
			} else {
				// pick( [ item1, item2 ... ] )
				if (min === undefined) min = 1

				// pick( [ item1, item2 ... ], count )
				if (max === undefined) max = min
			}

			if (min === 1 && max === 1) return arr[this.natural(0, arr.length - 1)]

			// pick( [ item1, item2 ... ], min, max )
			return this.shuffle(arr, min, max)

			// 閫氳繃鍙傛暟涓暟鍒ゆ柇鏂规硶绛惧悕锛屾墿灞曟€уお宸紒#90
			// switch (arguments.length) {
			// 	case 1:
			// 		// pick( [ item1, item2 ... ] )
			// 		return arr[this.natural(0, arr.length - 1)]
			// 	case 2:
			// 		// pick( [ item1, item2 ... ], count )
			// 		max = min
			// 			/* falls through */
			// 	case 3:
			// 		// pick( [ item1, item2 ... ], min, max )
			// 		return this.shuffle(arr, min, max)
			// }
		},
		/*
		    鎵撲贡鏁扮粍涓厓绱犵殑椤哄簭锛屽苟杩斿洖銆�
		    Given an array, scramble the order and return it.

		    鍏朵粬鐨勫疄鐜版€濊矾锛�
		        // https://code.google.com/p/jslibs/wiki/JavascriptTips
		        result = result.sort(function() {
		            return Math.random() - 0.5
		        })
		*/
		shuffle: function shuffle(arr, min, max) {
			arr = arr || []
			var old = arr.slice(0),
				result = [],
				index = 0,
				length = old.length;
			for (var i = 0; i < length; i++) {
				index = this.natural(0, old.length - 1)
				result.push(old[index])
				old.splice(index, 1)
			}
			switch (arguments.length) {
				case 0:
				case 1:
					return result
				case 2:
					max = min
						/* falls through */
				case 3:
					min = parseInt(min, 10)
					max = parseInt(max, 10)
					return result.slice(0, this.natural(min, max))
			}
		},
		/*
		    * Random.order(item, item)
		    * Random.order([item, item ...])

		    椤哄簭鑾峰彇鏁扮粍涓殑鍏冪礌

		    [JSON瀵煎叆鏁扮粍鏀寔鏁扮粍鏁版嵁褰曞叆](https://github.com/thx/RAP/issues/22)

		    涓嶆敮鎸佸崟鐙皟鐢紒
		*/
		order: function order(array) {
			order.cache = order.cache || {}

			if (arguments.length > 1) array = [].slice.call(arguments, 0)

			// options.context.path/templatePath
			var options = order.options
			var templatePath = options.context.templatePath.join('.')

			var cache = (
				order.cache[templatePath] = order.cache[templatePath] || {
					index: 0,
					array: array
				}
			)

			return cache.array[cache.index++ % cache.array.length]
		}
	}

/***/ },
/* 15 */
/***/ function(module, exports) {

	/*
	    ## Name

	    [Beyond the Top 1000 Names](http://www.ssa.gov/oact/babynames/limits.html)
	*/
	module.exports = {
		// 闅忔満鐢熸垚涓€涓父瑙佺殑鑻辨枃鍚嶃€�
		first: function() {
			var names = [
				// male
				"James", "John", "Robert", "Michael", "William",
				"David", "Richard", "Charles", "Joseph", "Thomas",
				"Christopher", "Daniel", "Paul", "Mark", "Donald",
				"George", "Kenneth", "Steven", "Edward", "Brian",
				"Ronald", "Anthony", "Kevin", "Jason", "Matthew",
				"Gary", "Timothy", "Jose", "Larry", "Jeffrey",
				"Frank", "Scott", "Eric"
			].concat([
				// female
				"Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
				"Jennifer", "Maria", "Susan", "Margaret", "Dorothy",
				"Lisa", "Nancy", "Karen", "Betty", "Helen",
				"Sandra", "Donna", "Carol", "Ruth", "Sharon",
				"Michelle", "Laura", "Sarah", "Kimberly", "Deborah",
				"Jessica", "Shirley", "Cynthia", "Angela", "Melissa",
				"Brenda", "Amy", "Anna"
			])
			return this.pick(names)
				// or this.capitalize(this.word())
		},
		// 闅忔満鐢熸垚涓€涓父瑙佺殑鑻辨枃濮撱€�
		last: function() {
			var names = [
				"Smith", "Johnson", "Williams", "Brown", "Jones",
				"Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
				"Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
				"Moore", "Martin", "Jackson", "Thompson", "White",
				"Lopez", "Lee", "Gonzalez", "Harris", "Clark",
				"Lewis", "Robinson", "Walker", "Perez", "Hall",
				"Young", "Allen"
			]
			return this.pick(names)
				// or this.capitalize(this.word())
		},
		// 闅忔満鐢熸垚涓€涓父瑙佺殑鑻辨枃濮撳悕銆�
		name: function(middle) {
			return this.first() + ' ' +
				(middle ? this.first() + ' ' : '') +
				this.last()
		},
		/*
		    闅忔満鐢熸垚涓€涓父瑙佺殑涓枃濮撱€�
		    [涓栫晫甯哥敤濮撴皬鎺掕](http://baike.baidu.com/view/1719115.htm)
		    [鐜勬淳缃� - 缃戠粶灏忚鍒涗綔杈呭姪骞冲彴](http://xuanpai.sinaapp.com/)
		 */
		cfirst: function() {
			var names = (
				'鐜� 鏉� 寮� 鍒� 闄� 鏉� 璧� 榛� 鍛� 鍚� ' +
				'寰� 瀛� 鑳� 鏈� 楂� 鏋� 浣� 閮� 椹� 缃� ' +
				'姊� 瀹� 閮� 璋� 闊� 鍞� 鍐� 浜� 钁� 钀� ' +
				'绋� 鏇� 琚� 閭� 璁� 鍌� 娌� 鏇� 褰� 鍚� ' +
				'鑻� 鍗� 钂� 钄� 璐� 涓� 榄� 钖� 鍙� 闃� ' +
				'浣� 娼� 鏉� 鎴� 澶� 閿� 姹� 鐢� 浠� 濮� ' +
				'鑼� 鏂� 鐭� 濮� 璋� 寤� 閭� 鐔� 閲� 闄� ' +
				'閮� 瀛� 鐧� 宕� 搴� 姣� 閭� 绉� 姹� 鍙� ' +
				'椤� 渚� 閭� 瀛� 榫� 涓� 娈� 闆� 閽� 姹� ' +
				'灏� 榛� 鏄� 甯� 姝� 涔� 璐� 璧� 榫� 鏂�'
			).split(' ')
			return this.pick(names)
		},
		/*
		    闅忔満鐢熸垚涓€涓父瑙佺殑涓枃鍚嶃€�
		    [涓浗鏈€甯歌鍚嶅瓧鍓�50鍚峗涓変節绠楀懡缃慮(http://www.name999.net/xingming/xingshi/20131004/48.html)
		 */
		clast: function() {
			var names = (
				'浼� 鑺� 濞� 绉€鑻� 鏁� 闈� 涓� 寮� 纾� 鍐� ' +
				'娲� 鍕� 鑹� 鏉� 濞� 娑� 鏄� 瓒� 绉€鍏� 闇� ' +
				'骞� 鍒� 妗傝嫳'
			).split(' ')
			return this.pick(names)
		},
		// 闅忔満鐢熸垚涓€涓父瑙佺殑涓枃濮撳悕銆�
		cname: function() {
			return this.cfirst() + this.clast()
		}
	}

/***/ },
/* 16 */
/***/ function(module, exports) {

	/*
	    ## Web
	*/
	module.exports = {
	    /*
	        闅忔満鐢熸垚涓€涓� URL銆�

	        [URL 瑙勮寖](http://www.w3.org/Addressing/URL/url-spec.txt)
	            http                    Hypertext Transfer Protocol 
	            ftp                     File Transfer protocol 
	            gopher                  The Gopher protocol 
	            mailto                  Electronic mail address 
	            mid                     Message identifiers for electronic mail 
	            cid                     Content identifiers for MIME body part 
	            news                    Usenet news 
	            nntp                    Usenet news for local NNTP access only 
	            prospero                Access using the prospero protocols 
	            telnet rlogin tn3270    Reference to interactive sessions
	            wais                    Wide Area Information Servers 
	    */
	    url: function(protocol, host) {
	        return (protocol || this.protocol()) + '://' + // protocol?
	            (host || this.domain()) + // host?
	            '/' + this.word()
	    },
	    // 闅忔満鐢熸垚涓€涓� URL 鍗忚銆�
	    protocol: function() {
	        return this.pick(
	            // 鍗忚绨�
	            'http ftp gopher mailto mid cid news nntp prospero telnet rlogin tn3270 wais'.split(' ')
	        )
	    },
	    // 闅忔満鐢熸垚涓€涓煙鍚嶃€�
	    domain: function(tld) {
	        return this.word() + '.' + (tld || this.tld())
	    },
	    /*
	        闅忔満鐢熸垚涓€涓《绾у煙鍚嶃€�
	        鍥介檯椤剁骇鍩熷悕 international top-level domain-names, iTLDs
	        鍥藉椤剁骇鍩熷悕 national top-level domainnames, nTLDs
	        [鍩熷悕鍚庣紑澶у叏](http://www.163ns.com/zixun/post/4417.html)
	    */
	    tld: function() { // Top Level Domain
	        return this.pick(
	            (
	                // 鍩熷悕鍚庣紑
	                'com net org edu gov int mil cn ' +
	                // 鍥藉唴鍩熷悕
	                'com.cn net.cn gov.cn org.cn ' +
	                // 涓枃鍥藉唴鍩熷悕
	                '涓浗 涓浗浜掕仈.鍏徃 涓浗浜掕仈.缃戠粶 ' +
	                // 鏂板浗闄呭煙鍚�
	                'tel biz cc tv info name hk mobi asia cd travel pro museum coop aero ' +
	                // 涓栫晫鍚勫浗鍩熷悕鍚庣紑
	                'ad ae af ag ai al am an ao aq ar as at au aw az ba bb bd be bf bg bh bi bj bm bn bo br bs bt bv bw by bz ca cc cf cg ch ci ck cl cm cn co cq cr cu cv cx cy cz de dj dk dm do dz ec ee eg eh es et ev fi fj fk fm fo fr ga gb gd ge gf gh gi gl gm gn gp gr gt gu gw gy hk hm hn hr ht hu id ie il in io iq ir is it jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md mg mh ml mm mn mo mp mq mr ms mt mv mw mx my mz na nc ne nf ng ni nl no np nr nt nu nz om qa pa pe pf pg ph pk pl pm pn pr pt pw py re ro ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr st su sy sz tc td tf tg th tj tk tm tn to tp tr tt tv tw tz ua ug uk us uy va vc ve vg vn vu wf ws ye yu za zm zr zw'
	            ).split(' ')
	        )
	    },
	    // 闅忔満鐢熸垚涓€涓偖浠跺湴鍧€銆�
	    email: function(domain) {
	        return this.character('lower') + '.' + this.word() + '@' +
	            (
	                domain ||
	                (this.word() + '.' + this.tld())
	            )
	            // return this.character('lower') + '.' + this.last().toLowerCase() + '@' + this.last().toLowerCase() + '.' + this.tld()
	            // return this.word() + '@' + (domain || this.domain())
	    },
	    // 闅忔満鐢熸垚涓€涓� IP 鍦板潃銆�
	    ip: function() {
	        return this.natural(0, 255) + '.' +
	            this.natural(0, 255) + '.' +
	            this.natural(0, 255) + '.' +
	            this.natural(0, 255)
	    }
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Address
	*/

	var DICT = __webpack_require__(18)
	var REGION = ['涓滃寳', '鍗庡寳', '鍗庝笢', '鍗庝腑', '鍗庡崡', '瑗垮崡', '瑗垮寳']

	module.exports = {
	    // 闅忔満鐢熸垚涓€涓ぇ鍖恒€�
	    region: function() {
	        return this.pick(REGION)
	    },
	    // 闅忔満鐢熸垚涓€涓紙涓浗锛夌渷锛堟垨鐩磋緰甯傘€佽嚜娌诲尯銆佺壒鍒鏀垮尯锛夈€�
	    province: function() {
	        return this.pick(DICT).name
	    },
	    // 闅忔満鐢熸垚涓€涓紙涓浗锛夊競銆�
	    city: function(prefix) {
	        var province = this.pick(DICT)
	        var city = this.pick(province.children)
	        return prefix ? [province.name, city.name].join(' ') : city.name
	    },
	    // 闅忔満鐢熸垚涓€涓紙涓浗锛夊幙銆�
	    county: function(prefix) {
	        var province = this.pick(DICT)
	        var city = this.pick(province.children)
	        var county = this.pick(city.children) || {
	            name: '-'
	        }
	        return prefix ? [province.name, city.name, county.name].join(' ') : county.name
	    },
	    // 闅忔満鐢熸垚涓€涓偖鏀跨紪鐮侊紙鍏綅鏁板瓧锛夈€�
	    zip: function(len) {
	        var zip = ''
	        for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9)
	        return zip
	    }

	    // address: function() {},
	    // phone: function() {},
	    // areacode: function() {},
	    // street: function() {},
	    // street_suffixes: function() {},
	    // street_suffix: function() {},
	    // states: function() {},
	    // state: function() {},
	}

/***/ },
/* 18 */
/***/ function(module, exports) {

	/*
	    ## Address 瀛楀吀鏁版嵁

	    瀛楀吀鏁版嵁鏉ユ簮 http://www.atatech.org/articles/30028?rnd=254259856

	    鍥芥爣 鐪侊紙甯傦級绾ц鏀垮尯鍒掔爜琛�

	    鍗庡寳   鍖椾含甯� 澶╂触甯� 娌冲寳鐪� 灞辫タ鐪� 鍐呰挋鍙よ嚜娌诲尯
	    涓滃寳   杈藉畞鐪� 鍚夋灄鐪� 榛戦緳姹熺渷
	    鍗庝笢   涓婃捣甯� 姹熻嫃鐪� 娴欐睙鐪� 瀹夊窘鐪� 绂忓缓鐪� 姹熻タ鐪� 灞变笢鐪�
	    鍗庡崡   骞夸笢鐪� 骞胯タ澹棌鑷不鍖� 娴峰崡鐪�
	    鍗庝腑   娌冲崡鐪� 婀栧寳鐪� 婀栧崡鐪�
	    瑗垮崡   閲嶅簡甯� 鍥涘窛鐪� 璐靛窞鐪� 浜戝崡鐪� 瑗胯棌鑷不鍖�
	    瑗垮寳   闄曡タ鐪� 鐢樿們鐪� 闈掓捣鐪� 瀹佸鍥炴棌鑷不鍖� 鏂扮枂缁村惥灏旇嚜娌诲尯
	    娓境鍙� 棣欐腐鐗瑰埆琛屾斂鍖� 婢抽棬鐗瑰埆琛屾斂鍖� 鍙版咕鐪�
	    
	    **鎺掑簭**
	    
	    ```js
	    var map = {}
	    _.each(_.keys(REGIONS),function(id){
	      map[id] = REGIONS[ID]
	    })
	    JSON.stringify(map)
	    ```
	*/
	var DICT = {
	    "110000": "鍖椾含",
	    "110100": "鍖椾含甯�",
	    "110101": "涓滃煄鍖�",
	    "110102": "瑗垮煄鍖�",
	    "110105": "鏈濋槼鍖�",
	    "110106": "涓板彴鍖�",
	    "110107": "鐭虫櫙灞卞尯",
	    "110108": "娴锋穩鍖�",
	    "110109": "闂ㄥご娌熷尯",
	    "110111": "鎴垮北鍖�",
	    "110112": "閫氬窞鍖�",
	    "110113": "椤轰箟鍖�",
	    "110114": "鏄屽钩鍖�",
	    "110115": "澶у叴鍖�",
	    "110116": "鎬€鏌斿尯",
	    "110117": "骞宠胺鍖�",
	    "110228": "瀵嗕簯鍘�",
	    "110229": "寤跺簡鍘�",
	    "110230": "鍏跺畠鍖�",
	    "120000": "澶╂触",
	    "120100": "澶╂触甯�",
	    "120101": "鍜屽钩鍖�",
	    "120102": "娌充笢鍖�",
	    "120103": "娌宠タ鍖�",
	    "120104": "鍗楀紑鍖�",
	    "120105": "娌冲寳鍖�",
	    "120106": "绾㈡ˉ鍖�",
	    "120110": "涓滀附鍖�",
	    "120111": "瑗块潚鍖�",
	    "120112": "娲ュ崡鍖�",
	    "120113": "鍖楄景鍖�",
	    "120114": "姝︽竻鍖�",
	    "120115": "瀹濆澔鍖�",
	    "120116": "婊ㄦ捣鏂板尯",
	    "120221": "瀹佹渤鍘�",
	    "120223": "闈欐捣鍘�",
	    "120225": "钃熷幙",
	    "120226": "鍏跺畠鍖�",
	    "130000": "娌冲寳鐪�",
	    "130100": "鐭冲搴勫競",
	    "130102": "闀垮畨鍖�",
	    "130103": "妗ヤ笢鍖�",
	    "130104": "妗ヨタ鍖�",
	    "130105": "鏂板崕鍖�",
	    "130107": "浜曢檳鐭垮尯",
	    "130108": "瑁曞崕鍖�",
	    "130121": "浜曢檳鍘�",
	    "130123": "姝ｅ畾鍘�",
	    "130124": "鏍惧煄鍘�",
	    "130125": "琛屽攼鍘�",
	    "130126": "鐏靛鍘�",
	    "130127": "楂橀倯鍘�",
	    "130128": "娣辨辰鍘�",
	    "130129": "璧炵殗鍘�",
	    "130130": "鏃犳瀬鍘�",
	    "130131": "骞冲北鍘�",
	    "130132": "鍏冩皬鍘�",
	    "130133": "璧靛幙",
	    "130181": "杈涢泦甯�",
	    "130182": "钘佸煄甯�",
	    "130183": "鏅嬪窞甯�",
	    "130184": "鏂颁箰甯�",
	    "130185": "楣挎硥甯�",
	    "130186": "鍏跺畠鍖�",
	    "130200": "鍞愬北甯�",
	    "130202": "璺崡鍖�",
	    "130203": "璺寳鍖�",
	    "130204": "鍙ゅ喍鍖�",
	    "130205": "寮€骞冲尯",
	    "130207": "涓板崡鍖�",
	    "130208": "涓版鼎鍖�",
	    "130223": "婊﹀幙",
	    "130224": "婊﹀崡鍘�",
	    "130225": "涔愪涵鍘�",
	    "130227": "杩佽タ鍘�",
	    "130229": "鐜夌敯鍘�",
	    "130230": "鏇瑰鐢稿尯",
	    "130281": "閬靛寲甯�",
	    "130283": "杩佸畨甯�",
	    "130284": "鍏跺畠鍖�",
	    "130300": "绉︾殗宀涘競",
	    "130302": "娴锋腐鍖�",
	    "130303": "灞辨捣鍏冲尯",
	    "130304": "鍖楁埓娌冲尯",
	    "130321": "闈掗緳婊℃棌鑷不鍘�",
	    "130322": "鏄岄粠鍘�",
	    "130323": "鎶氬畞鍘�",
	    "130324": "鍗㈤緳鍘�",
	    "130398": "鍏跺畠鍖�",
	    "130400": "閭兏甯�",
	    "130402": "閭北鍖�",
	    "130403": "涓涘彴鍖�",
	    "130404": "澶嶅叴鍖�",
	    "130406": "宄板嘲鐭垮尯",
	    "130421": "閭兏鍘�",
	    "130423": "涓存汲鍘�",
	    "130424": "鎴愬畨鍘�",
	    "130425": "澶у悕鍘�",
	    "130426": "娑夊幙",
	    "130427": "纾佸幙",
	    "130428": "鑲ヤ埂鍘�",
	    "130429": "姘稿勾鍘�",
	    "130430": "閭卞幙",
	    "130431": "楦℃辰鍘�",
	    "130432": "骞垮钩鍘�",
	    "130433": "棣嗛櫠鍘�",
	    "130434": "榄忓幙",
	    "130435": "鏇插懆鍘�",
	    "130481": "姝﹀畨甯�",
	    "130482": "鍏跺畠鍖�",
	    "130500": "閭㈠彴甯�",
	    "130502": "妗ヤ笢鍖�",
	    "130503": "妗ヨタ鍖�",
	    "130521": "閭㈠彴鍘�",
	    "130522": "涓村煄鍘�",
	    "130523": "鍐呬笜鍘�",
	    "130524": "鏌忎埂鍘�",
	    "130525": "闅嗗哀鍘�",
	    "130526": "浠诲幙",
	    "130527": "鍗楀拰鍘�",
	    "130528": "瀹佹檵鍘�",
	    "130529": "宸ㄩ箍鍘�",
	    "130530": "鏂版渤鍘�",
	    "130531": "骞垮畻鍘�",
	    "130532": "骞充埂鍘�",
	    "130533": "濞佸幙",
	    "130534": "娓呮渤鍘�",
	    "130535": "涓磋タ鍘�",
	    "130581": "鍗楀甯�",
	    "130582": "娌欐渤甯�",
	    "130583": "鍏跺畠鍖�",
	    "130600": "淇濆畾甯�",
	    "130602": "鏂板競鍖�",
	    "130603": "鍖楀競鍖�",
	    "130604": "鍗楀競鍖�",
	    "130621": "婊″煄鍘�",
	    "130622": "娓呰嫅鍘�",
	    "130623": "娑炴按鍘�",
	    "130624": "闃滃钩鍘�",
	    "130625": "寰愭按鍘�",
	    "130626": "瀹氬叴鍘�",
	    "130627": "鍞愬幙",
	    "130628": "楂橀槼鍘�",
	    "130629": "瀹瑰煄鍘�",
	    "130630": "娑炴簮鍘�",
	    "130631": "鏈涢兘鍘�",
	    "130632": "瀹夋柊鍘�",
	    "130633": "鏄撳幙",
	    "130634": "鏇查槼鍘�",
	    "130635": "锠″幙",
	    "130636": "椤哄钩鍘�",
	    "130637": "鍗氶噹鍘�",
	    "130638": "闆勫幙",
	    "130681": "娑垮窞甯�",
	    "130682": "瀹氬窞甯�",
	    "130683": "瀹夊浗甯�",
	    "130684": "楂樼搴楀競",
	    "130699": "鍏跺畠鍖�",
	    "130700": "寮犲鍙ｅ競",
	    "130702": "妗ヤ笢鍖�",
	    "130703": "妗ヨタ鍖�",
	    "130705": "瀹ｅ寲鍖�",
	    "130706": "涓嬭姳鍥尯",
	    "130721": "瀹ｅ寲鍘�",
	    "130722": "寮犲寳鍘�",
	    "130723": "搴蜂繚鍘�",
	    "130724": "娌芥簮鍘�",
	    "130725": "灏氫箟鍘�",
	    "130726": "钄氬幙",
	    "130727": "闃冲師鍘�",
	    "130728": "鎬€瀹夊幙",
	    "130729": "涓囧叏鍘�",
	    "130730": "鎬€鏉ュ幙",
	    "130731": "娑块箍鍘�",
	    "130732": "璧ゅ煄鍘�",
	    "130733": "宕囩ぜ鍘�",
	    "130734": "鍏跺畠鍖�",
	    "130800": "鎵垮痉甯�",
	    "130802": "鍙屾ˉ鍖�",
	    "130803": "鍙屾沪鍖�",
	    "130804": "楣版墜钀ュ瓙鐭垮尯",
	    "130821": "鎵垮痉鍘�",
	    "130822": "鍏撮殕鍘�",
	    "130823": "骞虫硥鍘�",
	    "130824": "婊﹀钩鍘�",
	    "130825": "闅嗗寲鍘�",
	    "130826": "涓板畞婊℃棌鑷不鍘�",
	    "130827": "瀹藉煄婊℃棌鑷不鍘�",
	    "130828": "鍥村満婊℃棌钂欏彜鏃忚嚜娌诲幙",
	    "130829": "鍏跺畠鍖�",
	    "130900": "娌у窞甯�",
	    "130902": "鏂板崕鍖�",
	    "130903": "杩愭渤鍖�",
	    "130921": "娌у幙",
	    "130922": "闈掑幙",
	    "130923": "涓滃厜鍘�",
	    "130924": "娴峰叴鍘�",
	    "130925": "鐩愬北鍘�",
	    "130926": "鑲冨畞鍘�",
	    "130927": "鍗楃毊鍘�",
	    "130928": "鍚存ˉ鍘�",
	    "130929": "鐚幙",
	    "130930": "瀛熸潙鍥炴棌鑷不鍘�",
	    "130981": "娉婂ご甯�",
	    "130982": "浠讳笜甯�",
	    "130983": "榛勯獏甯�",
	    "130984": "娌抽棿甯�",
	    "130985": "鍏跺畠鍖�",
	    "131000": "寤婂潑甯�",
	    "131002": "瀹夋鍖�",
	    "131003": "骞块槼鍖�",
	    "131022": "鍥哄畨鍘�",
	    "131023": "姘告竻鍘�",
	    "131024": "棣欐渤鍘�",
	    "131025": "澶у煄鍘�",
	    "131026": "鏂囧畨鍘�",
	    "131028": "澶у巶鍥炴棌鑷不鍘�",
	    "131081": "闇稿窞甯�",
	    "131082": "涓夋渤甯�",
	    "131083": "鍏跺畠鍖�",
	    "131100": "琛℃按甯�",
	    "131102": "妗冨煄鍖�",
	    "131121": "鏋ｅ己鍘�",
	    "131122": "姝﹂倯鍘�",
	    "131123": "姝﹀己鍘�",
	    "131124": "楗堕槼鍘�",
	    "131125": "瀹夊钩鍘�",
	    "131126": "鏁呭煄鍘�",
	    "131127": "鏅幙",
	    "131128": "闃滃煄鍘�",
	    "131181": "鍐€宸炲競",
	    "131182": "娣卞窞甯�",
	    "131183": "鍏跺畠鍖�",
	    "140000": "灞辫タ鐪�",
	    "140100": "澶師甯�",
	    "140105": "灏忓簵鍖�",
	    "140106": "杩庢辰鍖�",
	    "140107": "鏉忚姳宀尯",
	    "140108": "灏栬崏鍧尯",
	    "140109": "涓囨煆鏋楀尯",
	    "140110": "鏅嬫簮鍖�",
	    "140121": "娓呭緪鍘�",
	    "140122": "闃虫洸鍘�",
	    "140123": "濞勭儲鍘�",
	    "140181": "鍙や氦甯�",
	    "140182": "鍏跺畠鍖�",
	    "140200": "澶у悓甯�",
	    "140202": "鍩庡尯",
	    "140203": "鐭垮尯",
	    "140211": "鍗楅儕鍖�",
	    "140212": "鏂拌崳鍖�",
	    "140221": "闃抽珮鍘�",
	    "140222": "澶╅晣鍘�",
	    "140223": "骞跨伒鍘�",
	    "140224": "鐏典笜鍘�",
	    "140225": "娴戞簮鍘�",
	    "140226": "宸︿簯鍘�",
	    "140227": "澶у悓鍘�",
	    "140228": "鍏跺畠鍖�",
	    "140300": "闃虫硥甯�",
	    "140302": "鍩庡尯",
	    "140303": "鐭垮尯",
	    "140311": "閮婂尯",
	    "140321": "骞冲畾鍘�",
	    "140322": "鐩傚幙",
	    "140323": "鍏跺畠鍖�",
	    "140400": "闀挎不甯�",
	    "140421": "闀挎不鍘�",
	    "140423": "瑗勫灒鍘�",
	    "140424": "灞暀鍘�",
	    "140425": "骞抽『鍘�",
	    "140426": "榛庡煄鍘�",
	    "140427": "澹跺叧鍘�",
	    "140428": "闀垮瓙鍘�",
	    "140429": "姝︿埂鍘�",
	    "140430": "娌佸幙",
	    "140431": "娌佹簮鍘�",
	    "140481": "娼炲煄甯�",
	    "140482": "鍩庡尯",
	    "140483": "閮婂尯",
	    "140485": "鍏跺畠鍖�",
	    "140500": "鏅嬪煄甯�",
	    "140502": "鍩庡尯",
	    "140521": "娌佹按鍘�",
	    "140522": "闃冲煄鍘�",
	    "140524": "闄靛窛鍘�",
	    "140525": "娉藉窞鍘�",
	    "140581": "楂樺钩甯�",
	    "140582": "鍏跺畠鍖�",
	    "140600": "鏈斿窞甯�",
	    "140602": "鏈斿煄鍖�",
	    "140603": "骞抽瞾鍖�",
	    "140621": "灞遍槾鍘�",
	    "140622": "搴斿幙",
	    "140623": "鍙崇帀鍘�",
	    "140624": "鎬€浠佸幙",
	    "140625": "鍏跺畠鍖�",
	    "140700": "鏅嬩腑甯�",
	    "140702": "姒嗘鍖�",
	    "140721": "姒嗙ぞ鍘�",
	    "140722": "宸︽潈鍘�",
	    "140723": "鍜岄『鍘�",
	    "140724": "鏄旈槼鍘�",
	    "140725": "瀵块槼鍘�",
	    "140726": "澶胺鍘�",
	    "140727": "绁佸幙",
	    "140728": "骞抽仴鍘�",
	    "140729": "鐏电煶鍘�",
	    "140781": "浠嬩紤甯�",
	    "140782": "鍏跺畠鍖�",
	    "140800": "杩愬煄甯�",
	    "140802": "鐩愭箹鍖�",
	    "140821": "涓寸寳鍘�",
	    "140822": "涓囪崳鍘�",
	    "140823": "闂诲枩鍘�",
	    "140824": "绋峰北鍘�",
	    "140825": "鏂扮粵鍘�",
	    "140826": "缁涘幙",
	    "140827": "鍨ｆ洸鍘�",
	    "140828": "澶忓幙",
	    "140829": "骞抽檰鍘�",
	    "140830": "鑺煄鍘�",
	    "140881": "姘告祹甯�",
	    "140882": "娌虫触甯�",
	    "140883": "鍏跺畠鍖�",
	    "140900": "蹇诲窞甯�",
	    "140902": "蹇诲簻鍖�",
	    "140921": "瀹氳鍘�",
	    "140922": "浜斿彴鍘�",
	    "140923": "浠ｅ幙",
	    "140924": "绻佸硻鍘�",
	    "140925": "瀹佹鍘�",
	    "140926": "闈欎箰鍘�",
	    "140927": "绁炴睜鍘�",
	    "140928": "浜斿鍘�",
	    "140929": "宀㈠矚鍘�",
	    "140930": "娌虫洸鍘�",
	    "140931": "淇濆痉鍘�",
	    "140932": "鍋忓叧鍘�",
	    "140981": "鍘熷钩甯�",
	    "140982": "鍏跺畠鍖�",
	    "141000": "涓存本甯�",
	    "141002": "灏ч兘鍖�",
	    "141021": "鏇叉矁鍘�",
	    "141022": "缈煎煄鍘�",
	    "141023": "瑗勬本鍘�",
	    "141024": "娲礊鍘�",
	    "141025": "鍙ゅ幙",
	    "141026": "瀹夋辰鍘�",
	    "141027": "娴北鍘�",
	    "141028": "鍚夊幙",
	    "141029": "涔″畞鍘�",
	    "141030": "澶у畞鍘�",
	    "141031": "闅板幙",
	    "141032": "姘稿拰鍘�",
	    "141033": "钂插幙",
	    "141034": "姹捐タ鍘�",
	    "141081": "渚┈甯�",
	    "141082": "闇嶅窞甯�",
	    "141083": "鍏跺畠鍖�",
	    "141100": "鍚曟甯�",
	    "141102": "绂荤煶鍖�",
	    "141121": "鏂囨按鍘�",
	    "141122": "浜ゅ煄鍘�",
	    "141123": "鍏村幙",
	    "141124": "涓村幙",
	    "141125": "鏌虫灄鍘�",
	    "141126": "鐭虫ゼ鍘�",
	    "141127": "宀氬幙",
	    "141128": "鏂瑰北鍘�",
	    "141129": "涓槼鍘�",
	    "141130": "浜ゅ彛鍘�",
	    "141181": "瀛濅箟甯�",
	    "141182": "姹鹃槼甯�",
	    "141183": "鍏跺畠鍖�",
	    "150000": "鍐呰挋鍙よ嚜娌诲尯",
	    "150100": "鍛煎拰娴╃壒甯�",
	    "150102": "鏂板煄鍖�",
	    "150103": "鍥炴皯鍖�",
	    "150104": "鐜夋硥鍖�",
	    "150105": "璧涚綍鍖�",
	    "150121": "鍦熼粯鐗瑰乏鏃�",
	    "150122": "鎵樺厠鎵樺幙",
	    "150123": "鍜屾灄鏍煎皵鍘�",
	    "150124": "娓呮按娌冲幙",
	    "150125": "姝﹀窛鍘�",
	    "150126": "鍏跺畠鍖�",
	    "150200": "鍖呭ご甯�",
	    "150202": "涓滄渤鍖�",
	    "150203": "鏄嗛兘浠戝尯",
	    "150204": "闈掑北鍖�",
	    "150205": "鐭虫嫄鍖�",
	    "150206": "鐧戒簯閯傚崥鐭垮尯",
	    "150207": "涔濆師鍖�",
	    "150221": "鍦熼粯鐗瑰彸鏃�",
	    "150222": "鍥洪槼鍘�",
	    "150223": "杈惧皵缃曡寕鏄庡畨鑱斿悎鏃�",
	    "150224": "鍏跺畠鍖�",
	    "150300": "涔屾捣甯�",
	    "150302": "娴峰媰婀惧尯",
	    "150303": "娴峰崡鍖�",
	    "150304": "涔岃揪鍖�",
	    "150305": "鍏跺畠鍖�",
	    "150400": "璧ゅ嘲甯�",
	    "150402": "绾㈠北鍖�",
	    "150403": "鍏冨疂灞卞尯",
	    "150404": "鏉惧北鍖�",
	    "150421": "闃块瞾绉戝皵娌佹棗",
	    "150422": "宸存灄宸︽棗",
	    "150423": "宸存灄鍙虫棗",
	    "150424": "鏋楄タ鍘�",
	    "150425": "鍏嬩粈鍏嬭吘鏃�",
	    "150426": "缈佺墰鐗规棗",
	    "150428": "鍠€鍠囨瞾鏃�",
	    "150429": "瀹佸煄鍘�",
	    "150430": "鏁栨眽鏃�",
	    "150431": "鍏跺畠鍖�",
	    "150500": "閫氳窘甯�",
	    "150502": "绉戝皵娌佸尯",
	    "150521": "绉戝皵娌佸乏缈间腑鏃�",
	    "150522": "绉戝皵娌佸乏缈煎悗鏃�",
	    "150523": "寮€椴佸幙",
	    "150524": "搴撲鸡鏃�",
	    "150525": "濂堟浖鏃�",
	    "150526": "鎵庨瞾鐗规棗",
	    "150581": "闇嶆灄閮嫆甯�",
	    "150582": "鍏跺畠鍖�",
	    "150600": "閯傚皵澶氭柉甯�",
	    "150602": "涓滆儨鍖�",
	    "150621": "杈炬媺鐗规棗",
	    "150622": "鍑嗘牸灏旀棗",
	    "150623": "閯傛墭鍏嬪墠鏃�",
	    "150624": "閯傛墭鍏嬫棗",
	    "150625": "鏉敠鏃�",
	    "150626": "涔屽鏃�",
	    "150627": "浼婇噾闇嶆礇鏃�",
	    "150628": "鍏跺畠鍖�",
	    "150700": "鍛间鸡璐濆皵甯�",
	    "150702": "娴锋媺灏斿尯",
	    "150703": "鎵庤祲璇哄皵鍖�",
	    "150721": "闃胯崳鏃�",
	    "150722": "鑾姏杈剧摝杈炬枴灏旀棌鑷不鏃�",
	    "150723": "閯備鸡鏄ヨ嚜娌绘棗",
	    "150724": "閯傛俯鍏嬫棌鑷不鏃�",
	    "150725": "闄堝反灏旇檸鏃�",
	    "150726": "鏂板反灏旇檸宸︽棗",
	    "150727": "鏂板反灏旇檸鍙虫棗",
	    "150781": "婊℃床閲屽競",
	    "150782": "鐗欏厠鐭冲競",
	    "150783": "鎵庡叞灞競",
	    "150784": "棰濆皵鍙ょ撼甯�",
	    "150785": "鏍规渤甯�",
	    "150786": "鍏跺畠鍖�",
	    "150800": "宸村溅娣栧皵甯�",
	    "150802": "涓存渤鍖�",
	    "150821": "浜斿師鍘�",
	    "150822": "纾村彛鍘�",
	    "150823": "涔屾媺鐗瑰墠鏃�",
	    "150824": "涔屾媺鐗逛腑鏃�",
	    "150825": "涔屾媺鐗瑰悗鏃�",
	    "150826": "鏉敠鍚庢棗",
	    "150827": "鍏跺畠鍖�",
	    "150900": "涔屽叞瀵熷竷甯�",
	    "150902": "闆嗗畞鍖�",
	    "150921": "鍗撹祫鍘�",
	    "150922": "鍖栧痉鍘�",
	    "150923": "鍟嗛兘鍘�",
	    "150924": "鍏村拰鍘�",
	    "150925": "鍑夊煄鍘�",
	    "150926": "瀵熷搱灏斿彸缈煎墠鏃�",
	    "150927": "瀵熷搱灏斿彸缈间腑鏃�",
	    "150928": "瀵熷搱灏斿彸缈煎悗鏃�",
	    "150929": "鍥涘瓙鐜嬫棗",
	    "150981": "涓伴晣甯�",
	    "150982": "鍏跺畠鍖�",
	    "152200": "鍏村畨鐩�",
	    "152201": "涔屽叞娴╃壒甯�",
	    "152202": "闃垮皵灞卞競",
	    "152221": "绉戝皵娌佸彸缈煎墠鏃�",
	    "152222": "绉戝皵娌佸彸缈间腑鏃�",
	    "152223": "鎵庤祲鐗规棗",
	    "152224": "绐佹硥鍘�",
	    "152225": "鍏跺畠鍖�",
	    "152500": "閿℃灄閮嫆鐩�",
	    "152501": "浜岃繛娴╃壒甯�",
	    "152502": "閿℃灄娴╃壒甯�",
	    "152522": "闃垮反鍢庢棗",
	    "152523": "鑻忓凹鐗瑰乏鏃�",
	    "152524": "鑻忓凹鐗瑰彸鏃�",
	    "152525": "涓滀箤鐝犵﹩娌佹棗",
	    "152526": "瑗夸箤鐝犵﹩娌佹棗",
	    "152527": "澶粏瀵烘棗",
	    "152528": "闀堕粍鏃�",
	    "152529": "姝ｉ暥鐧芥棗",
	    "152530": "姝ｈ摑鏃�",
	    "152531": "澶氫鸡鍘�",
	    "152532": "鍏跺畠鍖�",
	    "152900": "闃挎媺鍠勭洘",
	    "152921": "闃挎媺鍠勫乏鏃�",
	    "152922": "闃挎媺鍠勫彸鏃�",
	    "152923": "棰濇祹绾虫棗",
	    "152924": "鍏跺畠鍖�",
	    "210000": "杈藉畞鐪�",
	    "210100": "娌堥槼甯�",
	    "210102": "鍜屽钩鍖�",
	    "210103": "娌堟渤鍖�",
	    "210104": "澶т笢鍖�",
	    "210105": "鐨囧鍖�",
	    "210106": "閾佽タ鍖�",
	    "210111": "鑻忓灞尯",
	    "210112": "涓滈櫟鍖�",
	    "210113": "鏂板煄瀛愬尯",
	    "210114": "浜庢椽鍖�",
	    "210122": "杈戒腑鍘�",
	    "210123": "搴峰钩鍘�",
	    "210124": "娉曞簱鍘�",
	    "210181": "鏂版皯甯�",
	    "210184": "娌堝寳鏂板尯",
	    "210185": "鍏跺畠鍖�",
	    "210200": "澶ц繛甯�",
	    "210202": "涓北鍖�",
	    "210203": "瑗垮矖鍖�",
	    "210204": "娌欐渤鍙ｅ尯",
	    "210211": "鐢樹簳瀛愬尯",
	    "210212": "鏃呴『鍙ｅ尯",
	    "210213": "閲戝窞鍖�",
	    "210224": "闀挎捣鍘�",
	    "210281": "鐡︽埧搴楀競",
	    "210282": "鏅叞搴楀競",
	    "210283": "搴勬渤甯�",
	    "210298": "鍏跺畠鍖�",
	    "210300": "闉嶅北甯�",
	    "210302": "閾佷笢鍖�",
	    "210303": "閾佽タ鍖�",
	    "210304": "绔嬪北鍖�",
	    "210311": "鍗冨北鍖�",
	    "210321": "鍙板畨鍘�",
	    "210323": "宀博婊℃棌鑷不鍘�",
	    "210381": "娴峰煄甯�",
	    "210382": "鍏跺畠鍖�",
	    "210400": "鎶氶『甯�",
	    "210402": "鏂版姎鍖�",
	    "210403": "涓滄床鍖�",
	    "210404": "鏈涜姳鍖�",
	    "210411": "椤哄煄鍖�",
	    "210421": "鎶氶『鍘�",
	    "210422": "鏂板婊℃棌鑷不鍘�",
	    "210423": "娓呭師婊℃棌鑷不鍘�",
	    "210424": "鍏跺畠鍖�",
	    "210500": "鏈邯甯�",
	    "210502": "骞冲北鍖�",
	    "210503": "婧箹鍖�",
	    "210504": "鏄庡北鍖�",
	    "210505": "鍗楄姮鍖�",
	    "210521": "鏈邯婊℃棌鑷不鍘�",
	    "210522": "妗撲粊婊℃棌鑷不鍘�",
	    "210523": "鍏跺畠鍖�",
	    "210600": "涓逛笢甯�",
	    "210602": "鍏冨疂鍖�",
	    "210603": "鎸叴鍖�",
	    "210604": "鎸畨鍖�",
	    "210624": "瀹界敻婊℃棌鑷不鍘�",
	    "210681": "涓滄腐甯�",
	    "210682": "鍑ゅ煄甯�",
	    "210683": "鍏跺畠鍖�",
	    "210700": "閿﹀窞甯�",
	    "210702": "鍙ゅ鍖�",
	    "210703": "鍑屾渤鍖�",
	    "210711": "澶拰鍖�",
	    "210726": "榛戝北鍘�",
	    "210727": "涔夊幙",
	    "210781": "鍑屾捣甯�",
	    "210782": "鍖楅晣甯�",
	    "210783": "鍏跺畠鍖�",
	    "210800": "钀ュ彛甯�",
	    "210802": "绔欏墠鍖�",
	    "210803": "瑗垮競鍖�",
	    "210804": "椴呴奔鍦堝尯",
	    "210811": "鑰佽竟鍖�",
	    "210881": "鐩栧窞甯�",
	    "210882": "澶х煶妗ュ競",
	    "210883": "鍏跺畠鍖�",
	    "210900": "闃滄柊甯�",
	    "210902": "娴峰窞鍖�",
	    "210903": "鏂伴偙鍖�",
	    "210904": "澶钩鍖�",
	    "210905": "娓呮渤闂ㄥ尯",
	    "210911": "缁嗘渤鍖�",
	    "210921": "闃滄柊钂欏彜鏃忚嚜娌诲幙",
	    "210922": "褰版鍘�",
	    "210923": "鍏跺畠鍖�",
	    "211000": "杈介槼甯�",
	    "211002": "鐧藉鍖�",
	    "211003": "鏂囧湥鍖�",
	    "211004": "瀹忎紵鍖�",
	    "211005": "寮撻暱宀尯",
	    "211011": "澶瓙娌冲尯",
	    "211021": "杈介槼鍘�",
	    "211081": "鐏甯�",
	    "211082": "鍏跺畠鍖�",
	    "211100": "鐩橀敠甯�",
	    "211102": "鍙屽彴瀛愬尯",
	    "211103": "鍏撮殕鍙板尯",
	    "211121": "澶ф醇鍘�",
	    "211122": "鐩樺北鍘�",
	    "211123": "鍏跺畠鍖�",
	    "211200": "閾佸箔甯�",
	    "211202": "閾跺窞鍖�",
	    "211204": "娓呮渤鍖�",
	    "211221": "閾佸箔鍘�",
	    "211223": "瑗夸赴鍘�",
	    "211224": "鏄屽浘鍘�",
	    "211281": "璋冨叺灞卞競",
	    "211282": "寮€鍘熷競",
	    "211283": "鍏跺畠鍖�",
	    "211300": "鏈濋槼甯�",
	    "211302": "鍙屽鍖�",
	    "211303": "榫欏煄鍖�",
	    "211321": "鏈濋槼鍘�",
	    "211322": "寤哄钩鍘�",
	    "211324": "鍠€鍠囨瞾宸︾考钂欏彜鏃忚嚜娌诲幙",
	    "211381": "鍖楃エ甯�",
	    "211382": "鍑屾簮甯�",
	    "211383": "鍏跺畠鍖�",
	    "211400": "钁姦宀涘競",
	    "211402": "杩炲北鍖�",
	    "211403": "榫欐腐鍖�",
	    "211404": "鍗楃エ鍖�",
	    "211421": "缁ヤ腑鍘�",
	    "211422": "寤烘槍鍘�",
	    "211481": "鍏村煄甯�",
	    "211482": "鍏跺畠鍖�",
	    "220000": "鍚夋灄鐪�",
	    "220100": "闀挎槬甯�",
	    "220102": "鍗楀叧鍖�",
	    "220103": "瀹藉煄鍖�",
	    "220104": "鏈濋槼鍖�",
	    "220105": "浜岄亾鍖�",
	    "220106": "缁垮洯鍖�",
	    "220112": "鍙岄槼鍖�",
	    "220122": "鍐滃畨鍘�",
	    "220181": "涔濆彴甯�",
	    "220182": "姒嗘爲甯�",
	    "220183": "寰锋儬甯�",
	    "220188": "鍏跺畠鍖�",
	    "220200": "鍚夋灄甯�",
	    "220202": "鏄岄倯鍖�",
	    "220203": "榫欐江鍖�",
	    "220204": "鑸硅惀鍖�",
	    "220211": "涓版弧鍖�",
	    "220221": "姘稿悏鍘�",
	    "220281": "铔熸渤甯�",
	    "220282": "妗︾敻甯�",
	    "220283": "鑸掑叞甯�",
	    "220284": "纾愮煶甯�",
	    "220285": "鍏跺畠鍖�",
	    "220300": "鍥涘钩甯�",
	    "220302": "閾佽タ鍖�",
	    "220303": "閾佷笢鍖�",
	    "220322": "姊ㄦ爲鍘�",
	    "220323": "浼婇€氭弧鏃忚嚜娌诲幙",
	    "220381": "鍏富宀競",
	    "220382": "鍙岃窘甯�",
	    "220383": "鍏跺畠鍖�",
	    "220400": "杈芥簮甯�",
	    "220402": "榫欏北鍖�",
	    "220403": "瑗垮畨鍖�",
	    "220421": "涓滀赴鍘�",
	    "220422": "涓滆窘鍘�",
	    "220423": "鍏跺畠鍖�",
	    "220500": "閫氬寲甯�",
	    "220502": "涓滄槍鍖�",
	    "220503": "浜岄亾姹熷尯",
	    "220521": "閫氬寲鍘�",
	    "220523": "杈夊崡鍘�",
	    "220524": "鏌虫渤鍘�",
	    "220581": "姊呮渤鍙ｅ競",
	    "220582": "闆嗗畨甯�",
	    "220583": "鍏跺畠鍖�",
	    "220600": "鐧藉北甯�",
	    "220602": "娴戞睙鍖�",
	    "220621": "鎶氭澗鍘�",
	    "220622": "闈栧畤鍘�",
	    "220623": "闀跨櫧鏈濋矞鏃忚嚜娌诲幙",
	    "220625": "姹熸簮鍖�",
	    "220681": "涓存睙甯�",
	    "220682": "鍏跺畠鍖�",
	    "220700": "鏉惧師甯�",
	    "220702": "瀹佹睙鍖�",
	    "220721": "鍓嶉儹灏旂綏鏂挋鍙ゆ棌鑷不鍘�",
	    "220722": "闀垮箔鍘�",
	    "220723": "涔惧畨鍘�",
	    "220724": "鎵朵綑甯�",
	    "220725": "鍏跺畠鍖�",
	    "220800": "鐧藉煄甯�",
	    "220802": "娲寳鍖�",
	    "220821": "闀囪祲鍘�",
	    "220822": "閫氭鍘�",
	    "220881": "娲崡甯�",
	    "220882": "澶у畨甯�",
	    "220883": "鍏跺畠鍖�",
	    "222400": "寤惰竟鏈濋矞鏃忚嚜娌诲窞",
	    "222401": "寤跺悏甯�",
	    "222402": "鍥句滑甯�",
	    "222403": "鏁﹀寲甯�",
	    "222404": "鐝叉槬甯�",
	    "222405": "榫欎簳甯�",
	    "222406": "鍜岄緳甯�",
	    "222424": "姹竻鍘�",
	    "222426": "瀹夊浘鍘�",
	    "222427": "鍏跺畠鍖�",
	    "230000": "榛戦緳姹熺渷",
	    "230100": "鍝堝皵婊ㄥ競",
	    "230102": "閬撻噷鍖�",
	    "230103": "鍗楀矖鍖�",
	    "230104": "閬撳鍖�",
	    "230106": "棣欏潑鍖�",
	    "230108": "骞虫埧鍖�",
	    "230109": "鏉惧寳鍖�",
	    "230111": "鍛煎叞鍖�",
	    "230123": "渚濆叞鍘�",
	    "230124": "鏂规鍘�",
	    "230125": "瀹惧幙",
	    "230126": "宸村溅鍘�",
	    "230127": "鏈ㄥ叞鍘�",
	    "230128": "閫氭渤鍘�",
	    "230129": "寤跺鍘�",
	    "230181": "闃垮煄鍖�",
	    "230182": "鍙屽煄甯�",
	    "230183": "灏氬織甯�",
	    "230184": "浜斿父甯�",
	    "230186": "鍏跺畠鍖�",
	    "230200": "榻愰綈鍝堝皵甯�",
	    "230202": "榫欐矙鍖�",
	    "230203": "寤哄崕鍖�",
	    "230204": "閾侀攱鍖�",
	    "230205": "鏄傛槀婧尯",
	    "230206": "瀵屾媺灏斿熀鍖�",
	    "230207": "纰惧瓙灞卞尯",
	    "230208": "姊呴噷鏂揪鏂″皵鏃忓尯",
	    "230221": "榫欐睙鍘�",
	    "230223": "渚濆畨鍘�",
	    "230224": "娉版潵鍘�",
	    "230225": "鐢樺崡鍘�",
	    "230227": "瀵岃鍘�",
	    "230229": "鍏嬪北鍘�",
	    "230230": "鍏嬩笢鍘�",
	    "230231": "鎷滄硥鍘�",
	    "230281": "璁锋渤甯�",
	    "230282": "鍏跺畠鍖�",
	    "230300": "楦¤タ甯�",
	    "230302": "楦″啝鍖�",
	    "230303": "鎭掑北鍖�",
	    "230304": "婊撮亾鍖�",
	    "230305": "姊ㄦ爲鍖�",
	    "230306": "鍩庡瓙娌冲尯",
	    "230307": "楹诲北鍖�",
	    "230321": "楦′笢鍘�",
	    "230381": "铏庢灄甯�",
	    "230382": "瀵嗗北甯�",
	    "230383": "鍏跺畠鍖�",
	    "230400": "楣ゅ矖甯�",
	    "230402": "鍚戦槼鍖�",
	    "230403": "宸ュ啘鍖�",
	    "230404": "鍗楀北鍖�",
	    "230405": "鍏村畨鍖�",
	    "230406": "涓滃北鍖�",
	    "230407": "鍏村北鍖�",
	    "230421": "钀濆寳鍘�",
	    "230422": "缁ユ花鍘�",
	    "230423": "鍏跺畠鍖�",
	    "230500": "鍙岄腑灞卞競",
	    "230502": "灏栧北鍖�",
	    "230503": "宀笢鍖�",
	    "230505": "鍥涙柟鍙板尯",
	    "230506": "瀹濆北鍖�",
	    "230521": "闆嗚搐鍘�",
	    "230522": "鍙嬭皧鍘�",
	    "230523": "瀹濇竻鍘�",
	    "230524": "楗舵渤鍘�",
	    "230525": "鍏跺畠鍖�",
	    "230600": "澶у簡甯�",
	    "230602": "钀ㄥ皵鍥惧尯",
	    "230603": "榫欏嚖鍖�",
	    "230604": "璁╄儭璺尯",
	    "230605": "绾㈠矖鍖�",
	    "230606": "澶у悓鍖�",
	    "230621": "鑲囧窞鍘�",
	    "230622": "鑲囨簮鍘�",
	    "230623": "鏋楃敻鍘�",
	    "230624": "鏉滃皵浼壒钂欏彜鏃忚嚜娌诲幙",
	    "230625": "鍏跺畠鍖�",
	    "230700": "浼婃槬甯�",
	    "230702": "浼婃槬鍖�",
	    "230703": "鍗楀矓鍖�",
	    "230704": "鍙嬪ソ鍖�",
	    "230705": "瑗挎灄鍖�",
	    "230706": "缈犲肠鍖�",
	    "230707": "鏂伴潚鍖�",
	    "230708": "缇庢邯鍖�",
	    "230709": "閲戝北灞尯",
	    "230710": "浜旇惀鍖�",
	    "230711": "涔岄┈娌冲尯",
	    "230712": "姹ゆ椇娌冲尯",
	    "230713": "甯﹀箔鍖�",
	    "230714": "涔屼紛宀尯",
	    "230715": "绾㈡槦鍖�",
	    "230716": "涓婄敇宀尯",
	    "230722": "鍢夎崼鍘�",
	    "230781": "閾佸姏甯�",
	    "230782": "鍏跺畠鍖�",
	    "230800": "浣虫湪鏂競",
	    "230803": "鍚戦槼鍖�",
	    "230804": "鍓嶈繘鍖�",
	    "230805": "涓滈鍖�",
	    "230811": "閮婂尯",
	    "230822": "妗﹀崡鍘�",
	    "230826": "妗﹀窛鍘�",
	    "230828": "姹ゅ師鍘�",
	    "230833": "鎶氳繙鍘�",
	    "230881": "鍚屾睙甯�",
	    "230882": "瀵岄敠甯�",
	    "230883": "鍏跺畠鍖�",
	    "230900": "涓冨彴娌冲競",
	    "230902": "鏂板叴鍖�",
	    "230903": "妗冨北鍖�",
	    "230904": "鑼勫瓙娌冲尯",
	    "230921": "鍕冨埄鍘�",
	    "230922": "鍏跺畠鍖�",
	    "231000": "鐗′腹姹熷競",
	    "231002": "涓滃畨鍖�",
	    "231003": "闃虫槑鍖�",
	    "231004": "鐖辨皯鍖�",
	    "231005": "瑗垮畨鍖�",
	    "231024": "涓滃畞鍘�",
	    "231025": "鏋楀彛鍘�",
	    "231081": "缁ヨ姮娌冲競",
	    "231083": "娴锋灄甯�",
	    "231084": "瀹佸畨甯�",
	    "231085": "绌嗘１甯�",
	    "231086": "鍏跺畠鍖�",
	    "231100": "榛戞渤甯�",
	    "231102": "鐖辫緣鍖�",
	    "231121": "瀚╂睙鍘�",
	    "231123": "閫婂厠鍘�",
	    "231124": "瀛欏惔鍘�",
	    "231181": "鍖楀畨甯�",
	    "231182": "浜斿ぇ杩炴睜甯�",
	    "231183": "鍏跺畠鍖�",
	    "231200": "缁ュ寲甯�",
	    "231202": "鍖楁灄鍖�",
	    "231221": "鏈涘鍘�",
	    "231222": "鍏拌タ鍘�",
	    "231223": "闈掑唸鍘�",
	    "231224": "搴嗗畨鍘�",
	    "231225": "鏄庢按鍘�",
	    "231226": "缁ユ１鍘�",
	    "231281": "瀹夎揪甯�",
	    "231282": "鑲囦笢甯�",
	    "231283": "娴蜂鸡甯�",
	    "231284": "鍏跺畠鍖�",
	    "232700": "澶у叴瀹夊箔鍦板尯",
	    "232702": "鏉惧箔鍖�",
	    "232703": "鏂版灄鍖�",
	    "232704": "鍛间腑鍖�",
	    "232721": "鍛肩帥鍘�",
	    "232722": "濉旀渤鍘�",
	    "232723": "婕犳渤鍘�",
	    "232724": "鍔犳牸杈惧鍖�",
	    "232725": "鍏跺畠鍖�",
	    "310000": "涓婃捣",
	    "310100": "涓婃捣甯�",
	    "310101": "榛勬郸鍖�",
	    "310104": "寰愭眹鍖�",
	    "310105": "闀垮畞鍖�",
	    "310106": "闈欏畨鍖�",
	    "310107": "鏅檧鍖�",
	    "310108": "闂稿寳鍖�",
	    "310109": "铏瑰彛鍖�",
	    "310110": "鏉ㄦ郸鍖�",
	    "310112": "闂佃鍖�",
	    "310113": "瀹濆北鍖�",
	    "310114": "鍢夊畾鍖�",
	    "310115": "娴︿笢鏂板尯",
	    "310116": "閲戝北鍖�",
	    "310117": "鏉炬睙鍖�",
	    "310118": "闈掓郸鍖�",
	    "310120": "濂夎搐鍖�",
	    "310230": "宕囨槑鍘�",
	    "310231": "鍏跺畠鍖�",
	    "320000": "姹熻嫃鐪�",
	    "320100": "鍗椾含甯�",
	    "320102": "鐜勬鍖�",
	    "320104": "绉︽樊鍖�",
	    "320105": "寤洪偤鍖�",
	    "320106": "榧撴ゼ鍖�",
	    "320111": "娴﹀彛鍖�",
	    "320113": "鏍栭湠鍖�",
	    "320114": "闆ㄨ姳鍙板尯",
	    "320115": "姹熷畞鍖�",
	    "320116": "鍏悎鍖�",
	    "320124": "婧ф按鍖�",
	    "320125": "楂樻烦鍖�",
	    "320126": "鍏跺畠鍖�",
	    "320200": "鏃犻敗甯�",
	    "320202": "宕囧畨鍖�",
	    "320203": "鍗楅暱鍖�",
	    "320204": "鍖楀鍖�",
	    "320205": "閿″北鍖�",
	    "320206": "鎯犲北鍖�",
	    "320211": "婊ㄦ箹鍖�",
	    "320281": "姹熼槾甯�",
	    "320282": "瀹滃叴甯�",
	    "320297": "鍏跺畠鍖�",
	    "320300": "寰愬窞甯�",
	    "320302": "榧撴ゼ鍖�",
	    "320303": "浜戦緳鍖�",
	    "320305": "璐炬豹鍖�",
	    "320311": "娉夊北鍖�",
	    "320321": "涓板幙",
	    "320322": "娌涘幙",
	    "320323": "閾滃北鍖�",
	    "320324": "鐫㈠畞鍘�",
	    "320381": "鏂版矀甯�",
	    "320382": "閭冲窞甯�",
	    "320383": "鍏跺畠鍖�",
	    "320400": "甯稿窞甯�",
	    "320402": "澶╁畞鍖�",
	    "320404": "閽熸ゼ鍖�",
	    "320405": "鎴氬鍫板尯",
	    "320411": "鏂板寳鍖�",
	    "320412": "姝﹁繘鍖�",
	    "320481": "婧ч槼甯�",
	    "320482": "閲戝潧甯�",
	    "320483": "鍏跺畠鍖�",
	    "320500": "鑻忓窞甯�",
	    "320505": "铏庝笜鍖�",
	    "320506": "鍚翠腑鍖�",
	    "320507": "鐩稿煄鍖�",
	    "320508": "濮戣嫃鍖�",
	    "320581": "甯哥啛甯�",
	    "320582": "寮犲娓競",
	    "320583": "鏄嗗北甯�",
	    "320584": "鍚存睙鍖�",
	    "320585": "澶粨甯�",
	    "320596": "鍏跺畠鍖�",
	    "320600": "鍗楅€氬競",
	    "320602": "宕囧窛鍖�",
	    "320611": "娓椄鍖�",
	    "320612": "閫氬窞鍖�",
	    "320621": "娴峰畨鍘�",
	    "320623": "濡備笢鍘�",
	    "320681": "鍚笢甯�",
	    "320682": "濡傜殝甯�",
	    "320684": "娴烽棬甯�",
	    "320694": "鍏跺畠鍖�",
	    "320700": "杩炰簯娓競",
	    "320703": "杩炰簯鍖�",
	    "320705": "鏂版郸鍖�",
	    "320706": "娴峰窞鍖�",
	    "320721": "璧ｆ鍘�",
	    "320722": "涓滄捣鍘�",
	    "320723": "鐏屼簯鍘�",
	    "320724": "鐏屽崡鍘�",
	    "320725": "鍏跺畠鍖�",
	    "320800": "娣畨甯�",
	    "320802": "娓呮渤鍖�",
	    "320803": "娣畨鍖�",
	    "320804": "娣槾鍖�",
	    "320811": "娓呮郸鍖�",
	    "320826": "娑熸按鍘�",
	    "320829": "娲辰鍘�",
	    "320830": "鐩辩湙鍘�",
	    "320831": "閲戞箹鍘�",
	    "320832": "鍏跺畠鍖�",
	    "320900": "鐩愬煄甯�",
	    "320902": "浜箹鍖�",
	    "320903": "鐩愰兘鍖�",
	    "320921": "鍝嶆按鍘�",
	    "320922": "婊ㄦ捣鍘�",
	    "320923": "闃滃畞鍘�",
	    "320924": "灏勯槼鍘�",
	    "320925": "寤烘箹鍘�",
	    "320981": "涓滃彴甯�",
	    "320982": "澶т赴甯�",
	    "320983": "鍏跺畠鍖�",
	    "321000": "鎵窞甯�",
	    "321002": "骞块櫟鍖�",
	    "321003": "閭楁睙鍖�",
	    "321023": "瀹濆簲鍘�",
	    "321081": "浠緛甯�",
	    "321084": "楂橀偖甯�",
	    "321088": "姹熼兘鍖�",
	    "321093": "鍏跺畠鍖�",
	    "321100": "闀囨睙甯�",
	    "321102": "浜彛鍖�",
	    "321111": "娑﹀窞鍖�",
	    "321112": "涓瑰緬鍖�",
	    "321181": "涓归槼甯�",
	    "321182": "鎵腑甯�",
	    "321183": "鍙ュ甯�",
	    "321184": "鍏跺畠鍖�",
	    "321200": "娉板窞甯�",
	    "321202": "娴烽櫟鍖�",
	    "321203": "楂樻腐鍖�",
	    "321281": "鍏村寲甯�",
	    "321282": "闈栨睙甯�",
	    "321283": "娉板叴甯�",
	    "321284": "濮滃牥鍖�",
	    "321285": "鍏跺畠鍖�",
	    "321300": "瀹胯縼甯�",
	    "321302": "瀹垮煄鍖�",
	    "321311": "瀹胯鲍鍖�",
	    "321322": "娌槼鍘�",
	    "321323": "娉楅槼鍘�",
	    "321324": "娉楁椽鍘�",
	    "321325": "鍏跺畠鍖�",
	    "330000": "娴欐睙鐪�",
	    "330100": "鏉窞甯�",
	    "330102": "涓婂煄鍖�",
	    "330103": "涓嬪煄鍖�",
	    "330104": "姹熷共鍖�",
	    "330105": "鎷卞鍖�",
	    "330106": "瑗挎箹鍖�",
	    "330108": "婊ㄦ睙鍖�",
	    "330109": "钀у北鍖�",
	    "330110": "浣欐澀鍖�",
	    "330122": "妗愬簮鍘�",
	    "330127": "娣冲畨鍘�",
	    "330182": "寤哄痉甯�",
	    "330183": "瀵岄槼甯�",
	    "330185": "涓村畨甯�",
	    "330186": "鍏跺畠鍖�",
	    "330200": "瀹佹尝甯�",
	    "330203": "娴锋洐鍖�",
	    "330204": "姹熶笢鍖�",
	    "330205": "姹熷寳鍖�",
	    "330206": "鍖椾粦鍖�",
	    "330211": "闀囨捣鍖�",
	    "330212": "閯炲窞鍖�",
	    "330225": "璞″北鍘�",
	    "330226": "瀹佹捣鍘�",
	    "330281": "浣欏甯�",
	    "330282": "鎱堟邯甯�",
	    "330283": "濂夊寲甯�",
	    "330284": "鍏跺畠鍖�",
	    "330300": "娓╁窞甯�",
	    "330302": "楣垮煄鍖�",
	    "330303": "榫欐咕鍖�",
	    "330304": "鐡捣鍖�",
	    "330322": "娲炲ご鍘�",
	    "330324": "姘稿槈鍘�",
	    "330326": "骞抽槼鍘�",
	    "330327": "鑻嶅崡鍘�",
	    "330328": "鏂囨垚鍘�",
	    "330329": "娉伴『鍘�",
	    "330381": "鐟炲畨甯�",
	    "330382": "涔愭竻甯�",
	    "330383": "鍏跺畠鍖�",
	    "330400": "鍢夊叴甯�",
	    "330402": "鍗楁箹鍖�",
	    "330411": "绉€娲插尯",
	    "330421": "鍢夊杽鍘�",
	    "330424": "娴风洂鍘�",
	    "330481": "娴峰畞甯�",
	    "330482": "骞虫箹甯�",
	    "330483": "妗愪埂甯�",
	    "330484": "鍏跺畠鍖�",
	    "330500": "婀栧窞甯�",
	    "330502": "鍚村叴鍖�",
	    "330503": "鍗楁禂鍖�",
	    "330521": "寰锋竻鍘�",
	    "330522": "闀垮叴鍘�",
	    "330523": "瀹夊悏鍘�",
	    "330524": "鍏跺畠鍖�",
	    "330600": "缁嶅叴甯�",
	    "330602": "瓒婂煄鍖�",
	    "330621": "缁嶅叴鍘�",
	    "330624": "鏂版槍鍘�",
	    "330681": "璇告毃甯�",
	    "330682": "涓婅櫈甯�",
	    "330683": "宓婂窞甯�",
	    "330684": "鍏跺畠鍖�",
	    "330700": "閲戝崕甯�",
	    "330702": "濠哄煄鍖�",
	    "330703": "閲戜笢鍖�",
	    "330723": "姝︿箟鍘�",
	    "330726": "娴︽睙鍘�",
	    "330727": "纾愬畨鍘�",
	    "330781": "鍏版邯甯�",
	    "330782": "涔変箤甯�",
	    "330783": "涓滈槼甯�",
	    "330784": "姘稿悍甯�",
	    "330785": "鍏跺畠鍖�",
	    "330800": "琛㈠窞甯�",
	    "330802": "鏌煄鍖�",
	    "330803": "琛㈡睙鍖�",
	    "330822": "甯稿北鍘�",
	    "330824": "寮€鍖栧幙",
	    "330825": "榫欐父鍘�",
	    "330881": "姹熷北甯�",
	    "330882": "鍏跺畠鍖�",
	    "330900": "鑸熷北甯�",
	    "330902": "瀹氭捣鍖�",
	    "330903": "鏅檧鍖�",
	    "330921": "宀卞北鍘�",
	    "330922": "宓婃硹鍘�",
	    "330923": "鍏跺畠鍖�",
	    "331000": "鍙板窞甯�",
	    "331002": "妞掓睙鍖�",
	    "331003": "榛勫博鍖�",
	    "331004": "璺ˉ鍖�",
	    "331021": "鐜夌幆鍘�",
	    "331022": "涓夐棬鍘�",
	    "331023": "澶╁彴鍘�",
	    "331024": "浠欏眳鍘�",
	    "331081": "娓╁箔甯�",
	    "331082": "涓存捣甯�",
	    "331083": "鍏跺畠鍖�",
	    "331100": "涓芥按甯�",
	    "331102": "鑾查兘鍖�",
	    "331121": "闈掔敯鍘�",
	    "331122": "缂欎簯鍘�",
	    "331123": "閬傛槍鍘�",
	    "331124": "鏉鹃槼鍘�",
	    "331125": "浜戝拰鍘�",
	    "331126": "搴嗗厓鍘�",
	    "331127": "鏅畞鐣叉棌鑷不鍘�",
	    "331181": "榫欐硥甯�",
	    "331182": "鍏跺畠鍖�",
	    "340000": "瀹夊窘鐪�",
	    "340100": "鍚堣偉甯�",
	    "340102": "鐟舵捣鍖�",
	    "340103": "搴愰槼鍖�",
	    "340104": "铚€灞卞尯",
	    "340111": "鍖呮渤鍖�",
	    "340121": "闀夸赴鍘�",
	    "340122": "鑲ヤ笢鍘�",
	    "340123": "鑲ヨタ鍘�",
	    "340192": "鍏跺畠鍖�",
	    "340200": "鑺滄箹甯�",
	    "340202": "闀滄箹鍖�",
	    "340203": "寮嬫睙鍖�",
	    "340207": "楦犳睙鍖�",
	    "340208": "涓夊北鍖�",
	    "340221": "鑺滄箹鍘�",
	    "340222": "绻佹槍鍘�",
	    "340223": "鍗楅櫟鍘�",
	    "340224": "鍏跺畠鍖�",
	    "340300": "铓屽煚甯�",
	    "340302": "榫欏瓙婀栧尯",
	    "340303": "铓屽北鍖�",
	    "340304": "绂逛細鍖�",
	    "340311": "娣笂鍖�",
	    "340321": "鎬€杩滃幙",
	    "340322": "浜旀渤鍘�",
	    "340323": "鍥洪晣鍘�",
	    "340324": "鍏跺畠鍖�",
	    "340400": "娣崡甯�",
	    "340402": "澶ч€氬尯",
	    "340403": "鐢板搴靛尯",
	    "340404": "璋㈠闆嗗尯",
	    "340405": "鍏叕灞卞尯",
	    "340406": "娼橀泦鍖�",
	    "340421": "鍑ゅ彴鍘�",
	    "340422": "鍏跺畠鍖�",
	    "340500": "椹瀺灞卞競",
	    "340503": "鑺卞北鍖�",
	    "340504": "闆ㄥ北鍖�",
	    "340506": "鍗氭湜鍖�",
	    "340521": "褰撴秱鍘�",
	    "340522": "鍏跺畠鍖�",
	    "340600": "娣寳甯�",
	    "340602": "鏉滈泦鍖�",
	    "340603": "鐩稿北鍖�",
	    "340604": "鐑堝北鍖�",
	    "340621": "婵夋邯鍘�",
	    "340622": "鍏跺畠鍖�",
	    "340700": "閾滈櫟甯�",
	    "340702": "閾滃畼灞卞尯",
	    "340703": "鐙瓙灞卞尯",
	    "340711": "閮婂尯",
	    "340721": "閾滈櫟鍘�",
	    "340722": "鍏跺畠鍖�",
	    "340800": "瀹夊簡甯�",
	    "340802": "杩庢睙鍖�",
	    "340803": "澶ц鍖�",
	    "340811": "瀹滅鍖�",
	    "340822": "鎬€瀹佸幙",
	    "340823": "鏋為槼鍘�",
	    "340824": "娼滃北鍘�",
	    "340825": "澶箹鍘�",
	    "340826": "瀹挎澗鍘�",
	    "340827": "鏈涙睙鍘�",
	    "340828": "宀宠タ鍘�",
	    "340881": "妗愬煄甯�",
	    "340882": "鍏跺畠鍖�",
	    "341000": "榛勫北甯�",
	    "341002": "灞邯鍖�",
	    "341003": "榛勫北鍖�",
	    "341004": "寰藉窞鍖�",
	    "341021": "姝欏幙",
	    "341022": "浼戝畞鍘�",
	    "341023": "榛熷幙",
	    "341024": "绁侀棬鍘�",
	    "341025": "鍏跺畠鍖�",
	    "341100": "婊佸窞甯�",
	    "341102": "鐞呯悐鍖�",
	    "341103": "鍗楄隘鍖�",
	    "341122": "鏉ュ畨鍘�",
	    "341124": "鍏ㄦ鍘�",
	    "341125": "瀹氳繙鍘�",
	    "341126": "鍑ら槼鍘�",
	    "341181": "澶╅暱甯�",
	    "341182": "鏄庡厜甯�",
	    "341183": "鍏跺畠鍖�",
	    "341200": "闃滈槼甯�",
	    "341202": "棰嶅窞鍖�",
	    "341203": "棰嶄笢鍖�",
	    "341204": "棰嶆硥鍖�",
	    "341221": "涓存硥鍘�",
	    "341222": "澶拰鍘�",
	    "341225": "闃滃崡鍘�",
	    "341226": "棰嶄笂鍘�",
	    "341282": "鐣岄甯�",
	    "341283": "鍏跺畠鍖�",
	    "341300": "瀹垮窞甯�",
	    "341302": "鍩囨ˉ鍖�",
	    "341321": "鐮€灞卞幙",
	    "341322": "钀у幙",
	    "341323": "鐏电挧鍘�",
	    "341324": "娉楀幙",
	    "341325": "鍏跺畠鍖�",
	    "341400": "宸㈡箹甯�",
	    "341421": "搴愭睙鍘�",
	    "341422": "鏃犱负鍘�",
	    "341423": "鍚北鍘�",
	    "341424": "鍜屽幙",
	    "341500": "鍏畨甯�",
	    "341502": "閲戝畨鍖�",
	    "341503": "瑁曞畨鍖�",
	    "341521": "瀵垮幙",
	    "341522": "闇嶉偙鍘�",
	    "341523": "鑸掑煄鍘�",
	    "341524": "閲戝鍘�",
	    "341525": "闇嶅北鍘�",
	    "341526": "鍏跺畠鍖�",
	    "341600": "浜冲窞甯�",
	    "341602": "璋煄鍖�",
	    "341621": "娑￠槼鍘�",
	    "341622": "钂欏煄鍘�",
	    "341623": "鍒╄緵鍘�",
	    "341624": "鍏跺畠鍖�",
	    "341700": "姹犲窞甯�",
	    "341702": "璐垫睜鍖�",
	    "341721": "涓滆嚦鍘�",
	    "341722": "鐭冲彴鍘�",
	    "341723": "闈掗槼鍘�",
	    "341724": "鍏跺畠鍖�",
	    "341800": "瀹ｅ煄甯�",
	    "341802": "瀹ｅ窞鍖�",
	    "341821": "閮庢邯鍘�",
	    "341822": "骞垮痉鍘�",
	    "341823": "娉惧幙",
	    "341824": "缁╂邯鍘�",
	    "341825": "鏃屽痉鍘�",
	    "341881": "瀹佸浗甯�",
	    "341882": "鍏跺畠鍖�",
	    "350000": "绂忓缓鐪�",
	    "350100": "绂忓窞甯�",
	    "350102": "榧撴ゼ鍖�",
	    "350103": "鍙版睙鍖�",
	    "350104": "浠撳北鍖�",
	    "350105": "椹熬鍖�",
	    "350111": "鏅嬪畨鍖�",
	    "350121": "闂戒警鍘�",
	    "350122": "杩炴睙鍘�",
	    "350123": "缃楁簮鍘�",
	    "350124": "闂芥竻鍘�",
	    "350125": "姘告嘲鍘�",
	    "350128": "骞虫江鍘�",
	    "350181": "绂忔竻甯�",
	    "350182": "闀夸箰甯�",
	    "350183": "鍏跺畠鍖�",
	    "350200": "鍘﹂棬甯�",
	    "350203": "鎬濇槑鍖�",
	    "350205": "娴锋钵鍖�",
	    "350206": "婀栭噷鍖�",
	    "350211": "闆嗙編鍖�",
	    "350212": "鍚屽畨鍖�",
	    "350213": "缈斿畨鍖�",
	    "350214": "鍏跺畠鍖�",
	    "350300": "鑾嗙敯甯�",
	    "350302": "鍩庡帰鍖�",
	    "350303": "娑垫睙鍖�",
	    "350304": "鑽斿煄鍖�",
	    "350305": "绉€灞垮尯",
	    "350322": "浠欐父鍘�",
	    "350323": "鍏跺畠鍖�",
	    "350400": "涓夋槑甯�",
	    "350402": "姊呭垪鍖�",
	    "350403": "涓夊厓鍖�",
	    "350421": "鏄庢邯鍘�",
	    "350423": "娓呮祦鍘�",
	    "350424": "瀹佸寲鍘�",
	    "350425": "澶х敯鍘�",
	    "350426": "灏ゆ邯鍘�",
	    "350427": "娌欏幙",
	    "350428": "灏嗕箰鍘�",
	    "350429": "娉板畞鍘�",
	    "350430": "寤哄畞鍘�",
	    "350481": "姘稿畨甯�",
	    "350482": "鍏跺畠鍖�",
	    "350500": "娉夊窞甯�",
	    "350502": "椴ゅ煄鍖�",
	    "350503": "涓版辰鍖�",
	    "350504": "娲涙睙鍖�",
	    "350505": "娉夋腐鍖�",
	    "350521": "鎯犲畨鍘�",
	    "350524": "瀹夋邯鍘�",
	    "350525": "姘告槬鍘�",
	    "350526": "寰峰寲鍘�",
	    "350527": "閲戦棬鍘�",
	    "350581": "鐭崇嫯甯�",
	    "350582": "鏅嬫睙甯�",
	    "350583": "鍗楀畨甯�",
	    "350584": "鍏跺畠鍖�",
	    "350600": "婕冲窞甯�",
	    "350602": "鑺楀煄鍖�",
	    "350603": "榫欐枃鍖�",
	    "350622": "浜戦渼鍘�",
	    "350623": "婕虫郸鍘�",
	    "350624": "璇忓畨鍘�",
	    "350625": "闀挎嘲鍘�",
	    "350626": "涓滃北鍘�",
	    "350627": "鍗楅潠鍘�",
	    "350628": "骞冲拰鍘�",
	    "350629": "鍗庡畨鍘�",
	    "350681": "榫欐捣甯�",
	    "350682": "鍏跺畠鍖�",
	    "350700": "鍗楀钩甯�",
	    "350702": "寤跺钩鍖�",
	    "350721": "椤烘槍鍘�",
	    "350722": "娴﹀煄鍘�",
	    "350723": "鍏夋辰鍘�",
	    "350724": "鏉炬邯鍘�",
	    "350725": "鏀垮拰鍘�",
	    "350781": "閭垫甯�",
	    "350782": "姝﹀し灞卞競",
	    "350783": "寤虹摨甯�",
	    "350784": "寤洪槼甯�",
	    "350785": "鍏跺畠鍖�",
	    "350800": "榫欏博甯�",
	    "350802": "鏂扮綏鍖�",
	    "350821": "闀挎眬鍘�",
	    "350822": "姘稿畾鍘�",
	    "350823": "涓婃澀鍘�",
	    "350824": "姝﹀钩鍘�",
	    "350825": "杩炲煄鍘�",
	    "350881": "婕冲钩甯�",
	    "350882": "鍏跺畠鍖�",
	    "350900": "瀹佸痉甯�",
	    "350902": "钑夊煄鍖�",
	    "350921": "闇炴郸鍘�",
	    "350922": "鍙ょ敯鍘�",
	    "350923": "灞忓崡鍘�",
	    "350924": "瀵垮畞鍘�",
	    "350925": "鍛ㄥ畞鍘�",
	    "350926": "鏌樿崳鍘�",
	    "350981": "绂忓畨甯�",
	    "350982": "绂忛紟甯�",
	    "350983": "鍏跺畠鍖�",
	    "360000": "姹熻タ鐪�",
	    "360100": "鍗楁槍甯�",
	    "360102": "涓滄箹鍖�",
	    "360103": "瑗挎箹鍖�",
	    "360104": "闈掍簯璋卞尯",
	    "360105": "婀鹃噷鍖�",
	    "360111": "闈掑北婀栧尯",
	    "360121": "鍗楁槍鍘�",
	    "360122": "鏂板缓鍘�",
	    "360123": "瀹変箟鍘�",
	    "360124": "杩涜搐鍘�",
	    "360128": "鍏跺畠鍖�",
	    "360200": "鏅痉闀囧競",
	    "360202": "鏄屾睙鍖�",
	    "360203": "鐝犲北鍖�",
	    "360222": "娴鍘�",
	    "360281": "涔愬钩甯�",
	    "360282": "鍏跺畠鍖�",
	    "360300": "钀嶄埂甯�",
	    "360302": "瀹夋簮鍖�",
	    "360313": "婀樹笢鍖�",
	    "360321": "鑾茶姳鍘�",
	    "360322": "涓婃牀鍘�",
	    "360323": "鑺︽邯鍘�",
	    "360324": "鍏跺畠鍖�",
	    "360400": "涔濇睙甯�",
	    "360402": "搴愬北鍖�",
	    "360403": "娴旈槼鍖�",
	    "360421": "涔濇睙鍘�",
	    "360423": "姝﹀畞鍘�",
	    "360424": "淇按鍘�",
	    "360425": "姘镐慨鍘�",
	    "360426": "寰峰畨鍘�",
	    "360427": "鏄熷瓙鍘�",
	    "360428": "閮芥槍鍘�",
	    "360429": "婀栧彛鍘�",
	    "360430": "褰辰鍘�",
	    "360481": "鐟炴槍甯�",
	    "360482": "鍏跺畠鍖�",
	    "360483": "鍏遍潚鍩庡競",
	    "360500": "鏂颁綑甯�",
	    "360502": "娓濇按鍖�",
	    "360521": "鍒嗗疁鍘�",
	    "360522": "鍏跺畠鍖�",
	    "360600": "楣版江甯�",
	    "360602": "鏈堟箹鍖�",
	    "360622": "浣欐睙鍘�",
	    "360681": "璐垫邯甯�",
	    "360682": "鍏跺畠鍖�",
	    "360700": "璧ｅ窞甯�",
	    "360702": "绔犺础鍖�",
	    "360721": "璧ｅ幙",
	    "360722": "淇′赴鍘�",
	    "360723": "澶т綑鍘�",
	    "360724": "涓婄姽鍘�",
	    "360725": "宕囦箟鍘�",
	    "360726": "瀹夎繙鍘�",
	    "360727": "榫欏崡鍘�",
	    "360728": "瀹氬崡鍘�",
	    "360729": "鍏ㄥ崡鍘�",
	    "360730": "瀹侀兘鍘�",
	    "360731": "浜庨兘鍘�",
	    "360732": "鍏村浗鍘�",
	    "360733": "浼氭槍鍘�",
	    "360734": "瀵讳箤鍘�",
	    "360735": "鐭冲煄鍘�",
	    "360781": "鐟為噾甯�",
	    "360782": "鍗楀悍甯�",
	    "360783": "鍏跺畠鍖�",
	    "360800": "鍚夊畨甯�",
	    "360802": "鍚夊窞鍖�",
	    "360803": "闈掑師鍖�",
	    "360821": "鍚夊畨鍘�",
	    "360822": "鍚夋按鍘�",
	    "360823": "宄℃睙鍘�",
	    "360824": "鏂板共鍘�",
	    "360825": "姘镐赴鍘�",
	    "360826": "娉板拰鍘�",
	    "360827": "閬傚窛鍘�",
	    "360828": "涓囧畨鍘�",
	    "360829": "瀹夌鍘�",
	    "360830": "姘告柊鍘�",
	    "360881": "浜曞唸灞卞競",
	    "360882": "鍏跺畠鍖�",
	    "360900": "瀹滄槬甯�",
	    "360902": "琚佸窞鍖�",
	    "360921": "濂夋柊鍘�",
	    "360922": "涓囪浇鍘�",
	    "360923": "涓婇珮鍘�",
	    "360924": "瀹滀赴鍘�",
	    "360925": "闈栧畨鍘�",
	    "360926": "閾滈紦鍘�",
	    "360981": "涓板煄甯�",
	    "360982": "妯熸爲甯�",
	    "360983": "楂樺畨甯�",
	    "360984": "鍏跺畠鍖�",
	    "361000": "鎶氬窞甯�",
	    "361002": "涓村窛鍖�",
	    "361021": "鍗楀煄鍘�",
	    "361022": "榛庡窛鍘�",
	    "361023": "鍗椾赴鍘�",
	    "361024": "宕囦粊鍘�",
	    "361025": "涔愬畨鍘�",
	    "361026": "瀹滈粍鍘�",
	    "361027": "閲戞邯鍘�",
	    "361028": "璧勬邯鍘�",
	    "361029": "涓滀埂鍘�",
	    "361030": "骞挎槍鍘�",
	    "361031": "鍏跺畠鍖�",
	    "361100": "涓婇ザ甯�",
	    "361102": "淇″窞鍖�",
	    "361121": "涓婇ザ鍘�",
	    "361122": "骞夸赴鍘�",
	    "361123": "鐜夊北鍘�",
	    "361124": "閾呭北鍘�",
	    "361125": "妯嘲鍘�",
	    "361126": "寮嬮槼鍘�",
	    "361127": "浣欏共鍘�",
	    "361128": "閯遍槼鍘�",
	    "361129": "涓囧勾鍘�",
	    "361130": "濠烘簮鍘�",
	    "361181": "寰峰叴甯�",
	    "361182": "鍏跺畠鍖�",
	    "370000": "灞变笢鐪�",
	    "370100": "娴庡崡甯�",
	    "370102": "鍘嗕笅鍖�",
	    "370103": "甯備腑鍖�",
	    "370104": "妲愯崼鍖�",
	    "370105": "澶╂ˉ鍖�",
	    "370112": "鍘嗗煄鍖�",
	    "370113": "闀挎竻鍖�",
	    "370124": "骞抽槾鍘�",
	    "370125": "娴庨槼鍘�",
	    "370126": "鍟嗘渤鍘�",
	    "370181": "绔犱笜甯�",
	    "370182": "鍏跺畠鍖�",
	    "370200": "闈掑矝甯�",
	    "370202": "甯傚崡鍖�",
	    "370203": "甯傚寳鍖�",
	    "370211": "榛勫矝鍖�",
	    "370212": "宕傚北鍖�",
	    "370213": "鏉庢钵鍖�",
	    "370214": "鍩庨槼鍖�",
	    "370281": "鑳跺窞甯�",
	    "370282": "鍗冲ⅷ甯�",
	    "370283": "骞冲害甯�",
	    "370285": "鑾辫タ甯�",
	    "370286": "鍏跺畠鍖�",
	    "370300": "娣勫崥甯�",
	    "370302": "娣勫窛鍖�",
	    "370303": "寮犲簵鍖�",
	    "370304": "鍗氬北鍖�",
	    "370305": "涓存穭鍖�",
	    "370306": "鍛ㄦ潙鍖�",
	    "370321": "妗撳彴鍘�",
	    "370322": "楂橀潚鍘�",
	    "370323": "娌傛簮鍘�",
	    "370324": "鍏跺畠鍖�",
	    "370400": "鏋ｅ簞甯�",
	    "370402": "甯備腑鍖�",
	    "370403": "钖涘煄鍖�",
	    "370404": "宄勫煄鍖�",
	    "370405": "鍙板効搴勫尯",
	    "370406": "灞变涵鍖�",
	    "370481": "婊曞窞甯�",
	    "370482": "鍏跺畠鍖�",
	    "370500": "涓滆惀甯�",
	    "370502": "涓滆惀鍖�",
	    "370503": "娌冲彛鍖�",
	    "370521": "鍨﹀埄鍘�",
	    "370522": "鍒╂触鍘�",
	    "370523": "骞块ザ鍘�",
	    "370591": "鍏跺畠鍖�",
	    "370600": "鐑熷彴甯�",
	    "370602": "鑺濈綐鍖�",
	    "370611": "绂忓北鍖�",
	    "370612": "鐗熷钩鍖�",
	    "370613": "鑾卞北鍖�",
	    "370634": "闀垮矝鍘�",
	    "370681": "榫欏彛甯�",
	    "370682": "鑾遍槼甯�",
	    "370683": "鑾卞窞甯�",
	    "370684": "钃幈甯�",
	    "370685": "鎷涜繙甯�",
	    "370686": "鏍栭湠甯�",
	    "370687": "娴烽槼甯�",
	    "370688": "鍏跺畠鍖�",
	    "370700": "娼嶅潑甯�",
	    "370702": "娼嶅煄鍖�",
	    "370703": "瀵掍涵鍖�",
	    "370704": "鍧婂瓙鍖�",
	    "370705": "濂庢枃鍖�",
	    "370724": "涓存湊鍘�",
	    "370725": "鏄屼箰鍘�",
	    "370781": "闈掑窞甯�",
	    "370782": "璇稿煄甯�",
	    "370783": "瀵垮厜甯�",
	    "370784": "瀹変笜甯�",
	    "370785": "楂樺瘑甯�",
	    "370786": "鏄岄倯甯�",
	    "370787": "鍏跺畠鍖�",
	    "370800": "娴庡畞甯�",
	    "370802": "甯備腑鍖�",
	    "370811": "浠诲煄鍖�",
	    "370826": "寰北鍘�",
	    "370827": "楸煎彴鍘�",
	    "370828": "閲戜埂鍘�",
	    "370829": "鍢夌ゥ鍘�",
	    "370830": "姹朵笂鍘�",
	    "370831": "娉楁按鍘�",
	    "370832": "姊佸北鍘�",
	    "370881": "鏇查槣甯�",
	    "370882": "鍏栧窞甯�",
	    "370883": "閭瑰煄甯�",
	    "370884": "鍏跺畠鍖�",
	    "370900": "娉板畨甯�",
	    "370902": "娉板北鍖�",
	    "370903": "宀卞渤鍖�",
	    "370921": "瀹侀槼鍘�",
	    "370923": "涓滃钩鍘�",
	    "370982": "鏂版嘲甯�",
	    "370983": "鑲ュ煄甯�",
	    "370984": "鍏跺畠鍖�",
	    "371000": "濞佹捣甯�",
	    "371002": "鐜繝鍖�",
	    "371081": "鏂囩櫥甯�",
	    "371082": "鑽ｆ垚甯�",
	    "371083": "涔冲北甯�",
	    "371084": "鍏跺畠鍖�",
	    "371100": "鏃ョ収甯�",
	    "371102": "涓滄腐鍖�",
	    "371103": "宀氬北鍖�",
	    "371121": "浜旇幉鍘�",
	    "371122": "鑾掑幙",
	    "371123": "鍏跺畠鍖�",
	    "371200": "鑾辫姕甯�",
	    "371202": "鑾卞煄鍖�",
	    "371203": "閽㈠煄鍖�",
	    "371204": "鍏跺畠鍖�",
	    "371300": "涓存矀甯�",
	    "371302": "鍏板北鍖�",
	    "371311": "缃楀簞鍖�",
	    "371312": "娌充笢鍖�",
	    "371321": "娌傚崡鍘�",
	    "371322": "閮煄鍘�",
	    "371323": "娌傛按鍘�",
	    "371324": "鑻嶅北鍘�",
	    "371325": "璐瑰幙",
	    "371326": "骞抽倯鍘�",
	    "371327": "鑾掑崡鍘�",
	    "371328": "钂欓槾鍘�",
	    "371329": "涓存箔鍘�",
	    "371330": "鍏跺畠鍖�",
	    "371400": "寰峰窞甯�",
	    "371402": "寰峰煄鍖�",
	    "371421": "闄靛幙",
	    "371422": "瀹佹触鍘�",
	    "371423": "搴嗕簯鍘�",
	    "371424": "涓撮倯鍘�",
	    "371425": "榻愭渤鍘�",
	    "371426": "骞冲師鍘�",
	    "371427": "澶忔触鍘�",
	    "371428": "姝﹀煄鍘�",
	    "371481": "涔愰櫟甯�",
	    "371482": "绂瑰煄甯�",
	    "371483": "鍏跺畠鍖�",
	    "371500": "鑱婂煄甯�",
	    "371502": "涓滄槍搴滃尯",
	    "371521": "闃宠胺鍘�",
	    "371522": "鑾樺幙",
	    "371523": "鑼屽钩鍘�",
	    "371524": "涓滈樋鍘�",
	    "371525": "鍐犲幙",
	    "371526": "楂樺攼鍘�",
	    "371581": "涓存竻甯�",
	    "371582": "鍏跺畠鍖�",
	    "371600": "婊ㄥ窞甯�",
	    "371602": "婊ㄥ煄鍖�",
	    "371621": "鎯犳皯鍘�",
	    "371622": "闃充俊鍘�",
	    "371623": "鏃犳＃鍘�",
	    "371624": "娌惧寲鍘�",
	    "371625": "鍗氬叴鍘�",
	    "371626": "閭瑰钩鍘�",
	    "371627": "鍏跺畠鍖�",
	    "371700": "鑿忔辰甯�",
	    "371702": "鐗′腹鍖�",
	    "371721": "鏇瑰幙",
	    "371722": "鍗曞幙",
	    "371723": "鎴愭鍘�",
	    "371724": "宸ㄩ噹鍘�",
	    "371725": "閮撳煄鍘�",
	    "371726": "閯勫煄鍘�",
	    "371727": "瀹氶櫠鍘�",
	    "371728": "涓滄槑鍘�",
	    "371729": "鍏跺畠鍖�",
	    "410000": "娌冲崡鐪�",
	    "410100": "閮戝窞甯�",
	    "410102": "涓師鍖�",
	    "410103": "浜屼竷鍖�",
	    "410104": "绠″煄鍥炴棌鍖�",
	    "410105": "閲戞按鍖�",
	    "410106": "涓婅鍖�",
	    "410108": "鎯犳祹鍖�",
	    "410122": "涓墴鍘�",
	    "410181": "宸╀箟甯�",
	    "410182": "鑽ラ槼甯�",
	    "410183": "鏂板瘑甯�",
	    "410184": "鏂伴儜甯�",
	    "410185": "鐧诲皝甯�",
	    "410188": "鍏跺畠鍖�",
	    "410200": "寮€灏佸競",
	    "410202": "榫欎涵鍖�",
	    "410203": "椤烘渤鍥炴棌鍖�",
	    "410204": "榧撴ゼ鍖�",
	    "410205": "绂圭帇鍙板尯",
	    "410211": "閲戞槑鍖�",
	    "410221": "鏉炲幙",
	    "410222": "閫氳鍘�",
	    "410223": "灏夋皬鍘�",
	    "410224": "寮€灏佸幙",
	    "410225": "鍏拌€冨幙",
	    "410226": "鍏跺畠鍖�",
	    "410300": "娲涢槼甯�",
	    "410302": "鑰佸煄鍖�",
	    "410303": "瑗垮伐鍖�",
	    "410304": "鐎嶆渤鍥炴棌鍖�",
	    "410305": "娑цタ鍖�",
	    "410306": "鍚夊埄鍖�",
	    "410307": "娲涢緳鍖�",
	    "410322": "瀛熸触鍘�",
	    "410323": "鏂板畨鍘�",
	    "410324": "鏍惧窛鍘�",
	    "410325": "宓╁幙",
	    "410326": "姹濋槼鍘�",
	    "410327": "瀹滈槼鍘�",
	    "410328": "娲涘畞鍘�",
	    "410329": "浼婂窛鍘�",
	    "410381": "鍋冨笀甯�",
	    "410400": "骞抽《灞卞競",
	    "410402": "鏂板崕鍖�",
	    "410403": "鍗笢鍖�",
	    "410404": "鐭抽緳鍖�",
	    "410411": "婀涙渤鍖�",
	    "410421": "瀹濅赴鍘�",
	    "410422": "鍙跺幙",
	    "410423": "椴佸北鍘�",
	    "410425": "閮忓幙",
	    "410481": "鑸為挗甯�",
	    "410482": "姹濆窞甯�",
	    "410483": "鍏跺畠鍖�",
	    "410500": "瀹夐槼甯�",
	    "410502": "鏂囧嘲鍖�",
	    "410503": "鍖楀叧鍖�",
	    "410505": "娈烽兘鍖�",
	    "410506": "榫欏畨鍖�",
	    "410522": "瀹夐槼鍘�",
	    "410523": "姹ら槾鍘�",
	    "410526": "婊戝幙",
	    "410527": "鍐呴粍鍘�",
	    "410581": "鏋楀窞甯�",
	    "410582": "鍏跺畠鍖�",
	    "410600": "楣ゅ甯�",
	    "410602": "楣ゅ北鍖�",
	    "410603": "灞卞煄鍖�",
	    "410611": "娣囨花鍖�",
	    "410621": "娴氬幙",
	    "410622": "娣囧幙",
	    "410623": "鍏跺畠鍖�",
	    "410700": "鏂颁埂甯�",
	    "410702": "绾㈡棗鍖�",
	    "410703": "鍗花鍖�",
	    "410704": "鍑ゆ硥鍖�",
	    "410711": "鐗ч噹鍖�",
	    "410721": "鏂颁埂鍘�",
	    "410724": "鑾峰槈鍘�",
	    "410725": "鍘熼槼鍘�",
	    "410726": "寤舵触鍘�",
	    "410727": "灏佷笜鍘�",
	    "410728": "闀垮灒鍘�",
	    "410781": "鍗緣甯�",
	    "410782": "杈夊幙甯�",
	    "410783": "鍏跺畠鍖�",
	    "410800": "鐒︿綔甯�",
	    "410802": "瑙ｆ斁鍖�",
	    "410803": "涓珯鍖�",
	    "410804": "椹潙鍖�",
	    "410811": "灞遍槼鍖�",
	    "410821": "淇鍘�",
	    "410822": "鍗氱埍鍘�",
	    "410823": "姝﹂櫉鍘�",
	    "410825": "娓╁幙",
	    "410881": "娴庢簮甯�",
	    "410882": "娌侀槼甯�",
	    "410883": "瀛熷窞甯�",
	    "410884": "鍏跺畠鍖�",
	    "410900": "婵槼甯�",
	    "410902": "鍗庨緳鍖�",
	    "410922": "娓呬赴鍘�",
	    "410923": "鍗椾箰鍘�",
	    "410926": "鑼冨幙",
	    "410927": "鍙板墠鍘�",
	    "410928": "婵槼鍘�",
	    "410929": "鍏跺畠鍖�",
	    "411000": "璁告槍甯�",
	    "411002": "榄忛兘鍖�",
	    "411023": "璁告槍鍘�",
	    "411024": "閯㈤櫟鍘�",
	    "411025": "瑗勫煄鍘�",
	    "411081": "绂瑰窞甯�",
	    "411082": "闀胯憶甯�",
	    "411083": "鍏跺畠鍖�",
	    "411100": "婕渤甯�",
	    "411102": "婧愭眹鍖�",
	    "411103": "閮惧煄鍖�",
	    "411104": "鍙櫟鍖�",
	    "411121": "鑸為槼鍘�",
	    "411122": "涓撮鍘�",
	    "411123": "鍏跺畠鍖�",
	    "411200": "涓夐棬宄″競",
	    "411202": "婀栨花鍖�",
	    "411221": "娓戞睜鍘�",
	    "411222": "闄曞幙",
	    "411224": "鍗㈡皬鍘�",
	    "411281": "涔夐┈甯�",
	    "411282": "鐏靛疂甯�",
	    "411283": "鍏跺畠鍖�",
	    "411300": "鍗楅槼甯�",
	    "411302": "瀹涘煄鍖�",
	    "411303": "鍗ч緳鍖�",
	    "411321": "鍗楀彫鍘�",
	    "411322": "鏂瑰煄鍘�",
	    "411323": "瑗垮场鍘�",
	    "411324": "闀囧钩鍘�",
	    "411325": "鍐呬埂鍘�",
	    "411326": "娣呭窛鍘�",
	    "411327": "绀炬棗鍘�",
	    "411328": "鍞愭渤鍘�",
	    "411329": "鏂伴噹鍘�",
	    "411330": "妗愭煆鍘�",
	    "411381": "閭撳窞甯�",
	    "411382": "鍏跺畠鍖�",
	    "411400": "鍟嗕笜甯�",
	    "411402": "姊佸洯鍖�",
	    "411403": "鐫㈤槼鍖�",
	    "411421": "姘戞潈鍘�",
	    "411422": "鐫㈠幙",
	    "411423": "瀹侀櫟鍘�",
	    "411424": "鏌樺煄鍘�",
	    "411425": "铏炲煄鍘�",
	    "411426": "澶忛倯鍘�",
	    "411481": "姘稿煄甯�",
	    "411482": "鍏跺畠鍖�",
	    "411500": "淇￠槼甯�",
	    "411502": "娴夋渤鍖�",
	    "411503": "骞虫ˉ鍖�",
	    "411521": "缃楀北鍘�",
	    "411522": "鍏夊北鍘�",
	    "411523": "鏂板幙",
	    "411524": "鍟嗗煄鍘�",
	    "411525": "鍥哄鍘�",
	    "411526": "娼㈠窛鍘�",
	    "411527": "娣花鍘�",
	    "411528": "鎭幙",
	    "411529": "鍏跺畠鍖�",
	    "411600": "鍛ㄥ彛甯�",
	    "411602": "宸濇眹鍖�",
	    "411621": "鎵舵矡鍘�",
	    "411622": "瑗垮崕鍘�",
	    "411623": "鍟嗘按鍘�",
	    "411624": "娌堜笜鍘�",
	    "411625": "閮稿煄鍘�",
	    "411626": "娣槼鍘�",
	    "411627": "澶悍鍘�",
	    "411628": "楣块倯鍘�",
	    "411681": "椤瑰煄甯�",
	    "411682": "鍏跺畠鍖�",
	    "411700": "椹婚┈搴楀競",
	    "411702": "椹垮煄鍖�",
	    "411721": "瑗垮钩鍘�",
	    "411722": "涓婅敗鍘�",
	    "411723": "骞宠垎鍘�",
	    "411724": "姝ｉ槼鍘�",
	    "411725": "纭北鍘�",
	    "411726": "娉岄槼鍘�",
	    "411727": "姹濆崡鍘�",
	    "411728": "閬傚钩鍘�",
	    "411729": "鏂拌敗鍘�",
	    "411730": "鍏跺畠鍖�",
	    "420000": "婀栧寳鐪�",
	    "420100": "姝︽眽甯�",
	    "420102": "姹熷哺鍖�",
	    "420103": "姹熸眽鍖�",
	    "420104": "纭氬彛鍖�",
	    "420105": "姹夐槼鍖�",
	    "420106": "姝︽槍鍖�",
	    "420107": "闈掑北鍖�",
	    "420111": "娲北鍖�",
	    "420112": "涓滆タ婀栧尯",
	    "420113": "姹夊崡鍖�",
	    "420114": "钄＄敻鍖�",
	    "420115": "姹熷鍖�",
	    "420116": "榛勯檪鍖�",
	    "420117": "鏂版床鍖�",
	    "420118": "鍏跺畠鍖�",
	    "420200": "榛勭煶甯�",
	    "420202": "榛勭煶娓尯",
	    "420203": "瑗垮灞卞尯",
	    "420204": "涓嬮檰鍖�",
	    "420205": "閾佸北鍖�",
	    "420222": "闃虫柊鍘�",
	    "420281": "澶у喍甯�",
	    "420282": "鍏跺畠鍖�",
	    "420300": "鍗佸牥甯�",
	    "420302": "鑼呯鍖�",
	    "420303": "寮犳咕鍖�",
	    "420321": "閮у幙",
	    "420322": "閮цタ鍘�",
	    "420323": "绔瑰北鍘�",
	    "420324": "绔规邯鍘�",
	    "420325": "鎴垮幙",
	    "420381": "涓规睙鍙ｅ競",
	    "420383": "鍏跺畠鍖�",
	    "420500": "瀹滄槍甯�",
	    "420502": "瑗块櫟鍖�",
	    "420503": "浼嶅宀楀尯",
	    "420504": "鐐瑰啗鍖�",
	    "420505": "鐚囦涵鍖�",
	    "420506": "澶烽櫟鍖�",
	    "420525": "杩滃畨鍘�",
	    "420526": "鍏村北鍘�",
	    "420527": "绉綊鍘�",
	    "420528": "闀块槼鍦熷鏃忚嚜娌诲幙",
	    "420529": "浜斿嘲鍦熷鏃忚嚜娌诲幙",
	    "420581": "瀹滈兘甯�",
	    "420582": "褰撻槼甯�",
	    "420583": "鏋濇睙甯�",
	    "420584": "鍏跺畠鍖�",
	    "420600": "瑗勯槼甯�",
	    "420602": "瑗勫煄鍖�",
	    "420606": "妯婂煄鍖�",
	    "420607": "瑗勫窞鍖�",
	    "420624": "鍗楁汲鍘�",
	    "420625": "璋峰煄鍘�",
	    "420626": "淇濆悍鍘�",
	    "420682": "鑰佹渤鍙ｅ競",
	    "420683": "鏋ｉ槼甯�",
	    "420684": "瀹滃煄甯�",
	    "420685": "鍏跺畠鍖�",
	    "420700": "閯傚窞甯�",
	    "420702": "姊佸瓙婀栧尯",
	    "420703": "鍗庡鍖�",
	    "420704": "閯傚煄鍖�",
	    "420705": "鍏跺畠鍖�",
	    "420800": "鑽嗛棬甯�",
	    "420802": "涓滃疂鍖�",
	    "420804": "鎺囧垁鍖�",
	    "420821": "浜北鍘�",
	    "420822": "娌欐磱鍘�",
	    "420881": "閽熺ゥ甯�",
	    "420882": "鍏跺畠鍖�",
	    "420900": "瀛濇劅甯�",
	    "420902": "瀛濆崡鍖�",
	    "420921": "瀛濇槍鍘�",
	    "420922": "澶ф偀鍘�",
	    "420923": "浜戞ⅵ鍘�",
	    "420981": "搴斿煄甯�",
	    "420982": "瀹夐檰甯�",
	    "420984": "姹夊窛甯�",
	    "420985": "鍏跺畠鍖�",
	    "421000": "鑽嗗窞甯�",
	    "421002": "娌欏競鍖�",
	    "421003": "鑽嗗窞鍖�",
	    "421022": "鍏畨鍘�",
	    "421023": "鐩戝埄鍘�",
	    "421024": "姹熼櫟鍘�",
	    "421081": "鐭抽甯�",
	    "421083": "娲箹甯�",
	    "421087": "鏉炬粙甯�",
	    "421088": "鍏跺畠鍖�",
	    "421100": "榛勫唸甯�",
	    "421102": "榛勫窞鍖�",
	    "421121": "鍥㈤鍘�",
	    "421122": "绾㈠畨鍘�",
	    "421123": "缃楃敯鍘�",
	    "421124": "鑻卞北鍘�",
	    "421125": "娴犳按鍘�",
	    "421126": "钑叉槬鍘�",
	    "421127": "榛勬鍘�",
	    "421181": "楹诲煄甯�",
	    "421182": "姝︾┐甯�",
	    "421183": "鍏跺畠鍖�",
	    "421200": "鍜稿畞甯�",
	    "421202": "鍜稿畨鍖�",
	    "421221": "鍢夐奔鍘�",
	    "421222": "閫氬煄鍘�",
	    "421223": "宕囬槼鍘�",
	    "421224": "閫氬北鍘�",
	    "421281": "璧ゅ甯�",
	    "421283": "鍏跺畠鍖�",
	    "421300": "闅忓窞甯�",
	    "421302": "鏇鹃兘鍖�",
	    "421321": "闅忓幙",
	    "421381": "骞挎按甯�",
	    "421382": "鍏跺畠鍖�",
	    "422800": "鎭╂柦鍦熷鏃忚嫍鏃忚嚜娌诲窞",
	    "422801": "鎭╂柦甯�",
	    "422802": "鍒╁窛甯�",
	    "422822": "寤哄鍘�",
	    "422823": "宸翠笢鍘�",
	    "422825": "瀹ｆ仼鍘�",
	    "422826": "鍜镐赴鍘�",
	    "422827": "鏉ュ嚖鍘�",
	    "422828": "楣ゅ嘲鍘�",
	    "422829": "鍏跺畠鍖�",
	    "429004": "浠欐甯�",
	    "429005": "娼滄睙甯�",
	    "429006": "澶╅棬甯�",
	    "429021": "绁炲啘鏋舵灄鍖�",
	    "430000": "婀栧崡鐪�",
	    "430100": "闀挎矙甯�",
	    "430102": "鑺欒搲鍖�",
	    "430103": "澶╁績鍖�",
	    "430104": "宀抽簱鍖�",
	    "430105": "寮€绂忓尯",
	    "430111": "闆ㄨ姳鍖�",
	    "430121": "闀挎矙鍘�",
	    "430122": "鏈涘煄鍖�",
	    "430124": "瀹佷埂鍘�",
	    "430181": "娴忛槼甯�",
	    "430182": "鍏跺畠鍖�",
	    "430200": "鏍床甯�",
	    "430202": "鑽峰鍖�",
	    "430203": "鑺︽窞鍖�",
	    "430204": "鐭冲嘲鍖�",
	    "430211": "澶╁厓鍖�",
	    "430221": "鏍床鍘�",
	    "430223": "鏀稿幙",
	    "430224": "鑼堕櫟鍘�",
	    "430225": "鐐庨櫟鍘�",
	    "430281": "閱撮櫟甯�",
	    "430282": "鍏跺畠鍖�",
	    "430300": "婀樻江甯�",
	    "430302": "闆ㄦ箹鍖�",
	    "430304": "宀冲鍖�",
	    "430321": "婀樻江鍘�",
	    "430381": "婀樹埂甯�",
	    "430382": "闊跺北甯�",
	    "430383": "鍏跺畠鍖�",
	    "430400": "琛￠槼甯�",
	    "430405": "鐝犳櫀鍖�",
	    "430406": "闆佸嘲鍖�",
	    "430407": "鐭抽紦鍖�",
	    "430408": "钂告箻鍖�",
	    "430412": "鍗楀渤鍖�",
	    "430421": "琛￠槼鍘�",
	    "430422": "琛″崡鍘�",
	    "430423": "琛″北鍘�",
	    "430424": "琛′笢鍘�",
	    "430426": "绁佷笢鍘�",
	    "430481": "鑰掗槼甯�",
	    "430482": "甯稿畞甯�",
	    "430483": "鍏跺畠鍖�",
	    "430500": "閭甸槼甯�",
	    "430502": "鍙屾竻鍖�",
	    "430503": "澶хゥ鍖�",
	    "430511": "鍖楀鍖�",
	    "430521": "閭典笢鍘�",
	    "430522": "鏂伴偟鍘�",
	    "430523": "閭甸槼鍘�",
	    "430524": "闅嗗洖鍘�",
	    "430525": "娲炲彛鍘�",
	    "430527": "缁ュ畞鍘�",
	    "430528": "鏂板畞鍘�",
	    "430529": "鍩庢鑻楁棌鑷不鍘�",
	    "430581": "姝﹀唸甯�",
	    "430582": "鍏跺畠鍖�",
	    "430600": "宀抽槼甯�",
	    "430602": "宀抽槼妤煎尯",
	    "430603": "浜戞邯鍖�",
	    "430611": "鍚涘北鍖�",
	    "430621": "宀抽槼鍘�",
	    "430623": "鍗庡鍘�",
	    "430624": "婀橀槾鍘�",
	    "430626": "骞虫睙鍘�",
	    "430681": "姹ㄧ綏甯�",
	    "430682": "涓存箻甯�",
	    "430683": "鍏跺畠鍖�",
	    "430700": "甯稿痉甯�",
	    "430702": "姝﹂櫟鍖�",
	    "430703": "榧庡煄鍖�",
	    "430721": "瀹変埂鍘�",
	    "430722": "姹夊鍘�",
	    "430723": "婢у幙",
	    "430724": "涓存晶鍘�",
	    "430725": "妗冩簮鍘�",
	    "430726": "鐭抽棬鍘�",
	    "430781": "娲ュ競甯�",
	    "430782": "鍏跺畠鍖�",
	    "430800": "寮犲鐣屽競",
	    "430802": "姘稿畾鍖�",
	    "430811": "姝﹂櫟婧愬尯",
	    "430821": "鎱堝埄鍘�",
	    "430822": "妗戞鍘�",
	    "430823": "鍏跺畠鍖�",
	    "430900": "鐩婇槼甯�",
	    "430902": "璧勯槼鍖�",
	    "430903": "璧北鍖�",
	    "430921": "鍗楀幙",
	    "430922": "妗冩睙鍘�",
	    "430923": "瀹夊寲鍘�",
	    "430981": "娌呮睙甯�",
	    "430982": "鍏跺畠鍖�",
	    "431000": "閮村窞甯�",
	    "431002": "鍖楁箹鍖�",
	    "431003": "鑻忎粰鍖�",
	    "431021": "妗傞槼鍘�",
	    "431022": "瀹滅珷鍘�",
	    "431023": "姘稿叴鍘�",
	    "431024": "鍢夌鍘�",
	    "431025": "涓存鍘�",
	    "431026": "姹濆煄鍘�",
	    "431027": "妗備笢鍘�",
	    "431028": "瀹変粊鍘�",
	    "431081": "璧勫叴甯�",
	    "431082": "鍏跺畠鍖�",
	    "431100": "姘稿窞甯�",
	    "431102": "闆堕櫟鍖�",
	    "431103": "鍐锋按婊╁尯",
	    "431121": "绁侀槼鍘�",
	    "431122": "涓滃畨鍘�",
	    "431123": "鍙岀墝鍘�",
	    "431124": "閬撳幙",
	    "431125": "姹熸案鍘�",
	    "431126": "瀹佽繙鍘�",
	    "431127": "钃濆北鍘�",
	    "431128": "鏂扮敯鍘�",
	    "431129": "姹熷崕鐟舵棌鑷不鍘�",
	    "431130": "鍏跺畠鍖�",
	    "431200": "鎬€鍖栧競",
	    "431202": "楣ゅ煄鍖�",
	    "431221": "涓柟鍘�",
	    "431222": "娌呴櫟鍘�",
	    "431223": "杈版邯鍘�",
	    "431224": "婧嗘郸鍘�",
	    "431225": "浼氬悓鍘�",
	    "431226": "楹婚槼鑻楁棌鑷不鍘�",
	    "431227": "鏂版檭渚楁棌鑷不鍘�",
	    "431228": "鑺锋睙渚楁棌鑷不鍘�",
	    "431229": "闈栧窞鑻楁棌渚楁棌鑷不鍘�",
	    "431230": "閫氶亾渚楁棌鑷不鍘�",
	    "431281": "娲睙甯�",
	    "431282": "鍏跺畠鍖�",
	    "431300": "濞勫簳甯�",
	    "431302": "濞勬槦鍖�",
	    "431321": "鍙屽嘲鍘�",
	    "431322": "鏂板寲鍘�",
	    "431381": "鍐锋按姹熷競",
	    "431382": "娑熸簮甯�",
	    "431383": "鍏跺畠鍖�",
	    "433100": "婀樿タ鍦熷鏃忚嫍鏃忚嚜娌诲窞",
	    "433101": "鍚夐甯�",
	    "433122": "娉告邯鍘�",
	    "433123": "鍑ゅ嚢鍘�",
	    "433124": "鑺卞灒鍘�",
	    "433125": "淇濋潠鍘�",
	    "433126": "鍙や笀鍘�",
	    "433127": "姘搁『鍘�",
	    "433130": "榫欏北鍘�",
	    "433131": "鍏跺畠鍖�",
	    "440000": "骞夸笢鐪�",
	    "440100": "骞垮窞甯�",
	    "440103": "鑽旀咕鍖�",
	    "440104": "瓒婄鍖�",
	    "440105": "娴风彔鍖�",
	    "440106": "澶╂渤鍖�",
	    "440111": "鐧戒簯鍖�",
	    "440112": "榛勫煍鍖�",
	    "440113": "鐣鍖�",
	    "440114": "鑺遍兘鍖�",
	    "440115": "鍗楁矙鍖�",
	    "440116": "钀濆矖鍖�",
	    "440183": "澧炲煄甯�",
	    "440184": "浠庡寲甯�",
	    "440189": "鍏跺畠鍖�",
	    "440200": "闊跺叧甯�",
	    "440203": "姝︽睙鍖�",
	    "440204": "娴堟睙鍖�",
	    "440205": "鏇叉睙鍖�",
	    "440222": "濮嬪叴鍘�",
	    "440224": "浠佸寲鍘�",
	    "440229": "缈佹簮鍘�",
	    "440232": "涔虫簮鐟舵棌鑷不鍘�",
	    "440233": "鏂颁赴鍘�",
	    "440281": "涔愭槍甯�",
	    "440282": "鍗楅泟甯�",
	    "440283": "鍏跺畠鍖�",
	    "440300": "娣卞湷甯�",
	    "440303": "缃楁箹鍖�",
	    "440304": "绂忕敯鍖�",
	    "440305": "鍗楀北鍖�",
	    "440306": "瀹濆畨鍖�",
	    "440307": "榫欏矖鍖�",
	    "440308": "鐩愮敯鍖�",
	    "440309": "鍏跺畠鍖�",
	    "440320": "鍏夋槑鏂板尯",
	    "440321": "鍧北鏂板尯",
	    "440322": "澶ч箯鏂板尯",
	    "440323": "榫欏崕鏂板尯",
	    "440400": "鐝犳捣甯�",
	    "440402": "棣欐床鍖�",
	    "440403": "鏂楅棬鍖�",
	    "440404": "閲戞咕鍖�",
	    "440488": "鍏跺畠鍖�",
	    "440500": "姹曞ご甯�",
	    "440507": "榫欐箹鍖�",
	    "440511": "閲戝钩鍖�",
	    "440512": "婵犳睙鍖�",
	    "440513": "娼槼鍖�",
	    "440514": "娼崡鍖�",
	    "440515": "婢勬捣鍖�",
	    "440523": "鍗楁境鍘�",
	    "440524": "鍏跺畠鍖�",
	    "440600": "浣涘北甯�",
	    "440604": "绂呭煄鍖�",
	    "440605": "鍗楁捣鍖�",
	    "440606": "椤哄痉鍖�",
	    "440607": "涓夋按鍖�",
	    "440608": "楂樻槑鍖�",
	    "440609": "鍏跺畠鍖�",
	    "440700": "姹熼棬甯�",
	    "440703": "钃睙鍖�",
	    "440704": "姹熸捣鍖�",
	    "440705": "鏂颁細鍖�",
	    "440781": "鍙板北甯�",
	    "440783": "寮€骞冲競",
	    "440784": "楣ゅ北甯�",
	    "440785": "鎭╁钩甯�",
	    "440786": "鍏跺畠鍖�",
	    "440800": "婀涙睙甯�",
	    "440802": "璧ゅ潕鍖�",
	    "440803": "闇炲北鍖�",
	    "440804": "鍧″ご鍖�",
	    "440811": "楹荤珷鍖�",
	    "440823": "閬傛邯鍘�",
	    "440825": "寰愰椈鍘�",
	    "440881": "寤夋睙甯�",
	    "440882": "闆峰窞甯�",
	    "440883": "鍚村窛甯�",
	    "440884": "鍏跺畠鍖�",
	    "440900": "鑼傚悕甯�",
	    "440902": "鑼傚崡鍖�",
	    "440903": "鑼傛腐鍖�",
	    "440923": "鐢电櫧鍘�",
	    "440981": "楂樺窞甯�",
	    "440982": "鍖栧窞甯�",
	    "440983": "淇″疁甯�",
	    "440984": "鍏跺畠鍖�",
	    "441200": "鑲囧簡甯�",
	    "441202": "绔窞鍖�",
	    "441203": "榧庢箹鍖�",
	    "441223": "骞垮畞鍘�",
	    "441224": "鎬€闆嗗幙",
	    "441225": "灏佸紑鍘�",
	    "441226": "寰峰簡鍘�",
	    "441283": "楂樿甯�",
	    "441284": "鍥涗細甯�",
	    "441285": "鍏跺畠鍖�",
	    "441300": "鎯犲窞甯�",
	    "441302": "鎯犲煄鍖�",
	    "441303": "鎯犻槼鍖�",
	    "441322": "鍗氱綏鍘�",
	    "441323": "鎯犱笢鍘�",
	    "441324": "榫欓棬鍘�",
	    "441325": "鍏跺畠鍖�",
	    "441400": "姊呭窞甯�",
	    "441402": "姊呮睙鍖�",
	    "441421": "姊呭幙",
	    "441422": "澶у煍鍘�",
	    "441423": "涓伴『鍘�",
	    "441424": "浜斿崕鍘�",
	    "441426": "骞宠繙鍘�",
	    "441427": "钑夊箔鍘�",
	    "441481": "鍏村畞甯�",
	    "441482": "鍏跺畠鍖�",
	    "441500": "姹曞熬甯�",
	    "441502": "鍩庡尯",
	    "441521": "娴蜂赴鍘�",
	    "441523": "闄嗘渤鍘�",
	    "441581": "闄嗕赴甯�",
	    "441582": "鍏跺畠鍖�",
	    "441600": "娌虫簮甯�",
	    "441602": "婧愬煄鍖�",
	    "441621": "绱噾鍘�",
	    "441622": "榫欏窛鍘�",
	    "441623": "杩炲钩鍘�",
	    "441624": "鍜屽钩鍘�",
	    "441625": "涓滄簮鍘�",
	    "441626": "鍏跺畠鍖�",
	    "441700": "闃虫睙甯�",
	    "441702": "姹熷煄鍖�",
	    "441721": "闃宠タ鍘�",
	    "441723": "闃充笢鍘�",
	    "441781": "闃虫槬甯�",
	    "441782": "鍏跺畠鍖�",
	    "441800": "娓呰繙甯�",
	    "441802": "娓呭煄鍖�",
	    "441821": "浣涘唸鍘�",
	    "441823": "闃冲北鍘�",
	    "441825": "杩炲北澹棌鐟舵棌鑷不鍘�",
	    "441826": "杩炲崡鐟舵棌鑷不鍘�",
	    "441827": "娓呮柊鍖�",
	    "441881": "鑻卞痉甯�",
	    "441882": "杩炲窞甯�",
	    "441883": "鍏跺畠鍖�",
	    "441900": "涓滆帪甯�",
	    "442000": "涓北甯�",
	    "442101": "涓滄矙缇ゅ矝",
	    "445100": "娼窞甯�",
	    "445102": "婀樻ˉ鍖�",
	    "445121": "娼畨鍖�",
	    "445122": "楗跺钩鍘�",
	    "445186": "鍏跺畠鍖�",
	    "445200": "鎻槼甯�",
	    "445202": "姒曞煄鍖�",
	    "445221": "鎻笢鍖�",
	    "445222": "鎻タ鍘�",
	    "445224": "鎯犳潵鍘�",
	    "445281": "鏅畞甯�",
	    "445285": "鍏跺畠鍖�",
	    "445300": "浜戞诞甯�",
	    "445302": "浜戝煄鍖�",
	    "445321": "鏂板叴鍘�",
	    "445322": "閮佸崡鍘�",
	    "445323": "浜戝畨鍘�",
	    "445381": "缃楀畾甯�",
	    "445382": "鍏跺畠鍖�",
	    "450000": "骞胯タ澹棌鑷不鍖�",
	    "450100": "鍗楀畞甯�",
	    "450102": "鍏村畞鍖�",
	    "450103": "闈掔鍖�",
	    "450105": "姹熷崡鍖�",
	    "450107": "瑗夸埂濉樺尯",
	    "450108": "鑹簡鍖�",
	    "450109": "閭曞畞鍖�",
	    "450122": "姝﹂福鍘�",
	    "450123": "闅嗗畨鍘�",
	    "450124": "椹北鍘�",
	    "450125": "涓婃灄鍘�",
	    "450126": "瀹鹃槼鍘�",
	    "450127": "妯幙",
	    "450128": "鍏跺畠鍖�",
	    "450200": "鏌冲窞甯�",
	    "450202": "鍩庝腑鍖�",
	    "450203": "楸煎嘲鍖�",
	    "450204": "鏌冲崡鍖�",
	    "450205": "鏌冲寳鍖�",
	    "450221": "鏌虫睙鍘�",
	    "450222": "鏌冲煄鍘�",
	    "450223": "楣垮鍘�",
	    "450224": "铻嶅畨鍘�",
	    "450225": "铻嶆按鑻楁棌鑷不鍘�",
	    "450226": "涓夋睙渚楁棌鑷不鍘�",
	    "450227": "鍏跺畠鍖�",
	    "450300": "妗傛灄甯�",
	    "450302": "绉€宄板尯",
	    "450303": "鍙犲僵鍖�",
	    "450304": "璞″北鍖�",
	    "450305": "涓冩槦鍖�",
	    "450311": "闆佸北鍖�",
	    "450321": "闃虫湐鍘�",
	    "450322": "涓存鍖�",
	    "450323": "鐏靛窛鍘�",
	    "450324": "鍏ㄥ窞鍘�",
	    "450325": "鍏村畨鍘�",
	    "450326": "姘哥鍘�",
	    "450327": "鐏岄槼鍘�",
	    "450328": "榫欒儨鍚勬棌鑷不鍘�",
	    "450329": "璧勬簮鍘�",
	    "450330": "骞充箰鍘�",
	    "450331": "鑽旀郸鍘�",
	    "450332": "鎭煄鐟舵棌鑷不鍘�",
	    "450333": "鍏跺畠鍖�",
	    "450400": "姊у窞甯�",
	    "450403": "涓囩鍖�",
	    "450405": "闀挎床鍖�",
	    "450406": "榫欏湬鍖�",
	    "450421": "鑻嶆ⅶ鍘�",
	    "450422": "钘ゅ幙",
	    "450423": "钂欏北鍘�",
	    "450481": "宀戞邯甯�",
	    "450482": "鍏跺畠鍖�",
	    "450500": "鍖楁捣甯�",
	    "450502": "娴峰煄鍖�",
	    "450503": "閾舵捣鍖�",
	    "450512": "閾佸北娓尯",
	    "450521": "鍚堟郸鍘�",
	    "450522": "鍏跺畠鍖�",
	    "450600": "闃插煄娓競",
	    "450602": "娓彛鍖�",
	    "450603": "闃插煄鍖�",
	    "450621": "涓婃€濆幙",
	    "450681": "涓滃叴甯�",
	    "450682": "鍏跺畠鍖�",
	    "450700": "閽﹀窞甯�",
	    "450702": "閽﹀崡鍖�",
	    "450703": "閽﹀寳鍖�",
	    "450721": "鐏靛北鍘�",
	    "450722": "娴﹀寳鍘�",
	    "450723": "鍏跺畠鍖�",
	    "450800": "璐垫腐甯�",
	    "450802": "娓寳鍖�",
	    "450803": "娓崡鍖�",
	    "450804": "瑕冨鍖�",
	    "450821": "骞冲崡鍘�",
	    "450881": "妗傚钩甯�",
	    "450882": "鍏跺畠鍖�",
	    "450900": "鐜夋灄甯�",
	    "450902": "鐜夊窞鍖�",
	    "450903": "绂忕坏鍖�",
	    "450921": "瀹瑰幙",
	    "450922": "闄嗗窛鍘�",
	    "450923": "鍗氱櫧鍘�",
	    "450924": "鍏翠笟鍘�",
	    "450981": "鍖楁祦甯�",
	    "450982": "鍏跺畠鍖�",
	    "451000": "鐧捐壊甯�",
	    "451002": "鍙虫睙鍖�",
	    "451021": "鐢伴槼鍘�",
	    "451022": "鐢颁笢鍘�",
	    "451023": "骞虫灉鍘�",
	    "451024": "寰蜂繚鍘�",
	    "451025": "闈栬タ鍘�",
	    "451026": "閭ｅ潯鍘�",
	    "451027": "鍑屼簯鍘�",
	    "451028": "涔愪笟鍘�",
	    "451029": "鐢版灄鍘�",
	    "451030": "瑗挎灄鍘�",
	    "451031": "闅嗘灄鍚勬棌鑷不鍘�",
	    "451032": "鍏跺畠鍖�",
	    "451100": "璐哄窞甯�",
	    "451102": "鍏鍖�",
	    "451119": "骞虫绠＄悊鍖�",
	    "451121": "鏄钩鍘�",
	    "451122": "閽熷北鍘�",
	    "451123": "瀵屽窛鐟舵棌鑷不鍘�",
	    "451124": "鍏跺畠鍖�",
	    "451200": "娌虫睜甯�",
	    "451202": "閲戝煄姹熷尯",
	    "451221": "鍗椾腹鍘�",
	    "451222": "澶╁敞鍘�",
	    "451223": "鍑ゅ北鍘�",
	    "451224": "涓滃叞鍘�",
	    "451225": "缃楀煄浠浆鏃忚嚜娌诲幙",
	    "451226": "鐜睙姣涘崡鏃忚嚜娌诲幙",
	    "451227": "宸撮┈鐟舵棌鑷不鍘�",
	    "451228": "閮藉畨鐟舵棌鑷不鍘�",
	    "451229": "澶у寲鐟舵棌鑷不鍘�",
	    "451281": "瀹滃窞甯�",
	    "451282": "鍏跺畠鍖�",
	    "451300": "鏉ュ甯�",
	    "451302": "鍏村鍖�",
	    "451321": "蹇诲煄鍘�",
	    "451322": "璞″窞鍘�",
	    "451323": "姝﹀鍘�",
	    "451324": "閲戠鐟舵棌鑷不鍘�",
	    "451381": "鍚堝北甯�",
	    "451382": "鍏跺畠鍖�",
	    "451400": "宕囧乏甯�",
	    "451402": "姹熷窞鍖�",
	    "451421": "鎵剁互鍘�",
	    "451422": "瀹佹槑鍘�",
	    "451423": "榫欏窞鍘�",
	    "451424": "澶ф柊鍘�",
	    "451425": "澶╃瓑鍘�",
	    "451481": "鍑ゥ甯�",
	    "451482": "鍏跺畠鍖�",
	    "460000": "娴峰崡鐪�",
	    "460100": "娴峰彛甯�",
	    "460105": "绉€鑻卞尯",
	    "460106": "榫欏崕鍖�",
	    "460107": "鐞煎北鍖�",
	    "460108": "缇庡叞鍖�",
	    "460109": "鍏跺畠鍖�",
	    "460200": "涓変簹甯�",
	    "460300": "涓夋矙甯�",
	    "460321": "瑗挎矙缇ゅ矝",
	    "460322": "鍗楁矙缇ゅ矝",
	    "460323": "涓矙缇ゅ矝鐨勫矝绀佸強鍏舵捣鍩�",
	    "469001": "浜旀寚灞卞競",
	    "469002": "鐞兼捣甯�",
	    "469003": "鍎嬪窞甯�",
	    "469005": "鏂囨槍甯�",
	    "469006": "涓囧畞甯�",
	    "469007": "涓滄柟甯�",
	    "469025": "瀹氬畨鍘�",
	    "469026": "灞槍鍘�",
	    "469027": "婢勮繄鍘�",
	    "469028": "涓撮珮鍘�",
	    "469030": "鐧芥矙榛庢棌鑷不鍘�",
	    "469031": "鏄屾睙榛庢棌鑷不鍘�",
	    "469033": "涔愪笢榛庢棌鑷不鍘�",
	    "469034": "闄垫按榛庢棌鑷不鍘�",
	    "469035": "淇濅涵榛庢棌鑻楁棌鑷不鍘�",
	    "469036": "鐞间腑榛庢棌鑻楁棌鑷不鍘�",
	    "471005": "鍏跺畠鍖�",
	    "500000": "閲嶅簡",
	    "500100": "閲嶅簡甯�",
	    "500101": "涓囧窞鍖�",
	    "500102": "娑櫟鍖�",
	    "500103": "娓濅腑鍖�",
	    "500104": "澶ф浮鍙ｅ尯",
	    "500105": "姹熷寳鍖�",
	    "500106": "娌欏潽鍧濆尯",
	    "500107": "涔濋緳鍧″尯",
	    "500108": "鍗楀哺鍖�",
	    "500109": "鍖楃鍖�",
	    "500110": "涓囩洓鍖�",
	    "500111": "鍙屾ˉ鍖�",
	    "500112": "娓濆寳鍖�",
	    "500113": "宸村崡鍖�",
	    "500114": "榛旀睙鍖�",
	    "500115": "闀垮鍖�",
	    "500222": "缍︽睙鍖�",
	    "500223": "娼煎崡鍘�",
	    "500224": "閾滄鍘�",
	    "500225": "澶ц冻鍖�",
	    "500226": "鑽ｆ槍鍘�",
	    "500227": "鐠у北鍘�",
	    "500228": "姊佸钩鍘�",
	    "500229": "鍩庡彛鍘�",
	    "500230": "涓伴兘鍘�",
	    "500231": "鍨睙鍘�",
	    "500232": "姝﹂殕鍘�",
	    "500233": "蹇犲幙",
	    "500234": "寮€鍘�",
	    "500235": "浜戦槼鍘�",
	    "500236": "濂夎妭鍘�",
	    "500237": "宸北鍘�",
	    "500238": "宸邯鍘�",
	    "500240": "鐭虫煴鍦熷鏃忚嚜娌诲幙",
	    "500241": "绉€灞卞湡瀹舵棌鑻楁棌鑷不鍘�",
	    "500242": "閰夐槼鍦熷鏃忚嫍鏃忚嚜娌诲幙",
	    "500243": "褰按鑻楁棌鍦熷鏃忚嚜娌诲幙",
	    "500381": "姹熸触鍖�",
	    "500382": "鍚堝窛鍖�",
	    "500383": "姘稿窛鍖�",
	    "500384": "鍗楀窛鍖�",
	    "500385": "鍏跺畠鍖�",
	    "510000": "鍥涘窛鐪�",
	    "510100": "鎴愰兘甯�",
	    "510104": "閿︽睙鍖�",
	    "510105": "闈掔緤鍖�",
	    "510106": "閲戠墰鍖�",
	    "510107": "姝︿警鍖�",
	    "510108": "鎴愬崕鍖�",
	    "510112": "榫欐硥椹垮尯",
	    "510113": "闈掔櫧姹熷尯",
	    "510114": "鏂伴兘鍖�",
	    "510115": "娓╂睙鍖�",
	    "510121": "閲戝爞鍘�",
	    "510122": "鍙屾祦鍘�",
	    "510124": "閮幙",
	    "510129": "澶ч倯鍘�",
	    "510131": "钂叉睙鍘�",
	    "510132": "鏂版触鍘�",
	    "510181": "閮芥睙鍫板競",
	    "510182": "褰窞甯�",
	    "510183": "閭涘磧甯�",
	    "510184": "宕囧窞甯�",
	    "510185": "鍏跺畠鍖�",
	    "510300": "鑷础甯�",
	    "510302": "鑷祦浜曞尯",
	    "510303": "璐′簳鍖�",
	    "510304": "澶у畨鍖�",
	    "510311": "娌挎哗鍖�",
	    "510321": "鑽ｅ幙",
	    "510322": "瀵岄『鍘�",
	    "510323": "鍏跺畠鍖�",
	    "510400": "鏀€鏋濊姳甯�",
	    "510402": "涓滃尯",
	    "510403": "瑗垮尯",
	    "510411": "浠佸拰鍖�",
	    "510421": "绫虫槗鍘�",
	    "510422": "鐩愯竟鍘�",
	    "510423": "鍏跺畠鍖�",
	    "510500": "娉稿窞甯�",
	    "510502": "姹熼槼鍖�",
	    "510503": "绾虫邯鍖�",
	    "510504": "榫欓┈娼尯",
	    "510521": "娉稿幙",
	    "510522": "鍚堟睙鍘�",
	    "510524": "鍙欐案鍘�",
	    "510525": "鍙よ敽鍘�",
	    "510526": "鍏跺畠鍖�",
	    "510600": "寰烽槼甯�",
	    "510603": "鏃岄槼鍖�",
	    "510623": "涓睙鍘�",
	    "510626": "缃楁睙鍘�",
	    "510681": "骞挎眽甯�",
	    "510682": "浠€閭″競",
	    "510683": "缁电甯�",
	    "510684": "鍏跺畠鍖�",
	    "510700": "缁甸槼甯�",
	    "510703": "娑煄鍖�",
	    "510704": "娓镐粰鍖�",
	    "510722": "涓夊彴鍘�",
	    "510723": "鐩愪涵鍘�",
	    "510724": "瀹夊幙",
	    "510725": "姊撴郊鍘�",
	    "510726": "鍖楀窛缇屾棌鑷不鍘�",
	    "510727": "骞虫鍘�",
	    "510781": "姹熸补甯�",
	    "510782": "鍏跺畠鍖�",
	    "510800": "骞垮厓甯�",
	    "510802": "鍒╁窞鍖�",
	    "510811": "鏄寲鍖�",
	    "510812": "鏈濆ぉ鍖�",
	    "510821": "鏃鸿媿鍘�",
	    "510822": "闈掑窛鍘�",
	    "510823": "鍓戦榿鍘�",
	    "510824": "鑻嶆邯鍘�",
	    "510825": "鍏跺畠鍖�",
	    "510900": "閬傚畞甯�",
	    "510903": "鑸瑰北鍖�",
	    "510904": "瀹夊眳鍖�",
	    "510921": "钃邯鍘�",
	    "510922": "灏勬椽鍘�",
	    "510923": "澶ц嫳鍘�",
	    "510924": "鍏跺畠鍖�",
	    "511000": "鍐呮睙甯�",
	    "511002": "甯備腑鍖�",
	    "511011": "涓滃叴鍖�",
	    "511024": "濞佽繙鍘�",
	    "511025": "璧勪腑鍘�",
	    "511028": "闅嗘槍鍘�",
	    "511029": "鍏跺畠鍖�",
	    "511100": "涔愬北甯�",
	    "511102": "甯備腑鍖�",
	    "511111": "娌欐咕鍖�",
	    "511112": "浜旈€氭ˉ鍖�",
	    "511113": "閲戝彛娌冲尯",
	    "511123": "鐘嶄负鍘�",
	    "511124": "浜曠爺鍘�",
	    "511126": "澶规睙鍘�",
	    "511129": "娌愬窛鍘�",
	    "511132": "宄ㄨ竟褰濇棌鑷不鍘�",
	    "511133": "椹竟褰濇棌鑷不鍘�",
	    "511181": "宄ㄧ湁灞卞競",
	    "511182": "鍏跺畠鍖�",
	    "511300": "鍗楀厖甯�",
	    "511302": "椤哄簡鍖�",
	    "511303": "楂樺潽鍖�",
	    "511304": "鍢夐櫟鍖�",
	    "511321": "鍗楅儴鍘�",
	    "511322": "钀ュ北鍘�",
	    "511323": "钃畨鍘�",
	    "511324": "浠檱鍘�",
	    "511325": "瑗垮厖鍘�",
	    "511381": "闃嗕腑甯�",
	    "511382": "鍏跺畠鍖�",
	    "511400": "鐪夊北甯�",
	    "511402": "涓滃潯鍖�",
	    "511421": "浠佸鍘�",
	    "511422": "褰北鍘�",
	    "511423": "娲泤鍘�",
	    "511424": "涓规１鍘�",
	    "511425": "闈掔鍘�",
	    "511426": "鍏跺畠鍖�",
	    "511500": "瀹滃甯�",
	    "511502": "缈犲睆鍖�",
	    "511521": "瀹滃鍘�",
	    "511522": "鍗楁邯鍖�",
	    "511523": "姹熷畨鍘�",
	    "511524": "闀垮畞鍘�",
	    "511525": "楂樺幙",
	    "511526": "鐝欏幙",
	    "511527": "绛犺繛鍘�",
	    "511528": "鍏存枃鍘�",
	    "511529": "灞忓北鍘�",
	    "511530": "鍏跺畠鍖�",
	    "511600": "骞垮畨甯�",
	    "511602": "骞垮畨鍖�",
	    "511603": "鍓嶉攱鍖�",
	    "511621": "宀虫睜鍘�",
	    "511622": "姝﹁儨鍘�",
	    "511623": "閭绘按鍘�",
	    "511681": "鍗庤摜甯�",
	    "511683": "鍏跺畠鍖�",
	    "511700": "杈惧窞甯�",
	    "511702": "閫氬窛鍖�",
	    "511721": "杈惧窛鍖�",
	    "511722": "瀹ｆ眽鍘�",
	    "511723": "寮€姹熷幙",
	    "511724": "澶х鍘�",
	    "511725": "娓犲幙",
	    "511781": "涓囨簮甯�",
	    "511782": "鍏跺畠鍖�",
	    "511800": "闆呭畨甯�",
	    "511802": "闆ㄥ煄鍖�",
	    "511821": "鍚嶅北鍖�",
	    "511822": "鑽ョ粡鍘�",
	    "511823": "姹夋簮鍘�",
	    "511824": "鐭虫鍘�",
	    "511825": "澶╁叏鍘�",
	    "511826": "鑺﹀北鍘�",
	    "511827": "瀹濆叴鍘�",
	    "511828": "鍏跺畠鍖�",
	    "511900": "宸翠腑甯�",
	    "511902": "宸村窞鍖�",
	    "511903": "鎭╅槼鍖�",
	    "511921": "閫氭睙鍘�",
	    "511922": "鍗楁睙鍘�",
	    "511923": "骞虫槍鍘�",
	    "511924": "鍏跺畠鍖�",
	    "512000": "璧勯槼甯�",
	    "512002": "闆佹睙鍖�",
	    "512021": "瀹夊渤鍘�",
	    "512022": "涔愯嚦鍘�",
	    "512081": "绠€闃冲競",
	    "512082": "鍏跺畠鍖�",
	    "513200": "闃垮潩钘忔棌缇屾棌鑷不宸�",
	    "513221": "姹跺窛鍘�",
	    "513222": "鐞嗗幙",
	    "513223": "鑼傚幙",
	    "513224": "鏉炬綐鍘�",
	    "513225": "涔濆娌熷幙",
	    "513226": "閲戝窛鍘�",
	    "513227": "灏忛噾鍘�",
	    "513228": "榛戞按鍘�",
	    "513229": "椹皵搴峰幙",
	    "513230": "澹ゅ鍘�",
	    "513231": "闃垮潩鍘�",
	    "513232": "鑻ュ皵鐩栧幙",
	    "513233": "绾㈠師鍘�",
	    "513234": "鍏跺畠鍖�",
	    "513300": "鐢樺瓬钘忔棌鑷不宸�",
	    "513321": "搴峰畾鍘�",
	    "513322": "娉稿畾鍘�",
	    "513323": "涓瑰反鍘�",
	    "513324": "涔濋緳鍘�",
	    "513325": "闆呮睙鍘�",
	    "513326": "閬撳瓪鍘�",
	    "513327": "鐐夐湇鍘�",
	    "513328": "鐢樺瓬鍘�",
	    "513329": "鏂伴緳鍘�",
	    "513330": "寰锋牸鍘�",
	    "513331": "鐧界帀鍘�",
	    "513332": "鐭虫笭鍘�",
	    "513333": "鑹茶揪鍘�",
	    "513334": "鐞嗗鍘�",
	    "513335": "宸村鍘�",
	    "513336": "涔″煄鍘�",
	    "513337": "绋诲煄鍘�",
	    "513338": "寰楄崳鍘�",
	    "513339": "鍏跺畠鍖�",
	    "513400": "鍑夊北褰濇棌鑷不宸�",
	    "513401": "瑗挎槍甯�",
	    "513422": "鏈ㄩ噷钘忔棌鑷不鍘�",
	    "513423": "鐩愭簮鍘�",
	    "513424": "寰锋槍鍘�",
	    "513425": "浼氱悊鍘�",
	    "513426": "浼氫笢鍘�",
	    "513427": "瀹佸崡鍘�",
	    "513428": "鏅牸鍘�",
	    "513429": "甯冩嫋鍘�",
	    "513430": "閲戦槼鍘�",
	    "513431": "鏄鍘�",
	    "513432": "鍠滃痉鍘�",
	    "513433": "鍐曞畞鍘�",
	    "513434": "瓒婅タ鍘�",
	    "513435": "鐢樻礇鍘�",
	    "513436": "缇庡鍘�",
	    "513437": "闆锋尝鍘�",
	    "513438": "鍏跺畠鍖�",
	    "520000": "璐靛窞鐪�",
	    "520100": "璐甸槼甯�",
	    "520102": "鍗楁槑鍖�",
	    "520103": "浜戝博鍖�",
	    "520111": "鑺辨邯鍖�",
	    "520112": "涔屽綋鍖�",
	    "520113": "鐧戒簯鍖�",
	    "520121": "寮€闃冲幙",
	    "520122": "鎭兘鍘�",
	    "520123": "淇枃鍘�",
	    "520151": "瑙傚北婀栧尯",
	    "520181": "娓呴晣甯�",
	    "520182": "鍏跺畠鍖�",
	    "520200": "鍏洏姘村競",
	    "520201": "閽熷北鍖�",
	    "520203": "鍏灊鐗瑰尯",
	    "520221": "姘村煄鍘�",
	    "520222": "鐩樺幙",
	    "520223": "鍏跺畠鍖�",
	    "520300": "閬典箟甯�",
	    "520302": "绾㈣姳宀楀尯",
	    "520303": "姹囧窛鍖�",
	    "520321": "閬典箟鍘�",
	    "520322": "妗愭鍘�",
	    "520323": "缁ラ槼鍘�",
	    "520324": "姝ｅ畨鍘�",
	    "520325": "閬撶湡浠′浆鏃忚嫍鏃忚嚜娌诲幙",
	    "520326": "鍔″窛浠′浆鏃忚嫍鏃忚嚜娌诲幙",
	    "520327": "鍑ゅ唸鍘�",
	    "520328": "婀勬江鍘�",
	    "520329": "浣欏簡鍘�",
	    "520330": "涔犳按鍘�",
	    "520381": "璧ゆ按甯�",
	    "520382": "浠佹€€甯�",
	    "520383": "鍏跺畠鍖�",
	    "520400": "瀹夐『甯�",
	    "520402": "瑗跨鍖�",
	    "520421": "骞冲潩鍘�",
	    "520422": "鏅畾鍘�",
	    "520423": "闀囧畞甯冧緷鏃忚嫍鏃忚嚜娌诲幙",
	    "520424": "鍏冲箔甯冧緷鏃忚嫍鏃忚嚜娌诲幙",
	    "520425": "绱簯鑻楁棌甯冧緷鏃忚嚜娌诲幙",
	    "520426": "鍏跺畠鍖�",
	    "522200": "閾滀粊甯�",
	    "522201": "纰ф睙鍖�",
	    "522222": "姹熷彛鍘�",
	    "522223": "鐜夊睆渚楁棌鑷不鍘�",
	    "522224": "鐭抽槨鍘�",
	    "522225": "鎬濆崡鍘�",
	    "522226": "鍗版睙鍦熷鏃忚嫍鏃忚嚜娌诲幙",
	    "522227": "寰锋睙鍘�",
	    "522228": "娌挎渤鍦熷鏃忚嚜娌诲幙",
	    "522229": "鏉炬鑻楁棌鑷不鍘�",
	    "522230": "涓囧北鍖�",
	    "522231": "鍏跺畠鍖�",
	    "522300": "榛旇タ鍗楀竷渚濇棌鑻楁棌鑷不宸�",
	    "522301": "鍏翠箟甯�",
	    "522322": "鍏翠粊鍘�",
	    "522323": "鏅畨鍘�",
	    "522324": "鏅撮殕鍘�",
	    "522325": "璐炰赴鍘�",
	    "522326": "鏈涜盁鍘�",
	    "522327": "鍐屼酣鍘�",
	    "522328": "瀹夐緳鍘�",
	    "522329": "鍏跺畠鍖�",
	    "522400": "姣曡妭甯�",
	    "522401": "涓冩槦鍏冲尯",
	    "522422": "澶ф柟鍘�",
	    "522423": "榛旇タ鍘�",
	    "522424": "閲戞矙鍘�",
	    "522425": "缁囬噾鍘�",
	    "522426": "绾抽泹鍘�",
	    "522427": "濞佸畞褰濇棌鍥炴棌鑻楁棌鑷不鍘�",
	    "522428": "璧珷鍘�",
	    "522429": "鍏跺畠鍖�",
	    "522600": "榛斾笢鍗楄嫍鏃忎緱鏃忚嚜娌诲窞",
	    "522601": "鍑噷甯�",
	    "522622": "榛勫钩鍘�",
	    "522623": "鏂界鍘�",
	    "522624": "涓夌鍘�",
	    "522625": "闀囪繙鍘�",
	    "522626": "宀戝珐鍘�",
	    "522627": "澶╂煴鍘�",
	    "522628": "閿﹀睆鍘�",
	    "522629": "鍓戞渤鍘�",
	    "522630": "鍙版睙鍘�",
	    "522631": "榛庡钩鍘�",
	    "522632": "姒曟睙鍘�",
	    "522633": "浠庢睙鍘�",
	    "522634": "闆峰北鍘�",
	    "522635": "楹绘睙鍘�",
	    "522636": "涓瑰鍘�",
	    "522637": "鍏跺畠鍖�",
	    "522700": "榛斿崡甯冧緷鏃忚嫍鏃忚嚜娌诲窞",
	    "522701": "閮藉寑甯�",
	    "522702": "绂忔硥甯�",
	    "522722": "鑽旀尝鍘�",
	    "522723": "璐靛畾鍘�",
	    "522725": "鐡畨鍘�",
	    "522726": "鐙北鍘�",
	    "522727": "骞冲鍘�",
	    "522728": "缃楃敻鍘�",
	    "522729": "闀块『鍘�",
	    "522730": "榫欓噷鍘�",
	    "522731": "鎯犳按鍘�",
	    "522732": "涓夐兘姘存棌鑷不鍘�",
	    "522733": "鍏跺畠鍖�",
	    "530000": "浜戝崡鐪�",
	    "530100": "鏄嗘槑甯�",
	    "530102": "浜斿崕鍖�",
	    "530103": "鐩橀緳鍖�",
	    "530111": "瀹樻浮鍖�",
	    "530112": "瑗垮北鍖�",
	    "530113": "涓滃窛鍖�",
	    "530121": "鍛堣础鍖�",
	    "530122": "鏅嬪畞鍘�",
	    "530124": "瀵屾皯鍘�",
	    "530125": "瀹滆壇鍘�",
	    "530126": "鐭虫灄褰濇棌鑷不鍘�",
	    "530127": "宓╂槑鍘�",
	    "530128": "绂勫姖褰濇棌鑻楁棌鑷不鍘�",
	    "530129": "瀵荤敻鍥炴棌褰濇棌鑷不鍘�",
	    "530181": "瀹夊畞甯�",
	    "530182": "鍏跺畠鍖�",
	    "530300": "鏇查潠甯�",
	    "530302": "楹掗簾鍖�",
	    "530321": "椹緳鍘�",
	    "530322": "闄嗚壇鍘�",
	    "530323": "甯堝畻鍘�",
	    "530324": "缃楀钩鍘�",
	    "530325": "瀵屾簮鍘�",
	    "530326": "浼氭辰鍘�",
	    "530328": "娌剧泭鍘�",
	    "530381": "瀹ｅ▉甯�",
	    "530382": "鍏跺畠鍖�",
	    "530400": "鐜夋邯甯�",
	    "530402": "绾㈠鍖�",
	    "530421": "姹熷窛鍘�",
	    "530422": "婢勬睙鍘�",
	    "530423": "閫氭捣鍘�",
	    "530424": "鍗庡畞鍘�",
	    "530425": "鏄撻棬鍘�",
	    "530426": "宄ㄥ北褰濇棌鑷不鍘�",
	    "530427": "鏂板钩褰濇棌鍌ｆ棌鑷不鍘�",
	    "530428": "鍏冩睙鍝堝凹鏃忓綕鏃忓偅鏃忚嚜娌诲幙",
	    "530429": "鍏跺畠鍖�",
	    "530500": "淇濆北甯�",
	    "530502": "闅嗛槼鍖�",
	    "530521": "鏂界敻鍘�",
	    "530522": "鑵惧啿鍘�",
	    "530523": "榫欓櫟鍘�",
	    "530524": "鏄屽畞鍘�",
	    "530525": "鍏跺畠鍖�",
	    "530600": "鏄€氬競",
	    "530602": "鏄槼鍖�",
	    "530621": "椴佺敻鍘�",
	    "530622": "宸у鍘�",
	    "530623": "鐩愭触鍘�",
	    "530624": "澶у叧鍘�",
	    "530625": "姘稿杽鍘�",
	    "530626": "缁ユ睙鍘�",
	    "530627": "闀囬泟鍘�",
	    "530628": "褰濊壇鍘�",
	    "530629": "濞佷俊鍘�",
	    "530630": "姘村瘜鍘�",
	    "530631": "鍏跺畠鍖�",
	    "530700": "涓芥睙甯�",
	    "530702": "鍙ゅ煄鍖�",
	    "530721": "鐜夐緳绾宠タ鏃忚嚜娌诲幙",
	    "530722": "姘歌儨鍘�",
	    "530723": "鍗庡潽鍘�",
	    "530724": "瀹佽挆褰濇棌鑷不鍘�",
	    "530725": "鍏跺畠鍖�",
	    "530800": "鏅幢甯�",
	    "530802": "鎬濊寘鍖�",
	    "530821": "瀹佹幢鍝堝凹鏃忓綕鏃忚嚜娌诲幙",
	    "530822": "澧ㄦ睙鍝堝凹鏃忚嚜娌诲幙",
	    "530823": "鏅笢褰濇棌鑷不鍘�",
	    "530824": "鏅胺鍌ｆ棌褰濇棌鑷不鍘�",
	    "530825": "闀囨矃褰濇棌鍝堝凹鏃忔媺绁滄棌鑷不鍘�",
	    "530826": "姹熷煄鍝堝凹鏃忓綕鏃忚嚜娌诲幙",
	    "530827": "瀛熻繛鍌ｆ棌鎷夌鏃忎饯鏃忚嚜娌诲幙",
	    "530828": "婢滄钵鎷夌鏃忚嚜娌诲幙",
	    "530829": "瑗跨洘浣ゆ棌鑷不鍘�",
	    "530830": "鍏跺畠鍖�",
	    "530900": "涓存钵甯�",
	    "530902": "涓寸繑鍖�",
	    "530921": "鍑ゅ簡鍘�",
	    "530922": "浜戝幙",
	    "530923": "姘稿痉鍘�",
	    "530924": "闀囧悍鍘�",
	    "530925": "鍙屾睙鎷夌鏃忎饯鏃忓竷鏈楁棌鍌ｆ棌鑷不鍘�",
	    "530926": "鑰块┈鍌ｆ棌浣ゆ棌鑷不鍘�",
	    "530927": "娌ф簮浣ゆ棌鑷不鍘�",
	    "530928": "鍏跺畠鍖�",
	    "532300": "妤氶泟褰濇棌鑷不宸�",
	    "532301": "妤氶泟甯�",
	    "532322": "鍙屾煆鍘�",
	    "532323": "鐗熷畾鍘�",
	    "532324": "鍗楀崕鍘�",
	    "532325": "濮氬畨鍘�",
	    "532326": "澶у鍘�",
	    "532327": "姘镐粊鍘�",
	    "532328": "鍏冭皨鍘�",
	    "532329": "姝﹀畾鍘�",
	    "532331": "绂勪赴鍘�",
	    "532332": "鍏跺畠鍖�",
	    "532500": "绾㈡渤鍝堝凹鏃忓綕鏃忚嚜娌诲窞",
	    "532501": "涓棫甯�",
	    "532502": "寮€杩滃競",
	    "532522": "钂欒嚜甯�",
	    "532523": "灞忚竟鑻楁棌鑷不鍘�",
	    "532524": "寤烘按鍘�",
	    "532525": "鐭冲睆鍘�",
	    "532526": "寮ュ嫆甯�",
	    "532527": "娉歌タ鍘�",
	    "532528": "鍏冮槼鍘�",
	    "532529": "绾㈡渤鍘�",
	    "532530": "閲戝钩鑻楁棌鐟舵棌鍌ｆ棌鑷不鍘�",
	    "532531": "缁挎槬鍘�",
	    "532532": "娌冲彛鐟舵棌鑷不鍘�",
	    "532533": "鍏跺畠鍖�",
	    "532600": "鏂囧北澹棌鑻楁棌鑷不宸�",
	    "532621": "鏂囧北甯�",
	    "532622": "鐮氬北鍘�",
	    "532623": "瑗跨暣鍘�",
	    "532624": "楹绘牀鍧″幙",
	    "532625": "椹叧鍘�",
	    "532626": "涓樺寳鍘�",
	    "532627": "骞垮崡鍘�",
	    "532628": "瀵屽畞鍘�",
	    "532629": "鍏跺畠鍖�",
	    "532800": "瑗垮弻鐗堢撼鍌ｆ棌鑷不宸�",
	    "532801": "鏅椽甯�",
	    "532822": "鍕愭捣鍘�",
	    "532823": "鍕愯厞鍘�",
	    "532824": "鍏跺畠鍖�",
	    "532900": "澶х悊鐧芥棌鑷不宸�",
	    "532901": "澶х悊甯�",
	    "532922": "婕炬繛褰濇棌鑷不鍘�",
	    "532923": "绁ヤ簯鍘�",
	    "532924": "瀹惧窛鍘�",
	    "532925": "寮ユ浮鍘�",
	    "532926": "鍗楁锭褰濇棌鑷不鍘�",
	    "532927": "宸嶅北褰濇棌鍥炴棌鑷不鍘�",
	    "532928": "姘稿钩鍘�",
	    "532929": "浜戦緳鍘�",
	    "532930": "娲辨簮鍘�",
	    "532931": "鍓戝窛鍘�",
	    "532932": "楣ゅ簡鍘�",
	    "532933": "鍏跺畠鍖�",
	    "533100": "寰峰畯鍌ｆ棌鏅鏃忚嚜娌诲窞",
	    "533102": "鐟炰附甯�",
	    "533103": "鑺掑競",
	    "533122": "姊佹渤鍘�",
	    "533123": "鐩堟睙鍘�",
	    "533124": "闄囧窛鍘�",
	    "533125": "鍏跺畠鍖�",
	    "533300": "鎬掓睙鍌堝兂鏃忚嚜娌诲窞",
	    "533321": "娉告按鍘�",
	    "533323": "绂忚础鍘�",
	    "533324": "璐″北鐙緳鏃忔€掓棌鑷不鍘�",
	    "533325": "鍏板潽鐧芥棌鏅背鏃忚嚜娌诲幙",
	    "533326": "鍏跺畠鍖�",
	    "533400": "杩簡钘忔棌鑷不宸�",
	    "533421": "棣欐牸閲屾媺鍘�",
	    "533422": "寰烽挦鍘�",
	    "533423": "缁磋タ鍌堝兂鏃忚嚜娌诲幙",
	    "533424": "鍏跺畠鍖�",
	    "540000": "瑗胯棌鑷不鍖�",
	    "540100": "鎷夎惃甯�",
	    "540102": "鍩庡叧鍖�",
	    "540121": "鏋楀懆鍘�",
	    "540122": "褰撻泟鍘�",
	    "540123": "灏兼湪鍘�",
	    "540124": "鏇叉按鍘�",
	    "540125": "鍫嗛緳寰峰簡鍘�",
	    "540126": "杈惧瓬鍘�",
	    "540127": "澧ㄧ宸ュ崱鍘�",
	    "540128": "鍏跺畠鍖�",
	    "542100": "鏄岄兘鍦板尯",
	    "542121": "鏄岄兘鍘�",
	    "542122": "姹熻揪鍘�",
	    "542123": "璐¤鍘�",
	    "542124": "绫讳箤榻愬幙",
	    "542125": "涓侀潚鍘�",
	    "542126": "瀵熼泤鍘�",
	    "542127": "鍏鍘�",
	    "542128": "宸﹁础鍘�",
	    "542129": "鑺掑悍鍘�",
	    "542132": "娲涢殕鍘�",
	    "542133": "杈瑰潩鍘�",
	    "542134": "鍏跺畠鍖�",
	    "542200": "灞卞崡鍦板尯",
	    "542221": "涔冧笢鍘�",
	    "542222": "鎵庡泭鍘�",
	    "542223": "璐″槑鍘�",
	    "542224": "妗戞棩鍘�",
	    "542225": "鐞肩粨鍘�",
	    "542226": "鏇叉澗鍘�",
	    "542227": "鎺編鍘�",
	    "542228": "娲涙墡鍘�",
	    "542229": "鍔犳煡鍘�",
	    "542231": "闅嗗瓙鍘�",
	    "542232": "閿欓偅鍘�",
	    "542233": "娴崱瀛愬幙",
	    "542234": "鍏跺畠鍖�",
	    "542300": "鏃ュ杸鍒欏湴鍖�",
	    "542301": "鏃ュ杸鍒欏競",
	    "542322": "鍗楁湪鏋楀幙",
	    "542323": "姹熷瓬鍘�",
	    "542324": "瀹氭棩鍘�",
	    "542325": "钀ㄨ喀鍘�",
	    "542326": "鎷夊瓬鍘�",
	    "542327": "鏄備粊鍘�",
	    "542328": "璋㈤€氶棬鍘�",
	    "542329": "鐧芥湕鍘�",
	    "542330": "浠佸竷鍘�",
	    "542331": "搴烽┈鍘�",
	    "542332": "瀹氱粨鍘�",
	    "542333": "浠插反鍘�",
	    "542334": "浜氫笢鍘�",
	    "542335": "鍚夐殕鍘�",
	    "542336": "鑱傛媺鏈ㄥ幙",
	    "542337": "钀ㄥ槑鍘�",
	    "542338": "宀楀反鍘�",
	    "542339": "鍏跺畠鍖�",
	    "542400": "閭ｆ洸鍦板尯",
	    "542421": "閭ｆ洸鍘�",
	    "542422": "鍢夐粠鍘�",
	    "542423": "姣斿鍘�",
	    "542424": "鑱傝崳鍘�",
	    "542425": "瀹夊鍘�",
	    "542426": "鐢虫墡鍘�",
	    "542427": "绱㈠幙",
	    "542428": "鐝垐鍘�",
	    "542429": "宸撮潚鍘�",
	    "542430": "灏肩帥鍘�",
	    "542431": "鍏跺畠鍖�",
	    "542432": "鍙屾箹鍘�",
	    "542500": "闃块噷鍦板尯",
	    "542521": "鏅叞鍘�",
	    "542522": "鏈揪鍘�",
	    "542523": "鍣跺皵鍘�",
	    "542524": "鏃ュ湡鍘�",
	    "542525": "闈╁悏鍘�",
	    "542526": "鏀瑰垯鍘�",
	    "542527": "鎺嫟鍘�",
	    "542528": "鍏跺畠鍖�",
	    "542600": "鏋楄姖鍦板尯",
	    "542621": "鏋楄姖鍘�",
	    "542622": "宸ュ竷姹熻揪鍘�",
	    "542623": "绫虫灄鍘�",
	    "542624": "澧ㄨ劚鍘�",
	    "542625": "娉㈠瘑鍘�",
	    "542626": "瀵熼殔鍘�",
	    "542627": "鏈楀幙",
	    "542628": "鍏跺畠鍖�",
	    "610000": "闄曡タ鐪�",
	    "610100": "瑗垮畨甯�",
	    "610102": "鏂板煄鍖�",
	    "610103": "纰戞灄鍖�",
	    "610104": "鑾叉箹鍖�",
	    "610111": "鐏炴ˉ鍖�",
	    "610112": "鏈ぎ鍖�",
	    "610113": "闆佸鍖�",
	    "610114": "闃庤壇鍖�",
	    "610115": "涓存郊鍖�",
	    "610116": "闀垮畨鍖�",
	    "610122": "钃濈敯鍘�",
	    "610124": "鍛ㄨ嚦鍘�",
	    "610125": "鎴峰幙",
	    "610126": "楂橀櫟鍘�",
	    "610127": "鍏跺畠鍖�",
	    "610200": "閾滃窛甯�",
	    "610202": "鐜嬬泭鍖�",
	    "610203": "鍗板彴鍖�",
	    "610204": "鑰€宸炲尯",
	    "610222": "瀹滃悰鍘�",
	    "610223": "鍏跺畠鍖�",
	    "610300": "瀹濋浮甯�",
	    "610302": "娓花鍖�",
	    "610303": "閲戝彴鍖�",
	    "610304": "闄堜粨鍖�",
	    "610322": "鍑ょ繑鍘�",
	    "610323": "宀愬北鍘�",
	    "610324": "鎵堕鍘�",
	    "610326": "鐪夊幙",
	    "610327": "闄囧幙",
	    "610328": "鍗冮槼鍘�",
	    "610329": "楹熸父鍘�",
	    "610330": "鍑ゅ幙",
	    "610331": "澶櫧鍘�",
	    "610332": "鍏跺畠鍖�",
	    "610400": "鍜搁槼甯�",
	    "610402": "绉﹂兘鍖�",
	    "610403": "鏉ㄩ櫟鍖�",
	    "610404": "娓煄鍖�",
	    "610422": "涓夊師鍘�",
	    "610423": "娉鹃槼鍘�",
	    "610424": "涔惧幙",
	    "610425": "绀兼硥鍘�",
	    "610426": "姘稿鍘�",
	    "610427": "褰幙",
	    "610428": "闀挎鍘�",
	    "610429": "鏃倯鍘�",
	    "610430": "娣冲寲鍘�",
	    "610431": "姝﹀姛鍘�",
	    "610481": "鍏村钩甯�",
	    "610482": "鍏跺畠鍖�",
	    "610500": "娓崡甯�",
	    "610502": "涓存腑鍖�",
	    "610521": "鍗庡幙",
	    "610522": "娼煎叧鍘�",
	    "610523": "澶ц崝鍘�",
	    "610524": "鍚堥槼鍘�",
	    "610525": "婢勫煄鍘�",
	    "610526": "钂插煄鍘�",
	    "610527": "鐧芥按鍘�",
	    "610528": "瀵屽钩鍘�",
	    "610581": "闊╁煄甯�",
	    "610582": "鍗庨槾甯�",
	    "610583": "鍏跺畠鍖�",
	    "610600": "寤跺畨甯�",
	    "610602": "瀹濆鍖�",
	    "610621": "寤堕暱鍘�",
	    "610622": "寤跺窛鍘�",
	    "610623": "瀛愰暱鍘�",
	    "610624": "瀹夊鍘�",
	    "610625": "蹇椾腹鍘�",
	    "610626": "鍚磋捣鍘�",
	    "610627": "鐢樻硥鍘�",
	    "610628": "瀵屽幙",
	    "610629": "娲涘窛鍘�",
	    "610630": "瀹滃窛鍘�",
	    "610631": "榛勯緳鍘�",
	    "610632": "榛勯櫟鍘�",
	    "610633": "鍏跺畠鍖�",
	    "610700": "姹変腑甯�",
	    "610702": "姹夊彴鍖�",
	    "610721": "鍗楅儜鍘�",
	    "610722": "鍩庡浐鍘�",
	    "610723": "娲嬪幙",
	    "610724": "瑗夸埂鍘�",
	    "610725": "鍕夊幙",
	    "610726": "瀹佸己鍘�",
	    "610727": "鐣ラ槼鍘�",
	    "610728": "闀囧反鍘�",
	    "610729": "鐣欏潩鍘�",
	    "610730": "浣涘潽鍘�",
	    "610731": "鍏跺畠鍖�",
	    "610800": "姒嗘灄甯�",
	    "610802": "姒嗛槼鍖�",
	    "610821": "绁炴湪鍘�",
	    "610822": "搴滆胺鍘�",
	    "610823": "妯北鍘�",
	    "610824": "闈栬竟鍘�",
	    "610825": "瀹氳竟鍘�",
	    "610826": "缁ュ痉鍘�",
	    "610827": "绫宠剛鍘�",
	    "610828": "浣冲幙",
	    "610829": "鍚村牎鍘�",
	    "610830": "娓呮锭鍘�",
	    "610831": "瀛愭床鍘�",
	    "610832": "鍏跺畠鍖�",
	    "610900": "瀹夊悍甯�",
	    "610902": "姹夋花鍖�",
	    "610921": "姹夐槾鍘�",
	    "610922": "鐭虫硥鍘�",
	    "610923": "瀹侀檿鍘�",
	    "610924": "绱槼鍘�",
	    "610925": "宀氱殝鍘�",
	    "610926": "骞冲埄鍘�",
	    "610927": "闀囧潽鍘�",
	    "610928": "鏃槼鍘�",
	    "610929": "鐧芥渤鍘�",
	    "610930": "鍏跺畠鍖�",
	    "611000": "鍟嗘礇甯�",
	    "611002": "鍟嗗窞鍖�",
	    "611021": "娲涘崡鍘�",
	    "611022": "涓瑰嚖鍘�",
	    "611023": "鍟嗗崡鍘�",
	    "611024": "灞遍槼鍘�",
	    "611025": "闀囧畨鍘�",
	    "611026": "鏌炴按鍘�",
	    "611027": "鍏跺畠鍖�",
	    "620000": "鐢樿們鐪�",
	    "620100": "鍏板窞甯�",
	    "620102": "鍩庡叧鍖�",
	    "620103": "涓冮噷娌冲尯",
	    "620104": "瑗垮浐鍖�",
	    "620105": "瀹夊畞鍖�",
	    "620111": "绾㈠彜鍖�",
	    "620121": "姘哥櫥鍘�",
	    "620122": "鐨嬪叞鍘�",
	    "620123": "姒嗕腑鍘�",
	    "620124": "鍏跺畠鍖�",
	    "620200": "鍢夊唱鍏冲競",
	    "620300": "閲戞槍甯�",
	    "620302": "閲戝窛鍖�",
	    "620321": "姘告槍鍘�",
	    "620322": "鍏跺畠鍖�",
	    "620400": "鐧介摱甯�",
	    "620402": "鐧介摱鍖�",
	    "620403": "骞冲窛鍖�",
	    "620421": "闈栬繙鍘�",
	    "620422": "浼氬畞鍘�",
	    "620423": "鏅嘲鍘�",
	    "620424": "鍏跺畠鍖�",
	    "620500": "澶╂按甯�",
	    "620502": "绉﹀窞鍖�",
	    "620503": "楹︾Н鍖�",
	    "620521": "娓呮按鍘�",
	    "620522": "绉﹀畨鍘�",
	    "620523": "鐢樿胺鍘�",
	    "620524": "姝﹀北鍘�",
	    "620525": "寮犲宸濆洖鏃忚嚜娌诲幙",
	    "620526": "鍏跺畠鍖�",
	    "620600": "姝﹀▉甯�",
	    "620602": "鍑夊窞鍖�",
	    "620621": "姘戝嫟鍘�",
	    "620622": "鍙ゆ氮鍘�",
	    "620623": "澶╃钘忔棌鑷不鍘�",
	    "620624": "鍏跺畠鍖�",
	    "620700": "寮犳帠甯�",
	    "620702": "鐢樺窞鍖�",
	    "620721": "鑲冨崡瑁曞浐鏃忚嚜娌诲幙",
	    "620722": "姘戜箰鍘�",
	    "620723": "涓存辰鍘�",
	    "620724": "楂樺彴鍘�",
	    "620725": "灞变腹鍘�",
	    "620726": "鍏跺畠鍖�",
	    "620800": "骞冲噳甯�",
	    "620802": "宕嗗硳鍖�",
	    "620821": "娉惧窛鍘�",
	    "620822": "鐏靛彴鍘�",
	    "620823": "宕囦俊鍘�",
	    "620824": "鍗庝涵鍘�",
	    "620825": "搴勬氮鍘�",
	    "620826": "闈欏畞鍘�",
	    "620827": "鍏跺畠鍖�",
	    "620900": "閰掓硥甯�",
	    "620902": "鑲冨窞鍖�",
	    "620921": "閲戝鍘�",
	    "620922": "鐡滃窞鍘�",
	    "620923": "鑲冨寳钂欏彜鏃忚嚜娌诲幙",
	    "620924": "闃垮厠濉炲搱钀ㄥ厠鏃忚嚜娌诲幙",
	    "620981": "鐜夐棬甯�",
	    "620982": "鏁︾厡甯�",
	    "620983": "鍏跺畠鍖�",
	    "621000": "搴嗛槼甯�",
	    "621002": "瑗垮嘲鍖�",
	    "621021": "搴嗗煄鍘�",
	    "621022": "鐜幙",
	    "621023": "鍗庢睜鍘�",
	    "621024": "鍚堟按鍘�",
	    "621025": "姝ｅ畞鍘�",
	    "621026": "瀹佸幙",
	    "621027": "闀囧師鍘�",
	    "621028": "鍏跺畠鍖�",
	    "621100": "瀹氳タ甯�",
	    "621102": "瀹夊畾鍖�",
	    "621121": "閫氭腑鍘�",
	    "621122": "闄囪タ鍘�",
	    "621123": "娓簮鍘�",
	    "621124": "涓存串鍘�",
	    "621125": "婕冲幙",
	    "621126": "宀峰幙",
	    "621127": "鍏跺畠鍖�",
	    "621200": "闄囧崡甯�",
	    "621202": "姝﹂兘鍖�",
	    "621221": "鎴愬幙",
	    "621222": "鏂囧幙",
	    "621223": "瀹曟槍鍘�",
	    "621224": "搴峰幙",
	    "621225": "瑗垮拰鍘�",
	    "621226": "绀煎幙",
	    "621227": "寰藉幙",
	    "621228": "涓ゅ綋鍘�",
	    "621229": "鍏跺畠鍖�",
	    "622900": "涓村鍥炴棌鑷不宸�",
	    "622901": "涓村甯�",
	    "622921": "涓村鍘�",
	    "622922": "搴蜂箰鍘�",
	    "622923": "姘搁潠鍘�",
	    "622924": "骞挎渤鍘�",
	    "622925": "鍜屾斂鍘�",
	    "622926": "涓滀埂鏃忚嚜娌诲幙",
	    "622927": "绉煶灞变繚瀹夋棌涓滀埂鏃忔拻鎷夋棌鑷不鍘�",
	    "622928": "鍏跺畠鍖�",
	    "623000": "鐢樺崡钘忔棌鑷不宸�",
	    "623001": "鍚堜綔甯�",
	    "623021": "涓存江鍘�",
	    "623022": "鍗撳凹鍘�",
	    "623023": "鑸熸洸鍘�",
	    "623024": "杩儴鍘�",
	    "623025": "鐜涙洸鍘�",
	    "623026": "纰屾洸鍘�",
	    "623027": "澶忔渤鍘�",
	    "623028": "鍏跺畠鍖�",
	    "630000": "闈掓捣鐪�",
	    "630100": "瑗垮畞甯�",
	    "630102": "鍩庝笢鍖�",
	    "630103": "鍩庝腑鍖�",
	    "630104": "鍩庤タ鍖�",
	    "630105": "鍩庡寳鍖�",
	    "630121": "澶ч€氬洖鏃忓湡鏃忚嚜娌诲幙",
	    "630122": "婀熶腑鍘�",
	    "630123": "婀熸簮鍘�",
	    "630124": "鍏跺畠鍖�",
	    "632100": "娴蜂笢甯�",
	    "632121": "骞冲畨鍘�",
	    "632122": "姘戝拰鍥炴棌鍦熸棌鑷不鍘�",
	    "632123": "涔愰兘鍖�",
	    "632126": "浜掑姪鍦熸棌鑷不鍘�",
	    "632127": "鍖栭殕鍥炴棌鑷不鍘�",
	    "632128": "寰寲鎾掓媺鏃忚嚜娌诲幙",
	    "632129": "鍏跺畠鍖�",
	    "632200": "娴峰寳钘忔棌鑷不宸�",
	    "632221": "闂ㄦ簮鍥炴棌鑷不鍘�",
	    "632222": "绁佽繛鍘�",
	    "632223": "娴锋檹鍘�",
	    "632224": "鍒氬療鍘�",
	    "632225": "鍏跺畠鍖�",
	    "632300": "榛勫崡钘忔棌鑷不宸�",
	    "632321": "鍚屼粊鍘�",
	    "632322": "灏栨墡鍘�",
	    "632323": "娉藉簱鍘�",
	    "632324": "娌冲崡钂欏彜鏃忚嚜娌诲幙",
	    "632325": "鍏跺畠鍖�",
	    "632500": "娴峰崡钘忔棌鑷不宸�",
	    "632521": "鍏卞拰鍘�",
	    "632522": "鍚屽痉鍘�",
	    "632523": "璐靛痉鍘�",
	    "632524": "鍏存捣鍘�",
	    "632525": "璐靛崡鍘�",
	    "632526": "鍏跺畠鍖�",
	    "632600": "鏋滄礇钘忔棌鑷不宸�",
	    "632621": "鐜涙瞾鍘�",
	    "632622": "鐝帥鍘�",
	    "632623": "鐢樺痉鍘�",
	    "632624": "杈炬棩鍘�",
	    "632625": "涔呮不鍘�",
	    "632626": "鐜涘鍘�",
	    "632627": "鍏跺畠鍖�",
	    "632700": "鐜夋爲钘忔棌鑷不宸�",
	    "632721": "鐜夋爲甯�",
	    "632722": "鏉傚鍘�",
	    "632723": "绉板鍘�",
	    "632724": "娌诲鍘�",
	    "632725": "鍥婅唉鍘�",
	    "632726": "鏇查夯鑾卞幙",
	    "632727": "鍏跺畠鍖�",
	    "632800": "娴疯タ钂欏彜鏃忚棌鏃忚嚜娌诲窞",
	    "632801": "鏍煎皵鏈ㄥ競",
	    "632802": "寰蜂护鍝堝競",
	    "632821": "涔屽叞鍘�",
	    "632822": "閮藉叞鍘�",
	    "632823": "澶╁郴鍘�",
	    "632824": "鍏跺畠鍖�",
	    "640000": "瀹佸鍥炴棌鑷不鍖�",
	    "640100": "閾跺窛甯�",
	    "640104": "鍏村簡鍖�",
	    "640105": "瑗垮鍖�",
	    "640106": "閲戝嚖鍖�",
	    "640121": "姘稿畞鍘�",
	    "640122": "璐哄叞鍘�",
	    "640181": "鐏垫甯�",
	    "640182": "鍏跺畠鍖�",
	    "640200": "鐭冲槾灞卞競",
	    "640202": "澶ф鍙ｅ尯",
	    "640205": "鎯犲啘鍖�",
	    "640221": "骞崇綏鍘�",
	    "640222": "鍏跺畠鍖�",
	    "640300": "鍚村繝甯�",
	    "640302": "鍒╅€氬尯",
	    "640303": "绾㈠鍫″尯",
	    "640323": "鐩愭睜鍘�",
	    "640324": "鍚屽績鍘�",
	    "640381": "闈掗摐宄″競",
	    "640382": "鍏跺畠鍖�",
	    "640400": "鍥哄師甯�",
	    "640402": "鍘熷窞鍖�",
	    "640422": "瑗垮悏鍘�",
	    "640423": "闅嗗痉鍘�",
	    "640424": "娉炬簮鍘�",
	    "640425": "褰槼鍘�",
	    "640426": "鍏跺畠鍖�",
	    "640500": "涓崼甯�",
	    "640502": "娌欏潯澶村尯",
	    "640521": "涓畞鍘�",
	    "640522": "娴峰師鍘�",
	    "640523": "鍏跺畠鍖�",
	    "650000": "鏂扮枂缁村惥灏旇嚜娌诲尯",
	    "650100": "涔岄瞾鏈ㄩ綈甯�",
	    "650102": "澶╁北鍖�",
	    "650103": "娌欎緷宸村厠鍖�",
	    "650104": "鏂板競鍖�",
	    "650105": "姘寸（娌熷尯",
	    "650106": "澶村悲娌冲尯",
	    "650107": "杈惧潅鍩庡尯",
	    "650109": "绫充笢鍖�",
	    "650121": "涔岄瞾鏈ㄩ綈鍘�",
	    "650122": "鍏跺畠鍖�",
	    "650200": "鍏嬫媺鐜涗緷甯�",
	    "650202": "鐙北瀛愬尯",
	    "650203": "鍏嬫媺鐜涗緷鍖�",
	    "650204": "鐧界⒈婊╁尯",
	    "650205": "涔屽皵绂惧尯",
	    "650206": "鍏跺畠鍖�",
	    "652100": "鍚愰瞾鐣湴鍖�",
	    "652101": "鍚愰瞾鐣競",
	    "652122": "閯杽鍘�",
	    "652123": "鎵樺厠閫婂幙",
	    "652124": "鍏跺畠鍖�",
	    "652200": "鍝堝瘑鍦板尯",
	    "652201": "鍝堝瘑甯�",
	    "652222": "宸撮噷鍧ゅ搱钀ㄥ厠鑷不鍘�",
	    "652223": "浼婂惥鍘�",
	    "652224": "鍏跺畠鍖�",
	    "652300": "鏄屽悏鍥炴棌鑷不宸�",
	    "652301": "鏄屽悏甯�",
	    "652302": "闃滃悍甯�",
	    "652323": "鍛煎浘澹佸幙",
	    "652324": "鐜涚撼鏂幙",
	    "652325": "濂囧彴鍘�",
	    "652327": "鍚夋湪钀ㄥ皵鍘�",
	    "652328": "鏈ㄥ瀿鍝堣惃鍏嬭嚜娌诲幙",
	    "652329": "鍏跺畠鍖�",
	    "652700": "鍗氬皵濉旀媺钂欏彜鑷不宸�",
	    "652701": "鍗氫箰甯�",
	    "652702": "闃挎媺灞卞彛甯�",
	    "652722": "绮炬渤鍘�",
	    "652723": "娓╂硥鍘�",
	    "652724": "鍏跺畠鍖�",
	    "652800": "宸撮煶閮钂欏彜鑷不宸�",
	    "652801": "搴撳皵鍕掑競",
	    "652822": "杞彴鍘�",
	    "652823": "灏夌妬鍘�",
	    "652824": "鑻ョ緦鍘�",
	    "652825": "涓旀湯鍘�",
	    "652826": "鐒夎€嗗洖鏃忚嚜娌诲幙",
	    "652827": "鍜岄潤鍘�",
	    "652828": "鍜岀鍘�",
	    "652829": "鍗氭箹鍘�",
	    "652830": "鍏跺畠鍖�",
	    "652900": "闃垮厠鑻忓湴鍖�",
	    "652901": "闃垮厠鑻忓競",
	    "652922": "娓╁鍘�",
	    "652923": "搴撹溅鍘�",
	    "652924": "娌欓泤鍘�",
	    "652925": "鏂板拰鍘�",
	    "652926": "鎷滃煄鍘�",
	    "652927": "涔屼粈鍘�",
	    "652928": "闃跨摝鎻愬幙",
	    "652929": "鏌潽鍘�",
	    "652930": "鍏跺畠鍖�",
	    "653000": "鍏嬪瓬鍕掕嫃鏌皵鍏嬪瓬鑷不宸�",
	    "653001": "闃垮浘浠€甯�",
	    "653022": "闃垮厠闄跺幙",
	    "653023": "闃垮悎濂囧幙",
	    "653024": "涔屾伆鍘�",
	    "653025": "鍏跺畠鍖�",
	    "653100": "鍠€浠€鍦板尯",
	    "653101": "鍠€浠€甯�",
	    "653121": "鐤忛檮鍘�",
	    "653122": "鐤忓嫆鍘�",
	    "653123": "鑻卞悏娌欏幙",
	    "653124": "娉芥櫘鍘�",
	    "653125": "鑾庤溅鍘�",
	    "653126": "鍙跺煄鍘�",
	    "653127": "楹︾洊鎻愬幙",
	    "653128": "宀虫櫘婀栧幙",
	    "653129": "浼藉笀鍘�",
	    "653130": "宸存鍘�",
	    "653131": "濉斾粈搴撳皵骞插鍚夊厠鑷不鍘�",
	    "653132": "鍏跺畠鍖�",
	    "653200": "鍜岀敯鍦板尯",
	    "653201": "鍜岀敯甯�",
	    "653221": "鍜岀敯鍘�",
	    "653222": "澧ㄧ帀鍘�",
	    "653223": "鐨北鍘�",
	    "653224": "娲涙郸鍘�",
	    "653225": "绛栧嫆鍘�",
	    "653226": "浜庣敯鍘�",
	    "653227": "姘戜赴鍘�",
	    "653228": "鍏跺畠鍖�",
	    "654000": "浼婄妬鍝堣惃鍏嬭嚜娌诲窞",
	    "654002": "浼婂畞甯�",
	    "654003": "濂庡悲甯�",
	    "654021": "浼婂畞鍘�",
	    "654022": "瀵熷竷鏌ュ皵閿′集鑷不鍘�",
	    "654023": "闇嶅煄鍘�",
	    "654024": "宸╃暀鍘�",
	    "654025": "鏂版簮鍘�",
	    "654026": "鏄嫃鍘�",
	    "654027": "鐗瑰厠鏂幙",
	    "654028": "灏煎嫆鍏嬪幙",
	    "654029": "鍏跺畠鍖�",
	    "654200": "濉斿煄鍦板尯",
	    "654201": "濉斿煄甯�",
	    "654202": "涔岃嫃甯�",
	    "654221": "棰濇晱鍘�",
	    "654223": "娌欐咕鍘�",
	    "654224": "鎵橀噷鍘�",
	    "654225": "瑁曟皯鍘�",
	    "654226": "鍜屽竷鍏嬭禌灏旇挋鍙よ嚜娌诲幙",
	    "654227": "鍏跺畠鍖�",
	    "654300": "闃垮嫆娉板湴鍖�",
	    "654301": "闃垮嫆娉板競",
	    "654321": "甯冨皵娲ュ幙",
	    "654322": "瀵岃暣鍘�",
	    "654323": "绂忔捣鍘�",
	    "654324": "鍝堝反娌冲幙",
	    "654325": "闈掓渤鍘�",
	    "654326": "鍚夋湪涔冨幙",
	    "654327": "鍏跺畠鍖�",
	    "659001": "鐭虫渤瀛愬競",
	    "659002": "闃挎媺灏斿競",
	    "659003": "鍥炬湪鑸掑厠甯�",
	    "659004": "浜斿娓犲競",
	    "710000": "鍙版咕",
	    "710100": "鍙板寳甯�",
	    "710101": "涓鍖�",
	    "710102": "澶у悓鍖�",
	    "710103": "涓北鍖�",
	    "710104": "鏉惧北鍖�",
	    "710105": "澶у畨鍖�",
	    "710106": "涓囧崕鍖�",
	    "710107": "淇′箟鍖�",
	    "710108": "澹灄鍖�",
	    "710109": "鍖楁姇鍖�",
	    "710110": "鍐呮箹鍖�",
	    "710111": "鍗楁腐鍖�",
	    "710112": "鏂囧北鍖�",
	    "710113": "鍏跺畠鍖�",
	    "710200": "楂橀泟甯�",
	    "710201": "鏂板叴鍖�",
	    "710202": "鍓嶉噾鍖�",
	    "710203": "鑺╅泤鍖�",
	    "710204": "鐩愬煏鍖�",
	    "710205": "榧撳北鍖�",
	    "710206": "鏃楁触鍖�",
	    "710207": "鍓嶉晣鍖�",
	    "710208": "涓夋皯鍖�",
	    "710209": "宸﹁惀鍖�",
	    "710210": "妤犳鍖�",
	    "710211": "灏忔腐鍖�",
	    "710212": "鍏跺畠鍖�",
	    "710241": "鑻撻泤鍖�",
	    "710242": "浠佹鍖�",
	    "710243": "澶хぞ鍖�",
	    "710244": "鍐堝北鍖�",
	    "710245": "璺鍖�",
	    "710246": "闃胯幉鍖�",
	    "710247": "鐢板鍖�",
	    "710248": "鐕曞发鍖�",
	    "710249": "妗ュご鍖�",
	    "710250": "姊撳畼鍖�",
	    "710251": "寮ラ檧鍖�",
	    "710252": "姘稿畨鍖�",
	    "710253": "婀栧唴鍖�",
	    "710254": "鍑ゅ北鍖�",
	    "710255": "澶у鍖�",
	    "710256": "鏋楀洯鍖�",
	    "710257": "楦熸澗鍖�",
	    "710258": "澶ф爲鍖�",
	    "710259": "鏃楀北鍖�",
	    "710260": "缇庢祿鍖�",
	    "710261": "鍏緹鍖�",
	    "710262": "鍐呴棬鍖�",
	    "710263": "鏉夋灄鍖�",
	    "710264": "鐢蹭粰鍖�",
	    "710265": "妗冩簮鍖�",
	    "710266": "閭ｇ帥澶忓尯",
	    "710267": "鑼傛灄鍖�",
	    "710268": "鑼勮悾鍖�",
	    "710300": "鍙板崡甯�",
	    "710301": "涓タ鍖�",
	    "710302": "涓滃尯",
	    "710303": "鍗楀尯",
	    "710304": "鍖楀尯",
	    "710305": "瀹夊钩鍖�",
	    "710306": "瀹夊崡鍖�",
	    "710307": "鍏跺畠鍖�",
	    "710339": "姘稿悍鍖�",
	    "710340": "褰掍粊鍖�",
	    "710341": "鏂板寲鍖�",
	    "710342": "宸﹂晣鍖�",
	    "710343": "鐜変簳鍖�",
	    "710344": "妤犺タ鍖�",
	    "710345": "鍗楀寲鍖�",
	    "710346": "浠佸痉鍖�",
	    "710347": "鍏冲簷鍖�",
	    "710348": "榫欏磶鍖�",
	    "710349": "瀹樼敯鍖�",
	    "710350": "楹昏眴鍖�",
	    "710351": "浣抽噷鍖�",
	    "710352": "瑗挎腐鍖�",
	    "710353": "涓冭偂鍖�",
	    "710354": "灏嗗啗鍖�",
	    "710355": "瀛︾敳鍖�",
	    "710356": "鍖楅棬鍖�",
	    "710357": "鏂拌惀鍖�",
	    "710358": "鍚庡鍖�",
	    "710359": "鐧芥渤鍖�",
	    "710360": "涓滃北鍖�",
	    "710361": "鍏敳鍖�",
	    "710362": "涓嬭惀鍖�",
	    "710363": "鏌宠惀鍖�",
	    "710364": "鐩愭按鍖�",
	    "710365": "鍠勫寲鍖�",
	    "710366": "澶у唴鍖�",
	    "710367": "灞变笂鍖�",
	    "710368": "鏂板競鍖�",
	    "710369": "瀹夊畾鍖�",
	    "710400": "鍙颁腑甯�",
	    "710401": "涓尯",
	    "710402": "涓滃尯",
	    "710403": "鍗楀尯",
	    "710404": "瑗垮尯",
	    "710405": "鍖楀尯",
	    "710406": "鍖楀悲鍖�",
	    "710407": "瑗垮悲鍖�",
	    "710408": "鍗楀悲鍖�",
	    "710409": "鍏跺畠鍖�",
	    "710431": "澶钩鍖�",
	    "710432": "澶ч噷鍖�",
	    "710433": "闆惧嘲鍖�",
	    "710434": "涔屾棩鍖�",
	    "710435": "涓板師鍖�",
	    "710436": "鍚庨噷鍖�",
	    "710437": "鐭冲唸鍖�",
	    "710438": "涓滃娍鍖�",
	    "710439": "鍜屽钩鍖�",
	    "710440": "鏂扮ぞ鍖�",
	    "710441": "娼瓙鍖�",
	    "710442": "澶ч泤鍖�",
	    "710443": "绁炲唸鍖�",
	    "710444": "澶ц倸鍖�",
	    "710445": "娌欓箍鍖�",
	    "710446": "榫欎簳鍖�",
	    "710447": "姊ф爾鍖�",
	    "710448": "娓呮按鍖�",
	    "710449": "澶х敳鍖�",
	    "710450": "澶栧煍鍖�",
	    "710451": "澶у畨鍖�",
	    "710500": "閲戦棬鍘�",
	    "710507": "閲戞矙闀�",
	    "710508": "閲戞箹闀�",
	    "710509": "閲戝畞涔�",
	    "710510": "閲戝煄闀�",
	    "710511": "鐑堝笨涔�",
	    "710512": "涔屽澋涔�",
	    "710600": "鍗楁姇鍘�",
	    "710614": "鍗楁姇甯�",
	    "710615": "涓涔�",
	    "710616": "鑽夊悲闀�",
	    "710617": "鍥藉涔�",
	    "710618": "鍩旈噷闀�",
	    "710619": "浠佺埍涔�",
	    "710620": "鍚嶉棿涔�",
	    "710621": "闆嗛泦闀�",
	    "710622": "姘撮噷涔�",
	    "710623": "楸兼睜涔�",
	    "710624": "淇′箟涔�",
	    "710625": "绔瑰北闀�",
	    "710626": "楣胯胺涔�",
	    "710700": "鍩洪殕甯�",
	    "710701": "浠佺埍鍖�",
	    "710702": "淇′箟鍖�",
	    "710703": "涓鍖�",
	    "710704": "涓北鍖�",
	    "710705": "瀹変箰鍖�",
	    "710706": "鏆栨殩鍖�",
	    "710707": "涓冨牭鍖�",
	    "710708": "鍏跺畠鍖�",
	    "710800": "鏂扮甯�",
	    "710801": "涓滃尯",
	    "710802": "鍖楀尯",
	    "710803": "棣欏北鍖�",
	    "710804": "鍏跺畠鍖�",
	    "710900": "鍢変箟甯�",
	    "710901": "涓滃尯",
	    "710902": "瑗垮尯",
	    "710903": "鍏跺畠鍖�",
	    "711100": "鏂板寳甯�",
	    "711130": "涓囬噷鍖�",
	    "711131": "閲戝北鍖�",
	    "711132": "鏉挎ˉ鍖�",
	    "711133": "姹愭鍖�",
	    "711134": "娣卞潙鍖�",
	    "711135": "鐭崇鍖�",
	    "711136": "鐟炶姵鍖�",
	    "711137": "骞虫邯鍖�",
	    "711138": "鍙屾邯鍖�",
	    "711139": "璐″鍖�",
	    "711140": "鏂板簵鍖�",
	    "711141": "鍧灄鍖�",
	    "711142": "涔屾潵鍖�",
	    "711143": "姘稿拰鍖�",
	    "711144": "涓拰鍖�",
	    "711145": "鍦熷煄鍖�",
	    "711146": "涓夊场鍖�",
	    "711147": "鏍戞灄鍖�",
	    "711148": "鑾烘瓕鍖�",
	    "711149": "涓夐噸鍖�",
	    "711150": "鏂板簞鍖�",
	    "711151": "娉板北鍖�",
	    "711152": "鏋楀彛鍖�",
	    "711153": "鑺︽床鍖�",
	    "711154": "浜旇偂鍖�",
	    "711155": "鍏噷鍖�",
	    "711156": "娣℃按鍖�",
	    "711157": "涓夎姖鍖�",
	    "711158": "鐭抽棬鍖�",
	    "711200": "瀹滃叞鍘�",
	    "711214": "瀹滃叞甯�",
	    "711215": "澶村煄闀�",
	    "711216": "绀佹邯涔�",
	    "711217": "澹洿涔�",
	    "711218": "鍛樺北涔�",
	    "711219": "缃椾笢闀�",
	    "711220": "涓夋槦涔�",
	    "711221": "澶у悓涔�",
	    "711222": "浜旂粨涔�",
	    "711223": "鍐北涔�",
	    "711224": "鑻忔境闀�",
	    "711225": "鍗楁境涔�",
	    "711226": "閽撻奔鍙�",
	    "711300": "鏂扮鍘�",
	    "711314": "绔瑰寳甯�",
	    "711315": "婀栧彛涔�",
	    "711316": "鏂颁赴涔�",
	    "711317": "鏂板煍闀�",
	    "711318": "鍏宠タ闀�",
	    "711319": "鑺庢灄涔�",
	    "711320": "瀹濆北涔�",
	    "711321": "绔逛笢闀�",
	    "711322": "浜斿嘲涔�",
	    "711323": "妯北涔�",
	    "711324": "灏栫煶涔�",
	    "711325": "鍖楀煍涔�",
	    "711326": "宄ㄧ湁涔�",
	    "711400": "妗冨洯鍘�",
	    "711414": "涓潨甯�",
	    "711415": "骞抽晣甯�",
	    "711416": "榫欐江涔�",
	    "711417": "鏉ㄦ甯�",
	    "711418": "鏂板眿涔�",
	    "711419": "瑙傞煶涔�",
	    "711420": "妗冨洯甯�",
	    "711421": "榫熷北涔�",
	    "711422": "鍏痉甯�",
	    "711423": "澶ф邯闀�",
	    "711424": "澶嶅叴涔�",
	    "711425": "澶у洯涔�",
	    "711426": "鑺︾涔�",
	    "711500": "鑻楁牀鍘�",
	    "711519": "绔瑰崡闀�",
	    "711520": "澶翠唤闀�",
	    "711521": "涓夋咕涔�",
	    "711522": "鍗楀簞涔�",
	    "711523": "鐙江涔�",
	    "711524": "鍚庨緳闀�",
	    "711525": "閫氶渼闀�",
	    "711526": "鑻戦噷闀�",
	    "711527": "鑻楁牀甯�",
	    "711528": "閫犳ˉ涔�",
	    "711529": "澶村眿涔�",
	    "711530": "鍏涔�",
	    "711531": "澶ф箹涔�",
	    "711532": "娉板畨涔�",
	    "711533": "閾滈敚涔�",
	    "711534": "涓変箟涔�",
	    "711535": "瑗挎箹涔�",
	    "711536": "鍗撳叞闀�",
	    "711700": "褰板寲鍘�",
	    "711727": "褰板寲甯�",
	    "711728": "鑺洯涔�",
	    "711729": "鑺卞潧涔�",
	    "711730": "绉€姘翠埂",
	    "711731": "楣挎腐闀�",
	    "711732": "绂忓叴涔�",
	    "711733": "绾胯タ涔�",
	    "711734": "鍜岀編闀�",
	    "711735": "浼告腐涔�",
	    "711736": "鍛樻灄闀�",
	    "711737": "绀惧ご涔�",
	    "711738": "姘搁潠涔�",
	    "711739": "鍩斿績涔�",
	    "711740": "婧箹闀�",
	    "711741": "澶ф潙涔�",
	    "711742": "鍩旂洂涔�",
	    "711743": "鐢颁腑闀�",
	    "711744": "鍖楁枟闀�",
	    "711745": "鐢板熬涔�",
	    "711746": "鍩ゅご涔�",
	    "711747": "婧窞涔�",
	    "711748": "绔瑰涔�",
	    "711749": "浜屾灄闀�",
	    "711750": "澶у煄涔�",
	    "711751": "鑺宠嫅涔�",
	    "711752": "浜屾按涔�",
	    "711900": "鍢変箟鍘�",
	    "711919": "鐣矾涔�",
	    "711920": "姊呭北涔�",
	    "711921": "绔瑰磶涔�",
	    "711922": "闃块噷灞变埂",
	    "711923": "涓煍涔�",
	    "711924": "澶у煍涔�",
	    "711925": "姘翠笂涔�",
	    "711926": "楣胯崏涔�",
	    "711927": "澶繚甯�",
	    "711928": "鏈村瓙甯�",
	    "711929": "涓滅煶涔�",
	    "711930": "鍏剼涔�",
	    "711931": "鏂版腐涔�",
	    "711932": "姘戦泟涔�",
	    "711933": "澶ф灄闀�",
	    "711934": "婧彛涔�",
	    "711935": "涔夌涔�",
	    "711936": "甯冭闀�",
	    "712100": "浜戞灄鍘�",
	    "712121": "鏂楀崡闀�",
	    "712122": "澶у煠涔�",
	    "712123": "铏庡熬闀�",
	    "712124": "鍦熷簱闀�",
	    "712125": "瑜掑繝涔�",
	    "712126": "涓滃娍涔�",
	    "712127": "鍙拌タ涔�",
	    "712128": "浠戣儗涔�",
	    "712129": "楹﹀涔�",
	    "712130": "鏂楀叚甯�",
	    "712131": "鏋楀唴涔�",
	    "712132": "鍙ゅ潙涔�",
	    "712133": "鑾挎涔�",
	    "712134": "瑗胯灪闀�",
	    "712135": "浜屼粦涔�",
	    "712136": "鍖楁腐闀�",
	    "712137": "姘存灄涔�",
	    "712138": "鍙ｆ箹涔�",
	    "712139": "鍥涙箹涔�",
	    "712140": "鍏冮暱涔�",
	    "712400": "灞忎笢鍘�",
	    "712434": "灞忎笢甯�",
	    "712435": "涓夊湴闂ㄤ埂",
	    "712436": "闆惧彴涔�",
	    "712437": "鐜涘涔�",
	    "712438": "涔濆涔�",
	    "712439": "閲屾腐涔�",
	    "712440": "楂樻爲涔�",
	    "712441": "鐩愬煍涔�",
	    "712442": "闀挎不涔�",
	    "712443": "楹熸礇涔�",
	    "712444": "绔圭敯涔�",
	    "712445": "鍐呭煍涔�",
	    "712446": "涓囦腹涔�",
	    "712447": "娼窞闀�",
	    "712448": "娉版涔�",
	    "712449": "鏉ヤ箟涔�",
	    "712450": "涓囧肠涔�",
	    "712451": "宕侀《涔�",
	    "712452": "鏂板煠涔�",
	    "712453": "鍗楀窞涔�",
	    "712454": "鏋楄竟涔�",
	    "712455": "涓滄腐闀�",
	    "712456": "鐞夌悆涔�",
	    "712457": "浣冲啲涔�",
	    "712458": "鏂板洯涔�",
	    "712459": "鏋嬪涔�",
	    "712460": "鏋嬪北涔�",
	    "712461": "鏄ユ棩涔�",
	    "712462": "鐙瓙涔�",
	    "712463": "杞﹀煄涔�",
	    "712464": "鐗′腹涔�",
	    "712465": "鎭掓槬闀�",
	    "712466": "婊″窞涔�",
	    "712500": "鍙颁笢鍘�",
	    "712517": "鍙颁笢甯�",
	    "712518": "缁垮矝涔�",
	    "712519": "鍏板笨涔�",
	    "712520": "寤跺钩涔�",
	    "712521": "鍗戝崡涔�",
	    "712522": "楣块噹涔�",
	    "712523": "鍏冲北闀�",
	    "712524": "娴风涔�",
	    "712525": "姹犱笂涔�",
	    "712526": "涓滄渤涔�",
	    "712527": "鎴愬姛闀�",
	    "712528": "闀挎花涔�",
	    "712529": "閲戝嘲涔�",
	    "712530": "澶ф涔�",
	    "712531": "杈句粊涔�",
	    "712532": "澶夯閲屼埂",
	    "712600": "鑺辫幉鍘�",
	    "712615": "鑺辫幉甯�",
	    "712616": "鏂板煄涔�",
	    "712617": "澶瞾闃�",
	    "712618": "绉€鏋椾埂",
	    "712619": "鍚夊畨涔�",
	    "712620": "瀵夸赴涔�",
	    "712621": "鍑ゆ灄闀�",
	    "712622": "鍏夊涔�",
	    "712623": "涓版花涔�",
	    "712624": "鐟炵涔�",
	    "712625": "涓囪崳涔�",
	    "712626": "鐜夐噷闀�",
	    "712627": "鍗撴邯涔�",
	    "712628": "瀵岄噷涔�",
	    "712700": "婢庢箹鍘�",
	    "712707": "椹叕甯�",
	    "712708": "瑗垮笨涔�",
	    "712709": "鏈涘畨涔�",
	    "712710": "涓冪編涔�",
	    "712711": "鐧芥矙涔�",
	    "712712": "婀栬タ涔�",
	    "712800": "杩炴睙鍘�",
	    "712805": "鍗楃涔�",
	    "712806": "鍖楃涔�",
	    "712807": "鑾掑厜涔�",
	    "712808": "涓滃紩涔�",
	    "810000": "棣欐腐鐗瑰埆琛屾斂鍖�",
	    "810100": "棣欐腐宀�",
	    "810101": "涓タ鍖�",
	    "810102": "婀句粩",
	    "810103": "涓滃尯",
	    "810104": "鍗楀尯",
	    "810200": "涔濋緳",
	    "810201": "涔濋緳鍩庡尯",
	    "810202": "娌瑰皷鏃哄尯",
	    "810203": "娣辨按鍩楀尯",
	    "810204": "榛勫ぇ浠欏尯",
	    "810205": "瑙傚鍖�",
	    "810300": "鏂扮晫",
	    "810301": "鍖楀尯",
	    "810302": "澶у煍鍖�",
	    "810303": "娌欑敯鍖�",
	    "810304": "瑗胯础鍖�",
	    "810305": "鍏冩湕鍖�",
	    "810306": "灞棬鍖�",
	    "810307": "鑽冩咕鍖�",
	    "810308": "钁甸潚鍖�",
	    "810309": "绂诲矝鍖�",
	    "820000": "婢抽棬鐗瑰埆琛屾斂鍖�",
	    "820100": "婢抽棬鍗婂矝",
	    "820200": "绂诲矝",
	    "990000": "娴峰",
	    "990100": "娴峰"
	}

	// id pid/parentId name children
	function tree(list) {
	    var mapped = {}
	    for (var i = 0, item; i < list.length; i++) {
	        item = list[i]
	        if (!item || !item.id) continue
	        mapped[item.id] = item
	    }

	    var result = []
	    for (var ii = 0; ii < list.length; ii++) {
	        item = list[ii]

	        if (!item) continue
	            /* jshint -W041 */
	        if (item.pid == undefined && item.parentId == undefined) {
	            result.push(item)
	            continue
	        }
	        var parent = mapped[item.pid] || mapped[item.parentId]
	        if (!parent) continue
	        if (!parent.children) parent.children = []
	        parent.children.push(item)
	    }
	    return result
	}

	var DICT_FIXED = function() {
	    var fixed = []
	    for (var id in DICT) {
	        var pid = id.slice(2, 6) === '0000' ? undefined :
	            id.slice(4, 6) == '00' ? (id.slice(0, 2) + '0000') :
	            id.slice(0, 4) + '00'
	        fixed.push({
	            id: id,
	            pid: pid,
	            name: DICT[id]
	        })
	    }
	    return tree(fixed)
	}()

	module.exports = DICT_FIXED

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## Miscellaneous
	*/
	var DICT = __webpack_require__(18)
	module.exports = {
		// Dice
		d4: function() {
			return this.natural(1, 4)
		},
		d6: function() {
			return this.natural(1, 6)
		},
		d8: function() {
			return this.natural(1, 8)
		},
		d12: function() {
			return this.natural(1, 12)
		},
		d20: function() {
			return this.natural(1, 20)
		},
		d100: function() {
			return this.natural(1, 100)
		},
		/*
		    闅忔満鐢熸垚涓€涓� GUID銆�

		    http://www.broofa.com/2008/09/javascript-uuid-function/
		    [UUID 瑙勮寖](http://www.ietf.org/rfc/rfc4122.txt)
		        UUIDs (Universally Unique IDentifier)
		        GUIDs (Globally Unique IDentifier)
		        The formal definition of the UUID string representation is provided by the following ABNF [7]:
		            UUID                   = time-low "-" time-mid "-"
		                                   time-high-and-version "-"
		                                   clock-seq-and-reserved
		                                   clock-seq-low "-" node
		            time-low               = 4hexOctet
		            time-mid               = 2hexOctet
		            time-high-and-version  = 2hexOctet
		            clock-seq-and-reserved = hexOctet
		            clock-seq-low          = hexOctet
		            node                   = 6hexOctet
		            hexOctet               = hexDigit hexDigit
		            hexDigit =
		                "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
		                "a" / "b" / "c" / "d" / "e" / "f" /
		                "A" / "B" / "C" / "D" / "E" / "F"
		    
		    https://github.com/victorquinn/chancejs/blob/develop/chance.js#L1349
		*/
		guid: function() {
			var pool = "abcdefABCDEF1234567890",
				guid = this.string(pool, 8) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 4) + '-' +
				this.string(pool, 12);
			return guid
		},
		uuid: function() {
			return this.guid()
		},
		/*
		    闅忔満鐢熸垚涓€涓� 18 浣嶈韩浠借瘉銆�

		    [韬唤璇乚(http://baike.baidu.com/view/1697.htm#4)
		        鍦板潃鐮� 6 + 鍑虹敓鏃ユ湡鐮� 8 + 椤哄簭鐮� 3 + 鏍￠獙鐮� 1
		    [銆婁腑鍗庝汉姘戝叡鍜屽浗琛屾斂鍖哄垝浠ｇ爜銆嬪浗瀹舵爣鍑�(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)
		*/
		id: function() {
			var id,
				sum = 0,
				rank = [
					"7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"
				],
				last = [
					"1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"
				]

			id = this.pick(DICT).id +
				this.date('yyyyMMdd') +
				this.string('number', 3)

			for (var i = 0; i < id.length; i++) {
				sum += id[i] * rank[i];
			}
			id += last[sum % 11];

			return id
		},

		/*
		    鐢熸垚涓€涓叏灞€鐨勮嚜澧炴暣鏁般€�
		    绫讳技鑷涓婚敭锛坅uto increment primary key锛夈€�
		*/
		increment: function() {
			var key = 0
			return function(step) {
				return key += (+step || 1) // step?
			}
		}(),
		inc: function(step) {
			return this.increment(step)
		}
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Parser = __webpack_require__(21)
	var Handler = __webpack_require__(22)
	module.exports = {
		Parser: Parser,
		Handler: Handler
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	// https://github.com/nuysoft/regexp
	// forked from https://github.com/ForbesLindesay/regexp

	function parse(n) {
	    if ("string" != typeof n) {
	        var l = new TypeError("The regexp to parse must be represented as a string.");
	        throw l;
	    }
	    return index = 1, cgs = {}, parser.parse(n);
	}

	function Token(n) {
	    this.type = n, this.offset = Token.offset(), this.text = Token.text();
	}

	function Alternate(n, l) {
	    Token.call(this, "alternate"), this.left = n, this.right = l;
	}

	function Match(n) {
	    Token.call(this, "match"), this.body = n.filter(Boolean);
	}

	function Group(n, l) {
	    Token.call(this, n), this.body = l;
	}

	function CaptureGroup(n) {
	    Group.call(this, "capture-group"), this.index = cgs[this.offset] || (cgs[this.offset] = index++), 
	    this.body = n;
	}

	function Quantified(n, l) {
	    Token.call(this, "quantified"), this.body = n, this.quantifier = l;
	}

	function Quantifier(n, l) {
	    Token.call(this, "quantifier"), this.min = n, this.max = l, this.greedy = !0;
	}

	function CharSet(n, l) {
	    Token.call(this, "charset"), this.invert = n, this.body = l;
	}

	function CharacterRange(n, l) {
	    Token.call(this, "range"), this.start = n, this.end = l;
	}

	function Literal(n) {
	    Token.call(this, "literal"), this.body = n, this.escaped = this.body != this.text;
	}

	function Unicode(n) {
	    Token.call(this, "unicode"), this.code = n.toUpperCase();
	}

	function Hex(n) {
	    Token.call(this, "hex"), this.code = n.toUpperCase();
	}

	function Octal(n) {
	    Token.call(this, "octal"), this.code = n.toUpperCase();
	}

	function BackReference(n) {
	    Token.call(this, "back-reference"), this.code = n.toUpperCase();
	}

	function ControlCharacter(n) {
	    Token.call(this, "control-character"), this.code = n.toUpperCase();
	}

	var parser = function() {
	    function n(n, l) {
	        function u() {
	            this.constructor = n;
	        }
	        u.prototype = l.prototype, n.prototype = new u();
	    }
	    function l(n, l, u, t, r) {
	        function e(n, l) {
	            function u(n) {
	                function l(n) {
	                    return n.charCodeAt(0).toString(16).toUpperCase();
	                }
	                return n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(n) {
	                    return "\\x0" + l(n);
	                }).replace(/[\x10-\x1F\x80-\xFF]/g, function(n) {
	                    return "\\x" + l(n);
	                }).replace(/[\u0180-\u0FFF]/g, function(n) {
	                    return "\\u0" + l(n);
	                }).replace(/[\u1080-\uFFFF]/g, function(n) {
	                    return "\\u" + l(n);
	                });
	            }
	            var t, r;
	            switch (n.length) {
	              case 0:
	                t = "end of input";
	                break;

	              case 1:
	                t = n[0];
	                break;

	              default:
	                t = n.slice(0, -1).join(", ") + " or " + n[n.length - 1];
	            }
	            return r = l ? '"' + u(l) + '"' : "end of input", "Expected " + t + " but " + r + " found.";
	        }
	        this.expected = n, this.found = l, this.offset = u, this.line = t, this.column = r, 
	        this.name = "SyntaxError", this.message = e(n, l);
	    }
	    function u(n) {
	        function u() {
	            return n.substring(Lt, qt);
	        }
	        function t() {
	            return Lt;
	        }
	        function r(l) {
	            function u(l, u, t) {
	                var r, e;
	                for (r = u; t > r; r++) e = n.charAt(r), "\n" === e ? (l.seenCR || l.line++, l.column = 1, 
	                l.seenCR = !1) : "\r" === e || "\u2028" === e || "\u2029" === e ? (l.line++, l.column = 1, 
	                l.seenCR = !0) : (l.column++, l.seenCR = !1);
	            }
	            return Mt !== l && (Mt > l && (Mt = 0, Dt = {
	                line: 1,
	                column: 1,
	                seenCR: !1
	            }), u(Dt, Mt, l), Mt = l), Dt;
	        }
	        function e(n) {
	            Ht > qt || (qt > Ht && (Ht = qt, Ot = []), Ot.push(n));
	        }
	        function o(n) {
	            var l = 0;
	            for (n.sort(); l < n.length; ) n[l - 1] === n[l] ? n.splice(l, 1) : l++;
	        }
	        function c() {
	            var l, u, t, r, o;
	            return l = qt, u = i(), null !== u ? (t = qt, 124 === n.charCodeAt(qt) ? (r = fl, 
	            qt++) : (r = null, 0 === Wt && e(sl)), null !== r ? (o = c(), null !== o ? (r = [ r, o ], 
	            t = r) : (qt = t, t = il)) : (qt = t, t = il), null === t && (t = al), null !== t ? (Lt = l, 
	            u = hl(u, t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, 
	            l = il), l;
	        }
	        function i() {
	            var n, l, u, t, r;
	            if (n = qt, l = f(), null === l && (l = al), null !== l) if (u = qt, Wt++, t = d(), 
	            Wt--, null === t ? u = al : (qt = u, u = il), null !== u) {
	                for (t = [], r = h(), null === r && (r = a()); null !== r; ) t.push(r), r = h(), 
	                null === r && (r = a());
	                null !== t ? (r = s(), null === r && (r = al), null !== r ? (Lt = n, l = dl(l, t, r), 
	                null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il);
	            } else qt = n, n = il; else qt = n, n = il;
	            return n;
	        }
	        function a() {
	            var n;
	            return n = x(), null === n && (n = Q(), null === n && (n = B())), n;
	        }
	        function f() {
	            var l, u;
	            return l = qt, 94 === n.charCodeAt(qt) ? (u = pl, qt++) : (u = null, 0 === Wt && e(vl)), 
	            null !== u && (Lt = l, u = wl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function s() {
	            var l, u;
	            return l = qt, 36 === n.charCodeAt(qt) ? (u = Al, qt++) : (u = null, 0 === Wt && e(Cl)), 
	            null !== u && (Lt = l, u = gl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function h() {
	            var n, l, u;
	            return n = qt, l = a(), null !== l ? (u = d(), null !== u ? (Lt = n, l = bl(l, u), 
	            null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il), n;
	        }
	        function d() {
	            var n, l, u;
	            return Wt++, n = qt, l = p(), null !== l ? (u = k(), null === u && (u = al), null !== u ? (Lt = n, 
	            l = Tl(l, u), null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, 
	            n = il), Wt--, null === n && (l = null, 0 === Wt && e(kl)), n;
	        }
	        function p() {
	            var n;
	            return n = v(), null === n && (n = w(), null === n && (n = A(), null === n && (n = C(), 
	            null === n && (n = g(), null === n && (n = b()))))), n;
	        }
	        function v() {
	            var l, u, t, r, o, c;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (44 === n.charCodeAt(qt) ? (r = ml, qt++) : (r = null, 
	            0 === Wt && e(Rl)), null !== r ? (o = T(), null !== o ? (125 === n.charCodeAt(qt) ? (c = Fl, 
	            qt++) : (c = null, 0 === Wt && e(Ql)), null !== c ? (Lt = l, u = Sl(t, o), null === u ? (qt = l, 
	            l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function w() {
	            var l, u, t, r;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (n.substr(qt, 2) === Ul ? (r = Ul, qt += 2) : (r = null, 
	            0 === Wt && e(El)), null !== r ? (Lt = l, u = Gl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function A() {
	            var l, u, t, r;
	            return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), 
	            null !== u ? (t = T(), null !== t ? (125 === n.charCodeAt(qt) ? (r = Fl, qt++) : (r = null, 
	            0 === Wt && e(Ql)), null !== r ? (Lt = l, u = Bl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function C() {
	            var l, u;
	            return l = qt, 43 === n.charCodeAt(qt) ? (u = jl, qt++) : (u = null, 0 === Wt && e($l)), 
	            null !== u && (Lt = l, u = ql()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function g() {
	            var l, u;
	            return l = qt, 42 === n.charCodeAt(qt) ? (u = Ll, qt++) : (u = null, 0 === Wt && e(Ml)), 
	            null !== u && (Lt = l, u = Dl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function b() {
	            var l, u;
	            return l = qt, 63 === n.charCodeAt(qt) ? (u = Hl, qt++) : (u = null, 0 === Wt && e(Ol)), 
	            null !== u && (Lt = l, u = Wl()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function k() {
	            var l;
	            return 63 === n.charCodeAt(qt) ? (l = Hl, qt++) : (l = null, 0 === Wt && e(Ol)), 
	            l;
	        }
	        function T() {
	            var l, u, t;
	            if (l = qt, u = [], zl.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 
	            0 === Wt && e(Il)), null !== t) for (;null !== t; ) u.push(t), zl.test(n.charAt(qt)) ? (t = n.charAt(qt), 
	            qt++) : (t = null, 0 === Wt && e(Il)); else u = il;
	            return null !== u && (Lt = l, u = Jl(u)), null === u ? (qt = l, l = u) : l = u, 
	            l;
	        }
	        function x() {
	            var l, u, t, r;
	            return l = qt, 40 === n.charCodeAt(qt) ? (u = Kl, qt++) : (u = null, 0 === Wt && e(Nl)), 
	            null !== u ? (t = R(), null === t && (t = F(), null === t && (t = m(), null === t && (t = y()))), 
	            null !== t ? (41 === n.charCodeAt(qt) ? (r = Pl, qt++) : (r = null, 0 === Wt && e(Vl)), 
	            null !== r ? (Lt = l, u = Xl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
	        }
	        function y() {
	            var n, l;
	            return n = qt, l = c(), null !== l && (Lt = n, l = Yl(l)), null === l ? (qt = n, 
	            n = l) : n = l, n;
	        }
	        function m() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === Zl ? (u = Zl, qt += 2) : (u = null, 0 === Wt && e(_l)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = nu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function R() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === lu ? (u = lu, qt += 2) : (u = null, 0 === Wt && e(uu)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = tu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function F() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === ru ? (u = ru, qt += 2) : (u = null, 0 === Wt && e(eu)), 
	            null !== u ? (t = c(), null !== t ? (Lt = l, u = ou(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function Q() {
	            var l, u, t, r, o;
	            if (Wt++, l = qt, 91 === n.charCodeAt(qt) ? (u = iu, qt++) : (u = null, 0 === Wt && e(au)), 
	            null !== u) if (94 === n.charCodeAt(qt) ? (t = pl, qt++) : (t = null, 0 === Wt && e(vl)), 
	            null === t && (t = al), null !== t) {
	                for (r = [], o = S(), null === o && (o = U()); null !== o; ) r.push(o), o = S(), 
	                null === o && (o = U());
	                null !== r ? (93 === n.charCodeAt(qt) ? (o = fu, qt++) : (o = null, 0 === Wt && e(su)), 
	                null !== o ? (Lt = l, u = hu(t, r), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il)) : (qt = l, l = il);
	            } else qt = l, l = il; else qt = l, l = il;
	            return Wt--, null === l && (u = null, 0 === Wt && e(cu)), l;
	        }
	        function S() {
	            var l, u, t, r;
	            return Wt++, l = qt, u = U(), null !== u ? (45 === n.charCodeAt(qt) ? (t = pu, qt++) : (t = null, 
	            0 === Wt && e(vu)), null !== t ? (r = U(), null !== r ? (Lt = l, u = wu(u, r), null === u ? (qt = l, 
	            l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), Wt--, 
	            null === l && (u = null, 0 === Wt && e(du)), l;
	        }
	        function U() {
	            var n, l;
	            return Wt++, n = G(), null === n && (n = E()), Wt--, null === n && (l = null, 0 === Wt && e(Au)), 
	            n;
	        }
	        function E() {
	            var l, u;
	            return l = qt, Cu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 0 === Wt && e(gu)), 
	            null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function G() {
	            var n;
	            return n = L(), null === n && (n = Y(), null === n && (n = H(), null === n && (n = O(), 
	            null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), null === n && (n = J(), 
	            null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), null === n && (n = V(), 
	            null === n && (n = X(), null === n && (n = _(), null === n && (n = nl(), null === n && (n = ll(), 
	            null === n && (n = ul(), null === n && (n = tl()))))))))))))))))), n;
	        }
	        function B() {
	            var n;
	            return n = j(), null === n && (n = q(), null === n && (n = $())), n;
	        }
	        function j() {
	            var l, u;
	            return l = qt, 46 === n.charCodeAt(qt) ? (u = ku, qt++) : (u = null, 0 === Wt && e(Tu)), 
	            null !== u && (Lt = l, u = xu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function $() {
	            var l, u;
	            return Wt++, l = qt, mu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 
	            0 === Wt && e(Ru)), null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, 
	            Wt--, null === l && (u = null, 0 === Wt && e(yu)), l;
	        }
	        function q() {
	            var n;
	            return n = M(), null === n && (n = D(), null === n && (n = Y(), null === n && (n = H(), 
	            null === n && (n = O(), null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), 
	            null === n && (n = J(), null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), 
	            null === n && (n = V(), null === n && (n = X(), null === n && (n = Z(), null === n && (n = _(), 
	            null === n && (n = nl(), null === n && (n = ll(), null === n && (n = ul(), null === n && (n = tl()))))))))))))))))))), 
	            n;
	        }
	        function L() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), 
	            null !== u && (Lt = l, u = Su()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function M() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), 
	            null !== u && (Lt = l, u = Uu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function D() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Eu ? (u = Eu, qt += 2) : (u = null, 0 === Wt && e(Gu)), 
	            null !== u && (Lt = l, u = Bu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function H() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ju ? (u = ju, qt += 2) : (u = null, 0 === Wt && e($u)), 
	            null !== u && (Lt = l, u = qu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function O() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Lu ? (u = Lu, qt += 2) : (u = null, 0 === Wt && e(Mu)), 
	            null !== u && (Lt = l, u = Du()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function W() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Hu ? (u = Hu, qt += 2) : (u = null, 0 === Wt && e(Ou)), 
	            null !== u && (Lt = l, u = Wu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function z() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === zu ? (u = zu, qt += 2) : (u = null, 0 === Wt && e(Iu)), 
	            null !== u && (Lt = l, u = Ju()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function I() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Ku ? (u = Ku, qt += 2) : (u = null, 0 === Wt && e(Nu)), 
	            null !== u && (Lt = l, u = Pu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function J() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Vu ? (u = Vu, qt += 2) : (u = null, 0 === Wt && e(Xu)), 
	            null !== u && (Lt = l, u = Yu()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function K() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Zu ? (u = Zu, qt += 2) : (u = null, 0 === Wt && e(_u)), 
	            null !== u && (Lt = l, u = nt()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function N() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === lt ? (u = lt, qt += 2) : (u = null, 0 === Wt && e(ut)), 
	            null !== u && (Lt = l, u = tt()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function P() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === rt ? (u = rt, qt += 2) : (u = null, 0 === Wt && e(et)), 
	            null !== u && (Lt = l, u = ot()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function V() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ct ? (u = ct, qt += 2) : (u = null, 0 === Wt && e(it)), 
	            null !== u && (Lt = l, u = at()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function X() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === ft ? (u = ft, qt += 2) : (u = null, 0 === Wt && e(st)), 
	            null !== u && (Lt = l, u = ht()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function Y() {
	            var l, u, t;
	            return l = qt, n.substr(qt, 2) === dt ? (u = dt, qt += 2) : (u = null, 0 === Wt && e(pt)), 
	            null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), 
	            null !== t ? (Lt = l, u = wt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function Z() {
	            var l, u, t;
	            return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), 
	            null !== u ? (gt.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(bt)), 
	            null !== t ? (Lt = l, u = kt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        function _() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), 
	            null !== u) {
	                if (t = [], yt.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(mt)), 
	                null !== r) for (;null !== r; ) t.push(r), yt.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(mt)); else t = il;
	                null !== t ? (Lt = l, u = Rt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function nl() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Ft ? (u = Ft, qt += 2) : (u = null, 0 === Wt && e(Qt)), 
	            null !== u) {
	                if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), 
	                null !== r) for (;null !== r; ) t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(Ut)); else t = il;
	                null !== t ? (Lt = l, u = Et(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function ll() {
	            var l, u, t, r;
	            if (l = qt, n.substr(qt, 2) === Gt ? (u = Gt, qt += 2) : (u = null, 0 === Wt && e(Bt)), 
	            null !== u) {
	                if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), 
	                null !== r) for (;null !== r; ) t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), 
	                qt++) : (r = null, 0 === Wt && e(Ut)); else t = il;
	                null !== t ? (Lt = l, u = jt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	                l = il);
	            } else qt = l, l = il;
	            return l;
	        }
	        function ul() {
	            var l, u;
	            return l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), 
	            null !== u && (Lt = l, u = $t()), null === u ? (qt = l, l = u) : l = u, l;
	        }
	        function tl() {
	            var l, u, t;
	            return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), 
	            null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), 
	            null !== t ? (Lt = l, u = bu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, 
	            l = il)) : (qt = l, l = il), l;
	        }
	        var rl, el = arguments.length > 1 ? arguments[1] : {}, ol = {
	            regexp: c
	        }, cl = c, il = null, al = "", fl = "|", sl = '"|"', hl = function(n, l) {
	            return l ? new Alternate(n, l[1]) : n;
	        }, dl = function(n, l, u) {
	            return new Match([ n ].concat(l).concat([ u ]));
	        }, pl = "^", vl = '"^"', wl = function() {
	            return new Token("start");
	        }, Al = "$", Cl = '"$"', gl = function() {
	            return new Token("end");
	        }, bl = function(n, l) {
	            return new Quantified(n, l);
	        }, kl = "Quantifier", Tl = function(n, l) {
	            return l && (n.greedy = !1), n;
	        }, xl = "{", yl = '"{"', ml = ",", Rl = '","', Fl = "}", Ql = '"}"', Sl = function(n, l) {
	            return new Quantifier(n, l);
	        }, Ul = ",}", El = '",}"', Gl = function(n) {
	            return new Quantifier(n, 1/0);
	        }, Bl = function(n) {
	            return new Quantifier(n, n);
	        }, jl = "+", $l = '"+"', ql = function() {
	            return new Quantifier(1, 1/0);
	        }, Ll = "*", Ml = '"*"', Dl = function() {
	            return new Quantifier(0, 1/0);
	        }, Hl = "?", Ol = '"?"', Wl = function() {
	            return new Quantifier(0, 1);
	        }, zl = /^[0-9]/, Il = "[0-9]", Jl = function(n) {
	            return +n.join("");
	        }, Kl = "(", Nl = '"("', Pl = ")", Vl = '")"', Xl = function(n) {
	            return n;
	        }, Yl = function(n) {
	            return new CaptureGroup(n);
	        }, Zl = "?:", _l = '"?:"', nu = function(n) {
	            return new Group("non-capture-group", n);
	        }, lu = "?=", uu = '"?="', tu = function(n) {
	            return new Group("positive-lookahead", n);
	        }, ru = "?!", eu = '"?!"', ou = function(n) {
	            return new Group("negative-lookahead", n);
	        }, cu = "CharacterSet", iu = "[", au = '"["', fu = "]", su = '"]"', hu = function(n, l) {
	            return new CharSet(!!n, l);
	        }, du = "CharacterRange", pu = "-", vu = '"-"', wu = function(n, l) {
	            return new CharacterRange(n, l);
	        }, Au = "Character", Cu = /^[^\\\]]/, gu = "[^\\\\\\]]", bu = function(n) {
	            return new Literal(n);
	        }, ku = ".", Tu = '"."', xu = function() {
	            return new Token("any-character");
	        }, yu = "Literal", mu = /^[^|\\\/.[()?+*$\^]/, Ru = "[^|\\\\\\/.[()?+*$\\^]", Fu = "\\b", Qu = '"\\\\b"', Su = function() {
	            return new Token("backspace");
	        }, Uu = function() {
	            return new Token("word-boundary");
	        }, Eu = "\\B", Gu = '"\\\\B"', Bu = function() {
	            return new Token("non-word-boundary");
	        }, ju = "\\d", $u = '"\\\\d"', qu = function() {
	            return new Token("digit");
	        }, Lu = "\\D", Mu = '"\\\\D"', Du = function() {
	            return new Token("non-digit");
	        }, Hu = "\\f", Ou = '"\\\\f"', Wu = function() {
	            return new Token("form-feed");
	        }, zu = "\\n", Iu = '"\\\\n"', Ju = function() {
	            return new Token("line-feed");
	        }, Ku = "\\r", Nu = '"\\\\r"', Pu = function() {
	            return new Token("carriage-return");
	        }, Vu = "\\s", Xu = '"\\\\s"', Yu = function() {
	            return new Token("white-space");
	        }, Zu = "\\S", _u = '"\\\\S"', nt = function() {
	            return new Token("non-white-space");
	        }, lt = "\\t", ut = '"\\\\t"', tt = function() {
	            return new Token("tab");
	        }, rt = "\\v", et = '"\\\\v"', ot = function() {
	            return new Token("vertical-tab");
	        }, ct = "\\w", it = '"\\\\w"', at = function() {
	            return new Token("word");
	        }, ft = "\\W", st = '"\\\\W"', ht = function() {
	            return new Token("non-word");
	        }, dt = "\\c", pt = '"\\\\c"', vt = "any character", wt = function(n) {
	            return new ControlCharacter(n);
	        }, At = "\\", Ct = '"\\\\"', gt = /^[1-9]/, bt = "[1-9]", kt = function(n) {
	            return new BackReference(n);
	        }, Tt = "\\0", xt = '"\\\\0"', yt = /^[0-7]/, mt = "[0-7]", Rt = function(n) {
	            return new Octal(n.join(""));
	        }, Ft = "\\x", Qt = '"\\\\x"', St = /^[0-9a-fA-F]/, Ut = "[0-9a-fA-F]", Et = function(n) {
	            return new Hex(n.join(""));
	        }, Gt = "\\u", Bt = '"\\\\u"', jt = function(n) {
	            return new Unicode(n.join(""));
	        }, $t = function() {
	            return new Token("null-character");
	        }, qt = 0, Lt = 0, Mt = 0, Dt = {
	            line: 1,
	            column: 1,
	            seenCR: !1
	        }, Ht = 0, Ot = [], Wt = 0;
	        if ("startRule" in el) {
	            if (!(el.startRule in ol)) throw new Error("Can't start parsing from rule \"" + el.startRule + '".');
	            cl = ol[el.startRule];
	        }
	        if (Token.offset = t, Token.text = u, rl = cl(), null !== rl && qt === n.length) return rl;
	        throw o(Ot), Lt = Math.max(qt, Ht), new l(Ot, Lt < n.length ? n.charAt(Lt) : null, Lt, r(Lt).line, r(Lt).column);
	    }
	    return n(l, Error), {
	        SyntaxError: l,
	        parse: u
	    };
	}(), index = 1, cgs = {};

	module.exports = parser

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## RegExp Handler

	    https://github.com/ForbesLindesay/regexp
	    https://github.com/dmajda/pegjs
	    http://www.regexper.com/

	    姣忎釜鑺傜偣鐨勭粨鏋�
	        {
	            type: '',
	            offset: number,
	            text: '',
	            body: {},
	            escaped: true/false
	        }

	    type 鍙€夊€�
	        alternate             |         閫夋嫨
	        match                 鍖归厤
	        capture-group         ()        鎹曡幏缁�
	        non-capture-group     (?:...)   闈炴崟鑾风粍
	        positive-lookahead    (?=p)     闆跺姝ｅ悜鍏堣鏂█
	        negative-lookahead    (?!p)     闆跺璐熷悜鍏堣鏂█
	        quantified            a*        閲嶅鑺傜偣
	        quantifier            *         閲忚瘝
	        charset               []        瀛楃闆�
	        range                 {m, n}    鑼冨洿
	        literal               a         鐩存帴閲忓瓧绗�
	        unicode               \uxxxx    Unicode
	        hex                   \x        鍗佸叚杩涘埗
	        octal                 鍏繘鍒�
	        back-reference        \n        鍙嶅悜寮曠敤
	        control-character     \cX       鎺у埗瀛楃

	        // Token
	        start               ^       寮€澶�
	        end                 $       缁撳熬
	        any-character       .       浠绘剰瀛楃
	        backspace           [\b]    閫€鏍肩洿鎺ラ噺
	        word-boundary       \b      鍗曡瘝杈圭晫
	        non-word-boundary   \B      闈炲崟璇嶈竟鐣�
	        digit               \d      ASCII 鏁板瓧锛孾0-9]
	        non-digit           \D      闈� ASCII 鏁板瓧锛孾^0-9]
	        form-feed           \f      鎹㈤〉绗�
	        line-feed           \n      鎹㈣绗�
	        carriage-return     \r      鍥炶溅绗�
	        white-space         \s      绌虹櫧绗�
	        non-white-space     \S      闈炵┖鐧界
	        tab                 \t      鍒惰〃绗�
	        vertical-tab        \v      鍨傜洿鍒惰〃绗�
	        word                \w      ASCII 瀛楃锛孾a-zA-Z0-9]
	        non-word            \W      闈� ASCII 瀛楃锛孾^a-zA-Z0-9]
	        null-character      \o      NUL 瀛楃
	 */

	var Util = __webpack_require__(3)
	var Random = __webpack_require__(5)
	    /*
	        
	    */
	var Handler = {
	    extend: Util.extend
	}

	// http://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
	/*var ASCII_CONTROL_CODE_CHART = {
	    '@': ['\u0000'],
	    A: ['\u0001'],
	    B: ['\u0002'],
	    C: ['\u0003'],
	    D: ['\u0004'],
	    E: ['\u0005'],
	    F: ['\u0006'],
	    G: ['\u0007', '\a'],
	    H: ['\u0008', '\b'],
	    I: ['\u0009', '\t'],
	    J: ['\u000A', '\n'],
	    K: ['\u000B', '\v'],
	    L: ['\u000C', '\f'],
	    M: ['\u000D', '\r'],
	    N: ['\u000E'],
	    O: ['\u000F'],
	    P: ['\u0010'],
	    Q: ['\u0011'],
	    R: ['\u0012'],
	    S: ['\u0013'],
	    T: ['\u0014'],
	    U: ['\u0015'],
	    V: ['\u0016'],
	    W: ['\u0017'],
	    X: ['\u0018'],
	    Y: ['\u0019'],
	    Z: ['\u001A'],
	    '[': ['\u001B', '\e'],
	    '\\': ['\u001C'],
	    ']': ['\u001D'],
	    '^': ['\u001E'],
	    '_': ['\u001F']
	}*/

	// ASCII printable code chart
	// var LOWER = 'abcdefghijklmnopqrstuvwxyz'
	// var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	// var NUMBER = '0123456789'
	// var SYMBOL = ' !"#$%&\'()*+,-./' + ':;<=>?@' + '[\\]^_`' + '{|}~'
	var LOWER = ascii(97, 122)
	var UPPER = ascii(65, 90)
	var NUMBER = ascii(48, 57)
	var OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126) // 鎺掗櫎 95 _ ascii(91, 94) + ascii(96, 96)
	var PRINTABLE = ascii(32, 126)
	var SPACE = ' \f\n\r\t\v\u00A0\u2028\u2029'
	var CHARACTER_CLASSES = {
	    '\\w': LOWER + UPPER + NUMBER + '_', // ascii(95, 95)
	    '\\W': OTHER.replace('_', ''),
	    '\\s': SPACE,
	    '\\S': function() {
	        var result = PRINTABLE
	        for (var i = 0; i < SPACE.length; i++) {
	            result = result.replace(SPACE[i], '')
	        }
	        return result
	    }(),
	    '\\d': NUMBER,
	    '\\D': LOWER + UPPER + OTHER
	}

	function ascii(from, to) {
	    var result = ''
	    for (var i = from; i <= to; i++) {
	        result += String.fromCharCode(i)
	    }
	    return result
	}

	// var ast = RegExpParser.parse(regexp.source)
	Handler.gen = function(node, result, cache) {
	    cache = cache || {
	        guid: 1
	    }
	    return Handler[node.type] ? Handler[node.type](node, result, cache) :
	        Handler.token(node, result, cache)
	}

	Handler.extend({
	    /* jshint unused:false */
	    token: function(node, result, cache) {
	        switch (node.type) {
	            case 'start':
	            case 'end':
	                return ''
	            case 'any-character':
	                return Random.character()
	            case 'backspace':
	                return ''
	            case 'word-boundary': // TODO
	                return ''
	            case 'non-word-boundary': // TODO
	                break
	            case 'digit':
	                return Random.pick(
	                    NUMBER.split('')
	                )
	            case 'non-digit':
	                return Random.pick(
	                    (LOWER + UPPER + OTHER).split('')
	                )
	            case 'form-feed':
	                break
	            case 'line-feed':
	                return node.body || node.text
	            case 'carriage-return':
	                break
	            case 'white-space':
	                return Random.pick(
	                    SPACE.split('')
	                )
	            case 'non-white-space':
	                return Random.pick(
	                    (LOWER + UPPER + NUMBER).split('')
	                )
	            case 'tab':
	                break
	            case 'vertical-tab':
	                break
	            case 'word': // \w [a-zA-Z0-9]
	                return Random.pick(
	                    (LOWER + UPPER + NUMBER).split('')
	                )
	            case 'non-word': // \W [^a-zA-Z0-9]
	                return Random.pick(
	                    OTHER.replace('_', '').split('')
	                )
	            case 'null-character':
	                break
	        }
	        return node.body || node.text
	    },
	    /*
	        {
	            type: 'alternate',
	            offset: 0,
	            text: '',
	            left: {
	                boyd: []
	            },
	            right: {
	                boyd: []
	            }
	        }
	    */
	    alternate: function(node, result, cache) {
	        // node.left/right {}
	        return this.gen(
	            Random.boolean() ? node.left : node.right,
	            result,
	            cache
	        )
	    },
	    /*
	        {
	            type: 'match',
	            offset: 0,
	            text: '',
	            body: []
	        }
	    */
	    match: function(node, result, cache) {
	        result = ''
	            // node.body []
	        for (var i = 0; i < node.body.length; i++) {
	            result += this.gen(node.body[i], result, cache)
	        }
	        return result
	    },
	    // ()
	    'capture-group': function(node, result, cache) {
	        // node.body {}
	        result = this.gen(node.body, result, cache)
	        cache[cache.guid++] = result
	        return result
	    },
	    // (?:...)
	    'non-capture-group': function(node, result, cache) {
	        // node.body {}
	        return this.gen(node.body, result, cache)
	    },
	    // (?=p)
	    'positive-lookahead': function(node, result, cache) {
	        // node.body
	        return this.gen(node.body, result, cache)
	    },
	    // (?!p)
	    'negative-lookahead': function(node, result, cache) {
	        // node.body
	        return ''
	    },
	    /*
	        {
	            type: 'quantified',
	            offset: 3,
	            text: 'c*',
	            body: {
	                type: 'literal',
	                offset: 3,
	                text: 'c',
	                body: 'c',
	                escaped: false
	            },
	            quantifier: {
	                type: 'quantifier',
	                offset: 4,
	                text: '*',
	                min: 0,
	                max: Infinity,
	                greedy: true
	            }
	        }
	    */
	    quantified: function(node, result, cache) {
	        result = ''
	            // node.quantifier {}
	        var count = this.quantifier(node.quantifier);
	        // node.body {}
	        for (var i = 0; i < count; i++) {
	            result += this.gen(node.body, result, cache)
	        }
	        return result
	    },
	    /*
	        quantifier: {
	            type: 'quantifier',
	            offset: 4,
	            text: '*',
	            min: 0,
	            max: Infinity,
	            greedy: true
	        }
	    */
	    quantifier: function(node, result, cache) {
	        var min = Math.max(node.min, 0)
	        var max = isFinite(node.max) ? node.max :
	            min + Random.integer(3, 7)
	        return Random.integer(min, max)
	    },
	    /*
	        
	    */
	    charset: function(node, result, cache) {
	        // node.invert
	        if (node.invert) return this['invert-charset'](node, result, cache)

	        // node.body []
	        var literal = Random.pick(node.body)
	        return this.gen(literal, result, cache)
	    },
	    'invert-charset': function(node, result, cache) {
	        var pool = PRINTABLE
	        for (var i = 0, item; i < node.body.length; i++) {
	            item = node.body[i]
	            switch (item.type) {
	                case 'literal':
	                    pool = pool.replace(item.body, '')
	                    break
	                case 'range':
	                    var min = this.gen(item.start, result, cache).charCodeAt()
	                    var max = this.gen(item.end, result, cache).charCodeAt()
	                    for (var ii = min; ii <= max; ii++) {
	                        pool = pool.replace(String.fromCharCode(ii), '')
	                    }
	                    /* falls through */
	                default:
	                    var characters = CHARACTER_CLASSES[item.text]
	                    if (characters) {
	                        for (var iii = 0; iii <= characters.length; iii++) {
	                            pool = pool.replace(characters[iii], '')
	                        }
	                    }
	            }
	        }
	        return Random.pick(pool.split(''))
	    },
	    range: function(node, result, cache) {
	        // node.start, node.end
	        var min = this.gen(node.start, result, cache).charCodeAt()
	        var max = this.gen(node.end, result, cache).charCodeAt()
	        return String.fromCharCode(
	            Random.integer(min, max)
	        )
	    },
	    literal: function(node, result, cache) {
	        return node.escaped ? node.body : node.text
	    },
	    // Unicode \u
	    unicode: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 16)
	        )
	    },
	    // 鍗佸叚杩涘埗 \xFF
	    hex: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 16)
	        )
	    },
	    // 鍏繘鍒� \0
	    octal: function(node, result, cache) {
	        return String.fromCharCode(
	            parseInt(node.code, 8)
	        )
	    },
	    // 鍙嶅悜寮曠敤
	    'back-reference': function(node, result, cache) {
	        return cache[node.code] || ''
	    },
	    /*
	        http://en.wikipedia.org/wiki/C0_and_C1_control_codes
	    */
	    CONTROL_CHARACTER_MAP: function() {
	        var CONTROL_CHARACTER = '@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _'.split(' ')
	        var CONTROL_CHARACTER_UNICODE = '\u0000 \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \u0008 \u0009 \u000A \u000B \u000C \u000D \u000E \u000F \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001A \u001B \u001C \u001D \u001E \u001F'.split(' ')
	        var map = {}
	        for (var i = 0; i < CONTROL_CHARACTER.length; i++) {
	            map[CONTROL_CHARACTER[i]] = CONTROL_CHARACTER_UNICODE[i]
	        }
	        return map
	    }(),
	    'control-character': function(node, result, cache) {
	        return this.CONTROL_CHARACTER_MAP[node.code]
	    }
	})

	module.exports = Handler

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(24)

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## toJSONSchema

	    鎶� Mock.js 椋庢牸鐨勬暟鎹ā鏉胯浆鎹㈡垚 JSON Schema銆�

	    > [JSON Schema](http://json-schema.org/)
	 */
	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var Parser = __webpack_require__(4)

	function toJSONSchema(template, name, path /* Internal Use Only */ ) {
	    // type rule properties items
	    path = path || []
	    var result = {
	        name: typeof name === 'string' ? name.replace(Constant.RE_KEY, '$1') : name,
	        template: template,
	        type: Util.type(template), // 鍙兘涓嶅噯纭紝渚嬪 { 'name|1': [{}, {} ...] }
	        rule: Parser.parse(name)
	    }
	    result.path = path.slice(0)
	    result.path.push(name === undefined ? 'ROOT' : result.name)

	    switch (result.type) {
	        case 'array':
	            result.items = []
	            Util.each(template, function(value, index) {
	                result.items.push(
	                    toJSONSchema(value, index, result.path)
	                )
	            })
	            break
	        case 'object':
	            result.properties = []
	            Util.each(template, function(value, name) {
	                result.properties.push(
	                    toJSONSchema(value, name, result.path)
	                )
	            })
	            break
	    }

	    return result

	}

	module.exports = toJSONSchema


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(26)

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/*
	    ## valid(template, data)

	    鏍￠獙鐪熷疄鏁版嵁 data 鏄惁涓庢暟鎹ā鏉� template 鍖归厤銆�
	    
	    瀹炵幇鎬濊矾锛�
	    1. 瑙ｆ瀽瑙勫垯銆�
	        鍏堟妸鏁版嵁妯℃澘 template 瑙ｆ瀽涓烘洿鏂逛究鏈哄櫒瑙ｆ瀽鐨� JSON-Schame
	        name               灞炴€у悕 
	        type               灞炴€у€肩被鍨�
	        template           灞炴€у€兼ā鏉�
	        properties         瀵硅薄灞炴€ф暟缁�
	        items              鏁扮粍鍏冪礌鏁扮粍
	        rule               灞炴€у€肩敓鎴愯鍒�
	    2. 閫掑綊楠岃瘉瑙勫垯銆�
	        鐒跺悗鐢� JSON-Schema 鏍￠獙鐪熷疄鏁版嵁锛屾牎楠岄」鍖呮嫭灞炴€у悕銆佸€肩被鍨嬨€佸€笺€佸€肩敓鎴愯鍒欍€�

	    鎻愮ず淇℃伅 
	    https://github.com/fge/json-schema-validator/blob/master/src/main/resources/com/github/fge/jsonschema/validator/validation.properties
	    [JSON-Schama validator](http://json-schema-validator.herokuapp.com/)
	    [Regexp Demo](http://demos.forbeslindesay.co.uk/regexp/)
	*/
	var Constant = __webpack_require__(2)
	var Util = __webpack_require__(3)
	var toJSONSchema = __webpack_require__(23)

	function valid(template, data) {
	    var schema = toJSONSchema(template)
	    var result = Diff.diff(schema, data)
	    for (var i = 0; i < result.length; i++) {
	        // console.log(Assert.message(result[i]))
	    }
	    return result
	}

	/*
	    ## name
	        鏈夌敓鎴愯鍒欙細姣旇緝瑙ｆ瀽鍚庣殑 name
	        鏃犵敓鎴愯鍒欙細鐩存帴姣旇緝
	    ## type
	        鏃犵被鍨嬭浆鎹細鐩存帴姣旇緝
	        鏈夌被鍨嬭浆鎹細鍏堣瘯鐫€瑙ｆ瀽 template锛岀劧鍚庡啀妫€鏌ワ紵
	    ## value vs. template
	        鍩烘湰绫诲瀷
	            鏃犵敓鎴愯鍒欙細鐩存帴姣旇緝
	            鏈夌敓鎴愯鍒欙細
	                number
	                    min-max.dmin-dmax
	                    min-max.dcount
	                    count.dmin-dmax
	                    count.dcount
	                    +step
	                    鏁存暟閮ㄥ垎
	                    灏忔暟閮ㄥ垎
	                boolean 
	                string  
	                    min-max
	                    count
	    ## properties
	        瀵硅薄
	            鏈夌敓鎴愯鍒欙細妫€娴嬫湡鏈涚殑灞炴€т釜鏁帮紝缁х画閫掑綊
	            鏃犵敓鎴愯鍒欙細妫€娴嬪叏閮ㄧ殑灞炴€т釜鏁帮紝缁х画閫掑綊
	    ## items
	        鏁扮粍
	            鏈夌敓鎴愯鍒欙細
	                `'name|1': [{}, {} ...]`            鍏朵腑涔嬩竴锛岀户缁€掑綊
	                `'name|+1': [{}, {} ...]`           椤哄簭妫€娴嬶紝缁х画閫掑綊
	                `'name|min-max': [{}, {} ...]`      妫€娴嬩釜鏁帮紝缁х画閫掑綊
	                `'name|count': [{}, {} ...]`        妫€娴嬩釜鏁帮紝缁х画閫掑綊
	            鏃犵敓鎴愯鍒欙細妫€娴嬪叏閮ㄧ殑鍏冪礌涓暟锛岀户缁€掑綊
	*/
	var Diff = {
	    diff: function diff(schema, data, name /* Internal Use Only */ ) {
	        var result = []

	        // 鍏堟娴嬪悕绉� name 鍜岀被鍨� type锛屽鏋滃尮閰嶏紝鎵嶆湁蹇呰缁х画妫€娴�
	        if (
	            this.name(schema, data, name, result) &&
	            this.type(schema, data, name, result)
	        ) {
	            this.value(schema, data, name, result)
	            this.properties(schema, data, name, result)
	            this.items(schema, data, name, result)
	        }

	        return result
	    },
	    /* jshint unused:false */
	    name: function(schema, data, name, result) {
	        var length = result.length

	        Assert.equal('name', schema.path, name + '', schema.name + '', result)

	        return result.length === length
	    },
	    type: function(schema, data, name, result) {
	        var length = result.length

	        switch (schema.type) {
	            // 璺宠繃鍚湁銆庡崰浣嶇銆忕殑灞炴€у€硷紝鍥犱负銆庡崰浣嶇銆忚繑鍥炲€肩殑绫诲瀷鍙兘鍜屾ā鏉夸笉涓€鑷达紝渚嬪 '@int' 浼氳繑鍥炰竴涓暣褰㈠€�
	            case 'string':
	                if (schema.template.match(Constant.RE_PLACEHOLDER)) return true
	                break
	        }

	        Assert.equal('type', schema.path, Util.type(data), schema.type, result)

	        return result.length === length
	    },
	    value: function(schema, data, name, result) {
	        var length = result.length

	        var rule = schema.rule
	        var templateType = schema.type
	        if (templateType === 'object' || templateType === 'array') return

	        // 鏃犵敓鎴愯鍒�
	        if (!rule.parameters) {
	            switch (templateType) {
	                case 'regexp':
	                    Assert.match('value', schema.path, data, schema.template, result)
	                    return result.length === length
	                case 'string':
	                    // 鍚屾牱璺宠繃鍚湁銆庡崰浣嶇銆忕殑灞炴€у€硷紝鍥犱负銆庡崰浣嶇銆忕殑杩斿洖鍊间細閫氬父浼氫笌妯℃澘涓嶄竴鑷�
	                    if (schema.template.match(Constant.RE_PLACEHOLDER)) return result.length === length
	                    break
	            }
	            Assert.equal('value', schema.path, data, schema.template, result)
	            return result.length === length
	        }

	        // 鏈夌敓鎴愯鍒�
	        var actualRepeatCount
	        switch (templateType) {
	            case 'number':
	                var parts = (data + '').split('.')
	                parts[0] = +parts[0]

	                // 鏁存暟閮ㄥ垎
	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('value', schema.path, parts[0], rule.min, result)
	                        // , 'numeric instance is lower than the required minimum (minimum: {expected}, found: {actual})')
	                    Assert.lessThanOrEqualTo('value', schema.path, parts[0], rule.max, result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('value', schema.path, parts[0], rule.min, result, '[value] ' + name)
	                }

	                // 灏忔暟閮ㄥ垎
	                if (rule.decimal) {
	                    // |dmin-dmax
	                    if (rule.dmin !== undefined && rule.dmax !== undefined) {
	                        Assert.greaterThanOrEqualTo('value', schema.path, parts[1].length, rule.dmin, result)
	                        Assert.lessThanOrEqualTo('value', schema.path, parts[1].length, rule.dmax, result)
	                    }
	                    // |dcount
	                    if (rule.dmin !== undefined && rule.dmax === undefined) {
	                        Assert.equal('value', schema.path, parts[1].length, rule.dmin, result)
	                    }
	                }

	                break

	            case 'boolean':
	                break

	            case 'string':
	                // 'aaa'.match(/a/g)
	                actualRepeatCount = data.match(new RegExp(schema.template, 'g'))
	                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : actualRepeatCount

	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                }

	                break

	            case 'regexp':
	                actualRepeatCount = data.match(new RegExp(schema.template.source.replace(/^\^|\$$/g, ''), 'g'))
	                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : actualRepeatCount

	                // |min-max
	                if (rule.min !== undefined && rule.max !== undefined) {
	                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
	                }
	                // |count
	                if (rule.min !== undefined && rule.max === undefined) {
	                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
	                }
	                break
	        }

	        return result.length === length
	    },
	    properties: function(schema, data, name, result) {
	        var length = result.length

	        var rule = schema.rule
	        var keys = Util.keys(data)
	        if (!schema.properties) return

	        // 鏃犵敓鎴愯鍒�
	        if (!schema.rule.parameters) {
	            Assert.equal('properties length', schema.path, keys.length, schema.properties.length, result)
	        } else {
	            // 鏈夌敓鎴愯鍒�
	            // |min-max
	            if (rule.min !== undefined && rule.max !== undefined) {
	                Assert.greaterThanOrEqualTo('properties length', schema.path, keys.length, rule.min, result)
	                Assert.lessThanOrEqualTo('properties length', schema.path, keys.length, rule.max, result)
	            }
	            // |count
	            if (rule.min !== undefined && rule.max === undefined) {
	                Assert.equal('properties length', schema.path, keys.length, rule.min, result)
	            }
	        }

	        if (result.length !== length) return false

	        for (var i = 0; i < keys.length; i++) {
	            result.push.apply(
	                result,
	                this.diff(
	                    schema.properties[i],
	                    data[keys[i]],
	                    keys[i]
	                )
	            )
	        }

	        return result.length === length
	    },
	    items: function(schema, data, name, result) {
	        var length = result.length

	        if (!schema.items) return

	        var rule = schema.rule

	        // 鏃犵敓鎴愯鍒�
	        if (!schema.rule.parameters) {
	            Assert.equal('items length', schema.path, data.length, schema.items.length, result)
	        } else {
	            // 鏈夌敓鎴愯鍒�
	            // |min-max
	            if (rule.min !== undefined && rule.max !== undefined) {
	                Assert.greaterThanOrEqualTo('items', schema.path, data.length, (rule.min * schema.items.length), result,
	                    '[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements')
	                Assert.lessThanOrEqualTo('items', schema.path, data.length, (rule.max * schema.items.length), result,
	                    '[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements')
	            }
	            // |count
	            if (rule.min !== undefined && rule.max === undefined) {
	                Assert.equal('items length', schema.path, data.length, (rule.min * schema.items.length), result)
	            }
	        }

	        if (result.length !== length) return false

	        for (var i = 0; i < data.length; i++) {
	            result.push.apply(
	                result,
	                this.diff(
	                    schema.items[i % schema.items.length],
	                    data[i],
	                    i % schema.items.length
	                )
	            )
	        }

	        return result.length === length
	    }
	}

	/*
	    瀹屽杽銆佸弸濂界殑鎻愮ず淇℃伅
	    
	    Equal, not equal to, greater than, less than, greater than or equal to, less than or equal to
	    璺緞 楠岃瘉绫诲瀷 鎻忚堪 

	    Expect path.name is less than or equal to expected, but path.name is actual.

	    Expect path.name is less than or equal to expected, but path.name is actual.
	    Expect path.name is greater than or equal to expected, but path.name is actual.

	*/
	var Assert = {
	    message: function(item) {
	        return (item.message ||
	                '[{utype}] Expect {path}\'{ltype} {action} {expected}, but is {actual}')
	            .replace('{utype}', item.type.toUpperCase())
	            .replace('{ltype}', item.type.toLowerCase())
	            .replace('{path}', Util.isArray(item.path) && item.path.join('.') || item.path)
	            .replace('{action}', item.action)
	            .replace('{expected}', item.expected)
	            .replace('{actual}', item.actual)
	    },
	    equal: function(type, path, actual, expected, result, message) {
	        if (actual === expected) return true
	        switch (type) {
	            case 'type':
	                // 姝ｅ垯妯℃澘 === 瀛楃涓叉渶缁堝€�
	                if (expected === 'regexp' && actual === 'string') return true
	                break
	        }

	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    // actual matches expected
	    match: function(type, path, actual, expected, result, message) {
	        if (expected.test(actual)) return true

	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'matches',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    notEqual: function(type, path, actual, expected, result, message) {
	        if (actual !== expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is not equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    greaterThan: function(type, path, actual, expected, result, message) {
	        if (actual > expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is greater than',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    lessThan: function(type, path, actual, expected, result, message) {
	        if (actual < expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is less to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    greaterThanOrEqualTo: function(type, path, actual, expected, result, message) {
	        if (actual >= expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is greater than or equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    },
	    lessThanOrEqualTo: function(type, path, actual, expected, result, message) {
	        if (actual <= expected) return true
	        var item = {
	            path: path,
	            type: type,
	            actual: actual,
	            expected: expected,
	            action: 'is less than or equal to',
	            message: message
	        }
	        item.message = Assert.message(item)
	        result.push(item)
	        return false
	    }
	}

	valid.Diff = Diff
	valid.Assert = Assert

	module.exports = valid

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(28)

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* global window, document, location, Event, setTimeout */
	/*
	    ## MockXMLHttpRequest

	    鏈熸湜鐨勫姛鑳斤細
	    1. 瀹屾暣鍦拌鐩栧師鐢� XHR 鐨勮涓�
	    2. 瀹屾暣鍦版ā鎷熷師鐢� XHR 鐨勮涓�
	    3. 鍦ㄥ彂璧疯姹傛椂锛岃嚜鍔ㄦ娴嬫槸鍚﹂渶瑕佹嫤鎴�
	    4. 濡傛灉涓嶅繀鎷︽埅锛屽垯鎵ц鍘熺敓 XHR 鐨勮涓�
	    5. 濡傛灉闇€瑕佹嫤鎴紝鍒欐墽琛岃櫄鎷� XHR 鐨勮涓�
	    6. 鍏煎 XMLHttpRequest 鍜� ActiveXObject
	        new window.XMLHttpRequest()
	        new window.ActiveXObject("Microsoft.XMLHTTP")

	    鍏抽敭鏂规硶鐨勯€昏緫锛�
	    * new   姝ゆ椂灏氭棤娉曠‘瀹氭槸鍚﹂渶瑕佹嫤鎴紝鎵€浠ュ垱寤哄師鐢� XHR 瀵硅薄鏄繀椤荤殑銆�
	    * open  姝ゆ椂鍙互鍙栧埌 URL锛屽彲浠ュ喅瀹氭槸鍚﹁繘琛屾嫤鎴€�
	    * send  姝ゆ椂宸茬粡纭畾浜嗚姹傛柟寮忋€�

	    瑙勮寖锛�
	    http://xhr.spec.whatwg.org/
	    http://www.w3.org/TR/XMLHttpRequest2/

	    鍙傝€冨疄鐜帮細
	    https://github.com/philikon/MockHttpRequest/blob/master/lib/mock.js
	    https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js
	    https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js
	    https://github.com/firebug/firebug-lite/blob/master/content/lite/xhr.js
	    https://github.com/thx/RAP/blob/master/lab/rap.plugin.xinglie.js

	    **闇€涓嶉渶瑕佸叏闈㈤噸鍐� XMLHttpRequest锛�**
	        http://xhr.spec.whatwg.org/#interface-xmlhttprequest
	        鍏抽敭灞炴€� readyState銆乻tatus銆乻tatusText銆乺esponse銆乺esponseText銆乺esponseXML 鏄� readonly锛屾墍浠ワ紝璇曞浘閫氳繃淇敼杩欎簺鐘舵€侊紝鏉ユā鎷熷搷搴旀槸涓嶅彲琛岀殑銆�
	        鍥犳锛屽敮涓€鐨勫姙娉曟槸妯℃嫙鏁翠釜 XMLHttpRequest锛屽氨鍍� jQuery 瀵逛簨浠舵ā鍨嬬殑灏佽銆�

	    // Event handlers
	    onloadstart         loadstart
	    onprogress          progress
	    onabort             abort
	    onerror             error
	    onload              load
	    ontimeout           timeout
	    onloadend           loadend
	    onreadystatechange  readystatechange
	 */

	var Util = __webpack_require__(3)

	// 澶囦唤鍘熺敓 XMLHttpRequest
	window._XMLHttpRequest = window.XMLHttpRequest
	window._ActiveXObject = window.ActiveXObject

	/*
	    PhantomJS
	    TypeError: '[object EventConstructor]' is not a constructor (evaluating 'new Event("readystatechange")')

	    https://github.com/bluerail/twitter-bootstrap-rails-confirm/issues/18
	    https://github.com/ariya/phantomjs/issues/11289
	*/
	try {
	    new window.Event('custom')
	} catch (exception) {
	    window.Event = function(type, bubbles, cancelable, detail) {
	        var event = document.createEvent('CustomEvent') // MUST be 'CustomEvent'
	        event.initCustomEvent(type, bubbles, cancelable, detail)
	        return event
	    }
	}

	var XHR_STATES = {
	    // The object has been constructed.
	    UNSENT: 0,
	    // The open() method has been successfully invoked.
	    OPENED: 1,
	    // All redirects (if any) have been followed and all HTTP headers of the response have been received.
	    HEADERS_RECEIVED: 2,
	    // The response's body is being received.
	    LOADING: 3,
	    // The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
	    DONE: 4
	}

	var XHR_EVENTS = 'readystatechange loadstart progress abort error load timeout loadend'.split(' ')
	var XHR_REQUEST_PROPERTIES = 'timeout withCredentials'.split(' ')
	var XHR_RESPONSE_PROPERTIES = 'readyState responseURL status statusText responseType response responseText responseXML'.split(' ')

	// https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js#L32
	var HTTP_STATUS_CODES = {
	    100: "Continue",
	    101: "Switching Protocols",
	    200: "OK",
	    201: "Created",
	    202: "Accepted",
	    203: "Non-Authoritative Information",
	    204: "No Content",
	    205: "Reset Content",
	    206: "Partial Content",
	    300: "Multiple Choice",
	    301: "Moved Permanently",
	    302: "Found",
	    303: "See Other",
	    304: "Not Modified",
	    305: "Use Proxy",
	    307: "Temporary Redirect",
	    400: "Bad Request",
	    401: "Unauthorized",
	    402: "Payment Required",
	    403: "Forbidden",
	    404: "Not Found",
	    405: "Method Not Allowed",
	    406: "Not Acceptable",
	    407: "Proxy Authentication Required",
	    408: "Request Timeout",
	    409: "Conflict",
	    410: "Gone",
	    411: "Length Required",
	    412: "Precondition Failed",
	    413: "Request Entity Too Large",
	    414: "Request-URI Too Long",
	    415: "Unsupported Media Type",
	    416: "Requested Range Not Satisfiable",
	    417: "Expectation Failed",
	    422: "Unprocessable Entity",
	    500: "Internal Server Error",
	    501: "Not Implemented",
	    502: "Bad Gateway",
	    503: "Service Unavailable",
	    504: "Gateway Timeout",
	    505: "HTTP Version Not Supported"
	}

	/*
	    MockXMLHttpRequest
	*/

	function MockXMLHttpRequest() {
	    // 鍒濆鍖� custom 瀵硅薄锛岀敤浜庡瓨鍌ㄨ嚜瀹氫箟灞炴€�
	    this.custom = {
	        events: {},
	        requestHeaders: {},
	        responseHeaders: {}
	    }
	}

	MockXMLHttpRequest._settings = {
	    timeout: '10-100',
	    /*
	        timeout: 50,
	        timeout: '10-100',
	     */
	}

	MockXMLHttpRequest.setup = function(settings) {
	    Util.extend(MockXMLHttpRequest._settings, settings)
	    return MockXMLHttpRequest._settings
	}

	Util.extend(MockXMLHttpRequest, XHR_STATES)
	Util.extend(MockXMLHttpRequest.prototype, XHR_STATES)

	// 鏍囪褰撳墠瀵硅薄涓� MockXMLHttpRequest
	MockXMLHttpRequest.prototype.mock = true

	// 鏄惁鎷︽埅 Ajax 璇锋眰
	MockXMLHttpRequest.prototype.match = false

	// 鍒濆鍖� Request 鐩稿叧鐨勫睘鎬у拰鏂规硶
	Util.extend(MockXMLHttpRequest.prototype, {
	    // https://xhr.spec.whatwg.org/#the-open()-method
	    // Sets the request method, request URL, and synchronous flag.
	    open: function(method, url, async, username, password) {
	        var that = this

	        Util.extend(this.custom, {
	            method: method,
	            url: url,
	            async: typeof async === 'boolean' ? async : true,
	            username: username,
	            password: password,
	            options: {
	                url: url,
	                type: method
	            }
	        })

	        this.custom.timeout = function(timeout) {
	            if (typeof timeout === 'number') return timeout
	            if (typeof timeout === 'string' && !~timeout.indexOf('-')) return parseInt(timeout, 10)
	            if (typeof timeout === 'string' && ~timeout.indexOf('-')) {
	                var tmp = timeout.split('-')
	                var min = parseInt(tmp[0], 10)
	                var max = parseInt(tmp[1], 10)
	                return Math.round(Math.random() * (max - min)) + min
	            }
	        }(MockXMLHttpRequest._settings.timeout)

	        // 鏌ユ壘涓庤姹傚弬鏁板尮閰嶇殑鏁版嵁妯℃澘
	        var item = find(this.custom.options)

	        function handle(event) {
	            // 鍚屾灞炴€� NativeXMLHttpRequest => MockXMLHttpRequest
	            for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
	                try {
	                    that[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]]
	                } catch (e) {}
	            }
	            // 瑙﹀彂 MockXMLHttpRequest 涓婄殑鍚屽悕浜嬩欢
	            that.dispatchEvent(new Event(event.type /*, false, false, that*/ ))
	        }

	        // 濡傛灉鏈壘鍒板尮閰嶇殑鏁版嵁妯℃澘锛屽垯閲囩敤鍘熺敓 XHR 鍙戦€佽姹傘€�
	        if (!item) {
	            // 鍒涘缓鍘熺敓 XHR 瀵硅薄锛岃皟鐢ㄥ師鐢� open()锛岀洃鍚墍鏈夊師鐢熶簨浠�
	            var xhr = createNativeXMLHttpRequest()
	            this.custom.xhr = xhr

	            // 鍒濆鍖栨墍鏈変簨浠讹紝鐢ㄤ簬鐩戝惉鍘熺敓 XHR 瀵硅薄鐨勪簨浠�
	            for (var i = 0; i < XHR_EVENTS.length; i++) {
	                xhr.addEventListener(XHR_EVENTS[i], handle)
	            }

	            // xhr.open()
	            if (username) xhr.open(method, url, async, username, password)
	            else xhr.open(method, url, async)

	            // 鍚屾灞炴€� MockXMLHttpRequest => NativeXMLHttpRequest
	            for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
	                try {
	                    xhr[XHR_REQUEST_PROPERTIES[j]] = that[XHR_REQUEST_PROPERTIES[j]]
	                } catch (e) {}
	            }

	            return
	        }

	        // 鎵惧埌浜嗗尮閰嶇殑鏁版嵁妯℃澘锛屽紑濮嬫嫤鎴� XHR 璇锋眰
	        this.match = true
	        this.custom.template = item
	        this.readyState = MockXMLHttpRequest.OPENED
	        this.dispatchEvent(new Event('readystatechange' /*, false, false, this*/ ))
	    },
	    // https://xhr.spec.whatwg.org/#the-setrequestheader()-method
	    // Combines a header in author request headers.
	    setRequestHeader: function(name, value) {
	        // 鍘熺敓 XHR
	        if (!this.match) {
	            this.custom.xhr.setRequestHeader(name, value)
	            return
	        }

	        // 鎷︽埅 XHR
	        var requestHeaders = this.custom.requestHeaders
	        if (requestHeaders[name]) requestHeaders[name] += ',' + value
	        else requestHeaders[name] = value
	    },
	    timeout: 0,
	    withCredentials: false,
	    upload: {},
	    // https://xhr.spec.whatwg.org/#the-send()-method
	    // Initiates the request.
	    send: function send(data) {
	        var that = this
	        this.custom.options.body = data

	        // 鍘熺敓 XHR
	        if (!this.match) {
	            this.custom.xhr.send(data)
	            return
	        }

	        // 鎷︽埅 XHR

	        // X-Requested-With header
	        this.setRequestHeader('X-Requested-With', 'MockXMLHttpRequest')

	        // loadstart The fetch initiates.
	        this.dispatchEvent(new Event('loadstart' /*, false, false, this*/ ))

	        if (this.custom.async) setTimeout(done, this.custom.timeout) // 寮傛
	        else done() // 鍚屾

	        function done() {
	            that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
	            that.readyState = MockXMLHttpRequest.LOADING
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))

	            that.status = 200
	            that.statusText = HTTP_STATUS_CODES[200]

	            // fix #92 #93 by @qddegtya
	            that.response = that.responseText = JSON.stringify(
	                convert(that.custom.template, that.custom.options),
	                null, 4
	            )

	            that.readyState = MockXMLHttpRequest.DONE
	            that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/ ))
	            that.dispatchEvent(new Event('load' /*, false, false, that*/ ));
	            that.dispatchEvent(new Event('loadend' /*, false, false, that*/ ));
	        }
	    },
	    // https://xhr.spec.whatwg.org/#the-abort()-method
	    // Cancels any network activity.
	    abort: function abort() {
	        // 鍘熺敓 XHR
	        if (!this.match) {
	            this.custom.xhr.abort()
	            return
	        }

	        // 鎷︽埅 XHR
	        this.readyState = MockXMLHttpRequest.UNSENT
	        this.dispatchEvent(new Event('abort', false, false, this))
	        this.dispatchEvent(new Event('error', false, false, this))
	    }
	})

	// 鍒濆鍖� Response 鐩稿叧鐨勫睘鎬у拰鏂规硶
	Util.extend(MockXMLHttpRequest.prototype, {
	    responseURL: '',
	    status: MockXMLHttpRequest.UNSENT,
	    statusText: '',
	    // https://xhr.spec.whatwg.org/#the-getresponseheader()-method
	    getResponseHeader: function(name) {
	        // 鍘熺敓 XHR
	        if (!this.match) {
	            return this.custom.xhr.getResponseHeader(name)
	        }

	        // 鎷︽埅 XHR
	        return this.custom.responseHeaders[name.toLowerCase()]
	    },
	    // https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
	    // http://www.utf8-chartable.de/
	    getAllResponseHeaders: function() {
	        // 鍘熺敓 XHR
	        if (!this.match) {
	            return this.custom.xhr.getAllResponseHeaders()
	        }

	        // 鎷︽埅 XHR
	        var responseHeaders = this.custom.responseHeaders
	        var headers = ''
	        for (var h in responseHeaders) {
	            if (!responseHeaders.hasOwnProperty(h)) continue
	            headers += h + ': ' + responseHeaders[h] + '\r\n'
	        }
	        return headers
	    },
	    overrideMimeType: function( /*mime*/ ) {},
	    responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json'
	    response: null,
	    responseText: '',
	    responseXML: null
	})

	// EventTarget
	Util.extend(MockXMLHttpRequest.prototype, {
	    addEventListener: function addEventListener(type, handle) {
	        var events = this.custom.events
	        if (!events[type]) events[type] = []
	        events[type].push(handle)
	    },
	    removeEventListener: function removeEventListener(type, handle) {
	        var handles = this.custom.events[type] || []
	        for (var i = 0; i < handles.length; i++) {
	            if (handles[i] === handle) {
	                handles.splice(i--, 1)
	            }
	        }
	    },
	    dispatchEvent: function dispatchEvent(event) {
	        var handles = this.custom.events[event.type] || []
	        for (var i = 0; i < handles.length; i++) {
	            handles[i].call(this, event)
	        }

	        var ontype = 'on' + event.type
	        if (this[ontype]) this[ontype](event)
	    }
	})

	// Inspired by jQuery
	function createNativeXMLHttpRequest() {
	    var isLocal = function() {
	        var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/
	        var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/
	        var ajaxLocation = location.href
	        var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || []
	        return rlocalProtocol.test(ajaxLocParts[1])
	    }()

	    return window.ActiveXObject ?
	        (!isLocal && createStandardXHR() || createActiveXHR()) : createStandardXHR()

	    function createStandardXHR() {
	        try {
	            return new window._XMLHttpRequest();
	        } catch (e) {}
	    }

	    function createActiveXHR() {
	        try {
	            return new window._ActiveXObject("Microsoft.XMLHTTP");
	        } catch (e) {}
	    }
	}


	// 鏌ユ壘涓庤姹傚弬鏁板尮閰嶇殑鏁版嵁妯℃澘锛歎RL锛孴ype
	function find(options) {

	    for (var sUrlType in MockXMLHttpRequest.Mock._mocked) {
	        var item = MockXMLHttpRequest.Mock._mocked[sUrlType]
	        if (
	            (!item.rurl || match(item.rurl, options.url)) &&
	            (!item.rtype || match(item.rtype, options.type.toLowerCase()))
	        ) {
	            // console.log('[mock]', options.url, '>', item.rurl)
	            return item
	        }
	    }

	    function match(expected, actual) {
	        if (Util.type(expected) === 'string') {
	            return expected === actual
	        }
	        if (Util.type(expected) === 'regexp') {
	            return expected.test(actual)
	        }
	    }

	}

	// 鏁版嵁妯℃澘 锛�> 鍝嶅簲鏁版嵁
	function convert(item, options) {
	    return Util.isFunction(item.template) ?
	        item.template(options) : MockXMLHttpRequest.Mock.mock(item.template)
	}

	module.exports = MockXMLHttpRequest

/***/ }
/******/ ])
});
;
