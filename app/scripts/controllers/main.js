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
        'news': '../../views/news.html',
        'application': '../../views/application.html',
        'roster': '../../views/roster.html'
    };

    $scope.applicationFactory = applicationFactory;

    $scope.navToAnchor = function(hash) {
        var anchor = $(hash + '-anchor');

        if (!anchor.length) {
            anchor = $(hash);
        }

        if (contentTimerHandle) {
            $timeout.cancel(contentTimerHandle);
            contentTimerHandle = null;
        }

        $('html, body').stop().animate({
            scrollTop: anchor.offset().top
        }, 500);

        if (hash === '#roster') {
            contentTimerHandle = $timeout(function() {
                contentContainer.addClass('roster-active');
                $scope.currSection = hash;
            }, 500);
        } else if (hash === '#application') {
            contentTimerHandle = $timeout(function() {
                contentContainer.addClass('application-active');
                $scope.currSection = hash;
            }, 500);
        } else {
            if (contentContainer.hasClass('roster-active')) {
                contentTimerHandle = $timeout(function() {
                    contentContainer.removeClass('roster-active');
                    $scope.currSection = hash;
                }, 500);
            } else if (contentContainer.hasClass('application-active')) {
                contentTimerHandle = $timeout(function() {
                    contentContainer.removeClass('application-active');
                    $scope.currSection = hash;
                }, 500);
            }
        }
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

        $('a[href*=\\#]').bind('click', function(e){
            var elem = $(this),
                hash = elem.prop('hash');

            $scope.navToAnchor(hash);

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
