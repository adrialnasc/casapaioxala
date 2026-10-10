import { agenda, juntar, nomeEvento, utc } from '../lib/gira.js';
import { comoPedirEndereco } from '../lib/contato.js';
import { calendario } from '../lib/ics.js';

/** Calendário público da Casa: só a gira, aberta à assistência. Fim às 22h é estimativa. */
export function GET() {
  const H = agenda.horarios;
  return calendario('Casa de Umbanda Pai Oxalá', agenda.giras.map((g) => ({
    uid: `gira-${g.data}`,
    inicio: utc(g.data, H.gira),
    fim: utc(g.data, '22h'),
    titulo: `${nomeEvento(g)} · Casa de Umbanda Pai Oxalá`,
    descricao: `Linha de ${juntar(g.linhas)}. Gira aberta à assistência às ${H.gira}. ${comoPedirEndereco}`,
  })));
}
