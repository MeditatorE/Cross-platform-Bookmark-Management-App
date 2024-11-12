"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import hashlib
from apps.login import views
from django.urls import path, re_path
from backend.settings import CONFIRM_DAYS, EMAIL_HOST_USER
from apps.login.models import ConfirmString
from django.core.mail import send_mail

# urlpatterns = [
#     path('login/', views.login, name='login'),
#     path('register/', views.register, name='register'),
#     path('index/', views.index, name='index'),
#     path('logout/', views.logout, name='logout'),
#     path('confirm/', views.user_confirm, name='confirm'),
# ]
from django.urls import path
from .views import IndexView, LoginView, RegisterView, LogoutView, UserConfirmView

urlpatterns = [
    path('index/', IndexView.as_view(), name='index'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('confirm/', UserConfirmView.as_view(), name='confirm'),
]


def hash_code(s, salt='mysite'):  # 加点盐
    h = hashlib.sha256()
    s += salt
    h.update(s.encode())  # update方法只接收bytes类型
    return h.hexdigest()


import datetime


## make_confirm_string() 是创建确认码对象的方法
def make_confirm_string(user):
    """生成确认码"""
    print("生成确认码.....")
    # 获取当前时间
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    code = hash_code(user.name, now)
    print('in code:', code)
    ConfirmString.objects.create(code=code, user=user)
    return code


# send_email(email, code) 方法接收两个参数，分别是注册的邮箱和前面生成的哈希值
def send_email(email, code):
    print('send mail.........')
    subject = '注册确认邮件'
    text_content = '''感谢注册，这里是登录注册系统网站！\
                    如果你看到这条消息，说明你的邮箱服务器不提供HTML链接功能，请联系管理员！'''
    html_content = '''
    <p>感谢注册<a href="http://{}/confirm/?code={}" target=blank>点击验证</a>，\
    这里是登录注册系统网站！</p>
    <p>请点击站点链接完成注册确认！</p>
    <p>此链接有效期为{}天！</p>
    '''.format('127.0.0.1:8000', code, CONFIRM_DAYS)

    send_mail(subject=subject, message=text_content, from_email=EMAIL_HOST_USER, recipient_list=[email, ],
              html_message=html_content)

