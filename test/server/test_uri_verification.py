"""Test module for URI verification."""
import unittest

from src.server.validator import validate_uri

class UriVerificationTest(unittest.TestCase):
    """Test Class for all URI verification related tests."""

    def test_valid_songs(self):
        """
        Tests the uri validator with a list of uris for which the responses should all be true.

        :return: n/a
        """
        print("\nTesting valid song URIs")
        valid_uris = ["spotify:track:5YZuePCawcrg0DJrWovPu7",
                    "spotify:track:3Ofmpyhv5UAQ70mENzB277",
                    "spotify:track:0qcr5FMsEO85NAQjrlDRKo",
                    "spotify:track:1IHWl5LamUGEuP4ozKQSXZ"]

        for uri in valid_uris:
            self.assertTrue(validate_uri(uri), "Valid URI rejected as false. URI: " + uri)

        print("All valid song URIs passed verification.")

    def test_non_song_uris(self):
        """
        Tests the uri validator with a list of valid URIs for non-song entities. All should fail.

        :return: n/a
        """
        # Alternative format, valid URIs
        print("\nTesting correct URIs, for invalid file formats: songs, artists, etc.")
        non_song_uris = ["spotify:episode:5k48pHc91z9jgzJBAffpxT", "spotify:episode:6q15rdB4spyNp8GukRgrRz",
                         "spotify:album:3RQQmkQEvNCY4prGKE6oc5",
                         "spotify:artist:4pQN0GB0fNEEOfQCaWotsY", "spotify:playlist:2pCngqgghHLImIwVBEoyre",
                         "spotify:user:4dbxzew114d90yduzzpxtzpxv"]

        for uri in non_song_uris:
            self.assertFalse(validate_uri(uri), "Non-Song, valid uri returned true. URI: " + uri)

        print("All non-song URIs did not pass verification.")

    def test_bad_format_uris(self):
        """
        Tests the uri validator with a list of badly formatted uris. All should return false.

        :return: n/a
        """
        # Poorly formatted URIs
        print("\nTesting poorly formatted URIs.")
        bad_format_uris = [
                "", "spootify:track:5YZuePCawcrg0DJrWovPu7",
                "spotify:track:5YZuePCawcrspotify:track:5YZuePCawcrg0DJrWovPu7g0DJrWovPu7spotify:track:5YZuePCawcrg0DJrWovPu7"]

        for uri in bad_format_uris:
            self.assertFalse(validate_uri(uri), "Incorrectly formatted track uri returned true. URI: " + uri)

        print("All bad format URIs did not pass verification.")

    def test_invalid_song_uris(self):
        """
        Tests the uri validator with a list of correctly formatted, but invalid song uri ids. All should fail.

        :return: n/a
        """
        # Invalid URIs
        print("\nTesting correctly formatted, invalid URIs")
        invalid_uris = ["spotify:track:4YZuePCawcrg0DJrWovPu7",
                        "spotify:track:1IHWl5LamUGEuP4ozKQSXY",
                        "spotify:track:2Ofmpyhv5UAQ70mENzB277"]

        for uri in invalid_uris:
            self.assertFalse(validate_uri(uri), "Valid format, incorrect URI returned true. URI: " + uri)

        print("All correct format, invalid song URIs failed verification.")
