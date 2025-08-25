export async function sha256(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const buf = await window.crypto.subtle.digest('SHA-256', enc.encode(input));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Node fallback
  const { createHash } = await import('crypto');
  return createHash('sha256').update(input).digest('hex');
}
