import React, {Component} from 'react';
import CashfreePG from 'cashfreereactnativepg';

export default class CallCashfree extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: true,
        }
    }

    getToken = () =>{
        try{
            const {orderId, orderAmount} = this.props.stateObj;
            const orderCurrency = "INR";        
            const tokenUrl = "https://test.cashfree.com/api/v2/cftoken/order";
            fetch(tokenUrl, {
                method: 'POST',
                cache: 'no-cache',
                headers:  {
                    'Content-Type': 'application/json',
                    'x-client-id': '275432e3853bd165afbf5272',
                    'x-client-secret': '2279c0ffb9550ad0f9e0652741c8d06a49409517'
                },
                body:JSON.stringify({
                    orderId,
                    orderAmount,
                    orderCurrency
                })
                
            }).then((result => {
                return result.json()  
            })

        }
        catch(err){
            const {onPayment} = this.props;
            console.log("err caught in getting token");
            console.log(err);
            const errorObj = {
                txStatus: "Failure-Internal",
                err: err,
            }
            onPayment(errorObj);
        }
    }
} 