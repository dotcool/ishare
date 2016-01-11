/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

var React = require('react-native');
var config = require('../config.js');
var Icon = require('react-native-vector-icons/Ionicons');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicatorIOS,
    TouchableHighlight,
    Image,
    Animated,
    ListView,
    TextInput,
    LayoutAnimation
    } = React;
var ArticleTalkCell = require("./ArticleTalkCell.js")
var ArticleTalk = React.createClass({
    render: function() {
        return (
            <View style={styles.container}>
                <View style={styles.statusbar}></View>
                <View style={styles.header}>
                    <Text style={styles.headertitle}>{this.props.article.content}</Text>
                </View>
                <ListView
                    style = {styles.list}
                    ref="listview"
                    renderSeparator={this.renderSeparator}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    >

                </ListView>
                {this.state.isLoading?<View style={styles.loadingContainer}>
                    <ActivityIndicatorIOS
                        style={styles.centerLoading}
                        size="large"
                        />
                </View>:null}
                <View style={styles.footer}>
                    <TouchableHighlight onPress={this._back} underlayColor="#aaa">
                        <Icon name="ios-arrow-left" size={30} color="#aaa" style={styles.button}/>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._add} underlayColor="#aaa">
                        <Icon name="ios-chatboxes-outline" size={30} color="#aaa" style={styles.rightbutton}/>
                    </TouchableHighlight>
                </View>
                <Animated.View style={[styles.publishContainer,{opacity:this.state.publishOpacity}]}>

                    <View style={styles.publishLayer}></View>
                    <Animated.View style={[styles.publishView,{bottom:this.state.publishBottom}]}>

                        <TextInput style={styles.publishInput} multiline={true} value={this.state.replyTalk?('回复 @'+this.state.replyTalk.user_nick+':'):''}></TextInput>
                        <TouchableHighlight onPress={this.postComment} style={styles.publishSubmit} underlayColor="#ddd">
                            <View ><Text style={styles.publishSubmitText}>提交评论</Text></View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.hideComment} underlayColor="#eee" style={styles.publishClose}>
                            <Icon name="ios-close-empty" size={40} color="#999" style={{width:30,height:30,marginLeft:7}}/>
                        </TouchableHighlight>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    },
    renderSeparator: function() {
        var style = styles.rowSeparator;
        style = [style, styles.rowSeparatorHide];
        return (
            <View  style={style}/>
        );
    },
    getDataSource: function(): ListView.DataSource {
        return this.state.dataSource.cloneWithRows(this.state.talks);
    },
    getInitialState: function() {
        return {
            id:this.props.article._id,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1._id !== row2._id,
            }),
            talks:[],
            isLoading:false,
            publishOpacity:new Animated.Value(0),
            publishBottom:new Animated.Value(-300),
            replyTalk:{}
        };
    },


    renderRow: function(
        talk: Object
    ) {
        return (
            <ArticleTalkCell
                talk={talk} onSelect={() => this.selectTalk(talk)} />

        );
    },

    componentDidMount: function() {
        console.log(this.state.publishBottom._value)
        this.queryTalks('');
    },
    queryTalks: function(){
        this.state.isLoading = true;
        fetch(config.host+this.state.id)
            .then((response) => response.json())
            .catch((error) => {

            })
            .then((responseData) => {
                this.state.isLoading = false;
                if (responseData) {
                    var talks = this.state.talks.concat(responseData.comments)
                    this.setState({
                        talks:talks
                    })
                    this.setState({
                        dataSource: this.getDataSource()
                    });
                }
            })
            .done();
    },
    _back:function(){
        this.props.navigator.pop();
    },
    selectTalk:function(talk){
        this.setState({
            replyTalk:talk

        })
        this.showComment()

    },
    _add:function(){
        this.setState({
            replyTalk:""

        })
        this.showComment()
    },
    showComment:function(){
        Animated.spring(this.state.publishBottom, {
            toValue: 0,
        }).start();
        Animated.spring(this.state.publishOpacity, {
            toValue: 1   // return to start
        }).start();
    },
    hideComment:function(){


        var config = {tension: 40, friction: 3};
        Animated.spring(this.state.publishBottom, {
            toValue: -300,
        }).start();
        Animated.spring(this.state.publishOpacity, {
            toValue: 0    // return to start
        }).start();
       
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    statusbar:{
        backgroundColor:"#46afe4",
        height:20
    },
    header:{
        height:44,
        backgroundColor:"#46afe4",
        alignItems:"center",
    },
    headertitle:{
        fontSize:16,
        color:"#fff",
        marginTop:15
    },
    footer:{
        height:44,
        backgroundColor:"#fff",
        flexDirection:"row",
        borderWidth:1,
        borderColor:"#fff",
        borderTopColor:"#ddd",
        justifyContent:"space-around",
    },
    list:{
        flex: 1,
    },
    back:{
        width:30,
        height:30,
    },
    button:{
        width:30,
        height:30,
        marginTop:5,
        marginLeft:10
    },
    rightbutton:{
        width:30,
        height:30,
        marginTop:5,
        marginRight:10,
        //justifyContent:"flex-end",
        //alignSelf:"flex-end"
    },
    title:{
        fontSize:16,
        lineHeight:30,
        color:"#fff"
    },
    webView: {
        flex: 1,
        backgroundColor: '#fff',

    },
    centerLoading: {
        width:100,
        height:100,
        //backgroundColor:"#333",
        borderRadius:15,
    },
    loadingContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position:"absolute",
        left:0,
        top:0,
        right:0,
        bottom:0,
        backgroundColor:"rgba(255, 255, 255, 0)"
    },
    rowSeparator: {
        backgroundColor: '#efefef',
        height: 1,
        //marginLeft: 4,
    },
    publishContainer:{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        flex:1,
        backgroundColor:"rgba(0,0,0,0)"
    },
    publishLayer:{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:0,
        backgroundColor:"#333",
        opacity:0.6,
        flex:1
    },
    publishView:{
        position:"absolute",
        left:0,
        right:0,
        bottom:0,
        height:300,
        backgroundColor:"#fff"
    },
    publishClose:{
        position:"absolute",
        right:5,
        top:5,
        height:30,
        width:30,
    },
    publishInput:{
        flex:1,
        margin:15,
        borderWidth:1,
        borderColor:"#ddd",
        marginBottom:15,
        marginTop:40,
        fontSize:16,
        padding:10
    },
    publishSubmit:{
        marginLeft:15,
        marginRight:15,
        backgroundColor:"#46afe4",
        borderRadius:3,
        overflow:"hidden",
        height:40,
        marginBottom:15,
        alignItems:"center"
    },
    publishSubmitText:{
        fontSize:16,
        color:"#fff",
        marginTop:10

    }
});

AppRegistry.registerComponent('ArticleTalk', () => ArticleTalk);

module.exports = ArticleTalk;