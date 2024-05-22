from rest_framework import serializers
from .models import *

class ContinentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Continent
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    role_name = RoleSerializer(many=True, read_only=True)  

    class Meta:
        model = Player
        fields = ['id', 'first_name', 'last_name', 'age', 'gender', 'country_of_origin', 'role', 'role_name', 'team', 'image']
        extra_kwargs = {
            'image': {'required': False}  
        }


class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)  

    class Meta:
        model = Team
        fields = '__all__'
        extra_kwargs = {
            'image': {'required': False}  
        }

    def validate_max_players(self, value):
        if value > 7:
            raise serializers.ValidationError("The number of max players cannot exceed 7")
        return value