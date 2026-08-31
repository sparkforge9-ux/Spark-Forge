import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  // Add CORS headers for API calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const posts = (await redis.get('posts')) || [];
      return res.status(200).json(posts);
    } 
    
    if (req.method === 'POST') {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content required' });
      }

      const posts = (await redis.get('posts')) || [];
      const newPost = {
        id: Date.now(),
        title,
        content,
        votes: 1
      };
      
      posts.unshift(newPost);
      await redis.set('posts', posts);
      return res.status(201).json(newPost);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}