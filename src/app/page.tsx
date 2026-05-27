const metrics = [
  { label: 'Participants', value: '200', delta: '100 app / 100 control' },
  { label: 'Avg execution', value: '4.3s', delta: '-68% vs control' },
  { label: 'Portfolio alpha', value: '+2.1%', delta: '8 week study' },
  { label: 'SUS score', value: '82', delta: 'Week 2 sample' },
];

const researchRows = [
  ['APP', '4.3s', '+6.6%', '0.18', '82'],
  ['CONTROL', '13.5s', '+4.2%', '0.27', '74'],
];

const events = [
  'trade_initiation_time',
  'order_confirmation_time',
  'execution_latency_ms',
  'chart_view_duration_ms',
  'indicators_used',
];

async function getBackendSnapshot() {
  const baseUrl =
    process.env.BACKEND_URL ?? 'https://tradeiq-backend-v0du.onrender.com';

  try {
    const [healthResponse, exportResponse] = await Promise.all([
      fetch(`${baseUrl}/health`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/research/export`, { cache: 'no-store' }),
    ]);

    return {
      online: healthResponse.ok,
      service: healthResponse.ok
        ? ((await healthResponse.json()) as { service?: string }).service ??
          'tradeiq-backend'
        : 'unavailable',
      exportReady: exportResponse.ok,
    };
  } catch {
    return {
      online: false,
      service: 'unavailable',
      exportReady: false,
    };
  }
}

export default async function Home() {
  const backend = await getBackendSnapshot();

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">TQ</div>
          <div>
            <strong>TradeIQ</strong>
            <span>Research Admin</span>
          </div>
        </div>
        <nav>
          {['Overview', 'Participants', 'Orders', 'Portfolio', 'Exports'].map(
            item => (
              <a key={item} href={`#${item.toLowerCase()}`}>
                {item}
              </a>
            ),
          )}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>STOCK TRADING STUDY</p>
            <h1>Mobile trading and portfolio dashboard</h1>
          </div>
          <a
            className="exportButton"
            href="https://tradeiq-backend-v0du.onrender.com/api/admin/research/export"
          >
            Export CSV
          </a>
        </header>

        <section className="connectionPanel" aria-label="Backend connection">
          <span className={backend.online ? 'statusDot online' : 'statusDot'} />
          <strong>{backend.online ? 'Backend connected' : 'Backend offline'}</strong>
          <span>{backend.service}</span>
          <span>{backend.exportReady ? 'CSV export ready' : 'CSV export unavailable'}</span>
        </section>

        <section className="metricGrid" aria-label="Research metrics">
          {metrics.map(metric => (
            <article className="metricCard" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.delta}</small>
            </article>
          ))}
        </section>

        <section className="panelGrid">
          <article className="panel wide" id="overview">
            <div className="panelHeader">
              <h2>Group Comparison</h2>
              <span>Primary outcomes</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Execution</th>
                  <th>Return</th>
                  <th>HHI</th>
                  <th>SUS</th>
                </tr>
              </thead>
              <tbody>
                {researchRows.map(row => (
                  <tr key={row[0]}>
                    {row.map(cell => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="panel">
            <div className="panelHeader">
              <h2>Event Capture</h2>
              <span>Mobile app telemetry</span>
            </div>
            <div className="eventList">
              {events.map(event => (
                <span key={event}>{event}</span>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panelHeader">
              <h2>API Services</h2>
              <span>Backend scope</span>
            </div>
            <div className="serviceList">
              {['Auth', 'Markets', 'Orders', 'Portfolio', 'Research'].map(
                service => (
                  <div key={service}>
                    <strong>{service}</strong>
                    <span>
                      {backend.online
                        ? 'Connected through backend API'
                        : 'Waiting for backend API'}
                    </span>
                  </div>
                ),
              )}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
