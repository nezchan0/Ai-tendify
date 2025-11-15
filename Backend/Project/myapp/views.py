from django.shortcuts import render

# Create your views here.
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import face_recognition
import numpy as np
import os
from django.conf import settings

from rest_framework.decorators import api_view
from django.db.models import Count, Q
from .models import Students,Classes, Students_Current_Class, Student_TSA_Enrollment, Teacher_Subject_Assignment, Subjects, Teachers, Attendance, Users, TimeTables, Session


#Here we are getting Avereage Attendance of each Subject at run time , later we will store that in separate table and fetch from there.

class GroupPhotoRecognitionAPI(APIView):
    def post(self, request):
        try:
            # Check if image file and TSA ID are present in request
            if 'image' not in request.FILES:
                return Response(
                    {'error': 'No image file provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if 'tsa_id' not in request.data:
                return Response(
                    {'error': 'No TSA ID provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the TSA ID
            tsa_id = request.data['tsa_id']
            
            # Get the uploaded file
            uploaded_file = request.FILES['image']
            
            # Save the file temporarily with a unique name
            temp_filename = f'temp/group_photo_{uploaded_file.name}'
            file_path = default_storage.save(temp_filename, ContentFile(uploaded_file.read()))
            full_path = os.path.join(settings.MEDIA_ROOT, file_path)
            
            try:
                # Load the image
                group_image = face_recognition.load_image_file(full_path)
                
                # Find all face locations in the image
                face_locations = face_recognition.face_locations(group_image)
                
                if not face_locations:
                    return Response(
                        {'error': 'No faces found in the image'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Get face encodings for all faces in the image
                face_encodings = face_recognition.face_encodings(group_image, face_locations)
                
                # Get students enrolled in the specific TSA
                from .models import Student_TSA_Enrollment
                enrolled_students = Student_TSA_Enrollment.objects.filter(
                    TSA_ID=tsa_id
                ).select_related('Student_ID')
                
                # Dictionary to store identified students (using student ID as key to ensure uniqueness)
                identified_students_dict = {}
                
                # Compare each face in the group photo with enrolled students' encodings
                for face_encoding in face_encodings:
                    for enrollment in enrolled_students:
                        student = enrollment.Student_ID
                        if student.face_encoding:  # Check if student has face encoding
                            # Convert binary face encoding back to numpy array
                            student_encoding = np.frombuffer(student.face_encoding, dtype=np.float64)
                            
                            # Compare faces
                            matches = face_recognition.compare_faces([student_encoding], face_encoding, tolerance=0.6)
                            
                            if matches[0]:
                                # Use student ID as key to ensure uniqueness
                                student_id = student.Student_ID
                                if student_id not in identified_students_dict:
                                    identified_students_dict[student_id] = {
                                        'name': student.Student_Name,
                                        'id': student_id,
                                        'branch': student.Branch_ID.Branch_ID,
                                        'batch': student.Graduation_Batch,
                                        'attendance_status': True,  # You can modify this based on your requirements
                                        'detection_count': 1  # Count how many times this student was detected
                                    }
                                else:
                                    # Increment detection count if student was already identified
                                    identified_students_dict[student_id]['detection_count'] += 1
                                break  # Found a match for this face, move to next face
                
                # Convert dictionary to list for response
                identified_students = list(identified_students_dict.values())
                
              
                
                return Response({
                    'success': True,
         
                    'total_faces_found': len(face_locations),
                    'students_identified': len(identified_students),
                    'total_enrolled_students': enrolled_students.count(),
                    'identified_students': identified_students
                }, status=status.HTTP_200_OK)
                
            finally:
                # Clean up the temporary file
                try:
                    default_storage.delete(file_path)
                except:
                    pass
                    
        except Exception as e:
            return Response(
                {'error': f'Error processing image: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
def student_login(request):
    try:
        student_id = request.data.get('email')  # Frontend sends ID in email field
        password = request.data.get('password')

        if not student_id or not password:
            return Response({
                'status': 'error',
                'message': 'Both ID and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Users.objects.get(User_ID=student_id, Role='STUDENT')
            if student.Password == password:  # In production, use proper password hashing
                return Response({
                    'status': 'success',
                    'token': {
                        'user_id': student.User_ID,
                        'role': 'student'
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except Users.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Student not found'
            }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def teacher_login(request):
    try:
        teacher_id = request.data.get('email')  # Frontend sends ID in email field
        password = request.data.get('password')

        if not teacher_id or not password:
            return Response({
                'status': 'error',
                'message': 'Both ID and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            teacher = Users.objects.get(User_ID=teacher_id, Role='TEACHER')
            if teacher.Password == password:  # In production, use proper password hashing
                return Response({
                    'status': 'success',
                    'token': {
                        'user_id': teacher.User_ID,
                        'role': 'teacher'
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except Users.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Teacher not found'
            }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def hod_login(request):
    try:
        hod_id = request.data.get('email')  # Frontend sends ID in email field
        password = request.data.get('password')

        if not hod_id or not password:
            return Response({
                'status': 'error',
                'message': 'Both ID and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            hod = Users.objects.get(User_ID=hod_id, Role='HOD')
            if hod.Password == password:  # In production, use proper password hashing
                return Response({
                    'status': 'success',
                    'token': {
                        'user_id': hod.User_ID,
                        'role': 'hod'
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'status': 'error',
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except Users.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'HOD not found'
            }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_student_info(request, student_id):
    try:
        # Fetch student basic details
        student = Students.objects.get(Student_ID=student_id)
        student_class = Students_Current_Class.objects.get(Student_ID=student)

        # Fix the image URL to use the media URL path
        image_url = None
        if student.ImagePath:
            # Get the base URL (e.g., http://127.0.0.1:8000)
            base_url = request.build_absolute_uri('/').rstrip('/')
            # Construct the correct media URL
            image_url = f"{base_url}/media/{student.ImagePath}"

        student_info = {
            'Student_ID': student.Student_ID,
            'Student_Name': student.Student_Name,
            'Branch_ID': student.Branch_ID.Branch_ID,
            'Branch_Name': student.Branch_ID.Branch_Name,
            'Graduation_Batch': student.Graduation_Batch,
            'Student_Email': student.Student_Email,
            'Parents_Contact': student.Parents_Contact,
            'Image_URL': image_url,

            'Current_Class': {
                'Semester': student_class.Semester,
                'Section': student_class.Section,
                'Class_ID': student_class.Class_ID
            }
        }

        # Fetch subjects the student has enrolled in
        tsa_enrollments = Student_TSA_Enrollment.objects.filter(Student_ID=student)
        enrolled_subjects = []

        for enrollment in tsa_enrollments:
            tsa = enrollment.TSA_ID
            subject = tsa.Subject_Code
            teacher = tsa.Teacher_ID

            # Student's attendance in this subject
            total_classes = Attendance.objects.filter(
                TSA_ID=tsa,
                Student_ID=student,
            ).count()

            classes_attended = Attendance.objects.filter(
                TSA_ID=tsa,
                Student_ID=student,
                Status=True
            ).count()

            attendance_percentage = (classes_attended / total_classes * 100) if total_classes > 0 else 0

            # Class average attendance for this subject
            students_in_tsa = Student_TSA_Enrollment.objects.filter(
                TSA_ID=tsa
            ).values_list('Student_ID', flat=True)

            total_attendance_records = Attendance.objects.filter(
                TSA_ID=tsa,
                Student_ID__in=students_in_tsa
            ).count()

            total_present_records = Attendance.objects.filter(
                TSA_ID=tsa,
                Student_ID__in=students_in_tsa,
                Status=True
            ).count()

            average_class_attendance = (total_present_records / total_attendance_records * 100) if total_attendance_records > 0 else 0

            enrolled_subjects.append({
                'Subject_Code': subject.Subject_Code,
                'Subject_Name': subject.Subject_Name,
                'Teacher_Name': teacher.Teacher_Name,
                'TSA_ID': tsa.TSA_ID,
                'Attendance': {
                    'Total_Classes': total_classes,
                    'Classes_Attended': classes_attended,
                    'Attendance_Percentage': round(attendance_percentage, 2),
                    'Class_Average_Attendance_Percentage': round(average_class_attendance, 2)
                }
            })

        response_data = {
            'Student_Info': student_info,
            'Enrolled_Subjects': enrolled_subjects
        }

        return Response(response_data, status=200)

    except Students.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except Students_Current_Class.DoesNotExist:
        return Response({"error": "Student's current class not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_teacher_info(request, teacher_id):
    try:
        # Fetch teacher basic details
        teacher = Teachers.objects.get(Teacher_ID=teacher_id)
        
        teacher_info = {
            'Teacher_ID': teacher.Teacher_ID,
            'Teacher_Name': teacher.Teacher_Name,
            'Initials': teacher.Initials,
            'Branch_ID': teacher.Branch_ID.Branch_ID,
            'Branch_Name': teacher.Branch_ID.Branch_Name,
            'Teacher_Email': teacher.Teacher_Email
        }

        return Response(teacher_info, status=200)

    except Teachers.DoesNotExist:
        return Response({"error": "Teacher not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_teacher_schedule(request, teacher_id):
    try:
        # First get all TSA IDs for this teacher
        teacher_tsas = Teacher_Subject_Assignment.objects.filter(Teacher_ID=teacher_id)
        tsa_ids = [tsa.TSA_ID for tsa in teacher_tsas]
        
        # Get timetable entries for these TSAs
        timetable_entries = TimeTables.objects.filter(TSA_ID__in=tsa_ids).select_related(
            'Session_ID',
            'Session_ID__TimeSlot_ID',
            'Class_ID',
            'TSA_ID',
            'TSA_ID__Subject_Code',
            'RoomNo'
        )
        
        schedule = []
        for entry in timetable_entries:
            # Get all students enrolled in this TSA
            enrolled_students = Student_TSA_Enrollment.objects.filter(TSA_ID=entry.TSA_ID)
            total_students = enrolled_students.count()
            
            # Get attendance records for this specific session
            session_attendance = Attendance.objects.filter(
                TSA_ID=entry.TSA_ID,
                Session_ID=entry.Session_ID
            )
            
            # Count unique classes for this session
            total_classes = session_attendance.values('Date').distinct().count()
            
            # Calculate attendance statistics
            present_count = session_attendance.filter(Status=True).count()
            total_possible_attendance = total_classes * total_students
            attendance_percentage = (present_count / total_possible_attendance * 100) if total_possible_attendance > 0 else 0
            
            # Get recent attendance trend (last 5 classes)
            recent_attendance = session_attendance.values('Date').annotate(
                present_count=Count('id', filter=Q(Status=True)),
                total_count=Count('id')
            ).order_by('-Date')[:5]
            
            recent_trend = []
            for record in recent_attendance:
                recent_trend.append({
                    'date': str(record['Date']),
                    'attendance_percentage': round((record['present_count'] / record['total_count'] * 100), 2) if record['total_count'] > 0 else 0
                })
            
            schedule_entry = {
                
                'Day': entry.Session_ID.Day,
                'Start_Time': entry.Session_ID.TimeSlot_ID.Start_Time,
                'End_Time': entry.Session_ID.TimeSlot_ID.End_Time,
                'Is_Extra_Class': entry.Session_ID.ExtraClass,
                'Class_ID': entry.Class_ID.Class_ID,
                'Subject_Code': entry.TSA_ID.Subject_Code.Subject_Code,
                'Subject_Name': entry.TSA_ID.Subject_Code.Subject_Name,
                'Room_Number': entry.RoomNo.RoomNo if entry.RoomNo else None,
                'Is_Lab': entry.TSA_ID.IsLab,
                'Is_Elective': entry.TSA_ID.IsElective,
                'Attendance_Stats': {
                    'Total_Students': total_students,
                    'Total_Classes': total_classes,
                    'Overall_Attendance_Percentage': round(attendance_percentage, 2),
                    'Recent_Trend': recent_trend
                }
            }
            schedule.append(schedule_entry)
        
        # Sort schedule by day and time
        schedule.sort(key=lambda x: (
            ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].index(x['Day']),
            x['Start_Time']
        ))
        
        return Response({
            'teacher_id': teacher_id,
            'schedule': schedule
        }, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_tsa_students(request, tsa_id):
    try:
        # Get all students enrolled in this TSA
        enrolled_students = Student_TSA_Enrollment.objects.filter(
            TSA_ID=tsa_id
        ).select_related('Student_ID')
        
        # Prepare the response data
        students_data = [{
            'student_id': enrollment.Student_ID.Student_ID,
            'student_name': enrollment.Student_ID.Student_Name
        } for enrollment in enrolled_students]
        
        return Response(students_data, status=200)
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['GET'])
def get_teacher_analytics(request, teacher_id):
    try:
        # Get all TSA IDs for this teacher
        teacher_tsas = Teacher_Subject_Assignment.objects.filter(Teacher_ID=teacher_id)
        
        analytics = []
        for tsa in teacher_tsas:
            # Get all students enrolled in this TSA
            enrolled_students = Student_TSA_Enrollment.objects.filter(TSA_ID=tsa)
            total_students = enrolled_students.count()
            
            # Get attendance records for this TSA
            attendance_records = Attendance.objects.filter(TSA_ID=tsa)
            
            # Count unique classes (unique Date and Session_ID combinations)
            total_classes = attendance_records.values('Date', 'Session_ID').distinct().count()
            
            # Calculate attendance statistics
            present_count = attendance_records.filter(Status=True).count()
            attendance_percentage = (present_count / (total_classes * total_students) * 100) if total_classes > 0 and total_students > 0 else 0
            
            # Get subject details
            subject = tsa.Subject_Code
            session_ids = TimeTables.objects.filter(TSA_ID=tsa).values_list('Session_ID__Session_ID', flat=True)
            analytics_entry = {
                'TSA_ID': tsa.TSA_ID,
                'Subject_Code': subject.Subject_Code,
                'Subject_Name': subject.Subject_Name,
                'Is_Lab': tsa.IsLab,
                'Is_Elective': tsa.IsElective,
                'Class_ID': tsa.Class_ID.Class_ID if tsa.Class_ID else None,
                'Statistics': {
                    'Total_Students': total_students,
                    'Total_Classes': total_classes,
                    'Total_Attendance_Records': attendance_records.count(),
                    'Present_Count': present_count,
                    'Attendance_Percentage': round(attendance_percentage, 2)
                },
                'Session_IDs': list(session_ids)
            }
            analytics.append(analytics_entry)
        
        return Response({
            'teacher_id': teacher_id,
            'analytics': analytics
        }, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def mark_attendance(request):
    """
    Mark attendance for students in a specific class and TSA.

    Expected request data:
    {
        "Date": "YYYY-MM-DD",
        "Day": "DAY_OF_WEEK",
        "Session_ID": "SESSION_ID",
        "Class_ID": "CLASS_ID",
        "TSA_ID": "TSA_ID",
        "attendance_data": [
            {
                "student_id": "STUDENT_ID",
                "status": true/false
            },
            ...
        ]
    }
    """
    try:
        data = request.data
        
        # Fetch foreign key objects
        session_obj = Session.objects.get(pk=data['Session_ID'])
        class_obj = Classes.objects.get(pk=data['Class_ID'])
        tsa_obj = Teacher_Subject_Assignment.objects.get(pk=data['TSA_ID'])

        attendance_list = []

        for item in data['attendance_data']:
            student_obj = Students.objects.get(pk=item['student_id'])

            attendance = Attendance(
                Date=data['Date'],
                Day=data['Day'],
                Student_ID=student_obj,
                Session_ID=session_obj,
                Class_ID=class_obj,
                TSA_ID=tsa_obj,
                Status=item['status']
            )
            attendance_list.append(attendance)

        Attendance.objects.bulk_create(attendance_list)

        return Response({"message": "Attendance marked successfully."}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_teacher_attendance_register(request, teacher_id, tsa_id):
    try:
        # Verify that the TSA belongs to the teacher
        tsa = Teacher_Subject_Assignment.objects.get(TSA_ID=tsa_id, Teacher_ID=teacher_id)
        
        # Get all students enrolled in this TSA
        enrolled_students = Student_TSA_Enrollment.objects.filter(TSA_ID=tsa_id).select_related('Student_ID')
        
        # Get all unique dates for this TSA
        unique_dates = Attendance.objects.filter(TSA_ID=tsa_id).values('Date').distinct().order_by('Date')
        
        # Get subject details
        subject = tsa.Subject_Code
        
        # Prepare the response data
        response_data = {
            'teacher_id': teacher_id,
            'tsa_id': tsa_id,
            'subject_code': subject.Subject_Code,
            'subject_name': subject.Subject_Name,
            'class_id': tsa.Class_ID.Class_ID if tsa.Class_ID else None,
            'is_lab': tsa.IsLab,
            'is_elective': tsa.IsElective,
            'dates': [str(date['Date']) for date in unique_dates],
            'attendance_data': []
        }
        
        # For each student, get their attendance for each date
        for enrollment in enrolled_students:
            student = enrollment.Student_ID
            student_data = {
                'student_id': student.Student_ID,
                'student_name': student.Student_Name,
                'attendance': {}
            }
            
            # Get attendance records for this student
            attendance_records = Attendance.objects.filter(
                TSA_ID=tsa_id,
                Student_ID=student.Student_ID
            ).values('Date', 'Status')
            
            # Create a dictionary of date -> status
            attendance_dict = {str(record['Date']): record['Status'] for record in attendance_records}
            
            # Fill in attendance status for each date
            for date in response_data['dates']:
                student_data['attendance'][date] = attendance_dict.get(date, None)  # None means no record
            
            response_data['attendance_data'].append(student_data)
        
        return Response(response_data, status=200)

    except Teacher_Subject_Assignment.DoesNotExist:
        return Response({"error": "TSA not found or does not belong to the teacher"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_hod_info(request, teacher_id):
    try:
        # Fetch HOD basic details from Teachers table
        hod = Teachers.objects.get(Teacher_ID=teacher_id)
        
        hod_info = {
            'Teacher_ID': hod.Teacher_ID,
            'Teacher_Name': hod.Teacher_Name,
            'Initials': hod.Initials,
            'Branch_ID': hod.Branch_ID.Branch_ID,
            'Branch_Name': hod.Branch_ID.Branch_Name,
            'Teacher_Email': hod.Teacher_Email
        }

        return Response(hod_info, status=200)

    except Teachers.DoesNotExist:
        return Response({"error": "HOD not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_department_analytics(request, teacher_id):
    try:
        # Get the HOD's branch
        hod = Teachers.objects.get(Teacher_ID=teacher_id)
        branch_id = hod.Branch_ID.Branch_ID
        
        # Get all students in the department
        department_students = Students.objects.filter(Branch_ID=branch_id)
        total_students = department_students.count()
        
        # Get current class information for all students
        current_classes = Students_Current_Class.objects.filter(Branch_ID=branch_id)
        
        # Count students by semester
        semester_counts = {}
        class_counts = {}
        
        for student_class in current_classes:
            # Count by semester
            semester = student_class.Semester
            if semester in semester_counts:
                semester_counts[semester] += 1
            else:
                semester_counts[semester] = 1
                
            # Count by class ID
            class_id = student_class.Class_ID
            if class_id in class_counts:
                class_counts[class_id] += 1
            else:
                class_counts[class_id] = 1
        
        # Calculate attendance statistics for each semester
        semester_attendance = {}
        for semester in semester_counts.keys():
            # Get all students in this semester
            semester_students = current_classes.filter(Semester=semester)
            student_ids = [sc.Student_ID.Student_ID for sc in semester_students]
            
            # Get attendance records for these students
            attendance_records = Attendance.objects.filter(Student_ID__in=student_ids)
            
            # Calculate attendance percentage
            total_attendance = attendance_records.count()
            present_attendance = attendance_records.filter(Status=True).count()
            
            attendance_percentage = (present_attendance / total_attendance * 100) if total_attendance > 0 else 0
            
            semester_attendance[semester] = {
                'total_students': semester_counts[semester],
                'attendance_percentage': round(attendance_percentage, 2)
            }
        
        # Calculate attendance statistics for each class
        class_attendance = {}
        for class_id in class_counts.keys():
            # Get all students in this class
            class_students = current_classes.filter(Class_ID=class_id)
            student_ids = [sc.Student_ID.Student_ID for sc in class_students]
            
            # Get attendance records for these students
            attendance_records = Attendance.objects.filter(Student_ID__in=student_ids)
            
            # Calculate attendance percentage
            total_attendance = attendance_records.count()
            present_attendance = attendance_records.filter(Status=True).count()
            
            attendance_percentage = (present_attendance / total_attendance * 100) if total_attendance > 0 else 0
            
            class_attendance[class_id] = {
                'total_students': class_counts[class_id],
                'attendance_percentage': round(attendance_percentage, 2)
            }
        
        # Prepare response data
        response_data = {
            'branch_id': branch_id,
            'branch_name': hod.Branch_ID.Branch_Name,
            'total_students': total_students,
            'semester_analytics': semester_attendance,
            'class_analytics': class_attendance
        }
        
        return Response(response_data, status=200)
        
    except Teachers.DoesNotExist:
        return Response({"error": "HOD not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_department_tsa_analytics(request, teacher_id):
    try:
        # Get the HOD's branch
        hod = Teachers.objects.get(Teacher_ID=teacher_id)
        branch_id = hod.Branch_ID.Branch_ID
        
        # Get all current TSAs from Student_TSA_Enrollment
        current_tsa_ids = Student_TSA_Enrollment.objects.values_list('TSA_ID', flat=True).distinct()
        
        # Get TSA details for these IDs
        tsa_details = Teacher_Subject_Assignment.objects.filter(
            TSA_ID__in=current_tsa_ids,
            Teacher_ID__Branch_ID=branch_id  # Only TSAs from this branch
        ).select_related(
            'Teacher_ID',
            'Subject_Code',
            'Class_ID'
        )
        
        tsa_analytics = []
        
        for tsa in tsa_details:
            # Get all students enrolled in this TSA
            enrolled_students = Student_TSA_Enrollment.objects.filter(TSA_ID=tsa.TSA_ID)
            total_students = enrolled_students.count()
            
            # Get student IDs
            student_ids = [enrollment.Student_ID.Student_ID for enrollment in enrolled_students]
            
            # Get attendance records for these students in this TSA
            attendance_records = Attendance.objects.filter(
                TSA_ID=tsa.TSA_ID,
                Student_ID__in=student_ids
            )
            
            # Calculate attendance percentage
            total_attendance = attendance_records.count()
            present_attendance = attendance_records.filter(Status=True).count()
            
            attendance_percentage = (present_attendance / total_attendance * 100) if total_attendance > 0 else 0
            
            # Prepare TSA analytics entry
            tsa_entry = {
                'tsa_id': tsa.TSA_ID,
                'semester': tsa.Semester,
                'teacher_id': tsa.Teacher_ID.Teacher_ID,
                'teacher_name': tsa.Teacher_ID.Teacher_Name,
                'subject_code': tsa.Subject_Code.Subject_Code,
                'subject_name': tsa.Subject_Code.Subject_Name,
                'class_id': tsa.Class_ID.Class_ID if tsa.Class_ID else None,
                'is_lab': tsa.IsLab,
                'is_elective': tsa.IsElective,
                'total_students': total_students,
                'attendance_percentage': round(attendance_percentage, 2)
            }
            
            tsa_analytics.append(tsa_entry)
        
        # Sort by semester and class ID
        tsa_analytics.sort(key=lambda x: (x['semester'], x['class_id'] or ''))
        
        return Response({
            'branch_id': branch_id,
            'branch_name': hod.Branch_ID.Branch_Name,
            'tsa_analytics': tsa_analytics
        }, status=200)
        
    except Teachers.DoesNotExist:
        return Response({"error": "HOD not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)




