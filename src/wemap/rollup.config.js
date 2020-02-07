import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';

export default {
    input: 'src/test.js',
    output: [
        {
            name: 'wemap',
            file: 'dist/wemap.js',
            format: 'umd',
            sourcemap: 'inline',
            indent: false,
        },
        {
            // Build for browsers
            name: 'wemap',
            file: 'dist/wemap.min.js',
            format: 'iife',
        },
        {
            // Build for ES module environments.
            name: 'wemap',
            file: 'dist/wemap.esm.js',
            format: 'es',
        },
        {
            // Build for Node.js and browsers.
            name: 'wemap',
            file: 'dist/wemap.umd.js',
            format: 'umd',
        },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        terser()
    ],
};
