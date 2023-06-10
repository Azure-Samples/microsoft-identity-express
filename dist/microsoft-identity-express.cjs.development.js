'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var msalNode = require('@azure/msal-node');
var msalCommon = require('@azure/msal-common');
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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
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
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

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
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
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
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
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
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

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
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */

var AppStages;

(function (AppStages) {
  AppStages["SIGN_IN"] = "sign_in";
  AppStages["SIGN_OUT"] = "sign_out";
  AppStages["ACQUIRE_TOKEN"] = "acquire_token";
})(AppStages || (AppStages = {}));
/**
 * String constants related to AAD Authority
 */


var AADAuthorityConstants = {
  COMMON: "common",
  ORGANIZATIONS: "organizations",
  CONSUMERS: "consumers"
};
var OIDC_SCOPES = /*#__PURE__*/[].concat(msalCommon.OIDC_DEFAULT_SCOPES, ["email"]);
/**
 * Constants used in access control scenarios
 */

var AccessControlConstants = {
  GROUPS: "groups",
  ROLES: "roles",
  CLAIM_NAMES: "_claim_name",
  CLAIM_SOURCES: "_claim_sources",
  PAGINATION_LINK: "@odata.nextLink",
  GRAPH_MEMBERS_ENDPOINT: "https://graph.microsoft.com/v1.0/me/memberOf",
  GRAPH_MEMBER_SCOPES: "User.Read GroupMember.Read.All"
};
/**
 * Various error constants
 */

var ErrorMessages = {
  NOT_PERMITTED: "Not permitted",
  INVALID_TOKEN: "Invalid token",
  CANNOT_DETERMINE_APP_STAGE: "Cannot determine application stage",
  CANNOT_VALIDATE_TOKEN: "Cannot validate token",
  CSRF_TOKEN_MISMATCH: "CSRF token in response does not match to original request",
  INTERACTION_REQUIRED: "interaction_required",
  TOKEN_ACQUISITION_FAILED: "Token acquisition failed",
  TOKEN_RESPONSE_NULL: "Token response is null",
  AUTH_CODE_URL_NOT_OBTAINED: "Authorization code url cannot be obtained",
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
  SESSION_NOT_FOUND: "No session found for this request",
  KEY_VAULT_CONFIG_NOT_FOUND: "No coordinates found for Key Vault",
  CANNOT_OBTAIN_CREDENTIALS_FROM_KEY_VAULT: "Cannot obtain credentials from Key Vault",
  SESSION_KEY_NOT_FOUND: "No session key found in session. Cannot encrypt state data",
  AUTH_CODE_REQUEST_OBJECT_NOT_FOUND: "No auth code request object found in session",
  ID_TOKEN_CLAIMS_NOT_FOUND: "No id token claims found in session",
  AUTH_CODE_RESPONSE_NOT_FOUND: "No authorization code found in the response from service"
};
/**
 * Various configuration error constants
 */

var ConfigurationErrorMessages = {
  AUTH_ROUTES_NOT_CONFIGURED: "Authentication routes are not defined. Ensure that the application settings are configured properly.",
  NO_PROTECTED_RESOURCE_CONFIGURED: "No protected resource is configured to acquire a token for. Ensure that the application settings are configured properly.",
  NO_ACCESS_MATRIX_CONFIGURED: "No access matrix is configured to control access for. Ensure that the application settings are configured properly.",
  NO_CLIENT_ID: "No clientId provided!",
  INVALID_CLIENT_ID: "Invalid clientId!",
  NO_TENANT_INFO: "No tenant info provided!",
  INVALID_TENANT_INFO: "Invalid tenant info!",
  NO_CLIENT_CREDENTIAL: "No client credential provided!",
  NO_REDIRECT_URI: "No redirect URI provided!",
  NO_UNAUTHORIZED_ROUTE: "No unauthorized route provided!"
};
/**
 * Default logger options
 */

