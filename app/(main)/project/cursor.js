import { lerp, getMousePos } from './utils';

// TODO animate

// Track the mouse position
let mouse = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mouse = getMousePos(ev));

export class Cursor {
    DOM = {
		// the main text element
		el : document.createElement('div'),
        text: document.createElement('span'),
        desc: document.createElement('span'),
	};
    constructor(el) {
        this.DOM = {el: el, text: el.querySelector('.cursor_title'), desc: el.querySelector('.cursor_desc')};

        this.renderedStyles = {
            txText: {previous: 0, current: 0, amt: 0.1},
            tyText: {previous: 0, current: 0, amt: 0.1},
        };

        // runs once, to init mouse pos and animation loop
        this.onMouseMoveEv = () => {
            this.renderedStyles.txText.previous 
                                            = this.renderedStyles.txText.current 
                                            = mouse.x
            this.renderedStyles.tyText.previous 
                                            = this.renderedStyles.tyText.current 
                                            = mouse.y
            requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);
    }
    render() {
        // update pos, on mouse, styling pos on page itself
        this.renderedStyles['txText'].current = mouse.x;
        this.renderedStyles['tyText'].current = mouse.y;

        // update animation val
        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }

        // update animation
        this.DOM.text.style.transform = this.DOM.desc.style.transform = `translateX(${(this.renderedStyles['txText'].previous)}px) translateY(${this.renderedStyles['tyText'].previous}px)`;
        requestAnimationFrame(() => this.render());
    }
}