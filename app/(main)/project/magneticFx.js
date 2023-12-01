import gsap from 'gsap';
import { lerp, getMousePos, calcWinsize, getTranslateValues } from './utils';

// track the mouse position
let mousepos = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));
export class MagneticFx {
    constructor(el) {
        // DOM elements
        this.DOM = {el: el};
        // amounts the element will translated
        this.renderedStyles = {
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
        window.addEventListener('resize', () => this.calculateSizePosition());

        this.DOM.el.addEventListener('mouseenter', () => {
            // incredibly small timeout to bypass fast movements
            this.hoverTimeout = setTimeout(() => { 
                // set starting values for x and y to be same as pre-hover so its smooth
                this.renderedStyles.tx.previous = gsap.getProperty(this.DOM.el, "x");
                this.renderedStyles.ty.previous = gsap.getProperty(this.DOM.el, "y");
                // start the render loop animation (rAF)
                this.loopRender();
            }, 10);
        });
        this.DOM.el.addEventListener('mouseleave', () => {
            if ( this.hoverTimeout ) {
                clearTimeout(this.hoverTimeout);
            }
            // stop the render loop animation (rAF)
            this.stopRendering();
        });
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

        // new destination values for the translations, based on dist from middle of rect
        this.renderedStyles.tx.current = (mousepos.x - (this.rect.left + this.rect.width/2))*.3;
        this.renderedStyles.ty.current = (mousepos.y - (this.rect.top + this.rect.height/2))*.3;
        
        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }
        
        gsap.set(this.DOM.el, {
            x: this.renderedStyles.tx.previous,
            y: this.renderedStyles.ty.previous
        })

        this.loopRender()
    }
}