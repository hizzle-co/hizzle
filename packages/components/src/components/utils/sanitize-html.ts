import DOMPurify from 'dompurify';

/**
 * Keep consumer formatting without trusting HTML from REST data or settings.
 * Call after interpolation and navigation-link preparation, immediately before
 * inserting HTML. Data attributes must survive for collection navigation links.
 */
export const sanitizeHtml = ( value: unknown ): string => DOMPurify.sanitize(
	value === null || value === undefined ? '' : String( value ),
	{ USE_PROFILES: { html: true }, FORBID_TAGS: [ 'style' ] }
);
