import getVariables from '../../global/utils/icons'

const _variables = getVariables('icones')

const main = () => {
  header()
}

const header = () => {
  $(function () {
  
    const headerComponent = {
      init: function () {
        headerComponent.icons()
      },

      icons: function () {
        
      },
    }
  
    headerComponent.init()
  })
}

export default main