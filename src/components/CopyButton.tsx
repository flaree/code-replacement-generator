import React, { useState } from 'react';
import { copyToClipboard } from '../utils/helpers';
import toast from 'react-hot-toast';
import './CopyButton.css';

interface CopyButtonProps {
  text: string;
  label?: string;
  successMessage?: string;
  className?: string;
}

export default function CopyButton({ 
  text, 
  label = 'Copy', 
  successMessage,
  className = '' 
}: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopied(true);
      const lines = text.split('\n').length;
      const message = successMessage || `Copied ${lines} lines to clipboard!`;
      toast.success(message);
      
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-button ${copied ? 'copy-button-success' : ''} ${className}`}
      disabled={!text || text.length === 0}
      aria-label={copied ? 'Copied!' : label}
    >
      {copied ? (
        <>
          <svg className="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
