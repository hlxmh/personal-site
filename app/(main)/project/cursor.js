import { lerp, getMousePos } from './utils';

// TODO animate

export class Cursor {
    constructor(el) {
        this.DOM = {
            el: el,
            text: el.querySelector('.cursor-title'),
            desc: el.querySelector('.cursor-desc')
        };
		this.mouse = {x: 0, y: 0};
		this.trackMouse = ev => { this.mouse = getMousePos(ev); };
		window.addEventListener('mousemove', this.trackMouse);

        this.animationVals = {
            tx: {previous: 0, current: 0, amt: 0.1},
            ty: {previous: 0, current: 0, amt: 0.1},
        };

        // runs once, to init mouse pos and animation loop
        this.onMouseMoveEv = () => {
            this.animationVals.tx.previous 
                                            = this.animationVals.tx.current 
                                            = this.mouse.x
            this.animationVals.ty.previous 
                                            = this.animationVals.ty.current 
                                            = this.mouse.y
			this.requestId = requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);
    }
    render() {
		this.requestId = undefined;
		if (this.destroyed) return;
        // update pos to stay on top of mouse, styling the position is done on page itself
        this.animationVals['tx'].current = this.mouse.x;
        this.animationVals['ty'].current = this.mouse.y;

        // update animation values
        for (const key in this.animationVals ) {
            this.animationVals[key].previous = lerp(this.animationVals[key].previous, this.animationVals[key].current, this.animationVals[key].amt);
        }

        // update animation
        this.DOM.el.style.transform = `translateX(${(this.animationVals['tx'].previous)}px) translateY(${this.animationVals['ty'].previous}px)`;
		this.requestId = requestAnimationFrame(() => this.render());
    }
	destroy() {
		if (this.destroyed) return;
		this.destroyed = true;
		window.removeEventListener('mousemove', this.trackMouse);
		window.removeEventListener('mousemove', this.onMouseMoveEv);
		if (this.requestId) cancelAnimationFrame(this.requestId);
		this.requestId = undefined;
	}
}
