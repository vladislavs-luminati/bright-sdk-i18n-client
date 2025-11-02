import path from 'path';
import { fileURLToPath } from 'url';

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // Bundle the public facade so the UMD build exposes the bootstrap + loader
  // behavior (src/index.js imports the browser loader and dynamically
  // imports ./i18n.js). This ensures the packaged bundle works with the
  // demo which calls I18n.init({ loader: ... }).
  entry: './src/index.js',
  output: {
    filename: 'brightsdk-i18n.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'BrightSdkI18n',
    libraryTarget: 'umd', // Universal support for CommonJS, AMD, and global
    libraryExport: 'default', // remove default wrapper
    globalObject: 'this',
    environment: {
      arrowFunction: false,
      const: false,
      destructuring: false,
    },
  },
  resolve: {
    fullySpecified: false,
  },
};
