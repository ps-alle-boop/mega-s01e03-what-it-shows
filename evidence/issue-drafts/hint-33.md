# Booking-v3 shows MM/DD/YYYY while day-first tenants' forms read DD/MM/YYYY — 33 reports

Snapshot: **2026-10-04**. This issue separates **33 unique form reports** wrongly merged into support ticket #4471 from the shared-parser group of 379. The reports span 17 April through 22 September 2026 and involve three day-first tenants: **Alder Physio (`de-DE`) ×12, Copper Studio (`es-ES`) ×11, Pale Harbour (`pt-PT`) ×10**.

## Observed behavior and evidence

`src/lib/kb/causes.ts` defines booking-v3's date-field hint as `MM/DD/YYYY` and describes the form reading the supplied date using the tenant's day-first convention. A person following that hint can therefore submit a different date from the one the form stores. This is distinct from the shared parser reading day-first input as month-first.

Report **R-41230**, Copper Studio, form channel, states: “My client came on 1 June instead of 6 January. We sorted it out.” It was received at `2026-04-17T22:44:00+02:00` and merged at `2026-07-02T09:56:00+02:00`. Its browser was `en-GB` and intake tag was `parser`; Copper's tenant configuration is `es-ES` with `booking-v3`, so the executable classifier assigns it to `hint`.

Report **R-41251**, Pale Harbour, form channel, states: “Wednesday 7 January showed as Wednesday 1 July. I moved it myself.” It was received at `2026-04-25T20:48:00+01:00` and merged at `2026-07-02T10:30:00+02:00`. This ID appears twice identically in the paginated export and counts once.

Only 18 of these reports were tagged `hint` at intake; the other 15 were tagged `parser`. Conversely, 23 reports tagged `hint` belong to the separate parser group. Counting intake tags would produce the wrong split.

## Exact membership

```text
R-41230 R-41241 R-41251 R-41259 R-41262 R-41275 R-41294
R-41305 R-41308 R-41366 R-41372 R-41384 R-41387 R-41396
R-41400 R-41406 R-41415 R-41416 R-41418 R-41428 R-41439
R-41441 R-41449 R-41453 R-41456 R-41460 R-41472 R-41485
R-41493 R-41539 R-41572 R-41582 R-41584
```

These 33 plus the 379 canonical parser reports equal all 412 unique reports. The five timing anomalies are included in the parser group and are not part of this hint group.

## Reproduction to perform

These are proposed product checks. The export's classifier was executed to verify membership; the booking form itself has **not** been run or tested.

1. Open a booking-v3 form configured for a day-first tenant such as Copper Studio (`es-ES`).
2. Inspect the hint. The exported model says it displays `MM/DD/YYYY`.
3. For an intended booking on 6 January 2026, follow that hint and enter `01/06/2026`.
4. Inspect the parsed date and generated invite. Reading that input day first would produce 1 June 2026, matching R-41230's symptom.
5. Capture the form version, tenant locale, visible hint, raw input, parsed value, and invite date. Repeat with an `en-US` browser to check that browser language does not override tenant behavior unexpectedly.

## Desired behavior

The displayed date hint and the accepted input order agree with each other and with the tenant's supported date convention. Following the hint must preserve the intended calendar date through booking and invite generation.

## Acceptance criteria

- Reproduce and document the booking-v3 hint/parser mismatch for a day-first tenant.
- Make the hint and actual parser behavior consistent for the affected `de-DE`, `es-ES`, and `pt-PT` tenant configurations.
- Verify an ambiguous date such as 6 January remains 6 January when entered according to the displayed hint, and verify a date whose day is greater than 12.
- Verify the configured tenant convention remains consistent under an `en-US` browser preference.
- Verify the booking-v2 hint remains `DD/MM/YYYY` and this change does not alter its input path; keep its existing shared-parser defect tracked separately.
- Keep the 33 report IDs separately traceable from the shared-parser issue; do not mark this issue resolved solely because the shared parser changed.

## Source references

Paths are relative to the exported `support-kb/` root:

- `src/lib/data/reports-4471.json`: exact evidence and report membership.
- `src/lib/kb/causes.ts`: `DATE_HINT`, `dayFirst`, `causeOf`, `uniqueById`, `groupByCause`.
- `src/lib/kb/locales.ts`: tenant lookup; browser metadata is not the source of tenant locale.
- `src/lib/data/tenants/alder.physio.json`, `copper.studio.json`, `pale.harbour.json`: day-first locale and booking-v3 configuration.
- `src/lib/kb/CauseTable.svelte`: computed split and missing-ticket warning.

Computed membership and source hashes are retained in the local review artifact `analysis.json`.
