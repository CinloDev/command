/**
 * utils.js
 * Common utility functions for UI feedback and clipboard interactions.
 */

/**
 * Shows a temporary toast message.
 */
export const showToast = (message, iconType = 'check') => {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  const iconName = iconType === 'copy' ? 'clipboard-check' : 'check-circle';
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  
  if (window.lucide) window.lucide.createIcons();
  
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

/**
 * Copies text to clipboard and provides feedback.
 */
export const copyToClipboard = (text, btn, successMsg = 'Copied!') => {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg, 'copy');
    if (btn) {
      btn.classList.add('copied');
      setTimeout(() => {
        btn.classList.remove('copied');
      }, 2000);
    }
  });
};

/**
 * Auto-resizes a textarea based on its content.
 */
export const autoResizeTextarea = (textarea) => {
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
};

/**
 * Converts Hex color to RGB string.
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
};

/**
 * Shows a custom confirmation modal.
 */
export const showConfirm = (title, message, callback, translations, lang) => {
  const modalOverlay = document.getElementById('custom-modal-overlay');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalTitle = document.getElementById('txt-modal-title');
  const modalMessage = document.getElementById('txt-modal-message');

  const t = translations[lang] || translations.en;
  if (modalTitle) modalTitle.textContent = title || t.modalConfirmTitle;
  if (modalMessage) modalMessage.textContent = message || t.modalConfirmDelete;
  if (modalConfirmBtn) modalConfirmBtn.textContent = t.btnConfirm;
  if (modalCancelBtn) modalCancelBtn.textContent = t.btnCancel;

  if (modalOverlay) modalOverlay.classList.add('active');
  
  modalConfirmBtn.onclick = () => {
    if (callback) callback();
    modalOverlay.classList.remove('active');
  };
  modalCancelBtn.onclick = () => modalOverlay.classList.remove('active');
};
