# Generated by Django 5.0.1 on 2024-01-12 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Home', '0007_storyimages_undertext'),
    ]

    operations = [
        migrations.AddField(
            model_name='storyimages',
            name='afterChar',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='storyimages',
            name='width',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
