import { gsap } from 'gsap';
import { EventEmitter } from 'events';
import { GridItem } from './gridItem';
import { getRandomNumber } from './utils';

export class Grid extends EventEmitter {
    constructor(el) {
        super();
        this.DOM = {el: el};

        this.gridItems = [];
        this.DOM.items = [...this.DOM.el.querySelectorAll('.grid__item')];
        this.DOM.items.forEach(item => {
            this.gridItems.push(new GridItem(item));
        });
        
        this.showItems();
        this.initEvents();
    }
    // Initial animation to scale up and fade in the items
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
            item.DOM.image.addEventListener('mouseenter', () => {
                item.onMouseEnter();
                this.emit('mouseEnterItem', item.title, item.desc);
            });
            
            item.DOM.image.addEventListener('mouseleave', () => {
                item.onMouseLeave();
                this.emit('mouseLeaveItem');
            });
            
            item.DOM.el.addEventListener('click', ev => {
                ev.preventDefault();
                this.showContent(item);
            });
        }
    }
    showContent(item) {
        console.log(item)
    }
}