var DEFAULT_LOGGER_OPTIONS = {
  loggerCallback: function loggerCallback(logLevel, message, containsPii) {
    if (containsPii) {
      return;
    } // eslint-disable-next-line no-console


    console.info(message);
  },
  piiLoggingEnabled: false,
  logLevel: msalCommon.LogLevel.Info
};
var HttpMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS"
};
var EMPTY_STRING = "";

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var packageName = "microsoft-identity-express";
var packageVersion = "beta";

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var BaseAuthProvider = /*#__PURE__*/function () {
  function BaseAuthProvider(appSettings, msalConfig) {
    var _this$msalConfig$syst;

    this.appSettings = appSettings;
    this.msalConfig = msalConfig;
    this.cryptoProvider = new msalNode.CryptoProvider();
    this.logger = new msalCommon.Logger(((_this$msalConfig$syst = this.msalConfig.system) == null ? void 0 : _this$msalConfig$syst.loggerOptions) || DEFAULT_LOGGER_OPTIONS, packageName, packageVersion);
  }

  var _proto = BaseAuthProvider.prototype;

  _proto.getAppSettings = function getAppSettings() {
    return this.appSettings;
  };

  _proto.getMsalConfig = function getMsalConfig() {
    return this.msalConfig;
  };

  _proto.getCryptoProvider = function getCryptoProvider() {
    return this.cryptoProvider;
  };

  _proto.getLogger = function getLogger() {
    return this.logger;
  };

  _proto.getMsalClient = function getMsalClient() {
    return new msalNode.ConfidentialClientApplication(this.msalConfig);
  };

  return BaseAuthProvider;
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var AppType;

(function (AppType) {
  AppType[AppType["WebApp"] = 0] = "WebApp";
})(AppType || (AppType = {}));

var AppSettingsHelper = /*#__PURE__*/function () {
  function AppSettingsHelper() {}

  /**
   * Maps the custom configuration object to configuration
   * object expected by MSAL Node ConfidentialClientApplication class
   * @param {AppSettings} appSettings: configuration object
   * @returns {Configuration}
   */
  AppSettingsHelper.getMsalConfiguration = function getMsalConfiguration(appSettings) {
    var _appSettings$systemOp, _appSettings$systemOp2;

    return {
      auth: _extends({
        clientId: appSettings.authOptions.clientId,
        authority: appSettings.authOptions.instance ? "https://" + appSettings.authOptions.instance + "/" + appSettings.authOptions.tenantId : "https://" + msalCommon.Constants.DEFAULT_AUTHORITY_HOST + "/" + appSettings.authOptions.tenantId
      }, appSettings.authOptions.hasOwnProperty("clientSecret") && {
        clientSecret: appSettings.authOptions.clientSecret
      }, appSettings.authOptions.hasOwnProperty("clientCertificate") && {
        clientCertificate: appSettings.authOptions.clientCertificate
      }, appSettings.authOptions.hasOwnProperty("authorityMetadata") && {
        authorityMetadata: appSettings.authOptions.authorityMetadata
      }, appSettings.authOptions.hasOwnProperty("cloudDiscoveryMetadata") && {
        cloudDiscoveryMetadata: appSettings.authOptions.cloudDiscoveryMetadata
      }),
      system: {
        loggerOptions: (_appSettings$systemOp = appSettings.systemOptions) != null && _appSettings$systemOp.loggerOptions ? appSettings.systemOptions.loggerOptions : DEFAULT_LOGGER_OPTIONS,
        proxyUrl: (_appSettings$systemOp2 = appSettings.systemOptions) == null ? void 0 : _appSettings$systemOp2.proxyUrl
      }
    };
  }
  /**
   * Validates the fields in the config object
   * @param {AppSettings} appSettings: configuration object
   * @param {AppType} appType: type of application
   */
  ;

  AppSettingsHelper.validateAppSettings = function validateAppSettings(appSettings, appType) {
    if (msalCommon.StringUtils.isEmpty(appSettings.authOptions.clientId)) {
      throw new Error(ConfigurationErrorMessages.NO_CLIENT_ID);
    } else if (!AppSettingsHelper.isGuid(appSettings.authOptions.clientId)) {
      throw new Error(ConfigurationErrorMessages.INVALID_CLIENT_ID);
    }

    if (msalCommon.StringUtils.isEmpty(appSettings.authOptions.tenantId)) {
      throw new Error(ConfigurationErrorMessages.NO_TENANT_INFO);
    } else if (!AppSettingsHelper.isGuid(appSettings.authOptions.tenantId) && !Object.values(AADAuthorityConstants).includes(appSettings.authOptions.tenantId)) {
      throw new Error(ConfigurationErrorMessages.INVALID_TENANT_INFO);
    }

    switch (appType) {
      case AppType.WebApp:
        if (msalCommon.StringUtils.isEmpty(appSettings.authRoutes.redirectUri)) {
          throw new Error(ConfigurationErrorMessages.NO_REDIRECT_URI);
        }

        break;
    }
  }
  /**
   * Util method to get the resource name for a given scope(s)
   * @param {Array} scopes: an array of scopes from the token response
   * @param {ProtectedResourcesMap} protectedResources: application authentication parameters
   * @returns {string}
   */
  ;

  AppSettingsHelper.getResourceNameFromScopes = function getResourceNameFromScopes(scopes, protectedResources) {
    var effectiveScopes = this.getEffectiveScopes(scopes).map(function (scope) {
      return scope.toLowerCase();
    });
    var index = Object.values(protectedResources).findIndex(function (resourceParams) {
      return effectiveScopes.every(function (scope) {
        return resourceParams.scopes.includes(scope.toLowerCase());
      });
    });
    var resourceName = Object.keys(protectedResources)[index];
    return resourceName;
  }
  /**
   * Util method to strip the default OIDC scopes from a given scopes list
   * @param {Array} scopesList: full list of scopes for this resource
   * @returns {Array}
   */
  ;

  AppSettingsHelper.getEffectiveScopes = function getEffectiveScopes(scopesList) {
    var effectiveScopesList = scopesList.filter(function (scope) {
      return !OIDC_SCOPES.includes(scope);
    });
    return effectiveScopesList;
  }
  /**
   * Verifies if a given string is GUID
   * @param {string} guid: string to be verified as GUID
   * @returns {boolean}
   */
  ;

  AppSettingsHelper.isGuid = function isGuid(guid) {
    var regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regexGuid.test(guid);
  };

  return AppSettingsHelper;
}();

var FetchManager = /*#__PURE__*/function () {
  function FetchManager() {}

  FetchManager.fetchCloudDiscoveryMetadata = /*#__PURE__*/function () {
    var _fetchCloudDiscoveryMetadata = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(tenantId) {
      var endpoint, response, cloudDiscoveryMetadata;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              endpoint = "https://login.microsoftonline.com/common/discovery/instance";
              _context.prev = 1;
              _context.next = 4;
              return FetchManager.callApiEndpoint(endpoint, {
                params: {
                  "api-version": "1.1",
                  "authorization_endpoint": "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/authorize"
                }
              });

            case 4:
              response = _context.sent;
              cloudDiscoveryMetadata = JSON.stringify(response.data);
              return _context.abrupt("return", cloudDiscoveryMetadata);

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](1);
              throw _context.t0;

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 9]]);
    }));

    function fetchCloudDiscoveryMetadata(_x) {
      return _fetchCloudDiscoveryMetadata.apply(this, arguments);
    }

    return fetchCloudDiscoveryMetadata;
  }();

  FetchManager.fetchAuthorityMetadata = /*#__PURE__*/function () {
    var _fetchAuthorityMetadata = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(tenantId) {
      var endpoint, response, authorityMetadata;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              endpoint = "https://login.microsoftonline.com/" + tenantId + "/v2.0/.well-known/openid-configuration";
              _context2.prev = 1;
              _context2.next = 4;
              return FetchManager.callApiEndpoint(endpoint);

            case 4:
              response = _context2.sent;
              authorityMetadata = JSON.stringify(response.data);
              return _context2.abrupt("return", authorityMetadata);

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](1);
              throw _context2.t0;

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 9]]);
    }));

    function fetchAuthorityMetadata(_x2) {
      return _fetchAuthorityMetadata.apply(this, arguments);
    }

    return fetchAuthorityMetadata;
  }();

  return FetchManager;
}();
/**
 * Calls a resource endpoint
 * @param {string} endpoint: URL of the endpoint to be called
 * @returns {Promise<any>}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types

FetchManager.callApiEndpoint = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(endpoint, options) {
    var response;
    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return axios.get(endpoint, options);

          case 3:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            throw _context3.t0;

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Calls a resource endpoint with a raw access token
 * using the authorization bearer token scheme
 * @param {string} endpoint: URL of the endpoint to be called
 * @param {string} accessToken: Raw access token
 * @returns {Promise<any>}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types


FetchManager.callApiEndpointWithToken = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(endpoint, accessToken) {
    var options, response;
    return runtime_1.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!msalCommon.StringUtils.isEmpty(accessToken)) {
              _context4.next = 2;
              break;
            }

            throw new Error(ErrorMessages.TOKEN_NOT_FOUND);

          case 2:
            options = {
              headers: {
                Authorization: "Bearer " + accessToken
              }
            };
            _context4.prev = 3;
            _context4.next = 6;
            return FetchManager.callApiEndpoint(endpoint, options);

          case 6:
            response = _context4.sent;
            return _context4.abrupt("return", response.data);

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](3);
            throw _context4.t0;

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 10]]);
  }));

  return function (_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Handles queries against Microsoft Graph that return multiple pages of data
 * @param {string} accessToken: access token required by endpoint
 * @param {string} nextPage: next page link
 * @param {Array} data: stores data from each page
 * @returns {Promise<string[]>}
 */


