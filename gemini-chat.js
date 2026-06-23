/**
 * 안전바로 · Google Gemini LLM 프록시
 * Netlify Functions — /.netlify/functions/gemini-chat
 *
 * 환경변수 설정 (Netlify 대시보드 > Site configuration > Environment variables):
 *   GEMINI_API_KEY = AIzaSyxxxxxxxxxxxxxxxxx
 *
 * 로컬 개발 (.env 파일):
 *   GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
 *
 * Gemini API 키 발급: https://aistudio.google.com/app/apikey
 */
function cors() {
  return {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors(), body: '' };
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, headers: cors(), body: JSON.stringify({ error: 'Method Not Allowed' }) };

  const key = process.env.GEMINI_API_KEY;
  if (!key)
    return {
      statusCode: 500, headers: cors(),
      body: JSON.stringify({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' })
    };

  try {
    const payload = JSON.parse(event.body || '{}');
    // Anthropic 형식 → Gemini 형식 변환
    const systemText = payload.system || '';
    const msgs = payload.messages || [];
    const geminiContents = msgs.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    // system 지시를 첫 번째 user 메시지에 prepend
    if (systemText && geminiContents.length > 0 && geminiContents[0].role === 'user') {
      geminiContents[0].parts[0].text = `${systemText}\n\n${geminiContents[0].parts[0].text}`;
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: payload.max_tokens || 800,
          temperature: 0.7,
        },
      }),
    });
    const data = await res.json();
    // Anthropic 응답 형식으로 변환 (클라이언트 호환)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const anthropicLike = { content: [{ type: 'text', text }] };
    return { statusCode: 200, headers: cors(), body: JSON.stringify(anthropicLike) };
  } catch (e) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: String(e) }) };
  }
};
