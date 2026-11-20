const portrait = (gender, n) => `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

// [name, age, gender, portrait#, location, bio, interests, likesYou]
const PROFILES = [
  ['Aarav Mehta', 21, 'men', 32, 'IIT Delhi', 'Third-year mech student who builds things at 2am and apologises for it at 9am.', ['Robotics', 'Chai', 'Football', 'Lo-fi'], 0],
  ['Ananya Sharma', 20, 'women', 44, 'Delhi University', 'Literature major. Will recommend you a book and then ask if you finished it.', ['Poetry', 'Thrifting', 'Indie music', 'Cafes'], 1],
  ['Rohan Kapoor', 22, 'men', 12, 'Gurgaon', 'Product analyst by day, amateur sourdough baker by night. Results vary.', ['Baking', 'Cricket', 'Podcasts'], 0],
  ['Isha Verma', 21, 'women', 68, 'Ashoka University', 'Philosophy and economics. Always up for a long walk and a longer debate.', ['Debate', 'Hiking', 'Journaling', 'Coffee'], 1],
  ['Kabir Singh', 23, 'men', 45, 'Bangalore', 'Startup engineer. Weekends are for trails around Nandi Hills.', ['Cycling', 'Startups', 'Photography', 'Biryani'], 0],
  ['Meera Nair', 22, 'women', 26, 'Bangalore', 'UX designer who judges apps and menus equally harshly.', ['Design', 'Bharatanatyam', 'Filter coffee'], 0],
  ['Arjun Reddy', 24, 'men', 75, 'Hyderabad', 'Doctor in training, terrible at replying while on shift, great at memes.', ['Memes', 'Badminton', 'Road trips', 'Biryani'], 1],
  ['Saanvi Iyer', 20, 'women', 12, 'Mumbai', 'Film school kid chasing golden hour on Marine Drive.', ['Cinema', 'Street food', 'Sketching', 'Vinyl'], 0],
  ['Vihaan Joshi', 21, 'men', 22, 'IIT Bombay', 'Competitive coder, casual guitarist, professional overthinker.', ['Coding', 'Guitar', 'Chess'], 0],
  ['Diya Malhotra', 22, 'women', 33, 'Delhi', 'Fashion intern with a questionable number of tote bags.', ['Fashion', 'Pilates', 'Brunch', 'Travel'], 0],
  ['Aditya Rao', 23, 'men', 60, 'BITS Pilani', 'Physics nerd who also happens to be very good at table tennis.', ['Table tennis', 'Astronomy', 'Sci-fi'], 1],
  ['Tara Bhatia', 21, 'women', 5, 'Lady Shri Ram College', 'Political science, student council, and a standing order of iced lattes.', ['Politics', 'Theatre', 'Lattes', 'Karaoke'], 0],
  ['Dev Khanna', 25, 'men', 8, 'Gurgaon', 'Consultant who actually enjoys spreadsheets. Please send help, or tacos.', ['Tacos', 'Gym', 'Stand-up comedy'], 0],
  ['Naina Kulkarni', 22, 'women', 52, 'Pune', 'Climate researcher and weekend potter. Hands are usually muddy.', ['Pottery', 'Sustainability', 'Trekking', 'Chai'], 0],
  ['Reyansh Gupta', 22, 'men', 19, 'Delhi', 'Law student with strong opinions about Delhi metro etiquette.', ['Moot court', 'Metro rides', 'Cricket', 'Momos'], 1],
  ['Kiara Sethi', 20, 'women', 71, 'Mumbai', 'Dancer first, commerce student second. Will always find the best vada pav.', ['Dance', 'Vada pav', 'Reels', 'Beach walks'], 0],
  ['Samar Chawla', 24, 'men', 3, 'Bangalore', 'Brewery regular and amateur drummer. Neighbours have opinions.', ['Drums', 'Craft beer', 'Live gigs'], 0],
  ['Riya Banerjee', 23, 'women', 17, 'Kolkata', 'Journalism grad. Adda, rosogolla and a good long-form read.', ['Writing', 'Adda', 'Photography', 'Sweets'], 0],
  ['Yash Agarwal', 21, 'men', 41, 'IIT Delhi', 'Chemical engineering, chaotic neutral. Makes the group playlist.', ['Playlists', 'Gaming', 'Football', 'Maggi'], 1],
  ['Aisha Khan', 22, 'women', 9, 'Jamia Millia Islamia', 'Architecture student who sketches every building she walks past.', ['Architecture', 'Sketching', 'Old Delhi food'], 0],
  ['Neil DSouza', 23, 'men', 55, 'Mumbai', 'Bandra local, bass player, ex-barista. Ask me about cold brew.', ['Bass guitar', 'Cold brew', 'Surfing', 'Cinema'], 0],
  ['Pooja Menon', 21, 'women', 38, 'Bangalore', 'Data science student. I will explain a p-value to you on a first date.', ['Statistics', 'Board games', 'Dosa', 'Yoga'], 1],
  ['Krish Oberoi', 22, 'men', 29, 'Gurgaon', 'Finance bro in recovery. Now just really into padel.', ['Padel', 'Investing', 'Road trips'], 0],
  ['Zoya Ahmed', 24, 'women', 24, 'Delhi', 'Radio host with a voice for podcasts and a face for photos on stories.', ['Podcasts', 'Poetry', 'Kebabs', 'Travel'], 0],
  ['Harsh Pandey', 20, 'men', 66, 'Delhi University', 'History honours. Knows too much about the Mughals, not enough about laundry.', ['History', 'Cricket', 'Chai', 'Quizzing'], 0],
  ['Mitali Desai', 22, 'women', 47, 'Mumbai', 'Marketing associate who plans trips she never takes. Until now.', ['Travel', 'Marketing', 'Garba', 'Cafes'], 1],
  ['Ishaan Bajaj', 25, 'men', 14, 'Delhi', 'Chef-in-training. If you are hungry, I am the right swipe.', ['Cooking', 'Food markets', 'Running'], 0],
  ['Anika Rastogi', 21, 'women', 59, 'Ashoka University', 'Psychology major. Collects playlists, plants and half-finished journals.', ['Psychology', 'Plants', 'Journaling', 'Indie music'], 0],
  ['Veer Saxena', 23, 'men', 36, 'Bangalore', 'ML engineer who thinks the best model is a good night of sleep.', ['Machine learning', 'Cycling', 'Anime', 'Filter coffee'], 1],
  ['Trisha Roy', 22, 'women', 2, 'Mumbai', 'Stand-up open-mic regular. Roasts are free, hugs are extra.', ['Stand-up comedy', 'Writing', 'Street food'], 0],
  ['Rahul Sinha', 24, 'men', 50, 'Gurgaon', 'Fitness coach with a soft spot for terrible rom-coms.', ['Fitness', 'Rom-coms', 'Cricket', 'Dogs'], 0],
  ['Sanya Arora', 21, 'women', 63, 'IIT Delhi', 'Electrical engineering, debate society, and a lifelong quest for the best momos.', ['Debate', 'Momos', 'Badminton', 'Podcasts'], 1],
];

/**
 * Seeds the profiles table. Idempotent: does nothing if profiles already exist.
 * Returns the number of rows inserted.
 */
export function seedIfEmpty(db) {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM profiles').get();
  if (count > 0) return 0;

  const insert = db.prepare(`
    INSERT INTO profiles (name, age, photo_url, bio, location, interests, liked_current_user)
    VALUES (@name, @age, @photo_url, @bio, @location, @interests, @liked_current_user)
  `);

  const run = db.transaction(() => {
    for (const [name, age, gender, pic, location, bio, interests, likes] of PROFILES) {
      insert.run({
        name: name === 'Neil DSouza' ? "Neil D'Souza" : name,
        age,
        photo_url: portrait(gender, pic),
        bio,
        location,
        interests: JSON.stringify(interests),
        liked_current_user: likes,
      });
    }
  });
  run();
  return PROFILES.length;
}
