from datetime import datetime
from exec.cache import *

class ClientAPI:
    _cached_ips = {}

    @staticmethod
    def get_data(range_from, range_to):
        cache = Cache()
        return_data = cache.get_data(range_from, range_to)
        return return_data
    
    @staticmethod
    def allow_request(ip):
        if ip not in ClientAPI.cached_ips:
            ClientAPI._cached_ips[ip] = datetime.now()
            return True
        
        if ip in ClientAPI.cached_ips:
            time_now = datetime.now()
            time_last_request = ClientAPI._cached_ips[ip]
            difference = (time_now - time_last_request).seconds
            if difference < 20:
                return False
            else:
                ClientAPI._cached_ips[ip] = datetime.now()
                return True
