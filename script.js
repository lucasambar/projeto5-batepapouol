//escopo global
const feed = document.querySelector("section");
let mensagem, input, hora, usuario, usuarioPost, tipo;

//inserçao de usuarios
usuarios();

function usuarios(){
    let promessa = axios.get('https:mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(incluirUsuário);   
}
function incluirUsuário () {
    console.log("Tudo certo!");
    usuario = prompt("Qual é o seu nome?");
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
function sucesso () {
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
    <div class="mensagem login">
        <p><span>(${hora})</span> <strong>${usuario}</strong> ${status}... </p>
    </div>
    `
}

//
//enviando as mensagens
function enviarMensagem () {
    input = document.querySelector("input");
    mensagem = input.value;
    hora = horaAgora();
    console.log(mensagem);
    feed.innerHTML += `
    <div class="mensagem todos">
        <!-- hora atual//nome do usuário//mensagem -->
        <p><span>(${hora})</span><strong> ${usuario}</strong> para <strong>${tipo} </strong>${mensagem}</p>
    </div>
    `
}
function horaAgora () {
    let data = Date();
    let arr = data.split(" ");
    return arr[4]
}
