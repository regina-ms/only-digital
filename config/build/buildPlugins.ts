import webpack, {Configuration} from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BuildOptions } from './types/types'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import path from 'node:path'
import CopyPlugin from 'copy-webpack-plugin'


export function buildPlugins({mode, paths, analyzer}: BuildOptions): Configuration['plugins'] {

    const isDev = mode === 'development'
    const isProd = mode === 'production'

    const plugins:Configuration['plugins'] = [
        new HtmlWebpackPlugin({ template: paths.html, templateParameters: {
                viewport: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' }})
    ]

    if(isDev) {
        plugins.push(new webpack.ProgressPlugin())

        /** Выносит проверку типов в отдельный процесс: не нагружает сборку */
        plugins.push(new ForkTsCheckerWebpackPlugin())

        plugins.push(new ReactRefreshPlugin())
    }

    if(isProd) {
        plugins.push(new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].css',
        }))
        plugins.push(new CopyPlugin({
            patterns: [
                { from: path.resolve(paths.public, 'locales'), to: path.resolve(paths.output, 'locales') },
            ],
        }))
    }

    if(analyzer) plugins.push(new BundleAnalyzerPlugin())

    return plugins
}