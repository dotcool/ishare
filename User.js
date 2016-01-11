/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var MessageTip = require("./tools/MessageTip.js")
var LoginView = require('./LoginView.js')
var config = require('./config.js')
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    AsyncStorage,
    Image,
    AlertIOS
    } = React;

var User = React.createClass({

    render: function() {
        return (
            <View style={styles.container}>
                <View style={styles.statusbar}></View>
                
                
            <View style={styles.userContent}>
                
               {this.state.image? <Image
                    style={styles.headicon}
                    source={{uri: this.state.image}}
                    ></Image>:
                    <View style={styles.iconBlock}>
                    <Icon name="person" size={20} color="#999" style={styles.icondefault}/>
                    </View>
                } 

             <Text style={styles.nameText}>
                姓名:{this.state.name}
              </Text>

           <View style={styles.userControl}>
        
              <View style={styles.userDetail}>

                <View style={styles.userBlock}>
                <Text style={styles.blockText}>
                {this.state.follow_count}
                 </Text>
                <Text style={styles.blockText}>
                关注
              </Text>
              </View>

                 <View style={styles.userBlock}>
                <Text style={styles.blockText}>
                {this.state.fans_count}
                 </Text>
                <Text style={styles.blockText}>
                粉丝
              </Text>
              </View>


               {this.state.sex=='male' ?<Icon style={styles.icon} name="man" size={20} color="#4F8EF7" />
               :<Icon style={styles.icon} name="woman" size={20} color="#e554f6"  />}
               
              </View>


                   
               
              </View>
              {this.state.isLogin? null:
                <View style={styles.userDetail}>
                <TouchableHighlight onPress={this._register} underlayColor="#eee" style={styles.submit}>
                              <View style={styles.userDetail}>
                             <Icon name="person-add" size={20} color="#999"/>
                             <Text>注册</Text>
                             </View>
                        </TouchableHighlight>
                <TouchableHighlight onPress={this._login} underlayColor="#eee" style={styles.submit}>
                             <View style={styles.userDetail}>
                             <Icon name="person" size={20} color="#999"/>
                             <Text>登录</Text>
                             </View>
                        </TouchableHighlight></View>}
            </View>
                        <TouchableHighlight onPress={this._back} underlayColor="#eee" style={styles.close}>
                    <Icon name="ios-close-empty" size={40} color="#999" style={{width:30,height:30,marginLeft:7}}/>
                </TouchableHighlight>

            </View>
        );
    },
    _valueChange:function(name,value){
        this.setState({
            [name]:value
        })
    },


    componentWillReceiveProps(){
         this._loadInitialState().done();
     },

    componentDidMount() {
        this._loadInitialState().done();
      },
   async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem("user");
      console.log(value);
      if (value !== null){
         var userObj = JSON.parse(value);
        this.setState({
                isLogin:true,
                image:userObj.image,
                isLogin:true,
                name:userObj.name,
                phone:userObj.phone,
                score:userObj.score,
                tags:userObj.tags,
                sex:userObj.sex,
                post_count:userObj.post_count,
                follow_count:userObj.follow_count,
                fans_count:userObj.fans_count,
                dream:userObj.dream});
      } else {
        this.setState({
             isLogin:false,
                    image:"",
                    name:"",
                    phone:"",
                    score:0,
                    tags:[],
                    sex:"",
                    post_count:0,
                    follow_count:0,
                    fans_count:0,
                    dream:""
                });
      }
    } catch (error) {
        console.log(error);
    }
  },
  
    getInitialState: function() {
                return {
                    isLogin:false,
                    image:"",
                    name:"",
                    phone:"",
                    score:0,
                    tags:[],
                    sex:"",
                    post_count:0,
                    follow_count:0,
                    fans_count:0,
                    dream:""
                };
    },
    _register:function(){
       this.props.navigator.push({
            component: LoginView,
              passProps: {status:'register'},
        })
    },
     _login:function(){
       this.props.navigator.push({
            component: LoginView,
              passProps: {status:'login'},
        })
    },
    _pickImage:function(){
        // Specify any or all of these keys
        var options = {
            title: '上传新头像',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '现场拍',
            chooseFromLibraryButtonTitle: '相册选',
            returnBase64Image: false,
            returnIsVertical: false
        };


        UIImagePickerManager.showImagePicker(options, (type, response) => {
            if (type !== 'cancel') {
                var source;
                if (type === 'data') { // New photo taken OR passed returnBase64Image true -  response is the 64 bit encoded image data string
                    source = {uri: 'data:image/jpeg;base64,' + response, isStatic: true};
                } else { // Selected from library - response is the URI to the local file asset
                    source = {uri: response};
                }
              
                this._upload(source)
            } else {
                console.log('Cancel');
            }
        });
    },
    _upload:function(image){
        console.log(image)
        this.refs.messageTip.show("正在上传",true,true)
        var xhr = new XMLHttpRequest();
        xhr.open('POST', config.host+'/api/chat/image');
        xhr.onload = () => {
            setTimeout(() =>{
                this.setState({
                    isLoading:false
                })

            },500)

            var data = JSON.parse(xhr.responseText);
            if(data&&data.success){
                this.refs.messageTip.show("上传成功")
                this.setState({
                    head_pic:data.data.filename
                })
                AsyncStorage.setItem("share_image",data.data.filename)
                //this.props.navigator.pop();
            }else{
                AlertIOS.alert(
                    '哎呀，失败了',
                    '可能是网络问题额',
                    [
                        {text: '好的'},
                    ]
                )
            }

        };
        var formdata = new FormData();
        formdata.append('pic',{...image, name: 'image.jpg'});
        xhr.send(formdata);
    },

   
     _back:function(){
          AsyncStorage.setItem("user","");
          this.setState({
            isLogin:false,
            phone:"",
            name:'',
            image:'',
            score:0,
            post_count:0,
            follow_count:0,
            fans_count:0,
          })
    },

    /**
     * 获取当前登录用户token,如果没登陆,返回空
     */
    getToken:function(cb){
        AsyncStorage.getItem("token",function(err,token){
            cb(err,token);
        })
    }

});

