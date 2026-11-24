import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (name) => readFile(new URL(name, root), 'utf8');
const write = (name, value) => writeFile(new URL(name, root), value);
const origin = 'https://hugoliveirapsicologo.com.br';
const socialImage = origin + '/assets/compartilhamento-hugo.jpg';
const socialAlt = 'Retrato e marca de Hugo Oliveira, psicólogo em Castanhal – PA';
const generated = '<!-- Gerado por scripts/gerar-publicacoes.mjs. -->';
const listDescription = 'Textos de Hugo Oliveira, psicólogo, sobre Psicanálise, vínculos e sofrimento emocional.';
const formatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' });

const escape = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

const articles = JSON.parse((await read('scripts/publicacoes.json')).replace(/^\uFEFF/, ''));
const seen = new Set();
for (const item of articles) {
  const { slug, titulo, resumo, data, paragrafos } = item;
  const date = new Date(data);
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || seen.has(slug) ||
      ![titulo, resumo].every((text) => typeof text === 'string' && text.trim()) ||
      typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data) ||
      !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== data ||
      !Array.isArray(paragrafos) || !paragrafos.length ||
      paragrafos.some((text) => typeof text !== 'string' || !text.trim())) {
    throw new Error('Publicação inválida ou duplicada: ' + slug);
  }
  seen.add(slug);
}
articles.sort((a, b) => b.data.localeCompare(a.data) || a.slug.localeCompare(b.slug));
const articlePath = (item) => '/publicacoes/' + item.slug;
const dateLabel = (data) => '<time datetime="' + data + '">' + formatter.format(new Date(data)) + '</time>';

function page({ title, description, path, body, article }) {
  const url = origin + path;
  const fullTitle = escape(title + ' | Hugo Oliveira Psicólogo');
  const desc = escape(description);
  const schema = article ? {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: title, description, datePublished: article.data, inLanguage: 'pt-BR',
    author: { '@type': 'Person', name: 'Hugo Oliveira', url: origin + '/#sobre' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  } : null;
  const structuredData = schema
    ? '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>' : '';
  return `<!doctype html>
${generated}
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}">
  <meta name="theme-color" content="#2f6f80">
  <link rel="canonical" href="${url}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:type" content="${article ? 'article' : 'website'}">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${socialAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${socialImage}">
  <meta name="twitter:image:alt" content="${socialAlt}">
${structuredData}
  <link rel="icon" href="/assets/logo-mark.webp" type="image/webp">
  <link rel="stylesheet" href="/assets/fonts/fonts.css">
  <link rel="stylesheet" href="/assets/v2.css">
${article ? '<script src="/assets/publicacoes.js" defer></script>' : ''}
</head>
<body class="publication-page">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header home-header">
    <div class="container nav">
      <a class="brand brand-text" href="/" aria-label="Hugo Oliveira, psicólogo — início">
        <img src="/assets/logo-mark.webp" alt="" width="256" height="256">
        <span><strong>Hugo Oliveira</strong><small>PSICÓLOGO</small></span>
      </a>
      <a class="publication-home" href="/">Página inicial</a>
    </div>
  </header>
  <main class="container publication-main" id="conteudo">
    ${body}
  </main>
  <footer class="footer publication-footer">
    <div class="container">
      <a href="/#contato">Contato</a>
      <a href="https://www.instagram.com/hugoliveirapsi/">Instagram</a>
      <a href="/politica-de-privacidade.html">Política de Privacidade</a>
    </div>
  </footer>
</body>
</html>
`;
}

function listing(items, headingTag) {
  if (!items.length) return '<p>As primeiras publicações serão disponibilizadas aqui.</p>';
  return `<div class="publication-list">
  ${items.map((item) => `<article class="publication-entry">
    ${dateLabel(item.data)}
    <${headingTag}>${escape(item.titulo)}</${headingTag}>
    <p>${escape(item.resumo)}</p>
    <a class="btn btn-outline" href="${articlePath(item)}" aria-label="Ler publicação: ${escape(item.titulo)}">Ler publicação</a>
  </article>`).join('\n')}
  </div>`;
}

await write('publicacoes.html', page({
  title: 'Publicações', description: listDescription, path: '/publicacoes',
  body: '<h1>Publicações</h1><p>' + escape(listDescription) + '</p>' + listing(articles, 'h2'),
}));

await mkdir(new URL('publicacoes/', root), { recursive: true });
for (const file of await readdir(new URL('publicacoes/', root))) {
  if (file.endsWith('.html') && !seen.has(file.slice(0, -5)) &&
      (await read('publicacoes/' + file)).includes(generated)) {
    await unlink(new URL('publicacoes/' + file, root));
  }
}
for (const article of articles) {
  const path = articlePath(article);
  const body = `<a class="publication-back" href="/publicacoes">← Voltar às publicações</a>
  <article class="publication-article">
    <h1>${escape(article.titulo)}</h1>
    <p class="publication-byline">Hugo Oliveira<br>Psicólogo · CRP 02/26602<br>${dateLabel(article.data)}</p>
    <div class="publication-text">${article.paragrafos.map((text) => '<p>' + escape(text) + '</p>').join('\n')}</div>
    <div class="publication-share" hidden>
      <button class="btn btn-outline" type="button" data-share hidden>Compartilhar</button>
      <button class="btn btn-outline" type="button" data-copy-link>Copiar link</button>
      <input aria-label="Link da publicação" value="${origin + path}" readonly hidden data-share-url>
      <span role="status" data-share-status></span>
    </div>
  </article>
  <aside class="publication-cta" aria-label="Contato">
    <a class="btn btn-primary" href="https://calendar.app.google/Kig3jaQkufHSZWHf6">Agendar consulta</a>
    <a href="https://www.instagram.com/hugoliveirapsi/">@hugoliveirapsi</a>
  </aside>`;
  await write(path.slice(1) + '.html', page({
    title: article.titulo, description: article.resumo, path, body, article,
  }));
}

async function replaceSection(file, content) {
  const html = await read(file);
  const marker = /(<!-- publicacoes:inicio -->)[\s\S]*?(<!-- publicacoes:fim -->)/;
  if (!marker.test(html)) throw new Error('Marcador ausente em ' + file);
  await write(file, html.replace(marker, (_, start, end) => start + '\n' + content + '\n  ' + end));
}
await replaceSection('index.html', `  <section class="section home-publications" aria-labelledby="titulo-publicacoes">
    <div class="container publication-main">
      <h2 id="titulo-publicacoes">Publicações</h2>
      ${articles.length ? listing(articles.slice(0, 3), 'h3') : '<p>Textos autorais de Hugo Oliveira.</p>'}
      <a class="btn btn-outline" href="/publicacoes">Ver publicações</a>
    </div>
  </section>`);
await replaceSection('sitemap.xml', ['/publicacoes', ...articles.map(articlePath)]
  .map((path) => '  <url><loc>' + origin + path + '</loc></url>').join('\n'));
