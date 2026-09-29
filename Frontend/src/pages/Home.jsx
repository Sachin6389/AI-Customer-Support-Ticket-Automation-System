import React from 'react'

import LatestCollation from '../Components/LatestCollection.jsx'
import Collection from './Collection.jsx'
import { useLocation } from 'react-router-dom'



function Home() {

    return (
        <div>
       <Collection/>
       <LatestCollation/>
       
       </div>
    )
}

export default Home