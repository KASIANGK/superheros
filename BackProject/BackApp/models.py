from django.db import models
from django.core.exceptions import ValidationError


class Continent(models.Model):
    name = models.CharField(max_length=100)
    countries = models.CharField(max_length=120, default='')


class Role(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

def validate_max_players(value):
    if value > 7:
        raise ValidationError(
            f'oops 7 players max'
        )
    
class Team(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    max_players = models.IntegerField(default=7, validators=[validate_max_players])
    continent = models.ForeignKey(Continent, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='galerie/', blank=True, null=True) 


class Player(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        # ('X', 'Unkown')
    ]
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    country_of_origin = models.CharField(max_length=100)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, null=True, blank=True, on_delete=models.SET_NULL, related_name='players')
    image = models.ImageField(upload_to='galerie/', blank=True, null=True) 
    # description = models.TextField()
    # powers = models.CharField(max_length=100)


