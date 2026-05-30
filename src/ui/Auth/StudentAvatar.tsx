const AVATAR_EMOJI: Record<string, string> = {
  panda: '🐼',
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  fox: '🦊',
  bear: '🐻',
};

interface StudentAvatarProps {
  avatarKey: string;
  displayName: string;
  size?: number;
}

export function StudentAvatar({ avatarKey, displayName, size = 48 }: StudentAvatarProps) {
  return (
    <span
      role="img"
      aria-label={displayName}
      style={{ fontSize: size }}
    >
      {AVATAR_EMOJI[avatarKey] ?? '👤'}
    </span>
  );
}
