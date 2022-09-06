/* eslint-disable no-undef */
import './Department.scss'

import getVariables from '../../global/utils/icons'

const _variables = getVariables('icones')

$(function () {

  const pageDepartment = {
    init: function () {
      pageDepartment.icons()
      // pageDepartment.listShelf()
      pageDepartment.removeHelperComplement()
      pageDepartment.openFilter()
      pageDepartment.closeFilter()
      pageDepartment.orderBy()
      pageDepartment.openSelectOrder()
      pageDepartment.createAppliedFilters()
      pageDepartment.smartResearch()
    },

    icons: function () {
      $('.page-department .filters__content-header').append(_variables.close)
      $('.page-department .filters__link').append(_variables.down)
      $('.page-department .orderBy__title').append(_variables.down)
      $('.page-department .clear-filter-btn').prepend('<i class="far fa-trash-alt"></i>')
    },

    listShelf: function () {
      $('.page-department .shelf ul').addClass('list__shelf-list')
      $('.page-department .list__shelf-list li').addClass('list__shelf-item')

    },
    
    removeHelperComplement: function(){
      $('.page-department .helperComplement').remove()
    },

    openFilter: function (){
      if ($(window).width() < 767.98){
        $('.filters__content').removeAttr('style')

        $('.filters__link').on('click', function(){
          $('.filters__content').addClass('active')
          $('.mask').addClass('active')
        })
      } else {
        $('.filters__link').on('click', function(){
          $('.filters__content').slideDown('fast')
        })
      }
    },

    closeFilter: function (){
      if ($(window).width() < 767.98){
        $('.filters__content-header .icon-close, .filters__content-body label').on('click', function(){
          $('.filters__content').removeClass('active')
          $('.mask').removeClass('active')
        })
      } else {
        $('.filters__content-header .icon-close, .filters__content-body label').on('click', function(){
          $('.filters__content').slideUp('fast')
        })
      }
    },

    orderBy: function (){
      let urlParams = window.location.search
      urlParams = urlParams.replace('?', '')
      urlParams = urlParams.split('&')
  
      //remove parametro de ordenação
      let copyParamns = urlParams.filter((item) => {
        return item.indexOf('O=') === -1
      })
      urlParams = copyParamns.join('&')
  
      $('.orderBy__box a').each((i, link) => {
        let orderBy = link.dataset.value.replace('?', '')
        link.setAttribute('href', `${window.location.pathname}?${urlParams}&${orderBy}${window.location.hash}`
        )
      })
    },

    openSelectOrder: function () {
      $('.page-department .orderBy .orderBy__title').on('click', function (e) {
        let element = e.currentTarget
        $(element).toggleClass('open')
        $(element).siblings('.orderBy__box').slideToggle('fast')
      })
    },

    variantesCompraRapida: function () {
      setTimeout(function () {
        $('.shelf').not('.shelf__ajax-completed').each(function (index, el) {
          var _element = $(this)
              _element.addClass('shelf__ajax-completed'),
              _element.find('.shelf__selection').prepend(`
                <div class="list-skus-hidden"></div>
                <ul class="shelf__selection-colors"></ul>
              `)

          var _product_id = _element.find('.shelf__id').val()
          
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
                _element.find('.shelf__selection-colors').prepend(`
                  <li class="${_color_name}" data-color="${_color_name}">${_color_name}</li>
                `)
              }

            }
            
            for (var k = 0; k < avSku.length; k++) {
              var _Size = avSku[k].dimensions.Tamanho
              var _SizeAvaileble = avSku[k].available

              if (_Size !== undefined) {
                _element.find('.shelf__selection-variations').prepend(`
                  <li class="prod-size ${_Size} ${_SizeAvaileble}" data-size="${_Size}">${_Size}</li>
                `)
              }
            }
          })

          $(document).on('click', '.shelf__selection-variations li, .shelf__selection-colors li', function () {
            
            $(this).parent().find('li').removeClass('active'),
            $(this).addClass('active')
            
            _element.find('.shelf__selection-button .buy').removeAttr('href')

          })

          _element.find('.shelf__selection-button').hover(function () {

            var selectorSize = $('.shelf__selection-variations li.active').attr('data-size')
            var selectorColor = $('.shelf__selection-colors li.active').attr('data-color')

            _element.parent().find(`
              .list-skus-hidden input[data-size="${selectorSize}"][data-color="${selectorColor}"]
            `).addClass('selected')

          })

          _element.find('.shelf__selection-button').click(function () {
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

                  $('.minicart').addClass('open'),
                  $('.minicart__overlay').addClass('open')
                  
                  setTimeout(function () {
                    $('.minicart').removeClass('open')
                    $('.minicart__overlay').removeClass('open')
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

    smartResearch: function () {
      if ($('.page-department').length === 1){
        $(".page-department .js-filter input[type='checkbox']").vtexSmartResearch({
          pageLimit:null, // Número máximo de páginas que o script irá retornar. Exemplo "pageLimit=3" só será retornado resultados até a terceira página
          loadContent:'.shelf[id^=ResultItems]', // Elemento que esta em volta da(s) prateleira(s) de produtos.
          shelfClass:'.shelf', // Pratelira de produtos (filha do elemento definido de um 'loadContent')
          filtersMenu:'.search-multiple-navigator', // Menu com os filtros
          linksMenu:'.search-single-navigator', // Menu de links
          menuDepartament:'.navigation .menu-departamento', // seletor do menu da página de departamentos
          clearButtonClass: '.clear-filter-btn',
          mergeMenu:true, // Define se o menu de links será mesclado com o de filtros será mesclado na página de departamento
          insertMenuAfter:'.search-multiple-navigator h3:first', // O menu de links será inserido após este elemento
          emptySearchElem:jQuery('<div class="vtexsr-emptySearch"></div>'), // Elemento Html (em Objeto jQuery) no qual será adicionado a mensagem de busca vazia
          elemLoading:'<div id="scrollLoading">Carregando produtos...</div>', // Elemento com mensagem de carregando ao iniciar a requisição da página seguinte
          returnTopText:'<span class="text">Voltar</span><span class="text2">ao topo</span>', // Mensagem de "retornar ao topo"
          emptySearchMsg:'<h3>Esta combinação de filtros não retornou nenhum resultado!</h3>', // Html com a mensagem para ser apresentada quando não existirem resultados para os filtros selecionados
          filterErrorMsg:'Houve um erro ao tentar filtrar a página!', // Mensagem de erro exibida quando existe algum erro de servidor ao aplicar os filtros
          searchUrl:null, // Url da página de busca (opicional)
          usePopup:false, // Opção p/ definir se deseja que a mensagem de não localizado seja exibida em um popup
          showLinks:true, // Exibe o menu de links caso o de filtro não seja encontrado
          popupAutoCloseSeconds:3, // Caso esteja utilizando popup, defina aqui o tempo para que ele feche automaticamente
          // Função que retorna o valor p/ onde a página deve rolar quando o usuário marca ou desmarca um filtro
          filterScrollTop:function(shelfOffset){
            return (shelfOffset.top - 330)
          },
          callback:function(){},
          // Cálculo do tamanho do conteúdo/vitrine para que uma nova página seja chamada antes do usuário chegar ao "final" do site
          getShelfHeight:function(container){
            return (container.scrollTop() + container.height())
          },
          // Callback após inserir a prateleira na página
          shelfCallback:function(){
            pageDepartment.variantesCompraRapida()
          },
          // Callback em cada requisição Ajax (Para requisições feitas com sucesso)
          // Recebe como parâmetro um objeto contendo a quantidade total de requisições feitas e a quantidade de filtros selecionados
          ajaxCallback:function(){
            pageDepartment.variantesCompraRapida()
          },
          // Função que é executada quando a seleção de filtros não retorna nenhum resultado
          // Recebe como parâmetro um objeto contendo a quantidade total de requisições feitas e a quantidade de filtros selecionados
          emptySearchCallback:function(){},
          // Função para permitir ou não que a rolagem infinita execute na página esta deve retornar "true" ou "false"
          // Recebe como parâmetro um objeto contendo a quantidade total de requisições feitas e a quantidade de filtros selecionados
          authorizeScroll:function(){return true},
          // Função para permitir ou não que o conteúdo de "loadContent" seja atualizado. Esta deve retornar "true" ou "false"
          // Recebe como parâmetro um objeto contendo a quantidade total de requisições feitas e a quantidade de filtros selecionados
          authorizeUpdate:function(){return true},
          // Callback de cada laço percorrendo os fildsets e os labels. Retorna um objeto com algumas informações
          labelCallback:function(data){}
        })
      }
    },

    createAppliedFilters: function() {

      let btnClearFilter = $('.page-department .clear-filter-btn').clone(true, true)

      $('.page-department .list__tags').html(`
        <div class='applied-filter'>
          <div id='filters'>
          </div>
        </div>
      `)

      $('.page-department .list__tags').append(btnClearFilter)

      $('.page-department .list__tags .clear-filter-btn').on('click', function () {
        $('.applied-filter__item').remove()
        $('.list__tags').removeClass('active')
      })
  
      const appliedFiltersElement = $('.applied-filter')
  
      $(document).on('change', 'input', function () {

        if (!this.checked) {
          $(`[id="${this.name}"]`).remove()
        }
        const checkedFilters = $('.multi-search-checkbox:checked')

        const checkedFiltersLength = checkedFilters.length

        if (checkedFiltersLength <= 0){
          $(appliedFiltersElement).removeClass('applied-filter--draw')
          $('.navigation-tabs').removeClass('navigation-tabs--smaller')
          $('.list__tags').removeClass('active')
        } else {
          $(appliedFiltersElement).addClass('applied-filter--draw')
          $('.navigation-tabs').addClass('navigation-tabs--smaller')
          $('.list__tags').addClass('active')
        }

        $('#applied-filters-title').text(
          `Filtros selecionados (${checkedFiltersLength}):`
        )
  
        checkedFilters.each((idx, el) => {
          const text = el.parentElement.innerText
          const name = el.name
  
          if ($(`[id='${name}']`).length === 0) {
            $('<span>', {
              text: text,
              id: name,
              class: 'applied-filter__item',
              click: function () {
                $(`input[name="${$(this).attr('id')}"]`)
                  .prop('checked', false)
                  .trigger('change')
                $(this).remove()
              },
            }).appendTo('#filters')
          }
        })
      })
    },

    filterMobileExtraInfo() {
      var atualizarContagemDeFiltrosAtivos = function () {
        var opcoesFiltro = $('.search-multiple-navigator .multi-search-checkbox')
        var qtd = 0
  
        for (var i in opcoesFiltro) {
          var opcao = opcoesFiltro[i]

          if (opcao.checked) {
            qtd++
          }
        }
  
        var button = $('#open-filter-button')
  
        if (qtd > 0) {
          button.find('span').remove()
          $('<span/>', { text: '(' + qtd + ')' }).appendTo(button)
  
          $('.list__tags .clear-filter-btn').addClass('active')
        } else {
          button.find('span').remove()
          $('.list__tags .clear-filter-btn').removeClass('active')
        }
      }
  
      //Para browsers que mantém os checkboxes selecionados ao atualizar a página
      atualizarContagemDeFiltrosAtivos()
  
      //	Limpa Filtros
      $('.aply-filter-btn').on('click', function () {
        atualizarContagemDeFiltrosAtivos()
      })
  
      $('.page-department .list__tags .vsr-clean-all-filter').on('click', function () {
        $('#open-filter-button').find('span').remove()

        $('.multi-search-checkbox').each(function () {
          if ($(this).is(':checked')) {
            $(this).attr('checked', false).trigger('change')
          }
        })

        $(this).removeClass('active')
      })
    },

    createCategoryFilter() {
      let departmentFilter = $('<fieldset />', { class: 'refino links-departamento' })
      let list = $('<div />')
      let navSingle = $('.search-single-navigator')
      let subcategories = navSingle.find('h4,h3,h5')
  
      subcategories.each(function (i, li) {
        let item = $('<label />', {
          class: 'item',
        });
  
        if ($(li).find('a').length > 0) {
          let link = $(li).find('a')
          link.text(link.attr('title'))
          item.html(link)
          item.appendTo(list)
        }
      })
  
      $('<h5 />', {
        text: 'Categoria',
      }).appendTo(departmentFilter)
  
      list.appendTo(departmentFilter)
  
      return departmentFilter
    }
  }

  pageDepartment.init()

})
