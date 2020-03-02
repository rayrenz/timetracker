const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './frontend/src/index.js'],
  output: {
    path: path.resolve(__dirname, './frontend/static/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          }
        }
      },
      {test: /\.(css|scss)$/, use: ['style-loader', 'css-loader', 'sass-loader']},
      {test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: 'static/'
          }
        }
      }
    ]
  },
  mode: 'development',
  watch: true,
};
