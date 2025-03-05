import React, { useState } from 'react'

const NavBar = () => {
    const [active,setActive] = useState('Home')

    const navItems=[
        {
            label:"Home"
        },{
            label:"Projects"
        },
        {
            label:"Skills"
        },{
            label:"Contact"
        }
    ]   

    const handleNavigation = (id:string)=>{
setActive(id)
const section = document.getElementById(id.toLowerCase())
if(section){
    section.scrollIntoView({behavior:'smooth'})
}
    }
  return (
    <div className='w-full flex justify-center h-20 items-center'>
    <div className='w-fit transition-all duration-200 hover:scale-110 rounded-full fixed z-50 h-10 items-center gap-1 justify-evenly px-3 py-5 flex bg-gray-800'>{
        navItems.map((item)=>(
            <a className={`py-0 px-2 transition-all duration-75  hover:cursor-pointer  rounded-full active:bg-indigo-700 ${active===item.label?`bg-indigo-600 rounded-full `:`hover:scale-110 hover:bg-opacity-40 hover:bg-indigo-600`}`} onClick={()=>handleNavigation(item.label)}  href={`#${item.label.toLowerCase()}`} key={item.label+"key"}>
                {item.label}
            </a> 
        ))
    }</div>
    </div>
  )
}

export default NavBar