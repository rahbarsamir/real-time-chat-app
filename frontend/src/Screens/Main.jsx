import React from 'react'
import SideBar from '../components/SideBar'
import MessageDisplay from '../components/MessageDisplay'
import FirstComp from '../components/FirstComp'
const Main = () => {
  return (
    <div className='bg-[#f0f0f0] flex items-center gap-5 justify-center h-screen p-5'>
        <SideBar/>

        {/* <MessageDisplay currentUser="sam" chatUser="anas" /> */}
        {/* <MessageDisplay currentUser="anas" chatUser="sam" /> */}

          <FirstComp />
      </div>
  )
}

export default Main