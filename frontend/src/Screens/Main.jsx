import React from 'react'
import SideBar from '../components/SideBar'

import FirstComp from '../components/FirstComp'
const Main = () => {
  return (
    <div className='bg-[#f0f0f0] flex items-center gap-5 justify-center h-screen p-5'>
        <SideBar/>

          <FirstComp />
      </div>
  )
}

export default Main