export function getPublicClientIp(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }

  return (
    headersList.get("x-real-ip")?.trim() ||
    headersList.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

export function isHoneypotTriggered(value: FormDataEntryValue | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
