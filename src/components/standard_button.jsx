import React from 'react'

const StandardButton = (props) => {
  return props.secondary ?
  (
    <button type="button" class="py-2 px-8 rounded-full cursor-pointer text-sm text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
    onClick={props.onClick}
    >
      {props.label}
    </button>
  )
  :
  (
   <button class={` ${props.danger ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"} text-white font-bold py-2 px-8 rounded-full cursor-pointer`} onClick={props.onClick}>
        {props.label}
    </button>    
  )
}

export default StandardButton