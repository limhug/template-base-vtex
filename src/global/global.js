import header from './Header/Header'
import footer from './Footer/Footer'

// import './utils/vtexSmartResearch'
// import './utils/breadcrumb'
// import './utils/minicart'
// import './utils/shelf'

import './global.scss'

const main = () => {
  header()
  footer()
}

document.addEventListener('DOMContendLoaded', main())
