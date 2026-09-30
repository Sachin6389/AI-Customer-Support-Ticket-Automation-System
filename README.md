


# 🤖 AI Customer Support Ticket Automation System

An AI-powered customer support automation platform that combines **Retrieval-Augmented Generation (RAG)**, **MongoDB Vector Search**, **BM25 keyword retrieval**, **Cross-Encoder reranking**, **LLM-based query understanding**, **tool calling**, **conversation memory**, **ticket/complaint management**, and **human escalation**.

The system is designed to answer customer questions using verified knowledge-base information while also performing operational tasks such as checking order status, checking payment status, searching products, creating complaints, retrieving previous complaints, and escalating complex issues to human support.

---

# 4. ✨ Features

## 🧠 AI Features

* LLM-powered customer support

* Query understanding

* Intent detection

* Query decomposition

* Entity/identifier extraction

* Retrieval-Augmented Generation (RAG)

* MongoDB Vector Search

* Semantic retrieval

* BM25 keyword retrieval

* Hybrid retrieval

* Cross-Encoder reranking

* Grounded response generation

* Conversation memory

* Multi-turn conversations

* Evidence-based responses

## 🗄️ Data Features

MongoDB is used as the primary data platform for:

* Conversation memory

* User sessions

* Vector embeddings

* Knowledge-base documents

* Document metadata

* Customer-support data

* Application/business data

---

# 5. 🧰 Technology Stack

## AI Backend

| Technology            | Purpose                               |

| --------------------- | ------------------------------------- |

| Python                | AI/backend development                |

| FastAPI               | REST API                              |

| LangChain             | LLM/RAG framework                     |

| LangGraph             | Agent/workflow orchestration          |

| Groq                  | LLM inference                         |

| MongoDB               | Primary database                      |

| MongoDB Vector Search | Vector storage and semantic retrieval |

| Sentence Transformers | Text embeddings                       |

| BM25                  | Keyword retrieval                     |

| Cross Encoder         | Result reranking                      |

| PyMongo               | MongoDB integration                   |

| Pydantic              | Data validation                       |

| Pytest                | Testing                               |

| Uvicorn               | ASGI server                           |

### Vector Database

The project uses **MongoDB as the vector database** instead of ChromaDB.

Document embeddings are stored in MongoDB and retrieved using MongoDB's vector-search capabilities.

---

# 6. 🏗️ System Architecture

```text

                         ┌──────────────────────┐

                         │      Customer        │

                         └──────────┬───────────┘

                                    │

                                    ▼

                         ┌──────────────────────┐

                         │    React Frontend    │

                         │  Vite + Tailwind     │

                         └──────────┬───────────┘

                                    │

                                    ▼

                    ┌──────────────────────────────┐

                    │       FastAPI AI Backend     │

                    │                              │

                    │ Query Processing             │

                    │ Intent Detection             │

                    │ Query Decomposition          │

                    │ Agent Workflow               │

                    │ RAG                          │

                    │ Tool Execution                │

                    │ Memory                       │

                    │ Response Generation           │

                    └──────────────┬───────────────┘

                                   │

                ┌──────────────────┼───────────────────┐

                │                  │                   │

                ▼                  ▼                   ▼

       ┌────────────────┐  ┌───────────────┐   ┌──────────────┐

       │ MongoDB Vector │  │   MongoDB     │   │ Node Backend │

       │    Search      │  │ Conversation  │   │ Business APIs│

       │                │  │    Memory     │   └──────┬───────┘

       │ Embeddings     │  │               │          │

       │ Documents      │  │ Sessions      │          │

       │ Metadata       │  │ Messages      │          │

       └────────────────┘  └───────────────┘          │

                                                      │

                              ┌────────────────────────┼──────────────┐

                              │                        │              │

                              ▼                        ▼              ▼

                           Orders                  Payments       Complaints

                              │                        │              │

                              └────────────────────────┼──────────────┘

                                                       │

                                                       ▼

                                              Human Escalation

```

