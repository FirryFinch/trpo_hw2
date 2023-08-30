from rest_framework import serializers

from .models import Object, Class, Subclass


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'


class SubclassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subclass
        fields = '__all__'


class ObjectSerializer(serializers.ModelSerializer):
    created_by_id = serializers.HiddenField(default=serializers.CurrentUserDefault())
    created_by = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Object
        fields = '__all__'
