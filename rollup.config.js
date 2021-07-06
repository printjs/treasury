import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';

export default [{
  input: 'src/module.js',
  output: [{
    dir: 'public/dist2/1.js',
    format: 'iife'
  }, {
    dir: 'public/dist2/2.js',
    format: 'es'
  }],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      // plugins: [['@babel/plugin-syntax-jsx']]
    })
  ],
  preserveEntrySignatures: false
}, {
  input: 'src/index.js',
  // external: ['react', 'react-dom', 'dayjs'],
  output: {
    dir: 'public/dist',
    format: 'system',
    manualChunks(id) {
      console.log(id);
      // if (/node_modules\/react\//.test(id)) {
      //   return 'react-dom.bundle';
      // }
      // if (/node_modules\/react-dom\//.test(id)) {
      //   return 'react.bundle';
      // }
      if (/node_modules\/dayjs\//.test(id)) {
        return 'dayjs.bundle';
      }
    },
    // globals: {
    //   'react': 'React',
    //   'react-dom': 'ReactDOM',
    //   'dayjs': 'dayjs'
    // },
    sourcemap: true
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      // plugins: [['@babel/plugin-syntax-jsx']]
    }),
    nodeResolve({
      extensions: ['.js'],
      dedupe: ["react", "react-dom", "dayjs"]
    }),
    commonjs(),
  ],
  preserveEntrySignatures: false
}]
