<template>
    <view class="container" >
        <map id="map" :longitude="longitude" :latitude="latitude"  :scale="5"  :polyline="polyline"   :markers="localMarker" style="width: 100%; height: 800upx;">
        </map>
        <view style="width: 100%; height: 12%;position:relative">
            <view class="modal-dialog"  v-if="!isPlay">
                <view class="modal-content">
                    <span class="index_label">起始时间</span>
                    <picker class="index_picker" mode="date" :value="startDate" start="1999-01-01" end="2099-01-01" @change="startDateChange">
                        <view>{{startDate}}</view>
                    </picker>
                </view>
                 <view class="modal-content">
                    <span class="index_label">结束时间</span>
                    <picker class="index_picker" mode="date" :value="endDate" start="1999-01-01" end="2099-01-01" @change="endDateChange">
                        <view>{{endDate}}</view>
                    </picker>
                </view>
                <button type="primary" size="mini" class="index_button searchTrajectory" @click="search">
                    查询
                </button>
            </view>
            <view class="play_box" v-if="isPlay">
                <img :src="exitIcon"  class="back_button" @click="init">
                <img :src="backOffIcon" class="play_back" @click="backOff">
                <img :src="changeIcon" class="play_play"  @click="play">
                <img :src="forwardIcon"  class="play_back"  @click="forward">
            </view>
        </view>
    </view>
