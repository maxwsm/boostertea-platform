import { useState, useCallback } from 'react';
import { pushGTMEvent } from '../../lib/blog/types';

interface ShareButtonsProps {
  articleSlug: string;
  title: string;
  url: string;
  className?: string;
}

export function ShareButtons({ articleSlug, title, url, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback((platform: string) => {
    pushGTMEvent({
      event: 'blog_share',
      article_slug: articleSlug,
      platform
    });

    let shareUrl = '';
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'viber':
        shareUrl = `viber://forward?text=${encodedTitle} ${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    if (platform === 'viber' && typeof window !== 'undefined') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  }, [articleSlug, title, url]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      pushGTMEvent({
        event: 'blog_share',
        article_slug: articleSlug,
        platform: 'copy'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [articleSlug, url]);

  const buttons = [
    { 
      platform: 'telegram', 
      label: 'Telegram',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      bgColor: '#0088cc',
      hoverColor: '#0099dd'
    },
    { 
      platform: 'facebook', 
      label: 'Facebook',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      bgColor: '#1877F2',
      hoverColor: '#2d88ff'
    },
    { 
      platform: 'twitter', 
      label: 'X / Twitter',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      bgColor: '#000000',
      hoverColor: '#333333'
    },
    { 
      platform: 'viber', 
      label: 'Viber',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.025 0C5.388 0 .002 5.443.002 12.16c0 2.133.552 4.206 1.6 6.024L.092 23.37c-.067.334.214.615.548.548l5.186-1.51a11.96 11.96 0 006.2 1.717c6.637 0 12.023-5.443 12.023-12.16C24.049 5.443 18.663 0 12.025 0zm6.153 16.751c-.274.775-1.372 1.43-1.916 1.503-.544.076-1.067.253-3.593-.762-3.043-1.197-4.99-4.337-5.143-4.539-.153-.202-1.226-1.632-1.226-3.114 0-1.483.772-2.206 1.045-2.51.274-.303.603-.378.803-.378.2 0 .4.002.574.012.183.01.427-.07.669.513.242.582.825 2.011.899 2.158.074.147.122.319.024.515-.098.196-.147.318-.293.487-.147.169-.306.354-.437.476-.147.137-.301.286-.133.566.168.279.747 1.23 1.604 1.99 1.102.975 2.032 1.278 2.319 1.418.287.14.454.117.622-.07.169-.188.712-.826.9-1.107.187-.281.375-.235.627-.141.253.094 1.617.763 1.893.901.275.138.458.208.526.325.068.117.05.677-.224 1.452z"/>
        </svg>
      ),
      bgColor: '#7360F2',
      hoverColor: '#8472ff'
    }
  ];

  return (
    <div className={className}>
      <p className="text-[#E8DDD0] font-semibold mb-3">Поділитися:</p>
      <div className="flex flex-wrap gap-2">
        {buttons.map(({ platform, label, icon, bgColor, hoverColor }) => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: bgColor }}
            title={label}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
        
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border
            ${copied 
              ? 'bg-green-500/20 text-green-400 border-green-500/50' 
              : 'bg-[#1A1410] text-[#E8DDD0] border-[#3A2E22] hover:border-[#C4956A]/50'
            }
          `}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Скопійовано!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Копіювати
            </>
          )}
        </button>
      </div>
    </div>
  );
}
