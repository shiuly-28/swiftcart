import React from 'react'


interface Ilocation{
  latitude:number,
  longitude:number
}

interface Iprops{
  userLocation:Ilocation,
  deliveryBoyLocation:Ilocation
}
function LiveMap({userLocation, deliveryBoyLocation}:Iprops) {
  return (
    <div>
 
    </div>
  )
}

export default LiveMap
