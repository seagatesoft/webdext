=======
Webdext
=======

Webdext is a Javascript library for web data extraction (web scraping). Currently, it only supports data records extraction from a list page (a web page containing 2 or more data records).

In order to use it, you must run Webdext inside the web page context. There are 2 ways to do that. First, you could use it as browser extension (currently, I only implemented the Chrome extension). Second, you could inject the script to the web page using headless browser such as `PhantomJS`_ or `Splash`_.

.. _PhantomJS: http://phantomjs.org/
.. _Splash: http://github.com/scrapinghub/splash

Installation
============

    Chrome Extension
        Getting extension files
            Download
            http://seagatesoft.com/download/webdext-chrome.tar.gz
            Build your own
                1. Install Node.js and NPM.
                2. clone repository
                3. npm install
                4. gulp build-chrome
        Install the extension
            1. Open chrome://extensions/ on your Chrome/Chromium.
            2. Check "Developer mode" checkbox.
            3. Click "Load unpacked extension" button.
            4. Browse to the directory where extension files saved and click "Open".
    PhantomJS

Usage
=====

    Chrome Extension
        1. Intelligent extraction
            1. Open a web page containing list of data records.
            2. Click Webdext icon on the toolbar.
            3. Click  "Intelligent Extract" button, wait for a few seconds.
            4. Extracted data records will be displayed in a new tab.
            5. Intelligent extraction can find more than 1 data region, you could browse it to get your data region of interest.
            6. You can give label to the column and remove unnecessary column.
            7. You can export the data to CSV/JSON format by clicking "Export Data" button.
            8. You can create an XPath wrapper (Webdext will learn the XPath wrapper based on currently displayed data region) and store it for the next usage. You could do it by clicking "Save Extractor" button and then type the name of your extractor. Note that you must keep the original web page tab open to create the wrapper. Extraction using XPath wrapper is faster than extraction using Intelligent Extraction.
        2. Extraction using available extractor (wrapper)
            1. Open a web page containing list of data records and using template that can be processed by an existing extractor (wrapper).
            2. Click Webdext icon on the toolbar.
            3. Click  "Use Existing Extractor" button.
            4. Click "Extract" button below your extractor (wrapper) of choice.
            5. Extracted data records will be displayed in a new tab.
            6. You can export the data to CSV/JSON format by clicking "Export Data" button.
        3. Extractors (wrappers) management
            1. Click Webdext icon on the toolbar.
            2. Click  "List of Existing Extractors" button.
            3. List of existing extractors will be displayed on a new tab.
            4. You can view the internal details of an extractor by clicking "Show" button.
            5. You can also delete an extractor and also create a new one manually.
    PhantomJS

Internals
==========

    Intelligent extraction algorithm implemented in Webdext is heavily based on AutoRM[1]_ and DAG-MTM[2]_ (though not an exact implementation). XPath wrapper induction algorithm is based on Nielandt et al. (2016) [3]_.
    
    Shi, S., Liu, C., Shen, Y., Yuan, C., Huang, Y., 2015. AutoRM: An effective approach for automatic Web data record mining. Knowl.-Based Syst. 89, 314–331. doi:10.1016/j.knosys.2015.07.012
    Shi, S., Liu, C., Yuan, C., Huang, Y., 2014. Multi-feature and DAG-based multi-tree matching algorithm for automatic web data mining. Proc. - 2014 IEEEWICACM Int. Jt. Conf. Web Intell. Intell. Agent Technol. Workshop WI-IAT 2014 1, 739–755. doi:10.1109/WI-IAT.2014.24
    Nielandt, J., Bronselaer, A., Tr, G.D., 2016. Predicate enrichment of aligned XPaths for wrapper induction 51, 259–275. doi:10.1016/j.eswa.2015.12.040

Author
======

    Sigit Dewanto (sigitdewanto11[at]yahoo[dot]co[dot]uk)
