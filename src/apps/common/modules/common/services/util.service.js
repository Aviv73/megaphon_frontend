'use strict';

export const Utils = {
    getQuerysStr,
    storeToSession,
    loadFromSession,
    storeToStorage,
    loadFromStorage,
    getRandomId,
    getRandomInt,
    copy,
    getRandomColor,
    stringToLowerKabab,
    getStyleStr,
    deepSearch,
    getElPosOnScreen,
    createBoard
};


///////////////EXPORTED_FUNCTIONS///////////////
///////////////EXPORTED_FUNCTIONS///////////////
///////////////EXPORTED_FUNCTIONS///////////////


export function getQuerysStr(filterBy = {}) {
    var queryStr = '';
    const vals = [];
    for (let key in filterBy) {
        let val = (typeof(filterBy[key]) === 'object')? 
                            JSON.stringify(filterBy[key]) : 
                            filterBy[key];
        // queryStr += `${key}=${val}&`;
        vals.push(`${key}=${val}`);
    }
    // return queryStr.slice(0, queryStr.length-1);
    queryStr = vals.join('&');
    return queryStr;
} 

export function getQuerysStr2(criteria = {}) {
    var queryStr = '?';
    var criteriaJson = JSON.stringify(criteria);
    queryStr += criteriaJson.substring(2, criteriaJson.length-2);
    queryStr = queryStr.split('":"').join('=')
                       .split('","').join('&');
    return queryStr;
} 

export function getRandomId(s = '-') {
    var pt1 = Date.now().toString(16);
    var pt2 = getRandomInt(1000, 9999).toString(16);
    var pt3 = getRandomInt(1000, 9999).toString(16);
    return `ID${s}${pt3}${s}${pt1}${s}${pt2}`.toUpperCase();
}

export function getRandomInt(num1, num2, inclusive = false) {
    var max = (num1 >= num2)? num1 : num2;
    if (inclusive) max += 1;
    var min = (num1 <= num2)? num1 : num2;
    return (Math.floor(Math.random()*(max - min)) + min);
}

export const randItem = (arr, start = 0, end = arr.length) => arr[getRandomInt(start, end)];

export function copy(obj, hard = false) {
    if (hard) return JSON.parse(JSON.stringify(obj));
    if (typeof(obj) !== 'object') return obj;
    if (!obj) return obj;
    var copied = (Array.isArray(obj))? [...obj] : {...obj};
    var keys = Object.keys(obj);
    for (let key of keys) {
        if (!isNaN(+key)) key = +key;
        if (copied[key] instanceof HTMLElement) continue;
        copied[key] = copy(copied[key]);
    }
    return copied;
}

export function watchOnObj(obj, cbFunc, basePath = '') {
    if (!obj || typeof(obj) !== 'object') return;
    let keys = Object.keys(obj);
    for (let key of keys) {
        let isCall = false;
        let path = basePath;
        path += path.length ? `.${key}` : key;
        let initialVal = obj[key];
        let fuildName = key;
        Object.defineProperty(obj, key, {
            set: function(val) {
                let oldVal = key;
                key = val;
                if (isCall) cbFunc(val, oldVal, path);
            },
            get: function() {
                return key;
            }
        });
        obj[fuildName] = initialVal;
        isCall = true;
        if (typeof(obj[fuildName]) === 'object' && !Array.isArray(obj[fuildName]) && obj[fuildName]) watchOnObj(obj[fuildName], cbFunc, path);
    }
}

export function range(length, startFrom = 0) {
    var arrToReturn = [];
    for (let i = startFrom; i < length; i++) {
        arrToReturn.push(i);
    }
    return arrToReturn;
}

export function getRandomColor(isOpacity) {
    const options = '0123456789ABCDEF';
    const length = isOpacity ? 8 : 6;
    var color = '#';
    for (let i = 0; i < length; i++) color += options[getRandomInt(0, options.length-1)];
    return color;
}

export function stringToLowerKabab(str) {
    const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let fixedStr = '';
    for (let i = 0; i < str.length; i++) {
        let curr = str[i];
        let lowerCurr = curr.toLowerCase();
        if (capitals.includes(curr)) {
            if (i === 0) fixedStr += lowerCurr;
            else if (str[i-1] && (str[i-1] !== ' ')) fixedStr += `-${lowerCurr}`;
        } else fixedStr += lowerCurr;
    }
    return fixedStr;
}

//input: 'someKababValString' || output: some-kabab-val-string;
/**@param {String} str * @param {String} separator * @param {Boolean} isLowerCase */
export function strKababToSeperator(str, separator = '-', isLowerCase = true) {
    const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let fixedStr = '';
    for (let i = 0; i < str.length; i++) {
        let curr = str[i];
        let fixedCharr = isLowerCase ? curr.toLowerCase() : curr;
        if (capitals.includes(curr)) {
            if (i === 0) fixedStr += fixedCharr;
            else if (str[i - 1] && (str[i - 1] !== ' ')) fixedStr += `${separator}${fixedCharr}`;
        } else fixedStr += fixedCharr;
    }
    return fixedStr;
}

