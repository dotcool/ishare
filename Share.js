/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var Icon = require('react-native-vector-icons/Ionicons');
var config = require('./config.js');
var MessageTip = require("./tools/MessageTip.js")
var {
  AppRegistry,
  AlertIOS,
  Image,
  LinkingIOS,
  PixelRatio,
  ProgressViewIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ScrollView,
  AsyncStorage,
} = React;


var PAGE_SIZE = 20;


var Share = React.createClass({

    componentDidMount:function(){
        this._loadInitialState().done();
        navigator.geolocation.getCurrentPosition(
          (initialPosition) => this.setState({initialPosition}),
          (error) => alert(error.message),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
        this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
          this.setState({lastPosition});
        });

      },
 componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },
      async _loadInitialState() {
    try {
       AsyncStorage.getItem("user",(error,user)=>{
                  var userObj = JSON.parse(user);
                  if(userObj){
                    this.setState({
                        image:userObj.image,
                        name:userObj.name,
                        phone:userObj.phone,
                    });
                  }else{
                      this.setState({
                      image:'http://pic8.nipic.com/20100706/4853121_072236095383_2.jpg'
                       });
                  }
              })
    } catch (error) {
    }
  },
  getInitialState: function() {
      

        return {
            isUploading: false,
            uploadProgress: null,
            randomPhoto: null,
            content: null,
            avatarSource:null,
            head_pic:null,
            image:null,
            name:null,
            phone:null,
            initialPosition: 'unknown',
            lastPosition: 'unknown',

        };
    },

  fetchRandomPhoto:function() {
      var options = {
            title: '上传美照',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '现场拍',
            chooseFromLibraryButtonTitle: '相册选',
            returnBase64Image: false,
            returnIsVertical: false
        };

    UIImagePickerManager.showImagePicker(options, (type, response) => {
      console.log('Response = ', response);

      if (!type) {
                var source;
                source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                this.upload(source);
                this.setState(
                  {avatarSource:source});
              }
      }
    );
},



    onTextContent:function(index, text) {
      this.setState({content:text});
    },

     submit:function(){
        
         if (this.state.phone==null) {
             this.refs.messageTip.show("请登录",false,false)
             return;
        };

        if (!AsyncStorage.getItem("share_image")) {
             this.refs.messageTip.show("请选择一张图片",false,false)
             return;
        };

        if (this.state.content==null || this.state.content.length==0) {
             this.refs.messageTip.show("请说点什么吧",false,false)
             return;
        };

        this.refs.messageTip.show("分享中")

        var postbody = {
          phone: this.state.phone,
          name: this.state.name,
          uimage:this.state.image,
          pic:[config.host+"/files/"+this.state.head_pic],
          content:this.state.content,
          songpath:"",
          geo:JSON.stringify(this.state.lastPosition),
        }
        

        fetch(config.host+"/api/dreaming/publish",{

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
                      isUploading: false,
                      uploadProgress: null,
                      randomPhoto: null,
                      content: null,
                      avatarSource:null,
                      image:null,
                      name:null,
                      phone:null,
                      initialPosition: 'unknown',
                      lastPosition: 'unknown',
                    });
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
    upload:function(image){
        console.log(image)
        this.refs.messageTip.show("正在上传",false,false)
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
                this.refs.messageTip.show("上传成功",false,false)
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
    render: function() {
    return (
        <View style={styles.container}>
             <View style={styles.statusbar}></View>
            <View style={styles.paramRow}>
            <View style={styles.userControl}>
              <View style={styles.userDetail}>
              <Text style={styles.photoLabel}>
                分享您的美照
              </Text>
              </View>
                <Icon style={styles.icon} name="ios-paw-outline" size={40}  onPress={this.fetchRandomPhoto}/>
              </View>
          
            </View>
                   {this.state.avatarSource?
                        <Image source={this.state.avatarSource} style={styles.uploadAvatar} />
                  
                :null}

         
             <TextInput placeholder="说点什么吧" multiline={true} style={styles.publishInput} value={this.state.content} onChangeText={(text) => {
                            this.onTextContent("content",text)
                        }} autoFocus={true} onFocus={()=>{
                            this.setState({
               
                            })
                        }} onBlur={()=>{
                            this.setState({
             
                            })
                        }}  returnKeyType="done"/>

                         <TouchableHighlight onPress={this.submit} style={styles.publishSubmit} underlayColor="#eee">
                            <View ><Text style={styles.publishSubmitText}>提交</Text></View>
                        </TouchableHighlight>
                      
              <MessageTip ref="messageTip"/>
      </View>
    );
  }
});


var styles = StyleSheet.create({
   publishInput:{
        margin:15,
        height:100,
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

    },
    input:{
      marginLeft:10,
        marginRight:10,
        height:45,
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:5,
        paddingLeft:10,
        fontSize:18,
        color:"#666",
        marginBottom:20
    },

    button:{
        height:45,
        backgroundColor:"#46afe4",
        borderColor:"#46afe4",
        borderWidth:1,
       
        marginLeft:10,
        marginRight:10,
        alignItems:'center',
    },
    buttonText:{
        color:"#000",
        textAlign:"center",
        fontSize:16,
    },
    uploadAvatar:{
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        marginBottom:10,
        height:150,
        padding: 8,
        resizeMode: 'contain',
    },
     icon:{
    marginVertical:0,
    marginLeft:5,
    marginRight:10,
  },
    userControl:{
    flex:1,
    flexDirection:'row', 
    justifyContent:'flex-start',
    alignItems:'center',
  },
  userDetail:{
    flex:1,
    flexDirection:'row', 
    justifyContent:'flex-start',
    alignItems:'center',
  },
  contentContainer:{
    height:50,
  },
   tags_container:{
        flex:1,
        borderColor:"#fff",
        flexDirection:'row', 
        justifyContent:'flex-start',
        margin:5,
        alignItems:'center',
    },
    nav_tags:{
        margin:0,
        padding:0,
        marginLeft:10,
        marginRight:10,
        width:300,
        height:50,
        backgroundColor:'#ffff00',
    },
    nav_tag:{
        paddingLeft:13,
        paddingRight:13,
        height:40,
        width:40,
    },
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
  container: {
    flex: 1,
  },
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 8,
  },
  paramRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    marginLeft:10,
    marginRight:10,
    alignItems: 'center',
 
  },
  photoLabel: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    marginTop:5,
  },
  randomPhoto: {
    width: 50,
    height: 50,
  },
  textButton: {
    color: 'blue',
    alignItems:'center',
    marginTop:5,
  },
  addTextParamButton: {
    marginTop: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 3,
    borderColor: 'grey',
    borderWidth: 1,
    height: 30,
    paddingLeft: 8,
  },
  equalSign: {
    paddingHorizontal: 4,
  },
  uploadButton: {
    marginTop: 16,
  },
  uploadButtonBox: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  uploadButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  label: {
    flex: 1,
    color: '#aaa',
    fontWeight: '500',
    height: 20,
  },
  textOutput: {
    flex: 1,
    fontSize: 17,
    borderRadius: 3,
    borderColor: 'grey',
    borderWidth: 1,
    height: 200,
    paddingLeft: 8,
  },
});

AppRegistry.registerComponent('Share', () => Share);

module.exports = Share;
