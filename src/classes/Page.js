import gsap from 'gsap';
import normalizeWheel from 'normalize-wheel';
import Prefix from 'prefix';
import { each } from 'lodash';

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
    };
    this.id = id;
    this.transformPrefix = Prefix('transform');

    this.onMouseWheelEvent = this.onMouseWheel.bind(this);

    // console.log(this.transformPrefix);
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
      // console.log(this.elements[key], entry);
    });

    // console.log(this.element);
  }

  //gsap animation
  show() {
    return new Promise((resolve) => {
      this.animationIn = gsap.timeline();
      this.animationIn.fromTo(
        this.element,
        {
          opacity: 0,
        },
        {
          opacity: 1,
        }
      );
      this.animationIn.call(() => {
        this.addEventListeners();

        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.removeEventListeneres();
      this.animationOut = gsap.timeline();
      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onMouseWheel(event) {
    // console.log(event);

    const { pixelY } = normalizeWheel(event);
    console.log(pixelY);
    this.scroll.target += pixelY;
  }

  onResize() {
    if (this.elements && this.elements.wrapper) {
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight;
    } else {
      console.log(`wrapper or elements doesn't exist`, this.elements);
    }
  }

  update() {
    // console.log(this.scroll.target);
    this.scroll.target = gsap.utils.clamp(0, this.scroll.limit, this.scroll.target);
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, 0.1);
    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }
    // console.log(this.scroll.current);

    if (this.elements && this.elements.wrapper) {
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`;
    }
  }

  addEventListeners() {
    window.addEventListener('mousewheel', this.onMouseWheelEvent);
  }

  removeEventListeneres() {
    window.removeEventListener('mousewheel', this.onMouseWheelEvent);
  }
}
