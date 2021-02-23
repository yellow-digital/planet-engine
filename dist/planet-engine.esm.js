import { Mesh, Vector3, Box3, Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, ShaderMaterial, Color, SphereGeometry, TextureLoader, MeshPhongMaterial, DoubleSide, MeshBasicMaterial, Object3D, BackSide, PMREMGenerator, PlaneBufferGeometry, RepeatWrapping, PlaneGeometry, MeshStandardMaterial } from 'https://unpkg.com/three@0.125.0/build/three.module.js';
import * as THREE from 'https://unpkg.com/three@0.125.0/build/three.module.js';
export { THREE };
import { OrbitControls } from 'https://unpkg.com/three@0.125.0/examples/jsm/controls/OrbitControls.js';
export { OrbitControls } from 'https://unpkg.com/three@0.125.0/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'https://unpkg.com/three@0.125.0/examples/jsm/math/ImprovedNoise.js';
export { FlyControls } from 'https://unpkg.com/three@0.125.0/examples/jsm/controls/FlyControls.js';
import { Sky as Sky$1 } from 'https://unpkg.com/three@0.125.0/examples/jsm/objects/Sky.js';
import { Water as Water$1 } from 'https://unpkg.com/three@0.125.0/examples/jsm/objects/Water.js';

/*
SceneManager for ThreeJs

# Usage
const manager = new SceneManager({renderer, scene, camera})

manager.push({ mesh: {}, render() { } })
manager.push({ mesh: {}, render() { } })
*/

class SceneEntity {
  // constructor () { }

  render () {}
}

//  //////////////////////////////////////////////////////////////////////////////////
//  //  render the scene      //
//  //////////////////////////////////////////////////////////////////////////////////
//  updateFcts.push(function(){
//   renderer.render( scene, camera );
//  })

//  //////////////////////////////////////////////////////////////////////////////////
//  //  loop runner       //
//  //////////////////////////////////////////////////////////////////////////////////
//  var lastTimeMsec= null
//  requestAnimationFrame(function animate(nowMsec){
//   // keep looping
//   requestAnimationFrame( animate );
//   // measure time
//   lastTimeMsec = lastTimeMsec || nowMsec-1000/60
//   var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
//   lastTimeMsec = nowMsec
//   // call each update function
//   updateFcts.forEach(function(updateFn){
//    updateFn(deltaMsec/1000, nowMsec/1000)
//   })
//  })
class SceneManager {
  constructor (viewer = {}, cb = () => {}) {
    const { scene } = viewer;

    this.renderers = [];
    this.scene = scene;

    var lastTime = null;
    const render = (now) => {
      //   // measure time
      lastTime = lastTime || now - 1000 / 60;
      var delta = now - lastTime; // Math.min(200, now - lastTime)
      lastTime = now;
      // console.log(delta)

      // Stop fn
      const stop = (index) => {
        this.renderers.splice(index, 1);
      };

      // Call each renderer
      this.renderers.forEach((mixed, index) => {
        // Object with render method ?
        if (mixed.render) {
          return mixed.render(delta, {
            stop () { stop(index); },
            ...mixed
          })
        }

        // Function
        return mixed(delta, {
          stop () { stop(index); }
        })
      });

      // Emit render done
      cb();

      // Keep running
      requestAnimationFrame(render);
    };

    // Start render
    render();
  }

  // alias
  add (item = new SceneEntity()) {
    this.push(item);
  }

  removeByIndex (index = 0) {
    this.renderers.splice(index, 1);
  }

  push (item = new SceneEntity()) {
    if (item.mesh) {
      this.scene.add(item.mesh);
    }

    return this.renderers.push(item)
  }
}

const EARTH_RADIUS = 6371; // km
const EARTH_MOON_RADIOUS = 1737; // km
const EARTH_MOON_DISTANCE = 384400; // km
const SUN_RADIOUS = 69634; // km
const FAR_AWAY = EARTH_RADIUS * 10000; // Star field

const INFINITE = -1;

var constants = /*#__PURE__*/Object.freeze({
  __proto__: null,
  EARTH_RADIUS: EARTH_RADIUS,
  EARTH_MOON_RADIOUS: EARTH_MOON_RADIOUS,
  EARTH_MOON_DISTANCE: EARTH_MOON_DISTANCE,
  SUN_RADIOUS: SUN_RADIOUS,
  FAR_AWAY: FAR_AWAY,
  INFINITE: INFINITE
});

/**
 * The Ease class provides a collection of easing functions for use with tween.js.
 */
var Easing = {
  Linear: {
    None: function (amount) {
      return amount
    }
  },
  Quadratic: {
    In: function (amount) {
      return amount * amount
    },
    Out: function (amount) {
      return amount * (2 - amount)
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount
      }
      return -0.5 * (--amount * (amount - 2) - 1)
    }
  },
  Cubic: {
    In: function (amount) {
      return amount * amount * amount
    },
    Out: function (amount) {
      return --amount * amount * amount + 1
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount
      }
      return 0.5 * ((amount -= 2) * amount * amount + 2)
    }
  },
  Quartic: {
    In: function (amount) {
      return amount * amount * amount * amount
    },
    Out: function (amount) {
      return 1 - --amount * amount * amount * amount
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount * amount
      }
      return -0.5 * ((amount -= 2) * amount * amount * amount - 2)
    }
  },
  Quintic: {
    In: function (amount) {
      return amount * amount * amount * amount * amount
    },
    Out: function (amount) {
      return --amount * amount * amount * amount * amount + 1
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return 0.5 * amount * amount * amount * amount * amount
      }
      return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2)
    }
  },
  Sinusoidal: {
    In: function (amount) {
      return 1 - Math.cos((amount * Math.PI) / 2)
    },
    Out: function (amount) {
      return Math.sin((amount * Math.PI) / 2)
    },
    InOut: function (amount) {
      return 0.5 * (1 - Math.cos(Math.PI * amount))
    }
  },
  Exponential: {
    In: function (amount) {
      return amount === 0 ? 0 : Math.pow(1024, amount - 1)
    },
    Out: function (amount) {
      return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount)
    },
    InOut: function (amount) {
      if (amount === 0) {
        return 0
      }
      if (amount === 1) {
        return 1
      }
      if ((amount *= 2) < 1) {
        return 0.5 * Math.pow(1024, amount - 1)
      }
      return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2)
    }
  },
  Circular: {
    In: function (amount) {
      return 1 - Math.sqrt(1 - amount * amount)
    },
    Out: function (amount) {
      return Math.sqrt(1 - --amount * amount)
    },
    InOut: function (amount) {
      if ((amount *= 2) < 1) {
        return -0.5 * (Math.sqrt(1 - amount * amount) - 1)
      }
      return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1)
    }
  },
  Elastic: {
    In: function (amount) {
      if (amount === 0) {
        return 0
      }
      if (amount === 1) {
        return 1
      }
      return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
    },
    Out: function (amount) {
      if (amount === 0) {
        return 0
      }
      if (amount === 1) {
        return 1
      }
      return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1
    },
    InOut: function (amount) {
      if (amount === 0) {
        return 0
      }
      if (amount === 1) {
        return 1
      }
      amount *= 2;
      if (amount < 1) {
        return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
      }
      return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1
    }
  },
  Back: {
    In: function (amount) {
      var s = 1.70158;
      return amount * amount * ((s + 1) * amount - s)
    },
    Out: function (amount) {
      var s = 1.70158;
      return --amount * amount * ((s + 1) * amount + s) + 1
    },
    InOut: function (amount) {
      var s = 1.70158 * 1.525;
      if ((amount *= 2) < 1) {
        return 0.5 * (amount * amount * ((s + 1) * amount - s))
      }
      return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2)
    }
  },
  Bounce: {
    In: function (amount) {
      return 1 - Easing.Bounce.Out(1 - amount)
    },
    Out: function (amount) {
      if (amount < 1 / 2.75) {
        return 7.5625 * amount * amount
      } else if (amount < 2 / 2.75) {
        return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75
      } else if (amount < 2.5 / 2.75) {
        return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375
      } else {
        return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375
      }
    },
    InOut: function (amount) {
      if (amount < 0.5) {
        return Easing.Bounce.In(amount * 2) * 0.5
      }
      return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5
    }
  }
};

var now;
// Include a performance.now polyfill.
// In node.js, use process.hrtime.
// eslint-disable-next-line
// @ts-ignore
if (typeof self === 'undefined' && typeof process !== 'undefined' && process.hrtime) {
  now = function () {
    // eslint-disable-next-line
        // @ts-ignore
    var time = process.hrtime();
    // Convert [seconds, nanoseconds] to milliseconds.
    return time[0] * 1000 + time[1] / 1000000
  };
}
// In a browser, use self.performance.now if it is available.
else if (typeof self !== 'undefined' && self.performance !== undefined && self.performance.now !== undefined) {
  // This must be bound, because directly assigning this function
  // leads to an invocation exception in Chrome.
  now = self.performance.now.bind(self.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
  now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
  now = function () {
    return new Date().getTime()
  };
}
var now$1 = now;

/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 */
var Group = /** @class */ (function () {
  function Group () {
    this._tweens = {};
    this._tweensAddedDuringUpdate = {};
  }
  Group.prototype.getAll = function () {
    var _this = this;
    return Object.keys(this._tweens).map(function (tweenId) {
      return _this._tweens[tweenId]
    })
  };
  Group.prototype.removeAll = function () {
    this._tweens = {};
  };
  Group.prototype.add = function (tween) {
    this._tweens[tween.getId()] = tween;
    this._tweensAddedDuringUpdate[tween.getId()] = tween;
  };
  Group.prototype.remove = function (tween) {
    delete this._tweens[tween.getId()];
    delete this._tweensAddedDuringUpdate[tween.getId()];
  };
  Group.prototype.update = function (time, preserve) {
    if (time === void 0) { time = now$1(); }
    if (preserve === void 0) { preserve = false; }
    var tweenIds = Object.keys(this._tweens);
    if (tweenIds.length === 0) {
      return false
    }
    // Tweens are updated in "batches". If you add a new tween during an
    // update, then the new tween will be updated in the next batch.
    // If you remove a tween during an update, it may or may not be updated.
    // However, if the removed tween was added during the current batch,
    // then it will not be updated.
    while (tweenIds.length > 0) {
      this._tweensAddedDuringUpdate = {};
      for (var i = 0; i < tweenIds.length; i++) {
        var tween = this._tweens[tweenIds[i]];
        var autoStart = !preserve;
        if (tween && tween.update(time, autoStart) === false && !preserve) {
          delete this._tweens[tweenIds[i]];
        }
      }
      tweenIds = Object.keys(this._tweensAddedDuringUpdate);
    }
    return true
  };
  return Group
}());

/**
 *
 */
var Interpolation = {
  Linear: function (v, k) {
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);
    var fn = Interpolation.Utils.Linear;
    if (k < 0) {
      return fn(v[0], v[1], f)
    }
    if (k > 1) {
      return fn(v[m], v[m - 1], m - f)
    }
    return fn(v[i], v[i + 1 > m ? m : i + 1], f - i)
  },
  Bezier: function (v, k) {
    var b = 0;
    var n = v.length - 1;
    var pw = Math.pow;
    var bn = Interpolation.Utils.Bernstein;
    for (var i = 0; i <= n; i++) {
      b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
    }
    return b
  },
  CatmullRom: function (v, k) {
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);
    var fn = Interpolation.Utils.CatmullRom;
    if (v[0] === v[m]) {
      if (k < 0) {
        i = Math.floor((f = m * (1 + k)));
      }
      return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i)
    } else {
      if (k < 0) {
        return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0])
      }
      if (k > 1) {
        return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m])
      }
      return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i)
    }
  },
  Utils: {
    Linear: function (p0, p1, t) {
      return (p1 - p0) * t + p0
    },
    Bernstein: function (n, i) {
      var fc = Interpolation.Utils.Factorial;
      return fc(n) / fc(i) / fc(n - i)
    },
    Factorial: (function () {
      var a = [1];
      return function (n) {
        var s = 1;
        if (a[n]) {
          return a[n]
        }
        for (var i = n; i > 1; i--) {
          s *= i;
        }
        a[n] = s;
        return s
      }
    })(),
    CatmullRom: function (p0, p1, p2, p3, t) {
      var v0 = (p2 - p0) * 0.5;
      var v1 = (p3 - p1) * 0.5;
      var t2 = t * t;
      var t3 = t * t2;
      return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
    }
  }
};

