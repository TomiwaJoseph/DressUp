from django.db import models
from django.utils.safestring import mark_safe
from django.conf import settings


class Category(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        ordering = ['title']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.title


class Dress(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='dress_category')
    name = models.CharField(max_length=100)
    price = models.PositiveIntegerField()
    discount_price = models.PositiveIntegerField()
    slug = models.SlugField(max_length=100)
    main_image = models.ImageField(upload_to='dresses')
    other_images = models.ManyToManyField(
        "DressImages", blank=True)
    availability = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Dresses'

    def __str__(self):
        return self.name

    def get_stripe_price(self):
        return int(self.discount_price) * 100

    def image_tag(self):
        return mark_safe("<img src='{}' height='60'/>".format(self.main_image.url))

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