function strSeperatorToCamel(str = '', seperator = '-') {
    let res = '';
    for (let i = 0; i < str.length; i++) {
        if (str.slice(i, i+seperator.length) === seperator) {
            let nextChar = str.charAt(i+seperator.length);
            res += nextChar.toUpperCase();
            i += seperator.length;
        } else {
            res += str.charAt(i).toLowerCase();
        }
    }
    return res;
}

export function getStyleStr(style = {}) {
    var str = '';
    for (let key in style) {
        str += `${stringToLowerKabab(key)}:${style[key]};`;
    }
    return str;
} 


/**@param {*} val * @param {*} searchVal * @param {Boolean} isIgnoreCase * @param {Boolean} isIncluded*/
export function deepSearch(val, searchVal, isIgnoreCase = true, isIncluded = true) {
    if (val === searchVal) return true;
    if (typeof(val) === 'object') {
        for (let key in val) {
            let curr = val[key];
            if (curr === searchVal) return true;
            else if (typeof(curr) === 'string' && typeof(searchVal) === 'string') {
                if (isIgnoreCase) {
                    let lowerSearchVal = searchVal.toLowerCase();
                    if (isIncluded && curr.toLowerCase().includes(lowerSearchVal)) return true;
                    else if (!isIncluded && curr.toLowerCase() === lowerSearchVal) return true;
                }
                else if (isIncluded && curr.includes(searchVal)) return true;
            }
            else if (deepSearch(curr, searchVal, isIgnoreCase)) return true;
        }
    }
    return false;
}

export function createBoard(height = 30, width = 30, createCell = (pos) => `${pos.i}-${pos.j}`) {
    var board = [];
    for (let i = 0; i < height; i++) {
        board[i] = [];
        for (let j = 0; j < width; j++) {
            board[i][j] = createCell({i,j});
        }
    }
    return board;
}

export function padNum(num, length = 2) {
    var numStr = num.toString();
    if (numStr.length >= length) return numStr;
    return '0'.repeat(length-numStr.length) + numStr;
}

export function mapArrBy(arr, byField = 'id') {
    const map = {};
    for (let i = 0; i < arr.length; i++) {
        const curr = arr[i];
        const key = curr[byField];
        map[key] = arr[i];
    }
    return map;
}


//input: ({adress: {city: Jerusalem}}, 'adress.city') || output: 'jerusalem';
/**@param {Object} obj * @param {String} field */
export function getDeepVal(obj, field = '') {
    const splited = field.split('.').filter(_ => _.length);
    let val = obj;
    for (const curr of splited) {
    //   if (!val[curr]) {
      if (!(curr in val)) {
        val = undefined;
        break;
      } else val = val[curr];
    }
    return val;
}

export function setDeepVal(obj, field, val, seperator = '.') {
    const splited = field.split(seperator);
    const firstField = splited.shift();
    if (splited.length) {
        if (!obj[firstField]) obj[firstField] = {};
        setDeepVal(obj[firstField], splited.join(seperator), val, seperator);
    }
    else obj[firstField] = val;
}


export function copyToClipBoard(val) {
    const el = document.createElement('textarea');
    el.value = val;
    document.body.appendChild(el)
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}


export function getElPosOnScreen(el) {
    const pos = {y: 0, x: 0};
    if (!el) return pos;
    let _el = el;
    while(_el.tagName !== 'BODY') {
      pos.y += _el.offsetTop;
      pos.x += _el.offsetLeft;
      _el = _el.offsetParent;
    }
    return pos;
}
export function getElPosInParent(el, parentSelector = 'body') {
    const pos = {y: 0, x: 0};
    if (!el) return pos;

    const parent = parentSelector instanceof HTMLElement? parentSelector : document.querySelector(parentSelector);
    const clientRect = el.getBoundingClientRect();
    const parentClientRect = parent.getBoundingClientRect();

    pos.y = clientRect.top - parentClientRect.top;
    pos.x = clientRect.left - parentClientRect.left;

    return pos;
}


export function sortEverything(sorter = '', isSortUp = true) {
    const sorDirection = isSortUp ? 1 : -1;
    return (item1, item2) => {
        let val1 = getDeepVal(item1, sorter);
        let val2 = getDeepVal(item2, sorter);
        if (!isNaN(+new Date(val1))) {
            val1 = new Date(val1);
            val2 = new Date(val2);
        } else if (!isNaN(+val1)) {
            val1 = +val1;
            val2 = +val2;
        }
        if (typeof val1 === 'number') return isSortUp? val1 - val2 : val2 - val1; 
        else return (val1 > val2) ? 1 * sorDirection : -1 * sorDirection;
    }
}


