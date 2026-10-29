# S01E03 support KB review

This repository contains the original MEGA.dev support KB export, two new signed review pages,
and the HTML rendered from the actual `.svx` pages and Svelte components. No production product
was run or fixed. The report data is the course's export dated 4 October 2026.

## Review outputs

- Incident review source: `src/routes/kb/incidents/4471-review/+page.svx`
- Incident review HTML: `rendered/kb/incidents/4471-review/index.html`
- Proposed replacement decision: `src/routes/kb/decisions/0002-evidence-before-merge/+page.svx`
- Decision HTML: `rendered/kb/decisions/0002-evidence-before-merge/index.html`
- Original source checksums: `source-provenance.json`
- Exact report membership and analysis: `evidence/analysis.json`
- GitHub issue links: `src/lib/data/issue-links.json`

The original accepted decision 0001 and original incident narrative are preserved. The new
decision is a proposal until the desk accepts it. Both new pages have a frontmatter signature;
their desk reference is computed by the original `RenderStamp` component.

## Reproduce the rendered pages

Use Node.js 22.12 or later:

```sh
npm ci
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/kb/incidents/4471-review`. The preview listens only on this machine.
The `rendered/` folder is a static site, including browser JavaScript for the deduplication
explorer. The HTML already contains the computed tables, charts and desk stamps before JavaScript runs.

## Counting rules

Run the supplied `causes.ts` with tenant locale, booking-form version and channel. Deduplicate
the export by report ID. Its current partition is parser 379 and hint 33, totaling 412.
The five desk-noted timing anomalies remain a subset of parser 379 and are investigated within the parser issue.
Their underlying cause is unproved. Do not sum overlapping issue coverage to obtain a report total.

`IncidentReview.svelte` computes the displayed figures from the source data. It does not infer
event timestamps from report timestamps. The snapshot shows delayed merging, not when staff began investigating.
