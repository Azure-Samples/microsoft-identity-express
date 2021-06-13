'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var express = _interopDefault(require('express'));
var msalCommon = require('@azure/msal-common');
var msalNode = require('@azure/msal-node');
var jwt = _interopDefault(require('jsonwebtoken'));
var jwksClient = _interopDefault(require('jwks-rsa'));
var axios = _interopDefault(require('axios'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var ConfigurationUtils = /*#__PURE__*/function () {
  function ConfigurationUtils() {}

  /**
   * Validates the fields in the custom JSON configuration file
   * @param {AppSettings} config: configuration file
   * @returns {void}
   */
  ConfigurationUtils.validateAppSettings = function validateAppSettings(config) {
    if (!config.appCredentials.clientId || config.appCredentials.clientId === "Enter_the_Application_Id_Here") {
      throw new Error("No clientId provided!");
    }

    if (!config.appCredentials.tenantId || config.appCredentials.tenantId === "Enter_the_Tenant_Info_Here") {
      throw new Error("No tenantId provided!");
    }

    if (!config.appCredentials.clientSecret || config.appCredentials.clientSecret === "Enter_the_Client_Secret_Here") {
      throw new Error("No clientSecret provided!");
    }
  };

  /**
   * Maps the custom JSON configuration file to configuration
   * object expected by MSAL Node ConfidentialClientApplication
   * @param {AppSettings} config: configuration file
   * @param {ICachePlugin} cachePlugin: passed during initialization
   * @returns {Configuration}
   */
  ConfigurationUtils.getMsalConfiguration = function getMsalConfiguration(config, cachePlugin) {
    if (cachePlugin === void 0) {
      cachePlugin = null;
    }

    return {
      auth: {
        clientId: config.appCredentials.clientId,
        authority: config.b2cPolicies ? Object.entries(config.b2cPolicies)[0][1]["authority"] : "https://" + msalCommon.Constants.DEFAULT_AUTHORITY_HOST + "/" + config.appCredentials.tenantId,
        clientSecret: config.appCredentials.clientSecret,
        knownAuthorities: config.b2cPolicies ? [msalCommon.UrlString.getDomainFromUrl(Object.entries(config.b2cPolicies)[0][1]["authority"])] : []
      },
      cache: {
        cachePlugin: cachePlugin
      },
      system: {
        loggerOptions: {
          loggerCallback: function loggerCallback(logLevel, message, containsPii) {
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: msalNode.LogLevel.Verbose
        }
      }
    };
  };

  return ConfigurationUtils;
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
var AppStages = {
  SIGN_IN: "sign_in",
  SIGN_OUT: "sign_out",
  ACQUIRE_TOKEN: "acquire_token"
};
/**
 * Various error constants
 */

var ErrorMessages = {
  NOT_PERMITTED: "Not permitted",
  INVALID_TOKEN: "Invalid token",
  CANNOT_DETERMINE_APP_STAGE: "Cannot determine application stage",
  CANNOT_VALIDATE_TOKEN: "Cannot validate token",
  NONCE_MISMATCH: "Nonce does not match",
  INTERACTION_REQUIRED: "interaction_required",
  TOKEN_ACQUISITION_FAILED: "Token acquisition failed",
  AUTH_CODE_NOT_OBTAINED: "Authorization code cannot be obtained",
  TOKEN_NOT_FOUND: "No token found",
  TOKEN_NOT_DECODED: "Token cannot be decoded",
  TOKEN_NOT_VERIFIED: "Token cannot be verified",
  KEYS_NOT_OBTAINED: "Signing keys cannot be obtained",
  STATE_NOT_FOUND: "State not found",
  USER_HAS_NO_ROLE: "User does not have any roles",
  USER_NOT_IN_ROLE: "User does not have this role",
  USER_HAS_NO_GROUP: "User does not have any groups",
  USER_NOT_IN_GROUP: "User does not have this group",
  METHOD_NOT_ALLOWED: "Method not allowed for this route",
  RULE_NOT_FOUND: "No rule found for this route",
  SESSION_NOT_FOUND: "No session found for this request"
};
/**
 * Constants used in access control scenarios
 */

var AccessConstants = {
  GROUPS: "groups",
  ROLES: "roles",
  CLAIM_NAMES: "_claim_name",
  CLAIM_SOURCES: "_claim_sources"
};

var TokenValidator = /*#__PURE__*/function () {
  /**
   * @param {AppSettings} appSettings
   * @param {Configuration} msalConfig
   * @constructor
   */
  function TokenValidator(appSettings, msalConfig) {
    this.appSettings = appSettings;
    this.msalConfig = msalConfig;
  }
  /**
   *
   * @param {string} authToken
   * @returns {Promise}
   */


  var _proto = TokenValidator.prototype;

  _proto.verifyTokenSignature =
  /*#__PURE__*/
  function () {
    var _verifyTokenSignature = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(authToken) {
      var decodedToken, keys, verifiedToken;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!msalCommon.StringUtils.isEmpty(authToken)) {
                _context.next = 3;
                break;
              }

              console.log(ErrorMessages.TOKEN_NOT_FOUND);
              return _context.abrupt("return", false);

            case 3:
              _context.prev = 3;
              decodedToken = jwt.decode(authToken, {
                complete: true
              });
              _context.next = 12;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](3);
              console.log(ErrorMessages.TOKEN_NOT_DECODED);
              console.log(_context.t0);
              return _context.abrupt("return", false);

            case 12:
              _context.prev = 12;
              _context.next = 15;
              return this.getSigningKeys(decodedToken.header, decodedToken.payload.tid);

            case 15:
              keys = _context.sent;
              _context.next = 23;
              break;

            case 18:
              _context.prev = 18;
              _context.t1 = _context["catch"](12);
              console.log(ErrorMessages.KEYS_NOT_OBTAINED);
              console.log(_context.t1);
              return _context.abrupt("return", false);

            case 23:
              _context.prev = 23;
              verifiedToken = jwt.verify(authToken, keys);
              /**
               * if a multiplexer was used in place of tenantId i.e. if the app
               * is multi-tenant, the tenantId should be obtained from the user"s
               * token"s tid claim for verification purposes
               */

              if (this.appSettings.appCredentials.tenantId === "common" || this.appSettings.appCredentials.tenantId === "organizations" || this.appSettings.appCredentials.tenantId === "consumers") {
                this.appSettings.appCredentials.tenantId = decodedToken.payload.tid;
              }

              return _context.abrupt("return", verifiedToken);

            case 29:
              _context.prev = 29;
              _context.t2 = _context["catch"](23);
              console.log(ErrorMessages.TOKEN_NOT_VERIFIED);
              console.log(_context.t2);
              return _context.abrupt("return", false);

            case 34:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[3, 7], [12, 18], [23, 29]]);
    }));

    function verifyTokenSignature(_x) {
      return _verifyTokenSignature.apply(this, arguments);
    }

    return verifyTokenSignature;
  }();

  /**
   *
   * @param {string} idToken: raw Id token
   * @returns {Promise}
   */
  _proto.validateIdToken =
  /*#__PURE__*/
  function () {
    var _validateIdToken = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(idToken) {
      var verifiedToken;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return this.verifyTokenSignature(idToken);

            case 3:
              verifiedToken = _context2.sent;

              if (!verifiedToken) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", this.validateIdTokenClaims(verifiedToken));

            case 8:
              return _context2.abrupt("return", false);

            case 9:
              _context2.next = 15;
              break;

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);
              return _context2.abrupt("return", false);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[0, 11]]);
    }));

    function validateIdToken(_x2) {
      return _validateIdToken.apply(this, arguments);
    }

    return validateIdToken;
  }();

  /**
   * Validates the id token for a set of claims
   * @param {TokenClaims} idTokenClaims: decoded id token claims
   * @returns {boolean}
   */
  _proto.validateIdTokenClaims = function validateIdTokenClaims(idTokenClaims) {
    var now = Math.round(new Date().getTime() / 1000); // in UNIX format

    /**
     * At the very least, check for issuer, audience, issue and expiry dates.
     * For more information on validating id tokens, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/id-tokens#validating-an-id_token
     */

    var checkIssuer = idTokenClaims["iss"].includes(this.appSettings.appCredentials.tenantId) ? true : false;
    var checkAudience = idTokenClaims["aud"] === this.msalConfig.auth.clientId ? true : false;
    var checkTimestamp = idTokenClaims["iat"] <= now && idTokenClaims["exp"] >= now ? true : false;
    return checkIssuer && checkAudience && checkTimestamp;
  };

  /**
   * Validates the access token for signature and against a predefined set of claims
   * @param {string} accessToken: raw JWT token
   * @param {string} protectedRoute: used for checking scope
   * @returns {Promise}
   */
  _proto.validateAccessToken =
  /*#__PURE__*/
  function () {
    var _validateAccessToken = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(accessToken, protectedRoute) {
      var verifiedToken;
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return this.verifyTokenSignature(accessToken);

            case 3:
              verifiedToken = _context3.sent;

              if (!verifiedToken) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", this.validateAccessTokenClaims(verifiedToken, protectedRoute));

            case 8:
              return _context3.abrupt("return", false);

            case 9:
              _context3.next = 15;
              break;

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);
              return _context3.abrupt("return", false);

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 11]]);
    }));

    function validateAccessToken(_x3, _x4) {
      return _validateAccessToken.apply(this, arguments);
    }

    return validateAccessToken;
  }();

  /**
   *
   * @param {TokenClaims} verifiedToken
   * @param {string} protectedRoute
   * @returns {boolean}
   */
  _proto.validateAccessTokenClaims = function validateAccessTokenClaims(verifiedToken, protectedRoute) {
    var now = Math.round(new Date().getTime() / 1000); // in UNIX format

    /**
     * At the very least, validate the token with respect to issuer, audience, scope
     * and timestamp, though implementation and extent vary. For more information, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens
     */

    var checkIssuer = verifiedToken["iss"].includes(this.appSettings.appCredentials.tenantId) ? true : false;
    var checkTimestamp = verifiedToken["iat"] <= now && verifiedToken["exp"] >= now ? true : false;
    var checkAudience = verifiedToken["aud"] === this.appSettings.appCredentials.clientId || verifiedToken["aud"] === "api://" + this.appSettings.appCredentials.clientId ? true : false;
    var checkScopes = Object.values(this.appSettings.ownedResources).find(function (resource) {
      return resource.endpoint === protectedRoute;
    }).scopes.every(function (scp) {
      return verifiedToken["scp"].includes(scp);
    });
    return checkAudience && checkIssuer && checkTimestamp && checkScopes;
  };

  /**
   * Fetches signing keys of an access token
   * from the authority discovery endpoint
   * @param {Object} header
   * @returns {Promise}
   */
  _proto.getSigningKeys =
  /*#__PURE__*/
  function () {
    var _getSigningKeys = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(header, tid) {
      var jwksUri, client;
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // Check if a B2C application i.e. app has b2cPolicies
              if (this.appSettings.b2cPolicies) {
                jwksUri = this.msalConfig.auth.authority + "/discovery/v2.0/keys";
              } else {
                jwksUri = "https://" + msalCommon.Constants.DEFAULT_AUTHORITY_HOST + "/" + tid + "/discovery/v2.0/keys";
              }

              client = jwksClient({
                jwksUri: jwksUri
              });
              _context4.next = 4;
              return client.getSigningKeyAsync(header.kid);

            case 4:
              return _context4.abrupt("return", _context4.sent.getPublicKey());

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function getSigningKeys(_x5, _x6) {
      return _getSigningKeys.apply(this, arguments);
    }

    return getSigningKeys;
  }();

  return TokenValidator;
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var UrlUtils = function UrlUtils() {};
/**
 * Gets the absolute URL from a given request and path string
 * @param {Request} req
 * @param {string} uri
 * @returns {string}
 */

UrlUtils.ensureAbsoluteUrl = function (req, uri) {
  var urlComponents = new msalCommon.UrlString(uri).getUrlComponents();

  if (!urlComponents.Protocol) {
    if (!urlComponents.HostNameAndPort) {
      return req.protocol + "://" + req.get("host") + uri;
    }

    return req.protocol + "://" + uri;
  } else {
    return uri;
  }
};

var FetchManager = function FetchManager() {};
/**
 * Calls a resource endpoint with a raw access token
 * using the authorization bearer token scheme
 * @param {string} endpoint
 * @param {string} accessToken
 * @returns {Promise}
 */

FetchManager.callApiEndpoint = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(endpoint, accessToken) {
    var options, response;
    return runtime_1.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!msalCommon.StringUtils.isEmpty(accessToken)) {
              _context.next = 2;
              break;
            }

            throw new Error(ErrorMessages.TOKEN_NOT_FOUND);

          case 2:
            options = {
              headers: {
                Authorization: "Bearer " + accessToken
              }
            };
            console.log("request made to web API at: " + new Date().toString());
            _context.prev = 4;
            _context.next = 7;
            return axios.get(endpoint, options);

          case 7:
            response = _context.sent;
            return _context.abrupt("return", response.data);

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](4);
            console.log(_context.t0);
            return _context.abrupt("return", _context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 11]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @param {string} accessToken
 * @param {string} nextPage
 * @param {Array} userGroups
 * @returns {Promise}
 */


