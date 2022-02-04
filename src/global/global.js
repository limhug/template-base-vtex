import header from './Header/Header'
import footer from './Footer/Footer'

import './global.scss'

const main = () => {
  header()
  footer()
}

document.addEventListener('DOMContendLoaded', main())
