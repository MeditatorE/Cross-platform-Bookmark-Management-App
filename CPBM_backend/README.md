## Quick Start
Prequisite: MySQL >= 5.7, conda(python >= 3.11)

<font color=red>**Modify *backend/settings.DATABASES* into your personal ones before start**</font>

```conda create -n django python=3.11```

```conda activate django```

```pip install -r ./requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple```

```python manage.py makemigrations```

```python manage.py migrate```

```python manage.py runsslserver```

Visit *https://127.0.0.1:8000/backend/{url}* to test the APIs.

If you wish to use the HTTP protocol instead of HTTPS, please run:

```python manage.py runserver```