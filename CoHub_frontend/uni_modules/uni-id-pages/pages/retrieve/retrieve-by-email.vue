<!-- 找回密码页 -->
<template>
	<view class="uni-content">
		<match-media :min-width="690">
			<view class="login-logo">
				<image :src="logo"></image>
			</view>
			<!-- 顶部文字 -->
			<text class="title title-box">Retrieve password via email verification code</text>
		</match-media>
		<uni-forms ref="form" :value="formData" err-show-type="toast">
			<uni-forms-item name="email">
				<uni-easyinput :focus="focusEmail" @blur="focusEmail = false" class="input-box" :disabled="lock" :inputBorder="false"
					v-model="formData.email" placeholder="Please input your email">
				</uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="code">
				<uni-id-pages-email-form ref="shortCode" :email="formData.email" type="reset-pwd-by-email" v-model="formData.code">
				</uni-id-pages-email-form>
			</uni-forms-item>
			<uni-forms-item name="password">
				<uni-easyinput :focus="focusPassword" @blur="focusPassword = false" class="input-box" type="password" :inputBorder="false" v-model="formData.password"
					placeholder="Please enter a new password"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="password2">
				<uni-easyinput :focus="focusPassword2" @blur="focusPassword2 = false" class="input-box" type="password" :inputBorder="false" v-model="formData.password2"
					placeholder="Please enter a new password again"></uni-easyinput>
			</uni-forms-item>
			<button class="uni-btn send-btn-box" type="primary" @click="submit">Submit</button>
			<match-media :min-width="690">
				<view class="link-box">
					<text class="link" @click="retrieveByPhone">Retrieve password through mobile phone verification code</text>
					<view></view>
          <text class="link" @click="backLogin">Return to login</text>
        </view>
			</match-media>
		</uni-forms>
		<uni-popup-captcha @confirm="submit" v-model="formData.captcha" scene="reset-pwd-by-sms" ref="popup"></uni-popup-captcha>
	</view>
</template>

<script>
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	import passwordMod from '@/uni_modules/uni-id-pages/common/password.js'
	const uniIdCo = uniCloud.importObject("uni-id-co",{
		errorOptions:{
			type:'toast'
		}
	})
	export default {
		mixins: [mixin],
		data() {
			return {
				lock: false,
				focusEmail:true,
				focusPassword:false,
				focusPassword2:false,
				formData: {
					"email": "",
					"code": "",
					'password': '',
					'password2': '',
					"captcha": ""
				},
				rules: {
					email: {
						rules: [{
								required: true,
								errorMessage: 'please input your email',
							},
							{
								format:'email',
								errorMessage: 'E-mail format is incorrect',
							}
						]
					},
					code: {
						rules: [{
								required: true,
								errorMessage: 'Please enter the email verification code',
							},
							{
								pattern: /^.{6}$/,
								errorMessage: 'Please enter the 6-digit verification code',
							}
						]
					},
					...passwordMod.getPwdRules()
				},
				logo: "/static/logo.png"
			}
		},
		computed: {
			isEmail() {
				let reg_email = /@/;
				let isEmail = reg_email.test(this.formData.email);
				return isEmail;
			},
			isPwd() {
				let reg_pwd = /^.{6,20}$/;
				let isPwd = reg_pwd.test(this.formData.password);
				return isPwd;
			},
			isCode() {
				let reg_code = /^\d{6}$/;
				let isCode = reg_code.test(this.formData.code);
				return isCode;
			}
		},
		onLoad(event) {
			if (event && event.emailNumber) {
				this.formData.email = event.emailNumber;
				if(event.lock){
					this.lock = event.lock //如果是已经登录的账号，点击找回密码就锁定指定的账号绑定的邮箱码
					this.focusEmail = true
				}
			}
		},
		onReady() {
			if (this.formData.email) {
				this.$refs.shortCode.start();
			}
			this.$refs.form.setRules(this.rules)
		},
		onShow() {
			// #ifdef H5
			document.onkeydown = event => {
				var e = event || window.event;
				if (e && e.keyCode == 13) { //回车键的键值为13
					this.submit()
				}
			};
			// #endif
		},
		methods: {
			/**
			 * 完成并提交
			 */
			submit() {
				this.$refs.form.validate()
					.then(res => {
						let {
							email,
							password: password,
							captcha,
							code
						} = this.formData
						uniIdCo.resetPwdByEmail({
								email,
								code,
								password,
								captcha
							}).then(e => {
								uni.navigateTo({
									url: '/uni_modules/uni-id-pages/pages/login/login-withpwd',
									complete: (e) => {
										// console.log(e);
									}
								})
							})
							.catch(e => {
								if (e.errCode == 'uni-id-captcha-required') {
									this.$refs.popup.open()
								}
							}).finally(e => {
								this.formData.captcha = ""
							})
					}).catch(errors=>{
						let key = errors[0].key
						if(key == 'code'){
							return this.$refs.shortCode.focusSmsCodeInput = true
						}
						key = key.replace(key[0], key[0].toUpperCase())
						this['focus'+key] = true
					})
			},
			retrieveByPhone() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/retrieve/retrieve'
				})
			},
			backLogin () {
				uni.redirectTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withpwd'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uni-id-pages/common/login-page.scss";

	@media screen and (max-width: 690px) {
		.uni-content{
			margin-top: 15px;
		}
	}
	@media screen and (min-width: 690px) {
		.uni-content{
			padding: 30px 40px 40px;
			max-height: 650px;
		}

		.link-box {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			justify-content: space-between;
			margin-top: 10px;
		}

		.link {
			font-size: 12px;
		}
	}
</style>
