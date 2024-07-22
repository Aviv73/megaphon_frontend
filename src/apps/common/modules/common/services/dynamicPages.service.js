
import { elementService } from './element.service.js';


export function setDynamicStylingEl(org, selector) {
  document.title = org.name;
  const designPreferences = org.designPreferences;
  const colorsPalate = designPreferences?.colorsPalate || [];
  const cssEl = elementService.StyleEl(selector, {
    '.app-main': {
      color: colorsPalate[0] || 'black',
      backgroundColor: colorsPalate[1] || 'white'
    },
    '.app-header, .app-footer': {
      color: colorsPalate[2] || 'white',
      backgroundColor: colorsPalate[3] || 'black'
    },
    'h1, h2, h3, h4, h5, h6': {
      color: colorsPalate[4] || 'black',
    }
  });
  document.head.appendChild(cssEl);
} 