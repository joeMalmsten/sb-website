'use strict';

angular.module('personalSiteApp').controller('MainController', ['$scope', '$timeout',
function($scope, $timeout) {

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

    $scope.navToAnchor = function(hash) {
        var anchor = $(hash + '-anchor'),
            rosterHash = '#roster',
            appHash = '#application',
            animateTime = 333;

        if (!anchor.length) {
            anchor = $(hash);
        }

        if (contentTimerHandle) {
            $timeout.cancel(contentTimerHandle);
            contentTimerHandle = null;
        }

        if ($scope.currSection === rosterHash) {
            if (hash !== rosterHash) {
                $('html, body').stop().animate({
                    scrollTop: 0
                }, animateTime);

                contentTimerHandle = $timeout(function() {
                    contentContainer.removeClass('roster-active');
                    if (hash === appHash) {
                        contentContainer.addClass('application-active');
                    }

                    contentTimerHandle = $timeout(function() {
                        $('html, body').stop().animate({
                            scrollTop: anchor.offset().top
                        }, animateTime);
                        $scope.currSection = hash;
                    }, animateTime);
                }, animateTime);
            }
        } else if ($scope.currSection === appHash) {
            if (hash !== appHash) {
                $('html, body').stop().animate({
                    scrollTop: 0
                }, animateTime);

                contentTimerHandle = $timeout(function() {
                    contentContainer.removeClass('application-active');
                    if (hash === rosterHash) {
                        contentContainer.addClass('roster-active');
                    }

                    contentTimerHandle = $timeout(function() {
                        $('html, body').stop().animate({
                            scrollTop: anchor.offset().top
                        }, animateTime);
                        $scope.currSection = hash;
                    }, animateTime);
                }, animateTime);
            }
        } else {
            if (hash === rosterHash) {
                contentContainer.addClass('roster-active');

                $timeout(function() {
                    $('html, body').stop().animate({
                        scrollTop: anchor.offset().top
                    }, animateTime);
                    $scope.currSection = hash;
                }, animateTime);
            } else if (hash === appHash) {
                contentContainer.addClass('application-active');

                $timeout(function() {
                    $('html, body').stop().animate({
                        scrollTop: anchor.offset().top
                    }, animateTime);
                    $scope.currSection = hash;
                }, animateTime);
            } else {
                $('html, body').stop().animate({
                    scrollTop: anchor.offset().top
                }, animateTime);
                $scope.currSection = hash;
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
