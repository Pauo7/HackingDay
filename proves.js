let htmlCorrect = false;
let cssCorrect = false;

function toggleCard(header, provaNum) {
  // Bloqueig per proves successives
  if(provaNum === 2 && !htmlCorrect){
    alert('Has de completar correctament la Prova 1 abans.');
    return;
  }
  if(provaNum === 3 && !cssCorrect){
    alert('Has de completar correctament la Prova 2 abans.');
    return;
  }
  const body = header.nextElementSibling;
  body.classList.toggle('show');
}

// HTML
function checkHTML(){
  const code = document.getElementById('htmlCode').value.trim();
  if(!code){
    alert('Si us plau, escriu el teu codi HTML abans de comprovar.');
    return;
  }
  const iframe = document.getElementById('htmlPreview');
  iframe.srcdoc = code;
  if(code.toLowerCase().includes('<p>hola món</p>')){
    document.getElementById('htmlResult').textContent = 'Correcte!';
    document.getElementById('htmlResult').className = 'result ok';
    htmlCorrect = true;
  } else {
    document.getElementById('htmlResult').textContent = 'Incorrecte, revisa el teu codi';
    document.getElementById('htmlResult').className = 'result bad';
    htmlCorrect = false;
  }
}

// CSS
function checkCSS(){
  const code = document.getElementById('cssCode').value.trim();
  if(!code){
    alert('Si us plau, escriu el teu codi CSS abans de comprovar.');
    return;
  }
  const iframe = document.getElementById('cssPreview');
  iframe.srcdoc = '<p>Hola món</p><style>' + code + '</style>';
  if(code.includes('color: red')){
    document.getElementById('cssResult').textContent = 'Correcte!';
    document.getElementById('cssResult').className = 'result ok';
    cssCorrect = true;
  } else {
    document.getElementById('cssResult').textContent = 'Incorrecte, prova de nou';
    document.getElementById('cssResult').className = 'result bad';
    cssCorrect = false;
  }
}

// JS
function checkJS(){
  const code = document.getElementById('jsCode').value.trim();
  if(!code){
    alert('Si us plau, escriu el teu codi JS abans de comprovar.');
    return;
  }
  try{
    const fn = new Function('return (' + code + ')')();
    const res = fn(2,3);
    if(res === 5){
      document.getElementById('jsResult').textContent = 'Correcte!';
      document.getElementById('jsResult').className = 'result ok';
    } else {
      document.getElementById('jsResult').textContent = 'Incorrecte';
      document.getElementById('jsResult').className = 'result bad';
    }
  } catch(e){
    document.getElementById('jsResult').textContent = 'Error: '+e.message;
    document.getElementById('jsResult').className = 'result bad';
  }
}