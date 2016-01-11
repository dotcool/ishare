/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

var React = require('react-native');
var ArticleCell = require("./article/ArticleCell.js")
var ArticleView = require("./article/ArticleView.js")
var ArticleTalk = require("./article/ArticleTalk.js")
var LoginView = require("./LoginView.js")
var MessageTip = require("./tools/MessageTip.js")
var config = require('./config.js')
var RefreshableListView = require('react-native-refreshable-listview')
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    ActivityIndicatorIOS,
    ScrollView
    } = React;

var ArticleList = React.createClass({
    render: function() {
        return (

        <View style={styles.container}>
            <View style={styles.statusbar}></View>
 
          
            <RefreshableListView
                style = {styles.list}
                loadData={this.reloadArticles}
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
                       <MessageTip ref="messageTip"/>
        </View>
        );
    },
    renderRow: function(
        article: Object
    ) {
        return (
            <ArticleCell
                article={article} onPraise={() => this.selectArticle(article)}
                showCommit={() => this.showCommit(article)}
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
            articles:[],
            lasttime:null,
        };
    },

    componentDidMount: function() {
        this.queryArticles('');
        //setTimeout(()=>{
        //    this.showLogin();
        //},300)

    },
    queryArticles: function(){
        console.log('queryArticles')
        this.setState({
            isLoading: true,
        });
        fetch(config.host+"/api/dreaming")
            .then((response) => response.json())
            .catch((error) => {

            })
            .then((responseData) => {
                var articles = responseData;
                if (articles) {
                    this.setState({
                        isLoading: false,
                        articles:articles
                    })

                    this.setState({
                        dataSource: this.getDataSource(),
                        lasttime:new Date().getTime()
                    });
                }else{
                    this.setState({
                        isLoading: false,
                    })
                }
            })
            .done();

    },
    getDataSource: function(): ListView.DataSource {
        return this.state.dataSource.cloneWithRows(this.state.articles);
    },
    reloadArticles:function(){
        console.log("reloadArticles")
        this.state.nowPage = 1;
        this.queryArticles()
    },
    onEndReached:function(){
        console.log("---------------end----------------")
        if(this.state.isLoading){
            return;
        }
        else{
            // this.state.nowPage++;
            // console.log(this.state.nowPage)
            // if (this.state.articles>=this.state.nowPage*500) {
               var stamp = Math.round((new Date().getTime() - this.state.lasttime)/1000);
               if(stamp>5){
                   this.queryArticles(); 
                    this.setState(
                        {lasttime:new Date().getTime()}
                    );
                }
            // }
            
        }
    },
    selectArticle:function(article){
        this.props.navigator.push({
            component: ArticleView,
            passProps: {article},
        })
        
    },
    showCommit:function(article){
        this.props.navigator.push({
            component: ArticleTalk,
            passProps: {article},
        })
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
        backgroundColor: 'rgb(230, 230, 230)',

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

AppRegistry.registerComponent('ArticleList', () => ArticleList);

module.exports = ArticleList;