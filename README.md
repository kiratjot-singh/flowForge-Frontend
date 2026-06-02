# FlowForge Frontend 🚀

Frontend dashboard for FlowForge, a deployment platform inspired by Vercel and Railway.

This application provides a modern interface for managing deployments, monitoring build logs, tracking deployment status, and viewing deployment details in real time.

---

## Features

### Dashboard

* Deployment Overview
* Deployment Statistics
* Search Deployments
* Activity Feed
* Auto Refresh

### Deployment Management

* Create New Deployment
* Deployment Details
* Deployment Status Tracking
* Deployment URL Viewer
* Copy Deployment URL

### Build Monitoring

* Live Build Logs
* Auto Scrolling Logs
* Real-Time Status Updates

### User Experience

* Dark Modern UI
* Responsive Layout
* Railway/Vercel Inspired Design
* Smooth Navigation

---

## Screens

### Dashboard

View:

* Total Deployments
* Successful Deployments
* Running Deployments
* Failed Deployments

Search deployments by:

* Deployment ID
* Repository URL
* Branch

---

### Create Deployment

Deploy a repository by providing:

```text
Repository URL
Branch
Commit SHA (optional)
```

---

### Deployment Details

Each deployment displays:

* Deployment ID
* Repository URL
* Branch
* Commit SHA
* Output Directory
* Deployment URL
* Build Logs
* Deployment Status

---

## Tech Stack

### Frontend

* React
* React Router
* Tailwind CSS

### API Integration

* REST APIs
* Fetch API

---

## Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Backend API
 │
 ▼
Deployment System
```

---

## Project Structure

```text
src
│
├── components
│   ├── ActivityFeed
│   ├── DeploymentCard
│   ├── StatCard
│   └── StatusBadge
│
├── layouts
│   └── MainLayout
│
├── pages
│   ├── Dashboard
│   ├── CreateDeployment
│   └── DeploymentDetails
│
├── routes
│
└── App.jsx
```

---

## Installation

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

---

## Backend Repository

This frontend works together with the FlowForge Backend.

Backend responsibilities:

* GitHub Webhooks
* Deployment Processing
* Docker Builds
* Redis Queue
* Deployment Logs
* Deployment APIs

---

## Future Improvements

* Authentication
* User Profiles
* Team Workspaces
* Deployment Filters
* Theme Customization
* Real-Time WebSocket Updates
* Deployment Charts

---

## Screenshots

Add screenshots here:

```text
Dashboard
Create Deployment
Deployment Details
Build Logs
```

---

## Author

Built by Kiratjot Singh.

FlowForge Frontend provides a clean and modern interface for managing deployments and monitoring application builds.
