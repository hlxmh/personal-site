import { gsap } from 'gsap';
import { map, lerp, getMousePos, calcWinsize, getRandomNumber } from './utils';
import { MagneticFx }  from './magneticFx';

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

// Track the mouse position
let mousepos = {x: winsize.width/2, y: winsize.height/2};
window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));

export class GridItem {
    constructor(el) {
        this.DOM = {el: el};
        // the inner image
        this.DOM.image = this.DOM.el.querySelector('.grid__item-img');
        // the title that will appear next to the mouse cursor when hovering
        this.title = this.DOM.el.dataset.title;
        this.desc = this.DOM.el.dataset.desc;
        // amounts to move in each axis when moving the cursor
        this.translationVals = {x: 0, y: 0};
        this.rotationVals = {x: 0, y: 0};
        // get random start and end translation/rotation boundaries (pos and neg)
        // will also affect transition speed (larger boundary -> more distance/update)
        // boundaries for rotation actually double since it affects base rotation and mouse move rotate
        this.xbound = getRandomNumber(70,100);
        this.ybound = getRandomNumber(40,65);
        this.rxbound = 5;
        this.rybound = 8;
        // magnetic effect on the image:
        // when hovering on the image, the image will follow the mouse movement
        this.magneticFx = new MagneticFx(this.DOM.image);
        // initial style/position
        this.layout();
        // start the rAF render function (translate and rotate the item as we move the mouse)
        this.loopTransformAnimation();
    }
    // initial position on the grid
    // set the rotation and the translationZ
    layout() {
        const rect = this.DOM.el.getBoundingClientRect();
        
        // check if the element is position on the left/top side of the viewport 
        this.isLeft = rect.left+rect.width/2 < winsize.width/2;
        this.isTop = rect.top+rect.height/2 < winsize.height/2;

        // define base rotation and z based on pos on screen
        // rY - higher as more left (rotate leftwards)
        // rX - lower as more top (rotate upwards)
        // tZ - lower as more away from center (farther away)
        this.rY = this.isLeft ?
                        map(rect.left+rect.width/2, 0, winsize.width/2, -this.rybound, 0) :
                        map(rect.left+rect.width/2, winsize.width/2, winsize.width, 0, this.rybound);
        this.rX = this.isTop ?
                        map(rect.top+rect.height/2, 0, winsize.height/2, this.rxbound, 0) :
                        map(rect.top+rect.height/2, winsize.height/2, winsize.height, 0, -this.rxbound);
        this.tZ = this.isLeft ?
                        map(rect.left+rect.width/2, 0, winsize.width/2,  -600, -200) :
                        map(rect.left+rect.width/2, winsize.width/2, winsize.width, -200, -600);

        // the rotates will also be set in move so its a bit excessive
        gsap.set(this.DOM.el, {
            rotationX: this.rX,
            rotationY: this.rY,
            z: this.tZ
        }); 
    }
    onMouseEnter() {
        this.hoverTimeout = setTimeout(() => {
            //this.stopTransformAnimation();

            if( this.timelineHoverOut ) this.timelineHoverOut.kill();
            
            this.timelineHoverIn = gsap.timeline()
            .addLabel('start', 0)
            .to(this.DOM.image, {
                duration: 0.8,
                ease: 'expo',
                scale: 1.1
            }, 'start')

        }, 10);
    }
    onMouseLeave() {
        //this.loopTransformAnimation();

        if ( this.hoverTimeout ) {
            clearTimeout(this.hoverTimeout);
        }
        
        if( this.timelineHoverIn ) this.timelineHoverIn.kill();
        
        this.timelineHoverOut = gsap.timeline()
        .to(this.DOM.image, {
            duration: 1,
            ease: 'power4',
            x: 0,
            y: 0,
            scale: 1
        });
    }
    loopTransformAnimation() {
        // check if needed
        if ( !this.requestId ) {
            this.requestId = requestAnimationFrame(() => this.move());
        }
    }
    // stop the render loop animation (rAF)
    stopTransformAnimation() {
        if ( this.requestId ) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = undefined;
        }
    }
    // translate/rotate the grid items as we move the mouse
    move() {
        this.requestId = undefined;

        // TODO reset on mouse out of window

        // Calculate the amount to move.
        // Using linear interpolation to smooth things out. 
        // Translation values will be in the range of [-bound, bound] for a cursor movement from 0 to the window's width/height
        this.translationVals.x = lerp(this.translationVals.x, map(mousepos.x, 0, winsize.width, this.xbound, -this.xbound), 0.04);
        this.translationVals.y = lerp(this.translationVals.y, map(mousepos.y, 0, winsize.height, this.ybound, -this.ybound), 0.04);
        // same for the rotations
        this.rotationVals.x = lerp(this.rotationVals.x, map(mousepos.y, 0, winsize.height, this.rxbound, -this.rxbound), 0.04)
        this.rotationVals.y = lerp(this.rotationVals.y, map(mousepos.x, 0, winsize.width, this.rybound, -this.rybound), 0.04);

        gsap.set(this.DOM.el, {
            x: this.translationVals.x, 
            y: this.translationVals.y,
            rotationX: this.rX + this.rotationVals.x,
            rotationY: this.rY + this.rotationVals.y,
        });

        this.loopTransformAnimation();
    }
}