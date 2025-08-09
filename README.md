# GymIA 

<div align="center">

![GymIA Logo](https://via.placeholder.com/200x80/6366f1/ffffff?text=GymIA)

**Transforme seus treinos com a ciência e a inteligência artificial**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Rust](https://img.shields.io/badge/Rust-1.70+-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/yourusername/gymia/issues)

</div>

## 🌟 Sobre o Projeto

O **GymIA** é uma plataforma revolucionária que combina ciência do exercício com inteligência artificial para criar planos de treino personalizados. Nossa missão é democratizar o acesso a treinamento de qualidade, oferecendo orientação científica e personalizada para todos os níveis de condicionamento físico.

## Tecnologias utilizadas

### **Frontend**
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![React Router](https://img.shields.io/badge/React_Router-6.8-CA4245?style=flat-square&logo=react-router)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.0-0055FF?style=flat-square&logo=framer)
![Axios](https://img.shields.io/badge/Axios-1.3-5A29E4?style=flat-square&logo=axios)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=flat-square&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-9.0-000000?style=flat-square&logo=json-web-tokens)

### **IA & Análise**
![Hugging Face](https://img.shields.io/badge/Hugging_Face-Transformers-FFD21E?style=flat-square&logo=huggingface)
![Rust](https://img.shields.io/badge/Rust-1.70+-000000?style=flat-square&logo=rust)

### **Ferramentas & DevOps**
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat-square&logo=visual-studio-code)
![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm)

## 🚀 Começando

### **Pré-requisitos**

```bash
node >= 18.0.0
npm >= 8.0.0
postgresql >= 15.0
```

### **Instalação Rápida**

1. **Clone o repositório**
```bash
git clone https://github.com/yourusername/gymia.git
cd gymia
```

2. **Configure o ambiente**
```bash
# Backend
cd server
cp .env.example .env
# Edite o .env com suas configurações
npm install

# Frontend
cd ../client
npm install
```

3. **Configure o banco de dados**
```sql
CREATE DATABASE gymia_db;
```

4. **Execute o projeto**
```bash
# Desenvolvimento (ambos simultaneamente)
npm run dev

# Ou separadamente:
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm start
```

5. **Acesse a aplicação**
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

## 📁 Estrutura do Projeto

```
gymia/
├── 📁 client/                 # Frontend React
│   ├── 📁 public/            # Arquivos públicos
│   ├── 📁 src/
│   │   ├── 📁 components/    # Componentes reutilizáveis
│   │   ├── 📁 contexts/      # Context API (Auth, Workout)
│   │   ├── 📁 pages/         # Páginas da aplicação
│   │   ├── 📁 styles/        # Estilos globais
│   │   └── 📄 App.js         # Componente principal
│   └── 📄 package.json
├── 📁 server/                # Backend Node.js
│   ├── 📁 controllers/       # Controladores da API
│   ├── 📁 middleware/        # Middlewares customizados
│   ├── 📁 models/           # Modelos do banco de dados
│   ├── 📁 routes/           # Rotas da API
│   ├── 📁 services/         # Serviços (IA, Email, etc)
│   ├── 📁 utils/            # Utilitários
│   └── 📄 server.js         # Servidor principal
├── 📁 utils/                # Utilitários compartilhados
│   └── 📄 workout_analyzer.rs # Análise de performance em Rust
├── 📄 README.md
└── 📄 package.json
```




## API Endpoints

### **Autenticação**
```http
POST /api/auth/register    # Cadastro
POST /api/auth/login       # Login
POST /api/auth/logout      # Logout
GET  /api/auth/profile     # Perfil do usuário
```

### **Chat IA**
```http
POST /api/chat/message     # Enviar mensagem
GET  /api/chat/history     # Histórico de conversas
POST /api/chat/quick-plan  # Plano rápido (sem auth)
```

### **Planos de Treino**
```http
GET    /api/plans          # Listar planos
POST   /api/plans          # Criar plano
PUT    /api/plans/:id      # Atualizar plano
DELETE /api/plans/:id      # Deletar plano
POST   /api/plans/:id/duplicate # Duplicar plano
```

## Testes

```bash
# Testes do Frontend
cd client
npm test

# Testes do Backend
cd server
npm test

# Testes em Rust
cd utils
cargo test
```

## Deploy

### **Frontend (Vercel/Netlify)**
```bash
cd client
npm run build
# Deploy da pasta build/
```

### **Backend (Heroku/Railway)**
```bash
cd server
# Configure as variáveis de ambiente
# Deploy direto do Git
```

### **Banco de Dados**
- **Supabase** (recomendado)
- **Railway PostgreSQL**
- **Heroku Postgres**

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/lucsnobre">
        <img src="https://github.com/lucsnobre.png" width="100px;" alt=""/>
        <br />
        <sub><b>Lucas</b></sub>
      </a>
      <br />
      <a href="https://github.com/yourusername/gymia/commits?author=lucsnobre" title="Code">💻</a>
      <a href="#design-lucsnobre" title="Design">🎨</a>
      <a href="#ideas-lucsnobre" title="Ideas">🤔</a>
    </td>
  </tr>
</table>

<div align="center">

**"Hoje nóis mija na cara da mídia por que ela depende de nóis pra lucrar"**

</div>


