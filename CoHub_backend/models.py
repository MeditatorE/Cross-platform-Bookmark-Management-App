# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AppCoreCollection(models.Model):
    collectionid = models.BigAutoField(db_column='collectionId', primary_key=True)  # Field name made lowercase.
    header = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    addtime = models.DateTimeField()
    deltime = models.DateTimeField(blank=True, null=True)
    archived = models.IntegerField()
    folderid = models.ForeignKey('AppCoreFolder', models.DO_NOTHING, db_column='folderId_id')  # Field name made lowercase.
    profileid = models.ForeignKey('AppCoreProfile', models.DO_NOTHING, db_column='profileId_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'app_core_collection'


class AppCoreCollectiontag(models.Model):
    id = models.BigAutoField(primary_key=True)
    collectionid = models.ForeignKey(AppCoreCollection, models.DO_NOTHING, db_column='collectionId_id')  # Field name made lowercase.
    tagid = models.ForeignKey('AppCoreTag', models.DO_NOTHING, db_column='tagId_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'app_core_collectiontag'
        unique_together = (('collectionid', 'tagid'),)


class AppCoreFolder(models.Model):
    folderid = models.AutoField(db_column='folderId', primary_key=True)  # Field name made lowercase.
    foldername = models.CharField(db_column='folderName', max_length=31)  # Field name made lowercase.
    label = models.CharField(max_length=6)
    sharecode = models.CharField(db_column='shareCode', max_length=255, blank=True, null=True)  # Field name made lowercase.
    profileid = models.ForeignKey('AppCoreProfile', models.DO_NOTHING, db_column='profileId_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'app_core_folder'


class AppCoreProfile(models.Model):
    profileid = models.AutoField(db_column='profileId', primary_key=True)  # Field name made lowercase.
    profilename = models.CharField(db_column='profileName', max_length=15)  # Field name made lowercase.
    createtime = models.DateTimeField(db_column='createTime')  # Field name made lowercase.
    email = models.CharField(max_length=254)
    password = models.TextField()

    class Meta:
        managed = False
        db_table = 'app_core_profile'


class AppCoreSharedfolderuser(models.Model):
    id = models.BigAutoField(primary_key=True)
    folderid = models.ForeignKey(AppCoreFolder, models.DO_NOTHING, db_column='folderId_id')  # Field name made lowercase.
    profileid = models.ForeignKey(AppCoreProfile, models.DO_NOTHING, db_column='profileId_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'app_core_sharedfolderuser'
        unique_together = (('profileid', 'folderid'),)


class AppCoreTag(models.Model):
    tagid = models.AutoField(db_column='tagId', primary_key=True)  # Field name made lowercase.
    tagname = models.CharField(db_column='tagName', max_length=255)  # Field name made lowercase.
    profileid = models.ForeignKey(AppCoreProfile, models.DO_NOTHING, db_column='profileId_id')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'app_core_tag'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
