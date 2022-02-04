/* eslint-disable no-undef */
import getVariables from '../../global/utils/icons'

const _variables = getVariables('icons')

class cepCalculator {
  constructor(element) {
    this.element = element
    this.createStructure()
    this.selectors()
    this.events()
  }

  createStructure() {
    let wrapperCep = `
			<div class="productCep">
        <span class="productCep__title active">
          Calcule o frete e prazo de entrega!
        </span>
				<fieldset>
					<div class="productCep__form">
            <div class="productCep__form-calculate">
              <div class="form">
                <input id="productCep-valorCep" type="number" class="productCep__valorCep" max="8" placeholder="Digite seu CEP"></input>
                <button class="productCep__submit-cep">Calcular</button>
              </div>
              <a class="productCep__form-link active" href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank">Não sei o CEP</a>
            </div>
						<span class="productCep__precoFrete"></span>
					</div>
				</fieldset>
				<button class="productCep__refreshCalc">Trocar o CEP</button>
			</div>
		`

    this.element.html(wrapperCep)
  }

  selectors() {
    this.inputCep = this.element.find('.productCep__valorCep')
    this.submitBtn = this.element.find('.productCep__submit-cep')
    this.refreshBtn = this.element.find('.productCep__refreshCalc')
  }

  events() {
    const _this = this

    this.submitBtn.click(() => {
      _this.readZip()
    })
  }

  readZip() {
    let postalCode = this.inputCep.val()
    let resultZip = this.getZip(postalCode)

    resultZip
      .then((resultado) => {
        let slas = resultado[0].slas
        let slasQtd = slas.length

        if ($('.productCep__error').length > 0) {
          $('.productCep__error').fadeOut('fast')

          setTimeout(() => {
            $('.productCep__error').remove()
          }, 500)
        }

        if (slasQtd > 0) {
          let tableContainer = `
            <div class="productCep__header">
              <div class"title valor">Valor</div>
              <div class"title entrega">Tipo de entrega</div>
            </div>
            <div class="productCep__content">
              <div class="productCep__content-delivery"></div>
              <div class="productCep__content-retire"></div>
            </div>
          `
          $(tableContainer).insertBefore('.productCep__refreshCalc')

          for (let index = 0; index < slas.length; index++) {
            let zipName = slas[index].id
            let zipType = slas[index].deliveryChannel
            let zipPrice = parseFloat(slas[index].price / 100).toFixed(2).replace('.', ',')
            zipPrice = 'R$ ' + zipPrice

            let zipEstimate = slas[index].shippingEstimate
            let zipNameRetire = zipName.indexOf('(') - 1
            const zipNameNew = zipName.slice(0, zipNameRetire)

            let tableDeliveryContent = `
              <div class="item ${zipType}">
                <div class="icon">
                  <i class="fas fa-truck"></i>
                </div>
                <div class="info">
                  <div class="entrega"><strong>${zipName}</strong></div>
                  <div class="time">
                    <div class="estimativa">${zipEstimate.replace('bd', '')} dias úteis -</div>
                    <div class="valor">${zipPrice == 'R$ 0,00' ? 'Frete Grátis' : zipPrice}</div>
                  <div>
                <div>
              </div>
						`

            let tableRetireContent = `
              <div class='item ${zipType}'>
                <div class='icon'>
                  ${_variables.store}
                </div>
                <div class='info'>
                  <div class='entrega'><strong>${zipNameNew}</strong></div>
                  <div class='time'>
                    <div class='estimativa'>${zipEstimate.replace('bd', '')} dia útil -</div>
                    <div class='valor'>${zipPrice == 'R$ 0,00' ? 'Frete Grátis' : zipPrice}</div>
                  <div>
                <div>
              </div>
						`

            if (zipType == 'delivery') {
              $(tableDeliveryContent).appendTo('.productCep__content-delivery')
            } else {
              $(tableRetireContent).appendTo('.productCep__content-retire')
            }
          }
        }

        this.emptyZip()
      })
      .catch((error) => {
        if ($('.productCep__error').length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Não foi possível calcular o CEP!',
            toast: 'true',
            position: 'top-end',
            showConfirmButton: false,
            timerProgressBar: 'true',
            timer: '3000'
          })
        }
        return console.log(error)
      })
  }

  emptyZip() {
    let refreshContainer = $('.productCep__refreshCalc')
    $('.productCep__submit-cep, .productCep__valorCep').fadeOut('fast')
    refreshContainer.addClass('active')
    $('.productCep__title, .productCep__form-link').removeClass('active')

    refreshContainer.on('click', (event) => {
      event.preventDefault()

      refreshContainer.removeClass('active')
      $('.productCep__valorCep').val('')

      $('.productCep__header, .productCep__content').fadeOut('fast')
      setTimeout(() => {
        $('.productCep__header, .productCep__content').remove()
        $('.productCep__submit-cep, .productCep__valorCep').fadeIn('fast')
        $('.productCep__title, .productCep__form-link').addClass('active')
      }, 500)
    })
  }

  getZip(zipCode) {
    this.zipCode = zipCode
    let postalCode = this.zipCode
    let idOrderForm = window.vtexjs.checkout.orderForm.orderFormId
    let urlFreight = '/api/checkout/pub/orderForm/' + idOrderForm + '/attachments/shippingData'
    let data = { address: { postalCode: postalCode, country: 'BRA' } }

    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          'Content-Type': 'application/json',
        },
        url: urlFreight,
        type: 'POST',
        data: JSON.stringify(data),
      })
        .done(function sucesso(value) {
          resolve(value.shippingData.logisticsInfo)
        })
        .fail(function (value) {
          reject(value)
        })
    })
  }
}

export default cepCalculator
