import { format } from "date-fns";

export function getTodayKey() {
  return format(new Date(), "yyyy-MM-dd");
}
