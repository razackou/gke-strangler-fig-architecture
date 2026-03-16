# Kubernetes Application Modernization on GKE

## From Monolith to Microservices – Architecture Patterns & Production Readiness

A decision-oriented architectural case study on migrating a Node.js monolith to a polyglot (FastAPI/Node.js) microservices environment on GKE using the Strangler Fig pattern.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Initial Architecture (Monolith)](#3-initial-architecture-monolith)
4. [Target Architecture (Microservices on GKE)](#4-target-architecture-microservices-on-gke)
5. [Migration Strategy](#5-migration-strategy-strangler-fig-pattern)
6. [Implementation Details: Polyglot Microservices](#6-implementation-details-polyglot-microservices)
7. [Key Architectural Decisions](#7-key-architectural-decisions)
8. [Observability and Day-2 Operations](#8-observability-and-day-2-operations)
9. [Tradeoffs and Limitations](#9-tradeoffs-and-limitations)
10. [Improvements and Next Steps](#10-improvements-and-next-steps)
11. [Evidence and Screenshots](#11-evidence-and-screenshots)
12. [Key Takeaways](#12-key-takeaways)
13. [Technologies Stack](#13-technologies-stack)
14. [Target Audience](#14-target-audience)
15. [License](#15-license)

---

## 1. Executive Summary

This repository demonstrates the incremental modernization of a monolithic application into microservices on Google Kubernetes Engine (GKE).

Beyond basic orchestration, this project explores the architectural tradeoffs and platform patterns required to operate containerized workloads in production. By implementing the Strangler Fig Pattern, the migration allows the monolith and microservices to coexist—drastically reducing deployment risk and avoiding the pitfalls of a "big bang" migration.

---

## 2. Problem Statement

### 2.1 The Challenge

Legacy monolithic architectures often struggle in cloud-native environments due to:

- Tight Coupling: Interdependent components that hinder agility.
- Coarse-grained Scaling: Inability to scale specific functions without scaling the entire stack.
- High Deployment Risk: Small changes requiring full-system redeployments.
- Limited Fault Isolation: Single-point failures that can lead to total system downtime.

---

### 2.2 The Objective

This project modernizes the application using a microservices approach while ensuring continuous availability during the transition.
By adopting an incremental migration strategy (Strangler Fig Pattern), the monolith and microservices coexist—allowing independent deployments, domain-driven scaling, and reduced operational risk.

---

## 3. Initial Architecture (Monolith)

The legacy monolith exhibits the following architectural characteristics and limitations:

### 3.1 Characteristics

- Single Deployable Unit: A unified codebase hosting all domains (Frontend, Orders, Products).
- Shared Runtime: All components share the same configuration and deployment lifecycle.
- Tight Coupling: Business logic is intermingled, making individual changes difficult.

### 3.2 Limitations

- Full-Stack Redeployments: Any minor change requires a complete system restart.
- Coarse-Grained Scaling: The entire application must be scaled, even if only the "Orders" service is under load.
- Poor Fault Isolation: A memory leak in one domain can trigger a total system failure.

---

## 4. Target Architecture (Microservices on GKE)

The target architecture decomposes the legacy monolith into independent services aligned with business domains, adopting a cloud-native foundation on Google Kubernetes Engine (GKE).

### 4.1 Core principles

- Domain-Driven Decomposition: Services are separated by business logic (Orders, Products, Frontend) to promote autonomous evolution.
- Containerized Isolation: A container-per-service model ensures consistent environments and clear runtime boundaries.
- GKE as the Runtime: Google Kubernetes Engine provides automated orchestration, scaling, and self-healing across services.

### 4.2 Key Outcome

- Independent Deployments: Each service can be updated, rolled back, or released on its own cadence without impacting others.
- Granular Scaling: Compute resources scale specifically where needed (e.g., scaling the Orders service during high-traffic events).
- Improved Resilience: Failures in one service are contained, ensuring the rest of the application remains available.

---

## 5. Migration Strategy: Strangler Fig Pattern

To avoid a high-risk “big bang” rewrite, the modernization followed an incremental approach that preserved application availability throughout the transition.

```mermaid
sequenceDiagram
    participant Browser as Client Browser (React + Vite)
    participant Ingress as GKE Ingress
    participant FastAPI as Products Service (FastAPI/Python)

    Note over Browser, FastAPI: Incremental domain extraction via Strangler Fig

    Browser->>Ingress: GET /api/products
    Ingress->>FastAPI: Forward Request (ClusterIP)

    activate FastAPI
    Note right of FastAPI: Pydantic validation + business logic
    FastAPI-->>Ingress: JSON Response (Status: 200)
    deactivate FastAPI

    Ingress-->>Browser: JSON Array of Products (200 OK)

    Note over Browser: Existing UI consumes the same API contract
```

The Strangler Fig Transition

### 5.1 Execution Steps

1. Containerize the Monolith: Replatform the existing application onto Kubernetes as the initial baseline.
2. Extract Domains: Decouple one business capability (e.g., Orders) at a time into its own microservice.
3. Shift Traffic: Gradually reroute requests from the monolith to the new service using an Ingress controller.
4. Validate and Stabilize: Monitor performance, logs, and user impact in the live environment before proceeding.
5. Decommission Legacy Components: Repeat the process until the monolithic core is fully retired.

### 5.2 Key Benefits

- Risk Mitigation: Issues are isolated by domain rather than affecting the entire system.
- Zero Downtime: The monolith and new services coexist, ensuring continuous operation.
- Faster Delivery: New functionality can be developed directly in the microservices layer while the migration continues.

```mermaid
graph TD
    User((External User)) --> Ingress{GKE Ingress Controller}

    subgraph GKE_Cluster [Google GKE Cluster]
        direction TB
        Ingress -- "path: /api/products" --> SVC_Products[Service: Products]
        Ingress -- "path: / (default)" --> SVC_Mono[Service: Monolith]

        subgraph Modern_Stack [Modernized Domain]
            SVC_Products --> Pod_FastAPI[Pod: Products / FastAPI Python]
        end

        subgraph Legacy_Stack [Legacy Domain]
            SVC_Mono --> Pod_Node[Pod: Monolith / Node.js]
        end
    end

    style GKE_Cluster fill:#f8fbff,stroke:#1f6feb,stroke-width:2px,color:#0b1f33
    style Modern_Stack fill:#eefaf2,stroke:#1a7f37,stroke-width:1px,color:#0f2a1a
    style Legacy_Stack fill:#fff4e5,stroke:#b45309,stroke-width:1px,color:#3f2a00
    style Ingress fill:#e0f2fe,stroke:#0369a1,stroke-width:2px,color:#082f49
    style SVC_Products fill:#dcfce7,stroke:#15803d,stroke-width:1px,color:#0f2a1a
    style Pod_FastAPI fill:#dcfce7,stroke:#15803d,stroke-width:1px,color:#0f2a1a
    style SVC_Mono fill:#ffedd5,stroke:#c2410c,stroke-width:1px,color:#3f2a00
    style Pod_Node fill:#ffedd5,stroke:#c2410c,stroke-width:1px,color:#3f2a00
```

The Strangler Fig Transition Diagram

---

## 6. Implementation Details: Polyglot Microservices

To demonstrate the flexibility of a microservices architecture, the Products Service was re-engineered using Python 3.11 and FastAPI. This decision illustrates a real-world "Strangler Fig" scenario where legacy code is not just moved, but modernized using a different technology stack.

### 6.1 Technical Choices

- **FastAPI Framework**: Selected for its high performance (Asynchronous ASGI), native data validation via Pydantic, and automatic OpenAPI documentation.
- **Contract-First Migration**: The FastAPI service was designed to strictly adhere to the original JSON schema expected by the React Frontend, ensuring zero-downtime and transparent migration for the end-user.
- **Containerization**: Implemented using Multi-stage Docker builds to optimize image size and reduce the attack surface in the GKE environment.

See section 11.2 for FastAPI autogenerated API documentation (Swagger UI) evidence.

### 6.2 Data Contract (Pydantic Model)

The service implements a strict schema to maintain compatibility with the legacy frontend:

```Python
class Product(BaseModel):
    id: str
    name: str
    description: str
    picture: str
    cost: float
    categories: list[str]
```

### 6.3 Traffic Shifting (Ingress)

The GKE Ingress controller acts as the routing engine. By applying path-based rules, traffic is incrementally diverted:

1. Default Rule (`/`): Routes to the Frontend service.
2. Specific Rule (`/api/orders`): Routes to the new Node.js Orders microservice.
3. Specific Rule (`/api/products`): Routes to the new FastAPI Products microservice.

---

## 7. Key Architectural Decisions

```mermaid
graph TB
    User((External User)) --> Ingress{GKE Ingress Controller}

    subgraph GCP_Cloud [Google Cloud Platform]
        direction TB

        subgraph GKE_Cluster [GKE Cluster - Production]
            direction TB

            subgraph Services_Layer [Service Abstraction]
                SVC_Front[Service: Frontend]
                SVC_Orders[Service: Orders]
                SVC_Products[Service: Products]
            end

            subgraph Pods_Layer [Compute Layer - Distributed]
                Pod_Front[Pods: Frontend / React]
                Pod_Orders[Pods: Orders / Node.js]
                Pod_Products[Pods: Products / FastAPI]
            end

        end

        Registry[(Google Artifact Registry)]
    end

    Ingress -- "path: /" --> SVC_Front
    Ingress -- "path: /api/orders" --> SVC_Orders
    Ingress -- "path: /api/products" --> SVC_Products

    SVC_Front --> Pod_Front
    SVC_Orders --> Pod_Orders
    SVC_Products --> Pod_Products

    Registry -.-> Pod_Front
    Registry -.-> Pod_Orders
    Registry -.-> Pod_Products

    style GCP_Cloud fill:#f7f8fa,stroke:#4285f4,stroke-width:2px,color:#0b1f33
    style GKE_Cluster fill:#f8fbff,stroke:#1f6feb,stroke-width:2px,color:#0b1f33
    style Services_Layer fill:#eef6ff,stroke:#1f6feb,stroke-width:1px,color:#0b1f33
    style Pods_Layer fill:#eefaf2,stroke:#1a7f37,stroke-width:1px,color:#0f2a1a
    style Ingress fill:#fff4e5,stroke:#b45309,stroke-width:2px,color:#3f2a00
    style Registry fill:#f3f4f6,stroke:#374151,stroke-width:2px,color:#111827

    style SVC_Front fill:#dbeafe,stroke:#1d4ed8,stroke-width:1px,color:#0b1f33
    style SVC_Orders fill:#dbeafe,stroke:#1d4ed8,stroke-width:1px,color:#0b1f33
    style SVC_Products fill:#dbeafe,stroke:#1d4ed8,stroke-width:1px,color:#0b1f33
    style Pod_Front fill:#dcfce7,stroke:#15803d,stroke-width:1px,color:#0f2a1a
    style Pod_Orders fill:#dcfce7,stroke:#15803d,stroke-width:1px,color:#0f2a1a
    style Pod_Products fill:#dcfce7,stroke:#15803d,stroke-width:1px,color:#0f2a1a
```

Target State Diagram

### 7.1 Kubernetes as the Control Plane

Kubernetes was selected to provide:

- **Declarative deployments**: Ensuring the desired state matches the actual state.
- **Self-healing and scheduling**: Automatically restarting failed containers.
- **Horizontal scalability**: Responding to traffic spikes dynamically.
- **Consistent runtime**: Parity across development, staging, and production.

---

### 7.2 Service Communication Model

- Internal services use **ClusterIP** for private, internal-only networking.
- Service discovery is managed via **Kubernetes DNS**.
- **Rationale**: This architecture prevents direct public exposure of internal APIs, significantly reducing the attack surface and cloud costs.

---

### 7.3 Ingress-Based Traffic Management

A centralized Ingress layer serves as the single entry point to the cluster:

- **Path-based routing**: Directing traffic (e.g., `/orders` vs `/products`) to the correct backend service.
- **Simplified Management**: Centralizing SSL/TLS certificate handling and DNS.

---

### 7.4 Configuration and Secrets Management

- **ConfigMaps**: Externalize application settings to keep images environment-agnostic.
- **Kubernetes Secrets**: Securely inject sensitive data (API keys, DB credentials) at runtime.
- **Status**: Planned enhancement for a future iteration.

```mermaid
graph LR
    subgraph Workstation [Developer Environment]
        Code[Source Code] --> DF[Dockerfile]
    end

    subgraph CI_CD [Planned CI/CD Pipeline]
        DF --> Build{Build & Test}
        Build --> Push[Push Image]
    end

    subgraph Registry [Google Artifact Registry]
        Push --> Img[Immutable Image v1.0.0]
    end

    subgraph Runtime [GKE Production]
        Img --> Deploy[Kubernetes Deployment]
        Deploy --> Replicas[Running Pods]
    end

    style Registry fill:#f1f8e9,stroke:#33691e
    style Runtime fill:#e3f2fd,stroke:#0d47a1
```

Planned Delivery Workflow (Future State)

---

### 7.5 Health Checks and Resilience

Each service implements specific probes:

- **Liveness probes**: To identify and restart stalled containers.
- **Readiness probes**: To ensure traffic is only sent to instances fully initialized and ready to serve.

---

## 8. Observability and Day-2 Operations

The architecture is purposefully designed to integrate with modern observability stacks:

- **Centralized Logging**: Aggregating logs from ephemeral containers for troubleshooting.
- **Metrics-based Autoscaling**: Using Horizontal Pod Autoscalers (HPA) to react to load.
- **Service-level Monitoring**: Tracking health and latency across distributed boundaries.

```mermaid
graph LR
    Frontend[Frontend Service] -->|/metrics| Prometheus[Prometheus]
    Orders[Orders Service] -->|/metrics| Prometheus
    Products[Products Service] -->|/metrics| Prometheus
    Prometheus --> Grafana[Grafana Dashboards]
    Prometheus -. planned .-> Alerting[Alert Rules]

    style Prometheus fill:#fde68a,stroke:#b45309,stroke-width:1px,color:#3f2a00
    style Grafana fill:#dbeafe,stroke:#1d4ed8,stroke-width:1px,color:#0b1f33
    style Alerting fill:#fee2e2,stroke:#b91c1c,stroke-width:1px,color:#3f1111
```

Observability Flow Diagram

### 8.1 Basic Monitoring Stack (Implemented)

This repository includes a lightweight monitoring starter under `k8s/monitoring/monitoring.yml`:

- **Prometheus**: Scrapes `/metrics` from `frontend`, `orders`, and `products` services.
- **Grafana**: Pre-provisioned Prometheus datasource and a starter dashboard (`Microservices Overview`).

Deploy the monitoring stack:

```bash
kubectl apply -f k8s/monitoring/monitoring.yml
```

Access Grafana locally:

```bash
kubectl -n monitoring port-forward svc/grafana 3000:3000
```

Default Grafana credentials (for demo only): `admin` / `admin123`.

---

## 9. Tradeoffs and Limitations

Adopting microservices introduces additional complexity:

- **Increased Operational Overhead**: Managing multiple deployments vs. a single unit.
- **Network Latency**: Inter-service communication introduces overhead compared to in-memory calls.
- **Observability Requirements**: Distributed systems require robust tracing and logging to be maintainable.
- **Conclusion**: These tradeoffs are justified by the gains in team autonomy, resilience, and independent scaling.

---

## 10. Improvements and Next Steps

Potential future enhancements include:

- Implement ConfigMaps and Kubernetes Secrets in manifests for runtime configuration and secret injection
- Service mesh integration (mTLS, traffic shaping)
- Progressive delivery strategies (canary, blue/green)
- CI/CD pipelines with automated promotion
- Policy enforcement (OPA / Gatekeeper)

---

## 11. Evidence and Screenshots

### 11.1 Platform and Deployment State

Monolith running on GKE baseline:

<img src="assets/monolith-deployed-and-running-gke.png" alt="Monolith Deployed on GKE" width="687" height="243">

Microservices running on GKE:

<img src="assets/microservices-deployed-and-running-gke.png" alt="Microservices Deployed on GKE" width="585" height="376">

Kubernetes workload health snapshot:

<img src="assets/kubernetes-workload-health-snapshot.png" alt="Kubernetes Workload Health" width="625" height="244">

Ingress with external endpoint and routing:

<img src="assets/ingress.png" alt="Ingress Rules and External IP" width="558" height="46">

### 11.2 Runtime Validation

Frontend route loads successfully:

<img src="assets/app-frontend-loads.png" alt="Frontend Route Loads" width="768" height="297">

API route call returns service data:

<img src="assets/app-api-route-call.png" alt="API Route Call" width="768" height="297">

FastAPI Swagger UI for Products microservice:

<img src="assets/products-microservice-rewritten-in-FastAPI.png" alt="Products Microservice Rewritten in FastAPI - API Docs" width="742" height="426">

### 11.3 Registry and Local Execution

Google Artifact Registry repository view:

<img src="assets/google-artifact-registry.png" alt="Google Artifact Registry" width="640" height="346">

Local docker-compose stack up:

<img src="assets/microservices-docker-compose-up.png" alt="Docker Compose Local Stack" width="768" height="68">

### 11.4 Observability Evidence

Prometheus targets page with jobs:

<img src="assets/prometheus-targets-page.png" alt="Prometheus Targets Page" width="640" height="281">

Grafana monitoring dashboard:

<img src="assets/prometheus-grafana-monitoring-dashboard.png" alt="Prometheus and Grafana Dashboard" width="640" height="238">

Monitoring namespace health snapshot:

<img src="assets/kubernetes-monitoring-health-snapshot.png" alt="Monitoring Health Snapshot" width="574" height="111">

## 12. Key Takeaways

- **Architecture First**: Modernization is an architectural and organizational shift, not just a "lift and shift" to the cloud.
- **Risk Management**: The Strangler Fig pattern is the gold standard for reducing migration risk.
- **Design Discipline**: Kubernetes provides the primitives for scale, but requires strong design discipline to manage complexity effectively.

---

## 13. Technologies Stack

- Google Kubernetes Engine (GKE)
- Kubernetes (Deployments, Services, Ingress)
- Docker
- Google Artifact Registry
- Prometheus
- Grafana

---

## 14. Target Audience

- Cloud Architects
- Solution Architects
- Cloud Platform Engineers
- Technical interviewers evaluating system design and architectural decision-making
- Engineers interested in enterprise-grade cloud architecture patterns

## 15. License

This project is licensed under the MIT License.
