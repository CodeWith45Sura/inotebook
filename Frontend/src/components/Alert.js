import React from 'react'

function Alert(props) {
    const captilize=(word)=>{
      if(word==='danger'){
        word='error';
      }
        const lower=word.toLowerCase();
        return lower.charAt(0).toUpperCase()+lower.slice(1);
    }
  return (
    <div style={{height: '30px', marginTop:'55px'}}>
   { props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
    <strong> {captilize(props.alert.type)} </strong>:{props.alert.msg}
    </div>  }
    </div>
  )
}

export default Alert