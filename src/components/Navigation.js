import { template } from 'lodash';
import Component from '../component';

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.nav_item',
        links: '.nav_links',
      },
    });

    this.onChange(template);
  }

  onChange(template) {
    console.log(template);
  }
}
