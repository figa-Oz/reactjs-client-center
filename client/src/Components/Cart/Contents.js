import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { getCart, removeCart } from '../../Redux/Actions/CartAction';
import { addToOrder } from '../../Redux/Actions/OrderAction';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { fetchAddress, fetchAddressById } from '../../Redux/Actions/ProfileAction';

const items = [];

const Contents = () => {
    const dispatch = useDispatch();

    const cartList = useSelector((state) => state.cart.cartList);
    const orderSuccess = useSelector((state) => state.order.success);
    const addressData = useSelector((state) => state.profile.addressList);
    console.log(`cartList: ${cartList}`);

    const [update, setUpdate] = useState(false);
    const [ticked, setTicked] = useState({
        items: items,
    });

    const handleTickedChild = (e) => {
        const { id, checked } = e.target;
        if (checked) {
            items.push({
                product_id: id,
            });
        } else {
            for (let i = 0; i < items.length; i++) {
                if (items[i].product_id === id) {
                    items.splice(i, 1);
                }
            }
        }
        setTicked(items);
        console.log(ticked);
    };

    useEffect(() => {
        dispatch(getCart());
        if (update) {
            setUpdate(false);
        }
    }, [dispatch, update]);

    useEffect(() => {
        dispatch(fetchAddress());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchAddressById(addressData._id));
    }, [dispatch, addressData._id]);

    const addressById = useSelector((state) => state.profile.addressById);
    // console.log('cart page', addressById._id);

    const rounded = (num) => {
        let roundedString = num.toFixed(2);
        let round = Number(roundedString);
        return round;
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        })
        .then((res) => {
            if (res.value) {
                Swal.fire(
                    'Deleted!',
                    'Product has been deleted.',
                    'success',
                );
                dispatch(removeCart(id));
                setUpdate(true);
                window.location.reload();
            }
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const renderCart = () => {
        if (cartList.length === 0) {
            return (
                <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            );
        }
        return cartList.map((val,index) => {
            return (
                <tr key={index} value={val.product_info}>
                    <td>
                        <input
                            type="checkbox"
                            id={val.product_info}
                            onChange={handleTickedChild}
                        />
                    </td>
                    <td>
                        {val.product_info.name}<br/>
                        TYPE : {val.product_info.type}
                    </td>
                    <td>
                        Rp. {val.product_info.price.toLocaleString('id-ID')}
                    </td>
                    <td>
                        Hemat {rounded(100-((val.product_info.sale_price/val.product_info.price)*100))}%
                    </td>
                    <td>
                        Rp. {val.product_info.sale_price.toLocaleString('id-ID')}
                    </td>
                    <td>
                        {
                            val.product_info.type === 'ecommerce'
                            ?
                            <input type='number' defaultValue={1} />
                            :
                            '1'
                        }
                    </td>
                    {/* <td>
                        {val.quantity}
                    </td>
                    <td>
                        {val.product_info}
                    </td> */}
                    <td>
                        <Button variant="outline-danger" onClick={() => handleDelete(val.product_info)}>
                            Remove
                        </Button>
                    </td>
                </tr>
            );
        });
    };

    const renderBump = () => {
        return cartList.map((val,index) => {
            const bumps = val.product_info.bump;
            return bumps.map((item, idx) => {
                return (
                    <div style={bump.box}>
                        <div style={bump.topSection}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={tickedBump}
                                        onClick={handleChangeTicked}
                                    />
                                }
                                label={
                                    <span style={{fontSize: '1.15rem', fontWeight:'500'}}>
                                        {item.bump_name}
                                    </span>
                                }
                                style={bump.tickBump}
                            />
                        </div>
                        <div style={bump.content}>
                            <img src={item.bump_image} alt='gambar bump' style={bump.contentImage} />
                            <div style={bump.contentText}>
                                <div style={bump.contentTitle}>
                                    {item.bump_name}
                                </div>
                                <div style={bump.contentDescription}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec semper tincidunt sodales. Vestibulum venenatis porttitor lorem, quis finibus velit viverra ac. Ut a varius nulla. Nam tempus dapibus leo non vulputate. Fusce id mi ipsum. Nam in dui laoreet, lobortis ligula at, scelerisque mi. Cras nec nunc magna. Proin blandit viverra dui. Fusce tempor dignissim lorem vel tincidunt.
                                </div>
                            </div>
                        </div>
                        <div style={bump.bottomSection}>
                            <span style={bump.footerTxt}>
                                Footer for : {item.bump_name}
                            </span>
                        </div>
                    </div>
                );
            });
        });
    };

    const [tickedBump, setTickedBump] = useState(false);

    const handleChangeTicked = (e) => {
        setTickedBump(
            !tickedBump,
            e.target.checked,
        );
    };

    let totalCourse = cartList.length;
    let price = 0;
    let salePrice = 0;

    // if ('price' in cartList && 'sale_price' in cartList) {
        cartList.map((val,index) => {
            return(
                <div key={index}>
                    <div>
                        {price += val.product_info.price}
                    </div>
                    <div>
                        {salePrice += val.product_info.sale_price}
                    </div>
                </div>
            );
        });
    // }

    const handleStoreOrder = () => {
        dispatch(addToOrder(
            {
                items: ticked,
                shipment: {
                    address_id: `${addressById._id} address id reference from user address`
                }
            }
        ));
        console.log(
            `
                {
                    items: ${ticked},
                    shipment: {
                        address_id: "${addressById._id} address id reference from user address"
                    }
                }
            `
        );
    };

    if (orderSuccess) {
        return (
            <Redirect to='payment' />
        );
    }
    return (
        <React.Fragment>
            {/* SHOPPING CART */}
            <div style={cart.container}>
                <div style={cart.title}>
                    Kelas yang Anda Ikuti
                </div>
                <div>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Sale Price</th>
                                <th>Quantity</th>
                                <th>Action</th>
                                {/* <th>Quantity</th>
                                <th>Product Id</th>
                                <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {renderCart()}
                        </tbody>
                    </Table>
                </div>
            </div>
            {/* ORDER BUMP */}
            <div>
                <div style={bump.separator} />
                {renderBump()}
            </div>
            {/* SUMMARY */}
            <div style={summary.container}>
                <div style={summary.content}>
                    <div style={summary.names}>
                        <div style={summary.namesTxt}>
                            Course Taken
                        </div>
                        <div style={summary.namesTxt}>
                            Total Price
                        </div>
                        <div style={summary.namesTxt}>
                            Total Sale Price
                        </div>
                        <div style={summary.namesTxt}>
                            You Saved
                        </div>
                    </div>
                    <div style={summary.values}>
                        <div style={summary.valuesTxt}>
                            {totalCourse}
                        </div>
                        <div style={summary.valuesTxt}>
                            Rp. {price.toLocaleString('id-ID')}
                        </div>
                        <div style={summary.valuesTxt}>
                            Rp. {salePrice.toLocaleString('id-ID')}
                        </div>
                        <div style={summary.valuesTxt}>
                            Rp. {(price - salePrice).toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>
                <div style={summary.separator1} />
                <div style={summary.pay}>
                    <div style={summary.payTxt}>
                        Amount will be paid
                    </div>
                    <div style={summary.payNum}>
                        Rp. {salePrice.toLocaleString('id-ID')}
                    </div>
                </div>
                <div style={summary.separator1} />
                <div style={summary.choosePayBtn} onClick={handleStoreOrder}>
                    <div style={summary.btnTxt}>
                        PILIH METODE PEMBAYARAN
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const cart = {
    container: {
        margin: '0rem 10rem',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '1rem 0rem 0.75rem 0rem',
    },
};

const bump = {
    separator: {
        display: 'block',
        border: '.03125rem solid #dbdbdb',
        color: 'rgba(0,0,0,0.8)',
        lineHeight: '1.2',
        margin: '3rem 2.5rem 3rem 2.5rem',
        flex: 1,
    },
    box: {
        border: '0.25rem solid red',
        borderStyle: 'dashed',
        margin: '0rem 10rem 3rem 10rem',
        borderRadius: '1.5rem',
        height: '22.5rem',
    },
    topSection: {
        borderRadius: '1.3rem 1.3rem 0rem 0rem',
        borderBottom: '0.1rem solid #999999',
        backgroundColor: '#f3f3f3',
        height: '3.5rem',
        display: 'flex',
        alignItems: 'center',
    },
    tickBump: {
        marginTop: '0.25rem',
        marginLeft: '1rem',
    },
    content: {
        display: 'flex',
    },
    contentImage: {
        height: '15rem',
        width: '30rem',
    },
    contentText: {
        margin: '2rem 3rem',
    },
    contentTitle: {
        fontSize: '1.15rem',
        fontWeight: '600',
    },
    contentDescription: {
        marginTop: '0.5rem',
        fontSize: '0.9rem',
    },
    bottomSection: {
        borderRadius: '0rem 0rem 1.3rem 1.3rem',
        borderTop: '0.1rem solid #999999',
        backgroundColor: '#f3f3f3',
        height: '3.5rem',
        display: 'flex',
        alignItems: 'center',
    },
    footerTxt: {
        marginLeft: '2rem',
        fontSize: '1.1rem',
        color: '#8A8A8A',
    },
};

const summary = {
    container: {
        display: 'flex',
        height: '10rem',
        backgroundColor: '#f3f3f3',
    },
    content: {
        display: 'flex',
        margin: '0rem 3rem 0rem 10rem',
    },
    names: {
        display: 'flex',
        flexDirection: 'column',
        margin: '1.25rem 2rem 1.75rem 1rem',
    },
    namesTxt: {
        fontSize: '1.05rem',
        margin: '0.15rem 0rem',
    },
    values: {
        display: 'flex',
        flexDirection: 'column',
        margin: '1.25rem 1rem 1.75rem 2rem',
    },
    valuesTxt: {
        fontSize: '1.05rem',
        margin: '0.15rem 0rem',
    },
    separator1: {
        borderLeft: '0.1rem solid gray',
        margin: '1.25rem 0rem'
    },
    pay: {
        margin: '2rem 6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    payTxt: {
        fontSize: '1.25rem',
        fontWeight: '600',
        margin: '0.5rem 0.5rem 0.5rem 0.5rem',
    },
    payNum: {
        fontSize: '1.15rem',
        margin: '0.5rem 0.5rem 0.5rem 0.5rem',
    },
    choosePayBtn: {
        margin: 'auto 0rem',
    },
    btnTxt: {
        cursor: 'pointer',
        color: 'white',
        fontWeight: '600',
        fontSize: '1.5rem',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        margin: '0rem 2.75rem',
        backgroundColor: '#ff4500',
        boxShadow: '0 0 5px #ff4500',
    },
};

export default Contents;
