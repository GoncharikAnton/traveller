import React, {useCallback, useContext, useEffect, useState, Suspense} from 'react';
import {AuthContext} from "../../../context/AuthContext";
import {getCart} from "../../../data_mining/getCart";
import {IntroCapTitle} from "../../../components/IntroCapTitle/IntroCapTitle";
import {CartItem} from "../../../components/CartItem/CartItem";
import {useSelector, useStore} from "react-redux";

import styles from "./CartPage.module.css"

const CartPage = () => {

    const auth = useContext(AuthContext)
    const [cart, setCart] = useState([])
    const store = useSelector(state => state.cart.cart)

    useEffect(
        () => {
            const data = getCart(auth.userId)
            data.then(data => {
                setCart([...data])
                // console.log(cart)
            })
            // console.log(auth)


        },
        [store],
    );


    return (
        <div className={'container'}>
            <IntroCapTitle capTitle={'Your order'}/>
            <ul className={`collection ${styles.ul_items}`}>
                {Object.keys(store).length === 0 && <h4>No tours in cart</h4>}
                {Object.keys(store).length > 0 &&
                    <li className="collection-item" key={store.tourId}>
                        <CartItem cart={cart} item={store} token={auth.token} inCart={true}/>
                    </li>
                }
            </ul>
            <IntroCapTitle capTitle={'Ordered tours'}/>
            <ul className={`collection ${styles.ul_items}`}>
                {cart.length === 0 && <h4>No orders yet</h4>}
                {cart && cart.map((i) => {
                    return <li className="collection-item" key={i._id}><CartItem item={i}/></li>

                })}
            </ul>
        </div>
    )
}

export default CartPage;