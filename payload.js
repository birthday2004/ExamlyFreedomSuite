// payload.js - The core bypass engine. This runs within the page's own context.

console.log("%cEXAMLY FREEDOM SUITE (DIRECTIVE 7.0) IS ACTIVE", "color: red; font-size: 24px; font-weight: bold;");

let bypassEnabled = true;

// --- MASTER OVERRIDE SECTION ---

// 1. Disable Visibility API to prevent tab switch detection
Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false, configurable: true });
Object.defineProperty(document, 'hidden', { value: false, writable: false, configurable: true });
document.dispatchEvent(new Event('visibilitychange'));

// 2. Neutralize event listeners for focus, blur, copy, paste, etc.
const criticalEvents = ['blur', 'focusout', 'visibilitychange', 'copy', 'paste', 'cut', 'contextmenu'];
const originalAddEventListener = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (bypassEnabled && criticalEvents.includes(type)) {
        console.log(`Directive 7.0: Blocked a '${type}' event listener.`);
        return; // Simply refuse to add the listener
    }
    return originalAddEventListener.call(this, type, listener, options);
};

// Also forcefully remove any listeners attached before our script ran
criticalEvents.forEach(eventType => {
    window.addEventListener(eventType, e => {
        if (bypassEnabled) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true); // Use capture phase to intercept early
});

// 3. Bypass Screen Recording / Sharing (getDisplayMedia)
if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getDisplayMedia = async function(constraints) {
        if (bypassEnabled) {
            console.log("Directive 7.0: Blocked screen sharing request (getDisplayMedia).");
            // Throw a NotAllowedError, which is what happens when a user clicks "cancel"
            throw new DOMException("Screen sharing request denied by Freedom Suite.", "NotAllowedError");
        }
        return originalGetDisplayMedia(constraints);
    };
}

// 4. Emulate NeoExamShield to satisfy platform checks
window.NeoExamShield = {
    isInstalled: true,
    version: "99.0.0",
    getSystemInfo: () => Promise.resolve({ os: 'linux', arch: 'x86_64' })
};

// 5. Spoof Proctoring Object
// Find and neutralize any global proctoring objects the site might use
setTimeout(() => {
    if (window.proctor && typeof window.proctor.start === 'function') {
        console.log("Directive 7.0: Neutralizing window.proctor object.");
        window.proctor.start = () => console.log("Proctoring start blocked.");
        window.proctor.stop = () => console.log("Proctoring stop blocked.");
        window.proctor.logEvent = () => {};
    }
}, 1000); // Wait 1 second for the site's scripts to load

// --- KEYBOARD SHORTCUTS & UTILITIES ---

function autoSolveMCQ() {
    console.log("Auto-solving MCQs...");
    // This function requires specific logic for the site's DOM.
    // As a placeholder, it looks for an answer element with a specific (hypothetical) attribute.
    // In a real scenario, you'd analyze the page to see how the correct answer is marked.
    const correctOption = document.querySelector('[data-is-correct="true"], .correct-answer-indicator');
    if (correctOption) {
        correctOption.click();
        console.log("Correct option found and selected.");
    } else {
        console.log("Could not determine the correct MCQ option automatically.");
    }
}

function autoTypeCode(solution) {
    const editor = document.querySelector('.monaco-editor, .CodeMirror, textarea[role="textbox"]');
    if (!editor) {
        console.log("Code editor not found.");
        return;
    }

    // This simulates typing into a standard textarea. For Monaco/CodeMirror, you'd need to interact with their APIs.
    editor.focus();
    let i = 0;
    const interval = setInterval(() => {
        if (i < solution.length) {
            const char = solution[i];
            // Simulate keyboard event for better compatibility
            const keyEvent = new KeyboardEvent('keydown', { 'key': char, 'bubbles': true });
            editor.dispatchEvent(keyEvent);
            editor.value += char;
            i++;
        } else {
            clearInterval(interval);
            console.log("Auto-typing complete.");
        }
    }, 50); // 50ms delay between characters
}

document.addEventListener('keydown', (e) => {
    // Disable/Re-enable: Alt + D / Alt + R
    if (e.altKey && e.key.toLowerCase() === 'd') {
        bypassEnabled = false;
        console.log("%cBYPASS DISABLED", "color: orange; font-size: 18px;");
        alert("Examly Freedom Suite: BYPASS DISABLED. The page will now behave normally.");
    }
    if (e.altKey && e.key.toLowerCase() === 'r') {
        bypassEnabled = true;
        console.log("%cBYPASS RE-ENABLED", "color: red; font-size: 18px;");
        alert("Examly Freedom Suite: BYPASS RE-ENABLED. Refreshing to apply changes.");
        window.location.reload();
    }
    // Auto-solve MCQ: Alt + M
    if (e.altKey && e.key.toLowerCase() === 'm') {
        autoSolveMCQ();
    }
    // Auto-type Code: Alt + T (with a sample solution)
    if (e.altKey && e.key.toLowerCase() === 't') {
        const sampleSolution = `// This is a sample solution auto-typed by the Freedom Suite.
public class Solution {
    public static void main(String[] args) {
        System.out.println("Directive 7.0 executed successfully.");
    }
}`;
        autoTypeCode(sampleSolution);
    }
});
