/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

var React = require('react-native');
var TopicListCell = require("./topic/TopicListCell.js")
var ArticleView = require("./article/ArticleView.js")
var LoginView = require("./LoginView.js")
var MessageTip = require("./tools/MessageTip.js")
var RefreshableListView = require('react-native-refreshable-listview')
var config = require("./config.js")
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    ActivityIndicatorIOS,
    ScrollView
    } = React;

var TopicList = React.createClass({
    render: function() {
        return (

            <View style={styles.container}>
                <View style={styles.statusbar}></View>
                

                <RefreshableListView
                    style = {styles.list}
                    loadData={this.reloadTopics}
                    refreshDescription="玩命加载中"
                    minDisplayTime={2000}
                    minPulldownDistance={20}
                    ref="listview"
                    renderSeparator={this.renderSeparator}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    onEndReached={this.onEndReached}
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={true}
                    showsVerticalScrollIndicator={true}
                    onEndReachedThreshold={20}
                    />
                {this.state.isLoading?<View style={styles.loadingContainer}>
                    <ActivityIndicatorIOS
                        style={styles.centerLoading}
                        size="large"
                        />
                </View>:null}
            </View>
        );
    },
    renderRow: function(
        topic: Object
    ) {
        return (
            <TopicListCell
                topic={topic} onSelect={() => this.selectTopic(topic)}
                />
        );
    },
    renderSeparator: function() {
        var style = styles.rowSeparator;
        style = [style, styles.rowSeparatorHide];
        return (
            <View  style={style}/>
        );
    },
    getInitialState: function() {
        return {
            isLoading: false,
            isLoadingTail: false,
            nowPage:1,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1.id !== row2.id,
            }),
            tags:[],
            filter: '',
            queryNumber: 0,
            test:true,
            topics:[]
        };
    },

    componentDidMount: function() {
        this.queryTopics('');
        //setTimeout(()=>{
        //    this.showLogin();
        //},300)

    },
    queryTopics: function(){
        this.setState({
            isLoading: true,
        });
        fetch(config.host+"page="+this.state.nowPage)
            .then((response) => response.json())
            .catch((error) => {

            })
            .then((responseData) => {
                var topics = this.state.topics.concat(responseData)
                this.setState({
                    isLoading: false,
                    topics:topics
                })
                this.setState({
                    dataSource: this.getDataSource()
                });
            })
            .done();

        //fetch("http://www.html-js.com/tag.json")
        //    .then((response) => response.json())
        //    .catch((error) => {
        //
        //    })
        //    .then((responseData) => {
        //        console.log(responseData)
        //        var arr = responseData.splice(0,10)
        //        this.setState({
        //            tags: arr,
        //        })
        //    })
        //    .done();
    },
    getDataSource: function(): ListView.DataSource {
        return this.state.dataSource.cloneWithRows(this.state.topics);
    },
    reloadTopics:function(){
        console.log("reloadArticles")
        this.state.nowPage = 1;
        this.queryTopics()
    },
    onEndReached:function(){
        console.log("---------------end----------------")
        if(this.state.isLoading){
            return;
        }
        else{
            console.log(this.state.nowPage)
            this.state.nowPage++;
            console.log(this.state.nowPage)
            this.queryTopics()
        }
    },
    selectTopic:function(topic){
        this.props.navigator.push({
            component: ArticleView,
            passProps: {topic},
        });
    },

    showLogin:function(){
        this.props.navigator.push({
            component: LoginView,
            passProps: {},
        })
    }
});

var styles = StyleSheet.create({
    topbar:{
        backgroundColor:"#46afe4",
        height:50
    },
    toptitle:{
        fontSize:20,
        color:"#fff",
        height:50,
        top:14,
        textAlign: 'center',
    },
    statusbar:{
        backgroundColor:"#46afe4",
        height:20
    },
    tags_container:{
        height:35,
        borderColor:"#fff",
        borderBottomColor:"#eee",
        borderWidth:1,
    },
    nav_tags:{
        margin:0,
        padding:0,
    },
    nav_tag:{
        paddingLeft:13,
        paddingRight:13,
        height:30,
        color:"#444",
        fontSize:14,
        lineHeight:25,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    list:{
        flex: 1,
        marginBottom:50
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    rowSeparator: {
        backgroundColor: '#efefef',
        height: 1,
        marginLeft: 4,
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
    }
});

AppRegistry.registerComponent('TopicList', () => TopicList);

module.exports = TopicList;