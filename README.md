# Data Platform Project Setup

---

Cloud Deployment Strategy (frontend and backend are two separate repositories):

Frontend Repo: https://github.com/alirajgarah/deployfrontend
Backend Repo: https://github.com/alirajgarah/deploybackend

1. Database deployment
Deployed via Atlas cloud:
mongodb+srv://user:yeetzeet7@cluster0.j9t2i9o.mongodb.net/test

2. Backend deployment
Deployed via Render
https://cis4339group7.onrender.com (you can test it by adding /eventdata to the URL)

In the frontend folder .env, replace VITE_ROOT_API with deployed backend URL,
Do npm run build in terminal,
Take created dist folder and push to frontend GitHub repository,

3. Frontend deployment
Deployed via Netlify
https://soft-blini-663ddb.netlify.app

End result : Frontend, backend, and database are linked.

https://soft-blini-663ddb.netlify.app

<b>The free backend hosting service we are currently using pauses after 15 minutes if you don't use it. 
I have the backend pinged every 15 minutes with https://cron-job.org in order to keep it active.</b>



----
Requirements:

This project uses NodeJS and MongoDB.

## Backend Node Application
```
cd backend
```
Follow instructions in backend README

## Frontend Vue 3 Application
```
cd frontend
```
Follow instructions in frontend README

