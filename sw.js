/* ============================================================
   Service worker — o guia tem que abrir sem rede.

   Estratégia:
     - precache de todo o app na instalação (é estático e pequeno);
     - navegação: rede primeiro com timeout curto, cai no cache;
     - demais arquivos: cache primeiro (o conteúdo só muda quando
       a versão do SW muda, e aí o precache é refeito).
   Suba VERSAO a cada alteração de conteúdo ou código.
   ============================================================ */
const VERSAO = 'plantao-v42';
const ESSENCIAL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.png',
  './css/fontes.css',
  './css/style.css',
  './js/icones.js',
  './js/dados.js',
  './js/subpastas.js',
  './js/queixas.js',
  './js/ferramentas-dados.js',
  './js/scores-dados.js',
  './js/pediatria-dados.js',
  './js/ferramentas.js',
  './js/eletrolitos.js',
  './js/app.js',
  './js/ui.js',
  './fontes-web/inter-latin.woff2',
  './fontes-web/inter-latin-ext.woff2',
  './fontes-web/jetbrainsmono-latin.woff2',
  './fontes-web/jetbrainsmono-latin-ext.woff2',
  './icones/icone.svg',
  './icones/icone-192.png',
  './icones/icone-512.png',
  './icones/icone-180.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSAO)
      .then(function (c) { return c.addAll(ESSENCIAL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (nomes) {
        return Promise.all(nomes.filter(function (n) { return n !== VERSAO; })
                                .map(function (n) { return caches.delete(n); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('message', function (e) {
  if (e.data === 'pular-espera') self.skipWaiting();
});

function daRede(req, ms) {
  return new Promise(function (ok, falha) {
    var t = setTimeout(function () { falha(new Error('timeout')); }, ms);
    fetch(req).then(function (r) { clearTimeout(t); ok(r); },
                    function (err) { clearTimeout(t); falha(err); });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   /* nada de terceiros */

  /* navegação: tenta rede rápido, senão entrega a casca do cache */
  if (req.mode === 'navigate') {
    e.respondWith(
      daRede(req, 2500)
        .then(function (r) {
          var copia = r.clone();
          caches.open(VERSAO).then(function (c) { c.put('./index.html', copia); });
          return r;
        })
        .catch(function () {
          return caches.match('./index.html').then(function (r) {
            return r || caches.match('./');
          });
        })
    );
    return;
  }

  /* resto: cache primeiro */
  e.respondWith(
    caches.match(req).then(function (achou) {
      if (achou) return achou;
      return fetch(req).then(function (r) {
        if (r && r.status === 200 && r.type === 'basic') {
          var copia = r.clone();
          caches.open(VERSAO).then(function (c) { c.put(req, copia); });
        }
        return r;
      });
    })
  );
});
