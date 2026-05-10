import { ANTHROPIC_API_KEY, CLAUDE_MODEL } from './config';

const SYSTEM_PROMPT =
  'You are a calm, thoughtful reflection tool inside a wellness app called CHAKRA. ' +
  'The user has just spoken a voice journal entry. Write one or two sentences that gently ' +
  'reflect back what you noticed — a pattern, a feeling, or an intention. Never mention AI. ' +
  'Never be preachy. Speak like a trusted friend who noticed something quietly. ' +
  'Be specific to what they said, not generic.';

// Sends the transcript to Claude and returns a one-to-two sentence reflection.
export async function getReflection(transcript: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: transcript }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Claude ${response.status}: ${body}`);
  }

  const data = await response.json();
  return (data.content[0]?.text ?? '').trim();
}
