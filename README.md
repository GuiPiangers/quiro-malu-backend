<h1 align="center" style="font-weight: bold;">Back-end do Sistema de Gestão para Clínica de Quiropraxia</h1>

<p align="center">
 <a href="#features">Funcionalidades</a> • 
 <a href="#tech">Tecnologias</a> • 
 <a href="#started">Getting Started</a>
</p>

<p>
    <b>Este projeto é o back-end de um sistema de gestão desenvolvido para uma clínica de quiropraxia. Construído com Node.js e Express, ele fornece APIs robustas e escaláveis para gerenciar operações administrativas e oferecer uma melhor experiência para pacientes e colaboradores da clínica.</b>
</p>
<p>
    Deve ser usado em conjunto com o <a href="https://github.com/GuiPiangers/quiro-malu-front-end">Projeto Front-end</a>, que oferece uma interface para consumir as rotas fornecidas por essa API.
</p>

<h2 id="features">Funcionalidades</h2>

<p>Atualmente, o backend suporta as seguintes funcionalidades principais:</p>
<ul>
   <li>Login e registro e de novos usuários, garantindo a segunrança no uso do sistema e permitindo mais de um usuário simultânio usando contas diferentes</li>
  <li><strong>Gerenciamento de Pacientes</strong>: Registro, atualização e organização de informações dos pacientes.</li>
  <li><strong>Agendamento de Consultas</strong>: Sistema de agendamento para consultas com controle de horários, serviços e status.</li>
  <li><strong>Relatórios de Progresso</strong>: Criação e gerenciamento de relatórios personalizados sobre a evolução dos pacientes.</li>
</ul>

<h3>Funcionalidades Futuras</h3>
<ul>
  <li><strong>Geração de PDFs</strong>: Exportação de relatórios de progresso de pacientes em formato PDF para compartilhamento ou impressão.</li>
  <li><strong>Gestão Financeira</strong>: Controle financeiro da clínica, incluindo registros de receitas, despesas e relatórios financeiros.</li>
  <li><strong>Automação de Mensagens via WhatsApp</strong>: Envio automatizado de mensagens personalizáveis para os clientes, como lembretes de consulta e atualizações importantes.</li>
</ul>

<h2 id="tech">Tecnologias</h2>

- TypeScript
- NodeJS
- Express
- Docker
- Knex
- MySQL

<h2 id="started">Instalação e configuração</h2>

<h3>Pré requisitos</h3>

- [NodeJS](https://github.com/)
- [Git 2](https://github.com)
- [Docker](https://www.docker.com/get-started/)

<ol>
  <li>Clone este repositório:
    <pre><code>git clone https://github.com/GuiPiangers/quiro-malu-backend.git
cd quiro-malu-backend</code></pre>
  </li>

  <li>Instale as dependências:
    <pre><code>npm install</code></pre>
  </li>

  <li>Configure as variáveis de ambiente:
    Use o arquivo `.env.example` como referência para criar o seu arquivo `.env` com suas configurações de banco de dados e SECRETY KEYS

   ```yaml
  MYSQL_ROOT_PASSWORD=
  MYSQL_PASSWORD=
  MYSQL_DATABASE=
  MYSQL_USER=
  DB_HOST=
  JWT_SECRET=
  NODE_ENV="development"
  PORT=8000
   ```
  </li>
 
  <li>Configure o próprio banco de dados ou inicialize o banco de dados local com docker usando o seguinte comando:
    <pre><code>docker compose up -d mysql-db</code></pre>
  </li>

  <li>Execute as migrations do banco de dados com o seguinte comando:
    <pre><code>npm run knex:migrate</code></pre>
  </li>
 
  <li>Inicie o servidor:
    <pre><code>npm run dev</code></pre>
  </li>
</ol>

<p>O servidor estará disponível em <code>http://localhost:8000</code> por padrão.</p>