FetchManager.handlePagination = /*#__PURE__*/function () {
  var _ref3 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(accessToken, nextPage, data) {
    var graphResponse;
    return runtime_1.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (data === void 0) {
              data = [];
            }

            _context5.prev = 1;
            _context5.next = 4;
            return FetchManager.callApiEndpointWithToken(nextPage, accessToken);

          case 4:
            _context5.next = 6;
            return _context5.sent.data;

          case 6:
            graphResponse = _context5.sent;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
            graphResponse["value"].map(function (v) {
              return data.push(v.id);
            });

            if (!graphResponse[AccessControlConstants.PAGINATION_LINK]) {
              _context5.next = 14;
              break;
            }

            _context5.next = 11;
            return FetchManager.handlePagination(accessToken, graphResponse[AccessControlConstants.PAGINATION_LINK], data);

          case 11:
            return _context5.abrupt("return", _context5.sent);

          case 14:
            return _context5.abrupt("return", data);

          case 15:
            _context5.next = 20;
            break;

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](1);
            throw _context5.t0;

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 17]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var UrlUtils = function UrlUtils() {};
/**
 * Returns the absolute URL from a given request and path string
 * @param {string} url: a given URL
 * @param {string} protocol: protocol of the request
 * @param {string} host: host of the request
 * @returns {string}
 */

