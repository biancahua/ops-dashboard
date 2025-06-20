# ops-dashboard

An operations dashboard built with **NestJS**, **SQLite**, and **Next.js**. The dashboard displays basic operational data, including system health metrics, recent customer conversations, and a “Needs Attention” queue.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

#### 1. Configure Environment

Create a `.env` file in the `api` directory and set the following:

```env
PORT=3000
```

#### 2. Install Dependencies

From the root directory, run:

```
npm run is:all
```

#### 3. Start the Application 

From the root directory, run:

```
npm run dev
```

#### 4. Navigate to Browser

Open your browser and navigate to 

```
http://localhost:<PORT>
```

Replace `<PORT>` with the value you set in `.env`



## App Overview

- Home Dashboard: Overview of system health, recent customer conversations, and “Needs Attention” queue
- Navigation Bar: Lets users navigate to detailed views for each section

Each feature has a dedicated page with slightly more detail than what is shown in the dashboard.

### Project Structure
```
ops-dashboard/
├── apps/
│   ├── api/         # NestJS backend (SQLite DB)
│   └── web/         # Next.js frontend
├── package.json     # Root scripts
└── README.md
```