/**
 * Utils
 */
var Sequence = /** @class */ (function () {
  function Sequence () {
  }
  Sequence.nextId = function () {
    return Sequence._nextId++
  };
  Sequence._nextId = 0;
  return Sequence
}());

var mainGroup = new Group();

/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */
var Tween = /** @class */ (function () {
  function Tween (_object, _group) {
    if (_group === void 0) { _group = mainGroup; }
    this._object = _object;
    this._group = _group;
    this._isPaused = false;
    this._pauseStart = 0;
    this._valuesStart = {};
    this._valuesEnd = {};
    this._valuesStartRepeat = {};
    this._duration = 1000;
    this._initialRepeat = 0;
    this._repeat = 0;
    this._yoyo = false;
    this._isPlaying = false;
    this._reversed = false;
    this._delayTime = 0;
    this._startTime = 0;
    this._easingFunction = Easing.Linear.None;
    this._interpolationFunction = Interpolation.Linear;
    this._chainedTweens = [];
    this._onStartCallbackFired = false;
    this._id = Sequence.nextId();
    this._isChainStopped = false;
    this._goToEnd = false;
  }
  Tween.prototype.getId = function () {
    return this._id
  };
  Tween.prototype.isPlaying = function () {
    return this._isPlaying
  };
  Tween.prototype.isPaused = function () {
    return this._isPaused
  };
  Tween.prototype.to = function (properties, duration) {
    // TODO? restore this, then update the 07_dynamic_to example to set fox
    // tween's to on each update. That way the behavior is opt-in (there's
    // currently no opt-out).
    // for (const prop in properties) this._valuesEnd[prop] = properties[prop]
    this._valuesEnd = Object.create(properties);
    if (duration !== undefined) {
      this._duration = duration;
    }
    return this
  };
  Tween.prototype.duration = function (d) {
    this._duration = d;
    return this
  };
  Tween.prototype.start = function (time) {
    if (this._isPlaying) {
      return this
    }
    // eslint-disable-next-line
        this._group && this._group.add(this);
    this._repeat = this._initialRepeat;
    if (this._reversed) {
      // If we were reversed (f.e. using the yoyo feature) then we need to
      // flip the tween direction back to forward.
      this._reversed = false;
      for (var property in this._valuesStartRepeat) {
        this._swapEndStartRepeatValues(property);
        this._valuesStart[property] = this._valuesStartRepeat[property];
      }
    }
    this._isPlaying = true;
    this._isPaused = false;
    this._onStartCallbackFired = false;
    this._isChainStopped = false;
    this._startTime = time !== undefined ? (typeof time === 'string' ? now$1() + parseFloat(time) : time) : now$1();
    this._startTime += this._delayTime;
    this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat);
    return this
  };
  Tween.prototype._setupProperties = function (_object, _valuesStart, _valuesEnd, _valuesStartRepeat) {
    for (var property in _valuesEnd) {
      var startValue = _object[property];
      var startValueIsArray = Array.isArray(startValue);
      var propType = startValueIsArray ? 'array' : typeof startValue;
      var isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]);
      // If `to()` specifies a property that doesn't exist in the source object,
      // we should not set that property in the object
      if (propType === 'undefined' || propType === 'function') {
        continue
      }
      // Check if an Array was provided as property value
      if (isInterpolationList) {
        var endValues = _valuesEnd[property];
        if (endValues.length === 0) {
          continue
        }
        // handle an array of relative values
        endValues = endValues.map(this._handleRelativeValue.bind(this, startValue));
        // Create a local copy of the Array with the start value at the front
        _valuesEnd[property] = [startValue].concat(endValues);
      }
      // handle the deepness of the values
      if ((propType === 'object' || startValueIsArray) && startValue && !isInterpolationList) {
        _valuesStart[property] = startValueIsArray ? [] : {};
        // eslint-disable-next-line
                for (var prop in startValue) {
          // eslint-disable-next-line
                    // @ts-ignore FIXME?
          _valuesStart[property][prop] = startValue[prop];
        }
        _valuesStartRepeat[property] = startValueIsArray ? [] : {}; // TODO? repeat nested values? And yoyo? And array values?
        // eslint-disable-next-line
                // @ts-ignore FIXME?
        this._setupProperties(startValue, _valuesStart[property], _valuesEnd[property], _valuesStartRepeat[property]);
      } else {
        // Save the starting value, but only once.
        if (typeof _valuesStart[property] === 'undefined') {
          _valuesStart[property] = startValue;
        }
        if (!startValueIsArray) {
          // eslint-disable-next-line
                    // @ts-ignore FIXME?
          _valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
        }
        if (isInterpolationList) {
          // eslint-disable-next-line
                    // @ts-ignore FIXME?
          _valuesStartRepeat[property] = _valuesEnd[property].slice().reverse();
        } else {
          _valuesStartRepeat[property] = _valuesStart[property] || 0;
        }
      }
    }
  };
  Tween.prototype.stop = function () {
    if (!this._isChainStopped) {
      this._isChainStopped = true;
      this.stopChainedTweens();
    }
    if (!this._isPlaying) {
      return this
    }
    // eslint-disable-next-line
        this._group && this._group.remove(this);
    this._isPlaying = false;
    this._isPaused = false;
    if (this._onStopCallback) {
      this._onStopCallback(this._object);
    }
    return this
  };
  Tween.prototype.end = function () {
    this._goToEnd = true;
    this.update(Infinity);
    return this
  };
  Tween.prototype.pause = function (time) {
    if (time === void 0) { time = now$1(); }
    if (this._isPaused || !this._isPlaying) {
      return this
    }
    this._isPaused = true;
    this._pauseStart = time;
    // eslint-disable-next-line
        this._group && this._group.remove(this);
    return this
  };
  Tween.prototype.resume = function (time) {
    if (time === void 0) { time = now$1(); }
    if (!this._isPaused || !this._isPlaying) {
      return this
    }
    this._isPaused = false;
    this._startTime += time - this._pauseStart;
    this._pauseStart = 0;
    // eslint-disable-next-line
        this._group && this._group.add(this);
    return this
  };
  Tween.prototype.stopChainedTweens = function () {
    for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
      this._chainedTweens[i].stop();
    }
    return this
  };
  Tween.prototype.group = function (group) {
    this._group = group;
    return this
  };
  Tween.prototype.delay = function (amount) {
    this._delayTime = amount;
    return this
  };
  Tween.prototype.repeat = function (times) {
    this._initialRepeat = times;
    this._repeat = times;
    return this
  };
  Tween.prototype.repeatDelay = function (amount) {
    this._repeatDelayTime = amount;
    return this
  };
  Tween.prototype.yoyo = function (yoyo) {
    this._yoyo = yoyo;
    return this
  };
  Tween.prototype.easing = function (easingFunction) {
    this._easingFunction = easingFunction;
    return this
  };
  Tween.prototype.interpolation = function (interpolationFunction) {
    this._interpolationFunction = interpolationFunction;
    return this
  };
  Tween.prototype.chain = function () {
    var tweens = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      tweens[_i] = arguments[_i];
    }
    this._chainedTweens = tweens;
    return this
  };
  Tween.prototype.onStart = function (callback) {
    this._onStartCallback = callback;
    return this
  };
  Tween.prototype.onUpdate = function (callback) {
    this._onUpdateCallback = callback;
    return this
  };
  Tween.prototype.onRepeat = function (callback) {
    this._onRepeatCallback = callback;
    return this
  };
  Tween.prototype.onComplete = function (callback) {
    this._onCompleteCallback = callback;
    return this
  };
  Tween.prototype.onStop = function (callback) {
    this._onStopCallback = callback;
    return this
  };
  /**
     * @returns true if the tween is still playing after the update, false
     * otherwise (calling update on a paused tween still returns true because
     * it is still playing, just paused).
     */
  Tween.prototype.update = function (time, autoStart) {
    if (time === void 0) { time = now$1(); }
    if (autoStart === void 0) { autoStart = true; }
    if (this._isPaused) { return true }
    var property;
    var elapsed;
    var endTime = this._startTime + this._duration;
    if (!this._goToEnd && !this._isPlaying) {
      if (time > endTime) { return false }
      if (autoStart) { this.start(time); }
    }
    this._goToEnd = false;
    if (time < this._startTime) {
      return true
    }
    if (this._onStartCallbackFired === false) {
      if (this._onStartCallback) {
        this._onStartCallback(this._object);
      }
      this._onStartCallbackFired = true;
    }
    elapsed = (time - this._startTime) / this._duration;
    elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed;
    var value = this._easingFunction(elapsed);
    // properties transformations
    this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);
    if (this._onUpdateCallback) {
      this._onUpdateCallback(this._object, elapsed);
    }
    if (elapsed === 1) {
      if (this._repeat > 0) {
        if (isFinite(this._repeat)) {
          this._repeat--;
        }
        // Reassign starting values, restart by making startTime = now
        for (property in this._valuesStartRepeat) {
          if (!this._yoyo && typeof this._valuesEnd[property] === 'string') {
            this._valuesStartRepeat[property] =
                            // eslint-disable-next-line
                            // @ts-ignore FIXME?
                            this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
          }
          if (this._yoyo) {
            this._swapEndStartRepeatValues(property);
          }
          this._valuesStart[property] = this._valuesStartRepeat[property];
        }
        if (this._yoyo) {
          this._reversed = !this._reversed;
        }
        if (this._repeatDelayTime !== undefined) {
          this._startTime = time + this._repeatDelayTime;
        } else {
          this._startTime = time + this._delayTime;
        }
        if (this._onRepeatCallback) {
          this._onRepeatCallback(this._object);
        }
        return true
      } else {
        if (this._onCompleteCallback) {
          this._onCompleteCallback(this._object);
        }
        for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
          // Make the chained tweens start exactly at the time they should,
          // even if the `update()` method was called way past the duration of the tween
          this._chainedTweens[i].start(this._startTime + this._duration);
        }
        this._isPlaying = false;
        return false
      }
    }
    return true
  };
  Tween.prototype._updateProperties = function (_object, _valuesStart, _valuesEnd, value) {
    for (var property in _valuesEnd) {
      // Don't update properties that do not exist in the source object
      if (_valuesStart[property] === undefined) {
        continue
      }
      var start = _valuesStart[property] || 0;
      var end = _valuesEnd[property];
      var startIsArray = Array.isArray(_object[property]);
      var endIsArray = Array.isArray(end);
      var isInterpolationList = !startIsArray && endIsArray;
      if (isInterpolationList) {
        _object[property] = this._interpolationFunction(end, value);
      } else if (typeof end === 'object' && end) {
        // eslint-disable-next-line
                // @ts-ignore FIXME?
        this._updateProperties(_object[property], start, end, value);
      } else {
        // Parses relative end values with start as base (e.g.: +10, -3)
        end = this._handleRelativeValue(start, end);
        // Protect against non numeric properties.
        if (typeof end === 'number') {
          // eslint-disable-next-line
                    // @ts-ignore FIXME?
          _object[property] = start + (end - start) * value;
        }
      }
    }
  };
  Tween.prototype._handleRelativeValue = function (start, end) {
    if (typeof end !== 'string') {
      return end
    }
    if (end.charAt(0) === '+' || end.charAt(0) === '-') {
      return start + parseFloat(end)
    } else {
      return parseFloat(end)
    }
  };
  Tween.prototype._swapEndStartRepeatValues = function (property) {
    var tmp = this._valuesStartRepeat[property];
    var endValue = this._valuesEnd[property];
    if (typeof endValue === 'string') {
      this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(endValue);
    } else {
      this._valuesStartRepeat[property] = this._valuesEnd[property];
    }
    this._valuesEnd[property] = tmp;
  };
  return Tween
}());
/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tweens.
 */
