var checklogin = function(session) {
  if(session.email){
    return true;
  }
  else {
    return false;
  }
}

module.exports = checklogin;
