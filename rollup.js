const rollup = require('rollup');
const babel = require('@rollup/plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const http = require('http');
const fs = require('fs');
const path = require('path');
const json = require('@rollup/plugin-json');

const output2 = [{
  dir: 'public/dist2/iife',
  format: 'iife'
}, {
  dir: 'public/dist2/es',
  format: 'es'
}];

const inputOptions1 = {
  input: 'src/module.js',
  output: output2
};

// see below for details on the options
const inputOptions = {
  input: 'src/index.js',
  plugins: [
    babel.default({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      // plugins: [['@babel/plugin-syntax-jsx']]
    }),
    commonjs(),
    nodeResolve.default({
      extensions: ['.js'],
      dedupe: ["react", "react-dom", "dayjs"]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ]
};
const outputOptions = {
  dir: 'public/dist',
  format: 'system',
  manualChunks(id) {
    if (/node_modules\/react\//.test(id)) {
      return 'react-dom.bundle';
    }
    if (/node_modules\/react-dom\//.test(id)) {
      return 'react.bundle';
    }
    if (/node_modules\/dayjs\//.test(id)) {
      return 'dayjs.bundle';
    }
  },
  sourcemap: true
};

let testOutputOption;

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions1);

  console.log(bundle.watchFiles); // an array of file names this bundle depends on

  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  for (const o of output2) {
    const { output } = await bundle.generate(o);
    console.log(output);
  }
  return;

  testOutputOption = output;

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === 'asset') {
      // For assets, this contains
      // {
      //   fileName: string,              // the asset file name
      //   source: string | Uint8Array    // the asset source
      //   type: 'asset'                  // signifies that this is an asset
      // }
      // console.log('Asset', chunkOrAsset);
    } else {
      // For chunks, this contains
      // {
      //   code: string,                  // the generated JS code
      //   dynamicImports: string[],      // external modules imported dynamically by the chunk
      //   exports: string[],             // exported variable names
      //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
      //   fileName: string,              // the chunk file name
      //   implicitlyLoadedBefore: string[]; // entries that should only be loaded after this chunk
      //   imports: string[],             // external modules imported statically by the chunk
      //   importedBindings: {[imported: string]: string[]} // imported bindings per dependency
      //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
      //   isEntry: boolean,              // is this chunk a static entry point
      //   isImplicitEntry: boolean,      // should this chunk only be loaded after other chunks
      //   map: string | null,            // sourcemaps if present
      //   modules: {                     // information about the modules in this chunk
      //     [id: string]: {
      //       renderedExports: string[]; // exported variable names that were included
      //       removedExports: string[];  // exported variable names that were removed
      //       renderedLength: number;    // the length of the remaining code in this module
      //       originalLength: number;    // the original length of the code in this module
      //       code: string | null;       // remaining code in this module
      //     };
      //   },
      //   name: string                   // the name of this chunk as used in naming patterns
      //   referencedFiles: string[]      // files referenced via import.meta.ROLLUP_FILE_URL_<id>
      //   type: 'chunk',                 // signifies that this is a chunk
      // }
      // console.log('Chunk', chunkOrAsset.modules);
      // console.log('Chunk');
      // console.dir(chunkOrAsset.code);
      console.dir(chunkOrAsset);
      // console.dir(chunkOrAsset.modules);
    }
  }

  // // or write the bundle to disk
  // // await bundle.write(outputOptions);

  // // closes the bundle
  // await bundle.close();
}

build();

// http.createServer((req, res) => {
//   console.log(req.url);
//   if (req.url === '/') {
//     fs.stat(`${process.cwd()}/public/index.html`, (err, stat) => {
//       if (err || !stat.isFile()) {
//         res.writeHead(404, { 'Content-Type': 'text/html' });
//         res.end();
//         return;
//       }
//       fs.readFile(`${process.cwd()}/public/index.html`, (err, data) => {
//         if (err) {
//           res.write(err);
//         } else {
//           res.write(data.toString());
//         }
//         res.end();
//       });
//     });
//     return;
//   }
//   fs.stat(path.join(process.cwd(), 'public', req.url), (err, stat) => {
//     if (err) {
//       // res.write('123123');
//       // res.end();
//       for (const chunkOrAsset of testOutputOption) {
//         if (chunkOrAsset.type === 'asset') {
//           // For assets, this contains
//           // {
//           //   fileName: string,              // the asset file name
//           //   source: string | Uint8Array    // the asset source
//           //   type: 'asset'                  // signifies that this is an asset
//           // }
//           console.log('Asset', chunkOrAsset);
//         } else {
//           if (req.url.indexOf(chunkOrAsset.fileName) > -1) {
//             res.write(chunkOrAsset.code);
//             res.end();
//             return;
//           }
//         }
//       }
//       console.log(path.join(process.cwd(), 'public', '404.html'));
//       fs.readFile(path.join(process.cwd(), 'public', '404.html'), (err, data) => {
//         res.write(data.toString());
//         res.end();
//       })
//       return;
//     }
//     fs.readFile(path.join(process.cwd(), 'public', req.url), (err, data) => {
//       console.log('1');
//       if (err) {
//         res.write(err);
//       } else {
//         res.write(data.toString());
//       }
//       res.end();
//     });
//   })
//   // res.writeHead(200, { 'Content-Type': 'application/json' });

// }).listen(3000);