import './style.css';

const phases = [
  { title:'Memória da diversidade', short:'Encontre os pares', icon:'🧠', color:'#eeeaff', description:'Olhe com atenção e encontre imagens iguais.' },
  { title:'Cada imagem, uma história', short:'Ligue as figuras', icon:'🧩', color:'#e7fbf5', description:'Descubra o que combina com cada imagem.' },
  { title:'Palavras que acolhem', short:'Complete as palavras', icon:'🔤', color:'#fff4d9', description:'Use as letras para formar palavras.' },
  { title:'Atitudes de respeito', short:'Escolha com carinho', icon:'💜', color:'#ffedf4', description:'Pense em atitudes que fazem bem.' },
  { title:'Desafio dos guardiões', short:'Quiz ilustrado', icon:'🏆', color:'#e9f5ff', description:'Mostre o que você aprendeu!' }
];

const memoryRounds = [
  [['🥁','Tambor'],['🎨','Arte'],['🪇','Música']],
  [['🪘','Atabaque'],['🧵','Tecidos'],['🩰','Dança']],
  [['🥁','Ritmo'],['🎭','Máscara artística'],['🖼️','Pintura']],
  [['🪇','Instrumento'],['🧶','Artesanato'],['🎶','Canção']],
  [['🤝','Amizade'],['🌍','Diversidade'],['❤️','Respeito']]
];
const matchRounds = [
  [['🥋','Capoeira'],['🥁','Tambor'],['🎨','Arte']],
  [['🤝','Amizade'],['❤️','Respeito'],['🌈','Diversidade']],
  [['🎶','Música'],['💃','Dança'],['📚','História']],
  [['🧵','Tecido'],['🖼️','Pintura'],['🪇','Ritmo']],
  [['👧🏿','Crianças'],['🏡','Comunidade'],['🌍','Culturas']]
];
const wordRounds = [
  {emoji:'❤️', clue:'Uma palavra que demonstra carinho.', word:'AMOR'},
  {emoji:'🤝', clue:'Quando ajudamos e brincamos juntos, temos...', word:'AMIZADE'},
  {emoji:'🌈', clue:'Devemos respeitar a...', word:'DIVERSIDADE'},
  {emoji:'🎨', clue:'Pintura, música e dança fazem parte da...', word:'ARTE'},
  {emoji:'💜', clue:'Tratar todas as pessoas bem é ter...', word:'RESPEITO'}
];
const respectRounds = [
  {q:'Uma criança nova chegou à turma. O que fazer?',opts:[['👋','Convidar para brincar'],['🚫','Não deixar participar']],a:0,why:'Convidar para brincar ajuda todos a se sentirem acolhidos.'},
  {q:'Um colega tem cabelo diferente do seu. Como agir?',opts:[['😂','Fazer piada'],['💛','Respeitar e elogiar com carinho']],a:1,why:'O cabelo e as características de cada pessoa merecem respeito.'},
  {q:'Você ouviu uma fala preconceituosa. O que fazer?',opts:[['🗣️','Dizer que isso não é legal e pedir ajuda'],['🙈','Achar engraçado e repetir']],a:0,why:'Não devemos aceitar preconceito. Podemos conversar e procurar um adulto de confiança.'},
  {q:'Na brincadeira, alguém ficou de fora. O que fazer?',opts:[['🤝','Chamar para participar'],['🚶','Continuar sem convidar']],a:0,why:'Incluir os colegas torna a brincadeira mais justa e divertida.'},
  {q:'As pessoas têm histórias e culturas diferentes. O que devemos fazer?',opts:[['💜','Valorizar e respeitar'],['❌','Dizer que só uma cultura importa']],a:0,why:'Todas as pessoas e culturas merecem respeito.'}
];
const quizRounds = [
  {q:'Qual data marca o Dia da Consciência Negra no Brasil?',opts:[['📅','20 de novembro'],['🎄','25 de dezembro'],['🎆','1º de janeiro']],a:0,why:'O Dia da Consciência Negra é celebrado em 20 de novembro.'},
  {q:'Qual destas expressões culturais é afro-brasileira?',opts:[['🥋','Capoeira'],['⛷️','Esqui na neve'],['🏒','Hóquei no gelo']],a:0,why:'A capoeira é uma expressão cultural afro-brasileira que reúne luta, dança, música e jogo.'},
  {q:'Quem foi Zumbi dos Palmares?',opts:[['👑','Uma liderança do Quilombo dos Palmares'],['🚀','Um astronauta'],['🎾','Um atleta de tênis']],a:0,why:'Zumbi foi uma importante liderança do Quilombo dos Palmares.'},
  {q:'O que devemos fazer com as diferenças?',opts:[['💜','Respeitar e valorizar'],['🙅','Usar para excluir alguém'],['😆','Fazer piadas']],a:0,why:'As diferenças fazem parte da vida e devem ser respeitadas.'},
  {q:'A cultura afro-brasileira aparece em...',opts:[['🎶','Música, dança, arte, culinária e muito mais'],['📘','Somente nos livros'],['🏫','Somente na escola']],a:0,why:'A cultura afro-brasileira está presente em muitas partes do nosso cotidiano.'}
];

