import React from 'react'

const SizedBox = ({height=0, width=0}) => {
  return (
    <div style={{height: `${height}px`, width: `${width}px`}}></div>
  )
}

export default SizedBox