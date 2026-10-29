<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import links from '#lib/data/issue-links.json';
  import { groupByCause, causeOf, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const merged = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const parser = groups.find(g => g.cause === 'parser')!;
  const hint = groups.find(g => g.cause === 'hint')!;
  const anomalous = merged.filter(r => notes.oneDayMove.includes(r.id));
  const mismatch = merged.filter(r => causeOf(r, tenantOf(r)) !== r.meta.intakeTag).length;
  const chronological = (a: string, b: string) => Date.parse(a) - Date.parse(b);
  const firstReceived = merged.map(r => r.receivedAt).sort(chronological)[0];
  const firstMerged = merged.flatMap(r => r.mergedAt ? [r.mergedAt] : []).sort(chronological)[0];
  const mergeDay = firstMerged.slice(0, 10);
  const arrivedBeforeMergeDay = merged.filter(r => r.receivedAt.slice(0, 10) < mergeDay).length;
  const mergedOnFirstDay = merged.filter(r => r.mergedAt?.startsWith(mergeDay)).length;
  const maxWaitMinutes = Math.max(...merged.filter(r => r.mergedAt).map(r => (Date.parse(r.mergedAt!) - Date.parse(r.receivedAt)) / 60000));
  const day = (iso: string) => iso.slice(0, 10);
</script>

<p><strong>{merged.length} unique reports</strong> remain the full population. The export contains {reports.length} rows;
  {reports.length - uniqueById(reports as Report[]).length} are repeated IDs from overlapping pages.</p>

<table>
  <thead><tr><th>Work item</th><th>Reports</th><th>Scope and evidence</th><th>Ticket</th></tr></thead>
  <tbody>
    <tr><td>Shared parser: month/day inversion</td><td>{parser.reports.length}</td><td>Tenant day-first locale; app/email or booking-v2 form. Includes the timing investigation below.</td><td>{#if links.parser}<a href={links.parser}>Parser issue</a>{:else}Draft prepared{/if}</td></tr>
    <tr><td>booking-v3: conflicting date hint</td><td>{hint.reports.length}</td><td>Day-first tenant; form channel; hint asks for MM/DD/YYYY but the form reads tenant order.</td><td>{#if links.hint}<a href={links.hint}>Hint issue</a>{:else}Draft prepared{/if}</td></tr>
    <tr><td>Timing investigation within parser issue</td><td>{anomalous.length}, already within parser</td><td>Desk-note subset. One-day shifts and an invite reported before booking; root cause unproven.</td><td>{#if links.timing}<a href={links.timing}>Parser investigation section</a>{:else}Draft prepared{/if}</td></tr>
  </tbody>
</table>

<p>The classifier partitions the population as {parser.reports.length} + {hint.reports.length} = {merged.length}.
  The investigation is overlapping coverage, not another {anomalous.length} reports to add.
  {parser.reports.length - anomalous.length} parser-classified reports are outside that noted subset.
  These are classification counts, not proof that every report shares a verified root cause.</p>
<p>Intake tags disagree with the tenant-based classifier for <strong>{mismatch}</strong> reports.
  Use the tenant directory, form version and channel; do not count causes from browser locale or intake tags.</p>

<h2>Timing reports that need investigation</h2>
<p>Capture original and displayed timestamps, timezone, locale, event identifiers and booking/send logs before assigning a cause.
  The desk's one-day label is not independently proved by each report body.</p>
{#each anomalous as report (report.id)}
  <details>
    <summary><code>{report.id}</code> · {report.tenant} · received {day(report.receivedAt)}</summary>
    <blockquote>{report.body}</blockquote>
    <p>Channel: {report.channel}. Currently classified as {causeOf(report, tenantOf(report))}; intake tag: {report.meta.intakeTag}.</p>
  </details>
{/each}

<h2>Arrival and merge are different events</h2>
<p>The first report arrived {day(firstReceived)}. The first merge occurred {day(firstMerged)}.
  {arrivedBeforeMergeDay} reports arrived before the first merge day; {mergedOnFirstDay} were merged on that day.
  The longest recorded wait to merge was {Math.floor(maxWaitMinutes / 1440)} days,
  {Math.floor(maxWaitMinutes % 1440 / 60)} hours and {maxWaitMinutes % 60} minutes.
  This shows a delay before merging; it does not establish when investigation began.</p>

<style>
  details { border-top: 1px solid var(--line); padding: 0.6rem 0; }
  summary { cursor: pointer; }
  blockquote { margin: 0.5rem 0 0.5rem 1rem; border-left: 3px solid var(--line); padding-left: 1rem; }
  td { vertical-align: top; }
</style>
