<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					车辆终端:
				</view>
				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input">{{array[index]}}</view>
					</picker>
				</view>
			</view>
		</view>	
		
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					开始时间:
				</view>
				<view class="uni-list-cell-db">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
				</view>
			</view>
		</view>
		
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					结束时间:
				</view>
				<view class="uni-list-cell-db">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
				</view>
			</view>
		</view>		
		<view class="button-sp-area">
			<button type="primary" plain="true" @click="setConfirm">确定</button>			
		</view>
		<view v-if="false">
			<web-view src="../../hybrid/html/local.html"></web-view>
		</view>
	</view>
	
</template>
<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			});
			return {
				isShow:false,
				title: 'picker',
				array: ['13222', '4566', '78999', '4564215'],
				index: 0,
				multiIndex: [0, 0, 0],
				date: currentDate,
				time: '12:01'
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onReady:function(){
			
		},
		methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.index = e.target.value
			},
			
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			bindTimeChange: function(e) {
				this.time = e.target.value
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}-${day}`;
			},
			setConfirm:function(){
				isShow = true;
			}
		}
	}
</script>

<style>

</style>
