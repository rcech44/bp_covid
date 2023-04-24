import time
from apscheduler.schedulers.background import BackgroundScheduler
from exec.updater import *
from exec.cache import *

def start_auto_updater():
    scheduler = BackgroundScheduler()
    scheduler.add_job(Updater.update_data, 'interval', hours=1)
    scheduler.start()