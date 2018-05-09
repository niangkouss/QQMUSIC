/**
 * Created by sole l on 2017/3/23.
 */

//1.绑定数据
;(function QQMUSIC() {

    var data = null;
    var $music = $('.Jmusic');
    var $move = $music.find('.Jmove');
    var $audio = $music.find('audio');
    var $right = $music.find('.right');
    var $like = $music.find('.Jlike');
    var $Jmain = $music.find('.Jmain');
    var $Jheader = $music.find('.Jheader');
    var $JtotalTime = $music.find('.JtotalTime');
    var $JcurTime = $music.find('.JcurTime');
    var Jheader = $music.find('.Jheader')[0];
    var $Jfooter = $music.find('.Jfooter');
    var Jfooter = $music.find('.Jfooter')[0];
    var $span = $music.find('.right span');
    var $barspan = $music.find('.bar span');
    var audio = $audio[0];

    var winHeight = document.documentElement.clientHeight||document.body.clientHeight;
    var $mainHeight = winHeight-Jheader.offsetHeight-Jfooter.offsetHeight-0.8*htmlFontSize;
    $Jmain.css({ //设置歌词显示部分的高度
        height:$mainHeight
    });
    function getData() {
        $.ajax({
            type:'get',
            url:'lyric1.json',
            cache:false,
            async:false,
            success:function (res) {
                res.code ==0? data = res.lyric:void 0;
            }
        });
    }
   // audio.play();
    function bindDatas() {
        var str = '';
        if(data && data.length){
            $.each(data,function (index,item) {
                str +='<p id="'+item.id+'" min="'+item.minute+'" sec="'+item.second+'">'+item.content+'</p>';
            });
            $move.html(str);
        }
        $(audio).on('canplay',function () {
            $JtotalTime.html(formateTime(audio.duration));
        });
    }

    function play() {
        if(audio.paused){
            audio.play();
            $span.css('background-position','-3.17rem 0');
            return;
        }
        audio.pause();
        $span.css('background-position','0.07rem 0');
    }

    function progress() {  //progress的作用,里面一个定时器,interval 每一秒做出一个判断,因为以日常生活来说基本的单位是秒  在一秒内,如果currentTime>duration 就重置,否则 更新currentTime 播放条
        //在装歌词的P里面选中对应min 和sec的歌词句,用filter 去选 选中之后添加cur类名,高亮 歌词向上移动,但是 是当行数>3的时候 移动的距离是 因为是决定定位,所以改变的是top,所以每次的移动都是相对于整体来说
        //所以直接计算,现在的行数-3 *行高 +rem
        /*JQ只能获得已经存在的元素,所以绑定了数据之后才能获取p*/
        var $ps = $Jmain.find('p');
        var timer = window.setInterval(function () {
            if(audio.currentTime>=audio.duration){
                window.clearInterval(timer);
                $span.css('background-position','0.160rem -2.94rem');
                return;
            }
            $JcurTime.html(formateTime(audio.currentTime));
            var percent = (audio.currentTime/audio.duration)*100 +'%';
            $barspan.css({
                width:percent
            });
            var min = $JcurTime.html().split(':')[0];
            var sec = $JcurTime.html().split(':')[1];
            var $curP =$ps.filter('[min="'+min+'"][sec="'+sec+'"]'); //这个不是ES6的filter 是JQ的filter 这个参数是选择器 这个[] 是指定给定属性,行内属性,所以指定行内属性是这个的
            $curP.addClass('cur').siblings().removeClass('cur');
            var $index = $curP.index()+1;
            if($index>=3){
                $move.css({
                    top:- ($index-3) *0.84 +'rem'
                });
            }

        },1000);

    }

    function formateTime(time) {
        var min = ('0'+Math.floor(time/60)).slice(-2);
        var sec = ('0'+Math.floor(time-min*60)).slice(-2);
        return min+':'+sec;
    }

    window.init = function () {

        getData();
        bindDatas();
        play();
        progress();
        audio.play();
        $span.css('background-position','-3.17rem 0');
        $right.on('click',play);
        $like.on('click',function () {
            if($like.onf){
                $like.css('background-position','0 -1.9rem');
                $like.onf = false;
            }else{
                $like.css('background-position','-0.6rem -1.9rem');
                $like.onf = true;
            }
        });
    }
    /*接口*/
    window.QQMUSIC = QQMUSIC;
})();
init();