function toggleCard(header) {
  const body = header.nextElementSibling;
  body.style.display = body.style.display === 'block' ? 'none' : 'block';
}

// HTML
function checkHTML(){
  const code = document.getElementById('htmlCode').value.trim();
  const iframe = document.getElementById('htmlPreview');
  iframe.srcdoc = code;
  if(code.toLowerCase().includes('<p>hola món</p>')){
    document.getElementById('htmlResult').textContent = 'Correcte!';
    document.getElementById('htmlResult').className = 'result ok';
  } else {
    document.getElementById('htmlResult').textContent = 'Incorrecte, revisa el teu codi';
    document.getElementById('htmlResult').className = 'result bad';
  }
}

// CSS
function checkCSS(){
  const code = document.getElementById('cssCode').value.trim();
  const iframe = document.getElementById('cssPreview');
  iframe.srcdoc = '<p>Hola món</p><style>' + code + '</style>';
  if(code.includes('color: red')){
    document.getElementById('cssResult').textContent = 'Correcte!';
    document.getElementById('cssResult').className = 'result ok';
  } else {
    document.getElementById('cssResult').textContent = 'Incorrecte, prova de nou';
    document.getElementById('cssResult').className = 'result bad';
  }
}

// JS
function checkJS(){
  try{
    const fn = new Function('return (' + document.getElementById('jsCode').value + ')')();
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