function everythingToCamelCase(str, sep = '-', isCapitalCase = false) {
    const capitalCase = str.split(sep)
            .map(curr => curr.charAt(0).toUpperCase() + curr.slice(1).toLowerCase())
            .join('');
            
    return isCapitalCase
        ? capitalCase 
        : capitalCase.charAt(0).toLowerCase() + capitalCase.slice(1);
}

export const avgFromItems = (items = [], deepField = '') => {
    if (deepField) items = items.map(c => getDeepVal(c, deepField));
    return items.reduce((acc, curr) => acc + curr, 0) / items.length;
}


export function deepIterateWithObj(obj, cb, seperator = '.', rootKey = '') {
    for (let key in obj) {
      let val = obj[key];
      const deepKey = rootKey? `${rootKey}${seperator}${key}` : key;
      if (typeof val === 'object') deepIterateWithObj(val, cb, seperator, deepKey);
      else cb(deepKey, val);
    }
}

export function deepParseObject(obj) {
    const res = {};
    deepIterateWithObj(obj, (key, val) => {
        res[key] = val;
    }, '_');
    return res;
}

export function delay(timeMs = 2000) {
    return new Promise((resolve => {
        setTimeout(resolve, timeMs);
    }));
}


export function getCreateErrMsg(fileName) {
  return (msg, funcName, err = '') => `${msg} | at: ${fileName} file, function: ${funcName} | err: ${err.message || err.msg || 'unknown'}`;
}

export function createFriendlyError(err = '', status = 500,  message = '') {
  const error = err.err || err.error || err.message || err.msg || err;
  return {
    err: error,
    status,
    message: message || error,
  }
}

export function getOriginsInAllProtocols(...origins) {
  const protocols = ['http', 'https', 'ws', 'wss'];
  return origins.reduce((acc, c) => {
    return [...acc, ...protocols.reduce((_acc, protocol) => {
        return [..._acc, `${protocol}://127.0.0.1:${c}`, `${protocol}://localhost:${c}`];
      }, [])
  ]}, []);
}

export function fixDeepQuery(quer) {
  const fixed = {};
  for (let key in quer) fixed[key] = JSON.parse(quer[key]);
  return fixed;
}

export function noop() {}; 
  
export function htmlStrToText(htmlStr) {
    const el = document.createElement('div');
    el.innerHTML = htmlStr;
    return el.innerText;
}




export async function parseImgFile(file) { // ev.target.files[0]
    function _getFileBase64Img(file) { // ev.target.files[0]
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
            resolve(reader.result);
            };
            reader.onerror = function (error) {
            reject(error);
            };
        })
    }
    const base64 = await _getFileBase64Img(file)
    return {
      name: file.name,
      src: base64
    }
  }


  
export function splitDataToPages(data = [], perPage = 100) {
    const pagesCount = data.length / perPage;
    const pages = [];
    for (let i = 0; i <= pagesCount; i++) {
      pages[i] = data.slice(perPage*i, perPage*(i+1));
      if (!pages[i].length) {
        delete pages[i];
        break;
      }
    }
    if (pages.reduce((acc, c) => [...acc, ...c], []).length !== data.length) console.log('MISSING ITEMS!!!!');
    return pages.filter(Boolean);
}



export const doItOnce = ((cb)=> {
    let didIt = false;
    return (...params) => {
        if (didIt) return;
        didIt = true;
        cb(...params);
    }
});



export async function downloadImg(url, fileName) {
    const elLink = document.createElement('a');
    const dataUrl = await imgSrcToDataUrl(url);
    elLink.href = dataUrl;
    elLink.download = fileName + '.jpg';
    elLink.target = "_blank";
    document.body.appendChild(elLink);
    elLink.click();
    document.body.removeChild(elLink);
}
export function imgSrcToDataUrl(url) {
    return new Promise((resolve, reject) => {
        const imgEl = new Image();
        imgEl.crossOrigin = 'anonymous';
        imgEl.src = url;
        imgEl.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = imgEl.naturalHeight;
            canvas.width = imgEl.naturalWidth;
            ctx.drawImage(imgEl, 0, 0);
            const dataUrl = canvas.toDataURL();
            resolve(dataUrl);
        } catch(e) {
            reject(e);
        }
        }
        imgEl.onerror = function(e) {
            reject(e);
        }
    });
}


export function getQueryParam(param) {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
}

export function cropText(txt = '', maxLength = 100, afterTxt = '...') {
    if (txt.length <= maxLength) return txt;
    return `${txt.substring(0, maxLength)}${afterTxt}`
}
  
