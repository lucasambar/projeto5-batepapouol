//escopo global
const feed = document.querySelector("section");
let mensagem, input, hora, usuario, usuarioPost, tipo;

//usuarios
usuario = prompt("Qual é o seu nome?");
usuarios();

function usuarios(){
    let promessa = axios.get('https:mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(incluirUsuário);   
}
function incluirUsuário () {
    console.log("Tudo certo!");
    usuarioPost = {
        name: usuario
    }
    let requisicao = axios.post('https:mock-api.driven.com.br/api/v6/uol/participants',usuarioPost);
    requisicao.then(sucesso);
    requisicao.catch(tratarErro);
}
function sucesso () {
    console.log("Usuário cadastrado com suceso!");
    login();
}
function tratarErro (erro) {
    console.log("erro");
    console.log(erro);
}

//status do usuário
let statusUsuario = setInterval(manterConexao,5000);
function manterConexao () {
    let requisicao = axios.post('https:mock-api.driven.com.br/api/v6/uol/status',usuarioPost);
    requisicao.then(ativo);
}
function ativo () {
    console.log("Usuário ativo");
}


//enviando as mensagens
function login() {
    hora = horaAgora();
    tipo = "todos";
    feed.innerHTML = `
    <div class="mensagem login">
        <p><span>(${hora})</span> <strong>${usuario}</strong> entrou na sala... </p>
    </div>
    `
}
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
