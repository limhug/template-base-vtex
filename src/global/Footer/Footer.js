import getVariables from '../../global/utils/icons'

const _variables = getVariables('icones')

const main = () => {
  footer()
}

const footer = () => {
  $(function () {
  
    const footerComponent = {
      init: function () {
        footerComponent.icons()
      },

      icons: function () {
        
      },
      
    }
  
    footerComponent.init()
  })
}

export default main