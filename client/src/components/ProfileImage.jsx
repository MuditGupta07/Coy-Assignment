import { useEffect, useState } from 'react';

const fallbackAvatar = (name) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffd6ba,cfe8ff,ffe14d`;

/** <img> that swaps to a generated initials avatar if the photo fails to load. */
export default function ProfileImage({ src, name, className }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      src={failed ? fallbackAvatar(name) : src}
      alt={name}
      draggable={false}
      onError={() => setFailed(true)}
      className={`bg-peach ${className ?? ''}`}
    />
  );
}
