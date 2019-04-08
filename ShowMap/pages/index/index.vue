<template>
    <view>
        <!-- <page-head :title="title"></page-head> -->
        <view class="uni-common-mt">
            <view>
                <map id="myMap" style="width:sWidth;height:sHeight;" 
				:latitude="latitude" :longitude="longitude" :scale="scale"
				:controls="controls" :markers="markers" :polyline="polyline" 
				show-location @controltap="controlTap">
				<!-- <cover-image class="controls-play img" @click="play" src="../../static/nowposition.png"></cover-image>
				<cover-image class="controls-play img_zoomin" :inScale="scale" @click="fun_zoomIn()" src="../../static/zoom_in.png"></cover-image>
				<cover-image class="controls-play img_zoomout" @click="fun_zoomOut" src="../../static/zoom_out.png"></cover-image> -->
				
				<!-- <cover-view v-if="traceFlag" class="cover-View" @click="startAnimation()">开始动画</cover-view>
				<cover-view v-if="traceFlag" class="cover-View" style="margin-right: 5upx;" @click="stopAnimation()">暂停动画</cover-view>
				<cover-view v-if="traceFlag" class="cover-View" style="margin-right: 5upx;" @click="continueAnimation()">继续动画</cover-view> -->
				<cover-view v-if="traceFlag" class="cover-View" style="margin-right: 5upx;" @click="endAnimation()">清除轨迹</cover-view>					
               
                </map>				
            </view>
        </view>		
    </view>
