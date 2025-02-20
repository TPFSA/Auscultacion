from rest_framework import serializers
from .models import ExcelFile


class ExcelSerializer (serializers.ModelSerializer):
    class Meta:
        model = ExcelFile
