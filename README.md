# DrinkHub

O DrinkHub é um aplicativo dedicado a entusiastas de coquetéis, oferecendo uma vasta coleção de receitas de drinks, além de funcionalidades para salvar drinks favoritos e filtrar receitas com base nos ingredientes disponíveis.

## Tecnologias Utilizadas

### Front-end
- React Native
- Expo


### Back-end
- Node.js
- nest.js 
- PostgreSQL 

### Hospedagem
- Back-end: Vercel
- Banco de Dados: Railway


### Principais Rotas da API

1. **GET https://teste-git-main-leondodes-projects.vercel.app/drinks**
   - Retorna a lista de todos os drinks disponíveis.
   
2. **GET https://teste-git-main-leondodes-projects.vercel.app/drinks/:id**
   - Retorna os detalhes de um drink específico com base no ID.
   
3. **POST https://teste-git-main-leondodes-projects.vercel.app/drinks**
   - Cria um novo drink
   `
4. **GET https://teste-git-main-leondodes-projects.vercel.app/drinks/categorias**
   - Retorna a lista de  categorias criadas
   
5. **GET https://teste-git-main-leondodes-projects.vercel.app/drinks/salvos**
   - Retorna a lista de drinks salvos
   
6. **DELETE https://teste-git-main-leondodes-projects.vercel.app/drinks/:id**
   - deleta o drink do id selecionado
### Principais Telas da Aplicação


1. **Home**
   - Lista e busca de drinks, segmentados por categoria.
   

2. **Meu Bar**
   - Permite ao usuário selecionar quais ingredientes possui em casa.
   - disponibiliza drinks com base nos ingredientes selecionados.


3. **Salvos**
   - Lista de drinks salvos pelo usuário.
   - Facilita o acesso rápido aos drinks favoritos do usuário.

## Link para os repositorios separadamente

- API: https://github.com/leonDode/api-drinks
- Front: https://github.com/leonDode/DrinkHub-Front
- Fotos: https://github.com/leonDode/api-drinks-fotos  


