import json
from random import randint

from django.db.models import Count
from django.views.generic import TemplateView
from .models import Story, StoryImages
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import UserChangeForm, CustomUserCreationForm, CreateStoryForm
from django.views import View
from django.http import JsonResponse, HttpResponseForbidden, HttpResponse, HttpResponseNotFound


class Home(TemplateView):
    template_name = "html/home.html"

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)

        count = Story.objects.aggregate(count=Count('id'))['count']
        if count != 0:
            random_index = randint(0, count - 1)
            context["storyOnHeader"] = Story.objects.all()[random_index]

        if count < 20:
            context["stories"] = Story.objects.all()
        else:
            context["stories"] = Story.objects.all()[count - 20:]

        return context


class StoryPage(TemplateView):
    template_name = "html/story.html"
    story = None
    storyImages = None

    def get(self, request, story_name, *args, **kwargs):
        self.story = Story.objects.get(name=story_name)
        self.storyImages = StoryImages.objects.filter(story=self.story).order_by('afterChar')
        return super().get(request, *args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        context["story"] = self.story
        context["storyImages"] = self.storyImages
        return context


class RegisterView(View):
    template_name = 'registration/register.html'
    form_class = CustomUserCreationForm

    def get(self, request):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
        return render(request, self.template_name, {'form': form})


class LoginView(View):
    template_name = 'registration/login.html'
    form_class = AuthenticationForm

    def get(self, request):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request, request.POST)
        if form.is_valid():
            login(request, form.get_user())
            return redirect('home')
        return render(request, self.template_name, {'form': form})


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('home')


class ProfilePage(TemplateView):
    template_name = "html/profile.html"
    form_class = UserChangeForm

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse('Unauthorized', status=401)
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse('Unauthorized', status=401)
        form = self.form_class(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
        return super().get(request, *args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = self.form_class(instance=self.request.user)
        context["userStories"] = Story.objects.filter(autor=self.request.user)
        return context


class CreateStory(TemplateView):
    template_name = "html/createStory.html"
    form_class = CreateStoryForm

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse('Unauthorized', status=401)
        form = self.form_class(request.POST)
        if form.is_valid():
            form.instance.autor = request.user
            form.save()
            return redirect("changeStory", story_name=form.instance.name)
        else:
            return super().get(request, *args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = self.form_class()
        return context


class ChangeStory(TemplateView):
    template_name = "html/changeStory.html"
    story = None
    storyImages = None

    def get(self, request, story_name, *args, **kwargs):
        try:
            self.story = Story.objects.get(name=story_name)
        except Story.DoesNotExist:
            return HttpResponseNotFound()

        if self.story.autor != request.user:
            return HttpResponseForbidden()

        self.storyImages = StoryImages.objects.filter(story=self.story).order_by('afterChar')
        return super().get(request, *args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        context["story"] = self.story
        context["storyImages"] = self.storyImages
        return context


def saveStory(request):
    if request.method == 'POST':
        form_data = request.POST.copy()
        files = request.FILES.getlist('images')

        data = json.loads(form_data.get('data'))
        story_id = data.get('storyId', None)

        try:
            story = Story.objects.get(id=story_id)
        except Story.DoesNotExist:
            return JsonResponse({"status": "Fail id"}, status=400)

        if story.autor != request.user:
            return JsonResponse({"status": "Forbidden"}, status=403)

        images = data.get('imagesData', [])

        story_images = StoryImages.objects.filter(story=story)

        file_i = 0

        for image_info in images:
            if image_info.get("storyImageId", False):
                img = story_images.get(id=image_info.get("storyImageId", None))
                img.width = image_info.get("width", "100%")
                img.afterChar = image_info.get("afterChar", 0)
                img.side = image_info.get("side", "none")
                img.underText = image_info.get("underText", False)
                img.save()
                story_images = story_images.exclude(id=img.id)
            else:
                story_image = StoryImages()
                story_image.image = files[file_i]
                story_image.width = image_info.get("width", "100%")
                story_image.afterChar = image_info.get("afterChar", 0)
                story_image.side = image_info.get("side", "none")
                story_image.underText = image_info.get("underText", False)
                story_image.story = story
                story_image.save()
                story_images = story_images.exclude(id=story_image.id)
                file_i += 1

        for i in story_images:
            i.delete()

        story.name = data.get('name', "")
        story.story = data.get('story', "")

        background_story = request.FILES.get('backgroundStory')
        if background_story:
            story.backgroundImage = background_story
        story.save()

        return JsonResponse({"status": "OK"})
    else:
        return JsonResponse({"status": "Method not allowed"}, status=405)


def deleteStory(request):
    if request.method == 'POST':
        form_data = request.POST.copy()
        id_story = form_data.get("id", None)
        if id_story:
            try:
                story = Story.objects.get(id=id_story)
            except Story.DoesNotExist:
                return JsonResponse({"status": "Fail id"}, status=400)

            if story.autor == request.user:
                story.delete()
                return JsonResponse({"status": "OK"})
            else:
                return JsonResponse({"status": "Forbidden"}, status=403)
        else:
            return JsonResponse({"status": "Bad requests"}, status=400)
    else:
        return JsonResponse({"status": "Method not allowed"}, status=405)
