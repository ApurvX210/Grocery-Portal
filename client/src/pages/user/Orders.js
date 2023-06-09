import React, { useState, useEffect } from 'react'
import UserMenu from '../../components/Layout/UserMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import moment from 'moment'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  //get orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [])
  return (
    <Layout title="Dashboard - Orders">
      <div className='container-fluid m-4 p-4'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <h1 className='text-center' style={{color: "#0a5c5f"}}>All Orders</h1>
            {
              orders?.map((o, i) => {
                return (
                  <div className='border shadow'>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th scope='col'>#</th>
                          <th scope='col'>Status</th>
                          <th scope='col'>Buyer</th>
                          <th scope='col'>Order Date</th>
                          <th scope='col'>Payment</th>
                          <th scope='col'>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{o?.status}</td>
                          <td>{o?.buyer?.name}</td>
                          <td>{moment(o?.createdAt).fromNow()}</td>
                          <td>{o?.payment.success ? "Success" : "Failed"}</td>
                          <td>{o?.products?.length}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className='container'>
                      {o?.products?.map(p => {
                        return <div className="row card mb-2 p-3 flex-row">
                          <div className="col-md-2">
                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-image/${p._id}`} className="card-img-top" alt={p.name} height={200} width={200} />
                          </div>
                          <div className="col-md-4">
                            <p>Name : {p.name}</p>
                            <p>Description : {p?.description?.substring(0, 30)}</p>
                            <p>Price : ${p.price}</p>
                          </div>
                        </div>
                      })}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Orders