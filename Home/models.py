from django.db.models.signals import pre_save, pre_delete
from django.dispatch import receiver
import os
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    image = models.ImageField(upload_to='media/user_images/', blank=True, null=True)


class Story(models.Model):
    name = models.CharField(max_length=100)
    story = models.TextField()
    autor = models.ForeignKey(User, on_delete=models.SET_NULL, blank=False, null=True)
    backgroundImage = models.ImageField(upload_to='media/backgroundImages/', blank=True, null=True)


class StoryImages(models.Model):
    image = models.ImageField(upload_to='media/story_images/', blank=False, null=False)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, blank=True, null=True)
    underText = models.BooleanField(default=False)
    width = models.CharField(max_length=10, blank=True, null=True)
    afterChar = models.PositiveIntegerField(blank=True,null=True)
    side = models.CharField(max_length=100, blank=True, null=True)


@receiver(pre_save, sender=User)
def delete_old_image(sender, instance, **kwargs):
    if instance.pk:
        old_instance = User.objects.get(pk=instance.pk)
        if old_instance.image and old_instance.image != instance.image:
            old_image_path = old_instance.image.path
            if os.path.isfile(old_image_path):
                os.remove(old_image_path)


@receiver(pre_save, sender=Story)
def delete_old_image(sender, instance, **kwargs):
    if instance.pk:
        old_instance = Story.objects.get(pk=instance.pk)
        if old_instance.backgroundImage and old_instance.backgroundImage != instance.backgroundImage:
            old_image_path = old_instance.backgroundImage.path
            if os.path.isfile(old_image_path):
                os.remove(old_image_path)


@receiver(pre_delete, sender=Story)
def delete_old_image(sender, instance, **kwargs):
    if instance.pk:
        instance = Story.objects.get(pk=instance.pk)
        if instance.backgroundImage:
            image_path = instance.backgroundImage.path
            if os.path.isfile(image_path):
                os.remove(image_path)


@receiver(pre_delete, sender=StoryImages)
def delete_old_image(sender, instance, **kwargs):
    if instance.pk:
        instance = StoryImages.objects.get(pk=instance.pk)
        image_path = instance.image.path
        if os.path.isfile(image_path):
            os.remove(image_path)
