export const PUBLICATION_TIME_ZONE = 'America/Toronto'

const easternPublicationDateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: PUBLICATION_TIME_ZONE,
})

/** Formats a UTC publication instant as its calendar date in Eastern Time. */
export function formatPublicationDate(publicationInstant: string): string {
    return easternPublicationDateFormatter.format(new Date(publicationInstant))
}
