import React, { useEffect, useState } from 'react';

interface ProtectionOverlayProps {
  children?: React.ReactNode;
}

export const ProtectionOverlay: React.FC<ProtectionOverlayProps> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showSecurityNotice = (message: string) => {
    setToastMessage(message);
    // Vibrate device if supported
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    // 1. Block Context Menu (Inspect, Save Video)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showSecurityNotice('Context menu is disabled for course protection.');
    };

    // 2. Intercept PrintScreen and Security Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        // Clear clipboard
        navigator.clipboard.writeText('Security Alert: Screenshot restricted.').catch(() => {});
        showSecurityNotice('PrintScreen key input blocked.');
        return;
      }

      // F12 or Ctrl+Shift+I (DevTools)
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U') || // View Source
        (e.metaKey && e.altKey && e.key === 'i') // Mac Inspect
      ) {
        e.preventDefault();
        showSecurityNotice('Developer Console tools are disabled on this portal.');
        return;
      }

      // Ctrl+P / Cmd+P (Print Page)
      if ((e.ctrlKey && e.key === 'p') || (e.metaKey && e.key === 'p')) {
        e.preventDefault();
        showSecurityNotice('Printing this learning page is prohibited.');
        return;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey && e.key === 's') || (e.metaKey && e.key === 's')) {
        e.preventDefault();
        showSecurityNotice('Saving this learning page is prohibited.');
        return;
      }

      // Ctrl+C (Block copying text/links)
      if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
        e.preventDefault();
        showSecurityNotice('Copying text/resources is prohibited.');
        return;
      }
    };

    // 3. Clear Clipboard on copy event
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showSecurityNotice('Copy action blocked.');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  return (
    <>
      {children}
      {toastMessage && (
        <div className="security-toast screenshot-protected">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          {toastMessage}
        </div>
      )}
    </>
  );
};
