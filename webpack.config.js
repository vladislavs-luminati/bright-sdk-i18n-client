import path from 'path';
import { fileURLToPath } from 'url';

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/i18n.js',
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
