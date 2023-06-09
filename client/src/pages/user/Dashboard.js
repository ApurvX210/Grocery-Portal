import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/Auth'

const Dashboard = () => {
  const[auth]=useAuth();
  return (
    <Layout title="Dashboard - BuyFresh">
      <div className='container-fluid m-4 p-4'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu/>
          </div>
          <div className='col-md-9'>
            <div className='card w-75 p-3' style={{background: "#74cdcd" }}>
              <h3 style={{color: "#0a5c5f"}}>Name : {auth?.user?.name}</h3>
              <h3 style={{color: "#0a5c5f"}}>Email : {auth?.user?.email}</h3>
              <h3 style={{color: "#0a5c5f"}}>Contact : {auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard