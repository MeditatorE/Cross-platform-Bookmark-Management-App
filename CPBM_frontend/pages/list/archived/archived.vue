<template>
	
<view class="collapse-wrapper">
	<uni-collapse>
      <uni-collapse-item v-for="(folder, index) in folders" :key="index" :title="folder.name">
       
        <view class="folder-content">
          <view v-for="(item, itemIndex) in folder.items" :key="itemIndex" class="swipe-item" @click="handleCollapseItemClick(item)">
            <uni-swipe-action-item :right-options="rightOptions">
              <view class="swipe-item-content" @click="navigateToGrid(item)">
				
				<view class="item-left">
				  <view class="circle-image">
				          <image class="circle-image-icon" :src="item.icon"></image>
				</view>
                <view class="item-text">{{ item.name }}</view>
				</view>
				</view>
				
			
            </uni-swipe-action-item>
          </view>
        </view>
      </uni-collapse-item>
    </uni-collapse>
</view>
			    
</template>

<script>
	let cdbRef;
	import statusBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar";
    import cmdNavBar from "@/components/cmd-nav-bar/cmd-nav-bar.vue";
	import { mapState } from 'vuex';
	
	
	import Gps from '@/uni_modules/json-gps/js_sdk/gps.js';
	const gps = new Gps(),db = uniCloud.database();

	export default {
		components: {
			statusBar,
			cmdNavBar
		},
		computed: {
			inputPlaceholder(e) {
				if (uni.getStorageSync('CURRENT_LANG') == "en") {
					return 'Please enter the search content'
				} else {
					return 'Quick Search1'
				}
			},
			colList(){
				return [
					db.collection('opendb-news-articles').where(this.where).field('avatar,title,last_modify_date,user_id').getTemp(),
					db.collection('uni-id-users').field('_id,nickname').getTemp()
				]
			}
		},
		data() {
			return {
				where: '"article_status" == 1',
				keyword: "",
				showRefresh: false,
				listHight: 0,
				swipeOptions: [],
				  rightOptions: [
					{
					 text: 'Recover',
					  style: {
						backgroundColor:'#0C79FE',
						backgroundImage: '/static/pic/edit.png', 
						backgroundSize: 'cover', 
						backgroundRepeat: 'no-repeat', 
						width: '100%', 
						margin: '0' 
					  },
					  click: (item) => this.handleRecover(item)
					},
					
					{
					  text: 'Delete',
					  style: {
						backgroundColor: '#FF3B30',
						color: '#FFFFFF'
					  },
					  click: (item) => this.handleDelete(item)
					}
				  ],
				  folders: [
				          {
				            name: 'All Archived Cards',
							isExpanded: false,
				            items: [
				              { name: 'All Archived Cards',icon: '/static/pic/10.png' }
				            ]
				          },
				          {
				            name: 'Archived Folders',
							isExpanded: false,
				            items: [
				              { name: 'Folder1',icon: '/static/pic/10.png' },
				              { name: 'Folder2',icon: '/static/pic/10.png' },
				              { name: 'Folder3',icon: '/static/pic/10.png' }
				            ]
				          },
						  
				          // Add more folders as needed
				        ]
			}
		},
		watch: {
			keyword(keyword, oldValue) {
				let where = '"article_status" == 1 '
				if (keyword) {
					this.where = where + `&& /${keyword}/.test(title)`;
				} else {
					this.where = where;
				}
			}
		},
		async onReady() {
			// #ifdef APP-NVUE
			/* 可用窗口高度 - 搜索框高 - 状态栏高 */
			this.listHight = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight - 50 + 'px';
			// #endif
			// #ifndef APP-NVUE
			this.listHight = 'auto'
			// #endif
			cdbRef = this.$refs.udb
		},
		async onShow() {
			this.keyword = getApp().globalData.searchText
			getApp().globalData.searchText = ''
			//这里仅演示如何，在onShow生命周期获取设备位置，并在设备或者应用没有权限时自动引导。设置完毕自动重新获取。
			//你可以基于他做自己的业务，比如：根据距离由近到远排序列表数据等
			// uni.showLoading({
			// 	title:"获取定位中"
			// });
			//默认h5端不获取定位
			// #ifndef H5
			let location = await gps.getLocation({
				geocode: true
			})
			// console.log(location);
			// #endif
			// if(location){
			// 	uni.showToast({
			// 		title: JSON.stringify(location),
			// 		icon: 'none'
			// 	});
			// }
			// uni.hideLoading()
		},
		methods: {
	      goToAllInfoPage() {
	        uni.navigateTo({
	          url: '/pages/list/all/all'
	        });
	      },
		  goToArchivedInfoPage() {
		    uni.navigateTo({
		      url: '/pages/list/archived/archived'
		    });
		  },
			navigateToGrid() {
				uni.navigateTo({
					url: '/pages/grid/grid'
				});
			},
			searchClick(e) { //点击搜索框
				uni.hideKeyboard();
				uni.navigateTo({
					url: '/pages/list/search/search',
					animationType: 'fade-in'
				});
			},
			retry() {
				this.refresh()
			},
			refresh() {
				cdbRef.loadData({
					clear: true
				}, () => {
					uni.stopPullDownRefresh()
					// #ifdef APP-NVUE
					this.showRefresh = false
					// #endif
					console.log('end');
				})
				console.log('refresh');
			},
			loadMore() {
				cdbRef.loadMore()
			},
			onqueryerror(e) {
				console.error(e);
			},
			onpullingdown(e) {
				console.log(e);
				this.showRefresh = true
				if(e.pullingDistance>100){
					this.refresh()
				}
			},
			handleCollapseItemClick(item) {
			    if (item.name === 'All Archived Cards') {
			      uni.navigateTo({
			        url: '/pages/list/archived/AllArchivedCards'
			      });
			    }
			  }
		},
			
		    handleRecover(item) {
		      console.log('Recover:', item);
		      // Handle Recover action here
		    },
		    
		    handleDelete(item) {
		      console.log('Delete:', item);
		      // Handle delete action here
		    },
		  
		
		// #ifndef APP-NVUE
		onPullDownRefresh() {
			this.refresh()
		},
		onReachBottom() {
			this.loadMore()
		}
		// #endif
	};
