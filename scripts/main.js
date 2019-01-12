(function ($, Drupal) {

  Drupal.behaviors.customTweaks = {
    attach: function (context, settings) {

      // SVG Injector
      // For testing in IE8
      if (!window.console) {
        console = {
          log: function () {}
        };
      }

      // Elements to inject
      var mySVGsToInject = document.querySelectorAll('img.inject-svg');

      // Options
      var injectorOptions = {
        evalScripts: 'once',
        each: function (svg) {}
      };

      // Trigger the injection
      SVGInjector(mySVGsToInject, injectorOptions, function (totalSVGsInjected) {});

    }
  };
})(jQuery, Drupal);
