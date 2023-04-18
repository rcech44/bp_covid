"""
WSGI config for bp project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os
import time
from django.core.wsgi import get_wsgi_application
from exec.cache import *

# Startup code
print('[INIT] Loading cache...')
start_time = time.perf_counter()
cache = Cache()
cache.update_data(None)
end_time = time.perf_counter()
print(f"[INIT] Loading cache complete - finished in {end_time - start_time} seconds")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bp.settings')

application = get_wsgi_application()