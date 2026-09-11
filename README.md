# Condutas de Plantão

Guia de consulta rápida para o plantão. Site estático, sem build e sem
dependência externa: abre o `index.html` e funciona — inclusive **sem internet**.

## O que tem dentro

| | |
|---|---|
| Condutas | **135** em 12 áreas e **63 subpastas**, todas com fluxograma, red flags, doses, "não fazer" e destino |
| Queixas | **16** portas de entrada por sintoma, para quem ainda não tem diagnóstico |
| Prescrições por quadro | **104** quadros clínicos em 16 grupos |
| Pediatria | **37** medicações com dose por quilo calculada e faixa etária, mais **15** vetos por idade |
| Antibióticos | **39** esquemas empíricos em 10 sítios, com painel de stewardship |
| Escores e calculadoras | **41** escores em 11 ramos + 7 contas do plantão |
| Doses de emergência | 11 situações, 33 quadros, 223 linhas — vista derivada das condutas |
| Sala vermelha | 28 condutas que não dão tempo de procurar |
| Prontuário | modelos de anamnese, 42 manobras, conduta, evasão e laudos |

## Arquivos

```
index.html                 casca: barra superior, sumário, ajustes, barra inferior
manifest.webmanifest       instalação como app
sw.js                      service worker: precache de tudo, funciona offline
favicon.png · icones/      ícone do app (SVG + PNG 180/192/512)
fontes-web/                Inter e JetBrains Mono locais — nada de CDN
css/fontes.css             @font-face apontando para fontes-web/
css/style.css              tema em variáveis no topo (claro/escuro)

js/dados.js                CATEGORIAS + PROTOCOLOS — o arquivo do dia a dia
js/subpastas.js            terceiro nível: em que gaveta cada conduta mora
js/queixas.js              QUEIXAS — a camada por sintoma
js/ferramentas-dados.js    quadros, medicações, ATB, manobras, textos
js/scores-dados.js         escores clínicos (estende FERR_CALC)
js/pediatria-dados.js      medicações pediátricas e vetos por idade
js/ferramentas.js          motor das seções (não precisa mexer)
js/app.js                  render, sumário, busca e rotas (não precisa mexer)
js/icones.js               ~45 ícones SVG inline
js/ui.js                   peso, ajustes, backup, gaveta, offline
```

## Navegação

Sumário lateral no desktop, barra inferior no celular (Buscar · Guia ·
Prescrições · Antibióticos · Mais — "Mais" abre a gaveta com o sumário inteiro,
nada fica escondido).

```
#                         início: busca, sala vermelha, queixas, favoritas, recentes, seções, áreas
#queixa · #queixa/<id>    queixas — porta de entrada por sintoma
#critico                  sala vermelha
#doses                    doses de emergência
#<area>                   capa da área, com as subpastas
#<area>/<subpasta>        condutas da subpasta
#<area>/<sub>/<id>        a conduta (o link curto #<area>/<id> também vale)
#presc                    prescrição por quadro clínico
#pediatria                doses pediátricas com calculadora
#atb · #atb/<sitio>       antibióticos
#calc · #scores           contas e escores
#prontuario/<pasta>       texto de prontuário
#favoritas
```

Rotas antigas continuam válidas: `#presc/oral|im|ev|especiais` caem em
`#presc`, `#presc/quadro` também cai em `#presc`, `#presc/pediatria` em
`#pediatria`, e `#ferramentas/*` nos seus destinos atuais.

## Ordem clínica de uma conduta

Preservada e **sem acordeões**: ficha rápida → **fluxograma** → red flags →
passo a passo → doses → demais blocos → prescrição mínima (quando existe nos
dados). Fluxogramas ficam visíveis por padrão, na posição original.

## Cartão de prescrição

Mostra só o que se copia: o alerta clínico, "Na unidade" e "Receita para casa".
Quatro ações: **Copiar**, **Imprimir** (folha limpa, só a prescrição),
**Área de escrita** (empilha e rola até a bancada) e **Ver a conduta**.

## Offline

O service worker faz precache de todo o app na instalação. Depois da primeira
visita, o guia abre sem rede: navegação cai no cache, e o resto é cache primeiro.
Quando há versão nova, aparece um aviso com botão de atualizar.

