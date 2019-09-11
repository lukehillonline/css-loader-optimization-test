const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (env, argv) => {
    /**
     * Determine if is production mode from the command executed
     */
    const isProduction = argv.mode === 'production';

    /**
     * Common paths
     */
    const paths = {
        src: 'src',
        dev: 'public',
        prod: 'dist'
    };

    /**
     * Generate the settings for webpack depending on if it is
     * development or production mode.
     */
    const settings = {
        mode: isProduction ? 'production' : 'development',
        outputDir: isProduction ? paths.prod : paths.dev,
        fractal: {
            mode: isProduction ? 'build' : 'server',
            sync: isProduction ? false : true
        }
    };

    return {
        // Mode is set by --mode property in command
        mode: settings.mode,

        entry: {
            website: path.resolve(__dirname, `./${paths.src}/scss/styles.scss`),
        },

        output: {
            path: path.resolve(__dirname, `./${settings.outputDir}`),
        },

        module: {
            rules: [
                {
                    test: /\.(scss|sass)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    require('postcss-preset-env')({
                                        autoprefixer: {
                                            flexbox: 'no-2009'
                                        },
                                        stage: 3
                                    }),
                                    require('autoprefixer')()
                                ],
                                sourceMap: true,
                                minimize: false
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                minimize: false
                            }
                        }
                    ]
                }
            ]
        },

        plugins: [
            new FixStyleOnlyEntriesPlugin(),
            new MiniCssExtractPlugin({
                filename: 'style/[name].css',
                chunkFilename: 'style/[name].chunk.css'
            })
        ],

        optimization: {
            minimize: false
        },

        /**
         * Generates source maps
         */
        devtool: 'source-maps'
    };
};
