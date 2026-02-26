import { lazy } from 'react'

export const LazyShop = lazy(() => import('./Shop').then((module) => ({default: module.Shop})))