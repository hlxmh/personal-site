import { parseISO, format } from "date-fns";

export default function Date({ dateString }: { dateString: string }) {
  const date = parseISO(dateString);
  return (
    <time
      className="text-gray-400 tracking-[0.3em] lowercase text-xs"
      dateTime={dateString}
    >
      {format(date, "LLLL d, yyyy")}
    </time>
  );
}
