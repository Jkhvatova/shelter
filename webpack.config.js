let path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/js/index.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
    publicPath: "",
  },
  devServer: {
    static: "./src",
    open: true,
    liveReload: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            //plugins: ['@babel/plugin-transform-runtime']
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pets.html",
      inject: true,
      chunks: ["pets"],
      filename: "pets.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
  ],
};
