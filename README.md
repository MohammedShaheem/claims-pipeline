#  Claim Processing Pipeline (FastAPI + React + AWS)

A full-stack application for processing claim documents (PDF) using a **FastAPI backend**, **React frontend**, **AWS S3 storage**, and a modular **graph-based processing pipeline**.

---

##  Features

*  Upload claim documents (PDF)
*  React-based frontend UI
*  Store files securely in AWS S3
*  Graph-based processing pipeline
*  Modular agents for document analysis
*  FastAPI high-performance APIs
*  Environment-based configuration

---

##  Project Structure

```id="b6cs4o"
CLAIM-PIPELINE/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/routes/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── core/
│   │   ├── graph/
│   │   ├── agents/
│   │   ├── nodes/
│   │   └── utils/
│   │
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   └── claim-pipeline/
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── services/
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── public/
│       ├── index.html
│       └── vite.config.js
```

---

##  Application Flow

```id="rntkva"
React Frontend
   ↓
API Call (axios)
   ↓
FastAPI Backend
   ↓
Route Layer
   ↓
Service Layer
   ↓
S3 Upload (boto3)
   ↓
Graph Processing Engine
   ↓
Agents + Nodes
   ↓
Processed Response
   ↓
Frontend UI
```

---

##  Backend Setup (FastAPI)

###  Navigate to Backend

```bash id="s8u1up"
cd backend
```

---

###  Create Virtual Environment

```bash id="rmq1r5"
python -m venv env
source env/bin/activate     # Linux/Mac
env\Scripts\activate        # Windows
```

---

###  Install Dependencies

```bash id="ljy7r9"
pip install -r requirements.txt
```

---

###  Configure Environment Variables

Create `.env` file:

```env id="rz2r83"
GROQ_API_KEY=your_api_key

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_bucket_name
```

---

### 5️ Run Backend Server

```bash id="gnhfhi"
uvicorn app.main:app --reload
```

---

##  Frontend Setup (React + Vite)

###  Navigate to Frontend

```bash id="6m7n4y"
cd frontend/claim-pipeline
```

---

###  Install Dependencies

```bash id="pjmt30"
npm install
```

---

###  Configure API Base URL

Update your API config:

```javascript id="9v4p4u"
// src/api/api.jsx
const API = axios.create({
  baseURL: "http://localhost:8000",
});
```

---

###  Run Frontend

```bash id="wyi1ie"
npm run dev
```

Frontend runs at:

```id="d0u6dp"
http://localhost:5173
```

---

##  API Endpoint

###  Process Claim

**POST** `/api/claims/process`

#### Request:

* `claim_id` → string
* `file` → PDF (multipart/form-data)

---

## ☁️ AWS S3 Integration

* Files uploaded using **boto3**
* Stored in:

```id="c2bg92"
s3://<bucket-name>/claims/<unique-file>.pdf
```

---

##  Deployment (AWS)

###  Backend Deployment (EC2)

1. Launch EC2 instance (Ubuntu)
2. Install Python & dependencies
3. Clone repo:

```bash id="lg94gh"
git clone <repo-url>
cd backend
```

4. Setup `.env`
5. Run:

```bash id="c5g2rm"
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

###  Frontend Deployment

Build React app:

```bash id="9rtf21"
npm run build
```

Deploy using:

* Nginx (recommended)
* OR serve static files via EC2

---

###  Nginx Reverse Proxy (Example)

```nginx id="qk3eqi"
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/frontend;
        index index.html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

---

##  Best Practices

* Never commit `.env`
* Use IAM roles in production
* Restrict S3 permissions
* Enable HTTPS (SSL)

---

##  Tech Stack

### Backend:

* FastAPI
* Pydantic
* boto3 (AWS S3)

### Frontend:

* React (Vite)
* Axios

### Cloud:

* AWS EC2
* AWS S3
* Nginx


---

##  Author

**Shaem**

---

##  License

For educational and demo purposes.
