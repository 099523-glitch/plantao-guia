/* ===========================================================
   BASE DE CONTEUDO — e o unico arquivo que precisa ser editado
   para adicionar condutas. Nao mexer no app.js.

   ESTADO ATUAL: esqueleto. Todas as condutas do guia estao
   cadastradas com titulo, resumo, gravidade, tags e a diretriz
   de referencia; `secoes: []` significa "ainda nao preenchida"
   (aparece a tarja cinza na pasta). Preencher uma a uma.

   COMO PREENCHER UMA CONDUTA
   --------------------------
   Trocar o `secoes: []` pelos blocos, e opcionalmente adicionar
   a `ficha`. A ordem no array e a ordem na pagina; a numeracao
   (01, 1.1, 1.2...) e automatica.

   {
     id: 'slug-unico',            // sem espaco/acento, vira ancora na URL
     titulo: 'Nome da conduta',
     categoria: 'cardio',         // id de uma CATEGORIA
     gravidade: 'emergencia',     // emergencia | urgencia | rotina
     resumo: 'Uma linha do que e.',
     tags: ['sinonimo','sintoma','droga'],   // so ajudam na busca
     fonte: 'Diretriz X, 2024',   // completar o ano ao preencher
     ficha: [                     // opcional, vira a tabela preta
       { rotulo:'Quando pensar', valor:'...' }
     ],
     secoes: [ ... ]
   }

   TIPOS DE SECAO (a ordem na tela e a ordem do array)
   ---------------------------------------------------
   { tipo:'alerta', titulo:'Red flags',        itens:[...] }   caixa vermelha
   { tipo:'passos', titulo:'Conduta imediata', itens:[...] }   lista com seta
   { tipo:'lista',  titulo:'Exames',           itens:[...] }   lista com seta
   { tipo:'naofazer', titulo:'Nao fazer',      itens:[...] }   borda vermelha
   { tipo:'dica',   titulo:'Pega do plantao',  itens:[...] }   caixa ambar
   { tipo:'texto',  titulo:'Observacoes',      conteudo:'...' }
   { tipo:'tempo',  titulo:'Linha do tempo', itens:[
       { quando:'0-10 min', o_que:'...' } ] }
   { tipo:'ordem',  titulo:'Diferenciais', itens:['...'] }     lista numerada
   { tipo:'doses',  titulo:'Medicacoes', itens:[
       { droga:'Nome', dose:'1 mg/kg', via:'EV', obs:'opcional' } ] }

   PRESCRICAO MINIMA  { tipo:'prescricao', titulo:'Prescricao minima', nota:'...', itens:[...] }
   -----------------  O que se escreve na folha, NA ORDEM em que se escreve.
   Caixa preta com botao "Copiar" que joga o texto no prontuario.

   { grupo:'Suporte' }                              divisoria dentro da lista
   { item:'AAS 300 mg', via:'VO', obs:'mastigado' } linha numerada
   { item:'Morfina 2-4 mg', via:'EV', se:'dor refrataria' }   condicional (ambar)

   `se` = so faz se a condicao for verdadeira; sai como [SE ...] ao copiar.
   `grupo` nao entra na numeracao. Ver `sca-com-supra` como modelo.

   FLUXOGRAMA  { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[...] }
   ----------  Caixas em CSS (nao SVG): refluem no celular e imprimem.
   Tipos de no dentro do array `itens`:

   { tipo:'inicio',  rotulo:'Suspeita', texto:'...', nota:'...' }  caixa preta, abre o fluxo
   { tipo:'passo',   rotulo:'...', texto:'...', nota:'...' }       caixa branca
   { tipo:'alerta',  rotulo:'...', texto:'...', nota:'...' }       caixa vermelha
   { tipo:'fim',     rotulo:'...', texto:'...', nota:'...' }       caixa ambar, fecha
   { tipo:'paralelo', colunas:[ {...}, {...} ] }                   caixas lado a lado
   { tipo:'decisao', texto:'A pergunta?', ramos:[
       { rotulo:'< 3,3', cor:'perigo', texto:'...', nota:'...' },
       { rotulo:'no alvo', cor:'ok',   texto:'...' },
       { rotulo:'outro',                texto:'...' } ] }

   `rotulo` e a tarja pequena; `nota` e a linha cinza menor embaixo.
   `cor` no ramo: 'perigo' (vermelho) | 'ok' (ambar) | omitir (branco).
   Ver `cetoacidose` como modelo.

   Negrito dentro de qualquer texto: usar *asteriscos*.

   ORDEM FIXA DOS BLOCOS  <-- seguir sempre, e o que faz o guia
   ------------------------  ser rapido de ler no plantao.
   A ordem nao muda de conduta para conduta: em duas semanas de uso
   se sabe de cor que a dose esta sempre no mesmo lugar da pagina.

   gravidade: 'emergencia'        gravidade: 'urgencia' | 'rotina'
   ------------------------       -------------------------------
   1. ficha                       1. ficha
   2. FLUXO    Fluxograma         2. FLUXO   Fluxograma
   3. alerta   Red flags          3. passos  Quando suspeitar
   4. passos   Conduta imediata   4. alerta  Red flags
   5. doses    Medicacoes         5. lista   Criterios / escore
   6. tempo    Linha do tempo     6. lista   Exames
   7. lista    Criterios dx       7. doses   Medicacoes
   8. lista    Exames             8. naofazer
   9. naofazer                    9. texto   Internacao x alta
  10. texto    Destino           10. dica    Pega do plantao
  11. dica     Pega do plantao

   O FLUXOGRAMA vem logo depois da ficha: e o mapa da conduta, lido
   em 10 segundos. Os blocos abaixo dele sao o detalhamento.

   Na emergencia a conduta sobe: quem abre a pasta ja suspeita do
   diagnostico e precisa do que fazer, nao de ser convencido.
   Bloco que nao se aplica: pular, sem inventar conteudo.

   LIMITES (para caber na tela)
   ----------------------------
   ficha: 3 linhas · alerta: ate 5 itens · passos: ate 7 itens,
   um por linha, comecando por verbo · dose SEMPRE na tabela `doses`,
   nunca dentro do texto · explicacao longa so no bloco `texto`, no fim.

   Ver `sca-com-supra` (emergencia) e `colica-renal` (urgencia)
   como modelo preenchido.
   =========================================================== */

const CATEGORIAS = [
  { id:'cardio',    nome:'Cardiovascular',      icone:'coracao' },
  { id:'resp',      nome:'Respiratório',        icone:'pulmao' },
  { id:'neuro',     nome:'Neurologia',          icone:'cerebro' },
  { id:'gastro',    nome:'Gastro e Abdome',     icone:'estomago' },
  { id:'infecto',   nome:'Infectologia',        icone:'virus' },
  { id:'endocrino', nome:'Endócrino',           icone:'gota' },
  { id:'nefro',     nome:'Nefro e Eletrólitos', icone:'rim' },
  { id:'psiq',      nome:'Psiquiatria',         icone:'mente' },
  { id:'trauma',    nome:'Trauma e Ortopedia',  icone:'osso' },
  { id:'pedia',     nome:'Pediatria',           icone:'crianca' },
  { id:'toxico',    nome:'Intoxicações',        icone:'perigo' },
  { id:'proced',    nome:'Procedimentos',       icone:'seringa' }
];

/* Paragrafo que abre cada capitulo. */
const INTRO_CATEGORIA = {
  cardio:    'Dor torácica, arritmia, choque e parada — o que precisa de decisão em minutos, com o relógio contra.',
  resp:      'Do desconforto respiratório à via aérea definitiva: quem ganha oxigênio, quem ganha VNI e quem precisa ser intubado agora.',
  neuro:     'Déficit súbito, convulsão e rebaixamento — reconhecer a janela terapêutica antes de pedir exame.',
  gastro:    'Sangramento, dor abdominal e descompensação hepática: separar o que é cirúrgico do que é clínico.',
  infecto:   'Febre e infecção grave no pronto-socorro — a hora da primeira dose de antibiótico é o desfecho.',
  endocrino: 'Descompensações metabólicas agudas: hiperglicemia, hipoglicemia, tireoide e adrenal.',
  nefro:     'Lesão renal aguda, distúrbios eletrolíticos e ácido-base — o que corrige devagar e o que corrige agora.',
  psiq:      'Agitação, risco de suicídio e abstinência: segurança do paciente e da equipe primeiro.',
  trauma:    'Atendimento inicial sistematizado ao trauma e as urgências ortopédicas do plantão.',
  pedia:     'Criança não é adulto pequeno: doses por peso, sinais de gravidade e hidratação.',
  toxico:    'Abordagem do intoxicado, antídotos e acidentes por animais peçonhentos.',
  proced:    'O passo a passo dos procedimentos que o plantonista faz: material, técnica e complicações.'
};

const PROTOCOLOS = [

  /* ======================= 01 · CARDIOVASCULAR ======================= */
  { id:'pcr-adulto', titulo:'Parada cardiorrespiratória no adulto', categoria:'cardio', gravidade:'emergencia',
    resumo:'RCP de alta qualidade, ritmos chocáveis e não chocáveis, drogas e cuidados pós-parada.',
    tags:['pcr','rcp','acls','fv','tv sem pulso','assistolia','aesp','adrenalina','desfibrilacao','5h 5t'],
    fonte:'SBC — Diretriz de Ressuscitação Cardiopulmonar e Emergências Cardiovasculares / ACLS · prescris (ACLS e ritmo de parada)',
    ficha:[
      { rotulo:'Quando pensar', valor:'Irresponsivo, sem respiração ou com *gasping*, e sem pulso central em até 10 segundos de checagem.' },
      { rotulo:'Prioridade',    valor:'*Compressão de alta qualidade e desfibrilação precoce.* Tudo o mais é secundário.' },
      { rotulo:'Meta',          valor:'Fração de compressão > 60%, interrupções < 10 s, desfibrilação assim que o ritmo for chocável.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Reconhecimento', texto:'Irresponsivo, sem respiração normal e *sem pulso*',
          nota:'Checagem de no máximo 10 segundos. Gasping é parada. Na dúvida, comprima' },
        { tipo:'passo', rotulo:'Imediato', texto:'*Compressões 30:2* + chamar ajuda + pedir desfibrilador',
          nota:'5–6 cm, 100–120/min, retorno completo do tórax, mínimo de interrupção' },
        { tipo:'decisao', texto:'Qual o ritmo no monitor?', ramos:[
          { rotulo:'FV / TV sem pulso', cor:'perigo', texto:'*CHOCAR imediatamente*',
            nota:'Adrenalina após o 2º choque · amiodarona 300 mg após o 3º' },
          { rotulo:'AESP / assistolia', texto:'*NÃO se choca.* Adrenalina 1 mg o quanto antes',
            nota:'Aqui o desfecho depende de achar a causa' }
        ]},
        { tipo:'passo', rotulo:'A cada 2 min', texto:'Checar ritmo · trocar quem comprime · adrenalina a cada 3–5 min',
          nota:'Alguém cronometra em voz alta. Capnografia < 10 mmHg indica compressão ruim' },
        { tipo:'passo', rotulo:'Causa reversível', texto:'*5H e 5T* — procurar desde o segundo ciclo',
          nota:'Hipovolemia · Hipóxia · H+ · Hipo/hiperK · Hipotermia · Tensão no tórax · Tamponamento · Toxinas · Trombose coronariana · Trombose pulmonar' },
        { tipo:'decisao', texto:'Houve retorno de circulação espontânea?', ramos:[
          { rotulo:'Ainda não', texto:'Manter os ciclos e reavaliar as causas',
            nota:'Encerrar o esforço é decisão clínica e coletiva — prolongar em hipotermia, intoxicação, gestante e afogamento' },
          { rotulo:'Sim — RCE', cor:'ok', texto:'Entrar nos *cuidados pós-parada*' }
        ]},
        { tipo:'fim', rotulo:'Pós-RCE', texto:'*UTI* — SpO2 92–98%, normocapnia, PAM ≥ 65',
          nota:'ECG de 12 derivações imediato · cateterismo se supra · controle direcionado de temperatura' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Não perder tempo checando pulso* — mais de 10 s de checagem já é atraso. Na dúvida, comprima.',
        'Gasping é sinal de parada, *não* de respiração — trate como PCR.',
        'Ritmo chocável (FV/TV sem pulso) exige o choque no menor tempo possível: cada minuto de atraso derruba a sobrevida.',
        'Assistolia na tela: confirmar o *protocolo da linha reta* — checar cabos, ganho e derivação — antes de assumir.',
        'Parada em paciente jovem, gestante ou com hipotermia muda a conduta e prolonga o esforço de ressuscitação.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        'Checar responsividade, respiração e pulso central em *até 10 segundos*, simultaneamente.',
        'Chamar ajuda e pedir *carro de parada e desfibrilador* no mesmo comando.',
        'Iniciar compressões: centro do tórax, *5–6 cm de profundidade, 100–120/min*, retorno completo do tórax, minimizando interrupções.',
        '*30:2* enquanto a via aérea não é avançada; após via aérea avançada, compressão contínua com 1 ventilação a cada 6 s.',
        'Assim que o monitor chegar: *checar ritmo* e classificar em chocável ou não chocável.',
        'Acesso venoso ou intraósseo, sem interromper as compressões.',
        'Rodar ciclos de *2 minutos*, trocando quem comprime a cada ciclo para não perder qualidade.',
        'Procurar ativamente as causas reversíveis (5H e 5T) desde o segundo ciclo.'
      ]},
      { tipo:'ordem', titulo:'Ritmo CHOCÁVEL — FV e TV sem pulso', itens:[
        '*Choque imediato* — bifásico 200 J (ou máximo do aparelho); monofásico 360 J. Retomar compressão na hora, sem checar pulso.',
        '2 min de RCP · acesso venoso · preparar adrenalina · checar ritmo.',
        '2º choque · RCP · *adrenalina 1 mg* com flush de 20 mL e elevação do membro · preparar amiodarona · considerar via aérea avançada.',
        '3º choque · RCP · *amiodarona 300 mg* (ou lidocaína) · considerar os 5H e 5T.',
        '4º choque · RCP · *adrenalina 1 mg* (mantendo a cada 3–5 min).',
        '5º choque · RCP · *amiodarona 150 mg*, a segunda e última dose.'
      ]},
      { tipo:'ordem', titulo:'Ritmo NÃO CHOCÁVEL — AESP e assistolia', itens:[
        '*Não se choca.* Iniciar RCP imediatamente e manter ciclos de 2 minutos.',
        'Acesso venoso ou intraósseo e *adrenalina 1 mg o quanto antes*, repetindo a cada 3–5 min.',
        'Via aérea avançada quando houver quem a faça sem parar as compressões.',
        'Checar ritmo a cada 2 min: se virar chocável, entra no algoritmo do choque.',
        '*A conduta aqui é caçar a causa* — em AESP e assistolia o desfecho depende de achar e tratar o 5H/5T.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Adrenalina', dose:'1 mg a cada 3–5 min', via:'EV/IO', obs:'Ampola 1 mg/mL. Seguir de *flush de 20 mL de SF e elevar o membro*. Em ritmo não chocável, administrar o quanto antes.' },
        { droga:'Amiodarona', dose:'300 mg na 1ª dose · 150 mg na 2ª', via:'EV/IO', obs:'Diluir em 100–250 mL de SG 5%. Só em FV/TV sem pulso refratária ao choque.' },
        { droga:'Lidocaína', dose:'1–1,5 mg/kg', via:'EV/IO', obs:'Alternativa à amiodarona quando não disponível.' },
        { droga:'Sulfato de magnésio', dose:'1–2 g', via:'EV/IO', obs:'*Apenas na torsades de pointes*, não de rotina.' },
        { droga:'Bicarbonato de sódio', dose:'1 mEq/kg', via:'EV', obs:'Não é rotina. Reservado a hipercalemia, acidose grave prévia e intoxicação por tricíclicos.' },
        { droga:'Gluconato de cálcio', dose:'1 g', via:'EV', obs:'Hipercalemia, hipocalcemia e intoxicação por bloqueador de canal de cálcio.' }
      ]},
      { tipo:'lista', titulo:'Causas reversíveis — 5H e 5T', itens:[
        '*H:* Hipovolemia · Hipóxia · Hidrogênio (acidose) · Hipo/hipercalemia · Hipotermia.',
        '*T:* Tensão no tórax (pneumotórax hipertensivo) · Tamponamento · Toxinas · Trombose coronariana · Trombose pulmonar.',
        'O POCUS à beira do leito responde rápido a tamponamento, pneumotórax, hipovolemia e disfunção de VD — use nas pausas de checagem de ritmo.',
        'Glicemia capilar e gasometria com eletrólitos assim que houver acesso.'
      ]},
      { tipo:'tempo', titulo:'Linha do tempo', itens:[
        { quando:'0–10 s',   o_que:'Reconhecimento: irresponsivo, sem respiração normal, sem pulso.' },
        { quando:'≤ 1 min',  o_que:'Compressões iniciadas e ajuda acionada com pedido de desfibrilador.' },
        { quando:'≤ 3 min',  o_que:'Monitor acoplado, ritmo checado e *choque entregue se chocável*.' },
        { quando:'A cada 2 min', o_que:'Checagem de ritmo, troca de quem comprime, reavaliação dos 5H/5T.' },
        { quando:'3–5 min',  o_que:'Adrenalina, repetindo no mesmo intervalo enquanto durar a parada.' },
        { quando:'Pós-RCE',  o_que:'Cuidados pós-parada: alvo de SpO2 92–98%, normocapnia, PAM ≥ 65, ECG de 12 derivações e controle de temperatura.', fim:true }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Interromper compressão para intubar, puncionar acesso ou discutir caso.',
        'Chocar assistolia ou AESP — *não são ritmos chocáveis*.',
        'Checar pulso logo depois do choque: retome a compressão imediatamente e só cheque no fim do ciclo de 2 min.',
        'Hiperventilar — reduz o retorno venoso e piora a perfusão coronariana.',
        'Bicarbonato e cálcio de rotina, sem indicação específica.',
        'Encostar no leito no momento do choque, ou disparar sem o aviso em voz alta.'
      ]},
      { tipo:'texto', titulo:'Destino e término do esforço', conteudo:'Com retorno de circulação espontânea (RCE), o paciente vai para *UTI* sob cuidados pós-parada: evitar hiperóxia (SpO2 92–98%), manter normocapnia, PAM ≥ 65 mmHg com vasopressor se necessário, ECG de 12 derivações imediato e cateterismo se houver supra ou suspeita de causa coronariana, além de controle direcionado de temperatura. A decisão de *encerrar o esforço* é clínica e coletiva — considera ritmo persistentemente não chocável, tempo total de parada, ausência de causa reversível e capnografia persistentemente baixa —, e prolonga-se em hipotermia, intoxicação, gestante e afogamento.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Alguém precisa *cronometrar em voz alta* os ciclos de 2 min e o intervalo da adrenalina — sem isso o tempo na sala se perde e as drogas atrasam.',
        'Trocar quem comprime a cada 2 minutos não é cortesia: a qualidade da compressão cai muito antes de a pessoa dizer que cansou.',
        'Capnografia é o melhor termômetro da RCP: ETCO2 abaixo de 10 mmHg indica compressão ruim; um salto súbito costuma ser o RCE.',
        'Assistolia na tela sem explicação: cheque cabo, ganho e derivação antes de aceitar o diagnóstico.',
        'Em ritmo não chocável, a adrenalina é *precoce*; em ritmo chocável, ela vem depois do segundo choque — a ordem é diferente e é onde mais se erra.'
      ]}
    ] },

  { id:'sca-com-supra', titulo:'SCA com supra de ST (IAMCSST)', categoria:'cardio', gravidade:'emergencia',
    resumo:'Diagnóstico no ECG, escolha entre angioplastia primária e trombólise, e o tempo de cada uma.',
    tags:['iam','infarto','stemi','supra','trombolise','angioplastia','reperfusao'],
    fonte:'SBC — Diretriz de IAM com Supradesnivelamento do Segmento ST',
    ficha:[
      { rotulo:'Quando pensar', valor:'Dor torácica em aperto >20 min, em repouso, com sudorese, náusea ou irradiação. *No diabético, idoso e na mulher pode ser só dispneia, síncope ou epigastralgia.*' },
      { rotulo:'Prioridade',    valor:'*Sala vermelha.* O relógio começa no primeiro contato médico, não na chegada.' },
      { rotulo:'Meta',          valor:'Reperfusão: *porta-balão ≤ 90 min* ou *porta-agulha ≤ 30 min*.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*Dor torácica anginosa*',
          nota:'No diabético, idoso e na mulher pode ser só dispneia, síncope ou epigastralgia' },
        { tipo:'passo', rotulo:'≤ 10 minutos', texto:'MOV + *ECG de 12 derivações interpretado*',
          nota:'Acrescentar *V7–V9* (dorsal) e *V3R–V4R* (ventrículo direito). Oxigênio só se SpO2 < 90%' },
        { tipo:'decisao', texto:'Há supra de ST — ou BRE novo, ou marca-passo?', ramos:[
          { rotulo:'Não', texto:'*SCASSST* — protocolo de dor torácica, seriar ECG e troponina' },
          { rotulo:'Sim', cor:'perigo', texto:'*SCACSST — reperfusão imediata*' }
        ]},
        { tipo:'passo', rotulo:'Agora, na maca', texto:'*AAS 300 mg mastigado* + 2º antiagregante + anticoagulante',
          nota:'Clopidogrel 600 mg se ICP · 300 mg se trombólise · *75 mg se > 75 anos em trombólise*' },
        { tipo:'decisao', texto:'A hemodinâmica é alcançável em até 120 minutos?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'*ICP primária* — porta-balão ≤ 90 min' },
          { rotulo:'Não', texto:'*Trombólise* — porta-agulha ≤ 30 min',
            nota:'Rodar a lista de contraindicações em voz alta com a equipe antes' }
        ]},
        { tipo:'alerta', rotulo:'Pegadinha do supra', texto:'*Parede inferior? V3R e V4R antes do nitrato*',
          nota:'No IAM de ventrículo direito não se faz nitrato, morfina, betabloqueador nem diurético — é pré-carga-dependente. Se hipotenso, volume em alíquotas de 250 mL' },
        { tipo:'decisao', texto:'Trombolisou — houve critério de reperfusão em 60–90 min?', ramos:[
          { rotulo:'Não', cor:'perigo', texto:'*ICP de resgate*' },
          { rotulo:'Sim', cor:'ok', texto:'Coronariografia entre 3 e 24 h',
            nota:'Queda do supra > 50%, alívio da dor, ritmo de reperfusão' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'*UCO ou UTI*, monitorizado, por 24–48 h',
          nota:'Não existe alta do pronto-socorro. Sem hemodinâmica no serviço: trombolisar *antes* de transferir' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Killip III/IV — congestão pulmonar ou choque cardiogênico.',
        'Supra em parede inferior *com hipotensão* — pensar em IAM de ventrículo direito antes de dar nitrato.',
        'Supra em aVR com infra difuso — sugere lesão de tronco ou multiarterial.',
        'Arritmia ventricular ou bradicardia com bloqueio — desfibrilador ao lado do leito.',
        'Dor com assimetria de pulsos ou mediastino alargado — descartar dissecção antes de anticoagular.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*ECG de 12 derivações em até 10 minutos* da chegada, interpretado por médico.',
        '*MOV* — monitor, oximetria, dois acessos venosos calibrosos. Oxigênio *apenas* se SpO2 < 90%.',
        '*AAS mastigado agora*, ainda na maca, antes de qualquer outra coisa.',
        'Definir a estratégia de reperfusão *no mesmo momento do diagnóstico* — ICP primária se hemodinâmica alcançável em até 120 min; caso contrário, trombólise.',
        'Acionar hemodinâmica ou a regulação de transferência antes de completar a prescrição.',
        'Segundo antiagregante e anticoagulante conforme a estratégia escolhida.',
        'Nitrato e morfina só se houver dor, hipertensão ou congestão — e nunca antes de checar o VD.'
      ]},
      { tipo:'prescricao', titulo:'Prescrição mínima', nota:'Adulto ~70 kg, sala vermelha, *antes* de a reperfusão acontecer. Conferir peso, função renal e alergias. Os itens em âmbar só entram se a condição for verdadeira.', itens:[

        { grupo:'Suporte — vale para todo IAMCSST' },
        { item:'Dieta zero', obs:'Até a estratégia de reperfusão estar definida.' },
        { item:'Repouso no leito, cabeceira 30°' },
        { item:'Monitorização contínua: cardioscopia, oximetria e PA não invasiva', obs:'*Desfibrilador ao lado do leito* — a arritmia vem nas primeiras horas.' },
        { item:'Dois acessos venosos periféricos calibrosos' },
        { item:'O2 cateter nasal 2–3 L/min', via:'IN', se:'SpO2 < 90%', obs:'Com SpO2 ≥ 90% o oxigênio *aumenta* a área de infarto.' },

        { grupo:'Agora, na maca — antes de completar o resto' },
        { item:'AAS 300 mg', via:'VO', obs:'*Mastigado.* É a primeira coisa a ser dada. Manutenção 100 mg/dia.' },
        { item:'Clopidogrel 600 mg (ICP) · 300 mg (trombólise)', via:'VO', obs:'*≥ 75 anos em trombólise: 75 mg, sem ataque.* Alternativa na ICP: ticagrelor 180 mg VO — nunca após trombólise nem com AVC hemorrágico prévio.' },
        { item:'Enoxaparina 30 mg em bolus + 1 mg/kg 12/12 h', via:'EV + SC', obs:'*≥ 75 anos: sem bolus e 0,75 mg/kg.* ClCr < 30: 1 mg/kg 24/24 h. HNF 60 U/kg (máx. 4.000 U) + 12 U/kg/h se preferir na ICP ou na disfunção renal.' },
        { item:'Atorvastatina 80 mg', via:'VO', obs:'Ainda na fase aguda, independente do LDL.' },

        { grupo:'Sintomáticos — só com indicação' },
        { item:'Nitroglicerina 5–10 mcg/min em BIC, titular', via:'EV', se:'dor mantida, PAS > 90 mmHg, *VD descartado* e sem inibidor de PDE5 nas últimas 24–48 h', obs:'Parede inferior sem V3R/V4R = não prescrever.' },
        { item:'Morfina 2–4 mg, repetir se necessário', via:'EV', se:'dor refratária ao nitrato', obs:'Reduz a absorção do antiagregante oral — não usar por conforto.' },
        { item:'Ondansetrona 4–8 mg', via:'EV', se:'náusea ou vômito' },

        { grupo:'Solicitar na mesma folha' },
        { item:'ECG de 12 derivações seriado, com V3R–V4R e V7–V9', obs:'A cada 10–15 min enquanto houver dor.' },
        { item:'Troponina, hemograma, ureia e creatinina, eletrólitos, glicemia e coagulograma', obs:'*Colher, mas não esperar a troponina para reperfundir.*' },
        { item:'Radiografia de tórax no leito', obs:'Sem atrasar a reperfusão.' },

        { grupo:'Reperfusão — a decisão, não a prescrição' },
        { item:'ICP primária, porta-balão ≤ 90 min', se:'hemodinâmica alcançável em até 120 min' },
        { item:'Tenecteplase em bolus único conforme peso, porta-agulha ≤ 30 min', via:'EV', se:'a ICP *não* é alcançável em 120 min', obs:'*Meia dose se ≥ 75 anos.* Rodar a lista de contraindicações em voz alta com a equipe antes.' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'AAS',            dose:'150–300 mg (ataque)', via:'VO', obs:'Mastigado ou macerado. Manutenção 100 mg/dia.' },
        { droga:'Clopidogrel',    dose:'600 mg se ICP · 300 mg se trombólise', via:'VO', obs:'*Acima de 75 anos em trombólise: 75 mg, sem ataque.*' },
        { droga:'Ticagrelor',     dose:'180 mg (ataque)', via:'VO', obs:'Alternativa ao clopidogrel na ICP. Não usar após trombólise nem com histórico de AVC hemorrágico.' },
        { droga:'Enoxaparina',    dose:'30 mg EV em bolus + 1 mg/kg 12/12 h', via:'EV + SC', obs:'*Acima de 75 anos: sem bolus e 0,75 mg/kg.* Ajustar se clearance < 30.' },
        { droga:'Heparina não fracionada', dose:'60 U/kg em bolus (máx. 4.000 U) + 12 U/kg/h', via:'EV', obs:'Opção quando a estratégia é ICP primária ou há disfunção renal.' },
        { droga:'Tenecteplase',   dose:'Bolus único conforme peso', via:'EV', obs:'Meia dose se ≥ 75 anos. Conferir a tabela de peso e a lista de contraindicações antes.' },
        { droga:'Nitroglicerina', dose:'5–10 mcg/min, titular', via:'EV', obs:'*Contraindicada* em IAM de VD, PAS < 90 e uso de inibidor de PDE5 nas últimas 24–48 h.' },
        { droga:'Morfina',        dose:'2–4 mg, repetir se necessário', via:'EV', obs:'Só para dor refratária ao nitrato — reduz a absorção do antiagregante oral.' },
        { droga:'Atorvastatina',  dose:'80 mg', via:'VO', obs:'Dose alta ainda na fase aguda, independente do LDL.' }
      ]},
      { tipo:'tempo', titulo:'Linha do tempo', itens:[
        { quando:'0–10 min',   o_que:'ECG feito e interpretado, monitorização, acesso venoso e *AAS administrado*.' },
        { quando:'≤ 10 min',   o_que:'Estratégia de reperfusão decidida e hemodinâmica/transferência acionada.' },
        { quando:'≤ 30 min',   o_que:'*Porta-agulha* — trombolítico infundido, quando a ICP não é alcançável em 120 min.' },
        { quando:'≤ 90 min',   o_que:'*Porta-balão* — ICP primária no serviço com hemodinâmica.' },
        { quando:'60–90 min pós-trombólise', o_que:'Reavaliar critérios de reperfusão: queda do supra > 50%, alívio da dor, ritmo de reperfusão. Sem critérios, *ICP de resgate*.' },
        { quando:'3–24 h',     o_que:'Coronariografia após trombólise bem-sucedida.', fim:true }
      ]},
      { tipo:'lista', titulo:'Critérios de supra no ECG', itens:[
        'Supra de ST ≥ 1 mm em duas derivações contíguas.',
        'Em V2–V3: ≥ 2 mm em homens ≥ 40 anos, ≥ 2,5 mm em homens < 40 anos, ≥ 1,5 mm em mulheres.',
        'Bloqueio de ramo esquerdo *novo ou presumivelmente novo* com quadro clínico compatível.',
        'Parede inferior: repetir com *V3R e V4R* (ventrículo direito) e *V7–V9* (dorsal).',
        'Infra de ST em V1–V3 com R alto pode ser supra dorsal — não é isquemia subendocárdica.'
      ]},
      { tipo:'lista', titulo:'Exames iniciais', itens:[
        'ECG seriado a cada 10–15 min enquanto houver dor, e após qualquer mudança clínica.',
        'Troponina — *colher, mas não esperar o resultado para reperfundir.*',
        'Hemograma, função renal, eletrólitos, glicemia e coagulograma.',
        'Radiografia de tórax, sem atrasar a reperfusão.',
        'Ecocardiograma se houver dúvida diagnóstica, instabilidade ou suspeita de complicação mecânica.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Oxigênio de rotina com SpO2 ≥ 90% — aumenta a área de infarto.',
        'Nitrato antes de descartar IAM de ventrículo direito, ou com hipotensão e uso de sildenafil.',
        'AINE ou corticoide para a dor (o AAS é a exceção).',
        'Esperar a troponina para decidir a reperfusão.',
        'Betabloqueador endovenoso de rotina em paciente congesto, hipotenso ou bradicárdico.',
        'Transferir sem trombolisar quando a ICP vai levar mais de 120 minutos.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'Todo IAMCSST vai para *unidade coronariana ou UTI*, monitorizado, por no mínimo 24–48 h após a reperfusão. Não existe alta do pronto-socorro. Se o serviço não tem hemodinâmica, o paciente é trombolisado *antes* da transferência e transferido em ambulância com médico, monitor e desfibrilador. Killip III/IV, arritmia ventricular ou complicação mecânica exigem vaga de UTI antes de qualquer transporte eletivo.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Todo supra de parede inferior merece V3R/V4R e V7–V9 *antes* de o nitrato ser prescrito — o IAM de VD é pré-carga-dependente e o nitrato derruba a pressão.',
        'Dor torácica com ECG normal não descarta nada: o ECG inicial é normal em parte dos infartos. Repita.',
        'O tempo que conta é o do *primeiro contato médico*, não o da porta do seu hospital — inclui o tempo de ambulância e de transferência.',
        'Antes do trombolítico, rodar a lista de contraindicações em voz alta com a equipe. É o único momento em que dá para voltar atrás.'
      ]}
    ] },

  { id:'sca-sem-supra', titulo:'SCA sem supra de ST e angina instável', categoria:'cardio', gravidade:'emergencia',
    resumo:'Estratificação de risco (GRACE/HEART), antiagregação, anticoagulação e quem vai para cateterismo precoce.',
    tags:['iamssst','angina instavel','troponina','grace','heart score'],
    fonte:'SBC — Diretriz de SCA sem Supradesnivelamento do Segmento ST',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Instabilidade, insuficiência cardíaca, arritmia ventricular ou angina refratária: *cateterismo em menos de 2 horas*.',
        'Bloqueio de ramo esquerdo *novo* com clínica de infarto equivale a supra: acione a reperfusão.',
        'Infra de ST em 6 ou mais derivações com supra em aVR: lesão de tronco ou proximal de descendente anterior.',
        'ECG normal não exclui: repita a cada 15 a 30 minutos enquanto houver dor.',
        'Betabloqueador é proibido em insuficiência cardíaca, bloqueio, broncoespasmo e uso de cocaína.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor torácica anginosa sem supradesnivelamento de ST' },
        { tipo:'passo', rotulo:'Em 10 minutos', texto:'*ECG de 12 derivações + monitorização + acesso + troponina*',
          nota:'Repetir o ECG a cada 15 a 30 min se a dor persistir. Curva de troponina' },
        { tipo:'passo', rotulo:'A-B-C-C-C', texto:'*AAS · Betabloqueador · Captopril · Clopidogrel · Colesterol · Clexane*',
          nota:'AAS 300 mg mastigado no primeiro momento. Ver as contraindicações de cada um' },
        { tipo:'passo', rotulo:'Anti-isquêmico', texto:'Nitrato sublingual se a dor persistir e a PAS for maior que 100',
          nota:'Proibido em infarto de VD, PAS abaixo de 90 e uso de sildenafil nas últimas 24 h' },
        { tipo:'decisao', texto:'Qual a estratificação de risco?', ramos:[
          { rotulo:'Muito alto risco', cor:'perigo', texto:'*Cateterismo em menos de 2 horas*',
            nota:'Instabilidade, insuficiência cardíaca, arritmia ventricular, dor refratária, complicação mecânica' },
          { rotulo:'Alto risco — GRACE acima de 140 ou troponina em curva', texto:'*Cateterismo em até 24 horas*' },
          { rotulo:'Intermediário', texto:'Cateterismo em até 72 horas' },
          { rotulo:'Baixo — HEART baixo, troponina negativa seriada', cor:'ok', texto:'Teste não invasivo antes da alta' }
        ]},
        { tipo:'fim', rotulo:'Sempre', texto:'Internar em leito monitorizado; nunca liberar dor torácica sem estratificação' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Ácido acetilsalicílico', dose:'300 mg (3 comprimidos de 100 mg)', via:'VO', obs:'Mastigado, no primeiro momento. Manutenção de 100 mg/dia.' },
        { droga:'Clopidogrel', dose:'300 mg de ataque (4 comprimidos)', via:'VO', obs:'Depois 75 mg/dia. Segurar o ataque se houver cateterismo em menos de 24 h e possibilidade cirúrgica.' },
        { droga:'Ticagrelor', dose:'180 mg de ataque, depois 90 mg de 12/12 h', via:'VO', obs:'Alternativa ao clopidogrel, com maior potência.' },
        { droga:'Enoxaparina', dose:'1 mg/kg', via:'SC', obs:'De 12/12 h. Não usar em instável, clearance abaixo de 15 ou peso acima de 150 kg.' },
        { droga:'Atenolol 25 a 100 mg ou metoprolol', dose:'Conforme a PA e a FC', via:'VO', obs:'De 12/12 h. Contraindicado em IC, BAV, broncoespasmo, cocaína, PAS abaixo de 120 ou FC acima de 110.' },
        { droga:'Captopril 25 mg', dose:'1 comprimido', via:'VO', obs:'Nas primeiras 24 h, se não houver hipotensão.' },
        { droga:'Atorvastatina', dose:'40 a 80 mg', via:'VO', obs:'Dose alta, independentemente do perfil lipídico inicial.' },
        { droga:'Mononitrato de isossorbida 5 mg', dose:'1 comprimido', via:'SL', obs:'A cada 5 min, até 3 doses, se a dor persistir. Ver contraindicações.' },
        { droga:'Morfina', dose:'2 a 4 mg', via:'EV', obs:'A cada 5 min, SOMENTE se dor refratária. Não de rotina.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Liberar dor torácica sem curva de troponina e sem estratificação de risco.',
        'Betabloqueador nas contraindicações — sobretudo em insuficiência cardíaca aguda e cocaína.',
        'Nitrato em infarto de ventrículo direito, hipotensão ou uso recente de sildenafil.',
        'Morfina de rotina: associa-se a pior desfecho.',
        'Oxigênio se a saturação for maior que 90%: não ajuda e pode piorar.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo SCA sem supra interna em leito monitorizado. A estratificação define o tempo até o cateterismo. Aplicar *GRACE* e *HEART* e registrar. Antes da alta, prevenção secundária completa: dupla antiagregação, estatina de alta potência, betabloqueador, IECA e reabilitação cardíaca, além de cessação do tabagismo.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'ECG seriado é o exame mais barato e mais útil: repita.',
        'Troponina isolada não fecha nem exclui — o que vale é a curva.',
        'Registre a hora do início da dor: define tudo daqui para frente.'
      ]}
    ] },

  { id:'dor-toracica', titulo:'Dor torácica: triagem e diferenciais', categoria:'cardio', gravidade:'urgencia',
    resumo:'Como separar as quatro causas que matam das causas benignas nos primeiros 10 minutos.',
    tags:['dor toracica','precordialgia','ecg','triagem','diferencial'],
    fonte:'SBC — Diretriz de Dor Torácica na Emergência',
    secoes:[
      { tipo:'alerta', titulo:'As cinco causas que matam', itens:[
        '*Síndrome coronariana aguda* — ECG em 10 minutos.',
        '*Dissecção de aorta* — dor lancinante, assimetria de pulso ou de PA entre os braços.',
        '*Tromboembolismo pulmonar* — dispneia, taquicardia, hipoxemia, fator de risco.',
        '*Pneumotórax hipertensivo* — MV abolido, hipertimpanismo, desvio de traqueia.',
        '*Ruptura esofágica* — vômito intenso seguido de dor e enfisema subcutâneo.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor torácica no pronto atendimento' },
        { tipo:'passo', rotulo:'Em 10 minutos', texto:'*ECG de 12 derivações* + sinais vitais nos dois braços + oximetria',
          nota:'Monitorização e acesso venoso antes de qualquer coisa' },
        { tipo:'decisao', texto:'O ECG mostra supra de ST?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Acionar a rede de reperfusão* — ver a conduta de IAM com supra' },
          { rotulo:'Não', texto:'Seguir a investigação das causas graves' }
        ]},
        { tipo:'passo', rotulo:'Caracterizar a dor', texto:'Início, qualidade, irradiação, duração, fatores de melhora e piora',
          nota:'Lancinante que irradia para o dorso: aorta. Ventilatório-dependente: pleura ou pericárdio. Em queimação pós-prandial: esôfago' },
        { tipo:'decisao', texto:'Qual o padrão predominante?', ramos:[
          { rotulo:'Anginosa', texto:'*Curva de troponina + HEART* — ver SCA sem supra' },
          { rotulo:'Lancinante, assimetria de pulso', cor:'perigo', texto:'*Angiotomografia de aorta* — controlar FC e PA' },
          { rotulo:'Dispneia + taquicardia + fator de risco', cor:'perigo', texto:'*Wells + D-dímero ou angiotomografia*' },
          { rotulo:'Ventilatório-dependente com atrito', texto:'Pericardite — ECG com supra difuso côncavo e infra de PR' },
          { rotulo:'Reprodutível à palpação, sem red flag', cor:'ok', texto:'Provável musculoesquelética — sintomático e retorno' }
        ]},
        { tipo:'fim', rotulo:'Antes da alta', texto:'Aplicar HEART, documentar troponina seriada e ECG, e garantir seguimento' }
      ]},
      { tipo:'doses', titulo:'Medidas iniciais', itens:[
        { droga:'ECG de 12 derivações', dose:'Em até 10 minutos', via:'—', obs:'Acrescentar V7 a V9 e V3R a V4R conforme a suspeita. Repetir se a dor persistir.' },
        { droga:'Ácido acetilsalicílico', dose:'300 mg mastigado', via:'VO', obs:'Se a suspeita é coronariana e não há contraindicação.' },
        { droga:'Dipirona 2 g', dose:'2 ampolas', via:'EV', obs:'Analgesia para dor não isquêmica.' },
        { droga:'Mononitrato de isossorbida 5 mg', dose:'1 comprimido', via:'SL', obs:'Na suspeita coronariana com PAS acima de 100. Contraindicado em VD e com sildenafil.' },
        { droga:'Metoprolol', dose:'5 mg', via:'EV', obs:'Na suspeita de dissecção: baixar a FC ANTES do vasodilatador. Alvo de FC abaixo de 60.' },
        { droga:'Omeprazol 40 mg', dose:'1 frasco', via:'EV', obs:'Se a suspeita for esofágica ou péptica — mas nunca use "teste terapêutico" para excluir isquemia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Excluir infarto porque a dor melhorou com antiácido ou com analgésico: não serve como teste diagnóstico.',
        'Excluir isquemia porque a dor é reprodutível à palpação — pode coexistir.',
        'Anticoagular antes de afastar dissecção de aorta quando há assimetria de pulso.',
        'Liberar sem ECG seriado e sem curva de troponina em dor anginosa.',
        'Esquecer de medir a PA nos dois braços.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* possível com HEART baixo (0 a 3), duas troponinas negativas com intervalo adequado, ECG seriado normal e ausência de red flag — com seguimento ambulatorial e teste não invasivo programado. *Internar* com HEART moderado ou alto, troponina positiva ou em curva, alteração no ECG, ou qualquer das cinco causas graves suspeitada. Na dúvida, observe: dor torácica liberada indevidamente é a principal causa de processo em emergência.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Meça a pressão nos dois braços em toda dor torácica: é gratuito e acha dissecção.',
        'Registre o horário de cada ECG e de cada troponina.',
        'O HEART é rápido e defensável: use e documente.'
      ]}
    ] },

  { id:'eap-ic-descompensada', titulo:'Edema agudo de pulmão e IC descompensada', categoria:'cardio', gravidade:'emergencia',
    resumo:'Perfis hemodinâmicos, VNI, vasodilatador e diurético — e por que o paciente seco não melhora com furosemida.',
    tags:['eap','edema agudo','insuficiencia cardiaca','congestao','nitroglicerina','furosemida','vni','icad','perfil'],
    fonte:'SBC — Diretriz Brasileira de Insuficiência Cardíaca Aguda · Manual de Cardiologia na Prática 3.0, p. 34–35, 43–51 · PS Zerado, p. 13–15',
    ficha:[
      { rotulo:'Quando pensar', valor:'Dispneia súbita e intensa, ortopneia, estertores difusos, sudorese, muitas vezes com PA elevada.' },
      { rotulo:'Prioridade',    valor:'*VNI precoce* — melhora mais rápido que qualquer droga e evita intubação.' },
      { rotulo:'Meta',          valor:'No EAP hipertensivo: *reduzir a PAS para < 140 mmHg em 1 hora*, com diurese de 1 mL/kg/h.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dispneia súbita, ortopneia, estertores difusos, sudorese' },
        { tipo:'passo', rotulo:'Primeira medida', texto:'MOVE com *VNI precoce* + paciente sentado',
          nota:'A VNI alivia em minutos e evita intubação — não deixe para depois da furosemida' },
        { tipo:'decisao', texto:'Qual o perfil hemodinâmico? (congestão × perfusão)', ramos:[
          { rotulo:'B — quente e úmido', texto:'*Diurético + vasodilatador*',
            nota:'O mais comum: congesto e bem perfundido' },
          { rotulo:'C — frio e úmido', cor:'perigo', texto:'*Choque cardiogênico* — inotrópico + suporte',
            nota:'Congesto e mal perfundido. Dobutamina 5 mcg/kg/min' },
          { rotulo:'L — frio e seco', cor:'perigo', texto:'*HIDRATAR* — não dar furosemida',
            nota:'Muitas vezes é excesso de diurético. Aqui a furosemida piora tudo' }
        ]},
        { tipo:'passo', rotulo:'Perfil B e C congestos', texto:'*Furosemida 1–2 mg/kg EV* + vasodilatador',
          nota:'Nitroglicerina se há SCA · nitroprussiato se é hipertensivo puro. Morfina 2–4 mg só se necessário' },
        { tipo:'passo', rotulo:'Em paralelo', texto:'*Procurar o gatilho*: SCA, arritmia, má adesão, infecção, anti-inflamatório',
          nota:'Tratar a arritmia às vezes resolve a congestão sozinho' },
        { tipo:'decisao', texto:'Alvos alcançados? (PAS < 140 em 1 h · diurese 1 mL/kg/h)', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'Manter e reavaliar o perfil a cada turno' },
          { rotulo:'Não', texto:'*Reavaliar o perfil* · dobrar a dose no usuário crônico · infusão contínua · tiazídico associado',
            nota:'Congestão refratária às vezes é perfil L mal classificado. LRA com congestão: ultrafiltração' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'*Leito monitorizado* · UTI se perfil C, VNI contínua ou intubação',
          nota:'Alta só com peso seco atingido, medicação otimizada, causa identificada e retorno precoce' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Rebaixamento do nível de consciência ou exaustão respiratória — intubar, não insistir em VNI.',
        '*Hipotensão com congestão* (perfil frio e úmido) — é choque cardiogênico, e furosemida isolada piora.',
        'Dor torácica associada: SCA como gatilho, e a conduta muda.',
        'Arritmia como causa da descompensação — tratar o ritmo resolve a congestão.',
        'Anúria ou lesão renal aguda com congestão refratária: indicação de ultrafiltração/hemodiálise.'
      ]},
      { tipo:'texto', titulo:'Perfis hemodinâmicos — a bússola da conduta', conteudo:'Cruza-se *congestão* (úmido x seco) com *perfusão* (quente x frio). *Perfil B — quente e úmido:* congesto e bem perfundido, é o mais comum; a conduta é diurético e vasodilatador. *Perfil L — frio e seco:* mal perfundido sem congestão, muitas vezes por *excesso de diurético*; a conduta é hidratar, não secar mais. *Perfil C — frio e úmido:* congesto e mal perfundido, é o choque cardiogênico, e exige inotrópico. *Perfil A — quente e seco:* compensado. Errar o perfil é o erro que mais custa nesta conduta: dar furosemida no perfil L piora tudo.' },
      { tipo:'passos', titulo:'Conduta imediata no EAP', itens:[
        '*MOVE* com *VNI precoce* — é a primeira medida, e a que mais rápido alivia.',
        'Paciente sentado, pernas pendentes.',
        'Investigar e tratar o gatilho no mesmo momento: *SCA ou arritmia*.',
        '*Vasodilatador* — nitroglicerina se há SCA; nitroprussiato se é hipertensivo puro.',
        '*Furosemida 1–2 mg/kg* endovenosa.',
        'Morfina 2–4 mg apenas se necessário — não é rotina.',
        'Dobutamina 5 mcg/kg/min *só se houver baixo débito*.',
        'Alvo no EAP hipertensivo: *PAS < 140 mmHg em 1 hora*.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Furosemida', dose:'1–2 mg/kg em bolus', via:'EV', obs:'Dobrar a dose habitual do usuário crônico. Alvo de diurese: *1 mL/kg/h*.' },
        { droga:'Furosemida em infusão', dose:'Após bolus, contínua em bomba', via:'EV BIC', obs:'Opção na congestão refratária ao bolus intermitente.' },
        { droga:'Nitroglicerina', dose:'Iniciar 5 mL/h, titular', via:'EV BIC', obs:'1 ampola (25 mg/5 mL) em 230 mL de SF. *Preferida quando há SCA associada.*' },
        { droga:'Nitroprussiato de sódio', dose:'0,3–10 mcg/kg/min, titular', via:'EV BIC', obs:'EAP hipertensivo e IC com FE < 40% descompensada. Fotossensível.' },
        { droga:'Morfina', dose:'2–4 mg', via:'EV', obs:'*Se necessário*, não de rotina. Cuidado com rebaixamento e depressão respiratória.' },
        { droga:'Dobutamina', dose:'5 mcg/kg/min, titular', via:'EV BIC', obs:'*Apenas no baixo débito.* Diluir 4 ampolas (80 mL) conforme padronização do serviço.' }
      ]},
      { tipo:'lista', titulo:'Alvos clínicos e reavaliação', itens:[
        '*Diurese de 1 L em 6 h* (1 mL/kg/h) — a medida objetiva de que o tratamento funciona.',
        'Melhora da dispneia, da frequência respiratória e da saturação.',
        'Balanço hídrico e peso diário.',
        'Função renal e potássio seriados — a diurese intensa espolia potássio.',
        'Reavaliar perfil hemodinâmico a cada turno: o paciente muda de perfil durante a internação.'
      ]},
      { tipo:'lista', titulo:'Se refratário à furosemida', itens:[
        'Usuário crônico de diurético — precisa de dose maior que a habitual.',
        'Considerar *infusão contínua* em vez de bolus intermitente.',
        'Associar tiazídico para bloqueio sequencial do néfron.',
        'Reavaliar se o perfil é mesmo úmido — congestão que não responde às vezes é *perfil L mal classificado*.',
        'Lesão renal aguda com congestão refratária: *ultrafiltração ou hemodiálise*.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Furosemida no perfil frio e seco (L)* — o paciente precisa de volume, não de diurético.',
        'Adiar a VNI para tentar só oxigênio por máscara.',
        'Morfina de rotina em todo EAP.',
        'Dobutamina no paciente quente e úmido, que não tem baixo débito.',
        'Tratar a congestão e não procurar o gatilho — SCA, arritmia, má adesão, infecção.',
        'Insistir em VNI no paciente rebaixado, sem proteção de via aérea.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'EAP vai para *leito monitorizado*; perfil C (choque cardiogênico), necessidade de inotrópico, VNI contínua ou intubação vão para *UTI*. A alta só se cogita após compensação sustentada, com peso seco atingido, medicação otimizada, causa da descompensação identificada e retorno precoce marcado — a maioria das reinternações por IC vem de má adesão e de alta sem ajuste de dose.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A pergunta que organiza tudo: *está congesto? está bem perfundido?* Perfil definido, a conduta se escreve sozinha.',
        'VNI no EAP é das intervenções mais eficazes da emergência — o paciente melhora em minutos. Não deixe para depois da furosemida.',
        'Paciente com IC que piorou "sem motivo": procure FA nova, infecção, anti-inflamatório e falta de remédio, nessa ordem.',
        'Congestão que não responde a diurético pode ser diagnóstico errado de perfil. Reavalie a perfusão antes de aumentar a dose.'
      ]}
    ] },

  { id:'choque-abordagem', titulo:'Choque: reconhecimento e classificação', categoria:'cardio', gravidade:'emergencia',
    resumo:'Diferenciar hipovolêmico, cardiogênico, distributivo e obstrutivo antes de escolher volume ou droga vasoativa.',
    tags:['choque','hipotensao','lactato','noradrenalina','droga vasoativa','perfusao','pocus','tec'],
    fonte:'AMIB — Recomendações de choque e monitorização hemodinâmica · Manual de Cardiologia na Prática 3.0, p. 69–74',
    ficha:[
      { rotulo:'Quando pensar', valor:'Hipotensão (PAM < 65), taquicardia e *má perfusão* — extremidades frias, TEC > 3 s, confusão, oligúria.' },
      { rotulo:'Prioridade',    valor:'*Classificar o tipo de choque antes de escolher a droga.* Volume no cardiogênico afoga; vasopressor no hipovolêmico não resolve.' },
      { rotulo:'Meta',          valor:'PAM ≥ 65 mmHg com sinais de perfusão melhorando e lactato em queda.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Reconhecimento', texto:'*PAM < 65* + má perfusão',
          nota:'TEC > 3 s, extremidades frias, confusão, oligúria. No jovem a hipotensão é sinal tardio' },
        { tipo:'passo', rotulo:'Primeiro', texto:'MOVE + ECG',
          nota:'Taquicardia *sinusal* é resposta ao choque; arritmia instável é a causa dele' },
        { tipo:'passo', rotulo:'POCUS à beira do leito', texto:'Pulmão → VE → VD → pericárdio → veia cava',
          nota:'Linhas B? pneumotórax? função sistólica? derrame? VCI colabada?' },
        { tipo:'decisao', texto:'O que o POCUS mostra?', ramos:[
          { rotulo:'VCI colabada, pulmão seco', texto:'*Hipovolêmico* — volume',
            nota:'Hemorrágico: hemocomponentes e controle do sangramento' },
          { rotulo:'VE ruim, linhas B', texto:'*Cardiogênico* — inotrópico, cateterismo',
            nota:'Volume generoso aqui piora a congestão' },
          { rotulo:'VD dilatado, derrame, PTX', cor:'perigo', texto:'*Obstrutivo* — trombólise, drenagem, descompressão',
            nota:'Pneumotórax hipertensivo não espera radiografia' },
          { rotulo:'Vasodilatado', texto:'*Distributivo* — séptico (ATB + noradrenalina) ou anafilático (*adrenalina IM*)' }
        ]},
        { tipo:'passo', rotulo:'Reavaliar sempre', texto:'TEC, nível de consciência, diurese e lactato',
          nota:'O choque muda de perfil durante o tratamento — reavalie depois de cada intervenção' },
        { tipo:'fim', rotulo:'Destino', texto:'*UTI* com acesso central e monitorização',
          nota:'Sem UTI no serviço: estabilizar, iniciar a droga vasoativa e transferir com médico e bomba' }
      ]},
      { tipo:'lista', titulo:'Parâmetros clínicos do choque', itens:[
        '*Coração:* hipotensão (PA 80×45, PAM < 65 mmHg), pulso fino, taquicardia.',
        '*Pele:* tempo de enchimento capilar > 3 s, extremidades frias, moteamento.',
        '*Cérebro:* confusão, agitação, rebaixamento do nível de consciência.',
        '*Rim:* oligúria.',
        'Lactato elevado confirma hipoperfusão tecidual — mas o diagnóstico é clínico e vem antes do exame.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*MOVE* — monitor, oxigênio, dois acessos calibrosos, ECG.',
        'ECG para afastar arritmia instável como causa: taquicardia *sinusal* é resposta ao choque; arritmia instável é a causa dele.',
        '*POCUS à beira do leito* — é o que classifica o choque em minutos.',
        'Classificar em hipovolêmico, cardiogênico, obstrutivo ou distributivo.',
        'Iniciar o suporte (volume, vasopressor, inotrópico) *conforme o tipo*.',
        'Tratar a causa específica em paralelo — o suporte ganha tempo, a causa resolve.',
        'Reavaliar perfusão continuamente: TEC, consciência, diurese, lactato.'
      ]},
      { tipo:'ordem', titulo:'POCUS no choque — a sequência', itens:[
        '*US pulmonar:* linhas B bilaterais? (congestão) · excluir pneumotórax.',
        '*ECO — função sistólica do VE:* ruim aponta cardiogênico.',
        '*ECO — função sistólica do VD:* VD dilatado com septo desviado aponta TEP.',
        '*ECO — derrame pericárdico:* presente com colapso de câmaras aponta tamponamento.',
        '*ECO — veia cava inferior:* diâmetro e colapso inspiratório indicam status volêmico.',
        'Cruzar os achados: pulmão seco + VCI colabada = hipovolêmico; pulmão úmido + VE ruim = cardiogênico.'
      ]},
      { tipo:'texto', titulo:'Suporte — a lógica por trás das drogas', conteudo:'A oferta de oxigênio (*DO2*) é débito cardíaco × conteúdo arterial de oxigênio. Para melhorar o *conteúdo*: hemoglobina acima de 7 g/dL e saturação acima de 92%. Para melhorar o *débito*: volume e inotrópico (débito = volume sistólico × frequência). Para melhorar a *pressão*: vasopressor mais volume, já que a pressão é volume sistólico × resistência vascular sistêmica. É por isso que a droga certa depende de qual dessas peças está faltando — e por que dar a errada piora o quadro.' },
      { tipo:'lista', titulo:'Tratamento específico por tipo', itens:[
        '*Hipovolêmico:* volume — cristaloide e, no hemorrágico, hemocomponentes e controle do sangramento.',
        '*Obstrutivo — TEP:* trombólise + anticoagulação.',
        '*Obstrutivo — tamponamento:* drenagem pericárdica.',
        '*Obstrutivo — pneumotórax hipertensivo:* descompressão imediata, antes de qualquer imagem.',
        '*Cardiogênico:* dupla antiagregação e angioplastia (ou trombólise) quando isquêmico; inotrópico e suporte.',
        '*Distributivo séptico:* antibiótico precoce + controle do foco + noradrenalina.',
        '*Distributivo anafilático:* *adrenalina IM*, imediatamente.'
      ]},
      { tipo:'doses', titulo:'Drogas de suporte', itens:[
        { droga:'Cristaloide', dose:'Alíquotas de 250–500 mL, reavaliando', via:'EV', obs:'No séptico, 30 mL/kg nas primeiras 3 h. *No cardiogênico, alíquotas pequenas e muita cautela.*' },
        { droga:'Noradrenalina', dose:'0,1–1 mcg/kg/min, titular', via:'EV BIC', obs:'Vasopressor de escolha no choque séptico e na maioria dos distributivos.' },
        { droga:'Adrenalina', dose:'IM 0,5 mg na anafilaxia · BIC no refratário', via:'IM/EV', obs:'*Primeira droga na anafilaxia*, via intramuscular no vasto lateral.' },
        { droga:'Dobutamina', dose:'5 mcg/kg/min, titular', via:'EV BIC', obs:'Inotrópico para baixo débito — cardiogênico e séptico com disfunção miocárdica.' },
        { droga:'Vasopressina', dose:'0,01–0,04 U/min', via:'EV BIC', obs:'Associar no choque séptico refratário.' },
        { droga:'Concentrado de hemácias', dose:'Manter Hb > 7 g/dL', via:'EV', obs:'Alvo mais alto em sangramento ativo e isquemia miocárdica.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Volume generoso no choque cardiogênico* — piora a congestão e a hipoxemia.',
        'Vasopressor no hipovolêmico sem repor volume: mascara o problema e piora a perfusão de órgão.',
        'Adiar a descompressão do pneumotórax hipertensivo para confirmar com radiografia.',
        'Tratar taquicardia sinusal do choque como se fosse a arritmia causadora.',
        'Confiar apenas na pressão arterial: o jovem compensa e mantém PA normal até descompensar de vez.',
        'Perseguir o número da pressão e ignorar os sinais de perfusão.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'Todo choque é *UTI*, com acesso central e monitorização, assim que o transporte for seguro. Antes disso, a estabilização acontece na sala de emergência: suporte iniciado e causa específica tratada. Serviço sem UTI: estabilizar, iniciar a droga vasoativa e *transferir com médico acompanhando e a bomba correndo*.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'O POCUS resolve em cinco minutos o que a clínica leva uma hora para sugerir. Pulmão, coração e veia cava respondem quase todas as perguntas.',
        '*Tempo de enchimento capilar* é o sinal mais subestimado do plantão: é gratuito, seriável e melhora antes da pressão.',
        'Choque tem mais de uma causa com frequência — o séptico pode estar desidratado e com disfunção miocárdica ao mesmo tempo. Reavalie o perfil depois de cada intervenção.',
        'Hipotensão é sinal *tardio* no jovem. Taquicardia com extremidade fria e confusão já é choque, mesmo com PA normal.'
      ]}
    ] },

  { id:'taquiarritmia-instavel', titulo:'Taquiarritmia com instabilidade', categoria:'cardio', gravidade:'emergencia',
    resumo:'Os sinais de instabilidade e a cardioversão elétrica sincronizada com sedação.',
    tags:['taquicardia','instabilidade','cardioversao','sincronizada','choque eletrico','4 ds'],
    fonte:'SBC/SOBRAC — Diretriz de Arritmias Cardíacas · Manual de Cardiologia na Prática 3.0, p. 15–19 · PS Zerado, p. 7–10',
    ficha:[
      { rotulo:'Quando pensar', valor:'FC > 100 bpm *com* pelo menos um dos 4 D. A instabilidade é definida pela clínica, não pelo número da frequência.' },
      { rotulo:'Prioridade',    valor:'*Sala vermelha.* Instabilidade por arritmia é cardioversão elétrica, não droga.' },
      { rotulo:'Meta',          valor:'Ritmo revertido e perfusão restabelecida, sem esperar o resultado de exame.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*FC > 100 bpm* no monitor',
          nota:'MOVE — monitor, oxigênio se SpO2 < 90%, veia e eletrocardiograma' },
        { tipo:'decisao', texto:'Há algum dos 4 D?', ramos:[
          { rotulo:'Nenhum', texto:'*Estável* — seguir o algoritmo do ritmo (QRS estreito ou largo)' },
          { rotulo:'Um ou mais', cor:'perigo', texto:'*INSTÁVEL — cardioversão elétrica sincronizada*',
            nota:'Dispneia · Dor torácica · ↓ da PA · ↓ do nível de consciência' }
        ]},
        { tipo:'passo', rotulo:'Antes de chocar', texto:'*Checar responsividade*',
          nota:'Se não responde e não tem pulso, o protocolo é o de parada, não o de taquiarritmia' },
        { tipo:'decisao', texto:'O ritmo é TV polimórfica?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*DESFIBRILAR* — não sincronizar',
            nota:'O aparelho não encontra a onda R em ritmo polimórfico e não dispara' },
          { rotulo:'Não', texto:'*Sincronizar* na carga do ritmo',
            nota:'FA 200 J · TPSV e flutter 50–100 J · TV monomórfica 100 J (bifásico)' }
        ]},
        { tipo:'passo', rotulo:'OSASCO', texto:'*O*rientar · *S*edar · *A*mbuzar · *S*incronizar · *C*ardioverter · *O*bservar',
          nota:'Midazolam se há insuficiência cardíaca, propofol se não há; fentanil junto. Bolsa-válvula na mão antes de sedar' },
        { tipo:'decisao', texto:'Reverteu?', ramos:[
          { rotulo:'Não', texto:'*FIASCO* — *FI*os, *A*nálise do ritmo, *S*incroniza de novo, *C*arga maior, *O*bservar' },
          { rotulo:'Sim', cor:'ok', texto:'Ecocardiograma + amiodarona 900–1200 mg EV em 24 h' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'*Leito monitorizado ou UCO* + investigar o gatilho',
          nota:'SCA, eletrólitos, tireotoxicose, sepse, droga. Arritmia revertida sem causa tratada volta no mesmo plantão' }
      ]},
      { tipo:'alerta', titulo:'Red flags — os 4 D da instabilidade', itens:[
        '*Dispneia* de origem cardíaca ou insuficiência respiratória.',
        '*Dor torácica* anginosa.',
        '*Diminuição da PA* — hipotensão ou sinais de choque.',
        '*Diminuição do nível de consciência.*',
        'Antes de cardioverter, *checar responsividade*: se não responde e não tem pulso, o protocolo é o de parada, não o de taquiarritmia.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata — OSASCO', itens:[
        '*MOVE* — monitor, oxigênio se SpO2 < 90%, veia e eletrocardiograma.',
        '*O*rientar o paciente sobre o que vai ser feito, se estiver consciente.',
        '*S*edar — a escolha muda se há insuficiência cardíaca (ver medicações).',
        '*A*mbuzar — ventilar com bolsa-válvula-máscara durante a sedação.',
        '*S*incronizar — apertar o botão SYNC e *conferir na tela* que o aparelho marcou as ondas R.',
        '*C*ardioverter na carga correspondente ao ritmo.',
        '*O*bservar — reavaliar ritmo, pulso e pressão logo após o choque.',
        'Se for *TV polimórfica*, não sincroniza: *desfibrila*.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Midazolam (com IC)', dose:'0,5–2 mg EV em 2 min', via:'EV', obs:'Diluir 1 ampola (15 mg/3 mL) em 7 mL de água destilada = 1,5 mg/mL. Fazer 1 mL a cada 2 min até sedar, *mantendo o drive respiratório*. Máx. 5 mL.' },
        { droga:'Propofol (sem IC)', dose:'0,5–1 mg/kg EV', via:'EV', obs:'Ampola 10 mg/mL — 1 mL a cada 10 kg. Paciente de 80 kg: 4 mL em bolus, completar com mais 4 mL se necessário.' },
        { droga:'Fentanil (analgesia)', dose:'1,5–2 mcg/kg', via:'EV', obs:'50 mcg/mL — 1 a 2 mL puro, infundir lentamente. Associar ao sedativo.' },
        { droga:'Amiodarona (após reversão)', dose:'900–1200 mg em 24 h', via:'EV', obs:'Manutenção após cardioversão bem-sucedida de TV. Solicitar ecocardiograma.' }
      ]},
      { tipo:'lista', titulo:'Cargas de cardioversão (bifásico)', itens:[
        '*FA:* 200 J — adicional 200 J.',
        '*TPSV:* 50–100 J — adicional 100, 150, 200 J.',
        '*Flutter:* 50–100 J — adicional 100, 150, 200 J.',
        '*TV monomórfica:* 100 J — adicional 150–200 J.',
        '*TV polimórfica:* desfibrilação em carga máxima, *sem sincronizar*.'
      ]},
      { tipo:'tempo', titulo:'Linha do tempo', itens:[
        { quando:'0–2 min',  o_que:'MOVE, ECG e reconhecimento dos 4 D.' },
        { quando:'2–5 min',  o_que:'Sedação e analgesia preparadas, material de via aérea ao lado do leito.' },
        { quando:'≤ 10 min', o_que:'*Cardioversão sincronizada realizada.* Instabilidade não espera exame nem parecer.' },
        { quando:'Pós-choque', o_que:'Reavaliar ritmo e pulso; se não reverteu, rodar FIASCO e repetir com carga maior.', fim:true }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Tentar droga antiarrítmica no paciente instável — o tratamento é elétrico.',
        'Cardioverter sem sedação no paciente consciente.',
        'Sincronizar em TV polimórfica — o aparelho não acha a onda R e não dispara.',
        'Chamar de instável só pela frequência alta: sem os 4 D, o paciente é estável.',
        'Esquecer de conferir se o modo SYNC continua ligado — vários aparelhos saem de sincronizado depois de cada choque.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'Todo paciente cardiovertido fica *monitorizado em leito de emergência ou UCO*, no mínimo até a investigação da causa. Não existe alta direto da sala após cardioversão. Investigar e tratar o gatilho — SCA, distúrbio eletrolítico, tireotoxicose, sepse, droga — porque arritmia revertida sem causa tratada volta no mesmo plantão.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Não reverteu? Rode o *FIASCO*: *FI*os (checar conexão e posição das pás), *A*nálise do ritmo, *S*incroniza de novo, *C*arga maior e *O*bservar.',
        'Sedar com o paciente já colado às pás e com a bolsa-válvula-máscara na mão — a janela entre sedação e choque tem que ser curta.',
        'Taquicardia sinusal não se cardioverte: FC alta com onda P normal é resposta a alguma coisa (dor, febre, hipovolemia, sepse). Trate a causa.'
      ]}
    ] },

  { id:'taqui-qrs-estreito', titulo:'Taquicardia de QRS estreito (TSV)', categoria:'cardio', gravidade:'urgencia',
    resumo:'Manobra vagal, adenosina e o que fazer quando a taquicardia volta.',
    tags:['tsv','taquicardia supraventricular','adenosina','manobra vagal','valsalva','tpsv'],
    fonte:'SBC/SOBRAC — Diretriz de Arritmias Cardíacas · Manual de Cardiologia na Prática 3.0, p. 19 · PS Zerado, p. 7–8',
    ficha:[
      { rotulo:'Quando pensar', valor:'FC > 150 bpm, QRS estreito e *regular*, início e fim súbitos, sem onda P visível.' },
      { rotulo:'Prioridade',    valor:'Sala de emergência monitorizada. *Estável* — dá para tentar manobra antes de droga.' },
      { rotulo:'Meta',          valor:'Reversão para sinusal, ou controle de frequência quando é irregular.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*QRS estreito*, FC > 150 bpm',
          nota:'Antes de tudo: descartar taquicardia *sinusal* — tem onda P normal e se trata na causa' },
        { tipo:'decisao', texto:'O paciente está estável?', ramos:[
          { rotulo:'Não — 4 D', cor:'perigo', texto:'*Cardioversão elétrica sincronizada*, 50–100 J' },
          { rotulo:'Sim', texto:'Seguir pelo ritmo' }
        ]},
        { tipo:'decisao', texto:'O ritmo é regular ou irregular?', ramos:[
          { rotulo:'Regular', texto:'*TRN / TRAV* — tentar reverter',
            nota:'Manobra vagal modificada, depois adenosina' },
          { rotulo:'Irregular', texto:'*FA, flutter ou TAM* — controle de frequência',
            nota:'Metoprolol 5 mg EV · diltiazem · verapamil · deslanosídeo se há IC' }
        ]},
        { tipo:'passo', rotulo:'1ª tentativa', texto:'*Manobra vagal modificada*',
          nota:'Valsalva por 15 s seguida de elevação das pernas a 45° por 15 s — reverte bem mais que a clássica' },
        { tipo:'decisao', texto:'Reverteu com a manobra?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'*ECG após a reversão* — tem valor diagnóstico' },
          { rotulo:'Não', texto:'*Adenosina 6 mg* em bolus rápido; se não reverter, *12 mg*',
            nota:'Fossa cubital, flush de 20 mL de SF e elevar o membro. Avisar o paciente do mal-estar' }
        ]},
        { tipo:'alerta', rotulo:'Cuidado', texto:'*QRS largo ou pré-excitação (WPW)?*',
          nota:'Não usar adenosina, verapamil, diltiazem nem digital — risco de degenerar em fibrilação ventricular' },
        { tipo:'fim', rotulo:'Destino', texto:'Alta possível no *1º episódio revertido*, sem cardiopatia e com ECG normal',
          nota:'Interna quem teve instabilidade, não reverteu, tem cardiopatia, pré-excitação ou síncope' }
      ]},
      { tipo:'passos', titulo:'Quando suspeitar', itens:[
        'Palpitação de início e término súbitos, referida como "disparo".',
        'QRS estreito e *regular* — o ritmo mais provável é TRN ou TRAV.',
        'QRS estreito e *irregular* — pensar em FA, flutter com condução variável ou taquicardia atrial multifocal.',
        'Antes de tudo: descartar *taquicardia sinusal*, que tem onda P normal e é resposta a dor, febre, hipovolemia ou sepse — e se trata na causa.'
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Qualquer um dos 4 D (dispneia, dor torácica, ↓PA, ↓consciência) — passa a ser cardioversão elétrica imediata.',
        'QRS largo ou pré-excitação (FA com WPW) — *não* usar adenosina, verapamil, diltiazem nem digital.',
        'Broncoespasmo ativo ou asma descompensada — evitar adenosina.',
        'Bloqueio AV de qualquer grau após a primeira dose — não repetir adenosina.'
      ]},
      { tipo:'lista', titulo:'Exames', itens:[
        'ECG de 12 derivações *durante* a taquicardia e outro após a reversão — os dois têm valor diagnóstico.',
        'Eletrólitos, incluindo potássio e magnésio.',
        'TSH, hemograma e função renal na investigação do gatilho.',
        'Troponina se houver dor torácica associada.',
        'Ecocardiograma para investigar cardiopatia estrutural.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Manobra vagal modificada', dose:'Valsalva 15 s + elevação das pernas a 45° por 15 s', via:'—', obs:'*Primeira tentativa sempre.* A versão modificada reverte bem mais que a Valsalva clássica.' },
        { droga:'Adenosina', dose:'6 mg; se não reverter, 12 mg', via:'EV', obs:'Em *bolus rápido* na fossa cubital, seguido de flush de 20 mL de SF e elevação do membro. Avisar o paciente da sensação de mal-estar e da pausa.' },
        { droga:'Metoprolol', dose:'5 mg em 2 min, repetir a cada 5 min', via:'EV', obs:'Controle de frequência. Máximo 15–20 mg.' },
        { droga:'Diltiazem', dose:'0,25 mg/kg', via:'EV', obs:'Alternativa ao betabloqueador. Evitar se disfunção sistólica.' },
        { droga:'Verapamil', dose:'5–10 mg em 2–5 min', via:'EV', obs:'Repetir após 30 min se necessário, máx. 20 mg. *Não usar em QRS largo ou pré-excitação.*' },
        { droga:'Deslanosídeo', dose:'0,4 mg', via:'EV', obs:'Opção no paciente com insuficiência cardíaca.' },
        { droga:'Amiodarona', dose:'150 mg em 10 min', via:'EV', obs:'Quando as anteriores falham ou estão contraindicadas.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Adenosina em FA com pré-excitação (WPW) — pode degenerar para fibrilação ventricular.',
        'Adenosina em veia distal e sem flush — a meia-vida é de segundos e a droga não chega.',
        'Repetir adenosina em quem fez bloqueio AV na primeira dose.',
        'Manobra vagal em doença pulmonar descompensada.',
        'Cardioverter taquicardia sinusal.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* possível no primeiro episódio revertido, em paciente estável, assintomático após a reversão, com ECG pós-reversão normal e sem cardiopatia estrutural conhecida — com encaminhamento ao cardiologista/eletrofisiologista e orientação de retorno. *Interna* quem teve instabilidade, quem não reverteu, quem tem cardiopatia estrutural, pré-excitação no ECG, síncope associada ou episódios recorrentes e frequentes.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Deixe o ECG rodando *durante* a adenosina: a pausa mostra o ritmo atrial subjacente e às vezes o diagnóstico aparece ali — flutter escondido, por exemplo.',
        'Avise o paciente antes: a adenosina dá sensação de morte iminente por alguns segundos. Quem não é avisado se levanta da maca.',
        'A manobra vagal *modificada* (Valsalva seguida de elevação das pernas) reverte bem mais que a clássica — vale sempre a primeira tentativa antes da droga.'
      ]}
    ] },

  { id:'fa-flutter', titulo:'Fibrilação atrial e flutter atrial', categoria:'cardio', gravidade:'urgencia',
    resumo:'Controle de frequência x ritmo, janela das 48 h para cardioverter e anticoagulação (CHA₂DS₂-VASc).',
    tags:['fa','fibrilacao atrial','flutter','chads vasc','anticoagulacao','metoprolol','amiodarona','wpw','pre-excitacao'],
    fonte:'SBC — Diretriz de Fibrilação Atrial · Manual de Cardiologia na Prática 3.0, p. 24–30 · PS Zerado, p. 9–11',
    ficha:[
      { rotulo:'Quando pensar', valor:'Ritmo *irregularmente irregular* sem onda P. Palpitação, dispneia, ou achado incidental no monitor.' },
      { rotulo:'Prioridade',    valor:'*A e B:* Anticoagulação e controle de frequência (Betabloqueador). O ritmo vem depois.' },
      { rotulo:'Meta',          valor:'FC controlada, tromboembolismo prevenido e causa de base investigada.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Ritmo *irregularmente irregular*, sem onda P' },
        { tipo:'decisao', texto:'O paciente está estável?', ramos:[
          { rotulo:'Não — 4 D', cor:'perigo', texto:'*Cardioversão sincronizada 200 J* + anticoagular assim que possível',
            nota:'A instabilidade cardioverte independentemente do tempo de início' },
          { rotulo:'Sim', texto:'Seguir para os dois pilares' }
        ]},
        { tipo:'alerta', rotulo:'Antes de qualquer droga', texto:'*QRS largo, bizarro e > 200 bpm?* É FA pré-excitada (WPW)',
          nota:'NÃO usar adenosina, metoprolol, digoxina nem verapamil — podem degenerar em FV. Aqui é procainamida, ibutilida ou cardioversão elétrica' },
        { tipo:'decisao', texto:'Há quanto tempo começou?', ramos:[
          { rotulo:'< 48 h', cor:'ok', texto:'*Pode cardioverter* + anticoagulação',
            nota:'Também vale de 12–48 h com CHA₂DS₂-VASc < 1 (homem) ou < 2 (mulher), ou eco TE sem trombo' },
          { rotulo:'> 48 h ou desconhecido', texto:'*NÃO cardioverter agora*',
            nota:'Anticoagular por 3 semanas antes e 4 depois, *ou* eco transesofágico para excluir trombo' }
        ]},
        { tipo:'decisao', texto:'O paciente tem insuficiência cardíaca?', ramos:[
          { rotulo:'Não', texto:'*Metoprolol 5 mg EV* a cada 5 min (máx. 15 mg) ou verapamil 5–10 mg' },
          { rotulo:'Sim', texto:'*Deslanosídeo 0,4 mg EV* ou amiodarona 150 mg em 10 min',
            nota:'Verapamil e diltiazem são contraindicados na disfunção sistólica' }
        ]},
        { tipo:'fim', rotulo:'A · B · C', texto:'*A*nticoagulação · *B*etabloqueador · *C*omorbidades',
          nota:'Cardiopatia estrutural anticoagula independentemente do CHA₂DS₂-VASc. Procurar o gatilho: sepse, tireotoxicose, TEP, isquemia, álcool' }
      ]},
      { tipo:'passos', titulo:'Os dois pilares na sala de emergência', itens:[
        '*A = Anticoagulação* — prevenção de fenômeno tromboembólico. É o que muda mortalidade.',
        '*B = Betabloqueador* — controle de frequência. Amiodarona quando há insuficiência cardíaca.',
        '*C = Comorbidades* — procurar e tratar o gatilho: sepse, tireotoxicose, distúrbio eletrolítico, TEP, isquemia, álcool.',
        'Controle de *frequência* resolve a maioria dos casos no plantão. Controle de *ritmo* é decisão mais específica e nem sempre urgente.'
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Instabilidade (4 D) — *cardioversão elétrica sincronizada imediata*, independente do tempo de início.',
        '*FA com pré-excitação (WPW)*: QRS largo, bizarro e muito rápido. Contraindicado adenosina, metoprolol, digoxina e verapamil.',
        'FA de alta resposta com dor torácica ou congestão — pensar em SCA ou IC descompensada por trás.',
        'FA nova em paciente séptico ou com TEP: tratar a causa, não só o ritmo.'
      ]},
      { tipo:'texto', titulo:'A regra das 48 horas', conteudo:'*Menos de 48 h de início* (ou 12–48 h com CHA₂DS₂-VASc < 1 em homem e < 2 em mulher, ou ecocardiograma transesofágico sem trombo): pode-se cardioverter. *Mais de 48 h ou tempo indeterminado*: não cardioverter de imediato — ou anticoagula por *3 semanas antes* e 4 semanas depois, ou faz *eco transesofágico* para excluir trombo e então cardioverte, mantendo anticoagulação por mais 4 semanas. A exceção é sempre a instabilidade: aí cardioverte-se na hora e anticoagula-se assim que possível.' },
      { tipo:'doses', titulo:'Controle de frequência', itens:[
        { droga:'Metoprolol (sem IC)', dose:'5 mg a cada 5 min, máx. 15–20 mg', via:'EV', obs:'Primeira escolha no paciente sem insuficiência cardíaca.' },
        { droga:'Verapamil (sem IC)', dose:'5–10 mg em 2–5 min', via:'EV', obs:'Repetir após 30 min se necessário, máx. 20 mg. *Não usar em pré-excitação nem em disfunção sistólica.*' },
        { droga:'Deslanosídeo (com IC)', dose:'0,4 mg', via:'EV', obs:'Opção no paciente com insuficiência cardíaca.' },
        { droga:'Amiodarona (com IC)', dose:'150 mg em 10 min', via:'EV', obs:'Alternativa quando há disfunção ventricular.' }
      ]},
      { tipo:'doses', titulo:'Controle de ritmo — cardioversão química', itens:[
        { droga:'Propafenona (sem cardiopatia estrutural)', dose:'< 70 kg: 450 mg · > 70 kg: 600 mg', via:'VO', obs:'*Fazer betabloqueador VO antes* — metoprolol 50 mg, atenolol 50 mg ou propranolol 40 mg.' },
        { droga:'Amiodarona (com cardiopatia estrutural)', dose:'300 mg + SG 5% 250 mL em 30 min', via:'EV', obs:'Pode repetir 150 mg + SG 5% 100 mL em 30 min. Manutenção 900 mg + 500 mL de SG 5% em 24 h.' }
      ]},
      { tipo:'doses', titulo:'Anticoagulação intra-hospitalar', itens:[
        { droga:'Enoxaparina', dose:'1 mg/kg de 12/12 h (até 100 kg)', via:'SC', obs:'*Contraindicada se clearance < 15 mL/min* — nesse caso, usar heparina não fracionada.' },
        { droga:'Heparina não fracionada', dose:'60 U/kg em bolus, máx. 4.000 U', via:'EV', obs:'Manutenção: 25.000 UI em 250 mL de SF, iniciar 12 U/kg/h, máx. 1.000 U/h por 24–48 h. *Dosar TTPA de 6/6 h.*' }
      ]},
      { tipo:'ordem', titulo:'FA com pré-excitação (WPW)', itens:[
        '*Instável:* cardioversão elétrica sincronizada e anticoagulação assim que possível.',
        '*Estável:* procainamida, ibutilida ou cardioversão elétrica sincronizada.',
        'Revertido: ecocardiograma, especialista, anticoagulação por mais 4 semanas, amiodarona 900–1200 mg EV em 24 h e internação.',
        'Encaminhar para *ablação da via anômala* — o tratamento definitivo não é medicamentoso.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Adenosina, metoprolol, digoxina ou verapamil em FA com pré-excitação* — bloqueiam o nó AV, favorecem a via anômala e podem degenerar em FV.',
        'Cardioverter FA com mais de 48 h (ou de tempo desconhecido) sem anticoagulação prévia ou eco transesofágico.',
        'Verapamil ou diltiazem no paciente com disfunção sistólica.',
        'Tratar só o ritmo e não procurar o gatilho — FA nova quase sempre tem uma causa aguda.',
        'Esquecer a anticoagulação porque o ritmo reverteu: o risco embólico persiste.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Interna* quem tem instabilidade, cardiopatia estrutural (IC, choque cardiogênico ou DAC), FA com pré-excitação, resposta ventricular não controlada, ou causa de base que exija tratamento hospitalar — sempre com ecocardiograma transtorácico, avaliação do especialista e investigação da causa. *Alta* possível na FA de baixo risco com frequência controlada, sem cardiopatia estrutural, com anticoagulação definida e retorno precoce com cardiologista. *Cardiopatia estrutural anticoagula independentemente do CHA₂DS₂-VASc.*' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Antes de escolher a droga, responda uma pergunta só: *tem insuficiência cardíaca?* É ela que separa metoprolol/verapamil de deslanosídeo/amiodarona.',
        'FA de alta resposta em paciente séptico melhora tratando a sepse. Insistir em betabloqueador no paciente hipovolêmico derruba a pressão.',
        'QRS largo, bizarro e irregular a mais de 200 bpm é FA pré-excitada até prova em contrário — e é a situação em que a droga habitual mata.',
        'Pergunte a hora exata em que começou. A janela das 48 h muda toda a conduta e essa informação some se não for perguntada na admissão.'
      ]}
    ] },

  { id:'taqui-qrs-largo', titulo:'Taquicardia de QRS largo e TV', categoria:'cardio', gravidade:'emergencia',
    resumo:'Tratar como TV até prova em contrário; amiodarona, cardioversão e o que evitar.',
    tags:['tv','taquicardia ventricular','qrs largo','amiodarona','torsades','lidocaina','brugada'],
    fonte:'SBC/SOBRAC — Diretriz de Arritmias Cardíacas · Manual de Cardiologia na Prática 3.0, p. 19 · PS Zerado, p. 8–9',
    ficha:[
      { rotulo:'Quando pensar', valor:'FC > 100 bpm com QRS ≥ 120 ms. *Até prova em contrário é TV* — principalmente se há cardiopatia ou IAM prévio.' },
      { rotulo:'Prioridade',    valor:'*Sala vermelha*, desfibrilador ao lado do leito desde o primeiro minuto.' },
      { rotulo:'Meta',          valor:'Reversão do ritmo e identificação da causa estrutural ou metabólica.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*QRS ≥ 120 ms* com FC > 100 bpm' },
        { tipo:'alerta', rotulo:'Regra de ouro', texto:'*Tratar como TV até prova em contrário*',
          nota:'Com IAM prévio ou cardiopatia, a chance de ser TV passa de 90%. Errar para o lado da TSV é muito mais perigoso' },
        { tipo:'decisao', texto:'O paciente está estável?', ramos:[
          { rotulo:'Não — 4 D', cor:'perigo', texto:'*Cardioversão sincronizada*, 100 J bifásico' },
          { rotulo:'Sim', texto:'Baixo risco para sedoanalgesia? *Cardioversão de imediato*',
            nota:'Optando por droga: amiodarona 150 mg em 10 min' }
        ]},
        { tipo:'decisao', texto:'Monomórfica ou polimórfica?', ramos:[
          { rotulo:'Monomórfica', texto:'*Sincronizar* — 100 J, adicionais 150–200 J' },
          { rotulo:'Polimórfica / torsades', cor:'perigo', texto:'*DESFIBRILAR* + sulfato de magnésio 1–2 g',
            nota:'Magnésio funciona mesmo com magnésio sérico normal. Suspender droga que alarga o QT' }
        ]},
        { tipo:'passo', rotulo:'Sempre em paralelo', texto:'*Corrigir potássio e magnésio*',
          nota:'A arritmia não estabiliza enquanto os eletrólitos estiverem baixos' },
        { tipo:'fim', rotulo:'Destino', texto:'*UCO ou UTI* + ecocardiograma + investigar SCA',
          nota:'TV sustentada em cardiopata: avaliação para CDI ainda na internação' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Qualquer um dos 4 D — cardioversão sincronizada imediata.',
        '*TV polimórfica / torsades* — desfibrilar, não sincronizar; repor magnésio.',
        'História de IAM prévio, cardiopatia estrutural ou CDI: a chance de ser TV é altíssima.',
        'QT longo no ECG prévio ou droga que alarga QT em uso.',
        'Potássio ou magnésio baixos — a arritmia não estabiliza enquanto não corrigir.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*MOVE* — monitor, oxigênio se SpO2 < 90%, veia e ECG de 12 derivações.',
        'Checar os 4 D. *Instável → cardioversão sincronizada* (TV monomórfica 100 J bifásico).',
        'Estável e de baixo risco para sedoanalgesia: a diretriz favorece *cardioversão elétrica de imediato* em vez de tentar droga.',
        'Estável, optando por droga: amiodarona é a primeira escolha.',
        'Corrigir potássio e magnésio em paralelo, sempre.',
        'TV polimórfica: *desfibrilar* e repor sulfato de magnésio.',
        'Após a reversão, ecocardiograma para investigar SCA, IC com FE reduzida ou causa idiopática.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Amiodarona (ataque)', dose:'150 mg em 10 min', via:'EV', obs:'Diluir 1 ampola (150 mg/3 mL) em 100 mL de SG 5%. Pode repetir a segunda dose.' },
        { droga:'Amiodarona (manutenção)', dose:'450 mg em 24 h', via:'EV', obs:'3 ampolas em 230 mL de SG 5%: 16 mL/h nas primeiras 6 h, depois 8 mL/h por 18 h. *Suspender se surgir bloqueio AV.*' },
        { droga:'Lidocaína 2%', dose:'1–1,5 mg/kg', via:'EV', obs:'Alternativa em caso de falha. Repetir 0,5 mg/kg; máximo 3 mg/kg.' },
        { droga:'Sulfato de magnésio', dose:'1–2 g em 15 min', via:'EV', obs:'*Tratamento da torsades*, mesmo com magnésio sérico normal.' },
        { droga:'Metoprolol (ambulatorial)', dose:'25 mg/dia, subir até 100–200 mg/dia', via:'VO', obs:'Prevenção após a alta, conforme a causa.' }
      ]},
      { tipo:'lista', titulo:'Critérios que apontam TV (e não aberrância)', itens:[
        'Dissociação atrioventricular — o achado mais específico.',
        'Batimentos de captura ou de fusão.',
        'Concordância do QRS em todas as precordiais.',
        'QRS muito largo: > 140 ms com padrão de BRD, > 160 ms com padrão de BRE.',
        'Eixo desviado para o quadrante noroeste.',
        '*Na dúvida, é TV.* Tratar como TSV com aberrância e errar é muito mais perigoso que o contrário.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Adenosina, verapamil ou diltiazem em QRS largo de origem indefinida — pode causar colapso hemodinâmico.',
        'Assumir "TSV com aberrância" em paciente com cardiopatia prévia.',
        'Sincronizar em TV polimórfica.',
        'Corrigir só o ritmo e ignorar potássio, magnésio e isquemia.',
        'Manter droga que alarga QT depois de identificada a torsades.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'*UCO ou UTI*, monitorizado. Investigação obrigatória de SCA e de cardiopatia estrutural com ecocardiograma antes de qualquer alta. TV sustentada em cardiopata é indicação de avaliação para *CDI* — o encaminhamento à eletrofisiologia sai já da internação, não do ambulatório.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Paciente com IAM prévio e taquicardia de QRS largo: a probabilidade de ser TV passa de 90%. Não perca tempo em critério eletrocardiográfico — trate como TV.',
        'TV *bem tolerada* existe e engana: paciente conversando, pressão normal e ritmo de TV. Continua sendo TV, e continua precisando de tratamento.',
        'Torsades responde a magnésio mesmo com magnésio sérico normal — não espere o resultado do exame para repor.'
      ]}
    ] },

  { id:'bradiarritmia', titulo:'Bradiarritmia e bloqueios atrioventriculares', categoria:'cardio', gravidade:'emergencia',
    resumo:'Atropina, marca-passo transcutâneo e as bradicardias que não respondem a atropina.',
    tags:['bradicardia','bav','bloqueio','atropina','marcapasso transcutaneo','dopamina','mobitz','bavt'],
    fonte:'SBC/SOBRAC — Diretriz de Arritmias Cardíacas · Manual de Cardiologia na Prática 3.0, p. 21–22 · prescris (ACLS)',
    ficha:[
      { rotulo:'Quando pensar', valor:'FC < 50 bpm *com sintoma*. Bradicardia assintomática em atleta ou durante o sono não é doença.' },
      { rotulo:'Prioridade',    valor:'*Sala vermelha* se houver qualquer um dos 5 D. Pás do marca-passo no tórax antes de precisar.' },
      { rotulo:'Meta',          valor:'Perfusão restabelecida e causa reversível identificada.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*FC < 50 bpm* com sintoma',
          nota:'MOVE + ECG de 12 derivações. Bradicardia assintomática em atleta não é doença' },
        { tipo:'decisao', texto:'Há algum dos 5 D?', ramos:[
          { rotulo:'Nenhum — estável', texto:'*Investigar causas reversíveis*, observar e chamar o especialista',
            nota:'Eletrólitos · betabloqueador · bloq. de canal de cálcio · digoxina · lítio · amiodarona · propafenona' },
          { rotulo:'Um ou mais', cor:'perigo', texto:'*INSTÁVEL — atropina 1 mg em bolus*',
            nota:'Dispneia · Dor torácica · ↓ PA · ↓ consciência · Desmaio' }
        ]},
        { tipo:'decisao', texto:'Respondeu à atropina? (máximo 3 mg)', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'Observar monitorizado e tratar a causa' },
          { rotulo:'Não', texto:'*Marca-passo transcutâneo* ou adrenalina 2–10 mcg/min ou dopamina 5–20 mcg/kg/min',
            nota:'Em Mobitz II e BAVT a atropina costuma não funcionar — não insista até o teto' }
        ]},
        { tipo:'passo', rotulo:'Marca-passo transcutâneo', texto:'Sedar e analgesiar *antes* — o estímulo dói muito',
          nota:'Modo fixo · FC 70 bpm · subir a corrente até capturar e deixar *10 mA acima* · confirmar *pulso femoral*' },
        { tipo:'alerta', rotulo:'Não esquecer', texto:'*Bradicardia com onda T apiculada é hipercalemia*',
          nota:'O tratamento aí é gluconato de cálcio, não atropina' },
        { tipo:'fim', rotulo:'Destino', texto:'*Marca-passo transvenoso* + UCO/UTI',
          nota:'Mobitz II, BAV avançado e BAVT vão para avaliação de marca-passo definitivo' }
      ]},
      { tipo:'alerta', titulo:'Red flags — os 5 D da instabilidade', itens:[
        '*Dispneia.*',
        '*Dor torácica.*',
        '*Diminuição da PA* — hipotensão ou sinais de choque.',
        '*Diminuição do nível de consciência.*',
        '*Desmaio* — síncope.',
        'BAV de 2º grau Mobitz II e BAVT *não respondem bem a atropina*: já prepare o marca-passo.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*MOVE* — monitor, oxigênio se SpO2 < 90%, veia e ECG de 12 derivações.',
        'Classificar em estável ou instável pelos 5 D.',
        '*Estável:* investigar causas reversíveis, observar e chamar o especialista. Não medicar por medicar.',
        '*Instável:* atropina 1 mg em bolus, repetindo até o máximo de 3 mg.',
        'Sem resposta à atropina: *marca-passo transcutâneo* ou droga cronotrópica (adrenalina ou dopamina) — em paralelo, não em sequência.',
        'Analgesia e sedação antes de ligar o marca-passo transcutâneo: o estímulo dói muito.',
        'Providenciar *marca-passo transvenoso* e a avaliação da cardiologia.'
      ]},
      { tipo:'lista', titulo:'Reconhecendo o bloqueio no ECG', itens:[
        '*BAV 1º grau:* PR > 0,20 s, e só isso — todas as P conduzem.',
        '*Mobitz I (Wenckebach):* PR aumenta progressivamente até uma P ser bloqueada.',
        '*Mobitz II:* PR constante e, de repente, uma P bloqueada. *Risco de progressão para BAVT.*',
        '*BAV 2:1:* duas P para cada QRS.',
        '*BAV avançado (alto grau):* três ou mais P para cada QRS, com PR constante.',
        '*BAVT:* FC 30–50 bpm com *dissociação atrioventricular* — frequência atrial maior que a ventricular, sem relação entre P e QRS.',
        '*Atenção:* BAV avançado tem PR constante; BAVT não tem PR nenhum, porque não há relação P–QRS. É a confusão mais comum.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Atropina', dose:'1 mg em bolus, repetir a cada 3–5 min', via:'EV', obs:'*Máximo 3 mg.* Pouco eficaz em Mobitz II e BAVT — não insista até o teto se não houve resposta alguma.' },
        { droga:'Adrenalina', dose:'2–10 mcg/min em bomba', via:'EV', obs:'Cronotrópico enquanto o marca-passo não é instalado.' },
        { droga:'Dopamina', dose:'5–20 mcg/kg/min em bomba', via:'EV', obs:'Alternativa à adrenalina.' },
        { droga:'Morfina + fentanil', dose:'Morfina 2–4 mg · fentanil conforme peso', via:'EV', obs:'*Analgesia obrigatória antes do marca-passo transcutâneo.*' },
        { droga:'Gluconato de cálcio', dose:'1 g', via:'EV', obs:'Se a bradicardia é por hipercalemia ou intoxicação por bloqueador de canal de cálcio.' }
      ]},
      { tipo:'texto', titulo:'Marca-passo transcutâneo — como ajustar', conteudo:'Sedar e analgesiar primeiro. Colocar em *modo fixo*, ajustar a *FC em 70 bpm* e subir a corrente até obter *captura elétrica* (espícula seguida de QRS alargado em todos os batimentos); depois deixar a corrente *10 mA acima* desse limiar, como margem de segurança. Confirmar a *captura mecânica* pelo pulso femoral — captura elétrica na tela sem pulso não serve de nada. O transcutâneo é ponte: providenciar o *transvenoso* em seguida.' },
      { tipo:'lista', titulo:'Causas reversíveis a procurar', itens:[
        'Distúrbio eletrolítico, sobretudo *hipercalemia*.',
        'Betabloqueador e bloqueador de canal de cálcio.',
        'Digoxina, lítio, amiodarona e propafenona.',
        '*Isquemia miocárdica* — IAM de parede inferior cursa com bradicardia e BAV.',
        'Hipotireoidismo, hipotermia e hipertensão intracraniana.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Tratar bradicardia assintomática.',
        'Insistir em atropina até 3 mg no Mobitz II ou BAVT sem qualquer resposta — perde-se tempo até o marca-passo.',
        'Ligar o marca-passo transcutâneo sem sedação e analgesia.',
        'Aceitar captura elétrica na tela sem confirmar pulso.',
        'Deixar de procurar hipercalemia e drogas antes de assumir bloqueio primário.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'Instabilidade, Mobitz II, BAV avançado ou BAVT: *UCO/UTI monitorizado*, com avaliação para marca-passo definitivo. Bradicardia por causa reversível corrigida (droga suspensa, potássio ajustado) pode ficar em observação monitorizada até a resolução. BAV de 1º grau e Mobitz I assintomáticos, sem cardiopatia, podem seguir ambulatorialmente — mas com ECG documentado e retorno marcado.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Antes de qualquer droga, pergunte pela *caixa de remédios*: betabloqueador, bloqueador de canal de cálcio e digoxina explicam boa parte das bradicardias do plantão.',
        'Bradicardia com onda T apiculada é hipercalemia até prova em contrário — o tratamento é cálcio, não atropina.',
        'Cole as pás do marca-passo no paciente *antes* de precisar. Quando a bradicardia instabiliza, não sobra tempo para procurar material.',
        'Bradicardia nova com dor torácica: peça ECG de parede inferior e pense em IAM antes de tratar só o ritmo.'
      ]}
    ] },

  { id:'crise-hipertensiva', titulo:'Emergência x urgência hipertensiva', categoria:'cardio', gravidade:'emergencia',
    resumo:'Lesão de órgão-alvo define a conduta; metas de redução e a armadilha de baixar a pressão rápido demais.',
    tags:['crise hipertensiva','pa alta','nitroprussiato','lesao de orgao alvo','pseudocrise','captopril','clonidina'],
    fonte:'SBC — Diretrizes Brasileiras de Hipertensão Arterial · Manual de Cardiologia na Prática 3.0, p. 32–33',
    ficha:[
      { rotulo:'Quando pensar', valor:'PA ≥ *180 × 120 mmHg*. O que separa emergência de urgência não é o número, é a *lesão de órgão-alvo*.' },
      { rotulo:'Prioridade',    valor:'Procurar lesão de órgão-alvo antes de prescrever qualquer coisa.' },
      { rotulo:'Meta',          valor:'*Emergência:* redução imediata e controlada, EV. *Urgência:* controle em 24–48 h, por via oral.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*PA ≥ 180 × 120 mmHg*' },
        { tipo:'passo', rotulo:'Antes de prescrever', texto:'Confirmar a PA nos *dois braços*, em repouso, com manguito adequado',
          nota:'Tratar dor, ansiedade e bexiga cheia primeiro — a *pseudocrise* é frequente e não precisa de anti-hipertensivo' },
        { tipo:'decisao', texto:'Há lesão AGUDA de órgão-alvo?', ramos:[
          { rotulo:'Não', texto:'*URGÊNCIA hipertensiva* — via oral, controle em 24–48 h',
            nota:'Captopril 25–50 mg (age em 15–30 min) ou clonidina 0,1–0,2 mg se ansioso' },
          { rotulo:'Sim', cor:'perigo', texto:'*EMERGÊNCIA hipertensiva* — endovenoso titulável, monitorizado',
            nota:'Neurológico · SCA · EAP · dissecção · lesão renal aguda · eclâmpsia' }
        ]},
        { tipo:'decisao', texto:'Emergência — qual o órgão acometido?', ramos:[
          { rotulo:'SCA ou EAP', texto:'*Nitroglicerina* em bomba',
            nota:'Vasodilatação coronariana e venosa' },
          { rotulo:'Dissecção de aorta', cor:'perigo', texto:'*Betabloqueador ANTES* do vasodilatador',
            nota:'Alvo FC < 60 e só então PAS < 120. Inverter a ordem propaga a dissecção' },
          { rotulo:'Neurológico', texto:'Alvo específico da conduta do *AVC*',
            nota:'Não usar o alvo geral — no AVC isquêmico agudo a régua é outra' }
        ]},
        { tipo:'alerta', rotulo:'Proscrito', texto:'*Nifedipino sublingual*',
          nota:'Queda abrupta e imprevisível, com risco de AVC e IAM' },
        { tipo:'fim', rotulo:'Destino', texto:'*Emergência interna* (monitorizado ou UTI) · *urgência* tem alta com retorno em 7 dias',
          nota:'Perguntar sempre sobre adesão: parar o remédio é a causa mais comum, e aí a conduta é reintroduzir' }
      ]},
      { tipo:'texto', titulo:'A distinção que define tudo', conteudo:'*Emergência hipertensiva:* PA elevada *com lesão aguda de órgão-alvo* — encefalopatia, AVC, edema agudo de pulmão, SCA, dissecção de aorta, lesão renal aguda, eclâmpsia. Exige controle imediato, com medicação endovenosa titulável. *Urgência hipertensiva:* PA igualmente elevada, mas *sem lesão de órgão-alvo*. Controle em 24–48 h, com medicação oral, sem pressa e sem endovenoso. *Pseudocrise:* PA alta reativa a dor, ansiedade, retenção urinária ou abstinência — trata-se a causa, não a pressão.' },
      { tipo:'alerta', titulo:'Red flags — lesão de órgão-alvo', itens:[
        'Neurológico: cefaleia intensa, confusão, convulsão, déficit focal, alteração visual.',
        'Cardíaco: dor torácica, dispneia, congestão pulmonar.',
        'Dor torácica dilacerante com assimetria de pulsos — *dissecção de aorta*.',
        'Renal: oligúria, creatinina em elevação.',
        'Gestante com PA alta, cefaleia e edema — *eclâmpsia/pré-eclâmpsia*, conduta própria.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        'Confirmar a PA com manguito adequado, nos dois braços, com o paciente em repouso.',
        '*Procurar ativamente lesão de órgão-alvo* — é isso que classifica o caso.',
        'Tratar dor, ansiedade e retenção urinária antes de assumir crise: a pseudocrise é frequente.',
        '*Emergência:* medicação endovenosa em bomba, titulável, com monitorização contínua.',
        '*Urgência:* medicação oral e observação; sem endovenoso e sem sublingual.',
        'Reduzir de forma *gradual*: queda abrupta causa isquemia cerebral, coronariana e renal.',
        'Ajustar a meta ao órgão acometido — AVC isquêmico, dissecção e EAP têm alvos diferentes entre si.'
      ]},
      { tipo:'doses', titulo:'Emergência hipertensiva — endovenoso', itens:[
        { droga:'Nitroprussiato de sódio', dose:'0,3–10 mcg/kg/min, titular', via:'EV BIC', obs:'*Fotossensível* — proteger da luz. Ação imediata e curta, ideal para titular. Vigiar intoxicação por cianeto em uso prolongado.' },
        { droga:'Nitroglicerina', dose:'5–100 mcg/min, titular', via:'EV BIC', obs:'Preferida quando há *SCA ou edema agudo de pulmão* — vasodilatação coronariana e venosa.' },
        { droga:'Metoprolol', dose:'5 mg a cada 5 min, máx. 15 mg', via:'EV', obs:'*Na dissecção de aorta entra antes do vasodilatador*, para controlar a FC.' }
      ]},
      { tipo:'doses', titulo:'Urgência hipertensiva — via oral', itens:[
        { droga:'Captopril', dose:'25–50 mg', via:'VO', obs:'Início rápido, 15–30 min. Evitar na suspeita de estenose de artéria renal e na gestante.' },
        { droga:'Clonidina', dose:'0,1–0,2 mg', via:'VO', obs:'Útil no paciente *ansioso*. Cuidado com sonolência e efeito rebote na suspensão.' },
        { droga:'Anlodipino / losartana', dose:'Conforme prescrição de manutenção', via:'VO', obs:'Ajustar ou reintroduzir o esquema de casa — muitas urgências são falta de adesão.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Nifedipino sublingual* — queda abrupta e imprevisível, com risco de AVC e IAM. Está proscrito.',
        'Tratar número de pressão em paciente assintomático e sem lesão de órgão-alvo como se fosse emergência.',
        'Normalizar a pressão rapidamente: a redução é gradual e com alvo definido.',
        'Baixar a pressão no AVC isquêmico agudo fora dos alvos específicos daquela conduta.',
        'Esquecer de perguntar sobre adesão ao tratamento e uso de cocaína ou anti-inflamatório.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Emergência hipertensiva interna*, em leito monitorizado ou UTI conforme o órgão acometido e a necessidade de droga endovenosa. *Urgência hipertensiva* é conduzida no pronto-socorro com medicação oral e observação por algumas horas, alta com esquema ajustado e *retorno em até 7 dias*. *Pseudocrise* resolve tratando a causa — dor, ansiedade, bexiga cheia — e não exige anti-hipertensivo de resgate.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A pergunta que classifica o caso não é "quanto está a pressão", e sim *"há lesão de órgão-alvo?"*. Sem isso, o resto da conduta sai errado.',
        'Boa parte das "crises" do plantão é dor ou ansiedade. Analgesia e um ambiente calmo baixam mais pressão que captopril.',
        'Na dissecção de aorta, betabloqueador *antes* do vasodilatador: vasodilatar primeiro aumenta a força de cisalhamento e propaga a dissecção.',
        'Pergunte se parou o remédio. Falta de adesão é a causa mais comum, e a conduta então é reintroduzir, não escalar.'
      ]}
    ] },

  { id:'tep', titulo:'Tromboembolismo pulmonar', categoria:'cardio', gravidade:'emergencia',
    resumo:'Escores de probabilidade, quando pedir D-dímero, angiotomografia e quem trombolisa.',
    tags:['tep','embolia pulmonar','wells','d-dimero','angiotc','trombolise','heparina','doac','enoxaparina'],
    fonte:'SBC/SBPT — Diretriz de Tromboembolismo Pulmonar · Manual de Cardiologia na Prática 3.0, p. 76–79 · PS Zerado, p. 27–28',
    ficha:[
      { rotulo:'Quando pensar', valor:'Dispneia ou dor torácica *súbitas* sem explicação, principalmente com fator de risco para trombose.' },
      { rotulo:'Prioridade',    valor:'Estratificar risco *antes* de escolher entre anticoagular e trombolisar.' },
      { rotulo:'Meta',          valor:'Anticoagulação iniciada cedo; fibrinólise apenas no alto risco.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'Dispneia ou dor torácica *súbitas* sem explicação',
          nota:'Pulmão limpo e radiografia normal com queixa intensa: a discrepância é o achado' },
        { tipo:'decisao', texto:'O paciente está estável?', ramos:[
          { rotulo:'Não', cor:'perigo', texto:'*Eco à beira do leito* — VD dilatado autoriza a conduta',
            nota:'Não há tempo para escore nem tomografia' },
          { rotulo:'Sim', texto:'Calcular o *Wells modificado*' }
        ]},
        { tipo:'decisao', texto:'Escore de Wells?', ramos:[
          { rotulo:'> 4 — provável', texto:'*Angiotomografia direto*',
            nota:'D-dímero aqui não ajuda e só atrasa' },
          { rotulo:'≤ 4 — improvável', texto:'*D-dímero*',
            nota:'Negativo exclui e encerra · positivo segue para angiotomografia' }
        ]},
        { tipo:'passo', rotulo:'Não esperar', texto:'*Anticoagular já na alta probabilidade*, sem aguardar a confirmação',
          nota:'Desde que não haja contraindicação' },
        { tipo:'decisao', texto:'Estratificação de risco', ramos:[
          { rotulo:'Alto risco', cor:'perigo', texto:'*Fibrinólise* + anticoagulação parenteral — UTI',
            nota:'Instabilidade ou PCR revertida com TEP confirmado' },
          { rotulo:'Intermediário', texto:'*Internar* + enoxaparina 1 mg/kg 12/12 h',
            nota:'Disfunção de VD e/ou biomarcadores elevados. É o grupo que engana e piora' },
          { rotulo:'Baixo risco', cor:'ok', texto:'*Alta* com DOAC ou varfarina',
            nota:'Sem disfunção de VD e sem elevação de biomarcadores' }
        ]},
        { tipo:'fim', rotulo:'Não esquecer', texto:'No choque obstrutivo, *volume com cautela*',
          nota:'O ventrículo direito dilatado não tolera sobrecarga. Associar noradrenalina' }
      ]},
      { tipo:'ordem', titulo:'Escore de Wells modificado', itens:[
        '*Outro diagnóstico menos provável que TEP* — 3 pontos.',
        '*Sinais clínicos de TVP* — 3 pontos.',
        '*TVP ou TEP prévio* — 1,5 ponto.',
        '*Imobilização ≥ 3 dias ou cirurgia no último mês* — 1,5 ponto.',
        '*Taquicardia, FC > 100 bpm* — 1,5 ponto.',
        '*Hemoptise* — 1 ponto.',
        '*Câncer ativo (nos últimos 6 meses)* — 1 ponto.'
      ]},
      { tipo:'texto', titulo:'Como usar o escore', conteudo:'*TEP provável: > 4 pontos* — vá direto à angiotomografia; D-dímero não ajuda aqui e só atrasa. *TEP improvável: ≤ 4 pontos* — solicite *D-dímero*: se negativo, exclui e encerra a investigação; se positivo, segue para angiotomografia. Em paciente instável, não se calcula escore: *ecocardiograma à beira do leito* mostrando disfunção de VD já autoriza a conduta.' },
      { tipo:'alerta', titulo:'Red flags — TEP de alto risco', itens:[
        '*Instabilidade hemodinâmica* — hipotensão ou choque obstrutivo.',
        '*PCR revertida na admissão* com TEP evidenciado por ecocardiograma ou angiotomografia.',
        'Disfunção de ventrículo direito no eco associada a elevação de troponina/BNP.',
        'Hipoxemia grave e refratária.',
        'Síncope como apresentação — marcador de gravidade, não de quadro benigno.'
      ]},
      { tipo:'lista', titulo:'Exames', itens:[
        '*Angiotomografia de tórax* — exame de escolha para confirmar.',
        '*D-dímero* — só quando o TEP é improvável (Wells ≤ 4); alto valor preditivo negativo.',
        'Ecocardiograma à beira do leito: disfunção e dilatação de VD no instável.',
        'ECG: taquicardia sinusal é o mais comum; S1Q3T3 é clássico mas pouco frequente.',
        'Troponina e BNP para estratificar risco intermediário.',
        'Doppler de membros inferiores quando a angiotomografia não é possível.',
        'Gasometria arterial e radiografia de tórax para afastar diferenciais.'
      ]},
      { tipo:'lista', titulo:'Estratificação de risco', itens:[
        '*Alto risco:* instabilidade hemodinâmica ou PCR revertida — fibrinólise.',
        '*Risco intermediário:* estável, mas com disfunção de VD e/ou biomarcadores elevados — *internar* e anticoagular, com vigilância estrita.',
        '*Baixo risco:* estável, sem disfunção de VD e sem elevação de biomarcadores — pode receber *alta hospitalar* com anticoagulação oral e seguimento.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Enoxaparina (terapêutica)', dose:'1 mg/kg de 12/12 h', via:'SC', obs:'Anticoagulação de escolha no risco intermediário. Ajustar se clearance < 30; contraindicada se < 15.' },
        { droga:'Enoxaparina (profilaxia)', dose:'40 mg/dia (ou 0,5 mg/kg)', via:'SC', obs:'Profilaxia em paciente de risco internado.' },
        { droga:'Heparina não fracionada', dose:'80 U/kg em bolus + 18 U/kg/h', via:'EV BIC', obs:'Preferida no instável e na disfunção renal grave — tem meia-vida curta e é reversível, útil se houver chance de trombólise ou cirurgia. *Dosar TTPA de 6/6 h.*' },
        { droga:'Alteplase', dose:'100 mg em 2 h', via:'EV', obs:'*Fibrinólise no TEP de alto risco.* Rodar contraindicações antes; associar anticoagulação parenteral.' },
        { droga:'Rivaroxabana', dose:'15 mg 12/12 h por 21 dias, depois 20 mg/dia', via:'VO', obs:'DOAC para o TEP de baixo risco em alta hospitalar.' },
        { droga:'Varfarina', dose:'Ajustada pelo INR (alvo 2–3)', via:'VO', obs:'Alternativa ao DOAC; exige ponte com heparina até o INR na faixa.' }
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*MOVE* — monitor, oxigênio, acesso venoso, ECG.',
        'Instável: *ecocardiograma à beira do leito* e considerar fibrinólise sem esperar a angiotomografia.',
        'Estável: calcular *Wells*, decidir entre D-dímero e angiotomografia.',
        '*Iniciar anticoagulação já na suspeita de alta probabilidade*, sem aguardar a confirmação, se não houver contraindicação.',
        'Estratificar em alto, intermediário e baixo risco com eco e biomarcadores.',
        'No choque obstrutivo: volume com cautela (o VD dilatado não tolera sobrecarga) e noradrenalina.',
        'Definir o destino conforme a estratificação.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Pedir D-dímero quando o TEP é provável (Wells > 4)* — só atrasa a angiotomografia.',
        'Excluir TEP por D-dímero positivo isolado: ele é sensível, não específico.',
        'Aguardar a angiotomografia para anticoagular quando a probabilidade é alta e não há contraindicação.',
        'Trombolisar TEP estável de risco intermediário como rotina.',
        'Expandir volume generosamente no choque obstrutivo — o VD dilatado piora.',
        'Descartar TEP por radiografia e ECG normais.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'*Alto risco:* UTI, fibrinólise e anticoagulação parenteral. *Risco intermediário:* internação em leito monitorizado, anticoagulação com enoxaparina e vigilância de deterioração — é o grupo que engana, porque parece estável e piora. *Baixo risco:* alta hospitalar possível, com DOAC ou varfarina, orientação clara de sinais de alarme e seguimento ambulatorial precoce garantido.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Dispneia súbita com pulmão limpo e radiografia sem alteração é TEP até prova em contrário — a discrepância entre a queixa e o exame é o achado.',
        'Síncope pode ser a única manifestação, e nesse caso indica gravidade.',
        'No instável não há tempo para escore nem tomografia: *eco à beira do leito com VD dilatado* já sustenta a decisão.',
        'No DPOC exacerbado que não melhora como esperado, pense em TEP — a prevalência é alta e o diagnóstico costuma sair tarde.'
      ]}
    ] },

  { id:'tvp', titulo:'Trombose venosa profunda', categoria:'cardio', gravidade:'urgencia',
    resumo:'Escore de Wells, doppler e anticoagulação ambulatorial x internação.',
    tags:['tvp','trombose','doppler venoso','rivaroxabana','enoxaparina'],
    fonte:'SBACV — Diretrizes de trombose venosa profunda',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Dispneia, dor torácica, taquicardia ou síncope junto: *TEP até prova em contrário*.',
        'Phlegmasia cerulea dolens (membro azulado, muito edemaciado e doloroso) é emergência vascular.',
        'TVP proximal (poplítea ou acima) tem risco embólico alto; distal isolada pode ser acompanhada.',
        'Sangramento ativo, plaquetopenia grave ou cirurgia recente do SNC contraindicam anticoagulação plena.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Edema, dor e empastamento unilateral de membro inferior' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Escore de Wells para TVP* — estratificar antes de pedir exame' },
        { tipo:'decisao', texto:'Qual a probabilidade?', ramos:[
          { rotulo:'Baixa (0 ou menos)', cor:'ok', texto:'*D-dímero*; se negativo, exclui',
            nota:'D-dímero tem valor preditivo negativo alto, mas só na baixa probabilidade' },
          { rotulo:'Moderada (1 a 2)', texto:'D-dímero e/ou *ultrassom com Doppler*' },
          { rotulo:'Alta (3 ou mais)', cor:'perigo', texto:'*Ultrassom com Doppler direto*',
            nota:'Se o exame demora, considerar anticoagulação empírica' }
        ]},
        { tipo:'passo', rotulo:'Confirmada', texto:'*Anticoagulação plena*',
          nota:'Rivaroxabana ou apixabana por via oral; enoxaparina se preferir parenteral' },
        { tipo:'passo', rotulo:'Sempre', texto:'Avaliar sintoma respiratório e investigar TEP se houver',
          nota:'Metade das TVP proximais cursa com embolia silenciosa' },
        { tipo:'fim', rotulo:'Alta', texto:'Possível em TVP não complicada, estável, com anticoagulante iniciado e retorno garantido' }
      ]},
      { tipo:'doses', titulo:'Anticoagulação', itens:[
        { droga:'Rivaroxabana 15 mg', dose:'1 comprimido de 12/12 h por 21 dias', via:'VO', obs:'Depois 20 mg 1x/dia. Tomar com alimento. Não precisa de heparina antes.' },
        { droga:'Apixabana 10 mg', dose:'1 comprimido de 12/12 h por 7 dias', via:'VO', obs:'Depois 5 mg de 12/12 h.' },
        { droga:'Enoxaparina', dose:'1 mg/kg', via:'SC', obs:'De 12/12 h, ou 1,5 mg/kg 1x/dia. Ajustar se clearance abaixo de 30 mL/min.' },
        { droga:'Heparina não fracionada', dose:'80 UI/kg em bolus, depois 18 UI/kg/h', via:'EV', obs:'Escolha em insuficiência renal grave e quando se prevê procedimento.' },
        { droga:'Varfarina 5 mg', dose:'Dose ajustada pelo INR', via:'VO', obs:'Alvo de INR entre 2 e 3. Sobrepor à heparina por no mínimo 5 dias.' },
        { droga:'Dipirona 500 mg/mL', dose:'2 ampolas (2 g)', via:'EV', obs:'Analgesia. Evitar anti-inflamatório junto de anticoagulante.' },
        { droga:'Meia elástica de compressão graduada', dose:'20 a 30 mmHg', via:'—', obs:'Reduz a síndrome pós-trombótica. Não usar na fase aguda com edema muito doloroso.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Pedir D-dímero em paciente de alta probabilidade: positivo não muda nada e negativo não exclui.',
        'Repouso absoluto no leito — a deambulação precoce não aumenta embolia e reduz a dor.',
        'Anti-inflamatório junto do anticoagulante.',
        'Anticoagular sem checar sangramento ativo, plaquetas e função renal.',
        'Dar alta sem definir a duração do tratamento e quem vai acompanhar.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'A maioria das TVP hoje é tratada *ambulatorialmente* com anticoagulante oral direto. *Internar* se houver TEP associado, phlegmasia, dor incontrolável, alto risco de sangramento, insuficiência renal grave, plaquetopenia ou impossibilidade de seguimento. Duração: 3 meses se houver fator provocador transitório; indefinida se for não provocada e recorrente, ou se houver trombofilia ou neoplasia ativa. Investigar neoplasia oculta em TVP não provocada.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Meça a panturrilha nos dois lados a 10 cm da tuberosidade tibial: diferença acima de 3 cm entra no Wells.',
        'Ultrassom negativo com alta suspeita clínica pede repetição em 5 a 7 dias.',
        'Registre a data de início do anticoagulante e a data prevista de reavaliação.'
      ]}
    ] },

  { id:'sindrome-aortica', titulo:'Síndrome aórtica aguda e dissecção', categoria:'cardio', gravidade:'emergencia',
    resumo:'Suspeita clínica, controle de frequência antes do vasodilatador e o cirurgião no telefone.',
    tags:['dissecçao de aorta','aneurisma','aorta','esmolol','dor toracica','stanford','metoprolol','nitroprussiato'],
    fonte:'SBC — Diretriz de Doenças da Aorta · Manual de Cardiologia na Prática 3.0, p. 36',
    ficha:[
      { rotulo:'Quando pensar', valor:'Dor torácica *súbita, dilacerante, migratória*, muitas vezes irradiando para o dorso, em hipertenso mal controlado.' },
      { rotulo:'Prioridade',    valor:'*Sala vermelha.* Mortalidade de 1–2% *por hora* nas primeiras 24–48 h na dissecção tipo A.' },
      { rotulo:'Meta',          valor:'*FC < 60 bpm* e *PAS < 120 mmHg*, nesta ordem, e cirurgião acionado.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'Dor torácica *súbita, dilacerante e migratória*',
          nota:'Migra do peito para o dorso ou abdome. Hipertenso mal controlado' },
        { tipo:'passo', rotulo:'Primeiro minuto', texto:'PA nos *dois braços* + ECG + MOVE',
          nota:'Assimetria de pulsos, sopro aórtico novo, déficit focal, mediastino alargado' },
        { tipo:'alerta', rotulo:'Nunca', texto:'*Não antiagregar, não anticoagular, não trombolisar*',
          nota:'A dissecção pode ocluir o óstio coronariano e simular IAM com supra. Trombolisar esse paciente é fatal' },
        { tipo:'passo', rotulo:'Ordem obrigatória', texto:'Morfina 2–4 mg → *Metoprolol 5 mg EV* até *FC < 60* → só então *nitroprussiato* até *PAS < 120*',
          nota:'Vasodilatar antes do betabloqueador causa taquicardia reflexa e propaga a dissecção' },
        { tipo:'passo', rotulo:'Em paralelo', texto:'*Angiotomografia de aorta* + acionar cirurgia cardiovascular',
          nota:'Telefonar na suspeita — não esperar o resultado do exame' },
        { tipo:'decisao', texto:'Classificação de Stanford?', ramos:[
          { rotulo:'A — ascendente', cor:'perigo', texto:'*Cirurgia de emergência*',
            nota:'Mortalidade de 1–2% por hora nas primeiras 24–48 h' },
          { rotulo:'B — poupa a ascendente', texto:'*UTI* — tratamento clínico ou endovascular',
            nota:'Endovascular se houver má perfusão de órgão, dor refratária ou expansão' }
        ]},
        { tipo:'fim', rotulo:'Sem cirurgia no serviço', texto:'Estabilizar FC e PA e *transferir imediatamente*',
          nota:'Com médico acompanhando, monitor, desfibrilador e as bombas correndo' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Assimetria de pulsos ou de pressão entre os membros.',
        'Sopro de insuficiência aórtica novo.',
        'Déficit neurológico focal associado à dor torácica.',
        'Mediastino alargado na radiografia de tórax.',
        'Dor torácica com *supra de ST* — a dissecção pode ocluir o óstio coronariano e simular IAM; anticoagular nesse caso é catastrófico.',
        'Tamponamento, hipotensão ou choque — sinaliza rotura, e é emergência cirúrgica absoluta.'
      ]},
      { tipo:'texto', titulo:'Classificação', conteudo:'*Stanford A* — envolve a aorta ascendente: *cirurgia de emergência*, com a alta mortalidade horária que justifica a pressa. *Stanford B* — poupa a ascendente: *tratamento clínico ou endovascular*. Pelo tempo de evolução: hiperaguda < 24 h · aguda 1–14 dias · subaguda 15–90 dias · crônica > 90 dias.' },
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*MOVE* — monitor, oxigênio se necessário, dois acessos calibrosos, ECG (para afastar SCA e detectar acometimento coronariano).',
        'Analgesia com morfina — a dor aumenta a descarga adrenérgica e a força de cisalhamento.',
        '*Betabloqueador PRIMEIRO*, para atingir FC < 60 bpm.',
        '*Só depois* vasodilatador, com alvo de PAS < 120 mmHg.',
        'Angiotomografia de aorta assim que o paciente estiver estável o suficiente para o transporte.',
        'Acionar *cirurgia cardiovascular imediatamente* na suspeita — não esperar o exame para telefonar.',
        'Medir a pressão nos dois braços e registrar a diferença.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Morfina', dose:'2–4 mg', via:'EV', obs:'Analgesia reduz a descarga adrenérgica; repetir conforme a dor.' },
        { droga:'Metoprolol', dose:'5 mg a cada 5 min, máx. 15 mg', via:'EV', obs:'*Alvo: FC < 60 bpm.* Entra antes do vasodilatador, sempre.' },
        { droga:'Nitroprussiato de sódio', dose:'Titular em bomba', via:'EV BIC', obs:'*Alvo: PAS < 120 mmHg.* Só depois do betabloqueador. Proteger da luz.' }
      ]},
      { tipo:'lista', titulo:'Exames', itens:[
        '*Angiotomografia de aorta* — exame de escolha, define tipo e extensão.',
        'ECG — afastar SCA e identificar acometimento de óstio coronariano.',
        'Radiografia de tórax: mediastino alargado (não exclui se normal).',
        'Ecocardiograma transtorácico e, se disponível, transesofágico à beira do leito no instável.',
        'Tipagem sanguínea e reserva de hemocomponentes.',
        'Função renal antes do contraste, sem atrasar o exame no paciente grave.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Vasodilatador antes do betabloqueador* — a taquicardia reflexa aumenta a força de cisalhamento e propaga a dissecção.',
        '*Antiagregar ou anticoagular* na suspeita de dissecção, ainda que haja supra de ST.',
        'Trombolisar dor torácica sem afastar dissecção.',
        'Esperar o resultado da angiotomografia para acionar o cirurgião.',
        'Descartar dissecção por radiografia de tórax normal.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'*Stanford A: centro cirúrgico de emergência* — cada hora de atraso acrescenta 1–2% de mortalidade. *Stanford B:* UTI, controle rigoroso de FC e PA, avaliação de tratamento endovascular se houver complicação (má perfusão de órgão, dor refratária, expansão). Serviço sem cirurgia cardiovascular: estabilizar FC e PA e *transferir imediatamente*, com médico, monitor e as drogas correndo em bomba.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Meça a pressão nos *dois braços* em toda dor torácica intensa. É gratuito, leva um minuto e é o achado que mais levanta a suspeita.',
        'Dor que *migra* — começa no peito e vai para o dorso ou abdome — é dissecção até prova em contrário.',
        'Dissecção com supra de ST existe e é armadilha clássica: trombolisar esse paciente é fatal.',
        'A ordem betabloqueador → vasodilatador não é detalhe acadêmico. Inverter piora a dissecção.'
      ]}
    ] },

  { id:'tamponamento', titulo:'Tamponamento cardíaco', categoria:'cardio', gravidade:'emergencia',
    resumo:'Tríade de Beck, achados no POCUS e pericardiocentese de urgência.',
    tags:['tamponamento','derrame pericardico','beck','pericardiocentese','pulso paradoxal'],
    fonte:'SBC — Diretriz de Doenças Pericárdicas',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Tríade de Beck*: hipotensão, turgência jugular e bulhas abafadas. Aparece completa em menos da metade.',
        '*Pulso paradoxal* acima de 10 mmHg é o sinal mais sensível.',
        'Taquicardia com hipotensão que não responde a volume, em paciente com derrame conhecido ou trauma torácico.',
        'ECG com alternância elétrica e baixa voltagem.',
        'O que importa é a *velocidade* de acúmulo, não o volume: 150 mL agudos tamponam.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Choque com turgência jugular e ausculta cardíaca abafada' },
        { tipo:'passo', rotulo:'Imediato', texto:'*POCUS / ecocardiograma à beira do leito*',
          nota:'Derrame com colapso de câmaras direitas na diástole e veia cava dilatada sem variação' },
        { tipo:'passo', rotulo:'Ponte', texto:'*VOLUME* — cristaloide para aumentar a pré-carga',
          nota:'Medida temporária que ganha minutos até a drenagem' },
        { tipo:'decisao', texto:'Qual o contexto?', ramos:[
          { rotulo:'Trauma penetrante', cor:'perigo', texto:'*Toracotomia de emergência* ou pericardiocentese como ponte',
            nota:'No trauma, o coágulo não drena bem por agulha — a cirurgia é o tratamento' },
          { rotulo:'Não traumático', texto:'*Pericardiocentese guiada por ultrassom*',
            nota:'Via subxifoide ou apical. Guiada por imagem sempre que possível' }
        ]},
        { tipo:'alerta', rotulo:'Não fazer', texto:'*Ventilação com pressão positiva* antes de drenar',
          nota:'Reduz o retorno venoso e pode causar parada. Intubar só se inevitável, e drenar antes se der' },
        { tipo:'fim', rotulo:'Depois', texto:'Deixar cateter pericárdico, investigar a causa e acionar a cirurgia cardíaca' }
      ]},
      { tipo:'doses', titulo:'Medidas', itens:[
        { droga:'Cristaloide', dose:'500 a 1000 mL rápido', via:'EV', obs:'Aumenta a pré-carga e mantém o enchimento. Medida de ponte, não tratamento.' },
        { droga:'Pericardiocentese', dose:'—', via:'—', obs:'Subxifoide, agulha em direção ao ombro esquerdo, a 30 a 45 graus, guiada por ultrassom. Retirar 20 a 50 mL já melhora muito.' },
        { droga:'Noradrenalina', dose:'Titular', via:'EV', obs:'Suporte hemodinâmico enquanto se prepara a drenagem.' },
        { droga:'Oxigênio', dose:'Alto fluxo', via:'—', obs:'Evitar intubação antes da drenagem sempre que possível.' },
        { droga:'Reversão de anticoagulação', dose:'Conforme o agente', via:'EV', obs:'Se o derrame for hemorrágico por anticoagulante.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Intubar e ventilar com pressão positiva antes de drenar: pode precipitar parada.',
        'Diurético ou vasodilatador: reduzem a pré-carga e pioram tudo.',
        'Esperar radiografia ou tomografia com o paciente instável — o ultrassom responde na hora.',
        'Pericardiocentese às cegas quando há ultrassom disponível.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Terapia intensiva, com cirurgia cardíaca acionada. Investigar a causa: neoplasia, uremia, tuberculose, pericardite viral, pós-infarto, dissecção de aorta rota, anticoagulação, hipotireoidismo. Enviar o líquido para citologia, bioquímica, cultura e pesquisa de BAAR. Derrame recorrente pode precisar de janela pericárdica.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Pulso paradoxal: a PAS cai mais de 10 mmHg na inspiração. Dá para medir com esfigmomanômetro comum.',
        'POCUS subxifoide leva segundos e muda a conduta — aprenda essa janela.',
        'Turgência jugular com pulmões limpos e hipotensão: tamponamento, pneumotórax hipertensivo ou infarto de VD.'
      ]}
    ] },

  { id:'pericardite-miocardite', titulo:'Pericardite e miocardite aguda', categoria:'cardio', gravidade:'urgencia',
    resumo:'Critérios diagnósticos, AINE + colchicina e os sinais que indicam internação.',
    tags:['pericardite','miocardite','colchicina','atrito pericardico','supra difuso'],
    fonte:'SBC — Diretriz de Miocardites e Pericardites',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Miocardite pode se apresentar como *choque cardiogênico* ou arritmia maligna em paciente jovem.',
        'Troponina elevada com coronárias normais em jovem: pense em miocardite.',
        'Derrame pericárdico com instabilidade: tamponamento.',
        'Febre alta, leucocitose e derrame volumoso indicam pericardite purulenta — drenagem e antibiótico.',
        'Insuficiência cardíaca de início recente em jovem previamente hígido: miocardite até prova em contrário.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor torácica ventilatório-dependente, que melhora sentado e inclinado para a frente' },
        { tipo:'passo', rotulo:'Diagnóstico', texto:'*ECG + ecocardiograma + troponina + marcadores inflamatórios*',
          nota:'ECG: supra de ST difuso e côncavo, com infra de PR. Atrito pericárdico à ausculta' },
        { tipo:'decisao', texto:'Há elevação de troponina ou disfunção ventricular?', ramos:[
          { rotulo:'Não — pericardite isolada', cor:'ok', texto:'*Anti-inflamatório + colchicina*',
            nota:'Tratamento ambulatorial na maioria' },
          { rotulo:'Sim — miopericardite ou miocardite', cor:'perigo', texto:'*Internar e monitorizar*',
            nota:'Risco de arritmia e disfunção. Restrição de exercício por meses' }
        ]},
        { tipo:'passo', rotulo:'Base do tratamento', texto:'*Anti-inflamatório em dose plena + COLCHICINA por 3 meses*',
          nota:'A colchicina reduz a recorrência pela metade e é o item mais esquecido' },
        { tipo:'passo', rotulo:'Diferencial', texto:'Afastar síndrome coronariana: o supra da pericardite é difuso e côncavo, sem imagem em espelho' },
        { tipo:'fim', rotulo:'Orientar', texto:'Restrição de exercício até a resolução; na miocardite, por 3 a 6 meses' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Ibuprofeno', dose:'600 a 800 mg', via:'VO', obs:'De 8/8 h por 1 a 2 semanas, com redução gradual.' },
        { droga:'Ácido acetilsalicílico', dose:'650 a 1000 mg', via:'VO', obs:'De 8/8 h. Escolha se houver infarto associado.' },
        { droga:'Colchicina', dose:'0,5 mg de 12/12 h (0,5 mg/dia se peso abaixo de 70 kg)', via:'VO', obs:'Por 3 meses. Reduz a recorrência pela metade — não esquecer.' },
        { droga:'Omeprazol 20 mg', dose:'1 cápsula', via:'VO', obs:'Proteção gástrica enquanto usar o anti-inflamatório.' },
        { droga:'Prednisona', dose:'0,25 a 0,5 mg/kg/dia', via:'VO', obs:'Por 2 a 4 semanas com desmame. Só em refratários ou contraindicação ao AINE — aumenta recorrência.' },
        { droga:'Suporte da insuficiência cardíaca', dose:'Conforme o quadro', via:'—', obs:'Na miocardite com disfunção: diurético, IECA, betabloqueador quando estável.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esquecer a colchicina — é o que mais reduz recorrência.',
        'Corticoide como primeira linha: aumenta a taxa de recorrência.',
        'Liberar exercício físico precocemente, sobretudo na miocardite: risco de arritmia e morte súbita.',
        'Anticoagular pericardite: risco de transformação hemorrágica do derrame.',
        'Confundir com infarto e levar a cateterismo sem olhar o padrão do ECG.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na pericardite idiopática de baixo risco: sem febre alta, sem derrame volumoso, sem elevação de troponina, sem imunossupressão, sem anticoagulação e sem trauma — com anti-inflamatório, colchicina por 3 meses e retorno. *Internar* na presença de qualquer critério de alto risco, na miocardite, e em toda suspeita de pericardite purulenta ou tuberculosa. Restrição de exercício até normalizar; na miocardite, 3 a 6 meses.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Supra difuso e côncavo com infra de PR é pericardite; supra localizado com imagem em espelho é infarto.',
        'Peça ao paciente para se inclinar para a frente: a melhora da dor é bem característica.',
        'Escreva a colchicina na receita antes de qualquer outra coisa — é a que muda o futuro.'
      ]}
    ] },

  { id:'sincope', titulo:'Síncope: estratificação de risco', categoria:'cardio', gravidade:'urgencia',
    resumo:'Separar a síncope reflexa da cardiogênica e decidir quem fica internado para monitorização.',
    tags:['sincope','desmaio','lipotimia','canadian syncope','ecg'],
    fonte:'SBC — Diretriz de Síncope',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — síncope de causa cardíaca', itens:[
        'Síncope *durante o esforço* ou em decúbito.',
        'Sem pródromo, com trauma facial pela queda.',
        'Palpitação precedendo, ou dor torácica e dispneia associadas.',
        'História familiar de morte súbita antes dos 50 anos.',
        'Cardiopatia estrutural conhecida, ou ECG alterado.',
        'Idade avançada, anemia, ou sangramento ativo.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Perda transitória da consciência com recuperação espontânea e completa' },
        { tipo:'passo', rotulo:'Sempre', texto:'*ECG de 12 derivações* + glicemia + PA deitado e em pé + hemograma',
          nota:'Beta-HCG em mulher em idade fértil. Toque retal se houver suspeita de sangramento' },
        { tipo:'passo', rotulo:'Diferenciar', texto:'Síncope x crise convulsiva x hipoglicemia x AIT x causa psicogênica',
          nota:'Recuperação imediata e completa favorece síncope; confusão pós-ictal prolongada favorece convulsão' },
        { tipo:'decisao', texto:'Qual o padrão?', ramos:[
          { rotulo:'Vasovagal — pródromo, gatilho, situação típica', cor:'ok',
            texto:'*Orientação e alta*', nota:'Calor, dor, emoção, jejum, ortostase prolongada. Ensinar manobras de contrapressão' },
          { rotulo:'Ortostática', texto:'Rever medicações e volemia',
            nota:'Queda de 20 mmHg na sistólica ou 10 na diastólica ao levantar' },
          { rotulo:'Cardíaca ou red flag presente', cor:'perigo', texto:'*Investigar e internar*',
            nota:'Monitorização, ecocardiograma, Holter; considerar TEP e dissecção' }
        ]},
        { tipo:'passo', rotulo:'Estratificar', texto:'Aplicar *Canadian Syncope Risk Score* e registrar' },
        { tipo:'fim', rotulo:'Alta', texto:'Vasovagal típica, ECG normal, sem red flag, sem trauma importante — com orientação escrita' }
      ]},
      { tipo:'lista', titulo:'O que procurar no ECG', itens:[
        'Bloqueio atrioventricular de 2º ou 3º grau; bloqueio bifascicular.',
        'Bradicardia sinusal importante ou pausas.',
        'QT longo ou curto.',
        'Padrão de *Brugada*: supra de ST em V1 a V3 com bloqueio de ramo direito.',
        'Onda épsilon ou T invertida em precordiais direitas: displasia arritmogênica.',
        'Hipertrofia ventricular esquerda: estenose aórtica ou cardiomiopatia hipertrófica.',
        'Pré-excitação (Wolff-Parkinson-White).',
        'Sinais de isquemia ou de sobrecarga direita (S1Q3T3).'
      ]},
      { tipo:'doses', titulo:'Medidas', itens:[
        { droga:'ECG de 12 derivações', dose:'—', via:'—', obs:'Em toda síncope, sem exceção.' },
        { droga:'Glicemia capilar', dose:'—', via:'—', obs:'Hipoglicemia é causa reversível e frequente.' },
        { droga:'Cristaloide', dose:'500 mL', via:'EV', obs:'Se houver hipovolemia ou hipotensão ortostática.' },
        { droga:'Hemograma e beta-HCG', dose:'—', via:'—', obs:'Anemia por sangramento e gestação ectópica se apresentam como síncope.' },
        { droga:'Manobras de contrapressão', dose:'—', via:'—', obs:'Cruzar as pernas e contrair, apertar as mãos. Ensinar ao paciente com síncope vasovagal.' },
        { droga:'Revisão de medicações', dose:'—', via:'—', obs:'Anti-hipertensivo, diurético, alfabloqueador, antidepressivo, nitrato e drogas que alargam o QT.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Dar alta sem ECG.',
        'Chamar de "vasovagal" a síncope que ocorreu durante o esforço ou em decúbito.',
        'Tomografia de crânio de rotina: só se houve trauma craniano, déficit focal ou cefaleia.',
        'Ignorar a história familiar de morte súbita.',
        'Deixar de medir a pressão em ortostase.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na síncope vasovagal ou situacional típica, com ECG normal, exame normal, sem red flag e sem trauma importante — com orientação sobre gatilhos, hidratação, sal e manobras de contrapressão. *Internar ou observar em monitor* se houver qualquer red flag, ECG alterado, cardiopatia estrutural, síncope de esforço, ou suspeita de sangramento, TEP ou dissecção. Encaminhar à cardiologia quando a causa não for esclarecida.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Ouça a testemunha: a descrição de quem viu vale mais que o relato do paciente.',
        'Síncope no esforço em jovem é cardiopatia estrutural até prova em contrário — não libere.',
        'Registre o ECG no prontuário e descreva o que você procurou nele.'
      ]}
    ] },

  /* ======================= 02 · RESPIRATÓRIO ======================= */
  { id:'insuficiencia-respiratoria', titulo:'Insuficiência respiratória aguda', categoria:'resp', gravidade:'emergencia',
    resumo:'Reconhecer a falência, escolher o dispositivo de oxigênio e definir o momento de intubar.',
    tags:['insuficiencia respiratoria','hipoxemia','oxigenio','cateter nasal','mascara','cnaf'],
    fonte:'AMIB/SBPT — Recomendações de suporte ventilatório',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Exaustão, respiração paradoxal, fala entrecortada, sudorese e rebaixamento: intubação iminente.',
        'Saturação que não sobe com oxigênio em alto fluxo: shunt — pense em SDRA, pneumonia extensa, TEP.',
        'Bradipneia com rebaixamento: hipercapnia avançada, não melhora "esperando um pouco".',
        'Silêncio auscultatório com esforço importante: asma quase fatal ou pneumotórax.',
        'Não persista em ventilação não invasiva por mais de 1 a 2 horas sem melhora clara.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dispneia com hipoxemia, hipercapnia ou trabalho respiratório aumentado' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Oxigênio titulado* + monitorização + acesso + gasometria',
          nota:'Alvo de SatO2 de 94 a 98%; de 88 a 92% no retentor crônico de CO2' },
        { tipo:'decisao', texto:'Qual o tipo?', ramos:[
          { rotulo:'Tipo 1 — hipoxêmica', texto:'PaO2 baixa com PaCO2 normal ou baixa',
            nota:'Pneumonia, edema agudo, TEP, SDRA, atelectasia' },
          { rotulo:'Tipo 2 — hipercápnica', texto:'PaCO2 alta com acidose respiratória',
            nota:'DPOC, doença neuromuscular, depressão do centro respiratório, obesidade' }
        ]},
        { tipo:'decisao', texto:'Responde ao oxigênio e ao tratamento da causa?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'Manter, reavaliar e tratar a causa' },
          { rotulo:'Não, mas está desperto e colabora', texto:'*Ventilação não invasiva*',
            nota:'Melhor evidência: exacerbação de DPOC e edema agudo de pulmão' },
          { rotulo:'Não, ou rebaixado, ou exausto', cor:'perigo', texto:'*INTUBAR*',
            nota:'Não espere a parada. Sequência rápida com pré-oxigenação' }
        ]},
        { tipo:'passo', rotulo:'Sempre', texto:'*Tratar a causa*: broncodilatador, diurético, antibiótico, anticoagulação, drenagem' },
        { tipo:'fim', rotulo:'Destino', texto:'Terapia intensiva se houver necessidade de suporte ventilatório' }
      ]},
      { tipo:'doses', titulo:'Suporte', itens:[
        { droga:'Oxigênio — cateter nasal', dose:'1 a 6 L/min', via:'—', obs:'Cada litro sobe cerca de 4% na FiO2.' },
        { droga:'Máscara com reservatório', dose:'10 a 15 L/min', via:'—', obs:'FiO2 próxima de 100%. Não deixar o reservatório colabar.' },
        { droga:'Cânula nasal de alto fluxo', dose:'30 a 60 L/min, FiO2 titulada', via:'—', obs:'Boa na insuficiência hipoxêmica; mais confortável que a VNI.' },
        { droga:'Ventilação não invasiva', dose:'CPAP 8 a 10 ou binível', via:'—', obs:'Melhor evidência em DPOC e edema agudo. Reavaliar em 1 a 2 horas.' },
        { droga:'Sequência rápida de intubação', dose:'Ver a conduta específica', via:'—', obs:'Pré-oxigenar bem: o paciente hipoxêmico dessatura em segundos.' },
        { droga:'Tratamento da causa', dose:'—', via:'—', obs:'Broncodilatador, corticoide, diurético, antibiótico, trombolítico, dreno.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Oxigênio em alto fluxo sem alvo no retentor crônico: causa narcose por CO2.',
        'Insistir em ventilação não invasiva em paciente rebaixado, agitado ou que não protege a via aérea.',
        'Sedar para "acalmar" o paciente dispneico sem plano de via aérea.',
        'Esperar a gasometria para tratar o paciente que está exausto.',
        'Intubar sem pré-oxigenar adequadamente.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Interna toda insuficiência respiratória que precisou de suporte. Terapia intensiva se houve intubação, se a VNI foi mantida, ou se há instabilidade. Definir e registrar o tipo (hipoxêmica ou hipercápnica) e a causa: são elas que orientam o tratamento. Reavaliar gasometria após cada intervenção maior.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Olhe o paciente antes do monitor: exaustão, uso de musculatura acessória e frases curtas dizem mais.',
        'A frequência respiratória é o sinal vital mais negligenciado e o mais preditivo.',
        'Se você está se perguntando se deve intubar, provavelmente já deveria ter intubado.'
      ]}
    ] },

  { id:'vni', titulo:'Ventilação não invasiva: quando indicar', categoria:'resp', gravidade:'urgencia',
    resumo:'Indicações claras (EAP e DPOC), contraindicações e os critérios de falha que mandam intubar.',
    tags:['vni','bipap','cpap','ventilacao nao invasiva','falha de vni'],
    fonte:'AMIB/SBPT — Diretrizes brasileiras de ventilação mecânica',
    secoes:[
      { tipo:'alerta', titulo:'Contraindicações absolutas', itens:[
        'Parada cardiorrespiratória ou necessidade imediata de intubação.',
        'Rebaixamento do nível de consciência com incapacidade de proteger a via aérea (exceto narcose por CO2 na DPOC).',
        'Vômito ativo ou alto risco de aspiração.',
        'Obstrução de via aérea superior, trauma ou cirurgia recente de face.',
        'Instabilidade hemodinâmica grave ou arritmia maligna.',
        'Pneumotórax não drenado.'
      ]},
      { tipo:'fluxo', titulo:'Como conduzir', itens:[
        { tipo:'inicio', rotulo:'Indicação', texto:'Insuficiência respiratória com paciente desperto e colaborativo' },
        { tipo:'decisao', texto:'Qual o cenário?', ramos:[
          { rotulo:'Exacerbação de DPOC com acidose', cor:'ok',
            texto:'*Melhor evidência* — binível reduz intubação e mortalidade',
            nota:'pH abaixo de 7,35 com PaCO2 acima de 45' },
          { rotulo:'Edema agudo de pulmão', cor:'ok', texto:'*CPAP ou binível* — reduz intubação e mortalidade' },
          { rotulo:'Hipoxemia por pneumonia ou SDRA', texto:'Uso cauteloso; considerar cânula de alto fluxo',
            nota:'Risco de atraso na intubação. Reavaliar rigorosamente' }
        ]},
        { tipo:'passo', rotulo:'Iniciar', texto:'Explicar ao paciente, ajustar a máscara sem vazamento e começar com pressões baixas',
          nota:'IPAP 8 a 12, EPAP 4 a 6, subindo conforme a tolerância e a resposta' },
        { tipo:'passo', rotulo:'Reavaliar em 1 a 2 horas', texto:'*Gasometria, frequência respiratória, conforto e nível de consciência*',
          nota:'Sem melhora clara nesse prazo é falha: intube' },
        { tipo:'alerta', rotulo:'Armadilha', texto:'*Insistir na VNI atrasa a intubação e piora o desfecho*' },
        { tipo:'fim', rotulo:'Sucesso', texto:'Desmame progressivo com períodos livres crescentes' }
      ]},
      { tipo:'doses', titulo:'Parâmetros iniciais', itens:[
        { droga:'CPAP', dose:'8 a 10 cmH2O', via:'—', obs:'Edema agudo de pulmão. Pressão única, contínua.' },
        { droga:'Binível — IPAP', dose:'Iniciar em 8 a 12, subir até 20 a 25', via:'—', obs:'Determina o volume corrente e a ventilação. Sobe se a PaCO2 estiver alta.' },
        { droga:'Binível — EPAP', dose:'4 a 6 cmH2O', via:'—', obs:'Determina a oxigenação e evita reinalação. Sobe se a hipoxemia persistir.' },
        { droga:'FiO2', dose:'Titular', via:'—', obs:'Alvo de SatO2 de 94 a 98%; de 88 a 92% no retentor de CO2.' },
        { droga:'Interface', dose:'Máscara oronasal na fase aguda', via:'—', obs:'Ajustar sem vazamento e sem apertar demais: úlcera de pressão no nariz é frequente.' },
        { droga:'Cânula nasal de alto fluxo', dose:'30 a 60 L/min', via:'—', obs:'Alternativa mais confortável na insuficiência hipoxêmica pura.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Usar VNI em paciente rebaixado que não protege a via aérea.',
        'Sedar para o paciente "tolerar" a máscara.',
        'Manter por horas sem reavaliação objetiva.',
        'VNI em pneumotórax não drenado.',
        'Usar como substituto da intubação em quem já está exausto.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo paciente em ventilação não invasiva fica em leito monitorizado, com equipe treinada e material de intubação à mão. Definir de antemão os *critérios de falha*: piora da gasometria, do nível de consciência ou do conforto em 1 a 2 horas. Registrar os parâmetros, os horários e as reavaliações.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Fique ao lado do paciente nos primeiros 15 minutos: a adaptação inicial define o sucesso.',
        'Proteja o dorso do nariz com curativo desde o começo.',
        'Escreva no prontuário a hora de início e o horário previsto da reavaliação.'
      ]}
    ] },

  { id:'asma-crise', titulo:'Crise de asma no adulto', categoria:'resp', gravidade:'emergencia',
    resumo:'Classificação de gravidade, beta-2 + ipratrópio, corticoide precoce e sulfato de magnésio na crise grave.',
    tags:['asma','broncoespasmo','salbutamol','ipratropio','prednisolona','sulfato de magnesio','aerolin','atrovent'],
    fonte:'SBPT — Recomendações para o manejo da asma · PS Zerado, p. 23–24',
    ficha:[
      { rotulo:'Quando pensar', valor:'Dispneia com sibilância e tempo expiratório prolongado em asmático conhecido, quase sempre com gatilho identificável.' },
      { rotulo:'Prioridade',    valor:'Beta-2 nos primeiros minutos e *corticoide na primeira hora* — o corticoide é o que muda a evolução.' },
      { rotulo:'Meta',          valor:'SpO2 93–95%, queda do esforço respiratório e paciente falando frases completas.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dispneia com sibilância e tempo expiratório prolongado' },
        { tipo:'alerta', rotulo:'Crise quase fatal', texto:'*Tórax silencioso · fala em palavras · sonolência · bradicardia*',
          nota:'Ausência de sibilo é obstrução tão grave que não gera fluxo — é pior, não melhor' },
        { tipo:'passo', rotulo:'Primeira hora', texto:'O2 com alvo *93–95%* + *beta-2 de 20/20 min* + ipratrópio se moderada/grave',
          nota:'Spray com espaçador funciona tão bem quanto nebulização na crise leve e moderada' },
        { tipo:'passo', rotulo:'Ainda na 1ª hora', texto:'*CORTICOIDE SISTÊMICO — sempre*',
          nota:'Prednisolona 40–60 mg VO, ou hidrocortisona 200–500 mg EV se não engole. Leva horas para agir, por isso entra cedo' },
        { tipo:'decisao', texto:'Reavaliação formal aos 60 minutos', ramos:[
          { rotulo:'Boa resposta', cor:'ok', texto:'Observar 1 h após a última dose e considerar *alta*' },
          { rotulo:'Parcial ou ausente', texto:'*Sulfato de magnésio 1–2 g EV* + internar' },
          { rotulo:'Exaustão', cor:'perigo', texto:'*Preparar via aérea* — UTI',
            nota:'pCO2 normal ou alta na crise grave é fadiga, não melhora' }
        ]},
        { tipo:'fim', rotulo:'Alta', texto:'*Corticoide oral por 5 dias* + técnica inalatória revisada + retorno em 7 dias',
          nota:'Perguntar quantas vezes usou a bombinha em casa: uso frequente de resgate é o melhor marcador de risco' }
      ]},
      { tipo:'alerta', titulo:'Red flags — crise quase fatal', itens:[
        '*Tórax silencioso* — ausência de sibilos com esforço respiratório: obstrução tão grave que não gera fluxo.',
        'Fala entrecortada em palavras, ou incapacidade de falar.',
        'Sonolência, confusão ou exaustão — sinal de falência iminente.',
        'Bradicardia, cianose ou uso intenso de musculatura acessória.',
        '*pCO2 normal ou aumentada* em crise grave é sinal de fadiga, não de melhora.',
        'História de intubação prévia por asma, internação recente ou uso frequente de resgate.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        'Monitorização, oximetria e *oxigênio para manter SpO2 93–95%* — não hiperoxigenar.',
        '*Beta-2 de curta duração em série*, na primeira hora, de 20 em 20 minutos.',
        '*Associar ipratrópio* nas crises moderadas e graves.',
        '*Corticoide sistêmico na primeira hora*, sempre — via oral tem eficácia equivalente à venosa em quem consegue engolir.',
        'Reavaliar após a primeira hora: resposta define alta, observação ou internação.',
        'Crise grave sem resposta: *sulfato de magnésio* endovenoso.',
        'Preparar via aérea se houver sinal de exaustão — a intubação do asmático é de alto risco e não deve ser improvisada.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Salbutamol spray (leve/moderada)', dose:'4 jatos a cada 20 min na 1ª hora', via:'INAL', obs:'100 mcg/jato, *com espaçador*. Após controle: 4 jatos a cada 2 h.' },
        { droga:'Salbutamol spray (grave)', dose:'4–10 jatos a cada 20 min na 1ª hora', via:'INAL', obs:'Depois 1/1 h se broncoespasmo intenso, e a cada 2–6 h após controle.' },
        { droga:'Salbutamol gotas (nebulização)', dose:'40 gotas em 3–5 mL de SF', via:'INAL', obs:'Alternativa ao spray, até de 4/4 h.' },
        { droga:'Fenoterol gotas', dose:'10–15 gotas em 5 mL de SF', via:'INAL', obs:'Nebulização de 4/4 h.' },
        { droga:'Ipratrópio spray', dose:'4 jatos a cada 20 min na 1ª hora', via:'INAL', obs:'25 mcg/jato. Depois 1/1 h se intenso, a cada 2–6 h após controle. *Associar ao beta-2 na crise moderada e grave.*' },
        { droga:'Prednisolona', dose:'40–60 mg pela manhã, 5 dias', via:'VO', obs:'3 comprimidos de 20 mg. *Não precisa desmame* nesse período curto.' },
        { droga:'Hidrocortisona', dose:'200–500 mg de ataque', via:'EV', obs:'Diluir em 10 mL de ABD. Para quem não consegue via oral ou está em crise grave.' },
        { droga:'Sulfato de magnésio', dose:'1–2 g em 20 min', via:'EV', obs:'Crise grave sem resposta ao tratamento inicial.' }
      ]},
      { tipo:'tempo', titulo:'Linha do tempo', itens:[
        { quando:'0–10 min', o_que:'Oximetria, oxigênio se necessário e *primeira série de beta-2*.' },
        { quando:'≤ 60 min', o_que:'Três séries de beta-2 (+ ipratrópio) e *corticoide administrado*.' },
        { quando:'60 min',   o_que:'*Reavaliação formal*: fala, esforço, ausculta, saturação. Define o rumo.' },
        { quando:'1–3 h',    o_que:'Sem resposta: sulfato de magnésio e decisão de internação.' },
        { quando:'≥ 3 h',    o_que:'Boa resposta mantida por 1 h após a última dose: considerar alta.', fim:true }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Adiar o corticoide para "ver se melhora com a bombinha" — ele leva horas para agir e por isso entra cedo.',
        'Confiar em sibilo como medida de gravidade: *tórax silencioso é pior*, não melhor.',
        'Antibiótico de rotina — crise de asma na maioria das vezes não é infecção bacteriana.',
        'Sedar o asmático em crise fora do contexto de intubação: mascara a exaustão.',
        'Oxigênio em alto fluxo sem alvo, buscando saturação de 100%.',
        'Dar alta sem corticoide de manutenção, sem técnica inalatória revisada e sem retorno marcado.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* para quem tem boa resposta clínica sustentada por pelo menos 1 h após a última dose, saturação adequada em ar ambiente, fala normal e ausculta melhorada — sempre com *corticoide oral por 5 dias*, ajuste da medicação de manutenção, revisão da técnica inalatória e retorno em até 7 dias. *Interna* quem tem resposta parcial ou ausente após a primeira hora, necessidade contínua de beta-2, hipoxemia persistente, crise quase fatal, ou fatores de risco social que impeçam o retorno. *UTI* para exaustão, rebaixamento, pCO2 elevada ou necessidade de ventilação.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Spray com *espaçador* funciona tão bem quanto nebulização na crise leve e moderada, com menos efeito colateral — e libera o leito mais rápido.',
        'Pergunte quantas vezes usou a bombinha em casa antes de vir: uso frequente de resgate é o melhor marcador de risco de crise grave.',
        'A pCO2 normalizando numa crise grave costuma ser mau sinal, não bom — o paciente está cansando.',
        'Intubar asmático é de alto risco: hipotensão por auto-PEEP e barotrauma. Se for inevitável, planeje ventilação com tempo expiratório longo e aceite hipercapnia permissiva.'
      ]}
    ] },

  { id:'dpoc-exacerbacao', titulo:'Exacerbação de DPOC', categoria:'resp', gravidade:'urgencia',
    resumo:'Alvo de saturação 88–92%, broncodilatador, corticoide, antibiótico quando indicado e VNI.',
    tags:['dpoc','exacerbacao','enfisema','bronquite','vni','retentor de co2','anthonisen'],
    fonte:'SBPT — Recomendações para o manejo da DPOC · PS Zerado, p. 24–26',
    ficha:[
      { rotulo:'Quando pensar', valor:'Piora aguda e sustentada da dispneia basal, com aumento do volume ou da purulência da secreção, em portador de DPOC.' },
      { rotulo:'Prioridade',    valor:'*Alvo de SpO2 88–92%.* Oxigênio em excesso aqui piora a retenção de CO2 e derruba o nível de consciência.' },
      { rotulo:'Meta',          valor:'Dispneia controlada sem acidose respiratória progressiva.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Piora aguda da dispneia basal + secreção, em portador de DPOC' },
        { tipo:'alerta', rotulo:'Regra de ouro', texto:'*Alvo de SpO2 88–92%*',
          nota:'Oxigênio em alto fluxo buscando 100% precipita narcose por CO2. É o erro clássico desta conduta' },
        { tipo:'passo', rotulo:'Base do tratamento', texto:'Beta-2 + ipratrópio + *prednisolona 40 mg* por 5–7 dias' },
        { tipo:'decisao', texto:'Critérios de Anthonisen? (dispneia · volume · purulência)', ramos:[
          { rotulo:'3, ou 2 com purulência', texto:'*Antibiótico* — amoxicilina-clavulanato 7 dias',
            nota:'Risco de pseudomonas: levofloxacino 750 mg/dia' },
          { rotulo:'Menos que isso', texto:'*Sem antibiótico* — não é rotina em toda exacerbação' }
        ]},
        { tipo:'decisao', texto:'Gasometria — pH < 7,35 com hipercapnia?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*VNI* — reduz intubação e mortalidade' },
          { rotulo:'Não', texto:'Manter o tratamento e reavaliar' }
        ]},
        { tipo:'decisao', texto:'Gasometria de controle após 1 h de VNI', ramos:[
          { rotulo:'pH melhorou', cor:'ok', texto:'Manter a VNI e o tratamento' },
          { rotulo:'Não melhorou', cor:'perigo', texto:'Reavaliar a estratégia — considerar *intubação*',
            nota:'VNI funcionando se vê na gasometria, não na impressão clínica' }
        ]},
        { tipo:'fim', rotulo:'Não esquecer', texto:'Exacerbação que não responde: *pensar em TEP*',
          nota:'Prevalência alta no DPOC e diagnóstico que sai tarde. E pergunte se a bombinha de casa acabou' }
      ]},
      { tipo:'passos', titulo:'Quando suspeitar', itens:[
        '*Critérios de Anthonisen:* piora da dispneia, aumento do volume da secreção e aumento da purulência.',
        'Três critérios (ou dois incluindo purulência) apontam exacerbação com benefício de antibiótico.',
        'Investigar sempre o gatilho: infecção viral ou bacteriana, má adesão, poluição, pneumotórax, TEP, IC associada.',
        '*Descompensação de DPOC e IC se parecem muito* — e frequentemente coexistem no mesmo paciente.'
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Rebaixamento do nível de consciência ou flapping — *narcose por CO2*.',
        'Acidose respiratória com pH < 7,35 na gasometria: indicação de VNI.',
        'Uso de musculatura acessória, respiração paradoxal, exaustão.',
        'Instabilidade hemodinâmica ou arritmia nova.',
        'Assimetria de ausculta — pensar em pneumotórax, que é comum no enfisematoso.'
      ]},
      { tipo:'lista', titulo:'Exames', itens:[
        '*Gasometria arterial* — é o exame que muda a conduta; oximetria sozinha não mostra retenção de CO2.',
        'Radiografia de tórax para pneumonia, pneumotórax e congestão.',
        'ECG e hemograma.',
        'BNP quando há dúvida entre DPOC e insuficiência cardíaca.',
        'D-dímero/angiotomografia se houver suspeita de TEP — comum e subdiagnosticado nesse perfil.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Salbutamol spray', dose:'2 jatos de 4/4 h ou 6/6 h, por 7 dias', via:'INAL', obs:'100 mcg/jato, com espaçador. Na crise, séries mais frequentes.' },
        { droga:'Ipratrópio spray', dose:'2 jatos de 6/6 h, por 7 dias', via:'INAL', obs:'25 mcg/jato. Associar ao beta-2.' },
        { droga:'Prednisolona', dose:'40 mg pela manhã, 5–7 dias', via:'VO', obs:'2 comprimidos de 20 mg. Curso curto, sem desmame.' },
        { droga:'Amoxicilina-clavulanato', dose:'875+125 mg de 12/12 h por 7 dias', via:'VO', obs:'Ou 500+125 mg de 8/8 h. Primeira escolha quando há indicação de antibiótico.' },
        { droga:'Azitromicina', dose:'500 mg/dia por 5 dias', via:'VO', obs:'Alternativa.' },
        { droga:'Claritromicina', dose:'500 mg de 12/12 h por 7 dias', via:'VO', obs:'Alternativa.' },
        { droga:'Levofloxacino', dose:'750 mg/dia por 5 dias', via:'VO', obs:'*Quando há risco de pseudomonas* — exacerbações frequentes, uso recente de antibiótico, VEF1 muito baixo.' }
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*Oxigênio com alvo de SpO2 88–92%*, preferindo cateter de baixo fluxo ou máscara de Venturi.',
        'Broncodilatador de curta duração, beta-2 associado ao ipratrópio.',
        'Corticoide sistêmico por curso curto.',
        'Antibiótico *se* houver critérios de Anthonisen — não é rotina em toda exacerbação.',
        '*VNI* na acidose respiratória (pH < 7,35 com hipercapnia): reduz intubação e mortalidade.',
        'Reavaliar gasometria após 1 h de VNI para confirmar que está funcionando.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Oxigênio em alto fluxo buscando saturação de 100%* — é o erro clássico e precipita narcose por CO2.',
        'Antibiótico em toda exacerbação, sem critério de purulência.',
        'Corticoide em curso longo ou com desmame prolongado.',
        'Deixar de fazer gasometria no paciente dispneico e sonolento.',
        'Insistir em VNI em quem já está rebaixado, sem proteção de via aérea.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* para exacerbação leve com boa resposta, sem hipoxemia nova, sem acidose e com suporte domiciliar — com broncodilatador, corticoide por 5–7 dias, antibiótico se indicado, revisão da técnica inalatória e retorno em 7 dias. *Interna* quem tem acidose respiratória, hipoxemia nova ou piora importante do padrão basal, comorbidade descompensada, falha do tratamento ambulatorial ou incapacidade de se cuidar em casa. *UTI* para necessidade de VNI contínua, rebaixamento, instabilidade ou indicação de intubação.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'O alvo 88–92% não é economia de oxigênio: é a diferença entre o paciente melhorar e ser intubado por narcose.',
        'Toda vez que a exacerbação parecer estranha ou não responder, lembre-se de *TEP* — a prevalência no DPOC exacerbado é alta e passa batido.',
        'VNI funcionando se vê na gasometria de 1 hora, não na impressão clínica. Se o pH não melhorou, reavalie a estratégia.',
        'Pergunte se a bombinha de casa acabou. Boa parte das "exacerbações" é falta de acesso ao remédio, e isso muda a conduta da alta.'
      ]}
    ] },

  { id:'pneumonia-comunidade', titulo:'Pneumonia adquirida na comunidade', categoria:'resp', gravidade:'urgencia',
    resumo:'CURB-65 e SMART-COP para decidir o destino, escolha do antibiótico e critérios de UTI.',
    tags:['pac','pneumonia','curb-65','amoxicilina','ceftriaxona','azitromicina','clavulin'],
    fonte:'SBPT — Diretrizes brasileiras para pneumonia adquirida na comunidade · PS Zerado, p. 26–27',
    ficha:[
      { rotulo:'Quando pensar', valor:'Tosse, febre e dispneia com achado focal na ausculta ou infiltrado novo na radiografia.' },
      { rotulo:'Prioridade',    valor:'*Antibiótico precoce*, e o CURB-65 define onde o paciente vai ser tratado.' },
      { rotulo:'Meta',          valor:'Primeira dose de antibiótico ainda no pronto-socorro e destino definido corretamente.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Tosse, febre e dispneia com infiltrado novo',
          nota:'No idoso pode ser só *confusão e queda*, sem febre e sem tosse' },
        { tipo:'passo', rotulo:'Primeiro', texto:'Oximetria + O2 se SpO2 < 90% + *calcular o CURB-65*',
          nota:'*C*onfusão · *U*reia > 50 · *R*espiração ≥ 30 · *B*P < 90/≤60 · idade ≥ *65*' },
        { tipo:'decisao', texto:'CURB-65?', ramos:[
          { rotulo:'0 – 1', cor:'ok', texto:'*Ambulatorial*',
            nota:'Amoxicilina-clavulanato, ou associado a macrolídeo se há comorbidade' },
          { rotulo:'2', texto:'*Enfermaria* ou observação prolongada',
            nota:'Conforme suporte social e comorbidade' },
          { rotulo:'≥ 3', cor:'perigo', texto:'*Internar* + avaliar UTI' }
        ]},
        { tipo:'alerta', rotulo:'Acima do escore', texto:'*Hipoxemia, hipotensão ou lactato alto internam sozinhos*',
          nota:'E acionam o protocolo de sepse — não só o de pneumonia' },
        { tipo:'passo', rotulo:'Nos que internam', texto:'*Culturas antes do antibiótico* — sem atrasar a primeira dose',
          nota:'Antibiótico precoce, ainda no pronto-socorro' },
        { tipo:'fim', rotulo:'Alta', texto:'Antibiótico + sinais de alarme por escrito + *retorno em 48–72 h*',
          nota:'Confirme que a pessoa tem como comprar o antibiótico — prescrição que não vira tratamento é retorno garantido' }
      ]},
      { tipo:'ordem', titulo:'CURB-65 — 1 ponto para cada', itens:[
        '*C*onfusão mental de início recente.',
        '*U*reia > 50 mg/dL.',
        '*R*espiração ≥ 30 irpm.',
        '*B*lood pressure: PAS < 90 ou PAD ≤ 60 mmHg.',
        'Idade *≥ 65* anos.'
      ]},
      { tipo:'texto', titulo:'Como usar o escore', conteudo:'*0–1 ponto:* tratamento ambulatorial. *2 pontos:* internação em enfermaria ou observação prolongada, conforme suporte social e comorbidade. *≥ 3 pontos:* internação, com avaliação de UTI. O escore orienta, mas *não substitui o olhar clínico*: hipoxemia, descompensação de comorbidade ou impossibilidade de tratamento em casa internam o paciente independentemente da pontuação.' },
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Hipoxemia — SpO2 < 90% em ar ambiente.',
        'Hipotensão ou sinais de sepse: entra no protocolo de sepse, não só no de pneumonia.',
        'Confusão mental nova, sobretudo no idoso.',
        'Derrame pleural volumoso ou com suspeita de empiema.',
        'Falha do tratamento ambulatorial após 48–72 h.'
      ]},
      { tipo:'lista', titulo:'Exames', itens:[
        'Radiografia de tórax em duas incidências.',
        'Hemograma, ureia, creatinina, eletrólitos e *lactato* se houver sinal de gravidade.',
        'Oximetria em todos; gasometria arterial se SpO2 baixa ou dispneia importante.',
        'Hemoculturas antes do antibiótico *nos que internam*.',
        'Ultrassom de tórax ou tomografia se houver derrame, para caracterizar e decidir punção.'
      ]},
      { tipo:'doses', titulo:'Medicações — tratamento ambulatorial', itens:[
        { droga:'Amoxicilina-clavulanato', dose:'875+125 mg de 12/12 h por 7 dias', via:'VO', obs:'Ou 500+125 mg de 8/8 h. Paciente *sem comorbidade e sem uso recente de antibiótico*.' },
        { droga:'Azitromicina', dose:'500 mg/dia por 5 dias', via:'VO', obs:'Monoterapia possível no jovem hígido; ou associada, no paciente com comorbidade.' },
        { droga:'Claritromicina', dose:'500 mg de 12/12 h por 7 dias', via:'VO', obs:'Alternativa ao macrolídeo.' },
        { droga:'Amoxicilina-clav + azitromicina', dose:'875+125 mg 12/12 h + 500 mg/dia', via:'VO', obs:'*Com comorbidade, doença mais grave ou uso recente de antibiótico* — cobre germe atípico.' },
        { droga:'Dipirona', dose:'1 g de 6/6 h se dor ou febre', via:'VO', obs:'Sintomático.' }
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        'Oximetria e oxigênio se SpO2 < 90%.',
        'Calcular o *CURB-65* e checar hipoxemia e comorbidade descompensada antes de decidir o destino.',
        'Colher culturas *antes* da primeira dose nos que vão internar — sem atrasar o antibiótico por isso.',
        'Antibiótico precoce, ainda no pronto-socorro.',
        'Hidratação e sintomáticos conforme necessidade.',
        'Se há hipotensão ou lactato elevado, acionar o *protocolo de sepse*.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Atrasar o antibiótico esperando radiografia ou resultado de exame no paciente grave.',
        'Tratar como pneumonia todo infiltrado: congestão, TEP e neoplasia entram no diferencial.',
        'Dar alta com hipoxemia, mesmo com CURB-65 baixo.',
        'Usar o escore isoladamente, ignorando comorbidade descompensada e condição social.',
        'Deixar de reavaliar em 48–72 h o paciente tratado em casa.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* com CURB-65 de 0–1, saturação normal, aceitação oral preservada e suporte em casa — com antibiótico prescrito, sintomáticos, orientação escrita de sinais de alarme e *retorno em 48–72 h* para reavaliação. *Interna* com CURB-65 ≥ 2, hipoxemia, instabilidade, comorbidade descompensada, intolerância a via oral, derrame significativo ou falha do tratamento ambulatorial. *UTI* na necessidade de ventilação ou vasopressor.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'No idoso a pneumonia se apresenta como *confusão e queda*, muitas vezes sem febre e sem tosse. Baixe o limiar de suspeita.',
        'Radiografia normal nas primeiras horas não exclui pneumonia — em paciente desidratado o infiltrado aparece depois.',
        'Derrame pleural volumoso ou septado precisa de punção: pneumonia que não melhora costuma ser empiema não drenado.',
        'Antes da alta, confirme que a pessoa tem como comprar o antibiótico. Prescrição que não vira tratamento é retorno garantido.'
      ]}
    ] },

  { id:'anafilaxia', titulo:'Anafilaxia e angioedema', categoria:'resp', gravidade:'emergencia',
    resumo:'Adrenalina intramuscular como primeira e única droga que salva; o resto é adjuvante.',
    tags:['anafilaxia','alergia','adrenalina','angioedema','urticaria','choque anafilatico','vasto lateral'],
    fonte:'ASBAI — Guia prático de anafilaxia · PS Zerado, p. 73 · prescris (anafilaxia)',
    ficha:[
      { rotulo:'Quando pensar', valor:'Início *agudo* (minutos a horas) com pele/mucosa acometida *mais* comprometimento respiratório ou queda de PA. Ou hipotensão após exposição a alérgeno conhecido.' },
      { rotulo:'Prioridade',    valor:'*Adrenalina IM agora.* Não há dose de espera, não há exame que confirme antes.' },
      { rotulo:'Meta',          valor:'Adrenalina na coxa em menos de 5 minutos do reconhecimento.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Reconhecimento', texto:'Início *agudo* + pele/mucosa + respiratório *ou* queda de PA',
          nota:'Ou hipotensão após exposição a alérgeno conhecido. *Não precisa de urticária para ser anafilaxia*' },
        { tipo:'alerta', rotulo:'Agora', texto:'*ADRENALINA IM NO VASTO LATERAL* — 0,5 mg se > 50 kg',
          nota:'Nada vem antes. Anti-histamínico e corticoide são adjuvantes e não salvam. Nunca subcutânea, nunca deltoide' },
        { tipo:'passo', rotulo:'Em seguida', texto:'Remover o agente · deitar com *pernas elevadas* · O2 · 2 acessos · volume',
          nota:'Não sentar nem deixar levantar de repente. Cristaloide 20 mL/kg se hipotenso' },
        { tipo:'decisao', texto:'Melhorou em 5–15 minutos?', ramos:[
          { rotulo:'Não', cor:'perigo', texto:'*Repetir adrenalina IM*; se refratária, adrenalina em bomba',
            nota:'Paciente em betabloqueador que não responde: *glucagon* 1–5 mg' },
          { rotulo:'Sim', cor:'ok', texto:'Adjuvantes: hidrocortisona, anti-histamínico, salbutamol' }
        ]},
        { tipo:'passo', rotulo:'Vigiar a via aérea', texto:'Estridor, rouquidão, disfagia, edema de língua e úvula',
          nota:'Intubar *cedo*, antes de piorar — depois a via aérea fecha e não há resgate' },
        { tipo:'decisao', texto:'Como foi o quadro?', ramos:[
          { rotulo:'Leve, 1 dose', texto:'*Observar 4–8 h* pela reação bifásica' },
          { rotulo:'Grave, > 1 dose, hipotensão', texto:'*Observar 12–24 h* ou internar' }
        ]},
        { tipo:'fim', rotulo:'Alta', texto:'*Adrenalina de resgate prescrita* + agente anotado + alergista',
          nota:'Muita reação grave é a segunda exposição de quem nunca soube da primeira' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Estridor, rouquidão, disfagia ou edema de língua e úvula — *via aérea fechando*; intubar cedo, antes de piorar.',
        'Hipotensão ou síncope.',
        'Broncoespasmo grave que não responde ao beta-2.',
        'Paciente em uso de *betabloqueador* — pode não responder à adrenalina; considerar glucagon.',
        'Sintoma que volta 4–12 h depois da melhora: *reação bifásica*, e é por isso que existe tempo mínimo de observação.'
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*Adrenalina IM no vasto lateral* (face anterolateral da coxa), imediatamente. Repetir a cada 5–15 min se não melhorar.',
        'Remover o agente causal quando possível — suspender a droga, retirar o ferrão.',
        'Deitar o paciente *com as pernas elevadas*; não sentar nem deixar levantar de repente.',
        'Oxigênio em alto fluxo e monitorização.',
        'Dois acessos calibrosos e *expansão volêmica* com cristaloide se houver hipotensão.',
        'Preparar via aérea difícil desde o início se há qualquer sinal de edema laríngeo.',
        'Adjuvantes (anti-histamínico, corticoide, beta-2) *só depois* da adrenalina — eles tratam sintoma, não salvam.',
        'Sem resposta a doses repetidas: adrenalina em bomba de infusão.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Adrenalina IM', dose:'*Adulto > 50 kg: 0,5 mg* (meia ampola)', via:'IM', obs:'Ampola 1 mg/mL. *Vasto lateral da coxa.* Repetir a cada 5–15 min se necessário. Não usar via subcutânea.' },
        { droga:'Adrenalina IM (peso menor)', dose:'25–50 kg: 0,3 mg · 10–25 kg: 0,15 mg · < 10 kg: 0,01 mL/kg', via:'IM', obs:'Mesma via e mesmo intervalo de repetição.' },
        { droga:'Adrenalina em infusão', dose:'0,05–0,1 mcg/kg/min, titular', via:'EV', obs:'*Só na refratariedade* às doses IM repetidas, com monitorização contínua.' },
        { droga:'Cristaloide', dose:'20 mL/kg em bolus, repetir conforme resposta', via:'EV', obs:'Na anafilaxia há vasodilatação e extravasamento — a necessidade de volume costuma ser grande.' },
        { droga:'Hidrocortisona', dose:'200–500 mg', via:'EV', obs:'*Adjuvante.* Não trata a fase aguda; visa reduzir a reação bifásica.' },
        { droga:'Prometazina / difenidramina', dose:'25–50 mg', via:'IM/EV', obs:'*Adjuvante* para prurido e urticária. Não substitui adrenalina em nenhuma hipótese.' },
        { droga:'Salbutamol', dose:'Inalatório, conforme resposta', via:'INAL', obs:'Para o broncoespasmo que persiste após a adrenalina.' },
        { droga:'Glucagon', dose:'1–5 mg em 5 min, seguido de infusão', via:'EV', obs:'Paciente em *betabloqueador* que não responde à adrenalina.' }
      ]},
      { tipo:'tempo', titulo:'Linha do tempo', itens:[
        { quando:'0–5 min',   o_que:'Reconhecimento e *adrenalina IM na coxa*. Nada vem antes disso.' },
        { quando:'5–15 min',  o_que:'Reavaliar; repetir adrenalina se não houve melhora. Volume e oxigênio correndo.' },
        { quando:'15–30 min', o_que:'Adjuvantes, reavaliação da via aérea, decisão sobre infusão contínua.' },
        { quando:'4–8 h',     o_que:'Observação mínima para reação bifásica em quadro leve e revertido.' },
        { quando:'12–24 h',   o_que:'Observação prolongada se houve hipotensão, broncoespasmo grave ou necessidade de mais de uma dose.', fim:true }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Atrasar a adrenalina* para tentar anti-histamínico e corticoide primeiro — é o erro que mata nesta conduta.',
        'Adrenalina subcutânea ou no deltoide: a absorção é lenta e errática. É *vasto lateral, IM*.',
        'Sentar ou levantar bruscamente o paciente hipotenso.',
        'Dar alta logo após a melhora, sem o período de observação.',
        'Mandar embora sem prescrever autoinjetor/adrenalina de resgate e sem encaminhamento ao alergista.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Observação mínima de 4–8 h* em quadro leve revertido com uma dose. *Observação de 12–24 h ou internação* se houve hipotensão, broncoespasmo grave, edema de via aérea, necessidade de mais de uma dose de adrenalina, história prévia de reação bifásica ou asma mal controlada. Na alta: prescrever *adrenalina autoinjetável ou ampola com orientação de uso*, corticoide e anti-histamínico por alguns dias, identificar por escrito o agente suspeito e encaminhar ao alergista.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Anafilaxia *não precisa de urticária*. Hipotensão ou broncoespasmo súbito após exposição já fecha o quadro — esperar a placa na pele custa tempo.',
        'A dose de adrenalina IM não tem contraindicação absoluta na anafilaxia, nem em cardiopata nem em idoso. O risco de não fazer é maior.',
        'Sintoma digestivo intenso (cólica, vômito, diarreia) logo após exposição é manifestação de anafilaxia e conta como acometimento de órgão.',
        'Anote no prontuário e diga ao paciente *qual* foi o agente suspeito. Muita reação grave é a segunda exposição de alguém que nunca soube da primeira.'
      ]}
    ] },

  { id:'pneumotorax', titulo:'Pneumotórax espontâneo e hipertensivo', categoria:'resp', gravidade:'emergencia',
    resumo:'Diagnóstico clínico do hipertensivo (não espere o raio-X) e critérios de drenagem.',
    tags:['pneumotorax','hipertensivo','descompressao','drenagem de torax','agulha'],
    fonte:'SBPT — Recomendações sobre doenças pleurais',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Hipertensivo* é diagnóstico clínico e tratamento imediato: hipotensão, turgência jugular, desvio de traqueia, MV abolido com hipertimpanismo.',
        'Não espere radiografia para descomprimir o hipertensivo.',
        'Pneumotórax em ventilação mecânica evolui para hipertensivo rapidamente.',
        'Enfisema subcutâneo extenso após trauma sugere lesão de via aérea.',
        'Radiografia em decúbito perde pneumotórax: o ultrassom é mais sensível.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor torácica súbita com dispneia; ou achado em trauma' },
        { tipo:'decisao', texto:'Há instabilidade com sinais clássicos?', ramos:[
          { rotulo:'Sim — hipertensivo', cor:'perigo', texto:'*DESCOMPRIMIR AGORA com agulha, depois drenar*',
            nota:'5º espaço intercostal na linha axilar média, ou 2º espaço na linha hemiclavicular' },
          { rotulo:'Não', texto:'Radiografia de tórax ou ultrassom' }
        ]},
        { tipo:'decisao', texto:'Qual o tipo e o tamanho?', ramos:[
          { rotulo:'Espontâneo primário pequeno (menos de 2 a 3 cm), assintomático', cor:'ok',
            texto:'*Observação + oxigênio*', nota:'Oxigênio acelera a reabsorção. Radiografia de controle em 4 a 6 h' },
          { rotulo:'Espontâneo grande ou sintomático', texto:'*Aspiração ou dreno* de pequeno calibre' },
          { rotulo:'Secundário (DPOC, pneumopatia)', texto:'*Drenar* — o pulmão doente não tolera',
            nota:'Sempre internar' },
          { rotulo:'Traumático ou hemopneumotórax', cor:'perigo', texto:'*Dreno de tórax calibroso*' }
        ]},
        { tipo:'passo', rotulo:'Após drenar', texto:'Radiografia de controle, selo d\'água, e vigiar borbulhamento e oscilação' },
        { tipo:'fim', rotulo:'Retirar', texto:'Sem borbulhamento, com pulmão expandido e débito baixo por 24 h' }
      ]},
      { tipo:'doses', titulo:'Procedimentos', itens:[
        { droga:'Descompressão por agulha', dose:'Cateter 14G, 5 cm ou mais', via:'—', obs:'5º espaço intercostal na linha axilar média é hoje o local preferido no adulto.' },
        { droga:'Dreno de tórax', dose:'Traumático 28 a 32 Fr; espontâneo 14 a 20 Fr', via:'—', obs:'5º espaço, linha axilar média, borda superior da costela inferior, dissecção romba.' },
        { droga:'Aspiração simples', dose:'Cateter 16 a 18G, seringa e torneira', via:'—', obs:'Opção no espontâneo primário: evita o dreno em boa parte dos casos.' },
        { droga:'Oxigênio', dose:'Alto fluxo', via:'—', obs:'Acelera a reabsorção do ar em até 4 vezes na conduta expectante.' },
        { droga:'Lidocaína 1 a 2%', dose:'10 a 20 mL', via:'INFILTRAÇÃO', obs:'Anestesia da pele, do subcutâneo, do periósteo e da pleura antes da drenagem.' },
        { droga:'Analgesia', dose:'Dipirona 2 g + morfina titulada', via:'EV', obs:'A drenagem dói; a dor mal controlada gera atelectasia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar radiografia no pneumotórax hipertensivo.',
        'Clampear o dreno para transportar o paciente.',
        'Ventilação com pressão positiva em pneumotórax não drenado.',
        'Drenar acima do 4º espaço na linha axilar, ou abaixo do 5º — risco de lesão de fígado e baço.',
        'Retirar o dreno com borbulhamento ativo.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* possível no pneumotórax espontâneo primário pequeno e assintomático, com radiografia de controle estável em 4 a 6 horas, retorno garantido e orientação para não viajar de avião nem mergulhar. Todo o resto interna. Orientar cessação do tabagismo — é o principal fator de recorrência. Recorrência ou vazamento persistente indica pleurodese ou cirurgia.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Ausência de deslizamento pleural ao ultrassom afasta pneumotórax naquele ponto — mais sensível que a radiografia em decúbito.',
        'Homem jovem, alto, magro e fumante é o perfil clássico do espontâneo primário.',
        'Registre o débito e o borbulhamento do dreno a cada plantão.'
      ]}
    ] },

  { id:'derrame-pleural', titulo:'Derrame pleural na emergência', categoria:'resp', gravidade:'rotina',
    resumo:'Quando puncionar, critérios de Light e o que fazer com empiema.',
    tags:['derrame pleural','toracocentese','light','empiema','exsudato'],
    fonte:'SBPT — Recomendações sobre doenças pleurais',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Derrame volumoso com desvio de mediastino e dispneia importante: toracocentese de alívio.',
        'Derrame parapneumônico *complicado* ou empiema exige drenagem — antibiótico sozinho não resolve.',
        'pH abaixo de 7,2, glicose abaixo de 40 a 60, LDH acima de 1000, pus ou bactéria no Gram: drenar.',
        'Derrame com febre e toxemia: pense em empiema.',
        'Derrame hemorrágico após trauma: hemotórax, dreno calibroso.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dispneia com MV abolido e macicez à percussão' },
        { tipo:'passo', rotulo:'Confirmar', texto:'Radiografia de tórax; *ultrassom* para localizar e guiar a punção',
          nota:'O ultrassom reduz muito a taxa de complicação da toracocentese' },
        { tipo:'passo', rotulo:'Puncionar', texto:'*Toracocentese diagnóstica* em todo derrame novo de causa não esclarecida',
          nota:'Exceto insuficiência cardíaca típica e bilateral, que pode ser tratada e reavaliada' },
        { tipo:'decisao', texto:'Transudato ou exsudato? (critérios de Light)', ramos:[
          { rotulo:'Transudato', cor:'ok', texto:'*Tratar a causa*: insuficiência cardíaca, cirrose, síndrome nefrótica' },
          { rotulo:'Exsudato', texto:'*Investigar*: infecção, neoplasia, tuberculose, TEP, doença autoimune' }
        ]},
        { tipo:'decisao', texto:'Se parapneumônico, é complicado?', ramos:[
          { rotulo:'Não complicado', cor:'ok', texto:'*Antibiótico apenas*' },
          { rotulo:'Complicado ou empiema', cor:'perigo', texto:'*DRENAGEM em selo d\'água* + antibiótico',
            nota:'pH abaixo de 7,2, glicose baixa, LDH alta, pus ou bactéria ao Gram' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'Internar conforme a causa; empiema pode precisar de fibrinolítico intrapleural ou cirurgia' }
      ]},
      { tipo:'lista', titulo:'Critérios de Light — é exsudato se pelo menos um', itens:[
        'Proteína pleural dividida pela sérica maior que 0,5.',
        'LDH pleural dividida pela sérica maior que 0,6.',
        'LDH pleural maior que dois terços do limite superior do LDH sérico.',
        'Complementar com glicose, pH, celularidade, citologia oncótica, ADA, Gram e cultura.',
        'ADA elevada com predomínio linfocitário sugere tuberculose pleural — comum no Brasil.'
      ]},
      { tipo:'doses', titulo:'Procedimentos e medicações', itens:[
        { droga:'Toracocentese diagnóstica', dose:'20 a 50 mL', via:'—', obs:'Guiada por ultrassom, borda superior da costela inferior, na linha axilar posterior.' },
        { droga:'Toracocentese de alívio', dose:'Até 1000 a 1500 mL por vez', via:'—', obs:'Retirar mais arrisca edema de reexpansão. Parar se houver tosse ou dor torácica.' },
        { droga:'Dreno de tórax', dose:'14 a 28 Fr', via:'—', obs:'No empiema e no derrame complicado. Calibroso se o líquido for espesso.' },
        { droga:'Lidocaína 1 a 2%', dose:'10 mL', via:'INFILTRAÇÃO', obs:'Anestesiar até a pleura parietal, que é o que dói.' },
        { droga:'Ceftriaxona + clindamicina ou ampicilina-sulbactam', dose:'Conforme o esquema', via:'EV', obs:'Empiema comunitário; cobrir anaeróbios.' },
        { droga:'Fibrinolítico intrapleural', dose:'Alteplase + DNase', via:'INTRAPLEURAL', obs:'No empiema loculado, quando disponível, antes de indicar cirurgia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Retirar mais de 1500 mL de uma vez: risco de edema de reexpansão.',
        'Puncionar sem ultrassom quando ele está disponível.',
        'Tratar empiema só com antibiótico.',
        'Deixar de mandar o líquido para citologia, ADA e cultura no primeiro derrame.',
        'Puncionar abaixo do 8º espaço intercostal: risco de lesão de fígado e baço.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* todo derrame parapneumônico complicado, empiema, derrame volumoso sintomático, ou de causa indeterminada com necessidade de investigação. Transudato por insuficiência cardíaca pode ser tratado ambulatorialmente com diurético e reavaliação. Todo primeiro derrame exsudativo merece investigação completa — no Brasil, tuberculose pleural é diagnóstico frequente.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Marque o ponto de punção com o ultrassom e puncione ali mesmo, com o paciente na mesma posição.',
        'Anote o aspecto do líquido: claro, turvo, purulento, hemorrágico ou leitoso.',
        'ADA é barata e resolve muito diagnóstico de tuberculose pleural.'
      ]}
    ] },

  { id:'hemoptise', titulo:'Hemoptise e hemoptise maciça', categoria:'resp', gravidade:'emergencia',
    resumo:'Proteger a via aérea, decúbito lateral do lado que sangra e acionar broncoscopia/embolização.',
    tags:['hemoptise','sangramento','broncoscopia','embolizacao','tuberculose'],
    fonte:'SBPT — Recomendações sobre hemoptise',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*A morte é por asfixia, não por exsanguinação*: proteger a via aérea é a prioridade.',
        'Hemoptise maciça: mais de 100 a 200 mL em 24 horas, ou qualquer volume com repercussão respiratória.',
        'Posicionar o paciente com o *lado que sangra para baixo* — protege o pulmão sadio.',
        'Diferenciar de hematêmese e de sangramento de via aérea superior.',
        'Tuberculose, bronquiectasia e neoplasia são as causas mais comuns de hemoptise volumosa no Brasil.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Expectoração de sangue' },
        { tipo:'passo', rotulo:'Confirmar a origem', texto:'Sangue vivo com espuma e tosse é hemoptise; escuro com resto alimentar é hematêmese',
          nota:'Examinar nariz e orofaringe: sangramento alto engolido e expectorado engana' },
        { tipo:'decisao', texto:'É maciça ou há repercussão?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Via aérea, lado que sangra para baixo, e intubação seletiva se necessário*',
            nota:'Tubo em brônquio-fonte contralateral protege o pulmão bom. Acionar broncoscopia e hemodinâmica' },
          { rotulo:'Não', texto:'Investigar com calma: radiografia, tomografia e broncoscopia' }
        ]},
        { tipo:'passo', rotulo:'Sempre', texto:'Corrigir coagulopatia, suspender anticoagulante e antiagregante, reservar sangue',
          nota:'Hemograma, coagulograma, tipagem, função renal e gasometria' },
        { tipo:'passo', rotulo:'Investigar a causa', texto:'*Pesquisa de BAAR* e teste rápido molecular sempre; tomografia de tórax',
          nota:'No Brasil, tuberculose é causa obrigatória de se afastar' },
        { tipo:'decisao', texto:'Persiste o sangramento?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Embolização de artéria brônquica* — tratamento de escolha',
            nota:'Broncoscopia terapêutica como alternativa. Cirurgia em último caso' },
          { rotulo:'Não', texto:'Investigação e tratamento da causa' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'Hemoptise maciça vai para terapia intensiva; leve interna para investigação' }
      ]},
      { tipo:'doses', titulo:'Medidas', itens:[
        { droga:'Posição de decúbito lateral com o lado doente para baixo', dose:'—', via:'—', obs:'Medida gratuita que protege o pulmão sadio. Faça primeiro.' },
        { droga:'Oxigênio', dose:'Alto fluxo', via:'—', obs:'Preparar aspiração potente e material de via aérea difícil.' },
        { droga:'Ácido tranexâmico', dose:'1 g em 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h. Também pode ser feito por via inalatória, 500 mg a 1 g nebulizado.' },
        { droga:'Cristaloide e hemoderivados', dose:'Conforme a perda', via:'EV', obs:'Dois acessos calibrosos, tipagem e reserva.' },
        { droga:'Reversão de anticoagulação', dose:'Conforme o agente', via:'EV', obs:'Vitamina K, complexo protrombínico, protamina.' },
        { droga:'Antitussígeno', dose:'Codeína 30 mg', via:'VO', obs:'Uso criterioso: a tosse mantém a via aérea limpa, mas o esforço agrava o sangramento.' },
        { droga:'Embolização de artéria brônquica', dose:'—', via:'—', obs:'Tratamento de escolha na hemoptise maciça persistente.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Deitar o paciente com o lado sadio para baixo — inunda o pulmão bom.',
        'Sedar sem controle da via aérea.',
        'Fisioterapia respiratória durante o sangramento ativo.',
        'Deixar de pesquisar tuberculose.',
        'Broncoscopia sem via aérea protegida na hemoptise maciça.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* toda hemoptise moderada ou maciça, e a leve com causa não esclarecida, em anticoagulado, ou com suspeita de tuberculose ativa. Hemoptise mínima em paciente com bronquite conhecida, sem fator de risco e com radiografia normal, pode ser investigada ambulatorialmente com retorno rápido. Isolamento respiratório se houver suspeita de tuberculose.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A primeira coisa a fazer é gratuita: virar o paciente para o lado que sangra.',
        'Quantifique: peça para escarrar num recipiente graduado.',
        'Ácido tranexâmico nebulizado é subutilizado e tem boa evidência na hemoptise não maciça.'
      ]}
    ] },

  { id:'sindrome-gripal', titulo:'Síndrome gripal e SRAG', categoria:'resp', gravidade:'urgencia',
    resumo:'Critérios de SRAG, indicação de oseltamivir e sinais de alarme para internação.',
    tags:['influenza','gripe','srag','oseltamivir','covid','virose respiratoria'],
    fonte:'Ministério da Saúde — Protocolo de tratamento de influenza',
    secoes:[
      { tipo:'alerta', titulo:'Sinais de síndrome respiratória aguda grave', itens:[
        'Dispneia, desconforto respiratório ou pressão persistente no tórax.',
        'Saturação abaixo de 95% em ar ambiente.',
        'Cianose de lábios ou face.',
        'Piora nas condições clínicas de doença de base.',
        'Hipotensão, ou em criança: batimento de asa nasal, tiragem, desidratação, inapetência.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Febre, mesmo referida, com tosse ou dor de garganta e mais um: cefaleia, mialgia ou artralgia' },
        { tipo:'decisao', texto:'Há sinal de gravidade?', ramos:[
          { rotulo:'Não — síndrome gripal', cor:'ok', texto:'*Sintomático + isolamento domiciliar*',
            nota:'Oseltamivir se pertencer a grupo de risco' },
          { rotulo:'Sim — SRAG', cor:'perigo', texto:'*Internar + oseltamivir + suporte*',
            nota:'Notificação imediata. Coletar swab de nasofaringe' }
        ]},
        { tipo:'passo', rotulo:'Grupo de risco', texto:'*Oseltamivir em até 48 horas do início* — mas iniciar mesmo depois se houver gravidade',
          nota:'Gestante e puérpera até 2 semanas, menor de 5 anos, maior de 60, imunossuprimido, obeso, doença crônica, indígena' },
        { tipo:'passo', rotulo:'Sempre', texto:'Hidratação, antitérmico e orientação sobre etiqueta respiratória' },
        { tipo:'fim', rotulo:'Antes da alta', texto:'Sinais de alarme por escrito e verificação da situação vacinal' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Oseltamivir 75 mg', dose:'1 cápsula', via:'VO', obs:'De 12/12 h por 5 dias. Ajustar na insuficiência renal.' },
        { droga:'Oseltamivir pediátrico', dose:'Abaixo de 15 kg: 30 mg · 15 a 23 kg: 45 mg · 23 a 40 kg: 60 mg · acima de 40 kg: 75 mg', via:'VO', obs:'De 12/12 h por 5 dias.' },
        { droga:'Dipirona', dose:'1 g no adulto; 10 a 15 mg/kg na criança', via:'VO ou EV', obs:'De 6/6 h, se dor ou febre.' },
        { droga:'Paracetamol', dose:'500 a 750 mg', via:'VO', obs:'De 6/6 h. Máximo de 3 g/dia.' },
        { droga:'Solução nasal de cloreto de sódio 0,9%', dose:'5 a 10 mL por narina', via:'NASAL', obs:'De 6/6 h.' },
        { droga:'Oxigênio', dose:'Titular', via:'—', obs:'Se saturação abaixo de 94%. Alvo de 94 a 98%.' },
        { droga:'Cristaloide', dose:'Conforme a volemia', via:'EV', obs:'Se desidratação ou aceitação oral ruim.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Antibiótico para quadro viral sem sinal de infecção bacteriana.',
        'Deixar de tratar o grupo de risco por já terem passado 48 horas quando há gravidade.',
        'Ácido acetilsalicílico em criança e adolescente: síndrome de Reye.',
        'Corticoide sistêmico de rotina na influenza sem outra indicação.',
        'Esquecer a notificação da SRAG.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na síndrome gripal sem sinal de gravidade, com sintomático, oseltamivir se for grupo de risco, isolamento domiciliar e sinais de alarme explicados. *Internar* toda SRAG, com notificação imediata e coleta de swab de nasofaringe. Verificar e recomendar a vacinação anual contra influenza — é a medida mais eficaz e a mais esquecida no atendimento.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Meça a saturação em ar ambiente e registre: é o que separa síndrome gripal de SRAG.',
        'Gestante é grupo de risco e tem indicação de oseltamivir mesmo em quadro leve.',
        'Aproveite o atendimento para atualizar a vacinação.'
      ]}
    ] },

  /* ======================= 03 · NEUROLOGIA ======================= */
  { id:'avc-isquemico', titulo:'AVC isquêmico agudo', categoria:'neuro', gravidade:'emergencia',
    resumo:'Janela de trombólise, NIHSS, critérios de inclusão/exclusão e metas de tempo porta-agulha.',
    tags:['avc','avci','derrame','nihss','alteplase','trombolise','trombectomia'],
    fonte:'ABN/SBDCV — Diretrizes para o tratamento da fase aguda do AVC isquêmico',
    secoes:[
      { tipo:'alerta', titulo:'Red flags e armadilhas', itens:[
        '*Tempo é cérebro*: cada minuto sem reperfusão custa cerca de 1,9 milhão de neurônios.',
        'Hipoglicemia imita AVC — glicemia capilar antes de acionar o protocolo.',
        'Hipertensão é *permissiva*: só tratar acima de 220 x 120 mmHg, ou abaixo de 185 x 110 se for trombolisar.',
        'Não dar antiagregante antes da tomografia.',
        'Definir o *último momento em que foi visto bem*, não a hora em que acordou.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Déficit neurológico focal de início súbito',
          nota:'Acionar a linha de cuidado do AVC. Cronometrar' },
        { tipo:'passo', rotulo:'Imediato', texto:'*Glicemia capilar* + NIHSS + tomografia sem contraste',
          nota:'Meta porta-tomografia: 20 minutos. Porta-agulha: 60 minutos' },
        { tipo:'decisao', texto:'A tomografia mostra hemorragia?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*É AVC hemorrágico* — outra conduta' },
          { rotulo:'Não', texto:'Avaliar critérios de trombólise' }
        ]},
        { tipo:'decisao', texto:'Está dentro de 4,5 horas e sem contraindicação?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'*ALTEPLASE 0,9 mg/kg* (máximo de 90 mg)',
            nota:'10% em bolus, 90% em 60 minutos. PA abaixo de 185 x 110 antes de iniciar' },
          { rotulo:'Não', texto:'*AAS 200 a 300 mg* + medidas gerais',
            nota:'Se houve trombólise, o AAS só entra após 24 horas' }
        ]},
        { tipo:'decisao', texto:'Há oclusão de grande vaso?', ramos:[
          { rotulo:'Sim, até 6 h (ou 24 h com mismatch)', cor:'perigo',
            texto:'*Trombectomia mecânica* — acionar o centro de referência' },
          { rotulo:'Não', texto:'Manter suporte e unidade de AVC' }
        ]},
        { tipo:'fim', rotulo:'Sempre', texto:'Controlar glicemia, temperatura e sódio; cabeceira a 30°; jejum até o teste de deglutição' }
      ]},
      { tipo:'lista', titulo:'Contraindicações à trombólise', itens:[
        'Hemorragia intracraniana atual ou prévia.',
        'AVC ou trauma craniano grave nos últimos 3 meses.',
        'Cirurgia de grande porte nos últimos 14 dias; cirurgia intracraniana ou espinhal em 3 meses.',
        'Sangramento ativo, plaquetas abaixo de 100.000, INR acima de 1,7.',
        'Uso de heparina nas últimas 48 horas com TTPA alargado, ou de anticoagulante oral direto nas últimas 48 horas.',
        'PA que permanece acima de 185 x 110 apesar do tratamento.',
        'Glicemia abaixo de 50 mg/dL não corrigida.',
        'Endocardite infecciosa ou dissecção de aorta conhecida.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Alteplase (rTPA)', dose:'0,9 mg/kg, máximo de 90 mg', via:'EV', obs:'10% em bolus em 1 minuto; o restante em 60 minutos. Monitorização neurológica a cada 15 minutos.' },
        { droga:'Ácido acetilsalicílico', dose:'200 a 300 mg', via:'VO ou SNG', obs:'Nas primeiras 24 a 48 h, após afastar hemorragia. Se houve trombólise, só após 24 h.' },
        { droga:'Atorvastatina', dose:'40 a 80 mg', via:'VO', obs:'1x/dia, à noite.' },
        { droga:'Enoxaparina 40 mg', dose:'1 ampola', via:'SC', obs:'1x/dia — profilaxia de trombose no acamado. Iniciar após 24 h se houve trombólise.' },
        { droga:'Metoprolol ou nitroprussiato', dose:'Titular', via:'EV', obs:'Somente se PA acima de 220 x 120 (ou acima de 185 x 110 antes da trombólise).' },
        { droga:'Insulina regular', dose:'Conforme escala', via:'SC', obs:'Alvo de glicemia entre 140 e 180 mg/dL. Hiperglicemia piora o desfecho.' },
        { droga:'Dipirona', dose:'2 g', via:'EV', obs:'Manter a temperatura abaixo de 37,5 °C — febre amplia a área de infarto.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Baixar a pressão fora dos limites: amplia a área de penumbra.',
        'Antiagregante ou anticoagulante antes da tomografia.',
        'Soro glicosado: a hiperglicemia piora o desfecho.',
        'Alimentar antes do teste de deglutição — broncoaspiração é complicação frequente.',
        'Perder tempo com exames que não mudam a decisão dentro da janela.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo AVC interna, preferencialmente em *unidade de AVC*, que reduz mortalidade e sequela de forma independente. Investigar a etiologia: ECG e Holter para fibrilação atrial, ecocardiograma, Doppler de carótidas e perfil lipídico. Iniciar prevenção secundária e reabilitação precoce. AIT também interna ou é investigado com urgência: o risco de AVC nos primeiros dias é alto (aplicar ABCD2).' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A pergunta que define tudo: "que horas você viu essa pessoa bem pela última vez?".',
        'Registre o NIHSS na chegada e após qualquer mudança — é a linguagem comum da equipe.',
        'Acorde a equipe inteira ao mesmo tempo: tomografia, laboratório e neurologia em paralelo, não em série.'
      ]}
    ] },

  { id:'avc-hemorragico', titulo:'AVC hemorrágico e hemorragia subaracnóidea', categoria:'neuro', gravidade:'emergencia',
    resumo:'Controle pressórico, reversão de anticoagulante, nimodipino na HSA e quando chamar a neurocirurgia.',
    tags:['avch','hemorragia','hsa','cefaleia sentinela','nimodipino','hunt hess'],
    fonte:'ABN — Diretrizes de hemorragia intracerebral e subaracnóidea',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Aqui a pressão é inimiga: alvo de *PAS entre 130 e 140 mmHg*, ao contrário do isquêmico.',
        '*Reverter a anticoagulação imediatamente* — é tão urgente quanto a imagem.',
        'Tríade de Cushing (hipertensão, bradicardia e alteração respiratória): herniação iminente.',
        'Cefaleia súbita "a pior da vida" com rigidez de nuca: hemorragia subaracnóidea.',
        'Deterioração rápida do nível de consciência sugere expansão do hematoma ou hidrocefalia.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Déficit neurológico com cefaleia intensa, vômito ou rebaixamento' },
        { tipo:'passo', rotulo:'Imediato', texto:'*Tomografia de crânio sem contraste* + glicemia + coagulograma',
          nota:'Se a tomografia for normal e a suspeita de subaracnóidea persistir: punção lombar' },
        { tipo:'passo', rotulo:'Via aérea', texto:'Intubar se Glasgow ≤ 8 ou se não protege a via aérea',
          nota:'Sequência rápida com estabilidade hemodinâmica; evitar picos pressóricos' },
        { tipo:'passo', rotulo:'Pressão', texto:'*Reduzir de forma controlada para PAS de 130 a 140 mmHg*',
          nota:'Nitroprussiato, nicardipina ou metoprolol em bomba. Evitar queda abrupta' },
        { tipo:'passo', rotulo:'Coagulação', texto:'*Reverter anticoagulante ou antiagregante*',
          nota:'Varfarina: complexo protrombínico e vitamina K. Anticoagulante direto: antídoto específico se houver' },
        { tipo:'decisao', texto:'É subaracnóidea?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Nimodipina 60 mg de 4/4 h por 14 a 21 dias*',
            nota:'Previne vasoespasmo. Angiotomografia para achar o aneurisma' },
          { rotulo:'Não — hematoma intraparenquimatoso', texto:'Medidas antiedema e avaliação neurocirúrgica' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'Terapia intensiva; neurocirurgia acionada desde a admissão' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Nimodipina 60 mg', dose:'60 mg', via:'VO ou SNG', obs:'De 4/4 h por 14 a 21 dias. Somente na hemorragia subaracnóidea.' },
        { droga:'Nitroprussiato de sódio 50 mg/2 mL', dose:'2 mL + SG 5% 248 mL, titular', via:'EV', obs:'Bomba, protegido da luz. Alvo de PAS de 130 a 140 mmHg.' },
        { droga:'Metoprolol 1 mg/mL', dose:'5 mg', via:'EV', obs:'Bolus lento, repetindo até 15 mg. Alternativa sem vasodilatação cerebral.' },
        { droga:'Manitol 20%', dose:'0,25 a 1 g/kg', via:'EV', obs:'Se sinal de herniação. Em 20 minutos.' },
        { droga:'Salina hipertônica 3%', dose:'2 a 5 mL/kg', via:'EV', obs:'Alternativa ao manitol, preferível se houver hipotensão.' },
        { droga:'Complexo protrombínico + vitamina K', dose:'Conforme o INR', via:'EV', obs:'Reversão da varfarina. Vitamina K 10 mg EV lento junto.' },
        { droga:'Ácido tranexâmico', dose:'1 g em 10 min, depois 1 g em 8 h', via:'EV', obs:'Uso discutível; alguns protocolos usam na subaracnóidea até o clipe.' },
        { droga:'Dipirona ou paracetamol', dose:'2 g EV', via:'EV', obs:'Manter normotermia. Analgesia adequada reduz picos pressóricos.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Anticoagulante ou antiagregante — e reverter os que já estavam em uso.',
        'Corticoide: não tem benefício e aumenta complicações.',
        'Queda pressórica abrupta: reduzir de forma controlada.',
        'Punção lombar antes da tomografia quando há sinal de hipertensão intracraniana.',
        'Soro glicosado ou hipotônico.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo AVC hemorrágico interna em terapia intensiva ou unidade de AVC. Acionar neurocirurgia: hematoma cerebelar acima de 3 cm com compressão de tronco ou hidrocefalia tem indicação cirúrgica clara. Na subaracnóidea, o aneurisma deve ser tratado precocemente (clipagem ou embolização), idealmente nas primeiras 72 horas. Vigiar vasoespasmo entre o 4º e o 14º dia, ressangramento e hidrocefalia.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Escala de Hunt-Hess e Fisher na subaracnóidea: definem prognóstico e conduta.',
        'Anticoagulado com sangramento intracraniano é emergência dupla: imagem e reversão ao mesmo tempo.',
        'Registre o Glasgow seriado: a deterioração é o que indica reoperação ou drenagem.'
      ]}
    ] },

  { id:'status-epilepticus', titulo:'Crise convulsiva e estado de mal epiléptico', categoria:'neuro', gravidade:'emergencia',
    resumo:'Benzodiazepínico na dose certa, droga de segunda linha em minutos e sequência até a sedação.',
    tags:['convulsao','crise epileptica','estado de mal','diazepam','midazolam','fenitoina','levetiracetam'],
    fonte:'Liga Brasileira de Epilepsia — Protocolo de estado de mal epiléptico',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Estado de mal é crise com mais de *5 minutos*, ou crises repetidas sem recuperar a consciência entre elas.',
        'Glicemia capilar em TODA crise — hipoglicemia é causa reversível e frequente.',
        'Gestante acima de 20 semanas ou puérpera: pensar em *eclâmpsia*, e o tratamento é sulfato de magnésio.',
        'Em etilista, tiamina antes ou junto da glicose.',
        'Crise que não cede após duas drogas exige intubação e anestesia — não insistir com bolus.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'0 a 5 min', texto:'Proteger, decúbito lateral, oxigênio, acesso, *glicemia capilar* e cronometrar',
          nota:'Não conter à força nem colocar objeto na boca' },
        { tipo:'passo', rotulo:'5 a 10 min', texto:'*BENZODIAZEPÍNICO* — primeira linha',
          nota:'Diazepam 10 mg EV lento, ou midazolam 10 mg IM se não houver acesso' },
        { tipo:'decisao', texto:'Cedeu após 5 minutos?', ramos:[
          { rotulo:'Não', texto:'*Repetir o benzodiazepínico uma vez*' },
          { rotulo:'Sim', cor:'ok', texto:'Investigar a causa e observar' }
        ]},
        { tipo:'passo', rotulo:'10 a 20 min', texto:'*Antiepiléptico de segunda linha*',
          nota:'Fenitoína 20 mg/kg EV somente em SF 0,9%, no máximo 50 mg/min, com monitor cardíaco' },
        { tipo:'passo', rotulo:'20 a 40 min', texto:'*Fenobarbital* 20 mg/kg, ou ácido valproico, ou levetiracetam',
          nota:'Prepare-se para intubar: depressão respiratória é esperada' },
        { tipo:'alerta', rotulo:'Refratário', texto:'*INTUBAR e iniciar anestesia contínua*',
          nota:'Midazolam, propofol ou tiopental em bomba, em terapia intensiva, com EEG contínuo' },
        { tipo:'fim', rotulo:'Depois', texto:'Investigar a causa: tomografia, eletrólitos, tóxicos, infecção, adesão à medicação' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Diazepam 10 mg/2 mL', dose:'1 ampola (10 mg)', via:'EV', obs:'Bolus lento (2 mg/min). Repetir uma vez após 5 minutos.' },
        { droga:'Midazolam 10 mg', dose:'1 ampola', via:'IM', obs:'Quando não há acesso venoso — tão eficaz quanto o diazepam endovenoso.' },
        { droga:'Fenitoína 250 mg/5 mL', dose:'2 ampolas em 40 mL de SF 0,9% (10 mg/mL); fazer 5 a 10 mg/kg', via:'EV', obs:'SOMENTE em SF 0,9% — precipita em glicose. Máximo de 50 mg/min, com monitor. Dose total de ataque 20 mg/kg.' },
        { droga:'Fenobarbital 200 mg/2 mL', dose:'5 ampolas em 90 mL de SF 0,9% (10 mg/mL); fazer 10 a 20 mg/kg', via:'EV', obs:'Prepare a via aérea antes.' },
        { droga:'Glicose 50%', dose:'4 ampolas (40 mL)', via:'EV', obs:'Se hipoglicemia. Em etilista, tiamina antes ou junto.' },
        { droga:'Tiamina 100 mg/mL', dose:'1 ampola', via:'EV', obs:'Em etilista ou desnutrido, antes da glicose.' },
        { droga:'Sulfato de magnésio 50%', dose:'4 a 6 g de ataque', via:'EV', obs:'Na eclâmpsia — é o tratamento, não benzodiazepínico.' },
        { droga:'Midazolam 50 mg/10 mL', dose:'Infusão contínua', via:'EV', obs:'No estado de mal refratário, após intubação.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Diluir fenitoína em soro glicosado: precipita.',
        'Correr fenitoína rápido: hipotensão e arritmia.',
        'Conter o paciente à força ou colocar objeto na boca.',
        'Ficar repetindo benzodiazepínico além de duas doses em vez de subir de linha.',
        'Iniciar antiepiléptico de manutenção no pronto-socorro sem avaliação neurológica.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Crise única em epiléptico conhecido, com recuperação completa e causa identificada (esquecer a medicação, privação de sono), pode receber alta com orientação e retorno ao neurologista. *Internar* na primeira crise da vida, crise focal, estado de mal, déficit persistente, trauma, imunossupressão, anticoagulação, gestação ou causa não esclarecida. Tomografia de crânio em todos esses. Orientar sobre direção de veículos e atividades de risco.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Cronometre: a percepção de tempo durante uma crise é péssima e define a linha de tratamento.',
        'Depois da crise, o período pós-ictal confunde com rebaixamento persistente — reavalie em 30 minutos.',
        'Registre a descrição da crise por quem viu: é o dado que o neurologista mais quer.'
      ]}
    ] },

  { id:'rebaixamento-consciencia', titulo:'Rebaixamento do nível de consciência', categoria:'neuro', gravidade:'emergencia',
    resumo:'Glicemia, tiamina e naloxona antes da tomografia; roteiro de causas reversíveis.',
    tags:['coma','glasgow','rebaixamento','naloxona','tiamina','pupilas'],
    fonte:'ABN — Abordagem do paciente comatoso',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Glicemia capilar em *todos*, sem exceção — é a causa reversível mais rápida.',
        'Anisocoria com rebaixamento: herniação.',
        'Febre com rigidez de nuca: meningite — antibiótico imediato.',
        'Miose puntiforme com bradipneia: opioide, e há antídoto.',
        'Glasgow ≤ 8 ou incapacidade de proteger a via aérea: intubar.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Paciente com nível de consciência rebaixado' },
        { tipo:'passo', rotulo:'ABCDE', texto:'Via aérea, ventilação, circulação e *glicemia capilar*',
          nota:'Oxigênio, monitorização, dois acessos, ECG e temperatura' },
        { tipo:'passo', rotulo:'Coquetel do coma', texto:'*Glicose + tiamina + naloxona* conforme a suspeita',
          nota:'Tiamina antes da glicose no etilista. Naloxona se houver miose e bradipneia' },
        { tipo:'passo', rotulo:'Procurar a causa', texto:'Mnemônico *AEIOU TIPS*',
          nota:'Álcool · Epilepsia e eletrólitos · Insulina (glicemia) · Opiáceos · Uremia · Trauma e temperatura · Infecção · Psiquiátrico e envenenamento · AVC e choque' },
        { tipo:'decisao', texto:'Há sinal focal ou trauma?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Tomografia de crânio imediata*' },
          { rotulo:'Não', texto:'Investigar causa metabólica, tóxica e infecciosa',
            nota:'Eletrólitos, função renal e hepática, amônia, gasometria, TSH, hemograma, urina, tóxicos' }
        ]},
        { tipo:'passo', rotulo:'Se febre com meningismo', texto:'*Antibiótico e dexametasona antes da punção*, se ela for atrasar' },
        { tipo:'fim', rotulo:'Destino', texto:'Terapia intensiva se não houver causa reversível imediata ou se a via aérea estiver comprometida' }
      ]},
      { tipo:'doses', titulo:'Medicações de resgate', itens:[
        { droga:'Glicose 50%', dose:'40 a 60 mL', via:'EV', obs:'Se glicemia abaixo de 70. No lactente, glicose a 10%, 2 a 5 mL/kg.' },
        { droga:'Tiamina', dose:'100 a 300 mg', via:'EV', obs:'Antes ou junto da glicose no etilista ou desnutrido.' },
        { droga:'Naloxona', dose:'0,04 a 0,4 mg, titulada', via:'EV', obs:'Se miose com bradipneia. Alvo: ventilação adequada.' },
        { droga:'Cristaloide', dose:'Conforme a volemia', via:'EV', obs:'Corrigir hipotensão — hipoperfusão cerebral rebaixa.' },
        { droga:'Ceftriaxona 2 g + dexametasona', dose:'Ceftriaxona 2 g EV; dexametasona 10 mg EV', via:'EV', obs:'Se suspeita de meningite. Dexametasona 20 min antes do antibiótico.' },
        { droga:'Aciclovir', dose:'10 mg/kg', via:'EV', obs:'De 8/8 h, se suspeita de encefalite herpética.' },
        { droga:'Flumazenil', dose:'0,2 mg', via:'EV', obs:'Raramente indicado; nunca empírico em causa desconhecida.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Adiar a glicemia capilar.',
        'Flumazenil empírico: pode precipitar convulsão intratável.',
        'Atribuir ao álcool sem afastar trauma craniano e hipoglicemia.',
        'Punção lombar antes da tomografia quando há déficit focal, papiledema ou rebaixamento importante.',
        'Deixar de intubar quem não protege a via aérea por achar que "vai melhorar".'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta possível apenas quando a causa é identificada, reversível e resolvida na própria unidade — hipoglicemia corrigida, intoxicação por benzodiazepínico já recuperada, síncope com investigação negativa — e o paciente voltou plenamente ao basal, com acompanhante. Todo o resto interna. Rebaixamento sem causa esclarecida vai para leito monitorizado.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Registre o Glasgow discriminado (ocular, verbal, motor) e as pupilas — a evolução é o que importa.',
        'Cheire o hálito: cetônico, urêmico, etílico e de organofosforado dão pistas.',
        'Examine a pele inteira: petéquias, marca de injeção, adesivo de fentanila, sinais de trauma.'
      ]}
    ] },

  { id:'cefaleia', titulo:'Cefaleia na emergência', categoria:'neuro', gravidade:'urgencia',
    resumo:'Red flags (SNOOP), quem precisa de tomografia e punção, e analgesia da crise de enxaqueca.',
    tags:['cefaleia','enxaqueca','snoop','thunderclap','dor de cabeca'],
    fonte:'ABN/SBCe — Recomendações para tratamento da crise de migrânea',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — o mnemônico SNOOP', itens:[
        '*S*intomas sistêmicos: febre, perda de peso, câncer, imunossupressão.',
        '*N*eurológico: déficit focal, rebaixamento, papiledema, crise convulsiva.',
        '*O*nset súbito, em trovoada, atingindo o pico em segundos — hemorragia subaracnóidea.',
        '*O*lder: primeira cefaleia após os 50 anos; acima de 50 com claudicação de mandíbula pensa em arterite temporal.',
        '*P*adrão que mudou, piora com Valsalva, ou piora progressiva.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Cefaleia no pronto-socorro' },
        { tipo:'decisao', texto:'Há alguma red flag do SNOOP?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*INVESTIGAR* — tomografia de crânio',
            nota:'Se a tomografia for normal e a suspeita de hemorragia subaracnóidea persistir: punção lombar' },
          { rotulo:'Não', cor:'ok', texto:'Cefaleia primária — tratar a crise' }
        ]},
        { tipo:'passo', rotulo:'Tratar', texto:'*Analgesia venosa + hidratação + antiemético*',
          nota:'Ambiente escuro e silencioso. Dipirona 2 g EV + metoclopramida 10 mg EV' },
        { tipo:'decisao', texto:'Qual o padrão?', ramos:[
          { rotulo:'Tensional', texto:'Analgésico simples ou anti-inflamatório' },
          { rotulo:'Enxaqueca', texto:'*Metoclopramida + dipirona*; dexametasona reduz recorrência',
            nota:'Triptano se disponível e sem contraindicação cardiovascular' },
          { rotulo:'Em salvas', texto:'*Oxigênio a 100% em máscara com reservatório* + triptano subcutâneo',
            nota:'Dor unilateral periorbitária, em facada, de 15 a 180 minutos, com lacrimejamento' }
        ]},
        { tipo:'fim', rotulo:'Alta', texto:'Dor controlada, sem red flag, com receita e orientação sobre abuso de analgésico' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Dipirona 500 mg/mL', dose:'2 ampolas (2 g) em 100 mL de SF 0,9%', via:'EV', obs:'Correr em 15 minutos.' },
        { droga:'Metoclopramida 5 mg/mL', dose:'1 ampola (10 mg) em 100 mL de SF 0,9%', via:'EV', obs:'Antiemético e analgésico na enxaqueca. Atenção à distonia aguda em jovens.' },
        { droga:'Cetoprofeno 100 mg', dose:'1 frasco em 100 mL de SF 0,9%', via:'EV', obs:'Correr em 20 minutos.' },
        { droga:'Dexametasona 4 mg/mL', dose:'1 ampola (10 mg)', via:'EV', obs:'Reduz a recorrência da enxaqueca em 72 horas.' },
        { droga:'Cloreto de sódio 0,9%', dose:'500 mL', via:'EV', obs:'Hidratação — parte do tratamento da crise.' },
        { droga:'Sumatriptano 25 a 50 mg', dose:'1 comprimido', via:'VO', obs:'Repetir só se a dor melhorou e recorreu. Contraindicado em coronariopatia e uso de ergotamina.' },
        { droga:'Oxigênio 100%', dose:'12 a 15 L/min', via:'Máscara com reservatório', obs:'Por 15 a 20 minutos. Tratamento da cefaleia em salvas.' },
        { droga:'Clorpromazina 5 mg/mL', dose:'0,1 mg/kg diluída', via:'EV', obs:'Alternativa na enxaqueca refratária. Hidratar antes; causa hipotensão.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Dar alta em cefaleia em trovoada sem tomografia — e, se normal, sem punção lombar.',
        'Opioide como primeira escolha: piora a cefaleia por abuso de analgésico e não trata enxaqueca.',
        'Triptano em coronariopata, hipertenso não controlado ou enxaqueca com aura basilar.',
        'Prescrever analgésico contínuo na alta sem alertar sobre a cefaleia de rebote.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta é a regra na cefaleia primária com dor controlada. *Internar ou investigar* se houver qualquer red flag, dor refratária, ou primeira crise atípica. Na alta, orientar que analgésico por mais de 10 a 15 dias no mês causa cefaleia crônica diária, e encaminhar à neurologia se houver 4 ou mais crises por mês para iniciar profilaxia (propranolol, amitriptilina, topiramato ou flunarizina).' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Pergunte "essa é a pior dor de cabeça da sua vida?" e "em quanto tempo chegou no pico?" — as duas mais úteis.',
        'Tomografia normal não exclui hemorragia subaracnóidea depois de 6 horas: punção lombar.',
        'Registre o exame neurológico completo, inclusive fundo de olho quando possível.'
      ]}
    ] },

  { id:'vertigem', titulo:'Vertigem aguda: central x periférica', categoria:'neuro', gravidade:'urgencia',
    resumo:'HINTS, Dix-Hallpike e Epley — e os achados que obrigam a investigar AVC de fossa posterior.',
    tags:['vertigem','tontura','hints','vppb','epley','labirintite','nistagmo'],
    fonte:'ABN / ABORL — Recomendações sobre vertigem aguda',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — o que aponta para causa central', itens:[
        'Déficit focal, diplopia, disartria, disfagia, ataxia desproporcional à vertigem.',
        'Nistagmo *vertical*, puramente torcional, ou que muda de direção com o olhar.',
        'Cefaleia ou cervicalgia intensa associada — dissecção vertebral.',
        'Incapacidade de ficar em pé sem apoio: sugere lesão central, não labirinto.',
        'Idade avançada com fator de risco vascular, ou início súbito sem gatilho.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Tontura rotatória, com náusea e desequilíbrio' },
        { tipo:'passo', rotulo:'Primeiro', texto:'Separar *vertigem* (rotatória) de pré-síncope, desequilíbrio e tontura inespecífica',
          nota:'Perguntar o tempo de duração e o gatilho, não "como é a tontura"' },
        { tipo:'decisao', texto:'Periférica ou central?', ramos:[
          { rotulo:'Periférica', cor:'ok', texto:'Nistagmo horizontal unidirecional, fatigável, sem déficit; audição pode estar alterada',
            nota:'HINTS: head impulse ANORMAL, nistagmo unidirecional, sem skew' },
          { rotulo:'Central', cor:'perigo', texto:'*AVC de fossa posterior até prova em contrário*',
            nota:'HINTS: head impulse NORMAL, nistagmo que muda de direção, skew presente. Ressonância, não tomografia' }
        ]},
        { tipo:'decisao', texto:'Se periférica, qual o padrão?', ramos:[
          { rotulo:'Segundos, ao mudar de posição', texto:'*VPPB* — Dix-Hallpike e manobra de Epley',
            nota:'A manobra resolve; medicação atrapalha a compensação' },
          { rotulo:'Dias, contínua, sem audição alterada', texto:'Neurite vestibular' },
          { rotulo:'Minutos a horas, com zumbido e perda auditiva', texto:'Doença de Ménière' }
        ]},
        { tipo:'fim', rotulo:'Alta', texto:'Deambulando com segurança, hidratado, com orientação e encaminhamento à otorrinolaringologia' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Dimenidrinato + piridoxina (Dramin B6)', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'De 6/6 h. Correr em 20 minutos.' },
        { droga:'Ondansetrona 4 mg/mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h, se náusea ou vômito importantes.' },
        { droga:'Cloreto de sódio 0,9%', dose:'500 mL', via:'EV', obs:'Correr em 1 hora.' },
        { droga:'Dimenidrinato 50 mg', dose:'1 comprimido', via:'VO', obs:'De 4/4 ou 6/6 h. Não passar de 400 mg/dia.' },
        { droga:'Meclizina 25 a 50 mg', dose:'1 comprimido', via:'VO', obs:'De 8/8 h. Uso curto: atrapalha a compensação central.' },
        { droga:'Cinarizina 25 mg', dose:'1 comprimido', via:'VO', obs:'De 8/8 h.' },
        { droga:'Betaistina 24 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 30 dias, sobretudo na doença de Ménière.' },
        { droga:'Diazepam 5 mg', dose:'1 comprimido', via:'VO', obs:'Só se houver ansiedade importante associada. Uso curto.' },
        { droga:'Manobra de Epley', dose:'—', via:'—', obs:'Após Dix-Hallpike positivo. Resolve a VPPB melhor que qualquer medicação.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Tomografia de crânio para afastar AVC de fossa posterior: perde a maioria. O exame é a ressonância.',
        'Supressor vestibular por semanas: impede a compensação central e cronifica a tontura.',
        'Chamar de "labirintite" sem examinar — o termo virou lixeira diagnóstica.',
        'Dar alta a quem não consegue deambular sem apoio.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta na vertigem periférica com sintoma controlado e marcha segura, com supressor vestibular por poucos dias, exercícios de reabilitação e encaminhamento à otorrinolaringologia. *Internar ou investigar com imagem* se houver qualquer critério central, vômito incoercível, desidratação ou impossibilidade de deambular. Orientar não dirigir enquanto houver tontura ou sob efeito da medicação.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A pergunta certa é *quanto tempo dura e o que desencadeia*, não "como é a tontura".',
        'HINTS bem feito é mais sensível que ressonância nas primeiras 48 horas — mas só vale na vertigem contínua e em curso.',
        'Faça Dix-Hallpike: um Epley resolve o caso e evita semanas de remédio.'
      ]}
    ] },

  { id:'delirium', titulo:'Delirium e confusão aguda', categoria:'neuro', gravidade:'urgencia',
    resumo:'CAM para diagnóstico, busca do gatilho e medidas não farmacológicas antes do antipsicótico.',
    tags:['delirium','confusao mental','cam','idoso','haloperidol'],
    fonte:'SBGG/AMIB — Recomendações sobre delirium',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Delirium é *sinal de doença aguda*, não diagnóstico final — sempre há uma causa a procurar.',
        'Aumenta mortalidade de forma independente: não é "só confusão do idoso".',
        'Início agudo com flutuação ao longo do dia e desatenção formam o núcleo do quadro.',
        'A forma *hipoativa* é a mais comum e a mais perdida: idoso quieto e sonolento também é delirium.',
        'Hipoglicemia, hipóxia, retenção urinária e fecaloma são causas reversíveis em minutos.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Confusão de início agudo, com flutuação e desatenção' },
        { tipo:'passo', rotulo:'Procurar a causa', texto:'Mnemônico *DELIRIUM*',
          nota:'Drogas · Eletrólitos · Lesão do SNC · Infecção · Respiratória e hipóxia · Isquemia · Urinária e retenção · Metabólica' },
        { tipo:'passo', rotulo:'Exames', texto:'Glicemia, hemograma, eletrólitos, função renal, urina I, radiografia de tórax, ECG e oximetria',
          nota:'Tomografia de crânio se houver trauma, déficit focal, anticoagulação ou nenhuma causa encontrada' },
        { tipo:'passo', rotulo:'Rever', texto:'*Suspender o que puder*: benzodiazepínico, anticolinérgico, opioide, corticoide',
          nota:'Medicação é a causa mais comum e mais reversível' },
        { tipo:'passo', rotulo:'Não farmacológico primeiro', texto:'Reorientar, iluminar de dia, escurecer à noite, óculos e aparelho auditivo, mobilizar, hidratar',
          nota:'Retirar sonda e acesso desnecessários; presença de familiar' },
        { tipo:'decisao', texto:'Agitação com risco para si ou para a equipe?', ramos:[
          { rotulo:'Não', cor:'ok', texto:'*Sem antipsicótico* — só medidas ambientais' },
          { rotulo:'Sim', texto:'*Haloperidol em dose baixa*', nota:'0,5 a 1 mg; ECG antes, evitar se QTc acima de 500 ms' }
        ]},
        { tipo:'fim', rotulo:'Depois', texto:'A resolução acompanha o tratamento da causa; pode levar dias a semanas no idoso' }
      ]},
      { tipo:'doses', titulo:'Medicações — só se houver agitação com risco', itens:[
        { droga:'Haloperidol 0,5 a 5 mg', dose:'0,5 a 1 mg no idoso', via:'VO', obs:'Repetir a cada 30 min até estabilizar. Dose baixa é a regra no idoso.' },
        { droga:'Haloperidol 5 mg/mL', dose:'0,5 ampola (2,5 mg)', via:'IM ou EV', obs:'A cada 30 min, no máximo 3 vezes. ECG antes; evitar se QTc acima de 500 ms.' },
        { droga:'Risperidona', dose:'0,5 a 6 mg/dia', via:'VO', obs:'Iniciar 0,5 mg à noite e ajustar. Máximo de 6 mg/dia.' },
        { droga:'Quetiapina', dose:'12,5 a 150 mg/dia', via:'VO', obs:'Iniciar 25 mg à noite. Escolha no parkinsoniano e no portador de demência por corpos de Lewy.' },
        { droga:'Olanzapina', dose:'2,5 a 7,5 mg/dia', via:'VO', obs:'Iniciar 5 mg à noite.' },
        { droga:'Biperideno 5 mg/mL', dose:'1 ampola', via:'EV', obs:'Se distonia aguda pelo antipsicótico.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Benzodiazepínico* — piora o delirium. A exceção é a abstinência alcoólica, onde é o tratamento.',
        'Antipsicótico de rotina: só na agitação com risco, na menor dose e pelo menor tempo.',
        'Contenção mecânica como primeira medida: piora a agitação e a duração do delirium.',
        'Atribuir à demência sem investigar — demência não começa em 24 horas.',
        'Esquecer de checar bexigoma e fecaloma.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Praticamente todo delirium interna, porque o que interna é a *causa*. Alta só quando a causa é trivial e reversível na própria unidade (desidratação leve, retenção urinária resolvida), com o paciente de volta ao basal cognitivo e com acompanhante. Registrar o estado mental basal informado pela família — é a referência para dizer se voltou ao normal.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Pergunte à família: "ele estava assim antes?" — separa delirium de demência em uma frase.',
        'Aplique o CAM: início agudo com flutuação, mais desatenção, mais pensamento desorganizado OU nível de consciência alterado.',
        'Prevenção vale mais que tratamento: mobilizar, hidratar, restaurar sono e devolver óculos e aparelho auditivo.'
      ]}
    ] },

  { id:'hipertensao-intracraniana', titulo:'Hipertensão intracraniana', categoria:'neuro', gravidade:'emergencia',
    resumo:'Sinais de herniação, cabeceira, osmoterapia e ventilação — o que fazer nos primeiros minutos.',
    tags:['hic','herniacao','manitol','salina hipertonica','cushing','anisocoria'],
    fonte:'SBN Cirúrgica / Brain Trauma Foundation',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Tríade de Cushing*: hipertensão, bradicardia e alteração do padrão respiratório — herniação em curso.',
        'Anisocoria com pupila fixa e dilatada: compressão do III par por herniação uncal.',
        'Postura de decorticação ou descerebração.',
        'Cefaleia que piora ao deitar, pela manhã e com Valsalva; vômito em jato.',
        'Papiledema indica cronicidade — sua ausência não afasta hipertensão aguda.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'Rebaixamento com sinal focal, anisocoria ou tríade de Cushing' },
        { tipo:'passo', rotulo:'Medidas gerais — imediatas', texto:'*Cabeceira a 30°, cabeça em posição neutra, colar cervical folgado*',
          nota:'Comprimir a jugular por colar apertado ou rotação da cabeça aumenta a pressão intracraniana' },
        { tipo:'passo', rotulo:'Via aérea', texto:'*Intubar com sedação e analgesia adequadas* — evitar tosse e picos pressóricos',
          nota:'Manter normocapnia: PaCO2 entre 35 e 40 mmHg' },
        { tipo:'passo', rotulo:'Osmoterapia', texto:'*Manitol 0,25 a 1 g/kg* ou *salina hipertônica*',
          nota:'Salina hipertônica é preferível se houver hipotensão ou hipovolemia' },
        { tipo:'passo', rotulo:'Otimizar', texto:'Normotermia, normoglicemia, normonatremia e sedação adequada',
          nota:'Febre, hiperglicemia e hiponatremia pioram o edema' },
        { tipo:'decisao', texto:'Herniação iminente?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Hiperventilação de resgate por poucos minutos* (PaCO2 de 30 a 35) + neurocirurgia',
            nota:'Medida temporária apenas: a hiperventilação prolongada causa isquemia' },
          { rotulo:'Não', texto:'Manter medidas e monitorizar' }
        ]},
        { tipo:'fim', rotulo:'Definitivo', texto:'Neurocirurgia: drenagem ventricular, evacuação do hematoma ou craniectomia descompressiva' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Manitol 20%', dose:'0,25 a 1 g/kg', via:'EV', obs:'Em 20 minutos. Repetir de 4/4 ou 6/6 h. Vigiar osmolaridade, sódio e volemia.' },
        { droga:'Salina hipertônica 3%', dose:'2 a 5 mL/kg', via:'EV', obs:'Alternativa; melhor se houver hipotensão. Alvo de sódio de 145 a 155 mEq/L.' },
        { droga:'Salina hipertônica 20%', dose:'30 a 60 mL', via:'EV', obs:'Em acesso central, no bolus de resgate.' },
        { droga:'Sedação: fentanila + midazolam ou propofol', dose:'Titular', via:'EV', obs:'Sedação profunda reduz o consumo cerebral de oxigênio e a pressão intracraniana.' },
        { droga:'Bloqueador neuromuscular', dose:'Conforme o protocolo', via:'EV', obs:'Se houver tosse ou assincronia com o ventilador, com sedação garantida.' },
        { droga:'Dexametasona', dose:'4 a 10 mg de 6/6 h', via:'EV', obs:'SOMENTE em edema vasogênico por tumor ou abscesso. NÃO no trauma nem no AVC.' },
        { droga:'Fenitoína', dose:'20 mg/kg', via:'EV', obs:'Profilaxia de crise no TCE grave. Crise convulsiva eleva muito a pressão intracraniana.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Hiperventilação profilática ou prolongada: causa isquemia cerebral.',
        'Corticoide no trauma craniano ou no AVC: aumenta mortalidade.',
        'Soro glicosado ou hipotônico.',
        'Colar cervical apertado ou cabeça rodada — obstrui o retorno venoso.',
        'Punção lombar com sinal de hipertensão intracraniana: risco de herniação.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Terapia intensiva sempre, com neurocirurgia acionada. Alvos: pressão intracraniana abaixo de 22 mmHg e pressão de perfusão cerebral entre 60 e 70 mmHg. Monitorização invasiva da pressão intracraniana quando indicada. A causa define o tratamento definitivo: hematoma evacua, hidrocefalia drena, tumor recebe corticoide e cirurgia, trombose venosa recebe anticoagulação.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'As medidas gratuitas vêm primeiro: cabeceira, posição neutra, colar folgado, analgesia e normotermia.',
        'Bradicardia com hipertensão em paciente neurológico é sinal tardio: aja antes.',
        'Registre pupilas e Glasgow a cada avaliação — a mudança é o que dispara a conduta.'
      ]}
    ] },

  { id:'compressao-medular', titulo:'Compressão medular aguda', categoria:'neuro', gravidade:'emergencia',
    resumo:'Déficit motor ascendente, nível sensitivo e retenção urinária: corticoide e ressonância de urgência.',
    tags:['compressao medular','mielopatia','sindrome da cauda equina','dexametasona','nivel sensitivo'],
    fonte:'ABN — Recomendações sobre emergências medulares',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — emergência de tempo', itens:[
        'Dor nas costas *progressiva*, que piora deitado e à noite, em paciente com câncer: compressão até prova em contrário.',
        'Déficit motor progressivo, nível sensitivo, hiper-reflexia abaixo da lesão.',
        '*Retenção urinária e anestesia em sela*: síndrome da cauda equina — cirurgia em horas.',
        'O prognóstico depende do estado neurológico no momento do tratamento: quem chega andando tende a continuar andando.',
        'A dor costuma preceder o déficit em semanas — é a janela para agir.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'Dor nas costas com déficit neurológico, ou dor progressiva em paciente oncológico' },
        { tipo:'passo', rotulo:'Imediato', texto:'*CORTICOIDE em dose alta* — não esperar a imagem',
          nota:'Dexametasona 10 mg EV em bolus, depois 4 mg de 6/6 h' },
        { tipo:'passo', rotulo:'Imagem', texto:'*Ressonância magnética de toda a coluna, com urgência*',
          nota:'Toda a coluna: lesões múltiplas em níveis diferentes são comuns na doença metastática' },
        { tipo:'passo', rotulo:'Exame', texto:'Documentar nível sensitivo, força por grupo muscular, reflexos e *toque retal*',
          nota:'Tônus esfincteriano e sensibilidade perianal definem a cauda equina' },
        { tipo:'decisao', texto:'Qual a causa e o estado neurológico?', ramos:[
          { rotulo:'Cauda equina por hérnia', cor:'perigo', texto:'*Descompressão cirúrgica em até 24 a 48 horas*' },
          { rotulo:'Metástase com instabilidade ou déficit rápido', cor:'perigo', texto:'*Cirurgia seguida de radioterapia*' },
          { rotulo:'Metástase radiossensível, sem instabilidade', texto:'*Radioterapia* de urgência' },
          { rotulo:'Abscesso epidural', cor:'perigo', texto:'*Antibiótico + drenagem cirúrgica*',
            nota:'Febre, dor e déficit; fator de risco: usuário de droga injetável, diabético, bacteremia' }
        ]},
        { tipo:'fim', rotulo:'Sempre', texto:'Sondagem vesical, profilaxia de trombose e cuidado com úlcera de pressão' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Dexametasona', dose:'10 mg em bolus, depois 4 mg de 6/6 h', via:'EV', obs:'Iniciar imediatamente, antes da imagem. Reduz edema e melhora o desfecho neurológico.' },
        { droga:'Dexametasona em dose alta', dose:'96 mg/dia', via:'EV', obs:'Esquema alternativo em déficit rápido e grave, com desmame progressivo.' },
        { droga:'Analgesia multimodal', dose:'Dipirona 2 g + morfina titulada', via:'EV', obs:'A dor costuma ser intensa. Considerar opioide em esquema fixo.' },
        { droga:'Omeprazol 40 mg', dose:'1 frasco', via:'EV', obs:'Proteção gástrica com o corticoide em dose alta.' },
        { droga:'Enoxaparina 40 mg', dose:'1 ampola', via:'SC', obs:'1x/dia — o risco de trombose é alto no paciente com déficit e câncer.' },
        { droga:'Antibiótico empírico', dose:'Vancomicina + ceftriaxona', via:'EV', obs:'Se houver suspeita de abscesso epidural, após hemoculturas.' },
        { droga:'Sondagem vesical', dose:'—', via:'—', obs:'Retenção urinária é regra; a bexiga distendida causa dor e lesão.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar a ressonância para começar o corticoide.',
        'Pedir só radiografia ou tomografia: a ressonância é o exame.',
        'Examinar sem fazer o toque retal — perde a cauda equina.',
        'Mandar o paciente oncológico com dor nas costas para casa com analgésico sem exame neurológico.',
        'Adiar a cirurgia na cauda equina: cada hora conta para a função esfincteriana.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Toda suspeita interna. A urgência é definida pelo estado neurológico: paciente que ainda deambula tem grande chance de continuar deambulando se tratado rápido; quem chega paraplégico raramente recupera. Acionar neurocirurgia ou ortopedia de coluna, oncologia e radioterapia em paralelo. Investigar o primário se ainda não conhecido.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Em paciente com câncer conhecido, dor nas costas nova é compressão medular até que se prove o contrário.',
        'Documente a força por grupo muscular e o horário: é o que mede a progressão.',
        'Pergunte sobre jato urinário, incontinência e dormência para sentar — a cauda equina passa despercebida se não se pergunta.'
      ]}
    ] },

  { id:'fraqueza-aguda', titulo:'Fraqueza muscular aguda (Guillain-Barré, miastenia)', categoria:'neuro', gravidade:'urgencia',
    resumo:'Vigiar a musculatura respiratória; capacidade vital, não saturação, define a intubação.',
    tags:['guillain barre','miastenia','crise miastenica','fraqueza','capacidade vital','imunoglobulina'],
    fonte:'ABN — Diretrizes de doenças neuromusculares',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Fraqueza *ascendente e simétrica* com arreflexia: Guillain-Barré — vigiar a respiração.',
        'Capacidade vital forçada abaixo de 20 mL/kg, ou queda progressiva: intubar antes da falência.',
        'Fraqueza que piora ao longo do dia, com ptose e diplopia: miastenia — crise miastênica.',
        'Nível sensitivo com déficit motor: lesão medular, não neuropatia.',
        'Fraqueza com dor lombar e retenção urinária: cauda equina.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Fraqueza muscular de instalação aguda ou subaguda' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Avaliar a função respiratória* — capacidade vital, pressões e padrão',
          nota:'A oximetria cai tarde. Fale com o paciente: contar de 1 a 20 numa expiração é um teste de cabeceira' },
        { tipo:'passo', rotulo:'Localizar a lesão', texto:'Padrão, reflexos, sensibilidade, nível e pares cranianos',
          nota:'Central: hiper-reflexia e Babinski. Periférica: hiporreflexia e atrofia' },
        { tipo:'decisao', texto:'Qual o padrão?', ramos:[
          { rotulo:'Ascendente, simétrica, arreflexia', texto:'*Guillain-Barré* — líquor com dissociação proteíno-citológica',
            nota:'Imunoglobulina ou plasmaférese. Vigiar disautonomia e respiração' },
          { rotulo:'Fatigável, ptose, diplopia', texto:'*Miastenia gravis* — teste do gelo, anticorpos, eletroneuromiografia' },
          { rotulo:'Nível sensitivo', cor:'perigo', texto:'*Lesão medular* — ressonância urgente' },
          { rotulo:'Fraqueza focal súbita', cor:'perigo', texto:'*AVC* — protocolo de AVC' },
          { rotulo:'Simétrica com alteração eletrolítica', texto:'*Hipocalemia, hipofosfatemia, hipermagnesemia* — corrigir' }
        ]},
        { tipo:'passo', rotulo:'Exames', texto:'Eletrólitos, CPK, função renal e tireoidiana, glicemia; líquor e imagem conforme a hipótese' },
        { tipo:'fim', rotulo:'Destino', texto:'Leito monitorizado com vigilância respiratória; terapia intensiva se a capacidade vital cair' }
      ]},
      { tipo:'doses', titulo:'Tratamentos', itens:[
        { droga:'Imunoglobulina humana', dose:'0,4 g/kg/dia por 5 dias', via:'EV', obs:'Guillain-Barré e crise miastênica. Equivalente à plasmaférese.' },
        { droga:'Plasmaférese', dose:'5 sessões em 2 semanas', via:'—', obs:'Alternativa à imunoglobulina.' },
        { droga:'Piridostigmina', dose:'60 mg', via:'VO', obs:'De 4/4 a 6/6 h na miastenia. Cuidado: em excesso causa crise colinérgica.' },
        { droga:'Cloreto de potássio', dose:'Conforme o déficit', via:'EV ou VO', obs:'Se hipocalemia. Diluído, nunca em bolus.' },
        { droga:'Enoxaparina 40 mg', dose:'1 ampola', via:'SC', obs:'1x/dia — profilaxia de trombose no acamado.' },
        { droga:'Suporte ventilatório', dose:'—', via:'—', obs:'Intubar de forma eletiva se a capacidade vital cair abaixo de 15 a 20 mL/kg. Não esperar a hipoxemia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Confiar na oximetria para avaliar a fraqueza respiratória: ela cai tarde demais.',
        'Corticoide no Guillain-Barré: não funciona.',
        'Iniciar corticoide em dose alta na miastenia sem suporte: pode piorar a crise nos primeiros dias.',
        'Esquecer de perguntar sobre medicações que precipitam crise miastênica: aminoglicosídeo, quinolona, macrolídeo, betabloqueador, magnésio.',
        'Atribuir fraqueza a "fraqueza geral" sem exame neurológico completo.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Interna toda fraqueza aguda progressiva, e sobretudo qualquer suspeita de acometimento respiratório. Guillain-Barré e crise miastênica exigem vigilância respiratória seriada com espirometria de cabeceira. Alta possível apenas quando a causa é benigna, identificada e resolvida — hipocalemia corrigida, por exemplo — e o paciente recuperou a força.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Meça a capacidade vital de 4/4 h e registre a tendência: é a decisão de intubar.',
        'Peça para o paciente contar de 1 a 20 numa única expiração — teste simples e sensível.',
        'Na miastenia, revise a lista de medicações: muitas crises são precipitadas por antibiótico.'
      ]}
    ] },

  /* ======================= 04 · GASTRO E ABDOME ======================= */
  { id:'abdome-agudo', titulo:'Abdome agudo: abordagem inicial', categoria:'gastro', gravidade:'emergencia',
    resumo:'Os cinco padrões (inflamatório, obstrutivo, perfurativo, vascular e hemorrágico) e o que muda em cada um.',
    tags:['abdome agudo','dor abdominal','peritonite','defesa','cirurgia'],
    fonte:'CBC — Colégio Brasileiro de Cirurgiões, protocolos de abdome agudo',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Instabilidade hemodinâmica com abdome doloroso: laparotomia, não tomografia.',
        '*Abdome em tábua* com descompressão difusa: peritonite — cirurgia.',
        'Dor desproporcional ao exame em idoso com fibrilação atrial: isquemia mesentérica.',
        'Beta-HCG em toda mulher em idade fértil: ectópica rota mata.',
        'Idoso, diabético e imunossuprimido têm exame pobre com doença grave.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor abdominal aguda' },
        { tipo:'passo', rotulo:'Sempre', texto:'Sinais vitais, acesso, *beta-HCG*, hemograma, função renal, amilase, lipase, urina e ECG',
          nota:'ECG: infarto de parede inferior se apresenta como dor epigástrica' },
        { tipo:'decisao', texto:'Há instabilidade ou peritonite?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Cirurgia de urgência* — reanimação em paralelo',
            nota:'Não atrasar com exames. Antibiótico e volume a caminho do centro cirúrgico' },
          { rotulo:'Não', texto:'Investigar por síndrome' }
        ]},
        { tipo:'decisao', texto:'Qual a síndrome predominante?', ramos:[
          { rotulo:'Inflamatória', texto:'Apendicite, colecistite, diverticulite, pancreatite' },
          { rotulo:'Obstrutiva', texto:'Bridas, hérnia, neoplasia, volvo, fecaloma' },
          { rotulo:'Perfurativa', cor:'perigo', texto:'Pneumoperitônio — úlcera perfurada, divertículo' },
          { rotulo:'Vascular', cor:'perigo', texto:'Isquemia mesentérica, aneurisma roto' },
          { rotulo:'Hemorrágica', cor:'perigo', texto:'Ectópica rota, cisto hemorrágico, trauma' }
        ]},
        { tipo:'passo', rotulo:'Imagem', texto:'Ultrassom no suspeito biliar e ginecológico; *tomografia* na maioria dos demais' },
        { tipo:'fim', rotulo:'Reavaliar', texto:'Exame seriado é diagnóstico: a dor que muda em 6 horas conta mais que qualquer exame' }
      ]},
      { tipo:'doses', titulo:'Medidas iniciais', itens:[
        { droga:'Dieta zero e acesso venoso', dose:'—', via:'—', obs:'Até definir a necessidade cirúrgica.' },
        { droga:'Cristaloide', dose:'500 a 1000 mL', via:'EV', obs:'Ringer lactato; mais volume se houver hipoperfusão.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'De 6/6 h. Analgesia NÃO mascara o abdome cirúrgico — dar é correto.' },
        { droga:'Morfina', dose:'2 a 4 mg', via:'EV', obs:'Titulada, se dor intensa.' },
        { droga:'Escopolamina + dipirona', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'Se o padrão for cólica.' },
        { droga:'Ondansetrona 8 mg', dose:'2 ampolas', via:'EV', obs:'De 8/8 h, se vômito.' },
        { droga:'Ceftriaxona + metronidazol', dose:'2 g + 500 mg', via:'EV', obs:'Se houver suspeita de perfuração, peritonite ou sepse de foco abdominal.' },
        { droga:'Sonda nasogástrica', dose:'—', via:'—', obs:'Se houver vômito incoercível ou suspeita de obstrução.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Negar analgesia por medo de mascarar: a evidência mostra que não mascara e melhora o exame.',
        'Levar paciente instável para a tomografia.',
        'Esquecer o beta-HCG e o ECG.',
        'Dar alta sem reavaliar depois da analgesia.',
        'Confiar em um exame abdominal normal isolado no idoso ou no imunossuprimido.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* possível na dor abdominal inespecífica, com exames normais, dor controlada, aceitando via oral, após reavaliação e com retorno em 12 a 24 horas garantido — e sempre com orientação escrita de sinais de alarme. *Internar ou observar* se a dor persistir, houver alteração laboratorial ou de imagem, vômitos, febre, ou se o paciente for idoso, imunossuprimido ou gestante.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A reavaliação em 4 a 6 horas é o exame mais barato e mais informativo do abdome agudo.',
        'Localização inicial e migração da dor: apendicite migra de periumbilical para FID.',
        'Registre o exame abdominal com detalhe — o cirurgião vai comparar com o dele.'
      ]}
    ] },

  { id:'hda', titulo:'Hemorragia digestiva alta', categoria:'gastro', gravidade:'emergencia',
    resumo:'Estabilização, IBP e terlipressina na suspeita varicosa, e a janela da endoscopia.',
    tags:['hda','hematemese','melena','varizes','terlipressina','omeprazol','glasgow blatchford'],
    fonte:'FBG/SOBED — Consenso de hemorragia digestiva alta',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Instabilidade hemodinâmica: taquicardia, hipotensão, palidez, confusão — estabilizar ANTES de pensar em endoscopia.',
        'Hematêmese volumosa com rebaixamento: proteger a via aérea antes de tudo.',
        'Cirrótico sangrando = varizes até prova em contrário; droga vasoativa e antibiótico entram antes da endoscopia.',
        'Ureia desproporcionalmente alta em relação à creatinina indica sangue no tubo digestivo.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Hematêmese, vômito em borra de café ou melena' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*ESTABILIZAR* — dois acessos calibrosos, cristaloide, tipagem e reserva',
          nota:'Transfusão restritiva: alvo de hemoglobina em torno de 7 g/dL. Transfundir demais aumenta a pressão portal' },
        { tipo:'decisao', texto:'O paciente é cirrótico ou tem hipertensão portal?', ramos:[
          { rotulo:'Sim — provável varicosa', cor:'perigo',
            texto:'*Terlipressina + ceftriaxona + omeprazol*',
            nota:'O antibiótico reduz mortalidade por conta própria. Endoscopia em 12 h' },
          { rotulo:'Não — provável não varicosa', texto:'*Omeprazol em dose alta*',
            nota:'Úlcera péptica é a causa mais comum. Endoscopia em 24 h' }
        ]},
        { tipo:'passo', rotulo:'Sempre', texto:'Suspender dieta, antiagregante e anticoagulante; corrigir coagulopatia' },
        { tipo:'passo', rotulo:'Definitivo', texto:'*ENDOSCOPIA DIGESTIVA ALTA* quando a estabilidade permitir',
          nota:'Ligadura elástica ou escleroterapia nas varizes; terapia dupla na úlcera' },
        { tipo:'fim', rotulo:'Destino', texto:'Internação. Terapia intensiva se houver instabilidade, sangramento ativo ou comorbidade grave' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Omeprazol 40 mg/10 mL', dose:'1 ampola (40 mg)', via:'EV', obs:'De 12/12 h. Suspender após a endoscopia se não houver indicação de manter.' },
        { droga:'Terlipressina 1 mg/mL', dose:'2 mg em bolus, depois 1 ampola de 4/4 h', via:'EV', obs:'Na hemorragia varicosa. Vigiar isquemia e hiponatremia.' },
        { droga:'Octreotide 0,5 mg/mL', dose:'50 mcg em bolus, depois 50 mcg/h', via:'EV', obs:'Alternativa: diluir 1 ampola em 250 mL de SF 0,9%, em bomba.' },
        { droga:'Ceftriaxona 1 g', dose:'1 g', via:'EV', obs:'De 24/24 h por 7 dias — profilaxia de PBE em todo cirrótico que sangra.' },
        { droga:'Ondansetrona 4 mg/mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h, correr em 20 minutos.' },
        { droga:'Lactulose 667 mg/mL', dose:'20 a 40 mL', via:'VO ou SNG', obs:'De 12/12 h, ajustando para 2 a 3 evacuações por dia — profilaxia de encefalopatia.' },
        { droga:'Cloreto de sódio 0,9% ou Ringer lactato', dose:'Conforme a perda', via:'EV', obs:'Dois acessos calibrosos.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Transfundir liberalmente no cirrótico: aumenta a pressão portal e o ressangramento.',
        'Levar para endoscopia sem estabilizar antes.',
        'Esquecer o antibiótico profilático no cirrótico — é o que mais muda mortalidade.',
        'Sonda nasogástrica de rotina: não melhora desfecho e atrasa a endoscopia.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo sangramento digestivo alto interna. Aplicar *Glasgow-Blatchford*: escore 0 a 1 identifica o grupo de baixíssimo risco que pode ser conduzido ambulatorialmente, o que é exceção. Terapia intensiva se houver instabilidade, sangramento ativo à endoscopia, ressangramento ou Rockall alto.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A ordem é: acesso, volume, sangue, droga, endoscopia — nessa sequência.',
        'Melena precisa de pouco sangue; hematoquezia com instabilidade pode ser hemorragia ALTA maciça.',
        'Anote a última dose de anticoagulante e o INR na passagem.'
      ]}
    ] },

  { id:'hdb', titulo:'Hemorragia digestiva baixa', categoria:'gastro', gravidade:'urgencia',
    resumo:'Descartar HDA antes; estratificação de risco e indicações de colonoscopia/angiotomografia.',
    tags:['hdb','enterorragia','hematoquezia','divertículo','colonoscopia'],
    fonte:'FBG/SOBED — Recomendações sobre hemorragia digestiva baixa',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Hematoquezia com instabilidade hemodinâmica pode ser hemorragia digestiva ALTA maciça — passar sonda ou fazer endoscopia alta antes da colonoscopia.',
        'Idade acima de 50 anos com sangramento novo: colonoscopia é obrigatória, mesmo depois de parar.',
        'Uso de anticoagulante ou antiagregante muda a conduta e o risco.',
        'Sangramento indolor e volumoso no idoso sugere divertículo ou angiodisplasia.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Enterorragia ou hematoquezia' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*ESTABILIZAR* — acesso, cristaloide, tipagem e reserva',
          nota:'Dieta suspensa. Hemograma, coagulograma, função renal e eletrólitos' },
        { tipo:'decisao', texto:'Há instabilidade hemodinâmica?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Afastar hemorragia alta primeiro*',
            nota:'Endoscopia alta ou sonda nasogástrica. Depois angiotomografia' },
          { rotulo:'Não', texto:'Investigar a origem baixa' }
        ]},
        { tipo:'passo', rotulo:'Investigar', texto:'Anuscopia, colonoscopia após preparo, ou angiotomografia se o sangramento for ativo',
          nota:'Boa parte para sozinha: 80% cessa espontaneamente' },
        { tipo:'fim', rotulo:'Destino', texto:'Internar se houver instabilidade, sangramento ativo, anemia importante ou comorbidade' }
      ]},
      { tipo:'doses', titulo:'Medicações e suporte', itens:[
        { droga:'Dieta zero', dose:'—', via:'—', obs:'Até definir a origem e a necessidade de colonoscopia.' },
        { droga:'Cloreto de sódio 0,9% ou Ringer lactato', dose:'Conforme a perda', via:'EV', obs:'Dois acessos calibrosos.' },
        { droga:'Omeprazol 40 mg/10 mL', dose:'1 ampola', via:'EV', obs:'De 12/12 h enquanto não se afasta origem alta.' },
        { droga:'Ondansetrona 4 mg/mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h, correr em 20 minutos.' },
        { droga:'Concentrado de hemácias', dose:'1 unidade por vez', via:'EV', obs:'Alvo restritivo de hemoglobina em torno de 7 g/dL; 8 g/dL no coronariopata.' },
        { droga:'Ácido tranexâmico', dose:'1 g', via:'EV', obs:'Uso discutível na hemorragia digestiva — não é rotina.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Atribuir hematoquezia a hemorroida sem examinar o ânus e sem colonoscopia no maior de 50 anos.',
        'Colonoscopia sem preparo em sangramento maciço: não se enxerga nada.',
        'Esquecer de afastar origem alta quando há instabilidade.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Interna se houver instabilidade, queda de hemoglobina, sangramento ativo, uso de anticoagulante ou comorbidade relevante. Sangramento pequeno, autolimitado, em paciente jovem e estável, com origem anorretal identificada, pode sair com colonoscopia agendada. *Sangramento novo acima dos 50 anos exige colonoscopia*, mesmo que tenha parado.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Faça o toque retal e a anuscopia: metade das respostas está ali.',
        'Registre a estimativa de volume e o número de evacuações com sangue.',
        'Anote se o paciente usa anticoagulante e quando foi a última dose.'
      ]}
    ] },

  { id:'pancreatite', titulo:'Pancreatite aguda', categoria:'gastro', gravidade:'urgencia',
    resumo:'Critérios diagnósticos, hidratação nas primeiras horas, analgesia e quando a tomografia ajuda.',
    tags:['pancreatite','amilase','lipase','ringer lactato','atlanta','bisap'],
    fonte:'FBG — Diretrizes de pancreatite aguda',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Hipotensão, taquicardia persistente e oligúria: pancreatite grave, terapia intensiva.',
        'Hipocalcemia, hipoxemia e queda do hematócrito após hidratação indicam gravidade.',
        'Icterícia com febre aponta para *colangite associada* — CPRE de urgência.',
        'Antibiótico NÃO é profilático: só entra na necrose infectada comprovada.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor epigástrica em faixa, irradiando para o dorso, com náusea e vômito',
          nota:'Diagnóstico: 2 de 3 — clínica típica, amilase ou lipase 3 vezes o normal, imagem compatível' },
        { tipo:'passo', rotulo:'O que salva', texto:'*HIDRATAÇÃO PRECOCE E VIGOROSA*',
          nota:'Ringer lactato é superior ao soro fisiológico. A hidratação das primeiras 24 h é o que muda desfecho' },
        { tipo:'passo', rotulo:'Junto', texto:'Analgesia generosa, antiemético e dieta zero nas primeiras 48 h',
          nota:'Opioide é permitido e necessário; a antiga proibição da morfina não se sustenta' },
        { tipo:'passo', rotulo:'Causa', texto:'Ultrassom de abdome para *litíase biliar*, e dosar triglicerídeos e cálcio',
          nota:'Biliar e alcoólica são 80% dos casos' },
        { tipo:'decisao', texto:'Qual a gravidade?', ramos:[
          { rotulo:'Leve', cor:'ok', texto:'Enfermaria; reintroduzir dieta em 24 a 48 h conforme a dor' },
          { rotulo:'Grave — falência orgânica', cor:'perigo', texto:'*Terapia intensiva*',
            nota:'Ranson, APACHE II ou BISAP. Tomografia com contraste só após 72 h' }
        ]},
        { tipo:'alerta', rotulo:'Não fazer', texto:'*Antibiótico profilático*',
          nota:'Não previne infecção e seleciona resistência' },
        { tipo:'fim', rotulo:'Depois', texto:'Colecistectomia na mesma internação se a causa for biliar e o quadro for leve' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Ringer lactato', dose:'20 a 30 mL/kg em 30 min se hipotensão; depois 3 mL/kg/h', via:'EV', obs:'Por 8 a 12 h, reavaliando volemia, diurese e ureia. É a medida principal.' },
        { droga:'Dipirona 1 g/2 mL', dose:'1 ampola', via:'EV', obs:'Em bolus lento, de 6/6 h.' },
        { droga:'Tramadol 100 mg/2 mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'Em 30 minutos, de 8/8 h.' },
        { droga:'Morfina 10 mg/mL', dose:'1 ampola diluída em 10 mL de AD; fazer 4 a 5 mL', via:'EV', obs:'De 6/6 h, se dor intensa.' },
        { droga:'Ondansetrona 4 mg/mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h, correr em 20 minutos.' },
        { droga:'Enoxaparina 40 mg', dose:'1 ampola', via:'SC', obs:'De 24/24 h — profilaxia de trombose.' },
        { droga:'Meropeném 1 g', dose:'1 g diluído em 10 mL de AD', via:'EV', obs:'De 8/8 h. SOMENTE em necrose infectada comprovada, nunca profilático.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Antibiótico profilático na pancreatite necrosante estéril.',
        'Hidratação tímida nas primeiras 24 horas — é o erro que mais custa.',
        'Tomografia com contraste nas primeiras 72 horas: subestima a necrose e agride o rim.',
        'Negar opioide por medo de espasmo do esfíncter de Oddi.',
        'Dar alta na pancreatite biliar sem programar a colecistectomia — recidiva em semanas.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo caso interna. *Terapia intensiva* se houver falência orgânica persistente por mais de 48 h, SIRS mantida, hematócrito em ascensão apesar da hidratação, ureia subindo, ou BISAP igual ou maior que 3. Reintroduzir dieta oral leve assim que a dor permitir — o jejum prolongado piora o desfecho.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Lipase é mais específica que amilase e permanece elevada por mais tempo.',
        'O valor da enzima NÃO indica gravidade — não use para prognóstico.',
        'Registre o balanço hídrico das primeiras 24 horas: é o dado mais importante da passagem.'
      ]}
    ] },

  { id:'colecistite-colangite', titulo:'Colecistite e colangite aguda', categoria:'gastro', gravidade:'emergencia',
    resumo:'Critérios de Tóquio, tríade de Charcot e a drenagem biliar que não pode esperar.',
    tags:['colecistite','colangite','charcot','tokyo','murphy','cpre','colecistectomia'],
    fonte:'CBC — Protocolos de doenças biliares agudas / Tokyo Guidelines',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Tríade de Charcot (febre, icterícia, dor) = colangite. Somando hipotensão e rebaixamento vira *pêntade de Reynolds*: colangite grave.',
        'Colangite não se resolve com antibiótico: o tratamento é *DRENAGEM BILIAR* por CPRE.',
        'Colecistite tem Murphy positivo e dor além de 6 horas, geralmente sem icterícia.',
        'Icterícia com dor e febre no idoso pode abrir como sepse sem foco aparente.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor em hipocôndrio direito com febre, com ou sem icterícia' },
        { tipo:'passo', rotulo:'Sempre', texto:'Jejum, hidratação, analgesia, hemograma, PCR, bilirrubinas, transaminases, amilase e lipase',
          nota:'Ultrassom de abdome; hemoculturas antes do antibiótico' },
        { tipo:'decisao', texto:'Há icterícia com febre?', ramos:[
          { rotulo:'Sim — colangite', cor:'perigo', texto:'*Antibiótico + CPRE de urgência*',
            nota:'Piperacilina-tazobactam ou cefepima + metronidazol. A drenagem é o que resolve' },
          { rotulo:'Não — colecistite', texto:'*Antibiótico + colecistectomia precoce*',
            nota:'Operar em até 72 horas tem melhor desfecho que esperar esfriar' }
        ]},
        { tipo:'decisao', texto:'Há sinal de sepse?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Pacote de sepse* + terapia intensiva + drenagem imediata',
            nota:'Lactato, hemoculturas, antibiótico na 1ª hora, 30 mL/kg de cristaloide' },
          { rotulo:'Não', texto:'Enfermaria, com reavaliação' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'Internação. Cirurgia geral e endoscopia acionadas desde a admissão' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Piperacilina + tazobactam 4 g/500 mg', dose:'4,5 g', via:'EV', obs:'De 8/8 h por 7 a 10 dias. Monoterapia na colangite.' },
        { droga:'Ciprofloxacino 400 mg/200 mL', dose:'1 bolsa', via:'EV', obs:'De 12/12 h por 7 a 10 dias. Alternativa em monoterapia.' },
        { droga:'Cefepima 1 g', dose:'2 ampolas (2 g)', via:'EV', obs:'De 8/8 h, associada a metronidazol.' },
        { droga:'Metronidazol 5 mg/mL', dose:'1 bolsa (500 mg)', via:'EV', obs:'De 8/8 h por 7 a 10 dias.' },
        { droga:'Ampicilina + sulbactam', dose:'2 frascos + 6,4 mL de AD em 100 mL de SF 0,9%', via:'EV', obs:'De 6/6 h. Boa opção na colecistite.' },
        { droga:'Dipirona 1 g/2 mL', dose:'1 ampola', via:'EV', obs:'Bolus lento, de 6/6 h.' },
        { droga:'Tramadol 100 mg/2 mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'Em 30 minutos, de 8/8 h.' },
        { droga:'Morfina 10 mg/mL', dose:'1 ampola diluída em 10 mL de AD; fazer 4 a 5 mL', via:'EV', obs:'De 6/6 h, se dor intensa.' },
        { droga:'Ondansetrona 4 mg/mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h.' },
        { droga:'Enoxaparina 40 mg', dose:'1 ampola', via:'SC', obs:'De 24/24 h — profilaxia de trombose.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Tratar colangite só com antibiótico, sem programar a drenagem.',
        'Adiar a colecistectomia na colecistite aguda por "esfriar o quadro" — piora o desfecho.',
        'Negar analgesia por medo de mascarar o abdome.',
        'Esquecer as hemoculturas antes da primeira dose.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todos internam. Colecistite: colecistectomia videolaparoscópica em até 72 horas; em paciente grave ou sem condição cirúrgica, *colecistostomia percutânea*. Colangite: CPRE de urgência, em até 24 horas no caso grave. Balanço hídrico, sinais vitais e vigilância dos critérios de choque séptico.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Sinal de Murphy ultrassonográfico vale mais que o clínico.',
        'Bilirrubina alta com dor e febre é colangite até prova em contrário — não espere o quadro clássico completo.',
        'Anote na passagem se a CPRE já foi solicitada e com quem.'
      ]}
    ] },

  { id:'apendicite', titulo:'Apendicite aguda', categoria:'gastro', gravidade:'urgencia',
    resumo:'Escore de Alvarado, papel do ultrassom e da tomografia, e a preparação para o centro cirúrgico.',
    tags:['apendicite','alvarado','blumberg','fossa iliaca direita','apendicectomia'],
    fonte:'CBC — Colégio Brasileiro de Cirurgiões',
    secoes:[
      { tipo:'alerta', titulo:'Red flags e armadilhas', itens:[
        'Apresentação atípica em criança, idoso, gestante e imunossuprimido — a perfuração é mais frequente nesses grupos.',
        'Na gestante, o apêndice sobe: a dor pode ser em flanco ou hipocôndrio direito.',
        'Melhora súbita da dor seguida de piora difusa: perfuração.',
        'Toda mulher em idade fértil precisa de beta-HCG e avaliação ginecológica no diferencial.',
        'Tomografia negativa com clínica forte não exclui: reavalie.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor periumbilical que migra para fossa ilíaca direita, com anorexia, náusea e febre baixa' },
        { tipo:'passo', rotulo:'Examinar', texto:'*Blumberg, Rovsing, psoas e obturador* + toque retal quando indicado',
          nota:'Blumberg: descompressão dolorosa. Rovsing: dor em FID à palpação da FIE. Dunphy: dor em FID à tosse' },
        { tipo:'passo', rotulo:'Estratificar', texto:'*Escore de Alvarado* e exames: hemograma, PCR, urina, beta-HCG' },
        { tipo:'decisao', texto:'Precisa de imagem?', ramos:[
          { rotulo:'Alvarado alto, homem jovem, quadro típico', cor:'ok', texto:'*Cirurgia direto* em muitos serviços' },
          { rotulo:'Dúvida, mulher, criança, idoso', texto:'*Tomografia* (ultrassom primeiro em criança e gestante)' }
        ]},
        { tipo:'decisao', texto:'Qual o tempo de evolução?', ramos:[
          { rotulo:'Menos de 48 h', texto:'*Apendicectomia + antibiótico*' },
          { rotulo:'Mais de 48 h com abscesso', texto:'*Drenagem + antibiótico*, colonoscopia em 4 a 6 semanas e apendicectomia tardia' },
          { rotulo:'Mais de 48 h com fleimão', texto:'*Antibiótico*, colonoscopia em 4 a 6 semanas e apendicectomia em 6 a 8 semanas' },
          { rotulo:'Peritonite difusa', cor:'perigo', texto:'*Reanimação + cirurgia de urgência*' }
        ]},
        { tipo:'fim', rotulo:'Sempre', texto:'Jejum, hidratação, analgesia e antibiótico antes do centro cirúrgico' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Cefoxitina', dose:'2 g de ataque, depois 1 g', via:'EV', obs:'De 6/6 h. Esquema clássico na apendicite não perfurada.' },
        { droga:'Ceftriaxona + metronidazol', dose:'2 g/dia + 500 mg de 8/8 h', via:'EV', obs:'Apêndice perfurado ou com peritonite.' },
        { droga:'Ampicilina + sulbactam', dose:'3 g', via:'EV', obs:'De 6/6 h. Alternativa.' },
        { droga:'Cristaloide', dose:'1000 mL', via:'EV', obs:'Ringer lactato; mais se houver desidratação ou sepse.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'De 6/6 h. Analgesia não atrapalha o diagnóstico.' },
        { droga:'Morfina', dose:'2 a 4 mg', via:'EV', obs:'Se dor intensa.' },
        { droga:'Ondansetrona 8 mg', dose:'2 ampolas', via:'EV', obs:'De 8/8 h, se náusea.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Negar analgesia enquanto espera o cirurgião.',
        'Excluir apendicite por leucograma normal: até 10% têm hemograma normal.',
        'Esquecer beta-HCG na mulher em idade fértil.',
        'Dar alta com dor persistente e sem reavaliação programada.',
        'Tomografia com contraste em criança quando o ultrassom resolve.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Interna para cirurgia. Tratamento exclusivamente antibiótico é uma opção em apendicite não complicada selecionada, mas com taxa de recorrência relevante e discussão com o paciente — não é a conduta padrão do plantão. Após abscesso drenado ou fleimão tratado, *colonoscopia em 4 a 6 semanas* é obrigatória acima de 40 anos, para afastar neoplasia.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Migração da dor é o dado clínico mais específico: pergunte onde começou.',
        'Reavaliação em 6 horas resolve boa parte das dúvidas sem exame novo.',
        'Registre Alvarado e o exame abdominal — é a linguagem do cirurgião.'
      ]}
    ] },

  { id:'obstrucao-intestinal', titulo:'Obstrução intestinal', categoria:'gastro', gravidade:'urgencia',
    resumo:'Alta x baixa, sonda nasogástrica, reposição e os sinais de sofrimento de alça.',
    tags:['obstrucao intestinal','brida','volvo','sng','niveis hidroaereos'],
    fonte:'CBC — Protocolos de abdome agudo obstrutivo',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — obstrução complicada', itens:[
        'Dor contínua que substitui a cólica, febre, taquicardia, leucocitose e acidose: *estrangulamento*.',
        'Hérnia encarcerada irredutível e dolorosa: cirurgia, não tente reduzir à força.',
        'Pneumoperitônio ou pneumatose intestinal: perfuração ou isquemia.',
        'Distensão maciça do ceco acima de 10 a 12 cm: risco de perfuração.',
        'Obstrução em alça fechada (volvo) evolui para isquemia rápido.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor em cólica, distensão, vômito e parada de eliminação de gases e fezes' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Examinar todos os orifícios herniários* + toque retal',
          nota:'Hérnia encarcerada é causa comum e facilmente perdida se não se procura' },
        { tipo:'passo', rotulo:'Estabilizar', texto:'*Dieta zero, sonda nasogástrica aberta, hidratação e correção de eletrólitos*',
          nota:'A perda para o terceiro espaço é grande; hipocalemia é regra' },
        { tipo:'passo', rotulo:'Imagem', texto:'Radiografia de abdome agudo; *tomografia* define nível, causa e sofrimento de alça' },
        { tipo:'decisao', texto:'Alta ou baixa? Complicada?', ramos:[
          { rotulo:'Delgado, por bridas, sem sofrimento', cor:'ok', texto:'*Tratamento conservador 24 a 48 h*',
            nota:'Sonda, hidratação e reavaliação. Boa parte resolve' },
          { rotulo:'Hérnia encarcerada', cor:'perigo', texto:'*Cirurgia*' },
          { rotulo:'Sinal de estrangulamento ou perfuração', cor:'perigo', texto:'*Cirurgia de urgência*' },
          { rotulo:'Cólon, por neoplasia', texto:'Cirurgia ou stent conforme o caso' }
        ]},
        { tipo:'fim', rotulo:'Reavaliar', texto:'Exame seriado, débito da sonda, eliminação de gases e nova imagem se não melhorar' }
      ]},
      { tipo:'doses', titulo:'Medidas', itens:[
        { droga:'Sonda nasogástrica aberta', dose:'Calibrosa', via:'—', obs:'Descomprime, alivia o vômito e permite medir o débito. Medida central do conservador.' },
        { droga:'Cristaloide (Ringer lactato)', dose:'1000 a 2000 mL', via:'EV', obs:'A perda para o terceiro espaço é grande. Guiar pela diurese.' },
        { droga:'Cloreto de potássio', dose:'Conforme o déficit', via:'EV', obs:'Diluído. A hipocalemia é regra e perpetua o íleo.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'De 6/6 h.' },
        { droga:'Ondansetrona 8 mg', dose:'2 ampolas', via:'EV', obs:'De 8/8 h.' },
        { droga:'Ceftriaxona + metronidazol', dose:'2 g + 500 mg', via:'EV', obs:'Se houver suspeita de sofrimento de alça, perfuração ou indicação cirúrgica.' },
        { droga:'Enoxaparina 40 mg', dose:'1 ampola', via:'SC', obs:'Profilaxia de trombose.' },
        { droga:'Contraste hidrossolúvel (gastrografina)', dose:'Conforme o protocolo', via:'VO ou SNG', obs:'Tem valor diagnóstico e terapêutico na obstrução por bridas.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Tentar reduzir hérnia encarcerada dolorosa à força: pode reduzir alça isquêmica para dentro.',
        'Manter conduta conservadora além de 48 horas sem melhora.',
        'Deixar de examinar as regiões inguinal, femoral e umbilical.',
        'Contraste baritado na suspeita de perfuração.',
        'Alimentar antes de retornar a eliminação de gases.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Toda obstrução interna. Cirurgia geral acionada desde a admissão. Conservador só em obstrução parcial de delgado por bridas, sem sinal de sofrimento, com reavaliação clínica e laboratorial seriada. Obstrução de cólon quase sempre é cirúrgica e exige investigar neoplasia. Registrar débito da sonda, balanço hídrico e eliminação de gases a cada plantão.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A pergunta que localiza: vomita cedo e pouco distendido é alta; distende muito e vomita tarde é baixa.',
        'Cicatriz abdominal na inspeção aponta para brida — a causa mais comum no delgado.',
        'Dor que deixa de ser em cólica e vira contínua é o sinal de alarme mais importante.'
      ]}
    ] },

  { id:'diverticulite', titulo:'Diverticulite aguda', categoria:'gastro', gravidade:'urgencia',
    resumo:'Classificação de Hinchey, antibiótico e critérios de tratamento ambulatorial.',
    tags:['diverticulite','hinchey','fossa iliaca esquerda','ciprofloxacino','metronidazol'],
    fonte:'FBG/CBC — Recomendações sobre doença diverticular',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Peritonite difusa, pneumoperitônio ou instabilidade: cirurgia de urgência (Hinchey III e IV).',
        'Abscesso maior que 4 cm: drenagem percutânea.',
        'Imunossuprimido, transplantado ou em corticoide: quadro grave com exame pobre.',
        'Sangramento volumoso associado é *doença diverticular sangrante*, entidade diferente.',
        'Colonoscopia é obrigatória após a resolução — para não perder um câncer que se apresentou assim.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor em fossa ilíaca esquerda com febre e alteração do hábito intestinal',
          nota:'A "apendicite do lado esquerdo". Mais comum acima dos 50 anos' },
        { tipo:'passo', rotulo:'Exames', texto:'Hemograma, PCR, urina, e *tomografia de abdome com contraste*',
          nota:'A tomografia estadia (Hinchey) e define a conduta' },
        { tipo:'decisao', texto:'Qual a classificação?', ramos:[
          { rotulo:'Não complicada — Hinchey 0/Ia', cor:'ok', texto:'*Antibiótico oral e dieta líquida, ambulatorial*',
            nota:'Ciprofloxacino + metronidazol por 7 a 10 dias. Reavaliar em 48 a 72 h' },
          { rotulo:'Sintomas exuberantes', texto:'*Internar*: dieta zero e antibiótico endovenoso' },
          { rotulo:'Abscesso maior que 4 cm — Hinchey Ib/II', texto:'*Drenagem percutânea* + antibiótico' },
          { rotulo:'Peritonite purulenta ou fecal — Hinchey III/IV', cor:'perigo',
            texto:'*Cirurgia de urgência*', nota:'Hartmann ou ressecção com anastomose conforme o caso' }
        ]},
        { tipo:'passo', rotulo:'Depois', texto:'*Colonoscopia em 4 a 6 semanas* após a resolução',
          nota:'Nunca na fase aguda: risco de perfuração' },
        { tipo:'fim', rotulo:'Seguimento', texto:'Cirurgia eletiva conforme recorrência, complicação ou imunossupressão' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Ciprofloxacino 500 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 7 a 10 dias, no caso não complicado.' },
        { droga:'Metronidazol 400 mg', dose:'1 comprimido', via:'VO', obs:'De 8/8 h por 7 a 10 dias, associado ao ciprofloxacino.' },
        { droga:'Amoxicilina + clavulanato 875/125 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h. Alternativa em monoterapia oral.' },
        { droga:'Ceftriaxona + metronidazol', dose:'1 a 2 g/dia + 500 mg de 8/8 h', via:'EV', obs:'Nos casos que internam.' },
        { droga:'Piperacilina + tazobactam', dose:'4,5 g', via:'EV', obs:'De 6/6 h, no caso grave ou complicado.' },
        { droga:'Dieta líquida ou zero', dose:'—', via:'—', obs:'Líquida por 2 a 3 dias no ambulatorial; zero no internado, com progressão conforme a melhora.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'Analgesia. Evitar anti-inflamatório e opioide constipante.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Colonoscopia ou enema na fase aguda: risco de perfuração.',
        'Anti-inflamatório: associado a complicação e perfuração na diverticulite.',
        'Opioide constipante em excesso.',
        'Deixar de programar a colonoscopia após a resolução.',
        'Tratar ambulatorialmente imunossuprimido, ou quem não tolera a via oral.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na diverticulite não complicada, em paciente imunocompetente, sem comorbidade grave, tolerando via oral, com dor controlada, antibiótico oral e reavaliação em 48 a 72 horas. *Internar* se houver sintomas exuberantes, complicação na tomografia, imunossupressão, intolerância à via oral, ou falha do tratamento ambulatorial. Colonoscopia em 4 a 6 semanas, sempre.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Diverticulite em paciente jovem tende a ser mais agressiva e recidivante.',
        'Estudos recentes questionam o antibiótico na diverticulite não complicada em paciente selecionado — mas ainda é a prática padrão.',
        'Anote a classificação de Hinchey no prontuário: é a linguagem do cirurgião.'
      ]}
    ] },

  { id:'isquemia-mesenterica', titulo:'Isquemia mesentérica aguda', categoria:'gastro', gravidade:'emergencia',
    resumo:'Dor desproporcional ao exame físico; angiotomografia precoce é o que muda o desfecho.',
    tags:['isquemia mesenterica','dor desproporcional','lactato','angiotc','fa'],
    fonte:'SBACV/CBC — Recomendações sobre isquemia mesentérica',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Dor desproporcional ao exame físico* — a marca da doença. O abdome é quase normal e a dor é insuportável.',
        'Idoso com fibrilação atrial, cardiopatia, aterosclerose ou hipotensão recente.',
        'Lactato normal *não exclui* na fase inicial: ele sobe quando já há necrose.',
        'Quando aparecem peritonite e acidose, a mortalidade já é altíssima.',
        'Mortalidade acima de 50 a 80% — o diagnóstico precoce é tudo.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'Dor abdominal intensa e desproporcional ao exame, em paciente de risco' },
        { tipo:'passo', rotulo:'Não perder tempo', texto:'*ANGIOTOMOGRAFIA de abdome com fases arterial e venosa*',
          nota:'É o exame. Não peça radiografia nem ultrassom para "começar"' },
        { tipo:'passo', rotulo:'Em paralelo', texto:'Ressuscitação volêmica, correção da acidose, antibiótico de amplo espectro e sonda',
          nota:'Evitar vasoconstritor sempre que possível — piora a isquemia' },
        { tipo:'decisao', texto:'Qual o mecanismo?', ramos:[
          { rotulo:'Embólica (fibrilação atrial)', cor:'perigo', texto:'*Embolectomia ou trombólise* + anticoagulação',
            nota:'A mais comum e a mais súbita' },
          { rotulo:'Trombótica (aterosclerose)', texto:'Revascularização; história de angina mesentérica prévia' },
          { rotulo:'Não oclusiva (baixo débito)', texto:'*Corrigir o débito e retirar o vasoconstritor*; papaverina intra-arterial' },
          { rotulo:'Trombose venosa mesentérica', texto:'*Anticoagulação plena*; costuma ter curso mais arrastado' }
        ]},
        { tipo:'decisao', texto:'Há peritonite ou sinal de necrose?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*LAPAROTOMIA* — ressecar o intestino inviável' },
          { rotulo:'Não', texto:'Revascularização endovascular ou aberta, com second look programado' }
        ]},
        { tipo:'fim', rotulo:'Depois', texto:'Terapia intensiva; anticoagulação plena e reoperação programada em 24 a 48 h' }
      ]},
      { tipo:'doses', titulo:'Medidas', itens:[
        { droga:'Cristaloide', dose:'Ressuscitação vigorosa', via:'EV', obs:'A perda para o terceiro espaço é enorme. Guiar por perfusão e diurese.' },
        { droga:'Heparina não fracionada', dose:'80 UI/kg em bolus, depois 18 UI/kg/h', via:'EV', obs:'Anticoagulação plena, salvo sangramento. Preferível pela reversibilidade rápida.' },
        { droga:'Ceftriaxona + metronidazol ou piperacilina-tazobactam', dose:'Conforme o esquema', via:'EV', obs:'Translocação bacteriana é regra — antibiótico de amplo espectro precoce.' },
        { droga:'Sonda nasogástrica', dose:'Aberta', via:'—', obs:'Descompressão.' },
        { droga:'Analgesia com opioide', dose:'Morfina titulada', via:'EV', obs:'A dor é intensa e exige opioide.' },
        { droga:'Bicarbonato de sódio', dose:'1 a 2 mEq/kg', via:'EV', obs:'Se acidose grave com pH abaixo de 7,1.' },
        { droga:'Evitar vasoconstritor', dose:'—', via:'—', obs:'Se for inevitável, preferir noradrenalina em dose mínima; nunca vasopressina em dose alta.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Excluir o diagnóstico porque o exame abdominal está "normal" — é justamente o padrão.',
        'Excluir por lactato normal na fase inicial.',
        'Perder tempo com radiografia simples ou ultrassom.',
        'Usar vasoconstritor em dose alta sem necessidade absoluta.',
        'Adiar a angiotomografia por função renal limítrofe quando a suspeita é forte.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Terapia intensiva sempre, com cirurgia vascular e cirurgia geral acionadas de imediato. A sobrevida depende do tempo até a revascularização. Second look em 24 a 48 horas é prática comum, porque a viabilidade da alça muda depois de restaurado o fluxo. Anticoagulação plena de manutenção e investigação da causa embólica.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A frase que fecha a suspeita: "a dor é muito pior do que o abdome parece".',
        'Idoso com fibrilação atrial e dor abdominal súbita: peça a angiotomografia antes de pensar duas vezes.',
        'História de dor pós-prandial com perda de peso é angina mesentérica — o aviso que veio antes.'
      ]}
    ] },

  { id:'cirrose-descompensada', titulo:'Cirrose descompensada: PBE, ascite e encefalopatia', categoria:'gastro', gravidade:'emergencia',
    resumo:'Paracentese diagnóstica em toda ascite que interna, albumina na PBE e lactulose na encefalopatia.',
    tags:['cirrose','pbe','ascite','encefalopatia hepatica','albumina','lactulona','paracentese'],
    fonte:'SBH — Sociedade Brasileira de Hepatologia, consensos de cirrose',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Toda descompensação tem um *gatilho*: infecção, sangramento, constipação, diurético em excesso, transgressão, hepatocarcinoma.',
        'Paracentese diagnóstica em TODO cirrótico com ascite que interna — mesmo sem febre e sem dor.',
        'Encefalopatia com febre: procurar PBE antes de atribuir à constipação.',
        'Creatinina subindo apesar da expansão levanta síndrome hepatorrenal.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Cirrótico com ascite, encefalopatia, icterícia ou sangramento' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Paracentese diagnóstica* + hemograma, função renal, eletrólitos, INR e culturas',
          nota:'PMN acima de 250/mm³ no líquido ascítico fecha PBE' },
        { tipo:'decisao', texto:'Qual a descompensação?', ramos:[
          { rotulo:'Encefalopatia', texto:'*Lactulose* + tratar o gatilho',
            nota:'Alvo de 2 a 3 evacuações pastosas por dia. Rifaximina se recorrente' },
          { rotulo:'PBE', cor:'perigo', texto:'*Ceftriaxona + albumina*',
            nota:'Albumina 1,5 g/kg no 1º dia e 1 g/kg no 3º: reduz síndrome hepatorrenal e mortalidade' },
          { rotulo:'Ascite tensa', texto:'*Paracentese de alívio* + albumina se retirar mais de 5 L',
            nota:'6 a 8 g de albumina por litro drenado' },
          { rotulo:'Hemorragia varicosa', cor:'perigo', texto:'Ver a conduta de HDA',
            nota:'Terlipressina + ceftriaxona + endoscopia' }
        ]},
        { tipo:'passo', rotulo:'Rever', texto:'Suspender betabloqueador e diurético se houver hipotensão ou lesão renal',
          nota:'Nada de anti-inflamatório: precipita lesão renal e ascite refratária' },
        { tipo:'fim', rotulo:'Destino', texto:'Internação; avaliar encaminhamento a centro de transplante conforme MELD' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Lactulose 667 mg/mL', dose:'20 a 40 mL', via:'VO ou SNG', obs:'De 12/12 h, ajustando para 2 a 3 evacuações por dia. Base do tratamento da encefalopatia.' },
        { droga:'Rifaximina 550 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 14 dias. Associada à lactulose na encefalopatia recorrente.' },
        { droga:'Metronidazol 400 mg', dose:'1 comprimido', via:'VO', obs:'De 8/8 h por 14 dias. Alternativa à rifaximina.' },
        { droga:'Ceftriaxona 1 g', dose:'1 g', via:'EV', obs:'De 12/12 h por 5 a 7 dias na PBE.' },
        { droga:'Albumina humana 20%', dose:'1,5 g/kg no 1º dia e 1 g/kg no 3º', via:'EV', obs:'Na PBE. Após paracentese de grande volume: 6 a 8 g por litro retirado.' },
        { droga:'Espironolactona', dose:'100 mg/dia', via:'VO', obs:'Com furosemida 40 mg/dia, mantendo a proporção 100:40 ao subir.' },
        { droga:'Aspartato de ornitina 5 g', dose:'1 envelope', via:'VO', obs:'De 12/12 ou 24/24 h, na encefalopatia refratária.' },
        { droga:'Norfloxacino 400 mg', dose:'1 comprimido', via:'VO', obs:'1x/dia — profilaxia secundária de PBE enquanto persistir a ascite.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Anti-inflamatório, em qualquer dose: precipita lesão renal e ascite refratária.',
        'Restringir proteína na encefalopatia — prática abandonada, piora a desnutrição.',
        'Diurético agressivo com perda maior que 0,5 kg/dia sem edema periférico.',
        'Deixar de puncionar a ascite por não haver febre.',
        'Esquecer a albumina junto do antibiótico na PBE.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Interna toda descompensação com encefalopatia acima do grau I, PBE, hemorragia, lesão renal ou infecção. Alta com restrição de sódio de 2 g/dia, diurético ajustado, lactolose titulada pelas evacuações, profilaxia de PBE quando indicada, e retorno precoce. Calcular *MELD* e encaminhar a centro de transplante.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Cabeceira elevada, curva térmica e sinais vitais de 6/6 h — o básico que detecta a próxima piora.',
        'Peso diário é o melhor marcador de resposta ao diurético.',
        'Sempre procure o gatilho: tratar a descompensação sem achar a causa garante o retorno.'
      ]}
    ] },

  { id:'diarreia-aguda', titulo:'Diarreia aguda e desidratação no adulto', categoria:'gastro', gravidade:'rotina',
    resumo:'Reidratação, quem precisa de antibiótico e os sinais que indicam etiologia invasiva.',
    tags:['diarreia','desidratacao','soro de reidratacao','disenteria','ciprofloxacino'],
    fonte:'Ministério da Saúde — Manejo das doenças diarreicas agudas',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Sangue ou muco nas fezes com febre: disenteria, e aí o antibiótico entra.',
        'Sinais de desidratação grave: sonolência, olhos encovados, prega cutânea lenta, anúria, hipotensão.',
        'Dor abdominal intensa e desproporcional, distensão ou peritonismo: pensar em abdome cirúrgico.',
        'Diarreia após antibiótico recente: *C. difficile* — e o antidiarreico de motilidade é contraindicado.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Três ou mais evacuações amolecidas em 24 horas, há menos de 14 dias' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Avaliar o grau de desidratação* e repor',
          nota:'Reidratação oral resolve a maioria. Via venosa se houver vômito incoercível ou desidratação grave' },
        { tipo:'decisao', texto:'Há sangue nas fezes ou comprometimento do estado geral?', ramos:[
          { rotulo:'Não', cor:'ok', texto:'*Sintomático apenas* — sem antibiótico',
            nota:'Reidratação, antiemético e racecadotrila. A maioria é viral' },
          { rotulo:'Sim — disenteria febril', texto:'*Ciprofloxacino 500 mg VO de 12/12 h por 3 dias*',
            nota:'Reavaliar em 48 h; se mantiver sangue ou melena, ceftriaxona e internação' },
          { rotulo:'Após antibiótico recente', cor:'perigo', texto:'*C. difficile* — vancomicina ORAL',
            nota:'125 mg VO de 6/6 h por 10 dias. Nada de antidiarreico de motilidade' }
        ]},
        { tipo:'passo', rotulo:'Persistente acima de 7 dias', texto:'Pesquisar protozoários: Giardia, Cryptosporidium, Isospora, Cyclospora',
          nota:'No paciente com HIV, também microsporídio e complexo M. avium' },
        { tipo:'fim', rotulo:'Alta', texto:'Hidratado, aceitando líquidos, sem sinal de alarme, com sais de reidratação e orientação' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Sais de reidratação oral', dose:'1 envelope em 1 L de água', via:'VO', obs:'1 copo após cada evacuação líquida. Base do tratamento.' },
        { droga:'Cloreto de sódio 0,9% ou Ringer lactato', dose:'1000 a 2000 mL', via:'EV', obs:'Se desidratação grave ou vômito incoercível.' },
        { droga:'Ondansetrona 4 mg/mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h. Permite retomar a via oral.' },
        { droga:'Racecadotrila 100 mg', dose:'1 cápsula', via:'VO', obs:'De 8/8 h, por até 5 dias. Antissecretor, seguro na diarreia infecciosa.' },
        { droga:'Escopolamina + dipirona', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'Se cólica importante.' },
        { droga:'Ciprofloxacino 500 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 3 dias, na disenteria febril.' },
        { droga:'Ceftriaxona 2 g', dose:'2 g', via:'IM ou EV', obs:'1x/dia por 2 a 5 dias, se mantiver sangue após 48 h ou houver toxemia.' },
        { droga:'Vancomicina 125 mg', dose:'1 cápsula', via:'VO', obs:'De 6/6 h por 10 dias, no C. difficile. A endovenosa NÃO trata.' },
        { droga:'Metronidazol 250 mg', dose:'1 comprimido', via:'VO', obs:'De 8/8 h por 5 a 7 dias, na giardíase.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Loperamida na disenteria febril ou na suspeita de C. difficile: risco de megacólon tóxico.',
        'Antibiótico na suspeita de *E. coli* produtora de toxina Shiga: aumenta a síndrome hemolítico-urêmica.',
        'Antibiótico de rotina na diarreia aquosa sem sangue — a maioria é viral.',
        'Jejum prolongado ou dieta restritiva rígida: atrasa a recuperação da mucosa.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta é a regra. *Internar* se houver desidratação grave que não corrige, vômito incoercível, instabilidade, sepse, comorbidade descompensada, imunossupressão, extremos de idade ou impossibilidade de reidratação domiciliar. Orientar retorno se sangue nas fezes, febre alta persistente, ausência de urina por mais de 8 h, tontura ao levantar ou sonolência.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Reidratação oral em pequenos volumes e com frequência funciona mesmo em quem está vomitando — dar a ondansetrona antes ajuda.',
        'Pergunte sobre antibiótico nas últimas 8 semanas: muda o diagnóstico inteiro.',
        'Coprocultura não é rotina; peça em disenteria, imunossuprimido, quadro grave ou surto.'
      ]}
    ] },

  /* ======================= 05 · INFECTOLOGIA ======================= */
  { id:'sepse', titulo:'Sepse e choque séptico', categoria:'infecto', gravidade:'emergencia',
    resumo:'Pacote da primeira hora: lactato, culturas, antibiótico, volume e vasopressor.',
    tags:['sepse','choque septico','lactato','pacote 1 hora','noradrenalina','qsofa','ilas','sofa','vasopressina'],
    fonte:'ILAS — Instituto Latino-Americano de Sepse · Manual de Cardiologia na Prática 3.0, p. 63–67',
    ficha:[
      { rotulo:'Quando pensar', valor:'*Sepse = infecção + disfunção orgânica* (SOFA ≥ 2). Não é preciso hipotensão para ser sepse.' },
      { rotulo:'Prioridade',    valor:'*Pacote da 1ª hora.* O tempo até o antibiótico é o que mais pesa no desfecho.' },
      { rotulo:'Meta',          valor:'*PAM ≥ 65 mmHg*, lactato em queda e foco infeccioso controlado.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*Foco infeccioso* suspeito ou confirmado' },
        { tipo:'decisao', texto:'SOFA clínico — dois dos três, sem esperar exame?', ramos:[
          { rotulo:'Menos de dois', texto:'Manter vigilância e reavaliar',
            nota:'Piora clínica reabre o protocolo' },
          { rotulo:'Dois ou mais', cor:'perigo', texto:'*SEPSE — abrir o pacote da 1ª hora*',
            nota:'SpO2 < 90% · Glasgow ≤ 14 · PAM < 70' }
        ]},
        { tipo:'paralelo', colunas:[
          { tipo:'passo', rotulo:'Colher', texto:'*Lactato arterial*', nota:'Repetir em 2–4 h para acompanhar' },
          { tipo:'passo', rotulo:'Antes do ATB', texto:'*Hemoculturas — 2 pares*', nota:'Sem atrasar a primeira dose por isso' },
          { tipo:'alerta', rotulo:'Na 1ª hora', texto:'*ANTIBIÓTICO*', nota:'É o que mais pesa no desfecho. Anote a hora exata' }
        ]},
        { tipo:'passo', rotulo:'Volume', texto:'*30 mL/kg de cristaloide* nas primeiras 3 h',
          nota:'Em alíquotas, reavaliando perfusão a cada etapa' },
        { tipo:'decisao', texto:'PAM ≥ 65 mmHg após o volume?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'Manter e colher o *lactato de controle*' },
          { rotulo:'Não', cor:'perigo', texto:'*CHOQUE SÉPTICO — noradrenalina* 0,1–1 mcg/kg/min',
            nota:'Pode correr em veia periférica calibrosa enquanto o central não sai' }
        ]},
        { tipo:'decisao', texto:'Noradrenalina acima de 0,5 mcg/kg/min?', ramos:[
          { rotulo:'Sim', texto:'*Refratário* — vasopressina 0,01–0,04 U/min + hidrocortisona 200 mg/dia' },
          { rotulo:'Não', texto:'Manter e reavaliar perfusão' }
        ]},
        { tipo:'alerta', rotulo:'Em 6–12 h', texto:'*CONTROLE DO FOCO*',
          nota:'Drenagem, cirurgia, retirada de cateter. Lactato que não cai costuma ser foco não controlado — antibiótico sozinho não resolve' },
        { tipo:'fim', rotulo:'Destino', texto:'*UTI* no choque, disfunção de dois órgãos ou lactato que não cai',
          nota:'Sem UTI: rodar o pacote inteiro e transferir com o ATB infundido e a noradrenalina correndo' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*PAM < 70 mmHg*, SpO2 < 90% ou alteração do nível de consciência.',
        'Lactato elevado, sobretudo se não cai após a expansão.',
        'Hipotensão que persiste após volume adequado — *choque séptico*.',
        'Foco que exige controle mecânico: abscesso, colangite, pielonefrite obstruída, fasciite, cateter infectado. *Antibiótico sozinho não resolve foco não drenado.*',
        'Neutropenia, imunossupressão ou asplenia — a evolução é mais rápida e o limiar de agir é menor.'
      ]},
      { tipo:'lista', titulo:'SOFA clínico — sem esperar exame', itens:[
        'SpO2 em ar ambiente < 90% (relação P/F < 400).',
        'Confusão mental — Glasgow 14 ou menos.',
        'Hipotensão — PAM < 70 mmHg.',
        '*Dois desses + infecção = sepse*, e o pacote começa antes de qualquer resultado laboratorial.',
        'O SOFA completo pontua respiratório, neurológico, cardiovascular, plaquetas, bilirrubina e creatinina/diurese: *≥ 2 pontos indica disfunção orgânica*.'
      ]},
      { tipo:'passos', titulo:'Pacote da primeira hora', itens:[
        'Colher *lactato arterial* e repetir em 2–4 h para acompanhar a resposta.',
        '*Colher hemoculturas (2 pares) e demais culturas ANTES do antibiótico* — sem atrasar a primeira dose por isso.',
        '*Antibiótico de amplo espectro na primeira hora*, dirigido ao foco provável.',
        '*Expansão volêmica: 30 mL/kg de cristaloide nas primeiras 3 h*, em alíquotas com reavaliação.',
        'Se a PAM se mantém < 65 mmHg apesar do volume: *noradrenalina*.',
        'Identificar e *controlar o foco* — imagem dirigida, drenagem, retirada de cateter.',
        'Reavaliar perfusão de forma repetida: nível de consciência, diurese, tempo de enchimento capilar, lactato.'
      ]},
      { tipo:'doses', titulo:'Vasopressores e suporte', itens:[
        { droga:'Cristaloide', dose:'30 mL/kg nas primeiras 3 h', via:'EV', obs:'Em alíquotas, reavaliando a cada etapa. Ringer lactato preferível ao SF em grandes volumes.' },
        { droga:'Noradrenalina', dose:'0,1–1 mcg/kg/min, titular', via:'EV BIC', obs:'*Vasopressor de escolha no choque séptico.* Iniciar em veia periférica calibrosa se o acesso central ainda não estiver pronto — não atrasar.' },
        { droga:'Vasopressina', dose:'0,01–0,04 U/min', via:'EV BIC', obs:'*Choque refratário* — associar quando a noradrenalina passa de 0,5 mcg/kg/min.' },
        { droga:'Dobutamina', dose:'5 mcg/kg/min, titular', via:'EV BIC', obs:'Se há disfunção miocárdica com baixo débito apesar de volume e vasopressor adequados.' },
        { droga:'Hidrocortisona', dose:'200 mg/dia', via:'EV', obs:'Choque séptico refratário, em uso de vasopressor em dose crescente.' }
      ]},
      { tipo:'doses', titulo:'Antibiótico empírico por foco', itens:[
        { droga:'Empírico no instável', dose:'Vancomicina 1 g 12/12 h + piperacilina-tazobactam 4,5 g 6/6 h', via:'EV', obs:'Cobertura ampla quando o foco não está definido e o paciente está grave.' },
        { droga:'Foco pulmonar (PAC)', dose:'Ceftriaxona 1 g 12/12 h + claritromicina 500 mg 12/12 h', via:'EV', obs:'Cobre germe típico e atípico.' },
        { droga:'Foco abdominal', dose:'Cefalosporina + metronidazol 500 mg 8/8 h', via:'EV', obs:'*Foco abdominal quase sempre exige controle cirúrgico ou drenagem.*' },
        { droga:'Foco cutâneo', dose:'Oxacilina 2 g 4/4 h', via:'EV', obs:'Suspeita de necrotizante muda tudo: é desbridamento cirúrgico urgente.' },
        { droga:'Foco urinário', dose:'Ceftriaxona 1 g/dia', via:'EV', obs:'Investigar obstrução — pionefrose precisa de drenagem.' },
        { droga:'Infecção de corrente sanguínea', dose:'Vancomicina + piperacilina-tazobactam', via:'EV', obs:'Considerar retirada do cateter suspeito.' }
      ]},
      { tipo:'tempo', titulo:'Linha do tempo', itens:[
        { quando:'0–10 min', o_que:'Reconhecimento pelo SOFA clínico, acesso venoso, monitorização.' },
        { quando:'≤ 1 h',   o_que:'*Lactato colhido, culturas colhidas, antibiótico infundido e volume iniciado.*' },
        { quando:'≤ 3 h',   o_que:'30 mL/kg de cristaloide completos, com reavaliação de perfusão a cada alíquota.' },
        { quando:'2–4 h',   o_que:'*Lactato de controle.* Sem queda, reavaliar volume, foco e necessidade de vasopressor.' },
        { quando:'≤ 6–12 h', o_que:'*Controle do foco* — drenagem, cirurgia ou retirada do dispositivo.', fim:true }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Atrasar o antibiótico* esperando cultura, imagem, vaga ou parecer.',
        'Confiar em pressão normal para excluir sepse — sepse mata sem hipotensão.',
        'Expandir sem reavaliar: volume em excesso no cardiopata gera congestão.',
        'Adiar a noradrenalina esperando acesso central.',
        'Tratar sepse de foco não drenado apenas com antibiótico.',
        'Usar qSOFA como ferramenta diagnóstica — ele é *triagem*, não define sepse.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'Sepse com disfunção orgânica: *leito monitorizado*, com reavaliação frequente. Choque séptico, necessidade de vasopressor, lactato que não cai ou disfunção de dois ou mais órgãos: *UTI*. Serviço sem UTI: iniciar o pacote completo e *transferir com o antibiótico já infundido e a noradrenalina correndo* — o pacote não espera a vaga.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Não espere hipotensão. *Confusão + taquipneia + febre* em idoso já é sepse até prova em contrário, e é onde mais se perde tempo.',
        'Noradrenalina pode correr em veia periférica calibrosa enquanto o central não sai. Esperar o acesso central custa perfusão.',
        'Lactato que não cai depois da expansão é sinal de foco não controlado — volte a procurar o que precisa ser drenado.',
        'Escreva no prontuário a *hora exata* da primeira dose de antibiótico. É o dado que mais importa na revisão do caso.'
      ]}
    ] },

  { id:'meningite', titulo:'Meningite bacteriana aguda', categoria:'infecto', gravidade:'emergencia',
    resumo:'Antibiótico e dexametasona antes da punção quando houver atraso; quem precisa de TC antes.',
    tags:['meningite','punçao lombar','ceftriaxona','dexametasona','rigidez de nuca','liquor'],
    fonte:'Ministério da Saúde — Guia de vigilância das meningites',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Dexametasona 20 minutos ANTES da primeira dose de antibiótico* — depois já não adianta.',
        'Petéquias que não desaparecem à digitopressão com febre: meningococcemia — antibiótico em minutos.',
        'Se a punção vai atrasar (precisa de tomografia por déficit focal, papiledema, convulsão ou rebaixamento), colha hemoculturas e comece o antibiótico.',
        'Acima de 55 anos, gestante ou imunodeprimido: precisa cobrir Listeria com ampicilina.',
        'Isolamento respiratório por gotícula nas primeiras 24 horas de tratamento.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Febre, cefaleia, rigidez de nuca e alteração do nível de consciência',
          nota:'A tétrade completa é rara: dois dos quatro já bastam para suspeitar' },
        { tipo:'passo', rotulo:'Minuto zero', texto:'Hemoculturas + *DEXAMETASONA* + *ANTIBIÓTICO*',
          nota:'Nessa ordem. Não atrase o antibiótico por causa da punção' },
        { tipo:'decisao', texto:'Precisa de tomografia antes da punção?', ramos:[
          { rotulo:'Sim — déficit focal, papiledema, rebaixamento, convulsão, imunossupressão',
            cor:'perigo', texto:'*Tomografia primeiro* — mas o antibiótico já foi' },
          { rotulo:'Não', texto:'*Punção lombar imediata*' }
        ]},
        { tipo:'passo', rotulo:'Líquor', texto:'Celularidade, glicose, proteína, Gram, cultura, látex e pesquisa de BAAR conforme o caso' },
        { tipo:'decisao', texto:'Qual o padrão do líquor?', ramos:[
          { rotulo:'Polimorfonucleares com glicose baixa', cor:'perigo', texto:'*Bacteriana*' },
          { rotulo:'Mononucleares com glicose baixa', texto:'Tuberculose ou fungo (criptococo no HIV)' },
          { rotulo:'Mononucleares com glicose normal', cor:'ok', texto:'Viral — enterovírus é o mais comum',
            nota:'Cuidado com encefalite herpética: alteração de comportamento e sinal focal temporal' }
        ]},
        { tipo:'fim', rotulo:'Depois', texto:'Notificação imediata + isolamento + profilaxia dos contatos' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Dexametasona', dose:'0,15 mg/kg (cerca de 10 mg)', via:'EV', obs:'20 minutos ANTES do antibiótico, de 6/6 h por 4 dias. Reduz sequela, sobretudo no pneumococo.' },
        { droga:'Ceftriaxona', dose:'2 g', via:'EV', obs:'De 12/12 h. Esquema de 3 meses a 55 anos. Duração: 7 dias no meningococo, 10 a 14 no pneumococo.' },
        { droga:'Ampicilina', dose:'2 g', via:'EV', obs:'De 4/4 h, associada à ceftriaxona acima de 55 anos, gestante ou imunodeprimido. 21 dias se Listeria.' },
        { droga:'Vancomicina', dose:'15 a 20 mg/kg', via:'EV', obs:'De 12/12 h, se houver pneumococo resistente na região.' },
        { droga:'Cefotaxima + ampicilina', dose:'Conforme o peso', via:'EV', obs:'Esquema do recém-nascido até 3 meses.' },
        { droga:'Aciclovir', dose:'10 mg/kg', via:'EV', obs:'De 8/8 h, se suspeita de encefalite herpética.' },
        { droga:'Rifampicina 600 mg — profilaxia de contatos', dose:'600 mg', via:'VO', obs:'Meningococo: 12/12 h por 2 dias. Haemophilus: 1x/dia por 4 dias.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Atrasar o antibiótico para fazer tomografia ou punção.',
        'Dexametasona depois do antibiótico: perde o efeito.',
        'Punção lombar com sinal de hipertensão intracraniana sem imagem prévia.',
        'Esquecer o isolamento respiratório nas primeiras 24 horas.',
        'Deixar de fazer a profilaxia do próprio paciente se ele não foi tratado com cefalosporina.'
      ]},
      { tipo:'texto', titulo:'Profilaxia de contatos', conteudo:'Indicada apenas para *meningococo* e *Haemophilus*. Meningococo: todos os contatos próximos e profissionais que fizeram procedimento em via aérea sem EPI. Haemophilus: contatos próximos quando houver criança menor de 4 anos não vacinada no domicílio. Esquema: rifampicina, 4 doses de 600 mg — de 12/12 h por 2 dias no meningococo; 1x/dia por 4 dias no Haemophilus. Alternativas: ceftriaxona 250 mg IM dose única, ou ciprofloxacino 500 mg VO dose única.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Anote o horário exato da dexametasona e do antibiótico: a sequência é auditável e importa.',
        'Sinais de Kernig e Brudzinski têm baixa sensibilidade — sua ausência não afasta.',
        'Notificação compulsória imediata, por telefone à vigilância.'
      ]}
    ] },

  { id:'itu', titulo:'ITU: cistite e pielonefrite', categoria:'infecto', gravidade:'urgencia',
    resumo:'Quem trata em casa, quem interna e a escolha do antibiótico conforme o perfil local.',
    tags:['itu','cistite','pielonefrite','urocultura','nitrofurantoina','ceftriaxona'],
    fonte:'SBI/SBU — Recomendações sobre infecção do trato urinário',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Febre, calafrio ou Giordano positivo tiram o caso da cistite: é *pielonefrite*.',
        'Homem, gestante, criança, sonda, anomalia urológica, transplantado ou imunossuprimido = ITU *complicada*.',
        'Cálculo obstrutivo com infecção é *emergência urológica*: precisa de desobstrução, não só de antibiótico.',
        'Bacteriúria assintomática só se trata em gestante, antes de cirurgia urológica e no transplantado recente.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Disúria, polaciúria, urgência, dor suprapúbica' },
        { tipo:'decisao', texto:'Há febre, calafrio ou dor lombar?', ramos:[
          { rotulo:'Não — cistite', cor:'ok', texto:'*Tratamento curto por via oral*',
            nota:'Fosfomicina 3 g dose única, ou nitrofurantoína 100 mg 6/6 h por 5 dias' },
          { rotulo:'Sim — pielonefrite', texto:'*Urocultura + antibiótico de maior espectro*',
            nota:'Ceftriaxona 1 a 2 g EV; ciprofloxacino VO se ambulatorial' }
        ]},
        { tipo:'decisao', texto:'É complicada?', ramos:[
          { rotulo:'Gestante', texto:'*Cefalexina ou fosfomicina* — quinolona é proibida' },
          { rotulo:'Homem', texto:'Tratar 7 a 14 dias e investigar próstata' },
          { rotulo:'Sepse, vômito, obstrução', cor:'perigo', texto:'*Internar* + imagem + urologia' }
        ]},
        { tipo:'fim', rotulo:'Alta', texto:'Sem febre, tolerando via oral, com receita, urocultura colhida e reavaliação em 48 a 72 h' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Fosfomicina trometamol 3 g', dose:'1 sachê diluído em água, em jejum', via:'VO', obs:'Dose única. Primeira escolha na cistite não complicada.' },
        { droga:'Nitrofurantoína 100 mg', dose:'1 cápsula', via:'VO', obs:'De 6/6 h por 5 dias. Evitar se clearance abaixo de 30 mL/min.' },
        { droga:'Sulfametoxazol + trimetoprima 800/160 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 3 dias, se a resistência local for menor que 20%.' },
        { droga:'Cefalexina 500 mg', dose:'1 cápsula', via:'VO', obs:'De 6/6 h por 7 dias. Escolha na gestante.' },
        { droga:'Ceftriaxona 1 g', dose:'1 a 2 g', via:'EV', obs:'1x/dia na pielonefrite. Hemoculturas e urocultura antes.' },
        { droga:'Ciprofloxacino 500 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 7 dias na pielonefrite ambulatorial e na ITU do homem.' },
        { droga:'Fenazopiridina 100 a 200 mg', dose:'1 comprimido', via:'VO', obs:'De 8/8 h, por até 2 dias, se disúria intensa. Avisar que tinge a urina de laranja.' },
        { droga:'Dipirona 500 mg/mL', dose:'2 ampolas (2 g) em 100 mL de SF 0,9%', via:'EV', obs:'Se dor ou febre.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Quinolona como primeira linha na cistite simples: ANVISA e FDA restringiram por tendinopatia e neuropatia.',
        'Sulfametoxazol-trimetoprima empírico na pielonefrite — resistência alta.',
        'Quinolona ou sulfa no primeiro trimestre da gestação.',
        'Tratar bacteriúria assintomática fora das três exceções.',
        'Dar alta com febre alta e vômito sem garantir a via oral.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Cistite: alta com receita. Pielonefrite: alta possível após a primeira dose endovenosa se o paciente aceita via oral, está estável e tem quem acompanhe, com reavaliação obrigatória em 48 horas. *Internar* se houver sepse, vômito incoercível, gestação, obstrução, imunossupressão ou falha do tratamento ambulatorial. Ultrassom de vias urinárias se não melhorar em 48 a 72 horas.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Urocultura antes do antibiótico em toda ITU complicada e em toda pielonefrite.',
        'Piúria sem sintoma não é ITU — sobretudo no idoso, onde leva a antibiótico desnecessário.',
        'Em idoso confuso, ITU é diagnóstico de exclusão, não a primeira explicação.'
      ]}
    ] },

  { id:'celulite-erisipela', titulo:'Celulite e erisipela', categoria:'infecto', gravidade:'urgencia',
    resumo:'Delimitar a lesão, escolher o antibiótico e reconhecer o que já não é mais celulite.',
    tags:['celulite','erisipela','cefalexina','oxacilina','porta de entrada'],
    fonte:'SBI — Recomendações sobre infecções de pele e partes moles',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — quando não é celulite simples', itens:[
        'Dor desproporcional ao achado, bolhas hemorrágicas, necrose, crepitação, anestesia local: *fasciite necrosante*.',
        'Toxemia, hipotensão ou confusão: sepse de foco cutâneo.',
        'Progressão rápida apesar do antibiótico em 48 horas.',
        'Imunossuprimido, diabético descompensado, cirrótico ou usuário de droga injetável: limiar baixo para internar.',
        'Celulite bilateral de membros inferiores é rara: geralmente é dermatite de estase.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Área de eritema, calor, edema e dor em pele e partes moles' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Demarcar a borda a caneta com o horário* + procurar a porta de entrada',
          nota:'Micose interdigital, fissura, úlcera, picada, ferida. Tratar a porta é parte do tratamento' },
        { tipo:'decisao', texto:'Qual o padrão?', ramos:[
          { rotulo:'Erisipela — borda nítida, elevada, mais superficial', texto:'*Estreptococo* — amoxicilina ou penicilina' },
          { rotulo:'Celulite — bordas mal definidas, mais profunda', texto:'*Estreptococo e S. aureus* — cefalexina' },
          { rotulo:'Com abscesso', texto:'*Drenar* — é o tratamento; antibiótico é adjuvante' },
          { rotulo:'Sinal de necrose', cor:'perigo', texto:'*FASCIITE — cirurgia de urgência*' }
        ]},
        { tipo:'decisao', texto:'Tratar em casa ou internar?', ramos:[
          { rotulo:'Sem toxemia, imunocompetente, tolera via oral', cor:'ok', texto:'*Antibiótico oral + elevação + retorno em 48 h*' },
          { rotulo:'Toxemia, extensa, face, ou falha do oral', texto:'*Internar* com antibiótico endovenoso' }
        ]},
        { tipo:'fim', rotulo:'Reavaliar em 48 h', texto:'Comparar com a marcação: piora além dela indica falha ou diagnóstico errado' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Cefalexina 500 mg a 1 g', dose:'1 cápsula', via:'VO', obs:'De 6/6 h por 7 a 10 dias. Escolha na celulite ambulatorial.' },
        { droga:'Amoxicilina 500 mg', dose:'1 cápsula', via:'VO', obs:'De 8/8 h por 7 a 10 dias. Escolha na erisipela típica.' },
        { droga:'Sulfametoxazol + trimetoprima 800/160 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h. Associar se houver abscesso ou suspeita de MRSA comunitário.' },
        { droga:'Clindamicina 300 a 600 mg', dose:'1 cápsula', via:'VO', obs:'De 6/6 h. Alergia à penicilina; e na fasciite, pelo efeito antitoxina.' },
        { droga:'Oxacilina 1 a 2 g', dose:'—', via:'EV', obs:'De 4/4 h, no internado.' },
        { droga:'Cefazolina 1 a 2 g', dose:'—', via:'EV', obs:'De 8/8 h. Alternativa endovenosa cômoda.' },
        { droga:'Penicilina cristalina', dose:'2 milhões UI', via:'EV', obs:'De 4/4 h, na erisipela internada.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'De 6/6 h, se dor ou febre.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Deixar de demarcar a borda: sem isso não há como saber se piorou.',
        'Ignorar a porta de entrada — a celulite recidiva enquanto ela existir.',
        'Chamar de celulite bilateral o que quase sempre é dermatite de estase.',
        'Adiar a avaliação cirúrgica quando há dor desproporcional ou crepitação.',
        'Anti-inflamatório: pode mascarar a progressão da fasciite.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na celulite ou erisipela sem toxemia, em imunocompetente, com antibiótico oral, elevação do membro, tratamento da porta de entrada e reavaliação obrigatória em 48 horas. *Internar* se houver toxemia, extensão rápida, acometimento de face, imunossupressão, diabetes descompensado, falha do tratamento oral, ou suspeita de fasciite. Recorrência frequente pode indicar profilaxia com penicilina benzatina.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Demarque a borda e escreva a hora — é a informação mais útil para quem reavaliar.',
        'Trate a micose interdigital: é a porta de entrada mais comum na erisipela de perna.',
        'Nas primeiras 24 a 48 horas o eritema pode aumentar mesmo com tratamento correto — avalie o conjunto.'
      ]}
    ] },

  { id:'fasciite-necrotizante', titulo:'Infecção necrotizante de partes moles', categoria:'infecto', gravidade:'emergencia',
    resumo:'Dor desproporcional, LRINEC e o fato de que o tratamento é cirúrgico, não antibiótico.',
    tags:['fasciite necrotizante','lrinec','crepitacao','desbridamento','gangrena'],
    fonte:'SBI/CBC — Recomendações sobre infecções necrotizantes',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — o diagnóstico é clínico e o tratamento é cirúrgico', itens:[
        '*Dor desproporcional* ao achado de pele é o sinal mais precoce e mais importante.',
        'Bolhas hemorrágicas, áreas de anestesia cutânea, necrose, crepitação e odor fétido.',
        'Toxemia, taquicardia e hipotensão desproporcionais à lesão visível.',
        'Progressão em horas — a pele "acompanha atrás" da destruição da fáscia.',
        'Mortalidade acima de 30%: cada hora de atraso na cirurgia aumenta muito.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'Infecção de partes moles com dor desproporcional, toxemia ou progressão rápida' },
        { tipo:'passo', rotulo:'Imediato', texto:'*ACIONAR A CIRURGIA* — não espere exame de imagem',
          nota:'O diagnóstico definitivo é a exploração cirúrgica. Tomografia não pode atrasar' },
        { tipo:'passo', rotulo:'Em paralelo', texto:'Ressuscitação volêmica, hemoculturas e *antibiótico de amplo espectro na primeira hora*',
          nota:'Tratar como sepse: lactato, culturas, volume, vasopressor se necessário' },
        { tipo:'passo', rotulo:'Antibiótico', texto:'*Piperacilina-tazobactam ou carbapenêmico + vancomicina + CLINDAMICINA*',
          nota:'A clindamicina é obrigatória: inibe a produção de toxina, mesmo em germe resistente a ela' },
        { tipo:'passo', rotulo:'Marcadores', texto:'Aplicar o *LRINEC* como apoio — mas escore baixo NÃO afasta',
          nota:'PCR, leucócitos, hemoglobina, sódio, creatinina e glicose' },
        { tipo:'alerta', rotulo:'Nunca', texto:'*Adiar o desbridamento para "observar a evolução"*' },
        { tipo:'fim', rotulo:'Depois', texto:'Terapia intensiva; reoperações programadas a cada 12 a 24 horas até controlar' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Piperacilina + tazobactam', dose:'4,5 g', via:'EV', obs:'De 6/6 h. Ou meropeném 1 g de 8/8 h.' },
        { droga:'Vancomicina', dose:'15 a 20 mg/kg', via:'EV', obs:'De 12/12 h. Cobertura de MRSA. Linezolida é alternativa.' },
        { droga:'Clindamicina', dose:'600 a 900 mg', via:'EV', obs:'De 8/8 h. *Obrigatória* — efeito antitoxina contra estreptococo e clostrídio.' },
        { droga:'Cristaloide', dose:'30 mL/kg se hipotensão', via:'EV', obs:'A perda é enorme. Tratar como choque séptico.' },
        { droga:'Noradrenalina', dose:'Titular', via:'EV', obs:'Alvo de PAM acima de 65 mmHg.' },
        { droga:'Analgesia com opioide', dose:'Morfina titulada', via:'EV', obs:'A dor é intensa e desproporcional.' },
        { droga:'Imunoglobulina endovenosa', dose:'Conforme o protocolo', via:'EV', obs:'Considerada na síndrome do choque tóxico estreptocócico. Evidência limitada.' },
        { droga:'Desbridamento cirúrgico amplo', dose:'—', via:'—', obs:'É o tratamento. Tudo o mais é adjuvante.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar tomografia ou ressonância para acionar a cirurgia.',
        'Confiar em LRINEC baixo para descartar.',
        'Tratar como celulite e reavaliar em 24 horas.',
        'Esquecer a clindamicina — é o que bloqueia a toxina.',
        'Desbridamento econômico: a ressecção precisa ir até tecido viável e sangrante.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Centro cirúrgico imediato e terapia intensiva depois. Reoperações programadas a cada 12 a 24 horas até que não haja mais tecido necrótico. Amputação pode ser necessária para controle do foco. Câmara hiperbárica é adjuvante em alguns protocolos, mas nunca substitui nem atrasa a cirurgia. Notificar e investigar porta de entrada, inclusive uso de droga injetável e varicela na criança.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A frase que salva: "a dor está muito pior do que a pele mostra".',
        'Marque a borda e reavalie em 1 hora, não em 24: a progressão é o diagnóstico.',
        'Se você está em dúvida entre celulite grave e fasciite, chame o cirurgião — a exploração é diagnóstica e terapêutica.'
      ]}
    ] },

  { id:'dengue', titulo:'Dengue: classificação de risco e hidratação', categoria:'infecto', gravidade:'urgencia',
    resumo:'Grupos A a D, prova do laço, sinais de alarme e o plano de hidratação de cada grupo.',
    tags:['dengue','arbovirose','sinais de alarme','prova do laco','hidratacao','plaquetas'],
    fonte:'Ministério da Saúde — Dengue: diagnóstico e manejo clínico (adulto e criança)',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — os sinais de alarme', itens:[
        'Dor abdominal intensa e contínua, ou dor à palpação do abdome.',
        'Vômitos persistentes.',
        'Acúmulo de líquido: ascite, derrame pleural ou pericárdico.',
        'Sangramento de mucosa.',
        'Letargia ou irritabilidade.',
        'Hipotensão postural ou lipotimia.',
        'Hepatomegalia maior que 2 cm.',
        'Aumento progressivo do hematócrito.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Febre com mialgia, cefaleia, dor retro-orbitária ou exantema, em área endêmica',
          nota:'Prova do laço em todos. O período crítico é a *defervescência*, entre o 3º e o 7º dia' },
        { tipo:'decisao', texto:'Classificação de risco', ramos:[
          { rotulo:'Grupo A — sem alarme, sem comorbidade', cor:'ok',
            texto:'*Hidratação oral 60 mL/kg/dia* em casa',
            nota:'1/3 com sais de reidratação, 2/3 com líquidos caseiros. Retorno diário' },
          { rotulo:'Grupo B — sangramento espontâneo ou risco', texto:'*Hemograma e observação na unidade*',
            nota:'Gestante, menor de 2 anos, maior de 65, comorbidade ou risco social' },
          { rotulo:'Grupo C — com sinal de alarme', cor:'perigo',
            texto:'*10 mL/kg/h de cristaloide EV* na 1ª e na 2ª hora',
            nota:'Reavaliar após cada etapa. Internação' },
          { rotulo:'Grupo D — choque', cor:'perigo',
            texto:'*20 mL/kg em 20 minutos*, até 3 vezes',
            nota:'Não melhorou: noradrenalina e albumina. Terapia intensiva' }
        ]},
        { tipo:'alerta', rotulo:'Proibido', texto:'*Anti-inflamatório e ácido acetilsalicílico*',
          nota:'Aumentam o risco de sangramento. Só dipirona ou paracetamol' },
        { tipo:'fim', rotulo:'Depois', texto:'Notificação compulsória; cartão de acompanhamento entregue e explicado' }
      ]},
      { tipo:'doses', titulo:'Hidratação e sintomáticos', itens:[
        { droga:'Hidratação oral — Grupo A e B', dose:'60 mL/kg/dia (adulto)', via:'VO', obs:'1/3 com sais de reidratação e 2/3 com líquidos caseiros. Para 70 kg, cerca de 4,2 L/dia.' },
        { droga:'Cristaloide — Grupo C', dose:'10 mL/kg/h', via:'EV', obs:'Na 1ª e na 2ª hora, reavaliando hematócrito e sinais vitais entre as etapas.' },
        { droga:'Cristaloide — Grupo D', dose:'20 mL/kg em 20 minutos', via:'EV', obs:'Repetir até 3 vezes. Se não melhorar, noradrenalina e albumina.' },
        { droga:'Dipirona 500 mg', dose:'1 comprimido ou 2 ampolas EV', via:'VO ou EV', obs:'De 6/6 h, se dor ou febre.' },
        { droga:'Paracetamol 500 mg', dose:'1 comprimido', via:'VO', obs:'De 6/6 h. Máximo de 3 g ao dia.' },
        { droga:'Ondansetrona 4 mg/mL', dose:'1 ampola em 100 mL de SF 0,9%', via:'EV', obs:'De 8/8 h, se vômito.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Ácido acetilsalicílico, ibuprofeno, diclofenaco ou nimesulida — em nenhuma fase.',
        'Injeção intramuscular: risco de hematoma na plaquetopenia.',
        'Dar alta no Grupo B antes do resultado do hemograma.',
        'Transfundir plaqueta por número isolado, sem sangramento.',
        'Relaxar quando a febre cede — é justamente aí que o paciente piora.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Grupo A*: alta com hidratação oral, cartão de acompanhamento e retorno diário até 48 horas após cessar a febre. *Grupo B*: observação até o hemograma; alta se hematócrito normal e sem alarme. *Grupos C e D*: internação obrigatória, D em terapia intensiva. Notificação compulsória em todos.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Entregue e explique o cartão de acompanhamento; leia os sinais de alarme junto com o acompanhante.',
        'O hematócrito de base importa mais que o valor isolado: peça o de referência.',
        'Diagnóstico: NS1 ou PCR até o 5º dia; IgM a partir do 6º.'
      ]}
    ] },

  { id:'sindrome-febril', titulo:'Síndrome febril aguda e arboviroses', categoria:'infecto', gravidade:'urgencia',
    resumo:'Roteiro de investigação da febre sem foco no adulto, incluindo chikungunya, zika, malária e leptospirose.',
    tags:['febre','arbovirose','chikungunya','zika','malaria','leptospirose','febre amarela'],
    fonte:'Ministério da Saúde — Guias de vigilância em saúde',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Instabilidade, rebaixamento, petéquias que não desaparecem à digitopressão, rigidez de nuca ou hipoxemia.',
        'Icterícia com febre: leptospirose, malária, febre amarela, colangite, hepatite.',
        'Viagem recente a área endêmica muda tudo — *malária é emergência*.',
        'Neutropênico com febre é emergência: antibiótico na primeira hora.',
        'Febre sem foco no idoso pode ser a única manifestação de sepse.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Febre aguda sem foco evidente' },
        { tipo:'passo', rotulo:'Anamnese dirigida', texto:'Viagem, contato com água de enchente, animais, picada, sexo desprotegido, procedimento recente',
          nota:'A história epidemiológica vale mais que qualquer exame nessa hora' },
        { tipo:'decisao', texto:'Há sinal de gravidade?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Tratar como sepse* — pacote da 1ª hora',
            nota:'Lactato, hemoculturas, antibiótico, 30 mL/kg se hipotensão' },
          { rotulo:'Não', texto:'Investigar conforme a epidemiologia' }
        ]},
        { tipo:'decisao', texto:'Qual o cenário epidemiológico?', ramos:[
          { rotulo:'Área de arbovirose', texto:'*Dengue, chikungunya, zika* — prova do laço, hemograma, NS1' },
          { rotulo:'Enchente, esgoto, roedor', texto:'*Leptospirose* — CPK, função renal, bilirrubinas' },
          { rotulo:'Amazônia nos últimos 30 dias', cor:'perigo', texto:'*Malária* — gota espessa no mesmo plantão' },
          { rotulo:'Icterícia + colestase', texto:'Febre amarela, leptospirose, hepatite, colangite' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'Alta com reavaliação em 24 a 48 h se estável e sem alarme; internar se houver gravidade ou icterícia' }
      ]},
      { tipo:'lista', titulo:'Marcas que orientam o diagnóstico', itens:[
        '*Sinal de Faget* (febre alta com pulso baixo): febre amarela e febre tifoide.',
        '*Sufusão conjuntival e mialgia de panturrilha* com história de enchente: leptospirose.',
        '*Febre em crises com anemia hemolítica* e viagem à Amazônia: malária.',
        '*Hepatoesplenomegalia com pancitopenia* arrastada: calazar.',
        '*Confusão mental, enterorragia e perfuração* na 3ª semana: febre tifoide.',
        '*Leucopenia* aponta para arbovirose e febre amarela; *leucocitose com desvio*, para bacteriana e leptospirose.'
      ]},
      { tipo:'doses', titulo:'Suporte e tratamentos específicos', itens:[
        { droga:'Dipirona 500 mg/mL', dose:'2 ampolas (2 g) em 100 mL de SF 0,9%', via:'EV', obs:'De 6/6 h. Evitar anti-inflamatório enquanto não afastar dengue.' },
        { droga:'Cloreto de sódio 0,9%', dose:'500 a 1000 mL', via:'EV', obs:'Conforme a volemia.' },
        { droga:'Gota espessa', dose:'—', via:'—', obs:'Em toda febre com viagem a área endêmica. Resultado no mesmo plantão.' },
        { droga:'Doxiciclina 100 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 7 dias — leptospirose leve.' },
        { droga:'Penicilina G cristalina', dose:'1,5 milhão UI', via:'EV', obs:'De 6/6 h por 7 dias — leptospirose grave. Ceftriaxona é alternativa.' },
        { droga:'Ceftriaxona 2 g', dose:'2 g', via:'EV', obs:'1x/dia — febre tifoide e cobertura empírica de foco indeterminado.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Anti-inflamatório antes de afastar dengue.',
        'Deixar de perguntar sobre viagem: perde malária, que mata em horas.',
        'Antibiótico empírico em quadro claramente viral e estável.',
        'Dar alta ao neutropênico febril.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta com reavaliação em 24 a 48 horas se o paciente está estável, sem sinal de alarme, hidratado e com quem o acompanhe. *Internar* se houver instabilidade, icterícia, sangramento, rebaixamento, hipoxemia, oligúria, imunossupressão, ou impossibilidade de retorno. Notificação compulsória em dengue, chikungunya, zika, leptospirose, malária, febre amarela e febre tifoide.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Três perguntas que resolvem a maioria: viajou, teve contato com água de enchente, tomou vacina?',
        'Registre o dia de doença, não só "há alguns dias" — a conduta na dengue depende disso.',
        'Febre com petéquia é meningococcemia até prova em contrário: antibiótico já.'
      ]}
    ] },

  { id:'neutropenia-febril', titulo:'Neutropenia febril', categoria:'infecto', gravidade:'emergencia',
    resumo:'Antibiótico de amplo espectro na primeira hora, sem esperar exame; escore MASCC.',
    tags:['neutropenia febril','quimioterapia','cefepime','piperacilina','mascc'],
    fonte:'SBI/SBOC — Recomendações sobre neutropenia febril',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'É *emergência oncológica*: antibiótico na primeira hora, como na sepse.',
        'Não espere o hemograma se a suspeita é forte em paciente em quimioterapia.',
        'Febre pode ser o único sinal — o neutropênico não faz pus nem infiltrado.',
        'Não fazer toque retal, supositório nem termômetro retal: risco de bacteremia.',
        'Mucosite, cateter e sinais discretos de infecção perineal merecem busca ativa.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Definição', texto:'Neutrófilos abaixo de 500 (ou abaixo de 1000 com queda esperada) + temperatura acima de 38,3 °C, ou 38 °C por 1 hora' },
        { tipo:'passo', rotulo:'Primeira hora', texto:'*Hemoculturas (periférica e de cada lúmen do cateter) + ANTIBIÓTICO*',
          nota:'Não atrase o antibiótico além de 60 minutos' },
        { tipo:'passo', rotulo:'Examinar', texto:'Boca, pele, cateter, períneo, pulmão e seios da face — *sem toque retal*',
          nota:'Procurar mucosite, celulite de inserção de cateter e lesão perianal' },
        { tipo:'passo', rotulo:'Antibiótico', texto:'*Antipseudomonas em monoterapia*',
          nota:'Cefepima, piperacilina-tazobactam ou meropeném' },
        { tipo:'decisao', texto:'Precisa acrescentar vancomicina?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'Infecção de cateter, mucosite grave, instabilidade, pele e partes moles, MRSA conhecido',
            nota:'Não é rotina — só nessas situações' },
          { rotulo:'Não', cor:'ok', texto:'Manter monoterapia e reavaliar' }
        ]},
        { tipo:'passo', rotulo:'Estratificar', texto:'*MASCC* — escore igual ou maior que 21 identifica o baixo risco',
          nota:'Baixo risco selecionado pode ser tratado por via oral, com seguimento rigoroso' },
        { tipo:'fim', rotulo:'Reavaliar', texto:'Se febre persistir após 4 a 7 dias, considerar antifúngico empírico' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Cefepima', dose:'2 g', via:'EV', obs:'De 8/8 h. Primeira escolha em monoterapia.' },
        { droga:'Piperacilina + tazobactam', dose:'4,5 g', via:'EV', obs:'De 6/6 h. Alternativa.' },
        { droga:'Meropeném', dose:'1 g', via:'EV', obs:'De 8/8 h. Se houver instabilidade ou risco de ESBL.' },
        { droga:'Vancomicina', dose:'15 a 20 mg/kg', via:'EV', obs:'De 12/12 h. Só nas indicações específicas, não de rotina.' },
        { droga:'Ciprofloxacino + amoxicilina-clavulanato', dose:'500 mg 12/12 h + 875/125 mg 12/12 h', via:'VO', obs:'Esquema oral do baixo risco (MASCC ≥ 21), com seguimento rigoroso.' },
        { droga:'Antifúngico empírico', dose:'Equinocandina ou anfotericina lipossomal', via:'EV', obs:'Se febre persistir por 4 a 7 dias sob antibiótico de amplo espectro.' },
        { droga:'Filgrastim (G-CSF)', dose:'Conforme o protocolo', via:'SC', obs:'Não é rotina; considerado em neutropenia prolongada ou quadro grave.' },
        { droga:'Cristaloide', dose:'30 mL/kg se hipotensão', via:'EV', obs:'Tratar como sepse.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar o hemograma para começar o antibiótico quando a suspeita é forte.',
        'Toque retal, supositório ou termômetro retal.',
        'Vancomicina de rotina em todos.',
        'Dar alta ao neutropênico febril sem estratificação formal e sem retaguarda.',
        'Antitérmico antes de colher as culturas, quando isso mascara a febre e atrasa o reconhecimento.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'A regra é internar. Tratamento ambulatorial oral só em paciente rigorosamente selecionado: MASCC igual ou maior que 21, sem comorbidade, sem instabilidade, tolerando via oral, com rede de apoio, telefone e retorno em 24 horas garantidos. Acionar a oncologia ou hematologia desde a admissão. Manter o antibiótico até resolução da febre e recuperação dos neutrófilos.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Colha hemocultura de veia periférica *e* de cada lúmen do cateter, e identifique cada frasco.',
        'Anote a hora da primeira dose: é indicador de qualidade e a oncologia vai perguntar.',
        'Pergunte a data da última quimioterapia: o nadir costuma ser entre o 7º e o 14º dia.'
      ]}
    ] },

  { id:'endocardite', titulo:'Endocardite infecciosa', categoria:'infecto', gravidade:'urgencia',
    resumo:'Critérios de Duke, três pares de hemocultura antes do antibiótico e indicações cirúrgicas.',
    tags:['endocardite','duke','hemocultura','sopro','ecocardiograma','vancomicina'],
    fonte:'SBC — Diretriz de endocardite infecciosa',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Febre com sopro novo, sobretudo em prótese valvar, endocardite prévia ou uso de droga injetável.',
        'Insuficiência cardíaca aguda por regurgitação valvar: indicação cirúrgica precoce.',
        'Fenômeno embólico: AVC, isquemia de membro, infarto esplênico ou renal.',
        'Vegetação maior que 10 mm com embolia, ou abscesso perianular: cirurgia.',
        'Três pares de hemocultura ANTES do antibiótico, salvo instabilidade.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'Febre prolongada com sopro, fenômeno embólico ou fator de risco' },
        { tipo:'passo', rotulo:'Antes do antibiótico', texto:'*Três pares de hemocultura de sítios diferentes*, com intervalo',
          nota:'Sem isso, o tratamento fica às cegas por semanas' },
        { tipo:'passo', rotulo:'Imagem', texto:'*Ecocardiograma transtorácico*; transesofágico se negativo com alta suspeita, ou se houver prótese' },
        { tipo:'passo', rotulo:'Aplicar critérios de Duke', texto:'*2 maiores · ou 1 maior + 3 menores · ou 5 menores*' },
        { tipo:'decisao', texto:'Qual a apresentação?', ramos:[
          { rotulo:'Subaguda, estável, valva nativa', cor:'ok', texto:'*Aguardar culturas* ou iniciar vancomicina + ceftriaxona' },
          { rotulo:'Aguda, toxêmica, ou droga injetável', cor:'perigo', texto:'*Vancomicina + gentamicina* imediata' },
          { rotulo:'Prótese com menos de 1 ano', cor:'perigo', texto:'*Vancomicina + gentamicina + rifampicina*' }
        ]},
        { tipo:'passo', rotulo:'Avaliar cirurgia', texto:'Insuficiência cardíaca, infecção não controlada, abscesso, ou risco embólico alto' },
        { tipo:'fim', rotulo:'Depois', texto:'Tratamento de 4 a 6 semanas; 6 semanas ou mais em prótese' }
      ]},
      { tipo:'lista', titulo:'Critérios de Duke', itens:[
        '*Maiores* — hemocultura positiva com agente típico em 2 amostras, ou bacteremia persistente; ecocardiograma com vegetação, abscesso, deiscência de prótese ou nova regurgitação valvar.',
        '*Menores* — predisposição (valvopatia ou uso de droga injetável); febre igual ou acima de 38 °C; fenômenos vasculares (aneurisma micótico, hemorragia intracraniana, manchas de Janeway, que são indolores); fenômenos imunológicos (manchas de Roth, glomerulonefrite, nódulos de Osler, que doem, fator reumatoide); evidência microbiológica que não preenche critério maior.',
        'Diagnóstico: 2 maiores, ou 1 maior + 3 menores, ou 5 menores.'
      ]},
      { tipo:'doses', titulo:'Esquemas empíricos', itens:[
        { droga:'Vancomicina + ceftriaxona', dose:'Vancomicina 15 a 20 mg/kg 12/12 h + ceftriaxona 2 g/dia', via:'EV', obs:'Valva nativa, apresentação subaguda.' },
        { droga:'Vancomicina + gentamicina', dose:'Vancomicina 15 a 20 mg/kg 12/12 h + gentamicina 3 mg/kg/dia', via:'EV', obs:'Apresentação aguda ou usuário de droga injetável.' },
        { droga:'Vancomicina + gentamicina + rifampicina', dose:'Rifampicina 300 a 450 mg de 8/8 h', via:'EV ou VO', obs:'Prótese com menos de 1 ano. A rifampicina erradica o estafilococo do biofilme.' },
        { droga:'Oxacilina', dose:'2 g', via:'EV', obs:'De 4/4 h, quando confirmado MSSA — superior à vancomicina nesse caso.' },
        { droga:'Penicilina cristalina ou ceftriaxona', dose:'Conforme o protocolo', via:'EV', obs:'Estreptococo viridans sensível.' },
        { droga:'Amoxicilina 2 g — profilaxia', dose:'2 g', via:'VO', obs:'1 hora antes de procedimento odontológico com manipulação gengival. Só nos grupos de risco.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Iniciar antibiótico antes das hemoculturas em paciente estável.',
        'Excluir o diagnóstico por ecocardiograma transtorácico negativo com alta suspeita.',
        'Profilaxia antibiótica em todo procedimento e para todo paciente: só nos grupos de risco e em procedimentos específicos.',
        'Anticoagular só por causa da vegetação: não previne embolia e aumenta hemorragia.',
        'Tratar por menos de 4 semanas.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Internação prolongada, com cardiologia e infectologia acompanhando, e cirurgia cardíaca disponível. Grupos de risco para profilaxia: prótese valvar ou material protético em reparo valvar, endocardite prévia, cardiopatia congênita cianótica não reparada ou com correção incompleta, e transplantado cardíaco com valvopatia. Procedimentos que indicam profilaxia: manipulação de gengiva, região periapical dos dentes, ou perfuração de mucosa oral.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Nódulo de Osler dói; mancha de Janeway não. É a forma clássica de lembrar.',
        'Febre sem foco com sopro novo em usuário de droga injetável: hemoculturas e ecocardiograma.',
        'Registre os critérios de Duke preenchidos — orienta quem assume o caso.'
      ]}
    ] },

  { id:'tuberculose-ps', titulo:'Tuberculose: suspeita no pronto-socorro', categoria:'infecto', gravidade:'rotina',
    resumo:'Quando isolar, quais exames pedir e como encaminhar sem perder o paciente.',
    tags:['tuberculose','tb','baar','teste rapido molecular','isolamento respiratorio'],
    fonte:'Ministério da Saúde — Manual de recomendações para o controle da tuberculose',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Isolamento respiratório por aerossol* na suspeita: máscara N95 para a equipe, cirúrgica no paciente, quarto com porta fechada.',
        'Hemoptise volumosa, insuficiência respiratória ou sinal de disseminação (miliar, meníngea): internação.',
        'Sintomático respiratório é quem tem tosse por 3 semanas ou mais — em pessoa com HIV, qualquer tosse.',
        'Radiografia normal não exclui, sobretudo no imunossuprimido.',
        'Notificação compulsória e testagem para HIV em todo caso.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Tosse por 3 semanas ou mais, febre vespertina, sudorese noturna, emagrecimento' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*ISOLAMENTO RESPIRATÓRIO* imediato, antes de qualquer exame',
          nota:'Máscara cirúrgica no paciente; N95 na equipe' },
        { tipo:'passo', rotulo:'Diagnóstico', texto:'*Teste rápido molecular (TRM-TB)* + baciloscopia + cultura com teste de sensibilidade',
          nota:'O TRM detecta o bacilo e a resistência à rifampicina em cerca de 2 horas' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Radiografia de tórax + teste para HIV*',
          nota:'Coinfecção muda o esquema e a urgência' },
        { tipo:'decisao', texto:'Qual o destino?', ramos:[
          { rotulo:'Estável, sem complicação', cor:'ok', texto:'*Tratamento ambulatorial supervisionado*',
            nota:'Encaminhar à unidade de referência; o tratamento é fornecido pelo SUS' },
          { rotulo:'Hemoptise volumosa, insuficiência respiratória, disseminada', cor:'perigo',
            texto:'*Internar em isolamento*' },
          { rotulo:'Intolerância, comorbidade grave, risco social', texto:'Internação para início supervisionado' }
        ]},
        { tipo:'fim', rotulo:'Sempre', texto:'Notificação compulsória + investigação dos contatos' }
      ]},
      { tipo:'doses', titulo:'Esquema básico (RIPE) — dose fixa combinada por peso', itens:[
        { droga:'Fase intensiva — RIPE', dose:'20 a 35 kg: 2 cp · 36 a 50 kg: 3 cp · acima de 50 kg: 4 cp', via:'VO', obs:'1x/dia em jejum, por 2 meses. Rifampicina, isoniazida, pirazinamida e etambutol.' },
        { droga:'Fase de manutenção — RI', dose:'Mesma lógica de peso', via:'VO', obs:'1x/dia por 4 meses. Rifampicina e isoniazida.' },
        { droga:'Piridoxina (vitamina B6)', dose:'50 mg/dia', via:'VO', obs:'Previne neuropatia pela isoniazida. Indicada em gestante, etilista, desnutrido, HIV e diabético.' },
        { droga:'Meningite tuberculosa', dose:'RIPE por 2 meses + RI por 7 a 10 meses', via:'VO', obs:'Associar corticoide (prednisona ou dexametasona) nas primeiras semanas.' },
        { droga:'Corticoide', dose:'Prednisona 1 a 2 mg/kg/dia', via:'VO', obs:'Indicado na forma meníngea e na pericárdica.' },
        { droga:'Isolamento respiratório', dose:'—', via:'—', obs:'Manter até 2 a 3 semanas de tratamento efetivo com melhora clínica, ou baciloscopias negativas.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Atender sintomático respiratório sem máscara e sem isolamento.',
        'Iniciar tratamento sem colher material para cultura e teste de sensibilidade.',
        'Deixar de testar para HIV.',
        'Esquecer a notificação e a investigação de contatos.',
        'Iniciar esquema sem encaminhar para o tratamento supervisionado — a adesão é o principal determinante de cura.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'A maioria trata ambulatorialmente. *Internar* em: intolerância medicamentosa incontrolável, comorbidade que exija hospitalização, estado geral muito comprometido, formas graves ou disseminadas, hemoptise volumosa, e vulnerabilidade social que inviabilize o tratamento. Avisar sobre urina alaranjada pela rifampicina, interação com anticoncepcional, e a necessidade de procurar atendimento se houver icterícia ou vômitos.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Coloque a máscara no paciente na triagem — a proteção começa antes do diagnóstico.',
        'O teste rápido molecular dá resultado em horas e detecta resistência à rifampicina: peça sempre.',
        'Pergunte sobre tratamento prévio: retratamento e abandono mudam a conduta e o risco de resistência.'
      ]}
    ] },

  { id:'profilaxia-pos-exposicao', titulo:'Profilaxias pós-exposição: HIV, raiva e tétano', categoria:'infecto', gravidade:'urgencia',
    resumo:'Acidente com material biológico, mordedura e ferimento sujo — o que dar e em quanto tempo.',
    tags:['pep','hiv','profilaxia','raiva','tetano','acidente perfurocortante','vacina'],
    fonte:'Ministério da Saúde — PCDT de profilaxia pós-exposição / Normas de raiva e tétano',
    secoes:[
      { tipo:'alerta', titulo:'Regras de ouro', itens:[
        '*A profilaxia do HIV é mais eficaz nas primeiras 2 horas; o limite é 72 horas.*',
        'Não existe profilaxia para hepatite C — apenas seguimento sorológico.',
        'Risco de transmissão por acidente percutâneo: hepatite B maior que hepatite C, maior que HIV.',
        'Fonte com HIV indetectável há mais de 6 meses dispensa a profilaxia.',
        'Não espremer o ferimento nem usar substância cáustica.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Exposição ocupacional, sexual ou por violência a material biológico' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Lavar com água e sabão*; mucosa com água ou soro em abundância',
          nota:'Não espremer, não usar álcool, éter ou hipoclorito' },
        { tipo:'decisao', texto:'O material é infectante?', ramos:[
          { rotulo:'Sim — sangue, sêmen, secreção vaginal, líquidos cavitários', texto:'Seguir a avaliação' },
          { rotulo:'Não — suor, lágrima, urina, fezes e saliva sem sangue', cor:'ok', texto:'*Sem profilaxia*' }
        ]},
        { tipo:'passo', rotulo:'Testar', texto:'*Teste rápido do exposto e da pessoa-fonte* para HIV, hepatite B e C',
          nota:'Exposto já positivo: não é profilaxia, é tratamento. Fonte negativa: dispensa a profilaxia' },
        { tipo:'passo', rotulo:'HIV', texto:'*TDF + 3TC + DTG por 28 dias* — iniciar o quanto antes',
          nota:'Ideal em até 2 horas; máximo 72 horas' },
        { tipo:'passo', rotulo:'Hepatite B', texto:'Vacina e/ou *imunoglobulina*, conforme o esquema vacinal e o anti-HBs',
          nota:'Não vacinado ou sem resposta, com fonte positiva ou desconhecida: imunoglobulina 0,06 mL/kg + iniciar a vacinação' },
        { tipo:'fim', rotulo:'Seguimento', texto:'Testagem em 30 e 90 dias; abrir CAT se for acidente de trabalho' }
      ]},
      { tipo:'doses', titulo:'Esquemas', itens:[
        { droga:'Tenofovir 300 mg + Lamivudina 300 mg', dose:'1 comprimido', via:'VO', obs:'1x/dia por 28 dias. Ajustar se clearance abaixo de 60 mL/min.' },
        { droga:'Dolutegravir 50 mg', dose:'1 comprimido', via:'VO', obs:'1x/dia por 28 dias. Esquema preferencial do Ministério da Saúde.' },
        { droga:'Imunoglobulina anti-hepatite B (IGHAHB)', dose:'0,06 mL/kg', via:'IM', obs:'Em até 7 dias (ideal em 48 h). Local diferente da vacina.' },
        { droga:'Vacina hepatite B', dose:'0,5 a 1 mL conforme a idade', via:'IM', obs:'Iniciar ou completar o esquema de 3 doses.' },
        { droga:'Vacina dT', dose:'0,5 mL', via:'IM', obs:'Se a ferida for tetanogênica e o esquema estiver desatualizado.' },
        { droga:'Ondansetrona 4 mg', dose:'1 comprimido', via:'VO', obs:'De 8/8 h, se náusea — efeito adverso comum da profilaxia.' },
        { droga:'Profilaxias de IST na violência sexual', dose:'Ver a conduta específica', via:'—', obs:'Penicilina benzatina, ceftriaxona, azitromicina, metronidazol e contracepção de emergência.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Espremer o ferimento ou aplicar álcool, éter ou hipoclorito.',
        'Adiar o início da profilaxia esperando o resultado da fonte quando ela é desconhecida.',
        'Iniciar profilaxia após 72 horas: não há benefício.',
        'Esquecer a hepatite B — é a de maior risco de transmissão.',
        'Deixar de abrir a CAT no acidente ocupacional.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Atendimento ambulatorial. Entregar os 28 dias de medicação ou garantir o acesso imediato no serviço de referência — interromper no meio anula o benefício. Orientar sexo seguro e não doar sangue durante o seguimento. Testagem de controle em 30 e 90 dias. Em violência sexual, acionar também o serviço social, a saúde mental e a notificação compulsória.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Comece a profilaxia e resolva a papelada depois — o relógio de 72 horas não espera.',
        'Registre a hora exata da exposição e a hora da primeira dose.',
        'Efeito adverso é a principal causa de abandono: prescreva antiemético junto.'
      ]}
    ] },

  { id:'antibioticoterapia-empirica', titulo:'Antibioticoterapia empírica no plantão', categoria:'infecto', gravidade:'rotina',
    resumo:'Tabela de escolha inicial por foco, com ajuste para função renal e alergia a penicilina.',
    tags:['antibiotico','empirico','espectro','ajuste renal','alergia penicilina'],
    fonte:'SBI — Recomendações de uso racional de antimicrobianos',
    secoes:[
      { tipo:'alerta', titulo:'Regras que valem para qualquer escolha', itens:[
        'Cultura *antes* da primeira dose, sempre que não atrasar o tratamento além de 45 minutos.',
        'Na sepse e na neutropenia febril, o antibiótico entra na *primeira hora*.',
        'Descalonar em 48 a 72 horas com o resultado — amplo espectro mantido é o que fabrica resistência.',
        'Ajustar pela função renal e conferir alergia real (exantema tardio não é anafilaxia).',
        'Definir a *duração* na prescrição inicial: prescrição sem data de parada vira tratamento eterno.'
      ]},
      { tipo:'fluxo', titulo:'Como escolher', itens:[
        { tipo:'inicio', rotulo:'1', texto:'Qual o *sítio* provável da infecção?',
          nota:'Pulmão, urina, pele, abdome, SNC, cateter. Sem sítio, a escolha é chute' },
        { tipo:'passo', rotulo:'2', texto:'Quais os *germes* esperados naquele sítio?' },
        { tipo:'passo', rotulo:'3', texto:'É comunitária ou associada à assistência?',
          nota:'Internação nos últimos 90 dias, antibiótico recente, diálise, asilo: pensar em resistente' },
        { tipo:'decisao', texto:'Há fator de risco para germe multirresistente?', ramos:[
          { rotulo:'Não', cor:'ok', texto:'*Espectro estreito* dirigido ao sítio',
            nota:'Ceftriaxona cobre a maior parte do que é comunitário' },
          { rotulo:'Sim', texto:'*Ampliar*: antipseudomonas, e vancomicina se houver risco de MRSA',
            nota:'Piperacilina-tazobactam, cefepima ou meropeném' }
        ]},
        { tipo:'passo', rotulo:'4', texto:'Definir *dose, via e duração* na mesma prescrição' },
        { tipo:'fim', rotulo:'5', texto:'Reavaliar em 48 a 72 h: descalonar, trocar para via oral, ou suspender' }
      ]},
      { tipo:'doses', titulo:'Esquemas empíricos mais usados', itens:[
        { droga:'Ceftriaxona', dose:'1 a 2 g', via:'EV', obs:'1x/dia (12/12 h na meningite). O cavalo de batalha do comunitário.' },
        { droga:'Ceftriaxona + azitromicina', dose:'2 g + 500 mg', via:'EV', obs:'Pneumonia comunitária internada.' },
        { droga:'Ampicilina + sulbactam', dose:'3 g', via:'EV', obs:'De 6/6 h. Aspirativa, pele, abdome leve.' },
        { droga:'Ceftriaxona + metronidazol', dose:'2 g + 500 mg', via:'EV', obs:'Metronidazol de 8/8 h. Foco abdominal.' },
        { droga:'Piperacilina + tazobactam', dose:'4,5 g', via:'EV', obs:'De 6/6 h. Amplo espectro com cobertura de Pseudomonas.' },
        { droga:'Cefepima', dose:'2 g', via:'EV', obs:'De 8/8 h. Neutropenia febril e pneumonia hospitalar.' },
        { droga:'Meropeném', dose:'1 g', via:'EV', obs:'De 8/8 h. Risco de ESBL, ou falha de esquema anterior.' },
        { droga:'Vancomicina', dose:'15 a 20 mg/kg', via:'EV', obs:'De 12/12 h. Acrescentar se houver risco de MRSA, cateter ou choque.' },
        { droga:'Oxacilina', dose:'2 g', via:'EV', obs:'De 4/4 h. MSSA em pele, osso e endocardite.' },
        { droga:'Clindamicina', dose:'600 mg', via:'EV', obs:'De 6/6 h. Anaeróbio, alergia à penicilina, fasciite (efeito antitoxina).' }
      ]},
      { tipo:'lista', titulo:'Durações que se esquecem', itens:[
        'Pneumonia comunitária: 5 a 7 dias.',
        'Cistite não complicada: dose única a 5 dias.',
        'Pielonefrite: 7 a 10 dias.',
        'Celulite: 7 a 10 dias.',
        'Intra-abdominal com foco controlado: 4 a 7 dias.',
        'Bacteremia por S. aureus: no mínimo 14 dias, e 4 a 6 semanas se complicada.',
        'Meningite: 7 dias no meningococo, 10 a 14 no pneumococo, 21 na Listeria.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Começar amplo espectro e nunca descalonar.',
        'Trocar de antibiótico em 24 horas por "não melhorou" — o efeito leva 48 a 72 horas.',
        'Cobrir MRSA e Pseudomonas em todo mundo por precaução.',
        'Prescrever sem data de término.',
        'Aceitar "alergia a penicilina" sem perguntar o que aconteceu: 90% não são alérgicos de verdade.'
      ]},
      { tipo:'texto', titulo:'Quando NÃO dar antibiótico', conteudo:'Bacteriúria assintomática fora das exceções, colonização de úlcera crônica sem sinal inflamatório, ponta de cateter positiva sem clínica, diarreia aquosa sem sangue, quadro viral de via aérea, e febre isolada em paciente estável sem foco enquanto se investiga. *Não prescrever também é conduta*, e precisa estar registrada.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Registre sítio presumido, esquema, dose, início e *data prevista de término*.',
        'Anote se as culturas foram colhidas antes da primeira dose.',
        'Consulte a aba Antibióticos do guia para o esquema por sítio.'
      ]}
    ] },

  /* ======================= 06 · ENDÓCRINO ======================= */
  { id:'cetoacidose', titulo:'Cetoacidose diabética', categoria:'endocrino', gravidade:'emergencia',
    resumo:'Volume primeiro, insulina depois, potássio antes da insulina — e quando trocar o soro por glicosado.',
    tags:['cad','cetoacidose','insulina','potassio','anion gap','bicarbonato','vip','ehh','polarizante'],
    fonte:'SBD — Diretrizes da Sociedade Brasileira de Diabetes · PS Zerado, p. 37–39 · prescris (hiperglicemia)',
    ficha:[
      { rotulo:'Quando pensar', valor:'Hiperglicemia com *náusea, vômito, dor abdominal, respiração de Kussmaul e hálito cetônico*. Diabético tipo 1, ou tipo 2 sob estresse infeccioso.' },
      { rotulo:'Prioridade',    valor:'*V-I-P: Volume, Insulina, Potássio* — mas o potássio é checado *antes* de a insulina começar.' },
      { rotulo:'Meta',          valor:'Glicemia < 200, pH > 7,3, bicarbonato > 18 e ânion gap < 12.' }
    ],
    secoes:[
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'*Hiperglicemia* + náusea, vômito, dor abdominal, Kussmaul',
          nota:'Confirmar a tríade: glicemia > 250 · pH < 7,3 ou HCO3 < 18 · cetonemia/cetonúria' },
        { tipo:'paralelo', colunas:[
          { tipo:'passo', rotulo:'V — Volume', texto:'*SF 0,9%* 15–20 mL/kg na 1ª hora', nota:'Depois 100 mL/kg em 48 h. Cautela se hipervolêmico' },
          { tipo:'passo', rotulo:'Exames', texto:'Gasometria, eletrólitos, cetonas, função renal', nota:'E *procurar o fator precipitante*: infecção, IAM, má adesão' },
          { tipo:'passo', rotulo:'Monitorização', texto:'*Glicemia capilar 1/1 h*', nota:'Eletrólitos e gasometria de 2/2 h a 4/4 h' }
        ]},
        { tipo:'decisao', texto:'P — Qual o potássio ANTES de iniciar a insulina?', ramos:[
          { rotulo:'K < 3,3', cor:'perigo', texto:'*NÃO iniciar insulina.* Repor KCl 10–30 mEq/L primeiro',
            nota:'A insulina joga potássio para dentro da célula e pode causar arritmia fatal' },
          { rotulo:'K 3,3 – 5,2', cor:'ok', texto:'*Repor KCl 20–30 mEq/L* e iniciar a insulina',
            nota:'Reposição e insulina correm juntas' },
          { rotulo:'K > 5,2', texto:'*Não repor.* Iniciar a insulina e acompanhar',
            nota:'Redosar o potássio a cada 2 h — ele vai cair' }
        ]},
        { tipo:'passo', rotulo:'I — Insulina', texto:'*Insulina regular 0,1 U/kg/h em BIC*',
          nota:'Solução 1:1 — 1 mL (100 UI) em 100 mL de SF. Bolus inicial de 0,1–0,15 U/kg é opcional' },
        { tipo:'decisao', texto:'A glicemia está caindo 50–70 mg/dL por hora?', ramos:[
          { rotulo:'Cai de menos', texto:'*Dobrar* a velocidade de infusão da insulina' },
          { rotulo:'No alvo', cor:'ok', texto:'Manter a infusão e seguir monitorando' },
          { rotulo:'Cai demais', texto:'*Reduzir* para 0,02–0,05 U/kg/h e associar SG 5%' }
        ]},
        { tipo:'alerta', rotulo:'Ponto de virada', texto:'*Glicemia chegou a 200 mg/dL*',
          nota:'Associar *SG 5%* e MANTER a insulina — ela é o que fecha o ânion gap. Suspender agora deixa a acidose sem tratamento' },
        { tipo:'decisao', texto:'Critérios de resolução alcançados?', ramos:[
          { rotulo:'Ainda não', texto:'Manter insulina em BIC, volume e reposição de potássio',
            nota:'Reavaliar o fator precipitante — CAD que não fecha costuma ter infecção não tratada' },
          { rotulo:'Sim', cor:'ok', texto:'*Glicemia < 200 + pH > 7,3 + HCO3 > 18 + AG < 12*' }
        ]},
        { tipo:'passo', rotulo:'Transição', texto:'*Insulina regular 10 U SC e aguardar 1 hora* antes de desligar a bomba',
          nota:'Desligar a BIC sem cobertura subcutânea = a cetoacidose volta' },
        { tipo:'fim', rotulo:'Manutenção', texto:'*Esquema basal-bolus: 0,2–0,5 U/kg/dia*',
          nota:'50% NPH (⅔ manhã, ⅓ noite) + 50% regular (⅓ em cada refeição)' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Potássio < 3,3 mEq/L* — insulina agora causa arritmia. Repor primeiro, sempre.',
        'Rebaixamento do nível de consciência — pensar em edema cerebral, sobretudo em criança e adolescente.',
        'Instabilidade hemodinâmica ou sinais de sepse: o fator precipitante é mais grave que a própria CAD.',
        'pH ≤ 7,0 com bicarbonato < 10 — considerar bicarbonato, que fora disso não é indicado.',
        'Gestante com CAD: descompensa mais rápido e o limiar de UTI é menor.'
      ]},
      { tipo:'lista', titulo:'Exames iniciais', itens:[
        'Glicemia capilar e glicemia sérica.',
        '*Gasometria* (arterial ou venosa) com pH e bicarbonato.',
        'Eletrólitos — *potássio é o que muda a conduta imediata*; sódio, cloro, magnésio e fósforo.',
        'Cetonemia ou cetonúria.',
        'Ureia, creatinina, hemograma.',
        '*Caçar o fator precipitante:* urina I e urocultura, radiografia de tórax, ECG (IAM silencioso é gatilho clássico).'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'SF 0,9%', dose:'15–20 mL/kg na 1ª hora', via:'EV', obs:'Depois 100 mL/kg em 48 h. *Sódio corrigido normal ou alto → trocar para SF 0,45%.* Parcimônia no cardiopata.' },
        { droga:'Insulina regular (BIC)', dose:'0,1 U/kg/h', via:'EV', obs:'Diluir 1 mL (100 UI) em 100 mL de SF = *solução 1:1, 1 U/mL*. Bolus inicial de 0,1–0,15 U/kg é opcional. *Só iniciar com K > 3,3.*' },
        { droga:'KCl — se K < 3,3', dose:'10–30 mEq/L', via:'EV', obs:'*Adiar a insulina* até o potássio subir acima de 3,3.' },
        { droga:'KCl — se K 3,3–5,2', dose:'20–30 mEq/L', via:'EV', obs:'Repor junto com a insulina. Respeitar a velocidade máxima da via (ver *Hipocalemia*).' },
        { droga:'SG 5%', dose:'Associar quando a glicemia chegar a 200', via:'EV', obs:'Permite manter a insulina correndo até o ânion gap fechar, sem hipoglicemia.' },
        { droga:'Bicarbonato de sódio 8,4%', dose:'150 mL + SG 5% 850 mL — fazer 1–2 mL/kg lentamente', via:'EV', obs:'*Apenas se pH ≤ 7,0 e HCO3 < 10.* Não diluído causa hipernatremia e hiperosmolaridade.' },
        { droga:'Insulina regular SC (transição)', dose:'10 U', via:'SC', obs:'*Uma hora antes* de desligar a bomba.' }
      ]},
      { tipo:'tempo', titulo:'Linha do tempo', itens:[
        { quando:'0–60 min', o_que:'Confirmar o diagnóstico, *SF 15–20 mL/kg*, colher potássio e decidir sobre a insulina.' },
        { quando:'1/1 h',    o_que:'*Glicemia capilar* e ajuste da velocidade da insulina.' },
        { quando:'2/2–4/4 h', o_que:'Eletrólitos e gasometria; reposição de potássio conforme o valor.' },
        { quando:'Glicemia 200', o_que:'*Associar SG 5% e manter a insulina* até fechar o ânion gap.' },
        { quando:'Resolução', o_que:'Glicemia < 200 + pH > 7,3 + HCO3 > 18 + AG < 12: insulina SC e desligar a bomba 1 h depois.', fim:true }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Iniciar insulina com potássio < 3,3* — é o erro que mata nesta conduta.',
        '*Suspender a insulina quando a glicemia normaliza* — o que se trata é a acidose, não o número da glicemia. Associa-se glicose e mantém-se a insulina.',
        'Desligar a bomba sem antes fazer insulina subcutânea e esperar 1 hora.',
        'Bicarbonato de rotina — só com pH ≤ 7,0 e HCO3 < 10.',
        'Tratar a CAD e não procurar o fator precipitante.',
        'Hidratar sem cautela o cardiopata ou o renal crônico.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'CAD é internação, em *leito monitorizado* pela necessidade de insulina em bomba, glicemia horária e eletrólitos seriados. *UTI* para pH < 7,0, rebaixamento do nível de consciência, instabilidade hemodinâmica, distúrbio eletrolítico grave ou gestante. Só se cogita a transição para enfermaria depois dos critérios de resolução e da passagem para insulina subcutânea. Antes da alta: identificar por que descompensou, revisar técnica de aplicação e acesso à insulina, e garantir retorno — a maioria das reinternações por CAD é falta de acesso ao tratamento, não falha de conduta hospitalar.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A ordem é *V-I-P*, mas a *checagem do potássio* vem antes do I. Insulina em paciente hipocalêmico é arritmia.',
        'O alvo do tratamento é o *ânion gap*, não a glicemia. Por isso, quando a glicemia cai para 200, entra glicose e a insulina continua.',
        'CAD que não fecha o ânion gap quase sempre tem *infecção não tratada* por trás. Volte a procurar o foco.',
        'Dor abdominal intensa na CAD costuma ser da própria acidose e melhora com o tratamento — mas não descarte abdome cirúrgico no paciente que não melhora.',
        'Em diabético tipo 2 com hiperglicemia muito alta e sem cetose, pense em *estado hiperosmolar*: o déficit de volume é maior e a correção é mais lenta.'
      ]}
    ] },

  { id:'estado-hiperosmolar', titulo:'Estado hiperglicêmico hiperosmolar', categoria:'endocrino', gravidade:'emergencia',
    resumo:'Déficit de volume muito maior que na CAD; correção lenta da osmolaridade e do sódio.',
    tags:['ehh','hiperosmolar','osmolaridade','desidratacao','idoso','insulina'],
    fonte:'SBD — Diretrizes da Sociedade Brasileira de Diabetes',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Mortalidade maior que a da cetoacidose: idoso, desidratação extrema e rebaixamento.',
        'O déficit de volume é enorme, de 8 a 12 litros — a reposição é a base do tratamento.',
        'Sempre há um *gatilho*: infecção, infarto, AVC, medicação nova, abandono do tratamento.',
        'Corrigir a glicemia rápido demais causa edema cerebral.',
        'Osmolaridade acima de 320 mOsm/kg com glicemia acima de 600 e pouca cetose fecha o diagnóstico.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Glicemia acima de 600 mg/dL, desidratação intensa e rebaixamento, sem acidose importante' },
        { tipo:'passo', rotulo:'1º — Volume', texto:'*Cristaloide 15 a 20 mL/kg na 1ª hora*',
          nota:'É o que salva. Depois 250 a 500 mL/h, guiado pelo sódio corrigido' },
        { tipo:'passo', rotulo:'2º — Potássio', texto:'Dosar ANTES da insulina',
          nota:'Abaixo de 3,3: repor e ADIAR a insulina. Entre 3,3 e 5,2: repor 20 a 30 mEq/L. Acima de 5,2: não repor' },
        { tipo:'passo', rotulo:'3º — Insulina', texto:'*0,05 a 0,1 UI/kg/h em bomba*',
          nota:'Dose menor que na cetoacidose. Queda alvo de 50 a 70 mg/dL por hora' },
        { tipo:'passo', rotulo:'Quando chegar a 300', texto:'Associar soro glicosado e reduzir a insulina',
          nota:'Manter glicemia entre 250 e 300 até a osmolaridade e o estado mental normalizarem' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Procurar o gatilho*: hemograma, urina, radiografia de tórax, ECG e culturas' },
        { tipo:'fim', rotulo:'Destino', texto:'Terapia intensiva ou leito monitorizado; profilaxia de trombose' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Cloreto de sódio 0,9%', dose:'15 a 20 mL/kg na 1ª hora (cerca de 1000 a 1500 mL)', via:'EV', obs:'Depois 250 a 500 mL/h. Trocar por NaCl 0,45% se o sódio corrigido estiver alto.' },
        { droga:'Insulina regular', dose:'0,05 a 0,1 UI/kg/h', via:'EV', obs:'Bomba de infusão contínua. Dose menor que na cetoacidose.' },
        { droga:'Cloreto de potássio 19,1%', dose:'20 a 30 mEq por litro de soro', via:'EV', obs:'Sempre diluído, nunca em bolus. Monitorização cardíaca.' },
        { droga:'Glicose 5%', dose:'500 mL', via:'EV', obs:'Associar quando a glicemia chegar a 300 mg/dL.' },
        { droga:'Enoxaparina 40 mg', dose:'1 ampola', via:'SC', obs:'1x/dia — o risco trombótico é alto pela hiperosmolaridade.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Insulina antes de repor volume e de conhecer o potássio.',
        'Baixar a glicemia mais rápido que 70 mg/dL por hora: edema cerebral.',
        'Bicarbonato — não há acidose significativa aqui.',
        'Tratar a hiperglicemia e não procurar o gatilho.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Internação obrigatória, em leito monitorizado ou terapia intensiva. Critérios de resolução: osmolaridade abaixo de 315 mOsm/kg e *recuperação do estado mental*. A transição para insulina subcutânea exige sobreposição de 1 a 2 horas antes de desligar a bomba. Glicemia capilar de hora em hora; eletrólitos a cada 2 a 4 horas.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Sódio corrigido = sódio medido + 1,6 para cada 100 mg/dL de glicose acima de 100.',
        'O alvo do tratamento é o estado mental, não só o número da glicemia.',
        'Anote o balanço hídrico: é o dado mais importante da passagem.'
      ]}
    ] },

  { id:'hipoglicemia', titulo:'Hipoglicemia', categoria:'endocrino', gravidade:'emergencia',
    resumo:'Glicose EV, tiamina no etilista e o cuidado especial com sulfonilureia.',
    tags:['hipoglicemia','glicose 50','tiamina','sulfonilureia','glucagon'],
    fonte:'SBD — Diretrizes da Sociedade Brasileira de Diabetes',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Em etilista ou desnutrido, *tiamina antes ou junto da glicose* — sem isso, risco de Wernicke.',
        'Hipoglicemia por *sulfonilureia* recidiva por muitas horas: observação prolongada, nunca alta após um bolus.',
        'Hipoglicemia sem diabetes é sinal de doença: sepse, insuficiência hepática, adrenal, insulinoma, desnutrição.',
        'Hipoglicemia recorrente no diabético indica que o esquema está errado — corrigir e não só tratar.',
        'Neuroglicopenia prolongada causa dano permanente: trate rápido.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Glicemia abaixo de 70 mg/dL com sintomas, ou abaixo de 54 em qualquer situação' },
        { tipo:'decisao', texto:'O paciente está consciente e consegue engolir?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'*15 g de carboidrato de absorção rápida VO*',
            nota:'1 copo de suco, 3 colheres de açúcar em água, ou 15 g de glicose. Repetir em 15 min se necessário' },
          { rotulo:'Não', cor:'perigo', texto:'*GLICOSE 50% EV em bolus*',
            nota:'40 a 60 mL em veia calibrosa. No lactente, glicose a 10%, 2 a 5 mL/kg' }
        ]},
        { tipo:'passo', rotulo:'Se etilista', texto:'*TIAMINA 100 a 300 mg EV* antes ou junto da glicose' },
        { tipo:'passo', rotulo:'Reavaliar', texto:'Glicemia capilar em 15 minutos; repetir se ainda abaixo de 70' },
        { tipo:'passo', rotulo:'Depois de recuperar', texto:'*Alimentar com carboidrato complexo* para evitar recorrência' },
        { tipo:'decisao', texto:'Qual a causa?', ramos:[
          { rotulo:'Sulfonilueia ou insulina de longa duração', cor:'perigo',
            texto:'*Soro glicosado contínuo + observação de 12 a 24 h*',
            nota:'Considerar octreotide na hipoglicemia refratária por sulfonilureia' },
          { rotulo:'Insulina rápida, pulou refeição', texto:'Observar algumas horas e ajustar o esquema' },
          { rotulo:'Sem diabetes', texto:'*Investigar*: sepse, hepatopatia, adrenal, insulinoma, desnutrição' }
        ]},
        { tipo:'fim', rotulo:'Antes da alta', texto:'Revisar o esquema, a técnica de aplicação e ensinar a família a reconhecer e tratar' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Carboidrato rápido', dose:'15 g', via:'VO', obs:'1 copo de suco ou 3 colheres de açúcar em água. Repetir em 15 min se necessário.' },
        { droga:'Glicose 50%', dose:'40 a 60 mL (4 a 6 ampolas)', via:'EV', obs:'Em bolus, veia calibrosa — é esclerosante. Reavaliar em 15 minutos.' },
        { droga:'Glicose 10% (criança)', dose:'2 a 5 mL/kg', via:'EV', obs:'No lactente e na criança pequena; a 50% é hipertônica demais.' },
        { droga:'Tiamina', dose:'100 a 300 mg', via:'EV', obs:'Antes ou junto da glicose em etilista ou desnutrido.' },
        { droga:'Glicose 5% ou 10% contínua', dose:'Infusão contínua', via:'EV', obs:'Se sulfonilureia ou insulina de longa duração. Manter e monitorar por 12 a 24 h.' },
        { droga:'Glucagon', dose:'1 mg', via:'IM ou SC', obs:'Quando não há acesso venoso. Não funciona bem no etilista e no desnutrido (reserva de glicogênio baixa).' },
        { droga:'Octreotide', dose:'50 a 100 mcg', via:'SC', obs:'De 6/6 a 8/8 h, na hipoglicemia refratária por sulfonilureia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Glicose antes da tiamina no etilista.',
        'Dar alta após um único bolus em hipoglicemia por sulfonilureia.',
        'Glicose a 50% em veia periférica fina ou em criança pequena.',
        'Tratar o número e não corrigir a causa — o paciente volta na semana seguinte.',
        'Deixar de alimentar depois de recuperar a consciência.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na hipoglicemia por insulina rápida, com causa identificada (pulou refeição, exercício, dose errada), após recuperação completa, alimentação e algumas horas de observação, com o esquema revisto e a família orientada. *Internar* em hipoglicemia por sulfonilureia (observação de 12 a 24 horas no mínimo), hipoglicemia sem diabetes, recorrência, ou paciente sem rede de apoio.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Sulfonilureia é a armadilha: glibenclamida e glimepirida recidivam por muitas horas.',
        'Verifique a técnica de aplicação e o rodízio: lipodistrofia causa absorção errática.',
        'Ensine a família a usar o glucagon e a regra dos 15: 15 g de carboidrato, reavaliar em 15 minutos.'
      ]}
    ] },

  { id:'hiperglicemia-simples', titulo:'Hiperglicemia sem cetose no pronto-socorro', categoria:'endocrino', gravidade:'rotina',
    resumo:'O que realmente precisa de insulina na sala e como ajustar a alta sem criar hipoglicemia em casa.',
    tags:['hiperglicemia','glicemia alta','insulina regular','alta','ajuste'],
    fonte:'SBD — Diretrizes da Sociedade Brasileira de Diabetes',
    secoes:[
      { tipo:'alerta', titulo:'Antes de tratar o número', itens:[
        'Afastar *cetoacidose* e *estado hiperosmolar*: cetonúria, gasometria e osmolaridade.',
        'Hiperglicemia isolada em paciente assintomático e estável não é emergência — não precisa de insulina venosa.',
        'Procurar o gatilho: infecção, corticoide, abandono da medicação, dieta, estresse cirúrgico.',
        'Não dar alta sem revisar o esquema de casa e garantir o seguimento.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Glicemia elevada, paciente estável, sem rebaixamento' },
        { tipo:'passo', rotulo:'Primeiro', texto:'Cetonúria ou cetonemia, gasometria e eletrólitos',
          nota:'Cetose com acidose = cetoacidose. Osmolaridade alta com rebaixamento = hiperosmolar' },
        { tipo:'decisao', texto:'Há cetose ou hiperosmolaridade?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Seguir o protocolo específico*' },
          { rotulo:'Não', cor:'ok', texto:'Hiperglicemia simples — correção com insulina regular subcutânea' }
        ]},
        { tipo:'passo', rotulo:'Corrigir', texto:'*Insulina regular SC pela escala*, com hidratação oral',
          nota:'Reavaliar a glicemia em 1 hora após a aplicação' },
        { tipo:'passo', rotulo:'Ajustar', texto:'Rever a insulina basal e o hipoglicemiante de casa',
          nota:'Corrigir o pico sem ajustar o esquema garante o retorno na semana seguinte' },
        { tipo:'fim', rotulo:'Alta', texto:'Glicemia em queda, tolerando via oral, com esquema ajustado e retorno marcado' }
      ]},
      { tipo:'doses', titulo:'Escala de insulina regular subcutânea', itens:[
        { droga:'Glicemia até 180 mg/dL', dose:'Não aplicar', via:'—', obs:'Reavaliar em 4 horas.' },
        { droga:'181 a 200 mg/dL', dose:'2 UI', via:'SC', obs:'Reavaliar em 1 hora.' },
        { droga:'201 a 250 mg/dL', dose:'4 UI', via:'SC', obs:'Reavaliar em 1 hora.' },
        { droga:'251 a 300 mg/dL', dose:'6 UI', via:'SC', obs:'Reavaliar em 1 hora.' },
        { droga:'301 a 350 mg/dL', dose:'8 UI', via:'SC', obs:'Reavaliar em 1 hora.' },
        { droga:'351 a 400 mg/dL', dose:'10 UI', via:'SC', obs:'Reavaliar em 1 hora; reconsiderar cetoacidose.' },
        { droga:'Acima de 400 mg/dL', dose:'12 UI', via:'SC', obs:'Investigar cetoacidose e hiperosmolar antes de repetir.' },
        { droga:'Hidratação oral ou SF 0,9%', dose:'Conforme a volemia', via:'VO ou EV', obs:'Parte do tratamento; a hiperglicemia causa diurese osmótica.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Insulina venosa em hiperglicemia simples sem cetose nem hiperosmolaridade.',
        'Corrigir com escala e mandar embora sem ajustar o esquema de casa.',
        'Repetir a escala de hora em hora sem reavaliar: empilha insulina e causa hipoglicemia.',
        'Esquecer de comunicar hipoglicemia abaixo de 70 ou glicemia acima de 400 ao médico responsável.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta é a regra quando não há cetose nem hiperosmolaridade, o paciente aceita via oral e tem rede de apoio. *Internar* se houver cetoacidose, estado hiperosmolar, infecção que exige tratamento venoso, vômito impedindo a via oral, ou incapacidade de manejo domiciliar. Encaminhar à atenção primária ou à endocrinologia em 7 dias, com o registro da glicemia capilar.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Escala de correção é ponte, não tratamento: quem trata é a insulina basal ajustada.',
        'Pergunte a última dose tomada e se o paciente parou algum remédio — costuma ser a resposta.',
        'Verifique a técnica de aplicação e o rodízio dos locais: lipodistrofia explica muito descontrole.'
      ]}
    ] },

  { id:'crise-tireotoxica', titulo:'Crise tireotóxica', categoria:'endocrino', gravidade:'emergencia',
    resumo:'Escore de Burch-Wartofsky e a ordem obrigatória: betabloqueador, tionamida e só depois iodo.',
    tags:['crise tireotoxica','tempestade tireoidiana','propranolol','propiltiouracil','burch'],
    fonte:'SBEM — Sociedade Brasileira de Endocrinologia e Metabologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'É diagnóstico *clínico*: não espere o TSH para tratar. A mortalidade sem tratamento chega a 30%.',
        'Febre alta, taquiarritmia desproporcional, agitação ou rebaixamento, e disfunção gastrintestinal.',
        'Fibrilação atrial de início recente com insuficiência cardíaca em paciente jovem: pense em tireotoxicose.',
        'Sempre há um *gatilho*: infecção, cirurgia, trauma, parto, iodo, suspensão da medicação, cetoacidose.',
        'A ordem das drogas importa: tionamida antes do iodo.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Tireotoxicose com febre, taquicardia extrema, agitação e disfunção orgânica',
          nota:'Escala de Burch-Wartofsky ajuda, mas o tratamento é clínico e imediato' },
        { tipo:'passo', rotulo:'1º — Bloquear o efeito periférico', texto:'*PROPRANOLOL* — controla a taquicardia e reduz a conversão de T4 em T3',
          nota:'Cautela na insuficiência cardíaca: usar esmolol, que é titulável' },
        { tipo:'passo', rotulo:'2º — Bloquear a síntese', texto:'*Tionamida: propiltiouracil ou metimazol*',
          nota:'Propiltiouracil é preferido na crise, porque também bloqueia a conversão periférica' },
        { tipo:'passo', rotulo:'3º — Bloquear a liberação', texto:'*IODO — pelo menos 1 hora DEPOIS da tionamida*',
          nota:'Dar antes alimenta a glândula e piora a crise (efeito Jod-Basedow)' },
        { tipo:'passo', rotulo:'4º — Corticoide', texto:'*Hidrocortisona* — reduz a conversão periférica e cobre insuficiência adrenal relativa' },
        { tipo:'passo', rotulo:'Suporte', texto:'Resfriamento, hidratação, controle da arritmia e tratamento do gatilho',
          nota:'Antitérmico: paracetamol ou dipirona. *Nunca ácido acetilsalicílico*: desloca o hormônio da proteína' },
        { tipo:'fim', rotulo:'Destino', texto:'Terapia intensiva; endocrinologia acionada' }
      ]},
      { tipo:'doses', titulo:'Medicações — nesta ordem', itens:[
        { droga:'Propranolol', dose:'60 a 80 mg VO de 4/4 h, ou 0,5 a 1 mg EV lento', via:'VO ou EV', obs:'Primeira droga. Titular pela frequência cardíaca.' },
        { droga:'Esmolol', dose:'Bolus de 250 a 500 mcg/kg, depois 50 a 100 mcg/kg/min', via:'EV', obs:'Preferível se houver insuficiência cardíaca: meia-vida curta e titulável.' },
        { droga:'Propiltiouracil', dose:'500 a 1000 mg de ataque, depois 250 mg de 4/4 h', via:'VO ou SNG', obs:'Preferido na crise: bloqueia também a conversão periférica de T4 em T3.' },
        { droga:'Metimazol', dose:'20 a 25 mg de 4/4 h', via:'VO ou SNG', obs:'Alternativa. Preferido fora da crise e no 2º e 3º trimestres da gestação.' },
        { droga:'Solução de Lugol ou iodeto de potássio', dose:'5 a 10 gotas de 8/8 h', via:'VO', obs:'*Pelo menos 1 hora após a tionamida*. Nunca antes.' },
        { droga:'Hidrocortisona', dose:'100 mg de ataque, depois 50 a 100 mg de 8/8 h', via:'EV', obs:'Reduz conversão periférica e trata insuficiência adrenal relativa.' },
        { droga:'Paracetamol ou dipirona', dose:'1 a 2 g', via:'VO ou EV', obs:'Antitérmico. Resfriamento externo associado.' },
        { droga:'Cristaloide', dose:'Reposição generosa', via:'EV', obs:'A perda por febre, sudorese e diarreia é grande.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Iodo antes da tionamida*: fornece substrato e piora a crise.',
        '*Ácido acetilsalicílico* como antitérmico: desloca o hormônio da proteína carreadora e aumenta a fração livre.',
        'Esperar o resultado do TSH para começar o tratamento.',
        'Betabloqueador em dose plena sem cautela na insuficiência cardíaca descompensada.',
        'Tratar a crise e não procurar o gatilho.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Terapia intensiva. Investigar e tratar o fator precipitante em paralelo — infecção é o mais comum. Endocrinologia acionada desde o início. Após a estabilização, definir o tratamento definitivo: tionamida prolongada, iodo radioativo ou tireoidectomia. Vigiar agranulocitose e hepatotoxicidade pela tionamida: orientar o paciente a procurar atendimento se tiver febre e dor de garganta.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A ordem é: betabloqueador, tionamida, iodo (1 hora depois), corticoide. Decore essa sequência.',
        'Fibrilação atrial em jovem sem cardiopatia pede TSH.',
        'Escreva no prontuário o horário de cada droga: a separação entre tionamida e iodo é crítica.'
      ]}
    ] },

  { id:'coma-mixedematoso', titulo:'Coma mixedematoso', categoria:'endocrino', gravidade:'emergencia',
    resumo:'Hipotermia, bradicardia e hiponatremia no hipotireoideo; corticoide antes da levotiroxina.',
    tags:['mixedema','hipotireoidismo','levotiroxina','hipotermia','hidrocortisona'],
    fonte:'SBEM — Sociedade Brasileira de Endocrinologia e Metabologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'A tríade é *hipotermia + rebaixamento + hipoventilação com hipercapnia*.',
        'Mortalidade alta mesmo com tratamento: tratar na suspeita, sem esperar o TSH.',
        '*Corticoide ANTES do hormônio tireoidiano*: se houver insuficiência adrenal associada, o hormônio tireoidiano precipita crise adrenal.',
        'Hiponatremia, hipoglicemia e bradicardia acompanham o quadro.',
        'Sempre há um gatilho: infecção, frio, cirurgia, sedativo, suspensão da levotiroxina.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Hipotermia, rebaixamento e hipoventilação em paciente hipotireóideo ou com cicatriz cervical',
          nota:'Pele seca e infiltrada, macroglossia, edema periorbitário, reflexos com fase de relaxamento lenta' },
        { tipo:'passo', rotulo:'Via aérea', texto:'*Intubar precocemente* — a hipoventilação é regra e progride',
          nota:'Cuidado com sedativos: a metabolização está muito lenta' },
        { tipo:'passo', rotulo:'1º — CORTICOIDE', texto:'*Hidrocortisona 100 mg EV, ANTES do hormônio tireoidiano*',
          nota:'Colher cortisol antes, se possível, mas não atrasar' },
        { tipo:'passo', rotulo:'2º — Hormônio', texto:'*Levotiroxina EV em dose de ataque*',
          nota:'200 a 400 mcg EV, depois 50 a 100 mcg/dia. Dose menor no idoso e no coronariopata' },
        { tipo:'passo', rotulo:'Suporte', texto:'Reaquecimento *passivo*, corrigir hipoglicemia e hiponatremia, tratar o gatilho',
          nota:'Reaquecimento ativo externo causa vasodilatação e colapso' },
        { tipo:'fim', rotulo:'Destino', texto:'Terapia intensiva; endocrinologia acionada' }
      ]},
      { tipo:'doses', titulo:'Medicações — nesta ordem', itens:[
        { droga:'Hidrocortisona', dose:'100 mg de ataque, depois 50 a 100 mg de 8/8 h', via:'EV', obs:'SEMPRE antes do hormônio tireoidiano. Colher cortisol antes se der.' },
        { droga:'Levotiroxina', dose:'200 a 400 mcg de ataque, depois 50 a 100 mcg/dia', via:'EV', obs:'Dose de ataque menor (100 a 200 mcg) em idoso e coronariopata.' },
        { droga:'Liotironina (T3)', dose:'5 a 20 mcg de ataque, depois 2,5 a 10 mcg de 8/8 h', via:'EV', obs:'Alguns protocolos associam ao T4 no caso grave. Pouco disponível.' },
        { droga:'Glicose 50%', dose:'40 mL', via:'EV', obs:'Se hipoglicemia — frequente.' },
        { droga:'Cristaloide com cautela', dose:'Reposição cuidadosa', via:'EV', obs:'Hiponatremia costuma ser dilucional: restringir água livre, não repor sódio agressivamente.' },
        { droga:'Antibiótico empírico', dose:'Conforme o foco', via:'EV', obs:'Infecção é o gatilho mais comum e pode cursar sem febre — o paciente está hipotérmico.' },
        { droga:'Reaquecimento passivo', dose:'Cobertores', via:'—', obs:'Passivo apenas. O ativo externo causa vasodilatação e colapso circulatório.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Hormônio tireoidiano antes do corticoide*: precipita crise adrenal.',
        'Reaquecimento ativo externo agressivo.',
        'Sedativos e opioides em dose habitual: a metabolização está muito lenta.',
        'Corrigir a hiponatremia com salina hipertônica sem indicação clara.',
        'Esperar o TSH para iniciar o tratamento.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Terapia intensiva sempre. Procurar e tratar o gatilho, sobretudo infecção — que pode cursar sem febre e sem leucocitose neste paciente. Coletar TSH, T4 livre e cortisol antes de tratar, mas nunca atrasar o tratamento por causa deles. Após a estabilização, ajustar a levotiroxina oral e investigar a causa do hipotireoidismo e da má adesão.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Cicatriz cervical de tireoidectomia em paciente comatoso e hipotérmico fecha a suspeita.',
        'Hipotermia sem exposição ao frio é um sinal forte.',
        'Anote a ordem e o horário: corticoide primeiro, hormônio depois.'
      ]}
    ] },

  { id:'insuficiencia-adrenal', titulo:'Insuficiência adrenal aguda', categoria:'endocrino', gravidade:'emergencia',
    resumo:'Hipotensão que não responde a volume + hiponatremia e hipercalemia: hidrocortisona sem esperar exame.',
    tags:['insuficiencia adrenal','addison','hidrocortisona','crise adrenal','corticoide'],
    fonte:'SBEM — Sociedade Brasileira de Endocrinologia e Metabologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Choque que não responde a volume nem a vasopressor*: pense em crise adrenal.',
        'Hipotensão + hiponatremia + hipercalemia + hipoglicemia é a combinação clássica.',
        'Não espere o cortisol para tratar: colha e trate.',
        'Paciente em corticoide crônico que suspendeu, ou que passou por estresse (infecção, cirurgia, trauma) sem dose de estresse.',
        'Hiperpigmentação de pregas, cicatrizes e mucosas indica insuficiência primária (Addison).'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Hipotensão refratária, náusea, vômito, dor abdominal, fraqueza e rebaixamento' },
        { tipo:'passo', rotulo:'Colher e tratar', texto:'*Colher cortisol e ACTH — e administrar o corticoide na sequência*',
          nota:'Não atrase o tratamento esperando o resultado' },
        { tipo:'passo', rotulo:'1º — Corticoide', texto:'*HIDROCORTISONA 100 mg EV em bolus*',
          nota:'Depois 50 mg de 6/6 h, ou 200 mg/dia em infusão contínua' },
        { tipo:'passo', rotulo:'2º — Volume', texto:'*Cristaloide com glicose* — 1000 mL na primeira hora',
          nota:'Soro fisiológico com glicose corrige a hipovolemia, a hiponatremia e a hipoglicemia' },
        { tipo:'passo', rotulo:'3º — Corrigir', texto:'Hipoglicemia, hipercalemia e hiponatremia' },
        { tipo:'passo', rotulo:'4º — Gatilho', texto:'Procurar e tratar: infecção é o mais comum' },
        { tipo:'fim', rotulo:'Depois', texto:'Se usou dexametasona, o teste de estimulação com ACTH ainda pode ser feito; com hidrocortisona, não' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Hidrocortisona', dose:'100 mg em bolus, depois 50 mg de 6/6 h', via:'EV', obs:'Ou 200 mg/dia em infusão contínua. Nessa dose, a ação mineralocorticoide já está coberta.' },
        { droga:'Dexametasona', dose:'4 mg', via:'EV', obs:'Alternativa quando se quer preservar o teste de estimulação com ACTH — não interfere na dosagem de cortisol.' },
        { droga:'Cloreto de sódio 0,9% com glicose', dose:'1000 mL na 1ª hora', via:'EV', obs:'Depois conforme a resposta. Corrige volume, sódio e glicemia ao mesmo tempo.' },
        { droga:'Glicose 50%', dose:'40 mL', via:'EV', obs:'Se hipoglicemia sintomática.' },
        { droga:'Tratamento da hipercalemia', dose:'Conforme o valor e o ECG', via:'EV', obs:'Costuma melhorar só com corticoide e volume; gluconato de cálcio se houver alteração no ECG.' },
        { droga:'Fludrocortisona', dose:'0,05 a 0,2 mg/dia', via:'VO', obs:'Na manutenção da insuficiência primária, depois da fase aguda.' },
        { droga:'Antibiótico empírico', dose:'Conforme o foco', via:'EV', obs:'Se houver suspeita de infecção como gatilho.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar o cortisol para tratar: a crise adrenal mata em horas.',
        'Usar só vasopressor no choque refratário sem pensar em adrenal.',
        'Suspender abruptamente corticoide crônico — é causa iatrogênica frequente.',
        'Esquecer a dose de estresse em paciente corticodependente que vai ser operado ou está infectado.',
        'Corrigir a hiponatremia rápido demais.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Toda crise adrenal interna, em leito monitorizado. Depois da fase aguda, reduzir a hidrocortisona progressivamente até a dose de manutenção e associar fludrocortisona na insuficiência primária. Antes da alta: prescrever *dose de estresse* por escrito, orientar a nunca suspender o corticoide, e recomendar cartão ou pulseira de identificação. Encaminhar à endocrinologia.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Dose de estresse: dobrar ou triplicar a dose habitual em doença febril; hidrocortisona 100 mg EV em cirurgia ou doença grave.',
        'Pergunte sempre sobre corticoide de uso contínuo — inclusive tópico, inalatório e infiltração.',
        'Choque que não sobe com noradrenalina: teste a hidrocortisona.'
      ]}
    ] },

  /* ======================= 07 · NEFRO E ELETRÓLITOS ======================= */
  { id:'lesao-renal-aguda', titulo:'Lesão renal aguda', categoria:'nefro', gravidade:'urgencia',
    resumo:'Classificar em pré-renal, renal e pós-renal, suspender nefrotóxicos e ajustar doses.',
    tags:['lra','kdigo','creatinina','oliguria','nefrotoxico','ajuste renal'],
    fonte:'SBN — Sociedade Brasileira de Nefrologia / KDIGO',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — indicações de diálise de urgência', itens:[
        '*A*cidose refratária ao tratamento clínico.',
        '*E*letrólitos: hipercalemia grave ou refratária.',
        '*I*ntoxicação por substância dialisável.',
        '*O*veroad: hipervolemia refratária a diurético, com edema agudo.',
        '*U*remia sintomática: pericardite, encefalopatia, sangramento.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Aumento da creatinina ou queda do débito urinário',
          nota:'KDIGO: creatinina 1,5 vez o basal em 7 dias, ou aumento de 0,3 mg/dL em 48 h, ou diurese abaixo de 0,5 mL/kg/h por 6 h' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Descartar obstrução* — bexigoma, globo vesical, ultrassom de vias urinárias',
          nota:'Pós-renal é a causa mais fácil de reverter. Sondar se houver retenção' },
        { tipo:'decisao', texto:'Qual o padrão?', ramos:[
          { rotulo:'Pré-renal', cor:'ok', texto:'*Hipovolemia, hipotensão, sepse, insuficiência cardíaca*',
            nota:'Ureia/creatinina acima de 40; sódio urinário baixo; FENa abaixo de 1%. Responde a volume' },
          { rotulo:'Renal (intrínseca)', texto:'Necrose tubular aguda, nefrite intersticial, glomerulonefrite',
            nota:'Ureia/creatinina abaixo de 15; sódio urinário alto; cilindros no sedimento' },
          { rotulo:'Pós-renal', texto:'*Obstrução* — desobstruir resolve' }
        ]},
        { tipo:'passo', rotulo:'Sempre', texto:'*Suspender nefrotóxicos*: AINE, IECA, BRA, contraste, aminoglicosídeo, vancomicina',
          nota:'E ajustar a dose de todas as medicações pela função renal' },
        { tipo:'passo', rotulo:'Otimizar', texto:'Volume, pressão de perfusão, e tratar a causa de base' },
        { tipo:'fim', rotulo:'Reavaliar', texto:'Débito urinário horário, creatinina, potássio e gasometria seriados' }
      ]},
      { tipo:'doses', titulo:'Manejo', itens:[
        { droga:'Cristaloide', dose:'Prova de volume de 500 mL, reavaliando', via:'EV', obs:'Se pré-renal. Ringer lactato é preferível ao SF em grandes volumes.' },
        { droga:'Furosemida', dose:'40 a 80 mg', via:'EV', obs:'SOMENTE na hipervolemia. Não previne nem trata lesão renal — só ajuda no volume.' },
        { droga:'Sondagem vesical', dose:'—', via:'—', obs:'Se houver retenção urinária; permite o controle horário da diurese.' },
        { droga:'Gluconato de cálcio 10%', dose:'10 a 20 mL', via:'EV', obs:'Se hipercalemia com alteração no ECG.' },
        { droga:'Insulina regular + glicose', dose:'10 UI + 4 ampolas de glicose 50%', via:'EV', obs:'Desloca o potássio para dentro da célula.' },
        { droga:'Bicarbonato de sódio', dose:'1 a 2 mEq/kg', via:'EV', obs:'Se acidose grave com pH abaixo de 7,1 a 7,2.' },
        { droga:'Suspender nefrotóxicos', dose:'—', via:'—', obs:'AINE, IECA, BRA, contraste, aminoglicosídeo, vancomicina, anfotericina.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Furosemida para "fazer o rim funcionar": não previne, não trata e pode piorar a hipovolemia.',
        'Dopamina em dose renal: abandonada, sem benefício.',
        'Contraste sem necessidade real e sem hidratação prévia.',
        'Manter IECA, BRA ou AINE durante a lesão aguda.',
        'Esquecer de ajustar a dose dos antibióticos pela função renal.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Interna a maioria, para investigação e correção. *Acionar a nefrologia* nas indicações de diálise (AEIOU), na lesão renal sem causa clara, na suspeita de glomerulonefrite ou nefrite intersticial, e na necessidade de biópsia. Alta possível na lesão pré-renal leve, revertida com hidratação na própria unidade, com creatinina em queda e retorno garantido em poucos dias.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A primeira pergunta é sempre: tem bexigoma? Palpe e faça o ultrassom.',
        'Peça a creatinina *basal* do paciente: sem ela, não dá para estadiar.',
        'Registre a diurese horária — é o dado que mais orienta a conduta.'
      ]}
    ] },

  { id:'indicacao-dialise', titulo:'Indicação de diálise de urgência', categoria:'nefro', gravidade:'emergencia',
    resumo:'As indicações clássicas (AEIOU) e como argumentar a solicitação com o nefrologista.',
    tags:['dialise','hemodialise','aeiou','uremia','anuria','acidose refrataria'],
    fonte:'SBN — Sociedade Brasileira de Nefrologia',
    secoes:[
      { tipo:'alerta', titulo:'AEIOU — as indicações de urgência', itens:[
        '*A*cidose metabólica grave e refratária ao tratamento clínico (pH abaixo de 7,1).',
        '*E*letrólitos: hipercalemia grave (acima de 6,5) ou refratária, com alteração no ECG.',
        '*I*ntoxicação por substância dialisável: lítio, metanol, etilenoglicol, salicilato, metformina.',
        '*O*verload: hipervolemia refratária a diurético, com edema agudo de pulmão.',
        '*U*remia sintomática: pericardite, encefalopatia, sangramento urêmico.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Lesão renal aguda ou doença renal crônica agudizada' },
        { tipo:'passo', rotulo:'Avaliar', texto:'Gasometria, potássio, ureia, creatinina, ECG, ausculta e volemia',
          nota:'A decisão é clínica, não por um número isolado' },
        { tipo:'decisao', texto:'Há alguma indicação do AEIOU?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Acionar a nefrologia AGORA* e preparar acesso',
            nota:'Cateter de duplo lúmen em veia jugular interna direita, femoral ou subclávia' },
          { rotulo:'Não', texto:'Otimização clínica com reavaliação frequente' }
        ]},
        { tipo:'passo', rotulo:'Enquanto espera', texto:'*Tratamento clínico das complicações*',
          nota:'Hipercalemia: cálcio, insulina com glicose, beta-2. Acidose: bicarbonato. Hipervolemia: furosemida' },
        { tipo:'passo', rotulo:'Escolher a modalidade', texto:'Hemodiálise intermitente no estável; contínua no instável',
          nota:'Diálise peritoneal é opção em serviços sem hemodiálise, sobretudo em criança' },
        { tipo:'fim', rotulo:'Depois', texto:'Reavaliar a necessidade de diálise a cada sessão — nem sempre é definitiva' }
      ]},
      { tipo:'doses', titulo:'Medidas de ponte enquanto se organiza a diálise', itens:[
        { droga:'Gluconato de cálcio 10%', dose:'10 a 20 mL', via:'EV', obs:'Em 2 a 5 min, se hipercalemia com alteração no ECG. Estabiliza a membrana; não baixa o potássio.' },
        { droga:'Insulina regular + glicose 50%', dose:'10 UI + 40 a 100 mL', via:'EV', obs:'Desloca o potássio. Início em 15 min, dura 4 a 6 h. Monitorar a glicemia por 6 horas.' },
        { droga:'Beta-2 inalatório', dose:'Salbutamol 20 gotas em 3 mL de SF', via:'INAL', obs:'Efeito aditivo à insulina no deslocamento do potássio.' },
        { droga:'Bicarbonato de sódio 8,4%', dose:'1 a 2 mEq/kg', via:'EV', obs:'Se acidose grave. Cuidado com sobrecarga de sódio e volume.' },
        { droga:'Furosemida', dose:'40 a 120 mg', via:'EV', obs:'Se houver diurese residual e hipervolemia.' },
        { droga:'Poliestirenossulfonato de cálcio', dose:'30 g', via:'VO ou retal', obs:'Ação lenta, de horas. Não é medida de urgência.' },
        { droga:'Cateter de duplo lúmen', dose:'—', via:'—', obs:'Jugular interna direita é a primeira escolha; femoral em urgência; evitar subclávia em quem pode precisar de fístula.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar a creatinina atingir um número para indicar diálise: a decisão é clínica.',
        'Puncionar veia subclávia em candidato a fístula futura — estenose compromete o acesso definitivo.',
        'Confiar em poliestirenossulfonato como tratamento de urgência da hipercalemia.',
        'Deixar de tratar clinicamente enquanto se aguarda a diálise.',
        'Esquecer de checar acesso vascular prévio em paciente já dialítico.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo paciente com indicação de diálise de urgência interna, em leito monitorizado. Acionar a nefrologia desde o reconhecimento e, se o serviço não dispuser de hemodiálise, iniciar a regulação da transferência em paralelo ao tratamento clínico. Em paciente já em programa dialítico, verificar o dia da última sessão e o acesso disponível.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Anote na passagem: última sessão de diálise, tipo de acesso e peso seco.',
        'Nunca puncione nem meça pressão no braço da fístula.',
        'Hipercalemia com QRS alargado é a emergência mais tempo-dependente daqui: cálcio primeiro.'
      ]}
    ] },

  { id:'hipercalemia', titulo:'Hipercalemia', categoria:'nefro', gravidade:'emergencia',
    resumo:'ECG primeiro, gluconato de cálcio para estabilizar a membrana, depois desloca e depois remove.',
    tags:['hipercalemia','potassio alto','gluconato de calcio','insulina glicose','onda t apiculada','sorcal','polarizante'],
    fonte:'SBN — Recomendações sobre distúrbios do potássio · Manual de Cardiologia na Prática 3.0, p. 81–92 · PS Zerado, p. 53',
    ficha:[
      { rotulo:'Quando pensar', valor:'Potássio sérico *> 5,5 mEq/L*. Muitas vezes achado de exame em DRC, LRA ou usuário de IECA/espironolactona.' },
      { rotulo:'Prioridade',    valor:'*ECG imediato.* É ele, e não o número do potássio, que define a urgência.' },
      { rotulo:'Meta',          valor:'Membrana estabilizada, potássio deslocado para dentro da célula e depois removido do corpo.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*Potássio > 5,5 mEq/L*' },
        { tipo:'passo', rotulo:'Primeiro de tudo', texto:'*ECG IMEDIATO* + monitorização',
          nota:'Onda T apiculada → P some → QRS alarga → onda sinusoidal (pré-parada)' },
        { tipo:'decisao', texto:'ECG alterado, ou K ≥ 6,5, ou fraqueza muscular?', ramos:[
          { rotulo:'Não — DRC assintomático', texto:'*Redução lenta*, em 6 a 12 h',
            nota:'K < 6,5, ECG normal, sem sintoma' },
          { rotulo:'Sim', cor:'perigo', texto:'*URGÊNCIA HIPERCALÊMICA*',
            nota:'Também entra aqui: K > 5,5 com DRC, LRA, rabdomiólise ou sangramento intestinal' }
        ]},
        { tipo:'passo', rotulo:'1 · Estabilizar', texto:'*Gluconato de cálcio 10%* — 1 ampola + SG 5% 100 mL em 5 min',
          nota:'Efeito dura 30–60 min. Se o ECG continuar alterado, repetir após 5 min. *Não baixa o potássio*' },
        { tipo:'passo', rotulo:'2 · Deslocar', texto:'*Polarizante* (insulina regular 10 UI + glicose 50 g) em 30–60 min + *salbutamol* inalatório',
          nota:'Dura 4 h, repetir de 2/2 a 4/4 h. *Glicemia capilar de 1/1 h por 6 h.* Se glicemia > 250, insulina sem glicose' },
        { tipo:'passo', rotulo:'3 · Remover', texto:'*Furosemida 40–60 mg EV* · hemodiálise se anúria ou refratário',
          nota:'Hipovolêmico: repor volume antes. Resina de troca e bicarbonato são pouco eficazes' },
        { tipo:'alerta', rotulo:'Erro clássico', texto:'*Parar no passo 1 ou 2*',
          nota:'O gluconato só protege o coração e a polarizante só empurra o potássio para dentro da célula. Sem remoção, ele volta a subir em horas' },
        { tipo:'fim', rotulo:'Destino', texto:'*Leito monitorizado* + suspender IECA, BRA, espironolactona e AINE',
          nota:'Potássio seriado e avaliação da nefrologia para diálise' }
      ]},
      { tipo:'alerta', titulo:'Red flags — urgência hipercalêmica', itens:[
        '*Potássio ≥ 6,5 mEq/L.*',
        '*Alteração no ECG* — em qualquer nível de potássio.',
        '*Fraqueza muscular.*',
        'K > 5,5 associado a *DRC, LRA, rabdomiólise ou sangramento intestinal*.',
        'Bradicardia ou arritmia nova: pode ser a primeira manifestação, e a próxima é a parada.'
      ]},
      { tipo:'lista', titulo:'Alterações no ECG, em ordem de progressão', itens:[
        '*Onda T alta, apiculada e simétrica* — a primeira alteração.',
        'Achatamento e desaparecimento da onda P.',
        'Alargamento progressivo do QRS.',
        'Padrão de onda sinusoidal — *pré-parada*.',
        'Bradiarritmia e bloqueios.',
        'ECG normal *não exclui* hipercalemia grave: a progressão pode ser abrupta.'
      ]},
      { tipo:'texto', titulo:'Os três passos do tratamento', conteudo:'A ordem é sempre a mesma e cada passo faz uma coisa diferente. *1) Estabilizar a membrana* — gluconato de cálcio; protege o coração mas *não baixa o potássio*. *2) Deslocar o potássio para dentro da célula* — solução polarizante, beta-2 agonista; efeito rápido e temporário. *3) Remover o potássio do corpo* — furosemida, resina de troca, hemodiálise; é o único passo que resolve de verdade. Fazer só o passo 1 ou só o 2 é garantir que o potássio volte a subir em poucas horas.' },
      { tipo:'doses', titulo:'1 · Estabilizar a membrana', itens:[
        { droga:'Gluconato de cálcio 10%', dose:'1 ampola (10 mL) + SG 5% 100 mL', via:'EV', obs:'*Infundir em 5 min.* Indicado se ECG alterado ou K ≥ 6,5. Efeito dura *30–60 min*; se a alteração no ECG persistir, *repetir após 5 min*. Não reduz o potássio.' }
      ]},
      { tipo:'doses', titulo:'2 · Deslocar para dentro da célula', itens:[
        { droga:'Solução polarizante', dose:'Insulina regular 10 UI + glicose 50 g', via:'EV', obs:'Glicose 50% 100 mL, ou SG 10% 500 mL, ou SG 5% 1000 mL + *insulina regular 10 UI em bureta*. Infundir em 30–60 min. *Efeito dura 4 h*; pode repetir de 2/2 h a 4/4 h. *Manter glicemia capilar de 1/1 h por 6 h.*' },
        { droga:'Polarizante com glicemia > 250', dose:'Insulina regular 10 UI isolada', via:'EV', obs:'*Não associar glicose* — seguir com SG 5% a 100–150 mL/h.' },
        { droga:'Salbutamol', dose:'2–4 mL (5 mg/mL) + 5 mL de SF', via:'INAL', obs:'Nebulização. *Pico de ação em 90 min.* Efeito aditivo ao da polarizante.' }
      ]},
      { tipo:'doses', titulo:'3 · Remover do corpo', itens:[
        { droga:'Furosemida', dose:'2–3 ampolas (40–60 mg)', via:'EV', obs:'*Hipovolêmico:* repor volume com SF e então furosemida. *Euvolêmico:* furosemida e repor SF para manter balanço hídrico zero.' },
        { droga:'Poliestirenossulfonato de cálcio (Sorcal)', dose:'30 g em 100 mL de manitol 10% ou água', via:'VO', obs:'Até de 4/4 h. *Menos eficaz e de ação lenta* — não conte com ele na urgência.' },
        { droga:'Bicarbonato de sódio', dose:'Conforme acidose', via:'EV', obs:'*Pouco eficaz* isoladamente. Reservado a quem tem acidose metabólica associada.' },
        { droga:'Hemodiálise', dose:'—', via:'—', obs:'*Tratamento definitivo* na hipercalemia refratária, na anúria ou quando há urgência dialítica.' }
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        '*ECG imediato* e monitorização contínua.',
        'ECG alterado ou K ≥ 6,5: *gluconato de cálcio agora*.',
        'Em seguida, *redução rápida*: solução polarizante + beta-2 inalatório.',
        'Depois, *remoção*: furosemida se houver diurese; avaliar diálise se não houver.',
        '*Suspender tudo que retém potássio* — IECA, BRA, espironolactona, AINE, suplementos.',
        'Procurar a causa: LRA, DRC agudizada, rabdomiólise, acidose, hemólise, sangramento digestivo.',
        'Repetir o potássio e o ECG após cada ciclo de tratamento.'
      ]},
      { tipo:'texto', titulo:'Pseudo-hipercalemia', conteudo:'Antes de tratar agressivamente um potássio alto em paciente *assintomático e com ECG normal*, considere a coleta: garroteamento prolongado, punção difícil com hemólise, contagem muito alta de plaquetas ou leucócitos falseiam o resultado. *Recolha a amostra* — mas nunca deixe de tratar o paciente sintomático ou com ECG alterado enquanto espera a segunda dosagem.' },
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Tratar o número e não olhar o ECG.',
        'Achar que o gluconato de cálcio baixou o potássio — ele *só estabiliza a membrana*.',
        'Parar no passo 2: sem remoção, o potássio volta a subir em horas.',
        'Confiar em resina de troca como tratamento da urgência: é lenta e pouco eficaz.',
        'Esquecer de suspender IECA, BRA, espironolactona e AINE.',
        'Fazer polarizante sem monitorar glicemia capilar — a hipoglicemia tardia é frequente e perigosa.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'*Urgência hipercalêmica* (K ≥ 6,5, ECG alterado, fraqueza, ou K > 5,5 com DRC/LRA/rabdomiólise/sangramento) fica em *leito monitorizado*, com potássio seriado, e avaliação de nefrologia para diálise. Paciente com K < 6,5, assintomático, ECG normal e DRC conhecida pode ter a redução feita *lentamente, em 6 a 12 horas*, sem a bateria de urgência — mas com controle laboratorial garantido e ajuste das medicações antes da alta.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        '*O ECG manda mais que o número.* K de 6,0 com QRS alargado é mais urgente que K de 7,0 com ECG normal.',
        'Escreva a hora do gluconato no prontuário: o efeito dura 30–60 min, e é fácil perder essa janela no corre da sala.',
        'Glicemia capilar de 1/1 h por 6 horas depois da polarizante. A hipoglicemia aparece quando todo mundo já esqueceu do caso.',
        'Bradicardia inexplicada em renal crônico é hipercalemia até prova em contrário — cálcio antes de atropina.'
      ]}
    ] },

  { id:'hipocalemia', titulo:'Hipocalemia', categoria:'nefro', gravidade:'urgencia',
    resumo:'Velocidade máxima de reposição por via, e por que corrigir o magnésio junto.',
    tags:['hipocalemia','potassio baixo','kcl','magnesio','arritmia','onda u'],
    fonte:'SBN — Recomendações sobre distúrbios do potássio · Manual de Cardiologia na Prática 3.0, p. 95–102 · PS Zerado, p. 54',
    ficha:[
      { rotulo:'Quando pensar', valor:'Potássio *< 3,5 mEq/L*. Suspeitar em quem usa diurético, vomita, tem diarreia ou está em tratamento de cetoacidose.' },
      { rotulo:'Prioridade',    valor:'*Sempre repor magnésio junto* — sem corrigir o magnésio, o potássio não sobe.' },
      { rotulo:'Meta',          valor:'Potássio acima de 3,5 mEq/L, respeitando a velocidade máxima de infusão por via.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*Potássio < 3,5 mEq/L*' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Dosar magnésio*',
          nota:'ECG se K < 3,0, houver sintoma ou uso de digoxina. Procurar onda U proeminente' },
        { tipo:'decisao', texto:'Qual a gravidade?', ramos:[
          { rotulo:'Leve — 3,0 a 3,5', texto:'*Via oral*: xarope de KCl 6% 20 mL de 6/6 h a 8/8 h',
            nota:'Repor 40 a 100 mEq por dia. Ou KCl 600 mg, 2 comprimidos' },
          { rotulo:'< 3,0, sintoma ou ECG', cor:'perigo', texto:'*Endovenosa E oral, associadas*',
            nota:'Associar as duas vias encurta bastante o tempo de correção' }
        ]},
        { tipo:'decisao', texto:'Qual acesso está disponível?', ramos:[
          { rotulo:'Periférico', texto:'*10 mEq/hora* — 2 ampolas de KCl 19,1% + SF 1000 mL, cerca de 5 h' },
          { rotulo:'Central', texto:'*20 mEq/hora* — 1 ampola + SF 100 mL, cerca de 2 h',
            nota:'Velocidade maior exige via central e monitorização' }
        ]},
        { tipo:'alerta', rotulo:'Nunca', texto:'*Diluir KCl em soro glicosado* — e nunca em bolus',
          nota:'A glicose estimula insulina, que joga mais potássio para dentro da célula. Diluir sempre em soro fisiológico' },
        { tipo:'decisao', texto:'O potássio não sobe apesar da reposição?', ramos:[
          { rotulo:'Quase sempre', cor:'ok', texto:'*É hipomagnesemia* — reponha o magnésio e o potássio sobe',
            nota:'Sulfato de magnésio 10%, 2 ampolas + SG 5% 100 mL em 2–5 min' }
        ]},
        { tipo:'fim', rotulo:'Investigar a causa', texto:'Diurético · vômito · diarreia · alcalose · insulina · beta-2',
          nota:'Na cetoacidose o potássio *cai* quando a insulina começa — por isso se checa antes de iniciar' }
      ]},
      { tipo:'passos', titulo:'Quando suspeitar', itens:[
        'Fraqueza muscular, câimbra, mialgia; nos casos graves, paralisia flácida.',
        'Íleo paralítico, distensão abdominal e constipação.',
        'Palpitação e arritmia — sobretudo em quem usa digoxina.',
        'Poliúria e polidipsia.',
        '*Causas frequentes:* diurético, vômito, diarreia, uso de insulina, beta-2 agonista, alcalose, hipomagnesemia, tratamento de cetoacidose.'
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Arritmia ventricular ou paciente em uso de *digoxina* — a hipocalemia potencializa a intoxicação digitálica.',
        'Fraqueza generalizada ou paralisia — risco de acometimento da musculatura respiratória.',
        'K < 2,5 mEq/L.',
        'Alteração no ECG.',
        '*Hipomagnesemia associada* — presente na maioria dos casos refratários.'
      ]},
      { tipo:'lista', titulo:'Alterações no ECG', itens:[
        '*Achatamento e inversão da onda T.*',
        '*Onda U proeminente* — o achado mais característico.',
        'Infradesnivelamento do segmento ST.',
        'Prolongamento do intervalo QT (favorece torsades).',
        'Extrassístoles e arritmias ventriculares.'
      ]},
      { tipo:'doses', titulo:'Hipocalemia leve — K entre 3,0 e 3,5', itens:[
        { droga:'Xarope de KCl 6%', dose:'20 mL de 6/6 h a 8/8 h', via:'VO', obs:'Repor 40 a 100 mEq por dia. Sabor ruim; diluir em suco ajuda a adesão.' },
        { droga:'KCl comprimido 600 mg', dose:'2 comprimidos de 6/6 h a 8/8 h', via:'VO', obs:'Alternativa ao xarope.' }
      ]},
      { tipo:'doses', titulo:'Hipocalemia moderada a grave — K < 3,0, sintomas ou ECG alterado', itens:[
        { droga:'KCl 19,1% — acesso periférico', dose:'2 ampolas + SF 1000 mL', via:'EV BIC', obs:'Infundir *10 mEq/hora* — cerca de 5 horas. *Não diluir em soro glicosado* (a glicose desloca potássio para dentro da célula e piora).' },
        { droga:'KCl 19,1% — acesso central', dose:'1 ampola + SF 100 mL', via:'EV BIC', obs:'Infundir *20 mEq/hora* — cerca de 2 horas. Velocidade maior exige via central e monitorização.' },
        { droga:'Sulfato de magnésio 10%', dose:'2 ampolas (20 mL) + SG 5% 100 mL', via:'EV', obs:'Em 2–5 min; repetir conforme necessidade. *Sempre tratar a hipomagnesemia associada.*' },
        { droga:'Reposição oral associada', dose:'Xarope ou comprimido de KCl', via:'VO', obs:'*Associar a via oral à endovenosa* — acelera a correção e reduz o tempo de infusão.' }
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        'ECG e monitorização se K < 3,0, houver sintoma ou uso de digoxina.',
        '*Dosar magnésio* — e repor mesmo empiricamente na hipocalemia refratária.',
        'Escolher a via pela gravidade: oral no leve, endovenosa *associada à oral* no moderado a grave.',
        'Respeitar a velocidade máxima: *10 mEq/h em periférico, 20 mEq/h em central*.',
        'Diluir sempre em *soro fisiológico*, nunca em glicosado.',
        'Identificar e corrigir a causa — diurético, perda digestiva, alcalose.',
        'Repetir o potássio após cada etapa de reposição.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Repor potássio sem corrigir o magnésio* — a hipocalemia fica refratária e ninguém entende por quê.',
        '*Diluir KCl em soro glicosado* — a glicose estimula insulina, que joga potássio para dentro da célula.',
        'Infundir acima da velocidade máxima da via: risco de arritmia e parada.',
        'KCl em bolus ou sem diluição. *Nunca.*',
        'Repor em acesso periférico fino: dói muito e causa flebite — se precisa correr rápido, precisa de central.',
        'Corrigir o potássio e não investigar a causa da perda.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* possível na hipocalemia leve, assintomática, com ECG normal e causa identificada e corrigida — com reposição oral prescrita, ajuste do diurético e controle laboratorial em poucos dias. *Interna* quem tem K < 3,0, sintomas, alteração no ECG, uso de digoxina, arritmia, ou perda contínua não controlada. Reposição endovenosa exige *leito monitorizado*, e a velocidade alta exige acesso central.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Potássio que não sobe apesar da reposição = *magnésio baixo* em quase todos os casos. Reponha o magnésio e o potássio sobe sozinho.',
        'Na cetoacidose, o potássio *cai* quando a insulina começa — por isso se checa o potássio antes de iniciar a insulina.',
        'Onda U proeminente no ECG é o sinal que mais aponta hipocalemia, e passa despercebido quando não se procura.',
        'Associar via oral à endovenosa encurta bastante o tempo de correção — não há motivo para usar só uma das duas no paciente que engole.'
      ]}
    ] },

  { id:'hiponatremia', titulo:'Hiponatremia', categoria:'nefro', gravidade:'emergencia',
    resumo:'Sintomática recebe salina hipertônica; o limite de correção em 24 h evita a mielinólise.',
    tags:['hiponatremia','sodio baixo','salina 3%','siadh','mielinolise','osmolaridade','nacl 3%'],
    fonte:'SBN — Recomendações sobre distúrbios do sódio · Manual de Cardiologia na Prática 3.0, p. 105–110 · PS Zerado, p. 55–57',
    ficha:[
      { rotulo:'Quando pensar', valor:'Sódio *< 135 mEq/L*. Sintoma neurológico inexplicado, sobretudo em idoso usuário de diurético.' },
      { rotulo:'Prioridade',    valor:'*Sintoma grave manda*, não o número: convulsão ou coma recebem salina hipertônica agora.' },
      { rotulo:'Meta',          valor:'*Não ultrapassar 8–10 mEq/L de correção em 24 h* — o limite que evita a mielinólise.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*Sódio < 135 mEq/L*',
          nota:'Antes de tratar: corrigir o sódio pela glicemia e afastar pseudo-hiponatremia' },
        { tipo:'decisao', texto:'Há sintoma grave? (convulsão, rebaixamento, coma)', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*NaCl 3% — 100 a 150 mL em 20 min*, repetir até 3 vezes',
            nota:'Preparo: NaCl 20% 45 mL + SF 455 mL = 500 mL. *Corre em veia periférica*' },
          { rotulo:'Não', texto:'Investigar a *volemia* antes de repor qualquer coisa' }
        ]},
        { tipo:'passo', rotulo:'Meta do bolus', texto:'Subir o sódio *4 a 6 mEq/L* e reverter o sintoma',
          nota:'O objetivo é tirar o paciente do risco, *não normalizar o sódio*' },
        { tipo:'alerta', rotulo:'Teto absoluto', texto:'*Máximo de 8 a 10 mEq/L em 24 horas*',
          nota:'Ultrapassar causa mielinólise pontina — irreversível. Anote o sódio inicial, a hora e o teto no prontuário' },
        { tipo:'decisao', texto:'Qual a volemia?', ramos:[
          { rotulo:'Hipovolêmica', texto:'*Soro fisiológico*',
            nota:'Perda digestiva, diurético, terceiro espaço' },
          { rotulo:'Euvolêmica — SIADH', texto:'*Restrição hídrica* e tratar a causa',
            nota:'A mais comum. Soro fisiológico aqui pode piorar' },
          { rotulo:'Hipervolêmica', texto:'*Restrição* hídrica e de sódio + diurético',
            nota:'Insuficiência cardíaca, cirrose, síndrome nefrótica' }
        ]},
        { tipo:'passo', rotulo:'Durante a correção', texto:'*Dosar sódio a cada 2 a 4 horas*' },
        { tipo:'fim', rotulo:'Destino', texto:'*Leito monitorizado* + suspender tiazídico, ISRS e carbamazepina',
          nota:'Corrigiu rápido demais? Considerar reverter com água livre e desmopressina, com a nefrologia' }
      ]},
      { tipo:'alerta', titulo:'Red flags — sintomas graves', itens:[
        '*Convulsão.*',
        '*Rebaixamento do nível de consciência ou coma.*',
        'Vômitos persistentes com cefaleia intensa.',
        'Patologia de SNC associada — tumor, TCE, hipertensão intracraniana.',
        'Instalação *aguda* (< 48 h) — o cérebro não teve tempo de se adaptar e o edema é maior.'
      ]},
      { tipo:'texto', titulo:'Quem recebe salina hipertônica 3%', conteudo:'*Hiponatremia aguda* (instalação < 48 h): Na < 130 mEq/L *com sintomas*. *Hiponatremia crônica* (> 48 h ou tempo desconhecido): Na < 130 mEq/L *com sintomas graves* — convulsão, rebaixamento, coma — *ou* com patologia de SNC (tumor, TCE, hipertensão intracraniana); e também Na < 120 mEq/L ainda que assintomático. Fora dessas situações, a correção é mais lenta e passa por tratar a causa, não por salina hipertônica.' },
      { tipo:'doses', titulo:'Salina hipertônica', itens:[
        { droga:'NaCl 3% — como preparar', dose:'NaCl 20% 45 mL + SF 0,9% 455 mL = *500 mL de NaCl 3%*', via:'EV', obs:'*Pode ser infundida em acesso venoso periférico.* Não exige central.' },
        { droga:'NaCl 3% — bolus no sintoma grave', dose:'100–150 mL em 20 min, repetir até 3 vezes', via:'EV', obs:'Objetivo é elevar o sódio 4–6 mEq/L rapidamente e reverter o sintoma neurológico — não normalizar o sódio.' },
        { droga:'Furosemida', dose:'Conforme volemia', via:'EV', obs:'Associada na hiponatremia hipervolêmica (IC, cirrose, síndrome nefrótica).' }
      ]},
      { tipo:'passos', titulo:'Conduta imediata', itens:[
        'Avaliar *sintomas* e o tempo de instalação — são eles que definem a urgência.',
        'Sintoma grave: *NaCl 3% em bolus* até a reversão neurológica.',
        'Colher sódio, potássio, osmolaridade sérica e urinária, sódio urinário e função renal.',
        'Definir a *volemia*: hipovolêmico, euvolêmico ou hipervolêmico — a causa e o tratamento mudam.',
        'Suspender o que possa estar causando: tiazídico, ISRS, carbamazepina.',
        '*Dosar sódio a cada 2–4 h* durante a correção ativa.',
        'Vigiar o limite: *máximo 8–10 mEq/L em 24 h*.'
      ]},
      { tipo:'lista', titulo:'Investigação da causa pela volemia', itens:[
        '*Hipovolêmica:* perda digestiva, diurético, terceiro espaço. Tratamento: soro fisiológico.',
        '*Euvolêmica:* SIADH (a mais comum), hipotireoidismo, insuficiência adrenal, polidipsia. Tratamento: restrição hídrica e tratar a causa.',
        '*Hipervolêmica:* insuficiência cardíaca, cirrose, síndrome nefrótica, DRC. Tratamento: restrição hídrica e de sódio, diurético.',
        '*Pseudo-hiponatremia:* hiperglicemia acentuada, hipertrigliceridemia, hiperproteinemia — corrigir o sódio pela glicemia antes de tratar.'
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Corrigir mais de 8–10 mEq/L em 24 h* — risco de mielinólise pontina, que é irreversível e devastadora.',
        'Tratar o número em paciente assintomático com salina hipertônica.',
        'Repor sódio sem antes definir a volemia.',
        'Esquecer de corrigir o sódio pela glicemia no diabético descompensado.',
        'Dar soro fisiológico na hiponatremia euvolêmica por SIADH — pode piorar.',
        'Deixar de dosar o sódio de controle durante a correção ativa.'
      ]},
      { tipo:'texto', titulo:'Destino', conteudo:'Hiponatremia *sintomática ou grave* fica em *leito monitorizado*, com sódio seriado de 2/2 h a 4/4 h durante a correção, e avaliação de nefrologia. Hiponatremia leve, assintomática e de causa identificada pode ser conduzida ambulatorialmente — com suspensão ou troca do medicamento causador, orientação sobre ingestão hídrica e *controle laboratorial em poucos dias*. Correção rápida demais exige reversão ativa: se o sódio subiu além do limite, considera-se reduzir com água livre e desmopressina, sob orientação da nefrologia.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'No sintoma grave, a meta do bolus é *reverter o sintoma*, não normalizar o sódio. Subir 4–6 mEq/L já tira o paciente do risco.',
        'Salina a 3% corre em veia periférica — não perca tempo esperando acesso central.',
        'A pergunta que organiza a investigação é *"como está a volemia?"*. Sem ela, a escolha entre soro, restrição e diurético é chute.',
        'Escreva no prontuário o sódio inicial, a hora e o teto de correção das 24 h. É a informação que o plantão seguinte precisa e que quase nunca está anotada.'
      ]}
    ] },

  { id:'hipernatremia', titulo:'Hipernatremia', categoria:'nefro', gravidade:'urgencia',
    resumo:'Cálculo do déficit de água livre e a correção lenta para não causar edema cerebral.',
    tags:['hipernatremia','sodio alto','deficit de agua livre','diabetes insipidus','adrogue','agua livre'],
    fonte:'SBN — Recomendações sobre distúrbios do sódio · Manual de Cardiologia na Prática 3.0, p. 113–116 · PS Zerado, p. 55–57',
    ficha:[
      { rotulo:'Quando pensar', valor:'Sódio *> 145 mEq/L*. Quase sempre é *falta de água*, não excesso de sal — idoso acamado, sem acesso livre à água, ou com rebaixamento.' },
      { rotulo:'Prioridade',    valor:'*Corrigir a hipovolemia primeiro.* Só depois se corrige o sódio.' },
      { rotulo:'Meta',          valor:'*Máximo de 8 a 10 mEq em 24 horas* — correção rápida causa edema cerebral.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'*Sódio > 145 mEq/L*',
          nota:'Quase sempre é *falta de água*, não excesso de sal. Idoso acamado que depende de alguém para beber' },
        { tipo:'decisao', texto:'Há hipovolemia ou desidratação?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*EXPANSÃO com SF 0,9% primeiro*',
            nota:'Restaurar a perfusão vem antes de corrigir o sódio' },
          { rotulo:'Não', texto:'Seguir direto para a correção' }
        ]},
        { tipo:'passo', rotulo:'Com o paciente euvolêmico', texto:'*Redosar o sódio.* Ainda acima de 145?',
          nota:'Só então começa a correção propriamente dita' },
        { tipo:'passo', rotulo:'Repor', texto:'*Água livre por VO ou sonda* — via preferencial — + solução de correção EV',
          nota:'Mais fisiológica, mais barata e mais segura que a endovenosa' },
        { tipo:'passo', rotulo:'Fórmula de Adrogué', texto:'*(Na sérico − Na da solução) ÷ (água corporal total + 1)*',
          nota:'Quanto 1 L da solução baixa o sódio. SF 0,45% = 77 mEq/L · SG 5% = 0 mEq/L. ACT: homem 0,6 × peso (idoso 0,5) · mulher 0,5 (idosa 0,45)' },
        { tipo:'alerta', rotulo:'Teto', texto:'*Máximo de 8 a 10 mEq em 24 horas*',
          nota:'Correção rápida causa edema cerebral e convulsão. Dosar o sódio de 2/2 a 4/4 h' },
        { tipo:'fim', rotulo:'Antes da alta', texto:'*Resolver o acesso à água*',
          nota:'Sem plano de hidratação e orientação ao cuidador, o paciente desidrata de novo em casa. Poliúria persistente: investigar diabetes insipidus' }
      ]},
      { tipo:'passos', titulo:'Quando suspeitar', itens:[
        'Idoso acamado, demenciado ou rebaixado, que depende de outra pessoa para beber água.',
        'Sede intensa em quem consegue relatar.',
        'Perda de água livre: febre prolongada, diarreia, poliúria, grande queimado, uso de manitol.',
        '*Diabetes insipidus* — poliúria com urina diluída e sódio alto.',
        'Paciente em nutrição enteral sem oferta adequada de água livre.'
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Rebaixamento do nível de consciência, letargia, irritabilidade.',
        'Convulsão.',
        'Sinais de desidratação grave ou choque hipovolêmico.',
        'Poliúria mantida apesar da hipernatremia — investigar diabetes insipidus.',
        'Instalação aguda com sódio muito elevado.'
      ]},
      { tipo:'ordem', titulo:'Sequência do tratamento', itens:[
        '*Há hipovolemia ou desidratação?* Se sim, *expansão volêmica primeiro*, com soro fisiológico — restaurar a perfusão vem antes de corrigir o sódio.',
        'Com o paciente *euvolêmico*, dosar o sódio novamente.',
        'Se ainda > 145 mEq/L, iniciar a correção: *repor água livre* por via oral ou sonda enteral, mais a solução de correção endovenosa.',
        'Corrigir no máximo *8 a 10 mEq em 24 horas*.',
        '*Dosar o sódio a cada 2 a 4 horas* durante a correção.'
      ]},
      { tipo:'texto', titulo:'Fórmula de Adrogué — quanto 1 litro baixa o sódio', conteudo:'*Variação do sódio por litro de solução = (sódio sérico − sódio da solução) ÷ (água corporal total + 1).* A *água corporal total* é estimada por: homem jovem 0,6 × peso · homem idoso 0,5 × peso · mulher jovem 0,5 × peso · mulher idosa 0,45 × peso. Concentrações das soluções: *SF 0,45%* = 77 mEq/L de sódio (preparado com SG 5% ou água destilada 500 mL + SF 0,9% 500 mL) · *SG 5%* = 0 mEq/L de sódio. Com a variação por litro em mãos, divide-se a queda desejada nas 24 h e chega-se ao volume e à velocidade de infusão.' },
      { tipo:'doses', titulo:'Soluções de correção', itens:[
        { droga:'Soro fisiológico 0,9%', dose:'Conforme necessidade de expansão', via:'EV', obs:'*Primeira etapa*, enquanto houver hipovolemia. Não é solução de correção do sódio.' },
        { droga:'SF 0,45%', dose:'Calculado por Adrogué', via:'EV', obs:'Preparo: SG 5% ou água destilada 500 mL + SF 0,9% 500 mL = 1 L com 77 mEq/L de sódio.' },
        { droga:'SG 5%', dose:'Calculado por Adrogué', via:'EV', obs:'Sódio zero — baixa o sódio mais rápido. Vigiar glicemia.' },
        { droga:'Água livre', dose:'Conforme déficit calculado', via:'VO/SNE', obs:'*Via preferencial quando o paciente tolera.* Mais fisiológica e mais segura que a endovenosa.' }
      ]},
      { tipo:'naofazer', itens:[
        '*Corrigir mais de 8–10 mEq em 24 h* — edema cerebral e convulsão.',
        'Corrigir o sódio antes de tratar a hipovolemia.',
        'Usar água destilada pura por via endovenosa — causa hemólise.',
        'Esquecer de repor água livre pela sonda no paciente em dieta enteral.',
        'Deixar de dosar o sódio de controle durante a correção.',
        'Tratar só o número sem corrigir a causa do acesso restrito à água.'
      ], titulo:'Não fazer' },
      { tipo:'texto', titulo:'Destino', conteudo:'Hipernatremia sintomática, grave ou com instabilidade fica *internada em leito monitorizado*, com sódio seriado de 2/2 h a 4/4 h. O ponto decisivo do destino costuma ser social e funcional: o paciente idoso e dependente que chegou desidratado *volta a desidratar em casa* se o acesso à água não for resolvido. Antes da alta, garantir plano de hidratação, orientação ao cuidador e seguimento — e investigar diabetes insipidus quando a poliúria persistir.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Hipernatremia quase sempre é *falta de água*, não excesso de sal. A pergunta é: quem dá água a esse paciente?',
        'A ordem é volemia primeiro, sódio depois. Corrigir o sódio no paciente chocado é tratar o exame e ignorar o doente.',
        'Água livre por sonda ou pela boca é mais segura e mais barata que solução endovenosa — use sempre que houver tolerância.',
        'Anote o sódio inicial, a hora e o teto das 24 h. Em correções que atravessam plantões, é o que evita ultrapassar o limite sem ninguém perceber.'
      ]}
    ] },

  { id:'calcio', titulo:'Hipercalcemia e hipocalcemia', categoria:'nefro', gravidade:'urgencia',
    resumo:'Cálcio corrigido pela albumina, hidratação na hipercalcemia e gluconato na tetania.',
    tags:['calcio','hipercalcemia','hipocalcemia','trousseau','chvostek','bifosfonato'],
    fonte:'SBN/SBEM — Recomendações sobre distúrbios do cálcio',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Sempre corrigir pela albumina, ou dosar *cálcio iônico* — que é o exame que vale.',
        'Hipocalcemia sintomática (tetania, laringoespasmo, convulsão, QT longo) é emergência.',
        'Hipercalcemia acima de 14 mg/dL, ou com rebaixamento, também é emergência.',
        'Se o magnésio estiver baixo, o cálcio não sobe: repor magnésio junto.',
        'Hipercalcemia no adulto: 90% é hiperparatireoidismo ou neoplasia.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Cálcio alterado, com ou sem sintoma',
          nota:'Cálcio corrigido = cálcio medido + 0,8 × (4 − albumina)' },
        { tipo:'decisao', texto:'Hipo ou hipercalcemia?', ramos:[
          { rotulo:'Hipocalcemia sintomática', cor:'perigo', texto:'*Gluconato de cálcio 10% EV lento*',
            nota:'Chvostek e Trousseau positivos, parestesia perioral, tetania, QT longo' },
          { rotulo:'Hipocalcemia assintomática', texto:'*Reposição oral* + corrigir magnésio e vitamina D' },
          { rotulo:'Hipercalcemia acima de 14, ou sintomática', cor:'perigo',
            texto:'*Hidratação vigorosa + bisfosfonato*',
            nota:'Soro fisiológico 200 a 300 mL/h. Calcitonina para o efeito rápido' },
          { rotulo:'Hipercalcemia leve, abaixo de 12', cor:'ok', texto:'Hidratar, suspender causa e investigar' }
        ]},
        { tipo:'passo', rotulo:'Sempre', texto:'ECG, magnésio, fósforo, função renal, PTH e vitamina D',
          nota:'Hipocalcemia alarga o QT; hipercalcemia encurta' },
        { tipo:'fim', rotulo:'Depois', texto:'Investigar a causa: paratireoide, neoplasia, doença renal, medicação, pós-operatório de tireoide' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Gluconato de cálcio 10% (ampola de 10 mL)', dose:'1 a 2 ampolas em 100 mL de SG 5%', via:'EV', obs:'Correr em 10 a 20 minutos, com monitor. Na tetania grave pode ser mais rápido.' },
        { droga:'Gluconato de cálcio — manutenção', dose:'6 a 10 ampolas em 500 a 1000 mL de SG 5%', via:'EV', obs:'0,5 a 1,5 mg/kg/h de cálcio elementar, em bomba.' },
        { droga:'Carbonato de cálcio 500 mg', dose:'1 a 2 comprimidos', via:'VO', obs:'De 8/8 h, junto das refeições, na reposição crônica.' },
        { droga:'Calcitriol 0,25 mcg', dose:'1 cápsula', via:'VO', obs:'1 a 2x/dia. Necessário no hipoparatireoidismo e na doença renal.' },
        { droga:'Sulfato de magnésio 50%', dose:'2 g em 100 mL de SF 0,9%', via:'EV', obs:'Se hipomagnesemia — sem corrigir o magnésio, o cálcio não sobe.' },
        { droga:'Cloreto de sódio 0,9% — hipercalcemia', dose:'200 a 300 mL/h', via:'EV', obs:'Base do tratamento. Alvo de diurese de 100 a 150 mL/h.' },
        { droga:'Ácido zoledrônico 4 mg', dose:'4 mg em 100 mL de SF 0,9%', via:'EV', obs:'Em 15 minutos. Efeito em 2 a 4 dias. Ajustar na insuficiência renal.' },
        { droga:'Calcitonina', dose:'4 UI/kg', via:'SC ou IM', obs:'De 12/12 h. Efeito rápido, em horas, mas taquifilaxia em 48 h.' },
        { droga:'Furosemida', dose:'20 a 40 mg', via:'EV', obs:'SOMENTE depois de hidratar bem, e se houver hipervolemia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Interpretar o cálcio total sem corrigir pela albumina.',
        'Furosemida antes de hidratar na hipercalcemia: agrava a desidratação e piora o cálcio.',
        'Cálcio endovenoso rápido em quem usa digital: precipita arritmia.',
        'Gluconato de cálcio junto de bicarbonato ou fosfato na mesma via: precipita.',
        'Repor cálcio sem corrigir o magnésio.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* toda hipocalcemia sintomática, hipercalcemia acima de 14 mg/dL, ou qualquer das duas com alteração de consciência, arritmia ou lesão renal. Hipercalcemia leve e assintomática pode sair com hidratação oral e investigação ambulatorial de PTH e neoplasia. Pós-tireoidectomia exige vigilância de hipocalcemia nas primeiras 48 horas.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Peça cálcio iônico: dispensa a correção pela albumina e é mais confiável no doente grave.',
        'Chvostek pode ser positivo em 10% dos normais; Trousseau é mais específico.',
        'Hipercalcemia grave é quase sempre neoplasia: procure o tumor.'
      ]}
    ] },

  { id:'acido-base', titulo:'Distúrbios ácido-base: leitura da gasometria', categoria:'nefro', gravidade:'urgencia',
    resumo:'Roteiro de seis passos, ânion gap, delta-delta e compensação esperada.',
    tags:['gasometria','acidose','alcalose','anion gap','ph','bicarbonato','delta delta'],
    fonte:'SBN/AMIB — Interpretação de gasometria arterial',
    secoes:[
      { tipo:'alerta', titulo:'Regras de leitura', itens:[
        'Sempre leia na ordem: *pH · PaCO2 · HCO3 · ânion-gap · compensação*.',
        'O organismo *nunca supercompensa*: se o pH virou para o outro lado, há um segundo distúrbio.',
        'Ânion-gap = Na − (Cl + HCO3). Normal de 8 a 12 mEq/L, corrigido pela albumina.',
        'Ânion-gap elevado com acidose: *MUDPILES* — metanol, uremia, cetoacidose, propilenoglicol, isoniazida, lactato, etilenoglicol, salicilato.',
        'A causa importa mais que o número: trate a doença, não a gasometria.'
      ]},
      { tipo:'fluxo', titulo:'Como interpretar', itens:[
        { tipo:'inicio', rotulo:'1', texto:'*Olhe o pH*: acidemia abaixo de 7,35; alcalemia acima de 7,45' },
        { tipo:'decisao', texto:'2 — Quem explica o pH?', ramos:[
          { rotulo:'PaCO2 alterada no mesmo sentido', texto:'*Distúrbio respiratório*' },
          { rotulo:'HCO3 alterado no mesmo sentido', texto:'*Distúrbio metabólico*' }
        ]},
        { tipo:'passo', rotulo:'3', texto:'*Calcule o ânion-gap* se houver acidose metabólica',
          nota:'Corrigir: somar 2,5 ao AG para cada 1 g/dL de albumina abaixo de 4' },
        { tipo:'passo', rotulo:'4', texto:'*Verifique a compensação esperada*',
          nota:'Acidose metabólica — Winter: PaCO2 esperada = 1,5 × HCO3 + 8 (±2)' },
        { tipo:'passo', rotulo:'5', texto:'Se AG elevado, calcule o *delta-gap* para achar distúrbio misto',
          nota:'Delta AG dividido por delta HCO3: abaixo de 1 sugere acidose hiperclorêmica associada; acima de 2, alcalose metabólica associada' },
        { tipo:'fim', rotulo:'6', texto:'*Trate a causa*, não o número' }
      ]},
      { tipo:'lista', titulo:'Causas por distúrbio', itens:[
        '*Acidose metabólica com AG alto*: cetoacidose, lactato (sepse, isquemia, metformina), uremia, intoxicações.',
        '*Acidose metabólica com AG normal*: diarreia, acidose tubular renal, excesso de soro fisiológico, fístula.',
        '*Alcalose metabólica*: vômito, sonda nasogástrica aberta, diurético, hipocalemia, hiperaldosteronismo.',
        '*Acidose respiratória*: DPOC, depressão do centro respiratório, doença neuromuscular, obesidade.',
        '*Alcalose respiratória*: dor, ansiedade, febre, sepse, TEP, gestação, altitude, hepatopatia.'
      ]},
      { tipo:'doses', titulo:'Tratamento', itens:[
        { droga:'Tratar a causa', dose:'—', via:'—', obs:'É o tratamento. Volume na cetoacidose, antibiótico na sepse, diálise na uremia.' },
        { droga:'Bicarbonato de sódio 8,4%', dose:'1 a 2 mEq/kg diluído', via:'EV', obs:'Só em acidose grave: pH abaixo de 7,1 a 7,2 (7,0 na cetoacidose). Diluir sempre.' },
        { droga:'Cloreto de sódio 0,9%', dose:'Conforme a volemia', via:'EV', obs:'Alcalose metabólica responsiva a cloreto: vômito e diurético.' },
        { droga:'Cloreto de potássio', dose:'Conforme o déficit', via:'EV', obs:'A hipocalemia mantém a alcalose metabólica.' },
        { droga:'Suporte ventilatório', dose:'—', via:'—', obs:'Na acidose respiratória com pH baixo: VNI ou intubação.' },
        { droga:'Acetazolamida', dose:'250 a 500 mg', via:'VO ou EV', obs:'Em alcalose metabólica por diurético, com hipervolemia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Bicarbonato em acidose leve ou moderada: piora a acidose intracelular e desloca a curva da hemoglobina.',
        'Bicarbonato na cetoacidose com pH acima de 7,0.',
        'Hiperventilar mecanicamente para corrigir acidose metabólica sem tratar a causa.',
        'Ignorar um distúrbio misto: o delta-gap existe para isso.',
        'Tratar o número da gasometria em vez do paciente.'
      ]},
      { tipo:'texto', titulo:'Fórmulas úteis', conteudo:'*Ânion-gap* = Na − (Cl + HCO3), normal de 8 a 12. *AG corrigido* = AG + 2,5 × (4 − albumina). *Fórmula de Winter* (compensação da acidose metabólica) = PaCO2 esperada = 1,5 × HCO3 + 8, com margem de 2. *Delta-gap* = (AG medido − 12) ÷ (24 − HCO3). *Déficit de bicarbonato* = (HCO3 desejado − HCO3 atual) × 0,5 × peso. *Gap osmolar* = osmolaridade medida − calculada; acima de 10 sugere álcool não etílico.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Calcule o ânion-gap em toda acidose metabólica: sem ele, você não sabe o que está tratando.',
        'Gasometria venosa serve para pH, bicarbonato e potássio; para PaO2, precisa ser arterial.',
        'Lactato alto sem hipotensão pode ser sepse, isquemia mesentérica, metformina ou beta-2 em dose alta.'
      ]}
    ] },

  { id:'rabdomiolise', titulo:'Rabdomiólise', categoria:'nefro', gravidade:'urgencia',
    resumo:'CPK, hidratação vigorosa precoce e vigilância de hipercalemia e LRA.',
    tags:['rabdomiolise','cpk','mioglobinuria','urina escura','hidratacao'],
    fonte:'SBN — Recomendações sobre lesão renal aguda',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Hipercalemia* é a complicação que mata cedo: ECG e potássio seriados.',
        'CPK acima de 5.000 U/L indica risco de lesão renal; acima de 15.000, risco alto.',
        'Urina cor de coca-cola com dipstick positivo para sangue e *sem hemácias* ao sedimento é mioglobinúria.',
        'Síndrome compartimental pode ser causa ou consequência: dor desproporcional e tensão do compartimento.',
        'Hidratação precoce é o que previne a lesão renal — não espere a creatinina subir.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Mialgia, fraqueza e urina escura após exercício extremo, trauma, imobilização, convulsão ou droga',
          nota:'Também: estatina, cocaína, hipertermia, síndrome neuroléptica maligna, hipocalemia' },
        { tipo:'passo', rotulo:'O que salva', texto:'*HIDRATAÇÃO VIGOROSA E PRECOCE*',
          nota:'Cristaloide 1000 a 2000 mL na 1ª hora; depois manter diurese de 200 a 300 mL/h' },
        { tipo:'passo', rotulo:'Monitorar', texto:'*Potássio, cálcio, fósforo, CPK, função renal e gasometria* seriados',
          nota:'ECG na chegada e a cada alteração do potássio' },
        { tipo:'decisao', texto:'Há critério para alcalinizar?', ramos:[
          { rotulo:'CPK acima de 5.000, sem hipocalcemia, pH abaixo de 7,5 e bicarbonato abaixo de 30',
            texto:'*Alcalinização urinária*', nota:'Bicarbonato 8,4% 150 mL em SG 5% 850 mL, a 200 mL/h. Alvo de pH urinário acima de 6,5' },
          { rotulo:'Fora desses critérios', cor:'ok', texto:'Apenas hidratação com cristaloide' }
        ]},
        { tipo:'passo', rotulo:'Procurar a causa', texto:'Trauma, esmagamento, exercício, droga, estatina, convulsão, hipertermia, infecção' },
        { tipo:'fim', rotulo:'Vigiar', texto:'Lesão renal, hipercalemia, síndrome compartimental e coagulopatia' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Cloreto de sódio 0,9% ou Ringer lactato', dose:'1000 a 2000 mL na 1ª hora', via:'EV', obs:'Depois 200 a 500 mL/h, com alvo de diurese de 200 a 300 mL/h. É a medida principal.' },
        { droga:'Bicarbonato de sódio 8,4%', dose:'150 mL (15 ampolas) + SG 5% 850 mL, a 200 mL/h', via:'EV', obs:'Alcalinização, dentro dos critérios. Alvo de pH urinário acima de 6,5.' },
        { droga:'Gluconato de cálcio 10%', dose:'10 a 20 mL', via:'EV', obs:'Somente se hipercalemia com alteração no ECG. Não repor cálcio de rotina.' },
        { droga:'Insulina + glicose', dose:'10 UI + glicose 50%', via:'EV', obs:'Se hipercalemia.' },
        { droga:'Suspender estatina e nefrotóxicos', dose:'—', via:'—', obs:'AINE, IECA, BRA e contraste também saem.' },
        { droga:'Manitol', dose:'—', via:'EV', obs:'Uso controverso e não recomendado de rotina; só em protocolos específicos.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Repor cálcio de rotina: na fase de recuperação há hipercalcemia de rebote.',
        'Hidratação tímida — é o erro que custa o rim.',
        'Alcalinizar fora dos critérios ou com hipocalcemia.',
        'Manter estatina ou anti-inflamatório.',
        'Deixar de examinar os compartimentos musculares.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* toda rabdomiólise com CPK elevada de forma significativa, lesão renal, hipercalemia, ou causa que exija tratamento. Casos leves após exercício, com CPK moderadamente elevada, função renal e potássio normais, e boa aceitação oral, podem ser hidratados e reavaliados em 24 horas. Acionar a nefrologia se houver oligúria, hipercalemia refratária ou acidose grave.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Dipstick positivo para sangue sem hemácias no sedimento é o achado que fecha o diagnóstico.',
        'Anote o balanço hídrico e a diurese horária: é o que a nefrologia vai pedir.',
        'Examine os compartimentos: a síndrome compartimental pode aparecer depois da hidratação.'
      ]}
    ] },

  { id:'colica-renal', titulo:'Cólica nefrética e litíase urinária', categoria:'nefro', gravidade:'urgencia',
    resumo:'Analgesia com AINE, exames de imagem e os critérios de urgência urológica.',
    tags:['colica renal','calculo','litiase','tenoxicam','dipirona','hidronefrose'],
    fonte:'SBU — Sociedade Brasileira de Urologia',
    ficha:[
      { rotulo:'Quando pensar', valor:'Dor lombar súbita, em cólica, que irradia para flanco e região inguinal, com o paciente *agitado, sem posição antálgica*.' },
      { rotulo:'Prioridade',    valor:'Analgesia imediata; a investigação vem depois da dor controlada.' },
      { rotulo:'Meta',          valor:'Dor controlada e *pionefrose descartada* antes de pensar em alta.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Dor lombar súbita em cólica, irradiando para flanco e virilha',
          nota:'Paciente *agitado, sem posição antálgica*. Quem fica imóvel provavelmente tem peritonite' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*ANALGESIA* — a investigação vem depois',
          nota:'Cetoprofeno 100 mg EV (AINE é primeira linha) + dipirona. Morfina como resgate' },
        { tipo:'decisao', texto:'Há alguma red flag?', ramos:[
          { rotulo:'Febre + obstrução', cor:'perigo', texto:'*PIONEFROSE — urgência de DRENAGEM*',
            nota:'Antibiótico sozinho não resolve rim obstruído. Duplo J ou nefrostomia' },
          { rotulo:'Rim único, LRA, dor refratária', cor:'perigo', texto:'*Avaliação urológica de urgência*' },
          { rotulo:'Nenhuma', texto:'Seguir a investigação' }
        ]},
        { tipo:'passo', rotulo:'Exames', texto:'Urina I + creatinina + *TC sem contraste* + β-hCG',
          nota:'USG na gestante, criança e jovem com quadro típico. 1º episódio acima de 50 anos exige imagem' },
        { tipo:'decisao', texto:'Qual o tamanho do cálculo?', ramos:[
          { rotulo:'< 5 mm', cor:'ok', texto:'*Elimina sozinho* na maioria dos casos' },
          { rotulo:'5 a 10 mm', texto:'*Tansulosina 0,4 mg/dia* por até 4 semanas',
            nota:'Terapia expulsiva para cálculo distal' },
          { rotulo:'> 10 mm', texto:'*Avaliação urológica* — quase nunca elimina sozinho' }
        ]},
        { tipo:'alerta', rotulo:'Não fazer', texto:'*Hidratação venosa vigorosa para "empurrar o cálculo"*',
          nota:'Não acelera a eliminação e piora a dor' },
        { tipo:'fim', rotulo:'Alta', texto:'Dor controlada VO, sem febre, função renal normal, aceitando líquidos',
          nota:'Com analgesia, coador de urina, retorno urológico e orientação de voltar se febre ou dor refratária' }
      ]},
      { tipo:'passos', titulo:'Quando suspeitar', itens:[
        'Dor em cólica de início súbito, unilateral, sem posição de alívio.',
        'Náusea e vômito acompanhando a dor, sem causa abdominal aparente.',
        'Hematúria macro ou microscópica (ausente em cerca de 15% dos casos — *não descarta*).',
        'Disúria e urgência quando o cálculo está na porção distal do ureter.',
        '*Diferenciais que não podem passar:* aneurisma de aorta roto no maior de 50 anos com primeiro episódio, gravidez ectópica, torção testicular ou de ovário, e pielonefrite.'
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Febre com obstrução* — pionefrose, é urgência urológica de drenagem, não de analgesia.',
        'Rim único, transplantado ou obstrução bilateral.',
        'Lesão renal aguda ou anúria.',
        'Dor refratária apesar de analgesia adequada.',
        'Primeiro episódio acima dos 50 anos — imagem obrigatória antes de assumir cólica renal.'
      ]},
      { tipo:'lista', titulo:'Exames', itens:[
        'Urina tipo I — hematúria, leucocitúria e nitrito.',
        'Creatinina e ureia; hemograma se houver febre.',
        'Urocultura sempre que houver suspeita de infecção associada.',
        '*Tomografia de abdome sem contraste* é o padrão-ouro — define tamanho, localização e obstrução.',
        'Ultrassom na gestante, na criança e no jovem com quadro típico e recorrente.',
        'Teste de gravidez em toda mulher em idade fértil.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Cetoprofeno',  dose:'100 mg diluído em 100 mL', via:'EV', obs:'*Primeira linha* — AINE controla melhor que opioide. Evitar se LRA, rim único ou desidratação.' },
        { droga:'Tenoxicam',    dose:'20–40 mg', via:'EV', obs:'Alternativa ao cetoprofeno.' },
        { droga:'Dipirona',     dose:'1–2 g diluída', via:'EV', obs:'Associar ao AINE, não substituir.' },
        { droga:'Escopolamina', dose:'20 mg', via:'EV', obs:'Uso opcional; benefício adicional pequeno.' },
        { droga:'Morfina',      dose:'2–4 mg, titular', via:'EV', obs:'Resgate quando o AINE não controla ou está contraindicado.' },
        { droga:'Ondansetrona', dose:'4–8 mg', via:'EV', obs:'Para o vômito, que costuma ser o que impede a alta.' },
        { droga:'Tansulosina',  dose:'0,4 mg/dia', via:'VO', obs:'Terapia expulsiva para cálculo distal de 5–10 mm, por até 4 semanas.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Hidratação venosa vigorosa para "empurrar o cálculo" — não acelera a eliminação e piora a dor.',
        'Dar alta com febre e hidronefrose.',
        'Assumir cólica renal no primeiro episódio acima dos 50 anos sem imagem.',
        'AINE em paciente com creatinina elevada, rim único ou desidratado.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* quando a dor está controlada com medicação oral, não há febre, a função renal está normal, o paciente aceita líquidos e o cálculo tem menos de 10 mm — com analgesia prescrita, coador de urina, retorno urológico e orientação de retorno imediato se febre ou dor refratária. *Interna* quem tem febre com obstrução (drenagem por cateter duplo J ou nefrostomia, mais antibiótico), lesão renal aguda, rim único ou obstrução bilateral, dor ou vômito incontroláveis, ou cálculo acima de 10 mm com obstrução.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'O paciente com cólica renal *não fica quieto* — quem fica imóvel na maca provavelmente tem peritonite, não cálculo.',
        'Febre em cólica renal não é "só infecção urinária": é pionefrose até prova em contrário, e antibiótico sozinho não resolve rim obstruído.',
        'Cálculo abaixo de 5 mm elimina sozinho na maioria dos casos; acima de 10 mm quase nunca — o tamanho define a conversa da alta.'
      ]}
    ] },

  { id:'retencao-urinaria', titulo:'Retenção urinária aguda', categoria:'nefro', gravidade:'urgencia',
    resumo:'Sondagem de alívio, cuidado com a descompressão rápida e a investigação da causa.',
    tags:['retencao urinaria','globo vesical','sondagem','hpb','descompressao'],
    fonte:'SBU — Sociedade Brasileira de Urologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Retenção com *anestesia em sela, déficit motor ou dor lombar*: síndrome da cauda equina — emergência neurocirúrgica.',
        'Uretrorragia, hematoma perineal ou próstata deslocada após trauma: *não sondar pela uretra*.',
        'Febre com dor prostática: prostatite aguda — sondar com cuidado ou puncionar.',
        'Retenção com lesão renal aguda: descomprimir resolve, mas atenção à diurese pós-obstrutiva.',
        'Perda de mais de 200 mL/h após a desobstrução: repor volume e monitorar eletrólitos.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Incapacidade de urinar com bexiga palpável e dor suprapúbica' },
        { tipo:'passo', rotulo:'Confirmar', texto:'Palpação, percussão e *ultrassom de bexiga* à beira do leito',
          nota:'Volume residual acima de 300 a 400 mL confirma' },
        { tipo:'decisao', texto:'Pode sondar pela uretra?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'*Sondagem vesical de alívio ou de demora*',
            nota:'Sonda de Foley 16 a 18 Fr, com lidocaína gel em abundância' },
          { rotulo:'Trauma pélvico com uretrorragia, ou falha após 2 tentativas', cor:'perigo',
            texto:'*Cistostomia suprapúbica* — acionar a urologia' }
        ]},
        { tipo:'passo', rotulo:'Esvaziar', texto:'*Drenar completamente* — a antiga recomendação de clampear a cada 500 mL foi abandonada',
          nota:'Monitorar hematúria ex-vacuo e hipotensão, que são raras e autolimitadas' },
        { tipo:'passo', rotulo:'Procurar a causa', texto:'Hiperplasia prostática, medicação, fecaloma, infecção, neurológica, pós-operatório',
          nota:'Rever anticolinérgico, opioide, descongestionante, antidepressivo tricíclico' },
        { tipo:'fim', rotulo:'Depois', texto:'Vigiar *diurese pós-obstrutiva*; iniciar alfabloqueador e encaminhar à urologia' }
      ]},
      { tipo:'doses', titulo:'Manejo', itens:[
        { droga:'Sonda de Foley', dose:'16 a 18 Fr no adulto', via:'URETRAL', obs:'Lidocaína gel generosa e tempo para agir. No homem, tracionar o pênis para cima a 90 graus.' },
        { droga:'Lidocaína gel 2%', dose:'10 a 20 mL', via:'URETRAL', obs:'Instilar e aguardar 3 a 5 minutos. Reduz muito a dor e facilita a passagem.' },
        { droga:'Tansulosina 0,4 mg', dose:'1 cápsula', via:'VO', obs:'1x/dia. Iniciar já na retenção por hiperplasia — aumenta a chance de retirar a sonda com sucesso.' },
        { droga:'Cistostomia suprapúbica', dose:'—', via:'—', obs:'Se a sondagem uretral for impossível ou contraindicada. Guiada por ultrassom quando possível.' },
        { droga:'Cristaloide', dose:'Conforme a perda', via:'EV', obs:'Se diurese pós-obstrutiva acima de 200 mL/h. Repor cerca de metade do volume perdido.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'A retenção dói muito; analgesia enquanto se prepara a sondagem.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Sondar pela uretra com uretrorragia, hematoma perineal ou próstata deslocada no trauma.',
        'Forçar a passagem da sonda: use calibre adequado, gel e paciência; após 2 falhas, chame a urologia.',
        'Clampear a sonda de forma intermitente durante o esvaziamento — prática abandonada.',
        'Dar alta sem plano para a sonda e sem encaminhamento urológico.',
        'Esquecer de rever as medicações que causaram a retenção.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* possível após a sondagem, com sonda de demora, coletor, orientação de cuidado, alfabloqueador iniciado e retorno urológico em 3 a 7 dias para tentativa de retirada. *Internar* se houver lesão renal, diurese pós-obstrutiva importante, infecção com toxemia, hematúria significativa, impossibilidade de sondagem, ou suspeita de cauda equina.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Registre o volume drenado: acima de 1000 mL exige atenção à diurese pós-obstrutiva.',
        'Alfabloqueador iniciado na retenção aumenta bastante a chance de sucesso ao retirar a sonda.',
        'Toque retal e exame neurológico do períneo: fáceis, rápidos e evitam perder a cauda equina.'
      ]}
    ] },

  /* ======================= 08 · PSIQUIATRIA ======================= */
  { id:'agitacao-psicomotora', titulo:'Agitação psicomotora e contenção', categoria:'psiq', gravidade:'emergencia',
    resumo:'Escalonamento verbal, contenção química e as regras da contenção mecânica.',
    tags:['agitacao','contencao','haloperidol','midazolam','prometazina','olanzapina'],
    fonte:'ABP — Diretrizes de emergências psiquiátricas / Resolução CFM sobre contenção',
    secoes:[
      { tipo:'alerta', titulo:'Antes de sedar, afastar causa orgânica', itens:[
        'Glicemia capilar em *todo* agitado — hipoglicemia imita psicose e mata se sedada.',
        'Oximetria, temperatura e sinais vitais: hipóxia e sepse cursam com agitação.',
        'Trauma craniano, intoxicação, abstinência, distúrbio eletrolítico e retenção urinária.',
        'Agitação de *início súbito em idoso sem doença psiquiátrica prévia* é delirium até prova em contrário.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Paciente agitado, agressivo ou em risco para si ou terceiros',
          nota:'Equipe suficiente e visível, ambiente seguro, objetos de risco retirados' },
        { tipo:'passo', rotulo:'Sempre primeiro', texto:'*Contenção verbal* — abordagem calma, uma pessoa fala',
          nota:'Resolve a maior parte. Oferecer água, banheiro, comida e explicar o que vai acontecer' },
        { tipo:'passo', rotulo:'Em paralelo', texto:'Glicemia capilar, oximetria, temperatura e sinais vitais',
          nota:'Causa orgânica muda todo o tratamento' },
        { tipo:'decisao', texto:'O paciente aceita medicação por via oral?', ramos:[
          { rotulo:'Sim, colabora', cor:'ok', texto:'*VO é preferível* — menos trauma e mesma eficácia',
            nota:'Risperidona 2 mg ou olanzapina 10 mg VO; clorpromazina 25 mg se preferir' },
          { rotulo:'Não, ou risco iminente', texto:'*Contenção química IM*',
            nota:'Haloperidol 5 mg + prometazina 50 mg IM na mesma seringa' }
        ]},
        { tipo:'decisao', texto:'Qual a causa provável?', ramos:[
          { rotulo:'Psicose, mania', texto:'*Haloperidol + prometazina*', nota:'Combinação clássica; a prometazina reduz o extrapiramidal' },
          { rotulo:'Álcool, abstinência, estimulante', cor:'perigo', texto:'*Benzodiazepínico*, não antipsicótico',
            nota:'Midazolam 5 a 10 mg IM ou diazepam EV. Haloperidol baixa o limiar convulsivo' },
          { rotulo:'Delirium no idoso', texto:'*Haloperidol em dose baixa* (0,5 a 1 mg)',
            nota:'Evitar benzodiazepínico: piora a confusão' }
        ]},
        { tipo:'alerta', rotulo:'Só em último caso', texto:'*Contenção mecânica*',
          nota:'Cinco pontos, decúbito dorsal, cabeceira elevada. Nunca em decúbito ventral' },
        { tipo:'fim', rotulo:'Depois', texto:'Monitorizar, reavaliar a cada 30 minutos e retirar a contenção o quanto antes',
          nota:'Registrar indicação, horário, técnica e cada reavaliação no prontuário' }
      ]},
      { tipo:'doses', titulo:'Contenção química', itens:[
        { droga:'Haloperidol 5 mg/mL', dose:'1 ampola (5 mg)', via:'IM', obs:'Repetir a cada 30 min, até 15 a 20 mg/dia. Doses menores (0,2 a 0,8 mL) no idoso e no delirium.' },
        { droga:'Prometazina 50 mg/2 mL', dose:'1 ampola', via:'IM', obs:'Associada ao haloperidol, na mesma seringa. Pode repetir a cada 30 min, até 3 vezes.' },
        { droga:'Midazolam 15 mg/3 mL', dose:'0,5 ampola (7,5 mg)', via:'IM', obs:'Escolha na agitação por álcool, abstinência ou estimulante. Vigiar depressão respiratória.' },
        { droga:'Clorpromazina 25 mg', dose:'1 comprimido', via:'VO', obs:'Se o paciente aceita a via oral. Repetir de 30/30 min até a tranquilização.' },
        { droga:'Risperidona 2 mg', dose:'1 comprimido', via:'VO', obs:'Alternativa oral, menos extrapiramidal que o haloperidol.' },
        { droga:'Olanzapina 10 mg', dose:'1 comprimido', via:'VO', obs:'Não associar à benzodiazepina parenteral: risco de depressão cardiorrespiratória.' },
        { droga:'Biperideno 5 mg/mL', dose:'1 ampola', via:'EV', obs:'Antídoto da distonia aguda pelo haloperidol. Deixar disponível.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Sedar sem antes medir a glicemia.',
        'Contenção mecânica em decúbito ventral — já matou por asfixia posicional.',
        'Benzodiazepínico como primeira escolha no delirium do idoso: piora a confusão.',
        'Haloperidol na intoxicação por estimulante ou na abstinência alcoólica: baixa o limiar convulsivo.',
        'Olanzapina intramuscular junto de benzodiazepínico parenteral.',
        'Deixar o paciente contido sem reavaliação e sem registro.'
      ]},
      { tipo:'lista', titulo:'Regras da contenção mecânica', itens:[
        'Indicação médica registrada, com o motivo e o horário de início.',
        'Cinco pontos, decúbito dorsal com cabeceira a 30 graus.',
        'Reavaliação a cada 30 minutos: perfusão distal, sinais vitais, nível de consciência e necessidade de manter.',
        'Retirar o quanto antes, de forma progressiva.',
        'Nunca como punição, castigo ou por falta de pessoal.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Depois de controlado o quadro, avaliar *risco de suicídio e de heteroagressão* antes de qualquer alta. Internação se houver risco persistente, primeiro surto, ausência de rede de apoio, causa orgânica não resolvida ou intoxicação em curso. Alta só com acompanhante, encaminhamento ao CAPS e retorno definido.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Descreva a contenção como qualquer procedimento: indicação, horário, técnica, reavaliações e retirada.',
        'ECG antes do haloperidol quando possível — evitar se o QTc passar de 500 ms.',
        'A prometazina sozinha não é contenção química: é adjuvante.'
      ]}
    ] },

  { id:'risco-suicidio', titulo:'Ideação suicida e tentativa de suicídio', categoria:'psiq', gravidade:'emergencia',
    resumo:'Como perguntar, como estratificar o risco e quem não pode receber alta.',
    tags:['suicidio','ideacao','tentativa','risco','internacao involuntaria','caps'],
    fonte:'ABP / Ministério da Saúde — Prevenção do suicídio, manual para profissionais',
    secoes:[
      { tipo:'alerta', titulo:'Red flags de alto risco', itens:[
        'Plano estruturado, com método definido, acesso ao meio e data marcada.',
        'Tentativa prévia — é o preditor isolado mais forte.',
        'Método de alta letalidade, ou tentativa com precaução contra o resgate.',
        'Ausência de rede de apoio, isolamento, perda recente.',
        'Doença mental grave, uso de substância, doença crônica dolorosa ou incapacitante.',
        'Homem, idoso, sensação de desesperança e ausência de planos futuros.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Ideação suicida, tentativa, ou triagem positiva em outro atendimento' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Tratar as consequências clínicas* e garantir a segurança',
          nota:'Ambiente sem meios de autoagressão; acompanhamento visual contínuo' },
        { tipo:'passo', rotulo:'Perguntar diretamente', texto:'*Perguntar sobre suicídio NÃO induz ao ato* — perguntar salva',
          nota:'"Você tem pensado em morrer?", "Já pensou em como faria?", "Tem acesso a isso?"' },
        { tipo:'passo', rotulo:'Estratificar', texto:'Ideação passiva · ideação ativa sem plano · plano estruturado · tentativa',
          nota:'Avaliar intenção, letalidade percebida, arrependimento e fatores de proteção' },
        { tipo:'decisao', texto:'Qual o risco?', ramos:[
          { rotulo:'Alto — plano, acesso, tentativa recente', cor:'perigo',
            texto:'*Internação, se necessário involuntária*',
            nota:'Vigilância contínua. Comunicar a família' },
          { rotulo:'Moderado', texto:'Avaliação psiquiátrica antes da alta e plano de segurança',
            nota:'Retirar meios de casa; acompanhante responsável; retorno em poucos dias' },
          { rotulo:'Baixo', cor:'ok', texto:'Plano de segurança + encaminhamento ao CAPS com data' }
        ]},
        { tipo:'fim', rotulo:'Sempre', texto:'*Notificação compulsória* de violência autoprovocada e registro detalhado' }
      ]},
      { tipo:'lista', titulo:'O plano de segurança, feito com o paciente', itens:[
        'Reconhecer os sinais de alerta pessoais que antecedem a crise.',
        'Estratégias de enfrentamento que já funcionaram antes.',
        'Pessoas e lugares que distraem e acalmam.',
        'Pessoas a quem pedir ajuda, com telefone anotado.',
        'Profissionais e serviços de emergência, com endereço e telefone.',
        '*Restrição de acesso aos meios*: retirar arma, medicação em excesso e produto tóxico de casa, com a família.',
        'CVV 188, gratuito e 24 horas.'
      ]},
      { tipo:'doses', titulo:'Manejo', itens:[
        { droga:'Vigilância contínua', dose:'—', via:'—', obs:'Acompanhamento visual, ambiente seguro, sem objetos de risco. A medida mais importante.' },
        { droga:'Tratamento clínico da tentativa', dose:'Conforme o método', via:'—', obs:'Intoxicação, ferimento, enforcamento. Ver a conduta específica.' },
        { droga:'Benzodiazepínico', dose:'Clonazepam 0,5 a 2 mg VO', via:'VO', obs:'Se houver ansiedade ou agitação importante. Prescrever poucos comprimidos e nunca na alta sem seguimento.' },
        { droga:'Antipsicótico', dose:'Haloperidol 2,5 a 5 mg', via:'VO ou IM', obs:'Se houver agitação com risco ou sintoma psicótico.' },
        { droga:'Não prescrever na alta', dose:'—', via:'—', obs:'Evitar quantidades grandes de qualquer medicação potencialmente letal. Entregar em pequenas quantidades ao responsável.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Evitar o assunto por medo de "dar a ideia" — perguntar reduz o risco, não aumenta.',
        'Julgar, minimizar ou dizer que "isso é besteira".',
        'Dar alta sem avaliação de risco documentada.',
        'Prescrever caixa cheia de antidepressivo tricíclico ou benzodiazepínico na alta.',
        'Aceitar promessa de "não vou fazer nada" como plano de segurança.',
        'Deixar o paciente sozinho em sala com meios disponíveis.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* no risco alto: plano estruturado com acesso ao meio, tentativa de alta letalidade, arrependimento ausente, doença mental grave descompensada, ausência de rede de apoio, ou intoxicação em curso. A internação involuntária é prevista em lei quando há risco iminente e recusa. *Alta* apenas com risco baixo ou moderado bem avaliado, plano de segurança escrito, meios retirados de casa, acompanhante responsável presente e consulta marcada em poucos dias. Notificação compulsória.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Pergunte de forma direta e calma: a maioria dos pacientes alivia ao poder falar.',
        'Envolva a família na retirada dos meios — é a intervenção com melhor evidência.',
        'Documente a avaliação de risco com as palavras do paciente entre aspas.',
        'CVV 188 é gratuito, 24 horas, e pode ser anotado na receita.'
      ]}
    ] },

  { id:'surto-psicotico', titulo:'Primeiro surto psicótico', categoria:'psiq', gravidade:'urgencia',
    resumo:'Excluir causa orgânica antes de rotular como psiquiátrico; antipsicótico e encaminhamento.',
    tags:['psicose','surto','delirio','alucinacao','risperidona','organico'],
    fonte:'ABP — Diretrizes de emergências psiquiátricas',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — não é psiquiatria pura', itens:[
        'Primeiro surto acima dos 40 anos: pensar em causa orgânica antes de psiquiátrica.',
        'Febre, rigidez, alteração de consciência flutuante ou sinal neurológico focal.',
        'Alucinação *visual* predomina em causa orgânica; a auditiva, na psiquiátrica.',
        'Uso de substância, abstinência, corticoide, ou doença autoimune conhecida.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Delírio, alucinação ou desorganização do pensamento e do comportamento' },
        { tipo:'passo', rotulo:'Sempre', texto:'Glicemia, sinais vitais, exame neurológico e triagem toxicológica',
          nota:'Primeiro surto pede também hemograma, eletrólitos, função renal e hepática, TSH e sorologias' },
        { tipo:'decisao', texto:'Há sinal de causa orgânica?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Investigar e tratar a causa*',
            nota:'Tomografia de crânio, punção lombar se houver febre ou meningismo' },
          { rotulo:'Não', texto:'Provável surto psicótico primário' }
        ]},
        { tipo:'passo', rotulo:'Tratar', texto:'*Antipsicótico* — via oral se o paciente colabora',
          nota:'Risperidona 2 mg ou olanzapina 10 mg VO; haloperidol 2 a 5 mg IM se recusa ou agitação' },
        { tipo:'passo', rotulo:'Adjuvante', texto:'Benzodiazepínico se houver ansiedade ou insônia importantes',
          nota:'Lorazepam 2 mg VO ou diazepam 10 mg EV' },
        { tipo:'fim', rotulo:'Destino', texto:'Avaliação da psiquiatria; internar se houver risco, primeiro surto ou ausência de rede' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Haloperidol 5 mg/mL', dose:'2 a 4 mg (0,4 a 0,8 mL)', via:'IM', obs:'Máximo de 40 mg/dia. Vigiar sintomas extrapiramidais.' },
        { droga:'Haloperidol comprimido', dose:'1 a 5 mg', via:'VO', obs:'Repetir conforme a resposta.' },
        { droga:'Risperidona', dose:'2 a 8 mg/dia', via:'VO', obs:'Aumentar 1 mg/dia até o controle. Máximo de 16 mg/dia. Escolha em quem não tolera haloperidol.' },
        { droga:'Olanzapina', dose:'10 a 20 mg/dia', via:'VO', obs:'Aumentar 5 mg por semana. Máximo de 20 mg/dia. Boa opção se houver extrapiramidal importante.' },
        { droga:'Lorazepam', dose:'2 mg', via:'VO', obs:'Adjuvante para ansiedade e insônia. Máximo de 12 mg/dia.' },
        { droga:'Diazepam', dose:'10 mg', via:'EV', obs:'Adjuvante. Máximo de 30 mg/dia.' },
        { droga:'Prometazina 50 mg/2 mL', dose:'1 ampola', via:'IM', obs:'Adjuvante; repetir de 30/30 min até 3 vezes.' },
        { droga:'Biperideno 5 mg/mL', dose:'1 ampola', via:'EV', obs:'Para distonia aguda pelo antipsicótico.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Assumir causa psiquiátrica em primeiro surto acima dos 40 anos sem investigar.',
        'Dar alta sem avaliar risco de suicídio e de heteroagressão.',
        'Subir a dose do antipsicótico rápido demais — o extrapiramidal aparece antes do efeito.',
        'Ignorar o QTc antes do haloperidol.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* no primeiro surto, se houver risco de auto ou heteroagressão, recusa de tratamento com prejuízo grave, ausência de rede de apoio ou causa orgânica em investigação. *Alta* possível em recaída conhecida, com sintomas controlados, adesão preservada, acompanhante presente e vaga garantida no CAPS em poucos dias.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Alucinação visual, desorientação e flutuação apontam para delirium, não para esquizofrenia.',
        'Perguntar sempre sobre uso de substância e sobre a última dose da medicação de uso contínuo.',
        'Registrar a avaliação de risco com as próprias palavras do paciente.'
      ]}
    ] },

  { id:'abstinencia-alcool', titulo:'Abstinência alcoólica e delirium tremens', categoria:'psiq', gravidade:'emergencia',
    resumo:'CIWA-Ar, benzodiazepínico conforme sintoma e tiamina antes de qualquer glicose.',
    tags:['abstinencia','alcool','delirium tremens','ciwa','diazepam','tiamina','wernicke'],
    fonte:'ABP / Ministério da Saúde — Manejo de transtornos por uso de álcool',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Delirium tremens* (48 a 96 h): confusão, alucinação, febre, taquicardia e sudorese profusa. Mortalidade real.',
        'Convulsão de abstinência costuma ocorrer entre 12 e 48 horas da última dose.',
        '*Tiamina antes da glicose*, sempre — sem isso, encefalopatia de Wernicke.',
        'Tríade de Wernicke: confusão, oftalmoplegia e ataxia. Muitas vezes incompleta.',
        'Hipomagnesemia e hipopotassemia acompanham e dificultam o controle.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Tremor, sudorese, ansiedade, náusea e taquicardia após redução ou parada do álcool',
          nota:'Aplicar CIWA-Ar para graduar e guiar as doses' },
        { tipo:'passo', rotulo:'Antes de tudo', texto:'*TIAMINA 300 mg EV* + glicemia capilar',
          nota:'Tiamina antes ou junto de qualquer glicose' },
        { tipo:'passo', rotulo:'Base', texto:'*BENZODIAZEPÍNICO titulado pelos sintomas*',
          nota:'Diazepam 10 mg EV lento, repetindo até a sedação leve. Esquema guiado por sintoma é superior ao de dose fixa' },
        { tipo:'passo', rotulo:'Corrigir', texto:'Hidratação, magnésio, potássio e fósforo',
          nota:'Sem corrigir o magnésio, o quadro não controla' },
        { tipo:'decisao', texto:'Qual a gravidade?', ramos:[
          { rotulo:'Leve — CIWA abaixo de 8', cor:'ok', texto:'Ambulatorial, com tiamina e seguimento' },
          { rotulo:'Moderada — CIWA 8 a 15', texto:'Observação com benzodiazepínico titulado' },
          { rotulo:'Grave ou delirium tremens', cor:'perigo', texto:'*Internação em leito monitorizado*',
            nota:'Doses altas de benzodiazepínico; considerar fenobarbital ou dexmedetomidina se refratário' }
        ]},
        { tipo:'fim', rotulo:'Antes da alta', texto:'Tiamina oral, ácido fólico, e encaminhamento ao CAPS-AD' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Tiamina', dose:'300 mg', via:'EV', obs:'De 8/8 h nos primeiros dias, depois oral. Antes de qualquer glicose.' },
        { droga:'Diazepam 5 mg/mL', dose:'10 mg', via:'EV', obs:'Lento, repetindo a cada 10 a 15 min até sedação leve. Titular pelos sintomas, não por dose fixa.' },
        { droga:'Lorazepam', dose:'2 a 4 mg', via:'VO ou EV', obs:'Preferível no hepatopata e no idoso: não tem metabólito ativo.' },
        { droga:'Cristaloide', dose:'1000 a 2000 mL', via:'EV', obs:'Hidratação; a perda por sudorese e vômito é grande.' },
        { droga:'Sulfato de magnésio 50%', dose:'2 g em 100 mL de SF 0,9%', via:'EV', obs:'Em 1 hora. Sem magnésio corrigido, o quadro não controla.' },
        { droga:'Cloreto de potássio', dose:'Conforme o déficit', via:'EV', obs:'Diluído. A hipocalemia é regra.' },
        { droga:'Haloperidol 5 mg/mL', dose:'2,5 a 5 mg', via:'IM', obs:'Adjuvante se houver alucinação importante. Nunca substitui o benzodiazepínico.' },
        { droga:'Fenobarbital', dose:'Conforme o protocolo', via:'EV', obs:'No delirium refratário a doses altas de benzodiazepínico.' },
        { droga:'Ácido fólico 5 mg', dose:'1 comprimido', via:'VO', obs:'1x/dia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Glicose antes da tiamina: precipita Wernicke.',
        'Haloperidol isolado: baixa o limiar convulsivo e não trata a abstinência.',
        'Esquema de dose fixa em vez de titulado pelos sintomas — leva a subdose ou sobredose.',
        'Esquecer o magnésio.',
        'Dar alta sem tiamina oral e sem encaminhamento à rede de atenção psicossocial.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na abstinência leve, em paciente com rede de apoio, sem história de convulsão ou delirium, com tiamina oral, ácido fólico e retorno marcado. *Internar* se houver CIWA alto, história de delirium tremens ou convulsão de abstinência, comorbidade descompensada, ausência de suporte, ou intoxicação associada. Delirium tremens vai para leito monitorizado. Rastrear hepatopatia, pancreatite e desnutrição, e oferecer sempre o encaminhamento ao CAPS-AD.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Titular pelo CIWA-Ar: escala simples que evita tanto a subdose quanto a sedação excessiva.',
        'Pergunte a hora da última dose: define quando esperar cada fase.',
        'Ambiente calmo, bem iluminado de dia e com reorientação frequente reduz muito a necessidade de sedativo.'
      ]}
    ] },

  { id:'crise-ansiedade', titulo:'Crise de ansiedade e ataque de pânico', categoria:'psiq', gravidade:'rotina',
    resumo:'Diagnóstico de exclusão: o que descartar antes e como conduzir sem medicalizar demais.',
    tags:['panico','ansiedade','hiperventilacao','crise conversiva','diagnostico de exclusao'],
    fonte:'ABP — Diretrizes de transtornos de ansiedade',
    secoes:[
      { tipo:'alerta', titulo:'É diagnóstico de exclusão', itens:[
        'Dor torácica, dispneia e palpitação também são infarto, TEP, arritmia e hipoglicemia.',
        'Primeira crise acima dos 40 anos merece investigação, não rótulo.',
        'Tremor, sudorese e taquicardia: pensar em tireotoxicose, abstinência e intoxicação por estimulante.',
        'Parestesia perioral e espasmo carpopedal indicam hiperventilação com alcalose respiratória.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Início súbito de medo intenso com sintomas físicos, pico em 10 minutos' },
        { tipo:'passo', rotulo:'Primeiro', texto:'ECG, glicemia capilar, oximetria e sinais vitais',
          nota:'Afastar causa orgânica antes de tranquilizar' },
        { tipo:'passo', rotulo:'Base do tratamento', texto:'*Ambiente calmo e reasseguramento*',
          nota:'Explicar que a crise passa sozinha em 20 a 30 minutos e não causa dano. Respiração lenta e diafragmática' },
        { tipo:'decisao', texto:'Cedeu com a abordagem verbal?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'Alta com orientação e encaminhamento' },
          { rotulo:'Não', texto:'*Benzodiazepínico em dose baixa*', nota:'Clonazepam 0,5 mg ou diazepam 5 a 10 mg VO' }
        ]},
        { tipo:'fim', rotulo:'Alta', texto:'Sintomas resolvidos, causa orgânica afastada, com encaminhamento à atenção primária ou à saúde mental' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Clonazepam', dose:'0,5 a 2 mg', via:'VO ou SL', obs:'Primeira escolha. Início em 20 a 30 minutos.' },
        { droga:'Diazepam', dose:'5 a 10 mg', via:'VO', obs:'Alternativa. Máximo de 30 mg/dia.' },
        { droga:'Lorazepam', dose:'1 a 2 mg', via:'VO', obs:'Meia-vida menor, útil no idoso e no hepatopata.' },
        { droga:'Prometazina 25 mg', dose:'1 comprimido', via:'VO', obs:'Alternativa quando se quer evitar benzodiazepínico.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Rotular como ansiedade sem ECG e sem glicemia.',
        'Respirar em saco de papel: prática abandonada, com risco de hipóxia.',
        'Prescrever benzodiazepínico de uso contínuo na alta do pronto-socorro — dependência em semanas.',
        'Dizer que "não é nada": invalida o sofrimento e piora a adesão.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta é a regra. Prescrever no máximo alguns comprimidos de resgate, nunca uso contínuo. O tratamento que funciona é *psicoterapia e inibidor de recaptação de serotonina*, iniciados no seguimento — não no plantão. Encaminhar à atenção primária ou à saúde mental e explicar que a crise recorre até o tratamento de base começar.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Nomear o que está acontecendo já reduz a crise: "isso é um ataque de pânico, vai passar em vinte minutos".',
        'Ensine a respiração diafragmática antes de medicar — funciona e não gera dependência.',
        'Registre que a causa orgânica foi afastada e como.'
      ]}
    ] },

  /* ======================= 09 · TRAUMA E ORTOPEDIA ======================= */
  { id:'atendimento-trauma', titulo:'Atendimento inicial ao politraumatizado (ABCDE)', categoria:'trauma', gravidade:'emergencia',
    resumo:'A sequência do ATLS, o exame primário e as intervenções que acontecem dentro de cada letra.',
    tags:['trauma','atls','abcde','exame primario','politraumatizado','xabcde'],
    fonte:'ATLS / SBAIT — Sociedade Brasileira de Atendimento Integrado ao Traumatizado',
    secoes:[
      { tipo:'alerta', titulo:'Regras que valem para todo trauma', itens:[
        'A sequência é *XABCDE*: hemorragia exsanguinante primeiro, depois via aérea.',
        'Não passe para a letra seguinte sem resolver a anterior.',
        'Reavalie do começo sempre que o paciente piorar.',
        'Hipotensão no trauma é hemorragia até prova em contrário.',
        'Hipotermia, acidose e coagulopatia formam a *tríade letal*: aqueça desde a porta.'
      ]},
      { tipo:'fluxo', titulo:'Avaliação primária — XABCDE', itens:[
        { tipo:'inicio', rotulo:'X', texto:'*Hemorragia exsanguinante* — compressão direta, torniquete, curativo compressivo',
          nota:'Torniquete 5 a 7 cm acima da lesão, apertado até parar o sangramento. Anote a hora' },
        { tipo:'passo', rotulo:'A', texto:'*Via aérea com proteção da coluna cervical*',
          nota:'Falar é o melhor teste. Indicações de via aérea definitiva: Glasgow ≤ 8, trauma de face, queimadura de via aérea' },
        { tipo:'passo', rotulo:'B', texto:'*Ventilação*: expor o tórax, inspecionar, palpar, percutir e auscultar',
          nota:'Procurar pneumotórax hipertensivo, aberto, hemotórax maciço e tórax instável' },
        { tipo:'passo', rotulo:'C', texto:'*Circulação*: dois acessos calibrosos, controlar hemorragia, avaliar perfusão',
          nota:'Fontes de sangramento: tórax, abdome, retroperitônio, pelve, ossos longos e o chão' },
        { tipo:'passo', rotulo:'D', texto:'*Neurológico*: Glasgow, pupilas, déficit motor e glicemia' },
        { tipo:'passo', rotulo:'E', texto:'*Exposição e prevenção de hipotermia* — despir tudo, depois aquecer',
          nota:'Manta térmica e soro aquecido. Rolar em bloco para examinar o dorso' },
        { tipo:'fim', rotulo:'Depois', texto:'Avaliação secundária: história AMPLA e exame da cabeça aos pés' }
      ]},
      { tipo:'lista', titulo:'Classes de choque hemorrágico', itens:[
        '*Classe I* — até 15% (750 mL): FC normal, PA normal. Cristaloide.',
        '*Classe II* — 15 a 30%: FC acima de 100, PA normal, pressão de pulso estreita, ansiedade.',
        '*Classe III* — 30 a 40%: FC acima de 120, hipotensão, confusão, oligúria. Sangue.',
        '*Classe IV* — acima de 40%: FC acima de 140, hipotensão grave, letargia, anúria. Protocolo maciço.',
        'A criança e o jovem mantêm a PA até muito tarde: use FC, TEC e nível de consciência.'
      ]},
      { tipo:'doses', titulo:'Medidas iniciais', itens:[
        { droga:'Cristaloide aquecido (Ringer lactato)', dose:'1000 mL no adulto; 20 mL/kg na criança', via:'EV', obs:'Não hiper-hidratar: o objetivo é a reposição com sangue precoce.' },
        { droga:'Concentrado de hemácias', dose:'Conforme a perda', via:'EV', obs:'Protocolo de transfusão maciça na classe III e IV: hemácia, plasma e plaqueta em 1:1:1.' },
        { droga:'Ácido tranexâmico', dose:'1 g em 10 minutos, depois 1 g em 8 horas', via:'EV', obs:'Só se iniciado em até 3 horas do trauma. Depois disso pode piorar.' },
        { droga:'Torniquete', dose:'—', via:'—', obs:'5 a 7 cm acima da lesão, apertar até cessar o sangramento. Registrar o horário.' },
        { droga:'Vacina dT ou dTpa', dose:'0,5 mL', via:'IM', obs:'Conforme o esquema vacinal e o tipo de ferida.' },
        { droga:'Manta térmica e soro aquecido', dose:'—', via:'—', obs:'Prevenir hipotermia é parte do tratamento do choque.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Pular para a tomografia com o paciente instável — instável vai para o centro cirúrgico.',
        'Infundir volumes enormes de cristaloide: dilui fatores, piora a coagulopatia e a hipotermia.',
        'Retirar objeto empalado no pronto-socorro.',
        'Esquecer de rolar o paciente e examinar o dorso e o períneo.',
        'Deixar o paciente exposto e frio depois de examinar.'
      ]},
      { tipo:'texto', titulo:'História AMPLA', conteudo:'*A*lergias · *M*edicações em uso · *P*assado médico e gestação · *L*íquidos e alimentos, hora da última ingesta · *A*mbiente e mecanismo do trauma. O mecanismo prediz a lesão: altura da queda, velocidade, uso de cinto, deformidade do veículo, tempo de encarceramento.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Reavalie do X sempre que o paciente piorar — não continue de onde parou.',
        'Anote o horário do torniquete: ele define a conduta cirúrgica depois.',
        'FAST à beira do leito responde rápido: líquido livre, tamponamento, pneumotórax.'
      ]}
    ] },

  { id:'tce', titulo:'Traumatismo cranioencefálico', categoria:'trauma', gravidade:'emergencia',
    resumo:'Glasgow, critérios de tomografia (Canadian CT Head), prevenção de lesão secundária.',
    tags:['tce','glasgow','canadian ct head','hematoma extradural','lesao secundaria'],
    fonte:'SBN Cirúrgica / ATLS — Recomendações de TCE',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Glasgow igual ou menor que 8: via aérea definitiva.',
        'Anisocoria com rebaixamento: herniação — manobras antiedema imediatas e neurocirurgia.',
        '*Tríade de Cushing* (hipertensão, bradicardia e alteração respiratória): hipertensão intracraniana avançada.',
        'Intervalo lúcido seguido de deterioração: hematoma extradural clássico.',
        'Anticoagulado ou antiagregado: tomografia mesmo com trauma leve e exame normal.',
        'Vômitos repetidos, convulsão, amnésia e fratura de base do crânio também pedem imagem.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Trauma craniano — classificar pelo Glasgow',
          nota:'Leve 13 a 15 · Moderado 9 a 12 · Grave 3 a 8' },
        { tipo:'passo', rotulo:'Sempre', texto:'XABCDE, colar cervical, *glicemia* e evitar hipotensão e hipóxia',
          nota:'Um único episódio de PAS abaixo de 90 ou SatO2 abaixo de 90% dobra a mortalidade' },
        { tipo:'decisao', texto:'Precisa de tomografia?', ramos:[
          { rotulo:'Glasgow ≤ 14, ou qualquer red flag', cor:'perigo', texto:'*Tomografia sem contraste, imediata*' },
          { rotulo:'Leve, sem red flag', cor:'ok', texto:'Observação de 4 a 6 horas e alta com orientação',
            nota:'Aplicar Canadian CT Head Rule ou New Orleans' }
        ]},
        { tipo:'decisao', texto:'Há sinal de hipertensão intracraniana?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Cabeceira a 30°, normocapnia, sedação e osmoterapia*',
            nota:'Manitol 0,25 a 1 g/kg ou salina hipertônica. Neurocirurgia imediata' },
          { rotulo:'Não', texto:'Observação neurológica seriada' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'Grave vai para terapia intensiva; leve com tomografia normal pode ir para casa com acompanhante' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Manitol 20%', dose:'0,25 a 1 g/kg', via:'EV', obs:'Em 20 minutos, se sinal de herniação. Vigiar volemia e sódio.' },
        { droga:'Salina hipertônica 3%', dose:'2 a 5 mL/kg', via:'EV', obs:'Alternativa ao manitol; preferível se houver hipotensão.' },
        { droga:'Fenitoína', dose:'20 mg/kg de ataque', via:'EV', obs:'Profilaxia de crise precoce no TCE grave, por 7 dias. Somente em SF 0,9%.' },
        { droga:'Sedação e analgesia', dose:'Fentanila + midazolam ou propofol', via:'EV', obs:'No intubado, para controlar a pressão intracraniana. Etomidato na indução, por estabilidade.' },
        { droga:'Cristaloide isotônico', dose:'Conforme a volemia', via:'EV', obs:'Manter PAS acima de 110 mmHg. NUNCA soro glicosado ou hipotônico: piora o edema.' },
        { droga:'Ácido tranexâmico', dose:'1 g em 10 min, depois 1 g em 8 h', via:'EV', obs:'No TCE com Glasgow 9 a 15, iniciado em até 3 horas.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Soro glicosado ou hipotônico: piora o edema cerebral.',
        'Hiperventilação profilática: causa isquemia. Só como medida de resgate na herniação iminente.',
        'Corticoide no TCE: aumenta mortalidade.',
        'Deixar o paciente hipotenso ou hipoxêmico, nem por poucos minutos.',
        'Dar alta a anticoagulado com trauma craniano sem tomografia.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* no TCE leve com tomografia normal (ou sem indicação de tomografia), Glasgow 15, sem vômito, sem álcool a bordo, com acompanhante adulto, e orientação escrita de retorno. *Internar* se houver alteração na tomografia, Glasgow abaixo de 15 mantido, vômitos persistentes, convulsão, coagulopatia, intoxicação que impeça a avaliação, ou ausência de acompanhante.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Sinais de fratura de base do crânio: hematoma periorbitário bilateral, retroauricular, otorragia e fístula liquórica.',
        'Registre o Glasgow discriminado em ocular, verbal e motor — a evolução é o que importa.',
        'No anticoagulado, reverter a anticoagulação é tão urgente quanto a imagem.'
      ]}
    ] },

  { id:'trauma-toracico', titulo:'Trauma torácico', categoria:'trauma', gravidade:'emergencia',
    resumo:'As lesões letais do exame primário: pneumotórax hipertensivo, aberto, hemotórax maciço e tórax instável.',
    tags:['trauma toracico','hemotorax','pneumotorax','torax instavel','drenagem'],
    fonte:'ATLS / SBAIT',
    secoes:[
      { tipo:'alerta', titulo:'As lesões que matam no B da avaliação primária', itens:[
        '*Pneumotórax hipertensivo*: diagnóstico clínico, tratamento imediato. Não espere radiografia.',
        '*Pneumotórax aberto*: curativo de três pontas, depois dreno em outro local.',
        '*Hemotórax maciço*: mais de 1500 mL de saída imediata, ou 200 mL/h por 4 horas — toracotomia.',
        '*Tamponamento cardíaco*: tríade de Beck — hipotensão, turgência jugular e bulhas abafadas.',
        '*Tórax instável* com contusão pulmonar: hipoxemia progressiva.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Trauma torácico fechado ou penetrante' },
        { tipo:'passo', rotulo:'Sempre', texto:'Expor o tórax: inspecionar, palpar, percutir e auscultar os dois lados',
          nota:'Oxigênio, monitorização, dois acessos e *FAST estendido* à beira do leito' },
        { tipo:'decisao', texto:'Há instabilidade com achado torácico?', ramos:[
          { rotulo:'MV abolido + hipertimpanismo + desvio de traqueia + turgência', cor:'perigo',
            texto:'*PNEUMOTÓRAX HIPERTENSIVO — descomprimir AGORA*',
            nota:'Punção no 5º espaço intercostal, linha axilar média (ou 2º espaço, linha hemiclavicular). Depois, dreno' },
          { rotulo:'MV abolido + macicez + choque', cor:'perigo', texto:'*HEMOTÓRAX MACIÇO — drenar e repor sangue*',
            nota:'Dreno calibroso no 5º espaço, linha axilar média. Avaliar toracotomia' },
          { rotulo:'Hipotensão + jugular + bulhas abafadas', cor:'perigo', texto:'*TAMPONAMENTO — pericardiocentese ou toracotomia*' },
          { rotulo:'Estável', texto:'Radiografia de tórax, ECG e tomografia conforme o mecanismo' }
        ]},
        { tipo:'passo', rotulo:'Sempre', texto:'*Analgesia adequada* — a dor impede a expansão e causa atelectasia e pneumonia',
          nota:'Fratura de arcos costais no idoso tem mortalidade alta por isso' },
        { tipo:'fim', rotulo:'Destino', texto:'Drenado e estável: enfermaria com fisioterapia. Instável: centro cirúrgico' }
      ]},
      { tipo:'doses', titulo:'Procedimentos e medicações', itens:[
        { droga:'Descompressão por agulha', dose:'Cateter 14G, 5 cm ou mais', via:'—', obs:'5º espaço intercostal na linha axilar média é hoje o local preferido no adulto.' },
        { droga:'Dreno de tórax', dose:'28 a 32 Fr no adulto', via:'—', obs:'5º espaço intercostal, linha axilar média, borda superior da costela inferior. Selo d\'água.' },
        { droga:'Curativo de três pontas', dose:'—', via:'—', obs:'No pneumotórax aberto, até drenar. Deixar um lado livre funcionando como válvula.' },
        { droga:'Dipirona', dose:'2 g', via:'EV', obs:'De 6/6 h. Analgesia é tratamento, não conforto.' },
        { droga:'Morfina', dose:'2 a 4 mg', via:'EV', obs:'Titulada. Cuidado com depressão respiratória na contusão pulmonar.' },
        { droga:'Bloqueio intercostal ou peridural', dose:'—', via:'—', obs:'Excelente em fraturas múltiplas de arcos costais, sobretudo no idoso.' },
        { droga:'Ácido tranexâmico', dose:'1 g em 10 min, depois 1 g em 8 h', via:'EV', obs:'Se houver hemorragia significativa e menos de 3 horas do trauma.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar radiografia para tratar pneumotórax hipertensivo: o diagnóstico é clínico.',
        'Ocluir completamente um pneumotórax aberto — transforma em hipertensivo.',
        'Clampear o dreno para transportar.',
        'Subestimar fratura de arcos costais no idoso: a mortalidade sobe com cada arco fraturado.',
        'Negar analgesia por medo de depressão respiratória — a dor causa mais atelectasia.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* todo pneumotórax, hemotórax, contusão pulmonar, tórax instável, fratura de mais de 2 arcos costais, fratura de 1º ou 2º arco (indica trauma de alta energia), fratura de esterno ou escápula, e qualquer trauma penetrante. Contusão simples de parede em jovem, com radiografia normal e boa mecânica respiratória, pode receber alta com analgesia potente, fisioterapia respiratória e retorno em 48 horas.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'FAST estendido detecta pneumotórax melhor que a radiografia em decúbito.',
        'Ausência de deslizamento pleural ao ultrassom afasta pneumotórax naquele ponto.',
        'Registre o débito do dreno por hora: é o que define a indicação cirúrgica.'
      ]}
    ] },

  { id:'trauma-abdominal', titulo:'Trauma abdominal e FAST', categoria:'trauma', gravidade:'emergencia',
    resumo:'Instável com FAST positivo vai para a sala cirúrgica; estável pode ir para a tomografia.',
    tags:['trauma abdominal','fast','laparotomia','contuso','penetrante'],
    fonte:'ATLS / CBC — Colégio Brasileiro de Cirurgiões',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Instabilidade hemodinâmica com FAST positivo: *laparotomia*, não tomografia.',
        'Sinal do cinto de segurança na parede abdominal: alto risco de lesão de víscera oca e de coluna lombar.',
        'Ferimento por arma de fogo que atravessa a cavidade: laparotomia na maioria dos casos.',
        'Evisceração, peritonite difusa ou instabilidade em trauma penetrante: centro cirúrgico.',
        'Fratura de pelve com instabilidade: cinta pélvica imediata — o sangramento é retroperitoneal e enorme.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Trauma abdominal fechado ou penetrante' },
        { tipo:'decisao', texto:'O paciente está estável?', ramos:[
          { rotulo:'Instável', cor:'perigo', texto:'*FAST à beira do leito*',
            nota:'FAST positivo com instabilidade = laparotomia imediata. Não vá para a tomografia' },
          { rotulo:'Estável', texto:'*Tomografia de abdome com contraste*',
            nota:'É o exame que define o tratamento não operatório' }
        ]},
        { tipo:'decisao', texto:'Fechado ou penetrante?', ramos:[
          { rotulo:'Fechado, estável, sem peritonite', cor:'ok', texto:'*Tratamento não operatório* com observação seriada',
            nota:'Lesões de fígado e baço em paciente estável são conduzidas sem cirurgia na maioria' },
          { rotulo:'Arma branca, estável', texto:'Explorar a ferida; se não violou o peritônio, observação' },
          { rotulo:'Arma de fogo transfixante', cor:'perigo', texto:'*Laparotomia*' }
        ]},
        { tipo:'passo', rotulo:'Não esquecer', texto:'Toque retal, exame do períneo, sondagem vesical e *cinta pélvica* se houver instabilidade da pelve',
          nota:'Uretrorragia, hematoma perineal ou próstata alta contraindicam a sondagem uretral' },
        { tipo:'fim', rotulo:'Destino', texto:'Observação com exames seriados, ou centro cirúrgico' }
      ]},
      { tipo:'doses', titulo:'Medidas', itens:[
        { droga:'Cristaloide aquecido', dose:'1000 mL no adulto; 20 mL/kg na criança', via:'EV', obs:'Reposição inicial, sem hiper-hidratar.' },
        { droga:'Concentrado de hemácias', dose:'Conforme a perda', via:'EV', obs:'Protocolo de transfusão maciça se houver hemorragia grave.' },
        { droga:'Ácido tranexâmico', dose:'1 g em 10 min, depois 1 g em 8 h', via:'EV', obs:'Em até 3 horas do trauma.' },
        { droga:'Cinta pélvica', dose:'—', via:'—', obs:'Na altura dos grandes trocânteres. Medida simples que reduz muito o sangramento.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'De 6/6 h. Analgesia não mascara o abdome cirúrgico.' },
        { droga:'Ceftriaxona + metronidazol', dose:'2 g + 500 mg', via:'EV', obs:'Se houver lesão de víscera oca ou contaminação.' },
        { droga:'Vacina dT', dose:'0,5 mL', via:'IM', obs:'Conforme o esquema vacinal.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Levar paciente instável para a tomografia.',
        'Sondar a uretra com uretrorragia, hematoma perineal ou próstata deslocada.',
        'Retirar objeto empalado.',
        'Negar analgesia por medo de mascarar o exame — não mascara.',
        'Confiar em um exame abdominal normal isolado: reavalie de forma seriada.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* todo trauma abdominal com alteração na tomografia, mecanismo de alta energia, sinal do cinto, dor persistente, ou trauma penetrante. Tratamento não operatório exige leito monitorizado, exames seriados e centro cirúrgico disponível. Trauma fechado leve, com exame normal, tomografia normal e observação de 6 a 12 horas sem alteração, pode receber alta com orientação e retorno.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'FAST negativo não exclui lesão: repita se o paciente piorar.',
        'Lesão de duodeno e pâncreas é a que mais escapa na tomografia inicial — reavalie a dor.',
        'Registre o mecanismo com detalhe: altura, velocidade, uso de cinto, deformidade do veículo.'
      ]}
    ] },

  { id:'trauma-raquimedular', titulo:'Trauma raquimedular', categoria:'trauma', gravidade:'emergencia',
    resumo:'Imobilização, choque neurogênico x hipovolêmico e critérios de imagem (NEXUS/Canadian C-Spine).',
    tags:['trauma raquimedular','coluna','nexus','choque neurogenico','colar cervical'],
    fonte:'ATLS / SBOT — Sociedade Brasileira de Ortopedia e Traumatologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Choque neurogênico*: hipotensão COM bradicardia e pele quente e seca — o oposto do hemorrágico.',
        'Lesão acima de C5 compromete o diafragma: insuficiência respiratória iminente.',
        'Priapismo, flacidez e arreflexia após trauma sugerem lesão medular.',
        'Paciente inconsciente ou intoxicado: imobilizar até afastar por imagem.',
        'Idoso com estenose de canal pode ter lesão medular *sem fratura* após trauma leve.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Trauma com suspeita de lesão de coluna',
          nota:'Imobilizar em bloco, colar cervical, prancha só para o transporte' },
        { tipo:'passo', rotulo:'Primeiro', texto:'XABCDE — a via aérea vem antes, com estabilização manual da cervical',
          nota:'Lesão alta pode exigir via aérea definitiva precoce' },
        { tipo:'decisao', texto:'Dá para liberar a coluna clinicamente?', ramos:[
          { rotulo:'Sim — critérios NEXUS ou Canadian C-Spine', cor:'ok',
            texto:'*Retirar o colar sem imagem*',
            nota:'NEXUS: sem dor na linha média posterior, sem déficit, alerta, sem intoxicação, sem lesão distrativa' },
          { rotulo:'Não', texto:'*Tomografia de coluna*; ressonância se houver déficit com tomografia normal' }
        ]},
        { tipo:'decisao', texto:'Há hipotensão?', ramos:[
          { rotulo:'Com taquicardia', cor:'perigo', texto:'*Choque hemorrágico* — procurar o sangramento' },
          { rotulo:'Com bradicardia e pele quente', texto:'*Choque neurogênico* — volume e vasopressor',
            nota:'Noradrenalina; atropina se bradicardia sintomática. Alvo de PAM 85 a 90 mmHg por 7 dias' }
        ]},
        { tipo:'passo', rotulo:'Documentar', texto:'Exame neurológico completo com nível sensitivo e motor (escala ASIA)',
          nota:'Toque retal para tônus e sensibilidade perianal — define lesão completa ou incompleta' },
        { tipo:'fim', rotulo:'Destino', texto:'Neurocirurgia ou ortopedia de coluna; terapia intensiva se houver lesão cervical alta' }
      ]},
      { tipo:'doses', titulo:'Medidas', itens:[
        { droga:'Noradrenalina', dose:'Titular em bomba', via:'EV', obs:'Alvo de PAM entre 85 e 90 mmHg nos primeiros 7 dias — melhora a perfusão medular.' },
        { droga:'Atropina', dose:'0,5 a 1 mg', via:'EV', obs:'Se bradicardia sintomática no choque neurogênico.' },
        { droga:'Cristaloide', dose:'Reposição cuidadosa', via:'EV', obs:'O choque neurogênico é distributivo: volume em excesso causa edema pulmonar.' },
        { droga:'Sondagem vesical', dose:'—', via:'—', obs:'Retenção urinária é regra na lesão medular; a bexiga distendida causa disreflexia.' },
        { droga:'Profilaxia de trombose', dose:'Enoxaparina 40 mg SC', via:'SC', obs:'1x/dia, assim que possível — o risco é altíssimo.' },
        { droga:'Prevenção de úlcera de pressão', dose:'—', via:'—', obs:'Retirar da prancha rígida assim que possível: escara em poucas horas.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Corticoide em altas doses*: abandonado, não melhora desfecho e aumenta complicação infecciosa.',
        'Manter o paciente em prancha rígida além do transporte.',
        'Assumir que hipotensão é neurogênica sem afastar hemorragia.',
        'Mobilizar sem manter o alinhamento em bloco.',
        'Esquecer o toque retal: define lesão completa ou incompleta.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo trauma raquimedular com déficit ou fratura interna, em serviço com neurocirurgia ou ortopedia de coluna. Lesão cervical alta vai para terapia intensiva pela chance de insuficiência ventilatória. Alta possível quando a coluna foi liberada por critério clínico (NEXUS ou Canadian) ou por imagem normal, sem déficit e com dor controlada.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Registre o nível sensitivo com precisão e o horário: é o que permite comparar a evolução.',
        'Choque quente e bradicárdico no trauma é neurogênico — mas só depois de afastar hemorragia.',
        'Tire o paciente da prancha rígida assim que possível.'
      ]}
    ] },

  { id:'queimaduras', titulo:'Queimaduras', categoria:'trauma', gravidade:'emergencia',
    resumo:'Regra dos nove, fórmula de Parkland, via aérea na lesão inalatória e critérios de centro de queimados.',
    tags:['queimadura','parkland','regra dos nove','lesao inalatoria','scq'],
    fonte:'SBQ / Ministério da Saúde — Cartilha para tratamento de emergência das queimaduras',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Queimadura em ambiente fechado, rouquidão, estridor, escarro carbonáceo ou vibrissas chamuscadas: *lesão inalatória* — intubar cedo, antes de a via aérea fechar.',
        'Queimadura circunferencial de tórax ou membro: escarotomia.',
        'Suspeitar de intoxicação por *monóxido de carbono* e *cianeto* em incêndio fechado.',
        'A oximetria é falsamente normal na intoxicação por monóxido: peça carboxi-hemoglobina.',
        'Queimadura elétrica de alta tensão: rabdomiólise, arritmia e lesão profunda maior que a aparente.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Parar a queimadura: retirar roupa e adornos, resfriar com água em temperatura ambiente por 20 minutos',
          nota:'Nunca gelo. Depois, aquecer o paciente: queimado hipotérmica rápido' },
        { tipo:'passo', rotulo:'A e B', texto:'*Avaliar via aérea com baixo limiar para intubar*',
          nota:'O edema progride nas primeiras horas. Intubar depois fica impossível' },
        { tipo:'passo', rotulo:'C', texto:'*Calcular a superfície corporal queimada* e iniciar a reposição',
          nota:'Regra dos nove no adulto; palma da mão do paciente = 1%. Contar só 2º e 3º graus' },
        { tipo:'passo', rotulo:'Fórmula de Parkland', texto:'*2 a 4 mL × peso × %SCQ de Ringer lactato em 24 horas*',
          nota:'Metade nas primeiras 8 horas contadas do TRAUMA, metade nas 16 seguintes' },
        { tipo:'passo', rotulo:'Titular', texto:'Ajustar pela *diurese*: 0,5 mL/kg/h no adulto, 1 mL/kg/h na criança',
          nota:'A fórmula é ponto de partida, não meta. A diurese manda' },
        { tipo:'fim', rotulo:'Destino', texto:'Centro de queimados conforme os critérios; curativo e analgesia nos demais' }
      ]},
      { tipo:'lista', titulo:'Critérios de encaminhamento a centro de queimados', itens:[
        'Superfície corporal queimada acima de 10% (2º grau) em adulto, ou acima de 5% em criança.',
        'Qualquer queimadura de 3º grau.',
        'Acometimento de face, mãos, pés, genitália, períneo ou articulações.',
        'Queimadura elétrica, inclusive por raio, ou química.',
        'Lesão inalatória.',
        'Queimado com comorbidade que complique o tratamento, ou com trauma associado.',
        'Criança em serviço sem estrutura pediátrica; suspeita de maus-tratos.'
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Ringer lactato — fórmula de Parkland', dose:'2 a 4 mL × peso (kg) × %SCQ', via:'EV', obs:'Metade nas primeiras 8 h a partir da hora do trauma. Titular pela diurese.' },
        { droga:'Morfina', dose:'2 a 4 mg', via:'EV', obs:'Titulada. A dor da queimadura é intensa; a via intramuscular não é confiável no queimado.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'De 6/6 h, associada.' },
        { droga:'Sulfadiazina de prata 1%', dose:'Camada de 2 a 3 mm', via:'TÓPICO', obs:'Após limpeza. Não usar na face nem em quem vai para centro de queimados sem combinar.' },
        { droga:'Vacina dT', dose:'0,5 mL', via:'IM', obs:'Queimadura é ferida tetanogênica.' },
        { droga:'Oxigênio a 100%', dose:'Máscara com reservatório', via:'—', obs:'Se houver suspeita de monóxido — reduz a meia-vida da carboxi-hemoglobina.' },
        { droga:'Hidroxocobalamina', dose:'5 g', via:'EV', obs:'Se houver suspeita de intoxicação por cianeto em incêndio fechado, com acidose e lactato alto.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Gelo no resfriamento: agrava a lesão.',
        'Estourar bolhas no pronto-socorro sem indicação.',
        'Pasta de dente, manteiga, borra de café ou qualquer produto caseiro.',
        'Antibiótico sistêmico profilático: não previne infecção e seleciona resistência.',
        'Confiar na oximetria de pulso na suspeita de monóxido — ela mente.',
        'Contar queimadura de 1º grau no cálculo da superfície.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* possível na queimadura de 2º grau superficial pequena, fora de áreas nobres, com dor controlada, curativo feito e retorno em 48 horas. *Internar ou transferir* conforme os critérios de centro de queimados. Reavaliação obrigatória em 48 horas: a profundidade da queimadura só fica clara depois de alguns dias.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Conte as 8 horas da fórmula a partir da *hora do trauma*, não da chegada.',
        'A palma da mão do paciente, com os dedos, vale 1% — serve para queimaduras irregulares.',
        'Use o campo *kg* do guia: a fórmula de Parkland é toda por peso.'
      ]}
    ] },

  { id:'fratura-exposta', titulo:'Fratura exposta', categoria:'trauma', gravidade:'urgencia',
    resumo:'Classificação de Gustilo, antibiótico e profilaxia antitetânica na primeira hora.',
    tags:['fratura exposta','gustilo','cefazolina','antitetanica','desbridamento'],
    fonte:'SBOT — Sociedade Brasileira de Ortopedia e Traumatologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Ausência de pulso distal: lesão vascular — cirurgia vascular imediata, antes da fixação.',
        'Dor desproporcional com dor ao estiramento passivo: síndrome compartimental.',
        'Antibiótico na *primeira hora* reduz infecção de forma significativa.',
        'Contaminação por solo, água parada ou fezes: acrescentar cobertura para clostrídio.',
        'Perda de segmento ósseo ou lesão extensa de partes moles: transferir a serviço de referência.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Fratura com solução de continuidade da pele comunicando com o foco' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Avaliar e registrar o exame neurovascular distal*',
          nota:'Pulso, perfusão, sensibilidade e motricidade — antes de qualquer manipulação' },
        { tipo:'passo', rotulo:'Na 1ª hora', texto:'*ANTIBIÓTICO + PROFILAXIA ANTITETÂNICA*',
          nota:'Cefazolina 2 g EV. Gustilo III: acrescentar gentamicina' },
        { tipo:'passo', rotulo:'Ferida', texto:'Retirar contaminantes grosseiros, cobrir com gaze úmida em soro e *não lavar exaustivamente no PS*',
          nota:'A lavagem definitiva é no centro cirúrgico. Fotografar antes de cobrir, se possível' },
        { tipo:'passo', rotulo:'Alinhar e imobilizar', texto:'Tração suave para alinhar, talas, e *reavaliar o neurovascular depois*',
          nota:'Se o pulso sumiu após a manipulação, desfazer e reavaliar' },
        { tipo:'fim', rotulo:'Definitivo', texto:'*Desbridamento cirúrgico em até 6 a 24 horas*, conforme o grau e a contaminação' }
      ]},
      { tipo:'lista', titulo:'Classificação de Gustilo-Anderson', itens:[
        '*Tipo I* — ferida menor que 1 cm, limpa, com lesão mínima de partes moles.',
        '*Tipo II* — ferida entre 1 e 10 cm, sem lesão extensa nem contaminação grosseira.',
        '*Tipo IIIA* — lesão extensa de partes moles, mas com cobertura óssea adequada.',
        '*Tipo IIIB* — perda de partes moles com exposição óssea; precisa de retalho.',
        '*Tipo IIIC* — qualquer fratura exposta com *lesão arterial* que exija reparo.'
      ]},
      { tipo:'doses', titulo:'Antibiótico e suporte', itens:[
        { droga:'Cefazolina', dose:'2 g', via:'EV', obs:'De 8/8 h. Gustilo I e II. Manter por 24 a 48 h após o fechamento.' },
        { droga:'Cefazolina + gentamicina', dose:'Cefazolina 2 g 8/8 h + gentamicina 5 mg/kg/dia', via:'EV', obs:'Gustilo III.' },
        { droga:'Penicilina cristalina ou ampicilina', dose:'Conforme o protocolo', via:'EV', obs:'Acrescentar se houver contaminação por solo ou matéria orgânica — cobertura de clostrídio.' },
        { droga:'Vacina dT', dose:'0,5 mL', via:'IM', obs:'Se a última dose foi há mais de 5 anos, ou se o esquema é incompleto ou desconhecido.' },
        { droga:'Imunoglobulina antitetânica', dose:'250 UI', via:'IM', obs:'Se esquema incompleto ou desconhecido em ferida de alto risco. Local diferente da vacina.' },
        { droga:'Dipirona 2 g + morfina', dose:'Dipirona 2 g EV; morfina 2 a 4 mg EV', via:'EV', obs:'Analgesia adequada antes de imobilizar.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Adiar o antibiótico esperando avaliação da ortopedia.',
        'Recolocar fragmento ósseo exposto para dentro no pronto-socorro.',
        'Irrigação de alto volume no PS: empurra contaminante para os planos profundos.',
        'Imobilizar sem reavaliar pulso, sensibilidade e motricidade depois.',
        'Fechar a ferida primariamente.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Toda fratura exposta interna, com antibiótico endovenoso e programação cirúrgica. O tempo até o desbridamento importa mais que a hora exata: idealmente em 6 a 24 horas. Gustilo IIIB e IIIC exigem serviço com cirurgia plástica e vascular. Registrar com precisão o exame neurovascular antes e depois de cada manipulação.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Fotografe a ferida uma vez e cubra: evita descobrir e recontaminar a cada avaliação.',
        'Anote o horário da primeira dose de antibiótico — é indicador de qualidade.',
        'Pulso presente não exclui lesão vascular: compare com o lado contralateral e meça o índice tornozelo-braquial se houver dúvida.'
      ]}
    ] },

  { id:'luxacoes', titulo:'Luxações: ombro, cotovelo e quadril', categoria:'trauma', gravidade:'urgencia',
    resumo:'Exame neurovascular antes e depois, técnicas de redução e imobilização.',
    tags:['luxacao','ombro','quadril','reducao','sedacao','nervo axilar'],
    fonte:'SBOT — Sociedade Brasileira de Ortopedia e Traumatologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Sempre* documentar o exame neurovascular antes e depois da redução.',
        'Luxação de joelho: alta chance de lesão da artéria poplítea — mesmo com pulso presente, avaliar com índice tornozelo-braquial ou angiotomografia.',
        'Luxação de quadril é urgência: reduzir em até 6 horas para evitar necrose avascular.',
        'Fratura-luxação: em geral não se reduz no pronto-socorro sem a ortopedia.',
        'Luxação exposta é emergência cirúrgica.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Deformidade articular com dor intensa e impotência funcional' },
        { tipo:'passo', rotulo:'Antes de tudo', texto:'*Exame neurovascular distal documentado*',
          nota:'Pulso, perfusão, sensibilidade e motricidade específicas de cada nervo em risco' },
        { tipo:'passo', rotulo:'Imagem', texto:'Radiografia em duas incidências *antes* da redução',
          nota:'Exceto quando há comprometimento vascular evidente — aí reduz primeiro' },
        { tipo:'passo', rotulo:'Reduzir', texto:'*Analgesia e sedação adequadas*, depois manobra específica',
          nota:'Músculo contraído impede a redução. Sedação consciente com fentanila e midazolam ou propofol' },
        { tipo:'passo', rotulo:'Depois', texto:'*Reavaliar o neurovascular* + radiografia de controle + imobilizar',
          nota:'Nunca dispense a radiografia pós-redução' },
        { tipo:'fim', rotulo:'Destino', texto:'Ortopedia; a maioria vai para casa imobilizada, com retorno em poucos dias' }
      ]},
      { tipo:'lista', titulo:'As mais comuns e o que vigiar', itens:[
        '*Ombro anterior* — a mais frequente. Vigiar nervo axilar: sensibilidade na região deltóidea. Imobilizar em tipoia por 1 a 3 semanas.',
        '*Cotovelo* — vigiar artéria braquial e nervos mediano e ulnar. Alta chance de fratura associada.',
        '*Quadril posterior* — membro em adução, rotação interna e encurtado. Vigiar nervo ciático. Reduzir em até 6 horas.',
        '*Patela* — reduz com extensão do joelho e pressão medial na patela. Fácil e muito agradecida.',
        '*Interfalangeana dos dedos* — tração longitudinal; imobilizar em leve flexão.',
        '*Joelho* — rara e gravíssima: lesão vascular em até um terço dos casos.'
      ]},
      { tipo:'doses', titulo:'Analgesia e sedação para a redução', itens:[
        { droga:'Fentanila 50 mcg/mL', dose:'1 mcg/kg', via:'EV', obs:'Titular. Analgesia antes da sedação.' },
        { droga:'Midazolam', dose:'0,02 a 0,05 mg/kg', via:'EV', obs:'Titulado em pequenas doses, com monitorização.' },
        { droga:'Propofol', dose:'0,5 a 1 mg/kg', via:'EV', obs:'Titulado. Causa hipotensão e apneia — tenha ambu e volume à mão.' },
        { droga:'Cetamina', dose:'1 mg/kg', via:'EV', obs:'Boa opção: mantém a hemodinâmica e o drive respiratório.' },
        { droga:'Bloqueio intra-articular com lidocaína 1%', dose:'10 a 20 mL', via:'INTRA-ARTICULAR', obs:'Alternativa à sedação no ombro, com boa taxa de sucesso.' },
        { droga:'Dipirona 2 g', dose:'1 ampola', via:'EV', obs:'Analgesia de base.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Tentar reduzir sem analgesia e sedação: dor e contratura impedem, e você machuca mais.',
        'Reduzir fratura-luxação sem a ortopedia.',
        'Dispensar a radiografia pós-redução.',
        'Deixar de documentar o neurovascular antes — depois não dá para saber se o déficit é seu.',
        'Insistir em manobras repetidas: cada tentativa aumenta o risco de fratura.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta após redução bem-sucedida, com neurovascular íntegro, radiografia de controle satisfatória, imobilização adequada e retorno à ortopedia em poucos dias. *Internar* se houver lesão vascular ou neurológica, fratura-luxação instável, luxação irredutível, luxação exposta, ou luxação de joelho — que exige vigilância vascular.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Documente o exame neurovascular *antes* da tentativa: é a sua proteção e a informação de que o colega precisa.',
        'Luxação de ombro recidivante em jovem costuma reduzir fácil, às vezes só com relaxamento.',
        'Luxação de joelho reduzida espontaneamente ainda precisa de avaliação vascular.'
      ]}
    ] },

  { id:'sindrome-compartimental', titulo:'Síndrome compartimental', categoria:'trauma', gravidade:'emergencia',
    resumo:'Dor desproporcional e dor ao estiramento passivo; pulso presente não exclui. Fasciotomia é o tratamento.',
    tags:['sindrome compartimental','fasciotomia','dor desproporcional','5 ps','pressao compartimental'],
    fonte:'SBOT — Sociedade Brasileira de Ortopedia e Traumatologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — os 5 P, mas a dor vem antes de tudo', itens:[
        '*Dor desproporcional* ao achado e que piora com o estiramento passivo do compartimento: o sinal mais precoce e mais confiável.',
        'Parestesia é o segundo a aparecer.',
        'Palidez, paralisia e ausência de pulso são *tardios* — quando chegam, o membro já está perdido.',
        'Pulso presente NÃO afasta o diagnóstico.',
        'Paciente sedado, intubado ou com bloqueio anestésico não relata dor: aí é preciso medir a pressão.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita', texto:'Dor desproporcional após fratura, trauma por esmagamento, queimadura circunferencial, gesso apertado ou reperfusão' },
        { tipo:'passo', rotulo:'Imediato', texto:'*Retirar gesso, tala, curativo e qualquer coisa constritiva*',
          nota:'Abrir tudo até a pele. Só isso já resolve alguns casos' },
        { tipo:'passo', rotulo:'Posição', texto:'Manter o membro no *nível do coração*',
          nota:'Não elevar: reduz a pressão de perfusão. Não abaixar: aumenta o edema' },
        { tipo:'passo', rotulo:'Testar', texto:'*Estiramento passivo* dos músculos do compartimento — dor intensa confirma a suspeita' },
        { tipo:'decisao', texto:'A suspeita persiste?', ramos:[
          { rotulo:'Clínica evidente', cor:'perigo', texto:'*FASCIOTOMIA IMEDIATA* — não espere medir nada',
            nota:'A janela é de 6 a 8 horas. Depois disso a lesão é irreversível' },
          { rotulo:'Duvidosa, ou paciente que não relata dor', texto:'*Medir a pressão do compartimento*',
            nota:'Pressão acima de 30 mmHg, ou delta-P (PA diastólica menos pressão do compartimento) abaixo de 30 mmHg' }
        ]},
        { tipo:'passo', rotulo:'Junto', texto:'Hidratar bem e monitorar *rabdomiólise*: CPK, potássio, função renal e mioglobinúria' },
        { tipo:'fim', rotulo:'Depois', texto:'Ferida deixada aberta; fechamento ou enxerto em segundo tempo' }
      ]},
      { tipo:'doses', titulo:'Medidas', itens:[
        { droga:'Retirar todo material constritivo', dose:'—', via:'—', obs:'Gesso, tala, curativo, bandagem. Abrir até a pele, dos dois lados.' },
        { droga:'Cristaloide', dose:'Hidratação vigorosa', via:'EV', obs:'Alvo de diurese de 200 a 300 mL/h se houver rabdomiólise.' },
        { droga:'Analgesia', dose:'Dipirona 2 g + morfina titulada', via:'EV', obs:'Não use bloqueio regional: mascara o sinal mais importante.' },
        { droga:'Oxigênio suplementar', dose:'—', via:'—', obs:'Otimizar a oferta de oxigênio ao tecido isquêmico.' },
        { droga:'Controle de potássio', dose:'—', via:'—', obs:'A reperfusão libera potássio: ECG e dosagens seriadas.' },
        { droga:'Fasciotomia', dose:'—', via:'—', obs:'Perna: duas incisões, quatro compartimentos. É o único tratamento definitivo.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Elevar o membro*: reduz a pressão de perfusão e piora a isquemia.',
        'Esperar a ausência de pulso para agir — é sinal tardio e o membro já está perdido.',
        'Bloqueio anestésico regional na suspeita: apaga o sinal que você precisa acompanhar.',
        'Adiar a fasciotomia para "reavaliar em algumas horas" quando a clínica é evidente.',
        'Confiar em uma medida isolada de pressão normal se a clínica é forte.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Toda suspeita interna, com reavaliação seriada e horária registrada. A fasciotomia é urgência: a janela para preservar o músculo é de 6 a 8 horas do início da isquemia. Após a fasciotomia, a ferida fica aberta e o fechamento é em segundo tempo, às vezes com enxerto. Vigiar rabdomiólise e lesão renal aguda por mioglobina.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Registre a hora de cada reavaliação e a intensidade da dor: a progressão é o diagnóstico.',
        'Se você está pensando em síndrome compartimental, já está atrasado — chame a ortopedia agora.',
        'Pergunte ao paciente se a dor mudou de caráter: a dor da síndrome é diferente da dor da fratura.'
      ]}
    ] },

  { id:'ferimentos-sutura', titulo:'Ferimentos e sutura no pronto-socorro', categoria:'trauma', gravidade:'rotina',
    resumo:'Limpeza, escolha do fio, tempo de retirada por região e as feridas que não devem ser fechadas.',
    tags:['sutura','ferimento','fio','nylon','anestesia local','retirada de pontos'],
    fonte:'CBC / Ministério da Saúde — Manejo de feridas',
    secoes:[
      { tipo:'alerta', titulo:'Quando NÃO suturar primariamente', itens:[
        'Ferida com mais de 6 a 12 horas em membro; mais de 24 horas em face.',
        'Mordedura (exceto face, com limpeza exaustiva e critério).',
        'Ferida muito contaminada, com corpo estranho ou tecido desvitalizado.',
        'Ferida puntiforme profunda.',
        'Paciente imunossuprimido, diabético descompensado ou com doença arterial periférica.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Ferimento corto-contuso' },
        { tipo:'passo', rotulo:'Antes da anestesia', texto:'*Avaliar e registrar função tendínea, motora, sensitiva e vascular distal*',
          nota:'Depois da anestesia não dá mais para avaliar. Testar cada tendão contra resistência' },
        { tipo:'passo', rotulo:'Limpeza', texto:'*Irrigação abundante com soro sob pressão* — 250 a 500 mL',
          nota:'É o que previne infecção, mais que qualquer antibiótico' },
        { tipo:'passo', rotulo:'Anestesia', texto:'Lidocaína 2% infiltrada nas bordas',
          nota:'Sem vasoconstritor até 4,5 mg/kg; com vasoconstritor até 7 mg/kg. Aspirar antes de injetar' },
        { tipo:'passo', rotulo:'Explorar', texto:'Procurar corpo estranho, tendão, osso e desbridar tecido desvitalizado',
          nota:'Radiografia se houver suspeita de corpo estranho radiopaco (vidro, metal)' },
        { tipo:'passo', rotulo:'Suturar', texto:'Sem tensão, aproximando as bordas, com o fio adequado ao local' },
        { tipo:'fim', rotulo:'Antes da alta', texto:'*Profilaxia antitetânica* + curativo + data de retirada dos pontos por escrito' }
      ]},
      { tipo:'lista', titulo:'Fio e tempo de retirada por região', itens:[
        '*Face*: náilon 5-0 ou 6-0 — retirar em 5 dias.',
        '*Couro cabeludo*: náilon 3-0 ou 2-0 — retirar em 7 a 10 dias.',
        '*Tronco*: náilon 3-0 ou 4-0 — retirar em 10 a 14 dias.',
        '*Membros superiores*: náilon 4-0 — retirar em 10 a 14 dias.',
        '*Membros inferiores e áreas de tensão*: náilon 3-0 ou 4-0 — retirar em 14 dias.',
        '*Mão*: náilon 5-0 — retirar em 10 dias.',
        'Náilon para pele; vicryl para planos profundos; prolene para vaso e anastomose.'
      ]},
      { tipo:'doses', titulo:'Anestesia e profilaxia', itens:[
        { droga:'Lidocaína 2% sem vasoconstritor', dose:'Até 4,5 mg/kg (cerca de 15 mL a 2% em 70 kg)', via:'INFILTRAÇÃO', obs:'Aquecer e injetar devagar, pela borda da ferida, dói menos.' },
        { droga:'Lidocaína 2% com vasoconstritor', dose:'Até 7 mg/kg', via:'INFILTRAÇÃO', obs:'Pode ser usada em extremidades com segurança na prática atual, mas evite em quem tem doença arterial.' },
        { droga:'Soro fisiológico 0,9%', dose:'250 a 500 mL', via:'IRRIGAÇÃO', obs:'Sob pressão, com seringa de 20 mL e agulha 18G.' },
        { droga:'Vacina dT', dose:'0,5 mL', via:'IM', obs:'Ferida limpa: se a última foi há mais de 10 anos. Ferida suja: mais de 5 anos, ou esquema incompleto.' },
        { droga:'Imunoglobulina antitetânica', dose:'250 UI', via:'IM', obs:'Ferida de alto risco com esquema incompleto, desconhecido, ou imunossuprimido.' },
        { droga:'Cefalexina 500 mg', dose:'1 cápsula', via:'VO', obs:'De 6/6 h por 7 dias. Só em ferida contaminada, mordedura, exposição de estrutura nobre ou imunossupressão.' },
        { droga:'Dipirona 500 mg', dose:'1 comprimido', via:'VO', obs:'De 6/6 h, se dor.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Anestesiar antes de avaliar a função — depois não dá mais.',
        'Suturar sob tensão: a ferida abre e cicatriza pior.',
        'Suturar ferida contaminada ou de mais de 12 horas em membro.',
        'Antibiótico de rotina em ferida limpa suturada.',
        'Dar alta sem informar por escrito a data e o local de retirada dos pontos.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta é a regra. *Encaminhar ou internar* se houver lesão de tendão, nervo, vaso ou osso; ferida extensa que exija centro cirúrgico; ferida de face com comprometimento estético importante; ou paciente sem condições de cuidado domiciliar. Orientar: curativo seco por 24 a 48 horas, depois lavar com água e sabão, trocar diariamente, e retornar se vermelhidão que se espalha, pus, febre, dor crescente ou abertura da ferida.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Irrigação abundante vale mais que qualquer antibiótico.',
        'Teste cada tendão contra resistência e registre — lesão parcial passa despercebida com facilidade.',
        'Na face, capriche: o resultado estético é o que o paciente vai lembrar.'
      ]}
    ] },

  { id:'mordeduras', titulo:'Mordeduras de animais e humanas', categoria:'trauma', gravidade:'urgencia',
    resumo:'Lavar exaustivamente, amoxicilina-clavulanato, profilaxia de raiva e tétano, e o que não suturar.',
    tags:['mordedura','cao','gato','raiva','amoxicilina clavulanato','pasteurella'],
    fonte:'Ministério da Saúde — Normas técnicas de profilaxia da raiva humana',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Mordedura de *gato* infecta muito mais que a de cão: ferida puntiforme e profunda, com Pasteurella.',
        'Mordedura em mão, sobretudo na articulação metacarpofalângica ("fight bite"), é alto risco de artrite séptica e tenossinovite.',
        'Mordedura *humana* tem flora mista com Eikenella e alta taxa de infecção.',
        'Classificar o acidente para a profilaxia antirrábica e registrar a decisão.',
        'Sinais de infecção em menos de 24 horas sugerem Pasteurella; após 48 horas, estafilococo ou estreptococo.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Mordedura de animal ou humana' },
        { tipo:'passo', rotulo:'A medida mais eficaz', texto:'*Lavagem exaustiva com água e sabão* + irrigação com soro sob pressão',
          nota:'Reduz a carga viral da raiva e a bacteriana. 500 mL ou mais' },
        { tipo:'passo', rotulo:'Avaliar', texto:'Profundidade, estruturas envolvidas, e função neurovascular e tendínea',
          nota:'Radiografia se houver suspeita de fratura, corpo estranho ou lesão articular' },
        { tipo:'decisao', texto:'Suturar?', ramos:[
          { rotulo:'Face, com limpeza exaustiva', texto:'*Pode suturar*, com critério e cobertura antibiótica' },
          { rotulo:'Mão, pé, puntiforme ou tardia', cor:'perigo', texto:'*NÃO suturar* — deixar por segunda intenção' }
        ]},
        { tipo:'passo', rotulo:'Profilaxias', texto:'*Antirrábica + antitetânica + antibiótico quando indicado*',
          nota:'Classificar o acidente conforme o Ministério da Saúde e o animal envolvido' },
        { tipo:'fim', rotulo:'Reavaliar em 48 h', texto:'Mordedura infecta com frequência — reavaliação é obrigatória' }
      ]},
      { tipo:'lista', titulo:'Profilaxia antirrábica — classificação', itens:[
        '*Contato indireto*: lavar, sem vacina.',
        '*Acidente leve* (lambedura de pele lesada, arranhadura, mordedura superficial de tronco ou membros): 2 doses de vacina, dias 0 e 3, com observação do animal por 10 dias.',
        '*Acidente grave* (cabeça, face, pescoço, mão, pé, polpa digital; múltiplas ou profundas; lambedura de mucosa; animal silvestre ou morcego): 4 doses (dias 0, 3, 7 e 14) *mais soro antirrábico 40 UI/kg*, infiltrado ao redor da ferida.',
        'Cão ou gato que possa ser observado por 10 dias muda a conduta — registrar.',
        'Morcego: sempre acidente grave, independentemente do tipo de contato.'
      ]},
      { tipo:'doses', titulo:'Medicações e profilaxias', itens:[
        { droga:'Lavagem com água e sabão', dose:'Abundante, por vários minutos', via:'—', obs:'Medida mais importante contra a raiva e a infecção bacteriana.' },
        { droga:'Amoxicilina + clavulanato 875/125 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h. Profilaxia 3 a 5 dias; ferida infectada 7 a 14 dias. Primeira escolha.' },
        { droga:'Doxiciclina 100 mg', dose:'1 comprimido', via:'VO', obs:'De 12/12 h por 7 dias, em alergia à penicilina.' },
        { droga:'Clindamicina + ciprofloxacino', dose:'Clinda 300 mg 6/6 h + cipro 500 mg 12/12 h', via:'VO', obs:'Alternativa em alergia.' },
        { droga:'Ampicilina + sulbactam', dose:'3 g', via:'EV', obs:'De 6/6 h, se houver infecção estabelecida com indicação de internação.' },
        { droga:'Vacina antirrábica', dose:'Conforme a classificação', via:'IM', obs:'Região deltóide; nunca no glúteo.' },
        { droga:'Soro antirrábico humano', dose:'40 UI/kg', via:'INFILTRAÇÃO', obs:'Infiltrar o máximo possível ao redor da ferida; o restante intramuscular em local distante.' },
        { droga:'Vacina dT', dose:'0,5 mL', via:'IM', obs:'Mordedura é ferida suja.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Suturar mordedura de mão ou pé.',
        'Deixar de classificar o acidente para a profilaxia antirrábica.',
        'Aplicar a vacina antirrábica no glúteo: a resposta imune é pior.',
        'Dispensar profilaxia antibiótica em mordedura de gato ou de mão.',
        'Liberar sem reavaliação em 48 horas.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na maioria, com profilaxias feitas, antibiótico quando indicado, curativo e retorno em 48 horas. *Internar* se houver infecção estabelecida com sinais sistêmicos, comprometimento articular ou tendíneo, mordedura extensa de face, imunossupressão, ou falha do tratamento oral. Notificar o acidente conforme o protocolo local.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A profilaxia antibiótica é indicada em: mordedura de gato, mão, face, genitália, ferida puntiforme profunda, lesão articular ou óssea, imunossuprimido, asplênico e cirrótico.',
        'Se o animal pode ser observado por 10 dias, registre isso — muda o esquema vacinal.',
        'Pergunte sobre a circunstância: mordedura não provocada em animal de rua eleva o risco de raiva.'
      ]}
    ] },

  { id:'entorse-tornozelo', titulo:'Entorses e regras de Ottawa', categoria:'trauma', gravidade:'rotina',
    resumo:'Quando o raio-X é dispensável, imobilização e orientação de alta.',
    tags:['entorse','ottawa','tornozelo','joelho','imobilizacao','rice'],
    fonte:'SBOT — Sociedade Brasileira de Ortopedia e Traumatologia',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Incapacidade de dar 4 passos, na hora do trauma e na avaliação: radiografar.',
        'Dor óssea na borda posterior ou na ponta dos maléolos: radiografar.',
        'Dor no navicular ou na base do 5º metatarso: radiografar o pé.',
        'Deformidade evidente, crepitação ou alteração neurovascular: fratura ou luxação.',
        'Equimose extensa e edema desproporcional podem indicar lesão da sindesmose.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Torção do tornozelo com dor e edema' },
        { tipo:'passo', rotulo:'Aplicar', texto:'*Regras de Ottawa para tornozelo e pé*',
          nota:'Sensibilidade próxima de 100% para fratura; evita radiografia desnecessária em cerca de 30% dos casos' },
        { tipo:'decisao', texto:'Algum critério de Ottawa presente?', ramos:[
          { rotulo:'Não', cor:'ok', texto:'*Sem radiografia* — tratar como entorse' },
          { rotulo:'Sim', texto:'*Radiografia* de tornozelo, de pé, ou ambas conforme o critério' }
        ]},
        { tipo:'passo', rotulo:'Tratar', texto:'*PRICE* + analgesia + carga conforme a dor',
          nota:'Proteção, repouso relativo, gelo, compressão e elevação nas primeiras 48 a 72 horas' },
        { tipo:'passo', rotulo:'Classificar', texto:'Grau I estiramento · Grau II ruptura parcial · Grau III ruptura completa',
          nota:'Grau III com instabilidade importante merece imobilização mais rígida e avaliação ortopédica' },
        { tipo:'fim', rotulo:'Alta', texto:'Com analgesia, orientação, muleta se necessário e encaminhamento à fisioterapia' }
      ]},
      { tipo:'lista', titulo:'Regras de Ottawa', itens:[
        'Radiografar o *tornozelo* se houver dor na zona maleolar E um destes: dor óssea na borda posterior ou ponta do maléolo lateral, dor óssea na borda posterior ou ponta do maléolo medial, ou incapacidade de dar 4 passos.',
        'Radiografar o *pé* se houver dor no médio-pé E um destes: dor óssea na base do 5º metatarso, dor óssea no navicular, ou incapacidade de dar 4 passos.',
        'As regras não se aplicam bem em intoxicado, com déficit sensitivo, com múltiplas lesões distrativas, ou em criança pequena.'
      ]},
      { tipo:'doses', titulo:'Medicações e medidas', itens:[
        { droga:'Dipirona 2 g', dose:'2 ampolas em 100 mL de SF 0,9%', via:'EV', obs:'Se a dor for intensa na chegada.' },
        { droga:'Cetoprofeno 100 mg', dose:'1 frasco em 100 mL de SF 0,9%', via:'EV', obs:'Correr em 20 minutos.' },
        { droga:'Ibuprofeno 600 mg', dose:'1 comprimido', via:'VO', obs:'De 8/8 h, após as refeições, por 5 dias.' },
        { droga:'Dipirona 500 mg', dose:'1 comprimido', via:'VO', obs:'De 6/6 h, se dor.' },
        { droga:'Diclofenaco gel 10 mg/g', dose:'Aplicar no local', via:'TÓPICO', obs:'De 8/8 h por 7 dias. Boa alternativa ao anti-inflamatório sistêmico.' },
        { droga:'Gelo local', dose:'15 a 20 minutos', via:'—', obs:'A cada 2 a 3 horas nas primeiras 48 horas, com pano entre o gelo e a pele.' },
        { droga:'Imobilização funcional (tornozeleira ou bota)', dose:'—', via:'—', obs:'Melhor que gesso na maioria: permite mobilização precoce, que acelera a recuperação.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Radiografar todo entorse: as regras de Ottawa evitam um terço dos exames sem perder fratura.',
        'Imobilização rígida prolongada em entorse grau I ou II: atrasa a recuperação.',
        'Repouso absoluto — a carga precoce conforme a dor melhora o desfecho.',
        'Dispensar a fisioterapia: a reabilitação proprioceptiva é o que previne a recidiva.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta em praticamente todos. *Encaminhar à ortopedia* se houver fratura, instabilidade importante, suspeita de lesão da sindesmose, ou dor persistente após 4 a 6 semanas. Orientar retorno se dor desproporcional, dormência, dedos frios ou arroxeados — sinais de imobilização apertada ou de síndrome compartimental.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Peça para o paciente tentar dar 4 passos: é o critério mais prático de Ottawa.',
        'Palpe a base do 5º metatarso sempre — a fratura ali é clássica e passa batida.',
        'Encaminhe à fisioterapia: sem reabilitação proprioceptiva, a recidiva é a regra.'
      ]}
    ] },

  /* ======================= 10 · PEDIATRIA ======================= */
  { id:'pcr-pediatrica', titulo:'Parada cardiorrespiratória na criança (PALS)', categoria:'pedia', gravidade:'emergencia',
    resumo:'Compressões e ventilações por faixa etária, doses por peso e as causas reversíveis mais comuns.',
    tags:['pcr pediatrica','pals','rcp crianca','adrenalina','bradicardia','desfibrilacao'],
    fonte:'SBP — Sociedade Brasileira de Pediatria / PALS',
    secoes:[
      { tipo:'alerta', titulo:'O que muda em relação ao adulto', itens:[
        'A parada da criança é *hipóxica* na maioria: a via aérea e a ventilação pesam mais que na do adulto.',
        'Bradicardia abaixo de 60 bpm com má perfusão *já é indicação de compressão torácica*, mesmo com pulso.',
        'Relação 15:2 com dois socorristas; 30:2 com um socorrista só.',
        'Compressão de *um terço do diâmetro ântero-posterior* do tórax: cerca de 4 cm no lactente e 5 cm na criança.',
        'Ritmo chocável é minoria — pense em hipóxia, hipovolemia e as demais causas reversíveis.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Reconhecer', texto:'Irresponsiva, sem respiração normal, sem pulso em 10 segundos',
          nota:'Pulso braquial no lactente, carotídeo ou femoral na criança' },
        { tipo:'passo', rotulo:'Iniciar', texto:'*RCP de alta qualidade* 15:2 com dois socorristas',
          nota:'100 a 120 compressões por minuto, retorno total do tórax, trocar a cada 2 minutos' },
        { tipo:'passo', rotulo:'Acesso', texto:'Venoso ou *INTRAÓSSEO* — não perder tempo tentando punção',
          nota:'Intraósseo após 2 tentativas ou 90 segundos sem sucesso' },
        { tipo:'decisao', texto:'Qual o ritmo?', ramos:[
          { rotulo:'Chocável (FV/TVsp)', cor:'perigo', texto:'*Desfibrilar 2 J/kg*, depois 4 J/kg',
            nota:'Cargas seguintes até 10 J/kg ou a dose adulta. Adrenalina após o 2º choque; amiodarona após o 3º' },
          { rotulo:'Não chocável (AESP/assistolia)', texto:'*Adrenalina o quanto antes*',
            nota:'0,01 mg/kg a cada 3 a 5 minutos. Buscar as causas reversíveis' }
        ]},
        { tipo:'passo', rotulo:'Causas', texto:'*Hipóxia primeiro* — depois hipovolemia, hipo e hipercalemia, hipoglicemia, hipotermia, acidose',
          nota:'E os T: pneumotórax, tamponamento, toxinas, trombose' },
        { tipo:'fim', rotulo:'Pós-parada', texto:'Alvo de SatO2 de 94 a 99%, normocapnia, PAS acima do percentil 5 e controle de temperatura' }
      ]},
      { tipo:'doses', titulo:'Medicações — tudo por quilo', itens:[
        { droga:'Adrenalina 1:10.000 (diluir 1 mL de 1:1000 em 9 mL de AD)', dose:'0,01 mg/kg = 0,1 mL/kg', via:'EV ou IO', obs:'A cada 3 a 5 minutos. Máximo de 1 mg por dose. Flush de 5 mL após.' },
        { droga:'Amiodarona', dose:'5 mg/kg', via:'EV ou IO', obs:'Em bolus na parada. Pode repetir até 3 doses. Máximo de 300 mg por dose.' },
        { droga:'Lidocaína', dose:'1 mg/kg', via:'EV ou IO', obs:'Alternativa à amiodarona.' },
        { droga:'Desfibrilação — 1º choque', dose:'2 J/kg', via:'—', obs:'Pás pediátricas abaixo de 10 kg ou 1 ano.' },
        { droga:'Desfibrilação — choques seguintes', dose:'4 J/kg', via:'—', obs:'Pode subir até 10 J/kg ou a carga do adulto.' },
        { droga:'Cristaloide em bolus', dose:'20 mL/kg', via:'EV ou IO', obs:'Se hipovolemia. Em cardiopata, 5 a 10 mL/kg com reavaliação.' },
        { droga:'Glicose 10%', dose:'2 a 5 mL/kg', via:'EV ou IO', obs:'Se hipoglicemia. No lactente, usar glicose a 10%, não a 50%.' },
        { droga:'Bicarbonato de sódio 8,4%', dose:'1 mEq/kg', via:'EV', obs:'Só em hipercalemia, acidose comprovada ou intoxicação por tricíclico.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Atrasar a compressão para conseguir acesso venoso — vá para o intraósseo.',
        'Hiperventilar: aumenta a pressão intratorácica e reduz o retorno venoso.',
        'Usar glicose a 50% no lactente: é hipertônica demais para a veia periférica.',
        'Esquecer a hipóxia, que é a causa mais comum na criança.'
      ]},
      { tipo:'texto', titulo:'Tamanhos e material', conteudo:'Tubo *sem balonete*: idade dividida por 4, mais 4. Tubo *com balonete*: idade dividida por 4, mais 3,5. Profundidade de fixação: diâmetro do tubo multiplicado por 3. Sonda de aspiração: o dobro do diâmetro do tubo. Fita de Broselow resolve tudo isso na hora, se disponível.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Anote o peso estimado logo no começo: todas as doses dependem dele. Fórmula rápida: (idade em anos × 2) + 8.',
        'Use o campo *kg* no topo do guia — ele resolve as doses por quilo desta página.',
        'Chame a família para perto quando possível: a presença durante a reanimação melhora o luto e não atrapalha.'
      ]}
    ] },

  { id:'crianca-gravemente-doente', titulo:'Reconhecimento da criança gravemente doente', categoria:'pedia', gravidade:'emergencia',
    resumo:'Triângulo de avaliação pediátrica e os sinais de gravidade que não dependem de exame.',
    tags:['triangulo de avaliacao','tap','sinais de gravidade','taquipneia','tempo de enchimento'],
    fonte:'SBP — Sociedade Brasileira de Pediatria',
    secoes:[
      { tipo:'alerta', titulo:'Sinais de alarme que exigem ação imediata', itens:[
        'Gemência, batimento de asa nasal, tiragem subcostal e head bobbing.',
        'Tempo de enchimento capilar acima de 3 segundos, extremidades frias, pulso fino.',
        'Letargia, irritabilidade que não se consola, ou recusa alimentar completa.',
        'Petéquias que não desaparecem à digitopressão, com febre.',
        'Bradicardia na criança doente é sinal *pré-parada*, não vagal.'
      ]},
      { tipo:'fluxo', titulo:'Triângulo de Avaliação Pediátrica', itens:[
        { tipo:'inicio', rotulo:'À porta, em 30 segundos', texto:'Olhar, ouvir e decidir antes de encostar' },
        { tipo:'paralelo', colunas:[
          { tipo:'passo', rotulo:'Aparência', texto:'Tônus, interação, consolabilidade, olhar e choro',
            nota:'O TICLS: tônus, interatividade, consolabilidade, look, speech' },
          { tipo:'passo', rotulo:'Respiração', texto:'Ruído, posição, tiragem, batimento de asa nasal' },
          { tipo:'passo', rotulo:'Circulação', texto:'Cor da pele: palidez, moteamento, cianose' }
        ]},
        { tipo:'decisao', texto:'Quantos lados estão alterados?', ramos:[
          { rotulo:'Nenhum', cor:'ok', texto:'Estável — seguir a avaliação com calma' },
          { rotulo:'Aparência só', texto:'Disfunção do sistema nervoso central ou metabólica' },
          { rotulo:'Respiração só', texto:'Desconforto respiratório' },
          { rotulo:'Dois ou três', cor:'perigo', texto:'*INSUFICIÊNCIA — sala de emergência agora*' }
        ]},
        { tipo:'passo', rotulo:'Depois', texto:'ABCDE completo com *glicemia capilar* e temperatura',
          nota:'Não esqueça o D de dextro: hipoglicemia imita quase tudo na criança' },
        { tipo:'fim', rotulo:'Reavaliar', texto:'Reavaliação seriada é o que detecta a piora — a criança compensa e descompensa rápido' }
      ]},
      { tipo:'lista', titulo:'Valores normais por idade', itens:[
        'Lactente até 1 ano: FC 100 a 160 · FR 30 a 60 · PAS mínima 70.',
        '1 a 2 anos: FC 90 a 150 · FR 24 a 40 · PAS mínima 70 + (2 × idade).',
        '3 a 5 anos: FC 80 a 140 · FR 22 a 34.',
        '6 a 12 anos: FC 70 a 120 · FR 18 a 30.',
        'Acima de 12 anos: FC 60 a 100 · FR 12 a 20 · PAS mínima 90.',
        'PAS mínima aceitável entre 1 e 10 anos: *70 + (2 × idade em anos)*.'
      ]},
      { tipo:'doses', titulo:'Primeiras medidas', itens:[
        { droga:'Oxigênio', dose:'Máscara não reinalante 10 a 15 L/min', via:'—', obs:'Alvo de SatO2 acima de 94%.' },
        { droga:'Glicemia capilar', dose:'—', via:'—', obs:'Em toda criança grave. Hipoglicemia abaixo de 54 mg/dL trata na hora.' },
        { droga:'Glicose 10%', dose:'2 a 5 mL/kg', via:'EV', obs:'Se hipoglicemia. Reavaliar em 15 minutos.' },
        { droga:'Cristaloide em bolus', dose:'10 a 20 mL/kg', via:'EV ou IO', obs:'Em 5 a 20 minutos, reavaliando a cada bolus. Menor volume em cardiopata e desnutrido.' },
        { droga:'Acesso intraósseo', dose:'—', via:'IO', obs:'Após 2 tentativas ou 90 segundos sem acesso venoso.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Confiar na pressão arterial: a criança mantém a PA até o colapso.',
        'Interpretar bradicardia como vagal na criança doente — é pré-parada.',
        'Adiar a glicemia capilar.',
        'Dar alta sem reavaliar depois de tratar a febre: a criança melhora muito com antitérmico e isso mascara.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* se dois ou três lados do triângulo estiverem alterados, se houver hipoxemia, desidratação moderada a grave, incapacidade de aceitar líquidos, idade abaixo de 3 meses com febre, doença de base descompensada, ou impossibilidade de retorno. Alta sempre com sinais de alarme explicados ao responsável e retorno definido.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Ouça a mãe: "está diferente de tudo que já teve" é um dos melhores preditores de gravidade.',
        'Reavalie depois do antitérmico — a criança que continua prostrada sem febre preocupa.',
        'Anote peso, FC, FR, SatO2 e TEC na passagem: é o que permite comparar.'
      ]}
    ] },

  { id:'desidratacao-crianca', titulo:'Desidratação e planos de hidratação', categoria:'pedia', gravidade:'urgencia',
    resumo:'Planos A, B e C: quem toma soro em casa, quem fica na sala e quem recebe expansão venosa.',
    tags:['desidratacao','plano a','plano b','plano c','soro de reidratacao','expansao'],
    fonte:'Ministério da Saúde / SBP — Manejo da diarreia e desidratação na infância',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Letargia, olhos muito encovados, prega cutânea que desfaz muito lentamente, bebe mal ou é incapaz de beber.',
        'Anúria por mais de 6 a 8 horas, ou fralda seca.',
        'Choque: TEC acima de 3 segundos, pulso fino, extremidades frias, hipotensão (que é tardia).',
        'Desidratação com abdome distendido e ausência de ruídos: pensar em íleo por hipocalemia.'
      ]},
      { tipo:'fluxo', titulo:'Planos A, B e C do Ministério da Saúde', itens:[
        { tipo:'inicio', rotulo:'Classificar', texto:'Avaliar estado geral, olhos, sede, sinal da prega e diurese' },
        { tipo:'decisao', texto:'Qual o grau?', ramos:[
          { rotulo:'Sem desidratação — Plano A', cor:'ok', texto:'*Tratamento em casa* com sais de reidratação oral',
            nota:'Menor de 1 ano: 50 a 100 mL após cada evacuação. Maior: 100 a 200 mL' },
          { rotulo:'Desidratação — Plano B', texto:'*TRO na unidade: 50 a 100 mL/kg em 4 horas*',
            nota:'Oferecer em colher ou copo, pouco e sempre. Reavaliar de hora em hora' },
          { rotulo:'Grave ou choque — Plano C', cor:'perigo', texto:'*Expansão venosa imediata*',
            nota:'20 mL/kg de SF 0,9% ou Ringer em 20 a 30 minutos; repetir até melhorar a perfusão' }
        ]},
        { tipo:'passo', rotulo:'No Plano B', texto:'Se vomitar, dar *ondansetrona* e retomar a TRO',
          nota:'Uma dose costuma resolver e evita a via venosa' },
        { tipo:'passo', rotulo:'Sempre', texto:'Manter aleitamento materno e alimentação habitual',
          nota:'Não suspender leite nem diluir fórmula' },
        { tipo:'fim', rotulo:'Reavaliar em 4 horas', texto:'Melhorou: Plano A em casa. Persiste: repetir o Plano B. Piorou: Plano C' }
      ]},
      { tipo:'doses', titulo:'Reposição', itens:[
        { droga:'Sais de reidratação oral (SRO) — Plano B', dose:'50 a 100 mL/kg', via:'VO', obs:'Em 4 horas, em pequenos volumes frequentes. É a via de escolha.' },
        { droga:'SRO — Plano A, manutenção em casa', dose:'50 a 100 mL após cada evacuação (menor de 1 ano)', via:'VO', obs:'100 a 200 mL na criança maior. Ofertar até a diarreia parar.' },
        { droga:'Cloreto de sódio 0,9% ou Ringer lactato — Plano C', dose:'20 mL/kg', via:'EV ou IO', obs:'Em 20 a 30 minutos. Repetir até 60 mL/kg reavaliando; no lactente menor de 1 ano, considerar etapas de 10 mL/kg.' },
        { droga:'Ondansetrona', dose:'0,15 mg/kg (máximo de 4 mg abaixo de 15 kg; 8 mg acima)', via:'VO ou EV', obs:'Dose única costuma bastar para permitir a TRO.' },
        { droga:'Zinco', dose:'10 mg/dia abaixo de 6 meses; 20 mg/dia acima', via:'VO', obs:'Por 10 a 14 dias. Reduz duração e recorrência da diarreia — recomendação do Ministério da Saúde.' },
        { droga:'Glicose 10%', dose:'2 a 5 mL/kg', via:'EV', obs:'Se hipoglicemia associada.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Refrigerante, suco industrializado ou soro caseiro mal preparado: a osmolaridade errada piora a diarreia.',
        'Suspender o aleitamento materno ou diluir a fórmula.',
        'Antiemético de rotina fora da ondansetrona; metoclopramida causa distonia com frequência na criança.',
        'Antidiarreico de motilidade (loperamida) em criança: risco de íleo e depressão do sistema nervoso.',
        'Ir direto para a veia sem tentar a TRO no Plano B.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* após Plano A ou B bem-sucedido, com a criança hidratada, aceitando líquidos, urinando, e com o responsável orientado sobre os sinais de alarme e o preparo do soro. *Internar* no Plano C, na falha do Plano B, se houver vômito incoercível, desnutrição grave, comorbidade, menos de 2 meses de idade, ou impossibilidade de retorno.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Pese a criança na chegada e na reavaliação: a variação de peso é o melhor marcador de resposta.',
        'Ensine o preparo do soro na frente do responsável e peça que ele repita.',
        'Ondansetrona antes de desistir da via oral evita muita punção.'
      ]}
    ] },

  { id:'gastroenterite-pedia', titulo:'Gastroenterite aguda na criança', categoria:'pedia', gravidade:'rotina',
    resumo:'Reidratação oral, ondansetrona, zinco e os sinais que indicam etiologia bacteriana.',
    tags:['gecal','diarreia','vomito','ondansetrona','zinco','rotavirus'],
    fonte:'SBP — Sociedade Brasileira de Pediatria',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Sangue nas fezes com febre alta e toxemia: disenteria, avaliar antibiótico.',
        'Vômito bilioso, distensão e parada de eliminação de gases: obstrução, não gastroenterite.',
        'Dor abdominal intensa e localizada: apendicite e invaginação entram no diferencial.',
        'Menor de 2 meses com diarreia é sempre caso de avaliação cuidadosa.',
        'Diarreia sanguinolenta com palidez e oligúria: síndrome hemolítico-urêmica.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Diarreia aguda, com ou sem vômito, em criança' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Classificar a desidratação* e aplicar o Plano A, B ou C' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Zinco* por 10 a 14 dias + manter alimentação e aleitamento',
          nota:'O zinco reduz duração, gravidade e recorrência — recomendação do Ministério da Saúde' },
        { tipo:'decisao', texto:'Precisa de antibiótico?', ramos:[
          { rotulo:'Não — a maioria', cor:'ok', texto:'*Rotavírus e norovírus*: só reidratação e zinco' },
          { rotulo:'Disenteria febril com toxemia', texto:'*Considerar antibiótico*',
            nota:'Azitromicina ou ceftriaxona. Coprocultura antes' },
          { rotulo:'Suspeita de E. coli produtora de toxina Shiga', cor:'perigo',
            texto:'*NÃO dar antibiótico*', nota:'Aumenta o risco de síndrome hemolítico-urêmica' }
        ]},
        { tipo:'fim', rotulo:'Alta', texto:'Hidratada, aceitando líquidos, com SRO, zinco e sinais de alarme explicados' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Sais de reidratação oral', dose:'Conforme o plano A, B ou C', via:'VO', obs:'Base do tratamento.' },
        { droga:'Zinco', dose:'10 mg/dia abaixo de 6 meses; 20 mg/dia acima', via:'VO', obs:'Por 10 a 14 dias, mesmo depois de a diarreia parar.' },
        { droga:'Ondansetrona', dose:'0,15 mg/kg', via:'VO ou EV', obs:'Máximo de 4 mg abaixo de 15 kg. Dose única para permitir a TRO.' },
        { droga:'Racecadotrila', dose:'1,5 mg/kg por dose', via:'VO', obs:'De 8/8 h, por até 7 dias. Antissecretor, seguro na criança acima de 3 meses.' },
        { droga:'Dipirona', dose:'10 a 15 mg/kg por dose', via:'VO ou EV', obs:'De 6/6 h, se dor ou febre.' },
        { droga:'Azitromicina', dose:'10 mg/kg/dia', via:'VO', obs:'Por 3 dias, na disenteria com indicação de antibiótico.' },
        { droga:'Ceftriaxona', dose:'50 a 75 mg/kg/dia', via:'EV ou IM', obs:'Se toxemia, menor de 3 meses ou imunossuprimido.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Loperamida em criança: risco de íleo paralítico e depressão neurológica.',
        'Antibiótico de rotina na diarreia aquosa — a maioria é viral.',
        'Antibiótico na suspeita de E. coli O157:H7: precipita síndrome hemolítico-urêmica.',
        'Jejum, dieta sem lactose de rotina ou diluição da fórmula.',
        'Metoclopramida como antiemético na criança: distonia aguda é frequente.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta é a regra. *Internar* se houver desidratação grave ou falha da reidratação oral, vômito incoercível, menos de 2 meses de idade, desnutrição grave, comorbidade, suspeita de abdome cirúrgico, ou impossibilidade de acompanhamento. Orientar retorno se sangue nas fezes, febre alta persistente, ausência de urina por mais de 6 a 8 horas, olhos encovados, prostração ou recusa de líquidos.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Zinco é a medida mais esquecida e uma das que mais funciona — prescreva sempre.',
        'Coprocultura só em disenteria, imunossuprimido, quadro grave ou surto.',
        'Verifique a caderneta: rotavírus é doença de não vacinado.'
      ]}
    ] },

  { id:'bronquiolite', titulo:'Bronquiolite viral aguda', categoria:'pedia', gravidade:'urgencia',
    resumo:'Suporte é o tratamento; critérios de internação e o que a diretriz desaconselha usar.',
    tags:['bronquiolite','vsr','lactente','oxigenio','soro fisiologico nasal','sibilancia'],
    fonte:'SBP — Diretrizes sobre bronquiolite viral aguda',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Apneia, sobretudo no lactente abaixo de 2 meses e no prematuro — é indicação de internação.',
        'Saturação persistentemente abaixo de 90 a 92% em ar ambiente.',
        'Esforço respiratório importante: tiragem intercostal e subdiafragmática, batimento de asa nasal, gemência.',
        'Incapacidade de mamar ou aceitar líquidos, ou desidratação.',
        'Menor de 3 meses, prematuro, cardiopata, pneumopata ou imunossuprimido: limiar baixo para internar.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Primeiro episódio de sibilância em lactente abaixo de 2 anos, após pródromo viral',
          nota:'Vírus sincicial respiratório é o agente mais comum. Sazonal' },
        { tipo:'passo', rotulo:'O tratamento é SUPORTE', texto:'*Oxigênio, aspiração de vias aéreas superiores e hidratação*',
          nota:'Não existe medicação que mude o curso da doença' },
        { tipo:'passo', rotulo:'Higiene nasal', texto:'Soro fisiológico e aspiração antes das mamadas e antes de dormir',
          nota:'A obstrução nasal é grande parte do desconforto no lactente, que respira pelo nariz' },
        { tipo:'decisao', texto:'Qual a gravidade?', ramos:[
          { rotulo:'Leve, saturando bem, mamando', cor:'ok', texto:'*Alta com orientação* e retorno em 24 a 48 h' },
          { rotulo:'Moderada — SatO2 abaixo de 92% ou esforço', texto:'*Internar*: oxigênio e hidratação',
            nota:'Cateter nasal; considerar cânula nasal de alto fluxo se disponível' },
          { rotulo:'Grave — apneia, exaustão, hipercapnia', cor:'perigo', texto:'*Terapia intensiva*',
            nota:'Ventilação não invasiva ou intubação' }
        ]},
        { tipo:'alerta', rotulo:'Não fazer', texto:'*Broncodilatador, corticoide e antibiótico de rotina*',
          nota:'Nenhum muda desfecho na bronquiolite. Fisioterapia respiratória também não' },
        { tipo:'fim', rotulo:'Curso', texto:'O pico é no 3º ao 5º dia; a tosse pode durar semanas' }
      ]},
      { tipo:'doses', titulo:'Suporte', itens:[
        { droga:'Soro fisiológico 0,9% nasal', dose:'2 a 5 gotas em cada narina', via:'NASAL', obs:'Antes das mamadas e do sono, seguido de aspiração. A medida mais eficaz.' },
        { droga:'Oxigênio', dose:'Titular', via:'Cateter nasal', obs:'Alvo de SatO2 acima de 90 a 92%.' },
        { droga:'Cânula nasal de alto fluxo', dose:'1 a 2 L/kg/min', via:'—', obs:'Se disponível, no caso moderado que não responde ao cateter.' },
        { droga:'Hidratação', dose:'Manutenção, fracionada', via:'VO, SNG ou EV', obs:'Fracionar as mamadas. Sonda enteral é preferível à veia quando só falta ingesta.' },
        { droga:'Dipirona ou paracetamol', dose:'10 a 15 mg/kg por dose', via:'VO', obs:'De 6/6 h, se febre ou desconforto.' },
        { droga:'Solução salina hipertônica 3% inalatória', dose:'4 mL', via:'INAL', obs:'Uso discutível; alguns serviços usam no paciente internado. Não é consenso.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Broncodilatador de rotina — a resposta é rara e não muda desfecho.',
        'Corticoide sistêmico ou inalatório: não funciona na bronquiolite.',
        'Antibiótico sem foco bacteriano identificado.',
        'Fisioterapia respiratória de rotina: não reduz tempo nem gravidade.',
        'Radiografia de tórax de rotina: leva a antibiótico desnecessário.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* se houver hipoxemia, esforço respiratório importante, apneia, incapacidade de manter a hidratação, idade abaixo de 2 a 3 meses, prematuridade, comorbidade cardiopulmonar, imunossupressão ou impossibilidade de retorno. Alta com higiene nasal ensinada, fracionamento das mamadas, sinais de alarme por escrito e reavaliação em 24 a 48 horas — o pico da doença é no 3º ao 5º dia.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Aspirar o nariz e reavaliar antes de decidir internar: muitos melhoram só com isso.',
        'Explique à família que a tosse dura semanas e isso é esperado — evita retornos ansiosos.',
        'Verifique se o lactente é candidato a palivizumabe (prematuro, cardiopata, pneumopata).'
      ]}
    ] },

  { id:'asma-pedia', titulo:'Crise de asma na criança', categoria:'pedia', gravidade:'emergencia',
    resumo:'Escore de gravidade, beta-2 com espaçador, corticoide oral e critérios de internação.',
    tags:['asma infantil','sibilancia','salbutamol','espaçador','prednisolona'],
    fonte:'SBP/SBPT — Recomendações para o manejo da asma na infância',
    secoes:[
      { tipo:'alerta', titulo:'Red flags — crise grave ou quase fatal', itens:[
        'Incapaz de falar frases, ou o lactente incapaz de mamar.',
        'Sonolência, confusão ou agitação: hipóxia ou hipercapnia.',
        '*Tórax silencioso* com esforço importante — sinal de gravidade extrema.',
        'Saturação abaixo de 92% em ar ambiente após o primeiro ciclo.',
        'Cianose, bradicardia ou exaustão: parada iminente.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Sibilância, tosse e esforço respiratório em criança com asma conhecida ou não' },
        { tipo:'passo', rotulo:'Primeira hora', texto:'*Salbutamol spray com espaçador, a cada 20 minutos, 3 vezes*',
          nota:'Spray com espaçador é superior à nebulização na crise leve a moderada' },
        { tipo:'passo', rotulo:'Junto', texto:'*Corticoide sistêmico na primeira hora*',
          nota:'Prednisolona 1 a 2 mg/kg VO. A via oral tem a mesma eficácia da venosa' },
        { tipo:'passo', rotulo:'Se moderada a grave', texto:'Associar *ipratrópio* nos 3 primeiros ciclos + oxigênio',
          nota:'Alvo de SatO2 entre 94 e 98% na criança' },
        { tipo:'decisao', texto:'Como está após a primeira hora?', ramos:[
          { rotulo:'Boa resposta', cor:'ok', texto:'*Alta* com corticoide por 3 a 5 dias e plano escrito' },
          { rotulo:'Resposta parcial', texto:'Manter tratamento e observar por mais 1 a 2 horas' },
          { rotulo:'Refratária', cor:'perigo', texto:'*Sulfato de magnésio* + internação',
            nota:'40 a 50 mg/kg EV em 20 minutos. Considerar terbutalina e terapia intensiva' }
        ]},
        { tipo:'fim', rotulo:'Sempre na alta', texto:'Conferir a técnica inalatória e entregar o plano de ação por escrito' }
      ]},
      { tipo:'doses', titulo:'Medicações — por quilo', itens:[
        { droga:'Salbutamol spray 100 mcg com espaçador', dose:'4 a 10 jatos', via:'INAL', obs:'A cada 20 minutos na 1ª hora. Um jato de cada vez, com 5 respirações entre eles.' },
        { droga:'Salbutamol solução para nebulização', dose:'0,15 mg/kg (mínimo 2,5 mg)', via:'INAL', obs:'Cerca de 1 gota por 3 kg, máximo de 20 gotas, em 3 a 5 mL de SF.' },
        { droga:'Brometo de ipratrópio', dose:'250 mcg abaixo de 20 kg; 500 mcg acima', via:'INAL', obs:'Nos 3 primeiros ciclos, associado ao beta-2, na crise moderada a grave.' },
        { droga:'Prednisolona', dose:'1 a 2 mg/kg/dia (máximo de 40 mg)', via:'VO', obs:'Por 3 a 5 dias, dose única diária. Sem necessidade de desmame.' },
        { droga:'Metilprednisolona', dose:'1 a 2 mg/kg', via:'EV', obs:'Se não tolerar a via oral.' },
        { droga:'Sulfato de magnésio', dose:'40 a 50 mg/kg (máximo de 2 g)', via:'EV', obs:'Em 20 minutos, na crise grave refratária à primeira hora.' },
        { droga:'Oxigênio', dose:'Titular', via:'Cateter ou máscara', obs:'Alvo de SatO2 entre 94 e 98%.' },
        { droga:'Terbutalina', dose:'0,01 mg/kg (máximo de 0,3 mg)', via:'SC', obs:'A cada 20 minutos, até 3 doses, na crise refratária.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Adiar o corticoide: quanto mais cedo, menor a chance de internação.',
        'Antibiótico de rotina — a maioria das crises é desencadeada por vírus.',
        'Sedar a criança em crise: mascara a exaustão e precipita a parada.',
        'Dar alta sem conferir a técnica inalatória com espaçador.',
        'Radiografia de tórax de rotina na crise típica.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* com boa resposta na primeira hora, saturação acima de 94% em ar ambiente, sem esforço, capaz de falar ou mamar, com corticoide por 3 a 5 dias, salbutamol de resgate, plano de ação escrito, técnica conferida e retorno em 48 horas. *Internar* na resposta parcial ou ausente, hipoxemia mantida, crise grave, história de crise quase fatal ou de internação em terapia intensiva, e sempre que não houver como retornar.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Espaçador com máscara abaixo de 4 anos; com bocal acima disso.',
        'Anote quantos ciclos foram feitos e a saturação após cada um: é o que mostra a resposta.',
        'Sibilância recorrente no lactente nem sempre é asma — mas trata-se a crise do mesmo jeito.'
      ]}
    ] },

  { id:'laringite', titulo:'Laringite aguda (crupe)', categoria:'pedia', gravidade:'urgencia',
    resumo:'Escore de Westley, dexametasona em dose única e adrenalina inalatória na obstrução grave.',
    tags:['crupe','laringite','estridor','westley','dexametasona','adrenalina inalatoria'],
    fonte:'SBP — Sociedade Brasileira de Pediatria',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Estridor em repouso* indica pelo menos crupe moderado: dexametasona e adrenalina nebulizada.',
        'Sialorreia, posição de tripé, voz abafada e febre alta com toxemia: pensar em *epiglotite* — não examinar a orofaringe, chamar anestesia e otorrino.',
        'Início súbito sem pródromo viral, em criança que estava brincando: corpo estranho.',
        'Estridor bifásico, cianose, exaustão ou queda do nível de consciência: obstrução grave.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Tosse ladrante, rouquidão e estridor inspiratório, após pródromo viral',
          nota:'Laringotraqueíte viral, mais comum entre 6 meses e 3 anos, de predomínio noturno' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Manter a criança calma, no colo do responsável*',
          nota:'Choro e agitação pioram a obstrução. Não examinar a garganta se houver suspeita de epiglotite' },
        { tipo:'decisao', texto:'Qual a gravidade (escore de Westley)?', ramos:[
          { rotulo:'Leve — sem estridor em repouso', cor:'ok', texto:'*Dexametasona em dose única* e alta',
            nota:'0,15 a 0,6 mg/kg VO. Observar por 2 a 4 horas' },
          { rotulo:'Moderada — estridor em repouso, tiragem', texto:'*Dexametasona + adrenalina nebulizada*',
            nota:'Observar por pelo menos 2 a 4 horas após a adrenalina, pelo efeito rebote' },
          { rotulo:'Grave — agitação, cianose, exaustão', cor:'perigo',
            texto:'*Adrenalina + oxigênio + terapia intensiva*', nota:'Preparar via aérea; tubo menor que o previsto pela idade' }
        ]},
        { tipo:'alerta', rotulo:'Atenção', texto:'*Efeito rebote da adrenalina em 2 horas*',
          nota:'Nunca dar alta logo após a nebulização com adrenalina' },
        { tipo:'fim', rotulo:'Alta', texto:'Sem estridor em repouso, sem tiragem, hidratada, 2 a 4 horas após a adrenalina' }
      ]},
      { tipo:'doses', titulo:'Medicações — por quilo', itens:[
        { droga:'Dexametasona', dose:'0,15 a 0,6 mg/kg (máximo de 10 mg)', via:'VO, IM ou EV', obs:'Dose única. A via oral funciona igual. É o tratamento de todo crupe, inclusive o leve.' },
        { droga:'Prednisolona', dose:'1 a 2 mg/kg', via:'VO', obs:'Alternativa quando não houver dexametasona.' },
        { droga:'Adrenalina 1:1000 nebulizada', dose:'0,5 mg/kg (máximo de 5 mL da solução 1:1000)', via:'INAL', obs:'Diluir em SF até 3 a 5 mL. Efeito em 10 a 30 minutos, dura 2 horas. Pode repetir.' },
        { droga:'Budesonida nebulizada', dose:'2 mg', via:'INAL', obs:'Alternativa ao corticoide sistêmico se houver vômito.' },
        { droga:'Oxigênio', dose:'Titular', via:'—', obs:'Se SatO2 abaixo de 92%. Oferecer sem agitar a criança.' },
        { droga:'Dipirona ou paracetamol', dose:'10 a 15 mg/kg por dose', via:'VO', obs:'Se febre ou desconforto.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Examinar a orofaringe com abaixador de língua na suspeita de epiglotite: pode precipitar a obstrução.',
        'Deixar a criança chorar ou separá-la do responsável.',
        'Dar alta logo depois da adrenalina nebulizada — efeito rebote.',
        'Antibiótico: o crupe é viral.',
        'Umidificação com vapor: sem evidência de benefício.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na laringite leve após dexametasona e observação, com orientação de retorno se surgir estridor em repouso, dificuldade para respirar, cianose ou prostração. *Internar* se houver estridor em repouso persistente após a adrenalina, hipoxemia, necessidade de doses repetidas, desidratação, idade abaixo de 6 meses, ou impossibilidade de retorno. Suspeita de epiglotite: sala de emergência com anestesia e otorrinolaringologia acionados.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Dexametasona em dose única serve para todos os graus, inclusive o leve — reduz retorno e internação.',
        'Registre no prontuário se houve estridor em repouso: é o que define a conduta.',
        'Verifique a caderneta: epiglotite por Haemophilus é doença de não vacinado.'
      ]}
    ] },

  { id:'febre-sem-foco', titulo:'Febre sem sinais localizatórios no lactente', categoria:'pedia', gravidade:'urgencia',
    resumo:'Conduta por faixa etária; abaixo de 3 meses a régua é outra.',
    tags:['febre sem foco','lactente','rochester','hemocultura','urocultura','menor de 3 meses'],
    fonte:'SBP — Sociedade Brasileira de Pediatria',
    secoes:[
      { tipo:'alerta', titulo:'A idade define tudo', itens:[
        '*Abaixo de 1 mês*: internação, investigação completa com líquor e antibiótico empírico. Sem exceção.',
        '*1 a 3 meses*: investigação completa; estratificar por critérios de baixo risco antes de decidir alta.',
        '*3 a 36 meses* com vacinação em dia e bom estado geral: risco de bacteremia oculta é baixo.',
        'Petéquias que não desaparecem à digitopressão com febre: meningococcemia — antibiótico imediato.',
        'Febre sem foco no lactente com aparência tóxica é sepse até prova em contrário.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Febre acima de 38 °C sem foco após anamnese e exame completos',
          nota:'Temperatura axilar acima de 37,8 °C ou retal acima de 38 °C' },
        { tipo:'decisao', texto:'Qual a idade?', ramos:[
          { rotulo:'Menor de 1 mês', cor:'perigo', texto:'*Internar + investigação completa + antibiótico*',
            nota:'Hemograma, PCR, urina, hemocultura, urocultura e LÍQUOR. Ampicilina + gentamicina ou cefotaxima' },
          { rotulo:'1 a 3 meses', texto:'*Investigação completa* e estratificar',
            nota:'Baixo risco: bom estado, leucócitos entre 5 e 15 mil, urina normal, PCR baixa. Aí pode observar' },
          { rotulo:'3 a 36 meses', cor:'ok', texto:'Avaliar estado geral e vacinação',
            nota:'Bom estado e vacinado: urina I e urocultura em quem tem risco de ITU; sintomático e retorno em 24 h' }
        ]},
        { tipo:'passo', rotulo:'Nunca esquecer', texto:'*Urina I e urocultura* — ITU é a bacteriana oculta mais comum',
          nota:'Colher por saco coletor só serve para triagem; cultura pede jato médio ou sondagem' },
        { tipo:'passo', rotulo:'Reavaliar', texto:'Examinar de novo depois que a febre ceder com antitérmico',
          nota:'A criança que continua prostrada sem febre preocupa muito' },
        { tipo:'fim', rotulo:'Alta', texto:'Bom estado, vacinada, acima de 3 meses, com retorno em 24 horas garantido' }
      ]},
      { tipo:'doses', titulo:'Antitérmicos e antibióticos empíricos', itens:[
        { droga:'Dipirona', dose:'10 a 15 mg/kg por dose', via:'VO ou EV', obs:'De 6/6 h. Gotas: 1 gota por kg, máximo de 40 gotas.' },
        { droga:'Paracetamol', dose:'10 a 15 mg/kg por dose', via:'VO', obs:'De 6/6 h. Máximo de 75 mg/kg/dia.' },
        { droga:'Ibuprofeno', dose:'5 a 10 mg/kg por dose', via:'VO', obs:'De 6/6 ou 8/8 h. Acima de 6 meses. Evitar se houver desidratação ou suspeita de dengue.' },
        { droga:'Ampicilina + gentamicina', dose:'Ampicilina 50 mg/kg/dose', via:'EV', obs:'Esquema do neonato: cobre Listeria, estreptococo do grupo B e Gram negativos.' },
        { droga:'Cefotaxima', dose:'50 mg/kg/dose', via:'EV', obs:'De 6/6 ou 8/8 h. Alternativa no neonato, associada à ampicilina.' },
        { droga:'Ceftriaxona', dose:'50 a 75 mg/kg/dia', via:'EV ou IM', obs:'Acima de 1 mês. Evitar no neonato ictérico.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Dar alta a lactente febril abaixo de 1 mês, em qualquer circunstância.',
        'Alternar antitérmicos de rotina: aumenta erro de dose sem benefício claro.',
        'Antibiótico empírico em criança acima de 3 meses, vacinada e em bom estado.',
        'Considerar a urocultura de saco coletor como diagnóstica.',
        'Banho frio ou álcool para baixar a febre.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* todo menor de 1 mês, o lactente de 1 a 3 meses que não preenche critérios de baixo risco, e qualquer criança com aparência tóxica, hipoxemia, desidratação, petéquias, imunossupressão ou doença de base. *Alta* na criança acima de 3 meses, vacinada, em bom estado, hidratada, com foco ausente e retorno garantido em 24 horas, com os sinais de alarme explicados ao responsável.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A febre em si não faz mal: o antitérmico é para conforto, não para prevenir convulsão.',
        'Registre o estado geral *após* o antitérmico — é o dado que mais orienta.',
        'Cheque a caderneta vacinal em toda febre sem foco.'
      ]}
    ] },

  { id:'convulsao-febril', titulo:'Crise febril', categoria:'pedia', gravidade:'urgencia',
    resumo:'Simples x complexa, quando investigar liquor e o que orientar aos pais.',
    tags:['convulsao febril','crise febril','simples','complexa','liquor','orientacao'],
    fonte:'SBP — Sociedade Brasileira de Pediatria',
    secoes:[
      { tipo:'alerta', titulo:'Simples ou complexa?', itens:[
        '*Simples*: generalizada, menos de 15 minutos, episódio único em 24 horas, entre 6 meses e 5 anos, sem déficit residual.',
        '*Complexa*: focal, mais de 15 minutos, ou repetida em 24 horas. Merece investigação.',
        'Punção lombar se houver sinal meníngeo, aparência tóxica, menor de 6 meses, ou uso recente de antibiótico que mascare.',
        'Fora da faixa de 6 meses a 5 anos, não chame de convulsão febril: investigue.',
        'Crise com mais de 5 minutos é *estado de mal* — trate como tal.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Crise convulsiva em criança de 6 meses a 5 anos, com febre e sem infecção do sistema nervoso' },
        { tipo:'passo', rotulo:'Se ainda convulsionando', texto:'*Benzodiazepínico* e cronometrar',
          nota:'Diazepam 0,2 a 0,5 mg/kg EV ou retal; midazolam 0,2 mg/kg IM ou nasal' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Glicemia capilar*, temperatura e exame neurológico',
          nota:'Procurar o foco da febre: otite, amigdalite, virose, ITU' },
        { tipo:'decisao', texto:'Simples ou complexa?', ramos:[
          { rotulo:'Simples, criança bem', cor:'ok', texto:'*Sem exames de rotina* — nem EEG, nem imagem, nem líquor',
            nota:'Investigar apenas o foco da febre. Observação e alta' },
          { rotulo:'Complexa, ou aparência tóxica', texto:'*Investigar*: líquor, imagem e EEG conforme o caso' },
          { rotulo:'Sinal meníngeo ou menor de 6 meses', cor:'perigo', texto:'*Punção lombar*' }
        ]},
        { tipo:'passo', rotulo:'Orientar', texto:'Explicar à família que é benigno e não causa dano cerebral',
          nota:'Um terço recorre; risco de epilepsia é pouco maior que o da população geral' },
        { tipo:'fim', rotulo:'Alta', texto:'Criança acordada, sem déficit, com foco da febre identificado e família orientada' }
      ]},
      { tipo:'doses', titulo:'Medicações — por quilo', itens:[
        { droga:'Diazepam', dose:'0,2 a 0,3 mg/kg EV (máximo de 10 mg)', via:'EV', obs:'Lento. Por via retal: 0,5 mg/kg, quando não há acesso.' },
        { droga:'Midazolam', dose:'0,2 mg/kg (máximo de 10 mg)', via:'IM ou nasal', obs:'Excelente quando não há acesso venoso.' },
        { droga:'Fenitoína', dose:'20 mg/kg', via:'EV', obs:'Se a crise não ceder com duas doses de benzodiazepínico. Somente em SF 0,9%, no máximo 1 mg/kg/min.' },
        { droga:'Fenobarbital', dose:'20 mg/kg', via:'EV', obs:'Alternativa; escolha no lactente pequeno. Prepare a via aérea.' },
        { droga:'Dipirona', dose:'10 a 15 mg/kg', via:'VO ou EV', obs:'Para conforto. Antitérmico NÃO previne recorrência.' },
        { droga:'Glicose 10%', dose:'2 a 5 mL/kg', via:'EV', obs:'Se hipoglicemia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Exames de rotina na convulsão febril simples: hemograma, eletrólitos, EEG e imagem não são indicados.',
        'Antitérmico profilático para evitar recorrência: não funciona.',
        'Anticonvulsivante de manutenção após crise febril simples.',
        'Banho frio ou álcool.',
        'Colocar objeto na boca ou conter a criança durante a crise.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Alta* na convulsão febril simples com a criança recuperada, foco da febre identificado e família orientada. *Internar* se a crise foi complexa, houve estado de mal, a criança tem menos de 6 meses ou mais de 5 anos, permanece com déficit ou sonolência, tem aparência tóxica, ou se há suspeita de infecção do sistema nervoso central. Orientar a família sobre o que fazer na próxima crise: deitar de lado, cronometrar, não conter, procurar atendimento se passar de 5 minutos.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'O maior tratamento aqui é a conversa com a família — o susto é enorme e o prognóstico é bom.',
        'Ensine a posição lateral de segurança e a cronometrar a crise.',
        'Registre a duração e se foi focal ou generalizada: é o que define simples ou complexa.'
      ]}
    ] },

  { id:'sepse-pediatrica', titulo:'Sepse na criança', categoria:'pedia', gravidade:'emergencia',
    resumo:'Reconhecimento pelos sinais de perfusão, volume em alíquotas e antibiótico na primeira hora.',
    tags:['sepse pediatrica','choque septico','crianca','expansao','20 ml/kg','antibiotico'],
    fonte:'ILAS/SBP — Protocolo de sepse pediátrica',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Hipotensão na criança é sinal *tardio* — não espere por ela para diagnosticar choque.',
        'TEC acima de 3 segundos, extremidades frias, pulso fino e taquicardia desproporcional à febre.',
        'Alteração do nível de consciência: irritabilidade ou letargia.',
        'Bradicardia na criança séptica indica parada iminente.',
        'Petéquias com febre: meningococcemia — antibiótico em minutos.'
      ]},
      { tipo:'fluxo', titulo:'Pacote da primeira hora', itens:[
        { tipo:'inicio', rotulo:'Reconhecer', texto:'Suspeita de infecção com sinal de má perfusão ou alteração do estado mental' },
        { tipo:'passo', rotulo:'0 a 5 min', texto:'Oxigênio, monitorização, *acesso venoso ou INTRAÓSSEO* e glicemia capilar',
          nota:'Não gaste mais que 90 segundos ou 2 tentativas tentando veia' },
        { tipo:'passo', rotulo:'0 a 15 min', texto:'Culturas e *primeiro bolus de 10 a 20 mL/kg*',
          nota:'Em 5 a 20 minutos, reavaliando perfusão, fígado e ausculta a cada bolus' },
        { tipo:'passo', rotulo:'Até 60 min', texto:'*ANTIBIÓTICO DE AMPLO ESPECTRO*',
          nota:'Ceftriaxona 50 a 75 mg/kg. Não atrasar esperando cultura além de 45 minutos' },
        { tipo:'decisao', texto:'Respondeu ao volume?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'Manter reavaliação frequente' },
          { rotulo:'Não, após 40 a 60 mL/kg', cor:'perigo', texto:'*Choque refratário a volume — iniciar droga vasoativa*',
            nota:'Choque frio (TEC lento, extremidades frias): adrenalina. Choque quente (pulso amplo, extremidades quentes): noradrenalina' }
        ]},
        { tipo:'alerta', rotulo:'Cuidado', texto:'Sinais de sobrecarga: estertores, hepatomegalia nova, piora do esforço',
          nota:'Aí pare o volume e vá para o inotrópico' },
        { tipo:'fim', rotulo:'Depois', texto:'Terapia intensiva pediátrica; considerar hidrocortisona se houver choque refratário a catecolamina' }
      ]},
      { tipo:'doses', titulo:'Medicações — por quilo', itens:[
        { droga:'Cristaloide (SF 0,9% ou Ringer lactato)', dose:'10 a 20 mL/kg por bolus', via:'EV ou IO', obs:'Em 5 a 20 minutos. Até 40 a 60 mL/kg na 1ª hora, reavaliando. Em desnutrido e cardiopata: 5 a 10 mL/kg.' },
        { droga:'Ceftriaxona', dose:'50 a 75 mg/kg/dia (máximo de 2 g)', via:'EV', obs:'Primeira hora. Acima de 1 mês.' },
        { droga:'Ampicilina + gentamicina ou cefotaxima', dose:'Ampicilina 50 mg/kg/dose', via:'EV', obs:'Neonato — cobrir Listeria e estreptococo do grupo B.' },
        { droga:'Adrenalina', dose:'0,05 a 0,3 mcg/kg/min', via:'EV ou IO', obs:'Bomba. Primeira droga no *choque frio*. Pode ser iniciada em veia periférica.' },
        { droga:'Noradrenalina', dose:'0,05 a 0,3 mcg/kg/min', via:'EV', obs:'Primeira droga no *choque quente*.' },
        { droga:'Glicose 10%', dose:'2 a 5 mL/kg', via:'EV', obs:'Se hipoglicemia — frequente e facilmente esquecida.' },
        { droga:'Hidrocortisona', dose:'2 mg/kg (máximo de 100 mg)', via:'EV', obs:'Se choque refratário a catecolamina ou suspeita de insuficiência adrenal.' },
        { droga:'Gluconato de cálcio 10%', dose:'0,5 a 1 mL/kg', via:'EV', obs:'Se hipocalcemia — comum no choque séptico pediátrico.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar hipotensão para diagnosticar choque.',
        'Atrasar o antibiótico esperando exame, imagem ou vaga.',
        'Insistir em acesso venoso periférico além de 90 segundos — vá para o intraósseo.',
        'Bolus de 20 mL/kg sem reavaliar entre eles, sobretudo em desnutrido e cardiopata.',
        'Esquecer a glicemia e o cálcio.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Toda sepse pediátrica interna, e o choque vai para terapia intensiva. Acionar a vaga desde o reconhecimento. Reavaliar perfusão, nível de consciência, diurese e lactato após cada intervenção. Considerar as causas de choque refratário: derrame pericárdico, pneumotórax, insuficiência adrenal, hipoglicemia, hipocalcemia e foco não drenado.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'PAS mínima aceitável entre 1 e 10 anos: 70 + (2 × idade em anos).',
        'Use o campo *kg* no topo do guia: todas as doses desta página são por quilo.',
        'Anote o volume total infundido e a hora do antibiótico — os dois dados que a UTI vai pedir.'
      ]}
    ] },

  { id:'ivas-pedia', titulo:'IVAS, otite e faringite', categoria:'pedia', gravidade:'rotina',
    resumo:'Quem precisa de antibiótico de verdade, critérios de Centor e orientação de sinais de alarme.',
    tags:['ivas','otite','faringite','amoxicilina','centor','resfriado'],
    fonte:'SBP — Sociedade Brasileira de Pediatria',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Esforço respiratório, taquipneia, hipoxemia ou gemência: já não é só via aérea superior.',
        'Febre por mais de 5 dias, ou que retorna após melhora: complicação bacteriana.',
        'Recusa alimentar completa, sinais de desidratação ou prostração.',
        'Menor de 3 meses com febre exige investigação, não sintomático.',
        'Estridor, sialorreia ou voz abafada: obstrução de via aérea.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Coriza, obstrução nasal, tosse, febre baixa e dor de garganta em criança' },
        { tipo:'passo', rotulo:'Confirmar que é viral', texto:'Sem esforço respiratório, ausculta limpa, orofaringe sem exsudato típico',
          nota:'Tosse, coriza e conjuntivite apontam para vírus e afastam estreptococo' },
        { tipo:'passo', rotulo:'Tratamento', texto:'*Lavagem nasal, hidratação, antitérmico e observação*',
          nota:'A lavagem nasal com soro é a medida mais eficaz no lactente, que respira pelo nariz' },
        { tipo:'decisao', texto:'Há critério para antibiótico?', ramos:[
          { rotulo:'Não — a imensa maioria', cor:'ok', texto:'*Sem antibiótico*',
            nota:'Explicar que o quadro dura 7 a 10 dias e a tosse pode passar de 2 semanas' },
          { rotulo:'Otite média aguda com abaulamento', texto:'*Amoxicilina* 45 a 90 mg/kg/dia' },
          { rotulo:'Faringite com Centor alto e sem sintoma viral', texto:'*Amoxicilina ou penicilina benzatina*' },
          { rotulo:'Sinusite: 10 dias sem melhora, ou piora após melhora', texto:'*Amoxicilina-clavulanato*' }
        ]},
        { tipo:'fim', rotulo:'Alta', texto:'Com lavagem nasal ensinada, sinais de alarme explicados e retorno se piorar' }
      ]},
      { tipo:'doses', titulo:'Medicações — por quilo', itens:[
        { droga:'Soro fisiológico 0,9% nasal', dose:'2 a 5 gotas ou 1 a 3 mL por narina', via:'NASAL', obs:'De 4/4 h e antes das mamadas. Aspirar em seguida no lactente. É o tratamento principal.' },
        { droga:'Dipirona', dose:'10 a 15 mg/kg por dose', via:'VO', obs:'De 6/6 h, se febre ou dor. Gotas: 1 gota por kg.' },
        { droga:'Paracetamol', dose:'10 a 15 mg/kg por dose', via:'VO', obs:'De 6/6 h. Máximo de 75 mg/kg/dia.' },
        { droga:'Ibuprofeno', dose:'5 a 10 mg/kg por dose', via:'VO', obs:'De 6/6 ou 8/8 h, acima de 6 meses.' },
        { droga:'Amoxicilina', dose:'45 a 90 mg/kg/dia', via:'VO', obs:'Dividido de 8/8 ou 12/12 h, por 10 dias. Otite e faringite estreptocócica.' },
        { droga:'Amoxicilina + clavulanato', dose:'45 a 90 mg/kg/dia de amoxicilina', via:'VO', obs:'De 12/12 h por 10 dias. Sinusite bacteriana ou falha da amoxicilina.' },
        { droga:'Azitromicina', dose:'10 mg/kg/dia', via:'VO', obs:'Por 5 dias. Só em alergia à penicilina.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Antibiótico para resfriado comum — é a prescrição desnecessária mais frequente na pediatria.',
        'Antitussígeno e descongestionante sistêmico abaixo de 6 anos: sem eficácia e com risco real.',
        'Descongestionante nasal tópico por mais de 3 dias.',
        'Ácido acetilsalicílico em criança: síndrome de Reye.',
        'Corticoide sistêmico para quadro viral de vias aéreas superiores.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta é a regra. *Internar* se houver hipoxemia, esforço respiratório, desidratação, recusa alimentar completa, idade abaixo de 3 meses com febre, ou impossibilidade de retorno. Orientar retorno se falta de ar, febre por mais de 3 a 5 dias, febre que volta depois de melhorar, recusa de líquidos, prostração, ou piora do estado geral.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Ensine a lavagem nasal na frente do responsável e peça que ele repita — muda muito o conforto do bebê.',
        'Diga quanto tempo dura: sem isso, a família volta no terceiro dia achando que piorou.',
        'Criança pequena tem 6 a 8 resfriados por ano — isso é normal e não é imunodeficiência.'
      ]}
    ] },

  { id:'maus-tratos', titulo:'Suspeita de maus-tratos e violência', categoria:'pedia', gravidade:'urgencia',
    resumo:'Sinais de alerta, notificação compulsória e a documentação que protege a criança.',
    tags:['maus tratos','violencia','notificacao compulsoria','conselho tutelar','abuso'],
    fonte:'SBP / Ministério da Saúde — Linha de cuidado para atenção a crianças em situação de violência',
    secoes:[
      { tipo:'alerta', titulo:'Sinais que devem levantar a suspeita', itens:[
        'História incompatível com a lesão, ou que muda a cada vez que é contada.',
        'Atraso inexplicado em procurar atendimento.',
        'Lesão incompatível com o desenvolvimento motor: fratura em bebê que ainda não anda.',
        'Equimoses em locais protegidos — orelhas, pescoço, tronco, região glútea, coxas internas.',
        'Marcas com padrão: queimadura em luva ou bota, marca de cinto, de mordida, de cigarro.',
        'Fraturas múltiplas em estágios diferentes de consolidação.',
        'Hemorragia retiniana com rebaixamento no lactente: síndrome do bebê sacudido.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Suspeita levantada', texto:'Qualquer sinal de alerta na história ou no exame' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Garantir a segurança e tratar as lesões*',
          nota:'A criança não pode voltar para o ambiente de risco. Internar é uma medida de proteção legítima' },
        { tipo:'passo', rotulo:'Documentar', texto:'*Exame completo, despido, com descrição detalhada e datada*',
          nota:'Localização, tamanho, forma e cor de cada lesão. Fotografar quando o serviço permitir' },
        { tipo:'passo', rotulo:'Entrevistar', texto:'Ouvir a criança *separadamente* do acompanhante, sem induzir',
          nota:'Registrar as falas entre aspas, com as palavras dela. Não repetir a entrevista várias vezes' },
        { tipo:'passo', rotulo:'Investigar', texto:'Conforme a idade e a suspeita: inquérito ósseo, tomografia de crânio, fundo de olho, coagulograma',
          nota:'Abaixo de 2 anos, inquérito ósseo radiológico completo. Fundo de olho no lactente com suspeita de trauma craniano' },
        { tipo:'alerta', rotulo:'Obrigatório', texto:'*NOTIFICAÇÃO COMPULSÓRIA + CONSELHO TUTELAR*',
          nota:'Não depende de certeza diagnóstica. É dever legal e não configura quebra de sigilo' },
        { tipo:'fim', rotulo:'Depois', texto:'Serviço social, saúde mental e rede de proteção acionados' }
      ]},
      { tipo:'lista', titulo:'Obrigações legais', itens:[
        'Notificação compulsória *imediata* de suspeita ou confirmação, conforme o Estatuto da Criança e do Adolescente e a Lei 13.431/2017.',
        'Comunicação ao *Conselho Tutelar* — na ausência dele, à autoridade judiciária ou ao Ministério Público.',
        'A notificação é dever do profissional e independe de confirmação diagnóstica; a omissão é infração.',
        'Não cabe ao médico investigar autoria: cabe proteger, documentar e notificar.',
        'Em violência sexual, acionar também o protocolo específico: profilaxias em até 72 horas e serviço de referência.'
      ]},
      { tipo:'doses', titulo:'Investigação por idade', itens:[
        { droga:'Inquérito ósseo radiológico completo', dose:'—', via:'—', obs:'Obrigatório abaixo de 2 anos com suspeita de maus-tratos físicos. Repetir em 2 semanas aumenta a sensibilidade.' },
        { droga:'Tomografia de crânio', dose:'—', via:'—', obs:'Lactente com lesão suspeita, alteração neurológica ou fratura de crânio.' },
        { droga:'Fundo de olho por oftalmologista', dose:'—', via:'—', obs:'Hemorragia retiniana é marca do trauma por sacudida.' },
        { droga:'Coagulograma, plaquetas, TP e TTPA', dose:'—', via:'—', obs:'Afastar coagulopatia como causa das equimoses.' },
        { droga:'Cálcio, fósforo, fosfatase alcalina e vitamina D', dose:'—', via:'—', obs:'Afastar raquitismo e osteogênese imperfeita nas fraturas.' },
        { droga:'Sorologias e profilaxias', dose:'Conforme protocolo', via:'—', obs:'Em violência sexual: HIV, sífilis, hepatites, contracepção de emergência e PEP em até 72 h.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Confrontar ou acusar o acompanhante: coloca a criança em risco e compromete a investigação.',
        'Deixar de notificar por falta de certeza — a notificação é de *suspeita*.',
        'Devolver a criança ao ambiente de risco enquanto não houver medida de proteção.',
        'Repetir a entrevista com a criança várias vezes: revitimiza.',
        'Registrar de forma vaga: "lesões pelo corpo" não serve para nada depois.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar sempre que houver dúvida sobre a segurança da criança*, mesmo que a lesão não exija internação clínica — é medida de proteção prevista e aceita. A alta só ocorre com o Conselho Tutelar acionado e um plano de proteção definido, preferencialmente com a rede de assistência social envolvida. Registrar tudo com precisão: o prontuário se tornará documento jurídico.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Descreva as lesões com localização, forma, tamanho e cor — desenhe num diagrama corporal se houver.',
        'Anote as falas da criança entre aspas, exatamente como ela disse.',
        'Notificar não é acusar: é acionar a proteção. Na dúvida, notifique.',
        'Disque 100 é o canal nacional de denúncia e pode ser informado à família em situações de risco.'
      ]}
    ] },

  /* ======================= 11 · INTOXICAÇÕES ======================= */
  { id:'intoxicado-abordagem', titulo:'Abordagem geral do paciente intoxicado', categoria:'toxico', gravidade:'emergencia',
    resumo:'Suporte primeiro, síndromes tóxicas (toxidromes), descontaminação e o telefone do CIATox.',
    tags:['intoxicacao','toxidrome','carvao ativado','ciatox','lavagem gastrica','antidoto'],
    fonte:'ABRACIT — Associação Brasileira de Centros de Informação e Assistência Toxicológica',
    secoes:[
      { tipo:'alerta', titulo:'Regras gerais', itens:[
        '*Trate o paciente, não o veneno*: ABCDE vem antes de identificar a substância.',
        'Glicemia capilar em todo rebaixamento — é o antídoto mais esquecido.',
        'Reconhecer a *síndrome tóxica* orienta o tratamento mesmo sem saber a substância.',
        'Carvão ativado só na primeira 1 a 2 hora, com via aérea protegida.',
        'Lavagem gástrica e xarope de ipeca estão abandonados.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Rebaixamento, agitação ou sintoma inexplicado com suspeita de exposição' },
        { tipo:'passo', rotulo:'ABCDE', texto:'Via aérea, ventilação, circulação, *glicemia* e temperatura',
          nota:'EPI da equipe se houver risco de contaminação secundária' },
        { tipo:'passo', rotulo:'Identificar a síndrome', texto:'Pupilas, pele, mucosas, ruídos intestinais, temperatura e nível de consciência',
          nota:'É o que separa colinérgico de anticolinérgico, opioide de simpaticomimético' },
        { tipo:'passo', rotulo:'Descontaminar', texto:'Retirar roupa, lavar a pele; *carvão ativado* se indicado',
          nota:'1 g/kg VO ou por sonda, na primeira 1 a 2 hora, com via aérea protegida' },
        { tipo:'passo', rotulo:'Antídoto', texto:'Se existir e estiver indicado',
          nota:'Naloxona, flumazenil, N-acetilcisteína, atropina, bicarbonato, etanol ou fomepizol' },
        { tipo:'passo', rotulo:'Eliminar', texto:'Alcalinização urinária, carvão em doses múltiplas ou hemodiálise, conforme a substância' },
        { tipo:'fim', rotulo:'Sempre', texto:'*Acionar o CIATox (0800 722 6001)* e avaliar risco de suicídio antes da alta' }
      ]},
      { tipo:'lista', titulo:'Síndromes tóxicas', itens:[
        '*Colinérgica* — miose, sialorreia, broncorreia, bradicardia, fasciculação, diarreia. Organofosforado e carbamato. Antídoto: atropina.',
        '*Anticolinérgica* — midríase, pele seca e quente, rubor, retenção urinária, íleo, delirium, taquicardia. Antidepressivo tricíclico, anti-histamínico, escopolamina. "Louco, seco, quente, vermelho e cego".',
        '*Opioide* — miose puntiforme, depressão respiratória, rebaixamento. Antídoto: naloxona.',
        '*Simpaticomimética* — midríase, taquicardia, hipertensão, hipertermia, sudorese, agitação. Cocaína, anfetamina. Tratamento: benzodiazepínico.',
        '*Sedativo-hipnótica* — rebaixamento com sinais vitais preservados e pupilas normais. Benzodiazepínico, álcool, barbitúrico.',
        '*Serotoninérgica* — clônus, hiper-reflexia, hipertermia, agitação. Antídoto adjuvante: ciproeptadina.'
      ]},
      { tipo:'doses', titulo:'Medidas gerais e antídotos comuns', itens:[
        { droga:'Glicose 50%', dose:'40 a 60 mL', via:'EV', obs:'Em todo rebaixamento com hipoglicemia. Tiamina antes, no etilista.' },
        { droga:'Tiamina', dose:'100 a 300 mg', via:'EV', obs:'Antes ou junto da glicose no etilista ou desnutrido.' },
        { droga:'Carvão ativado', dose:'1 g/kg (adulto: 50 g)', via:'VO ou SNG', obs:'Primeira 1 a 2 hora, via aérea protegida. Não adsorve álcool, lítio, ferro, ácido nem base.' },
        { droga:'Naloxona', dose:'0,04 a 0,4 mg, titulada', via:'EV', obs:'Se depressão respiratória por opioide. Começar baixo em dependente, para evitar abstinência.' },
        { droga:'Bicarbonato de sódio 8,4%', dose:'1 a 2 mEq/kg', via:'EV', obs:'Se QRS acima de 100 ms — bloqueio de canal de sódio (tricíclico, cocaína).' },
        { droga:'Cristaloide', dose:'Conforme a volemia', via:'EV', obs:'Suporte e favorecimento da eliminação renal.' },
        { droga:'Benzodiazepínico', dose:'Titulado', via:'EV', obs:'Base do tratamento da agitação e da convulsão na maioria das intoxicações.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Lavagem gástrica de rotina ou xarope de ipeca: abandonados.',
        'Carvão ativado em paciente sonolento sem via aérea protegida — risco de aspiração.',
        'Flumazenil empírico em rebaixamento de causa desconhecida: pode precipitar convulsão intratável.',
        'Dar alta sem avaliar risco de suicídio na intoxicação intencional.',
        'Confiar no relato de "só tomei um comprimido".'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Observar por pelo menos 4 a 6 horas na maioria das ingestões; mais tempo em substâncias de liberação prolongada, tricíclicos, hipoglicemiantes orais e paracetamol. *Internar* se houver rebaixamento, instabilidade, arritmia, convulsão, necessidade de antídoto contínuo, ou tentativa de suicídio. Toda intoxicação intencional exige avaliação psiquiátrica antes da alta. Notificação compulsória.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'CIATox 0800 722 6001 atende 24 horas e orienta por telefone — use.',
        'Traga a embalagem: o nome comercial muitas vezes esconde a substância.',
        'Pergunte a hora da ingestão, a quantidade e se houve associação com álcool.'
      ]}
    ] },

  { id:'benzo-opioide', titulo:'Intoxicação por benzodiazepínico e opioide', categoria:'toxico', gravidade:'emergencia',
    resumo:'Naloxona na depressão respiratória; o cuidado com flumazenil em usuário crônico.',
    tags:['benzodiazepinico','opioide','naloxona','flumazenil','miose','depressao respiratoria'],
    fonte:'ABRACIT / Ministério da Saúde',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Depressão respiratória é o que mata: frequência respiratória e capnografia importam mais que o Glasgow.',
        '*Miose puntiforme + rebaixamento + bradipneia* é a tríade do opioide.',
        'Naloxona tem meia-vida curta: o paciente pode voltar a rebaixar — observação prolongada é obrigatória.',
        '*Flumazenil é perigoso*: em usuário crônico ou em co-ingestão com tricíclico, precipita convulsão intratável.',
        'Metadona e buprenorfina têm meia-vida longa: exigem infusão contínua de naloxona e internação.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Rebaixamento com sinais vitais deprimidos e pupilas alteradas' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*Via aérea e ventilação* — ambu antes de qualquer antídoto',
          nota:'Oxigênio, monitorização e glicemia capilar' },
        { tipo:'decisao', texto:'Qual o padrão?', ramos:[
          { rotulo:'Miose + bradipneia', texto:'*Opioide — naloxona titulada*',
            nota:'Começar com 0,04 a 0,4 mg. O alvo é ventilação adequada, não acordar o paciente' },
          { rotulo:'Rebaixamento com sinais vitais preservados', cor:'ok', texto:'*Benzodiazepínico — suporte apenas*',
            nota:'Na imensa maioria, só observação. Flumazenil raramente é necessário' }
        ]},
        { tipo:'alerta', rotulo:'Cuidado', texto:'*Naloxona em dose alta em dependente* precipita abstinência aguda',
          nota:'Agitação, vômito, hipertensão. Titule devagar' },
        { tipo:'passo', rotulo:'Observar', texto:'Manter monitorizado: a naloxona dura 30 a 90 minutos, o opioide dura mais',
          nota:'Considerar infusão contínua se houve necessidade de doses repetidas' },
        { tipo:'fim', rotulo:'Antes da alta', texto:'Avaliação de risco de suicídio e encaminhamento ao CAPS-AD se houver uso de substância' }
      ]},
      { tipo:'doses', titulo:'Antídotos', itens:[
        { droga:'Naloxona 0,4 mg/mL', dose:'0,04 a 0,4 mg, repetindo a cada 2 a 3 minutos', via:'EV', obs:'Diluir 1 ampola em 9 mL de SF e fazer 1 mL por vez. Alvo: ventilação adequada.' },
        { droga:'Naloxona — infusão contínua', dose:'Dois terços da dose que reverteu, por hora', via:'EV', obs:'Se houve necessidade de doses repetidas, ou em opioide de meia-vida longa.' },
        { droga:'Naloxona intranasal ou IM', dose:'0,4 a 2 mg', via:'IN ou IM', obs:'Quando não há acesso venoso.' },
        { droga:'Flumazenil 0,1 mg/mL', dose:'0,2 mg, repetindo até 1 mg', via:'EV', obs:'SOMENTE em intoxicação isolada e confirmada, em não usuário crônico, sem convulsão prévia. Raramente indicado.' },
        { droga:'Oxigênio e ventilação com ambu', dose:'—', via:'—', obs:'A medida que efetivamente salva. Antídoto é adjuvante.' },
        { droga:'Glicose 50%', dose:'40 mL', via:'EV', obs:'Se hipoglicemia associada.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Flumazenil empírico em rebaixamento de causa desconhecida.',
        'Flumazenil em usuário crônico de benzodiazepínico ou em co-ingestão com tricíclico.',
        'Naloxona em dose alta de uma vez: precipita abstinência, vômito e edema pulmonar.',
        'Dar alta logo após a reversão com naloxona — o efeito acaba antes do opioide.',
        'Intubar antes de tentar a naloxona no opioide puro, se a ventilação com ambu é possível.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Observação mínima de 4 a 6 horas após a última dose de naloxona; muito mais em metadona, buprenorfina ou formulações de liberação prolongada. *Internar* se houve necessidade de doses repetidas, infusão contínua, aspiração, ou se a intoxicação foi intencional. Avaliação psiquiátrica obrigatória na tentativa de suicídio, e oferta de encaminhamento ao CAPS-AD no uso de substância.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'O alvo da naloxona é a *frequência respiratória*, não o nível de consciência.',
        'Registre quantas doses foram e o horário da última: define quanto tempo observar.',
        'Rebaixamento com sinais vitais normais e pupilas normais é benzodiazepínico até prova em contrário — e só precisa de tempo.'
      ]}
    ] },

  { id:'paracetamol', titulo:'Intoxicação por paracetamol', categoria:'toxico', gravidade:'emergencia',
    resumo:'Nomograma de Rumack-Matthew e N-acetilcisteína — quanto mais cedo, melhor o desfecho.',
    tags:['paracetamol','acetaminofeno','n-acetilcisteina','rumack','hepatotoxicidade'],
    fonte:'ABRACIT — Protocolos de intoxicação por analgésicos',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'A eficácia da N-acetilcisteína cai muito depois de *8 horas* da ingestão — não esperar sintoma.',
        'O paciente costuma estar *assintomático* nas primeiras 24 horas: a ausência de sintoma não tranquiliza.',
        'Etilista, desnutrido e usuário de indutor enzimático têm hepatotoxicidade com doses menores.',
        'Encefalopatia, INR acima de 2 ou acidose indicam falência hepática: acionar centro de transplante.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Ingestão de paracetamol acima de 7,5 g (ou 150 mg/kg), ou dose ignorada',
          nota:'Perguntar a hora exata e se foi dose única ou repetida' },
        { tipo:'decisao', texto:'Quanto tempo desde a ingestão?', ramos:[
          { rotulo:'Menos de 1 a 2 h', texto:'Considerar *carvão ativado* 1 g/kg', nota:'Só com via aérea protegida e paciente colaborativo' },
          { rotulo:'Até 8 h', cor:'ok', texto:'Dosar paracetamol sérico e aplicar o *nomograma de Rumack-Matthew*',
            nota:'Se o nível não sair a tempo, começar a NAC empiricamente' },
          { rotulo:'Mais de 8 h ou tempo ignorado', cor:'perigo', texto:'*Iniciar NAC AGORA*, sem esperar exame' }
        ]},
        { tipo:'passo', rotulo:'Antídoto', texto:'*N-acetilcisteína* — via oral e endovenosa têm eficácia semelhante',
          nota:'Preferir endovenosa se houver vômito, rebaixamento ou sinal de hepatotoxicidade' },
        { tipo:'passo', rotulo:'Exames', texto:'Paracetamol sérico, TGO, TGP, bilirrubinas, INR, função renal, glicemia e gasometria',
          nota:'Repetir a cada 12 a 24 horas' },
        { tipo:'fim', rotulo:'Destino', texto:'Internar para completar o antídoto; avaliação psiquiátrica se foi tentativa de suicídio' }
      ]},
      { tipo:'doses', titulo:'N-acetilcisteína', itens:[
        { droga:'NAC endovenosa — ataque', dose:'150 mg/kg', via:'EV', obs:'Em 60 minutos, diluída em SG 5%.' },
        { droga:'NAC endovenosa — 2ª fase', dose:'50 mg/kg', via:'EV', obs:'Nas 4 horas seguintes (cerca de 12,5 mg/kg por hora).' },
        { droga:'NAC endovenosa — 3ª fase', dose:'100 mg/kg', via:'EV', obs:'Nas 16 horas seguintes (cerca de 6,25 mg/kg por hora).' },
        { droga:'NAC oral — ataque', dose:'140 mg/kg', via:'VO', obs:'Diluída em 200 mL de SG 5% ou suco de laranja.' },
        { droga:'NAC oral — manutenção', dose:'70 mg/kg', via:'VO', obs:'De 4/4 h, 17 doses.' },
        { droga:'Carvão ativado', dose:'1 g/kg', via:'VO ou SNG', obs:'Só na primeira 1 a 2 hora e com via aérea protegida.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Esperar o resultado do paracetamol sérico para começar a NAC quando já passaram 8 horas.',
        'Descartar intoxicação porque o paciente está bem — o dano hepático é tardio.',
        'Carvão ativado em paciente sonolento sem proteção de via aérea.',
        'Dar alta antes de completar o antídoto e sem avaliação psiquiátrica na tentativa de suicídio.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Interna todo mundo que precisa de antídoto. Critérios de encaminhamento a centro de transplante hepático: pH abaixo de 7,3 após reposição, INR acima de 6,5, creatinina acima de 3,4 mg/dL e encefalopatia grau III ou IV (critérios do King\'s College). Acionar o centro de informação toxicológica.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A pergunta que muda a conduta é *que horas foi*, não *quanto tomou*.',
        'Ingestão escalonada ao longo de horas não entra no nomograma: tratar pela clínica e pelas transaminases.',
        'Reação anafilactoide à NAC endovenosa é comum: reduzir a velocidade da infusão, não suspender.'
      ]}
    ] },

  { id:'triciclicos', titulo:'Intoxicação por antidepressivos tricíclicos', categoria:'toxico', gravidade:'emergencia',
    resumo:'QRS alargado é o marcador de gravidade; bicarbonato de sódio é o tratamento.',
    tags:['triciclico','amitriptilina','qrs alargado','bicarbonato','arritmia','convulsao'],
    fonte:'ABRACIT — Protocolos de intoxicação por psicofármacos',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*QRS acima de 100 ms* prediz convulsão; acima de 160 ms prediz arritmia ventricular.',
        'Onda R em aVR maior que 3 mm é marcador de toxicidade.',
        'Deterioração é rápida: o paciente pode estar bem e convulsionar em minutos.',
        'A síndrome é *anticolinérgica*: midríase, pele seca e quente, retenção urinária, íleo, delirium.',
        'Hipotensão refratária e arritmia são as causas de morte.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Ingestão de antidepressivo tricíclico — amitriptilina, nortriptilina, imipramina, clomipramina' },
        { tipo:'passo', rotulo:'Imediato', texto:'*ECG e monitorização contínua*',
          nota:'Medir o QRS. Repetir o ECG com frequência: a alteração é dinâmica' },
        { tipo:'passo', rotulo:'Se na 1ª hora', texto:'*Carvão ativado* 1 g/kg, com via aérea protegida' },
        { tipo:'decisao', texto:'O QRS está alargado?', ramos:[
          { rotulo:'Acima de 100 ms', cor:'perigo', texto:'*BICARBONATO DE SÓDIO 1 a 2 mEq/kg em bolus*',
            nota:'Repetir até o QRS estreitar. Alvo de pH entre 7,45 e 7,55' },
          { rotulo:'Normal', texto:'Monitorizar e repetir o ECG' }
        ]},
        { tipo:'passo', rotulo:'Convulsão', texto:'*Benzodiazepínico* — e nunca fenitoína',
          nota:'A fenitoína piora a toxicidade cardíaca do tricíclico' },
        { tipo:'passo', rotulo:'Hipotensão', texto:'Volume, bicarbonato e *noradrenalina* se necessário',
          nota:'Considerar emulsão lipídica a 20% no caso refratário' },
        { tipo:'fim', rotulo:'Destino', texto:'Terapia intensiva com monitorização por pelo menos 24 horas após a normalização do ECG' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Bicarbonato de sódio 8,4%', dose:'1 a 2 mEq/kg em bolus', via:'EV', obs:'Repetir até o QRS estreitar. Depois, infusão contínua. Alvo de pH de 7,45 a 7,55.' },
        { droga:'Carvão ativado', dose:'1 g/kg', via:'VO ou SNG', obs:'Primeira 1 a 2 hora, com via aérea protegida.' },
        { droga:'Diazepam ou midazolam', dose:'Titulado', via:'EV', obs:'Para convulsão e agitação. Primeira linha.' },
        { droga:'Noradrenalina', dose:'Titular em bomba', via:'EV', obs:'Vasopressor de escolha na hipotensão refratária a volume e bicarbonato.' },
        { droga:'Sulfato de magnésio', dose:'2 g', via:'EV', obs:'Se torsades de pointes.' },
        { droga:'Emulsão lipídica 20%', dose:'1,5 mL/kg em bolus, depois 0,25 mL/kg/min', via:'EV', obs:'Terapia de resgate no colapso refratário.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Fenitoína* para a convulsão: piora a cardiotoxicidade.',
        'Antiarrítmicos da classe IA, IC ou III: pioram o bloqueio de canal de sódio.',
        'Flumazenil: se houver co-ingestão com benzodiazepínico, precipita convulsão intratável.',
        'Dar alta antes de 6 horas com ECG normal e paciente assintomático — o padrão mínimo.',
        'Confiar em um ECG isolado normal: repita.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo paciente com ingestão significativa interna em leito monitorizado. Alta possível apenas após pelo menos 6 horas de observação com ECG normal, sem sintoma anticolinérgico, sem alteração de consciência e sem necessidade de bicarbonato — e mesmo assim, com avaliação psiquiátrica se foi tentativa de suicídio. Acionar o CIATox.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Meça o QRS você mesmo: o laudo automático do aparelho erra com frequência.',
        'Onda R em aVR maior que 3 mm com desvio do eixo para a direita é sinal precoce.',
        'Bicarbonato é o antídoto funcional: não hesite se o QRS alargar.'
      ]}
    ] },

  { id:'organofosforado', titulo:'Intoxicação por organofosforado e carbamato', categoria:'toxico', gravidade:'emergencia',
    resumo:'Síndrome colinérgica, atropina em doses crescentes até secar as secreções, e pralidoxima.',
    tags:['organofosforado','carbamato','chumbinho','atropina','pralidoxima','colinergico'],
    fonte:'ABRACIT / Ministério da Saúde — Intoxicações por agrotóxicos',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'A morte vem da *broncorreia e da broncoconstrição*, não da bradicardia: o alvo da atropina é secar o pulmão.',
        'Odor de alho ou solvente, miose puntiforme, sialorreia e fasciculação fecham o quadro.',
        'A equipe precisa de EPI: a contaminação secundária pelo vômito e pela roupa é real.',
        'Síndrome intermediária entre 24 e 96 horas: fraqueza de musculatura proximal e respiratória, mesmo com o paciente aparentemente bem.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Síndrome colinérgica: miose, sialorreia, broncorreia, bradicardia, fasciculação',
          nota:'Mnemônico DUMBELS: diarreia, urina, miose, broncorreia, êmese, lacrimejamento, salivação' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*EPI da equipe* + descontaminação: retirar roupa e lavar a pele com água e sabão',
          nota:'Roupa em saco fechado. Não usar álcool' },
        { tipo:'passo', rotulo:'Via aérea', texto:'Aspirar, oxigênio e preparar intubação',
          nota:'Se for intubar, *evitar succinilcolina*: o bloqueio se prolonga muito' },
        { tipo:'passo', rotulo:'Antídoto', texto:'*ATROPINA em bolus, dobrando a dose até secar as secreções*',
          nota:'Não existe dose máxima. O alvo é ausculta limpa e ausência de broncorreia, não a frequência cardíaca' },
        { tipo:'passo', rotulo:'Segundo antídoto', texto:'*Pralidoxima*, se disponível, no organofosforado',
          nota:'Reativa a colinesterase. Não funciona no carbamato, que não precisa dela' },
        { tipo:'fim', rotulo:'Destino', texto:'Terapia intensiva, com vigilância da síndrome intermediária por pelo menos 96 horas' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Atropina 0,5 mg/mL', dose:'1 a 2 ampolas em bolus', via:'EV', obs:'Dobrar a dose a cada 3 a 5 minutos até secar as secreções brônquicas. Sem dose máxima.' },
        { droga:'Pralidoxima', dose:'30 mg/kg de ataque, depois 8 mg/kg/h', via:'EV', obs:'Em infusão. Só no organofosforado; dispensável no carbamato.' },
        { droga:'Diazepam 5 mg/mL', dose:'10 mg', via:'EV', obs:'Se convulsão ou agitação. Reduz também a lesão neurológica.' },
        { droga:'Cloreto de sódio 0,9%', dose:'1000 mL', via:'EV', obs:'Reposição — a perda por secreção e vômito é grande.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Titular a atropina pela frequência cardíaca em vez da ausculta pulmonar.',
        'Atender sem EPI: luva, avental e óculos.',
        'Succinilcolina na sequência rápida — o bloqueio dura horas.',
        'Dar alta em 24 horas por melhora aparente: a síndrome intermediária vem depois.',
        'Induzir vômito ou lavagem gástrica de rotina.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo caso sintomático interna, em leito monitorizado. Acionar o *Centro de Informação e Assistência Toxicológica* (CIATox, 0800 722 6001) para orientação e notificação. A alta depende de 24 a 48 horas sem necessidade de atropina e sem sinal de fraqueza muscular. Notificação compulsória como intoxicação exógena.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Anote quantas ampolas de atropina já foram e o horário: a dose total costuma passar de 20 ampolas.',
        'Ausculta limpa é o alvo. Taquicardia sob atropina é esperada, não é motivo para parar.',
        'Investigar sempre a intenção: tentativa de suicídio com agrotóxico é frequente no meio rural.'
      ]}
    ] },

  { id:'alcool-metanol', titulo:'Intoxicação alcoólica e por metanol', categoria:'toxico', gravidade:'emergencia',
    resumo:'Acidose com ânion gap e gap osmolar; etanol/fomepizol e diálise no metanol.',
    tags:['alcool','metanol','etilenoglicol','gap osmolar','fomepizol','acidose','cegueira'],
    fonte:'ABRACIT — Protocolos de intoxicação por álcoois',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*Acidose metabólica com ânion-gap elevado e gap osmolar alto*: pensar em metanol ou etilenoglicol.',
        'Metanol: *alteração visual* — visão borrada, "nevasca", cegueira. É a marca.',
        'Etilenoglicol: cristais de oxalato na urina e lesão renal aguda.',
        'Intoxicação alcoólica comum: sempre medir glicemia e considerar trauma craniano associado.',
        'Rebaixamento atribuído ao álcool sem investigar é armadilha clássica: hipoglicemia, TCE, Wernicke, hiponatremia.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Rebaixamento, hálito etílico, ou suspeita de ingestão de álcool não etílico' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Glicemia capilar + tiamina* + exame neurológico completo',
          nota:'Tiamina ANTES da glicose. Procurar sinal de trauma craniano' },
        { tipo:'passo', rotulo:'Exames', texto:'Gasometria, eletrólitos, função renal, osmolaridade e lactato',
          nota:'Calcular ânion-gap e gap osmolar' },
        { tipo:'decisao', texto:'Há acidose com ânion-gap e gap osmolar elevados?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Metanol ou etilenoglicol — bloquear a álcool-desidrogenase*',
            nota:'Fomepizol se disponível; etanol se não houver. Hemodiálise' },
          { rotulo:'Não', cor:'ok', texto:'Provável intoxicação por etanol — suporte e observação' }
        ]},
        { tipo:'passo', rotulo:'Etanol', texto:'Suporte: hidratação, tiamina, proteção da via aérea e reavaliação',
          nota:'A maioria melhora com o tempo. Vigiar abstinência nas horas seguintes' },
        { tipo:'fim', rotulo:'Antes da alta', texto:'Reavaliar o estado neurológico e oferecer encaminhamento ao CAPS-AD' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Tiamina', dose:'100 a 300 mg', via:'EV', obs:'Antes ou junto da glicose. Previne encefalopatia de Wernicke.' },
        { droga:'Glicose 50%', dose:'40 a 60 mL', via:'EV', obs:'Se hipoglicemia. Sempre depois ou junto da tiamina.' },
        { droga:'Cristaloide', dose:'1000 mL', via:'EV', obs:'Hidratação; repor magnésio, potássio e fósforo, que costumam estar baixos.' },
        { droga:'Fomepizol', dose:'15 mg/kg de ataque, depois 10 mg/kg de 12/12 h', via:'EV', obs:'Antídoto de escolha no metanol e etilenoglicol. Pouco disponível no Brasil.' },
        { droga:'Etanol', dose:'Alvo de alcoolemia de 100 a 150 mg/dL', via:'VO ou EV', obs:'Alternativa ao fomepizol: compete pela álcool-desidrogenase.' },
        { droga:'Bicarbonato de sódio', dose:'1 a 2 mEq/kg', via:'EV', obs:'Se pH abaixo de 7,3 — a acidose aumenta a toxicidade.' },
        { droga:'Ácido folínico', dose:'50 mg de 6/6 h', via:'EV', obs:'No metanol: acelera a metabolização do ácido fórmico.' },
        { droga:'Hemodiálise', dose:'—', via:'—', obs:'Indicada em acidose grave, alteração visual, lesão renal, ou nível sérico alto.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Atribuir rebaixamento ao álcool sem medir glicemia e sem afastar trauma craniano.',
        'Glicose antes da tiamina no etilista: precipita Wernicke.',
        'Deixar de calcular o gap osmolar na suspeita de álcool não etílico.',
        'Flumazenil "para acordar" o paciente etilizado.',
        'Dar alta a paciente ainda incapaz de deambular e se cuidar sozinho.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Intoxicação por etanol: alta quando o paciente estiver desperto, orientado, deambulando e sem sinal de trauma ou abstinência, preferencialmente com acompanhante. *Internar* toda suspeita de metanol ou etilenoglicol, e todo paciente com acidose, alteração visual, lesão renal ou rebaixamento persistente. Acionar o CIATox e o serviço de hemodiálise. Em surtos de metanol por bebida adulterada, notificar a vigilância.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Gap osmolar = osmolaridade medida menos calculada; acima de 10 sugere álcool não etílico.',
        'Alteração visual com acidose é metanol até prova em contrário — pergunte sobre bebida de procedência duvidosa.',
        'O paciente etilizado que "só precisa dormir" é o que mais esconde TCE.'
      ]}
    ] },

  { id:'cocaina-estimulantes', titulo:'Intoxicação por cocaína e estimulantes', categoria:'toxico', gravidade:'emergencia',
    resumo:'Benzodiazepínico é a base do tratamento; hipertermia e dor torácica mudam a conduta.',
    tags:['cocaina','crack','anfetamina','benzodiazepinico','hipertermia','betabloqueador'],
    fonte:'ABRACIT — Protocolos de intoxicação por drogas de abuso',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Hipertermia acima de 40 °C é a maior causa de morte: resfriar agressivamente.',
        'Dor torácica com cocaína é isquemia até prova em contrário — e o mecanismo é vasoespasmo.',
        'Agitação com rigidez, rabdomiólise e acidose formam o *delirium agitado*, que mata.',
        'Cefaleia súbita ou déficit focal: hemorragia intracraniana.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Agitação, midríase, taquicardia, hipertensão, hipertermia e sudorese' },
        { tipo:'passo', rotulo:'Base de tudo', texto:'*BENZODIAZEPÍNICO* em dose generosa e titulada',
          nota:'Resolve agitação, taquicardia, hipertensão e reduz a hipertermia de uma vez só' },
        { tipo:'passo', rotulo:'Temperatura', texto:'Medir a temperatura *central* e resfriar se acima de 39 °C',
          nota:'Compressa fria, ventilação e hidratação. Antitérmico não funciona aqui' },
        { tipo:'passo', rotulo:'Exames', texto:'ECG, troponina, CPK, eletrólitos, função renal e gasometria',
          nota:'QRS alargado indica bloqueio de canal de sódio: bicarbonato de sódio' },
        { tipo:'decisao', texto:'Há dor torácica?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Benzodiazepínico + nitrato + AAS*',
            nota:'BETABLOQUEADOR É PROIBIDO: estimulação alfa sem oposição piora o vasoespasmo' },
          { rotulo:'Não', texto:'Seguir com sedação e suporte' }
        ]},
        { tipo:'fim', rotulo:'Destino', texto:'Observação monitorizada até resolver agitação, hipertermia e alterações do ECG' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Midazolam 1 mg/mL', dose:'3 mg de cada vez', via:'EV', obs:'Repetir a cada 5 minutos até a sedação. Conferir a apresentação: existe também 5 mg/mL.' },
        { droga:'Diazepam 5 mg/mL', dose:'1 ampola diluída em 8 mL de AD; aplicar 5 mL', via:'EV', obs:'Repetir a cada 5 a 10 minutos. Diazepam precisa ser diluído; midazolam não.' },
        { droga:'Cloreto de sódio 0,9%', dose:'1000 a 2000 mL', via:'EV', obs:'Hidratação; alvo de diurese acima de 1 a 2 mL/kg/h se houver rabdomiólise.' },
        { droga:'Bicarbonato de sódio 8,4%', dose:'1 a 2 mEq/kg', via:'EV', obs:'Se QRS acima de 100 ms — bloqueio de canal de sódio pela cocaína.' },
        { droga:'Nitroglicerina', dose:'Titular em bomba', via:'EV', obs:'Para dor torácica e hipertensão refratária ao benzodiazepínico.' },
        { droga:'Fentolamina', dose:'1 a 5 mg', via:'EV', obs:'Alfabloqueador, se disponível, na isquemia por vasoespasmo.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Betabloqueador* — inclusive o labetalol é discutível. Estimulação alfa sem oposição piora tudo.',
        'Haloperidol como primeira escolha: baixa o limiar convulsivo e atrapalha a termorregulação.',
        'Contenção mecânica prolongada em quem luta contra a contenção: acelera a rabdomiólise.',
        'Antitérmico para a hipertermia por estimulante — não é febre, é produção de calor.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Alta possível após algumas horas de observação se resolverem agitação, taquicardia, hipertensão e temperatura, com ECG normal e sem dor torácica. *Internar* se houver dor torácica com alteração de ECG ou troponina, hipertermia, rabdomiólise, convulsão, ou suspeita de *body packer* (transporte de pacotes no trato digestivo, que é caso cirúrgico se houver ruptura). Oferecer encaminhamento ao CAPS-AD.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Benzodiazepínico resolve quase tudo: sedar bem é o tratamento, não um adjuvante.',
        'Midazolam e diazepam têm absorção intramuscular errática — sempre preferir a via endovenosa.',
        'Pergunte sobre pacotes ingeridos antes de liberar quem veio da polícia.'
      ]}
    ] },

  { id:'monoxido-carbono', titulo:'Intoxicação por monóxido de carbono', categoria:'toxico', gravidade:'emergencia',
    resumo:'Oximetria normal engana; oxigênio a 100% e critérios de câmara hiperbárica.',
    tags:['monoxido de carbono','co','carboxihemoglobina','oxigenio 100%','hiperbarica','incendio'],
    fonte:'ABRACIT — Protocolos de intoxicação por gases',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        '*A oximetria de pulso é falsamente normal* — ela não distingue oxi de carboxi-hemoglobina.',
        'Cefaleia, náusea, tontura e confusão em várias pessoas do mesmo ambiente: suspeite.',
        'Pele "vermelho-cereja" é achado tardio e raro — não conte com ela.',
        'Gestante: o feto é muito mais suscetível; o limiar para oxigênio hiperbárico é menor.',
        'Sintoma neurológico ou cardíaco, síncope, ou carboxi-hemoglobina acima de 25%: considerar câmara hiperbárica.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Exposição a incêndio, motor em ambiente fechado, aquecedor ou churrasqueira em recinto sem ventilação' },
        { tipo:'passo', rotulo:'Imediato', texto:'*Retirar da exposição* + *OXIGÊNIO A 100% em máscara com reservatório*',
          nota:'Reduz a meia-vida da carboxi-hemoglobina de 4 a 6 horas para cerca de 60 a 90 minutos' },
        { tipo:'passo', rotulo:'Exames', texto:'*Carboxi-hemoglobina* (gasometria com co-oximetria), ECG, troponina e gasometria',
          nota:'Não confie na oximetria de pulso' },
        { tipo:'decisao', texto:'Há critério para câmara hiperbárica?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*Acionar serviço de medicina hiperbárica*',
            nota:'Perda de consciência, sintoma neurológico, isquemia miocárdica, gestação, COHb acima de 25% (ou 15 a 20% na gestante)' },
          { rotulo:'Não', texto:'Manter oxigênio a 100% até a COHb ficar abaixo de 5% e os sintomas cederem' }
        ]},
        { tipo:'passo', rotulo:'Em incêndio fechado', texto:'Pensar também em *intoxicação por cianeto*',
          nota:'Acidose lática grave desproporcional: hidroxocobalamina' },
        { tipo:'fim', rotulo:'Depois', texto:'Alertar sobre a *síndrome neurológica tardia*, que pode surgir em 2 a 40 dias' }
      ]},
      { tipo:'doses', titulo:'Tratamento', itens:[
        { droga:'Oxigênio a 100%', dose:'Máscara com reservatório, 12 a 15 L/min', via:'—', obs:'Manter até COHb abaixo de 5% e sintomas resolvidos. Mínimo de 6 horas.' },
        { droga:'Oxigênio hiperbárico', dose:'—', via:'—', obs:'Conforme os critérios; idealmente nas primeiras 6 horas.' },
        { droga:'Hidroxocobalamina', dose:'5 g', via:'EV', obs:'Se houver suspeita de cianeto associado, em incêndio fechado com acidose lática.' },
        { droga:'Cristaloide', dose:'Conforme a volemia', via:'EV', obs:'Suporte.' },
        { droga:'Intubação e ventilação com FiO2 de 100%', dose:'—', via:'—', obs:'Se houver rebaixamento importante ou lesão inalatória associada.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Confiar na oximetria de pulso: ela lê a carboxi-hemoglobina como se fosse oxigênio.',
        'Dar alta antes de a COHb normalizar e os sintomas cederem.',
        'Esquecer de perguntar sobre outras pessoas no mesmo ambiente — pode haver mais vítimas.',
        'Deixar de considerar cianeto em vítima de incêndio em ambiente fechado.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Internar* se houver sintoma neurológico ou cardíaco, COHb elevada persistente, gestação, ou necessidade de oxigênio hiperbárico. Alta possível quando os sintomas cederem, a COHb normalizar e a fonte de exposição estiver resolvida — o paciente não pode voltar ao mesmo ambiente. Orientar sobre a síndrome neurológica tardia e a necessidade de reavaliação. Verificar se há outras vítimas no local e acionar a vigilância.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Cefaleia em várias pessoas da mesma casa no inverno é monóxido até prova em contrário.',
        'Oxigênio a 100% começa antes de qualquer exame.',
        'Registre a fonte de exposição: sem resolvê-la, o paciente volta.'
      ]}
    ] },

  { id:'sindrome-serotoninergica', titulo:'Síndrome serotoninérgica e neuroléptica maligna', categoria:'toxico', gravidade:'emergencia',
    resumo:'Como diferenciar as duas pela evolução e pelo tônus, e o tratamento de cada uma.',
    tags:['sindrome serotoninergica','neuroleptica maligna','clonus','rigidez','ciproheptadina','dantrolene'],
    fonte:'ABRACIT / ABP — Emergências toxicológicas por psicofármacos',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'A tríade é *alteração mental + hiperatividade autonômica + hiperexcitabilidade neuromuscular*.',
        'Clônus, sobretudo o *induzível de tornozelo*, é o achado mais específico — procure sempre.',
        'A rigidez predomina em membros *inferiores*; isso a separa da síndrome neuroléptica maligna.',
        'Instalação em *horas* após início ou aumento de droga serotoninérgica. A neuroléptica maligna leva dias.',
        'Temperatura acima de 41,5 °C é emergência: sedação profunda, paralisia e resfriamento.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Confusão, agitação, taquicardia, sudorese, hiper-reflexia e clônus, horas após droga serotoninérgica',
          nota:'ISRS, IRSN, tramadol, linezolida, triptano, ondansetrona, lítio, MDMA. A combinação é o gatilho mais comum' },
        { tipo:'passo', rotulo:'Primeiro', texto:'*SUSPENDER TODAS as drogas serotoninérgicas*',
          nota:'É a medida mais importante; sem ela o quadro não resolve' },
        { tipo:'passo', rotulo:'Base', texto:'*Benzodiazepínico* + hidratação + resfriamento',
          nota:'Diazepam 0,1 a 0,2 mg/kg EV; Ringer lactato 20 a 30 mL/kg, com alvo de diurese de 50 a 100 mL/h' },
        { tipo:'decisao', texto:'Qual a gravidade?', ramos:[
          { rotulo:'Leve', cor:'ok', texto:'Suspender a droga + benzodiazepínico + observação' },
          { rotulo:'Moderada', texto:'Acrescentar *ciproeptadina* 12 mg VO',
            nota:'Antagonista de serotonina; 2 mg a cada 2 h até remissão, máximo de 32 mg/dia' },
          { rotulo:'Grave — hipertermia acima de 41,5 °C', cor:'perigo',
            texto:'*Intubação, sedação profunda e bloqueio neuromuscular*',
            nota:'Terapia intensiva. A rigidez é o que gera calor: paralisar é o que resfria' }
        ]},
        { tipo:'alerta', rotulo:'Não fazer', texto:'*Contenção mecânica* em quem luta contra ela',
          nota:'Aumenta a produção de calor e precipita rabdomiólise' },
        { tipo:'fim', rotulo:'Destino', texto:'A maioria resolve em 24 horas com a droga suspensa; caso grave vai para terapia intensiva' }
      ]},
      { tipo:'doses', titulo:'Medicações', itens:[
        { droga:'Diazepam', dose:'0,1 a 0,2 mg/kg', via:'EV', obs:'Repetir de 8/8 h até o desaparecimento dos sintomas. Base do tratamento.' },
        { droga:'Ringer lactato', dose:'20 a 30 mL/kg', via:'EV', obs:'Alvo de diurese entre 50 e 100 mL/h.' },
        { droga:'Ciproeptadina', dose:'12 mg de ataque', via:'VO ou SNG', obs:'Depois 2 mg a cada 2 h até remissão. Máximo de 32 mg/dia. Só existe por via enteral.' },
        { droga:'Bloqueador neuromuscular não despolarizante', dose:'Conforme o protocolo', via:'EV', obs:'No caso grave, com intubação. Não usar succinilcolina se houver hipercalemia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Antitérmico: a hipertermia é muscular, não é febre.',
        'Contenção mecânica em paciente agitado que resiste — piora a hipertermia e a rabdomiólise.',
        'Bromocriptina e dantroleno: são da síndrome neuroléptica maligna e pioram esta aqui.',
        'Reintroduzir a droga serotoninérgica antes de 24 a 48 horas assintomático.'
      ]},
      { tipo:'texto', titulo:'Diferencial com a síndrome neuroléptica maligna', conteudo:'*Serotoninérgica*: instala em horas, cursa com hiper-reflexia, clônus e rigidez de predomínio em membros inferiores; melhora em 24 horas. *Neuroléptica maligna*: instala em dias após antipsicótico, com rigidez em cano de chumbo generalizada, hiporreflexia e CPK muito elevada; leva dias a semanas. O tratamento da neuroléptica maligna é *bromocriptina 2 a 10 mg de 8/8 h, amantadina 100 mg ou dantroleno 1 a 10 mg/kg*, além de suspender o antipsicótico.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Teste o clônus de tornozelo em todo paciente confuso e taquicárdico em uso de antidepressivo.',
        'A pergunta que fecha o caso é: mudou alguma medicação nos últimos dias?',
        'Tramadol e linezolida são causas esquecidas — não é só antidepressivo.'
      ]}
    ] },

  { id:'acidente-ofidico', titulo:'Acidente ofídico', categoria:'toxico', gravidade:'emergencia',
    resumo:'Identificar o gênero pelo quadro, número de ampolas de soro e manejo da reação ao soro.',
    tags:['ofidico','cobra','botropico','crotalico','soro antiofidico','coagulopatia'],
    fonte:'Ministério da Saúde — Manual de diagnóstico e tratamento de acidentes por animais peçonhentos',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'O tratamento é o *soro antiveneno*, e a dose depende da gravidade, não do peso.',
        'Não perca tempo tentando identificar a serpente: identifique a *síndrome clínica*.',
        'Sangramento, oligúria, dor intensa com edema progressivo, ptose e visão dupla são sinais de gravidade.',
        'Botrópico causa coagulopatia; crotálico causa rabdomiólise e paralisia; elapídico causa paralisia respiratória.',
        'Reação anafilática ao soro é possível: tenha adrenalina preparada antes de infundir.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Picada de serpente' },
        { tipo:'passo', rotulo:'Primeiro', texto:'Lavar o local, *imobilizar e elevar* o membro, hidratar e analgesiar',
          nota:'Não fazer torniquete, não cortar, não sugar, não aplicar substância' },
        { tipo:'passo', rotulo:'Classificar a síndrome', texto:'Pelo quadro clínico e pelo tempo de coagulação',
          nota:'Marcar a borda do edema a caneta com o horário, para acompanhar a progressão' },
        { tipo:'decisao', texto:'Qual o gênero provável?', ramos:[
          { rotulo:'Botrópico (jararaca)', texto:'*Dor, edema, equimose, bolha, sangramento e incoagulabilidade*',
            nota:'O mais comum no Brasil. Soro antibotrópico' },
          { rotulo:'Crotálico (cascavel)', cor:'perigo', texto:'*Pouca dor local, ptose, "fácies miastênica", mialgia e urina escura*',
            nota:'Rabdomiólise e lesão renal. Soro anticrotálico' },
          { rotulo:'Laquético (surucucu)', texto:'Quadro botrópico *com* bradicardia, hipotensão e diarreia' },
          { rotulo:'Elapídico (coral)', cor:'perigo', texto:'*Paralisia flácida progressiva* sem lesão local',
            nota:'Risco de insuficiência respiratória. Soro antielapídico em dose alta' }
        ]},
        { tipo:'passo', rotulo:'Soro', texto:'*Antiveneno específico EV*, na dose conforme a gravidade',
          nota:'Diluído em soro fisiológico, correndo em 30 a 60 minutos, com o paciente monitorizado' },
        { tipo:'fim', rotulo:'Depois', texto:'Hidratação vigorosa, controle do tempo de coagulação em 12 a 24 h, e notificação' }
      ]},
      { tipo:'doses', titulo:'Soroterapia — número de ampolas por gravidade', itens:[
        { droga:'Botrópico leve', dose:'2 a 4 ampolas', via:'EV', obs:'Soro antibotrópico ou antibotrópico-laquético.' },
        { droga:'Botrópico moderado', dose:'4 a 8 ampolas', via:'EV', obs:'—' },
        { droga:'Botrópico grave', dose:'12 ampolas', via:'EV', obs:'—' },
        { droga:'Crotálico leve', dose:'5 ampolas', via:'EV', obs:'Soro anticrotálico.' },
        { droga:'Crotálico moderado', dose:'10 ampolas', via:'EV', obs:'—' },
        { droga:'Crotálico grave', dose:'20 ampolas', via:'EV', obs:'—' },
        { droga:'Elapídico', dose:'10 ampolas, sempre considerado grave', via:'EV', obs:'Soro antielapídico. Preparar via aérea.' },
        { droga:'Cristaloide', dose:'Hidratação vigorosa', via:'EV', obs:'Alvo de diurese de 1 a 2 mL/kg/h; mais no crotálico, pela rabdomiólise.' },
        { droga:'Adrenalina, hidrocortisona e anti-histamínico', dose:'Preparados à beira do leito', via:'—', obs:'Para reação anafilática ao soro. Não fazer pré-medicação de rotina.' },
        { droga:'Dipirona ou opioide', dose:'Conforme a dor', via:'EV', obs:'A dor botrópica é intensa. Evitar anti-inflamatório pela coagulopatia.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        '*Torniquete, garrote, cortar, sugar ou aplicar substância no local* — pioram a lesão.',
        'Anti-inflamatório: agrava a coagulopatia e a lesão renal.',
        'Atrasar o soro esperando identificar a serpente.',
        'Injeção intramuscular na vigência de coagulopatia.',
        'Dar alta antes de normalizar o tempo de coagulação no acidente botrópico.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo acidente ofídico com sinal de envenenamento interna. O soro é fornecido gratuitamente pelo Ministério da Saúde e distribuído por centros de referência — saiba onde fica o mais próximo. *Notificação compulsória*. Acionar o CIATox (0800 722 6001). Controle do tempo de coagulação 12 e 24 horas após a soroterapia; se permanecer incoagulável, repetir o soro. Vigiar lesão renal, sobretudo no acidente crotálico.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Marque a borda do edema a caneta com o horário: é como se acompanha a progressão.',
        'O tempo de coagulação é o exame mais útil e mais simples — faça na chegada e repita.',
        'A dose de soro é a mesma para adulto e criança: depende da gravidade, não do peso.'
      ]}
    ] },

  { id:'acidente-escorpiao-aranha', titulo:'Acidente escorpiônico e araneísmo', categoria:'toxico', gravidade:'emergencia',
    resumo:'Classificação de gravidade, quando soroterapia é obrigatória e o risco na criança.',
    tags:['escorpiao','aranha','armadeira','loxosceles','soro antiescorpionico','crianca'],
    fonte:'Ministério da Saúde — Manual de acidentes por animais peçonhentos',
    secoes:[
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Escorpião em *criança abaixo de 7 anos* é o grupo de risco: pode evoluir para edema agudo de pulmão e choque em horas.',
        'Vômitos repetidos, sudorese profusa, agitação, taquicardia e hipertensão após picada de escorpião: envenenamento sistêmico.',
        'Loxosceles (aranha-marrom): lesão que evolui em dias, com placa marmórea e necrose; forma cutâneo-visceral cursa com hemólise.',
        'Phoneutria (armadeira): dor local intensa e imediata; em criança, pode dar quadro sistêmico.',
        'Latrodectus (viúva-negra): dor, contratura muscular generalizada e sudorese.'
      ]},
      { tipo:'fluxo', titulo:'Fluxograma da conduta', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Picada de escorpião ou aranha' },
        { tipo:'passo', rotulo:'Sempre', texto:'*Analgesia* e observação; lavar o local e elevar o membro',
          nota:'A dor costuma ser o sintoma principal e responde bem a bloqueio local' },
        { tipo:'decisao', texto:'Escorpião — há manifestação sistêmica?', ramos:[
          { rotulo:'Só dor local', cor:'ok', texto:'*Analgesia e observação* de 6 a 12 horas',
            nota:'Adulto sem comorbidade, sem sinal sistêmico: alta com orientação' },
          { rotulo:'Vômitos, sudorese, agitação, taquicardia', cor:'perigo',
            texto:'*SORO ANTIESCORPIÔNICO + monitorização*',
            nota:'Criança abaixo de 7 anos exige vigilância redobrada. Risco de edema agudo de pulmão' }
        ]},
        { tipo:'decisao', texto:'Aranha — qual o gênero?', ramos:[
          { rotulo:'Loxosceles (marrom)', texto:'*Lesão que evolui em dias* — soro antiloxoscélico se precoce e grave',
            nota:'Vigiar hemólise: hemograma, bilirrubinas, função renal e urina' },
          { rotulo:'Phoneutria (armadeira)', texto:'Dor intensa imediata — *bloqueio local com lidocaína*',
            nota:'Soro só nos casos moderados a graves, sobretudo em criança' },
          { rotulo:'Latrodectus (viúva-negra)', texto:'Contratura e sudorese — soro antilatrodéctico se grave' }
        ]},
        { tipo:'fim', rotulo:'Sempre', texto:'Notificação e contato com o CIATox' }
      ]},
      { tipo:'doses', titulo:'Tratamento', itens:[
        { droga:'Lidocaína 1 a 2% sem vasoconstritor', dose:'1 a 4 mL', via:'INFILTRAÇÃO local', obs:'Bloqueio no local da picada. Excelente para a dor da Phoneutria e do escorpião. Pode repetir.' },
        { droga:'Dipirona', dose:'2 g no adulto; 10 a 15 mg/kg na criança', via:'EV', obs:'Analgesia sistêmica.' },
        { droga:'Morfina', dose:'2 a 4 mg no adulto; 0,05 a 0,1 mg/kg na criança', via:'EV', obs:'Se dor refratária ao bloqueio.' },
        { droga:'Soro antiescorpiônico ou antiaracnídico', dose:'Moderado 2 a 3 ampolas; grave 4 a 6 ampolas', via:'EV', obs:'Em 20 a 30 minutos, com o paciente monitorizado.' },
        { droga:'Soro antiloxoscélico', dose:'5 ampolas', via:'EV', obs:'Na forma cutâneo-visceral ou cutânea grave, se dentro das primeiras 72 horas.' },
        { droga:'Prednisona', dose:'40 a 60 mg/dia (adulto); 1 mg/kg (criança)', via:'VO', obs:'Por 5 dias, na loxoscelose cutânea — reduz a inflamação local.' },
        { droga:'Adrenalina, hidrocortisona e anti-histamínico', dose:'Preparados', via:'—', obs:'À beira do leito, antes de infundir qualquer soro.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Torniquete, corte, sucção ou aplicação de substância no local.',
        'Dar alta a criança abaixo de 7 anos picada por escorpião sem observação adequada.',
        'Desbridar precocemente a lesão da aranha-marrom: aguardar a demarcação.',
        'Pré-medicar de rotina antes do soro — apenas ter o material de anafilaxia pronto.',
        'Subestimar a dor: o bloqueio local resolve muito e é subutilizado.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'*Escorpião*: adulto com dor local isolada tem alta após analgesia e algumas horas de observação. Criança abaixo de 7 anos fica em observação mais prolongada, e qualquer manifestação sistêmica interna em leito monitorizado com soro. *Aranha-marrom*: acompanhamento ambulatorial na forma cutânea, com retorno para avaliar a evolução da lesão; interna a forma cutâneo-visceral. Notificação compulsória; acionar o CIATox (0800 722 6001).' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Bloqueio local com lidocaína é subutilizado e resolve a maior parte da dor.',
        'Na aranha-marrom, fotografe e marque a lesão: a evolução em dias é o que define a conduta.',
        'Guarde o animal quando o paciente trouxer, mas nunca atrase o tratamento por causa disso.'
      ]}
    ] },

  /* ======================= 12 · PROCEDIMENTOS ======================= */
  { id:'sequencia-rapida-intubacao', titulo:'Sequência rápida de intubação', categoria:'proced', gravidade:'emergencia',
    resumo:'Os sete Ps, escolha do sedativo e do bloqueador conforme a hemodinâmica, e o plano de resgate.',
    tags:['sri','intubacao','etomidato','quetamina','succinilcolina','rocuronio','pre-oxigenacao'],
    fonte:'AMIB — Diretrizes brasileiras de via aérea na emergência',
    secoes:[
      { tipo:'alerta', titulo:'Antes de induzir', itens:[
        '*Ressuscite antes de intubar*: hipotensão, hipoxemia e acidose na indução causam parada.',
        'Pré-oxigene por 3 minutos — o hipoxêmico dessatura em segundos.',
        'Succinilcolina é proibida em neuropata, queimado com mais de 48 h e hipercalemia grave.',
        'Etomidato não pode ser repetido.',
        'Tenha plano B e C definidos *antes* de dar a droga.'
      ]},
      { tipo:'fluxo', titulo:'Os 7 P da sequência rápida', itens:[
        { tipo:'inicio', rotulo:'1 · Preparo', texto:'Checklist: aspirador testado, dois laringoscópios, tubo com balonete testado, bougie, dispositivo supraglótico, capnografia, acesso pérvio e drogas puxadas' },
        { tipo:'passo', rotulo:'2 · Pré-oxigenação', texto:'*3 minutos* com máscara com reservatório a 15 L/min, ou 8 respirações profundas',
          nota:'Cabeceira a 20 a 30 graus. Oxigênio nasal a 15 L/min durante a apneia prolonga o tempo seguro' },
        { tipo:'passo', rotulo:'3 · Pré-otimização', texto:'Corrigir hipotensão e acidose *antes* da indução',
          nota:'Volume, e adrenalina diluída (1 mL em 19 mL de SF) 0,5 a 1 mL a cada 5 minutos se necessário' },
        { tipo:'passo', rotulo:'4 · Paralisia com indução', texto:'*Hipnótico e bloqueador em sequência rápida*',
          nota:'Etomidato ou cetamina; succinilcolina ou rocurônio' },
        { tipo:'passo', rotulo:'5 · Posicionamento', texto:'Alinhar os eixos: coxim occipital, ou rampa no obeso',
          nota:'Meato acústico externo na altura do esterno' },
        { tipo:'passo', rotulo:'6 · Passagem e confirmação', texto:'*Capnografia é o padrão-ouro* — não a ausculta isolada' },
        { tipo:'fim', rotulo:'7 · Pós-intubação', texto:'Fixar, radiografia, sedação contínua, ventilador ajustado' }
      ]},
      { tipo:'doses', titulo:'Drogas — por quilo', itens:[
        { droga:'Fentanila 50 mcg/mL', dose:'2 a 3 mcg/kg', via:'EV', obs:'3 minutos antes. Atenua a resposta pressórica. Cuidado no hipotenso.' },
        { droga:'Etomidato 2 mg/mL', dose:'0,3 mg/kg', via:'EV', obs:'Estabilidade hemodinâmica. Não repetir. Suprime o cortisol transitoriamente.' },
        { droga:'Cetamina 50 mg/mL', dose:'1 a 2 mg/kg', via:'EV', obs:'Escolha no asmático e no chocado. Mantém o drive e a hemodinâmica.' },
        { droga:'Midazolam', dose:'0,1 a 0,3 mg/kg', via:'EV', obs:'Conferir a concentração: existem 1 mg/mL e 5 mg/mL. Causa hipotensão.' },
        { droga:'Propofol', dose:'1 a 2 mg/kg', via:'EV', obs:'Hipotensão importante. Evitar no instável.' },
        { droga:'Succinilcolina', dose:'1,5 mg/kg', via:'EV', obs:'Início em 45 s, dura 6 a 10 min. Contraindicada nas situações da caixa de atenção.' },
        { droga:'Rocurônio', dose:'1,2 mg/kg', via:'EV', obs:'Início em 60 s, dura 45 a 60 min. Sem as contraindicações da succinilcolina.' },
        { droga:'Adrenalina diluída (1 mL de 1:1000 em 19 mL de SF)', dose:'0,5 a 1 mL', via:'EV', obs:'Fica 50 mcg/mL. Corrigir pressão antes de induzir.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Induzir paciente hipotenso ou hipoxêmico sem otimizar antes.',
        'Ventilar com bolsa-máscara de rotina entre a indução e a intubação: aumenta a insuflação gástrica.',
        'Succinilcolina nas contraindicações.',
        'Confiar só na ausculta para confirmar o tubo.',
        'Iniciar sem plano B: dispositivo supraglótico e material de cricotireoidostomia à vista.'
      ]},
      { tipo:'texto', titulo:'Tamanhos e fixação', conteudo:'Adulto: tubo 7,5 na mulher e 8,0 no homem, fixado em 21 a 23 cm na comissura labial. Criança: tubo sem balonete = idade ÷ 4 + 4; com balonete = idade ÷ 4 + 3,5; profundidade = diâmetro do tubo × 3. Lâmina curva (Macintosh) 3 ou 4 no adulto; reta (Miller) no lactente.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Diga o plano em voz alta para a equipe antes de dar a droga: quem faz o quê, e qual é o plano B.',
        'Oxigênio nasal a 15 L/min mantido durante a apneia dá minutos preciosos.',
        'Registre número de tentativas, dispositivo usado e a fixação.'
      ]}
    ] },

  { id:'via-aerea-dificil', titulo:'Via aérea difícil e resgate', categoria:'proced', gravidade:'emergencia',
    resumo:'Predizer a dificuldade, dispositivos supraglóticos e o acesso cirúrgico quando não ventila nem intuba.',
    tags:['via aerea dificil','mascara laringea','cricotireoidostomia','cormack','bougie'],
    fonte:'AMIB/SBA — Algoritmo de via aérea difícil',
    secoes:[
      { tipo:'alerta', titulo:'Prever antes de tentar', itens:[
        '*LEMON*: Look externo · Evaluate 3-3-2 · Mallampati · Obstrução · Neck mobility.',
        'Sinais: barba, obesidade, pescoço curto, abertura bucal pequena, trauma de face, queimadura de via aérea, radioterapia cervical.',
        '*Não podemos intubar, não podemos ventilar* é a situação que mata: reconheça cedo.',
        'Cada tentativa piora a via aérea: sangramento e edema. Máximo de 3 tentativas.',
        'Chame ajuda antes, não depois.'
      ]},
      { tipo:'fluxo', titulo:'Plano A, B, C, D', itens:[
        { tipo:'inicio', rotulo:'Antes', texto:'Prever, preparar o carro de via aérea difícil e chamar ajuda' },
        { tipo:'passo', rotulo:'Plano A', texto:'*Laringoscopia otimizada*: melhor posição, bougie, BURP, videolaringoscópio',
          nota:'Máximo de 3 tentativas, trocando algo a cada uma' },
        { tipo:'passo', rotulo:'Plano B', texto:'*Dispositivo supraglótico* (máscara laríngea)',
          nota:'Resgata a ventilação e permite oxigenar enquanto se decide' },
        { tipo:'passo', rotulo:'Plano C', texto:'*Ventilação com bolsa-máscara a duas pessoas*, cânula orofaríngea e nasofaríngea',
          nota:'Se ventila, você tem tempo: acorde o paciente se for eletivo, ou chame quem sabe' },
        { tipo:'decisao', texto:'Consegue ventilar?', ramos:[
          { rotulo:'Sim', cor:'ok', texto:'Oxigene, estabilize e planeje com calma' },
          { rotulo:'Não — cenário CICO', cor:'perigo', texto:'*Plano D: CRICOTIREOIDOSTOMIA*',
            nota:'Não hesite. A hipóxia mata em minutos' }
        ]},
        { tipo:'fim', rotulo:'Depois', texto:'Registrar a dificuldade no prontuário e informar o paciente' }
      ]},
      { tipo:'doses', titulo:'Manobras e material', itens:[
        { droga:'Bougie (introdutor de Eschmann)', dose:'—', via:'—', obs:'Aumenta muito o sucesso em Cormack 3. Sente os cliques dos anéis traqueais.' },
        { droga:'BURP', dose:'—', via:'—', obs:'Pressão na cartilagem tireoide para trás, para cima e para a direita. Melhora a visão.' },
        { droga:'Videolaringoscópio', dose:'—', via:'—', obs:'Primeira escolha quando disponível e há previsão de dificuldade.' },
        { droga:'Máscara laríngea', dose:'Tamanho 3 a 5 conforme o peso', via:'—', obs:'Resgate rápido da ventilação. Alguns modelos permitem intubar através.' },
        { droga:'Cânula orofaríngea (Guedel)', dose:'Da comissura labial ao ângulo da mandíbula', via:'—', obs:'Só no inconsciente sem reflexo de vômito.' },
        { droga:'Cricotireoidostomia por punção ou cirúrgica', dose:'—', via:'—', obs:'Membrana cricotireoidea. Técnica do bisturi-bougie-tubo é a mais recomendada no adulto.' },
        { droga:'Sugamadex', dose:'16 mg/kg', via:'EV', obs:'Reverte o rocurônio em minutos. Se disponível, permite acordar o paciente.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Repetir a mesma tentativa sem mudar nada: mude posição, lâmina, operador ou dispositivo.',
        'Insistir além de 3 tentativas.',
        'Cricotireoidostomia por punção em criança abaixo de 12 anos: preferir a técnica por agulha com ventilação a jato.',
        'Deixar de chamar ajuda cedo.',
        'Sedar profundamente sem ter certeza de que consegue ventilar, na via aérea prevista como difícil.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'Todo paciente que teve via aérea difícil deve ter isso *registrado de forma destacada no prontuário* e ser informado — a informação salva a vida dele na próxima. Considerar cartão de alerta. Após intubação difícil, extubação também é de risco: planejar com a equipe, e considerar extubação sobre trocador de tubo.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Diga em voz alta: "estou na tentativa 2, vou trocar para o videolaringoscópio". A equipe acompanha e ajuda.',
        'Prepare o material de cricotireoidostomia *antes* de induzir quando houver previsão de dificuldade.',
        'Se ventila com máscara, você tem tempo. A pressa é o que transforma difícil em catástrofe.'
      ]}
    ] },

  { id:'ventilacao-mecanica-inicial', titulo:'Ajuste inicial da ventilação mecânica', categoria:'proced', gravidade:'emergencia',
    resumo:'Modo, volume corrente por peso predito, PEEP e o que checar nos primeiros 15 minutos.',
    tags:['ventilacao mecanica','volume corrente','peep','peso predito','driving pressure','vm'],
    fonte:'AMIB/SBPT — Diretrizes brasileiras de ventilação mecânica',
    secoes:[
      { tipo:'alerta', titulo:'Regras de segurança', itens:[
        '*Volume corrente de 6 mL/kg de peso PREDITO*, não do peso real — o pulmão não engorda.',
        'Pressão de platô abaixo de 30 cmH2O; driving pressure abaixo de 15.',
        'Auto-PEEP no obstrutivo: se a pressão sobe e a PA cai, desconecte do ventilador.',
        'Hipotensão logo após intubar: pense em auto-PEEP, pneumotórax, hipovolemia e efeito da sedação.',
        'Alarme de pressão alta: verifique tubo, secreção, broncoespasmo, pneumotórax e assincronia.'
      ]},
      { tipo:'fluxo', titulo:'Ajuste inicial', itens:[
        { tipo:'inicio', rotulo:'Modo', texto:'Volume controlado ou pressão controlada — o que a equipe domina' },
        { tipo:'passo', rotulo:'Volume corrente', texto:'*6 mL/kg de peso predito*',
          nota:'Homem: 50 + 0,91 × (altura em cm − 152,4). Mulher: 45,5 + 0,91 × (altura − 152,4)' },
        { tipo:'passo', rotulo:'Frequência', texto:'12 a 20 irpm, ajustada pela PaCO2 e pelo pH',
          nota:'No obstrutivo, frequência baixa e tempo expiratório longo para evitar auto-PEEP' },
        { tipo:'passo', rotulo:'PEEP e FiO2', texto:'PEEP inicial de 5; FiO2 de 100% e desmame rápido',
          nota:'Alvo de SatO2 de 92 a 96%; PaO2 de 60 a 80 mmHg' },
        { tipo:'passo', rotulo:'Checar em 15 minutos', texto:'*Pressão de platô, driving pressure e gasometria*',
          nota:'Platô: pausa inspiratória. Driving pressure = platô menos PEEP' },
        { tipo:'decisao', texto:'Qual o cenário?', ramos:[
          { rotulo:'Pulmão normal', cor:'ok', texto:'6 a 8 mL/kg, PEEP 5' },
          { rotulo:'SDRA', cor:'perigo', texto:'*6 mL/kg, PEEP conforme tabela, platô abaixo de 30*',
            nota:'Considerar prona se PaO2/FiO2 abaixo de 150' },
          { rotulo:'Obstrutivo (asma, DPOC)', texto:'*Tempo expiratório longo*, FR baixa, hipercapnia permissiva',
            nota:'Aceitar pH até cerca de 7,20' }
        ]},
        { tipo:'fim', rotulo:'Sempre', texto:'Sedação e analgesia adequadas, cabeceira a 30°, profilaxias e reavaliação diária de desmame' }
      ]},
      { tipo:'doses', titulo:'Parâmetros e alvos', itens:[
        { droga:'Volume corrente', dose:'6 mL/kg de peso predito', via:'—', obs:'Até 8 mL/kg em pulmão normal. Nunca pelo peso real no obeso.' },
        { droga:'Frequência respiratória', dose:'12 a 20 irpm', via:'—', obs:'Ajustar pela PaCO2. No obstrutivo, 8 a 12.' },
        { droga:'PEEP', dose:'5 cmH2O inicial', via:'—', obs:'Subir conforme a necessidade de oxigênio na SDRA, por tabela PEEP-FiO2.' },
        { droga:'FiO2', dose:'100% inicial, desmamando', via:'—', obs:'Alvo de SatO2 de 92 a 96%.' },
        { droga:'Fluxo inspiratório', dose:'40 a 60 L/min', via:'—', obs:'Mais alto no obstrutivo, para alongar a expiração. Relação I:E de 1:3 a 1:5.' },
        { droga:'Pressão de platô', dose:'Manter abaixo de 30 cmH2O', via:'—', obs:'Medida com pausa inspiratória de 0,5 a 2 s.' },
        { droga:'Driving pressure', dose:'Manter abaixo de 15 cmH2O', via:'—', obs:'Platô menos PEEP. É o parâmetro que melhor se associa a mortalidade.' },
        { droga:'Sedação e analgesia contínuas', dose:'Ver a conduta específica', via:'EV', obs:'Analgesia primeiro; buscar a sedação mais leve tolerada.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Usar o peso real para calcular o volume corrente.',
        'Deixar a FiO2 em 100% por horas: toxicidade e atelectasia de absorção.',
        'Ignorar a pressão de platô e a driving pressure.',
        'Manter sedação profunda sem necessidade: prolonga a ventilação e causa delirium.',
        'Esquecer as profilaxias: trombose, úlcera de estresse e cabeceira elevada.'
      ]},
      { tipo:'texto', titulo:'Se piorar de repente — DOPES', conteudo:'*D*eslocamento do tubo · *O*bstrução por secreção ou dobra · *P*neumotórax · *E*quipamento (circuito, ventilador) · *S*tacking de ar (auto-PEEP). Na dúvida, desconecte do ventilador e ventile com bolsa: isso resolve o auto-PEEP e diferencia problema do aparelho de problema do paciente.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Calcule o peso predito pela ALTURA e anote no leito: todo o resto depende dele.',
        'Meça platô e driving pressure na primeira hora e registre.',
        'Gasometria 20 a 30 minutos após cada ajuste importante.'
      ]}
    ] },

  { id:'acesso-venoso-central', titulo:'Acesso venoso central', categoria:'proced', gravidade:'urgencia',
    resumo:'Escolha do sítio, técnica guiada por ultrassom e conferência antes de usar.',
    tags:['acesso central','jugular','subclavia','femoral','seldinger','ultrassom'],
    fonte:'AMIB — Recomendações sobre acessos vasculares',
    secoes:[
      { tipo:'alerta', titulo:'Segurança', itens:[
        '*Ultrassom em tempo real reduz complicação de forma dramática* — use sempre que houver.',
        'Coagulopatia grave e plaquetopenia: preferir sítio compressível (femoral ou jugular), nunca subclávia.',
        'Nunca puncione subclávia em candidato a fístula arteriovenosa: a estenose compromete o acesso definitivo.',
        'Radiografia de controle obrigatória após jugular e subclávia — pneumotórax e mau posicionamento.',
        'Se aspirar sangue pulsátil e vermelho vivo: retire, comprima por 10 minutos e reavalie.'
      ]},
      { tipo:'fluxo', titulo:'Passo a passo', itens:[
        { tipo:'inicio', rotulo:'Indicar', texto:'Droga vasoativa, nutrição parenteral, hemodiálise, monitorização, ou falta de acesso periférico' },
        { tipo:'passo', rotulo:'Escolher o sítio', texto:'*Jugular interna direita* é o mais seguro com ultrassom',
          nota:'Femoral: rápida na emergência, maior risco de infecção. Subclávia: menor infecção, maior pneumotórax' },
        { tipo:'passo', rotulo:'Preparar', texto:'*Barreira máxima*: gorro, máscara, avental e luva estéreis, campo grande',
          nota:'Clorexidina alcoólica e tempo de secagem. Checklist de prevenção de infecção' },
        { tipo:'passo', rotulo:'Posicionar', texto:'Trendelemburg para jugular e subclávia; cabeça rodada levemente para o lado oposto' },
        { tipo:'passo', rotulo:'Puncionar', texto:'*Ultrassom em tempo real*, visualizando a agulha o tempo todo',
          nota:'Confirmar o fio-guia dentro da veia em corte transversal e longitudinal antes de dilatar' },
        { tipo:'passo', rotulo:'Seldinger', texto:'Agulha → fio-guia → dilatador → cateter → retirar o fio',
          nota:'Nunca solte o fio-guia. Aspirar e lavar todas as vias' },
        { tipo:'fim', rotulo:'Confirmar', texto:'Radiografia de tórax; ponta na transição da cava superior com o átrio direito' }
      ]},
      { tipo:'doses', titulo:'Material e cuidados', itens:[
        { droga:'Cateter de duplo ou triplo lúmen', dose:'7 Fr, 16 a 20 cm', via:'—', obs:'Duplo lúmen 11 a 12 Fr para hemodiálise.' },
        { droga:'Lidocaína 1 a 2%', dose:'5 a 10 mL', via:'INFILTRAÇÃO', obs:'Anestesiar pele e trajeto.' },
        { droga:'Clorexidina alcoólica 0,5 a 2%', dose:'—', via:'TÓPICO', obs:'Aguardar secagem completa antes de puncionar.' },
        { droga:'Ultrassom com transdutor linear', dose:'—', via:'—', obs:'Capa estéril. Visão em eixo curto ou longo, com a agulha sempre à vista.' },
        { droga:'Profundidade de inserção', dose:'Jugular direita 15 a 16 cm · esquerda 17 a 18 · subclávia direita 16 · esquerda 18', via:'—', obs:'Femoral: 20 a 25 cm.' },
        { droga:'Curativo transparente', dose:'—', via:'—', obs:'Trocar a cada 7 dias ou se sujo ou solto. Registrar a data de inserção.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Puncionar sem ultrassom quando ele está disponível.',
        'Dilatar sem confirmar o fio-guia dentro da veia.',
        'Soltar o fio-guia em nenhum momento — embolização é catastrófica.',
        'Subclávia em coagulopata ou em candidato a fístula.',
        'Deixar de pedir a radiografia de controle após jugular ou subclávia.'
      ]},
      { tipo:'texto', titulo:'Complicações e prevenção', conteudo:'*Imediatas*: punção arterial, hematoma, pneumotórax, hemotórax, arritmia pelo fio, embolia gasosa. *Tardias*: infecção de corrente sanguínea, trombose, estenose. Prevenção: barreira máxima, clorexidina, ultrassom, retirada precoce e avaliação diária da necessidade do cateter. Registrar sítio, número de tentativas, intercorrências e a data de inserção.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Avalie diariamente se o cateter ainda é necessário — o melhor jeito de evitar infecção é retirar.',
        'Anote no leito a data de inserção e o sítio.',
        'Em emergência, o intraósseo é mais rápido e mais seguro que um central às pressas.'
      ]}
    ] },

  { id:'acesso-intraosseo', titulo:'Acesso intraósseo', categoria:'proced', gravidade:'emergencia',
    resumo:'A alternativa quando não há acesso em 90 segundos: sítios, técnica e o que pode correr por ele.',
    tags:['intraosseo','io','tibia','umero','crianca','pcr'],
    fonte:'AMIB/SBP — Recomendações sobre acesso intraósseo',
    secoes:[
      { tipo:'alerta', titulo:'Quando usar', itens:[
        'Emergência com falha de acesso venoso após *2 tentativas ou 90 segundos*.',
        'Parada cardiorrespiratória, choque, criança grave, queimado, obeso.',
        'Aceita *qualquer droga e qualquer fluido* que se dá por veia, inclusive vasopressor e hemoderivado.',
        'Contraindicado no osso fraturado, no membro com osteomielite, e onde já houve tentativa prévia no mesmo osso.',
        'É medida temporária: trocar por acesso definitivo em 24 horas.'
      ]},
      { tipo:'fluxo', titulo:'Passo a passo', itens:[
        { tipo:'inicio', rotulo:'Indicar', texto:'Falha ou impossibilidade de acesso venoso em situação de emergência' },
        { tipo:'passo', rotulo:'Escolher o sítio', texto:'*Tíbia proximal* é o mais usado',
          nota:'1 a 2 cm medial e abaixo da tuberosidade tibial. Alternativas: úmero proximal e tíbia distal' },
        { tipo:'passo', rotulo:'Inserir', texto:'Perpendicular ao osso, até sentir a perda de resistência',
          nota:'Com dispositivo automático ou agulha manual com movimento rotatório' },
        { tipo:'passo', rotulo:'Confirmar', texto:'Agulha firme sem apoio, aspiração de medula e infusão sem extravasamento',
          nota:'Nem sempre se aspira medula — a infusão livre já confirma' },
        { tipo:'passo', rotulo:'Analgesia', texto:'*Lidocaína intraóssea antes de infundir* no paciente consciente',
          nota:'A infusão dói muito. Lidocaína 2%: 40 mg no adulto, 0,5 mg/kg na criança' },
        { tipo:'passo', rotulo:'Infundir', texto:'Sob *pressão* — bolsa pressurizada ou seringa',
          nota:'O fluxo por gravidade é lento demais' },
        { tipo:'fim', rotulo:'Trocar', texto:'Obter acesso definitivo e retirar em até 24 horas' }
      ]},
      { tipo:'doses', titulo:'Material e técnica', itens:[
        { droga:'Agulha intraóssea', dose:'15 mm (3 a 39 kg) · 25 mm (acima de 40 kg) · 45 mm (obeso ou úmero)', via:'—', obs:'Dispositivo automático quando disponível.' },
        { droga:'Sítio — tíbia proximal', dose:'1 a 2 cm medial e abaixo da tuberosidade tibial', via:'—', obs:'Na criança pequena, 1 cm medial e 1 cm abaixo.' },
        { droga:'Sítio — úmero proximal', dose:'Tubérculo maior, com o braço aduzido e a mão sobre o abdome', via:'—', obs:'Fluxo maior e menos dor; exige mais treino.' },
        { droga:'Lidocaína 2% intraóssea', dose:'40 mg no adulto; 0,5 mg/kg na criança', via:'IO', obs:'Infundir lentamente antes do primeiro bolus, no paciente consciente.' },
        { droga:'Flush de SF 0,9%', dose:'10 mL no adulto; 5 mL na criança', via:'IO', obs:'Obrigatório após a inserção e após cada droga — abre o espaço medular.' },
        { droga:'Infusão sob pressão', dose:'—', via:'—', obs:'Bolsa pressurizada ou seringa. Gravidade não funciona bem.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Insistir em veia periférica por minutos em parada ou choque — vá para o intraósseo.',
        'Puncionar osso fraturado, ou o mesmo osso onde já houve tentativa.',
        'Esquecer o flush: sem ele, o fluxo não abre.',
        'Infundir sem lidocaína no paciente consciente — dói muito.',
        'Manter por mais de 24 horas.'
      ]},
      { tipo:'texto', titulo:'Complicações', conteudo:'Extravasamento com risco de síndrome compartimental (a mais importante: vigie o membro), osteomielite (rara, aumenta com o tempo de permanência), fratura, embolia gordurosa e lesão de placa de crescimento (rara com técnica correta). Registrar sítio, horário de inserção e horário de retirada.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Palpe o membro periodicamente: aumento de volume indica extravasamento.',
        'Amostras colhidas pelo intraósseo servem para tipagem, gasometria e a maior parte da bioquímica.',
        'Avise a equipe em voz alta que o acesso é intraósseo — muda o cuidado.'
      ]}
    ] },

  { id:'drenagem-torax', titulo:'Drenagem torácica', categoria:'proced', gravidade:'emergencia',
    resumo:'Triângulo de segurança, calibre do dreno, selo d’água e as complicações a vigiar.',
    tags:['dreno de torax','triangulo de seguranca','selo dagua','pneumotorax','hemotorax'],
    fonte:'CBC/SBPT — Recomendações sobre drenagem pleural',
    secoes:[
      { tipo:'alerta', titulo:'Segurança', itens:[
        'O local é o *triângulo de segurança*: 5º espaço intercostal, linha axilar média a anterior.',
        'Sempre pela *borda superior da costela inferior* — o feixe vasculonervoso corre na borda inferior.',
        'Dissecção romba com pinça, *nunca com trocarte*.',
        'Confirme a entrada na cavidade com o dedo antes de introduzir o dreno.',
        'Nunca clampeie o dreno para transportar: pode gerar pneumotórax hipertensivo.'
      ]},
      { tipo:'fluxo', titulo:'Passo a passo', itens:[
        { tipo:'inicio', rotulo:'Indicar', texto:'Pneumotórax, hemotórax, empiema, derrame complicado ou quilotórax' },
        { tipo:'passo', rotulo:'Posicionar', texto:'Decúbito dorsal com o braço do lado acima da cabeça; cabeceira a 30 a 45 graus' },
        { tipo:'passo', rotulo:'Localizar', texto:'*Triângulo de segurança*: borda lateral do peitoral maior, borda anterior do grande dorsal e linha do mamilo',
          nota:'Confirmar o lado com a imagem e com o exame — drenar o lado errado é evento sentinela' },
        { tipo:'passo', rotulo:'Anestesiar', texto:'Lidocaína na pele, subcutâneo, *periósteo e pleura parietal*',
          nota:'A pleura é o que mais dói. Aspirar ao avançar confirma a cavidade' },
        { tipo:'passo', rotulo:'Incisar e dissecar', texto:'Incisão de 2 a 3 cm, dissecção romba com pinça até a pleura' },
        { tipo:'passo', rotulo:'Explorar com o dedo', texto:'*Confirmar a cavidade e afastar aderências e vísceras*' },
        { tipo:'passo', rotulo:'Introduzir', texto:'Dreno direcionado posterior e superior no pneumotórax; posterior e inferior no derrame' },
        { tipo:'fim', rotulo:'Conectar e fixar', texto:'Selo d\'água, sutura em bailarina, curativo e *radiografia de controle*' }
      ]},
      { tipo:'doses', titulo:'Material', itens:[
        { droga:'Dreno tubular', dose:'Trauma e hemotórax 28 a 32 Fr · pneumotórax espontâneo 14 a 20 Fr', via:'—', obs:'Empiema espesso pede calibre maior.' },
        { droga:'Lidocaína 1 a 2%', dose:'10 a 20 mL', via:'INFILTRAÇÃO', obs:'Até 4,5 mg/kg sem vasoconstritor. Anestesiar bem o periósteo e a pleura.' },
        { droga:'Analgesia sistêmica', dose:'Dipirona 2 g + morfina titulada', via:'EV', obs:'Antes do procedimento. A drenagem dói muito.' },
        { droga:'Sedação leve', dose:'Midazolam ou fentanila tituladas', via:'EV', obs:'Se o paciente estiver estável e monitorizado.' },
        { droga:'Sistema de selo d\'água', dose:'—', via:'—', obs:'Manter abaixo do nível do tórax. Nunca elevar acima do paciente.' },
        { droga:'Fio de sutura', dose:'Náilon 0 ou 2-0', via:'—', obs:'Fixação e ponto em bailarina para o fechamento na retirada.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Usar trocarte: risco de lesão de pulmão, coração e diafragma.',
        'Passar pela borda inferior da costela: lesa o feixe vasculonervoso.',
        'Drenar abaixo do 5º espaço: risco de lesão de fígado e baço.',
        'Clampear o dreno para transportar.',
        'Deixar de confirmar o lado com a imagem antes de incisar.'
      ]},
      { tipo:'texto', titulo:'Acompanhamento e retirada', conteudo:'Registrar por plantão: débito, aspecto, borbulhamento (fuga aérea) e oscilação da coluna d\'água. *Retirar* quando não houver borbulhamento por 24 horas, o pulmão estiver expandido na radiografia e o débito for menor que 200 mL/dia (menos em empiema). Retirar em expiração forçada ou manobra de Valsalva, com o ponto em bailarina pronto e curativo oclusivo.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Ausência de oscilação: dreno obstruído, dobrado, ou pulmão já expandido — verifique qual.',
        'Borbulhamento contínuo indica fuga aérea persistente; borbulhamento novo indica desconexão ou fístula.',
        'Anote o débito das últimas 24 horas na passagem — é o que define a retirada.'
      ]}
    ] },

  { id:'toracocentese', titulo:'Toracocentese', categoria:'proced', gravidade:'rotina',
    resumo:'Posicionamento, volume máximo por punção e os exames a pedir no líquido.',
    tags:['toracocentese','puncao pleural','light','edema de reexpansao'],
    fonte:'SBPT — Recomendações sobre procedimentos pleurais',
    secoes:[
      { tipo:'alerta', titulo:'Segurança', itens:[
        '*Ultrassom antes e durante* reduz muito o risco de pneumotórax e de punção de órgão.',
        'Nunca puncionar abaixo do 8º espaço intercostal: fígado à direita, baço à esquerda.',
        'Sempre pela *borda superior da costela inferior*.',
        'Não retirar mais de 1000 a 1500 mL de uma vez: risco de edema de reexpansão.',
        'Parar imediatamente se surgir tosse persistente, dor torácica ou desconforto.'
      ]},
      { tipo:'fluxo', titulo:'Passo a passo', itens:[
        { tipo:'inicio', rotulo:'Indicar', texto:'Diagnóstica em derrame novo de causa não esclarecida; de alívio em derrame sintomático' },
        { tipo:'passo', rotulo:'Posicionar', texto:'Sentado, inclinado para a frente, braços apoiados numa mesa',
          nota:'No acamado: decúbito dorsal com cabeceira elevada, punção na linha axilar média' },
        { tipo:'passo', rotulo:'Localizar', texto:'*Ultrassom* — marcar o ponto com o paciente na posição da punção',
          nota:'Escolher onde há maior lâmina de líquido e distância segura do diafragma' },
        { tipo:'passo', rotulo:'Anestesiar', texto:'Lidocaína na pele, subcutâneo, periósteo e *pleura parietal*',
          nota:'Aspirar ao avançar; a saída de líquido confirma a profundidade' },
        { tipo:'passo', rotulo:'Puncionar', texto:'Cateter sobre agulha, pela borda superior da costela inferior, com aspiração contínua' },
        { tipo:'passo', rotulo:'Coletar', texto:'*Bioquímica, celularidade, citologia oncótica, ADA, Gram e cultura*',
          nota:'Semear em frasco de hemocultura aumenta o rendimento' },
        { tipo:'fim', rotulo:'Depois', texto:'Curativo e radiografia de controle se houver sintoma, múltiplas tentativas ou punção difícil' }
      ]},
      { tipo:'doses', titulo:'Material e amostras', itens:[
        { droga:'Cateter sobre agulha 14 a 18G', dose:'—', via:'—', obs:'Ou kit de toracocentese com torneira de três vias.' },
        { droga:'Lidocaína 1 a 2%', dose:'10 mL', via:'INFILTRAÇÃO', obs:'Anestesiar bem a pleura parietal: é o que dói.' },
        { droga:'Volume diagnóstico', dose:'20 a 50 mL', via:'—', obs:'Basta para todos os exames.' },
        { droga:'Volume de alívio', dose:'Até 1000 a 1500 mL', via:'—', obs:'Parar antes se houver tosse, dor ou desconforto.' },
        { droga:'Amostras a enviar', dose:'—', via:'—', obs:'Proteína, LDH, glicose, pH (em seringa heparinizada), celularidade, citologia oncótica, ADA, Gram e cultura.' },
        { droga:'Amostras séricas pareadas', dose:'Proteína e LDH', via:'—', obs:'Colher no mesmo momento — os critérios de Light são razões.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Puncionar às cegas quando há ultrassom disponível.',
        'Puncionar abaixo do 8º espaço intercostal.',
        'Retirar mais de 1500 mL de uma vez.',
        'Esquecer a citologia oncótica e o ADA no primeiro derrame.',
        'Puncionar na linha axilar posterior no acamado sem ultrassom: o diafragma sobe.'
      ]},
      { tipo:'texto', titulo:'Interpretação — critérios de Light', conteudo:'É *exsudato* se pelo menos um: proteína pleural ÷ sérica maior que 0,5; LDH pleural ÷ sérica maior que 0,6; LDH pleural maior que dois terços do limite superior sérico. Complementar: glicose baixa e pH abaixo de 7,2 indicam derrame complicado ou empiema; ADA elevada com linfocitose sugere tuberculose; predomínio de neutrófilos indica processo agudo; citologia positiva fecha neoplasia.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Marque o ponto com o ultrassom e puncione ali, sem mudar a posição do paciente.',
        'pH pleural precisa de seringa heparinizada e transporte rápido, como gasometria.',
        'Anote o aspecto do líquido: claro, turvo, purulento, hemorrágico ou leitoso.'
      ]}
    ] },

  { id:'paracentese', titulo:'Paracentese', categoria:'proced', gravidade:'rotina',
    resumo:'Diagnóstica x de alívio, reposição de albumina e contagem de polimorfonucleares.',
    tags:['paracentese','ascite','albumina','pmn','pbe','gasa'],
    fonte:'SBH — Sociedade Brasileira de Hepatologia',
    secoes:[
      { tipo:'alerta', titulo:'Segurança', itens:[
        '*Paracentese diagnóstica em todo cirrótico com ascite que interna* — mesmo sem febre e sem dor.',
        'Coagulopatia da cirrose *não* contraindica: não se transfunde plasma nem plaqueta de rotina para puncionar.',
        'Evitar cicatrizes, vasos superficiais visíveis e a área da bexiga — esvaziar a bexiga antes.',
        'Em paracentese de grande volume, acima de 5 L, repor albumina.',
        'Ultrassom reduz o risco e aumenta o sucesso, sobretudo em ascite pequena.'
      ]},
      { tipo:'fluxo', titulo:'Passo a passo', itens:[
        { tipo:'inicio', rotulo:'Indicar', texto:'Diagnóstica em toda ascite nova ou em cirrótico internado; de alívio em ascite tensa' },
        { tipo:'passo', rotulo:'Preparar', texto:'Esvaziar a bexiga, posicionar em decúbito dorsal com leve inclinação lateral',
          nota:'Marcar o ponto com ultrassom quando disponível' },
        { tipo:'passo', rotulo:'Localizar', texto:'*Quadrante inferior esquerdo*, 2 a 4 cm medial e cefálico à espinha ilíaca ântero-superior',
          nota:'Evitar a linha média abaixo do umbigo (bexiga) e a região do ceco à direita' },
        { tipo:'passo', rotulo:'Técnica em Z', texto:'Tracionar a pele antes de puncionar — o trajeto oblíquo reduz o vazamento depois' },
        { tipo:'passo', rotulo:'Coletar', texto:'*Contagem de PMN, albumina, proteína, Gram e cultura em frasco de hemocultura*',
          nota:'PMN acima de 250/mm³ fecha peritonite bacteriana espontânea' },
        { tipo:'decisao', texto:'Retirou mais de 5 litros?', ramos:[
          { rotulo:'Sim', texto:'*Repor albumina*: 6 a 8 g por litro retirado' },
          { rotulo:'Não', cor:'ok', texto:'Sem necessidade de reposição' }
        ]},
        { tipo:'fim', rotulo:'Depois', texto:'Curativo compressivo; vigiar hipotensão e vazamento pelo orifício' }
      ]},
      { tipo:'doses', titulo:'Material e amostras', itens:[
        { droga:'Cateter sobre agulha 18 a 20G (diagnóstica)', dose:'—', via:'—', obs:'Para alívio, cateter mais calibroso ou kit próprio com sistema de drenagem.' },
        { droga:'Lidocaína 1 a 2%', dose:'5 a 10 mL', via:'INFILTRAÇÃO', obs:'Anestesiar até o peritônio parietal.' },
        { droga:'Volume diagnóstico', dose:'20 a 50 mL', via:'—', obs:'Suficiente para todos os exames.' },
        { droga:'Albumina humana 20%', dose:'6 a 8 g por litro retirado', via:'EV', obs:'Se a paracentese for de grande volume, acima de 5 L.' },
        { droga:'Amostras a enviar', dose:'—', via:'—', obs:'Contagem total e diferencial, albumina (para GASA), proteína, Gram, cultura em frasco de hemocultura à beira do leito, e citologia se houver suspeita de neoplasia.' },
        { droga:'Albumina sérica pareada', dose:'—', via:'—', obs:'Colher no mesmo momento para calcular o GASA.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Transfundir plasma ou plaqueta de rotina antes de puncionar o cirrótico.',
        'Puncionar na linha média abaixo do umbigo sem esvaziar a bexiga.',
        'Puncionar através de cicatriz cirúrgica ou de circulação colateral visível.',
        'Deixar de semear em frasco de hemocultura à beira do leito: aumenta muito o rendimento.',
        'Esquecer a albumina após retirada de grande volume.'
      ]},
      { tipo:'texto', titulo:'Interpretação — GASA', conteudo:'*GASA* = albumina sérica menos albumina do líquido ascítico. Maior ou igual a 1,1 g/dL indica *hipertensão portal*: cirrose, insuficiência cardíaca, Budd-Chiari. Menor que 1,1 indica outra causa: neoplasia, tuberculose, pancreática, nefrótica. *PMN acima de 250/mm³* fecha peritonite bacteriana espontânea, independentemente da cultura. Flora polimicrobiana com proteína alta e múltiplos germes sugere peritonite secundária, que é cirúrgica.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Semeie o líquido em frasco de hemocultura na hora, ao lado do paciente: dobra a positividade da cultura.',
        'Se o líquido parar de sair, gire levemente o cateter ou mude o decúbito.',
        'Vazamento persistente pelo orifício: curativo em bolsa de colostomia resolve.'
      ]}
    ] },

  { id:'puncao-lombar', titulo:'Punção lombar', categoria:'proced', gravidade:'urgencia',
    resumo:'Contraindicações, quando pedir TC antes, técnica e interpretação básica do líquor.',
    tags:['puncao lombar','liquor','l3 l4','pressao de abertura','cefaleia pos-puncao'],
    fonte:'ABN — Recomendações sobre punção liquórica',
    secoes:[
      { tipo:'alerta', titulo:'Antes de puncionar', itens:[
        '*Tomografia antes* se houver: déficit focal, papiledema, rebaixamento, convulsão recente, imunossupressão ou história de doença do SNC.',
        'Na suspeita de meningite bacteriana, o antibiótico *não espera* a punção.',
        'Contraindicações: infecção no local, coagulopatia grave, plaquetas abaixo de 50.000, sinal de hipertensão intracraniana.',
        'Anticoagulado: suspender e aguardar o intervalo seguro do agente.',
        'Medir a *pressão de abertura* sempre que possível — é dado diagnóstico.'
      ]},
      { tipo:'fluxo', titulo:'Passo a passo', itens:[
        { tipo:'inicio', rotulo:'Indicar', texto:'Suspeita de meningite, hemorragia subaracnóidea com tomografia normal, Guillain-Barré, hipertensão intracraniana idiopática' },
        { tipo:'passo', rotulo:'Posicionar', texto:'*Decúbito lateral com dorso fletido*, joelhos ao peito, ombros e quadris alinhados',
          nota:'Só no decúbito lateral dá para medir a pressão de abertura. Sentado é mais fácil, mas não mede' },
        { tipo:'passo', rotulo:'Localizar', texto:'*L3-L4 ou L4-L5* — linha entre as cristas ilíacas cruza L4',
          nota:'A medula termina em L1-L2 no adulto; abaixo disso só há cauda equina' },
        { tipo:'passo', rotulo:'Antissepsia e anestesia', texto:'Clorexidina, campo estéril e lidocaína na pele e no trajeto' },
        { tipo:'passo', rotulo:'Puncionar', texto:'Agulha com bisel *paralelo às fibras* (voltado para o lado), angulada para o umbigo',
          nota:'Agulha atraumática (ponta de lápis) reduz muito a cefaleia pós-punção' },
        { tipo:'passo', rotulo:'Medir e coletar', texto:'*Pressão de abertura* e 4 frascos de 1 a 2 mL',
          nota:'Frascos: bioquímica, celularidade, microbiologia e um reserva' },
        { tipo:'fim', rotulo:'Depois', texto:'Retirar com mandril, curativo; não é preciso repouso prolongado' }
      ]},
      { tipo:'doses', titulo:'Material e amostras', itens:[
        { droga:'Agulha de punção lombar', dose:'20 a 22G, atraumática se disponível', via:'—', obs:'Agulha de menor calibre e ponta de lápis reduzem a cefaleia pós-punção.' },
        { droga:'Lidocaína 1 a 2%', dose:'3 a 5 mL', via:'INFILTRAÇÃO', obs:'Pele e trajeto.' },
        { droga:'Pressão de abertura normal', dose:'10 a 20 cmH2O', via:'—', obs:'Só medida em decúbito lateral com pernas relaxadas. Acima de 25 é elevada.' },
        { droga:'Frasco 1 — bioquímica', dose:'1 a 2 mL', via:'—', obs:'Glicose e proteína. Colher glicemia sérica pareada.' },
        { droga:'Frasco 2 — celularidade', dose:'1 a 2 mL', via:'—', obs:'Contagem total e diferencial.' },
        { droga:'Frasco 3 — microbiologia', dose:'1 a 2 mL', via:'—', obs:'Gram, cultura, látex, BAAR, tinta da China e PCR conforme a suspeita.' },
        { droga:'Frasco 4 — reserva', dose:'1 a 2 mL', via:'—', obs:'Guardar; útil para citologia oncótica e exames adicionais.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Puncionar com sinal de hipertensão intracraniana sem imagem: risco de herniação.',
        'Atrasar o antibiótico da meningite para fazer a punção.',
        'Bisel perpendicular às fibras: aumenta a cefaleia pós-punção.',
        'Repouso prolongado no leito depois: não previne cefaleia.',
        'Retirar a agulha sem recolocar o mandril.'
      ]},
      { tipo:'texto', titulo:'Interpretação e complicações', conteudo:'*Bacteriana*: milhares de células com predomínio de polimorfonucleares, glicose baixa, proteína alta. *Viral*: dezenas a centenas de mononucleares, glicose normal. *Tuberculose e fungo*: mononucleares com glicose baixa e proteína muito alta. *Hemorragia subaracnóidea*: hemácias que não clareiam entre os frascos e xantocromia. Complicação mais comum é a *cefaleia pós-punção*, tratada com hidratação, analgésico, cafeína e, se refratária, tampão sanguíneo epidural.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Acidente de punção (sangue que clareia entre os frascos) difere de hemorragia subaracnóidea (não clareia).',
        'Colha glicemia sérica no mesmo momento: a relação líquor/sangue é o que importa.',
        'Agulha atraumática reduz a cefaleia de cerca de 30% para menos de 5% — vale procurar no serviço.'
      ]}
    ] },

  { id:'cardioversao-desfibrilacao', titulo:'Cardioversão e desfibrilação', categoria:'proced', gravidade:'emergencia',
    resumo:'Sincronizado x não sincronizado, cargas por arritmia, sedação e posicionamento das pás.',
    tags:['cardioversao','desfibrilacao','sincronizado','carga','joules','pas','sync','osasco'],
    fonte:'SBC — Diretriz de emergências cardiovasculares · Manual de Cardiologia na Prática 3.0, p. 16–18',
    ficha:[
      { rotulo:'Quando usar', valor:'*Cardioversão sincronizada:* taquiarritmia com pulso e instabilidade. *Desfibrilação:* FV, TV sem pulso e TV polimórfica.' },
      { rotulo:'Prioridade',  valor:'A diferença entre as duas é o botão SYNC — e errar nele custa o ritmo do paciente.' },
      { rotulo:'Meta',        valor:'Choque entregue de forma segura, com sedação adequada e ninguém encostando na maca.' }
    ],
    secoes:[

      { tipo:'fluxo', titulo:'Fluxograma do procedimento', itens:[
        { tipo:'inicio', rotulo:'Entrada', texto:'Taquiarritmia no monitor' },
        { tipo:'decisao', texto:'O paciente tem pulso?', ramos:[
          { rotulo:'Não', cor:'perigo', texto:'*Protocolo de parada* — desfibrilar, sem sincronizar' },
          { rotulo:'Sim', texto:'Cardioversão sincronizada, se houver instabilidade' }
        ]},
        { tipo:'decisao', texto:'O ritmo é polimórfico?', ramos:[
          { rotulo:'Sim', cor:'perigo', texto:'*DESFIBRILAR*',
            nota:'O aparelho não encontra a onda R em ritmo polimórfico e não dispara' },
          { rotulo:'Não', texto:'*Sincronizar* na carga do ritmo' }
        ]},
        { tipo:'passo', rotulo:'Preparo', texto:'*Sedar com as pás já posicionadas* e a bolsa-válvula na mão',
          nota:'Midazolam se há IC · propofol se não há · fentanil junto. A janela entre sedar e chocar precisa ser curta' },
        { tipo:'passo', rotulo:'Antes de disparar', texto:'*Conferir os marcadores de SYNC sobre cada onda R na tela*',
          nota:'Marcador na onda T em vez da R pode induzir FV. Avisar "afastar" em voz alta e conferir visualmente' },
        { tipo:'decisao', texto:'Reverteu?', ramos:[
          { rotulo:'Não', texto:'*FIASCO* — *FI*os, *A*nálise do ritmo, *S*incroniza, *C*arga maior, *O*bservar',
            nota:'O SYNC sai do modo sincronizado depois de cada choque em vários aparelhos. Tentar posição ântero-posterior' },
          { rotulo:'Sim', cor:'ok', texto:'*ECG de 12 derivações após a reversão*',
            nota:'Frequentemente revela o substrato: pré-excitação, QT longo, isquemia' }
        ]},
        { tipo:'fim', rotulo:'Depois', texto:'Monitorização contínua + investigar o gatilho',
          nota:'Eletrólitos, isquemia, tireoide, sepse, drogas. Paciente cardiovertido não recebe alta da sala' }
      ]},
      { tipo:'alerta', titulo:'Red flags', itens:[
        'Sem pulso — o protocolo é o de parada: *desfibrilação*, nunca cardioversão sincronizada.',
        'TV polimórfica / torsades — *desfibrilar*: o aparelho não consegue sincronizar em ritmo polimórfico.',
        'Paciente consciente sem sedação — cardioverter acordado é dor intensa e evitável.',
        'Oxigênio correndo solto sobre o tórax na hora do choque — risco de ignição. Afastar a fonte.'
      ]},
      { tipo:'passos', titulo:'Passo a passo — OSASCO', itens:[
        '*O*rientar o paciente e a equipe sobre o que vai acontecer.',
        '*S*edar — midazolam se há insuficiência cardíaca, propofol se não há; fentanil para analgesia.',
        '*A*mbuzar — bolsa-válvula-máscara na mão antes de sedar, não depois.',
        '*S*incronizar — apertar SYNC e *confirmar na tela* os marcadores sobre cada onda R.',
        '*C*ardioverter — avisar em voz alta "afastar", conferir que ninguém toca o leito, disparar.',
        '*O*bservar — reavaliar ritmo, pulso e pressão imediatamente após.',
        'Não reverteu? Rodar *FIASCO*: *FI*os, *A*nálise do ritmo, *S*incroniza de novo, *C*arga maior, *O*bservar.'
      ]},
      { tipo:'lista', titulo:'Cargas — bifásico / monofásico', itens:[
        '*FA:* 200 J bifásico · 200 J monofásico — adicionais 200 J / 300–360 J.',
        '*TPSV:* 50–100 J — adicionais 100, 150, 200 J bifásico · 100, 200, 300, 360 J monofásico.',
        '*Flutter:* 50–100 J — mesmos adicionais da TPSV.',
        '*TV monomórfica com pulso:* 100 J — adicionais 150–200 J bifásico · 200, 300, 360 J monofásico.',
        '*FV / TV sem pulso / TV polimórfica:* desfibrilação em carga máxima do aparelho, *sem sincronizar*.'
      ]},
      { tipo:'doses', titulo:'Sedação para o procedimento', itens:[
        { droga:'Midazolam (com IC)', dose:'0,5–2 mg em 2 min', via:'EV', obs:'Ampola 15 mg/3 mL diluída em 7 mL de AD = 1,5 mg/mL. 1 mL a cada 2 min até sedar, mantendo drive respiratório. Máx. 5 mL.' },
        { droga:'Propofol (sem IC)', dose:'0,5–1 mg/kg', via:'EV', obs:'Ampola 10 mg/mL — 1 mL a cada 10 kg. Paciente de 80 kg: 4 mL em bolus, completar mais 4 mL se preciso.' },
        { droga:'Fentanil', dose:'1,5–2 mcg/kg', via:'EV', obs:'50 mcg/mL — 1 a 2 mL puro, lento. Analgesia associada ao sedativo.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Cardioverter sem checar se o SYNC continua ligado — vários aparelhos voltam ao modo não sincronizado depois de cada choque.',
        'Sincronizar em TV polimórfica ou FV: o aparelho não dispara e o tempo é perdido.',
        'Sedar sem material de via aérea e bolsa-válvula-máscara ao alcance da mão.',
        'Disparar sem o aviso em voz alta e sem conferir visualmente que ninguém toca o leito ou a maca.',
        'Colocar as pás sobre eletrodos, adesivos de medicação ou gerador de marca-passo.'
      ]},
      { tipo:'texto', titulo:'Depois do choque', conteudo:'Registrar *ECG de 12 derivações após a reversão* — ele tem valor diagnóstico e frequentemente revela o substrato (pré-excitação, QT longo, isquemia). Manter monitorização contínua e investigar o gatilho: eletrólitos, isquemia, tireoide, sepse, drogas. Paciente cardiovertido não recebe alta da sala de emergência.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Prepare a sedação com o paciente *já monitorizado e com as pás posicionadas* — a janela entre sedar e chocar precisa ser curta.',
        'Confira o marcador de sincronismo na tela, onda por onda. Se os marcadores estão na onda T em vez da R, o choque pode induzir FV.',
        'Pás em posição ântero-lateral resolvem a maioria; se falhou, tentar ântero-posterior antes de subir a carga mais uma vez.'
      ]}
    ] },

  { id:'sedacao-analgesia', titulo:'Sedação e analgesia para procedimento', categoria:'proced', gravidade:'urgencia',
    resumo:'Jejum, monitorização mínima, escolha da droga por procedimento e critérios de alta.',
    tags:['sedacao','analgesia','propofol','quetamina','fentanil','midazolam','monitorizacao'],
    fonte:'AMIB/SBA — Recomendações de sedação fora do centro cirúrgico',
    secoes:[
      { tipo:'alerta', titulo:'Segurança', itens:[
        '*Monitorização obrigatória*: oximetria, cardioscopia, PA e, idealmente, capnografia.',
        'Material de via aérea, aspirador, oxigênio e antídotos preparados antes da primeira dose.',
        'Titular em pequenas doses, esperando o efeito — a maioria dos acidentes vem de dose única grande.',
        'A profundidade pode aprofundar sozinha: quem faz o procedimento não pode ser quem monitoriza.',
        'Avaliar via aérea (Mallampati) e jejum antes, sempre que for eletivo.'
      ]},
      { tipo:'fluxo', titulo:'Passo a passo', itens:[
        { tipo:'inicio', rotulo:'Avaliar', texto:'Via aérea, comorbidades, jejum, alergias e classificação ASA' },
        { tipo:'passo', rotulo:'Preparar', texto:'Monitor, oxigênio, aspirador, ambu, material de intubação e antídotos',
          nota:'Naloxona e flumazenil à vista. Dois profissionais: um faz, outro monitoriza' },
        { tipo:'passo', rotulo:'Analgesia primeiro', texto:'*Fentanila titulada* — dor não se resolve com hipnótico',
          nota:'1 mcg/kg, ou 1 mL de cada vez, checando resposta' },
        { tipo:'passo', rotulo:'Sedação depois', texto:'Titular *2 mL de cada vez*, aguardando o pico do efeito',
          nota:'Propofol, midazolam ou cetamina, conforme o paciente e o procedimento' },
        { tipo:'decisao', texto:'Qual o perfil?', ramos:[
          { rotulo:'Estável, procedimento curto', cor:'ok', texto:'*Propofol* — início e recuperação rápidos' },
          { rotulo:'Instável ou hipotenso', texto:'*Cetamina* — mantém hemodinâmica e drive respiratório' },
          { rotulo:'Precisa de ansiólise leve', texto:'*Midazolam* isolado' },
          { rotulo:'Cardioversão', texto:'Fentanila + propofol ou etomidato tituladas' }
        ]},
        { tipo:'fim', rotulo:'Depois', texto:'Observar até recuperação plena; alta só com acompanhante e sem dirigir por 12 horas' }
      ]},
      { tipo:'doses', titulo:'Drogas', itens:[
        { droga:'Fentanila 50 mcg/mL', dose:'1 mcg/kg, ou 1 mL por vez', via:'EV', obs:'Analgesia. Aguardar 3 minutos entre as doses.' },
        { droga:'Propofol 10 mg/mL', dose:'0,5 a 1 mg/kg, ou 2 mL por vez', via:'EV', obs:'Titular. Causa hipotensão e apneia — tenha volume e ambu à mão.' },
        { droga:'Midazolam', dose:'0,02 a 0,05 mg/kg (cerca de 2 mg)', via:'EV', obs:'Conferir a concentração. Início em 2 a 3 minutos.' },
        { droga:'Cetamina', dose:'0,5 a 1 mg/kg', via:'EV', obs:'Sedação dissociativa. Boa no instável e na criança. Pode causar agitação na recuperação.' },
        { droga:'Etomidato 2 mg/mL', dose:'0,1 a 0,15 mg/kg', via:'EV', obs:'Estabilidade hemodinâmica; não pode ser repetido. Causa mioclonia.' },
        { droga:'Naloxona', dose:'0,04 a 0,4 mg', via:'EV', obs:'Antídoto do opioide. Titular.' },
        { droga:'Flumazenil', dose:'0,2 mg', via:'EV', obs:'Antídoto do benzodiazepínico. Cuidado em usuário crônico.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Ser ao mesmo tempo quem faz o procedimento e quem monitoriza.',
        'Dar a dose cheia de uma vez em vez de titular.',
        'Sedar sem material de via aérea preparado.',
        'Propofol em paciente hipotenso sem otimizar antes.',
        'Dar alta antes da recuperação plena e sem acompanhante.'
      ]},
      { tipo:'texto', titulo:'Registro e alta', conteudo:'Registrar: consentimento, avaliação prévia, jejum, drogas, doses, horários, monitorização, intercorrências e critérios de recuperação (escala de Aldrete, se o serviço usar). Alta quando o paciente estiver desperto e orientado, com sinais vitais estáveis, deambulando com segurança, sem náusea, e acompanhado. Orientar por escrito: não dirigir, não operar máquinas e não tomar decisões importantes por 12 a 24 horas.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Analgesia antes de sedação: paciente com dor precisa de muito mais hipnótico e fica mais instável.',
        'Capnografia detecta apneia antes da oximetria — use se houver.',
        'Combine em voz alta quem monitoriza e quem faz, antes de começar.'
      ]}
    ] },

  { id:'analgesia-ps', titulo:'Analgesia no pronto-socorro', categoria:'proced', gravidade:'rotina',
    resumo:'Escada analgésica na emergência, doses de resgate e uso seguro de opioide.',
    tags:['analgesia','dipirona','morfina','tramadol','escala de dor','aine'],
    fonte:'SBED — Sociedade Brasileira para o Estudo da Dor',
    secoes:[
      { tipo:'alerta', titulo:'Princípios', itens:[
        'Dor é o quinto sinal vital: *medir com escala* na chegada e depois de tratar.',
        'Analgesia não mascara o abdome cirúrgico — a evidência mostra que melhora o exame.',
        'Analgesia multimodal funciona melhor e reduz opioide: combine mecanismos diferentes.',
        'Anti-inflamatório é contraindicado em nefropata, cardiopata descompensado, sangramento digestivo, dengue e desidratado.',
        'Naloxona disponível sempre que se usa opioide.'
      ]},
      { tipo:'fluxo', titulo:'Escada da analgesia no pronto-socorro', itens:[
        { tipo:'inicio', rotulo:'Medir', texto:'Escala numérica de 0 a 10, ou de faces na criança' },
        { tipo:'decisao', texto:'Qual a intensidade?', ramos:[
          { rotulo:'Leve (1 a 3)', cor:'ok', texto:'*Dipirona ou paracetamol*' },
          { rotulo:'Moderada (4 a 6)', texto:'*Dipirona + anti-inflamatório*, ou opioide fraco',
            nota:'Somar mecanismos vale mais que subir a dose de um só' },
          { rotulo:'Intensa (7 a 10)', cor:'perigo', texto:'*Opioide forte titulado*',
            nota:'Morfina diluída, 2 a 3 mg de cada vez' }
        ]},
        { tipo:'passo', rotulo:'Somar', texto:'*Multimodal*: analgésico simples + anti-inflamatório + adjuvante + medida local',
          nota:'Bloqueio local, gelo, imobilização e posicionamento fazem parte' },
        { tipo:'passo', rotulo:'Reavaliar', texto:'*Em 30 minutos* — e registrar a nova escala',
          nota:'Sem reavaliação, não há como saber se funcionou' },
        { tipo:'fim', rotulo:'Alta', texto:'Prescrever em horário fixo nos primeiros dias, não "se dor"' }
      ]},
      { tipo:'doses', titulo:'Medicações e diluições', itens:[
        { droga:'Dipirona 500 mg/mL', dose:'2 mL (1 g) + 8 mL de AD, ou 4 mL (2 g) + 16 mL de AD', via:'EV', obs:'De 6/6 h. Lento. Base da analgesia no pronto-socorro.' },
        { droga:'Paracetamol', dose:'500 a 1000 mg', via:'VO', obs:'De 6/6 h. Máximo de 3 g/dia; menos no hepatopata e no etilista.' },
        { droga:'Cetoprofeno 100 mg', dose:'1 frasco + 100 mL de SF 0,9%', via:'EV', obs:'Correr em 20 minutos. Ver contraindicações do anti-inflamatório.' },
        { droga:'Tenoxicam 20 a 40 mg', dose:'1 frasco + 8 mL de AD', via:'EV', obs:'Alternativa ao cetoprofeno.' },
        { droga:'Diclofenaco 75 mg/3 mL', dose:'3 mL', via:'IM', obs:'Profundo em glúteo. Não fazer endovenoso.' },
        { droga:'Tramadol 100 mg', dose:'1 ampola + 100 mL de SF 0,9%', via:'EV', obs:'LENTO, em 20 a 30 minutos. Correr rápido causa náusea intensa.' },
        { droga:'Morfina 10 mg/mL', dose:'1 ampola + 9 mL de AD (fica 1 mg/mL); fazer 2 a 3 mL', via:'EV', obs:'Repetir a cada 5 a 10 minutos até o controle. Titular.' },
        { droga:'Cetamina em dose analgésica', dose:'0,1 a 0,3 mg/kg', via:'EV', obs:'Em 10 a 15 minutos. Poupa opioide; boa na dor refratária.' },
        { droga:'Metoclopramida ou ondansetrona', dose:'10 mg ou 8 mg', via:'EV', obs:'Antiemético junto do opioide.' },
        { droga:'Lidocaína 1 a 2% — bloqueio local', dose:'Conforme o sítio', via:'INFILTRAÇÃO', obs:'Subutilizada. Resolve muita dor com pouquíssimo risco sistêmico.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Negar analgesia por medo de mascarar diagnóstico.',
        'Anti-inflamatório em nefropata, desidratado, com sangramento digestivo ou suspeita de dengue.',
        'Prescrever "se dor" na alta de dor aguda intensa: horário fixo nos primeiros dias funciona melhor.',
        'Correr tramadol rápido.',
        'Deixar de reavaliar e registrar a dor depois do tratamento.'
      ]},
      { tipo:'texto', titulo:'Internação x alta', conteudo:'A dor por si não interna, mas a dor *refratária* é critério de internação em várias condições — cólica renal, pancreatite, dor oncológica, isquemia. Na alta, prescrever esquema fixo por 48 a 72 horas com resgate, orientar sobre efeitos adversos, e definir retorno. Em dor crônica agudizada, evitar iniciar opioide sem plano de seguimento.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Registre a escala de dor antes e depois — é o que mostra se você tratou.',
        'Bloqueio local com lidocaína é o recurso mais subutilizado do pronto-socorro.',
        'Prescreva o antiemético junto do opioide, não depois de o paciente vomitar.'
      ]}
    ] },

  { id:'anestesia-local', titulo:'Anestesia local e bloqueios simples', categoria:'proced', gravidade:'rotina',
    resumo:'Dose máxima por peso, com e sem vasoconstritor, e sinais de intoxicação por anestésico local.',
    tags:['anestesia local','lidocaina','bupivacaina','vasoconstritor','bloqueio digital','intoxicacao'],
    fonte:'SBA — Sociedade Brasileira de Anestesiologia',
    secoes:[
      { tipo:'alerta', titulo:'Segurança', itens:[
        'Respeitar a *dose máxima por quilo* — a intoxicação sistêmica pode ser fatal.',
        '*Aspirar antes de injetar*, sempre, e injetar devagar enquanto avança.',
        'Sinais precoces de intoxicação: gosto metálico, formigamento perioral, zumbido, tontura, agitação.',
        'Sinais tardios: convulsão, arritmia e colapso cardiovascular.',
        'Antídoto: *emulsão lipídica a 20%* — saiba onde fica no seu serviço.'
      ]},
      { tipo:'fluxo', titulo:'Como fazer', itens:[
        { tipo:'inicio', rotulo:'Antes', texto:'Perguntar alergia, calcular a dose máxima pelo peso e avaliar a função neurovascular' },
        { tipo:'passo', rotulo:'Escolher', texto:'*Lidocaína* para o dia a dia; *bupivacaína* quando se quer duração longa',
          nota:'Com vasoconstritor: dura mais, sangra menos e permite dose maior' },
        { tipo:'passo', rotulo:'Reduzir a dor da injeção', texto:'Aquecer a solução, agulha fina (27 a 30G), injetar *devagar*, pela borda da ferida',
          nota:'Tamponar com bicarbonato (1 mL de bicarbonato para 9 mL de lidocaína) reduz a ardência' },
        { tipo:'passo', rotulo:'Infiltrar', texto:'Aspirar, injetar avançando, formar botão dérmico e progredir a partir dele' },
        { tipo:'passo', rotulo:'Aguardar', texto:'3 a 5 minutos e *testar a sensibilidade* antes de começar' },
        { tipo:'fim', rotulo:'Vigiar', texto:'Sintomas neurológicos ou cardíacos durante e após a infiltração' }
      ]},
      { tipo:'doses', titulo:'Doses máximas e características', itens:[
        { droga:'Lidocaína sem vasoconstritor', dose:'4,5 mg/kg (máximo de 300 mg no adulto)', via:'INFILTRAÇÃO', obs:'Início em 2 a 5 min; dura 30 a 120 min. Solução a 1% tem 10 mg/mL; a 2%, 20 mg/mL.' },
        { droga:'Lidocaína com vasoconstritor', dose:'7 mg/kg (máximo de 500 mg)', via:'INFILTRAÇÃO', obs:'Dura 2 a 6 horas. Hoje é considerada segura em extremidades — evitar em doença arterial.' },
        { droga:'Bupivacaína sem vasoconstritor', dose:'2 mg/kg (máximo de 175 mg)', via:'INFILTRAÇÃO', obs:'Início lento; dura 4 a 12 horas. Mais cardiotóxica.' },
        { droga:'Bupivacaína com vasoconstritor', dose:'3 mg/kg (máximo de 225 mg)', via:'INFILTRAÇÃO', obs:'—' },
        { droga:'Bloqueio digital', dose:'2 a 4 mL por dedo', via:'INFILTRAÇÃO', obs:'Bloqueio em anel na base do dedo. Volume grande comprime e isquemia.' },
        { droga:'Emulsão lipídica 20%', dose:'1,5 mL/kg em bolus, depois 0,25 mL/kg/min', via:'EV', obs:'Antídoto da intoxicação por anestésico local. Localize onde fica.' },
        { droga:'Bicarbonato de sódio 8,4%', dose:'1 mL para 9 mL de lidocaína', via:'—', obs:'Tampona a solução e reduz muito a ardência da injeção.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Injetar sem aspirar.',
        'Ultrapassar a dose máxima por quilo — calcule antes, sobretudo em criança.',
        'Injetar rápido: dói muito mais e aumenta o pico sérico.',
        'Volume grande em bloqueio digital: comprime e isquemia o dedo.',
        'Ignorar formigamento perioral ou gosto metálico durante a infiltração — pare imediatamente.'
      ]},
      { tipo:'texto', titulo:'Intoxicação por anestésico local', conteudo:'Suspeitar diante de sintoma neurológico ou cardíaco durante ou após a infiltração. *Conduta*: parar a injeção, oxigênio a 100%, benzodiazepínico para a convulsão, e *emulsão lipídica a 20%* — 1,5 mL/kg em bolus, seguido de 0,25 mL/kg/min, podendo repetir o bolus. Evitar propofol como sedativo nesse contexto. Em parada, RCP prolongada: a recuperação pode demorar.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Calcule a dose máxima em mL antes de puxar a seringa: 4,5 mg/kg em 70 kg dá 315 mg, ou cerca de 15 mL a 2%.',
        'Aqueça o frasco na mão e injete devagar — muda muito a experiência do paciente.',
        'Teste a anestesia antes de incisar; esperar 2 minutos a mais evita muita dor.'
      ]}
    ] },

  { id:'sondagens', titulo:'Sondagem vesical e nasogástrica', categoria:'proced', gravidade:'rotina',
    resumo:'Indicações, contraindicações (inclusive as do trauma) e confirmação de posicionamento.',
    tags:['sonda vesical','sonda nasogastrica','sng','foley','uretrorragia','confirmacao'],
    fonte:'Ministério da Saúde / SBU — Procedimentos de enfermagem e urologia',
    secoes:[
      { tipo:'alerta', titulo:'Contraindicações que importam', itens:[
        '*Sonda vesical*: uretrorragia, hematoma perineal, próstata deslocada ou não palpável no trauma — não passar pela uretra.',
        '*Sonda nasogástrica*: suspeita de fratura de base de crânio — passar pela boca, não pelo nariz.',
        'Varizes de esôfago não contraindicam a sonda nasogástrica.',
        'Confirmar o posicionamento antes de infundir qualquer coisa pela sonda enteral.',
        'Após 2 tentativas frustradas de sondagem vesical, chame a urologia.'
      ]},
      { tipo:'fluxo', titulo:'Sonda vesical — passo a passo', itens:[
        { tipo:'inicio', rotulo:'Indicar', texto:'Retenção urinária, controle de diurese no grave, pré-operatório, ou lesão sacral em incontinente' },
        { tipo:'passo', rotulo:'Preparar', texto:'Técnica estéril, campo, antissepsia e *lidocaína gel em abundância*',
          nota:'Instilar 10 a 20 mL na uretra e aguardar 3 a 5 minutos — reduz muito a dor' },
        { tipo:'passo', rotulo:'No homem', texto:'Tracionar o pênis a 90 graus, introduzir até a bifurcação e aguardar a urina',
          nota:'Se houver resistência na próstata, abaixe o pênis e peça para o paciente respirar fundo' },
        { tipo:'passo', rotulo:'Insuflar', texto:'*Só depois de ver a urina fluir* — insuflar na uretra rompe o canal',
          nota:'10 mL de água destilada no balonete, nunca soro fisiológico (cristaliza)' },
        { tipo:'passo', rotulo:'Drenar', texto:'Esvaziar completamente; a antiga recomendação de clampear a cada 500 mL foi abandonada' },
        { tipo:'fim', rotulo:'Registrar', texto:'Calibre, volume drenado, aspecto e data de inserção' }
      ]},
      { tipo:'lista', titulo:'Sonda nasogástrica e nasoentérica', itens:[
        'Medir: da ponta do nariz ao lóbulo da orelha, e daí ao apêndice xifoide.',
        'Lubrificar bem e introduzir pela narina mais pérvia, com o pescoço fletido; pedir para engolir quando chegar à orofaringe.',
        '*Confirmar a posição*: radiografia é o padrão-ouro para sonda enteral antes de alimentar. Ausculta epigástrica não é confiável.',
        'Aspirar conteúdo e medir o pH ajuda: pH ácido sugere posição gástrica.',
        'Suspeita de fratura de base de crânio: via orogástrica.',
        'Fixar sem tracionar a asa do nariz — necrose é complicação frequente.'
      ]},
      { tipo:'doses', titulo:'Material', itens:[
        { droga:'Sonda de Foley', dose:'Adulto 16 a 18 Fr; próstata aumentada 18 a 20 Fr', via:'URETRAL', obs:'Calibre maior é mais rígido e pode passar melhor na próstata.' },
        { droga:'Lidocaína gel 2%', dose:'10 a 20 mL', via:'URETRAL', obs:'Instilar e aguardar 3 a 5 minutos. Faz muita diferença.' },
        { droga:'Água destilada para o balonete', dose:'10 mL (adulto)', via:'—', obs:'Nunca soro fisiológico: cristaliza e impede o esvaziamento.' },
        { droga:'Sonda nasogástrica', dose:'Adulto 14 a 18 Fr', via:'NASAL ou ORAL', obs:'Calibrosa para drenagem; fina e flexível para alimentação.' },
        { droga:'Sonda nasoentérica', dose:'10 a 12 Fr', via:'NASAL', obs:'Posicionamento pós-pilórico; confirmar com radiografia antes de alimentar.' },
        { droga:'Cistostomia suprapúbica', dose:'—', via:'—', obs:'Quando a via uretral é impossível ou contraindicada. Guiada por ultrassom.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Insuflar o balonete antes de ver a urina.',
        'Usar soro fisiológico no balonete.',
        'Forçar a sonda vesical: mais de 2 tentativas frustradas pede urologia.',
        'Sondagem nasogástrica na suspeita de fratura de base de crânio.',
        'Alimentar por sonda enteral sem confirmação radiológica da posição.'
      ]},
      { tipo:'texto', titulo:'Complicações e prevenção', conteudo:'*Vesical*: infecção do trato urinário associada a cateter (a mais comum das infecções hospitalares), trauma uretral, falso trajeto, estenose tardia. Prevenção: indicação criteriosa, técnica estéril, sistema fechado, e *retirada precoce* — avaliar diariamente a necessidade. *Nasogástrica*: epistaxe, posicionamento traqueal, sinusite, necrose de asa nasal, broncoaspiração. Registrar sempre calibre, data, indicação e a data prevista de retirada.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'A melhor forma de prevenir infecção urinária é não passar a sonda, e retirar cedo a que já está.',
        'Lidocaína gel com tempo de ação transforma a experiência do paciente.',
        'Anote na passagem: data de inserção de cada sonda e se ainda é necessária.'
      ]}
    ] },

  { id:'ecg-leitura', titulo:'Leitura sistemática do ECG no plantão', categoria:'proced', gravidade:'rotina',
    resumo:'Roteiro fixo de leitura e os dez padrões que não podem passar despercebidos.',
    tags:['ecg','eletrocardiograma','supra','bloqueio','qt longo','brugada','sobrecarga'],
    fonte:'SBC — Diretriz de interpretação de eletrocardiograma',
    secoes:[
      { tipo:'alerta', titulo:'Os padrões que não podem passar', itens:[
        '*Supra de ST* com critério de infarto — e o bloqueio de ramo esquerdo novo com clínica.',
        '*Infra de ST em V1-V2* pode ser infarto de parede dorsal: fazer V7 a V9.',
        '*Supra em aVR isolado* com infra difuso: lesão de tronco ou proximal de descendente anterior.',
        '*QT longo* com risco de torsades.',
        '*Brugada*: supra em V1-V3 com padrão de bloqueio de ramo direito.',
        '*Wolff-Parkinson-White*: PR curto com onda delta.',
        '*Hipercalemia*: T apiculada, PR alargado, perda da onda P, QRS alargado.',
        '*BAV total*: dissociação entre P e QRS.',
        '*TV*: QRS largo, regular, com dissociação atrioventricular.',
        '*Sobrecarga direita aguda* (S1Q3T3) na suspeita de TEP.'
      ]},
      { tipo:'fluxo', titulo:'Roteiro fixo de leitura', itens:[
        { tipo:'inicio', rotulo:'0', texto:'Conferir *nome, data, hora* e a calibração (10 mm/mV, 25 mm/s)' },
        { tipo:'passo', rotulo:'1 · Ritmo', texto:'É sinusal? Onda P positiva em D1 e D2, precedendo cada QRS' },
        { tipo:'passo', rotulo:'2 · Frequência', texto:'300 dividido pelo número de quadradões entre dois R',
          nota:'Ou, se irregular, contar os QRS em 30 quadradões (6 s) e multiplicar por 10' },
        { tipo:'passo', rotulo:'3 · Eixo', texto:'Olhar D1 e aVF: ambos positivos, eixo normal' },
        { tipo:'passo', rotulo:'4 · Onda P', texto:'Duração e amplitude — sobrecarga atrial direita e esquerda' },
        { tipo:'passo', rotulo:'5 · Intervalo PR', texto:'Normal 120 a 200 ms. Curto: pré-excitação. Longo: BAV de 1º grau' },
        { tipo:'passo', rotulo:'6 · QRS', texto:'Duração (normal abaixo de 120 ms), morfologia, progressão de R e ondas Q patológicas' },
        { tipo:'passo', rotulo:'7 · ST e T', texto:'*O passo mais importante* — supra, infra, inversão de T' },
        { tipo:'fim', rotulo:'8 · QT', texto:'QTc pela fórmula de Bazett; acima de 500 ms é risco de torsades' }
      ]},
      { tipo:'lista', titulo:'Critérios de supra de ST', itens:[
        'Supra maior que 1 mm em duas derivações contíguas.',
        'Em V2 e V3: maior ou igual a 2,5 mm em homem abaixo de 40 anos; 2,0 mm em homem acima de 40; 1,5 mm em mulher.',
        'Na fase hiperaguda, pode não haver supra ainda, apenas *onda T apiculada e larga*.',
        'Infra de ST maior que 0,5 mm em V1 e V2: suspeitar de infarto dorsal — fazer V7, V8 e V9.',
        'Supra em D2, D3 e aVF: parede inferior — sempre fazer V3R e V4R para o ventrículo direito.'
      ]},
      { tipo:'doses', titulo:'Referências rápidas', itens:[
        { droga:'Velocidade e calibração padrão', dose:'25 mm/s e 10 mm/mV', via:'—', obs:'1 quadradinho = 40 ms; 1 quadradão = 200 ms.' },
        { droga:'Frequência cardíaca', dose:'300 ÷ número de quadradões entre dois R', via:'—', obs:'Sequência: 300, 150, 100, 75, 60, 50.' },
        { droga:'PR normal', dose:'120 a 200 ms (3 a 5 quadradinhos)', via:'—', obs:'Acima de 200: BAV de 1º grau. Abaixo de 120: pré-excitação.' },
        { droga:'QRS normal', dose:'Abaixo de 120 ms (3 quadradinhos)', via:'—', obs:'Acima: bloqueio de ramo, ritmo ventricular, hipercalemia ou bloqueio de canal de sódio.' },
        { droga:'QTc', dose:'QT ÷ raiz quadrada do intervalo RR', via:'—', obs:'Normal até 440 ms no homem e 460 na mulher. Acima de 500: risco de torsades.' },
        { droga:'Derivações adicionais', dose:'V7 a V9 (dorsal) · V3R e V4R (ventrículo direito)', via:'—', obs:'Fazer sempre no infarto inferior e no infra de V1-V2.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Confiar no laudo automático do aparelho — ele erra, sobretudo no QRS e no QT.',
        'Considerar um único ECG normal como exclusão de isquemia: repita.',
        'Deixar de fazer derivações adicionais no infarto inferior.',
        'Interpretar sem conferir a calibração e a velocidade.',
        'Ler o ECG sem a clínica: o mesmo traçado significa coisas diferentes.'
      ]},
      { tipo:'texto', titulo:'Comparar sempre', conteudo:'O ECG antigo é o exame complementar mais valioso: alteração nova muda tudo. Peça sempre o traçado prévio. Registre no prontuário o horário exato de cada ECG e o que você viu — descrever, e não só anexar, é o que permite comparar depois.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Siga o roteiro sempre na mesma ordem: é assim que se para de perder achado.',
        'ECG seriado a cada 15 a 30 minutos enquanto houver dor torácica.',
        'Meça você mesmo o QRS e o QT nos casos que importam.'
      ]}
    ] },

  { id:'pocus', titulo:'POCUS no plantão (FAST, pulmão e volemia)', categoria:'proced', gravidade:'rotina',
    resumo:'As janelas que resolvem à beira do leito e as perguntas binárias que o ultrassom responde.',
    tags:['pocus','ultrassom','fast','efast','linhas b','veia cava','beira do leito'],
    fonte:'AMIB — Recomendações de ultrassonografia point-of-care',
    secoes:[
      { tipo:'alerta', titulo:'Como usar bem', itens:[
        'POCUS responde *perguntas binárias*, não substitui exame formal: tem líquido? tem derrame? desliza?',
        'Exame negativo não exclui: é dinâmico e deve ser repetido se o paciente piorar.',
        'Registre no prontuário que foi *point-of-care*, feito pelo assistente, com caráter complementar.',
        'Não atrase conduta salvadora para fazer ultrassom.',
        'O maior risco é a confiança excessiva em imagem mal obtida.'
      ]},
      { tipo:'fluxo', titulo:'As janelas que resolvem no plantão', itens:[
        { tipo:'inicio', rotulo:'Escolher a pergunta', texto:'O que muda a conduta agora?' },
        { tipo:'paralelo', colunas:[
          { tipo:'passo', rotulo:'FAST', texto:'*Líquido livre?* Hepatorrenal, esplenorrenal, pélvica e subxifoide',
            nota:'No trauma instável, FAST positivo indica laparotomia' },
          { tipo:'passo', rotulo:'Pulmão', texto:'*Desliza? Tem linhas B?*',
            nota:'Ausência de deslizamento: pneumotórax. Linhas B difusas: edema. Consolidação: pneumonia' },
          { tipo:'passo', rotulo:'Cardíaco', texto:'*Contrai? Tem derrame? Cavidades direitas dilatadas?*',
            nota:'Subxifoide e paraesternal. Tamponamento, disfunção grave e sobrecarga direita' }
        ]},
        { tipo:'paralelo', colunas:[
          { tipo:'passo', rotulo:'Cava', texto:'*Colaba?* Estimativa de volemia',
            nota:'Cava fina e colabável sugere hipovolemia; dilatada e fixa, congestão ou obstrução' },
          { tipo:'passo', rotulo:'Aorta', texto:'*Dilatada?* Aneurisma abdominal acima de 3 cm' },
          { tipo:'passo', rotulo:'Bexiga', texto:'*Cheia?* Retenção urinária e volume residual' }
        ]},
        { tipo:'passo', rotulo:'Guiar procedimento', texto:'Acesso central, toracocentese, paracentese e punção — sempre melhor guiado' },
        { tipo:'fim', rotulo:'Registrar', texto:'O que foi visto, em qual janela, e a conclusão' }
      ]},
      { tipo:'lista', titulo:'Protocolo RUSH no choque indiferenciado', itens:[
        '*Pump* (bomba) — coração: contratilidade, derrame pericárdico, dilatação de câmaras direitas.',
        '*Tank* (tanque) — veia cava, pulmão (linhas B), abdome (líquido livre): volemia e extravasamento.',
        '*Pipes* (canos) — aorta (aneurisma, dissecção) e veias de membros inferiores (trombose).',
        'Choque hipovolêmico: cava colabada, coração hipercinético e vazio.',
        'Choque obstrutivo: cava dilatada com derrame pericárdico, ou ventrículo direito dilatado no TEP.',
        'Choque cardiogênico: cava dilatada, coração hipocontrátil, linhas B difusas.',
        'Choque distributivo: cava variável, coração hiperdinâmico, sem congestão pulmonar.'
      ]},
      { tipo:'doses', titulo:'Transdutores e ajustes', itens:[
        { droga:'Transdutor convexo (abdominal)', dose:'2 a 5 MHz', via:'—', obs:'FAST, aorta, bexiga, rim, pulmão. O mais versátil na emergência.' },
        { droga:'Transdutor setorial (cardíaco)', dose:'1 a 5 MHz', via:'—', obs:'Janelas cardíacas e intercostais; passa bem entre as costelas.' },
        { droga:'Transdutor linear', dose:'5 a 12 MHz', via:'—', obs:'Acesso vascular, partes moles, pleura e nervos. Alta resolução, pouca profundidade.' },
        { droga:'Janela hepatorrenal (Morison)', dose:'—', via:'—', obs:'A mais sensível do FAST para líquido livre no decúbito dorsal.' },
        { droga:'Janela subxifoide', dose:'—', via:'—', obs:'Derrame pericárdico e tamponamento. Aprenda esta primeiro: leva segundos.' },
        { droga:'Linhas B', dose:'3 ou mais por espaço intercostal', via:'—', obs:'Difusas e bilaterais indicam síndrome intersticial: edema pulmonar.' }
      ]},
      { tipo:'naofazer', titulo:'Não fazer', itens:[
        'Substituir a tomografia formal por POCUS quando ela é indicada e possível.',
        'Excluir pneumotórax por um único ponto examinado.',
        'Atrasar descompressão, laparotomia ou reanimação para fazer o exame.',
        'Laudar como se fosse ultrassonografia formal.',
        'Interpretar imagem ruim: se a janela não está boa, o exame é inconclusivo, não negativo.'
      ]},
      { tipo:'texto', titulo:'Registro no prontuário', conteudo:'Descrever como *ultrassonografia point-of-care realizada pelo médico assistente, em caráter direcionado e complementar ao exame físico, não substituindo exame de imagem formal*. Listar as janelas obtidas e o que foi visto em cada uma. Reforçar o caráter dinâmico: reavaliar se houver deterioração.' },
      { tipo:'dica', titulo:'Pega do plantão', itens:[
        'Comece por duas janelas: subxifoide e pulmão. Elas sozinhas mudam conduta todos os dias.',
        'Marque o ponto de punção e puncione ali, sem mudar a posição do paciente.',
        'Repita o exame depois de cada intervenção grande: é isso que o torna diferente da imagem formal.'
      ]}
    ] }

];
