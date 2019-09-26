const path = require('path');

module.exports = {
  entry: './frontend/src/index.js',
  output: {
    path: path.resolve(__dirname, './frontend/static/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.js$/, use: 'babel-loader'},
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
