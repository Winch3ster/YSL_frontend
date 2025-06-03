import React from 'react'

const StandardButton = (props) => {
  return (
   <button class={` ${props.danger ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"}  text-white font-bold py-2 px-8 rounded-full cursor-pointer`} onClick={props.onClick}>
        {props.label}
    </button>    
  )
}

export default StandardButton