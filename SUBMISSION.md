# MEGA.dev S01E03 — what it shows

The review separates the merged ticket's parser and form-hint defects and preserves five unresolved timing reports as an investigation within the parser issue.

| Issue | Reports covered |
|---|---:|
| [Shared parser](https://github.com/ps-alle-boop/mega-s01e03-what-it-shows/issues/1) | 379 |
| [Booking-v3 date hint](https://github.com/ps-alle-boop/mega-s01e03-what-it-shows/issues/2) | 33 |

The parser issue also contains the investigation of five timing reports already included in its 379. Former issue #3 is closed as overlapping coverage.

The total is 412 unique reports. The investigation does not add reports to that total.

The course engineering update says #4471 closed on 5 October 2026. The parser was **fixed**
(`fix(dates): parse dd/mm for eu locales`); the hint was **won't fix** because booking-v3 was
retired. Issue #1 is closed as completed and issue #2 as not planned. The rendered review records these distinct outcomes.

- [Signed incident review source](src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered incident review](rendered/kb/incidents/4471-review/index.html)
- [Signed proposed decision 0002](src/routes/kb/decisions/0002-evidence-before-merge/+page.svx)
- [Rendered decision 0002](rendered/kb/decisions/0002-evidence-before-merge/index.html)
- [Exact membership, evidence and source hashes](evidence/analysis.json)
- [Build and local preview instructions](BUILDING.md)

The pages' desk reference is computed from their frontmatter signature by the supplied RenderStamp component.
Original accepted decision 0001 remains intact. Decision 0002 remains proposed until accepted by the desk.
