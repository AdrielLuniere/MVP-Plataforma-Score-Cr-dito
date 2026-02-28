# Vanguard Credit 🛡️ | European Credit Scoring Platform

![Build Status](https://img.shields.io/badge/status-BETA%20/%20MVP-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Compliance](https://img.shields.io/badge/compliance-GDPR%20Ready-green)

> [!WARNING]
> **Aviso de Fase de Desenvolvimento**: Este sistema encontra-se atualmente em **Fase de MVP (Produto Mínimo Viável) e Testes Beta**. Certas funcionalidades de integração real com bancos (Open Banking) estão simuladas e o sistema não deve ser utilizado para decisões financeiras reais sem auditoria prévia.

## 🌟 Visão Geral

Vanguard Credit é uma solução Fullstack moderna para cálculo de pontuação de crédito (0-1000) baseada em padrões financeiros da União Europeia. O foco central é a **Transparência (Explicabilidade)** e a **Segurança de Dados (Privacy by Design)**.

## 🚀 Funcionalidades Principais

### ✅ Frontend (UI Premium)

- **Dashboard Dinâmico**: Visualização de score com indicadores de risco animados.
- **Histórico de Score**: Gráficos de evolução temporal (Recharts).
- **Simulador Interativo**: Projete mudanças no seu score ajustando variáveis financeiras.
- **Painel Admin**: Interface para ajuste de pesos do algoritmo e estatísticas globais.

### ⚙️ Backend (API de Alta Segurança)

- **Motor de Score Determinístico**: Cálculo baseado em múltiplos fatores com explicações detalhadas.
- **Segurança Bancária**: Criptografia AES-256 para dados sensíveis em repouso.
- **Gestão GDPR**: Fluxo completo de consentimento, exportação e exclusão de dados.
- **Open Banking Mock**: Simulação de sincronização automática via PSD2.

## 🛠️ Stack Tecnológica

- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL.
- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts.
- **Infraestrutura**: Docker & Docker Compose.

## 🏁 Como Rodar (Quick Start)

### Opção A: Docker (Recomendado)

Certifique-se de ter o Docker instalado e rode na raiz do projeto:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend/Docs: `http://localhost:3000/api-docs`

### Opção B: Manual

1. **Configurar .env**: Verifique as variáveis de banco de dados no arquivo `.env`.
2. **Backend**: `npm install && npm run prisma:migrate && npm run dev`
3. **Frontend**: `cd frontend && npm install && npm run dev`

---

## ⚖️ Isenção de Responsabilidade

Esta plataforma é uma demonstração técnica. As pontuações geradas são baseadas em algoritmos internos simulados e podem não refletir o score real de agências como Experian, Equifax ou órgãos locais europeus.

Desenvolvido por **Adriel Luniere** 🇪🇺💸
