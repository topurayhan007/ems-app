# Do API requests
import http.client
import json
from urllib.parse import urlparse

class Requester():
    @staticmethod
    def request(http_method, url, body=None):
        headers = {"Content-type": "application/json"}

        parsed_url = urlparse(url)
        host = parsed_url.hostname
        port = parsed_url.port

        if port is None:
            port = 443 if parsed_url.scheme == 'https' else 80

        if body:
            body = json.dumps(body.__dict__)
        
        conn_class = http.client.HTTPSConnection if parsed_url.scheme == 'https' else http.client.HTTPConnection
        conn = conn_class(host, port)
        path = parsed_url.path
        if parsed_url.query: 
            path += '?' + parsed_url.query
        
        try:
            conn.request(http_method, path, body, headers)
            response = conn.getresponse()
            parsed_data = response.read().decode('utf-8')
            data = json.loads(parsed_data)
            return data
        except Exception as e:
            print("error: ", e)
            return e
        finally:
            conn.close()
