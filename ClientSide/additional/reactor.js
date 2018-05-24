function Reactor(){
    this.events = {};
  
    this.registerEvent = function(eventName){
      var event = new Event(eventName);
      this.events[eventName] = event;
    };
  
    this.dispatchEvent = function(eventName, eventArgs){
      for (var c in this.events[eventName].callbacks)
        this.events[eventName].callbacks[c](eventArgs);
    };
  
    this.addEventListener = function(eventName, callback){
      this.events[eventName].registerCallback(callback);
    };
  
    this.removeEventListeners = function(eventName){
  
    }
  }