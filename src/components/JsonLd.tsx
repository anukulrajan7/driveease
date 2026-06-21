/**
 * Renders one or more schema.org JSON-LD objects as a <script> tag.
 * Pass a single object or an array; arrays are emitted as a @graph-style list.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
