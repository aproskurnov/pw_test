import * as React from "react";

import "./Input.scss"

import Autosuggest, {
    ChangeEvent,
    GetSuggestionValue,
    SuggestionsFetchRequestedParams
} from 'react-autosuggest';
import options from "../../options";


interface IInputProps {
    placeholder?:string,
    type?:string,
    name?:string,
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    onBlur?:(e:React.FocusEvent<HTMLInputElement>)=>void,
    onKeyDown?:(e:React.KeyboardEvent<HTMLInputElement>)=>void,
    defaultValue?:number,
    value?:string,
    centered?:boolean,
    numbers?:boolean,
    suggest?:boolean,
    autoComplete?:"on"|"off",
    setFieldValue?:any,
    leadingZero?:boolean
}

interface InputState {
    suggestions: ISuggestion[],
    isLoading: boolean
}

interface ISuggestion {
    id: number,
    name: string
}


export class Input extends React.Component<IInputProps, InputState> {
    private latestRequest:Promise<void>;
    constructor(props:IInputProps) {
        super(props);

        this.state = {
            suggestions: [],
            isLoading: false
        };

        this.latestRequest = null;

        this.handleChange = this.handleChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);

    }
    static defaultProps = {
        type:"text",
        centered: false,
        suggest: false,
        leadingZero: false
    };
    onChange = (event:React.ChangeEvent<HTMLInputElement>, e: ChangeEvent) => {
        this.props.setFieldValue(this.props.name, e.newValue);
    };

    loadSuggestions(value:string) {

        this.setState({
            isLoading: true
        });

        let baseUrl = options.baseUrl;
        let url = new URL(baseUrl + '/api/protected/users/list');
        let token = localStorage.getItem('token');
        const thisRequest = this.latestRequest = fetch(url.toString(), {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify({filter:value}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then((response)=>{
                if (response.status === 200){
                    return response.json();
                }else{
                    return response.text();
                }

            })
            .then((data:ISuggestion[]|string)=>{
                if (Array.isArray(data)){
                    if(thisRequest !== this.latestRequest) {
                        return;
                    }

                    this.setState({
                        suggestions: data,
                        isLoading: false
                    });
                }
            }).catch(()=> {
        });

    }

    handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        let value = "";
        if (this.props.type === "number"){
            value = (+(e.target.value)).toString();
            this.props.setFieldValue(this.props.name, value);
        }else{
            if (this.props.onChange){
                this.props.onChange(e);
            }
        }

    };
    onSuggestionsFetchRequested(req:SuggestionsFetchRequestedParams){
        this.loadSuggestions(req.value);
    };
    onSuggestionsClearRequested(){
        this.setState({
            suggestions: []
        });
    };

    getSuggestionValue:GetSuggestionValue<ISuggestion> = (suggestion: ISuggestion) => {
        return suggestion.name;
    };

    renderSuggestion(suggestion: ISuggestion) {
        return (
            <span>{suggestion.name}</span>
        );
    }
    renderSuggest(){

        const { suggestions } = this.state;
        const inputProps = {
            placeholder: this.props.placeholder,
            value:this.props.value,
            name:this.props.name,
            onChange: this.onChange,
            onBlur: this.props.onBlur
        };

        if(this.props.suggest){
            return (
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            );
        }else{
            return (
                <input className={"input__field" + (this.props.centered ? " input__field_centered" : "")}
                       onKeyDown={this.props.onKeyDown}
                       onChange={this.handleChange}
                       onBlur={this.props.onBlur}
                       value={this.props.value}
                       defaultValue={this.props.defaultValue}
                       name={this.props.name}
                       type={this.props.type}
                       placeholder={this.props.placeholder}
                       autoComplete={this.props.autoComplete}
                />

            );
        }
    }
    render() {
        return (
            <div className={"input"}>
                {this.renderSuggest()}
            </div>
        );
    }
}