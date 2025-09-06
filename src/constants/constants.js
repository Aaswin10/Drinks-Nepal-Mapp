/* eslint-disable @typescript-eslint/no-require-imports */
const homeCategories = [
  {
    id: '1',
    name: 'Men',
    image: 'https://dl.dropbox.com/s/ky66sxpbxqrkn27/men.png?dl=0',
    loaded: false,
  },
  {
    id: '2',
    name: 'Women',
    image: 'https://dl.dropbox.com/s/5j76kez175yl2zg/women.png?dl=0',
    loaded: false,
  },
  {
    id: '3',
    name: 'Kids',
    image: 'https://dl.dropbox.com/s/u7ivc2kfw838mxo/kids.png?dl=0',
    loaded: false,
  },
  {
    id: '4',
    name: 'Sport',
    image: 'https://dl.dropbox.com/s/o2hh7yxzi9e302n/sport.png?dl=0',
    loaded: false,
  },
  {
    id: '5',
    name: 'Accessories',
    image: 'https://dl.dropbox.com/s/vd99jhe9sxvnyah/accessories.png?dl=0',
    loaded: false,
  },
];

const homeCarousel = [
  {
    id: '1',
    image: require('../assets/banner.png'),
  },
  {
    id: '2',
    image: require('../assets/banner.png'),
  },
  {
    id: '3',
    image: require('../assets/banner.png'),
  },
];

const promocodes = [
  {
    id: '1',
    name: 'Acme Co.',
    discount: '50% off',
    color: '#F4303C',
    valid_till: 'Valid until June 30, 2021',
    image: 'https://dl.dropbox.com/s/gi06ny0o9ylm055/01.png?dl=0',
  },
  {
    id: '2',
    name: 'Abstergo Ltd.',
    discount: '30% off',
    color: '#EF962D',
    valid_till: 'Valid until June 30, 2021',
    image: 'https://dl.dropbox.com/s/gfvdb5fjtf5bv2e/02.png?dl=0',
  },
  {
    id: '3',
    name: 'Barone LLC.',
    discount: '15% off',
    color: '#00824B',
    valid_till: 'Valid until June 30, 2021',
    image: 'https://dl.dropbox.com/s/1to09m94qho1qmb/03.png?dl=0',
  },
];

export { homeCategories, homeCarousel, promocodes };
