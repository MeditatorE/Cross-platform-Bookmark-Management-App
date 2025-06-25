<template>
	<view class="font-style">
    <view class="container">
        <view class="gray-overlay" :class="{ 'show': isInputFocused || isFolderListVisible }"></view>
        <view class="bottom-sheet" :class="{ 'show': isVisible }">
            <view class="sheet-content">
                <view class="sheet-header">
                    <text class="sheet-title">Add Link</text>
                    <button class="done-btn" @click="done">Done</button>
                </view>
                <!-- 输入框 -->
                <view class="sheet-body">
                    <textarea
                        class="input-box"
                        placeholder="Website link https://..."
                        v-model="inputValue"
                        @focus="onFocus"
                        @blur="onBlur"
                    ></textarea>
                    <view class="button-container">
                        <button class="action-button add-folder" @click="toggleFolderList">➕ Shared Folder</button>
                        <button class="action-button add-tag" @click="toggleTagList">➕ Add Tag</button>
                    </view>
                </view>
            </view>
            <!-- 文件夹选项列表 -->
            <view class="bottom-sheet folder-list-container" :class="{ 'show': isFolderListVisible }">
                <view class="sheet-content">
                    <view class="sheet-header sticky">
                        <text class="sheet-title">Select Folder</text>
                        <button class="done-btn" @click="toggleFolderList">Close</button>
                    </view>
                    <view class="sheet-body">
                            <uni-section title="Folder Name" type="line">
                                <view class="example-body">
                                    <uni-combox :candidates="candidates" placeholder="Select your folder" v-model="city"></uni-combox>
                                    <view class="result-box">
                                        <text>Selected: {{city}}</text>
                                    </view>
                                </view>
                            </uni-section>
                    </view>
                </view>
			</view>

            <!-- 标签选项列表 -->
            <view class="bottom-sheet tag-list-container" :class="{ 'show': isTagListVisible }">
                <view class="sheet-content">
                    <view class="sheet-header sticky">
                        <text class="sheet-title">Add Tag</text>
                        <button class="done-btn" @click="toggleTagList">Close</button>
                    </view>
                    <view class="sheet-body">
                            <uni-section title="Tag Name" type="line">
                                <view class="uni-px-5 uni-pb-5">
									<view class="input-with-button">
			                                    <input 
			                                        type="text" 
			                                        v-model="newTag" 
			                                        placeholder="Enter your new tag" 
			                                        class="tag-input"
			                                    />
												<button @click="addNewTag" class="add-tag-button">Done</button>
									</view>
                                    <view class="text">Selected: {{JSON.stringify(checkbox2)}}</view>
                                    <uni-data-checkbox class="a" mode="button" multiple v-model="checkbox2" :localdata="hobby"></uni-data-checkbox>
                                </view>
                            </uni-section>
                    </view>
                </view>
			</view>
        </view>
    </view>
	</view>
</template>

<script>
export default {
    data() {
        return {
            isVisible: false,
            isInputFocused: false,
            inputValue: '',
            isFolderListVisible: false,
			isTagListVisible: false,
            candidates: ['Folder 1', 'Folder 2', 'Folder 3', 'Folder 4', 'Folder 5', 'Folder 6', 'Folder 7'],
			city: '',
			newTag: '',
            checkbox2: [0],
			selectedTags: [],
            hobby: [
                { text: 'Tag 1', value: 0 },
                { text: 'Tag 2', value: 1 },
                { text: 'Tag 3', value: 2 },
				{ text: 'Tag 4', value: 3 },
				{ text: 'Tag 5', value: 4 },
				{ text: 'Tag 6', value: 5 },			
            ]

        };
    },
    methods: {
        open() {
            this.isVisible = true;
        },
        close() {
            this.isVisible = false;
            this.isInputFocused = false;
			this.isFolderListVisible = false;
			this.isTagListVisible = false;
        },
        toggleFolderList() {
            this.isFolderListVisible = !this.isFolderListVisible;
        },
        toggleTagList() {
            if (this.isTagListVisible) {
                this.selectedTags = this.checkbox2.map(tagValue => {
                    const tag = this.hobby.find(h => h.value === tagValue);
                    return tag ? tag.text : '';
                });
                this.$emit('update-tags', this.selectedTags);
            }
            this.isTagListVisible = !this.isTagListVisible;
        },
    addNewTag() {
      const trimmedTag = this.newTag.trim();
      if (trimmedTag) {
        const newValue = this.hobby.length; 
        this.hobby.push({ text: trimmedTag, value: newValue });
        this.checkbox2.push(newValue); 
        this.newTag = ''; 
      }
    },
        addTagFromInput() {
            if (this.newTag.trim()) {
                this.tags.push(this.newTag.trim());
                this.newTag = '';
            }
        },
		done() {
		  if (this.inputValue.trim() !== '') {
	        const selectedTagNames = this.selectedTags.map(tagValue => {
	          const tag = this.hobby.find(h => h.value === tagValue);
	          return tag ? tag.text : '';
	        });
			
			const newItem = {
			  id: Date.now(),
			  image: '/static/pic/13.png',
			  name: this.inputValue.trim(),
			  date: new Date().toISOString().split('T')[0],
			  tags: this.selectedTags
			}; 
			this.$emit('add-item', newItem);
		  }
		  this.close();
		},
        addTag() {
            console.log('Add Tag:', this.inputValue);
            this.close();
        },
        onFocus() {
            this.isInputFocused = true;
            this.fixBackgroundPosition();
        },
        onBlur() {
            this.isInputFocused = false;
            this.resetBackgroundPosition();
        },
        fixBackgroundPosition() {
            // Add styles to fix background position
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
        },
        resetBackgroundPosition() {
            // Remove the styles
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(document.body.style.top || '0') * -1);
        },
        selectPredefinedTag(tag) {
            if (!this.tags.includes(tag)) {
                this.tags.push(tag);
            }
        },
        removeTag(tag) {
            this.tags = this.tags.filter(t => t !== tag);
        },
    }
};
</script>

