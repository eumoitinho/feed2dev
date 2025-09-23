import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/widget.js',
    format: 'iife',
    name: 'Feed2Dev'
  },
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    postcss({
      inject: true,
      minimize: true
    }),
    terser({
      compress: {
        drop_console: process.env.NODE_ENV === 'production'
      }
    })
  ]
};