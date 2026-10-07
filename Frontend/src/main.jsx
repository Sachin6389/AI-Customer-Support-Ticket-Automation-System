import React from 'react'
import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store  from '../src/Storage/StorageData.js'
import ChangedPassword from '../src/pages/ChangedPassword.jsx'
import Profile from '../src/pages/Profile.jsx'
import EditProfile from '../src/pages/EditProfile.jsx'

import ReactDOM from 'react-dom/client'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import Home from '../src/pages/Home.jsx'
import  Login  from "../src/Components/Login.jsx"
import AuthLayout from "../src/Components/Protector/AuthLayout.jsx"
import About from '../src/pages/About.jsx'
import Signup from '../src/Components/Signup.jsx'
import Contact from '../src/pages/Contact.jsx'
import Product from '../src/pages/Product.jsx'
import Carts from '../src/pages/Carts.jsx'
import OrderPlace from '../src/pages/OrderPlace.jsx'
import Order from '../src/pages/Order.jsx'
import Collection from '../src/pages/Collection.jsx'
import SearchBAr from '../src/Components/SearchBar.jsx'
import Logout from '../src/Components/Header/Logout.jsx'
import Verify from '../src/pages/Verify.jsx'
import AdminLogin from "../src/Components/AdminLogin.jsx"
import AdminDeshboard from './pages/AdminDeshboard.jsx'
import AddProduct from './pages/AddProduct.jsx'
import GetOrderList from './pages/GetOrderList.jsx'
import ListOfProduct from './pages/ListOfProduct.jsx'
import  AdminUpdateProduct  from './pages/UpdateProduct.jsx'
import Complain from './Components/Complain.jsx'
import Document from './Components/Document.jsx'
import GetComplain from './Components/GetComplain.jsx'





const router=createBrowserRouter([
  { path:"/",
    element:<App/>,
    children:[
      { index: true, element: <Home /> },
      {
        path:"/Home",
        element:<Home/>,
      },
      {
        path:"/verify",
        element:<Verify/>

      },
      {
        path:"/login",
        element:(
          <AuthLayout authentication>
            <Login/>
            </AuthLayout>
        ),
      },
      
      {
        path:"/signup",
        element:(
          <AuthLayout authentication>
            <Signup/>
          </AuthLayout>
        ),
      },
      {
        path:"/admin/login",
        element:(
          <AuthLayout authentication>
            <AdminLogin/>
          </AuthLayout>
          
            
          
        ),
      },
      {
        path:"/Dashboard",
        element:(
          <AuthLayout authentication>
            <AdminDeshboard/>
          </AuthLayout>
          
            
          
        ),
      },
      {
        path:"/orderlist",
        element:(
          <AuthLayout authentication>
            <GetOrderList/>
          </AuthLayout>
          
            
          
        ),
      },
      {
        path:"/Document-upload",
        element:(
          <AuthLayout authentication>
            <Document/>
          </AuthLayout>
          
            
          
        ),
      },
      {
        path:"/update",
        element:(
          <AuthLayout authentication>
            <AdminUpdateProduct/>
          </AuthLayout>
          
            
          
        ),
      },
      {
        path:"/complain",
        element:(
          <AuthLayout authentication>
            <Complain/>
          </AuthLayout>
          
            
          
        ),
      },
      {
        path:"/add",
        element:(
          <AuthLayout authentication>
            <AddProduct/>
          </AuthLayout>
          
            
          
        ),
      },
      {
        path:"/products",
        element:(
          <AuthLayout authentication>
            <ListOfProduct/>
          </AuthLayout>
          
            
          
        ),
      },
      {
        path:"/about",
        element:(
          <AuthLayout authentication>
            {""}
           <About/>
          </AuthLayout>
        ),
      },
      {
        path:"/user-complain",
        element:(
          <AuthLayout authentication>
            {""}
           <GetComplain/>
          </AuthLayout>
        ),
      },
      {
        path:"/profile",
        element:(
          <AuthLayout authentication>
            {""}
           <Profile/>
          </AuthLayout>
        ),
      },
      {
        path:"/EditProfile",
        element:(
          <AuthLayout authentication>
            {""}
           <EditProfile/>
          </AuthLayout>
        ),
      },
      {
        path:"/contact",
        element:(
          <AuthLayout authentication>
            {""}
           <Contact/>
          </AuthLayout>
        ),
      },
     
       {
        path:"/changed-password",
        element:(
          <AuthLayout authentication>
            {""}
            <ChangedPassword/>
          </AuthLayout>
        ),
      },
      {
        path:'/product/:productId',
        element:(
          
            <Product/>
          
        ),
      },
      {
        path:'/cart',
        element:(
          <AuthLayout authentication>
            {""}
            
            <Carts/>
          </AuthLayout>
        ),
      },
      {
        path:'/place-order',
        element:(
          <AuthLayout authentication>
            {""}
            <OrderPlace/>
          </AuthLayout>
        ),
      },
      {
        path:'/orders',
        element:(
          <AuthLayout authentication>
            {""}
            <Order/>
          </AuthLayout>
        ),
      },
       {
        path:'/collection',
        element:(
          <AuthLayout authentication>
            {""}
            <Collection/>
          </AuthLayout>
        ),
      },
      {
        path:'/search',
        element:(
          <AuthLayout authentication>
            {""}
            <SearchBAr/>
          </AuthLayout>
        ),
      },
        {
        path:'/logout',
        element:(
          <AuthLayout authentication>
            {""}
            <Logout/>
          </AuthLayout>
        ),
      },
      
      
      
    ],
     }
])







ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      
    <RouterProvider router={router}/>
    </Provider>
    
  </StrictMode>,
)