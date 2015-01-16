var iconOff = "icons/off48.png",
  iconOn = "icons/on48.png";

var token;

var editing = false;

var currentHTML;

var storeCurrentHTML = function () {
  currentHTML = "TODO";
};

var toggleContentEditable = function (editable) {
  var contentEditable = editable ? "true" : "inherit";
  chrome.tabs.executeScript({
    code: 'document.documentElement.contentEditable = "' + contentEditable + '";'
  });
};

var enablePageEditing = function () { toggleContentEditable(true); };
var disablePageEditing = function () { toggleContentEditable(false); };

var showEditingIcon = function () {
  chrome.pageAction.setIcon({path: iconOn});
};
var restoreNormalIcon = function () {
  chrome.pageAction.setIcon({path: iconOff});
};

var startEditing = function () {
  storeCurrentHTML();
  enablePageEditing();
  showEditingIcon();
  editing = true;
};

var savePageEdits = function () {
  // save record: (user ID, old HTML, new HTML, datetime)
};

var stopEditing = function () {
  disablePageEditing();
  restoreNormalIcon();
  savePageEdits();
  editing = false;
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
    if (change.status == "complete") {
      chrome.pageAction.show(tabId);
    }
  });
}

chrome.identity.getAuthToken({interactive: true}, function (newToken) {
  console.log('copythat oauth token', newToken);
  token = newToken;
  setupPageAction();
});
