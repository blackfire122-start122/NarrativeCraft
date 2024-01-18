from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserChangeForm as BaseUserChangeForm, UserCreationForm
from Home.models import User, Story


class UserChangeForm(BaseUserChangeForm):
    class Meta:
        model = get_user_model()
        fields = ["username", "first_name", "last_name", "email", "image"]

        widgets = {
                "username": forms.TextInput(attrs={"placeholder": "Username"}),
                "first_name": forms.TextInput(attrs={"placeholder": "Firstname"}),
                "last_name": forms.TextInput(attrs={"placeholder": "Lastname"}),
                "email": forms.EmailInput(attrs={"placeholder": "Email"}),
            }


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


class CreateStoryForm(forms.ModelForm):
    class Meta:
        model = Story
        fields = ["name"]

        widgets = {"name": forms.TextInput(attrs={"placeholder": "Name Story"})}
