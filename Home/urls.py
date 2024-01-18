from django.conf.urls.static import static
from django.urls import path, include
from .views import Home, StoryPage, RegisterView, LoginView, LogoutView, ProfilePage, CreateStory, ChangeStory, \
    saveStory, deleteStory
from django.conf import settings

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('story/<str:story_name>', StoryPage.as_view(), name='story'),
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('profile', ProfilePage.as_view(), name='profile'),
    path('createStory', CreateStory.as_view(), name='createStory'),
    path('changeStory/<str:story_name>', ChangeStory.as_view(), name='changeStory'),
    path('saveStory', saveStory, name='saveStory'),
    path('deleteStory', deleteStory, name='deleteStory'),
    path('auth/', include('social_django.urls', namespace='social')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
