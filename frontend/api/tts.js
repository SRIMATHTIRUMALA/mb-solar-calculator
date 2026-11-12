export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const text = req.query.text;
  const lang = req.query.lang || 'te';

  if (!text || !text.trim()) {
    return res.status(400).send('Text parameter is required');
  }

  // Clean text and split into short chunks (< 90 chars) so Google TTS never returns 400
  const cleanText = text.replace(/₹/g, 'రూపాయలు ').replace(/(\d+),(\d+)/g, '$1$2');
  const sentences = cleanText.split(/([।\.\!\?\n]+|,\s+)/).filter(Boolean);
  const chunks = [];
  let curr = '';

  for (const part of sentences) {
    if ((curr + part).length <= 90) {
      curr += part;
    } else {
      if (curr.trim()) chunks.push(curr.trim());
      curr = part;
    }
  }
  if (curr.trim()) chunks.push(curr.trim());

  try {
    const buffers = [];
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk.trim())}&tl=${lang}&client=tw-ob`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (response.ok) {
        const ab = await response.arrayBuffer();
        buffers.push(Buffer.from(ab));
      }
    }

    if (buffers.length === 0) {
      return res.status(502).send('Failed to synthesize speech');
    }

    const finalBuffer = Buffer.concat(buffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(finalBuffer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
