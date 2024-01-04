import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'mycomponents',
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ]
  }
};