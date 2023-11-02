import { gsap } from 'gsap';
import { lerp, getMousePos } from './utils';

// Track the mouse position
let mouse = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mouse = getMousePos(ev));

export class Cursor {
    DOM = {
		// the main text element
		el : document.createElement('div'),
        text: document.createElement('span'),
	};
    constructor(el) {
        this.DOM = {el: el, text: el.querySelector('.cursor__text')};

        this.DOM.el.style.opacity = 0;
        
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.2},
            ty: {previous: 0, current: 0, amt: 0.2},
            txText: {previous: 0, current: 0, amt: 0.1},
            tyText: {previous: 0, current: 0, amt: 0.1},
            scale: {previous: 1, current: 1, amt: 0.15}
        };

        this.onMouseMoveEv = () => {
            this.renderedStyles.tx.previous = this.renderedStyles.tx.current 
                                            = this.renderedStyles.txText.previous 
                                            = this.renderedStyles.txText.current 
                                            = mouse.x
            this.renderedStyles.ty.previous = this.renderedStyles.ty.current 
                                            = this.renderedStyles.tyText.previous 
                                            = this.renderedStyles.tyText.current 
                                            = mouse.y

            gsap.to(this.DOM.el, {duration: 0.9, ease: 'Power3.easeOut', opacity: 1});
            requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);
    }
    enter() {
        this.renderedStyles['scale'].current = 1.5;
    }
    leave() {
        this.renderedStyles['scale'].current = 1;
    }
    render() {
        this.renderedStyles['tx'].current = this.renderedStyles['txText'].current = mouse.x;
        this.renderedStyles['ty'].current = this.renderedStyles['tyText'].current = mouse.y;

        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }
                    
        this.DOM.text.style.transform = `translateX(${(this.renderedStyles['txText'].previous)}px) translateY(${this.renderedStyles['tyText'].previous}px)`;
        requestAnimationFrame(() => this.render());
    }
}