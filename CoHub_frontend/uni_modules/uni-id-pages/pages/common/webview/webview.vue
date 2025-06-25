<!-- 网络链接内容展示页（uni-id-pages中用于展示隐私政策协议内容） -->
<template>
	<view>
		<web-view v-if="url" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		onLoad({url,title}) {
			if(url.substring(0, 4) != 'http'){
				uni.showModal({
					title:"Error",
					content: 'Not a valid website link,'+'"'+url+'"',
					showCancel: false,
					confirmText:"OK",
					complete: () => {
						uni.navigateBack()
					}
				});
				title = "Path error"
			}else{
				this.url = url;
			}
			if(title){
				uni.setNavigationBarTitle({title});
			}
		},
		data() {
			return {
				url:null
			};
		}
	}
</script>
