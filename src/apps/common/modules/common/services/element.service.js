
export const elementService = {
  getElType,
  El,
  StyleEl,
  dataToCss,
  
}

function getElType(template) {
  if (template[0] === '<' && template[template.length-1] === '>') {
      if (template[1] === '/') {
          return template.split('/')[1].split(' ')[0].split('>')[0];
      } 
      else {
          return template.split('<')[1].split(' ')[0].split('>')[0].split('/')[0];
      }
  } else return;
}
function El(htmlStr = '', evs = {}, children = []) {
  let parentType = 'div';
  const elType = getElType(htmlStr);
  if (elType === 'tr') parentType = 'table';
  else if (elType === 'td') parentType = 'tr';
  const parent = document.createElement(parentType);
  parent.innerHTML = htmlStr;
  const el = parent.firstChild;
  for (let evName in evs) el[evName] = evs[evName];
  children.forEach(child => child && el.appendChild(child));
  return el;
}
function StyleEl(selector = '', style = {}) {
  return El(`<style>${dataToCss(selector, style)}</style>`)
}
function dataToCss(selector = '', style = {}, tab = 0) {
  const tabStr = '\t'.repeat(tab);
  let styleStr = `${tabStr}${selector} {`;
  let nestedStyle = ''
  for (let key in style) {
      const val = style[key];
      key = _stringToLowerKabab(key);
      if (typeof val === 'object') {
          const isCssRule = key[0] === '@';
          if (!isCssRule) {
              let nestedSelector = selector;
              if (key[0] === '&') nestedSelector += key.slice(1);
              else nestedSelector += ` ${key}`;
              nestedStyle += dataToCss(nestedSelector, val);
          } else {
              nestedStyle += `${key} {\n`;
              const rullType = key.split(' ')[0].split('@')[1];
              if (rullType === 'keyframes') for (let c in val) nestedStyle += dataToCss(c, val[c]);
              else nestedStyle += dataToCss(selector, val, 1);
              nestedStyle += '}\n';
          }
      }
      else styleStr += `\n${tabStr}\t${key}: ${val};`;
  }
  styleStr += `\n${tabStr}}\n`;
  styleStr += nestedStyle;
  return styleStr;
}
function _stringToLowerKabab(str) {
  const CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let fixedStr = '';
  for (let i = 0; i < str.length; i++) {
      let curr = str[i];
      let lowerCurr = curr.toLowerCase();
      if (CAPS.includes(curr)) {
          if (i === 0) fixedStr += lowerCurr;
          else if (str[i-1] && (str[i-1] !== ' ')) fixedStr += `-${lowerCurr}`;
      } else fixedStr += lowerCurr;
  }
  return fixedStr;
}
