const { resolve } = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: resolve(__dirname, 'src/index.ts'),
  resolve: {
    extensions: ['.scss', '.sass', '.css', '.ejs', '.html', '.ts', '.js'],
  },
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
    pathinfo: false,
  },
  optimization: isDev
    ? {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
    : {
        minimizer: [
          new TerserPlugin({
            extractComments: 'all',
            terserOptions: {
              compress: {
                drop_console: true, // eslint-disable-line @typescript-eslint/camelcase
              },
            },
          }),
          new OptimizeCssAssetsPlugin(),
        ],
      },
  ...(isDev
    ? {
        devtool: 'eval-source-map',
        devServer: {
          hot: true,
          compress: true,
          overlay: true,
          port: parseInt(process.env.PORT, 10) || 8080,
        },
      }
    : {}),
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.s?[ac]ss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')(),
                require('autoprefixer')(),
                require('cssnano')({
                  preset: [
                    'advanced',
                    {
                      autoprefixer: false,
                    },
                  ],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      inject: 'head',
      template: '!!@piuccio/ejs-compiled-loader!./src/index.ejs',
      ...(isDev
        ? {
            showErrors: true,
          }
        : {
            minify: {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              sortAttributes: true,
              sortClassName: true,
              useShortDoctype: true,
              minifyCSS: true,
              minifyJS: true,
            },
          }),
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new CopyPlugin([
      {
        from: resolve(__dirname, 'src/assets'),
        to: '.',
      },
    ]),
  ],
};
