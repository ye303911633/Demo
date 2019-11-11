/**
 * Created by Administrator on 2018/3/28.
 */
window.onload = function () {
  var config = [   // 这个配置单，也就是这个数组是用来设置或是控制每一个li标签的
    {
      "width": 400,
      "top": 20,
      "left": 50,
      "opacity": 0.2,
      "zIndex": 2
    },//0
    {
      "width": 600,
      "top": 70,
      "left": 0,
      "opacity": 0.8,
      "zIndex": 3
    },//1
    {
      "width": 800,
      "top": 120,
      "left": 200,
      "opacity": 1,
      "zIndex": 4
    },//2
    {
      "width": 600,
      "top": 70,
      "left": 600,
      "opacity": 0.8,
      "zIndex": 3
    },//3
    {
      "width": 400,
      "top": 20,
      "left": 750,
      "opacity": 0.2,
      "zIndex": 2
    }//4
  ];//

  // 1.获得要操作的对象
  var wrap = document.getElementById("wrap");
  var slide = document.getElementById("slide");
  var ul = slide.children[0]
  var lis = ul.children
  var arrow = document.getElementById("arrow");
  var arrLeft = document.getElementById("arrLeft");
  var arrRight = document.getElementById("arrRight");
  var flag = true
  // 2.给每一个li标签设置对应的样式
  assign()  //一打开页面的时候，需要先调用一下


  function assign(){
    for(var i=0;i<config.length;i++){
      animate(lis[i],config[i],function(){
        flag = true  // 将flag的值重新设置为true，如果要执行了这行代码，意味着每一个属性都到达了目标位置，也就是说运动结束了
      })
    }
  }

  // 3.鼠标移入 要显示左右按钮
  wrap.onmouseover = function (){
    animate(arrow,{
      opacity:1
    })
  }

  // 4.鼠标离开的时候，要隐藏左右按钮
  wrap.onmouseout = function (){
    animate(arrow,{
      opacity:0
    })
  }
  
  // 5.给右侧按钮注册事件
  arrRight.onclick = function (){
    // var res = config.shift()  // 剪切数组中的第一项，存在一个res变量当中
    // config.push(res)
    if(flag){
      flag = false
      config.push(config.shift())   // 剪切数组中的第一项，追加到数组的最后面
      // 数组中的元素个数不会发生变化 ，但是顺序发生了变化
      // 让每一个li都有一个最新的样式
      assign()  //需要重新让每一个li标签拥有数组中最新的样式
    }
  }

  // 6.给左侧按钮注册事件
  arrLeft.onclick = function (){
    // 剪切数组中的最后一个，追加到数组的最前面
    // var res = config.pop()
    // config.unshift(res)

    if(flag){   // 节流阀
      flag = false
      config.unshift(config.pop())
      assign()
    }

  }


    // animate(lis[0],config[0])
    // animate(lis[1],config[1])
    // animate(lis[2],config[2])
    // animate(lis[3],config[3])
    // animate(lis[4],config[4])
}