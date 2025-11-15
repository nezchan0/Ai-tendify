from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import os
import numpy as np
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import face_recognition

# Create your models here.

class TimeSlots(models.Model):
    TimeSlot_ID = models.CharField(max_length=5, primary_key=True)
    Start_Time = models.TimeField()
    End_Time = models.TimeField()

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.Start_Time >= self.End_Time:
            raise ValidationError("Start time must be earlier than end time")

    class Meta:
        db_table = 'TimeSlots'
        verbose_name = 'Time Slot'
        verbose_name_plural = 'Time Slots'

    def __str__(self):
        return f"{self.TimeSlot_ID} ({self.Start_Time} - {self.End_Time})"


class Session(models.Model):
    DAY_CHOICES = [
        ('MONDAY', 'Monday'),
        ('TUESDAY', 'Tuesday'),
        ('WEDNESDAY', 'Wednesday'),
        ('THURSDAY', 'Thursday'),
        ('FRIDAY', 'Friday'),
        ('SATURDAY', 'Saturday'),
        ('SUNDAY', 'Sunday'),
    ]

    Day = models.CharField(max_length=10, choices=DAY_CHOICES)
    TimeSlot_ID = models.ForeignKey(TimeSlots, on_delete=models.CASCADE, db_column='TimeSlot_ID')
    ExtraClass = models.BooleanField()
    Session_ID = models.CharField(max_length=10, primary_key=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.Session_ID:
            day_prefix = self.Day[:3]
            if self.ExtraClass:
                self.Session_ID = f"X{day_prefix}{self.TimeSlot_ID.TimeSlot_ID}"
            else:
                self.Session_ID = f"{day_prefix}{self.TimeSlot_ID.TimeSlot_ID}"
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Session'
        verbose_name = 'Session'
        verbose_name_plural = 'Sessions'

    def __str__(self):
        return f"{self.Session_ID} ({self.Day}, {'Extra' if self.ExtraClass else 'Regular'})"


class Branch(models.Model):
    Branch_ID = models.CharField(max_length=5, primary_key=True)
    Branch_Name = models.CharField(max_length=50)

    class Meta:
        db_table = 'Branch'
        verbose_name = 'Branch'
        verbose_name_plural = 'Branches'

    def __str__(self):
        return f"{self.Branch_ID} - {self.Branch_Name}"


class Classes(models.Model):
    Branch_ID = models.ForeignKey(Branch, on_delete=models.CASCADE, db_column='Branch_ID')
    Semester = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(8)])
    Section = models.CharField(max_length=1)
    Class_ID = models.CharField(max_length=8, primary_key=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.Class_ID:
            self.Class_ID = f"{self.Branch_ID.Branch_ID}{self.Semester}{self.Section}"
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Classes'
        verbose_name = 'Class'
        verbose_name_plural = 'Classes'

    def __str__(self):
        return f"{self.Class_ID} ({self.Branch_ID.Branch_Name}, Sem {self.Semester}, Sec {self.Section})"


class RoomNum(models.Model):
    ROOM_TYPE_CHOICES = [
        ('CLASSROOM', 'Classroom'),
        ('LAB', 'Lab'),
        ('STAFFROOM', 'Staff Room'),
        ('SERVERROOM', 'Server Room'),
        ('OTHER', 'Other'),
    ]

    RoomNo = models.CharField(max_length=8, primary_key=True)
    Is_A = models.CharField(max_length=10, choices=ROOM_TYPE_CHOICES)

    class Meta:
        db_table = 'RoomNum'
        verbose_name = 'Room'
        verbose_name_plural = 'Rooms'

    def __str__(self):
        return f"{self.RoomNo} ({self.Is_A})"


class Subjects(models.Model):
    Scheme = models.IntegerField()
    Semester = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(8)])
    Subject_Code = models.CharField(max_length=10, primary_key=True)
    Subject_Abbreviation = models.CharField(max_length=15, blank=True, null=True)
    Subject_Name = models.CharField(max_length=50)
    Credits = models.IntegerField()

    class Meta:
        db_table = 'Subjects'
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'

    def __str__(self):
        return f"{self.Subject_Code} - {self.Subject_Name}"


class Teachers(models.Model):
    Teacher_ID = models.CharField(max_length=12, primary_key=True)
    Teacher_Name = models.CharField(max_length=50)
    Initials = models.CharField(max_length=10)
    Branch_ID = models.ForeignKey(Branch, on_delete=models.CASCADE, db_column='Branch_ID')
    Teacher_Email = models.EmailField(max_length=50, unique=True)

    class Meta:
        db_table = 'Teachers'
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'

    def __str__(self):
        return f"{self.Teacher_ID} - {self.Teacher_Name}"


