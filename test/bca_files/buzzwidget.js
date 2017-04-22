/**
 * Created by felix on 8/10/16.
 */
const WIDGET_URL = 'https://halo.bca.co.id/buzz-widget/';

(function docReadyChecker(funcName, baseObj) {
  const funcNameValue = funcName || 'docReady';
  const baseObjValue = baseObj || window;
  var readyList = [];
  var readyFired = false;
  var readyEventHandlersInstalled = false;

  function ready() {
    if (!readyFired) {
      readyFired = true;
      for (var i = 0; i < readyList.length; i++) {
        readyList[i].fn.call(window, readyList[i].ctx);
      }
      readyList = [];
    }
  }

  function readyStateChange() {
    if (document.readyState === 'complete') {
      ready();
    }
  }

  baseObjValue[funcNameValue] = function runDocReadyCallback(callback, context) {
    if (readyFired) {
      setTimeout(function () { callback(context); }, 1);
      return;
    }
    readyList.push({ fn: callback, ctx: context });
    if (document.readyState === 'complete') {
      setTimeout(ready, 1);
    } else if (!readyEventHandlersInstalled) {
      if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', ready, false);
        window.addEventListener('load', ready, false);
      } else {
        document.attachEvent('onreadystatechange', readyStateChange);
        window.attachEvent('onload', ready);
      }
      readyEventHandlersInstalled = true;
    }
  }
}('docReady', window));

function listener(event) {
  if (WIDGET_URL.indexOf(event.origin) !== -1) {
    const buzz = document.getElementById('buzz');
    if (buzz.clientHeight === 40 || event.data) {
      buzz.style.height = '490px';
    } else {
      const buzzFrame = document.getElementById('buzz-frame');
      buzz.style.height = '40px';
      buzzFrame.blur();
    }
  }
}

if (window.addEventListener) {
  addEventListener('message', listener, false)
} else {
  attachEvent('onmessage', listener)
}

function embedBuzz() {
  const scriptName = document.getElementById('buzz-script');
  const lang = scriptName.getAttribute('data-language') === 'en' ? 'en' : '';
  const buzz = document.getElementById('buzz');
  const iframe = document.createElement('IFRAME');
  iframe.id = 'buzz-frame';
  iframe.src = WIDGET_URL + '#/' + lang;
  iframe.style.backgroundColor = 'transparent';
  iframe.style.border = 'none';
  iframe.style.verticalAlign = 'text-bottom';
  iframe.style.position = 'relative';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.margin = '0px';
  iframe.style.display = 'block';
  buzz.appendChild(iframe);

  const buzzButton = document.getElementById('buzz-button');
  const button = document.createElement('BUTTON');
  button.onclick = function redirect() { window.location = WIDGET_URL + '#/' + lang; };
  button.href = WIDGET_URL + '#/' + lang;
  buzzButton.appendChild(button);

  buzz.style.marginTop = '0px';
  buzz.style.marginRight = '0px';
  buzz.style.marginBottom = '0px';
  buzz.style.padding = '0px';
  buzz.style.border = '0px';
  buzz.style.backgroundColor = 'transparent';
  buzz.style.position = 'fixed';
  buzz.style.zIndex = '999';
  buzz.style.borderTopLeftRadius = '3px';
  buzz.style.borderTopRightRadius = '3px';
  buzz.style.display = 'block';
  buzz.style.width = '350px';
  buzz.style.height = '40px';
  buzz.style.right = '65px';
  buzz.style.bottom = '0px';
  buzz.style.overflow = 'hidden';
  document.querySelector('style').textContent += '@media screen and (max-width:1024px) { .buzz { display: none !important; } } .buzz-button { display: none; }';
  document.querySelector('style').textContent += '@media screen and (max-width:1024px) ' +
    '{ .buzz-button { width: 33px; height: 33px; background-color: transparent; top: 15px; right: 75px; position: fixed; display:block; z-index: 999; } }';
  document.querySelector('style').textContent += '@media screen and (max-width:1024px) ' +
    "{ .buzz-button button { background-image: url('" + WIDGET_URL + "images/halobca-orange-hd.png'); background-size: 33px 33px; background-repeat: no-repeat; background-position: center; " +
    'width: 100%; height: 100%; border: none; background-color: transparent; } }';
}

docReady(embedBuzz);
