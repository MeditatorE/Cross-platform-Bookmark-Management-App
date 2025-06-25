<!-- 邮箱验证码注册 -->
<template>
	<view class="uni-content">
		<match-media :min-width="690">
			<view class="login-logo">
				<image :src="logo"></image>
			</view>
			<!-- 顶部文字 -->
			<text class="title title-box">Email verification code registration</text>
		</match-media>
		<uni-forms ref="form" :value="formData" :rules="rules" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="email" required>
				<uni-easyinput :inputBorder="false" :focus="focusEmail" @blur="focusEmail = false"
					class="input-box" placeholder="Please input your email" v-model="formData.email" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="nickname">
				<uni-easyinput :inputBorder="false" :focus="focusNickname" @blur="focusNickname = false" class="input-box" placeholder="Please enter user nickname" 
				v-model="formData.nickname" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="password" v-model="formData.password" required>
				<uni-easyinput :inputBorder="false" :focus="focusPassword" @blur="focusPassword = false"
					class="input-box" maxlength="20" :placeholder="'Please input' + (config.passwordStrength == 'weak'?'6':'8') + '-16bit password'" type="password"
					v-model="formData.password" trim="both" />
			</uni-forms-item>
			<uni-forms-item name="password2" v-model="formData.password2" required>
				<uni-easyinput :inputBorder="false" :focus="focusPassword2" @blur="focusPassword2 =false"
					class="input-box" placeholder="Enter password again" maxlength="20" type="password" v-model="formData.password2"
					trim="both" />
			</uni-forms-item>
			<uni-forms-item name="code" >
				<uni-id-pages-email-form ref="shortCode" :email="formData.email" type="register" v-model="formData.code">
				</uni-id-pages-email-form>
			</uni-forms-item>
			<uni-id-pages-agreements scope="register" ref="agreements" ></uni-id-pages-agreements>
			<button class="uni-btn" type="primary" @click="submit">Register</button>
			<button @click="navigateBack" class="register-back">Back</button>
			<match-media :min-width="690">
				<view class="link-box">
					<text class="link" @click="registerByUserName">Username and password registration</text>
					<text class="link" @click="toLogin">Already have an account? Click here to log in</text>
				</view>
			</match-media>
		</uni-forms>
	</view>
</template>

<script>
	import rules from './validator.js';
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	import config from '@/uni_modules/uni-id-pages/config.js'
	import passwordMod from '@/uni_modules/uni-id-pages/common/password.js'
	const uniIdCo = uniCloud.importObject("uni-id-co")
	export default {
		mixins: [mixin],
		data() {
			return {
				formData: {
					email: "",
					nickname: "",
					password: "",
					password2: "",
					code: ""
				},
				rules: {
					email: {
						rules: [{
								required: true,
								errorMessage: 'Please input your email',
							},{
								format:'email',
								errorMessage: 'E-mail format is incorrect',
							}
						]
					},
					nickname: {
						rules: [{
								minLength: 3,
								maxLength: 32,
								errorMessage: 'Nickname length is between {minLength} and {maxLength} characters',
							},
							{
								validateFunction: function(rule, value, data, callback) {
									// console.log(value);
									if (/^1\d{10}$/.test(value) || /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
										callback('Nickname cannot be: mobile phone number or email address')
									};
									if (/^\d+$/.test(value)) {
										callback('Nickname cannot be purely numeric')
									};
									if(/[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/.test(value)){
										callback('Nickname cannot contain Chinese characters')
									}
									return true
								}
							}
						],
						label: "Nickname"
					},
					...passwordMod.getPwdRules(),
					code: {
						rules: [{
								required: true,
								errorMessage: 'Please enter the email verification code',
							},
							{
								pattern: /^.{6}$/,
								errorMessage: 'Email verification code is incorrect',
							}
						]
					}
				},
				focusEmail:false,
				focusNickname:false,
				focusPassword:false,
				focusPassword2:false,
				logo: "/static/logo.png"
			}
		},
		onReady() {
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
			 * 触发表单提交
			 */
			submit() {
				this.$refs.form.validate().then((res) => {
					if (this.needAgreements && !this.agree) {
						return this.$refs.agreements.popup(()=>{
							this.submitForm(res)
						})
					}
					this.submitForm(res)
				}).catch((errors) => {
					let key = errors[0].key
					key = key.replace(key[0], key[0].toUpperCase())
					// console.log(key);
					this['focus'+key] = true
				})
			},
			submitForm(params) {
				uniIdCo.registerUserByEmail(this.formData).then(e => {
					// console.log(e);
					uni.navigateTo({
						url: '/uni_modules/uni-id-pages/pages/login/login-withpwd',
						complete: (e) => {
							// console.log(e);
						}
					})
				})
				.catch(e => {
					// console.log(e);
					console.log(e.message);
				})
			},
			navigateBack() {
				uni.navigateBack()
			},
			toLogin() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withpwd'
				})
			},
			registerByUserName() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/register/register'
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
			padding: 30px 40px;
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
	.uni-content ::v-deep .uni-forms-item__label {
		position: absolute;
		left: -15px;
	}

	button {
		margin-top: 15px;
	}
</style>
