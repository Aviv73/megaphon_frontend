// const errorImg = require('@/client/assets/imgs/error.svg')
// const closeImg = require('@/client/assets/imgs/close-btn.svg')

import scssVars from '@/assets/styles/global/_vars.scss';

import { elementService } from './element.service';

var config = {
  direction: 'ltr'
}
function setConfig(newConf = {}) {
  config = {
    ...config,
    ...newConf
  }
}

function toast({type = 'danger', msg = '', html = '', timeout = 7000} = {}, olCloseCb) {
  const styleStr =`<style>
    ${elementService.dataToCss('.toast-alert', {
      ...config,
      position: 'fixed',
      zIndex: 40,
      top: '40px',
      right: '50%',
      transform: 'translateX(50%)',
      padding: '10px',
      borderRadius: '4px',
      fontStyle: 'italic',
      width: '370px',
      boxShadow: scssVars.lightShadow,
      '&.safe': {
        backgroundColor: '#95f495',
        '.prime-msg': {
          // color: 'green-darker'
        }
      },
      '&.warning': {
        backgroundColor: 'yellow',
        '.prime-msg': {
          // color: 'yellow-darker'
        }
      },
      '&.danger': {
        backgroundColor: '#FFF5F5',
        '.prime-msg': {
          '&::before': {
            // content: `url(${errorImg})`,
            marginInlineEnd: '5px'
          }
        }
      },
      a: {
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'underline'
      },
      '@keyframes fadeaway': {
        '0%': {opacity: '100%'},
        '100%': {opacity: '0%'}
      },
      '&.fade': {
        animationName: 'fadeaway',
        animationDuration: '1s'
      },
      '.close-btn': {
        position: 'absolute',
        top: '3px',
        right: '3px',
        // backgroundImage: `url(${closeImg})`,
        backgroundSize: `10px 10px`,
        width: '10px',
        height: '10px',
        content: '"X"'
      },
      '@media (max-width: 420px)': {
        width: '90vw',
        textAlign: 'center',
        '.sec-msg': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }
      }
    })}
  </style>`;

  let toastEl;

  let isClosed = false;
  const onClose = () => {
    if (isClosed) return;
    isClosed = true;
    document.body.removeChild(toastEl);
    olCloseCb?.();
  }

  toastEl = elementService.El(`<div class="toast-alert ${type}">
    ${styleStr}
    ${msg? `<p class="prime-msg">${msg}</p>` : ''}
    ${html || ''}
  </div>`, {}, [elementService.El(`<button class="close-btn"></button>`, {onclick: onClose})]);

  document.body.appendChild(toastEl);

  if (timeout) {
    setTimeout(() => {
      if (isClosed) return;
      toastEl.classList.add('fade');
    }, timeout - 900);
    setTimeout(() => {
      onClose();
    }, timeout);
  }

  return onClose;
}

class A_Alert {
    static counter = 0;
    id = 0;

    idClass = '';
    RootClass = 'A-Alert';
    pasitionClass = 'alert-fixed';
    compactClass = 'compact-alert';
    parentSelector = '';
    styleTemplateStr = '';

    constructor(parentSelector = 'body', isAbsolute = false, styleTemplateStr = _getDefaultAlertStyle()) {
        this.parentSelector = parentSelector;
        this.id = A_Alert.counter++;

        if (isAbsolute) this.pasitionClass = 'alert-absolute';

        this.styleTemplateStr = styleTemplateStr;

        this.idClass = 'ALERT' + this.id;
    }

    state = {
        type: '',
        msg: '',
        placeHolder: '',
    
        reject: undefined,
        resolve: undefined,
    }

    Confirm = (msg = '') => {
        return this._seStatePromise('confirm', msg, '');
    }
    Alert = (msg = '') => {
        return this._seStatePromise('alert', msg, '');
    }
    Prompt = (msg = '', placeHolder = '') => {
        return this._seStatePromise('prompt', msg, placeHolder);
    }

    _render() {
        var {msg, type, placeHolder} = this.state;
        return `
            ${this.styleTemplateStr}
            <div class="alert-screen"></div>
            <section class="alert-modal">
                <p class="msg">${msg}</p>
                ${type === 'prompt' && `
                    <form class="a-alert-prompt-form">
                        <input type="text" placeholder="${placeHolder}"/>
                        <button>Submit</button>
                    </form>
                    <button class="a-alert-reject-btn">Close</button>
                ` || `
                    <div class="a-alert-buttons-container">
                        ${type === 'confirm' && `
                            <button class="a-alert-confirm-btn">Confirm</button>
                            <button class="a-alert-reject-btn">Cancel</button>
                        ` || `
                            <button class="a-alert-reject-btn">Close</button>
                        `}
                    </div>
                `}
            </section>
            `
    }

    _show = () => {
        const alertHtmlStr = this._render();
        var elAlert = document.querySelector('.' + this.idClass);
        if (!elAlert) {
            elAlert = document.createElement('div');
            elAlert.classList = `${this.RootClass} ${this.idClass} ${this.pasitionClass}`;

            let elParent = document.querySelector(this.parentSelector);
            if (elParent.offsetWidth < 400) elAlert.classList.add(this.compactClass);
            elParent.appendChild(elAlert);
        }
        elAlert.innerHTML = alertHtmlStr;
        elAlert.classList.add(this.state.type);
        try {elAlert.querySelector('.a-alert-prompt-form').onsubmit = event => this._promptResolve(event);} catch(err) {}
        try {elAlert.querySelector('.a-alert-reject-btn').onclick = this.state.type === 'confirm' ? 
                                                                                this._alertResolveFalse : 
                                                                                this._alertResolveUndefined ;
                                                                    } catch(err) {}
        try {elAlert.querySelector('.a-alert-confirm-btn').onclick = this._alertResolveTrue;} catch(err) {}
    }

