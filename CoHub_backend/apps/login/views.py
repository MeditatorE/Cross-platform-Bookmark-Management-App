from urllib import request

from django.shortcuts import render, redirect
from apps.login.forms import RegisterForm
from apps.login.models import SiteUser, ConfirmString
from apps.app_core.models import Profile
from datetime import datetime, timedelta
from backend.settings import CONFIRM_DAYS
from django.utils import timezone

from rest_framework import serializers
from apps.login.models import SiteUser, ConfirmString

# 创建一个序列化器用于将 SiteUser 和 ConfirmString 模型转换为 JSON 格式。
class SiteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profileId', 'profileName', 'email']

class ConfirmStringSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfirmString
        fields = ['user', 'code', 'create_time']

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from .models import SiteUser, ConfirmString
# from .serializers import SiteUserSerializer, ConfirmStringSerializer
from .forms import RegisterForm
from datetime import timedelta
from backend.settings import CONFIRM_DAYS
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

class IndexView(APIView):
    def get(self, request):
        return Response({"message": "Welcome to the index page"}, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # user = SiteUser.objects.filter(name=username).first()
        user = Profile.objects.get(profileName=username)

        if user and password==user.password:
            # if not user.has_confirmed:
            #     return Response({"message": "该用户还未完成邮件确认"}, status=status.HTTP_400_BAD_REQUEST)
            request.session['is_login'] = True
            request.session['user_id'] = user.profileId
            request.session['username'] = user.profileName
            return Response({"message": "登录成功", "user": SiteUserSerializer(user).data}, status=status.HTTP_200_OK)
        return Response({"message": "用户名或者密码错误"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        return Response({"message": "非法GET，需要POST"}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        from apps.login.urls import make_confirm_string, send_email
        register_form = RegisterForm(request.data)
        if register_form.is_valid():
            username = register_form.cleaned_data['username']
            password1 = register_form.cleaned_data['password1']
            password2 = register_form.cleaned_data['password2']
            email = register_form.cleaned_data['email']

            if SiteUser.objects.filter(name=username).exists():
                return Response({"message": "用户名已经存在"}, status=status.HTTP_400_BAD_REQUEST)
            if SiteUser.objects.filter(email=email).exists():
                return Response({"message": "该邮箱已经被注册了"}, status=status.HTTP_400_BAD_REQUEST)
            if password1 != password2:
                return Response({"message":"两次输入密码不一致,请重新输入"},status=status.HTTP_400_BAD_REQUEST)

            new_user = SiteUser(name=username, password=password1, email=email)
            new_user.save()
            code = make_confirm_string(new_user)
            send_email(email, code)
            return Response({"message": "请前往邮箱进行确认！"}, status=status.HTTP_201_CREATED)
        return Response({"message": "请检查填写的内容！"}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        if request.session.get('is_login'):
            request.session.flush()
            return Response({"message": "已成功登出"}, status=status.HTTP_200_OK)
        return Response({"message": "用户未登录"}, status=status.HTTP_400_BAD_REQUEST)

class UserConfirmView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        try:
            confirm = ConfirmString.objects.get(code=code)
        except ConfirmString.DoesNotExist:
            return Response({"message": "无效的确认请求!"}, status=status.HTTP_400_BAD_REQUEST)

        create_time = confirm.create_time
        now = timezone.now()
        if now > create_time + timedelta(CONFIRM_DAYS):
            confirm.user.delete()
            return Response({"message": "您的邮件已经过期！请重新注册!"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            confirm.user.has_confirmed = True
            confirm.user.save()
            confirm.delete()
            return Response({"message": "感谢确认，请使用账户登录！"}, status=status.HTTP_200_OK)




def index(request):
    pass
    return render(request, 'login/index.html')


def login(request):
    if request.method == 'POST':
        username = request.POST.get('username').strip()
        password = request.POST.get('password').strip()
        print(username, password)
        if username and password:
            user = SiteUser.objects.filter(name=username, password=password).first()
            if user:
                if not user.has_confirmed:
                    message = '该用户还未完成邮件确认'
                    return render(request, 'login/login.html', locals())
                request.session['is_login'] = True
                request.session['user_id'] = user.id
                request.session['username'] = user.name
                return redirect('/index/')
            else:
                message = "用户名或者密码错误"
                return render(request, 'login/login.html', {'message': message})
        else:
            message = "非法的信息"
            return render(request, 'login/login.html', {'message': message})
    return render(request, 'login/login.html')


def register(request):
    from apps.login.urls import make_confirm_string, send_email
    # 如果用户已经登录，则不能注册跳转到首页。
    if request.session.get('is_login', None):
        return redirect('/index/')
    # 如果是POST请求
    if request.method == 'POST':
        print(request.POST)
        register_form = RegisterForm(request.POST)
        message = "请检查填写的内容！"
        # 先验证提交的数据是否通过
        if register_form.is_valid():
            # 清洗数据
            username = register_form.cleaned_data.get('username')
            password1 = register_form.cleaned_data.get('password1')
            password2 = register_form.cleaned_data.get('password2')
            email = register_form.cleaned_data.get('email')

            print(locals())
            # 接下来判断用户名和邮箱是否已经被注册
            same_name_user = SiteUser.objects.filter(name=username)
            print(same_name_user)
            if same_name_user:
                message = '用户名已经存在'
                return render(request, 'login/register.html', locals())
            same_email_user = SiteUser.objects.filter(email=email)
            if same_email_user:
                message = '该邮箱已经被注册了！'
                return render(request, 'login/register.html', locals())
            # 将注册的信息存储到数据库，跳转到登录界面
            try:
                # 将注册的信息存储到数据库，跳转到登录界面
                new_user = SiteUser(name=username, password=password1, email=email)
                new_user.save()
                # 生成确认码并发送确认邮件
                code = make_confirm_string(new_user)
                print('code:', code)
                send_email(email, code)
                message = '请前往邮箱进行确认！'
            except Exception:
                new_user.delete()
                message = '发送邮件失败！'
                return render(request, 'login/register.html', locals())
            else:
                return redirect('/login/')
    # 如果是GET请求，返回用户注册的html页面。
    register_form = RegisterForm()
    return render(request, 'login/register.html', locals())


# 重定向
def logout(request):
    # 如果不是登陆状态，无法登出
    if request.session.get('is_login'):
        request.session.flush()
    return redirect('/login/')


def user_confirm(request):
    code = request.GET.get('code', None)
    message = ''
    try:
        confirm = ConfirmString.objects.get(code=code)
    except:
        message = '无效的确认请求!'
        return render(request, 'login/confirm.html', locals())

    create_time = confirm.create_time
    # now = datetime.now()
    now = timezone.now()
    print(now, create_time, create_time + timedelta(CONFIRM_DAYS))
    if now > create_time + timedelta(CONFIRM_DAYS):
        confirm.user.delete()
        message = '您的邮件已经过期！请重新注册!'
    else:
        confirm.user.has_confirmed = True
        confirm.user.save()
        confirm.delete()
        message = '感谢确认，请使用账户登录！'
    return render(request, 'login/confirm.html', locals())
