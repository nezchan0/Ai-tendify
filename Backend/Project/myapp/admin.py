from django.contrib import admin
from .models import (
    TimeSlots, Session, Branch, Classes, RoomNum, Subjects, 
    Teachers, Students, Students_Current_Class, Teacher_Subject_Assignment,
    Student_TSA_Enrollment, TimeTables, Attendance, Users
)
from django.utils.html import format_html

@admin.register(TimeSlots)
class TimeSlotsAdmin(admin.ModelAdmin):
    list_display = ('TimeSlot_ID', 'Start_Time', 'End_Time')
    search_fields = ('TimeSlot_ID',)
    ordering = ('Start_Time',)


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('Session_ID', 'Day', 'TimeSlot_ID', 'ExtraClass')
    list_filter = ('Day', 'ExtraClass')
    search_fields = ('Session_ID', 'Day')
    ordering = ('Day', 'TimeSlot_ID')


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('Branch_ID', 'Branch_Name')
    search_fields = ('Branch_ID', 'Branch_Name')
    ordering = ('Branch_ID',)


@admin.register(Classes)
class ClassesAdmin(admin.ModelAdmin):
    list_display = ('Class_ID', 'Branch_ID', 'Semester', 'Section')
    list_filter = ('Branch_ID', 'Semester')
    search_fields = ('Class_ID', 'Branch_ID__Branch_Name', 'Section')
    ordering = ('Branch_ID', 'Semester', 'Section')


@admin.register(RoomNum)
class RoomNumAdmin(admin.ModelAdmin):
    list_display = ('RoomNo', 'Is_A')
    list_filter = ('Is_A',)
    search_fields = ('RoomNo',)
    ordering = ('RoomNo',)


@admin.register(Subjects)
class SubjectsAdmin(admin.ModelAdmin):
    list_display = ('Subject_Code', 'Subject_Name', 'Subject_Abbreviation', 'Scheme', 'Semester', 'Credits')
    list_filter = ('Scheme', 'Semester')
    search_fields = ('Subject_Code', 'Subject_Name', 'Subject_Abbreviation')
    ordering = ('Scheme', 'Semester', 'Subject_Code')


@admin.register(Teachers)
class TeachersAdmin(admin.ModelAdmin):
    list_display = ('Teacher_ID', 'Teacher_Name', 'Initials', 'Branch_ID', 'Teacher_Email')
    list_filter = ('Branch_ID',)
    search_fields = ('Teacher_ID', 'Teacher_Name', 'Teacher_Email')
    ordering = ('Teacher_ID',)


@admin.register(Students)
class StudentsAdmin(admin.ModelAdmin):
    list_display = ('Student_ID', 'Student_Name', 'Branch_ID', 'Graduation_Batch', 'Student_Email', 'Parents_Contact', 'get_image', 'get_face_encoding_status')
    search_fields = ('Student_ID', 'Student_Name', 'Student_Email')
    list_filter = ('Branch_ID', 'Graduation_Batch')
    ordering = ('Student_ID',)
    readonly_fields = ('get_face_encoding_status',)
    
    def get_image(self, obj):
        if obj.ImagePath:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 50%;" />', obj.ImagePath.url)
        return "No Image"
    get_image.short_description = 'Student Photo'

    def get_face_encoding_status(self, obj):
        return obj.get_face_encoding_status()
    get_face_encoding_status.short_description = 'Face Encoding Status'


@admin.register(Students_Current_Class)
class StudentsCurrentClassAdmin(admin.ModelAdmin):
    list_display = ('Student_ID', 'Branch_ID', 'Semester', 'Section', 'Class_ID')
    list_filter = ('Branch_ID', 'Semester', 'Section')
    search_fields = ('Student_ID__Student_ID', 'Student_ID__Student_Name', 'Class_ID')
    ordering = ('Branch_ID', 'Semester', 'Section')


@admin.register(Teacher_Subject_Assignment)
class TeacherSubjectAssignmentAdmin(admin.ModelAdmin):
    list_display = ('TSA_ID', 'Teacher_ID', 'Subject_Code', 'Semester', 'IsElective', 'IsLab', 'Class_ID')
    list_filter = ('Semester', 'IsElective', 'IsLab', 'Teacher_ID__Branch_ID')
    search_fields = ('TSA_ID', 'Teacher_ID__Teacher_Name', 'Subject_Code__Subject_Name', 'Class_ID__Class_ID')
    ordering = ('TSA_ID',)


@admin.register(Student_TSA_Enrollment)
class StudentTSAEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('Student_ID', 'TSA_ID')
    list_filter = ('TSA_ID__Teacher_ID__Branch_ID', 'TSA_ID__Semester')
    search_fields = ('Student_ID__Student_ID', 'Student_ID__Student_Name', 'TSA_ID__TSA_ID')
    ordering = ('Student_ID', 'TSA_ID')


@admin.register(TimeTables)
class TimeTablesAdmin(admin.ModelAdmin):
    list_display = ('srno', 'Session_ID', 'Class_ID', 'TSA_ID', 'RoomNo')
    list_filter = ('Session_ID__Day', 'Class_ID__Branch_ID', 'Class_ID__Semester')
    search_fields = ('Session_ID__Session_ID', 'Class_ID__Class_ID', 'TSA_ID__TSA_ID', 'RoomNo__RoomNo')
    ordering = ('Session_ID__Day', 'Session_ID__TimeSlot_ID__Start_Time')


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('Date', 'Day', 'Student_ID', 'Session_ID', 'Class_ID', 'TSA_ID', 'Status')
    list_filter = ('Date', 'Day', 'Status', 'Class_ID__Branch_ID', 'Class_ID__Semester', 'Session_ID__Day','TSA_ID')
    search_fields = ('Student_ID__Student_ID', 'Student_ID__Student_Name', 'Session_ID__Session_ID')
    ordering = ('-Date', 'Session_ID__TimeSlot_ID__Start_Time')


@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('User_ID', 'Role')
    list_filter = ('Role',)
    search_fields = ('User_ID',)
    ordering = ('User_ID',)


