# API Template 

### Tech Stack

- NodeJS v22.9.0 (Tested) Or higher
- MongoDB (For Mongo Only)
- Express framework
- typescript
- tystring (Dependency Injections)
- class-validator/class-transformer (validator & transform)
- reflect-metadata save and read metadata/type transform (dependency injection, decorator, atau class-transformer/validation)

## Installation

copy `.env-example` and rename to `.env` 

```
MONGODB_URL=
PORT=3000
```

Create database name example `db_test`

Install dependency
```
npm install
```

### Development

Start App

```
npm run dev
```

### Production

Build Code

```
npm run build
```

Start App

```
npm run start
```
### Docker

Build to Image
```
docker build -t ts-clean-arc  .   
```

Run Container
```
docker run -p 3000:3000 ts-clean-arc 
```

### Jess Unit Test

// belum


# 🧱 Clean Architecture Project Structure

Struktur ini mengikuti prinsip **Clean Architecture** agar mudah di-maintain, scalable, dan terorganisir secara jelas.

![Alt Text](./clean-arch.jpg)
---

## 🧭 Clean Architecture Layer

| Layer   | Nama                          | Tugas                                      |
|---------|-------------------------------|--------------------------------------------|
| Layer 1 | External Interfaces           | DB, UI, HTTP, Device, External APIs        |
| Layer 2 | Interface Adapters            | Controller, Presenter, Gateway             |
| Layer 3 | Application Business Rules    | Use cases                                  |
| Layer 4 | Enterprise Business Rules     | Entities, schema, repository interface     |

---

## 📦 Layer 1: External Interfaces (DB, Device, Web, UI)

Interface ke dunia luar — UI, HTTP, DB, File System, dan External Services.
```
📁 infrastructure/
├── 📁 databases/ # Mongo, SQL, Redis, etc.
├── 📁 filesystem/ # File access, upload/download
├── 📁 logger/ # Logger (e.g., Winston)
├── 📁 message-broker/ # RabbitMQ, Kafka, etc.
├── 📁 services/ # External APIs (Midtrans, etc.)

📁 modules/user/
├── 📁 repositories/ # extend class abstract yang bergantung pada database

```

## 🧭 Layer 2: Interface Adapters (Controllers, Gateways, Presenters)

Mengatur komunikasi antara layer luar dan use cases.
```
📁 presentation/ (global)
├── 📁 grpc/ # Device Input (gRPC request handlers)
├── 📁 http/
│ ├── 📁 middleware/ # (global) Request pre-processing (auth, logging, etc.)
│ ├── 📁 response/ # (global)  response formatting
│ ├── 📁 routes/ # (global) Entry points (HTTP routes)
│ ├── 📁 type/ # (global) HTTP request/response types

📁 modules/user/
├── 📁 controllers/ # HTTP/gRPC controller: terima request, panggil use case
├── 📁 transformers/ # Format response ke client (Presenter)
├── 📁 routes/ # Define routes untuk module (Router)

```

## ⚙️ Layer 3: Application Business Rules (Use Cases)

Logika aplikasi yang menjawab *what to do* berdasarkan kebutuhan user.
```
📁 modules/user/
├── 📁 usecases/ # Business logic / Application service

```

## 🧠 Layer 4: Enterprise Business Rules (Entities)

Domain model yang mewakili core logic murni (terlepas dari teknologi).
```
📁 modules/user/
├── 📁 domain/ # Entity & domain logic
├── 📁 schema/ # Struktur data yang digunakan oleh database
├── 📁 dtos/ # Data Transfer Object (validasi dan data shape)

```

## 🔗 Shared Layer (Global Utilities)

Digunakan lintas layer, tanpa ketergantungan ke satu domain/module tertentu.
```
📁 shared/
├── 📁 errors/ # Global error classes
├── 📁 types/ # Shared types/interfaces
├── 📁 constants/ # Global constants
├── 📁 utils/ # Helper functions
```

### Thank You 

### Author

Ginanjar Dwi Putranto

- [Gitlab](https://gitlab.com/genjerdotkom)
- [LinkedIn](https://www.linkedin.com/in/ginanjar-putranto-0416a913b/)