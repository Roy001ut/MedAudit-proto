import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Call Claude with a system + user prompt, optionally with file data.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object|null} fileData - { type: 'image'|'document', base64: string, mimeType: string }
 * @returns {Promise<object>} Parsed JSON response
 */
export async function callClaude(systemPrompt, userPrompt, fileData = null) {
  const content = [];

  if (fileData) {
    if (fileData.type === 'image') {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: fileData.mimeType,
          data: fileData.base64,
        },
      });
    } else if (fileData.type === 'document') {
      content.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: fileData.mimeType,
          data: fileData.base64,
        },
      });
    }
  }

  content.push({ type: 'text', text: userPrompt });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  });

  const raw = message.content[0].text;
  return parseJSON(raw);
}

function parseJSON(text) {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON object/array from text
    const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) return JSON.parse(match[1]);
    throw new Error(`Claude returned non-JSON response: ${text.slice(0, 200)}`);
  }
}
