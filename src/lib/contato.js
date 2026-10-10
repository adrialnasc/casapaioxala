import site from '../data/site.json';

const L = site.links;

/** Principal canal de contato do site.
 *  Com WhatsApp direto: "Falar com a Casa". Sem ele, o convite do grupo da Casa, identificado como grupo.
 *  O endereço nunca vai para o site: é passado no grupo (ou no WhatsApp direto, quando existir). */
export const contato = L.whatsapp
  ? { href: L.whatsapp, rotulo: 'Falar com a Casa', externo: true, grupo: false }
  : L.comunidade
    ? { href: L.comunidade, rotulo: 'Entrar no grupo da Casa', externo: true, grupo: true }
    : { href: '/primeira-vez/#contato', rotulo: 'Falar com a Casa', externo: false, grupo: false };

/** Como pedir o endereço, em uma frase. */
export const comoPedirEndereco = contato.grupo
  ? 'O endereço é passado no grupo da Casa no WhatsApp, antes da visita.'
  : 'O endereço é passado pela Casa por mensagem, antes da visita.';
