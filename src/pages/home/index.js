import Page from '../../classes/Page';

export default class Home extends Page {
  constructor() {
    super({
      id: 'home',
      element: '.home',
      elements: {
        wrapper: '.home_wrapper',
        navigation: document.querySelector('.navbar'),
        button: '.cta-button',
      },
    });
  }

  create() {
    super.create();

    this.elements.button.addEventListener('click', () => console.log('you clicked me huh??'));
  }
}
