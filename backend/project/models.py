from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    title = models.CharField(max_length=100)
    creation_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

def __str__(self):
        return self.title 