class Students(models.Model):
    Student_ID = models.CharField(max_length=12, primary_key=True)
    Student_Name = models.CharField(max_length=50)
    Branch_ID = models.ForeignKey(Branch, on_delete=models.CASCADE, db_column='Branch_ID')
    Graduation_Batch = models.IntegerField()
    Student_Email = models.EmailField(max_length=50, unique=True)
    Parents_Contact = models.CharField(max_length=15, blank=True, null=True)
    
    def student_image_path(instance, filename):
        # Get file extension
        ext = filename.split('.')[-1]
        # Create path: static/student_images/branch_id/batch/student_id.ext
        return f'student_images/{instance.Branch_ID.Branch_ID}/{instance.Graduation_Batch}/{instance.Student_ID}.{ext}'
    
    ImagePath = models.ImageField(upload_to=student_image_path, blank=True, null=True)
    face_encoding = models.BinaryField(blank=True, null=True)

    def save(self, *args, **kwargs):
        """
        Override the save method to handle image uploads and face encodings.
        
        For first-time uploads:
        1. Save the image in media folder
        2. Create and save face encodings
        
        For subsequent uploads:
        1. Delete the previous image
        2. Save the new image
        3. Create and update face encodings
        """
        # Check if this is a new student or an existing one
        is_new_student = self.pk is None
        
        # For existing students, check if the image has changed
        if not is_new_student:
            try:
                # Get the old student instance from the database
                old_student = Students.objects.get(pk=self.pk)
                
                # Check if the image has changed
                if self.ImagePath and old_student.ImagePath and self.ImagePath != old_student.ImagePath:
                    # Image has changed, we need to delete the old image
                    old_image_path = old_student.ImagePath.path
                    print(f"DEBUG: Image changed for student {self.Student_ID}")
                    print(f"DEBUG: Old image path: {old_image_path}")
                    
                    # Delete the old image file
                    if os.path.exists(old_image_path):
                        try:
                            print(f"DEBUG: Deleting old image file: {old_image_path}")
                            os.remove(old_image_path)
                            print(f"DEBUG: Old image file deleted successfully")
                        except Exception as e:
                            print(f"ERROR deleting old image file: {str(e)}")
            except Students.DoesNotExist:
                # This shouldn't happen, but just in case
                pass
        
        # First save to let Django handle the file upload
        super().save(*args, **kwargs)
        
        # Process face encoding if an image is uploaded
        if self.ImagePath:
            print(f"DEBUG: Processing face encoding for student {self.Student_ID}")
            self._process_face_encoding()
    
    def _process_face_encoding(self):
        """
        Process face encoding for the student's image.
        This method is called after the image is saved to the media folder.
        """
        try:
            # Load the image and detect faces
            image_path = self.ImagePath.path
            print(f"DEBUG: Processing image at path: {image_path}")
            
            if not os.path.exists(image_path):
                print(f"ERROR: Image file not found at {image_path}")
                return
            
            print(f"DEBUG: Loading image with face_recognition")
            image = face_recognition.load_image_file(image_path)
            
            # Find all face locations in the image
            print(f"DEBUG: Finding face locations")
            face_locations = face_recognition.face_locations(image)
            print(f"DEBUG: Found {len(face_locations)} faces in the image")
            
            if len(face_locations) == 0:
                print(f"ERROR: No face detected in the image for student {self.Student_ID}")
                return
            
            if len(face_locations) > 1:
                print(f"ERROR: Multiple faces detected in the image for student {self.Student_ID}")
                return
            
            # Get face encodings for the face in the image
            print(f"DEBUG: Generating face encodings")
            face_encodings = face_recognition.face_encodings(image, face_locations)
            print(f"DEBUG: Generated {len(face_encodings)} face encodings")
            
            # Store the face encoding
            print(f"DEBUG: Converting face encoding to bytes")
            face_encoding_bytes = face_encodings[0].tobytes()
            print(f"DEBUG: Face encoding bytes length: {len(face_encoding_bytes)}")
            
            # Update the model instance with the face encoding
            self.face_encoding = face_encoding_bytes
            
            # Save the model to store the face encoding
            print(f"DEBUG: Saving face encoding to database")
            super().save(update_fields=['face_encoding'])
            
            # Verify the face encoding was saved
            saved_student = Students.objects.get(pk=self.pk)
            if saved_student.face_encoding:
                print(f"SUCCESS: Face encoding stored for student {self.Student_ID}")
                print(f"DEBUG: Stored face encoding length: {len(saved_student.face_encoding)}")
            else:
                print(f"ERROR: Face encoding not stored for student {self.Student_ID}")
                # Try one more time with a direct database update
                print(f"DEBUG: Attempting direct database update")
                Students.objects.filter(pk=self.pk).update(face_encoding=face_encoding_bytes)
                # Verify again
                saved_student = Students.objects.get(pk=self.pk)
                if saved_student.face_encoding:
                    print(f"SUCCESS: Face encoding stored on second attempt for student {self.Student_ID}")
                else:
                    print(f"ERROR: Face encoding still not stored after second attempt for student {self.Student_ID}")
            
        except Exception as e:
            print(f"ERROR processing image for student {self.Student_ID}: {str(e)}")
            import traceback
            print(traceback.format_exc())

    def delete(self, *args, **kwargs):
        # Delete the image file when the student record is deleted
        if self.ImagePath:
            if os.path.isfile(self.ImagePath.path):
                os.remove(self.ImagePath.path)
        super().delete(*args, **kwargs)

    def has_face_encoding(self):
        """Check if the student has a valid face encoding."""
        return self.face_encoding is not None

    def get_face_encoding_status(self):
        """Get a human-readable status of the face encoding."""
        if self.face_encoding is None:
            return "No face encoding"
        try:
            # Convert binary data back to numpy array to verify it's valid
            encoding_array = np.frombuffer(self.face_encoding, dtype=np.float64)
            if len(encoding_array) == 128:  # face_recognition uses 128-dimensional encodings
                return "Valid face encoding"
            return "Invalid encoding format"
        except Exception as e:
            return f"Error checking encoding: {str(e)}"

    @classmethod
    def test_face_encoding(cls, image_path):
        """
        Test method to verify face encoding functionality.
        Returns a tuple of (success, message, encoding_bytes)
        """
        try:
            print(f"TEST: Testing face encoding with image: {image_path}")
            
            if not os.path.exists(image_path):
                return False, f"Image file not found at {image_path}", None
            
            print(f"TEST: Loading image with face_recognition")
            image = face_recognition.load_image_file(image_path)
            
            print(f"TEST: Finding face locations")
            face_locations = face_recognition.face_locations(image)
            print(f"TEST: Found {len(face_locations)} faces in the image")
            
            if len(face_locations) == 0:
                return False, "No face detected in the image", None
            
            if len(face_locations) > 1:
                return False, "Multiple faces detected in the image", None
            
            print(f"TEST: Generating face encodings")
            face_encodings = face_recognition.face_encodings(image, face_locations)
            print(f"TEST: Generated {len(face_encodings)} face encodings")
            
            print(f"TEST: Converting face encoding to bytes")
            face_encoding_bytes = face_encodings[0].tobytes()
            print(f"TEST: Face encoding bytes length: {len(face_encoding_bytes)}")
            
            return True, "Face encoding generated successfully", face_encoding_bytes
            
        except Exception as e:
            import traceback
            error_msg = f"Error testing face encoding: {str(e)}\n{traceback.format_exc()}"
            print(f"TEST ERROR: {error_msg}")
            return False, error_msg, None

    class Meta:
        db_table = 'Students'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

    def __str__(self):
        return f"{self.Student_ID} - {self.Student_Name}"


