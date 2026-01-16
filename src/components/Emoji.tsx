import { useEffect, useRef } from 'react';
import twemoji from 'twemoji';

interface EmojiProps {
  emoji: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
  '2xl': 'w-16 h-16',
  '3xl': 'w-24 h-24',
  '4xl': 'w-32 h-32',
};

export default function Emoji({ emoji, className = '', size = 'md' }: EmojiProps) {
  const emojiRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (emojiRef.current) {
      twemoji.parse(emojiRef.current, {
        folder: 'svg',
        ext: '.svg',
      });
      
      // Apply size to the img that twemoji creates
      const img = emojiRef.current.querySelector('img');
      if (img) {
        img.className = `${sizeMap[size]} inline-block ${className}`;
      }
    }
  }, [emoji, className, size]);

  return (
    <span ref={emojiRef} className="inline-flex items-center justify-center">
      {emoji}
    </span>
  );
}
