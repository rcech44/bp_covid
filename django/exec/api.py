from datetime import datetime
from exec.cache import *
import zlib, json
from base64 import b64encode, b64decode

class ClientAPI:
    _cached_ips = {}

    @staticmethod
    def get_data(range_from, range_to):
        cache = Cache()
        return_data = cache.get_data(range_from, range_to)

        if return_data != "error":
            # Compress (Zlib) JSON data to b64 format
            data_serialized = json.dumps(return_data)
            data_serialized_encoded = data_serialized.encode('utf-8')
            compressed = zlib.compress(data_serialized_encoded)
            compressed_b64encoded = b64encode(compressed)
            compressed_decoded = compressed_b64encoded.decode('ascii')
            encoded_result = {'encoded_data': compressed_decoded}
            return encoded_result

        return return_data
    
    @staticmethod
    def allow_request(ip):
        if ip not in ClientAPI._cached_ips:
            ClientAPI._cached_ips[ip] = datetime.now()
            return True
        
        if ip in ClientAPI._cached_ips:
            time_now = datetime.now()
            time_last_request = ClientAPI._cached_ips[ip]
            difference = (time_now - time_last_request).seconds
            if difference < 20:
                return False
            else:
                ClientAPI._cached_ips[ip] = datetime.now()
                return True