<style scoped>
.container {
    position: relative;
}
.gray-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: none;
}
.gray-overlay.show {
    display: block;
}
.bottom-sheet {
    position: fixed;
    bottom: -100%;
    left: 0;
    width: 100%;
    background-color: #F2F2F6;
    transition: bottom 0.3s ease;
    z-index: 1001;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}
.bottom-sheet.show {
    bottom: 0;
}
.sheet-content {
    padding: 20rpx;
}
.sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #F2F2F6;
    padding-bottom: 10rpx;
}
.sheet-header.sticky {
    position: sticky;
    top: 0;
    background-color: #F2F2F6;
    z-index: 1002; 
}
.sheet-title {
    font-size: 36rpx;
    font-weight: bold;
    flex: 1;
    margin-left: 280rpx;
}
.done-btn {
    font-size: 32rpx;
	height: 72rpx ;
    color: #fff;
    background-color: #007bff;
    padding: 10rpx 20rpx;
    border: none;
    border-radius: 10rpx;
    cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}
.sheet-body {
    padding-top: 20rpx;
}
.input-box {
    width: 700rpx;
    height: 250rpx;
    padding: 20rpx;
    font-size: 28rpx;
    border: 1px solid #ccc;
    border-radius: 25rpx;
    box-sizing: border-box;
	margin-top: 0rpx;
	margin-left: 15rpx;
	margin-bottom: 25rpx;
	background-color: #fff;
}
.input-boxb {
    width: 700rpx;
    height: 90rpx;
    padding: 20rpx;
    font-size: 28rpx;
    border: 1px solid #ccc;
    border-radius: 25rpx;
    box-sizing: border-box;
	margin-top: 0rpx;
	margin-left: 15rpx;
	margin-bottom: 25rpx;
	background-color: #fff;
}
.button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
}
.action-button {
    width: 300rpx;
	height: 70rpx;
    padding: 20rpx;
    font-size: 25rpx;
    background-color: #fff;
    border-radius: 35rpx;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	margin-top: 20rpx;
	margin-bottom: 50rpx;
	
}
.action-button.add-folder {
    background-color: #fff;
}
.action-button.add-tag {
    background-color: #fff;
}
.folder-list-container, .tag-list-container {
    max-height: 40vh;
    overflow-y: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #F2F2F6;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
    transform: translateY(100%);
    z-index: 1003; 
}
.folder-list-container.show, .tag-list-container.show {
    transform: translateY(0);
}
.folder-list {
    width: 700rpx;
    background-color: #fff;
    border-radius: 15rpx;
    padding: 20rpx;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.folder-item {
    width: 600rpx;
	height: 70rpx;
    padding: 20rpx;
    font-size: 28rpx;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10rpx;
    margin-top: 10rpx;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
}
.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    padding: 10rpx;
}
.tag-item {
	height: 50rpx;
    background-color: #007bff;
    color: #000;
    border-radius: 15rpx;
    padding: 10rpx;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.text {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
	margin-bottom: 2px;
}
.uni-px-5 {
	border-radius: 20rpx;
    padding-left: 10px;
    padding-right: 10px;
	
}
.uni-pb-5 {
	margin-left: 50rpx;
	border-radius: 20rpx;
    padding-bottom: 10px;
}
.example-body {
    padding: 12px;
    background-color: #FFFFFF;
}

.result-box {
    text-align: center;
    padding: 20px 0px;
    font-size: 16px;
	height: 50px;
}
.tag-list-container {
    justify-content: center;
}
.a{
	padding-left: 25px;
}
.input-with-button {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.tag-input {
  flex: 1;
  margin-left: -10px;
  width: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.add-tag-button {	
  margin-left: 10px;
  font-size: 32rpx;
  height: 72rpx ;
  color: #fff;
  background-color: #007bff;
  padding: 10rpx 20rpx;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.add-tag-button:hover {
  background-color: #0056b3;
}
</style>
