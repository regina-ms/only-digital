import {lazy} from "react";

export const LazyAbout = lazy(() => import('./About').then((module) => ({default: module.About})))