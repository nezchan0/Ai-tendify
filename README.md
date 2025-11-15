# Ai-tendify: AI-Powered Attendance Management System

Ai-tendify is an AI-driven, contactless attendance management system that uses **facial recognition** to automate attendance marking within seconds. Built using **React.js**, **Django REST Framework**, **MySQL**, and **Deep Learning (ResNet-34)**, the system offers dedicated dashboards for Students, Teachers, HODs, and Admins with real-time analytics and a CMS panel.

## 🚀 Introduction
Ai-tendify replaces slow, error-prone, and manual attendance processes with a smart, automated, and fully digital approach.  
It identifies students from classroom images and marks their attendance instantly—delivering speed, accuracy, and reliability.

## 🎯 Motivation
Traditional classroom attendance takes **3–5 minutes per class** and interrupts teaching time.  
Ai-tendify reduces this to **5–10 seconds**, ensuring:

- Zero manual effort  
- No roll-calls  
- No biometric touch devices  
- No RFID cards or proxies  
- Accurate and contactless attendance  

### Why Image-Based Instead of Video-Based?
- **Videos require continuous processing**, high GPU/CPU load, and storage.  
- **Images are lightweight**, fast to process, easy to upload, and achieve high accuracy with minimal resources.  
- A single classroom image is enough to detect 50+ faces with optimized processing.

## 🛠️ Tech Stack

### **Frontend**
- React.js  
- Vite  
- Material-UI  
- Tailwind CSS  
- Recharts.js  
- React Hook Form  
- React-Toastify  

### **Backend**
- Django  
- Django REST Framework  
- Django Jazmin Admin (CMS)  
- CORS Headers  
- JWT / Token Auth  

### **AI & Image Processing**
- face_recognition (dlib)  
- HOG + SVM face detection  
- Deep CNN (ResNet-34) face encoding  

### **Database**
- MySQL  
- Django ORM  

## ⭐ Key Features

### 🤖 AI Attendance Automation
- Upload classroom images  
- Detect + recognize faces  
- Auto-mark attendance within seconds  
- 90%+ accuracy in real-world tests  

### 👩‍🏫 Teacher Features
- Upload images for auto-attendance  
- View weekly/monthly attendance  
- Download attendance (CSV/PDF)  
- Manual overrides  
- Class & schedule management  

### 🎓 Student Features
- Dashboard with subject-wise attendance  
- Graphical insights (Bar, Pie, Line)  
- View overall trends  
- Download personal attendance  

### 🏛️ HOD Features
- Department-wide analytics  
- Teacher-wise performance  
- Class-wise attendance summaries  
- Filtering based on department/semester/class/teacher  

### 🛠️ Admin Features (Jazmin CMS)
- Manage all users  
- Manage students, teachers, classes, subjects  
- Upload student images  
- Manage semesters & schedules  
- View logs and database objects  

### 📊 Analytics & Visualization
- Recharts-based analytical graphs  
- Automatic trend detection  
- Class-wise and department-wise comparisons  

# ⚙️ Installation & Setup Guide

## 1️⃣ Clone the Repository
```bash
git clone <your_repo_link>
cd <project_folder>
```

# 🖥️ Frontend Setup (React.js)
```bash
cd frontend
npm install
npm run dev
```

# 🐍 Backend Setup (Django)
### 1. Activate Virtual Environment
```bash
cd backend
python myenv
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Admin Login)
```bash
python manage.py createsuperuser
```

# 📥 Import Dummy Data (AI-Generated)
```bash
python Util_ImportDummyData.py
```

Generate fresh attendance (optional):
```bash
python Util_GenerateDummyAttendance.py
```

Reset DB before reimport:
```bash
python Util_DeleteAllData.py
```

# 🧩 Database Schema
![Database_Schema](ProjectFlowImages/DataBaseSchema_Aitendify.png)

# 🏗️ System Architecture
![SystemArchitecture](ProjectFlowImages/SystemArchitecture_Aitendify.png)

# 🔄 Data Flow Diagram
![DataFlowDiagram](ProjectFlowImages/DataFlowDiagram_AiTendify.png)

# 📸 Project Preview
(Images retained as described—same as your original README)

# 📄 License
MIT License

# 👤 Author
**Alok Maurya**
