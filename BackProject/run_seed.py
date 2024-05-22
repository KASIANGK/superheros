import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackProject.settings')

django.setup()

from BackApp.seed import run_continent, run_roles, run_teams, run_players

if __name__ == "__main__":
        run_continent()
        run_roles()
        run_teams()
        run_players()
