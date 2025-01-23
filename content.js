function countWords(text) {
    return text.trim().split(/\s+/).length;
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
  
  function updateTokenCount() {
    const messageContainers = document.querySelectorAll('[data-testid="user-message"], .font-claude-message');
    let totalWords = 0;
  
    messageContainers.forEach(container => {
      const text = container.innerText;
      totalWords += countWords(text);
    });
  
    const tokenBar = document.getElementById('claude-token-bar') || createTokenBar();
    tokenBar.textContent = `${totalWords} Words`;
  }
  
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
  
  updateTokenCount();