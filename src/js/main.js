import $ from 'jquery';
import swiper from 'swiper';

$(document).ready(function() {
    initBannerSlider();
});

function initBannerSlider() {
    let bannerSlider = new Swiper('.js-banner-slider', {
        slidesPerView: 1,
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    });
}