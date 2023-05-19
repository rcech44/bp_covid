from django.apps import AppConfig
import time
import os
from exec.cache import *
from exec.updater import *
from covid import tasks


class CovidConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'covid'

    def ready(self):

        # Django testing environment launches two instances -> only launch if main instance
        if os.environ.get('RUN_MAIN'):

            # Startup code - load cache
            print('[BOOT] Loading cache...')
            start_time = time.perf_counter()
            cache = Cache()
            # cache.update_data(None)
            end_time = time.perf_counter()
            print(f"[BOOT] Loading cache complete - finished in {end_time - start_time} seconds")

            # Startup code - update data
            print('[BOOT] Updating covid data... (may take a while after long app inactivity)')
            start_time = time.perf_counter()
            # Updater.update_data()
            end_time = time.perf_counter()
            print(f"[BOOT] Updating covid data complete - finished in {end_time - start_time} seconds")

            # Start updater task - automatically every hour try to update data
            tasks.start_auto_updater()
            print('[BOOT] Started automatic data updater')