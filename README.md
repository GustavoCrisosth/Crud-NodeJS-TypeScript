Projeto Full-Stack: API de Gerenciamento e Vendas

Este é um projeto de aplicação web full-stack completo construído do zero, com o objetivo de criar um sistema robusto para gerenciamento de clientes, produtos, endereços e um fluxo de compras. 

A aplicação é dividida em um back-end (API RESTful) e um front-end (React SPA), seguindo as melhores práticas de desenvolvimento modernas.

O projeto foi totalmente desenvolvido em TypeScript e implantado na nuvem usando uma arquitetura de serviços distribuídos (Vercel, Render e Aiven).


Status do Projeto: 🏁 Concluído


✨ Funcionalidades Principais

Dashboard: Página inicial com um resumo de estatísticas em tempo real (Total de Vendas, Receita, Clientes, Produtos).


Gerenciamento de Clientes (CRUD):

Criar, Ler, Atualizar e Excluir clientes.

Formulários com validação avançada (Zod + React Hook Form).

Notificações "Toast" para todas as ações.

Gerenciamento de Produtos (CRUD):

CRUD completo para produtos.

Formulários com validação e Toasts.


Gerenciamento de Endereços:

CRUD completo de endereços dentro da página de detalhes de cada cliente (Relacionamento 1-N).


Sistema de Compras (Relacionamento N-M):

Página dedicada para criar uma nova compra.

Seleção de cliente e produtos (com busca) usando componentes ComboBox.

Cálculo de total em tempo real.

Finalização da compra com envio dos dados para a API (transação no back-end).


Histórico de Compras: Página que lista todas as compras já realizadas, mostrando o cliente, produtos, quantidades e total.


🛠️ Stack de Tecnologias
O projeto é dividido em duas pastas principais: backend/ e frontend/.



🖥️ Back-end (API)


Node.js com TypeScript

Express.js para roteamento e middlewares

Sequelize como ORM para gerenciamento do banco de dados

MySQL como banco de dados relacional

Zod para validação robusta dos dados de entrada


Arquitetura: Services (Lógica de Negócio), Controllers (Entrada/Saída), Routes, Models e Schemas

CORS para segurança de comunicação entre domínios



🎨 Front-end (UI)

React com Vite e TypeScript

Tailwind CSS para estilização utilitária

shadcn/ui para componentes de UI (Buttons, Dialogs, Cards, Forms, Toasts, etc.)

React Router (react-router-dom) para navegação e múltiplas páginas

React Hook Form e Zod para validação de formulário avançada

Axios para comunicação com a API

lucide-react para ícones


☁️ Banco de Dados & Deploy
Banco de Dados: Aiven (MySQL as a Service)

Back-end (API): Render (Web Service com build e deploy automáticos)

Front-end (UI): Vercel (Otimizado para Vite/React)



Como Rodar Localmente

Para rodar este projeto, você precisará de dois terminais abertos, um para o back-end e outro para o front-end.

1. Pré-requisitos:
   
Node.js (v18 ou mais recente)

Docker (para rodar o banco de dados MySQL localmente)

Um editor de código como VS Code


2. Configuração do Back-end
   
Clone este repositório:

Bash

git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

cd SEU_REPOSITORIO

Navegue até a pasta do back-end:

Bash

cd backend

Crie seu arquivo de variáveis de ambiente .env:

Bash

cp .env.example .env 

(Se você não tiver um .env.example, crie um arquivo .env e preencha com as seguintes chaves para rodar com o Docker):

Snippet de código

DB_HOST=localhost

DB_PORT=3306

DB_USERNAME=root

DB_PASSWORD=sua_senha_secreta  # (Deve ser a mesma do docker-compose.yml)

DB_DATABASE=crud_ts

APP_PORT=3000

CORS_ORIGIN=http://localhost:5173 


Inicie o container do banco de dados MySQL com Docker:

Bash

docker compose up -d

Instale as dependências:

Bash

npm install

Rode as migrações para criar as tabelas no banco:

Bash

npm run db:migrate


Inicie o servidor de desenvolvimento:

Bash

npm run dev

O back-end estará rodando em http://localhost:3000.


3. Configuração do Front-end
   
Abra um novo terminal.

Navegue até a pasta do front-end:

Bash

cd frontend

Crie seu arquivo de variáveis de ambiente local .env.local:

Snippet de código

# frontend/.env.local

VITE_API_URL=http://localhost:3000/api


Instale as dependências:

Bash

npm install

Inicie o servidor de desenvolvimento do Vite:

Bash

npm run dev

O front-end estará rodando em http://localhost:5173.


Arquitetura de Deploy

Este projeto está 100% na nuvem:

O Front-end (frontend/) está hospedado na Vercel.

O Back-end (backend/) está hospedado na Render.

O banco de dados MySQL é gerenciado pela Aiven.

O script start do back-end na Render está configurado para rodar as migrações (npm run db:migrate) antes de iniciar o servidor, garantindo que o banco de dados esteja sempre sincronizado com o código.
