from django_seed import Seed
from .models import *
import random
from faker import Faker
import os
from django.core.files.uploadedfile import SimpleUploadedFile


def run_roles():
    seeder = Seed.seeder()

    role_names = ["leader", "wizard", "archer", "fighter"]

    for name in role_names:
        seeder.add_entity(Role, 1, {'name': name})

    pks = seeder.execute()
    print("Roles created:", pks)



def run_continent():
    seeder = Seed.seeder()
    fake = Faker()

    continent_names = [
        "Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"
    ]

    for name in continent_names:
        seeder.add_entity(Continent, 1, {

# 'name': : C'est la clé du dictionnaire qui correspond au champ name de l'entité Continent.
# lambda x, name=name: : Ceci définit une fonction lambda avec deux arguments :
# x : Un argument positionnel qui sera fourni par le seeder (dans ce contexte, il n'est pas utilisé).
# name=name : Un argument par défaut. Ici, name=name capture la valeur actuelle de name au moment où la lambda est définie.
# name : signifie que la lambda renverra la valeur de name capturée au moment de sa définition.
            
            'name': lambda x, name=name: name,
            'countries': lambda x: ', '.join(fake.country() for _ in range(5)),  
        })

    pks = seeder.execute()
    print("Continents created:", pks)


def run_teams():
    seeder = Seed.seeder()
    fake = Faker()

    continents = Continent.objects.all()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    image_paths = [
        os.path.join(base_dir, 'media', 'galerie', 'Novaaa.png'),
        os.path.join(base_dir, 'media', 'galerie', 'Eclipsee.png'),
        os.path.join(base_dir, 'media', 'galerie', 'Phoenixx.png'),
        os.path.join(base_dir, 'media', 'galerie', 'Starforcee.png')
    ]

    team_data = [
        {"name": "Nova Brigade", "city": "Tokyo", "country": "Japan", "continent": "Asia", "image_path": image_paths[0]},
        {"name": "Eclipse League", "city": "NY", "country": "USA", "continent": "North America", "image_path": image_paths[1]},
        {"name": "Phoenix Ascendants", "city": "Warsaw", "country": "Poland", "continent": "Europe", "image_path": image_paths[2]},
        {"name": "Starforce Alliance", "city": "Brussels", "country": "Belgium", "continent": "Europe", "image_path": image_paths[3]},
    ]   

    for data in team_data:
        continent = continents.filter(name=data['continent']).first()
        if continent:
            with open(data['image_path'], 'rb') as image:
                seeder.add_entity(Team, 1, {
                    'name': data['name'],
                    'city': data['city'],
                    'country': data['country'],
                    'continent': continent,
                    'max_players': 7,
                    'image': SimpleUploadedFile(data['image_path'].split('/')[-1], image.read()),  
                })

    pks = seeder.execute()
    print("Teams created:", pks)




