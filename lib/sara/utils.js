/*!
 *
 * UTILITIES
 *
 * Like underscore.js, yeah!
 *
 */

var _ = module.exports = require('lodash')

_.mixin({

  /**
   *
   * Removes the extension from a string.
   *
   */
  trimExtension: function () {
    return this.match(/\.[^\/.]+$/, '')[0]
  }

  /**
   *
   * Retreives the very first key from an object as a string.
   * @param {Object} - object
   * @returns {String}
   *
   */
, firstKey: function (object) {
    for (var key in object) return String(key)
  }

  /**
   *
   * Retreives the very first value from an object without knowing the key.
   * @param {Object} - object
   * @returns {Object}
   *
   */
, firstValue: function (object) {
    for (var key in object) return object[key]
  }

  /**
   *
   * Gets the type of an object with more completeness than JavaScript's native `typeof`.
   * @param {Object} - object
   * @returns {String}
   *
   */
, typeOf: function (object) {
    if (object instanceof Array) return 'array'
    else if (object === null) return 'null'
    else if (object instanceof RegExp) return 'regexp'
    else if (object instanceof Buffer) return 'buffer'
    else return typeof object
  }

  /**
   *
   * Capitalize the first letter of a string.
   * @param {String} - str
   * @returns {String}
   *
   */
, capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }

  /**
   *
   * A utility that dynamically creates named functions using eval()
   *
   * @param {String} - name
   * @param {Function} - fn
   * @returns {undefined}
   *
   */
, createNamedFunction: function (name, fn) {
    eval(fn.toString().replace(/^function(.*?)\(/, 'var fn = function ' + name + '('))
    return fn
  }

, getBody: function (fn) {
    var str = fn.toString()
    return str.substring(str.indexOf('{') + 1, str.lastIndexOf('}'))
  }
  
  // Stolen from Crockfrod's JSON.js
, decycle: function (object) {
    'use strict';

    var objects = [],   // Keep a reference to each unique object or array
        paths = [];     // Keep the path to each unique object or array

    return (function derez(value, path) {

      var i,          // The loop counter
          name,       // Property name
          nu;         // The new object or array

      if (typeof value === 'object' && value !== null &&
                        !(value instanceof Boolean) &&
                        !(value instanceof Date)    &&
                        !(value instanceof Number)  &&
                        !(value instanceof RegExp)  &&
                        !(value instanceof String)) {

        for (i = 0; i < objects.length; i += 1) {
          if (objects[i] === value) {
            return {$ref: paths[i]};
          }
        }

        objects.push(value);
        paths.push(path);

        if (Object.prototype.toString.apply(value) === '[object Array]') {
          nu = [];
          for (i = 0; i < value.length; i += 1) {
            nu[i] = derez(value[i], path + '[' + i + ']');
          }
        } else {
          nu = {};
          for (name in value) {
            if (Object.prototype.hasOwnProperty.call(value, name)) {
              nu[name] = derez(value[name],
                               path + '[' + JSON.stringify(name) + ']');
            }
          }
        }
        return nu;
      }
      return value;
    }(object, '$'));
  }

  // Stolen from Crockfrod's JSON.js
, retrocycle: function ($) {
    'use strict';

    var px =
                /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

    (function rez(value) {

      var i, item, name, path;

      if (value && typeof value === 'object') {
        if (Object.prototype.toString.apply(value) === '[object Array]') {
          for (i = 0; i < value.length; i += 1) {
            item = value[i];
            if (item && typeof item === 'object') {
              path = item.$ref;
              if (typeof path === 'string' && px.test(path)) {
                value[i] = eval(path);
              } else {
                rez(item);
              }
            }
          }
        } else {
          for (name in value) {
            if (typeof value[name] === 'object') {
              item = value[name];
              if (item) {
                path = item.$ref;
                if (typeof path === 'string' && px.test(path)) {
                  value[name] = eval(path);
                } else {
                  rez(item);
                }
              }
            }
          }
        }
      }
    }($));
    return $;
  }

, filepathFromStackIndex: function (i) {
    var path = require('path')
      , origPrepareStackTrace = Error.prepareStackTrace
  
    // Shim our own
    Error.prepareStackTrace = function (_, stack) {
      return stack
    }
  
    // Get the call stack
    var stack = new Error().stack
  
    // Restore the original callback
    Error.prepareStackTrace = origPrepareStackTrace

    return stack[i].getFileName()
  }

, htmlEncode: function (html) {
    var tagsToReplace = {
      '&': '&amp;'
    , '<': '&lt;'
    , '>': '&gt;'
    }
    return html.replace(/[&<>]/g, function (tag) {
      return tagsToReplace[tag] || tag;
    })
  }

, htmlDecode: function (html) {
    var tagsToReplace = {
      '&amp;': '&'
    , '&lt;': '<'
    , '&gt;': '>'
    }
    return html.replace(/&lt;|&gt;|&amp;/g, function (tag) {
      return tagsToReplace[tag] || tag;
    })
  }

  /**
   *
   * Pluralize a string.
   * @param {String} - str
   * @returns {String}
   *
   */
, pluralize: (function() {
    var userDefined = {};

    function capitalizeSame(word, sampleWord) {
      if ( sampleWord.match(/^[A-Z]/) ) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    }

    // returns a plain Object having the given keys,
    // all with value 1, which can be used for fast lookups.
    function toKeys(keys) {
      keys = keys.split(',');
      var keysLength = keys.length;
      var table = {};
      for ( var i=0; i < keysLength; i++ ) {
        table[ keys[i] ] = 1;
      }
      return table;
    }

    // words that are always singular, always plural, or the same in both forms.
    var uninflected = toKeys("aircraft,advice,blues,corn,molasses,equipment,gold,information,cotton,jewelry,kin,legislation,luck,luggage,moose,music,offspring,rice,silver,trousers,wheat,bison,bream,breeches,britches,carp,chassis,clippers,cod,contretemps,corps,debris,diabetes,djinn,eland,elk,flounder,gallows,graffiti,headquarters,herpes,high,homework,innings,jackanapes,mackerel,measles,mews,mumps,news,pincers,pliers,proceedings,rabies,salmon,scissors,sea,series,shears,species,swine,trout,tuna,whiting,wildebeest,pike,oats,tongs,dregs,snuffers,victuals,tweezers,vespers,pinchers,bellows,cattle");

    var irregular = {
      // pronouns
      I: 'we',
      he: 'they',
      it: 'they',  // or them
      me: 'us',
      you: 'you',
      todo: 'todos',
      him: 'them',
      them: 'them',
      myself: 'ourselves',
      yourself: 'yourselves',
      himself: 'themselves',
      herself: 'themselves',
      itself: 'themselves',
      themself: 'themselves',
      oneself: 'oneselves',

      child: 'children',
      dwarf: 'dwarfs',  // dwarfs are real; dwarves are fantasy.
      mongoose: 'mongooses',
      mythos: 'mythoi',
      ox: 'oxen',
      soliloquy: 'soliloquies',
      trilby: 'trilbys',
      person: 'people',
      forum: 'forums', // fora is ok but uncommon.

      // latin plural in popular usage.
      syllabus: 'syllabi',
      alumnus: 'alumni', 
      genus: 'genera',
      viscus: 'viscera',
      stigma: 'stigmata'
    };

    var suffixRules = [
      // common suffixes
      [ /man$/i, 'men' ],
      [ /([lm])ouse$/i, '$1ice' ],
      [ /tooth$/i, 'teeth' ],
      [ /goose$/i, 'geese' ],
      [ /foot$/i, 'feet' ],
      [ /zoon$/i, 'zoa' ],
      [ /([tcsx])is$/i, '$1es' ],

      // fully assimilated suffixes
      [ /ix$/i, 'ices' ],
      [ /^(cod|mur|sil|vert)ex$/i, '$1ices' ],
      [ /^(agend|addend|memorand|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi)um$/i, '$1a' ],
      [ /^(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)on$/i, '$1a' ],
      [ /^(alumn|alg|vertebr)a$/i, '$1ae' ],
      
      // churches, classes, boxes, etc.
      [ /([cs]h|ss|x)$/i, '$1es' ],

      // words with -ves plural form
      [ /([aeo]l|[^d]ea|ar)f$/i, '$1ves' ],
      [ /([nlw]i)fe$/i, '$1ves' ],

      // -y
      [ /([aeiou])y$/i, '$1ys' ],
      [ /(^[A-Z][a-z]*)y$/, '$1ys' ], // case sensitive!
      [ /y$/i, 'ies' ],

      // -o
      [ /([aeiou])o$/i, '$1os' ],
      [ /^(pian|portic|albin|generalissim|manifest|archipelag|ghett|medic|armadill|guan|octav|command|infern|phot|ditt|jumb|pr|dynam|ling|quart|embry|lumbag|rhin|fiasc|magnet|styl|alt|contralt|sopran|bass|crescend|temp|cant|sol|kimon)o$/i, '$1os' ],
      [ /o$/i, 'oes' ],

      // words ending in s...
      [ /s$/i, 'ses' ]
    ];

    // pluralizes the given singular noun.  There are three ways to call it:
    //   pluralize(noun) -> pluralNoun
    //     Returns the plural of the given noun.
    //   Example: 
    //     pluralize("person") -> "people"
    //     pluralize("me") -> "us"
    //
    //   pluralize(noun, count) -> plural or singular noun
    //   Inflect the noun according to the count, returning the singular noun
    //   if the count is 1.
    //   Examples:
    //     pluralize("person", 3) -> "people"
    //     pluralize("person", 1) -> "person"
    //     pluralize("person", 0) -> "people"
    //
    //   pluralize(noun, count, plural) -> plural or singular noun
    //   you can provide an irregular plural yourself as the 3rd argument.
    //   Example:
    //     pluralize("ch̢teau", 2 "ch̢teaux") -> "ch̢teaux"
    function pluralize(word, count, plural) {
      // handle the empty string reasonably.
      if ( word === '' ) return '';

      // singular case.
      if ( count === 1 ) return word;

      // life is very easy if an explicit plural was provided.
      if ( typeof plural === 'string' ) return plural;

      var lowerWord = word.toLowerCase();

      // user defined rules have the highest priority.
      if ( lowerWord in userDefined ) {
        return capitalizeSame(userDefined[lowerWord], word);
      }

      // single letters are pluralized with 's, "I got five A's on
      // my report card."
      if ( word.match(/^[A-Z]$/) ) return word + "'s";

      // some word don't change form when plural.
      if ( word.match(/fish$|ois$|sheep$|deer$|pox$|itis$/i) ) return word;
      if ( word.match(/^[A-Z][a-z]*ese$/) ) return word;  // Nationalities.
      if ( lowerWord in uninflected ) return word;

      // there's a known set of words with irregular plural forms.
      if ( lowerWord in irregular ) {
        return capitalizeSame(irregular[lowerWord], word);
      }
      
      // try to pluralize the word depending on its suffix.
      var suffixRulesLength = suffixRules.length;
      for ( var i=0; i < suffixRulesLength; i++ ) {
        var rule = suffixRules[i];
        if ( word.match(rule[0]) ) {
          return word.replace(rule[0], rule[1]);
        }
      }

      // if all else fails, just add s.
      return word + 's';
    }

    pluralize.define = function(word, plural) {
      userDefined[word.toLowerCase()] = plural;
    }

    return pluralize;

  })()

, pathRegexp: function (path, keys, sensitive, strict, end) {
    if (toString.call(path) == '[object RegExp]') return path;
    if (Array.isArray(path)) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '') + (star ? '(/*)?' : '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + ((end) ? '$' : ''), sensitive ? '' : 'i');
  }

, onlyOnce: function (fn) {
    var called = false;
    return function () {
      if (called) throw new Error("Callback was already called.");
      called = true;
      fn.apply(root, arguments);
    }
  }

, asyncForEach: function (arr, iterator, callback) {
    callback = callback || function () {};
    if (!arr.length) {
      return callback();
    }
    var completed = 0;
    this.forEach(arr, function (x) {
      iterator(x, this.onlyOnce(function (err) {
        if (err) {
          callback(err);
          callback = function () {};
        }
        else {
          completed += 1;
          if (completed >= arr.length) {
            callback(null);
          }
        }
      }));
    }.bind(this));
  }

, asyncEvery: function (arr, iterator, main_callback) {
    this.asyncForEach(arr, function (x, callback) {
      iterator(x, function (v) {
        if (!v) {
          main_callback(false);
          main_callback = function () {};
        }
        callback();
      });
    }, function (err) {
      main_callback(true);
    });
  }
})
