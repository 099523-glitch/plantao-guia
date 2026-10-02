/* ============================================================
   RECEITAS PEDIÁTRICAS — a dose sai do peso digitado no topo

   { id:'rp-...', grupo:'Pediatria', nome, sub, tags, conduta, atencao,
     itens:[ { pid, dose, uso }   // pid = droga da calculadora pediátrica
                                  // (FERR_PEDIA / PED_PLANILHA), dose = índice
                                  // em doses[]; o app escreve "Dar X mL VO de
                                  // 8 em 8 horas, <uso>."
             { med, uso } ],      // item fixo (pomada, colírio, soro nasal)
     orientacoes:[] }
   O motor está em app.js (rxPedLinhas). Sem peso, a folha pede o peso
   e não deixa copiar.
   ============================================================ */

var FERR_RX_PEDIA = [

{ id:'rp-febre', grupo:'Pediatria', nome:'Febre e dor', sub:'Antitérmico por peso, sem alternar',
  tags:['febre','dor','antitermico','antitérmico','paracetamol','dipirona','ibuprofeno','crianca','criança'], conduta:'febre-sem-foco',
  fonte:'SBP — Manejo da febre aguda (2021); AAP — Fever and antipyretic use (2011, reafirmado 2016)',
  atencao:'Menor de 3 meses com febre de 38 °C ou mais NÃO é receita de alta sem avaliação completa (ver conduta). Dipirona só a partir de 3 meses e 5 kg; ibuprofeno só a partir de 6 meses e nunca em suspeita de dengue, varicela ou desidratação. Ácido acetilsalicílico nunca. Usar UM antitérmico: alternar não reduz complicação e aumenta erro de dose. Reavaliar antes da alta se houver petéquias, rigidez de nuca, gemência, prostração entre as febres ou criança que não se alimenta.',
  itens:[
    { pid:'p-paracetamol', dose:0, uso:'se febre (37,8 °C ou mais) ou dor, no máximo 4 doses em 24 h' },
    { pid:'p-dipirona', dose:0, uso:'somente NO LUGAR do paracetamol, se ele não fizer efeito — não intercalar os dois' }
  ],
  orientacoes:[
    'A febre é uma defesa do corpo e não causa dano ao cérebro. O remédio serve para a criança ficar confortável, não para zerar o termômetro.',
    'Dê o remédio com seringa dosadora, na dose exata da receita. Não some com outros remédios que tenham o mesmo princípio ativo.',
    'Ofereça bastante líquido e deixe a criança com roupa leve. Não use álcool nem banho gelado.',
    'Volte AGORA se: manchas roxas na pele que não somem ao apertar, muita sonolência ou difícil de acordar, gemido, falta de ar, convulsão, vômitos sem parar, pouco xixi.',
    'Volte para reavaliar se a febre durar mais de 3 dias, ou se for bebê menor de 3 meses.'
  ] },

{ id:'rp-ivas', grupo:'Pediatria', nome:'Resfriado (IVAS)', sub:'Sem antibiótico — lavagem nasal e antitérmico',
  tags:['ivas','resfriado','gripe','coriza','tosse','nariz entupido','rinofaringite','soro nasal'], conduta:'ivas-pedia',
  fonte:'SBP — Departamento de Pediatria Ambulatorial; AAP; Anvisa (mucolíticos abaixo de 2 anos, 2010)',
  atencao:'Quadro viral: antibiótico não encurta nem previne complicação. NÃO prescrever descongestionante (oral ou nasal) nem antitussígeno abaixo de 6 anos — proibido abaixo de 2 anos. Mucolítico (ambroxol, bromexina, carbocisteína, acetilcisteína) contraindicado abaixo de 2 anos. Mel só a partir de 1 ano (botulismo). Febre no menor de 3 meses: não é esta receita.',
  itens:[
    { med:'Soro fisiológico 0,9% nasal', uso:'Pingar 1 a 3 mL (ou 2 a 5 gotas no bebê) em cada narina várias vezes ao dia, sempre antes de mamar, comer e dormir. Aspirar o nariz do bebê em seguida.' },
    { pid:'p-paracetamol', dose:0, uso:'se febre ou dor, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'Resfriado dura de 7 a 10 dias, e a tosse pode durar até 3 semanas. É normal o catarro ficar amarelo ou verde.',
    'Lavar o nariz com soro é o tratamento principal. Ofereça líquidos e alimentação em pouca quantidade e mais vezes.',
    'Criança acima de 1 ano pode tomar meia a 1 colher de chá de mel antes de dormir para a tosse. Nunca mel para menor de 1 ano.',
    'Não dê xarope para tosse nem remédio para desentupir o nariz sem orientação médica.',
    'Volte se: respiração rápida ou cansada, costelas afundando ao respirar, febre por mais de 3 dias, dor de ouvido, muita sonolência ou recusa de líquidos.'
  ] },

{ id:'rp-oma', grupo:'Pediatria', nome:'Otite média aguda', sub:'Amoxicilina em dose alta + analgesia',
  tags:['otite','oma','dor de ouvido','otalgia','amoxicilina','ouvido'], conduta:'ivas-pedia',
  fonte:'AAP — Diagnosis and management of acute otitis media (2013); SBP — Departamento de Otorrinolaringologia',
  atencao:'Duração: 10 dias abaixo de 2 anos ou com otorreia; *a partir de 2 anos sem gravidade, 5 a 7 dias* — ajuste no rascunho. Antibiótico sempre abaixo de 6 meses; de 6 a 23 meses, sempre se bilateral, com otorreia ou grave. A partir de 2 anos, quadro leve e unilateral permite observar 48 a 72 h só com analgesia, se houver retorno garantido. Amoxicilina nos últimos 30 dias, ou conjuntivite purulenta junto: use a receita de otite com falha (amoxicilina-clavulanato). Alergia não grave à penicilina: cefuroxima; anafilaxia: azitromicina (falha maior). Abaulamento atrás da orelha, orelha desviada, paralisia facial ou rigidez de nuca: não é alta.',
  itens:[
    { pid:'p-amoxicilina', dose:1, uso:'por 10 dias, mesmo que melhore antes' },
    { pid:'p-paracetamol', dose:0, uso:'se dor ou febre, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'A dor costuma melhorar em 48 a 72 h de antibiótico. Dê o remédio para dor sempre que precisar, principalmente à noite.',
    'Termine o antibiótico até o último dia, mesmo que a criança fique bem antes.',
    'Não pingue nada no ouvido sem orientação e não use cotonete.',
    'Volte se a febre ou a dor continuarem depois de 2 a 3 dias de antibiótico, se aparecer inchaço ou vermelhidão atrás da orelha, ou se a criança ficar muito sonolenta, com vômitos ou dor no pescoço.',
    'Reavaliação com o pediatra ao fim do tratamento. Secreção que continua no ouvido por semanas é comum e precisa de seguimento.'
  ] },

{ id:'rp-oma-falha', grupo:'Pediatria', nome:'Otite média — falha ou recorrência', sub:'Amoxicilina-clavulanato por 10 dias',
  tags:['otite','oma','falha terapeutica','recorrente','amoxicilina clavulanato','clavulin','ouvido'], conduta:'ivas-pedia',
  fonte:'AAP — Diagnosis and management of acute otitis media (2013)',
  atencao:'Indicações: sem melhora após 48 a 72 h de amoxicilina, amoxicilina nos últimos 30 dias, otite com conjuntivite purulenta, ou otite recorrente. Calcular por 90 mg/kg/dia de amoxicilina (topo da faixa da calculadora). Na formulação 7:1 (400/57 mg) essa dose leva mais clavulanato e mais diarreia; se a 14:1 (600/42,9 mg) estiver disponível, prefira. Se vomita ou não aceita VO: ceftriaxona 50 mg/kg IM 1 vez ao dia por 3 dias. Falha também ao clavulanato: encaminhar ao otorrino para timpanocentese. Mastoidite, paralisia facial ou sinais meníngeos: não é alta.',
  itens:[
    { pid:'p-amoxclav', dose:0, uso:'por 10 dias, tomar no início da refeição' },
    { pid:'p-paracetamol', dose:0, uso:'se dor ou febre, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'Dê o antibiótico junto com a comida: diminui a dor de barriga e a diarreia.',
    'Fezes amolecidas são comuns. Não pare o remédio por isso — volte se a diarreia for muito forte ou tiver sangue.',
    'Termine os 10 dias, mesmo que a criança melhore antes.',
    'Volte se a febre ou a dor não melhorarem em 48 h, ou se aparecer inchaço atrás da orelha, vômitos, sonolência ou dor no pescoço.'
  ] },

{ id:'rp-faringite', grupo:'Pediatria', nome:'Faringite estreptocócica', sub:'Amoxicilina 10 dias — confirmada ou muito provável',
  tags:['faringite','amigdalite','dor de garganta','estreptococo','strepto','placa','amoxicilina','benzetacil','febre reumatica'], conduta:'ivas-pedia',
  fonte:'AHA — Prevenção da febre reumática (2009); IDSA — Faringite estreptocócica (2012); SBP',
  atencao:'Abaixo de 3 anos a faringite estreptocócica é rara: pense em viral. Confirme com teste rápido ou cultura quando houver. Alternativa em dose única: penicilina benzatina IM — 600.000 UI até 25 a 27 kg, 1.200.000 UI acima disso (calculadora pl-benzatina). Alergia à penicilina: azitromicina 12 mg/kg 1 vez ao dia por 5 dias, máximo 500 mg (0,3 mL/kg da suspensão 200 mg/5 mL) — a dose da calculadora (10 mg/kg) é para outras infecções. Trismo, voz abafada, desvio da úvula, baba ou pescoço travado: abscesso — não é alta. Exantema com amoxicilina em adolescente: pensar em mononucleose.',
  itens:[
    { pid:'p-amoxicilina', dose:0, uso:'por 10 dias completos, mesmo que a dor passe antes' },
    { pid:'p-paracetamol', dose:0, uso:'se febre ou dor, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'Os 10 dias de antibiótico são para prevenir febre reumática, que ataca o coração. Não pare antes.',
    'A criança pode voltar à escola 24 h depois de começar o antibiótico, se estiver sem febre.',
    'Ofereça alimentos frios e pastosos e bastante líquido. Troque a escova de dentes depois de 24 h de tratamento.',
    'Volte se: não conseguir engolir nem a saliva, babar, não abrir a boca, voz abafada, pescoço duro, falta de ar, pouco xixi, ou se a febre continuar depois de 48 h de antibiótico.',
    'Volte também se, nas próximas semanas, aparecer dor e inchaço nas juntas, urina escura ou inchaço no rosto.'
  ] },

{ id:'rp-sinusite', grupo:'Pediatria', nome:'Sinusite bacteriana aguda', sub:'Amoxicilina 10 dias + lavagem nasal',
  tags:['sinusite','rinossinusite','secrecao nasal','secreção','amoxicilina','soro nasal'], conduta:'ivas-pedia',
  fonte:'AAP — Acute bacterial sinusitis in children (2013); EPOS (2020); ABORL',
  atencao:'Diagnóstico clínico, sem raio X: secreção ou tosse por mais de 10 dias sem melhora; OU início grave (febre de 39 °C ou mais com secreção purulenta por 3 dias); OU piora depois de melhorar. Dose alta (90 mg/kg/dia — índice 1 da calculadora) se menor de 2 anos, creche ou antibiótico nos últimos 30 dias. Falha em 72 h: amoxicilina-clavulanato. *Inchaço ou vermelhidão ao redor do olho, dor ao mexer o olho, visão dupla, dor de cabeça forte, vômitos ou rigidez de nuca: complicação orbitária ou intracraniana — não é alta.* Sem descongestionante nem anti-histamínico.',
  itens:[
    { pid:'p-amoxicilina', dose:0, uso:'por 10 dias, mesmo que melhore antes' },
    { med:'Soro fisiológico 0,9% nasal', uso:'Lavar cada narina com 3 a 5 mL (seringa sem agulha), 3 a 4 vezes ao dia, antes do antibiótico e de dormir.' },
    { pid:'p-paracetamol', dose:0, uso:'se febre ou dor, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'A melhora começa em 2 a 3 dias. Termine o antibiótico até o fim.',
    'Lave o nariz com soro várias vezes ao dia: ajuda a secreção a sair.',
    'Não use remédio para desentupir o nariz.',
    'Volte AGORA se: olho inchado ou vermelho, dor para mexer o olho, visão dupla, dor de cabeça muito forte, vômitos, pescoço duro ou sonolência.',
    'Volte se não houver melhora em 3 dias de antibiótico.'
  ] },

{ id:'rp-asma-alta', grupo:'Pediatria', nome:'Asma — alta após a crise', sub:'Salbutamol com espaçador + prednisolona',
  tags:['asma','broncoespasmo','chiado','sibilancia','bombinha','salbutamol','aerolin','espacador','prednisolona'], conduta:'asma-pedia',
  fonte:'GINA (2025); SBP — Departamento de Pneumologia; SBPT',
  atencao:'Alta só com saturação de 94% ou mais em ar ambiente, sem esforço respiratório, falando e se alimentando, e estável por 1 a 4 h depois do último broncodilatador. Família precisa demonstrar a técnica do espaçador antes de sair. Se recebeu dexametasona na unidade (0,6 mg/kg), pode substituir a prednisolona por mais 1 dose de dexametasona no dia seguinte (calculadora, dexametasona índice 1). Crise grave, internação prévia em UTI, crises frequentes ou uso de salbutamol mais de 2 vezes por semana: precisa de corticoide inalatório de manutenção — encaminhar ao pediatra em até 1 semana. Não prescrever xarope de broncodilatador nem antibiótico de rotina.',
  itens:[
    { med:'Salbutamol spray 100 mcg/jato, com espaçador', uso:'Fazer 2 a 4 jatos (acima de 20 kg, 4 a 6 jatos) com espaçador, 1 jato de cada vez com 5 a 6 respirações, de 4/4 h nas primeiras 48 h. Depois, de 6/6 h até completar 5 dias, e então só se tiver chiado ou falta de ar.' },
    { pid:'p-prednisolona', dose:0, uso:'pela manhã, por 5 dias no total contando a dose de hoje' }
  ],
  orientacoes:[
    'Use SEMPRE o espaçador (com máscara bem encostada no rosto em menores de 4 anos). Sem espaçador quase nada do remédio chega ao pulmão.',
    'Chacoalhe a bombinha antes de cada jato. Lave o espaçador com água e detergente neutro 1 vez por semana e deixe secar sem enxugar.',
    'O corticoide é por poucos dias: pode parar no fim sem diminuir a dose.',
    'Volte AGORA se: precisar da bombinha antes de 4 h, falta de ar que não melhora com a bombinha, costelas afundando, lábios roxos, dificuldade para falar ou mamar, sonolência.',
    'Consulta com o pediatra em até 1 semana para o plano de prevenção das crises. Evite fumaça de cigarro em casa e no carro.'
  ] },

{ id:'rp-laringite-alta', grupo:'Pediatria', nome:'Laringite (crupe) — alta', sub:'Dexametasona já feita na unidade',
  tags:['laringite','crupe','tosse de cachorro','estridor','rouquidao','rouquidão','dexametasona'], conduta:'laringite',
  fonte:'SBP — Departamento de Pneumologia; Cochrane — Glucocorticoids for croup (2023); AAP',
  atencao:'Dexametasona em DOSE ÚNICA feita na unidade (0,15 a 0,6 mg/kg): não precisa repetir em casa no crupe leve a moderado. Alta só sem estridor em repouso e sem tiragem; se recebeu adrenalina nebulizada, observar pelo menos 2 a 4 h depois. Febre alta com aspecto toxêmico, baba, dificuldade para engolir ou posição sentada inclinada para frente: epiglotite ou traqueíte bacteriana — não é alta. Episódios recorrentes ou abaixo de 6 meses: investigar causa estrutural. Sem antibiótico, xarope ou nebulização em casa.',
  itens:[
    { pid:'p-paracetamol', dose:0, uso:'se febre ou desconforto, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'A tosse "de cachorro" e a rouquidão costumam piorar à noite e melhoram em 2 a 3 dias. O remédio dado aqui no serviço continua agindo por esses dias.',
    'Mantenha a criança calma e no colo: o choro piora a falta de ar. Vapor e nebulização com soro em casa não mostraram benefício.',
    'Ofereça líquidos em pequenas quantidades.',
    'Volte AGORA se: barulho ao respirar mesmo parada (sem chorar), costelas ou pescoço afundando ao respirar, lábios roxos, baba, dificuldade para engolir, muita sonolência ou agitação.',
    'Volte se a tosse durar mais de 1 semana ou se a febre passar de 3 dias.'
  ] },

{ id:'rp-bronquiolite-alta', grupo:'Pediatria', nome:'Bronquiolite — alta', sub:'Só lavagem nasal, dieta fracionada e sinais de alarme',
  tags:['bronquiolite','vsr','sincicial','lactente','chiado','soro nasal'], conduta:'bronquiolite',
  fonte:'AAP — Bronchiolitis (2014); SBP — Diretrizes para o manejo da infecção por VSR (2017); NICE NG9 (2021)',
  atencao:'Sem broncodilatador, corticoide, nebulização com soro, antibiótico ou fisioterapia respiratória — não mudam a evolução. Alta só com saturação acima de 92% em ar ambiente, sem esforço importante, mamando pelo menos metade do habitual e com família capaz de voltar. Maior risco de piora: menor de 3 meses, prematuro, cardiopata, pneumopata, imunodeficiente — liberar com cautela e retorno marcado em 24 h. A piora costuma ser entre o 3º e o 5º dia da doença.',
  itens:[
    { med:'Soro fisiológico 0,9% nasal', uso:'Pingar 1 mL (ou 2 a 5 gotas) em cada narina antes de cada mamada e antes de dormir, e aspirar o nariz em seguida.' },
    { pid:'p-paracetamol', dose:0, uso:'se febre de 37,8 °C ou mais, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'É uma virose: o chiado e a tosse podem durar até 2 a 3 semanas. Os dias 3 a 5 costumam ser os piores.',
    'Limpe o nariz antes de mamar. Ofereça o peito ou a mamadeira em menor quantidade e mais vezes. Mantenha o bebê com a cabeça um pouco elevada, sempre de barriga para cima para dormir.',
    'Não dê xarope, bombinha ou remédio para tosse.',
    'Volte AGORA se: respiração muito rápida, costelas afundando, gemido, pausas na respiração, lábios roxos, mamando menos da metade do normal, menos fraldas molhadas, ou bebê muito mole ou sonolento.',
    'Lave as mãos antes e depois de cuidar do bebê e evite visitas e fumaça de cigarro. Retorno para reavaliar em 24 a 48 h.'
  ] },

{ id:'rp-pac', grupo:'Pediatria', nome:'Pneumonia — tratamento em casa', sub:'Amoxicilina por 5 a 7 dias',
  tags:['pneumonia','pac','broncopneumonia','amoxicilina','tosse','febre'], conduta:'pac-pedia',
  fonte:'SBP — Departamento de Pneumologia; OMS (2014); IDSA/PIDS (2011); estudos SAFER (2022) e CAP-IT (2021)',
  atencao:'Tratar em casa só a partir de 2 meses, com saturação de 92% ou mais, sem tiragem subcostal, aceitando VO e sem derrame. Abaixo de 2 meses: internar. *Divergência:* SBP e OMS usam 50 mg/kg/dia (índice 0); AAP/IDSA preferem 90 mg/kg/dia (índice 1). O CAP-IT mostrou que a dose menor e o curso de 3 a 5 dias não são inferiores. Duração de 5 dias se melhora clara em 48 a 72 h; até 7 dias se resposta lenta. Escolar com quadro atípico (tosse arrastada, febre baixa, bom estado): azitromicina 10 mg/kg/dia por 5 dias (calculadora). Reavaliar em 48 a 72 h.',
  itens:[
    { pid:'p-amoxicilina', dose:0, uso:'por 5 dias (7 dias se a melhora for lenta), mesmo que a criança melhore antes' },
    { pid:'p-paracetamol', dose:0, uso:'se febre ou dor, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'A febre deve baixar em 48 a 72 h. A tosse pode durar 2 a 3 semanas, e isso é esperado.',
    'Ofereça líquidos e alimentos em pequenas porções. Não dê xarope para tosse.',
    'Volte AGORA se: respiração rápida ou cansada, costelas afundando, gemido, lábios roxos, vômitos que impedem o antibiótico, muita sonolência, ou não consegue beber.',
    'Retorno obrigatório em 48 a 72 h para reavaliar, mesmo que esteja melhor.'
  ] },

{ id:'rp-influenza', grupo:'Pediatria', nome:'Influenza — oseltamivir', sub:'Síndrome gripal em criança de risco',
  tags:['influenza','gripe','oseltamivir','tamiflu','sindrome gripal','síndrome gripal','h1n1','h3n2'], conduta:'sindrome-gripal',
  fonte:'MS — Guia de manejo e tratamento de influenza (2023); AAP — Recommendations for prevention and control of influenza (2025-2026)',
  atencao:'Pelo MS, tratar síndrome gripal em grupo de risco, *independente da vacinação e do tempo de doença* (melhor nas primeiras 48 h): menor de 5 anos (risco maior abaixo de 2 anos), doença crônica cardíaca, pulmonar (inclui asma), renal, hepática, neurológica, metabólica ou hematológica, imunossupressão, obesidade, uso crônico de AAS, indígena. Não esperar teste. SRAG (dispneia, saturação abaixo de 95%, tiragem): não é alta. Ajustar a dose na insuficiência renal. Ácido acetilsalicílico nunca (Reye).',
  itens:[
    { pid:'p-oseltamivir', dose:0, uso:'por 5 dias, de preferência junto com alimento', abaixo:{ meses:12, dose:1 } },
    { pid:'p-paracetamol', dose:0, uso:'se febre ou dor, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'Comece o oseltamivir hoje e tome até o fim dos 5 dias. Dar junto com comida diminui o enjoo.',
    'A febre costuma durar 3 a 5 dias e a tosse e o cansaço, até 2 semanas.',
    'A criança deve ficar em casa até 24 h sem febre. Lave as mãos e cubra a tosse com o braço.',
    'Volte AGORA se: falta de ar, respiração rápida, lábios roxos, muita sonolência, confusão, convulsão, não consegue beber, pouco xixi, ou se melhorar e depois voltar a piorar com febre.',
    'Vacine a criança e a família contra a gripe todo ano.'
  ] },

{ id:'rp-gastroenterite', grupo:'Pediatria', nome:'Diarreia aguda — plano A', sub:'Soro de reidratação + zinco + ondansetrona se vômito',
  tags:['diarreia','gastroenterite','vomito','vômito','desidratacao','plano a','sro','soro caseiro','zinco','ondansetrona'], conduta:'gastroenterite-pedia',
  fonte:'MS — Manejo do paciente com diarreia (cartaz, 2023); OMS; ESPGHAN (2014)',
  atencao:'Plano A = criança SEM desidratação. Zinco: 20 mg/dia a partir de 6 meses (índice 1, usado aqui); *abaixo de 6 meses troque para o índice 0 (10 mg/dia)*. Ondansetrona só a partir de 6 meses, em dose única ou curso curto, e evitar em cardiopata ou com outra droga que alargue o QT. Não prescrever loperamida (contraindicada abaixo de 6 anos), metoclopramida em menor de 1 ano, nem antibiótico na diarreia aquosa. Diarreia com sangue e febre alta ou toxemia: ver conduta.',
  itens:[
    { pid:'p-sro', dose:0, uso:'após cada evacuação líquida ou vômito, em goles pequenos, enquanto durar a diarreia' },
    { pid:'p-zinco', dose:1, uso:'completar 10 dias, mesmo que a diarreia pare antes', abaixo:{ meses:6, dose:0 } },
    { med:'Ondansetrona 4 mg comprimido orodispersível', uso:'SOMENTE se vomitar (a partir de 6 meses): menos de 15 kg, meio comprimido (2 mg); 15 kg ou mais, 1 comprimido (4 mg). Dissolver na boca, de 8/8 h, no máximo 3 doses, por até 2 dias.' }
  ],
  orientacoes:[
    'Prepare o soro de reidratação com 1 envelope em 1 litro de água filtrada ou fervida (já fria). Depois de pronto, vale por 24 h.',
    'Continue o peito e a alimentação de sempre, em porções menores. Não use refrigerante, chá, suco de caixinha nem isotônico no lugar do soro.',
    'Se vomitar, espere 10 minutos e volte a oferecer o soro de colher em colher.',
    'Volte AGORA se: não consegue beber ou vomita tudo, muita sede, olhos fundos, boca seca, pouco ou nenhum xixi em 6 a 8 h, sangue nas fezes, febre alta, muita sonolência ou irritação.',
    'Lave bem as mãos depois de trocar fraldas e antes de preparar comida. Volte se a diarreia passar de 7 dias.'
  ] },

{ id:'rp-constipacao', grupo:'Pediatria', nome:'Constipação intestinal funcional', sub:'Polietilenoglicol por peso + rotina',
  tags:['constipacao','constipação','prisao de ventre','intestino preso','peg','polietilenoglicol','muvinlax','fecaloma'], conduta:'lactente-gastro',
  fonte:'ESPGHAN/NASPGHAN — Functional constipation (2014); Critérios de Roma IV (2016)',
  atencao:'PEG é a primeira escolha a partir de 6 meses; abaixo disso use lactulose (calculadora pl-lactulose). Se há fecaloma palpável ou escape fecal, faça antes a desimpactação (PEG 1 a 1,5 g/kg/dia por 3 a 6 dias) e só depois a manutenção. Sinais de causa orgânica — não é esta receita: mecônio depois de 48 h de vida, início no 1º mês, distensão com vômitos, sangue sem fissura, baixo ganho de peso, alteração neurológica de membros inferiores, tufo de pelos ou fosseta na região sacral. Óleo mineral nunca abaixo de 1 ano nem em criança com risco de aspiração.',
  itens:[
    { pid:'p-peg', dose:1, uso:'todos os dias, dissolvido em água ou suco, por no mínimo 2 meses — ajustar até fezes pastosas todos os dias' }
  ],
  orientacoes:[
    'O tratamento é longo: o intestino precisa de pelo menos 2 meses evacuando fezes moles, sem dor, para "esquecer" o medo de evacuar. Não pare quando melhorar.',
    'Se as fezes ficarem muito líquidas, diminua um pouco a dose; se continuarem duras, aumente um pouco.',
    'Sente a criança no vaso por 5 a 10 minutos depois das refeições, com os pés apoiados num banquinho. Elogie as tentativas, não castigue os escapes.',
    'Ofereça água, frutas, verduras, feijão e alimentos integrais. Diminua leite em excesso e farinhas.',
    'Volte se: barriga muito inchada, vômitos, sangue nas fezes que não seja um fio na fissura, febre, ou perda de peso. Seguimento com o pediatra em 2 a 4 semanas.'
  ] },

{ id:'rp-colica-lactente', grupo:'Pediatria', nome:'Cólica do lactente', sub:'Orientação acima de tudo — remédio é opcional',
  tags:['colica','cólica','choro','lactente','bebe chorando','simeticona','gases','regra dos 3'], conduta:'lactente-gastro',
  fonte:'Critérios de Roma IV (2016); SBP — Departamento de Gastroenterologia; NICE CKS (2023)',
  atencao:'Diagnóstico só depois de excluir causa orgânica: febre, vômitos (sobretudo biliosos), recusa alimentar, baixo ganho de peso, choro agudo diferente do habitual, distensão, sangue nas fezes, abaulamento de fontanela, início depois de 4 meses. Examine todo o bebê despido: hérnia encarcerada, torção testicular, fio de cabelo garroteando dedo, fratura ou sinais de maus-tratos. Simeticona: evidência de benefício fraca, opcional. *Divergência:* o Lactobacillus reuteri DSM 17938 tem algum benefício no bebê em aleitamento exclusivo; sem evidência no que toma fórmula. Não usar escopolamina, chás nem mel.',
  itens:[
    { pid:'p-simeticona', dose:0, uso:'só se cólica — benefício pequeno, pode parar se não ajudar' }
  ],
  orientacoes:[
    'A cólica é comum e não é doença: começa por volta de 2 a 3 semanas, piora entre 6 e 8 semanas e costuma passar até os 3 a 4 meses. O bebê cresce normalmente.',
    'Para acalmar: colo, embalar, contato pele a pele, barulho branco ou "shhh" constante, ambiente com pouca luz, banho morno. Faça o bebê arrotar nas mamadas.',
    'Se você se sentir no limite, coloque o bebê no berço, em segurança, e saia do quarto por alguns minutos. NUNCA sacuda o bebê.',
    'Não ofereça chá, mel, água com açúcar nem remédios sem orientação. Mantenha o aleitamento materno.',
    'Volte AGORA se: febre, vômitos verdes ou em jato, sangue nas fezes, barriga inchada e dura, choro muito forte e diferente do habitual, bebê mole ou sonolento, ou recusa para mamar.'
  ] },

{ id:'rp-moniliase-oral', grupo:'Pediatria', nome:'Monilíase oral (sapinho)', sub:'Nistatina oral + cuidado com bicos e mamilo',
  tags:['moniliase','monilíase','sapinho','candidiase oral','candida','nistatina','placas brancas','lactente'],
  fonte:'IDSA — Candidíase (2016); SBP',
  atencao:'Placas brancas que NÃO saem ao raspar com gaze (diferente de resto de leite). Em aleitamento, trate também o mamilo da mãe se houver dor ou fissura (nistatina ou miconazol creme após as mamadas), senão a infecção volta. Gel oral de miconazol é alternativa, mas evite abaixo de 4 a 6 meses (risco de engasgo) e lembre da interação com varfarina. Monilíase fora do período de lactente, recorrente ou extensa sem causa (antibiótico, corticoide inalatório): investigar imunodeficiência, inclusive HIV.',
  itens:[
    { pid:'p-nistatina-oral', dose:0, uso:'metade de cada lado da boca, depois das mamadas, por 7 a 14 dias e até 2 dias depois de sumirem as placas' }
  ],
  orientacoes:[
    'Aplique o remédio com conta-gotas ou seringa dentro das bochechas, depois de mamar, e evite dar líquido logo em seguida.',
    'Ferva bicos de mamadeira, chupetas e brinquedos de morder por 5 minutos todos os dias durante o tratamento.',
    'Se a mãe amamenta e tem dor ou vermelhidão no bico do peito, ela também precisa tratar.',
    'Volte se: o bebê parar de mamar, ficar com pouco xixi, as placas aumentarem ou não melhorarem em 1 semana.'
  ] },

{ id:'rp-itu', grupo:'Pediatria', nome:'Infecção urinária — tratamento oral', sub:'Cefuroxima ou cefalexina por 7 a 10 dias',
  tags:['itu','infeccao urinaria','infecção urinária','pielonefrite','cistite','cefalexina','cefuroxima','urocultura'], conduta:'itu-pedia',
  fonte:'AAP — UTI em 2 a 24 meses (2011, reafirmado 2016); SBP — Departamento de Nefrologia, ITU (2021); NICE NG224 (2022)',
  atencao:'Usar UMA das opções — apague a outra no rascunho. ITU febril (pielonefrite): cefuroxima, 10 dias. Cistite sem febre na criança maior: cefalexina, 5 a 7 dias. Colher urocultura ANTES da 1ª dose (sondagem ou jato médio; saco coletor só vale se negativo). Não é alta: menor de 2 a 3 meses, toxemia, vômitos que impedem VO, desidratação, uropatia conhecida ou família sem retorno — iniciar parenteral. Ajustar pelo antibiograma. Primeira ITU febril abaixo de 2 anos: ultrassom de rins e vias urinárias.',
  itens:[
    { pid:'p-cefuroxima', dose:0, uso:'por 10 dias (ITU com febre)' },
    { pid:'p-cefalexina', dose:0, uso:'por 7 dias (ALTERNATIVA na cistite sem febre — usar só um dos dois)' },
    { pid:'p-paracetamol', dose:0, uso:'se febre ou dor, no máximo 4 doses em 24 h' }
  ],
  orientacoes:[
    'A febre deve baixar em 48 a 72 h. Termine o antibiótico até o último dia.',
    'Ofereça bastante água. Não segure o xixi; ajude a criança a ir ao banheiro a cada 3 h.',
    'Trate a prisão de ventre, se houver: ela favorece nova infecção. Na higiene das meninas, limpe de frente para trás.',
    'Volte AGORA se: vômitos que impedem o remédio, febre que continua depois de 48 h, criança muito mole, pouco xixi, ou dor forte nas costas.',
    'Retorno em 48 a 72 h com o resultado da urocultura para conferir o antibiótico. Toda nova febre sem causa: fazer exame de urina.'
  ] },

{ id:'rp-urticaria', grupo:'Pediatria', nome:'Urticária aguda', sub:'Anti-histamínico não sedante — sem anafilaxia',
  tags:['urticaria','urticária','alergia','placas','coceira','prurido','cetirizina','loratadina','anti-histaminico'], conduta:'anafilaxia-pedia',
  fonte:'EAACI/GA2LEN/WAO — Urticária (2022); ASBAI',
  atencao:'Antes da alta, exclua anafilaxia: falta de ar, chiado, rouquidão ou estridor, inchaço de língua ou garganta, vômitos repetidos, hipotensão ou desmaio = adrenalina IM, não esta receita. Cetirizina e loratadina: bula brasileira a partir de 2 anos (*Divergência:* FDA aprova cetirizina a partir de 6 meses). Opção à cetirizina: loratadina (calculadora, por faixa de peso). Corticoide oral só se quadro extenso ou angioedema, por 3 a 5 dias. Na criança pequena, a causa mais comum é infecção viral, não alimento.',
  itens:[
    { pid:'p-cetirizina', dose:0, uso:'por 7 dias, e manter até 3 dias depois de sumirem as manchas', abaixo:{ meses:24, pid:'p-hidroxizina', dose:0, uso:'se coceira, por até 7 dias (abaixo de 2 anos a cetirizina não tem bula; a hidroxizina vale a partir de 6 meses)' } }
  ],
  orientacoes:[
    'As manchas que coçam aparecem e somem em horas e podem voltar por alguns dias. Isso é esperado.',
    'Na maioria das vezes a causa é uma virose. Se houver suspeita de alimento ou remédio, evite até a consulta com o pediatra.',
    'Roupas leves, banho morno (não quente) e compressa fria aliviam a coceira.',
    'Volte AGORA se: inchaço na boca, língua ou garganta, falta de ar, chiado, rouquidão, vômitos, tontura ou desmaio.',
    'Volte se as manchas durarem mais de 6 semanas, deixarem marcas roxas ou vierem com febre e dor nas juntas.'
  ] },

{ id:'rp-impetigo', grupo:'Pediatria', nome:'Impetigo', sub:'Mupirocina tópica — cefalexina se extenso',
  tags:['impetigo','crostas','pele','piodermite','mupirocina','bactroban','cefalexina','estafilococo'], conduta:'abscesso-pele',
  fonte:'IDSA — Infecções de pele e partes moles (2014); SBD; AAP Red Book (2024)',
  atencao:'Lesões poucas e localizadas: só pomada (apague a cefalexina). Lesões numerosas, extensas, bolhosas grandes, surtos na família ou falha da pomada: cefalexina por 7 dias. Febre, celulite ao redor, linfangite ou criança abaixo de 2 meses: ver conduta. Edema, urina escura ou pressão alta nas semanas seguintes: glomerulonefrite pós-estreptocócica.',
  itens:[
    { med:'Mupirocina 2% pomada', uso:'Lavar as lesões com água e sabão, remover as crostas com delicadeza e aplicar uma camada fina 3 vezes ao dia por 5 dias.' },
    { pid:'p-cefalexina', dose:0, uso:'por 7 dias — SOMENTE se lesões extensas ou numerosas' }
  ],
  orientacoes:[
    'O impetigo passa de uma pessoa para outra pelo contato. Cada pessoa da casa deve usar a própria toalha.',
    'Corte as unhas da criança curtas e lave as mãos depois de tocar as lesões.',
    'A criança pode voltar à escola ou à creche 24 h depois de iniciar o tratamento, com as lesões cobertas.',
    'Volte se: febre, vermelhidão que se espalha, dor forte, lesões que não melhoram em 3 dias, urina escura ou inchaço no rosto nas próximas semanas.'
  ] },

{ id:'rp-escabiose', grupo:'Pediatria', nome:'Escabiose (sarna)', sub:'Permetrina 5% + tratar todos da casa',
  tags:['escabiose','sarna','coceira noturna','prurido','permetrina','ivermectina','acaro'],
  fonte:'MS — Guia de Vigilância em Saúde; AAP Red Book (2024); CDC — Scabies (2024)',
  atencao:'Permetrina 5% a partir de 2 meses. Abaixo de 2 meses: enxofre precipitado 5 a 10% em vaselina por 3 noites (prescrever em farmácia de manipulação). Ivermectina só a partir de 15 kg e fora da gestação e amamentação — opção quando a loção falha ou é inviável, ou associada na sarna crostosa (apague se não usar). Tratar TODOS os contatos da casa no mesmo dia, mesmo sem coceira. A coceira pode durar 2 a 4 semanas depois da cura: não é falha. Lesões com pus ou crostas melicéricas: tratar a infecção secundária.',
  itens:[
    { med:'Permetrina 5% loção', uso:'À noite, depois do banho, aplicar no corpo todo do pescoço para baixo (no bebê, também no couro cabeludo, rosto e atrás das orelhas, poupando olhos e boca). Insistir entre os dedos, unhas, axilas e genitais. Deixar 8 a 12 h e retirar no banho da manhã. Repetir após 7 dias.' },
    { pid:'p-ivermectina', dose:0, uso:'em jejum, hoje e repetir a mesma dose em 7 dias — somente a partir de 15 kg' }
  ],
  orientacoes:[
    'Todas as pessoas da casa precisam tratar no mesmo dia, mesmo quem não tem coceira.',
    'No dia seguinte ao tratamento, lave roupas, toalhas e lençóis em água quente ou passe a ferro. O que não puder ser lavado, guarde em saco plástico fechado por 3 dias.',
    'Corte as unhas curtas. A coceira pode continuar por algumas semanas mesmo com a sarna curada.',
    'A criança pode voltar à escola no dia seguinte ao tratamento.',
    'Volte se aparecerem bolinhas com pus, febre, ou se surgirem lesões novas depois de 2 semanas.'
  ] },

{ id:'rp-pediculose', grupo:'Pediatria', nome:'Pediculose (piolho)', sub:'Permetrina 1% + pente fino',
  tags:['pediculose','piolho','lendea','lêndea','coceira na cabeca','permetrina','pente fino'],
  fonte:'AAP — Head lice (2022); CDC (2024)',
  atencao:'Permetrina 1% a partir de 2 meses; abaixo disso, só pente fino. Não usar querosene, inseticida, vinagre puro ou produtos veterinários. Falha depois de 2 aplicações bem feitas: ivermectina VO 200 mcg/kg em 2 doses com 7 a 10 dias de intervalo, só a partir de 15 kg (calculadora p-ivermectina). Tratar apenas os contatos com piolho vivo. Não há motivo para afastar da escola.',
  itens:[
    { med:'Permetrina 1% loção capilar', uso:'Lavar o cabelo com xampu comum sem condicionador, secar com toalha, aplicar até encharcar o couro cabeludo e os fios, deixar 10 minutos e enxaguar. Repetir após 7 a 10 dias.' },
    { med:'Pente fino', uso:'Passar mecha por mecha no cabelo úmido com condicionador, todos os dias por 2 semanas, limpando o pente a cada passada.' }
  ],
  orientacoes:[
    'O pente fino é parte do tratamento: tira as lêndeas que o remédio não mata.',
    'Examine o cabelo de todos da casa e trate só quem tiver piolho vivo.',
    'Lave em água quente pentes, escovas, toucas e fronhas usados nos últimos 2 dias.',
    'Não divida pente, boné ou travesseiro. A criança pode continuar indo à escola.',
    'Volte se houver feridas com pus no couro cabeludo, ínguas no pescoço ou se o piolho continuar depois da 2ª aplicação.'
  ] },

{ id:'rp-dermatite-fraldas', grupo:'Pediatria', nome:'Dermatite da área das fraldas', sub:'Barreira com óxido de zinco — antifúngico se cândida',
  tags:['dermatite','fralda','assadura','candida','monilíase','oxido de zinco','óxido de zinco','miconazol','nistatina'],
  fonte:'SBP — Departamento de Dermatologia; SBD',
  atencao:'Dermatite irritativa poupa as dobras; cândida pega as dobras, é vermelho-vivo e tem pontinhos satélites — só aí use antifúngico (apague se não usar). NÃO usar corticoide potente nem cremes com corticoide associado na área da fralda (atrofia, absorção). Hidrocortisona 1% por no máximo 3 a 5 dias só se muito inflamado. Pústulas, crostas amareladas ou bolhas: impetigo. Sem melhora em 1 a 2 semanas: pensar em dermatite seborreica, psoríase, acrodermatite enteropática ou histiocitose.',
  itens:[
    { med:'Pasta com óxido de zinco (creme barreira)', uso:'Aplicar camada grossa a cada troca de fralda, sem esfregar para retirar a anterior — limpar só a sujeira.' },
    { med:'Miconazol 2% creme', uso:'SOMENTE se cândida: aplicar uma camada fina 2 vezes ao dia antes do creme barreira, por 7 a 14 dias e até 3 dias após melhorar.' }
  ],
  orientacoes:[
    'Troque a fralda com frequência, assim que estiver molhada ou suja.',
    'Limpe com água morna e algodão ou pano macio. Evite lenço umedecido com perfume ou álcool.',
    'Deixe o bumbum sem fralda alguns minutos por dia para secar ao ar. Não use talco nem amido.',
    'Volte se: bolhas, feridas com pus, febre, ou se não melhorar em 1 semana.'
  ] },

{ id:'rp-varicela', grupo:'Pediatria', nome:'Varicela (catapora)', sub:'Sintomáticos — aciclovir só se indicado',
  tags:['varicela','catapora','vesiculas','vesículas','coceira','aciclovir','hidroxizina'], conduta:'exantematicas',
  fonte:'MS — Guia de Vigilância em Saúde (varicela); AAP Red Book (2024)',
  atencao:'NUNCA ácido acetilsalicílico (síndrome de Reye) nem ibuprofeno ou outro anti-inflamatório (associação com fasciite necrotizante e infecção estreptocócica invasiva). Aciclovir VO por 5 dias, iniciado em até 24 h do exantema, SOMENTE se: 12 anos ou mais, doença crônica de pele ou pulmão, uso de corticoide ou de salicilato crônico, ou caso secundário domiciliar (apague se não indicado). Imunossuprimido, gestante ou recém-nascido: aciclovir EV e internação — não é alta. Comunicantes suscetíveis: vacina até 5 dias após a exposição; imunoglobulina nos de risco até 96 h. Doença de notificação em surto.',
  itens:[
    { pid:'p-paracetamol', dose:0, uso:'se febre ou dor, no máximo 4 doses em 24 h' },
    { pid:'p-hidroxizina', dose:0, uso:'se coceira, por até 5 dias' },
    { pid:'p-aciclovir', dose:0, uso:'por 5 dias — SOMENTE nas indicações do quadro de atenção' }
  ],
  orientacoes:[
    'Não dê AAS (aspirina) nem ibuprofeno. Para febre, só o remédio da receita.',
    'Corte as unhas curtas e evite coçar. Banho com água e sabão comum, secando sem esfregar. Compressa fria alivia a coceira.',
    'A criança fica em casa, sem escola, até TODAS as bolinhas virarem casquinha (cerca de 7 dias). Afaste de gestantes, bebês e pessoas com imunidade baixa.',
    'Volte AGORA se: bolinha com vermelhidão que se espalha, dor forte ou inchaço na pele, febre que volta depois de melhorar, falta de ar, sonolência, andar cambaleando, convulsão, lesões roxas ou com sangue, ou vômitos sem parar.',
    'Confira a vacina das outras crianças e dos adultos da casa que nunca tiveram catapora.'
  ] },

{ id:'rp-conjuntivite', grupo:'Pediatria', nome:'Conjuntivite bacteriana', sub:'Colírio de tobramicina + limpeza',
  tags:['conjuntivite','olho vermelho','secrecao ocular','secreção ocular','remela','olho grudado','tobramicina','colirio','colírio'], conduta:'olho-vermelho',
  fonte:'AAO — Conjunctivitis Preferred Practice Pattern (2023); AAP Red Book (2024)',
  atencao:'Bacteriana = secreção purulenta espessa e olho grudado ao acordar; a viral (secreção aquosa, gânglio pré-auricular) e a alérgica (coceira, bilateral) não precisam de antibiótico. NÃO é receita de alta: recém-nascido até 28 dias (oftalmia neonatal — gonococo e clamídia), dor ocular importante, fotofobia, baixa de visão, pálpebra inchada e vermelha (celulite periorbitária), usuário de lente de contato. Otite junto com conjuntivite: Haemophilus — trocar o colírio por amoxicilina-clavulanato oral. Nunca colírio com corticoide sem avaliação do oftalmologista.',
  itens:[
    { med:'Soro fisiológico 0,9%', uso:'Limpar os olhos com gaze ou algodão molhado em soro, do canto de dentro para fora, uma gaze para cada olho, antes de cada gota do colírio.' },
    { med:'Tobramicina 0,3% colírio', uso:'Pingar 1 gota no olho afetado de 6/6 h por 7 dias. Se o outro olho ficar vermelho, tratar os dois.' }
  ],
  orientacoes:[
    'Lave as mãos antes e depois de pingar o colírio. Não encoste o bico do frasco no olho.',
    'Toalha, fronha e travesseiro separados. A criança pode voltar à escola 24 h após iniciar o colírio.',
    'A melhora vem em 2 a 3 dias. Use o colírio até o fim dos 7 dias.',
    'Volte AGORA se: dor forte no olho, não consegue abrir o olho por causa da luz, visão embaçada, pálpebra muito inchada e vermelha, ou febre.',
    'Volte se não melhorar em 3 dias.'
  ] },

{ id:'rp-parasitoses', grupo:'Pediatria', nome:'Verminose intestinal', sub:'Albendazol dose única — mebendazol como alternativa',
  tags:['verme','verminose','parasitose','lombriga','ascaris','oxiurus','oxiúros','albendazol','mebendazol','giardia'],
  fonte:'MS — Guia prático para o controle das geo-helmintíases (2018); OMS — Preventive chemotherapy (2017)',
  atencao:'Usar UM dos dois (apague o outro). A planilha original evitava abaixo de 2 anos, mas a OMS e o MS aceitam albendazol 200 mg (5 mL) dose única a partir de 1 ano. Oxiúros (coceira anal noturna): repetir a dose em 2 semanas e tratar todos da casa. Giardíase: albendazol por 5 dias (calculadora pl-albendazol índice 1), metronidazol ou nitazoxanida. Tricuríase intensa: 3 dias. Dor abdominal forte com vômitos e parada de eliminação de fezes: suboclusão por áscaris — não é alta.',
  itens:[
    { pid:'pl-albendazol', dose:0, uso:'em jejum ou longe das refeições; se oxiúros, repetir em 2 semanas' },
    { pid:'pl-mebendazol', dose:0, uso:'(ALTERNATIVA ao albendazol — usar só um dos dois)' }
  ],
  orientacoes:[
    'Lave as mãos antes de comer e depois de usar o banheiro. Mantenha as unhas curtas.',
    'Lave bem frutas e verduras e beba água filtrada ou fervida. Ande de calçado no quintal e na terra.',
    'Se for oxiúros (coceira no bumbum à noite), troque e lave roupas de cama e de dormir no dia do remédio e trate toda a família.',
    'Volte se: dor de barriga forte, vômitos, barriga inchada, parar de evacuar, ou sangue nas fezes.'
  ] }
];