def run_players():
    seeder = Seed.seeder()
    fake = Faker()

    roles = {role.name: role for role in Role.objects.all()}
    teams = {team.name: team for team in Team.objects.all()}

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    player_data = [
        {"first_name": "Harley", "last_name": "Quinn", "age": 34, "gender": "F", "country_of_origin": "DC Comics", "role": roles["fighter"], "team": teams["Nova Brigade"], "image": os.path.join(base_dir, 'media', 'galerie', 'HarleyQuinn.jpg')},
        {"first_name": "Deadpool", "last_name": "", "age": 17, "gender": "M", "country_of_origin": "Marvel", "role": roles["fighter"], "team": teams["Nova Brigade"], "image": os.path.join(base_dir, 'media', 'galerie', 'DeadPool.jpg')},
        {"first_name": "Dark", "last_name": "Vador", "age": 41, "gender": "M", "country_of_origin": "Star Wars", "role": roles["leader"], "team": teams["Starforce Alliance"], "image": os.path.join(base_dir, 'media', 'galerie', 'DarkVador.jpg')},
        {"first_name": "Trinity", "last_name": "", "age": 33, "gender": "F", "country_of_origin": "Matrix", "role": roles["fighter"], "team": teams["Starforce Alliance"], "image": os.path.join(base_dir, 'media', 'galerie', 'Trinity.jpg')},
        {"first_name": "Catwoman", "last_name": "", "age": 17, "gender": "F", "country_of_origin": "DC Comics", "role": roles["fighter"], "team": teams["Starforce Alliance"], "image": os.path.join(base_dir, 'media', 'galerie', 'Cat.jpg')},
        {"first_name": "Geralt", "last_name": "de Riv", "age": 38, "gender": "N", "country_of_origin": "Witcher", "role": roles["wizard"], "team": teams["Starforce Alliance"], "image": os.path.join(base_dir, 'media', 'galerie', 'Wiedzmin.jpg')},
        {"first_name": "Professor", "last_name": "Snape", "age": 43, "gender": "M", "country_of_origin": "England", "role": roles["wizard"], "team": teams["Phoenix Ascendants"], "image": os.path.join(base_dir, 'media', 'galerie', 'Snape.jpg')},
        {"first_name": "Joker", "last_name": "", "age": 47, "gender": "M", "country_of_origin": "DC Comics", "role": roles["fighter"], "team": teams["Starforce Alliance"], "image": os.path.join(base_dir, 'media', 'galerie', 'Joker.jpg')},
        {"first_name": "Wonder", "last_name": "Woman", "age": 32, "gender": "F", "country_of_origin": "DC Comics", "role": roles["fighter"], "team": teams["Starforce Alliance"], "image": os.path.join(base_dir, 'media', 'galerie', 'WW.jpg')},
        {"first_name": "Neo", "last_name": "Anderson", "age": 32, "gender": "M", "country_of_origin": "Matrix", "role": roles["leader"], "team": teams["Starforce Alliance"], "image": os.path.join(base_dir, 'media', 'galerie', 'Neo.jpg')},
        {"first_name": "Beatrix", "last_name": "", "age": 44, "gender": "F", "country_of_origin": "England", "role": roles["wizard"], "team": teams["Nova Brigade"], "image": os.path.join(base_dir, 'media', 'galerie', 'Beatrix.jpg')},
        {"first_name": "The", "last_name": "Mask", "age": 34, "gender": "M", "country_of_origin": "NY", "role": roles["fighter"], "team": teams["Phoenix Ascendants"], "image": os.path.join(base_dir, 'media', 'galerie', 'Po.jpg')},
        {"first_name": "Rey", "last_name": "", "age": 22, "gender": "F", "country_of_origin": "Star Wars", "role": roles["fighter"], "team": teams["Eclipse League"], "image": os.path.join(base_dir, 'media', 'galerie', 'RICK.jpg')},
        {"first_name": "Princess", "last_name": "Peach", "age": 19, "gender": "F", "country_of_origin": "Nintendo", "role": roles["wizard"], "team": teams["Nova Brigade"], "image": os.path.join(base_dir, 'media', 'galerie', 'Peach.jpg')},
        {"first_name": "Jeff", "last_name": "Albertson", "age": 38, "gender": "M", "country_of_origin": "Springfield", "role": roles["fighter"], "team": teams["Nova Brigade"], "image": os.path.join(base_dir, 'media', 'galerie', 'Bart.jpg')},
        {"first_name": "Hisoka", "last_name": "x", "age": 38, "gender": "F", "country_of_origin": "GoT", "role": roles["leader"], "team": teams["Nova Brigade"], "image": os.path.join(base_dir, 'media', 'galerie', 'Hisoka.jpg')},
    ]

    for data in player_data:
        role = data["role"]
        team = data["team"]
        if role and team:
            with open(data['image'], 'rb') as image_file:
                image = SimpleUploadedFile(data['image'].split('/')[-1], image_file.read())
                seeder.add_entity(Player, 1, {
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'age': data['age'],
                    'gender': data['gender'],
                    'country_of_origin': data['country_of_origin'],
                    'role': role,
                    'team': team,
                    'image': image,
                })

    pks = seeder.execute()
    print("Players created:", pks)


def run():
    run_continent()
    run_players()
    run_roles()
    run_teams

