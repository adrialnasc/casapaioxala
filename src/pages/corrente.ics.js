import { agenda, juntar, nomeEvento, utc } from '../lib/gira.js';
import { calendario } from '../lib/ics.js';

/** Calendário da corrente: estudo mediúnico (só médiuns) e gira, em eventos separados. Fim da gira às 22h é estimativa. */
export function GET() {
  const H = agenda.horarios;
  const [ini, fim] = H.estudo.split(' às ');
  return calendario('Corrente · Casa Pai Oxalá', agenda.giras.flatMap((g) => [
    {
      uid: `estudo-${g.data}`,
      inicio: utc(g.data, ini),
      fim: utc(g.data, fim),
      titulo: 'Estudo mediúnico · Corrente Pai Oxalá',
      descricao: `Só para médiuns. Chegada às ${H.chegadaMediuns}. Estudo das ${H.estudo}.`,
    },
    {
      uid: `corrente-gira-${g.data}`,
      inicio: utc(g.data, H.gira),
      fim: utc(g.data, '22h'),
      titulo: `${nomeEvento(g)} · Corrente Pai Oxalá`,
      descricao: `Linha de ${juntar(g.linhas)}. Gira às ${H.gira}.`,
    },
  ]));
}
