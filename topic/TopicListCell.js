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
var TopicListCell = React.createClass({


    render: function() {
        return (
            <View>
                <TouchableHighlight onPress={this.props.onSelect}>
                    <View style={styles.row}>
                        {/* $FlowIssue #7363964 - There's a bug in Flow where you cannot
                         * omit a property or set it to undefined if it's inside a shape,
                         * even if it isn't required */}
                        <View style={styles.textContainer}>
                            <View style={styles.content}>
                                <View style={styles.left_content} >
                                    <Image
                                        style={styles.icon}
                                        source={{uri: this.props.topic.user_headpic}}
                                        />


                                </View>
                                <View style={styles.right_content}>
                                    <Text style={styles.desc} numberOfLines={1}>
                                        {this.props.topic.user_nick}  {this.props.topic.publish_time}
                                    </Text>
                                    <Text style={styles.title} numberOfLines={2}>
                                        {this.props.topic.title}
                                    </Text>

                                </View>
                            </View>

                            <View style={styles.count_container}>
                                <View style={styles.count_item}>
                                    <Icon name="ios-heart-outline" size={20} color="#999" />
                                    <Text style={{fontSize:12,color:"#999",marginLeft:4,lineHeight:15}}>{this.props.topic.zan_count}</Text>
                                </View>
                                <TouchableHighlight onPress={this.props.showCommit} underlayColor="#fff">
                                    <View style={styles.count_item}>

                                        <Icon name="ios-chatboxes-outline" size={20} color="#999" />
                                        <Text style={{fontSize:12,color:"#999",marginLeft:4,lineHeight:15}}>{this.props.topic.comment_count}</Text>

                                    </View>
                                </TouchableHighlight>

                            </View>
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
        paddingBottom:5
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        paddingTop:10,
        paddingLeft:5,
        paddingBottom:7,
        paddingRight:5
    },
    content:{
        flex:1,
        flexDirection:"row",
    },
    descContainer:{
        flex:1,
        flexDirection:"row",
        paddingTop:5,
        paddingLeft:5,
        paddingBottom:5,
    },
    left_content:{
        width:50,
        height:50
    },
    desc:{
        fontSize: 12,
        fontWeight: '200',
        color:"#999999",
        marginLeft:5,

    },
    icon:{
        width:40,
        height:40,
        borderRadius:20,
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
        bottom:5,
        flexDirection:"row",
    },
    count_item:{
        height:20,
        marginLeft:15,
        flexDirection:"row",
    }
});

module.exports = TopicListCell;
