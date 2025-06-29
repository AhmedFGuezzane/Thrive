import requests
from tests.test_utils import get_auth_headers

TACHE_URL = "http://localhost:5003/taches"

def test_get_all_taches():
    # Get token headers
    headers = get_auth_headers()

    # Call /taches
    response = requests.get(TACHE_URL, headers=headers)

    # Check response
    assert response.status_code == 200
    assert isinstance(response.json(), list)
