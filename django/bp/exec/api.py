from datetime import datetime, timedelta
import sqlite3
import sys
from exec.cache import *

def getData(range_from, range_to, type):
    return_data = get_cache(range_from, range_to)
    return return_data