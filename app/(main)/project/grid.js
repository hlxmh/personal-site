import { gsap } from 'gsap';
import { EventEmitter } from 'events';
import { GridItem } from './gridItem';

export class Grid extends EventEmitter {
    constructor(el) {
        super();
        this.DOM = {el: el};

        this.gridItems = [];
        this.DOM.items = [...this.DOM.el.querySelectorAll('.grid-item')];
        this.DOM.items.forEach(item => {
            this.gridItems.push(new GridItem(item));
        });
        
        this.showItems();
        this.initEvents();
    }
    // initial animation to scale up and fade in the items
    showItems() {
        this.showTimeline = gsap.timeline()
        .addLabel('start', 0)
        .set(this.DOM.items, {scale: 1.5, opacity: 0}, 0)
        .to(this.DOM.items, {
            duration: 1.2,
            ease: 'expo',
            scale: 1,
            stagger: {amount: 0.4, grid: 'auto', from: 'center'}
        }, 'start')
        .to(this.DOM.items, {
            duration: 1.2,
            ease: 'power1',
            opacity: 1,
            stagger: {amount: 0.4, grid: 'auto', from: 'center'}
        }, 'start');
    }
    initEvents() {
		this.itemHandlers = new Map();
        for(const item of this.gridItems) {
			const mouseEnter = () => {
                item.onMouseEnter();
                this.emit('mouseEnterItem', item.title, item.desc);
            };
            
			const mouseLeave = () => {
                item.onMouseLeave();
                this.emit('mouseLeaveItem');
			};
			this.itemHandlers.set(item, {mouseEnter, mouseLeave});
			item.DOM.el.addEventListener('mouseenter', mouseEnter);
			item.DOM.el.addEventListener('mouseleave', mouseLeave);
        }
    }
	destroy() {
		if (this.destroyed) return;
		this.destroyed = true;
		this.showTimeline?.kill();
		for (const item of this.gridItems) {
			const handlers = this.itemHandlers.get(item);
			if (handlers) {
				item.DOM.el.removeEventListener('mouseenter', handlers.mouseEnter);
				item.DOM.el.removeEventListener('mouseleave', handlers.mouseLeave);
			}
			item.destroy();
		}
		this.itemHandlers.clear();
		this.removeAllListeners();
	}
}