var TWEEN = mainGroup;
// This is the best way to export things in a way that's compatible with both ES
// Modules and CommonJS, without build hacks, and so as not to break the
// existing API.
// https://github.com/rollup/rollup/issues/1961#issuecomment-423037881
var getAll = TWEEN.getAll.bind(TWEEN);
var removeAll = TWEEN.removeAll.bind(TWEEN);
var add = TWEEN.add.bind(TWEEN);
var remove = TWEEN.remove.bind(TWEEN);
var update = TWEEN.update.bind(TWEEN);

// Setup the animation loop.
function animate (time) {
  requestAnimationFrame(animate);
  update(time);
}
requestAnimationFrame(animate);

const FLY_TO = new Mesh();

const CAMERA_FLY_SETTINGS = {
  distance: 0,
  time: 1000
};

const cameraLookAt = (
  object,
  { camera },
  { time = 1000 } = {}
) => {
// backup original rotation
  var startRotation = camera.quaternion.clone();

  // final rotation (with lookAt)
  camera.lookAt(object.position);
  var endRotation = camera.quaternion.clone();

  // revert to original rotation
  camera.quaternion.copy(startRotation);

  // Tween
  return new Tween(camera.quaternion)
    .to(endRotation, time)
    .easing(Easing.Quadratic.InOut) // | TWEEN.Easing.Linear.None
    .start()
};

const cameraFlyToPosition = (
  { from = new Vector3(), to = new Vector3() },
  { distance = 0, time = 1000 } = CAMERA_FLY_SETTINGS,
  { camera }
) => {
  // console.log(from, to, camera)

  var tween = new Tween(from)
    .to(to, time)
    .easing(Easing.Quadratic.InOut) // | TWEEN.Easing.Linear.None
    .onUpdate(() => {
      const _distance = camera.position.distanceTo(to);
      if (_distance < distance) {
        tween.stop();
      }
    })
    // .onComplete(function () {
    //   // controls.target.set(this.x, this.y, this.z)
    //   console.log('Finished')
    // })
    .start();

  return tween
};

const cameraFlyTo = (
  object = FLY_TO,
  settings = CAMERA_FLY_SETTINGS,
  { camera }
) => {
  // zoom to twice the radius
  const FACTOR = 4;

  const stopWhenInRange = () => {
    // Stop when in range
    const _distance = camera.position.distanceTo(to);
    const upTo = boundingSphere.radius * FACTOR;
    if (_distance < upTo) {
      cameraFlyToPositionTween.stop();
    }
  };

  // TWEEN 1 - orientation
  const cameraTween =
    cameraLookAt(object, { camera })
      .onComplete(function () {
        // console.log('cameraFlyTo orientation Finished')
      });

  const boundingSphere = object.geometry.boundingSphere;
  const to = object.getWorldPosition(new Vector3());

  // TWEEN 2 - position
  const cameraFlyToPositionTween = cameraFlyToPosition({
    from: camera.position,
    to
  }, settings, { camera })
    .onUpdate(stopWhenInRange)
    .onComplete(function () {
      // console.log('cameraFlyTo position Finished')
    });

  return cameraFlyToPositionTween
};

const ORBIT_SETTINGS = {
  rotateSpeed: 0.5,
  zoomSpeed: 0.5,
  maxDistanceMultiplier: 20,
  maxZoomSpeed: 2
};

// =====================

const addOrbitDampControlToMesh = (mesh = {}, viewer, {
  rotateSpeed = 0.5,
  zoomSpeed = 0.5,
  maxDistanceMultiplier = 20,
  maxZoomSpeed = 0.5
} = {}) => {
  const { geometry } = mesh;
  geometry.computeBoundingSphere();
  const radius = geometry.boundingSphere.radius;

  // Fit
  viewer.zoomTo(mesh);

  // Change controls settings
  const { camera, controls } = viewer;

  if (!controls) {
    console.warn('No controls');
    return false
  }

  controls.rotateSpeed = rotateSpeed;
  controls.zoomSpeed = zoomSpeed;
  controls.minDistance = radius;
  controls.maxDistance = radius * maxDistanceMultiplier;
  controls.enableDamping = true;
  // controls.autoRotate = true
  // controls.target = mesh
  // controls.maxZoom = 10000

  const controlHandler = (e) => {
    const distance = camera.position.distanceTo(controls.target);
    const distanceToPlanet = distance - radius;

    // Controls - Pan speed depends on zoom
    controls.rotateSpeed = Math.min(distanceToPlanet / radius, maxZoomSpeed);
    controls.zoomSpeed = Math.min(distanceToPlanet / radius, maxZoomSpeed);
  };

  // TODO remove listener handler
  controls.addEventListener('change', controlHandler, false);

  return controls
};

const addOrbitDampControl = (viewer, {
  radius = EARTH_RADIUS,
  rotateSpeed = 0.5,
  zoomSpeed = 0.5
} = {}) => {
  const { controls, camera } = viewer;

  if (!controls) {
    console.warn('No controls');
    return false
  }

  controls.rotateSpeed = rotateSpeed;
  controls.zoomSpeed = zoomSpeed;
  controls.minDistance = radius;
  controls.maxDistance = radius * 4;
  controls.enableDamping = true;
  controls.maxZoom = 10000;

  controls.addEventListener('change', (e) => {
    const distance = camera.position.distanceTo(controls.target);
    const distanceToPlanet = distance - radius;

    // Controls - Pan speed depends on zoom
    controls.rotateSpeed = Math.min(distanceToPlanet / radius, 3);
    controls.zoomSpeed = Math.min(distanceToPlanet / radius, 3);
  }, false);
};

const fitCameraToObject = function (object = {}, viewer, { offset = 1.5 } = {}) {
  const { camera, controls } = viewer;

  // get bounding box of object - this will be used to setup controls and camera
  const boundingBox = new Box3();
  boundingBox.setFromObject(object);

  const center = boundingBox.getCenter(new Vector3());
  const size = boundingBox.getSize(new Vector3());

  // get the max side of the bounding box (fits to width OR height as needed )
  const maxDim = Math.max(size.x, size.y, size.z);
  //   const fov = camera.fov * (Math.PI / 180)
  let cameraZ = maxDim; // Math.abs(maxDim / 4 * Math.tan(fov * 2))

  cameraZ *= offset; // zoom out a little so that objects don't fill the screen

  // Iso
  camera.position.x = cameraZ;
  camera.position.y = cameraZ;
  camera.position.z = cameraZ;

  // camera.position.x = center.x
  // camera.position.y = center.y
  // camera.position.z = center.z
  // const minZ = boundingBox.min.z
  // const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ
  // camera.far = cameraToFarEdge * 3
  // camera.updateProjectionMatrix()

  if (controls) {
    // set camera to rotate around center of loaded object
    controls.target = center;

    // prevent camera from zooming out far enough to create far plane cutoff
    // controls.maxDistance = cameraToFarEdge * 2

    // controls.saveState()
  } else {
    camera.lookAt(center);
  }
};

const SETTINGS = {
  el: 'webgl',
  sphereRotation: 0.0002,
  camera: {
    near: 1,
    far: 100000000,
    fov: 45
  },
  defaultLight: true,
  clouds: {
    rotation: {
      x: 0.001,
      y: 0.0005
    },
    height: 1000
  },
  debug: false
};

