import { ElementService } from './utils.js';

function updateElScrollsStyle() {
    const { scrollSizes } = this;
    const elActions = this.elCanvasContainer.querySelector('.actions');
    if (!elActions) return;
    elActions.querySelectorAll('.grab').forEach(elGrab => {
        const isVertical = elGrab.classList.contains('vertical');
        if (isVertical) {
            elGrab.style.height = scrollSizes.vertical.size + '%';
            elGrab.style.top = scrollSizes.vertical.pad + '%'
        } else {
            elGrab.style.width = scrollSizes.horizontal.size + '%';
            elGrab.style.left = scrollSizes.horizontal.pad + '%'
        }
    });
}

function getActionsElement() {
    let grabedScroll = '';
    let prevDragedPos = null;

    const { enableZoomUi, enableScrollUi, enableFlipUi, enableMirrorUi } = this.canvasOpts;
    
    const { El } = ElementService;

    const el = El(`<div class="actions"></div>`, {}, [
        El(`<style>${this.constructor.getActionsStyleStr(this.selector)}</style>`),
        enableZoomUi &&
        El(`<div class="zoom-btns control-section"></div>`, {}, [
            El(`<button class="icon plus-btn"></button>`, { onclick: () => this.updateZoomLevel(0.1) }),
            El(`<button class="icon minus-btn"></button>`, { onclick: () => this.updateZoomLevel(-0.1) }),
        ]),
        enableScrollUi &&
        El(`<div class="scrolls"></div>`, {}, [
            El(`<div class="scroll-container horizontal control-section"></div>`, {}, [
                El(`<button class="icon plus-btn"></button>`, { onclick: () => this.updateRootRenderPos({ y: 0, x: -30 }) }),
                El(`<div class="scroll"></div>`, {}, [
                    El(`<div class="grab horizontal"></div>`, { onmousedown: () => grabedScroll = 'horizontal' })
                ]),
                El(`<button class="icon minus-btn"></button>`, { onclick:  () => this.updateRootRenderPos({ y: 0, x: 30 }) }),
            ]),
            El(`<div class="scroll-container vertical control-section"></div>`, {}, [
                El(`<button class="icon plus-btn"></button>`, { onclick:  () => this.updateRootRenderPos({ y: -30, x: 0 }) }),
                El(`<div class="scroll"></div>`, {}, [
                    El(`<div class="grab vertical"></div>`, { onmousedown: () => grabedScroll = 'vertical' })
                ]),
                El(`<button class="icon minus-btn"></button>`, { onclick:  () => this.updateRootRenderPos({ y: 30, x: 0 }) }),
            ]),
        ]),
        (enableFlipUi || enableMirrorUi) &&
        El('<div class="flip-btns control-section"></div>', {}, [
            enableFlipUi && El('<button class="icon flip-btn" title="Flip 180"></button>', { onclick: () => this.updateFlipLevel(2) }),
            enableMirrorUi && El('<button class="icon mirror-x-btn" title="Mirror X"></button>', { onclick: () => this.toggleMirrorX() }),
            enableMirrorUi && El('<button class="icon mirror-y-btn" title="Mirror Y"></button>', { onclick: () => this.toggleMirrorY() }),
        ])
    ]);

    if (!this.canvasOpts.enableScrollUi) return el;

    ['mousemove', 'touchmove'].forEach(evName => this.addWindowEventListener(evName, (ev) => {
        // ev.preventDefault();
        if (this.isDragOn) return;
        if (!grabedScroll) return;
        const pos = { x: ev.clientX, y: ev.clientY };
        if (!prevDragedPos) return prevDragedPos = pos;
        const isVertical = grabedScroll === 'vertical';
        const diff = isVertical ? pos.y - prevDragedPos.y : pos.x - prevDragedPos.x;
        this.updateRootRenderPos({
            x: !isVertical ? diff * this.zoomLevel : 0,
            y: isVertical ? diff * this.zoomLevel : 0
        });
        prevDragedPos = pos;
    }));
    ['mouseup'].forEach(evName => this.addWindowEventListener(evName, (ev) => {
        // ev.preventDefault();
        if (!prevDragedPos) return;
        prevDragedPos = null;
        grabedScroll = '';
    }));

    return el;
}

