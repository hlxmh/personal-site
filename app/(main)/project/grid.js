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
        gsap
        .timeline()
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
        for(const item of this.gridItems) {
            item.DOM.el.addEventListener('mouseenter', () => {
                item.onMouseEnter();
                this.emit('mouseEnterItem', item.title, item.desc);
            });
            
            item.DOM.el.addEventListener('mouseleave', () => {
                item.onMouseLeave();
                this.emit('mouseLeaveItem');
            });
        }
    }
}