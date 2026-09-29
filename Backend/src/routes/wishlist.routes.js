import{Router}  from 'express'
import {addToWishlist,getWishlist,removeWishlist}from "../controlers/wishlist.controler.js"
import { verifyjwt } from '../middleware/auth.middleware.js'
const wishlistrouter=Router()
wishlistrouter.get('/get',verifyjwt,getWishlist)
wishlistrouter.post('/add',verifyjwt,addToWishlist)
wishlistrouter.delete('/remove',verifyjwt,removeWishlist)
export default wishlistrouter