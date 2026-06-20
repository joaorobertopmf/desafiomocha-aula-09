# Desafio Mocha — Aula 09

Pipeline de Integração Contínua com GitHub Actions para projeto de testes automatizados com Mocha.

---

## Sobre o Projeto

Serviço de pagamento (`ServicoDePagamento`) com cobertura completa de testes usando **Mocha** e **Node.js assert**. A pipeline de CI garante que todos os testes passem automaticamente a cada mudança no repositório.

---

## Estrutura

```
.
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline GitHub Actions
├── src/
│   └── servicoDePagamento.js   # Código-fonte
├── test/
│   └── servicoDePagamento.test.js  # Testes automatizados
├── mochawesome-report/         # Relatório gerado (ignorado pelo git)
├── package.json
└── README.md
```

---

## Pipeline de CI — GitHub Actions

### Arquivo: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

### Gatilhos (Triggers)

| Gatilho | Descrição |
|---|---|
| `push` | Executa ao fazer push nos branches `main` ou `develop` |
| `pull_request` | Executa em PRs direcionados ao branch `main` |
| `workflow_dispatch` | Execução manual pela interface do GitHub Actions |
| `schedule` | Execução automática todo sábado às 15h BRT (`0 18 * * 6`) |

### Etapas do Job

```
Checkout → Configurar Node.js → npm ci → Executar Testes → Publicar Relatório
```

1. **Checkout**: clona o repositório com `actions/checkout@v4`
2. **Setup Node.js**: configura a versão via `actions/setup-node@v4` com cache de pacotes npm
3. **Instalar dependências**: `npm ci` garante instalação determinística pelo `package-lock.json`
4. **Executar testes**: `npm run test:ci` roda Mocha com o reporter Mochawesome
5. **Publicar artefato**: `actions/upload-artifact@v4` sobe o relatório HTML (executado sempre, mesmo com falha nos testes)

### Relatório de Testes

O reporter **Mochawesome** gera um relatório HTML interativo em `mochawesome-report/`. Na pipeline, esse diretório é armazenado como **artefato** por 30 dias e pode ser baixado diretamente na aba **Actions** do GitHub.

Exemplo de nome do artefato: `relatorio-testes`

---

## Conceitos Utilizados

### GitHub Actions

| Conceito | Aplicação no Projeto |
|---|---|
| **Workflow** | Arquivo `.github/workflows/ci.yml` que define toda a pipeline |
| **Trigger (`on`)** | `push`, `pull_request`, `workflow_dispatch`, `schedule` |
| **Job** | Unidade de execução; aqui o job `testes` |
| **Step** | Cada etapa dentro do job (checkout, setup, test, upload) |
| **Runner** | `ubuntu-latest` — máquina virtual fornecida pelo GitHub |
| **Artifact** | Arquivo persistido após a execução: relatório HTML dos testes |
| **Cron Schedule** | Expressão `0 8 * * 1-5` para agendamento automático |
| **`if: always()`** | Garante publicação do relatório mesmo quando testes falham |


### Testes Automatizados

| Conceito | Aplicação |
|---|---|
| **Mocha** | Framework de testes (BDD/TDD) para Node.js |
| **describe / it** | Agrupamento de suíte e definição de casos de teste |
| **assert (Node built-in)** | Asserções sem biblioteca externa |
| **Testes positivos** | Verificam comportamento esperado com entradas válidas |
| **Testes negativos** | Verificam que exceções são lançadas com entradas inválidas |
| **Mochawesome** | Reporter que gera relatório HTML visual dos resultados |

### Expressão Cron

```
┌───────── minuto (0)
│ ┌─────── hora (18 = 18:00 UTC = 15:00 BRT)
│ │ ┌───── dia do mês (* = qualquer)
│ │ │ ┌─── mês (* = qualquer)
│ │ │ │ ┌─ dia da semana (6 = sábado)
│ │ │ │ │
0 18 * * 6
```

---

## Como Executar Localmente

```bash
# Instalar dependências
npm install

# Rodar testes com saída no terminal
npm test

# Rodar testes e gerar relatório HTML
npm run test:ci
# Relatório disponível em: mochawesome-report/relatorio-testes.html
```

---

## Casos de Teste

### Testes Positivos (6)

| Cenário | Resultado Esperado |
|---|---|
| Pagamento R$ 99,99 | Categoria `padrão` |
| Pagamento R$ 100,00 | Categoria `padrão` |
| Pagamento R$ 100,01 | Categoria `cara` |
| Múltiplos pagamentos | Retorna apenas o último |
| Sem pagamentos | Retorna `undefined` |
| Propriedades armazenadas | Todos os campos corretos |

### Testes Negativos (10)

| Campo | Cenário Inválido | Erro Lançado |
|---|---|---|
| `codigoBarras` | vazio, null, undefined, só espaços | `Código de barras inválido` |
| `empresa` | vazia, null | `Empresa inválida` |
| `valor` | zero, negativo, NaN, string | `Valor inválido` |
| — | sem argumentos | `Código de barras inválido` |

---

## Tecnologias

- **Node.js** — runtime JavaScript
- **Mocha v11** — framework de testes
- **Mochawesome** — gerador de relatório HTML
- **GitHub Actions** — plataforma de CI/CD