class Viewer {
  constructor (_settings = SETTINGS) {
    // Merge settings
    const settings = {
      ...SETTINGS,
      ..._settings
    };

    const { el, debug } = settings;

    var container = document.getElementById(el);

    // Create scene
    var scene = new Scene();

    // Group to put all elements except skyboxes, ..
    // const content = new THREE.Group()
    // content.name = 'Entities'
    // scene.add(content)

    // Camera
    // TODO use elements AR
    var width = window.innerWidth;
    var height = window.innerHeight;
    const aspectRatio = width / height;
    const { near, far, fov } = settings.camera;
    var camera = new PerspectiveCamera(fov, aspectRatio, near, far);
    camera.position.x = 1.5;
    camera.position.y = 1.5;
    camera.position.z = 1.5;

    // Create renderer
    var renderer = new WebGLRenderer({
      antialias: true
      // logarithmicDepthBuffer: true
    });
    renderer.setSize(width, height);

    // Lighs
    if (settings.defaultLight) {
      console.log('[default lights]');
      scene.add(new AmbientLight(0x333333));
      var light = new DirectionalLight(0xffffff, 1);
      light.position.set(5, 3, 5);
      scene.add(light);
    }

    // https://stackoverflow.com/questions/18813481/three-js-mousedown-not-working-when-trackball-controls-enabled
    // make sure that your container.append(renderer.domElement); is executed before initializing THREE.TrackballControls( camera, renderer.domElement );
    container.appendChild(renderer.domElement);

    // Handle resize
    function onWindowResize () {
      var width = container.offsetWidth;
      var height = container.offsetHeight || window.innerHeight;
      if (debug) {
        console.log(`[resize] ${width} x ${height}`);
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onWindowResize, false);

    // Create a scene manager to control the rendering of elements
    const manager = new SceneManager({ scene, renderer }, () => {
      renderer.render(scene, camera);
    });

    // Default to OrbitControls
    var controls = new OrbitControls(camera, container);
    this.controls = controls;

    // Handle controls update
    manager.push((delta) => {
      const { controls } = this;

      if (controls) {
        // TrackedEntity ?
        if (this._trackedEntity) {
          controls.target =
          // object.position
          this._trackedEntity.getWorldPosition(new Vector3());
        }

        controls.update(delta / 1000);
      }
    });

    Object.assign(this, {
      el: container,
      container,
      scene,
      manager,
      // controls,
      renderer,
      camera,
      settings
    });
  }

  get controller () { }

  set controller (c) {
    console.log('[controls] set to', c);

    // Dispose previous
    if (this.controls) {
      this.controls.dispose();
    }

    // Set new
    this.controls = c;
  }

  // =========
  // trackedEntity
  // =========
  get trackedEntity () { return this._trackedEntity }

  set trackedEntity (object = null) {
    if (!object) {
      console.log(`[setTrackedEntity]: stopped`);
      this._trackedEntity = null;
      return
    }

    console.log(`[setTrackedEntity]: ${object.name || '?'}`);
    this._trackedEntity = object;

    this.controller = new OrbitControls(this.camera, this.container);

    // Set target
    // controls.update() must be called after any manual changes to the camera's transform
    // const { controls } = this
    // camera.position.set(0, 20, 100)
    // camera.target = object
    // camera.lookAt(object.getWorldPosition())
    // Updated in controls renderer
    // controls.target =
    //   // object.position
    //   object.getWorldPosition(new THREE.Vector3())
    // controls.update()

    // this.camera.target = object
    // this.controls.target = object
  }

  // TODO
  // setTrackedEntityFlyTo (object = {}) {
  //   console.log('setTrackedEntity', object)

  //   this._trackedEntity = object

  //   const tween = cameraFlyTo(object, {}, this)
  //   console.log(tween)

  //   tween.onComplete(function () {
  //     // controls.target.set(this.x, this.y, this.z)
  //     console.log('Finished')

  //     // Change controls to OrbitControl
  //     // this.controller = new OrbitControls(this.camera, this.container)
  //     // // Set target
  //     // this.camera.target = object
  //   })
  // }

  // Alias
  setTrackedEntity (object = {}) {
    this.trackedEntity = object;
  }

  // =========
  // Camera control
  // =========
  lookAt (object = {}, settings = {}) {
    return cameraLookAt(object, this, settings)
    // Direct
    // this.camera.lookAt(mesh.getWorldPosition(), settings)
  }

  flyToPosition (to = new Vector3()) {
    return cameraFlyToPosition({ from: this.camera.position, to, distance: 10000 }, this)
  }

  flyTo (mesh = new Mesh(), settings = {}) {
    // Disable trackedEntity
    this.trackedEntity = null;
    // Disable controls
    this.controller = null;

    return cameraFlyTo(mesh, settings, this)
  }

  zoomAll () {
    return fitCameraToObject(this.scene.content, this)
  }

  zoomTo (what = {}) {
    return fitCameraToObject(what, this)
  }

  add (what = {}) {
    // Proxy to SceneManager
    this.manager.add(what);
  }
}

const deg2rad = (degrees) => degrees * (Math.PI / 180);
const rad2deg = (angle) => angle * 57.29577951308232; // angle / Math.PI * 180

// Longitude and latitude conversion function, longitude for longitude, latitude for uniqueness, radius for sphere radius
var getPosition = function (longitude = 0, latitude = 0, radius = EARTH_RADIUS) {
  // Convert longitude and latitude to rad coordinates
  var lg = deg2rad(longitude);
  var lt = deg2rad(latitude);
  var temp = radius * Math.cos(lt);
  // Get x, y, Z coordinates
  var x = temp * Math.sin(lg);
  var y = radius * Math.sin(lt);
  var z = temp * Math.cos(lg);

  return [x, y, z]
};

function generateHeight (width, height) {
  const size = width * height; const data = new Uint8Array(size);
  const perlin = new ImprovedNoise(); const z = Math.random() * 100;

  let quality = 1;

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < size; i++) {
      const x = i % width; const y = ~~(i / width);
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
    }

    quality *= 5;
  }

  return data
}

// return array with height data from img
function getHeightData (img, scale = 1) {
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext('2d');

  var size = img.width * img.height;
  var data = new Float32Array(size);

  context.drawImage(img, 0, 0);

  for (let i = 0; i < size; i++) {
    data[i] = 0;
  }

  var imgd = context.getImageData(0, 0, img.width, img.height);
  var pix = imgd.data;

  var j = 0;
  for (let i = 0; i < pix.length; i += 4) {
    var all = pix[i] + pix[i + 1] + pix[i + 2];
    data[j++] = all / (12 * scale);
  }

  return data
}

/* jshint forin: false, bitwise: false */
/*
Copyright 2015-2018 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license and additional notices are located with the
source distribution at:

http://github.com/Esri/lerc/

Contributors:  Johannes Schmid, (LERC v1)
               Chayanika Khatua, (LERC v1)
               Wenxue Ju (LERC v1, v2.x)
*/

/* Copyright 2015-2018 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */

/**
 * a module for decoding LERC blobs
 * @module Lerc
 */
