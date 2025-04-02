/*
 * heatmapcollector.js 1.0 -    JavaScript Heatmap Collector
 *
 * Copyright (c) 2013, Vageesh Dwivedi
 * Licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
(function(a,c){window.HeatMapCollector=(function(){var b;this.init=function(e){b=e;a.addEventListener?a.addEventListener("click",d,!1):a.document.attachEvent&&a.document.attachEvent("onclick",d)};var d=function(l){var j,e,f,k=c.documentElement;if(l.pageX&&l.pageY){j=l.pageX,e=l.pageY}else{if(l.clientX!==null&&c.body!==i){e=c.body,j=l.clientX+(k.scrollLeft||e.scrollLeft||0)-(k.clientLeft||e.clientLeft||0),e=l.clientY+(k.scrollTop||e.scrollTop||0)-(k.clientTop||e.clientTop||0)}}if(j&&e){if(a.innerWidth){f=a.innerWidth}else{if(k.clientWidth!=0){f=k.clientWidth}else{if(c.body!==i){f=c.body.clientWidth}}}if(b){b({x:j,y:e,r:f})}else{return}}};return{init:init}})()})(window,document);
