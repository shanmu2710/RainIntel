# RainIntel — Rainwater Harvesting Assessment & Analytics Platform

## 1. Project Overview
RainIntel is an advanced full-stack enterprise GIS and analytics platform designed to evaluate, plan, and optimize rainwater harvesting (RWH) potential across municipal and rural structures. Pairing a modern React-based GIS dashboard with secure Java Spring Boot microservices and Oracle Database 21c XE spatial mappings, RainIntel enables field engineers and administrative authorities to log structure details, compute precise runoff potentials, and visualize data geographically.

## 2. Problem Statement
Rapid urbanization and climate volatility have intensified municipal water scarcity. Effective rainwater harvesting requires accurate on-site structural auditing (catchment areas, roof conditions, runoff coefficients) alongside regional soil permeability and historical rainfall patterns. There is a lack of integrated systems that bridge the gap between field assessments, GIS spatial analytics, and robust transactional backends. RainIntel solves this by providing a unified workflow for Field Engineers, District Admins, and Super Admins.

## 3. Project Objectives
- **GIS-Enabled Audits:** Seamlessly log physical structures and determine geographic location constraints.
- **Microservices Architecture:** Ensure scalable, modular development for user authentication, business operations, and metadata configuration.
- **RWH Calculation Engine:** Automate precise calculations of harvesting potential based on catchment size, runoff type, and rainfall indexes.
- **Oracle Spatial Integration:** Maintain highly structured relational models mapping districts, soils, and structures securely.
- **Role-Based Workflows:** Establish separate dashboards and capabilities for Field Engineers, District Admins, and Super Admins.

## 4. System Architecture
RainIntel is designed using a cloud-native microservices architecture on the backend, communicating through an API Gateway, and a single-page React application on the frontend:

```
[React Frontend] (Port 5173)
       │
       ▼
[API Gateway] (Port 8080)
       ├──► [Auth Service] (Port 8081) ──► JWT Validation
       └──► [Business Service] (Port 8082) ──► JPA & Business Logic ──► [Oracle 21c XE]
                                                                               ▲
                                                                               │
[Eureka Service Registry] (Port 8761) ◄────────────────────────────────────────┤
[Spring Cloud Config Server] (Port 8888) ◄─────────────────────────────────────┘
```

## 5. Frontend Technology
- **React 18 & Vite:** Fast development, hot module reloading, and lightweight production builds.
- **Leaflet & React-Leaflet:** GIS and geographic rendering of district boundaries and soil grid datasets.
- **Lucide React:** Icon library for dashboards.
- **Three.js & React Three Fiber:** Architectural mockups and future 3D pipe planning modules.
- **Vanilla CSS:** Highly optimized, fluid layouts, modern dark modes, and premium animations.

## 6. Backend Technology
- **Java 17 & Spring Boot 3:** Primary microservices runtime.
- **Spring Cloud Netflix Eureka:** Service registration and service discovery.
- **Spring Cloud Gateway:** API Gateway routing, request forwarding, and centralized security.
- **Spring Cloud Config:** Centralized configuration management using a native/Git repository.
- **Spring Security & JWT:** Role-based access control (RBAC) and stateless request authentication.
- **Spring Data JPA & Hibernate:** High-performance ORM database mapping.

## 7. Oracle Database
- **Oracle Database 21c XE:** Relational storage engine.
- **Key Schemas:** `ROLES`, `USERS`, `RAINFALL_DISTRICTS`, `RAINFALL_RECORDS`, `SOIL_SOURCES`, `SOIL_GRID_CELLS`, `SOIL_TEXTURE_CLASSES`, `SOIL_DEPTH_CLASSES`, `SOIL_GRID_DATA`, and `ASSESSMENTS`.
- **Integrations:** Sequence generators, primary/foreign key mappings, performance indexes, and database-level constraints.

## 8. GIS (Geographic Information Systems)
- Spatial resolution maps are backed by standard `EPSG:4326` geographic projections.
- Python tools handle coordinates transformations to projected Coordinate Reference Systems (Albers Equal Area) to identify spatial soil grid columns and rows (using a 5000m resolution cell grid).
- Frontend visualizes interactive geoJSON vectors representing Indian district boundaries.

## 9. AI/ML Status
- Active assessment pipeline for calculating departure indexes.
- Future roadmap includes predictive ML models forecasting seasonal rainfall anomalies and optimizing pipe network structural planning.

---

## 10. Team Members & Responsibilities
Every member contributes across all layers (Frontend, Backend, Database) but holds primary ownership of specific project areas:

### SHANMU (GitHub: `shanmu2710` | Email: `s.k.m.shanmugapriya@gmail.com`)
* **Role:** Frontend / UI / User Experience Primary Owner
* **Primary Areas:** React UI, Dashboards (Field Engineer, District Admin, Super Admin), Assessment & Results forms/reporting, GIS mapping layout, Responsive styling.
* **Secondary Areas:** DTO mapping, endpoint integration, database-driven visual UI components, validation logic.

