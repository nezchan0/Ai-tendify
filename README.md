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
- For a single classroom 3-4 image covering the whole classroom is enough to detect 50+ faces with optimized processing.

---

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

---

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

---

# ⚙️ Installation & Setup Guide

## 1️⃣ Clone the Repository
```bash
git clone https://github.com/nezchan0/Ai-tendify.git
cd Ai-tendify
```

# 🖥️ Frontend Setup (React.js)
```bash
cd Frontend/myreactapp
npm install
npm run dev
```

# 🐍 Backend Setup (Django)
### 1. Activate Virtual Environment
```bash
cd Backend
python -m venv myenv
source myenv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Migrations
```bash
cd Project
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Admin Login)
```bash
python manage.py createsuperuser
```

# 📥 Import Dummy Data
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

---

# 🧩 Database Schema
The system uses a normalized MySQL schema comprising 14 core tables that manage academic structure (Branch, Classes, Subjects), user roles (Students, Teachers, Users), scheduling (Session, TimeSlots, TimeTables), and Attendance logs. This design ensures referential integrity and optimized queries for analytics, dashboards, and automation pipelines.
![Database_Schema](ProjectFlowImages/DataBaseSchema_Aitendify.png)

---

# 🏗️ System Architecture
![SystemArchitecture](ProjectFlowImages/SystemArchitecture_Aitendify.png)

---

# 🔄 Data Flow Diagram
![DataFlowDiagram](ProjectFlowImages/DataFlowDiagram_AiTendify.png)

---

# 📸 Project Preview

## 🌐 Landing Pages
![Landing 1](ProjectFlowImages/1_LandingPage_1.png)
![Landing 2](ProjectFlowImages/2_LandingPage_2.png)
![Landing 3](ProjectFlowImages/3_LandingPage_3.png)

## 👨‍🏫 Teacher Module
![Teacher Login](ProjectFlowImages/4_Teacher_LoginPage.png)
![Teacher Dashboard](ProjectFlowImages/5_Teacher_Dashboard1_AllClassesAttendanceSummary.png)
![Upload Image](ProjectFlowImages/6_Teacher_MarkingAttendance_UploadingImage_and_ImageProcessing.png)
![Processed Attendance](ProjectFlowImages/7_Teacher_MarkingAttendance_ImageProcessedAndAttendanceMarkedAutomatically.png)
![Class Table](ProjectFlowImages/8_Teacher_ViewingAttendanceDataInTabularFormatPerClass.png)
![Weekly Sessions](ProjectFlowImages/9_Teacher_Dashboard2_ViewingAllSessionAttendanceAcrossTheWeek.png)
![Trends](ProjectFlowImages/10_Teacher_Dashboard3_ViewingSessionForThisWeeksAttendanceTrends.png)

## 🎓 Student Module
![Student Login](ProjectFlowImages/11_Student_LoginPage.png)
![Student Dashboard](ProjectFlowImages/12_Student_Dashboard_CompleteAttendanceSummary.png)
![Class Summary](ProjectFlowImages/13_Student_Dashboard_AttendanceSummaryPerClass.png)
![Bar Graph](ProjectFlowImages/14_Student_Dashboard_AttendanceAnalytics_BarGraph.png)
![Pie Chart](ProjectFlowImages/15_Student_Dashboard_AttendanceAnalytics_PieChart.png.png)
![Line Graph](ProjectFlowImages/16_Student_Dashboard_AttendanceAnalytics_LineGraph.png.png)

## 🏛️ HOD Module
![HOD Login](ProjectFlowImages/17_HOD_LoginPage.png)
![Branch Overview](ProjectFlowImages/18_HOD_Dashboard1_Overall_BranchData.png)
![Teacher-Class Overview](ProjectFlowImages/19_HOD_Dashboard2_AllBranchTeachersClassAttendanceData.png)
![Filter 1](ProjectFlowImages/20_HOD_Dashboard3_Filter_Semester_Teacher_ClassID_And_AnalyticsCharts1.png)
![Filter 2](ProjectFlowImages/21_HOD_Dashboard3_Filter_Semester_Teacher_ClassID_And_AnalyticsCharts2.png)
![Filter 3](ProjectFlowImages/22_HOD_Dashboard3_Filter_Semester_Teacher_ClassID_And_AnalyticsCharts3.png)

## 🛠️ Admin CMS
![Admin Jazmin](ProjectFlowImages/23_AdminPage_Django_Jazmin)


---
## 📜 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and distribute it freely, with attribution.

---

