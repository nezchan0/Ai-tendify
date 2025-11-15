import os
import django
import pandas as pd
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Project.settings')
django.setup()

from myapp.models import (
    RoomNum, TimeSlots, Session, Branch, Classes,
    Subjects, Teachers, Students, Users,
    Students_Current_Class, Teacher_Subject_Assignment,
    Student_TSA_Enrollment, TimeTables,Attendance
)

excel_path = "/home/halcyonic/Documents/SuperFinalNewV1/Backend/Project/Util_DummyData.xlsx"

xls = pd.ExcelFile(excel_path)

# RoomNum
def import_roomnum():
    df = pd.read_excel(xls, 'RoomNum')
    for _, row in df.iterrows():
        RoomNum.objects.get_or_create(
            RoomNo=row['RoomNo'],
            defaults={
                'Is_A': row['Is_A'],
            }
        )

# TimeSlots (fix headers)
def import_timeslots():
    df = pd.read_excel(xls, 'TimeSlots')
    for _, row in df.iterrows():
        TimeSlots.objects.get_or_create(
            TimeSlot_ID=row['TimeSlots_ID'],
            defaults={
                'Start_Time': row['Start_time'],
                'End_Time': row['End_Time'],
            }
        )

# Session
def import_session():
    df = pd.read_excel(xls, 'Session')
    for _, row in df.iterrows():
        session, created = Session.objects.get_or_create(
            Session_ID=row['Session_ID'],
            defaults={
                'Day': row['Day'],
                'TimeSlot_ID_id': row['TimeSlot_ID'],
                'ExtraClass': row['ExtraClass'],
            }
        )

# Branch
def import_branch():
    df = pd.read_excel(xls, 'Branch')
    for _, row in df.iterrows():
        Branch.objects.get_or_create(
            Branch_ID=row['Branch_ID'],
            defaults={
                'Branch_Name': row['Branch_Name'],
            }
        )

# Classes
def import_classes():
    df = pd.read_excel(xls, 'Classes')
    for _, row in df.iterrows():
        Classes.objects.get_or_create(
            Class_ID=row['Class_ID'],
            defaults={
                'Branch_ID_id': row['Branch_ID'],
                'Semester': row['Semester'],
                'Section': row['Section'],
            }
        )

# Subjects
def import_subjects():
    df = pd.read_excel(xls, 'Subjects')
    for _, row in df.iterrows():
        Subjects.objects.get_or_create(
            Subject_Code=row['Subject_Code'],
            defaults={
                'Scheme': row['Scheme'],
                'Semester': row['Semester'],
                'Subject_Abbreviation': row['Subject_Abbreviation'],
                'Subject_Name': row['Subject_Name'],
                'Credits': row['Credits'],
            }
        )

# Teachers
def import_teachers():
    df = pd.read_excel(xls, 'Teachers')
    for _, row in df.iterrows():
        Teachers.objects.get_or_create(
            Teacher_ID=row['Teacher_ID'],
            defaults={
                'Teacher_Name': row['Teacher_Name'],
                'Initials': row['Initials'],
                'Branch_ID_id': row['Branch_ID'],
                'Teacher_Email': row['Teacher_Email'],
            }
        )

# Students
def import_students():
    df = pd.read_excel(xls, 'Students')
    for _, row in df.iterrows():
        # Handle NaN values for ImagePath
        image_path = None
        if pd.notna(row['ImagePath']):
            image_path = row['ImagePath']
        
        Students.objects.get_or_create(
            Student_ID=row['Student_ID'],
            defaults={
                'Student_Name': row['Student_Name'],
                'Branch_ID_id': row['Branch_ID'],
                'Graduation_Batch': row['Graduation_Batch'],
                'Student_Email': row['Student_Email'],
                'Parents_Contact': row['Parents_Contact'] if pd.notna(row['Parents_Contact']) else None,
                'ImagePath': image_path,
            }
        )

# Users
def import_users():
    df = pd.read_excel(xls, 'Users')
    for _, row in df.iterrows():
        Users.objects.get_or_create(
            User_ID=row['User_ID'],
            defaults={
                'Password': row['Password'],
                'Role': row['Role'],
            }
        )

