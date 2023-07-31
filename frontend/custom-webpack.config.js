/* export const module = {
  rules: [
    {
      test: /\.*pdfjs-dist.*$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}; */
var path = require('path');
module.exports = {
  entry: {
    main: ['babel-polyfill', './src/main.ts'],
  },
  module:{
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules(?!(\/|\\)pdfjs-dist)/,
            loader: 'babel-loader',
            options: {
                'presets': ['@babel/preset-env'],
                'plugins': ['@babel/plugin-proposal-optional-chaining']
            }
        }
    ]
  }
}