---

## 6.1 🔷 Complete System Architecture

The complete system is organized into five major layers:

Presentation Layer — React + Vite + Tailwind customer interface.

AI Orchestration Layer — FastAPI, LangChain, LangGraph, intent detection, query decomposition, tool routing, and grounded response generation.

Business Service Layer — Node.js/Express APIs for users, orders, payments, products, complaints, and escalation.

Data & Retrieval Layer — MongoDB application data, conversation memory, knowledge documents, embeddings, and MongoDB Vector Search.

External AI Layer — Groq LLM and Sentence Transformer embedding/reranking models.

```text
┌───────────────────────┐
│ CUSTOMER │
│ Web / Chat UI │
└───────────┬───────────┘
│
▼
┌────────────────────────────────────┐
│ FRONTEND - REACT + VITE │
│ │
│ Chat UI | Auth | Tickets | User │
│ React Router | Redux | Axios │
└────────────────┬───────────────────┘
│
HTTP / REST / JSON
│
┌────────────────────┴────────────────────┐
│ │
▼ ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│ FASTAPI AI BACKEND │ │ NODE.JS BACKEND │
│ │ │ │
│ Request Validation │ │ Authentication │
│ Conversation Memory │ │ Users │
│ Query Understanding │ │ Orders │
│ Query Decomposition │ │ Payments │
│ Intent Detection │ │ Products │
│ Entity Extraction │ │ Complaints │
│ Agent / Tool Routing │ │ Escalation │
│ RAG Retrieval │ │ CRUD APIs │
│ Grounded Response │ │ │
└──────────────┬──────────────┘ └──────────────┬──────────────┘
│ │
│ │
├──────────────────┐ │
│ │ │
▼ ▼ ▼
┌──────────────────┐ ┌──────────────────┐ ┌─────────────────────┐
│ RAG / RETRIEVAL │ │ CONVERSATION │ │ BUSINESS OPERATIONS │
│ │ │ MEMORY │ │ │
│ MongoDB Vector │ │ user_id │ │ Order Status │
│ Search │ │ session_id │ │ Payment Status │
│ BM25 │ │ messages │ │ Product Search │
│ Hybrid Retrieval │ │ history │ │ Create Complaint │
│ Cross-Encoder │ │ │ │ Get Complaints │
│ Reranking │ │ MongoDB │ │ Human Escalation │
└────────┬─────────┘ └────────┬─────────┘ └──────────┬──────────┘
│ │ │
└─────────────────────┼───────────────────────┘
▼
┌────────────────────────────────┐
│ MONGODB │
│ │
│ Application Data │
│ Conversation Memory │
│ Knowledge Documents │
│ Document Chunks │
│ Embeddings │
│ Vector Search Index │
│ Orders / Payments / Products │
│ Complaints / Tickets │
└───────────────┬────────────────┘
│
▼
┌────────────────────────────────┐
│ GROUNDED AI RESPONSE │
│ │
│ Query + Memory + Evidence + │
│ Operation Results → Groq LLM │
└───────────────┬────────────────┘
│
▼
┌───────────────┐
│ CUSTOMER │
└───────────────┘
```

## 6.2 🔄 AI Request Processing Flow

Every customer message follows this processing path:

```text
Customer Query
│
▼
FastAPI /api/v1/chat
│
▼
Pydantic Request Validation
│
▼
Load Conversation
(user_id + session_id)
│
▼
Query Processing Agent
│
▼
Query Decomposition
│
├───────────────┐
│ │
▼ ▼
Single Query Multiple Queries
│ │
└───────┬───────┘
▼
Intent Detection
│
▼
Entity / Reference
Extraction
│
▼
Operation Router
│
┌───────┴─────────────────────────┐
│ │
▼ ▼
Knowledge / RAG Business Tools
│ │
▼ ▼
MongoDB Vector + BM25 Node.js Backend APIs
│ │
▼ ▼
Cross-Encoder Reranking Operation Results
│ │
└───────────────┬─────────────────┘
▼
Evidence + Results
│
▼
Grounded Agent
│
▼
Groq LLM
│
▼
Final Response
│
▼
Save Conversation
│
▼
Customer
```

