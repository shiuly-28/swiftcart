import { auth } from '@/auth'
import EditRoleMobile from '@/components/EditRoleMobile'
import Navber from '@/components/Navber'
import connectDb from '@/lib/db'
import User from '@/models/user.models'
import { redirect } from 'next/navigation'
import AdminDashBoard from '@/components/AdminDashBoard'
import DeliveryBoy from '@/components/DeliveryBoy'
import UsersDashboard from '@/components/UsersDashboard'
import GeoUpdated from '@/components/GeoUpdated'
import Grocery, { IGrocery } from '@/models/grocery.model'
import Footer from '@/components/Footer'



async function Home(props:{
  searchParams:Promise<{
    q:string
  }>
}) {

  const searchParams=await props.searchParams
  // console.log(searchParams)
  
  await connectDb()
  const session=await auth()
  const user=await User.findById(session?.user?.id)
  // console.log(user)
  if(!user){
    redirect("/login")
  }
  const inComplete=!user.mobile || !user.role || (!user.mobile && user.
    role=="user")
    console.log(inComplete)
    if(inComplete){
      
      return<EditRoleMobile/>
    }
    const plainUser=JSON.parse(JSON.stringify(user))
  
    let groceryList:IGrocery[]=[]

    if(user.role==="user"){
      if(searchParams.q){
        groceryList=await Grocery.find({
          $or:[
            {name: {$regex: searchParams?.q || "", $options:"i" }},
            {name: {$regex: searchParams?.q || "", $options:"i" }},
          ]
        })
      }
      else{
        groceryList=await Grocery.find({})
      }
    }
    
  
  return (
    <>
      <Navber user={plainUser}/>
      <GeoUpdated userId={plainUser._id}/>
      {user.role == "user" ?(
        <UsersDashboard groceryList={groceryList}/>
      ): user.role == "admin" ? (
        <AdminDashBoard/>
      ) : <DeliveryBoy/> }
      <Footer/>
    </>
  )
}

export default Home
