# Casa de Umbanda Pai Oxalá · site

Site estático em [Astro](https://astro.build), publicado no Netlify.

## Rodar no computador
```bash
npm install
npm run dev      # abre em http://localhost:4321
npm run build    # gera a pasta dist/
```

## Onde mexer
- **Agenda das giras:** `src/data/agenda.json` (a "Próxima gira" da home é calculada daqui).
- **Links (WhatsApp, comunidade, YouTube, Spotify):** `src/data/site.json`.
- **Cores e tipografia:** `src/styles/tokens.css` (espelha "Tema · Cores" e os estilos "Tema/…" do Figma).
- **Gravuras:** `public/gravuras/*.webp` (exportadas do Figma, fundo removido).

## Regras de conteúdo
- Nunca publicar o endereço da Casa.
- Não expor médiuns; foto da corrente só na página A Casa.
- Não inventar letras de pontos.
