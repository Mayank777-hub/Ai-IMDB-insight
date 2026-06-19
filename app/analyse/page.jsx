import React from 'react'
import {Users,MousePointerClick,Clock,radar} from 'lucide-react'
import "../dash.css"
const dashboard = () => {
  return (
    <div className='upper'>
      <ul>
        <li className='up AUser'>
            <div>Active users</div>
            <span> 
                 <div className='Adata'>566</div>
                 <Users size={20}/>
            </span>
            </li>    
        <li className='up Tclicks'>
             <div>Total users</div>
            <span> 
                 <div className='Adata'>1906</div>
                 <MousePointerClick size={20}/>
            </span>
        </li>
        <li className='up Avgt'>
             <div>Active users</div>
            <span> 
                 <div className='Adata'>2m 10s</div>
                 <Clock size={20}/>
            </span>
            <p>Acc to pages</p>
        </li>
        <li className='up Mostv'>
               <div>Most Visited</div>
            <span> 
                 <div className='Adata'>/Search</div>
                 <Clock size={20}/>
            </span>
            <p>Acc to pages</p>
        </li>
      </ul>
    </div>
  )
}

export default dashboard