// the original LercDecode for Version 1
const LercDecode = (function () {
  // WARNING: This decoder version can only read old version 1 Lerc blobs. Use with caution.

  // Note: currently, this module only has an implementation for decoding LERC data, not encoding. The name of
  // the class was chosen to be future proof.

  var CntZImage = {};

  CntZImage.defaultNoDataValue = -3.4027999387901484e+38; // smallest Float32 value

  /**
       * Decode a LERC byte stream and return an object containing the pixel data and some required and optional
       * information about it, such as the image's width and height.
       *
       * @param {ArrayBuffer} input The LERC input byte stream
       * @param {object} [options] Decoding options, containing any of the following properties:
       * @config {number} [inputOffset = 0]
       *        Skip the first inputOffset bytes of the input byte stream. A valid LERC file is expected at that position.
       * @config {Uint8Array} [encodedMask = null]
       *        If specified, the decoder will not read mask information from the input and use the specified encoded
       *        mask data instead. Mask header/data must not be present in the LERC byte stream in this case.
       * @config {number} [noDataValue = LercCode.defaultNoDataValue]
       *        Pixel value to use for masked pixels.
       * @config {ArrayBufferView|Array} [pixelType = Float32Array]
       *        The desired type of the pixelData array in the return value. Note that it is the caller's responsibility to
       *        provide an appropriate noDataValue if the default pixelType is overridden.
       * @config {boolean} [returnMask = false]
       *        If true, the return value will contain a maskData property of type Uint8Array which has one element per
       *        pixel, the value of which is 1 or 0 depending on whether that pixel's data is present or masked. If the
       *        input LERC data does not contain a mask, maskData will not be returned.
       * @config {boolean} [returnEncodedMask = false]
       *        If true, the return value will contain a encodedMaskData property, which can be passed into encode() as
       *        encodedMask.
       * @config {boolean} [returnFileInfo = false]
       *        If true, the return value will have a fileInfo property that contains metadata obtained from the
       *        LERC headers and the decoding process.
       * @config {boolean} [computeUsedBitDepths = false]
       *        If true, the fileInfo property in the return value will contain the set of all block bit depths
       *        encountered during decoding. Will only have an effect if returnFileInfo option is true.
       * @returns {{width, height, pixelData, minValue, maxValue, noDataValue, maskData, encodedMaskData, fileInfo}}
       */
  CntZImage.decode = function (input, options) {
    options = options || {};

    var skipMask = options.encodedMaskData || (options.encodedMaskData === null);
    var parsedData = parse(input, options.inputOffset || 0, skipMask);

    var noDataValue = (options.noDataValue !== null) ? options.noDataValue : CntZImage.defaultNoDataValue;

    var uncompressedData = uncompressPixelValues(parsedData, options.pixelType || Float32Array,
      options.encodedMaskData, noDataValue, options.returnMask);

    var result = {
      width: parsedData.width,
      height: parsedData.height,
      pixelData: uncompressedData.resultPixels,
      minValue: uncompressedData.minValue,
      maxValue: parsedData.pixels.maxValue,
      noDataValue: noDataValue
    };

    if (uncompressedData.resultMask) {
      result.maskData = uncompressedData.resultMask;
    }

    if (options.returnEncodedMask && parsedData.mask) {
      result.encodedMaskData = parsedData.mask.bitset ? parsedData.mask.bitset : null;
    }

    if (options.returnFileInfo) {
      result.fileInfo = formatFileInfo(parsedData);
      if (options.computeUsedBitDepths) {
        result.fileInfo.bitDepths = computeUsedBitDepths(parsedData);
      }
    }

    return result
  };

  var uncompressPixelValues = function (data, TypedArrayClass, maskBitset, noDataValue, storeDecodedMask) {
    var blockIdx = 0;
    var numX = data.pixels.numBlocksX;
    var numY = data.pixels.numBlocksY;
    var blockWidth = Math.floor(data.width / numX);
    var blockHeight = Math.floor(data.height / numY);
    var scale = 2 * data.maxZError;
    var minValue = Number.MAX_VALUE; var currentValue;
    maskBitset = maskBitset || ((data.mask) ? data.mask.bitset : null);

    var resultPixels, resultMask;
    resultPixels = new TypedArrayClass(data.width * data.height);
    if (storeDecodedMask && maskBitset) {
      resultMask = new Uint8Array(data.width * data.height);
    }
    var blockDataBuffer = new Float32Array(blockWidth * blockHeight);

    var xx, yy;
    for (var y = 0; y <= numY; y++) {
      var thisBlockHeight = (y !== numY) ? blockHeight : (data.height % numY);
      if (thisBlockHeight === 0) {
        continue
      }
      for (var x = 0; x <= numX; x++) {
        var thisBlockWidth = (x !== numX) ? blockWidth : (data.width % numX);
        if (thisBlockWidth === 0) {
          continue
        }

        var outPtr = y * data.width * blockHeight + x * blockWidth;
        var outStride = data.width - thisBlockWidth;

        var block = data.pixels.blocks[blockIdx];

        var blockData, blockPtr, constValue;
        if (block.encoding < 2) {
          // block is either uncompressed or bit-stuffed (encodings 0 and 1)
          if (block.encoding === 0) {
            // block is uncompressed
            blockData = block.rawData;
          } else {
            // block is bit-stuffed
            unstuff(block.stuffedData, block.bitsPerPixel, block.numValidPixels, block.offset, scale, blockDataBuffer, data.pixels.maxValue);
            blockData = blockDataBuffer;
          }
          blockPtr = 0;
        } else if (block.encoding === 2) {
          // block is all 0
          constValue = 0;
        } else {
          // block has constant value (encoding === 3)
          constValue = block.offset;
        }

        var maskByte;
        if (maskBitset) {
          for (yy = 0; yy < thisBlockHeight; yy++) {
            if (outPtr & 7) {
              //
              maskByte = maskBitset[outPtr >> 3];
              maskByte <<= outPtr & 7;
            }
            for (xx = 0; xx < thisBlockWidth; xx++) {
              if (!(outPtr & 7)) {
                // read next byte from mask
                maskByte = maskBitset[outPtr >> 3];
              }
              if (maskByte & 128) {
                // pixel data present
                if (resultMask) {
                  resultMask[outPtr] = 1;
                }
                currentValue = (block.encoding < 2) ? blockData[blockPtr++] : constValue;
                minValue = minValue > currentValue ? currentValue : minValue;
                resultPixels[outPtr++] = currentValue;
              } else {
                // pixel data not present
                if (resultMask) {
                  resultMask[outPtr] = 0;
                }
                resultPixels[outPtr++] = noDataValue;
              }
              maskByte <<= 1;
            }
            outPtr += outStride;
          }
        } else {
          // mask not present, simply copy block over
          if (block.encoding < 2) {
            // duplicating this code block for performance reasons
            // blockData case:
            for (yy = 0; yy < thisBlockHeight; yy++) {
              for (xx = 0; xx < thisBlockWidth; xx++) {
                currentValue = blockData[blockPtr++];
                minValue = minValue > currentValue ? currentValue : minValue;
                resultPixels[outPtr++] = currentValue;
              }
              outPtr += outStride;
            }
          } else {
            // constValue case:
            minValue = minValue > constValue ? constValue : minValue;
            for (yy = 0; yy < thisBlockHeight; yy++) {
              for (xx = 0; xx < thisBlockWidth; xx++) {
                resultPixels[outPtr++] = constValue;
              }
              outPtr += outStride;
            }
          }
        }
        if ((block.encoding === 1) && (blockPtr !== block.numValidPixels)) {
          throw 'Block and Mask do not match'
        }
        blockIdx++;
      }
    }

    return {
      resultPixels: resultPixels,
      resultMask: resultMask,
      minValue: minValue
    }
  };

  var formatFileInfo = function (data) {
    return {
      fileIdentifierString: data.fileIdentifierString,
      fileVersion: data.fileVersion,
      imageType: data.imageType,
      height: data.height,
      width: data.width,
      maxZError: data.maxZError,
      eofOffset: data.eofOffset,
      mask: data.mask ? {
        numBlocksX: data.mask.numBlocksX,
        numBlocksY: data.mask.numBlocksY,
        numBytes: data.mask.numBytes,
        maxValue: data.mask.maxValue
      } : null,
      pixels: {
        numBlocksX: data.pixels.numBlocksX,
        numBlocksY: data.pixels.numBlocksY,
        numBytes: data.pixels.numBytes,
        maxValue: data.pixels.maxValue,
        noDataValue: data.noDataValue
      }
    }
  };

  var computeUsedBitDepths = function (data) {
    var numBlocks = data.pixels.numBlocksX * data.pixels.numBlocksY;
    var bitDepths = {};
    for (var i = 0; i < numBlocks; i++) {
      var block = data.pixels.blocks[i];
      if (block.encoding === 0) {
        bitDepths.float32 = true;
      } else if (block.encoding === 1) {
        bitDepths[block.bitsPerPixel] = true;
      } else {
        bitDepths[0] = true;
      }
    }

    return Object.keys(bitDepths)
  };

  var parse = function (input, fp, skipMask) {
    var data = {};

    // File header
    var fileIdView = new Uint8Array(input, fp, 10);
    data.fileIdentifierString = String.fromCharCode.apply(null, fileIdView);
    if (data.fileIdentifierString.trim() !== 'CntZImage') {
      throw 'Unexpected file identifier string: ' + data.fileIdentifierString
    }
    fp += 10;
    var view = new DataView(input, fp, 24);
    data.fileVersion = view.getInt32(0, true);
    data.imageType = view.getInt32(4, true);
    data.height = view.getUint32(8, true);
    data.width = view.getUint32(12, true);
    data.maxZError = view.getFloat64(16, true);
    fp += 24;

    // Mask Header
    if (!skipMask) {
      view = new DataView(input, fp, 16);
      data.mask = {};
      data.mask.numBlocksY = view.getUint32(0, true);
      data.mask.numBlocksX = view.getUint32(4, true);
      data.mask.numBytes = view.getUint32(8, true);
      data.mask.maxValue = view.getFloat32(12, true);
      fp += 16;

      // Mask Data
      if (data.mask.numBytes > 0) {
        var bitset = new Uint8Array(Math.ceil(data.width * data.height / 8));
        view = new DataView(input, fp, data.mask.numBytes);
        var cnt = view.getInt16(0, true);
        var ip = 2; var op = 0;
        do {
          if (cnt > 0) {
            while (cnt--) { bitset[op++] = view.getUint8(ip++); }
          } else {
            var val = view.getUint8(ip++);
            cnt = -cnt;
            while (cnt--) { bitset[op++] = val; }
          }
          cnt = view.getInt16(ip, true);
          ip += 2;
        } while (ip < data.mask.numBytes)
        if ((cnt !== -32768) || (op < bitset.length)) {
          throw 'Unexpected end of mask RLE encoding'
        }
        data.mask.bitset = bitset;
        fp += data.mask.numBytes;
      } else if ((data.mask.numBytes | data.mask.numBlocksY | data.mask.maxValue) === 0) { // Special case, all nodata
        data.mask.bitset = new Uint8Array(Math.ceil(data.width * data.height / 8));
      }
    }

    // Pixel Header
    view = new DataView(input, fp, 16);
    data.pixels = {};
    data.pixels.numBlocksY = view.getUint32(0, true);
    data.pixels.numBlocksX = view.getUint32(4, true);
    data.pixels.numBytes = view.getUint32(8, true);
    data.pixels.maxValue = view.getFloat32(12, true);
    fp += 16;

    var numBlocksX = data.pixels.numBlocksX;
    var numBlocksY = data.pixels.numBlocksY;
    // the number of blocks specified in the header does not take into account the blocks at the end of
    // each row/column with a special width/height that make the image complete in case the width is not
    // evenly divisible by the number of blocks.
    var actualNumBlocksX = numBlocksX + ((data.width % numBlocksX) > 0 ? 1 : 0);
    var actualNumBlocksY = numBlocksY + ((data.height % numBlocksY) > 0 ? 1 : 0);
    data.pixels.blocks = new Array(actualNumBlocksX * actualNumBlocksY);
    var blockI = 0;
    for (var blockY = 0; blockY < actualNumBlocksY; blockY++) {
      for (var blockX = 0; blockX < actualNumBlocksX; blockX++) {
        // Block
        var size = 0;
        var bytesLeft = input.byteLength - fp;
        view = new DataView(input, fp, Math.min(10, bytesLeft));
        var block = {};
        data.pixels.blocks[blockI++] = block;
        var headerByte = view.getUint8(0); size++;
        block.encoding = headerByte & 63;
        if (block.encoding > 3) {
          throw 'Invalid block encoding (' + block.encoding + ')'
        }
        if (block.encoding === 2) {
          fp++;
          continue
        }
        if ((headerByte !== 0) && (headerByte !== 2)) {
          headerByte >>= 6;
          block.offsetType = headerByte;
          if (headerByte === 2) {
            block.offset = view.getInt8(1); size++;
          } else if (headerByte === 1) {
            block.offset = view.getInt16(1, true); size += 2;
          } else if (headerByte === 0) {
            block.offset = view.getFloat32(1, true); size += 4;
          } else {
            throw 'Invalid block offset type'
          }

          if (block.encoding === 1) {
            headerByte = view.getUint8(size); size++;
            block.bitsPerPixel = headerByte & 63;
            headerByte >>= 6;
            block.numValidPixelsType = headerByte;
            if (headerByte === 2) {
              block.numValidPixels = view.getUint8(size); size++;
            } else if (headerByte === 1) {
              block.numValidPixels = view.getUint16(size, true); size += 2;
            } else if (headerByte === 0) {
              block.numValidPixels = view.getUint32(size, true); size += 4;
            } else {
              throw 'Invalid valid pixel count type'
            }
          }
        }
        fp += size;

        if (block.encoding === 3) {
          continue
        }

        var arrayBuf, store8;
        if (block.encoding === 0) {
          var numPixels = (data.pixels.numBytes - 1) / 4;
          if (numPixels !== Math.floor(numPixels)) {
            throw 'uncompressed block has invalid length'
          }
          arrayBuf = new ArrayBuffer(numPixels * 4);
          store8 = new Uint8Array(arrayBuf);
          store8.set(new Uint8Array(input, fp, numPixels * 4));
          var rawData = new Float32Array(arrayBuf);
          block.rawData = rawData;
          fp += numPixels * 4;
        } else if (block.encoding === 1) {
          var dataBytes = Math.ceil(block.numValidPixels * block.bitsPerPixel / 8);
          var dataWords = Math.ceil(dataBytes / 4);
          arrayBuf = new ArrayBuffer(dataWords * 4);
          store8 = new Uint8Array(arrayBuf);
          store8.set(new Uint8Array(input, fp, dataBytes));
          block.stuffedData = new Uint32Array(arrayBuf);
          fp += dataBytes;
        }
      }
    }
    data.eofOffset = fp;
    return data
  };

  var unstuff = function (src, bitsPerPixel, numPixels, offset, scale, dest, maxValue) {
    var bitMask = (1 << bitsPerPixel) - 1;
    var i = 0; var o;
    var bitsLeft = 0;
    var n, buffer;
    var nmax = Math.ceil((maxValue - offset) / scale);
    // get rid of trailing bytes that are already part of next block
    var numInvalidTailBytes = src.length * 4 - Math.ceil(bitsPerPixel * numPixels / 8);
    src[src.length - 1] <<= 8 * numInvalidTailBytes;

    for (o = 0; o < numPixels; o++) {
      if (bitsLeft === 0) {
        buffer = src[i++];
        bitsLeft = 32;
      }
      if (bitsLeft >= bitsPerPixel) {
        n = (buffer >>> (bitsLeft - bitsPerPixel)) & bitMask;
        bitsLeft -= bitsPerPixel;
      } else {
        var missingBits = (bitsPerPixel - bitsLeft);
        n = ((buffer & bitMask) << missingBits) & bitMask;
        buffer = src[i++];
        bitsLeft = 32 - missingBits;
        n += (buffer >>> bitsLeft);
      }
      // pixel values may exceed max due to quantization
      dest[o] = n < nmax ? offset + n * scale : maxValue;
    }
    return dest
  };

  return CntZImage
})();