</template>
<script>
import iconEnd from '../../static/logo.png'
import iconStart from '../../static/logo.png'
import playIcon from '../../static/qq.png'
import backOffIcon from '../../static/logo.png'
import pauseIcon from '../../static/logo.png'
import exitIcon from '../../static/logo.png'
import forwardIcon from '../../static/logo.png'
export default {
    data () {
        return {
            changeIcon:playIcon,
            iconEnd,iconStart,exitIcon,backOffIcon,forwardIcon,
            startDate:'22',
            requestNum:0,
            markerIndex:0,
            isPlay:false,
            localRequestNum:0,
            endDate:'22',
            longitude:113.3245211,
            latitude:23.10229,
            localScale:12,
            requestData:{
                ak:'r2HdBmVGA8K1e8MtecYEwEzknDQWMzPP',
                service_id:157038,
                page_size:5000,
                entity_name:'29211750a219419b80e66f28939576b4',
                is_processed:0,
                coord_type_output:'gcj02'
                // process_option:'need_denoise=0',
            },
            includePoints:[],
            centerPoint:{},
            setCenter:'',
            playTrajectory:'',
            isPlayNow:false,
            localMarker: [{//标注
                iconPath: iconStart,
                id: 0,
                latitude: 23.10229,
                longitude: 113.3245211,
                width: 20,
                height: 30
            },{//标注
                iconPath: iconEnd,
                id: 1,
                latitude: 0,
                longitude: 0,
                width: 20,
                height: 30
            }],
            polyline: [{//线型覆盖物
                points: [[119.478935,30.997761],[116.578939,31.997825],[116.678912,32.998549],[116.778912,33.998549],[116.878998,34.998555],
							[116.978998,35.998555],[117.479282,36.99856],[117.579658,37.998528],[117.680151,38.998453],[116.480784,39.998302],
							[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],
							[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]],
                color:"#129cff",
                width: 4,
                dottedLine: false
            }],
            vehicleId:'', //查询车辆ID,
            timeRangeLegal:true //查询时间区间是否合法 
        }
    },
    methods: {
        searchTrajectory(startDate){//鹰眼查询轨迹
            this.requestData.start_time=this.localRequestNum*3600*12+startDate
            this.requestData.end_time=this.requestData.start_time+3600*12;
            this.requestData.entity_name = this.$root.$mp.query.vehicleId || "29211750a219419b80e66f28939576b4";
           /* wx.request({
                url: 'https://yingyan.baidu.com/api/v3/track/gettrack', //仅为示例，并非真实的接口地址
                data: this.requestData,
                success: (res) => {
                    if(res.data.points&&res.data.points.length>0){
                        this.polyline[0].points=this.polyline[0].points.concat(res.data.points);
                    } else {
                        return wx.showToast({title:"没有查询到轨迹点",icon: 'none'});
                    }
                    this.localRequestNum++;
                    if(this.localRequestNum<this.requestNum){
                        this.searchTrajectory(startDate);
                    }else{
                        let polyline=this.polyline[0].points;
                        this.mapChange2();
                        console.log(polyline)
                        if(polyline.length>1){
                            this.localMarker[0].latitude=polyline[0].latitude;
                            this.localMarker[0].longitude=polyline[0].longitude;
                            this.localMarker[1].latitude=polyline[polyline.length-1].latitude;
                            this.localMarker[1].longitude=polyline[polyline.length-1].longitude;
                            this.isPlay=true;
                            this.includePoints=polyline;
                        }
                    }
                }
            }) */
        },
        startDateChange(e) {
            this.startDate=e.mp.detail.value;
            this.valiDate()
        },
        mapChange2(){
           let maxLat=0,maxLon=0,minLat=1000,minLon=1000,i,points=this.polyline[0].points;
           for(i=0;i<points.length;i++){
               if(points[i].longitude>maxLon){
                   maxLon=points[i].longitude;
               }
               if(points[i].longitude<minLon){
                   minLon=points[i].longitude;
               }
               if(points[i].latitude>maxLat){
                   maxLat=points[i].latitude;
               }
               if(points[i].latitude<minLat){
                   minLat=points[i].latitude;
               }
           }
            this.latitude=(minLat+maxLat)/2;
            this.longitude=(minLon+maxLon)/2;
            console.log(this.localScale)
        },      
        endDateChange(e) {
            this.endDate=e.mp.detail.value;
            this.valiDate()
        },
        valiDate() { //查询时间是否合法
            let startScape = (+new Date(this.startDate));
            let endScape = (+new Date(this.endDate));
            if((endScape- startScape) > 86400000) {
                this.timeRangeLegal = false;
                console.log(startScape+":"+endScape)
                return wx.showToast({title:"区间不能大于两天",icon: 'none'});
            } else {
                this.timeRangeLegal = true;
            }
        },
        changeScale(){
            let mapCtx = wx.createMapContext("map");
            mapCtx.getScale ({
                success:(res) => {
                    this.localScale=res.scale
                }
            })
        },
        timeParse(val){
            val=val.replace(/-/g, '/');
            let data=new Date(val);
            data.setHours(0);
           return (data.getTime())/1000;
        },
        search(){
            if(!this.timeRangeLegal) {
                return wx.showToast({title:"区间不能大于两天",icon: 'none'});
            }
            let startDate,endDate;
            startDate=this.timeParse(this.startDate)
            endDate=this.timeParse(this.endDate);
            this.requestNum=Math.ceil((endDate-startDate)/(3600*12)); //半天请求一次
            this.localRequestNum=0;
            this.polyline[0].points=[[119.478935,30.997761],[116.578939,31.997825],[116.678912,32.998549],[116.778912,33.998549],[116.878998,34.998555],
							[116.978998,35.998555],[117.479282,36.99856],[117.579658,37.998528],[117.680151,38.998453],[116.480784,39.998302],
							[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],
							[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];
            this.searchTrajectory(startDate)
        },
        setCenterPoints(lon,lat) {
            let mapCtx = wx.createMapContext("map");
            mapCtx.translateMarker({
                markerId:0,
                destination:{longitude:lon,latitude:lat},
                autoRotate:true,
                rotate:0
            })            
        },
        play(){
            let  show= () => {
                this.playTrajectory=setTimeout(() => {
                    // console.log(this.polyline[0].points[this.markerIndex].longitude,this.polyline[0].points[this.markerIndex].latitude)
                    // this.setCenterPoints(this.polyline[0].points[this.markerIndex].longitude,this.polyline[0].points[this.markerIndex].latitude)
                    this.localMarker[1].latitude= this.polyline[0].points[this.markerIndex].latitude
                    this.localMarker[1].longitude= this.polyline[0].points[this.markerIndex].longitude
                    this.markerIndex++;
                    if(this.markerIndex<this.polyline[0].points.length){
                        show()
                    }else{
                        this.changeIcon=playIcon;
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
            this.changeIcon==pauseIcon?this.changeIcon=playIcon:this.changeIcon=pauseIcon;
            this.isPlayNow=!this.isPlayNow;
        },
        backOff(){
            if(this.playTrajectory!=''){
                clearTimeout(this.playTrajectory)
            }
            if(this.markerIndex>0){
                this.markerIndex--;
                // this.setCenterPoints(this.polyline[0].points[this.markerIndex])
                this.localMarker[1].latitude= this.polyline[0].points[this.markerIndex].latitude
                this.localMarker[1].longitude= this.polyline[0].points[this.markerIndex].longitude
            }
        },
        init(){
            Object.assign(this.$data, this.$options.data());
            wx.getLocation({//获取当前位置
                type: 'gcj02',
                success: (res) => {
                    console.log(res)
                    this.latitude = res.latitude
                    this.longitude = res.longitude
                }
            })
            let date=new Date();
            let curDateSart = '';
            let curEnd = "";
            console.log(date.getDate())
            if(date.getDate()<10){
                curDateSart = '0'+date.getDate();
                curEnd = '0'+(date.getDate()+1);
                if(date.getDate() == 9){
                    curDateSart = '0'+date.getDate();
                    curEnd = date.getDate()+1;                    
                }
            } else {
                curDateSart = date.getDate();
                curEnd = date.getDate()+1;
            }
            this.startDate=date.getFullYear()+'-'+(date .getMonth()+1)+'-'+curDateSart; //获取当前日(1-31)
            this.endDate=date.getFullYear()+'-'+(date .getMonth()+1)+'-'+curEnd; //获取当前日(1-31)
        },
        forward(){
            if(this.playTrajectory!=''){
                clearTimeout(this.playTrajectory)
                this.playTrajectory=''
            }
            if(this.markerIndex<this.polyline[0].points.length){
                this.markerIndex++;
                // this.setCenterPoints(this.polyline[0].points[this.markerIndex])
                this.localMarker[1].latitude= this.polyline[0].points[this.markerIndex].latitude
                this.localMarker[1].longitude= this.polyline[0].points[this.markerIndex].longitude
            }
        }
    },
    onShow(){
        // this.longitude = this.$root.$mp.query.longitude;
        // this.latitude = this.$root.$mp.query.latitude;        
        this.init()
    }
}
</script>
<style>
.play_play{
    width: 80rpx;
    height: 80rpx;
    /* margin: 0 100rpx; */
}
.play_back{
    width: 66rpx;
    height: 66rpx;
}
.play_box{
    padding: 40rpx 0; 
    width: 410rpx;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
}
.back_button{
    position: absolute;
    left: 20rpx;
    width: 27rpx;
    height: 24rpx;
    bottom:90rpx;
    line-height: 1;
    font-size: 30rpx;
    padding: 10rpx;
}
.searchTrajectory {
   position: relative;
   top: -30rpx;
}
</style>
