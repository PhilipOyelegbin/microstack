import unittest
from app import app

class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_summarize(self):
        response = self.app.post('/summarize', json={"content": "Hello World line extra content text processing snippet"})
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"summary", response.data)

if __name__ == '__main__':
    unittest.main()