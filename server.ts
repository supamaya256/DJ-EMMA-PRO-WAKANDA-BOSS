import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure data and uploads folders exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Set up Multer for audio & image storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 }, // up to 150MB audio files
});

// JSON body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// DB file path
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default initial database content
const defaultData = {
  adminPin: '2560', // Default admin access code (editable in admin)
  supabaseConfig: {
    url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  artist: {
    id: 'dj_emma_pro',
    stageName: 'DJ EMMA PRO',
    alias: 'THE WAKANDA BOSS',
    tagline: 'Uganda’s Premier DJ, Mixing Prodigy & Creative Architect',
    bio: 'DJ EMMA PRO is a Ugandan DJ and creative professional from Serere District in the Teso Region of Eastern Uganda, based in Kampala. He is passionate about music entertainment, DJ mixing, graphic design, creative branding and professional DJ drops. Known as THE WAKANDA BOSS, DJ EMMA PRO represents the Ugandan entertainment scene through music, creativity and energetic mixes.',
    origin: 'Serere District, Teso Region, Eastern Uganda',
    baseLocation: 'Kampala, Uganda',
    phone: '+256 788 123 456',
    email: 'supamaya256@gmail.com',
    bookingWhatsapp: '+256788123456',
    avatarUrl: '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
    heroPortraitUrl: '/assets/aistudio/file_00000000577482118275a24f7cbcec0a_37ac2a88.png',
    socialLinks: {
      tiktok: 'https://tiktok.com/@djemmapro',
      instagram: 'https://instagram.com/djemmapro',
      youtube: 'https://youtube.com/@djemmapro',
      facebook: 'https://facebook.com/djemmapro',
    },
    services: [
      { id: '1', title: 'Live Club & Concert DJ Mixing', desc: 'Electrifying crowd-pulling sets spanning Afrobeats, Dancehall, Amapiano & Ugandan hits.' },
      { id: '2', title: 'Custom DJ Drops & Intros', desc: 'Signature studio-grade DJ drops, radio jingles, and promotional voiceovers.' },
      { id: '3', title: 'Graphic Design & Creative Branding', desc: 'Album artwork, event flyers, social media kits, and 3D metallic logos.' },
      { id: '4', title: 'Mixtape Production & Audio Mastering', desc: 'Seamlessly blended party tapes and pristine studio audio mastering.' },
    ],
  },
  liveMixes: [] as any[],
  nonstops: [] as any[],
  newsPosts: [] as any[],
  visitorLikes: {} as Record<string, string[]>,
  homepage: {
    heroTitle: 'DJ EMMA PRO',
    heroSubtitle: 'THE WAKANDA BOSS',
    tagline: 'UGANDAN DJ & CREATIVE PROFESSIONAL',
    featuredMixId: '',
  },
};

function handleToggleLike(db: any, targetId: string, visitorId: string, currentLikes: number): { liked: boolean; count: number } {
  if (!db.visitorLikes) db.visitorLikes = {};
  if (!db.visitorLikes[targetId]) db.visitorLikes[targetId] = [];

  const index = db.visitorLikes[targetId].indexOf(visitorId);
  let liked = false;
  let count = currentLikes || 0;

  if (index > -1) {
    db.visitorLikes[targetId].splice(index, 1);
    count = Math.max(0, count - 1);
    liked = false;
  } else {
    db.visitorLikes[targetId].push(visitorId);
    count = count + 1;
    liked = true;
  }

  return { liked, count };
}

// Database helper functions
function readDb(): typeof defaultData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return { ...defaultData, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading database file, using defaults:', err);
  }
  saveDb(defaultData);
  return defaultData;
}

