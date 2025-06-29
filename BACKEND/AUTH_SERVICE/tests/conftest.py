import pytest
from unittest.mock import MagicMock
from app import app
from flask_jwt_extended import create_access_token


# ------------------------------------------------------------------
# 1) Client Flask de test (aucun serveur réel ne tourne)
# ------------------------------------------------------------------
@pytest.fixture
def client():
    app.config["TESTING"] = True          # désactive le mode production
    with app.test_client() as c:          # fournit un client Flask
        yield c                           # ← retour au test


# ------------------------------------------------------------------
# 2) Générateur de JWT réutilisable dans tous les tests
# ------------------------------------------------------------------
@pytest.fixture
def token():
    """Retourne un JWT valide (identité simulée : id = 12345)."""
    with app.app_context():
        return create_access_token(
            identity="12345",
            additional_claims={"role": "client", "email": "test@thrive.com"}
        )


# ------------------------------------------------------------------
# 3) Monkey-patch global de requests.*
# ------------------------------------------------------------------
@pytest.fixture
def mock_requests(monkeypatch):
    """
    Intercepte tous les appels requests.get/post/patch/delete effectués
    par dao_client afin d'éviter tout accès réseau.

    Utilisation dans un test :
        def test_xxx(mock_requests):
            mock_requests(status_code=400, json_data={"error": "Oops"})
    """
    def _factory(status_code=200, json_data=None):
        fake_resp = MagicMock()
        fake_resp.status_code = status_code
        fake_resp.json.return_value = json_data or {}

        # remplace chaque méthode HTTP de requests par un lambda
        for method in ("get", "post", "patch", "delete"):
            monkeypatch.setattr(f"requests.{method}", lambda *a, **kw: fake_resp)

        return fake_resp

    return _factory
