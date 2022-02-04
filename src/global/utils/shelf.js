/* eslint-disable no-undef */
import getVariables from './icons'

const _variables = getVariables('icones')

$(function () {
  
  const shelf = {
    init: function () {
      shelf.pricePercent()
      shelf.listShelf()
      shelf.ofertaDoDia()
      shelf.variantesCompraRapida()
      shelf.shelfCarousel()
    },

    pricePercent: function () {
      $('.c-shelf').each(function () { 
        const valInitial = parseFloat($(this).find('.c-shelf__info-listPrice').text().replace('R$ ', '').replace('.', '').replace(',', '.'))
        const valFinish = parseFloat($(this).find('.c-shelf__info-bestPrice').text().replace('R$ ', '').replace('.', '').replace(',', '.'))
        const percentage = Math.round((valFinish - valInitial) * 100 / valInitial).toString().replace('-', '')
  
        $(this).find('.percentage').html(`${percentage}% Off`)
      })
    },

    listShelf: function () {
      $('.c-productVitrine ul').eq(0).addClass('c-productVitrine__content-list')
    },

    ofertaDoDia: function () {
      if ($('.flag.oferta-do-dia').length == 1) {
        $('.flag.oferta-do-dia').append(`
          <div class="c-countdown">
            <div class="c-countdown__icon">${_variables.clock}</div>
            <div id="timerCountdown" class="c-countdown__info">
              <span class="c-countdown__info-message">Esta oferta expira em:</span>
              <div class="c-countdown__info-clock">
                <div class="c-countdown__info-item hour">
                  <span class="number"></span>
                  <span class="text">hor</span>
                </div>
                <div class="dot">:</div>
                <div class="c-countdown__info-item min">
                  <span class="number"></span>
                  <span class="text">min</span>
                </div>
                <div class="dot">:</div>
                <div class="c-countdown__info-item seg">
                  <span class="number"></span>
                  <span class="text">seg</span>
                </div>
              </div>
            </div>
          </div>
        `)
  
        setInterval(function time() {
          var d = new Date()
          var hours = 23 - d.getHours()
          var min = 59 - d.getMinutes()
          if ((hours + '').length == 1) {
            hours = '0' + hours
          }
          if ((min + '').length == 1) {
            min = '0' + min
          }
          var sec = 59 - d.getSeconds()
          if ((sec + '').length == 1) {
            sec = '0' + sec
          }
          $('#timerCountdown .hour .number').html(hours)
          $('#timerCountdown .min .number').html(min)
          $('#timerCountdown .seg .number').html(sec)
        }, 1000)
      }
    },

    variantesCompraRapida: function () {
      setTimeout(function () {
        $('.c-shelf').not('.c-shelf__ajax-completed').each(function (index, el) {
          var _element = $(this)
              _element.addClass('c-shelf__ajax-completed'),
              _element.find('.c-shelf__selection').prepend(`
                <div class="list-skus-hidden"></div>
                <ul class="c-shelf__selection-colors"></ul>
              `)

          var _product_id = _element.find('.c-shelf__id').val()
          
          var avSku

          vtexjs.catalog.getProductWithVariations(_product_id).done(function (product) {
            avSku = product.skus

            var colorName = product.dimensionsMap.Cor

            for (var j = 0; j < avSku.length; j++) {
              var avColor = avSku[j].dimensions.Cor
              var avSize = avSku[j].dimensions.Tamanho
              var skuVtex = avSku[j].sku
              var skuAvailable = avSku[j].available
              
              _element.find('.list-skus-hidden').append(`
                <input class="hidden-select" type="hidden" data-id="${skuVtex}" data-color="${avColor}" data-size="${avSize}" data-available="${skuAvailable}" />
              `)
            }

            for (var i = 0; i < colorName.length; i++) {
              var _color_name = colorName[i]

              if (_color_name !== undefined) {
                _element.find('.c-shelf__selection-colors').prepend(`
                  <li class="${_color_name}" data-color="${_color_name}">${_color_name}</li>
                `)
              }

            }
            
            for (var k = 0; k < avSku.length; k++) {
              var _Size = avSku[k].dimensions.Tamanho
              var _SizeAvaileble = avSku[k].available

              if (_Size !== undefined) {
                _element.find('.c-shelf__selection-variations').prepend(`
                  <li class="prod-size ${_Size} ${_SizeAvaileble}" data-size="${_Size}">${_Size}</li>
                `)
              }
            }
          })

          $(document).on('click', '.c-shelf__selection-variations li, .c-shelf__selection-colors li', function () {
            
            $(this).parent().find('li').removeClass('active'),
            $(this).addClass('active')
            
            _element.find('.c-shelf__selection-button .buy').removeAttr('href')

          })

          _element.find('.c-shelf__selection-button').hover(function () {

            var selectorSize = $('.c-shelf__selection-variations li.active').attr('data-size')
            var selectorColor = $('.c-shelf__selection-colors li.active').attr('data-color')

            _element.parent().find(`
              .list-skus-hidden input[data-size="${selectorSize}"][data-color="${selectorColor}"]
            `).addClass('selected')

          })

          _element.find('.c-shelf__selection-button').click(function () {
            var _sku = _element.parent().find('.selected')

            if (_sku.attr('data-available') == 'false') {

              alert('Produto não disponível nesta combinação')

              $('.list-skus-hidden input').removeClass('selected')
              _element.parent().find('li').removeClass('active')

            } else {

              if (_sku.length) {
                var item = {
                  id: _sku.attr('data-id'),
                  quantity: '1',
                  seller: '1',
                }
                
                vtexjs.checkout.addToCart([item]).done(function () {

                  $('.c-minicart').addClass('open'),
                  $('.c-minicart__overlay').addClass('open')
                  
                  setTimeout(function () {
                    $('.c-minicart').removeClass('open')
                    $('.c-minicart__overlay').removeClass('open')
                  }, 5000)

                })

                $('.list-skus-hidden input').removeClass('selected')
                _element.parent().find('li').removeClass('active')

              } else {

                alert('Selecione uma cor e um tamanho.')

              }
            }
          })
        })
      }, 2000)
    },

    shelfCarousel: function () {
      $('.c-productVitrine__navigation-prev').append(_variables.left)
      $('.c-productVitrine__navigation-next').append(_variables.right)

      $('.c-productVitrine .helperComplement').remove()

      const shelf = $('.c-productVitrine__content-list')
      
      shelf.owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        margin: 15,
        responsive: {
          0: {
            items: 1
          },
          576: {
            items: 2
          },
          768: {
            items: 2
          },
          992: {
            items: 3
          },
          1200: {
            items: 3
          },
          1400: {
            items: 4,
            loop: false
          }
        }
      })

      $('.c-productVitrine__navigation-prev').on('click', function(){
        shelf.trigger('prev.owl.carousel')
      })

      $('.c-productVitrine__navigation-next').on('click', function(){
        shelf.trigger('next.owl.carousel')
      })
    },
  }

  shelf.init()
})