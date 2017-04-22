window.S9Shoveler=true;
var registerShoveller=function(b){if(window.S9JQ!==undefined){b=window.S9JQ
}else{window.S9JQ=b
}b.fn.s9Shoveler=function(d){var c={translations:{next:"next",back:"back",of:"of",pageNOfM:"Page %1$s of %2$s"},minItems:3,maxShovelerItems:20,seeded:false,cellChangeSpeedInMs:30,bookendButtonTop:35,logClicks:false,logSlotName:"",fadeShovelerControls:false,emulateOldShoveler:true,onPageChanged:null,onItemsPerPageChanged:null};
d=b.extend({},c,d);
d.suppressInitialResize=true;
var e=this;
if(window.amznJQ!==undefined){amznJQ.onReady("s9Multipack",function(){e.s9Multipack(d);
e.each(function(){new a(b(this),d)
})
})
}else{P.when("s9Multipack","ready").execute(function(f){e.s9Multipack(d);
e.each(function(){new a(b(this),d)
})
})
}return this
};
function a(g,x){this.options=x;
this.next=f;
this.back=z;
this.goToPage=p;
var q=false;
var o=1;
var N=-1;
var B=b.browser.msie;
var t=g.data("s9Multipack");
if(!t){throw ("No multipack found on "+g[0].id)
}var w=g.hasClass("aui-showgrid");
var G=1;
var D=t.getColumnCount();
var s=0;
if(x.emulateOldShoveler&&x.fadeShovelerControls){x.fadeShovelerControls=false
}var i=b(".s9OtherItems",g);
var I=g.parent(".unified_widget");
I.addClass("s9Shoveler");
if(x.emulateOldShoveler){I.addClass("s9BookendShoveler")
}if(x.seeded){var j=b(".s9SeedItem",g);
var d=b(".s9_header.other_header, .s9_header_o.other_header_o",i)
}var Q=b(".asin",i);
var R=[];
var J=b('<div class="s9ShovelerCellCache" style="display: none" />');
O();
var l=i.parents(".unified_widget, .widget").children("h2");
var k;
var n,v,C,e,A,T,U,H;
y();
if(x.fadeShovelerControls){m()
}g.bind("s9MultipackColumnCountChanged",u);
g.trigger("s9MultipackResize",true);
g.data("s9Shoveler",this);
q=true;
function f(W){if(W){W.preventDefault()
}if(G!=s){p(G+1,o,M)
}else{p(1,o,M)
}r(o)
}function z(W){if(W){W.preventDefault()
}if(G!=1){p(G-1,N,M)
}else{p(s,N,M)
}r(N)
}function p(ac,ab,Y){var X=G;
var W=function(){if(Y){setTimeout(function(){Y()
})
}if(x.onPageChanged){setTimeout(function(){x.onPageChanged(X,ac,!!ab)
})
}};
var ad=(ac-1)*D;
if(ab){var Z=function(ae){if(ab==o){return(R.length-ae-1)*x.cellChangeSpeedInMs
}else{return ae*x.cellChangeSpeedInMs
}};
var aa=R.length;
R.each(function(ae){var af=b(this);
setTimeout(function(){c(af,ad,ae);
--aa;
if(!aa){W()
}},Z(ae))
})
}else{R.each(function(ae){c(b(this),ad,ae)
});
W()
}G=ac;
E();
A.text(G)
}function c(Y,Z,W){var X=Q.get(Z+W);
J.append(Y.children());
if(X){Y.css("height","");
Y.append(X)
}else{Y.css("height","1em")
}}function u(W,X){D=Math.max(x.minItems,Math.min(x.maxShovelerItems,X.potentialCols));
V();
p(Math.min(G,s));
h();
setTimeout(function(){M(true)
})
}function V(){var ab=100/D;
var Y=100/(D+1);
var Z=100;
if(!w){if(x.seeded){j.css("width",Y+"%");
Z=100-Y;
i.css("width",Z+"%")
}}s=Math.ceil(x.maxShovelerItems/D);
var X=D-R.length;
if(X>0){for(var aa=0;
aa<X;
aa++){i.append('<div class="s9ShovelerCell"/>')
}}else{if(X<0){var W=R.slice(R.length+X,R.length);
J.append(W.children());
W.remove()
}}R=i.children(".s9ShovelerCell");
R.css({width:ab+"%","float":"left",overflow:"hidden"});
if(B){R.css("margin-right","").filter(":last").css("margin-right","-"+(D)+"px");
if(x.seeded){i.css("margin-right","-6px")
}}E()
}function M(X){var ac=0;
var ab=R.length;
for(var aa=0;
aa<ab;
aa++){var W=R[aa];
var Y=W.offsetHeight;
if(Y>ac){ac=Y
}}var Z=0;
if(x.seeded){Z=d[0].offsetHeight+L(d.css("margin-bottom"),0)
}if(ac&&X===true||ac>L(i.css("height"),0)-Z){i.css("height",(ac+Z)+"px")
}}function h(){if(s>1){T.text(s);
H.css("visibility","visible");
S(true)
}else{T.text(s);
H.css("visibility","hidden");
S(false)
}}function y(){if(!x.emulateOldShoveler){var W=l.children(".s9ShovelerPaging");
if(!W.length){F();
n=b('<div class="s9ShovelerNext"></div>');
v=b('<a title="'+x.translations.next+'" href="#" class="s9ShovelerNextLink"><span>'+x.translations.next+"</span></a>");
C=b('<div class="s9ShovelerBack"></div>');
e=b('<a title="'+x.translations.back+'" href="#" class="s9ShovelerBackLink"><span>'+x.translations.back+"</span></a>");
H=b('<div class="s9ShovelerPaging"/>').append(e).append(C).append(U).append(n).append(v);
l.html('<span class="s9ShovelerHeaderText">'+l.html()+"</span>");
l.addClass("s9ShovelerHeader s9ShovelerButtonHeader").prepend(H);
K(v,n);
K(e,C)
}else{n=W.find(".s9ShovelerNext");
v=W.find(".s9ShovelerNextLink");
C=W.find(".s9ShovelerBack");
e=W.find(".s9ShovelerBackLink");
A=W.find(".s9ShovelerCurrent");
T=W.find(".s9ShovelerTotal");
U=W.find(".s9ShovelerPage");
H=W.find(".s9ShovelerPaging")
}}else{i.wrap("<div/>");
k=i.parent();
k.css({position:"relative",zoom:"1.0"});
S(true);
F("s9ShovelerBookendPage");
l.html('<span class="s9ShovelerHeaderText">'+l.text()+"</span>");
l.addClass("s9ShovelerHeader").prepend(U);
v=b('<a style="top: '+x.bookendButtonTop+'px" title="'+x.translations.next+'" href="#" class="s9ShovelerNextBookendButton"><span>'+x.translations.next+"</span></a>");
n=v;
e=b('<a style="top: '+x.bookendButtonTop+'px" title="'+x.translations.back+'" href="#" class="s9ShovelerBackBookendButton"><span>'+x.translations.back+"</span></a>");
C=e;
k.prepend(n).prepend(C);
H=b([n[0],C[0],U[0]]);
K(v,n);
K(e,C)
}v.click(f);
e.click(z)
}function K(aa,ad){var Z=ad.attr("class").split(" ");
var ab=[];
var Y=[];
for(var ac=0;
ac<Z.length;
ac++){ab.push(Z[ac]+"Hover");
Y.push(Z[ac]+"Active")
}var X=ab.join(" ");
var W=Y.join(" ");
aa.hover(function(){ad.addClass(X)
},function(){ad.removeClass(X)
});
aa.mousedown(function(){ad.addClass(W)
});
aa.mouseup(function(){ad.removeClass(W)
})
}function m(){H.hide();
var W=g.parents(".unified_widget");
if(B){W.css({background:"white",zoom:"1"})
}W.hover(function(){H.stop(true,true);
H.fadeIn()
},function(){H.fadeOut()
})
}function S(X){if(k){var W=X?30:0;
k.css("padding","0 "+W+"px");
t.options.containerHorizontalPadding=W;
if(q){g.trigger("s9MultipackResize")
}}}function F(W){A=b('<span class="s9ShovelerCurrent"/>').text("1");
T=b('<span class="s9ShovelerTotal"/>');
U=b('<span class="s9ShovelerPage'+(W?" "+W:"")+'"/>');
if(!x.emulateOldShoveler){U.append(A).append(" "+x.translations.of+" ").append(T)
}else{var Y=x.translations.pageNOfM;
var X=Y.match(/(.*)%(\d)\$s(.*)%(\d)\$s(.*)/);
if(!X){throw"S9 Shoveler translation substitution failed"
}U.append(X[1]);
U.append(X[2]=="1"?A:T);
U.append(X[3]);
U.append(X[4]=="1"?A:T);
U.append(X[5])
}}function O(){J.append(Q);
Q.each(function(){this.className=this.className.replace(/ s9a(\d+)/,"")
});
Q.find(".imageContainer img").each(function(){var X=b(this);
var W=X.attr("style");
if(W){var Y=W.match(/background-image\s*:\s*url\(\s*["']?([^'";)]+)["']?\)/i);
if(Y&&Y[1]){X.attr("url",Y[1]);
X.css("background-image","none")
}}});
Q.css({display:"block",width:"100%",overflow:"visible"});
I.append(J)
}function E(){var W=function(Y){Y.find("img").each(function(){if(this.getAttribute("url")){var Z=b(this);
Z.attr({src:Z.attr("url"),url:""})
}})
};
var X=(G-1)*D;
W(Q.slice(X,X+D))
}function r(W){if(x.logClicks&&window.clientLogger){setTimeout(function(){clientLogger.sendCLOGEntry("s9","shov2",{direction:(W==o?"next":"back"),slot:x.logSlotName})
})
}}function L(X,W){if(!X||X=="auto"){return W
}return parseInt(X,10)
}}if(window.amznJQ!==undefined){amznJQ.declareAvailable("s9Shoveler")
}};
if(window.amznJQ!==undefined){amznJQ.onReady("jQuery",function(){registerShoveller(jQuery)
})
}else{if(window.P!==undefined){P.when("A","ready").register("s9Shoveler",function(a){registerShoveller(a.$)
})
}};