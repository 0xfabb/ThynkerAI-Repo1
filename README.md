# ThynkerAI

**ThynkerAI** is a new-age AI-powered academic ecosystem built for students who want more than just another productivity tool. This is not just about notes or chatbots—it's about creating an environment that understands how a student works, thinks, and grows. It’s where notebooks, AI tutors, and intelligent agents come together to streamline every part of the academic journey.

---

## 🔍 What is ThynkerAI?

ThynkerAI is your AI-first academic workspace. You can:

* Chat with Euler, the AI tutor, to learn any topic with diagrams, notes, graphs, and videos.
* Use Notebooks to save anything—doubts, explanations, formulas, project plans—on the fly.
* Ask the Thynker Agent to track your attendance, manage deadlines, build your study plan, and guide your projects.

Think of it like combining the best of Notion, ChatGPT, and a personal assistant—all into one focused ecosystem built specifically for students.

---

## 🔧 Current Features

* **AI Tutor (Euler)** – Ask for help with any topic, get clean, structured learning material, and save it instantly to your notebooks.
* **Notebooks** – Save anything with one click while chatting with AI or from anywhere in the app. Fully organized, searchable, and exportable.
* **Thynker Agent** – Your intelligent assistant that can:

  * Track attendance
  * Remind you of exams, deadlines, and projects
  * Build study and revision plans
  * Brainstorm ideas and guide academic work
* **Authentication** – Secure login and personalized experience
* **Live Deployment** – Production-ready and already running online

---

## 🧪 MVP Demo

* Auth ✅
* Notebooks ✅
* Chat with AI ✅
* Add to Notebook from chat ✅
* Gemini API integrated ✅
* Live and usable ✅

---

## 📦 Upcoming Features

* **Mobile App** with a learning assistant you can summon like a voice assistant — add to reading list, update attendance, ask questions, and more.
* **Browser Extension** to:

  * Take notes from YouTube videos
  * Chat with any article
  * Add any web content directly into your notebook

---

## 🛠️ Infrastructure Overview

### Core Platform

* Built on **Appwrite Student Pro Pack**:

  * Handles authentication, database, storage, and functions

### Python Backend (hosted on DigitalOcean)

* Handles:

  * Image-to-text OCR for doubt solving
  * Note to PDF conversion
  * AI API requests and preprocessing
* Architecture:

  * Lightweight Python backend on DO Droplet
  * Gemini API for AI capabilities
  * Queue-based task processing for OCR and PDF generation
  * Caching layer for performance

### Cost Management

* DigitalOcean credit: \$205
* Monthly backend cost estimate: \$15–25/month
* Expected operational span: 8–12 months on current credit

---

## 📈 Scalability Plan

* Introduce autoscaling using App Platform Functions or Cloud Run
* Offload intensive tasks to edge functions or use CDN for static delivery
* AI response caching to reduce API cost
* Usage limits per user in free plan for sustainability

---

## Vision

ThynkerAI isn’t just a tool. It’s a new way of living student life—where focus, structure, and learning come together. Built for students who want to do more, think sharper, and stay truly effective. All it takes is one ecosystem that actually gets you.

---

## 📄 License

MIT

---

## 🙌 Contribute

Interested in contributing? Reach out or open a pull request. We're just getting started.

---

## 🌐 Live Link

[Visit ThynkerAI](https://your-app-link.com)