## 6.3 🧩 AI Backend Internal Architecture

```text
FastAPI Application
│
├── API Routes
│ ├── Health
│ ├── Chat
│ └── Documents
│
├── Query Processing
│ ├── Query Decomposer
│ ├── Intent Classifier
│ ├── Entity / Reference Extractor
│ └── Operation Router
│
├── Agents
│ ├── Query Processing Agent
│ └── Grounded Response Agent
│
├── Operations / Tools
│ ├── Knowledge Search
│ ├── Order Status
│ ├── Payment Status
│ ├── Product Search
│ ├── Create Complaint
│ ├── Get User Complaints
│ └── Human Escalation
│
├── Retrieval
│ ├── MongoDB Vector Search
│ ├── BM25
│ └── Cross-Encoder Reranking
│
├── Memory
│ ├── Get Conversation
│ └── Save Conversation
│
└── External Services
├── MongoDB
├── Node.js Backend
├── Groq
└── Embedding / Reranking Models
```

## 6.4 🗃️ MongoDB Data Architecture

MongoDB acts as the central persistence layer for the AI and application system.

```text
MongoDB
│
├── Conversation Data
│ ├── user_id
│ ├── session_id
│ └── messages[]
│
├── Knowledge Base
│ ├── document chunks
│ ├── content
│ ├── metadata
│ └── file information
│
├── Vector Data
│ ├── embeddings
│ └── vector-search index
│
└── Business Data
├── users
├── orders
├── payments
├── products
├── complaints
└── tickets / escalation data
```

## 6.5 📄 Document Ingestion Architecture

Knowledge-base documents are converted into searchable vector data before being used by the RAG pipeline.

```text
PDF / TXT / JSON / CSV / XLSX / DOCX / Markdown
│
▼
Document Loader
│
▼
Text Extraction
│
▼
Chunking
│
▼
Sentence Transformer
Embedding Model
│
▼
Embeddings
│
▼
MongoDB
┌──────────┴──────────┐
│ │
Text Chunks Vector Embeddings
│ │
└──────────┬──────────┘
▼
Vector Search Index
│
▼
Ready for RAG
```

## 6.6 🔎 Hybrid Retrieval Architecture

The retrieval layer uses semantic and lexical search together.

```text
USER QUERY
│
┌────────────┴────────────┐
│ │
▼ ▼
Query Embedding Query Tokens
│ │
▼ ▼
MongoDB Vector Search BM25 Search
│ │
└────────────┬────────────┘
▼
Hybrid Candidates
│
▼
Cross-Encoder Reranker
│
▼
Relevance Scoring
│
▼
Top Evidence Chunks
│
▼
Grounded Prompt
│
▼
Groq LLM
│
▼
Grounded Answer
```

## 6.7 🛠️ Business Tool Architecture

Operational requests are routed from the AI backend to the Node.js business backend.

```text
AI Intent
│
├── ORDER_STATUS ───────────────► Order API
│
├── PAYMENT_STATUS ─────────────► Payment API
│
├── PRODUCT_SEARCH ─────────────► Product API
│
├── CREATE_COMPLAINT ───────────► Complaint API
│
├── GET_COMPLAINTS ─────────────► Complaint Query API
│
└── HUMAN_ESCALATION ───────────► Escalation API
│
▼
Human Support
```

Each tool returns structured operation results to the AI backend. The grounded response layer uses those results as the source of truth and should not invent business information.

## 6.8 🧠 Grounded Response Architecture

