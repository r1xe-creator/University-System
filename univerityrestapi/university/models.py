from django.db import models
import string
import random
from django.core.validators import MaxValueValidator, MinValueValidator

def student_id_generator():
    """
    Generate a random unique id string entirely of numbers of length 8
    Cannot start with 0 or already exist as a student id
    """
    while True:
        s_id = ''.join(random.choice(string.digits) for _ in range(8))
        if not s_id.startswith("0") and not Student.objects.filter(student_id=s_id).exists():
            return s_id

class Degree(models.Model):
    full_name = models.TextField()
    shortcode = models.CharField(max_length=5, primary_key=True, unique=True)

    def __str__(self):
        return self.shortcode

class Cohort(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    year = models.PositiveIntegerField(default=1, validators=[MaxValueValidator(4), MinValueValidator(1)])
    degree = models.ForeignKey(Degree, on_delete=models.CASCADE)

    def __str__(self):
        def ordinal(n: int):
            if 11 <= (n % 100) <= 13:
                suffix = 'th'
            else:
                suffix = ['th', 'st', 'nd', 'rd', 'th'][min(n % 10, 4)]
            return str(n) + suffix
        return "{} year {}".format(ordinal(self.year), self.degree.full_name)

    def name(self):
        return str(self)

class Student(models.Model):
    student_id = models.CharField(max_length=8, default=student_id_generator, primary_key=True)
    first_name = models.TextField()
    last_name = models.TextField()
    cohort = models.ForeignKey(Cohort, on_delete=models.CASCADE)

    def email(self):
        return "{}.{}@dcu.ie".format(self.first_name.lower(), self.last_name.lower())

    def __str__(self):
        return "{} - {}".format(self.student_id, self.email())

class Module(models.Model):
    code = models.CharField(max_length=5, primary_key=True, unique=True)
    full_name = models.TextField()
    delivered_to = models.ManyToManyField(Cohort)
    ca_split = models.IntegerField(default=0)

    def __str__(self):
        return self.code

class Grade(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    ca_mark = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(100)])

    def __str__(self):
        return f"{self.student} - {self.module}: {self.ca_mark}"