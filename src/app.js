const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    url,
    title,
    techs,
    id: uuid(),
    likes: 0,
  };

  repositories.push(repository);
  response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const { title, techs, url } = request.body;
  const repository = { id, title, techs, url };

  repositories[repositoryIndex] = repository;

  response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const { title, techs, url, likes } = repositories[repositoryIndex];

  const repository = { id, title, techs, url, likes: likes + 1 };

  repositories[repositoryIndex] = repository;

  response.json(repository);
});

module.exports = app;