```text
Original User Query
+
Conversation History
+
Retrieved Evidence
+
Business Operation Results
+
Escalation Information
│
▼
Grounded Response Agent
│
▼
Groq
│
▼
Final Customer Response
│
├── Answer
├── Evidence
├── Ticket / Token Information
└── Human Escalation Status
```

The grounded response stage is intentionally separated from retrieval and tool execution so that the final LLM response is based on verified evidence and structured operation results.

## 6.9 🔐 Error and Escalation Architecture

```text
Customer Request
│
▼
AI Processing
│
▼
Tool / Retrieval Execution
│
┌───┴────┐
│ │
Success Failure
│ │
▼ ▼
Result Retry / Clarify
│ │
│ └──────────────┐
│ ▼
│ Human Escalation
│ │
└──────────────┬────────┘
▼
Grounded Response
│
▼
Save Conversation
```

The architecture is designed to avoid fabricating order, payment, complaint, product, or knowledge-base information when a retrieval or business operation fails.

---

**# 7. 🔄 Application Workflow

```text

Customer Query

      │

      ▼

React Frontend

      │

      ▼

FastAPI AI Backend

      │

      ▼

Conversation Memory

      │

      ▼

Query Processing

      │

      ▼

Intent Detection

      │

      ▼

Entity Extraction

      │

      ▼

Query Decomposition

      │

      ▼

Operation Selection

      │

      ├───────────────────┐

      │                   │

      ▼                   ▼

Knowledge Query       Business Query

      │                   │

      ▼                   ▼

MongoDB Vector        Backend Tools

Search + BM25             │

      │                   │

      ▼                   ▼

Cross Encoder          Operation Result

Reranking                  │

      │                   │

      └──────────┬────────┘

                 ▼

          Evidence / Result

                 │

                 ▼

         Grounded Response

                 │

                 ▼

        Save Conversation

                 │

                 ▼

             Customer



             ┌──────────────────────────────────────────────────────────────────────────────┐

│                              CUSTOMER / USER                                 │

│                         Web Browser / Chat Interface                         │

└───────────────────────────────────┬──────────────────────────────────────────┘

                                    │

                              HTTP / REST / JSON

                                    │

                                    ▼

┌──────────────────────────────────────────────────────────────────────────────┐

│                         FRONTEND - REACT + VITE                              │

│                                                                              │

│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────────┐ │

│  │ Chat Interface │ │ Authentication │ │ Ticket Status  │ │ User Profile  │ │

│  └────────────────┘ └────────────────┘ └────────────────┘ └───────────────┘ │

│                                                                              │

│                     Axios / API Communication                               │

└───────────────────────────────┬──────────────────────────────────────────────┘

                                │

                 ┌──────────────┴──────────────┐

                 │                             │

                 ▼                             ▼

┌────────────────────────────────┐   ┌────────────────────────────────────────┐

│       AI BACKEND               │   │          NODE.JS BACKEND               │

│       FastAPI                  │   │          Express                       │

│                                │   │                                        │

│  AI / RAG / Agents / Memory   │   │  Business Logic / CRUD / Auth         │

└───────────────┬────────────────┘   └──────────────────┬─────────────────────┘

                │                                       │

                │                                       │

                ▼                                       ▼

┌──────────────────────────────────────────────────────────────────────────────┐

│                              MONGODB                                        │

│                                                                              │

│ ┌──────────────────┐ ┌──────────────────┐ ┌────────────────────────────────┐│

│ │ Conversation DB  │ │ Knowledge Base   │ │ Vector Search / Embeddings      ││

│ │                  │ │                  │ │                                ││

│ │ user_id          │ │ documents        │ │ embedding vectors              ││

│ │ session_id       │ │ chunks           │ │ vector index                   ││

│ │ messages         │ │ metadata         │ │ semantic search                ││

│ │ history          │ │ embeddings       │ │ similarity search              ││

│ └──────────────────┘ └──────────────────┘ └────────────────────────────────┘│

│                                                                              │

│                 Orders / Payments / Products / Complaints                  │

└──────────────────────────────────────────────────────────────────────────────┘









```

