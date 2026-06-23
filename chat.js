/**
 * 안전바로 · Anthropic Claude LLM 프록시
 * Netlify Functions — /.netlify/functions/chat
 *
 * 환경변수 설정 (Netlify 대시보드 > Site configuration > Environment variables):
 *   ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxx
 *
 * 로컬 개발 (.env 파일):
 *   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
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

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key)
    return {
      statusCode: 500, headers: cors(),
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.' })
    };

  try {
    const payload = JSON.parse(event.body || '{}');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: payload.model || 'claude-sonnet-4-6',
        max_tokens: payload.max_tokens || 800,
        system: payload.system,
        messages: payload.messages,
      }),
    });
    const data = await res.json();
    return { statusCode: res.status, headers: cors(), body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: String(e) }) };
  }
};
