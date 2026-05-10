import { uploadAsync } from 'expo-file-system';
import { OPENAI_API_KEY } from './config';

// Sends the recorded audio file to OpenAI Whisper and returns the transcript text.
// uploadAsync reads the file and posts it as multipart/form-data.
// uploadType 1 = FileSystemUploadType.MULTIPART (enum lives in a legacy submodule not re-exported by the main package)
export async function transcribeAudio(uri: string): Promise<string> {
  const result = await uploadAsync(
    'https://api.openai.com/v1/audio/transcriptions',
    uri,
    {
      httpMethod: 'POST',
      uploadType: 1,
      fieldName: 'file',
      mimeType: 'audio/m4a',
      parameters: { model: 'whisper-1' },
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    }
  );

  if (result.status !== 200) {
    throw new Error(`Whisper ${result.status}: ${result.body}`);
  }

  const data = JSON.parse(result.body);
  return (data.text ?? '').trim();
}
