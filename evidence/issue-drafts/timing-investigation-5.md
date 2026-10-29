# Investigate five one-day and timing anomalies filed under the parser issue

Snapshot: **2026-10-04**. Investigation only: **root cause unknown**. These five report IDs are listed in `desk-notes.json` under `oneDayMove` and are already included in the canonical **379 parser reports**. They are not additional to the **412 unique reports** split as parser 379 plus hint 33. They may represent one cause, several causes, or a mix of incorrect behavior and misunderstood date/time semantics.

## Observed evidence

| Report | Tenant; channel | Received | Merged into #4471 |
|---|---|---|---|
| R-41202 | Kettle Books (`nl-NL`); email | `2026-04-02T10:41:00+02:00` | `2026-07-02T09:06:00+02:00` |
| R-41209 | Alder Physio (`de-DE`); app | `2026-04-06T15:18:00+02:00` | `2026-07-02T09:19:00+02:00` |
| R-41236 | Nine Lanterns (`pl-PL`); app | `2026-04-20T11:52:00+02:00` | `2026-07-02T10:08:00+02:00` |
| R-41344 | Pale Harbour (`pt-PT`); email | `2026-06-12T09:58:00+01:00` | `2026-07-02T13:35:00+02:00` |
| R-41620 | Lantern Row (`cs-CZ`); email | `2026-10-04T21:49:00+02:00` | `2026-10-04T21:58:00+02:00` |

Exact report bodies:

- **R-41202:** “Invite says Tuesday 12 May. Calendar says Monday 11 May. My client turned up on the Monday. We had coffee.”
- **R-41209:** “Every booking in June is one day off. Only June. Why only June.”
- **R-41236:** “The invite arrived before I made the booking. I would like to know how.”
- **R-41344:** “Client in Lisbon got Tuesday. Client in Toronto got Monday. Same meeting. We held it twice.”
- **R-41620:** “Tuesday 6 October showed as Monday. I moved it myself. I have stopped reporting these but my colleague says it helps you.”

These bodies do not establish a month/day swap. R-41236 does not itself state a one-day difference; the grouping comes from the desk note. `causes.ts` assigns all five to `parser` from tenant locale and channel, without reading their body or event data. That classification is not causal confirmation.

## Investigation and reproduction hypotheses

No product reproduction was executed. The export contains report and merge timestamps, but not the affected event's raw input, timezone, stored timestamp, invite payload, or rendered output. Report timestamps must not be substituted for event timestamps.

For each report, obtain or recover the event data needed to compare the submitted date, stored date/time, timezone, invite content, and recipient rendering. Then test hypotheses against that evidence:

- **R-41202 / R-41620:** date-only values may be crossing a timezone boundary or being interpreted inconsistently between invite and calendar. This is unproven.
- **R-41209:** investigate the asserted June-only scope. A month-limited symptom alone does not establish daylight-saving behavior.
- **R-41236:** compare booking creation, invite scheduling and dispatch, and the reporter's display timezone. The text alone does not prove an invite was dispatched before creation.
- **R-41344:** compare the same event in Lisbon and Toronto with the actual event date, time, and zone. A correct instant can fall on different local days; determine whether this event was meant to represent an instant or a shared calendar date before calling the display wrong.

## Desired behavior

Calendar dates and times follow the product's documented event semantics consistently through booking, storage, invitation, and rendering. The desk keeps unexplained timing symptoms visible and does not close them as duplicates based only on subject, locale, or a parser fix.

## Acceptance criteria

- Record a disposition for each of the five IDs, with recovered evidence or the specific missing evidence that prevents a conclusion.
- For any reproduced defect, attach raw input, relevant timezone/offset, stored value, invite output, expected behavior, actual behavior, and reproducible steps.
- Determine whether the reports share a cause. Split confirmed independent defects into linked issues; do not assume one fix covers all five.
- For cross-zone cases, state whether the event represents a calendar date or a fixed instant and evaluate local-day differences accordingly.
- Keep membership transparent: these five remain a subset of parser 379 unless evidence supports reclassification. If reclassified, update the source membership and totals without double counting.
- Do not close any of these reports solely on the shared-parser or booking-v3 hint fix; require evidence tied to the report's symptom or explicitly document why no defect is established.

## Arrival and merge chronology

Across all 412 unique reports, the first report arrived on **1 April 2026**. The first recorded merge into #4471 was **2 July 2026**. There were **183 reports received before 2 July**, and **184 merged on 2 July**. R-41200 waited **91 days, 22 hours, 51 minutes** between receipt and merge. The first four anomalies above joined that 2 July batch; R-41620 was merged nine minutes after receipt on 4 October.

The export supports “reports accumulated from April and were later merged into one ticket.” It does not establish when staff first investigated them. The existing page's “known” status and one-fix narrative do not resolve the anomalous bodies.

## Source references

Paths are relative to the exported `support-kb/` root:

- `src/lib/data/desk-notes.json`: explicit five-ID `oneDayMove` list.
- `src/lib/data/reports-4471.json`: exact bodies, tenant/channel fields, receipt and merge timestamps.
- `src/lib/kb/causes.ts`: classifier uses tenant locale/channel, not reported symptoms.
- `src/lib/kb/CauseTable.svelte`: footnotes these five under the parser group.
- `src/lib/kb/QueueTimeline.svelte`: distinguishes report arrival from merge time.
- `src/routes/kb/incidents/4471/+page.svx`: narrative to qualify with the exported evidence.

Computed membership, full anomaly records, chronology, and source hashes are retained in the local review artifact `analysis.json`.
