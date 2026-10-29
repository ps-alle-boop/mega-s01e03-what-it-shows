# Shared date parser interprets day-first tenant dates as month-first — 379 reports filed

Snapshot: **2026-10-04**. This issue covers the `parser` group currently merged into support ticket #4471. The exported classifier assigns **379 unique reports across 11 tenants** to it, from 1 April through 4 October 2026. That count includes the five unresolved timing anomalies described below; it is a filing classification, not proof that all 379 share a reproduced root cause.

## Observed behavior and evidence

The incident and executable knowledge-base model describe a shared parser that reads dates month first although the tenants write day first. Report **R-41200**, Harbour Dental (`en-GB`, app), states: “Our 7 April reminder went out on 4 July. Is this a joke. It is not April Fools where we are.” It was received at `2026-04-01T09:12:00+01:00` and merged at `2026-07-02T09:03:00+02:00`.

Report **R-41205**, Morrow Tax (`fr-FR`, app), states: “Customer booked 3 October and got an invite for 10 March. Please look at this.” Its browser was `en-US`, so intake tagged it `hint`; tenant and channel instead classify it as `parser`. Browser locale and intake tags cannot establish the cause.

The canonical group comprises 204 app reports, 150 email reports, and 25 booking-v2 form reports. Its intake tags are `parser` ×356 and `hint` ×23. The separate booking-v3 form-hint issue owns 33 other reports. Together these groups cover all **412 unique IDs**, after removing 15 identical overlap rows from the 427-row export.

## Scope and uncertainty

`causes.ts` assigns a report to this group when the tenant has a day-first locale and the route is not a booking-v3 form. The locale order is computed with `Intl.DateTimeFormat`, not inferred from the browser or a hardcoded list of countries.

Five reports in this count have timing symptoms that the parser explanation does not establish: **R-41202, R-41209, R-41236, R-41344, R-41620**. Track them in the linked timing investigation. They are a subset of these 379, not five additional reports. Do not close them automatically when the parser is fixed. If investigation proves a different cause, update membership and cross-links explicitly.

## Reproduction to perform

These are proposed product checks. The export's classifier was executed to verify membership; the product parser and invite delivery have **not** been reproduced or tested.

1. Use a Harbour Dental-equivalent day-first `en-GB` tenant through a path that reaches the shared parser.
2. Enter or supply `07/04/2026` with the intended date 7 April 2026.
3. Inspect the stored calendar date and generated invite. The reported failure is 4 July 2026.
4. Repeat for an app/email path and a booking-v2 form path; retain the tenant locale, submitted value, parsed value, and invite output.

## Desired behavior

The shared parser honors the tenant's supported date convention. A 7 April booking remains 7 April in storage and the generated invite. Browser preferences must not silently change that interpretation.

## Acceptance criteria

- Reproduce and document an affected shared-parser path with its tenant locale, raw date input, parsed date, and invite date.
- In affected day-first app/email and booking-v2 paths, verify at least one ambiguous date such as 7 April and its reversed counterpart, plus a date whose day is greater than 12.
- Verify an `en-US` browser does not change the configured day-first tenant interpretation on those paths.
- Keep booking-v3 hint remediation separately tracked; this issue does not claim that fix.
- Reconcile the five timing anomalies explicitly before closing their reports. A parser fix alone is not evidence that they are resolved.

## Source references

Paths are relative to the exported `support-kb/` root:

- `src/lib/data/reports-4471.json`: original report bodies, IDs, intake metadata, receipt and merge timestamps.
- `src/lib/kb/causes.ts`: `uniqueById`, `dayFirst`, `causeOf`, `groupByCause`.
- `src/lib/kb/locales.ts` and `src/lib/data/tenants/*.json`: tenant locale and booking-form resolution.
- `src/lib/data/desk-notes.json`: five timing anomalies.
- `src/lib/kb/CauseTable.svelte`: canonical grouping and anomaly footnote.
- `src/routes/kb/incidents/4471/+page.svx`: existing incident narrative, which incorrectly presents all reports as one issue.

Computed membership and source hashes are retained in the local review artifact `analysis.json`.
