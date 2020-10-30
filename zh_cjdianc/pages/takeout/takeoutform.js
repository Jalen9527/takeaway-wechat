var qqmapsdk, app = getApp(), util = require("../../utils/util.js"), QQMapWX = require("../../utils/qqmap-wx-jssdk.js");

Page({
    data: {
        share_modal_active: !1,
        activeradio: "",
        hbshare_modal_active: !1,
        hbactiveradio: "",
        sjshare_modal_active: !1,
        sjindex: 0,
        radioItems: [],
        timearr: [],
        isloading: !0,
        navbar: [],
        fwxy: !0,
        xymc: "到店自取服务协议",
        xynr: "",
        selectedindex: 0,
        color: "#019fff",
        checked: !0,
        cart_list: [],
        wmindex: 0,
        wmtimearray: [ "尽快送达" ],
        cjindex: 0,
        cjarray: [ "1份", "2份", "3份", "4份", "5份", "6份", "7份", "8份", "9份", "10份", "10份以上" ],
        mdoaltoggle: !0,
        total: 0,
        showModal: !1,
        zffs: 1,
        zfz: !1,
        zfwz: "微信支付",
        btntype: "btn_ok1",
        yhqkdje: 0,
        hbkdje: 0
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
    hbshowcart: function() {
        this.setData({
            hbshare_modal_active: !this.data.hbshare_modal_active
        });
    },
    hbclosecart: function() {
        this.setData({
            hbshare_modal_active: !1
        });
    },
    sjshowcart: function() {
        this.setData({
            sjshare_modal_active: !this.data.sjshare_modal_active
        });
    },
    sjclosecart: function() {
        this.setData({
            sjshare_modal_active: !1
        });
    },
    sjradioChange: function(t) {
        for (var a = this.data.radioItems, e = 0, s = a.length; e < s; ++e) a[e].checked = a[e].id == t.detail.value, 
        a[e].id == t.detail.value && this.setData({
            xztime: this.data.timearr[this.data.sjindex].time + " " + a[e].time
        });
        this.setData({
            radioItems: a,
            sjshare_modal_active: !1
        });
    },
    selectedime: function(t) {
        this.setData({
            sjindex: t.currentTarget.dataset.index,
            radioItems: this.data.timearr[t.currentTarget.dataset.index].ej
        });
    },
    openxy: function() {
        this.setData({
            fwxy: !1
        });
    },
    queren: function() {
        this.setData({
            fwxy: !0
        });
    },
    bindPickerChange: function(t) {
        this.setData({
            wmindex: t.detail.value
        });
    },
    bindcjPickerChange: function(t) {
        this.setData({
            cjindex: t.detail.value
        });
    },
    selectednavbar: function(t) {
        this.setData({
            selectedindex: t.currentTarget.dataset.index
        });
        var a = this.data.psfbf;
        1 == t.currentTarget.dataset.index ? this.setData({
            psf: 0
        }) : this.setData({
            psf: a
        }), this.gettotalprice();
    },
    checkboxChange: function(t) {
        this.setData({
            checked: !this.data.checked
        });
    },
    ckwz: function(t) {
        var a = t.currentTarget.dataset.jwd.split(",");
        wx.openLocation({
            latitude: Number(a[0]),
            longitude: Number(a[1]),
            name: this.data.store.name,
            address: this.data.store.address
        });
    },
    radioChange1: function(t) {
        "wxzf" == t.detail.value && this.setData({
            zffs: 1,
            zfwz: "微信支付",
            btntype: "btn_ok1"
        }), "yezf" == t.detail.value && this.setData({
            zffs: 2,
            zfwz: "余额支付",
            btntype: "btn_ok2"
        }), "jfzf" == t.detail.value && this.setData({
            zffs: 3,
            zfwz: "积分支付",
            btntype: "btn_ok3"
        }), "hdfk" == t.detail.value && this.setData({
            zffs: 4,
            zfwz: "货到付款",
            btntype: "btn_ok4"
        });
    },
    distance: function(t, a, e) {
        var s;
        qqmapsdk.calculateDistance({
            mode: "driving",
            from: {
                latitude: t.lat,
                longitude: t.lng
            },
            to: [ {
                latitude: a.lat,
                longitude: a.lng
            } ],
            success: function(t) {
                0 == t.status && (s = Math.round(t.result.elements[0].distance), e(s));
            },
            fail: function(t) {
                373 == t.status && (s = 15e3, e(s));
            },
            complete: function(t) {}
        });
    },
    KeyName: function(t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function(t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    tjddformSubmit: function(n) {
        var u = this;
        app.util.requestSM("order").then(function(t) {
            u.setData({
                form_id2: n.detail.formId
            });
            var a = u, e = u.data.address, s = u.data.selectedindex, i = u.data.storeset;
            if (0 == s && null == e && "1" == i.is_ps) return wx.showModal({
                title: "提示",
                content: "请选择收货地址"
            }), !1;
            if (0 != s || u.data.dzisnormall || "1" != i.is_ps) {
                if (0 == s && u.data.dzisnormall && "1" == i.is_ps) u.setData({
                    showModal: !0
                }); else if (1 == s || 0 == s && "2" == i.is_ps) {
                    var d = a.data.name, r = u.data.mobile, o = u.data.checked;
                    if ("" == d || "" == r || null == d || null == r) return wx.showModal({
                        title: "提示",
                        content: "到店自提必须填写收货人和联系电话！"
                    }), !1;
                    if (!o) return wx.showModal({
                        title: "提示",
                        content: "请阅读并同意《到店自取服务协议》"
                    }), !1;
                    u.setData({
                        showModal: !0
                    });
                }
            } else wx.showModal({
                title: "提示",
                content: "当前选择的收货地址超出商家配送距离,请选择其他地址",
                showCancel: !1,
                success: function(t) {
                    wx.navigateTo({
                        url: "../wddz/xzdz"
                    });
                }
            });
        });
    },
    yczz: function() {
        this.setData({
            showModal: !1
        });
    },
    mdoalclose: function() {
        this.setData({
            mdoaltoggle: !0
        });
    },
    bindDateChange: function(t) {
        this.setData({
            date: t.detail.value
        }), t.detail.value == this.data.datestart ? this.setData({
            timestart: util.formatTime(new Date()).substring(11, 16)
        }) : this.setData({
            timestart: "00:01"
        });
    },
    bindTimeChange: function(t) {
        this.setData({
            time: t.detail.value
        });
    },
    radioChange: function(t) {
        this.setData({
            radioChange: t.detail.value
        });
    },
    hbradioChange: function(t) {
        this.setData({
            hbradioChange: t.detail.value
        });
    },
    xzq: function(t) {
        if (Number(t.currentTarget.dataset.full) > this.data.gwcinfo.money) return wx.showModal({
            title: "提示",
            content: "您的消费金额不满足此优惠券条件"
        }), !1;
        "1" == this.data.CouponSet.yhq_set ? this.setData({
            share_modal_active: !1,
            activeradio: t.currentTarget.dataset.rdid,
            yhqkdje: t.currentTarget.dataset.kdje
        }) : this.setData({
            share_modal_active: !1,
            activeradio: t.currentTarget.dataset.rdid,
            yhqkdje: t.currentTarget.dataset.kdje,
            hbactiveradio: "",
            hbkdje: 0
        }), this.gettotalprice();
    },
    xzhb: function(t) {
        if (Number(t.currentTarget.dataset.full) > this.data.gwcinfo.money) return wx.showModal({
            title: "提示",
            content: "您的消费金额不满足此红包条件"
        }), !1;
        "1" == this.data.CouponSet.yhq_set ? this.setData({
            hbshare_modal_active: !1,
            hbactiveradio: t.currentTarget.dataset.rdid,
            hbkdje: t.currentTarget.dataset.kdje
        }) : (wx.showModal({
            title: "提示",
            content: "优惠券与红包不可同时享用"
        }), this.setData({
            hbshare_modal_active: !1,
            hbactiveradio: t.currentTarget.dataset.rdid,
            hbkdje: t.currentTarget.dataset.kdje,
            activeradio: "",
            yhqkdje: 0
        })), this.gettotalprice();
    },
    onLoad: function(t) {
        app.setNavigationBarColor(this);
        util.formatTime(new Date());
        for (var a = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-"), e = util.formatTime(new Date()).substring(11, 16), s = new Date(), i = s.getTime(), d = 2 * (24 - new Date(i).getHours()), r = [ "尽快送达" ], o = 1; o < d; o++) {
            i = s.getTime() + 18e5 * o;
            var n = new Date(i).getMinutes();
            n < 10 && (n = "0" + n);
            var u = new Date(i).getHours() + ":" + n;
            r.push(u);
        }
        this.setData({
            datestart: a,
            timestart: e,
            date: a,
            time: e,
            wmtimearray: r
        });
        var c = this, l = t.storeid, h = wx.getStorageSync("users").id;
        wx.removeStorageSync("note"), app.util.request({
            url: "entry/wxapp/GetStoreService",
            cachetime: "0",
            data: {
                store_id: l
            },
            success: function(t) {
                t.data && 0 < t.data.length && (t.data[0].ej[0].checked = !0, c.setData({
                    timearr: t.data,
                    radioItems: t.data[0].ej,
                    xztime: t.data[0].time + " " + t.data[0].ej[0].time
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/UserInfo",
            cachetime: "0",
            data: {
                user_id: h
            },
            success: function(t) {
                var a = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-");
                "" != t.data.dq_time && t.data.dq_time >= a.toString() && (t.data.ishy = 1), c.setData({
                    userInfo: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/MyCoupons",
            cachetime: "0",
            data: {
                store_id: l,
                user_id: h
            },
            success: function(t) {
                for (var a = [], e = [], s = 0; s < t.data.length; s++) "2" != t.data[s].coupon_type && "1" == t.data[s].type && a.push(t.data[s]), 
                "2" != t.data[s].coupon_type && "2" == t.data[s].type && e.push(t.data[s]);
                c.setData({
                    Coupons: a,
                    hbarr: e
                });
            }
        }), app.util.request({
            url: "entry/wxapp/CouponSet",
            cachetime: "0",
            success: function(t) {
                c.setData({
                    CouponSet: t.data
                });
            }
        }), qqmapsdk = new QQMapWX({
            key: getApp().xtxx.map_key
        }), c.setData({
            xtxx: getApp().xtxx
        }), app.util.request({
            url: "entry/wxapp/StoreInfo",
            cachetime: "0",
            data: {
                store_id: l,
                type: 2
            },
            success: function(t) {
                t.data.storeset.wmps_name = "" != t.data.storeset.wmps_name ? t.data.storeset.wmps_name : "外卖配送";
                var e = t.data, a = t.data.store.coordinates.split(","), s = {
                    lng: Number(a[1]),
                    lat: Number(a[0])
                };
                "1" == e.storeset.is_ps && "1" == e.storeset.is_zt && c.setData({
                    navbar: [ e.storeset.wmps_name, "到店自取" ]
                }), "2" == e.storeset.is_zt && c.setData({
                    navbar: [ e.storeset.wmps_name ]
                }), "2" == e.storeset.is_ps && c.setData({
                    navbar: [ "到店自取" ]
                }), "1" != e.storeset.is_hdfk && "3" != e.storeset.is_hdfk || c.setData({
                    hdfk: !0
                }), "1" == getApp().xtxx.is_yuepay && "1" == e.storeset.is_yuepay && c.setData({
                    kqyue: !0
                }), c.setData({
                    psfarr: t.data.psf,
                    reduction: t.data.reduction,
                    store: t.data.store,
                    storeset: t.data.storeset,
                    sjstart: s,
                    xynr: t.data.storeset.ztxy
                }), app.util.request({
                    url: "entry/wxapp/MyCar",
                    cachetime: "0",
                    data: {
                        store_id: l,
                        user_id: h
                    },
                    success: function(t) {
                        app.util.request({
                            url: "entry/wxapp/IsNew",
                            data: {
                                store_id: l,
                                user_id: h
                            },
                            cachetime: "0",
                            success: function(t) {
                                "1" == e.storeset.xyh_open && 1 == t.data ? c.setData({
                                    xyhmoney: e.storeset.xyh_money,
                                    isnewuser: "1"
                                }) : c.setData({
                                    xyhmoney: 0,
                                    isnewuser: "2"
                                }), c.countMj(), c.countpsf();
                            }
                        });
                        for (var a = 0; a < t.data.res.length; a++) if ("1" == t.data.res[a].is_qg) {
                            c.setData({
                                haveQg: !0
                            });
                            break;
                        }
                        c.setData({
                            cart_list: t.data.res,
                            gwcinfo: t.data,
                            gwcprice: t.data.money
                        });
                    }
                });
            }
        });
    },
    gettotalprice: function() {
        var t = this.data.gwcprice, a = (this.data.gwcinfo.box_money, this.data.psf), e = this.data.mjmoney, s = this.data.xyhmoney, i = this.data.yhqkdje, d = this.data.hbkdje;
        var r = (Number(e) + Number(s) + 0 + Number(i) + Number(d)).toFixed(2);
        this.data.haveQg && (r = 0), (1 == this.data.userInfo.ishy && "1" == getApp().xtxx.is_vip_delivery || "0" != this.data.storeset.full_delivery && Number(t) - r >= Number(this.data.storeset.full_delivery || 1e5)) && (a = 0, 
        this.setData({
            psf: 0,
            mpsf: !0
        }));
        var o = (Number(t) + Number(a) - r).toFixed(2);
        o < 0 && (o = 0), this.setData({
            totalyh: r,
            totalPrice: o,
            zkmoney: 0,
            isloading: !1
        });
    },
    jsmj: function(t, a) {
        for (var e, s = 0; s < a.length; s++) if (Number(t) >= Number(a[s].full)) {
            e = s;
            break;
        }
        return e;
    },
    countMj: function() {
        var t = this.data.gwcprice, a = this.data.reduction.reverse(), e = this.jsmj(t, a), s = this.data.isnewuser, i = 0;
        0 < a.length && null != e && "2" == s && (i = a[e].reduction), this.setData({
            reduction: a,
            mjindex: e,
            mjmoney: i
        });
    },
    countpsf: function() {
        var s = this, t = wx.getStorageSync("users").id, e = s.data.sjstart, i = 1e3 * Number(this.data.storeset.ps_jl), d = this.data.psfarr;
        app.util.request({
            url: "entry/wxapp/MyDefaultAddress",
            cachetime: "0",
            data: {
                user_id: t
            },
            success: function(t) {
                if (t.data && "1" == s.data.storeset.is_ps) {
                    var a = {
                        lng: t.data.lng,
                        lat: t.data.lat
                    };
                    s.setData({
                        address: t.data,
                        mobile: t.data.tel,
                        name: t.data.user_name
                    }), s.distance(e, a, function(t) {
                        i < t ? (s.setData({
                            dzisnormall: !1
                        }), wx.showModal({
                            title: "提示",
                            content: "当前选择的收货地址超出商家配送距离,请选择其他地址",
                            success: function(t) {
                                t.confirm ? wx.navigateTo({
                                    url: "../wddz/xzdz"
                                }) : t.cancel;
                            }
                        })) : s.setData({
                            dzisnormall: !0
                        });
                        for (var a = (t / 1e3).toFixed(2), e = d.length - 1; 0 <= e; e--) if (Number(a) >= Number(d[e].end) || Number(a) >= Number(d[e].start) && Number(a) < Number(d[e].end)) {
                            s.setData({
                                psf: d[e].money,
                                psfbf: d[e].money
                            }), s.gettotalprice();
                            break;
                        }
                    });
                } else t.data || "1" != s.data.storeset.is_ps ? s.setData({
                    psf: 0,
                    psfbf: 0
                }) : s.setData({
                    psf: d[0].money,
                    psfbf: d[0].money
                }), s.gettotalprice();
            }
        });
    },
    formSubmit: function(e) {
        var s = [];
        this.data.cart_list.map(function(t) {
            if (0 < t.num) {
                var a = {};
                a.name = "1" == t.is_qg ? t.qg_name : t.name, a.img = "1" == t.is_qg ? t.qg_logo : t.logo, 
                a.num = t.num, a.money = t.money, a.dishes_id = t.good_id, a.spec = t.spec, a.is_qg = t.is_qg, 
                s.push(a);
            }
        });
        var t, i = this, d = this.data.storeset, a = this.data.haveQg, r = getApp().getOpenId, o = e.detail.formId, n = this.data.form_id2, u = wx.getStorageSync("users").id, c = this.data.store.id, l = this.data.totalPrice, h = a ? 0 : this.data.totalyh, m = this.data.gwcinfo.box_money, f = this.data.psf, p = a ? 0 : this.data.mjmoney, g = a ? 0 : this.data.xyhmoney, y = this.data.note, w = this.data.cjarray[this.data.cjindex], _ = a ? 0 : this.data.yhqkdje, x = this.data.activeradio, v = this.data.hbactiveradio, b = a ? 0 : this.data.hbkdje, D = this.data.zkmoney;
        if ("hdfk" == e.detail.value.radiogroup && "3" == d.is_hdfk && Number(f) <= 0) wx.showModal({
            title: "提示",
            content: "货到付款，配送费不能为0，请选择其他付款方式"
        }); else {
            var k = parseInt(this.data.selectedindex) + 1;
            if ("2" == i.data.storeset.is_ps && (k = 2), t = 2 == k ? 0 < this.data.timearr.length ? this.data.xztime : this.data.date + " " + this.data.time : 0 < this.data.timearr.length ? this.data.xztime : this.data.wmtimearray[this.data.wmindex], 
            null != this.data.address) var j = this.data.address.area.replace(/,/g, "") + this.data.address.address, z = this.data.address.user_name, q = this.data.address.tel, T = this.data.address.sex, S = this.data.address.area, M = this.data.address.lat, N = this.data.address.lng; else j = "", 
            z = "", q = "", T = "0", S = "", M = "", N = "";
            if (2 == k && (z = i.data.name, q = this.data.mobile, "" == z || "" == q)) return wx.showModal({
                title: "提示",
                content: "到店自提必须填写收货人和联系电话！"
            }), !1;
            if ("yezf" == e.detail.value.radiogroup) if (Number(this.data.userInfo.wallet) < Number(l)) return void wx.showToast({
                title: "余额不足支付",
                icon: "loading"
            });
            if ("yezf" == e.detail.value.radiogroup) var C = 2;
            if ("wxzf" == e.detail.value.radiogroup) C = 1;
            if ("jfzf" == e.detail.value.radiogroup) C = 3;
            if ("hdfk" == e.detail.value.radiogroup) C = 4;
            "" == o ? wx.showToast({
                title: "没有获取到formid",
                icon: "loading",
                duration: 1e3
            }) : (this.setData({
                zfz: !0
            }), app.util.request({
                url: "entry/wxapp/AddOrder",
                cachetime: "0",
                method: "POST",
                data: {
                    user_id: u,
                    store_id: c,
                    money: l,
                    discount: h,
                    box_money: m,
                    ps_money: f,
                    mj_money: p,
                    xyh_money: g,
                    tel: q,
                    name: z,
                    address: j,
                    note: y,
                    type: 1,
                    area: S,
                    lat: M,
                    lng: N,
                    form_id: o,
                    form_id2: n,
                    delivery_time: t,
                    order_type: k,
                    pay_type: C,
                    sz: JSON.stringify(s),
                    tableware: w,
                    sex: T,
                    yhq_money: _,
                    yhq_money2: b,
                    coupon_id: x,
                    coupon_id2: v,
                    zk_money: D
                },
                success: function(t) {
                    var a = t.data;
                    i.setData({
                        zfz: !1,
                        showModal: !1
                    }), "yezf" == e.detail.value.radiogroup && ("下单失败" != a ? (i.setData({
                        mdoaltoggle: !1
                    }), setTimeout(function() {
                        wx.reLaunch({
                            url: "../wddd/order?status=2"
                        });
                    }, 1e3)) : wx.showToast({
                        title: "支付失败",
                        icon: "loading"
                    })), "hdfk" == e.detail.value.radiogroup && "1" == d.is_hdfk && ("下单失败" != a ? (i.setData({
                        mdoaltoggle: !1
                    }), setTimeout(function() {
                        wx.reLaunch({
                            url: "../wddd/order?status=2"
                        });
                    }, 1e3)) : wx.showToast({
                        title: "支付失败",
                        icon: "loading"
                    })), "hdfk" == e.detail.value.radiogroup && "3" == d.is_hdfk && ("下单失败" != a ? app.util.request({
                        url: "entry/wxapp/pay",
                        cachetime: "0",
                        data: {
                            openid: r,
                            money: f,
                            order_id: a
                        },
                        success: function(t) {
                            wx.requestPayment({
                                timeStamp: t.data.timeStamp,
                                nonceStr: t.data.nonceStr,
                                package: t.data.package,
                                signType: t.data.signType,
                                paySign: t.data.paySign,
                                success: function(t) {},
                                complete: function(t) {
                                    "requestPayment:fail cancel" == t.errMsg && (wx.showToast({
                                        title: "取消支付",
                                        icon: "loading",
                                        duration: 1e3
                                    }), setTimeout(function() {
                                        wx.reLaunch({
                                            url: "../wddd/order"
                                        });
                                    }, 1e3)), "requestPayment:ok" == t.errMsg && (i.setData({
                                        mdoaltoggle: !1
                                    }), setTimeout(function() {
                                        wx.reLaunch({
                                            url: "../wddd/order?status=2"
                                        });
                                    }, 1e3));
                                }
                            });
                        }
                    }) : wx.showToast({
                        title: "支付失败",
                        icon: "loading"
                    })), "wxzf" == e.detail.value.radiogroup && (0 == l ? (wx.showModal({
                        title: "提示",
                        content: "0元买单请选择其他方式支付"
                    }), i.setData({
                        zfz: !1
                    })) : "下单失败" != a && app.util.request({
                        url: "entry/wxapp/pay",
                        cachetime: "0",
                        data: {
                            openid: r,
                            money: l,
                            order_id: a
                        },
                        success: function(t) {
                            wx.requestPayment({
                                timeStamp: t.data.timeStamp,
                                nonceStr: t.data.nonceStr,
                                package: t.data.package,
                                signType: t.data.signType,
                                paySign: t.data.paySign,
                                success: function(t) {},
                                complete: function(t) {
                                    "requestPayment:fail cancel" == t.errMsg && (wx.showToast({
                                        title: "取消支付",
                                        icon: "loading",
                                        duration: 1e3
                                    }), setTimeout(function() {
                                        wx.reLaunch({
                                            url: "../wddd/order"
                                        });
                                    }, 1e3)), "requestPayment:ok" == t.errMsg && (i.setData({
                                        mdoaltoggle: !1
                                    }), setTimeout(function() {
                                        wx.reLaunch({
                                            url: "../wddd/order?status=2"
                                        });
                                    }, 1e3));
                                }
                            });
                        }
                    }));
                }
            }));
        }
    },
    onReady: function() {},
    onShow: function() {
        var t = wx.getStorageSync("note");
        this.setData({
            note: t
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});