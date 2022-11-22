"""
WSGI config for bp project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

# import threading
# import exec.downloader as downloader
import os
import time
from django.core.wsgi import get_wsgi_application
from exec.cache import *

# Startup code
# print('Startup code executing...')
# thread = threading.Thread(target=downloader.downloader)
# thread.start()
print('[INIT] Loading cache...')
start_time = time.perf_counter()
load_cache()
end_time = time.perf_counter()
print(f"[INIT] Loading cache complete - finished in {end_time - start_time} seconds")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bp.settings')

application = get_wsgi_application()