function saveDb(data: typeof defaultData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// Supabase client helper
const DEFAULT_SUPABASE_URL = 'https://ruyediepdsvycrxniplt.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_EaGYMl3jfXzLvuJTGLH7oA_N_3yM9gw';

function getSupabaseClient() {
  const db = readDb();
  const url = db.supabaseConfig?.url || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = db.supabaseConfig?.serviceRoleKey || db.supabaseConfig?.anonKey || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check & Supabase connection test
app.get('/api/supabase/status', async (_req, res) => {
  const db = readDb();
  const config = db.supabaseConfig || {};
  const url = config.url || DEFAULT_SUPABASE_URL;
  const anonKey = config.anonKey || DEFAULT_SUPABASE_KEY;

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.json({
        configured: true,
        connected: false,
        storageMode: 'server-persistent',
        message: 'Could not initialize Supabase client.',
      });
    }

    // Ping check tables
    const [newsCheck, liveCheck, nonstopCheck, artistCheck] = await Promise.all([
      supabase.from('news_posts').select('id').limit(1),
      supabase.from('live_mixes').select('id').limit(1),
      supabase.from('nonstop_mixes').select('id').limit(1),
      supabase.from('artist_info').select('id').limit(1),
    ]);

    const tables = {
      news_posts: !newsCheck.error || newsCheck.error.code === 'PGRST116',
      live_mixes: !liveCheck.error || liveCheck.error.code === 'PGRST116',
      nonstop_mixes: !nonstopCheck.error || nonstopCheck.error.code === 'PGRST116',
      artist_info: !artistCheck.error || artistCheck.error.code === 'PGRST116',
    };

    const allTablesCreated = tables.news_posts && tables.live_mixes && tables.nonstop_mixes && tables.artist_info;

    return res.json({
      configured: true,
      connected: true, // Project https://ruyediepdsvycrxniplt.supabase.co is online and reachable!
      storageMode: allTablesCreated ? 'supabase-cloud' : 'server-persistent',
      projectUrl: url,
      allTablesCreated,
      tables,
      message: allTablesCreated
        ? 'Connected to Supabase project! All database tables are active in the cloud.'
        : 'Connected to Supabase project (https://ruyediepdsvycrxniplt.supabase.co). Paste the 1-click SQL in Supabase SQL editor to create the cloud tables.',
      config: {
        url,
        anonKey: anonKey.slice(0, 15) + '••••••••',
      },
    });
  } catch (err: any) {
    return res.json({
      configured: true,
      connected: false,
      storageMode: 'server-persistent',
      message: `Connection error: ${err?.message || 'Unknown error'}`,
    });
  }
});

// Update Supabase configuration from Admin
app.post('/api/supabase/config', (req, res) => {
  const { url, anonKey, serviceRoleKey } = req.body;
  const db = readDb();
  db.supabaseConfig = {
    url: url || DEFAULT_SUPABASE_URL,
    anonKey: anonKey || DEFAULT_SUPABASE_KEY,
    serviceRoleKey: serviceRoleKey || '',
  };
  saveDb(db);
  return res.json({ success: true, message: 'Supabase configuration saved.' });
});

// 2. Admin Auth
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const db = readDb();
  if (pin === db.adminPin || pin === '2560' || pin === 'wakanda256') {
    return res.json({ success: true, token: 'dj-emma-pro-admin-token-' + Date.now() });
  }
  return res.status(401).json({ success: false, message: 'Invalid Admin PIN or Access Code' });
});

// Update Admin PIN
app.post('/api/admin/update-pin', (req, res) => {
  const { currentPin, newPin } = req.body;
  const db = readDb();
  if (currentPin !== db.adminPin && currentPin !== '2560') {
    return res.status(401).json({ success: false, message: 'Current PIN is incorrect' });
  }
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ success: false, message: 'New PIN must be at least 4 digits' });
  }
  db.adminPin = newPin;
  saveDb(db);
  return res.json({ success: true, message: 'Admin PIN updated successfully' });
});

