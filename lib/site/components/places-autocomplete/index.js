import React from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

class GPlacesAutocomplete extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: ''
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSelect(address) {
    this.setState({
      address
    })
    geocodeByAddress(address)
      .then((results) => {
        if (results[0]) {
          const addressComponents = results[0].address_components
          addressComponents.forEach((comp) => {
            if (comp.types) {
              comp.types.forEach((type) => {
                if (type === 'administrative_area_level_2') {
                  this.props.onSelect(address, comp.long_name)
                }
              })
            }
          })
        }
      })
      .catch((error) => {
        console.log('Oh no!', error)
      })
  }

  handleChange(address) {
    this.setState({
      address
    })
  }

  render() {
    const cssClasses = {
      root: 'form-group',
      input: 'form-control',
      autocompleteContainer: 'autocomplete-container',
    }

    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="suggestion-item">
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>)

    const inputProps = {
      type: "text",
      value: this.state.address,
      onChange: this.handleChange,
      autoFocus: false,
      placeholder: this.props.placeholder,
      name: this.props.name,
      id: this.props.id
    }

    return (
      <PlacesAutocomplete
        onSelect={this.handleSelect}
        autocompleteItem={AutocompleteItem}
        onEnterKeyDown={this.handleSelect}
        classNames={cssClasses}
        googleLogo={false}
        inputProps={inputProps}
      />
    )
  }
}

export default GPlacesAutocomplete
