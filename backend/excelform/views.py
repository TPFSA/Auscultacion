import pandas as pd
from django.shortcuts import render
from decimal import ROUND_HALF_UP, Decimal
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
            
            # Asegurar que la primera fila sea la cabecera correcta
            df.columns = df.iloc[0]  # Tomar la primera fila como encabezados
            df = df[1:].reset_index(drop=True)  # Eliminar la primera fila
            
            # Renombrar la primera columna a "Lectura" y la segunda a "Data"
            df = df.rename(columns={df.columns[0]: "Lectura"})
            df = df.set_index("Lectura")  # Poner "Lectura" como índice
            
            # Transformar los datos en el formato requerido
            new_columns = []
            for col in df.columns:
                try:
                    new_col = pd.to_datetime(col, dayfirst=True).strftime("%d-%m-%Y")
                except Exception:
                    new_col = col  # Mantener el nombre original si no es una fecha
                new_columns.append(new_col)

            df.columns = new_columns

            result = {}
            for index, row in df.iterrows():
                result[index] = []
                first_value = None  # Variable para guardar el primer valor
                
                for col_name, value in row.items():
                    if first_value == None:  # Guardar el primer valor
                        first_value = value

                    difference = Decimal(str(value)) - Decimal(first_value) if first_value is not None else Decimal(str(value))
                    difference = difference.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

                    result[index].append({"data": col_name, "lectura": str(value), "diferencia": str(difference)})

            return JsonResponse({'status': 'success', 'data': result})
        
        return JsonResponse({'status': 'error', 'message': 'Archivo no válido.'}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Método no permitido.'}, status=405)