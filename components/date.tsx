import { formatPublicationDate } from 'lib/posts/publication-date'

export default function Date({ dateString }: { dateString: string }) {
  return (
    <time
      className="text-gray-400 tracking-[0.3em] lowercase text-xs"
      dateTime={dateString}
    >
      {formatPublicationDate(dateString)}
    </time>
  );
}