function setElActionPositions() {
    const { element, canvasSize } = this;
    const pad = { // paddingFromCanvas
        w: (element.offsetWidth - canvasSize.w) / 2 || 0,
        h: (element.offsetHeight - canvasSize.h) / 2 || 0
    }
    const elActions = element.querySelector('.actions');
    if (!elActions) return;
    elActions.querySelectorAll('.scroll-container').forEach(el => {
        if (el.classList.contains('horizontal')) {
            el.style.bottom = pad.h + 10 + 'px';
            el.style.width = canvasSize.w*0.7 + 'px';
        }
        else  {
            el.style.right = pad.w + 10 + 'px';
            el.style.height = canvasSize.h*0.7 + 'px';
        }
    });
    if (this.canvasOpts.enableZoomUi) {
        const elZoomBtns = elActions.querySelector('.zoom-btns');
        elZoomBtns.style.bottom = pad.h + 10 + 'px';
        elZoomBtns.style.left = pad.w + 10 + 'px';
    }
    if (this.canvasOpts.enableFlipUi || this.canvasOpts.enableMirrorUi) {
        const elFlipBtns = elActions.querySelector('.flip-btns');
        elFlipBtns.style.top = pad.h + 10 + 'px';
        elFlipBtns.style.left = pad.w + 10 + 'px';
        if (this.canvasOpts.enableMirrorUi) {
            elFlipBtns.querySelector('.mirror-x-btn').classList[this.isMirrorX? 'add' : 'remove']('on');
            elFlipBtns.querySelector('.mirror-y-btn').classList[this.isMirrorY? 'add' : 'remove']('on');
        }
    }
}

function getActionsStyleStr(parentSelector = '') {
    const baseSelector = `${parentSelector} .actions`;
    const { StyleEl } = ElementService;
    const logicStyle = StyleEl(baseSelector, {
        'user-select': 'none',
        '.control-section': {
            'position': 'absolute'
        },
        button: {
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            '&:hover': {
                cursor: 'pointer'
            }
        },
        '.plus-btn': {
            '&:after': {
                content: '"+"',
            }
        },
        '.minus-btn': {
            '&:after': {
                content: '"-"',
            }
        },
        '.zoom-btns': {
            bottom: '10px',
            left: '10px',
            display: 'flex',
            'flex-direction': 'column',
        },
        '.scrolls': {
            '.scroll-container': {
                display: 'flex',
                '.scroll': {
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    '.grab': {
                        position: 'absolute',
                        height: '100%',
                        '&:hover': {
                            cursor: 'pointer'
                        },
                        '&.horizontal': {
                            width: '100%',
                            left: '0%'
                        },
                        '&.vertical': {
                            width: '100%',
                            top: '0%' 
                        }
                    }
                },
                '&.horizontal': {
                    bottom: '10px',
                    right: '50%',
                    transform: 'translateX(50%)',
                    width: '70%'
                },
                '&.vertical': {
                    'flex-direction': 'column',
                    right: '10px',
                    bottom: '50%',
                    transform: 'translateY(50%)',
                    height: '70%',
                    '.scroll': {
                        'flex-direction': 'column'
                    }
                }
            }
        },
        '.flip-btns': {
            top: '10px',
            left: '10px',
            display: 'flex',
            'flex-direction': 'column',
            '.flip-btn': {
                '&:after': {
                    content: '"⟳"',
                }
            },
            '.mirror-x-btn': {
                '&:after': {
                    content: '"↹"',
                }
            },
            '.mirror-y-btn': {
                '&:after': {
                    content: '"↹"',
                    transform: 'rotate(90deg)'
                }
            }
        }
    });
    return logicStyle;
    const styledStyle = StyleEl(baseSelector, {
        '.control-section': {
            'background-color': 'rgba(255, 255, 255, 0.5)',
            border: '1px solid black',
            padding: '5px',
            'border-radius': '5px',
        },
        button: {
            border: '1px solid black',
            'border-radius': '3px',
            'background-color': 'rgb(116, 116, 116)',
            color: 'white',
            transition: '.2s',
            '&:hover': {
                'background-color': 'rgb(153, 151, 151)',
            },
            '&.on': {
                'box-shadow': '0px 0px 20px 0px rgba(254,255,30,0.75)'                
            }
        },
        '.zoom-btns': {
            gap: '10px',
            button: {
                width: '30px',
                height: '30px',
            }
        },
        '.scrolls': {
            '.scroll-container': {
                gap: '7.5px',
            },
            '.grab': {
                'border-radius': '10px',
                'background-color': 'rgba(54, 100, 168, 0.9)',
                '&:hover': {
                    cursor: 'pointer',
                }
            },
            button: {
                width: '15px',
                height: '15px',
            }
        },
        '.flip-btns': {
            gap: '10px',
            button: {
                width: '25px',
                height: '25px',
            }
        }
    });
    return logicStyle + styledStyle;
}


export default {
  updateElScrollsStyle,
  getActionsElement,
  setElActionPositions,
  getActionsStyleStr
}