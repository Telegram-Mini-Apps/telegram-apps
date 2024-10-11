const KB = 1024;
const MB = KB * 1024;

export function formatSize(bytes: number): string {
  if (!bytes) {
    return '0b';
  }

  const mb = Math.floor(bytes / MB);
  bytes -= mb * MB;
  const kb = Math.floor(bytes / KB);
  bytes -= kb * KB;

  const output: string[] = [];
  mb && output.push(`${mb}mb`);
  kb && output.push(`${kb}kb`);
  bytes && output.push(`${bytes}b`);
  return output.join(', ');
}