$(function () {

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

$(".banner-slider").owlCarousel({
    responsiveClass: true,
    loop: false,
    margin: 0,
    autoplay: true,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        600: {
            items: 1,

        },
        1000: {
            items: 1,
        },
    }
});

$(".category-slider").owlCarousel({
    responsiveClass: true,
    loop: true,
    margin: 20,
    autoplay: true,
    dots: false,
    nav: true,
    responsive: {
        0: {
            items: 3,
        },
        600: {
            items: 4,

        },
        1000: {
            items: 6,
        },
    }
});

$(".product-slider").owlCarousel({
    responsiveClass: true,
    autoplay: true,
    dots: false,
    responsive: {
        0: {
            nav: true,
            items: 2,
        },
        600: {
            nav: true,
            items: 3,

        },
        1000: {
            nav: true,
            items: 3,
        },
        1200: {
            nav: true,
            items: 4,
        },
    }
});



$(".blog-slider").owlCarousel({
    responsiveClass: true,
    loop: false,
    margin: 40,
    autoplay: false,
    responsive: {
        0: {
            nav: true,
            dots: false,
            items: 1,
        },
        600: {
            nav: true,
            dots: false,
            items: 2,

        },
        1000: {
            nav: true,
            dots: false,
            items: 3,
        },
    }
});

/////// Nice Select ///
$(".nice-option").niceSelect();

//// Price Range ///

var slider = document.getElementById('priceRange');
var priceRangeValue = document.getElementById('priceRange-value');

// Check if the elements exist
if (slider && priceRangeValue) {
    // Your code for creating the slider and updating the input field
    noUiSlider.create(slider, {
        start: [20, 80],
        connect: true,
        range: {
            'min': 0,
            'max': 100
        },
        format: {
            to: function (value) {
                return Math.round(value);
            },
            from: function (value) {
                return value.replace('$', '');
            }
        }
    });

    // Update input field with slider value
    slider.noUiSlider.on('update', function (values, handle) {
        priceRangeValue.textContent = '$' + values[0] + ' - $' + values[1];
    });
}


// Initialize Slick Slider
var $sliderSingle = initSlider();

// Initialize the slider
function initSlider() {
    var $sliderNav = $(".slider-nav");
    if ($sliderNav.length > 0) {
        var slidesToShow = 4;
        var totalItems = $sliderNav.children().length;
        var $sliderSingle = $sliderNav.slick({
            slidesToShow: slidesToShow,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            focusOnSelect: true
        });

        // Show/hide navigation buttons based on item count
        if (totalItems > slidesToShow) {
            $('#prevBtn, #nextBtn').show();
        } else {
            $('#prevBtn, #nextBtn').hide();
        }

        return $sliderSingle;
    }
    return null;
}

// Function to get the index of the active slide
function getActiveSlideIndex() {
    if ($sliderSingle) {
        return $sliderSingle.slick('slickCurrentSlide');
    }
    return -1;
}

// Function to get the image source of the active slide
function getImageOfActiveSlide() {
    var activeSlideIndex = getActiveSlideIndex();
    if (activeSlideIndex !== -1) {
        var $activeSlide = $(".slider-nav .slick-slide[data-slick-index='" + activeSlideIndex + "']");
        var $img = $activeSlide.find('img');
        var imgSrc = $img.attr('src');
        return imgSrc;
    }
    return null;
}

// Function to update the active image
function updateActiveImage() {
    var activeImgSrc = getImageOfActiveSlide();
    if (activeImgSrc && $('#product-img-zoom').length > 0) {
        $('#product-img-zoom img').attr('src', activeImgSrc);
    }
}

// Event listener for slider change
if ($sliderSingle) {
    $sliderSingle.on('afterChange', function (event, slick, currentSlide) {
        updateActiveImage();
    });
}

// Event listeners for buttons
$('#prevBtn').on('click', function() {
    if ($sliderSingle) {
        $sliderSingle.slick('slickPrev');
    }
});

$('#nextBtn').on('click', function() {
    if ($sliderSingle) {
        $sliderSingle.slick('slickNext');
    }
});



  //////  Counter Increament

  $(".count-increament").click(function (e) {
    var count = $(this).parent().find("input").val();
    count++;
    $(this).parent().find("input").val(count);
  });

  //////  Counter Decreament

  $(".count-decreament").click(function (e) {
    var count = $(this).parent().find("input").val();
    count--;
    if (count > 0) {
      $(this).parent().find("input").val(count);
    }
  });

   // Same Shipping Address Toggle
   $('#sameShippingAddress').change(function() {
    if ($(this).is(':checked')) {
        $('.shipping-details').hide();
    } else {
        $('.shipping-details').show();
    }
});

  // Particle trail on hover (banner/hero images)
  (function initParticleTrail() {
    var targets = document.querySelectorAll('.banner-item, .hero-banner-item');
    if (!targets || targets.length === 0) return;

    function setup(el) {
      if (el.__particleTrailSetup) return;
      el.__particleTrailSetup = true;

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.className = 'particle-trail-canvas';

      // Ensure we can absolutely-position the canvas
      var computedPos = window.getComputedStyle(el).position;
      if (computedPos === 'static') el.style.position = 'relative';
      el.style.overflow = 'hidden';

      el.appendChild(canvas);

      var particles = [];
      var raf = null;
      var last = { x: 0, y: 0, t: 0 };

      function resize() {
        var rect = el.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function spawn(x, y, intensity) {
        var count = Math.min(10, 2 + Math.floor(intensity * 8));
        for (var i = 0; i < count; i++) {
          var ang = Math.random() * Math.PI * 2;
          var spd = 0.25 + Math.random() * 0.9;
          particles.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 0.35,
            life: 520 + Math.random() * 520,
            age: 0,
            r: 1.2 + Math.random() * 1.9,
            hue: 285 + Math.random() * 35 // purple -> pink
          });
        }
      }

      function tick(ts) {
        raf = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.age += 16.7;
          var t = p.age / p.life;
          if (t >= 1) {
            particles.splice(i, 1);
            continue;
          }

          // Motion
          p.vx *= 0.98;
          p.vy = p.vy * 0.98 + 0.02; // slight gravity
          p.x += p.vx * 5;
          p.y += p.vy * 5;

          // Fade + sparkle
          var alpha = (1 - t) * 0.9;
          var glow = 10 * (1 - t);
          ctx.beginPath();
          ctx.fillStyle = 'hsla(' + p.hue + ', 92%, 70%, ' + alpha + ')';
          ctx.shadowColor = 'hsla(' + p.hue + ', 92%, 70%, ' + alpha + ')';
          ctx.shadowBlur = glow;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // keep animating while particles exist
        if (particles.length > 0) raf = requestAnimationFrame(tick);
      }

      function ensureRunning() {
        if (!raf) raf = requestAnimationFrame(tick);
      }

      el.addEventListener('mouseenter', function () {
        resize();
      });

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var now = performance.now();
        var dt = Math.max(1, now - last.t);
        var dx = x - last.x;
        var dy = y - last.y;
        var speed = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (dt * 0.8));
        last.x = x;
        last.y = y;
        last.t = now;
        spawn(x, y, speed);
        ensureRunning();
      });

      el.addEventListener('mouseleave', function () {
        // Let remaining particles finish; stop spawning.
      });

      window.addEventListener('resize', function () {
        // Resize lazily; next mouseenter/move will correct too.
        resize();
      });
    }

    targets.forEach(setup);
  })();

});
