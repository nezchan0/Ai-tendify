from django.urls import path
from . import views

urlpatterns = [
   
    path('api/group-photo/', views.GroupPhotoRecognitionAPI.as_view(), name='group_photo_api'),
    
    # Login endpoints
    path('api/student/login/', views.student_login, name='student_login'),
    path('api/teacher/login/', views.teacher_login, name='teacher_login'),
    path('api/hod/login/', views.hod_login, name='hod_login'),
    # Student information endpoints
    path('api/student-info/<str:student_id>/', views.get_student_info, name='get_student_info'),
    # Teacher information endpoints
    path('api/teacher-info/<str:teacher_id>/', views.get_teacher_info, name='get_teacher_info'),
    path('api/teacher-schedule/<str:teacher_id>/', views.get_teacher_schedule, name='get_teacher_schedule'),
    path('api/teacher-analytics/<str:teacher_id>/', views.get_teacher_analytics, name='get_teacher_analytics'),
    path('api/teacher-attendance/<str:teacher_id>/<int:tsa_id>/', views.get_teacher_attendance_register, name='get_teacher_attendance_register'),
    path('api/tsa-students/<int:tsa_id>/', views.get_tsa_students, name='get_tsa_students'),
    path('api/mark-attendance/', views.mark_attendance, name='mark_attendance'),
    
    
    # HOD information endpoints
    path('api/hod-info/<str:teacher_id>/', views.get_hod_info, name='get_hod_info'),
    path('api/department-analytics/<str:teacher_id>/', views.get_department_analytics, name='get_department_analytics'),
    path('api/department-tsa-analytics/<str:teacher_id>/', views.get_department_tsa_analytics, name='get_department_tsa_analytics'),
] 