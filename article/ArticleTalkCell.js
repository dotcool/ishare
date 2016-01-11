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
var Icon = require('react-native-vector-icons/Ionicons');
var moment = require("moment");
var {
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} = React;

var colors = ["#ef6f67","#46afe4","#81cc7a","#00cbbd"]
var random_color = function(){
  return colors[Math.floor(Math.random()*colors.length)]
}
var ArticleTalkCell = React.createClass({

//onPress={this.props.onSelect}
  render: function() {
    console.log(this.props.talk);
        var publishtime=null;
        if (this.props.talk.time) {
          publishtime=new Date(parseInt(this.props.talk.time)).toLocaleTimeString();
        };

    return (
      <View>
        <TouchableHighlight onPress={this.props.onSelect}>
          <View style={styles.row}>
            {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
              * omit a property or set it to undefined if it's inside a shape,
              * even if it isn't required */}
            <View style={styles.textContainer}>

              <View style={styles.nameContainer} >
                <Image
                    style={styles.icon}
                    source={{uri: this.props.talk.user_image}}
                    />
                <Text style={styles.title} numberOfLines={1}>
                  {this.props.talk.user_name} <Text style={{fontSize:12,color:"#ccc",marginLeft:20}}>{publishtime}</Text>
                </Text>

              </View>
              <Text style={styles.html} numberOfLines={1}>
                {this.props.talk.content.replace(/<[^>]+>/g,"\n").replace(/\n+/g,"\n").replace(/^\n|\n$/g,"")}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingLeft:8,
    paddingRight:5,
    color:"#ef6f67",
    paddingTop:3
  },
  nameContainer:{
    flex:1,
    flexDirection:"row",
    paddingTop:5,
    paddingLeft:5,
    paddingBottom:10
  },
  html:{
    fontSize: 14,
    fontWeight: '200',
    color:"#666",
    marginLeft:5,
    marginRight:10,
    marginBottom:5,
    marginTop:5
  },
  icon:{
    width:20,
    height:20,
    borderRadius:10,
  },
  movieYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
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
    marginRight:7,
    marginBottom:5,
    paddingTop:2,
    paddingBottom:2,
    paddingLeft:1,
    paddingRight:3,
    borderRadius:2,
    overflow:"hidden",
    opacity:0.7,
    backgroundColor:"#ff0000"
  },
  count_container:{
    position:"absolute",
    right:5,
    bottom:0,
    flexDirection:"row",
  },
  count_item:{
    height:15,
    marginLeft:10,
    flexDirection:"row",
  }
});

module.exports = ArticleTalkCell;
