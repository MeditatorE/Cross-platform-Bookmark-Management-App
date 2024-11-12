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

from django.urls import path
from .views import (
    FolderListView, CollectionListView, SharedUserListView, FolderCreateView, CollectionCreateView, FolderUpdateView, CollectionUpdateView, FolderDeleteView, CollectionDeleteView,
    TagCreateView, TagUpdateView, TagDeleteView, SharedFolderCreateView, SharedFolderListView,
    CollectionAllListView, CollectionDeletedListView, CollectionArchivedListView,
    TagListView, getSharedCode, CollectionArchiveView, getSharedTag, getShareLink,
    CollectionRecoverView, CollectionRealDeleteView, CollectionSearchView
)

urlpatterns = [
    path('profile/<int:profile_pk>/folders/', FolderListView.as_view(), name='folder-list'),    #   获取文件夹列表（GET）
    path('profile/<int:profile_pk>/sharefolders/', SharedFolderListView.as_view(), name='sharefolder-list'),
    path('profile/<int:profile_pk>/folders/<int:folder_pk>/sharedcode/', getSharedCode, name='shared-code-list'),   # 获取当前文件夹的sharecode
    path('sharedtag/', getSharedTag, name='shared-tag-list'),   # 获取系统预置tags（GET）
    path('profile/<int:pk>/search', CollectionSearchView.as_view(), name='search-collection'),  # 所有搜索功能（GET）
    path('profile/<int:profile_pk>/all/', CollectionAllListView.as_view(), name='all-collection-list'), # 当前用户所有收藏内容
    path('profile/<int:profile_pk>/folder/<int:folder_pk>/collections/', CollectionListView.as_view(),
         name='collection-list'),   # 当前文件夹所有收藏内容
    path('profile/<int:profile_pk>/del/', CollectionDeletedListView.as_view(), name='del-collection-list'), # 所有暂时删除的收藏内容
    path('profile/<int:profile_pk>/archive/', CollectionArchivedListView.as_view(), name='archive-collection-list'),    # 所有存档的收藏内容
    path('sharedfolder/<int:folder_pk>/users/', SharedUserListView.as_view(), name='shared-user-list'), # 共享文件夹所有用户
    path('profile/<int:profile_pk>/tags/', TagListView.as_view(), name='tag-list'), # 当前用户所有tags
    path('collection/<int:pk>/link', getShareLink, name='shared-link'), # 获取收藏内容的url

    path('profile/<int:profile_pk>/tag/create/', TagCreateView.as_view(), name='tag-create'),   # 创建Tag
    path('profile/<int:profile_pk>/folder/create/', FolderCreateView.as_view(), name='folder-create'),  # 创建普通文件夹
    path('profile/<int:profile_pk>/folder/<int:folder_pk>/collection/create/', CollectionCreateView.as_view(),
         name='collection-create'),    # 文件夹内新建collection（GET&POST）
    path('profile/<int:profile_pk>/collection/create/', CollectionCreateView.as_view(),
         name='collection-create-nofolder'),    # 主页新建collection（GET&POST）
    path('profile/<int:profile_pk>/sharedfolder/create/', SharedFolderCreateView.as_view(), name='shared-folder-create'),   # 共享文件夹的加入/创建（POST）
    path('profile/<int:profile_pk>/tag/<int:pk>/edit', TagUpdateView.as_view(), name='tag-update'), # Tag更新（POST）
    path('profile/<int:profile_pk>/folder/<int:pk>/update/', FolderUpdateView.as_view(), name='folder-update'), # 文件夹更新（POST）
    path('profile/<int:profile_pk>/folder/<int:folder_pk>/collection/<int:pk>/recover/', CollectionRecoverView.as_view(),
        name='collection-recover'), # 收藏内容复原（POST）
    path('profile/<int:profile_pk>/collection/<int:pk>/archive/', CollectionArchiveView.as_view(),
         name='collection-archive'),    # 收藏内容归档（POST）
    path('profile/<int:profile_pk>/collection/<int:pk>/delete/', CollectionDeleteView.as_view(),
         name='collection-delete'),    # 收藏内容删除（POST）
    path('profile/<int:profile_pk>/collection/<int:pk>/', CollectionUpdateView.as_view(),
         name='collection-detail'), # 修改收藏内容（GET&POST）

    path('profile/<int:profile_pk>/folder/<int:folder_pk>/collection/<int:pk>/realdel/', CollectionRealDeleteView.as_view(),
        name='collection-realdel'), # 收藏内容彻底删除（DELETE）
    path('profile/<int:profile_pk>/tag/<int:pk>/delete', TagDeleteView.as_view(), name='tag-delete'),   # Tag删除（DELETE）
    path('profile/<int:profile_pk>/folder/<int:pk>/delete/', FolderDeleteView.as_view(), name='folder-delete'), # Folder删除（DELETE）
]