class Students_Current_Class(models.Model):
    Student_ID = models.OneToOneField(Students, on_delete=models.CASCADE, db_column='Student_ID', primary_key=True)
    Branch_ID = models.ForeignKey(Branch, on_delete=models.CASCADE, db_column='Branch_ID')
    Semester = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(8)])
    Section = models.CharField(max_length=1)
    Class_ID = models.CharField(max_length=8, editable=False)

    def save(self, *args, **kwargs):
        if not self.Class_ID:
            self.Class_ID = f"{self.Branch_ID.Branch_ID}{self.Semester}{self.Section}"
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Students_Current_Class'
        verbose_name = 'Student Current Class'
        verbose_name_plural = 'Student Current Classes'

    def __str__(self):
        return f"{self.Student_ID.Student_ID} - {self.Class_ID}"


class Teacher_Subject_Assignment(models.Model):
    IS_ELECTIVE_CHOICES = [
        ('YES', 'Yes'),
        ('NO', 'No'),
    ]
    
    IS_LAB_CHOICES = [
        ('YES', 'Yes'),
        ('NO', 'No'),
    ]

    TSA_ID = models.AutoField(primary_key=True)
    Teacher_ID = models.ForeignKey(Teachers, on_delete=models.CASCADE, db_column='Teacher_ID')
    Subject_Code = models.ForeignKey(Subjects, on_delete=models.CASCADE, db_column='Subject_Code')
    Semester = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(8)])
    IsElective = models.CharField(max_length=3, choices=IS_ELECTIVE_CHOICES)
    IsLab = models.CharField(max_length=3, choices=IS_LAB_CHOICES)
    Class_ID = models.ForeignKey(Classes, on_delete=models.SET_NULL, db_column='Class_ID', null=True, blank=True)
    Batch = models.CharField(max_length=2, blank=True, null=True)
    Teaching_Graduation_Batch = models.IntegerField()

    class Meta:
        db_table = 'Teacher_Subject_Assignment'
        verbose_name = 'Teacher Subject Assignment'
        verbose_name_plural = 'Teacher Subject Assignments'

    def __str__(self):
        return f"{self.TSA_ID} - {self.Teacher_ID.Teacher_Name} - {self.Subject_Code.Subject_Name}"


