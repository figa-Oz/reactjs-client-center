import React , { useEffect, useState } from 'react'

// MODULE
import axios from 'axios'

// API
import { SWAGGER_URL } from '../../../Support/API_URL'

// HELPER
import moneyConvert from '../../../Support/moneyConvert'

// STYLE
import './style.css'

function FirstContent () {

    // LOCAL STATE DATA ORDER
    const [order,setOrder] = useState(null)

    // PRICE
    const [price,setPrice] = useState(0)
    const [sale,setSale] = useState(0)
    const [diskon,setDiskon] = useState(0)

    useEffect(()=>{

        let priceNum = 0
        let saleNum = 0
        // GET ORDER
        axios({
            method : "GET",
            url : `${SWAGGER_URL}/orders/self`,
            headers : {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(({data})=>{
            console.log(data.data[0] , ' DATA ORDER')
            let arr = data.data[0].items
            let bumpArr = []
            // ecommerce
            arr.forEach(e=>{
                priceNum += e.product_info.price
                saleNum += e.product_info.sale_price
                saleNum += e.bump_price
                if (e && e.product_info && e.product_info.bump) {
                    bumpArr.push(...e.product_info.bump)
                }
                // setBump(bumpArr)
                // setPrice(priceNum)
                // setSale(saleNum)
                // e = {...e,isChecked : true}
            })
            setPrice(priceNum)
            setSale(saleNum)
            setDiskon(priceNum - saleNum)
            console.log(data.data[0] , ' <<< DATA ORDER >>>>')
            setOrder(data.data[0])
        })
        .catch(err=>{
            console.log(err ,  ' <<< ERROR GET ORDER LIST')
        })
    },[])

    let renderItems = () => {
        return order.items.map((e,index)=>{
            let arr = []
            arr.push(
                <div>
                    <span>{e.product_info.name}</span>
                    <span>
                        {
                            e.product_info.sale_price  && moneyConvert(e.product_info.sale_price  ? e.product_info.sale_price.toString() : "" ,"Rp. ")
                        }
                    </span>
                </div>
            )
            if (e.is_bump) {
                arr.push(
                    <div>
                        <span>{e.product_info.bump[0] && e.product_info.bump[0].bump_name}</span>
                        <span>
                            {
                                e.product_info.bump[0]  && moneyConvert(e.product_info.bump[0].bump_price  ? e.product_info.bump[0].bump_price.toString() : "" ,"Rp. ")
                            }
                        </span>
                    </div>
                )
            }
            return arr
        })
    }

    let renderCoupon = () => {
        if (order &&order.coupon) {
            let e1 = order.coupon
            let { value , max_discount } = e1
            console.log(sale , ' <<< EL DI TF')
            let disk = Math.ceil((value / 100) * sale)
            if (disk > max_discount ) {
                disk = max_discount
            }
            return disk
        }else {
            return 0
        }
    }

    return (
        <div className="transfer-08-fc">
            <div className="transfer-08-fc-1">
                <h3>
                    Kelas
                </h3>
            </div>
            <div className="transfer-08-fc-2">
                {
                    order && renderItems()
                }
                
                <div>
                    <span>{order&&order.coupon.name}</span>
                    <span>{diskon && moneyConvert(renderCoupon() ? renderCoupon().toString() : "" ,"Rp. ")}</span>
                </div>
                <div className="transfer-08-fc-2-line">

                </div>
                <div>
                    <b>Silahkan Transfer</b>
                    <b>{sale &&  moneyConvert(sale ? (sale-renderCoupon()).toString() : "" ,"Rp. ")}</b>
                </div>
            </div>
        </div>
    )

}

export default FirstContent