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
        label : for (var i = 0, len = kl; i < len; i++) {
            var _property = keys[i] === "" ? property :
                property.indexOf("-") > -1 ? (property.charAt(0).toUpperCase() + property.slice(1).replace(/-([a-z])/g,function (n, a){
                    return a.toUpperCase();
                })) : (property.charAt(0).toUpperCase() + property.slice(1));

            if (xStyle[keys[i] + _property] !== undefined) {
                o = true;
                break label;
            }
        }
        return o;
    }

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
    * 为xless.js插件机制
    * @public
    * @param f - 一个object对象, 目前所要填写如下内容
    *   f.name - 插件名称
    *   f.support - 插件css3需要的属性
    *   f.use - 使用css3方法执行
    *   f.fallback - 当css3属性不支持使用js方法执行
    * @returns {Function} 执行当前动画效果
    */
    xless.foundation = function (f) {
        xless[f.name] = function ( el ) {

            if( !el ) return;

            var o = true;

            g : for(var i = 0,len = f.support.length; i<len; i++){
                if(!checkStyle(f.support[i])){
                   o = false;
                   break g;
                }
            }

            return function (){
                return o ? (function (){
                    //持续时间不为infinite的话，则在持续时间结束后，移除class
                    return f.duration !== "infinite" && setTimeout(function (){
                        ctrl.remove( el, f.name );
                    }, f.duration || 1000);
                })() : f.fallback(el);
            }
        }
    }

    return xless;

})(window, document, undefined)

var s = document.getElementById("smile");

var bounce = xless.bounce(s);

bounce();
