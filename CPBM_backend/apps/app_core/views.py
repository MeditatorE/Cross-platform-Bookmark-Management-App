from django.shortcuts import get_object_or_404, redirect
from django.views.generic import ListView, DetailView, UpdateView, DeleteView
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy

from django.db.models import Q
from django.contrib import messages

from django.utils.crypto import get_random_string

from django.views.decorators.http import require_POST
import json
from django.http import JsonResponse
from django.views.generic import View
from django.utils import timezone
from itertools import chain
from .models import Profile, Folder, Collection, Tag, CollectionTag, SharedFolderUser
from .forms import CollectionForm, FolderForm, ProfileForm, TagForm, CollectionUpdateForm, SharedFolderForm

from django.forms.models import model_to_dict

'''
所有get方法（查）：
1. 查询文件夹列表 
2. 查询共享文件夹列表
3. 查询用户所有收藏内容
4. 查询当前文件夹收藏内容 
5. 查询暂时删除内容
6. 查询归档收藏内容
7. 查询当前共享文件夹的共享用户
8. 查询当前用户所有Tags
9. 查询当前共享文件夹分享码
10. 获取预定义的tag
'''

class FolderListView(ListView):
# 'profile/<int:profile_pk>/folders/'
    def get(self, request, *args, **kwargs):
        profile_pk = self.kwargs['profile_pk']
        queryset = Folder.objects.filter(profileId_id=profile_pk, shareCode__isnull=True, is_invisible=0)

        folders_data = [model_to_dict(folder, fields=['folderId', 'folderName', 'label']) for folder in queryset]

        # 使用 JsonResponse 返回 JSON 数据
        return JsonResponse({'items': folders_data}, safe=False)

class SharedFolderListView(ListView):
# profile/<int:profile_pk>/sharefolders/
    def get(self, request, *args, **kwargs):
        profile_pk = self.kwargs['profile_pk']

        shared_folders = SharedFolderUser.objects.filter(profileId_id=profile_pk)  # 假设你要根据当前登录的用户请求来查找共享文件夹
        shared_folder_ids = shared_folders.values_list('folderId_id', flat=True)  # 获取共享文件夹的 ID 列表
        shared_folders_info = Folder.objects.filter(folderId__in=shared_folder_ids)  # 根据 ID 获取共享文件夹的详细信息
        owner_shared_folders = Folder.objects.filter(profileId_id=profile_pk, shareCode__isnull=False, is_invisible=0)
        shared_folders = shared_folders_info | owner_shared_folders  # 自己创建和加入的所有folder

        folders_data = [model_to_dict(folder, fields=['folderId', 'folderName', 'label', 'shareCode']) for folder in shared_folders]

        # 使用 JsonResponse 返回 JSON 数据
        return JsonResponse({'items': folders_data}, safe=False)

def collection_to_json(collections):
    data = []
    for collection in collections:
        tmp = {}
        tmp['image'] = collection.imgurl
        tmp['name'] = collection.header
        tmp['date'] = collection.addtime
        tmp['link'] = collection.url
        tmp['id'] = collection.collectionId
        tmp['tags'] = []
        tmp['deltime'] = collection.deltime
        tmp['folderid'] = collection.folderId.pk
        tmp['description'] = collection.description

        queryset = CollectionTag.objects.filter(collectionId_id=collection.collectionId)
        for q in queryset:
            tmp['tags'].append(str(q.tagId))

        data.append(tmp)

    return data

class CollectionAllListView(ListView):
# profile/<int:profile_pk>/all/
    '''
    {
        id: 2,
        image: "/static/pic/12.png",
        name: "👋 Title for Collection 2",
        tags: ["Tag1", "Tag3"],
        date: "2022/01/09",
        link: "https://example.com/link2"
	}
    '''
    def get(self, request, *args, **kwargs):
        profile_pk = self.kwargs['profile_pk']
        collections = Collection.objects.filter(profileId_id=profile_pk, archived=0, deltime__isnull=True)
        data = collection_to_json(collections)
        return JsonResponse({'goodsList': data}, safe=False)

class CollectionDeletedListView(ListView):
# profile/<int:profile_pk>/del/
    def get(self, request, *args, **kwargs):
        profile_pk = self.kwargs['profile_pk']
        collections = Collection.objects.filter(profileId_id=profile_pk, deltime__isnull=False)
        data = collection_to_json(collections)
        return JsonResponse({'goodsList': data}, safe=False)


class CollectionArchivedListView(ListView):
# profile/<int:profile_pk>/archive/
    def get(self, request, *args, **kwargs):
        profile_pk = self.kwargs['profile_pk']
        collections = Collection.objects.filter(profileId_id=profile_pk, archived=1, deltime__isnull=True)
        data = collection_to_json(collections)
        return JsonResponse({'goodsList': data}, safe=False)

class CollectionListView(ListView):
# profile/<int:profile_pk>/folder/<int:folder_pk>/collections/
    def get(self, request, *args, **kwargs):
        profile_pk = self.kwargs['profile_pk']
        folder_pk = self.kwargs['folder_pk']
        collections = Collection.objects.filter(profileId_id=profile_pk, archived=0, deltime__isnull=True, folderId=folder_pk)
        data = collection_to_json(collections)
        return JsonResponse({'goodsList': data}, safe=False)

class SharedUserListView(ListView):
# profile/<int:profile_pk>/sharedfolder/<int:folder_pk>/users/
    def get(self, request, *args, **kwargs):
        folder_pk = self.kwargs['folder_pk']
        owner_pk = Folder.objects.get(pk=folder_pk).profileId_id
        data = [{
            'image': '/static/pic/Ellipse 178.png',
            'name': Profile.objects.get(pk=owner_pk).profileName,
            'owner': 1,
        }]
        queryset = SharedFolderUser.objects.filter(folderId=folder_pk)

        for q in queryset:
            data.append({'image': '/static/pic/Ellipse 178.png', 'name': str(q.profileId),'owner': 0})

        return JsonResponse({'friends':data}, safe=False)

# profile/<int:profile_pk>/tags/
class TagListView(ListView):
    def get(self, request, *args, **kwargs):
        profile_pk = self.kwargs['profile_pk']
        queryset = Tag.objects.filter(profileId_id=profile_pk)
        tag_data = [model_to_dict(tag, fields=['tagId', 'tagName']) for tag in queryset]

        return JsonResponse({'items': tag_data}, safe=False)

# profile/<int:profile_pk>/folders/<int:folder_pk>/sharedcode/
def getSharedCode(request, *args, **kwargs):
    folder_pk = kwargs['folder_pk']
    queryset = Folder.objects.filter(folderId=folder_pk)
    data = {"shareCode": str(queryset.first().shareCode)}
    return JsonResponse(data, safe=False)

# sharedtag/
def getSharedTag(request, *args, **kwargs):
    queryset = Tag.objects.filter(profileId_id=0)
    tag_data = [model_to_dict(tag, fields=['tagId', 'tagName']) for tag in queryset]

    return JsonResponse({'items': tag_data}, safe=False)

# profile/<int:profile_pk>/folder/<int:folder_pk>/collection/<int:pk>/link
def getShareLink(request, *args, **kwargs):
    pk = kwargs['pk']
    queryset = Collection.objects.filter(pk=pk)
    url = queryset.first().url
    return JsonResponse({'shareLink': url},safe=False)


'''
所有POST方法（增删改）：
1. 添加收藏内容（主页）
2. 添加收藏内容（文件夹）
3. 添加tag
4. 添加文件夹
5. 添加共享文件夹
6. 加入共享文件夹
7. 编辑收藏内容和tag之间的关系
8. 删除收藏内容
9. 删除文件夹
10. 归档收藏内容
11. 删除tag
12. 修改文件夹名称/标签
13. 修改tag名称
14. 收藏内容复原（取消归档，回复删除）
15. 收藏内容彻底删除
16. 搜索（搜tag 描述 标题 文件夹 返回collection）
'''

