const handlebarsPlugin = require('esbuild-plugin-handlebars');
const copyPlugin = require('esbuild-plugin-copy').default;

module.exports = {
  entryPoints: ['backend/src/app.ts'],
  bundle: false,
  platform: 'node',
  format: 'cjs',
  outdir: 'dist/backend',
  plugins: [
    handlebarsPlugin(),
    copyPlugin({
      resolveFrom: 'cwd',
      assets: {
        from: ['backend/src/**/*.handlebars'],
        to: ['dist/backend/backend/src'],
      },
    }),
  ],
  loader: { '.ts': 'ts' },
  sourcemap: true,
  outExtension: {
    '.js': '.js',
  },
};
