//escopo global
const feed = document.querySelector("section");
let  input, hora, usuario, usuarioPost, tipo;

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
    requisicao.catch(statusMsg, "saiu da sala");
}
function ativo () {
    console.log("Usuário ativo");
}
function inativo () {
    hora = horaAgora();

    tipo = "todos";
    feed.innerHTML = `
    <div class="mensagem login">
        <p><span>(${hora})</span> <strong>${usuario}</strong> saiu da sala... </p>
    </div>
    ` 
}
function statusMsg (status) {
    hora = horaAgora();
    tipo = "todos";
    feed.innerHTML = `
    <div class="mensagem status">
        <p><span>(${hora})</span> <strong>${usuario}</strong> ${status}... </p>
    </div>
    `
}

//histórico de mensagem
historico()
function historico() {
    let promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(historicoOK);
}
function historicoOK(resposta) {
    console.log(resposta);
    let mensagens = resposta.data;
    mensagens.forEach(renderMensagem);
}
function renderMensagem (objeto) { 
    feed.innerHTML += `<div class="mensagem ${objeto.type}">
        <p><span>(${objeto.time})</span> <strong>${objeto.from}</strong> para <strong>${objeto.to}</strong>  ${objeto.text}</p>
    </div>
`
}
function horaAgora () {
     let data = Date();
     let arr = data.split(" ");
     return arr[4]
}
