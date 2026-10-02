import agenda from '../data/agenda.json';

export const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

/** Junta nomes: ["Ogum","Exu"] -> "Ogum e Exu" */
export const juntar = (l) => l.length < 2 ? (l[0] ?? '') : l.slice(0, -1).join(', ') + ' e ' + l.at(-1);

/** Próxima gira a partir de hoje (inclui a de hoje). */
export function proximaGira(hoje = new Date()) {
  const ref = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const g = agenda.giras.find((x) => new Date(x.data + 'T00:00:00') >= ref);
  return g ? descrever(g) : null;
}

export function descrever(g) {
  const d = new Date(g.data + 'T00:00:00');
  const linhas = juntar(g.linhas);
  return {
    ...g,
    dia: String(d.getDate()).padStart(2, '0'),
    mes: MESES[d.getMonth()],
    ano: d.getFullYear(),
    semana: DIAS[d.getDay()],
    hora: agenda.horarios.gira,
    titulo: g.festa ?? `Gira de ${linhas}`,
    resumo: `Linha de ${linhas}. Atendimento com ${g.atende}. Gira aberta à assistência às ${agenda.horarios.gira}.`,
    calendario: linkCalendario(g, linhas),
  };
}

/** Link do Google Agenda. Duração de 3h é uma estimativa: confirmar com a Casa. */
function linkCalendario(g, linhas) {
  const [a, m, d] = g.data.split('-');
  const ini = `${a}${m}${d}T220000Z`; // 19h em São Paulo (UTC-3)
  const fimData = new Date(Date.UTC(+a, +m - 1, +d + 1));
  const fim = fimData.toISOString().slice(0, 10).replaceAll('-', '') + 'T010000Z';
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${g.festa ?? 'Gira de ' + linhas} · Casa de Umbanda Pai Oxalá`,
    dates: `${ini}/${fim}`,
    details: 'Gira aberta à assistência. Solicite o endereço à Casa antes da visita.',
    location: 'Embu-Guaçu, SP',
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export { agenda };
