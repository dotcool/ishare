/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var MessageTip = require("./tools/MessageTip.js")
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
    AlertIOS,
    ScrollView
    } = React;

var LoginView = React.createClass({
    render: function() {
           
        console.log(this.state.head_pic);

        return (
            <View style={styles.container}>
                <View style={styles.statusbar}></View>
                 <ScrollView
                  contentContainerStyle={styles.contentBlock}
                  style={styles.contentBlock}>
              
                    <View style={styles.formBlock}>
{this.props.status == 'login' ? <Text style={styles.titleBlock}>登录</Text>:<Text style={styles.titleBlock}>注册</Text>}
                        <View style={styles.hblock}>
                        <TextInput placeholder="输入手机号" style={styles.phoneInput} value={this.state.email} onChangeText={(text) => {
                            this._valueChange("phone",text)
                        }} autoFocus={true} onFocus={()=>{
                            this.setState({
                            })
                        }} onBlur={()=>{
                            this.setState({
                            viewOffsetY:0
                            })
                        }}  returnKeyType="next">

                        </TextInput>

                     <TouchableHighlight onPress={this._verify} underlayColor="#eee" style={styles.register}>
                           <View style={styles.userDetail}>
                             <Icon name="ios-lightbulb-outline" size={20} color="#999"/>
                             <Text style={styles.txtCode}>验证码</Text>
                             </View>
                        </TouchableHighlight>
                        </View>
                        <TextInput placeholder="输入验证码"  style={styles.input} value={this.state.password}  onChangeText={(text) => {
                            this._valueChange("password",text)
                        }} returnKeyType="next"  onFocus={()=>{
                            this.setState({
                            })
                        }}  onBlur={()=>{
                            this.setState({
                            viewOffsetY:0
                            })
                        }}>

                        </TextInput>
                        {this.state.isLogin?null:
                            <View>
                                <TextInput placeholder="输入昵称"  style={styles.input} value={this.state.nick}   onChangeText={(text) => {
                            this._valueChange("nick",text)
                        }}  returnKeyType="next"  onFocus={()=>{
                            this.setState({
            
                            })
                        }}  onBlur={()=>{
                            this.setState({
                            viewOffsetY:0
                            })
                        }}  returnKeyType="next">

                                </TextInput>
                                <TextInput placeholder="输入个性签名"  style={styles.input} value={this.state.dream}   onChangeText={(text) => {
                            this._valueChange("dream",text)
                        }}  returnKeyType="next"  onFocus={()=>{
                            this.setState({
                    
                            })
                        }}  onBlur={()=>{
                            this.setState({
                            viewOffsetY:0
                            })
                        }}  returnKeyType="next">

                                </TextInput>

                                <TextInput placeholder="年龄"  style={styles.input} value={this.state.age}   onChangeText={(text) => {
                            this._valueChange("age",text)
                        }}  returnKeyType="done"  onFocus={()=>{
                            this.setState({
            
                            })
                        }}  onBlur={()=>{
                            this.setState({
                            viewOffsetY:0
                            })
                        }}  returnKeyType="done">

                                </TextInput>

                              <View style={styles.userDetail}>
                            <TouchableHighlight onPress={this._chooseMan} underlayColor="#eee" style={styles.submit}>
                                          <View style={styles.userDetail}>
                                         <Icon name="man" size={20} color="#999"/>
                                         <Text>男生</Text>
                                         </View>
                                    </TouchableHighlight>
                            <TouchableHighlight onPress={this._chooseGirl} underlayColor="#eee" style={styles.submit}>
                                         <View style={styles.userDetail}>
                                         <Icon name="woman" size={20} color="#999"/>
                                         <Text>女生</Text>
                                         </View>
                                    </TouchableHighlight></View>
                                <Text style={{marginLeft:40,marginRight:40,color:"#aaa",textAlign:"center"}}>然后上传个掉渣天的头像吧</Text>
                                <TouchableHighlight underlayColor="#fff" onPress={this._pickImage} style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginLeft:40,marginRight:40}}>
                                    {this.state.avatarSource?
                                        <Image source={this.state.avatarSource} style={styles.uploadAvatar} />
                                    : <Icon name="ios-paw-outline" size={40} color="#999" style={{width:30,height:30,marginLeft:7}}/>}
                                </TouchableHighlight>
                            </View>
                        }
                        <TouchableHighlight onPress={this._doAction} underlayColor="#eee" style={styles.submit}>
                            <View style={styles.button}><Text style={styles.buttonText}>{this.state.isLogin?"登录":"注册"}</Text></View>
                        </TouchableHighlight>

                    </View>
             </ScrollView>
           <TouchableHighlight onPress={this._back} underlayColor="#eee" style={styles.close}>
                    <Icon name="ios-close-empty" size={40} color="#999" style={{width:30,height:30,marginLeft:7}}/>
                </TouchableHighlight>
                <MessageTip ref="messageTip"/>
            </View>
        );
    },
     _chooseMan:function(){
            this.setState({
                sex:'male'
            })
        },
     _chooseGirl:function(){
        this.setState({
            sex:'female'
        })
    },

    _valueChange:function(name,value){
        console.log(name+" - "+value)
        this.setState({
            [name]:value
        })
    },
  
     componentDidMount: function() {
        if (this.props.status == 'register') {
                   this.setState({
                    isLogin:false,
                   }) 
            }else if(this.props.status == 'login'){
                    this.setState({
                        isLogin:true,
                    })
            }
     },

    getInitialState: function() {
   
        return {
            isLogin:false,
            head_pic:"http://img5.duitang.com/uploads/item/201501/24/20150124005138_PYB2y.jpeg",
            phone:"",
            name:"",
            dream:"",
            password:"",
            nick:"",
            age:null,
            viewOffsetY:0,
            avatarSource:null,
            sex:"",
        };
    },
    _back:function(){
        this.props.navigator.pop();
    },
    _pickImage:function(){
        // Specify any or all of these keys
        var options = {
            title: '上传新头像',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '现场拍',
            chooseFromLibraryButtonTitle: '相册选',
            returnBase64Image: true,
            returnIsVertical: false
        };

// The first arg will be the options object for customization, the second is
// your callback which sends string: type, string: response
        UIImagePickerManager.showImagePicker(options, (type, response) => {
             // if (!type) {
             //    var source;
             //    source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
             //    this._upload(source);
             //    this.setState(
             //      {head_pic:source});
             //  }
                
                var source;
                if(!type){
                    if (response.data === '') { // New photo taken OR passed returnBase64Image true -  response is the 64 bit encoded image data string
                        source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                    } else { // Selected from library - response is the URI to the local file asset
                        source = {uri: response.uri};
                    }
                    console.log(source)
                    this._upload(source)
                   this.setState(
                  {avatarSource:source});
            }
        });
    },
    _upload:function(image){
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

    _verify:function(){

        if (this.state.phone==null || this.state.phone.length!=11) {
            this.refs.messageTip.show('请输入手机号')
            return;
        };
         this.setState({
            isLoading: true,
        });

        var postbody = {
            phone:this.state.phone,
        }

        fetch(config.host+'/api/user/verify',{
            method: 'POST',
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                 phone:this.state.phone
            })
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
                if(data.code==0){
                    this.refs.messageTip.show('获取验证码成功')
                }else{
                    this.refs.messageTip.show(data.msg)
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


    _doAction:function(){
        if (this.state.isLogin) {
            this._login();
        }else{
            this._submit();
        }
    },

    _submit:function(){

        if (this.state.phone==null || this.state.phone.length!=11) {
            this.refs.messageTip.show('请输入手机号')
            return;
        };
        if (this.state.password==null || this.state.password.length==0) {
            this.refs.messageTip.show('请输入验证码')
            return;
        };

        if (this.state.age==null || this.state.age.length==0) {
            this.refs.messageTip.show('请输入年龄')
            return;
        };
        if (this.state.dream==null || this.state.dream.length==0) {
            this.refs.messageTip.show('请输入个性签名')
            return;
        };
        if (this.state.head_pic==null || this.state.head_pic.length==0) {
            this.refs.messageTip.show('请上传一张图片')
            return;
        };

         this.setState({
            isLoading: true,
        });


         fetch(config.host+"/api/user/signin",{
            method: "POST",
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                name:this.state.nick,
                password:this.state.password,
                phone:this.state.phone,
                age:this.state.age,
                dream:this.state.dream,
                uimage:config.host+"/files/"+this.state.head_pic,
            })
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
            if(data){
                if(data.success){
                    // this.refs.messageTip.show("免注册登录")
                    AsyncStorage.setItem("user",JSON.stringify(data.user))
                    this.props.navigator.pop()
                }else{
                    this.refs.messageTip.show(data.msg)
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

    _login:function(){

        if (this.state.phone==null || this.state.phone.length!=11) {
            this.refs.messageTip.show('请输入手机号')
            return;
        };
        if (this.state.password==null || this.state.password.length==0) {
            this.refs.messageTip.show('请输入验证码')
            return;
        };
         this.setState({
            isLoading: true,
        });


         fetch(config.host+"/api/user/login",{
            method: "POST",
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                password:this.state.password,
                phone:this.state.phone,
            })
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
          
                    AsyncStorage.setItem("user",JSON.stringify(data.user))
                    this.props.navigator.pop()
                }else{
                    this.refs.messageTip.show(data.msg)
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

  icon:{
    marginVertical:0,
    marginLeft:5,
    width:40,
    height:40,
    
  },
      uploadAvatar:{
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        marginBottom:10,
        height:60,
        width:60,
        padding: 8,
        resizeMode: 'contain',
    },
    txtCode:{
        marginLeft:5,
    },
  userDetail:{
  
    flexDirection:'row', 
    justifyContent:'center',
    alignItems:'center',
    margin:5,
  },
    contentBlock:{
        flex:1,

    },
    hblock:{
        height:35,
        flex:1,
        justifyContent:"space-around",
        flexDirection:"row",
        marginBottom:20,
    },
        close:{
        position:"absolute",
        right:10,
        top:30,
        height:30,
        width:30,
    },
  
    container: {
        flex: 1,
         backgroundColor: '#fff',

    },
    statusbar:{
        backgroundColor:"#46afe4",
        height:20
    },
    titleBlock:{
        fontSize:26,
        color:"#444",

        textAlign:"center",
        marginTop:10,
        marginBottom:10,
    },
    phoneInput:{
        marginLeft:20,
        height:35,
        width:180,
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:5,
        paddingLeft:10,
        fontSize:14,
        color:"#666"
    },

    input:{
        marginLeft:10,
        marginRight:10,
        height:35,
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:5,
        paddingLeft:10,
        fontSize:14,
        color:"#666",
        marginBottom:10
    },
    register:{
        marginLeft:40,
        marginRight:40,
        height:45,
        borderRadius:5,
        overflow:"hidden",
    },
    formBlock:{
        marginTop:10,
    },
    submit:{
        marginLeft:40,
        marginRight:40,
        height:45,
        borderRadius:5,

        marginTop:20,
        overflow:"hidden",
    },
    button:{
        height:45,
        backgroundColor:"#46afe4",
        borderColor:"#46afe4",
        borderWidth:1,
    },
    registerText:{
        color:"#fff",
        textAlign:"center",
        backgroundColor:"#46afe4",
        fontSize:14,
        marginTop:13
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

AppRegistry.registerComponent('LoginView', () => LoginView);

module.exports = LoginView;