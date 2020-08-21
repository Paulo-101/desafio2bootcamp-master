const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next){
  const{method, url} = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel)

  return next();
}

app.get("/repositories", (request, response) => {
  const { title } = request.query
  const results = title
  ? repositories.filter(repository => repository.title.includes(title))
  : repositories;
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {id:uuid(), title, url, techs};

  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id===id);
  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found'})
  }
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositoryIndex
    
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id===id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
 
  const {id} = request.params;

  const repository = repositories.findIndex(repository => repository.id === id);

  if(!repository){
    return response.status(400).json({error: 'Repository not found.'})
  }

  repositories.likes++;

  
 
});

module.exports = app;
