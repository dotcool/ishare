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
 * @providesModule AnExSet
 * @flow
 */
'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var {
  AppRegistry,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  Image,
    AlertIOS,
    TouchableHighlight,
} = React;

var AnExScroll = require('./search/AnExScroll');
var AnExTilt = require('./search/AnExTilt');
var config = require('./config.js');

  var AnExSet = React.createClass({
  
  getInitialState: function() {
        return {
      closeColor: this.randColor(),
      openColor: this.randColor(),
      dream:'一起来战斗吧',
      name:'可爱佳',
      age:'15',
      sex:null,
      head_pic:'',

    };
  },
randColor:function() {
      var colors = [0,1,2].map(() => Math.floor(Math.random() * 150 + 100));
      return 'rgb(' + colors.join(',') + ')';
    },
render: function() {
   
    return (
      <View style={styles.container}>
         <View style={styles.statusbar}></View>
          <View style={styles.stream}>
            <View style={styles.card}>
              
                    <Image source={this.state.head_pic} style={styles.uploadAvatar} />

               <Text style={styles.dreamText}>
                推荐理由：{this.state.dream} 
              </Text>
              <View style={styles.userControl}>
              <View style={styles.userDetail}>
               <Text style={styles.nameText}>
                {this.state.name}
              </Text>
                <Text style={styles.nameText}>
                {this.state.age}
              </Text>
               {this.state.sex=='male' ?<Icon style={styles.icon} name="man" size={20} color="#4F8EF7" />
               :<Icon style={styles.icon} name="woman" size={20} color="#e554f6"  />}
               
              </View>
                <Icon style={styles.icon} name="paper-airplane" size={20} color="green"  />

              </View>
            </View>

              <View style={styles.iconDetail}>
                <TouchableHighlight onPress={this._sad} underlayColor="#eee" style={styles.submit}>
                             <Icon name="android-sad" size={40} color="#fca659"/>
                        </TouchableHighlight>
                <TouchableHighlight onPress={this._happy} underlayColor="#eee" style={styles.submit}>
                             <Icon name="android-happy" size={40} color="#53c03d"/>
                        </TouchableHighlight></View>
            
             
          </View>
      
      </View>
    );
  },

   _happy:function(){
       this.queryOne('');
    },
       _sad:function(){
       this.queryOne('');
    },
   queryOne:function(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', config.host+'/api/user/recommend');
        xhr.onload = () => {
            setTimeout(() =>{
                this.setState({
                    isLoading:false
                })

            },500)

            var data = JSON.parse(xhr.responseText);
            if(data && data.success){

                var userOne = data.data;
                console.log(userOne.image)
                this.setState({
                    head_pic:{uri:userOne.image},
                    dream:userOne.dream,
                    name:userOne.name,
                    age:userOne.age,
                    sex:userOne.sex,
                })
               
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
        xhr.send();
    },

    componentDidMount: function() {
        this.queryOne('');
    },

  componentWillMount: function() {
    
    this.state.dismissY = new Animated.Value(0);
    this.state.dismissResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.props.isActive,
      onPanResponderGrant: () => {
        Animated.spring(this.props.openVal, {          // Animated value passed in.
          toValue: this.state.dismissY.interpolate({   // Track dismiss gesture
            inputRange: [0, 300],                      // and interpolate pixel distance
            outputRange: [1, 0],                       // to a fraction.
          })
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, {dy: this.state.dismissY}]              // track pan gesture
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) {
          this.props.onDismiss(gestureState.vy);  // delegates dismiss action to parent
        } else {
          Animated.spring(this.props.openVal, {
            toValue: 1,                           // animate back open if released early
          }).start();
        }
      },
    });
  },
});

var styles = StyleSheet.create({
      uploadAvatar:{
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        marginBottom:10,
        height:200,


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
  iconDetail:{
    flex:1,
    flexDirection:'row', 
    justifyContent:'space-between',
    alignItems:'center',
    marginLeft:40,
    marginRight:40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 18,
    height: 110,
  },
  icon:{
    marginVertical:0,
    marginLeft:5,
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
    nameText: {
    padding: 4,
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
});
AppRegistry.registerComponent('Search', () => AnExSet);
module.exports = AnExSet;
