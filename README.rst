=======
Webdext
=======

Webdext is a Javascript library for web data extraction (web scraping). Currently, it only supports data records extraction from a list page (a web page containing 2 or more data records).

In order to use it, you must run Webdext inside the web page context. There are 2 ways to do that:

1. Use it as browser extension (currently, I only implemented the Chrome extension) 
2. Inject the script into the web page context using headless browser such as PhantomJS_ or Splash_ (currently, I only implemented the runner script for PhantomJS)

.. _PhantomJS: http://phantomjs.org/
.. _Splash: http://github.com/scrapinghub/splash

Installation and usage
======================

1. `Chrome Extension`_
2. `PhantomJS script`_

.. _Chrome extension: https://github.com/seagatesoft/webdext/wiki/Chrome-extension
.. _PhantomJS script: https://github.com/seagatesoft/webdext/wiki/PhantomJS-script


Internals
=========

Intelligent extraction algorithm is heavily based on AutoRM [1]_ and DAG-MTM [2]_ (not an exact implementation though).

.. [1] `Shengsheng Shi , Chengfei Liu, Yi Shen, Chunfeng Yuan, Yihua Huang. 2015. AutoRM: An effective approach for automatic Web data record mining. Knowledge-Based Systems, 89, 314–331. doi:10.1016/j.knosys.2015.07.012 <http://dl.acm.org/citation.cfm?id=2840138>`_

.. [2] `Shengsheng Shi , Chengfei Liu, Chunfeng Yuan, Yihua Huang. 2014. Multi-feature and DAG-based multi-tree matching algorithm for automatic web data mining. Proceedings of International Joint Conferences on Web Intelligence and Intelligent Agent Technology, 739–755. doi:10.1109/WI-IAT.2014.24 <http://dl.acm.org/citation.cfm?id=2682781>`_

Author
======

Sigit Dewanto, sigitdewanto11[at]yahoo[dot]co[dot]uk