class CollectionCreateView(View):
    def get(self, request, *args, **kwargs):
        query = Tag.objects.filter(profileId=self.kwargs['profile_pk'])
        all_tags = [str(q.tagName) for q in query]
        data = {
            "tags": all_tags,
        }

        return JsonResponse(data, safe=False)

    def post(self, request, *args, **kwargs):
        # 解析请求体中的 JSON 数据
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # 从 JSON 数据中提取必要字段
        url = data.get('url')
        tags = data.get('tags', [])
        profile = Profile.objects.get(pk=self.kwargs['profile_pk'])

        # 获取 profile 和 folder 对象
        if 'folder_pk' not in self.kwargs:
            folder = Folder.objects.get(profileId=self.kwargs['profile_pk'], is_invisible=1)
        else:
            folder = Folder.objects.get(pk=self.kwargs['folder_pk'])
        title = get_title_from_link(url)
        description = get_description_from_meta_tags(url)
        image_url = get_image_urls_from_meta_tags(url)
        # 创建集合
        new_collection = Collection.objects.create(
            header=title,
            url=url,
            addtime=timezone.now(),
            archived=0,
            imgurl=image_url,
            profileId=profile,
            folderId=folder,
            description=description
        )

        # 处理标签
        for tag in tags:
            try:
                tag = Tag.objects.get(tagName=tag)
            except Tag.DoesNotExist:
                continue  # 或者返回错误信息，根据你的需求来处理
            CollectionTag.objects.create(collectionId=new_collection, tagId=tag)

        # 准备返回的 JSON 数据
        response_data = {
            'id': new_collection.pk,
            'header': new_collection.header,
            'url': new_collection.url,
            'addtime': new_collection.addtime.isoformat(),
            'archived': new_collection.archived,
            'profile_pk': self.kwargs['profile_pk'],
            'folder_pk': folder.folderId,
            'description': new_collection.description,
            'imgurl': new_collection.imgurl
        }

        return JsonResponse(response_data, status=200)  # 返回 201 Created 状态码


class TagCreateView(CreateView):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)


        name = data['tagName']
        query = Tag.objects.filter(tagName__iexact=name, profileId=self.kwargs['profile_pk']).first()
        if query is None:
            new_tag = Tag.objects.create(tagName=name, profileId=Profile.objects.get(pk=self.kwargs['profile_pk']))

        else:
            messages = {'message': 'Tag already exists'}
            return JsonResponse(messages, status=400)
        messages = {'message': 'Tag created'}
        return JsonResponse(messages, status=200)

class FolderCreateView(CreateView):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        name = data['folderName']
        if 'label' not in data:
            label = 'Blue'
        else:
            label = data['label']
        new_folder = Folder.objects.create(folderName=name, profileId=Profile.objects.get(pk=self.kwargs['profile_pk']), label=label)
        messages = {'message': 'Folder created'}
        return JsonResponse(messages, status=200)

class SharedFolderCreateView(CreateView):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        name = data['folderName']

        if name.startswith('cohubshared_'):
            # 如果输入的是 sharecode，查找对应的 folder_id
            sharecode = name
            folder = Folder.objects.filter(shareCode=sharecode).first()
            profile_pk = self.kwargs['profile_pk']
            if folder:
                # 添加当前用户到共享文件夹用户表
                SharedFolderUser.objects.get_or_create(
                    profileId_id=profile_pk,
                    folderId_id=folder.folderId
                )
                messages = {'message': 'Joined successfully'}
                return JsonResponse(messages, status=201)
            else:
                messages = {'message': 'Folder not found'}
                return JsonResponse(messages, status=400)
        else:
            profile = Profile.objects.get(pk=self.kwargs['profile_pk'])
            # 如果输入的是普通名字，创建共享文件夹并生成 sharecode
            new_folder = Folder.objects.create(
                folderName=name,
                shareCode='cohubshared_' + get_random_string(18),  # 总共20位，包括前缀
                profileId=profile
            )
            profile_pk = self.kwargs['profile_pk']
            messages = {'message': 'Created successfully'}
            return JsonResponse(messages, status=200)

# profile/<int:profile_pk>/folder/<int:folder_pk>/collection/<int:pk>/