</template>
<script>
	import amap from "../../components/amap-wx.js";	
	import Vue from 'vue';
	import uniDrawer from "../../components/uni-drawer.vue";
	
	import VueAMap from "vue-amap";
    export default {
        data() {
            return {	
				showRigth: false,
				showLeft: false,
				terminalID:1,
				destinationPoint:[],
				pointsIndex:0,
				markerIndex:0,
				playTrajectory:'',
				positionPoint:{
					longitude:'',
					latitude:''
				},			
				myMapContext:'',
				scale:10,
                title: 'map',
                latitude: '',
                longitude: '',	
				locationName:'',
				sWidth:'',
				sHeight:'',
				traceFlag:false,
				traceData:[[119.478935,30.997761],[116.578939,31.997825],[116.678912,32.998549],[116.778912,33.998549],[116.878998,34.998555],
							[116.978998,35.998555],[117.479282,36.99856],[117.579658,37.998528],[117.680151,38.998453],[116.480784,39.998302],
							[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],
							[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]
						  ],
				// [ 119.699559,31.780254],[113.699559,34.780254]
                markers: [{
                    //title:'我在哪，我在哪',
					id:0,
                    latitude: '',
                    longitude: '',
					width:20,
					height:20,//APP不支持宽高
                    iconPath: '../../static/position64.png',
                    label:{
                        color:'#F76350',
                        bgColor:'#fff',
                        padding:5,
                        borderRadius:4
                    },
                    callout:{
                        content:'',
                        color:'#F76350',
                        fontSize:12
                    }
                },
				{
					id:1,
                    latitude: '',
                    longitude: '',
                    iconPath: '../../static/qq.png',
                    label:{
                        color:'#F76350',
                        bgColor:'#fff',
                        padding:5,
                        borderRadius:4
                    },
                    callout:{
                        content:'',
                        color:'#F76350',
                        fontSize:12
                    }
                },
				],
				controls:[{
					id:0,
					position:{
						left:3,
						top:460,
						width:35,
						height:35,
					},
					iconPath:'../../static/nowposition.png',	
					clickable:true				
				},
/* 				{
					id:1,
					position:{
						left:6,
						top:450,
						width:35,
						height:35,
					},
					iconPath:'../../static/zoom_in.png',	
					clickable:true				
				}, */
				{
					id:2,
					position:{
						left:6,
						top:495,
						width:35,
						height:35,
					},
					iconPath:'../../static/zoom_out.png',	
					clickable:true				
				},
				{
					id:3,
					position:{
						left:300,
						top:480,
						width:50,
						height:50,
					},
					iconPath:'../../static/menu.png',	
					clickable:true				
				},
				/* {
					id:4,
					position:{
						left:300,
						top:500,
						width:45,
						height:45,
					},
					iconPath:'../../static/position.png',	
					clickable:true				
				}, */
				
				],
                polyline:[
                    {
                    'points':[],
                     color:'#00BFFF',
                     width:5
					}
				],
            }
        },
		onReady:function(){			
			let _this = this;
			this.mapContext = uni.createMapContext("myMap");			
			this.mapContext.getScale({
				success:function(res){
					_this.scale = res.scale;					
				}
			});
			uni.getLocation({
				type: 'gcj02',
				success: function (res) {
					_this.longitude = res.longitude;
					_this.latitude = res.latitude;
					_this.markers[0].longitude = res.longitude;
					_this.markers[0].latitude = res.latitude;
					_this.markers[0].width=30;
					_this.markers[0].height = 30;
					_this.getLocationName(res.longitude,res.latitude,_this);
				}
			});
		},
		onLoad:function(){
			let that = this;					
			this.getLocationName(null,null,this);			 
		},
        methods: {
			controlTap:function(e){
				let that = this;
				//定位
				if(e.mp.controlId==0){
					let _this = this;					
					uni.getLocation({
						success:function(res){
							_this.mapContext = uni.createMapContext('myMap');  
							_this.longitude = res.longitude;
							_this.latitude = res.latitude;					 
							_this.mapContext.moveToLocation();  
							_this.$data.scale = 13;	
							_this.positionPoint = res.longitude;
							_this.positionPoint = res.latitude;
							_this.mapContext.translateMarker({
								markerId:0,
								destination:_this.positionPoint,
								autoRotate:false,
								rotate:0,
								duration:5000,
								animationEnd:function(){
									uni.showToast({
										title:"End ReLoacte",
										duration:3000
									})
								}
							});
							var toastStr = _this.$data.locationName;
							_this.getLocationName(res.longitude,res.latitude,_this);
						}
					});
				}
				//放大
// 				if(e.mp.controlId==1){
// 					 this.$data.scale=++this.scale;
// 				}
				//缩小
				if(e.mp.controlId==2){
					this.$data.scale=--this.scale;
				}
				//底部弹框
				if(e.mp.controlId==3){
					uni.showActionSheet({
						itemList: ['echarts', 'vedio', 'scroll','轨迹回放','H5+AppMap'],
						success: function (res) {
							if(res.tapIndex==0){
								uni.navigateTo({
									url:'../npmTest/index1'
								});
							}
							if(res.tapIndex==1){
								uni.navigateTo({
									url:'../video/video'
								})
							}
							if(res.tapIndex==2){
								uni.navigateTo({
									url:'../scroll-view/scroll-view'
								})
							}
							//轨迹回放
							if(res.tapIndex==3){
								that.traceFlag = true;									
								
								that.mapContext = uni.createMapContext('maMap');
								for (var i=0;i<that.traceData.length;i++) {
									let tempObj={};
									tempObj.longitude = that.traceData[i][0];
									tempObj.latitude = that.traceData[i][1];
									that.polyline[0].points.push(tempObj);
									that.destinationPoint.push({longitude:that.$data.traceData[i][0],latitude:that.$data.traceData[i][1]});
									//为了触发页面页面数据更新需要触发setter
									Vue.set(that.polyline[0].points[i],'longitude',that.traceData[i][0]);
									Vue.set(that.polyline[0].points[i],'latitude',that.traceData[i][1]);									
								}								
								var qidianMarker = {
									id:2,
									latitude: '',
									longitude: '',
									iconPath: '../../static/qidian.png',
								}
								var zhongdianMarker = {
									id:3,
									latitude: '',
									longitude: '',
									iconPath: '../../static/zhongdian.png',
								}	
								that.markers.push(qidianMarker);
								that.markers.push(zhongdianMarker);								
								that.markers[2].longitude = that.traceData[0][0];
								that.markers[2].latitude = that.traceData[0][1];
								that.markers[3].longitude = that.traceData[that.traceData.length-1][0];
								that.markers[3].latitude = that.traceData[that.traceData.length-1][1];
								
								uni.navigateTo({
									url:'../trackmap/webmap'
								});
								
							}
							if(res.tapIndex==4){
								uni.navigateTo({
									url:'../H5Map/h5map'
								})
							}
						},
						fail: function (res) {
							console.log(res.errMsg);
						}
					});
				}
				//定位打点
				if(e.mp.controlId==4){
					let that = this;
					uni.getLocation({
						success:function(res){
							that.$data.traceData.push({
								traceLon:res.longitude,
								traceLat:res.latitude
							})							
						}
					});					
				}
			},
			getLocationName:function(longitude,latitude,_this){
				var pages = getCurrentPages();  
				var page = pages[pages.length - 1];			
				// #ifdef APP-PLUS  
				var ptObj = new plus.maps.Point( longitude,latitude);					
				var currentWebview = page.$getAppWebview();
				plus.maps.Map.reverseGeocode(ptObj,{},function(event){
					var address = event.address;  // 转换后的地理位置
					var point = event.coord;  // 转换后的坐标信息
					var coordType = event.coordType;	// 转换后的坐标系类型
					console.log("Address:"+address);
					_this.$data.markers[0].callout.content=address;
					},function(e){
						console.log("Failed:"+JSON.stringify(e));
					});
				// #endif 	
				
				// #ifdef MP-WEIXIN
				var amapFile = require('../../components/amap-wx.js');
				var myAmap = new amapFile.AMapWX({key:'34984c80891a54ad76855a7cd55ca8f4'});
				myAmap.getRegeo({
					success:function(data){
					//成功回调
					var marker = [{
					  id: data[0].id,
					  latitude: data[0].latitude,
					  longitude: data[0].longitude,
					  iconPath: data[0].iconPath,
					  width: data[0].width,
					  height: data[0].height
					}]
					_this.$data.markers[0].callout.content=data[0].name+data[0].desc;				
					},
					fail: function(info){
					//失败回调
					console.log(info)
					}
				});
				// #endif
			},
			endAnimation:function(){
				this.traceFlag = false;
				this.polyline=null;//置空轨迹线坐标点，会同步删除轨迹线
				this.markers[2]=null;
				this.markers[3]=null;				
			},
			/* timeOutFun:function(){
				this.destinationPoint.push({longtitude:this.traceData[i][0],latitude:this.traceData[i][1]});
				Vue.set(this.destinationPoint[i],'longtitude',this.traceData[i][0]);
				Vue.set(this.destinationPoint[i],'latitude',this.traceData[i][1]);
				mapContext.translateMarker({
				markerId:0,
				destination:this.destinationPoint[i],
				autoRotate:false,
				rotate:1,
				duration:3000,
				animationEnd:function(){
					console.log("移动移动结束");
					if(this.$data.pointsIndex<18){
						console.log("移动移动结束.....");
						// startAnimation(mapContext);
					}
					this.$data.pointsIndex++;
					console.log(this.$data.destinationPoint);
					
				},
				fail:function(e){
					console.log("来了老弟");
					console.log(e);
					}
				});
			}, */
			startAnimation:function(){
			/* console.log(mapContext);
			for (var i=0;i<this.traceData.length;i++) {
				console.log(i);
				this.destinationPoint.push({longtitude:this.traceData[i][0],latitude:this.traceData[i][1]});
				Vue.set(this.destinationPoint[i],'longtitude',this.traceData[i][0]);
				Vue.set(this.destinationPoint[i],'latitude',this.traceData[i][1]);
				console.log(this.destinationPoint[i]);					
				mapContext.translateMarker({
				markerId:1,
				destination:this.destinationPoint[i],
				autoRotate:false,
				rotate:0,
				duration:5000,
				animationEnd:function(){						
					console.log("移动移动结束");
				},
				fail:function(e){
							console.log("来了老弟");
							console.log(e);
					}
				});
			} */	

				let  show= () => {
				  this.playTrajectory=setTimeout(() => {
				      // console.log(this.polyline[0].points[this.markerIndex].longitude,this.polyline[0].points[this.markerIndex].latitude)
				      // this.setCenterPoints(this.polyline[0].points[this.markerIndex].longitude,this.polyline[0].points[this.markerIndex].latitude)
				      this.markers[2].latitude= this.polyline[0].points[this.markerIndex].latitude;
				      this.markers[2].longitude= this.polyline[0].points[this.markerIndex].longitude;
				      this.markerIndex++;
				      if(this.markerIndex<this.polyline[0].points.length){
				          show()
				      }else{
				          // this.changeIcon=playIcon;
						 clearTimeout(this.playTrajectory);
				          this.markerIndex=0;
				          this.isPlayNow=false;
				      }
				  },200)
				}
				if(this.isPlayNow){
				    clearTimeout(this.playTrajectory);
				}else{
				    show();
				}
				// this.changeIcon==pauseIcon?this.changeIcon=playIcon:this.changeIcon=pauseIcon;
				// this.isPlayNow=!this.isPlayNow;
			},
			continueAnimation:function(){
				let show=()=>{
					this.myMapContext=uni.createMapContext('maMap');
					this.playTrajectory = setTimeout(()=>{
						console.log(this.markerIndex);
						this.destinationPoint.latitude= this.polyline[0].points[this.markerIndex].latitude;
						this.destinationPoint.longitude= this.polyline[0].points[this.markerIndex].longitude;
						this.markerIndex++;
						this.myMapContext.translateMarker({
							markerId:1,
							destination:this.destinationPoint,
							autoRotate:true,
							rotate:1,
							duration:2000,
							animationEnd:function(){						
								console.log("移动移动结束");
							},
						});
						if(this.markerIndex<this.polyline[0].points.length){
						    show()
						}else{
						    // this.changeIcon=playIcon;
							 clearTimeout(this.playTrajectory);
						    this.markerIndex=0;
						    // this.isPlayNow=false;
						}
					},2000);
				}
				if(this.isPlayNow){
				    clearTimeout(this.playTrajectory);
				}else{
				    show();
				}
			},
        },
		components: {uniDrawer}
	}
</script>
<style>
	#traceControl{		
		right: 50%;
		bottom: 50%;
	}
	cover-View{
		/* display: inline-block; */
		position: absolute;
		bottom: 22%;
		right: 4%;
		font-size: 35upx;
		/* border:1px solid blue; */
		background-color:rgba(0, 0, 255, 0.5);		
		float: right;
		
		
	}
	cover-image {
		width: 100upx;
		height: 100upx;
    }
	.img {
        position: relative;
        width: 60upx;
        height: 60upx;
		bottom:10%;
        left: 2%;
        margin-top: -50upx;
    }
	.img_zoomin {
	    position: absolute;
	    width: 60upx;
	    height: 60upx;
		top:10%;
	    right: 1%;
	    margin-top: -50upx;
	}
	.img_zoomout {
	    position: absolute;
	    width: 60upx;
	    height: 60upx;
		top:5%;
	    right: 1%;
	    margin-top: -50upx;
	}
   map {
		position:relative;
        width: 100%;
        height: 1280upx;
    }
    .test{
        background: #fff;
        height: 100upx;
        text-align: center;
        display: flex;
        margin: 30upx;
    }
</style>