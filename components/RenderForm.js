import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import BasicForm from './BasicForm';
import RadioButton from './RadioButton';
import CallCashFree from './CallCashFree';

export default class RenderForm extends Component{
    constructor(props){
        super(props);
        const orderId = String(Math.floor(Math.random() * 10000));
        this.state={
            source: "reactsdk",
            appId: "275432e3853bd165afbf5272",
            orderId: orderId,
            orderAmount: null,
            customerName: null,
            customerPhone: null,
            customerEmail: null,
            paymentOption: null,
            checkoutFields: ["appId", "orderId", "orderAmount", "customerName", "customerPhone", "customerEmail"], 
            //checkoutFields: ["appId"],

            //seamless
            //paymentParams
            payViaCashFree: false,
            eventData: null,


        }
        
    }

    //Input events
    onChange = (field,val) => {
        let obj = {}
        obj[field] = val;
        this.setState({obj});
    }

    onClick = (val) => {
        if(val==="none") val = null;
        if(val === this.state.paymentOption) return;
        this.setState({paymentOption: val});
    }

    onPayment = (eventData) => {
        this.setState({eventData, payViaCashFree: false});
    }


    //payment logic
    verifyCheckoutForm = () => {

    }

    payViaCashFree = (event) => {
        console.log("pay via cashfree hit");
        console.log(event);
        console.log(event.nativeEvent);
        this.setState({payViaCashFree: true});
    } 

    //rendering logic
    renderForm = () => {
        const {checkoutFields} = this.state;
        let stateObj = {...this.state};
        delete stateObj.checkoutFields;
        return <BasicForm fields={checkoutFields} parentState={stateObj} onChange={this.onChange} />
    }

    renderPaymentOptions = () => {
        //to add payment options card,nb,wallet,upi
        const paymentOptions = ["card","nb","wallet","upi","none"];
        let checkedOption = this.state.paymentOption;
        if(checkedOption === null) checkedOption = "none";
        let optionButtons = [];
        for(paymentOption of paymentOptions){
            if(paymentOption === checkedOption){
                optionButtons.push(<RadioButton key={paymentOption} value={paymentOption} checked={true} onClick={this.onClick}/>);
            }
            else{
                optionButtons.push(<RadioButton key={paymentOption} value={paymentOption} checked={false} onClick={this.onClick}/>);
            }
        }
        return(
            <View style={styles.paymentOptionsContainer}>
                {optionButtons}
            </View>
        );
    }

    renderPaymentOptionForm = () =>{
        const {paymentOption} = this.state;

        if(!paymentOption) return null;

        let stateObj = {...this.state};
        delete stateObj.checkoutFields;
        switch(paymentOption){
            case "card": {
                const fields = ["card_number", "card_holder", "card_cvv", "card_expiryMonth", "card_expiryYear"]
                return <BasicForm fields={fields} parentState={stateObj} onChange={this.onChange} />
            }
            case "nb": {
                const fields = ["paymentCode"];
                return <BasicForm fields={fields} parentState={stateObj} onChange={this.onChange} />
            }
            case "wallet": {
                const fields = ["paymentCode"];
                return <BasicForm fields={fields} parentState={stateObj} onChange={this.onChange} />
            }
            case "upi": {
                const fields = ["upi_vpa"];
                return <BasicForm fields={fields} parentState={stateObj} onChange={this.onChange} />
            }
        }

        return null;
    }

    renderPaymentButton = () => {
        return (<TouchableOpacity
        style={styles.button}
        onPress={this.payViaCashFree}>
        <Text> pay </Text>
        </TouchableOpacity>)
    }

    callCashFree = () => {
        const {payViaCashFree} = this.state;
        if(!payViaCashFree) return null;

        // get and clean state
        let stateObj = {...this.state};
        delete stateObj.checkoutFields;
        delete stateObj.payViaCashFree;
        delete stateObj.eventData;

        return <CallCashFree stateObj={stateObj} onPayment={this.onPayment}/>

    }

    render(){
        return (
            <View style={styles.container}>
            {this.renderForm()}
            {this.renderPaymentOptionForm()}
            {this.renderPaymentOptions()}
            {this.renderPaymentButton()}
            {this.callCashFree()}
            </View>
            );
    }


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#111517',
      // justifyContent: 'center',
      paddingHorizontal: 10,
      paddingTop: 40,

    },
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10,
      margin: 10,
      borderRadius: 30,
    },
    paymentOptionsContainer:{
        flexWrap: 'wrap', 
        alignItems: 'flex-start',
        flexDirection:'row',
    }
  })