export function scrollToEl(toSelector, diff = 0, scrollInElSelector = 'body') {
    const targetEl = document.querySelector(toSelector);
    if (!targetEl) return;
    const pos = getElPosInParent(targetEl, scrollInElSelector);
    // const scrollEl = document.querySelector(scrollInElSelector);
    window.scrollTo(0, pos.y + diff);
  }


//////////////////STORAGE_SERVICE////////////////////
//////////////////STORAGE_SERVICE////////////////////
//////////////////STORAGE_SERVICE////////////////////

export function storeToSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value || null));
}
export function loadFromSession(key) {
    var data = sessionStorage.getItem(key);
    return (data) ? JSON.parse(data) : undefined;
}


export function storeToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value)|| null);
}
export function loadFromStorage(key) {
    let data = localStorage.getItem(key);
    return (data) ? JSON.parse(data) : undefined;
}

///////////////PROTOTYPES///////////////
///////////////PROTOTYPES///////////////
///////////////PROTOTYPES///////////////

export function setPrototypes() {
    Array.prototype.random = function(startIdx = 0, endIdx = this.length-1) {
        return this[getRandomInt(startIdx, endIdx)]
    }
    Array.prototype.shuffle = function() {
        var copy = this.slice();
        var shuffled = [];
        for (let i = 0; i < this.length; i++) {
            shuffled.push(copy.splice(getRandomInt(0, copy.length-1), 1)[0]);
        }
        return shuffled;
    }

    String.prototype.random = function(startIdx = 0, endIdx = this.length-1) {
        return this[getRandomInt(startIdx, endIdx)]
    }
    String.prototype.shuffle = function() {
        var copy = this.split('');
        var shuffled = [];
        for (let i = 0; i < this.length; i++) {
            shuffled.push(copy.splice(getRandomInt(0, copy.length-1), 1)[0]);
        }
        return shuffled.join('');
    }
    String.prototype.multiReplace = function(searchValue, replaceValue) {
        replaceValue += '';
        var str = this;
        var counter = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === searchValue[counter]) counter++;
            else counter = 0;
            if (counter === searchValue.length) {
                str = str.substring(0, i-counter+1)+replaceValue+str.substring(i+1);
                counter = 0;
                i -= (searchValue.length-replaceValue.length);
            }
        }
        return str;
    }
    JSON.require = require;
}

function require(path, isAsync = false) {
    var XmlReq = new XMLHttpRequest();
    XmlReq.overrideMimeType('application/json');
    XmlReq.open('GET', path, isAsync);
    const checkSuccess = () => (XmlReq.readyState === XMLHttpRequest.DONE && XmlReq.status === 200);
    const checkFailior = () => (XmlReq.readyState === XMLHttpRequest.DONE && XmlReq.status !== 200);
    const ErrorMsg = `could not load from path: ${path}`;
    if (isAsync) {
        return new Promise((resolve, reject) => {
            XmlReq.onreadystatechange = () => {
                if (checkSuccess()) resolve(JSON.parse(XmlReq.responseText));
                else if (checkFailior()) reject(ErrorMsg);
            }
            XmlReq.send(null);
        });
    } 
    XmlReq.send(null);
    if (checkSuccess()) return JSON.parse(XmlReq.responseText);
    else if (checkFailior()) throw new Error(ErrorMsg);
}

export const random = {
    randInt: (min = -infinity, max = infinity) => Math.floor(Math.random() * (max - min) + min),
    randItem: arr => arr[this.randInt(0, arr.length)],
    
    range: (len = 0) => '0'.repeat(len).split(''),
    // randWord: (len = 4) => range(len).reduce((acc) => acc + randLetter(), ''),
    // randTxt: (len = 7) => range(len).reduce((acc, c, i) => acc + `${randWord(this.randInt(2, 6))}${i < len-1 ? ' ' : ''}`, ''),
    randLetter: () => String.fromCharCode(this.randInt(97,123)),
    randWord: (len = 4) => this.range(len).map(c => this.randLetter()).join(''),
    randTxt: (len = 7) => this.range(len).map(c => this.randWord(this.randInt(2, 6))).join(' '),
    randParagraph: (len = 10) => this.range(len).reduce(
        (acc, c, i) => acc + `${
            this.randTxt(this.randInt(4, 10)) 
            + (i < len-1)
                ? this.randItem(['.',',','!','?',':','-',' ','\n'])
                : '.'
            }`, ''),
    shuffle: (arr) => {
        var copy = [...arr];
        var shuffled = [];
        for (let i = 0; i < this.length; i++) {
            shuffled.push(copy.splice(this.randInt(0, copy.length-1), 1)[0]);
        }
        return shuffled;
    }
}