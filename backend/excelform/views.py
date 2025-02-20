import pandas as pd
from django.shortcuts import render
from django.http import JsonResponse
from .forms import ExcelUploadForm
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def process_excel(request):
    if request.method == "POST":
        form = ExcelUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['file']
            
            df = pd.read_excel(file, engine='openpyxl')

            if 'A' in df.columns and 'B' in df.columns:
                df['result'] = (df['A'] + df['B']) * 100
                result = df[['A', 'B', 'result']].to_dict(orient='records')
                return JsonResponse({'status': 'success', 'data': result})

            return JsonResponse({'status': 'error', 'message': 'Las columnas A y B no están en el archivo.'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'}, status=405)
