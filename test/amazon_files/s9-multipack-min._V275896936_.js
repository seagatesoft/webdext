S9Multipack=true;
S9MultipackRegistry={};
var registerMultipack=function(b){if(window.S9JQ!==undefined){b=window.S9JQ
}else{window.S9JQ=b
}var e=b(window);
var d=false;
e.load(function(){d=true
});
b.fn.s9Multipack=function(g){var f={minItems:3,maxItems:7,minItemWidth:155,seeded:false,seedHeaderBottomPadding:0,deferImageFlip:false,containerHorizontalPadding:0,suppressInitialResize:false,suppressImageFlip:false};
g=b.extend({},f,g);
this.each(function(){new a(b(this),g)
});
return this
};
function c(i){var g;
function f(){if(!g){h();
g=setTimeout(function(){h();
g=null
},500)
}}function h(){var j=true;
b.each(S9MultipackRegistry[i],function(){this.updateSizes(j);
j=false
})
}return{handleResizeEvent:f}
}function a(j,k){this.options=k;
this.updateSizes=z;
this.getColumnCount=h;
if(!window.S9MultipackResizer){throw"window.S9MultipackResizer not found on "+j[0].id
}var x=b(".s9SeedItem",j);
var v=b(".s9OtherItems",j);
var t=b(".asin",v);
B(j);
var u=j.parents(".unified_widget, .widget");
u.addClass("s9Multipack");
var g=u.parent()[0].id;
var D,q,r,f,n;
var A;
if(k.seeded){D=b(".asin",x);
q=b(".s9_header.seed_header, .s9_header_o.seed_header_o",x);
f=q.children();
r=b(".s9_header.other_header, .s9_header_o.other_header_o",v);
n=r.children();
A=r.height();
var m=parseInt(r.css("margin-bottom"),10);
if(m>0){A+=m
}}else{A=0
}var C=k.minItems;
var w=C;
if(!k.suppressInitialResize){z(true,true)
}y(this);
if(b.browser.msie){o()
}j.data("s9Multipack",this);
function B(E){var G=E.parent();
if(!G.hasClass("s9TouchCanvas")){return
}var F=/ipad/i.test(navigator.userAgent);
if(!F||p(E)){return
}G.addClass("s9Touch");
E.css("width",i(E)+"px")
}function p(E){var F=k.maxItems+(k.seeded?1:0);
return(E.width()>=k.minItemWidth*F)
}function i(E){var I=k.minItemWidth;
var H=I*1.05;
var K=E.width()+0.5*I;
var J=Math.floor(K/H);
var G=K/J;
var F=k.maxItems+(k.seeded?1:0);
return Math.floor(G*F)
}function y(F){if(g){var E=S9MultipackRegistry[g];
if(!E){E=S9MultipackRegistry[g]=[];
S9MultipackRegistry[g].master=F;
e.resize(new c(g).handleResizeEvent)
}E.push(F)
}else{e.resize(function(){z(true)
})
}j.bind("s9MultipackResize",function(H,G){z(true,G)
})
}function z(G,E){var H,F;
H=S9MultipackResizer(j[0],k.minItems,k.maxItems,k.minItemWidth,k.seeded,k.containerHorizontalPadding,!G);
F=H.potentialCols;
if(E||F!=w){w=F;
C=H.cols;
setTimeout(function(){l();
if(k.seeded){s()
}});
j.trigger("s9MultipackColumnCountChanged",H)
}}function s(){var E=Math.max(f[0].offsetHeight,n[0].offsetHeight);
q.css("height",E+"px");
r.css("height",E+"px");
j.css("padding-bottom",E+(k.seedHeaderBottomPadding?k.seedHeaderBottomPadding:0)+"px")
}function l(){if(k.suppressImageFlip){return
}if(k.deferImageFlip&&!d){e.load(l);
return
}var E=function(F){F.find("img").each(function(){if(this.getAttribute("url")){var G=b(this);
G.attr({src:G.attr("url"),url:""})
}})
};
E(t.slice(0,C));
if(k.seeded){E(D)
}}function o(){if(!d){e.load(function(){setTimeout(function(){z(true)
})
})
}}function h(){return C
}}b(function(){if(!b(".s9AddToCartHoverMain").length){return
}if("ontouchstart" in window){return
}b('<div id="s9AddToCartHoverContainer" style="position: relative; left: 0px; top: 0px; z-index: 1200"><div style="position: absolute; left: 0px; top: 0px"></div></div>').prependTo(b("body"));
var g=b("#s9AddToCartHoverContainer").children();
var f=null;
b(".s9hl").each(function(){var m=150;
var p=200;
var i=null;
var u=null;
var j=b(".s9AddToCartHoverMain",this);
var k=null;
var v=b(j.parents(".asin").get(0));
var r=v;
var y=b(j.children(".s9AddToCartHoverRight").get(0));
var t=8;
if(!(j&&j.length&&j.length>0)){return
}function x(){var A;
if(v.parent().hasClass("s9ShovelerCell")){A=v.parent().width()-y.width()
}else{A=v.get(0).offsetWidth-y.width()
}if(A<108){A=108
}if(A>950){A=950
}A+=t;
u.css("width",A)
}function h(){function C(){function D(G,F){if(G.widgetLeft!==F.widgetLeft){return false
}if(G.widgetTop!==F.widgetTop){return false
}if(G.containerLeft!==F.containerLeft){return false
}if(G.containerTop!==F.containerTop){return false
}return true
}var E={widgetLeft:Math.floor(v.offset().left),widgetTop:Math.floor(v.offset().top),containerLeft:Math.floor(g.parent().offset().left),containerTop:Math.floor(g.parent().offset().top)};
if(k===null||!D(E,k)){k=E;
return true
}return false
}if(u===null){return
}x();
u.css("height",j.height()+1);
if(C()===false){return
}var B=j.offset();
var A=g.offset();
u.css("left",B.left-A.left);
u.css("top",B.top-A.top)
}function l(){u=j.clone();
u.css({visibility:"visible",zoom:"1",display:"none","background-color":"white"});
h();
u.bind("mouseout",o);
u.bind("mouseover",q)
}function s(){i=setTimeout(function(){i=null;
h();
u.data("shown","false").data("beingShown","false");
u.children().fadeOut(m,function(){u.css("display","none")
})
},p)
}function z(){if(i){clearTimeout(i)
}}function n(){u.data("beingShown","true").data("shown","false");
var A;
if(u.css("display")==="none"){A=m;
u.children().css({opacity:0,display:"block"});
u.css({display:"block"})
}else{A=(1-u.children().css("opacity"))*m
}u.children().stop(true,false).fadeTo(A,1,function(){u.data("shown","true").data("beingShown","false");
g.children().not(f).hide().data("shown","false").data("beingShown","false");
h();
u.children().css("opacity","")
})
}function q(){z();
if(u===null){l();
u.appendTo(g)
}f=u;
w();
h();
if(u.data("beingShown")==="true"){return false
}if(u.data("shown")==="true"){return false
}n();
return false
}function o(){z();
s();
return false
}function w(){v.get(0).onmouseover=q;
v.get(0).onmouseout=o;
if(r===v&&v.parent().hasClass("s9ShovelerCell")){r=v.parent();
r.css("background-color","white");
r.mouseover(function(){b(this).children(".asin").get(0).onmouseover()
});
r.mouseout(function(){b(this).children(".asin").get(0).onmouseout()
})
}}r.css("background-color","white");
w()
})
});
if(window.amznJQ!==undefined){amznJQ.declareAvailable("s9Multipack")
}};
if(window.amznJQ!==undefined){amznJQ.onReady("jQuery",function(){registerMultipack(jQuery)
})
}else{if(window.P!==undefined){P.when("A","ready").register("s9Multipack",function(a){registerMultipack(a.$)
})
}};