var styles = StyleSheet.create({
  userBlock:{
    flexDirection:'column', 
    margin:5,
    alignItems:'center',
  },

     userContent:{
    flex:1,
    flexDirection:'column', 
    alignItems:'center',
    marginTop:10,
  },
    userControl:{

    flexDirection:'row', 
    justifyContent:'flex-start',
    alignItems:'center',
  },
  userDetail:{
    flex:1,
    flexDirection:'row', 
    justifyContent:'center',
    alignItems:'center',
    margin:5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 18,
    height: 110,
  },
  headicon:{
    width:120,
    height:120,
    borderRadius:60,
    alignItems:'center',

  },
iconBlock:{
        justifyContent:'center',
        alignItems:"center",
        width:80,
        height:80,
},
  icondefault:{

   width:26,
    height:26,

  
  },
  icon:{

    marginLeft:5,
     width:26,
    height:26,

    
  },

  stream: {
    flex: 1,
    backgroundColor: 'rgb(230, 230, 230)',
  },
  card: {
    margin: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'white',
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {height: 0.5},
  },
  dreamText: {
    padding: 4,
    paddingBottom: 4,
    color:'gray',
    fontSize: 12,
    backgroundColor: 'transparent',
  },
    blockText: {
    padding:1,
    margin:1,
    color:'black',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
    nameText: {
    padding: 4,
    margin:4,
    marginTop:10,
    paddingBottom: 10,
    color:'black',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  headerText: {
    top:14,
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    shadowRadius: 3,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowOffset: {height: 1},
  },
    tip:{
        position:"absolute",
        left:0,
        top:0,
        bottom:0,
        right:0,
        backgroundColor:"rgba(0,0,0,0)",
        alignItems:"center",

    },
    tipText:{
        backgroundColor:"#333",
        color:"#fff",
        padding:5,
        paddingLeft:8,
        paddingRight:8,
        borderRadius:5,
        marginTop:200,
        fontSize:12
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    statusbar:{
        backgroundColor:"#46afe4",
        height:20
    },
    title:{
        fontSize:26,
        color:"#444",
        flex:1,
        alignItems:"center",
        textAlign:"center",
        marginTop:70,
        marginBottom:70,
    },
    input:{
      marginLeft:40,
        marginRight:40,
        height:45,
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:5,
        paddingLeft:10,
        fontSize:18,
        color:"#666",
        marginBottom:20
    },
    submit:{
        height:30,
       
        marginTop:20,
        overflow:"hidden",
    },
    button:{
        height:45,
        backgroundColor:"#46afe4",
        borderColor:"#46afe4",
        borderWidth:1,
        width:120,
    },
    buttonText:{
        color:"#fff",
        textAlign:"center",
        backgroundColor:"#46afe4",
        fontSize:16,
        marginTop:13
    },
    close:{
        position:"absolute",
        right:10,
        top:30,
        height:30,
        width:30,
    },
    head_pic:{
        width:50,
        height:50,
        marginTop:20,
        opacity:0.6
    }
});

AppRegistry.registerComponent('User', () => User);

module.exports = User;