___

---

# 8. 🧠 RAG Architecture

The project uses a **MongoDB-based RAG architecture**.

MongoDB is responsible for storing both the application's persistent data and the vector representations required for semantic retrieval.

## RAG Pipeline

```text

                    Documents

                        │

                        ▼

                 Document Loader

                        │

                        ▼

                  Text Extraction

                        │

                        ▼

                   Text Chunking

                        │

                        ▼

               Sentence Transformer

                  Embedding Model

                        │

                        ▼

                Vector Embeddings

                        │

                        ▼

              ┌─────────────────────┐

              │      MongoDB         │

              │                     │

              │ Documents           │

              │ Embeddings          │

              │ Metadata            │

              └──────────┬──────────┘

                         │

                         │

User Query ──────────────┘

      │

      ▼

Query Embedding

      │

      ├──────────────────────┐

      │                      │

      ▼                      ▼

MongoDB Vector Search     BM25 Search

      │                      │

      └──────────┬───────────┘

                 ▼

           Hybrid Results

                 │

                 ▼

          Cross Encoder

            Reranking

                 │

                 ▼

         Top Relevant Chunks

                 │

                 ▼

          Grounded Prompt

                 │

                 ▼

              Groq LLM

                 │

                 ▼

          Final Response

```

## 8.1 Document Processing

Documents are processed before being added to the knowledge base.

Supported formats include:

```text

PDF

TXT

JSON

CSV

XLSX

DOCX

Markdown

```

The processing pipeline is:

```text

Document

   ↓

Text Extraction

   ↓

Chunking

   ↓

Embedding Generation

   ↓

MongoDB

```

---

## 8.2 MongoDB Vector Storage

Instead of maintaining a separate vector database such as ChromaDB, the project stores document embeddings directly in MongoDB.

Conceptually, a knowledge document can contain:

```json

{

  "content": "Document chunk content...",

  "embedding": [0.0123, -0.0345, 0.0567],

  "metadata": {

    "file_name": "internship-guide.pdf",

    "page": 5,

    "source": "knowledge_base"

  }

}

```

The `embedding` field contains the vector representation of the document chunk.

MongoDB Vector Search can then be used to retrieve semantically similar chunks.

---

# 8.3 Semantic Retrieval

The user's query is converted into an embedding using the configured embedding model.

```text

User Query

     │

     ▼

Embedding Model

     │

     ▼

Query Vector

     │

     ▼

MongoDB Vector Search

     │

     ▼

Relevant Document Chunks

```

This allows the system to retrieve information based on semantic similarity.

---

# 8.4 BM25 Retrieval

The system also uses BM25 keyword retrieval.

BM25 is useful for exact or keyword-heavy queries such as:

```text

Order ID

Payment ID

Product ID

Ticket ID

Technical terms

Exact phrases

File names

```

---

# 8.5 Hybrid Retrieval

The project combines two retrieval approaches:

```text

                 User Query

                     │

            ┌────────┴────────┐

            ▼                 ▼

     MongoDB Vector        BM25 Search

        Search

            │                 │

            └────────┬────────┘

                     ▼

              Combined Results

                     │

                     ▼

             Cross Encoder

               Reranking

                     │

                     ▼

             Final Evidence

```

This approach combines semantic similarity with keyword matching.

---

# 8.6 Cross-Encoder Reranking

Retrieved documents are passed through a Cross-Encoder reranker.

```text

Retrieved Candidates

        │

        ▼

Cross Encoder

        │

        ▼

Relevance Scores

        │

        ▼

Sorted Results

        │

        ▼

Top Evidence

```

Only the most relevant information is passed to the response-generation stage.

---

# 8.7 Grounded Response Generation

The final response is generated using:

