var crnProtocol = window.location.protocol === "file:" ? "" : "/"; require.config({ baseUrl: crnProtocol + "assets/scripts", paths: { "markerclusterer": "markerclusterer", "googlemapapi": "https://maps.googleapis.com/maps/api/js?key=AIzaSyComTilwU0JrN8D8oHKMzfiCV4SW6dHTp4", "angular": "libs/angularjs/angular.min", "angular-ui-router": "libs/angularjs/angular-ui-router.min", "angular-sanitize": "libs/angularjs/angular-sanitize.min", "ui-bootstrap-tpls": "libs/angularjs/ui-bootstrap-tpls.min", "jquery": "libs/jquery/jquery-1.11.0.min", "migrate": "libs/jquery/jquery-migrate-1.2.1.min", "jquery-ui": "libs/jquery/jquery-ui-1.11.0.min", "bootstrap": "libs/bootstrap/js/bootstrap.min", "autocomplete": "libs/autocomplete/jquery.autocomplete.min", "bxslider": "libs/bxslider/jquery.bxslider.min", "slick": "libs/slick/slick.min", "masonry": "libs/masonry/masonry", "tabcollapse": "libs/tabcollapse/bootstrap-tabcollapse", "attrchange": "libs/attrchange/attrchange", "twbspagination": "libs/twbspagination/twbs-pagination.min", "jquery-unobtrusive-ajax": "libs/jquery/jquery.unobtrusive-ajax", "jquery-validate": "libs/jquery/jquery.validate.min", "jquery-validate-unobtrusive": "libs/jquery/jquery.validate.unobtrusive", "priceFormat": "jquery.price_format", "globalize": "libs/globalize", "glcultures": "libs/globalize.cultures" }, shim: { "angular": { exports: "angular" }, "angular-ui-router": ["angular"], "angular-sanitize": ["angular"], "ui-bootstrap-tpls": ["angular"], "migrate": ["jquery"], "jquery-ui": ["jquery"], "bootstrap": ["jquery"], "autocomplete": { deps: ["jquery"], exports: "autocomplete" }, "bxslider": { deps: ["jquery"], exports: "bxSlider" }, "slick": { deps: ["jquery"], exports: "slick" }, "masonry": { deps: ["jquery"], exports: "masonry" }, "tabcollapse": { deps: ["jquery"], exports: "tabCollapse" }, "attrchange": { deps: ["jquery"], exports: "attrchange" }, "twbspagination": { deps: ["jquery"], exports: "twbsPagination" }, "jquery-unobtrusive-ajax": ["jquery"], "jquery-validate": ["jquery"], "jquery-validate-unobtrusive": ["jquery"], "priceFormat": { deps: ["jquery"], exports: "priceFormat" }, "globalize": { deps: ["jquery"], exports: "globalize" }, "glcultures": { deps: ["jquery"], exports: "glcultures" } } });require(["jquery", "migrate", "jquery-ui", "bootstrap", "tabcollapse","twbspagination"], function ($) {
	
	(function () {
        var JQBCA = $.noConflict(); var BCACOID = BCACOID || {}; var urilibs = '/assets/scripts/libs/'; var isWidgetShow = false; var isMobileSideMenuShow = false; var baseUrl = window.location.origin+'/', thispage = JQBCA('section.container, section.container-fluid').attr('class').split(" ")[1], sh = JQBCA(window).height(), sw = JQBCA(window).width(), mobilemode; JQBCA.fn.truncate = function (options) { var defaults = { more: '...' }; options = JQBCA.extend(defaults, options); return this.each(function (num) { var height = parseInt(JQBCA(this).css("height")); var content = JQBCA(this).html().substring(0, 3000); while (this.scrollHeight > height) { content = content.replace(/\s+\S*$/, ""); JQBCA(this).html(content + " " + options.more); } }); }; JQBCA.fn.openSelect = function () { return this.each(function (idx, domEl) { if (document.createEvent) { var event = document.createEvent("MouseEvents"); event.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); domEl.dispatchEvent(event); } else if (element.fireEvent) { domEl.fireEvent("onmousedown"); } }); }; function lazyCss(url, cssfile) { JQBCA('<link>').attr({ 'rel': 'stylesheet', 'href': url + cssfile, 'media': 'screen' }).insertBefore('head > link'); }
        BCACOID.globalInit = (function () {
            var init = function () {
                if (sw <= 1024) { JQBCA('body').addClass('mobilemode'); mobilemode = true; } else { JQBCA('body').addClass('desktopmode'); mobilemode = false; }
                JQBCA('body').attr('id', thispage); if (JQBCA('#home').length == 0) {
                    if (!mobilemode) { JQBCA('.showcase .breadcrumb').show(); }
                    else { if (JQBCA('.search-page').length == 0) { JQBCA('.showcase .search-form').show(); } }
                    JQBCA('.main-nav .search').css('display', 'inline-block');
                } else { JQBCA('.showcase .search-form').show(); }
                JQBCA(".truncate").each(function () { var el = JQBCA(this); setTimeout(function () { el.truncate(); }, 10); }); JQBCA('.pagination > .first, .pagination > .last').remove(); JQBCA('.pagination > .prev > a, .pagination > .prev > span, .pagination > .next > a, .pagination > .next > span').empty(); JQBCA('[class*="twbs-pagination"]').css('visibility', 'visible'); JQBCA('.bubble-gray-lg.dropdown-wrap > select').wrap('<div class="dropdown-option"><div class="select-wrap"></div></div>'); JQBCA('.bubble-hf-gray.dropdown-wrap > select').wrap('<div class="dropdown-option"></div>'); JQBCA('.bubble-blue-lg > .btn, .bubble-blue-lg > span').wrap('<div class="bubble-inner"></div>');
            }; var responsive = function () { if (sw <= 1024) { JQBCA('body').removeClass('desktopmode').addClass('mobilemode'); mobilemode = true; } else { JQBCA('body').removeClass('mobilemode').addClass('desktopmode'); mobilemode = false; } }; return { init: init, responsive: responsive };
        })(); BCACOID.megaMenu = (function () {
            var activemenu = JQBCA('.main-nav .nav .active').attr('data-rel'); var lev3, menuTimeOut; var init = function () {
                if (JQBCA('.additional-menu').length > 0) { JQBCA('.sub-nav > nav').css('position', 'absolute'); JQBCA('.sub-nav-lev3 nav').css('top', '46px'); }
                if (thispage === 'main-page') { JQBCA('.sub-nav > nav').css('position', 'relative'); JQBCA('.sub-nav-lev3 nav').css('top', '0'); JQBCA('.sub-nav > nav > div > .nav#' + activemenu).show(); JQBCA('.sub-nav').removeClass('nav-close').addClass('nav-open'); if (mobilemode) { JQBCA('.sub-nav').removeClass('nav-open').addClass('nav-close'); } else { JQBCA('.sub-nav').removeClass('nav-close').addClass('nav-open'); } }
                main();
            }; var main = function () {
                JQBCA('.main-nav .nav li').on('mouseenter', function () {
                    var el = JQBCA(this); JQBCA('.main-nav .nav li > a').removeAttr('style'); menuTimeOut = setTimeout(function () {
                        JQBCA('.sub-nav > nav > div > .nav').hide(); JQBCA('.sub-nav > nav > div > .nav#' + el.attr('data-rel')).show(); if (JQBCA('.sub-nav > nav > div > .nav#' + el.attr('data-rel') + ' li').length > 0) { if (!JQBCA('.sub-nav').hasClass('slide-down') && JQBCA('.additional-menu').length == 0) { JQBCA('.sub-nav').slideDown(200, function () { JQBCA('.sub-nav').removeClass('nav-close').addClass('nav-open slide-down').removeAttr('style'); }); } else { JQBCA('.sub-nav').removeClass('nav-close').addClass('nav-open'); } } else {
                            JQBCA('.sub-nav').slideUp(200, function () { JQBCA('.sub-nav').removeClass('nav-open slide-down').addClass('nav-close').removeAttr('style'); }); if (thispage === 'main-page') { JQBCA('.main-nav .nav li').on('mouseleave', function () { JQBCA('.sub-nav').removeClass('nav-close').addClass('nav-open'); }); }
                            if (JQBCA('.additional-menu').length > 0) { JQBCA('.additional-menu').hide(); }
                        }
                    }, 200);
                }).on('mouseleave', function () { clearTimeout(menuTimeOut); }); if (thispage !== 'main-page') { JQBCA('.main-nav .nav').on('mouseleave', function () { JQBCA('.sub-nav .nav li').on('mouseenter', function (event) { if (!event.type === 'mouseenter') { JQBCA('.sub-nav').removeClass('nav-open slide-down').addClass('nav-close'); } }); }); JQBCA('.main-nav .nav').on('mouseleave', function () { clearTimeout(menuTimeOut); JQBCA('.sub-nav > nav > div').on('mouseover', function () { JQBCA(this).addClass('hovered'); }); setTimeout(function () { if (!JQBCA('.sub-nav > nav > div').hasClass('hovered')) { JQBCA('.sub-nav').slideUp(200, function () { JQBCA('.sub-nav').removeClass('nav-open slide-down').addClass('nav-close').removeAttr('style'); }); JQBCA('.additional-menu').removeAttr('style'); } }, 100); }); }
                JQBCA('.sub-nav .nav li').on('mouseenter', function () { JQBCA('.main-nav .nav li > a').removeAttr('style'); JQBCA('.main-nav .nav li[data-rel="' + JQBCA(this).parent().attr('id') + '"] > a').css('color', '#00B7F1'); lev3 = JQBCA(this).attr('data-rel'); JQBCA('.sub-nav, .sub-nav-lev3 nav').removeClass('nav-close').addClass('nav-open'); JQBCA('.sub-nav-lev3 > nav > div').hide(); JQBCA('.sub-nav .nav li').removeClass('active'); if (JQBCA('.sub-nav-lev3 > nav > div#' + lev3 + '> div').length > 0) { JQBCA('.sub-nav-lev3 > nav > div#' + lev3).slideDown(200, function () { }); JQBCA(this).addClass('active'); } }); if (thispage !== 'main-page') { JQBCA('.sub-nav nav').on('mouseleave', function () { JQBCA('.sub-nav, .sub-nav-lev3 nav').removeClass('nav-open').addClass('nav-close'); JQBCA('.sub-nav > nav > div').removeClass('hovered'); }); } else { JQBCA('.sub-nav nav').on('mouseleave', function () { JQBCA('.sub-nav > nav > div > .nav').hide(); JQBCA('.sub-nav > nav > div > .nav#' + activemenu).show(); JQBCA('.sub-nav').removeClass('nav-close').addClass('nav-open'); JQBCA('.sub-nav-lev3 nav').removeClass('nav-open').addClass('nav-close'); JQBCA('.sub-nav > nav > div').removeClass('hovered'); }); }
                JQBCA('.sub-nav-lev3 nav').on('mouseenter', function () { JQBCA('.sub-nav, .sub-nav-lev3 nav').removeClass('nav-close').addClass('nav-open'); }); JQBCA('.sub-nav-lev3 nav').on('mouseover', function () { JQBCA('.sub-nav, .sub-nav-lev3 nav').removeClass('nav-close').addClass('nav-open'); }); if (thispage !== 'main-page') { JQBCA('.sub-nav-lev3 nav').on('mouseleave', function () { JQBCA('.sub-nav').removeClass('nav-open').addClass('nav-close'); JQBCA('.main-nav .nav li > a').removeAttr('style'); }); } else { JQBCA('.sub-nav-lev3 nav').on('mouseleave', function () { JQBCA('.sub-nav > nav > div > .nav').hide(); JQBCA('.sub-nav > nav > div > .nav#' + activemenu).show(); JQBCA('.sub-nav').removeClass('nav-close').addClass('nav-open'); }); }
				//Add pop up on halobca icon by Asiani on 20161206
				 JQBCA('.buzz').hover(
					function()
					{		
						var buzzid = JQBCA('meta[name=language]').attr("content") || "id";
						if(buzzid.match("id"))
							JQBCA('.halobcabuzz').show();
						else
							JQBCA('.halobcabuzz-eng').show();
					}, 
					function() 
					{
						var buzzeng = JQBCA('meta[name=language]').attr("content") || "id";
						if(buzzeng.match("id"))
							JQBCA('.halobcabuzz').hide();
						else
							JQBCA('.halobcabuzz-eng').hide();
					}
					);
				 //end popup halobca
		  }; return { init: init };
        })(); var clearFloatElementOnWidgetActive = function () {
            try {
                if (mobilemode) {
                    if (isWidgetShow == true) {
                        if (JQBCA('.slick-next').length > 0) { JQBCA('.slick-next').hide(); } else { JQBCA('.slick-next').show(); }
                        if (JQBCA('.slick-prev').length > 0) { JQBCA('.slick-prev').hide(); } else { JQBCA('.slick-prev').show(); }
                        if (JQBCA('.scroll-to-top').length > 0) { JQBCA('.scroll-to-top').hide(); }
                    } else if (isWidgetShow == false) { JQBCA('.slick-next').show(); JQBCA('.slick-prev').show(); JQBCA('.scroll-to-top').show(); }
                } else { JQBCA('.slick-next').show(); JQBCA('.slick-prev').show(); JQBCA('.scroll-to-top').show(); }
            } catch (e) { }
        }
        BCACOID.sideWidget = (function () {
            var nhh = JQBCA('.navbar-header').height(); var swwh = sh - nhh; var init = function () { JQBCA('.widget-content').height(sh - nhh - 110 + 'px'); main(); mobile(); }; var isKursWidgetClicked = false; var loadKurs = function (obj) {
                if (JQBCA('.partial-widget-kursBCA').length > 0) {
                    try {
                        if (obj.find('a > span')[0] != null) {
                            if (obj.find('a > span')[0].className.indexOf('kurs-bca') > -1) { isKursWidgetClicked = true; JQBCA.ajax({ type: "POST", url: "/api/sitecore/PageComponent/Aside", data: { 'IsKursWidgetClicked': isKursWidgetClicked }, dataType: "html", cache: false, success: function (result) { if (isKursWidgetClicked == true) { JQBCA(".partial-widget-kursBCA").html(result); isKursWidgetClicked = false; } }, error: function (ex) { isKursWidgetClicked = false; } }); if (isKursWidgetClicked == true) { JQBCA('.partial-widget-kursBCA').show(); } } else { isKursWidgetClicked = false; JQBCA('.partial-widget-kursBCA').hide(); }
                            isWidgetShow = true;
                        } else { if (mobilemode) { isWidgetShow = false; JQBCA('.slick-next').show(); JQBCA('.slick-prev').show(); JQBCA('.scroll-to-top').show(); } }
                    } catch (err) { isWidgetShow = false; }
                    clearFloatElementOnWidgetActive();
                }
            }
            var main = function () {
                JQBCA('.partial-widget-kursBCA').hide(); JQBCA('aside .side-widget > .menu').on('mouseover', function () { if (!mobilemode) { JQBCA(this).find('a > span').addClass('show-title'); } }).on('mouseleave', function () { if (!mobilemode) { JQBCA('aside .side-widget > .menu > a > span').removeClass('show-title'); } }).on('click', function () {
                    if (!mobilemode) { if (JQBCA(this).children().length > 1) { JQBCA(this).find('a > span').addClass('show-title-active'); JQBCA('aside span.glyphicon-remove').show(); JQBCA('aside').animate({ width: '460px' }, 200); JQBCA('body > .container, body > .container-fluid, footer, .showcase').animate({ right: '400px' }, 200); JQBCA('aside .widget-content').hide(); JQBCA(this).find('.widget-content').show(); isWidgetShow = false; JQBCA('aside .side-widget > .menu').removeClass('active'); JQBCA(this).addClass('active'); loadKurs(JQBCA(this)); } } else {
                        JQBCA('html, body').addClass('disable-main-scroll'); JQBCA('.navbar-header').css({ 'position': 'fixed', 'width': '100%', 'background-color': 'white' }); JQBCA('aside .side-widget > .menu').removeClass('active'); JQBCA(this).addClass('active'); if (JQBCA(this).children().length > 1) { JQBCA('aside .side-widget li > a > span').hide(); JQBCA(this).find('a > span').show(); JQBCA('aside .side-widget-wraper').animate({ height: swwh + 'px' }, 200, function () { JQBCA('aside span.glyphicon-remove').show(); }); JQBCA('aside .widget-content').hide(); JQBCA(this).find('.widget-content').show(); isWidgetShow = true; isMobileSideMenuShow = false; }
                        if (JQBCA('.cls_widget').width() > 0) BCACOID.mobileMenu.close(); loadKurs(JQBCA(this)); clearFloatElementOnWidgetActive();
                    }
                }); JQBCA(document).on('click', function (e) { if (!mobilemode) { if (JQBCA('aside').attr('style') === 'width: 460px;' && !JQBCA(e.target).parents('aside').length > 0) { desktopClose(); } } else { if (JQBCA('.mobilemode disable-main-scroll').length > 0) { JQBCA('html, body').removeClass('disable-main-scroll'); } } }); JQBCA('aside span.glyphicon-remove').on('click', function () { if (!mobilemode) { desktopClose(); } else { mobileClose(); isWidgetShow = false; clearFloatElementOnWidgetActive(); } });
            }; var mobile = function () { JQBCA('aside .menu-hide').on('click', function () { if (mobilemode) { JQBCA('html, body').removeClass('disable-main-scroll'); var downIcon = JQBCA(this).find('i').hasClass('glyphicon-chevron-down'); JQBCA('.navbar-header').removeAttr('style'); if (downIcon) { JQBCA('aside .side-widget > .menu').removeClass('active').hide(); JQBCA(this).show().css('width', '100%').parents('.side-widget-wraper').css({ 'width': '15%', 'left': 'initial', 'right': '0' }); JQBCA(this).find('i').toggleClass('glyphicon-chevron-down glyphicon-chevron-up'); JQBCA('aside span.glyphicon-remove, aside .widget-content').hide(); JQBCA('aside .side-widget-wraper').animate({ height: '60px' }, 200); } else { JQBCA(this).removeAttr('style'); JQBCA('aside .side-widget-wraper, aside .side-widget > .menu').removeAttr('style'); JQBCA('aside .side-widget li > a > span').hide(); JQBCA(this).find('i').toggleClass('glyphicon-chevron-up glyphicon-chevron-down'); } } }); }; var responsive = function () {
                swwh = sh - nhh; JQBCA('aside .side-widget > .menu > a > span').hide(); JQBCA('aside .side-widget > li.menu').removeClass('active'); if (mobilemode) {
                    try {
                        if (isWidgetShow == false) { BCACOID.sideWidget.mobileClose(); }
                        if (JQBCA('.side-widget-wraper').height() > 60) { isWidgetShow = true; JQBCA('.side-widget-wraper').height(swwh); } else { isWidgetShow = false; JQBCA('aside span.glyphicon-remove').hide(); }
                        JQBCA('aside').removeAttr('style'); JQBCA('body > .container, body > .container-fluid, footer, .showcase').removeAttr('style'); JQBCA('.widget-content').height(swwh - 110 + 'px');
                    } catch (err) { isWidgetShow = false; }
                    clearFloatElementOnWidgetActive();
                } else { JQBCA('aside span.glyphicon-remove').hide(); JQBCA('aside .menu-hide, aside .side-widget-wraper, aside .side-widget > .menu').removeAttr('style'); JQBCA('aside .side-widget .menu > a > span').removeAttr('style'); if (!JQBCA('aside .menu-hide i').hasClass('glyphicon-chevron-down')) { JQBCA('aside .menu-hide i').toggleClass('glyphicon-chevron-up glyphicon-chevron-down'); } }
            }; var mobileClose = function () { JQBCA('html, body').removeClass('disable-main-scroll'); isWidgetShow = false; JQBCA('.navbar-header').removeAttr('style'); JQBCA('aside .side-widget > .menu').removeClass('active'); JQBCA('aside span.glyphicon-remove, aside .widget-content, aside .side-widget li > a > span').hide(); JQBCA('aside .side-widget-wraper').animate({ height: '60px' }, 200, function () { JQBCA('aside .side-widget-wraper').removeAttr('style'); }); }; var desktopClose = function () { JQBCA('aside .side-widget > .menu > a > span').removeClass('show-title-active'); JQBCA('.showcase, .container, footer').removeClass('safari-pointer'); JQBCA('aside .side-widget > .menu').removeClass('active'); JQBCA('aside span.glyphicon-remove, aside .widget-content').hide(); JQBCA('aside').animate({ width: '60px' }, 200, function () { JQBCA('aside').removeAttr('style'); }); JQBCA('body > .container, body > .container-fluid, footer, .showcase').animate({ right: '0' }, 200, function () { JQBCA('body > .container, body > .container-fluid, footer, .showcase').removeAttr('style'); }); }; return { init: init, responsive: responsive, mobileClose: mobileClose, desktopClose: desktopClose };
        })(); BCACOID.mobileMenu = (function () {
            var init = function () { JQBCA('.side-menu').height(sh - 60); main(); }; var main = function () {
                JQBCA('.navbar-toggle').on('click', function () {
                    if (mobilemode) {
                        BCACOID.sideWidget.mobileClose(); JQBCA('html, body').addClass('disable-main-scroll'); JQBCA('body').prepend("<div class='overlay' style='position:fixed;background-color:rgba(0,0,0,0.5);z-index:9991;width:100%;height:100%'></div>"); JQBCA('aside').css('z-index', '9999'); JQBCA('aside .side-widget-wraper').hide(); JQBCA('aside .side-menu').addClass('fullwidth'); JQBCA('aside span.glyphicon-chevron-left').show(); JQBCA('aside').animate({ width: '260px' }, 200); JQBCA('body > .container, body > .container-fluid, footer, .showcase').animate({ right: '260px' }, 200); JQBCA('.side-menu .right-menu').show(); if (JQBCA('.scroll-to-top').length > 0) { JQBCA('.scroll-to-top').hide(); }
                        if (JQBCA('.slick-next').length > 0) { JQBCA('.slick-next').hide(); }
                        isMobileSideMenuShow = true; try { JQBCA('aside').css('overflow-y', 'scroll'); } catch (e) { }
                        if (JQBCA('.side-widget-wraper').height() > 60) mobileClose();
                    }
                }); JQBCA('aside span.glyphicon-chevron-down').on('click', function () {
                    if (mobilemode) {
                        JQBCA(this).toggleClass('glyphicon-chevron-down glyphicon-chevron-up'); if (JQBCA(this).parent().hasClass('active')) { JQBCA(this).parent().removeClass('active'); }
                        else { JQBCA(this).parent().addClass('active'); }
                    }
                }); JQBCA(document).on('touchstart mousedown click', '.overlay', function (e) {
                    if (mobilemode) {
                        close(); JQBCA('html, body').removeClass('disable-main-scroll'); if (JQBCA('.slick-prev').length > 0) { JQBCA('.slick-next').show(); }
                        isMobileSideMenuShow = false;
                    }
                }); JQBCA(document).on('click', 'aside span.glyphicon-chevron-left', function () {
                    if (mobilemode) {
                        close(); JQBCA('html, body').removeClass('disable-main-scroll'); if (JQBCA('.slick-prev').length > 0) { JQBCA('.slick-next').show(); }
                        isMobileSideMenuShow = false;
                    }
                });
            }; var responsive = function () { JQBCA('.side-menu').height(sh - 60); if (!mobilemode) { } }; var close = function () { JQBCA('.overlay').remove(); JQBCA('.side-menu .right-menu').hide(); JQBCA('aside .side-menu').removeClass('fullwidth'); JQBCA('aside span.glyphicon-chevron-left').hide(); JQBCA('aside').animate({ width: '0' }, 200, function () { JQBCA('aside').removeAttr('style'); }); JQBCA('body > .container, body > .container-fluid, footer, .showcase').animate({ right: '0' }, 200, function () { JQBCA('body > .container, body > .container-fluid, footer, .showcase').removeAttr('style'); }); }; return { init: init, responsive: responsive, close: close };
        })(); BCACOID.multiLang = (function () {
            var init = function () {
                var loc = window.location; var lngMeta = JQBCA('meta[name=language]').attr("content") || "id"; if (lngMeta.match("id")) { JQBCA('.lng-en').removeClass('active'); JQBCA('.lng-id').addClass('active'); }
                else if (lngMeta.match("en")) { JQBCA('.lng-id').removeClass('active'); JQBCA('.lng-en').addClass('active'); }
                else { JQBCA('.lng-en').removeClass('active'); JQBCA('.lng-id').addClass('active'); }
                JQBCA('.lng a').on('click', function () { JQBCA('.lng').removeClass('active'); JQBCA(this).parent().addClass('active'); }); JQBCA('.lng-en a').on('click', function () {
                    if (!loc.href.match("/id") && !loc.href.match("/en")) { window.location = crnProtocol + 'en' + loc.href.substring(loc.href.indexOf('/', loc.href.indexOf("//") + 2)); }
                    else if (loc.href.match("/id")) { window.location = loc.href.replace("/id", "/en"); }
                    else if (loc.href.match("/en")) { window.location = loc.href; }
                    else { window.location = loc.href; }
                }); JQBCA('.lng-id a').on('click', function () {
                    if (!loc.href.match("/id") && !loc.href.match("/en")) { window.location = crnProtocol + 'id' + loc.href.substring(loc.href.indexOf('/', loc.href.indexOf("//") + 2)); }
                    else if (loc.href.match("/id")) { window.location = loc.href; }
                    else if (loc.href.match("/en")) { window.location = loc.href.replace("/en", "/id"); }
                    else { window.location = loc.href; }
                });
            }; return { init: init };
        })(); BCACOID.scrollToTop = (function () { var init = function () { var el = JQBCA('.scroll-to-top'); el.delay(2000).fadeOut(); JQBCA(window).scroll(function () { if (JQBCA(this).scrollTop() > 100) { if (mobilemode && JQBCA('.cls_widget').width() > 0) return; el.fadeIn(); } else { el.fadeOut(); } }); el.click(function () { JQBCA('html, body').animate({ scrollTop: 0 }, 700); return false; }); responsive(); }; var responsive = function () { if (mobilemode) { JQBCA('.scroll-to-top').css('left', sw - 60 + 'px'); } else { JQBCA('.scroll-to-top').removeAttr('style'); } }; return { init: init, responsive: responsive }; })(); BCACOID.offCanvasSearch = (function () { var init = function () { if (JQBCA('.search-page').length > 0) { JQBCA('body').css('background-color', '#eaeaea'); JQBCA('.main-nav .search').hide(); JQBCA('.content-head .search-form').show(); } else { JQBCA('.main-nav .right-menu .search').on('click', function () { JQBCA('.search-off-canvas').slideDown(200); JQBCA('.main-nav .right-menu .search').hide(); }); JQBCA('.search-off-canvas span.glyphicon-remove').on('click', function () { JQBCA('.search-off-canvas').slideUp(200); JQBCA('.main-nav .right-menu .search').show(); }); } }; return { init: init }; })(); BCACOID.searchAutoComplite = (function () { var lngMeta = JQBCA('meta[name=language]').attr("content") || "id"; var init = function () { if (JQBCA('.input-auto-complete').length > 0) { require(["autocomplete"], function () { 
		//JQBCA('#txtKeyword3').change(function () { a.setOptions({ params: { '': JQBCA('#txtKeyword3').val() } }); }); 
		JQBCA('.input-auto-complete').autocomplete({ serviceUrl: baseUrl + 'Webapi/WebApiGSASuggest', type: 'POST', dataType: 'json', minChars: 3, params: { site: JQBCA('#hdnsite').val(), client: JQBCA('#hdnclient').val(), lang: lngMeta }, onSelect: function (suggestion) { JQBCA(".input-auto-complete").val(suggestion.value); JQBCA(".gsa-search").submit(); } }); }); } }; return { init: init }; })(); BCACOID.goToAnchor = (function () {
            var init = function () {
                JQBCA('.anchor-banner').each(function () { var t = JQBCA(this).text(); var uri = t.replace(/\s+/g, '-').toLowerCase(); JQBCA(this).attr('id', uri); JQBCA('.banner-foot ul').append('<li><a class="anchor-scroll"' + ' data-target="' + uri + '">' + t + '</a></li>'); if (!mobilemode) { JQBCA('.banner-foot').show(); } }); if (JQBCA('.anchor-widget').length > 0) { var icons = JQBCA('.kontak-bca').html(); JQBCA('.kontak-bca').html('<ul></ul>'); JQBCA('.kontak-bca').css('margin-top', '20px'); JQBCA('.anchor-widget').each(function () { var t = JQBCA(this).text(); var uri = t.replace(/\s+/g, '-').toLowerCase(); JQBCA(this).attr('id', uri); JQBCA('.kontak-bca ul').append('<li style="border:none;list-style-type:disc;margin-left:12px;height:24px"><a class="anchor-scroll"' + ' data-target="' + uri + '" style="font-size:12px;font-weight:bold;line-height:24px">' + t + '</a></li>'); }); JQBCA('.kontak-bca').append('<br />' + icons); }
                main();
            }; var main = function () { JQBCA('.showcase .anchor-scroll').on('click', function (e) { e.preventDefault(); var target = JQBCA(this).attr('data-target'); JQBCA('html, body').animate({ scrollTop: JQBCA("#" + target).offset().top }, 700); }); JQBCA(document).on('click', '.widget-content .kontak-bca .anchor-scroll', function () { var target = JQBCA(this).attr('data-target'); if (!mobilemode) { BCACOID.sideWidget.desktopClose(); JQBCA('html, body').animate({ scrollTop: JQBCA("#" + target).offset().top }, 700); } else { BCACOID.sideWidget.mobileClose(); JQBCA('html, body').animate({ scrollTop: JQBCA("#" + target).offset().top }, 700); } }); }; return { init: init };
        })(); BCACOID.contentCarousel = (function () {
            var init = function () {
                if (JQBCA('.bxslider').length > 0) {
                    require(["bxslider"], function () {
                        var pagers = JQBCA('.bx-block-pager > div').length; JQBCA('.showcase .bx-block-pager .bx-pager-item').css('width', ((100 - (0.25 * pagers)) / pagers + '%')); JQBCA('.showcase .bx-block-pager .bx-pager-item a').each(function (index, elm) { JQBCA(elm).attr('data-slide-index', index); }); if (JQBCA('.bxslider li .incontent').length > 0) { JQBCA('.bxslider > li > div').addClass('padding-top'); }
                        if (JQBCA('.bxslider li').length > 1) { if (JQBCA('.bx-block-pager').length > 0) { JQBCA('.hero').removeClass('loading').find('.bxslider').bxSlider({ touchEnabled: true, swipeThreshold: 50, pause: 7000, controls: false, auto: true, autoHover: true, pagerCustom: '.bx-block-pager', adaptiveHeight: true }); JQBCA('.showcase').css('padding-bottom', '15px'); } else { JQBCA('.hero').removeClass('loading').find('.bxslider').bxSlider({ touchEnabled: true, swipeThreshold: 50, pause: 7000, controls: false, auto: true, autoHover: true, adaptiveHeight: true }); } } else { JQBCA('.hero').removeClass('loading'); JQBCA('.showcase').css('padding-bottom', '15px'); }
                        JQBCA('.bxslider-carousel').bxSlider({ slideWidth: 242, pause: 7000, minSlides: 1, maxSlides: 3, moveSlides: 1, responsive: true, slideMargin: 3 });
                    });
                }
                if (JQBCA('.slick, .slick-focus').length > 0) { require(["slick", "attrchange"], function () { var activeiteminload = JQBCA('.slick-focus .slick-center').attr('data-rel'); JQBCA('.slick').show().slick({ infinite: false, slidesToShow: 1 }); JQBCA('.slick-focus').show().slick({ centerMode: true, centerPadding: '0px', slidesToShow: 3, adaptiveHeight: true, responsive: [{ breakpoint: 780, settings: { centerMode: true, centerPadding: '0px', slidesToShow: 3 } }, { breakpoint: 480, settings: { centerMode: true, centerPadding: '0px', slidesToShow: 1 } }] }); JQBCA('.' + activeiteminload).addClass('slick-description-active'); JQBCA('.item-slick').attrchange({ trackValues: true, callback: function (evt) { if (evt.attributeName == "class") { if (evt.newValue.search(/slick-center/i) == -1) { var activeitem = JQBCA('.slick-focus .slick-center').attr('data-rel'); JQBCA('.slick-description').removeClass('slick-description-active'); JQBCA('.' + activeitem).addClass('slick-description-active'); } } } }); }); }
            }; var responsive = function () { if (JQBCA(window).width() < 992) { JQBCA('.showcase .bxslider li > div').css('width', '100%'); } else { JQBCA('.showcase .bxslider li > div').css('width', '440px'); } }; return { init: init, responsive: responsive };
        })(); BCACOID.centeredPagination = (function () { var init = function () { if (JQBCA('.twbs-pagination').length > 0) { require(["twbspagination"], function () { JQBCA('.twbs-pagination').twbsPagination({ first: '', last: '', prev: ' ', next: ' ', totalPages: 35, visiblePages: 10 }); }); } }; return { init: init }; })(); BCACOID.contentMasonry = (function () {
            var init = function () {
                if (JQBCA('.content-masonry').length > 0) {
                    require(["masonry"], function () {
                        JQBCA('.content-masonry').masonry({ columnWidth: 1, itemSelector: '.card-item' }); if (JQBCA('#content-card-id').length > 0 && JQBCA("#btnLainnya").length > 0) {
                            JQBCA(".left12items").hide(); JQBCA('.content-masonry').masonry({ columnWidth: 1, itemSelector: '.card-item' }); if ((JQBCA("#myHiddenInput").val()) < 6) { JQBCA("#btnLainnya").parent().hide(); }
                            JQBCA("#btnLainnya").click(function () { JQBCA(".left12items").fadeIn(); JQBCA("#btnLainnya").parent().hide(); JQBCA('#content-card-id').masonry({ columnWidth: 1, itemSelector: '.card-item' }); }); JQBCA("#ddlFilter").change(function () {
                                var selectedCategory = this.value; if (selectedCategory == "All Categories" || selectedCategory == "Semua Kategori") return; var objParam = { param: selectedCategory }; JQBCA.ajax({
                                    type: "POST", url: "api/sitecore/BankdanKita/BankdanKita", data: { 'TemplateID': selectedCategory }, dataType: "html", cache: false, success: function (result) {
                                        JQBCA('.content-masonry').masonry({ columnWidth: 1, itemSelector: '.card-item' }); JQBCA('#content-card-id').remove(); JQBCA(".result").html(result); JQBCA("#btnLainnya").parent().hide(); JQBCA('#content-card-id').fadeIn(800); if ((JQBCA("#myHiddenInput").val()) < 6) { JQBCA("#btnLainnya").parent().hide(); } else if ((JQBCA("#myHiddenInput").val()) > 6) { JQBCA(".left12items").hide(); JQBCA("#btnLainnya").parent().show(); }
                                        JQBCA('.content-masonry').masonry({ columnWidth: 1, itemSelector: '.card-item' });
                                    }, error: function (ex) { alert('Failed to load ' + ex); }
                                });
                            });
                        }
                    });
                }
                if (JQBCA('#content-promo').length > 0) {
                    require(["masonry"], function () {
                        if ((JQBCA("#myHiddenInput").val()) < 6) { JQBCA("#btnLainnya").parent().hide(); }
                        JQBCA("#btnLainnya").click(function () { JQBCA("#btnLainnya").parent().hide(); }); JQBCA("#ddlJenisPromo").change(function () {
                            var valJenisKartuKredit = null; var valJenisProduk = null; var valDaerahPromo = null; var valJenisPromo = null; if (document.getElementById('ddlKartuKredit') != null) { valJenisKartuKredit = document.getElementById('ddlKartuKredit').value; } else if (document.getElementById('ddlJenisProduk') != null) { valJenisProduk = document.getElementById('ddlJenisProduk').value; }
                            if (document.getElementById('ddlDaerahPromo') != null) { valDaerahPromo = document.getElementById('ddlDaerahPromo').value; }
                            if (document.getElementById('ddlJenisPromo') != null) { valJenisPromo = document.getElementById('ddlJenisPromo').value; }
                            var promoCardType = 'Kartu Kredit'; if (JQBCA('#FlagHiddenTitle').length > 0) { var promoCardType = document.getElementById('FlagHiddenTitle').value; }
                            try {
                                var parameterModel = {
                                    TempIDJenisKartuKredit: valJenisKartuKredit,
                                    TempIDDaerahPromo: valDaerahPromo,
                                    TempIDJenisPromo: valJenisPromo,
                                    PromoCardType: promoCardType
                                }; window.location = window.location.pathname + "?TempIDJenisPromo=" + valJenisPromo;
                            }
                            catch (e) {
                                alert('error' + e);
                            }
                        });
                    });
                }
                //Tambahan AW 12 Agustus 2016
                //For Content MarketPlace
                if (JQBCA('#content-marketplace').length > 0) {
                    JQBCA("#ddlKategoriBancassurance").change(function () {
                        var KategoriAsuransiID = null;
                        if (document.getElementById('ddlKategoriBancassurance') != null)
                            KategoriAsuransiID = document.getElementById('ddlKategoriBancassurance').value;

                        try {
                            var ParamaterValue = { TempIDJenisPromo: KategoriAsuransiID };
                            window.location = window.location.pathname + "?TempIDJenisPromo=" + KategoriAsuransiID;
                        } catch (e) { alert('error ' + e); }
                    });
                }
                //End tambahan AW 12 Agustus 2016
            };

            var responsive = function () { JQBCA('.content-masonry').masonry({ columnWidth: 1, itemSelector: '.card-item' }); }; return { init: init, responsive: responsive };
        })(); BCACOID.tabCollapse = (function () { var init = function () { JQBCA('#search-tab').tabCollapse({ tabsClass: 'hidden-sm hidden-xs', accordionClass: 'visible-sm visible-xs' }); JQBCA('.panel-group').on('shown.bs.collapse', function () { var panel = JQBCA(this).find('.in'); JQBCA('html, body').animate({ scrollTop: panel.offset().top + (-60) }, 500); }); }; return { init: init }; })(); BCACOID.contentTabber = (function () { var init = function () { JQBCA('.tablist-h, .tablist-v, .tablist-search').on('click', function () { JQBCA(this).find('a[data-toggle="tab"]').tab('show'); }); JQBCA('.produk-atm .triger-tab a').on('click', function (e) { e.preventDefault(); JQBCA('.triger-tab span').removeClass('bubble-blue').addClass('bubble-gray'); JQBCA(this).parent().removeClass('bubble-gray').addClass('bubble-blue'); JQBCA(this).tab('show'); }); JQBCA('.horizontal-tab').each(function () { var th = JQBCA(this).find('.tablist-h').length; JQBCA(this).find('.tablist-h').css('width', ((100 / th) + '%')); }); JQBCA('.tablist-h').on('click', function () { JQBCA('.tablist-h').removeClass('active'); JQBCA(this).addClass('active'); }); JQBCA('.vertical-tab').each(function () { var tlwh = JQBCA(this).find('.tablist-wrap').height(); var limit = 208; tlwh < limit ? JQBCA(this).find('.tab-content').height(limit) : JQBCA(this).find('.tab-content').height(tlwh); }); JQBCA('.tablist-v').on('click', function () { JQBCA('.tablist-v').removeClass('active'); JQBCA(this).addClass('active'); }); JQBCA('.tablist-search').on('click', function () { JQBCA('.tablist-search').removeClass('active'); JQBCA(this).addClass('active'); }); }; return { init: init }; })(); BCACOID.contentAccordion = (function () { var init = function () { JQBCA('.collapse').collapse({}); JQBCA('#accordion').on('show.bs.collapse', function () { JQBCA(this).find('.in').collapse("hide"); }); JQBCA('#accordion').on('shown.bs.collapse', function () { JQBCA(this).find('.panel-heading').css('background-color', '#a1a1a1'); JQBCA(this).find('.in').parent().find('.panel-heading').css('background-color', '#19bcb9').find('.pull-right').removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up up'); var closed = JQBCA(this).find('.glyphicon-collapse-down'); if (closed.hasClass('collapsed')) { JQBCA('body').animate({ scrollTop: $('#accordion .in').offset().top - 50 }, 100); } }); JQBCA('#accordion').on('hidden.bs.collapse', function () { JQBCA(this).find('.panel-heading').css('background-color', '#a1a1a1'); JQBCA(this).find('.in').parent().find('.panel-heading').css('background-color', '#19bcb9'); JQBCA(this).find('.up').parents('.panel').find('.panel-collapse').each(function () { if (!JQBCA(this).hasClass('in')) { JQBCA(this).parent().find('.up').removeClass('glyphicon-collapse-up up').addClass('glyphicon-collapse-down'); } }); }); }; return { init: init }; })(); BCACOID.AutoPay = (function () {
            var init = function () {
                JQBCA('.content.autopay .show-less .btn').click(function () { JQBCA('.content.autopay .show-less').addClass('hide'); JQBCA('.content.autopay .show-more').removeClass('hide'); }); JQBCA('.content.autopay .show-more .btn').click(function () { JQBCA('.content.autopay .show-more').addClass('hide'); JQBCA('.content.autopay .show-less').removeClass('hide'); }); if (JQBCA('.content.autopay-form').length > 0) { require(["jquery-unobtrusive-ajax", "jquery-validate", "jquery-validate-unobtrusive"]); }
                JQBCA('.content.autopay-form form .btn.btn-submit').click(function () {
                    var form = JQBCA('.content.autopay-form form'); var submitData = form.serialize(); var checkboxAgreement = JQBCA('.content.autopay-form form .checkbox-agreement'); if (form.valid()) {
                        if (checkboxAgreement.is(':checked')) { JQBCA.ajax({ type: 'POST', url: '/api/sitecore/AutoPay/RegisterAutoPay', data: submitData, success: function (data) { if (data.IsSuccess && data.Result.AutoPayExternalAjaxPostUrl != null) { alert(data.Message); var dataSubmittedToExternal = { PenyediaLayanan: data.Result.PenyediaLayanan, NamaPelanggan: data.Result.NamaPelanggan, IdPelanggan: data.Result.IdPelanggan }; JQBCA.ajax({ type: 'POST', url: data.Result.AutoPayExternalAjaxPostUrl, data: dataSubmittedToExternal, success: function (extData) { if (extData != null && extData.PenyediaLayanan != "" && extData.NamaPelanggan != "" && extData.IdPelanggan != "") { alert('Data has been successfully submitted to external resources'); } }, error: function (xhr, textStatus, error) { alert(textStatus); } }); } else { alert(data.Message); } }, error: function (xhr, textStatus, error) { alert(textStatus); } }); }
                        else { var agreementValidationMessage = JQBCA('.content.autopay-form form .agreement-validation-message'); agreementValidationMessage.show(); }
                    }
                });
            }; return { init: init };
        })(); BCACOID.Kurs = (function () {
            var init = function () {
                var currentCulture = JQBCA('meta[name=language]').attr("content") || "id"; function stringCurrencyToNumber(cur) {
                    var stringVal = cur; if (currentCulture.match("id")) { stringVal = stringVal.replace(new RegExp('\\.', 'g'), ""); stringVal = stringVal.replace(",", "."); } else { stringVal = stringVal.replace(new RegExp(',', 'g'), ""); }
                    return Number(stringVal);
                }
                function calcRate(txt) {
                    if (JQBCA(".text-currency1").val() == '') { JQBCA(".text-currency2").val('0'); return; }
                    var text1 = JQBCA(".text-currency1").val(); var nominal = stringCurrencyToNumber(text1); var curr1 = JQBCA(".dropdown-currency1").val(); var curr2 = JQBCA(".dropdown-currency2").val(); if (curr1 == "0")
                        curr1 = 1; if (curr2 == "0")
                            curr2 = 1; var result = (curr1 / curr2 * nominal); if (txt) { require(["priceFormat", "globalize", "glcultures"], function () { JQBCA(".text-currency1").val(Globalize.format(nominal, "n2")); }); }
                    require(["priceFormat", "globalize", "glcultures"], function () { JQBCA(".text-currency2").val(Globalize.format(result, "n2")); });
                }
                if (currentCulture.match("id")) { require(["priceFormat", "globalize", "glcultures"], function () { Globalize.culture('id'); JQBCA('.text-currency1').priceFormat({ prefix: '', centsLimit: 0, limit: 24, centsSeparator: '', thousandsSeparator: '.' }); }); } else { require(["priceFormat", "globalize", "glcultures"], function () { Globalize.culture('en'); JQBCA(".text-currency1").priceFormat({ prefix: '', centsLimit: 0, limit: 24, centsSeparator: '', thousandsSeparator: ',' }); }); }
                JQBCA(".dropdown-currency1").ready(function () { JQBCA(".dropdown-currency1").val('1'); JQBCA(".text-currency1").val(''); JQBCA(".text-currency2").val(''); }); JQBCA(".text-currency1").on('focus', function () { var text1 = JQBCA(".text-currency1").val(); var nominal = stringCurrencyToNumber(text1); require(["priceFormat", "globalize", "glcultures"], function () { JQBCA(".text-currency1").val(Globalize.format(nominal, "n0")); }); }); JQBCA(".dropdown-currency1").on("change", function () { calcRate(true); }); JQBCA(".dropdown-currency2").on("change", function () { calcRate(true); }); JQBCA(".text-currency1").bind("input", function () { calcRate(false); }); JQBCA(".btn-count").bind("click", function () { calcRate(true); });
            }; return { init: init };
        })(); JQBCA(document).ready(function () {
            BCACOID.globalInit.init(); BCACOID.megaMenu.init(); BCACOID.sideWidget.init(); BCACOID.mobileMenu.init(); BCACOID.multiLang.init(); BCACOID.scrollToTop.init(); BCACOID.offCanvasSearch.init(); BCACOID.searchAutoComplite.init(); BCACOID.goToAnchor.init(); BCACOID.contentCarousel.init(); BCACOID.contentTabber.init(); BCACOID.contentAccordion.init(); BCACOID.centeredPagination.init(); BCACOID.contentMasonry.init(); BCACOID.AutoPay.init(); BCACOID.Kurs.init(); try { JQBCA('#txtKeyword2').focus(); }
            catch (e)
            { }
            JQBCA(window).scroll(function (event) { var scroll = JQBCA(window).scrollTop(); _sh = JQBCA(window).height(); _sw = JQBCA(window).width(); var bound = _sh / 2; try { if (JQBCA('.cls_widget').width() == 0) { JQBCA('html, body').removeClass('disable-main-scroll'); JQBCA('.scroll-to-top').css('display', 'inline'); } else if (JQBCA('.cls_widget').width() > 0) { JQBCA('.scroll-to-top').css('display', 'none'); } } catch (e) { } }); JQBCA('.col-md-3 .card-item').removeClass('col-md-3').addClass('col-md-12').css('margin-left', '0').parent().css('padding-left', '0'); var searchCategory = JQBCA('.search-category > div').length; if (!mobilemode) { JQBCA('.search-category > div').css('width', ((100 - (0.25 * searchCategory)) / searchCategory + '%')); } else { JQBCA('.search-category > div').css('width', '100%'); }
            JQBCA('#wizard-submit').on('click', function () { JQBCA('html, body').animate({ scrollTop: JQBCA("#holiday-plan").offset().top }, 400); }); JQBCA('.video-item > img').wrap('<div class="video-thumbnail"></div>'); JQBCA('#home .kurs-converter').prev().find('table').css('height', JQBCA('#home .kurs-converter > .panel').height() + 1 + 'px'); JQBCA('.image-shadow').append('<img class="shadow" src="/assets/images/shadow-kartu-atm.png">'); JQBCA('.gotel').on('click', function (e) {
                e.preventDefault(); var link = this; JQBCA('#myModalTel').modal('show'); JQBCA('.btn-reject').on('click', function () { JQBCA('#myModalTel').modal('hide'); if (JQBCA('.slick-slider').length > 0) { JQBCA('.slick-next').show(); JQBCA('.slick-prev').show(); } }); JQBCA('#myModalTel').on('click', function () { JQBCA('#myModalTel').modal('hide'); if (JQBCA('.slick-slider').length > 0) { JQBCA('.slick-next').show(); JQBCA('.slick-prev').show() } }); JQBCA('.btn-accept').on('click', function () { window.location = link.href; JQBCA('#myModalTel').modal('hide'); }); if (mobilemode) {
                    try { BCACOID.mobileMenu.close(); JQBCA('html, body').removeClass('disable-main-scroll'); if (JQBCA('.slick-prev').length > 0) { JQBCA('.slick-next').hide(); JQBCA('.slick-prev').hide() } }
                    catch (e)
                    { }
                }
            }); var ExtPopLinkText = ''; JQBCA('.gosocmed').on('click', function (e) {
                e.preventDefault(); var link = this; JQBCA('#myModalPopUp').find('.content-socmed').css('display', 'inline-block'); JQBCA('#myModalPopUp').find('.content-gojek').css('display', 'none'); JQBCA('#myModalPopUp').modal('show'); JQBCA('.btn-reject').unbind('click').on('click', function () { JQBCA('#myModalPopUp').modal('hide'); }); JQBCA('.btn-accept').unbind('click').on('click', function () { window.open(link.href); JQBCA('#myModalPopUp').modal('hide'); }); if (mobilemode) {
                    try { BCACOID.mobileMenu.close(); }
                    catch (e)
                    { }
                }
            }); JQBCA('.gojek').on('click', function (e) {
                e.preventDefault(); var link = this; var sourceTextPopup = link.lastElementChild.value; var innerElementTextPopup = null; try { JQBCA('#myModalPopUp').find('.content-socmed').css('display', 'none'); JQBCA('#myModalPopUp').find('.content-gojek').css('display', 'inline-block'); if (JQBCA('#myModalPopUp').find('.content-gojek').find('.panel-body').length > 0) { innerElementTextPopup = (JQBCA('#myModalPopUp').find('.content-gojek').find('.panel-body'))[0].lastElementChild; innerElementTextPopup.textContent = sourceTextPopup; } else { innerElementTextPopup.textContent = 'No Custom Text'; } } catch (e) { innerElementTextPopup.textContent = 'No Custom Text'; }
                JQBCA('#myModalPopUp').modal('show'); JQBCA('.btn-reject').unbind('click').on('click', function () { JQBCA('#myModalPopUp').modal('hide'); }); JQBCA('.btn-accept').unbind('click').on('click', function () { window.open(link.firstElementChild.href); JQBCA('#myModalPopUp').modal('hide'); }); if (mobilemode) {
                    try { BCACOID.mobileMenu.close(); }
                    catch (e)
                    { }
                }
            }); JQBCA('#popoverPanel .btn').on('click', function () { JQBCA(this).parents('#popoverPanel').hide(); }); JQBCA('.btnKeyword1').on('click', function () { var keyword = JQBCA("#txtKeyword1").val(); var url = JQBCA('#hdnsiteSearchPage').val() + "?query=" + keyword; window.location = url; }); JQBCA('.btnKeyword2').on('click', function () { var keyword = JQBCA("#txtKeyword2").val(); var url = JQBCA('#hdnsiteSearchPage').val() + "?query=" + keyword; window.location = url; }); JQBCA('#txtKeyword1').keypress(function (e) {
                var key = e.which; var ok = key >= 65 && key <= 90 || key >= 97 && key <= 122 || key >= 48 && key <= 57 || key == 13 || key == 32 || key == 8 || key == 46 || key == 45; if (!ok) { e.preventDefault(); }
                else {
                    if (key == 13)
                    { var keyword = JQBCA("#txtKeyword1").val(); var url = JQBCA('#hdnsiteSearchPage').val() + "?query=" + keyword; window.location = url; return false; }
                }
            }); JQBCA('#txtKeyword2').keypress(function (e) {
                var key = e.which; var ok = key >= 65 && key <= 90 || key >= 97 && key <= 122 || key >= 48 && key <= 57 || key == 13 || key == 32 || key == 8 || key == 46 || key == 45; if (!ok) { e.preventDefault(); }
                else {
                    if (key == 13)
                    { var keyword = JQBCA("#txtKeyword2").val(); var url = JQBCA('#hdnsiteSearchPage').val() + "?query=" + keyword; window.location = url; return false; }
                }
            }); JQBCA('#txtKeyword3').keypress(function (e) { var key = e.which; var ok = key >= 65 && key <= 90 || key >= 97 && key <= 122 || key >= 48 && key <= 57 || key == 13 || key == 32 || key == 8 || key == 46 || key == 45; if (!ok) { e.preventDefault(); } }); if (JQBCA('.thousandsep-en').length > 0) { require(["priceFormat"], function () { JQBCA('.thousandsep-en').priceFormat({ prefix: '', centsLimit: 0, limit: 13, centsSeparator: '', thousandsSeparator: ',' }); }); }
            if (JQBCA('.thousandsep').length > 0) { require(["priceFormat"], function () { JQBCA('.thousandsep').priceFormat({ prefix: '', centsLimit: 0, limit: 13, centsSeparator: '', thousandsSeparator: '.' }); }); }
            JQBCA(".numberInput").bind("keypress, keydown", function (e) {
                e = (e) ? e : window.event; var charCode = (e.which) ? e.which : e.keyCode; if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105) && (charCode != 46) && (charCode != 188) && (charCode != 190) && (charCode != 39)) { return false; }
                return true;
            }); JQBCA(".profile-mgmt").on('click', function (e) { var currentParent = JQBCA(this).parents(".card-item"); var currentImage = currentParent.find("img").attr("src"); var currentName = currentParent.find(".panel-heading p:first-child").text(); var currentPosition = currentParent.find(".panel-heading p:last-child").text(); var currentDescription = currentParent.find(".panel-body").html(); JQBCA("#myModal").find("img").attr("src", currentImage); JQBCA("#myModal").find(".panel-heading p:first-child").text(currentName); JQBCA("#myModal").find(".panel-heading p:last-child").text(currentPosition); JQBCA("#myModal").find(".panel-body").html(currentDescription); });
        
		//pemidahan js dari DP_SiteSearch 20161010
		JQBCA('.tablist-search').on('click', function () {
        //JQBCA('.tablist-search').removeClass('active');
        //JQBCA(this).addClass('active');
        //window.location = "/SearchResult?site=" + JQBCA(this).attr('site');
        var siteTab = JQBCA(this).attr('site');
        if (siteTab.match("all")) {
            siteTab = JQBCA('#hdnsite').val();
            window.location = JQBCA('#hdnsiteSearchPage').val() + "?query=" + JQBCA('#txtKeyword3').val() + "&sort=" + JQBCA('#hdnsort').val();
        }
        else {
            window.location = JQBCA('#hdnsiteSearchPage').val() + "?query=" + JQBCA('#txtKeyword3').val() + "&sort=" + JQBCA('#hdnsort').val() + "&site=" + siteTab;
        }
    });

    JQBCA('.selectOrder').change(function () {
        var str = "";
        JQBCA(".selectOrder option:selected").each(function () {
            str += JQBCA(this).val();
        });

        //if (str.match("Relevansi")) {
        //    window.location = "/SearchResult?sort=date%3AD%3AL%3Ad1";
        //}
        //else {
        //    window.location = "/SearchResult?sort=date%3AD%3AS%3Ad1";
        //}

        if (str.match("1")) {
            window.location = JQBCA('#hdnsiteSearchPage').val() + "?query=" + JQBCA('#txtKeyword3').val() + "&sort=date%3AD%3AL%3Ad1&site=" + JQBCA('#hdnsite').val();
            //window.location = "/SearchResult?sort=date%3AD%3AL%3Ad1";
        }
        else {
            //window.location = "/SearchResult?sort=date%3AD%3AS%3Ad1";
            window.location = JQBCA('#hdnsiteSearchPage').val() + "?query=" + JQBCA('#txtKeyword3').val() + "&sort=date%3AD%3AS%3Ad1&site=" + JQBCA('#hdnsite').val();
        }

    });
	if(typeof(totalHalaman) == "undefined")
	{totalHalaman= "";}
	if(JQBCA('.twbs-pagination-searchresult').length > 0  && totalHalaman > 10){
    JQBCA('.twbs-pagination-searchresult')
            .html('').removeData("twbs-pagination-searchresult")
            .unbind("page").twbsPagination({
                totalPages: totalHalaman,
                first: '',
                last: '',
                prev: ' ',
                next: ' ',
                visiblePages: 10,
                onPageClick: function (event, page) {
                    var start = parseInt(JQBCA('#hdnstart').val()) + (page * 10) - 10;
                    var url = urlAction + "?page=" + page + "&query=" + encodeURIComponent(JQBCA('#txtKeyword3').val()) + "&sort=" + JQBCA('#hdnsort').val() + "&site=" + JQBCA('#hdnsite').val() + "&start=" + start + "&filter=0";

                    var sh = JQBCA(window).height(),
                        sw = JQBCA(window).width(),
                        mobilemode;

                    if (sw <= 1024) {
                        mobilemode = true;
                    } else {
                        mobilemode = false;
                    }

                    JQBCA(".contentbodysearchresult").html('').load(url, function () {
                        //logic here

                        //dropdown bubble
                        JQBCA('.bubble-gray-lg.dropdown-wrap > select').wrap('<div class="dropdown-option"><div class="select-wrap"></div></div>');
                        //

                        //Search Category--
                        var searchCategory = JQBCA('.search-category > div').length;
                        //JQBCA('.search-category > div').css('width', ((100 - (0.25 * searchCategory)) / searchCategory + '%'));
                        //--

                        //JQBCA('.search-category > div').css('width', ((100 - (0.25 * searchCategory)) / searchCategory + '%'));
                        if (!mobilemode) {
                            JQBCA('.search-category > div').css('width', ((100 - (0.25 * searchCategory)) / searchCategory + '%'));
                        } else {
                            JQBCA('.search-category > div').css('width', '100%');
                        }
                        // end - search Page

                        JQBCA('.tablist-search').on('click', function () {
                            //JQBCA('.tablist-search').removeClass('active');
                            //JQBCA(this).addClass('active');
                            //window.location = "/SearchResult?site=" + JQBCA(this).attr('site');
                            var siteTab = JQBCA(this).attr('site');
                            if (siteTab.match("all")) {
                                siteTab = JQBCA('#hdnsite').val();
                                window.location = JQBCA('#hdnsiteSearchPage').val() + "?query=" + JQBCA('#txtKeyword3').val() + "&sort=" + JQBCA('#hdnsort').val();
                            }
                            else {
                                window.location = JQBCA('#hdnsiteSearchPage').val() + "?query=" + JQBCA('#txtKeyword3').val() + "&sort=" + JQBCA('#hdnsort').val() + "&site=" + siteTab;
                            }
                        });

                        JQBCA('.selectOrder').change(function () {
                            var str = "";
                            JQBCA(".selectOrder option:selected").each(function () {
                                //str += JQBCA(this).text() + " ";
                                str += JQBCA(this).val();
                            });

                            if (str.match("1")) {
                                window.location = JQBCA('#hdnsiteSearchPage').val() + "?query=" + JQBCA('#txtKeyword3').val() + "&sort=date%3AD%3AL%3Ad1&site=" + JQBCA('#hdnsite').val();
                                //window.location = "/SearchResult?sort=date%3AD%3AL%3Ad1";
                            }
                            else {
                                //window.location = "/SearchResult?sort=date%3AD%3AS%3Ad1";
                                window.location = JQBCA('#hdnsiteSearchPage').val() + "?query=" + JQBCA('#txtKeyword3').val() + "&sort=date%3AD%3AS%3Ad1&site=" + JQBCA('#hdnsite').val();
                            }

                        });
                        //--
                    });
                }
            });
		}
		// end of pemidahan js dari DP_SiteSearch 20161010
		
		}); JQBCA(window).load(function () { }); JQBCA(window).bind('resize', function () {
            sh = JQBCA(window).height(); sw = JQBCA(window).width(); try {
                if (JQBCA('.content produk-atm').length > 0) { JQBCA(".content produk-atm").load(location.href + " .content produk-atm"); }
                BCACOID.globalInit.responsive(); BCACOID.sideWidget.responsive(); BCACOID.mobileMenu.responsive(); BCACOID.scrollToTop.responsive(); BCACOID.contentCarousel.responsive(); try { BCACOID.contentMasonry.responsive(); } catch (errMsg) { }
                try {
                    if (JQBCA('.cls_widget').width() == 0) { JQBCA('html, body').removeClass('disable-main-scroll'); }
                    if (isMobileSideMenuShow == true) { JQBCA('.overlay').remove(); JQBCA('.navbar-toggle').click(); }
                } catch (e) { }
                var searchCategory = JQBCA('.search-category > div').length; if (!mobilemode) { JQBCA('.search-category > div').css('width', ((100 - (0.25 * searchCategory)) / searchCategory + '%')); } else { JQBCA('.search-category > div').css('width', '100%'); }
            } catch (e) { }
        }); $(window).bind('resize', function () {
            var row = $('.iz_grid_thumb_list'); $.each(row, function () {
                $.each($(this).find('div[class*="col-"].iz_grid_item'), function () { $(this).height('auto'); }); var maxh = 0; $.each($(this).find('div[class*="col-"].iz_grid_item'), function () {
                    if ($(this).height() > maxh)
                        maxh = $(this).height();
                }); $.each($(this).find('div[class*="col-"].iz_grid_item'), function () { $(this).height(maxh); });
            });
        }); if (JQBCA('.lokasi-bca-map').length > 0) {
            require(["markerclusterer", "googlemapapi"], function () {
                require(["angular", "angular-ui-router", "ui-bootstrap-tpls"], function () {
                    var app = angular.module('app', ['ui.bootstrap']); app.controller('mapCtrl', function ($scope, $http) {
                        var vm = this; $scope.mapWidget = function () {
                            activate(); function activate() { searchNear(5); }
                            function searchNear(radius) {
                                getGeolocation(function (latlng, err) {
                                    var str = ''; if (err) { vm.errLabel = "Your current location cannot be detected. Please allow your location from your browser. We set your center to Menara BCA."; str = baseUrl + 'webapi/webapilocation?status=3&lat=-6.1967113&lng=106.8227216&distance=' + radius; } else { str = baseUrl + 'webapi/webapilocation?status=3&lat=' + latlng.lat + '&lng=' + latlng.lng + '&distance=' + radius; }
                                    $http.get(str).success(function (data, status, headers, config) {
                                        if (data && data.length > 0) { createMarkers(data); }
                                        else vm.errLabel = "no data found.";
                                    }).error(function (data, status, headers, config) { vm.errLabel = "no data found."; });
                                });
                            }
                            function getGeolocation(callback) { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(function (position) { vm.errLabel = null; var latlng = { lat: position.coords.latitude, lng: position.coords.longitude }; callback(latlng, null); }, function (err) { callback(null, err); }); } else { callback(null, 'html5 geolcoation not supported'); } }
                            function createMarkers(datas) { var latlng = { lat: datas[0].Latitude, lng: datas[0].Longitude }; vm.staticMap = { name: datas[0].Type + " " + datas[0].Name, address: datas[0].Address, city: datas[0].City }; vm.staticMap.staticMap = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlng.lat + "," + latlng.lng + "&zoom=18&size=340x200&markers=color:blue%7C" + latlng.lat + "," + latlng.lng + "&style=feature:poi.business%7Celement:all%7Cvisibility:off" + "&key=AIzaSyComTilwU0JrN8D8oHKMzfiCV4SW6dHTp4"; $scope.$apply(); }
                        }
                    }); app.filter('startFrom', function () { return startFromFilter; function startFromFilter(input, start) { start = parseInt(start, 10); return input.slice(start); } }); app.controller('mainMapCtrl', function ($scope, $http, $compile) {
                        var vm = this; var map; var markerCluster; var infowindow; var directionsService; var directionsDisplay; var geoMarker; var geocoder; var singleMarker = null; var lastAnimation = null; vm.errLabel = null; vm.errLabel2 = null; vm.errLabelNear = null; vm.errLabelFilter = null; vm.markers = []; vm.markerList = []; vm.validateNear = validateNear; vm.validateFilter = validateFilter; vm.getDirections = getDirections; vm.clickTitle = clickTitle; vm.clickPopoverTitle = clickPopoverTitle; vm.selectTypeChanged = selectTypeChanged; vm.countClearfix = countClearfix; vm.hidePopover = hidePopover; vm.totalItems = 0; vm.currentPage = 1; vm.itemsPerPage = 16; vm.maxSize = 10; vm.selectType = 'ATM'; vm.near = {}; vm.filter = {}; vm.popover = null; vm.isFirstOpen = true; vm.isSecondOpen = false; activate(); function countClearfix(i) { var index = parseFloat(i) + 1; if (index % 4 == 0) { return true; } else { return false; } }
                        function hidePopover() { JQBCA('#popoverPanel').hide(); }
                        function activate() { getAtmType(); getCity(); initMap(); searchNear('All', 1); }
                        function selectTypeChanged() { if (vm.selectType == 'ATM') { document.getElementById('spanTerdekatJenisATM').style.display = ""; document.getElementById('spanFilterJenisATM').style.display = ""; } else { document.getElementById('spanTerdekatJenisATM').style.display = "none"; document.getElementById('spanFilterJenisATM').style.display = "none"; } }
                        function initMap() { var styles = [{ featureType: 'poi.business', elementType: 'all', stylers: [{ visibility: 'off' }] }]; var styledMap = new google.maps.StyledMapType(styles, { name: 'Styled Map' }); var options = { 'zoom': 16, 'center': new google.maps.LatLng(-6.23074, 106.830002), 'mapTypeControlOptions': { 'mapTypeIds': [google.maps.MapTypeId.ROADMAP, 'map_style'] }, 'scrollwheel': false }; map = new google.maps.Map(document.getElementById('map'), options); map.mapTypes.set('map_style', styledMap); map.setMapTypeId('map_style'); directionsService = new google.maps.DirectionsService; directionsDisplay = new google.maps.DirectionsRenderer; geocoder = new google.maps.Geocoder; }
                        function clearDirections() { if (directionsDisplay) { directionsDisplay.setMap(null); } }
                        function hideMarkers() { angular.forEach(vm.markers, function (value, key) { value.setVisible(false); }); if (markerCluster) { markerCluster.repaint(); } }
                        function showMarkers() { angular.forEach(vm.markers, function (value, key) { value.setVisible(true); }); if (markerCluster) { markerCluster.repaint(); } }
                        function clearSingleMarker() { if (singleMarker) { singleMarker.setMap(null); singleMarker = null; } }
                        function createSingleMarker(key) { clearSingleMarker(); singleMarker = new google.maps.Marker({ position: vm.markers[key].getPosition(), map: map }); singleMarker.addListener('click', function () { singleMarkerTrigger(key); }); singleMarker.setAnimation(google.maps.Animation.BOUNCE); }
                        function createMarkers(datas) { hideMarkers(); clearDirections(); clearSingleMarker(); vm.popover = null; document.getElementById("popoverPanel").style.display = "none"; vm.markers = []; vm.markerList = []; markerCluster = new MarkerClusterer(map, []); markerCluster.setMaxZoom(20); angular.forEach(datas, function (value, key) { value.key = key; var latlng = new google.maps.LatLng(value.Latitude, value.Longitude); var marker = new google.maps.Marker({ position: latlng, map: map }); markerCluster.addMarker(marker, true); marker.addListener('visible_changed', function () { if (marker.getVisible()) { markerCluster.addMarker(marker, true); } else { markerCluster.removeMarker(marker, true); } }); marker.addListener('click', function () { markerTrigger(key); }); vm.markers.push(marker); vm.markerList.push(value); }); vm.totalItems = vm.markerList.length; var latlng = vm.markers[0].getPosition(); map.setCenter(latlng); map.setZoom(16); }
                        function markerTrigger(key) {
                            document.getElementById("popoverPanel").style.display = ""; vm.popover = vm.markerList[key]; map.setCenter(vm.markers[key].getPosition()); map.setZoom(21); if (lastAnimation) {
                                if (lastAnimation != key)
                                    vm.markers[lastAnimation].setAnimation(null);
                            }
                            if (vm.markers[key].getAnimation() == null)
                                vm.markers[key].setAnimation(google.maps.Animation.BOUNCE); lastAnimation = key; setTimeout(function () { $scope.$apply(); }, 200);
                        }
                        function singleMarkerTrigger(key) {
                            document.getElementById("popoverPanel").style.display = ""; vm.popover = vm.markerList[key]; map.setCenter(singleMarker.getPosition()); if (singleMarker.getAnimation() == null)
                                singleMarker.setAnimation(google.maps.Animation.BOUNCE); setTimeout(function () { $scope.$apply(); }, 200);
                        }
                        function clickTitle(key) { JQBCA('html, body').animate({ scrollTop: JQBCA("#map").offset().top }, 500); if (singleMarker) { clearSingleMarker(); clearDirections(); showMarkers(); markerTrigger(key); } else { markerTrigger(key); } }
                        function clickPopoverTitle(key) { if (singleMarker) { singleMarkerTrigger(key); } else { markerTrigger(key); } }
                        function getDirections(key) {
                            JQBCA('html, body').animate({ scrollTop: JQBCA("#map").offset().top }, 500); JQBCA('#popoverPanel').hide(); vm.errLabel2 = null; vm.errLabelNear = null; vm.errLabelFilter = null; var markerPos = vm.markers[key].getPosition(); getGeolocation(function (latlng, err) {
                                if (err) { vm.errLabel = "Your current location cannot be detected. Please allow your location from your browser. We set your center to Menara BCA."; latlng = { lat: -6.1967113, lng: 106.8227216 }; }
                                directionsService.route({ origin: latlng, destination: markerPos, travelMode: google.maps.TravelMode.DRIVING }, function (response, status) { if (status === google.maps.DirectionsStatus.OK) { clearDirections(); hideMarkers(); createSingleMarker(key); directionsDisplay.setMap(map); directionsDisplay.setDirections(response); directionsDisplay.setOptions({ 'suppressMarkers': true }); } else { vm.errLabel2 = 'Can not get directions for this location.'; } });
                            });
                        }
                        function setGeoMarker(latlng) {
                            if (geoMarker) geoMarker.setMap(null); geocoder.geocode({ 'location': latlng }, function (results, status) {
                                var content = "No Description found for this coordinates"; if (status === google.maps.GeocoderStatus.OK) { if (results[1]) content = results[1].formatted_address; }
                                map.setCenter(latlng); geoMarker = new google.maps.Marker({ position: latlng, map: map, animation: google.maps.Animation.BOUNCE, icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }); geoMarker.setAnimation(google.maps.Animation.BOUNCE); geoMarker.addListener('click', function () { if (infowindow) infowindow.close(); infowindow = new google.maps.InfoWindow({ content: content }); infowindow.open(map, geoMarker); });
                            });
                        }
                        function getGeolocation(callback) { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(function (position) { vm.errLabel = null; var latlng = { lat: position.coords.latitude, lng: position.coords.longitude }; setGeoMarker(latlng); callback(latlng, null); }, function (err) { map.setCenter({ lat: -6.1967113, lng: 106.8227216 }); callback(null, err); }); } else { map.setCenter({ lat: -6.1967113, lng: 106.8227216 }); callback(null, 'html5 geolcoation not supported'); } }
                        function validateNear() {
                            vm.errLabelNear = null; vm.errLabelFilter = null; var flag = true; if (vm.near) {
                                if (vm.selectType == 'ATM') { if (!vm.near.selectJenisATM) flag = false; }
                                if (!vm.near.selectRadius) flag = false;
                            } else flag = false; if (flag) searchNear(vm.near.selectJenisATM, vm.near.selectRadius); else vm.errLabelNear = 'You have to fill all the inputs.';
                        }
                        function validateFilter() {
                            vm.errLabelNear = null; vm.errLabelFilter = ''; var flag = true; if (vm.filter) {
                                if (!vm.filter.selectCity) { flag = false; vm.errLabelFilter = 'You have to chose dropdown. '; }
                                if (vm.filter.keyword) { if (vm.filter.keyword.length < 3) { flag = false; vm.errLabelFilter += 'Fill Keyword minimum 3 characters. '; } }
                                else vm.filter.keyword = '';
                            } else flag = false; if (flag) filterLocation(vm.filter.selectJenisATM, vm.filter.selectCity, vm.filter.keyword);
                        }
                        function searchNear(jenisAtm, radius) { vm.errLabel2 = null; vm.errLabelNear = null; vm.errLabelFilter = null; getGeolocation(function (latlng, err) { var str = ''; if (err) { vm.errLabel = "Your current location cannot be detected. Please allow your location from your browser. We set your center to Menara BCA."; str = baseUrl + 'webapi/webapilocation?status=3&locationtype=' + vm.selectType + '&type=' + jenisAtm + '&lat=-6.1967113&lng=106.8227216&distance=' + radius; } else str = baseUrl + 'webapi/webapilocation?status=3&locationtype=' + vm.selectType + '&type=' + jenisAtm + '&lat=' + latlng.lat + '&lng=' + latlng.lng + '&distance=' + radius; $http.get(str).success(function (data, status, headers, config) { if (data && data.length > 0) { createMarkers(data); } else vm.errLabel2 = "no data found."; }).error(function (data, status, headers, config) { }); }); }
                        function filterLocation(jenisAtm, city, keyword) { vm.errLabel2 = null; vm.errLabelNear = null; vm.errLabelFilter = null; $http.get(baseUrl + 'webapi/webapilocation?status=4&locationtype=' + vm.selectType + '&type=' + jenisAtm + '&city=' + city + '&keyword=' + keyword).success(function (data, status, headers, config) { if (data && data.length > 0) { createMarkers(data); } else vm.errLabel2 = "no data found."; }).error(function (data, status, headers, config) { }); }
                        function getAtmType() { vm.errLabel2 = null; vm.errLabelNear = null; vm.errLabelFilter = null; $http.get(baseUrl + 'webapi/webapilocation?status=2').success(function (data, status, headers, config) { console.log('getAtmType', data); if (data && data.length > 0) { vm.atmTypes = data; setTimeout(function () { vm.near.selectJenisATM = "All"; vm.filter.selectJenisATM = "All"; vm.near.selectRadius = '1'; $scope.$apply(); }, 200); } else vm.errLabel2 = "No ATM type found."; }).error(function (data, status, headers, config) { }); }
                        function getCity() { vm.errLabel2 = null; vm.errLabelNear = null; vm.errLabelFilter = null; $http.get(baseUrl + 'webapi/webapilocation?status=1').success(function (data, status, headers, config) { if (data && data.length > 0) { vm.cities = data; } else vm.errLabel2 = "No city found."; }).error(function (data, status, headers, config) { }); }
                    }); angular.bootstrap(document, ["app"]);
                });
            });
        } else {
            require(["angular", "angular-sanitize"], function () {
                var app = angular.module('app', []); app.controller('kkCtrl', function ($http, $scope, $compile, $sce) {
                    var vm = this; var datas; vm.selectedCheckbox = 0; vm.disable_submit = true; vm.creditCardResultDescription = ""; vm.creditCardResultDetailLink = ""; vm.creditCardResultDaftarOnlineLink = ""; vm.creditCardResultImage = ""; vm.creditCardResultImageTitle = ""; vm.creditCardResultTitle = ""; vm.SelectChange = SelectChange; vm.ImgClick = ImgClick; vm.Submit = Submit; vm.BtnLihatSemuaClick = BtnLihatSemuaClick; vm.isChecked = {}; vm.isDisabled = {}; vm.isResultShown = false; vm.teaserSimulasiTextHtmlTrusted = ""; vm.isCreditCardIsNotFoundMessageShown = false; FetchData(); function FetchData() { var contextLanguage = JQBCA('.content.content-simulation.creditcard-simulation .sitecore-context-language'); var renderingDatasource = JQBCA('.content.content-simulation.creditcard-simulation .sitecore-rendering-datasource'); $http.get('/WebApi/WebApiCreditCard/?contextlanguage=' + contextLanguage.val() + '&renderingdatasource=' + renderingDatasource.val()).success(function (data, status, headers, config) { datas = data; vm.model = datas; vm.teaserSimulasiTextHtmlTrusted = $sce.trustAsHtml(vm.model.Contents[0].TeaserSimulasiText); }).error(function (data, status, headers, config) { console.log('error angular :', data, status, headers, config); }); }
                    function SelectChange(c) {
                        var opt = GetSelectedOption(c, vm); if (vm.isChecked[c]) { vm.selectedCheckbox++; if (opt != null) { JQBCA('#' + opt.CreditCardCheckListID).show(); } }
                        else { vm.selectedCheckbox--; if (opt != null) { JQBCA('#' + opt.CreditCardCheckListID).hide(); } }
                        ToggleCheckboxesNgDisabledValue();
                    }
                    function ToggleCheckboxesNgDisabledValue() {
                        if (vm.selectedCheckbox == 3) {
                            for (var x in datas.Selected) { if (!vm.isChecked[datas.Selected[x].CreditCardCheckListID] || vm.isChecked[datas.Selected[x].CreditCardCheckListID] == undefined) { vm.isDisabled[datas.Selected[x].CreditCardCheckListID] = true; } }
                            vm.disable_submit = false;
                        }
                        else {
                            for (var x in datas.Selected) { if (!vm.isChecked[datas.Selected[x].CreditCardCheckListID] || vm.isChecked[datas.Selected[x].CreditCardCheckListID] == undefined) { vm.isDisabled[datas.Selected[x].CreditCardCheckListID] = false; } }
                            vm.disable_submit = true;
                        }
                    }
                    function GetSelectedOption(n, vm) { for (var i = 0; i < vm.model.Selected.length; i++) { var opt = vm.model.Selected[i]; if (opt.CreditCardCheckListID == n) { return opt; } else { continue; } } }
                    function ImgClick(n) {
                        var opt = GetSelectedOption(n, vm); if (!vm.isDisabled[n] || vm.isDisabled[n] == undefined) {
                            if (vm.isChecked[n]) { vm.isChecked[n] = false; }
                            else { vm.isChecked[n] = true; }
                            SelectChange(n);
                        }
                    }
                    function Submit() {
                        var isCreditCardFound = false; for (var idxResult in datas.Result) {
                            var creditCardResultID = datas.Result[idxResult].CreditCardResultID; for (var idxRules in datas.Rules) {
                                if (datas.Rules[idxRules][creditCardResultID] != undefined) {
                                    var options = datas.Rules[idxRules][creditCardResultID]; var optionsArray = options.split(','); for (var idxOptionArray in optionsArray) {
                                        if (vm.isChecked[optionsArray[idxOptionArray]]) { isCreditCardFound = true; }
                                        else { isCreditCardFound = false; break; }
                                    }
                                    if (isCreditCardFound) { vm.creditCardResultDescription = $sce.trustAsHtml(datas.Result[idxResult].CreditCardResultDescription); vm.creditCardResultDetailLink = datas.Result[idxResult].CreditCardResultDetailLink; vm.creditCardResultDaftarOnlineLink = datas.Result[idxResult].CreditCardResultDaftarOnlineLink; vm.creditCardResultImage = datas.Result[idxResult].CreditCardResultImage; vm.creditCardResultImageTitle = datas.Result[idxResult].CreditCardResultImageTitle; vm.creditCardResultTitle = datas.Result[idxResult].CreditCardResultTitle; vm.isResultShown = true; vm.isCreditCardIsNotFoundMessageShown = false; break; }
                                    else { vm.creditCardResultDescription = ""; vm.creditCardResultDetailLink = ""; vm.creditCardResultDaftarOnlineLink = ""; vm.creditCardResultImage = ""; vm.creditCardResultImageTitle = ""; vm.creditCardResultTitle = ""; vm.isResultShown = false; vm.isCreditCardIsNotFoundMessageShown = true; }
                                }
                            }
                            if (isCreditCardFound) { break; }
                        }
                    }
                    function BtnLihatSemuaClick(url) { window.location = url; }
                }); app.controller('mapCtrl', function ($scope, $http) {
                    var vm = this; $scope.mapWidget = function () {
                        activate(); function activate() { searchNear(5); }
                        function searchNear(radius) {
                            getGeolocation(function (latlng, err) {
                                var str = ''; if (err) { vm.errLabel = "Your current location cannot be detected. Please allow your location from your browser. We set your center to Menara BCA."; str = baseUrl + 'webapi/webapilocation?status=3&lat=-6.1967113&lng=106.8227216&distance=' + radius; } else { str = baseUrl + 'webapi/webapilocation?status=3&lat=' + latlng.lat + '&lng=' + latlng.lng + '&distance=' + radius; }
                                $http.get(str).success(function (data, status, headers, config) {
                                    if (data && data.length > 0) { createMarkers(data); }
                                    else vm.errLabel = "no data found.";
                                }).error(function (data, status, headers, config) { vm.errLabel = "no data found."; });
                            });
                        }
                        function getGeolocation(callback) { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(function (position) { vm.errLabel = null; var latlng = { lat: position.coords.latitude, lng: position.coords.longitude }; callback(latlng, null); }, function (err) { callback(null, err); }); } else { callback(null, 'html5 geolcoation not supported'); } }
                        function createMarkers(datas) { var latlng = { lat: datas[0].Latitude, lng: datas[0].Longitude }; vm.staticMap = { name: datas[0].Type + " " + datas[0].Name, address: datas[0].Address, city: datas[0].City }; vm.staticMap.staticMap = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlng.lat + "," + latlng.lng + "&zoom=18&size=340x200&markers=color:blue%7C" + latlng.lat + "," + latlng.lng + "&style=feature:poi.business%7Celement:all%7Cvisibility:off" + "&key=AIzaSyComTilwU0JrN8D8oHKMzfiCV4SW6dHTp4"; $scope.$apply(); }
                    }
                }); angular.bootstrap(document, ["app"]);
            });
        }
    })();
});