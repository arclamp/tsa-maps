import path from 'path';
import HtmlPlugin from 'html-webpack-plugin';

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index.js'
  },
  plugins: [
    new HtmlPlugin({
      title: 'TSA Maps',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/env'
            ]
          }
        }
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader'
        }
      }
    ]
  }
};
