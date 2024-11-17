import Component from '../component';
import { each } from 'lodash';
import gsap from 'gsap';
import SplitType from 'split-type';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.loader',
      elements: {
        title: '.loader-text',
        number: '.loader-percent-text',
        images: document.querySelectorAll('img'),
      },
    });

    this.elements.titleSpans = new SplitType(this.elements.title, {
      types: 'lines, chars',
      lineClass: 'split-lines',
      charClass: 'split-char',
    });

    this.length = 0;

    // console.log(this.element, this.elements);

    this.createLoader();
    // setTimeout(() => {
    //   this.emit('completed');
    // }, 1000);
  }

  //creatLoaderFunction
  createLoader() {
    each(this.elements.images, (element) => {
      element.onload = (_) => this.onAssetLoaded(element);
      element.src = element.src;
      // console.log(image);
    });
  }

  //onAssetLoaded
  onAssetLoaded(image) {
    this.length += 1;
    const percent = this.length / this.elements.images.length;
    // console.log(Math.round((this.length / this.elements.images.length) * 100));

    this.elements.number.innerHTML = `${Math.round(percent * 100)}%`;
    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline();

      //text animation
      this.animateOut.to(this.elements.titleSpans.chars, {
        stagger: {
          amount: 0.3,
        },
        duration: 1.5,
        ease: 'expo.out',
        yPercent: 100,
        delay: 1,
      });

      this.animateOut.to(
        this.elements.number,
        {
          duration: 1.5,
          ease: 'expo.out',
          yPercent: 110,
        },
        '<'
      );

      this.animateOut.to(
        this.element,
        {
          duration: 1.5,
          scaleY: 0,
          ease: 'expo.out',
          transformOrigin: '100% 100%',
        },
        '>-=1'
      );

      this.animateOut.call((_) => {
        this.emit('completed');
      });
    });
  }

  //destroy preloader
  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
