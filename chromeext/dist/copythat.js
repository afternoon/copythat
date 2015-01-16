(function () {
  var userId;

  var iconOff = 'icons/off38.png',
    iconOn = 'icons/on38.png';

  var editing = false;

  var currentHTML;

  var getActiveTabHTML = function (callback) {
    chrome.tabs.executeScript(
      {code: 'document.documentElement.innerHTML;'},
      function (results) { callback(results[0]); }
    );
  };

  var storeActiveTabHTML = function (callback) {
    getActiveTabHTML(function (html) {
      currentHTML = html;
      callback();
    });
  };

  var toggleContentEditable = function (editable, callback) {
    var contentEditable = editable ? 'true' : 'inherit';
    chrome.tabs.executeScript(
      {code: 'document.documentElement.contentEditable = "' + contentEditable + '";'},
      callback
    );
  };

  var enablePageEditing = function (callback) {
    toggleContentEditable(true, callback);
  };

  var disablePageEditing = function (callback) {
    toggleContentEditable(false, callback);
  };

  var showEditingIcon = function () {
    chrome.pageAction.setIcon({path: iconOn});
  };

  var restoreNormalIcon = function () {
    chrome.pageAction.setIcon({path: iconOff});
  };

  var startEditing = function () {
  console.log('startEditing');
    storeActiveTabHTML(function () {
      console.log('stored active tab HTML');
      enablePageEditing(function () {
        console.log('enabled page editing');
        // showEditingIcon();
        editing = true;
        console.log('started editing');
      });
    });
  };

  var save = function (record, callback) {
    console.log('save', record);
    callback();
  };

  var savePageEdits = function (callback) {
    getActiveTabHTML(function (html) {
      var record = {
        userId: userId,
        oldHTML: currentHTML,
        newHTML: html,
        time: new Date()
      };
      save(record, callback);
    })
  };

  var stopEditing = function () {
    console.log('stopEditing');
    disablePageEditing(function () {
      console.log('disabled page editing');
      savePageEdits(function () {
        console.log('saved page edits');
        // restoreNormalIcon();
        editing = false;
        console.log('finished editing');
      });
    });
  };

  var onPageActionClick = function(tab) {
    if (editing) {
      stopEditing();
    }
    else {
      startEditing();
    }
  };

  var setupPageAction = function () {
    chrome.pageAction.onClicked.addListener(onPageActionClick);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.pageAction.show(tabs[0].id);
    });
    chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
      if (change.status == 'complete') {
        chrome.pageAction.show(tabId);
      }
    });
  }

  var newToken = function() {
    // http://stackoverflow.com/q/23822170/26201
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
  }

  var doWithUserId = function (action) {
    chrome.storage.sync.get('userId', function (data) {
      userId = data.userId;
      if (userId) {
        console.log('found userId', userId);
        action();
      } else {
        userId = newToken();
        console.log('generated userId', userId);
        chrome.storage.sync.set({userId: userId}, function() {
          console.log('saved userId', userId);
          action();
        });
      }
    });
  };

  doWithUserId(setupPageAction);
})();