const app = document.querySelector('#app');
const main = document.querySelector('#main');
const modalRoot = document.querySelector('#modalRoot');
let soundOn = true;
let audioCtx = null;
let currentPhase = 0;
let challenge = 0;
let score = 0;
let phaseScores = [0,0,0,0,0];
let completed = [false,false,false,false,false];
let selected = [];
let matched = [];
let flipped = [];
let letterAnswer = [];
let locked = false;

const $ = (sel, root=document) => root.querySelector(sel);
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function playTone(freq=560,duration=.11,type='sine'){
  if(!soundOn) return;
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type=type; osc.frequency.value=freq; gain.gain.setValueAtTime(.08,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);
    osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration);
  }catch(e){}
}
function speak(text){
  if(!soundOn || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang='pt-BR';utterance.rate=.92;utterance.pitch=1.08;
  window.speechSynthesis.speak(utterance);
}
function success(){playTone(660,.12);setTimeout(()=>playTone(880,.18),100)}
function error(){playTone(210,.18,'triangle')}
function updateSoundButton(){
  const b=$('#soundToggle');
  if(b){b.textContent=soundOn?'🔊 Sons ligados':'🔇 Sons desligados';b.setAttribute('aria-pressed',String(soundOn))}
}
function showModal(title,body,buttons){
  modalRoot.innerHTML=`<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><h2 id="modalTitle">${title}</h2>${body}<div class="modal-actions">${buttons}</div></section></div>`;
  $('.modal-backdrop',modalRoot).addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))modalRoot.innerHTML=''});
  $('#modalClose',modalRoot)?.addEventListener('click',()=>modalRoot.innerHTML='');
  $('#modalGo',modalRoot)?.addEventListener('click',()=>{modalRoot.innerHTML='';speak('Vamos começar!')});
}
function renderHome(){
  app.innerHTML=`
    <header class="topbar"><a class="brand" href="#"><span class="brand-mark">🌈</span><span>Pequenos <b>Guardiões</b></span></a><div class="top-actions"><button class="sound-toggle" id="soundToggle" type="button"></button></div></header>
    <main id="main" class="main-shell">
      <section class="hero"><div class="hero-copy"><span class="eyebrow">UMA AVENTURA DE RESPEITO E AMIZADE</span><h1>Pequenos Guardiões <span>do Respeito!</span></h1><p>Vamos aprender que cada pessoa é especial e que nossas diferenças merecem respeito.</p><div class="hero-buttons"><button class="primary-btn" id="startBtn">Começar aventura <span>→</span></button><button class="soft-btn" id="howBtn">Como jogar?</button></div></div><div class="hero-art"><div class="sun"></div><div class="cloud cloud-one"></div><div class="cloud cloud-two"></div><div class="rainbow">🌈</div><div class="kids"><span class="kid kid-one">👧🏽</span><span class="kid kid-two">👦🏿</span><span class="kid kid-three">👧🏻</span></div><div class="sparkle sparkle-one">✦</div><div class="sparkle sparkle-two">✧</div><div class="art-caption">Juntos somos melhores! 💜</div></div></section>
      <section class="welcome-strip"><div class="strip-icon">⭐</div><div><b>Uma missão muito importante!</b><span>Conhecer, brincar, aprender e tratar todas as pessoas com carinho e respeito.</span></div></section>
      <section class="map-section" id="mapSection"><div class="section-heading"><div><span class="eyebrow">SEU CAMINHO</span><h2>Mapa da aventura</h2></div><div class="progress-mini"><span id="progressText"></span><div class="progress-track"><i id="progressBar"></i></div></div></div><div class="phase-grid" id="phaseGrid"></div></section>
      <section class="teacher-note"><span>🍎</span><div><b>Uma dica para quem está ensinando</b><p>Leia as instruções com a turma, incentive a conversa e ajude as crianças quando necessário. O objetivo é aprender juntos!</p></div></section>
    </main><footer>Feito para aprender brincando • 1º ano do Ensino Fundamental</footer>`;
  $('#startBtn').addEventListener('click',()=>{const idx=completed.findIndex(v=>!v);startPhase(idx<0?4:idx)});
  $('#howBtn').addEventListener('click',()=>showModal('Como jogar?','<p>🌟 Complete os cinco desafios de cada fase.<br>🔓 As fases são liberadas em sequência.<br>🔊 Use o botão de som para ouvir as instruções.<br>💜 Leia, observe e escolha com atenção. Se precisar, peça ajuda ao professor!</p>','<button class="primary-btn" id="modalClose">Entendi!</button>'));
  $('#soundToggle').addEventListener('click',toggleSound);
  updateSoundButton();renderPhaseCards();
}
function renderPhaseCards(){
  const grid=$('#phaseGrid');if(!grid)return;
  grid.innerHTML=phases.map((p,i)=>{
    const unlocked=i===0||completed[i-1],done=completed[i];
    return `<button class="phase-card ${unlocked?'available':'locked'}" data-phase="${i}" ${unlocked?'':'disabled'} style="background:linear-gradient(160deg,#fff 40%,${p.color})"><span class="phase-status">${done?'⭐':unlocked?'▶️':'🔒'}</span><span class="phase-icon">${p.icon}</span><div class="phase-number">FASE ${i+1}</div><h3>${p.title}</h3><p>${done?'Concluída':p.short}</p></button>`;
  }).join('');
  grid.querySelectorAll('[data-phase]').forEach(b=>b.addEventListener('click',()=>startPhase(Number(b.dataset.phase))));
  const count=completed.filter(Boolean).length;
  $('#progressText').textContent=`${count} de 5 fases`;
  $('#progressBar').style.width=`${count*20}%`;
}
function toggleSound(){soundOn=!soundOn;updateSoundButton();if(!soundOn&&'speechSynthesis'in window)window.speechSynthesis.cancel()}
function startPhase(index){
  if(index>0&&!completed[index-1])return;
  currentPhase=index;challenge=0;score=0;selected=[];matched=[];flipped=[];letterAnswer=[];renderGame();
  speak(`Fase ${index+1}. ${phases[index].title}. ${phases[index].description}`);
}
function phaseInstruction(){
  const intros=[
    'Encontre os pares iguais. Toque em duas cartas para descobrir as figuras.',
    'Escolha uma imagem e depois escolha o nome que combina com ela.',
    'Observe a figura e complete a palavra usando as letras disponíveis.',
    'Leia a situação e escolha a atitude que demonstra respeito.',
    'Responda às perguntas e mostre o que aprendeu nesta aventura.'
  ];
  return intros[currentPhase];
}
function renderGame(){
  const p=phases[currentPhase];
  app.innerHTML=`<header class="topbar"><a class="brand" href="#" id="homeLink"><span class="brand-mark">🌈</span><span>Pequenos <b>Guardiões</b></span></a><button class="sound-toggle" id="soundToggle"></button></header><main class="game-shell"><div class="game-top"><button class="back-btn" id="backBtn">← Mapa</button><div class="game-meta"><span>⭐ ${score} pontos</span><span>Fase ${currentPhase+1}/5</span></div></div><div class="game-progress"><i id="gameProgress"></i></div><section class="game-panel" id="gamePanel"></section></main><footer>Aprender com respeito faz o mundo melhor! 💜</footer>`;
  $('#homeLink').addEventListener('click',e=>{e.preventDefault();renderHome()});
  $('#backBtn').addEventListener('click',renderHome);
  $('#soundToggle').addEventListener('click',toggleSound);updateSoundButton();
  renderChallenge();
}
function updateGameProgress(){
  const el=$('#gameProgress');if(el)el.style.width=`${challenge/5*100}%`;
  const meta=$('.game-meta');if(meta)meta.innerHTML=`<span>⭐ ${score} pontos</span><span>Desafio ${challenge+1}/5</span>`;
}
function renderChallenge(){
  selected=[];matched=[];flipped=[];letterAnswer=[];locked=false;
  updateGameProgress();
  const panel=$('#gamePanel');
  panel.innerHTML=`<div class="game-title"><div class="big-icon">${phases[currentPhase].icon}</div><div class="challenge-count">DESAFIO ${challenge+1} DE 5</div><h2>${phases[currentPhase].title}</h2><p>${phaseInstruction()}</p></div><div id="challengeContent"></div><div class="game-controls"><button class="soft-btn" id="repeatBtn">🔊 Ouvir instrução</button><button class="primary-btn" id="continueBtn" disabled>Continuar →</button></div><p class="help-line">Se precisar, peça ajuda ao professor. Cada tentativa é uma oportunidade de aprender!</p>`;
  $('#repeatBtn').addEventListener('click',()=>speak(phaseInstruction()));
  $('#continueBtn').addEventListener('click',nextChallenge);
  if(currentPhase===0)renderMemory();
  if(currentPhase===1)renderMatch();
  if(currentPhase===2)renderWord();
  if(currentPhase===3)renderRespect();
  if(currentPhase===4)renderQuiz();
}
function enableContinue(){const b=$('#continueBtn');if(b)b.disabled=false}
function nextChallenge(){
  if(challenge<4){challenge++;renderChallenge()}
  else finishPhase();
}
function finishPhase(){
  completed[currentPhase]=true;phaseScores[currentPhase]=score;
  if(currentPhase===4){renderFinalCertificate();return}
  const next=currentPhase+1;
  app.innerHTML=`<header class="topbar"><a class="brand"><span class="brand-mark">🌈</span><span>Pequenos <b>Guardiões</b></span></a><button class="sound-toggle" id="soundToggle"></button></header><main class="game-shell"><section class="game-panel completion"><div class="trophy">🎉</div><div class="eyebrow">FASE CONCLUÍDA</div><h2>${phases[currentPhase].title}!</h2><div class="stars">⭐ ⭐ ⭐</div><p>Você terminou os cinco desafios!<br>Conquistou <b>${score} pontos</b> nesta fase.</p><div class="game-controls"><button class="primary-btn" id="nextPhase">Desbloquear próxima fase →</button><button class="soft-btn" id="homeBtn">Voltar ao mapa</button></div></section></main>`;
  $('#soundToggle').addEventListener('click',toggleSound);updateSoundButton();$('#nextPhase').addEventListener('click',()=>startPhase(next));$('#homeBtn').addEventListener('click',renderHome);success();speak('Parabéns! Você concluiu esta fase. Uma nova aventura foi desbloqueada.');
}
function renderMemory(){
  const items=memoryRounds[challenge].map((x,i)=>({id:i,emoji:x[0],label:x[1]}));
  const cards=[...items,...items].map((x,i)=>({...x,key:i})).sort(()=>Math.random()-.5);
  let found=[];
  $('#challengeContent').innerHTML=`<div class="cards-grid">${cards.map(c=>`<button class="memory-card" data-key="${c.key}" aria-label="Carta fechada">❔</button>`).join('')}</div><div class="feedback" id="feedback">Encontre os três pares!</div>`;
  $('#challengeContent').querySelectorAll('.memory-card').forEach(btn=>btn.addEventListener('click',()=>{
    const key=Number(btn.dataset.key);if(locked||found.includes(key)||flipped.includes(key))return;
    btn.classList.add('flipped');btn.innerHTML=`${cards[key].emoji}<span>${cards[key].label}</span>`;flipped.push(key);playTone(480,.08);
    if(flipped.length===2){
      const [a,b]=flipped;
      if(cards[a].id===cards[b].id){found.push(a,b);matched.push(a,b);flipped=[];score+=10;$('#feedback').textContent='Muito bem! Você encontrou um par!';success();if(found.length===6){$('#feedback').textContent='Todos os pares encontrados! Que memória boa!';enableContinue()}}
      else{locked=true;$('#feedback').textContent='Vamos tentar outro par!';setTimeout(()=>{[a,b].forEach(k=>{const el=$(`[data-key="${k}"]`);if(el){el.classList.remove('flipped');el.textContent='❔'}});flipped=[];locked=false},850);error()}
    }
  }));
}
function renderMatch(){
  const pairs=matchRounds[challenge],left=[...pairs].sort(()=>Math.random()-.5),right=[...pairs].sort(()=>Math.random()-.5);
  $('#challengeContent').innerHTML=`<div class="match-list"><div class="match-column" id="matchLeft">${left.map((x,i)=>`<button class="match-option" data-side="left" data-value="${escapeHtml(x[1])}">${x[0]} <span>Imagem ${i+1}</span></button>`).join('')}</div><div class="match-column" id="matchRight">${right.map(x=>`<button class="match-option" data-side="right" data-value="${escapeHtml(x[1])}">${x[1]}</button>`).join('')}</div></div><div class="feedback" id="feedback">Escolha uma imagem e depois seu nome.</div>`;
  $('#challengeContent').querySelectorAll('.match-option').forEach(b=>b.addEventListener('click',()=>{
    if(b.classList.contains('done')||locked)return;
    const side=b.dataset.side;
    if(side==='left'){
      $('#matchLeft').querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected[0]=b.dataset.value;
    }else{
      if(!selected[0]){$('#feedback').textContent='Primeiro escolha uma imagem!';return}
      const leftBtn=$('#matchLeft .selected'),val=b.dataset.value;
      if(selected[0]===val){leftBtn.classList.remove('selected');leftBtn.classList.add('done');b.classList.add('done');selected=[];matched.push(val);score+=10;success();$('#feedback').textContent='Isso mesmo! Você fez uma combinação!';if(matched.length===3){$('#feedback').textContent='Todas as combinações estão prontas!';enableContinue()}}
      else{error();$('#feedback').textContent='Tente outra combinação. Você consegue!';}
    }
  }));
}
function renderWord(){
  const item=wordRounds[challenge],letters=item.word.split('').sort(()=>Math.random()-.5);
  $('#challengeContent').innerHTML=`<div class="word-card"><div class="word-emoji">${item.emoji}</div><div class="word-prompt">${item.clue}</div><div class="word-slots" id="wordSlots">${item.word.split('').map(()=>'<div class="letter-slot"></div>').join('')}</div><div class="letter-bank" id="letterBank">${letters.map((l,i)=>`<button class="letter-btn" data-index="${i}">${l}</button>`).join('')}</div><div class="feedback" id="feedback">Toque nas letras na ordem certa.</div><div class="game-controls"><button class="soft-btn" id="clearWord">Apagar letras</button><button class="secondary-btn" id="checkWord">Conferir palavra</button></div></div>`;
  $('#letterBank').querySelectorAll('.letter-btn').forEach(b=>b.addEventListener('click',()=>{if(b.disabled||letterAnswer.length>=item.word.length)return;b.disabled=true;letterAnswer.push({letter:letters[Number(b.dataset.index)],index:Number(b.dataset.index)});updateSlots()}));
  $('#clearWord').addEventListener('click',()=>{letterAnswer=[];$('#letterBank').querySelectorAll('button').forEach(b=>b.disabled=false);updateSlots()});
  $('#checkWord').addEventListener('click',()=>{
    const guess=letterAnswer.map(x=>x.letter).join('');
    if(guess===item.word){$('#feedback').textContent='Muito bem! Palavra formada!';score+=20;success();enableContinue()}
    else{$('#feedback').textContent='Quase! Observe as letras e tente novamente.';error()}
  });
  function updateSlots(){$('#wordSlots').innerHTML=item.word.split('').map((_,i)=>`<div class="letter-slot">${letterAnswer[i]?.letter||''}</div>`).join('')}
}
function renderRespect(){
  const item=respectRounds[challenge];
  $('#challengeContent').innerHTML=`<div class="word-card"><div class="word-emoji">💭</div><div class="word-prompt">${item.q}</div><div class="choice-grid">${item.opts.map((o,i)=>`<button class="choice-card" data-choice="${i}"><span class="choice-emoji">${o[0]}</span>${o[1]}</button>`).join('')}</div><div class="feedback" id="feedback">Qual atitude ajuda a construir uma turma respeitosa?</div></div>`;
  $('#challengeContent').querySelectorAll('.choice-card').forEach(b=>b.addEventListener('click',()=>{
    if(locked)return;locked=true;const val=Number(b.dataset.choice);
    if(val===item.a){b.classList.add('correct');score+=20;$('#feedback').textContent=item.why;success()}
    else{b.classList.add('wrong');$('#feedback').textContent='Vamos pensar juntos: '+item.why;error();$(`[data-choice="${item.a}"]`).classList.add('correct')}
    enableContinue();
  }));
}
function renderQuiz(){
  const item=quizRounds[challenge];
  $('#challengeContent').innerHTML=`<div class="word-card"><div class="word-emoji">🌟</div><div class="word-prompt">${item.q}</div><div class="choice-grid">${item.opts.map((o,i)=>`<button class="choice-card" data-choice="${i}"><span class="choice-emoji">${o[0]}</span>${o[1]}</button>`).join('')}</div><div class="feedback" id="feedback">Escolha uma resposta.</div></div>`;
  $('#challengeContent').querySelectorAll('.choice-card').forEach(b=>b.addEventListener('click',()=>{
    if(locked)return;locked=true;const val=Number(b.dataset.choice);
    if(val===item.a){b.classList.add('correct');score+=20;$('#feedback').textContent='Muito bem! '+item.why;success()}
    else{b.classList.add('wrong');$('#feedback').textContent='Vamos aprender: '+item.why;error();$(`[data-choice="${item.a}"]`).classList.add('correct')}
    enableContinue();
  }));
}
function renderFinalCertificate(){
  app.innerHTML=`<header class="topbar"><a class="brand"><span class="brand-mark">🌈</span><span>Pequenos <b>Guardiões</b></span></a><button class="sound-toggle" id="soundToggle"></button></header><main class="game-shell"><section class="game-panel completion"><div class="trophy">🏆</div><div class="eyebrow">MISSÃO CUMPRIDA</div><h2>Você é um Guardião do Respeito!</h2><p>Você concluiu todas as fases e aprendeu que cada pessoa tem seu valor.</p><div class="certificate"><div style="font-size:38px">🌈 ⭐ 💜</div><div class="eyebrow">CERTIFICADO DE PARTICIPAÇÃO</div><h3>Pequeno Guardião do Respeito</h3><p>Este certificado é para</p><input class="name-input" id="studentName" placeholder="Digite o nome da criança" maxlength="40" aria-label="Nome da criança"><p>por completar a aventura e aprender sobre respeito, amizade e diversidade.</p><div style="font-size:13px;color:#6f69a9;font-weight:900">20 DE NOVEMBRO • DIA DA CONSCIÊNCIA NEGRA</div></div><div class="game-controls"><button class="primary-btn" id="printCert">🖨️ Imprimir certificado</button><button class="soft-btn" id="homeBtn">Voltar ao início</button></div></section></main>`;
  $('#soundToggle').addEventListener('click',toggleSound);updateSoundButton();
  $('#printCert').addEventListener('click',()=>{const name=$('#studentName').value.trim();if(!name){$('#studentName').focus();$('#studentName').placeholder='Digite o nome primeiro';return}const input=$('#studentName');const text=document.createElement('span');text.className='cert-name';text.textContent=name;input.replaceWith(text);window.print();});
  $('#homeBtn').addEventListener('click',renderHome);success();speak('Parabéns, guardião do respeito! Você concluiu toda a aventura.');
}
renderHome();
