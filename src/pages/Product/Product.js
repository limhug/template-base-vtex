/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import './Product.scss'

// import ProductImage from '../../global/utils/productImages'
// import CepCalc from '../../global/utils/CepCalc'
import getVariables from '../../global/utils/icons'

const _variables = getVariables('icones')

$(function () {
  // new ProductImage
  // new CepCalc($('.info__delivery'))

  const pageProduct = {
    init: function () {
      pageProduct.icons()
      // pageProduct.descriptionText()
      // pageProduct.variations()
      // pageProduct.qtdProd()
      // pageProduct.fixFrete()
    },

    icons: function () {
      
    },

    descriptionText: function () {
      const description = $('.productDescription')
      const descriptionHeight = $('.productDescription').height()

      if (descriptionHeight > 100){
        description.addClass('close')
        $('.info__description-more').append('<div class="btn-more">Leia mais</div>')
      }

      $('.btn-more').click(function(){
        description.addClass('open')
        description.css('height', descriptionHeight + 10)
        $(this).remove()
      })
    },

    variations: function () {
      $('.info__variations .Tamanho .specification').html('Tamanhos disponíveis')
      $('.info__variations').append('<div class="info__variations-quantity">')
      
      vtexjs.catalog.getCurrentProductWithVariations().done(function(product){
        $('.info__variations .Tamanho .dimension-Tamanho').each(function (index){

          $(this).on('click', function(){
            if (product.skus[index].availablequantity < 3){
              $('.info__variations-quantity').html(`
                <div class="text">
                  ${_variables.exclamation}
                  <span>
                    Somente ${product.skus[index].availablequantity} ${product.skus[index].availablequantity >= 1 ? 'disponíveis' : 'disponível'}
                  </span>
                </div>
              `)
            }
          })

        })
      })

      $('.info__variations .Tamanho .dimension-Tamanho').on('click', function(){
      })
    },

    qtdProd: function () {
			if ('abc' == 'abc') {
				setTimeout(function () {
					$('.qtdPrateleira .btnAcr').click(function () {

						var atual = parseInt($(this).prev('.qtdVal').val())
						atual = atual + 1
						$(this).prev('.qtdVal').val(atual)
					})

					$('.qtdPrateleira .btnDec').click(function () {
						var atual = parseInt($(this).next('.qtdVal').val())
            
						if (atual == 1) {
							$(this).next('.qtdVal').val('1')
						} else {
							atual = atual - 1
							$(this).next('.qtdVal').val(atual)
						}
					})

					$('.qtdPrateleira .qtdVal').bind('keyup blur focus', function (e) {
						e.preventDefault()
						var expre = /[^\d]/g
						$(this).val($(this).val().replace(expre, ''))
					})
				}, 200)

				// Prod
				$('.page-product .info__buy .buy-button').click(function (event) {
					event.preventDefault()
					var hrefCart = $(this).attr('href')
					var qtd = $(this).parent().parent().parent().find('.qtdPrateleira .qtdVal').val()

					if (qtd == '') {
						qtd = '1'
					}

					if (hrefCart == 'javascript:alert("Por favor, selecione o modelo desejado.");') {

						Swal.fire({
							icon: 'warning',
							title: 'Por favor, selecione o modelo desejado.',
							toast: 'true',
							position: 'bottom-end',
							showConfirmButton: false,
							showCloseButton: 'true',
							timerProgressBar: 'true',
							timer: '3000'
						})

					} else {
						var res = hrefCart.replace('qty=1', 'qty=' + qtd)
						var resUTL = res.split('sku=').pop().split('&qty=').shift()
            
						setTimeout(function () {
							vtexjs.checkout.getOrderForm().then(function () {
								var item = {
									id: resUTL,
									quantity: qtd,
									seller: 1
								}

								vtexjs.checkout.addToCart([item]).done(function (orderForm) {

									Swal.fire({ 
                    toast: 'true', 
                    position:'bottom-end', 
                    icon: 'success', 
                    timerProgressBar:'true', 
                    showCloseButton: 'true', 
                    showConfirmButton: false,
                    title: 'Produto adicionado ao carrinho', 
                    timer: '2000'
                  })

									vtexjs.checkout.getOrderForm().done(function (e) {
                    var qtdCart = e.items.length
                    $('.info-cart .qtd-cart').html(qtdCart)
									})

									$('.minicart').addClass('open'),
                  $('.minicart__overlay').addClass('open'),

                  setTimeout(function () {
                    $('.minicart').removeClass('open')
                    $('.minicart__overlay').removeClass('open')
                  }, 5000)
								})

							})
						})
					}
				})
			}
		},

    fixFrete: function () {
      $(window).load(function () {
        $('#txtCep').attr('placeholder', '00000-000')
        $('#txtCep').attr('autocomplete', 'none')
        $('#txtCep').attr('autocomplete', 'off')
        $('#txtCep').on('focus click', function () {
          $(this)[0].setSelectionRange(0, 0)
        })
      })
    },
  }

  pageProduct.init()

})
