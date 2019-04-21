// using old importation method
// as webpack config cant use EM6
const path = require("path");
var nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");

console.log(path.resolve(__dirname, "src/server"));

module.exports = {
  entry: {
    server: "./src/server/server.ts"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
    publicPath: ""
  },
  target: "node",
  externals: [nodeExternals(), /src\/webapp/],
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false // and __filename return blank or /
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: [/src\/server/]
      }
    ]
  },
  plugins: []
};
