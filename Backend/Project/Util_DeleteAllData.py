import os
import django
import shutil

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Project.settings')
django.setup()

from myapp.models import (
    TimeTables, Student_TSA_Enrollment, Teacher_Subject_Assignment,
    Students_Current_Class, Attendance, Students, Teachers, 
    Subjects, Classes, Branch, Session, TimeSlots, RoomNum, Users
)
from django.conf import settings

def delete_student_images():
    """Delete all student images from the media directory."""
    print("Deleting student images...")
    student_images_dir = os.path.join(settings.MEDIA_ROOT, 'student_images')
    
    if os.path.exists(student_images_dir):
        try:
            shutil.rmtree(student_images_dir)
            print("✅ All student images deleted successfully!")
        except Exception as e:
            print(f"Error deleting student images: {str(e)}")
    else:
        print("No student images directory found.")

def delete_all_data():
    print("Starting to delete all data...")
    
    # Delete in reverse order of dependencies to avoid foreign key constraints
    print("Deleting TimeTables...")
    TimeTables.objects.all().delete()
    
    print("Deleting Student_TSA_Enrollment...")
    Student_TSA_Enrollment.objects.all().delete()
    
    print("Deleting Teacher_Subject_Assignment...")
    Teacher_Subject_Assignment.objects.all().delete()
    
    print("Deleting Students_Current_Class...")
    Students_Current_Class.objects.all().delete()
    
    print("Deleting Attendance...")
    Attendance.objects.all().delete()
    
    print("Deleting Students...")
    Students.objects.all().delete()
    
    print("Deleting Teachers...")
    Teachers.objects.all().delete()
    
    print("Deleting Subjects...")
    Subjects.objects.all().delete()
    
    print("Deleting Classes...")
    Classes.objects.all().delete()
    
    print("Deleting Branch...")
    Branch.objects.all().delete()
    
    print("Deleting Session...")
    Session.objects.all().delete()
    
    print("Deleting TimeSlots...")
    TimeSlots.objects.all().delete()
    
    print("Deleting RoomNum...")
    RoomNum.objects.all().delete()
    
    print("Deleting Users...")
    Users.objects.all().delete()
    
    # Delete all student images
    delete_student_images()
    
    print("✅ All data deleted successfully!")

if __name__ == "__main__":
    # Ask for confirmation
    confirm = input("Are you sure you want to delete ALL data from the database and ALL student images? This cannot be undone! (yes/no): ")
    if confirm.lower() == 'yes':
        delete_all_data()
    else:
        print("Operation cancelled.") 