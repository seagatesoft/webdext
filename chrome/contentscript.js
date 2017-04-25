var s = document.createElement('script');
s.src = chrome.extension.getURL('webdext.js');
(document.head||document.documentElement).appendChild(s);
