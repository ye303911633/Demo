$(function () {
    // 1.先获取url地址中的id
    let id = location.search.substring(4)

    // 2.获取id和pID数据相等的对象
    let target = phoneData.find(e => {
        return e.pID == id;
    })

    //通过对应的地方做修改
    $('.sku-name').text(target.name);
    $('.summary-price em').text(target.price);
    $('.preview-img>img').attr('src', target.imgSrc);


    //点击加入购物车
    $('.addshopcar').on('click', function () {
        // 获取输入的数量
        let num = $('.choose-number').val();

        // 判断num是否合法
        if (num.trim().length === 0 || isNaN(num) || parseInt(num) <= 0) {
            alert('商品数量不正确，请正确输入');
            return;
        }

        //把当前的数据存到本地
        let arr = kits.localGet('dataBox')

        //把存到本地数据里 查找id和pID相匹配的数据
        let exist = arr.find(e=>{
            return e.pID == id;
        })

        // 把num转换成数字，而不是字符串
        num = parseInt(num)

        // 判断如果有相同数据，就在原来的num上相加，如果没有数据则创建一个obj对象，存储数据到本地
        if (exist) {
            exist.num += num
        } else {
            //定义一个对象，方便存到本地localStroge
            let obj = {
                pID: target.pID,
                imgSrc: target.imgSrc,
                name: target.name,
                price: target.price,
                num: num,
                isChecked: true
            }
            arr.push(obj)       //把obj添加到arr数组里面
        }
        kits.localSet('dataBox', arr)   //保存到本地
        location.href = './cart.html'   //跳转到对应的页面
    })
})