import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../utils/helpers';

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
  className = 'btn',
}: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (await copyToClipboard(text)) {
      setCopied(true);
      const lines = text.split('\n').filter((line) => line.includes('\t')).length;
      toast.success(successMessage ?? `${lines} codes copied. Paste into Photo Mechanic.`);
    } else {
      toast.error('Your browser blocked the clipboard. Use Download .txt instead.');
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleCopy}
      disabled={!text}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {copied ? (
          <polyline points="20 6 9 17 4 12" />
        ) : (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      {copied ? 'Copied' : label}
    </button>
  );
}
