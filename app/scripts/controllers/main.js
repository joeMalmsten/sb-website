'use strict';

angular.module('personalSiteApp').controller('MainController', [
    '$scope',
    '$timeout',
    'applicationFactory',
    function($scope, $timeout, applicationFactory) {

    var navbar,
        navHeight,
        contentContainer,
        contentTimerHandle,
        threeControls,
        wow;

    $scope.template = {
        'top': '../../views/top.html',
        'guildNews': '../../views/news.html',
        'guildApplication': '../../views/application.html',
        'roster': '../../views/roster.html'
    };

    function initNavbar() {
        /* ---------------------------------------------- /*
         * Navbar
        /* ---------------------------------------------- */
        navbar = $('.navbar');
        contentContainer = $('.content-container');
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

            if (contentTimerHandle) {
                $timeout.cancel(contentTimerHandle);
            }

            if (hash === '#roster') {
                $('html, body').stop().animate({
                    scrollTop: anchor.offset().top
                }, 500);
                contentTimerHandle = $timeout(function() {
                    contentContainer.addClass('roster-active');
                }, 500);
            } else {
                console.log(applicationFactory);
                if (contentContainer.hasClass('roster-active')) {
                    contentContainer.removeClass('roster-active');
                    contentTimerHandle = $timeout(function() {
                        $('html, body').stop().animate({
                            scrollTop: anchor.offset().top
                        }, 500);
                    }, 500);
                } else {
                    $('html, body').stop().animate({
                        scrollTop: anchor.offset().top
                    }, 500);
                }
            }


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
