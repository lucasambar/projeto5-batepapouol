//escopo global
const feed = document.querySelector("section");
let  input, hora, usuario, usuarioPost, tipo;

function horaAgora () {
    let data = Date();
    let arr = data.split(" ");
    return arr[4]
}
//inserçao de usuarios
usuario = prompt("Qual é o seu nome?");
usuarios();

function usuarios(){
    let promessa = axios.get('https:mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(incluirUsuário);   
}
function incluirUsuário () {
    console.log("Tudo certo!");
    adcionaAPI();
}
function adcionaAPI() {
    usuarioPost = {
        name: usuario
    }
    let requisicao = axios.post('https:mock-api.driven.com.br/api/v6/uol/participants',usuarioPost);
    requisicao.then(sucesso);
    requisicao.catch(tratarErro);
}
function sucesso (resposta) {
    console.log("Usuário cadastrado com suceso!");
    statusMsg("entrou na sala");
}
function tratarErro (erro) {
    const statusCode = erro.response.status;
    if (statusCode === 409) {
        usuario = prompt("Esse usuário já está logado, tente com outro nome.")
        adcionaAPI();
    }
    if (statusCode === 422) {
        usuario = prompt("Insira um nome de usuário válido.")
        adcionaAPI();
    }
}

//status do usuário
let statusUsuario = setInterval(manterConexao,5000);
function manterConexao () {
    let requisicao = axios.post('https:mock-api.driven.com.br/api/v6/uol/status',usuarioPost);
    requisicao.then(ativo);
    requisicao.catch(inativo);
}
function ativo () {
    console.log("Usuário ativo");
}
function inativo () {
    let mensagem = {
        from: usuario,
        to: "todos",
        text: "saiu da sala...",
        type: "status",
        time: horaAgora() 
    }
    feed.innerHTML += `
    <div class="mensagem ${mensagem.type}">
        <p><span>(${mensagem.time})</span> <strong>${mensagem.from}</strong> <strong>${mensagem.to}</strong> ${mensagem.text} </p>
    </div>
    `
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagem)
}


//histórico de mensagem
setInterval(historico,3000);
function historico() {
    let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(historicoOK);
}
function historicoOK(resposta) {
    console.log(resposta);
    let mensagens = resposta.data;
    renderMensagem(mensagens)
}
function renderMensagem (Array) { 
    for(let i = 0;i<Array.length;i++) {
        let objeto = Array[i];
        feed.innerHTML += `<div class="mensagem ${objeto.type}">
        <p><span>(${objeto.time})</span> <strong>${objeto.from}</strong> para <strong>${objeto.to}</strong>  ${objeto.text}</p>
        </div>
    ` }
}

function enviarMensagem () {
    let objeto = {
        from: usuario,
        to: "Todos",
        text: document.querySelector("input").value,
        time: horaAgora(),
        type: "message"
    }
    feed.innerHTML += `<div class="mensagem ${objeto.type}">
        <p><span>(${objeto.time})</span> <strong>${objeto.from}</strong> para <strong>${objeto.to}</strong>  ${objeto.text}</p>
        </div>
    `
    let msg = document.querySelector("mensagem");
    msg.scrollIntoView()
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages" ,objeto)
}
