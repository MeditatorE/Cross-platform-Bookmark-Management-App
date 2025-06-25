from django.db import models
from django.utils.crypto import get_random_string
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
class Profile(models.Model):
    profileId = models.AutoField(primary_key=True)
    profileName = models.CharField(max_length=15)
    invisible_folder = models.OneToOneField('Folder', on_delete=models.SET_NULL, null=True,
                                            related_name='invisible_profile')
    createTime = models.DateTimeField(auto_now_add=True)
    email = models.EmailField()
    password = models.TextField(max_length=31)

    def __str__(self):
        return self.profileName


class Folder(models.Model):
    folderId = models.AutoField(primary_key=True)
    folderName = models.CharField(max_length=31)
    profileId = models.ForeignKey(Profile, on_delete=models.CASCADE)
    label = models.CharField(max_length=6, choices=[
        ('None', 'None'),
        ('Blue', 'Blue'),
        ('Yellow', 'Yellow'),
        ('Red', 'Red'),
        ('Orange', 'Orange'),
        ('Grey', 'Grey'),
        ('Green', 'Green')
    ])
    shareCode = models.CharField(max_length=255, null=True, blank=True)
    is_invisible = models.BooleanField(default=False)

    def __str__(self):
        return self.folderName


@receiver(post_save, sender=Profile)
def create_invisible_folder(sender, instance, created, **kwargs):
    if created:
        invisible_folder = Folder.objects.create(
            profileId=instance,
            folderName='Invisible Folder',
            is_invisible=True
        )
        instance.invisible_folder = invisible_folder
        instance.save()


class SharedFolderUser(models.Model):
    profileId = models.ForeignKey(Profile, on_delete=models.CASCADE)
    folderId = models.ForeignKey(Folder, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('profileId', 'folderId')


class Collection(models.Model):
    collectionId = models.BigAutoField(primary_key=True)
    profileId = models.ForeignKey(Profile, on_delete=models.CASCADE)
    folderId = models.ForeignKey(Folder, on_delete=models.CASCADE, null=True, blank=True)
    header = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    addtime = models.DateTimeField(auto_now_add=True)
    deltime = models.DateTimeField(null=True, blank=True)
    archived = models.BooleanField(default=False)
    description = models.TextField(default='No description')  # 设置默认值为 'No description'
    imgurl = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.header


class Tag(models.Model):
    tagId = models.AutoField(primary_key=True)
    tagName = models.CharField(max_length=255)
    profileId = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return self.tagName


class CollectionTag(models.Model):
    collectionId = models.ForeignKey(Collection, on_delete=models.CASCADE)
    tagId = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('collectionId', 'tagId')
