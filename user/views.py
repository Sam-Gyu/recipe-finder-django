from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.urls import reverse
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required

@require_http_methods(["GET"])
def login_view(request):
    return render(request, 'login.html')

@require_http_methods(["GET"])
def signup_view(request):
    form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

@csrf_exempt
@require_http_methods(["POST"])
def ajax_signup(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        is_admin = data.get('is_admin', False)

        if not username or not email or not password:
            return JsonResponse({'success': False, 'message': 'All fields are required.'})

        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'message': 'An account with this email already exists.'})

        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'message': 'This username is already taken.'})

        User = get_user_model()
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_admin=is_admin
        )
        
        login(request, user)
        
        if is_admin:
            redirect_url = reverse('admin_dashboard')
        else:
            redirect_url = reverse('user_dashboard')
            
        return JsonResponse({
            'success': True, 
            'message': 'Signup successful!', 
            'redirect_url': redirect_url
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An error occurred during signup: {e}'})

@csrf_exempt
@require_http_methods(["POST"])
def ajax_login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        is_admin_login = data.get('is_admin_login', False)

        if not email or not password:
            return JsonResponse({'success': False, 'message': 'Email and password are required.'})

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Invalid email or password.'})

        user = authenticate(request, username=user.username, password=password)
        if user is None:
            return JsonResponse({'success': False, 'message': 'Invalid email or password.'})

        if is_admin_login and not user.is_admin:
            return JsonResponse({'success': False, 'message': 'Admin access required.'})
        if not is_admin_login and user.is_admin:
            return JsonResponse({'success': False, 'message': 'Please use the admin login.'})

        login(request, user)
        if user.is_admin:
            redirect_url = reverse('admin_dashboard')
        else:
            redirect_url = reverse('user_dashboard')
        return JsonResponse({
            'success': True,
            'message': 'Login successful!',
            'redirect_url': redirect_url
        })
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON data received.'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'An error occurred during login: {str(e)}'}, status=500)

@login_required
def admin_dashboard(request):
    if not request.user.is_admin:
        return render(request, '403.html', status=403)
    return render(request, 'admin_dashboard.html')

@login_required
def user_dashboard(request):
    return render(request, 'user_dashboard.html')
