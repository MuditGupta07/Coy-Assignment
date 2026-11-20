export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Explicit allow-list: liked_current_user is internal and must never be selected for responses.
const PUBLIC_COLUMNS = 'p.id, p.name, p.age, p.photo_url, p.bio, p.location, p.interests';

function toPublicProfile(row) {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    photo_url: row.photo_url,
    bio: row.bio,
    location: row.location,
    interests: JSON.parse(row.interests),
  };
}

export function createDiscoverService(db) {
  const selectFeed = db.prepare(`
    SELECT ${PUBLIC_COLUMNS}
    FROM profiles p
    WHERE NOT EXISTS (SELECT 1 FROM swipes s WHERE s.target_profile_id = p.id)
    ORDER BY p.id ASC
  `);

  const selectProfile = db.prepare(`
    SELECT ${PUBLIC_COLUMNS}, p.liked_current_user
    FROM profiles p
    WHERE p.id = ?
  `);

  const selectSwipe = db.prepare('SELECT id FROM swipes WHERE target_profile_id = ?');

  const insertSwipe = db.prepare('INSERT INTO swipes (target_profile_id, direction) VALUES (?, ?)');

  const selectMatches = db.prepare(`
    SELECT ${PUBLIC_COLUMNS}, s.created_at AS matched_at
    FROM swipes s
    JOIN profiles p ON p.id = s.target_profile_id
    WHERE s.direction = 'like' AND p.liked_current_user = 1
    ORDER BY s.created_at DESC, s.id DESC
  `);

  const recordSwipe = db.transaction((profileId, direction) => {
    const profile = selectProfile.get(profileId);
    if (!profile) throw new HttpError(404, 'Profile not found');
    if (selectSwipe.get(profileId)) throw new HttpError(409, 'Profile already swiped');
    insertSwipe.run(profileId, direction);
    return profile;
  });

  return {
    getFeed() {
      return selectFeed.all().map(toPublicProfile);
    },

    swipe(profileId, direction) {
      if (!Number.isInteger(profileId) || profileId < 1) {
        throw new HttpError(400, 'profileId must be a positive integer');
      }
      if (direction !== 'like' && direction !== 'pass') {
        throw new HttpError(400, "direction must be 'like' or 'pass'");
      }

      const profile = recordSwipe(profileId, direction);
      const matched = direction === 'like' && profile.liked_current_user === 1;

      return matched ? { matched: true, match: toPublicProfile(profile) } : { matched: false };
    },

    getMatches() {
      return selectMatches.all().map((row) => ({ ...toPublicProfile(row), matched_at: row.matched_at }));
    },
  };
}
