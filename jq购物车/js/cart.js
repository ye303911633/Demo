$(function(){
    //取出本地数据
    let arr = kits.localGet('dataBox')
    console.log(arr);
    let html = '';

    arr.forEach(e => {
        html += `<div class="item" data-id="${e.pID}">
                <div class="row">
                <div class="cell col-1 row">
                    <div class="cell col-1">
                    <input type="checkbox" class="item-ck" ${e.isChecked ? "checked" : ''}>
                    </div>
                    <div class="cell col-4">
                    <img src="${e.imgSrc}" alt="">
                    </div>
                </div>
                <div class="cell col-4 row">
                    <div class="item-name">${e.name}</div>
                </div>
                <div class="cell col-1 tc lh70">
                    <span>￥</span>
                    <em class="price">${e.price}</em>
                </div>
                <div class="cell col-1 tc lh70">
                    <div class="item-count">
                    <a href="javascript:void(0);" class="reduce fl ">-</a>
                    <input autocomplete="off" type="text" class="number fl" value="${e.num}">
                    <a href="javascript:void(0);" class="add fl">+</a>
                    </div>
                </div>
                <div class="cell col-1 tc lh70">
                    <span>￥</span>
                    <em class="computed">${e.num * e.price}</em>
                </div>
                <div class="cell col-1">
                    <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
                </div>
                </div>
                </div>`;
    });

    $('.item-list').append(html);

    if(arr.length != 0){
        $('.empty-tip').hide()
        $('.cart-header').show()
        $('.total-of').show()
    }

    //全选
    $('.pick-all').on('click', function(){
        let status = $(this).prop('checked')    //获取点击的pick-all的checked的状态
        $('.item-ck').prop('checked', status)   
        $('.pick-all').prop('checked', status)

        arr.forEach(e=>{                    //遍历本地arr,并把当前的转态添加到arr里面
            e.isChecked = status;
        })

        kits.localSet('dataBox', arr)       //保存到本地
        calcTotal()                         //重新渲染件数和价格
    })

    //点选
    $('.item').on('click', '.item-ck', function(){
       let ckall = $('.item-ck').length == $('.item-ck:checked').length 
       $('.pick-all').prop('checked', ckall)

       let pID = $(this).parents('.item').attr('data-id')
       let isChecked = $(this).prop('checked')

       arr.forEach(e=>{
           if( e.pID == pID) e.isChecked = isChecked;
       })

       kits.localSet('dataBox', arr)    //把修改后的数据存储到本地
       calcTotal()                      //  重新渲染件数和价格
    })

    // 判断arr里面的isChecked是否为false
    let noCkAll = arr.find(e=>{
        return !e.isChecked
    })
    // 只要有一个isChecked为false,则pick-all的checked取值为 !noCkAll
    $('.pick-all').prop('checked', !noCkAll);


    // 点击添加件数
    $('.item-list').on('click', '.add',function () {
        let prev = $(this).prev();
        let current = prev.val();
        prev.val(++current)

        let id = $(this).parents('.item').attr('data-id')   //获取当前点击的父元素中的data-id

        arr.forEach(e=>{
            if( e.pID == id){           // 相等则进行内容修改
                e.num = current;        //当前的件数 修改到本地arr里面
                $(this).parents('.item').find('.computed').text(e.num * e.price)    //对computed的金额进行计算
            }
        })

        kits.localSet('dataBox', arr)   //把修改后的数据 保存到本地
        calcTotal()                     //重新渲染件数和价格
    })
    

    //点击减少件数
    $('.item-list').on('click', '.reduce',function () {
        let next = $(this).next();
        let current = next.val();
        if(current<=1){
            alert('最少选1件商品')
            return;
        }
        next.val(--current)

        let id = $(this).parents('.item').attr('data-id')

        arr.forEach(e=>{
            if( e.pID == id){
                e.num = current; 
                $(this).parents('.item').find('.computed').text(e.num * e.price)
            }
        })
        kits.localSet('dataBox', arr)   //把修改后的数据 保存到本地
        calcTotal()                     //重新渲染件数和价格
    })


    //获取焦点 -- 把原来的值 先存入到自定义属性data-old里面
    $('.item-list').on('focus', '.number',function () {
        let cos = $(this).val() 
        let obj = $(this).attr('data-old', cos)
    })


    //失去焦点 -- 获取商品的件数
    $('.item-list').on('blur', '.number',function () {
        let cont = $(this).val()
        if( isNaN(cont) || parseInt(cont) < 1 || cont.trim().length == 0){
            let old = $(this).attr('data-old')
            $(this).val(old)
            alert('请正确输入数字')
            return;
        }
        cont = parseInt(cont)

        let id = $(this).parents('.item').attr('data-id')
        arr.forEach(e=>{
            if( e.pID == id){
                e.num = cont; 
                $(this).parents('.item').find('.computed').text(e.num * e.price)
            }
        })
        kits.localSet('dataBox', arr)   //把修改后的数据 保存到本地
        calcTotal()                     //重新渲染件数和价格
    })


    //删除对应的商品
    $('.item-list').on('click', '.item-del',function () {
        let id = $(this).parents('.item').attr('data-id')
        let _this = $(this)
        layer.confirm('删除后不可恢复,确定吗?', {icon: 0, title:'提示'}, function(index){
            layer.close(index);
            let id = _this.parents('.item').attr('data-id')
            
            _this.parents('.item').remove()
            
            arr = arr.filter(e=>{
                return e.pID != id
            })    
            
            kits.localSet('dataBox',arr);
            calcTotal();
        });                

    })


    //封装 计算 总价格 总件数
    function calcTotal(){
        let totalCount = 0; //总件数
        let totalMoney = 0; //总金额

        arr.forEach(e=>{
            if( e.isChecked){
                totalCount += e.num;    //如果为勾选转态的，就把件数叠加
                totalMoney += e.num * e.price;  //总金额 = 件数 * 单件金额
            }
        })

        $('.selected').text(totalCount); //把总件数 渲染到页面上
        $('.total-money').text(totalMoney); //把金额 渲染到页面上
    }
    calcTotal()                         //重新渲染件数和价格
})