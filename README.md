# 📊 Painel de Investimentos CAIXA

Sistema de gerenciamento de investimentos desenvolvido com Angular 19, seguindo o Design System da CAIXA.

## 🎯 Sobre o Projeto

Aplicação completa para simulação e acompanhamento de investimentos, com diferentes perfis de risco (Conservador, Moderado e Agressivo).

## 🚀 Tecnologias Utilizadas

- **Angular 19** - Framework principal
- **TypeScript** - Linguagem de programação
- **Angular Material** - Biblioteca de componentes UI
- **NGX-Charts** - Biblioteca para gráficos
- **RxJS** - Programação reativa
- **SCSS** - Estilização avançada

## 💡 Funcionalidades

- ✅ Login com autenticação
- ✅ Seleção de perfil de investidor (Conservador, Moderado, Agressivo)
- ✅ Dashboard personalizado por perfil
- ✅ Gráfico de distribuição de ativos (Pizza/Donut)
- ✅ Resumo financeiro em tempo real
- ✅ Simulador de investimentos com cálculo de rendimentos
- ✅ Recomendações personalizadas de produtos
- ✅ Histórico de investimentos
- ✅ Design responsivo (Mobile-first)
- ✅ Seguindo Design System CAIXA

## 🎨 Design System

Projeto desenvolvido seguindo fielmente o **Design System CAIXA**, incluindo:
- Paleta de cores 
- Tipografia padronizada
- Espaçamentos consistentes
- Componentes reutilizáveis
- Acessibilidade

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório (ou extraia o ZIP)

2. Instale as dependências:
npm install

text

3. Execute o projeto:
ng serve

text

4. Acesse no navegador:
http://localhost:4200


## 👤 Usuários de Teste

### Login Tradicional
- **Email**: qualquer@email.com
- **Senha**: qualquer senha com 6+ caracteres

### Perfis de Teste (Acesso Rápido)
- **Conservador** - Risco Baixo (Cliente ID: 3)
- **Moderado** - Risco Médio (Cliente ID: 1)
- **Agressivo** - Risco Alto (Cliente ID: 2)

## 📁 Estrutura do Projeto

painel-investimentos/
├── src/
│ ├── app/
│ │ ├── auth/ # Módulo de autenticação
│ │ │ ├── login/
│ │ │ └── profile-selector/
│ │ ├── dashboard/ # Dashboard principal
│ │ │ └── investiment-simulator/
│ │ ├── interceptors/ # Mock API
│ │ ├── models/ # Interfaces/Models
│ │ └── services/ # Services
│ ├── styles.scss # Estilos globais
│ └── ...
├── angular.json
├── package.json
└── README.md


## 📱 Responsividade

O projeto é totalmente responsivo, adaptando-se perfeitamente a:
- 📱 Mobile (< 600px)
- 📱 Tablet (600px - 900px)
- 💻 Desktop (> 900px)

## 🎓 Desenvolvedor

**Bruno Favalli**


## 📝 Licença

Este projeto foi desenvolvido como portfolio pessoal.

---

💙🧡 Desenvolvido com Angular e seguindo o Design System CAIXA