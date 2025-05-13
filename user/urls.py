from django.urls import path
from .views import login_view, ajax_login, admin_dashboard, user_dashboard, ajax_signup, signup_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('ajax-login/', ajax_login, name='ajax_login'),
    path('signup/', signup_view, name='signup'),
    path('ajax-signup/', ajax_signup, name='ajax_signup'),
    path('admin-dashboard/', admin_dashboard, name='admin_dashboard'),
    path('user/', user_dashboard, name='user_dashboard'), 
    path('user-dashboard/', user_dashboard, name='user_dashboard'),  
]