UrlUtils.ensureAbsoluteUrl = function (url, protocol, host) {
  var urlComponents = new msalCommon.UrlString(url).getUrlComponents();

  if (!urlComponents.Protocol) {
    if (!urlComponents.HostNameAndPort && !url.startsWith("www")) {
      if (!url.startsWith("/")) {
        return protocol + "://" + host + "/" + url;
      }

      return protocol + "://" + host + url;
    }

    return protocol + "://" + url;
  } else {
    return url;
  }
};
/**
 *
 * @param req
 * @param url
 * @returns
 */


UrlUtils.ensureAbsoluteUrlFromRequest = function (req, url) {
  if (url) {
    return UrlUtils.ensureAbsoluteUrl(url, req.protocol, req.get("host") || req.hostname);
  } else {
    return UrlUtils.ensureAbsoluteUrl(req.originalUrl, req.protocol, req.get("host") || req.hostname);
  }
};
/**
 *
 * @param req
 * @param url
 * @returns
 */


UrlUtils.checkIfRequestsMatch = function (req, url) {
  return UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, url);
};
/**
 * Returns the path segment from a given URL
 * @param {string} url: a given URL
 * @returns {string}
 */


UrlUtils.getPathFromUrl = function (url) {
  var urlComponents = new msalCommon.UrlString(url).getUrlComponents();
  return "/" + urlComponents.PathSegments.join("/");
};
/**
 * Ensures that the URL contains a trailing slash at the end
 * @param {string} path: a given path
 * @returns {string}
 */


UrlUtils.enforceLeadingSlash = function (path) {
  return path.split("")[0] === "/" ? path : "/" + path;
};

function loginHandler(options) {
  var _this = this;

  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(req, res, next) {
      var state, authUrlParams, response;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.getLogger().trace("loginHandler called");

              state = {
                redirectTo: options.postLoginRedirectUri || "/",
                customState: options.state
              };
              authUrlParams = {
                state: _this.getCryptoProvider().base64Encode(JSON.stringify(state)),
                redirectUri: UrlUtils.ensureAbsoluteUrl(_this.webAppSettings.authRoutes.redirectUri, req.protocol, req.get("host") || req.hostname),
                responseMode: msalCommon.ResponseMode.FORM_POST,
                scopes: options.scopes || [],
                prompt: options.prompt || undefined,
                claims: options.claims || undefined,
                account: options.account || undefined,
                sid: options.sid || undefined,
                loginHint: options.loginHint || undefined,
                domainHint: options.domainHint || undefined,
                extraQueryParameters: options.extraQueryParameters || undefined,
                extraScopesToConsent: options.extraScopesToConsent || undefined
              };
              req.session.tokenRequestParams = {
                scopes: authUrlParams.scopes,
                state: authUrlParams.state,
                redirectUri: authUrlParams.redirectUri,
                claims: authUrlParams.claims,
                tokenBodyParameters: options.tokenBodyParameters,
                tokenQueryParameters: options.tokenQueryParameters,
                code: EMPTY_STRING
              };
              _context.prev = 4;
              _context.next = 7;
              return _this.getMsalClient().getAuthCodeUrl(authUrlParams);

            case 7:
              response = _context.sent;
              res.redirect(response);
              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](4);
              next(_context.t0);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 11]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
}