class Student_TSA_Enrollment(models.Model):
    Student_ID = models.ForeignKey(Students, on_delete=models.CASCADE, db_column='Student_ID')
    TSA_ID = models.ForeignKey(Teacher_Subject_Assignment, on_delete=models.CASCADE, db_column='TSA_ID')

    class Meta:
        db_table = 'Student_TSA_Enrollment'
        verbose_name = 'Student TSA Enrollment'
        verbose_name_plural = 'Student TSA Enrollments'
        unique_together = ('Student_ID', 'TSA_ID')

    def __str__(self):
        return f"{self.Student_ID.Student_ID} - {self.TSA_ID.TSA_ID}"


class TimeTables(models.Model):
    srno = models.AutoField(primary_key=True)
    Session_ID = models.ForeignKey(Session, on_delete=models.CASCADE, db_column='Session_ID')
    Class_ID = models.ForeignKey(Classes, on_delete=models.CASCADE, db_column='Class_ID')
    TSA_ID = models.ForeignKey(Teacher_Subject_Assignment, on_delete=models.CASCADE, db_column='TSA_ID')
    RoomNo = models.ForeignKey(RoomNum, on_delete=models.SET_NULL, db_column='RoomNo', null=True, blank=True)

    class Meta:
        db_table = 'TimeTables'
        verbose_name = 'Time Table'
        verbose_name_plural = 'Time Tables'

    def __str__(self):
        return f"{self.Session_ID.Session_ID} - {self.Class_ID.Class_ID} - {self.TSA_ID.TSA_ID}"


class Attendance(models.Model):
    DAY_CHOICES = [
        ('MONDAY', 'Monday'),
        ('TUESDAY', 'Tuesday'),
        ('WEDNESDAY', 'Wednesday'),
        ('THURSDAY', 'Thursday'),
        ('FRIDAY', 'Friday'),
        ('SATURDAY', 'Saturday'),
        ('SUNDAY', 'Sunday'),
    ]

    Date = models.DateField()
    Day = models.CharField(max_length=10, choices=DAY_CHOICES)
    Student_ID = models.ForeignKey(Students, on_delete=models.CASCADE, db_column='Student_ID')
    Session_ID = models.ForeignKey(Session, on_delete=models.CASCADE, db_column='Session_ID')
    Class_ID = models.ForeignKey(Classes, on_delete=models.CASCADE, db_column='Class_ID')
    TSA_ID = models.ForeignKey(Teacher_Subject_Assignment, on_delete=models.CASCADE, db_column='TSA_ID')
    Status = models.BooleanField()

    class Meta:
        db_table = 'Attendance'
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendance Records'
        unique_together = ('Date', 'Session_ID', 'Student_ID')

    def __str__(self):
        return f"{self.Date} - {self.Student_ID.Student_ID} - {self.Session_ID.Session_ID}"


class Users(models.Model):
    ROLE_CHOICES = [
        ('STUDENT', 'Student'),
        ('TEACHER', 'Teacher'),
        ('HOD', 'HOD'),
    ]

    User_ID = models.CharField(max_length=12, primary_key=True)
    Password = models.CharField(max_length=255)
    Role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    class Meta:
        db_table = 'Users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.User_ID} - {self.Role}"
