// const localDateTime = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:\d{2}(?:\.\d{1,3})?)?$/;
// const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
// const day = /^\d{4}-\d{2}-\d{2}$/;
// const zonedDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/i;

// function parseDate(value, endOfDay = false) {
//   if (value instanceof Date) return value.getTime();
//   if (typeof value !== "string") return NaN;
//   const input = value.trim();
//   if (localDateTime.test(input)) return Date.parse(`${input}+05:30`);
//   if (zonedDateTime.test(input)) return Date.parse(input);
//   if (day.test(input)) return Date.parse(`${input}T${endOfDay ? "23:59:59.999" : "00:00:00"}+05:30`);
//   return NaN;
// }

// export function eventEndTime(event) {
//   const detail = event?.detailPage;
//   const info = { ...detail?.eventInfo, ...detail?.introduction?.eventInfo };
//   const end = [info.endDateTime, event?.endDateTime].map((value) => parseDate(value, true)).find(Number.isFinite);
//   if (end !== undefined) return end;

//   // Old records may only have an ISO date or a badge such as 16 Feb 2024.
//   const dates = [info.date, event?.date, info.startDateTime?.slice?.(0, 10), event?.startDateTime?.slice?.(0, 10)];
//   for (const value of dates) {
//     if (typeof value !== "string") continue;
//     const input = value.trim();
//     if (day.test(input)) return parseDate(input, true);
//     const badge = /^(\d{1,2})\s+([a-z]{3,9})\s+(\d{4})$/i.exec(input);
//     if (!badge) continue;
//     const month = months.indexOf(badge[2].slice(0, 3).toLowerCase()) + 1;
//     if (month) {
//       const iso = `${badge[3]}-${String(month).padStart(2, "0")}-${badge[1].padStart(2, "0")}`;
//       const endOfDay = parseDate(iso, true);
//       if (new Date(endOfDay + 19800000).toJSON()?.startsWith(iso)) return endOfDay;
//     }
//   }
//   return NaN;
// }

// export function eventTemplate(event, now = Date.now()) {
//   if (!(now >= eventEndTime(event))) return "upcoming";
//   const format = event?.eventSections?.format || event?.eventFormat || event?.format;
//   const workshop = format
//     ? format === "workshop"
//     : /^(workshops?|training program)$/i.test(event?.category || "");
//   return workshop ? "completed-workshop" : "completed-conference";
// }

const localDateTime = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:\d{2}(?:\.\d{1,3})?)?$/;
const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const day = /^\d{4}-\d{2}-\d{2}$/;
const zonedDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/i;

function parseDate(value, endOfDay = false) {
  if (value instanceof Date) return value.getTime();
  if (typeof value !== "string") return NaN;
  const input = value.trim();
  if (localDateTime.test(input)) return Date.parse(`${input}+05:30`);
  if (zonedDateTime.test(input)) return Date.parse(input);
  if (day.test(input)) return Date.parse(`${input}T${endOfDay ? "23:59:59.999" : "00:00:00"}+05:30`);
  return NaN;
}

export function eventEndTime(event) {
  const detail = event?.detailPage;
  const info = { ...detail?.eventInfo, ...detail?.introduction?.eventInfo };
  const end = [info.endDateTime, event?.endDateTime].map((value) => parseDate(value, true)).find(Number.isFinite);
  if (end !== undefined) return end;

  // Old records may only have an ISO date or a badge such as 16 Feb 2024.
  const dates = [info.date, event?.date, info.startDateTime?.slice?.(0, 10), event?.startDateTime?.slice?.(0, 10)];
  for (const value of dates) {
    if (typeof value !== "string") continue;
    const input = value.trim();
    if (day.test(input)) return parseDate(input, true);
    const badge = /^(\d{1,2})\s+([a-z]{3,9})\s+(\d{4})$/i.exec(input);
    if (!badge) continue;
    const month = months.indexOf(badge[2].slice(0, 3).toLowerCase()) + 1;
    if (month) {
      const iso = `${badge[3]}-${String(month).padStart(2, "0")}-${badge[1].padStart(2, "0")}`;
      const endOfDay = parseDate(iso, true);
      if (new Date(endOfDay + 19800000).toJSON()?.startsWith(iso)) return endOfDay;
    }
  }
  return NaN;
}

export function eventTemplate(event, now = Date.now()) {
  if (!(now >= eventEndTime(event))) return "upcoming";
  const format = event?.eventSections?.format || event?.eventFormat || event?.format;
  const workshop = format
    ? format === "workshop"
    : /^(workshops?|training program)$/i.test(event?.category || "");
  return workshop ? "completed-workshop" : "completed-conference";
}