function logoutHandler(options) {
  var _this = this;

  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(req, res) {
      var logoutUri, tokenCache, account, postLogoutRedirectUri;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.getLogger().trace("logoutHandler called");

              logoutUri = options.postLogoutRedirectUri || "/";
              _context.prev = 2;
              tokenCache = _this.getMsalClient().getTokenCache();
              _context.next = 6;
              return tokenCache.getAccountByHomeId(req.authContext.getAccount().homeAccountId);

            case 6:
              account = _context.sent;

              if (!account) {
                _context.next = 10;
                break;
              }

              _context.next = 10;
              return tokenCache.removeAccount(account);

            case 10:
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](2);

              _this.logger.error("Error occurred while clearing cache for user: " + JSON.stringify(_context.t0));

            case 15:
              // TODO: should be default
              if (options.idpLogout) {
                /**
                 * Construct a logout URI and redirect the user to end the
                 * session with Azure AD. For more information, visit:
                 * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
                 */
                postLogoutRedirectUri = UrlUtils.ensureAbsoluteUrl(options.postLogoutRedirectUri || "/", req.protocol, req.get("host") || req.hostname); // TODO: need to make use of endSessionRequest options
                // FIXME: need the canonical uri (ending with slash) && esnure absolute url

                logoutUri = _this.getMsalConfig().auth.authority + "/oauth2/v2.0/logout?post_logout_redirect_uri=" + postLogoutRedirectUri;
              }

              req.session.destroy(function () {
                // TODO: remove/expire cookie?
                res.redirect(logoutUri);
              });

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 12]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
}

/**
 * Token Validation library error class thrown for configuration errors
 */

var InteractionRequiredError = /*#__PURE__*/function (_InteractionRequiredA) {
  _inheritsLoose(InteractionRequiredError, _InteractionRequiredA);

  function InteractionRequiredError(errorCode, errorMessage, subError, originalRequest) {
    var _this;

    _this = _InteractionRequiredA.call(this, errorCode, errorMessage, subError) || this;
    _this.name = "InteractionRequiredError";
    _this.requestOptions = {
      scopes: (originalRequest == null ? void 0 : originalRequest.scopes) || [],
      claims: originalRequest == null ? void 0 : originalRequest.claims,
      state: originalRequest == null ? void 0 : originalRequest.state,
      sid: originalRequest == null ? void 0 : originalRequest.sid,
      loginHint: originalRequest == null ? void 0 : originalRequest.loginHint,
      domainHint: originalRequest == null ? void 0 : originalRequest.domainHint,
      extraQueryParameters: originalRequest == null ? void 0 : originalRequest.extraQueryParameters,
      extraScopesToConsent: originalRequest == null ? void 0 : originalRequest.extraScopesToConsent,
      tokenBodyParameters: originalRequest == null ? void 0 : originalRequest.tokenBodyParameters,
      tokenQueryParameters: originalRequest == null ? void 0 : originalRequest.tokenQueryParameters
    };
    Object.setPrototypeOf(_assertThisInitialized(_this), InteractionRequiredError.prototype);
    return _this;
  }

  return InteractionRequiredError;
}(msalNode.InteractionRequiredAuthError);

