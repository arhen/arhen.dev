const purgecss = require('@fullhuman/postcss-purgecss').default;
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    purgecss({
      content: ['themes/cactus-plus/layouts/**/*.html', 'layouts/**/*.html'],
      safelist: [
        'highlight',
        'language-bash',
        'language-markdown',
        'language-javascript',
        'language-typescript',
        'language-python',
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
        /^token/,
        /^prism/,
      ],
    }),
    autoprefixer(),
  ]
};
