/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var MainTabBar = require("./MainTabBar.js")
var {
    AppRegistry,
    StyleSheet,
    NavigatorIOS,
    TabBarIOS,
    StatusBarIOS
    } = React;

var iShare = React.createClass({

    render:function(){
        StatusBarIOS&&StatusBarIOS.setStyle("light-content", true)
        //TabBarIOS.set
        return (
        <NavigatorIOS
            initialRoute={{
                          component:MainTabBar
                        }}
            navigationBarHidden={true}
            style={styles.container}
            />

        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});


AppRegistry.registerComponent('iShare', () => iShare);
