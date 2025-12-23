from rest_framework import serializers
from .models import Tache


class TacheSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Tache
        fields = '__all__'
