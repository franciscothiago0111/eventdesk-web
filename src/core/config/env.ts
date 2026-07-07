function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  apiUrl: requireEnv(
    'NEXT_PUBLIC_API_URL',
    process.env.NEXT_PUBLIC_API_URL,
  ),
  wsUrl: requireEnv('NEXT_PUBLIC_WS_URL', process.env.NEXT_PUBLIC_WS_URL),
};
