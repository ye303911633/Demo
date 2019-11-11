function animate(demo, json,fn) {
  // 用缓动的方式向目标位置移动，步长先大后小， 让两者之间的距离不断的进行一个固定的等分
  clearInterval(demo.timeId)  // 变量和对象的属性用途是一样的，都是用来存储数据的
  demo.timeId = setInterval(function () {
    var flag = true  // 默认是true
    for (var key in json) {
      if(key=='opacity'){
        // 因为opacity是小数，不太好计算,最好的方式可以先将他们都扩大100倍
        var leader = parseInt(getStyle(demo, key)*100) || 0  // 获得元素当前的属性值  top  left  width  height 都可以
        var target = json[key]*100   // 获取目标值，也要扩大100倍
//          var step = Math.ceil((target-leader)/10)
        step = (target - leader) / 10
        step = step > 0 ? Math.ceil(step) : Math.floor(step)
        leader = leader + step   // 在当前的位置上去加一个步长
//          demo.style.left= leader + 'px'  // 将新值重新设置到元素上
        demo.style[key] = leader/100 // 将新值重新设置到元素上
      }else if(key =='zIndex') {
        var leader = parseInt(getStyle(demo, key)) || 0  // 获得元素当前的属性值  top  left  width  height 都可以
        var target = json[key]   // 获取目标值  target一定不能省略
        demo.style[key] = target   // 将新值重新设置到元素上
      }else {  // width  height  left  top
        var leader = parseInt(getStyle(demo, key)) || 0  // 获得元素当前的属性值  top  left  width  height 都可以
        var target = json[key]   // 获取目标值
//          var step = Math.ceil((target-leader)/10)
        step = (target - leader) / 10
        step = step > 0 ? Math.ceil(step) : Math.floor(step)
        leader = leader + step   // 在当前的位置上去加一个步长
//          demo.style.left= leader + 'px'  // 将新值重新设置到元素上
        demo.style[key] = leader + 'px'  // 将新值重新设置到元素上
      }

      console.log(leader);
      if (leader != target) {  //  判断是否到达了目标位置
        // 只要有一个属性没有到达目标位置，leader != target这个表达式就会成立,flag的值就是false
        // 如果所有的属性都到达了目标位置，leader != target这个表达式就不会成立,这里面的代码不会执行,则flag为true
        flag = false
      }
    }
    // 如果当前的值和目标值相等了,说明已经到达了目标位置,需要清除定时器
    if (flag) {
      // 根据flag来判断是否清除定时器
      clearInterval(demo.timeId)  //清掉定时器，意味着所有的属性都到达了目标位置
      if(typeof  fn =='function'){
        fn()
      }
    }
  }, 15)
}

/**
 * 封装了一个获取元素指定属性的函数
 * @param obj
 * @param attr
 * @returns {*}
 */
function getStyle(obj, attr) {
  // 能力检测：就是要看当前的浏览器是否支持此对象的属性或方法
  if (obj.currentStyle) {
    return obj.currentStyle[attr]
  } else {  // 谷歌 或是火狐 支持的方式
    return window.getComputedStyle(obj, false)[attr]
  }
}