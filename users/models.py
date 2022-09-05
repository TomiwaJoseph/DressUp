from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractUser
)
from django.conf import settings
from base.models import Dress

PAYMENT_CHOICES = (
    ('PN', 'Pay now'),
    ('PL', 'Pay later'),
)
DELIVERY_CHOICES = (
    ('SD', 'Standard'),
    ('ND', 'Next Day'),
)


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        return self._create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    """User model"""
    username = None
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_name(self):
        return super().get_full_name()

    def __str__(self):
        return self.first_name + " " + self.last_name


class OrderItem(models.Model):
    product = models.ForeignKey(Dress, on_delete=models.CASCADE)
    order = models.ForeignKey("Order", on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.quantity} of {self.product.name}"

    def get_total_item_price(self):
        return self.quantity * self.product.price

    def get_stripe_price(self):
        return self.product.price * 100


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    product = models.ManyToManyField(Dress, through=OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered = models.BooleanField(default=False)
    billing_address = models.CharField(max_length=200, blank=True, null=True)
    alternative_billing_address = models.CharField(
        max_length=200, blank=True, null=True)
    phone_number = models.CharField(max_length=20, default='+123 456 7890')
    delivery_type = models.CharField(
        max_length=2, default='SD', choices=DELIVERY_CHOICES)
    payment_method = models.CharField(
        max_length=2, default='PL', choices=PAYMENT_CHOICES)
    paid_for = models.BooleanField(default=False)
    payment_date = models.DateTimeField(null=True, blank=True)
    being_processed = models.BooleanField(default=False)
    delivered = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)

    def __str__(self):
        # return self.user.email
        return "{}'s order - {}".format(self.user, self.ref_code)

    def get_total(self):
        total = 0
        for order_item in self.product.all():
            total += order_item.get_total_item_price()
        return total


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"


class Wishlist(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name="wishlist_owner", null=True)
    folder = models.ManyToManyField(Dress, blank=True)

    def __str__(self):
        return "{}'s wishlist".format(self.user)
