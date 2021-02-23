var VueAceEdit = (function (exports) {
  'use strict'

  const loadScript = (url = '') => {
    return new Promise(function (resolve, reject) {
      var head = document.getElementsByTagName('head')[0]
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.addEventListener('load', function () {
      //   this.removeEventListener('load', arguments.callee)
        resolve(script)
      })
      script.src = url
      head.appendChild(script)
    })
  }

  var script = {
    props: {
      path: { type: String, default: 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12' }
    },

    async mounted () {
      const { path } = this

      if (!window.ace) {
        await loadScript(`${path}/ace.min.js`)
      }

      const { ace } = window
      ace.config.set('basePath', path)

      // Tell parent
      this.$emit('ready', ace)
    }
  }

  function normalizeComponent (template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector
      createInjector = shadowMode
      shadowMode = false
    } // Vue.extend constructor export interop.

    var options = typeof script === 'function' ? script.options : script // render functions

    if (template && template.render) {
      options.render = template.render
      options.staticRenderFns = template.staticRenderFns
      options._compiled = true // functional template

      if (isFunctionalTemplate) {
        options.functional = true
      }
    } // scopedId

    if (scopeId) {
      options._scopeId = scopeId
    }

    var hook

    if (moduleIdentifier) {
      // server build
      hook = function hook (context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__
        } // inject component styles

        if (style) {
          style.call(this, createInjectorSSR(context))
        } // register component module identifier for async chunk inference

        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier)
        }
      } // used by ssr in case component is cached and beforeCreate
      // never gets called

      options._ssrRegister = hook
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot))
      } : function (context) {
        style.call(this, createInjector(context))
      }
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render

        options.render = function renderWithStyleInjection (h, context) {
          hook.call(context)
          return originalRender(h, context)
        }
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
      }
    }

    return script
  }

  var normalizeComponent_1 = normalizeComponent

  /* script */
  const __vue_script__ = script

  /* template */
  var __vue_render__ = function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c('div')
  }
  var __vue_staticRenderFns__ = []
  __vue_render__._withStripped = true

  /* style */
  const __vue_inject_styles__ = undefined
  /* scoped */
  const __vue_scope_id__ = undefined
  /* module identifier */
  const __vue_module_identifier__ = undefined
  /* functional template */
  const __vue_is_functional_template__ = false
  /* style inject */

  /* style inject SSR */

  var AceResolver = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  )

  var script$1 = {
    components: {
      AceResolver
    },

    props: {
      value: { type: [Object, String], default: '' },
      mode: {
        type: String,
        // https://github.com/ajaxorg/ace/tree/master/lib/ace/mode
        default: 'javascript'
      },
      theme: {
        type: String,
        // https://github.com/ajaxorg/ace/tree/master/lib/ace/theme
        default: 'twilight'
      },
      height: { type: Number, default: 100 },
      options: {
        type: Object,
        default: () => ({
        // selectionStyle: 'text',
        // maxLines: 30,
          wrap: true,
          autoScrollEditorIntoView: true
        })
      }
    },

    data: vm => ({
      disableWatcher: null
    }),

    mounted () {
      // Watchers
      this.$watch('value', newValue => {
        if (this.disableWatcher) return

        // console.log('Value change')
        this.setValue(newValue)
      })
    },

    methods: {
      ready (ace) {
        // const { ace } = window

        const editor = ace.edit(this.$refs.editor, {
        // mode: 'ace/mode/javascript',
          mode: `ace/mode/${this.mode}`,
          ...this.options
        })

        editor.setTheme(`ace/theme/${this.theme}`)

        // Tell Vue
        this.editor = editor

        // Set initial value
        this.setValue(this.value)

        // Then add change handler
        editor.on('change', this.onChange)
        // editor.getSession().on('change', this.onChange)

        // Based on https://stackoverflow.com/questions/9506154/determine-if-javascript-syntax-is-valid-in-change-handler-of-ace
        editor.on('changeMode', () => {
        // session.$worker is available when 'changeMode' event triggered
        // You could subscribe worker events here, whatever changes to the
        // content will trigger 'error' or 'ok' events.

          // console.log('cool')
          // editor.$worker.on('error', ko)
          // editor.$worker.on('ok', ok)
          const handle = (e) => {
            const { data } = e
            // console.log('update:annotations', e)

            this.$emit('update:annotations', data)
            this.$emit('update:valid', data.length === 0)
          }

          const session = editor.getSession()
          if (session.$worker) {
            session.$worker.on('annotate', handle)
            session.$worker.on('terminate', handle)
          }
        })

        // Tell parent
        this.$emit('ready', ace)
      },

      setValue (newValue) {
        if (!this.editor) {
          console.warn('Editor not ready')
          return
        }
        // https://stackoverflow.com/questions/18614169/set-value-for-ace-editor-without-selecting-the-whole-editor
        //      You can use the second parameter to control cursor position after setValue
        // editor.setValue(str, -1) // moves cursor to the start
        // editor.setValue(str, 1) // moves cursor to the end
        const firstUse = this.value === ''
        firstUse ? this.editor.setValue(newValue, -1) : this.editor.setValue(newValue)
      },

      onChange (e) {
        this.disableWatcher = true
        // Tell parent
        this.$emit('input', this.editor.getValue())

        this.$nextTick(() => {
          this.disableWatcher = false
        })
      }
    }
  }

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase())
  function createInjector (context) {
    return function (id, style) {
      return addStyle(id, style)
    }
  }
  var HEAD = document.head || document.getElementsByTagName('head')[0]
  var styles = {}

  function addStyle (id, css) {
    var group = isOldIE ? css.media || 'default' : id
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    })

    if (!style.ids.has(id)) {
      style.ids.add(id)
      var code = css.source

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */' // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */'
      }

      if (!style.element) {
        style.element = document.createElement('style')
        style.element.type = 'text/css'
        if (css.media) style.element.setAttribute('media', css.media)
        HEAD.appendChild(style.element)
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code)
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n')
      } else {
        var index = style.ids.size - 1
        var textNode = document.createTextNode(code)
        var nodes = style.element.childNodes
        if (nodes[index]) style.element.removeChild(nodes[index])
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]); else style.element.appendChild(textNode)
      }
    }
  }

  var browser = createInjector

  /* script */
  const __vue_script__$1 = script$1

  /* template */
  var __vue_render__$1 = function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      'div',
      {
        ref: 'editor',
        staticClass: 'aceeditor',
        style: 'height:' + _vm.height + 'px'
      },
      [_c('AceResolver', { on: { ready: _vm.ready } })],
      1
    )
  }
  var __vue_staticRenderFns__$1 = []
  __vue_render__$1._withStripped = true

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject('data-v-ec93aa02_0', { source: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* .aceeditor {\n  width: 100%;\n  display: flex;\n} */\n', map: { version: 3, sources: ['/Users/jelle/YellowDigital/Projects/vue-ace-edit/src/AceEditor.vue'], names: [], mappings: ';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAuIA;;;GAGA', file: 'AceEditor.vue', sourcesContent: ["<script>\nimport AceResolver from './AceResolver.vue'\n\nexport default {\n  components: {\n    AceResolver\n  },\n\n  props: {\n    value: { type: [Object, String], default: '' },\n    mode: {\n      type: String,\n      // https://github.com/ajaxorg/ace/tree/master/lib/ace/mode\n      default: 'javascript'\n    },\n    theme: {\n      type: String,\n      // https://github.com/ajaxorg/ace/tree/master/lib/ace/theme\n      default: 'twilight'\n    },\n    height: { type: Number, default: 100 },\n    options: {\n      type: Object,\n      default: () => ({\n      // selectionStyle: 'text',\n      // maxLines: 30,\n        wrap: true,\n        autoScrollEditorIntoView: true\n      })\n    }\n  },\n\n  data: vm => ({\n    disableWatcher: null\n  }),\n\n  mounted () {\n    // Watchers\n    this.$watch('value', newValue => {\n      if (this.disableWatcher) return\n\n      // console.log('Value change')\n      this.setValue(newValue)\n    })\n  },\n\n  methods: {\n    ready (ace) {\n      // const { ace } = window\n\n      const editor = ace.edit(this.$refs.editor, {\n      // mode: 'ace/mode/javascript',\n        mode: `ace/mode/${this.mode}`,\n        ...this.options\n      })\n\n      editor.setTheme(`ace/theme/${this.theme}`)\n\n      // Tell Vue\n      this.editor = editor\n\n      // Set initial value\n      this.setValue(this.value)\n\n      // Then add change handler\n      editor.on('change', this.onChange)\n      // editor.getSession().on('change', this.onChange)\n\n      // Based on https://stackoverflow.com/questions/9506154/determine-if-javascript-syntax-is-valid-in-change-handler-of-ace\n      editor.on('changeMode', () => {\n      // session.$worker is available when 'changeMode' event triggered\n      // You could subscribe worker events here, whatever changes to the\n      // content will trigger 'error' or 'ok' events.\n\n        // console.log('cool')\n        // editor.$worker.on('error', ko)\n        // editor.$worker.on('ok', ok)\n        const handle = (e) => {\n          const { data } = e\n          // console.log('update:annotations', e)\n\n          this.$emit('update:annotations', data)\n          this.$emit('update:valid', data.length === 0)\n        }\n\n        const session = editor.getSession()\n        if (session.$worker) {\n          session.$worker.on('annotate', handle)\n          session.$worker.on('terminate', handle)\n        }\n      })\n\n      // Tell parent\n      this.$emit('ready', ace)\n    },\n\n    setValue (newValue) {\n      if (!this.editor) {\n        console.warn('Editor not ready')\n        return\n      }\n      // https://stackoverflow.com/questions/18614169/set-value-for-ace-editor-without-selecting-the-whole-editor\n      //      You can use the second parameter to control cursor position after setValue\n      // editor.setValue(str, -1) // moves cursor to the start\n      // editor.setValue(str, 1) // moves cursor to the end\n      const firstUse = this.value === ''\n      firstUse ? this.editor.setValue(newValue, -1) : this.editor.setValue(newValue)\n    },\n\n    onChange (e) {\n      this.disableWatcher = true\n      // Tell parent\n      this.$emit('input', this.editor.getValue())\n\n      this.$nextTick(() => {\n        this.disableWatcher = false\n      })\n    }\n  }\n}\n</script>\n\n<template>\n  <div\n    ref=\"editor\"\n    class=\"aceeditor\"\n    :style=\"`height:${height}px`\"\n  >\n    <AceResolver\n      @ready=\"ready\"\n    />\n  </div>\n</template>\n\n<style>\n/* .aceeditor {\n  width: 100%;\n  display: flex;\n} */\n</style>\n"] }, media: undefined })
  }
  /* scoped */
  const __vue_scope_id__$1 = undefined
  /* module identifier */
  const __vue_module_identifier__$1 = undefined
  /* functional template */
  const __vue_is_functional_template__$1 = false
  /* style inject SSR */

  var AceEditor = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  )

  var script$2 = {
    props: {
      value: { type: [Object, Array], default: () => {} }
    },

    data: vm => ({
      valueStringified: '',
      disableInputEmit: null // Protect against loops
    }),

    watch: {

    },

    created () {
      this.format()

      // Detect incoming change
      this.$watch('value', (newValue) => {
        // Protect against loops
        if (this.disableInputEmit) {
          // console.log('disableInputEmit')
          return
        }

        // Detect change
        this.disableInputEmit = true
        // console.log('Change', newValue)
        this.format()
        this.$nextTick(function () {
          this.disableInputEmit = false
        })
      }, { deep: true })
    },

    methods: {
      onInput (newValue = '') {
        // Protect against loops
        if (this.disableInputEmit) {
          return
        }

        try {
          this.disableInputEmit = true
          const parsed = JSON.parse(newValue)
          // Tell parent
          this.$emit('input', parsed)
        } catch (err) {
          // Parse failed
          // console.warn(err)
          // Tell parent
          this.$emit('fail', err)
        }

        this.$nextTick(function () {
          this.disableInputEmit = false
        })
      },
      format () {
        this.valueStringified = JSON.stringify(this.value, null, 2)
      }
    }
  }

  /* script */
  const __vue_script__$2 = script$2

  /* template */
  var __vue_render__$2 = function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c('AceEditor', {
      ref: 'editor',
      attrs: { mode: 'json', value: _vm.valueStringified },
      on: { input: _vm.onInput }
    })
  }
  var __vue_staticRenderFns__$2 = []
  __vue_render__$2._withStripped = true

  /* style */
  const __vue_inject_styles__$2 = undefined
  /* scoped */
  const __vue_scope_id__$2 = undefined
  /* module identifier */
  const __vue_module_identifier__$2 = undefined
  /* functional template */
  const __vue_is_functional_template__$2 = false
  /* style inject */

  /* style inject SSR */

  var AceEditorJson = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  )

  function plugin (Vue, config = {}) {
    Vue.component('AceEditor', AceEditor)
    Vue.component('AceEditorJson', AceEditorJson)
  }

  // Install by default if using the script tag
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
  }

  exports.AceEditor = AceEditor
  exports.AceEditorJson = AceEditorJson
  exports.default = plugin

  Object.defineProperty(exports, '__esModule', { value: true })

  return exports
}({}))
