import React from 'react';
import { ArtistInfo } from '../types';

export const OFFICIAL_SOCIAL_LINKS: ArtistInfo['socialLinks'] = {
  facebook: 'https://www.facebook.com/profile.php?id=100084323655178',
  snapchat: 'https://www.snapchat.com/add/emmapro257687?share_id=kvedjM2ogAQ&locale=en-GB',
  telegram: 'https://t.me/wakandadeejays',
  instagram: 'https://www.instagram.com/deejayemmap?obrf=MTl1dWdweTFyamQwdw==',
  youtube: 'https://youtube.com/@djemmapro7231?si=t1P6hlNP3Cv1oss8',
  tiktok: '',
};

const LEGACY_PLACEHOLDERS = new Set([
  'https://facebook.com/djemmapro',
  'https://instagram.com/djemmapro',
  'https://youtube.com/@djemmapro',
  'https://tiktok.com/@djemmapro',
]);

export function resolveSocialLinks(
  incoming?: Partial<ArtistInfo['socialLinks']> | null
): ArtistInfo['socialLinks'] {
  const clean = (val: string | undefined, fallback: string) => {
    const trimmed = (val || '').trim();
    if (!trimmed || LEGACY_PLACEHOLDERS.has(trimmed)) return fallback;
    return trimmed;
  };

  const tiktokVal = (incoming?.tiktok || '').trim();

  return {
    facebook: clean(incoming?.facebook, OFFICIAL_SOCIAL_LINKS.facebook),
    instagram: clean(incoming?.instagram, OFFICIAL_SOCIAL_LINKS.instagram),
    youtube: clean(incoming?.youtube, OFFICIAL_SOCIAL_LINKS.youtube),
    snapchat: clean(incoming?.snapchat, OFFICIAL_SOCIAL_LINKS.snapchat || ''),
    telegram: clean(incoming?.telegram, OFFICIAL_SOCIAL_LINKS.telegram || ''),
    tiktok: LEGACY_PLACEHOLDERS.has(tiktokVal) ? '' : tiktokVal,
  };
}

export const SnapchatIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.75c-2.95 0-4.95 2.05-4.95 5.15 0 1.05.2 2.25.25 2.95-.55.15-1.15-.1-1.55.25-.4.35-.25.95.3 1.2.65.3 1.25.45 1.35.95.15.8-1.15 2.45-2.9 3.05-.45.15-.65.65-.35 1 .4.45 1.45.75 2.35.9.25.05.35.55.5.95.15.4.55.5 1.15.4.7-.15 1.5.75 3.85.75s3.15-.9 3.85-.75c.6.1 1 0 1.15-.4.15-.4.25-.9.5-.95.9-.15 1.95-.45 2.35-.9.3-.35.1-.85-.35-1-1.75-.6-3.05-2.25-2.9-3.05.1-.5.7-.65 1.35-.95.55-.25.7-.85.3-1.2-.4-.35-1-.1-1.55-.25.05-.7.25-1.9.25-2.95 0-3.1-2-5.15-4.95-5.15Z" />
  </svg>
);

export const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21.5 3.5 2.75 10.75c-1.25.5-1.24 1.22-.23 1.53l4.8 1.5 11.12-7.01c.52-.32 1-.15.61.2L9.9 15.22l-.35 5.1c.51 0 .74-.23 1.03-.51l2.47-2.4 5.14 3.79c.95.52 1.63.25 1.86-.88L23.4 4.82c.34-1.39-.53-2.02-1.9-1.32Z" />
  </svg>
);
