(function(r){var h=window.AmazonUIPageJS||window.P,A=h._namespace||h.attributeErrors,p=A?A("AmazonPopoversAUIShim"):h;p.guardFatal?p.guardFatal(r)(p,window):p.execute(function(){r(p,window)})})(function(r,h,A){r.when("a-domready").execute(function(){var h=document.createElement("DIV");h.id="ap_container";document.body.childNodes.length?document.body.insertBefore(h,document.body.childNodes[0]):document.body.appendChild(h)});h.AmazonPopoverImages="https:"===location.protocol?{snake:"https://images-na.ssl-images-amazon.com/images/G/01/javascripts/lib/popover/images/snake._V1_.gif",
btnClose:"https://images-na.ssl-images-amazon.com/images/G/01/javascripts/lib/popover/images/btn_close._V1_.gif",closeTan:"https://images-na.ssl-images-amazon.com/images/G/01/nav2/images/close-tan-sm._V1_.gif",closeTanDown:"https://images-na.ssl-images-amazon.com/images/G/01/nav2/images/close-tan-sm-dn._V1_.gif",loadingBar:"https://images-na.ssl-images-amazon.com/images/G/01/javascripts/lib/popover/images/loading-bar-small._V1_.gif",pixel:"https://images-na.ssl-images-amazon.com/images/G/01/icons/blank-pixel._V1_.gif"}:
{snake:"http://g-ecx.images-amazon.com/images/G/01/javascripts/lib/popover/images/snake._V1_.gif",btnClose:"http://g-ecx.images-amazon.com/images/G/01/javascripts/lib/popover/images/btn_close._V1_.gif",closeTan:"http://g-ecx.images-amazon.com/images/G/01/nav2/images/close-tan-sm._V1_.gif",closeTanDown:"http://g-ecx.images-amazon.com/images/G/01/nav2/images/close-tan-sm-dn._V1_.gif",loadingBar:"http://g-ecx.images-amazon.com/images/G/01/javascripts/lib/popover/images/loading-bar-small._V1_.gif",pixel:"http://g-ecx.images-amazon.com/images/G/01/icons/blank-pixel._V1_.gif"};
(function(){function p(e){if(!e||e.AmazonPopover)return!1;var p=function(){var a=e("#ap_container");return a.length&&a||e("body")},q={width:function(){return Math.min(e(h).width(),e(document).width())},height:function(){return e(h).height()}},r=function(){var a=[],b=[{x:0,y:0}],c=0,d=[0,0],f=!1,l=function(){for(var a=[],d=1;3>d;d++)a.push(b[(c-d+3)%3]);return e.extend(!0,{},{cursor:b[c],priorCursors:a})},k=function(d){for(var f=0;f<a.length;f++){var h=a[f],k=0<e.grep(h.rects,function(a){return b[c].x>=
a[0]&&b[c].y>=a[1]&&b[c].x<a[0]+a[2]&&b[c].y<a[1]+a[3]}).length;null!==h.inside&&k&&!h.inside&&h.mouseEnter?h.inside=h.mouseEnter(l()):null!==h.inside&&!k&&h.inside&&h.mouseLeave&&(h.inside=!h.mouseLeave(d,l()))}},m=function(){d=[e(h).scrollLeft(),e(h).scrollTop()];e(document).mousemove(function(a){"undefined"!==typeof a.pageY&&(c=(c+1)%3,b[c]={x:a.pageX,y:a.pageY});k()});I(!0)||e(document).scroll(function(a){b[c].x+=e(h).scrollLeft()-d[0];b[c].y+=e(h).scrollTop()-d[1];d=[e(h).scrollLeft(),e(h).scrollTop()];
k()});f=!0};return{add:function(b,c){f||m();var d=e.extend({rects:b},c);a.push(d);return d},remove:function(b){for(var c=0;c<a.length;c++)if(a[c]===b){a.splice(c,1);break}},checkNow:function(){k(!0)},getCallbackArgs:function(){return l()}}}(),v=function(){var a='<iframe frameborder="0" tabindex="-1" src="'+(e.browser.msie&&6>=parseInt(e.browser.version,10)?h.AmazonPopoverImages.pixel:"javascript:void(false)")+'" style="display:none;position:absolute;z-index:0;filter:Alpha(Opacity=\'0\');opacity:0;" />',
b=[],c=function(c){for(var f=0;f<c;f++)b.push(e(a).prependTo(p()))};e(document).ready(function(){c(3)});return{checkout:function(a){b.length||c(1);return b.pop().css({display:"block",top:a.offset().top,left:a.offset().left,width:a.outerWidth(),height:a.outerHeight(),zIndex:Number(a.css("z-index"))-1})},checkin:function(a){b.push(a.css("display","none"))}}}(),y=function(){var a=[];/Win/.test(navigator.platform);/Mac/.test(navigator.platform);/Linux/.test(navigator.platform);parseInt(e.browser.version,
10);var b=function(a){if(a.hasClass("ap_never_hide"))return!0;for(var b=[a.offset().left,a.offset().top,a.outerWidth(),a.outerHeight()],c=[],h=0;h<n.length;h++){var m=!1;n[h].settings.modal||(m=n[h].bounds,m=b[0]>m[0]+m[2]||m[0]>b[0]+b[2]||b[1]>m[1]+m[3]||m[1]>b[1]+b[3]);m||c.push(n[h])}return c.length&&(a.is("object,embed")&&"window"==(a.attr("wmode")||a.children("object,embed").attr("wmode")||a.parent("object,embed").attr("wmode")||"window").toLowerCase()||a.is("iframe")&&e.browser.safari)?!1:!0},
c=function(a,b){a.is("iframe[id^=DA],iframe[id^=cachebust]")?a.css({display:b?"block":"none"}):a.css({visibility:b?"visible":"hidden"})};return{update:function(){for(var d=[],f=0;f<a.length;f++){var h=a[f];b(h)?c(h,1):d.push(h)}a=d;e("object:visible,embed:visible,iframe:visible").each(function(){var d=e(this);b(d)||(a.push(d),c(d,0))})}}}(),L=function(a,b){var c=null,d=null;b=b||{};!1!==b.useIFrame&&(d=v.checkout(a));var e=[[a.offset().left,a.offset().top,a.outerWidth(),a.outerHeight()]];if(b.additionalCursorRects)for(var h=
0;h<b.additionalCursorRects.length;h++)e.push(b.additionalCursorRects[h]);c=r.add(e,b);y.update();a.backing={destroy:function(){c&&(r.remove(c),c=null);d&&(v.checkin(d),d=null);y.update()},refreshBounds:function(){var b=[a.offset().left,a.offset().top,a.outerWidth(),a.outerHeight()];c&&(c.rects[0]=b);d&&d.css({left:b[0],top:b[1],width:b[2],height:b[3]});y.update()},reposition:function(a,b){d&&d.css({left:a,top:b});c&&(c.rects[0][0]=a,c.rects[0][1]=b)},iframe:d}},M={width:500,followScroll:!1,locationMargin:4,
alignMargin:0,windowMargin:4,locationFitInWindow:!0,focusOnShow:!0,modal:!1,draggable:!1,zIndex:200,showOnHover:!1,hoverShowDelay:400,hoverHideDelay:200,skin:"default",useIFrame:!0,clone:!1,ajaxSlideDuration:400,ajaxErrorContent:null,paddingLeft:17,paddingRight:17,paddingBottom:8},u=null,n=[],w={MOUSE_ENTER:1,MOUSE_LEAVE:2,CLICK_TRIGGER:4,CLICK_OUTSIDE:8,fromStrings:function(a){var b=0,c=this;a&&e.each(e.makeArray(a),function(){b|=c[this]});return b}},J={},G=null,B={},N={"default":'<div class="ap_popover ap_popover_sprited" surround="6,16,18,16" tabindex="0">                     <div class="ap_header">                         <div class="ap_left"/>                         <div class="ap_middle"/>                         <div class="ap_right"/>                     </div>                     <div class="ap_body">                         <div class="ap_left"/>                         <div class="ap_content"><img src="'+
h.AmazonPopoverImages.snake+'"/></div>                         <div class="ap_right"/>                     </div>                     <div class="ap_footer">                         <div class="ap_left"/>                         <div class="ap_middle"/>                         <div class="ap_right"/>                     </div>                     <div class="ap_titlebar">                         <div class="ap_title"/>                     </div>                     <div class="ap_close"><a href="#"><span class="ap_closetext"/><span class="ap_closebutton"><span></span></span></a></div>                 </div>',
default_non_sprited:'<div class="ap_popover ap_popover_unsprited" surround="6,16,18,16" tabindex="0">                     <div class="ap_header">                         <div class="ap_left"/>                         <div class="ap_middle"/>                         <div class="ap_right"/>                     </div>                     <div class="ap_body">                         <div class="ap_left"/>                         <div class="ap_content"><img src="'+h.AmazonPopoverImages.snake+'"/></div>                         <div class="ap_right"/>                     </div>                     <div class="ap_footer">                         <div class="ap_left"/>                         <div class="ap_middle"/>                         <div class="ap_right"/>                     </div>                     <div class="ap_titlebar">                         <div class="ap_title"/>                     </div>                     <div class="ap_close"><a href="#"><span class="ap_closetext"/><img border="0" src="'+
h.AmazonPopoverImages.btnClose+'"/></a></div>                 </div>',classic:'<div class="ap_classic">                     <div class="ap_titlebar">                         <div class="ap_close">                             <img width="46" height="16" border="0" alt="close" onmouseup=\'this.src="'+h.AmazonPopoverImages.closeTan+"\";' onmouseout='this.src=\""+h.AmazonPopoverImages.closeTan+"\";' onmousedown='this.src=\""+h.AmazonPopoverImages.closeTanDown+'";\' src="'+h.AmazonPopoverImages.closeTan+
'" />                         </div>                         <span class="ap_title"></span>                     </div>                     <div class="ap_content"><img src="'+h.AmazonPopoverImages.loadingBar+'"/></div>                 </div>'},X=function(a){var b={left:Infinity,top:Infinity,right:-Infinity,bottom:-Infinity};a.each(function(){try{var a=e(this),d=a.offset(),f=a.outerWidth(),h=a.outerHeight();if(a.is("area"))var k=O(a),d={left:k[0],top:k[1]},f=k[2]-k[0],h=k[3]-k[1];d.left<b.left&&(b.left=
d.left);d.top<b.top&&(b.top=d.top);d.left+f>b.right&&(b.right=d.left+f);d.top+h>b.bottom&&(b.bottom=d.top+h)}catch(m){}});return b},Y=function(a){if(!(1>=n.length)){var b=Math.max.apply(Math,e.map(n,function(a){return Number(a.css("z-index"))}));Number(a.css("z-index"))!=b&&(a.css("z-index",b+2),a.backing&&a.backing.iframe.css("z-index",b+1))}};e.fn.removeAmazonPopoverTrigger=function(){this.unbind("click.amzPopover");this.unbind("mouseover.amzPopover");this.unbind("mouseout.amzPopover");return this};
e.fn.amazonPopoverTrigger=function(a){var b=e.extend({},M,a),c=this,d=null;b.showOnHover||"default"!=b.skin||this.bind("mouseover.amzPopover",Q);a="string"==typeof b.showOnHover?c.filter(b.showOnHover):b.showOnHover?c:e([]);var f=null;a.bind("mouseover.amzPopover",function(a){d||f||(f=setTimeout(function(){if(!d){var a=c.parent(),e=a.length,a=e?a.attr("tagName")||a.get(0).tagName:A;e&&a&&(!b.triggeringEnabled||b.triggeringEnabled.call(c))&&(d=E(b,c,function(){d=null}))}f=null},b.hoverShowDelay));
return!1});a.bind("mouseout.amzPopover",function(a){!d&&f&&(clearTimeout(f),f=null)});c.bind("click.amzPopover",function(a){if(!0===b.followLink||"function"==typeof b.followLink&&b.followLink.call(c,d,b))return!0;if(d)d.triggerClicked();else if(!b.triggeringEnabled||b.triggeringEnabled.call(c))d=E(b,c,function(){d=null});return!1});this.amznPopoverHide=function(){d&&d.close()};this.amznPopoverVisible=function(){return!!d};return this};var E=function(a,b,c){Z(a);var d=null;if(b)for(var f=b.eq(0).parents().get(),
l=0;l<f.length&&!d;l++)for(var k=0;k<n.length&&!d;k++)n[k].get(0)==f[l]&&(d=n[k]);var m=[];m.remove=function(a){for(var b=0;b<this.length;b++)if(this[b]===a){this.splice(b,1);break}};var q=!1;e.each(M,function(b,c){"undefined"==typeof a[b]&&(a[b]=c)});a.location||(a.location=a.modal||!b?"centered":"auto");null===a.showCloseButton&&(a.showCloseButton=!a.showOnHover);e.each(n,function(){a.zIndex=Math.max(a.zIndex,Number(this.css("z-index"))+2)});var v=(a.showOnHover?w.MOUSE_LEAVE:w.CLICK_TRIGGER)|(a.modal?
w.CLICK_OUTSIDE:0),v=(v|w.fromStrings(a.closeEventInclude))&~w.fromStrings(a.closeEventExclude),y,t=function(){a.group&&(B[a.group]=null);E&&E.parents("body").length&&(C&&C.parents("body").length?(E.hide().insertAfter(C),C.remove(),C=null):E.hide().appendTo(p()));E!=g&&g.remove();d&&d.children.remove(g);for(var f=0;f<n.length;f++)if(n[f]===g){n.splice(f,1);break}g.backing&&(g.backing.destroy(),g.backing=null);r.checkNow();c&&c();a.onHide&&a.onHide.call(b,g,a);a.modal&&u&&(u.fitToScreen&&e(h).unbind("resize",
u.fitToScreen),u.remove(),u=null);e(document).unbind("scroll.AmazonPopover");e(document).unbind("click",y);for(f=0;f<m.length;f++)m[f].close();m=[];return!1},z=function(c,d){var f=g.find(".ap_sub_content");0===f.length&&(f=g.find(".ap_content"));"string"==typeof c?f.html(c):f.empty().append(c);if("boolean"==typeof a.autoshow?a.autoshow:d)e.browser.msie&&f.children().show().hide(),f.children(":not(style)").show();f.find(".ap_custom_close").click(t);a.onFilled&&a.onFilled.call(b,g,a);return f};a.modal&&
!u&&(u=aa(t,a.zIndex));var g=null,E=null,C=null;"default"==a.skin?(Q(),g=G,G=null):(f=(f=e.isFunction(a.skin)?a.skin():a.skin)||"<div><div class='ap_content' /></div>",f=/^[^<]*(<(.|\s)+>)[^>]*$/.test(f)?f:N[f],g=e(f));e.browser.msie&&6==parseInt(e.browser.version,10)&&ba(g);"default"==a.skin&&g.find(".ap_content").css({paddingLeft:a.paddingLeft,paddingRight:a.paddingRight,paddingBottom:a.paddingBottom});a.localContent?a.clone?z(e(a.localContent).clone(!0),!0):(E=e(a.localContent),C=e("<span style='display:none' />").insertBefore(E),
z(E,!0)):a.literalContent&&z(a.literalContent);if(a.destination){var I="function"==typeof a.destination?a.destination():a.destination;!1!==a.cacheable&&J[I]?z(J[I]):e.ajax({url:I,timeout:a.ajaxTimeout,success:function(c){a.onAjaxSuccess&&a.onAjaxSuccess.apply(a,arguments);var d=c.match(/^(\s|\x3c!--[\s\S]*?--\x3e)*<\w+[^>]*\s+cacheable="(.*?)"/i)||c.match(/^(\s|\x3c!--[\s\S]*?--\x3e)*<\w+[^>]*\s+cacheable='(.*?)'/i);!1===a.cacheable||d&&"0"===d[2]||(J[I]=c);if(d=c.match(/^(\s|\x3c!--[\s\S]*?--\x3e)*<\w+[^>]*\s+popoverTitle="(.*?)"/i)||
c.match(/^(\s|\x3c!--[\s\S]*?--\x3e)*<\w+[^>]*\s+popoverTitle='(.*?)'/i))a.title=d[2],g.find(".ap_title").html(a.title);0<a.ajaxSlideDuration&&(!e.browser.msie||"BackCompat"!=document.compatMode)?(g.find(".ap_content").hide(),z(c),a.width||D(g,a,b),a.onAjaxShow&&a.onAjaxShow.call(b,g,a),g.find(".ap_content").slideDown(a.ajaxSlideDuration,function(){D(g,a,b)})):(z(c),a.onAjaxShow&&a.onAjaxShow.call(b,g,a),D(g,a,b))},error:function(){var c=null,c="function"==typeof a.ajaxErrorContent?a.ajaxErrorContent.apply(a,
arguments):a.ajaxErrorContent;null!==c&&((c=z(c).children("[popoverTitle]").attr("popoverTitle"))&&g.find(".ap_title").html(c),D(g,a,b))}})}if(!a.localContent&&!a.literalContent&&!a.destination)throw"AmazonPopover wasn't provided a source of content.";d&&d.children.push(g);a.surround=e.map((g.attr("surround")||"0,0,0,0").split(","),function(a){return Number(a)});g.css({zIndex:a.zIndex,position:"absolute",left:-2E3,top:-2E3});g.click(function(a){a.metaKey||a.stopPropagation();q=!0});y=function(a){0!==
a.button&&1!=a.which||a.metaKey||t()};v&w.CLICK_OUTSIDE&&e(document).click(y);g.mousedown(function(a){m.length||Y(g)});(f=a.width&&("function"==typeof a.width?a.width():a.width))||(f=R(g,a)||g.outerWidth());f&&g.css("width",f);a.followScroll&&e(document).bind("scroll.AmazonPopover",function(b){a.followScroll(b)});null!==a.title&&a.title!==A?(l=g.find(".ap_titlebar"),"default"==a.skin&&(l.css({width:f-36}),l.find(".ap_title").css("width",f-70),g.find(".ap_content").css({paddingTop:18})),g.find(".ap_title").html(a.title),
a.draggable&&!a.modal&&ca(l,g),l.show(),"default"==a.skin&&a.wrapTitlebar&&(l.addClass("multiline"),g.find(".ap_content").css({paddingTop:l.outerHeight()-9}))):g.find(".ap_titlebar").hide();!1!==a.showCloseButton?(g.find(".ap_close").show().click(t).mousedown(function(a){a.preventDefault();a.stopPropagation();return!1}).css("cursor","default"),a.title||g.find(".ap_content").css({paddingTop:10}),g.keydown(function(a){27==a.keyCode&&t()})):g.find(".ap_close").css("display","none");a.closeText?g.find(".ap_closetext").text(a.closeText).show():
g.find(".ap_closebutton span").text("Close");g.appendTo(p());D(g,a,b);e(document.activeElement).filter("input[type=text], select").blur();g.close=t;a.group&&(B[a.group]&&B[a.group].close(),B[a.group]=g);g.show();a.focusOnShow&&(g.get(0).hideFocus=!0,g.focus());u&&u.snapToLeft&&u.snapToLeft();a.onShow&&a.onShow.call(b,g,a);g.bounds=[g.offset().left,g.offset().top,g.outerWidth(),g.outerHeight()];n.push(g);g.reposition=function(){D(g,a,b)};g.close=t;g.settings=a;g.triggerClicked=function(){v&w.CLICK_TRIGGER&&
t()};g.children=m;if(v&w.MOUSE_LEAVE){var x=null,H=[];e.each(b,function(){var a=e(this);a.is("area")?(a=O(a),H.push([a[0],a[1],a[2]-a[0],a[3]-a[1]])):H.push([a.offset().left,a.offset().top,a.outerWidth(),a.outerHeight()])});a.additionalCursorRects&&e(a.additionalCursorRects).each(function(){var a=e(this);H.push([a.offset().left,a.offset().top,a.outerWidth(),a.outerHeight()])});L(g,{solidRectangle:a.solidRectangle,useIFrame:a.useIFrame,mouseEnter:function(){x&&(clearTimeout(x),x=null);return!0},mouseLeave:function(b){if(a.semiStatic&&
q)return!m.length;x&&(clearTimeout(x),x=null);return 0===m.length?(b?t():x=setTimeout(function(){t();x=null},a.hoverHideDelay),!0):!1},additionalCursorRects:H,inside:!0})}else L(g,{solidRectangle:a.solidRectangle,useIFrame:a.useIFrame});e(function(){for(var a=0;a<n.length;a++)n[a].settings.modal&&n[a].backing.refreshBounds()});return g},I=function(a){var b=["iPhone","iPad"];a&&b.push("Silk/","Kindle Fire","Android","\\bTouch\\b");a="("+b.join("|")+")";return navigator.userAgent.match(new RegExp(a,
"i"))},aa=function(a,b){var c=e('<div id="ap_overlay"/>');e.browser.msie?(c.fitToScreen=function(a){a=e(document).height();var f=e(h).width(),l=c.children();c.css({width:f,height:a,backgroundColor:"transparent",zIndex:b});for(var k=[],m=0;m<l.size()||0<a-2E3*m;m++){var n=Math.min(a-2E3*m,2E3);0<n?m<l.size()?l.eq(m).css({width:f,height:n}):(n=e("<div/>").css({opacity:.4,zIndex:b,width:f,height:n,top:2E3*m}),k.push(n[0])):l.eq(m).remove()}k.length&&c.append(k)},c.snapToLeft=function(){c.css("left",
e(document).scrollLeft())},e(h).bind("resize load",c.fitToScreen),e(h).scroll(c.snapToLeft),c.snapToLeft(),c.fitToScreen()):c.css({width:e.browser.msie?e(h).width():"100%",height:e.browser.msie||I()?e(document).height():"100%",position:e.browser.mozilla||e.browser.safari?"fixed":"",opacity:.4,zIndex:b});return c.appendTo(p())},da=function(a,b,c,d,e){a.hasClass("ap_popover_sprited")&&(b=b-c.top-e[1],45>b?b=45:b>a.outerHeight()-35&&(b=a.outerHeight()-35),d="left"==d?"right":"left",c=a.find(".ap_body .ap_"+
d),0<c.length?c.removeClass("ap_"+d).addClass("ap_"+d+"-arrow"):c=a.find(".ap_body .ap_"+d+"-arrow"),c.css("backgroundPosition",("left"==d?0:-51)+"px "+(b-327)+"px"))},D=function(a,b,c){b.width||a.css("width",R(a,b));var d=b.locationOffset||[0,0];if("function"==typeof b.location)c=b.location.call(c,a,b);else{var f=e.map(e.makeArray(b.location),function(a){return"auto"==a?["bottom","left","right","top"]:a}),h=(c=b.locationElement&&e(b.locationElement)||c)&&X(c);c=S[f[0]](h,a,b);for(var k=0,m=1;m<f.length&&
!c.fits;m++){var n=S[f[m]](h,a,b);n.fits&&(c=n,k=m)}!b.attached||"left"!=f[k]&&"right"!=f[k]||da(a,(h.top+h.bottom)/2,c,f[k],d)}a.css({left:c.left+d[0],top:c.top+d[1],margin:c.margin,right:c.right});a.backing&&a.backing.refreshBounds()},T=function(a,b,c){var d=e.makeArray(c.align||"left"),f={min:e(document).scrollLeft()+c.windowMargin-c.surround[3],max:q.width()+e(document).scrollLeft()-c.windowMargin-b.outerWidth(),left:a.left-c.surround[3]-c.alignMargin,right:a.right-b.outerWidth()+c.surround[1]+
c.alignMargin,center:(a.left+a.right-b.outerWidth())/2},d=e.grep(e.makeArray(c.align),function(a){return f[a]});0===d.length&&d.push("left");for(a=0;a<d.length;a++)if(f[d[a]]>=f.min&&f[d[a]]<=f.max)return f[d[a]];return c.forceAlignment?f[d[0]]:f.min>f.max?f.min:f[d[0]]<f.min?f.min:f.max},U=function(a,b,c){var d=e(document).scrollTop()+c.windowMargin,f=q.height()+e(document).scrollTop()-c.windowMargin;if(c.attached){var h=(a.top+a.bottom)/2;h-45<d&&(d=d+45<a.bottom?d:a.bottom-45);h+35>f&&(f=f-35>
a.top?f:a.top+35)}else d=Math.min(a.top-c.alignMargin,d),f=Math.max(a.bottom+c.alignMargin,f);var k={min:d-c.surround[0],max:f-b.outerHeight()+c.surround[2],top:a.top-c.surround[0]-c.alignMargin,bottom:a.bottom-b.outerHeight()+c.alignMargin+c.surround[2],middle:(a.top+a.bottom-b.outerHeight())/2};a=e.grep(e.makeArray(c.align),function(a){return k[a]});0===a.length&&a.push("top");for(b=0;b<a.length;b++)if(k[a[b]]>=k.min&&k[a[b]]<=k.max)return k[a[b]];return c.forceAlignment?k[a[0]]:k.min>k.max?k.min:
k[a[0]]<k.min?k.min:k.max},S={centered:function(a,b,c){a=e(h).scrollTop()+100;return{left:-(b.outerWidth()/2),right:0,top:a,margin:"0% 50%",fits:!0}},top:function(a,b,c){var d=a.top-e(document).scrollTop()-2*c.locationMargin,f=a.left>=e(document).scrollLeft()&&a.right<q.width()+e(document).scrollLeft();return{left:T(a,b,c),top:a.top-b.outerHeight()-c.locationMargin+c.surround[2],fits:f&&d>=b.outerHeight()-c.surround[0]-c.surround[2]}},left:function(a,b,c){var d=a.left-e(document).scrollLeft()-2*c.locationMargin;
return{left:a.left-b.outerWidth()-c.locationMargin+c.surround[1],top:U(a,b,c),fits:d>=b.outerWidth()-c.surround[1]-c.surround[3]}},bottom:function(a,b,c){var d=q.height()+e(document).scrollTop()-a.bottom-2*c.locationMargin,f=a.left>=e(document).scrollLeft()&&a.right<q.width()+e(document).scrollLeft();return{left:T(a,b,c),top:a.bottom+c.locationMargin-c.surround[0],fits:f&&d>=b.outerHeight()-c.surround[0]-c.surround[2]}},right:function(a,b,c){var d=q.width()+e(document).scrollLeft()-a.right-2*c.locationMargin;
return{left:a.right+c.locationMargin-c.surround[3],top:U(a,b,c),fits:d>=b.outerWidth()-c.surround[1]-c.surround[3]}},over:function(a,b,c){var d=b.find(c.align||".ap_content *").offset(),f=b.offset(),h=a.left-(d.left-f.left);a=a.top-(d.top-f.top);d=Math.min(h,q.width()+e(document).scrollLeft()-b.outerWidth()-c.windowMargin);d=Math.max(d,e(document).scrollLeft()-c.surround[3]+c.windowMargin);b=Math.min(a,q.height()+e(document).scrollTop()-b.outerHeight()+c.surround[2]-c.windowMargin);b=Math.max(b,e(document).scrollTop()-
c.surround[0]+c.windowMargin);return{left:c.forceAlignment?h:d,top:c.forceAlignment?a:b,fits:h==d&&a==b}}},Z=function(a){a.align=a.align||a.locationAlign;a.literalContent=a.literalContent||a.loadingContent},Q=function(){if(!G){var a=e.browser.msie&&6>=parseInt(e.browser.version,10);G=e(N[a?"default_non_sprited":"default"]).css({left:-2E3,top:-2E3}).appendTo(p())}},ba=function(a){a.find("*").each(function(){var a=(e(this).css("background-image")||"").match(/url\("(.*\.png)"\)/);a&&(a=a[1],e(this).css("background-image",
"none"),e(this).get(0).runtimeStyle.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+a+"',sizingMethod='scale')")})},R=function(a,b){var c=a.find(".ap_content");if("default"==b.skin&&0<c.length){var d=e('<div class="ap_temp">'+c.html()+"</div>");d.css({display:"inline",position:"absolute",top:-9999,left:-9999});p().append(d);var f=parseInt(c.parent().css("margin-left"),10)||0,c=parseInt(c.parent().css("margin-right"),10)||0,f=d.width()+f+c+b.paddingLeft+b.paddingRight+2;0!==f%2&&
f++;d.remove();return Math.min(f,q.width())}return null},ca=function(a,b){a.css("cursor","move");V(a.get(0));a.mousedown(function(a){a.preventDefault();V(document.body);var d=[a.pageX-b.offset().left,a.pageY-b.offset().top],f=function(a){a.preventDefault();b.css({left:a.pageX-d[0],top:a.pageY-d[1],margin:0});b.backing&&b.backing.reposition(a.pageX-d[0],a.pageY-d[1])},h=function(a){b.focus();ea(document.body);e(document).unbind("mousemove",f);e(document).unbind("mouseup",h)};e(document).mousemove(f).mouseup(h)})},
V=function(a){a&&(a.onselectstart=function(a){return!1},a.style.MozUserSelect="none")},ea=function(a){a&&(a.onselectstart=function(a){return!0},a.style.MozUserSelect="")},O=function(a){a=e(a);var b=e.map(a.attr("coords").split(","),function(a){return Number(a)});a.attr("shape").match(/circle/i)&&(b=[b[0]-b[2],b[1]-b[2],b[0]+b[2],b[1]+b[2]]);for(var c=[],d=[],f=0;f<b.length;f++)(0===f%2?c:d).push(b[f]);b=[Math.min.apply(Math,c),Math.min.apply(Math,d)];c=[Math.max.apply(Math,c),Math.max.apply(Math,
d)];a=a.parents("map").attr("name");a=e("img[usemap=#"+a+"]");d=a.offset();d.left+=parseInt(a.css("border-left-width"),10);d.top+=parseInt(a.css("border-top-width"),10);return[d.left+b[0],d.top+b[1],d.left+c[0],d.top+c[1]]};e.AmazonPopover={displayPopover:E,mouseTracker:r,updateBacking:function(a){a&&B[a]&&(a=B[a],a.backing&&a.backing.refreshBounds())},support:{skinCallback:!0,controlCallbacks:!0}};return!0}var r=!1;h.amznJQ&&h.amznJQ.available("jQuery",function(){if(p(h.amznJQ.jQuery||h.jQuery)||
r)h.amznJQ.declareAvailable("popover"),r=!0});"object"===typeof h.P&&"function"===typeof h.P.when&&h.P.when("jQuery").execute(function(e){if(p(e)||r)h.P.register("legacy-popover",function(){return null}),r=!0})})()});