'use strict';

angular.module('personalSiteApp.top', ['ngRoute'])
.controller('TopController', [function() {

    /* ---------------------------------------------- /*
     * Background image
    /* ---------------------------------------------- */
    /*$('#top').backstretch([
        'images/bg3.jpg',
        'images/bg2.jpg',
        'images/bg1.jpg'
        ], {
            duration: 3000,
            fade: 750
        }
    );*/

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

    /* ---------------------------------------------- /*
     * Rotate
    /* ---------------------------------------------- */
    $(".rotate").textrotator({
        animation: "dissolve",
        separator: "|",
        speed: 3000
    });
}]);
