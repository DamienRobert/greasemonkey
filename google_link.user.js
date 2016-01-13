// ==UserScript==
// @name        Google Direct Link
// @namespace   DamienRobert
// @version     2
// @license     CC BY http://creativecommons.org/licenses/by/3.0/
// @description Change google green cite results to direct links
// @include     http*://www.google.tld/*
// @include     http*://encrypted.google.tld/*
// ==/UserScript==
// Adapted from Jefferson Scher's script:
// http://userscripts-mirror.org/scripts/show/139758
// This script has a lot more features which I don't use, so here is a
// simple script that only turns the green results to direct urls.

var gst_sty = document.createElement("style");
gst_sty.setAttribute("type", "text/css");
gst_sty.appendChild(document.createTextNode("a._myDirectLink{color: #006621 !important;}"))
document.body.appendChild(gst_sty);

// == == == Detect added nodes / attach MutationObserver == == ==
if (document.body){
  // Add click events
  gst_checkNode(document.body);
  // Watch for changes that could be new instant or AJAX search results
  var MutOb, chgMon, i, httpels, opts;
  var MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (MutOb){
    chgMon = new MutOb(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            gst_checkNode(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    opts = {childList: true, subtree: true};
    chgMon.observe(document.body, opts);
  }
}

function gst_checkNode(el){
  if (el.nodeName == "DIV" && el.className=="g") var liels = [el];
  else var liels = el.querySelectorAll('div .g');
  if (liels.length > 0){
    var i, cite, ael;
    for (var i=0; i<liels.length; i++){
      var cite = liels[i].querySelector('cite');
      if (cite){
        if (!cite.querySelector("._myDirectLink")) {
          var linktitle
          if (cite.parentNode.nodeName == "A") {
          // TODO - this is for cites under bunches of news articles; need to exclude Google
          }
          else {
            var ael = liels[i].querySelector("h3 a");
            if (!ael) ael = liels[i].querySelector("a");
            if (ael){
              if(ael.hasAttribute("href")) {
                if (ael.getAttribute("href").indexOf("http")==0 || ael.getAttribute("href").indexOf("/interstitial")==0){
                  linktitle=ael.getAttribute("href").substr(ael.getAttribute("href").indexOf("http"));
                }
                else {
                  linktitle=cite.textContent;
                }
              }
              else {
                linktitle=cite.textContent;
              }
            }
            else {
              linktitle=cite.textContent;
            }
          }
          if (linktitle) {
            var linknew = document.createElement("a");
            linknew.innerHTML = cite.innerHTML;
            linknew.href = linktitle;
            linknew.className="_myDirectLink";
            cite.innerHTML=''
            cite.appendChild(linknew);
          }
        }
      }
    }
  }
}
