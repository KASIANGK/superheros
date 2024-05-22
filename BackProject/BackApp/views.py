from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.http import JsonResponse
from django.core.serializers import serialize
from rest_framework import status
from rest_framework.views import exception_handler
from django.db.models import Count
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid


# VIEWS APIS ROLES, CONTINENTS, TEAMS & PLAYERS

def api_roles(request):
    roles = Role.objects.all()
    roles_serializer = RoleSerializer(roles, many=True)

    data = {
        'roles': roles_serializer.data,
    }
    return JsonResponse({'data': data}, safe=False)

def api_continents(request):
    continents = Continent.objects.all()
    continents_serializer = ContinentSerializer(continents, many=True)

    data = {
        'continents': continents_serializer.data,
    }
    return JsonResponse({'data': data}, safe=False)

def api_teams(request):
    teams = Team.objects.all()
    teams_serializer = TeamSerializer(teams, many=True)

    data = {
        'teams': teams_serializer.data,
    }
    return JsonResponse({'data': data}, safe=False)

def api_players(request):
    players = Player.objects.all()
    players_serializer = PlayerSerializer(players, many=True)

    data = {
        'players': players_serializer.data,
    }
    return JsonResponse({'data': data}, safe=False)


# VIEWS POUR DETAILS TEAM ET PLAYERS

def team_players(request, team_id):
    team = Team.objects.get(id=team_id)
    players = team.players.all()

    players_data = serialize('json', players) 

    return JsonResponse({'players': players_data}, safe=False)



def player_details(request, player_id):
    try:
        player = Player.objects.get(id=player_id)
        player_serializer = PlayerSerializer(player)
        return JsonResponse({'data': player_serializer.data}, safe=False)
    except Player.DoesNotExist:
        return JsonResponse({'error': 'Player not found'}, status=404)
    

def team_details(request, team_id):
    try:
        team = Team.objects.get(id=team_id)
        team_serializer = TeamSerializer(team)
        return JsonResponse({'data': team_serializer.data}, safe=False)
    except Player.DoesNotExist:
        return JsonResponse({'error': 'Team not found'}, status=404)
    

# VIEWS CREATE 


@api_view(['POST'])
def create_player(request):
    try:
        serializer = PlayerSerializer(data=request.data)
        if serializer.is_valid():
            player = serializer.save()
            if 'image' in request.FILES:
                player.image = request.FILES['image']
                player.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def create_team(request):
    serializer = TeamSerializer(data=request.data)
    if serializer.is_valid():
        team = serializer.save()
        if 'image' in request.FILES:
            team.image = request.FILES['image']
            team.save()
        return Response({'Success': 'Team created successfully'})
    return Response(serializer.errors, status=400)


# VIEWS UPDATE

@api_view(['GET', 'PUT'])
def update_team(request, pk):
    try:
        team = Team.objects.get(pk=pk)
        
        if request.method == 'GET':
            serializer = TeamSerializer(team)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            serializer = TeamSerializer(team, data=request.data, partial=True)
            if serializer.is_valid():
                if 'image' in request.FILES:
                    team.image = request.FILES['image']
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
    except Team.DoesNotExist:
        return Response({'error': 'Team not found'}, status=404)


@api_view(['GET', 'PUT'])
def update_player(request, pk):
    try:
        player = Player.objects.get(pk=pk)
        
        if request.method == 'GET':
            serializer = PlayerSerializer(player)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            serializer = PlayerSerializer(player, data=request.data, partial=True)
            if serializer.is_valid():
                if 'image' in request.FILES:
                    player.image = request.FILES['image']
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
    except Player.DoesNotExist:
        return Response({'error': 'Player not found'}, status=404)

# VIEWS DELETE

# @api_view(['DELETE'])
# def delete_team(request, pk):
#     try:
#         team = Team.objects.get(pk=pk)
#     except Team.DoesNotExist:
#         return Response(status=404)

#     team.delete()
#     return Response(status=204)

# @api_view(['DELETE'])
# def delete_player(request, pk):
#     try:
#         player = Player.objects.get(pk=pk)
#     except Player.DoesNotExist:
#         return Response(status=404)

#     player.delete()
#     return Response(status=204)
    
@api_view(['DELETE'])
def delete_team(request, pk):
    try:
        team = Team.objects.get(pk=pk)
    except Team.DoesNotExist:
        return Response(status=404)

    if team.image:
        image_path = team.image.path
        default_storage.delete(image_path)

    team.delete()
    return Response(status=204)


@api_view(['DELETE'])
def delete_player(request, pk):
    try:
        player = Player.objects.get(pk=pk)
    except Player.DoesNotExist:
        return Response(status=404)

    if player.image:
        image_path = player.image.path
        if default_storage.exists(image_path):
            try:
                default_storage.delete(image_path)
                print("Image deleted successfully")
            except Exception as e:
                print("Error deleting image:", str(e))

    player.delete()
    return Response(status=204)


# VIEW HOME

def home(request):

    # - annotate() -  méthode pour ajouter un champ annoté (annotation = 'player_count')
    # cette annotation peut ensuite être utilisée pour filtrer ou manipuler les résultats de la requête
    # - Count - compte le nbre de joueurs dans chaque Team
    # - filter() - filtre les Teams pour ne garder que celles avec 12 joueurs
    teams_full = Team.objects.annotate(player_count=Count('players')).filter(player_count__gt=6)

    # - lt - opérateur de recherche "less than"
    # - '__' - 1. pour accéder aux champs des modèles, y compris ForeignKey, OneToOne..
    # 2. pour appliquer des filtres spécifiques aux champs, comme les comparaisons (lt, lte, gt, gte), les correspondances (exact, iexact, contains, icontains)...
    # - [:2] - limite le résultat aux 2 premières Teams
    teams_not_full = Team.objects.annotate(player_count=Count('players')).filter(player_count__lt=3)[:3]

    # - .order_by('?') - expression pour ordonner les résultats de la requête de manière random
    players_without_team = Player.objects.filter(team__isnull=True).order_by('?')[:4]
    players_with_team = Player.objects.filter(team__isnull=False).order_by('?')[:4]
    europe_teams = Team.objects.filter(continent__name='Europe')
    non_europe_teams = Team.objects.exclude(continent__name='Europe')
    female_players_with_team = Player.objects.filter(gender='F', team__isnull=False).order_by('?')[:5]
    male_players_with_team = Player.objects.filter(gender='M', team__isnull=False).order_by('?')[:5]


    

    data = {
        # - list() - fonction pour convertir QuerySet en une liste Python, pour pouvoir inclure ces données dans le dictionnaire data qui sera ensuite converti en JSON
        'teams_full': list(teams_full.values('id', 'name', 'city', 'country', 'image')),
        'teams_not_full': list(teams_not_full.values('id','name', 'city', 'country', 'image')),
        'players_without_team': list(players_without_team.values('id','first_name', 'last_name', 'role__name', 'image')),
        'players_with_team': list(players_with_team.values('id','first_name', 'last_name', 'role__name', 'team__name', 'image')),
        'europe_teams': list(europe_teams.values('id','name', 'city', 'country', 'image')),
        'non_europe_teams': list(non_europe_teams.values('id','name', 'city', 'country', 'image')),
        'female_players_with_team': list(female_players_with_team.values('id','first_name', 'last_name', 'role__name', 'team__name', 'image')),
        'male_players_with_team': list(male_players_with_team.values('id','first_name', 'last_name', 'role__name', 'team__name', 'image')),
    }

    return JsonResponse(data)





