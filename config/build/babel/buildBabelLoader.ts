import { BuildOptions } from '../types/types'
import { removeDataTestIdBabelPlugin } from './removeDataTestIdBabelPlugin'
import { PluginItem } from '@babel/core'

export function buildBabelLoader({mode}:BuildOptions) {
    const isDev = mode === 'development'
    const isProd = mode === 'production'

    const plugins:PluginItem[] = []

    if(isProd) {
        plugins.push( [
            removeDataTestIdBabelPlugin,
            {
                props: ['data-testid']
            }
        ])
    }

    return {
        test:  /\.tsx?$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            /** Опции можно вынести в отдельный файл babel.config.json, если babel необходим, например для Jest */
            options: {
                "presets": [
                    "@babel/preset-env",
                    "@babel/preset-typescript",
                    [
                        "@babel/preset-react",
                        {
                            "runtime":isDev ? 'automatic': 'classic'
                        }
                    ],
                ],
                plugins: plugins.length ? plugins :undefined,
            }
        }
    }
}