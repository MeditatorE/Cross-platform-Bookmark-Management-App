<template>
	<uni-popup ref="popup" type="bottom">
		<view class="box">
			<text class="headBox">Binding data</text>
			<text class="tip">Get your WeChat avatar and nickname to complete your profile</text>
			<view class="btnBox">
				<text @click="closeMe" class="close">Close</text>
				<button class="agree uni-btn" type="primary" @click="getUserProfile">OK</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	const db = uniCloud.database();
	const usersTable = db.collection('uni-id-users')
	let userId = ''
	export default {
		emits:['next'],
		data() {
			return {}
		},
		methods: {
			async open(uid){
				userId = uid
				this.$refs.popup.open()
			},
			async getUserProfile(){
				uni.showLoading();
				let res = await new Promise((callBack) => {
					uni.getUserProfile({
						desc: "Used to set account nickname and avatar",
						complete: (e) => {
							callBack(e)
						}
					})
				})
				if(res.errMsg != "getUserProfile:ok"){
					return this.closeMe()
				}
				let {avatarUrl,nickName} = res.userInfo;
				
				let tempFilePath = await new Promise((callBack)=>{
					uni.downloadFile({
					    url: avatarUrl,
					    success: (res) => {
								if (res.statusCode === 200) {
					            // console.log('下载成功');
									callBack(res.tempFilePath)
								}
							callBack()
					    },
						fail: (err) => {
							console.error(err)
						},
						complete: (e) => {
							// console.log("downloadFile",e);
						}
					});
				})
				const extName = tempFilePath.split('.').pop() || 'jpg'
				const cloudPath = 'user/avatar/'+ userId+'/'+Date.now()+'-avatar.'+extName;
				const result = await uniCloud.uploadFile({
					filePath: tempFilePath,
					cloudPath,
					fileType:'image'
				});
				let userInfo = {
					"nickname":nickName,
					"avatar_file":{
						name:cloudPath,
						extname:"jpg",
						url:result.fileID
					}
				}
				this.doUpdate(userInfo,()=>{
					this.$refs.popup.close()
				})
			},
			closeMe(e){
				uni.showLoading();
				this.doUpdate({nickname:"Anonymous WeChat user"},()=>{
					uni.hideLoading()
					this.$refs.popup.close()
				})
			},
			doUpdate(data,callback){
				// 使用 clientDB 提交数据
				usersTable.where('_id==$env.uid').update(data).then((res) => {
					callback(res)
				}).catch((err) => {
					uni.showModal({
						content: err.message || 'Requesting service failed',
						showCancel: false
					})
					callback(err)
				}).finally(() => {
					this.$emit('next')
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "@/uni_modules/uni-id-pages/common/login-page.scss";
view{
	display: flex;
}
.box{
	background-color: #FFFFFF;
	height:200px;
	width: 750rpx;
	flex-direction: column;
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;
}
.headBox{
	padding:20rpx;
	height:80rpx;
	line-height:80rpx;
	text-align: left;
	font-size:16px;
	color:#333333;
	margin-left: 15rpx;
}
.tip{
	color:#666666;
	text-align: left;
	justify-content: center;
	margin:10rpx 30rpx;
	font-size:18px;
}
.btnBox{
	margin-top:45rpx;
	justify-content: center;
	flex-direction: row;
}
.close,.agree{
	text-align: center;
	width:200rpx;
	height:80upx;
	line-height:80upx;
	border-radius:5px;
	margin:0 20rpx;
	font-size:14px;
}
.close{
	color:#999999;
	border-color: #EEEEEE;
	border-style: solid;
	border-width: 1px;
	background-color:#FFFFFF;
}
.close:active{
	color:#989898;
	background-color:#E2E2E2;
}
.agree{
	color:#FFFFFF;
}
/* #ifdef MP */
.agree::after {
   border: none;
}
/* #endif */
.agree:active{
	background-color:#F5F5F6;
}
</style>
