from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('superadmin/', admin.site.urls),
    path('', RedirectView.as_view(url='/login/')),
    path('', include('user.urls')),  # Include user app URLs
    path('admins/', include('admins.urls')),  # Include admin app URLs
    path('favourites/', include('favourites.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # Serve media files in development
