/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var RefreshableListView = require('react-native-refreshable-listview')
var ArticleTalk = require("./ArticleTalk.js")
var MessageTip = require("./../tools/MessageTip.js")
var ArticleTalkCell = require("./ArticleTalkCell.js")
var config = require('../config.js')
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicatorIOS,
    WebView,
    TouchableHighlight,
    Image,
    Animated,
    ScrollView,
    AsyncStorage,
    ScrollView,
    ListView,
    ActivityIndicatorIOS,
    TextInput,
    LayoutAnimation,
      AlertIOS,
    } = React;
var colors = ["#ef6f67","#46afe4","#81cc7a","#00cbbd"]
var imageSrc='http://facebook.github.io/react/img/logo_og.png';
var random_color = function(){
  return colors[Math.floor(Math.random()*colors.length)]
}
var ArticleView = React.createClass({
    
    render: function() {
        var publishtime=null;
        var imageDes;
        if (this.props.article.time) {
          publishtime=new Date(parseInt(this.props.article.time)).toLocaleTimeString();
        };
        if(this.props.article.image[0]){
              imageDes = this.props.article.image[0];
            }
        return (
   
            <View style={styles.container}>
                <View style={styles.statusbar}></View>
                 
                    <View style={styles.row}>
                  
                    <View style={styles.textContainer}>
                     
                         <View style={styles.descContainer} >
                        <Image
                            style={styles.icon}
                            source={{uri: this.props.article.user_image.toString()}}
                            ></Image> 
                             
                            <Text style={[styles.tag,{backgroundColor:random_color()}]} numberOfLines={1}> {this.props.article.user_name} 
                          </Text>

                           {publishtime?<Text style={styles.time} numberOfLines={1}> 
                           {publishtime}</Text>:null}
                      </View>
                      </View>
                      </View>
                      <Text style={styles.contentText} numberOfLines={2}>
                        {this.props.article.content}
                      </Text>
                      <Image style={styles.nav_tag} source={{uri: imageDes}}></Image>

                        <ListView
                        style = {styles.list}
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

                 <Animated.View style={[styles.publishContainer,{opacity:this.state.publishOpacity}]}>

                    <View style={styles.publishLayer}></View>
                    <Animated.View style={[styles.publishView,{bottom:this.state.publishBottom}]}>

                        <TextInput style={styles.publishInput} multiline={true} value={this.state.replyTalk?('回复 @'+this.state.replyTalk.user_nick+':'):''} onChangeText={(text) => {
                            this.onTextContent("content",text)
                        }} autoFocus={true} onFocus={()=>{
                            this.setState({
               
                            })
                        }} onBlur={()=>{
                            this.setState({
             
                            })
                        }}  returnKeyType="done"/>
                      
                        <TouchableHighlight onPress={this.submitComment} style={styles.publishSubmit} underlayColor="#ddd">
                            <View ><Text style={styles.publishSubmitText}>提交评论</Text></View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.hideComment} underlayColor="#eee" style={styles.publishClose}>
                            <Icon name="ios-close-empty" size={40} color="#999" style={{width:30,height:30,marginLeft:7}}/>
                        </TouchableHighlight>
                    </Animated.View>
                </Animated.View>
                  
 
                <View style={styles.footer}>
                    <TouchableHighlight onPress={this._back} underlayColor="#eee" style={styles.buttonItem}>
                        <Icon name="ios-arrow-left" size={30} color="#aaa" style={styles.button}/>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._zan} underlayColor="#eee" style={styles.buttonItem}>
                        <View style={styles.buttonContainer}>
                        <Icon name="ios-heart-outline" size={30} color="#aaa" style={styles.button}/>
                            <Text style={{fontSize:13,color:"#666",marginLeft:4,lineHeight:28}}>{this.props.article.zan_count}</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._toTalk} underlayColor="#eee" style={styles.buttonItem}>
                        <View style={styles.buttonContainer}>
                        <Icon name="ios-chatboxes-outline" size={30} color="#aaa" style={styles.button}/>
                        <Text style={{fontSize:13,color:"#666",marginLeft:4,lineHeight:28}}>{this.props.article.comment_count}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
              <MessageTip ref="messageTip"/>

              
                </View>
        );
    },

    renderRow: function(
        talk: Object
    ) {
        return (
            <ArticleTalkCell
                talk={talk} onSelect={() => this.selectTalk(talk)} />

        );
    },

      componentWillReceiveProps(){
         this._loadInitialState().done();
     },

    componentDidMount() {
        this._loadInitialState().done();
         this.setState({
            url:config.host+"/api/dreaming/"+this.props.article._id
        })
        this.queryArticles();
      },
   async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem("user");
      console.log(value);
      if (value !== null){
         var userObj = JSON.parse(value);
        this.setState({
                name:userObj.name,
                phone:userObj.phone,
                image:userObj.image,
            });
      } else {
        this.setState({
                name:"",
                phone:"",
                 image:"",
                });
      }
    } catch (error) {
        console.log(error);
    }
  },

    getInitialState: function() {


        return {
            url:config.host+"/api/dreaming/"+this.props.article._id,
            tipText:"棒棒的",
            tipOpacity:new Animated.Value(0),
            name:null,
            phone:null,
            isLoading: false,
            isLoadingTail: false,
            nowPage:1,
              dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1._id !== row2._id,
            }),
            talks:[],
            isLoading:false,
            publishOpacity:new Animated.Value(0),
            publishBottom:new Animated.Value(-300),
            replyTalk:{},
            content:'',
        };
    },

    onTextContent:function(index, text) {
      this.setState({content:text});
    },
    submitComment:function(){
        
         if (this.state.phone==null) {
             this.refs.messageTip.show("请登录",false,false)
             return;
        };

        if (this.state.content==null || this.state.content.length==0) {
             this.refs.messageTip.show("请说点什么吧",false,false)
             return;
        };

        this.refs.messageTip.show("正在提交")

        var postbody = {
          id:this.props.article._id,
          name:this.state.name,
          phone:this.state.phone,
          image: this.state.image,
          content: this.state.content,
          time:new Date().getTime(),
          atPhone:this.props.article.user_phone,
          atName:this.props.article.user_name,
        }
        

        fetch(config.host+"/api/comment/publish",{

            method: "POST",
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(postbody)
        }).then((response) => response.json())
        .catch((error) => {

        })
        .then((responseData) => {
            setTimeout(() =>{
                this.setState({
                    isLoading:false
                })

            },500)

            var data = responseData;
            console.log(data)
            if(data){
                if(data.success){
                    this.refs.messageTip.show("发布成功",false,false)
                    this.setState({
                        url:config.host+"/api/dreaming/"+this.props.article._id
                    })
                    this.queryArticles();
                    this.hideComment();
                }else{
                    this.refs.messageTip.show(data.msg,false,false)
                }

            }else{
                AlertIOS.alert(
                    '哎呀，失败了',
                    '可能是网络问题额',
                    [
                        {text: '好的'},
                    ]
                )
            }
        })
        .done();
    },


    queryArticles: function(){


            this.setState({
                isLoading: true,
            });
            fetch(config.host+"/api/comment/"+this.props.article._id)
                .then((response) => response.json())
                .catch((error) => {
                    console.log()
                })
                .then((responseData) => {
                    if (responseData) {
                         this.setState({
                            talks:responseData,
                            isLoading:false,
                            dataSource: this.getDataSource()
                        })
                     };
                })
                .done();

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



    _back:function(){
        this.props.navigator.pop();
    },
    _zan:function(){
        this.props.article.praise_count = this.props.article.praise_count +1;
        this.setState({
            isLoading: true,
        });
        fetch(config.host+"/api/dreaming/praise/"+this.props.article._id+"/"+this.state.phone)
            .then((response) => response.json())
            .catch((error) => {

            })
            .then((responseData) => {
                if (responseData.data) {
                    var article = responseData.data;
                    this.props.article = article;
                    this.refs.messageTip.show('点赞成功',false,false);
                }else{
                    this.refs.messageTip.show(responseData.msg,false,false);
                }
                this.setState({
                            isLoading:false,
                        })
                
            })
            .done();

    },
     selectTalk:function(talk){
        this.setState({
            replyTalk:talk

        })
        this.showComment()

    },

    _toTalk:function(){
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
    list:{
        flex: 1,
        marginLeft:10,
        marginRight:10,

    },
    contentBlock:{
        flex:1,

    },
    tags_container:{
        flex:1,
        width:320,
        borderColor:"#fff",
        backgroundColor:'#ff0000',
    },
    nav_tags:{
        margin:0,
        padding:0,
        backgroundColor:'#00ff00',
    },
    nav_tag:{
        paddingLeft:13,
        paddingRight:13,
        height:100,
        marginLeft:10,
        marginRight:10,
        marginTop:20,
    },
 textContainer: {
    flex: 1,
    paddingBottom:5
  },
  contentText: {
    fontSize: 15,
    fontWeight: '500',
     color:"#999999",
     marginLeft:10,
  },
  descContainer:{
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop:10,
    alignItems:'center',
  },
  desc:{
    fontSize: 12,
    fontWeight: '200',
    color:"#999999",
    marginLeft:5,

  },
  icon:{
    width:26,
    height:26,
    borderRadius:13,
    backgroundColor:'#ff0000',
  },
  movieYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
  },
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
    footer:{
        height:44,
        backgroundColor:"#fff",
        flexDirection:"row",
        borderWidth:1,
        borderColor:"#fff",
        borderTopColor:"#ddd",
        justifyContent:"space-around",
        position:'absolute',
        bottom:0,
        width:320,
    },
    back:{
        width:30,
        height:30,
    },
    button:{
        width:30,
        height:30,
        marginTop:5
    },
    buttonItem:{
        height:44,
        flex:1,
        justifyContent:"space-around",
        flexDirection:"row",

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
    buttonContainer:{
        flexDirection:"row"
    },
      tags:{
    flex: 1,
    flexDirection:"row",
    paddingTop:5,
    paddingLeft:5,
    paddingBottom:0,
    flexWrap:'wrap',
  },
  tag:{
    fontSize: 11,
    color:"#fff",
    marginLeft:7,
    marginBottom:5,
    marginTop:5,
    paddingTop:2,
    paddingBottom:2,
    paddingLeft:1,
    paddingRight:3,
    borderRadius:2,
    overflow:"hidden",
    opacity:0.7,
    backgroundColor:"#ff0000"
  },
  time:{
    fontSize: 11,
    color:"#222222",
    marginLeft:7,
    marginBottom:5,
    marginTop:5,
    paddingTop:2,
    paddingBottom:2,
    paddingLeft:1,
    paddingRight:3,
    borderRadius:2,
    overflow:"hidden",
    opacity:0.7,

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
        bottom:50,
        flex:1,
        backgroundColor:"rgba(0,0,0,0)"
    },
    publishLayer:{
        position:"absolute",
        top:0,
        left:0,
        right:0,
        bottom:50,
        backgroundColor:"#333",
        opacity:0.6,
        flex:1
    },
    publishView:{
        position:"absolute",
        left:0,
        right:0,
        bottom:50,
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

//AppRegistry.registerComponent('ArticleView', () => ArticleView);

module.exports = ArticleView;