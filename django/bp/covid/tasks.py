from apscheduler.schedulers.background import BackgroundScheduler
from exec.updater import *

def start_auto_updater():
    scheduler = BackgroundScheduler()
    scheduler.add_job(Updater.update_data, 'interval', minutes=2)
    scheduler.start()