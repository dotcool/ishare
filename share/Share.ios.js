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
var {
  AppRegistry,
  AlertIOS,
  CameraRoll,
  Image,
  LinkingIOS,
  PixelRatio,
  ProgressViewIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;


var PAGE_SIZE = 20;

class FormUploader extends React.Component {

  _isMounted: boolean;
  _fetchRandomPhoto: () => void;
  _addTextParam: () => void;
  _upload: () => void;

  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      uploadProgress: null,
      randomPhoto: null,
      textParams: [],
    };
    this._isMounted = true;
    this._fetchRandomPhoto = this._fetchRandomPhoto.bind(this);
    this._addTextParam = this._addTextParam.bind(this);
    this._upload = this._upload.bind(this);

    this._fetchRandomPhoto();
  }

  _fetchRandomPhoto() {
    CameraRoll.getPhotos(
      {first: PAGE_SIZE},
      (data) => {
        if (!this._isMounted) {
          return;
        }
        var edges = data.edges;
        var edge = edges[Math.floor(Math.random() * edges.length)];
        var randomPhoto = edge && edge.node && edge.node.image;
        if (randomPhoto) {
          this.setState({randomPhoto});
        }
      },
      (error) => undefined
    );
  }

  _addTextParam() {
    var textParams = this.state.textParams;
    textParams.push({name: '', value: ''});
    this.setState({textParams});
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _onTextParamNameChange(index, text) {
    var textParams = this.state.textParams;
    textParams[index].name = text;
    this.setState({textParams});
  }

  _onTextParamValueChange(index, text) {
    var textParams = this.state.textParams;
    textParams[index].value = text;
    this.setState({textParams});
  }

  _upload() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8088/api/reaming/publish');
    xhr.onload = () => {
      this.setState({isUploading: false});
      if (xhr.status !== 200) {
        AlertIOS.alert(
          'Upload failed',
          'Expected HTTP 200 OK response, got ' + xhr.status
        );
        return;
      }
      if (!xhr.responseText) {
        AlertIOS.alert(
          'Upload failed',
          'No response payload.'
        );
        return;
      }
      var index = xhr.responseText.indexOf('http://localhost:8088/');
      if (index === -1) {
        AlertIOS.alert(
          'Upload failed',
          'Invalid response payload.'
        );
        return;
      }
      var url = xhr.responseText.slice(index).split('\n')[0];
      LinkingIOS.openURL(url);
    };
    var formdata = new FormData();
    if (this.state.randomPhoto) {
      formdata.append('image', {...this.state.randomPhoto, name: 'image.jpg'});
    }
    this.state.textParams.forEach(
      (param) => formdata.append(param.name, param.value)
    );
    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        console.log('upload onprogress', event);
        if (event.lengthComputable) {
          this.setState({uploadProgress: event.loaded / event.total});
        }
      };
    }
    xhr.send(formdata);
    this.setState({isUploading: true});
  }

  render() {
    var image = null;
    if (this.state.randomPhoto) {
      image = (
        <Image
          source={this.state.randomPhoto}
          style={styles.randomPhoto}
        />
      );
    }
    var textItems = this.state.textParams.map((item, index) => (
      <View style={styles.paramRow}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={this._onTextParamNameChange.bind(this, index)}
          placeholder="name..."
          style={styles.textInput}
        />
        <Text style={styles.equalSign}>=</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={this._onTextParamValueChange.bind(this, index)}
          placeholder="value..."
          style={styles.textInput}
        />
      </View>
    ));
    var uploadButtonLabel = this.state.isUploading ? 'Uploading...' : 'Upload';
    var uploadProgress = this.state.uploadProgress;
    if (uploadProgress !== null) {
      uploadButtonLabel += ' ' + Math.round(uploadProgress * 100) + '%';
    }
    var uploadButton = (
      <View style={styles.uploadButtonBox}>
        <Text style={styles.uploadButtonLabel}>{uploadButtonLabel}</Text>
      </View>
    );
    if (!this.state.isUploading) {
      uploadButton = (
        <TouchableHighlight onPress={this._upload}>
          {uploadButton}
        </TouchableHighlight>
      );
    }
    return (
      <View>
        <View style={[styles.paramRow, styles.photoRow]}>
          <Text style={styles.photoLabel}>
            Random photo from your library
            (<Text style={styles.textButton} onPress={this._fetchRandomPhoto}>
              update
            </Text>)
          </Text>
          {image}
        </View>
        {textItems}
        <View>
          <Text
            style={[styles.textButton, styles.addTextParamButton]}
            onPress={this._addTextParam}>
            Add a text param
          </Text>
        </View>
        <View style={styles.uploadButton}>
          {uploadButton}
        </View>
      </View>
    );
  }
}
var Share = React.createClass({
    render: function() {
    return <FormUploader/>;
  }
});

var styles = StyleSheet.create({
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
    alignItems: 'center',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: 'grey',
  },
  photoLabel: {
    flex: 1,
  },
  randomPhoto: {
    width: 50,
    height: 50,
  },
  textButton: {
    color: 'blue',
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