```text

User Query

     +

Conversation Context

     +

Retrieved Evidence

     +

Operation Results

     ↓

Groq LLM

     ↓

Grounded Response

```

The purpose of this architecture is to reduce unsupported answers and make responses more closely tied to available evidence.

---

# 9. 🤖 Agent Workflow Architecture

The AI layer separates query understanding from final response generation.

```text
USER QUERY
│
▼
┌─────────────────────┐
│ Query Processing │
│ Agent │
└──────────┬──────────┘
│
▼
Query Decomposition
│
▼
Sub-query Generation
│
┌──────────┴──────────┐
│ │
▼ ▼
Intent Detection Reference Extraction
│ │
└──────────┬──────────┘
▼
Operation Router
│
┌───────────────┼─────────────────┐
│ │ │
▼ ▼ ▼
RAG Business Tools Escalation
│ │ │
▼ ▼ ▼
Evidence Operation Result Escalation Result
│ │ │
└───────────────┼─────────────────┘
▼
┌─────────────────────┐
│ Grounded Response │
│ Agent │
└──────────┬──────────┘
│
▼
Groq LLM
│
▼
Final Response
```

Agent Responsibilities
Component	Responsibility
Query Processing Agent	Understands the request, decomposes complex queries, detects intent, extracts identifiers, and selects operations
Operation Router	Routes each sub-query to RAG or the required business tool
Retrieval Layer	Finds relevant knowledge-base evidence
Business Tools	Execute order, payment, product, complaint, and escalation operations
Grounded Response Agent	Converts verified evidence and operation results into the final customer response
Conversation Memory	Provides previous messages and identifiers for multi-turn context
Multi-Intent Query Flow
For a query containing multiple requests, each sub-query is processed independently and then combined into one response:

```text
"What is my order status and what is your refund policy?"
│
▼
Query Decomposition
│
┌───────────┴───────────┐
▼ ▼
ORDER_STATUS KNOWLEDGE_SEARCH
│ │
▼ ▼
Order Tool MongoDB Vector
│ + BM25
▼ │
Order Result ▼
Reranked Evidence
│ │
└───────────┬───────────┘
▼
Grounded Response
│
▼
Final Answer
```

---

# 10. 🛠️ Tool Documentation

The AI assistant can use backend tools for operational requests.

## Knowledge Search

Uses:

```text

MongoDB Vector Search

+

BM25

+

Cross Encoder

```

to retrieve relevant knowledge-base information.

---

## Order Status

```text

Intent:

ORDER_STATUS

```

Typical required information:

```text

order_id

```

Example:

```text

User:

What is the status of order ORD123?

AI:

→ Extract ORD123

→ Call order-status operation

→ Retrieve order

→ Return status

```

---

## Payment Status

```text

Intent:

PAYMENT_STATUS

```

Typical required information:

```text

payment_id

```

Example:

```text

User:

What is the status of payment PAY123?

AI:

→ Extract PAY123

→ Call payment operation

→ Return payment status

```

---

## Product Search

The product operation can retrieve product information using available product identifiers or search information.

---

## Create Complaint

```text

Intent:

CREATE_COMPLAINT

```

Workflow:

```text

Customer Complaint

        │

        ▼

Intent Detection

        │

        ▼

Required Information

        │

        ▼

Create Complaint API

        │

        ▼

Complaint/Ticket ID

        │

        ▼

Customer Response

```

---

## Get User Complaints

```text

Intent:

GET_COMPLAINTS

```

The system retrieves complaints associated with the customer.

---

## Human Escalation

When the AI cannot safely resolve a request:

```text

AI Processing

      │

      ▼

Unable to Resolve

      │

      ▼

Escalation Tool

      │

      ▼

Escalation Token

      │

      ▼

Human Support

```

---

# 11. 💾 Conversation Memory

MongoDB is also used for **conversation memory**.

The system stores conversation information using identifiers such as:

```text

user_id

session_id

```

