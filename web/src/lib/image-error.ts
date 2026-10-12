/** Older tasks may retain an error in the language active when they ran. */
export function isImageTimeoutError(message?: string | null): boolean {
  return /超时|time[ -]?out|timed out|hết (?:thời gian|thời hạn)|quá (?:thời gian|hạn)/i.test(
    message || "",
  );
}