# Students_Current_Class (fix CLASS_ID)
def import_students_current_class():
    df = pd.read_excel(xls, 'Students_Current_Class')
    for _, row in df.iterrows():
        Students_Current_Class.objects.get_or_create(
            Student_ID_id=row['Student_ID'],
            defaults={
                'Branch_ID_id': row['Branch_ID'],
                'Semester': row['Semester'],
                'Section': row['Section'],
                'Class_ID': row['CLASS_ID'],
            }
        )



def import_teacher_subject_assignment():
    df = pd.read_excel(xls, 'Teacher_Subject_Assignment')
    for _, row in df.iterrows():
        try:
            # Check if Teacher, Subject, Class exist first
            if not Teachers.objects.filter(Teacher_ID=row['Teacher_ID']).exists():
                print(f"⚠️ Skipping TSA {row['TSA_ID']} - Teacher '{row['Teacher_ID']}' not found")
                continue
            if not Subjects.objects.filter(Subject_Code=row['Subject_Code']).exists():
                print(f"⚠️ Skipping TSA {row['TSA_ID']} - Subject '{row['Subject_Code']}' not found")
                continue
            if row['Class_ID'] and not Classes.objects.filter(Class_ID=row['Class_ID']).exists():
                print(f"⚠️ Skipping TSA {row['TSA_ID']} - Class '{row['Class_ID']}' not found")
                continue

            Teacher_Subject_Assignment.objects.get_or_create(
                TSA_ID=row['TSA_ID'],
                defaults={
                    'Teacher_ID_id': row['Teacher_ID'],
                    'Subject_Code_id': row['Subject_Code'],
                    'Semester': row['Semester'],
                    'IsElective': row['IsElective'],
                    'IsLab': row['IsLab'],
                    'Class_ID_id': row['Class_ID'] if pd.notna(row['Class_ID']) else None,
                    'Batch': row['Batch'],
                    'Teaching_Graduation_Batch': row['Teaching_Graduation_Batch'],
                }
            )
            print(f"✅ Inserted TSA {row['TSA_ID']}")
        except Exception as e:
            print(f"⚠️ Skipping TSA {row['TSA_ID']} due to error: {e}")


# Student_TSA_Enrollment
def import_student_tsa_enrollment():
    df = pd.read_excel(xls, 'Student_TSA_Enrollment')
    for _, row in df.iterrows():
        Student_TSA_Enrollment.objects.get_or_create(
            Student_ID_id=row['Student_ID'],
            TSA_ID_id=row['TSA_ID']
        )



def import_timetables():
    df = pd.read_excel(xls, 'TimeTables')
    for _, row in df.iterrows():
        try:
            # Skip if any important field missing
            if pd.isna(row['Session_ID']) or pd.isna(row['Class_ID']) or pd.isna(row['TSA_ID']):
                print(f"⚠️ Skipping Timetable {row.get('srno', 'unknown')} - Missing keys")
                continue

            # Check if related objects exist
            if not Session.objects.filter(Session_ID=row['Session_ID']).exists():
                print(f"⚠️ Skipping Timetable {row['srno']} - Session '{row['Session_ID']}' not found")
                continue
            if not Classes.objects.filter(Class_ID=row['Class_ID']).exists():
                print(f"⚠️ Skipping Timetable {row['srno']} - Class '{row['Class_ID']}' not found")
                continue
            if not Teacher_Subject_Assignment.objects.filter(TSA_ID=row['TSA_ID']).exists():
                print(f"⚠️ Skipping Timetable {row['srno']} - TSA '{row['TSA_ID']}' not found")
                continue
            if pd.notna(row['RoomNo']) and not RoomNum.objects.filter(RoomNo=row['RoomNo']).exists():
                print(f"⚠️ Skipping Timetable {row['srno']} - RoomNo '{row['RoomNo']}' not found")
                continue

            # Insert safely
            TimeTables.objects.get_or_create(
                srno=row['srno'],
                defaults={
                    'Session_ID_id': row['Session_ID'],
                    'Class_ID_id': row['Class_ID'],
                    'TSA_ID_id': row['TSA_ID'],
                    'RoomNo_id': row['RoomNo'] if pd.notna(row['RoomNo']) else None,
                }
            )
            print(f"✅ Inserted Timetable {row['srno']}")
        except Exception as e:
            print(f"⚠️ Skipping Timetable {row.get('srno', 'unknown')} due to error: {e}")



