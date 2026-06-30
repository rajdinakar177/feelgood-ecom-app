// app/lib/utils/buildQueryString.ts
export function buildQueryString(
  current: URLSearchParams,
  updates: Record<string, string | null>
): string {
  const params = new URLSearchParams(current.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  // Reset to page 1 whenever a filter changes (unless we're explicitly changing the page)
  if (!("page" in updates)) {
    params.delete("page");
  }

  return params.toString();
}