# 📚 Posts Teachers FIAP - Tech Challenge Fase 03
<div align="center">
  <img src="https://img.shields.io/badge/Vite-5.x-blueviolet?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Material%20UI-7.3.2-blue?style=for-the-badge&logo=mui" alt="Material UI" />
</div>

<div align="center">
  <h3>🎯 Uma plataforma de blog moderna para professores compartilharem conteúdo e experiências educacionais</h3>
  <p>Construído com Vite, React, TypeScript e Material-UI</p>
</div>

## 🌟 Visão Geral

O **Blog EducaTech** é uma plataforma de blog projetada para professores compartilharem insights educacionais e aulas criativas com a comunidade. A plataforma oferece uma interface intuitiva para criação e gerenciamento de conteúdo, garantindo uma experiência de leitura agradável para todos os usuários.

## 🤝 GRUPO

* RM 362457 - Alessandra Guedes
* RM 362166 - Ana Carolina
* RM 363723 - Vinicius Faria
* RM 360942 - Vitor Freire

* ### ✨ Principais Características

-   🔐 **Autenticação Segura** - Sistema de login baseado em JWT para professores.
-   📝 **Gerenciamento de Conteúdo** - Crie, edite e exclua posts educacionais.
-   🔍 **Busca em Tempo Real** - Encontre posts instantaneamente com a funcionalidade de busca.
-   📱 **Design Responsivo** - Otimizado para todos os dispositivos e tamanhos de tela.
-   🎨 **UI Moderna** - Interface limpa e acessível construída com componentes Material-UI.
-   ⚡ **Performance Otimizada** - Carregamento rápido com as otimizações do Vite.

## 🚀 Início Rápido

### Pré-requisitos

-   Node.js 18.x ou superior
-   npm ou yarn

### Instalação

1.  **Clone o repositório**
    ```bash
    git clone <url-do-repositorio>
    cd teacher-post-challenge
    ```
2.  **Instale as dependências**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento**
    ```bash
    npm run dev
    ```
4.  **Abra no navegador**
    Navegue para [http://localhost:5173](http://localhost:5173) (ou a porta indicada pelo Vite).

### Scripts Disponíveis
```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Compila o projeto para produção
npm run lint     # Executa o ESLint
npm run preview  # Inicia um servidor de pré-visualização da build de produção
```

### Frontend
- **Framework**: React 19.1.1 com Vite 7.1.5
- **Linguagem**: TypeScript 5.9.2
- **Estilização**: Material-UI 7.3.2
- **Gerenciamento de Estado**:React Hooks (useState, useContext)
- **Roteamento**: React Router 7.8.2


###Integração com Backend
- **API**: Integração com API RESTful

- **Serviço Externo**: https://blog-dinamico-app.onrender.com

- **Autenticação**: Baseada em token JWT

- **Cliente HTTP**: Axios

## 🛠 Tecnologias Utilizadas

### Frontend
- **Framework:** React 19.1.1 com Vite 7.1.5  
- **Linguagem:** TypeScript 5.9.2  
- **Estilização:** Material-UI 7.3.2  
- **Gerenciamento de Estado:** React Hooks (useState, useContext)  
- **Roteamento:** React Router 7.8.2  

### Integração com Backend
- **API:** Integração com API RESTful  
- **Serviço Externo:** [https://blog-dinamico-app.onrender.com](https://blog-dinamico-app.onrender.com)  
- **Autenticação:** Baseada em token JWT  
- **Cliente HTTP:** Axios  

---

## 🏗 Estrutura do Projeto
```
src/
├── actions/                   # Funções para interagir com a API
├── assets/                    # Arquivos estáticos como imagens e SVGs
├── components/                # Componentes reutilizáveis
│ ├── layout/                  # Componentes de layout (Navbar, Footer)
│ ├── LoginDialog.tsx          # Modal de login/cadastro
│ └── PostCard.tsx             # Card para exibição de posts
├── contexts/                  # Provedores de contexto (Autenticação)
├── hooks/                     # Hooks customizados
├── lib/                       # Configuração de clientes (axios)
├── pages/                     # Páginas da aplicação
│ ├── PostCreateEditPage.tsx   # Página de criação/edição de posts
│ ├── PostDetailPage.tsx       # Página de detalhes de um post
│ └── PostPage.tsx             # Página principal com os posts
├── routes/                    # Definição de rotas
├── theme/                     # Configuração do temA
├── types/                     # Definições de tipos TypeScript
├── App.tsx                    # Componente principal com as rotas
└── main.tsx                   # Ponto de entrada da aplicação
```

## 🎯 Papéis e Funcionalidades

### 👥 Visitantes
- Navegar e ler todos os posts.  
- Buscar por conteúdo.  
- Experiência de leitura responsiva.  

### 👨‍🏫 Professores (Autenticados)
- Todas as funcionalidades de visitante.  
- Criar novos posts educacionais.  
- Editar e excluir seus próprios posts.  
- Acesso a ferramentas de gerenciamento de posts.  

---

## 🚀 Implantação

A aplicação pode ser implantada em várias plataformas que suportam aplicações baseadas em Vite/React:

- **Vercel** (Recomnendado)
- **Netlify**
- **AWS Amplify**
- **Docker**

### Guia rápido de Contribuição

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
6. 
## 🔒 Segurança

- 🛡️ **Autenticação JWT** - Autenticação segura baseada em token.
- 🔐 **Validação de Entradas** - Proteção contra XSS e outras vulnerabilidades.
- 🚫 **Configuração de CORS** - Acesso controlado à API.

## 📝 Licença

This project is part of the FIAP Tech Challenge Phase 3.

<div align="center">
  <p><strong>Built with ❤️ for educators worldwide</strong></p>
  <p>FIAP Tech Challenge - Phase 3 | 2024</p>
</div>








