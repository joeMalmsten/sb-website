'use strict';

angular.module('personalSiteApp.top', ['ngRoute'])
.controller('TopController', [function() {
    /* ---------------------------------------------- /*
     * Background image
    /* ---------------------------------------------- */
    $('#top').backstretch([
        'images/bg4.jpg',
        'images/bg3.jpg',
        'images/bg2.jpg',
        'images/bg1.jpg'
    ], {
        duration: 3000,
        fade: 750
    });

    /* ---------------------------------------------- /*
     * Rotate
    /* ---------------------------------------------- */
    $('.rotate').textrotator({
        animation: 'dissolve',
        separator: '|',
        speed: 3000
    });
}]);
