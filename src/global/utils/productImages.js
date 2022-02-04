import getVariables from '../../global/utils/icons'

const _variables = getVariables('productImage')

function createMobile($element, $thumbs) {

  let htmlItems = ''

  if ($(window).width() < 992 && !$('.product-image-mobile').length) {

    $.each($thumbs.find('li a'), function () {
      var $this = $(this)
      var url = $this.attr('rel')

      htmlItems += '<li class="product-image-mobile-item"><img class="img-fluid" src="' + url + '" /></li>'
    })

    if (htmlItems !== '') {
      $element.find('#show').after(`
        <div class="product-image-mobile d-block d-lg-none">
          <ul id="product-image-mobile-carousel">
            ${htmlItems}
          </ul>
        </div>
      `)
    }

    $('#product-image-mobile-carousel').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: _variables.prevArrow,
      nextArrow: _variables.nextArrow,
    })

  }
}

function setThumbs($thumbs, config) {
  if ($thumbs.find('li').length > 4) {

    let thumbsConfig = {
      dots: false,
      slidesToShow: 4,
      slidesToScroll: 4,
      prevArrow: _variables.prevArrow,
      nextArrow: _variables.nextArrow,
    }

    if (config.thumbVertical) {
      thumbsConfig['vertical'] = true
      thumbsConfig['centerMode'] = false
      thumbsConfig['slidesToShow'] = 4
      thumbsConfig['slidesToScroll'] = 4
    }

    if (thumbsConfig !== null && $.fn.slick && $thumbs.length) {
      $thumbs.slick(thumbsConfig)
    }

  }
}

export default function productImage(element = '[data-image="product-image"]') {

  if (element !== undefined && element !== null && $(element).length) {

    let $element = $(element)
    let $thumbs = $element.find('.thumbs')

    let config = { ..._variables }
    let dataConfig = $element.attr('data-config')

    if (dataConfig !== undefined && dataConfig !== null && dataConfig !== '') {
      dataConfig = dataConfig.replace(/\'/g, '"')
      config = { ..._variables, ...JSON.parse(dataConfig) }
    }

    if (config.mobile) {
      $(window).resize(function () {
        createMobile($element, $thumbs)
      })

      createMobile($element, $thumbs)
      $element.find('#show').addClass('d-none d-lg-block')
    }

    setThumbs($thumbs, config)

    let targetNode = document.querySelector('#include > #image')
    
    var callback = function () {
      if (config.mobile) {
        $('.product-image-mobile').remove()
        createMobile($element, $thumbs)
      }

      if ($thumbs.find('> li').length) {
        $thumbs.removeClass('slick-initialized slick-slider slick-vertical')
        setThumbs($thumbs, config)
      }
    };

    var observer = new MutationObserver(callback)
    observer.observe(targetNode, { childList: true })

  }
}