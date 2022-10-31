"""Holds pytest fixtures to use for server testing."""
import pytest

from src.server.main import app

@pytest.fixture
def client():
    """Pytest fixture that puts our app in testing mode."""
    app.testing = True

    with app.test_client() as client:
        yield client
