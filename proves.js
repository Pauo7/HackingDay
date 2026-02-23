let htmlCorrect = false;
let cssCorrect = false;
let jsCorrect = false;
let linuxCorrect = false;
let jsAttempts = 0;
const jsMaxAttempts = 3;

let matrixInterval;

function toggleCard(header, provaNum) {

  if(provaNum === 2 && !htmlCorrect){
    alert('Has de completar correctament la Prova 1 abans.');
    return;
  }

  if(provaNum === 3 && !cssCorrect){
    alert('Has de completar correctament la Prova 2 abans.');
    return;
  }

  if(provaNum === 4 && !jsCorrect){
    alert('Has de completar correctament la Prova 3 abans de poder accedir a Linux.');
    return;
  }

  const body = header.nextElementSibling;
  body.classList.toggle('show');

  if(provaNum === 4){
    const isActive = document.body.classList.toggle('linux-mode');

    if(isActive){
      startMatrix();
    } else {
      stopMatrix();
    }
  }
}

function checkHTML(){
  const code = document.getElementById('htmlCode').value.trim();
  if(!code){
    alert('Escriu el teu codi HTML.');
    return;
  }

  const iframe = document.getElementById('htmlPreview');
  iframe.srcdoc = code;

  if(code.toLowerCase().includes('<p>hola món</p>')){
    document.getElementById('htmlResult').textContent = 'Correcte!';
    document.getElementById('htmlResult').className = 'result ok';
    htmlCorrect = true;
  } else {
    document.getElementById('htmlResult').textContent = 'Incorrecte';
    document.getElementById('htmlResult').className = 'result bad';
    htmlCorrect = false;
  }
}

function checkCSS(){
  const code = document.getElementById('cssCode').value.trim();
  if(!code){
    alert('Escriu el teu codi CSS.');
    return;
  }

  const iframe = document.getElementById('cssPreview');
  iframe.srcdoc = '<p style="color:red">Hola món</p><style>' + code + '</style>';

  if(code.includes('color: red')){
    document.getElementById('cssResult').textContent = 'Correcte!';
    document.getElementById('cssResult').className = 'result ok';
    cssCorrect = true;
  } else {
    document.getElementById('cssResult').textContent = 'Incorrecte';
    document.getElementById('cssResult').className = 'result bad';
    cssCorrect = false;
  }
}

function checkJS(){
  const code = document.getElementById('jsCode').value.trim();

  if(!code){
    alert('Escriu el teu codi JS.');
    return;
  }

  try{
    const fn = new Function('return (' + code + ')')();
    const res = fn(2,3);

    if(res === 5){
      document.getElementById('jsResult').textContent = 'Correcte!';
      document.getElementById('jsResult').className = 'result ok';
      jsCorrect = true;
      jsAttempts = 0;
    } else {
      jsAttempts++;
      if(jsAttempts >= jsMaxAttempts){

        document.getElementById('jsCode').value = 'function sum(a,b){ return a+b; }';
        document.getElementById('jsResult').textContent = 'Aquí tens la resposta!';
        document.getElementById('jsResult').className = 'result ok';
        jsCorrect = true;
        jsAttempts = 0;
      } else {
        document.getElementById('jsResult').textContent = 'Incorrecte, prova de nou';
        document.getElementById('jsResult').className = 'result bad';
        jsCorrect = false;
      }
    }

  } catch(e){
    jsAttempts++;
    if(jsAttempts >= jsMaxAttempts){
      document.getElementById('jsCode').value = 'function sum(a,b){ return a+b; }';
      document.getElementById('jsResult').textContent = 'Aquí tens la resposta!';
      document.getElementById('jsResult').className = 'result ok';
      jsCorrect = true;
      jsAttempts = 0;
    } else {
      document.getElementById('jsResult').textContent = 'Error: ' + e.message;
      document.getElementById('jsResult').className = 'result bad';
      jsCorrect = false;
    }
  }
}

function checkLinux(){
  const code = document.getElementById('linuxCode').value.trim();

  if(!code){
    alert('Escriu una comanda.');
    return;
  }

  if(code === "ls" || code === "ls -l" || code === "ls -la"){
    document.getElementById('linuxResult').textContent = 'Correcte!, has sortit de la primera illa';
    document.getElementById('linuxResult').className = 'result ok';
    linuxCorrect = true;
  } else {
    document.getElementById('linuxResult').textContent = 'Incorrecte.';
    document.getElementById('linuxResult').className = 'result bad';
    linuxCorrect = false;
  }
}

function startMatrix() {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = "01";
  const fontSize = 16;
  const columns = canvas.width / fontSize;

  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  matrixInterval = setInterval(draw, 33);
}

function stopMatrix() {
  clearInterval(matrixInterval);
}

const linuxInput = document.getElementById("linuxCode");

linuxInput.addEventListener("keydown", function() {

  if(document.body.classList.contains("linux-mode")){

    document.body.classList.add("glitch");

    setTimeout(() => {
      document.body.classList.remove("glitch");
    }, 150);

  }

});