function acquireTokenHandler(options, useAsMiddlewareOptions) {
  var _this = this;

  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(req, res, next) {
      var account, silentRequest, msalInstance, tokenResponse, _req$session$protecte;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.getLogger().trace("acquireTokenHandler called");

              _context.prev = 1;
              account = options.account || req.session.account;

              if (account) {
                _context.next = 5;
                break;
              }

              throw new InteractionRequiredError("no_account_found", "No account found either in options or in session", undefined, options);

            case 5:
              silentRequest = {
                account: account,
                scopes: options.scopes,
                claims: options.claims,
                tokenQueryParameters: options.tokenQueryParameters
              };
              msalInstance = _this.getMsalClient();
              msalInstance.getTokenCache().deserialize(req.session.tokenCache);
              _context.next = 10;
              return msalInstance.acquireTokenSilent(silentRequest);

            case 10:
              tokenResponse = _context.sent;
              req.session.tokenCache = msalInstance.getTokenCache().serialize();

              if (tokenResponse) {
                _context.next = 14;
                break;
              }

              throw new InteractionRequiredError("null_response", "AcquireTokenSilent return null response", undefined, options);

            case 14:
              if (!useAsMiddlewareOptions) {
                _context.next = 17;
                break;
              }

              if (!req.session.protectedResources) {
                req.session.protectedResources = (_req$session$protecte = {}, _req$session$protecte[useAsMiddlewareOptions.resourceName] = tokenResponse, _req$session$protecte);
              } else {
                req.session.protectedResources[useAsMiddlewareOptions.resourceName] = tokenResponse;
              }

              return _context.abrupt("return", next());

            case 17:
              return _context.abrupt("return", tokenResponse);

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](1);

              if (!(_context.t0 instanceof msalNode.InteractionRequiredAuthError)) {
                _context.next = 24;
                break;
              }

              return _context.abrupt("return", next(new InteractionRequiredError(_context.t0.errorCode, _context.t0.errorMessage, _context.t0.subError, options)));

            case 24:
              next(_context.t0);

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 20]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
}

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 *
 */

var AuthContext = /*#__PURE__*/function () {
  /**
   *
   * @param provider
   * @param context
   */
  function AuthContext(provider, context) {
    this.provider = provider;
    this.context = context;
  }
  /**
   * Initiates login flow
   * @param {LoginOptions} options: options to modify login request
   * @returns {RequestHandler}
   */


  var _proto = AuthContext.prototype;

  _proto.login = function login(options) {
    if (options === void 0) {
      options = {
        postLoginRedirectUri: "/",
        postFailureRedirectUri: "/",
        scopes: []
      };
    }

    return loginHandler.call(this.provider, options);
  }
  /**
   * Initiates logout flow and destroys the current session
   * @param {LogoutOptions} options: options to modify logout request
   * @returns {RequestHandler}
   */
  ;

  _proto.logout = function logout(options) {
    if (options === void 0) {
      options = {
        postLogoutRedirectUri: "/",
        idpLogout: true
      };
    }

    return logoutHandler.call(this.provider, options);
  }
  /**
   * Acquires an access token for given scopes
   * @param {TokenRequestOptions} options: options to modify token request
   * @returns {RequestHandler}
   */
  ;

  _proto.acquireToken = function acquireToken(options) {
    if (options === void 0) {
      options = {
        scopes: []
      };
    }

    return acquireTokenHandler.call(this.provider, options);
  }
  /**
   * Returns the account object from the session
   * @returns {AccountInfo} account object
   */
  ;

  _proto.getAccount = function getAccount() {
    return this.context.req.session.account;
  }
  /**
   * Returns true if the account object is not null
   * @returns {boolean} authentication status
   */
  ;

  _proto.isAuthenticated = function isAuthenticated() {
    return !!this.getAccount();
  }
  /**
   * Returns the cached token for a given resource
   * @param {string} resourceName: name of resource to retrieve token for
   * @returns {string | null} cached access token
   */
  ;

  _proto.getCachedTokenForResource = function getCachedTokenForResource(resourceName) {
    if (this.context.req.session.protectedResources && this.context.req.session.protectedResources[resourceName]) {
      var expiresOn = new Date(this.context.req.session.protectedResources[resourceName].expiresOn);

      if (!expiresOn) {
        return null; // would this ever happen?
      }

      var isTokenExpired = msalCommon.TimeUtils.isTokenExpired(Math.floor(expiresOn.getTime() / 1000).toString(), 300 // offset in seconds TODO: should get from config
      );

      if (!isTokenExpired) {
        return this.context.req.session.protectedResources[resourceName].accessToken;
      }
    }

    return null;
  };

  return AuthContext;
}();