def import_attendance():
    import datetime
    df = pd.read_excel(xls, 'Attendance')  # sheet name must match

    def cast_status(val):
        # If it's already boolean, keep it.
        if isinstance(val, bool):
            return val
        if pd.isna(val):
            return None
        s = str(val).strip().lower()
        if s in ("true", "t", "1", "yes", "y", "present"):
            return True
        if s in ("false", "f", "0", "no", "n", "absent"):
            return False
        # fallback: try numeric
        try:
            return float(s) > 0.5
        except Exception:
            return None

    rows = 0
    inserted = 0
    skipped = 0

    for _, row in df.iterrows():
        rows += 1
        try:
            # required columns check (use the exact headers you showed)
            if (
                pd.isna(row['Date']) or
                pd.isna(row['Student_Id']) or
                pd.isna(row['Session_Id']) or
                pd.isna(row['Class_Id']) or
                pd.isna(row['TSA_ID'])
            ):
                print(f"⚠️ Skipping Attendance row {rows} - missing required field(s)")
                skipped += 1
                continue

            student_id = str(row['Student_Id']).strip()
            session_id = str(row['Session_Id']).strip()
            class_id   = str(row['Class_Id']).strip()
            tsa_id_raw = row['TSA_ID']

            # Validate related objects
            if not Students.objects.filter(Student_ID=student_id).exists():
                print(f"⚠️ Skipping row {rows} - Student '{student_id}' not found")
                skipped += 1
                continue

            if not Session.objects.filter(Session_ID=session_id).exists():
                print(f"⚠️ Skipping row {rows} - Session '{session_id}' not found")
                skipped += 1
                continue

            if not Classes.objects.filter(Class_ID=class_id).exists():
                print(f"⚠️ Skipping row {rows} - Class '{class_id}' not found")
                skipped += 1
                continue

            # normalize TSA_ID (could be float from Excel)
            if pd.isna(tsa_id_raw):
                print(f"⚠️ Skipping row {rows} - TSA_ID missing")
                skipped += 1
                continue
            try:
                tsa_id = int(tsa_id_raw)
            except Exception:
                tsa_id = tsa_id_raw

            if not Teacher_Subject_Assignment.objects.filter(TSA_ID=tsa_id).exists():
                print(f"⚠️ Skipping row {rows} - TSA '{tsa_id}' not found")
                skipped += 1
                continue

            # Parse/normalize Date into a date object (works with strings and datetimes)
            try:
                parsed_date = pd.to_datetime(row['Date']).date()
            except Exception as e:
                print(f"⚠️ Skipping row {rows} - can't parse Date '{row['Date']}': {e}")
                skipped += 1
                continue

            # Read status directly but cast/validate it
            status_val = cast_status(row.get('Status', row.get('Status(Present/Absent)', None)))
            if status_val is None:
                print(f"⚠️ Skipping row {rows} - undefined Status value: {row.get('Status', row.get('Status(Present/Absent)', None))}")
                skipped += 1
                continue

            # Finally insert (unique_together prevents duplicates)
            Attendance.objects.get_or_create(
                Date=parsed_date,
                Student_ID_id=student_id,
                Session_ID_id=session_id,
                defaults={
                    'Day': row['Day'],
                    'Class_ID_id': class_id,
                    'TSA_ID_id': tsa_id,
                    'Status': status_val,
                }
            )
            inserted += 1
            if inserted % 100 == 0 or rows <= 5:
                print(f"Inserted {inserted} attendance rows so far...")

        except Exception as e:
            print(f"⚠️ Error on row {rows} (student {row.get('Student_Id','?')}): {e}")
            skipped += 1
            continue

    print(f"\nDone. Processed: {rows}, Inserted: {inserted}, Skipped: {skipped}")



# 🚀 Call all imports one by one

import_branch()
import_roomnum()
import_timeslots()
import_session()
import_classes()
import_subjects()
import_teachers()
import_students()
import_users()
import_students_current_class()


import_teacher_subject_assignment()
import_student_tsa_enrollment()
import_timetables()

import_attendance()

print("✅ All data imported successfully!")
