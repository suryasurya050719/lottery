(function ($) {
    "user strict";

    $(document).ready(function () {
       
       
       
        

      


    

        //MenuBar
        $('.header-bar').on('click', function () {
            $(".menu").toggleClass("active");
            $(".header-bar").toggleClass("active");
            $('.overlay').toggleClass('active');
        });
        $('.overlay').on('click', function () {
            $(".menu").removeClass("active");
            $(".header-bar").removeClass("active");
            $('.overlay').removeClass('active');
        });
        //Menu Dropdown Icon Adding
        $("ul>li>.submenu").parent("li").addClass("menu-item-has-children");
        // drop down menu width overflow problem fix
        $('ul').parent('li').hover(function () {
            var menu = $(this).find("ul");
            var menupos = $(menu).offset();
            if (menupos.left + menu.width() > $(window).width()) {
                var newpos = -$(menu).width();
                menu.css({
                    left: newpos
                });
            }
        });
        $('.menu li a').on('click', function (e) {
            
            var element = $(this).closest('li');
            $('.menu a').removeClass('active')
            $(this).addClass('active')
            if (element.hasClass('open')) {
                
                element.removeClass('open');
                element.find('li').removeClass('open');
                element.find('ul').slideUp();
            } else {
                
                element.addClass('open');
                element.closest('ul').removeClass('active');
                $('.header-bar').removeClass('active');
               
            }
        })
        // Scroll To Top
        var scrollTop = $(".scrollToTop");
        $(window).on('scroll', function () {
            if ($(this).scrollTop() < 500) {
                scrollTop.removeClass("active");
            } else {
                scrollTop.addClass("active");
            }
        });
        
        //Click event to scroll to top
        $('.scrollToTop').on('click', function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
       
        // Header Sticky Here
        var headerOne = $(".header-section");
        $(window).on('scroll', function () {
            if ($(this).scrollTop() < 1) {
                headerOne.removeClass("header-active");
            } else {
                headerOne.addClass("header-active");
            }
        });
        $('.window-warning .lay').on('click', function () {
            $('.window-warning').addClass('inActive');
        })
        $('.seat-plan-wrapper li .movie-schedule .item').on('click', function () {
            $('.window-warning').removeClass('inActive');
        })

        // draw-slider
        $('.draw-slider').owlCarousel({
            loop: false,
            responsiveClass: true,
            nav: true,
            dots: false,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            autoplay: false,
            autoplayTimeout: 2000,
            autoplayHoverPause: true,
            smartSpeed: 2000,
            responsive: {
                0: {
                    items: 1,
                },
                576: {
                    items: 2,
                },
                768: {
                    items: 2,
                },
                992: {
                    items: 3,
                },
                1200: {
                    items: 4,
                }
            }
        });

       


    });

    // Preloader Js
    $(window).on('load', function () {
        $('.preloader').fadeOut(1000);
        var img = $('.bg_img');
        img.css('background-image', function () {
            var bg = ('url(' + $(this).data('background') + ')');
            return bg;
        });

    });


})(jQuery);
