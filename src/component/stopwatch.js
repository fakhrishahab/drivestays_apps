
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

var StopWatch = React.createClass({
    getInitialState : function(){
      return{
        timeElapsed : null,
        startText : 'Start',
        lapTime : [] ,
        dataSource : ds.cloneWithRows([]),
        startTime : null
      }
    },
    render: function(){
      return(
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableHighlight style={styles.rundownWrapper}>
              <Text style={styles.rundown}>
                {formatTime(this.state.timeElapsed)}
              </Text> 
            </TouchableHighlight>
            <View style={styles.buttonWrapper}>
              {this.startStopButton()}
              {this.lapButton()}
            </View>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.laps}
            enableEmptySections={true}
            style={styles.footer}>
            {this.laps()}
          </ListView>
        </View>
      )
    },
    laps: function(time){
      // return this.state.lapTime.map(function(time, index){
      //   return(
      //       <View key={index} style={styles.lapTime}>
      //         <Text>{index + 1}</Text>
      //         <Text>{formatTime(time)}</Text>
      //       </View>
      //   )
      // })
      return <View style={styles.lapTime}>
        <Text>{formatTime(time)}</Text>
      </View>
    },
    startStopButton: function(){
      return (
        <TouchableHighlight onPress={this.startTimer} underlayColor='grey' style={[styles.button, this.border('black')]}>
          <Text>
            {this.state.running ? 'Stop' : 'Start'}
          </Text>
        </TouchableHighlight>
      )
    },
    lapButton: function(){
      return(
        <TouchableHighlight style={[styles.button, this.border('black')]} onPress={this.lapCLick}>
          <Text>
            Lap
          </Text>
        </TouchableHighlight>
      )
    },
    border: function(color){
      return {
        borderColor : color,
        borderWidth : 1
      }
    },
    lapCLick: function(){
      var arrLap = this.state.timeElapsed;
      this.setState({
        startTime : new Date(),
        lapTime : this.state.lapTime.concat([arrLap]),
        dataSource : this.state.dataSource.cloneWithRows(this.state.lapTime.concat([arrLap]))
      })

      console.log(this.state.lapTime);
    },
    startTimer: function(){
      this.setState({
        startTime : new Date()
      })

      if(this.state.running){
        clearInterval(this.interval);
        this.setState({running: false});
        return;
      }
      
      this.interval = setInterval(
        () => {
          this.setState({
            timeElapsed : new Date() - this.state.startTime,
            running : true
          })
        },
      30);
    
    }
});

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems : 'stretch'
  },
  header: {
    backgroundColor : 'red',
    flex: 1,
  },
  footer: {
    flex: 1,
  },
  rundownWrapper: {
    backgroundColor : 'pink',
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rundown : {
    color : 'blue',
    fontSize : 50
  },
  buttonWrapper: {
    flex:1,
    flexDirection : 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor : 'green'
  },
  button: {
    width : 100,
    height : 100,
    borderRadius : 50,
    justifyContent : 'center',
    alignItems : 'center'
  },
  lapTime : {
    paddingTop : 5,
    paddingBottom : 5,
    paddingLeft: 5,
    paddingRight : 5,
    justifyContent: 'space-around',
    flexDirection : 'row',
    backgroundColor : '#999999'
  }
})