A simplified conversation structure can be represented as:

```json

{

  "user_id": "USER_ID",

  "session_id": "SESSION_ID",

  "messages": [

    {

      "role": "user",

      "content": "What is the status of order ORD123?"

    },

    {

      "role": "assistant",

      "content": "Your order is currently processing."

    }

  ]

}

```

## Memory Workflow

```text

User Query

    │

    ▼

user_id + session_id

    │

    ▼

MongoDB

    │

    ▼

Previous Conversation

    │

    ▼

Current Query

    │

    ▼

AI Processing

    │

    ▼

Response

    │

    ▼

MongoDB

```

This enables multi-turn conversations.

---

# 13. 🚀 Installation

## Prerequisites

Install:

* Python 3.11+

* Node.js

* npm

* MongoDB / MongoDB Atlas

* Git

* Groq API key

If MongoDB Vector Search is enabled through MongoDB Atlas, configure the required vector-search index on the collection containing the document embeddings.

---

## Clone Repository

```bash

git clone https://github.com/Sachin6389/AI-Customer-Support-Ticket-Automation-System.git

cd AI-Customer-Support-Ticket-Automation-System

```

---

## AI Backend

```powershell

cd AI-Backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

```

---

## Backend

```powershell

cd Backend

npm install

```

---

## Frontend

```powershell

cd Frontend

npm install

```

---

# 14. 🔐 Environment Variables

## AI Backend

Example:

```env

GROQ_API_KEY=your_groq_api_key

MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net

MONGODB_DB_NAME=ai_customer_support

NODE_BACKEND_URL=http://localhost:5000

CORS_ORIGINS=http://localhost:5173

```

MongoDB is used for:

```text

Application Data

Conversation Memory

Knowledge Documents

Vector Embeddings

Vector Search

```

---

## Node Backend

Example:

```env

PORT=5000

MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database

ACCESS_TOKEN_SECRET=your_access_token_secret

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret

REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

CORS_ORIGIN=http://localhost:5173

```

---

## Frontend

Example:

```env

VITE_AI_BACKEND_URL=http://localhost:8000

VITE_BACKEND_URL=http://localhost:5000

```

---

# 17. ⚠️ Error Handling

The system follows a fail-safe approach for AI and tool operations.

```text

                 Request

                    │

                    ▼

              Query Processing

                    │

                    ▼

              Operation Selection

                    │

          ┌─────────┴─────────┐

          │                   │

        Success              Error

          │                   │

          ▼                   ▼

      Return Result      Error Handling

                              │

                   ┌──────────┼──────────┐

                   │          │          │

                   ▼          ▼          ▼

                Retry    Clarification  Human

                                      Escalation

```

The system should not fabricate order, payment, complaint, or product information when a backend operation fails.

---

# 18. 🚧 Known Limitations

### 1. MongoDB Vector Search Configuration

Vector retrieval depends on correctly configuring the MongoDB vector-search index.

### 2. Retrieval Quality

RAG quality depends on:

* Chunking

* Embeddings

* Vector-search configuration

* BM25 configuration

* Reranking

* Document quality

### 3. Embedding Model Resource Usage

Sentence Transformer embedding models can consume significant RAM/CPU, particularly on low-resource environments.

### 4. LLM Dependency

The quality and availability of generated responses depend on the configured Groq LLM.

### 5. Knowledge Base Freshness

New or modified documents need to be processed and indexed before they become available to RAG retrieval.

### 6. Tool Dependencies

Order, payment, product and complaint operations depend on the Node.js backend and its database.

### 7. Hallucination Risk

RAG and grounding reduce unsupported responses but do not completely eliminate LLM hallucinations.

### 8. Vector Search Scalability

For very large knowledge bases, vector-index configuration, filtering, indexing strategy and query optimization will need further tuning.

---

# 19. 🚀 Future Improvements

## RAG

* Improve MongoDB Vector Search configuration

