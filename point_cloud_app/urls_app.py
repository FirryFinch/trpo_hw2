from django.urls import path
from django.contrib.auth.decorators import login_required
from point_cloud_app.views_app import \
    LoginUser, logout_user, \
    main, \
    entities_classes, new_class, EditClass, delete_class, \
    entities_subclasses, new_subclass, EditSubclass, delete_subclass,\
    entities_objects, new_object, EditObject, delete_object, \
    entities_files, new_file, EditFile, delete_file, \
    users \


urlpatterns = [
    path('', main, name='main'),

    path('login/', LoginUser.as_view(), name='login'),
    path('logout/', logout_user, name='logout'),

    path('entities/classes', entities_classes, name='entities_classes'),
    path('entities/classes/new', new_class, name='new_class'),
    path('entities/classes/edit/<int:pk>', login_required(EditClass.as_view()), name='edit_class'),
    path('entities/classes/delete/<int:pk>', delete_class, name='delete_class'),

    path('entities/subclasses', entities_subclasses, name='entities_subclasses'),
    path('entities/subclasses/new', new_subclass, name='new_subclass'),
    path('entities/subclasses/edit/<int:pk>', login_required(EditSubclass.as_view()), name='edit_subclass'),
    path('entities/subclasses/delete/<int:pk>', delete_subclass, name='delete_subclass'),

    path('entities/objects', entities_objects, name='entities_objects'),
    path('entities/objects/new', new_object, name='new_object'),
    path('entities/objects/edit/<int:pk>', login_required(EditObject.as_view()), name='edit_object'),
    path('entities/objects/delete/<int:pk>', delete_object, name='delete_object'),

    path('entities/files/', entities_files, name='entities_files'),
    path('entities/files/new', new_file, name='new_file'),
    path('entities/files/edit/<int:pk>', login_required(EditFile.as_view()), name='edit_file'),
    path('entities/files/delete/<int:pk>', delete_file, name='delete_file'),

    path('users/', users, name='users'),
]