class CollectionUpdateView(UpdateView):
    def get(self, request, *args, **kwargs):
        collection = Collection.objects.get(pk=self.kwargs['pk'])
        query = CollectionTag.objects.filter(collectionId=collection.collectionId)
        selected_tags = [str(q.tagId) for q in query]
        query = Tag.objects.filter(profileId=self.kwargs['profile_pk'])
        all_tags = [str(q.tagName) for q in query]
        foldername = str(collection.folderId) if str(collection.folderId) != 'invisible folder' else None
        data = {
            "header": collection.header,
            "selected_tags": selected_tags,
            "all_tags": all_tags,
            "foldername": foldername,
        }
        return JsonResponse(data, status=200)


    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        collection = Collection.objects.get(collectionId=self.kwargs['pk'])
        collection.header = data['header']
        collection.folderId = Folder.objects.filter(folderName__exact=data['folderName'], profileId=self.kwargs['profile_pk']).first()

        tags = set(data['selected_tags'])
        collection_id = collection.collectionId

        existing_tags = set(CollectionTag.objects.filter(collectionId=collection_id))
        li = []

        for existing_tag in existing_tags:  # 已有标签未在新修改标签中
            if existing_tag.tagId not in tags:
                tmp = CollectionTag.objects.get(collectionId=collection_id, tagId=Tag.objects.get(tagName=str(existing_tag.tagId), profileId=self.kwargs['profile_pk']))
                tmp.delete()
                continue
            li.append(existing_tag)

        added_tags = tags - set(li)
        for added_tag in added_tags:
            new_relation = CollectionTag.objects.create(
                collectionId=Collection.objects.get(pk=collection_id),
                tagId=Tag.objects.get(tagName=added_tag, profileId=self.kwargs['profile_pk']),
            )

        query = CollectionTag.objects.filter(collectionId=collection.pk)
        tags = [str(q.tagId) for q in query]
        collection.save()
        response_data = {
            'id': collection.pk,
            'header': collection.header,
            'url': collection.url,
            'addtime': collection.addtime.isoformat(),
            'archived': collection.archived,
            'profile_pk': self.kwargs['profile_pk'],
            'folder_pk': collection.folderId.pk,
            'description': collection.description,
            'imgurl': collection.imgurl,
            'tags': tags,
        }

        return JsonResponse(response_data, status=201)


class TagDeleteView(DeleteView):
    def delete(self, request, *args, **kwargs):
        tag = Tag.objects.get(tagId=self.kwargs['pk'])
        tag.delete()

        return JsonResponse({'message': 'Tag deleted'})

# profile/<int:profile_pk>/folder/<int:pk>/delete/
class FolderDeleteView(DeleteView):
    def delete(self, request, *args, **kwargs):
        folder = Folder.objects.get(pk=self.kwargs['pk'])
        if folder.shareCode == None:
            invisible_folder = Folder.objects.get(profileId=self.kwargs['profile_pk'], is_invisible=True)
            Collection.objects.filter(folderId=self.kwargs['pk']).update(folderId=invisible_folder.folderId, deltime=timezone.now())
            folder.delete()

            return JsonResponse({'message': 'Folder deleted'})
        else:
            if folder.profileId.pk == self.kwargs['profile_pk']:
                invisible_folder = Folder.objects.get(profileId=self.kwargs['profile_pk'], is_invisible=True)
                Collection.objects.filter(folderId=self.kwargs['pk']).update(folderId=invisible_folder.folderId,
                                                                             deltime=timezone.now())
                folder.delete()

                return JsonResponse({'message': 'Shared Folder deleted'})
            else:
                relation = SharedFolderUser.objects.filter(profileId=self.kwargs['profile_pk'], folderId=self.kwargs['pk'])
                relation.delete()
                return JsonResponse({'message': 'Exit'}, status=200)


# profile/<int:profile_pk>/folder/<int:folder_pk>/collection/<int:pk>/delete/
class CollectionDeleteView(UpdateView):
    def post(self, request, *args, **kwargs):
        collection = Collection.objects.get(pk=self.kwargs['pk'])
        collection.deltime = timezone.now()
        collection.save()
        data = collection_to_json([collection])

        return JsonResponse(data, status=200, safe=False)

