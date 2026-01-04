# Wall of Fame – WEB2 Project (Frontend)

This repository contains the frontend of the Wall of Fame project, a full-stack web application where users can register, log in and showcase personal achievements (“wins”).

The frontend is built with Vue 3 and Vite and communicates with a custom Node.js + Express backend API hosted on Render.

---

## Tech stack

Frontend: Vue 3  
Build tool: Vite  
Styling: CSS  
Authentication: JWT (handled via backend API)  
Hosting: Netlify  

---

## Live links

Frontend (Netlify):  
https://frolicking-centaur-5dcb19.netlify.app

Backend API (Render):  
https://wall-of-fame-api.onrender.com

---

## Features

User registration and login  
Create, edit and delete personal wins  
Protected routes (authentication required)  
Ownership protection (users can only manage their own wins)  
Responsive UI with animations  
Connection to a RESTful backend API  

---

## Up & running (local development)

1. Clone the repository  
   git clone https://github.com/Alexanderdeloecker/web2-course-project-frontend-deploy.git

2. Navigate to the project folder  
   cd web2-course-project-frontend-deploy

3. Install dependencies  
   npm install

4. Create a `.env` file and add the backend API URL:  
   VITE_API_URL=https://wall-of-fame-api.onrender.com

5. Start the development server  
   npm run dev

6. Open the application in your browser  
   http://localhost:5173

---

## Sources

The following sources were consulted during the development of this frontend:

Vue.js – Official Documentation  
https://vuejs.org/guide/introduction.html

Vite – Official Documentation  
https://vitejs.dev/guide/

W3Schools – Vue Tutorial  
https://www.w3schools.com/vue/

W3Schools – JavaScript Tutorial  
https://www.w3schools.com/js/

MDN Web Docs – Fetch API  
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

MDN Web Docs – JavaScript Modules  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

JWT – Official Introduction  
https://jwt.io/introduction

Any concepts inspired by these sources were adapted and implemented in my own code structure.

---

## Notes

The frontend depends on the live backend API hosted on Render.  
Environment variables are handled via Vite (`import.meta.env`).  
This repository is part of the WEB2 course assignment at Erasmus Hogeschool Brussel.
