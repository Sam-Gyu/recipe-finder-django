from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView

urlpatterns = [
    path('superadmin/', admin.site.urls),
    path('', RedirectView.as_view(url='/login/')),
    path('', include('user.urls')),  # Include user app URLs
    path('admins/', include('admins.urls')),  # Include admin app URLs

]