</script>

<style scoped>
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}
	/* #endif */
	.pages {
		background-color: #F2F2F6;
	}
	
	.cmd-nav-bar-left-title{
		font-weight: bold;
		font-size: 50cm;
	}
	
	.cmd-nav-bar{
		font-size: 50cm;
		font-weight: bold;
	}

	.avatar {
		width: 90rpx;
		height: 90rpx;
		margin-left: 600upx;
		margin-bottom: 20upx;
	}

	.main {
		justify-content: space-between;
		flex: 1;
	}

	.title {
		font-size: 55px;
		font-weight: bold;
	}

	.info {
		flex-direction: row;
		justify-content: space-between;
	}

	.author,
	.last_modify_date {
		font-size: 14px;
		color: #ACACB6;
	}

	.uni-search-box {
		background-color: #F2F2F6;
		position: sticky;
		height: 50px;
		top: 0;
		left: 0;
		/* #ifndef APP-PLUS */
		z-index: 9;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		width: 580rpx;
		/* #endif */
	}
	.cover-search-bar {
		height: 50px;
		position: relative;
		top: -50px;
		margin-bottom: -50px;
		/* #ifndef APP-NVUE */
		z-index: 999;
		/* #endif */
		
	}
	
	.button-container {
	  flex-direction: row;
	  display: flex;
	  justify-content: space-between;
	  padding-left: 13px;
	  padding-right: 13px;
	  padding-bottom: 20px;
	  padding-top: 20px;
	  flex-wrap: wrap;
	  position: relative;
	}

	.big-button {
	  flex: 1;
	  width: 150px;
	  height: 100px;
	  background-color: #fff;
	  display: flex;
	  flex-direction: column;
	  align-items: flex-start;
	  justify-content: center;
	  border-radius: 10px;
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	  margin: 0 8px;
	}

	.button-image {
	  width:36px;
	  height: 36px;
	  margin-bottom: 13px;
	  margin-left: 12px;
	}

	.button-text {
	  font-size: 18px;
	  font-weight: bold;
	  color: #8E8E92;
	  margin-left: 16px;
	}

	.button-number {
	  position: absolute;
	  right: 13px; 
	  top: 22%;
	  transform: translateY(-50%);
	  font-size: 26px;
	  font-weight: bold;
	}
	
	.swipe-item {
	  margin-bottom: 10px;
	  font-size: 12px;
	}
	
	.swipe-item-content {
	  width: 350px;
	  height: 50px;
	  padding: 20px;
	  background-color: #fff;
	  border-radius: 10px; /* 设置圆角 */
	  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
	  margin-bottom: 8px;
	  margin-left: 20px;
	  justify-content: center;
      align-items: left;
	  font-size: 12px;
	    overflow: hidden;
	}

	.uni-swipe_button-group {
	  display: flex;
	  box-sizing: border-box;
	  justify-content: space-between;
	  padding: 0 8px;
	}

	.uni-swipe_button {
	  width: 80px;
	  height: 50px;
	  line-height: 100%;
	  text-align: center;
	  background-color: #f1f1f1;
	  color: #333;
	  font-size: 12px;
	  padding: 0 16px;
	}
	
	.uni-swipe-button image {
	  width: 100%;
	  height: 100%;
	  border-radius: 10px;
	}

.swipe-item-content {
  display: flex;
  align-items: flex-start;/*文字图片居左*/
}

.item-left{
	flex-direction: row;/*文字图片在一行*/
	display: flex;
	align-items: flex-start;/*文字图片居左*/
}

.circle-image {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #eee;
  margin-right: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-image-icon {
  width: 30rpx;
  height: 30rpx;
}

.item-text {
  flex: 1;
}

</style>