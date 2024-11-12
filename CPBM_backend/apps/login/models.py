from django.db import models
from django.core.mail import send_mail


# Create your models here.
class SiteUser(models.Model):
    gender_choice = (
        (0, "未知"),
        (1, "男"),
        (2, "女"),
    )
    name = models.CharField(max_length=128, unique=True)
    # unique=True，名字唯一
    password = models.CharField(max_length=256)
    email = models.EmailField(unique=True)
    gender = models.IntegerField(choices=gender_choice, default=0)
    # auto_now_add=True为添加时间，更新对象时不会有变化
    create_time = models.DateTimeField(auto_now_add=True)
    modify_time = models.DateTimeField(auto_now=True)
    # null针对数据库层面，blank针对表单的
    last_login_time = models.DateTimeField(null=True, blank=True)
    has_confirmed = models.BooleanField(default=False, verbose_name="是否邮箱验证")

    def __str__(self):
        return self.name


class ConfirmString(models.Model):
    code = models.CharField(max_length=256, verbose_name="确认码")
    user = models.OneToOneField('SiteUser', on_delete=models.CASCADE)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.user.name + ":" + self.code

    class Meta:
        ordering = ["-create_time"]
        verbose_name = "确认码"
        verbose_name_plural = "确认码"



