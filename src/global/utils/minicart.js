/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import getVariables from './icons'

const _variables = getVariables('icones')

$(function () {
  
  const minicart = {

    miniCartInit: function () {
      vtexjs.checkout.getOrderForm().done(function (t) {
        minicart.icons()
        minicart.mountCart()
        minicart.isEmptyCart()
        minicart.controlers()
        minicart.update()
        minicart.closeMinicart()
        minicart.listHeight()
        // minicart.verificaAdicaoSubtracaoCart()
        // minicart.verificaValorFreteGratis()
      })
    },

    scrollbarList: function () {
      Scrollbar.init(document.querySelector('.c-minicart__content-list'))
    },
    
    icons: function () {
      $('.c-minicart__header-links .close').prepend(_variables.left)
      $('.c-minicart__empty span').prepend(_variables.bag)
    },

    closeMinicart: function () {
      $('.c-minicart__empty button, .continueToBuy').on('click', function () {
        $('.c-minicart').removeClass('open')
        $('.c-minicart__overlay').removeClass('open')
        $('body').removeAttr('style')
      })
    },

    formatPrice: function (t) {
      return t.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    },

    removeItem: function (t) {
      
      var e = $(t).parents('.c-minicart__box').index() - 1

      vtexjs.checkout.getOrderForm().done(function (t) {
        var r = e,
            i = (t.items[r], [{ index: r, quantity: 1 }])
        return vtexjs.checkout.removeItems(i)
      })
    },

    update: function () {
      $(window).on('orderFormUpdated.vtex', function (t, e) {
        minicart.isEmptyCart(),
        minicart.mountCart()
        
        $('.c-minicart__content-list .c-minicart__box').each(function(){
          var elemNow = $(this).find('.c-minicart__box-title h4:contains("brinde")')
          
          elemNow.parents().eq(2).find('.c-minicart__box-price').hide()
          elemNow.parents().eq(2).find('.c-minicart__box-remove').hide()

        })
      })
    },

    isEmptyCart: function () {
      var t = vtexjs.checkout.orderForm.items.length

      0 == $('.c-minicart__empty').show(),
      t > 0 ? ($('.c-minicart__empty').hide(), $('.c-minicart__badge, .c-minicart__footer').show()) : ($('.c-minicart__footer').hide(), $('.c-minicart__content-title').show())
    },

    checkIndex: function (t, e) {
      $('.c-minicart__box').length > 0
        ? $('.c-minicart__box').each(function () {
            if ($(this).attr('dataskuid') == t) {

              var r = $(this).index(),
                  i = parseInt(e) + parseInt($(this).attr('dataqtd'))
              minicart.updateCart(r, i)

            } else minicart.addToCart(t, e)
          })
        : minicart.addToCart(t, e)
    },

    toggleMinicartTimeout: function () {
      var t = $('.c-minicart')
      
      $(window).width() > 520 && t.addClass('open'),
      setTimeout(function () {
        
        return t.removeClass('open')

      }, 1000)
    },

    addToCart: function (t, e) {
      var r = { id: t, quantity: e, seller: '1' }

      vtexjs.checkout.addToCart([r], null, jssalesChannel).then(function (t) {
        Swal.fire({ type: 'success', title: 'Produto adicionado com sucesso!', showConfirmButton: true, timer: 100 }).then(function () {
          minicart.toggleMinicartTimeout()
        })
      })
    },

    updateCart: function (t, e) {
      vtexjs.checkout.getOrderForm().then(function (r) {

            var i = { index: t, quantity: e }
            return vtexjs.checkout.updateItems([i], null, !1)

        }).then(function () {
          var r = vtexjs.checkout.orderForm.items[t].quantity

          e > r
            ? Swal.fire({ 
                type: 'info',
                title: 'Você já possui o limite deste produto no carrinho',
                showConfirmButton: true,
                timer: 100
              }).then(function () { minicart.toggleMinicartTimeout() })
            : Swal.fire({
                type: 'success',
                title: 'Quantidade atualizada no carrinho',
                showConfirmButton: false,
                timer: 100
              }).then(function () { minicart.toggleMinicartTimeout() })
        })

    },

    mountCart: function () {
      var t = vtexjs.checkout.orderForm.items.length,
          e = (vtexjs.checkout.orderForm.items.length, 0)

      if (t > 0) {
        for (var r = 0; r < t; r++) {
          e += vtexjs.checkout.orderForm.items[r].quantity
        }
      }
      if (0 == vtexjs.checkout.orderForm.totalizers.length) {
        0 == (i = vtexjs.checkout.orderForm.value) && (i = 0)
      } else {
        var i = vtexjs.checkout.orderForm.totalizers[0].value
      }

      $('.quantity-price').html(minicart.formatPrice(i / 100)),
      $('.c-header .cart .qtd-cart').text(e),
      $('.c-minicart__badge').text(e),
      $('.c-minicart__itens').text(e > 1 ? 'produtos' : 'produto'),
      $('.c-minicart__box').remove()

      for (r = 0; r < t; r++) {
        const listPrice = minicart.formatPrice((vtexjs.checkout.orderForm.items[r].listPrice * vtexjs.checkout.orderForm.items[r].quantity) / 100)
        const bestPrice = minicart.formatPrice((vtexjs.checkout.orderForm.items[r].price * vtexjs.checkout.orderForm.items[r].quantity) / 100)
        $(`
          <div class="c-minicart__box" dataprodid="${vtexjs.checkout.orderForm.items[r].productId}" dataskuid="${vtexjs.checkout.orderForm.items[r].id}" dataqtd="${vtexjs.checkout.orderForm.items[r].quantity}">
            <div class="c-minicart__box-image">
              <a href="${vtexjs.checkout.orderForm.items[r].detailUrl}">
                <img src="${vtexjs.checkout.orderForm.items[r].imageUrl.replace('-55-55', '-100-100').replace('http', 'https')}" alt="${vtexjs.checkout.orderForm.items[r].name}" />
              </a>
            </div>
            <div class="c-minicart__box-info">
              <div class="c-minicart__box-info-content">
                <div class="c-minicart__box-title">
                  <a href="${vtexjs.checkout.orderForm.items[r].detailUrl}">
                    <h4>${vtexjs.checkout.orderForm.items[r].name}</h4>
                  </a>
                </div>
                <div class="c-minicart__box-qtdePrice">
                  <div class="c-minicart__box-qtde">
                    <span class="qtde-remove"><i class="fas fa-minus"></i></span>
                    <span class="qtde-value">${vtexjs.checkout.orderForm.items[r].quantity}</span>
                    <span class="qtde-add"><i class="fas fa-plus"></i></span>
                  </div>
                  <div class="c-minicart__box-price">
                    <span class="list-price">
                      ${listPrice}
                    </span>
                    <span class="price">
                      ${bestPrice}
                    </span>
                  </div>
                </div>
              </div>
              <div class="c-minicart__box-remove">
                <i class="far fa-trash-alt"></i>
              </div>
            </div>
          </di>
        `).appendTo('.c-minicart__content-list')
      }

      $('.c-minicart__box-qtde').removeClass('updating'),
        vtexjs.checkout.orderForm &&
        vtexjs.checkout.orderForm.totalizers &&
        vtexjs.checkout.orderForm.totalizers &&
        vtexjs.checkout.orderForm.totalizers[0] &&
        vtexjs.checkout.orderForm.totalizers &&
        vtexjs.checkout.orderForm.totalizers[0].value
          ? $('.c-minicart__value').html(minicart.formatPrice(vtexjs.checkout.orderForm.totalizers[0].value / 100))
          : $('.c-minicart__value').html('R$ 00,00')
    },

    controlers: function () {
      $('body').on('click', '.c-minicart__box-remove', function () {
        minicart.removeItem(this)
      })

      $('body').on('click', '.qtde-add', function () {

        var t = $(this).parents('.c-minicart__box').index() - 1,
            e = vtexjs.checkout.orderForm.items[t].quantity,
            r = vtexjs.checkout.orderForm.items[t].quantity + 1

        $(this).parents('.c-minicart__box').find('.c-minicart__box-qtde').addClass('updating'),
        minicart.updateItem(this, r, t, e)

      })

      $('body').on('click', '.qtde-remove', function () {

        var t = $(this).parents('.c-minicart__box').index() - 1,
            e = vtexjs.checkout.orderForm.items[t].quantity,
            r = vtexjs.checkout.orderForm.items[t].quantity - 1

        $(this).parents('.c-minicart__box').find('.c-minicart__box-qtde').addClass('updating'),
        minicart.updateItem(this, r, t, e)

      })
    },

    updateItem: function (t, e, r, i) {
      var o = r

      vtexjs.checkout.getOrderForm().then(function (t) {
        var r = o,
            i = (t.items[r], [{ index: r, quantity: e }])

        return vtexjs.checkout.updateItems(i)

      }).then(function (t) {

        vtexjs.checkout.orderForm.items[o].quantity < e ? $('.c-minicart__box').eq(o).find('.c-minicart__box-qtde').addClass('limit') : $('.c-minicart__box').eq(o).find('.c-minicart__box-qtde').removeClass('limit')

      })
    },

    verificaValorFreteGratis: function(){
      return setTimeout((function() {
        var subTotal = vtexjs.checkout.orderForm.totalizers
        var newSubTotal = subTotal[0].value

        if (newSubTotal < 39998) {

          var hundredPercent = 39998
          var totalPercent = Math.floor((newSubTotal / hundredPercent) * 100)
          var sum = hundredPercent - newSubTotal
          var newSum = sum

          $('.text-bar').html(`
            <div>
              <span>Faltam </span>
              <span class="valor-moeda">${newSum} </span>
              <span>para Frete Grátis</span>
            </div>
          `)
          
          if (newSum < 10000){
            $('.valor-moeda').mask('R$ #0,00')
          } else if (newSum < 1000){
            $('.valor-moeda').mask('R$ #,00')
          } else if (newSum < 100){
            $('.valor-moeda').mask('R$ 0,##')
          } else {
            $('.valor-moeda').mask('R$ #00,00')
          }

          $('.bar-color').css('width', `${totalPercent}%`)

        } else if (newSubTotal >= 39998) {

          $('.bar-color').css('width', '100%')
          $('.text-bar').html(`
            <div>
              <span><strong>Parabéns!</strong> Você ganhou Frete Grátis</span>
            </div>
          `)

        } else {

          $('.bar-color').css('width', '0%')
          $('.text-bar').html(`
            <div>
              <span>Faltam </span>
              <span class="valor-moeda">R$ 399,99 </span>
              <span>para Frete Grátis</span>
            </div>
          `)

        }
      }), 2000),
      this
    },

    verificaAdicaoSubtracaoCart: function(){
      $(document).on('click', '.qtde-remove, .qtde-add, .c-shelf__selection-button .buy, .c-minicart__box-remove', (function() {
        minicart.verificaValorFreteGratis()
      }))
    },

    listHeight: function (){
      const footterHeight = $('.c-minicart__footer').innerHeight()
      
      $('.c-minicart__content').css('height', `calc(100% - ${footterHeight + 78}px)`)
    }

  }

  minicart.miniCartInit()
})