import agenda from '../data/agenda.json';

export const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
export const MESES_CURTOS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

/** Junta nomes: ["Ogum","Exu"] -> "Ogum e Exu" */
export const juntar = (l) => l.length < 2 ? (l[0] ?? '') : l.slice(0, -1).join(', ') + ' e ' + l.at(-1);

/** Data de hoje (AAAA-MM-DD) no fuso da Casa, em São Paulo, para qualquer visitante do mundo.
 *  Assim a gira só vira "já aconteceu" quando o dia termina no Brasil. */
export function hojeNaCasa(agora = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(agora);
}

/** A data (AAAA-MM-DD) já passou? A gira de hoje ainda conta como próxima. */
export const jaPassou = (iso, agora = new Date()) => iso < hojeNaCasa(agora);

/** Próxima gira a partir de hoje (inclui a de hoje). */
export function proximaGira(agora = new Date()) {
  const hoje = hojeNaCasa(agora);
  const g = [...agenda.giras].sort((a, b) => a.data.localeCompare(b.data)).find((x) => x.data >= hoje);
  return g ? descrever(g) : null;
}

export function descrever(g) {
  const d = new Date(g.data + 'T00:00:00');
  const linhas = juntar(g.linhas);
  return {
    ...g,
    dia: String(d.getDate()).padStart(2, '0'),
    mesCurto: MESES_CURTOS[d.getMonth()],
    mesNum: d.getMonth(),
    mes: MESES[d.getMonth()],
    ano: d.getFullYear(),
    semana: DIAS[d.getDay()],
    hora: agenda.horarios.gira,
    titulo: g.festa ?? `Gira de ${linhas}`,
    // Mesmo modelo da Agenda: título = quem atende; linhas (e festa) no texto de apoio.
    resumo: `${g.festa ? g.festa + '. ' : ''}Linha de ${linhas}. Gira aberta à assistência às ${agenda.horarios.gira}.`,
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

/** Todas as giras do ano, já descritas. */
export const todasGiras = () => agenda.giras.map(descrever);

/** Data por extenso: "Sexta, 9 de outubro" */
export const porExtenso = (g) => `${g.semana}, ${Number(g.dia)} de ${g.mes.toLowerCase()}`;

export { agenda };
