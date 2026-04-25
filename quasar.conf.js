/* eslint-env node */
/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-webpack/quasar-conf-js

const { configure } = require('quasar/wrappers');
const path = require('path');

module.exports = configure(function (ctx) {
  return {
    // https://v2.quasar.dev/quasar-cli-webpack/supporting-ts
    // supportTS: false,

    // https://v2.quasar.dev/quasar-cli-webpack/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-webpack/boot-files
    boot: [],

    // https://v2.quasar.dev/quasar-cli-webpack/css
    css: [
      'app.css'
    ],

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-conf-js#Property%3A-extras
    extras: [
      // 'ionicons-v4',
      'mdi-v7',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-conf-js#Property%3A-framework
    framework: {
      config: {
        notify: {
          position: 'top-right',
          timeout: 1800
        }
      },

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import QPage, QLayout, etc tags are used,
      // you must specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Plugins
      plugins: [
        'Notify',
        'Dark'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-webpack/developing-spa/handle-spa-fallback
    // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
    // because missing file feature in offline mode on webkit based browsers
    // can cause XHR/Fetch to return fallback responses.
    // Problem is that most auto history mode URLS will change frequently
    // so changed?FileName can break things.

    // configuration for quasar-cli
    // https://v2.quasar.dev/quasar-cli-webpack/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'
      // vueRouterBase: process.env.VUE_ROUTER_BASE,

      // transpile: false,
      // publicPath: '/',

      // The following example will only minify the js in the production build through chain
      // (the default minification is also enabled in dev)
      // minify: 'terser',
      // minify for production build
      minify: 'terser',

      // transpileDependencies: [],

      // Remove `orphaned CSS rules` from the final file sent to browser
      purgeCSS: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-webpack/quasar-conf-js#Property%3A-devServer
    devServer: {
      server: {
        type: 'http'
      },
      port: 9000,
      open: false // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-webpack/quasar-conf-js#Property%3A-framework
    // Leave this line in place for maximum backward compatibility with Quasar CLI
    // that relies on quasarConf being exported here
  }
});
