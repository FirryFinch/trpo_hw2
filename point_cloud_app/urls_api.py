from django.urls import path

import point_cloud_app.views_api

urlpatterns = [
    path('', point_cloud_app.views_api.listapi, name='api'),
    path('csrf/', point_cloud_app.views_api.GetCSRF.as_view(), name='api-csrf'),
    path('login/', point_cloud_app.views_api.LoginView.as_view(), name='api-login'),
    path('logout/', point_cloud_app.views_api.LogoutView.as_view(), name='api-logout'),
    path('session/', point_cloud_app.views_api.SessionView.as_view(), name='api-session'),
    path('whoami/', point_cloud_app.views_api.WhoAmI.as_view(), name='api-whoami'),
    path('classes/', point_cloud_app.views_api.ClassesView.as_view(), name='api-classes'),
    path('subclasses/', point_cloud_app.views_api.SubclassesView.as_view(), name='api-subclasses'),
    path('objects/', point_cloud_app.views_api.ObjectsView.as_view(), name='api-objects'),
]
