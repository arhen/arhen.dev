const purgecss = require('@fullhuman/postcss-purgecss').default;
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    purgecss({
      content: ['themes/cactus-plus/layouts/**/*.html', 'layouts/**/*.html'],
      safelist: [
        'highlight',
        'language-bash',
        'pre',
        'code',
        'content',
        'h3',
        'h4',
        'ul',
        'li',
        /^image_placeholder$/,
        /^placeholder$/,
        /^loaded$/,
        /\.placeholder img\.loaded/,
      ],
    }),
    autoprefixer(),
  ]
};
