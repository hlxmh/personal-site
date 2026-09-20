import gsap from 'gsap';
import { lerp, getMousePos } from './utils';

export class MagneticFx {
    constructor(el) {
        // DOM elements
        this.DOM = {el: el};
		this.mousepos = {x: 0, y: 0};
        // amounts the element will translated
        this.animationVals = {
            tx: {previous: 0, current: 0, amt: 0.04},
            ty: {previous: 0, current: 0, amt: 0.04}
        };
        // calculate size/position
        this.calculateSizePosition();
        // init events
        this.initEvents();
    }
    calculateSizePosition() {
        this.rect = this.DOM.el.getBoundingClientRect();
    }
    initEvents() {
		this.onResize = () => this.calculateSizePosition();
		this.onMouseMove = ev => { this.mousepos = getMousePos(ev); };
		this.onMouseEnter = () => {
            this.hoverTimeout = setTimeout(() => { 
				if (this.destroyed) return;
                // set starting values for x and y to be same as pre-hover so its smooth
                this.animationVals.tx.previous = gsap.getProperty(this.DOM.el, "x");
                this.animationVals.ty.previous = gsap.getProperty(this.DOM.el, "y");
                // start the render loop animation (rAF)
                this.loopRender();
            }, 10);
        };
		this.onMouseLeave = () => {
            if ( this.hoverTimeout ) {
                clearTimeout(this.hoverTimeout);
            }
            // stop the render loop animation (rAF)
            this.stopRendering();
		};
		window.addEventListener('resize', this.onResize);
		window.addEventListener('mousemove', this.onMouseMove);
		this.DOM.el.addEventListener('mouseenter', this.onMouseEnter);
		this.DOM.el.addEventListener('mouseleave', this.onMouseLeave);
    }
    // start the render loop animation (rAF)
    loopRender() {
        if ( !this.requestId ) {
            this.requestId = requestAnimationFrame(() => this.render());
        }
    }
    // stop the render loop animation (rAF)
    stopRendering() {
        if ( this.requestId ) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = undefined;
        }
    }
    render() {
        this.requestId = undefined;
		if (this.destroyed) return;

        // new destination values for the translations, based on dist from middle of rect
        this.animationVals.tx.current = (this.mousepos.x - (this.rect.left + this.rect.width/2))*.3;
        this.animationVals.ty.current = (this.mousepos.y - (this.rect.top + this.rect.height/2))*.3;
        
        for (const key in this.animationVals ) {
            this.animationVals[key].previous = lerp(this.animationVals[key].previous, this.animationVals[key].current, this.animationVals[key].amt);
        }
        
        gsap.set(this.DOM.el, {
            x: this.animationVals.tx.previous,
            y: this.animationVals.ty.previous
        })

        this.loopRender()
    }
	destroy() {
		if (this.destroyed) return;
		this.destroyed = true;
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('mousemove', this.onMouseMove);
		this.DOM.el.removeEventListener('mouseenter', this.onMouseEnter);
		this.DOM.el.removeEventListener('mouseleave', this.onMouseLeave);
		if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
		this.stopRendering();
	}
}
