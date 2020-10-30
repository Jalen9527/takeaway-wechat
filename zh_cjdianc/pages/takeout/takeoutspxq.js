var app = getApp();

Page({
    data: {
        store_id: "1",
        start_at: "88",
        share_modal_active: !1,
        color: "#ff4544",
        spggtoggle: !0,
        gg: []
    },
    subText: function() {
        console.log(this.data);
        var t, a = parseFloat(this.data.cart_list.money), o = parseFloat(this.data.start_at);
        if (console.log(a, o), a <= 0) t = "￥" + this.data.start_at + "元起送"; else if (a < o) {
            var e = o - a;
            console.log(e), t = "还差" + e.toFixed(2) + "元起送";
        } else console.log(a), t = "去结算";
        this.setData({
            subtext: t
        });
    },
    onLoad: function(t) {
		console.log("输出获取过来的数据::" ,t);
        var e = this;
		var store_id = t.store_id;
        app.getUserInfo(function(t) {
			
			app.util.request({
			    url: "entry/wxapp/DishesType",
			    cachetime: "0",
			    data: {
			        store_id: store_id,
			        type: 2
			    },
			    success: function(t) {
					console.log("输出eeeeeee::" ,e);
					
			        var r = t.data;
					console.log("输出rrrrrrrrrr::" ,r);
			        app.util.request({
			            url: "entry/wxapp/Dishes",
			            cachetime: "0",
			            data: {
			                type_id: r[0].id,
			                type: 2
			            },
			            success: function(t) {
			                console.log(t.data);
			                for (var a = 0, e = t.data.length; a < e; a++) t.data[a].quantity = Number(t.data[a].quantity);
			                r[0].good = t.data, c.setData({
			                    cpjzz: !1
			                }), app.util.request({
			                    url: "entry/wxapp/MyCar",
			                    data: {
			                        store_id: n,
			                        user_id: o
			                    },
			                    success: function(t) {
			                        console.log(t);
			                        for (var a = t.data.res, e = 0, s = a.length; e < s; e++) for (var o = 0; o < r.length; o++) for (var i = 0; i < r[o].good.length; i++) a[e].good_id == r[o].good[i].id && (r[o].good[i].quantity = r[o].good[i].quantity + Number(a[e].num));
			                        console.log(r), c.setData({
			                            cart_list: t.data,
			                            dishes: r,
			                            isloading: !1
			                        }), c.subText();
			                    }
			                });
			            }
			        });
			    }
			});
			
			
            console.log(t);
            var a = wx.getStorageSync("users").id, o = e.data.store_id;
            app.util.request({
                url: "entry/wxapp/MyCar",
                cachetime: "0",
                data: {
                    store_id: o,
                    user_id: a
                },
                success: function(t) {
                    console.log(t);
                    t.data.res;
                    e.setData({
                        cart_list: t.data
                    }), e.subText();
                }
            });
        });
    },
    spggck: function() {
        this.setData({
            spggtoggle: !1
        });
    },
    gbspgg: function() {
        this.setData({
            spggtoggle: !0
        });
    },
    showcart: function() {
        this.setData({
            share_modal_active: !this.data.share_modal_active
        });
    },
    closecart: function() {
        this.setData({
            share_modal_active: !1
        });
    },
    clear: function() {
        var e = this, s = this.data.dishes, a = wx.getStorageSync("users").id, o = e.data.store_id;
        console.log(s, a, o), wx.showModal({
            title: "提示",
            content: "确定清空此商家的购物车吗？",
            success: function(t) {
                t.confirm ? (console.log("用户点击确定"), wx.showLoading({
                    title: "正在加载",
                    mask: !0
                }), app.util.request({
                    url: "entry/wxapp/DelCar",
                    cachetime: "0",
                    data: {
                        user_id: a,
                        store_id: o
                    },
                    success: function(t) {
                        if (console.log(t.data), "1" == t.data) {
                            for (var a = 0; a < s.length; a++) for (var o = 0; o < s[a].good.length; o++) s[a].good[o].quantity = 0;
                            e.setData({
                                dishes: s
                            }), e.gwcreload();
                        }
                    }
                })) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});