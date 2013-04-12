
/* MISC FUNCTIONS */

function resetEverything() {
  resetIsotope($.myElems.list);
  window.canvasCount = 0;
  window.colors = [];
  $(document.getElementById('sort-by')).find('.selected').removeClass('selected');
  $(document.getElementById('sort-direction')).find('.selected').removeClass('selected');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSide() {
  var widths = new Array(100, 220, 330);
  var i = getRandomInt(0,1);
  return widths[i];
}

/* ISOTOPE FUNCTIONS */

function initIsotope($container) {
  $container.isotope({
    itemSelector : '.iso',
    layoutMode: 'masonry',
    masonry: {
      columnWidth : 120
    },
    getSortData : {
      rIndex : function ( $elem ) {
        return parseInt($elem.attr('r-index'));
      },
      gIndex : function ( $elem ) {
        return parseInt($elem.attr('g-index'));
      },
      bIndex : function ( $elem ) {
        return parseInt($elem.attr('b-index'));
      },
      hIndex : function ( $elem ) {
        return parseInt($elem.attr('h-index'), 16);
      },
      xIndex : function ( $elem ) {
        return $elem.attr('x-index');
      }
    }
  });
  var $optionSets = $('#options .option-set'),
  $optionLinks = $optionSets.find('a');

  $optionLinks.click(function(){
    var $this = $(this);
    // don't proceed if already selected
    if ( $this.hasClass('selected') ) {
      return false;
    }
    var $optionSet = $this.parents('.option-set');
    $optionSet.find('.selected').removeClass('selected');
    $this.addClass('selected');

    // make option object dynamically, i.e. { filter: '.my-filter-class' }
    var options = {},
    key = $optionSet.attr('data-option-key'),
    value = $this.attr('data-option-value');
    // parse 'false' as false boolean
    value = value === 'false' ? false : value;
    options[ key ] = value;
    if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
      // changes in layout modes need extra logic
      changeLayoutMode( $this, options )
    } else {
      // otherwise, apply new options
      $container.isotope( options );
    }
    return false;
  });

  // change size of clicked element
  $container.delegate( '.element', 'click', function(){
    $(this).toggleClass('large');
    $container.isotope('reLayout');
  });
}

function resetIsotope($container) {
  $container.empty();
  $container.isotope('destroy');
  initIsotope($container);
}

function shuffleIsotope() {
  $.myElems.list.isotope('shuffle');
}

function getRandomColor() {
  var roof = 254;
  var floor = 1;
  var result = new Array();
  result['r'] = Math.floor((Math.random()*(roof-floor))+floor);
  result['g'] = Math.floor((Math.random()*(roof-floor))+floor);
  result['b'] = Math.floor((Math.random()*(roof-floor))+floor);
  var hex = rgbToHex(result['r'],result['g'],result['b']);
  if ($.inArray(hex, window.colors) == -1) {
    window.colors.push(hex);
    return result;
  }
  else {
    return getRandomColor();
  }
}

function rgbToHex(R, G, B) {
  var RS = R.toString(16);
  var GS = G.toString(16);
  var BS = B.toString(16);
  RS = (RS.length > 1 ? RS : '0' + RS);
  GS = (GS.length > 1 ? GS : '0' + GS);
  BS = (BS.length > 1 ? BS : '0' + BS);
  return ("#" + RS + GS + BS);
};

function invertColor(hexTripletColor) {
  var color = hexTripletColor;
  color = color.substring(1);           // remove #
  color = parseInt(color, 16);          // convert to integer
  color = 0xFFFFFF ^ color;             // invert three bytes
  color = color.toString(16);           // convert to hex
  color = ("000000" + color).slice(-6); // pad with leading zeros
  color = "#" + color;                  // prepend #
  return color;
}

function getBaseColor(colArray){
  var maxX = Math.max(colArray['r'],colArray['g'],colArray['b']);
  if (colArray['r'] == maxX) {
    return 'red';
  }
  if (colArray['g'] == maxX) {
    return 'green';
  }
  if (colArray['b'] == maxX) {
    return 'blue';
  }
}

function generate() {
  var width = 100;
  var height = 100;
  var $elem;
  var $canvas;
  var bgcolor, fgcolor;
  var hexstring, rgbstring;
  var tiles = $('#tiles:checked').val();
  for (var i=window.canvasCount;i<window.canvasCount+20;i++) {
    if (!tiles) {
      height = getRandomSide();
      width = getRandomSide();
    }
    bgcolor = getRandomColor();
    hexstring = rgbToHex(bgcolor['r'],bgcolor['g'],bgcolor['b']);
    fgcolor = invertColor(hexstring);
    rgbstring = "rgb("+bgcolor['r']+","+bgcolor['g']+","+bgcolor['b']+")";
    var x = getBaseColor(bgcolor);
    $elem = $('<li class="iso'
      + '" data-number="' + i
      + '" h-index="' + hexstring.substring(1)
      + '" r-index="' + bgcolor['r']
      + '" g-index="' + bgcolor['g']
      + '" b-index="' + bgcolor['b']
      + '" x-index="' + x
      + '">'
      + '<canvas id="canvas' + i + '" width="' + width + '" height="' + height + '"/>'
      + '</li>');
    $.myElems.list.isotope('insert', $elem );
    $canvas = document.getElementById('canvas' + i);
    if ($canvas.getContext){
      var ctx = $canvas.getContext("2d");
      ctx.fillStyle = rgbstring;
      ctx.fillRect(0, 0, width, height);
      ctx.font="12px Arial";
      ctx.textAlign = 'center';
      ctx.fillStyle = fgcolor;
      var x = $canvas.width / 2;
      var y = $canvas.height / 2;
      ctx.fillText(hexstring, x, y);
      ctx.fillText(rgbstring, x, y+15);
    }
  };
  window.canvasCount = window.canvasCount + 20;
};

try {
  jQuery(document).ready(function($) {

    $.myElems = {};
    $.myElems.list = $(document.getElementById('list'));

    initIsotope($.myElems.list);
    window.canvasCount = 0;
    window.colors = [];
    $(document.getElementById('reset')).click(function(){
      resetEverything();
    });

    $(document.getElementById('shuffle')).click(function(){
      shuffleIsotope();
    });

    $(document.getElementById('gen')).click(function(){
      generate();
    });

  });

  String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
  };

} catch (error) {
  console.error("Your javascript has an error: " + error);
}