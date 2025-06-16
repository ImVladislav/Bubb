document.addEventListener("DOMContentLoaded", function () {
  if (typeof jQuery === "undefined" || typeof $.fn.turn === "undefined") {
    console.error("Required libraries not loaded!");
    return;
  }
  var $slider = $("#stat-slider-turn");
  var width = $slider.width();
  var height = $slider.height();
  $slider.turn({
    width: width,
    height: height,
    autoCenter: true,
    display: "single",
    duration: 800,
    gradients: true,
    acceleration: false,
  });

  // Перелистування по скролу миші
  $slider[0].addEventListener(
    "wheel",
    function (e) {
      if (e.deltaY > 0) {
        $slider.turn("next");
      } else if (e.deltaY < 0) {
        $slider.turn("previous");
      }
    },
    { passive: true }
  );

  // Адаптивність при зміні розміру
  window.addEventListener("resize", function () {
    var w = $slider.width();
    var h = $slider.height();
    $slider.turn("size", w, h);
  });

  // --- Анімація натискання для іконок соцмереж ---
  document.querySelectorAll(".social-icon").forEach(function (btn) {
    btn.addEventListener("mousedown", function () {
      btn.classList.add("pressed");
    });
    btn.addEventListener("touchstart", function () {
      btn.classList.add("pressed");
    });
    btn.addEventListener("mouseup", function () {
      btn.classList.remove("pressed");
    });
    btn.addEventListener("mouseleave", function () {
      btn.classList.remove("pressed");
    });
    btn.addEventListener("touchend", function () {
      btn.classList.remove("pressed");
    });
    btn.addEventListener("touchcancel", function () {
      btn.classList.remove("pressed");
    });
  });
});