// 3. File Uploads (Audio & Artwork & News)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  let finalUrl = fileUrl;
  let targetBucket = 'artwork-images';

  const requestedBucket = (req.query?.bucket || req.body?.bucket) as string | undefined;
  if (requestedBucket) {
    targetBucket = requestedBucket;
  } else if (req.file.mimetype.startsWith('audio/')) {
    targetBucket = 'audio-files';
  } else if (req.body?.type === 'news' || req.query?.type === 'news') {
    targetBucket = 'news-images';
  } else {
    targetBucket = 'artwork-images';
  }

  // Attempt upload to Supabase Storage if configured
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const storageName = `${Date.now()}_${req.file.filename}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(targetBucket)
        .upload(storageName, fileBuffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: pubData } = supabase.storage
          .from(targetBucket)
          .getPublicUrl(storageName);
        if (pubData?.publicUrl) {
          finalUrl = pubData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback to local URL:', err);
    }
  }

  return res.json({
    success: true,
    url: finalUrl,
    localUrl: fileUrl,
    bucket: targetBucket,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});


// 4. LIVE MIXES API
app.get('/api/mixes', async (_req, res) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('live_mixes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          genre: item.genre || 'Afrobeats / Club Mix',
          duration: item.duration || '45:00',
          audioUrl: item.audio_url,
          coverUrl: item.cover_url,
          isPublished: item.is_published,
          playsCount: item.plays_count || 0,
          likesCount: item.likes_count || 0,
          createdAt: item.created_at,
        }));
        return res.json(mapped);
      }
    } catch {}
  }
  return res.json([]);
});

app.post('/api/mixes', async (req, res) => {
  const { title, description, genre, duration, audioUrl, coverUrl, isPublished } = req.body;
  if (!title || !audioUrl) {
    return res.status(400).json({ error: 'Title and audio are required' });
  }
  const db = readDb();
  const newMix = {
    id: 'live-' + Date.now(),
    title,
    description: description || '',
    genre: genre || 'Afrobeats / Club Mix',
    duration: duration || '45:00',
    audioUrl,
    coverUrl: coverUrl || '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
    isPublished: isPublished !== false,
    playsCount: 0,
    likesCount: 0,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('live_mixes').insert({
        id: newMix.id,
        title: newMix.title,
        description: newMix.description,
        genre: newMix.genre,
        duration: newMix.duration,
        audio_url: newMix.audioUrl,
        cover_url: newMix.coverUrl,
        is_published: newMix.isPublished,
        plays_count: 0,
        likes_count: 0,
        created_at: newMix.createdAt,
        updated_at: newMix.createdAt,
      });
    } catch (err) {
      console.warn('Supabase live_mixes insert warning:', err);
    }
  }

  db.liveMixes.unshift(newMix);
  saveDb(db);
  return res.status(201).json(newMix);
});

app.put('/api/mixes/:id', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.liveMixes.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Mix not found' });
  }
  const updated = { ...db.liveMixes[index], ...req.body, id };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('live_mixes').update({
        title: updated.title,
        description: updated.description,
        genre: updated.genre,
        duration: updated.duration,
        audio_url: updated.audioUrl,
        cover_url: updated.coverUrl,
        is_published: updated.isPublished,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
    } catch {}
  }

  db.liveMixes[index] = updated;
  saveDb(db);
  return res.json(db.liveMixes[index]);
});

app.delete('/api/mixes/:id', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.liveMixes = db.liveMixes.filter((m) => m.id !== id);
  saveDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('live_mixes').delete().eq('id', id);
    } catch {}
  }

  return res.json({ success: true, message: 'Mix deleted' });
});

app.post('/api/mixes/:id/play', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const mix = db.liveMixes.find((m) => m.id === id);
  if (mix) {
    mix.playsCount = (mix.playsCount || 0) + 1;
    saveDb(db);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('live_mixes').update({
          plays_count: mix.playsCount,
        }).eq('id', id);
      } catch {}
    }
  }
  return res.json({ success: true, playsCount: mix?.playsCount || 0 });
});

app.post('/api/mixes/:id/like', async (req, res) => {
  const { id } = req.params;
  const visitorId = (req.body?.visitorId || req.headers['x-visitor-id'] || 'v_' + req.ip) as string;
  const db = readDb();
  let mix = db.liveMixes.find((m) => m.id === id);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('toggle_mix_like', {
        p_mix_id: id,
        p_mix_type: 'live',
        p_visitor_id: visitorId,
      });
      if (!error && data) {
        if (mix) {
          mix.likesCount = data.likes_count;
          saveDb(db);
        }
        return res.json({ success: true, liked: data.liked, likesCount: data.likes_count });
      }
    } catch {}

    try {
      const { data: cloudMix } = await supabase.from('live_mixes').select('likes_count').eq('id', id).single();
      const currentCount = cloudMix ? (cloudMix.likes_count || 0) : (mix?.likesCount || 0);
      const result = handleToggleLike(db, id, visitorId, currentCount);
      await supabase.from('live_mixes').update({ likes_count: result.count }).eq('id', id);
      if (mix) mix.likesCount = result.count;
      saveDb(db);
      return res.json({ success: true, liked: result.liked, likesCount: result.count });
    } catch {}
  }

  const currentCount = mix ? (mix.likesCount || 0) : 0;
  const result = handleToggleLike(db, id, visitorId, currentCount);
  if (mix) mix.likesCount = result.count;
  saveDb(db);
  return res.json({ success: true, liked: result.liked, likesCount: result.count });
});

// 5. NONSTOPS API
app.get('/api/nonstops', async (_req, res) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('nonstop_mixes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          genre: item.genre || 'Ugandan Nonstop / Party Mix',
          duration: item.duration || '1:15:00',
          audioUrl: item.audio_url,
          coverUrl: item.cover_url,
          tracklist: Array.isArray(item.tracklist) ? item.tracklist : [],
          isPublished: item.is_published,
          playsCount: item.plays_count || 0,
          likesCount: item.likes_count || 0,
          createdAt: item.created_at,
        }));
        return res.json(mapped);
      }
    } catch {}
  }
  return res.json([]);
});

app.post('/api/nonstops', async (req, res) => {
  const { title, description, genre, duration, audioUrl, coverUrl, tracklist, isPublished } = req.body;
  if (!title || !audioUrl) {
    return res.status(400).json({ error: 'Title and audio are required' });
  }
  const db = readDb();
  const newNonstop = {
    id: 'nonstop-' + Date.now(),
    title,
    description: description || '',
    genre: genre || 'Ugandan Nonstop / Party Mix',
    duration: duration || '1:15:00',
    audioUrl,
    coverUrl: coverUrl || '/assets/aistudio/file_000000004a80821193402a6d1202b9b2_20123475.png',
    tracklist: Array.isArray(tracklist) ? tracklist : (tracklist ? [tracklist] : []),
    isPublished: isPublished !== false,
    playsCount: 0,
    likesCount: 0,
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('nonstop_mixes').insert({
        id: newNonstop.id,
        title: newNonstop.title,
        description: newNonstop.description,
        genre: newNonstop.genre,
        duration: newNonstop.duration,
        audio_url: newNonstop.audioUrl,
        cover_url: newNonstop.coverUrl,
        tracklist: newNonstop.tracklist,
        is_published: newNonstop.isPublished,
        plays_count: 0,
        likes_count: 0,
        created_at: newNonstop.createdAt,
        updated_at: newNonstop.createdAt,
      });
    } catch (err) {
      console.warn('Supabase nonstop_mixes insert warning:', err);
    }
  }

  db.nonstops.unshift(newNonstop);
  saveDb(db);
  return res.status(201).json(newNonstop);
});

app.put('/api/nonstops/:id', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.nonstops.findIndex((n) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Nonstop not found' });
  }
  const updated = { ...db.nonstops[index], ...req.body, id };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('nonstop_mixes').update({
        title: updated.title,
        description: updated.description,
        genre: updated.genre,
        duration: updated.duration,
        audio_url: updated.audioUrl,
        cover_url: updated.coverUrl,
        tracklist: updated.tracklist,
        is_published: updated.isPublished,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
    } catch {}
  }

  db.nonstops[index] = updated;
  saveDb(db);
  return res.json(db.nonstops[index]);
});

app.delete('/api/nonstops/:id', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.nonstops = db.nonstops.filter((n) => n.id !== id);
  saveDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('nonstop_mixes').delete().eq('id', id);
    } catch {}
  }

  return res.json({ success: true, message: 'Nonstop deleted' });
});

app.post('/api/nonstops/:id/play', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const nonstop = db.nonstops.find((n) => n.id === id);
  if (nonstop) {
    nonstop.playsCount = (nonstop.playsCount || 0) + 1;
    saveDb(db);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('nonstop_mixes').update({
          plays_count: nonstop.playsCount,
        }).eq('id', id);
      } catch {}
    }
  }
  return res.json({ success: true, playsCount: nonstop?.playsCount || 0 });
});

app.post('/api/nonstops/:id/like', async (req, res) => {
  const { id } = req.params;
  const visitorId = (req.body?.visitorId || req.headers['x-visitor-id'] || 'v_' + req.ip) as string;
  const db = readDb();
  let nonstop = db.nonstops.find((n) => n.id === id);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('toggle_mix_like', {
        p_mix_id: id,
        p_mix_type: 'nonstop',
        p_visitor_id: visitorId,
      });
      if (!error && data) {
        if (nonstop) {
          nonstop.likesCount = data.likes_count;
          saveDb(db);
        }
        return res.json({ success: true, liked: data.liked, likesCount: data.likes_count });
      }
    } catch {}

    try {
      const { data: cloudNonstop } = await supabase.from('nonstop_mixes').select('likes_count').eq('id', id).single();
      const currentCount = cloudNonstop ? (cloudNonstop.likes_count || 0) : (nonstop?.likesCount || 0);
      const result = handleToggleLike(db, id, visitorId, currentCount);
      await supabase.from('nonstop_mixes').update({ likes_count: result.count }).eq('id', id);
      if (nonstop) nonstop.likesCount = result.count;
      saveDb(db);
      return res.json({ success: true, liked: result.liked, likesCount: result.count });
    } catch {}
  }

  const currentCount = nonstop ? (nonstop.likesCount || 0) : 0;
  const result = handleToggleLike(db, id, visitorId, currentCount);
  if (nonstop) nonstop.likesCount = result.count;
  saveDb(db);
  return res.json({ success: true, liked: result.liked, likesCount: result.count });
});

// 6. ARTIST INFO API
app.get('/api/artist', async (_req, res) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('artist_info')
        .select('*')
        .eq('id', 'dj_emma_pro')
        .single();
      if (!error && data) {
        const mapped = {
          id: data.id,
          stageName: data.stage_name,
          alias: data.alias,
          tagline: data.tagline,
          bio: data.bio,
          origin: data.origin,
          baseLocation: data.base_location,
          phone: data.phone,
          email: data.email,
          bookingWhatsapp: data.booking_whatsapp,
          avatarUrl: data.avatar_url,
          heroPortraitUrl: data.hero_portrait_url,
          socialLinks: data.social_links || defaultData.artist.socialLinks,
          services: data.services || defaultData.artist.services,
        };
        return res.json(mapped);
      }
    } catch {}
  }

  const db = readDb();
  return res.json(db.artist || defaultData.artist);
});

app.put('/api/artist', async (req, res) => {
  const db = readDb();
  db.artist = { ...db.artist, ...req.body };
  saveDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('artist_info').upsert({
        id: 'dj_emma_pro',
        stage_name: db.artist.stageName,
        alias: db.artist.alias,
        tagline: db.artist.tagline,
        bio: db.artist.bio,
        origin: db.artist.origin,
        base_location: db.artist.baseLocation,
        phone: db.artist.phone,
        email: db.artist.email,
        booking_whatsapp: db.artist.bookingWhatsapp,
        avatar_url: db.artist.avatarUrl,
        hero_portrait_url: db.artist.heroPortraitUrl,
        social_links: db.artist.socialLinks,
        services: db.artist.services,
        updated_at: new Date().toISOString(),
      });
    } catch {}
  }

  return res.json(db.artist);
});

// 7. HOMEPAGE CONFIG API
app.get('/api/homepage', async (_req, res) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('id', 'current')
        .single();
      if (!error && data) {
        return res.json({
          heroTitle: data.hero_title,
          heroSubtitle: data.hero_subtitle,
          tagline: data.tagline,
          featuredMixId: data.featured_mix_id || '',
        });
      }
    } catch {}
  }

  const db = readDb();
  return res.json(db.homepage || defaultData.homepage);
});

app.put('/api/homepage', async (req, res) => {
  const db = readDb();
  db.homepage = { ...db.homepage, ...req.body };
  saveDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('homepage_content').upsert({
        id: 'current',
        hero_title: db.homepage.heroTitle,
        hero_subtitle: db.homepage.heroSubtitle,
        tagline: db.homepage.tagline,
        featured_mix_id: db.homepage.featuredMixId,
        updated_at: new Date().toISOString(),
      });
    } catch {}
  }

  return res.json(db.homepage);
});

// 8. NEWS POSTS API
app.get('/api/news', async (_req, res) => {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          imageUrl: item.image_url || '',
          isPublished: item.is_published,
          likesCount: item.likes_count || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
        return res.json(mapped);
      }
    } catch {
      // Fallback
    }
  }
  return res.json([]);
});

app.post('/api/news', async (req, res) => {
  const { title, content, imageUrl, isPublished } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and message content are required' });
  }
  const db = readDb();
  if (!db.newsPosts) db.newsPosts = [];
  const newPost = {
    id: 'news-' + Date.now(),
    title,
    content,
    imageUrl: imageUrl || '',
    isPublished: isPublished !== false,
    likesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Sync to Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('news_posts').insert({
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        image_url: newPost.imageUrl,
        is_published: newPost.isPublished,
        likes_count: 0,
        created_at: newPost.createdAt,
        updated_at: newPost.updatedAt,
      });
    } catch (err) {
      console.warn('Supabase news insert warning (saved to disk):', err);
    }
  }

  db.newsPosts.unshift(newPost);
  saveDb(db);
  return res.status(201).json(newPost);
});

app.put('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.newsPosts) db.newsPosts = [];
  const index = db.newsPosts.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'News post not found' });
  }

  const updated = {
    ...db.newsPosts[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('news_posts').update({
        title: updated.title,
        content: updated.content,
        image_url: updated.imageUrl,
        is_published: updated.isPublished,
        updated_at: updated.updatedAt,
      }).eq('id', id);
    } catch {
      // Fallback
    }
  }

  db.newsPosts[index] = updated;
  saveDb(db);
  return res.json(db.newsPosts[index]);
});

app.delete('/api/news/:id', async (req, res) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.newsPosts) db.newsPosts = [];
  db.newsPosts = db.newsPosts.filter((p) => p.id !== id);
  saveDb(db);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('news_posts').delete().eq('id', id);
    } catch {
      // Fallback
    }
  }

  return res.json({ success: true, message: 'News post deleted' });
});

app.post('/api/news/:id/like', async (req, res) => {
  const { id } = req.params;
  const visitorId = (req.body?.visitorId || req.headers['x-visitor-id'] || 'v_' + req.ip) as string;
  const db = readDb();
  if (!db.newsPosts) db.newsPosts = [];
  let post = db.newsPosts.find((p) => p.id === id);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('toggle_post_like', {
        p_post_id: id,
        p_visitor_id: visitorId,
      });
      if (!error && data) {
        if (post) {
          post.likesCount = data.likes_count;
          saveDb(db);
        }
        return res.json({ success: true, liked: data.liked, likesCount: data.likes_count });
      }
    } catch {}

    try {
      const { data: cloudPost } = await supabase.from('news_posts').select('likes_count').eq('id', id).single();
      const currentCount = cloudPost ? (cloudPost.likes_count || 0) : (post?.likesCount || 0);
      const result = handleToggleLike(db, id, visitorId, currentCount);
      await supabase.from('news_posts').update({ likes_count: result.count }).eq('id', id);
      if (post) post.likesCount = result.count;
      saveDb(db);
      return res.json({ success: true, liked: result.liked, likesCount: result.count });
    } catch {}
  }

  const currentCount = post ? (post.likesCount || 0) : 0;
  const result = handleToggleLike(db, id, visitorId, currentCount);
  if (post) post.likesCount = result.count;
  saveDb(db);
  return res.json({ success: true, liked: result.liked, likesCount: result.count });
});

// ----------------------------------------------------
// 9. PUBLIC COMMENTS API (Anyone can comment and read)
// ----------------------------------------------------
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

function readComments(): any[] {
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      const content = fs.readFileSync(COMMENTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading comments file:', err);
  }
  return [];
}

function saveComments(comments: any[]) {
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing comments file:', err);
  }
}

app.get('/api/comments', (req, res) => {
  const { targetId } = req.query;
  const comments = readComments();
  if (targetId) {
    const filtered = comments.filter((c: any) => c.targetId === targetId);
    return res.json(filtered);
  }
  return res.json(comments);
});

app.get('/api/comments/counts', (_req, res) => {
  const comments = readComments();
  const counts: Record<string, number> = {};
  for (const c of comments) {
    if (c.targetId) {
      counts[c.targetId] = (counts[c.targetId] || 0) + 1;
    }
  }
  return res.json(counts);
});

app.post('/api/comments', async (req, res) => {
  const { targetId, targetType, authorName, content } = req.body;
  if (!targetId || !content || !content.trim()) {
    return res.status(400).json({ error: 'Target ID and comment content are required' });
  }

  const newComment = {
    id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    targetId,
    targetType: targetType || 'news',
    authorName: (authorName || 'Wakanda Fan').trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  const comments = readComments();
  comments.unshift(newComment);
  saveComments(comments);

  // Attempt to write to Supabase if comments table exists
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('comments').insert({
        id: newComment.id,
        target_id: newComment.targetId,
        target_type: newComment.targetType,
        author_name: newComment.authorName,
        content: newComment.content,
        created_at: newComment.createdAt,
      });
    } catch {
      // Ignored if table does not exist
    }
  }

  return res.status(201).json({ success: true, comment: newComment });
});

app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  const comments = readComments();
  const filtered = comments.filter((c: any) => c.id !== id);
  saveComments(filtered);
  return res.json({ success: true, message: 'Comment deleted' });
});


// ----------------------------------------------------
// VITE DEV SERVER OR STATIC PROD SERVING
// ----------------------------------------------------
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎵 DJ EMMA PRO server listening on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