### DHANYA (GitHub: `dhanyaravikumar` | Email: `dhanyaravikumar06@gmail.com`)
* **Role:** Backend / API / Server Logic Primary Owner
* **Primary Areas:** Spring Boot Services, REST controllers, Authentication & JWT, Role-Based Access Control, API security, RWH calculation calculations, API validation, service testing.
* **Secondary Areas:** JPA entities, repository mapping, frontend integration support, error page rendering.

### ASMA (GitHub: `asmasaedhiya18` | Email: `asmatsi1806@gmail.com`)
* **Role:** Database / Data / Database Integration Primary Owner
* **Primary Areas:** Oracle schema creation, constraints, index tuning, district/rainfall/soil data imports, SQL queries optimization, JPA Query integrations, test data scripts.
* **Secondary Areas:** Admin data tables UI, backend repository query writing, database integration tests.

---

## 11. Branch Structure
The repository maintains a strict branching policy to isolate development features:
- **`main`**: The stable production integration branch. No direct commits allowed.
- **`feature/shanmu`**: Shanmu's primary development branch.
- **`feature/dhanya`**: Dhanya's primary development branch.
- **`feature/asma`**: Asma's primary development branch.

## 12. Work Distribution Targets
- **Shanmu:** Frontend ~50% | Backend ~30% | Database ~20%
- **Dhanya:** Frontend ~25% | Backend ~50% | Database ~25%
- **Asma:** Frontend ~25% | Backend ~25% | Database ~50%

*Note: Workload targets represent focus areas and active collaborations, not artificial commit quantity benchmarks.*

---

## 13. Installation Instructions
Ensure the following are installed locally:
- Node.js (v20 or higher)
- Java SE Development Kit (JDK 17 or higher)
- Apache Maven (v3.8 or higher)
- Python 3.10+ (for data hydration scripts)
- Oracle Database 21c XE (running locally on port 1521)

## 14. Frontend Setup
1. Open a terminal in the project root folder.
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development build to check for errors:
   ```bash
   npm run build
   ```

## 15. Backend Setup
1. Navigate to the backend directory.
2. Compile and package the microservices using the Maven wrapper:
   ```bash
   cd backend/service-registry && .\mvnw clean compile
   cd ../config-server && .\mvnw clean compile
   cd ../api-gateway && .\mvnw clean compile
   cd ../auth-service && .\mvnw clean compile
   cd ../business-service && .\mvnw clean compile
   ```

## 16. Oracle Setup
1. Start your local Oracle Database instance.
2. Create the user `RAININTEL` and grant appropriate privileges (`CONNECT`, `RESOURCE`, `CREATE VIEW`, `UNLIMITED TABLESPACE`).
3. Set your environment password (`$env:ORACLE_PASSWORD` or `export ORACLE_PASSWORD`).
4. Install Python dependencies:
   ```bash
   pip install oracledb shapely pyproj
   ```
5. Navigate to the `/database` directory and run the initialization script:
   ```bash
   python create_app_tables.py
   ```
6. Hydrate geographical data and imports:
   ```bash
   python soil_importer.py
   python rainfall_importer.py
   ```

## 17. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
ORACLE_USERNAME=RAININTEL
ORACLE_PASSWORD=your_password
ORACLE_SERVICE=xe
JWT_SECRET=your_jwt_secret_key_minimum_256_bits
```
*Note: Do not commit `.env` files to Git.*

## 18. Running the Project
To run the full stack environment concurrently, execute the PowerShell launcher script:
```powershell
.\run_rainintel.ps1
```
This launches:
- Eureka Discovery Server (http://localhost:8761)
- Configuration Server (http://localhost:8888)
- API Gateway (http://localhost:8080)
- Auth Service (http://localhost:8081)
- Business Service (http://localhost:8082)
- React Frontend (http://localhost:5173)

---

## 19. Git Workflow
- Always start your task on your designated developer branch (`feature/shanmu`, `feature/dhanya`, `feature/asma`).
- Commit messages should be clear and follow conventional syntax:
  - `feat(frontend): improve assessment form layout`
  - `feat(api): implement JWT token verification`
  - `feat(database): index spatial lookup query`
- Verify builds locally before pushing:
  - Frontend: `npm run build`
  - Backend: `.\mvnw clean compile`

## 20. Pull Request Workflow
1. Push your branch commits to the remote:
   ```bash
   git push origin feature/<your_name>
   ```
2. Navigate to the GitHub repository (https://github.com/shanmu2710/RainIntel.git) and open a Pull Request (PR) from your feature branch to `main`.
3. Fill out the PR template, referencing changes made.
4. Obtain a code review from other team members.
5. Merge the PR into `main` using standard merge options (no force pushes, no history rewrites).