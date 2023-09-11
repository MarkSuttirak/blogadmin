const LoadingCircle = ({size,innerSize}) => {
  return (
    <div id="loading-icon" style={{width:size + "px",height:size + "px"}}>
      <div class="inner-icon" style={{width:innerSize + "px",height:innerSize + "px",transform:'translate(0, ' + ((size - innerSize) / 2) + 'px)'}}></div>
    </div>
  )
}

export default LoadingCircle;