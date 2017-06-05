import React from 'react';

/**
 * Game load form class.
 */
export default class LoadForm extends React.Component {
    /**
     * Component constructor. Preparing default state.
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Input change handler.
     *
     * @param event
     */
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    /**
     * Form submit handler.
     *
     * @param event
     */
    handleSubmit(event) {
        this.props.handleLoad(this.state.value);
        event.preventDefault();
    }

    /**
     * Render the component.
     *
     * @returns {XML}
     */
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Code:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Load" />
            </form>
        );
    }
}