import { agenda, juntar } from '../lib/gira.js';

/** Calendário da Casa em formato iCalendar, para assinar no celular. Horário de São Paulo (UTC-3). */
export function GET() {
  const dobra = (l) => l.match(/.{1,73}/g).join('\r\n ');
  const esc = (t) => t.replace(/[\\,;]/g, (m) => '\\' + m);
  const ev = agenda.giras.map((g) => {
    const linhas = juntar(g.linhas);
    const [a, m, d] = g.data.split('-');
    const ini = `${a}${m}${d}T220000Z`;
    const fim = new Date(Date.UTC(+a, +m - 1, +d + 1)).toISOString().slice(0, 10).replaceAll('-', '') + 'T010000Z';
    const titulo = g.festa ?? `Gira de ${linhas}`;
    return [
      'BEGIN:VEVENT',
      `UID:gira-${g.data}@casapaioxala`,
      `DTSTAMP:${a}0101T000000Z`,
      `DTSTART:${ini}`,
      `DTEND:${fim}`,
      dobra(`SUMMARY:${esc(titulo + ' · Casa de Umbanda Pai Oxalá')}`),
      dobra(`DESCRIPTION:${esc(`Linha de ${linhas}. Atendimento com ${g.atende}. Gira aberta à assistência às ${agenda.horarios.gira}. Solicite o endereço à Casa antes da visita.`)}`),
      'LOCATION:Embu-Guaçu\\, SP',
      'END:VEVENT',
    ].join('\r\n');
  });
  const corpo = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Casa de Umbanda Pai Oxala//Agenda//PT', 'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Casa de Umbanda Pai Oxalá', 'X-WR-TIMEZONE:America/Sao_Paulo', ...ev, 'END:VCALENDAR'].join('\r\n') + '\r\n';
  return new Response(corpo, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
}
