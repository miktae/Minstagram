function momentfromNow(date) {

    var seconds = Math.floor((new Date() - date) / 1000); 
    // convert to seconds
  
    var interval = seconds / 31536000;
    // a year has 60*60*24*365 seconds
  
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    // a month has 60*60*24*30 seconds
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    // a day has 60*60*24 seconds
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    // an hour has 60*60 seconds
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    // a minute has 60 seconds
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

function converttoDateandTime(t) {
    var d = new Date(t * 1000);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    var time =  d.toLocaleString();
    return time;
}
  export { momentfromNow, converttoDateandTime }