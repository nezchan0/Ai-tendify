# Ai-tendify: AI-Powered Attendance Management System

A modern, automated, and contactless attendance system using **Facial Recognition**, built with **React.js**, **Django REST Framework**, **MySQL**, and **Deep Learning (ResNet-34)**.

## 📌 Overview
Ai-tendify automates student attendance using facial recognition from classroom images. It includes dashboards for Students, Teachers, HODs, and Admins, along with analytics and a Django Jazmin CMS backend.

## ⭐ Features
- AI-based contactless attendance  
- Upload classroom images → Automatic recognition  
- Real-time analytics with Recharts  
- Multi-role dashboards  
- Manual verification  
- DRF-secured APIs  
- Export reports (CSV / PDF)

## 🛠️ Tech Stack
**Frontend:** React.js, Tailwind CSS, Material-UI, Recharts  
**Backend:** Django, Django REST Framework, Django Jazmin  
**AI:** face_recognition (dlib), ResNet-34, HOG + SVM  
**Database:** MySQL  


# Database Schema
The system uses a normalized MySQL schema comprising 14 core tables that manage academic structure (Branch, Classes, Subjects), user roles (Students, Teachers, Users), scheduling (Session, TimeSlots, TimeTables), and attendance logs. This design ensures referential integrity and optimized queries for analytics, dashboards, and automation pipelines.
![Database_Schema](ProjectFlowImages/DataBaseSchema_Aitendify.png)

---

# Data Flow Diagram
![DataFlowDiagram](ProjectFlowImages/DataFlowDiagram_AiTendify.png)

---

# System Architecture
![SystemArchitecture](ProjectFlowImages/SystemArchitecture_Aitendify.png)

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
