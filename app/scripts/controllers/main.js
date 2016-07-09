'use strict';

angular.module('personalSiteApp').controller('MainController', ['$scope', '$timeout', function($scope, $timeout){
    var navbar,
        navHeight,
        threeControls,
        wow;

    $scope.template = {
        'top' : '../../views/top.html',
        'blog' : '../../views/blog.html',
        'resume' : '../../views/resume.html' ,
        'history' : '../../views/history.html'
    };

    function initNavbar() {
        /* ---------------------------------------------- /*
         * Navbar
        /* ---------------------------------------------- */
        navbar = $('.navbar');
        navHeight = navbar.height();

        $('body').scrollspy({
            target: '.navbar-custom',
            offset: 50
        });

        $('a[href*=\\#]').bind("click", function(e){
            var elem = $(this),
                hash = elem.prop('hash'),
                anchor = $(hash + "-anchor");
            if (!anchor.length) {
                anchor = $(hash);
            }
            $('html, body').stop().animate({
                scrollTop: anchor.offset().top
            }, 1000);
            e.preventDefault();
            return false;
        });

        $(window).scroll(function() {
            if($(this).scrollTop() >= navHeight) {
                navbar.addClass('navbar-color');

                if(!threeControls || !threeControls.length) {
                    threeControls = $(".dg.a");
                }
                threeControls.addClass("hidden");
            }
            else {
                navbar.removeClass('navbar-color');
                if(!threeControls || !threeControls.length) {
                    threeControls = $(".dg.a");
                } else {
                    threeControls.removeClass("hidden");
                }
            }
        });

        if($(window).width() <= 767) {
            navbar.addClass('custom-collapse');
        }

        $(window).resize(function() {
            if($(this).width() <= 767) {
                navbar.addClass('custom-collapse');
            }
            else {
                navbar.removeClass('custom-collapse');
            }
        });

        wow = new WOW({
            mobile: false
        });
        wow.init();
    }

    $timeout(function() {
        var load_screen = $("#load_screen");
        initNavbar();

        load_screen.addClass("loaded");
        $timeout(function() {
            load_screen.remove();
        }, 3000);

    }, 0);
}]);
