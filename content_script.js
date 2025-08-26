// content_script.js - Injects the main payload into the page's context.

function injectScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('payload.js');
  script.type = 'module'; // Use module for better scope control
  (document.head || document.documentElement).appendChild(script);
  console.log("Directive 7.0: Payload injection initiated.");
  script.onload = () => {
    script.remove();
  };
}

injectScript();
