# Ask My Docs (RAG)

A Retrieval-Augmented Generation (RAG) system that allows users to upload PDFs and ask questions, returning answers with page-level citations.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB
- **Vector DB:** Qdrant
- **LLM & Embeddings:** Groq for answers and Jina for embeddings
- **Frontend:** React, Vite, Tailwind CSS

## Run locally

Requirements: Node.js 20.19+ and Docker Desktop.

1. Start MongoDB and Qdrant from the project root:

   ```sh
   docker compose -f docker-compose.dev.yml up -d mongo qdrant
   ```

2. Copy `backend/.env.example` to `backend/.env` and add your Jina and Groq API keys. Use a long, random value for `JWT_SECRET`.

3. In one terminal, start the API:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

The API connects to MongoDB, creates the Qdrant collection and per-user search index, then listens on port 5000. The example Mongo URI uses the local Docker MongoDB service. Set it to your hosted MongoDB connection string if you want to use your cluster instead.

4. In another terminal, start the web app:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

   Open the local Vite address printed in the terminal. The development server forwards `/api` requests to port 5000.

PDF uploads require a readable, text-based PDF (up to 20 MB). Scanned image-only PDFs need OCR, which is not included. Registration, login, session restore, and logout require MongoDB. PDF indexing also requires Qdrant and a valid Jina API key; document-grounded chat additionally requires a valid Groq API key.