**Ao mudar conteúdo ou código, suba a constante `VERSAO` em `sw.js`** — é ela
que dispara a troca do cache.

Para instalar no celular: abrir no navegador e usar "Adicionar à tela de início".

## Segurança de decisão

- **Conferência antes de copiar** — prescrição e antibiótico passam por um
  checklist de peso, alergia, função renal, gestação, população e padronização
  local. Antibiótico ganha dois itens a mais: culturas/antibiograma e
  stewardship. Desligável em Ajustes.
- **Peso do paciente** na barra superior resolve todas as doses por quilo do
  guia, e alimenta a calculadora pediátrica.
- **Vetos por idade** na aba pediátrica: informe a idade e o que é proibido
  fica vermelho, com o motivo.
- **Prescrição rápida** em cada conduta é derivada das doses dela — não existe
  um segundo texto para desencontrar. É rascunho para conferir, não prescrição.

## Governança

Cada conduta mostra versão, data de revisão do texto, próxima revisão,
responsável técnico e a diretriz primária.

O responsável técnico é preenchido pelo serviço em **Ajustes**; o guia não
inventa um nome. Enquanto não houver responsável registrado e a caixa
"conteúdo revisado clinicamente" marcada, toda conduta exibe o aviso de
conteúdo não validado.

> **Estado atual: sem revisão clínica.** As 135 condutas, 16 queixas, 104
> quadros, 39 esquemas de antibiótico, 41 escores e 37 medicações pediátricas
> foram redigidos a partir das diretrizes citadas, com apoio de IA, e **não
> passaram por revisão médica**. Isso precisa acontecer antes de qualquer
> distribuição.

## Vocabulário visual

Ao criar tela nova, reutilize as classes de `css/style.css` em vez de redeclarar
borda, raio e fundo — é o que evita que as seções virem produtos diferentes:

| Classe | Para quê |
|---|---|
| `.u-cartao` | caixa branca com borda fina e realce ao passar o mouse |
| `.u-titulo` | título de bloco (11 px, versalete, cinza) |
| `.u-conta` | contagem em cápsula, alinhada à direita |
| `.u-nota` | texto secundário legível (13 px) |

Cores vêm sempre de variável: `--acento` para interação, `--fire` só para risco
clínico, `--amber` para atenção, `--verde` para pediatria e confirmação.

## Acessibilidade

- Foco visível consistente em links, botões, campos e navegação.
- Gaveta e painel de ajustes são diálogos: `role="dialog"`, `aria-modal`, foco
  inicial no botão de fechar, foco preso enquanto abertos, `inert` no conteúdo
  encoberto, Esc fecha e o foco volta para quem abriu.
- Alvos de toque de 44 px ou mais no celular.
- Gravidade e público nunca dependem só de cor: sempre ícone mais palavra.
- `prefers-reduced-motion` respeitado.
- Região `aria-live="polite"` (`#aviva`) anuncia cópia, resultado de escore,
  contagem da busca e troca de estado — a ação confirma mesmo sem mudança visível.
- Sem rolagem horizontal em 320, 390, 768 e 1400 px (19 rotas verificadas).

## Editar

`js/dados.js` é o arquivo do dia a dia. Uma conduta é:

```js
{ id, titulo, categoria, gravidade, resumo, tags:[], fonte,
  ficha:[{rotulo, valor}],
  secoes:[
    {tipo:'alerta',   titulo, itens:[]},
    {tipo:'fluxo',    titulo, itens:[{tipo:'inicio'|'passo'|'decisao'|'alerta'|'fim', rotulo, texto, nota, ramos:[]}]},
    {tipo:'doses',    titulo, itens:[{droga, dose, via, obs}]},
    {tipo:'naofazer'|'lista'|'dica', titulo, itens:[]},
    {tipo:'texto',    titulo, conteudo}
  ]}
```

Negrito no texto é `*assim*`, não `<b>`. Ao criar conduta nova, acrescente o id
em `js/subpastas.js` — há teste que acusa órfã, duplicada e colisão de id.

## Testes

Não há framework: os testes dirigem o Chrome headless por CDP com o WebSocket
nativo do Node. Sobem um servidor (`python3 -m http.server 8899`) e verificam
rotas, aritmética dos escores, doses pediátricas, acessibilidade da gaveta,
funcionamento offline e ausência de erro de console.
