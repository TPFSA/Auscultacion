from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .serializer import UserSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Autenticar al usuario
    user = authenticate(username=username, password=password)
    if user is not None:
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)

        # Serializar datos del usuario
        serializer = UserSerializer(user)

        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'user':serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'id': user.id,
    })

@api_view(['POST'])  # Cambiar GET a POST
@permission_classes([IsAuthenticated])  # Asegurar autenticación
def logout(request):
    try:
        refresh_token = request.data.get("refresh_token")  # Obtener el refresh token del request
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()  # Invalida el token agregándolo a la lista negra

        return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    """
    Endpoint to delete a user.
    Only staff users or superusers can delete other users.
    """
    try:
        user_to_delete = User.objects.get(pk=user_id)  # Get the user by ID

        # Prevent users from deleting themselves
        if user_to_delete == request.user:
            raise PermissionDenied("You cannot delete your own account.")

        # Only staff users can delete others
        if not request.user.is_staff:
            raise PermissionDenied("You do not have permission to delete users.")

        # Prevent superusers from being deleted
        if user_to_delete.is_superuser:
            raise PermissionDenied("Cannot delete superusers.")

        # Delete the user
        user_to_delete.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)