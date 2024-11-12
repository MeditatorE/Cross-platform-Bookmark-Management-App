<template>
	<view>
		<uni-captcha :focus="focusCaptchaInput" ref="captcha" scene="send-sms-code" v-model="captcha" />
		<view class="box">
			<uni-easyinput :focus="focusSmsCodeInput" @blur="focusSmsCodeInput = false" type="number" class="input-box" :inputBorder="false" v-model="modelValue" maxlength="6" :clearable="false"
				placeholder="Please enter the SMS verification code">
			</uni-easyinput>
			<view class="short-code-btn" hover-class="hover" @click="start">
				<text class="inner-text" :class="reverseNumber==0?'inner-text-active':''">{{innerText}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	function debounce(func, wait) {
		let timer;
		wait = wait || 500;
		return function() {
			let context = this;
			let args = arguments;
			if (timer) clearTimeout(timer);
			let callNow = !timer;
			timer = setTimeout(() => {
				timer = null;
			}, wait)
			if (callNow) func.apply(context, args);
		}
	}
	/**
	 * sms-form
	 * @description 获取短信验证码组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=
	 * @property {Number} count 倒计时时长 s
	 * @property {String} phone 手机号码
	 * @property {String} type = [login-by-sms|reset-pwd-by-sms|bind-mobile] 	验证码类型，用于防止不同功能的验证码混用，目前支持的类型login登录、register注册、bind绑定手机、unbind解绑手机
	 * @property {false} focusCaptchaInput = [true|false] 验证码输入框是否默认获取焦点
	 */
	export default {
		name: "uni-sms-form",
		model: {
			prop: 'modelValue',
			event: 'update:modelValue'
		},
		props: {
			event: ['update:modelValue'],
			/**
			 * 倒计时时长 s
			 */
			count: {
				type: [String, Number],
				default: 60
			},
			/**
			 * 手机号码
			 */
			phone: {
				type: [String, Number],
				default: ''
			},
			/*
				验证码类型，用于防止不同功能的验证码混用，目前支持的类型login登录、register注册、bind绑定手机、unbind解绑手机
			*/
			type: {
				type: String,
				default () {
					return 'login'
				}
			},
			/*
				验证码输入框是否默认获取焦点
			*/
			focusCaptchaInput: {
				type: Boolean,
				default () {
					return false
				}
			},
		},
		data() {
			return {
				captcha: "",
				reverseNumber: 0,
				reverseTimer: null,
				modelValue: "",
				focusSmsCodeInput:false
			};
		},
		watch: {
			captcha(value, oldValue) {
				if (value.length == 4 && oldValue.length != 4) {
					this.start()
				}
			},
			modelValue(value) {
				// TODO 兼容 vue2
				this.$emit('input', value);
				// TODO　兼容　vue3
				this.$emit('update:modelValue', value)
			}
		},
		computed: {
			innerText() {
				if (this.reverseNumber == 0) return "Get SMS verification code";
				return "Resend" + '(' + this.reverseNumber + 's)';
			}
		},
		created() {
			this.initClick();
		},
		methods: {
			getImageCaptcha(focus) {
				this.$refs.captcha.getImageCaptcha(focus)
			},
			initClick() {
				this.start = debounce(() => {
					if (this.reverseNumber != 0) return;
					this.sendMsg();
				})
			},
			sendMsg() {
				if (this.captcha.length != 4) {
					this.$refs.captcha.focusCaptchaInput = true
					return uni.showToast({
						title: 'Please enter the graphic verification code first',
						icon: 'none',
						duration: 3000
					});
				}
				let reg_phone = /^1\d{10}$/;
				if (!reg_phone.test(this.phone)) return uni.showToast({
					title: "Malformed phone number",
					icon: 'none',
					duration: 3000
				});
				const uniIdCo = uniCloud.importObject("uni-id-co", {
					customUI: true
				})
				console.log('sendSmsCode',{
					"mobile": this.phone,
					"scene": this.type,
					"captcha": this.captcha
				});
				uniIdCo.sendSmsCode({
					"mobile": this.phone,
					"scene": this.type,
					"captcha": this.captcha
				}).then(result => {
					uni.showToast({
						title: "SMS verification code sent successfully",
						icon: 'none',
						duration: 3000
					});
					this.reverseNumber = Number(this.count);
					this.getCode();
				}).catch(e => {
					if (e.code == "uni-id-invalid-sms-template-id") {
						this.modelValue = "123456"
						uni.showToast({
							title: 'Test mode has been started, details [Console information]',
							icon: 'none',
							duration: 3000
						});
						console.warn(e.message);
					} else {
						this.getImageCaptcha()
						this.captcha = ""
						uni.showToast({
							title: e.message,
							icon: 'none',
							duration: 3000
						});
					}
				})
			},
			getCode() {
				if (this.reverseNumber == 0) {
					clearTimeout(this.reverseTimer);
					this.reverseTimer = null;
					return;
				}
				this.reverseNumber--;
				this.reverseTimer = setTimeout(() => {
					this.getCode();
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		position: relative;
		margin-top: 10px;
	}

	.short-code-btn {
		padding: 0;
		position: absolute;
		top: 0;
		right: 8px;
		width: 260rpx;
		max-width: 100px;
		height: 44px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	.inner-text {
		font-size: 14px;
		color: #AAAAAA;
	}

	.inner-text-active {
		color: #04498c;
	}

	.captcha {
		width: 350rpx;
	}

	.input-box {
		margin: 0;
		padding: 4px;
		background-color: #F8F8F8;
		font-size: 14px;
	}

	.box ::v-deep .content-clear-icon {
		margin-right: 110px;
	}

	.box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
</style>
