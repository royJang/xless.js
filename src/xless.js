/**
 * Created by roy on 15/5/17.
 */

var xless = (function (window, document, undefined) {

    var version = "0.0.1",
        xless = {},
        myElemenet = "xless",
        x = document.createElement(myElemenet),
        xStyle = x.style,
        keys = ["webkit", "", "moz", "ms", "o"],
        kl = keys.length,
        isSupportClassList = xStyle.classList == undefined;

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
                return o ? (function (){
                    //执行默认事件
                    f.use(el);
                    //持续时间不为infinite的话，则在持续时间结束后，移除class
                    return f.duration !== "infinite" && setTimeout(function (){
                        ctrl.remove( el, f.name );
                    }, f.duration || 1000);
                })() : f.fallback(el);
            }
        }
    };

    xless.extend = extend;

    return xless;

})(window, document, undefined);
