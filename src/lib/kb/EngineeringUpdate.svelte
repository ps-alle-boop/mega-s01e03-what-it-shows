<script>
  import update from '#lib/data/engineering-update.json';
  import links from '#lib/data/issue-links.json';
</script>

<p>The <a href={update.source}>course engineering update</a>, read on {update.observedOn}, says
  #{update.ticket} closed on {update.closedOn}.</p>
<table>
  <thead><tr><th>Problem</th><th>Desk outcome</th><th>Reason</th></tr></thead>
  <tbody>
    <tr><td><a href={links.parser}>Shared parser</a></td><td>{update.parser.status}</td><td>{update.parser.note}</td></tr>
    <tr><td><a href={links.hint}>booking-v3 hint</a></td><td>{update.hint.status}</td><td>{update.hint.note}</td></tr>
  </tbody>
</table>
<p>Retirement is not a fix to the form hint. The parser ticket is closed as completed; the hint ticket is
  closed as not planned. These dispositions come from the desk update, not from a production test by this review.</p>
