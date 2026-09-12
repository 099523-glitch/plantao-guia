/* ===========================================================
   Render do documento + sumario + busca + vista isolada.
   Nao precisa editar para adicionar conteudo (ver js/dados.js).

   Duas telas:
     #cardio                -> lista de condutas da area (so os titulos)
     #cardio/sca-com-supra  -> a conduta sozinha na pagina
   =========================================================== */
(function () {
  'use strict';

  var doc   = document.getElementById('doc');
  var toc   = document.getElementById('toc');
  var side  = document.getElementById('side');
  var busca = document.getElementById('busca');

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  /* *texto* vira negrito */
  function rico(s) {
    return esc(s).replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  }
  /* mesma coisa, mas devolvendo texto puro (para copiar) */
  function cru(s) {
    return String(s == null ? '' : s).replace(/\*([^*]+)\*/g, '$1');
  }
  function normaliza(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function dois(n) { return n < 10 ? '0' + n : String(n); }
  function porCategoria(id) {
    return PROTOCOLOS.filter(function (p) { return p.categoria === id; });
  }
  /* a lista que a tela usa: no modo leitura esconde as nao preenchidas */
  function listaArea(id) { return visiveis(porCategoria(id)); }
  /* conduta "preenchida" = ja tem ficha ou secoes */
  function preenchida(p) {
    return !!((p.ficha || []).length || (p.secoes || []).length);
  }
  function progresso(lista) {
    return lista.filter(preenchida).length;
  }

  /* ---------- blocos ---------- */
  var LABEL = {
    alerta:     'Red flags',
    passos:     'Passo a passo',
    lista:      'Lista',
    naofazer:   'Não fazer',
    dica:       'Dica',
    tempo:      'Linha do tempo',
    ordem:      'Ordem',
    texto:      'Observação',
    doses:      'Medicações',
    prescricao: 'Prescrição mínima'
  };

  function itensSteps(itens) {
    return '<ul class="steps">' + (itens || []).map(function (i) {
      return '<li>' + rico(i) + '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- no do fluxograma ---------- */
  function caixa(n) {
    var cls = 'fx ' + (n.tipo || 'passo');
    return '<div class="' + cls + '">' +
      (n.rotulo ? '<span class="fx-rot">' + esc(n.rotulo) + '</span>' : '') +
      '<span class="fx-txt">' + rico(n.texto) + '</span>' +
      (n.nota ? '<span class="fx-nota">' + rico(n.nota) + '</span>' : '') +
    '</div>';
  }

  function no(n) {
    /* varias caixas lado a lado */
    if (n.tipo === 'paralelo') {
      return '<div class="fx-seta"></div><div class="fx-par">' +
        (n.colunas || []).map(caixa).join('') + '</div>';
    }
    /* pergunta que abre ramos */
    if (n.tipo === 'decisao') {
      return '<div class="fx-seta"></div>' +
        '<div class="fx decisao"><span class="fx-txt">' + rico(n.texto) + '</span></div>' +
        '<div class="fx-ramos">' + (n.ramos || []).map(function (r) {
          return '<div class="fx-ramo">' +
            '<span class="fx-chip' + (r.cor ? ' ' + esc(r.cor) : '') + '">' + rico(r.rotulo) + '</span>' +
            caixa({ tipo: r.cor === 'perigo' ? 'alerta' : 'passo', texto: r.texto, nota: r.nota }) +
          '</div>';
        }).join('') + '</div>';
    }
    /* caixa simples; a primeira nao leva seta antes */
    return (n.tipo === 'inicio' ? '' : '<div class="fx-seta"></div>') + caixa(n);
  }

  /* ---------- prescricao: uma linha ---------- */
  /* { item, via, obs, se, grupo } — `se` marca o condicional (so faz se...) */
  function linhaPresc(i, n) {
    var cond = !!i.se;
    var txt  = '<span class="presc-item">' + rico(i.item) + '</span>' +
               (i.via ? '<span class="presc-via">' + esc(i.via) + '</span>' : '');
    var pe   = '';
    if (i.se)  pe += '<span class="presc-se">SE ' + rico(i.se) + '</span>';
    if (i.obs) pe += '<span class="presc-obs">' + rico(i.obs) + '</span>';
    return '<li class="presc-linha' + (cond ? ' cond' : '') + '">' +
             '<i>' + n + '</i><div>' + txt + pe + '</div>' +
           '</li>';
  }

  function bloco(sec) {
    var t = sec.tipo;
    var titulo = sec.titulo || LABEL[t] || '';

    if (t === 'prescricao') {
      var n = 0;
      var linhas = (sec.itens || []).map(function (i) {
        if (i.grupo) return '<li class="presc-grupo">' + esc(i.grupo) + '</li>';
        n++;
        return linhaPresc(i, n);
      }).join('');
      return '<div class="presc">' +
        '<div class="presc-head"><span>' + esc(titulo) + '</span>' +
          '<button class="btn-copiar" type="button">Copiar</button></div>' +
        (sec.nota ? '<p class="presc-nota">' + rico(sec.nota) + '</p>' : '') +
        '<ol class="presc-lista">' + linhas + '</ol>' +
      '</div>';
    }

    if (t === 'doses') {
      return '<div class="spec"><div class="spec-head">' + esc(titulo) + '</div><dl>' +
        (sec.itens || []).map(function (d) {
          var linha = rico(d.dose) + (d.via ? ' &middot; <strong>' + esc(d.via) + '</strong>' : '');
          if (d.obs) linha += '<br><span class="muted">' + rico(d.obs) + '</span>';
          return '<dt>' + esc(d.droga) + '</dt><dd>' + linha + '</dd>';
        }).join('') + '</dl></div>';
    }

    if (t === 'fluxo') {
      return '<div class="fluxo-wrap"><div class="fluxo-head">' + esc(titulo) + '</div>' +
             '<div class="fluxo">' + (sec.itens || []).map(no).join('') + '</div></div>';
    }

    if (t === 'tempo') {
      return '<div class="rule cost"><span class="rlabel">' + esc(titulo) + '</span><ul class="tl">' +
        (sec.itens || []).map(function (i) {
          return '<li><b class="hr' + (i.fim ? ' fim' : '') + '">' + esc(i.quando) + '</b>' +
                 rico(i.o_que) + '</li>';
        }).join('') + '</ul></div>';
    }

    if (t === 'ordem') {
      return '<div class="rule cost"><span class="rlabel">' + esc(titulo) + '</span><ol class="rank">' +
        (sec.itens || []).map(function (i, n) {
          return '<li><i>' + (n + 1) + '</i><span>' + rico(i) + '</span></li>';
        }).join('') + '</ol></div>';
    }

    if (t === 'texto') {
      return '<div class="rule cost"><span class="rlabel">' + esc(titulo) + '</span>' +
             '<p>' + rico(sec.conteudo) + '</p></div>';
    }

    var classe = { alerta:'warn', naofazer:'cut', dica:'tip', passos:'', lista:'' }[t];
    if (classe) {
      return '<div class="rule ' + classe + '"><span class="rlabel">' + esc(titulo) + '</span>' +
             itensSteps(sec.itens) + '</div>';
    }
    /* passos e lista ficam soltos no corpo, como no manual */
    return '<h4 class="sub-head">' + esc(titulo) + '</h4>' + itensSteps(sec.itens);
  }

  /* prescricao em texto puro, para o prontuario */
  function prescTexto(p, sec) {
    var n = 0;
    var linhas = (sec.itens || []).map(function (i) {
      if (i.grupo) return '\n' + cru(i.grupo).toUpperCase();
      n++;
      var l = n + '. ' + cru(i.item) + (i.via ? ' — ' + i.via : '');
      if (i.se)  l += ' [SE ' + cru(i.se) + ']';
      if (i.obs) l += ' (' + cru(i.obs) + ')';
      return l;
    }).join('\n');
    return cru(p.titulo) + ' — ' + cru(sec.titulo || 'Prescrição mínima') + '\n' +
           (sec.nota ? cru(sec.nota) + '\n' : '') + '\n' + linhas.trim() +
           '\n\n(conferir dose, peso e alergias na diretriz vigente)';
  }


  /* ---------- indice de busca: varre a conduta INTEIRA ----------
     Sem isto, procurar "amiodarona" ou "noradrenalina" nao acha nada,
     porque a droga mora dentro de secoes.doses, nao no titulo. */
  var IGNORAR = { id:1, tipo:1, categoria:1, cor:1, fim:1, gravidade:1 };

  function coleta(v, saida) {
    if (typeof v === 'string') { saida.push(v); return; }
    if (Array.isArray(v)) { v.forEach(function (x) { coleta(x, saida); }); return; }
    if (v && typeof v === 'object') {
      Object.keys(v).forEach(function (k) { if (!IGNORAR[k]) coleta(v[k], saida); });
    }
  }

  var cacheIndice = {};
  function indiceDe(p) {
    if (cacheIndice[p.id]) return cacheIndice[p.id];
    var partes = [];
    coleta(p, partes);
    partes.push(area(p.categoria).nome);
    var cruTxt = partes.join(' · ').replace(/\*/g, '');
    cacheIndice[p.id] = { cru: cruTxt, norm: normaliza(cruTxt) };
    return cacheIndice[p.id];
  }
  /* o que aparece no cartao quando o termo casou no miolo, e nao no titulo */
  function trecho(p, termos) {
    var ix = indiceDe(p);
    var cabecalho = normaliza([p.titulo, p.resumo, (p.tags || []).join(' ')].join(' '));
    for (var i = 0; i < termos.length; i++) {
      if (cabecalho.indexOf(termos[i]) !== -1) continue;
      var at = ix.norm.indexOf(termos[i]);
      if (at === -1) continue;
      var ini = Math.max(0, at - 45), fim = Math.min(ix.cru.length, at + termos[i].length + 55);
      return (ini > 0 ? '…' : '') + ix.cru.slice(ini, fim).trim() + (fim < ix.cru.length ? '…' : '');
    }
    return '';
  }

  /* ---------- favoritas (ficam no aparelho) ---------- */
  function ler(chave, padrao) {
    try { return JSON.parse(localStorage.getItem(chave)) || padrao; } catch (e) { return padrao; }
  }
  function grava(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* modo privado */ }
  }
  function apaga(chave) {
    try { localStorage.removeItem(chave); } catch (e) { /* modo privado */ }
  }
  var favoritas = ler('favoritas', []);
  try { localStorage.removeItem('recentes'); } catch (e) { /* modo privado */ }

  function ehFavorita(id) { return favoritas.indexOf(id) !== -1; }
  function alternaFavorita(id) {
    var i = favoritas.indexOf(id);
    if (i === -1) favoritas.unshift(id); else favoritas.splice(i, 1);
    grava('favoritas', favoritas);
  }

  /* ---------- estado ---------- */
  var areaAtual    = CATEGORIAS[0].id;
  var condutaAtual = null;     // id da conduta aberta sozinha, ou null
  var dosesGrupo   = null;     // grupo aberto em #doses/<grupo>
  var termoBusca   = '';
  var modo         = 'home';   // 'home' | 'guia' | 'ferramentas' | 'atb' | 'favoritas'
  var abaFerr      = null;     // sub-aba das ferramentas
  var sitioAtb     = null;     // sítio de infecção aberto na seção Antibióticos
  var subAtual = null, subAberta = null;
  var guiaAberto = false;   /* o Guia clínico começa recolhido */
  var queixaAtual = null;
  var secAtual     = null;     // seção de topo aberta (presc, calc, scores, prontuario)
  var subSecao     = null;     // tela filha da seção
  /* rotas antigas continuam funcionando */
  /* as telas por via saíram do menu de Prescrições; as rotas antigas
     continuam válidas e caem em "por quadro clínico" */
  var LEGADO = {
    'agora':'', 'protocolos':'cardio', 'prescrever':'presc', 'plantao':'favoritas',
    'presc/pediatria':'pediatria', 'presc/quadro':'presc',
    'presc/oral':'presc', 'presc/im':'presc', 'presc/ev':'presc',
    'presc/especiais':'presc', 'ferramentas/quadros':'presc',
    'ferramentas/oral':'presc', 'ferramentas/im':'presc',
    'ferramentas/ev':'presc', 'ferramentas/especiais':'presc', 'ferramentas/atb':'atb',
    'ferramentas/calculadoras':'calc', 'ferramentas/anamnese':'prontuario/modelos',
    'ferramentas/conduta':'prontuario/conduta', 'ferramentas/evasao':'prontuario/evasao',
    'ferramentas/laudos':'prontuario/laudos', 'ferramentas':'presc'
  };
  function ehSecao(id) {
    if (!temFerramentas()) return false;
    for (var i = 0; i < Ferramentas.secoes.length; i++) {
      if (Ferramentas.secoes[i].id === id) return true;
    }
    return false;
  }
  function temFerramentas() { return typeof window.Ferramentas !== 'undefined'; }

  /* preferencias que mudam o que a tela mostra (painel de ajustes) */
  function pref(chave, padrao) {
    var v = ler('pref:' + chave, null);
    return v === null ? padrao : v;
  }
  function modoAutor()  { return pref('autor', false); }
  function resumoPadrao() { return pref('resumo', true); }
  var areaAberta   = null;    // qual area esta expandida no sumario (independe da rota)

  /* no modo leitura, conduta sem conteudo nao aparece */
  function visiveis(lista) {
    return modoAutor() ? lista : lista.filter(preenchida);
  }

  function indiceArea(id) {
    for (var i = 0; i < CATEGORIAS.length; i++) if (CATEGORIAS[i].id === id) return i;
    return 0;
  }
  function area(id) { return CATEGORIAS[indiceArea(id)]; }
  function existeArea(id) {
    return CATEGORIAS.some(function (c) { return c.id === id; });
  }
  function acharConduta(id) {
    for (var i = 0; i < PROTOCOLOS.length; i++) if (PROTOCOLOS[i].id === id) return PROTOCOLOS[i];
    return null;
  }

  /* ---------- dobrar um bloco ----------
     Clicar no próprio bloco fecha ele: fica só o título, e clicar de
     novo abre. Vale em todo o guia — quem fechou red flags não quer
     red flags em conduta nenhuma. O fluxograma nunca dobra. */
  var LEITURA = { texto:1, lista:1, dica:1 };   /* o que o "só o essencial" fecha */

  function rotuloBloco(sec) { return sec.titulo || LABEL[sec.tipo] || sec.tipo; }
  function chaveBloco(sec) {
    if (sec.tipo !== 'lista') return sec.tipo;
    var t = sec.titulo || LABEL.lista;
    return 'lista::' + normaliza(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  /* na primeira visita os blocos de leitura ("O que pedir", "Reavaliar",
     "Internação x alta", dicas, observações) já vêm fechados: quem abre
     uma conduta no plantão quer red flags, fluxograma e dose. */
  function blocosOff() {
    var v = ler('pref:blocos-off', null);
    if (Array.isArray(v)) return v;
    var seed = chavesLeitura().slice();
    grava('pref:blocos-off', seed);
    return seed;
  }
  function blocoDobrado(sec) {
    return sec.tipo !== 'fluxo' && blocosOff().indexOf(chaveBloco(sec)) > -1;
  }
  function alternaBloco(k) {
    var off = blocosOff(), i = off.indexOf(k);
    if (i > -1) off.splice(i, 1); else off.push(k);
    grava('pref:blocos-off', off);
  }

  /* as chaves de todos os blocos de leitura do guia, para o preset
     dos Ajustes valer em qualquer conduta */
  var cacheLeitura = null;
  function chavesLeitura() {
    if (cacheLeitura) return cacheLeitura;
    var out = {};
    function varre(lista) {
      (lista || []).forEach(function (p) {
        (p.secoes || []).forEach(function (sec) {
          if (LEITURA[sec.tipo]) out[chaveBloco(sec)] = 1;
        });
      });
    }
    varre(PROTOCOLOS);
    if (typeof QUEIXAS !== 'undefined') varre(QUEIXAS);
    cacheLeitura = Object.keys(out);
    return cacheLeitura;
  }
  function soEssencial() { grava('pref:blocos-off', chavesLeitura().slice()); }
  function tudoVisivel() { grava('pref:blocos-off', []); }

  /* embrulha o bloco para poder dobrar; display:contents mantém o
     layout exatamente como estava */
  function dobravel(sec) {
    var html = bloco(sec);
    if (sec.tipo === 'fluxo') return html;
    var d = blocoDobrado(sec);
    return '<div class="dobra t-' + esc(sec.tipo) + (d ? ' dobrado' : '') +
      '" data-dobra="' + esc(chaveBloco(sec)) + '"' +
      ' role="button" tabindex="0" aria-expanded="' + (d ? 'false' : 'true') + '"' +
      ' aria-label="' + esc(rotuloBloco(sec)) + ' — ' + (d ? 'abrir' : 'fechar') + '">' + html + '</div>';
  }

  /* ordem única de leitura em todo o guia: o que fazer primeiro, depois o
     fluxograma, depois doses, e só então red flags, não fazer e o resto —
     na ordem em que foram escritos. Sort estável: empates não trocam. */
  var POSICAO = { passos:0, ordem:0, fluxo:1, doses:2, alerta:3 };
  function ordenaSecoes(secoes) {
    return (secoes || []).map(function (sec, i) { return { sec: sec, i: i }; })
      .sort(function (a, b) {
        var pa = POSICAO[a.sec.tipo], pb = POSICAO[b.sec.tipo];
        if (pa === undefined) pa = 4;
        if (pb === undefined) pb = 4;
        return pa - pb || a.i - b.i;
      })
      .map(function (x) { return x.sec; });
  }

  function corpoProtocolo(p) {
    var secoes = p.secoes || [];
    /* a ficha rápida (p.ficha) não é mais mostrada: a conduta abre direto
       no que fazer e no fluxograma */
    var html = ordenaSecoes(secoes).map(dobravel).join('');
    if (!(p.ficha || []).length && !secoes.length) {
      html += '<div class="pendente">Conduta ainda não preenchida.</div>';
    }
    if (p.fonte) html += '<p class="muted fonte">Referência: ' + rico(p.fonte) + '</p>';
    return html;
  }

  /* ---------- lista da area: so o titulo, e cada um leva para a vista isolada ---------- */
  function cartao(p, numero, mostrarArea, achou) {
    var g = p.gravidade || 'rotina';
    var c = area(p.categoria);
    return '<a class="cartao" href="#' + esc(p.categoria) + '/' + esc(p.id) + '">' +
      '<span class="pasta-num">' + esc(numero) + '</span>' +
      '<span class="pasta-nome">' + esc(p.titulo) +
        (p.resumo ? '<span class="pasta-resumo">' + rico(p.resumo) + '</span>' : '') +
        (achou ? '<span class="pasta-achou">↳ ' + esc(achou) + '</span>' : '') +
      '</span>' +
      (ehFavorita(p.id) ? '<span class="pasta-fav">' + ICO('estrela') + '</span>' : '') +
      (mostrarArea ? '<span class="pasta-area">' + esc(c.nome) + '</span>' : '') +
      (preenchida(p) ? '' : '<span class="pasta-tag vazia">a preencher</span>') +
      '<span class="pasta-tag ' + esc(g) + '">' + esc(g) + '</span>' +
      '<span class="pasta-seta">' + ICO('setaDir') + '</span>' +
    '</a>';
  }

  /* ---------- render ---------- */
  /* ---------- tolerância a erro de digitação ----------
     Só entra em ação quando a busca exata não achou nada: aí cada termo
     ganha uma variante com até 1 erro (troca, falta, sobra ou inversão
     de letra) procurada palavra a palavra no índice. Rodar isso sempre
     deixaria a busca lenta e traria resultado errado por cima do certo. */
  /* distância de edição com teto: para assim que passa do limite */
  function distAte(a, b, lim) {
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > lim) return lim + 1;
    var ant = new Array(lb + 1), atual = new Array(lb + 1), i, j;
    for (j = 0; j <= lb; j++) ant[j] = j;
    for (i = 1; i <= la; i++) {
      atual[0] = i;
      var menor = atual[0];
      for (j = 1; j <= lb; j++) {
        var custo = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        atual[j] = Math.min(atual[j - 1] + 1, ant[j] + 1, ant[j - 1] + custo);
        if (atual[j] < menor) menor = atual[j];
      }
      if (menor > lim) return lim + 1;
      var t = ant; ant = atual; atual = t;
    }
    return ant[lb];
  }
  /* quanto erro se perdoa: palavra curta erra pouco, longa erra mais */
  function limiteErro(n) { return n >= 8 ? 2 : (n >= 4 ? 1 : 0); }

  /* o termo aparece no texto, aceitando um errinho de digitação? */
  function casaTolerante(texto, termo) {
    if (texto.indexOf(termo) !== -1) return true;
    var lim = limiteErro(termo.length);
    if (!lim) return false;
    var palavras = texto.split(/[^a-z0-9]+/);
    var vistas = {};
    for (var i = 0; i < palavras.length; i++) {
      var w = palavras[i];
      if (!w || vistas[w]) continue;
      vistas[w] = 1;
      if (Math.abs(w.length - termo.length) > lim) continue;
      if (distAte(w, termo, lim) <= lim) return true;
    }
    return false;
  }

  function resultadosBusca() {
    var termos = normaliza(termoBusca).trim().split(/\s+/).filter(Boolean);
    if (!termos.length) return null;
    function acha(tolerante) {
      return PROTOCOLOS.filter(function (p) {
        var ix = indiceDe(p).norm;
        return termos.every(function (x) {
          return tolerante ? casaTolerante(ix, x) : ix.indexOf(x) !== -1;
        });
      });
    }
    var achados = acha(false);
    buscaTolerou = false;
    if (!achados.length) {
      var t2 = acha(true);
      if (t2.length) { achados = t2; buscaTolerou = true; }
    }
    /* ordem: preenchida antes de vazia; depois, quem casa no titulo
       antes de quem casa so no miolo. Achar uma pasta vazia no topo
       do resultado e o pior jeito de perder tempo no plantao. */
    function peso(p) {
      var cab = normaliza([p.titulo, (p.tags || []).join(' ')].join(' '));
      var n = termos.filter(function (x) { return cab.indexOf(x) !== -1; }).length;
      return (preenchida(p) ? 0 : 100) - n;
    }
    achados.sort(function (a, b) { return peso(a) - peso(b); });
    ultimosTermos = termos;
    return achados;
  }
  var ultimosTermos = [];

  function renderAtalhos() {
    var caixa = document.getElementById('atalhos');
    if (!caixa) return;
    function bloco(rotulo, ids, cls) {
      var vivos = ids.map(acharConduta).filter(Boolean);
      if (!vivos.length) return '';
      return '<div class="atalho-grupo ' + cls + '"><span class="atalho-rot">' + rotulo + '</span>' +
        vivos.map(function (p) {
          return '<a href="#' + esc(p.categoria) + '/' + esc(p.id) + '"' +
                 (p.id === condutaAtual ? ' class="aqui"' : '') + '>' + esc(p.titulo) + '</a>';
        }).join('') + '</div>';
    }
    /* favoritas agora vivem na home e em Meu plantão; o sumário fica só com a navegação */
    caixa.innerHTML = '';
  }

  function renderSumario(resultados) {
    var emSecao = (!resultados && (modo === 'secao' || modo === 'atb'));

    /* 1. acesso rápido */
    var html = '<div class="nav-g"><span class="nav-t">Acesso rápido</span>';
    if (temQueixas()) {
      html += '<a href="#queixa" class="toplink porta' +
        ((!resultados && modo === 'queixa') ? ' active' : '') + '">' +
        ICO('porta') + '<span>Queixas</span></a>';
      html += '<a href="#critico" class="toplink porta critico' +
        ((!resultados && modo === 'critico') ? ' active' : '') + '">' +
        ICO('perigo') + '<span>Sala vermelha</span></a>';
    }
    html += '<a href="#doses" class="toplink porta doses' +
      ((!resultados && modo === 'doses') ? ' active' : '') + '">' +
      ICO('seringa') + '<span>Doses de emergência</span></a></div>';

    /* 2. ferramentas */
    if (temFerramentas()) {
      html += '<div class="nav-g"><span class="nav-t">Ferramentas</span>';
      Ferramentas.secoes.forEach(function (sec) {
        var ativo = (!resultados && modo === 'secao' && secAtual === sec.id)
          ? (subSecao || true) : null;
        html += Ferramentas.sumarioSecao(sec, ativo);
      });
      html += Ferramentas.sumarioAtb(
        (!resultados && modo === 'atb') ? (sitioAtb || true) : null);
      html += '</div>';
    }

    /* dentro de uma seção, o guia inteiro vira uma linha */
    if (emSecao) {
      html += '<div class="nav-g"><a href="#' + esc(areaAtual) + '" class="toplink">' +
              ICO('livro') + '<span>Guia clínico</span></a></div>';
      toc.innerHTML = html;
      return;
    }

    /* 3. guia clínico: recolhido por padrão */
    var noGuia = (!resultados && (modo === 'guia' || condutaAtual));
    var abreGuia = noGuia || guiaAberto;
    html += '<div class="nav-g guia">' +
      '<button type="button" class="nav-t bt" data-abre-guia aria-expanded="' + (abreGuia ? 'true' : 'false') + '">' +
        '<span>Guia clínico</span><i>' + PROTOCOLOS.filter(preenchida).length + '</i>' +
        ICO(abreGuia ? 'setaBai' : 'setaDir') + '</button>';
    if (abreGuia) {
      CATEGORIAS.forEach(function (c, ci) {
        var lista = listaArea(c.id);
        if (!lista.length && !modoAutor()) return;
        var aqui = (!resultados && modo === 'guia' && c.id === areaAtual);
        var sel  = (!resultados && c.id === areaAberta);
        var todas = porCategoria(c.id), feitas = progresso(todas);
        html += '<a href="#' + esc(c.id) + '" class="toplink' + (aqui ? ' active' : '') +
                '" data-area="' + esc(c.id) + '">' +
                '<span class="n">' + dois(ci + 1) + '</span><span>' + esc(c.nome) + '</span>' +
                (modoAutor()
                  ? '<span class="prog' + (feitas === todas.length ? ' full' : '') + '">' +
                    feitas + '/' + todas.length + '</span>'
                  : '<span class="prog">' + lista.length + '</span>') +
                '<span class="cor">' + ICO(sel ? 'setaBai' : 'setaDir') + '</span></a>';
        if (!sel) return;
        var grupos = subsDe(c.id);
        if (!grupos.length) {
          lista.forEach(function (p) {
            html += '<a href="#' + esc(c.id) + '/' + esc(p.id) + '" class="sub' +
                    (p.id === condutaAtual ? ' aqui' : '') + '">' + esc(p.titulo) + '</a>';
          });
          return;
        }
        grupos.forEach(function (g) {
          var dela = listaSub(g);
          if (!dela.length) return;
          var aberto = (g.id === subAberta);
          html += '<a href="#' + esc(c.id) + '/' + esc(g.id) + '" class="sub grupo' +
                  (aberto ? ' aberta' : '') +
                  (!condutaAtual && g.id === subAtual ? ' aqui' : '') + '">' +
                  '<span>' + esc(g.nome) + '</span><span class="prog">' + dela.length + '</span>' +
                  '<span class="cor">' + ICO(aberto ? 'setaBai' : 'setaDir') + '</span></a>';
          if (!aberto) return;
          dela.forEach(function (p) {
            html += '<a href="' + esc(hrefConduta(p)) + '" class="sub folha' +
                    (p.id === condutaAtual ? ' aqui' : '') + '">' + esc(p.titulo) + '</a>';
          });
        });
      });
    }
    html += '</div>';
    toc.innerHTML = html;
  }

  /* uma conduta sozinha na pagina */
  function renderConduta(p) {
    var c     = area(p.categoria);
    var ci    = indiceArea(p.categoria);
    var d     = subDaConduta(p);
    /* anterior e proxima andam dentro da subpasta, nao da area inteira */
    var lista = d ? listaSub(d.sub) : listaArea(p.categoria);
    if (lista.indexOf(p) === -1) lista = porCategoria(p.categoria);
    var pi    = lista.indexOf(p);
    var g     = p.gravidade || 'rotina';

    var trilha = '<a class="voltar" href="#' + esc(c.id) + '">' + ICO('setaEsq') + ' ' + esc(c.nome) + '</a>';
    if (d) {
      trilha = '<nav class="trilha">' +
        '<a href="#' + esc(c.id) + '">' + esc(c.nome) + '</a>' +
        '<i>' + ICO('setaDir') + '</i>' +
        '<a href="#' + esc(c.id) + '/' + esc(d.sub.id) + '">' + esc(d.sub.nome) + '</a>' +
        '</nav>';
    }

    var html = '<section class="phase solo">' + trilha +
      '<div class="solo-head">' +
        '<span class="solo-num">' + (ci + 1) +
          (d ? '.' + (subsDe(p.categoria).indexOf(d.sub) + 1) : '') + '.' + (pi + 1) + '</span>' +
        '<h2>' + esc(p.titulo) + '</h2>' +
        '<span class="pasta-tag ' + esc(g) + '">' + esc(g) + '</span>' +
        '<button type="button" class="btn-fav' + (ehFavorita(p.id) ? ' on' : '') +
          '" data-fav="' + esc(p.id) + '" aria-pressed="' + (ehFavorita(p.id) ? 'true' : 'false') +
          '" aria-label="' + (ehFavorita(p.id) ? 'Remover dos favoritos' : 'Favoritar') + '">' +
          ICO('estrela') + '</button>' +
        '<button type="button" class="btn-link" data-link aria-label="Copiar o link desta conduta">' +
          ICO('elo') + '</button>' +
      '</div>';
    if (p.resumo) html += '<p class="lead">' + rico(p.resumo) + '</p>';
    html += '<div class="solo-corpo">' + corpoProtocolo(p) + '</div>';
    marcaRecente(p.id);

    html += '<p class="rodape-aviso">' + ICO('alerta') +
      '<span>Apoio à decisão, sem revisão clínica formal. Confira dose, ' +
      'apresentação e diretriz vigente antes de prescrever.' +
      (p.fonte ? ' <b>Referência:</b> ' + esc(p.fonte) + '.' : '') + '</span></p>';

    html += '</section>';

    doc.innerHTML = html;
  }

  /* ---------- recentes ---------- */
  var RECENTES_MAX = 8;
  function recentes() {
    var v = ler('recentes', []);
    return Array.isArray(v) ? v : [];
  }
  function marcaRecente(id) {
    var l = recentes().filter(function (x) { return x !== id; });
    l.unshift(id);
    grava('recentes', l.slice(0, RECENTES_MAX));
  }

  /* ---------- sala vermelha ----------
     As condutas que não admitem consulta demorada. Lista curada, não
     um filtro por gravidade: nem toda emergência é sala vermelha. */
  var CRITICAS = [
    'pcr-adulto','pcr-pediatrica','sca-com-supra','avc-isquemico','sepse',
    'choque-abordagem','anafilaxia','status-epilepticus','hipoglicemia','hipercalemia',
    'taquiarritmia-instavel','bradiarritmia','insuficiencia-respiratoria','eap-ic-descompensada',
    'pneumotorax','tep','tamponamento','sequencia-rapida-intubacao','cardioversao-desfibrilacao',
    'atendimento-trauma','tce','meningite','cetoacidose','sepse-pediatrica',
    'crianca-gravemente-doente','intoxicado-abordagem','hda','sindrome-aortica'
  ];
  function renderCritico() {
    var lista = CRITICAS.map(acharConduta).filter(Boolean);
    var html = '<section class="phase critico">' +
      '<div class="phase-head"><h2>Sala vermelha</h2>' +
        '<span class="phase-conta">' + lista.length + '</span></div>' +
      '<div class="cr-grade">' + lista.map(function (p) {
        return '<a class="cr-cartao" href="' + esc(hrefConduta(p)) + '">' +
          '<span class="cr-nome">' + esc(p.titulo) + '</span>' +
          '<span class="cr-area">' + esc(area(p.categoria).nome) + '</span></a>';
      }).join('') + '</div></section>';
    doc.innerHTML = html;
  }

  /* ---------- subpastas: area > subpasta > conduta ----------
     SUBPASTAS e um const de topo, entao so o typeof cru enxerga. */
  function temSub() { return typeof SUBPASTAS !== 'undefined'; }
  function subsDe(areaId) { return (temSub() && SUBPASTAS[areaId]) || []; }
  function acharSub(areaId, subId) {
    var l = subsDe(areaId);
    for (var i = 0; i < l.length; i++) if (l[i].id === subId) return l[i];
    return null;
  }
  /* em que subpasta esta conduta mora */
  var _subDe = null;
  function subDaConduta(p) {
    if (!_subDe) {
      _subDe = {};
      if (temSub()) Object.keys(SUBPASTAS).forEach(function (a) {
        SUBPASTAS[a].forEach(function (g) {
          g.ids.forEach(function (id) { _subDe[id] = { area:a, sub:g }; });
        });
      });
    }
    return _subDe[p.id] || null;
  }
  /* condutas visiveis de uma subpasta, na ordem em que foram declaradas */
  function listaSub(g) {
    return g.ids.map(acharConduta).filter(function (p) {
      return p && (modoAutor() || preenchida(p));
    });
  }
  function contaSub(g) { return g.ids.filter(function (id) { return !!acharConduta(id); }).length; }
  /* rota canonica de uma conduta, ja com a subpasta */
  function hrefConduta(p) {
    var d = subDaConduta(p);
    return '#' + p.categoria + (d ? '/' + d.sub.id : '') + '/' + p.id;
  }

  /* ---------- queixas: a porta de entrada de quem nao tem diagnostico ---------- */
  /* QUEIXAS e um const de topo: nao vai para o window, so o typeof cru enxerga */
  function temQueixas() { return typeof QUEIXAS !== 'undefined' && QUEIXAS.length > 0; }
  function acharQueixa(id) {
    if (!temQueixas()) return null;
    for (var i = 0; i < QUEIXAS.length; i++) if (QUEIXAS[i].id === id) return QUEIXAS[i];
    return null;
  }
  var HREF_ATALHO = {
    calc: '#calc', score: '#scores', presc: '#presc', atb: '#atb'
  };
  function hrefAtalho(a) {
    if (a.tipo === 'conduta') {
      var alvo = acharConduta(a.id);
      return alvo ? '#' + alvo.categoria + '/' + alvo.id : '#';
    }
    var base = HREF_ATALHO[a.tipo] || '#';
    return a.id ? base + (a.tipo === 'atb' ? '/' + a.id : '') : base;
  }
  function abreAtalho(a) {
    /* calculadoras e scores abrem o item direto pela mesma ponte da busca */
    if ((a.tipo === 'calc' || a.tipo === 'score') && a.id) return 'calculadora:' + a.id;
    return '';
  }

  /* indice de uma queixa, para a busca global */
  var cacheIxQ = {};
  function indiceQueixa(q) {
    if (cacheIxQ[q.id]) return cacheIxQ[q.id];
    var partes = [];
    coleta(q, partes);
    var cruTxt = partes.join(' \u00b7 ').replace(/\*/g, '');
    cacheIxQ[q.id] = { cru: cruTxt, norm: normaliza(cruTxt) };
    return cacheIxQ[q.id];
  }
  function buscaQueixas(termos) {
    if (!temQueixas() || !termos || !termos.length) return [];
    return QUEIXAS.filter(function (q) {
      var ix = indiceQueixa(q);
      return termos.every(function (t) { return ix.norm.indexOf(t) !== -1; });
    });
  }

  /* capa: "estou diante de um paciente com..." */
  function renderQueixas() {
    var html = '<section class="phase">' +
      '<div class="phase-head"><h2>Queixas</h2></div>' +
      '<div class="qx-grade">' +
      QUEIXAS.map(function (q) {
        return '<a class="qx-cartao" href="#queixa/' + esc(q.id) + '">' +
          '<span class="qx-ico">' + ICO(q.icone) + '</span>' +
          '<span class="qx-nome">' + esc(q.nome) + '</span>' +
          '<span class="qx-sub">' + esc(q.sub) + '</span></a>';
      }).join('') +
      '</div></section>';
    doc.innerHTML = html;
  }

  /* uma queixa aberta */
  function renderQueixa(q) {
    var html = '<section class="phase">' +
      '<a class="voltar" href="#queixa">' + ICO('setaEsq') + ' Queixas</a>' +
      '<div class="solo-head">' +
        '<span class="atb-emoji">' + ICO(q.icone) + '</span>' +
        '<h2>' + esc(q.nome) + '</h2>' +
      '</div>';

    /* 1. fazer agora */
    html += '<div class="agora"><h3>' + ICO('perigo') + ' Fazer agora</h3><ol>' +
      (q.agora || []).map(function (x) { return '<li>' + rico(x) + '</li>'; }).join('') +
      '</ol></div>';

    /* 2. o corpo: fluxograma, red flags, exames, não fazer, reavaliar, destino */
    html += ordenaSecoes(q.secoes).map(dobravel).join('');

    /* 3. ferramentas ligadas */
    if ((q.atalhos || []).length) {
      html += '<div class="qx-ferr"><h3>Ferramentas</h3><div class="qx-chips">' +
        q.atalhos.map(function (a) {
          var ab = abreAtalho(a);
          return '<a class="qx-chip" href="' + esc(hrefAtalho(a)) + '"' +
            (ab ? ' data-abre="' + esc(ab) + '"' : '') + '>' + esc(a.rotulo) + '</a>';
        }).join('') + '</div></div>';
    }

    /* 4. o que não pode passar fecha a página */
    if ((q.naopode || []).length) {
      html += '<div class="naopode"><h3>' + ICO('alerta') + ' N\u00e3o posso deixar passar</h3>' +
        q.naopode.map(function (d) {
          var alvo = d.conduta && acharConduta(d.conduta);
          var corpo = '<b>' + esc(d.dx) + '</b><span>' + rico(d.pista) + '</span>';
          return alvo
            ? '<a class="np-item" href="' + esc(hrefConduta(alvo)) + '">' + corpo +
              '<i>' + ICO('setaDir') + '</i></a>'
            : '<div class="np-item">' + corpo + '</div>';
        }).join('') + '</div>';
    }

    html += '<p class="fonte-linha">' + ICO('livro') + ' <b>Base:</b> ' + esc(q.fonte || '') +
      (q.revisao ? ' &middot; ' + esc(q.revisao) : '') + '</p>';

    doc.innerHTML = html + '</section>';
  }

  /* ---------- doses de emergencia ----------
     Vista DERIVADA: nao guarda dose nenhuma. Le as secoes `doses` das
     condutas que ja existem, agrupadas por situacao. Editar a conduta
     atualiza esta pagina sozinho. */
  var DOSES_GRUPOS = [
    { id:'parada', nome:'Parada e ritmos de parada', icone:'coracao', cor:'c-fire',
      sub:'Adrenalina, amiodarona, cargas de choque',
      ids:['pcr-adulto','cardioversao-desfibrilacao'] },
    { id:'arritmias', nome:'Arritmias com instabilidade', icone:'coracao', cor:'c-pink',
      sub:'Adenosina, amiodarona, atropina, cardioversão',
      ids:['taquiarritmia-instavel','taqui-qrs-estreito','taqui-qrs-largo','bradiarritmia'] },
    { id:'via-aerea', nome:'Anafilaxia e via aérea', icone:'pulmao', cor:'c-blue',
      sub:'Adrenalina IM, sequência rápida, crise de asma',
      ids:['anafilaxia','sequencia-rapida-intubacao','asma-crise'] },
    { id:'convulsao', nome:'Convulsão', icone:'cerebro', cor:'c-purple',
      sub:'Benzodiazepínico, fenitoína, estado de mal',
      ids:['status-epilepticus'] },
    { id:'glicemia', nome:'Glicemia', icone:'seringa', cor:'c-amber',
      sub:'Glicose hipertônica, insulina, cetoacidose',
      ids:['hipoglicemia','cetoacidose'] },
    { id:'eletrolitos', nome:'Eletrólitos', icone:'rim', cor:'c-cyan',
      sub:'Potássio, sódio, cálcio e as diluições',
      ids:['hipercalemia','hipocalemia','hiponatremia','calcio'] },
    { id:'choque', nome:'Choque e sepse', icone:'gota', cor:'c-orange',
      sub:'Noradrenalina, vasopressina, antibiótico na primeira hora',
      ids:['choque-abordagem','sepse'] },
    { id:'reperfusao', nome:'Reperfusão e crise hipertensiva', icone:'coracao', cor:'c-indigo',
      sub:'Trombolítico, nitroglicerina, nitroprussiato',
      ids:['sca-com-supra','avc-isquemico','crise-hipertensiva','eap-ic-descompensada'] },
    { id:'sedacao', nome:'Sedação e analgesia', icone:'seringa', cor:'c-teal',
      sub:'Fentanila, midazolam, cetamina, propofol',
      ids:['sedacao-analgesia','analgesia-ps'] },
    { id:'intoxicacoes', nome:'Intoxicações e antídotos', icone:'frasco', cor:'c-green',
      sub:'Naloxona, flumazenil, N-acetilcisteína, atropina',
      ids:['intoxicado-abordagem','benzo-opioide','paracetamol','organofosforado','triciclicos'] },
    { id:'pediatria', nome:'Pediatria', icone:'crianca', cor:'c-slate',
      sub:'Parada, sepse, asma e desidratação na criança',
      ids:['pcr-pediatrica','sepse-pediatrica','asma-pedia','desidratacao-crianca'] }
  ];
  function grupoDoses(id) {
    for (var i = 0; i < DOSES_GRUPOS.length; i++) if (DOSES_GRUPOS[i].id === id) return DOSES_GRUPOS[i];
    return null;
  }
  /* quantas condutas do grupo têm bloco de doses */
  function contaGrupoDoses(g) {
    return g.ids.filter(function (id) { var p = acharConduta(id); return p && dosesDe(p).length; }).length;
  }

  function dosesDe(p) {
    return (p.secoes || []).filter(function (s) { return s.tipo === 'doses'; });
  }

  /* a capa: uma grande área por cartão; dentro, as tabelas do grupo */
  function renderDoses() {
    var g = dosesGrupo && grupoDoses(dosesGrupo);
    if (!g) { renderDosesCapa(); return; }

    var html = '<section class="phase">' +
      '<a class="voltar" href="#doses">' + ICO('setaEsq') + ' Doses de emergência</a>' +
      '<div class="solo-head"><span class="atb-emoji">' + ICO(g.icone) + '</span><h2>' + esc(g.nome) + '</h2></div>';
    var linhas = '';
    g.ids.forEach(function (id) {
      var p = acharConduta(id);
      if (!p) return;
      var blocos = dosesDe(p);
      if (!blocos.length) return;
      linhas += '<div class="dz-quadro">' +
        '<a class="dz-titulo" href="#' + esc(p.categoria) + '/' + esc(p.id) + '">' +
          esc(p.titulo) + ICO('setaDir') + '</a>' +
        blocos.map(function (sec) {
          return (sec.titulo ? '<h4 class="dz-sub">' + esc(sec.titulo) + '</h4>' : '') +
            '<table class="dz-tab"><tbody>' + (sec.itens || []).map(function (i) {
            return '<tr><th>' + rico(i.droga) + '</th>' +
              '<td class="dz-dose">' + rico(i.dose) + '</td>' +
              '<td class="dz-via">' + esc(i.via || '') + '</td>' +
              '<td class="dz-obs">' + rico(i.obs || '') + '</td></tr>';
          }).join('') + '</tbody></table>';
        }).join('') +
      '</div>';
    });
    html += linhas || '<div class="pendente">Nenhuma conduta deste grupo tem bloco de doses ainda.</div>';
    html += '<p class="fonte-linha">' + ICO('alerta') +
      ' Conferir a dose na conduta de origem antes de administrar.</p>';
    doc.innerHTML = html + '</section>';
  }

  function renderDosesCapa() {
    var html = '<section class="phase">' +
      '<div class="phase-head"><h2>Doses de emergência</h2></div>' +
      '<p class="ferr-lead">As drogas que não dão tempo de procurar, agrupadas por situação. Vista derivada das condutas: editar a conduta atualiza aqui.</p>' +
      '<div class="area-grade">' +
      DOSES_GRUPOS.map(function (g) {
        var n = contaGrupoDoses(g);
        if (!n) return '';
        return '<a class="area-card ' + esc(g.cor) + '" href="#doses/' + esc(g.id) + '">' +
          '<span class="area-ico">' + ICO(g.icone) + '</span>' +
          '<span class="area-corpo"><b>' + esc(g.nome) + '</b><span>' + esc(g.sub) + '</span></span>' +
          '<span class="area-n">' + n + (n === 1 ? ' conduta' : ' condutas') + '</span>' +
        '</a>';
      }).join('') + '</div></section>';
    doc.innerHTML = html;
  }

  /* ---------- busca unificada: condutas + tudo das Ferramentas ---------- */
  var buscaTolerou = false;

  var ROTULO_TIPO = {
    queixa:'Queixas',
    conduta:'Condutas', quadro:'Prescrições por quadro', antibiotico:'Antibióticos',
    score:'Scores', calculadora:'Calculadoras', medicacao:'Medicações',
    texto:'Textos prontos', manobra:'Manobras e sinais'
  };
  var ORDEM_TIPO = ['queixa','conduta','quadro','antibiotico','score','calculadora','medicacao','texto','manobra'];

  function buscaFerramentas(termos) {
    if (!temFerramentas()) return [];
    var ix = Ferramentas.indice();
    function f(tol) {
      return ix.filter(function (o) {
        return termos.every(function (t) {
          return tol ? casaTolerante(o.norm, t) : o.norm.indexOf(t) !== -1;
        });
      });
    }
    var r = f(false);
    return (!r.length && buscaTolerou) ? f(true) : r;
  }

  function itemBusca(o) {
    var href = o.href + (o.abre ? '' : '');
    return '<a class="res-item" href="' + esc(href) + '"' +
      (o.abre ? ' data-abre="' + esc(o.tipo) + ':' + esc(o.abre) + '"' : '') + '>' +
      '<span class="res-nome">' + esc(o.titulo) + '</span>' +
      (o.sub ? '<span class="res-sub">' + esc(o.sub) + '</span>' : '') +
      '<span class="res-seta">' + ICO('setaDir') + '</span>' +
    '</a>';
  }

  function renderBusca(condutas) {
    var ferr = buscaFerramentas(ultimosTermos);
    var qxs  = buscaQueixas(ultimosTermos);
    var total = condutas.length + ferr.length + qxs.length;

    if (window.UI && UI.anuncia) {
      UI.anuncia(total + (total === 1 ? ' resultado' : ' resultados') +
        ' para ' + termoBusca + (buscaTolerou ? ', busca aproximada' : ''));
    }
    var html = '<section class="phase busca-res">' +
      '<div class="res-head"><b>' + total + '</b> ' +
        (total === 1 ? 'resultado' : 'resultados') + ' para “' + esc(termoBusca) + '”' +
        (buscaTolerou && total ? '<i class="res-aprox">busca aproximada</i>' : '') + '</div>';

    if (!total) {
      html += '<div class="pendente">Nada encontrado. Tente o nome da droga, ' +
              'o sintoma ou o nome do quadro.</div></section>';
      doc.innerHTML = html;
      return;
    }

    var grupos = { queixa: qxs.map(function (q) {
      return { tipo:'queixa', titulo: q.nome, sub: q.sub, href: '#queixa/' + q.id };
    }), conduta: condutas.map(function (p) {
      return { tipo:'conduta', titulo:p.titulo, sub:area(p.categoria).nome,
               href:'#' + p.categoria + '/' + p.id, achou:trecho(p, ultimosTermos),
               vazia:!preenchida(p) };
    }) };
    ferr.forEach(function (o) { (grupos[o.tipo] = grupos[o.tipo] || []).push(o); });

    ORDEM_TIPO.forEach(function (t) {
      var l = grupos[t];
      if (!l || !l.length) return;
      html += '<div class="res-grupo"><h3>' + ROTULO_TIPO[t] + '<i>' + l.length + '</i></h3>';
      html += l.slice(0, 40).map(function (o) {
        if (t !== 'conduta') return itemBusca(o);
        return '<a class="res-item" href="' + esc(o.href) + '">' +
          '<span class="res-nome">' + esc(o.titulo) +
            (o.vazia ? '<span class="res-vazia">a preencher</span>' : '') + '</span>' +
          '<span class="res-sub">' + esc(o.sub) + '</span>' +
          (o.achou ? '<span class="pasta-achou">↳ ' + esc(o.achou) + '</span>' : '') +
          '<span class="res-seta">' + ICO('setaDir') + '</span>' +
        '</a>';
      }).join('');
      if (l.length > 40) html += '<div class="res-mais">e mais ' + (l.length - 40) + '…</div>';
      html += '</div>';
    });

    doc.innerHTML = html + '</section>';
  }

  /* ---------- tela inicial ----------
     Saudação com o nome do médico, busca, as funcionalidades do guia
     em cartões (com contagem viva), queixas, o que ele estava vendo e
     as áreas. Nada escondido em acordeão. */
  function nomeMedico() {
    var n = ler('pref:nome', '');
    return typeof n === 'string' ? n.trim() : '';
  }
  function saudacao() {
    var h = new Date().getHours();
    return h < 5 ? 'Boa madrugada' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  }
  function dataHoje() {
    var d = new Date();
    var dias = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
    var meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    var t = dias[d.getDay()] + ', ' + d.getDate() + ' de ' + meses[d.getMonth()];
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function contaCalc(tipo) {
    if (typeof FERR_CALC === 'undefined') return 0;
    return FERR_CALC.filter(function (c) { return c.tipo === tipo; }).length;
  }
  /* os dados são const de escopo global, não propriedades de window */
  function tam(lista) { return typeof lista !== 'undefined' && lista ? lista.length : 0; }

  function funcionalidades() {
    var lista = [
      { href:'#critico', icone:'perigo', nome:'Sala vermelha', cor:'c-fire',
        sub:'Urgência e protocolos críticos — a primeira decisão vale mais que a leitura',
        n: CRITICAS.length + ' condutas' },
      { href:'#queixa', icone:'porta', nome:'Queixas', cor:'c-blue',
        sub:'Porta de entrada por sintoma, antes do diagnóstico',
        n: (temQueixas() ? QUEIXAS.length : 0) + ' queixas' },
      { href:'#' + CATEGORIAS[0].id, icone:'livro', nome:'Guia clínico', cor:'c-indigo',
        sub:'Fluxograma, red flags, doses e destino de cada conduta',
        n: progresso(PROTOCOLOS) + ' condutas em ' + CATEGORIAS.length + ' áreas' },
      { href:'#doses', icone:'seringa', nome:'Doses de emergência', cor:'c-orange',
        sub:'As drogas que não dão tempo de procurar, por situação',
        n: DOSES_GRUPOS.length + ' situações' },
      { href:'#presc', icone:'receita', nome:'Prescrições', cor:'c-green',
        sub:'Por quadro clínico, prontas para copiar em dois cliques',
        n: tam(typeof FERR_QUADROS !== 'undefined' ? FERR_QUADROS : null) + ' quadros' },
      { href:'#atb', icone:'micro', nome:'Antibióticos', cor:'c-teal',
        sub:'Esquemas empíricos por sítio de infecção',
        n: tam(typeof FERR_ATB !== 'undefined' ? FERR_ATB : null) + ' esquemas' },
      { href:'#eletrolitos', icone:'gota', nome:'Eletrólitos', cor:'c-cyan',
        sub:'Potássio, sódio, bicarbonato, magnésio e cálcio: valor entra, diluição e vazão saem',
        n: (typeof Eletrolitos !== 'undefined' ? Eletrolitos.itens.length : 0) + ' ferramentas' },
      { href:'#pediatria', icone:'crianca', nome:'Pediatria', cor:'c-pink',
        sub:'Dose por quilo calculada e vetos por idade',
        n: tam(typeof FERR_PEDIA !== 'undefined' ? FERR_PEDIA : null) + ' medicações' },
      { href:'#scores', icone:'grafico', nome:'Scores', cor:'c-purple',
        sub:'Escores clínicos com interpretação',
        n: contaCalc('escore') + ' escores' },
      { href:'#calc', icone:'calc', nome:'Calculadoras', cor:'c-amber',
        sub:'As contas do plantão: gotejamento, correções, conversões',
        n: contaCalc('formula') + ' contas' },
      { href:'#prontuario', icone:'prontuar', nome:'Prontuário', cor:'c-slate',
        sub:'Anamnese, manobras, conduta, evasão e laudos',
        n: 'textos prontos' }
    ];
    return lista.map(function (f) {
      return '<a class="fn-item ' + f.cor + '" href="' + esc(f.href) + '">' +
        '<span class="fn-ico">' + ICO(f.icone) + '</span>' +
        '<span class="fn-corpo"><b>' + esc(f.nome) + '</b>' +
          '<span>' + esc(f.sub) + '</span></span>' +
        '<span class="fn-n">' + esc(f.n) + '</span>' +
        '<span class="fn-seta">' + ICO('setaDir') + '</span></a>';
    }).join('');
  }

  function renderHome() {
    var favs = favoritas.map(acharConduta).filter(Boolean);
    var recs = recentes().map(acharConduta).filter(Boolean)
      .filter(function (p) { return favoritas.indexOf(p.id) === -1; });
    var nome = nomeMedico();

    /* o painel escuro: saudação e a busca */
    var html = '<section class="phase home">' +
      '<div class="hero">' +
        '<span class="hero-pill"><i></i>' + esc(saudacao()) + ' · ' + esc(dataHoje()) + '</span>' +
        '<h1>' + (nome ? 'Bem-vindo, ' + esc(nome) : 'Bem-vindo ao plantão') + '</h1>' +
        '<p>Condutas, prescrições, doses e escores em um só lugar.</p>' +
        '<label class="hero-busca">' + ICO('lupa') +
          '<input type="search" id="heroBusca" autocomplete="off" placeholder="Pesquise por sintoma, conduta, droga ou dose" aria-label="Buscar em todo o guia">' +
          '<kbd>/</kbd></label>';
    if (!nome) {
      html += '<form class="hero-nome" data-form-nome>' +
        '<label for="campoNome">Como quer ser chamado?</label>' +
        '<input id="campoNome" type="text" maxlength="40" autocomplete="off" placeholder="Dr. Gustavo">' +
        '<button type="submit">Salvar</button></form>';
    }
    html += '</div>';

    /* as funcionalidades, todas à vista */
    html += '<div class="fn-lista">' + funcionalidades() + '</div>';

    /* todas as queixas de cara: é a porta de entrada mais usada */
    if (temQueixas()) {
      html += '<div class="home-sec"><h3>Queixas</h3><div class="qx-grade">' +
        QUEIXAS.map(function (q) {
          return '<a class="qx-cartao" href="#queixa/' + esc(q.id) + '">' +
            '<span class="qx-ico">' + ICO(q.icone) + '</span>' +
            '<span class="qx-nome">' + esc(q.nome) + '</span></a>';
        }).join('') + '</div></div>';
    }

    /* favoritos e recentes, discretos */
    if (favs.length || recs.length) {
      html += '<div class="home-sec duas">';
      if (recs.length) {
        html += '<div class="hs-col"><h3>' + ICO('relogio') + 'Recentes</h3><ul class="hs-lista">' +
          recs.slice(0, 6).map(function (p) {
            return '<li><a href="' + esc(hrefConduta(p)) + '">' + esc(p.titulo) +
              '<i>' + esc(area(p.categoria).nome) + '</i></a></li>';
          }).join('') + '</ul>' +
          '<button type="button" class="hs-limpar" data-limpa-recentes>Limpar recentes</button></div>';
      }
      if (favs.length) {
        html += '<div class="hs-col"><h3>' + ICO('estrela') + 'Favoritas</h3><ul class="hs-lista">' +
          favs.slice(0, 6).map(function (p) {
            return '<li><a href="' + esc(hrefConduta(p)) + '">' + esc(p.titulo) +
              '<i>' + esc(area(p.categoria).nome) + '</i></a></li>';
          }).join('') + '</ul></div>';
      }
      html += '</div>';
    }

    /* as áreas do guia, sempre à vista */
    html += '<div class="home-sec"><h3>Áreas do guia</h3><div class="home-grade areas">' +
      CATEGORIAS.map(function (c, ci) {
        var l = listaArea(c.id);
        if (!l.length) return '';
        return '<a class="home-cartao area" href="#' + esc(c.id) + '">' +
          '<span class="hc-num">' + dois(ci + 1) + '</span>' +
          '<span class="hc-nome">' + esc(c.nome) + '</span>' +
          '<span class="hc-sub">' + l.length + ' condutas</span></a>';
      }).join('') + '</div></div>';

    doc.innerHTML = html + '</section>';
  }

  /* o nome salvo pela home */
  doc.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-form-nome]');
    if (!f) return;
    e.preventDefault();
    var v = (f.querySelector('input').value || '').trim();
    if (!v) return;
    grava('pref:nome', v);
    if (window.UI && UI.aviso) UI.aviso('Salvo');
    render();
  });

  /* ---------- favoritas ---------- */
  function renderFavoritas() {
    var favs = favoritas.map(acharConduta).filter(Boolean);
    var html = '<section class="phase"><div class="phase-head">' +
      '<h2>Favoritas</h2></div>';
    html += favs.length
      ? favs.map(function (p, i) { return cartao(p, dois(i + 1), true); }).join('')
      : '<div class="pendente">Nenhuma conduta favoritada ainda. ' +
        'Abra uma conduta e toque na estrela ao lado do título.</div>';
    doc.innerHTML = html + '</section>';
  }

  function renderDoc(resultados) {
    if (resultados) { renderBusca(resultados); return; }
    if (modo === 'home')      { renderHome(); return; }
    if (modo === 'favoritas') { renderFavoritas(); return; }
    if (modo === 'doses') { renderDoses(); return; }
    if (modo === 'critico') { renderCritico(); return; }
    if (modo === 'queixa' && temQueixas()) {
      var q = queixaAtual && acharQueixa(queixaAtual);
      if (q) { renderQueixa(q); return; }
      renderQueixas(); return;
    }

    /* seções de topo */
    if (modo === 'secao' && temFerramentas()) {
      Ferramentas.desenhaSecao(doc, secAtual, subSecao);
      return;
    }

    /* seção de antibióticos */
    if (modo === 'atb' && temFerramentas()) {
      Ferramentas.desenhaAtb(doc, sitioAtb);
      return;
    }

    /* aba de ferramentas */
    if (modo === 'ferramentas' && temFerramentas()) {
      Ferramentas.desenha(doc, abaFerr);
      return;
    }

    /* vista isolada */
    if (condutaAtual) {
      var alvo = acharConduta(condutaAtual);
      if (alvo) { renderConduta(alvo); return; }
      condutaAtual = null;
    }

    /* lista da area */
    var ci = indiceArea(areaAtual);
    var c  = CATEGORIAS[ci];
    var lista = listaArea(c.id);
    var todas = porCategoria(c.id);
    var gAtual = subAtual && acharSub(c.id, subAtual);
    var html = '<section class="phase" id="area-' + esc(c.id) + '">';
    if (gAtual) {
      html += '<a class="voltar" href="#' + esc(c.id) + '">' + ICO('setaEsq') + ' ' + esc(c.nome) + '</a>';
    }
    html += '<div class="phase-head"><span class="big">' +
      dois(ci + 1) + (gAtual ? '.' + dois(subsDe(c.id).indexOf(gAtual) + 1) : '') + '</span>' +
      '<h2>' + esc(gAtual ? gAtual.nome : c.nome) + '</h2></div>';


    var nBarra = gAtual ? listaSub(gAtual).length : lista.length;
    html += '<div class="barra-area"><span class="conta">' +
      (gAtual ? '' : subsDe(c.id).length ? subsDe(c.id).length + ' subpastas &middot; ' : '') +
      nBarra + (nBarra === 1 ? ' conduta' : ' condutas') +
      (modoAutor() ? ' &middot; ' + progresso(todas) + ' de ' + todas.length + ' preenchidas' : '') +
    '</span></div>';

    if (!lista.length) {
      html += '<div class="pendente">Esta área ainda não tem conduta preenchida. ' +
        'Ligue o <b>modo autor</b> nos ajustes para ver as ' + todas.length + ' pendentes.</div>';
    } else if (subAtual && acharSub(c.id, subAtual)) {
      /* dentro de uma subpasta: as condutas dela */
      var g = acharSub(c.id, subAtual);
      var gi = subsDe(c.id).indexOf(g);
      var dela = listaSub(g);
      html += dela.map(function (p, pi) {
        return cartao(p, (ci + 1) + '.' + (gi + 1) + '.' + (pi + 1), false);
      }).join('');
      if (!dela.length) html += '<div class="pendente">Nenhuma conduta preenchida nesta subpasta.</div>';
    } else if (subsDe(c.id).length) {
      /* capa da area: as subpastas */
      html += '<div class="sub-grade">' + subsDe(c.id).map(function (g, gi) {
        var dela = listaSub(g);
        if (!dela.length) return '';
        return '<a class="sub-cartao" href="#' + esc(c.id) + '/' + esc(g.id) + '">' +
          '<span class="sc-num">' + dois(ci + 1) + '.' + dois(gi + 1) + '</span>' +
          '<span class="sc-nome">' + esc(g.nome) + '</span>' +
          '<span class="sc-lista">' + dela.slice(0, 4).map(function (p) { return esc(p.titulo); }).join(' &middot; ') +
            (dela.length > 4 ? ' &middot; +' + (dela.length - 4) : '') + '</span>' +
          '<span class="sc-conta">' + dela.length + '</span></a>';
      }).join('') + '</div>';
    } else {
      html += lista.map(function (p, pi) {
        return cartao(p, (ci + 1) + '.' + (pi + 1), false);
      }).join('');
    }
    doc.innerHTML = html + '</section>';
  }

  function render() {
    var res = resultadosBusca();
    side.classList.toggle('buscando', !!res);
    /* na home a busca do topo some: a do painel é a que vale */
    document.body.classList.toggle('na-home', modo === 'home' && !res);
    renderSumario(res);
    renderDoc(res);
    renderAtalhos();
  }

  /* ---------- rota: #area  ou  #area/conduta ---------- */
  function lerHash() {
    var h = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    var partes = h.split('/');
    condutaAtual = null;
    modo = 'guia';
    abaFerr = null;
    if (!h) { modo = 'home'; return; }
    if (LEGADO[h]) { location.replace('#' + LEGADO[h]); return; }
    if (partes[0] === 'favoritas') { modo = 'favoritas'; return; }
    if (partes[0] === 'queixa') { modo = 'queixa'; queixaAtual = partes[1] || null; return; }
    if (partes[0] === 'doses') { modo = 'doses'; dosesGrupo = partes[1] || null; return; }
    if (partes[0] === 'critico') { modo = 'critico'; return; }
    if (partes[0] === 'atb') { modo = 'atb'; sitioAtb = partes[1] || null; return; }
    if (ehSecao(partes[0])) {
      modo = 'secao'; secAtual = partes[0]; subSecao = partes[1] || null;
      return;
    }
    if (partes[0] === 'ferramentas') {
      modo = 'ferramentas';
      abaFerr = partes[1] || null;
      return;
    }
    if (existeArea(partes[0])) { areaAtual = partes[0]; areaAberta = areaAtual; }
    subAtual = null;
    /* #area/<sub> ou #area/<conduta> ou #area/<sub>/<conduta>.
       A conduta resolve primeiro, para nao quebrar os links antigos. */
    if (partes[1]) {
      var p = acharConduta(partes[1]);
      if (p) {
        condutaAtual = p.id; areaAtual = p.categoria; areaAberta = p.categoria;
      } else if (acharSub(areaAtual, partes[1])) {
        subAtual = partes[1];
        var p2 = partes[2] && acharConduta(partes[2]);
        if (p2) { condutaAtual = p2.id; areaAtual = p2.categoria; areaAberta = p2.categoria; }
      }
    }
    if (condutaAtual && !subAtual) {
      var d = subDaConduta(acharConduta(condutaAtual));
      if (d) subAtual = d.sub.id;
    }
    subAberta = subAtual;
  }

  /* ---------- init ---------- */
  lerHash();
  render();

  window.addEventListener('hashchange', function () {
    lerHash();
    if (termoBusca) { busca.value = ''; termoBusca = ''; }
    render();
    window.scrollTo(0, 0);
  });

  busca.addEventListener('input', function () {
    termoBusca = busca.value;
    render();
  });
  doc.addEventListener('input', function (e) {
    if (e.target.id !== 'heroBusca') return;
    busca.value = e.target.value;
    termoBusca = busca.value;
    render();
    if (termoBusca) {
      busca.focus();
      try { busca.setSelectionRange(busca.value.length, busca.value.length); } catch (x) { /* search */ }
    }
  });
  busca.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { busca.value = ''; termoBusca = ''; render(); busca.blur(); }
  });

  /* ---------- modo noturno ---------- */
  var btnTema = document.getElementById('btnTema');
  /* claro é o padrão; escuro é escolha, não herança do sistema */
  function temaEfetivo() {
    return document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro';
  }
  function pintaBotaoTema() {
    var escuro = temaEfetivo() === 'escuro';
    btnTema.innerHTML = ICO(escuro ? 'sol' : 'lua');
    btnTema.title = escuro ? 'Voltar ao modo claro' : 'Modo noturno';
  }
  btnTema.addEventListener('click', function () {
    var novo = temaEfetivo() === 'escuro' ? 'claro' : 'escuro';
    document.documentElement.dataset.tema = novo;
    try { localStorage.setItem('tema', novo); } catch (e) { /* modo privado */ }
    pintaBotaoTema();
    /* a barra do navegador acompanha o tema escolhido */
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', novo === 'escuro' ? '#0C111A' : '#F6F7F9');
    if (window.UI && UI.anuncia) UI.anuncia(novo === 'escuro' ? 'Modo noturno ligado' : 'Modo claro');
  });
  pintaBotaoTema();

  /* ---------- sumario: a area abre e fecha no mesmo clique ---------- */
  toc.addEventListener('click', function (e) {
    var bg = e.target.closest('[data-abre-guia]');
    if (bg) {
      e.preventDefault();
      guiaAberto = !guiaAberto;
      renderSumario(resultadosBusca());
      /* devolve o foco ao botão, que acabou de ser redesenhado */
      var novo = toc.querySelector('[data-abre-guia]');
      if (novo) novo.focus();
      return;
    }
    var a = e.target.closest('a.toplink[data-area]');
    if (!a) return;
    var id = a.dataset.area;
    var h  = decodeURIComponent((location.hash || '').replace(/^#/, ''));

    if (areaAberta === id) {
      /* ja estava aberta: so recolhe, sem sair da pagina */
      e.preventDefault();
      areaAberta = null;
      renderSumario(resultadosBusca());
      return;
    }

    areaAberta = id;
    /* se o hash ja aponta para esta area, nao havera hashchange:
       redesenha o sumario na mao para a lista aparecer */
    if (h === id) {
      e.preventDefault();
      renderSumario(resultadosBusca());
      return;
    }
    /* nos outros casos o link navega e a rota cuida do resto */
  });

  /* ---------- ponte para o ui.js ---------- */
  window.Guia = {
    render: render,
    limpaBusca: function () { busca.value = ''; termoBusca = ''; render(); },
    buscando: function () { return !!termoBusca; },
    prefMudou: function () { render(); },
    presetBlocos: function (essencial) {
      if (essencial) soEssencial(); else tudoVisivel();
      render();
    }
  };

  /* ---------- teclado: "/" cai na busca ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;
    e.preventDefault();
    var hero = document.getElementById('heroBusca');
    var alvo = hero || busca;
    alvo.focus();
    alvo.select();
  });

  /* ---------- filtro de blocos da conduta ---------- */
  doc.addEventListener('click', function (e) {
    if (e.target.closest('[data-limpa-recentes]')) {
      grava('recentes', []); render(); return;
    }
    var bp = e.target.closest('[data-presc]');
    if (bp) {
      var alvo = acharConduta(bp.dataset.presc);
      var txt = alvo && textoPrescricao(alvo);
      if (!txt) return;
      if (window.Ferramentas && Ferramentas.copiarClinico) Ferramentas.copiarClinico(txt, alvo.titulo, 'presc');
      return;
    }
    var b = e.target.closest('[data-dobra]');
    if (!b) return;
    /* dentro do bloco ainda tem link e botão de copiar: não roubar o clique */
    if (e.target.closest('a, button, input, textarea, select')) return;
    dobra(b);
  });

  function dobra(b) {
    var fechando = !b.classList.contains('dobrado');
    alternaBloco(b.dataset.dobra);
    var y = window.scrollY;
    render();
    window.scrollTo(0, y);
    if (window.UI && UI.aviso) UI.aviso(fechando ? 'Bloco fechado' : 'Bloco aberto');
  }

  /* mesma dobra pelo teclado */
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var b = e.target.closest && e.target.closest('[data-dobra]');
    if (!b || b !== e.target) return;
    e.preventDefault();
    dobra(b);
  });

  /* ---------- copiar o link da conduta ---------- */
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-link]')) return;
    var url = location.href;
    function ok()  { if (window.UI) UI.aviso('Link copiado'); }
    function nao() { if (window.UI) UI.aviso('Não consegui copiar o link', true); }
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(ok, nao);
    } else {
      try {
        var a = document.createElement('textarea');
        a.value = url; a.style.cssText = 'position:fixed;top:-1000px';
        document.body.appendChild(a); a.select();
        document.execCommand('copy') ? ok() : nao();
        document.body.removeChild(a);
      } catch (err) { nao(); }
    }
  });

  /* ---------- a chamada da home leva o foco ao campo do topo ---------- */
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('[data-foco="busca"]')) return;
    busca.focus();
    busca.scrollIntoView({ block: 'center' });
    /* pisca uma vez, para o olho achar onde o foco caiu */
    busca.classList.add('destacada');
    setTimeout(function () { busca.classList.remove('destacada'); }, 900);
  });

  /* ---------- resultado que abre um item ja expandido nas Ferramentas ---------- */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-abre]');
    if (!a || !temFerramentas()) return;
    var p = a.dataset.abre.split(':');
    Ferramentas.abrirItem(p[0], p.slice(1).join(':'));
  });

  /* ---------- favoritar ---------- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fav]');
    if (!b) return;
    var id = b.dataset.fav;
    alternaFavorita(id);
    var on = ehFavorita(id);
    b.classList.toggle('on', on);
    b.innerHTML = ICO('estrela'); b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    renderAtalhos();
  });

  /* copiar a prescricao para o prontuario */
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-copiar');
    if (!btn) return;
    var p = acharConduta(condutaAtual);
    if (!p) return;
    var caixas = [].slice.call(doc.querySelectorAll('.presc'));
    var i = caixas.indexOf(btn.closest('.presc'));
    var secs = (p.secoes || []).filter(function (s) { return s.tipo === 'prescricao'; });
    var sec = secs[i] || secs[0];
    if (!sec) return;
    var texto = prescTexto(p, sec);
    var ok = function () {
      btn.innerHTML = ICO('check') + 'Copiado';
      setTimeout(function () { btn.textContent = 'Copiar'; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok, function () { fallback(texto, ok); });
    } else {
      fallback(texto, ok);
    }
  });

  function fallback(texto, ok) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.cssText = 'position:fixed;top:-1000px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); ok(); } catch (err) { /* silencio */ }
    document.body.removeChild(ta);
  }
})();
