// Utility functions for showing notifications

export const showSuccessNotification = (message, description = "") => {
  // Remove any existing notifications first
  const existingNotification = document.getElementById(
    "cart-success-notification"
  );
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create and show global notification
  const notification = document.createElement("div");
  notification.id = "cart-success-notification";

  // Set initial styles
  notification.style.cssText = `
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 9999;
    background: linear-gradient(to right, #10b981, #059669);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 400px;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.4s ease-out;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const descriptionHtml = description
    ? `<p style="font-size: 14px; opacity: 0.95; margin: 4px 0 0 0;">${description}</p>`
    : "";

  notification.innerHTML = `
    <div style="flex-shrink: 0;">
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
    </div>
    <div style="flex: 1;">
      <p style="font-weight: bold; font-size: 16px; margin: 0;">${message}</p>
      ${descriptionHtml}
    </div>
    <button onclick="this.parentElement.remove()" style="flex-shrink: 0; margin-right: 8px; background: none; border: none; color: white; cursor: pointer; padding: 4px; border-radius: 4px; transition: opacity 0.2s;">
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
      </svg>
    </button>
  `;

  // Add notification to the page
  document.body.appendChild(notification);

  // Animate in after a small delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
      notification.style.opacity = "1";
    }, 50);
  });

  // Remove notification after 4 seconds
  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.style.transform = "translateX(100%)";
      notification.style.opacity = "0";

      // Remove from DOM after animation completes
      setTimeout(() => {
        if (notification && notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 400);
    }
  }, 4000);
};

export const showErrorNotification = (message, description = "") => {
  // Remove any existing notifications first
  const existingNotification = document.getElementById(
    "cart-error-notification"
  );
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create and show global notification
  const notification = document.createElement("div");
  notification.id = "cart-error-notification";

  // Set initial styles
  notification.style.cssText = `
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 9999;
    background: linear-gradient(to right, #ef4444, #dc2626);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 400px;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.4s ease-out;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  const descriptionHtml = description
    ? `<p style="font-size: 14px; opacity: 0.95; margin: 4px 0 0 0;">${description}</p>`
    : "";

  notification.innerHTML = `
    <div style="flex-shrink: 0;">
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
      </svg>
    </div>
    <div style="flex: 1;">
      <p style="font-weight: bold; font-size: 16px; margin: 0;">${message}</p>
      ${descriptionHtml}
    </div>
    <button onclick="this.parentElement.remove()" style="flex-shrink: 0; margin-right: 8px; background: none; border: none; color: white; cursor: pointer; padding: 4px; border-radius: 4px; transition: opacity 0.2s;">
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
      </svg>
    </button>
  `;

  // Add notification to the page
  document.body.appendChild(notification);

  // Animate in after a small delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
      notification.style.opacity = "1";
    }, 50);
  });

  // Remove notification after 4 seconds
  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.style.transform = "translateX(100%)";
      notification.style.opacity = "0";

      // Remove from DOM after animation completes
      setTimeout(() => {
        if (notification && notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 400);
    }
  }, 4000);
};
