"""
WSGI config for bp project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

# import threading
# import exec.downloader as downloader
import os
from django.core.wsgi import get_wsgi_application

# Startup code
# print('Startup code executing...')
# thread = threading.Thread(target=downloader.downloader)
# thread.start()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bp.settings')

application = get_wsgi_application()
