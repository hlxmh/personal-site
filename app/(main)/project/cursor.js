import { lerp, getMousePos } from './utils';

// TODO animate

// Track the mouse position
let mouse = {x: 0, y: 0};
if (typeof window !== "undefined") {
    window.addEventListener('mousemove', ev => mouse = getMousePos(ev));
}

export class Cursor {
    // text and desc are unused here, but needed for page.tsx
    DOM = {
		// the main text element
		el : document.createElement('div'),
        text: document.createElement('span'),
        desc: document.createElement('span'),
	};
    constructor(el) {
        this.DOM = {
            el: el,
            text: el.querySelector('.cursor-title'),
            desc: el.querySelector('.cursor-desc')
        };

        this.animationVals = {
            tx: {previous: 0, current: 0, amt: 0.1},
            ty: {previous: 0, current: 0, amt: 0.1},
        };

        // runs once, to init mouse pos and animation loop
        this.onMouseMoveEv = () => {
            this.animationVals.tx.previous 
                                            = this.animationVals.tx.current 
                                            = mouse.x
            this.animationVals.ty.previous 
                                            = this.animationVals.ty.current 
                                            = mouse.y
            requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);
    }
    render() {
        // update pos to stay on top of mouse, styling the position is done on page itself
        this.animationVals['tx'].current = mouse.x;
        this.animationVals['ty'].current = mouse.y;

        // update animation values
        for (const key in this.animationVals ) {
            this.animationVals[key].previous = lerp(this.animationVals[key].previous, this.animationVals[key].current, this.animationVals[key].amt);
        }

        // update animation
        this.DOM.el.style.transform = `translateX(${(this.animationVals['tx'].previous)}px) translateY(${this.animationVals['ty'].previous}px)`;
        requestAnimationFrame(() => this.render());
    }
}