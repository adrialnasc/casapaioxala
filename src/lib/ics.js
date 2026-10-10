/** Monta um arquivo iCalendar. Cada evento: { uid, inicio, fim, titulo, descricao } com horários já em UTC. */
export function calendario(nome, eventos) {
  const dobra = (l) => l.match(/.{1,73}/g).join('\r\n ');
  const esc = (t) => t.replace(/[\\,;]/g, (m) => '\\' + m);
  const ev = eventos.map((e) => [
    'BEGIN:VEVENT',
    `UID:${e.uid}@casapaioxala`,
    'DTSTAMP:20260101T000000Z',
    `DTSTART:${e.inicio}`,
    `DTEND:${e.fim}`,
    dobra(`SUMMARY:${esc(e.titulo)}`),
    dobra(`DESCRIPTION:${esc(e.descricao)}`),
    'LOCATION:Embu-Guaçu\\, SP',
    'END:VEVENT',
  ].join('\r\n'));
  const corpo = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Casa de Umbanda Pai Oxala//Agenda//PT', 'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${nome}`, 'X-WR-TIMEZONE:America/Sao_Paulo', ...ev, 'END:VCALENDAR'].join('\r\n') + '\r\n';
  return new Response(corpo, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
}
