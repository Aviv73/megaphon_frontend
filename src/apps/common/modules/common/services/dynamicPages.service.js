
import { elementService } from './element.service.js';


// const stylingTheme = {
//   name: '',
//   class: '', // css class
//   colors: [],
//   fonts: [],
//   css: '' // css code as string;,
// }

export function setStylingForOrgTheme(org, selector) {
  return setDynamicStylingThemeEl({...org.designPreferences, title: org.name}, selector);
}

var lastCssEl = null;
export function setDynamicStylingThemeEl(stylingTheme = {}, selector) {
  if (lastCssEl) document.head.removeChild(lastCssEl);
  document.title = stylingTheme.title;
  const colors = stylingTheme?.colors || [];
  const fonts = stylingTheme?.fonts || [];
  const _ig = ':not(.ignore-theme-style)';
  const cssEl = elementService.StyleEl(selector, {
    ...fonts.reduce((acc, c, idx) => ({
      [`--font-${idx}`]: fonts[idx]
    }), {}),
    ...colors.reduce((acc, c, idx) => ({
      [`--clr-${idx}`]: c,
      [`.clr-${idx}`]: {
        color: c
      },
      [`.bg-${idx}`]: {
        backgroundColor: c
      },
      [`.border-clr-${idx}`]: {
        'border-color': c
      },
    }), {}),
    '--main-color': colors[0],
    '--main-bgc': colors[1],
    '--header-color': colors[2],
    '--header-bgc': colors[3],
    '--heading-color': colors[4],
    [`.app-main${_ig}`]: {
      color: colors[0] || 'black',
      backgroundColor: colors[1] || 'white'
    },
    [`.app-header${_ig}, .app-footer${_ig}`]: {
      color: colors[2] || 'white',
      backgroundColor: colors[3] || 'black'
    },
    [`h1${_ig}, h2${_ig}, h3${_ig}, h4${_ig}, h5${_ig}, h6${_ig}`]: {
      color: colors[4] || 'black',
    }
  }, stylingTheme.css);
  document.head.appendChild(cssEl);
  lastCssEl = cssEl;
  return cssEl;
}