    reset() {
      if (this.state.reject) this.state.reject();
      if (this.elAlert) this.elAlert.innerHTML = '';
      this._resetState();
    }

    _resetState() {
      this.state.isPending = false;
      this.state.msg = '';
      this.state.type = '';
      this.state.placeHolder = '';
      this.state.resolve = undefined;
      this.state.reject = undefined;
    }
    
    _hide = (prmCbFunc, val = undefined) => {
        var currTypeClassName = this.state.type;
        this._resetState();

        var elAlert = document.querySelector('.' + this.idClass);
        if (!elAlert) return;
        elAlert.classList.remove(currTypeClassName);
        elAlert.innerHTML = null;
        return prmCbFunc?.(val);
    }

    _alertResolveTrue = () => {
        return this.state.resolve(true);
    }
    _alertResolveFalse = () => {
        return this.state.resolve(false);
    }
    _alertResolveUndefined = () => {
        this.state.resolve();
    }
    _alertReject = () => {
        return this.state.reject();
    }
    _promptResolve = (ev) => {
        ev.preventDefault();
        var value = ev.target.querySelector('input').value;
        if (!value.length) return;
        ev.target.querySelector('input').value = '';
        return this.state.resolve(value);
    }

    _seStatePromise = (type, msg = '', placeHolder = '') => {
        if (this.state.isPending) return Promise.reject(`NOTE: can not set new alert becouse another alert is already in pending state.`);
        this.state.isPending = true;
        this.state.type = type;
        this.state.msg = msg;
        this.state.placeHolder = placeHolder;
        this._show();
        return new Promise((resolve, reject) => {
            this.state.resolve = (val) => this._hide(val => resolve(val), val);
            this.state.reject = () => this._hide(reject);
        });
    }
}

const { Alert, Prompt, Confirm } = new A_Alert();

export const alertService = {
  toast,
  A_Alert,
  Alert,
  Prompt,
  Confirm,
  setConfig
}


// var tryAlert = new A_Alert();
// window.Alert = tryAlert.Alert;
// window.Confirm = tryAlert.Confirm;
// window.Prompt = tryAlert.Prompt;

function _getDefaultAlertStyle() {
    return  {
        name: 'alert-style',
        template: `
            <style>
                .A-Alert .alert-screen {
                    direction: ${config.direction};
                    top: 0;
                    right: 0;
                    background-color: rgba(0, 0, 0, 0.01);
                    z-index: 29;
                }
                .A-Alert.alert-absolute .alert-screen {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                }
                .A-Alert.alert-fixed .alert-screen {
                    position: fixed;
                    width: 100%;
                    height: 100vh;
                }
    
                .A-Alert .alert-modal {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: black;
                    background-color: #fff;
                    border: 1px solid rgb(165, 12, 12);
                    border-radius: 20px;
                    width: 350px;
                    max-width: 98%;
                    padding: 20px;
                    z-index: 30 !important;
                    right: 50%;
                    bottom: 50%;
                    transform: translate(50%, 50%);
                    font-family: Verdana, Geneva, Tahoma, sans-serif;
                }
                .A-Alert.compact-alert.alert-absolute .alert-modal {
                    width: 75%;
                }
                .A-Alert.alert-absolute .alert-modal {
                    position: absolute;
                }
                .A-Alert.alert-fixed .alert-modal {
                    position: fixed;
                    top: 12vh;
                    bottom: unset;
                    transform: translate(50%, 0);
                }
    
                .A-Alert .alert-modal > * {
                    text-align: center;
                    width: 100%;
                    margin: 20px 0;
                }
    
                .A-Alert .alert-modal .a-alert-buttons-container, 
                .A-Alert .alert-modal .a-alert-prompt-form {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    flex-wrap: wrap;
                }
                .A-Alert .alert-modal .a-alert-buttons-container >*, 
                .A-Alert .alert-modal .a-alert-prompt-form >* {
                    margin: 5px;
                }
    
                .A-Alert .alert-modal button {
                    background: unset;
                    <!-- font-size: 1rem; -->
                    font-size: 0.8rem;
                    border: 1px solid rgb(165, 12, 12);
                    border-radius: 7.5px;
                    outline: unset;
                    color: rgb(165, 12, 12);
                    width: fit-content;
                }
                .A-Alert .alert-modal button:hover {
                    cursor: pointer;
                }
                .A-Alert .alert-modal button:active {
                    cursor: pointer;
                    border: 1px solid #eca1a1;
                    color: #eca1a1;
                }

                .A-Alert .alert-modal input {
                    width: 60%;
                    outline: none;
                    padding: 5px;
                    padding-left: none;
                    border: unset;
                    background: unset;
                    border-bottom: 1px solid black;
                    border-radius: 0;
                    color: black;
                }
    
                
                @media (max-width: 400px) {
                    .A-Alert.alert-fixed .alert-modal {
                        width: 80vw;
                    }
                }
    
            </style>
    `
    }.template
}