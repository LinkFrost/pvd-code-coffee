export const eventPageHref = (name: string) =>
  `/events/${encodeURIComponent(name)}`;

const SHORT_DESCRIPTION_PREFIX = /^short description:\s*/i;

export const parseEventDescription = (description: string) => {
  const trimmed = description.trim();

  if (!trimmed) {
    return { short: "", full: "" };
  }

  const lines = trimmed.split("\n");
  const firstLine = lines[0]?.trim() ?? "";
  const hadPrefix = SHORT_DESCRIPTION_PREFIX.test(firstLine);
  const short = firstLine.replace(SHORT_DESCRIPTION_PREFIX, "").trim();
  const rest = lines.slice(1).join("\n").trim();

  if (rest.length > 0) {
    return { short, full: rest };
  }

  return { short, full: hadPrefix ? short : trimmed };
};
