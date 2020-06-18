const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = 0;

function validade(request, response, next){//valida se reamente eh um id
  const { id } = request.params
  if (!isUuid(id)) {
    return response.status(400).send()
  }
  return next()
}


app.get("/repositories", (request, response) => {
  return response.send(repositories)
});



app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body//busca os dados enviados pelo usuario
 
  const repository = { id: uuid(), title, url, techs, likes} //cria o objeto "repository" 
 
  repositories.push(repository)// insere o objeto "repository" dentro do array "repositories"

  return response.status(200).send(repository)//retorna para o usuario o objeto criado
});


app.put("/repositories/:id", validade, (request, response) => {
  
  const { id } = request.params//pega o id do projeto que deve ser alterado
  
  const { title, url, techs } = request.body //pega as informações para alterar o objeto
  const repository = { //cria um objeto com as informações atualizadas
    id,
    title,
    url,
    techs,
    likes
  }

  const repositoryIndex = repositories.findIndex(Repository => repository.id === id)//procura a posição desse objeto dentro do array

  if (repositoryIndex < 0) {//verifica se o objeto existe
    return response.status(400).send().json({error: "repository not found"})//se nao existir retorna erro bad request para cliente
  }

  repositories[repositoryIndex] = repository //altera o objeto com base na posição no array informado pelo repositoryIndex

  return response.json(repository)//retorna o novo objeto atualizado

});



app.delete("/repositories/:id", validade, (request, response) => {

  const { id } = request.params//pega o id do projeto que deve ser apagado
  const repository = {id}
  
  const repositoryIndex = repositories.findIndex(Repository => repository.id === id)
  
  if (repositoryIndex < 0) {//verifica se o objeto existe 
    return response.status(400).json({error: "repository not found"})//se nao existir retorna erro bad request para cliente 
 }

  repositories.splice(repositoryIndex, 1)//apaga o repositorio na posição indicada pelo repositoryIndex

  return response.status(204).send()//responde o usuario

});


app.post("/repositories/:id/like", validade, (request, response) => {

  const { id } = request.params

  const repository = {
    id
  }

  const repositoryIndex = repositories.findIndex(Repository => repository.id === id)
  
  if (repositoryIndex < 0) {//verifica se o objeto existe e corta a conexão
    return response.status(400).send()//.json({error: "Não foi possível localizar seu ID"})//se nao existir retorna erro bad request para cliente
  }

  repositories[repositoryIndex].likes += 1
  

  return response.status(200).send(repositories[repositoryIndex])



});

module.exports = app;
