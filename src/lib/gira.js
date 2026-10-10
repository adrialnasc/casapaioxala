import agenda from '../data/agenda.json';
import { comoPedirEndereco } from './contato.js';

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
    calendarioCorrente: linkCalendario(g, linhas, true),
  };
}

/** Nome do evento salvo no calendário: o mesmo que a página mostra (quem atende). A festa vem antes, quando houver. */
export const nomeEvento = (g) => `${g.festa ? g.festa + ' · ' : 'Gira · '}atende ${g.atende}`;

/** Horário "18h" ou "18h45" em UTC (São Paulo é UTC-3), no formato do iCalendar. Passa da meia-noite quando precisa. */
export function utc(data, hora) {
  const [a, m, d] = data.split('-').map(Number);
  const [h, min = '0'] = hora.replace('h', ':').split(':');
  const t = new Date(Date.UTC(a, m - 1, d, Number(h) + 3, Number(min || 0)));
  return t.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
}

/** Duração da gira: 3h é uma estimativa (fim às 22h). Confirmar com a Casa. */
const FIM_GIRA = '22h';

/** Link do Google Agenda. Na versão da corrente, o evento começa no estudo mediúnico. */
function linkCalendario(g, linhas, corrente = false) {
  const H = agenda.horarios;
  const inicio = corrente ? H.estudo.split(' ')[0] : H.gira;
  const detalhes = corrente
    ? `Chegada dos médiuns às ${H.chegadaMediuns}. Estudo mediúnico das ${H.estudo}. Gira às ${H.gira}. Linha de ${linhas}.`
    : `Gira aberta à assistência às ${H.gira}. Linha de ${linhas}. ${comoPedirEndereco}`;
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${corrente ? 'Corrente · ' : ''}${nomeEvento(g)} · Casa de Umbanda Pai Oxalá`,
    dates: `${utc(g.data, inicio)}/${utc(g.data, FIM_GIRA)}`,
    details: detalhes,
    location: 'Embu-Guaçu, SP',
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

/** Todas as giras do ano, já descritas. */
export const todasGiras = () => agenda.giras.map(descrever);

/** Data por extenso: "Sexta, 9 de outubro" */
export const porExtenso = (g) => `${g.semana}, ${Number(g.dia)} de ${g.mes.toLowerCase()}`;

export { agenda };
