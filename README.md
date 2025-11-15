# Ai-tendify: AI-Powered Attendance Management System

A modern, automated, and contactless attendance system using **Facial Recognition**, built with **React.js**, **Django REST Framework**, **MySQL**, and **Deep Learning Models (ResNet-34)**.

## Table of Contents
- Overview
- Features
- Tech Stack
- System Architecture
- Facial Recognition Pipeline
- Database Design
- Modules
- Installation
- How Attendance Automation Works
- Results
- Future Enhancements
- Contributors

## Overview
Ai-tendify is an AI-powered attendance system that automates manual roll calls using facial recognition. It identifies students from uploaded classroom images and marks attendance instantly. The system includes dashboards for Students, Teachers, HODs, and Admins, along with real-time analytics.

## Features
- AI-based contactless attendance
- Upload images for automatic recognition
- Real-time analytics using Recharts.js
- Separate dashboards for all user roles
- Manual verification options
- Secure authentication with DRF
- Downloadable attendance reports (CSV / PDF)

## Tech Stack
**Frontend**
- React.js
- Tailwind CSS
- Material-UI
- Recharts.js
- React-Toastify

**Backend**
- Django
- Django REST Framework
- Django Jazmin Admin
- face_recognition (dlib)

**Database**
- MySQL

**AI Model**
- ResNet-34 CNN
- HOG + SVM

## System Architecture
Users → React.js Frontend → Django REST API → AI Attendance Service → MySQL Database → Temporary Image Storage

## Facial Recognition Pipeline
1. Image Upload
2. Face Detection (HOG + SVM)
3. Face Encoding (128-D embeddings)
4. Face Matching (Euclidean distance)
5. Auto attendance marking

## Database Design
Includes tables for Student, Teacher, Subject, Department, Attendance, FaceEncodings, SessionDetails.

## Modules

### Teacher
- Upload images for attendance
- Manual attendance correction
- Download registers

### Student
- View attendance reports
- Download records

### HOD
- Department-wide analytics
- Teacher/class performance

### Admin
- CMS with Django Jazmin
- Manage database entries

## Installation

### Clone Repo
```
git clone https://github.com/yourusername/ai-tendify.git
```

### Backend Setup
```
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```
cd frontend
npm install
npm start
```

### Environment Variables
```
DATABASE_HOST=
DATABASE_USER=
DATABASE_PASSWORD=
SECRET_KEY=
REACT_APP_API_URL=
```

## How Attendance Automation Works
The teacher uploads an image → AI processes faces → matches embeddings → stores attendance → updates analytics.

## Results
- ~90% recognition accuracy
- 90% faster attendance process
- Works under varied lighting & large classrooms

## Future Enhancements
- Live camera detection
- Mobile version
- ERP integration
- Auto defaulter lists

## Contributors
Your Name  
BE in Computer Science  
JSSATE, Bengaluru