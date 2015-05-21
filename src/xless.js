/**
 * Created by roy on 15/5/17.
 */

(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());

var xless = (function (window, document, undefined) {

    var version = "0.0.1",
        xless = {},
        doc = document.body || document.documentElement,
        myElemenet = "xless",
        x = document.createElement(myElemenet),
        xStyle = x.style,
        keys = ["webkit", "", "moz", "ms", "o"],
        kl = keys.length,
        isSupportClassList = xStyle.classList == undefined,
        FPS = 60,
        Speed = 10;

    var animate = {
        start : function ( obj ){

            var _obj = obj,
                w = obj.offsetWidth,
                h = obj.offsetHeight;

            //从目标元素开始向外遍历，累加top和left值
            for (var t1 = obj.offsetTop, l1 = obj.offsetLeft; _obj = _obj.offsetParent;) {
                t1 += _obj.offsetTop;
                l1 += _obj.offsetLeft;
            }

            var m = obj.cloneNode();
            obj.style.visibility = "hidden";
            m.style.position = "absolute";
            m.style.left = l1 + 'px';
            m.style.top = t1 + 'px';
            doc.appendChild(m);

            this.m = m;

            timer = null;
            var self = this;
            this.to = function ( x, y ){
                self.l = x;
                self.t = y;
                self.update();
                return this.obj;
            };
            this.stop = function (){
                timer && window.cancelAnimationFrame(timer);
                this.to = null;
                this.stop = null;
                return;
            }
            return this;
        },
        update : function (){
            var self = this;
            if( this.m.offsetLeft <= this.l ){
                this.m.style.left = this.m.offsetLeft + Speed + 'px';
            }
            if( this.m.offsetTop <= this.t ){
                this.m.style.top = this.m.offsetTop + Speed + 'px';
            }
            if(this.m.offsetLeft <= this.l || this.m.offsetTop <= this.t ){
                window.requestAnimationFrame(function (){
                    self.update();
                });
            }
        }
    };

    xless.animate = animate;

    /*
     * 检测是否有此属性
     * @private
     * @param property - 需要检测的属性
     * @returns {Boolean}
     */
    var checkStyle = function (property) {
        var o = false;
        for (var i = 0, len = kl; i < len; i++) {
            var _property = keys[i] === "" ? property :
                property.indexOf("-") > -1 ? (property.charAt(0).toUpperCase() + property.slice(1).replace(/-([a-z])/g,function (n, a){
                    return a.toUpperCase();
                })) : (property.charAt(0).toUpperCase() + property.slice(1));

            if (xStyle[keys[i] + _property] !== undefined) {
                o = true;
                break;
            }
        }
        return o;
    };

    /*
    * 返回come,out,pause 方法
    * @public
    * @param el - 需要切换class的元素
    * @param _class - 切换的class名称
    * @returns {null}
    */
    var ctrl = {
        add : function ( el, _class ){
            if(el.classList.contains(_class)){
                el.classList.remove(_class);
            }
            el.classList.add( _class );
        },
        remove : function ( el, _class ){
            el.classList.remove(_class);
        }
    };

    if( !isSupportClassList ){
        ctrl = {
            add : function ( el, _class ){

            },
            remove : function (){

            }
        };
    }

    xless.classList = ctrl;

    /*
    * xless.js插件机制
    * @public
    * @param f - 一个object对象, 参数如下
    *
    *   f.name     - {String}      插件名称
    *   f.duration - {Number}      插件持续时间, 默认为 1000 毫秒
    *   f.support  - {Array}       插件css3需要的属性
    *   f.use      - {Function}    使用css3方法执行
    *   f.fallback - {Function}    当css3属性不支持使用js方法执行
    *
    * @returns {Function} 执行当前动画效果
    */
    var extend = function (f) {
        xless[f.name] = function ( el ) {
            if( !el ) return;
            var o = true;
            for(var i = 0,len = f.support.length; i<len; i++){
                if(!checkStyle(f.support[i])){
                   o = false;
                   break;
                }
            }
            return function (){
                return !o ? (function (){
                    //执行默认事件
                    f.use(el);
                    //持续时间不为infinite的话，则在持续时间结束后，移除class
                    return f.duration !== "infinite" && setTimeout(function (){
                        ctrl.remove( el, f.name );
                    }, f.duration || 1000);
                })() : f.fallback(el, xless.animate);
            }
        }
    };

    xless.extend = extend;

    function css(obj, attr, value){
        switch (arguments.length){
            case 2:
                if(typeof arguments[1] == "object"){
                    for (var i in attr) i == "opacity" ? (obj.style["filter"] = "alpha(opacity=" + attr[i] + ")", obj.style[i] = attr[i] / 100) : obj.style[i] = attr[i];
                }else{
                    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
                }
                break;
            case 3:
                attr == "opacity" ? (obj.style["filter"] = "alpha(opacity=" + value + ")", obj.style[attr] = value / 100) : obj.style[attr] = value;
                break;
        }
    };

    return xless;

})(window, document, undefined);
