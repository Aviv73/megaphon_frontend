
import { elementService } from './element.service.js';


// const stylingTheme = {
//   name: '',
//   class: '', // css class
//   colors: [],
//   fonts: [],
//   css: '' // css code as string;,
// }


export function setStylingForOrgTheme(org, selector, isClient = false) {
  const theme = getRelevantThemeForOrg(org, isClient);
  return setDynamicStylingThemeEl({...theme, title: org.name}, selector);
}

export function getRelevantThemeForOrg(org, isClient, selector) {
  let themeItem = isClient ? org?.designPreferences?.clientApp?.[0] : org?.designPreferences?.producerApp?.[0];
  if (themeItem) {
    themeItem = {
      ...themeItem,
      title: `Megaphon - ${org?.name}`,
      // css: `${selector} {}`
    };
  }
  return themeItem;
}


var SelectedhTeme = null;
export function getSelectedTheme() {
  return SelectedhTeme;
}

// var lastCssEl = null;\
const STYLE_EL_CLASSNAME = 'theme-styling-element';
export function setDynamicStylingThemeEl(stylingTheme = {}, selector) {
  SelectedhTeme = stylingTheme;
  const lastCssEl = document.head.querySelector('.'+STYLE_EL_CLASSNAME)
  if (lastCssEl) document.head.removeChild(lastCssEl);
  if (stylingTheme.title) document.title = stylingTheme.title;
  console.log(stylingTheme);
  const colors = stylingTheme?.colors || [];
  const fonts = stylingTheme?.fonts || [];
  const _ig = ':not(.ignore-theme-style)';
  const cssEl = elementService.StyleEl(selector, {
    ...fonts.reduce((acc, c, idx) => ({
      [`--font-${idx}`]: fonts[idx]
    }), {}),
    ...colors.reduce((acc, c, idx) => ({
      ...acc,
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
  cssEl.classList.add(STYLE_EL_CLASSNAME);
  document.head.appendChild(cssEl);
  // lastCssEl = cssEl;
  return cssEl;
}