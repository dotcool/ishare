/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Animated,
    ActivityIndicatorIOS
    } = React;

var MessageTip = React.createClass({
    render: function() {
        return (
            <Animated.View style={[styles.tip,{opacity:this.state.tipOpacity}]}>

                <Text style={[styles.tipText,{ paddingTop:this.state.showLoading?40:8}]}>{this.state.tipText}</Text>
                {this.state.showLoading?<ActivityIndicatorIOS
                    style={styles.loading}
                    size="small"
                    />:null}
            </Animated.View>
        );
    },

    getInitialState: function() {
        return {
            tipText:"棒棒的",
            isStay:false,//是否保持不消失
            showLoading:false,
            tipOpacity:new Animated.Value(0)
        };
    },
    show:function(str,stay,showLoading){

        this.state.isStay = !!stay;
        this.state.showLoading = !!showLoading;
        this._showTip(str)
    },
    _showTip:function(str){
        this.setState({
            tipText:str
        })

        Animated.spring(this.state.tipOpacity, {
            toValue: 1,
        }).start();
        if(!this.state.isStay){
            setTimeout(()=>{
                this._hideTip()
            },1000)
        }

    },
    _hideTip:function(){
        Animated.spring(this.state.tipOpacity, {
            toValue: 0,
        }).start();
    },


});

var styles = StyleSheet.create({
    tip:{
        position:"absolute",
        left:120,
        top:130, 
        width:120,
        height:35,       
        backgroundColor:"rgba(0,0,0,0)",
        alignItems:"center",

    },
    loading:{
        width:20,height:20,
        top:-50
    },
    tipText:{
        backgroundColor:"#333",
        color:"#fff",
        padding:8,
        paddingLeft:10,
        paddingRight:10,

        borderRadius:5,
        overflow:"hidden",
        marginTop:200,
        fontSize:14
    }
});


module.exports = MessageTip;