function redirectHandler() {
  var _this = this;

  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(req, res, next) {
      var tokenRequest, msalInstance, tokenResponse, _ref2, redirectTo;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.getLogger().trace("redirectHandler called");

              if (!(!req.body || !req.body.code)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", next(new Error(ErrorMessages.AUTH_CODE_RESPONSE_NOT_FOUND)));

            case 3:
              tokenRequest = _extends({}, req.session.tokenRequestParams, {
                code: req.body.code
              });
              _context.prev = 4;
              msalInstance = _this.getMsalClient();

              if (req.session.tokenCache) {
                msalInstance.getTokenCache().deserialize(req.session.tokenCache);
              }

              _context.next = 9;
              return msalInstance.acquireTokenByCode(tokenRequest, req.body);

            case 9:
              tokenResponse = _context.sent;
              req.session.tokenCache = msalInstance.getTokenCache().serialize(); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

              req.session.account = tokenResponse.account; // account will never be null in this grant type

              req.session.isAuthenticated = true;
              _ref2 = req.body.state ? msalCommon.StringUtils.jsonParseHelper(_this.getCryptoProvider().base64Decode(req.body.state)) : {
                redirectTo: "/"
              }, redirectTo = _ref2.redirectTo;
              res.redirect(redirectTo);
              _context.next = 20;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](4);
              next(_context.t0);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 17]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
}

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

function authenticateMiddleware(options) {
  var _this = this;

  return function (req, res, next) {
    _this.getLogger().trace("authenticateMiddleware called");

    if (!req.session) {
      throw new Error(ErrorMessages.SESSION_NOT_FOUND);
    }

    if (!req.authContext) {
      req.authContext = new AuthContext(_this, {
        req: req,
        res: res,
        next: next
      });
    }

    if (req.method === HttpMethods.POST) {
      if (UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, _this.webAppSettings.authRoutes.redirectUri)) {
        _this.getLogger().verbose("Handling redirect response");

        return redirectHandler.call(_this)(req, res, next);
      }
    }

    if (_this.webAppSettings.authRoutes.frontChannelLogoutUri) {
      if (req.method === HttpMethods.GET) {
        if (UrlUtils.ensureAbsoluteUrlFromRequest(req) === UrlUtils.ensureAbsoluteUrlFromRequest(req, _this.webAppSettings.authRoutes.frontChannelLogoutUri)) {
          _this.getLogger().trace("frontChannelLogoutUri called");

          if (req.authContext.isAuthenticated()) {
            return req.authContext.logout({
              postLogoutRedirectUri: "/",
              idpLogout: false
            })(req, res, next);
          }

          return res.status(401).send("Unauthorized");
        }
      }
    }

    if (options.protectAllRoutes) {
      if (!req.authContext.isAuthenticated()) {
        return req.authContext.login({
          postLoginRedirectUri: req.originalUrl,
          scopes: []
        })(req, res, next);
      }
    }

    if (options.acquireTokenForResources) {
      var resources = Object.entries(options.acquireTokenForResources);

      for (var _i = 0, _resources = resources; _i < _resources.length; _i++) {
        var resource = _resources[_i];
        var resourceName = resource[0],
            resourceParams = resource[1];

        if (req.authContext.getCachedTokenForResource(resourceName)) {
          _this.getLogger().verbose("Cached token found for resource endpoint");

          return next();
        }

        if (resourceParams.routes.includes(req.originalUrl)) {
          var _resourceParams$metho;

          if ((_resourceParams$metho = resourceParams.methods) != null && _resourceParams$metho.length && resourceParams.methods.includes(req.method) || req.method === HttpMethods.GET) {
            _this.getLogger().verbose("Acquiring token for resource: ", resourceName);

            return acquireTokenHandler.call(_this, {
              scopes: resourceParams.scopes
            }, {
              resourceName: resourceName
            })(req, res, next);
          }
        }
      }
    }

    next();
  };
}

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function guardMiddleware(options) {
  return function (req, res, next) {
    if (!req.authContext.isAuthenticated()) {
      if (options.forceLogin) {
        return req.authContext.login({
          postLoginRedirectUri: req.originalUrl,
          scopes: []
        })(req, res, next);
      }

      return res.status(401).send("Unauthorized");
    }

    if (options.idTokenClaims) {
      var _req$authContext$getA;

      var tokenClaims = ((_req$authContext$getA = req.authContext.getAccount()) == null ? void 0 : _req$authContext$getA.idTokenClaims) || {};
      var requiredClaims = options.idTokenClaims;
      var hasClaims = Object.keys(requiredClaims).every(function (claim) {
        if (requiredClaims[claim] && tokenClaims[claim]) {
          switch (typeof requiredClaims[claim]) {
            case "string" :
              return requiredClaims[claim] === tokenClaims[claim];

            case "object":
              if (Array.isArray(requiredClaims[claim])) {
                var requiredClaimsArray = requiredClaims[claim];
                var tokenClaimsArray = tokenClaims[claim];
                return requiredClaimsArray.some(function (requiredClaim) {
                  return tokenClaimsArray.indexOf(requiredClaim) >= 0;
                });
              }

              break;
          }
        }

        return false;
      });

      if (!hasClaims) {
        return res.status(403).send("Forbidden");
      }
    }

    next();
  };
}

