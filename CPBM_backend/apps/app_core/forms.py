from django import forms
from .models import Collection, Folder, Profile, Tag


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['profileName', 'email', 'password']


class FolderForm(forms.ModelForm):
    class Meta:
        model = Folder
        fields = ['folderName', 'label']


class CollectionForm(forms.ModelForm):
    tags = forms.ModelMultipleChoiceField(
        queryset=None,
        widget=forms.CheckboxSelectMultiple,
        required=False  # 如果tags不是必填项
    )
    def __init__(self, *args, **kwargs):
        # 从视图传递的 kwargs 中获取 profile_pk
        profile_pk = kwargs.pop('profile_pk', None)
        folder_pk = kwargs.pop('folder_pk', None)
        # 调用父类的 __init__ 方法
        super(CollectionForm, self).__init__(*args, **kwargs)
        # 根据 profile_pk 动态设置 tags 字段的 queryset
        folder = Folder.objects.get(folderId=folder_pk)

        if folder.shareCode is not None:    # 共享文件夹用系统预设的标签
            self.fields['tags'].queryset = Tag.objects.filter(profileId_id=0)
        else:
            if profile_pk:
                self.fields['tags'].queryset = Tag.objects.filter(profileId_id=profile_pk)

    class Meta:
        model = Collection
        fields = ['url']

        
class SharedFolderForm(forms.ModelForm):
    class Meta:
        model = Folder
        fields = ['folderName']


class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['tagName']

class CollectionUpdateForm(forms.ModelForm):
    tags = forms.ModelMultipleChoiceField(
        queryset=None,
        widget=forms.CheckboxSelectMultiple,
        required=False  # 如果tags不是必填项
    )
    def __init__(self, *args, **kwargs):
        # 从视图传递的 kwargs 中获取 profile_pk
        profile_pk = kwargs.pop('profile_pk', None)
        folder_pk = kwargs.pop('folder_pk', None)
        collection_pk = kwargs.pop('collection_pk', None)
        # 调用父类的 __init__ 方法
        super(CollectionUpdateForm, self).__init__(*args, **kwargs)
        # 根据 profile_pk 动态设置 tags 字段的 queryset
        folder = Folder.objects.get(folderId=folder_pk)

        if folder.shareCode is not None:    # 共享文件夹用系统预设的标签
            self.fields['tags'].queryset = Tag.objects.filter(profileId_id=0)
        else:
            if profile_pk:
                self.fields['tags'].queryset = Tag.objects.filter(profileId_id=profile_pk)

        collection = Collection.objects.get(collectionId=collection_pk)
        initial_data = {'archived': collection.archived, 'header': collection.header, 'folderId': collection.folderId}
        self.initial = initial_data

    class Meta:
        model = Collection
        fields = ['header', 'archived', 'folderId']