# profile/<int:profile_pk>/folder/<int:folder_pk>/collection/<int:pk>/archive/
class CollectionArchiveView(UpdateView):
    def post(self, request, *args, **kwargs):
        collection = Collection.objects.get(pk=self.kwargs['pk'])
        collection.archived = True
        collection.save()
        data = collection_to_json([collection])

        return JsonResponse(data, status=200, safe=False)


class FolderUpdateView(UpdateView):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        folder = Folder.objects.get(pk=self.kwargs['pk'])
        folder.folderName = data['name']
        folder.label = data['label']
        folder.save()

        return JsonResponse({'message':'Folder edited'}, status=200, safe=False)


class TagUpdateView(UpdateView):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        tag = Tag.objects.get(pk=self.kwargs['pk'])
        tag.tagName = data['name']
        tag.save()

        return JsonResponse({'message':'Tag edited'}, status=200, safe=False)


class CollectionRecoverView(UpdateView):
    def post(self, request, *args, **kwargs):
        collection = Collection.objects.get(pk=self.kwargs['pk'])
        collection.deltime = None
        collection.archived = False
        collection.save()
        data = collection_to_json([collection])
        return JsonResponse(data, status=200, safe=False)

class CollectionRealDeleteView(DeleteView):
    def delete(self, request, *args, **kwargs):
        try:
            collection = Collection.objects.get(pk=self.kwargs['pk'])
        except:
            return JsonResponse({'error': 'Collection not found'}, status=404)
        collection.delete()

        return JsonResponse({'message': 'Collection deleted'})

class CollectionSearchView(ListView):
    def get(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        search_term = data['search_term']
        query = (Q(header__icontains=search_term) |  Q(description__icontains=search_term)) & Q(profileId__exact=self.kwargs['pk'])
        queryset = Collection.objects.filter(query)

        folders = Folder.objects.filter(folderName__icontains=search_term, profileId=self.kwargs['pk'])
        collections_folder = Collection.objects.filter(profileId=self.kwargs['pk'], folderId__in=folders)

        tags = Tag.objects.filter(profileId=self.kwargs['pk'], tagName__icontains=search_term)
        relations = CollectionTag.objects.filter(tagId__in=tags)
        collection_ids = []
        for relation in relations:
            collection_ids.append(relation.collectionId.pk)
        collections_tag = Collection.objects.filter(profileId=self.kwargs['pk'], collectionId__in=collection_ids)
        result = queryset.union(collections_folder).union(collections_tag)
        data = collection_to_json(result)

        return JsonResponse(data, status=200, safe=False)


# ----
from django.shortcuts import render, redirect
import requests
import re
from bs4 import BeautifulSoup

def regular_string(s):
    return s.replace("\\u002F", "/").replace("\\u0026", "&")

def get_title_from_link(link):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    response = requests.get(link, headers=headers)
    response.encoding = 'utf-8'  # 确保正确的编码
    html = response.text

    # 使用 BeautifulSoup 解析 HTML
    soup = BeautifulSoup(html, 'html.parser')

    # 根据实际页面结构提取标题
    title_tag = soup.find('title')
    title = title_tag.text.strip() if title_tag else "未知标题"

    return title

def get_image_urls_from_meta_tags(link):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    response = requests.get(link, headers=headers)
    response.encoding = 'utf-8'  # 确保正确的编码
    html = response.text

    # 使用 BeautifulSoup 解析 HTML
    soup = BeautifulSoup(html, 'html.parser')

    # 提取 og:image 元标签中的图片链接
    # 转义特殊字符
    og_images = soup.find_all('meta', {'name': re.escape('og:image')})
    if og_images:
        image_urls = [img['content'] for img in og_images if 'content' in img.attrs][0]
    else:
        image_urls = ["N/A"]

    return image_urls

def get_description_from_meta_tags(link):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    }
    response = requests.get(link, headers=headers)
    response.encoding = 'utf-8'  # 确保正确的编码
    html = response.text

    soup = BeautifulSoup(html, 'html.parser')
    meta_description = soup.find('meta', {'name': 'description'})

    return meta_description['content'] if meta_description else "No description found"