FetchManager.handlePagination = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(accessToken, nextPage, userGroups) {
    var graphResponse;
    return runtime_1.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (userGroups === void 0) {
              userGroups = [];
            }

            _context2.prev = 1;
            _context2.next = 4;
            return FetchManager.callApiEndpoint(nextPage, accessToken);

          case 4:
            graphResponse = _context2.sent;
            graphResponse["value"].map(function (v) {
              return userGroups.push(v.id);
            });

            if (!graphResponse["@odata.nextLink"]) {
              _context2.next = 12;
              break;
            }

            _context2.next = 9;
            return FetchManager.handlePagination(accessToken, graphResponse["@odata.nextLink"], userGroups);

          case 9:
            return _context2.abrupt("return", _context2.sent);

          case 12:
            return _context2.abrupt("return", userGroups);

          case 13:
            _context2.next = 19;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);
            return _context2.abrupt("return", _context2.t0);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 15]]);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express MVC web apps.
 *
 * You must have express and express-sessions package installed. Middleware
 * here can be used with express sessions in route controllers.
 *
 * Session variables accessible are as follows:
 * req.session.isAuthenticated: boolean
 * req.session.account: AccountInfo
 * req.session.remoteResources.{resourceName}.accessToken: string
 */

var AuthProvider = /*#__PURE__*/function () {
  /**
   * @param {AppSettings} appSettings
   * @param {ICachePlugin} cache: cachePlugin
   * @constructor
   */
  function AuthProvider(appSettings, cache) {
    var _this = this;

    /**
     * Initialize authProvider and set default routes
     * @param {InitializationOptions} options
     * @returns {Router}
     */
    this.initialize = function (options) {
      // TODO: takex in login routes
      var appRouter = express.Router(); // authentication routes

      appRouter.get('/signin', _this.signIn);
      appRouter.get('/signout', _this.signOut);
      appRouter.get('/redirect', _this.handleRedirect);
      return appRouter;
    }; // ========== HANDLERS ===========

    /**
     * Initiate sign in flow
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @returns {void}
     */


    this.signIn = function (req, res, next) {
      /**
       * Request Configuration
       * We manipulate these three request objects below
       * to acquire a token with the appropriate claims
       */
      if (!req.session["authCodeRequest"]) {
        req.session.authCodeRequest = {
          authority: "",
          scopes: [],
          state: {},
          redirectUri: ""
        };
      }

      if (!req.session["tokenRequest"]) {
        req.session.tokenRequest = {
          authority: "",
          scopes: [],
          redirectUri: "",
          code: ""
        };
      } // signed-in user's account


      if (!req.session["account"]) {
        req.session.account = {
          homeAccountId: "",
          environment: "",
          tenantId: "",
          username: "",
          idTokenClaims: {}
        };
      } // random GUID for csrf protection


      req.session.nonce = _this.cryptoProvider.createNewGuid();

      var state = _this.cryptoProvider.base64Encode(JSON.stringify({
        stage: AppStages.SIGN_IN,
        path: req.route.path,
        nonce: req.session.nonce
      }));

      var params = {
        authority: _this.msalConfig.auth.authority,
        scopes: msalCommon.OIDC_DEFAULT_SCOPES,
        state: state,
        redirect: UrlUtils.ensureAbsoluteUrl(req, _this.appSettings.authRoutes.redirect),
        prompt: msalCommon.PromptValue.SELECT_ACCOUNT
      }; // get url to sign user in

      _this.getAuthCode(req, res, params);
    };
    /**
     * Initiate sign out and destroy the session
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @returns {void}
     */


    this.signOut = function (req, res, next) {
      var postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(req, _this.appSettings.authRoutes.postLogout);
      /**
       * Construct a logout URI and redirect the user to end the
       * session with Azure AD/B2C. For more information, visit:
       * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
       * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
       */

      var logoutURI = _this.msalConfig.auth.authority + "/oauth2/v2.0/logout?post_logout_redirect_uri=" + postLogoutRedirectUri;
      req.session.isAuthenticated = false;
      req.session.destroy(function () {
        res.redirect(logoutURI);
      });
    };
    /**
     * Middleware that handles redirect depending on request state
     * There are basically 2 stages: sign-in and acquire token
     * @param {Request} req: express request object
     * @param {Response} res: express response object
     * @param {NextFunction} next: express next function
     * @returns {Promise}
     */


    this.handleRedirect = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(req, res, next) {
        var state, tokenResponse, isIdTokenValid, resourceName, _tokenResponse;

        return runtime_1.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!req.query.state) {
                  _context.next = 58;
                  break;
                }

                state = JSON.parse(_this.cryptoProvider.base64Decode(req.query.state)); // check if nonce matches

                if (!(state.nonce === req.session.nonce)) {
                  _context.next = 54;
                  break;
                }

                _context.t0 = state.stage;
                _context.next = _context.t0 === AppStages.SIGN_IN ? 6 : _context.t0 === AppStages.ACQUIRE_TOKEN ? 32 : 49;
                break;

              case 6:
                // token request should have auth code
                req.session.tokenRequest.code = req.query.code;
                _context.prev = 7;
                _context.next = 10;
                return _this.msalClient.acquireTokenByCode(req.session.tokenRequest);

              case 10:
                tokenResponse = _context.sent;
                console.log("\nResponse: \n:", tokenResponse);
                _context.prev = 12;
                _context.next = 15;
                return _this.tokenValidator.validateIdToken(tokenResponse.idToken);

              case 15:
                isIdTokenValid = _context.sent;

                if (isIdTokenValid) {
                  // assign session variables
                  req.session.account = tokenResponse.account;
                  req.session.isAuthenticated = true;
                  res.redirect(_this.appSettings.authRoutes.postLogin);
                } else {
                  console.log(ErrorMessages.INVALID_TOKEN);
                  res.redirect(_this.appSettings.authRoutes.unauthorized);
                }

                _context.next = 24;
                break;

              case 19:
                _context.prev = 19;
                _context.t1 = _context["catch"](12);
                console.log(ErrorMessages.CANNOT_VALIDATE_TOKEN);
                console.log(_context.t1);
                next(_context.t1);

              case 24:
                _context.next = 31;
                break;

              case 26:
                _context.prev = 26;
                _context.t2 = _context["catch"](7);
                console.log(ErrorMessages.TOKEN_ACQUISITION_FAILED);
                console.log(_context.t2);
                next(_context.t2);

              case 31:
                return _context.abrupt("break", 52);

              case 32:
                // get the name of the resource associated with scope
                resourceName = _this.getResourceNameFromScopes(req.session.tokenRequest.scopes);
                req.session.tokenRequest.code = req.query.code;
                _context.prev = 34;
                _context.next = 37;
                return _this.msalClient.acquireTokenByCode(req.session.tokenRequest);

              case 37:
                _tokenResponse = _context.sent;
                console.log("\nResponse: \n:", _tokenResponse);
                req.session.remoteResources[resourceName].accessToken = _tokenResponse.accessToken;
                res.redirect(state.path);
                _context.next = 48;
                break;

              case 43:
                _context.prev = 43;
                _context.t3 = _context["catch"](34);
                console.log(ErrorMessages.TOKEN_ACQUISITION_FAILED);
                console.log(_context.t3);
                next(_context.t3);

              case 48:
                return _context.abrupt("break", 52);

              case 49:
                console.log(ErrorMessages.CANNOT_DETERMINE_APP_STAGE);
                res.redirect(_this.appSettings.authRoutes.error);
                return _context.abrupt("break", 52);

              case 52:
                _context.next = 56;
                break;

              case 54:
                console.log(ErrorMessages.NONCE_MISMATCH);
                res.redirect(_this.appSettings.authRoutes.unauthorized);

              case 56:
                _context.next = 60;
                break;

              case 58:
                console.log(ErrorMessages.STATE_NOT_FOUND);
                res.redirect(_this.appSettings.authRoutes.unauthorized);

              case 60:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[7, 26], [12, 19], [34, 43]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }(); // ========== MIDDLEWARE ===========

    /**
     * Middleware that gets tokens via acquireToken*
     * @param {TokenOptions} options: express request object
     * @returns {RequestHandler}
     */


    this.getToken = function (options) {
      return /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(req, res, next) {
          var _req$session$remoteRe;

          var scopes, resourceName, silentRequest, tokenResponse, state, params;
          return runtime_1.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // get scopes for token request
                  scopes = options.resource.scopes;
                  resourceName = _this.getResourceNameFromScopes(scopes);

                  if (!req.session.remoteResources) {
                    req.session.remoteResources = {};
                  }

                  req.session.remoteResources = (_req$session$remoteRe = {}, _req$session$remoteRe[resourceName] = _extends({}, _this.appSettings.remoteResources[resourceName], {
                    accessToken: null
                  }), _req$session$remoteRe);
                  _context2.prev = 4;
                  silentRequest = {
                    account: req.session.account,
                    scopes: scopes
                  }; // acquire token silently to be used in resource call

                  _context2.next = 8;
                  return _this.msalClient.acquireTokenSilent(silentRequest);

                case 8:
                  tokenResponse = _context2.sent;
                  console.log("\nSuccessful silent token acquisition:\n Response: \n:", tokenResponse); // In B2C scenarios, sometimes an access token is returned empty.
                  // In that case, we will acquire token interactively instead.

                  if (!msalCommon.StringUtils.isEmpty(tokenResponse.accessToken)) {
                    _context2.next = 13;
                    break;
                  }

                  console.log(ErrorMessages.TOKEN_NOT_FOUND);
                  throw new msalCommon.InteractionRequiredAuthError(ErrorMessages.INTERACTION_REQUIRED);

                case 13:
                  req.session.remoteResources[resourceName].accessToken = tokenResponse.accessToken;
                  next();
                  _context2.next = 20;
                  break;

                case 17:
                  _context2.prev = 17;
                  _context2.t0 = _context2["catch"](4);

                  // in case there are no cached tokens, initiate an interactive call
                  if (_context2.t0 instanceof msalCommon.InteractionRequiredAuthError) {
                    state = _this.cryptoProvider.base64Encode(JSON.stringify({
                      stage: AppStages.ACQUIRE_TOKEN,
                      path: req.route.path,
                      nonce: req.session.nonce
                    }));
                    params = {
                      authority: _this.msalConfig.auth.authority,
                      scopes: scopes,
                      state: state,
                      redirect: UrlUtils.ensureAbsoluteUrl(req, _this.appSettings.authRoutes.redirect),
                      account: req.session.account
                    }; // initiate the first leg of auth code grant to get token

                    _this.getAuthCode(req, res, params);
                  } else {
                    next(_context2.t0);
                  }

                case 20:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[4, 17]]);
        }));

        return function (_x4, _x5, _x6) {
          return _ref2.apply(this, arguments);
        };
      }();
    };
    /**
     * Middleware that gets tokens via OBO flow. Used in api scenarios
     * @param {TokenOptions} options: express request object
     * @returns {RequestHandler}
     */


    this.getTokenOnBehalf = function (options) {
      return /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(req, res, next) {
          var authHeader, scopes, resourceName, oboRequest, _req$locals, tokenResponse;

          return runtime_1.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  authHeader = req.headers.authorization; // get scopes for token request

                  scopes = options.resource.scopes;
                  resourceName = _this.getResourceNameFromScopes(scopes);
                  oboRequest = {
                    oboAssertion: authHeader.split(" ")[1],
                    scopes: scopes
                  };
                  _context3.prev = 4;
                  _context3.next = 7;
                  return _this.msalClient.acquireTokenOnBehalfOf(oboRequest);

                case 7:
                  tokenResponse = _context3.sent;
                  req["locals"] = (_req$locals = {}, _req$locals[resourceName] = {
                    "accessToken": tokenResponse.accessToken
                  }, _req$locals);
                  next();
                  _context3.next = 16;
                  break;

                case 12:
                  _context3.prev = 12;
                  _context3.t0 = _context3["catch"](4);
                  console.log(_context3.t0);
                  next(_context3.t0);

                case 16:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, null, [[4, 12]]);
        }));

        return function (_x7, _x8, _x9) {
          return _ref3.apply(this, arguments);
        };
      }();
    }; // ============== GUARDS ===============

    /**
     * Check if authenticated in session
     * @param {GuardOptions} options: express request object
     * @returns {RequestHandler}
     */


    this.isAuthenticated = function (options) {
      return function (req, res, next) {
        if (req.session) {
          if (!req.session.isAuthenticated) {
            console.log(ErrorMessages.NOT_PERMITTED);
            return res.redirect(_this.appSettings.authRoutes.unauthorized);
          }

          next();
        } else {
          console.log(ErrorMessages.SESSION_NOT_FOUND);
          res.redirect(_this.appSettings.authRoutes.unauthorized);
        }
      };
    };
    /**
     * Receives access token in req authorization header
     * and validates it using the jwt.verify
     * @param {GuardOptions} options: express request object
     * @returns {RequestHandler}
     */


    this.isAuthorized = function (options) {
      return /*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(req, res, next) {
          var accessToken;
          return runtime_1.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  accessToken = req.headers.authorization.split(" ")[1];

                  if (!req.headers.authorization) {
                    _context4.next = 10;
                    break;
                  }

                  _context4.next = 4;
                  return _this.tokenValidator.validateAccessToken(accessToken, req.route.path);

                case 4:
                  if (_context4.sent) {
                    _context4.next = 7;
                    break;
                  }

                  console.log(ErrorMessages.INVALID_TOKEN);
                  return _context4.abrupt("return", res.redirect(_this.appSettings.authRoutes.unauthorized));

                case 7:
                  next();
                  _context4.next = 12;
                  break;

                case 10:
                  console.log(ErrorMessages.TOKEN_NOT_FOUND);
                  res.redirect(_this.appSettings.authRoutes.unauthorized);

                case 12:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        return function (_x10, _x11, _x12) {
          return _ref4.apply(this, arguments);
        };
      }();
    };
    /**
     * Checks if the user has access for this route, defined in access matrix
     * @param {GuardOptions} options: express request object
     * @returns {RequestHandler}
     */


    this.hasAccess = function (options) {
      return /*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(req, res, next) {
          var checkFor, groups, roles;
          return runtime_1.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (!(req.session && _this.appSettings.accessMatrix)) {
                    _context5.next = 34;
                    break;
                  }

                  checkFor = options.accessRule.hasOwnProperty(AccessConstants.GROUPS) ? AccessConstants.GROUPS : AccessConstants.ROLES;
                  _context5.t0 = checkFor;
                  _context5.next = _context5.t0 === AccessConstants.GROUPS ? 5 : _context5.t0 === AccessConstants.ROLES ? 21 : 31;
                  break;

                case 5:
                  if (!(req.session.account.idTokenClaims[AccessConstants.GROUPS] === undefined)) {
                    _context5.next = 16;
                    break;
                  }

                  if (!(req.session.account.idTokenClaims[AccessConstants.CLAIM_NAMES] || req.session.account.idTokenClaims[AccessConstants.CLAIM_SOURCES])) {
                    _context5.next = 12;
                    break;
                  }

                  _context5.next = 9;
                  return _this.handleOverage(req, res, next, options.accessRule);

                case 9:
                  return _context5.abrupt("return", _context5.sent);

                case 12:
                  console.log(ErrorMessages.USER_HAS_NO_GROUP);
                  return _context5.abrupt("return", res.redirect(_this.appSettings.authRoutes.unauthorized));

                case 14:
                  _context5.next = 19;
                  break;

                case 16:
                  groups = req.session.account.idTokenClaims[AccessConstants.GROUPS];

                  if (_this.applyAccessRule(req.method, options.accessRule, groups, true)) {
                    _context5.next = 19;
                    break;
                  }

                  return _context5.abrupt("return", res.redirect(_this.appSettings.authRoutes.unauthorized));

                case 19:
                  next();
                  return _context5.abrupt("break", 32);

                case 21:
                  if (!(req.session.account.idTokenClaims[AccessConstants.ROLES] === undefined)) {
                    _context5.next = 26;
                    break;
                  }

                  console.log(ErrorMessages.USER_HAS_NO_ROLE);
                  return _context5.abrupt("return", res.redirect(_this.appSettings.authRoutes.unauthorized));

                case 26:
                  roles = req.session.account.idTokenClaims[AccessConstants.ROLES];

                  if (!_this.applyAccessRule(req.method, options.accessRule, roles, false)) {
                    _context5.next = 29;
                    break;
                  }

                  return _context5.abrupt("return", res.redirect(_this.appSettings.authRoutes.unauthorized));

                case 29:
                  next();
                  return _context5.abrupt("break", 32);

                case 31:
                  return _context5.abrupt("break", 32);

                case 32:
                  _context5.next = 35;
                  break;

                case 34:
                  res.redirect(_this.appSettings.authRoutes.unauthorized);

                case 35:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        return function (_x13, _x14, _x15) {
          return _ref5.apply(this, arguments);
        };
      }();
    };

    ConfigurationUtils.validateAppSettings(appSettings);
    this.appSettings = appSettings;
    this.msalConfig = ConfigurationUtils.getMsalConfiguration(appSettings, cache);
    this.msalClient = new msalNode.ConfidentialClientApplication(this.msalConfig);
    this.tokenValidator = new TokenValidator(this.appSettings, this.msalConfig);
    this.cryptoProvider = new msalNode.CryptoProvider();
  } // ============== UTILS ===============

  /**
   * This method is used to generate an auth code request
   * @param {Request} req: express request object
   * @param {Response} res: express response object
   * @param {AuthCodeParams} params: modifies auth code request url
   * @returns {Promise}
   */


  var _proto = AuthProvider.prototype;

  _proto.getAuthCode =
  /*#__PURE__*/
  function () {
    var _getAuthCode = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(req, res, params) {
      var response;
      return runtime_1.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              // prepare the request
              req.session.authCodeRequest.authority = params.authority;
              req.session.authCodeRequest.scopes = params.scopes;
              req.session.authCodeRequest.state = params.state;
              req.session.authCodeRequest.redirectUri = params.redirect;
              req.session.authCodeRequest.prompt = params.prompt;
              req.session.authCodeRequest.account = params.account;
              req.session.tokenRequest.authority = params.authority;
              req.session.tokenRequest.scopes = params.scopes;
              req.session.tokenRequest.redirectUri = params.redirect; // request an authorization code to exchange for tokens

              _context6.prev = 9;
              _context6.next = 12;
              return this.msalClient.getAuthCodeUrl(req.session.authCodeRequest);

            case 12:
              response = _context6.sent;
              res.redirect(response);
              _context6.next = 20;
              break;

            case 16:
              _context6.prev = 16;
              _context6.t0 = _context6["catch"](9);
              console.log(ErrorMessages.AUTH_CODE_NOT_OBTAINED);
              console.log(_context6.t0);

            case 20:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this, [[9, 16]]);
    }));

    function getAuthCode(_x16, _x17, _x18) {
      return _getAuthCode.apply(this, arguments);
    }

    return getAuthCode;
  }();

  /**
   *
   * @param {Request} req: express request object
   * @param {Response} res: express response object
   * @returns
   */
  _proto.handleOverage =
  /*#__PURE__*/
  function () {
    var _handleOverage = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7(req, res, next, rule) {
      var _req$session$account$, newIdTokenClaims, silentRequest, tokenResponse, graphResponse, userGroups;

      return runtime_1.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _req$session$account$ = req.session.account.idTokenClaims, newIdTokenClaims = _objectWithoutPropertiesLoose(_req$session$account$, ["_claim_names", "_claim_sources"]);
              silentRequest = {
                account: req.session.account,
                scopes: ["User.Read", "GroupMember.Read.All"]
              };
              _context7.prev = 2;
              _context7.next = 5;
              return this.msalClient.acquireTokenSilent(silentRequest);

            case 5:
              tokenResponse = _context7.sent;
              _context7.prev = 6;
              _context7.next = 9;
              return FetchManager.callApiEndpoint("https://graph.microsoft.com/v1.0/me/memberOf", tokenResponse.accessToken);

            case 9:
              graphResponse = _context7.sent;

              if (!graphResponse["@odata.nextLink"]) {
                _context7.next = 25;
                break;
              }

              _context7.prev = 11;
              _context7.next = 14;
              return FetchManager.handlePagination(tokenResponse.accessToken, graphResponse["@odata.nextLink"]);

            case 14:
              userGroups = _context7.sent;
              req.session.account.idTokenClaims = _extends({}, newIdTokenClaims, {
                groups: userGroups
              });

              if (this.applyAccessRule(req.method, rule, req.session.account.idTokenClaims["groups"], true)) {
                _context7.next = 18;
                break;
              }

              return _context7.abrupt("return", res.redirect(this.appSettings.authRoutes.unauthorized));

            case 18:
              _context7.next = 23;
              break;

            case 20:
              _context7.prev = 20;
              _context7.t0 = _context7["catch"](11);
              console.log(_context7.t0);

            case 23:
              _context7.next = 28;
              break;

            case 25:
              req.session.account.idTokenClaims = _extends({}, newIdTokenClaims, {
                groups: graphResponse["value"].map(function (v) {
                  return v.id;
                })
              });

              if (this.applyAccessRule(req.method, rule, req.session.account.idTokenClaims["groups"], true)) {
                _context7.next = 28;
                break;
              }

              return _context7.abrupt("return", res.redirect(this.appSettings.authRoutes.unauthorized));

            case 28:
              _context7.next = 33;
              break;

            case 30:
              _context7.prev = 30;
              _context7.t1 = _context7["catch"](6);
              console.log(_context7.t1);

            case 33:
              _context7.next = 38;
              break;

            case 35:
              _context7.prev = 35;
              _context7.t2 = _context7["catch"](2);
              console.log(_context7.t2);

            case 38:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this, [[2, 35], [6, 30], [11, 20]]);
    }));

    function handleOverage(_x19, _x20, _x21, _x22) {
      return _handleOverage.apply(this, arguments);
    }

    return handleOverage;
  }();

  _proto.applyAccessRule = function applyAccessRule(method, rule, creds, isGroups) {
    if (rule.methods.includes(method)) {
      if (isGroups) {
        var intersection = rule.groups.filter(function (elem) {
          return creds.includes(elem);
        });

        if (intersection.length < 1) {
          console.log(ErrorMessages.USER_NOT_IN_GROUP);
          return false;
        }
      } else {
        var _intersection = rule.roles.filter(function (elem) {
          return creds.includes(elem);
        });

        if (_intersection.length < 1) {
          console.log(ErrorMessages.USER_NOT_IN_ROLE);
          return false;
        }
      }
    } else {
      console.log(ErrorMessages.METHOD_NOT_ALLOWED);
      return false;
    }

    return true;
  }
  /**
   * Util method to get the resource name for a given scope(s)
   * @param {Array} scopes: /path string that the resource is associated with
   * @returns {string}
   */
  ;

  _proto.getResourceNameFromScopes = function getResourceNameFromScopes(scopes) {
    var index = Object.values(_extends({}, this.appSettings.remoteResources, this.appSettings.ownedResources)).findIndex(function (resource) {
      return JSON.stringify(resource.scopes) === JSON.stringify(scopes);
    });
    var resourceName = Object.keys(_extends({}, this.appSettings.remoteResources, this.appSettings.ownedResources))[index];
    return resourceName;
  };

  return AuthProvider;
}();

exports.AuthProvider = AuthProvider;
exports.ConfigurationUtils = ConfigurationUtils;
exports.TokenValidator = TokenValidator;
//# sourceMappingURL=msal-express-wrapper.cjs.development.js.map