var isPlatformLittleEndian = (function () {
  var a = new ArrayBuffer(4);
  var b = new Uint8Array(a);
  var c = new Uint32Array(a);
  c[0] = 1;
  return b[0] === 1
})();

// https://github.com/tracks-earth/cesium/blob/master/Source/Core/ArcGISTiledElevationTerrainProvider.js

class ArcGISTiledElevationTerrainProvider {
  constructor (settings = {}) {
    this.url = settings.url || 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer';

    // https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/?f=pjson

    // Test
    // this.getTile(1, 1)
  }

  /**
   * https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/0/0/0
   * https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/0/1/0
   * https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/1/0/0
   * https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/1/2/1
   * @param {*} x
   * @param {*} y
   * @param {*} level 0 .. 16
   */
  getTile (x = 0, y = 0, level = 0) {
    return fetch(`${this.url}/tile/${level}/${y}/${x}`)
      .then(response => response.arrayBuffer())
      .then(body => {
        const image = LercDecode.decode(body);
        // console.log(image) // 257
        return image
      })
  }
}

/**
 * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
 * @return {[type]} [description]
 */
const createAtmosphereMaterial = function () {
  var vertexShader = `
    varying vec3 vVertexWorldPosition;
    varying vec3 vVertexNormal;

    void main(){
     vVertexNormal = normalize(normalMatrix * normal);

     vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

     // set gl_Position
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

  var fragmentShader = `
  uniform vec3 glowColor;
    uniform float coeficient;
    uniform float power;

    varying vec3 vVertexNormal;
    varying vec3 vVertexWorldPosition;

    void main(){
     vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;
     vec3 viewCameraToVertex = (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
     viewCameraToVertex = normalize(viewCameraToVertex);
     float intensity  = pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);
     gl_FragColor  = vec4(glowColor, intensity);
    }`;

  // create custom material from the shader code above
  //   that is within specially labeled script tags
  var material = new ShaderMaterial({
    uniforms: {
      coeficient: {
        type: 'f',
        value: 1.0
      },
      power: {
        type: 'f',
        value: 2
      },
      glowColor: {
        type: 'c',
        value: new Color('pink')
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    // blending : THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  });
  return material
};

const BASE_URL = '../../images/planets';
const RADIUS = 0.5;
const SEGMENTS = 64;

// from http://planetpixelemporium.com/

const createSun = function ({ baseUrl = BASE_URL } = {}) {
  var geometry = new SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
  var texture = new TextureLoader().load(`${baseUrl}/sunmap.jpg`);
  var material = new MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.05
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Sun';
  return mesh
};

const createMercury = function ({ baseUrl = BASE_URL } = {}) {
  var geometry = new SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
  var material = new MeshPhongMaterial({
    map: new TextureLoader().load(`${baseUrl}/mercurymap.jpg`),
    bumpMap: new TextureLoader().load(`${baseUrl}/mercurybump.jpg`),
    bumpScale: 0.005
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Mercury';
  return mesh
};

const createVenus = function ({ baseUrl = BASE_URL } = {}) {
  var geometry = new SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
  var material = new MeshPhongMaterial({
    map: new TextureLoader().load(`${baseUrl}/venusmap.jpg`),
    bumpMap: new TextureLoader().load(`${baseUrl}/venusbump.jpg`),
    bumpScale: 0.005
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Venus';
  return mesh
};

/**
 * Earth
 * @param {} param0
 */
const createEarth = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new SphereGeometry(radius, SEGMENTS, SEGMENTS);
  var material = new MeshPhongMaterial({
    map: new TextureLoader().load(`${baseUrl}/earthmap1k.jpg`),
    bumpMap: new TextureLoader().load(`${baseUrl}/earthbump1k.jpg`),
    bumpScale: 0.05,
    specularMap: new TextureLoader().load(`${baseUrl}/earthspec1k.jpg`),
    specular: new Color('grey')
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Earth';
  return mesh
};

const createEarthCloud = function ({ baseUrl = BASE_URL, radius = RADIUS, distance = 1.01 } = {}) {
  var geometry = new SphereGeometry(radius * distance, SEGMENTS, SEGMENTS);
  var material = new MeshPhongMaterial({
    map: new TextureLoader().load(`${baseUrl}/earthcloudmap1k.png`),
    side: DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Earth/clouds';
  return mesh
};

const createMoon = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new SphereGeometry(radius, SEGMENTS, SEGMENTS);
  var material = new MeshPhongMaterial({
    map: new TextureLoader().load(`${baseUrl}/moonmap1k.jpg`),
    bumpMap: new TextureLoader().load(`${baseUrl}/moonbump1k.jpg`),
    bumpScale: 0.002
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Earth/moon';
  return mesh
};

const createMars = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new SphereGeometry(radius, SEGMENTS, SEGMENTS);
  var material = new MeshPhongMaterial({
    map: new TextureLoader().load(`${baseUrl}/marsmap1k.jpg`),
    bumpMap: new TextureLoader().load(`${baseUrl}/marsbump1k.jpg`),
    bumpScale: 0.05
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Mars';
  return mesh
};

const createJupiter = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new SphereGeometry(radius, SEGMENTS, SEGMENTS);
  var texture = new TextureLoader().load(`${baseUrl}/jupitermap.jpg`);
  var material = new MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.02
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Jupiter';
  return mesh
};

const createNeptune = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new SphereGeometry(radius, SEGMENTS, SEGMENTS);
  var texture = new TextureLoader().load(`${baseUrl}/neptunemap.jpg`);
  var material = new MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.05
  });
  var mesh = new Mesh(geometry, material);
  return mesh
};

const createPluto = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new SphereGeometry(radius, SEGMENTS, SEGMENTS);
  var material = new MeshPhongMaterial({
    map: new TextureLoader().load(`${baseUrl}/plutomap1k.jpg`),
    bumpMap: new TextureLoader().load(`${baseUrl}/plutobump1k.jpg`),
    bumpScale: 0.005
  });
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Pluto';
  return mesh
};

const createStarfield = function ({
  baseUrl = BASE_URL,
  segments = 32,
  radius = RADIUS * 2
} = {}) {
  var texture = new TextureLoader().load(`${baseUrl}/galaxy_starfield.png`);
  var material = new MeshBasicMaterial({
    map: texture,
    // side: THREE.BackSide
    side: DoubleSide
  });
  // material.depthTest = false
  var geometry = new SphereGeometry(radius, segments, segments);
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Starfield';
  return mesh
};

// export const createSaturn = function ({ baseUrl = BASE_URL } = {}) {
//   var geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS)
//   var texture = new THREE.TextureLoader().load(`${baseUrl}/saturnmap.jpg`)
//   var material = new THREE.MeshPhongMaterial({
//     map: texture,
//     bumpMap: texture,
//     bumpScale: 0.05
//   })
//   var mesh = new THREE.Mesh(geometry, material)
//   return mesh
// }

// export const createSaturnRing = function ({ baseUrl = BASE_URL } = {}) {
//   // create destination canvas
//   var canvasResult = document.createElement('canvas')
//   canvasResult.width = 915
//   canvasResult.height = 64
//   var contextResult = canvasResult.getContext('2d')

//   // load earthcloudmap
//   var imageMap = new Image()
//   imageMap.addEventListener('load', function () {
//     // create dataMap ImageData for earthcloudmap
//     var canvasMap = document.createElement('canvas')
//     canvasMap.width = imageMap.width
//     canvasMap.height = imageMap.height
//     var contextMap = canvasMap.getContext('2d')
//     contextMap.drawImage(imageMap, 0, 0)
//     var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

//     // load earthcloudmaptrans
//     var imageTrans = new Image()
//     imageTrans.addEventListener('load', function () {
//       // create dataTrans ImageData for earthcloudmaptrans
//       var canvasTrans = document.createElement('canvas')
//       canvasTrans.width = imageTrans.width
//       canvasTrans.height = imageTrans.height
//       var contextTrans = canvasTrans.getContext('2d')
//       contextTrans.drawImage(imageTrans, 0, 0)
//       var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
//       // merge dataMap + dataTrans into dataResult
//       var dataResult = contextMap.createImageData(canvasResult.width, canvasResult.height)
//       for (var y = 0, offset = 0; y < imageMap.height; y++) {
//         for (var x = 0; x < imageMap.width; x++, offset += 4) {
//           dataResult.data[offset + 0] = dataMap.data[offset + 0]
//           dataResult.data[offset + 1] = dataMap.data[offset + 1]
//           dataResult.data[offset + 2] = dataMap.data[offset + 2]
//           dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0] / 4
//         }
//       }
//       // update texture with result
//       contextResult.putImageData(dataResult, 0, 0)
//       material.map.needsUpdate = true
//     })
//     imageTrans.src = `${baseUrl}/saturnringpattern.gif`
//   }, false)
//   imageMap.src = `${baseUrl}/saturnringcolor.jpg`

//   var geometry = new RingGeometry(0.55, 0.75, 64)
//   var material = new THREE.MeshPhongMaterial({
//     map: new THREE.Texture(canvasResult),
//     // map  : new THREE.TextureLoader().load(THREEx.Planets.baseURL+'images/ash_uvgrid01.jpg'),
//     side: THREE.DoubleSide,
//     transparent: true,
//     opacity: 0.8
//   })
//   var mesh = new THREE.Mesh(geometry, material)
//   mesh.lookAt(new THREE.Vector3(RADIUS, -4, 1))
//   return mesh
// }

// export const createUranus = function ({ baseUrl = BASE_URL } = {}) {
//   var geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS)
//   var texture = new THREE.TextureLoader().load(`${baseUrl}/uranusmap.jpg`)
//   var material = new THREE.MeshPhongMaterial({
//     map: texture,
//     bumpMap: texture,
//     bumpScale: 0.05
//   })
//   var mesh = new THREE.Mesh(geometry, material)
//   return mesh
// }

// export const createUranusRing = function ({ baseUrl = BASE_URL } = {}) {
//   // create destination canvas
//   var canvasResult = document.createElement('canvas')
//   canvasResult.width = 1024
//   canvasResult.height = 72
//   var contextResult = canvasResult.getContext('2d')

//   // load earthcloudmap
//   var imageMap = new Image()
//   imageMap.addEventListener('load', function () {
//     // create dataMap ImageData for earthcloudmap
//     var canvasMap = document.createElement('canvas')
//     canvasMap.width = imageMap.width
//     canvasMap.height = imageMap.height
//     var contextMap = canvasMap.getContext('2d')
//     contextMap.drawImage(imageMap, 0, 0)
//     var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

//     // load earthcloudmaptrans
//     var imageTrans = new Image()
//     imageTrans.addEventListener('load', function () {
//       // create dataTrans ImageData for earthcloudmaptrans
//       var canvasTrans = document.createElement('canvas')
//       canvasTrans.width = imageTrans.width
//       canvasTrans.height = imageTrans.height
//       var contextTrans = canvasTrans.getContext('2d')
//       contextTrans.drawImage(imageTrans, 0, 0)
//       var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
//       // merge dataMap + dataTrans into dataResult
//       var dataResult = contextMap.createImageData(canvasResult.width, canvasResult.height)
//       for (var y = 0, offset = 0; y < imageMap.height; y++) {
//         for (var x = 0; x < imageMap.width; x++, offset += 4) {
//           dataResult.data[offset + 0] = dataMap.data[offset + 0]
//           dataResult.data[offset + 1] = dataMap.data[offset + 1]
//           dataResult.data[offset + 2] = dataMap.data[offset + 2]
//           dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0] / 2
//         }
//       }
//       // update texture with result
//       contextResult.putImageData(dataResult, 0, 0)
//       material.map.needsUpdate = true
//     })
//     imageTrans.src = `${baseUrl}/uranusringtrans.gif`
//   }, false)
//   imageMap.src = `${baseUrl}/uranusringcolour.jpg`

//   var geometry = new RingGeometry(0.55, 0.75, 64)
//   var material = new THREE.MeshPhongMaterial({
//     map: new THREE.Texture(canvasResult),
//     // map  : new THREE.TextureLoader().load(THREEx.Planets.baseURL+'images/ash_uvgrid01.jpg'),
//     side: THREE.DoubleSide,
//     transparent: true,
//     opacity: 0.8
//   })
//   var mesh = new THREE.Mesh(geometry, material)
//   mesh.lookAt(new THREE.Vector3(RADIUS, -4, 1))
//   return mesh
// }

// /**
//  * change the original from three.js because i needed different UV
//  *
//  * @author Kaleb Murphy
//  * @author jerome etienne
//  */
// export const RingGeometry = function (innerRadius, outerRadius, thetaSegments) {
//   THREE.Geometry.call(this)

//   innerRadius = innerRadius || 0
//   outerRadius = outerRadius || 50
//   thetaSegments = thetaSegments || 8

//   var normal = new THREE.Vector3(0, 0, 1)

//   for (var i = 0; i < thetaSegments; i++) {
//     var angleLo = (i / thetaSegments) * Math.PI * 2
//     var angleHi = ((i + 1) / thetaSegments) * Math.PI * 2

//     var vertex1 = new THREE.Vector3(innerRadius * Math.cos(angleLo), innerRadius * Math.sin(angleLo), 0)
//     var vertex2 = new THREE.Vector3(outerRadius * Math.cos(angleLo), outerRadius * Math.sin(angleLo), 0)
//     var vertex3 = new THREE.Vector3(innerRadius * Math.cos(angleHi), innerRadius * Math.sin(angleHi), 0)
//     var vertex4 = new THREE.Vector3(outerRadius * Math.cos(angleHi), outerRadius * Math.sin(angleHi), 0)

//     this.vertices.push(vertex1)
//     this.vertices.push(vertex2)
//     this.vertices.push(vertex3)
//     this.vertices.push(vertex4)

//     var vertexIdx = i * 4

//     // Create the first triangle
//     let face = new THREE.Face3(vertexIdx + 0, vertexIdx + 1, vertexIdx + 2, normal)
//     let uvs = []

//     uvs.push(new THREE.Vector2(0, 0))
//     uvs.push(new THREE.Vector2(1, 0))
//     uvs.push(new THREE.Vector2(0, 1))

//     this.faces.push(face)
//     this.faceVertexUvs[0].push(uvs)

//     // Create the second triangle
//     face = new THREE.Face3(vertexIdx + 2, vertexIdx + 1, vertexIdx + 3, normal)
//     uvs = []

//     uvs.push(new THREE.Vector2(0, 1))
//     uvs.push(new THREE.Vector2(1, 0))
//     uvs.push(new THREE.Vector2(1, 1))

//     this.faces.push(face)
//     this.faceVertexUvs[0].push(uvs)
//   }

//   this.computeCentroids()
//   this.computeFaceNormals()

//   this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), outerRadius)
// }
// // RingGeometry.prototype = Object.create(THREE.Geometry.prototype)

var Planets = /*#__PURE__*/Object.freeze({
  __proto__: null,
  createSun: createSun,
  createMercury: createMercury,
  createVenus: createVenus,
  createEarth: createEarth,
  createEarthCloud: createEarthCloud,
  createMoon: createMoon,
  createMars: createMars,
  createJupiter: createJupiter,
  createNeptune: createNeptune,
  createPluto: createPluto,
  createStarfield: createStarfield
});

const SETTINGS$1 = {
  realistic: false
};

const createEarthScene = (viewer, settings = SETTINGS$1) => {
  const { scene } = viewer;

  const onRenderFcts = new SceneManager();

  // Lights
  let light = new AmbientLight(0x888888);
  scene.add(light);
  light = new DirectionalLight('white', 1);
  light.position.set(5, 5, 5);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  // var light = new THREE.DirectionalLight(0xcccccc, 1)
  // light.position.set(5, 5, 5)
  // scene.add(light)

  // Stars
  var starSphere = createStarfield({ radius: FAR_AWAY });
  scene.add(starSphere);

  // Container
  var containerEarth = new Object3D();
  containerEarth.name = 'Container';
  // containerEarth.rotateZ(-23.4 * Math.PI / 180)
  // containerEarth.position.z = 0
  scene.add(containerEarth);
  onRenderFcts.push(function (delta, now) {
    containerEarth.rotation.y += 1 / 8 * (delta / 1000);
  });

  // Earth
  var earthMesh = createEarth({ radius: EARTH_RADIUS });
  earthMesh.receiveShadow = true;
  earthMesh.castShadow = true;
  // earthMesh.position.set(1000, 0, 0)
  // earthMesh.scale.multiplyScalar(Constants.EARTH_RADIUS)
  containerEarth.add(earthMesh);
  // onRenderFcts.push(function (delta, now) {
  //   earthMesh.rotation.y += 1 / 32 * (delta / 1000)
  // })
  // Attach camera control to mesh
  // addOrbitDampControslToMesh(earthMesh, viewer)
  // addOrbitDampControlToMesh(moonMesh, viewer)

  // Atmosphere
  var geometry = new SphereGeometry(EARTH_RADIUS, 32, 32);
  var material = createAtmosphereMaterial();
  material.side = BackSide;
  material.uniforms.glowColor.value.set(0x00b3ff);
  material.uniforms.coeficient.value = 0.5;
  material.uniforms.power.value = 4.0;
  var mesh = new Mesh(geometry, material);
  mesh.name = 'Atmosphere';
  mesh.scale.multiplyScalar(1.15);
  containerEarth.add(mesh);

  // Moon
  var moonMesh = createMoon({ radius: EARTH_MOON_RADIOUS });
  const moonDistance =
  settings.realistic ? EARTH_MOON_DISTANCE
    : EARTH_MOON_RADIOUS * 10;
  moonMesh.position.set(moonDistance, 0, 0);
  // moonMesh.scale.multiplyScalar(1 / 5)
  // moonMesh.scale.multiplyScalar(Constants.EARTH_MOON_RADIOUS)
  moonMesh.receiveShadow = true;
  moonMesh.castShadow = true;
  moonMesh.geometry.computeBoundingBox();
  moonMesh.geometry.computeBoundingSphere();
  containerEarth.add(moonMesh);

  // Clouds
  var earthCloud = createEarthCloud({ radius: EARTH_RADIUS });
  earthCloud.receiveShadow = true;
  earthCloud.castShadow = true;
  // earthCloud.scale.multiplyScalar(Constants.EARTH_RADIUS * 1.1)
  containerEarth.add(earthCloud);
  onRenderFcts.push(function (delta, now) {
    earthCloud.rotation.y += 1 / 8 * (delta / 1000);
  });

  // // Planet
  // const planet = new Planet()
  // planet.terrainProvider = new ArcGISTiledElevationTerrainProvider()
  // viewer.add(planet)
  // viewer.zoomTo(planet.mesh)

  return containerEarth
  // return {
  //   mesh: containerEarth,
  //   render () {

  //   }
  // }
};

class Sky {
  constructor ({ renderer, scene } = {}) {
    const sun = new Vector3();

    const sky = new Sky$1();
    sky.scale.setScalar(10000);

    const skyUniforms = sky.material.uniforms;

    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const parameters = {
      inclination: 0.49,
      azimuth: 0.205
    };

    const pmremGenerator = new PMREMGenerator(renderer);

    function updateSun () {
      const theta = Math.PI * (parameters.inclination - 0.5);
      const phi = 2 * Math.PI * (parameters.azimuth - 0.5);

      sun.x = Math.cos(phi);
      sun.y = Math.sin(phi) * Math.sin(theta);
      sun.z = Math.sin(phi) * Math.cos(theta);

      sky.material.uniforms['sunPosition'].value.copy(sun);
      //   water.material.uniforms['sunDirection'].value.copy(sun).normalize()

      scene.environment = pmremGenerator.fromScene(sky).texture;
    }

    updateSun();

    sky.name = 'Sky';
    this.mesh = sky;
  }
}

class Clouds {
  constructor ({ radius = 1, segments = 32, THREE } = {}) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius + 0.008, segments, segments),
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('/images/fair_clouds_4k.png'),
        transparent: true
      })
    );
    mesh.name = 'clouds';
    this.mesh = mesh;
  }

  render () {
    const { mesh, settings } = this;
    mesh.rotation.x += settings.rotation.x;
    mesh.rotation.y += settings.rotation.y;
  }
}

// var clouds = createClouds(radius + settings.clouds.height / 10000, segments)
// clouds.rotation.y = rotation
// scene.add(clouds)

// example https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html

class Water {
  constructor (settings = {}) {
    const geometry = settings.geometry || new PlaneBufferGeometry(10000, 10000);

    const waterNormals = new TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
      texture.wrapS = texture.wrapT = RepeatWrapping;
    });

    const water = new Water$1(
      geometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals,
        alpha: 1.0,
        sunDirection: new Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7
        // fog: scene.fog !== undefined
      }
    );
    water.rotation.x = -Math.PI / 2;

    water.name = 'Water';
    this.mesh = water;
  }

  render () {
    const { mesh } = this;

    mesh.material.uniforms['time'].value += 1.0 / 60.0;
  }
}

const DEFAULT = {
  radius: 10000,
  segments: 32,
  texture: '/images/galaxy_starfield.png'
};

class Clouds$1 {
  constructor (options = DEFAULT) {
    const {
      radius,
      segments,
      texture
    } = {
      ...DEFAULT,
      ...options
    };

    const mesh = new Mesh(
      new SphereGeometry(radius, segments, segments),
      new MeshBasicMaterial({
        map: new TextureLoader().load(texture),
        side: BackSide
      })
    );
    mesh.name = 'stars';
    this.mesh = mesh;
  }

  render () {
    // const { mesh, settings } = this
    // mesh.rotation.x += settings.rotation.x
    // mesh.rotation.y += settings.rotation.y
  }
}

// var clouds = createClouds(radius + settings.clouds.height / 10000, segments)
// clouds.rotation.y = rotation
// scene.add(clouds)

// Based on https://stemkoski.github.io/Three.js/Shader-Heightmap-Textures.html

const types = {
  water: [0.01, 0.25, 0.24, 0.26],
  sandy: [0.24, 0.27, 0.28, 0.31],
  grass: [0.28, 0.32, 0.35, 0.40],
  rocky: [0.30, 0.50, 0.40, 0.70],
  snowy: [0.50, 0.65]
};

const DEFAULTS = {
  map: 'https://stemkoski.github.io/Three.js/images/heightmap.png',
  // magnitude of normal displacement
  bumpScale: 200,
  types
};

const createTerrainShaders = ({ uniforms, types } = {}) => {
  return new ShaderMaterial(
    {
      uniforms,
      vertexShader: `
      uniform sampler2D bumpTexture;
      uniform float bumpScale;
      
      varying float vAmount;
      varying vec2 vUV;
      
      void main() 
      { 
        vUV = uv;
        vec4 bumpData = texture2D( bumpTexture, uv );
        
        vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
        
        // move the position along the normal
          vec3 newPosition = position + normal * bumpScale * vAmount;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
      }`,
      fragmentShader: `
      uniform sampler2D oceanTexture;
      uniform sampler2D sandyTexture;
      uniform sampler2D grassTexture;
      uniform sampler2D rockyTexture;
      uniform sampler2D snowyTexture;
      
      varying vec2 vUV;
      
      varying float vAmount;
      
      void main() 
      {
        vec4 water = (smoothstep(${types.water[0]}, ${types.water[1]}, vAmount) - smoothstep(${types.water[2]}, ${types.water[3]}, vAmount) ) * texture2D( oceanTexture, vUV * 10.0 );
        vec4 sandy = (smoothstep(${types.sandy[0]}, ${types.sandy[1]}, vAmount) - smoothstep(${types.sandy[2]}, ${types.sandy[3]}, vAmount) ) * texture2D( sandyTexture, vUV * 10.0 );
        vec4 grass = (smoothstep(${types.grass[0]}, ${types.grass[1]}, vAmount) - smoothstep(${types.grass[2]}, ${types.grass[3]}, vAmount) ) * texture2D( grassTexture, vUV * 20.0 );
        vec4 rocky = (smoothstep(${types.rocky[0]}, ${types.rocky[1]}, vAmount) - smoothstep(${types.rocky[2]}, ${types.rocky[3]}, vAmount) ) * texture2D( rockyTexture, vUV * 20.0 );
        vec4 snowy = (smoothstep(${types.snowy[0]}, ${types.snowy[1]}, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass + rocky + snowy; //, 1.0);
      }  `,
      side: DoubleSide
    })
};

const createUniforms = ({ map, bumpScale } = {}) => {
  // texture used to generate "bumpiness"
  var bumpTexture = new TextureLoader().load(map);
  bumpTexture.wrapS = bumpTexture.wrapT = RepeatWrapping;

  var oceanTexture = new TextureLoader().load('https://stemkoski.github.io/Three.js/images/dirt-512.jpg');
  oceanTexture.wrapS = oceanTexture.wrapT = RepeatWrapping;

  var sandyTexture = new TextureLoader().load('https://stemkoski.github.io/Three.js/images/sand-512.jpg');
  sandyTexture.wrapS = sandyTexture.wrapT = RepeatWrapping;

  var grassTexture = new TextureLoader().load('https://stemkoski.github.io/Three.js/images/grass-512.jpg');
  grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;

  var rockyTexture = new TextureLoader().load('https://stemkoski.github.io/Three.js/images/rock-512.jpg');
  rockyTexture.wrapS = rockyTexture.wrapT = RepeatWrapping;

  var snowyTexture = new TextureLoader().load('https://stemkoski.github.io/Three.js/images/snow-512.jpg');
  snowyTexture.wrapS = snowyTexture.wrapT = RepeatWrapping;

  const customUniforms = {
    bumpTexture: { type: 't', value: bumpTexture },
    bumpScale: { type: 'f', value: bumpScale },
    oceanTexture: { type: 't', value: oceanTexture },
    sandyTexture: { type: 't', value: sandyTexture },
    grassTexture: { type: 't', value: grassTexture },
    rockyTexture: { type: 't', value: rockyTexture },
    snowyTexture: { type: 't', value: snowyTexture }
  };

  return customUniforms
};

class Terrain {
  constructor (props = {}) {
    const settings = {
      ...DEFAULTS,
      ...props
    };

    this.settings = settings;

    // const scene = new THREE.Group()

    const uniforms = createUniforms(settings);
    // create custom material from the shader code above
    //   that is within specially labelled script tags

    this._types = types;

    const material = createTerrainShaders({ uniforms, types });

    var planeGeo = new PlaneGeometry(1000, 1000, 100, 100);
    var plane = new Mesh(planeGeo, material);
    plane.rotation.x = -Math.PI / 2;
    // plane.position.y = -100
    // scene.add(plane)

    // // const waterGeo = new THREE.PlaneGeometry(1000, 1000, 1, 1)
    // var waterTex = new THREE.TextureLoader().load('https://stemkoski.github.io/Three.js/images/water512.jpg')
    // waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping
    // waterTex.repeat.set(5, 5)
    // var waterMat = new THREE.MeshBasicMaterial({ map: waterTex, transparent: true, opacity: 0.40 })
    // var water = new THREE.Mesh(planeGeo, waterMat)
    // water.rotation.x = -Math.PI / 2
    // water.position.y = -50
    // scene.add(water)

    // Attach
    plane.name = 'Terrain';
    this.mesh = plane;
  }

  get bumpScale () {
    return this.settings.bumpScale
  }

  set bumpScale (value) {
    this.settings.bumpScale = value;

    this.mesh.material.uniforms.bumpScale.value = value;
  }

  get types () {
    return this._types
  }

  set types (value) {
    this._types = value;

    this.compileShaders();
  }

  compileShaders () {
    // Regenrate shader
    const uniforms = createUniforms(this.settings);
    this.uniforms = uniforms;

    const material = createShaders({
      uniforms,
      types: this.types
    });

    const { mesh } = this;
    mesh.material = material;
  }

  render () {

  }
}

// example https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html

const DEFAULT$1 = {

};

const createEarthMaterial4K = () => {
  return new MeshPhongMaterial({
    // 4k
    map: new TextureLoader().load('/images/4k/map.jpg'),
    bumpMap: new TextureLoader().load('/images/4k/bump.jpg'),
    bumpScale: 0.005,
    specularMap: new TextureLoader().load('/images/4k/water.png'),
    specular: new Color('grey')
  })
};

const createEarthMaterial10K = () => {
  return new MeshPhongMaterial({
    map: new TextureLoader().load('/images/10k/map.jpg'),
    // map: new THREE.TextureLoader().load('/images/earthlights10k.jpg'),
    bumpMap: new TextureLoader().load('/images/10k/bump.jpg'),
    bumpScale: 0.005,
    specularMap: new TextureLoader().load('/images/10k/water.jpg'),
    specular: new Color('grey')
  })
};

const createEarthMaterial = ({ quality = '4k' } = {}) => {
  return quality === '4k' ? createEarthMaterial4K() : createEarthMaterial10K()
};

function createSphereMesh ({
  radius = EARTH_RADIUS,
  segments = 256
} = {}) {
  const mesh = new Mesh(
    new SphereGeometry(radius, segments, segments),
    new MeshPhongMaterial()
  );
  mesh.name = 'sphere';
  return mesh
}

const RADIUS$1 = 6000;

const applyTerrainToSphere = (geometry = {}, data = [], scale = 0.1) => {
  // const geometry = this.mesh.geometry
  const vertices = geometry.attributes.position.array;

  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    var vector = new Vector3();
    vector.set(vertices[j + 0], vertices[j + 1], vertices[j + 2]);
    vector.setLength(data[i] * scale + RADIUS$1);
    // console.log(data[i])
    vertices[j] = vector.x;
    vertices[j + 1] = vector.y;
    vertices[j + 2] = vector.z;
  }
  geometry.attributes.position.needsUpdate = true;
};

const applyTerrainToPlane = (geometry = {}, data = [], scale = 0.1) => {
  // const geometry = mesh.geometry
  const vertices = geometry.attributes.position.array;
  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 1] = data[i] * scale;
  }
  geometry.attributes.position.needsUpdate = true;
};

class Planet {
  constructor (settings = DEFAULT$1) {
    // const worldWidth = 20
    // const worldDepth = 20
    const worldWidth = 256;
    const worldDepth = 256;

    const geometry =
      new SphereGeometry(RADIUS$1, worldWidth, worldDepth);
      // new THREE.PlaneGeometry(7500 * 2, 7500, worldWidth - 1, worldDepth - 1)
      // geometry.rotateX(-Math.PI / 2)

    geometry.rotateY(-Math.PI / 2);

    const material = new MeshStandardMaterial({
      // wireframe: true,
      color: 'green',
      // vertexColors: THREE.VertexColors,
      flatShading: true,
      side: DoubleSide
    });

    const mesh = new Mesh(
      geometry,
      material
    );

    mesh.name = 'planet';
    this.mesh = mesh;

    // Upgrade material
    // return new Promise((resolve) => {
    //   mesh.material = createEarthMaterial()
    // })
    // const earthMaterial = createEarthMaterial()
    // mesh.material = earthMaterial
  }

  get terrainProvider () { return this._terrainProvider }

  set terrainProvider (value) {
    this._terrainProvider = value;
    this.update();
  }

  async update () {
    const bumpScale = 0.10;

    this.terrainProvider.getTile(0, 0, 0).then(elem => {
      // console.log(elem)
      // Apply height to mesh
      applyTerrainToSphere(this.mesh.geometry, elem.pixelData, bumpScale);
    });
    // this.terrainProvider.getTile(1, 0, 0).then(elem => {
    //   console.log(elem)
    //   // Apply height to mesh
    //   applyTerrain(elem.pixelData)
    // })
  }

  render () {
    // const { mesh } = this
    // mesh.material.uniforms['time'].value += 1.0 / 60.0
  }
}

export { ArcGISTiledElevationTerrainProvider, Clouds, constants as Constants, ORBIT_SETTINGS, Planet, Planets, SceneManager, Sky, Clouds$1 as Stars, Terrain, Viewer, Water, addOrbitDampControl, addOrbitDampControlToMesh, applyTerrainToPlane, cameraFlyTo, cameraFlyToPosition, cameraLookAt, createAtmosphereMaterial, createEarthMaterial, createEarthMaterial10K, createEarthMaterial4K, createEarthScene, createSphereMesh, deg2rad, fitCameraToObject, generateHeight, getHeightData, getPosition, rad2deg };
