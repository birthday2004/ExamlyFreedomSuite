// background.js - Manages core bypass logic and network interception.

// Spoof User-Agent to appear as Linux, preventing OS-specific checks.
const spoofUserAgentRule = {
  id: 1001,
  priority: 1,
  action: {
    type: "modifyHeaders",
    requestHeaders: [
      {
        header: "User-Agent",
        operation: "set",
        value: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
      }
    ]
  },
  condition: {
    urlFilter: "*://*.examly.io/*",
    resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest"]
  }
};

// Block connections to known tracking and proctoring analytics endpoints.
const blockProctoringRule = {
    id: 1002,
    priority: 1,
    action: {
        type: "block"
    },
    condition: {
        urlFilter: "||google-analytics.com|*|*doubleclick.net|*|*proctoring-data.examly.io|*",
        resourceTypes: ["xmlhttprequest", "script", "image", "sub_frame"]
    }
};


// On extension installation, apply the network modification rules.
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1001, 1002], // Clear old rules first
    addRules: [spoofUserAgentRule, blockProctoringRule]
  });
  console.log("Directive 7.0: Network rules for Examly bypass have been engaged.");
});

// Listen for messages from the content script (not used in this version, but ready for expansion).
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "log") {
        console.log("Message from content script:", request.data);
    }
    return true;
});
