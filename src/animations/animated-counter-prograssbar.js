/**
 * jQuery Animated Progressbar
 * Author: shakibdshy<shakibdshy@gmail.com>
 * Author URL: https://github.com/shakibdshy
 * Version: 1.0.0
 */

// src/animations/animated-counter-prograssbar.js

import $ from "jquery";

$(function () {
  function animateProgress($context, duration) {
    $context.find("[progress-bar]").each(function () {
      var $bar = $(this);
      var percent = $bar.attr("data-percentage");

      $bar.find(".progress-fill").animate({ width: percent }, duration);

      $bar.find(".progress-number-mark").animate(
        { left: percent },
        {
          duration,
          step: function (now) {
            var data = Math.round(now);
            $(this)
              .find(".percent")
              .html(data + "%");
          },
        }
      );
    });
  }

  animateProgress($("#firstbar"), 1000);

  $(".slider").on("afterChange", function (event, slick, currentSlide) {
    var $current = $(slick.$slides.get(currentSlide));

    $current.find("[progress-bar]").each(function () {
      $(this).find(".progress-fill").css({ width: 0 });
      $(this).find(".progress-number-mark").css({ left: 0 });
    });

    animateProgress($current, 1000);
  });
});

// (function ($) {
//   "use strict";

//   $("[progress-bar]").each(function () {
//     $(this)
//       .find(".progress-fill")
//       .animate(
//         {
//           width: $(this).attr("data-percentage"),
//         },
//         2000
//       );

//     $(this)
//       .find(".progress-number-mark")
//       .animate(
//         { left: $(this).attr("data-percentage") },
//         {
//           duration: 2000,
//           step: function (now, fx) {
//             var data = Math.round(now);
//             $(this)
//               .find(".percent")
//               .html(data + "%");
//           },
//         }
//       );
//   });
// })(jQuery);