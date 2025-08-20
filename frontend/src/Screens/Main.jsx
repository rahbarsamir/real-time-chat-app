import React from 'react'
import SideBar from '../components/SideBar'
import MessageDisplay from '../components/MessageDisplay'
const Main = () => {
  return (
    <div className='bg-[#f0f0f0] flex justify-between h-screen p-5'>
        <SideBar/>
        <MessageDisplay currentUser="sam" chatUser="anas" />
        {/* <MessageDisplay currentUser="anas" chatUser="sam" /> */}

      </div>
  )
}

export default Main