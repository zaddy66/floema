import Page from '../../classes/Page';

export default class Details extends Page {
  constructor() {
    super({
      id: 'detail',
      element: '.product-details',
    });
  }
}
