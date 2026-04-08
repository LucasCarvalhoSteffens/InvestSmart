from django.test import SimpleTestCase

import core.models
import core.views


class CoreSmokeTests(SimpleTestCase):
    def test_core_modules_are_importable(self):
        self.assertIsNotNone(core.models)
        self.assertIsNotNone(core.views)