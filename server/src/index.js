import { createDatabase } from './db/database.js';
import { seedIfEmpty } from './db/seed.js';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 4000;

const db = createDatabase();
const seeded = seedIfEmpty(db);
if (seeded > 0) console.log(`Seeded ${seeded} profiles`);

createApp(db).listen(PORT, () => {
  console.log(`Coy Discover API listening on http://localhost:${PORT}`);
});
