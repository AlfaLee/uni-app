<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					车辆终端
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
					开始时间
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
					结束时间
				</view>
				<view class="uni-list-cell-db">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
				</view>
			</view>
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
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0:
						switch (this.multiIndex[0]) {
							case 0:
								this.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
								this.multiArray[2] = ['猪肉绦虫', '吸血虫']
								break
							case 1:
								this.multiArray[1] = ['鱼', '两栖动物', '爬行动物']
								this.multiArray[2] = ['鲫鱼', '带鱼']
								break
						}
						this.multiIndex[1] = 0
						this.multiIndex[2] = 0
						break
					case 1:
						switch (this.multiIndex[0]) {
							case 0:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['猪肉绦虫', '吸血虫']
										break
									case 1:
										this.multiArray[2] = ['蛔虫']
										break
									case 2:
										this.multiArray[2] = ['蚂蚁', '蚂蟥']
										break
									case 3:
										this.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓']
										break
									case 4:
										this.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物']
										break
								}
								break
							case 1:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['鲫鱼', '带鱼']
										break
									case 1:
										this.multiArray[2] = ['青蛙', '娃娃鱼']
										break
									case 2:
										this.multiArray[2] = ['蜥蜴', '龟', '壁虎']
										break
								}
								break
						}
						this.multiIndex[2] = 0
						break
				}
				this.$forceUpdate()
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
			}
		}
	}
</script>

<style>

</style>
