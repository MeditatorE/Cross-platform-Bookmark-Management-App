<template>
  <view class="container font-style">
    <view class="content-wrap">
      <view class="friend-list-container">
        <view v-for="(friend, index) in friends" :key="index" class="friend-item-wrap">
          <view class="friend-item" @longpress="handleLongPress(index)">
            <image class="friend-image" :src="friend.image" />
            <text class="friend-name">{{ friend.name }}</text>
          </view>
          <view v-if="index < friends.length" class="separator"></view>
        </view>
        <view class="add-friend-item" @click="showAddFriendModal">
          <image class="friend-image" src="/static/pic/Plus.png" />
          <text class="friend-name">Add friends</text>
        </view>
      </view>
	  <view class="exit-button" @click="exitButton">Exit the folder</view>
    </view> 
	
	
    <!-- 分享链接弹窗 -->
    <view class="share-popup" v-if="isSharePopupVisible">
      <view class="share-popup-content">
        <view class="share-popup-top">
          <image src="/static/pic/link.png" class="share-popup-image"></image>
          <view class="share-popup-text">
            <view class="invite-text">Shared Link</view>
            <view class="link-text">Anyone with the link</view>
          </view>
        </view>
      </view>
      <button class="share-popup-button" @click="copyLink">Share Link</button>
      <view class="close-button" @click="closeSharePopup">✖</view>
    </view>
	
    <!-- 编辑/删除弹窗 -->
    <view class="edit-popup" v-if="isEditPopupVisible">
      <view class="edit-popup-content">
        <button class="edit-popup-button" @click="deleteFriend">Delete</button>
        <view class="close-button" @click="closeEditPopup">✖</view>
      </view>
    </view>
	
  </view>
</template>

<script>
export default {
  data() {
    return {
      friends: [
        { image: '/static/pic/LeftAccessory.png', name: 'User Name 1' },
        { image: '/static/pic/Ellipse 178.png', name: 'User Name 2' },
        { image: '/static/pic/Ellipse 177.png', name: 'User Name 3' }
      ],
      isSharePopupVisible: false,
      isEditPopupVisible: false,
      selectedFriendIndex: null
    };
  },
  methods: {
    handleLongPress(index) {
      this.selectedFriendIndex = index;
      this.isEditPopupVisible = true;
    },
    showAddFriendModal() {
      this.isSharePopupVisible = true;
    },
    copyLink() {
      const link = 'https://example.com/share-link';
      this.copyToClipboard(link);
      alert('Link copied to clipboard');
      this.isSharePopupVisible = false;
    },
    copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch((err) => {
          console.error('Could not copy text: ', err);
        });
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
        } catch (err) {
          console.error('Could not copy text: ', err);
        }
        document.body.removeChild(textArea);
      }
    },
	closeSharePopup() {
		this.isSharePopupVisible = false;
	},
    closeEditPopup() {
      this.isEditPopupVisible = false;
    },
    deleteFriend() {
      if (this.selectedFriendIndex !== null) {
        this.friends.splice(this.selectedFriendIndex, 1);
      }
      this.closeEditPopup();
    },
    exitFolder() {
      // 
    },
  }
};
</script>

<style>
	.container {
	  background-color: #F2F2F6; 
	  padding: 0;
	}
	.content-wrap {
	  padding: 20px;
	  background-color: #F2F2F6; 
	  min-height: 100vh;
	}
	.friend-list-container {
	  background-color: #fff;
	  padding: 20px;
	  border-radius: 10px;
	  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}
	.friend-item-wrap {
	  margin-bottom: 15px;
	}
	.friend-item, .add-friend-item {
	  display: flex;
	  align-items: center;
	  padding: 10px 0;
	  margin-top: -15px;
	}
	.friend-image {
	  width: 35px;
	  height: 35px;
	  margin-right: 10px;
	}
	.friend-name {
	  font-size: 16px;
	  color: #000;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	.separator {
	  height: 1px;
	  background-color: #e0e0e0;
	  margin: 0 -20px;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	.add-friend-item {
	  color: blue;
	  cursor: pointer;
	  margin-bottom: -15px;
	}
	/* Share popup styles */
	.share-popup {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 90%;
	  background: #fff;
	  padding: 20px;
	  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
	  border-top-left-radius: 10px;
	  border-top-right-radius: 10px;
	  z-index: 1009;
	}

	.share-popup-content {
	  display: flex;
	  align-items: center;
	}

	.share-popup-top {
	  display: flex;
	  align-items: center;
	  margin-bottom: 20rpx;
	}

	.share-popup-image {
	  width: 60px;
	  height: 60px;
	  margin-right: 20px;
	  border-radius: 10px;
	}

	.share-popup-text {
	  flex: 1;
	}

	.invite-text {
	  font-size: 16px;
	  font-weight: bold;
	}

	.link-text {
	  font-size: 16px;
	  color: #6c757d;
	}

	.share-popup-button {
	  margin-top: 15px;
	  height: 50px;
	  background-color: #007bff;
	  color: #fff;
	  padding: 10px 20px;
	  border: none;
	  border-radius: 10px;
	  font-size: 16px;
	  cursor: pointer;
	  flex-direction: column;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	.close-button {
	  position: absolute;
	  top: 10rpx;
	  right: 10rpx;
	  background: none;
	  border: none;
	  font-size: 24rpx;
	  cursor: pointer;
	  margin-top: 5px;
	  margin-right: 5px;
	}
	.edit-popup {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  background-color: #fff;
	  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
	  border-top-left-radius: 10px;
	  border-top-right-radius: 10px;
	  padding: 20px;
	}
	.edit-popup-content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
	.edit-popup-button {
	  width: 100%;
	  height: 40px;
	  padding: 10px;
	  margin-top: 30px;
	  background-color: #007aff;
	  color: #fff;
	  border: none;
	  border-radius: 5px;
	  cursor: pointer;
	  display: flex;
      align-items: center;
	  justify-content: center;
	}
  .exit-button {
    width: 94%;
    height: 27px;
    padding: 10px;
    margin-top: 30px;
    background-color: #fff;
    color: #ff4d4d;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>