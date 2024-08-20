

export const elementService = {
  getElType,
  El,
  StyleEl,
  dataToCss,
  dataToCssElStr,
  makeEmHelperFunc,
  appendScriptEl,
  _: { // utils
  em: (val) => `${val / 16}em`,
  rem: (val) => `${val / 16}rem`
}
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
function El(htmlStr = '', attrs = {}, children = []) {
  htmlStr = htmlStr.trim();
  let parentType = 'div';
  const elType = getElType(htmlStr);
  if (elType === 'tr') parentType = 'table';
  else if (elType === 'td') parentType = 'tr';
  const parent = document.createElement(parentType);
  parent.innerHTML = htmlStr;
  const el = parent.firstChild;
  for (let atrName in attrs) el[atrName] = attrs[atrName];
  children.filter(Boolean).forEach(child => child && el.appendChild(child));
  return el;
}
// function StyleEl(selector = '', style = {}) {
//   return El(dataToCssElStr(selector, style));
// }
function dataToCssElStr(selector = '', style = {}, importantAll) {
  return StyleElWrapper(dataToCss(selector, style, importantAll));
}

function StyleEl(selector = '', style = {}, cssStr = '', importantAll) {
  return El(StyleElWrapper(dataToCss(selector, style, importantAll) + cssStr));
}
function StyleElWrapper(cssStr = '') {
  return `<style>${cssStr}</style>`;
}
function dataToCss(selector = '', style = {}, importantAll = false, tab = 0) {
  const tabStr = '\t'.repeat(tab);
  let styleStr = `${tabStr}${selector} {`;
  let nestedStyle = ''
  for (let key in style) {
      const val = style[key];
      key = _stringToLowerKabab(key);
      if (typeof val === 'object') {
          const isCssRule = key[0] === '@';
          if (!isCssRule) {
              const keys = key.split(',').map(c => c.trim()).filter(Boolean);
              const nestedSelector = keys.reduce((nestedSelectors, key) => {
                let currNestedSelector = selector;
                if (key[0] === '&') currNestedSelector += key.slice(1);
                else currNestedSelector += ` ${key}`;
                nestedSelectors.push(currNestedSelector);
                return nestedSelectors;
              }, []).filter(Boolean).join(', ');
              nestedStyle += dataToCss(nestedSelector, val, importantAll);
          } else {
              nestedStyle += `${key} {\n`;
              const rullType = key.split(' ')[0].split('@')[1];
              if (rullType === 'keyframes') for (let c in val) nestedStyle += dataToCss(c, val[c], importantAll);
              else nestedStyle += dataToCss(selector, val, importantAll, 1);
              nestedStyle += '}\n';
          }
      }
      else {
        const actualVal = importantAll && !val.includes('!important') ? `${val} !important` : val;
        styleStr += `\n${tabStr}\t${key}: ${actualVal};`;
      }
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
function makeEmHelperFunc(emUnit) {
  return (pxSize) => {
    if (isNaN(+pxSize)) pxSize = parseInt(pxSize)
    const persentOf16 = emUnit / 16;
    const pxVal = (pxSize * persentOf16) + 'px';
    const emVal = (pxSize / 16) + 'em';
    return emVal;
  }
}

function initStyleElIfNotExists(selector, el, ) {
  const existsEl = document.querySelector(selector);
  if (!existsEl) document.head.appendChild(el);
}


const scriptAppendsPrms = {}
function appendScriptEl(src) {
  const prmItem = scriptAppendsPrms[src];
  if (prmItem) {
    if (prmItem.status === 'pending') return prmItem.prm;
    if (prmItem.status === 'resolved') return Promise.resolve();
    // return Promise.reject(); // else if rejected => continue and retry;
  } else {
    scriptAppendsPrms[src] = {
      status: 'pending'
    }
  }
  scriptAppendsPrms[src].prm = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      scriptAppendsPrms[src].status = 'resolved';
      resolve();
    }
    script.onerror = () => {
      scriptAppendsPrms[src].status = 'rejected';
      reject();
    }
    script.onerror = reject;
    document.body.appendChild(script);
  });
  return scriptAppendsPrms[src].prm;
}
