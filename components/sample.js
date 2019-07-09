import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import CashfreePG from 'cashfreereactnativepg';
import base64 from 'base-64';



export default class Sample extends Component{
    constructor(){
        super();
        this.state ={
            order: {
                appId: '275432e3853bd165afbf5272',
                //appId: 'MTA2OTkyMDE1ODE0NDIyNTExNjYjIz',
                orderId: Math.floor(Math.random() * 10000),
                orderAmount: "100",
                orderCurrency: "INR",
                orderNote: "This is an order note",
                source: "reactsdk",
                customerName: "John",
                customerEmail: "abc@email.com",
                customerPhone: "1234561234",
                notifyUrl: "",
                paymentModes: "",
                env: "TEST",
                tokenData:"",
            },
            urlCalled: null,
            urlResponse: {},
            testData: null,
            eventData: null,
            count:0,
            modifyOrder: false,

        }
    }

    getToken = ()=>{
        try{
            const {orderId, orderAmount, orderCurrency} = this.state.order;        
            const tokenUrl = "https://test.cashfree.com/api/v2/cftoken/order";
            //const tokenUrl = "http://172.18.20.167:80/api/v2/cftoken/order";
            fetch(tokenUrl, {
                method: 'POST',
                cache: 'no-cache',
                headers:  {
                    'Content-Type': 'application/json',
                    'x-client-id': '275432e3853bd165afbf5272',
                    'x-client-secret': '2279c0ffb9550ad0f9e0652741c8d06a49409517'
                    //'x-client-id': 'MTA2OTkyMDE1ODE0NDIyNTExNjYjIz',
                    //'x-client-secret': '63ca0b83c8ca85d73fff9c3fd29a7c87e292fd63'
                },
                body:JSON.stringify({
                    orderId,
                    orderAmount,
                    orderCurrency
                })
            })
            .then((result)=>{
                console.log(result);
                return result.json()
            })
            .then((response)=>{
                // this.setState({urlCalled: true, urlResponse: response});
                return response;
            }).then((response)=>{
                console.log("response");
                console.log(response);
                if(response.status === 'OK' && response.message === 'Token generated'){
                    var order = {...this.state.order}
                    order.tokenData = response.cftoken;
                    this.setState({order, modifyOrder: false, urlCalled: true, urlResponse: response});
                    return
                }
                throw {name:'response not success', message:'response was not successfull \n',response};
            }).catch((err)=>{
                console.log("err caught");
                console.log(err);
            });
        }
        catch(err){
    
        }
    }

    componentDidMount(){
        // this will trigger one rerender
        this.getToken();
    }

    componentWillUpdate(nextProps,nextState){
        console.log("sample component will update");
        console.log("next props:",JSON.stringify(nextProps));
        console.log("next State:", JSON.stringify(nextState));
        console.log("old props:",JSON.stringify(this.props));
        console.log("old state:",JSON.stringify(this.state));
        console.log("===========================");

    }

    componentDidUpdate(){
        if(this.state.modifyOrder){
            console.log("in component did update");
            console.log("why is this getting called so often");
            this.getToken();
        }
    }

    onPress = () => {
        this.setState({count: this.setState.count + 1});
      }

    

    reRender = ()=>{
        const {order} = this.state;
        const orderId =  Math.floor(Math.random() * 1000000)
        const new_order = {...order, orderId};
        this.setState({modifyOrder: true, order: new_order, urlCalled: false});
    }

    render(){
        console.log("sample render is called");
        const {urlResponse, order, testData, eventData, urlCalled} = this.state;
        let decode = "";
        if(testData){
            decode = base64.decode(testData);
        }
        console.log("event data");
        console.log(eventData);
        if(!urlCalled){
            return null;
        }
        return (
            <View style={styles.container}>
            <CashfreePG
            appId={order.appId}
            orderId={order.orderId}
            orderAmount ={order.orderAmount}
            //orderCurrency = "INR"
            orderNote = "This is an order note"
            source = "reactsdk"
            customerName = "John"
            customerEmail = {order.customerEmail}
            customerPhone = "1234561234"
            notifyUrl = ""
            paymentModes = ""
            env = "test"
            card_number= "4111111111111111"
            card_holder=  "Test"
            card_cvv= "123"
            card_expiryMonth="07"
            card_expiryYear="2023"
            
            tokenData = {order.tokenData}
            callback = {(eventData)=>{
                console.log("event data in callback function");
                console.log(eventData);
                this.setState({eventData});
            }}
            //paymentOption = "nb" //nb,card,upi,wallet
            paymentCode = "3333"
            //paymentCode = "4001"
            upi_vpa="testsuccess@gocash"
            />
            <Text>{testData}</Text>
            <Text>{eventData}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={this.onPress}
            >
         <Text> Touch Here for no render </Text>
       </TouchableOpacity>
       <TouchableOpacity
                style={styles.button}
                onPress={this.reRender}
            >
         <Text> Touch Here for re rerender </Text>
       </TouchableOpacity>
            </View>
            );
            
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10
    },
    countContainer: {
      alignItems: 'center',
      padding: 10
    },
    countText: {
      color: '#FF00FF'
    }
  })
/*
<Text>{JSON.stringify(urlResponse)}</Text>
            <Text>==========================================</Text>
            <Text>{JSON.stringify(order)}</Text>
            {this.displayCashFreeForm()}
            <Text>------------------------------------------</Text>
            <Text>{testData}</Text>
            <Text>\\\\\\\\\\\\\\\\\||||||||||||||||||||||||||||||///////////////</Text>
            <Text>{decode}</Text>
            <CashfreePG1></CashfreePG1>
            appId: '275432e3853bd165afbf5272',
*/ 