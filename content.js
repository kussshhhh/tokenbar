function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function createTokenBar() {
  const tokenBar = document.createElement('div');
  tokenBar.id = 'claude-token-bar';
  tokenBar.style.position = 'fixed';
  tokenBar.style.top = '10px';
  tokenBar.style.right = '10px';
  tokenBar.style.zIndex = '9999';
  tokenBar.style.backgroundColor = '#007bff';
  tokenBar.style.color = 'white';
  tokenBar.style.padding = '5px 10px';
  tokenBar.style.borderRadius = '5px';
  tokenBar.style.fontSize = '12px';
  document.body.appendChild(tokenBar);
  return tokenBar;
}

// Variables to store chat data
let currentChatUrl = window.location.href;
let countedMessages = new Set();
let totalWords = 0;

// Update the token bar with the current word count
function updateTokenBar() {
  const tokenBar = document.getElementById('claude-token-bar') || createTokenBar();
  tokenBar.textContent = `${totalWords} Words`;
}

// Load chat data from localStorage
function loadChatData() {
  const storedChatData = JSON.parse(localStorage.getItem(`chatData_${currentChatUrl}`)) || {
    totalWords: 0,
    countedMessages: []
  };
  totalWords = storedChatData.totalWords;
  countedMessages = new Set(storedChatData.countedMessages);
  updateTokenBar();
}

// Save chat data to localStorage
function saveChatData() {
  localStorage.setItem(
    `chatData_${currentChatUrl}`,
    JSON.stringify({
      totalWords,
      countedMessages: Array.from(countedMessages)
    })
  );
}

// Recalculate the word count for new messages
function updateTokenCount() {
  const messageContainers = document.querySelectorAll('[data-testid="user-message"], .font-claude-message');

  messageContainers.forEach(container => {
    const messageId = container.dataset.messageId || container.innerText.slice(0, 50); // Use a unique ID for each message
    if (!countedMessages.has(messageId)) {
      const text = container.innerText;
      totalWords += countWords(text);
      countedMessages.add(messageId);
    }
  });

  saveChatData(); // Save updated data to localStorage
  updateTokenBar(); // Update the token bar
}

// Reset data for a new chat
function resetTokenCount() {
  countedMessages.clear();
  totalWords = 0;
  updateTokenBar();
}

// Handle switching between chats
function handleChatSwitch() {
  const newChatUrl = window.location.href;
  if (newChatUrl !== currentChatUrl) {
    saveChatData(); // Save current chat's data
    currentChatUrl = newChatUrl; // Update to the new chat URL
    resetTokenCount(); // Reset for the new chat
    loadChatData(); // Load data for the new chat
    updateTokenCount(); // Recalculate for any messages already present
  }
}

// Observe changes to the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      updateTokenCount();
    }
  });
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});

// Detect chat switches by monitoring URL changes
setInterval(() => {
  handleChatSwitch(); // Check if the chat URL has changed
}, 500);

// Initialize for the first chat
loadChatData();
updateTokenCount();
