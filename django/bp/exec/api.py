from datetime import datetime
from exec.cache import *

cached_ips = {}

def getData(range_from, range_to):
    return_data = get_cache(range_from, range_to)
    return return_data

def ip_allow_request(ip):
    if ip not in cached_ips:
        cached_ips[ip] = datetime.now()
        return True
    
    if ip in cached_ips:
        time_now = datetime.now()
        time_last_request = cached_ips[ip]
        difference = (time_now - time_last_request).seconds
        if difference < 20:
            return False
        else:
            cached_ips[ip] = datetime.now()
            return True