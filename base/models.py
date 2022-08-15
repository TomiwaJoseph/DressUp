from django.db import models
from django.utils.safestring import mark_safe
from django.conf import settings


class Category(models.Model):
    category_title = models.CharField(max_length=100)
    category_slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        ordering = ['category_title']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.category_title


class Dress(models.Model):
    dress_category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='dress_category')
    dress_name = models.CharField(max_length=100)
    dress_price = models.PositiveIntegerField()
    dress_discount_price = models.PositiveIntegerField()
    dress_slug = models.SlugField(max_length=100)
    dress_main_image = models.ImageField(upload_to='dresses')
    dress_other_images = models.ManyToManyField("DressImages")
    dress_availability = models.BooleanField(default=True)

    def __str__(self):
        return self.dress_name

    def get_stripe_price(self):
        return int(self.dress_discount_price) * 100

    def image_tag(self):
        return mark_safe("<img src='{}' height='30'/>".format(self.dress_main_image.url))

    image_tag.short_description = "Image"


class DressImages(models.Model):
    dress_id = models.ForeignKey(
        "Dress", on_delete=models.CASCADE, related_name='dress_images')
    image = models.ImageField(upload_to='dresses/sub_images')

    def __str__(self):
        return "image of {}".format(self.dress_id)

    class Meta:
        verbose_name = 'Dress Images'
        verbose_name_plural = 'Dress Images'


class Newsletter(models.Model):
    email = models.EmailField(blank=False, null=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class Reviews(models.Model):
    dress_id = models.ForeignKey("Dress", null=True,
                                 on_delete=models.CASCADE, related_name="reviewed_dress")
    review = models.CharField(max_length=100, blank=False)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    date_reviewed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} reviewed {}'.format(self.reviewer, self.dress_id)

    class Meta:
        verbose_name_plural = 'Reviews'
        ordering = ('-date_reviewed',)
