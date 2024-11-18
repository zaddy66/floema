import { each } from 'lodash';

import Navigation from './components/Navigation';
import Preloader from './components/preloader';

import About from './pages/about';
import Collections from './pages/collection';
import Details from './pages/details';
import Home from './pages/home';

class App {
  constructor() {
    this.createContent();

    this.createPreloader();
    this.createNavigation();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.update();
  }

  //createNavigation
  createNavigation() {
    this.navigation = new Navigation({
      template: this.template,
    });
  }

  //createPreloader
  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once('completed', this.onPreloaded.bind(this));
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');

    // console.log(this.template);
  }

  createPages() {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Details(),
      home: new Home(),
    };

    //make sure your data template matches upper this pages for example if in this.pages we have "about" the data template should be "about"
    this.page = this.pages[this.template];
    // if (!this.page) {
    //   console.error('No page found for template:', this.template);
    //   return;
    // }
    this.page.create();
  }

  //Events
  //onPreloaded
  onPreloaded() {
    // console.log('Preloaded!');
    this.preloader.destroy();

    this.onResize();

    this.page.show();
  }

  async onChange(url) {
    //hiding the current page
    await this.page.hide();

    const request = await window.fetch(url);

    if (request.status === 200) {
      //fetching content from body
      const html = await request.text();
      //creating div
      const div = document.createElement('div');
      //asiging html to div
      div.innerHTML = html;

      //creating divContent for ".content" from the fetch content
      const divContent = div.querySelector('.content');
      //creating variable for data-template
      this.template = divContent.getAttribute('data-template');

      this.navigation.onChange(this.template);

      this.content.setAttribute('data-template', this.template);

      //changing "content" html to fetched html
      this.content.innerHTML = divContent.innerHTML;

      this.page = this.pages[this.template];

      this.page.create();

      this.onResize();

      this.page.show();

      this.addLinkListeners();
      // console.log(text);
    } else {
      console.log('Error');
    }
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  //Loops
  update() {
    // console.log('update');
    if (this.page && this.page.update) {
      this.page.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  //Listeners
  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();
        const { href } = link;
        this.onChange(href);
        // console.log(event, href);
      };
    });
  }
}

new App();
