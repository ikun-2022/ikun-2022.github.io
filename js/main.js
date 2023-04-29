/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/
var app =new Vue ({
    el:"#player",
    data:{
        query:"",           // 查询关键字
        musicList:[],       // 歌曲列表
        musicUrl:"",        // 歌曲播放地址
        musicPic:"",        // 歌曲封面/图片
        hotComments:[],     // 歌曲热评
        isPlaying:false,    // 歌曲播放动画是否展示
        isShow:false,       // MV播放遮罩层是否展示
        mvUrl:"",           // MV播放地址

    },
    methods: {
        searchMusic: function () {
            // axios.get('https://autumnfish.cn/search?keywords=' + this.query).then(response => {
            //     this.musicList = response.data.result.songs;  // 用箭头行数可以不用写that
            // })
            var that = this
            axios.get("https://autumnfish.cn/search?keywords=" + this.query)    // 获取歌曲清单地址,query在前台用v-model双向绑定,即由前台传值
                .then(function (response) {
                    // console.log(response);      // 如果不知道获取到的是什么数据,可以console.log打印出所以数据,再慢慢分层下去
                    // console.log(response.data.result.songs);
                    that.musicList = response.data.result.songs;  
                    // 获取歌曲列表,接口返回的songs数据是数组,所以musicList为数组格式,因为这个语句不是在then函数里,而是在then的function函数里,this.指向已经发生了变化,所以写var that = this;
                }, function (err) {})
        },
        playMusic:function(musicId){        //musicId从musicList可获取到,所以再又前台传到后台
            // console.log(musicId);
            var that = this
            axios.get("https://autumnfish.cn/song/url?id=" + musicId)  //获取歌曲播放地址
            .then(function (response) {
                // console.log(response);
                // console.log(response.data.data[0].url);
                that.musicUrl = response.data.data[0].url;  //获取歌曲具体播放地址
            }, function (err) {})

            axios.get("https://autumnfish.cn/song/detail?ids=" + musicId)
            .then(function (response) {
                // console.log(response);
                // console.log(response.data.songs[0].al.picUrl);
                that.musicPic = response.data.songs[0].al.picUrl;   //获取歌曲封面
            }, function (err) {})

            axios.get("https://autumnfish.cn/comment/hot?type=0&id=" + musicId)
            .then(function (response) {
                // console.log(response);
            // console.log(response.data.hotComments)
            that.hotComments = response.data.hotComments;
            }, function (err) {})
        },
        play:function(){
            // console.log("play");
            this.isPlaying=true;  //如果歌曲正在播放,那么播放动画为真
        },
        pause:function(){
            // console.log("pause");
            this.isPlaying=false;  //如果歌曲已经暂停,那么播放动画为假
        },
        playMv:function(mvId){
            var that = this
            axios.get("https://autumnfish.cn/mv/url?id=" + mvId)
            .then(function (response) {
                // console.log(response);
                // console.log(response.data.data.url);
                that.isShow=true;   //当能从服务端成功获取MV播放地址报文时,MV播放界面显示为真
                that.musicUrl= "";  //把歌曲播放地址置空相当于暂停
                that.mvUrl = response.data.data.url;  //给mvUrl赋值MV播放地址
            }, function (err) {})
        },
        close:function(){     // 关闭MV播放界面
            this.isShow=false;   //MV播放界面显示为假
            this.mvUrl = "";     //把MV播放地址置空相当于暂停
        }
        
    }
    


})