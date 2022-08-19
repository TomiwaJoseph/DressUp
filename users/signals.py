import imp
from django.db.models.signals import post_save
from django.conf import settings
from django.dispatch import receiver
from users.models import Profile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


post_save.connect(create_profile, sender=settings.AUTH_USER_MODEL)