import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';
import ProfileImage from './ProfileImage.jsx';

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 500;

const variants = {
  enter: { scale: 0.96, opacity: 0 },
  center: { scale: 1, opacity: 1, transition: { duration: 0.18 } },
  exit: (direction) => ({
    x: direction === 'like' ? 520 : -520,
    opacity: 0,
    transition: { duration: 0.28, ease: 'easeIn' },
  }),
};

function CardFace({ profile }) {
  return (
    <div className="nb-card flex h-full flex-col overflow-hidden">
      <div className="relative min-h-0 flex-1">
        <ProfileImage
          src={profile.photo_url}
          name={profile.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="shrink-0 border-t-2 border-ink bg-white p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="truncate text-2xl">{profile.name}</h2>
          <span className="text-xl font-extrabold">{profile.age}</span>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-slate">
          <MapPin size={14} strokeWidth={2.5} aria-hidden="true" />
          {profile.location}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-snug">{profile.bio}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {profile.interests.map((interest) => (
            <li
              key={interest}
              className="rounded-full border-2 border-ink bg-sky px-2.5 py-0.5 text-xs font-bold"
            >
              {interest}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Draggable top card. `direction` is the AnimatePresence `custom` value, so the
 * exit animation matches the swipe even after this component has been removed.
 */
export default function SwipeCard({ profile, direction, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -20], [1, 0]);

  const handleDragEnd = (_event, info) => {
    if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onSwipe('like');
    else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onSwipe('pass');
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ x, rotate }}
      variants={variants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
    >
      <CardFace profile={profile} />

      <motion.span
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-5 top-6 -rotate-12 rounded-xl border-[3px] border-ink bg-green px-3 py-1 text-3xl font-extrabold tracking-tight shadow-nb"
      >
        LIKE
      </motion.span>
      <motion.span
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-5 top-6 rotate-12 rounded-xl border-[3px] border-ink bg-pink px-3 py-1 text-3xl font-extrabold tracking-tight text-white shadow-nb"
      >
        PASS
      </motion.span>
    </motion.div>
  );
}