* Add metadata filtering

* Improve chunking

* Add hybrid retrieval scoring

* Add query expansion

* Add multi-query retrieval

* Improve Cross-Encoder reranking

* Add retrieval evaluation

* Add automated RAG evaluation

* Add document versioning

* Add automatic document re-indexing

## Memory

* Conversation summarization

* Long-term memory

* Memory relevance scoring

* Automatic context compression

* Better session management

## Agents

* Advanced LangGraph workflow

* Planner agent

* Research agent

* Fact-check agent

* Response-validation agent

* Tool-selection confidence

* Automatic retry policies

* Human approval checkpoints

## Support Automation

* Automatic ticket categorization

* Automatic priority detection

* SLA monitoring

* Department routing

* Ticket summarization

* Duplicate complaint detection

* Automatic ticket updates

## Monitoring

Future versions can include:

```text

Query Volume

RAG Accuracy

Retrieval Precision

Tool Success Rate

Average Response Time

Human Escalation Rate

Ticket Resolution Time

LLM Token Usage

API Error Rate

```

---

# 🏁 Architecture Summary

The final architecture is:

```text

                         CUSTOMER

                            │

                            ▼

                    ┌───────────────┐

                    │ React Frontend│

                    └───────┬───────┘

                            │

                            ▼

                    ┌───────────────┐

                    │ FastAPI AI API│

                    └───────┬───────┘

                            │

                            ▼

                  ┌───────────────────┐

                  │ Conversation      │

                  │ Memory - MongoDB  │

                  └─────────┬─────────┘

                            │

                            ▼

                  ┌───────────────────┐

                  │ Query Processing   │

                  │ + Intent Detection │

                  └─────────┬─────────┘

                            │

                            ▼

                  ┌───────────────────┐

                  │ Query Decomposition│

                  └─────────┬─────────┘

                            │

              ┌─────────────┼──────────────┐

              │             │              │

              ▼             ▼              ▼

        MongoDB Vector    BM25          Business

           Search         Search          Tools

              │             │              │

              └──────┬──────┘              │

                     ▼                     │

               Hybrid Results              │

                     │                     │

                     ▼                     │

              Cross Encoder                │

                Reranking                  │

                     │                     │

                     └──────────┬──────────┘

                                ▼

                       Evidence + Results

                                │

                                ▼

                       Grounded Groq LLM

                                │

                                ▼

                       Final AI Response

                                │

                                ▼

                       Save Conversation

                                │

                                ▼

                             CUSTOMER

```

## 🔑 Core Architecture

```text

MongoDB

├── Conversation Memory

├── Knowledge Documents

├── Vector Embeddings

└── Vector Search

RAG

├── MongoDB Vector Search

├── BM25

└── Cross-Encoder Reranking

AI

├── Groq LLM

├── LangChain

└── LangGraph

Backend

├── FastAPI AI Backend

└── Node.js Business Backend

Frontend

└── React + Vite + Tailwind

```

---

# ⭐ Project Highlights

```text

✅ Full-Stack AI Application

✅ Generative AI

✅ Retrieval-Augmented Generation

✅ MongoDB Vector Search

✅ MongoDB Conversation Memory

✅ Hybrid Retrieval

✅ BM25

✅ Cross-Encoder Reranking

✅ LangChain

✅ LangGraph

✅ Groq

✅ AI Agents

✅ Tool Calling

✅ Multi-turn Conversation

✅ Order Status Automation

✅ Payment Status Automation

✅ Product Search

✅ Complaint Creation

✅ Human Escalation

✅ FastAPI

✅ Node.js / Express

✅ React

✅ MongoDB

```

---

# 👨‍💻 Author

**Sachin Gond**

AI/ML Engineer | Generative AI | RAG | Agentic AI | Python | FastAPI | React

GitHub:

https://github.com/Sachin6389

LinkedIn:

https://www.linkedin.com/in/sachin-buildnex/
