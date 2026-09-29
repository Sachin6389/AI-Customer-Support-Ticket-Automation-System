import{Router}  from 'express'
import{AdminaddProduct,
  AdminlistOfProducts,
  AdminsingleProduct,
  AdminUpdateProduct,
  AdminremoveProduct,
} from "../controlers/product.controler.js"
import { upload } from '../middleware/multer.js'
import {adminAuth} from '../middleware/admin.auth.js'
import { verifyjwt } from "../middleware/auth.middleware.js"

const routerofProduct= Router()
routerofProduct.route("/all-products").get(AdminlistOfProducts)
routerofProduct.route("/add-product").post( upload.fields([
        {
        name:"top",
        maxCount:1
    },
      {
        name:"bottom",
        maxCount:1
    },
      {
        name:"front",
        maxCount:1
    },
      {
        name:"back",
        maxCount:1
    },
    ]),AdminaddProduct)
routerofProduct.route("/delete").delete(AdminremoveProduct)
routerofProduct.route("/product/:productId").get(AdminsingleProduct)
routerofProduct.route("/update").post(upload.fields([
       {
        name:"top",
        maxCount:1
    },
      {
        name:"bottom",
        maxCount:1
    },
      {
        name:"front",
        maxCount:1
    },
      {
        name:"back",
        maxCount:1
    },
        
    ]),AdminUpdateProduct)
   
export default routerofProduct