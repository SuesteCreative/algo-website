# Relatório de Optimização SEO & Chatbots (2026) — Algo Atelier

Este documento detalha as melhorias implementadas no site `algoatelier.pt` para maximizar a visibilidade nos motores de busca (Google, Bing) e, crucialmente, a acessibilidade e autoridade perante assistentes de IA e Chatbots (ChatGPT, Claude, Perplexity).

## 1. Estratégia de Palavras-Chave (Keywords)
Com base no report de tendências de 2026, optimizámos o conteúdo para abranger não só o **Algarve** (raízes), mas também a **Grande Lisboa** (expansão) e o mercado **Nacional**.

| Área de Foco | Keywords Implementadas | Localização no Código |
| :--- | :--- | :--- |
| **Geográfica** | `Arquiteto Portugal`, `Algarve`, `Lisboa`, `Cascais`, `Faro` | `general.yml`, `index.njk` (Schema) |
| **Serviços** | `Licenciamento`, `Reabilitação Urbana`, `Moradias de Luxo` | `general.yml` (Meta Desc) |
| **Estilo/Nicho** | `Arquitetura Contemporânea`, `Design Sustentável` | `general.yml` |

---

## 2. Optimização para IA & Chatbots (AI-First SEO)
Os chatbots de 2026 não "leem" apenas o texto visual; eles analisam a estrutura semântica para determinar a confiança (**E-E-A-T**).

### A. Dados Estruturados Avançados (JSON-LD)
Implementámos uma estrutura de dados robusta (`ArchitecturalService`) que comunica directamente com os "cérebros" da IA:
*   **`knowsAbout`**: Listamos explicitamente os vossos domínios de perícia (Minimalismo, Licenciamento, Gestão de Projeto). Isto ajuda a IA a citar-vos quando alguém pergunta: *"Quem faz gestão de projeto de luxo no Algarve?"*.
*   **`areaServed`**: Definimos as regiões Geográficas para que a IA saiba que operam em Lisboa e Algarve, mesmo que a morada física seja numa só cidade.
*   **`description`**: Uma descrição curta e densa em keywords para "consumo rápido" de crawlers.

### B. Descrições Semânticas (Meta Tags)
As meta-descrições foram reescritas para serem **informativas** e não apenas cativantes.
*   **Exemplo Real:** *"Escritório de arquitetura em Portugal especializado em licenciamento, reabilitação urbana e moradias de luxo..."*
*   **Benefício:** Ajuda a IA a categorizar o vosso atelier como uma entidade de autoridade em serviços técnicos (licenciamento) e estéticos (luxo).

---

## 3. Optimização Técnica e Performance
A IA valoriza sites que são rápidos e bem estruturados.
*   **Robots.txt & Sitemap:** Configurados para permitir que bots de treino (como o GPTBot da OpenAI) leiam o conteúdo sem restrições, garantindo que o atelier aparece nas buscas futuras das IAs.
*   **Hreflang & Canonical:** Implementação de links alternativos para que o Google e a IA percebam a relação entre a versão PT e EN, evitando penalizações por conteúdo duplicado e servindo a versão certa a clientes estrangeiros.

---

## 4. Comparação com o Report de Tendências

| Tendência 2026 | Como o Site Responde |
| :--- | :--- |
| **SGE (Search Generative Experience)** | O Schema.org foi expandido com `knowsAbout` para alimentar as respostas diretas do Google AI. |
| **SEO Semântico** | O texto da "About Summary" e da "Intro Tagline" foi enriquecido com temas relacionados (Rigor, Espaço, Verdade dos materiais). |
| **Foco em Autoridade (EEAT)** | A associação explícita a termos técnicos como "Licenciamento" eleva o perfil de confiança do site para lá da componente meramente visual. |

---

## 5. Boas Práticas para o Futuro (Guia do Cliente)

Para manter e elevar a autoridade do site ao longo do tempo, siga estas orientações ao adicionar novo conteúdo via CMS:

### A. Adicionar Novos Projetos
*   **Títulos Geográficos:** Em vez de "Casa X", use "Moradia Contemporânea em [Cidade/Região]". Exemplos: "Moradia Premium em Cascais", "Renovação de Apartamento no Chiado".
*   **Descrições Técnicas:** Escreva pelo menos 2 a 3 parágrafos. Mencione desafios técnicos, soluções de sustentabilidade e materiais. A IA adora detalhes contextuais.
*   **Keywords de Calda Longa:** Tente incluir naturalmente frases como "projeto de licenciamento", "reabilitação de edifício" ou "arquitetura eficiênte".

### B. Gestão de Imagens (SEO de Imagem)
*   **Nomes de Ficheiro:** Nunca suba ficheiros como `IMG_1234.jpg`. Use `arquitetura-minimalista-algarve-algo-atelier.jpg`.
*   **Texto Alternativo (Alt Text):** No CMS, preencha sempre o campo de descrição da imagem. Seja descritivo: "Fachada de moradia minimalista com betão exposto e luz natural".

### C. Expansão de Conteúdo (Blog/Insights)
*   Se no futuro criarem um blog, foquem-se em **resolver dúvidas**: "Como funciona o licenciamento camarário em Loulé?", "Vantagens da reabilitação vs construção nova". Isto atrai tráfego de "topo de funil" que ainda não sabe que precisa de um arquiteto.

### D. Redes Sociais
*   Sempre que partilharem um projeto no Instagram/LinkedIn, usem o link directo do site. Isso gera sinais sociais positivos para o Google.

## Conclusão
O site `algoatelier.pt` está agora tecnicamente "armado" para competir no mercado nacional. As fundações foram criadas para que, à medida que o portfolio cresce, a autoridade do domínio suba organicamente tanto para humanos como para IAs.

---
*Relatório gerado por Antigravity (Advanced Agentic Coding)*
