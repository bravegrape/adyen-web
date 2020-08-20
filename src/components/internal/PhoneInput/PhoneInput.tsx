import { Component, h } from 'preact';
import classNames from 'classnames';
import Field from '../FormFields/Field';
import { renderFormField } from '../FormFields';
import { validatePhoneNumber } from './validate';
import './PhoneInput.scss';
import Language from '../../../language/Language';

interface PhoneInputComponentProps {
    onChange: (state) => void;
    onValid: () => void;
    payButton: () => void;

    selected: string;
    items: [];
    minLength: number;
    prefixName: string;
    phoneName: string;
    showPayButton: boolean;
    isValid: boolean;
    i18n?: Language;
    data?: {
        phonePrefix: string;
        phoneNumber: string;
    };
}

interface PhoneInputState {
    data?: {
        phonePrefix: string;
        phoneNumber: string;
    };
    errors?: {
        phoneNumber?: boolean;
        phonePrefix?: boolean;
    };
    isValid?: boolean;
}

class PhoneInput extends Component<PhoneInputComponentProps, PhoneInputState> {
    constructor(props) {
        super(props);
        this.handlePrefixChange = this.handlePrefixChange.bind(this);
        this.handlePhoneInput = this.handlePhoneInput.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            data: {
                phonePrefix: this.props.selected || this.props.data?.phonePrefix,
                phoneNumber: this.props.data?.phoneNumber || ''
            },
            isValid: !!this.props.data?.phonePrefix && !!this.props.data?.phoneNumber, // check what is the default value
            errors: {}
        };
    }

    public static defaultProps = {
        onChange: () => {},
        onValid: () => {},
        phoneName: 'phoneNumber',
        prefixName: 'phonePrefix',
        selected: null,
        minLength: 3
    };

    public onChange() {
        const isPrefixValid = this.props.items ? !!this.state.data.phonePrefix : true;
        const isPhoneNumberValid = validatePhoneNumber(this.state.data.phoneNumber, this.props.minLength);
        const isValid = isPrefixValid && isPhoneNumberValid;

        /** To mutate the state , use the setState function and pass the property to be updated.
         * short hand operator { isValid: isValid }
         * */
        this.setState({ isValid }, () => {
            this.props.onChange(this.state);
        });
    }

    public handlePhoneInput = e => {
        e.preventDefault();
        const phoneNumber = e.target.value;
        const isPhoneNumberValid = validatePhoneNumber(phoneNumber, this.props.minLength);

        this.setState(
            prevState => ({
                data: { ...prevState.data, phoneNumber },
                errors: { ...prevState.errors, phoneNumber: !isPhoneNumberValid }
            }),

            this.onChange
        );
    };

    public handlePrefixChange = e => {
        e.preventDefault();
        const phonePrefix = e.currentTarget.getAttribute('data-value');
        const isPrefixValid = !!phonePrefix;

        this.setState(
            prevState => ({
                data: { ...prevState.data, phonePrefix },
                ...(isPrefixValid && { errors: { ...prevState.errors, phonePrefix: false } })
            }),
            this.onChange
        );
    };

    public showValidation = () => {
        const isPrefixValid = this.props.items && this.props.items.length ? !!this.state.data.phonePrefix : true;
        const isPhoneNumberValid = validatePhoneNumber(this.state.data.phoneNumber, this.props.minLength);

        this.setState({
            errors: {
                phoneNumber: !isPhoneNumberValid,
                phonePrefix: !isPrefixValid
            }
        });
    };

    render() {
        const showPrefix = !!this.props.items && this.props.items.length;

        return (
            <div className="adyen-checkout__phone-input">
                <Field
                    errorMessage={!!this.state.errors.phoneNumber}
                    label={this.props.i18n.get('telephoneNumber')}
                    className={classNames({
                        'adyen-checkout__input--phone-number': true
                    })}
                    inputWrapperModifiers={['phoneInput']}
                >
                    <div class="adyen-checkout__input-wrapper">
                        <div class="adyen-checkout__input">
                            {!!showPrefix && (
                                <Field inputWrapperModifiers={['phoneInput']}>
                                    {renderFormField('select', {
                                        className: 'adyen-checkout__dropdown--small',
                                        items: this.props.items,
                                        name: this.props.prefixName,
                                        onChange: this.handlePrefixChange,
                                        placeholder: this.props.i18n.get('infix'),
                                        selected: this.state.data.phonePrefix
                                    })}

                                    <div className="phoneNumber">
                                        <div>{this.state.data.phonePrefix}</div>

                                        <input
                                            type="tel"
                                            name={this.props.phoneName}
                                            value={this.state.data.phoneNumber}
                                            onInput={this.handlePhoneInput}
                                            placeholder="123 456 789"
                                            className="adyen-checkout__input adyen-checkout__input--phoneNumber"
                                            autoCorrect="off"
                                        />
                                    </div>
                                </Field>
                            )}
                        </div>
                    </div>
                </Field>
                {this.props.showPayButton && this.props.payButton()}
            </div>
        );
    }
}

export default PhoneInput;