function errorMiddleware() {
  return function (err, req, res, next) {
    if (err instanceof InteractionRequiredError) {
      return req.authContext.login(_extends({
        postLoginRedirectUri: err.requestOptions.postLoginRedirectUri || req.originalUrl
      }, err.requestOptions))(req, res, next);
    }

    next(err);
  };
}

var WebAppAuthProvider = /*#__PURE__*/function (_BaseAuthProvider) {
  _inheritsLoose(WebAppAuthProvider, _BaseAuthProvider);

  function WebAppAuthProvider(appSettings, msalConfig) {
    var _this;

    _this = _BaseAuthProvider.call(this, appSettings, msalConfig) || this;
    _this.webAppSettings = appSettings;
    return _this;
  }
  /**
   * Static method to async initialize WebAppAuthProvider
   * @param {AuthenticateMiddlewareOptions} appSettings: configuration object
   * @returns {Promise<WebAppAuthProvider>}
   */


  WebAppAuthProvider.initialize =
  /*#__PURE__*/
  function () {
    var _initialize = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(appSettings) {
      var msalConfig, _yield$Promise$all, discoveryMetadata, authorityMetadata;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              AppSettingsHelper.validateAppSettings(appSettings, AppType.WebApp);
              msalConfig = AppSettingsHelper.getMsalConfiguration(appSettings); // FIXME: what about dyanmic tenant?

              if (!(!msalConfig.auth.cloudDiscoveryMetadata && !msalConfig.auth.authorityMetadata)) {
                _context.next = 10;
                break;
              }

              _context.next = 5;
              return Promise.all([FetchManager.fetchCloudDiscoveryMetadata(appSettings.authOptions.tenantId), FetchManager.fetchAuthorityMetadata(appSettings.authOptions.tenantId)]);

            case 5:
              _yield$Promise$all = _context.sent;
              discoveryMetadata = _yield$Promise$all[0];
              authorityMetadata = _yield$Promise$all[1];
              msalConfig.auth.cloudDiscoveryMetadata = discoveryMetadata;
              msalConfig.auth.authorityMetadata = authorityMetadata;

            case 10:
              return _context.abrupt("return", new WebAppAuthProvider(appSettings, msalConfig));

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function initialize(_x) {
      return _initialize.apply(this, arguments);
    }

    return initialize;
  }()
  /**
   * Sets request context, default routes and handlers
   * @param {AuthenticateMiddlewareOptions} options: options to modify middleware behavior
   * @returns {RequestHandler}
   */
  ;

  var _proto = WebAppAuthProvider.prototype;

  _proto.authenticate = function authenticate(options) {
    if (options === void 0) {
      options = {
        protectAllRoutes: false
      };
    }

    return authenticateMiddleware.call(this, options);
  }
  /**
   * Guards a specified route with given options
   * @param {RouteGuardOptions} options: options to modify middleware behavior
   * @returns {RequestHandler}
   */
  ;

  _proto.guard = function guard(options) {
    if (options === void 0) {
      options = {
        forceLogin: true
      };
    }

    return guardMiddleware.call(this, options);
  }
  /**
   * Middleware to handle interaction required errors
   * @returns {ErrorRequestHandler}
   */
  ;

  _proto.interactionErrorHandler = function interactionErrorHandler() {
    return errorMiddleware.call(this);
  };

  return WebAppAuthProvider;
}(BaseAuthProvider);

Object.defineProperty(exports, 'AuthError', {
  enumerable: true,
  get: function () {
    return msalNode.AuthError;
  }
});
Object.defineProperty(exports, 'InteractionRequiredAuthError', {
  enumerable: true,
  get: function () {
    return msalNode.InteractionRequiredAuthError;
  }
});
Object.defineProperty(exports, 'Logger', {
  enumerable: true,
  get: function () {
    return msalNode.Logger;
  }
});
exports.WebAppAuthProvider = WebAppAuthProvider;
exports.packageVersion = packageVersion;
//# sourceMappingURL=microsoft-identity-express.cjs.development.js.map
