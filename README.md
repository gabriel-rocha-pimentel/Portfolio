# Portfolio

Este é um projeto de portfólio pessoal desenvolvido utilizando React, React Router, Context API, Supabase e Tailwind CSS, com deploy automatizado via Vercel.

## 🚀 Tecnologias Utilizadas

* React
* React Router DOM
* Context API
* Supabase
* Tailwind CSS
* Vite
* Vercel

## 📂 Estrutura de Pastas

```
portfolio/
├── .gitignore
├── .nvmrc
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
├── public/
│   └── .htaccess
├── src/
│   ├── App.jsx
│   ├── assets/
│   │   └── .gitkeep
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Header.jsx
│   │   ├── shared/
│   │   │   └── CardProjeto.jsx
│   │   └── ui/
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── textarea.jsx
│   │       ├── toast.jsx
│   │       └── toaster.jsx
│   │       └── use-toast.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── Contato.jsx
│   │   ├── Home.jsx
│   │   ├── Projetos.jsx
│   │   ├── Sobre.jsx
│   │   └── admin/
│   │       ├── CriarUsuario.jsx
│   │       ├── EsqueciSenha.jsx
│   │       ├── Login.jsx
│   │       └── dashboard/
│   │           ├── Configuracoes.jsx
│   │           ├── Index.jsx
│   │           ├── Perfil.jsx
│   │           ├── Projetos.jsx
│   │           └── RedesSociais.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

## ✨ Funcionalidades

* **Navegação pública**: Home, Sobre, Projetos e Contato.
* **Administração**: Sistema de login, recuperação de senha e painel administrativo protegido.
* **Dashboard**: Administração de perfil, configurações, redes sociais e projetos.
* **Autenticação**: Implementada com Context API e Supabase.
* **UI**: Componentes estilizados com Tailwind CSS, com suporte a temas claro e escuro.

## 🛠️ Como rodar o projeto

1. Clone o repositório:

```bash
git clone <url-do-repositório>
cd portfolio
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente do Supabase.

4. Rode o projeto:

```bash
npm run dev
```

5. Acesse via: [http://localhost:5173](http://localhost:5173)

## 🖥️ Deploy

* O deploy é realizado automaticamente via Vercel com o arquivo `vercel.json` configurado.

## 🎨 Estilo

* Estilo clean e moderno com Tailwind CSS.
* Efeitos visuais: glassmorphism e background sutil.
* Responsivo e com suporte a temas claro/escuro.

## 🔒 Autenticação

* Utiliza Supabase para autenticação e gerenciamento de usuários.
* Rotas protegidas com `ProtectedRoute`.

## 🤝 Contribuição

Sinta-se à vontade para abrir issues e pull requests.

## 📝 Licença

Este projeto está sob a licença MIT.

---

Feito com ❤️ por Gabriel Rocha.
